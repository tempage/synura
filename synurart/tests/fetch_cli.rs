//! Synthetic local HTTP fixtures for asynchronous CLI and view callbacks.
use serde_json::Value;
use std::fs;
use std::io::{Read, Write};
use std::net::TcpListener;
use std::path::PathBuf;
use std::process::{Command, Output};
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::Arc;
use std::thread::{self, JoinHandle};
use std::time::{Duration, Instant};

struct Server {
    authority: String,
    stopped: Arc<AtomicBool>,
    worker: Option<JoinHandle<()>>,
}

impl Server {
    fn new() -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let authority = listener.local_addr().unwrap().to_string();
        listener.set_nonblocking(true).unwrap();
        let stopped = Arc::new(AtomicBool::new(false));
        let stop = stopped.clone();
        let worker = thread::spawn(move || {
            let deadline = Instant::now() + Duration::from_secs(15);
            while !stop.load(Ordering::Relaxed) && Instant::now() < deadline {
                let (mut stream, _) = match listener.accept() {
                    Ok(accepted) => accepted,
                    Err(error) if error.kind() == std::io::ErrorKind::WouldBlock => {
                        thread::sleep(Duration::from_millis(2));
                        continue;
                    }
                    error => panic!("accept: {error:?}"),
                };
                stream
                    .set_read_timeout(Some(Duration::from_secs(1)))
                    .unwrap();
                stream
                    .set_write_timeout(Some(Duration::from_secs(1)))
                    .unwrap();
                let mut request = Vec::new();
                let mut buffer = [0; 1024];
                while !request.windows(4).any(|bytes| bytes == b"\r\n\r\n") {
                    let count = stream.read(&mut buffer).unwrap();
                    if count == 0 {
                        break;
                    }
                    request.extend_from_slice(&buffer[..count]);
                    assert!(request.len() < 32 * 1024);
                }
                let _ = stream.write_all(
                    b"HTTP/1.1 200 OK\r\nContent-Length: 3\r\nConnection: close\r\n\r\nabc",
                );
            }
        });
        Self {
            authority,
            stopped,
            worker: Some(worker),
        }
    }
}

impl Drop for Server {
    fn drop(&mut self) {
        self.stopped.store(true, Ordering::Relaxed);
        self.worker.take().unwrap().join().unwrap();
    }
}

struct Fixture(PathBuf);

impl Fixture {
    fn new(authority: &str, source: &str) -> Self {
        static NEXT: AtomicU64 = AtomicU64::new(0);
        let directory = std::env::temp_dir().join(format!(
            "synurart-fetch-cli-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir(&directory).unwrap();
        let source = format!("globalThis.SYNURA = {{domain:{authority:?}}};\nglobalThis.base='http://{authority}';\n{source}");
        fs::write(directory.join("extension.js"), source).unwrap();
        Self(directory)
    }

    fn run(&self, command: &str) -> Output {
        Command::new(env!("CARGO_BIN_EXE_synurart"))
            .args([
                "-json",
                "--proxy=off",
                "-ext",
                "extension.js",
                "-e",
                command,
            ])
            .current_dir(&self.0)
            .output()
            .unwrap()
    }

    fn runtime(&self) -> synurart::SynurartRuntime {
        let runtime = synurart::SynurartRuntime::new(
            true,
            self.0.join("storage.json"),
            self.0.join("extension.js"),
        )
        .unwrap();
        runtime.disable_fetch_proxy();
        runtime
            .load_extension(&self.0.join("extension.js"))
            .unwrap();
        runtime
    }
}

impl Drop for Fixture {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.0);
    }
}

fn event(output: &Output, kind: &str) -> Value {
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8_lossy(&output.stdout)
        .lines()
        .filter_map(|line| serde_json::from_str::<Value>(line).ok())
        .find(|value| value["type"] == kind)
        .unwrap_or_else(|| {
            panic!(
                "missing {kind}: {}",
                String::from_utf8_lossy(&output.stdout)
            )
        })
}

