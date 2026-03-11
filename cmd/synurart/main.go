package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/ivere27/synura/internal/synurart"
)

type shellState struct {
	rt               *synurart.Runtime
	localStoragePath string
}

var (
	jsonMode bool
	evalCmd  string
)

func main() {
	if err := run(); err != nil {
		if jsonMode {
			b, _ := json.Marshal(map[string]any{"type": "error", "message": err.Error()})
			fmt.Fprintf(os.Stderr, "%s\n", b)
		} else {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
		}
		os.Exit(1)
	}
}

func run() error {
	var extPath string
	var noHome bool
	flag.StringVar(&extPath, "ext", "", "path to extension js file")
	flag.BoolVar(&noHome, "no-home", false, "do not call SYNURA.main.home() after loading")
	flag.StringVar(&evalCmd, "e", "", "execute command and exit (e.g. -e 'views')")
	flag.BoolVar(&jsonMode, "json", false, "structured JSON output for automation")
	flag.Parse()

	if extPath == "" && flag.NArg() > 0 {
		extPath = flag.Arg(0)
	}
	localStoragePath, err := defaultLocalStoragePath()
	if err != nil {
		return err
	}
	state := &shellState{
		rt:               synurart.New(os.Stdout, os.Stderr),
		localStoragePath: localStoragePath,
	}
	if jsonMode {
		state.rt.SetJSONMode(true)
	}
	if strings.TrimSpace(extPath) != "" {
		if err := loadRuntimeExtension(state, extPath, !noHome); err != nil {
			return err
		}
	} else {
		if !jsonMode {
			fmt.Printf("%s %s\n", dim("No extension loaded."), dim("Use: load <path/to/extension.js>"))
		}
	}

	if evalCmd != "" {
		args, err := splitArgs(evalCmd)
		if err != nil {
			return err
		}
		if len(args) == 0 {
			return nil
		}
		return runCommand(state, args)
	}

	return runREPL(state)
}

func runCommand(state *shellState, args []string) error {
	rt := state.rt
	cmd := strings.ToLower(args[0])
	switch cmd {
	case "help", "h", "?":
		printHelp()
	case "load":
		if len(args) < 2 {
			return fmt.Errorf("usage: load <path/to/extension.js> [--no-home]")
		}
		autoHome := true
		if len(args) > 2 && (args[2] == "--no-home" || args[2] == "nohome") {
			autoHome = false
		}
		return loadRuntimeExtension(state, args[1], autoHome)
	case "quit", "q", "exit":
		os.Exit(0)
	case "views", "ls":
		renderViews(rt)
	case "v":
		if len(args) == 1 {
			renderViews(rt)
			break
		}
		if len(args) == 2 {
			id, err := strconv.ParseInt(args[1], 10, 64)
			if err != nil {
				return err
			}
			renderView(rt, id)
			break
		}
		return fmt.Errorf("usage: v [viewId]")
	case "view":
		if len(args) < 2 {
			return fmt.Errorf("usage: view <id>")
		}
		id, err := strconv.ParseInt(args[1], 10, 64)
		if err != nil {
			return err
		}
		if len(args) > 2 {
			return fmt.Errorf("usage: view <id>")
		}
		renderView(rt, id)
	case "render":
		id, err := resolveViewID(rt, args[1:])
		if err != nil {
			return err
		}
		printViewContent(rt, id)
	case "home":
		if err := rt.CallHome(); err != nil {
			return err
		}
		renderViews(rt)
	case "deeplink":
		if len(args) < 2 {
			return fmt.Errorf("usage: deeplink <url>")
		}
		if err := rt.CallDeepLink(args[1]); err != nil {
			return err
		}
		renderViews(rt)
	case "resume":
		if len(args) < 2 {
			return fmt.Errorf("usage: resume <viewId> [jsonContext]")
		}
		id, err := strconv.ParseInt(args[1], 10, 64)
		if err != nil {
			return err
		}
		ctx := map[string]any{}
		if len(args) > 2 {
			ctx, err = parseJSONObject(args[2])
			if err != nil {
				return err
			}
		}
		if err := rt.CallResume(id, ctx); err != nil {
			return err
		}
		emitOK()
	case "event":
		if len(args) < 3 {
			return fmt.Errorf("usage: event <viewId> <EVENT_ID> [jsonData]")
		}
		id, err := strconv.ParseInt(args[1], 10, 64)
		if err != nil {
			return err
		}
		data := map[string]any{}
		if len(args) > 3 {
			data, err = parseJSONObject(args[3])
			if err != nil {
				return err
			}
		}
		if err := rt.Emit(id, strings.ToUpper(args[2]), data); err != nil {
			return err
		}
		emitOK()
	case "n":
		if len(args) > 2 {
			return fmt.Errorf("usage: n [viewId]")
		}
		id, err := resolveViewID(rt, args[1:])
		if err != nil {
			return err
		}
		if err := rt.Emit(id, "SCROLL_TO_END", map[string]any{}); err != nil {
			return err
		}
		emitOK()
	case "refresh":
		if len(args) < 2 {
			return fmt.Errorf("usage: refresh <viewId>")
		}
		id, err := strconv.ParseInt(args[1], 10, 64)
		if err != nil {
			return err
		}
		if err := rt.Emit(id, "REFRESH", map[string]any{}); err != nil {
			return err
		}
		emitOK()
	case "r":
		if len(args) > 2 {
			return fmt.Errorf("usage: r [viewId]")
		}
		id, err := resolveViewID(rt, args[1:])
		if err != nil {
			return err
		}
		if err := rt.Emit(id, "REFRESH", map[string]any{}); err != nil {
			return err
		}
		emitOK()
	case "menu":
		if len(args) < 3 {
			return fmt.Errorf("usage: menu <viewId> <label>")
		}
		id, err := strconv.ParseInt(args[1], 10, 64)
		if err != nil {
			return err
		}
		if err := rt.Emit(id, "MENU_CLICK", map[string]any{"menu": args[2]}); err != nil {
			return err
		}
		emitOK()
	case "query":
		if len(args) < 3 {
			return fmt.Errorf("usage: query <viewId> <text>")
		}
		id, err := strconv.ParseInt(args[1], 10, 64)
		if err != nil {
			return err
		}
		if err := rt.Emit(id, "QUERY", map[string]any{"query": args[2]}); err != nil {
			return err
		}
		emitOK()
	case "submit":
		if len(args) < 3 {
			return fmt.Errorf("usage: submit <viewId> <jsonData>")
		}
		id, err := strconv.ParseInt(args[1], 10, 64)
		if err != nil {
			return err
		}
		data, err := parseJSONObject(args[2])
		if err != nil {
			return err
		}
		if err := rt.Emit(id, "SUBMIT", data); err != nil {
			return err
		}
		emitOK()
	case "s":
		if len(args) < 2 || len(args) > 3 {
			return fmt.Errorf("usage: s <index> [viewId]")
		}
		if err := handleTap(rt, append([]string{"index"}, args[1:]...)); err != nil {
			return err
		}
		emitOK()
	case "tap", "click":
		if err := handleTap(rt, args[1:]); err != nil {
			return err
		}
		emitOK()
	case "itemmenu":
		if err := handleItemMenu(rt, args[1:]); err != nil {
			return err
		}
		emitOK()
	case "reorder":
		if err := handleReorder(rt, args[1:]); err != nil {
			return err
		}
		emitOK()
	case "c":
		if len(args) > 2 {
			return fmt.Errorf("usage: c [viewId]")
		}
		id, err := resolveViewID(rt, args[1:])
		if err != nil {
			return err
		}
		_, err = rt.VM().RunString(fmt.Sprintf("synura.close(%d)", id))
		if err != nil {
			return err
		}
		emitOK()
	case "close":
		if len(args) < 2 {
			return fmt.Errorf("usage: close <viewId>")
		}
		id, err := strconv.ParseInt(args[1], 10, 64)
		if err != nil {
			return err
		}
		_, err = rt.VM().RunString(fmt.Sprintf("synura.close(%d)", id))
		if err != nil {
			return err
		}
		emitOK()
	case "timeout":
		if len(args) > 2 {
			return fmt.Errorf("usage: timeout [duration]")
		}
		if len(args) == 2 {
			timeout, err := parseTimeoutArg(args[1])
			if err != nil {
				return err
			}
			if err := rt.SetTimeout(timeout); err != nil {
				return err
			}
		}
		timeout := rt.Timeout()
		if jsonMode {
			jsonOut(map[string]any{
				"type":    "timeout",
				"timeout": timeout.String(),
				"seconds": timeout.Seconds(),
			})
		} else {
			fmt.Printf("%s %s\n", dim("timeout:"), c(timeout.String(), cBrightYellow))
		}
	case "locale":
		if len(args) > 2 {
			return fmt.Errorf("usage: locale [tag]")
		}
		if len(args) == 2 {
			if err := rt.SetLocale(args[1]); err != nil {
				return err
			}
		}
		locale := rt.Locale()
		if jsonMode {
			jsonOut(map[string]any{
				"type":   "locale",
				"locale": locale,
			})
		} else {
			fmt.Printf("%s %s\n", dim("locale:"), c(locale, cBrightYellow))
		}
	case "storage":
		return handleStorageCommand(rt, args[1:])
	case "eval":
		if len(args) < 2 {
			return fmt.Errorf("usage: eval <javascript>")
		}
		code := strings.Join(args[1:], " ")
		v, err := rt.VM().RunString(code)
		if err != nil {
			return err
		}
		if jsonMode {
			jsonOut(map[string]any{"type": "eval", "result": v.Export()})
		} else {
			fmt.Printf("%v\n", v.Export())
		}
	default:
		return fmt.Errorf("unknown command: %s (type 'help')", cmd)
	}
	return nil
}

