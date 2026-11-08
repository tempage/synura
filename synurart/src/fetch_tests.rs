use crate::tests::{result, runtime};
use serde_json::{json, Value};
use std::io::{Read, Write};
use std::net::TcpListener;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::thread::{self, JoinHandle};
use std::time::{Duration, Instant};
use synura_runtime::rquickjs;

struct Server {
    authority: String,
    stop: Arc<AtomicBool>,
    worker: Option<JoinHandle<Vec<String>>>,
}

impl Server {
    fn new(responses: Vec<String>) -> Self {
        Self::bytes(responses.into_iter().map(String::into_bytes).collect())
    }

    fn bytes(responses: Vec<Vec<u8>>) -> Self {
        Self::delayed_close(responses, Duration::ZERO)
    }

    fn delayed_close(responses: Vec<Vec<u8>>, close_delay: Duration) -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let authority = listener.local_addr().unwrap().to_string();
        listener.set_nonblocking(true).unwrap();
        let stop = Arc::new(AtomicBool::new(false));
        let stopped = stop.clone();
        let worker = thread::spawn(move || {
            let deadline = Instant::now() + Duration::from_secs(10);
            let mut requests = Vec::new();
            while !stopped.load(Ordering::Relaxed) && Instant::now() < deadline {
                let (mut stream, _) = match listener.accept() {
                    Ok(connection) => connection,
                    Err(error) if error.kind() == std::io::ErrorKind::WouldBlock => {
                        thread::sleep(Duration::from_millis(2));
                        continue;
                    }
                    Err(error) => panic!("accept: {error}"),
                };
                stream
                    .set_read_timeout(Some(Duration::from_secs(1)))
                    .unwrap();
                stream
                    .set_write_timeout(Some(Duration::from_secs(1)))
                    .unwrap();
                let mut request = Vec::new();
                let mut buffer = [0; 1024];
                loop {
                    if let Some(end) = request.windows(4).position(|part| part == b"\r\n\r\n") {
                        let length = String::from_utf8_lossy(&request[..end])
                            .lines()
                            .find_map(|line| {
                                let (key, value) = line.split_once(':')?;
                                key.eq_ignore_ascii_case("content-length")
                                    .then(|| value.trim().parse::<usize>().unwrap())
                            })
                            .unwrap_or(0);
                        if request.len() >= end + 4 + length {
                            break;
                        }
                    }
                    match stream.read(&mut buffer) {
                        Ok(0) | Err(_) => break,
                        Ok(count) => request.extend_from_slice(&buffer[..count]),
                    }
                    assert!(request.len() < 32 * 1024, "unexpectedly large request");
                }
                let response = responses.get(requests.len()).cloned().unwrap_or_else(|| {
                    reply("500 Internal Server Error", "", "unexpected request").into_bytes()
                });
                requests.push(String::from_utf8(request).unwrap());
                let _ = stream.write_all(&response);
                thread::sleep(close_delay);
            }
            requests
        });
        Self {
            authority,
            stop,
            worker: Some(worker),
        }
    }

    fn eval(&self, script: &str) -> Value {
        self.eval_scoped(script, &[])
    }

    fn eval_scoped(&self, script: &str, paths: &[&str]) -> Value {
        let rt = runtime();
        rt.bind_network(serde_json::from_value(json!({
            "domain": self.authority,
            "host_permissions": paths.iter().map(|path| format!("http://{}{path}", self.authority)).collect::<Vec<_>>()
        })).unwrap()).unwrap();
        rt.set_timeout(1500).unwrap();
        result(&rt, &format!(
            "(async () => {{ globalThis.SYNURA = {{domain: {domain:?}}}; const base = {base:?}; {script} }})()",
            domain = self.authority,
            base = format!("http://{}", self.authority),
        ))
    }

    fn finish(mut self) -> Vec<String> {
        self.stop.store(true, Ordering::Relaxed);
        self.worker.take().unwrap().join().unwrap()
    }
}

impl Drop for Server {
    fn drop(&mut self) {
        self.stop.store(true, Ordering::Relaxed);
        if let Some(worker) = self.worker.take() {
            let _ = worker.join();
        }
    }
}

fn reply(status: &str, headers: &str, body: &str) -> String {
    format!(
        "HTTP/1.1 {status}\r\nContent-Length: {}\r\nConnection: close\r\n{headers}\r\n{body}",
        body.len()
    )
}

fn cookie_header(request: &str) -> Option<&str> {
    request.lines().find_map(|line| {
        let (name, value) = line.split_once(':')?;
        name.eq_ignore_ascii_case("cookie").then(|| value.trim())
    })
}

fn read_request_head(stream: &mut std::net::TcpStream) -> String {
    let mut request = Vec::new();
    let mut buffer = [0; 1024];
    while !request.windows(4).any(|bytes| bytes == b"\r\n\r\n") {
        let count = stream.read(&mut buffer).unwrap();
        assert!(count > 0, "connection closed before request headers");
        request.extend_from_slice(&buffer[..count]);
        assert!(request.len() < 32 * 1024);
    }
    String::from_utf8(request).unwrap()
}

