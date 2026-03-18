// @ts-nocheck

var SITE = {
  "siteKey": "arca",
  "displayName": "아카라이브",
  "browserHomeUrl": "https://arca.live/b/live",
  "browserCookieAuth": true,
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
  "hasFullBoardCatalog": true,
  "supportsBoardCatalogSync": false,
  "defaultVisibleBoardIds": [],
  "hostAliases": [
    "www.arca.live"
  ],
  "challengeMarkers": [],
  "titleSuffixes": [
    " - 아카라이브",
    " : 아카라이브"
  ],
  "linkAllowPatterns": [
    "^https://arca\\.live/b/[^/]+/\\d+"
  ],
  "listBoardQueryParam": "",
  "hotThreshold": 7000,
  "coldThreshold": 70,
  "commentHotThreshold": 10,
  "commentColdThreshold": 3,
  "boards": [
    {
      "id": "live",
      "title": "실시간",
      "url": "/b/live",
      "description": "실시간 인기",
      "hotThreshold": 10000,
      "coldThreshold": 100
    },
    {
      "id": "hotdeal",
      "title": "핫딜",
      "url": "/b/hotdeal",
      "description": "핫딜 게시판"
    },
    {
      "id": "headline",
      "title": "헤드라인",
      "url": "/b/headline"
    },
    {
      "id": "singbung",
      "title": "싱글벙글",
      "url": "/b/singbung",
      "description": "싱글벙글 게시판"
    },
    {
      "id": "humor",
      "title": "유머",
      "url": "/b/humor",
      "description": "유머 게시판"
    },
    {
      "id": "aiart",
      "title": "AI 그림",
      "url": "/b/aiart",
      "description": "AI 그림 게시판"
    },
    {
      "id": "genshin",
      "title": "원신",
      "url": "/b/genshin",
      "description": "원신 채널"
    },
    {
      "id": "bluearchive",
      "title": "블루 아카이브",
      "url": "/b/bluearchive",
      "description": "블루 아카이브 채널"
    },
    {
      "id": "starrail",
      "title": "붕괴: 스타레일",
      "url": "/b/starrail",
      "description": "붕괴: 스타레일 채널"
    },
    {
      "id": "zenlesszonezero",
      "title": "젠레스 존 제로",
      "url": "/b/zenlesszonezero",
      "description": "젠레스 존 제로 채널"
    },
    {
      "id": "hololive",
      "title": "홀로라이브",
      "url": "/b/hololive",
      "description": "홀로라이브 채널"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".board-title",
      ".title",
      "title"
    ],
    "listRows": [
      ".article-list .vrow.hybrid",
      ".article-list .vrow"
    ],
    "listLink": [
      ".title.hybrid-title",
      ".title",
      "a[href]"
    ],
    "listTitle": [
      ".title.hybrid-title",
      ".title"
    ],
    "listAuthor": [
      ".user-info",
      ".name",
      ".author"
    ],
    "listDate": [
      ".col-time time",
      ".col-time",
      "time"
    ],
    "listCommentCount": [
      ".comment-count"
    ],
    "listViewCount": [
      ".col-view",
      ".view"
    ],
    "listLikeCount": [
      ".col-rate",
      ".col-vote",
      ".vote"
    ],
    "listCategory": [
      ".badge",
      ".category"
    ],
    "listImage": [
      "img"
    ],
    "postTitle": [
      ".article-head .title",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".article-head .user-info",
      ".user-info",
      ".author"
    ],
    "postDate": [
      ".article-info time",
      ".article-info .time",
      "time"
    ],
    "postViewCount": [
      ".article-info .view",
      ".view"
    ],
    "postLikeCount": [
      "#ratingUp",
      ".article-info .vote",
      ".vote"
    ],
    "postCategory": [
      ".article-head .badge",
      ".badge"
    ],
    "postContent": [
      ".fr-view.article-content",
      ".article-content"
    ],
    "commentRows": [
      ".comment-item",
      ".comment-list li"
    ],
    "commentAuthor": [
      ".user-info",
      ".name",
      ".author"
    ],
    "commentContent": [
      ".content",
      ".comment-content",
      ".message"
    ],
    "commentDate": [
      "time",
      ".date"
    ],
    "commentLikeCount": [
      ".vote",
      ".like"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": [],
  "boardGroupMap": {
    "live": "인기",
    "hotdeal": "핫딜",
    "headline": "인기",
    "singbung": "유머",
    "humor": "유머",
    "aiart": "AI",
    "genshin": "게임",
    "bluearchive": "게임",
    "starrail": "게임",
    "zenlesszonezero": "게임",
    "hololive": "VTuber"
  }
};
SITE.matchBoard = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length === 2 && parts[0] === "b" && !/^\d+$/.test(parts[1])) {
        return {
            board: ensureBoard(parts[1], "https://" + SYNURA.domain + "/b/" + parts[1], parts[1]),
            page: queryInt(urlInfo.query, "p", 1)
        };
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length >= 3 && parts[0] === "b" && !/^\d+$/.test(parts[1]) && /^\d+$/.test(parts[2])) {
        return {
            board: ensureBoard(parts[1], "https://" + SYNURA.domain + "/b/" + parts[1], parts[1]),
            postId: parts[2]
        };
    }
    return null;
};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    return setPageParam(currentUrl, "p", nextPage);
};
SITE.isAuthRequiredResponse = function (url, status, html) {
    var body = String(html || "").toLowerCase();
    if (status === 429 || status === 430) {
        return true;
    }
    return body.indexOf("id=\"hcaptcha-form\"") >= 0 ||
        body.indexOf("window.hcaptchacallback") >= 0 ||
        body.indexOf("class=\"h-captcha\"") >= 0 ||
        body.indexOf("비정상적인 접속을 감지했습니다.") >= 0;
};
SITE.buildPostFetchUrls = function (match, currentUrl) {
    return [currentUrl];
};
SITE.buildBoardUrlFromId = function (boardId) {
    var normalized = normalizeWhitespace(boardId);
    return normalized ? ("https://" + SYNURA.domain + "/b/" + encodeURIComponent(normalized)) : "";
};
SITE.loadDynamicBoards = function () {
    return [];
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
function arcaAttachImageHeaders(details, refererUrl) {
    var referer = normalizeUrl(refererUrl) || "";
    var cookie = getSavedCookie();
    if (!details || !details.length) return details || [];
    for (var i = 0; i < details.length; i++) {
        var item = details[i];
        var value = normalizeUrl(item && item.value) || "";
        if (!item || item.type !== "image" || !/^https?:\/\//i.test(value)) continue;
        var headers = item.headers || {};
        if (referer && !headers.Referer && !headers.referer) headers.Referer = referer;
        if (cookie && !headers.Cookie && !headers.cookie) headers.Cookie = cookie;
        item.headers = headers;
    }
    return details;
}
function arcaTrimText(value) {
    return String(value == null ? "" : value)
        .replace(/\r/g, "")
        .replace(/^[\s\u00a0]+|[\s\u00a0]+$/g, "");
}
function arcaLineLooksLikeDate(line, dateText) {
    var normalized = normalizeWhitespace(line);
    if (!normalized) return false;
    if (dateText && normalized === normalizeWhitespace(dateText)) return true;
    return /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?::\d{2})?$/.test(normalized) ||
        /^\d{1,2}:\d{2}(?::\d{2})?$/.test(normalized);
}
function arcaStripCommentText(value, dateText) {
    var lines = String(value == null ? "" : value).replace(/\r/g, "").split(/\n/);
    var kept = [];
    var skippedDate = false;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var normalized = normalizeWhitespace(line);
        if (!normalized) {
            if (kept.length > 0 && i < lines.length - 1) kept.push("");
            continue;
        }
        if (!skippedDate && arcaLineLooksLikeDate(normalized, dateText)) {
            skippedDate = true;
            continue;
        }
        if (/^(?:펼쳐보기\s*[▼▽]?|접기\s*[▲△]?)$/.test(normalized)) continue;
        kept.push(arcaTrimText(line));
    }
    return arcaTrimText(kept.join("\n").replace(/\n{3,}/g, "\n\n"));
}
function arcaCommentBodyNode(row) {
    return firstNode(row, [
        ".comment-content .message",
        ".comment-content .fr-view",
        ".comment-content .body",
        ".comment-content",
        ".content .message",
        ".content .fr-view",
        ".message",
        ".fr-view",
        ".content"
    ]);
}
function arcaSanitizeCommentRoot(row) {
    var root = arcaCommentBodyNode(row);
    if (!root || !root.cloneNode) return root;
    var clone = root.cloneNode(true);
    var selectors = [
        ".user-info",
        ".profile",
        ".avatar",
        ".author",
        ".name",
        ".info",
        ".meta",
        ".comment-info",
        ".comment-header",
        ".comment-control",
        ".control",
        ".buttons",
        ".btn-area",
        ".reply-menu",
        "time",
        ".date",
        ".comment-date",
        ".comment-time",
        "button"
    ];
    for (var i = 0; i < selectors.length; i++) {
        var nodes = clone.querySelectorAll(selectors[i]);
        for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            if (node && node.parentNode) node.parentNode.removeChild(node);
        }
    }
    return clone;
}
function arcaLooksLikeProfileLink(item, author) {
    var href = normalizeWhitespace(item && item.link);
    if (!/\/u\/@/i.test(href)) return false;
    var text = normalizeWhitespace(item && item.value);
    var normalizedAuthor = normalizeWhitespace(author);
    return !normalizedAuthor || text === normalizedAuthor;
}
function arcaLooksLikeLeadingProfileLink(details, index, item, author, dateText) {
    if (!arcaLooksLikeProfileLink(item, author)) return false;
    var next = index + 1 < details.length ? details[index + 1] : null;
    var next2 = index + 2 < details.length ? details[index + 2] : null;
    if (next && next.type === "text" && arcaLineLooksLikeDate(next.value, dateText)) return true;
    if (next && next.type === "image" && next2 && next2.type === "text" && arcaLineLooksLikeDate(next2.value, dateText)) return true;
    return normalizeWhitespace(item && item.value) === normalizeWhitespace(author);
}
function arcaLooksLikeLeadingAvatar(details, index, item, avatar, dateText) {
    if (!item || item.type !== "image") return false;
    var value = normalizeWhitespace(item.value);
    var normalizedAvatar = normalizeWhitespace(avatar);
    if (normalizedAvatar && value && value === normalizedAvatar) return true;
    var prev = index > 0 ? details[index - 1] : null;
    var next = index + 1 < details.length ? details[index + 1] : null;
    if (prev && prev.type === "link" && arcaLooksLikeProfileLink(prev, "") && next && next.type === "text") {
        return arcaLineLooksLikeDate(next.value, dateText);
    }
    return false;
}
function arcaCloneDetail(item) {
    var copy = {};
    for (var key in item) {
        if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
        copy[key] = item[key];
    }
    return copy;
}
function arcaCleanCommentDetails(details, author, avatar, dateText) {
    var cleaned = [];
    var seenMedia = {};
    for (var i = 0; i < (details || []).length; i++) {
        var item = details[i];
        if (!item || !item.type) continue;
        var type = String(item.type);
        if (cleaned.length === 0 && type === "link" && arcaLooksLikeLeadingProfileLink(details, i, item, author, dateText)) {
            continue;
        }
        if (cleaned.length === 0 && type === "image" && arcaLooksLikeLeadingAvatar(details, i, item, avatar, dateText)) {
            continue;
        }
        var copy = arcaCloneDetail(item);
        if (type === "text") {
            copy.value = arcaStripCommentText(copy.value, dateText);
            if (!copy.value) continue;
            cleaned.push(copy);
            continue;
        }
        if (type === "image" || type === "video") {
            var key = type + "|" + normalizeWhitespace(copy.value);
            if (!copy.value || seenMedia[key]) continue;
            seenMedia[key] = true;
            cleaned.push(copy);
            continue;
        }
        if (type === "link" && !normalizeWhitespace(copy.value) && !normalizeWhitespace(copy.link)) continue;
        cleaned.push(copy);
    }
    return cleaned;
}
SITE.parseComments = function (doc, postUrl) {
    var rows = allNodes(doc, SITE.selectors.commentRows);
    var comments = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var author = firstAuthorText(row, SITE.selectors.commentAuthor);
        var avatar = imageUrlFromNode(firstNode(row, [
            ".user-info img",
            ".profile img",
            ".avatar img",
            ".thumb img",
            ".comment-profile img",
            ".comment-avatar img"
        ]), postUrl);
        var dateText = firstNonEmpty([
            attrOf(firstNode(row, ["time"]), "datetime"),
            firstText(row, SITE.selectors.commentDate)
        ]);
        var contentRoot = arcaSanitizeCommentRoot(row);
        var content = arcaCleanCommentDetails(parseDetails(contentRoot, postUrl), author, avatar, dateText);
        if ((!content || content.length === 0) && contentRoot) {
            var fallback = arcaStripCommentText(textOf(contentRoot), dateText);
            if (fallback) content = [{ type: "text", value: fallback }];
        }
        if (!content || content.length === 0) continue;
        content = arcaAttachImageHeaders(content, postUrl);

        var likeCount = hideZeroCount(parseCount(firstText(row, SITE.selectors.commentLikeCount)));
        var rowId = firstNonEmpty([
            attrOf(row, "id"),
            attrOf(row, "data-id"),
            attrOf(row, "data-comment-id"),
            attrOf(row, "data-comment-sn"),
            "comment-" + (i + 1)
        ]);
        comments.push({
            link: postUrl + "#" + rowId,
            author: author,
            avatar: avatar,
            content: content,
            date: firstText(row, SITE.selectors.commentDate),
            likeCount: likeCount,
            dislikeCount: "",
            level: detectCommentLevel(row),
            menus: [],
            hotCount: toInt(likeCount, 0),
            coldCount: 0
        });
    }
    return comments;
};
SITE.filterPostContent = arcaAttachImageHeaders;
SITE.fetchPostComments = function (match, url, doc, page, comments) {
    return comments;
};
SITE.handleViewEvent = function (viewId, event, state, context) {
    return false;
};
SITE.handleBoardSettingsRootEvent = function (viewId, event, state) {
    return false;
};

