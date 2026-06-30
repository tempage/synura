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

## CLI Flags

| Flag | Meaning |
|---|---|
| `-ext <path>` | Path to the extension JavaScript file. |
| `-no-home` | Load the extension but do not call `SYNURA.main.home()`. |
| `-e "<command>"` | Execute one shell command and exit. |
| `-json` | Emit command result objects as JSON where supported. Runtime console logs may still be text. |

The first positional argument is also treated as the extension path when `-ext` is omitted.

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

## Practical Workflow

1. Start with `./synurart -json -ext <ext.js> -e "views"`.
2. Read the active view from the `type=views` output.
3. Pick an action by path:
   - `/views/list`: `tap index`, `query`, `menu`, `n`
   - `/views/post`: `refresh`, `menu`, `event`
4. Re-run `views` or `view <id>` to confirm state changes.

## Notes

- `localStorage` is persisted in `.synurart/local_storage.json`, namespaced by the loaded extension path.
- `navigator.language` defaults to `en-US` and can be changed with `locale <tag>`.
- This is a standalone `synurart` simulator, not the full Synura Rust app backend.
