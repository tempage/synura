import os
import json
import re
import argparse
from collections import defaultdict

# Configuration
# Get the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'extensions.json')
DEFAULT_BASE_URL = 'https://raw.githubusercontent.com/tempage/synura/refs/heads/main/extensions/'

# Files/folders to ignore when scanning
IGNORE_FILES = {'extensions.json', 'generate_extensions_json.py', 'README.md'}
IGNORE_DIRS = {'.git', '__pycache__', 'node_modules'}

def extract_metadata(file_path):
    """
    Extracts the SYNURA object from a JS file using regex.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Regex to find the SYNURA object
        match = re.search(r'(?:var|const|let)\s+(?:SYNURA|synura)\s*=\s*({[\s\S]*?})', content)
        if match:
            synura_block = match.group(1)
            
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

def main():
    parser = argparse.ArgumentParser(description='Generate extensions.json for Synura repository.')
    parser.add_argument('--url', dest='base_url', default=DEFAULT_BASE_URL,
                        help=f'Base URL for the repository (default: {DEFAULT_BASE_URL})')
    args = parser.parse_args()
    
    base_url = args.base_url
    if not base_url.endswith('/'):
        base_url += '/'
        
    print(f"Generating repository using base URL: {base_url}")

    # Group extensions by subdirectory
    extensions_by_subdir = defaultdict(list)

    # Scan subdirectories in SCRIPT_DIR (not a separate extensions/ folder)
    for entry in os.scandir(SCRIPT_DIR):
        if entry.is_dir() and entry.name not in IGNORE_DIRS:
            subdir = entry.name
            subdir_path = entry.path
            
            # Scan .js files in this subdirectory
            for file in os.listdir(subdir_path):
                if file.endswith('.js'):
                    file_path = os.path.join(subdir_path, file)
                    rel_path = os.path.relpath(file_path, SCRIPT_DIR)
                    print(f"Processing: {rel_path}")
                    
                    meta = extract_metadata(file_path)
                    if meta and meta.get('name'):
                        # Construct the extension entry
                        try:
                            version_val = float(meta.get('version', 0.0))
                        except ValueError:
                            version_val = 0.0

                        # Use absolute URL for extension
                        entry = {
                            'name': meta['name'],
                            'description': meta.get('description', ''),
                            'version': version_val,
                            'url': base_url + rel_path.replace(os.sep, '/'),
                            'api': int(meta.get('api', 0) or 0)
                        }
                        
                        # Add optional fields if present
                        if meta.get('domain'):
                            entry['domain'] = meta['domain']
                        if meta.get('author'):
                            entry['author'] = meta['author']
                        
                        # Add optional fields if present
                        if meta.get('icon'):
                            entry['icon'] = meta['icon']
                        if meta.get('locale'):
                            entry['locale'] = meta['locale']
                        if meta.get('tags'):
                            entry['tags'] = meta['tags']
                        
                        extensions_by_subdir[subdir].append(entry)

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
        "version": 1.0,
        "includes": sorted(includes)
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(repo_data, f, indent=2, ensure_ascii=False)
    
    total_extensions = sum(len(exts) for exts in extensions_by_subdir.values())
    print(f"\nSuccessfully generated {OUTPUT_FILE}")
    print(f"  - {len(includes)} subdirectory files")
    print(f"  - {total_extensions} total extensions")
    print(f"\nNote: Includes use relative paths, but extension URLs are absolute (based on {base_url}).")

if __name__ == "__main__":
    main()
