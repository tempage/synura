package synurart

import (
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/dop251/goja"
	"golang.org/x/net/html"
)

const internalGoNodeKey = "__internal_go_node__"

type DOMElement struct {
	node         *html.Node
	runtime      *Runtime
	datasetProxy goja.Value
}

type DOMParser struct {
	runtime *Runtime
}

func (r *Runtime) initDOM() {
	r.domPrototype = r.newDOMPrototype()
}

func (p *DOMParser) ParseFromString(call goja.FunctionCall) goja.Value {
	return p.runtime.newDocumentFromHTML(call.Argument(0).String())
}

func (r *Runtime) newDOMParser(call goja.ConstructorCall) *goja.Object {
	parser := &DOMParser{runtime: r}

	obj := r.vm.NewObject()
	_ = obj.Set("parseFromString", parser.ParseFromString)

	return obj
}

func (r *Runtime) newDocumentFromHTML(htmlText string) goja.Value {
	startTime := time.Now()
	doc, err := html.Parse(strings.NewReader(htmlText))
	r.RecordDOMParse(time.Since(startTime).Milliseconds())
	if err != nil {
		panic(r.vm.ToValue(err))
	}

	return r.newDOMObject(doc)
}

func (r *Runtime) unwrapDOMElement(v goja.Value) *DOMElement {
	if goja.IsUndefined(v) || goja.IsNull(v) {
		return nil
	}
	obj := v.ToObject(r.vm)
	if obj == nil {
		return nil
	}
	internal := obj.Get(internalGoNodeKey)
	if goja.IsUndefined(internal) || goja.IsNull(internal) {
		return nil
	}
	exported := internal.Export()
	if exported == nil {
		return nil
	}
	switch value := exported.(type) {
	case *DOMElement:
		return value
	case *html.Node:
		return &DOMElement{node: value}
	default:
		return nil
	}
}

