# Markdown View Documentation

The Markdown View is designed to display content formatted in Markdown.

## View Path
`/views/markdown`

## Styles
The `styles` object controls the appearance and behavior of the view.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed in the app bar. |
| `menu` | `boolean` | If `true`, enables the options menu in the app bar. |

## Models
The `models` object contains the data to be displayed.

| Key | Type | Description |
| :--- | :--- | :--- |
| `content` | `string` | The markdown formatted string to display. |
| `menus` | `list<string>` | List of menu items to show if `menu` style is true. |


## Events
The view sends the following events to the extension:

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `REFRESH` | Triggered when the user pulls to refresh. | None |
| `SCROLL_TO_END` | Triggered when the user scrolls to the bottom. | None |
| `MENU_CLICK` | Triggered when a menu item is selected. | `menu`: The selected menu string. |

## Example Usage

```javascript
synura.open('/views/markdown', {
    styles: {
        title: "Markdown Document"
    },
    models: {
        content: { message: "# Hello, Markdown! 
 This is a markdown document." }
    }
});
```

