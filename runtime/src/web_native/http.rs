use super::abort::Signal;
use super::headers::Headers;
use super::*;
use std::rc::Rc;

const METADATA_LIMIT: usize = 64 * 1024;
const VM_METADATA_LIMIT: usize = 16 * 1024 * 1024;
struct MetadataRoot(Rc<Cell<usize>>);
unsafe impl<'js> JsLifetime<'js> for MetadataRoot {
    type Changed<'to> = Self;
}
struct MetadataAllocation {
    budget: Rc<Cell<usize>>,
    bytes: usize,
}
impl MetadataAllocation {
    fn new(ctx: &Ctx<'_>, bytes: usize) -> Result<Self> {
        let budget = ctx
            .userdata::<MetadataRoot>()
            .expect("installed metadata budget")
            .0
            .clone();
        let mut allocation = Self { budget, bytes: 0 };
        allocation.grow(ctx, bytes.saturating_add(256))?;
        Ok(allocation)
    }
    fn grow(&mut self, ctx: &Ctx<'_>, bytes: usize) -> Result<()> {
        let own = self.bytes.saturating_add(bytes);
        let total = self.budget.get().saturating_add(bytes);
        if own > METADATA_LIMIT || total > VM_METADATA_LIMIT {
            return Err(Exception::throw_range(
                ctx,
                "HTTP metadata exceeds VM limit",
            ));
        }
        self.bytes = own;
        self.budget.set(total);
        Ok(())
    }
}
impl Drop for MetadataAllocation {
    fn drop(&mut self) {
        self.budget
            .set(self.budget.get().saturating_sub(self.bytes));
    }
}

