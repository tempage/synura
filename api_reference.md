# Synura API Reference

This document details the JavaScript API available to Synura extensions. The
shared [`synura-runtime`](runtime/README.md) crate owns the VM,
fetch/Web Crypto implementations, Web API helpers, and DOM adapter. `synurart`
embeds one VM; application hosts provide view/storage/platform bindings and
manage their own VM instances.

This is an explicitly scoped Web API implementation, not a complete browser.
Application-host integration is separate from the shared crate implementation.

## Global Objects

### `synura`
The core object for interacting with the Synura application.

#### Methods

-   **`synura.open(options, [context], [callback])`**
    -   Opens a new view. Optionally connects to the view if `callback` is provided.
    -   **Arguments**:
        -   `options` (Object): Configuration for the view.
            -   `view` (String): The type of view to open (e.g., `'/views/list'`).
            -   `styles` (Object): Styles configuration.
            -   `models` (Object): Models data.
        -   `context` (Object, Optional): Arbitrary data passed back in events. Can be omitted if only 2 arguments are passed and the 2nd is the callback.
        -   `callback` (Function, Optional): Called when an event occurs. If provided, `synura.connect` is called automatically.
    -   **Returns**: An object `{ success: boolean, viewId: number, viewName: string, error?: string }`.

-   **`synura.update(viewId, data)`**
    -   Updates an existing view.
    -   **Arguments**:
        -   `viewId` (Number): The ID of the view to update.
        -   `data` (Object): New `styles` or `models` to merge.
    -   **Special Model Keys**:
        -   For `'/views/list'`, `data.models.append` appends new list items to the existing `contents` instead of replacing them. This is useful for pagination.
        -   For `'/views/chat'`, `data.models.append` appends new chat messages.
    -   **Returns**: An object `{ success: boolean, viewId: number, viewName: string, error?: string }`.

-   **`synura.connect(viewId, context, callback)`**
    -   Listens for events from a view.
    -   **Arguments**:
        -   `viewId` (Number): The ID of the view.
        -   `context` (Object): Arbitrary data passed back in events (useful for tracking state).
        -   `callback` (Function): Called when an event occurs. Receives an `event` object.
    -   **Returns**: An object `{ success: boolean, viewId: number, error?: string }`.
    -   **Note**: Only one callback can be active per view. Calling `connect` again will overwrite the previous callback.

-   **`synura.close(viewId)`**
    -   Closes a specific view.
    -   **Arguments**:
        -   `viewId` (Number): The ID of the view to close.
    -   **Returns**: An object `{ success: boolean, viewId: number, viewName: string, error?: string }`.

-   `synura.parse(type, element)`: Parses a DOM element into a structured object based on the specified type.
    - `type`: A string specifying the parsing logic (e.g., `'post'`).
    - `element`: The DOM element to parse.
    - **Returns**: An array of objects representing the parsed content (e.g., `[{type: 'text', value: '...'}, {type: 'image', value: '...'}]`).

### `fetch(input, options)`
The shared runtime exposes an asynchronous HTTP client returning `Promise<Response>`. `input` is a URL string or a `Request`. Network work runs on a native executor; JavaScript can continue and multiple requests can run concurrently. The Promise resolves when the final response headers arrive. Read the body separately with `await response.text()`, `json()`, `arrayBuffer()`, or the custom `dom()` method.

Network failures, invalid URLs, denied permissions, timeouts, and invalid headers reject with `TypeError`. Host request cancellation rejects with `AbortError`; JavaScript signal cancellation rejects with the signal’s reason, defaulting to `AbortError`. HTTP error statuses such as 404 resolve normally with `ok: false`. Failures after headers arrive, including truncated or oversized bodies, reject the body reader. Exceptions from caller-defined argument getters become Promise rejections.

Application hosts must support asynchronous extension entry points and callbacks to run these extensions. The standalone runtime drains submitted HTTP and cryptographic work before completing a CLI command.

> **Host restriction:** By default, extension requests must target `SYNURA.domain`. If an extension needs sibling subdomains or path-scoped hosts, declare `SYNURA.host_permissions`. The shared runtime enforces this rule for every embedding host.

