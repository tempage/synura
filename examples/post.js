const SYNURA = {
  name: "Post View Example",
  version: 0.1,
  domain: "example.com",
  api: 0,
  description: "An example extension showing how to create a post view.",
  license: "Apache-2.0",
  get main() {
    return handler;
  }
};

const handler = {
  // Entry point
  home: function() {
    // Open the post view
    var context = {
      link: "example-post-id"
    };
    const result = synura.open({
      view: '/views/post',
      styles: {
        title: "Loading...",
        menu: true,
        authorClickable: true
      },
      models: {
        link: {
          message: "example-post-id"
        },
        author: {
          message: "Loading..."
        },
        content: {
          details: []
        },
        comments: {
          details: []
        },
        menus: {
          details: ["Option 1", "Option 2"]
        }
      }
    }, context, this.onViewEvent);

    // Optional: You can also connect manually if you don't pass the callback to open()
    // if (result.success) {
    //     context['second'] = "second";
    //     // Note: This will overwrite the callback registered in synura.open()
    //     synura.connect(result.viewId, context, (event) => {
    //         console.log("Connected to view", JSON.stringify(event));
    //         this.onViewEvent(event);
    //     });
    // }
    console.log("View opened (and connected if callback provided)");
  },

  onViewEvent: function(event) {
    console.log("onViewEvent event:" + JSON.stringify(event));
    const viewId = event.viewId;

    if (event.eventId === "LOAD" || event.eventId === "REFRESH") {
      console.log("User requested load or refresh");
      handler.loadPostData(viewId);
    } else if (event.eventId === "MENU_CLICK") {
      console.log("Menu clicked:", event.data.menu);
      synura.update(viewId, {
        models: {
          snackbar: {
            message: `You clicked ${event.data.menu}`
          }
        }
      });
    } else if (event.eventId === "AUTHOR_CLICK") {
      console.log("Author clicked:", event.data.author);
      synura.update(viewId, {
        models: {
          snackbar: {
            message: `You clicked author: ${event.data.author}`
          }
        }
      });
    }
  },
  resume: function(viewId, context) {
    console.log("resume. newViewId: " + viewId + ", with context: " + JSON.stringify(context));

    // connect to the restored view. now, PULL-TO-REFRESH will work.
    const connectResult = synura.connect(viewId, context, (event) => {
      handler.onViewEvent(viewId, event)
    });
    if (connectResult.success) {
      console.log("✅ Successfully connected to the restored synura.");
    } else {
      console.log("❌ Failed to connect to the restored view:", connectResult.error);
    }
  },
  loadPostData: function(viewId) {
    // In a real extension, you would fetch data from a URL here.
    // const response = fetch("https://example.com/api/post");

    // Simulating data
    const postData = {
      styles: {
        title: "Example Post Title"
      },
      models: {
        author: {
          message: "John Doe"
        },
        date: {
          message: "2023-10-27 10:00 AM"
        },
        viewCount: {
          message: "1234"
        },
        likeCount: {
          message: "56"
        },
        content: {
          details: [{
            type: "text",
            "value": "This is an example post content."
          }, {
            type: "image",
            "value": "https://picsum.photos/seed/picsum/400/200"
          }, {
            type: "text",
            "value": "More text below the image."
          }, {
            type: "link",
            value: "Click here for more",
            link: "https://example.com/post/123"
          }]
        },
        comments: {
          details: [{
            link: "example-comment-id-1",
            author: "Jane Smith",
            memo: "Verified user",
            content: "Great post!",
            date: "10:05 AM",
            level: 0
          }, {
            link: "example-comment-id-2",
            author: "John Doe",
            content: "Thanks!",
            date: "10:10 AM",
            level: 1
          }]
        }
      }
    };

    synura.update(viewId, postData);
  }
};