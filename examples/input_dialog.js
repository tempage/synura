const SYNURA = {
  name: "Input Dialog Example",
  version: 0.1,
  api: 0,
  description: "An example extension showing how to use input dialogs for user authentication.",
  license: "Apache-2.0",
  get main() {
    return handler;
  }
};

const handler = {
  home: function() {
    this.showLoginDialog();
  },

  showLoginDialog: function() {
    const self = this;
    const result = synura.open({
      view: '/dialogs/input',
      styles: {
        title: "Login",
        message: "Please enter your credentials to continue.",
        close: true
      },
      models: {
        body: [{
          type: 'string',
          name: 'username',
          label: 'Username',
          value: ''
        }, {
          type: 'string',
          name: 'password',
          label: 'Password',
          format: 'password'
        }, {
          type: 'boolean',
          name: 'remember',
          label: 'Remember me',
          value: false
        }],
        buttons: ['Login', 'Register']
      }
    }, function(event) {
      self.onLoginEvent(event, result.viewId);
    });
  },

  onLoginEvent: function(event, viewId) {
    if (event.eventId === 'SUBMIT') {
      const button = event.data.button;
      const username = event.data.username;
      const password = event.data.password;
      const remember = event.data.remember;

      if (button === 'Login') {
        console.log('Login attempt:', username);
        console.log('Remember:', remember);

        // Simulate authentication
        if (username && password) {
          synura.close(viewId);
          this.showSuccess("Welcome back, " + username + "!");
        } else {
          this.showError("Please enter both username and password.");
        }
      } else if (button === 'Register') {
        synura.close(viewId);
        this.showRegisterDialog();
      }
    } else if (event.eventId === 'CLOSE') {
      console.log('Login cancelled');
      synura.close(viewId);
    }
  },

  showRegisterDialog: function() {
    const self = this;
    const result = synura.open({
      view: '/dialogs/input',
      styles: {
        title: "Register",
        message: "Create a new account."
      },
      models: {
        body: [{
          type: 'string',
          name: 'email',
          label: 'Email'
        }, {
          type: 'string',
          name: 'username',
          label: 'Username'
        }, {
          type: 'string',
          name: 'password',
          label: 'Password',
          format: 'password'
        }, {
          type: 'number',
          name: 'age',
          label: 'Age',
          value: 18
        }],
        buttons: ['Create Account', 'Back to Login']
      }
    }, function(event) {
      if (event.eventId === 'SUBMIT') {
        if (event.data.button === 'Create Account') {
          console.log('Registering:', event.data.username, 'Age:', event.data.age);
          synura.close(result.viewId);
          self.showSuccess("Account created for " + event.data.username + "!");
        } else {
          synura.close(result.viewId);
          self.showLoginDialog();
        }
      }
    });
  },

  showSuccess: function(message) {
    synura.open({
      view: '/dialogs/confirmation',
      styles: {
        title: "Success",
        message: message
      }
    }, function(event) {
      if (event.eventId === 'SUBMIT') {
        synura.close(event.viewId);
      }
    });
  },

  showError: function(message) {
    synura.open({
      view: '/dialogs/confirmation',
      styles: {
        title: "Error",
        message: message
      }
    }, function(event) {
      if (event.eventId === 'SUBMIT') {
        synura.close(event.viewId);
      }
    });
  }
};