The embedding host validates and binds approved network declarations (`domain`, `host_permissions`, and `bypass`) once per VM. Before binding, network access is denied. `synurart` binds them when loading an extension. Changing the JavaScript package object later does not change these settings. `SYNURA.host_permissions` is optional. When it is omitted or empty, the effective permission uses the host portion of `SYNURA.domain`:

```javascript
[
  "http://<host>/*",
  "https://<host>/*"
]
```

When it is nonempty, it replaces the default fetch scope. Each pattern must be one of:

```text
http://host/path
https://host/path
*://host/path
```

The host can be exact (`api.example.com`) or a left-most wildcard (`*.example.com`). The path can contain `*`. Omitting the path means `/`, not `/*`. Query strings and fragments are not allowed in permission patterns.

Examples:

```javascript
var SYNURA = {
  domain: "github.io",
  host_permissions: [
    "https://*.github.io/*"
  ]
};
```

Security boundaries:

- Permission hosts must stay in the same registrable domain family as `SYNURA.domain`.
- Wildcards cannot target ICANN public suffixes such as `*.io`, `*.com`, or `*.co.kr`.
- Private/public-suffix service domains such as `github.io` are handled by the public suffix list. For example, `*.github.io` is allowed only when the extension identity is scoped to `github.io`; a `user.github.io` extension cannot broaden to sibling pages.
- For raw IPs and localhost, explicit permission ports must match the extension's domain declaration. A portless pattern, including the implicit host scope, accepts any port. To restrict a non-default port, include it in `host_permissions`, for example `http://127.0.0.1:8080/*`. Requests normalize default ports, so omit `:80` and `:443` from their respective HTTP/HTTPS patterns.

-   **Options**:
    -   `method`: HTTP method, defaulting to `'GET'`. Standard methods are normalized to uppercase. Invalid method tokens and `CONNECT`, `TRACE`, and `TRACK` are rejected.
    -   `headers`: A `Headers` instance, iterable of `[name, value]` pairs, or record. Values are converted to strings; invalid names or values reject the request.
    -   `body`: String, `ArrayBuffer`, typed-array/DataView byte range, or `URLSearchParams`. Binary data is copied at request construction. GET and HEAD cannot have a body. Objects are not automatically JSON-encoded: use `JSON.stringify(data)` and set `Content-Type: application/json` explicitly.
    -   `signal`: An `AbortSignal`, normally from `new AbortController().signal`. Aborting cancels the request and pending body consumption. `AbortSignal.abort(reason)` and `AbortSignal.any(signals)` are available; `AbortSignal.timeout()` requires host timers and is not implemented.
    -   `redirect`: `"follow"` (default) or `"error"`. `"error"` rejects redirect responses before contacting the destination. `"manual"` rejects with `NotSupportedError`; invalid values reject with `TypeError`.
    -   `credentials`: `"omit"`, `"same-origin"` (default), or `"include"`. The host has no browser cookie store or browser origin. `"omit"` disables automatic redirect-cookie collection and forwarding; explicitly supplied headers remain caller-controlled.
-   **Response**:
    -   `status`, `statusText`, `ok`, `url`, `redirected`, and `type` expose response metadata.
    -   `headers` is a `Headers` instance. Use `get(name)` (string or `null`), `has(name)`, iterators (`entries()`, `keys()`, `values()`), or `forEach()`. `getSetCookie()` returns individual Set-Cookie values. Headers on fetched responses are immutable.
    -   `text()`, `json()`, `arrayBuffer()`, and `bytes()` return Promises. Text uses UTF-8 with replacement and leading BOM removal; JSON parse failures reject with `SyntaxError`.
    -   `bodyUsed` becomes true when consumption of a non-null body begins. A second reader rejects with `TypeError`.
    -   `clone()` creates an independently consumable response; call it before reading the original.
    -   `dom(mimeType)` is a **Synura custom method**, returning a Promise for an HTML document. Only `text/html` is supported.

