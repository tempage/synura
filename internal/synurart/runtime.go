package synurart

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"reflect"
	"sort"
	"strconv"
	"strings"
	"sync/atomic"
	"time"
	"unicode/utf8"

	"github.com/dop251/goja"
	"github.com/ivere27/synura/internal/fetch"
	"golang.org/x/net/html"
	"golang.org/x/net/html/charset"
	"golang.org/x/term"
	"golang.org/x/text/encoding"
	"golang.org/x/text/language"
)

// View is a simulated Synura view state.
type View struct {
	ID       int64
	Path     string
	Data     map[string]any
	Callback goja.Value
}

type eventTiming struct {
	ViewID         int64
	EventID        string
	Depth          int
	StartedAt      time.Time
	ChildTotalMs   int64
	FetchCount     int64
	FetchTotalMs   int64
	FetchLogicMs   int64
	FetchNetworkMs int64
}

const defaultFetchTimeout = 10 * time.Second
const defaultNavigatorLanguage = "en-US"

// Options configures runtime initialization.
type Options struct {
	LocalStorageBackend LocalStorageBackend
}

// Runtime is a CLI Synura runtime simulator powered by goja.
type Runtime struct {
	vm             *goja.Runtime
	out            io.Writer
	errOut         io.Writer
	colorOut       bool
	jsonMode       bool
	views          map[int64]*View
	viewOrder      []int64
	callbackStack  []int64
	eventStack     []*eventTiming
	nextViewID     int64
	localStorage   map[string]string
	localBackend   LocalStorageBackend
	sessionStorage map[string]any
	locale         string
	document       *DOMElement
	domPrototype   *goja.Object
	nodeObjects    map[*html.Node]*goja.Object
	domParseMs     atomic.Int64
	fetchTimeout   time.Duration
	fetchOverrides map[string]string
}

// New creates a runtime with built-in Synura globals.
func New(out, errOut io.Writer) *Runtime {
	r, err := NewWithOptions(out, errOut, Options{})
	if err != nil {
		panic(fmt.Sprintf("synurart.New: %v", err))
	}
	return r
}

// NewWithOptions creates a runtime with built-in Synura globals and optional backends.
func NewWithOptions(out, errOut io.Writer, opts Options) (*Runtime, error) {
	if out == nil {
		out = os.Stdout
	}
	if errOut == nil {
		errOut = os.Stderr
	}
	colorOut := false
	if f, ok := out.(*os.File); ok {
		colorOut = term.IsTerminal(int(f.Fd()))
	}
	localStorage := make(map[string]string)
	if opts.LocalStorageBackend != nil {
		loaded, err := opts.LocalStorageBackend.Load()
		if err != nil {
			return nil, fmt.Errorf("load local storage: %w", err)
		}
		localStorage = loaded
	}
	r := &Runtime{
		vm:             goja.New(),
		out:            out,
		errOut:         errOut,
		colorOut:       colorOut,
		views:          make(map[int64]*View),
		viewOrder:      make([]int64, 0),
		callbackStack:  make([]int64, 0),
		eventStack:     make([]*eventTiming, 0),
		nextViewID:     1,
		localStorage:   localStorage,
		localBackend:   opts.LocalStorageBackend,
		sessionStorage: make(map[string]any),
		locale:         defaultNavigatorLanguage,
		nodeObjects:    make(map[*html.Node]*goja.Object),
		fetchTimeout:   defaultFetchTimeout,
		fetchOverrides: make(map[string]string),
	}
	r.installGlobals()
	return r, nil
}

// VM returns the underlying goja runtime.
func (r *Runtime) VM() *goja.Runtime {
	return r.vm
}

// SetJSONMode enables structured NDJSON output for automation.
func (r *Runtime) SetJSONMode(enabled bool) {
	r.jsonMode = enabled
}

// JSONMode returns whether JSON output is active.
func (r *Runtime) JSONMode() bool {
	return r.jsonMode
}

// Timeout returns the runtime fetch timeout.
func (r *Runtime) Timeout() time.Duration {
	return r.fetchTimeout
}

// SetTimeout updates the runtime fetch timeout.
func (r *Runtime) SetTimeout(timeout time.Duration) error {
	if timeout <= 0 {
		return errors.New("timeout must be greater than 0")
	}
	r.fetchTimeout = timeout
	return nil
}

func (r *Runtime) RecordDOMParse(durationMs int64) {
	r.domParseMs.Add(durationMs)
}

func (r *Runtime) DOMParseMs() int64 {
	return r.domParseMs.Load()
}

// Locale returns the current navigator.language value.
func (r *Runtime) Locale() string {
	if strings.TrimSpace(r.locale) == "" {
		return defaultNavigatorLanguage
	}
	return r.locale
}

// SetLocale updates navigator.language for the current runtime.
func (r *Runtime) SetLocale(raw string) error {
	normalized, err := normalizeLocale(raw)
	if err != nil {
		return err
	}
	r.locale = normalized
	r.syncNavigator()
	return nil
}

// jsonLog writes a single NDJSON line to errOut.
func (r *Runtime) jsonLog(data map[string]any) {
	b, _ := json.Marshal(data)
	fmt.Fprintf(r.errOut, "%s\n", b)
}

// LoadExtension loads and evaluates an extension JavaScript file.
func (r *Runtime) LoadExtension(path string) error {
	if strings.TrimSpace(path) == "" {
		return errors.New("extension path is required")
	}
	abs, err := filepath.Abs(path)
	if err != nil {
		return fmt.Errorf("resolve extension path: %w", err)
	}
	body, err := os.ReadFile(abs)
	if err != nil {
		return fmt.Errorf("read extension file: %w", err)
	}
	if _, err := r.vm.RunScript(abs, string(body)); err != nil {
		return fmt.Errorf("evaluate extension: %w", err)
	}
	r.syncNavigator()
	return nil
}

// CallHome calls SYNURA.main.home().
func (r *Runtime) CallHome() error {
	mainObj, err := r.mainObject()
	if err != nil {
		return err
	}
	return r.callMethod(mainObj, "home")
}

// CallDeepLink calls SYNURA.main.deeplink(url).
func (r *Runtime) CallDeepLink(url string) error {
	mainObj, err := r.mainObject()
	if err != nil {
		return err
	}
	return r.callMethod(mainObj, "deeplink", r.vm.ToValue(url))
}

// CallResume calls SYNURA.main.resume(viewId, context).
func (r *Runtime) CallResume(viewID int64, context map[string]any) error {
	mainObj, err := r.mainObject()
	if err != nil {
		return err
	}
	ctx := goja.Null()
	if context != nil {
		ctx = r.vm.ToValue(context)
	}
	return r.callMethod(mainObj, "resume", r.vm.ToValue(viewID), ctx)
}

