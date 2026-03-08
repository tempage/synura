package main

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"

	"github.com/ivere27/synura/internal/synurart"
	"golang.org/x/term"
)

const replPrompt = "synurart> "

const replKeyAltBackspace rune = '\U0010f701'

var replCommandSuggestions = []string{
	"help", "h", "?",
	"load",
	"quit", "q", "exit",
	"views", "ls",
	"view", "render",
	"home", "deeplink", "resume",
	"event", "refresh", "menu", "query", "submit",
	"tap", "click",
	"itemmenu", "reorder",
	"c",
	"close",
	"timeout",
	"storage",
	"eval",
}

var replEventSuggestions = []string{
	"LOAD",
	"CLICK",
	"AUTHOR_CLICK",
	"CATEGORY_CLICK",
	"REFRESH",
	"MENU_CLICK",
	"ITEM_MENU_CLICK",
	"QUERY",
	"SUBMIT",
	"REORDER",
	"CLOSE",
	"SCROLL_TO_END",
}

type stdioReadWriter struct {
	io.Reader
	io.Writer
}

type altBackspaceReader struct {
	reader     io.Reader
	pending    []byte
	escapeSeen bool
	readErr    error
}

func newAltBackspaceReader(reader io.Reader) *altBackspaceReader {
	return &altBackspaceReader{reader: reader}
}

func (r *altBackspaceReader) Read(p []byte) (int, error) {
	if len(p) == 0 {
		return 0, nil
	}

	for len(r.pending) == 0 {
		if r.readErr != nil {
			if r.escapeSeen {
				r.pending = append(r.pending, 0x1b)
				r.escapeSeen = false
				break
			}
			err := r.readErr
			r.readErr = nil
			return 0, err
		}

		buf := make([]byte, len(p))
		n, err := r.reader.Read(buf)
		if n > 0 {
			r.appendNormalized(buf[:n])
		}
		if err != nil {
			r.readErr = err
		}
	}

	n := copy(p, r.pending)
	r.pending = r.pending[n:]
	return n, nil
}

func (r *altBackspaceReader) appendNormalized(data []byte) {
	for _, b := range data {
		if r.escapeSeen {
			if b == 0x7f || b == 0x08 {
				r.pending = utf8.AppendRune(r.pending, replKeyAltBackspace)
				r.escapeSeen = false
				continue
			}
			r.pending = append(r.pending, 0x1b)
			r.escapeSeen = false
		}

		if b == 0x1b {
			r.escapeSeen = true
			continue
		}

		r.pending = append(r.pending, b)
	}
}

func runREPL(state *shellState) error {
	fd := int(os.Stdin.Fd())
	if !term.IsTerminal(fd) {
		return runScannerREPL(state)
	}

	oldState, err := term.MakeRaw(fd)
	if err != nil {
		return fmt.Errorf("enable raw terminal mode: %w", err)
	}
	defer func() {
		_ = term.Restore(fd, oldState)
		fmt.Println()
	}()

	t := term.NewTerminal(stdioReadWriter{
		Reader: newAltBackspaceReader(os.Stdin),
		Writer: os.Stdout,
	}, replPrompt)
	completer := newAutoCompleter(state)
	t.AutoCompleteCallback = completer.callback

	for {
		line, err := t.ReadLine()
		if err != nil {
			if errors.Is(err, io.EOF) {
				return nil
			}
			// Bracketed paste may return a line together with ErrPasteIndicator.
			if err == term.ErrPasteIndicator {
				if execErr := runLineWithCookedMode(fd, oldState, state, line); execErr != nil {
					return execErr
				}
				continue
			}
			return fmt.Errorf("read line: %w", err)
		}
		if execErr := runLineWithCookedMode(fd, oldState, state, line); execErr != nil {
			return execErr
		}
	}
}

func runLineWithCookedMode(fd int, oldState *term.State, state *shellState, line string) error {
	if err := term.Restore(fd, oldState); err != nil {
		return fmt.Errorf("restore terminal mode: %w", err)
	}

	if runErr := runInputLine(state, line); runErr != nil {
		if jsonMode {
			b, _ := json.Marshal(map[string]any{"type": "error", "message": runErr.Error()})
			fmt.Fprintf(os.Stderr, "%s\n", b)
		} else {
			fmt.Printf("%s %v\n", c("error:", cRed), runErr)
		}
	}

	if _, err := term.MakeRaw(fd); err != nil {
		return fmt.Errorf("re-enter raw terminal mode: %w", err)
	}
	return nil
}

