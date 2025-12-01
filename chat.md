# Chat View Documentation

The Chat View provides a messaging interface, suitable for chat applications or conversational UIs.

## View Path
`/views/chat`

## Styles
The `styles` object controls the appearance of the view.

| Key | Type | Description |
| :--- | :--- | :--- |
| `menu` | `boolean` | If `true`, enables the options menu in the app bar. |

## Models
The `models` object contains the chat data.

### Append
The `append` model is used to add new messages to the chat. It contains a `details` list of message objects.

#### Message Object

| Key | Type | Description |
| :--- | :--- | :--- |
| `user` | `string` | The name of the sender. Use `'Me'` for the current user to align messages to the right. |
| `message` | `string` | The message content. |
| `time` | `string` | Optional timestamp string. Defaults to current time if omitted. |

### Menus
The `menus` model contains a list of menu items to show if `menu` style is true.

## Events
The view sends the following events to the extension:

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `SUBMIT` | Triggered when the user sends a message. | `message`: The text content of the message. |
| `MENU_CLICK` | Triggered when a menu item is selected. | `menu`: The selected menu string. |

## Example Usage

```javascript
// Open the chat view
synura.open('/views/chat', {
    styles: { menu: true },
    models: {
        menus: { details: ["Clear Chat"] }
    }
});

// Append a message
synura.update(viewId, {
    models: {
        append: {
            details: [
                { user: "Bot", message: "Hello! How can I help you?" }
            ]
        }
    }
});
```
