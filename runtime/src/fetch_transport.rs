use std::collections::VecDeque;
use std::sync::{mpsc, Arc, Mutex, OnceLock};
use std::time::Duration;

use super::fetch_async::{FetchEvent, FetchPlan};

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

    pub(super) async fn cancelled(&self) {
        let mut receiver = self.0.subscribe();
        let _ = receiver.wait_for(|cancelled| *cancelled).await;
    }
}

#[derive(Clone, Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct HttpResponseHead {
    pub status: u16,
    pub status_text: String,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub redirected: bool,
    pub null_body: bool,
}

type ClientKey = (String, u64, super::FetchProxy);
pub(super) type ClientCache = Arc<Mutex<VecDeque<(ClientKey, wreq::Client)>>>;

/// Owns the HTTP executor and connection pool; tasks only receive Rust values.
pub(crate) struct HttpTransport {
    runtime: Option<tokio::runtime::Handle>,
    clients: ClientCache,
    shutdown: FetchCancellation,
}

impl HttpTransport {
    pub(crate) fn new() -> Result<Self, String> {
        // A shared executor limits OS thread growth when the host owns many VMs.
        // Clients, cookies, pending results and cancellation remain VM-local.
        static EXECUTOR: OnceLock<Result<tokio::runtime::Runtime, String>> = OnceLock::new();
        let runtime = EXECUTOR
            .get_or_init(|| {
                tokio::runtime::Builder::new_multi_thread()
                    .worker_threads(2)
                    .enable_all()
                    .build()
                    .map_err(|error| format!("create HTTP executor: {error}"))
            })
            .as_ref()
            .map_err(Clone::clone)?
            .handle()
            .clone();
        Ok(Self {
            runtime: Some(runtime),
            clients: Arc::new(Mutex::new(VecDeque::new())),
            shutdown: FetchCancellation::default(),
        })
    }

    pub(super) fn submit(
        &self,
        id: u64,
        plan: FetchPlan,
        events: mpsc::Sender<FetchEvent>,
    ) -> Result<(), String> {
        let runtime = self.runtime.as_ref().ok_or("HTTP runtime is closed")?;
        let clients = self.clients.clone();
        let shutdown = self.shutdown.clone();
        runtime.spawn(async move {
            let result = tokio::select! {
                biased;
                _ = shutdown.cancelled() => Err("context canceled".to_owned()),
                _ = plan.cancellation.cancelled() => Err("context canceled".to_owned()),
                _ = plan.revoked.cancelled() => Err("context canceled".to_owned()),
                _ = plan.request_cancellation.cancelled() => Err("context canceled".to_owned()),
                result = super::fetch_async::run(id, &plan, &clients, &events) => result,
            };
            if let Err(message) = result {
                let _ = events.send(FetchEvent::Error { id, message });
            }
        });
        Ok(())
    }

    pub(super) fn shutdown(&mut self) {
        self.shutdown.cancel();
        self.runtime.take();
        if let Ok(mut clients) = self.clients.lock() {
            clients.clear();
        }
    }
}

impl Drop for HttpTransport {
    fn drop(&mut self) {
        self.shutdown();
    }
}

pub(super) fn client(
    cache: &ClientCache,
    bypass: Option<&str>,
    timeout_ms: u64,
    proxy: &super::FetchProxy,
) -> Result<wreq::Client, String> {
    let key = (
        bypass.unwrap_or_default().trim().to_string(),
        timeout_ms,
        proxy.clone(),
    );
    let mut clients = cache
        .lock()
        .map_err(|_| "HTTP client pool is unavailable")?;
    if let Some(index) = clients.iter().position(|(cached, _)| cached == &key) {
        let entry = clients.remove(index).expect("located cached client");
        let client = entry.1.clone();
        clients.push_back(entry);
        return Ok(client);
    }
    let mut builder = wreq::Client::builder()
        .timeout(Duration::from_millis(timeout_ms))
        .redirect(wreq::redirect::Policy::none());
    if !key.0.is_empty() {
        builder = builder.emulation(profile(&key.0));
    }
    builder = match &key.2 {
        super::FetchProxy::System => builder,
        super::FetchProxy::Disabled => builder.no_proxy(),
        super::FetchProxy::Explicit(url) => {
            builder.proxy(wreq::Proxy::all(url).map_err(|error| error.to_string())?)
        }
    };
    let client = builder
        .build()
        .map_err(|error| format!("create HTTP client: {error}"))?;
    if clients.len() == MAX_CLIENTS {
        clients.pop_front();
    }
    clients.push_back((key, client.clone()));
    Ok(client)
}

