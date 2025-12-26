const SYNURA = {
  name: "Hello World",
  version: 1.0,
  api: 0,
  description: "My first Synura extension.",
  license: "Apache-2.0",
  get main() {
    return handler;
  }
};

const handler = {
  home: function() {
    synura.open({
      view: '/views/list',
      styles: {
        title: "Hello World Extension",
        layout: "card"
      },
      models: {
        contents: {
          details: [{
            title: "Welcome to Synura!",
            author: "System",
            date: new Date().toLocaleDateString(),
          }]
        }
      }
    });
  }
};