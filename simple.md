# Simple View Documentation

The Simple View is a basic view designed to display a title and a centered text message. It is useful for showing simple information, errors, or status messages.

## View Path
`/views/simple`

## Styles
The `styles` object controls the appearance of the view.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed in the app bar. |

## Models
The `models` object contains the data to be displayed.

| Key | Type | Description |
| :--- | :--- | :--- |
| `content` | `string` | The main text content displayed in the center of the screen. |

## Events
This view does not emit any specific events other than standard navigation events (back button).

## Example Usage

```javascript
synura.open('/views/simple', {
    models: {
        title: "Hello World",
        content: "This is a simple view."
    }
});
```