#[test]
fn pooled_connections_notice_server_close_between_fetch_calls() {
    let response = b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: keep-alive\r\n\r\nok";
    let server = Server::delayed_close(vec![response.to_vec(); 3], Duration::from_millis(30));
    let rt = runtime();
    load_package(&rt, json!({"domain":server.authority})).unwrap();
    rt.set_timeout(1500).unwrap();
    rt.eval_js(&format!(
        "globalThis.SYNURA = {{domain: {:?}}}",
        server.authority
    ))
    .unwrap();
    for _ in 0..3 {
        assert_eq!(
            result(
                &rt,
                &format!(
                    "fetch({:?}).then(response => response.text())",
                    format!("http://{}/read", server.authority)
                )
            ),
            "ok"
        );
        // The host is idle while the server silently closes its keep-alive socket.
        thread::sleep(Duration::from_millis(100));
    }
    assert_eq!(server.finish().len(), 3);
}

#[test]
fn response_headers_preserve_cookies_and_expose_case_insensitive_access() {
    let cookies = [
        "first=one; Expires=Wed, 09 Jun 2027 10:18:14 GMT; Path=/",
        "second=two; Path=/",
    ];
    let server = Server::new(vec![reply(
        "200 OK",
        &format!(
            "Set-Cookie: {}\r\nSet-Cookie: {}\r\nX-Example: first\r\nX-Example: second\r\n",
            cookies[0], cookies[1]
        ),
        "body",
    )]);
    let out = server.eval(r#"
        const response = await fetch(base + "/headers");
        function failure(fn) { try { fn(); return "unexpected"; } catch(e) { return e.name; } }
        return { status: response.status, statusText: response.statusText, body: await response.text(),
            cookies: response.headers.getSetCookie(), cookie: response.headers.get("set-cookie"),
            flat: typeof response.headers["set-cookie"], example: response.headers.get("X-EXAMPLE"),
            missing: response.headers.get("missing") === null, missingAll: response.headers.has("missing"),
            required: [failure(() => response.headers.get()), failure(() => response.headers.has())],
            entries: Array.from(response.headers.entries()).filter(pair => pair[0].toLowerCase() === "set-cookie") };
    "#);
    assert_eq!(out["status"], 200);
    assert_eq!(out["statusText"], "OK");
    assert_eq!(out["body"], "body");
    assert_eq!(out["cookies"], json!(cookies));
    assert_eq!(out["cookie"], cookies.join(", "));
    assert_eq!(out["flat"], "undefined");
    assert_eq!(out["example"], "first, second");
    assert_eq!(out["missing"], true);
    assert_eq!(out["missingAll"], false);
    assert_eq!(out["required"], json!(["TypeError", "TypeError"]));
    assert_eq!(
        out["entries"],
        json!([["set-cookie", cookies[0]], ["set-cookie", cookies[1]]])
    );
    assert_eq!(server.finish().len(), 1);
}

#[test]
fn redirects_carry_scoped_cookies_without_persisting_or_overriding_explicit_cookie() {
    let redirect = reply("302 Found", "Location: ../done\r\nSet-Cookie: session=anonymous; Path=/\r\nSet-Cookie: narrow=hidden; Path=/private\r\nSet-Cookie: secure=hidden; Path=/; Secure\r\n", "");
    let server = Server::new(vec![
        redirect.clone(),
        reply("200 OK", "", "redirected"),
        reply("200 OK", "", "fresh"),
        redirect,
        reply("200 OK", "", "explicit"),
    ]);
    let out = server.eval(r#"
        const first = await fetch(base + "/start/page");
        const second = await fetch(base + "/fresh");
        const explicit = await fetch(base + "/start/page", {headers: {Cookie: "chosen=manual"}});
        return {status: first.status, url: first.url, body: await first.text(), second: second.status, explicit: explicit.status};
    "#);
    assert_eq!(out["status"], 200);
    assert_eq!(out["url"], format!("http://{}/done", server.authority));
    assert_eq!(out["body"], "redirected");
    assert_eq!(out["second"], 200);
    assert_eq!(out["explicit"], 200);
    let requests = server.finish();
    assert_eq!(requests.len(), 5);
    assert!(requests[1].starts_with("GET /done "));
    assert_eq!(cookie_header(&requests[0]), None);
    assert_eq!(cookie_header(&requests[1]), Some("session=anonymous"));
    assert_eq!(cookie_header(&requests[2]), None);
    assert_eq!(cookie_header(&requests[3]), Some("chosen=manual"));
    assert_eq!(cookie_header(&requests[4]), Some("chosen=manual"));
}

#[test]
fn redirects_are_checked_against_path_permissions_before_connecting() {
    let server = Server::new(vec![reply(
        "302 Found",
        "Location: /blocked/allowed/page\r\n",
        "",
    )]);
    let out = server.eval_scoped(
        r#"
        SYNURA.host_permissions = [base + "/allowed/*"];
        try { await fetch(base + "/allowed/start"); return {}; }
        catch (error) { return {name: error.name, error: error.message}; }
    "#,
        &["/allowed/*"],
    );
    assert_eq!(out["name"], "TypeError");
    assert!(out["error"].as_str().unwrap().contains("not allowed"));
    assert_eq!(server.finish().len(), 1);
}

#[test]
fn redirect_loops_stop_after_twenty_redirects() {
    let server = Server::new(vec![reply("302 Found", "Location: /loop\r\n", ""); 21]);
    let out = server.eval(
        r#"
        try { await fetch(base + "/loop"); return {}; }
        catch (error) { return {name: error.name, error: error.message}; }
    "#,
    );
    assert_eq!(out["name"], "TypeError");
    assert!(out["error"].as_str().unwrap().contains("20"));
    assert_eq!(server.finish().len(), 21);
}

#[test]
fn fetch_rejects_non_http_schemes_and_ports_outside_explicit_permissions() {
    let server = Server::new(vec![]);
    let out = server.eval_scoped(
        r#"
        SYNURA.host_permissions = [base + "/*"];
        async function errorFor(url) { try { await fetch(url); return "unexpected"; } catch(e) { return e.name + ":" + e.message; } }
        return {scheme: await errorFor(base.replace("http:", "ftp:") + "/test"),
            port: await errorFor("http://127.0.0.1:1/test")};
    "#,
        &["/*"],
    );
    assert!(out["scheme"].as_str().unwrap().starts_with("TypeError:"));
    assert!(out["scheme"].as_str().unwrap().contains("http"));
    assert!(out["port"].as_str().unwrap().contains("not allowed"));
    assert_eq!(server.finish().len(), 0);
}

#[test]
fn explicit_ports_paths_and_default_port_normalization() {
    let scoped = scope("example.com", &["http://example.com:8080/allowed/*/end"]);
    assert!(scoped
        .check(&url::Url::parse("http://example.com:8080/allowed/a/end").unwrap())
        .is_ok());
    for url in [
        "http://example.com/allowed/a/end",
        "http://example.com:8080/allowed/a/end/extra",
        "http://example.com:8080/other/allowed/a/end",
    ] {
        assert!(
            scoped.check(&url::Url::parse(url).unwrap()).is_err(),
            "{url}"
        );
    }
    let default_port = scope("example.com", &["http://example.com:80/*"]);
    assert!(default_port
        .check(&url::Url::parse("http://example.com:80/test").unwrap())
        .is_err());
}

fn scope(domain: &str, patterns: &[&str]) -> crate::FetchScope {
    crate::FetchScope::new(
        serde_json::from_value(json!({"domain": domain, "host_permissions": patterns})).unwrap(),
    )
    .unwrap()
}

fn load_package(rt: &crate::SynurartRuntime, package: Value) -> Result<(), String> {
    let file = rt.host.borrow().storage_namespace.clone();
    std::fs::write(&file, format!("var SYNURA = {package};")).unwrap();
    rt.load_extension(&file)
}

#[test]
fn body_readers_preserve_bytes_and_do_not_guess_charsets() {
    let mut legacy = reply(
        "200 OK",
        "Content-Type: text/plain; charset=iso-8859-1\r\n",
        "xx",
    )
    .into_bytes();
    legacy.truncate(legacy.len() - 2);
    legacy.extend_from_slice(&[b'a', 0xe9]);
    let server = Server::bytes(vec![
        legacy,
        reply(
            "200 OK",
            "Content-Type: text/plain; charset=shift_jis\r\n",
            "hello",
        )
        .into_bytes(),
        reply("200 OK", "", "\u{feff}hello").into_bytes(),
        reply("204 No Content", "", "").into_bytes(),
        reply("200 OK", "", "").into_bytes(),
        reply("200 OK", "", "<b>hello</b>").into_bytes(),
        reply("299 Custom", "", "{}").into_bytes(),
    ]);
    let out = server.eval(
        r#"
        const r = await fetch(base + "/legacy");
        const copy = r.clone();
        const ascii = await (await fetch(base + "/ascii")).text();
        const bom = (await (await fetch(base + "/bom")).text()).charCodeAt(0);
        async function failure(fn) { try { await fn(); return "unexpected"; } catch(e) { return e.name; } }
        const empty204 = await failure(async () => (await fetch(base + "/empty204")).json());
        const empty200 = await failure(async () => (await fetch(base + "/empty200")).json());
        const html = await fetch(base + "/html");
        return { text:await r.text(), bytes:Array.from(new Uint8Array(await copy.arrayBuffer())), ascii, bom,
            empty204, empty200, mime:await failure(() => html.clone().dom("application/xml")),
            html:(await html.dom("TEXT/HTML")).querySelector("b").textContent,
            unknownStatus:(await fetch(base + "/status")).statusText,
            extra:[typeof r.error, typeof r.networkMs, typeof synura.fetch] };
    "#,
    );
    assert_eq!(
        out,
        json!({"text":"a\u{fffd}","bytes":[97,233],"ascii":"hello","bom":104,
        "empty204":"SyntaxError","empty200":"SyntaxError","mime":"TypeError","html":"hello",
        "unknownStatus":"","extra":["undefined","undefined","undefined"]})
    );
    assert_eq!(server.finish().len(), 7);
}

#[test]
fn text_decoder_resolves_labels_through_the_shared_encoding_registry() {
    let rt = runtime();
    for (label, bytes, text) in [
        ("utf-8", vec![0xc3, 0xa9], "é"),
        ("windows-1252", vec![0xe9], "é"),
        ("ISO-8859-1", vec![0xe9], "é"),
        ("shift_jis", vec![0x93, 0xfa], "日"),
        ("gbk", vec![0xd6, 0xd0], "中"),
        ("euc-kr", vec![0xc7, 0xd1], "한"),
        ("ks_c_5601-1987", vec![0xc7, 0xd1], "한"),
    ] {
        assert_eq!(
            result(
                &rt,
                &format!(
                    "new TextDecoder({label:?}).decode(new Uint8Array({}))",
                    json!(bytes)
                )
            ),
            text,
            "{label}"
        );
    }
}

#[test]
fn request_headers_convert_values_and_structured_bodies_use_string_conversion() {
    let server = Server::new(vec![reply("200 OK", "", "ok"); 5]);
    let out = server.eval(r#"
        async function failure(options) { try { await fetch(base, options); return "unexpected"; } catch(e) { return e.name; } }
        const invalid = [await failure({headers:null}), await failure({headers:{"X-Test":42}}), await failure({headers:[]})];
        await fetch(base + "/object", {method:"POST", body:{z:1,a:{"2":2,"10":10}}});
        await fetch(base + "/array", {method:"POST", body:[1,2]});
        return {invalid, optional:(await fetch(base + "/optional", undefined)).status};
    "#);
    assert_eq!(
        out,
        json!({"invalid":["TypeError", "unexpected", "unexpected"],"optional":200})
    );
    let requests = server.finish();
    assert_eq!(requests.len(), 5);
    assert!(requests[0].to_ascii_lowercase().contains("x-test: 42\r\n"));
    assert!(requests[2].ends_with("[object Object]"));
    assert!(requests[3].ends_with("1,2"));
}

#[test]
fn package_network_metadata_is_bound_at_load_time() {
    let server = Server::new(vec![reply("200 OK", "", "ok")]);
    let rt = runtime();
    let base = format!("http://{}", server.authority);
    load_package(&rt, json!({"domain":server.authority,"host_permissions":[format!("{base}/allowed/*")],"bypass":"chrome/android"})).unwrap();
    let out = result(
        &rt,
        &format!(
            r#"(async () => {{
        SYNURA.domain = "another.example";
        SYNURA.host_permissions = [{base:?} + "/*"];
        SYNURA.bypass = "firefox/linux";
        let error;
        try {{ await fetch({base:?} + "/blocked"); }} catch(e) {{ error=e.name; }}
        return {{error, status:(await fetch({base:?} + "/allowed/page")).status}};
    }})()"#
        ),
    );
    assert_eq!(out, json!({"error":"TypeError","status":200}));
    let requests = server.finish();
    assert_eq!(requests.len(), 1);
    assert!(requests[0].contains("Chrome/142.0.0.0 Mobile"));
}

