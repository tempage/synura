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
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/dop251/goja"
	"github.com/ivere27/synura/internal/fetch"
	"golang.org/x/net/html"
	"golang.org/x/net/html/charset"
	"golang.org/x/term"
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

var htmlCharsetPattern = regexp.MustCompile(`(?i)charset\s*=\s*['"]?\s*([a-z0-9._-]+)`)

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
	nodeIndex      map[int64]any
	nodeObjects    map[*html.Node]*goja.Object
	nextNodeID     int64
	fetchTimeout   time.Duration
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
		nodeIndex:      make(map[int64]any),
		nodeObjects:    make(map[*html.Node]*goja.Object),
		nextNodeID:     1,
		fetchTimeout:   defaultFetchTimeout,
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
	if nav := r.vm.Get("navigator"); nav != nil && !goja.IsUndefined(nav) && !goja.IsNull(nav) {
		if obj := nav.ToObject(r.vm); obj != nil {
			_ = obj.Set("language", normalized)
		}
	}
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
	r.installNavigator()
	r.installConsole()
	r.installStorage()
	r.installSynura()
	r.installFetch()
	r.installURLSearchParams()
	r.installDOMParser()
}

func (r *Runtime) installNavigator() {
	navigator := r.vm.NewObject()
	_ = navigator.Set("language", r.Locale())
	_ = r.vm.Set("navigator", navigator)
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
	_ = synura.Set("parse", func(call goja.FunctionCall) goja.Value { return r.jsParse(call) })
	_ = r.vm.Set("synura", synura)
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
	_ = r.vm.Set("DOMParser", func(call goja.ConstructorCall) *goja.Object {
		obj := call.This
		_ = obj.Set("parseFromString", func(fc goja.FunctionCall) goja.Value {
			htmlText := ""
			if len(fc.Arguments) > 0 {
				htmlText = fc.Argument(0).String()
			}
			return r.newDocumentFromHTML(htmlText)
		})
		return obj
	})
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

func (r *Runtime) jsParse(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		return r.vm.ToValue([]any{})
	}
	kind := call.Argument(0).String()
	if kind != "post" {
		return r.vm.ToValue([]any{})
	}
	node := r.nodeFromValue(call.Argument(1))
	if node == nil {
		return r.vm.ToValue([]any{})
	}
	return r.vm.ToValue(domToDetails(node))
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
	follow := boolFromAny(options["followRedirects"])

	var progressFn goja.Callable
	if len(call.Arguments) > 1 && !goja.IsUndefined(call.Argument(1)) && !goja.IsNull(call.Argument(1)) {
		if optObj := call.Argument(1).ToObject(r.vm); optObj != nil {
			onProgress := optObj.Get("onProgress")
			if fn, ok := goja.AssertFunction(onProgress); ok {
				progressFn = fn
			}
		}
	}

	resp, err := fetch.Do(fetch.Request{
		Method:          method,
		URL:             urlStr,
		Headers:         headers,
		Body:            []byte(body),
		Bypass:          bypass,
		Timeout:         r.fetchTimeout,
		FollowRedirects: follow,
		OnProgress: func(current, total int64) {
			if progressFn != nil {
				_, _ = progressFn(goja.Undefined(), r.vm.ToValue(current), r.vm.ToValue(total))
			}
		},
	})
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

	if r.jsonMode {
		r.jsonLog(map[string]any{
			"type":        "fetch",
			"method":      strings.ToUpper(method),
			"url":         urlStr,
			"status":      resp.StatusCode,
			"totalMs":     totalMs,
			"logicMs":     logicMs,
			"networkMs":   networkMs,
			"logicTime":   (time.Duration(logicMs) * time.Millisecond).String(),
			"networkTime": resp.NetworkTime.String(),
		})
	} else {
		fmt.Fprintf(r.out, "%s %s %s -> %d (b=%dms, network=%dms)\n", r.tag("FETCH", "\033[34m"), strings.ToUpper(method), urlStr, resp.StatusCode, logicMs, networkMs)
	}
	return response
}

func (r *Runtime) validateFetchDomain(rawURL string) error {
	allowedHosts, err := r.allowedFetchHosts()
	if err != nil {
		return err
	}
	reqHost, err := hostFromURL(rawURL)
	if err != nil {
		return err
	}
	for _, allowedHost := range allowedHosts {
		if reqHost == allowedHost {
			return nil
		}
	}
	return fmt.Errorf("fetch host %q is not allowed (allowed=%q)", reqHost, strings.Join(allowedHosts, ", "))
}

