//! Native QuickJS bindings for the public Web Crypto interfaces.
//!
//! No JavaScript bootstrap or JSON serialization crosses the binding boundary.
//! Keys live in Rust; the traced class metadata contains no native handle.
use super::{
    CryptoError, CryptoOutput, CryptoRequest, CryptoState, SensitiveJson, MAX_ARRAY_BUFFER_BYTES,
};
use boring2::rand::rand_bytes;
use rquickjs::atom::PredefinedAtom;
use rquickjs::class::{JsCell, JsClass, Readable, Trace, Tracer};
use rquickjs::function::{Constructor, Params, Rest, This};
use rquickjs::object::{Accessor, Property};
use rquickjs::{
    qjs, Array, Class, Coerced, Ctx, Error, Exception, FromJs, Function, IntoJs, JsLifetime,
    Object, Persistent, Promise, Result, TypedArray, Value,
};
use serde_json::{json, Value as Json};
use std::{
    cell::{Cell, RefCell},
    collections::HashMap,
    ffi::CString,
    ptr,
    rc::Rc,
    sync::{
        atomic::{AtomicBool, Ordering},
        mpsc, Arc,
    },
    time::Duration,
};
use zeroize::Zeroizing;

type Store = Rc<Worker>;
enum Command {
    Execute { id: u64, request: CryptoRequest },
    Release(u64),
}
struct Completion {
    id: u64,
    result: super::Result<CryptoOutput>,
}
struct Worker {
    sender: RefCell<Option<mpsc::Sender<Command>>>,
    receiver: RefCell<mpsc::Receiver<Completion>>,
    stopped: Arc<AtomicBool>,
    next_id: Cell<u64>,
}
impl Worker {
    fn new(max_bytes: usize, revoked: crate::CancellationToken) -> std::io::Result<Store> {
        let (sender, commands) = mpsc::channel();
        // Prevent completed native buffers accumulating outside the JS heap.
        let (completed, receiver) = mpsc::sync_channel(1);
        let stopped = Arc::new(AtomicBool::new(false));
        let worker_stopped = stopped.clone();
        std::thread::Builder::new()
            .name("synura-crypto".into())
            .spawn(move || {
                let mut state = CryptoState {
                    max_key_bytes: max_bytes,
                    ..CryptoState::default()
                };
                while let Ok(command) = commands.recv() {
                    if worker_stopped.load(Ordering::Acquire) || revoked.is_cancelled() {
                        break;
                    }
                    match command {
                        Command::Release(id) => state.remove_key(id),
                        Command::Execute { id, request } => {
                            let result = state.execute(&request);
                            // No JS handle crosses this boundary. A revoked host never
                            // receives late output; waiting for a full channel is bounded.
                            let mut completion = Completion { id, result };
                            loop {
                                if worker_stopped.load(Ordering::Acquire) || revoked.is_cancelled()
                                {
                                    return;
                                }
                                match completed.try_send(completion) {
                                    Ok(()) => break,
                                    Err(mpsc::TrySendError::Disconnected(_)) => return,
                                    Err(mpsc::TrySendError::Full(value)) => {
                                        completion = value;
                                        std::thread::sleep(Duration::from_millis(2));
                                    }
                                }
                            }
                        }
                    }
                }
            })?;
        Ok(Rc::new(Self {
            sender: RefCell::new(Some(sender)),
            receiver: RefCell::new(receiver),
            stopped,
            next_id: Cell::new(0),
        }))
    }
    fn send(&self, command: Command) -> super::Result<()> {
        self.sender
            .borrow()
            .as_ref()
            .ok_or_else(CryptoError::operation)?
            .send(command)
            .map_err(|_| CryptoError::operation())
    }
    fn release(&self, id: u64) {
        let _ = self.send(Command::Release(id));
    }
    fn stop(&self) {
        self.stopped.store(true, Ordering::Release);
        self.sender.borrow_mut().take();
        // Receiver is drained when the explicit host root is destroyed.
    }
}
impl Drop for Worker {
    fn drop(&mut self) {
        self.stop();
    }
}

struct Pending<'js> {
    operation: String,
    input_bytes: usize,
    format: Option<String>,
    resolve: Function<'js>,
    reject: Function<'js>,
}
impl<'js> Trace<'js> for Pending<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.resolve.trace(tracer);
        self.reject.trace(tracer);
    }
}

struct NativeKey<'js> {
    store: Store,
    id: u64,
    kind: String,
    extractable: bool,
    algorithm: Value<'js>,
    usages: Value<'js>,
}
impl Drop for NativeKey<'_> {
    fn drop(&mut self) {
        // FIFO release follows every operation submitted while this handle was live.
        self.store.release(self.id);
    }
}
impl<'js> Trace<'js> for NativeKey<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.algorithm.trace(tracer);
        self.usages.trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for NativeKey<'js> {
    type Changed<'to> = NativeKey<'to>;
}

#[derive(Clone)]
struct DataViewGetters<'js> {
    buffer: Function<'js>,
    offset: Function<'js>,
    length: Function<'js>,
}
impl<'js> Trace<'js> for DataViewGetters<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.buffer.trace(tracer);
        self.offset.trace(tracer);
        self.length.trace(tracer);
    }
}
struct NativeSubtle<'js> {
    store: RefCell<Option<Store>>,
    data_view: DataViewGetters<'js>,
    pending: RefCell<HashMap<u64, Pending<'js>>>,
    max_pending: usize,
    max_bytes: usize,
    revoked: crate::CancellationToken,
    /// Set by `CryptoPump::shutdown`; forbids lazily spawning a worker afterwards.
    shut_down: Cell<bool>,
}
impl<'js> NativeSubtle<'js> {
    fn get_store(&self, ctx: &Ctx<'js>) -> Result<Store> {
        if self.shut_down.get() || self.revoked.is_cancelled() {
            return Err(crypto_error(ctx, CryptoError::operation()));
        }
        let mut slot = self.store.borrow_mut();
        if let Some(store) = &*slot {
            return Ok(store.clone());
        }
        let store = Worker::new(self.max_bytes, self.revoked.clone())
            .map_err(|_| crypto_error(ctx, CryptoError::operation()))?;
        *slot = Some(store.clone());
        Ok(store)
    }
}
impl<'js> Trace<'js> for NativeSubtle<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.data_view.trace(tracer);
        for pending in self.pending.borrow().values() {
            pending.trace(tracer);
        }
    }
}
unsafe impl<'js> JsLifetime<'js> for NativeSubtle<'js> {
    type Changed<'to> = NativeSubtle<'to>;
}
struct NativeCrypto<'js> {
    subtle: Class<'js, NativeSubtle<'js>>,
}
impl<'js> Trace<'js> for NativeCrypto<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.subtle.trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for NativeCrypto<'js> {
    type Changed<'to> = NativeCrypto<'to>;
}

