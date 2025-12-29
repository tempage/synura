# Confirmation Dialog Documentation

The Confirmation Dialog is a simple modal dialog for displaying messages and getting user confirmation. It shows a title, an optional message/content, and one or more buttons.

## Dialog Path
`/dialogs/confirmation`

## Styles
The `styles` object controls the appearance of the dialog.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed at the top of the dialog. |
| `message` | `string` | The body text displayed in the dialog. |
| `close` | `boolean` | If `true`, displays a "Close" button that dismisses the dialog without submitting. |

## Models
The `models` object can contain optional buttons.

| Key | Type | Description |
| :--- | :--- | :--- |
| `buttons` | `string[]` | List of button labels. If not provided, a single "OK" button is shown. |

## Events
The dialog sends events to the extension when the user interacts with it.

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `SUBMIT` | Triggered when any button is pressed. | `button`: The label of the clicked button (if custom buttons provided). |
| `CLOSE` | Triggered when the dialog is dismissed by tapping outside. | None. |

## Example Usage

### Basic Confirmation

```javascript
const result = synura.open({
  view: '/dialogs/confirmation',
  styles: { title: "Success", message: "Your changes have been saved successfully." }
}, function(event) {
  if (event.eventId === 'SUBMIT') {
    synura.close(result.viewId);
  }
});
```

### With Custom Buttons

```javascript
const result = synura.open({
  view: '/dialogs/confirmation',
  styles: { title: "Delete Item", message: "This action cannot be undone." },
  models: {
    buttons: ["Delete", "Cancel"]
  }
}, function(event) {
  if (event.eventId === 'SUBMIT') {
    if (event.data.button === "Delete") {
      performDelete(itemId);
    }
    synura.close(result.viewId);
  }
});
```

### With Close Button

```javascript
synura.open({
  view: '/dialogs/confirmation',
  styles: { title: "Error", message: "Failed to load content.", close: true }
}, function(event) {
  if (event.eventId === 'CLOSE') {
    console.log('Dialog closed');
  }
});
```

## Notes

- The Confirmation Dialog is a lightweight alternative to the Input Dialog when you only need to display information and get acknowledgment.
- Unlike a native alert, this dialog integrates with the Synura event system, allowing you to handle the confirmation in your extension logic.
- For dialogs that require user input, use the [Input Dialog](input_dialog.md) instead.