// Emit sends an event to the view callback.
func (r *Runtime) Emit(viewID int64, eventID string, data map[string]any) error {
	view := r.views[viewID]
	if view == nil {
		return fmt.Errorf("view not found: %d", viewID)
	}
	event := map[string]any{
		"viewId":  viewID,
		"eventId": eventID,
		"context": mapFromAny(view.Data["context"]),
		"data":    data,
	}
	if r.jsonMode {
		r.jsonLog(map[string]any{"type": "event", "viewId": viewID, "eventId": eventID, "data": data})
	} else {
		fmt.Fprintf(r.out, "%s #%d %s %s\n", r.tag("EVENT\u2192EXT", "\033[35m"), viewID, eventID, toJSON(data))
	}
	return r.callViewCallback(view, event)
}

// ViewOrder returns current view stack order.
func (r *Runtime) ViewOrder() []int64 {
	out := make([]int64, len(r.viewOrder))
	copy(out, r.viewOrder)
	return out
}

// TopViewID returns the top view id.
func (r *Runtime) TopViewID() (int64, bool) {
	if len(r.viewOrder) == 0 {
		return 0, false
	}
	return r.viewOrder[len(r.viewOrder)-1], true
}

// GetView returns a view by id.
func (r *Runtime) GetView(viewID int64) (*View, bool) {
	v, ok := r.views[viewID]
	return v, ok
}

// LocalStorageSnapshot returns a copy of localStorage.
func (r *Runtime) LocalStorageSnapshot() map[string]string {
	m := make(map[string]string, len(r.localStorage))
	for k, v := range r.localStorage {
		m[k] = v
	}
	return m
}

// SetLocalStorageItem updates one localStorage value and persists it when configured.
func (r *Runtime) SetLocalStorageItem(key, value string) error {
	next := r.LocalStorageSnapshot()
	next[key] = value
	return r.replaceLocalStorage(next)
}

// RemoveLocalStorageItem removes one localStorage value and persists it when configured.
func (r *Runtime) RemoveLocalStorageItem(key string) error {
	next := r.LocalStorageSnapshot()
	delete(next, key)
	return r.replaceLocalStorage(next)
}

// ClearLocalStorage resets localStorage and persists the empty snapshot when configured.
func (r *Runtime) ClearLocalStorage() error {
	return r.replaceLocalStorage(make(map[string]string))
}

// SessionStorageSnapshot returns a copy of sessionStorage.
func (r *Runtime) SessionStorageSnapshot() map[string]any {
	m := make(map[string]any, len(r.sessionStorage))
	for k, v := range r.sessionStorage {
		m[k] = cloneAny(v)
	}
	return m
}

// ClearSessionStorage resets in-memory sessionStorage.
func (r *Runtime) ClearSessionStorage() {
	r.sessionStorage = make(map[string]any)
}

// FetchOverridesSnapshot returns a copy of the URL-to-file override map.
func (r *Runtime) FetchOverridesSnapshot() map[string]string {
	m := make(map[string]string, len(r.fetchOverrides))
	for k, v := range r.fetchOverrides {
		m[k] = v
	}
	return m
}

// SetFetchOverride registers one exact URL match to a local file.
func (r *Runtime) SetFetchOverride(rawURL, filePath string) error {
	normalizedURL, err := normalizeFetchOverrideURL(rawURL)
	if err != nil {
		return err
	}
	absPath, err := filepath.Abs(strings.TrimSpace(filePath))
	if err != nil {
		return fmt.Errorf("resolve file path: %w", err)
	}
	info, err := os.Stat(absPath)
	if err != nil {
		return fmt.Errorf("stat file: %w", err)
	}
	if info.IsDir() {
		return fmt.Errorf("file path is a directory: %s", absPath)
	}
	r.fetchOverrides[normalizedURL] = absPath
	return nil
}

// ClearFetchOverrides removes all runtime fetch overrides.
func (r *Runtime) ClearFetchOverrides() {
	r.fetchOverrides = make(map[string]string)
}

func (r *Runtime) replaceLocalStorage(next map[string]string) error {
	if next == nil {
		next = make(map[string]string)
	}
	if r.localBackend != nil {
		if err := r.localBackend.Save(next); err != nil {
			return err
		}
	}
	r.localStorage = next
	return nil
}

func (r *Runtime) installGlobals() {
	r.initDOM()
	r.installNavigator()
	r.installConsole()
	r.installStorage()
	r.installSynura()
	r.installDocument()
	r.installFetch()
	r.installURLSearchParams()
	r.installDOMParser()
	r.installTextEncoder()
	r.installTextDecoder()
}

func (r *Runtime) installNavigator() {
	navigator := r.vm.NewObject()
	_ = navigator.Set("language", r.Locale())
	_ = r.vm.Set("navigator", navigator)
}

func (r *Runtime) syncNavigator() {
	nav := r.vm.Get("navigator")
	if nav == nil || goja.IsUndefined(nav) || goja.IsNull(nav) {
		return
	}
	obj := nav.ToObject(r.vm)
	if obj == nil {
		return
	}
	_ = obj.Set("language", r.Locale())
}

func normalizeLocale(raw string) (string, error) {
	normalized := strings.TrimSpace(strings.ReplaceAll(raw, "_", "-"))
	if normalized == "" {
		return "", errors.New("locale is required")
	}
	tag, err := language.Parse(normalized)
	if err != nil {
		return "", fmt.Errorf("invalid locale: %q", raw)
	}
	return tag.String(), nil
}

func (r *Runtime) installConsole() {
	console := r.vm.NewObject()
	_ = console.Set("log", func(call goja.FunctionCall) goja.Value {
		r.printConsole("LOG", call.Arguments)
		return goja.Undefined()
	})
	_ = console.Set("warn", func(call goja.FunctionCall) goja.Value {
		r.printConsole("WARN", call.Arguments)
		return goja.Undefined()
	})
	_ = console.Set("error", func(call goja.FunctionCall) goja.Value {
		r.printConsole("ERROR", call.Arguments)
		return goja.Undefined()
	})
	_ = r.vm.Set("console", console)
}

func (r *Runtime) printConsole(level string, args []goja.Value) {
	parts := make([]string, 0, len(args))
	for _, arg := range args {
		parts = append(parts, stringifyAny(arg.Export()))
	}
	if r.jsonMode {
		r.jsonLog(map[string]any{
			"type":    "console",
			"level":   strings.ToLower(level),
			"message": strings.Join(parts, " "),
		})
		return
	}
	var code string
	switch level {
	case "LOG":
		code = "\033[36m"
	case "WARN":
		code = "\033[33m"
	case "ERROR":
		code = "\033[31m"
	default:
		code = "\033[37m"
	}
	fmt.Fprintf(r.out, "%s %s\n", r.tag("JS "+level, code), strings.Join(parts, " "))
}

