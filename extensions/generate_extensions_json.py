import os
import json
import re
import argparse
import urllib.parse
from typing import Optional, List, Dict
from collections import defaultdict
from decimal import Decimal, InvalidOperation

# Extension validation error codes
EC_DOMAIN_MISMATCH = 9
EC_INVALID_SCRIPT = 3

class ExtensionValidationError(Exception):
    def __init__(self, message: str, code: int = 3):
        super().__init__(message)
        self.code = code

def is_ip_address(host: str) -> bool:
    parts = host.split('.')
    if len(parts) == 4 and all(p.isdigit() and 0 <= int(p) <= 255 for p in parts):
        return True
    return ':' in host

def is_public_suffix(host: str) -> bool:
    return '.' not in host.strip().rstrip('.')

def get_base_domain(host: str) -> str:
    labels = host.strip().rstrip('.').lower().split('.')
    return '.'.join(labels[-2:]) if len(labels) >= 2 else host

def host_belongs_to_domain_family(domain_host: str, permission_host: str) -> bool:
    domain_host = domain_host.strip().rstrip('.').lower()
    permission_host = permission_host.strip().rstrip('.').lower()
    if not domain_host or not permission_host:
        return False
    if domain_host == permission_host:
        return True
    if is_ip_address(domain_host) or is_ip_address(permission_host):
        return False
    if domain_host == 'localhost' or permission_host == 'localhost':
        return False
    if domain_host.endswith('.' + permission_host) or permission_host.endswith('.' + domain_host):
        return True
    return get_base_domain(domain_host) == get_base_domain(permission_host)

def parse_host_permission(pattern: str) -> dict:
    pattern = pattern.strip()
    if not pattern:
        raise ValueError("host_permissions cannot contain empty patterns")
    if '?' in pattern or '#' in pattern:
        raise ValueError(f"invalid host permission '{pattern}': query and fragment are not supported")
    if '://' not in pattern:
        raise ValueError(f"invalid host permission '{pattern}': scheme is required")

    scheme, rest = pattern.split('://', 1)
    if scheme not in ('http', 'https', '*'):
        raise ValueError(f"invalid host permission '{pattern}': scheme must be http, https, or *")

    host_part, _, path = rest.partition('/')
    path = '/' + path
    if not host_part or '@' in host_part:
        raise ValueError(f"invalid host permission '{pattern}': host is required")

    host = host_part.split(':', 1)[0].lower()
    wildcard = host.startswith('*.')
    if '*' in host and not wildcard:
        raise ValueError(f"invalid host permission '{pattern}': wildcard must be the left-most label")

    if wildcard:
        if host.count('*') != 1:
            raise ValueError(f"invalid host permission '{pattern}': only one wildcard is allowed")
        base = host[2:]
        if not base or '*' in base:
            raise ValueError(f"invalid host permission '{pattern}': wildcard base is invalid")
        if is_ip_address(base):
            raise ValueError(f"invalid host permission '{pattern}': wildcard IP hosts are not supported")
        if is_public_suffix(base):
            raise ValueError(f"invalid host permission '{pattern}': wildcard cannot target a public suffix")
        host = base

    return {
        'raw': pattern,
        'scheme': scheme,
        'host': host,
        'wildcard': wildcard,
        'path': path,
    }

def validate_host_permissions_for_domain(domain: str, patterns: List[str]):
    domain = domain.strip().lower()
    if not domain:
        raise ExtensionValidationError("host_permissions requires a domain", code=EC_DOMAIN_MISMATCH)

    domain_host = domain.split('/')[0].split(':')[0]
    for pattern in patterns:
        try:
            perm = parse_host_permission(pattern)
        except ValueError as e:
            raise ExtensionValidationError(str(e), code=EC_INVALID_SCRIPT)
        if not host_belongs_to_domain_family(domain_host, perm['host']):
            raise ExtensionValidationError(
                f"host permission '{perm['raw']}' must stay within SYNURA.domain '{domain}'",
                code=EC_DOMAIN_MISMATCH
            )

