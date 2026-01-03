const SYNURA = {
  name: "Settings View Example",
  version: 0.1,
  api: 0,
  description: "Demonstrates how to use the Settings View.",
  license: "Apache-2.0",
  get main() {
    return handler;
  }
};

// Define the form structure to be reused
const initialFormFields = [{
  type: 'string',
  name: 'apiKey',
  label: 'API Key',
  value: ''
}, {
  type: 'number',
  name: 'limit',
  label: 'Item Limit',
  value: 20
}, {
  type: 'boolean',
  name: 'darkMode',
  label: 'Dark Mode',
  value: false
}, {
  type: 'select',
  name: 'theme',
  label: 'Theme',
  value: 'system',
  options: ['light', 'dark', 'system']
}];

const handler = {
  home: function() {
    const result = synura.open({
      view: '/views/settings',
      styles: {
        title: "Configuration",
        message: "Configure your extension settings below."
      },
      models: {
        body: {
          details: initialFormFields
        },
        buttons: {
          details: ['Save', 'Reset', 'Cancel', 'Dialog']
        }
      }
    });

    if (result.success) {
      synura.connect(result.viewId, {
        from: "settings"
      }, (e) => handler.onViewEvent(e));
    }
  },

  onViewEvent: function(event) {
    console.log(JSON.stringify(event));
    if (event.eventId === "SUBMIT") {
      const button = event.data.button;
      console.log(`'${button}' button clicked.`);

      switch (button) {
        case 'Save':
          // Here you would typically save the settings from event.data
          console.log("Settings submitted:", JSON.stringify(event.data));
          synura.update(event.viewId, {
            models: {
              snackbar: {
                message: "Settings saved successfully!"
              }
            }
          });
          // Close the view after saving
          synura.close(event.viewId);
          break;
        case 'Reset':
          console.log("Settings reset requested.");
          // The extension is responsible for resetting the values to their initial state.
          synura.update(event.viewId, {
            models: {
              body: {
                details: initialFormFields
              },
              snackbar: {
                message: "Settings have been reset."
              }
            }
          });
          break;
        case 'Cancel':
          console.log("Settings cancelled.");
          synura.close(event.viewId);
          break;
        case 'Dialog':
          console.log("Opening dialog to edit settings...");
          const settingsViewId = event.viewId;

          // Get the current values from the settings form to populate the dialog
          const currentFields = initialFormFields.map(field => {
            if (event.data.hasOwnProperty(field.name)) {
              return Object.assign({}, field, {
                value: event.data[field.name]
              });
            }
            return field;
          });

          const dialogResult = synura.open({
            view: '/dialogs/input',
            styles: {
              title: 'Edit Settings',
              close: true,
            },
            models: {
              body: {
                details: currentFields
              },
              buttons: {
                details: ['OK', 'Cancel']
              }
            }
          });

          if (dialogResult.success) {
            synura.connect(dialogResult.viewId, {
              from: "dialog"
            }, (dialogEvent) => {
              if (dialogEvent.eventId === 'SUBMIT') {
                if (dialogEvent.data.button === 'OK') {
                  console.log('Dialog submitted with data:', JSON.stringify(dialogEvent.data));

                  // Create a new field structure based on the dialog's output
                  const newFields = initialFormFields.map(field => {
                    if (dialogEvent.data.hasOwnProperty(field.name)) {
                      return Object.assign({}, field, {
                        value: dialogEvent.data[field.name]
                      });
                    }
                    return field;
                  });

                  // Update the main settings view with the new values
                  synura.update(settingsViewId, {
                    models: {
                      body: {
                        details: newFields
                      }
                    }
                  });
                }
                // Close the dialog regardless of OK or Cancel
                synura.close(dialogResult.viewId);
              }
            });
          }
          break;
      }
    }
  }
};