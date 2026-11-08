use std::collections::BTreeMap;
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::{Arc, RwLock};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

use axum::{
    body::{Body, Bytes},
    extract::{Path as AxumPath, Request, State},
    http::{header, HeaderMap, HeaderValue, Method, StatusCode, Uri},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::{any, get},
    Router,
};
use rand::RngCore;

const SESSION_DURATION: Duration = Duration::from_secs(10);

#[derive(Debug, Clone)]
pub struct Config {
    pub addr: String,
    pub additional_script_path: Option<PathBuf>,
    pub synura_script_path: PathBuf,
    pub extensions_dir: PathBuf,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            addr: ":8080".to_string(),
            additional_script_path: None,
            synura_script_path: PathBuf::from("testdata/mock_server/synura.js"),
            extensions_dir: PathBuf::from("extensions"),
        }
    }
}

pub struct ServerState {
    pub cfg: Config,
    pub sessions: Arc<RwLock<HashMap<String, (Instant, SystemTime)>>>,
    pub resolved_extensions_dir: PathBuf,
}

impl ServerState {
    pub fn is_logged_in(&self, headers: &HeaderMap) -> Option<String> {
        let cookies = parse_cookies(headers);
        let session_id = cookies.get("session_id")?;
        let mut sessions = self.sessions.write().ok()?;
        if let Some((instant, _)) = sessions.get(session_id) {
            if Instant::now() < *instant {
                Some(session_id.clone())
            } else {
                sessions.remove(session_id);
                None
            }
        } else {
            None
        }
    }

    pub fn touch_session(&self, token: &str) -> Option<(Instant, SystemTime)> {
        let mut sessions = self.sessions.write().ok()?;
        if let Some((instant, _)) = sessions.get(token) {
            if Instant::now() < *instant {
                let new_instant = Instant::now() + SESSION_DURATION;
                let new_system = SystemTime::now() + SESSION_DURATION;
                sessions.insert(token.to_string(), (new_instant, new_system));
                return Some((new_instant, new_system));
            } else {
                sessions.remove(token);
                return None;
            }
        }
        None
    }

    pub fn create_session(&self) -> (String, SystemTime) {
        let mut bytes = [0u8; 16];
        rand::thread_rng().fill_bytes(&mut bytes);
        let token = bytes.iter().map(|b| format!("{b:02x}")).collect::<String>();
        let new_instant = Instant::now() + SESSION_DURATION;
        let new_system = SystemTime::now() + SESSION_DURATION;

        if let Ok(mut sessions) = self.sessions.write() {
            sessions.insert(token.clone(), (new_instant, new_system));
        }

        (token, new_system)
    }

    pub fn delete_session(&self, token: &str) {
        if let Ok(mut sessions) = self.sessions.write() {
            sessions.remove(token);
        }
    }
}

pub struct Server {
    state: Arc<ServerState>,
}

impl Server {
    pub fn new(mut cfg: Config) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        if cfg.addr.is_empty() {
            cfg.addr = ":8080".to_string();
        }
        if cfg.synura_script_path.as_os_str().is_empty() {
            cfg.synura_script_path = PathBuf::from("testdata/mock_server/synura.js");
        }
        if cfg.extensions_dir.as_os_str().is_empty() {
            cfg.extensions_dir = PathBuf::from("extensions");
        }

        if let Some(ref path) = cfg.additional_script_path {
            let abs_path = std::fs::canonicalize(path)
                .map_err(|e| format!("stat additional script path: {e}"))?;
            if !abs_path.is_dir() {
                return Err(format!(
                    "additional script path is not a directory: {}",
                    abs_path.display()
                )
                .into());
            }
            cfg.additional_script_path = Some(abs_path);
        }

        let resolved_extensions_dir = resolve_extensions_dir(&cfg.extensions_dir);

        let state = Arc::new(ServerState {
            cfg,
            sessions: Arc::new(RwLock::new(HashMap::new())),
            resolved_extensions_dir,
        });