def effective_host_permissions(domain: str, explicit: Optional[List[str]]) -> List[str]:
    if not explicit:
        domain_host = domain.strip().split('/')[0].split(':')[0]
        return [f"http://{domain_host}/*", f"https://{domain_host}/*"]
    return explicit

def host_permissions_broaden(old_patterns: List[str], new_patterns: List[str]) -> bool:
    try:
        old_perms = [parse_host_permission(p) for p in old_patterns]
        new_perms = [parse_host_permission(p) for p in new_patterns]
    except Exception:
        return True

    def covers(parent, child):
        if parent['scheme'] != '*' and parent['scheme'] != child['scheme']:
            return False
        if parent['wildcard']:
            if child['host'] != parent['host'] and not child['host'].endswith('.' + parent['host']):
                return False
        else:
            if child['wildcard'] or child['host'] != parent['host']:
                return False
        if parent['path'] == '/*' or child['path'] == parent['path']:
            return True
        parent_prefix = parent['path'].rstrip('*')
        return child['path'].startswith(parent_prefix)

    for new_p in new_perms:
        if new_p['scheme'] == '*':
            p_http = dict(new_p, scheme='http')
            p_https = dict(new_p, scheme='https')
            if not any(covers(old, p_http) for old in old_perms) or not any(covers(old, p_https) for old in old_perms):
                return True
        else:
            if not any(covers(old, new_p) for old in old_perms):
                return True
    return False

def validate_icon(domain: str, icon: str):
    if not icon:
        return
    if icon.startswith("emoji:"):
        if not icon[len("emoji:"):].strip():
            raise ExtensionValidationError("empty emoji icon", code=EC_INVALID_SCRIPT)
        return
    parsed = urllib.parse.urlparse(icon)
    icon_host = (parsed.netloc or parsed.hostname or '').split(':')[0].lower()
    if not icon_host:
        raise ExtensionValidationError(f"invalid icon url: {icon}", code=EC_INVALID_SCRIPT)
    domain_host = domain.strip().split('/')[0].split(':')[0].lower()
    if domain_host == icon_host or get_base_domain(domain_host) == get_base_domain(icon_host):
        return
    raise ExtensionValidationError(
        f"icon url host must match domain or share the same base domain. icon: {icon}, domain: {domain}",
        code=EC_INVALID_SCRIPT
    )

def validate_bypass(bypass: str):
    parts = bypass.split('/')
    browser = parts[0] if parts else ''
    if browser not in ("chrome", "firefox", "tor"):
        raise ExtensionValidationError(f"unsupported browser in bypass field: {browser}", code=EC_INVALID_SCRIPT)
    if len(parts) > 1:
        os_name = parts[1]
        if os_name not in ("windows", "linux", "android", "ios", "macos"):
            raise ExtensionValidationError(f"unsupported os in bypass field: {os_name}", code=EC_INVALID_SCRIPT)