// A traced native callable avoids retaining the singleton in an untraced Rust
// closure. Thus metadata cycles and the whole context can be reclaimed by GC.
struct CryptoGetter<'js> {
    crypto: Class<'js, NativeCrypto<'js>>,
}
impl<'js> Trace<'js> for CryptoGetter<'js> {
    fn trace<'a>(&self, tracer: Tracer<'a, 'js>) {
        self.crypto.trace(tracer);
    }
}
unsafe impl<'js> JsLifetime<'js> for CryptoGetter<'js> {
    type Changed<'to> = CryptoGetter<'to>;
}
impl<'js> JsClass<'js> for CryptoGetter<'js> {
    const NAME: &'static str = "get crypto";
    const CALLABLE: bool = true;
    type Mutable = Readable;
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        Ok(Some(
            ctx.globals()
                .get::<_, Object>("Function")?
                .get("prototype")?,
        ))
    }
    fn constructor(_: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(None)
    }
    fn call<'a>(this: &JsCell<'js, Self>, _: Params<'a, 'js>) -> Result<Value<'js>> {
        Ok(this.borrow().crypto.clone().into_value())
    }
}

fn type_error(ctx: &Ctx<'_>, message: &str) -> Error {
    Exception::throw_type(ctx, message)
}
fn crypto_error(ctx: &Ctx<'_>, error: CryptoError) -> Error {
    if error.name == "TypeError" {
        return type_error(ctx, error.message);
    }
    let name = CString::new(error.name).unwrap();
    let message = CString::new(error.message).unwrap();
    // QuickJS creates its intrinsic DOMException without consulting JS globals.
    unsafe {
        qjs::JS_ThrowDOMException(
            ctx.as_raw().as_ptr(),
            name.as_ptr(),
            c"%s".as_ptr(),
            message.as_ptr(),
        );
    }
    Error::Exception
}
fn unsupported(ctx: &Ctx<'_>) -> Error {
    crypto_error(ctx, CryptoError::unsupported())
}
fn illegal_constructor<'js>(ctx: Ctx<'js>) -> Result<Value<'js>> {
    Err(type_error(&ctx, "Illegal constructor"))
}
fn constructor<'js, T: JsClass<'js>>(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
    Ok(Some(Constructor::new_class::<T, _, _>(
        ctx.clone(),
        illegal_constructor,
    )?))
}
fn prototype<'js>(ctx: &Ctx<'js>, name: &str) -> Result<Object<'js>> {
    let proto = Object::new(ctx.clone())?;
    proto.prop(
        PredefinedAtom::SymbolToStringTag,
        Property::from(name).configurable(),
    )?;
    Ok(proto)
}
impl<'js> JsClass<'js> for NativeKey<'js> {
    const NAME: &'static str = "CryptoKey";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        constructor::<Self>(ctx)
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = prototype(ctx, Self::NAME)?;
        proto.prop(
            "type",
            Accessor::from(|this: This<Class<'js, NativeKey<'js>>>| this.0.borrow().kind.clone())
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "extractable",
            Accessor::from(|this: This<Class<'js, NativeKey<'js>>>| this.0.borrow().extractable)
                .enumerable()
                .configurable(),
        )?;
        proto.prop(
            "algorithm",
            Accessor::from(|this: This<Class<'js, NativeKey<'js>>>| {
                this.0.borrow().algorithm.clone()
            })
            .enumerable()
            .configurable(),
        )?;
        proto.prop(
            "usages",
            Accessor::from(|this: This<Class<'js, NativeKey<'js>>>| this.0.borrow().usages.clone())
                .enumerable()
                .configurable(),
        )?;
        Ok(Some(proto))
    }
}
impl<'js> JsClass<'js> for NativeSubtle<'js> {
    const NAME: &'static str = "SubtleCrypto";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        constructor::<Self>(ctx)
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = prototype(ctx, Self::NAME)?;
        for (name, count) in [
            ("digest", 2),
            ("importKey", 5),
            ("exportKey", 2),
            ("generateKey", 3),
            ("encrypt", 3),
            ("decrypt", 3),
            ("sign", 3),
            ("verify", 4),
            ("wrapKey", 4),
            ("unwrapKey", 7),
            ("deriveBits", 2),
            ("deriveKey", 5),
        ] {
            let function = Function::new(
                ctx.clone(),
                move |ctx: Ctx<'js>, this: This<Value<'js>>, args: Rest<Value<'js>>| {
                    subtle_call(&ctx, this.0, &args.0, name, count)
                },
            )?
            .with_name(name)?
            .with_length(count)?;
            proto.prop(
                name,
                Property::from(function)
                    .writable()
                    .enumerable()
                    .configurable(),
            )?;
        }
        Ok(Some(proto))
    }
}
impl<'js> JsClass<'js> for NativeCrypto<'js> {
    const NAME: &'static str = "Crypto";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        constructor::<Self>(ctx)
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = prototype(ctx, Self::NAME)?;
        proto.prop(
            "subtle",
            Accessor::from(|this: This<Class<'js, NativeCrypto<'js>>>| {
                this.0.borrow().subtle.clone()
            })
            .enumerable()
            .configurable(),
        )?;
        proto.prop(
            "getRandomValues",
            Property::from(
                Function::new(ctx.clone(), random_values)?
                    .with_name("getRandomValues")?
                    .with_length(1)?,
            )
            .writable()
            .enumerable()
            .configurable(),
        )?;
        proto.prop(
            "randomUUID",
            Property::from(Function::new(ctx.clone(), random_uuid)?.with_name("randomUUID")?)
                .writable()
                .enumerable()
                .configurable(),
        )?;
        Ok(Some(proto))
    }
}