        Ok(Self { state })
    }

    pub fn router(&self) -> Router {
        build_router(self.state.clone())
    }

    pub fn log_startup(&self) {
        log_startup_banner(&self.state);
    }

    pub async fn run(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        self.log_startup();

        let bind_addr = if self.state.cfg.addr.starts_with(':') {
            format!("0.0.0.0{}", self.state.cfg.addr)
        } else {
            self.state.cfg.addr.clone()
        };

        let listener = tokio::net::TcpListener::bind(&bind_addr).await?;
        self.run_with_listener(listener).await
    }

    pub async fn run_with_listener(
        &self,
        listener: tokio::net::TcpListener,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let app = self.router();
        axum::serve(listener, app).await?;
        Ok(())
    }
}

fn resolve_extensions_dir(configured: &Path) -> PathBuf {
    let candidates = [
        configured.to_path_buf(),
        PathBuf::from("extensions"),
        PathBuf::from("../extensions"),
    ];

    for dir in candidates {
        if dir.as_os_str().is_empty() {
            continue;
        }
        if let Ok(abs) = std::fs::canonicalize(&dir) {
            if abs.is_dir() {
                return abs;
            }
        }
    }
    PathBuf::from("./extensions")
}

pub fn build_router(state: Arc<ServerState>) -> Router {
    let mut app = Router::new()
        .route("/login", any(handle_login))
        .route("/logout", any(handle_logout))
        .route("/ua", any(handle_user_agent))
        .route("/headers", any(handle_headers))
        .route("/get", any(handle_get_echo))
        .route("/post", any(handle_post_echo))
        .route("/api/hello", any(handle_hello_echo))
        .route("/upload", any(handle_upload_route))
        .route("/login/get", any(handle_login_get))
        .route("/login/post", any(handle_login_post))
        .route("/login/upload", any(handle_login_upload))
        .route("/synura.js", get(handle_synura_script))
        .route("/examples/{*path}", get(handle_examples))
        .route("/examples", get(handle_examples_root));

    if state.cfg.additional_script_path.is_some() {
        app = app
            .route("/ext/{*path}", get(handle_ext))
            .route("/ext", get(handle_ext_root));
    }

    app.layer(middleware::from_fn_with_state(
        state.clone(),
        logging_middleware,
    ))
    .with_state(state)
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async fn handle_login(State(state): State<Arc<ServerState>>) -> Response {
    let (token, expiry_system) = state.create_session();
    let cookie_header = format!(
        "session_id={}; Path=/; Expires={}",
        token,
        httpdate::fmt_http_date(expiry_system)
    );

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::SET_COOKIE, cookie_header)
        .body(Body::from(
            r#"{"status": "logged_in", "message": "Session cookie set"}"#,
        ))
        .unwrap()
}

async fn handle_logout(
    State(state): State<Arc<ServerState>>,
    headers: HeaderMap,
) -> Response {
    let cookies = parse_cookies(&headers);
    if let Some(token) = cookies.get("session_id") {
        state.delete_session(token);
    }

    let past = SystemTime::now()
        .checked_sub(Duration::from_secs(3600))
        .unwrap_or(UNIX_EPOCH);
    let cookie_header = format!(
        "session_id=; Path=/; Expires={}",
        httpdate::fmt_http_date(past)
    );

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::SET_COOKIE, cookie_header)
        .body(Body::from(
            r#"{"status": "logged_out", "message": "Session cookie cleared"}"#,
        ))
        .unwrap()
}

async fn handle_user_agent(headers: HeaderMap) -> Response {
    let ua = headers
        .get(header::USER_AGENT)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    let json = serde_json::json!({
        "user_agent": ua
    });
    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(serde_json::to_string(&json).unwrap()))
        .unwrap()
}

async fn handle_headers(headers: HeaderMap) -> Response {
    let mut map: BTreeMap<String, Vec<String>> = BTreeMap::new();
    for (name, val) in &headers {
        if let Ok(v) = val.to_str() {
            let key = canonicalize_header_name(name.as_str());
            map.entry(key).or_default().push(v.to_string());
        }
    }
    let mut result: BTreeMap<String, String> = BTreeMap::new();
    for (k, v) in map {
        result.insert(k, v.join(", "));
    }
    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(serde_json::to_string(&result).unwrap()))
        .unwrap()
}

async fn handle_get_echo(req: Request) -> Response {
    if req.method() != Method::GET {
        return (StatusCode::METHOD_NOT_ALLOWED, "Method not allowed\n").into_response();
    }
    build_echo_response(req).await
}

