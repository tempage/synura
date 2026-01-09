import os
import json
import glob
import lzstring
import re
import jsbeautifier
from jsmin import jsmin

# JS Beautifier Options

# 1. Pretty (for real .js files and examples)
JS_OPTS_PRETTY = jsbeautifier.default_options()
JS_OPTS_PRETTY.indent_size = 2
JS_OPTS_PRETTY.space_in_empty_paren = True
JS_OPTS_PRETTY.preserve_newlines = True
JS_OPTS_PRETTY.max_preserve_newlines = 2
JS_OPTS_PRETTY.brace_style = "collapse-preserve-inline"
JS_OPTS_PRETTY.keep_array_indentation = True  # Preserve formatting in arrays
JS_OPTS_PRETTY.comment_preserve = True  # Explicitly preserve comments

# 2. Compact (for code blocks in Markdown)
JS_OPTS_COMPACT = jsbeautifier.default_options()
JS_OPTS_COMPACT.indent_size = 2
JS_OPTS_COMPACT.space_in_empty_paren = True
JS_OPTS_COMPACT.preserve_newlines = True
JS_OPTS_COMPACT.max_preserve_newlines = 2
JS_OPTS_COMPACT.brace_style = "collapse-preserve-inline"
JS_OPTS_PRETTY.keep_array_indentation = True  # Preserve formatting in arrays
JS_OPTS_COMPACT.comment_preserve = True  # Explicitly preserve comments

# Configuration
USE_COMPRESSION = True  # Toggle to compare compressed vs uncompressed

# OPTIMIZATION NOTE: Current compression is per-file. When approaching the 128KB limit,
# consider grouping related files before compression (e.g., all "View Types" docs together,
# all "Examples" together). This can yield ~24% additional savings by deduplicating
# common patterns across files (repeated headers, code structures, keywords).
# Trade-off: loses per-file lazy decompression (must decompress entire group at once).
# Script is now in public/, so use current directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = SCRIPT_DIR  # Script is in public/
DOCS_DIR = os.path.join(PUBLIC_DIR, "docs")
EXAMPLES_DIR = os.path.join(PUBLIC_DIR, "extensions", "basic")
ASSETS_DIR = os.path.join(os.path.dirname(PUBLIC_DIR), "app", "assets")

DESCRIPTIONS = {
    None: "Official documentation and examples for Synura.",
    "ar": "الوثائق الرسمية والأمثلة لسينورا.",
    "bn": "Synura-এর জন্য অফিসিয়াল ডকুমেন্টেশন এবং উদাহরণ।",
    "de": "Offizielle Dokumentation und Beispiele für Synura.",
    "es": "Documentación oficial y ejemplos para Synura.",
    "es_419": "Documentación oficial y ejemplos para Synura.",
    "fa": "مستندات رسمی و مثال‌ها برای Synura.",
    "fr": "Documentation officielle et exemples pour Synura.",
    "he": "תיעוד רשמי ודוגמאות עבור Synura.",
    "hi": "Synura के लिए आधिकारिक दस्तावेज़ और उदाहरण।",
    "id": "Dokumentasi resmi dan contoh untuk Synura.",
    "it": "Documentazione ufficiale ed esempi per Synura.",
    "ja": "Synuraの公式ドキュメントと例。",
    "ko": "Synura 공식 문서 및 예제.",
    "pl": "Oficjalna dokumentacja i przykłady dla Synura.",
    "pt": "Documentação oficial e exemplos para Synura.",
    "pt_BR": "Documentação oficial e exemplos para Synura.",
    "ru": "Официальная документация и примеры для Synura.",
    "th": "เอกสารและตัวอย่างอย่างเป็นทางการสำหรับ Synura",
    "tr": "Synura için resmi belgeler ve örnekler.",
    "vi": "Tài liệu chính thức và ví dụ cho Synura.",
    "zh": "Synura 的官方文档和示例。",
    "zh_CN": "Synura 的官方文档和示例。",
    "zh_TW": "Synura 的官方文件和範例。"
}