func (r *Runtime) installStorage() {
	local := r.vm.NewObject()
	_ = local.Set("setItem", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 2 {
			return goja.Undefined()
		}
		key := call.Argument(0).String()
		val := call.Argument(1)
		if err := r.SetLocalStorageItem(key, val.String()); err != nil {
			panic(r.vm.NewGoError(err))
		}
		return goja.Undefined()
	})
	_ = local.Set("getItem", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return goja.Null()
		}
		key := call.Argument(0).String()
		if v, ok := r.localStorage[key]; ok {
			return r.vm.ToValue(v)
		}
		return goja.Null()
	})
	_ = local.Set("removeItem", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) > 0 {
			if err := r.RemoveLocalStorageItem(call.Argument(0).String()); err != nil {
				panic(r.vm.NewGoError(err))
			}
		}
		return goja.Undefined()
	})
	_ = local.Set("clear", func(call goja.FunctionCall) goja.Value {
		if err := r.ClearLocalStorage(); err != nil {
			panic(r.vm.NewGoError(err))
		}
		return goja.Undefined()
	})
	_ = r.vm.Set("localStorage", local)

	session := r.vm.NewObject()
	_ = session.Set("setItem", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 2 {
			return goja.Undefined()
		}
		key := call.Argument(0).String()
		r.sessionStorage[key] = cloneAny(call.Argument(1).Export())
		return goja.Undefined()
	})
	_ = session.Set("getItem", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return goja.Null()
		}
		key := call.Argument(0).String()
		if v, ok := r.sessionStorage[key]; ok {
			return r.vm.ToValue(cloneAny(v))
		}
		return goja.Null()
	})
	_ = session.Set("removeItem", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) > 0 {
			delete(r.sessionStorage, call.Argument(0).String())
		}
		return goja.Undefined()
	})
	_ = session.Set("clear", func(call goja.FunctionCall) goja.Value {
		r.ClearSessionStorage()
		return goja.Undefined()
	})
	_ = r.vm.Set("sessionStorage", session)
}

func (r *Runtime) installSynura() {
	synura := r.vm.NewObject()
	_ = synura.Set("isPolyfill", true)
	_ = synura.Set("open", func(call goja.FunctionCall) goja.Value { return r.jsOpen(call) })
	_ = synura.Set("update", func(call goja.FunctionCall) goja.Value { return r.jsUpdate(call) })
	_ = synura.Set("connect", func(call goja.FunctionCall) goja.Value { return r.jsConnect(call) })
	_ = synura.Set("close", func(call goja.FunctionCall) goja.Value { return r.jsClose(call) })
	_ = synura.Set("parse", func(call goja.FunctionCall) goja.Value { return r.hostSynuraParse(call) })
	_ = r.vm.Set("synura", synura)
}

func (r *Runtime) installDocument() {
	document := r.vm.NewObject()
	_ = document.Set("querySelector", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return goja.Null()
		}
		return r.hostQuerySelector(call.Argument(0).String())
	})
	_ = document.Set("querySelectorAll", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return r.vm.ToValue([]any{})
		}
		return r.hostQuerySelectorAll(call.Argument(0).String())
	})
	_ = r.vm.Set("document", document)
}

func (r *Runtime) installFetch() {
	fetchFunc := func(call goja.FunctionCall) goja.Value {
		return r.jsFetch(call)
	}
	_ = r.vm.Set("fetch", fetchFunc)
	synura := r.vm.Get("synura")
	if obj := synura.ToObject(r.vm); obj != nil {
		_ = obj.Set("fetch", fetchFunc)
	}
}

func (r *Runtime) installDOMParser() {
	_ = r.vm.Set("DOMParser", r.newDOMParser)
}

func (r *Runtime) installTextEncoder() {
	uint8ArrayCtor, ok := goja.AssertConstructor(r.vm.Get("Uint8Array"))
	if !ok {
		return
	}

	_ = r.vm.Set("TextEncoder", func(call goja.ConstructorCall) *goja.Object {
		obj := call.This
		_ = obj.Set("encoding", "utf-8")
		_ = obj.Set("encode", func(fc goja.FunctionCall) goja.Value {
			input := ""
			if len(fc.Arguments) > 0 {
				input = fc.Argument(0).String()
			}

			buf := r.vm.NewArrayBuffer([]byte(input))
			value, err := uint8ArrayCtor(nil, r.vm.ToValue(buf))
			if err != nil {
				panic(r.vm.ToValue(err.Error()))
			}
			return value
		})
		_ = obj.Set("encodeInto", func(fc goja.FunctionCall) goja.Value {
			input := ""
			if len(fc.Arguments) > 0 {
				input = fc.Argument(0).String()
			}
			if len(fc.Arguments) < 2 || goja.IsUndefined(fc.Argument(1)) || goja.IsNull(fc.Argument(1)) {
				panic(r.vm.ToValue("TextEncoder.encodeInto requires a destination Uint8Array"))
			}

			var dest []byte
			if err := r.vm.ExportTo(fc.Argument(1), &dest); err != nil {
				panic(r.vm.ToValue(err.Error()))
			}

			read, written := encodeUTF8Into(input, dest)
			result := r.vm.NewObject()
			_ = result.Set("read", read)
			_ = result.Set("written", written)
			return result
		})
		return obj
	})
}

func (r *Runtime) installTextDecoder() {
	_ = r.vm.Set("TextDecoder", func(call goja.ConstructorCall) *goja.Object {
		label := "utf-8"
		if len(call.Arguments) > 0 && !goja.IsUndefined(call.Argument(0)) && !goja.IsNull(call.Argument(0)) {
			label = call.Argument(0).String()
		}

		enc, canonical, err := lookupTextEncoding(label)
		if err != nil {
			panic(r.vm.ToValue(err.Error()))
		}

		obj := call.This
		_ = obj.Set("encoding", canonical)
		_ = obj.Set("fatal", false)
		_ = obj.Set("ignoreBOM", false)
		_ = obj.Set("decode", func(fc goja.FunctionCall) goja.Value {
			if len(fc.Arguments) == 0 || goja.IsUndefined(fc.Argument(0)) || goja.IsNull(fc.Argument(0)) {
				return r.vm.ToValue("")
			}

			var data []byte
			if err := r.vm.ExportTo(fc.Argument(0), &data); err != nil {
				panic(r.vm.ToValue("TextDecoder.decode requires an ArrayBuffer or typed array"))
			}
			if len(data) == 0 {
				return r.vm.ToValue("")
			}

			decoded, err := io.ReadAll(enc.NewDecoder().Reader(bytes.NewReader(data)))
			if err != nil {
				panic(r.vm.ToValue(err.Error()))
			}
			return r.vm.ToValue(string(decoded))
		})
		return obj
	})
}

