//! Promise delivery for HTTP work; only the host thread accesses JavaScript.
use super::fetch_async::{FetchEvent, FetchPlan};
use super::fetch_transport::{HttpResponseHead, HttpTransport};
use super::{CancellationToken, FetchMetric, FetchRequest, NetworkScope, NetworkState};
use rquickjs::class::{JsCell, JsClass, Readable, Trace, Tracer};
use rquickjs::function::{Constructor, Params};
use rquickjs::{
    qjs, ArrayBuffer, Class, Coerced, Ctx, Error, Exception, FromJs, Function, IntoJs, JsLifetime,
    Object, Persistent, Promise, Result, Value,
};
use std::cell::{Cell, RefCell};
use std::collections::HashMap;
use std::rc::Rc;
use std::sync::mpsc;
use std::time::Duration;

struct Pending<'js> {
    request: FetchRequest,
    head: Option<HttpResponseHead>,
    resolve: Function<'js>,
    reject: Function<'js>,
    body: Option<(Function<'js>, Function<'js>)>,
}
impl<'js> Trace<'js> for Pending<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.resolve.trace(tracer);
        self.reject.trace(tracer);
        if let Some((resolve, reject)) = &self.body {
            resolve.trace(tracer);
            reject.trace(tracer);
        }
    }
}

struct NativeFetch<'js> {
    host: Rc<RefCell<NetworkState>>,
    transport: RefCell<Option<HttpTransport>>,
    sender: mpsc::Sender<FetchEvent>,
    receiver: RefCell<mpsc::Receiver<FetchEvent>>,
    next_id: Cell<u64>,
    pending: RefCell<HashMap<u64, Pending<'js>>>,
    stopped: Cell<bool>,
}
impl<'js> Trace<'js> for NativeFetch<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        for pending in self.pending.borrow().values() {
            pending.trace(tracer);
        }
    }
}
unsafe impl<'js> JsLifetime<'js> for NativeFetch<'js> {
    type Changed<'to> = NativeFetch<'to>;
}
impl<'js> JsClass<'js> for NativeFetch<'js> {
    const NAME: &'static str = "fetch dispatch";
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
        let (promise, resolve, reject) = Promise::new(ctx)?;
        let queued = (|| {
            let native = this.borrow();
            if native.stopped.get() {
                return Err(fetch_error(ctx, "context canceled"));
            }
            let request = Coerced::<String>::from_js(
                ctx,
                params
                    .arg(0)
                    .unwrap_or_else(|| Value::new_undefined(ctx.clone())),
            )?;
            // Headers and URL metadata are native allocations outside the JS
            // heap. Bound them before deserializing or cloning request plans.
            if request.0.len() > 64 * 1024 {
                return Err(fetch_error(ctx, "Fetch metadata exceeds VM limit"));
            }
            let mut request: FetchRequest = serde_json::from_str(&request.0)
                .map_err(|error| fetch_error(ctx, &format!("invalid fetch request: {error}")))?;
            let revoked = native.host.borrow().revoked.clone();
            if revoked.is_cancelled() {
                return Err(fetch_error(ctx, "context canceled"));
            }
            if native.pending.borrow().len() >= native.host.borrow().max_pending {
                return Err(fetch_error(ctx, "Too many pending fetch requests"));
            }
            if let Some(value) = params
                .arg(1)
                .filter(|value| !value.is_null() && !value.is_undefined())
            {
                let buffer = ArrayBuffer::from_value(value)
                    .ok_or_else(|| fetch_error(ctx, "Expected an ArrayBuffer body"))?;
                let bytes = buffer
                    .as_bytes()
                    .ok_or_else(|| fetch_error(ctx, "Detached request body"))?;
                if bytes.len() > super::MAX_BODY_BYTES {
                    return Err(fetch_error(ctx, "Request body exceeds VM limit"));
                }
                request.body = Some(bytes.to_vec());
            }
            let request_cancellation = CancellationToken::default();
            if let Some(register) = params.arg(2).and_then(|value| value.into_function()) {
                let token = request_cancellation.clone();
                register.call::<_, ()>((Function::new(ctx.clone(), move || token.cancel())?,))?;
            }
            let plan = {
                let host = native.host.borrow();
                FetchPlan {
                    request: request.clone(),
                    scope: host
                        .fetch_scope
                        .clone()
                        .unwrap_or_else(NetworkScope::default),
                    overrides: host.fetch_overrides.clone(),
                    timeout_ms: host.timeout_ms,
                    proxy: host.fetch_proxy.clone(),
                    cancellation: host.fetch_cancellation.clone(),
                    revoked: host.revoked.clone(),
                    request_cancellation,
                    authority_check: host.authority_check.clone(),
                }
            };
            let id = native
                .next_id
                .get()
                .checked_add(1)
                .ok_or_else(|| fetch_error(ctx, "fetch request identifier exhausted"))?;
            native.next_id.set(id);
            native
                .pending
                .borrow_mut()
                .try_reserve(1)
                .map_err(|_| fetch_error(ctx, "cannot allocate pending fetch"))?;
            let mut transport = native.transport.borrow_mut();
            if transport.is_none() {
                *transport = Some(HttpTransport::new().map_err(|error| fetch_error(ctx, &error))?);
            }
            transport
                .as_ref()
                .unwrap()
                .submit(id, plan, native.sender.clone())
                .map_err(|error| fetch_error(ctx, &error))?;
            native.pending.borrow_mut().insert(
                id,
                Pending {
                    request,
                    head: None,
                    resolve,
                    reject: reject.clone(),
                    body: None,
                },
            );
            Ok(())
        })();
        if let Err(error) = queued {
            reject_error(ctx, &reject, error)?;
        }
        promise.into_js(ctx)
    }
}