README_TITLES = {
    None: "Read Me",
    "ar": "اقرأني",
    "bn": "আমাকে পড়ুন",
    "de": "Lies mich",
    "es": "Léeme",
    "es_419": "Léeme",
    "fa": "مرا بخوان",
    "fr": "Lisez-moi",
    "he": "קרא אותי",
    "hi": "मुझे पढ़ें",
    "id": "Baca Saya",
    "it": "Leggimi",
    "ja": "はじめにお読みください",
    "ko": "필독",
    "pl": "Przeczytaj mnie",
    "pt": "Leia-me",
    "pt_BR": "Leia-me",
    "ru": "Прочти меня",
    "th": "อ่านฉัน",
    "tr": "Beni Oku",
    "vi": "Đọc tôi",
    "zh": "自述文件",
    "zh_CN": "自述文件",
    "zh_TW": "讀我檔案"
}

GUIDE_TITLES = {
    None: "Synura Guide",
    "ar": "دليل سينورا",
    "bn": "Synura গাইড",
    "de": "Synura Handbuch",
    "es": "Guía de Synura",
    "es_419": "Guía de Synura",
    "fa": "راهنمای Synura",
    "fr": "Guide Synura",
    "he": "מדריך Synura",
    "hi": "Synura गाइड",
    "id": "Panduan Synura",
    "it": "Guida Synura",
    "ja": "Synura ガイド",
    "ko": "Synura 가이드",
    "pl": "Przewodnik Synura",
    "pt": "Guia do Synura",
    "pt_BR": "Guia do Synura",
    "ru": "Руководство Synura",
    "th": "คู่มือ Synura",
    "tr": "Synura Kılavuzu",
    "vi": "Hướng dẫn Synura",
    "zh": "Synura 指南",
    "zh_CN": "Synura 指南",
    "zh_TW": "Synura 指南"
}

# Table of Contents Structure
# Maps display titles to filenames or sub-menus
TOC_STRUCTURE = [
    {"title": "Read Me", "file": "README.md"},
    {"title": "Getting Started", "file": "getting_started.md"},
    {"title": "Polyfill Guide", "file": "polyfill_guide.md"},
    {"title": "API Reference", "file": "api_reference.md"},
    {"title": "Router Pattern", "file": "router.md"},
    {"title": "View Types", "items": [
        {"title": "Simple View", "file": "simple.md"},
        {"title": "List View", "file": "list.md"},
        {"title": "Post View", "file": "post.md"},
        {"title": "Markdown View", "file": "markdown.md"},
        {"title": "Chat View", "file": "chat.md"},
        {"title": "Editor View", "file": "editor.md"},
        {"title": "Browser View", "file": "browser.md"},
        {"title": "Settings View", "file": "settings.md"},
    ]},
    {"title": "Dialog Types", "items": [
        {"title": "Input Dialog", "file": "input_dialog.md"},
        {"title": "Confirmation Dialog", "file": "confirmation_dialog.md"},
    ]},
    {"title": "Examples", "file": "examples.md"},
]

def read_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        # print(f"Warning: File not found: {filepath}")
        return None

def format_javascript(content, opts):
    """Formats JavaScript content using jsbeautifier with specific options."""
    try:
        return jsbeautifier.beautify(content, opts)
    except Exception as e:
        print(f"Warning: Failed to format JS: {e}")
        return content

def format_markdown_codeblocks(content):
    """Finds and formats JavaScript code blocks in Markdown content."""
    # Matches ```javascript or ```js blocks
    # Pattern handles indented code blocks (e.g., inside list items)
    # where opening fence may have leading whitespace but closing fence may not.
    # Uses non-greedy match and looks for closing fence at start of line.
    pattern = re.compile(r'^[ \t]*(`{3,})(?:javascript|js)\n(.*?)^[ \t]*\1[ \t]*$', re.DOTALL | re.MULTILINE)
    
    def replace_block(match):
        fence = match.group(1)
        code = match.group(2)
        
        # Format with jsbeautifier (preserves comments)
        formatted_code = format_javascript(code, JS_OPTS_COMPACT)
        
        # Reconstruct the block
        return f"{fence}javascript\n{formatted_code}\n{fence}"
    
    return pattern.sub(replace_block, content)

