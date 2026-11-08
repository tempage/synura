# Synura extension runtime

`synura-runtime` is the shared Rust VM used by `synurart` and the Synura Android
app. One `Vm` owns one QuickJS runtime and context, its network authority,
pending requests, DOM documents, and opaque Web Crypto keys.

The crate contains JavaScript execution, native HTTP and Web Crypto bindings,
their Promise completion pump, Web API classes, and the Synura DOM adapter.
`DOMParser`, DOM nodes, `Headers`, `Request`, `Response`, abort signals, encoding,
and `URLSearchParams` are Rust bindings registered directly with QuickJS. It
does not own application views, extension installation, persistent storage,
Android services, or a command-line shell. The host installs those trusted
bindings in the VM's context.

## Dependency

From this workspace:

```toml
synura-runtime = { path = "../runtime" }
```

From a separate application repository:

```toml
synura-runtime = { git = "https://github.com/tempage/synura" }
```

Cargo finds the `synura-runtime` package in `runtime`. Pin a reviewed
Git revision using Cargo's `rev` field for an application release. Local
development can use a path dependency on that directory. Build requirements for
QuickJS/BoringSSL, including their native toolchains, apply to the embedding
application as well as to `synurart`.

## Execute a host entry point

```rust
use synura_runtime::{NetworkPolicy, Vm, VmConfig};
use synura_runtime::rquickjs::{promise::MaybePromise, CatchResultExt};

fn digest() -> Result<String, String> {
    let vm = Vm::new(VmConfig::default())?;
    // An empty approved policy grants no network access.
    vm.bind_network(NetworkPolicy::default())?;
    vm.begin_turn()?;
    let result = vm.context().with(|ctx| {
        let result = ctx.eval::<MaybePromise, _>(r#"
            crypto.subtle.digest('SHA-256', new TextEncoder().encode('abc'))
                .then(bytes => Array.from(new Uint8Array(bytes),
                    byte => byte.toString(16).padStart(2, '0')).join(''))
        "#).and_then(|value| vm.finish::<String>(&ctx, value));
        result.catch(&ctx).map_err(|error| error.to_string())
    });
    let drained = vm.drain();
    result.and_then(|value| drained.map(|()| value))
}
```

Call `begin_turn` before evaluating or invoking an extension entry point. It
starts that entry point's execution deadline. `finish` runs JavaScript jobs and
delivers native HTTP/crypto completions until the returned value or Promise
settles. Calling QuickJS's `MaybePromise::finish` alone cannot deliver these
native completions.

The host chooses its background-work policy:

- `drain()` completes already submitted native work and its JavaScript
  continuations. This is useful for a CLI command that must print its final
  result. It also belongs on error paths if the host chooses to finish that
  command's remaining work.
- `poll()` performs a bounded nonblocking completion step. An interactive host
  can call it from its owner-thread event loop, servicing its own UI messages
  between steps. Its boolean reports ready or pending work; it is not a request
  to spin continuously while a network operation is waiting.
- `has_pending_work()` checks queued work without executing JavaScript or
  applying the previous entry point's deadline. An event loop can use this to
  leave idle VMs alone and call `begin_turn` when the next entry point arrives.
- A returned Promise that cannot settle from available jobs/native work causes
  `finish` to return `WouldBlock`. Promises waiting for a future host event are
  not themselves native work for `drain`.

`context()` and `runtime()` are trusted embedding interfaces. They are not
extension capabilities. Host code must not replace the VM's interrupt handler,
disable resource limits, or let JavaScript values and `Persistent` roots outlive
the VM. Native completion delivery and host callbacks run on the VM owner
thread; network and crypto workers never access JavaScript objects.

## Network authority

Network access is denied until the host calls `bind_network` with approved
metadata. Binding succeeds at most once. Changing `SYNURA.domain`,
`host_permissions`, or `bypass` inside JavaScript does not change authority.
Changing extension identity or granting different permissions requires a new
VM.

```rust
use synura_runtime::{NetworkPolicy, Vm, VmConfig};

let vm = Vm::new(VmConfig::default())?;
vm.bind_network(NetworkPolicy {
    domain: "example.com".into(),
    host_permissions: vec!["https://api.example.com/v1/*".into()],
    bypass: None,
})?;
```

Permission patterns are validated against the extension's domain family and
checked before requests and at each redirect. Prefer explicit HTTPS patterns
with the narrow paths required by the extension. An omitted permission list
uses the existing host-wide HTTP/HTTPS scope; portless rules allow any port.
Host-side proxy configuration and fixture overrides do not grant additional
URL authority. Fixture overrides are trusted development inputs, never paths
accepted directly from extension JavaScript.

Apps that store revocable extension revisions in a database can install
`set_network_authority_check` before binding permissions. The HTTP worker calls
this host check before each request and after receiving response headers,
including redirects. An error permanently revokes the VM. The check must not
access JavaScript or wait for the VM thread; it can only restrict the approved
network policy, never expand it.

An app must validate and approve extension metadata before granting it. If it
evaluates JavaScript to discover metadata, use a separate restricted VM with no
network grants and no privileged host callbacks. Discard it after validation;
do not share its state or keys with the installed extension VM.

## Cancellation and destruction

`Vm::cancellation()` returns a cloneable token that can be sent to another
thread. Calling `cancel()` permanently revokes that VM. It interrupts
JavaScript execution and ends the host's completion waits. A revoked VM cannot
be reused by starting another turn. The host creates a fresh VM for a reload or
different extension revision.

Hosts with another cancellation mechanism can install `set_cancellation_probe`.
The probe runs on the owner thread during JavaScript interrupts and completion
pumping; returning `true` permanently revokes the VM. Keep it nonblocking and
do not enter the VM from the probe. Cancellation signals from another thread
should use atomics or the token returned by `cancellation()`.