`Headers`, `Request`, and `Response` constructors are available, including
`Response.json()`, `Response.error()`, and `Response.redirect()`. Null bodies,
such as HEAD and 204 responses, remain unused and can be read repeatedly.

Bodies are buffered. `ReadableStream`, Blob, FormData, streaming decoding,
manual redirects, and host timers are not implemented. Reading `.body` on a
non-null body or calling unsupported body readers rejects/throws
`NotSupportedError`. Non-default browser origin modes, unsupported cache modes,
subresource integrity, keepalive, explicit referrers, and referrer policies are
also rejected instead of silently applying incomplete browser policy. CORS and
SameSite browsing context are not implemented; approved extension host
permissions provide the network boundary. `dom()` and explicit
Cookie access are the retained Synura extensions.

Redirects check host permissions at every destination and allow up to 20 redirects (21 requests). A 301/302 response changes POST to GET; a 303 changes methods other than GET/HEAD to GET. These changes discard the body and its content/framing headers. A 307/308 preserves the method and body. With `redirect: "follow"`, a redirect response without a Location header is returned normally. The response body limit is 8 MiB.

Explicit `Authorization` and `Cookie` headers are retained for same-origin redirects and removed when the scheme, host, or effective port changes. Once removed, they are not restored later in the chain, even if it returns to the original origin. Network permission to contact a host does not authorize forwarding these headers to it. Directly setting `Cookie` is a Synura extension to the browser API.

Redirect `Set-Cookie` values are kept in a request-local store. Domain, host-only scope, Path, Secure, expiry/deletion, and public suffix restrictions determine which cookies apply to each destination. Cookie names are case-sensitive. An explicit `Cookie` header takes precedence while it remains on the request. Cookies are not automatically retained between separate fetch calls or shared with the login browser. Extensions manage their captured login cookies. `credentials: "omit"` disables the automatic redirect-cookie store but does not suppress an explicitly supplied header. Browser SameSite context is not implemented. `followRedirects` is not supported.

Custom authentication headers (such as API keys and HMAC signatures) are not automatically recognized or stripped. Use `redirect: "error"` for signed requests and credential submissions that must reach only the requested URL. This also prevents a 307/308 from forwarding a sensitive request body.

#### Legacy Charset Example
```javascript
const response = await fetch("https://example.com/page");
const raw = await response.arrayBuffer();
const html = new TextDecoder("euc-kr").decode(raw);
const utf8Bytes = new TextEncoder().encode(html);
```

#### Rejecting Redirects
```javascript
const response = await fetch("https://" + SYNURA.domain + "/api/session", {
  redirect: "error"
});
console.log(response.status);
```

### DOM API
Objects returned by `await response.dom()`, `new DOMParser().parseFromString(...)`, or element query methods provide a subset of the standard DOM API.

#### `Element`
-   **Properties**:
    -   `tagName` (String): The tag name (upper case).
    -   `id` (String): The element's ID.
    -   `className` (String): The class attribute.
    -   `classList` (DOMTokenList):
        -   `add(className)`: Adds a class.
        -   `remove(className)`: Removes a class.
        -   `toggle(className)`: Toggles a class.
        -   `contains(className)`: Checks if a class exists.
    -   `dataset` (DOMStringMap):
        -   Read/Write data attributes (e.g. `el.dataset.foo` maps to `data-foo`).
    -   `textContent` (String): The text content of the element and its descendants.
    -   `innerText` (String): The rendered text content of the element and its descendants.
    -   `childNodes` (NodeList): List of child nodes.
    -   `firstChild`, `lastChild` (Element): First/Last child element.
    -   `nextSibling` (Element): Next sibling element.
    -   `nodeType` (Number): `1` (Element) or `3` (Text).

-   **Methods**:
    -   `getAttribute(name)`: Returns the attribute value, or `null` if the attribute does not exist. For HTML documents, attribute name matching is case-insensitive.
    -   `hasAttribute(name)`: Returns `true` if the attribute exists, `false` otherwise.
    -   `querySelector(selector)`: Returns the first matching child element.
    -   `querySelectorAll(selector)`: Returns a NodeList of matching child elements.
    -   `remove()`: Removes the element from its parent.
    -   `cloneNode(deep = false)`: Returns a distinct clone of the node, including its attributes. By default only the node itself is cloned; pass `true` to also clone its descendants.