func (r *Runtime) allowedFetchHosts() ([]string, error) {
	allowedDomain, err := r.synuraDomain()
	if err != nil {
		return nil, err
	}
	hosts := []string{allowedDomain}
	seen := map[string]struct{}{allowedDomain: {}}

	siteDef := r.vm.Get("SITE")
	if siteDef == nil || goja.IsUndefined(siteDef) || goja.IsNull(siteDef) {
		return hosts, nil
	}
	siteObj := siteDef.ToObject(r.vm)
	if siteObj == nil {
		return hosts, nil
	}
	aliasesValue := siteObj.Get("hostAliases")
	if goja.IsUndefined(aliasesValue) || goja.IsNull(aliasesValue) {
		return hosts, nil
	}
	exported := aliasesValue.Export()
	aliases, ok := exported.([]any)
	if !ok {
		return hosts, nil
	}
	for _, alias := range aliases {
		host := normalizeHost(stringifyAny(alias))
		if host == "" {
			continue
		}
		if _, exists := seen[host]; exists {
			continue
		}
		seen[host] = struct{}{}
		hosts = append(hosts, host)
	}
	return hosts, nil
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

func (r *Runtime) errorFetchResponse(message string) goja.Value {
	obj := r.vm.NewObject()
	_ = obj.Set("status", 0)
	_ = obj.Set("statusText", "")
	_ = obj.Set("ok", false)
	_ = obj.Set("error", message)
	_ = obj.Set("networkMs", int64(0))
	_ = obj.Set("networkTime", "0s")
	_ = obj.Set("text", func(goja.FunctionCall) goja.Value { return r.vm.ToValue("") })
	_ = obj.Set("json", func(goja.FunctionCall) goja.Value { return r.vm.ToValue(map[string]any{}) })
	_ = obj.Set("dom", func(goja.FunctionCall) goja.Value { return r.newDocumentFromHTML("") })
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
	body := decodeResponseBody(resp.Headers, resp.Body)
	_ = obj.Set("text", func(goja.FunctionCall) goja.Value {
		return r.vm.ToValue(body)
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
		return r.newDocumentFromHTML(body)
	})
	return obj
}

func decodeResponseBody(headers http.Header, body []byte) string {
	if len(body) == 0 {
		return ""
	}

	contentType := ""
	if headers != nil {
		contentType = headers.Get("Content-Type")
	}

	headerCharset := declaredCharsetFromContentType(contentType)
	htmlCharset := declaredCharsetFromHTML(body)
	if headerCharset != "" {
		decoded, ok := decodeBytesWithCharset(body, headerCharset)
		if ok {
			if htmlCharset != "" && !sameCharset(headerCharset, htmlCharset) && looksLikeMojibake(decoded) {
				if repaired, repairedOK := decodeBytesWithCharset(body, htmlCharset); repairedOK {
					return repaired
				}
			}
			return decoded
		}
	}
	if htmlCharset != "" {
		if decoded, ok := decodeBytesWithCharset(body, htmlCharset); ok {
			return decoded
		}
	}

	enc, _, _ := charset.DetermineEncoding(body, contentType)
	decoded, err := io.ReadAll(enc.NewDecoder().Reader(bytes.NewReader(body)))
	if err != nil {
		return string(body)
	}
	if htmlCharset != "" && looksLikeMojibake(string(decoded)) {
		if repaired, ok := decodeBytesWithCharset(body, htmlCharset); ok {
			return repaired
		}
	}
	return string(decoded)
}

func declaredCharsetFromContentType(contentType string) string {
	trimmed := strings.TrimSpace(contentType)
	if trimmed == "" {
		return ""
	}
	_, params, err := mime.ParseMediaType(trimmed)
	if err == nil {
		if value := strings.TrimSpace(params["charset"]); value != "" {
			return value
		}
	}
	lower := strings.ToLower(trimmed)
	idx := strings.Index(lower, "charset=")
	if idx < 0 {
		return ""
	}
	value := strings.TrimSpace(trimmed[idx+len("charset="):])
	value = strings.Trim(value, `"' ;`)
	return value
}

func declaredCharsetFromHTML(body []byte) string {
	if len(body) == 0 {
		return ""
	}
	scan := body
	if len(scan) > 64*1024 {
		scan = scan[:64*1024]
	}
	match := htmlCharsetPattern.FindStringSubmatch(strings.ToLower(string(scan)))
	if len(match) < 2 {
		return ""
	}
	return strings.TrimSpace(match[1])
}

func decodeBytesWithCharset(body []byte, label string) (string, bool) {
	enc, _ := charset.Lookup(strings.TrimSpace(label))
	if enc == nil {
		return "", false
	}
	decoded, err := io.ReadAll(enc.NewDecoder().Reader(bytes.NewReader(body)))
	if err != nil {
		return "", false
	}
	return string(decoded), true
}

func sameCharset(a, b string) bool {
	_, nameA := charset.Lookup(strings.TrimSpace(a))
	_, nameB := charset.Lookup(strings.TrimSpace(b))
	if nameA != "" && nameB != "" {
		return strings.EqualFold(nameA, nameB)
	}
	return strings.EqualFold(strings.TrimSpace(a), strings.TrimSpace(b))
}

func looksLikeMojibake(text string) bool {
	if text == "" {
		return false
	}
	return strings.ContainsRune(text, '\uFFFD')
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

func boolFromAny(v any) bool {
	switch b := v.(type) {
	case bool:
		return b
	case string:
		l := strings.ToLower(strings.TrimSpace(b))
		return l == "1" || l == "true" || l == "yes" || l == "on"
	case int:
		return b != 0
	case int64:
		return b != 0
	case float64:
		return b != 0
	default:
		return false
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