func loadRuntimeExtension(state *shellState, extPath string, autoHome bool) error {
	timeout := 10 * time.Second
	locale := ""
	if state.rt != nil {
		timeout = state.rt.Timeout()
		locale = state.rt.Locale()
	}
	rt, err := newRuntimeForExtension(state, extPath)
	if err != nil {
		return err
	}
	state.rt = rt
	if err := state.rt.SetTimeout(timeout); err != nil {
		return err
	}
	if locale != "" {
		if err := state.rt.SetLocale(locale); err != nil {
			return err
		}
	}
	if jsonMode {
		state.rt.SetJSONMode(true)
	}
	if err := state.rt.LoadExtension(extPath); err != nil {
		return err
	}
	if !jsonMode {
		fmt.Printf("%s %s\n", c("✓", cGreen), c(extPath, cCyan))
	}

	if autoHome {
		if err := state.rt.CallHome(); err != nil {
			if jsonMode {
				b, _ := json.Marshal(map[string]any{"type": "error", "message": err.Error()})
				fmt.Fprintf(os.Stderr, "%s\n", b)
			} else {
				fmt.Printf("%s %v\n", c("✗", cRed), err)
			}
		}
	}
	if evalCmd == "" {
		renderViews(state.rt)
	}
	return nil
}

func defaultLocalStoragePath() (string, error) {
	wd, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("resolve working directory: %w", err)
	}
	return filepath.Join(wd, ".synurart", "local_storage.json"), nil
}

func newRuntimeForExtension(state *shellState, extPath string) (*synurart.Runtime, error) {
	opts := synurart.Options{}
	if strings.TrimSpace(state.localStoragePath) != "" && strings.TrimSpace(extPath) != "" {
		backend, err := newDiskLocalStorageBackend(state.localStoragePath, extPath)
		if err != nil {
			return nil, err
		}
		opts.LocalStorageBackend = backend
	}
	return synurart.NewWithOptions(os.Stdout, os.Stderr, opts)
}

func newDiskLocalStorageBackend(storagePath, extPath string) (synurart.LocalStorageBackend, error) {
	absExtPath, err := filepath.Abs(extPath)
	if err != nil {
		return nil, fmt.Errorf("resolve extension path: %w", err)
	}
	backend, err := synurart.NewDiskLocalStorageBackend(storagePath, absExtPath)
	if err != nil {
		return nil, err
	}
	return backend, nil
}

func handleStorageCommand(rt *synurart.Runtime, args []string) error {
	if len(args) == 0 {
		printStorageSnapshot(rt, true, true)
		return nil
	}

	switch strings.ToLower(args[0]) {
	case "local":
		if len(args) != 1 {
			return fmt.Errorf("usage: storage [local|session] | storage clear [local|session|all]")
		}
		printStorageSnapshot(rt, true, false)
		return nil
	case "session":
		if len(args) != 1 {
			return fmt.Errorf("usage: storage [local|session] | storage clear [local|session|all]")
		}
		printStorageSnapshot(rt, false, true)
		return nil
	case "clear":
		if len(args) > 2 {
			return fmt.Errorf("usage: storage [local|session] | storage clear [local|session|all]")
		}
		target := "all"
		if len(args) == 2 {
			target = strings.ToLower(args[1])
		}

		clearedLocal := false
		clearedSession := false
		switch target {
		case "all":
			if err := rt.ClearLocalStorage(); err != nil {
				return err
			}
			rt.ClearSessionStorage()
			clearedLocal = true
			clearedSession = true
		case "local":
			if err := rt.ClearLocalStorage(); err != nil {
				return err
			}
			clearedLocal = true
		case "session":
			rt.ClearSessionStorage()
			clearedSession = true
		default:
			return fmt.Errorf("usage: storage [local|session] | storage clear [local|session|all]")
		}

		if jsonMode {
			jsonOut(map[string]any{
				"type":    "storage_cleared",
				"local":   clearedLocal,
				"session": clearedSession,
			})
			return nil
		}

		cleared := make([]string, 0, 2)
		if clearedLocal {
			cleared = append(cleared, "local")
		}
		if clearedSession {
			cleared = append(cleared, "session")
		}
		fmt.Printf("%s %s\n", dim("cleared storage:"), c(strings.Join(cleared, ", "), cBrightYellow))
		return nil
	default:
		return fmt.Errorf("usage: storage [local|session] | storage clear [local|session|all]")
	}
}

