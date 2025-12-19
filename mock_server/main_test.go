package main

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync"
	"testing"
	"time"
)

// testSession holds session state for tests (avoids global state race conditions)
type testSession struct {
	expiry    time.Time
	sessionID string
	mu        sync.Mutex
}

func (s *testSession) generateToken() string {
	return "test_session_token_" + time.Now().Format("20060102150405.000000000")
}

func (s *testSession) isLoggedIn(r *http.Request) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if time.Now().After(s.expiry) {
		return false
	}
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return false
	}
	return cookie.Value == s.sessionID
}

func (s *testSession) setSession(token string, expiry time.Time) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.sessionID = token
	s.expiry = expiry
}

func (s *testSession) expireSession() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.expiry = time.Now().Add(-1 * time.Second)
}

func (s *testSession) getExpiry() time.Time {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.expiry
}

func setupTestMux(session *testSession) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		expiry := time.Now().Add(10 * time.Second)
		token := session.generateToken()
		session.setSession(token, expiry)
		http.SetCookie(w, &http.Cookie{
			Name:     "session_id",
			Value:    token,
			Path:     "/",
			Expires:  expiry,
			HttpOnly: false,
		})
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status": "logged_in", "message": "Session cookie set"}`))
	})

	mux.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:     "session_id",
			Value:    "",
			Path:     "/",
			Expires:  time.Now().Add(-1 * time.Hour),
			HttpOnly: false,
		})
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status": "logged_out", "message": "Session cookie cleared"}`))
	})

	mux.HandleFunc("/ua", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"user_agent": r.UserAgent()})
	})

	mux.HandleFunc("/headers", func(w http.ResponseWriter, r *http.Request) {
		headers := make(map[string]string)
		for k, v := range r.Header {
			headers[k] = strings.Join(v, ", ")
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(headers)
	})

	handleEcho := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		response := make(map[string]interface{})
		response["method"] = r.Method
		response["url"] = r.URL.String()

		queryParams := make(map[string]string)
		for k, v := range r.URL.Query() {
			queryParams[k] = strings.Join(v, ", ")
		}
		response["query"] = queryParams

		cookies := make(map[string]string)
		for _, cookie := range r.Cookies() {
			cookies[cookie.Name] = cookie.Value
		}
		response["cookies"] = cookies

		if r.Method == http.MethodPost || r.Method == http.MethodPut {
			body, err := io.ReadAll(r.Body)
			if err == nil {
				response["body"] = string(body)
				var jsonBody interface{}
				if json.Unmarshal(body, &jsonBody) == nil {
					response["json"] = jsonBody
				}
			}
		}

		json.NewEncoder(w).Encode(response)
	}
	mux.HandleFunc("/get", handleEcho)
	mux.HandleFunc("/post", handleEcho)
	mux.HandleFunc("/api/hello", handleEcho)

	handleUpload := func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			http.Error(w, "Failed to parse multipart form: "+err.Error(), http.StatusBadRequest)
			return
		}

		file, handler, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "Failed to retrieve file: "+err.Error(), http.StatusBadRequest)
			return
		}
		defer file.Close()

		response := map[string]interface{}{
			"filename": handler.Filename,
			"size":     handler.Size,
			"header":   handler.Header,
			"message":  "File uploaded successfully",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
	mux.HandleFunc("/upload", handleUpload)

	mux.HandleFunc("/synura.js", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/javascript")
		w.Write([]byte("// mock synura.js content"))
	})

	requireLogin := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			if !session.isLoggedIn(r) {
				http.Error(w, "Unauthorized: Login required", http.StatusUnauthorized)
				return
			}
			newExpiry := time.Now().Add(10 * time.Second)
			session.mu.Lock()
			session.expiry = newExpiry
			currentID := session.sessionID
			session.mu.Unlock()
			http.SetCookie(w, &http.Cookie{
				Name:     "session_id",
				Value:    currentID,
				Path:     "/",
				Expires:  newExpiry,
				HttpOnly: false,
			})
			next(w, r)
		}
	}

	mux.HandleFunc("/login/get", requireLogin(handleEcho))
	mux.HandleFunc("/login/post", requireLogin(handleEcho))
	mux.HandleFunc("/login/upload", requireLogin(handleUpload))

	return mux
}