async fn handle_post_echo(req: Request) -> Response {
    if req.method() != Method::POST {
        return (StatusCode::METHOD_NOT_ALLOWED, "Method not allowed\n").into_response();
    }
    build_echo_response(req).await
}

async fn handle_hello_echo(req: Request) -> Response {
    build_echo_response(req).await
}

async fn handle_upload_route(req: Request) -> Response {
    if req.method() != Method::POST {
        return (StatusCode::METHOD_NOT_ALLOWED, "Method not allowed\n").into_response();
    }
    handle_upload_logic(req).await
}

async fn handle_login_get(
    State(state): State<Arc<ServerState>>,
    req: Request,
) -> Response {
    if req.method() != Method::GET {
        return (StatusCode::METHOD_NOT_ALLOWED, "Method not allowed\n").into_response();
    }
    require_login(state, req, |r| Box::pin(build_echo_response(r))).await
}

async fn handle_login_post(
    State(state): State<Arc<ServerState>>,
    req: Request,
) -> Response {
    if req.method() != Method::POST {
        return (StatusCode::METHOD_NOT_ALLOWED, "Method not allowed\n").into_response();
    }
    require_login(state, req, |r| Box::pin(build_echo_response(r))).await
}

async fn handle_login_upload(
    State(state): State<Arc<ServerState>>,
    req: Request,
) -> Response {
    if req.method() != Method::POST {
        return (StatusCode::METHOD_NOT_ALLOWED, "Method not allowed\n").into_response();
    }
    require_login(state, req, |r| Box::pin(handle_upload_logic(r))).await
}

async fn require_login<F>(
    state: Arc<ServerState>,
    req: Request,
    inner: F,
) -> Response
where
    F: FnOnce(Request) -> std::pin::Pin<Box<dyn std::future::Future<Output = Response> + Send>>,
{
    let cookies = parse_cookies(req.headers());
    let session_id = match cookies.get("session_id") {
        Some(s) if !s.is_empty() => s.clone(),
        _ => return (StatusCode::UNAUTHORIZED, "Unauthorized: Login required\n").into_response(),
    };

    let new_expiry = match state.touch_session(&session_id) {
        Some((_, sys)) => sys,
        None => {
            return (StatusCode::UNAUTHORIZED, "Unauthorized: Login required\n").into_response();
        }
    };

    let cookie_header = format!(
        "session_id={}; Path=/; Expires={}",
        session_id,
        httpdate::fmt_http_date(new_expiry)
    );

    let mut response = inner(req).await;
    if let Ok(val) = HeaderValue::from_str(&cookie_header) {
        response.headers_mut().insert(header::SET_COOKIE, val);
    }
    response
}

async fn build_echo_response(req: Request) -> Response {
    let method = req.method().to_string();
    let uri = req.uri().to_string();
    let query_map = parse_query(req.uri());
    let cookies_map = parse_cookies(req.headers());

    let mut map: serde_json::Map<String, serde_json::Value> = serde_json::Map::new();
    map.insert("method".to_string(), serde_json::Value::String(method));
    map.insert("url".to_string(), serde_json::Value::String(uri));
    map.insert(
        "query".to_string(),
        serde_json::to_value(query_map).unwrap_or_default(),
    );
    map.insert(
        "cookies".to_string(),
        serde_json::to_value(cookies_map).unwrap_or_default(),
    );

    if req.method() == Method::POST || req.method() == Method::PUT {
        let body_bytes = match axum::body::to_bytes(req.into_body(), 10 * 1024 * 1024).await {
            Ok(b) => b,
            Err(_) => Bytes::new(),
        };
        let body_str = String::from_utf8_lossy(&body_bytes).to_string();
        map.insert(
            "body".to_string(),
            serde_json::Value::String(body_str.clone()),
        );
        if let Ok(json_val) = serde_json::from_str::<serde_json::Value>(&body_str) {
            map.insert("json".to_string(), json_val);
        }
    }

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(serde_json::to_string(&map).unwrap()))
        .unwrap()
}

