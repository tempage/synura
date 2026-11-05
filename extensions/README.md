# Synura Extensions Repository

**Stable repository URL (for app):**
```
https://tempage.github.io/synura/extensions.json
```

**Test/beta repository URL:**
```
https://tempage.github.io/synura/test.json
```

A collection of example extensions for the Synura application.

## Repository Structure

```
synura/
├── extensions.json              # Stable repository index
├── test.json                    # Full test/beta repository index
├── .nojekyll                    # GitHub Pages static serving flag
└── extensions/
    ├── generate_extensions_json.py  # Script to generate JSON files
    ├── README.md
    ├── basic/                   # Example extensions (view demos)
    │   ├── extensions.json
    │   ├── list.js
    │   └── ...
    ├── en_US/
    │   ├── extensions.json      # Stable index for this folder
    │   ├── test.json            # Full test/beta index for this folder
    │   └── reddit.js
    └── ko_KR/
        ├── extensions.json
        ├── test.json
        └── damoang.js
```

## Repository JSON Format

### Repository Channels

This repository publishes two top-level feeds:

| File | Purpose |
|------|---------|
| `extensions.json` | Stable feed used by default. It is an explicit allowlist of promoted extensions. |
| `test.json` | Full feed for beta/test extensions. It includes every generated locale `test.json`. |

New extensions should land in `test.json` first. Promote an extension by adding
its `.js` path to `STABLE_EXTENSION_PATHS` in `generate_extensions_json.py`.

Each locale directory follows the same split: `extensions.json` contains only
stable entries for that locale, while `test.json` contains every generated entry
in that locale. Locales without promoted stable extensions have an empty
`extensions.json`.

### Top-Level Repository JSON

The top-level file can contain root-level extensions and includes. Includes can
use **relative paths** (recommended) or **absolute URLs**:

```json
{
  "name": "Repository Name",
  "description": "Repository description",
  "version": 1.0,
  "extensions": [
    {
      "name": "youtube",
      "url": "https://raw.githubusercontent.com/.../youtube.js"
    }
  ],
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
      "name": "reddit",
      "description": "www.reddit.com",
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
    description: "example.com",
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
| `description` | ✅ | Website domain (for site extensions) |
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
1. Scan root-level `.js` files and subdirectories in the repo root
2. Extract metadata from each `SYNURA` object in `.js` files
3. Generate stable `extensions.json` and full `test.json` in each subdirectory
4. Generate top-level `test.json` with root-level `extensions` and locale `test.json` includes
5. Generate top-level `extensions.json` with root-level stable extensions and stable locale includes

## Allowed Hosting Domains

Extensions must be hosted on approved domains:
- `github.com`
- `raw.githubusercontent.com`
- `gist.githubusercontent.com`
- `gitlab.com`
- `bitbucket.org`
- `gitee.com`

## Parser regression tests

After changing TypeScript, run `make -j4 build_worldwide_community_extensions`
from the repository root to regenerate the distributed JavaScript.

Run `make test-common` for shared TS library and synurart API regressions.
`testdata/community_common/` compiles a handwritten test extension with
`community_common.ts`; `testdata/synurart/` exercises view lifecycle APIs through
the repository's examples. Data, users, content, and URLs are invented. These
tests cover URL resolution, media, metadata, selectors, content boundaries,
comment preservation, and view events without loading a production site parser.

Run `make test-worldwide` to add the generic checks in `testdata/extensions/`:
load every distributed extension, compile TypeScript in temporary storage,
compare packaged metadata, and check configured fetch scopes and empty-response
contracts. External transport is blocked or stubbed. The distributed JavaScript
files are preserved during tests. These checks do not establish live parsing or
mobile rendering correctness.

Keep public tests focused on shared library/runtime behavior and generated data.
Do not add captured posts, real author identifiers, article or image URLs,
scraped HTML/API responses, or diagnostic dumps containing them to test code or
fixtures. Generated local audit reports stay in the Git-ignored `reports/`
directory and are not test inputs.

## License

Apache-2.0