pub(super) fn install<'js>(
    ctx: &Ctx<'js>,
    max_pending: usize,
    max_bytes: usize,
    revoked: crate::CancellationToken,
) -> Result<CryptoPump> {
    let globals = ctx.globals();
    let data_view_proto: Object = globals.get::<_, Object>("DataView")?.get("prototype")?;
    let descriptor: Function = globals
        .get::<_, Object>("Object")?
        .get("getOwnPropertyDescriptor")?;
    let getter = |name: &str| -> Result<Function<'js>> {
        let property: Object = descriptor.call((data_view_proto.clone(), name))?;
        property.get("get")
    };
    let data_view = DataViewGetters {
        buffer: getter("buffer")?,
        offset: getter("byteOffset")?,
        length: getter("byteLength")?,
    };
    let subtle = Class::instance(
        ctx.clone(),
        NativeSubtle {
            store: RefCell::new(None),
            data_view,
            pending: RefCell::new(HashMap::new()),
            max_pending,
            max_bytes,
            revoked,
            shut_down: Cell::new(false),
        },
    )?;
    let pump = CryptoPump {
        subtle: Some(Persistent::save(ctx, subtle.clone())),
    };
    let crypto = Class::instance(ctx.clone(), NativeCrypto { subtle })?;
    let getter = Class::instance(ctx.clone(), CryptoGetter { crypto })?;
    getter.prop("name", Property::from("get crypto").configurable())?;
    getter.prop("length", Property::from(0).configurable())?;
    for (name, ctor) in [
        ("Crypto", constructor::<NativeCrypto>(ctx)?),
        ("SubtleCrypto", constructor::<NativeSubtle>(ctx)?),
        ("CryptoKey", constructor::<NativeKey>(ctx)?),
    ] {
        globals.prop(
            name,
            Property::from(ctor.unwrap()).writable().configurable(),
        )?;
    }
    // JS_DefineProperty borrows its values; the property retains the getter.
    unsafe {
        let atom = qjs::JS_NewAtom(ctx.as_raw().as_ptr(), c"crypto".as_ptr());
        let status = qjs::JS_DefineProperty(
            ctx.as_raw().as_ptr(),
            globals.as_value().as_raw(),
            atom,
            qjs::JS_UNDEFINED,
            getter.as_value().as_raw(),
            qjs::JS_UNDEFINED,
            (qjs::JS_PROP_HAS_GET
                | qjs::JS_PROP_HAS_SET
                | qjs::JS_PROP_HAS_ENUMERABLE
                | qjs::JS_PROP_HAS_CONFIGURABLE
                | qjs::JS_PROP_ENUMERABLE
                | qjs::JS_PROP_CONFIGURABLE
                | qjs::JS_PROP_THROW) as i32,
        );
        qjs::JS_FreeAtom(ctx.as_raw().as_ptr(), atom);
        if status < 0 {
            return Err(Error::Exception);
        }
    }
    Ok(pump)
}

fn native_json_bytes(value: &Json) -> usize {
    match value {
        Json::String(value) => value.len(),
        Json::Array(values) => values.iter().map(native_json_bytes).sum(),
        Json::Object(values) => values
            .iter()
            .map(|(key, value)| key.len() + native_json_bytes(value))
            .sum(),
        _ => 8,
    }
}
fn string<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<String> {
    let value = Coerced::<String>::from_js(ctx, value)?.0;
    if value.len() > MAX_ARRAY_BUFFER_BYTES {
        return Err(crypto_error(ctx, CryptoError::limit()));
    }
    Ok(value)
}
fn unsigned<'js>(ctx: &Ctx<'js>, value: Value<'js>, bits: u32) -> Result<u64> {
    if value.is_big_int() {
        return Err(type_error(ctx, "Expected an unsigned number"));
    }
    let number = Coerced::<f64>::from_js(ctx, value)?.0;
    let number = number.trunc();
    if !number.is_finite() || number < 0.0 || number > ((1u64 << bits) - 1) as f64 {
        return Err(type_error(ctx, "Unsigned number is out of range"));
    }
    Ok(number as u64)
}
fn member<'js>(object: &Object<'js>, name: &str) -> Result<Value<'js>> {
    let value: Value = object.get(name)?;
    if value.is_undefined() {
        Err(type_error(
            object.ctx(),
            "Required algorithm member is missing",
        ))
    } else {
        Ok(value)
    }
}

