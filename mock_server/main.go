// Mock Server for Synura Extension Testing
//
// This server provides endpoints for testing the Synura extension system,
// including authentication, session management, and various HTTP operations.
//
// Endpoints:
//   GET  /login          - Set session cookie (10s expiry)
//   GET  /logout         - Clear session cookie
//   GET  /ua             - Echo User-Agent header
//   GET  /headers        - Echo all request headers
//   GET  /get            - Echo request details (query params, cookies)
//   POST /post           - Echo request body
//   POST /upload         - Handle multipart file upload
//   GET  /login/get      - Authenticated echo (extends session)
//   POST /login/post     - Authenticated echo (extends session)
//   POST /login/upload   - Authenticated file upload (extends session)
//   GET  /synura.js      - Serve the test extension script
//   GET  /api/hello      - Echo request details
//   GET  /static/*       - Serve static files from current directory
//   GET  /examples/*     - Serve example extension scripts
//   GET  /ext/*          - Serve extensions from optional directory (testing only)

package main

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"flag"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

const sessionDuration = 10 * time.Second

var (
	sessions sync.Map // map[string]time.Time
)

func generateToken() string {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		log.Fatalf("Critical: crypto/rand failed: %v", err)
	}
	return hex.EncodeToString(b)
}

var additionalScriptPath string

