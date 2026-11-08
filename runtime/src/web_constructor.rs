//! Enforce native Web API constructors' `new` requirement in the engine.
//!
//! rquickjs's generic class constructor is also callable as a plain function.
//! QuickJS's constructor-only C entry point rejects those calls before entering
//! Rust, including Function.call/apply and forged `this` values. Original class
//! constructors stay in private, bounded context roots and are released by the
//! VM before its context is destroyed.
use rquickjs::{
    object::Property, qjs, Ctx, Error, Exception, Function, JsLifetime, Object, Result, Value,
};
use std::{
    ffi::CString,
    panic::{catch_unwind, AssertUnwindSafe},
    ptr::NonNull,
};

const CONSTRUCTORS: &[(&str, &[&str])] = &[
    ("DOMParser", &[]),
    ("TextEncoder", &[]),
    ("TextDecoder", &[]),
    ("URLSearchParams", &[]),
    ("Headers", &[]),
    ("Request", &[]),
    ("Response", &["error", "redirect", "json"]),
    ("AbortController", &[]),
    ("AbortSignal", &["abort", "timeout", "any"]),
];

struct Constructors<'js>(Vec<Function<'js>>);
// Only the functions' context lifetime changes; the roots never leave this VM.
unsafe impl<'js> JsLifetime<'js> for Constructors<'js> {
    type Changed<'to> = Constructors<'to>;
}

unsafe extern "C" fn construct(
    raw_context: *mut qjs::JSContext,
    new_target: qjs::JSValue,
    argc: std::ffi::c_int,
    argv: *mut qjs::JSValue,
    magic: std::ffi::c_int,
) -> qjs::JSValue {
    // QuickJS calls this entry while holding the runtime lock. The local Ctx
    // cannot escape this call, and constructor arguments are borrowed by both
    // C calls. JS_CallConstructor2 returns a new owned JSValue to QuickJS.
    let result = catch_unwind(AssertUnwindSafe(|| unsafe {
        let Some(pointer) = NonNull::new(raw_context) else {
            return qjs::JS_EXCEPTION;
        };
        let ctx = Ctx::from_raw(pointer);
        let original = ctx.userdata::<Constructors>().and_then(|roots| {
            usize::try_from(magic)
                .ok()
                .and_then(|index| roots.0.get(index).cloned())
        });
        match original {
            Some(original) => {
                qjs::JS_CallConstructor2(raw_context, original.as_raw(), new_target, argc, argv)
            }
            None => qjs::JS_ThrowTypeError(raw_context, c"Web constructor unavailable".as_ptr()),
        }
    }));
    match result {
        Ok(value) => value,
        // Never let a Rust unwind cross the engine's C ABI.
        Err(_) => unsafe {
            qjs::JS_ThrowInternalError(raw_context, c"Web constructor failed".as_ptr())
        },
    }
}

pub(crate) fn install<'js>(ctx: &Ctx<'js>) -> Result<()> {
    if ctx.userdata::<Constructors>().is_some() {
        return Err(Exception::throw_type(
            ctx,
            "Web constructors already installed",
        ));
    }
    let originals = CONSTRUCTORS
        .iter()
        .map(|(name, _)| ctx.globals().get::<_, Function>(*name))
        .collect::<Result<Vec<_>>>()?;
    ctx.store_userdata(Constructors(originals.clone()))
        .map_err(|_| Exception::throw_type(ctx, "Web constructor roots unavailable"))?;
    let result = (|| {
        for (index, ((name, statics), original)) in CONSTRUCTORS.iter().zip(originals).enumerate() {
            let prototype: Object = original.get("prototype")?;
            let length: i32 = original.get("length")?;
            let name_c = CString::new(*name).expect("static constructor names contain no NUL");
            // The union preserves the callback pointer representation. cproto
            // tells QuickJS to call its constructor_magic member with 5 args.
            let callback = unsafe {
                qjs::JSCFunctionType {
                    constructor_magic: Some(construct),
                }
                .generic
            };
            let raw = unsafe {
                qjs::JS_NewCFunction2(
                    ctx.as_raw().as_ptr(),
                    callback,
                    name_c.as_ptr(),
                    length,
                    qjs::JSCFunctionEnum_JS_CFUNC_constructor_magic,
                    index as i32,
                )
            };
            if unsafe { qjs::JS_IsException(raw) } {
                return Err(Error::Exception);
            }
            // JS_NewCFunction2 returned an owned value; Value owns and frees it.
            let wrapper = unsafe { Value::from_raw(ctx.clone(), raw) }
                .into_function()
                .ok_or_else(|| Exception::throw_type(ctx, "Invalid native constructor"))?;
            unsafe {
                qjs::JS_SetConstructor(ctx.as_raw().as_ptr(), wrapper.as_raw(), prototype.as_raw());
            }
            for method in *statics {
                let value: Value = original.get(*method)?;
                wrapper.prop(*method, Property::from(value).writable().configurable())?;
            }
            ctx.globals().set(*name, wrapper)?;
        }
        Ok(())
    })();
    if result.is_err() {
        shutdown(ctx);
    }
    result
}

pub(crate) fn shutdown(ctx: &Ctx<'_>) {
    let _ = ctx.remove_userdata::<Constructors>();
}
