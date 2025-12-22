# Confirmation Dialog Documentation

The Confirmation Dialog is a simple modal dialog for displaying messages and getting user confirmation. It shows a title, an optional message, and an "OK" button.

## Dialog Path
`/dialogs/confirmation`

## Styles
The `styles` object controls the appearance of the dialog.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed at the top of the dialog. |
| `message` | `string` | An optional message or description displayed in the dialog body. |

## Models
This dialog does not use any models.

## Events
The dialog sends events to the extension when the user interacts with it.

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `SUBMIT` | Triggered when the "OK" button is pressed. | None. |

## Example Usage

### Basic Confirmation

```javascript
const result = synura.open('/dialogs/confirmation', {
    styles: {
        title: "Success",
        message: "Your changes have been saved successfully."
    }
}, function(event) {
    if (event.eventId === 'SUBMIT') {
        synura.close(result.viewId);
    }
});
```

### Error Notification

```javascript
synura.open('/dialogs/confirmation', {
    styles: {
        title: "Error",
        message: "Failed to load content. Please check your connection and try again."
    }
}, function(event) {
    if (event.eventId === 'SUBMIT') {
        // User acknowledged the error
        synura.close(event.viewId);
    }
});
```

### Warning Before Action

```javascript
function deleteItem(itemId) {
    const result = synura.open('/dialogs/confirmation', {
        styles: {
            title: "Delete Item",
            message: "This action cannot be undone. The item will be permanently deleted."
        }
    }, function(event) {
        if (event.eventId === 'SUBMIT') {
            // User confirmed, proceed with deletion
            performDelete(itemId);
            synura.close(result.viewId);
        }
    });
}
```

## Notes

- The Confirmation Dialog is a lightweight alternative to the Input Dialog when you only need to display information and get acknowledgment.
- Unlike a native alert, this dialog integrates with the Synura event system, allowing you to handle the confirmation in your extension logic.
- For dialogs that require user input, use the [Input Dialog](input_dialog.md) instead.