def validate_extension(
    meta: dict,
    rel_path: str,
    existing_ext: Optional[dict] = None,
    target_url: Optional[str] = None
):
    """
    Validate extension domain and host_permissions rules.
    """
    name = meta.get('name') or ''
    domain = meta.get('domain') or ''
    is_basic = rel_path.startswith('basic/') or rel_path.startswith('basic\\')

    # 1. Domain presence rule:
    # SYNURA.domain must not be empty for site extensions.
    if not is_basic and not domain.strip():
        raise ExtensionValidationError(
            f"EC_DOMAIN_MISMATCH ({EC_DOMAIN_MISMATCH}): extension '{name}' in {rel_path} does not specify a domain",
            code=EC_DOMAIN_MISMATCH
        )

    # 2. Host match rule when discovering via URL:
    # Entered URL host and domain must match exactly (ignoring case). Subdomains or partial matches rejected.
    if target_url and domain:
        parsed_target = urllib.parse.urlparse(target_url if '://' in target_url else f"https://{target_url}")
        target_host = (parsed_target.netloc or parsed_target.hostname or '').split(':')[0].lower()
        if target_host and domain.strip().lower() != target_host:
            raise ExtensionValidationError(
                f"EC_DOMAIN_MISMATCH ({EC_DOMAIN_MISMATCH}): domain mismatch: extension claims '{domain}' but was found on '{target_host}'",
                code=EC_DOMAIN_MISMATCH
            )

    # 3. Update rule:
    # Existing domain cannot change on update.
    if existing_ext:
        existing_domain = existing_ext.get('domain') or ''
        if existing_domain and domain and existing_domain.strip().lower() != domain.strip().lower():
            raise ExtensionValidationError(
                f"EC_DOMAIN_MISMATCH ({EC_DOMAIN_MISMATCH}): domain mismatch: cannot change extension domain from '{existing_domain}' to '{domain}'",
                code=EC_DOMAIN_MISMATCH
            )

    # 4. host_permissions rules:
    # Permissions must stay within the domain family; wildcards only allowed on leftmost label; public suffix/IP wildcards rejected.
    host_permissions = meta.get('host_permissions')
    if host_permissions:
        if not isinstance(host_permissions, list):
            raise ExtensionValidationError("host_permissions must be an array of strings", code=EC_INVALID_SCRIPT)
        validate_host_permissions_for_domain(domain, host_permissions)

    # 5. Check host_permissions broadening on update:
    if existing_ext and domain:
        old_domain = existing_ext.get('domain') or domain
        old_hp = existing_ext.get('host_permissions')
        new_hp = host_permissions
        old_effective = effective_host_permissions(old_domain, old_hp)
        new_effective = effective_host_permissions(domain, new_hp)
        if host_permissions_broaden(old_effective, new_effective):
            print(f"Warning: host_permissions_broaden detected for extension '{name}': permissions broadened from {old_effective} to {new_effective}")

    # 6. Icon validation
    icon = meta.get('icon')
    if icon and domain:
        validate_icon(domain, icon)

    # 7. Bypass validation
    bypass = meta.get('bypass')
    if bypass:
        validate_bypass(bypass)

# Configuration
# Get the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
STABLE_OUTPUT_FILE = os.path.join(REPO_ROOT, 'extensions.json')
TEST_OUTPUT_FILE = os.path.join(REPO_ROOT, 'test.json')
DEFAULT_BASE_URL = 'https://tempage.github.io/synura/extensions/'
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
    'ar_SA/adslgate.js',
    'ar_SA/arab_hardware.js',
    'bn_BD/bigganblog.js',
    'bn_BD/cadetcollegeblog.js',
    'bn_BD/somewhereinblog.js',
    'de_DE/computerbase.js',
    'de_DE/hardwareluxx.js',
    'en_US/reddit.js',
    'en_US/hackernews.js',
    'en_US/lobsters.js',
    'en_US/mumsnet.js',
    'es_419/ba_k.js',
    'es_419/forosdelweb.js',
    'es_419/forosperu.js',
    'es_ES/foros_acb.js',
    'es_ES/rankia.js',
    'fa_IR/bazicenter.js',
    'fa_IR/majidonline.js',
    'fr_FR/frandroid.js',
    'fr_FR/hardware_fr.js',
    'fr_FR/lesnumeriques.js',
    'he_IL/carsforum.js',
    'he_IL/hasolidit.js',
    'hi_IN/desidime.js',
    'hi_IN/techenclave.js',
    'id_ID/expatindo.js',
    'it_IT/tomshw_italia.js',
    'ja_JP/five_ch.js',
    'ja_JP/girlschannel.js',
    'ja_JP/hatena_anonymous_diary.js',
    'ja_JP/hatena_bookmark.js',
    'ja_JP/komachi.js',
    'ja_JP/okwave.js',
    'ja_JP/teratail.js',
    'ja_JP/yahoo_chiebukuro.js',
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
    'ko_KR/instiz.js',
    'ko_KR/todayhumor.js',
    'ko_KR/naver_webtoon.js',
    'ko_KR/naver_news.js',
    'pl_PL/elektroda.js',
    'pl_PL/forum_gazeta.js',
    'pl_PL/kafeteria.js',
    'pl_PL/wykop.js',
    'pt_BR/adrenaline.js',
    'pt_PT/forum_da_casa.js',
    'pt_PT/zwame.js',
    'ru_RU/habr.js',
    'ru_RU/linux_org_ru.js',
    'ru_RU/vc_ru.js',
    'th_TH/pantip.js',
    'th_TH/soccersuck.js',
    'th_TH/headlightmag.js',
    'tr_TR/donanimhaber.js',
    'tr_TR/turkhackteam.js',
    'tr_TR/turkiyeforum.js',
    'vi_VN/otofun.js',
    'vi_VN/tinhte.js',
    'vi_VN/voz.js',
    'zh_CN/csdn.js',
    'zh_CN/douban_groups.js',
    'zh_CN/hupu.js',
    'zh_CN/stage1st.js',
    'zh_CN/v2ex.js',
    'zh_CN/zhihu.js',
    'zh_TW/coolaler.js',
    'zh_TW/mobile01.js',
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

                # Also resolve identifier lookups (e.g. domain: DC_HOST / domain: e)
                ident_match = re.search(
                    r'\b' + name + r'\s*:\s*([a-zA-Z_$][\w$]*)',
                    synura_block
                )
                if ident_match:
                    ident = ident_match.group(1)
                    if ident not in ('null', 'undefined', 'true', 'false'):
                        var_match = re.search(
                            r'(?:var|let|const|,)\s*' + re.escape(ident) + r'\s*=\s*["\']([^"\']+)["\']',
                            content
                        )
                        if var_match:
                            return var_match.group(1)
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
                'bypass': get_field('bypass'),
                'tags': get_array_field('tags'),
                'host_permissions': get_array_field('host_permissions'),
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
    if meta.get('host_permissions'):
        entry['host_permissions'] = meta['host_permissions']

    return entry