#### `Document` (from `dom()` or `DOMParser`)
-   `querySelector(selector)`
-   `querySelectorAll(selector)`

### `console`
-   `console.log(...args)`: Logs messages to the debug console (and logcat on Android).

### `navigator`
-   `navigator.language`: The current locale exposed by the runtime as a BCP 47 language tag. In `synurart`, this defaults to `en-US` and can be changed with the `locale <tag>` command.

### `localStorage`
Persistent key-value storage backed by a database.
-   **`localStorage.setItem(key, value)`**
    -   Saves a key-value pair. **Both must be strings** (like Web API).
-   **`localStorage.getItem(key)`**
    -   Returns the value (string) for the key, or `null` if not found.
-   **`localStorage.removeItem(key)`**
    -   Removes the item with the specified key.
-   **`localStorage.clear()`**
    -   Removes all items.

### `sessionStorage`
Transient, in-memory key-value storage (LRU cache).
-   **`sessionStorage.setItem(key, value)`**
    -   Saves a key-value pair. **Value can be any JavaScript type** (unlike Web API).
-   **`sessionStorage.getItem(key)`**
    -   Returns the value for the key, or `null` if not found.
-   **`sessionStorage.removeItem(key)`**
    -   Removes the item with the specified key.
-   **`sessionStorage.clear()`**
    -   Removes all items.

#### Storage Example
```javascript
localStorage.setItem("token", "12345");
const token = localStorage.getItem("token");
sessionStorage.setItem("cache", {
  lastPage: 1,
  items: []
});
const cache = sessionStorage.getItem("cache");
```

### `URLSearchParams`
Query-string helpers in the shared runtime: `append`, `delete`, `get`, `getAll`, `has`, `set`, `sort`, `forEach`, `keys`, `values`, `entries`, `size`, and `toString`.
The constructor accepts a query string, an iterable of pairs, or an object. `set` preserves the first matching parameter's position and removes duplicate values.

Use `for...of`, `forEach`, or the iterator methods to iterate.

```javascript
for (const [name, value] of new URLSearchParams("q=hello&page=2")) {
    console.log(name, value);
}
```

### `TextEncoder`
Browser-like UTF-8 encoder.
-   `new TextEncoder()`
-   `encoding`: Always `"utf-8"`.
-   `encode(input)`: Returns a `Uint8Array` containing UTF-8 bytes for the input string.
-   `encodeInto(input, destination)`: Writes UTF-8 bytes into a destination `Uint8Array` and returns `{ read, written }`.

### `TextDecoder`
Browser-like byte decoder for supported charset labels.
-   `new TextDecoder(label, { fatal, ignoreBOM })`
-   `encoding`: Canonical encoding label resolved by the runtime (for example `"utf-8"` or `"euc-kr"`).
-   `fatal`: Whether invalid byte sequences throw; defaults to `false`.
-   `ignoreBOM`: Whether a leading BOM is preserved; defaults to `false`.
-   `decode(input)`: Decodes an `ArrayBuffer`, typed-array range, or DataView into a JavaScript string. Streaming decode is not implemented.

Common use cases include:
-   `new TextDecoder("utf-8")`
-   `new TextDecoder("euc-kr")`

> **Note:** `TextEncoder` and `TextDecoder` are synchronous. Fetch and response body readers return Promises; pass `await response.arrayBuffer()` to `TextDecoder.decode()`.

---

### `crypto` (shared runtime)

`synura-runtime` provides a native-backed subset of the [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/) as `globalThis.crypto`. The implementation is built into the runtime and does not count toward the extension's 128 KiB source limit. `window` is not required or added by this API.

The QuickJS interfaces, Promise results, buffer conversion, and opaque `CryptoKey` lifetime are implemented in Rust, together with the BoringSSL-backed cryptographic operations. HTTP and Web Crypto share the same BoringSSL dependency. No JavaScript crypto bootstrap or extension-supplied crypto library is required.

