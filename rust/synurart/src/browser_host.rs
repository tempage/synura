use std::fs;
use std::io::{Read, Write};
use std::net::TcpStream;
use std::path::{Path, PathBuf};
use std::process::{Child, Command};
use std::thread::sleep;
use std::time::{Duration, Instant};

use base64::{engine::general_purpose, Engine as _};
use url::Url;

use super::fetch_scope::FetchScope;

pub struct ActiveBrowser {
    pub view_id: i64,
    pub port: u16,
    pub ws_path: String,
    pub profile_dir: PathBuf,
    pub child: Child,
    pub initial_url: String,
}

pub fn profile_directory(
    storage_dir: &Path,
    namespace: &Path,
    url: &str,
) -> Result<PathBuf, String> {
    let url = Url::parse(url).map_err(|e| format!("invalid browser URL: {e}"))?;
    if !matches!(url.scheme(), "http" | "https") && url.as_str() != "about:blank" {
        return Err("browser URL must use http or https, or be about:blank".into());
    }
    let mut directory = storage_dir.join("browser_profiles");
    // Encode rather than hash so different extensions/origins cannot collide.
    // Split long keys into components to stay below filesystem name limits.
    for (prefix, bytes) in [
        ("ext", namespace.as_os_str().as_encoded_bytes()),
        ("origin", url.origin().ascii_serialization().as_bytes()),
    ] {
        directory.push(prefix);
        let encoded = general_purpose::URL_SAFE_NO_PAD.encode(bytes);
        for chunk in encoded.as_bytes().chunks(120) {
            directory.push(format!("key-{}", std::str::from_utf8(chunk).unwrap()));
        }
    }
    Ok(directory)
}

pub fn find_chrome_binary() -> Option<PathBuf> {
    if let Ok(path_str) = std::env::var("CHROME_BIN") {
        let p = PathBuf::from(path_str);
        if p.exists() {
            return Some(p);
        }
    }

    #[cfg(target_os = "windows")]
    {
        let candidates = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        ];
        for c in candidates {
            let p = PathBuf::from(c);
            if p.exists() {
                return Some(p);
            }
        }
        if let Ok(local) = std::env::var("LOCALAPPDATA") {
            let p = PathBuf::from(&local).join(r"Google\Chrome\Application\chrome.exe");
            if p.exists() {
                return Some(p);
            }
            let p_edge = PathBuf::from(&local).join(r"Microsoft\Edge\Application\msedge.exe");
            if p_edge.exists() {
                return Some(p_edge);
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        let candidates = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        ];
        for c in candidates {
            let p = PathBuf::from(c);
            if p.exists() {
                return Some(p);
            }
        }
    }

    #[cfg(target_os = "linux")]
    {
        let candidates = [
            "google-chrome-stable",
            "google-chrome",
            "chromium",
            "chromium-browser",
            "microsoft-edge-stable",
            "microsoft-edge",
        ];
        for c in candidates {
            if let Ok(p) = which_linux(c) {
                return Some(p);
            }
        }
    }

    None
}

#[cfg(target_os = "linux")]
fn which_linux(binary: &str) -> Result<PathBuf, ()> {
    let path_env = std::env::var("PATH").map_err(|_| ())?;
    for dir in path_env.split(':') {
        let full = Path::new(dir).join(binary);
        if full.is_file() {
            return Ok(full);
        }
    }
    Err(())
}

pub fn launch_browser(
    view_id: i64,
    url: &str,
    profile_dir: &Path,
) -> Result<ActiveBrowser, String> {
    let binary = find_chrome_binary().ok_or_else(|| {
        "could not locate Chrome/Chromium/Edge binary. Please install Google Chrome or set CHROME_BIN environment variable.".to_string()
    })?;

    fs::create_dir_all(profile_dir).map_err(|e| format!("create profile dir: {e}"))?;
    let port_file = profile_dir.join("DevToolsActivePort");
    let _ = fs::remove_file(&port_file);

    let child = Command::new(&binary)
        .arg("--remote-debugging-port=0")
        .arg(format!("--user-data-dir={}", profile_dir.display()))
        .arg(format!("--app={url}"))
        .arg("--no-first-run")
        .arg("--no-default-browser-check")
        .spawn()
        .map_err(|e| format!("launch browser ({}): {e}", binary.display()))?;

    let start = Instant::now();
    let mut port_info: Option<(u16, String)> = None;
    while start.elapsed() < Duration::from_secs(7) {
        if let Ok(content) = fs::read_to_string(&port_file) {
            let lines: Vec<&str> = content.lines().collect();
            if lines.len() >= 2 {
                if let Ok(port) = lines[0].trim().parse::<u16>() {
                    let ws_path = lines[1].trim().to_string();
                    port_info = Some((port, ws_path));
                    break;
                }
            }
        }
        sleep(Duration::from_millis(100));
    }

    let (port, ws_path) = port_info
        .ok_or_else(|| "timed out waiting for Chrome DevTools active port file".to_string())?;

    Ok(ActiveBrowser {
        view_id,
        port,
        ws_path,
        profile_dir: profile_dir.to_path_buf(),
        child,
        initial_url: url.to_string(),
    })
}