#[test]
fn extension_and_load_callbacks_finish_fetch_crypto_fetch_chains() {
    let server = Server::new();
    let fixture = Fixture::new(
        &server.authority,
        r#"
SYNURA.main = {async home() {
    const response=await fetch(base+'/title');
    synura.open({view:'/views/post',models:{title:await response.text()}}, {}, async event => {
        if(event.eventId!=='LOAD') return;
        const bytes=await (await fetch(base+'/bytes')).arrayBuffer();
        const digest=await crypto.subtle.digest('SHA-256',bytes);
        const hex=Array.from(new Uint8Array(digest), x=>x.toString(16).padStart(2,'0')).join('');
        const tail=await fetch(base+'/tail').then(response=>response.text());
        synura.update(event.viewId,{models:{content:[{type:'text',value:hex+':'+tail}]}});
    });
}};
"#,
    );
    let views = event(&fixture.run("views"), "views");
    assert_eq!(views["activeView"]["models"]["title"]["message"], "abc");
    assert_eq!(
        views["activeView"]["models"]["content"]["details"][0]["value"],
        "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad:abc"
    );
}

#[test]
fn eval_and_view_events_await_fetch_and_body_promises() {
    let server = Server::new();
    let fixture = Fixture::new(
        &server.authority,
        r#"
SYNURA.main = {home() {
    synura.open({view:'/views/post'}, {}, async event => {
        if(event.eventId!=='REFRESH') return;
        const text=await fetch(base+'/refresh').then(response=>response.text());
        synura.update(event.viewId,{models:{title:'fetched: '+text}});
    });
}};
"#,
    );
    let evaluated = event(
        &fixture.run("eval \"fetch(base+'/eval').then(response=>response.text())\""),
        "eval",
    );
    assert_eq!(evaluated["result"], "abc");
    let refreshed = fixture.run("refresh 1");
    assert!(refreshed.status.success());
    let lines: Vec<Value> = String::from_utf8_lossy(&refreshed.stderr)
        .lines()
        .filter_map(|line| serde_json::from_str(line).ok())
        .collect();
    assert!(
        lines
            .iter()
            .any(|value| value["type"] == "update"
                && value["diff"]["models"]["title"] == "fetched: abc"),
        "{lines:?}"
    );
}

#[test]
fn waiting_load_callback_can_fetch_after_a_later_host_event() {
    let server = Server::new();
    let fixture = Fixture::new(
        &server.authority,
        r#"
SYNURA.main = {home() {
    synura.open({view:'/views/post',models:{title:'waiting'}}, {}, async event => {
        if(event.eventId!=='LOAD') return;
        await new Promise(resolve=>{globalThis.finishLoad=resolve;});
        const text=await fetch(base+'/later').then(response=>response.text());
        synura.update(event.viewId,{models:{title:text}});
    });
}};
"#,
    );
    let runtime = fixture.runtime();
    runtime.call_main("home", &[]).unwrap();
    assert_eq!(
        runtime.snapshot().unwrap()["activeView"]["models"]["title"]["message"],
        "waiting"
    );
    runtime.eval_js("finishLoad(); undefined").unwrap();
    assert_eq!(
        runtime.snapshot().unwrap()["activeView"]["models"]["title"]["message"],
        "abc"
    );
}

#[test]
fn foreground_failure_drains_submitted_fetch_and_background_rejection() {
    let server = Server::new();
    let fixture = Fixture::new(&server.authority, "");
    let runtime = fixture.runtime();
    let error = runtime
        .eval_js(
            r#"
        synura.open({view:'/views/post'}, {}, async event => {
            if(event.eventId!=='LOAD') return;
            await fetch(base+'/background').then(response=>response.text());
            globalThis.backgroundFinished=true;
            throw new Error('background failure');
        });
        throw new Error('foreground failure');
    "#,
        )
        .unwrap_err();
    assert!(error.contains("foreground failure"), "{error}");
    assert_eq!(
        runtime.eval_js("backgroundFinished").unwrap()["result"],
        true
    );
    assert!(runtime.snapshot().is_ok());
}

