# synurart CLI Shell Guide (AI-Friendly)

This document is a practical command reference for the Synura runtime shell (`cmd/synurart`), optimized for AI agents and scripted terminal workflows.

## What It Is

`synurart` runs a Synura extension JavaScript file in a local Go-based runtime and lets you:

- Load an extension
- Open and inspect view stack state
- Emit view events (`CLICK`, `QUERY`, `SUBMIT`, etc.)
- Simulate lifecycle calls (`home`, `deeplink`, `resume`)
- Inspect storage and execute ad-hoc JS

It is the fastest way to validate extension behavior without launching the mobile app.

`localStorage` is persisted automatically in `.synurart/local_storage.json`, namespaced by the loaded extension's absolute path. Each extension reload restores its last saved `localStorage` snapshot before the JS file is evaluated.

The runtime exposes the same browser-like `navigator.language` global as Synura extensions. In `synurart`, it defaults to `en-US` and can be changed with `locale <tag>`.

## Network Host Rule

Extension network requests must stay on `SYNURA.domain`.

- `synurart` and the real Synura app follow the same rule.
- Do not call API hosts, CDN hosts, or any other host directly from extension code if the host is different from `SYNURA.domain`.
- If a site's web app uses cross-host APIs, that does not make those calls valid for Synura extensions.
- In practice, extension `fetch(...)` URLs should be `https://` + `SYNURA.domain` + `...`.

## Start Commands

```bash
# Recommended wrapper from this repo
make synurart

# Start with an extension and auto-call home()
make synurart EXT=extensions/basic/list.js

# Direct command form
go run ./cmd/synurart -ext extensions/basic/list.js
```

## CLI Flags

| Flag | Meaning |
|---|---|
| `-ext <path>` | Path to extension JS file. |
| `-no-home` | Load extension but do not call `SYNURA.main.home()`. |
| `-e "<command>"` | Execute one shell command and exit. |
| `-json` | Emit machine-friendly JSON (NDJSON style) for automation. |

Notes:

- If `-ext` is omitted, first positional arg is treated as extension path.
- `-e` is single-command mode. It does not enter interactive REPL.

## REPL Behavior

- Prompt is `synurart> `.
- Empty lines are ignored.
- `quit`, `q`, or `exit` terminates.
- In TTY mode, tab completion is enabled.
- In non-TTY mode (piped stdin), prompt text is still printed before each input line.

## Output Contract (Important for AI)

When `-json` is enabled, two output channels are used:

- `stdout`: command results from the shell (`views`, `render`, `timeout`, etc.)
- `stderr`: runtime telemetry (`open`, `update`, `event`, `console`, `fetch`, runtime `error`)

If your environment merges streams, parse line-by-line JSON and ignore optional `synurart> ` prefixes.

## Command Reference

| Command | Effect |
|---|---|
| `help` / `h` / `?` | Show command help. |
| `load <path> [--no-home]` | Reset runtime, load extension, optional `home()` call. |
| `timeout [duration]` | Show or set fetch timeout (`10s`, `500ms`, `2.5`). |
| `locale [tag]` | Show or set `navigator.language` (`ko-KR`, `pt-BR`, `en-US`). |
| `views` / `ls` | Show stack summary and active view. |
| `v [id]` | Show stack summary, or show one view JSON + render when `id` is given. |
| `view <id>` | Show one view JSON + render output. |
| `render [id]` | Render one view (defaults to top view). |
| `home` | Call `SYNURA.main.home()`. |
| `deeplink <url>` | Call `SYNURA.main.deeplink(url)`. |
| `resume <id> [jsonObject]` | Call `SYNURA.main.resume(id, context)`. |
| `s <n> [id]` | Alias for `tap index <n> [id]`. |
| `tap` or `click` | Same command; `click` is an alias of `tap`. |
| `tap title <text> [id]` | Emit `CLICK` by title match in list contents. |
| `tap author <name> [id]` | Emit `AUTHOR_CLICK` by author match (list/post). |
| `tap category <name> [id]` | Emit `CATEGORY_CLICK` by category match (list/post). |
| `tap index <n> [id]` | Emit `CLICK` by 1-based list index. |
| `itemmenu <id> <label> [index]` | Emit `ITEM_MENU_CLICK` using list item/comment data. |
| `reorder <id> <fromIndex> <toIndex>` | Emit `REORDER` with `_index` and `_newIndex`. |
| `r [id]` | Alias for `refresh <id>`; defaults to the top view. |
| `refresh <id>` | Emit `REFRESH`. |
| `n [id]` | Alias for `event <id> SCROLL_TO_END`; defaults to the top view. |
| `c [id]` | Alias for `close <id>`; defaults to the top view. |
| `menu <id> <label>` | Emit `MENU_CLICK` with `{"menu": "<label>"}`. |
| `query <id> <text>` | Emit `QUERY` with `{"query": "<text>"}`. |
| `submit <id> <jsonObject>` | Emit `SUBMIT` with object payload. |
| `event <id> <EVENT_ID> [jsonObject]` | Emit custom event (event ID is uppercased). |
| `close <id>` | Close view by ID (`synura.close`). |
| `storage [local|session]` | Print storage snapshot(s). |
| `storage clear [local|session|all]` | Clear storage. `local` is persisted to disk immediately. |
| `eval <javascript>` | Run JS directly in runtime VM. |
| `quit` / `q` / `exit` | Exit shell. |

## JSON Event Types You May See

### Shell result objects (stdout, `-json`)

