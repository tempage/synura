use super::*;
use std::rc::Rc;

const HEADER_LIMIT: usize = 64 * 1024;
const VM_HEADER_LIMIT: usize = 16 * 1024 * 1024;
struct HeaderBudget(Rc<Cell<usize>>);
unsafe impl<'js> JsLifetime<'js> for HeaderBudget {
    type Changed<'to> = Self;
}

// Hold a budget reservation across user coercions, before data is committed.
struct TemporaryHeaderAllocation {
    budget: Rc<Cell<usize>>,
    bytes: usize,
}
impl TemporaryHeaderAllocation {
    fn new(ctx: &Ctx<'_>, budget: Rc<Cell<usize>>, bytes: usize) -> Result<Self> {
        if bytes > HEADER_LIMIT || budget.get().saturating_add(bytes) > VM_HEADER_LIMIT {
            return Err(Exception::throw_range(ctx, "Headers exceed VM limit"));
        }
        budget.set(budget.get() + bytes);
        Ok(Self { budget, bytes })
    }
}
impl Drop for TemporaryHeaderAllocation {
    fn drop(&mut self) {
        self.budget
            .set(self.budget.get().saturating_sub(self.bytes));
    }
}
pub(super) struct Headers {
    pairs: RefCell<Vec<(String, String)>>,
    pub(super) immutable: Cell<bool>,
    budget: Rc<Cell<usize>>,
    bytes: Cell<usize>,
}
impl Drop for Headers {
    fn drop(&mut self) {
        self.budget
            .set(self.budget.get().saturating_sub(self.bytes.get()));
    }
}
impl<'js> Trace<'js> for Headers {
    fn trace<'a>(&self, _: Tracer<'a, 'js>) {}
}
unsafe impl<'js> JsLifetime<'js> for Headers {
    type Changed<'to> = Self;
}
impl Headers {
    fn new(ctx: &Ctx<'_>) -> Self {
        let budget = ctx
            .userdata::<HeaderBudget>()
            .expect("installed header budget")
            .0
            .clone();
        Self {
            pairs: RefCell::new(Vec::new()),
            immutable: Cell::new(false),
            budget,
            bytes: Cell::new(0),
        }
    }
    pub(super) fn pairs(&self) -> Vec<(String, String)> {
        self.pairs.borrow().clone()
    }
    pub(super) fn get(&self, name: &str) -> Option<String> {
        let values: Vec<_> = self
            .pairs
            .borrow()
            .iter()
            .filter(|(key, _)| key == name)
            .map(|(_, value)| value.clone())
            .collect();
        (!values.is_empty()).then(|| values.join(", "))
    }
    fn replace(&self, ctx: &Ctx<'_>, mut pairs: Vec<(String, String)>) -> Result<()> {
        if self.immutable.get() {
            return Err(type_error(ctx, "Headers are immutable"));
        }
        pairs.shrink_to_fit();
        let bytes = pairs.capacity() * std::mem::size_of::<(String, String)>()
            + pairs
                .iter()
                .map(|(a, b)| a.capacity() + b.capacity() + 16)
                .sum::<usize>();
        let total = self
            .budget
            .get()
            .saturating_sub(self.bytes.get())
            .saturating_add(bytes);
        if bytes > HEADER_LIMIT || total > VM_HEADER_LIMIT {
            return Err(Exception::throw_range(ctx, "Headers exceed VM limit"));
        }
        self.budget.set(total);
        self.bytes.set(bytes);
        *self.pairs.borrow_mut() = pairs;
        Ok(())
    }
    pub(super) fn append(&self, ctx: &Ctx<'_>, name: String, value: String) -> Result<()> {
        let mut pairs = self.pairs();
        pairs.push((name, value));
        self.replace(ctx, pairs)
    }
    pub(super) fn set(&self, ctx: &Ctx<'_>, name: String, value: String) -> Result<()> {
        let mut pairs = self.pairs();
        let first = pairs.iter().position(|(key, _)| *key == name);
        pairs.retain(|(key, _)| *key != name);
        let position = first.unwrap_or(pairs.len()).min(pairs.len());
        pairs.insert(position, (name, value));
        self.replace(ctx, pairs)
    }
    fn sorted(&self) -> Vec<(String, String)> {
        let pairs = self.pairs.borrow();
        let mut names: Vec<_> = pairs.iter().map(|(key, _)| key.clone()).collect();
        names.sort();
        names.dedup();
        let mut sorted = Vec::new();
        for name in names {
            let values: Vec<_> = pairs
                .iter()
                .filter(|(key, _)| *key == name)
                .map(|(_, value)| value.clone())
                .collect();
            if name == "set-cookie" {
                sorted.extend(values.into_iter().map(|value| (name.clone(), value)));
            } else {
                sorted.push((name, values.join(", ")));
            }
        }
        sorted
    }
}
pub(super) fn name<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<String> {
    let text = byte_string(ctx, value)?;
    if text.is_empty()
        || !text
            .bytes()
            .all(|c| c.is_ascii_alphanumeric() || b"!#$%&'*+.^_`|~-".contains(&c))
    {
        return Err(type_error(ctx, "Invalid header name"));
    }
    Ok(text.to_ascii_lowercase())
}
fn value<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<String> {
    let text = byte_string(ctx, value)?;
    let text = text.trim_matches(['\t', ' ']);
    if text.contains(['\0', '\r', '\n']) {
        return Err(type_error(ctx, "Invalid header value"));
    }
    Ok(text.into())
}
pub(super) fn create<'js>(ctx: &Ctx<'js>, init: Value<'js>) -> Result<Class<'js, Headers>> {
    let headers = Class::instance(ctx.clone(), Headers::new(ctx))?;
    if init.is_undefined() {
        return Ok(headers);
    }
    if init.is_null() {
        return Err(type_error(ctx, "Expected HeadersInit"));
    }
    if let Some(existing) = init
        .as_object()
        .and_then(|object| object.as_class::<Headers>())
    {
        headers.borrow().replace(ctx, existing.borrow().pairs())?;
        return Ok(headers);
    }
    if has_iterator(&init)? {
        for_each_sequence(ctx, init, 65536, |pair| {
            let pair = pair_sequence(ctx, pair)?;
            let key = name(ctx, pair[0].clone())?;
            let reservation = TemporaryHeaderAllocation::new(
                ctx,
                headers.borrow().budget.clone(),
                key.capacity() + 64,
            )?;
            let val = value(ctx, pair[1].clone())?;
            drop(reservation);
            headers.borrow().append(ctx, key, val)?;
            Ok(true)
        })?;
    } else {
        let object = init
            .into_object()
            .ok_or_else(|| type_error(ctx, "Expected HeadersInit"))?;
        for key in object.keys::<String>() {
            let key = key?;
            let reservation = TemporaryHeaderAllocation::new(
                ctx,
                headers.borrow().budget.clone(),
                key.capacity().saturating_mul(2) + 64,
            )?;
            let val: Value = object.get(key.as_str())?;
            let key = name(ctx, key.into_js(ctx)?)?;
            let val = value(ctx, val)?;
            drop(reservation);
            headers.borrow().append(ctx, key, val)?;
        }
    }
    Ok(headers)
}
pub(super) fn from_pairs<'js>(
    ctx: &Ctx<'js>,
    pairs: Vec<(String, String)>,
    immutable: bool,
) -> Result<Class<'js, Headers>> {
    let headers = Class::instance(ctx.clone(), Headers::new(ctx))?;
    headers.borrow().replace(ctx, pairs)?;
    headers.borrow().immutable.set(immutable);
    Ok(headers)
}
impl<'js> JsClass<'js> for Headers {
    const NAME: &'static str = "Headers";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(Some(Constructor::new_class::<Self, _, _>(
            ctx.clone(),
            |ctx: Ctx<'js>, args: Rest<Value<'js>>| create(&ctx, arg(&ctx, &args, 0)),
        )?))
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = prototype(ctx, Self::NAME)?;
        for (method, count) in [
            ("append", 2),
            ("set", 2),
            ("delete", 1),
            ("get", 1),
            ("has", 1),
            ("getSetCookie", 0),
        ] {
            proto.set(
                method,
                Function::new(
                    ctx.clone(),
                    move |ctx: Ctx<'js>,
                          this: This<Class<'js, Headers>>,
                          args: Rest<Value<'js>>|
                          -> Result<Value<'js>> {
                        required(&ctx, &args, count)?;
                        if method == "getSetCookie" {
                            let values = this
                                .0
                                .borrow()
                                .pairs()
                                .into_iter()
                                .filter(|(key, _)| key == "set-cookie")
                                .map(|(_, value)| value.into_js(&ctx))
                                .collect::<Result<Vec<_>>>()?;
                            return array(&ctx, values)?.into_js(&ctx);
                        }
                        let key = name(&ctx, args[0].clone())?;
                        match method {
                            "append" | "set" => {
                                let reservation = TemporaryHeaderAllocation::new(
                                    &ctx,
                                    this.0.borrow().budget.clone(),
                                    key.capacity() + 64,
                                )?;
                                let val = value(&ctx, args[1].clone())?;
                                drop(reservation);
                                if method == "append" {
                                    this.0.borrow().append(&ctx, key, val)?;
                                } else {
                                    this.0.borrow().set(&ctx, key, val)?;
                                }
                            }
                            "delete" => {
                                let mut pairs = this.0.borrow().pairs();
                                pairs.retain(|(name, _)| *name != key);
                                this.0.borrow().replace(&ctx, pairs)?;
                            }
                            "get" => {
                                return match this.0.borrow().get(&key) {
                                    Some(value) => value.into_js(&ctx),
                                    None => Ok(Value::new_null(ctx.clone())),
                                }
                            }
                            "has" => return this.0.borrow().get(&key).is_some().into_js(&ctx),
                            _ => unreachable!(),
                        }
                        Ok(Value::new_undefined(ctx))
                    },
                )?,
            )?;
        }
        for (name, kind) in [("entries", 0), ("keys", 1), ("values", 2)] {
            proto.set(
                name,
                Function::new(
                    ctx.clone(),
                    move |ctx: Ctx<'js>, this: This<Class<'js, Headers>>| {
                        Class::instance(
                            ctx,
                            HeaderIterator {
                                headers: this.0,
                                index: Cell::new(0),
                                kind,
                            },
                        )
                    },
                )?,
            )?;
        }
        proto.set(
            PredefinedAtom::SymbolIterator,
            proto.get::<_, Function>("entries")?,
        )?;
        proto.set(
            "forEach",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Headers>>,
                 callback: Function<'js>,
                 args: Rest<Value<'js>>|
                 -> Result<()> {
                    let this_arg = arg(&ctx, &args, 0);
                    let mut index = 0;
                    loop {
                        let entry = this.0.borrow().sorted().get(index).cloned();
                        let Some((name, value)) = entry else { break };
                        index += 1;
                        callback.call::<_, ()>((
                            This(this_arg.clone()),
                            value,
                            name,
                            this.0.clone(),
                        ))?;
                    }
                    Ok(())
                },
            )?,
        )?;
        Ok(Some(proto))
    }
}
struct HeaderIterator<'js> {
    headers: Class<'js, Headers>,
    index: Cell<usize>,
    kind: u8,
}
impl<'js> Trace<'js> for HeaderIterator<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.headers.trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for HeaderIterator<'js> {
    type Changed<'to> = HeaderIterator<'to>;
}
impl<'js> JsClass<'js> for HeaderIterator<'js> {
    const NAME: &'static str = "Headers Iterator";
    type Mutable = Readable;
    fn constructor(_: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(None)
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = prototype(ctx, Self::NAME)?;
        proto.set(
            PredefinedAtom::SymbolIterator,
            Function::new(ctx.clone(), |this: This<Value<'js>>| this.0)?,
        )?;
        proto.set(
            "next",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, HeaderIterator<'js>>>|
                 -> Result<Object<'js>> {
                    let state = this.0.borrow();
                    let entry = state
                        .headers
                        .borrow()
                        .sorted()
                        .get(state.index.get())
                        .cloned();
                    let result = Object::new(ctx.clone())?;
                    own_property(&result, "done", entry.is_none().into_js(&ctx)?)?;
                    if let Some((key, value)) = entry {
                        state.index.set(state.index.get() + 1);
                        let value = match state.kind {
                            1 => key.into_js(&ctx)?,
                            2 => value.into_js(&ctx)?,
                            _ => array(&ctx, [key.into_js(&ctx)?, value.into_js(&ctx)?])?
                                .into_js(&ctx)?,
                        };
                        own_property(&result, "value", value)?;
                    }
                    Ok(result)
                },
            )?,
        )?;
        Ok(Some(proto))
    }
}
pub(super) fn install(ctx: &Ctx<'_>) -> Result<()> {
    ctx.store_userdata(HeaderBudget(Rc::new(Cell::new(0))))
        .map_err(|_| type_error(ctx, "Header budget unavailable"))?;
    Class::<Headers>::define(&ctx.globals())
}
