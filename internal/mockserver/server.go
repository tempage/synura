package mockserver

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
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

// Config controls mock server behavior.
type Config struct {
	Addr                 string
	AdditionalScriptPath string
	SynuraScriptPath     string
	ExtensionsDir        string
}

// Server is the Synura mock server.
type Server struct {
	cfg      Config
	sessions sync.Map // map[string]time.Time
}

// New creates a mock server instance.
func New(cfg Config) (*Server, error) {
	if cfg.Addr == "" {
		cfg.Addr = ":8080"
	}
	if cfg.SynuraScriptPath == "" {
		cfg.SynuraScriptPath = "testdata/mock_server/synura.js"
	}
	if cfg.ExtensionsDir == "" {
		cfg.ExtensionsDir = "extensions"
	}

	if cfg.AdditionalScriptPath != "" {
		absPath, err := filepath.Abs(cfg.AdditionalScriptPath)
		if err != nil {
			return nil, fmt.Errorf("resolve additional script path: %w", err)
		}
		info, err := os.Stat(absPath)
		if err != nil {
			return nil, fmt.Errorf("stat additional script path: %w", err)
		}
		if !info.IsDir() {
			return nil, fmt.Errorf("additional script path is not a directory: %s", absPath)
		}
		cfg.AdditionalScriptPath = absPath
	}

	return &Server{cfg: cfg}, nil
}

// Handler builds the HTTP handler tree.
func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/login", s.handleLogin)
	mux.HandleFunc("/logout", s.handleLogout)
	mux.HandleFunc("/ua", s.handleUserAgent)
	mux.HandleFunc("/headers", s.handleHeaders)
	mux.HandleFunc("/get", enforceMethod(http.MethodGet, s.handleEcho))
	mux.HandleFunc("/post", enforceMethod(http.MethodPost, s.handleEcho))
	mux.HandleFunc("/api/hello", s.handleEcho)
	mux.HandleFunc("/upload", s.handleUpload)

	if s.cfg.AdditionalScriptPath != "" {
		log.Printf("WARNING: Serving files from %s at /ext/", s.cfg.AdditionalScriptPath)
		mux.Handle("/ext/", http.StripPrefix("/ext/", http.FileServer(http.Dir(s.cfg.AdditionalScriptPath))))
	}

	mux.HandleFunc("/login/get", s.requireLogin(s.handleEcho))
	mux.HandleFunc("/login/post", s.requireLogin(s.handleEcho))
	mux.HandleFunc("/login/upload", s.requireLogin(s.handleUpload))

	mux.HandleFunc("/synura.js", s.handleSynuraScript)

	extDir := s.resolveExtensionsDir()
	mux.Handle("/examples/", http.StripPrefix("/examples/", http.FileServer(http.Dir(extDir))))

	return loggingMiddleware(s, mux)
}

