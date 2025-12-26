# Getting Started with Synura Extensions

> "Ecosystem, Developer Experience (DX) is everything."

This guide will walk you through creating your first Synura extension.

## Data-Driven Views

Synura uses a **Data-Driven** architecture that inverts the traditional web development model:

| Traditional (HTML) | Synura |
|-------------------|--------|
| Write HTML structure first | Write JavaScript data first |
| Add JS for interactivity | Views render automatically |
| You control every pixel | Strict, optimized view templates |
| Markup → Logic | **Data → Views** |

**How it works:**
1. Your extension provides **data** (JavaScript objects)
2. You specify a **view type** (`list`, `post`, `chat`, etc.)
3. Synura **renders the UI natively** - no HTML, no CSS

```javascript
// You write data, not markup
synura.open({
  view: '/views/list',
  models: {
    contents: [
      { title: "Article 1", author: "Alice", date: "Today" },
      { title: "Article 2", author: "Bob", date: "Yesterday" }
    ]
  }
});
// Synura renders a native list automatically
```

**Benefits:**
- 🚀 **Faster development** - No UI code to write
- 📱 **Native performance** - Views are optimized for each platform  
- 🎨 **Consistent UX** - All extensions look polished
- 🔒 **Secure** - No DOM manipulation, no XSS risks

## Development Tools

We provide a **Visual Polyfill** that simulates the Synura environment directly in your web browser. This allows you to develop and debug extensions using standard DevTools before testing them on the device. Enable **Debug Mode** to set breakpoints and step through your handler functions.

*   **[Polyfill Guide](polyfill_guide.md)**: Read this first! It explains how to use the emulator.
*   **[synura_polyfill.js](synura_polyfill.js)**: The emulator script.

## Prerequisites

- A text editor (VS Code, Sublime Text, etc.).
- The Synura application installed on your device.

## Extension Structure

A Synura extension is a single JavaScript file that exports a `SYNURA` object containing metadata and the extension logic.

### The `SYNURA` Object

The `SYNURA` object serves as the manifest and entry point for your extension.

```javascript
var SYNURA = {
  name: "My First Extension",
  api: 0,
  version: 0.1,
  description: "A simple hello world extension.",
  license: "Apache-2.0",
  domain: "example.com",
  icon: "emoji:📖",
  bypass: "firefox",
  main: {
    home: function() {},
    deeplink: function(url) {
      return true;
    },
    resume: function(viewId, context) {}
  }
};
```

-   **domain**: The `fetch` API can only fetch data from this domain.
-   **icon**: The icon must be a URL. It can be an HTTP(S) URL to an image (hosted on the same `domain`) or an Emoji URL (e.g., `emoji:📖`). If omitted, `https://<domain>/favicon.ico` is used by default.

### The `main` Object

The `main` object (inside `SYNURA`) must define a `home` function, which is the entry point when the user opens your extension.

```javascript
main: {
  home: function() {},
  deeplink: function(url) {
    return true;
  },
  resume: function(viewId, context) {}
}
```

### Deep Linking

You can enable deep linking to allow your extension to handle links matching your `domain`.

1.  Add `deeplink: true` to your `SYNURA` object.
2.  Implement the `deeplink(url)` function in your `main` object.

```javascript
const SYNURA = {
  domain: "example.com",
  deeplink: true,
  main: {
    deeplink: function(url) {
      if (url.includes("/post/")) {
        synura.open("/views/post", {
          models: {
            link: url,
          }
        });
        return true;
      }
      return false;
    }
  }
};
```

### Bookmarks

Synura supports bookmarking views. Users can browse their bookmarks, which display the cached state of the view (snapshot).

However, if the user wants to interact with the view again (restore it to a live runtime), they will tap the **restore icon** in the bookmark list. This action triggers the `resume` function in your extension instead of `home`.

Your extension **must** implement `resume` to re-attach event listeners to the restored view.

```javascript
resume: function(viewId, context) {
  synura.connect(viewId, context, function(event) {
    if (event.eventId === "LOAD") {}
  });
}
```

### Domain Launcher Support

You can allow users to install your extension by simply typing your website domain (e.g., `https://example.com`) into Synura.

1.  **Host `synura.js`**: Place your extension file at `https://yourdomain.com/synura.js`.
2.  **Configure `SYNURA.domain`**: Ensure the `domain` field in your `SYNURA` object matches your hosting domain.

```javascript
const SYNURA = {
  name: "My Extension",
  domain: "yourdomain.com",
};
```

    When a user enters `yourdomain.com` or `https://yourdomain.com`, Synura will automatically fetch `https://yourdomain.com/synura.js`, verify the domain match, and install the extension. If no protocol is provided, `https://` is used by default.

## DOM API Support

### CSS Selectors

The internal DOM engine supports the following CSS selectors for `querySelector` and `querySelectorAll`:

*   **Tag Name**: Selects elements by tag name (e.g., `div`, `a`).
*   **Class**: Selects elements by class name (e.g., `.content`, `.active`).
*   **ID**: Selects elements by ID (e.g., `#main`).
*   **Attributes**: Selects elements by attribute presence or value (e.g., `[href]`, `[data-type="post"]`).
*   **Compound**: Combines tag, class, and ID (e.g., `div.content`, `a#link.active`).
*   **Descendant**: Selects nested elements (e.g., `div p` selects all `<p>` inside `<div>`).
*   **Direct Child**: Selects direct children (e.g., `ul > li`).

### Element Methods

In addition to `querySelector` and `querySelectorAll`, the `Element` object supports:

*   **`getAttribute(name)`**: Returns the value of the specified attribute. Returns an empty string if the attribute does not exist.

## Your First Extension: Hello World
Let's create a simple extension that displays a list with a single item.

1.  Create a file named `hello_world.js`.
2.  Paste the following code:

```javascript
var SYNURA = {
  name: "Hello World",
  api: 0,
  version: 0.1,
  description: "My first Synura extension.",
  license: "Apache-2.0",
  main: {
    home: function() {
      synura.open('/views/list', {
        styles: {
          title: "Hello World Extension"
        },
        models: {
          contents: [{
            title: "Welcome to Synura!",
            author: "Me",
            date: new Date().toLocaleDateString()
          }]
        }
      });
    }
  }
};
```

3.  Save the file.
4.  Load the extension into Synura (refer to the app's import instructions).
5.  Open the extension from the main menu. You should see a list with "Welcome to Synura!".

## Next Steps

- Explore the **[API Reference](api_reference.md)** to learn about other view types like `post`, `chat`, and `settings`.
- Check out **[Examples](examples.md)** for more complex use cases.
