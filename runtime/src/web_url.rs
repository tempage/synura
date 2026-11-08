//! Native URLSearchParams with live iterators and bounded native storage.
use super::web_encoding::{coerce_string, usv_string};
use rquickjs::{
    atom::PredefinedAtom,
    class::{JsClass, Readable, Trace, Tracer},
    function::{Constructor, Opt, This},
    object::{Accessor, Property},
    Array, Atom, Class, Ctx, Error, Exception, Function, IntoJs, JsLifetime, Object, Result, Value,
};
use std::{
    cell::{Cell, RefCell},
    rc::Rc,
};

const MAX_PAIRS: usize = 65_536;
const MAX_BYTES: usize = 16 * 1024 * 1024;
struct Budget(Rc<Cell<usize>>);
unsafe impl<'js> JsLifetime<'js> for Budget {
    type Changed<'to> = Self;
}
struct Pairs {
    values: RefCell<Vec<(String, String)>>,
    bytes: Cell<usize>,
    budget: Rc<Cell<usize>>,
}
impl Pairs {
    fn replace(&self, ctx: &Ctx<'_>, mut values: Vec<(String, String)>) -> Result<()> {
        values.shrink_to_fit();
        let bytes = size(&values);
        let total = self
            .budget
            .get()
            .saturating_sub(self.bytes.get())
            .saturating_add(bytes);
        if values.len() > MAX_PAIRS || total > MAX_BYTES {
            return Err(Exception::throw_range(
                ctx,
                "URLSearchParams storage limit exceeded",
            ));
        }
        *self.values.borrow_mut() = values;
        self.bytes.set(bytes);
        self.budget.set(total);
        Ok(())
    }
}
impl Drop for Pairs {
    fn drop(&mut self) {
        self.budget
            .set(self.budget.get().saturating_sub(self.bytes.get()));
    }
}
fn size(values: &Vec<(String, String)>) -> usize {
    values.iter().fold(
        values
            .capacity()
            .saturating_mul(std::mem::size_of::<(String, String)>()),
        |n, (k, v)| {
            n.saturating_add(16)
                .saturating_add(k.capacity())
                .saturating_add(v.capacity())
        },
    )
}
// Charge builders before resuming user iterators/getters. Failed construction
// releases the reservation, and nested constructors share the same budget.
struct Reservation {
    budget: Rc<Cell<usize>>,
    bytes: usize,
}
impl Reservation {
    fn charge(&mut self, ctx: &Ctx<'_>, bytes: usize) -> Result<()> {
        let total = self
            .budget
            .get()
            .saturating_sub(self.bytes)
            .saturating_add(bytes);
        if total > MAX_BYTES {
            return Err(Exception::throw_range(
                ctx,
                "URLSearchParams storage limit exceeded",
            ));
        }
        self.budget.set(total);
        self.bytes = bytes;
        Ok(())
    }
}
impl Drop for Reservation {
    fn drop(&mut self) {
        self.budget
            .set(self.budget.get().saturating_sub(self.bytes));
    }
}
fn pair_strings<'js>(
    ctx: &Ctx<'js>,
    key: &Value<'js>,
    value: &Value<'js>,
) -> Result<(String, String)> {
    let key = coerce_string(ctx, key)?;
    let value = coerce_string(ctx, value)?;
    Ok((usv_string(ctx, &key)?, usv_string(ctx, &value)?))
}
struct SearchParams(Rc<Pairs>);
impl<'js> Trace<'js> for SearchParams {
    fn trace<'a>(&self, _: Tracer<'a, 'js>) {}
}
unsafe impl<'js> JsLifetime<'js> for SearchParams {
    type Changed<'to> = Self;
}