- `{"type":"help","commands":[...]}`
- `{"type":"views","views":[...],"activeView":{"viewId":1,"path":"...","models":{...},"styles":{...},"rendered":{...}}}`
- `{"type":"view","viewId":1,"path":"...","data":{...},"rendered":{...}}`
- `{"type":"render","viewId":1,"path":"...","models":{...},"styles":{...},"rendered":{...}}`
- `{"type":"timeout","timeout":"10s","seconds":10}`
- `{"type":"locale","locale":"ko-KR"}`
- `{"type":"storage","local":{...},"session":{...}}`
- `{"type":"storage_cleared","local":true,"session":false}`
- `{"type":"eval","result":...}`
- `{"type":"ok"}`

### Runtime telemetry (stderr, `-json`)

- `{"type":"open","viewId":1,"path":"/views/list"}`
- `{"type":"update","viewId":1,"diff":{...}}`
- `{"type":"close","viewId":1}`
- `{"type":"event","viewId":1,"eventId":"CLICK","data":{...}}`
- `{"type":"event_done","viewId":1,"eventId":"QUERY","depth":1,"totalMs":182,"backendMs":41,"backendTime":"41ms","fetchMs":141,"fetchTime":"141ms","fetchCount":1,"fetchLogicMs":18,"fetchTotalMs":159,"exclusiveTime":"182ms"}`
- `{"type":"fetch","method":"GET","url":"...","status":200,"totalMs":141,"logicMs":18,"logicTime":"18ms","networkMs":123,"networkTime":"123ms"}`
- `{"type":"console","level":"log","message":"..."}`
- `{"type":"error","message":"..."}`

In text mode, callback completion now prints lines like:

- `[EVENT←EXT] #1 QUERY done (total=182ms, b=41ms, f=141ms, fetches=1, depth=1)`

`event_done` is exclusive per callback. If a parent event opens another view and triggers a nested `LOAD`, the nested `LOAD` receives its own timing line and the parent line does not double-count that child callback's fetch time.

## Available Events By View Path

This list is aligned with the current view/dialog docs in this repository.

| View path | Available events |
|---|---|
| `/views/list` | `REFRESH`, `SCROLL_TO_END` (when `pagination: true`), `CLICK`, `ITEM_MENU_CLICK`, `MENU_CLICK`, `REORDER`, `AUTHOR_CLICK` (when `authorClickable: true`), `CATEGORY_CLICK` (when `categoryClickable: true`), `QUERY` (when `appbar: "query"`). |
| `/views/post` | `REFRESH`, `SCROLL_TO_END`, `MENU_CLICK`, `AUTHOR_CLICK` (when author click is enabled), `CATEGORY_CLICK` (when category click is enabled), `SUBMIT` (buttons), `ITEM_MENU_CLICK` (comment item menus). |
| `/views/chat` | `SUBMIT`, `MENU_CLICK`. |
| `/views/markdown` | `REFRESH`, `SCROLL_TO_END`, `MENU_CLICK`, `CLICK` (link click). |
| `/views/source` | `REFRESH`, `SCROLL_TO_END`. |
| `/views/settings` | `SUBMIT`. |
| `/views/editor` | `SUBMIT`, `CLOSE`. |
| `/views/browser` | `SUBMIT`, `CLOSE`. |
| `/views/simple` | No specific view events (navigation/back only). |
| `/dialogs/input` | `SUBMIT`, `CLOSE` (when close button is enabled). |
| `/dialogs/confirmation` | `SUBMIT`, `CLOSE` (dismiss/close interaction). |

Notes:

- `LOAD` is a lifecycle event commonly observed when a view is opened/connected.
- You can always send custom events with: `event <id> <EVENT_ID> [jsonObject]`.

## High-Confidence Agent Workflow

1. Start with JSON mode:
   - `go run ./cmd/synurart -json -ext <ext.js> -e "views"`
2. Read active view from `type=views`.
3. Pick action by path:
   - `/views/list`: `tap index`, `query`, `menu`, `event ... SCROLL_TO_END`
   - `/views/post`: `refresh`, custom `event`
4. Re-run `views` to confirm state changes.
5. Use `view <id>` or `render <id>` for detailed inspection.

## Examples

```bash
# 1) One-shot introspection (best for simple automation)
go run ./cmd/synurart -json -ext extensions/basic/list.js -e "views"

# 2) Interactive human flow
make synurart EXT=extensions/basic/list.js
# then type:
# views
# tap index 1
# views

# 3) Piped multi-command flow (non-TTY)
printf 'views\ntap index 1\nviews\nquit\n' | \
  go run ./cmd/synurart -json -ext extensions/basic/list.js
```

## Input Parsing Rules

- Quote text with spaces: `query 1 "hello world"`
- Pass JSON objects as one argument: `submit 3 '{"q":"abc","page":2}'`
- `resume`, `event` optional data, and `submit` require JSON object shape (not array).

## Error and Exit Behavior

- Startup or `-e` command failures exit with code `1`.
- In REPL mode, command errors are printed but REPL continues.
- Unknown command message: `unknown command: <cmd> (type 'help')`.

## Practical Notes

- `load` creates a fresh runtime (view IDs restart from `1`).
- `timeout` and `locale` values are preserved when reloading via `load`.
- `render` and `tap ... [id]` default to the current top view when ID is omitted.
- Pretty render output is specialized for: list, post, chat, browser, markdown, source, settings, editor, simple, input dialog, confirmation dialog.