#[derive(Clone)]
struct Body<'js> {
    used: bool,
    is_null: bool,
    bytes: Option<ArrayBuffer<'js>>,
    pending: Option<Promise<'js>>,
    signal: Option<Class<'js, Signal<'js>>>,
}
impl<'js> Body<'js> {
    fn new(bytes: Option<ArrayBuffer<'js>>) -> Self {
        Self {
            used: false,
            is_null: bytes.is_none(),
            bytes,
            pending: None,
            signal: None,
        }
    }
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        if let Some(value) = &self.bytes {
            value.trace(tracer);
        }
        if let Some(value) = &self.pending {
            value.trace(tracer);
        }
        if let Some(value) = &self.signal {
            value.trace(tracer);
        }
    }
    fn copy(&self, ctx: &Ctx<'_>) -> Result<Self> {
        if self.used {
            Err(type_error(ctx, "Body has already been consumed"))
        } else {
            Ok(self.clone())
        }
    }
}
fn extract_body<'js>(
    ctx: &Ctx<'js>,
    input: Value<'js>,
) -> Result<(Option<ArrayBuffer<'js>>, Option<&'static str>)> {
    if input.is_null() || input.is_undefined() {
        return Ok((None, None));
    }
    let is_buffer = unsafe {
        qjs::JS_IsArrayBuffer(input.as_raw())
            || qjs::JS_GetTypedArrayType(input.as_raw()) >= 0
            || qjs::JS_IsDataView(input.as_raw())
    };
    let (bytes, content_type) = if is_buffer {
        (crate::web_encoding::copy_buffer(ctx, &input)?, None)
    } else if let Some(form) = crate::web_url::body_form(&input)? {
        (
            form.into_bytes(),
            Some("application/x-www-form-urlencoded;charset=UTF-8"),
        )
    } else {
        if let Some(object) = input.as_object() {
            if object.get::<_, Value>("getReader")?.is_function()
                || object.get::<_, Value>("arrayBuffer")?.is_function()
            {
                return Err(unsupported(
                    ctx,
                    "Streaming, Blob, and FormData request bodies are not supported",
                ));
            }
        }
        (
            usv(ctx, &input)?.into_bytes(),
            Some("text/plain;charset=UTF-8"),
        )
    };
    if bytes.len() > crate::MAX_BODY_BYTES {
        return Err(Exception::throw_range(ctx, "Body exceeds VM limit"));
    }
    Ok((
        Some(ArrayBuffer::new_copy(ctx.clone(), bytes)?),
        content_type,
    ))
}
fn normalize_url<'js>(ctx: &Ctx<'js>, value: &Value<'js>) -> Result<String> {
    let input = usv(ctx, value)?;
    if input.len() > METADATA_LIMIT {
        return Err(Exception::throw_range(
            ctx,
            "HTTP metadata exceeds VM limit",
        ));
    }
    let url = url::Url::parse(&input)
        .map_err(|error| type_error(ctx, &format!("Invalid URL: {error}")))?;
    if !url.username().is_empty() || url.password().is_some() {
        return Err(type_error(ctx, "Request URL must not contain credentials"));
    }
    Ok(url.to_string())
}
fn enumeration<'js>(
    ctx: &Ctx<'js>,
    value: Value<'js>,
    allowed: &[&str],
    default: &str,
    name: &str,
) -> Result<String> {
    let value = if value.is_undefined() {
        default.into()
    } else {
        string(ctx, value)?
    };
    if allowed.contains(&value.as_str()) {
        Ok(value)
    } else {
        Err(type_error(ctx, &format!("Invalid {name}")))
    }
}
pub(super) struct Request<'js> {
    _metadata: MetadataAllocation,
    url: String,
    method: String,
    headers: Class<'js, Headers>,
    redirect: String,
    credentials: String,
    mode: String,
    cache: String,
    integrity: String,
    keepalive: bool,
    signal: Class<'js, Signal<'js>>,
    body: RefCell<Body<'js>>,
}
impl<'js> Trace<'js> for Request<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.headers.trace(tracer);
        self.signal.trace(tracer);
        self.body.borrow().trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for Request<'js> {
    type Changed<'to> = Request<'to>;
}
fn create_request<'js>(
    ctx: &Ctx<'js>,
    input: Value<'js>,
    init: Value<'js>,
) -> Result<Class<'js, Request<'js>>> {
    let init = dictionary(ctx, init)?;
    let source = input
        .as_object()
        .and_then(|object| object.as_class::<Request>());
    let url = if let Some(source) = &source {
        source.borrow().url.clone()
    } else {
        normalize_url(ctx, &input)?
    };
    // Charge retained native strings before any following dictionary getter can reenter.
    let mut metadata = MetadataAllocation::new(ctx, url.capacity())?;
    let method_init = member(ctx, &init, "method")?;
    let mut method = if method_init.is_undefined() {
        source
            .as_ref()
            .map(|source| source.borrow().method.clone())
            .unwrap_or_else(|| "GET".into())
    } else {
        byte_string(ctx, method_init)?
    };
    metadata.grow(ctx, method.capacity())?;
    let uppercase = method.to_ascii_uppercase();
    if method.is_empty()
        || !method
            .bytes()
            .all(|c| c.is_ascii_alphanumeric() || b"!#$%&'*+.^_`|~-".contains(&c))
        || ["CONNECT", "TRACE", "TRACK"].contains(&uppercase.as_str())
    {
        return Err(type_error(ctx, "Invalid request method"));
    }
    if ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"].contains(&uppercase.as_str()) {
        method = uppercase;
    } else {
        drop(uppercase);
    }
    let headers_init = member(ctx, &init, "headers")?;
    let headers = if headers_init.is_undefined() {
        if let Some(source) = &source {
            headers::from_pairs(ctx, source.borrow().headers.borrow().pairs(), false)?
        } else {
            headers::create(ctx, headers_init)?
        }
    } else {
        headers::create(ctx, headers_init)?
    };
    let source_string = |field: for<'a> fn(&'a Request<'js>) -> &'a String, default: &str| {
        source
            .as_ref()
            .map(|source| field(&source.borrow()).clone())
            .unwrap_or_else(|| default.into())
    };
    let redirect = enumeration(
        ctx,
        member(ctx, &init, "redirect")?,
        &["follow", "error", "manual"],
        &source_string(|s| &s.redirect, "follow"),
        "redirect",
    )?;
    if redirect == "manual" {
        return Err(unsupported(ctx, "Manual redirects are not supported"));
    }
    let credentials = enumeration(
        ctx,
        member(ctx, &init, "credentials")?,
        &["omit", "same-origin", "include"],
        &source_string(|s| &s.credentials, "same-origin"),
        "credentials",
    )?;
    let mode = enumeration(
        ctx,
        member(ctx, &init, "mode")?,
        &["cors", "same-origin", "no-cors"],
        &source_string(|s| &s.mode, "cors"),
        "mode",
    )?;
    if mode != "cors" {
        return Err(unsupported(
            ctx,
            "Browser origin modes are not supported; the host enforces extension permissions",
        ));
    }
    let cache = enumeration(
        ctx,
        member(ctx, &init, "cache")?,
        &[
            "default",
            "no-store",
            "reload",
            "no-cache",
            "force-cache",
            "only-if-cached",
        ],
        &source_string(|s| &s.cache, "default"),
        "cache",
    )?;
    if cache != "default" && cache != "no-store" {
        return Err(unsupported(ctx, "HTTP cache modes are not supported"));
    }
    let integrity = member(ctx, &init, "integrity")?;
    let integrity = if integrity.is_undefined() {
        source_string(|s| &s.integrity, "")
    } else {
        string(ctx, integrity)?
    };
    if !integrity.is_empty() {
        return Err(unsupported(ctx, "Subresource integrity is not supported"));
    }
    let keepalive = member(ctx, &init, "keepalive")?;
    let keepalive = if keepalive.is_undefined() {
        source
            .as_ref()
            .is_some_and(|source| source.borrow().keepalive)
    } else {
        boolean(ctx, keepalive)?
    };
    if keepalive {
        return Err(unsupported(ctx, "Keepalive requests are not supported"));
    }
    let referrer = member(ctx, &init, "referrer")?;
    if !referrer.is_undefined() {
        let referrer = string(ctx, referrer)?;
        if !referrer.is_empty() && referrer != "about:client" {
            return Err(unsupported(ctx, "Explicit referrers are not supported"));
        }
    }
    let referrer_policy = member(ctx, &init, "referrerPolicy")?;
    if !referrer_policy.is_undefined() && !string(ctx, referrer_policy)?.is_empty() {
        return Err(unsupported(
            ctx,
            "Browser referrer policies are not supported",
        ));
    }
    let signal_init = member(ctx, &init, "signal")?;
    let signal = abort::create(ctx)?;
    let parent = if signal_init.is_undefined() {
        source.as_ref().map(|source| source.borrow().signal.clone())
    } else if signal_init.is_null() {
        None
    } else {
        Some(abort::from_value(ctx, signal_init)?)
    };
    if let Some(parent) = parent {
        abort::follow(ctx, parent, signal.clone())?;
    }
    let body_init = member(ctx, &init, "body")?;
    let mut consume_source = false;
    let body = if !body_init.is_null() && !body_init.is_undefined() {
        let (bytes, content_type) = extract_body(ctx, body_init)?;
        if let Some(content_type) = content_type {
            if headers.borrow().get("content-type").is_none() {
                headers
                    .borrow()
                    .set(ctx, "content-type".into(), content_type.into())?;
            }
        }
        Body::new(bytes)
    } else if let Some(source) = &source {
        let body = source.borrow().body.borrow().copy(ctx)?;
        consume_source = !body.is_null;
        body
    } else {
        Body::new(None)
    };
    if (method == "GET" || method == "HEAD") && !body.is_null {
        return Err(type_error(ctx, "GET and HEAD requests cannot have a body"));
    }
    if consume_source {
        source.as_ref().unwrap().borrow().body.borrow_mut().used = true;
    }
    Class::instance(
        ctx.clone(),
        Request {
            _metadata: metadata,
            url,
            method,
            headers,
            redirect,
            credentials,
            mode,
            cache,
            integrity,
            keepalive,
            signal,
            body: RefCell::new(body),
        },
    )
}
fn clone_request<'js>(
    ctx: &Ctx<'js>,
    request: Class<'js, Request<'js>>,
) -> Result<Class<'js, Request<'js>>> {
    let original = request.borrow();
    let body = original.body.borrow().copy(ctx)?;
    let signal = abort::create(ctx)?;
    abort::follow(ctx, original.signal.clone(), signal.clone())?;
    let cloned = Class::instance(
        ctx.clone(),
        Request {
            _metadata: MetadataAllocation::new(
                ctx,
                original.url.len()
                    + original.method.len()
                    + original.redirect.len()
                    + original.credentials.len()
                    + original.mode.len()
                    + original.cache.len()
                    + original.integrity.len(),
            )?,
            url: original.url.clone(),
            method: original.method.clone(),
            headers: headers::from_pairs(ctx, original.headers.borrow().pairs(), false)?,
            redirect: original.redirect.clone(),
            credentials: original.credentials.clone(),
            mode: original.mode.clone(),
            cache: original.cache.clone(),
            integrity: original.integrity.clone(),
            keepalive: original.keepalive,
            signal,
            body: RefCell::new(body),
        },
    );
    cloned
}
impl<'js> JsClass<'js> for Request<'js> {
    const NAME: &'static str = "Request";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(Some(Constructor::new_class::<Self, _, _>(
            ctx.clone(),
            |ctx: Ctx<'js>, args: Rest<Value<'js>>| {
                required(&ctx, &args, 1)?;
                create_request(&ctx, args[0].clone(), arg(&ctx, &args, 1))
            },
        )?))
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = prototype(ctx, Self::NAME)?;
        for name in [
            "url",
            "method",
            "redirect",
            "credentials",
            "mode",
            "cache",
            "integrity",
            "destination",
            "referrer",
            "referrerPolicy",
        ] {
            proto.prop(
                name,
                Accessor::from(move |this: This<Class<'js, Request<'js>>>| {
                    let state = this.0.borrow();
                    match name {
                        "url" => state.url.clone(),
                        "method" => state.method.clone(),
                        "redirect" => state.redirect.clone(),
                        "credentials" => state.credentials.clone(),
                        "mode" => state.mode.clone(),
                        "cache" => state.cache.clone(),
                        "integrity" => state.integrity.clone(),
                        "referrer" => "about:client".into(),
                        _ => String::new(),
                    }
                })
                .enumerable()
                .configurable(),
            )?;
        }
        proto.prop(
            "headers",
            Accessor::from(|this: This<Class<'js, Request<'js>>>| this.0.borrow().headers.clone())
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "signal",
            Accessor::from(|this: This<Class<'js, Request<'js>>>| this.0.borrow().signal.clone())
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "keepalive",
            Accessor::from(|this: This<Class<'js, Request<'js>>>| this.0.borrow().keepalive)
                .enumerable()
                .configurable(),
        )?;
        proto.set(
            "clone",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Request<'js>>>| clone_request(&ctx, this.0),
            )?,
        )?;
        add_body_methods(ctx, &proto)?;
        Ok(Some(proto))
    }
}
struct Response<'js> {
    _metadata: MetadataAllocation,
    status: u16,
    status_text: String,
    headers: Class<'js, Headers>,
    url: String,
    redirected: bool,
    kind: &'static str,
    body: RefCell<Body<'js>>,
}
impl<'js> Trace<'js> for Response<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.headers.trace(tracer);
        self.body.borrow().trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for Response<'js> {
    type Changed<'to> = Response<'to>;
}
fn create_response<'js>(
    ctx: &Ctx<'js>,
    body: Value<'js>,
    init: Value<'js>,
) -> Result<Class<'js, Response<'js>>> {
    let init = dictionary(ctx, init)?;
    let status = member(ctx, &init, "status")?;
    let status = if status.is_undefined() {
        200
    } else {
        let number = Coerced::<f64>::from_js(ctx, status)?.0;
        if number.is_finite() {
            number.trunc().rem_euclid(65536.0) as u16
        } else {
            0
        }
    };
    if !(200..=599).contains(&status) {
        return Err(Exception::throw_range(ctx, "Invalid response status"));
    }
    let status_text = member(ctx, &init, "statusText")?;
    let status_text = if status_text.is_undefined() {
        String::new()
    } else {
        byte_string(ctx, status_text)?
    };
    if status_text
        .chars()
        .any(|ch| ch != '\t' && !(0x20..=0xff).contains(&(ch as u32)) || ch == '\x7f')
    {
        return Err(type_error(ctx, "Invalid status text"));
    }
    let metadata = MetadataAllocation::new(ctx, status_text.capacity())?;
    let headers = headers::create(ctx, member(ctx, &init, "headers")?)?;
    let (bytes, content_type) = extract_body(ctx, body)?;
    if bytes.is_some() && [204, 205, 304].contains(&status) {
        return Err(type_error(ctx, "This status cannot have a body"));
    }
    if let Some(content_type) = content_type {
        if headers.borrow().get("content-type").is_none() {
            headers
                .borrow()
                .set(ctx, "content-type".into(), content_type.into())?;
        }
    }
    Class::instance(
        ctx.clone(),
        Response {
            _metadata: metadata,
            status,
            status_text,
            headers,
            url: String::new(),
            redirected: false,
            kind: "default",
            body: RefCell::new(Body::new(bytes)),
        },
    )
}
fn clone_response<'js>(
    ctx: &Ctx<'js>,
    response: Class<'js, Response<'js>>,
) -> Result<Class<'js, Response<'js>>> {
    let state = response.borrow();
    let body = state.body.borrow().copy(ctx)?;
    let headers = state.headers.borrow();
    let headers = headers::from_pairs(ctx, headers.pairs(), headers.immutable.get())?;
    Class::instance(
        ctx.clone(),
        Response {
            _metadata: MetadataAllocation::new(ctx, state.status_text.len() + state.url.len())?,
            status: state.status,
            status_text: state.status_text.clone(),
            headers,
            url: state.url.clone(),
            redirected: state.redirected,
            kind: state.kind,
            body: RefCell::new(body),
        },
    )
}
impl<'js> JsClass<'js> for Response<'js> {
    const NAME: &'static str = "Response";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(Some(Constructor::new_class::<Self, _, _>(
            ctx.clone(),
            |ctx: Ctx<'js>, args: Rest<Value<'js>>| {
                create_response(&ctx, arg(&ctx, &args, 0), arg(&ctx, &args, 1))
            },
        )?))
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = prototype(ctx, Self::NAME)?;
        proto.prop(
            "status",
            Accessor::from(|this: This<Class<'js, Response<'js>>>| this.0.borrow().status)
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "statusText",
            Accessor::from(|this: This<Class<'js, Response<'js>>>| {
                this.0.borrow().status_text.clone()
            })
            .enumerable()
            .configurable(),
        )?;
        proto.prop(
            "headers",
            Accessor::from(|this: This<Class<'js, Response<'js>>>| this.0.borrow().headers.clone())
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "url",
            Accessor::from(|this: This<Class<'js, Response<'js>>>| this.0.borrow().url.clone())
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "redirected",
            Accessor::from(|this: This<Class<'js, Response<'js>>>| this.0.borrow().redirected)
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "type",
            Accessor::from(|this: This<Class<'js, Response<'js>>>| this.0.borrow().kind)
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "ok",
            Accessor::from(|this: This<Class<'js, Response<'js>>>| {
                (200..=299).contains(&this.0.borrow().status)
            })
            .enumerable()
            .configurable(),
        )?;
        proto.set(
            "clone",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, this: This<Class<'js, Response<'js>>>| clone_response(&ctx, this.0),
            )?,
        )?;
        add_body_methods(ctx, &proto)?;
        Ok(Some(proto))
    }
}
fn with_body<'js, T>(
    ctx: &Ctx<'js>,
    owner: &Value<'js>,
    callback: impl FnOnce(&RefCell<Body<'js>>) -> Result<T>,
) -> Result<T> {
    let object = owner
        .as_object()
        .ok_or_else(|| type_error(ctx, "Illegal body receiver"))?;
    if let Some(request) = object.as_class::<Request>() {
        return callback(&request.borrow().body);
    }
    if let Some(response) = object.as_class::<Response>() {
        return callback(&response.borrow().body);
    }
    Err(type_error(ctx, "Illegal body receiver"))
}
fn add_body_methods<'js>(ctx: &Ctx<'js>, prototype: &Object<'js>) -> Result<()> {
    prototype.prop(
        "bodyUsed",
        Accessor::from(|ctx: Ctx<'js>, this: This<Value<'js>>| {
            with_body(&ctx, &this.0, |body| Ok(body.borrow().used))
        })
        .enumerable()
        .configurable(),
    )?;
    prototype.prop(
        "body",
        Accessor::from(|ctx: Ctx<'js>, this: This<Value<'js>>| {
            with_body(&ctx, &this.0, |body| {
                if body.borrow().is_null {
                    Ok(Value::new_null(ctx.clone()))
                } else {
                    Err(unsupported(&ctx, "ReadableStream bodies are not supported"))
                }
            })
        })
        .enumerable()
        .configurable(),
    )?;
    for method in [
        "arrayBuffer",
        "bytes",
        "text",
        "json",
        "dom",
        "blob",
        "formData",
    ] {
        prototype.set(
            method,
            Function::new(
                ctx.clone(),
                move |ctx: Ctx<'js>,
                      this: This<Value<'js>>,
                      args: Rest<Value<'js>>|
                      -> Result<Promise<'js>> {
                    let result = (|| {
                        if method == "blob" || method == "formData" {
                            return Err(unsupported(
                                &ctx,
                                if method == "blob" {
                                    "Blob is not supported"
                                } else {
                                    "FormData is not supported"
                                },
                            ));
                        }
                        if method == "dom" {
                            let mime = arg(&ctx, &args, 0);
                            if !mime.is_undefined()
                                && string(&ctx, mime)?.to_ascii_lowercase() != "text/html"
                            {
                                return Err(type_error(&ctx, "Unsupported DOM MIME type"));
                            }
                        }
                        let body = with_body(&ctx, &this.0, |body| {
                            let snapshot = body.borrow().clone();
                            if snapshot.used {
                                return Err(type_error(&ctx, "Body has already been consumed"));
                            }
                            if !snapshot.is_null {
                                body.borrow_mut().used = true;
                            }
                            Ok(snapshot)
                        })?;
                        if !body.is_null {
                            if let Some(signal) = &body.signal {
                                abort::check(&ctx, signal)?;
                            }
                        }
                        let promise = if let Some(promise) = body.pending {
                            promise
                        } else {
                            let buffer = match body.bytes {
                                Some(buffer) => buffer,
                                None => ArrayBuffer::new_copy(ctx.clone(), [] as [u8; 0])?,
                            };
                            promised(&ctx, buffer.into_js(&ctx))?
                        };
                        let callback = callback(
                            &ctx,
                            Callback::BodyConvert {
                                signal: if body.is_null { None } else { body.signal },
                                method,
                            },
                        )?;
                        then(&ctx, promise, callback, Value::new_undefined(ctx.clone()))
                    })();
                    match result {
                        Ok(promise) => Ok(promise),
                        Err(error) => rejected(&ctx, exception_value(&ctx, error)),
                    }
                },
            )?,
        )?;
    }
    Ok(())
}

