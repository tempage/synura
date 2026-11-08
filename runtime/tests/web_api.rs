use serde_json::{json, Value};
use std::io::{Read, Write};
use std::net::TcpListener;
use std::thread;
use std::time::Duration;
use synura_runtime::rquickjs::{promise::MaybePromise, CatchResultExt};
use synura_runtime::{NetworkPolicy, Proxy, Vm, VmConfig};

fn evaluate(vm: &Vm, source: &str) -> Value {
    vm.begin_turn().unwrap();
    let output = vm.context().with(|ctx| {
        let value = ctx
            .eval::<MaybePromise, _>(format!("(async()=>JSON.stringify(await ({source})))()"))
            .catch(&ctx)
            .unwrap();
        vm.finish::<String>(&ctx, value).catch(&ctx).unwrap()
    });
    serde_json::from_str(&output).unwrap()
}

#[test]
fn headers_follow_standard_iteration_and_missing_value_contract() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"(() => {
      const h = new Headers([['X-B','  two\t'],['x-a',1],['X-A',2],['Set-Cookie','a=1'],['Set-Cookie','b=2']]);
      const seen=[]; h.forEach((value,name,owner)=>seen.push([name,value,owner===h]));
      const invalid=[];
      for(const pair of [['bad name','x'],['x','line\nbreak'],['x','한글']]) {
        try {h.append(...pair)} catch(e) {invalid.push(e.name)}
      }
      return {missing:h.get('missing'),joined:h.get('X-A'),cookies:h.getSetCookie(),entries:[...h],seen,invalid};
    })()"#,
    );
    assert_eq!(
        result,
        json!({
            "missing":null,"joined":"1, 2","cookies":["a=1","b=2"],
            "entries":[["set-cookie","a=1"],["set-cookie","b=2"],["x-a","1, 2"],["x-b","two"]],
            "seen":[["set-cookie","a=1",true],["set-cookie","b=2",true],["x-a","1, 2",true],["x-b","two",true]],
            "invalid":["TypeError","TypeError","TypeError"]
        })
    );
}

#[test]
fn constructors_copy_binary_ranges_and_consume_once() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"(async () => {
      const input=new Uint8Array([9,65,66,8]);
      const r=new Response(input.subarray(1,3)); input.fill(0);
      const clone=r.clone(); const pending=r.text();
      const used=r.bodyUsed;
      let second; try {await r.text()} catch(e) {second=e.name}
      const empty=new Response(null,{status:204});
      return {used,text:await pending,bytes:[...await clone.bytes()],second,
        nullBody:empty.body,empty:await empty.text(),emptyAgain:await empty.text(),emptyUsed:empty.bodyUsed,
        json:await Response.json({answer:42}).json(),type:Response.json({}).headers.get('content-type'),
        error:[Response.error().status,Response.error().type]};
    })()"#,
    );
    assert_eq!(
        result,
        json!({"used":true,"text":"AB","bytes":[65,66],"second":"TypeError",
        "nullBody":null,"empty":"","emptyAgain":"","emptyUsed":false,"json":{"answer":42},
        "type":"application/json","error":[0,"error"]})
    );
}

#[test]
fn request_dictionary_reads_inherited_options_and_ignores_unrelated_cycles() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"(async()=>{
      const init=Object.create({method:'post',body:'payload',headers:[['x-number',5]]});
      init.unused=init; init.toJSON=()=>{throw new Error('must not serialize options')};
      const request=new Request('https://example.test',init);
      const clone=request.clone();
      const copied=new Request(request);
      let twice;try{request.clone()}catch(e){twice=e.name}
      return {url:clone.url,method:clone.method,body:await clone.text(),header:clone.headers.get('x-number'),
        type:clone.headers.get('content-type'),sourceUsed:request.bodyUsed,copied:await copied.text(),twice,
        objectBody:await new Request('https://example.test',{method:'POST',body:{a:1}}).text()};
    })()"#,
    );
    assert_eq!(
        result,
        json!({"url":"https://example.test/","method":"POST","body":"payload","header":"5",
        "type":"text/plain;charset=UTF-8","sourceUsed":true,"copied":"payload","twice":"TypeError","objectBody":"[object Object]"})
    );
}

