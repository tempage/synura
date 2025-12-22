const SYNURA = {
    name: "Chat View Example",
    version: 0.1,
    api: 0,
    description: "An example extension showing how to create a chat view.",
    get main() { return handler; }
};

const handler = {
    home: function () {
        const result = synura.open({
            view: '/views/chat',
            styles: { menu: true },
            models: {
                menus: { details: ["Help", "Exit"] }
            }
        });

        if (result.success) {
            synura.connect(result.viewId, { from: "chat" }, this.onViewEvent);

            // Send a welcome message
            synura.update(result.viewId, {
                models: {
                    append: {
                        details: [
                            { user: "Bot", message: "Welcome to the chat! Type something." }
                        ]
                    }
                }
            });
        }
    },

    onViewEvent: function (event) {
        const viewId = event.viewId;

        if (event.eventId === "SUBMIT") {
            const userMessage = event.data.message;
            console.log("User sent:", userMessage);

            // Echo response
            const response = "You said: " + userMessage;

            synura.update(viewId, {
                models: {
                    append: {
                        details: [
                            { user: "Bot", message: response }
                        ]
                    }
                }
            });
        } else if (event.eventId === "MENU_CLICK") {
            if (event.data.menu === "Exit") {
                synura.close(viewId);
            }
        }
    }
};
