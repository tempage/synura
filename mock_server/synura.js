// Synura Mock Server Test Extension
// Tests authentication, HTTP operations, and session management.

var SYNURA = {
    domain: "localhost:8080",
    name: "Mock Server Test",
    version: 0.2,
    api: 0,
    bypass: "chrome/windows",
    deeplink: true,
    get main() { return handler; }
};

var baseUrl = "http://localhost:8080";

var testLogin = (viewId) => {
    console.log("Testing Login...");
    const result = synura.open('/views/browser', {
        styles: { title: 'Login Test' },
        models: { url: baseUrl + '/login' }
    });

    if (result.success) {
        synura.connect(result.viewId, { from: "browser_login_test", parentViewId: viewId }, (event) => {
            handler.onViewEvent(event.viewId, event);
        });
    }
};

var testLogout = (viewId) => {
    console.log("Testing Logout...");
    localStorage.removeItem("user_cookie");
    const result = synura.open('/views/browser', {
        styles: { title: 'Logout Test' },
        models: { url: baseUrl + '/logout' }
    });

    if (result.success) {
        synura.connect(result.viewId, { from: "browser_logout_test", parentViewId: viewId }, (event) => {
            handler.onViewEvent(event.viewId, event);
        });
    }
};

var testUserAgent = (viewId) => {
    console.log("Testing User Agent...");
    try {
        const cookie = localStorage.getItem("user_cookie");
        const options = cookie ? { headers: { "Cookie": cookie } } : {};
        const response = fetch(baseUrl + "/ua", options);
        const json = response.json();
        synura.update(viewId, { models: { snackbar: "UA: " + json.user_agent } });
    } catch (e) {
        synura.update(viewId, { models: { snackbar: "UA Test Failed: " + e } });
    }
};

var testFetchGet = (viewId) => {
    console.log("Testing Fetch GET...");
    try {
        const cookie = localStorage.getItem("user_cookie");
        const options = cookie ? { headers: { "Cookie": cookie } } : {};
        const response = fetch(baseUrl + "/get?foo=bar&baz=qux", options);
        const json = response.json();

        let msg = "";
        if (json.query && json.query.foo === "bar") {
            msg += "Query OK. ";
        } else {
            msg += "Query Mismatch. ";
        }

        if (cookie && json.cookies && json.cookies["session_id"]) {
            msg += "Cookie OK.";
        }

        synura.update(viewId, { models: { snackbar: msg } });
    } catch (e) {
        synura.update(viewId, { models: { snackbar: "GET Failed: " + e } });
    }
};

var testFetchPost = (viewId) => {
    console.log("Testing Fetch POST...");
    try {
        const cookie = localStorage.getItem("user_cookie");
        const headers = { "Content-Type": "application/json" };
        if (cookie) headers["Cookie"] = cookie;

        const body = JSON.stringify({ key: "value", number: 123 });
        const response = fetch(baseUrl + "/post", {
            method: "POST",
            body: body,
            headers: headers
        });
        const json = response.json();

        let msg = "";
        if (json.json && json.json.key === "value") {
            msg += "POST Body OK. ";
        } else {
            msg += "POST Body Mismatch. ";
        }

        if (cookie && json.cookies && json.cookies["session_id"]) {
            msg += "Cookie OK.";
        }

        synura.update(viewId, { models: { snackbar: msg } });
    } catch (e) {
        synura.update(viewId, { models: { snackbar: "POST Failed: " + e } });
    }
};

var testFileUpload = (viewId) => {
    console.log("Testing File Upload...");

    // Generate a random boundary to avoid collisions with content
    const generateBoundary = () => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 16; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return "----WebKitFormBoundary" + text;
    };
    
    const boundary = generateBoundary();
    const body = "--" + boundary + "\r\n" +
                 "Content-Disposition: form-data; name=\"file\"; filename=\"test.txt\"\r\n" +
                 "Content-Type: text/plain\r\n\r\n" +
                 "Hello world file content.\r\n" +
                 "--" + boundary + "--\r\n";

    try {
        const cookie = localStorage.getItem("user_cookie");
        const headers = { "Content-Type": "multipart/form-data; boundary=" + boundary };
        if (cookie) headers["Cookie"] = cookie;

        const response = fetch(baseUrl + "/upload", {
            method: "POST",
            headers: headers,
            body: body
        });
        const json = response.json();

        if (json.filename === "test.txt") {
            synura.update(viewId, { models: { snackbar: "Upload OK: " + json.size + " bytes" } });
        } else {
            synura.update(viewId, { models: { snackbar: "Upload Failed" } });
        }
    } catch (e) {
        synura.update(viewId, { models: { snackbar: "Upload Error: " + e } });
    }
};

var testAuthFetchGet = (viewId) => {
    console.log("Testing Auth Fetch GET...");
    try {
        const cookie = localStorage.getItem("user_cookie");
        const options = cookie ? { headers: { "Cookie": cookie } } : {};
        const response = fetch(baseUrl + "/login/get?foo=bar", options);

        if (response.status === 401) {
            synura.update(viewId, { models: { snackbar: "Auth GET: 401 Unauthorized" } });
            return;
        }

        synura.update(viewId, { models: { snackbar: "Auth GET OK" } });
    } catch (e) {
        synura.update(viewId, { models: { snackbar: "Auth GET Failed: " + e } });
    }
};

