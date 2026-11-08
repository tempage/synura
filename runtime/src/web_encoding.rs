//! Native Encoding API and trusted BufferSource conversion.
use encoding_rs::Encoding;
use rquickjs::{
    atom::PredefinedAtom,
    class::{JsClass, Readable, Trace, Tracer},
    function::{Constructor, Opt, This},
    object::{Accessor, Property},
    qjs, Class, Ctx, Error, Exception, Function, JsLifetime, Object, Result, TypedArray, Value,
};
use std::ptr;

// These intrinsic functions are fixed at VM initialization. They are bounded
// external roots, explicitly removed before context/runtime destruction.
struct BufferAccess<'js> {
    buffer: Function<'js>,
    offset: Function<'js>,
    length: Function<'js>,
    promise_then: Function<'js>,
    json_stringify: Function<'js>,
}
unsafe impl<'js> JsLifetime<'js> for BufferAccess<'js> {
    type Changed<'to> = BufferAccess<'to>;
}

pub(super) fn install(ctx: &Ctx<'_>) -> Result<()> {
    let object: Object = ctx.globals().get("Object")?;
    let descriptor: Function = object.get("getOwnPropertyDescriptor")?;
    let prototype: Object = ctx
        .globals()
        .get::<_, Object>("DataView")?
        .get("prototype")?;
    let getter = |name: &str| -> Result<Function> {
        descriptor
            .call::<_, Object>((prototype.clone(), name))?
            .get("get")
    };
    ctx.store_userdata(BufferAccess {
        buffer: getter("buffer")?,
        offset: getter("byteOffset")?,
        length: getter("byteLength")?,
        promise_then: ctx
            .globals()
            .get::<_, Object>("Promise")?
            .get::<_, Object>("prototype")?
            .get("then")?,
        json_stringify: ctx.globals().get::<_, Object>("JSON")?.get("stringify")?,
    })
    .map_err(|_| Exception::throw_type(ctx, "Encoding intrinsics unavailable"))?;
    Class::<TextEncoder>::define(&ctx.globals())?;
    Class::<TextDecoder>::define(&ctx.globals())?;
    Ok(())
}

pub(super) fn shutdown(ctx: &Ctx<'_>) {
    let _ = ctx.remove_userdata::<BufferAccess>();
}

pub(super) fn promise_then<'js>(ctx: &Ctx<'js>) -> Result<Function<'js>> {
    ctx.userdata::<BufferAccess>()
        .map(|access| access.promise_then.clone())
        .ok_or_else(|| Exception::throw_type(ctx, "Web intrinsics unavailable"))
}
pub(super) fn json_stringify<'js>(ctx: &Ctx<'js>) -> Result<Function<'js>> {
    ctx.userdata::<BufferAccess>()
        .map(|access| access.json_stringify.clone())
        .ok_or_else(|| Exception::throw_type(ctx, "Web intrinsics unavailable"))
}

/// Coerce while retaining the result in the accounted JavaScript heap.
pub(super) fn coerce_string<'js>(ctx: &Ctx<'js>, value: &Value<'js>) -> Result<Value<'js>> {
    unsafe {
        let raw = qjs::JS_ToString(ctx.as_raw().as_ptr(), value.as_raw());
        if qjs::JS_IsException(raw) {
            return Err(Error::Exception);
        }
        Ok(Value::from_raw(ctx.clone(), raw))
    }
}