#[test]
fn package_validation_rejects_invalid_or_unrelated_permission_patterns() {
    for (domain, pattern) in [
        ("example.com", "https://other.net/*"),
        ("example.com", "https://*.com/*"),
        ("example.co.uk", "https://*.co.uk/*"),
        ("example.com", "https://example.com/*?q=1"),
        ("example.com", "https://example.com/*#fragment"),
        ("example.com", "https://user@example.com/*"),
        ("example.com", "ftp://example.com/*"),
        ("127.0.0.1:8080", "http://127.0.0.1:9090/*"),
        ("", "https://example.com/*"),
    ] {
        assert!(
            load_package(
                &runtime(),
                json!({"domain":domain,"host_permissions":[pattern]})
            )
            .is_err(),
            "{domain} {pattern}"
        );
    }
    for (domain, pattern, url) in [
        (
            "example.com",
            "https://*.example.com/*",
            "https://sub.example.com/test",
        ),
        (
            "www.example.com",
            "https://api.example.com/*",
            "https://api.example.com/test",
        ),
        (
            "example.com",
            "https://example.com/*",
            "https://example.com./test",
        ),
    ] {
        assert!(scope(domain, &[pattern])
            .check(&url::Url::parse(url).unwrap())
            .is_ok());
    }
    let root_only = scope("example.com", &["https://example.com"]);
    assert!(root_only
        .check(&url::Url::parse("https://example.com/").unwrap())
        .is_ok());
    assert!(root_only
        .check(&url::Url::parse("https://example.com/test").unwrap())
        .is_err());
    assert!(scope("127.0.0.1:8080", &[])
        .check(&url::Url::parse("http://127.0.0.1:9090/test").unwrap())
        .is_ok());
}