#[test]
fn encoding_handles_lone_surrogates_subviews_and_fatal_decode() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"(()=>{
      const encoder=new TextEncoder();const dest=new Uint8Array(4);
      const into=encoder.encodeInto('😀x',dest);
      let fatal;try{new TextDecoder('utf-8',{fatal:true}).decode(new Uint8Array([255]))}catch(e){fatal=e.name}
      const bom=new Uint8Array([239,187,191,65]);
      return {empty:[...encoder.encode()],surrogate:[...encoder.encode('\uD800')],into,dest:[...dest],fatal,
        subview:new TextDecoder().decode(new Uint8Array([0,65,66,0]).subarray(1,3)),
        bom:new TextDecoder().decode(bom),kept:new TextDecoder('utf-8',{ignoreBOM:true}).decode(bom).charCodeAt(0),
        aliases:new TextDecoder('ASCII').encoding};
    })()"#,
    );
    assert_eq!(
        result,
        json!({"empty":[],"surrogate":[239,191,189],"into":{"read":2,"written":4},
        "dest":[240,159,152,128],"fatal":"TypeError","subview":"AB","bom":"A","kept":65279,"aliases":"windows-1252"})
    );
}

#[test]
fn url_search_params_decode_invalid_utf8_and_encode_form_data() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"(()=>{
      const p=new URLSearchParams('z=1&a=two+words&a=%FF&empty&bad=%ZZ');
      p.sort();p.delete('a','two words');p.append('~','!*');
      return {pairs:[...p],size:p.size,text:p.toString(),nullInit:new URLSearchParams(null).toString()};
    })()"#,
    );
    assert_eq!(
        result,
        json!({"pairs":[["a","�"],["bad","%ZZ"],["empty",""],["z","1"],["~","!*"]],
        "size":5,"text":"a=%EF%BF%BD&bad=%25ZZ&empty=&z=1&%7E=%21*","nullInit":""})
    );
}

fn server_requests(count: usize) -> (String, thread::JoinHandle<Vec<Vec<u8>>>) {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let address = listener.local_addr().unwrap().to_string();
    let worker = thread::spawn(move || {
        let mut bodies = Vec::new();
        for _ in 0..count {
            let (mut connection, _) = listener.accept().unwrap();
            connection
                .set_read_timeout(Some(Duration::from_secs(5)))
                .unwrap();
            let mut request = Vec::new();
            let mut byte = [0u8; 1];
            while !request.ends_with(b"\r\n\r\n") {
                connection.read_exact(&mut byte).unwrap();
                request.push(byte[0]);
            }
            let headers = String::from_utf8(request).unwrap();
            let length = headers
                .lines()
                .find_map(|line| {
                    let (name, value) = line.split_once(':')?;
                    name.eq_ignore_ascii_case("content-length")
                        .then(|| value.trim().parse::<usize>().unwrap())
                })
                .unwrap_or(0);
            let mut body = vec![0; length];
            connection.read_exact(&mut body).unwrap();
            bodies.push(body);
            connection.write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: close\r\nX-Test: yes\r\n\r\nok").unwrap();
        }
        bodies
    });
    (address, worker)
}

#[test]
fn fetch_sends_exact_crypto_buffers_and_snapshots_views() {
    let (address, worker) = server_requests(3);
    let vm = Vm::new(VmConfig::default()).unwrap();
    vm.set_proxy(Proxy::Disabled).unwrap();
    vm.bind_network(NetworkPolicy {
        domain: address.clone(),
        host_permissions: vec![],
        bypass: None,
    })
    .unwrap();
    let result = evaluate(
        &vm,
        &format!(
            r#"(async()=>{{
      const url='http://{address}/';
      const bytes=new Uint8Array([0,65,66,0]);
      const first=fetch(url,{{method:'POST',body:bytes.subarray(1,3)}});bytes.fill(0);
      const r=await first; let immutable;try{{r.headers.set('x','y')}}catch(e){{immutable=e.name}}
      const key=await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['encrypt']);
      const ciphertext=await crypto.subtle.encrypt({{name:'AES-GCM',iv:new Uint8Array(12)}},key,new Uint8Array());
      await (await fetch(new Request(url,{{method:'POST',body:ciphertext}}))).text();
      await (await fetch(url,{{method:'POST',body:new URLSearchParams({{a:'two words'}})}})).text();
      return {{text:await r.text(),response:r instanceof Response,headers:r.headers instanceof Headers,immutable,
        cipher:[...new Uint8Array(ciphertext)]}};
    }})()"#
        ),
    );
    let bodies = worker.join().unwrap();
    assert_eq!(bodies[0], b"AB");
    assert_eq!(
        bodies[1],
        serde_json::from_value::<Vec<u8>>(result["cipher"].clone()).unwrap()
    );
    assert_eq!(bodies[2], b"a=two+words");
    assert_eq!(result["text"], "ok");
    assert_eq!(result["response"], true);
    assert_eq!(result["headers"], true);
    assert_eq!(result["immutable"], "TypeError");
}

