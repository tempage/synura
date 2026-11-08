//! Redirect contracts exercised against synthetic loopback HTTP servers.
use serde::Serialize;
use serde_json::{json, Value};
use std::collections::HashMap;
use std::fs;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::thread::{self, JoinHandle};
use std::time::{Duration, Instant};
use synurart::SynurartRuntime;

#[derive(Clone, Debug, Serialize)]
struct Request {
    method: String,
    path: String,
    headers: HashMap<String, String>,
    body: String,
}

impl Request {
    fn read(stream: &mut TcpStream) -> Self {
        let mut bytes = Vec::new();
        let mut buffer = [0; 1024];
        loop {
            if let Some(end) = bytes.windows(4).position(|part| part == b"\r\n\r\n") {
                let head = std::str::from_utf8(&bytes[..end]).unwrap();
                let mut lines = head.lines();
                let mut first = lines.next().unwrap().split_whitespace();
                let method = first.next().unwrap().to_owned();
                let path = first.next().unwrap().to_owned();
                let headers: HashMap<String, String> = lines
                    .map(|line| {
                        let (name, value) = line.split_once(':').unwrap();
                        (name.to_ascii_lowercase(), value.trim().to_owned())
                    })
                    .collect();
                let length = headers
                    .get("content-length")
                    .map(|value| value.parse::<usize>().unwrap())
                    .unwrap_or(0);
                if bytes.len() >= end + 4 + length {
                    return Self {
                        method,
                        path,
                        headers,
                        body: String::from_utf8(bytes[end + 4..end + 4 + length].to_vec()).unwrap(),
                    };
                }
            }
            let count = stream.read(&mut buffer).unwrap();
            assert!(count > 0, "request ended before its declared body");
            bytes.extend_from_slice(&buffer[..count]);
            assert!(bytes.len() < 32 * 1024, "unexpected request size");
        }
    }
}

#[derive(Clone)]
struct Reply {
    status: u16,
    headers: Vec<(String, String)>,
}

struct Server {
    base: String,
    routes: Arc<Mutex<HashMap<String, Reply>>>,
    requests: Arc<Mutex<Vec<Request>>>,
    stopped: Arc<AtomicBool>,
    worker: Option<JoinHandle<()>>,
}

impl Server {
    fn new() -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let base = format!("http://{}", listener.local_addr().unwrap());
        listener.set_nonblocking(true).unwrap();
        let routes = Arc::new(Mutex::new(HashMap::<String, Reply>::new()));
        let requests = Arc::new(Mutex::new(Vec::new()));
        let stopped = Arc::new(AtomicBool::new(false));
        let worker_routes = routes.clone();
        let worker_requests = requests.clone();
        let stop = stopped.clone();
        let worker = thread::spawn(move || {
            let deadline = Instant::now() + Duration::from_secs(30);
            while !stop.load(Ordering::Relaxed) && Instant::now() < deadline {
                let (mut stream, _) = match listener.accept() {
                    Ok(connection) => connection,
                    Err(error) if error.kind() == std::io::ErrorKind::WouldBlock => {
                        thread::sleep(Duration::from_millis(2));
                        continue;
                    }
                    Err(error) => panic!("accept: {error}"),
                };
                stream
                    .set_read_timeout(Some(Duration::from_secs(2)))
                    .unwrap();
                stream
                    .set_write_timeout(Some(Duration::from_secs(2)))
                    .unwrap();
                let request = Request::read(&mut stream);
                let remaining = request
                    .path
                    .strip_prefix("/chain/")
                    .and_then(|value| value.parse::<usize>().ok());
                let reply = worker_routes
                    .lock()
                    .unwrap()
                    .get(&request.path)
                    .cloned()
                    .or_else(|| {
                        remaining.filter(|value| *value > 0).map(|value| Reply {
                            status: 302,
                            headers: vec![("Location".into(), format!("/chain/{}", value - 1))],
                        })
                    })
                    .unwrap_or(Reply {
                        status: 200,
                        headers: Vec::new(),
                    });
                let body = serde_json::to_string(&request).unwrap();
                let head_only = request.method == "HEAD";
                worker_requests.lock().unwrap().push(request);
                let mut response = format!(
                    "HTTP/1.1 {} Synthetic\r\nContent-Length: {}\r\nConnection: close\r\n",
                    reply.status,
                    body.len()
                );
                for (name, value) in reply.headers {
                    response.push_str(&format!("{name}: {value}\r\n"));
                }
                response.push_str("\r\n");
                if !head_only {
                    response.push_str(&body);
                }
                let _ = stream.write_all(response.as_bytes());
            }
        });
        Self {
            base,
            routes,
            requests,
            stopped,
            worker: Some(worker),
        }
    }

    fn route(&self, path: &str, status: u16, headers: &[(&str, &str)]) {
        self.routes.lock().unwrap().insert(
            path.into(),
            Reply {
                status,
                headers: headers
                    .iter()
                    .map(|(name, value)| ((*name).into(), (*value).into()))
                    .collect(),
            },
        );
    }

    fn requests(&self) -> Vec<Request> {
        self.requests.lock().unwrap().clone()
    }
}