The same bindings are installed in each shared VM. Application hosts must embed the shared runtime and pump completions for extensions to use these APIs. Image rendering and service authentication belong to the app and extension layers.

| API | Behavior |
|---|---|
| `crypto.getRandomValues(integerArray)` | Fills an integer typed array from the native cryptographic random generator and returns that same array. Maximum 65,536 bytes per call, including subviews. Floating-point arrays and `DataView` are rejected. |
| `crypto.randomUUID()` | Returns a random UUID version 4 string. |
| `crypto.subtle.digest(algorithm, data)` | Returns a Promise for an `ArrayBuffer` digest. |
| `crypto.subtle.generateKey(algorithm, extractable, keyUsages)` | Returns a Promise for a `CryptoKey` or an asymmetric `{publicKey, privateKey}` pair. |
| `crypto.subtle.importKey(format, keyData, algorithm, extractable, keyUsages)` | Imports binary key material or a JWK into an opaque runtime key. |
| `crypto.subtle.exportKey(format, key)` | Exports an extractable key as an `ArrayBuffer` or JWK. |
| `crypto.subtle.encrypt(algorithm, key, data)` / `decrypt(...)` | Return Promises for ciphertext/plaintext `ArrayBuffer` values. |
| `crypto.subtle.sign(algorithm, key, data)` / `verify(algorithm, key, signature, data)` | Generate an HMAC, RSA, ECDSA, or Ed25519 signature; verification returns a boolean. |
| `crypto.subtle.deriveBits(algorithm, baseKey, length)` | Derives an `ArrayBuffer`; `length` is in bits. ECDH/X25519 accept an omitted or `null` length for the complete shared secret. |
| `crypto.subtle.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages)` | Derives an AES or HMAC key, or imports a complete ECDH/X25519 shared secret as a non-extractable HKDF/PBKDF2 base key. |
| `crypto.subtle.wrapKey(format, key, wrappingKey, wrapAlgorithm)` | Exports an extractable key and encrypts it using a key with `wrapKey` usage. |
| `crypto.subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages)` | Decrypts and imports a key using `unwrapKey` permission. |

`getRandomValues` and `randomUUID` are synchronous. All `subtle` methods return real Promises, including rejected Promises for invalid arguments or failed operations. Buffer inputs and algorithm parameters are copied when the method is called. Later mutations of the caller's buffers do not change the pending operation. `ArrayBuffer`, typed-array subviews, and `DataView` inputs retain their exact byte range.

| Algorithm | Operations | Key formats / parameters |
|---|---|---|
| SHA-1, SHA-256, SHA-384, SHA-512 | `digest` | String name or `{name}`. |
| AES-GCM | Key generation/import/export; encrypt/decrypt; wrap/unwrap | 128-, 192-, or 256-bit keys; `raw` and `jwk`. Requires `iv`; optional `additionalData` and `tagLength`. |
| AES-CBC | Key generation/import/export; encrypt/decrypt; wrap/unwrap | 128-, 192-, or 256-bit keys; `raw` and `jwk`. Requires a 16-byte `iv`; PKCS#7 padding. |
| HMAC | Key generation/import/export; sign/verify | `raw` and `jwk`; SHA-1/256/384/512 selected when the key is generated/imported. |
| RSA-OAEP | Key generation/import/export; encrypt/decrypt; wrap/unwrap | Public: `spki`/`jwk`; private: `pkcs8`/`jwk`. SHA-1/256/384/512 selected on key creation/import; optional operation `label`. |
| RSASSA-PKCS1-v1_5 | Key generation/import/export; sign/verify | Public: `spki`/`jwk`; private: `pkcs8`/`jwk`. SHA-1/256/384/512 selected on key creation/import. |
| RSA-PSS | Key generation/import/export; sign/verify | Same RSA formats and hashes; operations require `saltLength` in bytes. |
| ECDSA | Key generation/import/export; sign/verify | P-256, P-384, P-521. Public: `raw`/`spki`/`jwk`; private: `pkcs8`/`jwk`. Operations select `hash`; signatures use fixed-width `r || s`, not ASN.1 DER. |
| ECDH | Key generation/import/export; deriveBits/deriveKey | Same EC curves and formats. Derivation requires the peer's ECDH public `CryptoKey` on the same curve. |
| Ed25519 | Key generation/import/export; sign/verify | Public: 32-byte `raw`, `spki`, or `jwk`; private: `pkcs8` or `jwk`. JWK uses `kty: "OKP"`, `crv: "Ed25519"`. Pure Ed25519 with 64-byte signatures; no caller-selected `hash`. |
| X25519 | Key generation/import/export; deriveBits/deriveKey | Public: 32-byte `raw`, `spki`, or `jwk`; private: `pkcs8` or `jwk`. JWK uses `kty: "OKP"`, `crv: "X25519"`. Derivation requires a peer X25519 public `CryptoKey`; an all-zero shared secret is rejected. |
| PBKDF2 | Raw key import; deriveBits/deriveKey | Base keys must be non-extractable. Requires `hash`, `salt`, and positive `iterations`. |
| HKDF | Raw key import; deriveBits/deriveKey | Base keys must be non-extractable. Requires `hash`, `salt`, and `info`. |