async fn handle_upload_logic(req: Request) -> Response {
    use axum::extract::FromRequest;

    let content_type = req
        .headers()
        .get(header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_string();

    if !content_type.starts_with("multipart/form-data") {
        return (
            StatusCode::BAD_REQUEST,
            "Content-Type must be multipart/form-data\n",
        )
            .into_response();
    }

    let mut multipart = match axum::extract::Multipart::from_request(req, &()).await {
        Ok(mp) => mp,
        Err(e) => {
            return (
                StatusCode::BAD_REQUEST,
                format!("Failed to parse multipart form: {e}\n"),
            )
                .into_response();
        }
    };

    let mut found_file = None;
    while let Ok(Some(field)) = multipart.next_field().await {
        if field.name() == Some("file") {
            let filename = field.file_name().unwrap_or("").to_string();
            let mut headers_map: BTreeMap<String, Vec<String>> = BTreeMap::new();
            for (name, val) in field.headers() {
                if let Ok(val_str) = val.to_str() {
                    let canonical = canonicalize_header_name(name.as_str());
                    headers_map
                        .entry(canonical)
                        .or_default()
                        .push(val_str.to_string());
                }
            }

            let data = match field.bytes().await {
                Ok(b) => b,
                Err(e) => {
                    return (
                        StatusCode::BAD_REQUEST,
                        format!("Failed to retrieve file: {e}\n"),
                    )
                        .into_response();
                }
            };

            found_file = Some((filename, data.len(), headers_map));
            break;
        }
    }

    let (filename, size, header_map) = match found_file {
        Some(f) => f,
        None => {
            return (
                StatusCode::BAD_REQUEST,
                "Failed to retrieve file: no file field found\n",
            )
                .into_response();
        }
    };

    let response = serde_json::json!({
        "filename": filename,
        "size": size,
        "header": header_map,
        "message": "File uploaded successfully"
    });

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(serde_json::to_string(&response).unwrap()))
        .unwrap()
}

async fn handle_synura_script(State(state): State<Arc<ServerState>>) -> Response {
    let candidates = [
        state.cfg.synura_script_path.clone(),
        PathBuf::from("testdata/mock_server/synura.js"),
        PathBuf::from("../testdata/mock_server/synura.js"),
        PathBuf::from("mock_server/synura.js"),
        PathBuf::from("synura.js"),
    ];

    for p in candidates {
        if p.as_os_str().is_empty() {
            continue;
        }
        if let Ok(bytes) = tokio::fs::read(&p).await {
            return Response::builder()
                .status(StatusCode::OK)
                .header(
                    header::CONTENT_TYPE,
                    "application/javascript; charset=utf-8",
                )
                .body(Body::from(bytes))
                .unwrap();
        }
    }

    (StatusCode::NOT_FOUND, "synura.js not found\n").into_response()
}

async fn handle_examples_root(State(state): State<Arc<ServerState>>) -> Response {
    handle_static_file(&state.resolved_extensions_dir, "").await
}

async fn handle_examples(
    State(state): State<Arc<ServerState>>,
    AxumPath(path): AxumPath<String>,
) -> Response {
    handle_static_file(&state.resolved_extensions_dir, &path).await
}

async fn handle_ext_root(State(state): State<Arc<ServerState>>) -> Response {
    match state.cfg.additional_script_path.as_deref() {
        Some(dir) => handle_static_file(dir, "").await,
        None => (StatusCode::NOT_FOUND, "Not found\n").into_response(),
    }
}

async fn handle_ext(
    State(state): State<Arc<ServerState>>,
    AxumPath(path): AxumPath<String>,
) -> Response {
    match state.cfg.additional_script_path.as_deref() {
        Some(dir) => handle_static_file(dir, &path).await,
        None => (StatusCode::NOT_FOUND, "Not found\n").into_response(),
    }
}

async fn handle_static_file(base_dir: &Path, rel_path: &str) -> Response {
    let normalized = rel_path.trim_start_matches('/');
    let target = base_dir.join(normalized);

    let canonical_base = match std::fs::canonicalize(base_dir) {
        Ok(b) => b,
        Err(_) => return (StatusCode::NOT_FOUND, "Directory not found\n").into_response(),
    };

    let canonical_target = match std::fs::canonicalize(&target) {
        Ok(t) => t,
        Err(_) => return (StatusCode::NOT_FOUND, "File not found\n").into_response(),
    };

    if !canonical_target.starts_with(&canonical_base) || !canonical_target.is_file() {
        return (StatusCode::NOT_FOUND, "File not found\n").into_response();
    }

    match tokio::fs::read(&canonical_target).await {
        Ok(bytes) => {
            let mime = mime_guess::from_path(&canonical_target)
                .first_or_octet_stream()
                .to_string();
            Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, mime)
                .body(Body::from(bytes))
                .unwrap()
        }
        Err(_) => (StatusCode::NOT_FOUND, "File read error\n").into_response(),
    }
}

