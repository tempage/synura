const SYNURA = {
    name: "Wikipedia Featured",
    domain: "api.wikimedia.org",
    version: 0.1,
    api: 0,
    description: "Displays the Wikipedia featured article of the day.",
    bypass: "firefox",
    get main() { return handler; }
};

const handler = {
    home: function () {
        // 1. Get today's date in the required format (YYYY/MM/DD)
        const d = new Date();
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const today = `${year}/${month}/${day}`;

        // 2. Fetch the featured article
        const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${today}`;
        const response = fetch(url, {
            onProgress: (current, total) => {
                console.log(`Downloaded ${current} of ${total} bytes`);
            }
        });

        if (!response.ok) {
            console.log("Failed to fetch Wikipedia featured article");
            return;
        }

        const data = response.json();
        const article = data.tfa; // tfa = The Featured Article

        // 3. Create the view model
        const articleItem = {
            title: article.normalizedtitle,
            author: "Wikipedia",
            description: article.extract,
            link: article.content_urls.desktop.page
        };

        // 4. Open the List View
        const result = synura.open({
            view: '/views/list',
            styles: {
                title: "Wikipedia Featured",
                layout: "card"
            },
            models: {
                contents: {
                    details: [articleItem]
                }
            }
        });

        if (result.success) {
            // 5. Connect to handle clicks
            synura.connect(result.viewId, { from: "home" }, (event) => {
                this.onViewEvent(result.viewId, event);
            });
        }
    },

    onViewEvent: function (viewId, event) {
        console.log(JSON.stringify(event));
        if (event.eventId === 'CLICK') {
            const article = event.data;
            if (article.link) {
                // Open link in browser view
                synura.open({
                    view: '/views/browser',
                    models: { url: { message: article.link } }
                });
            }
        }
    }
};
