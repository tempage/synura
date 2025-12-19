# Synura Mock Server

A lightweight mock HTTP server for testing Synura extensions. Provides endpoints for testing authentication, session management, and various HTTP operations.

## Quick Start

```bash
# Run the server
make server

# Run tests
make test

# For Android testing (via ADB)
make android
```

## ⚠️ Development Only

This mock server is for **local development and debugging only**.

In production Synura apps, extensions can only be installed from trusted domains:

- `github.com`
- `raw.githubusercontent.com`
- `gist.githubusercontent.com`
- `gitee.com`
- `gitlab.com`
- `bitbucket.org`

`localhost` is only allowed in debug builds. For production, host your extensions on one of the allowed platforms above.

### Testing in Production Release

To test your extension in a production Synura app:

1. **Host your extension file** on an allowed domain (e.g., GitHub, GitLab, Gist)
2. **Set `SYNURA.domain`** in your JavaScript to point to your target website:

```javascript
var SYNURA = {
    domain: "example.com",  // Your target domain
    name: "My Extension",
    version: 1.0,
    // ...
};

var baseUrl = "https://example.com";  // Your API endpoints
```

3. **Install the extension** in Synura using the hosted URL:
   - `https://raw.githubusercontent.com/<user>/<repo>/main/extension.js`
   - `https://gist.githubusercontent.com/<user>/<gist_id>/raw/extension.js`


## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/login` | Set session cookie (10s expiry) |
| GET | `/logout` | Clear session cookie |
| GET | `/ua` | Echo User-Agent header |
| GET | `/headers` | Echo all request headers |
| GET | `/get` | Echo query params and cookies |
| POST | `/post` | Echo request body (JSON parsed) |
| POST | `/upload` | Handle multipart file upload |
| GET | `/login/get` | Authenticated GET (extends session) |
| POST | `/login/post` | Authenticated POST (extends session) |
| POST | `/login/upload` | Authenticated file upload |
| GET | `/synura.js` | Serve the test extension script |
| GET | `/api/hello` | Echo request details |
| GET | `/examples/*` | Serve example extension scripts |

## Session Management

- Sessions expire after **10 seconds** of inactivity
- Authenticated requests (`/login/*`) automatically extend the session by 10 seconds
- Use the `session_id` cookie for authentication
- Session state is thread-safe (using `sync.Map`)

## Testing with Synura App

1. Start the server: `make server`
2. For Android emulator/device: `make adb` (sets up port forwarding)
3. Install the extension from `http://localhost:8080/synura.js`
4. The extension provides UI buttons to test each endpoint

## Example Extensions

The server also serves example extensions from the `../examples` directory:

- `http://localhost:8080/examples/hello_world.js`
- `http://localhost:8080/examples/list.js`
- `http://localhost:8080/examples/post.js`
- And more...

## Files

- `main.go` - Server implementation
- `main_test.go` - Unit tests
- `synura.js` - Synura extension for UI testing
- `Makefile` - Build and run targets
