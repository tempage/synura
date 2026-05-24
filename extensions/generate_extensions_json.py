import os
import json
import re
import argparse
from collections import defaultdict
from decimal import Decimal, InvalidOperation

# Configuration
# Get the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STABLE_OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'extensions.json')
TEST_OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'test.json')
DEFAULT_BASE_URL = 'https://raw.githubusercontent.com/tempage/synura/refs/heads/main/extensions/'
DEFAULT_REPOSITORY_VERSION = Decimal('1.0')
REPOSITORY_VERSION_STEP = Decimal('0.1')

# Stable is an explicit allowlist. New/community extensions stay in test.json
# until they are promoted here.
STABLE_EXTENSION_PATHS = (
    'youtube.js',
    'basic/list.js',
    'basic/source.js',
    'basic/input_dialog.js',
    'basic/markdown.js',
    'basic/simple.js',
    'basic/settings.js',
    'basic/chat.js',
    'basic/browser.js',
    'basic/editor.js',
    'basic/wikipedia_featured.js',
    'basic/confirmation_dialog.js',
    'basic/router.js',
    'basic/hello_world.js',
    'basic/post.js',
    'en_US/reddit.js',
    'en_US/hackernews.js',
    'ko_KR/fmkorea.js',
    'ko_KR/ppomppu.js',
    'ko_KR/pann.js',
    'ko_KR/damoang.js',
    'ko_KR/ruliweb.js',
    'ko_KR/dcinside.js',
    'ko_KR/arca.js',
    'ko_KR/geeknews.js',
    'ko_KR/clien.js',
    'ko_KR/mlbpark.js',
    'ko_KR/inven.js',
    'ko_KR/theqoo.js',
)

# Files/folders to ignore when scanning
IGNORE_FILES = {'extensions.json', 'test.json', 'generate_extensions_json.py', 'README.md'}
IGNORE_DIRS = {'.git', '__pycache__', 'node_modules'}

def extract_object_literal(content, start_idx):
    """
    Extract a JS object literal starting at the given index.
    """
    if start_idx < 0 or start_idx >= len(content) or content[start_idx] != '{':
        return None

    depth = 0
    in_string = None
    escaped = False

    for idx in range(start_idx, len(content)):
        char = content[idx]

        if in_string is not None:
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == in_string:
                in_string = None
            continue

        if char in {'"', "'", '`'}:
            in_string = char
            continue

        if char == '{':
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0:
                return content[start_idx:idx + 1]

    return None

def extract_synura_block(content):
    """
    Find the object literal assigned to SYNURA/synura in minified or formatted JS.
    """
    match = re.search(r'(?<![\w$])(?:SYNURA|synura)\s*=', content)
    if not match:
        return None

    value_idx = match.end()
    while value_idx < len(content) and content[value_idx].isspace():
        value_idx += 1

    if value_idx >= len(content) or content[value_idx] != '{':
        return None

    return extract_object_literal(content, value_idx)

