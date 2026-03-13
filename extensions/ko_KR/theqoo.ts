// @ts-nocheck

var SITE = {
  "siteKey": "theqoo",
  "displayName": "더쿠",
  "browserHomeUrl": "https://theqoo.net/hot?filter_mode=normal",
  "browserCookieAuth": false,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "게시판 설정",
  "boardSettingsTitle": "게시판 설정",
  "boardSettingsLargeThreshold": 256,
  "boardSettingsPageSize": 96,
  "boardAddMode": "url_title",
  "hasFullBoardCatalog": false,
  "supportsBoardCatalogSync": true,
  "defaultVisibleBoardIds": [
    "hot",
    "square",
    "talk",
    "theqdeal",
    "beauty",
    "ktalk",
    "stock",
    "love",
    "exercise",
    "health"
  ],
  "hostAliases": [
    "www.theqoo.net",
    "m.theqoo.net"
  ],
  "challengeMarkers": [],
  "titleSuffixes": [
    " - 더쿠",
    " : 더쿠",
    " - THEQOO"
  ],
  "linkAllowPatterns": [
    "^https://theqoo\\.net/[A-Za-z0-9_]+/\\d+"
  ],
  "listBoardQueryParam": "",
  "boards": [
    {
      "id": "hot",
      "title": "HOT",
      "url": "/hot?filter_mode=normal",
      "description": "핫 게시판"
    },
    {
      "id": "square",
      "title": "스퀘어",
      "url": "/square?filter_mode=normal"
    },
    {
      "id": "talk",
      "title": "일상토크",
      "url": "/talk?filter_mode=normal",
      "description": "일상토크 게시판"
    },
    {
      "id": "beauty",
      "title": "뷰티",
      "url": "/beauty?filter_mode=normal",
      "description": "뷰티 게시판"
    },
    {
      "id": "ktalk",
      "title": "케이돌토크",
      "url": "/ktalk?filter_mode=normal"
    },
    {
      "id": "theqdeal",
      "title": "덬딜",
      "url": "/theqdeal?filter_mode=normal",
      "description": "핫딜 게시판"
    },
    {
      "id": "stock",
      "title": "주식",
      "url": "/stock?filter_mode=normal",
      "description": "주식 게시판"
    },
    {
      "id": "love",
      "title": "연애",
      "url": "/love?filter_mode=normal",
      "description": "연애 게시판"
    },
    {
      "id": "exercise",
      "title": "운동",
      "url": "/exercise?filter_mode=normal",
      "description": "운동 게시판"
    },
    {
      "id": "health",
      "title": "건강",
      "url": "/health?filter_mode=normal",
      "description": "건강 게시판"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".board-title",
      ".title",
      "title"
    ],
    "listRows": [
      "tbody tr",
      "li.clearfix.has-comment",
      "li.clearfix"
    ],
    "listLink": [
      "td.title a[href]",
      "a[href]"
    ],
    "listTitle": [
      "td.title",
      ".title_span",
      ".title"
    ],
    "listAuthor": [
      ".name",
      ".author",
      ".writer"
    ],
    "listDate": [
      ".date.el",
      ".date"
    ],
    "listCommentCount": [
      "a.reply.m-list-reply",
      "a.replyNum",
      ".replyNum",
      ".reply"
    ],
    "listViewCount": [
      ".hit.el",
      ".hit"
    ],
    "listLikeCount": [
      ".voted_count",
      ".vote"
    ],
    "listCategory": [
      ".cate",
      ".category",
      ".type"
    ],
    "listImage": [
      "img"
    ],
    "postTitle": [
      ".title-wrap h1",
      ".title-wrap .title",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".side .name",
      ".author .name",
      ".writer .name",
      ".writer"
    ],
    "postDate": [
      ".title-wrap .date.el",
      ".date.el",
      ".date"
    ],
    "postViewCount": [
      ".title-wrap .hit.el",
      ".hit.el",
      ".hit"
    ],
    "postLikeCount": [
      ".title-wrap .vote.el",
      ".vote.el",
      ".vote"
    ],
    "postCategory": [
      ".title-wrap .category",
      ".category"
    ],
    "postContent": [
      ".rhymix_content.xe_content",
      ".xe_content"
    ],
    "commentRows": [
      ".fdb_lst_ul li",
      "#comment .comment-item",
      "#comment li",
      ".comment_list li"
    ],
    "commentAuthor": [
      ".member_plate",
      ".name",
      ".author",
      ".nick_name",
      ".nick"
    ],
    "commentContent": [
      ".comment-content",
      ".xe_content",
      ".comment_text",
      ".comment-body"
    ],
    "commentDate": [
      ".regdate",
      ".date",
      "time"
    ],
    "commentLikeCount": [
      ".voted_count",
      ".vote"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": [],
  "boardGroupMap": {
    "hot": "인기",
    "square": "인기",
    "theqdeal": "인기",
    "talk": "커뮤니티",
    "beauty": "라이프",
    "ktalk": "엔터",
    "stock": "재테크",
    "love": "라이프",
    "exercise": "라이프",
    "health": "라이프"
  }
};
SITE.matchBoard = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (urlInfo.path === "/" || urlInfo.path === "/index.php") {
        var mid = queryValue(urlInfo.query, "mid");
        if (mid && boardById(mid)) {
            return {
                board: boardById(mid),
                page: queryInt(urlInfo.query, "page", 1)
            };
        }
    }
    if (parts.length === 1 && boardById(parts[0])) {
        return {
            board: boardById(parts[0]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (urlInfo.path === "/" || urlInfo.path === "/index.php") {
        var mid = queryValue(urlInfo.query, "mid");
        var documentSrl = queryValue(urlInfo.query, "document_srl");
        if (mid && boardById(mid) && /^\d+$/.test(documentSrl)) {
            return {
                board: boardById(mid),
                postId: documentSrl
            };
        }
    }
    if (parts.length >= 2 && boardById(parts[0]) && /^\d+$/.test(parts[1])) {
        return {
            board: boardById(parts[0]),
            postId: parts[1]
        };
    }
    return null;
};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    return setPageParam(currentUrl, "page", nextPage);
};
SITE.buildPostFetchUrls = function (match, currentUrl) {
    return [
        "https://" + SYNURA.domain + "/?filter_mode=normal&mid=" + encodeURIComponent(match.board ? match.board.id : "") + "&document_srl=" + encodeURIComponent(match.postId || ""),
        "https://" + SYNURA.domain + "/index.php?filter_mode=normal&mid=" + encodeURIComponent(match.board ? match.board.id : "") + "&document_srl=" + encodeURIComponent(match.postId || ""),
        currentUrl
    ];
};
SITE.buildBoardUrlFromId = function (boardId) {
    var id = normalizeWhitespace(boardId);
    if (!id) return "";
    return "https://" + SYNURA.domain + "/" + encodeURIComponent(id) + "?filter_mode=normal";
};
SITE.loadDynamicBoards = function (options) {
    var allowNetwork = !(options && options.allowNetwork === false);
    var force = !!(options && options.force);
    var cached = theqooGetCachedDynamicBoards();
    if (!force && cached.length > 0) return cached;
    if (!allowNetwork) return cached;
    var synced = theqooSyncDynamicBoards();
    if (synced && synced.ok && Array.isArray(synced.items) && synced.items.length > 0) {
        return synced.items;
    }
    return cached;
};
SITE.prepareBoardContext = function (context, items, match, url) {
    return context;
};
SITE.filterAppendItems = function (items, state, routeContext) {
    return items || [];
};
SITE.updateAppendState = function (state, items, routeContext) {
    return state;
};
SITE.buildHomeMenus = function (menus, isReorderable) {
    return menus;
};
SITE.buildBoardSettingsRootMenus = function (menus, state) {
    return menus;
};
SITE.buildBoardMenus = function (menus, state) {
    return menus;
};
SITE.buildPostMenus = function (menus, state) {
    return menus;
};
SITE.routeBoardCustom = function (url, urlInfo, match, force) {
    return null;
};
SITE.routePostCustom = function (url, urlInfo, match, force) {
    return null;
};
SITE.parseComments = function (doc, postUrl) {
    return parseGenericComments(doc, postUrl);
};
SITE.fetchPostComments = function (match, url, doc, page, comments) {
    function theqooCommentDate(raw) {
        var value = normalizeWhitespace(raw);
        if (!/^\d{14}$/.test(value)) return value;
        return value.substring(0, 4) + "-" +
            value.substring(4, 6) + "-" +
            value.substring(6, 8) + " " +
            value.substring(8, 10) + ":" +
            value.substring(10, 12) + ":" +
            value.substring(12, 14);
    }

    function theqooCommentContent(html) {
        return parseMarkupDetails(html, url);
    }

    function theqooFetchCommentPage(pageNo) {
        var options = buildFetchOptions();
        if (!options.headers) options.headers = {};
        options.method = "POST";
        options.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
        options.headers["X-Requested-With"] = "XMLHttpRequest";
        options.headers["Referer"] = url;
        options.headers["Origin"] = "https://" + SYNURA.domain;
        options.body =
            "act=dispTheqooContentCommentListTheqoo" +
            "&document_srl=" + encodeURIComponent(match ? match.postId : "") +
            "&cpage=" + encodeURIComponent(String(pageNo));
        var response = fetchWithLogging("https://" + SYNURA.domain + "/index.php", options);
        if (!response || !response.ok) return null;
        return response.json() || null;
    }

    function theqooPushComments(data, bucket, seen) {
        var list = data && Array.isArray(data.comment_list) ? data.comment_list : [];
        for (var i = 0; i < list.length; i++) {
            var raw = list[i] || {};
            var commentId = normalizeWhitespace(raw.srl);
            if (!commentId || seen[commentId]) continue;
            var content = theqooCommentContent(raw.ct);
            if (!content || content.length === 0) continue;
            var author = normalizeWhitespace(raw.nn || "");
            if (!author) author = raw.is_writer == 1 ? "원덬" : "무명의 더쿠";
            else if (raw.is_writer == 1) author += " (원덬)";
            var likeCount = hideZeroCount(parseCount(firstNonEmpty([raw.voted_count, raw.vote, raw.like])));
            var reference = parseInt(String(raw.ind || "0"), 10);
            bucket.push({
                link: url + "#comment-" + commentId,
                author: author,
                content: content,
                date: theqooCommentDate(firstNonEmpty([raw.rd, raw.date])),
                likeCount: likeCount,
                dislikeCount: "",
                level: reference > 0 ? 1 : 0,
                menus: [],
                hotCount: toInt(likeCount, 0),
                coldCount: toInt(likeCount, 0)
            });
            seen[commentId] = true;
        }
    }

    var latest = theqooFetchCommentPage(0);
    if (!latest) return comments;

    var lastPage = parseInt(String(latest.now_comment_page || 1), 10);
    if (!(lastPage > 0)) lastPage = 1;

    var out = [];
    var seen = {};
    for (var pageNo = 1; pageNo < lastPage; pageNo++) {
        theqooPushComments(theqooFetchCommentPage(pageNo), out, seen);
    }
    theqooPushComments(latest, out, seen);
    return out.length > 0 ? out : comments;
};
SITE.handleViewEvent = function (viewId, event, state, context) {
    return false;
};
SITE.handleBoardSettingsRootEvent = function (viewId, event, state) {
    return false;
};

var SYNURA = {
    domain: "theqoo.net",
    name: "theqoo",
    description: "Unofficial theqoo.net extension",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://theqoo.net/files/attach/xeicon/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = ["^https://theqoo\\.net/[A-Za-z0-9_]+/\\d+"];
var LIST_LINK_SELECTORS = ["td.title a[href]","a[href]"];
var LIST_TITLE_SELECTORS = ["td.title",".title_span",".title"];
var LIST_AUTHOR_SELECTORS = [".name",".author",".writer"];
var LIST_AVATAR_SELECTORS = [];
var LIST_DATE_SELECTORS = [".date.el",".date"];
var LIST_COMMENT_COUNT_SELECTORS = ["a.reply.m-list-reply","a.replyNum",".replyNum",".reply"];
var LIST_VIEW_COUNT_SELECTORS = [".hit.el",".hit"];
var LIST_LIKE_COUNT_SELECTORS = [".voted_count",".vote"];
var LIST_CATEGORY_SELECTORS = [".cate",".category",".type"];
var LIST_IMAGE_SELECTORS = ["img"];

function extractListItem(row, baseUrl) {
    var linkNode = firstNode(row, LIST_LINK_SELECTORS);
    var titleNode = firstNode(row, LIST_TITLE_SELECTORS);
    var link = extractListLink(row, baseUrl, LIST_LINK_SELECTORS, LIST_LINK_ALLOW_PATTERNS);
    if (!link) return null;

    var title = firstNonEmpty([
        textOfNodeWithoutSelectors(titleNode, LIST_COMMENT_COUNT_SELECTORS),
        textOf(linkNode),
        textOf(row)
    ]);
    if (!title) return null;

    var commentCount = hideZeroCount(parseCount(firstText(row, LIST_COMMENT_COUNT_SELECTORS)));
    var viewCount = parseCount(firstText(row, LIST_VIEW_COUNT_SELECTORS));
    var likeCount = hideZeroCount(parseCount(firstText(row, LIST_LIKE_COUNT_SELECTORS)));
    var author = firstAuthorText(row, LIST_AUTHOR_SELECTORS);
    var category = firstText(row, LIST_CATEGORY_SELECTORS);
    var avatarSourceSelectors = LIST_AVATAR_SELECTORS.length > 0 ? LIST_AVATAR_SELECTORS : LIST_AUTHOR_SELECTORS;
    var avatar = imageUrlFromNode(firstNode(row, avatarSourceSelectors), baseUrl);
    var mediaUrl = imageUrlFromNode(firstNode(row, LIST_IMAGE_SELECTORS), baseUrl);
    var types = [];
    if (mediaUrl) types.push("image");

    return {
        link: normalizeUrl(link) || link,
        title: title,
        author: author,
        avatar: avatar,
        date: firstText(row, LIST_DATE_SELECTORS),
        category: category,
        commentCount: commentCount,
        viewCount: viewCount,
        likeCount: likeCount,
        mediaUrl: mediaUrl,
        mediaType: mediaUrl ? "image" : "",
        types: types,
        menus: [],
        hotCount: toInt(likeCount || viewCount || commentCount, 0),
        coldCount: toInt(viewCount || likeCount || commentCount, 0)
    };
}

var THEQOO_DYNAMIC_CACHE_KEY = CACHE_PREFIX + "dynamic:theqoo:v5";
var THEQOO_DYNAMIC_CACHE_TS_KEY = THEQOO_DYNAMIC_CACHE_KEY + ":ts";
var THEQOO_DYNAMIC_SKIP = {
    "notice": true,
    "about": true,
    "contact": true,
    "new_report": true,
    "test": true,
    "total": true
};
function theqooDecodeText(value) {
    var parser = new DOMParser();
    var doc = parser.parseFromString("<div id='theqoo-board-text'>" + String(value == null ? "" : value) + "</div>", "text/html");
    var root = doc.querySelector("#theqoo-board-text") || doc.body;
    return normalizeWhitespace(root ? (root.textContent || "") : "");
}
function theqooCleanMenuText(value) {
    var text = theqooDecodeText(value);
    if (!text) return "";
    text = text.replace(/^𝘯𝘦𝘸\s+/i, "");
    text = text
        .replace(/^[-=+>*#▷▶▸►◁◀◇◆•·\s]+/, "")
        .replace(/[-=+>*#▷▶▸►◁◀◇◆•·\s]+$/g, "")
        .trim();
    return text;
}
function theqooBoardUrl(boardId) {
    return "https://" + SYNURA.domain + "/" + encodeURIComponent(boardId) + "?filter_mode=normal";
}
function theqooPushBoard(items, seen, boardId, title, group) {
    if (!boardId || seen[boardId]) return;
    if (!title || title === "//") return;
    seen[boardId] = true;
    items.push({
        id: boardId,
        title: title,
        url: theqooBoardUrl(boardId),
        description: title,
        group: group,
        dynamic: true
    });
}
function theqooGetCachedDynamicBoards() {
    var cached = readStoredJson(THEQOO_DYNAMIC_CACHE_KEY, []);
    return Array.isArray(cached) ? dedupeBoards(cached) : [];
}
function theqooSaveDynamicBoards(items) {
    var nextItems = dedupeBoards(items || []);
    writeStoredJson(THEQOO_DYNAMIC_CACHE_KEY, nextItems);
    localStorage.setItem(THEQOO_DYNAMIC_CACHE_TS_KEY, String(Date.now()));
    return nextItems;
}
function theqooCollectDynamicBoardsFromJson(items, seen) {
    var response = fetchWithLogging("https://" + SYNURA.domain + "/files/board_search.json?version=", buildFetchOptions());
    var data = response && response.ok ? (response.json() || []) : [];
    if (!Array.isArray(data)) return;
    for (var i = 0; i < data.length; i++) {
        var raw = data[i] || {};
        var boardId = normalizeWhitespace(raw.mid);
        if (!/^[A-Za-z0-9_]+$/.test(boardId) || THEQOO_DYNAMIC_SKIP[boardId] || seen[boardId]) continue;
        var title = theqooCleanMenuText(firstNonEmpty([raw.original_name, raw.label, boardId]));
        if (!title) continue;
        var group = theqooCleanMenuText(raw.category || "");
        if (group === "신규카테") group = "신규";
        theqooPushBoard(items, seen, boardId, title, group);
    }
}
function theqooCollectDynamicBoardsFromHomepage(items, seen) {
    var doc = fetchDocument("https://" + SYNURA.domain + "/");
    var lists = allNodes(doc, ["#cate_index_pc ul.list"]);
    if (lists.length > 0) {
        for (var j = 0; j < lists.length; j++) {
            var group = theqooCleanMenuText(firstText(lists[j], [".cate_list_header", "li.cate_list_header"]));
            if (group === "신규카테") group = "신규";
            var links = lists[j].querySelectorAll("li.element a[href^='/']");
            for (var k = 0; k < links.length; k++) {
                var href = attrOf(links[k], "href");
                if (!href || href.indexOf("/index.php") === 0) continue;
                var abs = ensureAbsoluteUrl(href, "https://" + SYNURA.domain + "/");
                var info = parseAbsoluteUrl(abs);
                if (!info) continue;
                var parts = pathSegments(info.path);
                if (parts.length !== 1 || !parts[0] || /^\d+$/.test(parts[0])) continue;
                var boardId = normalizeWhitespace(parts[0]);
                if (!boardId || THEQOO_DYNAMIC_SKIP[boardId] || seen[boardId]) continue;
                var title = theqooCleanMenuText(firstNonEmpty([attrOf(links[k], "title"), textOf(links[k]), boardId]));
                if (!title) continue;
                theqooPushBoard(items, seen, boardId, title, group);
            }
        }
        return;
    }
    var fallbackLinks = allNodes(doc, ["#cate_index_pc a[href^='/']", "a[href^='/']"]);
    for (var m = 0; m < fallbackLinks.length; m++) {
        var fallbackHref = attrOf(fallbackLinks[m], "href");
        if (!fallbackHref || fallbackHref.indexOf("/index.php") === 0) continue;
        var fallbackAbs = ensureAbsoluteUrl(fallbackHref, "https://" + SYNURA.domain + "/");
        var fallbackInfo = parseAbsoluteUrl(fallbackAbs);
        if (!fallbackInfo) continue;
        var fallbackParts = pathSegments(fallbackInfo.path);
        if (fallbackParts.length !== 1 || !fallbackParts[0] || /^\d+$/.test(fallbackParts[0])) continue;
        var fallbackId = normalizeWhitespace(fallbackParts[0]);
        if (!fallbackId || THEQOO_DYNAMIC_SKIP[fallbackId] || seen[fallbackId]) continue;
        var fallbackTitle = theqooCleanMenuText(firstNonEmpty([attrOf(fallbackLinks[m], "title"), textOf(fallbackLinks[m]), fallbackId]));
        if (!fallbackTitle) continue;
        theqooPushBoard(items, seen, fallbackId, fallbackTitle, inferBoardGroupFromContext(fallbackLinks[m]));
    }
}
function theqooFetchDynamicBoards() {
    var items = [];
    var seen = {};
    try {
        theqooCollectDynamicBoardsFromJson(items, seen);
    } catch (e) {
    }
    try {
        theqooCollectDynamicBoardsFromHomepage(items, seen);
    } catch (e) {
    }
    return items;
}
function theqooSyncDynamicBoards() {
    var items = theqooFetchDynamicBoards();
    if (items.length > 0) {
        return {
            ok: true,
            items: theqooSaveDynamicBoards(items)
        };
    }
    return {
        ok: false,
        items: theqooGetCachedDynamicBoards()
    };
}