func TestPublicEndpoints(t *testing.T) {
	session := &testSession{}
	mux := setupTestMux(session)
	server := httptest.NewServer(mux)
	defer server.Close()

	t.Run("Login", func(t *testing.T) {
		resp, err := http.Get(server.URL + "/login")
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		found := false
		for _, c := range resp.Cookies() {
			if c.Name == "session_id" && strings.HasPrefix(c.Value, "test_session_token_") {
				found = true
				break
			}
		}
		if !found {
			t.Error("session_id cookie not found")
		}
	})

	t.Run("Logout", func(t *testing.T) {
		resp, err := http.Get(server.URL + "/logout")
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		for _, c := range resp.Cookies() {
			if c.Name == "session_id" && c.Value != "" {
				t.Error("session_id should be cleared")
			}
		}
	})

	t.Run("UserAgent", func(t *testing.T) {
		req, _ := http.NewRequest("GET", server.URL+"/ua", nil)
		req.Header.Set("User-Agent", "TestAgent/1.0")

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		var result map[string]string
		json.NewDecoder(resp.Body).Decode(&result)

		if result["user_agent"] != "TestAgent/1.0" {
			t.Errorf("Expected TestAgent/1.0, got %s", result["user_agent"])
		}
	})

	t.Run("Headers", func(t *testing.T) {
		req, _ := http.NewRequest("GET", server.URL+"/headers", nil)
		req.Header.Set("X-Custom-Header", "CustomValue")

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		var result map[string]string
		json.NewDecoder(resp.Body).Decode(&result)

		if result["X-Custom-Header"] != "CustomValue" {
			t.Errorf("Header not echoed correctly")
		}
	})

	t.Run("GetWithQuery", func(t *testing.T) {
		resp, err := http.Get(server.URL + "/get?foo=bar&baz=qux")
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)

		query := result["query"].(map[string]interface{})
		if query["foo"] != "bar" {
			t.Error("Query param not echoed")
		}
	})

	t.Run("PostWithBody", func(t *testing.T) {
		body := []byte(`{"key":"value"}`)
		resp, err := http.Post(server.URL+"/post", "application/json", bytes.NewBuffer(body))
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)

		if result["body"] != `{"key":"value"}` {
			t.Error("Body not echoed")
		}

		jsonBody := result["json"].(map[string]interface{})
		if jsonBody["key"] != "value" {
			t.Error("JSON not parsed")
		}
	})

	t.Run("CookieEcho", func(t *testing.T) {
		req, _ := http.NewRequest("GET", server.URL+"/get", nil)
		req.AddCookie(&http.Cookie{Name: "test_cookie", Value: "test_value"})

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)

		cookies := result["cookies"].(map[string]interface{})
		if cookies["test_cookie"] != "test_value" {
			t.Error("Cookie not echoed")
		}
	})

	t.Run("FileUpload", func(t *testing.T) {
		body := new(bytes.Buffer)
		writer := multipart.NewWriter(body)
		part, _ := writer.CreateFormFile("file", "test.txt")
		part.Write([]byte("file content"))
		writer.Close()

		req, _ := http.NewRequest("POST", server.URL+"/upload", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			t.Errorf("Upload failed: %d", resp.StatusCode)
		}

		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)

		if result["filename"] != "test.txt" {
			t.Error("Filename mismatch")
		}
	})
}

func TestAuthenticatedEndpoints(t *testing.T) {
	session := &testSession{}
	mux := setupTestMux(session)
	server := httptest.NewServer(mux)
	defer server.Close()

	jar := &testCookieJar{cookies: make(map[string]*http.Cookie)}

	t.Run("Unauthorized", func(t *testing.T) {
		session.setSession("", time.Time{})

		resp, err := http.Get(server.URL + "/login/get")
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusUnauthorized {
			t.Errorf("Expected 401, got %d", resp.StatusCode)
		}
	})

	t.Run("AuthenticatedGet", func(t *testing.T) {
		loginResp, _ := http.Get(server.URL + "/login")
		loginResp.Body.Close()

		for _, c := range loginResp.Cookies() {
			if c.Name == "session_id" {
				jar.cookies["session_id"] = c
				break
			}
		}

		req, _ := http.NewRequest("GET", server.URL+"/login/get", nil)
		req.AddCookie(jar.cookies["session_id"])

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			t.Errorf("Expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("AuthenticatedPost", func(t *testing.T) {
		loginResp, _ := http.Get(server.URL + "/login")
		loginResp.Body.Close()

		for _, c := range loginResp.Cookies() {
			if c.Name == "session_id" {
				jar.cookies["session_id"] = c
			}
		}

		body := []byte(`{"data":"test"}`)
		req, _ := http.NewRequest("POST", server.URL+"/login/post", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		req.AddCookie(jar.cookies["session_id"])

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			t.Errorf("Expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("AuthenticatedUpload", func(t *testing.T) {
		loginResp, _ := http.Get(server.URL + "/login")
		loginResp.Body.Close()

		for _, c := range loginResp.Cookies() {
			if c.Name == "session_id" {
				jar.cookies["session_id"] = c
			}
		}

		body := new(bytes.Buffer)
		writer := multipart.NewWriter(body)
		part, _ := writer.CreateFormFile("file", "auth_test.txt")
		part.Write([]byte("authenticated content"))
		writer.Close()

		req, _ := http.NewRequest("POST", server.URL+"/login/upload", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())
		req.AddCookie(jar.cookies["session_id"])

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			t.Errorf("Expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("SessionExpiry", func(t *testing.T) {
		loginResp, _ := http.Get(server.URL + "/login")
		loginResp.Body.Close()

		var sessionCookie *http.Cookie
		for _, c := range loginResp.Cookies() {
			if c.Name == "session_id" {
				sessionCookie = c
				break
			}
		}

		session.expireSession()

		req, _ := http.NewRequest("GET", server.URL+"/login/get", nil)
		req.AddCookie(sessionCookie)

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("Failed: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusUnauthorized {
			t.Errorf("Expected 401 after expiry, got %d", resp.StatusCode)
		}
	})

	t.Run("SessionExtension", func(t *testing.T) {
		loginResp, _ := http.Get(server.URL + "/login")
		loginResp.Body.Close()

		var sessionCookie *http.Cookie
		for _, c := range loginResp.Cookies() {
			if c.Name == "session_id" {
				sessionCookie = c
				break
			}
		}

		initialExpiry := session.getExpiry()

		req, _ := http.NewRequest("GET", server.URL+"/login/get", nil)
		req.AddCookie(sessionCookie)

		resp, _ := http.DefaultClient.Do(req)
		resp.Body.Close()

		if !session.getExpiry().After(initialExpiry) {
			t.Error("Session should have been extended")
		}
	})
}

type testCookieJar struct {
	cookies map[string]*http.Cookie
}

func (j *testCookieJar) SetCookies(u *url.URL, cookies []*http.Cookie) {
	for _, c := range cookies {
		j.cookies[c.Name] = c
	}
}

func (j *testCookieJar) Cookies(u *url.URL) []*http.Cookie {
	result := make([]*http.Cookie, 0, len(j.cookies))
	for _, c := range j.cookies {
		result = append(result, c)
	}
	return result
}
