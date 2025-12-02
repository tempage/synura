# Settings View Documentation

The Settings View provides a structured way to present forms and configuration options to the user. It supports various input types and action buttons.

## View Path
`/views/settings`

## Styles
The `styles` object controls the appearance of the view.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed in the app bar. |
| `message` | `string` | An optional description or message displayed at the top of the form. |
| `appbar` | `object` or `string` | Customizes the app bar. See [List View](list.md#styles) for details. |

## Models
The `models` object contains the form definition.

### Body
The `body` model contains a list of form fields in its `details` property. Each field is an object with the following properties:

| Key | Type | Description |
| :--- | :--- | :--- |
| `type` | `string` | The input type: `'string'`, `'text'`, `'number'`, `'boolean'`. |
| `name` | `string` | The unique identifier for the field. Used in the `SUBMIT` event. |
| `label` | `string` | The display label for the field. |
| `value` | `any` | The initial value. |
| `format` | `string` | Optional format, e.g., `'password'` for obscured text. |

### Buttons
The `buttons.details` model is a `string[]` that lets you dynamically create any buttons you need. Each string in the array becomes a button with that label.

### Events
The view sends a `SUBMIT` event to the extension when any button is pressed.

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `SUBMIT` | Triggered when any button is pressed. | Contains key-value pairs of the form data, plus a `button` key with the name of the button that was clicked. |

## Example Usage

```javascript
synura.open('/views/settings', {
    styles: {
        title: "User Settings",
        message: "Please update your profile."
    },
    models: {
        body: {
            details: [
                { type: 'string', name: 'username', label: 'Username', value: 'user123' },
                { type: 'string', name: 'password', label: 'Password', format: 'password' },
                { type: 'boolean', name: 'notifications', label: 'Enable Notifications', value: true }
            ]
        },
        buttons: {
            details: ['Save', 'Cancel', 'Apply']
        }
    }
});

// In your event handler:
function onViewEvent(event) {
    if (event.eventId === 'SUBMIT') {
        switch (event.data.button) {
            case 'Save':
                // handle save
                break;
            case 'Cancel':
                // handle cancel
                break;
            case 'Apply':
                // handle apply
                break;
        }
    }
}
```
