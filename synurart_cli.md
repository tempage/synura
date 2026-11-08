# synurart CLI Shell Guide

`synurart` runs a Synura extension JavaScript file in one
[`synura-runtime` VM](runtime/README.md). The CLI supplies the view
simulator, storage, browser integration, and terminal interface; the shared
crate supplies JavaScript execution, fetch, Web Crypto, and DOM APIs. Use it to
load an extension, inspect view state, and emit common view events without
launching the mobile app.

## Start Commands

```bash
# Recommended wrapper from this repo
make synurart EXT=extensions/basic/list.js

# Direct wrapper
./synurart.sh -ext extensions/basic/list.js

# One-shot command
./synurart.sh -json -ext extensions/basic/list.js -e "views"

# Build a reusable binary
make build
./bin/synurart -ext extensions/basic/list.js
```

The root `./synurart.sh` wrapper runs an incremental Cargo build and then executes `target/debug/synurart` from this checkout.

Building the native HTTP and cryptography libraries requires a C/C++ toolchain, CMake, Perl, and libclang in addition to Rust. On Debian/Ubuntu, install `build-essential cmake perl libclang-dev pkg-config`. The first build compiles BoringSSL, shared by HTTP and Web Crypto, and takes longer than subsequent builds.

## CLI Flags

| Flag | Meaning |
|---|---|
| `-ext <path>` | Path to the extension JavaScript file. |
| `-no-home` | Load the extension but do not call `SYNURA.main.home()`. |
| `-proxy <url\|off\|system>` | Use an explicit HTTP/HTTPS/SOCKS proxy, disable all proxies, or use system/environment proxies (default). |
| `-e "<command>"` | Execute one shell command and exit. |
| `-json` | Emit command result objects as JSON where supported. Runtime console logs may still be text. |

The first positional argument is also treated as the extension path when `-ext` is omitted.

By default, proxy routing follows the environment's protocol-specific `HTTP_PROXY` / `HTTPS_PROXY`, `ALL_PROXY`, and `NO_PROXY` settings (including lowercase forms). An explicit proxy URL overrides those settings for all requests. Use `-proxy off` to force direct connections.

## REPL Behavior

- Prompt is `synurart> ` when stdin is interactive.
- Interactive terminals support line editing, in-session history, and tab completion for commands, paths, view IDs, item indexes, menu labels, and common event names.
- Empty lines are ignored.
- `quit`, `q`, or `exit` terminates.
- In non-interactive mode, pipe commands on stdin.
- Color is enabled automatically on terminals. Set `SYNURART_COLOR=always` or `SYNURART_COLOR=never` to override.

Example:

```bash
printf 'views\ntap index 1\nviews\nquit\n' | ./synurart.sh -json -ext extensions/basic/list.js
```

## Commands

| Command | Effect |
|---|---|
| `help` / `h` | Show command help. |
| `load <path> [--no-home]` | Load an extension into a fresh runtime. |
| `views` / `ls` | Show stack summary and active view. |
| `v [id]` | Show stack summary, or one view when `id` is given. |
| `view <id>` | Show one view's compact data and render. |
| `render [id]` | Render one view; defaults to the top view. |
| `home` | Call `SYNURA.main.home()` and show views. |
| `deeplink <url>` | Call `SYNURA.main.deeplink(url)` and show views. |
| `resume <id> [context]` | Resume a view with optional context. |
| `tap index <n> [id]` | Emit `CLICK` for a 1-based list item index. |
| `tap title <text> [id]` | Emit `CLICK` by exact title match. |
| `tap author <name> [id]` | Emit `AUTHOR_CLICK` by author match. |
| `tap category <name> [id]` | Emit `CATEGORY_CLICK` by category match. |
| `click ...` | Alias of `tap ...`. |
| `s <n> [id]` | Alias of `tap index <n> [id]`. |
| `itemmenu <id> <label> [index]` | Emit `ITEM_MENU_CLICK` using list/comment item data. |
| `reorder <id> <fromIndex> <toIndex>` | Emit `REORDER`. |
| `refresh [id]` / `r [id]` | Emit `REFRESH`; defaults to the top view. |
| `n [id]` / `next [id]` | Emit `SCROLL_TO_END`; defaults to the top view. |
| `close [id]` / `c [id]` | Close a view; defaults to the top view. |
| `menu <id> <label>` | Emit `MENU_CLICK`. |
| `query <id> <text>` | Emit `QUERY`. |
| `submit [id] [buttonLabel\|jsonObject]` | Emit `SUBMIT`. Without a label, use the first configured button. Button-only submissions include current input/settings values; explicit JSON is sent as provided. |
| `event <id> <EVENT_ID> [jsonObject]` | Emit a custom event. |
| `timeout [duration]` | Show or set fetch timeout, for example `10s` or `500ms`. |
| `locale [tag]` | Show or set `navigator.language`, for example `ko-KR`. |
| `mapurl <url> <file>` | Map one exact fetch URL to a local file for this runtime. |
| `mapurl list` | Show fetch URL overrides. |
| `mapurl clear` | Clear fetch URL overrides. |
| `storage [local|session]` | Show storage snapshots. |
| `storage clear [local|session|all]` | Clear storage. |
| `browser [open\|submit\|close\|status] [id]` | Launch OS native browser (Chrome/Edge) with DevTools for `/views/browser`, capture cookies via CDP on submit, or close/cancel. |
| `eval <javascript>` | Evaluate JavaScript in the current runtime and await a returned Promise. |
| `proxy [url\|clear\|system]` | Show proxy mode, set an explicit URL, disable all proxies with `clear`, or restore system/environment routing with `system`. |

## Practical Workflow