func printStorageSnapshot(rt *synurart.Runtime, includeLocal, includeSession bool) {
	if jsonMode {
		result := map[string]any{"type": "storage"}
		if includeLocal {
			result["local"] = rt.LocalStorageSnapshot()
		}
		if includeSession {
			result["session"] = rt.SessionStorageSnapshot()
		}
		jsonOut(result)
		return
	}
	if includeLocal {
		printJSON(rt.LocalStorageSnapshot())
	}
	if includeSession {
		printJSON(rt.SessionStorageSnapshot())
	}
}

func handleTap(rt *synurart.Runtime, args []string) error {
	if len(args) < 2 {
		return fmt.Errorf("usage: tap <title|author|category|index> <value> [viewId]")
	}
	kind := strings.ToLower(args[0])
	value := args[1]
	id, err := resolveViewID(rt, args[2:])
	if err != nil {
		return err
	}
	view, ok := rt.GetView(id)
	if !ok {
		return fmt.Errorf("view not found: %d", id)
	}
	models := mapFromAny(view.Data["models"])

	switch kind {
	case "index":
		items := contentItems(models)
		if len(items) == 0 {
			return fmt.Errorf("view #%d has no tappable list items", id)
		}
		n, err := strconv.Atoi(value)
		if err != nil {
			return err
		}
		if n <= 0 || n > len(items) {
			return fmt.Errorf("index out of range: 1..%d", len(items))
		}
		item := mapFromAny(items[n-1])
		if item == nil {
			item = map[string]any{"_index": n - 1}
		}
		if item["_index"] == nil {
			item["_index"] = n - 1
		}
		return rt.Emit(id, "CLICK", item)
	case "title":
		items := contentItems(models)
		for i, raw := range items {
			item := mapFromAny(raw)
			if strings.EqualFold(strings.TrimSpace(stringifyAny(item["title"])), strings.TrimSpace(value)) {
				if item["_index"] == nil {
					item["_index"] = i
				}
				return rt.Emit(id, "CLICK", item)
			}
		}
		return fmt.Errorf("title not found in view #%d: %q", id, value)
	case "author":
		items := contentItems(models)
		for _, raw := range items {
			item := mapFromAny(raw)
			author := strings.TrimSpace(stringifyAny(item["author"]))
			if strings.EqualFold(author, strings.TrimSpace(value)) {
				data := map[string]any{"author": author}
				if link := stringifyAny(item["link"]); link != "" {
					data["link"] = link
				}
				return rt.Emit(id, "AUTHOR_CLICK", data)
			}
		}
		if strings.TrimSpace(stringifyAny(modelMessage(models["author"]))) == strings.TrimSpace(value) {
			data := map[string]any{"author": value}
			if link := strings.TrimSpace(stringifyAny(modelMessage(models["link"]))); link != "" {
				data["link"] = link
			}
			return rt.Emit(id, "AUTHOR_CLICK", data)
		}
		return fmt.Errorf("author not found in view #%d: %q", id, value)
	case "category":
		items := contentItems(models)
		for _, raw := range items {
			item := mapFromAny(raw)
			category := strings.TrimSpace(stringifyAny(item["category"]))
			if strings.EqualFold(category, strings.TrimSpace(value)) {
				data := map[string]any{"category": category}
				if link := stringifyAny(item["link"]); link != "" {
					data["link"] = link
				}
				return rt.Emit(id, "CATEGORY_CLICK", data)
			}
		}
		if strings.TrimSpace(stringifyAny(modelMessage(models["category"]))) == strings.TrimSpace(value) {
			data := map[string]any{"category": value}
			if link := strings.TrimSpace(stringifyAny(modelMessage(models["link"]))); link != "" {
				data["link"] = link
			}
			return rt.Emit(id, "CATEGORY_CLICK", data)
		}
		return fmt.Errorf("category not found in view #%d: %q", id, value)
	default:
		return fmt.Errorf("unknown tap target: %s", kind)
	}
}

func handleItemMenu(rt *synurart.Runtime, args []string) error {
	if len(args) < 2 || len(args) > 3 {
		return fmt.Errorf("usage: itemmenu <viewId> <label> [index]")
	}
	id, err := strconv.ParseInt(args[0], 10, 64)
	if err != nil {
		return err
	}
	view, ok := rt.GetView(id)
	if !ok {
		return fmt.Errorf("view not found: %d", id)
	}
	models := mapFromAny(view.Data["models"])
	items := contentItems(models)
	if len(items) == 0 {
		items = detailsFromModel(models["comments"])
	}
	if len(items) == 0 {
		return fmt.Errorf("view #%d has no item data for ITEM_MENU_CLICK", id)
	}

	n := 1
	if len(args) == 3 {
		n, err = strconv.Atoi(args[2])
		if err != nil {
			return err
		}
	}
	if n <= 0 || n > len(items) {
		return fmt.Errorf("index out of range: 1..%d", len(items))
	}
	payload := map[string]any{"menu": args[1], "_index": n - 1}
	if item := mapFromAny(items[n-1]); item != nil {
		for k, v := range item {
			payload[k] = v
		}
	}
	return rt.Emit(id, "ITEM_MENU_CLICK", payload)
}

func handleReorder(rt *synurart.Runtime, args []string) error {
	if len(args) != 3 {
		return fmt.Errorf("usage: reorder <viewId> <fromIndex> <toIndex>")
	}
	id, err := strconv.ParseInt(args[0], 10, 64)
	if err != nil {
		return err
	}
	from, err := strconv.Atoi(args[1])
	if err != nil {
		return err
	}
	to, err := strconv.Atoi(args[2])
	if err != nil {
		return err
	}
	view, ok := rt.GetView(id)
	if !ok {
		return fmt.Errorf("view not found: %d", id)
	}
	models := mapFromAny(view.Data["models"])
	items := contentItems(models)
	if len(items) == 0 {
		return fmt.Errorf("view #%d has no list items for REORDER", id)
	}
	if from <= 0 || from > len(items) {
		return fmt.Errorf("fromIndex out of range: 1..%d", len(items))
	}
	if to <= 0 || to > len(items) {
		return fmt.Errorf("toIndex out of range: 1..%d", len(items))
	}

	payload := map[string]any{"_index": from - 1, "_newIndex": to - 1}
	if item := mapFromAny(items[from-1]); item != nil {
		for k, v := range item {
			payload[k] = v
		}
	}
	return rt.Emit(id, "REORDER", payload)
}

func resolveViewID(rt *synurart.Runtime, tail []string) (int64, error) {
	if len(tail) > 0 && strings.TrimSpace(tail[0]) != "" {
		id, err := strconv.ParseInt(tail[0], 10, 64)
		if err != nil {
			return 0, err
		}
		return id, nil
	}
	if id, ok := rt.TopViewID(); ok {
		return id, nil
	}
	return 0, fmt.Errorf("no active views")
}

