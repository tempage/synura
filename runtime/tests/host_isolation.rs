//! Host boundary tests with synthetic keys and loopback HTTP only.
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::Arc;
use std::thread::{self, JoinHandle};
use std::time::Duration;

use serde_json::{json, Value};
use synura_runtime::rquickjs::{promise::MaybePromise, CatchResultExt, Function};
use synura_runtime::{NetworkPolicy, Proxy, Vm, VmConfig};

fn evaluate(vm: &Vm, expression: &str) -> Result<Value, String> {
    vm.begin_turn()?;
    let source = format!("Promise.resolve(({expression})).then(JSON.stringify)");
    let result = vm.context().with(|ctx| {
        ctx.eval::<MaybePromise, _>(source)
            .and_then(|value| vm.finish::<String>(&ctx, value))
            .catch(&ctx)
            .map_err(|error| error.to_string())
    });
    let drained = vm.drain();
    let encoded = result?;
    drained?;
    serde_json::from_str(&encoded).map_err(|error| error.to_string())
}

fn vm() -> Vm {
    Vm::new(VmConfig::default()).unwrap()
}

#[test]
fn globals_keys_and_host_callbacks_belong_to_one_vm() {
    let first = vm();
    let second = vm();
    first.context().with(|ctx| {
        ctx.globals()
            .set(
                "hostIdentity",
                Function::new(ctx.clone(), || "first host").unwrap(),
            )
            .unwrap();
    });
    let signature = evaluate(
        &first,
        r#"(async () => {
            globalThis.privateState = 'first';
            globalThis.secret = await crypto.subtle.importKey('raw', new Uint8Array([1]),
                {name:'HMAC', hash:'SHA-256'}, false, ['sign']);
            const bytes = await crypto.subtle.sign('HMAC', secret, new Uint8Array([42]));
            return {host:hostIdentity(), signature:Array.from(new Uint8Array(bytes))};
        })()"#,
    )
    .unwrap();
    assert_eq!(signature["host"], "first host");
    let other = evaluate(
        &second,
        r#"(async () => {
            const absent = [typeof privateState, typeof secret, typeof hostIdentity];
            let forged;
            try {
                await crypto.subtle.sign('HMAC',
                    {type:'secret', extractable:false, algorithm:{name:'HMAC', hash:{name:'SHA-256'}}, usages:['sign'], id:1},
                    new Uint8Array([42]));
                forged = 'accepted';
            } catch (error) { forged = error.name; }
            const key = await crypto.subtle.importKey('raw', new Uint8Array([2]),
                {name:'HMAC', hash:'SHA-256'}, false, ['sign']);
            const bytes = await crypto.subtle.sign('HMAC', key, new Uint8Array([42]));
            return {absent, forged, signature:Array.from(new Uint8Array(bytes))};
        })()"#,
    )
    .unwrap();
    assert_eq!(
        other["absent"],
        json!(["undefined", "undefined", "undefined"])
    );
    assert_ne!(other["forged"], "accepted");
    assert_ne!(other["signature"], signature["signature"]);
    drop(first);
    assert_eq!(evaluate(&second, "1 + 2").unwrap(), 3);
}

#[test]
fn revocation_is_permanent_and_does_not_revoke_another_vm() {
    let first = vm();
    let second = vm();
    let revoke = first.cancellation();
    thread::spawn(move || revoke.cancel()).join().unwrap();
    assert!(first.begin_turn().is_err());
    assert!(first.drain().is_err());
    assert!(first.poll().is_err());
    assert_eq!(
        evaluate(
            &second,
            "crypto.subtle.digest('SHA-256', new Uint8Array()).then(bytes => bytes.byteLength)",
        )
        .unwrap(),
        32
    );
}

#[test]
fn host_cancellation_interrupts_javascript_and_revokes_future_turns() {
    let vm = vm();
    let canceled = Arc::new(AtomicBool::new(false));
    let probe = canceled.clone();
    vm.set_cancellation_probe(move || probe.load(Ordering::SeqCst));
    let worker = thread::spawn(move || {
        thread::sleep(Duration::from_millis(25));
        canceled.store(true, Ordering::SeqCst);
    });
    vm.context().with(|ctx| {
        assert!(ctx.eval::<(), _>("for (;;) {}").is_err());
    });
    worker.join().unwrap();
    assert!(vm.cancellation().is_cancelled());
    assert!(vm.begin_turn().is_err());
    assert!(vm.poll().is_err());
}

#[test]
fn host_cancellation_is_checked_before_a_new_turn() {
    let vm = vm();
    vm.set_cancellation_probe(|| true);
    assert!(vm.begin_turn().is_err());
    assert!(vm.cancellation().is_cancelled());
    vm.set_cancellation_probe(|| false);
    assert!(vm.begin_turn().is_err());
}