// Run starts serving and blocks.
func (s *Server) Run() error {
	extDir := s.resolveExtensionsDir()
	s.logStartup(extDir)

	server := &http.Server{
		Addr:         s.cfg.Addr,
		Handler:      s.Handler(),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	return server.ListenAndServe()
}

func (s *Server) resolveExtensionsDir() string {
	candidates := []string{
		s.cfg.ExtensionsDir,
		"extensions",
		"../extensions",
	}
	for _, dir := range candidates {
		if dir == "" {
			continue
		}
		if info, err := os.Stat(dir); err == nil && info.IsDir() {
			abs, err := filepath.Abs(dir)
			if err == nil {
				return abs
			}
			return dir
		}
	}
	return "./extensions"
}

func (s *Server) handleSynuraScript(w http.ResponseWriter, r *http.Request) {
	candidates := []string{
		s.cfg.SynuraScriptPath,
		"testdata/mock_server/synura.js",
		"mock_server/synura.js",
		"synura.js",
	}
	for _, p := range candidates {
		if p == "" {
			continue
		}
		if _, err := os.Stat(p); err == nil {
			http.ServeFile(w, r, p)
			return
		}
	}
	http.Error(w, "synura.js not found", http.StatusNotFound)
}

func (s *Server) logStartup(absExtensionsDir string) {
	log.Println("===========================================")
	log.Printf("       Mock Server Starting on %s", s.cfg.Addr)
	log.Println("===========================================")
	log.Println("")
	log.Println("--- API Endpoints ---")
	log.Printf("  http://localhost%s/login         - Set session cookie", s.cfg.Addr)
	log.Printf("  http://localhost%s/logout        - Clear session cookie", s.cfg.Addr)
	log.Printf("  http://localhost%s/ua            - Echo User-Agent", s.cfg.Addr)
	log.Printf("  http://localhost%s/headers       - Echo all headers", s.cfg.Addr)
	log.Printf("  http://localhost%s/get           - Echo request details", s.cfg.Addr)
	log.Printf("  http://localhost%s/post          - Echo body (POST)", s.cfg.Addr)
	log.Printf("  http://localhost%s/upload        - File upload (POST)", s.cfg.Addr)
	log.Printf("  http://localhost%s/login/get     - Authenticated GET", s.cfg.Addr)
	log.Printf("  http://localhost%s/login/post    - Authenticated POST", s.cfg.Addr)
	log.Printf("  http://localhost%s/login/upload  - Authenticated upload", s.cfg.Addr)
	log.Println("")
	log.Println("--- Extension Scripts ---")
	log.Printf("  http://localhost%s/synura.js", s.cfg.Addr)

	if s.cfg.AdditionalScriptPath != "" {
		log.Println("")
		log.Printf("--- Custom Extensions from: %s ---", s.cfg.AdditionalScriptPath)
		_ = filepath.Walk(s.cfg.AdditionalScriptPath, func(path string, info os.FileInfo, err error) error {
			if err != nil || info == nil || info.IsDir() {
				return nil
			}
			name := info.Name()
			if strings.HasSuffix(name, ".js") || name == "extensions.json" {
				relPath, err := filepath.Rel(s.cfg.AdditionalScriptPath, path)
				if err == nil {
					log.Printf("  http://localhost%s/ext/%s", s.cfg.Addr, filepath.ToSlash(relPath))
				}
			}
			return nil
		})
	}

	log.Println("")
	log.Printf("--- Example Extensions from: %s ---", absExtensionsDir)
	_ = filepath.Walk(absExtensionsDir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info == nil || info.IsDir() {
			return nil
		}
		name := info.Name()
		if strings.HasSuffix(name, ".js") || name == "extensions.json" {
			relPath, err := filepath.Rel(absExtensionsDir, path)
			if err == nil {
				log.Printf("  http://localhost%s/examples/%s", s.cfg.Addr, filepath.ToSlash(relPath))
			}
		}
		return nil
	})
	log.Println("")
	log.Println("===========================================")
}

func generateToken() string {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		log.Fatalf("Critical: crypto/rand failed: %v", err)
	}
	return hex.EncodeToString(b)
}

func enforceMethod(method string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != method {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		next(w, r)
	}
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	token := generateToken()
	expiry := time.Now().Add(sessionDuration)
	s.sessions.Store(token, expiry)

	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    token,
		Path:     "/",
		Expires:  expiry,
		HttpOnly: false,
	})
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(`{"status": "logged_in", "message": "Session cookie set"}`))
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	if cookie, err := r.Cookie("session_id"); err == nil {
		s.sessions.Delete(cookie.Value)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    "",
		Path:     "/",
		Expires:  time.Now().Add(-1 * time.Hour),
		HttpOnly: false,
	})
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(`{"status": "logged_out", "message": "Session cookie cleared"}`))
}

func (s *Server) handleUserAgent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{"user_agent": r.UserAgent()})
}

