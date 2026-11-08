//! Owned HTTP request plans and completion events for the JavaScript host.
use std::collections::HashMap;
use std::fs::File;
use std::io::Read;
use std::sync::mpsc::Sender;
use std::time::Instant;

use url::Url;

use super::fetch_scope::FetchScope;
use super::fetch_session::RedirectCookies;
use super::fetch_transport::{
    self, ClientCache, FetchCancellation, HttpResponseHead, MAX_BODY_BYTES,
};
use super::{FetchProxy, FetchRedirect, FetchRequest};

const MAX_REDIRECTS: usize = 20;

pub(super) struct FetchPlan {
    pub request: FetchRequest,
    pub scope: FetchScope,
    pub overrides: HashMap<String, String>,
    pub timeout_ms: u64,
    pub proxy: FetchProxy,
    pub cancellation: FetchCancellation,
    pub revoked: FetchCancellation,
    pub request_cancellation: FetchCancellation,
    pub authority_check: Option<super::NetworkAuthorityCheck>,
}

impl FetchPlan {
    fn check_authority(&self) -> Result<(), String> {
        if self.revoked.is_cancelled()
            || self.cancellation.is_cancelled()
            || self.request_cancellation.is_cancelled()
        {
            return Err("context canceled".into());
        }
        if let Some(check) = &self.authority_check {
            if let Err(error) = check() {
                self.revoked.cancel();
                return Err(error);
            }
        }
        Ok(())
    }
}

pub(super) enum FetchEvent {
    Headers {
        id: u64,
        response: HttpResponseHead,
    },
    Complete {
        id: u64,
        body: Vec<u8>,
        network_ms: u64,
    },
    Error {
        id: u64,
        message: String,
    },
}

fn emit(events: &Sender<FetchEvent>, event: FetchEvent) -> Result<(), String> {
    events
        .send(event)
        .map_err(|_| "HTTP receiver is closed".into())
}

fn too_large(url: &Url) -> String {
    format!("fetch response exceeds {MAX_BODY_BYTES} bytes: {url}")
}

