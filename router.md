# Router Pattern

Synura uses a **passive router** architecture to enable content pre-fetching and instant navigation.

## Overview

Instead of handling `open` directly in a click listener, extensions should export a `router(url)` function. This function is **pure** and returns the view data.

```javascript
const handler = {
  router: function(url) {
    const doc = fetch(url).dom();
    return {
      view: '/views/post',
      models: {
        title: doc.querySelector('h1').text,
        ...
      },
      styles: {
        ...
      }
    };
  },
  ...
};
```

## Threading Model

*   **View Handlers**: `onViewEvent` runs in the main UI thread context.
*   **Router**: `router(url)` runs in a **worker pool** (background threads) to allow parallel pre-fetching.

### Worker Runtime Restrictions

The background worker runtimes used for `router(url)` have a restricted API surface to ensure safety and statelessness.

**Allowed APIs:**
*   `fetch(url, options)`: Fully supported for network requests.
*   `console.log(...)`: Logs to the system debug output.
*   `DOMParser`: Available for parsing HTML content.
*   `localStorage` / `sessionStorage`: Shared with the main runtime to allow reading/writing state (e.g., tokens).

**Restricted APIs (No-op):**
The following UI-manipulation methods are non-functional (no-op) in the worker environment:
*   `synura.open()`
*   `synura.close()`
*   `synura.update()`
*   `synura.connect()`

## State Sharing

To share state (like cookies or auth tokens) between the interactive View Handlers and the background Router:

1.  **Write**: Logic in `onViewEvent` saves tokens to `sessionStorage`.
2.  **Read**: `router` reads tokens from `sessionStorage` to make authenticated requests.

```javascript
const token = sessionStorage.getItem('auth_token');
const response = fetch(url, {
  headers: {
    'Authorization': token
  }
});
```

## Caching Strategy

Your `router(url)` function should implement caching using `sessionStorage` to avoid redundant network requests. This is especially important for pre-fetched content.

### Recommended Pattern

1.  **Check Cache First**: At the start of `router(url)`, check if a valid cached result exists.
2.  **Store Results**: After fetching and processing, store the result in `sessionStorage`.
3.  **Use TTL**: Include a `timestamp` field to implement Time To Live (TTL) expiration.

### Cache Helper Functions

```javascript
const CACHE_TTL = 600000;
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
```

### Router with Caching

```javascript
router: function(url) {
  const cached = getCachedRoute(url);
  if (cached) return cached;
  const doc = fetch(url).dom();
  const result = {
    view: '/views/post',
    timestamp: Date.now(),
    models: {
      title: doc.querySelector('h1').text,
      ...
    },
    styles: {
      ...
    }
  };
  setCachedRoute(url, result);
  return result;
}
```

## View Handler Integration

When handling user clicks, simply call `router()` - it handles caching internally:

```javascript
onViewEvent: function(viewId, event) {
  if (event.eventId === 'CLICK') {
    const url = event.data.link;
    const routeData = this.router(url);
    synura.open(routeData);
  }
}
```