fn profile(bypass: &str) -> wreq::Emulation {
    let mut parts = bypass.split('/').map(str::trim);
    let browser = parts.next().unwrap_or_default().to_ascii_lowercase();
    if matches!(browser.as_str(), "firefox" | "tor") {
        firefox_profile()
    } else {
        chrome_profile()
    }
}

fn chrome_profile() -> wreq::Emulation {
    use wreq::http2::{
        Http2Options, PseudoId, PseudoOrder, SettingId, SettingsOrder, StreamDependency, StreamId,
    };
    use wreq::tls::{
        AlpsProtocol, CertificateCompressionAlgorithm, TlsOptions, TlsVersion,
    };

    let tls = TlsOptions::builder()
        .grease_enabled(true)
        .enable_ocsp_stapling(true)
        .enable_signed_cert_timestamps(true)
        .curves_list("X25519MLKEM768:X25519:P-256:P-384")
        .sigalgs_list(
            "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:\
             ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:\
             rsa_pss_rsae_sha512:rsa_pkcs1_sha512",
        )
        .cipher_list(
            "TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:\
             TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:\
             TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:\
             TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:\
             TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:\
             TLS_RSA_WITH_AES_128_GCM_SHA256:TLS_RSA_WITH_AES_256_GCM_SHA384:\
             TLS_RSA_WITH_AES_128_CBC_SHA:TLS_RSA_WITH_AES_256_CBC_SHA",
        )
        .min_tls_version(TlsVersion::TLS_1_2)
        .max_tls_version(TlsVersion::TLS_1_3)
        .permute_extensions(true)
        .pre_shared_key(true)
        .enable_ech_grease(true)
        .alps_protocols([AlpsProtocol::HTTP2])
        .alps_use_new_codepoint(true)
        .aes_hw_override(true)
        .certificate_compression_algorithms(&[CertificateCompressionAlgorithm::BROTLI])
        .build();

    let pseudo_order = PseudoOrder::builder()
        .extend([
            PseudoId::Method,
            PseudoId::Authority,
            PseudoId::Scheme,
            PseudoId::Path,
        ])
        .build();

    let settings_order = SettingsOrder::builder()
        .extend([
            SettingId::HeaderTableSize,
            SettingId::EnablePush,
            SettingId::MaxConcurrentStreams,
            SettingId::InitialWindowSize,
            SettingId::MaxFrameSize,
            SettingId::MaxHeaderListSize,
            SettingId::EnableConnectProtocol,
            SettingId::NoRfc7540Priorities,
        ])
        .build();

    let http2 = Http2Options::builder()
        .initial_window_size(6291456)
        .initial_connection_window_size(15728640)
        .max_header_list_size(262144)
        .header_table_size(65536)
        .headers_stream_dependency(StreamDependency::new(StreamId::zero(), 219, true))
        .headers_pseudo_order(pseudo_order)
        .settings_order(settings_order)
        .enable_push(false)
        .build();

    wreq::Emulation::builder()
        .tls_options(tls)
        .http2_options(http2)
        .build()
}

