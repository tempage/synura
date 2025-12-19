# Synura Polyfill Guide

The **Synura Polyfill** allows you to test and debug your extension logic directly in a standard web browser (like Chrome, Edge, or Firefox) without needing to deploy it to the Synura app.

This works by "mocking" the Synura API (`synura.open`, `fetch`, etc.) so your script thinks it's running inside the app.

## How to Use

1.  **Open the Target Website**: Go to the website you want to scrape (e.g., `https://example.com`) in your desktop browser.
2.  **Open Developer Tools**: Press `F12` or `Right Click > Inspect` and go to the **Console** tab.
3.  **Paste the Polyfill**: Copy the contents of [`synura_polyfill.js`](synura_polyfill.js) and paste it into the console. Press Enter.
    *   You should see a message: `[Synura Polyfill] Visual Emulator Ready!`.
4.  **Paste Your Extension Code**: Copy the code from your extension's `.js` file (specifically the logic inside `handler` or your test functions) and paste it into the console.
5.  **Run Your Functions**: Manually call your functions to test them.
    *   Example: `handler.home()`
    *   Example: `fetchPost("https://example.com/article/123")`

## Features

*   **Mock `synura` Object**: Logs all calls to `open`, `update`, and `connect` to the console with colorful output so you can verify the data being sent to the UI.
    *   Includes `synura.isPolyfill = true`, allowing your extension to detect if it is running in the emulator vs. the real app.
*   **Visual Emulator**: Renders a floating UI overlay that mimics the Synura app interface, allowing you to see your views (List, Post, Chat, etc.) rendered in real-time.
*   **Reset Extension**: The reload button (🔄) now resets the `SYNURA` object and clears all views without reloading the page. This allows you to paste and test new code versions instantly while keeping the emulator active.
    *   *Note:* If you use `const SYNURA = ...`, the variable technically remains in memory (as per JavaScript rules), but pasting new code will overwrite it. For cleaner testing, consider using `var SYNURA = ...` in the console.
*   **Minimize Mode**: The minimize button (➖) collapses the emulator to a compact header bar, keeping it out of the way while you inspect the target website.
*   **Built-in Log Viewer**: Includes a "Logs" button (memo icon 📝) in the header. Clicking it opens a **separate popup window** showing all `console.log`, `warn`, and `error` output. This allows you to view logs side-by-side with the emulator.
*   **Simulated `fetch`**: Replaces the browser's `fetch` with a **synchronous** implementation (using `XMLHttpRequest`) to match Synura's behavior.
*   **Strict DOM Emulation**: The `response.dom()` method returns a wrapper that **strictly enforces** the limited DOM API available in the Synura runtime. This prevents you from accidentally using browser-only features (like `innerHTML` or `parentElement`) that would crash your extension in the real app.
*   **DOM Parsing**: Includes a JavaScript port of Synura's `parse('post', ...)` logic, so you can see exactly how your content will be structured (text blocks, images, videos).

## View Reference

### 1. List View (`/views/list`)

Displays a list of items.

**Styles:**
*   `title` (string): App bar title.
*   `layout` (string): `list` (default), `card`, or `gallery`.
*   `pagination` (bool): If true, triggers `SCROLL_TO_END` event when scrolling to bottom.
*   `menu` (bool): If true, shows a menu button (requires `models.menus`).
*   `authorClickable` (bool): If true, author name is clickable (triggers `AUTHOR_CLICK`).
*   `hotThreshold` (number): If `item.hotCount` exceeds this, shows a red border. Opacity scales with count.
*   `coldThreshold` (number): If `item.coldCount` exceeds this, shows a blue border. Opacity scales with count.
*   `reorderable` (bool): *Not visually supported in polyfill yet.*

**Models:**
*   `contents`: List of items.
    *   `details`: Array of objects (or JSON strings).
*   `append`: Use this in `synura.update` to add items to the end of the list.
*   `menus`: List of app bar menu items (strings).

**Item Structure (`CardItemModel`):**
```javascript
{
  title: "Item Title",
  link: "https://...",
  author: "Author Name",
  date: "2023-10-27",
  mediaUrl: "https://...", // Image URL
  
  // Optional Fields
  memo: "Short description",
  avatar: "https://...",
  category: "Category Name",
  types: ["Tag1", "Tag2"], // Badges
  menus: ["Share", "Report"], // Item-specific menu options
  
  // Stats (Numbers)
  viewCount: 100,
  likeCount: 50,
  commentCount: 10,
  dislikeCount: 0,
  hotCount: 0,
  coldCount: 0
}
```

### 2. Post View (`/views/post`)

Displays a detailed post with content and comments.

**Styles:**
*   `title` (string): App bar title.
*   `authorClickable` (bool): If true, author avatar/name is clickable.
*   `appbar` (object/string): Customizes the app bar (e.g. 'query').

**Models:**
*   `author`, `date`, `avatar`, `memo`: Strings.
*   `link`: String.
*   `viewCount`, `likeCount`, `dislikeCount`: Numbers.
*   `content`: List of content blocks.
    *   `details`: Array of JSON strings. Each block: `{ type: "text"|"image"|"video"|"link", value: "..." }`.
