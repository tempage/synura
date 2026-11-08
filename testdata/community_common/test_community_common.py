"""Offline contract tests for community_common.ts using synthetic data only.

Run: python3 -m unittest discover -s testdata/community_common -p 'test_*.py'
Requires tsc and a built synurart; SYNURART_BIN may select another binary.
No production extension, real response, user storage, or network is used.
"""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
RUNTIME = Path(os.environ.get('SYNURART_BIN', ROOT / 'target/debug/synurart')).resolve()
POST_URL = 'https://example.test/post/item'


class CommunityCommonTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.compilation = tempfile.TemporaryDirectory(prefix='synura-common-compile-')
        bundle = Path(cls.compilation.name) / 'extension.js'
        subprocess.run([
            'tsc', '--target', 'ES2018', '--module', 'none', '--lib', 'ES2018,DOM',
            '--skipLibCheck', '--noEmitOnError', '--outFile', str(bundle),
            str(HERE / 'synthetic_extension.ts'), str(ROOT / 'extensions/community_common.ts'),
        ], check=True, capture_output=True, text=True)
        cls.bundle = bundle.read_text()

    @classmethod
    def tearDownClass(cls):
        cls.compilation.cleanup()

    def evaluate(self, expression, html=''):
        source = self.bundle + '\nvar __commonResult=(async function(){'
        source += 'var html=' + json.dumps(html, ensure_ascii=False) + ';'
        source += 'var doc=new DOMParser().parseFromString(html,"text/html");'
        source += expression + '})();\n'
        with tempfile.TemporaryDirectory(prefix='synura-common-case-') as directory:
            script = Path(directory) / 'case.js'
            script.write_text(source)
            result = subprocess.run(
                [str(RUNTIME), '-json', '-no-home', '-proxy', 'http://127.0.0.1:9', '-ext', str(script)],
                input='eval (async()=>JSON.stringify(await __commonResult))()\nquit\n', cwd=directory,
                capture_output=True, text=True, check=True, timeout=20,
            )
        events = [json.loads(line) for line in result.stdout.splitlines() if line.startswith('{')]
        self.assertFalse([event for event in events if event.get('type') == 'error'], result.stdout)
        values = [event['result'] for event in events if event.get('type') == 'eval']
        self.assertEqual(len(values), 1, result.stdout + result.stderr)
        return json.loads(values[0])

    def route(self, html, response_url=POST_URL, before='', expression='return result.models;'):
        setup = before + 'useSyntheticResponse(doc,html,' + json.dumps(response_url) + ');'
        setup += 'var result=await SYNURA.main.router(' + json.dumps(POST_URL) + ');'
        return self.evaluate(setup + expression, html)

    def test_media_links_and_video_poster_resolve_against_content_origin(self):
        html = '<div><img src="../image.png"><a href="#section">Link</a><video src="/video.mp4" poster="/poster.jpg"></video></div>'
        parts = self.evaluate('return parseDetails(doc.querySelector("div"),"https://media.example.test/path/item?mode=1");', html)
        self.assertEqual(parts[0]['value'], 'https://media.example.test/image.png')
        self.assertEqual(parts[1]['link'], 'https://media.example.test/path/item?mode=1#section')
        self.assertEqual(parts[2]['value'], 'https://media.example.test/video.mp4')
        self.assertEqual(parts[2]['poster'], 'https://media.example.test/poster.jpg')

    def test_redirect_target_is_the_default_base_for_body_and_comments(self):
        html = '<div id="post-body"><img src="body.png"></div><div data-comment id="reply"><img src="reply.png"></div>'
        result = self.route(html, 'https://example.test/mobile/item/')
        self.assertEqual(result['content'][0]['value'], 'https://example.test/mobile/item/body.png')
        self.assertEqual(result['comments'][0]['content'][0]['value'], 'https://example.test/mobile/item/reply.png')

    def test_document_base_changes_media_without_replacing_permalink(self):
        html = '<base href="https://media.example.test/assets/"><div id="post-body"><img src="body.png"></div><div data-comment id="reply"><img src="reply.png"></div>'
        result = self.route(html)
        self.assertEqual(result['content'][0]['value'], 'https://media.example.test/assets/body.png')
        self.assertEqual(result['comments'][0]['content'][0]['value'], 'https://media.example.test/assets/reply.png')
        self.assertEqual(result['link'], POST_URL)
        self.assertEqual(result['comments'][0]['link'], POST_URL + '#reply')

    def test_relative_base_uses_redirect_target_and_does_not_escape_context(self):
        html = '<base href="../assets/"><div id="post-body"><img src="image.png"></div>'
        result = self.route(html, 'https://example.test/mobile/item/', expression='return [result.models.content[0].value,resolveContentUrl("image.png","https://other.example.test/path/")];')
        self.assertEqual(result, ['https://example.test/mobile/assets/image.png', 'https://other.example.test/path/image.png'])

    def test_nested_context_is_restored_after_exception(self):
        expression = '''var child=new DOMParser().parseFromString('<base href="/inner/">',"text/html");
var values=withSelectorContext(null,"https://example.test/post/a","post",doc,function(){
    var values=[resolveContentUrl("a.png","https://example.test/post/a")];
    try { withSelectorContext(null,"https://example.test/post/b","post",child,function(){
        values.push(resolveContentUrl("b.png","https://example.test/post/b"));throw new Error("synthetic");
    }); } catch (error) {}
    values.push(resolveContentUrl("c.png","https://example.test/post/a"));return values;
});values.push(resolveContentUrl("d.png","https://example.test/outside/"));return values;'''
        result = self.evaluate(expression, '<base href="/outer/">')
        self.assertEqual(result, ['https://example.test/outer/a.png', 'https://example.test/inner/b.png', 'https://example.test/outer/c.png', 'https://example.test/outside/d.png'])

    def test_non_http_document_base_is_ignored(self):
        for href in ('javascript:void(0)', 'data:text/plain,synthetic'):
            with self.subTest(href=href):
                value = self.evaluate('return documentContentBaseUrl(doc,"https://example.test/post/item");', '<base href="' + href + '">')
                self.assertEqual(value, POST_URL)

    def test_concurrent_async_routes_keep_their_document_base_and_comment_context(self):
        expression = '''fetch=async function(url){
    await Promise.resolve();
    var suffix=url.split("/").pop();
    var markup='<base href="https://media.example.test/'+suffix+'/"><h1>'+suffix+'</h1><div id="post-body"><img src="body.png"></div><div id="reply"><img src="reply.png"></div>';
    var consumed=false;
    return {ok:true,status:200,url:url,text:async function(){
        if(consumed) throw new TypeError("Body already consumed");
        consumed=true;await Promise.resolve();return markup;
    }};
};
SITE.fetchPostComments=async function(match,url,doc){
    await Promise.resolve();await Promise.resolve();
    return [{content:parseDetails(doc.querySelector("#reply"),url)}];
};
var routes=await Promise.all(["first","second","third"].map(function(name){
    return SYNURA.main.router("https://example.test/post/"+name);
}));
return {images:routes.map(function(route){return [route.models.content[0].value,route.models.comments[0].content[0].value]}),
    outside:resolveContentUrl("outside.png","https://example.test/outside/"),depth:selectorContextStack.length};'''
        result = self.evaluate(expression)
        self.assertEqual(result['images'], [
            [f'https://media.example.test/{name}/body.png', f'https://media.example.test/{name}/reply.png']
            for name in ('first', 'second', 'third')
        ])
        self.assertEqual(result['outside'], 'https://example.test/outside/outside.png')
        self.assertEqual(result['depth'], 0)

    def test_failed_async_route_restores_context_and_does_not_block_the_next_route(self):
        expression = '''useSyntheticResponse(doc,html,"https://example.test/post/working");
var successfulFetch=fetch;
fetch=async function(url){
    await Promise.resolve();
    if(url.endsWith("/failed")) throw new TypeError("Synthetic network failure");
    return successfulFetch(url);
};
var results=await Promise.all([
    SYNURA.main.router("https://example.test/post/failed").then(function(){return "unexpected"},function(error){return error.name}),
    SYNURA.main.router("https://example.test/post/working")
]);
return {error:results[0],image:results[1].models.content[0].value,depth:selectorContextStack.length};'''
        result = self.evaluate(expression, '<base href="https://media.example.test/working/"><div id="post-body"><img src="image.png"></div>')
        self.assertEqual(result, {'error': 'TypeError', 'image': 'https://media.example.test/working/image.png', 'depth': 0})

    def test_catalog_refresh_awaits_network_and_cached_board_lookup_stays_synchronous(self):
        expression = '''var cached=[{id:"cached",title:"Cached",url:"https://example.test/cached/"}];
SITE.loadDynamicBoards=function(options){
    if(!options.allowNetwork) return cached;
    return Promise.resolve([{id:"fetched",title:"Fetched",url:"https://example.test/fetched/"}]);
};
clearDynamicBoardsCache();
var before=getDynamicBoards({allowNetwork:false});
var refreshed=await getDynamicBoards({allowNetwork:true,force:true});
var after=getDynamicBoards({allowNetwork:false});
return {before:Array.isArray(before)&&before[0].id,refreshed:refreshed[0].id,after:Array.isArray(after)&&after[0].id};'''
        self.assertEqual(self.evaluate(expression), {'before': 'cached', 'refreshed': 'fetched', 'after': 'fetched'})

    def test_encoded_response_preserves_body_failure_without_consuming_it_again(self):
        expression = '''SITE.textEncoding="utf-8";
var fallbackCalls=0;
var failure=new TypeError("Synthetic body transport failure");
try {
    await responseText({arrayBuffer:async function(){throw failure},text:async function(){fallbackCalls++;throw new TypeError("Body already consumed")}});
    return {unexpected:true};
} catch(error) { return {same:error===failure,message:error.message,fallbackCalls:fallbackCalls}; }'''
        self.assertEqual(self.evaluate(expression), {
            'same': True, 'message': 'Synthetic body transport failure', 'fallbackCalls': 0,
        })

    def test_decoder_construction_failure_uses_utf8_without_reading_the_body_twice(self):
        expression = '''SITE.textEncoding="synthetic-unsupported-encoding";
TextDecoder=function(){throw new RangeError("Unsupported encoding")};
var reads=0;
var text=await responseText({arrayBuffer:async function(){reads++;throw new Error("Unexpected body reader")},text:async function(){reads++;return "Synthetic text"}});
return {text:text,reads:reads};'''
        self.assertEqual(self.evaluate(expression), {'text': 'Synthetic text', 'reads': 1})

    def test_post_filter_reparse_retains_document_base(self):
        html = '<base href="//media.example.test/assets/"><div id="post-body"><img src="image.png"></div>'
        hook = 'SITE.filterPostContent=function(content,url,doc){return parseDetails(doc.querySelector("#post-body"),url)};'
        result = self.route(html, before=hook)
        self.assertEqual(result['content'][0]['value'], 'https://media.example.test/assets/image.png')

    def test_board_media_uses_redirect_and_relative_document_base(self):
        html = '<base href="../assets/"><div data-card id="card">Synthetic item<img src="image.png"></div>'
        result = self.evaluate('useSyntheticResponse(doc,html,"https://example.test/mobile/list/");return (await SYNURA.main.router("https://example.test/board/")).models.contents;', html)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['mediaUrl'], 'https://example.test/mobile/assets/image.png')

    def test_semantic_content_root_hook_overrides_default_selector(self):
        html = '<div id="post-body">Other region</div><article id="selected">Selected content<img src="/image.png"></article>'
        result = self.route(html, before='SITE.selectPostContentRoot=function(doc){return doc.querySelector("#selected")};')
        self.assertEqual([part['value'] for part in result['content']], ['Selected content', 'https://example.test/image.png'])

    def test_shared_router_preserves_all_hook_comments_in_order(self):
        comments = [{'id': 'entry-' + str(i), 'content': [{'type': 'text', 'value': 'Repeated synthetic text'}]} for i in range(257)]
        comments[-1]['content'] = [{'type': 'image', 'value': 'https://example.test/tail.png'}]
        result = self.route('<div id="post-body">Synthetic body</div>', before='SITE.parseComments=function(){return ' + json.dumps(comments) + '};')
        self.assertEqual(result['comments'], comments)

    def test_markup_comment_parsing_reclaims_temporary_documents_and_keeps_every_comment(self):
        hook = '''SITE.parseComments=function(doc,url){
    var comments=[];
    for(var i=0;i<257;i++) comments.push({id:"entry-"+i,
        content:parseMarkupDetails('<p>Comment '+i+'</p><img src="images/'+i+'.png">',url)});
    return comments;
};'''
        result = self.route(
            '<div id="post-body">Synthetic body</div>', before=hook,
            expression='return {comments:result.models.comments,after:parseMarkupDetails("<p>Follow-on parse</p>","https://example.test/post/item")};',
        )
        self.assertEqual([comment['id'] for comment in result['comments']],
                         ['entry-' + str(i) for i in range(257)])
        self.assertEqual([[part['value'] for part in comment['content']] for comment in result['comments']],
                         [[f'Comment {i}', f'https://example.test/post/images/{i}.png'] for i in range(257)])
        self.assertEqual([part['value'] for part in result['after']], ['Follow-on parse'])

    def test_missing_comment_hook_does_not_invent_comments(self):
        result = self.evaluate('delete SITE.parseComments;return parseComments(doc,"https://example.test/post/item");', '<h1>Synthetic heading</h1>')
        self.assertEqual(result, [])

    def test_each_lazy_image_replaces_its_repeated_placeholder(self):
        html = '<div><img src="/blank.gif" data-src="/one.png"><img src="/blank.gif" data-src="/two.png"><img data-srcset="/three.png 1x, /four.png 2x"></div>'
        parts = self.evaluate('return parseDetails(doc.querySelector("div"),"https://example.test/post/item");', html)
        self.assertEqual([part['value'] for part in parts], ['https://example.test/one.png', 'https://example.test/two.png', 'https://example.test/three.png'])

    def test_background_media_repairs_placeholder_without_changing_link_target(self):
        html = '<div><img src="/placeholder.gif" style="background-image:url(/image.png)"></div>'
        expression = 'return fixParsedMediaDetails([{type:"image",value:"https://example.test/placeholder.gif",link:LINK}],doc.querySelector("div"),"https://example.test/");'
        for target, expected in [('https://example.test/placeholder.gif', 'https://example.test/image.png'), ('https://example.test/destination', 'https://example.test/destination')]:
            with self.subTest(target=target):
                result = self.evaluate(expression.replace('LINK', json.dumps(target)), html)
                self.assertEqual(result[0]['value'], 'https://example.test/image.png')
                self.assertEqual(result[0]['link'], expected)

    def test_srcset_preserves_internal_commas_and_selects_one_candidate(self):
        cases = [
            ('https://media.example.test/image,w200.jpg 2x, /small.jpg 1x', 'https://media.example.test/image,w200.jpg'),
            ('data:image/png;base64,AAAA 1x, /next.png 2x', 'data:image/png;base64,AAAA'),
            (' /first.png, /second.png 2x', '/first.png'),
            (' ,\n /first.png\t400w, /second.png 800w', '/first.png'),
        ]
        values = self.evaluate('return ' + json.dumps([case[0] for case in cases]) + '.map(firstUrlFromSrcset);')
        self.assertEqual(values, [case[1] for case in cases])
        parts = self.evaluate('return parseDetails(doc.querySelector("div"),"https://example.test/");', '<div><img data-srcset="/large.png 800w, /small.png 400w"></div>')
        self.assertEqual([part['value'] for part in parts], ['https://example.test/large.png'])

    def test_empty_native_parse_preserves_text_and_media(self):
        result = self.evaluate('synura.parse=function(){return []};return parseDetails(doc.querySelector("div"),"https://example.test/");', '<div>Synthetic text<img src="/image.png"></div>')
        self.assertEqual([part['value'] for part in result], ['Synthetic text', 'https://example.test/image.png'])

    def test_image_only_content_remains_an_image(self):
        parts = self.evaluate('return parseDetails(doc.querySelector("div"),"https://example.test/");', '<div><img data-src="/image.png"></div>')
        self.assertEqual([(part['type'], part['value']) for part in parts], [('image', 'https://example.test/image.png')])

    def test_noscript_images_are_retained_without_markup_or_duplicates(self):
        html = '<div>Synthetic text<img src="/blank.gif" data-src="/image.png"><noscript><img src="/image.png"></noscript><noscript><img src="../fallback.png"></noscript></div>'
        expression = 'var root=doc.querySelector("div"),before=root.innerHTML;var parts=parseDetails(root,"https://example.test/path/item/");return {parts:parts,unchanged:before===root.innerHTML,noscripts:root.querySelectorAll("noscript").length};'
        result = self.evaluate(expression, html)
        self.assertEqual([part['value'] for part in result['parts']], ['Synthetic text', 'https://example.test/image.png', 'https://example.test/path/fallback.png'])
        self.assertTrue(result['unchanged'])
        self.assertEqual(result['noscripts'], 2)

    def test_controls_are_removed_before_collecting_noscript_fallbacks(self):
        html = '<div id="content"><blockquote>Quoted text<img src="/quote.png"><div class="bbCodeBlock-expandLink">Expand control</div></blockquote><div class="quoteExpand">Expand control</div><div class="toolbar">Toolbar<noscript><img src="/unused.png"></noscript></div><p>Synthetic reply</p></div>'
        expression = 'SITE.contentExcludeSelectors=[".toolbar"];var root=doc.querySelector("#content"),before=root.innerHTML;var parts=parseDetails(root,"https://example.test/");return {parts:parts,unchanged:before===root.innerHTML};'
        result = self.evaluate(expression, html)
        self.assertEqual([part['value'] for part in result['parts']], ['Quoted text', 'https://example.test/quote.png', 'Synthetic reply'])
        self.assertTrue(result['unchanged'])

    def test_hidden_markup_is_excluded_even_when_native_parser_returns_empty(self):
        html = '<div>Synthetic text<script>synthetic()</script><style>.unused{display:none}</style><noscript>Fallback notice<img src="/image.png"></noscript></div>'
        expression = 'synura.parse=function(){return []};return {body:parseDetails(doc.querySelector("div"),"https://example.test/"),script:parseDetails(doc.querySelector("script"),"https://example.test/"),noscript:parseDetails(doc.querySelector("noscript"),"https://example.test/")};'
        result = self.evaluate(expression, html)
        self.assertEqual([part['value'] for part in result['body']], ['Synthetic text', 'https://example.test/image.png'])
        self.assertEqual(result['script'], [])
        self.assertEqual(result['noscript'], [{'type': 'image', 'value': 'https://example.test/image.png', 'link': 'https://example.test/image.png'}])

    def test_metadata_attributes_and_remembered_memo_are_preserved(self):
        html = '<time id="iso" datetime="2030-01-02T03:04:05Z">Relative date</time><time id="epoch" data-time="1893456000">Relative date</time><span id="title" title="2030-01-03">Relative date</span>'
        expression = 'rememberItemPreview({link:"https://example.test/post/item",memo:"Synthetic memo"});return {dates:[firstDateText(doc,["#iso"]),firstDateText(doc,["#epoch"]),firstDateText(doc,["#title"])],memo:getRememberedItemPreview("https://example.test/post/item").memo};'
        result = self.evaluate(expression, html)
        self.assertEqual(result['dates'], ['2030-01-02T03:04:05Z', '2030-01-01T00:00:00.000Z', '2030-01-03'])
        self.assertEqual(result['memo'], 'Synthetic memo')

    def test_long_category_moves_to_memo_without_shrinking_title_field(self):
        html = '<h1>Synthetic title</h1><span id="post-category">Synthetic category with a long name</span><div id="post-body">Synthetic body</div>'
        result = self.route(html, expression='return result;')
        self.assertEqual(result['styles']['title'], 'Synthetic title')
        self.assertEqual(result['models']['category'], '')
        self.assertEqual(result['models']['memo'], 'Synthetic category with a long name')

    def test_count_localization_and_multiple_labels(self):
        cases = [('13K', '13000'), ('2M', '2000000'), ('1.2k', '1200'), ('1,2K', '1200'), ('1,234', '1234'), ('1.234', '1234'), ('১,২৩৪', '1234'), ('١٢٣', '123'), ('1.5万', '15000'), ('1.2万回复', '12000'), ('2亿阅读', '200000000'), ('-3', '-3'), ('no count', ''), ('Views: 1,234 Likes: 56', '1234')]
        values = self.evaluate('return ' + json.dumps([case[0] for case in cases]) + '.map(parseCount);')
        self.assertEqual(values, [case[1] for case in cases])

    def test_partial_selectors_use_only_query_and_attribute_access(self):
        html = '<div class="group"><a id="item-a" href="/item/a" class="entry active" lang="en-US" title="a,b > c">A</a><a id="literal" href="/^=value">L</a><section><a id="item-b" href="/item/b" class="entry" lang="english">B</a></section><a id="other" href="/other" class="active" lang="en">O</a><a id="empty" href="">E</a><a id="missing">M</a></div><a id="outside" href="/item/outside">X</a>'
        cases = [
            (".group a[href^='/item/']", ['item-a', 'item-b']),
            (".group > a[href^='/item/']", ['item-a']),
            (".group a[href$='/b']", ['item-b']),
            (".group a[href*='m/a']", ['item-a']),
            ("a[class~='active']", ['item-a', 'other']),
            ("a[lang|='en']", ['item-a', 'other']),
            ("a[href^='/item/'][class~='active']", ['item-a']),
            (".group a[title*='a,b > c']", ['item-a']),
            ("a[href^='/^=']", ['literal']),
            ("a[href^='']", []), ("a[href$='']", []), ("a[href*='']", []),
            ("a[class~='entry active']", []), ("a[href='/other']", ['other']),
            ("a[href^='/item/' i]", []), ("a:not([href^='/item/'])", []),
            ("div[class*='group'] a", []), ("a[href^='/item/'],a[href='/other']", []),
            ("a[href^='/missing']", []), ("a[lang|=en]", ['item-a', 'other']),
            ("a[href^=/item/]", []),
        ]
        expression = '''var before=doc.querySelector(".group").innerHTML;
var root={querySelectorAll:function(selector){return doc.querySelectorAll(selector).map(function(node){
    return {getAttribute:function(name){return node.getAttribute(name)}};
})}};
var actual=CASES.map(function(selector){return communityQueryAll(root,selector).map(function(node){return node.getAttribute("id")})});
return {actual:actual,unchanged:before===doc.querySelector(".group").innerHTML};'''.replace('CASES', json.dumps([case[0] for case in cases]))
        result = self.evaluate(expression, html)
        for actual, (selector, expected) in zip(result['actual'], cases):
            with self.subTest(selector=selector):
                self.assertEqual(actual, expected)
        self.assertTrue(result['unchanged'])


if __name__ == '__main__':
    unittest.main()