fn parse<'js>(
    ctx: &Ctx<'js>,
    input: Option<Value<'js>>,
    reservation: &mut Reservation,
) -> Result<Vec<(String, String)>> {
    let Some(input) = input.filter(|v| !v.is_null() && !v.is_undefined()) else {
        return Ok(Vec::new());
    };
    let mut pairs = Vec::new();
    let mut strings_bytes = 0usize;
    let mut push = |key: String, value: String| -> Result<()> {
        if pairs.len() >= MAX_PAIRS {
            return Err(Exception::throw_range(
                ctx,
                "URLSearchParams storage limit exceeded",
            ));
        }
        strings_bytes = strings_bytes
            .saturating_add(16)
            .saturating_add(key.capacity())
            .saturating_add(value.capacity());
        pairs.push((key, value));
        reservation.charge(
            ctx,
            strings_bytes.saturating_add(
                pairs
                    .capacity()
                    .saturating_mul(std::mem::size_of::<(String, String)>()),
            ),
        )?;
        Ok(())
    };
    if let Some(object) = input.as_object() {
        let iterator: Value = object.get(PredefinedAtom::SymbolIterator)?;
        if !iterator.is_null() && !iterator.is_undefined() {
            if !iterator.is_function() {
                return Err(Exception::throw_type(ctx, "Expected an iterable"));
            }
            let iterator: Object = iterator
                .into_function()
                .unwrap()
                .call((This(object.clone()),))?;
            let next: Function = iterator.get("next")?;
            loop {
                let result: Object = next.call((This(iterator.clone()),))?;
                if result.get::<_, rquickjs::Coerced<bool>>("done")?.0 {
                    break;
                }
                let pair: Value = result.get("value")?;
                // Web IDL sequences accept primitive iterable strings too.
                let pair = unsafe {
                    let raw = rquickjs::qjs::JS_ToObject(ctx.as_raw().as_ptr(), pair.as_raw());
                    if rquickjs::qjs::JS_IsException(raw) {
                        return Err(Error::Exception);
                    }
                    Value::from_raw(ctx.clone(), raw)
                };
                let pair_object = pair.as_object().expect("boxed iterable pair");
                let method: Value = pair_object.get(PredefinedAtom::SymbolIterator)?;
                let method = method
                    .into_function()
                    .ok_or_else(|| Exception::throw_type(ctx, "Expected an iterable pair"))?;
                let pair_iterator: Object = method.call((This(pair.clone()),))?;
                let next: Function = pair_iterator.get("next")?;
                let read = || -> Result<Option<Value<'js>>> {
                    let entry: Object = next.call((This(pair_iterator.clone()),))?;
                    if entry.get::<_, rquickjs::Coerced<bool>>("done")?.0 {
                        Ok(None)
                    } else {
                        Ok(Some(entry.get("value")?))
                    }
                };
                let key = read()?
                    .ok_or_else(|| Exception::throw_type(ctx, "Expected exactly two items"))?;
                let value = read()?
                    .ok_or_else(|| Exception::throw_type(ctx, "Expected exactly two items"))?;
                if read()?.is_some() {
                    return Err(Exception::throw_type(ctx, "Expected exactly two items"));
                }
                let (key, value) = pair_strings(ctx, &key, &value)?;
                push(key, value)?;
            }
        } else {
            for key in object.keys::<Atom>() {
                let key = key?;
                let value: Value = object.get(key.clone())?;
                let (key, value) = pair_strings(ctx, &key.to_value()?, &value)?;
                push(key, value)?;
            }
        }
    } else {
        let source = usv_string(ctx, &input)?;
        let source = source.strip_prefix('?').unwrap_or(&source);
        for (key, value) in url::form_urlencoded::parse(source.as_bytes()) {
            push(key.into_owned(), value.into_owned())?;
        }
    }
    Ok(pairs)
}

fn serialize(pairs: &Pairs) -> String {
    url::form_urlencoded::Serializer::new(String::new())
        .extend_pairs(pairs.values.borrow().iter().map(|(k, v)| (k, v)))
        .finish()
}
pub(super) fn body_form(value: &Value<'_>) -> Result<Option<String>> {
    if let Some(class) = value
        .as_object()
        .and_then(|object| object.as_class::<SearchParams>())
    {
        Ok(Some(serialize(&class.borrow().0)))
    } else {
        Ok(None)
    }
}
pub(super) fn install(ctx: &Ctx<'_>) -> Result<()> {
    ctx.store_userdata(Budget(Rc::new(Cell::new(0))))
        .map_err(|_| Exception::throw_type(ctx, "URLSearchParams budget unavailable"))?;
    Class::<SearchParams>::define(&ctx.globals())
}
pub(super) fn shutdown(ctx: &Ctx<'_>) {
    let _ = ctx.remove_userdata::<Budget>();
}

