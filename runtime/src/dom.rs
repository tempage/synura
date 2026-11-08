//! VM-local, bounded DOM bindings implemented by native QuickJS classes.
//!
//! Native tree storage contains no JavaScript values. Wrapper identity is held
//! in a per-document traced JavaScript cache. Collecting its wrappers releases
//! the native document and its quota; a reusable parser does not retain trees.
use kuchiki::{traits::TendrilSink, NodeData, NodeRef};
use rquickjs::{
    class::{JsClass, Readable, Trace, Tracer},
    function::{Constructor, Opt, Rest, This},
    object::Accessor,
    proxy::ProxyHandler,
    Array, Class, Coerced, Ctx, Exception, Function, IntoJs, JsLifetime, Object, Proxy, Value,
};
use std::{
    cell::RefCell,
    collections::{HashMap, HashSet},
    rc::Rc,
};

type DomHost = Rc<RefCell<DomState>>;

fn native_map(ctx: Ctx<'_>) -> rquickjs::Result<Object<'_>> {
    let object = Object::new(ctx)?;
    object.set_prototype(None)?;
    Ok(object)
}

pub(crate) fn install<'js>(ctx: &Ctx<'js>) -> rquickjs::Result<()> {
    let host = Rc::new(RefCell::new(DomState {
        doms: HashMap::new(),
        next_doc_id: 1,
        usage: Usage::default(),
    }));
    let constructor =
        Constructor::new_class::<DomParser, _, _>(ctx.clone(), move |ctx: Ctx<'js>| {
            Class::instance(ctx.clone(), DomParser { host: host.clone() })
        })?;
    ctx.globals().set("DOMParser", constructor)
}