fn firefox_profile() -> wreq::Emulation {
    use wreq::http2::{
        Http2Options, PseudoId, PseudoOrder, SettingId, SettingsOrder, StreamDependency, StreamId,
    };
    use wreq::tls::{
        AlpnProtocol, CertificateCompressionAlgorithm, ExtensionType, TlsOptions, TlsVersion,
    };

    const EXTENSIONS: &[ExtensionType] = &[
        ExtensionType::SERVER_NAME,
        ExtensionType::EXTENDED_MASTER_SECRET,
        ExtensionType::RENEGOTIATE,
        ExtensionType::SUPPORTED_GROUPS,
        ExtensionType::EC_POINT_FORMATS,
        ExtensionType::SESSION_TICKET,
        ExtensionType::APPLICATION_LAYER_PROTOCOL_NEGOTIATION,
        ExtensionType::STATUS_REQUEST,
        ExtensionType::DELEGATED_CREDENTIAL,
        ExtensionType::CERTIFICATE_TIMESTAMP,
        ExtensionType::KEY_SHARE,
        ExtensionType::SUPPORTED_VERSIONS,
        ExtensionType::SIGNATURE_ALGORITHMS,
        ExtensionType::PSK_KEY_EXCHANGE_MODES,
        ExtensionType::RECORD_SIZE_LIMIT,
        ExtensionType::CERT_COMPRESSION,
        ExtensionType::ENCRYPTED_CLIENT_HELLO,
    ];

    let tls = TlsOptions::builder()
        .curves_list("X25519MLKEM768:X25519:P-256:P-384:P-521:ffdhe2048:ffdhe3072")
        .sigalgs_list(
            "ecdsa_secp256r1_sha256:ecdsa_secp384r1_sha384:ecdsa_secp521r1_sha512:\
             rsa_pss_rsae_sha256:rsa_pss_rsae_sha384:rsa_pss_rsae_sha512:\
             rsa_pkcs1_sha256:rsa_pkcs1_sha384:rsa_pkcs1_sha512:ecdsa_sha1:rsa_pkcs1_sha1",
        )
        .cipher_list(
            "TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384:\
             TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:\
             TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:\
             TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:\
             TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA:\
             TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:\
             TLS_RSA_WITH_AES_128_GCM_SHA256:TLS_RSA_WITH_AES_256_GCM_SHA384:\
             TLS_RSA_WITH_AES_128_CBC_SHA:TLS_RSA_WITH_AES_256_CBC_SHA",
        )
        .session_ticket(true)
        .delegated_credentials(
            "ecdsa_secp256r1_sha256:ecdsa_secp384r1_sha384:ecdsa_secp521r1_sha512:ecdsa_sha1",
        )
        .record_size_limit(0x4001)
        .enable_ocsp_stapling(true)
        .enable_ech_grease(true)
        .enable_signed_cert_timestamps(true)
        .alpn_protocols([AlpnProtocol::HTTP2, AlpnProtocol::HTTP1])
        .min_tls_version(TlsVersion::TLS_1_2)
        .max_tls_version(TlsVersion::TLS_1_3)
        .key_shares_limit(3)
        .pre_shared_key(true)
        .psk_skip_session_ticket(true)
        .psk_dhe_ke(true)
        .preserve_tls13_cipher_list(true)
        .extension_permutation(EXTENSIONS)
        .aes_hw_override(true)
        .random_aes_hw_override(true)
        .certificate_compression_algorithms(&[
            CertificateCompressionAlgorithm::ZLIB,
            CertificateCompressionAlgorithm::BROTLI,
            CertificateCompressionAlgorithm::ZSTD,
        ])
        .build();

    let pseudo_order = PseudoOrder::builder()
        .extend([
            PseudoId::Method,
            PseudoId::Path,
            PseudoId::Authority,
            PseudoId::Scheme,
        ])
        .build();

    let settings_order = SettingsOrder::builder()
        .extend([
            SettingId::HeaderTableSize,
            SettingId::EnablePush,
            SettingId::MaxConcurrentStreams,
            SettingId::InitialWindowSize,
            SettingId::MaxFrameSize,
            SettingId::MaxHeaderListSize,
            SettingId::EnableConnectProtocol,
            SettingId::NoRfc7540Priorities,
        ])
        .build();

    let http2 = Http2Options::builder()
        .initial_window_size(131072)
        .max_frame_size(16384)
        .initial_connection_window_size(12517377 + 65535)
        .initial_stream_id(3)
        .header_table_size(65536)
        .enable_push(false)
        .headers_stream_dependency(StreamDependency::new(StreamId::zero(), 21, false))
        .headers_pseudo_order(pseudo_order)
        .settings_order(settings_order)
        .build();

    wreq::Emulation::builder()
        .tls_options(tls)
        .http2_options(http2)
        .build()
}