func runScannerREPL(state *shellState) error {
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Print(replPrompt)
		if !scanner.Scan() {
			return nil
		}
		if err := runInputLine(state, scanner.Text()); err != nil {
			if jsonMode {
				b, _ := json.Marshal(map[string]any{"type": "error", "message": err.Error()})
				fmt.Fprintf(os.Stderr, "%s\n", b)
			} else {
				fmt.Printf("%s %v\n", c("error:", cRed), err)
			}
		}
	}
}

func runInputLine(state *shellState, line string) error {
	line = strings.TrimSpace(line)
	if line == "" {
		return nil
	}

	args, err := splitArgs(line)
	if err != nil {
		fmt.Printf("parse error: %v\n", err)
		return nil
	}
	if len(args) == 0 {
		return nil
	}
	return runCommand(state, args)
}

type completionCandidate struct {
	value       string
	appendSpace bool
}

type completionContext struct {
	argsBefore []string
	argIndex   int
	current    string
	tokenStart int
}

type autoCompleter struct {
	state        *shellState
	lastCycleKey string
	lastOptions  []completionCandidate
	lastIndex    int
}

func newAutoCompleter(state *shellState) *autoCompleter {
	return &autoCompleter{state: state}
}

func (a *autoCompleter) callback(line string, pos int, key rune) (string, int, bool) {
	if key == replKeyAltBackspace {
		a.resetCycle()
		return backwardKillWord(line, pos)
	}

	if key != '\t' {
		a.resetCycle()
		return "", 0, false
	}

	if pos < 0 {
		pos = 0
	}
	if pos > len(line) {
		pos = len(line)
	}

	ctx := parseCompletionContext(line, pos)
	cycleKey := makeCycleKey(line, pos, ctx)

	if cycleKey == a.lastCycleKey && len(a.lastOptions) > 1 {
		a.lastIndex = (a.lastIndex + 1) % len(a.lastOptions)
		nextLine, nextPos := applyCompletion(line, pos, ctx, a.lastOptions[a.lastIndex])
		return nextLine, nextPos, true
	}

	options := a.suggestions(ctx)
	if len(options) == 0 {
		a.resetCycle()
		return line, pos, true
	}
	if len(options) > 1 {
		for i := range options {
			options[i].appendSpace = false
		}
	}

	a.lastCycleKey = cycleKey
	a.lastOptions = options
	a.lastIndex = 0
	nextLine, nextPos := applyCompletion(line, pos, ctx, options[0])
	return nextLine, nextPos, true
}

func backwardKillWord(line string, pos int) (string, int, bool) {
	if pos <= 0 {
		return line, pos, true
	}
	if pos > len(line) {
		pos = len(line)
	}

	runes := []rune(line)
	runePos := utf8.RuneCountInString(line[:pos])
	if runePos <= 0 {
		return line, pos, true
	}

	start := findBackwardKillWordStart(runes, runePos)
	if start >= runePos {
		return line, pos, true
	}

	nextRunes := append(append([]rune{}, runes[:start]...), runes[runePos:]...)
	nextPos := len(string(nextRunes[:start]))
	return string(nextRunes), nextPos, true
}

func findBackwardKillWordStart(line []rune, pos int) int {
	i := pos
	for i > 0 && unicode.IsSpace(line[i-1]) {
		i--
	}
	for i > 0 && !isReadlineWordRune(line[i-1]) && !unicode.IsSpace(line[i-1]) {
		i--
	}
	for i > 0 && isReadlineWordRune(line[i-1]) {
		i--
	}
	return i
}

func isReadlineWordRune(r rune) bool {
	return unicode.IsLetter(r) || unicode.IsDigit(r)
}

func (a *autoCompleter) resetCycle() {
	a.lastCycleKey = ""
	a.lastOptions = nil
	a.lastIndex = 0
}