func renderViews(rt *synurart.Runtime) {
	order := rt.ViewOrder()
	if jsonMode {
		views := make([]map[string]any, 0, len(order))
		for i, id := range order {
			view, ok := rt.GetView(id)
			if !ok {
				continue
			}
			styles := mapFromAny(view.Data["styles"])
			title := strings.TrimSpace(stringifyAny(styles["title"]))
			if title == "" {
				title = strings.TrimSpace(stringifyAny(modelMessage(mapFromAny(view.Data["models"])["title"])))
			}
			itemCount := len(contentItems(mapFromAny(view.Data["models"])))
			views = append(views, map[string]any{
				"id":     id,
				"path":   view.Path,
				"title":  title,
				"items":  itemCount,
				"active": i == len(order)-1,
			})
		}
		result := map[string]any{"type": "views", "views": views}
		if id, ok := rt.TopViewID(); ok {
			if view, ok2 := rt.GetView(id); ok2 {
				models := mapFromAny(view.Data["models"])
				styles := mapFromAny(view.Data["styles"])
				result["activeView"] = map[string]any{
					"viewId":   id,
					"path":     view.Path,
					"models":   view.Data["models"],
					"styles":   view.Data["styles"],
					"rendered": renderedViewSummary(view.Path, models, styles),
				}
			}
		}
		jsonOut(result)
		return
	}
	if len(order) == 0 {
		fmt.Println(dim("(no views)"))
		return
	}
	fmt.Println(bold("View Stack:"))
	for i, id := range order {
		view, ok := rt.GetView(id)
		if !ok {
			continue
		}
		styles := mapFromAny(view.Data["styles"])
		title := strings.TrimSpace(stringifyAny(styles["title"]))
		if title == "" {
			title = strings.TrimSpace(stringifyAny(modelMessage(mapFromAny(view.Data["models"])["title"])))
		}
		itemCount := len(contentItems(mapFromAny(view.Data["models"])))

		if i == len(order)-1 {
			fmt.Printf("%s %s %-14s %s=%s %s=%s\n",
				c("▸", cBrightCyan, cBold),
				c(fmt.Sprintf("#%d", id), cBold),
				c(view.Path, cCyan),
				dim("title"), c(fmt.Sprintf("%q", title), cBrightWhite),
				dim("items"), c(fmt.Sprintf("%d", itemCount), cBrightYellow))
		} else {
			fmt.Printf("%s %s %-14s %s=%s %s=%s\n",
				dim(" "),
				dim(fmt.Sprintf("#%d", id)),
				dim(view.Path),
				dim("title"), dim(fmt.Sprintf("%q", title)),
				dim("items"), dim(fmt.Sprintf("%d", itemCount)))
		}
	}
	if id, ok := rt.TopViewID(); ok {
		printViewContent(rt, id)
	}
}

func renderView(rt *synurart.Runtime, id int64) {
	view, ok := rt.GetView(id)
	if !ok {
		if jsonMode {
			jsonOut(map[string]any{"type": "error", "message": fmt.Sprintf("view not found: %d", id)})
		} else {
			fmt.Printf("%s view not found: %d\n", c("✗", cRed), id)
		}
		return
	}
	if jsonMode {
		jsonOut(map[string]any{
			"type":     "view",
			"viewId":   id,
			"path":     view.Path,
			"data":     view.Data,
			"rendered": renderedViewSummary(view.Path, mapFromAny(view.Data["models"]), mapFromAny(view.Data["styles"])),
		})
		return
	}
	fmt.Printf("%s %s\n", bold("View"), c(fmt.Sprintf("#%d", id), cCyan, cBold))
	printJSONCompact(view.Data)
	printViewContent(rt, id)
}

func printViewContent(rt *synurart.Runtime, id int64) {
	view, ok := rt.GetView(id)
	if !ok {
		return
	}
	models := mapFromAny(view.Data["models"])
	styles := mapFromAny(view.Data["styles"])

	if jsonMode {
		jsonOut(map[string]any{
			"type":     "render",
			"viewId":   id,
			"path":     view.Path,
			"models":   models,
			"styles":   styles,
			"rendered": renderedViewSummary(view.Path, models, styles),
		})
		return
	}

	fmt.Printf("%s %s %s\n",
		c("Render", cBold),
		c(fmt.Sprintf("#%d", id), cCyan, cBold),
		dim("("+view.Path+")"))
	renderStyleSummary(styles)

	switch view.Path {
	case "/views/list":
		renderList(models, styles)
	case "/views/post":
		renderPost(models, styles)
	case "/views/chat":
		renderChat(models)
	case "/views/markdown":
		renderMarkdown(models, styles)
	case "/views/source":
		renderSource(models, styles)
	case "/views/settings":
		renderSettings(models, styles)
	case "/views/editor":
		renderEditor(models, styles)
	case "/views/browser":
		renderBrowser(models)
	case "/views/simple":
		renderSimple(models, styles)
	case "/dialogs/input":
		renderInputDialog(models, styles)
	case "/dialogs/confirmation":
		renderConfirmationDialog(models, styles)
	default:
		renderGeneric(models)
	}
	renderSnackbar(models)
}

func renderList(models, styles map[string]any) {
	menus := buttonLabels(models["menus"])
	showMedia := boolFromAny(styles["media"])
	if len(menus) > 0 {
		fmt.Printf("  %s %s\n", dim("menus:"), strings.Join(menus, ", "))
	}

	items := contentItems(models)
	w := indexWidth(len(items))
	for i, raw := range items {
		item := mapFromAny(raw)
		var b strings.Builder
		b.WriteString("  ")
		b.WriteString(fmtIndex(i+1, w))
		b.WriteString(" ")
		b.WriteString(bold(stringifyAny(item["title"])))
		if author := stringifyAny(item["author"]); author != "" {
			b.WriteString("  ")
			b.WriteString(dim("by "))
			b.WriteString(c(author, cBrightBlack))
		}
		if meta := listItemMeta(item); meta != "" {
			b.WriteString("  ")
			b.WriteString(c(meta, cBrightBlack))
		}
		if link := stringifyAny(item["link"]); link != "" {
			b.WriteString("  ")
			b.WriteString(c(link, cCyan))
		}
		fmt.Println(compactText(b.String(), 240))
		if mediaLine := listItemMediaLine(item, showMedia); mediaLine != "" {
			fmt.Printf("      %s %s\n", dim("media:"), compactText(mediaLine, 220))
		}
		if itemMenus := labelsFromAny(item["menus"]); len(itemMenus) > 0 {
			fmt.Printf("      %s %s\n", dim("menu:"), c(strings.Join(itemMenus, ", "), cBrightBlack))
		}
	}
}

func listItemMeta(item map[string]any) string {
	if item == nil {
		return ""
	}
	parts := make([]string, 0, 6)

	if v := strings.TrimSpace(stringifyAny(item["category"])); v != "" {
		parts = append(parts, "cat:"+v)
	}
	if v := strings.TrimSpace(stringifyAny(item["date"])); v != "" {
		parts = append(parts, "date:"+v)
	}
	if v := strings.TrimSpace(stringifyAny(item["commentCount"])); v != "" && v != "0" {
		parts = append(parts, "cmt:"+v)
	}
	if v := strings.TrimSpace(stringifyAny(item["likeCount"])); v != "" && v != "0" {
		parts = append(parts, "like:"+v)
	}
	if v := strings.TrimSpace(stringifyAny(item["viewCount"])); v != "" && v != "0" {
		parts = append(parts, "view:"+v)
	}

	if len(parts) == 0 {
		return ""
	}
	return "[" + strings.Join(parts, " | ") + "]"
}

