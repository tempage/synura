use serde_json::Value;
use std::fs;
use std::io::{Read, Write};
use std::net::TcpListener;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};
use std::thread::{self, JoinHandle};
use std::time::Duration;

struct Server {
    authority: String,
    requests: Arc<Mutex<Vec<String>>>,
    stop: Arc<AtomicBool>,
    worker: Option<JoinHandle<()>>,
}

impl Server {
    fn new(body: &'static str) -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let authority = listener.local_addr().unwrap().to_string();
        listener.set_nonblocking(true).unwrap();
        let requests = Arc::new(Mutex::new(Vec::new()));
        let stop = Arc::new(AtomicBool::new(false));
        let captured = requests.clone();
        let stopped = stop.clone();
        let worker = thread::spawn(move || {
            while !stopped.load(Ordering::Relaxed) {
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
                let mut request = Vec::new();
                let mut buffer = [0; 1024];
                while !request.windows(4).any(|part| part == b"\r\n\r\n") {
                    match stream.read(&mut buffer) {
                        Ok(0) | Err(_) => break,
                        Ok(count) => request.extend_from_slice(&buffer[..count]),
                    }
                    assert!(request.len() < 32 * 1024);
                }
                let line = String::from_utf8_lossy(&request)
                    .lines()
                    .next()
                    .unwrap_or_default()
                    .to_string();
                // Capture HTTPS proxy selection without opening a TLS connection.
                let status = if line.starts_with("CONNECT ") {
                    "502 Bad Gateway"
                } else {
                    "200 OK"
                };
                captured.lock().unwrap().push(line);
                let response = format!(
                    "HTTP/1.1 {status}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
                    body.len()
                );
                let _ = stream.write_all(response.as_bytes());
            }
        });
        Self {
            authority,
            requests,
            stop,
            worker: Some(worker),
        }
    }

    fn url(&self) -> String {
        format!("http://{}", self.authority)
    }

    fn requests(&self) -> Vec<String> {
        self.requests.lock().unwrap().clone()
    }
}

impl Drop for Server {
    fn drop(&mut self) {
        self.stop.store(true, Ordering::Relaxed);
        self.worker.take().unwrap().join().unwrap();
    }
}

struct Cli {
    directory: PathBuf,
}

