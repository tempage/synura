use std::time::Duration;
use synura_runtime::rquickjs::{promise::MaybePromise, CatchResultExt};
use synura_runtime::{Vm, VmConfig};

fn eval(vm: &Vm, source: &str) -> String {
    vm.begin_turn().unwrap();
    vm.context().with(|ctx| {
        ctx.eval::<MaybePromise, _>(source)
            .and_then(|result| vm.finish::<String>(&ctx, result))
            .catch(&ctx)
            .unwrap()
    })
}

#[test]
fn expired_cpu_turn_cannot_be_revived() {
    let vm = Vm::new(VmConfig {
        execution_timeout: Some(Duration::from_millis(20)),
        ..VmConfig::default()
    })
    .unwrap();
    vm.begin_turn().unwrap();
    vm.context().with(|ctx| {
        assert!(ctx.eval::<(), _>("while (true) {};").catch(&ctx).is_err());
    });
    assert!(vm.cancellation().is_cancelled());
    assert!(vm.begin_turn().is_err());
    assert!(vm.poll().is_err());
}

#[test]
fn pending_crypto_limit_rejects_before_queueing_more_work() {
    let vm = Vm::new(VmConfig {
        max_pending_crypto: 1,
        ..VmConfig::default()
    })
    .unwrap();
    let result = eval(
        &vm,
        r#"(async () => {
        const first = crypto.subtle.digest('SHA-256', new Uint8Array());
        const second = crypto.subtle.digest('SHA-256', new Uint8Array());
        const all = await Promise.allSettled([first, second]);
        return JSON.stringify(all.map(item => item.status === 'fulfilled' ? item.value.byteLength : item.reason.name));
    })()"#,
    );
    assert_eq!(result, r#"[32,"OperationError"]"#);
    assert_eq!(
        eval(
            &vm,
            "crypto.subtle.digest('SHA-256',new Uint8Array()).then(x=>String(x.byteLength))"
        ),
        "32"
    );
}

#[test]
fn oversized_native_inputs_and_keys_fail_without_poisoning_vm() {
    let vm = Vm::new(VmConfig {
        max_crypto_input_bytes: 4096,
        ..VmConfig::default()
    })
    .unwrap();
    let result = eval(
        &vm,
        r#"(async () => {
        const failure = async operation => { try { await operation(); return 'accepted'; } catch (error) { return error.name; } };
        const input = await failure(() => crypto.subtle.digest('SHA-256', new Uint8Array(8192)));
        const key = await failure(() => crypto.subtle.generateKey({name:'HMAC',hash:'SHA-256',length:65536},true,['sign']));
        const good = await crypto.subtle.digest('SHA-256',new Uint8Array());
        return JSON.stringify([input,key,good.byteLength]);
    })()"#,
    );
    assert_eq!(result, r#"["OperationError","OperationError",32]"#);
}

#[test]
fn retained_crypto_outputs_obey_the_heap_limit_and_release_their_charge() {
    let vm = Vm::new(VmConfig {
        memory_limit: 8 * 1024 * 1024,
        ..VmConfig::default()
    })
    .unwrap();
    let result = eval(
        &vm,
        r#"(async () => {
        globalThis.exportKey = await crypto.subtle.generateKey(
            {name:'HMAC',hash:'SHA-256',length:1024*1024*8},true,['sign']);
        const keep = [];
        try {
            for (let index = 0; index < 16; index++)
                keep.push(await crypto.subtle.exportKey('raw', exportKey));
        } catch (error) {
            const message = error.message;
            keep.length = 0;
            return message;
        }
        return 'unbounded';
    })()"#,
    );
    assert!(result.contains("out of memory"), "{result}");
    vm.runtime().run_gc();
    assert_eq!(
        eval(
            &vm,
            r#"(async () => {
            let length = 0;
            for (let index = 0; index < 16; index++)
                length = (await crypto.subtle.exportKey('raw', exportKey)).byteLength;
            return String(length);
        })()"#,
        ),
        "1048576"
    );
}

#[test]
fn poll_delivers_crypto_and_microtasks_without_recursive_runtime_lock() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    vm.context().with(|ctx| {
        ctx.eval::<(),_>("globalThis.done=false; crypto.subtle.digest('SHA-256',new Uint8Array()).then(()=>{done=true});").unwrap();
    });
    vm.drain().unwrap();
    vm.context()
        .with(|ctx| assert!(ctx.eval::<bool, _>("done").unwrap()));
}

#[test]
fn unbounded_argument_iterators_are_closed_at_conversion_budget() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    assert_eq!(
        eval(
            &vm,
            r#"(async () => {
        let closed = false;
        function* usages() { try { while (true) yield 'sign'; } finally { closed = true; } }
        try { await crypto.subtle.generateKey({name:'HMAC',hash:'SHA-256'}, false, usages()); }
        catch (error) { return JSON.stringify([error.name, closed]); }
        return 'accepted';
    })()"#
        ),
        r#"["OperationError",true]"#
    );
}

