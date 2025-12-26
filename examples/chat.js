const SYNURA = {
  name: "Chat View Example",
  version: 0.1,
  api: 0,
  description: "An example extension showing how to create a chat view with markdown support.",
  license: "Apache-2.0",
  get main() {
    return handler;
  }
};

const handler = {
  home: function() {
    const result = synura.open({
      view: '/views/chat',
      styles: {
        menu: true
      },
      models: {
        menus: ["Help", "Exit"],
        // Initial welcome message with markdown
        append: [{
          user: "Bot",
          message: "# Welcome!\n\nThis is a **chat view** example.\n\n- Type a message below\n- Click *Help* for info\n- Click *Exit* to close",
          format: "markdown"
        }]
      }
    }, { from: "chat" }, this.onViewEvent);
  },

  onViewEvent: function(event) {
    const viewId = event.viewId;

    if (event.eventId === "SUBMIT") {
      const userMessage = event.data.message;
      console.log("User sent:", userMessage);

      // Echo response with markdown
      synura.update(viewId, {
        models: {
          append: [{
            user: "Bot",
            message: "You said: **" + userMessage + "**",
            format: "markdown"
          }]
        }
      });
    } else if (event.eventId === "MENU_CLICK") {
      if (event.data.menu === "Exit") {
        synura.close(viewId);
      } else if (event.data.menu === "Help") {
        synura.update(viewId, {
          models: {
            append: [{
              user: "Bot",
              message: "## Help\n\n| Command | Description |\n|:--------|:------------|\n| Type text | Send a message |\n| Exit | Close the chat |",
              format: "markdown"
            }]
          }
        });
      }
    }
  }
};