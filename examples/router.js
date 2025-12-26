/**
 * Router Pattern Example
 * 
 * This example demonstrates the "Passive Router" pattern where the extension
 * exposes a pure 'router(url)' function. This function can be called by the
 * system (AI engine) in the background to pre-fetch content, or by the
 * view handler to perform navigation.
 */

var SYNURA = {
  name: "Router Example",
  version: 1,
  description: "Demonstrates router(url) and state sharing.",
  license: "Apache-2.0",
};

// Cache Helpers with TTL
const CACHE_TTL = 600000; // 10 minutes

const getCachedRoute = (url) => {
  const cached = sessionStorage.getItem(url);
  if (!cached) return null;
  const age = Date.now() - cached.timestamp;
  if (age < CACHE_TTL) {
    console.log(`Cache HIT (Valid, ${(age / 1000).toFixed(1)}s old)`);
    return cached;
  }
  console.log(`Cache HIT (Expired)`);
  sessionStorage.removeItem(url);
  return null;
};

const setCachedRoute = (url, routeData) => {
  routeData.timestamp = Date.now();
  sessionStorage.setItem(url, routeData);
};

const handler = {
  // -------------------------------------------------------------------------
  // 1. ROUTER (Background Thread / Main Thread)
  // 
  // Pure function that fetches URL and returns View Data.
  // DOES NOT call synura.open().
  // Handles caching internally using sessionStorage.
  // -------------------------------------------------------------------------
  router: function(url) {
    console.log("Router called for: " + url);

    // Check cache first
    const cached = getCachedRoute(url);
    if (cached) return cached;

    // Example: Reading shared state (e.g., auth token)
    // const token = sessionStorage.getItem("auth_token");
    // const headers = token ? { Authorization: token } : {};

    // Fetch content (simulated)
    // const doc = fetch(url, { headers: headers }).dom();

    // Return standard view structure
    const result = {
      view: '/views/post',
      timestamp: Date.now(), // Add timestamp for TTL
      models: {
        title: "Content from Router",
        content: {
          details: [{
            type: 'text',
            content: 'This content was fetched by the router.'
          }, {
            type: 'text',
            content: 'URL: ' + url
          }, {
            type: 'text',
            content: 'Timestamp: ' + new Date().toISOString()
          }]
        }
      },
      styles: {
        title: "Router View"
      }
    };

    // Store in cache
    setCachedRoute(url, result);
    return result;
  },

  // -------------------------------------------------------------------------
  // 2. VIEW HANDLER (Main Thread via User Interaction)
  // -------------------------------------------------------------------------
  home: function() {
    console.log("Opening home view...");
    synura.open({
      view: '/views/list',
      models: {
        contents: {
          details: [{
            title: "Article 1",
            description: "Click to load via router",
            license: "Apache-2.0",
            link: "https://example.com/article/1"
          }, {
            title: "Article 2",
            description: "Click to load via router",
            license: "Apache-2.0",
            link: "https://example.com/article/2"
          }]
        }
      },
      styles: {
        title: "Router Demo"
      }
    });
  },

  onViewEvent: function(viewId, event) {
    if (event.eventId === 'CLICK_LINK') {
      const url = event.data.link;
      console.log("User clicked: " + url);

      // Router handles caching internally
      const routeData = this.router(url);

      // Open View
      const v = synura.open(routeData);
      // Re-attach handlers to the new view
      synura.connect(v.id, {}, this.onViewEvent);
    }
  }
};