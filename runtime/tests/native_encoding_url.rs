use serde_json::{json, Value};
use synura_runtime::rquickjs::CatchResultExt;
use synura_runtime::{Vm, VmConfig};

fn evaluate(vm: &Vm, source: &str) -> Value {
    vm.begin_turn().unwrap();
    let output: String = vm.context().with(|ctx| {
        ctx.eval::<String, _>(format!("JSON.stringify((()=>{{{source}}})())"))
            .catch(&ctx)
            .unwrap()
    });
    serde_json::from_str(&output).unwrap()
}

#[test]
fn decoder_reads_native_view_ranges_despite_shadowed_properties_and_intrinsics() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        const bytes = new Uint8Array([33,65,66,33]);
        const data = new DataView(bytes.buffer,1,2);
        const typed = bytes.subarray(1,3);
        for (const view of [data,typed]) {
          for (const key of ['buffer','byteOffset','byteLength','length'])
            Object.defineProperty(view,key,{get(){throw new Error('shadow read')}});
        }
        for (const key of ['buffer','byteOffset','byteLength'])
          Object.defineProperty(DataView.prototype,key,{get(){throw new Error('changed intrinsic')}});
        globalThis.DataView = function(){throw new Error('changed constructor')};
        const decoder = new TextDecoder();
        return [decoder.decode(data),decoder.decode(typed),decoder.decode(new ArrayBuffer(0))];
    "#,
    );
    assert_eq!(result, json!(["AB", "AB", ""]));
}

#[test]
fn encode_into_honors_native_subview_bounds_and_utf16_read_counts() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        const encoder = new TextEncoder();
        const backing = new Uint8Array([9,9,9,9,9,9]);
        const target = backing.subarray(1,5);
        for (const name of ['byteOffset','byteLength','length','buffer'])
          Object.defineProperty(target,name,{get(){throw new Error('shadow read')}});
        const into = encoder.encodeInto('😀A',target);
        const tooSmall = encoder.encodeInto('\uD800',new Uint8Array(2));
        const prefix = new Uint8Array(4);
        const replaced = encoder.encodeInto('\uD800A\uDC00😀',prefix);
        return {into,backing:[...backing],tooSmall,replaced,prefix:[...prefix],
          all:[...encoder.encode('\uD800A\uDC00😀')]};
    "#,
    );
    assert_eq!(
        result,
        json!({"into":{"read":2,"written":4},"backing":[9,240,159,152,128,9],
        "tooSmall":{"read":0,"written":0},"replaced":{"read":2,"written":4},"prefix":[239,191,189,65],
        "all":[239,191,189,65,239,191,189,240,159,152,128]})
    );
}

#[test]
fn encoding_native_methods_enforce_brands_and_survive_reentrant_input_conversion() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        const encoder = new TextEncoder(), decoder = new TextDecoder();
        const encode = encoder.encode, decode = decoder.decode;
        const errors = [];
        const fail = f => {try {f();errors.push('accepted')} catch(e){errors.push(e.name)}};
        fail(()=>encode.call({},'x'));
        fail(()=>decode.call({},new Uint8Array()));
        fail(()=>encoder.encodeInto('x',new Uint8ClampedArray(4)));
        fail(()=>encoder.encodeInto('x',Object.create(Uint8Array.prototype)));
        fail(()=>decoder.decode(Object.create(DataView.prototype)));
        const target = new Uint8Array(2);
        const result = encoder.encodeInto({toString(){target.fill(9);encode.call(encoder,'nested');return 'A'}},target);
        Object.setPrototypeOf(encoder,null); Object.setPrototypeOf(decoder,null);
        return {errors,result,target:[...target],roundTrip:decode.call(decoder,encode.call(encoder,'ok')),
          native:Function.prototype.toString.call(encode).includes('[native code]')};
    "#,
    );
    assert_eq!(
        result,
        json!({"errors":["TypeError","TypeError","TypeError","TypeError","TypeError"],
        "result":{"read":1,"written":1},"target":[65,9],"roundTrip":"ok","native":true})
    );
}

#[test]
fn url_iterators_and_foreach_observe_mutations_without_retaining_native_borrows() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        const params = new URLSearchParams('a=1&b=2');
        const iterator = params.entries();
        const first = iterator.next();
        params.append('c','3');params.delete('a');
        const second = iterator.next(), end = iterator.next();
        params.append('d','4');
        const afterEnd = iterator.next();
        const live = new URLSearchParams('a=1&b=2');
        const seen = [], receiver = {};
        live.forEach(function(value,key,owner){
          seen.push([key,value,owner===live,this===receiver]);
          if(key==='a'){live.set('b','changed');live.append('c','3')}
        },receiver);
        const reentrant = new URLSearchParams('a=1');
        reentrant.append({toString(){reentrant.append('inner','2');return 'outer'}},
          {toString(){reentrant.delete('a');return '3'}});
        return {first,second,end,afterEnd,seen,reentrant:[...reentrant],self:iterator[Symbol.iterator]()===iterator};
    "#,
    );
    assert_eq!(
        result,
        json!({"first":{"done":false,"value":["a","1"]},"second":{"done":false,"value":["c","3"]},
        "end":{"done":true},"afterEnd":{"done":true},"seen":[["a","1",true,true],["b","changed",true,true],["c","3",true,true]],
        "reentrant":[["inner","2"],["outer","3"]],"self":true})
    );
}