/// Convert a JS string's WTF-8 representation to Unicode scalar values.
pub(super) fn usv_string(ctx: &Ctx<'_>, value: &Value<'_>) -> Result<String> {
    unsafe {
        let raw = qjs::JS_ToString(ctx.as_raw().as_ptr(), value.as_raw());
        if qjs::JS_IsException(raw) {
            return Err(Error::Exception);
        }
        let string = Value::from_raw(ctx.clone(), raw);
        let mut length: usize = 0;
        let pointer = qjs::JS_ToCStringLen(ctx.as_raw().as_ptr(), &mut length, string.as_raw());
        if pointer.is_null() {
            return Err(Error::Exception);
        }
        if length > 16 * 1024 * 1024 {
            qjs::JS_FreeCString(ctx.as_raw().as_ptr(), pointer);
            return Err(Exception::throw_range(
                ctx,
                "Web API string exceeds VM limit",
            ));
        }
        let bytes = std::slice::from_raw_parts(pointer.cast::<u8>(), length as usize);
        let mut output = Vec::with_capacity(bytes.len());
        let mut index = 0;
        while index < bytes.len() {
            if bytes[index] == 0xed
                && bytes
                    .get(index + 1)
                    .is_some_and(|b| (0xa0..=0xbf).contains(b))
                && bytes
                    .get(index + 2)
                    .is_some_and(|b| (0x80..=0xbf).contains(b))
            {
                output.extend_from_slice(&[0xef, 0xbf, 0xbd]);
                index += 3;
            } else {
                output.push(bytes[index]);
                index += 1;
            }
        }
        qjs::JS_FreeCString(ctx.as_raw().as_ptr(), pointer);
        String::from_utf8(output).map_err(|_| Exception::throw_type(ctx, "Invalid string encoding"))
    }
}

pub(super) fn copy_buffer<'js>(ctx: &Ctx<'js>, value: &Value<'js>) -> Result<Vec<u8>> {
    unsafe {
        let mut offset: qjs::size_t = 0;
        let mut length: qjs::size_t = 0;
        let buffer = if qjs::JS_IsArrayBuffer(value.as_raw()) {
            value.clone()
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
            Value::from_raw(ctx.clone(), raw)
        } else if qjs::JS_IsDataView(value.as_raw()) {
            let access = ctx
                .userdata::<BufferAccess>()
                .ok_or_else(|| Exception::throw_type(ctx, "Encoding intrinsics unavailable"))?;
            let buffer: Value = access.buffer.call((This(value.clone()),))?;
            offset = access.offset.call((This(value.clone()),))?;
            length = access.length.call((This(value.clone()),))?;
            buffer
        } else {
            return Err(Exception::throw_type(ctx, "Expected a BufferSource"));
        };
        if !qjs::JS_IsArrayBuffer(buffer.as_raw()) {
            return Err(Exception::throw_type(
                ctx,
                "Shared buffers are not supported",
            ));
        }
        let mut total: qjs::size_t = 0;
        let pointer = qjs::JS_GetArrayBuffer(ctx.as_raw().as_ptr(), &mut total, buffer.as_raw());
        if pointer.is_null() {
            return Err(Error::Exception);
        }
        if qjs::JS_IsArrayBuffer(value.as_raw()) {
            length = total;
        }
        if offset.checked_add(length).is_none_or(|end| end > total) {
            return Err(Exception::throw_type(ctx, "Buffer view is out of bounds"));
        }
        if length as usize > 16 * 1024 * 1024 {
            return Err(Exception::throw_range(ctx, "Buffer exceeds VM limit"));
        }
        // No JavaScript runs while the pinned buffer pointer is being copied.
        Ok(std::slice::from_raw_parts(pointer.add(offset as usize), length as usize).to_vec())
    }
}

pub(super) fn decode(
    ctx: &Ctx<'_>,
    encoding: &'static Encoding,
    bytes: &[u8],
    fatal: bool,
    ignore_bom: bool,
) -> Result<String> {
    let mut decoder = if ignore_bom {
        encoding.new_decoder_without_bom_handling()
    } else {
        encoding.new_decoder_with_bom_removal()
    };
    let capacity = decoder
        .max_utf8_buffer_length(bytes.len())
        .ok_or_else(|| Exception::throw_range(ctx, "Decoded text is too large"))?;
    let mut output = String::new();
    output
        .try_reserve_exact(capacity)
        .map_err(|_| Exception::throw_range(ctx, "Cannot allocate decoded text"))?;
    if fatal {
        let (result, _) = decoder.decode_to_string_without_replacement(bytes, &mut output, true);
        if !matches!(result, encoding_rs::DecoderResult::InputEmpty) {
            return Err(Exception::throw_type(ctx, "Invalid encoded data"));
        }
    } else {
        let (result, _, _) = decoder.decode_to_string(bytes, &mut output, true);
        if !matches!(result, encoding_rs::CoderResult::InputEmpty) {
            return Err(Exception::throw_range(ctx, "Decoded text is too large"));
        }
    }
    Ok(output)
}

