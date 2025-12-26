const SYNURA = {
  name: "Confirmation Dialog Example",
  version: 0.1,
  api: 0,
  description: "An example extension showing how to use confirmation dialogs for notifications and confirmations.",
  license: "Apache-2.0",
  get main() {
    return handler;
  }
};

const handler = {
  items: [{
    id: 1,
    title: "First Item"
  }, {
    id: 2,
    title: "Second Item"
  }, {
    id: 3,
    title: "Third Item"
  }],

  home: function() {
    this.showList();
  },

  showList: function() {
    const self = this;
    const result = synura.open({
      view: '/views/list',
      styles: {
        title: "My Items",
        menu: true
      },
      models: {
        contents: this.items.map(function(item) {
          return {
            title: item.title,
            link: item.id.toString()
          };
        }),
        menus: ["Delete All", "About"]
      }
    }, function(event) {
      self.onListEvent(event, result.viewId);
    });
  },

  onListEvent: function(event, viewId) {
    const self = this;

    if (event.eventId === 'CLICK') {
      this.showItemDetail(event.data);
    } else if (event.eventId === 'MENU_CLICK') {
      if (event.data.menu === 'Delete All') {
        this.showDeleteConfirmation(viewId);
      } else if (event.data.menu === 'About') {
        this.showAbout();
      }
    }
  },

  showItemDetail: function(item) {
    const result = synura.open({
      view: '/dialogs/confirmation',
      styles: {
        title: item.title,
        message: "Item ID: " + item.link + "\n\nTap OK to go back."
      }
    }, function(event) {
      if (event.eventId === 'SUBMIT') {
        synura.close(result.viewId);
      }
    });
  },

  showDeleteConfirmation: function(listViewId) {
    const self = this;
    const result = synura.open({
      view: '/dialogs/confirmation',
      styles: {
        title: "Delete All Items?",
        message: "This will permanently delete all items. This action cannot be undone."
      }
    }, function(event) {
      if (event.eventId === 'SUBMIT') {
        synura.close(result.viewId);

        // Clear items and update list
        self.items = [];
        synura.update(listViewId, {
          models: {
            contents: []
          }
        });

        // Show success notification
        self.showNotification("Success", "All items have been deleted.");
      }
    });
  },

  showAbout: function() {
    const result = synura.open({
      view: '/dialogs/confirmation',
      styles: {
        title: "About",
        message: "Confirmation Dialog Example\nVersion 0.1\n\nThis extension demonstrates how to use confirmation dialogs for user notifications and action confirmations."
      }
    }, function(event) {
      if (event.eventId === 'SUBMIT') {
        synura.close(result.viewId);
      }
    });
  },

  showNotification: function(title, message) {
    const result = synura.open({
      view: '/dialogs/confirmation',
      styles: {
        title: title,
        message: message
      }
    }, function(event) {
      if (event.eventId === 'SUBMIT') {
        synura.close(result.viewId);
      }
    });
  }
};