// ---------------------------------------------------------------------------
// Middleware & Logging
// ---------------------------------------------------------------------------

async fn logging_middleware(
    State(state): State<Arc<ServerState>>,
    req: Request,
    next: Next,
) -> Response {
    if req.uri().path() == "/favicon.ico" {
        return next.run(req).await;
    }

    let start = Instant::now();
    let auth_status = if state.is_logged_in(req.headers()).is_some() {
        "[Auth]"
    } else {
        "[Guest]"
    };

    let method = req.method().clone();
    let uri = req.uri().to_string();
    let headers = req.headers().clone();
    let cookies = parse_cookies(&headers);

    log_line("─── REQUEST ───────────────────────────────");
    log_line(&format!("{method} {uri} {auth_status}"));
    log_line("Headers:");
    for (name, val) in &headers {
        if let Ok(val_str) = val.to_str() {
            log_line(&format!("  {name}: {val_str}"));
        }
    }
    if !cookies.is_empty() {
        log_line("Cookies:");
        for (name, val) in &cookies {
            log_line(&format!("  {name}: {val}"));
        }
    }

    let is_body_method = method == Method::POST || method == Method::PUT;
    let (parts, body) = req.into_parts();

    let (content_type_str, content_length_num) = if is_body_method {
        let ct = headers
            .get(header::CONTENT_TYPE)
            .and_then(|v| v.to_str().ok())
            .unwrap_or("")
            .to_string();
        let cl = headers
            .get(header::CONTENT_LENGTH)
            .and_then(|v| v.to_str().ok())
            .and_then(|s| s.parse::<usize>().ok())
            .unwrap_or(0);
        log_line(&format!("Content-Type: {ct}"));
        log_line(&format!("Content-Length: {cl}"));
        (ct, cl)
    } else {
        (String::new(), 0)
    };

    // Buffer body for non-multipart requests or preview
    let req = if is_body_method {
        let bytes = match axum::body::to_bytes(body, 10 * 1024 * 1024).await {
            Ok(b) => b,
            Err(_) => Bytes::new(),
        };

        if !bytes.is_empty() {
            let preview_len = bytes.len().min(1024);
            let chunk = String::from_utf8_lossy(&bytes[..preview_len]);
            log_line("Request Body Preview:");
            if bytes.len() > 1024 {
                log_line(&format!("  {chunk}... (truncated)"));
            } else {
                log_line(&format!("  {chunk}"));
            }
        }

        Request::from_parts(parts, Body::from(bytes))
    } else {
        let _ = (content_type_str, content_length_num);
        Request::from_parts(parts, body)
    };

    let resp = next.run(req).await;

    let (resp_parts, resp_body) = resp.into_parts();
    let resp_bytes = match axum::body::to_bytes(resp_body, 10 * 1024 * 1024).await {
        Ok(b) => b,
        Err(_) => Bytes::new(),
    };

    log_line("─── RESPONSE ──────────────────────────────");
    log_line(&format!(
        "Status: {} {}",
        resp_parts.status.as_u16(),
        resp_parts.status.canonical_reason().unwrap_or("")
    ));
    if !resp_bytes.is_empty() {
        let preview_len = resp_bytes.len().min(1000);
        let resp_preview = String::from_utf8_lossy(&resp_bytes[..preview_len]);
        log_line("Response Body:");
        if resp_bytes.len() > 1000 {
            log_line(&format!("  {resp_preview}... (truncated)"));
        } else {
            log_line(&format!("  {resp_preview}"));
        }
    }
    let elapsed = start.elapsed();
    log_line(&format!("← Completed in {elapsed:?}"));
    log_line("───────────────────────────────────────────");

    Response::from_parts(resp_parts, Body::from(resp_bytes))
}