#[test]
fn url_constructor_converts_record_keys_and_iterable_pairs_to_usv_strings() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        const input = Object.create({inherited:'ignored'});
        input['\uD800']='\uDC00';
        Object.defineProperty(input,'next',{enumerable:true,get(){return 'getter'}});
        const pairs = new URLSearchParams(input);
        const strings = new URLSearchParams(['ab']);
        const copy = new URLSearchParams(pairs); pairs.set('\uFFFD','changed');
        const error = [];
        for(const input of [[['a']], [['a','b','c']], {[Symbol.iterator]:3}]) {
          try {new URLSearchParams(input);error.push('accepted')} catch(e){error.push(e.name)}
        }
        return {copy:[...copy],strings:[...strings],error};
    "#,
    );
    assert_eq!(
        result,
        json!({"copy":[["�","�"],["next","getter"]],"strings":[["a","b"]],
        "error":["TypeError","TypeError","TypeError"]})
    );
}

#[test]
fn url_constructor_stops_unbounded_iterables_and_keeps_vm_usable() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        let error, count=0;
        function* input(){for(;;){count++;yield ['a','b']}}
        try {new URLSearchParams(input())} catch(e){error=e.name}
        return {error,count,after:new URLSearchParams('ok=1').get('ok')};
    "#,
    );
    assert_eq!(
        result,
        json!({"error":"RangeError","count":65537,"after":"1"})
    );
}

#[test]
fn url_native_budget_follows_iterator_lifetime_and_is_released_by_gc() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    evaluate(
        &vm,
        r#"
        globalThis.saved = new URLSearchParams([['key','x'.repeat(9*1024*1024)]]);
        globalThis.iterator = saved.entries(); saved = null;
        return true;
    "#,
    );
    vm.runtime().run_gc();
    assert_eq!(
        evaluate(
            &vm,
            r#"
        try {new URLSearchParams([['key','y'.repeat(9*1024*1024)]]);return 'accepted'} catch(e){return e.name}
    "#
        ),
        json!("RangeError")
    );
    evaluate(&vm, "iterator=null;return true;");
    vm.runtime().run_gc();
    assert_eq!(
        evaluate(
            &vm,
            r#"return new URLSearchParams([['key','z'.repeat(9*1024*1024)]]).get('key').length;"#
        ),
        json!(9 * 1024 * 1024)
    );
}

#[test]
fn native_encoding_objects_expose_standard_class_identity() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        const encoder=new TextEncoder(), decoder=new TextDecoder(), params=new URLSearchParams();
        return [Object.prototype.toString.call(encoder),Object.prototype.toString.call(decoder),
          Object.prototype.toString.call(params),encoder instanceof TextEncoder,decoder instanceof TextDecoder,
          encoder.constructor===TextEncoder,decoder.constructor===TextDecoder];
    "#,
    );
    assert_eq!(
        result,
        json!([
            "[object TextEncoder]",
            "[object TextDecoder]",
            "[object URLSearchParams]",
            true,
            true,
            true,
            true
        ])
    );
}

#[test]
fn native_result_records_do_not_invoke_inherited_setters() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        const params=new URLSearchParams('a=1'), encoder=new TextEncoder();
        let calls=0;
        for(const name of ['done','value','read','written'])
          Object.defineProperty(Object.prototype,name,{__proto__:null,set(){calls++},configurable:true});
        const item=params.entries().next(), into=encoder.encodeInto('x',new Uint8Array(1));
        for(const name of ['done','value','read','written']) delete Object.prototype[name];
        return {calls,item,into};
    "#,
    );
    assert_eq!(
        result,
        json!({"calls":0,"item":{"done":false,"value":["a","1"]},"into":{"read":1,"written":1}})
    );
}

#[test]
fn native_url_arrays_define_indices_without_inherited_setters() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        const params=new URLSearchParams('a=1&a=2');
        let calls=0;
        for(const key of ['0','1'])
          Object.defineProperty(Array.prototype,key,{__proto__:null,set(){calls++},configurable:true});
        const all=params.getAll('a'), entry=params.entries().next().value;
        for(const key of ['0','1']) delete Array.prototype[key];
        return {calls,all,entry};
    "#,
    );
    assert_eq!(result, json!({"calls":0,"all":["1","2"],"entry":["a","1"]}));
}

#[test]
fn url_constructor_accounts_for_pending_pairs_during_reentry_and_releases_failed_builders() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"
        globalThis.large='x'.repeat(10*1024*1024);
        let innerFailure=null, outerFailure=null;
        function* source(){
          yield ['outer',large.slice(0,8*1024*1024)];
          try {new URLSearchParams([['inner',large]])} catch(error){innerFailure=error.name}
        }
        try {globalThis.outer=new URLSearchParams(source())} catch(error){outerFailure=error.name}
        return {innerFailure,outerFailure,length:globalThis.outer ? outer.get('outer').length : null};
    "#,
    );
    assert_eq!(
        result,
        json!({"innerFailure":"RangeError","outerFailure":null,"length":8*1024*1024})
    );
    evaluate(&vm, "outer=null;return true;");
    vm.runtime().run_gc();
    let after = evaluate(
        &vm,
        r#"
        let failure;
        function* broken(){yield ['pending',large];throw new Error('iteration failed')}
        try {new URLSearchParams(broken())} catch(error){failure=error.message}
        const fresh=new URLSearchParams([['fresh',large]]);
        return {failure,length:fresh.get('fresh').length};
    "#,
    );
    assert_eq!(
        after,
        json!({"failure":"iteration failed","length":10*1024*1024})
    );
}