#[test]
fn inspecting_an_idle_vm_does_not_expire_its_next_turn() {
    let vm = Vm::new(VmConfig {
        execution_timeout: Some(Duration::from_millis(10)),
        ..VmConfig::default()
    })
    .unwrap();
    thread::sleep(Duration::from_millis(20));
    assert!(!vm.has_pending_work().unwrap());
    assert!(!vm.cancellation().is_cancelled());
    vm.begin_turn().unwrap();
    vm.context().with(|ctx| {
        ctx.eval::<(), _>("Promise.resolve().then(() => 1)")
            .unwrap();
    });
    assert!(vm.has_pending_work().unwrap());
    vm.drain().unwrap();
    assert!(!vm.has_pending_work().unwrap());
}

#[test]
fn host_cancellation_ends_native_completion_waits() {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    listener.set_nonblocking(true).unwrap();
    let authority = listener.local_addr().unwrap().to_string();
    let canceled = Arc::new(AtomicBool::new(false));
    let probe = canceled.clone();
    let vm = vm();
    vm.set_proxy(Proxy::Disabled).unwrap();
    vm.bind_network(NetworkPolicy {
        domain: authority.clone(),
        ..NetworkPolicy::default()
    })
    .unwrap();
    vm.set_cancellation_probe(move || probe.load(Ordering::SeqCst));
    let worker = thread::spawn(move || {
        let end = std::time::Instant::now() + Duration::from_secs(2);
        loop {
            match listener.accept() {
                Ok((mut stream, _)) => {
                    stream
                        .set_read_timeout(Some(Duration::from_secs(2)))
                        .unwrap();
                    let mut request = [0u8; 4096];
                    let size = stream.read(&mut request).unwrap();
                    assert!(size > 0);
                    canceled.store(true, Ordering::SeqCst);
                    // Keep the response pending until cancellation closes it.
                    let _ = stream.read(&mut request);
                    return true;
                }
                Err(error) if error.kind() == std::io::ErrorKind::WouldBlock => {
                    if std::time::Instant::now() >= end {
                        canceled.store(true, Ordering::SeqCst);
                        return false;
                    }
                    thread::sleep(Duration::from_millis(2));
                }
                Err(error) => panic!("accept: {error}"),
            }
        }
    });
    assert!(evaluate(&vm, &format!("fetch('http://{authority}/')")).is_err());
    assert!(vm.cancellation().is_cancelled());
    assert!(
        worker.join().unwrap(),
        "request must reach the waiting server"
    );
}

#[test]
fn changed_host_authority_prevents_a_redirected_request() {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    listener.set_nonblocking(true).unwrap();
    let authority = listener.local_addr().unwrap().to_string();
    let current = Arc::new(AtomicBool::new(true));
    let lease = current.clone();
    let vm = vm();
    vm.set_proxy(Proxy::Disabled).unwrap();
    vm.set_network_authority_check(move || {
        if lease.load(Ordering::SeqCst) {
            Ok(())
        } else {
            Err("revision changed".into())
        }
    })
    .unwrap();
    vm.bind_network(NetworkPolicy {
        domain: authority.clone(),
        ..NetworkPolicy::default()
    })
    .unwrap();
    assert!(vm.set_network_authority_check(|| Ok(())).is_err());
    let worker = thread::spawn(move || {
        let end = std::time::Instant::now() + Duration::from_secs(2);
        let mut hits = 0;
        let mut first_request_at = None;
        while std::time::Instant::now() < end {
            match listener.accept() {
                Ok((mut stream, _)) => {
                    stream
                        .set_read_timeout(Some(Duration::from_secs(1)))
                        .unwrap();
                    let mut request = [0u8; 4096];
                    assert!(stream.read(&mut request).unwrap() > 0);
                    hits += 1;
                    current.store(false, Ordering::SeqCst);
                    stream.write_all(b"HTTP/1.1 302 Found\r\nLocation: /next\r\nContent-Length: 0\r\nConnection: close\r\n\r\n").unwrap();
                    first_request_at.get_or_insert_with(std::time::Instant::now);
                }
                Err(error) if error.kind() == std::io::ErrorKind::WouldBlock => {
                    if first_request_at.is_some_and(|started: std::time::Instant| {
                        started.elapsed() > Duration::from_millis(100)
                    }) {
                        break;
                    }
                    thread::sleep(Duration::from_millis(2));
                }
                Err(error) => panic!("accept: {error}"),
            }
        }
        hits
    });
    assert!(evaluate(&vm, &format!("fetch('http://{authority}/start')")).is_err());
    assert!(vm.cancellation().is_cancelled());
    assert_eq!(worker.join().unwrap(), 1);
}