pub(super) async fn run(
    id: u64,
    plan: &FetchPlan,
    clients: &ClientCache,
    events: &Sender<FetchEvent>,
) -> Result<(), String> {
    let req = &plan.request;
    let mut url = Url::parse(&req.url).map_err(|error| format!("invalid fetch url: {error}"))?;
    let mut method = wreq::Method::from_bytes(req.method.as_bytes())
        .map_err(|error| format!("invalid fetch method {:?}: {error}", req.method))?;
    let mut request_headers = req.headers.clone();
    let mut request_body = req.body.as_deref();
    let mut cookies = RedirectCookies::default();
    let mut network_ms = 0;
    for redirect in 0..=MAX_REDIRECTS {
        plan.check_authority()?;
        plan.scope.check(&url)?;
        if let Some(path) = plan.overrides.get(url.as_str()) {
            return file_response(id, plan, &url, path, redirect != 0, network_ms, events).await;
        }
        let client = fetch_transport::client(
            clients,
            plan.scope.bypass.as_deref(),
            plan.timeout_ms,
            &plan.proxy,
        )?;
        let mut headers = request_headers.clone();
        if !headers
            .iter()
            .any(|(name, _)| name.eq_ignore_ascii_case("user-agent"))
        {
            let ua = plan
                .scope
                .bypass
                .as_deref()
                .and_then(super::user_agent_from_bypass)
                .unwrap_or("Go-http-client/1.1");
            headers.insert(0, ("User-Agent".into(), ua.into()));
        }
        if req.credentials != "omit"
            && !headers
                .iter()
                .any(|(name, _)| name.eq_ignore_ascii_case("cookie"))
        {
            if let Some(value) = cookies.header(&url) {
                headers.push(("Cookie".into(), value));
            }
        }
        let mut request = client.request(method.clone(), url.as_str());
        for (name, value) in headers {
            request = request.header(name, value);
        }
        if let Some(body) = request_body {
            request = request.body(body.to_owned());
        }
        let started = Instant::now();
        let mut response = request
            .send()
            .await
            .map_err(|error| format!("fetch {url}: {error}"))?;
        let status = response.status();
        plan.check_authority()?;
        let headers: Vec<(String, String)> = response
            .headers()
            .iter()
            .filter_map(|(name, value)| {
                value
                    .to_str()
                    .ok()
                    .map(|value| (name.to_string(), value.to_string()))
            })
            .collect();
        if matches!(status.as_u16(), 301 | 302 | 303 | 307 | 308) {
            if req.redirect == FetchRedirect::Error {
                return Err("fetch redirect is disallowed by redirect: 'error'".into());
            }
            if req.credentials != "omit" {
                cookies.collect(&url, &headers);
            }
            if let Some((_, location)) = headers
                .iter()
                .find(|(name, _)| name.eq_ignore_ascii_case("location"))
            {
                if redirect == MAX_REDIRECTS {
                    return Err(format!("stopped after {MAX_REDIRECTS} redirects"));
                }
                let next_url = url
                    .join(location)
                    .map_err(|error| format!("invalid redirect URL: {error}"))?;
                plan.scope.check(&next_url)?;
                if url.origin() != next_url.origin() {
                    // Explicit credentials stay removed throughout this redirect chain.
                    request_headers.retain(|(name, _)| {
                        !name.eq_ignore_ascii_case("authorization")
                            && !name.eq_ignore_ascii_case("cookie")
                    });
                }
                if (matches!(status.as_u16(), 301 | 302) && method == wreq::Method::POST)
                    || (status.as_u16() == 303
                        && method != wreq::Method::GET
                        && method != wreq::Method::HEAD)
                {
                    method = wreq::Method::GET;
                    request_body = None;
                    request_headers.retain(|(name, _)| {
                        ![
                            "content-encoding",
                            "content-language",
                            "content-location",
                            "content-type",
                            "content-length",
                            "transfer-encoding",
                        ]
                        .iter()
                        .any(|header| name.eq_ignore_ascii_case(header))
                    });
                }
                url = next_url;
                network_ms += started.elapsed().as_millis() as u64;
                continue;
            }
        }
        let null_body = method == wreq::Method::HEAD || matches!(status.as_u16(), 204 | 205 | 304);
        let head = HttpResponseHead {
            status: status.as_u16(),
            status_text: status.canonical_reason().unwrap_or("").into(),
            url: response.uri().to_string(),
            headers,
            redirected: redirect != 0,
            null_body,
        };
        emit(events, FetchEvent::Headers { id, response: head })?;
        if null_body {
            return emit(
                events,
                FetchEvent::Complete {
                    id,
                    body: Vec::new(),
                    network_ms: network_ms + started.elapsed().as_millis() as u64,
                },
            );
        }
        let length = response
            .headers()
            .get(wreq::header::CONTENT_LENGTH)
            .and_then(|value| value.to_str().ok())
            .and_then(|value| value.parse::<u64>().ok());
        if length.is_some_and(|length| length > MAX_BODY_BYTES as u64) {
            return Err(too_large(&url));
        }
        let mut body = Vec::new();
        while let Some(chunk) = response
            .chunk()
            .await
            .map_err(|error| format!("read fetch body: {error}"))?
        {
            if chunk.len() > MAX_BODY_BYTES - body.len() {
                return Err(too_large(&url));
            }
            body.try_reserve(chunk.len())
                .map_err(|_| "cannot allocate fetch response body")?;
            body.extend_from_slice(&chunk);
        }
        return emit(
            events,
            FetchEvent::Complete {
                id,
                body,
                network_ms: network_ms + started.elapsed().as_millis() as u64,
            },
        );
    }
    Err(format!("stopped after {MAX_REDIRECTS} redirects"))
}

async fn file_response(
    id: u64,
    plan: &FetchPlan,
    url: &Url,
    path: &str,
    redirected: bool,
    network_ms: u64,
    events: &Sender<FetchEvent>,
) -> Result<(), String> {
    let path_owned = path.to_owned();
    let file = tokio::task::spawn_blocking(move || File::open(path_owned))
        .await
        .map_err(|error| format!("open override task: {error}"))?
        .map_err(|error| format!("read override file {path}: {error}"))?;
    let null_body = plan.request.method.eq_ignore_ascii_case("HEAD");
    emit(
        events,
        FetchEvent::Headers {
            id,
            response: HttpResponseHead {
                status: 200,
                status_text: "OK".into(),
                url: url.to_string(),
                headers: vec![(
                    "content-type".into(),
                    mime_guess::from_path(path)
                        .first_or_text_plain()
                        .to_string(),
                )],
                redirected,
                null_body,
            },
        },
    )?;
    let body = if null_body {
        Vec::new()
    } else {
        tokio::task::spawn_blocking(move || {
            let mut body = Vec::new();
            file.take(MAX_BODY_BYTES as u64 + 1)
                .read_to_end(&mut body)?;
            Ok::<_, std::io::Error>(body)
        })
        .await
        .map_err(|error| format!("read override task: {error}"))?
        .map_err(|error| format!("read override file {path}: {error}"))?
    };
    if body.len() > MAX_BODY_BYTES {
        return Err(too_large(url));
    }
    emit(
        events,
        FetchEvent::Complete {
            id,
            body,
            network_ms,
        },
    )
}