1. Start with `./synurart.sh -json -ext <ext.js> -e "views"`.
2. Read the active view from the `type=views` output.
3. Pick an action by path:
   - `/views/list`: `tap index`, `query`, `menu`, `n`
   - `/views/post`: `refresh`, `menu`, `event`
   - `/views/browser`: `browser` (or `browser open`), `browser submit` (capture cookies via CDP), `browser close` (cancel)
4. Re-run `views` or `view <id>` to confirm state changes.

## Notes

- `fetch` uses browser TLS/HTTP profiles when `SYNURA.bypass` is set, with the extension's request headers preserved. It does not execute page JavaScript or provide a WebView.
- Post content rendering shows link labels and their full destinations (`link: label -> URL`), including when the label is shortened for the terminal.
- Response headers are `Headers` objects: use `get(name)`, `has(name)`, iterators, and `getSetCookie()`. Missing headers return `null`; fetched response headers are immutable.
- `fetch` follows up to 20 redirects within host permissions. A 301/302 changes POST to GET; a 303 changes methods other than GET/HEAD to GET, discarding the body and its headers. A 307/308 preserves the method/body. `redirect: "error"` rejects redirect responses; `"manual"` and invalid modes reject before network access.
- Explicit `Authorization` and `Cookie` headers are removed on a change of scheme, host, or effective port and stay removed for that redirect chain. Matching `Set-Cookie` values are selected per destination with domain/path/security and expiry checks; an explicit `Cookie` takes precedence while present. Cookies are not automatically retained between separate `fetch` calls. `credentials: "omit"` disables automatic redirect-cookie collection and forwarding. Browser origin/SameSite context is not implemented. Use `redirect: "error"` for custom signed requests or sensitive submissions.
- Native browser profiles are isolated by extension path and starting origin under `.synurart/browser_profiles/`.
- `browser submit` requires the current page URL to match the extension's load-time `SYNURA.domain` / `host_permissions`. Only unexpired, unpartitioned cookies matching that URL's host, path, and HTTPS status are submitted, including matching HttpOnly cookies. External pages can still be opened; return to an authorized page before capturing cookies. Failed capture leaves the browser open.
- `fetch()` returns a Promise at response headers. `text()`, `json()`, `arrayBuffer()`, and `dom()` return Promises and consume the body once; use `clone()` before reading for additional representations. Network errors reject with `TypeError`; host cancellation rejects with `AbortError`. HTTP error statuses resolve normally. `text()` uses UTF-8; extensions select other encodings explicitly with `TextDecoder(label).decode(await response.arrayBuffer())`. Decoder labels use the common encoding registry, with no site or language-specific runtime branches.
- Network metadata is validated and bound once when the extension is loaded. A fresh shell without a loaded extension has no network access, even if an `eval` command writes `SYNURA.domain`. Reload the extension to create a fresh VM and bind a new scope.
- A missing response header returns `null`; empty `json()` rejects with `SyntaxError`. Concurrent HTTP requests run on the native executor. CLI commands drain HTTP and crypto completions, including asynchronous view callbacks.
- `localStorage` is persisted in `.synurart/local_storage.json`, namespaced by the loaded extension path.
- `navigator.language` defaults to `en-US` and can be changed with `locale <tag>`.
- `globalThis.crypto` provides native random values/UUIDs and standard Web Crypto operations for SHA, HMAC, AES-GCM/CBC, RSA-OAEP, RSASSA-PKCS1-v1_5, RSA-PSS, ECDSA/ECDH, Ed25519/X25519, PBKDF2, and HKDF. QuickJS bindings and key lifetime management are implemented in Rust; native operations execute on a worker thread. Standard algorithm constraints and per-VM queue, input-byte, live-key, heap, stack, and execution limits apply. `subtle` methods return Promises; `eval`, extension entry points, and view callbacks complete their submitted crypto work before the command returns. See supported operations, formats, and limits in `api_reference.md`. These runtime functions add no cryptographic library bytes to an extension's 128 KiB source budget.
- `Request`, `Response`, `Headers`, `AbortController`, and `AbortSignal` are available. Request bodies accept strings, `URLSearchParams`, `ArrayBuffer`, and typed-array/DataView ranges. Encode JSON explicitly with `JSON.stringify`.
- This is a buffered Web API subset. Streams, Blob, FormData, manual redirects, browser CORS/origin policies, and host timers are not implemented. Unsupported security-sensitive request modes reject explicitly; see [API scope](api_reference.md#fetchinput-options).
- CLI view events preserve their source view across `await`: the first open replaces that view's forward branch, and nested asynchronous opens continue on the active branch. Updates alone do not prune views. Asynchronous `LOAD` callbacks are background work; their opens join the current interaction's branch, or append to the active branch when no interaction is running. They do not restore a historical callback context.
- This is a standalone `synurart` simulator, not the full Synura Rust app backend.

## Embedded Runtime Network Settings

New application hosts should depend on [`synura-runtime`](runtime/README.md) directly. The settings below are CLI-host convenience methods; they do not turn the CLI simulator into an app backend.

Rust hosts can configure `SynurartRuntime::set_timeout(milliseconds)` and `set_fetch_proxy(Some(url))`; use `set_fetch_proxy(None)` to clear the explicit proxy and restore system/environment routing, or `disable_fetch_proxy()` to force direct connections. These settings do not widen extension host permissions.

To cancel an in-flight fetch, create a `FetchCancellation::default()`, pass a clone to `set_fetch_cancellation(handle)`, and call `cancel()` on the other clone from the host thread. Supply a fresh handle for the next request. Cancellation interrupts network work; it is not a JavaScript CPU execution limit.

The shared fetch implementation and its local HTTP/isolation tests build from this repository alone. To see two independently managed VM workers, run `cargo run -p synura-runtime --example multi_vm`. The extension-facing contract is described in `api_reference.md`; no application backend source or service is required.