# Shared handler JavaScript template
# Uses {doc_accessor} and {example_accessor} placeholders for compression mode differences
HANDLER_JS = '''
const handler = {{
    openMenu: function(items, title) {{
        const listData = items.map(item => {{
             return {{
                 title: item.title,
                 subtitle: item.items ? "Folder" : "Doc",
                 link: item.file || (item.items ? "folder:" + item.title : null)
             }};
        }});

        const result = synura.open({{
            view: '/views/list',
            styles: {{ title: title }},
            models: {{ contents: {{ details: listData }} }}
        }});

        if (result.success) {{
            synura.connect(result.viewId, {{}}, (event) => {{
                if (event.eventId === 'CLICK') {{
                    const index = event.data._index;
                    const selectedItem = items[index];
                    
                    if (selectedItem) {{
                        if (selectedItem.items) {{
                            this.openMenu(selectedItem.items, selectedItem.title);
                        }} else if (selectedItem.file) {{
                            this.openDoc(selectedItem.title, selectedItem.file);
                        }}
                    }}
                }}
            }});
        }} else {{
            console.log("Error opening menu: " + result.error);
        }}
    }},
    
    openDoc: function(title, filename, anchor) {{
        const url = anchor ? filename + '#' + anchor : filename;
        
        // Check cache first
        let config = getCachedRoute(url);
        if (!config) {{
            config = this.router(url);
            if (config) setCachedRoute(url, config);
        }}
        
        if (config) {{
            // If title is provided, override it (router uses internal findTitle)
            if (title) config.styles.title = title;
            const result = synura.open(config);
            
            // Set up click handler for links within markdown documents
            if (result.success && config.view === '/views/markdown') {{
                synura.connect(result.viewId, {{}}, (event) => {{
                    if (event.eventId === 'CLICK') {{
                        const link = event.data.link;
                        if (link && link.startsWith('#')) {{
                            // Same-page anchor link, scroll to it
                            synura.update(result.viewId, {{ models: {{ anchor: link.substring(1) }} }});
                        }} else if (link) {{
                            // For markdown files, use openDoc to set up connect handler
                            if (link.endsWith('.md') || link.includes('.md#')) {{
                                const parts = link.split('#');
                                const file = parts[0];
                                const linkAnchor = parts[1] || null;
                                const linkTitle = findTitle(file, TOC);
                                this.openDoc(linkTitle, file, linkAnchor);
                            }} else {{
                                this.openDoc(null, link);
                            }}
                        }}
                    }}
                }});
            }} else if (result.success && config.view === '/views/list') {{
                // Set up click handler for list views (e.g., folders opened from markdown links)
                synura.connect(result.viewId, {{}}, (event) => {{
                    if (event.eventId === 'CLICK') {{
                        const link = event.data.link;
                        if (link) {{
                            this.openDoc(null, link);
                        }}
                    }}
                }});
            }}
        }} else {{
            console.log("Could not find configuration for doc: " + filename);
        }}
    }},

    home: function() {{
        this.openMenu(TOC, "{base_title}");
    }},

    resume: function(data) {{
        if (data && data.title && data.file) {{
            this.openDoc(data.title, data.file);
        }} else {{
            this.home();
        }}
    }},

    router: function(url) {{
        if (url && (url.endsWith('.md') || url.includes('.md#'))) {{
            const parts = url.split('#');
            const file = parts[0];
            const anchor = parts[1] || null;
            
            const title = findTitle(file, TOC) || "Doc";
            const content = {doc_accessor};
            
            const baseName = file.replace('.md', '.js');
            let finalContent = content;
            
            {example_block}

            const models = {{ content: finalContent }};
            if (anchor) {{
                models.anchor = anchor;
            }}
            
            return {{
                view: '/views/markdown',
                styles: {{ title: title }},
                models: models
            }};
        }} else if (url && url.startsWith('folder:')) {{
            const folderTitle = url.substring(7);
            const findFolder = (items) => {{
                for (const item of items) {{
                    if (item.title === folderTitle && item.items) return item;
                    if (item.items) {{
                        const found = findFolder(item.items);
                        if (found) return found;
                    }}
                }}
                return null;
            }};
            
            const folder = findFolder(TOC);
            if (folder && folder.items) {{
                const listData = folder.items.map(item => {{
                     return {{
                         title: item.title,
                         subtitle: item.items ? "Folder" : "Doc",
                         link: item.file || (item.items ? "folder:" + item.title : null)
                     }};
                }});
                
                
                const titles = folder.items.map(function(item) {{ return item.title; }}).join(", ");
                return {{
                    view: '/views/list',
                    styles: {{ title: folderTitle }},
                    models: {{
                        contents: {{ details: listData }},
                        description: "Folder containing: " + titles
                    }}
                }};
            }}
        }} else if (url && url.endsWith('synura_polyfill.js')) {{
             return {{
                view: '/views/browser',
                styles: {{ title: "Synura Polyfill" }},
                models: {{ url: "https://github.com/tempage/synura/blob/main/synura_polyfill.js" }}
             }};
        }}
        return null;
    }}
}};
'''

