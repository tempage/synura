"""Offline regression tests for the extension audit scripts.

Requires a built synurart, or SYNURART_BIN pointing to one. All extension
fixtures and storage are temporary; native fetches use local mapped responses.
"""
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import check_all_community_content as content
import check_community_scopes as scopes


@unittest.skipUnless(scopes.RUNTIME.is_file(), "Build synurart first")
class ExtensionAuditTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory(prefix="synura-audit-test-")
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        for module in (content, scopes):
            root_patch = patch.object(module, "ROOT", self.root)
            root_patch.start()
            self.addCleanup(root_patch.stop)

    def extension(self, source):
        path = self.root / "extension.js"
        path.write_text("var SYNURA = {domain: 'fixture.example'};\n" + source)
        return path

    def test_more_than_32_urls_are_checked_and_real_scope_errors_remain(self):
        urls = ["https://fixture.example/board/" + str(i) for i in range(65)]
        urls.insert(20, "https://outside.example/forbidden")
        path = self.extension(
            "var SITE = {browserHomeUrl: 'https://fixture.example/', boards: "
            + json.dumps([{"url": url} for url in urls]) + "};"
        )
        count, errors = scopes.audit_extension(path)
        self.assertEqual(count, 67)
        self.assertEqual(len(errors), 1, errors)
        self.assertIn("https://outside.example/forbidden", errors[0])
        self.assertNotIn("Too many pending fetch requests", errors[0])

    def test_scope_probe_reports_body_failure_after_successful_headers(self):
        path = self.extension("""
var SITE = {browserHomeUrl: 'https://fixture.example/'};
fetch = async function () {
    return {status: 200, arrayBuffer: async function () {
        throw new Error('synthetic body failure');
    }};
};
""")
        count, errors = scopes.audit_extension(path)
        self.assertEqual(count, 1)
        self.assertEqual(len(errors), 1, errors)
        self.assertIn("synthetic body failure", errors[0])

    def test_content_probe_awaits_hooks_and_provides_promise_body_readers(self):
        path = self.extension("""
var SITE = {
    browserHomeUrl: 'https://fixture.example/',
    parseComments: function () {
        return fetch(SITE.browserHomeUrl).then(response => response.text())
            .then(text => {
                if (text !== '{}') throw new Error('unexpected offline body');
                return [];
            });
    },
    fetchPostComments: async function (match, url, doc, page, comments) {
        if (!Array.isArray(comments)) throw new Error('comments were not awaited');
        var data = await fetch(url).then(response => response.json());
        if (Object.keys(data).length) throw new Error('unexpected offline JSON');
        return comments;
    },
    filterPostContent: function (image, url) {
        return fetch(url).then(response => response.arrayBuffer()).then(bytes => {
            if (bytes.byteLength !== 2) throw new Error('unexpected offline bytes');
            return image;
        });
    }
};
""")
        self.assertIsNone(content.audit_extension(path))

    def test_rejected_content_hooks_are_failures(self):
        for hook in ("parseComments", "fetchPostComments", "filterPostContent"):
            with self.subTest(hook=hook):
                marker = "synthetic rejection in " + hook
                path = self.extension(
                    "var SITE = {browserHomeUrl: 'https://fixture.example/', "
                    + hook + ": async function () { await Promise.resolve(); "
                    + "throw new Error(" + json.dumps(marker) + "); }};"
                )
                failure = content.audit_extension(path)
                self.assertIsInstance(failure, str)
                self.assertIn(marker, failure)

    def test_missing_applicable_flag_is_not_silently_skipped(self):
        path = self.extension("")
        with patch.object(content, "CONTENT_PROBE", """
var __extensionContentProbe = Promise.resolve({});
"""):
            failure = content.audit_extension(path)
        self.assertIsInstance(failure, str)
        self.assertIn("invalid probe result", failure)

    def test_extensions_without_content_hooks_are_explicitly_not_applicable(self):
        self.assertIs(content.audit_extension(self.extension("")), False)


if __name__ == "__main__":
    unittest.main()
