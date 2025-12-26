# Chat View Documentation

The Chat View provides a messaging interface, suitable for chat applications or conversational UIs.

## View Path
`/views/chat`

## Styles
The `styles` object controls the appearance of the view.

| Key | Type | Description |
| :--- | :--- | :--- |
| `menu` | `boolean` | If `true`, enables the options menu in the app bar. |
| `appbar` | `object` or `string` | Customizes the app bar. See [List View](list.md#styles) for details. |

## Models
The `models` object contains the chat data.

### Append
The `append` model is used to add new messages to the chat. It can be an array of message objects or a single message object.

#### Message Object

| Key | Type | Description |
| :--- | :--- | :--- |
| `user` | `string` | The name of the sender. Use `'Me'` for the current user to align messages to the right. |
| `message` | `string` | The message content. Supports plain text or markdown depending on `format`. |
| `time` | `string` | Optional timestamp string. Defaults to current time if omitted. |
| `format` | `string` | Optional. Set to `"markdown"` or `"md"` to render the message as markdown. Defaults to plain text. |

### Menus
The `menus` model contains a list of menu items to show if `menu` style is true.

## Events
The view sends the following events to the extension:

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `SUBMIT` | Triggered when the user sends a message. | `message`: The text content of the message. |
| `MENU_CLICK` | Triggered when a menu item is selected. | `menu`: The selected menu string. |

## Example Usage

### Basic Chat
```javascript
synura.open({
  view: '/views/chat',
  styles: {
    menu: true
  },
  models: {
    menus: ["Clear Chat", "Exit"]
  }
});
synura.update(viewId, {
  models: {
    append: [{
      user: "Bot",
      message: "Hello! How can I help you?"
    }]
  }
});
```

### Markdown Messages
```javascript
synura.update(viewId, {
  models: {
    append: [{
      user: "System",
      message: "# Welcome\n**Bold text** and `inline code`\n\n- List item 1\n- List item 2",
      format: "markdown"
    }]
  }
});
```