impl<'js> JsClass<'js> for SearchParams {
    const NAME: &'static str = "URLSearchParams";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(Some(Constructor::new_class::<Self, _, _>(
            ctx.clone(),
            |ctx: Ctx<'js>, init: Opt<Value<'js>>| {
                let budget = ctx
                    .userdata::<Budget>()
                    .ok_or_else(|| {
                        Exception::throw_type(&ctx, "URLSearchParams budget unavailable")
                    })?
                    .0
                    .clone();
                let mut reservation = Reservation {
                    budget: budget.clone(),
                    bytes: 0,
                };
                let values = parse(&ctx, init.0, &mut reservation)?;
                let pairs = Rc::new(Pairs {
                    values: RefCell::new(values),
                    bytes: Cell::new(reservation.bytes),
                    budget,
                });
                reservation.bytes = 0;
                Class::instance(ctx, Self(pairs))
            },
        )?))
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = Object::new(ctx.clone())?;
        proto.prop(
            "size",
            Accessor::from(|this: This<Class<'js, Self>>| this.0.borrow().0.values.borrow().len()),
        )?;
        proto.set(
            "toString",
            Function::new(ctx.clone(), |this: This<Class<'js, Self>>| {
                serialize(&this.0.borrow().0)
            })?,
        )?;
        proto.set(
            "append",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 name: Value<'js>,
                 value: Value<'js>| {
                    let pair = pair_strings(&ctx, &name, &value)?;
                    let data = this.0.borrow().0.clone();
                    let mut pairs = data.values.borrow().clone();
                    pairs.push(pair);
                    data.replace(&ctx, pairs)
                },
            )?,
        )?;
        proto.set(
            "set",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 name: Value<'js>,
                 value: Value<'js>| {
                    let (name, value) = pair_strings(&ctx, &name, &value)?;
                    let data = this.0.borrow().0.clone();
                    let mut pairs = data.values.borrow().clone();
                    if let Some(index) = pairs.iter().position(|(k, _)| *k == name) {
                        pairs[index].1 = value;
                        let mut seen = false;
                        pairs.retain(|(k, _)| {
                            if *k != name {
                                return true;
                            }
                            let keep = !seen;
                            seen = true;
                            keep
                        });
                    } else {
                        pairs.push((name, value));
                    }
                    data.replace(&ctx, pairs)
                },
            )?,
        )?;
        proto.set(
            "delete",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 name: Value<'js>,
                 value: Opt<Value<'js>>| {
                    let name = coerce_string(&ctx, &name)?;
                    let value = value
                        .0
                        .filter(|v| !v.is_undefined())
                        .map(|v| coerce_string(&ctx, &v))
                        .transpose()?;
                    let name = usv_string(&ctx, &name)?;
                    let value = value.map(|v| usv_string(&ctx, &v)).transpose()?;
                    let data = this.0.borrow().0.clone();
                    let mut pairs = data.values.borrow().clone();
                    pairs.retain(|(k, v)| {
                        *k != name || value.as_ref().is_some_and(|expected| v != expected)
                    });
                    data.replace(&ctx, pairs)
                },
            )?,
        )?;
        proto.set(
            "get",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 name: Value<'js>|
                 -> Result<Value<'js>> {
                    let name = usv_string(&ctx, &name)?;
                    let data = this.0.borrow().0.clone();
                    let result = data
                        .values
                        .borrow()
                        .iter()
                        .find(|(k, _)| *k == name)
                        .map(|(_, v)| v.clone());
                    match result {
                        Some(value) => value.into_js(&ctx),
                        None => Ok(Value::new_null(ctx)),
                    }
                },
            )?,
        )?;
        proto.set(
            "getAll",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 name: Value<'js>|
                 -> Result<Array<'js>> {
                    let name = usv_string(&ctx, &name)?;
                    let data = this.0.borrow().0.clone();
                    let values: Vec<String> = data
                        .values
                        .borrow()
                        .iter()
                        .filter(|(key, _)| *key == name)
                        .map(|(_, value)| value.clone())
                        .collect();
                    let result = Array::new(ctx)?;
                    for (index, value) in values.into_iter().enumerate() {
                        result.as_object().prop(
                            index as u32,
                            Property::from(value).writable().enumerable().configurable(),
                        )?;
                    }
                    Ok(result)
                },
            )?,
        )?;
        proto.set(
            "has",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 name: Value<'js>,
                 value: Opt<Value<'js>>|
                 -> Result<bool> {
                    let name = coerce_string(&ctx, &name)?;
                    let value = value
                        .0
                        .filter(|v| !v.is_undefined())
                        .map(|v| coerce_string(&ctx, &v))
                        .transpose()?;
                    let name = usv_string(&ctx, &name)?;
                    let value = value.map(|v| usv_string(&ctx, &v)).transpose()?;
                    Ok(this.0.borrow().0.values.borrow().iter().any(|(k, v)| {
                        *k == name && value.as_ref().is_none_or(|expected| v == expected)
                    }))
                },
            )?,
        )?;
        proto.set(
            "sort",
            Function::new(ctx.clone(), |this: This<Class<'js, Self>>| {
                this.0
                    .borrow()
                    .0
                    .values
                    .borrow_mut()
                    .sort_by(|(a, _), (b, _)| a.encode_utf16().cmp(b.encode_utf16()));
            })?,
        )?;
        for (name, kind) in [("entries", 0), ("keys", 1), ("values", 2)] {
            let function = Function::new(
                ctx.clone(),
                move |ctx: Ctx<'js>, this: This<Class<'js, Self>>| {
                    Class::instance(
                        ctx,
                        SearchIterator {
                            pairs: this.0.borrow().0.clone(),
                            index: Cell::new(0),
                            kind,
                            exhausted: Cell::new(false),
                        },
                    )
                },
            )?;
            if kind == 0 {
                proto.set(PredefinedAtom::SymbolIterator, function.clone())?;
            }
            proto.set(name, function)?;
        }
        proto.set(
            "forEach",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 callback: Function<'js>,
                 this_arg: Opt<Value<'js>>|
                 -> Result<()> {
                    let data = this.0.borrow().0.clone();
                    let mut index = 0;
                    loop {
                        let pair = data.values.borrow().get(index).cloned();
                        let Some((key, value)) = pair else {
                            break;
                        };
                        if index >= MAX_PAIRS {
                            return Err(Exception::throw_range(
                                &ctx,
                                "URLSearchParams iteration limit exceeded",
                            ));
                        }
                        callback.call::<_, ()>((
                            This(
                                this_arg
                                    .0
                                    .clone()
                                    .unwrap_or_else(|| Value::new_undefined(ctx.clone())),
                            ),
                            value,
                            key,
                            this.0.clone(),
                        ))?;
                        index += 1;
                    }
                    Ok(())
                },
            )?,
        )?;
        proto.set(PredefinedAtom::SymbolToStringTag, "URLSearchParams")?;
        Ok(Some(proto))
    }
}