struct DomParser {
    host: DomHost,
}
impl<'js> Trace<'js> for DomParser {
    fn trace<'a>(&self, _: Tracer<'a, 'js>) {}
}
unsafe impl<'js> JsLifetime<'js> for DomParser {
    type Changed<'to> = Self;
}
impl<'js> JsClass<'js> for DomParser {
    const NAME: &'static str = "DOMParser";
    type Mutable = Readable;
    fn constructor(_: &Ctx<'js>) -> rquickjs::Result<Option<Constructor<'js>>> {
        Ok(None)
    }
    fn prototype(ctx: &Ctx<'js>) -> rquickjs::Result<Option<Object<'js>>> {
        let proto = Object::new(ctx.clone())?;
        proto.set(
            "parseFromString",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 html: Coerced<String>,
                 mime: Opt<Coerced<String>>| {
                    if mime
                        .0
                        .is_some_and(|mime| !mime.0.eq_ignore_ascii_case("text/html"))
                    {
                        return Err(Exception::throw_type(&ctx, "DOMParser supports text/html"));
                    }
                    let parser = this.0.borrow();
                    let cache = native_map(ctx.clone())?;
                    let doc_id = with_dom_gc(&ctx, || parser.host.borrow_mut().dom_parse(&html.0))?;
                    DomNode {
                        document: Rc::new(DomLease {
                            host: parser.host.clone(),
                            doc_id,
                        }),
                        cache,
                        node_id: 0,
                    }
                    .object(&ctx)
                },
            )?,
        )?;
        Ok(Some(proto))
    }
}

// No JavaScript roots here: the lease is owned only by traced node wrappers,
// including wrappers retained by dataset and classList objects.
struct DomLease {
    host: DomHost,
    doc_id: i64,
}
impl Drop for DomLease {
    fn drop(&mut self) {
        let mut host = self.host.borrow_mut();
        if let Some(doc) = host.doms.remove(&self.doc_id) {
            host.usage.bytes -= doc.usage.bytes;
            host.usage.nodes -= doc.usage.nodes;
        }
    }
}

// Native quotas may fill before QuickJS's heap triggers a collection. Retry
// after GC without holding a DomState borrow, so dead leases can return quota.
fn with_dom_gc<T>(
    ctx: &Ctx<'_>,
    mut operation: impl FnMut() -> Result<T, &'static str>,
) -> rquickjs::Result<T> {
    match operation() {
        Ok(value) => Ok(value),
        Err(_) => {
            ctx.run_gc();
            operation().map_err(|message| Exception::throw_range(ctx, message))
        }
    }
}

#[derive(Clone)]
struct DomNode<'js> {
    document: Rc<DomLease>,
    cache: Object<'js>,
    node_id: i64,
}
impl<'js> Trace<'js> for DomNode<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.cache.trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for DomNode<'js> {
    type Changed<'to> = DomNode<'to>;
}
impl<'js> DomNode<'js> {
    fn object(self, ctx: &Ctx<'js>) -> rquickjs::Result<Class<'js, Self>> {
        let key = format!("{}:{}", self.document.doc_id, self.node_id);
        if let Some(value) = self
            .cache
            .get::<_, Option<Class<'js, Self>>>(key.as_str())?
        {
            return Ok(value);
        }
        let cache = self.cache.clone();
        let value = Class::instance(ctx.clone(), self)?;
        cache.set(key, value.clone())?;
        Ok(value)
    }
    fn value(&self, ctx: &Ctx<'js>, node_id: i64) -> rquickjs::Result<Value<'js>> {
        if node_id < 0 {
            return Ok(Value::new_null(ctx.clone()));
        }
        Self {
            node_id,
            ..self.clone()
        }
        .object(ctx)?
        .into_js(ctx)
    }
    fn nodes(&self, ctx: &Ctx<'js>, ids: Vec<i64>) -> rquickjs::Result<Array<'js>> {
        let result = Array::new(ctx.clone())?;
        for (index, id) in ids.into_iter().enumerate() {
            result.set(index, self.value(ctx, id)?)?;
        }
        Ok(result)
    }
    fn node(&self) -> Option<NodeRef> {
        self.document
            .host
            .borrow()
            .doms
            .get(&self.document.doc_id)
            .and_then(|doc| doc.nodes.get(&self.node_id))
            .cloned()
    }
    fn attr(&self, name: &str) -> Option<String> {
        self.document
            .host
            .borrow()
            .dom_attr(self.document.doc_id, self.node_id, name)
    }
    fn set_attr(&self, ctx: &Ctx<'js>, name: &str, value: &str) -> rquickjs::Result<()> {
        with_dom_gc(ctx, || {
            self.document.host.borrow_mut().dom_set_attr(
                self.document.doc_id,
                self.node_id,
                name,
                value,
            )
        })
    }
    fn remove_attr(&self, name: &str) {
        self.document
            .host
            .borrow_mut()
            .dom_remove_attr(self.document.doc_id, self.node_id, name);
    }
    fn attrs(&self) -> Vec<(String, String)> {
        self.node()
            .and_then(|node| {
                node.as_element().map(|element| {
                    element
                        .attributes
                        .borrow()
                        .map
                        .iter()
                        .map(|(name, value)| (name.local.to_string(), value.value.clone()))
                        .collect()
                })
            })
            .unwrap_or_default()
    }
    fn attrs_object(&self, ctx: &Ctx<'js>) -> rquickjs::Result<Object<'js>> {
        let object = native_map(ctx.clone())?;
        for (name, value) in self.attrs() {
            object.set(name, value)?;
        }
        Ok(object)
    }
    fn child_ids(&self, elements_only: bool) -> Vec<i64> {
        let mut host = self.document.host.borrow_mut();
        let ids = host.dom_children(self.document.doc_id, self.node_id);
        if elements_only {
            ids.into_iter()
                .filter(|id| !host.dom_tag(self.document.doc_id, *id).is_empty())
                .collect()
        } else {
            ids
        }
    }
    fn parent_id(&self, elements_only: bool) -> i64 {
        let Some(parent) = self.node().and_then(|node| node.parent()) else {
            return -1;
        };
        if elements_only && parent.as_element().is_none() {
            return -1;
        }
        self.document
            .host
            .borrow_mut()
            .doms
            .get_mut(&self.document.doc_id)
            .map(|doc| doc.intern(parent))
            .unwrap_or(-1)
    }
    fn sibling_id(&self, next: bool, elements_only: bool) -> i64 {
        let mut host = self.document.host.borrow_mut();
        let mut id = host.dom_sibling(self.document.doc_id, self.node_id, next);
        while elements_only && id >= 0 && host.dom_tag(self.document.doc_id, id).is_empty() {
            id = host.dom_sibling(self.document.doc_id, id, next);
        }
        id
    }
    fn node_type(&self) -> i32 {
        self.node()
            .map(|node| match node.data() {
                NodeData::Document(_) => 9,
                NodeData::DocumentFragment => 11,
                NodeData::Element(_) => 1,
                NodeData::Text(_) => 3,
                NodeData::Comment(_) => 8,
                NodeData::Doctype(_) => 10,
                NodeData::ProcessingInstruction(_) => 7,
            })
            .unwrap_or(0)
    }
}

impl<'js> JsClass<'js> for DomNode<'js> {
    const NAME: &'static str = "SynuraDomNode";
    type Mutable = Readable;
    fn constructor(_: &Ctx<'js>) -> rquickjs::Result<Option<Constructor<'js>>> {
        Ok(None)
    }
    fn prototype(ctx: &Ctx<'js>) -> rquickjs::Result<Option<Object<'js>>> {
        let proto = Object::new(ctx.clone())?;
        macro_rules! get {
            ($name:expr, $body:expr) => {
                proto.prop($name, Accessor::from($body).enumerable())?;
            };
        }
        for name in ["textContent", "innerText"] {
            get!(name, |this: This<Class<'js, Self>>| {
                let node = this.0.borrow();
                let value = node
                    .document
                    .host
                    .borrow()
                    .dom_text(node.document.doc_id, node.node_id);
                value
            });
        }
        get!("tagName", |this: This<Class<'js, Self>>| {
            let node = this.0.borrow();
            let value = node
                .document
                .host
                .borrow()
                .dom_tag(node.document.doc_id, node.node_id);
            value
        });
        get!("nodeType", |this: This<Class<'js, Self>>| this
            .0
            .borrow()
            .node_type());
        get!("nodeName", |this: This<Class<'js, Self>>| {
            let node = this.0.borrow();
            match node.node_type() {
                9 => "#document".into(),
                11 => "#document-fragment".into(),
                3 => "#text".into(),
                8 => "#comment".into(),
                _ => node
                    .document
                    .host
                    .borrow()
                    .dom_tag(node.document.doc_id, node.node_id),
            }
        });
        for (property, attr) in [("id", "id"), ("className", "class")] {
            proto.prop(
                property,
                Accessor::new(
                    move |this: This<Class<'js, Self>>| {
                        this.0.borrow().attr(attr).unwrap_or_default()
                    },
                    move |ctx: Ctx<'js>, this: This<Class<'js, Self>>, value: Coerced<String>| {
                        this.0.borrow().set_attr(&ctx, attr, &value.0)
                    },
                )
                .enumerable(),
            )?;
        }
        for (property, elements) in [("childNodes", false), ("children", true)] {
            get!(
                property,
                move |ctx: Ctx<'js>, this: This<Class<'js, Self>>| {
                    let node = this.0.borrow();
                    node.nodes(&ctx, node.child_ids(elements))
                }
            );
        }
        for (property, last, elements) in [
            ("firstChild", false, false),
            ("lastChild", true, false),
            ("firstElementChild", false, true),
            ("lastElementChild", true, true),
        ] {
            get!(
                property,
                move |ctx: Ctx<'js>, this: This<Class<'js, Self>>| {
                    let node = this.0.borrow();
                    let ids = node.child_ids(elements);
                    node.value(
                        &ctx,
                        if last { ids.last() } else { ids.first() }
                            .copied()
                            .unwrap_or(-1),
                    )
                }
            );
        }
        for (property, next, elements) in [
            ("nextSibling", true, false),
            ("previousSibling", false, false),
            ("nextElementSibling", true, true),
            ("previousElementSibling", false, true),
        ] {
            get!(
                property,
                move |ctx: Ctx<'js>, this: This<Class<'js, Self>>| {
                    let node = this.0.borrow();
                    node.value(&ctx, node.sibling_id(next, elements))
                }
            );
        }
        for (property, elements) in [("parentNode", false), ("parentElement", true)] {
            get!(
                property,
                move |ctx: Ctx<'js>, this: This<Class<'js, Self>>| {
                    let node = this.0.borrow();
                    node.value(&ctx, node.parent_id(elements))
                }
            );
        }
        get!("attributes", |ctx: Ctx<'js>, this: This<Class<'js, Self>>| this
            .0
            .borrow()
            .attrs_object(&ctx));
        get!(
            "classList",
            |ctx: Ctx<'js>, this: This<Class<'js, Self>>| Class::instance(
                ctx,
                DomTokenList(this.0.borrow().clone())
            )
        );
        get!("dataset", |ctx: Ctx<'js>, this: This<Class<'js, Self>>| {
            dataset(&ctx, this.0.borrow().clone())
        });
        proto.set(
            "getAttribute",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Self>>, name: Coerced<String>| match this
                    .0
                    .borrow()
                    .attr(&name.0)
                {
                    Some(value) => value.into_js(&ctx),
                    None => Ok(Value::new_null(ctx)),
                },
            )?,
        )?;
        proto.set(
            "hasAttribute",
            Function::new(
                ctx.clone(),
                |this: This<Class<'js, Self>>, name: Coerced<String>| {
                    this.0.borrow().attr(&name.0).is_some()
                },
            )?,
        )?;
        proto.set(
            "setAttribute",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 name: Coerced<String>,
                 value: Coerced<String>| {
                    this.0.borrow().set_attr(&ctx, &name.0, &value.0)
                },
            )?,
        )?;
        proto.set(
            "removeAttribute",
            Function::new(
                ctx.clone(),
                |this: This<Class<'js, Self>>, name: Coerced<String>| {
                    this.0.borrow().remove_attr(&name.0)
                },
            )?,
        )?;
        proto.set(
            "remove",
            Function::new(ctx.clone(), |this: This<Class<'js, Self>>| {
                let node = this.0.borrow();
                node.document
                    .host
                    .borrow_mut()
                    .dom_remove(node.document.doc_id, node.node_id);
            })?,
        )?;
        proto.set(
            "matches",
            Function::new(
                ctx.clone(),
                |this: This<Class<'js, Self>>, selector: Coerced<String>| {
                    let node = this.0.borrow();
                    let matched = node
                        .document
                        .host
                        .borrow_mut()
                        .dom_query(node.document.doc_id, node.node_id, &selector.0)
                        .first()
                        == Some(&node.node_id);
                    matched
                },
            )?,
        )?;
        proto.set(
            "querySelectorAll",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Self>>, selector: Coerced<String>| {
                    let node = this.0.borrow();
                    let ids = node.document.host.borrow_mut().dom_query(
                        node.document.doc_id,
                        node.node_id,
                        &selector.0,
                    );
                    node.nodes(&ctx, ids)
                },
            )?,
        )?;
        proto.set(
            "querySelector",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Self>>, selector: Coerced<String>| {
                    let node = this.0.borrow();
                    let id = node
                        .document
                        .host
                        .borrow_mut()
                        .dom_query(node.document.doc_id, node.node_id, &selector.0)
                        .first()
                        .copied()
                        .unwrap_or(-1);
                    node.value(&ctx, id)
                },
            )?,
        )?;
        proto.set(
            "cloneNode",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Self>>, deep: Opt<Coerced<bool>>| {
                    let node = this.0.borrow();
                    let deep = deep.0.is_some_and(|value| value.0);
                    let id = with_dom_gc(&ctx, || {
                        node.document
                            .host
                            .borrow_mut()
                            .dom_clone(node.document.doc_id, node.node_id, deep)
                    })?;
                    node.value(&ctx, id)
                },
            )?,
        )?;
        Ok(Some(proto))
    }
}

