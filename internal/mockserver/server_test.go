package mockserver

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func newTestServer(t *testing.T) *httptest.Server {
	t.Helper()
	s, err := New(Config{Addr: ":0", SynuraScriptPath: "../../testdata/mock_server/synura.js", ExtensionsDir: "../../extensions"})
	if err != nil {
		t.Fatalf("new server: %v", err)
	}
	return httptest.NewServer(s.Handler())
}

func TestPublicEndpoints(t *testing.T) {
	ts := newTestServer(t)
	defer ts.Close()

	t.Run("Login", func(t *testing.T) {
		resp, err := http.Get(ts.URL + "/login")
		if err != nil {
			t.Fatalf("request: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Fatalf("status: %d", resp.StatusCode)
		}
		found := false
		for _, c := range resp.Cookies() {
			if c.Name == "session_id" && c.Value != "" {
				found = true
			}
		}
		if !found {
			t.Fatal("session cookie not set")
		}
	})

	t.Run("GetEcho", func(t *testing.T) {
		resp, err := http.Get(ts.URL + "/get?foo=bar")
		if err != nil {
			t.Fatalf("request: %v", err)
		}
		defer resp.Body.Close()
		var body map[string]any
		if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
			t.Fatalf("decode: %v", err)
		}
		query := body["query"].(map[string]any)
		if query["foo"] != "bar" {
			t.Fatalf("unexpected query: %v", query)
		}
	})

	t.Run("PostEcho", func(t *testing.T) {
		resp, err := http.Post(ts.URL+"/post", "application/json", strings.NewReader(`{"key":"value"}`))
		if err != nil {
			t.Fatalf("request: %v", err)
		}
		defer resp.Body.Close()
		var body map[string]any
		if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
			t.Fatalf("decode: %v", err)
		}
		if body["body"] != `{"key":"value"}` {
			t.Fatalf("unexpected body: %v", body["body"])
		}
	})

	t.Run("Upload", func(t *testing.T) {
		payload := new(bytes.Buffer)
		w := multipart.NewWriter(payload)
		part, _ := w.CreateFormFile("file", "test.txt")
		_, _ = part.Write([]byte("hello"))
		_ = w.Close()

		req, _ := http.NewRequest(http.MethodPost, ts.URL+"/upload", payload)
		req.Header.Set("Content-Type", w.FormDataContentType())
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("request: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Fatalf("status: %d", resp.StatusCode)
		}
	})
}

func TestAuthEndpoints(t *testing.T) {
	ts := newTestServer(t)
	defer ts.Close()

	loginResp, err := http.Get(ts.URL + "/login")
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	loginResp.Body.Close()

	var sess *http.Cookie
	for _, c := range loginResp.Cookies() {
		if c.Name == "session_id" {
			sess = c
			break
		}
	}
	if sess == nil {
		t.Fatal("missing session cookie")
	}

	t.Run("Unauthorized", func(t *testing.T) {
		resp, err := http.Get(ts.URL + "/login/get")
		if err != nil {
			t.Fatalf("request: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("status: %d", resp.StatusCode)
		}
	})

	t.Run("Authorized", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, ts.URL+"/login/get", nil)
		req.AddCookie(sess)
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("request: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Fatalf("status: %d", resp.StatusCode)
		}
	})
}