impl Drop for Server {
    fn drop(&mut self) {
        self.stopped.store(true, Ordering::Relaxed);
        if let Some(worker) = self.worker.take() {
            if let Err(error) = worker.join() {
                if !thread::panicking() {
                    std::panic::resume_unwind(error);
                }
            }
        }
    }
}

struct Fixture(PathBuf);

impl Fixture {
    fn new(package: Value) -> Self {
        static NEXT: AtomicU64 = AtomicU64::new(0);
        let directory = std::env::temp_dir().join(format!(
            "synurart-fetch-redirects-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir(&directory).unwrap();
        fs::write(
            directory.join("extension.js"),
            format!("globalThis.SYNURA = {package};"),
        )
        .unwrap();
        Self(directory)
    }

    fn runtime(&self) -> SynurartRuntime {
        let extension = self.0.join("extension.js");
        let runtime =
            SynurartRuntime::new(true, self.0.join("storage.json"), extension.clone()).unwrap();
        runtime.disable_fetch_proxy();
        runtime.set_timeout(2000).unwrap();
        runtime.load_extension(&extension).unwrap();
        runtime
    }
}

impl Drop for Fixture {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.0);
    }
}

fn eval(runtime: &SynurartRuntime, script: &str) -> Value {
    runtime.eval_js(script).unwrap()["result"].clone()
}

#[test]
fn explicit_authentication_survives_same_origin_but_not_an_origin_round_trip() {
    let first = Server::new();
    let second = Server::new();
    first.route("/same", 302, &[("Location", "/echo")]);
    first.route(
        "/cross",
        302,
        &[("Location", &format!("{}/back", second.base))],
    );
    second.route(
        "/back",
        302,
        &[("Location", &format!("{}/returned", first.base))],
    );
    let fixture = Fixture::new(json!({"domain":"127.0.0.1"}));
    let runtime = fixture.runtime();
    let out = eval(
        &runtime,
        &format!(
            r#"(async () => {{
                const base = {base:?};
                const options = {{headers: {{aUtHoRiZaTiOn:'Bearer synthetic', cOoKiE:'chosen=synthetic', 'X-Request-Tag':'test'}}}};
                const same = await (await fetch(base+'/same', options)).json();
                const returned = await (await fetch(base+'/cross', options)).json();
                const explicitAgain = await (await fetch(base+'/fresh', options)).json();
                return {{same, returned, explicitAgain, callerHeaders: options.headers}};
            }})()"#,
            base = first.base
        ),
    );
    for response in [&out["same"], &out["explicitAgain"]] {
        assert_eq!(response["headers"]["authorization"], "Bearer synthetic");
        assert_eq!(response["headers"]["cookie"], "chosen=synthetic");
    }
    assert!(out["returned"]["headers"].get("authorization").is_none());
    assert!(out["returned"]["headers"].get("cookie").is_none());
    assert_eq!(out["returned"]["headers"]["x-request-tag"], "test");
    assert_eq!(out["callerHeaders"]["cOoKiE"], "chosen=synthetic");
    let foreign = second.requests();
    assert_eq!(foreign.len(), 1);
    assert!(!foreign[0].headers.contains_key("authorization"));
    assert!(!foreign[0].headers.contains_key("cookie"));
    assert_eq!(first.requests().len(), 5);
}