struct DomTokenList<'js>(DomNode<'js>);
impl<'js> Trace<'js> for DomTokenList<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.0.trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for DomTokenList<'js> {
    type Changed<'to> = DomTokenList<'to>;
}
impl<'js> DomTokenList<'js> {
    fn tokens(&self) -> Vec<String> {
        let mut seen = HashSet::new();
        self.0
            .attr("class")
            .unwrap_or_default()
            .split_whitespace()
            .filter(|token| seen.insert((*token).to_owned()))
            .map(str::to_owned)
            .collect()
    }
}
impl<'js> JsClass<'js> for DomTokenList<'js> {
    const NAME: &'static str = "DOMTokenList";
    type Mutable = Readable;
    fn constructor(_: &Ctx<'js>) -> rquickjs::Result<Option<Constructor<'js>>> {
        Ok(None)
    }
    fn prototype(ctx: &Ctx<'js>) -> rquickjs::Result<Option<Object<'js>>> {
        let proto = Object::new(ctx.clone())?;
        proto.prop(
            "length",
            Accessor::from(|this: This<Class<'js, Self>>| this.0.borrow().tokens().len())
                .enumerable(),
        )?;
        proto.prop(
            "value",
            Accessor::new(
                |this: This<Class<'js, Self>>| this.0.borrow().0.attr("class").unwrap_or_default(),
                |ctx: Ctx<'js>, this: This<Class<'js, Self>>, value: Coerced<String>| {
                    this.0.borrow().0.set_attr(&ctx, "class", &value.0)
                },
            )
            .enumerable(),
        )?;
        proto.set(
            "contains",
            Function::new(
                ctx.clone(),
                |this: This<Class<'js, Self>>, token: Coerced<String>| {
                    this.0.borrow().tokens().contains(&token.0)
                },
            )?,
        )?;
        for (name, add) in [("add", true), ("remove", false)] {
            proto.set(
                name,
                Function::new(
                    ctx.clone(),
                    move |ctx: Ctx<'js>,
                          this: This<Class<'js, Self>>,
                          tokens: Rest<Coerced<String>>| {
                        let list = this.0.borrow();
                        let mut values = list.tokens();
                        for token in tokens.0 {
                            if add {
                                if !values.contains(&token.0) {
                                    values.push(token.0);
                                }
                            } else {
                                values.retain(|value| value != &token.0);
                            }
                        }
                        list.0.set_attr(&ctx, "class", &values.join(" "))
                    },
                )?,
            )?;
        }
        proto.set(
            "toggle",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 token: Coerced<String>,
                 force: Opt<bool>| {
                    let list = this.0.borrow();
                    let mut values = list.tokens();
                    let present = values.contains(&token.0);
                    let add = force.0.unwrap_or(!present);
                    if add {
                        if !present {
                            values.push(token.0);
                        }
                    } else {
                        values.retain(|value| value != &token.0);
                    }
                    list.0.set_attr(&ctx, "class", &values.join(" "))?;
                    Ok::<_, rquickjs::Error>(add)
                },
            )?,
        )?;
        proto.set(
            "item",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Self>>, index: usize| match this
                    .0
                    .borrow()
                    .tokens()
                    .get(index)
                {
                    Some(value) => value.clone().into_js(&ctx),
                    None => Ok(Value::new_null(ctx)),
                },
            )?,
        )?;
        proto.set(
            "toString",
            Function::new(ctx.clone(), |this: This<Class<'js, Self>>| {
                this.0.borrow().0.attr("class").unwrap_or_default()
            })?,
        )?;
        Ok(Some(proto))
    }
}