func lookupTextEncoding(label string) (encoding.Encoding, string, error) {
	trimmed := strings.TrimSpace(label)
	if trimmed == "" {
		trimmed = "utf-8"
	}

	enc, canonical := charset.Lookup(trimmed)
	if enc == nil {
		return nil, "", fmt.Errorf("unsupported encoding: %s", label)
	}
	if canonical == "" {
		canonical = strings.ToLower(trimmed)
	}
	return enc, canonical, nil
}

func encodeUTF8Into(input string, dest []byte) (read int, written int) {
	var encoded [utf8.UTFMax]byte

	for _, r := range input {
		size := utf8.EncodeRune(encoded[:], r)
		if written+size > len(dest) {
			break
		}

		copy(dest[written:], encoded[:size])
		written += size
		if r > 0xFFFF {
			read += 2
		} else {
			read++
		}
	}

	return read, written
}

func (r *Runtime) jsOpen(call goja.FunctionCall) goja.Value {
	res := map[string]any{"success": false, "error": "invalid argument"}
	if len(call.Arguments) == 0 {
		return r.vm.ToValue(res)
	}

	var options map[string]any
	var context map[string]any
	var callback goja.Value
	var nextArgIndex int

	arg0 := call.Argument(0)
	if arg0.ExportType() == reflect.TypeOf("") {
		path := strings.TrimSpace(arg0.String())
		if path == "" {
			res["error"] = "view is required"
			return r.vm.ToValue(res)
		}
		options = mapFromAny(call.Argument(1).Export())
		if options == nil {
			options = make(map[string]any)
		}
		options["view"] = path
		nextArgIndex = 2
	} else {
		options = mapFromAny(arg0.Export())
		if options == nil {
			res["error"] = "first argument must be object or view path"
			return r.vm.ToValue(res)
		}
		nextArgIndex = 1
	}

	viewPath := strings.TrimSpace(stringifyAny(options["view"]))
	if viewPath == "" {
		viewPath = strings.TrimSpace(stringifyAny(options["viewName"]))
	}
	if viewPath == "" {
		res["error"] = "view is required"
		return r.vm.ToValue(res)
	}

	if len(call.Arguments) > nextArgIndex {
		arg := call.Argument(nextArgIndex)
		if _, ok := goja.AssertFunction(arg); ok {
			callback = arg
		} else if !goja.IsUndefined(arg) && !goja.IsNull(arg) {
			context = mapFromAny(arg.Export())
		}
	}
	if len(call.Arguments) > nextArgIndex+1 {
		if _, ok := goja.AssertFunction(call.Argument(nextArgIndex + 1)); ok {
			callback = call.Argument(nextArgIndex + 1)
		}
	}

	if context == nil {
		context = map[string]any{}
	}

	data := cloneMap(options)
	if models, ok := data["models"]; ok {
		data["models"] = processModels(models)
	}
	data["context"] = context

	if callbackViewID, ok := r.currentCallbackViewID(); ok {
		r.dropForwardViews(callbackViewID)
	}

	viewID := r.nextViewID
	r.nextViewID++
	view := &View{ID: viewID, Path: viewPath, Data: data, Callback: callback}
	r.views[viewID] = view
	r.viewOrder = append(r.viewOrder, viewID)

	if r.jsonMode {
		r.jsonLog(map[string]any{"type": "open", "viewId": viewID, "path": viewPath})
	} else {
		fmt.Fprintf(r.out, "%s #%d %s\n", r.tag("OPEN", "\033[32m"), viewID, viewPath)
	}

	if callback != nil {
		event := map[string]any{
			"viewId":  viewID,
			"eventId": "LOAD",
			"context": context,
			"data":    map[string]any{},
		}
		if err := r.callViewCallback(view, event); err != nil {
			if r.jsonMode {
				r.jsonLog(map[string]any{"type": "error", "message": fmt.Sprintf("callback LOAD failed: %v", err)})
			} else {
				fmt.Fprintf(r.errOut, "[ERROR] callback LOAD failed: %v\n", err)
			}
		}
	}

	res = map[string]any{
		"success":  true,
		"viewId":   viewID,
		"id":       viewID,
		"viewName": viewName(viewPath),
	}
	return r.vm.ToValue(res)
}