var SYNURA = {
    domain: "arca.live",
    name: "arca",
    description: "Unofficial arca.live extension",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://arca.live/static/favicon-192.png",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = ["^https://arca\\.live/b/[^/]+/\\d+"];
var LIST_LINK_SELECTORS = [".title.hybrid-title",".title","a[href]"];
var LIST_TITLE_SELECTORS = [".title.hybrid-title",".title"];
var LIST_TITLE_EXCLUDE_SELECTORS = [".comment-count",".info"];
var LIST_AUTHOR_SELECTORS = [".user-info",".name",".author"];
var LIST_AVATAR_SELECTORS = [];
var LIST_DATE_SELECTORS = [".col-time time",".col-time","time"];
var LIST_COMMENT_COUNT_SELECTORS = [".comment-count"];
var LIST_VIEW_COUNT_SELECTORS = [".col-view",".view"];
var LIST_LIKE_COUNT_SELECTORS = [".col-rate",".col-vote",".vote"];
var LIST_CATEGORY_SELECTORS = [".badge",".category"];
var LIST_IMAGE_SELECTORS = ["img"];

function extractListItem(row, baseUrl) {
    var linkSelectors = selectorList("listLink", LIST_LINK_SELECTORS);
    var titleSelectors = selectorList("listTitle", LIST_TITLE_SELECTORS);
    var titleExcludeSelectors = selectorList("listTitleExclude", LIST_TITLE_EXCLUDE_SELECTORS);
    var commentCountSelectors = selectorList("listCommentCount", LIST_COMMENT_COUNT_SELECTORS);
    var viewCountSelectors = selectorList("listViewCount", LIST_VIEW_COUNT_SELECTORS);
    var likeCountSelectors = selectorList("listLikeCount", LIST_LIKE_COUNT_SELECTORS);
    var authorSelectors = selectorList("listAuthor", LIST_AUTHOR_SELECTORS);
    var avatarSelectors = selectorList("listAvatar", LIST_AVATAR_SELECTORS);
    var imageSelectors = selectorList("listImage", LIST_IMAGE_SELECTORS);
    var categorySelectors = selectorList("listCategory", LIST_CATEGORY_SELECTORS);
    var dateSelectors = selectorList("listDate", LIST_DATE_SELECTORS);
    var linkNode = firstNode(row, linkSelectors);
    var titleNode = firstNode(row, titleSelectors);
    var link = extractListLink(row, baseUrl, linkSelectors, LIST_LINK_ALLOW_PATTERNS);
    if (!link) return null;

    var title = firstNonEmpty([
        textOfNodeWithoutSelectors(titleNode, titleExcludeSelectors),
        textOf(linkNode),
        textOf(row)
    ]);
    title = normalizeWhitespace(String(title || "").replace(/\s*\[\d+\]\s*$/, ""));
    if (!title) return null;

    var commentCount = hideZeroCount(parseCount(firstText(row, commentCountSelectors)));
    var viewCount = parseCount(firstText(row, viewCountSelectors));
    var likeCount = hideZeroCount(parseCount(firstText(row, likeCountSelectors)));
    var author = firstAuthorText(row, authorSelectors);
    var category = firstText(row, categorySelectors);
    var avatarSourceSelectors = avatarSelectors.length > 0 ? avatarSelectors : authorSelectors;
    var avatar = imageUrlFromNode(firstNode(row, avatarSourceSelectors), baseUrl);
    var mediaUrl = imageUrlFromNode(firstNode(row, imageSelectors), baseUrl);
    var types = [];
    if (mediaUrl) types.push("image");

    return {
        link: normalizeUrl(link) || link,
        title: title,
        author: author,
        avatar: avatar,
        date: firstText(row, dateSelectors),
        category: category,
        commentCount: commentCount,
        viewCount: viewCount,
        likeCount: likeCount,
        mediaUrl: mediaUrl,
        mediaType: mediaUrl ? "image" : "",
        types: types,
        menus: [],
        hotCount: toInt(viewCount || likeCount || commentCount, 0),
        coldCount: toInt(likeCount || commentCount, 0)
    };
}
