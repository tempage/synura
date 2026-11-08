//! Native constructors reject ordinary calls while preserving subclassing.
use serde_json::{json, Value};
use synura_runtime::rquickjs::CatchResultExt;
use synura_runtime::{Vm, VmConfig};

fn evaluate(vm: &Vm, source: &str) -> Value {
    vm.begin_turn().unwrap();
    let encoded = vm
        .context()
        .with(|ctx| {
            ctx.eval::<String, _>(format!("JSON.stringify(({source}))"))
                .catch(&ctx)
                .map_err(|error| error.to_string())
        })
        .unwrap();
    serde_json::from_str(&encoded).unwrap()
}

#[test]
fn constructors_require_new_even_with_forged_receiver() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
        const types = [DOMParser,TextEncoder,TextDecoder,URLSearchParams,Headers,Request,Response,AbortController,AbortSignal];
        const fails = call => { try { call(); return false; } catch(error) { return error instanceof TypeError; } };
        return types.map(type => [
            fails(() => type()),
            fails(() => type.call(type, 'https://example.com')),
            fails(() => type.apply(function Forged(){}, ['https://example.com'])),
            fails(() => Reflect.apply(type, type, ['https://example.com'])),
            type.prototype.constructor === type,
            String(type).includes('[native code]')
        ]);
    })()"#,
    );
    assert_eq!(actual, json!(vec![vec![true; 6]; 9]));
}

#[test]
fn native_constructor_forwarding_preserves_new_target() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
        class Parser extends DOMParser {}
        class Encoder extends TextEncoder {}
        class Decoder extends TextDecoder {}
        class Params extends URLSearchParams {}
        class HeaderMap extends Headers {}
        class HttpRequest extends Request {}
        class HttpResponse extends Response {}
        class Controller extends AbortController {}
        const cases = [
            [Parser, DOMParser, []], [Encoder,TextEncoder,[]], [Decoder,TextDecoder,[]],
            [Params,URLSearchParams,['a=1']], [HeaderMap,Headers,[{'x-test':'ok'}]],
            [HttpRequest,Request,['https://example.com']], [HttpResponse,Response,['body']],
            [Controller,AbortController,[]]
        ];
        const result = cases.map(([sub,base,args]) => {
            const instance = Reflect.construct(sub,args);
            return instance instanceof sub && instance instanceof base && Object.getPrototypeOf(instance) === sub.prototype;
        });
        function Alternate() {}
        const response = Reflect.construct(Response, ['x'], Alternate);
        return {result, alternate:Object.getPrototypeOf(response) === Alternate.prototype,
            parser:new Parser().parseFromString('<p>native</p>', 'text/html').querySelector('p').textContent};
    })()"#,
    );
    assert_eq!(
        actual,
        json!({"result":vec![true;8],"alternate":true,"parser":"native"})
    );
    vm.runtime().run_gc();
}

#[test]
fn static_methods_and_constructor_identity_survive_gc() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    vm.runtime().run_gc();
    let actual = evaluate(
        &vm,
        r#"(() => {
        const response = Response.json({value:1});
        const redirected = Response.redirect('https://example.com/path');
        const reason = {reason:'synthetic'};
        const signal = AbortSignal.abort(reason);
        const controller = new AbortController();
        const any = AbortSignal.any([controller.signal]);
        controller.abort(reason);
        return [response instanceof Response,response.status,response.headers.get('content-type'),
            redirected.status,redirected.headers.get('location'),Response.error().status,
            signal.aborted,signal.reason===reason,any.aborted,any.reason===reason,
            new Headers().constructor===Headers];
    })()"#,
    );
    assert_eq!(
        actual,
        json!([
            true,
            200,
            "application/json",
            302,
            "https://example.com/path",
            0,
            true,
            true,
            true,
            true,
            true
        ])
    );
}