struct DomDataset<'js>(DomNode<'js>);
impl<'js> Trace<'js> for DomDataset<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.0.trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for DomDataset<'js> {
    type Changed<'to> = DomDataset<'to>;
}
impl<'js> JsClass<'js> for DomDataset<'js> {
    const NAME: &'static str = "DOMStringMap";
    type Mutable = Readable;
    fn constructor(_: &Ctx<'js>) -> rquickjs::Result<Option<Constructor<'js>>> {
        Ok(None)
    }
}
fn data_name(property: &str) -> String {
    let mut result = String::from("data-");
    for ch in property.chars() {
        if ch.is_ascii_uppercase() {
            result.push('-');
            result.push(ch.to_ascii_lowercase());
        } else {
            result.push(ch);
        }
    }
    result
}
fn data_property(name: &str) -> String {
    let mut chars = name.chars().peekable();
    let mut result = String::new();
    while let Some(ch) = chars.next() {
        if ch == '-' && chars.peek().is_some_and(char::is_ascii_lowercase) {
            result.push(chars.next().unwrap().to_ascii_uppercase());
        } else {
            result.push(ch);
        }
    }
    result
}
fn dataset<'js>(ctx: &Ctx<'js>, node: DomNode<'js>) -> rquickjs::Result<Proxy<'js>> {
    let target = Class::instance(ctx.clone(), DomDataset(node))?;
    let handler = Object::new(ctx.clone())?;
    handler.set(
        "get",
        Function::new(
            ctx.clone(),
            |ctx: Ctx<'js>,
             target: Class<'js, DomDataset<'js>>,
             key: Value<'js>,
             _receiver: Value<'js>| {
                let Some(key) = key.as_string() else {
                    return Ok(Value::new_undefined(ctx));
                };
                match target.borrow().0.attr(&data_name(&key.to_string()?)) {
                    Some(value) => value.into_js(&ctx),
                    None => Ok(Value::new_undefined(ctx)),
                }
            },
        )?,
    )?;
    handler.set(
        "set",
        Function::new(
            ctx.clone(),
            |ctx: Ctx<'js>,
             target: Class<'js, DomDataset<'js>>,
             key: Coerced<String>,
             value: Coerced<String>,
             _receiver: Value<'js>| {
                target
                    .borrow()
                    .0
                    .set_attr(&ctx, &data_name(&key.0), &value.0)?;
                Ok::<_, rquickjs::Error>(true)
            },
        )?,
    )?;
    handler.set(
        "deleteProperty",
        Function::new(
            ctx.clone(),
            |target: Class<'js, DomDataset<'js>>, key: Coerced<String>| {
                target.borrow().0.remove_attr(&data_name(&key.0));
                true
            },
        )?,
    )?;
    handler.set(
        "has",
        Function::new(
            ctx.clone(),
            |target: Class<'js, DomDataset<'js>>, key: Coerced<String>| {
                target.borrow().0.attr(&data_name(&key.0)).is_some()
            },
        )?,
    )?;
    handler.set(
        "ownKeys",
        Function::new(ctx.clone(), |target: Class<'js, DomDataset<'js>>| {
            target
                .borrow()
                .0
                .attrs()
                .iter()
                .filter_map(|(name, _)| name.strip_prefix("data-").map(data_property))
                .collect::<Vec<_>>()
        })?,
    )?;
    handler.set(
        "getOwnPropertyDescriptor",
        Function::new(
            ctx.clone(),
            |ctx: Ctx<'js>, target: Class<'js, DomDataset<'js>>, key: Coerced<String>| {
                let Some(value) = target.borrow().0.attr(&data_name(&key.0)) else {
                    return Ok(Value::new_undefined(ctx));
                };
                let descriptor = Object::new(ctx.clone())?;
                descriptor.set("value", value)?;
                descriptor.set("writable", true)?;
                descriptor.set("enumerable", true)?;
                descriptor.set("configurable", true)?;
                descriptor.into_js(&ctx)
            },
        )?,
    )?;
    Proxy::new(ctx.clone(), target, ProxyHandler::from_object(handler)?)
}