Algorithm names are case-insensitive; key format and usage strings follow the standard spelling. RSA generation supports modulus sizes from 512 through 16,384 bits in multiples of 128, with an odd public exponent from 3 through 4,294,967,295. Other generation parameters reject with `OperationError`; the runtime does not silently reduce the requested modulus size. A supported key size does not guarantee that a particular OAEP message/hash combination fits that key.

AES-GCM returns the ciphertext followed by the authentication tag, as specified by Web Crypto. `tagLength` is measured in bits and accepts 32, 64, 96, 104, 112, 120, or 128 (default). Authentication failure rejects with `OperationError` and returns no plaintext. This standard layout does not imply that a third-party service uses the same wire format.

`CryptoKey.type`, `extractable`, `algorithm`, and `usages` expose metadata; key handles and underlying native key material are not exposed. Operations enforce the original algorithm, key type, usages, and export permission even if public metadata is modified. JWK `alg`, `use`, `key_ops`, and `ext` constraints are validated. Keys belong to their runtime and are not persisted in `localStorage`.

`extractable` controls whether the key material can leave its opaque `CryptoKey` through `exportKey` or `wrapKey`. Set it when generating, importing, deriving, or unwrapping a key. With `false`, exporting or wrapping that key is rejected; its permitted cryptographic operations still work. A non-extractable wrapping key can wrap other, extractable keys when its usages include `wrapKey`. `deriveBits` permission separately allows derived bytes to be returned; it does not export the base key. For generated asymmetric pairs, the flag applies to the private key, while the public key is extractable. HKDF and PBKDF2 base keys require `false` and do not support export.

The `extractable` attribute is read-only. Changing or shadowing JavaScript metadata does not alter the native permission. Importing with `false` does not erase the caller's original bytes or copies already saved elsewhere. The flag does not guarantee encrypted persistence or hardware-backed storage. See the [CryptoKey interface](https://www.w3.org/TR/webcrypto-2/#cryptokey-interface) and [key storage considerations](https://www.w3.org/TR/webcrypto-2/#security-considerations-authors).

Unsupported algorithms reject with `NotSupportedError`; this is not a complete browser cryptography implementation. AES-CTR and AES-KW are not implemented. Legacy RSAES-PKCS1-v1_5 encryption is not part of the supported Web Crypto API; RSASSA-PKCS1-v1_5 is a signature algorithm and cannot replace it. Incompatible key permissions produce `InvalidAccessError`, malformed key material produces `DataError`, and cryptographic failures produce `OperationError`. A `DOMException` implementation provides the standard error names.

