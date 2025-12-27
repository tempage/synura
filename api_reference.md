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
localStorage.setItem("token", "12345");
const token = localStorage.getItem("token");
sessionStorage.setItem("cache", {
  lastPage: 1,
  items: []
});
const cache = sessionStorage.getItem("cache");
```

### `URLSearchParams`
The standard Web API for working with URL query strings is available. See [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) for full API reference.

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