#[test]
fn optional_network_metadata_defaults_to_no_network_access() {
    for package in [json!({}), json!({"domain":null}), json!({"domain":42})] {
        let rt = runtime();
        load_package(&rt, package).unwrap();
        assert_eq!(
            result(
                &rt,
                r#"(async () => {
            try { await fetch("https://example.com/"); return false; }
            catch(e) { return e.name === "TypeError" && e.message.includes("disabled"); }
        })()"#
            ),
            true
        );
    }
    load_package(
        &runtime(),
        json!({"domain":"example.com","host_permissions":null}),
    )
    .unwrap();
}

#[test]
fn redirect_cookies_keep_case_distinct_names_and_apply_deletion() {
    let server = Server::new(vec![
        reply("302 Found", "Location: /done\r\nSet-Cookie: Token=one; Path=/\r\nSet-Cookie: token=two; Path=/; Max-Age=0\r\n", ""),
        reply("200 OK", "", "ok"),
    ]);
    assert_eq!(
        server.eval("return (await fetch(base + '/start')).status;"),
        200
    );
    assert_eq!(cookie_header(&server.finish()[1]), Some("Token=one"));
}

#[test]
fn host_proxy_routes_requests_without_changing_extension_permissions() {
    let proxy = Server::new(vec![reply("200 OK", "", "proxied")]);
    let rt = runtime();
    rt.set_fetch_proxy(Some(&format!("http://{}", proxy.authority)))
        .unwrap();
    load_package(&rt, json!({"domain":"service.example.test"})).unwrap();
    let out = result(
        &rt,
        r#"(async () => {
        let blocked;
        try { await fetch("http://other.example.test/"); } catch (e) { blocked=e.name; }
        return {blocked, text:await (await fetch("http://service.example.test/proxy")).text()};
    })()"#,
    );
    assert_eq!(out, json!({"blocked":"TypeError","text":"proxied"}));
    let requests = proxy.finish();
    assert_eq!(requests.len(), 1);
    assert!(requests[0].starts_with("GET http://service.example.test/proxy "));
}