// No JavaScript is called while the raw pointer is in use. The owned buffer
// pins its storage, and SharedArrayBuffer is rejected before taking the pointer.
struct BufferRegion<'js> {
    _buffer: Value<'js>,
    pointer: *mut u8,
    length: usize,
}
fn region<'js>(
    ctx: &Ctx<'js>,
    value: &Value<'js>,
    getters: Option<&DataViewGetters<'js>>,
) -> Result<BufferRegion<'js>> {
    let mut offset: qjs::size_t = 0;
    let mut length: qjs::size_t = 0;
    let buffer;
    unsafe {
        if qjs::JS_IsArrayBuffer(value.as_raw()) {
            buffer = value.clone();
        } else if qjs::JS_GetTypedArrayType(value.as_raw()) >= 0 {
            let raw = qjs::JS_GetTypedArrayBuffer(
                ctx.as_raw().as_ptr(),
                value.as_raw(),
                &mut offset,
                &mut length,
                ptr::null_mut(),
            );
            if qjs::JS_IsException(raw) {
                return Err(Error::Exception);
            }
            buffer = Value::from_raw(ctx.clone(), raw);
        } else if qjs::JS_IsDataView(value.as_raw()) {
            let getters = getters.ok_or_else(|| type_error(ctx, "Expected a typed array"))?;
            buffer = getters.buffer.call((This(value.clone()),))?;
            offset = getters.offset.call((This(value.clone()),))?;
            length = getters.length.call((This(value.clone()),))?;
        } else {
            return Err(type_error(ctx, "Expected a BufferSource"));
        }
        if !qjs::JS_IsArrayBuffer(buffer.as_raw()) {
            return Err(type_error(ctx, "Shared buffers are not supported"));
        }
        let mut total: qjs::size_t = 0;
        let pointer = qjs::JS_GetArrayBuffer(ctx.as_raw().as_ptr(), &mut total, buffer.as_raw());
        if pointer.is_null() {
            return Err(Error::Exception);
        }
        if qjs::JS_IsArrayBuffer(value.as_raw()) {
            length = total;
        }
        if offset
            .checked_add(length)
            .filter(|&end| end <= total)
            .is_none()
        {
            return Err(type_error(ctx, "Buffer view is out of bounds"));
        }
        Ok(BufferRegion {
            _buffer: buffer,
            pointer: pointer.add(offset as usize),
            length: length as usize,
        })
    }
}
struct RequestBuilder<'js> {
    request: RefCell<CryptoRequest>,
    store: Store,
    // Keep getter-produced keys alive through all later coercions and enqueue.
    keys: RefCell<Vec<Class<'js, NativeKey<'js>>>>,
    max_bytes: usize,
}
impl<'js> RequestBuilder<'js> {
    fn new(store: &Store, max_bytes: usize) -> Self {
        Self {
            request: RefCell::new(CryptoRequest {
                params: Json::Null,
                buffers: Vec::new(),
            }),
            store: store.clone(),
            keys: RefCell::new(Vec::new()),
            max_bytes,
        }
    }
    fn bytes(
        &self,
        ctx: &Ctx<'js>,
        value: &Value<'js>,
        getters: &DataViewGetters<'js>,
    ) -> Result<Json> {
        let view = region(ctx, value, Some(getters))?;
        let used: usize = self
            .request
            .borrow()
            .buffers
            .iter()
            .map(|bytes| bytes.len())
            .sum();
        if used.saturating_add(view.length) > self.max_bytes.min(MAX_ARRAY_BUFFER_BYTES) {
            return Err(crypto_error(ctx, CryptoError::limit()));
        }
        let mut data = Zeroizing::new(Vec::new());
        data.try_reserve_exact(view.length)
            .map_err(|_| crypto_error(ctx, CryptoError::operation()))?;
        // Snapshot before another conversion can run script. No Base64 round trip.
        data.extend_from_slice(unsafe { std::slice::from_raw_parts(view.pointer, view.length) });
        let mut request = self.request.borrow_mut();
        request
            .buffers
            .try_reserve(1)
            .map_err(|_| crypto_error(ctx, CryptoError::operation()))?;
        let index = request.buffers.len();
        request.buffers.push(data);
        Ok(json!({"$buffer":index}))
    }
}
fn random_values<'js>(
    ctx: Ctx<'js>,
    this: This<Value<'js>>,
    args: Rest<Value<'js>>,
) -> Result<Value<'js>> {
    Class::<NativeCrypto>::from_value(&this.0)
        .map_err(|_| type_error(&ctx, "Illegal invocation"))?;
    let array = args
        .0
        .first()
        .ok_or_else(|| type_error(&ctx, "Not enough arguments"))?;
    let kind = unsafe { qjs::JS_GetTypedArrayType(array.as_raw()) };
    if kind < 0 || kind > qjs::JSTypedArrayEnum_JS_TYPED_ARRAY_BIG_UINT64 as i32 {
        return Err(crypto_error(
            &ctx,
            CryptoError::new("TypeMismatchError", "Expected an integer typed array"),
        ));
    }
    let view = region(&ctx, array, None)?;
    if view.length > 65536 {
        return Err(crypto_error(
            &ctx,
            CryptoError::new("QuotaExceededError", "Random data exceeds 65536 bytes"),
        ));
    }
    // No JS is called between acquiring the pointer and finishing the write.
    rand_bytes(unsafe { std::slice::from_raw_parts_mut(view.pointer, view.length) })
        .map_err(|_| crypto_error(&ctx, CryptoError::operation()))?;
    Ok(array.clone())
}
fn random_uuid<'js>(ctx: Ctx<'js>, this: This<Value<'js>>) -> Result<String> {
    Class::<NativeCrypto>::from_value(&this.0)
        .map_err(|_| type_error(&ctx, "Illegal invocation"))?;
    let mut bytes = [0u8; 16];
    rand_bytes(&mut bytes).map_err(|_| crypto_error(&ctx, CryptoError::operation()))?;
    bytes[6] = bytes[6] & 15 | 64;
    bytes[8] = bytes[8] & 63 | 128;
    let mut output = String::with_capacity(36);
    for (i, byte) in bytes.iter().enumerate() {
        if [4, 6, 8, 10].contains(&i) {
            output.push('-');
        }
        use std::fmt::Write;
        write!(output, "{byte:02x}").unwrap();
    }
    Ok(output)
}

