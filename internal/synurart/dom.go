package synurart

import (
	"sort"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/dop251/goja"
	"golang.org/x/net/html"
)

func (r *Runtime) registerNode(node *html.Node) int64 {
	id := r.nextNodeID
	r.nextNodeID++
	r.nodeIndex[id] = node
	return id
}

func (r *Runtime) nodeFromValue(v goja.Value) *html.Node {
	if goja.IsUndefined(v) || goja.IsNull(v) {
		return nil
	}
	obj := v.ToObject(r.vm)
	if obj == nil {
		return nil
	}
	id := obj.Get("__node_id")
	if goja.IsUndefined(id) || goja.IsNull(id) {
		return nil
	}
	node, _ := r.nodeIndex[id.ToInteger()].(*html.Node)
	return node
}

func (r *Runtime) newDocumentFromHTML(htmlText string) goja.Value {
	doc, err := html.Parse(strings.NewReader(htmlText))
	if err != nil || doc == nil {
		emptyDoc, _ := html.Parse(strings.NewReader("<html><body></body></html>"))
		doc = emptyDoc
	}
	// Cache wrappers and node ids per parsed document to avoid unbounded growth
	// across repeated parseFromString()/fetch().dom() calls.
	r.nodeObjects = make(map[*html.Node]*goja.Object)
	r.nodeIndex = make(map[int64]any)
	return r.newDOMNodeObject(doc)
}

func (r *Runtime) defineDOMGetter(obj *goja.Object, name string, getter func() goja.Value) {
	_ = obj.DefineAccessorProperty(name, r.vm.ToValue(func() goja.Value {
		return getter()
	}), nil, goja.FLAG_TRUE, goja.FLAG_TRUE)
}

func (r *Runtime) newDOMNodeObject(node *html.Node) goja.Value {
	if node == nil {
		return goja.Null()
	}
	if cached, ok := r.nodeObjects[node]; ok {
		return cached
	}

	obj := r.vm.NewObject()
	r.nodeObjects[node] = obj

	id := r.registerNode(node)
	_ = obj.Set("__node_id", id)
	_ = obj.Set("nodeType", nodeType(node))
	_ = obj.Set("tagName", strings.ToUpper(node.Data))
	_ = obj.Set("id", getAttr(node, "id"))
	_ = obj.Set("className", getAttr(node, "class"))
	_ = obj.Set("dataset", r.newDatasetObject(node))
	text := textContent(node)
	_ = obj.Set("textContent", text)
	_ = obj.Set("innerText", text)
	_ = obj.Set("text", text)

	_ = obj.Set("classList", r.newClassListObject(node))
	r.defineDOMGetter(obj, "childNodes", func() goja.Value { return r.newChildNodes(node) })
	r.defineDOMGetter(obj, "firstChild", func() goja.Value { return r.newDOMNodeObject(firstElementChild(node)) })
	r.defineDOMGetter(obj, "lastChild", func() goja.Value { return r.newDOMNodeObject(lastElementChild(node)) })
	r.defineDOMGetter(obj, "nextSibling", func() goja.Value { return r.newDOMNodeObject(nextElementSibling(node)) })

	_ = obj.Set("getAttribute", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return r.vm.ToValue("")
		}
		name := call.Argument(0).String()
		return r.vm.ToValue(getAttr(node, name))
	})
	_ = obj.Set("hasAttribute", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return r.vm.ToValue(false)
		}
		name := call.Argument(0).String()
		return r.vm.ToValue(hasAttr(node, name))
	})
	_ = obj.Set("remove", func(call goja.FunctionCall) goja.Value {
		if node.Parent != nil {
			node.Parent.RemoveChild(node)
		}
		return goja.Undefined()
	})
	_ = obj.Set("querySelector", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return goja.Null()
		}
		selector := strings.TrimSpace(call.Argument(0).String())
		if selector == "" {
			return goja.Null()
		}
		n := queryFirst(node, selector)
		return r.newDOMNodeObject(n)
	})
	_ = obj.Set("querySelectorAll", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return r.vm.ToValue([]any{})
		}
		selector := strings.TrimSpace(call.Argument(0).String())
		if selector == "" {
			return r.vm.ToValue([]any{})
		}
		nodes := queryAll(node, selector)
		out := make([]any, 0, len(nodes))
		for _, n := range nodes {
			out = append(out, r.newDOMNodeObject(n))
		}
		return r.vm.ToValue(out)
	})
	_ = obj.Set("cloneNode", func(call goja.FunctionCall) goja.Value {
		deep := false
		if len(call.Arguments) > 0 {
			deep = call.Argument(0).ToBoolean()
		}
		cloned := cloneHTMLNode(node, deep)
		return r.newDOMNodeObject(cloned)
	})

	return obj
}