fn fetch_error(ctx: &Ctx<'_>, message: &str) -> Error {
    if message == "context canceled" {
        unsafe {
            qjs::JS_ThrowDOMException(
                ctx.as_raw().as_ptr(),
                c"AbortError".as_ptr(),
                c"%s".as_ptr(),
                c"The operation was aborted".as_ptr(),
            );
        }
        Error::Exception
    } else {
        Exception::throw_type(ctx, message)
    }
}
fn reject_error<'js>(ctx: &Ctx<'js>, reject: &Function<'js>, error: Error) -> Result<()> {
    let value = if matches!(error, Error::Exception) {
        ctx.catch()
    } else {
        let _ = fetch_error(ctx, &error.to_string());
        ctx.catch()
    };
    reject.call::<_, ()>((value,))
}

pub(super) struct FetchPump {
    native: Option<Persistent<Class<'static, NativeFetch<'static>>>>,
}
pub(super) fn install<'js>(ctx: &Ctx<'js>, host: Rc<RefCell<NetworkState>>) -> Result<FetchPump> {
    let (sender, receiver) = mpsc::channel();
    let native = Class::instance(
        ctx.clone(),
        NativeFetch {
            host,
            transport: RefCell::new(None),
            sender,
            receiver: RefCell::new(receiver),
            next_id: Cell::new(0),
            pending: RefCell::new(HashMap::new()),
            stopped: Cell::new(false),
        },
    )?;
    Ok(FetchPump {
        native: Some(Persistent::save(ctx, native)),
    })
}
impl FetchPump {
    pub(super) fn function<'js>(&self, ctx: &Ctx<'js>) -> Result<Function<'js>> {
        let saved = self
            .native
            .as_ref()
            .ok_or_else(|| fetch_error(ctx, "context canceled"))?;
        Function::from_js(ctx, saved.clone().restore(ctx)?.into_value())
    }
    pub(super) fn pending(&self, ctx: &Ctx<'_>) -> Result<bool> {
        let Some(saved) = &self.native else {
            return Ok(false);
        };
        let class = saved.clone().restore(ctx)?;
        let pending = !class.borrow().pending.borrow().is_empty();
        Ok(pending)
    }
    pub(super) fn poll(&self, ctx: &Ctx<'_>, wait: bool) -> Result<bool> {
        let Some(saved) = &self.native else {
            return Ok(false);
        };
        let class = saved.clone().restore(ctx)?;
        let native = class.borrow();
        let event = {
            let receiver = native.receiver.borrow();
            if wait && !native.pending.borrow().is_empty() {
                receiver.recv_timeout(Duration::from_millis(10)).ok()
            } else {
                receiver.try_recv().ok()
            }
        };
        let Some(event) = event else { return Ok(false) };
        match event {
            FetchEvent::Headers { id, response } => {
                let pending = native.pending.borrow_mut().remove(&id);
                let Some(mut pending) = pending else {
                    return Ok(true);
                };
                let converted = (|| {
                    let object = Object::new(ctx.clone())?;
                    object.set_prototype(None)?;
                    object.set("status", response.status)?;
                    object.set("statusText", response.status_text.clone())?;
                    object.set("url", response.url.clone())?;
                    object.set("redirected", response.redirected)?;
                    object.set("nullBody", response.null_body)?;
                    object.set(
                        "headers",
                        ctx.json_parse(serde_json::to_string(&response.headers).unwrap())?,
                    )?;
                    let (body, resolve, reject) = Promise::new(ctx)?;
                    object.set("body", body)?;
                    pending.body = Some((resolve, reject));
                    Ok(object)
                })();
                match converted {
                    Ok(object) => {
                        pending.head = Some(response);
                        let resolve = pending.resolve.clone();
                        native.pending.borrow_mut().insert(id, pending);
                        resolve.call::<_, ()>((object,))?;
                    }
                    Err(error) => reject_error(ctx, &pending.reject, error)?,
                }
            }
            FetchEvent::Complete {
                id,
                body,
                network_ms,
            } => {
                let pending = native.pending.borrow_mut().remove(&id);
                if let Some(pending) = pending {
                    if let Some(head) = &pending.head {
                        let mut host = native.host.borrow_mut();
                        // Metrics must not grow without bound in an app using poll().
                        if host.metrics.len() >= 256 {
                            host.metrics.remove(0);
                        }
                        host.metrics.push(FetchMetric {
                            request_url: pending.request.url.clone(),
                            method: pending.request.method.clone(),
                            status: head.status,
                            headers: head.headers.clone(),
                            network_ms,
                        });
                    }
                    if let Some((resolve, reject)) = pending.body {
                        match ArrayBuffer::new_copy(ctx.clone(), body) {
                            Ok(buffer) => resolve.call::<_, ()>((buffer,))?,
                            Err(error) => reject_error(ctx, &reject, error)?,
                        }
                    }
                }
            }
            FetchEvent::Error { id, message } => {
                let pending = native.pending.borrow_mut().remove(&id);
                if let Some(pending) = pending {
                    let reject = pending
                        .body
                        .as_ref()
                        .map(|(_, reject)| reject)
                        .unwrap_or(&pending.reject);
                    reject_error(ctx, reject, fetch_error(ctx, &message))?;
                }
            }
        }
        Ok(true)
    }
    pub(super) fn shutdown(&mut self, ctx: &Ctx<'_>) {
        if let Some(saved) = self.native.take() {
            if let Ok(class) = saved.restore(ctx) {
                let native = class.borrow();
                native.stopped.set(true);
                if let Some(mut transport) = native.transport.borrow_mut().take() {
                    transport.shutdown();
                }
                native.pending.borrow_mut().clear();
                while native.receiver.borrow().try_recv().is_ok() {}
            }
        }
    }
}