func (r *Runtime) jsUpdate(call goja.FunctionCall) goja.Value {
	res := map[string]any{"success": false, "error": "view not found"}
	if len(call.Arguments) < 2 {
		res["error"] = "viewId and data are required"
		return r.vm.ToValue(res)
	}
	viewID := call.Argument(0).ToInteger()
	view := r.views[viewID]
	if view == nil {
		return r.vm.ToValue(res)
	}

	diff := mapFromAny(call.Argument(1).Export())
	if diff == nil {
		diff = map[string]any{}
	}
	if styles, ok := diff["styles"]; ok {
		stylesMap := mapFromAny(styles)
		if stylesMap != nil {
			dst := mapFromAny(view.Data["styles"])
			if dst == nil {
				dst = map[string]any{}
			}
			for k, v := range stylesMap {
				dst[k] = cloneAny(v)
			}
			view.Data["styles"] = dst
		}
	}
	if models, ok := diff["models"]; ok {
		processed := processModels(models)
		dst := mapFromAny(view.Data["models"])
		if dst == nil {
			dst = map[string]any{}
		}
		appendModel := mapFromAny(processed["append"])
		if appendModel != nil {
			newDetails := sliceFromAny(appendModel["details"])
			switch view.Path {
			case "/views/chat":
				chatAppend := mapFromAny(dst["append"])
				if chatAppend == nil {
					chatAppend = map[string]any{"details": []any{}}
				}
				chatAppend["details"] = append(sliceFromAny(chatAppend["details"]), cloneSlice(newDetails)...)
				dst["append"] = chatAppend
			case "/views/list":
				contents := mapFromAny(dst["contents"])
				if contents == nil {
					contents = map[string]any{"details": []any{}}
				}
				contents["details"] = append(sliceFromAny(contents["details"]), cloneSlice(newDetails)...)
				dst["contents"] = contents
			}
		}
		keys := make([]string, 0, len(processed))
		for k := range processed {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		for _, k := range keys {
			if k == "append" {
				continue
			}
			dst[k] = cloneAny(processed[k])
		}
		view.Data["models"] = dst
	}

	if r.jsonMode {
		r.jsonLog(map[string]any{"type": "update", "viewId": viewID, "diff": diff})
	} else {
		fmt.Fprintf(r.out, "%s #%d %s\n", r.tag("UPDATE", "\033[33m"), viewID, toJSON(diff))
	}
	res = map[string]any{"success": true, "viewId": viewID, "id": viewID}
	return r.vm.ToValue(res)
}

func (r *Runtime) jsConnect(call goja.FunctionCall) goja.Value {
	res := map[string]any{"success": false, "error": "view not found"}
	if len(call.Arguments) < 1 {
		res["error"] = "viewId is required"
		return r.vm.ToValue(res)
	}
	viewID := call.Argument(0).ToInteger()
	view := r.views[viewID]
	if view == nil {
		return r.vm.ToValue(res)
	}

	var context map[string]any
	var callback goja.Value
	if len(call.Arguments) > 1 {
		arg := call.Argument(1)
		if _, ok := goja.AssertFunction(arg); ok {
			callback = arg
		} else if !goja.IsUndefined(arg) && !goja.IsNull(arg) {
			context = mapFromAny(arg.Export())
		}
	}
	if len(call.Arguments) > 2 {
		if _, ok := goja.AssertFunction(call.Argument(2)); ok {
			callback = call.Argument(2)
		}
	}

	if callback != nil {
		view.Callback = callback
	}
	if context != nil {
		view.Data["context"] = context
	}

	if view.Callback != nil {
		event := map[string]any{
			"viewId":  view.ID,
			"eventId": "LOAD",
			"context": mapFromAny(view.Data["context"]),
			"data":    map[string]any{},
		}
		if err := r.callViewCallback(view, event); err != nil {
			if r.jsonMode {
				r.jsonLog(map[string]any{"type": "error", "message": fmt.Sprintf("connect callback LOAD failed: %v", err)})
			} else {
				fmt.Fprintf(r.errOut, "[ERROR] connect callback LOAD failed: %v\n", err)
			}
		}
	}

	res = map[string]any{"success": true, "viewId": viewID, "id": viewID}
	return r.vm.ToValue(res)
}

func (r *Runtime) jsClose(call goja.FunctionCall) goja.Value {
	res := map[string]any{"success": false, "error": "view not found"}
	if len(call.Arguments) < 1 {
		res["error"] = "viewId is required"
		return r.vm.ToValue(res)
	}
	viewID := call.Argument(0).ToInteger()
	if _, ok := r.views[viewID]; !ok {
		return r.vm.ToValue(res)
	}
	delete(r.views, viewID)
	for i, id := range r.viewOrder {
		if id == viewID {
			r.viewOrder = append(r.viewOrder[:i], r.viewOrder[i+1:]...)
			break
		}
	}
	if r.jsonMode {
		r.jsonLog(map[string]any{"type": "close", "viewId": viewID})
	} else {
		fmt.Fprintf(r.out, "%s #%d\n", r.tag("CLOSE", "\033[31m"), viewID)
	}
	res = map[string]any{"success": true, "viewId": viewID, "id": viewID}
	return r.vm.ToValue(res)
}

func (r *Runtime) jsFetch(call goja.FunctionCall) goja.Value {
	startedAt := time.Now()
	if len(call.Arguments) < 1 {
		return r.errorFetchResponse("fetch url is required")
	}
	urlStr := strings.TrimSpace(call.Argument(0).String())
	if urlStr == "" {
		return r.errorFetchResponse("fetch url is required")
	}
	if err := r.validateFetchDomain(urlStr); err != nil {
		return r.errorFetchResponse(err.Error())
	}
	normalizedURL, err := normalizeFetchOverrideURL(urlStr)
	if err != nil {
		return r.errorFetchResponse(err.Error())
	}

	options := map[string]any{}
	if len(call.Arguments) > 1 && !goja.IsUndefined(call.Argument(1)) && !goja.IsNull(call.Argument(1)) {
		options = mapFromAny(call.Argument(1).Export())
	}

	method := strings.TrimSpace(stringifyAny(options["method"]))
	if method == "" {
		method = http.MethodGet
	}
	headers := make(http.Header)
	for k, v := range mapFromAny(options["headers"]) {
		headers.Set(k, stringifyAny(v))
	}
	body := stringifyAny(options["body"])
	bypass := strings.TrimSpace(stringifyAny(options["bypass"]))

	var progressFn goja.Callable
	if len(call.Arguments) > 1 && !goja.IsUndefined(call.Argument(1)) && !goja.IsNull(call.Argument(1)) {
		if optObj := call.Argument(1).ToObject(r.vm); optObj != nil {
			onProgress := optObj.Get("onProgress")
			if fn, ok := goja.AssertFunction(onProgress); ok {
				progressFn = fn
			}
		}
	}

	resp, err := r.fetchResponse(urlStr, normalizedURL, method, headers, []byte(body), bypass, progressFn)
	if err != nil {
		if r.jsonMode {
			r.jsonLog(map[string]any{"type": "error", "message": fmt.Sprintf("fetch error: %v", err)})
		} else {
			fmt.Fprintf(r.errOut, "[FETCH ERROR] %v\n", err)
		}
		return r.errorFetchResponse(err.Error())
	}
	if err := r.validateFetchDomain(resp.URL); err != nil {
		return r.errorFetchResponse(err.Error())
	}
	networkMs := resp.NetworkTime.Milliseconds()
	if networkMs < 0 {
		networkMs = 0
	}
	response := r.buildFetchResponse(resp)
	totalMs := time.Since(startedAt).Milliseconds()
	if totalMs < 0 {
		totalMs = 0
	}
	logicMs := totalMs - networkMs
	if logicMs < 0 {
		logicMs = 0
	}
	r.recordFetchTiming(totalMs, logicMs, networkMs)
	redirectTo := redirectTarget(urlStr, resp.StatusCode, resp.Headers)

	if r.jsonMode {
		data := map[string]any{
			"type":        "fetch",
			"method":      strings.ToUpper(method),
			"url":         urlStr,
			"status":      resp.StatusCode,
			"totalMs":     totalMs,
			"logicMs":     logicMs,
			"networkMs":   networkMs,
			"logicTime":   (time.Duration(logicMs) * time.Millisecond).String(),
			"networkTime": resp.NetworkTime.String(),
		}
		if redirectTo != "" {
			data["redirectTo"] = redirectTo
		}
		r.jsonLog(data)
	} else {
		if redirectTo != "" {
			fmt.Fprintf(r.out, "%s %s %s -> %d (redirect=%s, b=%dms, network=%dms)\n", r.tag("FETCH", "\033[34m"), strings.ToUpper(method), urlStr, resp.StatusCode, redirectTo, logicMs, networkMs)
		} else {
			fmt.Fprintf(r.out, "%s %s %s -> %d (b=%dms, network=%dms)\n", r.tag("FETCH", "\033[34m"), strings.ToUpper(method), urlStr, resp.StatusCode, logicMs, networkMs)
		}
	}
	return response
}

func (r *Runtime) fetchResponse(
	urlStr string,
	normalizedURL string,
	method string,
	headers http.Header,
	body []byte,
	bypass string,
	progressFn goja.Callable,
) (*fetch.Response, error) {
	if filePath, ok := r.fetchOverrides[normalizedURL]; ok {
		return r.fetchOverrideResponse(urlStr, filePath, progressFn)
	}

	return fetch.Do(fetch.Request{
		Method:  method,
		URL:     urlStr,
		Headers: headers,
		Body:    body,
		Bypass:  bypass,
		Timeout: r.fetchTimeout,
		// Synurart fetch intentionally exposes 3xx responses to extensions.
		// Redirect-following flags such as `followRedirects` or `redirect: "follow"`
		// are ignored by design; extensions must handle redirect responses explicitly.
		FollowRedirects: false,
		OnProgress: func(current, total int64) {
			if progressFn != nil {
				_, _ = progressFn(goja.Undefined(), r.vm.ToValue(current), r.vm.ToValue(total))
			}
		},
	})
}

func (r *Runtime) fetchOverrideResponse(urlStr, filePath string, progressFn goja.Callable) (*fetch.Response, error) {
	body, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("read override file: %w", err)
	}
	if progressFn != nil {
		_, _ = progressFn(goja.Undefined(), r.vm.ToValue(int64(len(body))), r.vm.ToValue(int64(len(body))))
	}

	headers := make(http.Header)
	headers.Set("Content-Type", guessContentType(filePath))

	return &fetch.Response{
		StatusCode:  http.StatusOK,
		Status:      "200 OK",
		URL:         urlStr,
		Headers:     headers,
		Body:        body,
		NetworkTime: 0,
	}, nil
}

