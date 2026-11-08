//! Shared, owner-thread Synura extension virtual machine.
//!
//! Each VM owns a separate QuickJS heap, network authority and opaque key store.
//! Hosts install UI/storage bindings through [`Vm::context`]; native workers only
//! receive owned bytes. A VM must stay on its creating thread. Send commands and
//! [`CancellationToken`]s between threads, never JavaScript values.

pub use rquickjs;
use rquickjs::{promise::MaybePromise, CatchResultExt, Context, Ctx, FromJs, Runtime};
use serde::Deserialize;
use std::{
    cell::RefCell,
    collections::HashMap,
    path::Path,
    rc::Rc,
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};

mod dom;
mod fetch_async;
mod fetch_bindings;
mod fetch_scope;
mod fetch_session;
mod fetch_transport;
mod web_constructor;
mod web_encoding;
mod web_native;
mod web_url;
mod webcrypto;
include!("helpers.rs");

pub use fetch_scope::{FetchScope as NetworkScope, NetworkPackage as NetworkPolicy};
pub use fetch_transport::FetchCancellation as CancellationToken;
pub const MAX_BODY_BYTES: usize = 8 * 1024 * 1024;

/// Proxy selection is controlled by the embedding host, never by extensions.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub enum Proxy {
    #[default]
    System,
    Disabled,
    Explicit(String),
}
type FetchProxy = Proxy;
type CancellationProbe = Arc<Mutex<Option<Box<dyn Fn() -> bool + Send>>>>;
type NetworkAuthorityCheck = Arc<dyn Fn() -> Result<(), String> + Send + Sync>;

fn host_cancelled(probe: &CancellationProbe) -> bool {
    probe
        .lock()
        .map_or(true, |probe| probe.as_ref().is_some_and(|probe| probe()))
}

/// Limits apply independently to each VM. Hosts must additionally cap VM count.
#[derive(Clone, Debug)]
pub struct VmConfig {
    pub memory_limit: usize,
    pub stack_limit: usize,
    pub execution_timeout: Option<Duration>,
    pub max_pending_fetch: usize,
    pub max_pending_crypto: usize,
    pub max_crypto_input_bytes: usize,
}
impl Default for VmConfig {
    fn default() -> Self {
        Self {
            memory_limit: 64 * 1024 * 1024,
            stack_limit: 512 * 1024,
            execution_timeout: Some(Duration::from_secs(30)),
            max_pending_fetch: 32,
            max_pending_crypto: 64,
            max_crypto_input_bytes: 16 * 1024 * 1024,
        }
    }
}

#[derive(Clone, Debug)]
pub struct FetchMetric {
    pub request_url: String,
    pub method: String,
    pub status: u16,
    pub headers: Vec<(String, String)>,
    pub network_ms: u64,
}

struct NetworkState {
    fetch_scope: Option<NetworkScope>,
    fetch_overrides: HashMap<String, String>,
    timeout_ms: u64,
    fetch_proxy: Proxy,
    fetch_cancellation: CancellationToken,
    revoked: CancellationToken,
    max_pending: usize,
    metrics: Vec<FetchMetric>,
    authority_check: Option<NetworkAuthorityCheck>,
}

#[derive(Clone, Copy, Default, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
enum FetchRedirect {
    #[default]
    Follow,
    Error,
}
#[derive(Clone, Deserialize)]
struct FetchRequest {
    url: String,
    method: String,
    #[serde(default)]
    headers: Vec<(String, String)>,
    #[serde(skip)]
    body: Option<Vec<u8>>,
    #[serde(default)]
    credentials: String,
    #[serde(default)]
    redirect: FetchRedirect,
}

/// A single extension VM. This type intentionally does not implement `Send`.
pub struct Vm {
    crypto: webcrypto::CryptoPump,
    fetch: fetch_bindings::FetchPump,
    // Explicit roots above are released before context/runtime destruction.
    ctx: Context,
    runtime: Runtime,
    network: Rc<RefCell<NetworkState>>,
    revoked: CancellationToken,
    deadline: Arc<Mutex<Option<Instant>>>,
    cancellation_probe: CancellationProbe,
    config: VmConfig,
}

