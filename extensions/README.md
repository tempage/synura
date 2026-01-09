# Synura Extensions Repository

**Repository URL (for app):**
```
https://raw.githubusercontent.com/tempage/synura/refs/heads/main/extensions/extensions.json
```

A collection of example extensions for the Synura application.

## Repository Structure

```
public/extensions/
├── extensions.json              # Top-level index with includes
├── generate_extensions_json.py  # Script to generate JSON files
├── README.md
├── basic/                       # Example extensions (view demos)
│   ├── extensions.json
│   ├── list.js
│   └── ...
├── en_US/
│   ├── extensions.json          # Generated index for this folder
│   └── reddit.js
└── ko_KR/
    ├── extensions.json
    └── damoang.js
```

## Repository JSON Format

### Top-Level `extensions.json`

Includes can use **relative paths** (recommended) or **absolute URLs**:

```json
{
  "name": "Repository Name",
  "description": "Repository description",
  "version": 1.0,
  "includes": [
    "en_US/extensions.json",
    "ko_KR/extensions.json"
  ]
}
```

### Sub-directory `extensions.json`

Extension URLs must be **absolute**, but includes can be relative:

```json
{
  "extensions": [
    {
      "name": "test_reddit",
      "description": "Unofficial example extension",
      "version": 0.1,
      "domain": "www.reddit.com",
      "url": "https://raw.githubusercontent.com/.../reddit.js",
      "icon": "https://...",
      "locale": "en_US",
      "api": 0,
      "tags": ["social", "news", "images"]
    }
  ]
}
```



## Extension Metadata (SYNURA Object)

Each `.js` extension file must define a `SYNURA` object:

```javascript
var SYNURA = {
    name: "extension_name",
    description: "What this extension does",
    version: 0.1,
    domain: "example.com",
    api: 0,
    license: "Apache-2.0",
    
    // Optional fields
    icon: "https://example.com/icon.png",
    locale: "en_US",
    tags: ["social", "news", "video"],
    bypass: "chrome/android",
    deeplink: true
}
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | Unique extension identifier |
| `description` | ✅ | Brief description |
| `version` | ✅ | Semantic version number |
| `domain` | ✅ | Target website domain |
| `api` | ✅ | API version (currently `0`) |
| `icon` | ❌ | URL to extension icon |
| `locale` | ❌ | Target locale (e.g., `en_US`) |
| `license` | ❌ | License identifier |
| `bypass` | ❌ | Anti-bot bypass config |

## Include System

The `includes` array allows repositories to be organized in any way you prefer. This repository uses locale-based grouping as an example, but you can organize by any category.

> **Note:** Directory names are for organization only and are ignored by the app. The app only uses the URLs in `includes` to fetch extensions.

### Grouping Examples

| Organization | Structure |
|--------------|-----------|
| **By locale** | `en_US/`, `ko_KR/` |
| **By topic** | `social/`, `video/`, `news/`, `music/` |
| **By author** | `alice/`, `bob/`, `community/` |
| **By popularity** | `featured/`, `trending/`, `new/` |
| **Mixed** | `official/`, `community/en/`, `community/kr/` |

### Example: Topic-Based Repository

```
my-extensions/
├── extensions.json
├── social/
│   ├── extensions.json
│   ├── reddit.js
│   └── twitter.js
├── video/
│   ├── extensions.json
│   └── vimeo.js
└── news/
    ├── extensions.json
    └── hackernews.js
```

The top-level `extensions.json` would reference:
```json
{
  "name": "My Extensions",
  "version": 1.0,
  "includes": [
    ".../social/extensions.json",
    ".../video/extensions.json",
    ".../news/extensions.json"
  ]
}
```

The app fetches all `includes` and merges extensions together for browsing and search.

### Safeguards

The app enforces these limits when fetching includes:

| Guard | Limit | Purpose |
|-------|-------|---------|
| Max Depth | 2 levels | Prevent infinite nesting |
| Visited Set | Skip duplicates | Prevent circular includes |
| Domain Allowlist | GitHub, GitLab, etc. | Security |

## Generating JSON Files

Run the generator script:

```bash
python3 generate_extensions_json.py
```

This will:
1. Scan all subdirectories in the repo root
2. Extract metadata from each `SYNURA` object in `.js` files
3. Generate `extensions.json` in each subdirectory
4. Generate top-level `extensions.json` with includes

## Allowed Hosting Domains

Extensions must be hosted on approved domains:
- `github.com`
- `raw.githubusercontent.com`
- `gist.githubusercontent.com`
- `gitlab.com`
- `bitbucket.org`
- `gitee.com`

## License

Apache-2.0