func (r *Runtime) validateFetchDomain(rawURL string) error {
	allowedDomain, err := r.synuraDomain()
	if err != nil {
		return err
	}
	reqHost, err := hostFromURL(rawURL)
	if err != nil {
		return err
	}
	if reqHost == allowedDomain {
		return nil
	}
	return fmt.Errorf("fetch host %q is not allowed (allowed=%q)", reqHost, allowedDomain)
}

func (r *Runtime) synuraDomain() (string, error) {
	synuraDef := r.vm.Get("SYNURA")
	if synuraDef == nil || goja.IsUndefined(synuraDef) || goja.IsNull(synuraDef) {
		return "", errors.New("SYNURA.domain is required for fetch")
	}
	synuraObj := synuraDef.ToObject(r.vm)
	if synuraObj == nil {
		return "", errors.New("SYNURA.domain is required for fetch")
	}
	domainValue := synuraObj.Get("domain")
	if goja.IsUndefined(domainValue) || goja.IsNull(domainValue) {
		return "", errors.New("SYNURA.domain is required for fetch")
	}
	domain := normalizeHost(domainValue.String())
	if domain == "" {
		return "", errors.New("SYNURA.domain is required for fetch")
	}
	return domain, nil
}

func hostFromURL(rawURL string) (string, error) {
	u, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil {
		return "", fmt.Errorf("invalid fetch url: %w", err)
	}
	if u.Host == "" {
		if strings.HasPrefix(strings.TrimSpace(rawURL), "//") {
			u, err = url.Parse("https:" + strings.TrimSpace(rawURL))
			if err != nil {
				return "", fmt.Errorf("invalid fetch url: %w", err)
			}
		}
	}
	host := normalizeHost(u.Host)
	if host == "" {
		return "", errors.New("fetch url must be absolute with a host")
	}
	return host, nil
}

func normalizeHost(input string) string {
	s := strings.TrimSpace(input)
	if s == "" {
		return ""
	}

	if strings.Contains(s, "://") || strings.HasPrefix(s, "//") {
		raw := s
		if strings.HasPrefix(raw, "//") {
			raw = "https:" + raw
		}
		u, err := url.Parse(raw)
		if err == nil && strings.TrimSpace(u.Host) != "" {
			s = u.Host
		}
	} else {
		u, err := url.Parse("https://" + s)
		if err == nil && strings.TrimSpace(u.Host) != "" {
			s = u.Host
		}
	}

	return strings.TrimSuffix(strings.ToLower(strings.TrimSpace(s)), ".")
}

func normalizeFetchOverrideURL(rawURL string) (string, error) {
	trimmed := strings.TrimSpace(rawURL)
	if trimmed == "" {
		return "", errors.New("fetch url is required")
	}
	if strings.HasPrefix(trimmed, "//") {
		trimmed = "https:" + trimmed
	}
	u, err := url.Parse(trimmed)
	if err != nil {
		return "", fmt.Errorf("invalid fetch url: %w", err)
	}
	if normalizeHost(u.Host) == "" {
		return "", errors.New("fetch url must be absolute with a host")
	}
	return u.String(), nil
}

func guessContentType(filePath string) string {
	contentType := mime.TypeByExtension(strings.ToLower(filepath.Ext(filePath)))
	if strings.TrimSpace(contentType) != "" {
		return contentType
	}
	return "application/octet-stream"
}

func (r *Runtime) errorFetchResponse(message string) goja.Value {
	obj := r.vm.NewObject()
	_ = obj.Set("status", 0)
	_ = obj.Set("statusText", "")
	_ = obj.Set("ok", false)
	_ = obj.Set("url", "")
	_ = obj.Set("headers", map[string]string{})
	_ = obj.Set("error", message)
	_ = obj.Set("networkMs", int64(0))
	_ = obj.Set("networkTime", "0s")
	_ = obj.Set("text", func(goja.FunctionCall) goja.Value { return r.vm.ToValue("") })
	_ = obj.Set("arrayBuffer", func(goja.FunctionCall) goja.Value { return r.newArrayBufferValue(nil) })
	_ = obj.Set("json", func(goja.FunctionCall) goja.Value { return r.vm.ToValue(map[string]any{}) })
	_ = obj.Set("dom", func(call goja.FunctionCall) goja.Value {
		mimeType := "text/html"
		if len(call.Arguments) > 0 && !goja.IsUndefined(call.Argument(0)) && !goja.IsNull(call.Argument(0)) {
			mimeType = call.Argument(0).String()
		}
		if mimeType != "text/html" {
			panic(r.vm.ToValue("Unsupported mimeType for dom(): " + mimeType))
		}
		return r.newDocumentFromHTML("")
	})
	return obj
}