enum Callback<'js> {
    FetchHead {
        signal: Class<'js, Signal<'js>>,
    },
    FetchReject {
        signal: Class<'js, Signal<'js>>,
    },
    RegisterCancel {
        signal: Class<'js, Signal<'js>>,
    },
    BodySettled {
        signal: Class<'js, Signal<'js>>,
        reject: bool,
    },
    BodyConvert {
        signal: Option<Class<'js, Signal<'js>>>,
        method: &'static str,
    },
    Ignore,
}
impl<'js> Trace<'js> for Callback<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        match self {
            Self::FetchHead { signal }
            | Self::FetchReject { signal }
            | Self::RegisterCancel { signal }
            | Self::BodySettled { signal, .. } => signal.trace(tracer),
            Self::BodyConvert {
                signal: Some(signal),
                ..
            } => signal.trace(tracer),
            _ => {}
        }
    }
}
unsafe impl<'js> JsLifetime<'js> for Callback<'js> {
    type Changed<'to> = Callback<'to>;
}
fn callback<'js>(ctx: &Ctx<'js>, value: Callback<'js>) -> Result<Value<'js>> {
    Class::instance(ctx.clone(), value)?.into_js(ctx)
}
impl<'js> JsClass<'js> for Callback<'js> {
    const NAME: &'static str = "Web API continuation";
    const CALLABLE: bool = true;
    type Mutable = Readable;
    fn constructor(_: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(None)
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        Ok(Some(
            ctx.globals()
                .get::<_, Object>("Function")?
                .get("prototype")?,
        ))
    }
    fn call<'a>(this: &JsCell<'js, Self>, params: Params<'a, 'js>) -> Result<Value<'js>> {
        let ctx = params.ctx();
        let value = params
            .arg(0)
            .unwrap_or_else(|| Value::new_undefined(ctx.clone()));
        match &*this.borrow() {
            Self::Ignore => Ok(Value::new_undefined(ctx.clone())),
            Self::RegisterCancel { signal } => {
                let cancel = value
                    .into_function()
                    .ok_or_else(|| type_error(ctx, "Invalid cancellation function"))?;
                abort::add_canceller(signal, cancel)?;
                Ok(Value::new_undefined(ctx.clone()))
            }
            Self::FetchReject { signal } => {
                abort::clear_cancellers(signal);
                if let Some(reason) = signal.borrow().reason() {
                    Err(ctx.throw(reason))
                } else {
                    Err(ctx.throw(value))
                }
            }
            Self::BodySettled { signal, reject } => {
                abort::clear_cancellers(signal);
                if *reject {
                    if let Some(reason) = signal.borrow().reason() {
                        Err(ctx.throw(reason))
                    } else {
                        Err(ctx.throw(value))
                    }
                } else {
                    Ok(value)
                }
            }
            Self::FetchHead { signal } => {
                abort::check(ctx, signal)?;
                let head = value
                    .into_object()
                    .ok_or_else(|| type_error(ctx, "Invalid HTTP response"))?;
                let headers = headers::create(ctx, head.get("headers")?)?;
                headers.borrow().immutable.set(true);
                let pending: Promise = head.get("body")?;
                let pending = then(
                    ctx,
                    pending,
                    callback(
                        ctx,
                        Self::BodySettled {
                            signal: signal.clone(),
                            reject: false,
                        },
                    )?,
                    callback(
                        ctx,
                        Self::BodySettled {
                            signal: signal.clone(),
                            reject: true,
                        },
                    )?,
                )?;
                let _ = then(
                    ctx,
                    pending.clone(),
                    Value::new_undefined(ctx.clone()),
                    callback(ctx, Self::Ignore)?,
                )?;
                let is_null: bool = head.get("nullBody")?;
                let body = Body {
                    used: false,
                    is_null,
                    bytes: None,
                    pending: (!is_null).then_some(pending),
                    signal: Some(signal.clone()),
                };
                let status_text: String = head.get("statusText")?;
                let url: String = head.get("url")?;
                Class::instance(
                    ctx.clone(),
                    Response {
                        _metadata: MetadataAllocation::new(ctx, status_text.len() + url.len())?,
                        status: head.get("status")?,
                        status_text,
                        headers,
                        url,
                        redirected: head.get("redirected")?,
                        kind: "basic",
                        body: RefCell::new(body),
                    },
                )?
                .into_js(ctx)
            }
            Self::BodyConvert { signal, method } => {
                if let Some(signal) = signal {
                    abort::check(ctx, signal)?;
                }
                let bytes = crate::web_encoding::copy_buffer(ctx, &value)?;
                match *method {
                    "arrayBuffer" => ArrayBuffer::new_copy(ctx.clone(), bytes)?.into_js(ctx),
                    "bytes" => {
                        let buffer = ArrayBuffer::new_copy(ctx.clone(), bytes)?;
                        rquickjs::TypedArray::<u8>::from_arraybuffer(buffer)?.into_js(ctx)
                    }
                    "text" => decode_utf8(&bytes).into_js(ctx),
                    "json" => ctx.json_parse(decode_utf8(&bytes)),
                    "dom" => {
                        let constructor: Constructor = ctx.globals().get("DOMParser")?;
                        let parser: Object = constructor.construct(())?;
                        let parse: Function = parser.get("parseFromString")?;
                        parse.call((This(parser), decode_utf8(&bytes), "text/html"))
                    }
                    _ => unreachable!(),
                }
            }
        }
    }
}
fn decode_utf8(bytes: &[u8]) -> String {
    encoding_rs::UTF_8
        .decode_with_bom_removal(bytes)
        .0
        .into_owned()
}
struct Fetch<'js> {
    native: Function<'js>,
}
impl<'js> Trace<'js> for Fetch<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.native.trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for Fetch<'js> {
    type Changed<'to> = Fetch<'to>;
}
impl<'js> JsClass<'js> for Fetch<'js> {
    const NAME: &'static str = "fetch";
    const CALLABLE: bool = true;
    type Mutable = Readable;
    fn constructor(_: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(None)
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        Ok(Some(
            ctx.globals()
                .get::<_, Object>("Function")?
                .get("prototype")?,
        ))
    }
    fn call<'a>(this: &JsCell<'js, Self>, params: Params<'a, 'js>) -> Result<Value<'js>> {
        let ctx = params.ctx();
        let native = this.borrow().native.clone();
        let result = (|| {
            let input = params
                .arg(0)
                .ok_or_else(|| type_error(ctx, "Not enough arguments"))?;
            let init = params
                .arg(1)
                .unwrap_or_else(|| Value::new_undefined(ctx.clone()));
            let request = create_request(ctx, input, init.clone())?;
            let signal = request.borrow().signal.clone();
            abort::check(ctx, &signal)?;
            let (metadata, bytes) = {
                let state = request.borrow();
                let mut body = state.body.borrow_mut();
                if !body.is_null {
                    body.used = true;
                }
                let metadata=serde_json::json!({"url":state.url,"method":state.method,"headers":state.headers.borrow().pairs(),"redirect":state.redirect,"credentials":state.credentials,"nullBody":body.is_null}).to_string();
                let bytes = body
                    .bytes
                    .clone()
                    .map(|buffer| buffer.into_value())
                    .unwrap_or_else(|| Value::new_null(ctx.clone()));
                (metadata, bytes)
            };
            let register = callback(
                ctx,
                Callback::RegisterCancel {
                    signal: signal.clone(),
                },
            )?;
            let pending: Promise = native.call((metadata, bytes, register))?;
            then(
                ctx,
                pending,
                callback(
                    ctx,
                    Callback::FetchHead {
                        signal: signal.clone(),
                    },
                )?,
                callback(ctx, Callback::FetchReject { signal })?,
            )
        })();
        match result {
            Ok(promise) => promise.into_js(ctx),
            Err(error) => rejected(ctx, exception_value(ctx, error))?.into_js(ctx),
        }
    }
}
pub(super) fn install<'js>(ctx: &Ctx<'js>, native: Function<'js>) -> Result<()> {
    ctx.store_userdata(MetadataRoot(Rc::new(Cell::new(0))))
        .map_err(|_| type_error(ctx, "HTTP metadata budget unavailable"))?;
    Class::<Request>::define(&ctx.globals())?;
    Class::<Response>::define(&ctx.globals())?;
    let constructor: Function = ctx.globals().get("Response")?;
    constructor.set(
        "error",
        Function::new(ctx.clone(), |ctx: Ctx<'js>| {
            Class::instance(
                ctx.clone(),
                Response {
                    _metadata: MetadataAllocation::new(&ctx, 0)?,
                    status: 0,
                    status_text: String::new(),
                    headers: headers::from_pairs(&ctx, Vec::new(), true)?,
                    url: String::new(),
                    redirected: false,
                    kind: "error",
                    body: RefCell::new(Body::new(None)),
                },
            )
        })?,
    )?;
    constructor.set(
        "redirect",
        Function::new(
            ctx.clone(),
            |ctx: Ctx<'js>, args: Rest<Value<'js>>| -> Result<Class<'js, Response<'js>>> {
                required(&ctx, &args, 1)?;
                let url = normalize_url(&ctx, &args[0])?;
                let status = arg(&ctx, &args, 1);
                let status = if status.is_undefined() {
                    302.0
                } else {
                    Coerced::<f64>::from_js(&ctx, status)?.0
                };
                if ![301.0, 302.0, 303.0, 307.0, 308.0].contains(&status) {
                    return Err(Exception::throw_range(&ctx, "Invalid redirect status"));
                }
                Class::instance(
                    ctx.clone(),
                    Response {
                        _metadata: MetadataAllocation::new(&ctx, 0)?,
                        status: status as u16,
                        status_text: String::new(),
                        headers: headers::from_pairs(&ctx, vec![("location".into(), url)], true)?,
                        url: String::new(),
                        redirected: false,
                        kind: "default",
                        body: RefCell::new(Body::new(None)),
                    },
                )
            },
        )?,
    )?;
    constructor.set(
        "json",
        Function::new(
            ctx.clone(),
            |ctx: Ctx<'js>, args: Rest<Value<'js>>| -> Result<Class<'js, Response<'js>>> {
                required(&ctx, &args, 1)?;
                let text: Value =
                    crate::web_encoding::json_stringify(&ctx)?.call((args[0].clone(),))?;
                if text.is_undefined() {
                    return Err(type_error(&ctx, "Value cannot be serialized as JSON"));
                }
                let init = arg(&ctx, &args, 1);
                let options = dictionary(&ctx, init.clone())?;
                let provided = headers::create(&ctx, member(&ctx, &options, "headers")?)?;
                let has_type = provided.borrow().get("content-type").is_some();
                let response = create_response(&ctx, text, init)?;
                if !has_type {
                    response.borrow().headers.borrow().set(
                        &ctx,
                        "content-type".into(),
                        "application/json".into(),
                    )?;
                }
                Ok(response)
            },
        )?,
    )?;
    ctx.globals()
        .set("fetch", Class::instance(ctx.clone(), Fetch { native })?)?;
    Ok(())
}