func (r *Runtime) newClassListObject(node *html.Node) goja.Value {
	obj := r.vm.NewObject()
	_ = obj.Set("contains", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return r.vm.ToValue(false)
		}
		className := strings.TrimSpace(call.Argument(0).String())
		classes := classSet(node)
		_, ok := classes[className]
		return r.vm.ToValue(ok)
	})
	_ = obj.Set("add", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return goja.Undefined()
		}
		className := strings.TrimSpace(call.Argument(0).String())
		if className == "" {
			return goja.Undefined()
		}
		classes := classSet(node)
		classes[className] = struct{}{}
		setClassSet(node, classes)
		return goja.Undefined()
	})
	_ = obj.Set("remove", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return goja.Undefined()
		}
		className := strings.TrimSpace(call.Argument(0).String())
		classes := classSet(node)
		delete(classes, className)
		setClassSet(node, classes)
		return goja.Undefined()
	})
	_ = obj.Set("toggle", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			return r.vm.ToValue(false)
		}
		className := strings.TrimSpace(call.Argument(0).String())
		classes := classSet(node)
		if _, ok := classes[className]; ok {
			delete(classes, className)
			setClassSet(node, classes)
			return r.vm.ToValue(false)
		}
		classes[className] = struct{}{}
		setClassSet(node, classes)
		return r.vm.ToValue(true)
	})
	return obj
}

func (r *Runtime) newChildNodes(node *html.Node) goja.Value {
	out := make([]any, 0)
	for ch := node.FirstChild; ch != nil; ch = ch.NextSibling {
		out = append(out, r.newDOMNodeObject(ch))
	}
	return r.vm.ToValue(out)
}

func nodeType(node *html.Node) int {
	if node == nil {
		return 0
	}
	switch node.Type {
	case html.ElementNode:
		return 1
	case html.TextNode:
		return 3
	case html.CommentNode:
		return 8
	case html.DocumentNode:
		return 9
	default:
		return 0
	}
}

func getAttr(node *html.Node, name string) string {
	if node == nil {
		return ""
	}
	for _, attr := range node.Attr {
		if strings.EqualFold(attr.Key, name) {
			return attr.Val
		}
	}
	return ""
}

func hasAttr(node *html.Node, name string) bool {
	if node == nil {
		return false
	}
	for _, attr := range node.Attr {
		if strings.EqualFold(attr.Key, name) {
			return true
		}
	}
	return false
}

func setAttr(node *html.Node, name, val string) {
	if node == nil {
		return
	}
	for i := range node.Attr {
		if strings.EqualFold(node.Attr[i].Key, name) {
			node.Attr[i].Val = val
			return
		}
	}
	node.Attr = append(node.Attr, html.Attribute{Key: name, Val: val})
}

func removeAttr(node *html.Node, name string) {
	if node == nil {
		return
	}
	for i := range node.Attr {
		if strings.EqualFold(node.Attr[i].Key, name) {
			node.Attr = append(node.Attr[:i], node.Attr[i+1:]...)
			return
		}
	}
}

