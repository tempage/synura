"""Discover every distributable extension and its Makefile compilation inputs."""
from pathlib import Path
import shlex
import subprocess

ROOT = Path(__file__).resolve().parents[2]


def extension_paths():
    return sorted((ROOT / 'extensions').rglob('*.js'))


def compiler_command(path, destination):
    if not path.with_suffix('.ts').is_file():
        return None
    plan = subprocess.run(
        ['make', '-s', '-n', '-B', '-C', str(ROOT / 'extensions'),
         str(path.relative_to(ROOT / 'extensions'))],
        text=True, capture_output=True, check=True,
    )
    for line in plan.stdout.splitlines():
        args = shlex.split(line)
        if '--outFile' in args and any(arg.endswith('.ts') for arg in args):
            args[args.index('--outFile') + 1] = str(destination)
            return args
    raise RuntimeError('No compiler recipe for ' + str(path))


def source_bundle(path):
    command = compiler_command(path, path)
    if command is None:
        return path.read_text()
    sources = [ROOT / 'extensions' / value for value in command if value.endswith('.ts')]
    return '\n'.join(source.read_text() for source in sources)
