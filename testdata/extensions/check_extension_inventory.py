#!/usr/bin/env python3
"""Load every extension; optionally compile every TypeScript entry in temporary storage.

This checks packaging and entry points, not live parsing or visual correctness.
"""
import argparse
import concurrent.futures
import json
import os
from pathlib import Path
import subprocess
import tempfile

from extension_inventory import ROOT, compiler_command, extension_paths

RUNTIME = Path(os.environ.get('SYNURART_BIN', ROOT / 'target/debug/synurart')).resolve()
PROBE = 'JSON.stringify({name:SYNURA.name,version:SYNURA.version,domain:SYNURA.domain,home:typeof SYNURA.main.home,router:typeof SYNURA.main.router,permissions:SYNURA.host_permissions||[]})'


def load(script, directory):
    result = subprocess.run(
        [str(RUNTIME), '-json', '-no-home', '-proxy', 'http://127.0.0.1:9',
         '-ext', str(script), '-e', 'eval ' + PROBE],
        cwd=directory, text=True, capture_output=True, timeout=15,
    )
    events = [json.loads(line) for line in result.stdout.splitlines() if line.startswith('{')]
    errors = [event for event in events if event.get('type') == 'error']
    if result.returncode or errors:
        raise RuntimeError(str(errors) + result.stderr[-1500:])
    return json.loads(next(event['result'] for event in events if event.get('type') == 'eval'))


def check(path, compile_source=False):
    record = {'path': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size}
    try:
        with tempfile.TemporaryDirectory(prefix='synura-inventory-') as directory:
            record['metadata'] = load(path, directory)
            record['load'] = 'pass'
            if compile_source:
                destination = Path(directory) / 'source.js'
                command = compiler_command(path, destination)
                if command:
                    result = subprocess.run(command, cwd=ROOT / 'extensions',
                                            capture_output=True, text=True, timeout=90)
                    if result.returncode:
                        raise RuntimeError(result.stdout[-2000:] + result.stderr[-2000:])
                    source_metadata = load(destination, directory)
                    record['compile'] = 'pass'
                    record['metadata_matches_source'] = source_metadata == record['metadata']
                    if not record['metadata_matches_source']:
                        record['source_metadata'] = source_metadata
                        raise RuntimeError('Packaged metadata differs from compiled source metadata')
                else:
                    record['compile'] = 'javascript entry'
        record['status'] = 'pass'
    except Exception as error:
        record.update(status='fail', error=str(error))
    return record


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--compile', action='store_true')
    parser.add_argument('--json', type=Path)
    args = parser.parse_args()
    paths = extension_paths()
    if not paths:
        raise SystemExit('No extension entries found')
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        records = list(pool.map(lambda path: check(path, args.compile), paths))
    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
    failed = [record for record in records if record['status'] == 'fail']
    for record in failed:
        print(record['path'] + ': ' + record['error'])
    print(f'Extension inventory: {len(records)} checked, {len(records) - len(failed)} passed, {len(failed)} failed.')
    if failed:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
