#!/usr/bin/env python3
"""Verify configured extension home/board URLs against synurart's fetch scope.

Run after building synurart:
    python3 testdata/extensions/check_community_scopes.py

Loads source bundles in temporary storage, maps every tested URL to a local
fixture, and uses an unavailable localhost proxy to prevent external transport
if a fixture mapping is missed. SYNURART_BIN can override the runtime binary.
"""
import concurrent.futures
import json
import os
from pathlib import Path
import subprocess
import tempfile

from extension_inventory import extension_paths, source_bundle


ROOT = Path(__file__).resolve().parents[2]
RUNTIME = Path(os.environ.get("SYNURART_BIN", ROOT / "target/debug/synurart")).resolve()
METADATA = """JSON.stringify((function () {
    var site = typeof SITE === 'undefined' ? {} : SITE;
    var home = site.browserHomeUrl || (SYNURA.domain ? 'https://' + SYNURA.domain + '/' : '');
    var urls = [{url: home}].concat((site.boards || []).map(function (board) {
        var url = board.url;
        if (!url && site.buildBoardUrlFromId) url = site.buildBoardUrlFromId(board.id);
        return {url: url};
    })).filter(function (entry) { return !!entry.url; });
    return {urls: urls.map(function (entry) {
        return {url: entry.url, normalized: typeof normalizeUrl === 'function'
            ? normalizeUrl(entry.url) : entry.url};
    })};
})())"""


def quote(value):
    # The CLI splits quoted arguments but does not decode JSON Unicode escapes.
    return json.dumps(value, ensure_ascii=False)


def eval_command(source):
    # Keep commands on one REPL line; its argument splitter does not decode \n.
    return "eval " + quote(" ".join(source.splitlines()))


def run_commands(script, directory, commands):
    result = subprocess.run(
        [str(RUNTIME), "-json", "-no-home", "-proxy", "http://127.0.0.1:9",
         "-ext", str(script)],
        input="\n".join(commands + ["quit"]) + "\n",
        cwd=directory, text=True, capture_output=True, timeout=20,
    )
    if result.returncode:
        raise RuntimeError(result.stderr[-1500:].strip())
    outputs = []
    for line in result.stdout.splitlines():
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        if event.get("type") == "error":
            raise RuntimeError(event.get("message", str(event)))
        if event.get("type") == "eval":
            outputs.append(json.loads(event["result"]))
    if len(outputs) != 1:
        raise RuntimeError("expected one evaluation result, got " + str(len(outputs)))
    return outputs[0]


def audit_extension(path):
    label = str(path.relative_to(ROOT))
    try:
        with tempfile.TemporaryDirectory(prefix="synura-community-scopes-") as directory:
            script = Path(directory) / "extension.js"
            fixture = Path(directory) / "fixture.html"
            script.write_text(source_bundle(path))
            fixture.write_text("<html>offline mapped response</html>")
            metadata = run_commands(script, directory, [eval_command(METADATA)])
            urls = sorted({
                url for entry in metadata["urls"]
                for url in (entry["url"], entry["normalized"])
                if url and url.startswith(('https://', 'http://'))
            })
            if not urls:
                return 0, []  # Local view examples need no network scope.
            commands = ["mapurl " + quote(url) + " " + quote(str(fixture)) for url in urls]
            # Keep only one request pending per VM. Fetch resolves at headers;
            # consume the body too so its pending-request slot is released.
            expression = "(async()=>{var results = []; for (var url of " + quote(urls) + """) {
                    try {
                        var response = await fetch(url);
                        await response.arrayBuffer();
                        results.push({url: url, status: response.status});
                    } catch (error) {
                        results.push({url: url, error: String(error)});
                    }
                }
                return JSON.stringify(results);
            })()"""
            results = run_commands(script, directory, commands + [eval_command(expression)])
        errors = [
            label + ": " + result["url"] + ": "
            + result.get("error", "unexpected status " + str(result.get("status")))
            for result in results if result.get("status") != 200
        ]
        return len(urls), errors
    except Exception as error:
        return 0, [label + ": " + str(error)]


def main():
    if not RUNTIME.is_file():
        raise SystemExit("Build synurart first: cargo build -p synurart")
    extensions = extension_paths()
    if not extensions:
        raise SystemExit("No community sources found")
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(audit_extension, extensions))
    failures = [error for _, errors in results for error in errors]
    if failures:
        raise SystemExit("\n".join(failures))
    print("Fetch scopes passed for " + str(len(extensions)) + " extension bundles / "
          + str(sum(count for count, _ in results)) + " configured URLs.")


if __name__ == "__main__":
    main()