#[test]
fn cancellation_interrupts_an_in_flight_request_and_can_be_replaced() {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let authority = listener.local_addr().unwrap().to_string();
    let (connected, ready) = std::sync::mpsc::channel();
    let (release, finish) = std::sync::mpsc::channel();
    let server = thread::spawn(move || {
        let (mut connection, _) = listener.accept().unwrap();
        connection
            .set_read_timeout(Some(Duration::from_secs(2)))
            .unwrap();
        let mut request = [0; 1];
        connection.read_exact(&mut request).unwrap();
        connected.send(()).unwrap();
        let _ = finish.recv_timeout(Duration::from_secs(3));
    });
    let cancellation = crate::FetchCancellation::default();
    let rt = runtime();
    rt.set_fetch_cancellation(cancellation.clone());
    rt.set_timeout(5000).unwrap();
    load_package(&rt, json!({"domain":authority})).unwrap();
    let canceller = thread::spawn(move || {
        ready.recv_timeout(Duration::from_secs(3)).unwrap();
        cancellation.cancel();
    });
    let start = Instant::now();
    let out = result(
        &rt,
        &format!(
            r#"(async () => {{
        try {{ await fetch("http://{authority}/slow"); return "unexpected"; }}
        catch(e) {{ return {{name:e.name, message:e.message}}; }}
    }})()"#
        ),
    );
    let elapsed = start.elapsed();
    let _ = release.send(());
    server.join().unwrap();
    canceller.join().unwrap();
    assert_eq!(out["name"], "AbortError");
    assert!(!out["message"].as_str().unwrap().is_empty());
    assert!(elapsed < Duration::from_secs(3));
    let replacement = crate::FetchCancellation::default();
    rt.set_fetch_cancellation(replacement.clone());
    assert!(!replacement.is_cancelled());
}

