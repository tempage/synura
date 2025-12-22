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
};

const handler = {
    // -------------------------------------------------------------------------
    // 1. ROUTER (Background Thread / Main Thread)
    // 
    // Pure function that fetches URL and returns View Data.
    // DOES NOT call synura.open().
    // -------------------------------------------------------------------------
    router: function (url) {
        console.log("Router called for: " + url);

        // Example: Reading shared state (e.g., auth token)
        // const token = sessionStorage.getItem("auth_token");
        // const headers = token ? { Authorization: token } : {};

        // Fetch content (simulated)
        // const doc = fetch(url, { headers: headers }).dom();

        // Return standard view structure
        return {
            view: '/views/post',
            timestamp: Date.now(), // Add timestamp for TTL
            models: {
                title: "Content from Router",
                content: {
                    details: [
                        { type: 'text', content: 'This content was fetched by the router.' },
                        { type: 'text', content: 'URL: ' + url },
                        { type: 'text', content: 'Timestamp: ' + new Date().toISOString() }
                    ]
                }
            },
            styles: {
                title: "Router View"
            }
        };
    },

    // -------------------------------------------------------------------------
    // 2. VIEW HANDLER (Main Thread via User Interaction)
    // -------------------------------------------------------------------------
    home: function () {
        console.log("Opening home view...");
        synura.open({
            view: '/views/list',
            models: {
                contents: {
                    details: [
                        {
                            title: "Article 1",
                            description: "Click to load via router",
                            link: "https://example.com/article/1"
                        },
                        {
                            title: "Article 2",
                            description: "Click to load via router",
                            link: "https://example.com/article/2"
                        }
                    ]
                }
            },
            styles: {
                title: "Router Demo"
            }
        });
    },

    onViewEvent: function (viewId, event) {
        if (event.eventId === 'CLICK_LINK') {
            const url = event.data.link;
            console.log("User clicked: " + url);

            // 1. Check Cache (Shared sessionStorage)
            let routeData;
            const cached = sessionStorage.getItem(url);

            if (cached) {
                // Check TTL (e.g., 60 seconds)
                const now = Date.now();
                if (now - cached.timestamp < 60000) {
                    console.log("Cache HIT (Valid)");
                    routeData = cached;
                } else {
                    console.log("Cache HIT (Expired) - Converting to MISS");
                    sessionStorage.removeItem(url);
                }
            }

            if (!routeData) {
                console.log("Cache MISS - Calling router() locally");
                // 2. Fallback: Call router() directly if not pre-fetched
                routeData = this.router(url);
                // Cache it
                sessionStorage.setItem(url, routeData);
            }

            // 3. Open View
            const v = synura.open(routeData);
            // Re-attach handlers to the new view
            synura.connect(v.id, {}, this.onViewEvent);
        }
    }
};