var testAuthFetchPost = (viewId) => {
    console.log("Testing Auth Fetch POST...");
    try {
        const cookie = localStorage.getItem("user_cookie");
        const headers = { "Content-Type": "application/json" };
        if (cookie) headers["Cookie"] = cookie;

        const body = JSON.stringify({ key: "value" });
        const response = fetch(baseUrl + "/login/post", {
            method: "POST",
            body: body,
            headers: headers
        });

        if (response.status === 401) {
            synura.update(viewId, { models: { snackbar: "Auth POST: 401 Unauthorized" } });
            return;
        }

        synura.update(viewId, { models: { snackbar: "Auth POST OK" } });
    } catch (e) {
        synura.update(viewId, { models: { snackbar: "Auth POST Failed: " + e } });
    }
};

var testAuthFileUpload = (viewId) => {
    console.log("Testing Auth File Upload...");

    // Generate a random boundary to avoid collisions with content
    const generateBoundary = () => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 16; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return "----WebKitFormBoundary" + text;
    };
    
    const boundary = generateBoundary();
    const body = "--" + boundary + "\r\n" +
                 "Content-Disposition: form-data; name=\"file\"; filename=\"test.txt\"\r\n" +
                 "Content-Type: text/plain\r\n\r\n" +
                 "Hello world file content.\r\n" +
                 "--" + boundary + "--\r\n";

    try {
        const cookie = localStorage.getItem("user_cookie");
        const headers = { "Content-Type": "multipart/form-data; boundary=" + boundary };
        if (cookie) headers["Cookie"] = cookie;

        const response = fetch(baseUrl + "/login/upload", {
            method: "POST",
            headers: headers,
            body: body
        });

        if (response.status === 401) {
            synura.update(viewId, { models: { snackbar: "Auth Upload: 401 Unauthorized" } });
            return;
        }

        const json = response.json();
        if (json.filename === "test.txt") {
            synura.update(viewId, { models: { snackbar: "Auth Upload OK" } });
        } else {
            synura.update(viewId, { models: { snackbar: "Auth Upload Failed" } });
        }
    } catch (e) {
        synura.update(viewId, { models: { snackbar: "Auth Upload Error: " + e } });
    }
};

var testCookieCheck = (viewId) => {
    console.log("Testing Cookie Validity...");

    const cookie = localStorage.getItem("user_cookie");
    if (!cookie) {
        synura.update(viewId, { models: { snackbar: "No cookie in localStorage" } });
        return;
    }

    try {
        const response = fetch(baseUrl + "/login/get", { headers: { "Cookie": cookie } });

        if (response.status === 401) {
            synura.update(viewId, { models: { snackbar: "Cookie Invalid (Session Expired)" } });
            return;
        }

        synura.update(viewId, { models: { snackbar: "Cookie Valid (Session Active)" } });
    } catch (e) {
        synura.update(viewId, { models: { snackbar: "Cookie Check Error: " + e } });
    }
};

var home = () => {
    synura.open('/views/list', {
        styles: { title: "Mock Server Test" },
        models: {
            contents: [
                { title: "Login Test" },
                { title: "Logout Test" },
                { title: "User Agent Test" },
                { title: "Fetch GET Test" },
                { title: "Fetch POST Test" },
                { title: "File Upload Test" },
                { title: "Auth GET Test" },
                { title: "Auth POST Test" },
                { title: "Auth Upload Test" },
                { title: "Cookie Check" }
            ],
            menus: []
        }
    }, { from: "home" }, (event) => handler.onViewEvent(event.viewId, event));
};

var resume = (viewId, context) => {
    // Reconnect to the restored view to handle future events
    synura.connect(viewId, context, (event) => {
        handler.onViewEvent(event.viewId, event);
    });
};

var deeplink = (url) => {
    console.log("Deeplink received:", url);
    // For this test extension, just open home for any deeplink
    home();
    return true; // Handled
};

var onViewEvent = (viewId, event) => {
    console.log("Event:", JSON.stringify(event));

    if (event.eventId === "CLICK") {
        const item = event.data;
        if (item.title === "Login Test") testLogin(viewId);
        if (item.title === "Logout Test") testLogout(viewId);
        if (item.title === "User Agent Test") testUserAgent(viewId);
        if (item.title === "Fetch GET Test") testFetchGet(viewId);
        if (item.title === "Fetch POST Test") testFetchPost(viewId);
        if (item.title === "File Upload Test") testFileUpload(viewId);
        if (item.title === "Auth GET Test") testAuthFetchGet(viewId);
        if (item.title === "Auth POST Test") testAuthFetchPost(viewId);
        if (item.title === "Auth Upload Test") testAuthFileUpload(viewId);
        if (item.title === "Cookie Check") testCookieCheck(viewId);
    }

    if (event.context.from === "browser_login_test" && event.eventId === "SUBMIT") {
        console.log("Browser submitted (Login):", JSON.stringify(event.data));
        const cookie = event.data.cookies;
        if (cookie) {
            localStorage.setItem("user_cookie", cookie);
            synura.update(event.context.parentViewId, { models: { snackbar: "Login Cookie Saved" } });
        }
        synura.close(event.viewId);
    }

    if (event.context.from === "browser_logout_test" && event.eventId === "SUBMIT") {
        localStorage.removeItem("user_cookie");
        synura.update(event.context.parentViewId, { models: { snackbar: "Cookie Cleared" } });
        synura.close(event.viewId);
    }
};

var handler = {
    home,
    resume,
    deeplink,
    onViewEvent
};
