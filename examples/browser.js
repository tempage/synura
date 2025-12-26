const SYNURA = {
  name: "Browser View Example",
  version: 0.1,
  api: 0,
  description: "Demonstrates how to use the Browser View.",
  license: "Apache-2.0",
  get main() {
    return handler;
  }
};

const handler = {
  home: function() {
    const result = synura.open({
      view: '/views/browser',
      styles: {
        title: "Google"
      },
      models: {
        url: {
          message: "https://google.com"
        }
      }
    });

    if (result.success) {
      synura.connect(result.viewId, {
        from: "browser"
      }, this.onViewEvent);
    }
  },

  onViewEvent: function(event) {
    if (event.eventId === "SUBMIT") {
      console.log("Cookies extracted:", event.data.cookies);
      console.log("From URL:", event.data.url);

      synura.update(event.viewId, {
        models: {
          snackbar: {
            message: "Cookies captured!"
          }
        }
      });
      synura.close(event.viewId);
    } else if (event.eventId === "CLOSE") {
      console.log("Browser closed.");
    }
  }
};