fn generate_ws_key() -> String {
    let mut nonce = [0u8; 16];
    #[cfg(unix)]
    {
        if let Ok(mut f) = fs::File::open("/dev/urandom") {
            if f.read_exact(&mut nonce).is_ok() {
                return general_purpose::STANDARD.encode(nonce);
            }
        }
    }
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::SystemTime::UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let pid = std::process::id();
    let addr = &nonce as *const _ as usize;
    let mut state = (nanos as u64) ^ ((pid as u64) << 32) ^ (addr as u64);
    for chunk in nonce.chunks_exact_mut(8) {
        state ^= state >> 12;
        state ^= state << 25;
        state ^= state >> 27;
        let val = state.wrapping_mul(0x2545F4914F6CDD1D);
        chunk.copy_from_slice(&val.to_ne_bytes());
    }
    general_purpose::STANDARD.encode(nonce)
}

pub(super) fn capture_cookies_and_url(
    browser: &mut ActiveBrowser,
    scope: &FetchScope,
) -> Result<(String, String), String> {
    capture_from_devtools(browser.port, &browser.ws_path, scope)
}

fn capture_from_devtools(
    port: u16,
    ws_path: &str,
    scope: &FetchScope,
) -> Result<(String, String), String> {
    // Do not fall back to the launch URL: a login popup or navigation may now
    // point at another origin. The extension's scope is bound at load time.
    let current_url = fetch_current_page_url(port)?;
    let target = Url::parse(&current_url).map_err(|e| format!("invalid browser page URL: {e}"))?;
    scope
        .check(&target)
        .map_err(|e| format!("cookie capture denied: {e}"))?;

    let mut ws_stream = TcpStream::connect(("127.0.0.1", port))
        .map_err(|e| format!("connect to DevTools WebSocket port {port}: {e}"))?;
    ws_stream
        .set_read_timeout(Some(Duration::from_secs(5)))
        .map_err(|e| format!("set timeout: {e}"))?;

    let ws_path = if ws_path.starts_with('/') {
        ws_path.to_string()
    } else {
        format!("/{ws_path}")
    };
    let ws_key = generate_ws_key();
    let handshake = format!(
        "GET {} HTTP/1.1\r\nHost: 127.0.0.1:{}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {}\r\nSec-WebSocket-Version: 13\r\n\r\n",
        ws_path, port, ws_key
    );
    ws_stream
        .write_all(handshake.as_bytes())
        .map_err(|e| format!("send ws handshake: {e}"))?;

    let mut header_buf = Vec::new();
    while !header_buf.ends_with(b"\r\n\r\n") {
        let mut byte = [0u8; 1];
        ws_stream
            .read_exact(&mut byte)
            .map_err(|e| format!("read ws handshake response: {e}"))?;
        header_buf.push(byte[0]);
        if header_buf.len() > 16384 {
            return Err("DevTools WebSocket handshake headers too large".into());
        }
    }
    let resp_str = String::from_utf8_lossy(&header_buf);
    if resp_str
        .lines()
        .next()
        .and_then(|line| line.split_whitespace().nth(1))
        != Some("101")
    {
        return Err(format!("invalid ws handshake response: {resp_str}"));
    }

    let cmd = r#"{"id":1,"method":"Storage.getCookies"}"#;
    send_ws_text_frame(&mut ws_stream, cmd).map_err(|e| format!("send cdp command: {e}"))?;

    let res_text =
        read_ws_text_frame(&mut ws_stream).map_err(|e| format!("read cdp response: {e}"))?;

    let v: serde_json::Value =
        serde_json::from_str(&res_text).map_err(|e| format!("parse cdp response JSON: {e}"))?;

    let cookies = v
        .get("result")
        .and_then(|r| r.get("cookies"))
        .and_then(|c| c.as_array())
        .ok_or_else(|| format!("no cookies array in cdp response: {res_text}"))?;

    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|e| format!("read current time: {e}"))?
        .as_secs_f64();
    let cookie_str = cookie_header_for_url(cookies, &target, now);
    Ok((cookie_str, current_url))
}

