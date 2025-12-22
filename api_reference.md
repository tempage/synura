# Synura API Reference

This document details the JavaScript API available to Synura extensions.

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

### `fetch(url, options)`
A custom **synchronous** HTTP client (unlike Web API, it does **not** return a Promise).
-   **Options**:
    -   `method`: `'GET'` | `'POST'`
    -   `headers`: Object `{ "Key": "Value" }`
    -   `body`: String
    -   `onProgress`: **Synura Custom Option**. Function `(current, total) => { ... }`. Called during download. `current` and `total` are in bytes. `total` is -1 if unknown (e.g., chunked encoding).
-   **Returns**: A `Response` object with:
    -   `status`: (Number) The HTTP status code (e.g., 200, 404).
    -   `statusText`: (String) The status message corresponding to the status code (e.g., "OK", "Not Found").
    -   `ok`: (Boolean) `true` if the status code is in the range 200-299.
    -   `text()`: Returns response body as string.
    -   `json()`: Returns response body as JSON object.
    -   `dom(mimeType)`: **Synura Custom Function**. Returns a parsed DOM document (only `'text/html'` supported).

### DOM API
Objects returned by `response.dom()` or `document.querySelector` provide a subset of the standard DOM API.

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
    -   `getAttribute(name)`: Returns attribute value or empty string.
    -   `hasAttribute(name)`: Returns `true` if the attribute exists, `false` otherwise.
    -   `querySelector(selector)`: Returns the first matching child element.
    -   `querySelectorAll(selector)`: Returns a NodeList of matching child elements.
    -   `remove()`: Removes the element from its parent.
    -   `cloneNode(deep)`: Returns a clone of the node. If `deep` is true, the descendants are also cloned.

#### `Document` (from `dom()`)
-   `querySelector(selector)`
-   `querySelectorAll(selector)`

### `console`
-   `console.log(...args)`: Logs messages to the debug console (and logcat on Android).

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
// Local Storage (Persistent, Strings only)
localStorage.setItem("token", "12345");
const token = localStorage.getItem("token"); // "12345"