func parseCompletionContext(line string, cursor int) completionContext {
	args := make([]string, 0)
	var current strings.Builder
	tokenStart := cursor
	currentStart := cursor
	inQuote := byte(0)
	escaped := false
	tokenActive := false

	for i := 0; i < cursor; i++ {
		ch := line[i]

		if escaped {
			if !tokenActive {
				tokenActive = true
				currentStart = i
			}
			current.WriteByte(ch)
			escaped = false
			continue
		}

		if ch == '\\' {
			if !tokenActive {
				tokenActive = true
				currentStart = i
			}
			escaped = true
			continue
		}

		if inQuote != 0 {
			if ch == inQuote {
				inQuote = 0
				continue
			}
			if !tokenActive {
				tokenActive = true
				currentStart = i
			}
			current.WriteByte(ch)
			continue
		}

		switch ch {
		case '"', '\'':
			if !tokenActive {
				tokenActive = true
				currentStart = i
			}
			inQuote = ch
		case ' ', '\t':
			if tokenActive {
				args = append(args, current.String())
				current.Reset()
				tokenActive = false
			}
		default:
			if !tokenActive {
				tokenActive = true
				currentStart = i
			}
			current.WriteByte(ch)
		}
	}

	if tokenActive {
		tokenStart = currentStart
		return completionContext{
			argsBefore: args,
			argIndex:   len(args),
			current:    current.String(),
			tokenStart: tokenStart,
		}
	}

	return completionContext{
		argsBefore: args,
		argIndex:   len(args),
		current:    "",
		tokenStart: tokenStart,
	}
}

func makeCycleKey(line string, cursor int, ctx completionContext) string {
	prefix := line[:ctx.tokenStart]
	suffix := line[cursor:]
	return strings.Join([]string{
		prefix,
		suffix,
		strconv.Itoa(ctx.argIndex),
		strings.Join(ctx.argsBefore, "\x1f"),
	}, "\x1e")
}

func applyCompletion(line string, cursor int, ctx completionContext, candidate completionCandidate) (string, int) {
	if ctx.tokenStart < 0 || ctx.tokenStart > cursor {
		return line, cursor
	}
	completed := line[:ctx.tokenStart] + candidate.value + line[cursor:]
	pos := ctx.tokenStart + len(candidate.value)

	if candidate.appendSpace {
		needsSpace := pos >= len(completed) || (completed[pos] != ' ' && completed[pos] != '\t')
		if needsSpace {
			completed = completed[:pos] + " " + completed[pos:]
			pos++
		}
	}

	return completed, pos
}

func (a *autoCompleter) suggestions(ctx completionContext) []completionCandidate {
	if ctx.argIndex == 0 {
		return filterSuggestions(replCommandSuggestions, ctx.current, false, true)
	}
	if len(ctx.argsBefore) == 0 {
		return nil
	}

	cmd := strings.ToLower(ctx.argsBefore[0])
	switch cmd {
	case "load":
		if ctx.argIndex == 1 {
			return pathSuggestions(ctx.current, true)
		}
	case "view", "render", "resume", "refresh", "query", "submit", "close", "c":
		if ctx.argIndex == 1 {
			return viewIDSuggestions(a.state.rt, ctx.current)
		}
	case "menu":
		if ctx.argIndex == 1 {
			return viewIDSuggestions(a.state.rt, ctx.current)
		}
		if ctx.argIndex == 2 {
			return menuSuggestions(a.state.rt, ctx.argsBefore, ctx.current)
		}
	case "event":
		if ctx.argIndex == 1 {
			return viewIDSuggestions(a.state.rt, ctx.current)
		}
		if ctx.argIndex == 2 {
			return filterSuggestions(replEventSuggestions, strings.ToUpper(ctx.current), false, true)
		}
	case "storage":
		if ctx.argIndex == 1 {
			return filterSuggestions([]string{"local", "session"}, ctx.current, false, true)
		}
	case "timeout":
		if ctx.argIndex == 1 {
			return filterSuggestions([]string{"10s", "5s", "30s", "1m"}, ctx.current, false, true)
		}
	case "tap", "click":
		switch ctx.argIndex {
		case 1:
			return filterSuggestions([]string{"index", "title", "author", "category"}, ctx.current, false, true)
		case 2:
			mode := ""
			if len(ctx.argsBefore) > 1 {
				mode = strings.ToLower(ctx.argsBefore[1])
			}
			switch mode {
			case "index":
				return tapIndexSuggestions(a.state.rt, ctx.current)
			case "title":
				return tapTitleSuggestions(a.state.rt, ctx.current)
			case "author":
				return tapAuthorSuggestions(a.state.rt, ctx.current)
			case "category":
				return tapCategorySuggestions(a.state.rt, ctx.current)
			}
		case 3:
			return viewIDSuggestions(a.state.rt, ctx.current)
		}
	case "itemmenu":
		if ctx.argIndex == 1 {
			return viewIDSuggestions(a.state.rt, ctx.current)
		}
		if ctx.argIndex == 2 {
			return itemMenuSuggestions(a.state.rt, ctx.argsBefore, ctx.current)
		}
		if ctx.argIndex == 3 {
			return viewIndexSuggestions(a.state.rt, ctx.argsBefore, ctx.current)
		}
	case "reorder":
		if ctx.argIndex == 1 {
			return viewIDSuggestions(a.state.rt, ctx.current)
		}
		if ctx.argIndex == 2 || ctx.argIndex == 3 {
			return viewIndexSuggestions(a.state.rt, ctx.argsBefore, ctx.current)
		}
	}

	return nil
}