fn cookie_header_for_url(cookies: &[serde_json::Value], url: &Url, now: f64) -> String {
    let host = url
        .host_str()
        .unwrap_or_default()
        .trim_end_matches('.')
        .to_ascii_lowercase();
    let mut matching = Vec::new();
    for cookie in cookies {
        let (Some(name), Some(value), Some(domain), Some(path)) = (
            cookie.get("name").and_then(|v| v.as_str()),
            cookie.get("value").and_then(|v| v.as_str()),
            cookie.get("domain").and_then(|v| v.as_str()),
            cookie.get("path").and_then(|v| v.as_str()),
        ) else {
            continue;
        };
        // Chromium prefixes Domain cookies with a dot; unprefixed cookies are
        // host-only. Suffix matching must include the label boundary.
        let domain_cookie = domain.starts_with('.');
        let domain = domain
            .trim_start_matches('.')
            .trim_end_matches('.')
            .to_ascii_lowercase();
        let domain_matches =
            host == domain || (domain_cookie && host.ends_with(&format!(".{domain}")));
        let path_matches = path.starts_with('/')
            && (url.path() == path
                || url
                    .path()
                    .strip_prefix(path)
                    .is_some_and(|suffix| path.ends_with('/') || suffix.starts_with('/')));
        let secure = cookie
            .get("secure")
            .and_then(|v| v.as_bool())
            .unwrap_or(false);
        let expired = cookie
            .get("expires")
            .and_then(|v| v.as_f64())
            .is_some_and(|expiry| expiry >= 0.0 && expiry <= now);
        // An unpartitioned Cookie string cannot preserve a partition key.
        let partitioned = cookie.get("partitionKey").is_some_and(|v| !v.is_null())
            || cookie.get("partitionKeyOpaque").and_then(|v| v.as_bool()) == Some(true);
        if !name.is_empty()
            && !domain.is_empty()
            && domain_matches
            && path_matches
            && (!secure || url.scheme() == "https")
            && !expired
            && !partitioned
        {
            matching.push((path.len(), format!("{name}={value}")));
        }
    }
    // Preserve browser header ordering for cookies sharing a name.
    matching.sort_by(|a, b| b.0.cmp(&a.0));
    matching
        .into_iter()
        .map(|(_, value)| value)
        .collect::<Vec<_>>()
        .join("; ")
}