# Shared cache helpers JavaScript (plain string, not .format())
CACHE_HELPERS_JS = '''
// Cache Helpers with 1 hour TTL
const CACHE_TTL = 3600000;

const getCachedRoute = (url) => {
    const cached = sessionStorage.getItem(url);
    if (!cached) return null;
    const age = Date.now() - cached.timestamp;
    if (age < CACHE_TTL) {
        return cached;
    }
    sessionStorage.removeItem(url);
    return null;
};

const setCachedRoute = (url, routeData) => {
    routeData.timestamp = Date.now();
    sessionStorage.setItem(url, routeData);
};

function findTitle(file, items) {
    if (!items) return null;
    for (const item of items) {
        if (item.file === file) return item.title;
        if (item.items) {
             const found = findTitle(file, item.items);
             if (found) return found;
        }
    }
    return null;
}
'''

# LZString decompression library (minified Base64 version, ~1.5KB)
LZSTRING_LIB = '''const LZString=function(){var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",t={};function e(o,n,e){if(null==o)return"";if(""==o)return null;var i,s,u,a,f,c,l,p=[],d=4,h=4,v=3,g="",w=[],m={val:e(0),position:n,index:1};for(i=0;i<3;i++)p[i]=i;for(u=0,f=Math.pow(2,2),c=1;c!=f;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=n,m.val=e(m.index++)),u|=(a>0?1:0)*c,c<<=1;switch(u){case 0:for(u=0,f=Math.pow(2,8),c=1;c!=f;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=n,m.val=e(m.index++)),u|=(a>0?1:0)*c,c<<=1;l=r(u);break;case 1:for(u=0,f=Math.pow(2,16),c=1;c!=f;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=n,m.val=e(m.index++)),u|=(a>0?1:0)*c,c<<=1;l=r(u);break;case 2:return""}for(p[3]=l,s=l,w.push(l);;){if(m.index>o.length)return"";for(u=0,f=Math.pow(2,v),c=1;c!=f;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=n,m.val=e(m.index++)),u|=(a>0?1:0)*c,c<<=1;switch(l=u){case 0:for(u=0,f=Math.pow(2,8),c=1;c!=f;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=n,m.val=e(m.index++)),u|=(a>0?1:0)*c,c<<=1;p[h++]=r(u),l=h-1,d--;break;case 1:for(u=0,f=Math.pow(2,16),c=1;c!=f;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=n,m.val=e(m.index++)),u|=(a>0?1:0)*c,c<<=1;p[h++]=r(u),l=h-1,d--;break;case 2:return w.join("")}if(0==d&&(d=Math.pow(2,v),v++),p[l])g=p[l];else{if(l!==h)return null;g=s+s.charAt(0)}w.push(g),p[h++]=s+g.charAt(0),s=g,0==--d&&(d=Math.pow(2,v),v++)}}return{decompressFromBase64:function(r){return null==r?"":""==r?null:(t.b||(t.b={},function(){for(var r=0;r<n.length;r++)t.b[n.charAt(r)]=r}()),e(r.length,32,function(n){return t.b[r.charAt(n)]}))}}}();'''

def to_js_string(s):
    """Converts a Python string to a string of UTF-16 code units (surrogate pairs),
    mimicking JavaScript string behavior for non-BMP characters."""
    res = []
    for char in s:
        code = ord(char)
        if code <= 0xFFFF:
            res.append(char)
        else:
            # Calculate surrogate pairs
            code -= 0x10000
            high = 0xD800 | (code >> 10)
            low = 0xDC00 | (code & 0x3FF)
            res.append(chr(high))
            res.append(chr(low))
    return "".join(res)

