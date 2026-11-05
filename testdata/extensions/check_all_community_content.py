#!/usr/bin/env python3
"""Load every extension and check the content hooks it implements, offline.

Run from any directory after building synurart:
    python3 testdata/extensions/check_all_community_content.py

Extensions without community content hooks are recorded as not applicable to
these assertions. No extension or user storage is changed. Override SYNURART_BIN
to use another synurart executable.
"""
import concurrent.futures
import json
import os
from pathlib import Path
import subprocess
import tempfile

from extension_inventory import extension_paths


ROOT = Path(__file__).resolve().parents[2]
RUNTIME = Path(os.environ.get("SYNURART_BIN", ROOT / "target/debug/synurart")).resolve()

# Install this before extension initialization as well as before calling hooks.
# An API-backed comment hook sees an empty response instead of accessing a site.
OFFLINE_FETCH = """
fetch = function () {
    return {
        ok: true, status: 200,
        headers: {get: function () { return null; }},
        json: function () { return {}; },
        text: function () { return '{}'; },
        dom: function () {
            return new DOMParser().parseFromString('<html></html>', 'text/html');
        }
    };
};
"""

CONTENT_PROBE = """
var __extensionContentProbe = (function () {
    if (typeof SITE === 'undefined' || !SITE ||
        (!SITE.parseComments && !SITE.fetchPostComments && !SITE.filterPostContent)) {
        return {applicable: false};
    }
    var doc = new DOMParser().parseFromString(
        '<html><head><title>Synthetic post without replies</title></head>' +
        '<body><h1>Synthetic post without replies</h1></body></html>', 'text/html');
    var url = SITE.browserHomeUrl;
    var comments = SITE.parseComments ? SITE.parseComments(doc, url) : [];
    var fetched = SITE.fetchPostComments
        ? SITE.fetchPostComments(null, url, doc, {}, comments) : comments;
    var image = [{type: 'image', value: 'https://fixture.example/opening-post.png'}];
    var filtered = SITE.filterPostContent
        ? SITE.filterPostContent(image, url, doc, {}, null) : image;
    return {applicable: true, comments: comments, fetched: fetched, filtered: filtered};
})();
"""


def audit_extension(path):
    """Return an actionable failure string, or None on success."""
    label = str(path.relative_to(ROOT))
    try:
        bundle = OFFLINE_FETCH + path.read_text()
        bundle += "\n" + CONTENT_PROBE
        with tempfile.TemporaryDirectory(prefix="synura-extension-content-") as directory:
            script = Path(directory) / "probe.js"
            script.write_text(bundle)
            result = subprocess.run(
                [str(RUNTIME), "-json", "-no-home", "-ext", str(script),
                 "-e", "eval JSON.stringify(__extensionContentProbe)"],
                cwd=directory, text=True, capture_output=True, timeout=15,
            )
        if result.returncode:
            return label + ": runtime failed: " + result.stderr[-1500:].strip()
        output = None
        for line in result.stdout.splitlines():
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            if event.get("type") == "eval":
                output = json.loads(event["result"])
        if output is None:
            return label + ": no probe result: " + result.stdout[-1000:]
        if not output.get("applicable"):
            return False
        if output.get("comments") != []:
            return label + ": parseComments produced replies from title-only HTML"
        if output.get("fetched") != []:
            return label + ": fetchPostComments produced replies from empty responses"
        filtered = output.get("filtered")
        # A filter may reparse the supplied DOM and return no content because
        # this document has no post body. It must not invent a replacement.
        if not isinstance(filtered, list) or (filtered and not any(
            isinstance(item, dict)
            and item.get("type") == "image"
            and item.get("value") == "https://fixture.example/opening-post.png"
            for item in filtered
        )):
            return label + ": filterPostContent fabricated replacement content"
        return None
    except Exception as error:
        return label + ": " + str(error)


def main():
    if not RUNTIME.is_file():
        raise SystemExit("Build synurart first: cargo build -p synurart")
    extensions = extension_paths()
    if not extensions:
        raise SystemExit("No community sources found")
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(audit_extension, extensions))
    failures = [failure for failure in results if failure]
    if failures:
        raise SystemExit("\n".join(failures))
    applicable = sum(result is not False for result in results)
    print("Loaded " + str(len(extensions)) + " extensions; content hooks passed for "
          + str(applicable) + "; " + str(len(extensions) - applicable) + " have no applicable hooks.")


if __name__ == "__main__":
    main()
