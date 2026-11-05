"""Exercise shared view lifecycle APIs with the repository's handwritten examples.

Fixtures contain only invented values. Transport is mapped locally or blocked;
no captured pages, user data, or diagnostic logs are used.
"""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
RUNTIME = Path(os.environ.get('SYNURART_BIN', ROOT / 'target/debug/synurart')).resolve()


def quote(value):
    return json.dumps(value, ensure_ascii=False)


class ViewLifecycleTests(unittest.TestCase):
    def run_cli(self, script, commands, directory):
        result = subprocess.run(
            [str(RUNTIME), '-json', '-no-home', '-proxy', 'http://127.0.0.1:9', '-ext', str(script)],
            input='\n'.join(commands + ['quit']) + '\n', cwd=directory,
            capture_output=True, text=True, timeout=25, check=True,
        )
        events = [json.loads(line) for line in result.stdout.splitlines() if line.startswith('{')]
        self.assertFalse([event for event in events if event.get('type') == 'error'], result.stdout)
        return events

    def example(self, name, commands):
        with tempfile.TemporaryDirectory(prefix='synura-view-event-') as directory:
            return self.run_cli(ROOT / 'extensions/basic' / (name + '.js'), ['home'] + commands, directory)

    def test_list_search_opens_query_appbar(self):
        events = self.example('list', ['menu 1 Search', 'views'])
        view = [event['activeView'] for event in events if event.get('activeView')][-1]
        self.assertEqual(view['styles']['appbar']['type'], 'query')
        self.assertTrue(view['styles']['reorderable'])

    def test_post_resume_handles_menu_and_refresh(self):
        commands = ['menu 1 "Option 1"', 'resume 1', 'menu 1 "Option 2"', 'views',
                    'eval ' + quote('synura.update(1,{styles:{title:"Stale title"},models:{content:[]}})'), 'refresh 1', 'views']
        events = self.example('post', commands)
        views = [event['activeView'] for event in events if event.get('activeView')]
        self.assertEqual(views[-1]['models']['snackbar']['message'], 'You clicked Option 2')
        self.assertEqual(views[-1]['styles']['title'], 'Example Post Title')
        self.assertEqual(len(views[-1]['models']['content']['details']), 4)

    def test_mock_home_and_resume_connect_events(self):
        with tempfile.TemporaryDirectory(prefix='synura-mock-events-') as directory:
            fixture = Path(directory) / 'get.json'
            fixture.write_text('{"query":{"foo":"bar"},"cookies":{"session_id":"fixture"}}')
            commands = ['proxy http://127.0.0.1:9', 'mapurl "http://localhost:8080/get?foo=bar&baz=qux" ' + quote(str(fixture)),
                        'home', 'tap index 4 1', 'views', 'tap index 1 1',
                        'submit 2 ' + quote(json.dumps({'cookies': 'session_id=fixture', 'url': 'http://localhost:8080/login'})),
                        'resume 1', 'tap index 4 1', 'views', 'tap index 2 1',
                        'submit 3 ' + quote(json.dumps({'cookies': '', 'url': 'http://localhost:8080/logout'})), 'tap index 10 1', 'views']
            events = self.run_cli(ROOT / 'testdata/mock_server/synura.js', commands, directory)
        messages = [event['activeView']['models'].get('snackbar', {}).get('message', '') for event in events if event.get('activeView')]
        self.assertIn('Query OK. ', messages, 'First click must work before resume')
        self.assertIn('Query OK. Cookie OK.', messages)
        self.assertEqual(messages[-1], 'No cookie in localStorage')

    def test_browser_submit_redacts_cookie_logs_but_preserves_callback_and_storage(self):
        cookie = 'session_cookie=synthetic-browser-secret'
        url = 'https://example.test/login'
        source = '''var received;
synura.open({view:"/views/browser",models:{url:"https://example.test/login"}}, {}, function(event) {
    if (event.eventId === "SUBMIT") {
        received = event.data;
        localStorage.setItem("browser_cookie", event.data.cookies);
    }
});
'''
        verification = '({callbackMatches:received.cookies===' + quote(cookie)
        verification += ',storageMatches:localStorage.getItem("browser_cookie")===' + quote(cookie)
        verification += ',url:received.url})'
        with tempfile.TemporaryDirectory(prefix='synura-browser-log-') as directory:
            script = Path(directory) / 'extension.js'
            script.write_text(source)
            result = subprocess.run(
                [str(RUNTIME), '-json', '-no-home', '-proxy', 'http://127.0.0.1:9', '-ext', str(script)],
                input='submit 1 ' + quote(json.dumps({'cookies': cookie, 'url': url}))
                + '\neval ' + quote(verification) + '\nquit\n',
                cwd=directory, capture_output=True, text=True, timeout=25, check=True,
            )
        self.assertNotIn(cookie, result.stdout + result.stderr)
        logs = [json.loads(line) for line in result.stderr.splitlines() if line.startswith('{')]
        event = next(log for log in logs if log.get('type') == 'event' and log.get('eventId') == 'SUBMIT')
        self.assertEqual(event['data'], {'cookies': '[REDACTED]', 'url': url})
        events = [json.loads(line) for line in result.stdout.splitlines() if line.startswith('{')]
        self.assertFalse([event for event in events if event.get('type') == 'error'], result.stdout)
        verified = next(event['result'] for event in events if event.get('type') == 'eval')
        self.assertEqual(verified, {'callbackMatches': True, 'storageMatches': True, 'url': url})


if __name__ == '__main__':
    unittest.main()