fn log_startup_banner(state: &ServerState) {
    let addr = &state.cfg.addr;
    let host_port = if addr.starts_with(':') {
        addr.to_string()
    } else if let Some((_, port)) = addr.rsplit_once(':') {
        format!(":{port}")
    } else {
        format!(":{addr}")
    };

    log_line("===========================================");
    log_line(&format!("       Mock Server Starting on {addr}"));
    log_line("===========================================");
    println!();
    log_line("--- API Endpoints ---");
    log_line(&format!(
        "  http://localhost{host_port}/login         - Set session cookie"
    ));
    log_line(&format!(
        "  http://localhost{host_port}/logout        - Clear session cookie"
    ));
    log_line(&format!(
        "  http://localhost{host_port}/ua            - Echo User-Agent"
    ));
    log_line(&format!(
        "  http://localhost{host_port}/headers       - Echo all headers"
    ));
    log_line(&format!(
        "  http://localhost{host_port}/get           - Echo request details"
    ));
    log_line(&format!(
        "  http://localhost{host_port}/post          - Echo body (POST)"
    ));
    log_line(&format!(
        "  http://localhost{host_port}/upload        - File upload (POST)"
    ));
    log_line(&format!(
        "  http://localhost{host_port}/login/get     - Authenticated GET"
    ));
    log_line(&format!(
        "  http://localhost{host_port}/login/post    - Authenticated POST"
    ));
    log_line(&format!(
        "  http://localhost{host_port}/login/upload  - Authenticated upload"
    ));
    println!();
    log_line("--- Extension Scripts ---");
    log_line(&format!("  http://localhost{host_port}/synura.js"));

    if let Some(ref add_path) = state.cfg.additional_script_path {
        println!();
        log_line(&format!(
            "--- Custom Extensions from: {} ---",
            add_path.display()
        ));
        for entry in walk_scripts(add_path) {
            if let Ok(rel) = entry.strip_prefix(add_path) {
                let slash_path = rel.to_string_lossy().replace('\\', "/");
                log_line(&format!("  http://localhost{host_port}/ext/{slash_path}"));
            }
        }
    }

    println!();
    log_line(&format!(
        "--- Example Extensions from: {} ---",
        state.resolved_extensions_dir.display()
    ));
    for entry in walk_scripts(&state.resolved_extensions_dir) {
        if let Ok(rel) = entry.strip_prefix(&state.resolved_extensions_dir) {
            let slash_path = rel.to_string_lossy().replace('\\', "/");
            log_line(&format!(
                "  http://localhost{host_port}/examples/{slash_path}"
            ));
        }
    }
    println!();
    log_line("===========================================");
}

fn walk_scripts(dir: &Path) -> Vec<PathBuf> {
    let mut files = Vec::new();
    walk_dir_recursive(dir, &mut files);
    files.sort();
    files
}