func (r *Runtime) newDOMPrototype() *goja.Object {
	proto := r.vm.NewObject()

	proto.DefineAccessorProperty("textContent", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			return r.vm.ToValue(r.getTextContent(elementWrapper.node))
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("innerText", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			return r.vm.ToValue(r.getTextContent(elementWrapper.node))
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("childNodes", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			return r.createNodeList(elementWrapper.node)
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("firstChild", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			for child := elementWrapper.node.FirstChild; child != nil; child = child.NextSibling {
				if child.Type == html.ElementNode {
					return r.newDOMObject(child)
				}
			}
			return goja.Null()
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("lastChild", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			for child := elementWrapper.node.LastChild; child != nil; child = child.PrevSibling {
				if child.Type == html.ElementNode {
					return r.newDOMObject(child)
				}
			}
			return goja.Null()
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("nextSibling", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			for sibling := elementWrapper.node.NextSibling; sibling != nil; sibling = sibling.NextSibling {
				if sibling.Type == html.ElementNode {
					return r.newDOMObject(sibling)
				}
			}
			return goja.Null()
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("tagName", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			return r.vm.ToValue(strings.ToUpper(elementWrapper.node.Data))
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("className", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			return r.vm.ToValue(getAttr(elementWrapper.node, "class"))
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("id", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			return r.vm.ToValue(getAttr(elementWrapper.node, "id"))
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("nodeType", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			return r.vm.ToValue(mapGoNodeTypeToJS(elementWrapper.node.Type))
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("classList", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			return r.createClassList(elementWrapper)
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.DefineAccessorProperty("dataset", r.vm.ToValue(func(call goja.FunctionCall) goja.Value {
		if elementWrapper := r.unwrapDOMElement(call.This); elementWrapper != nil {
			return r.createDatasetProxy(elementWrapper)
		}
		return goja.Undefined()
	}), nil, goja.FLAG_FALSE, goja.FLAG_TRUE)

	proto.Set("getAttribute", func(call goja.FunctionCall) goja.Value {
		elementWrapper := r.unwrapDOMElement(call.This)
		if elementWrapper == nil {
			return goja.Undefined()
		}
		attrName := call.Argument(0).String()
		if !hasAttr(elementWrapper.node, attrName) {
			return goja.Null()
		}
		return r.vm.ToValue(getAttr(elementWrapper.node, attrName))
	})

	proto.Set("hasAttribute", func(call goja.FunctionCall) goja.Value {
		elementWrapper := r.unwrapDOMElement(call.This)
		if elementWrapper == nil {
			return goja.Undefined()
		}
		attrName := call.Argument(0).String()
		return r.vm.ToValue(hasAttr(elementWrapper.node, attrName))
	})

	proto.Set("remove", func(call goja.FunctionCall) goja.Value {
		elementWrapper := r.unwrapDOMElement(call.This)
		if elementWrapper != nil && elementWrapper.node.Parent != nil {
			elementWrapper.node.Parent.RemoveChild(elementWrapper.node)
		}
		return goja.Undefined()
	})

	proto.Set("querySelector", func(call goja.FunctionCall) goja.Value {
		elementWrapper := r.unwrapDOMElement(call.This)
		if elementWrapper == nil {
			return goja.Undefined()
		}
		selector := call.Argument(0).String()
		element := r.querySelector(elementWrapper.node, selector)
		if element == nil {
			return r.vm.ToValue(nil)
		}
		return r.newDOMObject(element)
	})

	proto.Set("querySelectorAll", func(call goja.FunctionCall) goja.Value {
		elementWrapper := r.unwrapDOMElement(call.This)
		if elementWrapper == nil {
			return goja.Undefined()
		}
		selector := call.Argument(0).String()
		return r.hostQuerySelectorAllFromNode(elementWrapper.node, selector)
	})

	proto.Set("cloneNode", func(call goja.FunctionCall) goja.Value {
		elementWrapper := r.unwrapDOMElement(call.This)
		if elementWrapper == nil {
			return goja.Undefined()
		}

		deep := false
		if len(call.Arguments) > 0 {
			deep = call.Argument(0).ToBoolean()
		}

		return r.newDOMObject(cloneNode(elementWrapper.node, deep))
	})

	return proto
}

func (r *Runtime) newDOMObject(node *html.Node) goja.Value {
	if node == nil {
		return goja.Null()
	}
	if cached, ok := r.nodeObjects[node]; ok {
		return cached
	}

	obj := r.vm.NewObject()
	elementWrapper := &DOMElement{
		node:    node,
		runtime: r,
	}
	_ = obj.Set(internalGoNodeKey, elementWrapper)
	obj.SetPrototype(r.domPrototype)
	r.nodeObjects[node] = obj

	return obj
}

func (r *Runtime) createJSArrayWithForEach(elements []interface{}) *goja.Object {
	jsArray := r.vm.ToValue(elements).(*goja.Object)
	jsArray.Set("forEach", func(callback goja.FunctionCall) goja.Value {
		callbackFunc, ok := goja.AssertFunction(callback.Argument(0))
		if !ok {
			return goja.Undefined()
		}
		for i, element := range elements {
			callbackFunc(goja.Undefined(), r.vm.ToValue(element), r.vm.ToValue(i), jsArray)
		}
		return goja.Undefined()
	})
	return jsArray
}

func (r *Runtime) createNodeList(node *html.Node) goja.Value {
	var childNodes []*html.Node
	for child := node.FirstChild; child != nil; child = child.NextSibling {
		if child.Type == html.ElementNode {
			childNodes = append(childNodes, child)
		}
	}

	jsElements := make([]interface{}, len(childNodes))
	for i, child := range childNodes {
		jsElements[i] = r.newDOMObject(child)
	}

	return r.createJSArrayWithForEach(jsElements)
}

func mapGoNodeTypeToJS(nodeType html.NodeType) int {
	switch nodeType {
	case html.ElementNode:
		return 1
	case html.TextNode:
		return 3
	case html.CommentNode:
		return 8
	case html.DocumentNode:
		return 9
	case html.DoctypeNode:
		return 10
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

func (r *Runtime) createClassList(elementWrapper *DOMElement) *goja.Object {
	obj := r.vm.NewObject()

	getClasses := func() []string {
		return strings.Fields(getAttr(elementWrapper.node, "class"))
	}
	setClasses := func(classes []string) {
		setAttr(elementWrapper.node, "class", strings.Join(classes, " "))
	}

	obj.Set("contains", func(call goja.FunctionCall) goja.Value {
		className := call.Argument(0).String()
		for _, class := range getClasses() {
			if class == className {
				return r.vm.ToValue(true)
			}
		}
		return r.vm.ToValue(false)
	})

	obj.Set("add", func(call goja.FunctionCall) goja.Value {
		className := call.Argument(0).String()
		classes := getClasses()

		exists := false
		for _, class := range classes {
			if class == className {
				exists = true
				break
			}
		}

		if !exists {
			classes = append(classes, className)
			setClasses(classes)
		}
		return goja.Undefined()
	})

	obj.Set("remove", func(call goja.FunctionCall) goja.Value {
		className := call.Argument(0).String()
		classes := getClasses()
		newClasses := make([]string, 0, len(classes))

		changed := false
		for _, class := range classes {
			if class != className {
				newClasses = append(newClasses, class)
			} else {
				changed = true
			}
		}

		if changed {
			setClasses(newClasses)
		}
		return goja.Undefined()
	})

	obj.Set("toggle", func(call goja.FunctionCall) goja.Value {
		className := call.Argument(0).String()
		classes := getClasses()

		foundIndex := -1
		for i, class := range classes {
			if class == className {
				foundIndex = i
				break
			}
		}

		if foundIndex != -1 {
			classes = append(classes[:foundIndex], classes[foundIndex+1:]...)
			setClasses(classes)
			return r.vm.ToValue(false)
		}

		classes = append(classes, className)
		setClasses(classes)
		return r.vm.ToValue(true)
	})

	return obj
}

func (r *Runtime) createDatasetProxy(elementWrapper *DOMElement) goja.Value {
	if elementWrapper.datasetProxy != nil {
		return elementWrapper.datasetProxy
	}

	proxyConstructor := r.vm.Get("Proxy")
	ctor, ok := goja.AssertConstructor(proxyConstructor)
	if !ok {
		return goja.Undefined()
	}

	handler := r.vm.NewObject()
	handler.Set("get", func(call goja.FunctionCall) goja.Value {
		prop := call.Argument(1).String()
		attrName := "data-" + camelToKebab(prop)
		if hasAttr(elementWrapper.node, attrName) {
			return r.vm.ToValue(getAttr(elementWrapper.node, attrName))
		}
		return goja.Undefined()
	})

	handler.Set("set", func(call goja.FunctionCall) goja.Value {
		prop := call.Argument(1).String()
		val := call.Argument(2).String()
		attrName := "data-" + camelToKebab(prop)
		setAttr(elementWrapper.node, attrName, val)
		return r.vm.ToValue(true)
	})

	handler.Set("deleteProperty", func(call goja.FunctionCall) goja.Value {
		prop := call.Argument(1).String()
		attrName := "data-" + camelToKebab(prop)
		removeAttr(elementWrapper.node, attrName)
		return r.vm.ToValue(true)
	})

	handler.Set("ownKeys", func(call goja.FunctionCall) goja.Value {
		var keys []string
		for _, attr := range elementWrapper.node.Attr {
			if strings.HasPrefix(strings.ToLower(attr.Key), "data-") {
				keys = append(keys, kebabToCamel(strings.TrimPrefix(strings.ToLower(attr.Key), "data-")))
			}
		}
		return r.vm.ToValue(keys)
	})

	handler.Set("getOwnPropertyDescriptor", func(call goja.FunctionCall) goja.Value {
		prop := call.Argument(1).String()
		attrName := "data-" + camelToKebab(prop)
		if hasAttr(elementWrapper.node, attrName) {
			desc := r.vm.NewObject()
			desc.Set("value", getAttr(elementWrapper.node, attrName))
			desc.Set("writable", true)
			desc.Set("enumerable", true)
			desc.Set("configurable", true)
			return desc
		}
		return goja.Undefined()
	})

	target := r.vm.NewObject()
	proxy, err := ctor(nil, target, handler)
	if err != nil {
		return goja.Undefined()
	}

	elementWrapper.datasetProxy = proxy
	return proxy
}

func camelToKebab(s string) string {
	var b strings.Builder
	for i, r := range s {
		if unicode.IsUpper(r) {
			if i > 0 {
				b.WriteRune('-')
			}
			b.WriteRune(unicode.ToLower(r))
		} else {
			b.WriteRune(r)
		}
	}
	return b.String()
}

func kebabToCamel(s string) string {
	var b strings.Builder
	nextUpper := false
	for _, r := range s {
		if r == '-' {
			nextUpper = true
			continue
		}
		if nextUpper {
			b.WriteRune(unicode.ToUpper(r))
			nextUpper = false
		} else {
			b.WriteRune(r)
		}
	}
	return b.String()
}

func (r *Runtime) getTextContent(node *html.Node) string {
	if node.Type == html.TextNode {
		return node.Data
	}

	var b strings.Builder
	for child := node.FirstChild; child != nil; child = child.NextSibling {
		b.WriteString(r.getTextContent(child))
	}

	return b.String()
}

func (r *Runtime) querySelector(node *html.Node, selector string) *html.Node {
	return querySelectorNode(node, selector)
}

func (r *Runtime) querySelectorAll(node *html.Node, selector string) []*html.Node {
	return querySelectorAllNodes(node, selector)
}

func cloneNode(node *html.Node, deep bool) *html.Node {
	newNode := &html.Node{
		Type:      node.Type,
		DataAtom:  node.DataAtom,
		Data:      node.Data,
		Namespace: node.Namespace,
		Attr:      make([]html.Attribute, len(node.Attr)),
	}
	copy(newNode.Attr, node.Attr)

	if deep {
		for child := node.FirstChild; child != nil; child = child.NextSibling {
			newChild := cloneNode(child, true)
			newNode.AppendChild(newChild)
		}
	}

	return newNode
}

func (r *Runtime) ParseHTMLDocumentTest(htmlText string) {
	r.parseHTMLDocument(htmlText)
}

func (r *Runtime) parseHTMLDocument(htmlText string) {
	startTime := time.Now()
	doc, err := html.Parse(strings.NewReader(htmlText))
	r.RecordDOMParse(time.Since(startTime).Milliseconds())
	if err != nil {
		panic(r.vm.ToValue(err))
	}
	r.document = &DOMElement{
		node:    doc,
		runtime: r,
	}
}

func (r *Runtime) hostQuerySelector(selector string) goja.Value {
	if r.document == nil {
		return r.vm.ToValue(nil)
	}

	element := r.querySelector(r.document.node, selector)
	if element == nil {
		return r.vm.ToValue(nil)
	}

	return r.newDOMObject(element)
}

func (r *Runtime) hostQuerySelectorAll(selector string) goja.Value {
	if r.document == nil {
		return r.vm.ToValue([]interface{}{})
	}

	elements := r.querySelectorAll(r.document.node, selector)
	jsElements := make([]interface{}, len(elements))
	for i, element := range elements {
		jsElements[i] = r.newDOMObject(element)
	}

	return r.createJSArrayWithForEach(jsElements)
}

func (r *Runtime) hostQuerySelectorAllFromNode(node *html.Node, selector string) goja.Value {
	elements := r.querySelectorAll(node, selector)
	jsElements := make([]interface{}, len(elements))
	for i, element := range elements {
		jsElements[i] = r.newDOMObject(element)
	}

	return r.createJSArrayWithForEach(jsElements)
}

func (r *Runtime) domToDetails(node *html.Node) []goja.Value {
	if node == nil {
		return nil
	}

	var details []goja.Value
	switch node.Type {
	case html.TextNode:
		text := strings.TrimSpace(node.Data)
		if text != "" {
			item := r.vm.NewObject()
			_ = item.Set("type", "text")
			_ = item.Set("value", text)
			details = append(details, item)
		}
	case html.ElementNode:
		switch node.Data {
		case "script", "style":
		case "img":
			src := getAttr(node, "src")
			if src != "" {
				item := r.vm.NewObject()
				_ = item.Set("type", "image")
				_ = item.Set("value", src)
				_ = item.Set("alt", getAttr(node, "alt"))
				_ = item.Set("ariaLabel", getAttr(node, "aria-label"))
				_ = item.Set("title", getAttr(node, "title"))
				details = append(details, item)
			}
		case "iframe":
			src := getAttr(node, "src")
			if src != "" {
				item := r.vm.NewObject()
				_ = item.Set("type", "link")
				_ = item.Set("value", src)
				_ = item.Set("link", src)
				details = append(details, item)
			}
		case "video":
			src := ""
			if sourceNode := r.querySelector(node, "source"); sourceNode != nil {
				src = getAttr(sourceNode, "src")
			} else {
				src = getAttr(node, "src")
			}
			if src != "" {
				item := r.vm.NewObject()
				_ = item.Set("type", "video")
				_ = item.Set("value", src)
				_ = item.Set("ariaLabel", getAttr(node, "aria-label"))
				_ = item.Set("title", getAttr(node, "title"))
				_ = item.Set("poster", getAttr(node, "poster"))
				details = append(details, item)
			}
		case "a":
			href := getAttr(node, "href")
			if href == "" || strings.HasPrefix(href, "javascript:") {
				for child := node.FirstChild; child != nil; child = child.NextSibling {
					details = append(details, r.domToDetails(child)...)
				}
				break
			}

			if imgChild := r.querySelector(node, "img"); imgChild != nil {
				src := getAttr(imgChild, "src")
				if src != "" {
					item := r.vm.NewObject()
					_ = item.Set("type", "image")
					_ = item.Set("value", src)
					_ = item.Set("link", href)
					details = append(details, item)
					break
				}
			}

			text := r.getTextContent(node)
			if text != "" {
				item := r.vm.NewObject()
				_ = item.Set("type", "link")
				_ = item.Set("value", text)
				_ = item.Set("link", href)
				details = append(details, item)
			} else {
				for child := node.FirstChild; child != nil; child = child.NextSibling {
					details = append(details, r.domToDetails(child)...)
				}
			}
		default:
			for child := node.FirstChild; child != nil; child = child.NextSibling {
				details = append(details, r.domToDetails(child)...)
			}
		}
	case html.DocumentNode:
		for child := node.FirstChild; child != nil; child = child.NextSibling {
			details = append(details, r.domToDetails(child)...)
		}
	}

	if len(details) <= 1 {
		return details
	}

	merged := make([]goja.Value, 0, len(details))
	var textBuffer strings.Builder
	flush := func() {
		if textBuffer.Len() == 0 {
			return
		}
		item := r.vm.NewObject()
		_ = item.Set("type", "text")
		_ = item.Set("value", textBuffer.String())
		merged = append(merged, item)
		textBuffer.Reset()
	}

	for _, item := range details {
		obj := item.ToObject(r.vm)
		if obj.Get("type").String() == "text" {
			if textBuffer.Len() > 0 {
				textBuffer.WriteString("\n")
			}
			textBuffer.WriteString(obj.Get("value").String())
			continue
		}
		flush()
		merged = append(merged, item)
	}
	flush()
	return merged
}

func (r *Runtime) hostSynuraParse(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		return goja.Null()
	}

	parseType := call.Argument(0).String()
	jsElementObject := call.Argument(1)

	obj := jsElementObject.ToObject(r.vm)
	if obj == nil {
		return goja.Null()
	}
	internalVal := obj.Get(internalGoNodeKey)
	if internalVal == nil || goja.IsUndefined(internalVal) || goja.IsNull(internalVal) {
		return goja.Null()
	}

	elementWrapper, ok := internalVal.Export().(*DOMElement)
	if !ok {
		return goja.Null()
	}

	var details []goja.Value
	if parseType == "post" {
		details = r.domToDetails(elementWrapper.node)
	} else {
		return goja.Null()
	}

	interfaceSlice := make([]interface{}, len(details))
	for i, detail := range details {
		interfaceSlice[i] = detail
	}

	return r.vm.NewArray(interfaceSlice...)
}

func querySelectorNode(node *html.Node, selector string) *html.Node {
	if node == nil {
		return nil
	}

	if node.Type == html.ElementNode && matchesSelector(node, selector) {
		return node
	}

	for child := node.FirstChild; child != nil; child = child.NextSibling {
		if result := querySelectorNode(child, selector); result != nil {
			return result
		}
	}

	return nil
}

func querySelectorAllNodes(node *html.Node, selector string) []*html.Node {
	if node == nil {
		return nil
	}

	var results []*html.Node
	if node.Type == html.ElementNode && matchesSelector(node, selector) {
		results = append(results, node)
	}

	for child := node.FirstChild; child != nil; child = child.NextSibling {
		results = append(results, querySelectorAllNodes(child, selector)...)
	}

	return results
}

func matchesSelector(node *html.Node, selector string) bool {
	selector = strings.TrimSpace(selector)

	if strings.Contains(selector, ">") {
		return matchesChildCombinatorSelector(node, selector)
	}

	if strings.Contains(selector, " ") {
		parts := strings.Fields(selector)
		if len(parts) > 1 {
			lastPart := parts[len(parts)-1]
			if !matchesSingleSelector(node, lastPart) {
				return false
			}
			return hasMatchingAncestors(node, parts[:len(parts)-1])
		}
	}

	return matchesSingleSelector(node, selector)
}

func matchesSingleSelector(node *html.Node, selector string) bool {
	selector = strings.TrimSpace(selector)

	if baseSelector, pseudoClass, pseudoArg, ok := splitPseudoSelector(selector); ok {
		if baseSelector != "" && !matchesSingleSelector(node, baseSelector) {
			return false
		}
		return matchesPseudoSelector(node, pseudoClass, pseudoArg)
	}

	if !strings.Contains(selector, "[") &&
		(strings.Contains(selector, ".") || strings.Contains(selector, "#")) {
		return matchesCompoundSelector(node, selector)
	}

	if strings.HasPrefix(selector, ".") {
		className := selector[1:]
		classAttr := getAttr(node, "class")
		if classAttr == "" {
			return false
		}
		for _, class := range strings.Fields(classAttr) {
			if class == className {
				return true
			}
		}
		return false
	}

	if strings.HasPrefix(selector, "#") {
		return getAttr(node, "id") == selector[1:]
	}

	if node.Data == selector {
		return true
	}

	if strings.Contains(selector, "[") && strings.Contains(selector, "]") {
		return matchesAttributeSelector(node, selector)
	}

	return false
}

func splitPseudoSelector(selector string) (baseSelector, pseudoClass, pseudoArg string, ok bool) {
	bracketDepth := 0
	for i := 0; i < len(selector); i++ {
		switch selector[i] {
		case '[':
			bracketDepth++
		case ']':
			if bracketDepth > 0 {
				bracketDepth--
			}
		case ':':
			if bracketDepth > 0 {
				continue
			}
			baseSelector = strings.TrimSpace(selector[:i])
			pseudoPart := strings.TrimSpace(selector[i+1:])
			if pseudoPart == "" {
				return "", "", "", false
			}
			if open := strings.IndexByte(pseudoPart, '('); open >= 0 && strings.HasSuffix(pseudoPart, ")") {
				pseudoClass = strings.TrimSpace(pseudoPart[:open])
				pseudoArg = strings.TrimSpace(pseudoPart[open+1 : len(pseudoPart)-1])
			} else {
				pseudoClass = strings.TrimSpace(pseudoPart)
			}
			return baseSelector, pseudoClass, pseudoArg, pseudoClass != ""
		}
	}
	return "", "", "", false
}

func matchesPseudoSelector(node *html.Node, pseudoClass, pseudoArg string) bool {
	switch pseudoClass {
	case "first-child":
		return elementSiblingIndex(node) == 1
	case "last-child":
		index, total := elementSiblingPosition(node)
		return index > 0 && index == total
	case "nth-child":
		index := elementSiblingIndex(node)
		if index == 0 {
			return false
		}
		switch strings.ToLower(strings.TrimSpace(pseudoArg)) {
		case "odd":
			return index%2 == 1
		case "even":
			return index%2 == 0
		default:
			n, err := strconv.Atoi(strings.TrimSpace(pseudoArg))
			if err != nil {
				return false
			}
			return index == n
		}
	default:
		return false
	}
}

func elementSiblingIndex(node *html.Node) int {
	index, _ := elementSiblingPosition(node)
	return index
}

func elementSiblingPosition(node *html.Node) (index, total int) {
	if node == nil || node.Type != html.ElementNode || node.Parent == nil {
		return 0, 0
	}

	for sibling := node.Parent.FirstChild; sibling != nil; sibling = sibling.NextSibling {
		if sibling.Type != html.ElementNode {
			continue
		}
		total++
		if sibling == node {
			index = total
		}
	}

	return index, total
}

func matchesCompoundSelector(node *html.Node, selector string) bool {
	var tagName string
	var classNames []string
	var idName string

	remaining := selector
	if dotIndex := strings.Index(remaining, "."); dotIndex > 0 {
		tagName = remaining[:dotIndex]
		remaining = remaining[dotIndex:]
	} else if hashIndex := strings.Index(remaining, "#"); hashIndex > 0 {
		tagName = remaining[:hashIndex]
		remaining = remaining[hashIndex:]
	}

	for remaining != "" {
		if strings.HasPrefix(remaining, ".") {
			remaining = remaining[1:]
			end := len(remaining)
			if dotIndex := strings.Index(remaining, "."); dotIndex >= 0 {
				end = dotIndex
			}
			if hashIndex := strings.Index(remaining, "#"); hashIndex >= 0 && hashIndex < end {
				end = hashIndex
			}
			if bracketIndex := strings.Index(remaining, "["); bracketIndex >= 0 && bracketIndex < end {
				end = bracketIndex
			}
			className := remaining[:end]
			if className != "" {
				classNames = append(classNames, className)
			}
			remaining = remaining[end:]
			continue
		}

		if strings.HasPrefix(remaining, "#") {
			remaining = remaining[1:]
			end := len(remaining)
			if dotIndex := strings.Index(remaining, "."); dotIndex >= 0 {
				end = dotIndex
			}
			if hashIndex := strings.Index(remaining, "#"); hashIndex >= 0 {
				end = hashIndex
			}
			if bracketIndex := strings.Index(remaining, "["); bracketIndex >= 0 && bracketIndex < end {
				end = bracketIndex
			}
			idName = remaining[:end]
			remaining = remaining[end:]
			continue
		}

		break
	}

	if tagName != "" && node.Data != tagName {
		return false
	}

	if len(classNames) > 0 {
		nodeClasses := strings.Fields(getAttr(node, "class"))
		for _, requiredClass := range classNames {
			found := false
			for _, nodeClass := range nodeClasses {
				if nodeClass == requiredClass {
					found = true
					break
				}
			}
			if !found {
				return false
			}
		}
	}

	if idName != "" && getAttr(node, "id") != idName {
		return false
	}

	return true
}

func matchesChildCombinatorSelector(node *html.Node, selector string) bool {
	parts := parseComplexSelector(selector)
	if len(parts) == 0 {
		return false
	}

	lastPart := parts[len(parts)-1]
	if !matchesSingleSelector(node, lastPart.Selector) {
		return false
	}

	currentNode := node
	for i := len(parts) - 2; i >= 0; i-- {
		part := parts[i]
		if part.Combinator == ">" {
			if currentNode.Parent == nil || currentNode.Parent.Type != html.ElementNode {
				return false
			}
			if !matchesSingleSelector(currentNode.Parent, part.Selector) {
				return false
			}
			currentNode = currentNode.Parent
			continue
		}

		found := false
		for ancestor := currentNode.Parent; ancestor != nil; ancestor = ancestor.Parent {
			if ancestor.Type == html.ElementNode && matchesSingleSelector(ancestor, part.Selector) {
				currentNode = ancestor
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}

	return true
}

type selectorPart struct {
	Selector   string
	Combinator string
}

func parseComplexSelector(selector string) []selectorPart {
	var parts []selectorPart

	selector = strings.ReplaceAll(selector, ">", " > ")
	tokens := strings.Fields(selector)
	for _, token := range tokens {
		if token == ">" {
			if len(parts) > 0 {
				parts[len(parts)-1].Combinator = ">"
			}
			continue
		}
		parts = append(parts, selectorPart{
			Selector:   token,
			Combinator: " ",
		})
	}

	return parts
}

func hasMatchingAncestors(node *html.Node, ancestorParts []string) bool {
	if len(ancestorParts) == 0 {
		return true
	}

	currentPart := ancestorParts[len(ancestorParts)-1]
	remainingParts := ancestorParts[:len(ancestorParts)-1]
	for parent := node.Parent; parent != nil; parent = parent.Parent {
		if parent.Type == html.ElementNode && matchesSingleSelector(parent, currentPart) {
			if len(remainingParts) == 0 {
				return true
			}
			if hasMatchingAncestors(parent, remainingParts) {
				return true
			}
		}
	}

	return false
}

func matchesAttributeSelector(node *html.Node, selector string) bool {
	start := strings.Index(selector, "[")
	end := strings.Index(selector, "]")
	if start == -1 || end == -1 || end <= start {
		return false
	}

	tagName := selector[:start]
	if tagName != "" && tagName != node.Data {
		return false
	}

	attrPart := selector[start+1 : end]
	if strings.Contains(attrPart, "=") {
		parts := strings.SplitN(attrPart, "=", 2)
		if len(parts) != 2 {
			return false
		}
		attrName := strings.TrimSpace(parts[0])
		attrValue := strings.Trim(strings.TrimSpace(parts[1]), "\"'")
		return getAttr(node, attrName) == attrValue
	}

	return hasAttr(node, strings.TrimSpace(attrPart))
}
