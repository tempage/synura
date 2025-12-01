const SYNURA = {
    name: "Editor View Example",
    version: 0.1,
    api: 0,
    description: "An example extension showing how to use the editor view.",
    bypass: "chrome/windows",
    get main() { return handler; }
};

const handler = {
    home: function () {
        const result = synura.open('/views/editor', {
            styles: {
                acceptableFileType: "image",
                max: 5
            }
        });

        if (result.success) {
            synura.connect(result.viewId, { from: "editor" }, this.onViewEvent);
        }
    },

    onViewEvent: function (event) {
        console.log(JSON.stringify(event));
        if (event.eventId === "SUBMIT") {
            console.log("Editor submitted.");
            console.log("Content:", event.data.content);
            console.log("Attachments:", event.data.attachment_paths);

            synura.update(event.viewId, {
                models: {
                    snackbar: { message: "Post submitted successfully!" }
                }
            });
            synura.close(event.viewId);
        } else if (event.eventId === "CLOSE") {
            console.log("Editor closed.");
        }
    }
};