const MAX_DOM_SOURCE_BYTES: usize = 8 * 1024 * 1024;
const MAX_DOM_BYTES: usize = 32 * 1024 * 1024;
const MAX_DOM_NODES: usize = 100_000;
const MAX_DOM_DOCUMENTS: usize = 128;
// Account for node/Rc metadata, map entries, strings and allocator overhead.
// Names/attributes are charged separately; shared name atoms are overcounted.
const NODE_OVERHEAD: usize = 256;
const ATTRIBUTE_OVERHEAD: usize = 96;
const LIMIT_MESSAGE: &str = "DOM resource limit exceeded";

#[derive(Clone, Copy, Default)]
struct Usage {
    bytes: usize,
    nodes: usize,
}
impl Usage {
    fn add(self, extra: Self) -> Result<Self, &'static str> {
        let bytes = self.bytes.checked_add(extra.bytes).ok_or(LIMIT_MESSAGE)?;
        let nodes = self.nodes.checked_add(extra.nodes).ok_or(LIMIT_MESSAGE)?;
        if bytes > MAX_DOM_BYTES || nodes > MAX_DOM_NODES {
            return Err(LIMIT_MESSAGE);
        }
        Ok(Self { bytes, nodes })
    }
}

struct DomState {
    doms: HashMap<i64, DomDoc>,
    next_doc_id: i64,
    usage: Usage,
}
impl DomState {
    fn dom_parse(&mut self, html: &str) -> Result<i64, &'static str> {
        if html.len() > MAX_DOM_SOURCE_BYTES || self.doms.len() >= MAX_DOM_DOCUMENTS {
            return Err(LIMIT_MESSAGE);
        }
        // Reject obviously excessive source before parsing; the tree is measured
        // afterward because malformed HTML and parser-inserted nodes vary.
        self.usage.add(Usage {
            bytes: html.len(),
            nodes: 0,
        })?;
        let root = kuchiki::parse_html().one(html);
        let document_usage = tree_usage(&root, true)?;
        let usage = self.usage.add(document_usage)?;
        let doc_id = self.next_doc_id;
        self.next_doc_id += 1;
        self.doms.insert(doc_id, DomDoc::new(root, document_usage));
        self.usage = usage;
        Ok(doc_id)
    }

    fn dom_query(&mut self, doc_id: i64, node_id: i64, selector: &str) -> Vec<i64> {
        if selector.contains(',') || selector_has_unsupported_attr_operator(selector) {
            return Vec::new();
        }
        let Some(doc) = self.doms.get_mut(&doc_id) else {
            return Vec::new();
        };
        let Some(node) = doc.nodes.get(&node_id).cloned() else {
            return Vec::new();
        };
        let mut out = Vec::new();
        let mut seen = HashSet::new();
        if node_matches(&node, selector) {
            let id = doc.intern(node.clone());
            seen.insert(id);
            out.push(id);
        }
        let Ok(matches) = node.select(selector) else {
            return out;
        };
        for matched in matches {
            let id = doc.intern(matched.as_node().clone());
            if seen.insert(id) {
                out.push(id);
            }
        }
        out
    }

    fn dom_children(&mut self, doc_id: i64, node_id: i64) -> Vec<i64> {
        let Some(doc) = self.doms.get_mut(&doc_id) else {
            return Vec::new();
        };
        let Some(node) = doc.nodes.get(&node_id).cloned() else {
            return Vec::new();
        };
        node.children()
            .filter(|child| child.as_element().is_some() || child.as_text().is_some())
            .map(|child| doc.intern(child))
            .collect()
    }

    fn dom_sibling(&mut self, doc_id: i64, node_id: i64, next: bool) -> i64 {
        let Some(doc) = self.doms.get_mut(&doc_id) else {
            return -1;
        };
        let Some(node) = doc.nodes.get(&node_id).cloned() else {
            return -1;
        };
        let mut sibling = if next {
            node.next_sibling()
        } else {
            node.previous_sibling()
        };
        while let Some(candidate) = sibling {
            if candidate.as_element().is_some() || candidate.as_text().is_some() {
                return doc.intern(candidate);
            }
            sibling = if next {
                candidate.next_sibling()
            } else {
                candidate.previous_sibling()
            };
        }
        -1
    }

    fn dom_text(&self, doc_id: i64, node_id: i64) -> String {
        self.doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .map(NodeRef::text_contents)
            .unwrap_or_default()
    }

    fn dom_tag(&self, doc_id: i64, node_id: i64) -> String {
        self.doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .and_then(|node| {
                node.as_element()
                    .map(|el| el.name.local.to_string().to_uppercase())
            })
            .unwrap_or_default()
    }

    fn dom_attr(&self, doc_id: i64, node_id: i64, name: &str) -> Option<String> {
        self.doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .and_then(|node| node.as_element())
            .and_then(|el| el.attributes.borrow().get(name).map(ToString::to_string))
    }

    fn dom_set_attr(
        &mut self,
        doc_id: i64,
        node_id: i64,
        name: &str,
        value: &str,
    ) -> Result<(), &'static str> {
        let Some(el) = self
            .doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .and_then(|node| node.as_element())
        else {
            return Ok(());
        };
        let previous = attribute_usage(&el.attributes.borrow(), name);
        let replacement = ATTRIBUTE_OVERHEAD
            .saturating_add(name.len())
            .saturating_add(value.len());
        let usage = Usage {
            bytes: self.usage.bytes.saturating_sub(previous),
            nodes: self.usage.nodes,
        }
        .add(Usage {
            bytes: replacement,
            nodes: 0,
        })?;
        // Quota rejection leaves the original value intact.
        el.attributes.borrow_mut().insert(name, value.to_string());
        let document = self.doms.get_mut(&doc_id).unwrap();
        document.usage.bytes = document.usage.bytes - previous + replacement;
        self.usage = usage;
        Ok(())
    }

    fn dom_remove_attr(&mut self, doc_id: i64, node_id: i64, name: &str) {
        if let Some(el) = self
            .doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .and_then(|node| node.as_element())
        {
            let released = attribute_usage(&el.attributes.borrow(), name);
            el.attributes.borrow_mut().remove(name);
            self.usage.bytes -= released;
            self.doms.get_mut(&doc_id).unwrap().usage.bytes -= released;
        }
    }

    fn dom_remove(&mut self, doc_id: i64, node_id: i64) {
        if let Some(node) = self
            .doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .cloned()
        {
            node.detach();
        }
    }

    fn dom_clone(&mut self, doc_id: i64, node_id: i64, deep: bool) -> Result<i64, &'static str> {
        let Some(node) = self
            .doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .cloned()
        else {
            return Ok(0);
        };
        let extra = tree_usage(&node, deep)?;
        let usage = self.usage.add(extra)?;
        // Check only the nodes that will be copied, before allocating them.
        let cloned = if deep {
            clone_node_deep(&node)
        } else {
            clone_node_shallow(&node)
        };
        let document = self.doms.get_mut(&doc_id).unwrap();
        let id = document.intern(cloned);
        document.usage.bytes += extra.bytes;
        document.usage.nodes += extra.nodes;
        self.usage = usage;
        Ok(id)
    }
}