fn algorithm<'js>(
    ctx: &Ctx<'js>,
    input: &Value<'js>,
    operation: &str,
    getters: &DataViewGetters<'js>,
    builder: &RequestBuilder<'js>,
) -> Result<Json> {
    let object = input.as_object();
    let spelling = if let Some(object) = object {
        string(ctx, member(object, "name")?)?
    } else {
        string(ctx, input.clone())?
    };
    let name = match spelling.to_ascii_uppercase().as_str() {
        "RSASSA-PKCS1-V1_5" => "RSASSA-PKCS1-v1_5".to_owned(),
        "ED25519" => "Ed25519".to_owned(),
        _ => spelling.to_ascii_uppercase(),
    };
    if ![
        "SHA-1",
        "SHA-256",
        "SHA-384",
        "SHA-512",
        "AES-GCM",
        "AES-CBC",
        "HMAC",
        "RSA-OAEP",
        "RSASSA-PKCS1-v1_5",
        "RSA-PSS",
        "PBKDF2",
        "HKDF",
        "ECDSA",
        "ECDH",
        "Ed25519",
        "X25519",
    ]
    .contains(&name.as_str())
    {
        return Err(unsupported(ctx));
    }
    let mut result = json!({"name":name});
    let is_hash = name.starts_with("SHA-");
    if operation == "digest" {
        return if is_hash {
            Ok(result)
        } else {
            Err(unsupported(ctx))
        };
    }
    if is_hash {
        return Err(unsupported(ctx));
    }
    let required = |name| {
        object
            .ok_or_else(|| type_error(ctx, "Algorithm parameters are required"))
            .and_then(|o| member(o, name))
    };
    let optional = |name| -> Result<Value<'js>> {
        object
            .map(|o| o.get(name))
            .unwrap_or_else(|| Ok(Value::new_undefined(ctx.clone())))
    };
    let is_rsa = matches!(name.as_str(), "RSA-OAEP" | "RSASSA-PKCS1-v1_5" | "RSA-PSS");
    match operation {
        "importKey" | "generateKey" | "get key length" => {
            if operation == "generateKey" && matches!(name.as_str(), "HKDF" | "PBKDF2") {
                return Err(unsupported(ctx));
            }
            if operation == "get key length"
                && !matches!(
                    name.as_str(),
                    "AES-GCM" | "AES-CBC" | "HMAC" | "HKDF" | "PBKDF2"
                )
            {
                return Err(unsupported(ctx));
            }
            if name == "HMAC" || is_rsa {
                result["hash"] = algorithm(ctx, &required("hash")?, "digest", getters, builder)?;
            }
            if name == "HMAC" {
                let length = optional("length")?;
                if !length.is_undefined() {
                    result["length"] = unsigned(ctx, length, 32)?.into();
                }
            } else if operation != "importKey" && name.starts_with("AES-") {
                result["length"] = unsigned(ctx, required("length")?, 16)?.into();
            } else if operation == "generateKey" && is_rsa {
                result["modulusLength"] = unsigned(ctx, required("modulusLength")?, 32)?.into();
                let exponent = required("publicExponent")?;
                if unsafe { qjs::JS_GetTypedArrayType(exponent.as_raw()) }
                    != qjs::JSTypedArrayEnum_JS_TYPED_ARRAY_UINT8 as i32
                {
                    return Err(type_error(ctx, "publicExponent must be a Uint8Array"));
                }
                result["publicExponent"] = builder.bytes(ctx, &exponent, getters)?;
            } else if matches!(name.as_str(), "ECDSA" | "ECDH") {
                result["namedCurve"] = string(ctx, required("namedCurve")?)?.into();
            }
        }
        "sign" | "verify" => match name.as_str() {
            "HMAC" | "RSASSA-PKCS1-v1_5" | "Ed25519" => {}
            "RSA-PSS" => {
                result["saltLength"] = unsigned(ctx, required("saltLength")?, 32)?.into();
            }
            "ECDSA" => {
                result["hash"] = algorithm(ctx, &required("hash")?, "digest", getters, builder)?;
            }
            _ => return Err(unsupported(ctx)),
        },
        "deriveBits" | "deriveKey" => match name.as_str() {
            "PBKDF2" | "HKDF" => {
                result["hash"] = algorithm(ctx, &required("hash")?, "digest", getters, builder)?;
                result["salt"] = builder.bytes(ctx, &required("salt")?, getters)?;
                if name == "PBKDF2" {
                    result["iterations"] = unsigned(ctx, required("iterations")?, 32)?.into();
                } else {
                    result["info"] = builder.bytes(ctx, &required("info")?, getters)?;
                }
            }
            "ECDH" | "X25519" => {
                result["public"] = key_id(ctx, &required("public")?, builder)?;
            }
            _ => return Err(unsupported(ctx)),
        },
        "encrypt" | "decrypt" | "wrapKey" | "unwrapKey" => {
            if name == "AES-GCM" || name == "AES-CBC" {
                result["iv"] = builder.bytes(ctx, &required("iv")?, getters)?;
                if name == "AES-GCM" {
                    let aad = optional("additionalData")?;
                    if !aad.is_undefined() {
                        result["additionalData"] = builder.bytes(ctx, &aad, getters)?;
                    }
                    let tag = optional("tagLength")?;
                    if !tag.is_undefined() {
                        result["tagLength"] = unsigned(ctx, tag, 8)?.into();
                    }
                }
            } else if name == "RSA-OAEP" {
                let label = optional("label")?;
                if !label.is_undefined() {
                    result["label"] = builder.bytes(ctx, &label, getters)?;
                }
            } else {
                return Err(unsupported(ctx));
            }
        }
        _ => return Err(unsupported(ctx)),
    }
    Ok(result)
}
fn sequence<'js, F>(ctx: &Ctx<'js>, value: &Value<'js>, mut convert: F) -> Result<Vec<Json>>
where
    F: FnMut(Value<'js>) -> Result<Json>,
{
    let object = value
        .as_object()
        .ok_or_else(|| type_error(ctx, "Expected an iterable sequence"))?;
    let method: Function = object.get(PredefinedAtom::SymbolIterator).map_err(|e| {
        if matches!(e, Error::Exception) {
            e
        } else {
            type_error(ctx, "Expected an iterable sequence")
        }
    })?;
    let iterator: Object = method.call((This(object.clone()),))?;
    let next: Function = iterator.get("next")?;
    let mut result = Vec::new();
    let mut allocated_bytes: usize = 0;
    loop {
        let item: Object = next.call((This(iterator.clone()),))?;
        if Coerced::<bool>::from_js(ctx, item.get("done")?)?.0 {
            break;
        }
        result
            .try_reserve(1)
            .map_err(|_| crypto_error(ctx, CryptoError::operation()))?;
        let value = item.get("value")?;
        let converted = convert(value).and_then(|value| {
            allocated_bytes = allocated_bytes.saturating_add(native_json_bytes(&value));
            if result.len() >= 4096 || allocated_bytes > MAX_ARRAY_BUFFER_BYTES {
                return Err(crypto_error(ctx, CryptoError::limit()));
            }
            Ok(value)
        });
        match converted {
            Ok(value) => result.push(SensitiveJson(value)),
            Err(error) => {
                // IteratorClose must not replace the original conversion error.
                let exception = if matches!(error, Error::Exception) {
                    Some(ctx.catch())
                } else {
                    None
                };
                if let Ok(close) = iterator.get::<_, Function>("return") {
                    let _ = close.call::<_, Value>((This(iterator.clone()),));
                }
                let _ = ctx.catch();
                return Err(exception.map(|v| ctx.throw(v)).unwrap_or(error));
            }
        }
    }
    Ok(result
        .into_iter()
        .map(|mut value| std::mem::take(&mut value.0))
        .collect())
}
fn usages<'js>(ctx: &Ctx<'js>, value: &Value<'js>) -> Result<Json> {
    sequence(ctx, value, |v| {
        let usage = string(ctx, v)?;
        if ![
            "encrypt",
            "decrypt",
            "sign",
            "verify",
            "deriveKey",
            "deriveBits",
            "wrapKey",
            "unwrapKey",
        ]
        .contains(&usage.as_str())
        {
            return Err(type_error(ctx, "Invalid key usage"));
        }
        Ok(Json::String(usage))
    })
    .map(Json::Array)
}
fn format<'js>(ctx: &Ctx<'js>, value: &Value<'js>) -> Result<String> {
    let format = string(ctx, value.clone())?;
    if !["raw", "jwk", "spki", "pkcs8"].contains(&format.as_str()) {
        return Err(type_error(ctx, "Invalid key format"));
    }
    Ok(format)
}
fn jwk<'js>(ctx: &Ctx<'js>, value: &Value<'js>) -> Result<Json> {
    if value.is_null() || value.is_undefined() {
        return Ok(json!({}));
    }
    let object = value
        .as_object()
        .ok_or_else(|| type_error(ctx, "Expected a JsonWebKey dictionary"))?;
    let mut output = SensitiveJson(json!({}));
    let jwk_bytes = Cell::new(0usize);
    let key_string = |value: Value<'js>| -> Result<Json> {
        let mut text = Zeroizing::new(string(ctx, value)?);
        let size = jwk_bytes.get().saturating_add(text.len());
        if size > MAX_ARRAY_BUFFER_BYTES {
            return Err(crypto_error(ctx, CryptoError::limit()));
        }
        jwk_bytes.set(size);
        Ok(Json::String(std::mem::take(&mut *text)))
    };
    for name in [
        "kty", "use", "alg", "crv", "x", "y", "d", "n", "e", "p", "q", "dp", "dq", "qi", "k",
    ] {
        let value: Value = object.get(name)?;
        if !value.is_undefined() {
            output[name] = key_string(value)?;
        }
    }
    let key_ops: Value = object.get("key_ops")?;
    if !key_ops.is_undefined() {
        output["key_ops"] = Json::Array(sequence(ctx, &key_ops, key_string)?);
    }
    let ext: Value = object.get("ext")?;
    if !ext.is_undefined() {
        output["ext"] = Json::Bool(Coerced::<bool>::from_js(ctx, ext)?.0);
    }
    let oth: Value = object.get("oth")?;
    if !oth.is_undefined() {
        output["oth"] = Json::Array(sequence(ctx, &oth, |v| {
            if v.is_null() || v.is_undefined() {
                return Ok(json!({}));
            }
            let prime = v
                .as_object()
                .ok_or_else(|| type_error(ctx, "Invalid RSA other-prime information"))?;
            let mut output = SensitiveJson(json!({}));
            for name in ["r", "d", "t"] {
                let value: Value = prime.get(name)?;
                if !value.is_undefined() {
                    output[name] = key_string(value)?;
                }
            }
            Ok(std::mem::take(&mut output.0))
        })?);
    }
    Ok(std::mem::take(&mut output.0))
}