#[test]
fn async_event_branches_from_its_source_view_after_fetch() {
    let server = Server::new();
    let fixture = Fixture::new(
        &server.authority,
        r#"
SYNURA.main = {home() {
    synura.open({view:'/views/post',styles:{title:'A'}}, {}, async event => {
        if(event.eventId!=='REFRESH') return;
        await fetch(base+'/navigation').then(response=>response.text());
        synura.open({view:'/views/post',styles:{title:'C'}});
    });
    synura.open({view:'/views/post',styles:{title:'B'}});
}};
"#,
    );
    let runtime = fixture.runtime();
    runtime.call_main("home", &[]).unwrap();
    runtime.emit(1, "REFRESH", serde_json::json!({})).unwrap();
    let snapshot = runtime.snapshot().unwrap();
    let titles: Vec<_> = snapshot["views"]
        .as_array()
        .unwrap()
        .iter()
        .map(|view| view["title"].as_str().unwrap())
        .collect();
    assert_eq!(titles, ["A", "C"]);
}

fn view_titles(runtime: &synurart::SynurartRuntime) -> Vec<String> {
    runtime.snapshot().unwrap()["views"]
        .as_array()
        .unwrap()
        .iter()
        .map(|view| view["title"].as_str().unwrap().to_owned())
        .collect()
}

#[test]
fn pending_loads_do_not_own_foreground_or_later_navigation() {
    let server = Server::new();
    let fixture = Fixture::new(
        &server.authority,
        r#"
function openTitle(title, callback) {
    return synura.open({view:'/views/post',styles:{title}}, {}, callback);
}
SYNURA.main = {home() {
    openTitle('A', async event => {
        if(event.eventId!=='REFRESH') return;
        if(event.data.releaseBackground) releaseLoad();
        await fetch(base+'/foreground');
        openTitle('C', async event => {
            if(event.eventId!=='LOAD') return;
            await fetch(base+'/nested');
            openTitle('D');
        });
    });
    openTitle('B', async event => {
        if(event.eventId!=='LOAD') return;
        await new Promise(resolve=>{globalThis.releaseLoad=resolve;});
        openTitle('background');
    });
}};
"#,
    );
    let runtime = fixture.runtime();
    runtime.call_main("home", &[]).unwrap();
    assert_eq!(view_titles(&runtime), ["A", "B"]);
    runtime.emit(1, "REFRESH", serde_json::json!({})).unwrap();
    assert_eq!(view_titles(&runtime), ["A", "C", "D"]);
    // A dormant LOAD belongs to background work after the host turn ends. It
    // appends to the current branch, even if its original view was discarded.
    runtime.eval_js("releaseLoad(); undefined").unwrap();
    assert_eq!(view_titles(&runtime), ["A", "C", "D", "background"]);
    runtime.emit(1, "REFRESH", serde_json::json!({})).unwrap();
    assert_eq!(view_titles(&runtime), ["A", "C", "D"]);

    // If background work opens during a foreground interaction, both continue
    // on that interaction's selected branch instead of restoring stale B.
    let overlapping = fixture.runtime();
    overlapping.call_main("home", &[]).unwrap();
    overlapping
        .emit(1, "REFRESH", serde_json::json!({"releaseBackground": true}))
        .unwrap();
    assert_eq!(view_titles(&overlapping), ["A", "background", "C", "D"]);
}