#[test]
fn dom_documents_are_vm_local_and_native_bridges_are_not_globals() {
    let first = vm();
    let second = vm();
    let hidden =
        "Object.getOwnPropertyNames(globalThis).filter(name => name.startsWith('__host_'))";
    assert_eq!(evaluate(&first, hidden).unwrap(), json!([]));
    assert_eq!(evaluate(&second, hidden).unwrap(), json!([]));
    assert_eq!(
        evaluate(
            &first,
            r#"(globalThis.document = new DOMParser().parseFromString('<p id="item">first</p>', 'text/html'), document.querySelector('#item').textContent)"#,
        )
        .unwrap(),
        "first"
    );
    assert_eq!(evaluate(&second, "typeof document").unwrap(), "undefined");
    assert_eq!(
        evaluate(
            &second,
            r#"(globalThis.document = new DOMParser().parseFromString('<p id="item">second</p>', 'text/html'), document.querySelector('#item').textContent)"#,
        )
        .unwrap(),
        "second"
    );
    assert_eq!(
        evaluate(
            &first,
            r#"(globalThis.__host_dom_text = () => 'forged', document.querySelector('#item').textContent)"#,
        )
        .unwrap(),
        "first"
    );
    evaluate(&first, "(document.querySelector('#item').remove(), true)").unwrap();
    assert_eq!(
        evaluate(&second, "document.querySelector('#item').textContent").unwrap(),
        "second"
    );
}

struct Server {
    authority: String,
    requests: Arc<AtomicUsize>,
    stopped: Arc<AtomicBool>,
    worker: Option<JoinHandle<()>>,
}

impl Server {
    fn new() -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let authority = listener.local_addr().unwrap().to_string();
        listener.set_nonblocking(true).unwrap();
        let requests = Arc::new(AtomicUsize::new(0));
        let stopped = Arc::new(AtomicBool::new(false));
        let seen = requests.clone();
        let stop = stopped.clone();
        let worker = thread::spawn(move || {
            while !stop.load(Ordering::Relaxed) {
                match listener.accept() {
                    Ok((mut stream, _)) => {
                        seen.fetch_add(1, Ordering::Relaxed);
                        reply(&mut stream);
                    }
                    Err(error) if error.kind() == std::io::ErrorKind::WouldBlock => {
                        thread::sleep(Duration::from_millis(2));
                    }
                    Err(error) => panic!("accept: {error}"),
                }
            }
        });
        Self {
            authority,
            requests,
            stopped,
            worker: Some(worker),
        }
    }

    fn policy(&self, path: &str) -> NetworkPolicy {
        NetworkPolicy {
            domain: self.authority.clone(),
            host_permissions: vec![format!("http://{}{path}/*", self.authority)],
            bypass: None,
        }
    }

    fn fetch(&self, path: &str) -> String {
        format!(
            "fetch({}).then(response => response.text())",
            serde_json::to_string(&format!("http://{}{path}", self.authority)).unwrap()
        )
    }
}

fn reply(stream: &mut TcpStream) {
    stream
        .set_read_timeout(Some(Duration::from_secs(2)))
        .unwrap();
    stream
        .set_write_timeout(Some(Duration::from_secs(2)))
        .unwrap();
    let mut input = Vec::new();
    let mut buffer = [0; 1024];
    while !input.windows(4).any(|window| window == b"\r\n\r\n") {
        match stream.read(&mut buffer) {
            Ok(0) | Err(_) => return,
            Ok(count) => input.extend_from_slice(&buffer[..count]),
        }
        if input.len() > 32 * 1024 {
            return;
        }
    }
    let request = String::from_utf8_lossy(&input);
    let path = request.split_whitespace().nth(1).unwrap_or("/");
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{path}",
        path.len()
    );
    let _ = stream.write_all(response.as_bytes());
}

impl Drop for Server {
    fn drop(&mut self) {
        self.stopped.store(true, Ordering::Relaxed);
        self.worker.take().unwrap().join().unwrap();
    }
}

#[test]
fn network_authority_is_host_bound_once_and_isolated_per_vm() {
    let server = Server::new();
    let first = vm();
    let second = vm();
    first.set_proxy(Proxy::Disabled).unwrap();
    second.set_proxy(Proxy::Disabled).unwrap();

    // Extension metadata cannot grant privileges to an unbound VM.
    evaluate(
        &first,
        &format!(
            "(globalThis.SYNURA = {{domain:{}}}, true)",
            serde_json::to_string(&server.authority).unwrap()
        ),
    )
    .unwrap();
    assert!(evaluate(&first, &server.fetch("/one/a")).is_err());
    assert_eq!(server.requests.load(Ordering::Relaxed), 0);

    first.bind_network(server.policy("/one")).unwrap();
    second.bind_network(server.policy("/two")).unwrap();
    assert!(first.bind_network(server.policy("/two")).is_err());
    assert!(evaluate(&first, &server.fetch("/two/a")).is_err());
    assert!(evaluate(&second, &server.fetch("/one/a")).is_err());
    assert_eq!(server.requests.load(Ordering::Relaxed), 0);

    assert_eq!(evaluate(&first, &server.fetch("/one/a")).unwrap(), "/one/a");
    assert_eq!(
        evaluate(&second, &server.fetch("/two/a")).unwrap(),
        "/two/a"
    );
    assert_eq!(server.requests.load(Ordering::Relaxed), 2);
}