#[test]
fn oversized_declared_and_streamed_bodies_reject_body_readers() {
    let size = crate::MAX_BODY_BYTES + 1;
    let declared =
        format!("HTTP/1.1 200 OK\r\nContent-Length: {size}\r\nConnection: close\r\n\r\n")
            .into_bytes();
    let mut chunked = format!(
        "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\nConnection: close\r\n\r\n{size:x}\r\n"
    )
    .into_bytes();
    chunked.resize(chunked.len() + size, b'x');
    chunked.extend_from_slice(b"\r\n0\r\n\r\n");
    let server = Server::bytes(vec![declared, chunked]);
    let out = server.eval(
        r#"
        const errors = [];
        for (const path of ["/declared", "/streamed"]) {
            const response = await fetch(base + path);
            try { await response.arrayBuffer(); errors.push("unexpected"); }
            catch(e) { errors.push({status:response.status, name:e.name}); }
        }
        return errors;
    "#,
    );
    assert_eq!(
        out,
        json!([{"status":200,"name":"TypeError"},{"status":200,"name":"TypeError"}])
    );
    assert_eq!(server.finish().len(), 2);
}

#[test]
fn fetch_validation_returns_rejected_promises_without_synchronous_throws() {
    let server = Server::new(vec![]);
    let out = server.eval(
        r#"
        const operations = [
            () => fetch(),
            () => fetch('not a URL'),
            () => fetch(base, {headers:null}),
            () => fetch({toString() { throw new RangeError('conversion failed'); }}),
            () => fetch(base, {get method() { throw new RangeError('getter failed'); }})
        ];
        const results = [];
        for (const operation of operations) {
            let promise;
            try { promise = operation(); }
            catch (error) { results.push({sync:error.name}); continue; }
            try { await promise; results.push({resolved:true}); }
            catch (error) { results.push({promise:promise instanceof Promise, error:error.name}); }
        }
        return results;
    "#,
    );
    assert_eq!(
        out,
        json!([
            {"promise":true,"error":"TypeError"},
            {"promise":true,"error":"TypeError"},
            {"promise":true,"error":"TypeError"},
            {"promise":true,"error":"RangeError"},
            {"promise":true,"error":"RangeError"}
        ])
    );
    assert!(server.finish().is_empty());
}