pub(super) fn dictionary<'js>(
    ctx: &Ctx<'js>,
    value: Option<Value<'js>>,
) -> Result<Option<Object<'js>>> {
    match value {
        None => Ok(None),
        Some(value) if value.is_null() || value.is_undefined() => Ok(None),
        Some(value) => value
            .into_object()
            .map(Some)
            .ok_or_else(|| Exception::throw_type(ctx, "Expected a dictionary")),
    }
}

#[derive(Clone, Copy)]
struct TextEncoder;
impl<'js> Trace<'js> for TextEncoder {
    fn trace<'a>(&self, _: Tracer<'a, 'js>) {}
}
unsafe impl<'js> JsLifetime<'js> for TextEncoder {
    type Changed<'to> = Self;
}
impl<'js> JsClass<'js> for TextEncoder {
    const NAME: &'static str = "TextEncoder";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(Some(Constructor::new_class::<Self, _, _>(
            ctx.clone(),
            |ctx: Ctx<'js>| Class::instance(ctx, TextEncoder),
        )?))
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = Object::new(ctx.clone())?;
        proto.prop(
            PredefinedAtom::SymbolToStringTag,
            Property::from(Self::NAME).configurable(),
        )?;
        proto.prop(
            "encoding",
            Accessor::from(|_: This<Class<'js, TextEncoder>>| "utf-8"),
        )?;
        proto.set(
            "encode",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>, _: This<Class<'js, TextEncoder>>, input: Opt<Value<'js>>| {
                    let input = match input.0 {
                        Some(v) if !v.is_undefined() => usv_string(&ctx, &v)?,
                        _ => String::new(),
                    };
                    TypedArray::<u8>::new_copy(ctx, input.as_bytes())
                },
            )?,
        )?;
        proto.set(
            "encodeInto",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 _: This<Class<'js, TextEncoder>>,
                 input: Value<'js>,
                 destination: Value<'js>|
                 -> Result<Object<'js>> {
                    let input = usv_string(&ctx, &input)?;
                    if unsafe { qjs::JS_GetTypedArrayType(destination.as_raw()) }
                        != qjs::JSTypedArrayEnum_JS_TYPED_ARRAY_UINT8 as i32
                    {
                        return Err(Exception::throw_type(
                            &ctx,
                            "Expected Uint8Array destination",
                        ));
                    }
                    let destination = TypedArray::<u8>::from_value(destination)?;
                    let raw = destination
                        .as_raw()
                        .ok_or_else(|| Exception::throw_type(&ctx, "Detached ArrayBuffer"))?;
                    let mut read = 0;
                    let mut written = 0;
                    for ch in input.chars() {
                        let mut bytes = [0u8; 4];
                        let encoded = ch.encode_utf8(&mut bytes).as_bytes();
                        if written + encoded.len() > raw.len {
                            break;
                        }
                        // Conversion finished before taking this pointer; no JS calls
                        // occur until every write has completed.
                        unsafe {
                            ptr::copy_nonoverlapping(
                                encoded.as_ptr(),
                                raw.ptr.as_ptr().add(written),
                                encoded.len(),
                            );
                        }
                        read += ch.len_utf16();
                        written += encoded.len();
                    }
                    let result = Object::new(ctx)?;
                    result.prop(
                        "read",
                        Property::from(read).writable().enumerable().configurable(),
                    )?;
                    result.prop(
                        "written",
                        Property::from(written)
                            .writable()
                            .enumerable()
                            .configurable(),
                    )?;
                    Ok(result)
                },
            )?,
        )?;
        Ok(Some(proto))
    }
}