fn attribute_usage(attributes: &kuchiki::Attributes, name: &str) -> usize {
    attributes
        .map
        .iter()
        .find(|(key, _)| key.ns.is_empty() && key.local.as_ref() == name)
        .map(|(key, value)| {
            ATTRIBUTE_OVERHEAD
                + key.local.len()
                + key.ns.len()
                + value.prefix.as_ref().map_or(0, |prefix| prefix.len())
                + value.value.capacity()
        })
        .unwrap_or(0)
}

fn tree_usage(root: &NodeRef, deep: bool) -> Result<Usage, &'static str> {
    let mut usage = Usage::default();
    let mut pending = vec![root.clone()];
    while let Some(node) = pending.pop() {
        let payload = match node.data() {
            NodeData::Text(text) | NodeData::Comment(text) => text.borrow().capacity(),
            NodeData::Element(element) => {
                if let Some(template) = &element.template_contents {
                    if deep {
                        pending.push(template.clone());
                    } else {
                        // Even a shallow template clone owns an empty content
                        // fragment; its original descendants are not copied.
                        usage = usage.add(Usage {
                            bytes: NODE_OVERHEAD,
                            nodes: 1,
                        })?;
                    }
                }
                let mut bytes = element.name.local.len()
                    + element.name.ns.len()
                    + element
                        .name
                        .prefix
                        .as_ref()
                        .map_or(0, |prefix| prefix.len());
                for (name, value) in &element.attributes.borrow().map {
                    bytes = bytes
                        .saturating_add(ATTRIBUTE_OVERHEAD)
                        .saturating_add(name.local.len())
                        .saturating_add(name.ns.len())
                        .saturating_add(value.value.capacity())
                        .saturating_add(value.prefix.as_ref().map_or(0, |prefix| prefix.len()));
                }
                bytes
            }
            NodeData::ProcessingInstruction(value) => {
                let value = value.borrow();
                value.0.capacity().saturating_add(value.1.capacity())
            }
            NodeData::Doctype(value) => value
                .name
                .capacity()
                .saturating_add(value.public_id.capacity())
                .saturating_add(value.system_id.capacity()),
            NodeData::Document(_) | NodeData::DocumentFragment => 0,
        };
        usage = usage.add(Usage {
            bytes: NODE_OVERHEAD.saturating_add(payload),
            nodes: 1,
        })?;
        if deep {
            pending.extend(node.children());
        }
    }
    Ok(usage)
}

