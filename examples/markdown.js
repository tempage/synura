const SYNURA = {
    name: "Markdown View Example",
    version: 0.1,
    api: 0,
    description: "An example extension showing how to create a markdown view.",
    get main() { return handler; }
};

const handler = {
    home: function () {
        const result = synura.open('/views/markdown', {
            styles: {
                title: "Markdown Example"
            },
            models: {
                content: { message: "# Hello Markdown\n\nThis is a simple markdown example.\n\n*   List item 1\n*   List item 2\n\n```javascript\nconsole.log(\"Hello, World!\");\n```" }
            }
        });

        if (result.success) {
            synura.connect(result.viewId, { from: "markdown" }, this.onViewEvent);
        }
    },

    onViewEvent: function (event) {
        if (event.eventId === "REFRESH") {
            console.log("Refreshing markdown...");
            // You can update the content here if needed
        }
    }
};