// Session Storage (Transient, Any type)
sessionStorage.setItem("cache", { lastPage: 1, items: [] });
const cache = sessionStorage.getItem("cache"); // Object
```

---

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

### 1. List View (`/views/list`)
Displays a list of items (articles, posts, etc.).

**Styles:**
-   `title` (String): App bar title.
-   `layout` (String): `'list'` (default), `'card'`, `'gallery'`.
-   `pagination` (Boolean): Enable infinite scrolling (triggers `SCROLL_TO_END` event).
-   `menu` (Boolean): Show menu button.

**Models:**
-   `contents`: `[ItemObject, ...]` (Array mapping to `details`)
    -   **ItemObject**:
        -   `title` (String)
        -   `link` (String): ID or URL for the item.
        -   `author` (String)
        -   `date` (String)
        -   `mediaUrl` (String): URL for image/video thumbnail.
        -   `mediaType` (String): `'image'` or `'video'`.
        -   `viewCount`, `likeCount`, `commentCount` (String)
-   `menus`: `["Menu Item 1", "Menu Item 2"]` (Array of Strings)
-   `append`: `[...]` (Use with `synura.update` to add items).

### 2. Post View (`/views/post`)
Displays a detailed post with content and comments.

**Styles:**
-   `title` (String)

**Models:**
-   `title`, `author`, `date`, `avatar` (Strings mapping to `message`)
-   `content`: `[ContentBlock, ...]` (Array mapping to `details`)
    -   **ContentBlock**: `{ type: 'text'|'image'|'video'|'link', value: "..." }`
-   `comments`: `[CommentObject, ...]` (Array mapping to `details`)
    -   **CommentObject**:
        -   `author`, `date`, `content` (Parsed content), `avatar`.
        -   `level` (Number): Indentation level for nested comments.

### 3. Chat View (`/views/chat`)
A chat interface.

**Models:**
-   `append`: `[ChatMessage, ...]`
    -   **ChatMessage**: `{ user: "Name", message: "Text", time: "ISO String" }`

### 4. Settings View (`/views/settings`)
A form for user configuration.

**Models:**
-   `body`: `[InputObject, ...]`
    -   **InputObject**:
        -   `type`: `'string'`, `'number'`, `'boolean'`.
        -   `name`: Key for the input.
        -   `label`: Display label.
        -   `value`: Default value.
        -   `format`: `'password'` (for strings).
-   `buttons`: `['submit', 'reset']` (Array of Strings)

### 5. Editor View (`/views/editor`)
A text/content editor.

> [!WARNING]
> The attachment file feature is currently experimental. Do not use it.

### 6. Browser View (`/views/browser`)
Opens an in-app browser.
-   **Models**: `url: "https://..."` (String)

---

## Dialog Types

Dialogs are opened via `synura.open('/dialogs/<type>', data)`. Unlike views, dialogs appear as modal overlays and do not navigate away from the current screen.

### Input Dialog (`/dialogs/input`)
A modal dialog for collecting user input with text fields, number inputs, and toggle switches. Supports custom buttons and an optional close button.

**Styles:** `title`, `message`, `close` (boolean)
**Models:** `body` (array of input fields), `buttons` (array of button labels)
**Events:** `SUBMIT`, `CLOSE`

See [Input Dialog Documentation](input_dialog.md) for full details and examples.

### Confirmation Dialog (`/dialogs/confirmation`)
A simple modal dialog for displaying messages and getting user acknowledgment. Shows a title, optional message, and an "OK" button.

**Styles:** `title`, `message`
**Events:** `SUBMIT`

See [Confirmation Dialog Documentation](confirmation_dialog.md) for full details and examples.

---

## Events

Handle events in the `synura.connect` callback, or the optional callback passed to `synura.open`.

### Event Structure
```javascript
{
    eventId: "CLICK" | "LOAD" | "REFRESH" | "SCROLL_TO_END" | "MENU_CLICK" | "SUBMIT",
    context: { ... }, // The context object passed to connect()
    data: { ... }     // Event-specific data
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

### 1. Router Handler (`router(url)`)
Instead of handling `open` directly in a click listener, extensions should export a `router(url)` function. This function is **pure** and returns the view data.

```javascript
const handler = {
    // Pure function: Returns data, does NOT call synura.open()
    router: function(url) {
        const doc = fetch(url).dom();
        return {
            view: '/views/post',
            models: { title: doc.querySelector('h1').text, ... },
            styles: { ... }
        };
    },
    ...
};
```

### 2. Threading Model
*   **View Handlers**: `onViewEvent` runs in the main UI thread context.
*   **Router**: `router(url)` runs in a **process pool** (background threads) to allow parallel pre-fetching.
    *   **Implication**: `router` cannot access the active `view` state directly.

### 3. State Sharing (`sessionStorage`)
To share state (like cookies or auth tokens) between the interactive View Handlers and the background Router:

1.  **Write**: Logic in `onViewEvent` saves tokens to `sessionStorage`.
2.  **Read**: `router` reads tokens from `sessionStorage` to make authenticated requests.

```javascript
// Shared state (e.g., auth token) is synced automatically across threads
const token = sessionStorage.getItem('auth_token');
const response = fetch(url, { headers: { 'Authorization': token } });
```

### 4. Automatic Caching
When `router(url)` is called by the system (e.g., for pre-fetching), the returned view data object is **automatically stored** in `sessionStorage` using the `url` as the key.

This means your View Handler can check `sessionStorage.getItem(url)` to instantly retrieve the pre-fetched result without calling `router()` again.

### 5. Freshness (TTL) Strategy
To ensure content freshness when using cached router data, you should:

1.  **Add Timestamp**: Include a `timestamp` field in the object returned by `router(url)`.
2.  **Check TTL**: In your View Handler, check if the cached item is older than your desired TTL (Time To Live).
3.  **Invalidate**: If expired, use `sessionStorage.removeItem(url)` and re-fetch.

```javascript
// Example: 60-second TTL
const cached = sessionStorage.getItem(url);
if (cached) {
    const age = Date.now() - cached.timestamp;
    if (age < 60000) {
        return cached; // Valid
    }
    sessionStorage.removeItem(url); // Expired
}
return router(url); // Re-fetch
```