fn key_id<'js>(ctx: &Ctx<'js>, value: &Value<'js>, builder: &RequestBuilder<'js>) -> Result<Json> {
    let class = Class::<NativeKey>::from_value(value)
        .map_err(|_| type_error(ctx, "Expected a CryptoKey"))?;
    let id = {
        let key = class.borrow();
        if !Rc::ptr_eq(&key.store, &builder.store) {
            return Err(type_error(ctx, "Key belongs to another runtime"));
        }
        key.id
    };
    let mut keys = builder.keys.borrow_mut();
    keys.try_reserve(1)
        .map_err(|_| crypto_error(ctx, CryptoError::operation()))?;
    keys.push(class);
    Ok(id.into())
}

fn request<'js>(
    ctx: &Ctx<'js>,
    subtle: &NativeSubtle<'js>,
    store: &Store,
    args: &[Value<'js>],
    op: &str,
) -> Result<RequestBuilder<'js>> {
    let builder = RequestBuilder::new(store, subtle.max_bytes);
    let getters = &subtle.data_view;
    let alg = |i, op| algorithm(ctx, &args[i], op, getters, &builder);
    let data = |i| builder.bytes(ctx, &args[i], getters);
    let key = |i| key_id(ctx, &args[i], &builder);
    let mut r = SensitiveJson(json!({"op":op}));
    match op {
        "digest" => {
            r["algorithm"] = alg(0, op)?;
            r["data"] = data(1)?;
        }
        "importKey" => {
            let f = format(ctx, &args[0])?;
            r["keyData"] = if f == "jwk" {
                jwk(ctx, &args[1])?
            } else {
                builder.bytes(ctx, &args[1], getters)?
            };
            r["format"] = f.into();
            r["algorithm"] = alg(2, op)?;
            r["extractable"] = Coerced::<bool>::from_js(ctx, args[3].clone())?.0.into();
            r["usages"] = usages(ctx, &args[4])?;
        }
        "generateKey" => {
            r["algorithm"] = alg(0, op)?;
            r["extractable"] = Coerced::<bool>::from_js(ctx, args[1].clone())?.0.into();
            r["usages"] = usages(ctx, &args[2])?;
        }
        "exportKey" => {
            r["format"] = format(ctx, &args[0])?.into();
            r["key"] = key(1)?;
        }
        "encrypt" | "decrypt" | "sign" => {
            r["algorithm"] = alg(0, op)?;
            r["key"] = key(1)?;
            r["data"] = data(2)?;
        }
        "verify" => {
            r["algorithm"] = alg(0, op)?;
            r["key"] = key(1)?;
            r["signature"] = data(2)?;
            r["data"] = data(3)?;
        }
        "wrapKey" => {
            r["format"] = format(ctx, &args[0])?.into();
            r["key"] = key(1)?;
            r["wrappingKey"] = key(2)?;
            r["algorithm"] = alg(3, op)?;
        }
        "unwrapKey" => {
            r["format"] = format(ctx, &args[0])?.into();
            r["data"] = data(1)?;
            r["unwrappingKey"] = key(2)?;
            r["algorithm"] = alg(3, op)?;
            r["unwrappedKeyAlgorithm"] = alg(4, "importKey")?;
            r["extractable"] = Coerced::<bool>::from_js(ctx, args[5].clone())?.0.into();
            r["usages"] = usages(ctx, &args[6])?;
        }
        "deriveBits" | "deriveKey" => {
            r["algorithm"] = alg(0, op)?;
            r["key"] = key(1)?;
            if op == "deriveBits" {
                r["length"] = match args.get(2) {
                    None => Json::Null,
                    Some(length) if length.is_null() || length.is_undefined() => Json::Null,
                    Some(length) => {
                        // Web Crypto Level 2 uses nullable unsigned long without
                        // EnforceRange here. ToUint32 wraps and maps non-finite to 0.
                        if length.is_big_int() {
                            return Err(type_error(ctx, "Expected an unsigned number"));
                        }
                        (Coerced::<i32>::from_js(ctx, length.clone())?.0 as u32).into()
                    }
                };
            } else {
                // The standard normalizes the same dictionary twice. Its getters
                // are observable, and import metadata may differ from key length.
                r["derivedKeyAlgorithm"] = alg(2, "importKey")?;
                r["derivedKeyLengthAlgorithm"] = alg(2, "get key length")?;
                r["extractable"] = Coerced::<bool>::from_js(ctx, args[3].clone())?.0.into();
                r["usages"] = usages(ctx, &args[4])?;
            }
        }
        _ => return Err(unsupported(ctx)),
    }
    builder.request.borrow_mut().params = std::mem::take(&mut r.0);
    Ok(builder)
}