*   `comments`: List of comments.
    *   `details`: Array of JSON strings.
    *   Comment object:
        ```javascript
        {
          author: "User",
          date: "1h ago",
          content: "Comment text", // or array of blocks
          avatar: "https://...",
          level: 0 // Nesting level
        }
        ```

### 3. Chat View (`/views/chat`)

Displays a chat interface.

**Styles:**
*   `menu` (bool): If true, shows a menu button.
*   `appbar` (object/string): Customizes the app bar (e.g. 'query').

**Models:**
*   `append`: List of new messages.
    *   `details`: Array of objects (or JSON strings).
    *   Message object: `{ user: "Me"|"Other", message: "Hello", time: "..." }`.

### 4. Browser View (`/views/browser`)

Displays a web page within the app.

**Styles:**
*   `title` (string): App bar title.
*   `appbar` (object/string): Customizes the app bar (e.g. 'query').

**Models:**
*   `url`: The URL to load (string).

**Events:**
*   `SUBMIT`: Triggered when the user clicks the checkmark button.
    *   `data.cookies`: The cookies from the browser session (string).
    *   `data.url`: The current URL (string).

### 5. Markdown View (`/views/markdown`)

Displays text content formatted using Markdown.

**Styles:**
*   `title` (string): App bar title.
*   `menu` (bool): If true, shows a menu button (requires `models.menus`).
*   `appbar` (object/string): Customizes the app bar (e.g. 'query').

**Models:**
*   `content`: The markdown string to render.
    *   *Alternative*: `body` model.
*   `menus`: List of app bar menu items (strings).

## Strict DOM Environment

The Synura runtime uses a custom, lightweight HTML parser, not a full browser engine. The polyfill enforces these limitations:

*   **Supported Properties**: `textContent`, `innerText`, `tagName`, `className`, `classList`, `dataset`, `id`, `nodeType`, `childNodes`, `firstChild`, `lastChild`, `nextSibling`.
*   **Supported Methods**: `getAttribute(name)`, `hasAttribute(name)`, `querySelector(selector)`, `querySelectorAll(selector)`, `remove()`, `cloneNode(deep)`.
*   **NOT Supported**: `innerHTML`, `outerHTML`, `parentElement`, `previousSibling`, `style`, `addEventListener`, etc.

> [!IMPORTANT]
> If your code works in the browser but fails in the app, you are likely using an unsupported DOM property. The polyfill will now throw an error or return undefined for these properties to help you catch this early.

## Limitations & Common Issues

### 1. Content Security Policy (CSP)
Some modern websites block "unsafe-inline" scripts or connections to external APIs via **Content Security Policy**.
*   **Symptom**: `Refused to execute inline script...` or `Connect Error` in red text.
*   **Fix**: Use a separate, isolated browser profile for development where you can disable security features, or test on a site with a more permissive CSP.

### 2. Synchronous XHR Blocking
Modern browsers dislike **synchronous** network requests on the main thread.
*   **Symptom**: Console warnings saying `Synchronous XMLHttpRequest on the main thread is deprecated...`.
*   **Explanation**: **This is expected behavior.** The polyfill uses synchronous requests to accurately emulate the Synura runtime's `fetch` API.
*   **Impact**: It usually still works, but might freeze the page interface briefly while fetching. If it fails completely, the site might have a specific block.

### 3. Session Storage
Synura's `sessionStorage` supports storing **Objects**. Browsers only support **Strings**.
*   **Workaround**: The polyfill provides a `window.sessionStorageShim` object. However, if your script uses the global `sessionStorage` directly, it will use the browser's native one (string-only).
*   **Advice**: When testing in the console, assume `sessionStorage` is string-only or manually use `sessionStorageShim`.

### 4. CORS
Synura ignores CORS (Cross-Origin Resource Sharing). Browsers enforce it.
*   **Impact**: You generally can only `fetch` URLs from the **same domain** you are currently visiting.
*   **Fix**: Always run the test on the actual domain you are scraping. Do not try to fetch `example.com` while sitting on `google.com`.

### 5. Bypass Options
The `bypass` option in `fetch` (e.g., `chrome/windows`) is **ignored** by the polyfill because browsers cannot impersonate other browsers via JS. The polyfill will log a warning if you use it.

### 6. Cookie Headers
The `Cookie` header is a "forbidden header name" in browsers. `XMLHttpRequest` will silently ignore attempts to set it via `setRequestHeader()`.
*   **Impact**: Authenticated requests using `headers: { Cookie: "..." }` will **not work** in the polyfill, even though they work correctly in the real Synura app (Go backend).
*   **Workaround**: For testing authenticated flows, you must be **logged into the target website** in your browser first. The browser will automatically include its own cookies for same-origin requests.

### 7. Markdown Polyfill Limitations
The polyfill uses a lightweight, Regex-based Markdown parser to simulate the native view.
*   **No Nested Lists**: Only single-level lists are supported visually.
*   **Basic Syntax Highlighting**: Supports simple **JavaScript** and **Python** highlighting. Other languages render as plain text.
*   **Limited Tables**: Basic table styling is included, but complex table parsing might be fragile.
*   **No Raw HTML**: HTML tags in the markdown string are escaped for security, unlike the native implementation which might support some safe HTML.
*   **Edge Cases**: Complex markdown structures might not render perfectly compared to the real app's full Markdown engine.
