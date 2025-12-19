# Source View Documentation

The Source View is designed to display source code with syntax highlighting. It's optimized for performance with large files compared to the Markdown View.

## View Path
`/views/source`

## Styles
The `styles` object controls the appearance and behavior of the view.

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `"Source"` | The title displayed in the app bar. |
| `language` | `string` | auto-detect | The programming language for syntax highlighting (e.g., `javascript`, `python`, `dart`, `go`, `html`). |
| `lineNumbers` | `boolean` | `true` | Whether to show line numbers. |
| `wordWrap` | `boolean` | `false` | Whether to wrap long lines. |

## Models
The `models` object contains the data to be displayed.

| Key | Type | Description |
| :--- | :--- | :--- |
| `content` | `string` | The source code to display. |

## Events
The view sends the following events to the extension:

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `REFRESH` | Triggered when the user pulls to refresh. | None |
| `SCROLL_TO_END` | Triggered when the user scrolls to the bottom. | None |

## Features
- **Copy to clipboard**: A copy button in the app bar allows copying all content.
- **Auto-detect language**: If `language` is not specified, the view will attempt to detect it automatically.
- **Theme-aware**: Uses Dracula theme in dark mode and GitHub theme in light mode.

## Example Usage

```javascript
synura.open('/views/source', {
    styles: {
        title: "example.py",
        language: "python",
        lineNumbers: true,
        wordWrap: false
    },
    models: {
        content: "def hello():\n    print('Hello, World!')"
    }
});
```