fn walk_dir_recursive(dir: &Path, acc: &mut Vec<PathBuf>) {
    let read_dir = match std::fs::read_dir(dir) {
        Ok(rd) => rd,
        Err(_) => return,
    };
    for entry in read_dir.flatten() {
        let p = entry.path();
        if p.is_dir() {
            walk_dir_recursive(&p, acc);
        } else if p.is_file() {
            let name = p.file_name().and_then(|n| n.to_str()).unwrap_or("");
            if name.ends_with(".js") || name == "extensions.json" {
                acc.push(p);
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

pub fn parse_cookies(headers: &HeaderMap) -> BTreeMap<String, String> {
    let mut map = BTreeMap::new();
    for val in headers.get_all(header::COOKIE) {
        if let Ok(s) = val.to_str() {
            for part in s.split(';') {
                let part = part.trim();
                if let Some((k, v)) = part.split_once('=') {
                    map.insert(k.trim().to_string(), v.trim().to_string());
                }
            }
        }
    }
    map
}

pub fn parse_query(uri: &Uri) -> BTreeMap<String, String> {
    let mut map: BTreeMap<String, Vec<String>> = BTreeMap::new();
    if let Some(query_str) = uri.query() {
        for (k, v) in form_urlencoded::parse(query_str.as_bytes()) {
            map.entry(k.into_owned())
                .or_default()
                .push(v.into_owned());
        }
    }
    let mut result = BTreeMap::new();
    for (k, v) in map {
        result.insert(k, v.join(", "));
    }
    result
}

pub fn canonicalize_header_name(name: &str) -> String {
    name.split('-')
        .map(|segment| {
            let mut chars = segment.chars();
            match chars.next() {
                Some(first) => {
                    let mut s = first.to_uppercase().to_string();
                    s.extend(chars.map(|c| c.to_ascii_lowercase()));
                    s
                }
                None => String::new(),
            }
        })
        .collect::<Vec<_>>()
        .join("-")
}

pub fn format_log_time() -> String {
    let dur = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default();
    let secs = dur.as_secs();
    let days = (secs / 86400) as i64;
    let rem_secs = (secs % 86400) as u32;
    let hour = rem_secs / 3600;
    let min = (rem_secs % 3600) / 60;
    let sec = rem_secs % 60;

    let z = days + 719468;
    let era = if z >= 0 { z } else { z - 146096 } / 146097;
    let doe = (z - era * 146097) as u32;
    let yoe = (doe - doe / 1024 + doe / 1460 - doe / 36524) / 365;
    let y = yoe as i64 + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = if m <= 2 { y + 1 } else { y };
    format!("{y:04}/{m:02}/{d:02} {hour:02}:{min:02}:{sec:02}")
}

fn log_line(msg: &str) {
    println!("{} {}", format_log_time(), msg);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use http::{Request, StatusCode};
    use tower::ServiceExt;

    fn get_workspace_root() -> PathBuf {
        if Path::new("extensions").is_dir() {
            PathBuf::from(".")
        } else if Path::new("../extensions").is_dir() {
            PathBuf::from("..")
        } else {
            PathBuf::from("../..")
        }
    }

    fn test_server() -> Server {
        let root = get_workspace_root();
        Server::new(Config {
            addr: ":0".to_string(),
            synura_script_path: root.join("testdata/mock_server/synura.js"),
            extensions_dir: root.join("extensions"),
            additional_script_path: Some(root.join("testdata/mock_server")),
        })
        .unwrap()
    }

    #[tokio::test]
    async fn test_login_and_logout() {
        let server = test_server();
        let app = server.router();

        // 1. GET /login sets session cookie
        let req = Request::builder()
            .uri("/login")
            .method(Method::GET)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let set_cookie = resp
            .headers()
            .get(header::SET_COOKIE)
            .expect("missing Set-Cookie header")
            .to_str()
            .unwrap();
        assert!(set_cookie.starts_with("session_id="));
        let token = set_cookie
            .split(';')
            .next()
            .unwrap()
            .strip_prefix("session_id=")
            .unwrap();
        assert!(!token.is_empty());

        // 2. GET /logout clears cookie
        let req = Request::builder()
            .uri("/logout")
            .method(Method::GET)
            .header(header::COOKIE, format!("session_id={token}"))
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let clear_cookie = resp
            .headers()
            .get(header::SET_COOKIE)
            .expect("missing Set-Cookie")
            .to_str()
            .unwrap();
        assert!(clear_cookie.starts_with("session_id=;"));
    }

    #[tokio::test]
    async fn test_public_get_and_post_echo() {
        let server = test_server();
        let app = server.router();

        // GET /get?foo=bar
        let req = Request::builder()
            .uri("/get?foo=bar")
            .method(Method::GET)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 1024 * 1024)
            .await
            .unwrap();
        let json: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(json["query"]["foo"], "bar");
        assert_eq!(json["method"], "GET");

        // POST /post with JSON body
        let req = Request::builder()
            .uri("/post")
            .method(Method::POST)
            .header(header::CONTENT_TYPE, "application/json")
            .body(Body::from(r#"{"key":"value"}"#))
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 1024 * 1024)
            .await
            .unwrap();
        let json: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(json["body"], r#"{"key":"value"}"#);
        assert_eq!(json["json"]["key"], "value");
    }

    #[tokio::test]
    async fn test_user_agent_and_headers() {
        let server = test_server();
        let app = server.router();

        // /ua
        let req = Request::builder()
            .uri("/ua")
            .method(Method::GET)
            .header(header::USER_AGENT, "CustomUA/1.0")
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let bytes = axum::body::to_bytes(resp.into_body(), 1024 * 1024)
            .await
            .unwrap();
        let json: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
        assert_eq!(json["user_agent"], "CustomUA/1.0");

        // /headers
        let req = Request::builder()
            .uri("/headers")
            .method(Method::GET)
            .header("X-Test-Header", "Hello")
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let bytes = axum::body::to_bytes(resp.into_body(), 1024 * 1024)
            .await
            .unwrap();
        let json: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
        assert_eq!(json["X-Test-Header"], "Hello");
    }

    #[tokio::test]
    async fn test_method_enforcement() {
        let server = test_server();
        let app = server.router();

        // POST /get -> 405
        let req = Request::builder()
            .uri("/get")
            .method(Method::POST)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::METHOD_NOT_ALLOWED);

        // GET /post -> 405
        let req = Request::builder()
            .uri("/post")
            .method(Method::GET)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::METHOD_NOT_ALLOWED);

        // GET /upload -> 405
        let req = Request::builder()
            .uri("/upload")
            .method(Method::GET)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::METHOD_NOT_ALLOWED);
    }

    #[tokio::test]
    async fn test_auth_endpoints() {
        let server = test_server();
        let app = server.router();

        // Without login -> 401
        let req = Request::builder()
            .uri("/login/get")
            .method(Method::GET)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);

        // Perform login
        let req = Request::builder()
            .uri("/login")
            .method(Method::GET)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        let set_cookie = resp
            .headers()
            .get(header::SET_COOKIE)
            .unwrap()
            .to_str()
            .unwrap();
        let token_part = set_cookie.split(';').next().unwrap();

        // With login -> 200 and session is refreshed
        let req = Request::builder()
            .uri("/login/get?test=1")
            .method(Method::GET)
            .header(header::COOKIE, token_part)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        assert!(resp.headers().contains_key(header::SET_COOKIE));
        let body = axum::body::to_bytes(resp.into_body(), 1024 * 1024)
            .await
            .unwrap();
        let json: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(json["query"]["test"], "1");

        // Auth POST
        let req = Request::builder()
            .uri("/login/post")
            .method(Method::POST)
            .header(header::COOKIE, token_part)
            .header(header::CONTENT_TYPE, "application/json")
            .body(Body::from(r#"{"msg":"auth"}"#))
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let body = axum::body::to_bytes(resp.into_body(), 1024 * 1024)
            .await
            .unwrap();
        let json: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(json["json"]["msg"], "auth");
    }

    #[tokio::test]
    async fn test_upload_endpoint() {
        let server = test_server();
        let app = server.router();

        let boundary = "---------------------------974767299852498929531610575";
        let body = format!(
            "--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"test.txt\"\r\nContent-Type: text/plain\r\n\r\nhello\r\n--{boundary}--\r\n"
        );

        let req = Request::builder()
            .uri("/upload")
            .method(Method::POST)
            .header(
                header::CONTENT_TYPE,
                format!("multipart/form-data; boundary={boundary}"),
            )
            .body(Body::from(body))
            .unwrap();

        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        let bytes = axum::body::to_bytes(resp.into_body(), 1024 * 1024)
            .await
            .unwrap();
        let json: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
        assert_eq!(json["filename"], "test.txt");
        assert_eq!(json["size"], 5);
        assert_eq!(json["message"], "File uploaded successfully");
    }

    #[tokio::test]
    async fn test_synura_script_and_examples() {
        let server = test_server();
        let app = server.router();

        // /synura.js
        let req = Request::builder()
            .uri("/synura.js")
            .method(Method::GET)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        assert_eq!(
            resp.headers().get(header::CONTENT_TYPE).unwrap(),
            "application/javascript; charset=utf-8"
        );

        // /examples/basic/hello_world.js
        let req = Request::builder()
            .uri("/examples/basic/hello_world.js")
            .method(Method::GET)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
        assert!(resp.headers().get(header::CONTENT_TYPE).unwrap().to_str().unwrap().contains("javascript"));

        // /ext/synura.js (from additional_script_path)
        let req = Request::builder()
            .uri("/ext/synura.js")
            .method(Method::GET)
            .body(Body::empty())
            .unwrap();
        let resp = app.clone().oneshot(req).await.unwrap();
        assert_eq!(resp.status(), StatusCode::OK);
    }
}