fn fetch_current_page_url(port: u16) -> Result<String, String> {
    if let Ok(mut stream) = TcpStream::connect(("127.0.0.1", port)) {
        let _ = stream.set_read_timeout(Some(Duration::from_millis(800)));
        let req = format!(
            "GET /json/list HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\n\r\n"
        );
        let _ = stream.write_all(req.as_bytes());
        let mut resp = Vec::new();
        let mut buf = [0u8; 4096];
        while let Ok(n) = stream.read(&mut buf) {
            if n == 0 {
                break;
            }
            resp.extend_from_slice(&buf[..n]);
            if let Ok(resp_str) = std::str::from_utf8(&resp) {
                if let Some(body_start) = resp_str.find("\r\n\r\n") {
                    let body = &resp_str[body_start + 4..];
                    if let Ok(items) = serde_json::from_str::<serde_json::Value>(body) {
                        if let Some(arr) = items.as_array() {
                            for item in arr {
                                if item.get("type").and_then(|t| t.as_str()) == Some("page") {
                                    if let Some(u) = item.get("url").and_then(|u| u.as_str()) {
                                        if !u.is_empty() && !u.starts_with("chrome://") {
                                            return Ok(u.to_string());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if resp.len() > 65536 {
                break;
            }
        }
    }
    Err("could not determine the current browser page URL; cookie capture was canceled".into())
}

pub fn close_browser(browser: &mut ActiveBrowser) {
    let _ = browser.child.kill();
    let _ = browser.child.wait();
}

fn send_ws_text_frame(stream: &mut TcpStream, text: &str) -> std::io::Result<()> {
    let payload = text.as_bytes();
    let len = payload.len();
    let mut header = Vec::new();
    header.push(0x81);
    if len <= 125 {
        header.push(0x80 | (len as u8));
    } else if len <= 65535 {
        header.push(0x80 | 126);
        header.extend_from_slice(&(len as u16).to_be_bytes());
    } else {
        header.push(0x80 | 127);
        header.extend_from_slice(&(len as u64).to_be_bytes());
    }
    let mask = [0x41, 0x59, 0x55, 0x52];
    header.extend_from_slice(&mask);
    let mut masked = Vec::with_capacity(len);
    for (i, &b) in payload.iter().enumerate() {
        masked.push(b ^ mask[i % 4]);
    }
    stream.write_all(&header)?;
    stream.write_all(&masked)?;
    stream.flush()?;
    Ok(())
}

fn read_ws_text_frame(stream: &mut TcpStream) -> std::io::Result<String> {
    let mut header = [0u8; 2];
    stream.read_exact(&mut header)?;
    let masked = (header[1] & 0x80) != 0;
    let mut len = (header[1] & 0x7F) as usize;
    if len == 126 {
        let mut ext = [0u8; 2];
        stream.read_exact(&mut ext)?;
        len = u16::from_be_bytes(ext) as usize;
    } else if len == 127 {
        let mut ext = [0u8; 8];
        stream.read_exact(&mut ext)?;
        len = u64::from_be_bytes(ext) as usize;
    }
    let mask = if masked {
        let mut m = [0u8; 4];
        stream.read_exact(&mut m)?;
        Some(m)
    } else {
        None
    };
    let mut payload = vec![0u8; len];
    stream.read_exact(&mut payload)?;
    if let Some(m) = mask {
        for (i, b) in payload.iter_mut().enumerate() {
            *b ^= m[i % 4];
        }
    }
    String::from_utf8(payload).map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    use std::net::TcpListener;
    use std::thread;

    #[test]
    fn profiles_are_isolated_by_extension_and_origin() {
        let root = Path::new("storage");
        let first = profile_directory(
            root,
            Path::new("extensions/a.js"),
            "https://example.com/login",
        )
        .unwrap();
        assert_eq!(
            first,
            profile_directory(
                root,
                Path::new("extensions/a.js"),
                "https://example.com/account"
            )
            .unwrap()
        );
        for (extension, url) in [
            ("extensions/b.js", "https://example.com/login"),
            ("extensions/a.js", "https://other.example/login"),
            ("extensions/a.js", "http://example.com/login"),
            ("extensions/a.js", "https://example.com:8443/login"),
        ] {
            assert_ne!(
                first,
                profile_directory(root, Path::new(extension), url).unwrap()
            );
        }
        assert!(first.starts_with(root.join("browser_profiles")));
        let long =
            profile_directory(root, Path::new(&"a".repeat(500)), "https://example.com").unwrap();
        assert!(long.components().all(|part| part.as_os_str().len() <= 124));
    }

    #[test]
    fn cookie_capture_respects_domain_path_secure_expiry_and_partition() {
        let cookies = json!([
            {"name":"host", "value":"yes", "domain":"forum.example.com", "path":"/", "httpOnly":true},
            {"name":"parent", "value":"yes", "domain":".example.com", "path":"/"},
            {"name":"parentHostOnly", "value":"no", "domain":"example.com", "path":"/"},
            {"name":"sibling", "value":"no", "domain":"login.example.com", "path":"/"},
            {"name":"foreign", "value":"no", "domain":"other.example", "path":"/"},
            {"name":"suffix", "value":"no", "domain":".ample.com", "path":"/"},
            {"name":"narrow", "value":"yes", "domain":"forum.example.com", "path":"/account"},
            {"name":"trailingSlash", "value":"yes", "domain":"forum.example.com", "path":"/account/"},
            {"name":"wrongPath", "value":"no", "domain":"forum.example.com", "path":"/accounts"},
            {"name":"prefix", "value":"no", "domain":"forum.example.com", "path":"/acc"},
            {"name":"secure", "value":"yes", "domain":"forum.example.com", "path":"/", "secure":true},
            {"name":"expired", "value":"no", "domain":"forum.example.com", "path":"/", "expires":100},
            {"name":"epoch", "value":"no", "domain":"forum.example.com", "path":"/", "expires":0},
            {"name":"future", "value":"yes", "domain":"forum.example.com", "path":"/", "expires":201},
            {"name":"session", "value":"yes", "domain":"forum.example.com", "path":"/", "expires":-1},
            {"name":"partitioned", "value":"no", "domain":"forum.example.com", "path":"/", "partitionKey":{"topLevelSite":"https://other.example"}},
            {"name":"opaque", "value":"no", "domain":"forum.example.com", "path":"/", "partitionKeyOpaque":true}
        ]);
        let https = Url::parse("https://forum.example.com/account/profile").unwrap();
        assert_eq!(cookie_header_for_url(cookies.as_array().unwrap(), &https, 200.0),
            "trailingSlash=yes; narrow=yes; host=yes; parent=yes; secure=yes; future=yes; session=yes");
        let http = Url::parse("http://forum.example.com/account").unwrap();
        assert_eq!(
            cookie_header_for_url(cookies.as_array().unwrap(), &http, 200.0),
            "narrow=yes; host=yes; parent=yes; future=yes; session=yes"
        );
        let attacker = Url::parse("https://notexample.com/account").unwrap();
        assert_eq!(
            cookie_header_for_url(cookies.as_array().unwrap(), &attacker, 200.0),
            ""
        );
    }

    fn mock_devtools(
        pages: serde_json::Value,
        cookies: Option<serde_json::Value>,
    ) -> (u16, thread::JoinHandle<()>) {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let port = listener.local_addr().unwrap().port();
        let worker = thread::spawn(move || {
            let read_headers = |stream: &mut TcpStream| {
                stream
                    .set_read_timeout(Some(Duration::from_secs(2)))
                    .unwrap();
                let mut header = Vec::new();
                while !header.ends_with(b"\r\n\r\n") {
                    let mut byte = [0];
                    stream.read_exact(&mut byte).unwrap();
                    header.push(byte[0]);
                }
            };
            let (mut stream, _) = listener.accept().unwrap();
            read_headers(&mut stream);
            let body = pages.to_string();
            write!(
                stream,
                "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
                body.len()
            )
            .unwrap();
            drop(stream);
            if let Some(cookies) = cookies {
                let (mut stream, _) = listener.accept().unwrap();
                read_headers(&mut stream);
                stream.write_all(b"HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n\r\n").unwrap();
                let command: serde_json::Value =
                    serde_json::from_str(&read_ws_text_frame(&mut stream).unwrap()).unwrap();
                assert_eq!(command["method"], "Storage.getCookies");
                let body = json!({"id":1,"result":{"cookies":cookies}}).to_string();
                let mut frame = vec![0x81, 126];
                frame.extend_from_slice(&(body.len() as u16).to_be_bytes());
                frame.extend_from_slice(body.as_bytes());
                stream.write_all(&frame).unwrap();
            }
        });
        (port, worker)
    }

    #[test]
    fn cdp_capture_filters_cross_site_cookies() {
        let scope =
            FetchScope::new(serde_json::from_value(json!({"domain":"site-b.example"})).unwrap())
                .unwrap();
        let (port, worker) = mock_devtools(
            json!([{"type":"page","url":"https://site-b.example/login"}]),
            Some(json!([
                {"name":"sessionA","value":"secret-A","domain":"site-a.example","path":"/","httpOnly":true},
                {"name":"sessionB","value":"secret-B","domain":"site-b.example","path":"/","httpOnly":true}
            ])),
        );
        assert_eq!(
            capture_from_devtools(port, "/devtools/browser/test", &scope).unwrap(),
            (
                "sessionB=secret-B".into(),
                "https://site-b.example/login".into()
            )
        );
        worker.join().unwrap();
    }

    #[test]
    fn cdp_capture_rejects_unauthorized_navigation_and_unknown_page() {
        let scope = FetchScope::new(
            serde_json::from_value(json!({
                "domain":"site-b.example", "host_permissions":["https://site-b.example/account/*"]
            }))
            .unwrap(),
        )
        .unwrap();
        for url in [
            "https://site-a.example/account/",
            "https://site-b.example/admin/",
            "http://site-b.example/account/",
            "about:blank",
        ] {
            let (port, worker) = mock_devtools(json!([{"type":"page","url":url}]), None);
            let error = capture_from_devtools(port, "/devtools/browser/test", &scope).unwrap_err();
            assert!(error.contains("cookie capture denied"), "{error}");
            worker.join().unwrap();
        }
        let (port, worker) = mock_devtools(json!([]), None);
        assert!(
            capture_from_devtools(port, "/devtools/browser/test", &scope)
                .unwrap_err()
                .contains("could not determine")
        );
        worker.join().unwrap();
    }

    #[test]
    fn test_generate_ws_key_rfc6455_format() {
        let key1 = generate_ws_key();
        let key2 = generate_ws_key();

        // RFC 6455 requires 16-byte nonce base64-encoded (24 chars ending with ==)
        assert_eq!(key1.len(), 24);
        assert!(key1.ends_with("=="));

        let decoded1 = general_purpose::STANDARD.decode(&key1).unwrap();
        assert_eq!(decoded1.len(), 16);

        let decoded2 = general_purpose::STANDARD.decode(&key2).unwrap();
        assert_eq!(decoded2.len(), 16);

        // Successive keys must be distinct
        assert_ne!(key1, key2);
    }
}