Web Crypto does not define common numeric quotas for these resources. The
shared VM applies host limits in addition to algorithm constraints. Defaults
are 64 pending crypto operations, 16 MiB of combined pending input buffers and
parameters, and a separate 16 MiB estimated live-key budget (at most 4096 keys).
Native crypto buffers are capped at 16 MiB. Limit violations reject with
`OperationError`. The host can configure pending-operation and input/key-budget
limits with `VmConfig`; these are runtime resource policy, not new algorithm
parameters. Default QuickJS heap/stack limits are 64 MiB/512 KiB, and a host
entry point has a 30-second execution deadline. See
[embedding and resource boundaries](runtime/README.md#resource-boundaries).

A running native PBKDF2/RSA operation is not forcibly interruptible. Revocation
ends the host wait, cancels queued work, and prevents delivery to the revoked
VM; the current native call may finish afterward. Hosts must limit aggregate VM
count and recycle a VM when its execution authority is revoked.

Numeric and algorithm constraints include `getRandomValues`' 65,536-byte maximum, HMAC's unsigned-long bit length, positive PBKDF2 iterations, valid AES sizes, and HKDF's 255-block output maximum. Size arithmetic and fallible native allocations are checked, and garbage collection releases native keys. RSA generation uses the exact-size backend restrictions described above. `deriveBits` uses the optional nullable unsigned-long conversion in the published Web Crypto Level 2 interface, matching browser-compatible implementations.

Binary arguments and results travel directly as native byte buffers, without an internal Base64 round trip. Explicitly owned Rust temporary secret buffers and JWK values are guarded for zeroization when released, including failure paths. The caller's JavaScript buffers, input JWK objects, and deliberately exported keys remain caller-owned; this does not promise erasure of every copy managed internally by the JavaScript engine or other libraries.

```javascript
async function encryptExample() {
    const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        false, // Keep the key usable but non-extractable.
        ["encrypt", "decrypt"]
    );
    // Use a fresh IV for each encryption with this key.
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const input = new TextEncoder().encode("example");
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, input);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
    return new TextDecoder().decode(decrypted);
}
```

Cryptographic operations run on a dedicated native worker for each runtime. Argument conversion and buffer snapshots happen synchronously, and the method returns its Promise before native completion is delivered to JavaScript. The worker accesses no JavaScript objects. `synurart` awaits Promise results from extension entry points, emitted view events, and CLI `eval`, and drains submitted crypto work and microtasks, including continuations in asynchronous `LOAD` callbacks, before completing the command. Other hosts choose their own scheduling policy using `Vm::finish`, `poll`, and `drain`. Background callbacks waiting only for a future host event do not block subsequent commands. An explicitly returned Promise that cannot settle from available jobs or crypto work reports an error. This CLI completion policy does not make an explicitly awaited long operation instant. HTTP completion events are pumped alongside cryptographic completions, allowing asynchronous callbacks to alternate between fetch and crypto operations.

HMAC supplies a cryptographic operation only. Service-specific signing input, signing-key provisioning, timestamps, cookies, verification tokens, and key-exchange sequences remain the extension's responsibility.

The host may expose Web Crypto to an authenticated, installed extension as a trusted execution environment. The [Secure Contexts specification](https://www.w3.org/TR/secure-contexts/#packaged-applications) allows this model for authenticated packaged applications. Installation approval and package/update integrity are host responsibilities; exposing the API does not make every script or its stored data confidential. The standalone CLI directly trusts the local code selected by its caller.

`localStorage` stores strings, not opaque `CryptoKey` objects. Exporting a secret key as JWK or Base64 and saving it there makes the key readable by code with access to that extension's storage. The standalone runtime persists this storage as JSON without application-level encryption. `extractable: false` prevents API export but does not itself imply hardware-backed storage or encrypted persistence.

For Android hosts that need persistent secrets, a separate host storage layer can encrypt stored key material with a non-exportable Android Keystore master key while keeping the extension-facing Web Crypto API unchanged. This protects stored data; software keys restored for BoringSSL operations still enter native memory. Algorithms supported directly by Keystore may instead use native key handles, but platform and device support differ. Hardware-backed storage is an application design choice, not a Web Crypto requirement. See [Android Keystore](https://developer.android.com/privacy-and-security/keystore).

## Synura Models

Data passed to views via the `models` object follows a specific structure used by the Synura protocol.

### Canonical Structure
The native model object consists of four optional fields:
-   **`message`** (String): Text content or JSON-serialized data.
-   **`code`** (Integer): Numeric data (counts, IDs, etc.).
-   **`value`** (Double): Decimal numeric data (ratings, percentages, etc.).
-   **`details`** (Array): A list of items (used for lists, comments, content blocks).

```json
{
  "message": "Hello World",
  "code": 123,
  "value": 123.45,
  "details": [...]
}
```

### Shorthands & Type Inference
To simplify development, you can pass standard JavaScript types, and Synura will automatically map them to the canonical structure:

| JavaScript Type | Maps To | Example |
| :--- | :--- | :--- |
| **String** | `{ message: "..." }` | `title: "Hello"` |
| **Number** | `{ value: 123.45, code: 123 }` | `rating: 4.5` |
| **Array** | `{ details: [...] }` | `contents: [item1, item2]` |
| **Generic Object** | `{ message: JSON.stringify(...) }` | `user: { name: "Bob", id: 1 }` |

> **Important:** If you pass an object that contains keys *other than* `message`, `code`, `value`, or `details` (e.g., `{ message: "Hello", user: "Bob" }`), it will be treated as a **Generic Object** and the entire object will be JSON-stringified into the `message` field. To use the explicit wrapper format, the object must *only* contain the allowed keys.

## View Types

Views are opened via `synura.open({ view: '/views/<type>', models: ..., styles: ... })`.

-   **[List View](list.md)** (`/views/list`): Lists, grids, galleries.
-   **[Post View](post.md)** (`/views/post`): Articles, posts, comments.
-   **[Chat View](chat.md)** (`/views/chat`): Messaging interface.
-   **[Settings View](settings.md)** (`/views/settings`): Forms and configuration.
-   **[Editor View](editor.md)** (`/views/editor`): Text editor with attachments.
-   **[Browser View](browser.md)** (`/views/browser`): In-app web browser.
-   **[Simple View](simple.md)** (`/views/simple`): Basic text display.
-   **[Markdown View](markdown.md)** (`/views/markdown`): Markdown rendering.
-   **[Source View](source.md)** (`/views/source`): Code viewer with syntax highlighting.

---

## Dialog Types

Dialogs are opened via `synura.open({ view: '/dialogs/<type>', ... })`. Unlike views, dialogs appear as modal overlays and do not navigate away from the current screen.

-   **[Input Dialog](input_dialog.md)** (`/dialogs/input`): Modal form input.
-   **[Confirmation Dialog](confirmation_dialog.md)** (`/dialogs/confirmation`): Simple alert/confirm.

---

## Events

Handle events in the `synura.connect` callback, or the optional callback passed to `synura.open`.

### Event Structure
```javascript
{
  eventId: "CLICK" | "LOAD" | "REFRESH" | "SCROLL_TO_END" | "MENU_CLICK" | "SUBMIT",
  context: {
    ...
  },
  data: {
    ...
  }
}
```

### Common Events
-   **`LOAD` / `REFRESH`**: Triggered when the view loads or user pulls to refresh.
-   **`CLICK`**: User clicked an item. `data` contains the item object (e.g., `{ link: "...", index: 0 }`).
-   **`SCROLL_TO_END`**: User scrolled to the bottom (List View). Fetch next page here.
-   **`MENU_CLICK`**: User clicked a menu item. `data.menu` contains the menu text.
-   **`AUTHOR_CLICK`**: User clicked the author. `data` contains `author` and optionally `link`.
-   **`SUBMIT`**: User submitted a form (Settings/Dialog). `data` contains form values.

---

## System Limitations

### Extension Size
-   **Maximum Script Size**: 128KB (131,072 bytes). Extensions exceeding this size will fail to install.

---

## Router Pattern & State Management

Synura uses a **passive router** architecture to enable content pre-fetching and instant navigation.

See **[Router Pattern](router.md)** for full documentation on:
-   **Router Handler (`router(url)`)**
-   **Threading Model**
-   **State Sharing**
-   **Caching Strategy**
