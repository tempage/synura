# Editor View Documentation

The Editor View provides a text editing interface with support for file attachments (images, videos).

## View Path
`/views/editor`

## Styles
The `styles` object controls the behavior of the editor.

| Key | Type | Description |
| :--- | :--- | :--- |
| `acceptableFileType` | `string` | Comma-separated list of allowed file types: `'image'`, `'video'`, or `'any'`. |
| `max` | `number` | Maximum number of files that can be attached. Default is 1. |

## Models
The editor view manages its own internal state for text and attachments. Initial content population is not currently supported via models.

## Events
The view sends the following events to the extension:

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `SUBMIT` | Triggered when the user taps the checkmark button. | `content`: The text content. `attachment_paths`: Comma-separated list of local file paths. |
| `CLOSE` | Triggered when the user taps the close button. | None |

## Example Usage

```javascript
synura.open('/views/editor', {
    styles: {
        acceptableFileType: "image,video",
        max: 3
    }
});
```
