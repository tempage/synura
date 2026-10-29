use crate::tests::{result, runtime};
use serde_json::{json, Value};
use std::io::{Read, Write};
use std::net::TcpListener;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::thread::{self, JoinHandle};
use std::time::{Duration, Instant};

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
        let rt = runtime();
        rt.set_timeout(1500).unwrap();
        result(&rt, &format!(
            "(() => {{ globalThis.SYNURA = {{domain: {domain:?}}}; const base = {base:?}; {script} }})()",
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

#[test]
fn pooled_connections_notice_server_close_between_fetch_calls() {
    let response = b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: keep-alive\r\n\r\nok";
    let server = Server::delayed_close(vec![response.to_vec(); 3], Duration::from_millis(30));
    let rt = runtime();
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
                    "fetch({:?}).text()",
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
        const response = fetch(base + "/headers");
        function failure(fn) { try { fn(); return "unexpected"; } catch(e) { return e.name; } }
        return { status: response.status, statusText: response.statusText, body: response.text(),
            cookies: response.headers.getAll("SET-Cookie"), cookie: response.headers.get("set-cookie"),
            flat: response.headers["set-cookie"], example: response.headers.get("X-EXAMPLE"),
            missing: response.headers.get("missing") === undefined, missingAll: response.headers.getAll("missing"),
            required: [failure(() => response.headers.get()), failure(() => response.headers.getAll())],
            entries: response.headers.entries().filter(pair => pair[0].toLowerCase() === "set-cookie") };
    "#);
    assert_eq!(out["status"], 200);
    assert_eq!(out["statusText"], "200 OK");
    assert_eq!(out["body"], "body");
    assert_eq!(out["cookies"], json!(cookies));
    assert_eq!(out["cookie"], cookies.join("\n"));
    assert_eq!(out["flat"], cookies.join("\n"));
    assert_eq!(out["example"], "first, second");
    assert_eq!(out["missing"], true);
    assert_eq!(out["missingAll"], json!([]));
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
        const first = fetch(base + "/start/page");
        const second = fetch(base + "/fresh");
        const explicit = fetch(base + "/start/page", {headers: {Cookie: "chosen=manual"}});
        return {status: first.status, url: first.url, body: first.text(), second: second.status, explicit: explicit.status};
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
    let out = server.eval(
        r#"
        SYNURA.host_permissions = [base + "/allowed/*"];
        try { fetch(base + "/allowed/start"); return {}; }
        catch (error) { return {name: error.name, error: error.message}; }
    "#,
    );
    assert_eq!(out["name"], "Error");
    assert!(out["error"].as_str().unwrap().contains("not allowed"));
    assert_eq!(server.finish().len(), 1);
}

#[test]
fn redirect_loops_stop_after_ten_requests() {
    let server = Server::new(vec![reply("302 Found", "Location: /loop\r\n", ""); 10]);
    let out = server.eval(
        r#"
        try { fetch(base + "/loop"); return {}; }
        catch (error) { return {name: error.name, error: error.message}; }
    "#,
    );
    assert_eq!(out["name"], "Error");
    assert!(out["error"].as_str().unwrap().contains("10"));
    assert_eq!(server.finish().len(), 10);
}

#[test]
fn fetch_rejects_non_http_schemes_and_ports_outside_explicit_permissions() {
    let server = Server::new(vec![]);
    let out = server.eval(
        r#"
        SYNURA.host_permissions = [base + "/*"];
        function errorFor(url) { try { fetch(url); return "unexpected"; } catch(e) { return e.name + ":" + e.message; } }
        return {scheme: errorFor(base.replace("http:", "ftp:") + "/test"),
            port: errorFor("http://127.0.0.1:1/test")};
    "#,
    );
    assert!(out["scheme"].as_str().unwrap().starts_with("Error:"));
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
        const r = fetch(base + "/legacy");
        const ascii = fetch(base + "/ascii").text();
        const bom = fetch(base + "/bom").text().charCodeAt(0);
        function failure(fn) { try { fn(); return "unexpected"; } catch(e) { return e.name; } }
        const empty204 = failure(() => fetch(base + "/empty204").json());
        const empty200 = failure(() => fetch(base + "/empty200").json());
        const html = fetch(base + "/html");
        return { text:r.text(), bytes:Array.from(new Uint8Array(r.arrayBuffer())), ascii, bom,
            empty204, empty200, mime:failure(() => html.dom("application/xml")),
            html:html.dom("TEXT/HTML").querySelector("b").textContent,
            unknownStatus:fetch(base + "/status").statusText,
            extra:[typeof r.error, typeof r.networkMs, typeof synura.fetch] };
    "#,
    );
    assert_eq!(
        out,
        json!({"text":"a\u{fffd}","bytes":[97,233],"ascii":"hello","bom":65279,
        "empty204":"SyntaxError","empty200":"SyntaxError","mime":"TypeError","html":"hello",
        "unknownStatus":"299","extra":["undefined","undefined","undefined"]})
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
fn request_options_are_validated_and_structured_bodies_are_json() {
    let server = Server::new(vec![reply("200 OK", "", "ok"); 2]);
    let out = server.eval(r#"
        function failure(options) { try { fetch(base, options); return "unexpected"; } catch(e) { return e.name; } }
        const invalid = [failure({headers:null}), failure({headers:{"X-Test":42}}), failure({headers:[]}), failure(undefined)];
        fetch(base + "/object", {method:"POST", body:{z:1,a:{"2":2,"10":10}}});
        fetch(base + "/array", {method:"POST", body:[1,2]});
        return invalid;
    "#);
    assert_eq!(
        out,
        json!(["TypeError", "TypeError", "TypeError", "TypeError"])
    );
    let requests = server.finish();
    assert_eq!(requests.len(), 2);
    assert!(requests[0].ends_with(r#"{"a":{"10":10,"2":2},"z":1}"#));
    assert!(requests[1].ends_with("[1,2]"));
}

#[test]
fn progress_reports_final_bytes_unknown_totals_and_ignores_callback_errors() {
    let server = Server::new(vec![
        reply("302 Found", "Location: /done\r\n", "redirect body"),
        reply("200 OK", "", "hello"),
        "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\nConnection: close\r\n\r\n5\r\nhello\r\n0\r\n\r\n".into(),
        reply("200 OK", "", ""),
    ]);
    let out = server.eval(r#"
        let events = [];
        const first = fetch(base + "/redirect", {onProgress:(current,total) => {events.push([current,total]);throw new Error("ignored");}});
        const second = fetch(base + "/chunked", {onProgress:(current,total) => events.push([current,total])});
        fetch(base + "/empty", {onProgress:(current,total) => events.push([current,total])});
        return {body:first.text() + second.text(), events};
    "#);
    assert_eq!(
        out,
        json!({"body":"hellohello","events":[[5,5],[5,-1],[0,0]]})
    );
    assert_eq!(server.finish().len(), 4);
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
            r#"(() => {{
        SYNURA.domain = "another.example";
        SYNURA.host_permissions = [{base:?} + "/*"];
        SYNURA.bypass = "firefox/linux";
        let error;
        try {{ fetch({base:?} + "/blocked"); }} catch(e) {{ error=e.name; }}
        return {{error, status:fetch({base:?} + "/allowed/page").status}};
    }})()"#
        ),
    );
    assert_eq!(out, json!({"error":"Error","status":200}));
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
                r#"(() => {
            try { fetch("https://example.com/"); return false; }
            catch(e) { return e.name === "Error" && e.message.includes("disabled"); }
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
fn redirect_cookies_follow_session_name_and_expiry_semantics() {
    let server = Server::new(vec![
        reply("302 Found", "Location: /done\r\nSet-Cookie: Token=one; Path=/\r\nSet-Cookie: token=two; Path=/; Max-Age=0\r\n", ""),
        reply("200 OK", "", "ok"),
    ]);
    assert_eq!(server.eval("return fetch(base + '/start').status;"), 200);
    assert_eq!(cookie_header(&server.finish()[1]), Some("token=two"));
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
        r#"(() => {
        let blocked;
        try { fetch("http://other.example.test/"); } catch (e) { blocked=e.name; }
        return {blocked, text:fetch("http://service.example.test/proxy").text()};
    })()"#,
    );
    assert_eq!(out, json!({"blocked":"Error","text":"proxied"}));
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
            r#"(() => {{
        try {{ fetch("http://{authority}/slow"); return "unexpected"; }}
        catch(e) {{ return {{name:e.name, message:e.message}}; }}
    }})()"#
        ),
    );
    let elapsed = start.elapsed();
    let _ = release.send(());
    server.join().unwrap();
    canceller.join().unwrap();
    assert_eq!(out, json!({"name":"Error","message":"context canceled"}));
    assert!(elapsed < Duration::from_secs(3));
    let replacement = crate::FetchCancellation::default();
    rt.set_fetch_cancellation(replacement.clone());
    assert!(!replacement.is_cancelled());
}

#[test]
fn oversized_declared_and_streamed_bodies_throw_without_progress_callbacks() {
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
        let events = 0;
        const errors = ["/declared", "/streamed"].map(path => {
            try { fetch(base + path, {onProgress:()=>events++}); return "unexpected"; }
            catch(e) { return e.name; }
        });
        return {errors, events};
    "#,
    );
    assert_eq!(out, json!({"errors":["Error","Error"],"events":0}));
    assert_eq!(server.finish().len(), 2);
}
