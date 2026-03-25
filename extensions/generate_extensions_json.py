import os
import json
import re
import argparse
from collections import defaultdict
from decimal import Decimal, InvalidOperation

# Configuration
# Get the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'extensions.json')
DEFAULT_BASE_URL = 'https://raw.githubusercontent.com/tempage/synura/refs/heads/main/extensions/'
DEFAULT_REPOSITORY_VERSION = Decimal('1.0')
REPOSITORY_VERSION_STEP = Decimal('0.1')

# Files/folders to ignore when scanning
IGNORE_FILES = {'extensions.json', 'generate_extensions_json.py', 'README.md'}
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

    # Generate per-subdir JSON files with relative includes
    includes = []
    for subdir, extensions in extensions_by_subdir.items():
        subdir_json_path = os.path.join(SCRIPT_DIR, subdir, 'extensions.json')
        # Use relative path for includes
        include_path = f'{subdir}/extensions.json'
        
        subdir_data = {
            "extensions": extensions
        }
        
        with open(subdir_json_path, 'w', encoding='utf-8') as f:
            json.dump(subdir_data, f, indent=2, ensure_ascii=False)
        
        includes.append(include_path)
        print(f"Generated: {subdir_json_path} with {len(extensions)} extensions.")

    # Generate top-level extensions.json with relative includes
    repo_data = {
        "name": "Synura Example Repository",
        "description": "A collection of example extensions for educational purposes.",
        "version": next_repository_version(OUTPUT_FILE)
    }

    if root_extensions:
        repo_data["extensions"] = root_extensions
    if includes:
        repo_data["includes"] = sorted(includes)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(repo_data, f, indent=2, ensure_ascii=False)
    
    total_extensions = len(root_extensions) + sum(len(exts) for exts in extensions_by_subdir.values())
    print(f"\nSuccessfully generated {OUTPUT_FILE}")
    print(f"  - {len(includes)} subdirectory files")
    print(f"  - {len(root_extensions)} root-level extensions")
    print(f"  - {total_extensions} total extensions")
    print(f"\nNote: Includes use relative paths, but extension URLs are absolute (based on {base_url}).")

if __name__ == "__main__":
    main()
