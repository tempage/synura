# synurart CLI Shell Guide

`synurart` runs a Synura extension JavaScript file in a local Rust runtime simulator. Use it to load an extension, inspect view state, and emit common view events without launching the mobile app.

## Start Commands

```bash
# Recommended wrapper from this repo
make synurart EXT=extensions/basic/list.js

# Direct wrapper
./synurart -ext extensions/basic/list.js

# One-shot command
./synurart -json -ext extensions/basic/list.js -e "views"

# Build a reusable binary
make build
./bin/synurart -ext extensions/basic/list.js
```

The root `./synurart` wrapper runs an incremental Cargo build and then executes `target/debug/synurart` from this checkout.

Building the HTTP client requires a C/C++ toolchain, CMake, Perl, and libclang in addition to Rust. On Debian/Ubuntu, install `build-essential cmake perl libclang-dev pkg-config`. The first build compiles BoringSSL and takes longer than subsequent builds.

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
printf 'views\ntap index 1\nviews\nquit\n' | ./synurart -json -ext extensions/basic/list.js
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
| `submit <id> <jsonObject>` | Emit `SUBMIT`. |
| `event <id> <EVENT_ID> [jsonObject]` | Emit a custom event. |
| `timeout [duration]` | Show or set fetch timeout, for example `10s` or `500ms`. |
| `locale [tag]` | Show or set `navigator.language`, for example `ko-KR`. |
| `mapurl <url> <file>` | Map one exact fetch URL to a local file for this runtime. |
| `mapurl list` | Show fetch URL overrides. |
| `mapurl clear` | Clear fetch URL overrides. |
| `storage [local|session]` | Show storage snapshots. |
| `storage clear [local|session|all]` | Clear storage. |
| `eval <javascript>` | Evaluate JavaScript in the current runtime. |
| `proxy [url\|clear\|system]` | Show proxy mode, set an explicit URL, disable all proxies with `clear`, or restore system/environment routing with `system`. |

## Practical Workflow

1. Start with `./synurart -json -ext <ext.js> -e "views"`.
2. Read the active view from the `type=views` output.
3. Pick an action by path:
   - `/views/list`: `tap index`, `query`, `menu`, `n`
   - `/views/post`: `refresh`, `menu`, `event`
4. Re-run `views` or `view <id>` to confirm state changes.

## Notes

- `fetch` uses browser TLS/HTTP profiles when `SYNURA.bypass` is set, with the extension's request headers preserved. It does not execute page JavaScript or provide a WebView.
- Response headers support property access plus case-insensitive `get(name)` and `getAll(name)`. `entries()` returns an array of all header pairs. Multiple `Set-Cookie` values remain separate in `getAll()` and are joined with newlines for property access or `get()`.
- `fetch` follows redirects within host permissions, with a limit of 10 requests. It preserves the method/body, checks each destination, and carries matching cookies within that redirect chain. An explicit `Cookie` header takes precedence; cookies are not automatically retained between separate `fetch` calls.
- Fetch errors throw JavaScript exceptions. `text()` uses UTF-8; extensions select other encodings explicitly with `TextDecoder(label).decode(response.arrayBuffer())`. Decoder labels use the common encoding registry, with no site or language-specific runtime branches.
- Network metadata is validated and bound when the extension is loaded. In a fresh shell without a loaded extension, the first fetch binds the declared metadata. Reload the extension to change its network scope.
- `onProgress` callbacks receive recorded byte counts before fetch returns. A missing response header returns `undefined`; empty `json()` throws `SyntaxError`.
- `localStorage` is persisted in `.synurart/local_storage.json`, namespaced by the loaded extension path.
- `navigator.language` defaults to `en-US` and can be changed with `locale <tag>`.
- This is a standalone `synurart` simulator, not the full Synura Rust app backend.

## Embedded Runtime Network Settings

Rust hosts can configure `SynurartRuntime::set_timeout(milliseconds)` and `set_fetch_proxy(Some(url))`; use `set_fetch_proxy(None)` to clear the explicit proxy and restore system/environment routing, or `disable_fetch_proxy()` to force direct connections. These settings do not widen extension host permissions.

To cancel an in-flight fetch, create a `FetchCancellation::default()`, pass a clone to `set_fetch_cancellation(handle)`, and call `cancel()` on the other clone from the host thread. Supply a fresh handle for the next request. Cancellation interrupts network work; it is not a JavaScript CPU execution limit.

The fetch implementation and its local HTTP tests build from this repository alone. The extension-facing contract is described in `api_reference.md`; no application backend source or service is required.