def extract_metadata(file_path):
    """
    Extracts the SYNURA object from a JS file using regex.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        synura_block = extract_synura_block(content)
        if synura_block:
            def get_field(name):
                # Matches: name: "value" or name: 'value' or name: 123
                field_match = re.search(
                    r'\b' + name + r'\s*:\s*["\']([^"\']*)["\']|' +
                    r'\b' + name + r'\s*:\s*([\d\.]+)',
                    synura_block
                )
                if field_match:
                    if field_match.group(1) is not None:
                        return field_match.group(1)  # String value
                    if field_match.group(2) is not None:
                        return field_match.group(2)  # Number value
                return None
            
            def get_array_field(name):
                # Matches: tags: ["tag1", "tag2"] or tags: ['tag1', 'tag2']
                array_match = re.search(
                    r'\b' + name + r'\s*:\s*\[([^\]]*)\]',
                    synura_block
                )
                if array_match:
                    array_content = array_match.group(1)
                    # Extract strings from the array
                    items = re.findall(r'["\']([^"\']+)["\']', array_content)
                    return items if items else None
                return None

            metadata = {
                'name': get_field('name'),
                'version': get_field('version'),
                'description': get_field('description'),
                'domain': get_field('domain'),
                'author': get_field('author'),
                'api': get_field('api'),
                'license': get_field('license'),
                'icon': get_field('icon'),
                'locale': get_field('locale'),
                'tags': get_array_field('tags')
            }
            return metadata
        return None
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def build_extension_entry(meta, rel_path, base_url):
    """
    Build a repository entry from extracted metadata.
    """
    if not meta or not meta.get('name'):
        return None

    try:
        version_val = float(meta.get('version', 0.0))
    except ValueError:
        version_val = 0.0

    entry = {
        'name': meta['name'],
        'description': meta.get('description', ''),
        'version': version_val,
        'url': base_url + rel_path.replace(os.sep, '/'),
        'api': int(meta.get('api', 0) or 0)
    }

    if meta.get('domain'):
        entry['domain'] = meta['domain']
    if meta.get('author'):
        entry['author'] = meta['author']
    if meta.get('icon'):
        entry['icon'] = meta['icon']
    if meta.get('locale'):
        entry['locale'] = meta['locale']
    if meta.get('tags'):
        entry['tags'] = meta['tags']

    return entry

def collect_extension_entries(dir_path, base_dir, base_url):
    """
    Scan a directory for JS extensions and return repository entries.
    """
    extensions = []

    for file in os.listdir(dir_path):
        if file in IGNORE_FILES or not file.endswith('.js'):
            continue

        file_path = os.path.join(dir_path, file)
        if not os.path.isfile(file_path):
            continue

        rel_path = os.path.relpath(file_path, base_dir)
        print(f"Processing: {rel_path}")

        meta = extract_metadata(file_path)
        entry = build_extension_entry(meta, rel_path, base_url)
        if entry:
            extensions.append(entry)

    return extensions

def next_repository_version(output_file):
    """
    Read the current top-level repository version and bump it by 0.1.
    """
    current_version = DEFAULT_REPOSITORY_VERSION

    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing = json.load(f)
            raw_version = existing.get('version')
            if raw_version is not None:
                current_version = Decimal(str(raw_version))
        except (OSError, json.JSONDecodeError, InvalidOperation, TypeError, ValueError):
            current_version = DEFAULT_REPOSITORY_VERSION

    next_version = current_version + REPOSITORY_VERSION_STEP
    return float(next_version.quantize(REPOSITORY_VERSION_STEP))

def stable_extension_entries_by_path(root_extensions, extensions_by_subdir, base_url):
    """
    Return stable entries keyed by their relative .js path.
    """
    entries_by_path = {}
    all_extensions = list(root_extensions)
    for extensions in extensions_by_subdir.values():
        all_extensions.extend(extensions)

    for entry in all_extensions:
        url = entry.get('url', '')
        if not url.startswith(base_url):
            continue
        rel_path = url[len(base_url):]
        entries_by_path[rel_path] = entry

    stable_entries_by_path = {}
    missing_paths = []
    for rel_path in STABLE_EXTENSION_PATHS:
        entry = entries_by_path.get(rel_path)
        if entry:
            stable_entries_by_path[rel_path] = entry
        else:
            missing_paths.append(rel_path)

    if missing_paths:
        print("Warning: stable allowlist paths missing:")
        for rel_path in missing_paths:
            print(f"  - {rel_path}")

    return stable_entries_by_path

def stable_entries_for_subdir(subdir, stable_entries_by_path):
    prefix = f'{subdir}/'
    stable_paths = [path for path in STABLE_EXTENSION_PATHS if path.startswith(prefix)]
    return [stable_entries_by_path[path] for path in stable_paths if path in stable_entries_by_path]

def stable_root_entries(stable_entries_by_path):
    stable_paths = [path for path in STABLE_EXTENSION_PATHS if '/' not in path]
    return [stable_entries_by_path[path] for path in stable_paths if path in stable_entries_by_path]

def build_repository_data(name, description, version, extensions=None, includes=None):
    """
    Build a top-level repository JSON object.
    """
    repo_data = {
        "name": name,
        "description": description,
        "version": version
    }

    if extensions:
        repo_data["extensions"] = extensions
    if includes:
        repo_data["includes"] = sorted(includes)

    return repo_data

def write_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

def main():
    parser = argparse.ArgumentParser(description='Generate extensions.json for Synura repository.')
    parser.add_argument('--url', dest='base_url', default=DEFAULT_BASE_URL,
                        help=f'Base URL for the repository (default: {DEFAULT_BASE_URL})')
    args = parser.parse_args()
    
    base_url = args.base_url
    if not base_url.endswith('/'):
        base_url += '/'
        
    print(f"Generating repository using base URL: {base_url}")

    # Root-level extensions live directly under SCRIPT_DIR and should be listed
    # in the top-level repository index.
    root_extensions = collect_extension_entries(SCRIPT_DIR, SCRIPT_DIR, base_url)

    # Group extensions by subdirectory
    extensions_by_subdir = defaultdict(list)

    # Scan subdirectories in SCRIPT_DIR
    for entry in os.scandir(SCRIPT_DIR):
        if entry.is_dir() and entry.name not in IGNORE_DIRS:
            subdir = entry.name
            subdir_path = entry.path

            extensions = collect_extension_entries(subdir_path, SCRIPT_DIR, base_url)
            if extensions:
                extensions_by_subdir[subdir].extend(extensions)

    stable_entries_by_path = stable_extension_entries_by_path(root_extensions, extensions_by_subdir, base_url)

    # Generate per-subdir stable and test JSON files with relative includes.
    stable_includes = []
    test_includes = []
    for subdir, extensions in extensions_by_subdir.items():
        stable_extensions = stable_entries_for_subdir(subdir, stable_entries_by_path)
        stable_json_path = os.path.join(SCRIPT_DIR, subdir, 'extensions.json')
        test_json_path = os.path.join(SCRIPT_DIR, subdir, 'test.json')
        stable_include_path = f'{subdir}/extensions.json'
        test_include_path = f'{subdir}/test.json'
        stable_file_existed = os.path.exists(stable_json_path)

        stable_data = {
            "extensions": stable_extensions
        }
        test_data = {
            "extensions": extensions
        }

        if stable_extensions:
            write_json(stable_json_path, stable_data)
        elif os.path.exists(stable_json_path):
            os.remove(stable_json_path)
        write_json(test_json_path, test_data)

        if stable_extensions:
            stable_includes.append(stable_include_path)
        test_includes.append(test_include_path)
        if stable_extensions:
            print(f"Generated: {stable_json_path} with {len(stable_extensions)} stable extensions.")
        elif stable_file_existed:
            print(f"Removed empty stable manifest: {stable_json_path}")
        else:
            print(f"Skipped empty stable manifest: {stable_json_path}")
        print(f"Generated: {test_json_path} with {len(extensions)} test extensions.")

    # Generate the full test/beta repository.
    test_repo_data = build_repository_data(
        "Synura Test Repository",
        "All Synura extensions, including beta and test extensions.",
        next_repository_version(TEST_OUTPUT_FILE),
        extensions=root_extensions,
        includes=test_includes
    )
    write_json(TEST_OUTPUT_FILE, test_repo_data)

    # Generate the public stable repository.
    stable_entries = stable_root_entries(stable_entries_by_path)
    stable_repo_data = build_repository_data(
        "Synura Stable Repository",
        "Stable Synura extensions.",
        next_repository_version(STABLE_OUTPUT_FILE),
        extensions=stable_entries,
        includes=stable_includes
    )
    write_json(STABLE_OUTPUT_FILE, stable_repo_data)
    
    total_extensions = len(root_extensions) + sum(len(exts) for exts in extensions_by_subdir.values())
    print(f"\nSuccessfully generated {STABLE_OUTPUT_FILE}")
    print(f"Successfully generated {TEST_OUTPUT_FILE}")
    print(f"  - {len(stable_includes)} stable subdirectory files")
    print(f"  - {len(test_includes)} test subdirectory files")
    print(f"  - {len(root_extensions)} root-level extensions")
    print(f"  - {len(stable_entries_by_path)} stable extensions")
    print(f"  - {total_extensions} total extensions")
    print(f"\nNote: Includes use relative paths, but extension URLs are absolute (based on {base_url}).")

if __name__ == "__main__":
    main()