def generate_js_content(docs, code_examples, locale=None, compressed=False):
    """Generate guide.js content for a specific locale.
    
    Args:
        docs: Dictionary of filename -> content
        code_examples: Dictionary of filename -> example code
        locale: Locale code (None for default/English)
        compressed: Whether to use LZString compression
    
    Returns:
        Complete JavaScript content as a string
    """
    base_title = GUIDE_TITLES.get(locale, GUIDE_TITLES[None])
    ext_name = base_title + (f" ({locale})" if locale else "")
    description = DESCRIPTIONS.get(locale, DESCRIPTIONS[None])

    # Localize TOC (shallow copy since we only modify first item's title)
    local_toc = [item.copy() for item in TOC_STRUCTURE]
    readme_title = README_TITLES.get(locale, README_TITLES[None])
    if local_toc and local_toc[0].get("file") == "README.md":
        local_toc[0]["title"] = readme_title

    # Prepare data and accessors based on compression mode
    if compressed:
        lz = lzstring.LZString()
        # Convert content to JS-compatible surrogate pairs before compression
        compressed_docs = {k: lz.compressToBase64(to_js_string(v)) for k, v in docs.items()}
        compressed_examples = {k: lz.compressToBase64(to_js_string(v)) for k, v in code_examples.items()}
        
        data_section = f'''
// Compressed Documentation Content
const COMPRESSED_DOCS = {json.dumps(compressed_docs, indent=4)};

// Compressed Code Examples
const COMPRESSED_EXAMPLES = {json.dumps(compressed_examples, indent=4)};

// Decompress on first access (Lazy Loading)
const DOCS = {{}};
const EXAMPLES = {{}};

function getDoc(filename) {{
    if (DOCS[filename]) return DOCS[filename];
    if (COMPRESSED_DOCS[filename]) {{
        DOCS[filename] = LZString.decompressFromBase64(COMPRESSED_DOCS[filename]);
        return DOCS[filename];
    }}
    return "Content not found.";
}}

function getExample(filename) {{
    if (EXAMPLES[filename]) return EXAMPLES[filename];
    if (COMPRESSED_EXAMPLES[filename]) {{
        EXAMPLES[filename] = LZString.decompressFromBase64(COMPRESSED_EXAMPLES[filename]);
        return EXAMPLES[filename];
    }}
    return null;
}}'''
        doc_accessor = 'getDoc(file)'
        example_block = '''const exampleCode = getExample(baseName);
            if (exampleCode) {
                finalContent += "\\n\\n## Example Code\\n```javascript\\n" + exampleCode + "\\n```";
            }'''
        lzstring_section = f'''
// LZString decompression library
{LZSTRING_LIB}
'''
        header_comment = "Compressed"
    else:
        data_section = f'''
// Embedded Documentation Content
const DOCS = {json.dumps(docs, indent=4)};

// Embedded Code Examples
const EXAMPLES = {json.dumps(code_examples, indent=4)};'''
        doc_accessor = 'DOCS[file] || "Content not found."' 
        example_block = '''if (EXAMPLES[baseName]) {
                finalContent += "\\n\\n## Example Code\\n```javascript\\n" + EXAMPLES[baseName] + "\\n```";
            }'''
        lzstring_section = ""
        header_comment = ""

    # Build handler with appropriate accessors
    handler_code = HANDLER_JS.format(
        base_title=base_title,
        doc_accessor=doc_accessor,
        example_block=example_block
    )

    # Assemble final JavaScript
    js_template = f'''/**
 * Auto-generated Synura Guide Extension{" (" + header_comment + ")" if header_comment else ""}
 * Generated by public/generate_guide.py
 * Locale: {locale if locale else 'Default'}
 */
{lzstring_section}
const SYNURA = {{
    name: "{ext_name}",
    version: 1.0,
    api: 0,
    description: "{description}",
    license: "Apache-2.0",
    icon: "emoji:📖",
    deeplink: true,
    get main() {{ return handler; }}
}};
{data_section}

// Table of Contents Structure
const TOC = {json.dumps(local_toc, indent=4)};
{CACHE_HELPERS_JS}
{handler_code}
'''
    return js_template