func listItemMediaLine(item map[string]any, enabled bool) string {
	if !enabled || item == nil {
		return ""
	}
	parts := make([]string, 0, 2)
	if mediaType := strings.TrimSpace(stringifyAny(item["mediaType"])); mediaType != "" {
		parts = append(parts, "type="+mediaType)
	}
	if mediaURL := strings.TrimSpace(stringifyAny(item["mediaUrl"])); mediaURL != "" {
		parts = append(parts, "url="+mediaURL)
	}
	return strings.Join(parts, " ")
}

func renderedViewSummary(path string, models, styles map[string]any) map[string]any {
	switch path {
	case "/views/list":
		return renderedListSummary(models, styles)
	default:
		return nil
	}
}

func renderedListSummary(models, styles map[string]any) map[string]any {
	items := contentItems(models)
	outItems := make([]map[string]any, 0, len(items))
	showMedia := boolFromAny(styles["media"])
	for i, raw := range items {
		item := mapFromAny(raw)
		entry := map[string]any{"index": i + 1}
		if item == nil {
			text := strings.TrimSpace(stringifyAny(raw))
			if text != "" {
				entry["text"] = text
			}
			outItems = append(outItems, entry)
			continue
		}
		if title := strings.TrimSpace(stringifyAny(item["title"])); title != "" {
			entry["title"] = title
		}
		if author := strings.TrimSpace(stringifyAny(item["author"])); author != "" {
			entry["author"] = author
		}
		if link := strings.TrimSpace(stringifyAny(item["link"])); link != "" {
			entry["link"] = link
		}
		if meta := listItemMeta(item); meta != "" {
			entry["meta"] = meta
		}
		if showMedia {
			if mediaType := strings.TrimSpace(stringifyAny(item["mediaType"])); mediaType != "" {
				entry["mediaType"] = mediaType
			}
			if mediaURL := strings.TrimSpace(stringifyAny(item["mediaUrl"])); mediaURL != "" {
				entry["mediaUrl"] = mediaURL
			}
		}
		if menus := labelsFromAny(item["menus"]); len(menus) > 0 {
			entry["menus"] = menus
		}
		outItems = append(outItems, entry)
	}
	return map[string]any{
		"items": outItems,
		"menus": buttonLabels(models["menus"]),
	}
}

func renderPost(models, styles map[string]any) {
	title := stringifyAny(modelMessage(models["title"]))
	if title == "" {
		title = stringifyAny(styles["title"])
	}
	content := detailsFromModel(models["content"])
	comments := detailsFromModel(models["comments"])

	fmt.Printf("  %s  %s\n", dim("title:"), bold(title))
	fmt.Printf("  %s %s\n", dim("author:"), c(stringifyAny(modelMessage(models["author"])), cBrightMagenta))
	fmt.Printf("  %s %s\n", dim("content:"), c(fmt.Sprintf("%d blocks", len(content)), cBrightYellow))
	fmt.Printf("  %s %s\n", dim("comments:"), c(fmt.Sprintf("%d", len(comments)), cBrightYellow))
	renderPostContentCompact(content)
	renderPostCommentsCompact(comments)
}

func renderPostContentCompact(content []any) {
	if len(content) == 0 {
		return
	}
	fmt.Printf("  %s\n", dim("content blocks:"))
	w := indexWidth(len(content))
	for i, raw := range content {
		fmt.Printf("  %s %s\n", fmtIndex(i+1, w), summarizePostBlock(raw))
	}
}

func renderPostCommentsCompact(comments []any) {
	if len(comments) == 0 {
		return
	}
	fmt.Printf("  %s\n", dim("comment list:"))
	w := indexWidth(len(comments))
	for i, raw := range comments {
		item := mapFromAny(raw)
		if item == nil {
			fmt.Printf("  %s %s\n", fmtIndex(i+1, w), compactText(stringifyAny(raw), 120))
			continue
		}

		author := strings.TrimSpace(stringifyAny(item["author"]))
		if author == "" {
			author = "(anon)"
		}
		level := intFromAny(item["level"])
		if level < 0 {
			level = 0
		}
		if level > 6 {
			level = 6
		}
		indent := strings.Repeat("  ", level)
		body := summarizeCommentBody(item["content"])

		date := strings.TrimSpace(stringifyAny(item["date"]))
		like := strings.TrimSpace(stringifyAny(item["likeCount"]))
		meta := ""
		if date != "" && like != "" {
			meta = fmt.Sprintf(" [%s | like:%s]", date, like)
		} else if date != "" {
			meta = fmt.Sprintf(" [%s]", date)
		} else if like != "" {
			meta = fmt.Sprintf(" [like:%s]", like)
		}

		line := fmt.Sprintf("%s%s: %s%s", indent, author, body, meta)
		if itemMenus := labelsFromAny(item["menus"]); len(itemMenus) > 0 {
			line += fmt.Sprintf(" {menus:%s}", strings.Join(itemMenus, ", "))
		}
		fmt.Printf("  %s %s\n", fmtIndex(i+1, w), compactText(line, 120))
	}
}

func summarizePostBlock(raw any) string {
	item := mapFromAny(raw)
	if item == nil {
		return compactText(stringifyAny(raw), 96)
	}
	kind := strings.ToLower(strings.TrimSpace(stringifyAny(item["type"])))
	if kind == "" {
		kind = "item"
	}

	value := strings.TrimSpace(stringifyAny(item["value"]))
	label := strings.TrimSpace(stringifyAny(item["label"]))
	link := strings.TrimSpace(stringifyAny(item["link"]))
	text := value
	if text == "" {
		text = label
	}
	if text == "" {
		text = link
	}
	if text == "" {
		text = stringifyAny(item)
	}

	return compactText(fmt.Sprintf("%s: %s", kind, text), 96)
}

func summarizeCommentBody(raw any) string {
	if raw == nil {
		return ""
	}
	if blocks := sliceFromAny(raw); len(blocks) > 0 {
		first, extra := summarizeCommentBlocks(blocks)
		if extra > 0 {
			return compactText(fmt.Sprintf("%s (+%d)", first, extra), 96)
		}
		return first
	}
	if model := mapFromAny(raw); model != nil {
		if details := sliceFromAny(model["details"]); len(details) > 0 {
			first, extra := summarizeCommentBlocks(details)
			if extra > 0 {
				return compactText(fmt.Sprintf("%s (+%d)", first, extra), 96)
			}
			return first
		}
		msg := strings.TrimSpace(stringifyAny(modelMessage(model)))
		if msg != "" {
			return compactText(msg, 96)
		}
		return compactText(stringifyAny(model), 96)
	}
	return compactText(stringifyAny(raw), 96)
}

func summarizeCommentBlocks(blocks []any) (string, int) {
	firstIdx := -1
	meaningful := 0
	for i, raw := range blocks {
		if isSkippableCommentBlock(raw) {
			continue
		}
		if firstIdx < 0 {
			firstIdx = i
		}
		meaningful++
	}
	if firstIdx < 0 {
		// No meaningful content found (e.g., anchor-only comments); keep fallback visible.
		first := summarizeCommentBlock(blocks[0])
		if len(blocks) > 1 {
			return first, len(blocks) - 1
		}
		return first, 0
	}
	first := summarizeCommentBlock(blocks[firstIdx])
	return first, meaningful - 1
}