impl Vm {
    pub fn new(config: VmConfig) -> Result<Self, String> {
        if config.memory_limit == 0
            || config.stack_limit == 0
            || config.max_pending_fetch == 0
            || config.max_pending_crypto == 0
            || config.max_crypto_input_bytes == 0
        {
            return Err("VM limits must be nonzero".into());
        }
        let runtime = Runtime::new().map_err(|e| format!("create JS runtime: {e}"))?;
        runtime.set_memory_limit(config.memory_limit);
        runtime.set_max_stack_size(config.stack_limit);
        let revoked = CancellationToken::default();
        let deadline: Arc<Mutex<Option<Instant>>> = Arc::new(Mutex::new(None));
        let interrupt_cancel = revoked.clone();
        let interrupt_deadline = deadline.clone();
        let cancellation_probe: CancellationProbe = Arc::new(Mutex::new(None));
        let interrupt_probe = cancellation_probe.clone();
        runtime.set_interrupt_handler(Some(Box::new(move || {
            if interrupt_cancel.is_cancelled() || host_cancelled(&interrupt_probe) {
                interrupt_cancel.cancel();
                return true;
            }
            if interrupt_deadline
                .lock()
                .map_or(true, |value| value.is_some_and(|end| Instant::now() >= end))
            {
                interrupt_cancel.cancel();
                return true;
            }
            false
        })));
        let ctx = Context::full(&runtime).map_err(|e| format!("create JS context: {e}"))?;
        let network = Rc::new(RefCell::new(NetworkState {
            fetch_scope: None,
            fetch_overrides: HashMap::new(),
            timeout_ms: 10_000,
            fetch_proxy: Proxy::System,
            fetch_cancellation: CancellationToken::default(),
            revoked: revoked.clone(),
            max_pending: config.max_pending_fetch,
            metrics: Vec::new(),
            authority_check: None,
        }));
        let (crypto, fetch) = ctx.with(|ctx| -> Result<_, String> {
            let mut crypto = webcrypto::install(
                &ctx,
                config.max_pending_crypto,
                config.max_crypto_input_bytes,
                revoked.clone(),
            )
            .map_err(|e| format!("install Web Crypto: {e}"))?;
            let mut fetch = match fetch_bindings::install(&ctx, network.clone()) {
                Ok(fetch) => fetch,
                Err(error) => {
                    crypto.shutdown(&ctx);
                    return Err(format!("install fetch: {error}"));
                }
            };
            let installed = web_encoding::install(&ctx)
                .and_then(|_| web_url::install(&ctx))
                .and_then(|_| fetch.function(&ctx))
                .and_then(|native_fetch| web_native::install(&ctx, native_fetch))
                .and_then(|_| dom::install(&ctx))
                .and_then(|_| web_constructor::install(&ctx))
                .catch(&ctx)
                .map_err(|e| format!("install Web APIs: {e}"));
            if let Err(error) = installed {
                fetch.shutdown(&ctx);
                crypto.shutdown(&ctx);
                web_encoding::shutdown(&ctx);
                web_url::shutdown(&ctx);
                web_constructor::shutdown(&ctx);
                return Err(error);
            }
            Ok((crypto, fetch))
        })?;
        let vm = Self {
            crypto,
            fetch,
            ctx,
            runtime,
            network,
            revoked,
            deadline,
            cancellation_probe,
            config,
        };
        vm.begin_turn()?;
        Ok(vm)
    }

    pub fn context(&self) -> &Context {
        &self.ctx
    }
    pub fn runtime(&self) -> &Runtime {
        &self.runtime
    }
    pub fn cancellation(&self) -> CancellationToken {
        self.revoked.clone()
    }

