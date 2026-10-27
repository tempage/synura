use std::collections::VecDeque;
use std::time::Duration;

const MAX_CLIENTS: usize = 32;
pub(super) const MAX_BODY_BYTES: usize = 8 * 1024 * 1024;

/// A host-owned cancellation handle. It can be signalled from another thread.
#[derive(Clone)]
pub struct FetchCancellation(tokio::sync::watch::Sender<bool>);

impl Default for FetchCancellation {
    fn default() -> Self {
        Self(tokio::sync::watch::channel(false).0)
    }
}

impl FetchCancellation {
    pub fn cancel(&self) {
        self.0.send_replace(true);
    }

    pub fn is_cancelled(&self) -> bool {
        *self.0.borrow()
    }

    async fn cancelled(&self) {
        let mut receiver = self.0.subscribe();
        let _ = receiver.wait_for(|cancelled| *cancelled).await;
    }
}

pub(super) struct TransportSettings<'a> {
    pub bypass: Option<&'a str>,
    pub timeout_ms: u64,
    pub proxy: Option<&'a str>,
    pub cancellation: &'a FetchCancellation,
}

#[derive(Debug)]
pub(crate) struct HttpResponse {
    pub status: u16,
    pub status_text: String,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub body: Vec<u8>,
    pub progress: Vec<(i64, i64)>,
}

pub(crate) struct HttpTransport {
    runtime: tokio::runtime::Runtime,
    clients: VecDeque<((String, u64, String), wreq::Client)>,
}

impl HttpTransport {
    pub(crate) fn new() -> Result<Self, String> {
        // Keep pooled connections driven while the synchronous JS host is idle.
        let runtime = tokio::runtime::Builder::new_multi_thread()
            .worker_threads(1)
            .enable_all()
            .build()
            .map_err(|error| format!("create HTTP runtime: {error}"))?;
        Ok(Self {
            runtime,
            clients: VecDeque::new(),
        })
    }

    pub(crate) fn fetch(
        &mut self,
        url: &str,
        options: &super::FetchRequest,
        headers: &[(String, String)],
        settings: TransportSettings<'_>,
    ) -> Result<HttpResponse, String> {
        let method = options.method.as_str();
        let method = wreq::Method::from_bytes(method.as_bytes())
            .map_err(|error| format!("invalid fetch method {method:?}: {error}"))?;
        let key = (
            settings.bypass.unwrap_or_default().trim().to_string(),
            settings.timeout_ms,
            settings.proxy.unwrap_or_default().trim().to_string(),
        );
        let client = if let Some(index) = self.clients.iter().position(|(cached, _)| cached == &key)
        {
            let entry = self.clients.remove(index).expect("located cached client");
            let client = entry.1.clone();
            self.clients.push_back(entry);
            client
        } else {
            let mut builder = wreq::Client::builder()
                .timeout(Duration::from_millis(settings.timeout_ms))
                .redirect(wreq::redirect::Policy::none());
            if !key.0.is_empty() {
                builder = builder.emulation(profile(&key.0));
            }
            if !key.2.is_empty() {
                builder = builder.proxy(wreq::Proxy::all(&key.2).map_err(|e| e.to_string())?);
            }
            let client = builder
                .build()
                .map_err(|error| format!("create HTTP client: {error}"))?;
            if self.clients.len() == MAX_CLIENTS {
                self.clients.pop_front();
            }
            self.clients.push_back((key, client.clone()));
            client
        };

        let send = async {
            let mut request = client.request(method, url);
            for (name, value) in headers {
                request = request.header(name.as_str(), value.as_str());
            }
            if !options.body.is_empty() {
                request = request.body(options.body.clone());
            }
            let mut response = request
                .send()
                .await
                .map_err(|error| format!("fetch {url}: {error}"))?;
            let status = response.status();
            let mut result = HttpResponse {
                status: status.as_u16(),
                status_text: status.canonical_reason().map_or_else(
                    || status.as_u16().to_string(),
                    |reason| format!("{} {reason}", status.as_u16()),
                ),
                url: response.uri().to_string(),
                headers: response
                    .headers()
                    .iter()
                    .filter_map(|(name, value)| {
                        value
                            .to_str()
                            .ok()
                            .map(|value| (name.to_string(), value.to_string()))
                    })
                    .collect(),
                body: Vec::new(),
                progress: Vec::new(),
            };
            let length = response
                .headers()
                .get(wreq::header::CONTENT_LENGTH)
                .and_then(|value| value.to_str().ok())
                .and_then(|value| value.parse::<u64>().ok());
            if length.is_some_and(|length| length > MAX_BODY_BYTES as u64) {
                return Err(format!(
                    "fetch response exceeds {MAX_BODY_BYTES} bytes: {url}"
                ));
            }
            let total = length
                .and_then(|length| i64::try_from(length).ok())
                .unwrap_or(-1);
            let mut last_progress = 0;
            while let Some(chunk) = response
                .chunk()
                .await
                .map_err(|error| format!("read fetch body: {error}"))?
            {
                if chunk.len() > MAX_BODY_BYTES - result.body.len() {
                    return Err(format!(
                        "fetch response exceeds {MAX_BODY_BYTES} bytes: {url}"
                    ));
                }
                result.body.extend_from_slice(&chunk);
                let current = result.body.len() as i64;
                if options.progress
                    && (current - last_progress >= 32 * 1024 || (total >= 0 && current >= total))
                {
                    result.progress.push((current, total));
                    last_progress = current;
                }
            }
            let complete = (result.body.len() as i64, total);
            if options.progress && result.progress.last() != Some(&complete) {
                result.progress.push(complete);
            }
            Ok(result)
        };
        self.runtime.block_on(async {
            tokio::select! {
                biased;
                _ = settings.cancellation.cancelled() => Err("context canceled".into()),
                response = send => response,
            }
        })
    }
}

fn profile(bypass: &str) -> wreq_util::EmulationOption {
    use wreq_util::{Emulation, EmulationOS, EmulationOption};

    let mut parts = bypass.split('/').map(str::trim);
    let browser = parts.next().unwrap_or_default().to_ascii_lowercase();
    let os = parts.next().unwrap_or_default().to_ascii_lowercase();
    let browser = if matches!(browser.as_str(), "firefox" | "tor") {
        Emulation::Firefox135
    } else {
        Emulation::Chrome133
    };
    let os = match os.as_str() {
        "android" => EmulationOS::Android,
        "ios" => EmulationOS::IOS,
        "macos" => EmulationOS::MacOS,
        "linux" => EmulationOS::Linux,
        _ => EmulationOS::Windows,
    };
    EmulationOption::builder()
        .emulation(browser)
        .emulation_os(os)
        .skip_headers(true)
        .build()
}