func isSkippableCommentBlock(raw any) bool {
	item := mapFromAny(raw)
	if item == nil {
		return false
	}
	kind := strings.ToLower(strings.TrimSpace(stringifyAny(item["type"])))
	return kind == "anchor"
}

func summarizeCommentBlock(raw any) string {
	item := mapFromAny(raw)
	if item == nil {
		return compactText(stringifyAny(raw), 96)
	}
	kind := strings.ToLower(strings.TrimSpace(stringifyAny(item["type"])))
	value := strings.TrimSpace(stringifyAny(item["value"]))
	label := strings.TrimSpace(stringifyAny(item["label"]))
	link := strings.TrimSpace(stringifyAny(item["link"]))
	text := value
	if text == "" {
		text = label
	}
	if text == "" {
		text = link
	}
	if text == "" {
		text = stringifyAny(item)
	}
	if kind == "" || kind == "text" {
		return compactText(text, 96)
	}
	return compactText(fmt.Sprintf("%s: %s", kind, text), 96)
}

func renderChat(models map[string]any) {
	msgs := detailsFromModel(models["append"])
	w := indexWidth(len(msgs))
	for i, raw := range msgs {
		msg := mapFromAny(raw)
		fmt.Printf("  %s %s %s\n",
			fmtIndex(i+1, w),
			c(stringifyAny(msg["user"]), cBrightCyan, cBold),
			stringifyAny(msg["message"]))
	}
}

func renderBrowser(models map[string]any) {
	url := stringifyAny(modelMessage(models["url"]))
	fmt.Printf("  %s %s\n", dim("url:"), c(url, cCyan, cUnderline))
}

func renderMarkdown(models, styles map[string]any) {
	title := strings.TrimSpace(stringifyAny(styles["title"]))
	if title == "" {
		title = strings.TrimSpace(stringifyAny(modelMessage(models["title"])))
	}
	content := stringifyAny(modelMessage(models["content"]))
	menus := detailsFromModel(models["menus"])
	lines := lineCount(content)

	fmt.Printf("  %s %s\n", dim("title:"), bold(title))
	fmt.Printf("  %s %s\n", dim("lines:"), c(fmt.Sprintf("%d", lines), cBrightYellow))
	fmt.Printf("  %s %s\n", dim("menus:"), c(fmt.Sprintf("%d", len(menus)), cBrightYellow))
	if strings.TrimSpace(content) != "" {
		fmt.Printf("  %s %s\n", dim("preview:"), compactText(strings.TrimSpace(content), 200))
	}
}

func renderSource(models, styles map[string]any) {
	content := stringifyAny(modelMessage(models["content"]))
	language := strings.TrimSpace(stringifyAny(styles["language"]))
	if language == "" {
		language = "auto"
	}
	lines := lineCount(content)
	lineNumbers := boolFromAny(styles["lineNumbers"])
	wordWrap := boolFromAny(styles["wordWrap"])

	fmt.Printf("  %s %s\n", dim("language:"), c(language, cBrightCyan))
	fmt.Printf("  %s %s\n", dim("lines:"), c(fmt.Sprintf("%d", lines), cBrightYellow))
	fmt.Printf("  %s %v\n", dim("lineNumbers:"), lineNumbers)
	fmt.Printf("  %s %v\n", dim("wordWrap:"), wordWrap)
	if strings.TrimSpace(content) != "" {
		fmt.Printf("  %s %s\n", dim("preview:"), compactText(strings.TrimSpace(content), 200))
	}
}

func renderSettings(models, styles map[string]any) {
	title := strings.TrimSpace(stringifyAny(styles["title"]))
	message := strings.TrimSpace(stringifyAny(styles["message"]))
	fields := detailsFromModel(models["body"])
	buttons := buttonLabels(models["buttons"])

	fmt.Printf("  %s %s\n", dim("title:"), bold(title))
	if message != "" {
		fmt.Printf("  %s %s\n", dim("message:"), compactText(message, 160))
	}
	fmt.Printf("  %s %s\n", dim("fields:"), c(fmt.Sprintf("%d", len(fields)), cBrightYellow))
	fmt.Printf("  %s %s\n", dim("buttons:"), c(fmt.Sprintf("%d", len(buttons)), cBrightYellow))
	renderFormFields(fields)
	if len(buttons) > 0 {
		fmt.Printf("  %s %s\n", dim("button labels:"), strings.Join(buttons, ", "))
	}
}

func renderEditor(models, styles map[string]any) {
	types := strings.TrimSpace(stringifyAny(styles["acceptableFileType"]))
	max := intFromAny(styles["max"])
	if max <= 0 {
		max = 1
	}
	fmt.Printf("  %s %s\n", dim("acceptableFileType:"), c(types, cBrightCyan))
	fmt.Printf("  %s %s\n", dim("maxAttachments:"), c(fmt.Sprintf("%d", max), cBrightYellow))

	if title := strings.TrimSpace(stringifyAny(modelMessage(models["title"]))); title != "" {
		fmt.Printf("  %s %s\n", dim("title:"), compactText(title, 120))
	}
	if content := strings.TrimSpace(stringifyAny(modelMessage(models["content"]))); content != "" {
		fmt.Printf("  %s %s\n", dim("content:"), compactText(content, 200))
	}
}

func renderSimple(models, styles map[string]any) {
	title := strings.TrimSpace(stringifyAny(styles["title"]))
	if title == "" {
		title = strings.TrimSpace(stringifyAny(modelMessage(models["title"])))
	}
	content := strings.TrimSpace(stringifyAny(modelMessage(models["content"])))
	fmt.Printf("  %s %s\n", dim("title:"), bold(title))
	fmt.Printf("  %s %s\n", dim("content:"), compactText(content, 200))
}

func renderInputDialog(models, styles map[string]any) {
	title := strings.TrimSpace(stringifyAny(styles["title"]))
	message := strings.TrimSpace(stringifyAny(styles["message"]))
	closeEnabled := boolFromAny(styles["close"])
	fields := detailsFromModel(models["body"])
	buttons := buttonLabels(models["buttons"])

	fmt.Printf("  %s %s\n", dim("title:"), bold(title))
	if message != "" {
		fmt.Printf("  %s %s\n", dim("message:"), compactText(message, 160))
	}
	fmt.Printf("  %s %v\n", dim("close:"), closeEnabled)
	fmt.Printf("  %s %s\n", dim("fields:"), c(fmt.Sprintf("%d", len(fields)), cBrightYellow))
	fmt.Printf("  %s %s\n", dim("buttons:"), c(fmt.Sprintf("%d", len(buttons)), cBrightYellow))
	renderFormFields(fields)
	if len(buttons) > 0 {
		fmt.Printf("  %s %s\n", dim("button labels:"), strings.Join(buttons, ", "))
	}
}