fn public_value<'js>(ctx: &Ctx<'js>, value: &Json) -> Result<Value<'js>> {
    match value {
        Json::Null => Ok(Value::new_null(ctx.clone())),
        Json::Bool(v) => v.into_js(ctx),
        Json::Number(v) => v.as_f64().unwrap().into_js(ctx),
        Json::String(v) => v.into_js(ctx),
        Json::Array(values) => {
            let array = Array::new(ctx.clone())?;
            for (index, item) in values.iter().enumerate() {
                array.as_object().prop(
                    index as u32,
                    Property::from(public_value(ctx, item)?)
                        .writable()
                        .enumerable()
                        .configurable(),
                )?;
            }
            Ok(array.into_value())
        }
        Json::Object(values) => {
            let object = Object::new(ctx.clone())?;
            for (name, item) in values {
                object.prop(
                    name.as_str(),
                    Property::from(public_value(ctx, item)?)
                        .writable()
                        .enumerable()
                        .configurable(),
                )?;
            }
            Ok(object.into_value())
        }
    }
}
fn make_key<'js>(ctx: &Ctx<'js>, store: &Store, value: &Json) -> Result<Value<'js>> {
    let id = value["id"].as_u64().unwrap();
    let result = (|| {
        let algorithm = public_value(ctx, &value["algorithm"])?;
        if let Some(exponent) = value["algorithm"]["publicExponent"].as_array() {
            let bytes: Vec<u8> = exponent.iter().map(|v| v.as_u64().unwrap() as u8).collect();
            algorithm.as_object().unwrap().prop(
                "publicExponent",
                Property::from(TypedArray::new(ctx.clone(), bytes)?)
                    .writable()
                    .enumerable()
                    .configurable(),
            )?;
        }
        let usages = public_value(ctx, &value["usages"])?;
        Ok(Class::instance(
            ctx.clone(),
            NativeKey {
                store: store.clone(),
                id,
                kind: value["type"].as_str().unwrap().into(),
                extractable: value["extractable"].as_bool().unwrap(),
                algorithm,
                usages,
            },
        )?
        .into_value())
    })();
    if result.is_err() {
        store.release(id);
    }
    result
}
fn output_buffer<'js>(ctx: &Ctx<'js>, data: Zeroizing<Vec<u8>>) -> Result<Value<'js>> {
    if data.len() > MAX_ARRAY_BUFFER_BYTES {
        return Err(crypto_error(ctx, CryptoError::limit()));
    }
    let length = data.len();
    unsafe extern "C" fn release(
        rt: *mut qjs::JSRuntime,
        opaque: *mut std::ffi::c_void,
        pointer: *mut std::ffi::c_void,
    ) {
        // Detachment releases the data immediately; finalization can call us
        // again with a null pointer and the original opaque length.
        if !pointer.is_null() {
            use zeroize::Zeroize;
            std::slice::from_raw_parts_mut(pointer.cast::<u8>(), opaque as usize).zeroize();
            qjs::js_free_rt(rt, pointer);
        }
    }
    unsafe {
        // Completed results must count against the VM heap too. Adopting a Rust
        // Vec bypasses QuickJS's allocator and lets retained exports grow without
        // a bound even when every pending operation and key fits its quota.
        let pointer = qjs::js_malloc(ctx.as_raw().as_ptr(), length.max(1) as _).cast::<u8>();
        if pointer.is_null() {
            return Err(Error::Exception);
        }
        ptr::copy_nonoverlapping(data.as_ptr(), pointer, length);
        let raw = qjs::JS_NewArrayBuffer(
            ctx.as_raw().as_ptr(),
            pointer,
            length as _,
            Some(release),
            length as *mut std::ffi::c_void,
            false,
        );
        if qjs::JS_IsException(raw) {
            release(
                qjs::JS_GetRuntime(ctx.as_raw().as_ptr()),
                length as *mut std::ffi::c_void,
                pointer.cast(),
            );
            return Err(Error::Exception);
        }
        Ok(Value::from_raw(ctx.clone(), raw))
    }
}
fn output<'js>(
    ctx: &Ctx<'js>,
    store: &Store,
    operation: &str,
    format: Option<&str>,
    result: &mut CryptoOutput,
) -> Result<Value<'js>> {
    let value = &result.value;
    match operation {
        "importKey" | "unwrapKey" | "deriveKey" => make_key(ctx, store, value),
        "generateKey" => {
            if value.get("publicKey").is_some() {
                let pair = Object::new(ctx.clone())?;
                pair.prop(
                    "publicKey",
                    Property::from(make_key(ctx, store, &value["publicKey"])?)
                        .writable()
                        .enumerable()
                        .configurable(),
                )?;
                pair.prop(
                    "privateKey",
                    Property::from(make_key(ctx, store, &value["privateKey"])?)
                        .writable()
                        .enumerable()
                        .configurable(),
                )?;
                Ok(pair.into_value())
            } else {
                make_key(ctx, store, value)
            }
        }
        "verify" => public_value(ctx, value),
        "exportKey" if format == Some("jwk") => public_value(ctx, value),
        _ => output_buffer(
            ctx,
            result
                .bytes
                .take()
                .ok_or_else(|| crypto_error(ctx, CryptoError::operation()))?,
        ),
    }
}

// The primitive may allocate two RSA keys before any JavaScript object exists.
// Roll back every uncommitted ID if metadata/class/property allocation fails.
// Removal is idempotent when an already wrapped NativeKey has also finalized.
struct KeyAllocationGuard {
    store: Store,
    ids: Vec<u64>,
    committed: bool,
}
impl KeyAllocationGuard {
    fn new(store: &Store, descriptor: &Json) -> Self {
        let ids = [
            descriptor.get("id"),
            descriptor.pointer("/publicKey/id"),
            descriptor.pointer("/privateKey/id"),
        ]
        .into_iter()
        .flatten()
        .filter_map(Json::as_u64)
        .collect();
        Self {
            store: store.clone(),
            ids,
            committed: false,
        }
    }
}
impl Drop for KeyAllocationGuard {
    fn drop(&mut self) {
        if !self.committed {
            for id in &self.ids {
                self.store.release(*id);
            }
        }
    }
}
fn reject_error<'js>(ctx: &Ctx<'js>, reject: &Function<'js>, error: Error) -> Result<()> {
    let value = if matches!(error, Error::Exception) {
        ctx.catch()
    } else {
        let _ = type_error(ctx, &error.to_string());
        ctx.catch()
    };
    reject.call::<_, ()>((value,))
}
fn subtle_call<'js>(
    ctx: &Ctx<'js>,
    this: Value<'js>,
    args: &[Value<'js>],
    operation: &str,
    count: usize,
) -> Result<Promise<'js>> {
    let (promise, resolve, reject) = Promise::new(ctx)?;
    let queued = (|| {
        let class = Class::<NativeSubtle>::from_value(&this)
            .map_err(|_| type_error(ctx, "Illegal invocation"))?;
        if args.len() < count {
            return Err(type_error(ctx, "Not enough arguments"));
        }
        let subtle = class.borrow();
        if subtle.revoked.is_cancelled() {
            return Err(crypto_error(ctx, CryptoError::operation()));
        }
        if let Some(store) = &*subtle.store.borrow() {
            if store.stopped.load(Ordering::Acquire) {
                return Err(crypto_error(ctx, CryptoError::operation()));
            }
        }
        if subtle.pending.borrow().len() >= subtle.max_pending {
            return Err(crypto_error(ctx, CryptoError::limit()));
        }
        let store = subtle.get_store(ctx)?;
        let builder = request(ctx, &subtle, &store, args, operation)?;
        let id = store
            .next_id
            .get()
            .checked_add(1)
            .ok_or_else(|| crypto_error(ctx, CryptoError::operation()))?;
        store.next_id.set(id);
        let request = builder.request.replace(CryptoRequest {
            params: Json::Null,
            buffers: Vec::new(),
        });
        let input_bytes = request
            .buffers
            .iter()
            .map(|bytes| bytes.len())
            .sum::<usize>()
            .saturating_add(native_json_bytes(&request.params));
        let queued_bytes: usize = subtle
            .pending
            .borrow()
            .values()
            .map(|pending| pending.input_bytes)
            .sum();
        if input_bytes.saturating_add(queued_bytes) > subtle.max_bytes {
            return Err(crypto_error(ctx, CryptoError::limit()));
        }
        let pending = Pending {
            operation: operation.into(),
            input_bytes,
            format: request.params["format"].as_str().map(str::to_owned),
            resolve,
            reject: reject.clone(),
        };
        subtle
            .pending
            .borrow_mut()
            .try_reserve(1)
            .map_err(|_| crypto_error(ctx, CryptoError::operation()))?;
        store
            .send(Command::Execute { id, request })
            .map_err(|e| crypto_error(ctx, e))?;
        // Submission precedes dropping builder-held keys, including getter results.
        subtle.pending.borrow_mut().insert(id, pending);
        Ok(())
    })();
    if let Err(error) = queued {
        reject_error(ctx, &reject, error)?;
    }
    Ok(promise)
}