def load_existing_extension_map():
    """
    Load existing extension records from extensions.json, test.json,
    and any subdirectory extensions.json/test.json to check for updates.
    """
    existing_map = {}

    def add_from_file(path):
        if not os.path.exists(path):
            return
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            for ext in data.get('extensions', []):
                name = ext.get('name')
                if name and name not in existing_map:
                    existing_map[name] = ext
        except Exception:
            pass

    add_from_file(STABLE_OUTPUT_FILE)
    add_from_file(TEST_OUTPUT_FILE)

    if os.path.exists(SCRIPT_DIR):
        for entry in os.scandir(SCRIPT_DIR):
            if entry.is_dir() and entry.name not in IGNORE_DIRS:
                add_from_file(os.path.join(entry.path, 'extensions.json'))
                add_from_file(os.path.join(entry.path, 'test.json'))

    return existing_map

def collect_extension_entries(dir_path, base_dir, base_url, existing_map=None, validate=True):
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
        if validate and meta:
            existing_ext = existing_map.get(meta.get('name')) if existing_map else None
            validate_extension(meta, rel_path, existing_ext=existing_ext)

        entry = build_extension_entry(meta, rel_path, base_url)
        if entry:
            extensions.append(entry)

    return extensions

def next_repository_version(output_file, legacy_file=None):
    """
    Read the current top-level repository version and bump it by 0.1.
    """
    current_version = DEFAULT_REPOSITORY_VERSION

    for candidate in (output_file, legacy_file):
        if candidate and os.path.exists(candidate):
            try:
                with open(candidate, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
                raw_version = existing.get('version')
                if raw_version is not None:
                    current_version = Decimal(str(raw_version))
                    break
            except (OSError, json.JSONDecodeError, InvalidOperation, TypeError, ValueError):
                continue

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
    parser.add_argument('--no-validate', dest='validate', action='store_false', default=True,
                        help='Skip validation checks (domain mismatch, host_permissions, icon)')
    args = parser.parse_args()
    
    base_url = args.base_url
    if not base_url.endswith('/'):
        base_url += '/'
        
    print(f"Generating repository using base URL: {base_url}")
    if args.validate:
        print("Extension validation: ENABLED (domain mismatch, host_permissions, icon)")
    else:
        print("Extension validation: DISABLED")

    existing_map = load_existing_extension_map() if args.validate else {}

    # Root-level extensions live directly under SCRIPT_DIR and should be listed
    # in the top-level repository index.
    root_extensions = collect_extension_entries(
        SCRIPT_DIR, SCRIPT_DIR, base_url, existing_map=existing_map, validate=args.validate
    )

    # Group extensions by subdirectory
    extensions_by_subdir = defaultdict(list)

    # Scan subdirectories in SCRIPT_DIR
    for entry in os.scandir(SCRIPT_DIR):
        if entry.is_dir() and entry.name not in IGNORE_DIRS:
            subdir = entry.name
            subdir_path = entry.path

            extensions = collect_extension_entries(
                subdir_path, SCRIPT_DIR, base_url, existing_map=existing_map, validate=args.validate
            )
            if extensions:
                extensions_by_subdir[subdir].extend(extensions)

    stable_entries_by_path = stable_extension_entries_by_path(root_extensions, extensions_by_subdir, base_url)
    stable_urls = {entry['url'] for entry in stable_entries_by_path.values()}

    # Generate per-subdir stable and test JSON files with relative includes.
    stable_includes = []
    test_includes = []
    for subdir, extensions in extensions_by_subdir.items():
        stable_extensions = stable_entries_for_subdir(subdir, stable_entries_by_path)
        stable_json_path = os.path.join(SCRIPT_DIR, subdir, 'extensions.json')
        test_json_path = os.path.join(SCRIPT_DIR, subdir, 'test.json')
        stable_include_path = f'extensions/{subdir}/extensions.json'
        test_include_path = f'extensions/{subdir}/test.json'
        stable_file_existed = os.path.exists(stable_json_path)
        test_file_existed = os.path.exists(test_json_path)

        # Test extensions exclude any extension that has been officially promoted to stable.
        test_extensions = [e for e in extensions if e.get('url') not in stable_urls]

        stable_data = {
            "extensions": stable_extensions
        }
        test_data = {
            "extensions": test_extensions
        }

        if stable_extensions:
            write_json(stable_json_path, stable_data)
        elif os.path.exists(stable_json_path):
            os.remove(stable_json_path)

        if test_extensions:
            write_json(test_json_path, test_data)
        elif os.path.exists(test_json_path):
            os.remove(test_json_path)

        if stable_extensions:
            stable_includes.append(stable_include_path)
        if test_extensions:
            test_includes.append(test_include_path)

        if stable_extensions:
            print(f"Generated: {stable_json_path} with {len(stable_extensions)} stable extensions.")
        elif stable_file_existed:
            print(f"Removed empty stable manifest: {stable_json_path}")
        else:
            print(f"Skipped empty stable manifest: {stable_json_path}")

        if test_extensions:
            print(f"Generated: {test_json_path} with {len(test_extensions)} test extensions.")
        elif test_file_existed:
            print(f"Removed empty test manifest: {test_json_path}")
        else:
            print(f"Skipped empty test manifest: {test_json_path}")

    legacy_test_file = os.path.join(SCRIPT_DIR, 'test.json')
    legacy_stable_file = os.path.join(SCRIPT_DIR, 'extensions.json')

    # Generate the full test/beta repository (excluding stable root-level extensions).
    root_test_extensions = [e for e in root_extensions if e.get('url') not in stable_urls]
    test_repo_data = build_repository_data(
        "Synura Test Repository",
        "All Synura extensions, including beta and test extensions.",
        next_repository_version(TEST_OUTPUT_FILE, legacy_test_file),
        extensions=root_test_extensions,
        includes=test_includes
    )
    write_json(TEST_OUTPUT_FILE, test_repo_data)

    # Generate the public stable repository.
    stable_entries = stable_root_entries(stable_entries_by_path)
    stable_repo_data = build_repository_data(
        "Synura Stable Repository",
        "Stable Synura extensions.",
        next_repository_version(STABLE_OUTPUT_FILE, legacy_stable_file),
        extensions=stable_entries,
        includes=stable_includes
    )
    write_json(STABLE_OUTPUT_FILE, stable_repo_data)

    # Remove legacy root manifests under extensions/ if present
    if os.path.exists(legacy_stable_file):
        os.remove(legacy_stable_file)
        print(f"Removed legacy manifest: {legacy_stable_file}")
    if os.path.exists(legacy_test_file):
        os.remove(legacy_test_file)
        print(f"Removed legacy manifest: {legacy_test_file}")
    
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