fn clone_node_shallow(node: &NodeRef) -> NodeRef {
    match node.data() {
        NodeData::Text(text) => NodeRef::new_text(text.borrow().clone()),
        NodeData::Comment(comment) => NodeRef::new_comment(comment.borrow().clone()),
        NodeData::Element(element) => NodeRef::new_element(
            element.name.clone(),
            element.attributes.borrow().map.clone(),
        ),
        NodeData::ProcessingInstruction(value) => {
            let value = value.borrow();
            NodeRef::new_processing_instruction(value.0.clone(), value.1.clone())
        }
        NodeData::Doctype(value) => NodeRef::new_doctype(
            value.name.clone(),
            value.public_id.clone(),
            value.system_id.clone(),
        ),
        NodeData::Document(_) => NodeRef::new_document(),
        NodeData::DocumentFragment => NodeRef::new(NodeData::DocumentFragment),
    }
}

fn clone_node_deep(root: &NodeRef) -> NodeRef {
    let cloned = clone_node_shallow(root);
    let mut pending = vec![(root.clone(), cloned.clone())];
    while let Some((source, target)) = pending.pop() {
        for child in source.children() {
            let copy = clone_node_shallow(&child);
            target.append(copy.clone());
            pending.push((child, copy));
        }
        if let (Some(source), Some(target)) = (source.as_element(), target.as_element()) {
            if let (Some(source), Some(target)) =
                (&source.template_contents, &target.template_contents)
            {
                pending.push((source.clone(), target.clone()));
            }
        }
    }
    cloned
}