#[test]
fn scoped_response_cookies_can_cross_ports_without_carrying_explicit_cookie() {
    let first = Server::new();
    let second = Server::new();
    first.route(
        "/start",
        302,
        &[
            ("Location", &format!("{}/echo", second.base)),
            ("Set-Cookie", "scoped=synthetic; Path=/"),
            ("Set-Cookie", "private=hidden; Path=/private"),
            ("Set-Cookie", "secure=hidden; Secure; Path=/"),
            ("Set-Cookie", "expired=hidden; Max-Age=0; Path=/"),
        ],
    );
    let fixture = Fixture::new(json!({"domain":"127.0.0.1"}));
    let runtime = fixture.runtime();
    let out = eval(
        &runtime,
        &format!(
            r#"(async () => {{
                const redirected = await (await fetch({start:?}, {{headers:{{Cookie:'manual=synthetic'}}}})).json();
                const fresh = await (await fetch({fresh:?})).json();
                return {{redirected, fresh}};
            }})()"#,
            start = format!("{}/start", first.base),
            fresh = format!("{}/fresh", second.base)
        ),
    );
    assert_eq!(out["redirected"]["headers"]["cookie"], "scoped=synthetic");
    assert!(out["fresh"]["headers"].get("cookie").is_none());
    assert_eq!(first.requests()[0].headers["cookie"], "manual=synthetic");
    assert_eq!(second.requests().len(), 2);
}

#[test]
fn redirect_status_controls_method_payload_and_payload_headers() {
    let server = Server::new();
    let cases = [
        (301, "POST", "GET"),
        (302, "POST", "GET"),
        (303, "PUT", "GET"),
        (303, "HEAD", "HEAD"),
        (307, "POST", "POST"),
        (308, "POST", "POST"),
        (301, "PUT", "PUT"),
    ];
    for (index, (status, _, _)) in cases.iter().enumerate() {
        server.route(
            &format!("/start/{index}"),
            *status,
            &[("Location", "/echo")],
        );
    }
    let fixture = Fixture::new(json!({"domain":"127.0.0.1"}));
    let runtime = fixture.runtime();
    eval(
        &runtime,
        &format!(
            r#"(async () => {{
                const cases = {cases};
                for (let i=0; i<cases.length; i++) {{
                    const method = cases[i][1];
                    const headers = {{'cOnTeNt-TyPe':'text/plain', 'Content-Language':'en', 'Content-Encoding':'identity', 'Content-Location':'/payload', 'X-Request-Tag':'test'}};
                    if (method!=='HEAD') headers['Content-Length']='7';
                    const response = await fetch({base:?}+'/start/'+i, {{method, headers, body:method==='HEAD'?undefined:'payload', redirect:'follow'}});
                    await response.text();
                }}
                return true;
            }})()"#,
            cases = json!(cases),
            base = server.base
        ),
    );
    let requests = server.requests();
    assert_eq!(requests.len(), cases.len() * 2);
    for (index, (status, original, expected)) in cases.iter().enumerate() {
        let initial = &requests[index * 2];
        let redirected = &requests[index * 2 + 1];
        assert_eq!(initial.method, *original);
        assert_eq!(
            redirected.method, *expected,
            "status {status}, method {original}"
        );
        assert_eq!(redirected.headers["x-request-tag"], "test");
        if expected == &"GET" {
            assert!(redirected.body.is_empty());
            for name in [
                "content-type",
                "content-language",
                "content-encoding",
                "content-location",
                "content-length",
                "transfer-encoding",
            ] {
                assert!(
                    !redirected.headers.contains_key(name),
                    "unexpected {name}: {redirected:?}"
                );
            }
        } else {
            assert_eq!(redirected.body, initial.body);
            for name in [
                "content-type",
                "content-language",
                "content-encoding",
                "content-location",
            ] {
                assert_eq!(redirected.headers.get(name), initial.headers.get(name));
            }
        }
    }
}