#[test]
fn internal_request_transport_ignores_prototype_json_hooks() {
    let (address, worker) = server_requests(1);
    let vm = Vm::new(VmConfig::default()).unwrap();
    vm.set_proxy(Proxy::Disabled).unwrap();
    vm.bind_network(NetworkPolicy {
        domain: address.clone(),
        host_permissions: vec![],
        bypass: None,
    })
    .unwrap();
    let result = evaluate(
        &vm,
        &format!(
            r#"(async()=>{{
      const originalStringify=JSON.stringify;
      const hidden=['__host_fetch','__host_decode','__host_encoding','__host_url'].every(name=>!(name in globalThis));
      let hooks=0,conversions=0;
      Object.defineProperty(Object.prototype,'toJSON',{{configurable:true,value(){{hooks++;throw new Error('object transport leak')}}}});
      Object.defineProperty(Array.prototype,'toJSON',{{configurable:true,value(){{hooks++;throw new Error('array transport leak')}}}});
      JSON.stringify=()=>{{hooks++;throw new Error('replaced serializer')}};
      globalThis.__host_fetch=()=>{{throw new Error('replacement native bridge')}};
      try {{
        const body={{toString(){{conversions++;return 'explicit body string'}},toJSON(){{hooks++;throw new Error('body JSON conversion')}}}};
        const response=await fetch('http://{address}/',{{method:'POST',headers:[['X-Private','secret']],body}});
        return {{text:await response.text(),hooks,conversions,hidden}};
      }} finally {{
        delete Object.prototype.toJSON;delete Array.prototype.toJSON;
        JSON.stringify=originalStringify;delete globalThis.__host_fetch;
      }}
    }})()"#
        ),
    );
    assert_eq!(
        worker.join().unwrap(),
        vec![b"explicit body string".to_vec()]
    );
    assert_eq!(
        result,
        json!({"text":"ok","hooks":0,"conversions":1,"hidden":true})
    );
}

#[test]
fn aborted_requests_reject_with_the_exact_reason() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let result = evaluate(
        &vm,
        r#"(async()=>{
      const controller=new AbortController();const reason={why:'closed'};let calls=0;
      controller.signal.addEventListener('abort',()=>calls++,{once:true});
      const request=new Request('https://example.test',{signal:controller.signal});
      controller.abort(reason);controller.abort('again');
      let exact=false;try{await fetch(request)}catch(e){exact=e===reason}
      let defaultName;try{AbortSignal.abort().throwIfAborted()}catch(e){defaultName=e.name}
      return {exact,calls,defaultName,follows:request.signal!==controller.signal&&request.signal.aborted};
    })()"#,
    );
    assert_eq!(
        result,
        json!({"exact":true,"calls":1,"defaultName":"AbortError","follows":true})
    );
}

#[test]
fn abort_after_headers_rejects_body_and_clones() {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let address = listener.local_addr().unwrap().to_string();
    let worker = thread::spawn(move || {
        let (mut connection, _) = listener.accept().unwrap();
        connection
            .set_read_timeout(Some(Duration::from_secs(5)))
            .unwrap();
        let mut request = Vec::new();
        let mut byte = [0u8; 1];
        while !request.ends_with(b"\r\n\r\n") {
            connection.read_exact(&mut byte).unwrap();
            request.push(byte[0]);
        }
        connection
            .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 100\r\nConnection: close\r\n\r\n")
            .unwrap();
        let _ = connection.read(&mut byte);
    });
    let vm = Vm::new(VmConfig::default()).unwrap();
    vm.set_proxy(Proxy::Disabled).unwrap();
    vm.bind_network(NetworkPolicy {
        domain: address.clone(),
        host_permissions: vec![],
        bypass: None,
    })
    .unwrap();
    let result = evaluate(
        &vm,
        &format!(
            r#"(async()=>{{
      const controller=new AbortController();
      const r=await fetch('http://{address}/',{{signal:controller.signal}});const clone=r.clone();
      controller.abort('closed');const errors=[];
      for(const response of [r,clone]){{try{{await response.text()}}catch(e){{errors.push(e)}}}}
      return errors;
    }})()"#
        ),
    );
    vm.drain().unwrap();
    worker.join().unwrap();
    assert_eq!(result, json!(["closed", "closed"]));
}