func main() {
	flag.StringVar(&additionalScriptPath, "path", "", "Optional path to directory with JS scripts to serve at /ext/")
	flag.Parse()

	// Also accept positional argument for convenience
	if additionalScriptPath == "" && flag.NArg() > 0 {
		additionalScriptPath = flag.Arg(0)
	}

	mux := http.NewServeMux()

	// --- Public Endpoints ---

	mux.HandleFunc("/login", handleLogin)
	mux.HandleFunc("/logout", handleLogout)
	mux.HandleFunc("/ua", handleUserAgent)
	mux.HandleFunc("/headers", handleHeaders)
	mux.HandleFunc("/get", enforceMethod(http.MethodGet, handleEcho))
	mux.HandleFunc("/post", enforceMethod(http.MethodPost, handleEcho))
	mux.HandleFunc("/api/hello", handleEcho)
	mux.HandleFunc("/upload", handleUpload)
	mux.HandleFunc("/synura.js", handleSynuraJS)

	// --- Additional Script Endpoint ---
	// WARNING: This serves files from a user-specified directory for TESTING PURPOSES ONLY.
	// DO NOT use in production - directory serving can expose sensitive files and is
	// vulnerable to path traversal attacks if not properly configured.

	if additionalScriptPath != "" {
		absPath, err := filepath.Abs(additionalScriptPath)
		if err != nil {
			log.Fatalf("Failed to resolve path %s: %v", additionalScriptPath, err)
		}
		info, err := os.Stat(absPath)
		if os.IsNotExist(err) {
			log.Fatalf("Path not found: %s", absPath)
		}
		if !info.IsDir() {
			log.Fatalf("Path is not a directory: %s", absPath)
		}
		log.Printf("WARNING: Serving files from %s at /ext/", absPath)
		mux.Handle("/ext/", http.StripPrefix("/ext/", http.FileServer(http.Dir(absPath))))
	}

	// --- Authenticated Endpoints ---

	mux.HandleFunc("/login/get", requireLogin(handleEcho))
	mux.HandleFunc("/login/post", requireLogin(handleEcho))
	mux.HandleFunc("/login/upload", requireLogin(handleUpload))

	// --- Static File Server ---
	// Only serve example extensions, not local files (security: avoid exposing source code)
	mux.Handle("/examples/", http.StripPrefix("/examples/", http.FileServer(http.Dir("../examples"))))

	log.Println("===========================================")
	log.Println("       Mock Server Starting on :8080")
	log.Println("===========================================")
	log.Println("")
	log.Println("--- API Endpoints ---")
	log.Println("  http://localhost:8080/login         - Set session cookie")
	log.Println("  http://localhost:8080/logout        - Clear session cookie")
	log.Println("  http://localhost:8080/ua            - Echo User-Agent")
	log.Println("  http://localhost:8080/headers       - Echo all headers")
	log.Println("  http://localhost:8080/get           - Echo request details")
	log.Println("  http://localhost:8080/post          - Echo body (POST)")
	log.Println("  http://localhost:8080/upload        - File upload (POST)")
	log.Println("  http://localhost:8080/login/get     - Authenticated GET")
	log.Println("  http://localhost:8080/login/post    - Authenticated POST")
	log.Println("  http://localhost:8080/login/upload  - Authenticated upload")
	log.Println("")
	log.Println("--- Extension Scripts (Copy URLs) ---")
	log.Println("  http://localhost:8080/synura.js")
	if additionalScriptPath != "" {
		log.Println("")
		log.Printf("--- Custom Extensions from: %s ---", additionalScriptPath)
		absPath, _ := filepath.Abs(additionalScriptPath)
		
		err := filepath.Walk(absPath, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if !info.IsDir() && strings.HasSuffix(info.Name(), ".js") {
				relPath, err := filepath.Rel(absPath, path)
				if err == nil {
					// Ensure URL uses forward slashes even on Windows
					urlPath := filepath.ToSlash(relPath)
					log.Printf("  http://localhost:8080/ext/%s", urlPath)
				}
			}
			return nil
		})
		if err != nil {
			log.Printf("  (Error walking directory: %v)", err)
		}
	}
	log.Println("")
	log.Println("--- Example Extensions (Copy URLs) ---")
	examplesPath, err := filepath.Abs("../examples")
	if err == nil {
		entries, err := os.ReadDir(examplesPath)
		if err == nil {
			for _, entry := range entries {
				if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".js") {
					log.Printf("  http://localhost:8080/examples/%s", entry.Name())
				}
			}
		} else {
			log.Printf("  (Could not read examples directory: %v)", err)
		}
	}
	log.Println("")
	log.Println("===========================================")

	server := &http.Server{
		Addr:         ":8080",
		Handler:      loggingMiddleware(mux),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

// enforceMethod wraps a handler to only allow the specified HTTP method
func enforceMethod(method string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != method {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		next(w, r)
	}
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	token := generateToken()
	expiry := time.Now().Add(sessionDuration)
	sessions.Store(token, expiry)

	// Note: HttpOnly=false is intentional - extensions need to read cookies via JavaScript
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    token,
		Path:     "/",
		Expires:  expiry,
		HttpOnly: false,
	})
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status": "logged_in", "message": "Session cookie set"}`))
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
	if cookie, err := r.Cookie("session_id"); err == nil {
		sessions.Delete(cookie.Value)
	}

	// Note: HttpOnly=false is intentional - extensions need to read cookies via JavaScript
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    "",
		Path:     "/",
		Expires:  time.Now().Add(-1 * time.Hour),
		HttpOnly: false,
	})
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status": "logged_out", "message": "Session cookie cleared"}`))
}

func handleUserAgent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"user_agent": r.UserAgent(),
	})
}

func handleHeaders(w http.ResponseWriter, r *http.Request) {
	headers := make(map[string]string)
	for k, v := range r.Header {
		headers[k] = strings.Join(v, ", ")
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(headers)
}

func handleEcho(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Limit request body size to 10MB to prevent OOM
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20)

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

func handleUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Validate Content-Type is multipart/form-data
	contentType := r.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "multipart/form-data") {
		http.Error(w, "Content-Type must be multipart/form-data", http.StatusBadRequest)
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

func handleSynuraJS(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "synura.js")
}

func isLoggedIn(r *http.Request) bool {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return false
	}
	val, ok := sessions.Load(cookie.Value)
	if !ok {
		return false
	}
	expiry, ok := val.(time.Time)
	if !ok || time.Now().After(expiry) {
		sessions.Delete(cookie.Value) // Clean up expired session
		return false
	}
	return true
}