func (r *Runtime) buildFetchResponse(resp *fetch.Response) goja.Value {
	obj := r.vm.NewObject()
	_ = obj.Set("status", resp.StatusCode)
	_ = obj.Set("statusText", resp.Status)
	_ = obj.Set("ok", resp.StatusCode >= 200 && resp.StatusCode < 300)
	_ = obj.Set("url", resp.URL)
	_ = obj.Set("headers", headerToMap(resp.Headers))
	_ = obj.Set("networkMs", resp.NetworkTime.Milliseconds())
	_ = obj.Set("networkTime", resp.NetworkTime.String())
	body := string(resp.Body)
	_ = obj.Set("text", func(goja.FunctionCall) goja.Value {
		return r.vm.ToValue(body)
	})
	_ = obj.Set("arrayBuffer", func(goja.FunctionCall) goja.Value {
		return r.newArrayBufferValue(resp.Body)
	})
	_ = obj.Set("json", func(goja.FunctionCall) goja.Value {
		var v any
		if err := json.Unmarshal(resp.Body, &v); err != nil {
			if r.jsonMode {
				r.jsonLog(map[string]any{"type": "error", "message": fmt.Sprintf("fetch JSON parse error: %v", err)})
			} else {
				fmt.Fprintf(r.errOut, "[FETCH JSON ERROR] %v\n", err)
			}
			return r.vm.ToValue(map[string]any{})
		}
		return r.vm.ToValue(v)
	})
	_ = obj.Set("dom", func(call goja.FunctionCall) goja.Value {
		mimeType := "text/html"
		if len(call.Arguments) > 0 && !goja.IsUndefined(call.Argument(0)) && !goja.IsNull(call.Argument(0)) {
			mimeType = call.Argument(0).String()
		}
		if mimeType != "text/html" {
			panic(r.vm.ToValue("Unsupported mimeType for dom(): " + mimeType))
		}
		return r.newDocumentFromHTML(body)
	})
	return obj
}

func (r *Runtime) newArrayBufferValue(data []byte) goja.Value {
	cloned := append([]byte(nil), data...)
	return r.vm.ToValue(r.vm.NewArrayBuffer(cloned))
}

func (r *Runtime) callViewCallback(view *View, event map[string]any) error {
	if view.Callback == nil {
		return nil
	}
	fn, ok := goja.AssertFunction(view.Callback)
	if !ok {
		return nil
	}
	eventID := strings.TrimSpace(stringifyAny(event["eventId"]))
	frame := &eventTiming{
		ViewID:    view.ID,
		EventID:   eventID,
		Depth:     len(r.eventStack) + 1,
		StartedAt: time.Now(),
	}
	r.callbackStack = append(r.callbackStack, view.ID)
	r.eventStack = append(r.eventStack, frame)
	defer func() {
		totalMs := time.Since(frame.StartedAt).Milliseconds()
		if totalMs < 0 {
			totalMs = 0
		}
		exclusiveMs := totalMs - frame.ChildTotalMs
		if exclusiveMs < 0 {
			exclusiveMs = 0
		}
		backendMs := exclusiveMs - frame.FetchNetworkMs
		if backendMs < 0 {
			backendMs = 0
		}
		r.logEventTiming(frame, exclusiveMs, backendMs)
		if len(r.eventStack) > 1 {
			r.eventStack[len(r.eventStack)-2].ChildTotalMs += totalMs
		}
		r.eventStack = r.eventStack[:len(r.eventStack)-1]
		r.callbackStack = r.callbackStack[:len(r.callbackStack)-1]
	}()
	_, err := fn(goja.Undefined(), r.vm.ToValue(event))
	return err
}

func (r *Runtime) recordFetchTiming(totalMs, logicMs, networkMs int64) {
	if len(r.eventStack) == 0 {
		return
	}
	frame := r.eventStack[len(r.eventStack)-1]
	frame.FetchCount++
	frame.FetchTotalMs += totalMs
	frame.FetchLogicMs += logicMs
	frame.FetchNetworkMs += networkMs
}

func (r *Runtime) logEventTiming(frame *eventTiming, totalMs, backendMs int64) {
	if frame == nil {
		return
	}
	if r.jsonMode {
		r.jsonLog(map[string]any{
			"type":          "event_done",
			"viewId":        frame.ViewID,
			"eventId":       frame.EventID,
			"depth":         frame.Depth,
			"totalMs":       totalMs,
			"backendMs":     backendMs,
			"fetchMs":       frame.FetchNetworkMs,
			"fetchCount":    frame.FetchCount,
			"fetchLogicMs":  frame.FetchLogicMs,
			"fetchTotalMs":  frame.FetchTotalMs,
			"exclusiveTime": (time.Duration(totalMs) * time.Millisecond).String(),
			"backendTime":   (time.Duration(backendMs) * time.Millisecond).String(),
			"fetchTime":     (time.Duration(frame.FetchNetworkMs) * time.Millisecond).String(),
		})
		return
	}
	fmt.Fprintf(
		r.out,
		"%s #%d %s done (total=%dms, b=%dms, f=%dms, fetches=%d, depth=%d)\n",
		r.tag("EVENT\u2190EXT", "\033[32m"),
		frame.ViewID,
		frame.EventID,
		totalMs,
		backendMs,
		frame.FetchNetworkMs,
		frame.FetchCount,
		frame.Depth,
	)
}

func (r *Runtime) currentCallbackViewID() (int64, bool) {
	if len(r.callbackStack) == 0 {
		return 0, false
	}
	return r.callbackStack[len(r.callbackStack)-1], true
}

func (r *Runtime) dropForwardViews(viewID int64) {
	idx := -1
	for i, id := range r.viewOrder {
		if id == viewID {
			idx = i
			break
		}
	}
	if idx < 0 || idx >= len(r.viewOrder)-1 {
		return
	}
	for _, id := range r.viewOrder[idx+1:] {
		delete(r.views, id)
	}
	r.viewOrder = r.viewOrder[:idx+1]
}

// tag renders a bracketed label like [OPEN] with optional color.
func (r *Runtime) tag(label, colorCode string) string {
	if !r.colorOut || colorCode == "" {
		return "[" + label + "]"
	}
	return colorCode + "[" + label + "]" + "\033[0m"
}

