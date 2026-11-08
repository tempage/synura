//! Native Web API bindings. JavaScript objects only hold traced Rust classes;
//! transport permissions and request bytes never cross a script bridge.
use rquickjs::atom::PredefinedAtom;
use rquickjs::class::{JsCell, JsClass, Readable, Trace, Tracer};
use rquickjs::function::{Constructor, Params, Rest, This};
use rquickjs::object::{Accessor, Property};
use rquickjs::{
    qjs, Array, ArrayBuffer, Class, Coerced, Ctx, Error, Exception, FromJs, Function, IntoJs,
    JsLifetime, Object, Promise, Result, Value,
};
use std::cell::{Cell, RefCell};
use std::ffi::CString;

mod abort;
mod headers;
mod http;

pub(super) fn install<'js>(ctx: &Ctx<'js>, native_fetch: Function<'js>) -> Result<()> {
    headers::install(ctx)?;
    abort::install(ctx)?;
    http::install(ctx, native_fetch)
}

fn type_error(ctx: &Ctx<'_>, message: &str) -> Error {
    Exception::throw_type(ctx, message)
}
fn unsupported(ctx: &Ctx<'_>, message: &str) -> Error {
    dom_error(ctx, "NotSupportedError", message)
}
fn dom_error(ctx: &Ctx<'_>, name: &str, message: &str) -> Error {
    let name = CString::new(name).unwrap();
    let message = CString::new(message.replace('\0', "")).unwrap();
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
fn required(ctx: &Ctx<'_>, args: &[Value<'_>], count: usize) -> Result<()> {
    if args.len() < count {
        Err(type_error(ctx, "Not enough arguments"))
    } else {
        Ok(())
    }
}
fn arg<'js>(ctx: &Ctx<'js>, args: &[Value<'js>], index: usize) -> Value<'js> {
    args.get(index)
        .cloned()
        .unwrap_or_else(|| Value::new_undefined(ctx.clone()))
}
fn dictionary<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<Option<Object<'js>>> {
    if value.is_null() || value.is_undefined() {
        return Ok(None);
    }
    value
        .into_object()
        .map(Some)
        .ok_or_else(|| type_error(ctx, "Expected a dictionary"))
}
fn member<'js>(ctx: &Ctx<'js>, object: &Option<Object<'js>>, key: &str) -> Result<Value<'js>> {
    object
        .as_ref()
        .map(|object| object.get(key))
        .unwrap_or_else(|| Ok(Value::new_undefined(ctx.clone())))
}
fn string<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<String> {
    Ok(Coerced::<String>::from_js(ctx, value)?.0)
}
fn boolean<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<bool> {
    Ok(Coerced::<bool>::from_js(ctx, value)?.0)
}
fn usv<'js>(ctx: &Ctx<'js>, value: &Value<'js>) -> Result<String> {
    crate::web_encoding::usv_string(ctx, value)
}
fn byte_string<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<String> {
    let text = string(ctx, value)?;
    if text.chars().any(|ch| ch as u32 > 255) {
        return Err(type_error(ctx, "Expected a ByteString"));
    }
    Ok(text)
}
fn prototype<'js>(ctx: &Ctx<'js>, name: &str) -> Result<Object<'js>> {
    let proto = Object::new(ctx.clone())?;
    proto.prop(
        PredefinedAtom::SymbolToStringTag,
        Property::from(name).configurable(),
    )?;
    Ok(proto)
}
fn close_iterator<'js>(ctx: &Ctx<'js>, iterator: &Object<'js>) -> Result<()> {
    let method: Value = iterator.get("return")?;
    if method.is_null() || method.is_undefined() {
        return Ok(());
    }
    let method = method
        .into_function()
        .ok_or_else(|| type_error(ctx, "Invalid iterator return method"))?;
    let result: Value = method.call((This(iterator.clone()),))?;
    if !result.is_object() {
        return Err(type_error(ctx, "Invalid iterator return result"));
    }
    Ok(())
}
fn for_each_sequence<'js>(
    ctx: &Ctx<'js>,
    value: Value<'js>,
    limit: usize,
    mut convert: impl FnMut(Value<'js>) -> Result<bool>,
) -> Result<()> {
    let object = value
        .as_object()
        .ok_or_else(|| type_error(ctx, "Expected an iterable"))?;
    let method: Value = object.get(PredefinedAtom::SymbolIterator)?;
    let method = method
        .into_function()
        .ok_or_else(|| type_error(ctx, "Expected an iterable"))?;
    let iterator: Object = method.call((This(value),))?;
    let next: Function = iterator.get("next")?;
    let mut count = 0;
    loop {
        let item: Object = next.call((This(iterator.clone()),))?;
        if boolean(ctx, item.get("done")?)? {
            return Ok(());
        }
        let result = if count >= limit {
            Err(Exception::throw_range(ctx, "Sequence exceeds VM limit"))
        } else {
            convert(item.get("value")?)
        };
        count += 1;
        match result {
            Ok(true) => {}
            Ok(false) => return close_iterator(ctx, &iterator),
            Err(error) => {
                let original = exception_value(ctx, error);
                if matches!(close_iterator(ctx, &iterator), Err(Error::Exception)) {
                    let _ = ctx.catch();
                }
                return Err(ctx.throw(original));
            }
        }
    }
}
fn pair_sequence<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<Vec<Value<'js>>> {
    let mut pair = Vec::with_capacity(2);
    for_each_sequence(ctx, value, 2, |value| {
        pair.push(value);
        Ok(true)
    })?;
    if pair.len() != 2 {
        return Err(type_error(ctx, "Expected exactly two header items"));
    }
    Ok(pair)
}
fn has_iterator<'js>(value: &Value<'js>) -> Result<bool> {
    match value.as_object() {
        Some(object) => Ok(object
            .get::<_, Value>(PredefinedAtom::SymbolIterator)?
            .is_function()),
        None => Ok(false),
    }
}
fn exception_value<'js>(ctx: &Ctx<'js>, error: Error) -> Value<'js> {
    if !matches!(error, Error::Exception) {
        let _ = type_error(ctx, &error.to_string());
    }
    ctx.catch()
}
fn rejected<'js>(ctx: &Ctx<'js>, value: Value<'js>) -> Result<Promise<'js>> {
    let (promise, _, reject) = Promise::new(ctx)?;
    reject.call::<_, ()>((value,))?;
    Ok(promise)
}
fn promised<'js>(ctx: &Ctx<'js>, result: Result<Value<'js>>) -> Result<Promise<'js>> {
    let (promise, resolve, reject) = Promise::new(ctx)?;
    match result {
        Ok(value) => resolve.call::<_, ()>((value,))?,
        Err(error) => reject.call::<_, ()>((exception_value(ctx, error),))?,
    }
    Ok(promise)
}
fn then<'js>(
    ctx: &Ctx<'js>,
    promise: Promise<'js>,
    fulfilled: Value<'js>,
    rejected: Value<'js>,
) -> Result<Promise<'js>> {
    crate::web_encoding::promise_then(ctx)?.call((This(promise), fulfilled, rejected))
}

fn own_property<'js>(object: &Object<'js>, name: &str, value: Value<'js>) -> Result<()> {
    object.prop(
        name,
        Property::from(value).writable().enumerable().configurable(),
    )
}
fn array<'js>(ctx: &Ctx<'js>, values: impl IntoIterator<Item = Value<'js>>) -> Result<Array<'js>> {
    let array = Array::new(ctx.clone())?;
    for (index, value) in values.into_iter().enumerate() {
        own_property(array.as_object(), &index.to_string(), value)?;
    }
    Ok(array)
}