`set_request_cancellation` supplies a separate token for HTTP operations
submitted afterward. Replacing it does not change the cancellation token of an
already submitted request. A request token must not be used as a substitute for
permanent VM revocation when an extension is removed or its authority changes.

Dropping a VM revokes its authority, cancels HTTP work, stops accepting crypto
work, and releases JavaScript roots before the context is destroyed. A native
BoringSSL operation already in progress cannot be forcibly interrupted; it may
finish on its worker after revocation, without delivering its result to the
closed VM. Hosts must discard queued commands and UI results belonging to a
closed VM or an outdated extension revision.

## Multiple VMs

`Vm` intentionally does not implement `Send` or `Sync`. Construct, use, and drop
each VM on its owner thread. Multiple VMs can share one owner-thread event loop,
or a host can allocate worker actors and pass owned command/result messages.
Bound the number of VMs and the host command queues. Do not add an `unsafe Send`
wrapper to move a live VM between threads.

The [multi_vm example](examples/multi_vm.rs) creates two independent worker
actors, computes crypto results in both, closes one, and continues using the
other:

```sh
cargo run -p synura-runtime --example multi_vm
```

`synurart` embeds one VM at a time. The Android app's Rust host manages separate
owner-thread actors for extension sessions. Commands carry owned Rust values;
saved JavaScript callbacks stay on the VM thread. The app checks extension
revision and revocation state before accepting commands and applying results.
UI, database, storage, and platform operations remain app host adapters.

## Resource boundaries

Each VM has the following limits. `VmConfig` controls the execution limits and
queued native work:

| Setting | Default |
| --- | --- |
| QuickJS heap | 64 MiB |
| QuickJS stack | 512 KiB |
| Entry-point execution deadline | 30 seconds |
| Pending HTTP operations | 32 |
| Pending crypto operations | 64 |
| Combined pending crypto input buffers and parameters | 16 MiB |
| Estimated live crypto key storage | 16 MiB, at most 4096 keys |
| Native DOM retained storage estimate | 32 MiB across all documents and clones |
| Native DOM nodes | 100,000 across all documents and clones |
| Native DOM documents | 128 |
| Native Headers storage | 16 MiB per VM, 64 KiB per Headers instance |
| Native URLSearchParams storage | 16 MiB per VM, 65,536 pairs per instance |
| Request/Response native metadata | 16 MiB per VM, 64 KiB per instance |
| Abort signal references | 65,536 per VM, 4,096 per signal; maximum follow depth 256 |

HTTP request/response bodies are limited to 8 MiB; request metadata to 64 KiB;
individual native crypto buffers to 16 MiB. Crypto iterable conversion also
limits entry count and copied input. These are host resource policies, not
additional parameters in the Web APIs.

Native Web API string conversions and buffer snapshots are limited to 16 MiB.
URL parameter and HTTP metadata builders reserve their native storage before
calling user iterators or getters, so reentrant construction shares the same
budget. Request/response body buffers and completed crypto output buffers use
the QuickJS heap. Crypto output buffers are wiped when released. Native abort
propagation is iterative, with bounded listener and dependent-signal storage.
Unused dependent signals release their reference quota; live signals and
registered abort listeners retain the source chain needed for cancellation.

DOM source is limited to 8 MiB per parse. The runtime charges retained text,
attributes, node metadata and handle overhead against an aggregate estimate.
`cloneNode()` and `cloneNode(false)` copy only the node and its attributes;
`cloneNode(true)` also copies descendants. Cloning checks and charges only the
copied nodes, including template contents for deep clones, before creating the
copy. Attribute mutations check the new size before
changing the original value. Removing attributes releases their charged bytes;
detached nodes and clones remain charged while their document is retained.
Document wrappers share a per-document lifetime: collecting the last node,
dataset, or class-list reference releases the document and its quota. Parsers
do not retain previously parsed documents. Before rejecting a native quota,
the runtime runs garbage collection to reclaim unreachable documents. Quota
failures throw `RangeError`, and no live document is silently evicted. Clone
traversal uses an explicit stack instead of native recursion.

The DOM budget bounds estimated retained data, not exact process RSS or the
HTML parser's transient allocations. A document is parsed before its actual
tree size can be measured; an oversized tree is rejected without retaining it.
These limits do not combine into a total process-memory budget: native DOM
trees, HTTP buffers, cryptographic key material, and worker overhead are outside
the QuickJS heap limit. Hosts must cap aggregate VM count, choose limits for
their device class, and release VMs when their extension sessions end. Crypto
keys have a native storage budget and are released when their JavaScript
wrappers are collected. Fetch metrics retain only the latest 256 completed requests; consume
them regularly if every metric is needed.

HTTP uses a shared executor with two worker threads while each VM retains its
own clients, permissions, pending requests, and cancellation state. Each VM
currently has a dedicated crypto worker. The host should account for that
worker and any owner-thread actors when choosing its VM count.

VM isolation is a software boundary within the host process, not an OS process
sandbox. Memory safety bugs in QuickJS or native dependencies can affect the
process. Install only host callbacks whose authority is appropriate for that
extension, and keep dependency updates and platform build validation in the app
release workflow.

## Verification

```sh
cargo test -p synura-runtime
cargo run -p synura-runtime --example multi_vm
cargo test -p synurart
```

The isolation tests use synthetic keys and loopback HTTP. They verify separate
globals and host callbacks, opaque key validation, per-VM revocation,
deny-by-default network access, one-time host authority binding, and disjoint
network scopes. Android ABI builds and device lifecycle tests remain the
embedding app's responsibility.