func filterSuggestions(values []string, prefix string, forceQuote bool, appendSpace bool) []completionCandidate {
	out := make([]completionCandidate, 0)
	for _, v := range values {
		s := strings.TrimSpace(v)
		if s == "" {
			continue
		}
		if !hasPrefixFold(s, prefix) {
			continue
		}
		val := s
		if forceQuote || needsQuoting(s) {
			val = quoteArg(s)
		}
		out = append(out, completionCandidate{value: val, appendSpace: appendSpace})
	}
	return uniqueAndSortCandidates(out)
}

func pathSuggestions(prefix string, onlyJS bool) []completionCandidate {
	dirPart, namePart := filepath.Split(prefix)
	searchDir := dirPart
	if searchDir == "" {
		searchDir = "."
	}

	entries, err := os.ReadDir(searchDir)
	if err != nil {
		return nil
	}

	out := make([]completionCandidate, 0, len(entries))
	for _, entry := range entries {
		name := entry.Name()
		if !hasPrefixFold(name, namePart) {
			continue
		}
		if onlyJS && !entry.IsDir() && !strings.HasSuffix(strings.ToLower(name), ".js") {
			continue
		}

		candidate := dirPart + name
		appendSpace := true
		if entry.IsDir() {
			candidate += string(os.PathSeparator)
			appendSpace = false
		}

		if needsQuoting(candidate) {
			candidate = quoteArg(candidate)
		}
		out = append(out, completionCandidate{
			value:       candidate,
			appendSpace: appendSpace,
		})
	}

	return uniqueAndSortCandidates(out)
}

func viewIDSuggestions(rt *synurart.Runtime, prefix string) []completionCandidate {
	ids := rt.ViewOrder()
	values := make([]string, 0, len(ids))
	for _, id := range ids {
		values = append(values, strconv.FormatInt(id, 10))
	}
	return filterSuggestions(values, prefix, false, true)
}

func tapIndexSuggestions(rt *synurart.Runtime, prefix string) []completionCandidate {
	models := topViewModels(rt)
	if models == nil {
		return nil
	}
	items := contentItems(models)
	values := make([]string, 0, len(items))
	for i := range items {
		values = append(values, strconv.Itoa(i+1))
	}
	return filterSuggestions(values, prefix, false, true)
}

func tapTitleSuggestions(rt *synurart.Runtime, prefix string) []completionCandidate {
	models := topViewModels(rt)
	if models == nil {
		return nil
	}
	items := contentItems(models)
	values := make([]string, 0, len(items))
	for _, raw := range items {
		item := mapFromAny(raw)
		if item == nil {
			continue
		}
		title := strings.TrimSpace(stringifyAny(item["title"]))
		if title != "" {
			values = append(values, title)
		}
	}
	return filterSuggestions(values, prefix, false, true)
}

func tapAuthorSuggestions(rt *synurart.Runtime, prefix string) []completionCandidate {
	models := topViewModels(rt)
	if models == nil {
		return nil
	}

	values := make([]string, 0)
	items := contentItems(models)
	for _, raw := range items {
		item := mapFromAny(raw)
		if item == nil {
			continue
		}
		author := strings.TrimSpace(stringifyAny(item["author"]))
		if author != "" {
			values = append(values, author)
		}
	}

	if author := strings.TrimSpace(stringifyAny(modelMessage(models["author"]))); author != "" {
		values = append(values, author)
	}
	return filterSuggestions(values, prefix, false, true)
}

func tapCategorySuggestions(rt *synurart.Runtime, prefix string) []completionCandidate {
	models := topViewModels(rt)
	if models == nil {
		return nil
	}

	values := make([]string, 0)
	items := contentItems(models)
	for _, raw := range items {
		item := mapFromAny(raw)
		if item == nil {
			continue
		}
		category := strings.TrimSpace(stringifyAny(item["category"]))
		if category != "" {
			values = append(values, category)
		}
	}

	if category := strings.TrimSpace(stringifyAny(modelMessage(models["category"]))); category != "" {
		values = append(values, category)
	}
	return filterSuggestions(values, prefix, false, true)
}

