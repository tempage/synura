// @ts-nocheck

var SITE = {
  "siteKey": "inven",
  "displayName": "인벤",
  "browserHomeUrl": "https://m.inven.co.kr/board/powerbbs.php?come_idx=2097",
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
  "defaultVisibleBoardIds": [],
  "hostAliases": [
    "inven.co.kr",
    "www.inven.co.kr"
  ],
  "challengeMarkers": [],
  "titleSuffixes": [
    " - 인벤",
    " : 인벤"
  ],
  "linkAllowPatterns": [
    "^https://m\\.inven\\.co\\.kr/board/[^/]+/\\d+/\\d+"
  ],
  "listBoardQueryParam": "",
  "boards": [
    {
      "id": "come_2097",
      "title": "오픈이슈갤러리",
      "url": "/board/powerbbs.php?come_idx=2097",
      "description": "대표 이슈 게시판"
    },
    {
      "id": "come_2631",
      "title": "PC 견적 게시판",
      "url": "/board/powerbbs.php?come_idx=2631"
    },
    {
      "id": "come_2898",
      "title": "코스프레 갤러리",
      "url": "/board/powerbbs.php?come_idx=2898"
    },
    {
      "id": "come_3499",
      "title": "(19)무인도는 첨이지?",
      "url": "/board/powerbbs.php?come_idx=3499"
    },
    {
      "id": "come_3715",
      "title": "지름/개봉 갤러리",
      "url": "/board/powerbbs.php?come_idx=3715"
    },
    {
      "id": "come_1565",
      "title": "게이머 토론장",
      "url": "/board/powerbbs.php?come_idx=1565"
    },
    {
      "id": "come_1288",
      "title": "게임 추천/소감",
      "url": "/board/powerbbs.php?come_idx=1288"
    },
    {
      "id": "come_3558",
      "title": "무엇이든 물어보세요",
      "url": "/board/powerbbs.php?come_idx=3558"
    },
    {
      "id": "come_762",
      "title": "최근 논란중인 이야기",
      "url": "/board/powerbbs.php?come_idx=762"
    },
    {
      "id": "come_2887",
      "title": "카툰 갤러리",
      "url": "/board/powerbbs.php?come_idx=2887"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".boardTitle",
      ".title",
      "title"
    ],
    "listRows": [
      "a.contentLink"
    ],
    "listLink": [],
    "listTitle": [
      ".subject",
      ".tit"
    ],
    "listAuthor": [
      ".nick"
    ],
    "listDate": [
      ".date"
    ],
    "listCommentCount": [
      ".cmt",
      ".comment"
    ],
    "listViewCount": [
      ".view"
    ],
    "listLikeCount": [
      ".reco"
    ],
    "listCategory": [
      ".cate"
    ],
    "listImage": [
      "img"
    ],
    "postTitle": [
      "#articleSubject",
      "h1",
      "title"
    ],
    "postAuthor": [
      "#article-writer",
      ".article-writer",
      ".writer",
      ".nick"
    ],
    "postDate": [
      ".date",
      "time"
    ],
    "postViewCount": [
      ".hit"
    ],
    "postLikeCount": [
      ".reco"
    ],
    "postCategory": [
      ".boardName",
      ".cate"
    ],
    "postContent": [
      ".bbs-con.articleContent.boardContent",
      ".articleContent.boardContent",
      ".boardContent"
    ],
    "commentRows": [
      "#powerbbsCmt2 .cmtOne",
      ".commentList1 .cmtOne",
      ".bestComment .cmtOne",
      ".cmtOne",
      "#i-comment-list .cmtOne"
    ],
    "commentAuthor": [
      ".nickname",
      ".nick",
      ".writer",
      ".name"
    ],
    "commentContent": [
      "div.comment > span.content",
      "div.comment .content",
      ".commentText",
      ".memo",
      "div.comment",
      ".content"
    ],
    "commentDate": [
      ".date",
      "time"
    ],
    "commentLikeCount": [
      ".reco",
      ".recommend",
      ".dice"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": [],
  "boardGroupMap": {
    "come_2097": "이슈",
    "come_2631": "정보",
    "come_2898": "창작",
    "come_3499": "기타",
    "come_3715": "쇼핑",
    "come_1565": "게임",
    "come_1288": "게임",
    "come_3558": "질문",
    "come_762": "이슈",
    "come_2887": "창작"
  }
};
SITE.matchBoard = function (urlInfo) {
    if (urlInfo.path === "/board/powerbbs.php") {
        var comeIdx = queryValue(urlInfo.query, "come_idx");
        if (comeIdx) {
            return {
                board: ensureBoard("come_" + comeIdx, "https://" + SYNURA.domain + "/board/powerbbs.php?come_idx=" + comeIdx, "게시판 " + comeIdx),
                page: queryInt(urlInfo.query, "p", 1)
            };
        }
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length >= 4 && parts[0] === "board" && /^\d+$/.test(parts[2]) && /^\d+$/.test(parts[3])) {
        return {
            board: ensureBoard("come_" + parts[2], "https://" + SYNURA.domain + "/board/powerbbs.php?come_idx=" + parts[2], "게시판 " + parts[2]),
            postId: parts[3]
        };
    }
    return null;
};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    return setPageParam(currentUrl, "p", nextPage);
};
SITE.buildPostFetchUrls = function (match, currentUrl) {
    return [currentUrl];
};
SITE.buildBoardUrlFromId = function (boardId) {
    return "";
};
SITE.loadDynamicBoards = function (options) {
    var allowNetwork = !(options && options.allowNetwork === false);
    var force = !!(options && options.force);
    var cacheKey = CACHE_PREFIX + "dynamic:inven:v2";
    var cacheTsKey = cacheKey + ":ts";
    var cached = readStoredJson(cacheKey, []);
    var cachedTs = parseInt(String(localStorage.getItem(cacheTsKey) || "0"), 10) || 0;
    if (!force && Array.isArray(cached) && cached.length > 0 && (Date.now() - cachedTs) < 21600000) {
        return cached;
    }
    var skip = {
        "글쓰기": true,
        "전체": true,
        "내글": true,
        "내 댓글": true,
        "다음": true,
        "로그인": true,
        "퀵링크": true,
        "설정": true
    };
    if (!allowNetwork) return Array.isArray(cached) ? cached : [];
    try {
        var doc = fetchDocument(SITE.browserHomeUrl);
        var links = allNodes(doc, ["a[href*='powerbbs.php?come_idx=']"]);
        var items = [];
        var seen = {};
        for (var i = 0; i < links.length; i++) {
            var href = ensureAbsoluteUrl(attrOf(links[i], "href"), SITE.browserHomeUrl);
            var info = parseAbsoluteUrl(href);
            if (!info) continue;
            var comeIdx = queryValue(info.query, "come_idx");
            if (!comeIdx || seen[comeIdx]) continue;
            var title = normalizeWhitespace(textOf(links[i]));
            if (!title || skip[title]) continue;
            seen[comeIdx] = true;
            items.push({
                id: "come_" + comeIdx,
                title: title,
                url: "https://" + SYNURA.domain + "/board/powerbbs.php?come_idx=" + encodeURIComponent(comeIdx),
                description: title,
                group: inferBoardGroupFromContext(links[i]),
                dynamic: true
            });
        }
        if (items.length > 0) {
            writeStoredJson(cacheKey, items);
            localStorage.setItem(cacheTsKey, String(Date.now()));
            return items;
        }
    } catch (e) {
    }
    return Array.isArray(cached) ? cached : [];
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
    function invenExtractSettingValue(name) {
        var html = page && page.response ? page.response.text() : "";
        if (!html) return "";
        var quoted = new RegExp(name + "\\s*:\\s*'([^']*)'", "i");
        var quotedMatch = html.match(quoted);
        if (quotedMatch && quotedMatch[1]) return normalizeWhitespace(quotedMatch[1]);
        var numeric = new RegExp(name + "\\s*:\\s*(\\d+)", "i");
        var numericMatch = html.match(numeric);
        if (numericMatch && numericMatch[1]) return normalizeWhitespace(numericMatch[1]);
        return "";
    }

    function invenCollectHtmlCandidates(value, bucket, depth) {
        if (depth > 5 || value == null) return;
        if (typeof value === "string") {
            var raw = String(value || "");
            if (raw.indexOf("cmtOne") >= 0 || raw.indexOf("commentList1") >= 0 || raw.indexOf("powerbbsCmt2") >= 0) {
                bucket.push(raw);
            }
            return;
        }
        if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                invenCollectHtmlCandidates(value[i], bucket, depth + 1);
            }
            return;
        }
        if (typeof value === "object") {
            for (var key in value) {
                if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
                invenCollectHtmlCandidates(value[key], bucket, depth + 1);
            }
        }
    }

    function invenParseCommentContent(rawHtml) {
        var source = String(rawHtml || "");
        if (!source) return [];
        if (source.indexOf("&") >= 0) {
            for (var pass = 0; pass < 3; pass++) {
                if (source.indexOf("&lt;") < 0 && source.indexOf("&#") < 0 && source.indexOf("&nbsp;") < 0 && source.indexOf("&amp;") < 0) {
                    break;
                }
                var decodeParser = new DOMParser();
                var decodeDoc = decodeParser.parseFromString("<div id='synura-inven-comment-decode'>" + source + "</div>", "text/html");
                var decodeRoot = decodeDoc.querySelector("#synura-inven-comment-decode") || decodeDoc.body;
                var decoded = decodeRoot ? String(decodeRoot.textContent || "") : "";
                if (!decoded || decoded === source) break;
                source = decoded;
            }
        }
        source = source
            .replace(/\u00a0/g, " ")
            .replace(/&amp;nbsp;/gi, " ")
            .replace(/&nbsp;/gi, " ");
        return parseMarkupDetails(source, url);
    }

    function invenParseJsonComments(data) {
        var groups = data && Array.isArray(data.commentlist) ? data.commentlist : [];
        var out = [];
        for (var i = 0; i < groups.length; i++) {
            var rows = groups[i] && Array.isArray(groups[i].list) ? groups[i].list : [];
            for (var j = 0; j < rows.length; j++) {
                var row = rows[j] || {};
                var attr = row.__attr__ || {};
                var commentId = normalizeWhitespace(firstNonEmpty([attr.cmtidx, row.cmtidx]));
                var parentId = normalizeWhitespace(firstNonEmpty([attr.cmtpidx, row.cmtpidx]));
                var content = invenParseCommentContent(row.o_comment);
                if (!commentId || !content || content.length === 0) continue;
                var likeCount = hideZeroCount(parseCount(firstNonEmpty([row.o_recommend, row.recommend, row.like])));
                out.push({
                    link: url + "#comment-" + commentId,
                    author: normalizeWhitespace(firstNonEmpty([row.o_name, row.name, row.nick])),
                    content: content,
                    date: normalizeWhitespace(firstNonEmpty([row.o_date, row.date])),
                    likeCount: likeCount,
                    dislikeCount: parseCount(firstNonEmpty([row.o_notrecommend, row.notrecommend, row.dislike])),
                    level: parentId && commentId && parentId !== commentId ? 1 : 0,
                    menus: [],
                    hotCount: toInt(likeCount, 0),
                    coldCount: 0
                });
            }
        }
        return out;
    }

    function invenParseCommentHtml(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString("<div id='synura-inven-comment'>" + String(html || "") + "</div>", "text/html");
        var parsed = parseComments(doc, url);
        if (parsed && parsed.length > 0) return parsed;

        var rows = doc.querySelectorAll(".cmtOne");
        var out = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var contentRoot = row.querySelector("div.comment > span.content") ||
                row.querySelector("div.comment .content") ||
                row.querySelector("div.comment") ||
                row.querySelector(".content");
            var content = parseDetails(contentRoot, url);
            if ((!content || content.length === 0) && contentRoot) {
                var text = normalizeWhitespace(contentRoot.textContent || "");
                if (text) content = [{ type: "text", value: text }];
            }
            if (!content || content.length === 0) continue;
            var authorNode = row.querySelector(".nickname, .nick, .writer, .name");
            var dateNode = row.querySelector(".date, time");
            var likeNode = row.querySelector(".reco, .recommend, .dice");
            out.push({
                link: url + "#comment-" + (i + 1),
                author: normalizeWhitespace(authorNode ? authorNode.textContent : ""),
                content: content,
                date: normalizeWhitespace(dateNode ? dateNode.textContent : ""),
                likeCount: hideZeroCount(parseCount(normalizeWhitespace(likeNode ? likeNode.textContent : ""))),
                dislikeCount: "",
                level: row.classList && row.classList.contains("reply") ? 1 : 0,
                menus: [],
                hotCount: 0,
                coldCount: 0
            });
        }
        return out;
    }

    function invenDedupComments(items) {
        var out = [];
        var seen = {};
        for (var i = 0; i < (items || []).length; i++) {
            var item = items[i];
            if (!item) continue;
            var key = [
                normalizeWhitespace(item.author || ""),
                normalizeWhitespace(item.date || ""),
                normalizeWhitespace(item.content && item.content[0] ? item.content[0].value : "")
            ].join("|");
            if (!key || seen[key]) continue;
            seen[key] = true;
            item.link = url + "#comment-" + (out.length + 1);
            out.push(item);
        }
        return out;
    }

    var comeIdx = invenExtractSettingValue("comeidx") || (match && match.board ? String(match.board.id || "").replace(/^come_/, "") : "");
    var articleCode = invenExtractSettingValue("articlecode") || (match ? String(match.postId || "") : "");
    var customNum = invenExtractSettingValue("customNum");
    var commentPos = invenExtractSettingValue("commentPos") || "m";
    var iskin = invenExtractSettingValue("iskin") || "webzine";
    if (!comeIdx || !articleCode || !customNum) return comments;

    var options = buildFetchOptions();
    if (!options.headers) options.headers = {};
    options.method = "POST";
    options.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
    options.headers["X-Requested-With"] = "XMLHttpRequest";
    options.headers["Referer"] = url;
    options.headers["Origin"] = "https://www.inven.co.kr";
    options.body = [
        "comeidx=" + encodeURIComponent(comeIdx),
        "articlecode=" + encodeURIComponent(articleCode),
        "cmtcodes=" + encodeURIComponent(customNum),
        "titles=",
        "listoption=" + encodeURIComponent("date"),
        "commentPos=" + encodeURIComponent(commentPos),
        "iskin=" + encodeURIComponent(iskin),
        "date=" + encodeURIComponent(String(Date.now()))
    ].join("&");

    var response = fetchWithLogging("https://www.inven.co.kr/common/board/comment.json.php", options);
    if (!response || !response.ok) return comments;

    var rawText = response.text();
    if (!rawText) return comments;
    var parsedData = null;
    try {
        parsedData = JSON.parse(rawText);
    } catch (e) {
    }

    if (parsedData) {
        var parsedComments = invenDedupComments(invenParseJsonComments(parsedData));
        if (parsedComments.length > 0) return parsedComments;
    }

    var htmlCandidates = [];
    if (parsedData) invenCollectHtmlCandidates(parsedData, htmlCandidates, 0);
    if (htmlCandidates.length === 0) htmlCandidates.push(rawText);

    var out = [];
    for (var i = 0; i < htmlCandidates.length; i++) {
        out = out.concat(invenParseCommentHtml(htmlCandidates[i]));
    }
    out = invenDedupComments(out);
    return out.length > 0 ? out : comments;
};
SITE.handleViewEvent = function (viewId, event, state, context) {
    return false;
};
SITE.handleBoardSettingsRootEvent = function (viewId, event, state) {
    return false;
};

var SYNURA = {
    domain: "m.inven.co.kr",
    name: "inven",
    description: "Unofficial Synura extension for Inven mobile boards.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://m.inven.co.kr/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = ["^https://m\\.inven\\.co\\.kr/board/[^/]+/\\d+/\\d+"];
var LIST_LINK_SELECTORS = [];
var LIST_TITLE_SELECTORS = [".subject",".tit"];
var LIST_AUTHOR_SELECTORS = [".nick"];
var LIST_AVATAR_SELECTORS = [];
var LIST_DATE_SELECTORS = [".date"];
var LIST_COMMENT_COUNT_SELECTORS = [".cmt",".comment"];
var LIST_VIEW_COUNT_SELECTORS = [".view"];
var LIST_LIKE_COUNT_SELECTORS = [".reco"];
var LIST_CATEGORY_SELECTORS = [".cate"];
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
