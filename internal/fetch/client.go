package fetch

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	fhttp "github.com/bogdanfinn/fhttp"
	tls_client "github.com/bogdanfinn/tls-client"
	"github.com/bogdanfinn/tls-client/profiles"
)

// Request is a runtime fetch request.
type Request struct {
	Method          string
	URL             string
	Headers         http.Header
	Body            []byte
	Bypass          string
	Timeout         time.Duration
	FollowRedirects bool
	OnProgress      func(current, total int64)
}

// Response is a runtime fetch response.
type Response struct {
	StatusCode int
	Status     string
	URL        string
	Headers    http.Header
	Body       []byte
}

type httpClientDoer interface {
	Do(req *http.Request) (*http.Response, error)
	Close()
}

type stdClientWrapper struct {
	client *http.Client
}

func (w *stdClientWrapper) Do(req *http.Request) (*http.Response, error) {
	return w.client.Do(req)
}

func (w *stdClientWrapper) Close() {
	if w.client != nil && w.client.Transport != nil {
		if t, ok := w.client.Transport.(*http.Transport); ok {
			t.CloseIdleConnections()
		}
	}
}

type tlsClientWrapper struct {
	client tls_client.HttpClient
}

func (w *tlsClientWrapper) Do(req *http.Request) (*http.Response, error) {
	fReq, err := fhttp.NewRequestWithContext(req.Context(), req.Method, req.URL.String(), req.Body)
	if err != nil {
		return nil, err
	}
	for k, v := range req.Header {
		for _, vv := range v {
			fReq.Header.Add(k, vv)
		}
	}

	resp, err := w.client.Do(fReq)
	if err != nil {
		return nil, err
	}

	return &http.Response{
		Status:        resp.Status,
		StatusCode:    resp.StatusCode,
		Header:        http.Header(resp.Header),
		Body:          resp.Body,
		ContentLength: resp.ContentLength,
		Request:       req,
	}, nil
}

func (w *tlsClientWrapper) Close() {
	if w.client != nil {
		w.client.CloseIdleConnections()
		w.client = nil
	}
}

// Do executes a synchronous HTTP request matching Synura runtime semantics.
func Do(req Request) (*Response, error) {
	method := strings.ToUpper(strings.TrimSpace(req.Method))
	if method == "" {
		method = http.MethodGet
	}
	urlStr := strings.TrimSpace(req.URL)
	if urlStr == "" {
		return nil, fmt.Errorf("url is required")
	}
	timeout := req.Timeout
	if timeout <= 0 {
		timeout = 30 * time.Second
	}

	client, err := newClient(req.Bypass, timeout, req.FollowRedirects)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	httpReq, err := http.NewRequestWithContext(ctx, method, urlStr, bytes.NewReader(req.Body))
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}

	headers := req.Headers
	if headers == nil {
		headers = make(http.Header)
	}
	for k, values := range headers {
		for _, v := range values {
			httpReq.Header.Add(k, v)
		}
	}
	if req.Bypass != "" && httpReq.Header.Get("User-Agent") == "" {
		httpReq.Header.Set("User-Agent", UserAgentFromBypass(req.Bypass))
	}

	httpResp, err := client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer httpResp.Body.Close()

	total := httpResp.ContentLength
	if total < 0 {
		total = -1
	}
	body, err := io.ReadAll(httpResp.Body)
	if err != nil {
		return nil, fmt.Errorf("read body: %w", err)
	}
	if req.OnProgress != nil {
		req.OnProgress(int64(len(body)), total)
	}

	respURL := ""
	if httpResp.Request != nil && httpResp.Request.URL != nil {
		respURL = httpResp.Request.URL.String()
	}

	return &Response{
		StatusCode: httpResp.StatusCode,
		Status:     httpResp.Status,
		URL:        respURL,
		Headers:    httpResp.Header.Clone(),
		Body:       body,
	}, nil
}

func newClient(bypass string, timeout time.Duration, followRedirects bool) (httpClientDoer, error) {
	if bypass == "" || bypass == "-" {
		transport := &http.Transport{}
		client := &http.Client{Transport: transport, Timeout: timeout}
		if !followRedirects {
			client.CheckRedirect = func(_ *http.Request, _ []*http.Request) error {
				return http.ErrUseLastResponse
			}
		}
		return &stdClientWrapper{client: client}, nil
	}

	options := []tls_client.HttpClientOption{
		tls_client.WithTimeoutSeconds(int(timeout.Seconds())),
		tls_client.WithClientProfile(ClientProfileFromBypass(bypass)),
	}
	if !followRedirects {
		options = append(options, tls_client.WithNotFollowRedirects())
	}

	client, err := tls_client.NewHttpClient(tls_client.NewNoopLogger(), options...)
	if err != nil {
		return nil, fmt.Errorf("create TLS client: %w", err)
	}
	return &tlsClientWrapper{client: client}, nil
}

// ClientProfileFromBypass mirrors Synura bypass profile selection.
func ClientProfileFromBypass(bypass string) profiles.ClientProfile {
	parts := strings.Split(strings.ToLower(strings.TrimSpace(bypass)), "/")
	browser := parts[0]
	switch browser {
	case "firefox", "tor":
		return profiles.Firefox_135
	case "chrome":
		return profiles.Chrome_133_PSK
	default:
		return profiles.Chrome_133_PSK
	}
}

// UserAgentFromBypass mirrors Synura bypass user-agent selection.
func UserAgentFromBypass(bypass string) string {
	parts := strings.Split(strings.ToLower(strings.TrimSpace(bypass)), "/")
	browser := "chrome"
	osName := "windows"
	if len(parts) > 0 && parts[0] != "" {
		browser = parts[0]
	}
	if len(parts) > 1 && parts[1] != "" {
		osName = parts[1]
	}

	switch browser {
	case "firefox":
		switch osName {
		case "windows":
			return "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0"
		case "linux":
			return "Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0"
		case "macos":
			return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0"
		case "android":
			return "Mozilla/5.0 (Android 16; Mobile; rv:144.0) Gecko/144.0 Firefox/144.0"
		case "ios":
			return "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/144.0 Mobile/15E148 Safari/605.1.15"
		default:
			return "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0"
		}
	case "tor":
		switch osName {
		case "windows":
			return "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0"
		case "macos":
			return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0"
		case "linux":
			return "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
		case "android":
			return "Mozilla/5.0 (Android 10; Mobile; rv:128.0) Gecko/134.0 Firefox/128.0"
		case "ios":
			return "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/128.3 Mobile/15E148 Safari/605.1.15"
		default:
			return "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0"
		}
	default:
		switch osName {
		case "windows":
			return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
		case "linux":
			return "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
		case "macos":
			return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
		case "android":
			return "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36"
		case "ios":
			return "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0.7444.77 Mobile/15E148 Safari/604.1"
		default:
			return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
		}
	}
}