#[test]
fn error_mode_stops_redirects_and_unsupported_modes_fail_before_network() {
    let server = Server::new();
    for status in [301, 302, 303, 307, 308] {
        server.route(
            &format!("/redirect/{status}"),
            status,
            &[("Location", "/unwanted")],
        );
    }
    server.route("/no-location", 302, &[]);
    let fixture = Fixture::new(json!({"domain":"127.0.0.1"}));
    let runtime = fixture.runtime();
    let out = eval(
        &runtime,
        &format!(
            r#"(async () => {{
                const base={base:?};
                async function failure(path, redirect) {{
                    const promise=fetch(base+path, {{redirect}});
                    try {{await promise;return 'unexpected';}} catch(error) {{return [promise instanceof Promise,error.name];}}
                }}
                const errors=[];
                for(const status of [301,302,303,307,308]) errors.push(await failure('/redirect/'+status,'error'));
                errors.push(await failure('/no-location','error'));
                const unsupported=[];
                for(const mode of ['manual','invalid',null,42]) unsupported.push(await failure('/unwanted',mode));
                const allowed=await fetch(base+'/ok',{{redirect:'error'}});
                const noLocation=await fetch(base+'/no-location');
                return {{errors,unsupported,allowed:allowed.status,noLocation:[noLocation.status,noLocation.redirected]}};
            }})()"#,
            base = server.base
        ),
    );
    assert_eq!(out["errors"], json!(vec![json!([true, "TypeError"]); 6]));
    assert_eq!(
        out["unsupported"],
        json!([
            [true, "NotSupportedError"],
            [true, "TypeError"],
            [true, "TypeError"],
            [true, "TypeError"]
        ])
    );
    assert_eq!(out["allowed"], 200);
    assert_eq!(out["noLocation"], json!([302, false]));
    let requests = server.requests();
    assert_eq!(requests.len(), 8);
    assert!(requests.iter().all(|request| request.path != "/unwanted"));
}

#[test]
fn twenty_redirects_succeed_and_an_additional_redirect_is_rejected() {
    let server = Server::new();
    let fixture = Fixture::new(json!({"domain":"127.0.0.1"}));
    let runtime = fixture.runtime();
    let out = eval(
        &runtime,
        &format!(
            r#"(async () => {{
                const first=await fetch({base:?}+'/chain/20');
                const completed={{status:first.status,redirected:first.redirected,path:(await first.json()).path}};
                try {{await fetch({base:?}+'/chain/21');return {{completed,failure:'unexpected'}};}}
                catch(error) {{return {{completed,failure:error.name}};}}
            }})()"#,
            base = server.base
        ),
    );
    assert_eq!(
        out,
        json!({"completed":{"status":200,"redirected":true,"path":"/chain/0"},"failure":"TypeError"})
    );
    let requests = server.requests();
    assert_eq!(requests.len(), 42);
    assert_eq!(requests[20].path, "/chain/0");
    assert_eq!(requests[41].path, "/chain/1");
}

#[test]
fn redirected_target_is_checked_against_network_permissions_before_connecting() {
    let server = Server::new();
    server.route("/allowed/start", 302, &[("Location", "/blocked")]);
    let authority = server.base.strip_prefix("http://").unwrap();
    let fixture = Fixture::new(
        json!({"domain":authority,"host_permissions":[format!("{}/allowed/*",server.base)]}),
    );
    let runtime = fixture.runtime();
    let result = eval(
        &runtime,
        &format!(
            r#"fetch({url:?}).then(()=>'unexpected',error=>error.name)"#,
            url = format!("{}/allowed/start", server.base)
        ),
    );
    assert_eq!(result, "TypeError");
    assert_eq!(server.requests().len(), 1);
}
