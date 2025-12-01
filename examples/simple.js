const SYNURA = {
    name: "Simple View Example",
    version: 0.1,
    api: 0,
    description: "Demonstrates how to use the Simple View.",
    get main() { return _handler }
};

const _handler = {
    home: function () {
        const result = synura.open('/views/simple', {
            styles: {
                title: "Welcome"
            },
            models: {
                content: { message: "Hello! This is a simple text view." }
            }
        });

        if (result.success) {
            console.log("Simple view opened successfully.");
        } else {
            console.error("Failed to open simple view:", result.error);
        }
    }
};