#[test]
fn synchronous_nested_callbacks_keep_their_own_navigation_source() {
    let fixture = Fixture::new(
        "example.test",
        r#"
function openTitle(title, callback) {
    return synura.open({view:'/views/post',styles:{title}}, {}, callback);
}
SYNURA.main = {home() {
    openTitle('A', event => {
        if(event.eventId!=='REFRESH') return;
        openTitle('C', event => {
            if(event.eventId==='LOAD') openTitle('D');
        });
    });
    openTitle('B');
}};
"#,
    );
    let runtime = fixture.runtime();
    runtime.call_main("home", &[]).unwrap();
    runtime.emit(1, "REFRESH", serde_json::json!({})).unwrap();
    assert_eq!(view_titles(&runtime), ["A", "C", "D"]);
}

#[test]
fn update_only_and_rejected_events_leave_no_navigation_source() {
    let fixture = Fixture::new(
        "example.test",
        r#"
function openTitle(title) {
    return synura.open({view:'/views/post',styles:{title}});
}
SYNURA.main = {home() {
    synura.open({view:'/views/post',styles:{title:'A'}}, {}, async event => {
        if(event.eventId==='LOAD') return;
        await Promise.resolve();
        if(event.eventId==='FAIL') throw new Error('callback failed');
        synura.update(event.viewId,{models:{title:'updated'}});
    });
    openTitle('B');
}};
"#,
    );
    let runtime = fixture.runtime();
    runtime.call_main("home", &[]).unwrap();
    runtime.emit(1, "REFRESH", serde_json::json!({})).unwrap();
    assert_eq!(view_titles(&runtime), ["A", "B"]);
    runtime.eval_js("openTitle('C')").unwrap();
    assert_eq!(view_titles(&runtime), ["A", "B", "C"]);
    let error = runtime.emit(1, "FAIL", serde_json::json!({})).unwrap_err();
    assert!(error.contains("callback failed"), "{error}");
    runtime.eval_js("openTitle('D')").unwrap();
    assert_eq!(view_titles(&runtime), ["A", "B", "C", "D"]);
}

#[test]
fn unfinished_event_does_not_leak_or_clear_a_later_interaction() {
    let fixture = Fixture::new(
        "example.test",
        r#"
function openTitle(title, callback) {
    return synura.open({view:'/views/post',styles:{title}}, {}, callback);
}
SYNURA.main = {home() {
    openTitle('A', async event => {
        if(event.eventId!=='REFRESH') return;
        await new Promise(resolve=>{globalThis.releaseEvent=resolve;});
    });
    openTitle('B', async event => {
        if(event.eventId!=='REFRESH') return;
        releaseEvent();
        // Give A's obsolete completion handler a chance to run before opening.
        for(let i=0;i<8;i++) await Promise.resolve();
        openTitle('D');
    });
}};
"#,
    );
    let runtime = fixture.runtime();
    runtime.call_main("home", &[]).unwrap();
    assert!(runtime.emit(1, "REFRESH", serde_json::json!({})).is_err());
    runtime.eval_js("openTitle('C')").unwrap();
    assert_eq!(view_titles(&runtime), ["A", "B", "C"]);
    runtime.emit(2, "REFRESH", serde_json::json!({})).unwrap();
    assert_eq!(view_titles(&runtime), ["A", "B", "D"]);
}

#[test]
fn async_navigation_from_a_closed_source_preserves_remaining_views() {
    let fixture = Fixture::new(
        "example.test",
        r#"
SYNURA.main = {home() {
    synura.open({view:'/views/post',styles:{title:'A'}}, {}, async event => {
        if(event.eventId!=='REFRESH') return;
        synura.close(event.viewId);
        await Promise.resolve();
        synura.open({view:'/views/post',styles:{title:'C'}});
    });
    synura.open({view:'/views/post',styles:{title:'B'}});
}};
"#,
    );
    let runtime = fixture.runtime();
    runtime.call_main("home", &[]).unwrap();
    runtime.emit(1, "REFRESH", serde_json::json!({})).unwrap();
    assert_eq!(view_titles(&runtime), ["B", "C"]);
}