#[test]
fn http_error_statuses_resolve_and_request_inputs_are_snapshotted_at_call_time() {
    let server = Server::new(vec![reply("404 Not Found", "", "missing")]);
    let out = server.eval(
        r#"
        let path = '/original';
        const options = {method:'POST',headers:{'X-Snapshot':'before'},body:JSON.stringify({value:'before'})};
        const pending = fetch({toString() { return base + path; }}, options);
        path = '/changed';
        options.method = 'DELETE';
        options.headers['X-Snapshot'] = 'after';
        options.body = JSON.stringify({value:'after'});
        const response = await pending;
        return {promise:pending instanceof Promise,status:response.status,ok:response.ok,
            statusText:response.statusText,body:await response.text()};
    "#,
    );
    assert_eq!(
        out,
        json!({"promise":true,"status":404,"ok":false,"statusText":"Not Found","body":"missing"})
    );
    let requests = server.finish();
    assert_eq!(requests.len(), 1);
    assert!(requests[0].starts_with("POST /original "));
    assert!(requests[0]
        .to_ascii_lowercase()
        .contains("x-snapshot: before\r\n"));
    assert!(requests[0].ends_with(r#"{"value":"before"}"#));
}

#[test]
fn body_readers_consume_once_and_clones_have_independent_consumption() {
    let server = Server::new(vec![
        reply("200 OK", "", "{\"value\":7}"),
        reply("200 OK", "", "broken JSON"),
        reply("200 OK", "", ""),
        reply("200 OK", "", "<b>synthetic</b>"),
    ]);
    let out = server.eval(r#"
        const reject = async promise => { try { await promise; return 'resolved'; } catch(error) { return error.name; } };
        const response = await fetch(base + '/json');
        const clone = response.clone();
        const initial = response.bodyUsed;
        const pending = response.json();
        const during = response.bodyUsed;
        const repeated = response.text();
        let cloneError;
        try { response.clone(); } catch(error) { cloneError=error.name; }
        const value = await pending;
        const cloneBefore = clone.bodyUsed;
        const cloneText = await clone.text();
        const malformed = await fetch(base + '/invalid');
        const malformedError = await reject(malformed.json());
        const malformedAgain = await reject(malformed.text());
        const empty = await fetch(base + '/empty');
        await empty.text();
        const emptyAgain = await reject(empty.arrayBuffer());
        const html = await fetch(base + '/dom');
        const dom = html.dom();
        const domUsed = html.bodyUsed;
        const content = (await dom).querySelector('b').textContent;
        return {initial,during,promise:pending instanceof Promise,repeatedPromise:repeated instanceof Promise,
            repeated:await reject(repeated),cloneError,value,cloneBefore,cloneText,cloneAfter:clone.bodyUsed,
            malformedError,malformedAgain,malformedUsed:malformed.bodyUsed,emptyAgain,emptyUsed:empty.bodyUsed,
            domPromise:dom instanceof Promise,domUsed,content,domAgain:await reject(html.text())};
    "#);
    assert_eq!(
        out,
        json!({
            "initial":false,"during":true,"promise":true,"repeatedPromise":true,
            "repeated":"TypeError","cloneError":"TypeError","value":{"value":7},
            "cloneBefore":false,"cloneText":"{\"value\":7}","cloneAfter":true,
            "malformedError":"SyntaxError","malformedAgain":"TypeError","malformedUsed":true,
            "emptyAgain":"TypeError","emptyUsed":true,"domPromise":true,"domUsed":true,
            "content":"synthetic","domAgain":"TypeError"
        })
    );
    assert_eq!(server.finish().len(), 4);
}

#[test]
fn null_response_bodies_allow_repeated_reads_without_becoming_used() {
    let server = Server::new(vec![
        reply("200 OK", "", ""),
        reply("204 No Content", "", ""),
        reply("205 Reset Content", "", ""),
        reply("304 Not Modified", "", ""),
    ]);
    let out = server.eval(
        r#"
        const results = [];
        for (const method of ['head','GET','GET','GET']) {
            const response = await fetch(base + '/null', {method});
            const text = await response.text();
            const bytes = await response.arrayBuffer();
            let jsonError;
            try { await response.json(); } catch(error) { jsonError=error.name; }
            results.push({text,bytes:bytes.byteLength,jsonError,used:response.bodyUsed,
                cloneUsed:response.clone().bodyUsed});
        }
        return results;
    "#,
    );
    let expected =
        json!({"text":"","bytes":0,"jsonError":"SyntaxError","used":false,"cloneUsed":false});
    assert_eq!(out, json!([expected, expected, expected, expected]));
    let requests = server.finish();
    assert_eq!(requests.len(), 4);
    assert!(requests[0].starts_with("HEAD /null "));
}

#[test]
fn truncated_body_rejects_reader_after_fetch_resolves_headers() {
    let server = Server::new(vec![
        "HTTP/1.1 200 OK\r\nContent-Length: 5\r\nConnection: close\r\n\r\nab".into(),
    ]);
    let out = server.eval(
        r#"
        const response = await fetch(base + '/truncated');
        let error;
        try { await response.text(); } catch(failure) { error=failure.name; }
        return {status:response.status,used:response.bodyUsed,error};
    "#,
    );
    assert_eq!(out, json!({"status":200,"used":true,"error":"TypeError"}));
    assert_eq!(server.finish().len(), 1);
}

#[test]
fn fetch_and_microtasks_run_before_body_arrives() {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let authority = listener.local_addr().unwrap().to_string();
    listener.set_nonblocking(true).unwrap();
    let (release, body_allowed) = std::sync::mpsc::channel();
    let worker = thread::spawn(move || {
        let deadline = Instant::now() + Duration::from_secs(3);
        let mut stream = loop {
            match listener.accept() {
                Ok((stream, _)) => break stream,
                Err(error)
                    if error.kind() == std::io::ErrorKind::WouldBlock
                        && Instant::now() < deadline =>
                {
                    thread::sleep(Duration::from_millis(2))
                }
                error => panic!("missing request: {error:?}"),
            }
        };
        stream
            .set_read_timeout(Some(Duration::from_secs(2)))
            .unwrap();
        stream
            .set_write_timeout(Some(Duration::from_secs(2)))
            .unwrap();
        read_request_head(&mut stream);
        stream
            .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 4\r\nConnection: close\r\n\r\n")
            .unwrap();
        let released = body_allowed.recv_timeout(Duration::from_secs(2)).is_ok();
        let _ = stream.write_all(b"body");
        released
    });
    let rt = runtime();
    load_package(&rt, json!({"domain":authority})).unwrap();
    rt.vm.context().with(|ctx| {
        ctx.globals()
            .set(
                "releaseBody",
                rquickjs::Function::new(ctx.clone(), move || {
                    let _ = release.send(());
                })
                .unwrap(),
            )
            .unwrap();
    });
    let out = result(
        &rt,
        &format!(
            r#"(async () => {{
        const order=[];
        const pending=fetch('http://{authority}/gated');
        order.push('after-call');
        Promise.resolve().then(() => order.push('microtask'));
        const response=await pending;
        order.push('headers');
        const body=response.text();
        const used=response.bodyUsed;
        releaseBody();
        return {{order,promise:pending instanceof Promise,bodyPromise:body instanceof Promise,used,text:await body}};
    }})()"#
        ),
    );
    assert!(
        worker.join().unwrap(),
        "fetch must resolve headers before the server sends its body"
    );
    assert_eq!(
        out,
        json!({"order":["after-call","microtask","headers"],"promise":true,"bodyPromise":true,"used":true,"text":"body"})
    );
}

