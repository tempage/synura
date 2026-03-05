package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/ivere27/synura/internal/fetch"
)

type multiFlag []string

func (m *multiFlag) String() string {
	return strings.Join(*m, ",")
}

func (m *multiFlag) Set(value string) error {
	*m = append(*m, value)
	return nil
}

func usage() {
	fmt.Fprintf(os.Stderr, "Synura fetch (curl-like)\n\n")
	fmt.Fprintf(os.Stderr, "Usage:\n")
	fmt.Fprintf(os.Stderr, "  %s [options] <url>\n\n", os.Args[0])
	fmt.Fprintf(os.Stderr, "Options:\n")
	fmt.Fprintf(os.Stderr, "  -X, --request <METHOD>    HTTP method\n")
	fmt.Fprintf(os.Stderr, "  -H, --header <K: V>       Add request header (repeatable)\n")
	fmt.Fprintf(os.Stderr, "  -d, --data <BODY>         Request body (implies POST if -X omitted)\n")
	fmt.Fprintf(os.Stderr, "      --url <URL>           Request URL (alternative to positional URL)\n")
	fmt.Fprintf(os.Stderr, "      --bypass <PROFILE>    TLS bypass profile, e.g. chrome/android\n")
	fmt.Fprintf(os.Stderr, "  -A, --user-agent <UA>     Override User-Agent header\n")
	fmt.Fprintf(os.Stderr, "  -i, --include             Include response status and headers in output\n")
	fmt.Fprintf(os.Stderr, "  -L, --location            Follow redirects\n")
	fmt.Fprintf(os.Stderr, "      --timeout <DURATION>  Timeout (default 30s)\n")
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	fs := flag.NewFlagSet(os.Args[0], flag.ContinueOnError)
	fs.SetOutput(os.Stderr)
	fs.Usage = usage

	var method string
	var data string
	var urlValue string
	var bypass string
	var include bool
	var follow bool
	var userAgent string
	var timeout time.Duration
	var headers multiFlag

	fs.StringVar(&method, "X", "", "request method")
	fs.StringVar(&method, "request", "", "request method")
	fs.Var(&headers, "H", "header")
	fs.Var(&headers, "header", "header")
	fs.StringVar(&data, "d", "", "data")
	fs.StringVar(&data, "data", "", "data")
	fs.StringVar(&urlValue, "url", "", "request URL")
	fs.StringVar(&bypass, "bypass", "", "bypass profile")
	fs.BoolVar(&include, "i", false, "include headers")
	fs.BoolVar(&include, "include", false, "include headers")
	fs.BoolVar(&follow, "L", false, "follow redirects")
	fs.BoolVar(&follow, "location", false, "follow redirects")
	fs.StringVar(&userAgent, "A", "", "user-agent")
	fs.StringVar(&userAgent, "user-agent", "", "user-agent")
	fs.DurationVar(&timeout, "timeout", 30*time.Second, "timeout")

	if err := fs.Parse(os.Args[1:]); err != nil {
		return err
	}

	if urlValue == "" && fs.NArg() > 0 {
		urlValue = strings.TrimSpace(fs.Arg(0))
	}
	if urlValue == "" {
		usage()
		return fmt.Errorf("url is required")
	}

	if method == "" {
		if data != "" {
			method = http.MethodPost
		} else {
			method = http.MethodGet
		}
	}

	hdr := make(http.Header)
	for _, raw := range headers {
		k, v, ok := strings.Cut(raw, ":")
		if !ok {
			return fmt.Errorf("invalid header %q, expected 'Key: Value'", raw)
		}
		hdr.Add(strings.TrimSpace(k), strings.TrimSpace(v))
	}
	if userAgent != "" {
		hdr.Set("User-Agent", userAgent)
	}

	resp, err := fetch.Do(fetch.Request{
		Method:          method,
		URL:             urlValue,
		Headers:         hdr,
		Body:            []byte(data),
		Bypass:          bypass,
		Timeout:         timeout,
		FollowRedirects: follow,
	})
	if err != nil {
		return err
	}

	if include {
		fmt.Printf("HTTP/1.1 %s\n", resp.Status)
		for k, values := range resp.Headers {
			for _, v := range values {
				fmt.Printf("%s: %s\n", k, v)
			}
		}
		fmt.Println()
	}
	_, _ = os.Stdout.Write(resp.Body)
	return nil
}