    /// Bridge an embedding host's cancellation mechanism. This trusted probe
    /// runs on the owner thread, including from the JavaScript interrupt
    /// handler. It must be fast, nonblocking, and must not enter this VM.
    /// Returning true permanently revokes the VM and cancels its native work.
    pub fn set_cancellation_probe(&self, probe: impl Fn() -> bool + Send + 'static) {
        *self
            .cancellation_probe
            .lock()
            .unwrap_or_else(|error| error.into_inner()) = Some(Box::new(probe));
    }

    /// Start a host entry point before evaluating JavaScript. A revoked VM can
    /// never be revived; create a new VM for a different extension authority.
    pub fn begin_turn(&self) -> Result<(), String> {
        if host_cancelled(&self.cancellation_probe) {
            self.revoked.cancel();
        }
        if self.revoked.is_cancelled() {
            return Err("VM authority was revoked".into());
        }
        *self
            .deadline
            .lock()
            .map_err(|_| "VM deadline unavailable")? = self
            .config
            .execution_timeout
            .and_then(|time| Instant::now().checked_add(time));
        Ok(())
    }

    /// Bind approved metadata exactly once. Before binding, all fetches fail.
    /// Calling this with a new identity requires creating a new VM instead.
    pub fn bind_network(&self, policy: NetworkPolicy) -> Result<(), String> {
        self.check_running()?;
        let mut network = self.network.borrow_mut();
        if network.fetch_scope.is_some() {
            return Err("VM network authority is already bound".into());
        }
        network.fetch_scope = Some(NetworkScope::new(policy)?);
        Ok(())
    }
    /// Check the host's execution lease before each HTTP hop and after receiving
    /// response headers. Install before binding network authority. This runs on
    /// HTTP workers and must not access JavaScript or wait for the VM thread.
    /// An error permanently revokes the VM; this callback cannot grant URLs
    /// outside the bound network policy.
    pub fn set_network_authority_check(
        &self,
        check: impl Fn() -> Result<(), String> + Send + Sync + 'static,
    ) -> Result<(), String> {
        self.check_running()?;
        let mut network = self.network.borrow_mut();
        if network.fetch_scope.is_some() {
            return Err(
                "Install the network authority check before binding network permissions".into(),
            );
        }
        network.authority_check = Some(Arc::new(check));
        Ok(())
    }
    pub fn set_request_cancellation(&self, token: CancellationToken) {
        self.network.borrow_mut().fetch_cancellation = token;
    }
    pub fn set_timeout(&self, timeout_ms: u64) {
        self.network.borrow_mut().timeout_ms = timeout_ms.max(1);
    }
    pub fn set_proxy(&self, proxy: Proxy) -> Result<(), String> {
        if let Proxy::Explicit(url) = &proxy {
            wreq::Proxy::all(url).map_err(|e| e.to_string())?;
        }
        self.network.borrow_mut().fetch_proxy = proxy;
        Ok(())
    }
    /// Host-only fixture substitution. Network permissions are still checked.
    pub fn set_fetch_override(&self, url: &str, path: impl AsRef<Path>) -> Result<(), String> {
        let url = url::Url::parse(url).map_err(|e| e.to_string())?.to_string();
        std::fs::metadata(path.as_ref()).map_err(|e| e.to_string())?;
        self.network
            .borrow_mut()
            .fetch_overrides
            .insert(url, path.as_ref().to_string_lossy().into_owned());
        Ok(())
    }
    pub fn clear_fetch_overrides(&self) {
        self.network.borrow_mut().fetch_overrides.clear();
    }
    pub fn take_fetch_metrics(&self) -> Vec<FetchMetric> {
        std::mem::take(&mut self.network.borrow_mut().metrics)
    }

