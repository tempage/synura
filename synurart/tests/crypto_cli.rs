//! Public/synthetic inputs only: no downloaded content or authenticated sessions.
use serde_json::Value;
use std::fs;
use std::path::PathBuf;
use std::process::{Command, Output};
use std::sync::atomic::{AtomicU64, Ordering};

static NEXT_FIXTURE: AtomicU64 = AtomicU64::new(0);

struct Fixture(PathBuf);

impl Fixture {
    fn new(source: &str) -> Self {
        let path = std::env::temp_dir().join(format!(
            "synurart-crypto-cli-{}-{}",
            std::process::id(),
            NEXT_FIXTURE.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir_all(&path).unwrap();
        fs::write(path.join("extension.js"), source).unwrap();
        Self(path)
    }

    fn run(&self, command: &str) -> Output {
        Command::new(env!("CARGO_BIN_EXE_synurart"))
            .args(["-json", "-ext", "extension.js", "-e", command])
            .current_dir(&self.0)
            .output()
            .unwrap()
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
        .unwrap_or_else(|| panic!("missing {kind} event: {:?}", output.stdout))
}

#[test]
fn async_extension_and_load_callback_finish_before_views_are_returned() {
    let fixture = Fixture::new(
        r#"
globalThis.SYNURA = {main: {async home() {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('abc'));
    const hex = Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
    synura.open({view:'/views/post', models:{title:hex}}, {}, async event => {
        if (event.eventId !== 'LOAD') return;
        const key = await crypto.subtle.importKey('raw', new Uint8Array(16), 'AES-GCM', false, ['encrypt']);
        const encrypted = await crypto.subtle.encrypt({name:'AES-GCM',iv:new Uint8Array(12)},key,new Uint8Array());
        synura.update(event.viewId, {models:{content:[{type:'text',value:'tag bytes: '+encrypted.byteLength}]}});
    });
}}};
"#,
    );
    let views = event(&fixture.run("views"), "views");
    assert_eq!(
        views["activeView"]["models"]["title"]["message"],
        "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
    assert_eq!(
        views["activeView"]["models"]["content"]["details"][0]["value"],
        "tag bytes: 16"
    );
}

#[test]
fn eval_and_event_commands_await_crypto_promises() {
    let fixture = Fixture::new(
        r#"
globalThis.SYNURA = {main: {home() {
    synura.open({view:'/views/post'}, {}, async event => {
        if (event.eventId !== 'REFRESH') return;
        const digest = await crypto.subtle.digest('SHA-256', new Uint8Array());
        synura.update(event.viewId, {models:{title:'digest bytes: '+digest.byteLength}});
    });
}}};
"#,
    );
    let evaluated = event(
        &fixture.run("eval \"crypto.subtle.digest('SHA-256', new Uint8Array()).then(bytes => bytes.byteLength)\""),
        "eval",
    );
    assert_eq!(evaluated["result"], 32);
    let refreshed = fixture.run("refresh 1");
    assert!(refreshed.status.success());
    // Runtime events are written to stderr; stdout contains command results.
    let lines: Vec<Value> = String::from_utf8_lossy(&refreshed.stderr)
        .lines()
        .filter_map(|line| serde_json::from_str(line).ok())
        .collect();
    assert!(
        lines.iter().any(|value| {
            value["type"] == "update" && value["diff"]["models"]["title"] == "digest bytes: 32"
        }),
        "{lines:?}"
    );
}

#[test]
fn rejected_async_load_callback_is_reported_to_host() {
    let fixture = Fixture::new(
        r#"
globalThis.SYNURA = {main:{home() {
    synura.open({view:'/views/post'}, {}, async event => {
        if (event.eventId === 'LOAD') await crypto.subtle.digest('unsupported-digest', new Uint8Array());
    });
}}};
"#,
    );
    let output = fixture.run("views");
    // Initial home errors are reported while preserving the interactive shell.
    assert!(output.status.success());
    let error = String::from_utf8_lossy(&output.stderr);
    assert!(error.contains("NotSupportedError"), "{error}");
    // An explicitly invoked entry point does fail the one-shot command.
    let explicit = fixture.run("home");
    assert!(!explicit.status.success());
    assert!(String::from_utf8_lossy(&explicit.stderr).contains("NotSupportedError"));
}

#[test]
fn pending_load_callback_does_not_block_later_host_events() {
    let fixture = Fixture::new(
        r#"
globalThis.SYNURA = {main:{home() {
    synura.open({view:'/views/post',models:{title:'waiting'}}, {}, async event => {
        if (event.eventId !== 'LOAD') return;
        await new Promise(resolve => { globalThis.finishLoad = resolve; });
        const bytes = await crypto.subtle.digest('SHA-256', new Uint8Array());
        synura.update(event.viewId, {models:{title:'finished: '+bytes.byteLength}});
    });
}}};
"#,
    );
    let runtime = synurart::SynurartRuntime::new(
        true,
        fixture.0.join("storage.json"),
        fixture.0.join("extension.js"),
    )
    .unwrap();
    runtime
        .load_extension(&fixture.0.join("extension.js"))
        .unwrap();
    runtime.call_main("home", &[]).unwrap();
    assert_eq!(
        runtime.snapshot().unwrap()["activeView"]["models"]["title"]["message"],
        "waiting"
    );
    runtime.eval_js("finishLoad(); undefined").unwrap();
    assert_eq!(
        runtime.snapshot().unwrap()["activeView"]["models"]["title"]["message"],
        "finished: 32"
    );
}

#[test]
fn foreground_error_still_drains_background_crypto_callbacks() {
    let fixture = Fixture::new("");
    let runtime = synurart::SynurartRuntime::new(
        true,
        fixture.0.join("storage.json"),
        fixture.0.join("extension.js"),
    )
    .unwrap();
    let error = runtime
        .eval_js(
            r#"
        synura.open({view:'/views/post'}, {}, async event => {
            if (event.eventId !== 'LOAD') return;
            await crypto.subtle.digest('SHA-256', new Uint8Array());
            throw new Error('background failure');
        });
        throw new Error('foreground failure');
    "#,
        )
        .unwrap_err();
    assert!(error.contains("foreground failure"), "{error}");
    // The background rejection belongs to the failed turn, not a later command.
    assert!(runtime.snapshot().is_ok());
    assert_eq!(runtime.eval_js("42").unwrap()["result"], 42);
}