/// Explicit host root and completion pump. Pending JS functions are fields of a
/// traced class, not closures or persistent values hidden in the worker thread.
pub(crate) struct CryptoPump {
    subtle: Option<Persistent<Class<'static, NativeSubtle<'static>>>>,
}
impl CryptoPump {
    pub(crate) fn is_worker_spawned(&self, ctx: &Ctx<'_>) -> Result<bool> {
        let Some(saved) = &self.subtle else {
            return Ok(false);
        };
        let class = saved.clone().restore(ctx)?;
        let spawned = class.borrow().store.borrow().is_some();
        Ok(spawned)
    }
    pub(crate) fn pending(&self, ctx: &Ctx<'_>) -> Result<bool> {
        let Some(saved) = &self.subtle else {
            return Ok(false);
        };
        let class = saved.clone().restore(ctx)?;
        let pending = !class.borrow().pending.borrow().is_empty();
        Ok(pending)
    }
    pub(crate) fn poll(&self, ctx: &Ctx<'_>, wait: bool) -> Result<bool> {
        let Some(saved) = &self.subtle else {
            return Ok(false);
        };
        let class = saved.clone().restore(ctx)?;
        let subtle = class.borrow();
        let store = subtle.store.borrow().clone();
        let Some(store) = store else {
            return Ok(false);
        };
        let completion = {
            let receiver = store.receiver.borrow();
            if wait && !subtle.pending.borrow().is_empty() {
                match receiver.recv_timeout(Duration::from_millis(10)) {
                    Ok(value) => Some(value),
                    Err(mpsc::RecvTimeoutError::Timeout) => None,
                    Err(mpsc::RecvTimeoutError::Disconnected) => {
                        drop(receiver);
                        let pending = std::mem::take(&mut *subtle.pending.borrow_mut());
                        for (_, item) in pending {
                            reject_error(
                                ctx,
                                &item.reject,
                                crypto_error(ctx, CryptoError::operation()),
                            )?;
                        }
                        return Ok(true);
                    }
                }
            } else {
                receiver.try_recv().ok()
            }
        };
        let Some(completion) = completion else {
            return Ok(false);
        };
        let pending = subtle.pending.borrow_mut().remove(&completion.id);
        let Some(pending) = pending else {
            if let Ok(value) = completion.result {
                drop(KeyAllocationGuard::new(&store, &value.value));
            }
            return Ok(true);
        };
        let result = (|| {
            let mut result = completion.result.map_err(|e| crypto_error(ctx, e))?;
            let mut allocation = KeyAllocationGuard::new(&store, &result.value);
            let value = output(
                ctx,
                &store,
                &pending.operation,
                pending.format.as_deref(),
                &mut result,
            )?;
            allocation.committed = true;
            Ok(value)
        })();
        match result {
            Ok(value) => pending.resolve.call::<_, ()>((value,))?,
            Err(error) => reject_error(ctx, &pending.reject, error)?,
        }
        Ok(true)
    }
    pub(crate) fn shutdown(&mut self, ctx: &Ctx<'_>) {
        if let Some(saved) = self.subtle.take() {
            if let Ok(class) = saved.restore(ctx) {
                let subtle = class.borrow();
                // Detached from the pump: a later call must not lazily spawn a worker
                // that nothing would ever poll or stop.
                subtle.shut_down.set(true);
                if let Some(store) = subtle.store.borrow().as_ref() {
                    store.stop();
                    while store.receiver.borrow().try_recv().is_ok() {}
                }
                subtle.pending.borrow_mut().clear();
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rquickjs::{Context, Runtime};

    #[test]
    fn subtle_call_after_shutdown_does_not_spawn_worker() {
        let runtime = Runtime::new().unwrap();
        let context = Context::full(&runtime).unwrap();
        context.with(|ctx| {
            // Mirrors the install-failure path: shutdown without revoking the token.
            let mut pump = install(&ctx, 8, 1 << 20, crate::CancellationToken::default()).unwrap();
            pump.shutdown(&ctx);
            ctx.eval::<(), _>(
                "globalThis.reason = null; \
                 crypto.subtle.digest('SHA-256', new Uint8Array(1)) \
                     .then(() => { reason = 'fulfilled'; }, e => { reason = e.name; });",
            )
            .unwrap();
        });
        while runtime.execute_pending_job().unwrap() {}
        context.with(|ctx| {
            let reason: Option<String> = ctx.eval("reason").unwrap();
            assert_eq!(reason.as_deref(), Some("OperationError"));
            let subtle: Value = ctx.eval("crypto.subtle").unwrap();
            let class = Class::<NativeSubtle>::from_value(&subtle).unwrap();
            assert!(
                class.borrow().store.borrow().is_none(),
                "no worker may be spawned after shutdown"
            );
        });
    }
}