impl Cli {
    fn new() -> Self {
        static NEXT: AtomicUsize = AtomicUsize::new(0);
        let directory = std::env::temp_dir().join(format!(
            "synurart-proxy-test-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir(&directory).unwrap();
        Self { directory }
    }

    fn run(&self, env: &[(&str, &str)], args: &[&str], input: &str) -> Vec<Value> {
        let mut command = Command::new(env!("CARGO_BIN_EXE_synurart"));
        command.current_dir(&self.directory).arg("-json").args(args);
        // Keep proxy environment changes inside each child, avoiding test-thread races.
        for key in [
            "HTTP_PROXY",
            "HTTPS_PROXY",
            "ALL_PROXY",
            "NO_PROXY",
            "http_proxy",
            "https_proxy",
            "all_proxy",
            "no_proxy",
            "REQUEST_METHOD",
        ] {
            command.env_remove(key);
        }
        command.envs(env.iter().copied());
        let mut child = command
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .unwrap();
        child
            .stdin
            .take()
            .unwrap()
            .write_all(input.as_bytes())
            .unwrap();
        let output = child.wait_with_output().unwrap();
        assert!(
            output.status.success(),
            "{}",
            String::from_utf8_lossy(&output.stderr)
        );
        let records: Vec<Value> = String::from_utf8(output.stdout)
            .unwrap()
            .lines()
            .map(|line| serde_json::from_str(line).unwrap())
            .collect();
        assert!(records.iter().all(|v| v["type"] != "error"), "{records:?}");
        records
    }

    fn extension(&self, authority: &str) {
        fs::write(
            self.directory.join("fixture.js"),
            format!("globalThis.SYNURA = {{domain: {authority:?}}};"),
        )
        .unwrap();
    }
}

impl Drop for Cli {
    fn drop(&mut self) {
        fs::remove_dir_all(&self.directory).unwrap();
    }
}

fn fetch(authority: &str) -> String {
    format!("eval 'globalThis.SYNURA = {{domain: {authority:?}}}; fetch(\"http://{authority}/check\").text()'\n")
}

fn results(records: &[Value]) -> Vec<&str> {
    records
        .iter()
        .filter(|v| v["type"] == "eval")
        .map(|v| v["result"].as_str().unwrap())
        .collect()
}

#[test]
fn system_proxy_honors_no_proxy_in_both_environment_forms() {
    let origin = Server::new("direct");
    let proxy = Server::new("proxy");
    let cli = Cli::new();
    for (http, https, no) in [
        ("HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY"),
        ("http_proxy", "https_proxy", "no_proxy"),
    ] {
        let records = cli.run(
            &[
                (http, &proxy.url()),
                (https, &proxy.url()),
                (no, "127.0.0.1"),
            ],
            &[],
            &format!("proxy\n{}", fetch(&origin.authority)),
        );
        assert_eq!(records[0]["mode"], "system");
        assert_eq!(results(&records), ["direct"]);
    }
    assert_eq!(origin.requests().len(), 2);
    assert!(proxy.requests().is_empty());
}

#[test]
fn system_proxy_selects_each_protocol_independently() {
    let http = Server::new("http proxy");
    let https = Server::new("https proxy");
    let records = Cli::new().run(
        &[("HTTP_PROXY", &http.url()), ("HTTPS_PROXY", &https.url())], &[],
        &format!("{}eval 'try {{ fetch(\"https://service.example.test/check\") }} catch (e) {{ e.name }}'\n", fetch("service.example.test")),
    );
    assert_eq!(results(&records), ["http proxy", "Error"]);
    assert_eq!(http.requests().len(), 1);
    assert!(http.requests()[0].starts_with("GET http://service.example.test/check "));
    assert_eq!(https.requests().len(), 1);
    assert!(https.requests()[0].starts_with("CONNECT service.example.test:443 "));
}

#[test]
fn clear_disables_environment_proxy_and_modes_survive_reload() {
    let origin = Server::new("direct");
    let system = Server::new("system proxy");
    let explicit = Server::new("explicit proxy");
    let cli = Cli::new();
    cli.extension(&origin.authority);
    let request = fetch(&origin.authority);
    let records = cli.run(&[("HTTP_PROXY", &system.url())], &[], &format!(
        "proxy\n{request}proxy clear\n{request}load fixture.js --no-home\nproxy\n{request}proxy system\n{request}proxy {}\n{request}load fixture.js --no-home\nproxy\n{request}",
        explicit.url()
    ));
    assert_eq!(
        results(&records),
        [
            "system proxy",
            "direct",
            "direct",
            "system proxy",
            "explicit proxy",
            "explicit proxy"
        ]
    );
    let modes: Vec<_> = records
        .iter()
        .filter(|v| v["type"] == "proxy")
        .map(|v| v["mode"].as_str().unwrap())
        .collect();
    assert_eq!(
        modes,
        ["system", "disabled", "disabled", "system", "explicit", "explicit"]
    );
    assert_eq!(origin.requests().len(), 2);
    assert_eq!(system.requests().len(), 2);
    assert_eq!(explicit.requests().len(), 2);
}

#[test]
fn command_line_off_overrides_environment_and_explicit_url_overrides_exclusions() {
    let origin = Server::new("direct");
    let proxy = Server::new("proxy");
    let cli = Cli::new();
    let request = format!("proxy\n{}", fetch(&origin.authority));
    let records = cli.run(&[("HTTP_PROXY", &proxy.url())], &["--proxy=off"], &request);
    assert_eq!(records[0]["mode"], "disabled");
    assert_eq!(results(&records), ["direct"]);
    let records = cli.run(&[("NO_PROXY", "*")], &["-proxy", &proxy.url()], &request);
    assert_eq!(records[0]["mode"], "explicit");
    assert_eq!(results(&records), ["proxy"]);
    assert_eq!(origin.requests().len(), 1);
    assert_eq!(proxy.requests().len(), 1);
}