type datasetDynamicObject struct {
	vm   *goja.Runtime
	node *html.Node
}

func (d *datasetDynamicObject) Get(key string) goja.Value {
	attr := datasetKeyToAttrName(key)
	if attr == "" {
		return nil
	}
	if !hasAttr(d.node, attr) {
		return nil
	}
	return d.vm.ToValue(getAttr(d.node, attr))
}

func (d *datasetDynamicObject) Set(key string, val goja.Value) bool {
	attr := datasetKeyToAttrName(key)
	if attr == "" {
		return false
	}
	setAttr(d.node, attr, val.String())
	return true
}

func (d *datasetDynamicObject) Has(key string) bool {
	attr := datasetKeyToAttrName(key)
	return attr != "" && hasAttr(d.node, attr)
}

func (d *datasetDynamicObject) Delete(key string) bool {
	attr := datasetKeyToAttrName(key)
	if attr == "" {
		return true
	}
	removeAttr(d.node, attr)
	return true
}

func (d *datasetDynamicObject) Keys() []string {
	if d.node == nil {
		return nil
	}
	keys := make([]string, 0)
	seen := map[string]struct{}{}
	for _, attr := range d.node.Attr {
		key := datasetAttrToKey(attr.Key)
		if key == "" {
			continue
		}
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}

func (r *Runtime) newDatasetObject(node *html.Node) goja.Value {
	return r.vm.NewDynamicObject(&datasetDynamicObject{
		vm:   r.vm,
		node: node,
	})
}

func datasetAttrToKey(attr string) string {
	lower := strings.ToLower(attr)
	if !strings.HasPrefix(lower, "data-") {
		return ""
	}
	raw := lower[len("data-"):]
	if raw == "" {
		return ""
	}

	var b strings.Builder
	for i := 0; i < len(raw); i++ {
		ch := raw[i]
		if ch == '-' && i+1 < len(raw) && raw[i+1] >= 'a' && raw[i+1] <= 'z' {
			b.WriteByte(raw[i+1] - ('a' - 'A'))
			i++
			continue
		}
		b.WriteByte(ch)
	}
	return b.String()
}

func datasetKeyToAttrName(key string) string {
	key = strings.TrimSpace(key)
	if key == "" {
		return ""
	}
	var b strings.Builder
	b.WriteString("data-")
	for _, ch := range key {
		if ch >= 'A' && ch <= 'Z' {
			b.WriteByte('-')
			b.WriteByte(byte(ch + ('a' - 'A')))
			continue
		}
		b.WriteRune(ch)
	}
	return b.String()
}

func textContent(node *html.Node) string {
	if node == nil {
		return ""
	}
	if node.Type == html.TextNode {
		return node.Data
	}
	doc := goquery.NewDocumentFromNode(node)
	if doc == nil {
		return ""
	}
	return doc.Text()
}

func queryFirst(node *html.Node, selector string) *html.Node {
	if node == nil {
		return nil
	}
	doc := goquery.NewDocumentFromNode(node)
	if doc == nil {
		return nil
	}
	selection := doc.Find(selector).First()
	if selection.Length() == 0 {
		return nil
	}
	return selection.Nodes[0]
}

func queryAll(node *html.Node, selector string) []*html.Node {
	if node == nil {
		return nil
	}
	doc := goquery.NewDocumentFromNode(node)
	if doc == nil {
		return nil
	}
	selection := doc.Find(selector)
	if selection.Length() == 0 {
		return nil
	}
	return selection.Nodes
}

func firstElementChild(node *html.Node) *html.Node {
	for ch := node.FirstChild; ch != nil; ch = ch.NextSibling {
		if ch.Type == html.ElementNode {
			return ch
		}
	}
	return nil
}

func lastElementChild(node *html.Node) *html.Node {
	for ch := node.LastChild; ch != nil; ch = ch.PrevSibling {
		if ch.Type == html.ElementNode {
			return ch
		}
	}
	return nil
}

func nextElementSibling(node *html.Node) *html.Node {
	if node == nil {
		return nil
	}
	for s := node.NextSibling; s != nil; s = s.NextSibling {
		if s.Type == html.ElementNode {
			return s
		}
	}
	return nil
}

func cloneHTMLNode(node *html.Node, deep bool) *html.Node {
	if node == nil {
		return nil
	}
	copyNode := &html.Node{
		Type:      node.Type,
		DataAtom:  node.DataAtom,
		Data:      node.Data,
		Namespace: node.Namespace,
		Attr:      append([]html.Attribute(nil), node.Attr...),
	}
	if deep {
		for ch := node.FirstChild; ch != nil; ch = ch.NextSibling {
			copyNode.AppendChild(cloneHTMLNode(ch, true))
		}
	}
	return copyNode
}

func classSet(node *html.Node) map[string]struct{} {
	out := map[string]struct{}{}
	for _, c := range strings.Fields(getAttr(node, "class")) {
		if c != "" {
			out[c] = struct{}{}
		}
	}
	return out
}

func setClassSet(node *html.Node, classes map[string]struct{}) {
	if node == nil {
		return
	}
	parts := make([]string, 0, len(classes))
	for c := range classes {
		if c != "" {
			parts = append(parts, c)
		}
	}
	setAttr(node, "class", strings.Join(parts, " "))
}

func domToDetails(node *html.Node) []map[string]any {
	details := make([]map[string]any, 0)
	if node == nil {
		return details
	}

	for child := node.FirstChild; child != nil; child = child.NextSibling {
		switch child.Type {
		case html.TextNode:
			text := strings.TrimSpace(child.Data)
			if text != "" {
				details = append(details, map[string]any{"type": "text", "value": text})
			}
		case html.ElementNode:
			tag := strings.ToLower(child.Data)
			switch tag {
			case "script", "style", "br":
				continue
			case "img":
				src := getAttr(child, "src")
				if src != "" {
					details = append(details, map[string]any{"type": "image", "value": src})
				}
			case "iframe":
				src := getAttr(child, "src")
				if src != "" {
					details = append(details, map[string]any{"type": "link", "value": src, "link": src})
				}
			case "video":
				src := getAttr(child, "src")
				if src == "" {
					source := queryFirst(child, "source")
					src = getAttr(source, "src")
				}
				if src != "" {
					details = append(details, map[string]any{"type": "video", "value": src})
				}
			case "a":
				href := getAttr(child, "href")
				if href == "" || strings.HasPrefix(strings.ToLower(href), "javascript:") {
					details = append(details, domToDetails(child)...)
					continue
				}
				img := queryFirst(child, "img")
				if img != nil {
					src := getAttr(img, "src")
					if src != "" {
						details = append(details, map[string]any{"type": "image", "value": src, "link": href})
						continue
					}
				}
				text := strings.TrimSpace(textContent(child))
				if text != "" {
					details = append(details, map[string]any{"type": "link", "value": text, "link": href})
				} else {
					details = append(details, domToDetails(child)...)
				}
			default:
				details = append(details, domToDetails(child)...)
			}
		}
	}

	if len(details) <= 1 {
		return details
	}

	merged := make([]map[string]any, 0, len(details))
	textBuffer := make([]string, 0)
	flush := func() {
		if len(textBuffer) == 0 {
			return
		}
		merged = append(merged, map[string]any{"type": "text", "value": strings.Join(textBuffer, "\n")})
		textBuffer = textBuffer[:0]
	}

	for _, item := range details {
		if stringifyAny(item["type"]) == "text" {
			textBuffer = append(textBuffer, stringifyAny(item["value"]))
			continue
		}
		flush()
		merged = append(merged, item)
	}
	flush()
	return merged
}