func itemMenuSuggestions(rt *synurart.Runtime, argsBefore []string, prefix string) []completionCandidate {
	var viewID int64
	if len(argsBefore) > 1 {
		id, err := strconv.ParseInt(argsBefore[1], 10, 64)
		if err != nil {
			return nil
		}
		viewID = id
	} else {
		id, ok := rt.TopViewID()
		if !ok {
			return nil
		}
		viewID = id
	}

	view, ok := rt.GetView(viewID)
	if !ok {
		return nil
	}
	models := mapFromAny(view.Data["models"])
	if models == nil {
		return nil
	}

	items := contentItems(models)
	if len(items) == 0 {
		items = detailsFromModel(models["comments"])
	}
	values := make([]string, 0)
	for _, raw := range items {
		item := mapFromAny(raw)
		if item == nil {
			continue
		}
		menus := sliceFromAny(item["menus"])
		for _, menuRaw := range menus {
			label := strings.TrimSpace(stringifyAny(menuRaw))
			if label != "" {
				values = append(values, label)
			}
		}
	}

	return filterSuggestions(values, prefix, false, true)
}

func viewIndexSuggestions(rt *synurart.Runtime, argsBefore []string, prefix string) []completionCandidate {
	var viewID int64
	if len(argsBefore) > 1 {
		id, err := strconv.ParseInt(argsBefore[1], 10, 64)
		if err != nil {
			return nil
		}
		viewID = id
	} else {
		id, ok := rt.TopViewID()
		if !ok {
			return nil
		}
		viewID = id
	}
	view, ok := rt.GetView(viewID)
	if !ok {
		return nil
	}
	models := mapFromAny(view.Data["models"])
	if models == nil {
		return nil
	}
	items := contentItems(models)
	if len(items) == 0 {
		items = detailsFromModel(models["comments"])
	}
	values := make([]string, 0, len(items))
	for i := range items {
		values = append(values, strconv.Itoa(i+1))
	}
	return filterSuggestions(values, prefix, false, true)
}

func menuSuggestions(rt *synurart.Runtime, argsBefore []string, prefix string) []completionCandidate {
	var viewID int64
	if len(argsBefore) > 1 {
		id, err := strconv.ParseInt(argsBefore[1], 10, 64)
		if err != nil {
			return nil
		}
		viewID = id
	} else {
		id, ok := rt.TopViewID()
		if !ok {
			return nil
		}
		viewID = id
	}

	view, ok := rt.GetView(viewID)
	if !ok {
		return nil
	}
	models := mapFromAny(view.Data["models"])
	if models == nil {
		return nil
	}

	menus := detailsFromModel(models["menus"])
	values := make([]string, 0, len(menus))
	for _, raw := range menus {
		if m := mapFromAny(raw); m != nil {
			label := strings.TrimSpace(stringifyAny(m["label"]))
			if label == "" {
				label = strings.TrimSpace(stringifyAny(modelMessage(raw)))
			}
			if label != "" {
				values = append(values, label)
			}
			continue
		}
		label := strings.TrimSpace(stringifyAny(raw))
		if label != "" {
			values = append(values, label)
		}
	}

	return filterSuggestions(values, prefix, false, true)
}

func topViewModels(rt *synurart.Runtime) map[string]any {
	id, ok := rt.TopViewID()
	if !ok {
		return nil
	}
	view, ok := rt.GetView(id)
	if !ok || view == nil {
		return nil
	}
	return mapFromAny(view.Data["models"])
}

func hasPrefixFold(s, prefix string) bool {
	return strings.HasPrefix(strings.ToLower(s), strings.ToLower(prefix))
}

func needsQuoting(s string) bool {
	if s == "" {
		return true
	}
	for _, r := range s {
		if unicode.IsSpace(r) || r == '"' || r == '\'' || r == '\\' {
			return true
		}
	}
	return false
}

func quoteArg(s string) string {
	escaped := strings.ReplaceAll(s, `\`, `\\`)
	escaped = strings.ReplaceAll(escaped, `"`, `\"`)
	return `"` + escaped + `"`
}

func uniqueAndSortCandidates(in []completionCandidate) []completionCandidate {
	if len(in) == 0 {
		return nil
	}

	seen := make(map[string]completionCandidate, len(in))
	for _, c := range in {
		key := strings.ToLower(c.value)
		if _, ok := seen[key]; !ok {
			seen[key] = c
		}
	}

	out := make([]completionCandidate, 0, len(seen))
	for _, c := range seen {
		out = append(out, c)
	}
	sort.Slice(out, func(i, j int) bool {
		return strings.ToLower(out[i].value) < strings.ToLower(out[j].value)
	})
	return out
}