    fn check_running(&self) -> Result<(), String> {
        if host_cancelled(&self.cancellation_probe) {
            self.revoked.cancel();
        }
        if self.revoked.is_cancelled() {
            return Err("VM authority was revoked".into());
        }
        if self
            .deadline
            .lock()
            .map_err(|_| "VM deadline unavailable")?
            .is_some_and(|end| Instant::now() >= end)
        {
            self.revoked.cancel();
            return Err("VM execution deadline exceeded; authority revoked".into());
        }
        Ok(())
    }
    fn check_js(&self, ctx: &Ctx<'_>) -> rquickjs::Result<()> {
        self.check_running()
            .map_err(|message| rquickjs::Exception::throw_message(ctx, &message))
    }
    pub fn finish<'js, T: FromJs<'js>>(
        &self,
        ctx: &Ctx<'js>,
        value: MaybePromise<'js>,
    ) -> rquickjs::Result<T> {
        loop {
            self.check_js(ctx)?;
            if let Some(result) = value.result() {
                return result;
            }
            if ctx.execute_pending_job() {
                continue;
            }
            if self.crypto.poll(ctx, false)? | self.fetch.poll(ctx, false)? {
                continue;
            }
            if !self.crypto.pending(ctx)? && !self.fetch.pending(ctx)? {
                return Err(rquickjs::Error::WouldBlock);
            }
            if self.fetch.pending(ctx)? {
                self.fetch.poll(ctx, true)?;
            } else {
                self.crypto.poll(ctx, true)?;
            }
        }
    }
    /// Inspect queued jobs/native work without executing JavaScript or applying
    /// an entry-point deadline. Owner-thread event loops can use this to avoid
    /// polling an idle VM after its last turn has finished.
    pub fn has_pending_work(&self) -> Result<bool, String> {
        if self.runtime.is_job_pending() {
            return Ok(true);
        }
        self.ctx.with(|ctx| {
            (|| Ok(self.crypto.pending(&ctx)? || self.fetch.pending(&ctx)?))()
                .catch(&ctx)
                .map_err(|error| format!("inspect pending work: {error}"))
        })
    }

    /// Returns whether the background WebCrypto worker thread has been spawned.
    #[doc(hidden)]
    pub fn is_crypto_worker_spawned(&self) -> bool {
        self.ctx
            .with(|ctx| self.crypto.is_worker_spawned(&ctx).unwrap_or(false))
    }

    /// Run one bounded native-completion/microtask step without waiting.
    /// Returns whether ready or pending native work remains.
    pub fn poll(&self) -> Result<bool, String> {
        self.check_running()?;
        if self.runtime.is_job_pending() {
            self.runtime
                .execute_pending_job()
                .map_err(|_| "execute JS job failed".to_string())?;
        }
        let native_pending = self.ctx.with(|ctx| {
            let result = (|| {
                self.crypto.poll(&ctx, false)?;
                self.fetch.poll(&ctx, false)?;
                Ok(self.crypto.pending(&ctx)? || self.fetch.pending(&ctx)?)
            })();
            result
                .catch(&ctx)
                .map_err(|e| format!("complete native work: {e}"))
        })?;
        Ok(native_pending || self.runtime.is_job_pending())
    }
    /// CLI-style completion policy. App hosts may use `poll` instead and service
    /// their own event loop. Promises awaiting future host events do not block.
    pub fn drain(&self) -> Result<(), String> {
        loop {
            if !self.poll()? {
                return Ok(());
            }
            if self.runtime.is_job_pending() {
                continue;
            }
            self.ctx.with(|ctx| {
                let result = if self.fetch.pending(&ctx).unwrap_or(false) {
                    self.fetch.poll(&ctx, true)
                } else {
                    self.crypto.poll(&ctx, true)
                };
                result
                    .catch(&ctx)
                    .map_err(|e| format!("complete native work: {e}"))
            })?;
        }
    }
}
impl Drop for Vm {
    fn drop(&mut self) {
        self.revoked.cancel();
        self.ctx.with(|ctx| {
            self.fetch.shutdown(&ctx);
            self.crypto.shutdown(&ctx);
            web_encoding::shutdown(&ctx);
            web_url::shutdown(&ctx);
            web_constructor::shutdown(&ctx);
        });
    }
}