struct DomDoc {
    usage: Usage,
    nodes: HashMap<i64, NodeRef>,
    node_ids: HashMap<usize, i64>,
    next_node_id: i64,
}

impl DomDoc {
    fn new(root: NodeRef, usage: Usage) -> Self {
        let key = node_key(&root);
        let mut nodes = HashMap::new();
        nodes.insert(0, root);
        let mut node_ids = HashMap::new();
        node_ids.insert(key, 0);
        Self {
            usage,
            nodes,
            node_ids,
            next_node_id: 1,
        }
    }

    fn intern(&mut self, node: NodeRef) -> i64 {
        let key = node_key(&node);
        if let Some(id) = self.node_ids.get(&key) {
            return *id;
        }
        let id = self.next_node_id;
        self.next_node_id += 1;
        self.node_ids.insert(key, id);
        self.nodes.insert(id, node);
        id
    }
}

fn node_key(node: &NodeRef) -> usize {
    Rc::as_ptr(&node.0) as usize
}

fn selector_has_unsupported_attr_operator(selector: &str) -> bool {
    let bytes = selector.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] != b'[' {
            i += 1;
            continue;
        }
        let start = i + 1;
        let Some(end_offset) = selector[start..].find(']') else {
            return false;
        };
        let end = start + end_offset;
        let attr = selector[start..end].trim();
        if let Some(eq) = attr.find('=') {
            let before = attr[..eq].trim_end();
            if before.ends_with('^')
                || before.ends_with('$')
                || before.ends_with('*')
                || before.ends_with('~')
                || before.ends_with('|')
            {
                return true;
            }
        }
        i = end + 1;
    }
    false
}

fn node_matches(node: &NodeRef, selector: &str) -> bool {
    let Some(parent) = node.parent() else {
        return false;
    };
    let Ok(mut matches) = parent.select(selector) else {
        return false;
    };
    matches.any(|matched| matched.as_node() == node)
}