struct TextDecoder {
    encoding: &'static Encoding,
    fatal: bool,
    ignore_bom: bool,
}
impl<'js> Trace<'js> for TextDecoder {
    fn trace<'a>(&self, _: Tracer<'a, 'js>) {}
}
unsafe impl<'js> JsLifetime<'js> for TextDecoder {
    type Changed<'to> = Self;
}
impl<'js> JsClass<'js> for TextDecoder {
    const NAME: &'static str = "TextDecoder";
    type Mutable = Readable;
    fn constructor(ctx: &Ctx<'js>) -> Result<Option<Constructor<'js>>> {
        Ok(Some(Constructor::new_class::<Self, _, _>(
            ctx.clone(),
            |ctx: Ctx<'js>, label: Opt<Value<'js>>, options: Opt<Value<'js>>| {
                let label = match label.0 {
                    Some(v) if !v.is_undefined() => usv_string(&ctx, &v)?,
                    _ => "utf-8".into(),
                };
                let encoding = Encoding::for_label(label.as_bytes())
                    .filter(|encoding| *encoding != encoding_rs::REPLACEMENT)
                    .ok_or_else(|| Exception::throw_range(&ctx, "Unsupported encoding label"))?;
                let options = dictionary(&ctx, options.0)?;
                let option = |name: &str| -> Result<bool> {
                    Ok(options
                        .as_ref()
                        .map(|o| o.get::<_, rquickjs::Coerced<bool>>(name))
                        .transpose()?
                        .is_some_and(|v| v.0))
                };
                Class::instance(
                    ctx.clone(),
                    Self {
                        encoding,
                        fatal: option("fatal")?,
                        ignore_bom: option("ignoreBOM")?,
                    },
                )
            },
        )?))
    }
    fn prototype(ctx: &Ctx<'js>) -> Result<Option<Object<'js>>> {
        let proto = Object::new(ctx.clone())?;
        proto.prop(
            PredefinedAtom::SymbolToStringTag,
            Property::from(Self::NAME).configurable(),
        )?;
        proto.prop(
            "encoding",
            Accessor::from(|this: This<Class<'js, Self>>| {
                this.0.borrow().encoding.name().to_ascii_lowercase()
            }),
        )?;
        proto.prop(
            "fatal",
            Accessor::from(|this: This<Class<'js, Self>>| this.0.borrow().fatal),
        )?;
        proto.prop(
            "ignoreBOM",
            Accessor::from(|this: This<Class<'js, Self>>| this.0.borrow().ignore_bom),
        )?;
        proto.set(
            "decode",
            Function::new(
                ctx.clone(),
                |ctx: Ctx<'js>,
                 this: This<Class<'js, Self>>,
                 input: Opt<Value<'js>>,
                 options: Opt<Value<'js>>|
                 -> Result<String> {
                    let options = dictionary(&ctx, options.0)?;
                    if options
                        .map(|o| o.get::<_, rquickjs::Coerced<bool>>("stream"))
                        .transpose()?
                        .is_some_and(|v| v.0)
                    {
                        unsafe {
                            qjs::JS_ThrowDOMException(
                                ctx.as_raw().as_ptr(),
                                c"NotSupportedError".as_ptr(),
                                c"%s".as_ptr(),
                                c"Streaming TextDecoder is not supported".as_ptr(),
                            );
                        }
                        return Err(Error::Exception);
                    }
                    let bytes = match input.0 {
                        Some(value) if !value.is_undefined() => copy_buffer(&ctx, &value)?,
                        _ => Vec::new(),
                    };
                    let decoder = this.0.borrow();
                    decode(
                        &ctx,
                        decoder.encoding,
                        &bytes,
                        decoder.fatal,
                        decoder.ignore_bom,
                    )
                },
            )?,
        )?;
        Ok(Some(proto))
    }
}
