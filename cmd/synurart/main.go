package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/ivere27/synura/internal/synurart"
)

type shellState struct {
	rt *synurart.Runtime
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
	state := &shellState{rt: synurart.New(os.Stdout, os.Stderr)}
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
	case "tap", "click":
		if err := handleTap(rt, args[1:]); err != nil {
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
	case "storage":
		if jsonMode {
			result := map[string]any{"type": "storage"}
			if len(args) == 1 || strings.EqualFold(args[1], "local") {
				result["local"] = rt.LocalStorageSnapshot()
				if len(args) == 1 {
					result["session"] = rt.SessionStorageSnapshot()
				}
			} else if strings.EqualFold(args[1], "session") {
				result["session"] = rt.SessionStorageSnapshot()
			} else {
				return fmt.Errorf("usage: storage [local|session]")
			}
			jsonOut(result)
			break
		}
		if len(args) == 1 || strings.EqualFold(args[1], "local") {
			printJSON(rt.LocalStorageSnapshot())
			if len(args) == 1 {
				printJSON(rt.SessionStorageSnapshot())
			}
			break
		}
		if strings.EqualFold(args[1], "session") {
			printJSON(rt.SessionStorageSnapshot())
			break
		}
		return fmt.Errorf("usage: storage [local|session]")
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
	if state.rt != nil {
		timeout = state.rt.Timeout()
	}
	state.rt = synurart.New(os.Stdout, os.Stderr)
	if err := state.rt.SetTimeout(timeout); err != nil {
		return err
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

func handleTap(rt *synurart.Runtime, args []string) error {
	if len(args) < 2 {
		return fmt.Errorf("usage: tap <title|author|index> <value> [viewId]")
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
	default:
		return fmt.Errorf("unknown tap target: %s", kind)
	}
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
				result["activeView"] = map[string]any{
					"viewId": id,
					"path":   view.Path,
					"models": view.Data["models"],
					"styles": view.Data["styles"],
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
		jsonOut(map[string]any{"type": "view", "viewId": id, "path": view.Path, "data": view.Data})
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
			"type":   "render",
			"viewId": id,
			"path":   view.Path,
			"models": models,
			"styles": styles,
		})
		return
	}

	fmt.Printf("%s %s %s\n",
		c("Render", cBold),
		c(fmt.Sprintf("#%d", id), cCyan, cBold),
		dim("("+view.Path+")"))

	switch view.Path {
	case "/views/list":
		renderList(models)
	case "/views/post":
		renderPost(models, styles)
	case "/views/chat":
		renderChat(models)
	case "/views/browser":
		renderBrowser(models)
	default:
		renderGeneric(models)
	}
	renderSnackbar(models)
}

func renderList(models map[string]any) {
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
		fmt.Println(b.String())
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
	if v := strings.TrimSpace(stringifyAny(item["mediaType"])); v != "" {
		parts = append(parts, "media:"+v)
	}

	if len(parts) == 0 {
		return ""
	}
	return "[" + strings.Join(parts, " | ") + "]"
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
		{"views", "Show view stack and top view render"},
		{"view <id>", "Show view data JSON + render"},
		{"render [id]", "Render one view (default top)"},
		{"home", "Call SYNURA.main.home()"},
		{"deeplink <url>", "Call SYNURA.main.deeplink(url)"},
		{"resume <id> [json]", "Call SYNURA.main.resume(id, context)"},
		{"tap title <text> [id]", "Emit CLICK for list item matching title"},
		{"tap author <name> [id]", "Emit AUTHOR_CLICK for matching author"},
		{"tap index <n> [id]", "Emit CLICK by 1-based item index"},
		{"refresh <id>", "Emit REFRESH"},
		{"event <id> SCROLL_TO_END", "Emit pagination event (fetch next page)"},
		{"menu <id> <label>", "Emit MENU_CLICK"},
		{"query <id> <text>", "Emit QUERY"},
		{"submit <id> <json>", "Emit SUBMIT with JSON object"},
		{"event <id> <EVENT> [json]", "Emit custom event with JSON object"},
		{"close <id>", "Close a view"},
		{"storage [local|session]", "Show storage snapshots"},
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
	fmt.Println(bold("Commands:"))
	for _, e := range helpEntries {
		fmt.Printf("  %-30s %s\n", c(e.cmd, cBrightCyan), dim(e.desc))
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