#[test]
fn headers_and_request_metadata_cannot_bypass_native_memory_budgets() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    assert_eq!(
        eval(
            &vm,
            r#"fetch('https://example.invalid/', {
        headers: {'X-Large': 'a'.repeat(70 * 1024)}
    }).then(() => 'accepted', error => error.message)"#
        ),
        "Headers exceed VM limit"
    );
    assert_eq!(
        eval(
            &vm,
            r#"fetch('https://example.invalid/', {headers: {'X-Escaped': '\u0001'.repeat(12 * 1024)}})
                .then(() => 'accepted', error => error.message)"#
        ),
        "Fetch metadata exceeds VM limit"
    );
}

#[test]
fn native_http_metadata_and_headers_have_aggregate_limits() {
    for expression in [
        "new Request('https://example.invalid/' + large)",
        "new Response(null, {statusText:large})",
        "new Headers({'x-large':large})",
    ] {
        let vm = Vm::new(VmConfig::default()).unwrap();
        let result = eval(
            &vm,
            &format!(
                r#"(() => {{
            const keep = [], large = 'a'.repeat(50 * 1024);
            try {{ for (let index = 0; index < 400; index++) keep.push({expression}); }}
            catch (error) {{ return error.name + ':' + error.message + ':' + keep.length; }}
            return 'unbounded';
        }})()"#
            ),
        );
        assert!(
            result.starts_with("RangeError:") && result.contains("exceed"),
            "{expression}: {result}"
        );
    }
}

#[test]
fn native_response_buffers_are_charged_to_the_js_heap() {
    let vm = Vm::new(VmConfig {
        memory_limit: 16 * 1024 * 1024,
        ..VmConfig::default()
    })
    .unwrap();
    let result = eval(
        &vm,
        r#"(() => {
        const keep = [], input = new Uint8Array(1024 * 1024);
        try { for (let index = 0; index < 40; index++) keep.push(new Response(input)); }
        catch (error) { const name = error.message; keep.length = 0; return name; }
        return 'unbounded';
    })()"#,
    );
    assert!(result.contains("out of memory"), "{result}");
}

#[test]
fn headers_close_unbounded_iterators_at_the_native_quota() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    assert_eq!(
        eval(
            &vm,
            r#"(() => {
        let closed = false;
        function* entries() { try { while (true) yield ['x-name','value']; } finally { closed = true; } }
        try { new Headers(entries()); } catch (error) { return JSON.stringify([error.name, closed]); }
        return 'unbounded';
    })()"#
        ),
        r#"["RangeError",true]"#
    );
}

#[test]
fn abort_following_depth_is_bounded_and_duplicates_do_not_consume_edges() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    assert_eq!(
        eval(
            &vm,
            r#"(() => {
        const controller = new AbortController();
        const duplicate = AbortSignal.any(Array(65536).fill(controller.signal));
        let leaf = controller.signal, depth = 0, failure;
        try { for (; depth < 1000; depth++) leaf = AbortSignal.any([leaf]); }
        catch (error) { failure = error.name; }
        controller.abort('closed');
        return JSON.stringify([depth, failure, leaf.reason, duplicate.reason]);
    })()"#
        ),
        r#"[256,"RangeError","closed","closed"]"#
    );
    // Exercise destruction without first aborting the graph on a VM owner
    // thread's normal 2 MiB stack as well as propagation above.
    std::thread::spawn(|| {
        let vm = Vm::new(VmConfig::default()).unwrap();
        vm.context().with(|ctx| {
            ctx.eval::<(), _>(
                r#"
            globalThis.root = new AbortController();
            globalThis.leaf = root.signal;
            for (let index = 0; index < 256; index++) leaf = AbortSignal.any([leaf]);
        "#,
            )
            .unwrap()
        });
        drop(vm);
    })
    .join()
    .unwrap();
}

#[test]
fn crypto_worker_thread_is_lazily_spawned() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    assert!(
        !vm.is_crypto_worker_spawned(),
        "worker thread must not be spawned on Vm creation"
    );

    // Synchronous BoringSSL operations: must NOT spawn the worker thread.
    eval(&vm, "crypto.getRandomValues(new Uint8Array(16)); 'ok'");
    eval(&vm, "crypto.randomUUID()");
    assert!(
        !vm.is_crypto_worker_spawned(),
        "crypto worker thread must not be spawned for synchronous crypto"
    );

    // Subtle async operation: must lazily spawn the worker thread.
    eval(
        &vm,
        "(async () => { await crypto.subtle.digest('SHA-256', new Uint8Array(8)); return 'ok'; })()",
    );
    assert!(
        vm.is_crypto_worker_spawned(),
        "crypto worker thread should be spawned only after subtle operation"
    );
}