func (r *Runtime) mainObject() (*goja.Object, error) {
	synuraDef := r.vm.Get("SYNURA")
	if goja.IsUndefined(synuraDef) || goja.IsNull(synuraDef) {
		return nil, errors.New("SYNURA is not defined")
	}
	synuraObj := synuraDef.ToObject(r.vm)
	mainValue := synuraObj.Get("main")
	if goja.IsUndefined(mainValue) || goja.IsNull(mainValue) {
		return nil, errors.New("SYNURA.main is not defined")
	}
	mainObj := mainValue.ToObject(r.vm)
	if mainObj == nil {
		return nil, errors.New("SYNURA.main is not an object")
	}
	return mainObj, nil
}

func (r *Runtime) callMethod(obj *goja.Object, name string, args ...goja.Value) error {
	fnValue := obj.Get(name)
	fn, ok := goja.AssertFunction(fnValue)
	if !ok {
		return fmt.Errorf("SYNURA.main.%s is not a function", name)
	}
	_, err := fn(obj, args...)
	return err
}

func processModels(models any) map[string]any {
	in := mapFromAny(models)
	if in == nil {
		return map[string]any{}
	}
	processed := make(map[string]any, len(in))
	for k, v := range in {
		processed[k] = inferModel(v)
	}
	return processed
}

func inferModel(value any) map[string]any {
	if value == nil {
		return map[string]any{}
	}
	switch v := value.(type) {
	case string:
		return map[string]any{"message": v}
	case json.Number:
		f, _ := v.Float64()
		return map[string]any{"value": f, "code": int64(f)}
	case int:
		return map[string]any{"value": float64(v), "code": v}
	case int64:
		return map[string]any{"value": float64(v), "code": v}
	case float32:
		return map[string]any{"value": float64(v), "code": int64(v)}
	case float64:
		return map[string]any{"value": v, "code": int64(v)}
	case []any:
		return map[string]any{"details": cloneSlice(v)}
	case []string:
		d := make([]any, 0, len(v))
		for _, item := range v {
			d = append(d, item)
		}
		return map[string]any{"details": d}
	case map[string]any:
		if isModelWrapper(v) {
			return cloneMap(v)
		}
		b, err := json.Marshal(v)
		if err == nil {
			return map[string]any{"message": string(b)}
		}
		return map[string]any{"message": stringifyAny(v)}
	default:
		rv := reflect.ValueOf(value)
		if rv.IsValid() && rv.Kind() == reflect.Slice {
			details := make([]any, 0, rv.Len())
			for i := 0; i < rv.Len(); i++ {
				details = append(details, cloneAny(rv.Index(i).Interface()))
			}
			return map[string]any{"details": details}
		}
		if m := mapFromAny(value); m != nil {
			if isModelWrapper(m) {
				return cloneMap(m)
			}
			b, err := json.Marshal(m)
			if err == nil {
				return map[string]any{"message": string(b)}
			}
		}
		return map[string]any{"message": stringifyAny(value)}
	}
}

func isModelWrapper(m map[string]any) bool {
	if len(m) == 0 {
		return true
	}
	for k := range m {
		switch k {
		case "code", "message", "details", "value":
		default:
			return false
		}
	}
	return true
}

func cloneAny(v any) any {
	switch x := v.(type) {
	case map[string]any:
		return cloneMap(x)
	case []any:
		return cloneSlice(x)
	case []string:
		out := make([]any, 0, len(x))
		for _, item := range x {
			out = append(out, item)
		}
		return out
	default:
		rv := reflect.ValueOf(v)
		if !rv.IsValid() {
			return nil
		}
		if rv.Kind() == reflect.Slice {
			out := make([]any, 0, rv.Len())
			for i := 0; i < rv.Len(); i++ {
				out = append(out, cloneAny(rv.Index(i).Interface()))
			}
			return out
		}
		if rv.Kind() == reflect.Map {
			out := map[string]any{}
			iter := rv.MapRange()
			for iter.Next() {
				out[stringifyAny(iter.Key().Interface())] = cloneAny(iter.Value().Interface())
			}
			return out
		}
		return v
	}
}

func cloneMap(m map[string]any) map[string]any {
	out := make(map[string]any, len(m))
	for k, v := range m {
		out[k] = cloneAny(v)
	}
	return out
}

func cloneSlice(s []any) []any {
	out := make([]any, 0, len(s))
	for _, v := range s {
		out = append(out, cloneAny(v))
	}
	return out
}

func mapFromAny(v any) map[string]any {
	switch m := v.(type) {
	case map[string]any:
		return m
	default:
		rv := reflect.ValueOf(v)
		if !rv.IsValid() || rv.Kind() != reflect.Map {
			return nil
		}
		out := map[string]any{}
		iter := rv.MapRange()
		for iter.Next() {
			out[stringifyAny(iter.Key().Interface())] = iter.Value().Interface()
		}
		return out
	}
}

func sliceFromAny(v any) []any {
	switch s := v.(type) {
	case []any:
		return s
	default:
		rv := reflect.ValueOf(v)
		if !rv.IsValid() || rv.Kind() != reflect.Slice {
			return []any{}
		}
		out := make([]any, 0, rv.Len())
		for i := 0; i < rv.Len(); i++ {
			out = append(out, rv.Index(i).Interface())
		}
		return out
	}
}

func stringifyAny(v any) string {
	switch x := v.(type) {
	case nil:
		return ""
	case string:
		return x
	case fmt.Stringer:
		return x.String()
	case json.Number:
		return x.String()
	case int:
		return strconv.Itoa(x)
	case int64:
		return strconv.FormatInt(x, 10)
	case float64:
		return strconv.FormatFloat(x, 'f', -1, 64)
	case bool:
		if x {
			return "true"
		}
		return "false"
	default:
		b, err := json.Marshal(x)
		if err == nil {
			return string(b)
		}
		return fmt.Sprintf("%v", x)
	}
}

func viewName(path string) string {
	parts := strings.Split(strings.Trim(path, "/"), "/")
	if len(parts) == 0 {
		return ""
	}
	return parts[len(parts)-1]
}

func toJSON(v any) string {
	b, err := json.Marshal(v)
	if err != nil {
		return stringifyAny(v)
	}
	return string(b)
}

func headerToMap(h http.Header) map[string]string {
	out := make(map[string]string, len(h))
	for k, v := range h {
		out[k] = strings.Join(v, ", ")
	}
	return out
}

func redirectTarget(requestURL string, statusCode int, headers http.Header) string {
	if statusCode < 300 || statusCode >= 400 || headers == nil {
		return ""
	}
	location := strings.TrimSpace(headers.Get("Location"))
	if location == "" {
		return ""
	}

	locationURL, err := url.Parse(location)
	if err != nil {
		return location
	}
	if locationURL.IsAbs() {
		return locationURL.String()
	}

	baseURL, err := url.Parse(requestURL)
	if err != nil {
		return location
	}
	return baseURL.ResolveReference(locationURL).String()
}
