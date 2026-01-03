# Input Dialog Documentation

The Input Dialog is a modal dialog that collects user input. It supports the same input types as the Settings View but is displayed as a popup overlay rather than a full-screen view.

## Dialog Path
`/dialogs/input`

## Styles
The `styles` object controls the appearance of the dialog.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed at the top of the dialog. |
| `message` | `string` | An optional description displayed below the title. |
| `close` | `boolean` | If `true`, displays a "Close" button that dismisses the dialog without submitting. |

## Models
The `models` object contains the form definition.

### Body
The `body` model contains a list of input fields. Each field is an object with the following properties:

| Key | Type | Description |
| :--- | :--- | :--- |
| `type` | `string` | The input type: `'string'`, `'text'`, `'number'`, `'boolean'`, `'select'`. |
| `name` | `string` | The unique identifier for the field. Used as the key in the `SUBMIT` event data. |
| `label` | `string` | The display label for the field. |
| `value` | `any` | The initial value. |
| `format` | `string` | Optional format, e.g., `'password'` for obscured text input. |
| `lines` | `number` | Optional. Number of visible lines for multi-line text input. Only applies to `string`/`text` types. |
| `options` | `string[]` | Required for `'select'` type. Array of option strings. |

#### Input Types

- **`string` / `text`**: A text input field. Single-line by default, or multi-line if `lines` is specified.
- **`number`**: A numeric input field with number keyboard.
- **`boolean`**: A toggle switch.
- **`select`**: A dropdown menu. Requires `options` array of strings.

### Buttons
The `buttons` model is a `string[]` where each string becomes a button label. When clicked, the form data is submitted along with which button was pressed.

## Events
The dialog sends events to the extension when the user interacts with it.

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `SUBMIT` | Triggered when any button is pressed. | Contains key-value pairs of all form fields, plus a `button` key with the label of the clicked button. |
| `CLOSE` | Triggered when the close button is pressed (if `close: true`). | None. |

## Example Usage

### Basic Input Dialog

```javascript
const result = synura.open({
  view: '/dialogs/input',
  styles: {
    title: "Login",
    message: "Please enter your credentials."
  },
  models: {
    body: [{
      type: 'string',
      name: 'username',
      label: 'Username'
    }, {
      type: 'string',
      name: 'password',
      label: 'Password',
      format: 'password'
    }],
    buttons: ['Login', 'Cancel']
  }
}, function(event) {
  if (event.eventId === 'SUBMIT') {
    if (event.data.button === 'Login') {
      console.log('Username:', event.data.username);
      console.log('Password:', event.data.password);
      synura.close(result.viewId);
    } else if (event.data.button === 'Cancel') {
      synura.close(result.viewId);
    }
  }
});
```

### Dialog with Close Button

```javascript
synura.open({
  view: '/dialogs/input',
  styles: {
    title: "Settings",
    close: true
  },
  models: {
    body: [{
      type: 'number',
      name: 'pageSize',
      label: 'Items per page',
      value: 20
    }, {
      type: 'boolean',
      name: 'darkMode',
      label: 'Dark Mode',
      value: false
    }],
    buttons: ['Apply']
  }
}, function(event) {
  if (event.eventId === 'SUBMIT') {
    console.log('Page size:', event.data.pageSize);
    console.log('Dark mode:', event.data.darkMode);
  } else if (event.eventId === 'CLOSE') {
    console.log('Dialog closed without saving');
  }
});
```

## Notes

- Unlike full-screen views, dialogs appear as overlays and do not navigate away from the current view.
- The dialog automatically closes when `synura.close(viewId)` is called.
- Form values are accessible via `event.data.<fieldName>` where `<fieldName>` is the `name` property of each input field.
