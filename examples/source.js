const SYNURA = {
    name: "Source View Example",
    version: 0.1,
    api: 0,
    description: "An example extension showing how to create a source code view.",
    get main() { return handler; }
};

const handler = {
    home: function () {
        // Sample Python code to display
        const pythonCode = `#!/usr/bin/env python3
"""A simple example script."""

def fibonacci(n):
    """Generate Fibonacci sequence up to n."""
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

def main():
    print("Fibonacci sequence up to 100:")
    for num in fibonacci(100):
        print(num, end=' ')
    print()

if __name__ == "__main__":
    main()
`;

        const result = synura.open({
            view: '/views/source',
            styles: {
                title: "fibonacci.py",
                language: "python",
                lineNumbers: true,
                wordWrap: false
            },
            models: {
                content: { message: pythonCode }
            }
        });

        if (result.success) {
            synura.connect(result.viewId, { from: "source" }, this.onViewEvent);
        }
    },

    onViewEvent: function (event) {
        if (event.eventId === "REFRESH") {
            console.log("Refreshing source...");
        }
    }
};