#[test]
fn parallel_fetches_start_before_other_responses_complete() {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let authority = listener.local_addr().unwrap().to_string();
    listener.set_nonblocking(true).unwrap();
    let worker = thread::spawn(move || {
        let deadline = Instant::now() + Duration::from_secs(3);
        let mut streams = Vec::new();
        while streams.len() < 2 && Instant::now() < deadline {
            match listener.accept() {
                Ok((mut stream, _)) => {
                    stream
                        .set_read_timeout(Some(Duration::from_secs(1)))
                        .unwrap();
                    stream
                        .set_write_timeout(Some(Duration::from_secs(1)))
                        .unwrap();
                    let request = read_request_head(&mut stream);
                    let body = if request.starts_with("GET /one ") {
                        "one"
                    } else {
                        "two"
                    };
                    streams.push((stream, body));
                }
                Err(error) if error.kind() == std::io::ErrorKind::WouldBlock => {
                    thread::sleep(Duration::from_millis(2))
                }
                error => panic!("accept: {error:?}"),
            }
        }
        let count = streams.len();
        for (mut stream, body) in streams {
            let _ = stream.write_all(reply("200 OK", "", body).as_bytes());
        }
        count
    });
    let rt = runtime();
    load_package(&rt, json!({"domain":authority})).unwrap();
    rt.set_timeout(5000).unwrap();
    let out = result(
        &rt,
        &format!(
            r#"Promise.all(['/one','/two'].map(path =>
        fetch('http://{authority}'+path).then(response => response.text())))"#
        ),
    );
    assert_eq!(worker.join().unwrap(), 2);
    assert_eq!(out, json!(["one", "two"]));
}

#[test]
fn dropping_runtime_cancels_pending_fetch_without_waiting_for_network_timeout() {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let authority = listener.local_addr().unwrap().to_string();
    listener.set_nonblocking(true).unwrap();
    let (connected, ready) = std::sync::mpsc::channel();
    let worker = thread::spawn(move || {
        let deadline = Instant::now() + Duration::from_secs(3);
        let mut stream = loop {
            match listener.accept() {
                Ok((stream, _)) => break stream,
                Err(error)
                    if error.kind() == std::io::ErrorKind::WouldBlock
                        && Instant::now() < deadline =>
                {
                    thread::sleep(Duration::from_millis(2))
                }
                error => panic!("missing request: {error:?}"),
            }
        };
        stream
            .set_read_timeout(Some(Duration::from_secs(2)))
            .unwrap();
        read_request_head(&mut stream);
        connected.send(()).unwrap();
        match stream.read(&mut [0; 1]) {
            Ok(0) => true,
            Err(error) => error.kind() == std::io::ErrorKind::ConnectionReset,
            _ => false,
        }
    });
    let rt = runtime();
    load_package(&rt, json!({"domain":authority})).unwrap();
    rt.set_timeout(30_000).unwrap();
    rt.vm.context().with(|ctx| {
        ctx.eval::<(), _>(format!(
            "void fetch('http://{authority}/pending').catch(() => {{}})"
        ))
        .unwrap();
    });
    ready.recv_timeout(Duration::from_secs(3)).unwrap();
    let start = Instant::now();
    drop(rt);
    assert!(start.elapsed() < Duration::from_secs(1));
    assert!(
        worker.join().unwrap(),
        "dropping the runtime should close the pending network request"
    );
}

#[test]
fn cancelling_after_headers_rejects_the_pending_body_reader() {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let authority = listener.local_addr().unwrap().to_string();
    listener.set_nonblocking(true).unwrap();
    let worker = thread::spawn(move || {
        let deadline = Instant::now() + Duration::from_secs(3);
        let mut stream = loop {
            match listener.accept() {
                Ok((stream, _)) => break stream,
                Err(error)
                    if error.kind() == std::io::ErrorKind::WouldBlock
                        && Instant::now() < deadline =>
                {
                    thread::sleep(Duration::from_millis(2))
                }
                error => panic!("missing request: {error:?}"),
            }
        };
        stream
            .set_read_timeout(Some(Duration::from_secs(2)))
            .unwrap();
        stream
            .set_write_timeout(Some(Duration::from_secs(2)))
            .unwrap();
        read_request_head(&mut stream);
        stream
            .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 4\r\nConnection: close\r\n\r\n")
            .unwrap();
        let _ = stream.read(&mut [0; 1]);
    });
    let rt = runtime();
    load_package(&rt, json!({"domain":authority})).unwrap();
    let cancellation = crate::FetchCancellation::default();
    rt.set_fetch_cancellation(cancellation.clone());
    rt.vm.context().with(|ctx| {
        ctx.globals()
            .set(
                "cancelFetch",
                rquickjs::Function::new(ctx.clone(), move || cancellation.cancel()).unwrap(),
            )
            .unwrap();
    });
    let out = result(
        &rt,
        &format!(
            r#"(async () => {{
        const response=await fetch('http://{authority}/body');
        const pending=response.text();
        cancelFetch();
        let error;
        try {{ await pending; }} catch(failure) {{ error=failure.name; }}
        return {{status:response.status,used:response.bodyUsed,error}};
    }})()"#
        ),
    );
    worker.join().unwrap();
    assert_eq!(out, json!({"status":200,"used":true,"error":"AbortError"}));
}
