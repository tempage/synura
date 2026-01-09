const SYNURA = {
  name: "List View Example",
  version: 0.1,
  api: 0,
  description: "Demonstrates how to use the List View with pagination.",
  license: "Apache-2.0",
  bypass: "chrome/windows",
  get main() {
    return handler;
  }
};

let currentPage = 1;

const handler = {
  home: function() {
    currentPage = 1;
    const result = synura.open({
      view: '/views/list',
      styles: {
        title: "Paginated List",
        layout: "card",
        pagination: true,
        menu: true,
        hotThreshold: 100,
        coldThreshold: 100,
      },
      models: {
        contents: {
          details: this.fetchItems(currentPage)
        },
        menus: {
          details: ["Sort by Date", "Sort by Views", "Search"]
        }
      }
    });

    if (result.success) {
      synura.connect(result.viewId, {
        from: "home"
      }, this.onViewEvent);
    }
  },

  onViewEvent: function(event) {
    console.log(JSON.stringify(event));
    const viewId = event.viewId;

    if (event.eventId === "REFRESH") {
      console.log("Refreshing list...");
      currentPage = 1;
      synura.update(viewId, {
        models: {
          contents: {
            details: handler.fetchItems(currentPage)
          }
        }
      });
    } else if (event.eventId === "SCROLL_TO_END") {
      console.log("Loading next page...");
      currentPage++;
      const newItems = handler.fetchItems(currentPage);
      synura.update(viewId, {
        models: {
          append: {
            details: newItems
          }
        }
      });
    } else if (event.eventId === "CLICK") {
      console.log("Item clicked:", event.data.link);
      // Open post view here (see post_view.js example)
      // Open post view here (see post_view.js example)
      synura.open({
        view: '/views/post',
        styles: {
          title: event.data.title
        },
        models: {
          content: {
            details: [{
              type: 'link',
              value: event.data.link,
              link: event.data.link
            }]
          },
        }
      });
    } else if (event.eventId === "MENU_CLICK") {
      console.log("Menu clicked:", event.data.menu);
      if (event.data.menu === "Search") {
        appbar = {
          type: "query",
          label: "query label",
          hint: "type something here"
        }
        synura.update(viewId, {
          styles: {
            reorderable: true,
            appbar: appbar
          }
        });
      }
    } else if (event.eventId === "QUERY") {
      console.log('Search query:', event.data.query);
    } else if (event.eventId === "REORDER") {
      console.log('Reorder title:', event.data.title);
      console.log('Reorder index:', event.data.index);
      if (event.data.link) {
        console.log('Reorder link:', event.data.link);
      }
    } else if (event.eventId === "AUTHOR_CLICK") {
      console.log("Author clicked:", event.data.author);
    }
  },

  fetchItems: function(page) {
    // Simulate fetching items
    const items = [];
    const startId = (page - 1) * 10 + 1;
    for (let i = 0; i < 10; i++) {
      const id = startId + i;
      items.push({
        link: `https://example.com/post/${id}`,
        title: `Post #${id}`,
        author: `User ${id}`,
        viewCount: Math.floor(Math.random() * 1000).toString(),
        likeCount: Math.floor(Math.random() * 100).toString(),
        commentCount: Math.floor(Math.random() * 50).toString(),
        date: "2023-10-27",
        types: i % 3 === 0 ? ["image"] : [],
        hotCount: Math.floor(Math.random() * 100),
        coldCount: Math.floor(Math.random() * 100),
      });
    }
    return items;
  }
};