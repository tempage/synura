# Browser View Documentation

The Browser View displays a web page within the application. It supports extracting cookies from the session.

## View Path
`/views/browser`

## Styles
The `styles` object controls the appearance of the view.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed in the app bar. |
| `appbar` | `object` or `string` | Customizes the app bar. See [List View](list.md#styles) for details. |

## Models
The `models` object contains the URL to load.

| Key | Type | Description |
| :--- | :--- | :--- |
| `url` | `string` | The URL to load in the webview. |

## Events
The view sends the following events to the extension:

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `SUBMIT` | Triggered when the user confirms cookie extraction (checkmark button). | `cookies`: The document cookies string. `url`: The current URL. |
| `CLOSE` | Triggered when the user closes the view. | None |

## Example Usage

```javascript
synura.open('/views/browser', {
    styles: {
        title: "Login Page"
    },
    models: {
        url: "https://example.com/login"
    }
});
```