func renderConfirmationDialog(models, styles map[string]any) {
	title := strings.TrimSpace(stringifyAny(styles["title"]))
	message := strings.TrimSpace(stringifyAny(styles["message"]))
	closeEnabled := boolFromAny(styles["close"])
	buttons := buttonLabels(models["buttons"])
	if len(buttons) == 0 {
		buttons = []string{"OK"}
	}

	fmt.Printf("  %s %s\n", dim("title:"), bold(title))
	if message != "" {
		fmt.Printf("  %s %s\n", dim("message:"), compactText(message, 200))
	}
	fmt.Printf("  %s %v\n", dim("close:"), closeEnabled)
	fmt.Printf("  %s %s\n", dim("buttons:"), strings.Join(buttons, ", "))
}

func renderFormFields(fields []any) {
	if len(fields) == 0 {
		return
	}
	fmt.Printf("  %s\n", dim("field list:"))
	w := indexWidth(len(fields))
	for i, raw := range fields {
		field := mapFromAny(raw)
		if field == nil {
			fmt.Printf("  %s %s\n", fmtIndex(i+1, w), compactText(stringifyAny(raw), 120))
			continue
		}
		typ := strings.TrimSpace(stringifyAny(field["type"]))
		name := strings.TrimSpace(stringifyAny(field["name"]))
		label := strings.TrimSpace(stringifyAny(field["label"]))
		value := strings.TrimSpace(stringifyAny(field["value"]))
		format := strings.TrimSpace(stringifyAny(field["format"]))
		options := sliceFromAny(field["options"])

		var b strings.Builder
		if typ != "" {
			b.WriteString(typ)
		} else {
			b.WriteString("field")
		}
		if name != "" {
			b.WriteString(" ")
			b.WriteString(name)
		}
		if label != "" {
			b.WriteString(" (")
			b.WriteString(label)
			b.WriteString(")")
		}
		if value != "" {
			b.WriteString(" value=")
			b.WriteString(value)
		}
		if format != "" {
			b.WriteString(" format=")
			b.WriteString(format)
		}
		if len(options) > 0 {
			b.WriteString(" options=")
			b.WriteString(fmt.Sprintf("%d", len(options)))
		}
		fmt.Printf("  %s %s\n", fmtIndex(i+1, w), compactText(b.String(), 140))
	}
}

func buttonLabels(model any) []string {
	buttons := detailsFromModel(model)
	if len(buttons) == 0 {
		return nil
	}
	out := make([]string, 0, len(buttons))
	for _, raw := range buttons {
		if m := mapFromAny(raw); m != nil {
			label := strings.TrimSpace(stringifyAny(m["label"]))
			if label == "" {
				label = strings.TrimSpace(stringifyAny(modelMessage(m)))
			}
			if label != "" {
				out = append(out, label)
			}
			continue
		}
		label := strings.TrimSpace(stringifyAny(raw))
		if label != "" {
			out = append(out, label)
		}
	}
	return out
}

func labelsFromAny(model any) []string {
	if model == nil {
		return nil
	}
	if wrapped := buttonLabels(model); len(wrapped) > 0 {
		return wrapped
	}

	raw := sliceFromAny(model)
	if len(raw) == 0 {
		return nil
	}
	out := make([]string, 0, len(raw))
	for _, item := range raw {
		if m := mapFromAny(item); m != nil {
			label := strings.TrimSpace(stringifyAny(m["label"]))
			if label == "" {
				label = strings.TrimSpace(stringifyAny(modelMessage(m)))
			}
			if label != "" {
				out = append(out, label)
			}
			continue
		}
		label := strings.TrimSpace(stringifyAny(item))
		if label != "" {
			out = append(out, label)
		}
	}
	return out
}

func lineCount(s string) int {
	if strings.TrimSpace(s) == "" {
		return 0
	}
	return strings.Count(s, "\n") + 1
}

func renderStyleSummary(styles map[string]any) {
	if len(styles) == 0 {
		return
	}
	order := []string{
		"title",
		"layout",
		"appbar",
		"pagination",
		"menu",
		"media",
		"history",
		"authorClickable",
		"categoryClickable",
		"close",
		"message",
	}
	seen := make(map[string]bool, len(styles))
	parts := make([]string, 0, len(styles))
	for _, key := range order {
		v, ok := styles[key]
		if !ok {
			continue
		}
		seen[key] = true
		if key == "appbar" {
			parts = append(parts, key+"="+summarizeAppbar(v))
			continue
		}
		parts = append(parts, key+"="+compactText(stringifyAny(v), 60))
	}
	if len(styles) > len(seen) {
		extras := make([]string, 0, len(styles)-len(seen))
		for key, v := range styles {
			if seen[key] {
				continue
			}
			extras = append(extras, key+"="+compactText(stringifyAny(v), 40))
		}
		sort.Strings(extras)
		parts = append(parts, extras...)
	}
	fmt.Printf("  %s %s\n", dim("style:"), c(compactText(strings.Join(parts, " | "), 220), cBrightBlack))
}

func summarizeAppbar(v any) string {
	m := mapFromAny(v)
	if m == nil {
		return compactText(stringifyAny(v), 48)
	}
	typ := strings.TrimSpace(stringifyAny(m["type"]))
	label := strings.TrimSpace(stringifyAny(m["label"]))
	hint := strings.TrimSpace(stringifyAny(m["hint"]))
	if typ == "" {
		typ = "custom"
	}
	if label != "" && hint != "" {
		return fmt.Sprintf("%s(%s, hint:%s)", typ, compactText(label, 24), compactText(hint, 24))
	}
	if label != "" {
		return fmt.Sprintf("%s(%s)", typ, compactText(label, 24))
	}
	if hint != "" {
		return fmt.Sprintf("%s(hint:%s)", typ, compactText(hint, 24))
	}
	return typ
}

func boolFromAny(v any) bool {
	switch x := v.(type) {
	case bool:
		return x
	case string:
		s := strings.ToLower(strings.TrimSpace(x))
		return s == "1" || s == "true" || s == "yes" || s == "on"
	case int:
		return x != 0
	case int64:
		return x != 0
	case float64:
		return x != 0
	default:
		return false
	}
}

