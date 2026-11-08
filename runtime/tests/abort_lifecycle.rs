use serde_json::{json, Value};
use std::fs;
use std::sync::atomic::{AtomicU64, Ordering};
use synura_runtime::rquickjs::{promise::MaybePromise, CatchResultExt};
use synura_runtime::{NetworkPolicy, Vm, VmConfig};

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
fn discarded_requests_return_their_dependency_budget() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    assert_eq!(
        evaluate(
            &vm,
            r#"(() => {
            const controller = new AbortController();
            for (let i = 0; i < 8192; i++)
                new Request('https://example.test/', {signal: controller.signal});
            const request = new Request('https://example.test/', {signal: controller.signal});
            controller.abort('finished');
            return request.signal.reason;
        })()"#
        ),
        json!("finished")
    );
}

#[test]
fn cyclic_discarded_signals_are_collectible_without_losing_live_followers() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    evaluate(
        &vm,
        r#"(() => {
        globalThis.controller = new AbortController();
        globalThis.live = new Request('https://example.test/', {signal: controller.signal});
        return true;
    })()"#,
    );
    for _ in 0..12 {
        evaluate(
            &vm,
            r#"(() => {
            for (let i = 0; i < 512; i++) {
                const request = new Request('https://example.test/', {signal: controller.signal});
                request.signal.cycle = request;
            }
            return true;
        })()"#,
        );
        vm.runtime().run_gc();
    }
    assert_eq!(
        evaluate(
            &vm,
            r#"(() => {
        controller.abort('after GC');
        return [live.signal.aborted, live.signal.reason];
    })()"#
        ),
        json!([true, "after GC"])
    );
}

#[test]
fn completed_fetches_release_dependencies_but_retained_bodies_still_abort() {
    static NEXT: AtomicU64 = AtomicU64::new(0);
    let path = std::env::temp_dir().join(format!(
        "synura-abort-lifecycle-{}-{}.txt",
        std::process::id(),
        NEXT.fetch_add(1, Ordering::Relaxed)
    ));
    fs::write(&path, "ok").unwrap();
    let vm = Vm::new(VmConfig::default()).unwrap();
    vm.bind_network(NetworkPolicy {
        domain: "example.test".into(),
        ..NetworkPolicy::default()
    })
    .unwrap();
    vm.set_fetch_override("https://example.test/", &path)
        .unwrap();
    let result = evaluate(
        &vm,
        r#"(async () => {
        const controller = new AbortController();
        for (let i = 0; i < 5000; i++) {
            const response = await fetch('https://example.test/', {signal: controller.signal});
            if (await response.text() !== 'ok') throw new Error('unexpected body');
        }
        const response = await fetch('https://example.test/', {signal: controller.signal});
        const clone = response.clone();
        await response.text();
        controller.abort('closed');
        try { await clone.text(); } catch (error) { return [5000, error]; }
        return 'body did not abort';
    })()"#,
    );
    fs::remove_file(path).unwrap();
    assert_eq!(result, json!([5000, "closed"]));
}

#[test]
fn any_keeps_intermediate_sources_and_observed_dependents_alive() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    evaluate(
        &vm,
        r#"(() => {
        globalThis.controller = new AbortController();
        globalThis.events = [];
        globalThis.nested = AbortSignal.any([AbortSignal.any([controller.signal])]);
        AbortSignal.any([controller.signal]).addEventListener('abort', event => {
            events.push(event.target.reason);
        }, {once: true});
        AbortSignal.any([controller.signal]).onabort = event => {
            events.push(event.target.reason);
        };
        AbortSignal.any([AbortSignal.any([controller.signal])]).addEventListener('abort', event => {
            events.push('nested ' + event.target.reason);
        });
        return true;
    })()"#,
    );
    vm.runtime().run_gc();
    assert_eq!(
        evaluate(
            &vm,
            r#"(() => {
        controller.abort('observed');
        return [nested.reason, events];
    })()"#
        ),
        json!(["observed", ["observed", "observed", "nested observed"]])
    );
}

#[test]
fn live_dependents_remain_bounded_and_removing_observers_releases_them() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    assert_eq!(
        evaluate(
            &vm,
            r#"(() => {
        const controller = new AbortController();
        const live = [];
        for (let i = 0; i < 4096; i++) live.push(AbortSignal.any([controller.signal]));
        let limit;
        try { AbortSignal.any([controller.signal]); } catch (error) { limit = error.name; }
        live.length = 0;
        for (let i = 0; i < 5000; i++) {
            const signal = AbortSignal.any([AbortSignal.any([controller.signal])]);
            const listener = () => {};
            signal.addEventListener('abort', listener);
            signal.removeEventListener('abort', listener);
            signal.onabort = listener;
            signal.onabort = null;
        }
        const final = AbortSignal.any([controller.signal]);
        controller.abort('done');
        return [limit, final.reason];
    })()"#
        ),
        json!(["RangeError", "done"])
    );
}