func requireLogin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !isLoggedIn(r) {
			http.Error(w, "Unauthorized: Login required", http.StatusUnauthorized)
			return
		}

		// Extend session
		cookie, _ := r.Cookie("session_id")
		newExpiry := time.Now().Add(sessionDuration)
		sessions.Store(cookie.Value, newExpiry)

		// Note: HttpOnly=false is intentional - extensions need to read cookies via JavaScript
		http.SetCookie(w, &http.Cookie{
			Name:     "session_id",
			Value:    cookie.Value,
			Path:     "/",
			Expires:  newExpiry,
			HttpOnly: false,
		})
		next(w, r)
	}
}

// responseWriter wraps http.ResponseWriter to capture status code and body
type responseWriter struct {
	http.ResponseWriter
	statusCode int
	body       *bytes.Buffer
}

func newResponseWriter(w http.ResponseWriter) *responseWriter {
	return &responseWriter{
		ResponseWriter: w,
		statusCode:     http.StatusOK,
		body:           &bytes.Buffer{},
	}
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	rw.body.Write(b)
	return rw.ResponseWriter.Write(b)
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/favicon.ico" {
			next.ServeHTTP(w, r)
			return
		}

		start := time.Now()

		authStatus := "[Guest]"
		if isLoggedIn(r) {
			authStatus = "[Auth]"
		}

		// Log request line
		log.Printf("─── REQUEST ───────────────────────────────")
		log.Printf("%s %s %s", r.Method, r.URL.String(), authStatus)

		// Log headers
		log.Printf("Headers:")
		for name, values := range r.Header {
			log.Printf("  %s: %s", name, strings.Join(values, ", "))
		}

		// Log cookies
		if len(r.Cookies()) > 0 {
			log.Printf("Cookies:")
			for _, cookie := range r.Cookies() {
				log.Printf("  %s: %s", cookie.Name, cookie.Value)
			}
		}

		// Log request body for POST/PUT
		if r.Method == http.MethodPost || r.Method == http.MethodPut {
			log.Printf("Content-Type: %s", r.Header.Get("Content-Type"))
			log.Printf("Content-Length: %d", r.ContentLength)

			// Safely preview body (max 1KB) without consuming it fully into memory
			if r.Body != nil {
				peekBuf := make([]byte, 1024)
				n, _ := io.ReadFull(r.Body, peekBuf)
				// Note: We ignore errors (like ErrUnexpectedEOF) because we just want to peek
				// at whatever data is immediately available up to the limit.

				if n > 0 {
					chunk := peekBuf[:n]
					log.Printf("Request Body Preview:")
					if n == len(peekBuf) {
						log.Printf("  %s... (truncated)", string(chunk))
					} else {
						log.Printf("  %s", string(chunk))
					}

					// Restore body for downstream handlers
					// We compose a new ReadCloser that reads the peeked chunk first,
					// then continues reading from the original body.
					r.Body = &struct {
						io.Reader
						io.Closer
					}{
						Reader: io.MultiReader(bytes.NewReader(chunk), r.Body),
						Closer: r.Body,
					}
				}
			}
		}

		// Wrap response writer to capture status and body
		rw := newResponseWriter(w)
		next.ServeHTTP(rw, r)

		// Log response
		log.Printf("─── RESPONSE ──────────────────────────────")
		log.Printf("Status: %d %s", rw.statusCode, http.StatusText(rw.statusCode))
		respBody := rw.body.String()
		if len(respBody) > 0 {
			log.Printf("Response Body:")
			if len(respBody) > 1000 {
				log.Printf("  %s... (truncated)", respBody[:1000])
			} else {
				log.Printf("  %s", respBody)
			}
		}

		log.Printf("← Completed in %v", time.Since(start))
		log.Printf("───────────────────────────────────────────")
	})
}