func renderGeneric(models map[string]any) {
	keys := make([]string, 0, len(models))
	for k := range models {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	fmt.Printf("  %s %s\n", dim("model keys:"), c(strings.Join(keys, ", "), cBrightBlack))
}

func renderSnackbar(models map[string]any) {
	if models == nil {
		return
	}
	msg := strings.TrimSpace(stringifyAny(modelMessage(models["snackbar"])))
	if msg == "" {
		return
	}
	fmt.Printf("  %s %s\n", dim("snackbar:"), c(msg, cBrightMagenta))
}

func printHelp() {
	helpEntries := []struct{ cmd, desc string }{
		{"help", "Show help"},
		{"load <path> [--no-home]", "Load extension file into fresh runtime"},
		{"timeout [duration]", "Show or set fetch timeout (default 10s)"},
		{"locale [tag]", "Show or set navigator.language (for example ko-KR)"},
		{"views | ls", "Show view stack and top view render"},
		{"v [id]", "Show stack, or show one view JSON + render when id is given"},
		{"view <id>", "Show view data JSON + render"},
		{"render [id]", "Render one view (default top)"},
		{"home", "Call SYNURA.main.home()"},
		{"deeplink <url>", "Call SYNURA.main.deeplink(url)"},
		{"resume <id> [json]", "Call SYNURA.main.resume(id, context)"},
		{"s <n> [id]", "Alias for tap index <n> [id]"},
		{"tap title <text> [id]", "Emit CLICK for list item matching title"},
		{"tap author <name> [id]", "Emit AUTHOR_CLICK for matching author"},
		{"tap category <name> [id]", "Emit CATEGORY_CLICK for matching category"},
		{"tap index <n> [id]", "Emit CLICK by 1-based item index"},
		{"itemmenu <id> <label> [index]", "Emit ITEM_MENU_CLICK"},
		{"reorder <id> <from> <to>", "Emit REORDER for list item"},
		{"r [id]", "Alias for refresh <id> (default top view)"},
		{"refresh <id>", "Emit REFRESH"},
		{"n [id]", "Alias for event <id> SCROLL_TO_END (default top view)"},
		{"c [id]", "Alias for close <id> (default top view)"},
		{"event <id> SCROLL_TO_END", "Emit pagination event (fetch next page)"},
		{"menu <id> <label>", "Emit MENU_CLICK"},
		{"query <id> <text>", "Emit QUERY"},
		{"submit <id> <json>", "Emit SUBMIT with JSON object"},
		{"event <id> <EVENT> [json]", "Emit custom event with JSON object"},
		{"close <id>", "Close a view"},
		{"storage [local|session]", "Show storage snapshots"},
		{"storage clear [local|session|all]", "Clear storage and persist localStorage changes"},
		{"eval <javascript>", "Evaluate JS in current runtime"},
		{"quit", "Exit shell"},
	}
	if jsonMode {
		cmds := make([]map[string]string, 0, len(helpEntries))
		for _, e := range helpEntries {
			cmds = append(cmds, map[string]string{"command": e.cmd, "description": e.desc})
		}
		jsonOut(map[string]any{"type": "help", "commands": cmds})
		return
	}
	maxCmdWidth := 0
	for _, e := range helpEntries {
		if len(e.cmd) > maxCmdWidth {
			maxCmdWidth = len(e.cmd)
		}
	}
	fmt.Println(bold("Commands:"))
	for _, e := range helpEntries {
		paddedCmd := fmt.Sprintf("%-*s", maxCmdWidth, e.cmd)
		fmt.Printf("  %s  %s\n", c(paddedCmd, cBrightCyan), dim(e.desc))
	}
}

func splitArgs(line string) ([]string, error) {
	args := make([]string, 0)
	var b strings.Builder
	inQuote := rune(0)
	escaped := false
	flush := func() {
		if b.Len() > 0 {
			args = append(args, b.String())
			b.Reset()
		}
	}

	for _, ch := range line {
		if escaped {
			b.WriteRune(ch)
			escaped = false
			continue
		}
		switch ch {
		case '\\':
			escaped = true
		case '\'', '"':
			if inQuote == 0 {
				inQuote = ch
				continue
			}
			if inQuote == ch {
				inQuote = 0
				continue
			}
			b.WriteRune(ch)
		case ' ', '\t':
			if inQuote != 0 {
				b.WriteRune(ch)
			} else {
				flush()
			}
		default:
			b.WriteRune(ch)
		}
	}
	if escaped {
		return nil, fmt.Errorf("dangling escape")
	}
	if inQuote != 0 {
		return nil, fmt.Errorf("unterminated quote")
	}
	flush()
	return args, nil
}

func parseJSONObject(raw string) (map[string]any, error) {
	m := map[string]any{}
	if strings.TrimSpace(raw) == "" {
		return m, nil
	}
	if err := json.Unmarshal([]byte(raw), &m); err != nil {
		return nil, fmt.Errorf("invalid JSON object: %w", err)
	}
	return m, nil
}

func parseTimeoutArg(raw string) (time.Duration, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return 0, fmt.Errorf("timeout is required")
	}

	if d, err := time.ParseDuration(raw); err == nil {
		if d <= 0 {
			return 0, fmt.Errorf("timeout must be greater than 0")
		}
		return d, nil
	}

	seconds, err := strconv.ParseFloat(raw, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid timeout: %q (use values like 10s, 500ms, or 10)", raw)
	}
	if seconds <= 0 {
		return 0, fmt.Errorf("timeout must be greater than 0")
	}
	return time.Duration(seconds * float64(time.Second)), nil
}

func printJSON(v any) {
	b, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		fmt.Printf("%v\n", v)
		return
	}
	fmt.Println(string(b))
}

func printJSONCompact(v any) {
	b, err := json.Marshal(v)
	if err != nil {
		fmt.Printf("%v\n", v)
		return
	}
	fmt.Println(string(b))
}

func jsonOut(v any) {
	b, _ := json.Marshal(v)
	fmt.Println(string(b))
}

func emitOK() {
	if jsonMode {
		jsonOut(map[string]any{"type": "ok"})
	}
}

func contentItems(models map[string]any) []any {
	if models == nil {
		return nil
	}
	return detailsFromModel(models["contents"])
}

func detailsFromModel(model any) []any {
	m := mapFromAny(model)
	if m == nil {
		return nil
	}
	return sliceFromAny(m["details"])
}

func modelMessage(model any) any {
	m := mapFromAny(model)
	if m == nil {
		return ""
	}
	if v, ok := m["message"]; ok {
		return v
	}
	if v, ok := m["value"]; ok {
		return v
	}
	return ""
}

func mapFromAny(v any) map[string]any {
	if v == nil {
		return nil
	}
	switch m := v.(type) {
	case map[string]any:
		return m
	default:
		return nil
	}
}

func sliceFromAny(v any) []any {
	if v == nil {
		return nil
	}
	switch s := v.(type) {
	case []any:
		return s
	default:
		return nil
	}
}

func stringifyAny(v any) string {
	switch x := v.(type) {
	case nil:
		return ""
	case string:
		return x
	default:
		b, err := json.Marshal(x)
		if err == nil {
			if len(b) >= 2 && b[0] == '"' && b[len(b)-1] == '"' {
				return string(b[1 : len(b)-1])
			}
			return string(b)
		}
		return fmt.Sprintf("%v", x)
	}
}

func intFromAny(v any) int {
	switch n := v.(type) {
	case int:
		return n
	case int8:
		return int(n)
	case int16:
		return int(n)
	case int32:
		return int(n)
	case int64:
		return int(n)
	case uint:
		return int(n)
	case uint8:
		return int(n)
	case uint16:
		return int(n)
	case uint32:
		return int(n)
	case uint64:
		return int(n)
	case float32:
		return int(n)
	case float64:
		return int(n)
	case json.Number:
		i, err := n.Int64()
		if err == nil {
			return int(i)
		}
		f, err := n.Float64()
		if err == nil {
			return int(f)
		}
	case string:
		s := strings.TrimSpace(n)
		if s == "" {
			return 0
		}
		i, err := strconv.Atoi(s)
		if err == nil {
			return i
		}
	}
	return 0
}

func compactText(s string, limit int) string {
	s = strings.Join(strings.Fields(strings.ReplaceAll(s, "\n", " ")), " ")
	if limit <= 0 {
		return s
	}
	r := []rune(s)
	if len(r) <= limit {
		return s
	}
	if limit <= 3 {
		return string(r[:limit])
	}
	return string(r[:limit-3]) + "..."
}
