package fetch

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestDoIncludesNetworkTime(t *testing.T) {
	t.Parallel()

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		time.Sleep(20 * time.Millisecond)
		_, _ = io.WriteString(w, "ok")
	}))
	defer server.Close()

	resp, err := Do(Request{
		Method:          http.MethodGet,
		URL:             server.URL,
		Timeout:         2 * time.Second,
		FollowRedirects: true,
	})
	if err != nil {
		t.Fatalf("Do() error: %v", err)
	}

	if resp.NetworkTime <= 0 {
		t.Fatalf("NetworkTime = %v, want > 0", resp.NetworkTime)
	}
	if string(resp.Body) != "ok" {
		t.Fatalf("body = %q, want %q", string(resp.Body), "ok")
	}
}