func (s *Server) handleHeaders(w http.ResponseWriter, r *http.Request) {
	headers := make(map[string]string)
	for k, v := range r.Header {
		headers[k] = strings.Join(v, ", ")
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(headers)
}

func (s *Server) handleEcho(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20)

	response := map[string]any{
		"method":  r.Method,
		"url":     r.URL.String(),
		"query":   map[string]string{},
		"cookies": map[string]string{},
	}

	queryParams := response["query"].(map[string]string)
	for k, v := range r.URL.Query() {
		queryParams[k] = strings.Join(v, ", ")
	}

	cookies := response["cookies"].(map[string]string)
	for _, cookie := range r.Cookies() {
		cookies[cookie.Name] = cookie.Value
	}

	if r.Method == http.MethodPost || r.Method == http.MethodPut {
		body, err := io.ReadAll(r.Body)
		if err == nil {
			response["body"] = string(body)
			var jsonBody any
			if json.Unmarshal(body, &jsonBody) == nil {
				response["json"] = jsonBody
			}
		}
	}

	_ = json.NewEncoder(w).Encode(response)
}

func (s *Server) handleUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	contentType := r.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "multipart/form-data") {
		http.Error(w, "Content-Type must be multipart/form-data", http.StatusBadRequest)
		return
	}

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Failed to parse multipart form: "+err.Error(), http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to retrieve file: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	response := map[string]any{
		"filename": handler.Filename,
		"size":     handler.Size,
		"header":   handler.Header,
		"message":  "File uploaded successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(response)
}

func (s *Server) isLoggedIn(r *http.Request) bool {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return false
	}
	val, ok := s.sessions.Load(cookie.Value)
	if !ok {
		return false
	}
	expiry, ok := val.(time.Time)
	if !ok || time.Now().After(expiry) {
		s.sessions.Delete(cookie.Value)
		return false
	}
	return true
}

func (s *Server) requireLogin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !s.isLoggedIn(r) {
			http.Error(w, "Unauthorized: Login required", http.StatusUnauthorized)
			return
		}

		cookie, _ := r.Cookie("session_id")
		newExpiry := time.Now().Add(sessionDuration)
		s.sessions.Store(cookie.Value, newExpiry)

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

type responseWriter struct {
	http.ResponseWriter
	statusCode int
	body       *bytes.Buffer
}

func newResponseWriter(w http.ResponseWriter) *responseWriter {
	return &responseWriter{ResponseWriter: w, statusCode: http.StatusOK, body: &bytes.Buffer{}}
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	rw.body.Write(b)
	return rw.ResponseWriter.Write(b)
}

func loggingMiddleware(s *Server, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/favicon.ico" {
			next.ServeHTTP(w, r)
			return
		}

		start := time.Now()

		authStatus := "[Guest]"
		if s.isLoggedIn(r) {
			authStatus = "[Auth]"
		}

		log.Printf("─── REQUEST ───────────────────────────────")
		log.Printf("%s %s %s", r.Method, r.URL.String(), authStatus)
		log.Printf("Headers:")
		for name, values := range r.Header {
			log.Printf("  %s: %s", name, strings.Join(values, ", "))
		}
		if len(r.Cookies()) > 0 {
			log.Printf("Cookies:")
			for _, cookie := range r.Cookies() {
				log.Printf("  %s: %s", cookie.Name, cookie.Value)
			}
		}

		if r.Method == http.MethodPost || r.Method == http.MethodPut {
			log.Printf("Content-Type: %s", r.Header.Get("Content-Type"))
			log.Printf("Content-Length: %d", r.ContentLength)
			if r.Body != nil {
				peekBuf := make([]byte, 1024)
				n, _ := io.ReadFull(r.Body, peekBuf)
				if n > 0 {
					chunk := peekBuf[:n]
					log.Printf("Request Body Preview:")
					if n == len(peekBuf) {
						log.Printf("  %s... (truncated)", string(chunk))
					} else {
						log.Printf("  %s", string(chunk))
					}
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

		rw := newResponseWriter(w)
		next.ServeHTTP(rw, r)

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