def main():
    # 1. Identify Locales
    locales = [None] # None represents default/English
    
    # Check if DOCS_DIR exists before listing
    if os.path.exists(DOCS_DIR):
        for item in os.listdir(DOCS_DIR):
            full_path = os.path.join(DOCS_DIR, item)
            if os.path.isdir(full_path) and item != "examples" and item != "extensions":
                locales.append(item)
            
    print(f"Found locales: {locales}")

    # 2. Read Example Codes (Global)
    code_examples = {}
    example_filenames = []
    print("Reading example scripts...")
    if os.path.exists(EXAMPLES_DIR):
        for filepath in glob.glob(os.path.join(EXAMPLES_DIR, "*.js")):
            filename = os.path.basename(filepath)
            content = read_file(filepath)
            if content:
                # Format the example JS
                formatted_content = format_javascript(content, JS_OPTS_PRETTY)

                # Write back if changed
                if formatted_content != content:
                    try:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(formatted_content)
                        # print(f"Formatted and updated: {filepath}")
                    except IOError as e:
                        print(f"Warning: Could not write back to {filepath}: {e}")

                code_examples[filename] = formatted_content
                example_filenames.append(filename)

    # Sort example filenames for consistent ordering
    example_filenames.sort()

    # Helper to recursively extract files from TOC structure
    def collect_files(items):
        files = []
        for item in items:
            if "file" in item:
                files.append(item["file"])
            if "items" in item:
                files.extend(collect_files(item["items"]))
        return files

    files_to_read = collect_files(TOC_STRUCTURE)

    # 3. Generate for each locale
    os.makedirs(ASSETS_DIR, exist_ok=True)
    
    total_original = 0
    total_compressed = 0
    
    for locale in locales:
        print(f"Generating guide for locale: {locale if locale else 'default (en)'}")
        docs = {}
        
        for filename in files_to_read:
            content = None
            source_path = None
            
            if locale is None:
                # Default (English): Read from PUBLIC_DIR
                source_path = os.path.join(PUBLIC_DIR, filename)
                content = read_file(source_path)
            else:
                # Localized: Read from DOCS_DIR/<locale>/
                local_path = os.path.join(DOCS_DIR, locale, filename)
                content = read_file(local_path)
                
                if content is not None:
                    source_path = local_path
                else:
                    # Fallback to English in PUBLIC_DIR
                    default_path = os.path.join(PUBLIC_DIR, filename)
                    content = read_file(default_path)
                    # Do not set source_path for write-back if falling back

            if content is None:
                # Check if it's a virtual example doc (corresponds to an existing JS example)
                base_js = filename.replace('.md', '.js')
                if base_js in code_examples:
                    # Synthesize content
                    docs[filename] = f"# Example: {base_js}\n\nThis is an auto-generated view for the `{base_js}` example."
                else:
                    print(f"  Warning: Content not found for {filename}")
                    docs[filename] = "Error: Content not found."
            else:
                # Format Markdown Content
                formatted_content = format_markdown_codeblocks(content)

                # Write back if changed and we have a valid source path for this locale
                if source_path and formatted_content != content:
                    try:
                        with open(source_path, 'w', encoding='utf-8') as f:
                            f.write(formatted_content)
                        # print(f"Formatted and updated: {source_path}")
                    except IOError as e:
                        print(f"Warning: Could not write back to {source_path}: {e}")

                docs[filename] = formatted_content
        
        # Determine output filename
        if locale:
            output_filename = f"guide_{locale}.js"
        else:
            output_filename = "guide.js"
            
        output_file_path = os.path.join(ASSETS_DIR, output_filename)
        
        # Generate uncompressed version for size comparison
        js_content_uncompressed = generate_js_content(docs, code_examples, locale, compressed=False)
        uncompressed_size = len(js_content_uncompressed.encode('utf-8'))
        
        if USE_COMPRESSION:
            # Generate compressed JS content
            js_content = generate_js_content(docs, code_examples, locale, compressed=True)
        else:
            js_content = js_content_uncompressed
        
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        # Check Size
        file_size = os.path.getsize(output_file_path)
        limit = 131072 # 128KB
        
        # Track totals for summary
        total_original += uncompressed_size
        total_compressed += file_size
        
        # Calculate reduction
        reduction = uncompressed_size - file_size
        reduction_pct = (reduction / uncompressed_size * 100) if uncompressed_size > 0 else 0
        
        if file_size > limit:
            print(f"  Error: Generated file {output_file_path} is too large!")
            print(f"  Size: {file_size} bytes")
        else:
            if USE_COMPRESSION:
                print(f"  {output_filename}: {uncompressed_size:,} -> {file_size:,} bytes ({reduction_pct:.1f}% reduction)")
            else:
                print(f"  Successfully generated {output_filename} ({file_size} bytes)")
    
    # Print summary
    if USE_COMPRESSION:
        total_reduction = total_original - total_compressed
        total_reduction_pct = (total_reduction / total_original * 100) if total_original > 0 else 0
        print("")
        print("=" * 60)
        print("COMPRESSION SUMMARY")
        print("=" * 60)
        print(f"  Total original size:   {total_original:,} bytes ({total_original / 1024:.1f} KB)")
        print(f"  Total compressed size: {total_compressed:,} bytes ({total_compressed / 1024:.1f} KB)")
        print(f"  Total saved:           {total_reduction:,} bytes ({total_reduction_pct:.1f}%)")
        print("=" * 60)

if __name__ == "__main__":
    main()