struct SearchIterator {
    pairs: Rc<Pairs>,
    index: Cell<usize>,
    kind: u8,
    exhausted: Cell<bool>,
}
impl<'js> Trace<'js> for SearchIterator {
    fn trace<'a>(&self, _: Tracer<'a, 'js>) {}
}
unsafe impl<'js> JsLifetime<'js> for SearchIterator {
    type Changed<'to> = Self;
}
impl<'js> JsClass<'js> for SearchIterator {
    const NAME: &'static str = "URLSearchParamsIterator";
    type Mutable = Readable;
    fn constructor(_: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(None)
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = Object::new(ctx.clone())?;
        proto.set(
            PredefinedAtom::SymbolIterator,
            Function::new(ctx.clone(), |this: This<Class<'js, Self>>| this.0)?,
        )?;
        proto.set(
            "next",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Self>>| -> Result<Object<'js>> {
                    let iterator = this.0.borrow();
                    let pair = if iterator.exhausted.get() {
                        None
                    } else {
                        iterator
                            .pairs
                            .values
                            .borrow()
                            .get(iterator.index.get())
                            .cloned()
                    };
                    let result = Object::new(ctx.clone())?;
                    result.prop(
                        "done",
                        Property::from(pair.is_none())
                            .writable()
                            .enumerable()
                            .configurable(),
                    )?;
                    let value = if let Some((key, value)) = pair {
                        iterator.index.set(iterator.index.get() + 1);
                        match iterator.kind {
                            1 => key.into_js(&ctx)?,
                            2 => value.into_js(&ctx)?,
                            _ => {
                                let entry = Array::new(ctx.clone())?;
                                entry.as_object().prop(
                                    "0",
                                    Property::from(key).writable().enumerable().configurable(),
                                )?;
                                entry.as_object().prop(
                                    "1",
                                    Property::from(value).writable().enumerable().configurable(),
                                )?;
                                entry.into_value()
                            }
                        }
                    } else {
                        iterator.exhausted.set(true);
                        Value::new_undefined(ctx.clone())
                    };
                    result.prop(
                        "value",
                        Property::from(value).writable().enumerable().configurable(),
                    )?;
                    Ok(result)
                },
            )?,
        )?;
        Ok(Some(proto))
    }
}
