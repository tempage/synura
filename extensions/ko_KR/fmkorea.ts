// @ts-nocheck

var SITE = {
  "siteKey": "fmkorea",
  "displayName": "에펨코리아",
  "browserHomeUrl": "https://www.fmkorea.com/best",
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
  "hasFullBoardCatalog": false,
  "supportsBoardCatalogSync": false,
  "defaultVisibleBoardIds": [],
  "hostAliases": [
    "fmkorea.com",
    "www.fmkorea.com"
  ],
  "challengeMarkers": [
    "에펨코리아 보안 시스템",
    "/mc/mc.php"
  ],
  "titleSuffixes": [
    " - 에펨코리아",
    " - FMKorea.com",
    " : 에펨코리아"
  ],
  "linkAllowPatterns": [
    "^https://(?:www\\.)?fmkorea\\.com/(?:[A-Za-z0-9_]+/)?\\d+(?:\\?|$)",
    "^https://(?:www\\.)?fmkorea\\.com/index\\.php\\?[^#]*document_srl=\\d+(?:[&#]|$)"
  ],
  "listBoardQueryParam": "",
  "hotThreshold": 10000,
  "coldThreshold": 100,
  "commentHotThreshold": 10,
  "commentColdThreshold": 3,
  "boards": [
    {
      "id": "slug_best",
      "title": "포텐",
      "url": "/best",
      "description": "베스트",
      "hotThreshold": 15000,
      "coldThreshold": 150
    },
    {
      "id": "slug_best2",
      "title": "실시간 인기",
      "url": "/best2",
      "description": "실시간 인기",
      "hotThreshold": 15000,
      "coldThreshold": 150
    },
    {
      "id": "mid_politics",
      "title": "정치/시사",
      "url": "/index.php?mid=politics",
      "description": "정치/시사 게시판"
    },
    {
      "id": "slug_humor",
      "title": "유머",
      "url": "/humor",
      "description": "유머 게시판"
    },
    {
      "id": "slug_mystery",
      "title": "미스터리",
      "url": "/mystery",
      "description": "미스터리 게시판"
    },
    {
      "id": "slug_football_korean",
      "title": "국내축구",
      "url": "/football_korean",
      "description": "국내축구 게시판"
    },
    {
      "id": "slug_football_news",
      "title": "해외축구",
      "url": "/football_news",
      "description": "해외축구 게시판"
    },
    {
      "id": "slug_baseball",
      "title": "야구",
      "url": "/baseball",
      "description": "야구 게시판"
    },
    {
      "id": "slug_basketball",
      "title": "농구",
      "url": "/basketball",
      "description": "농구 게시판"
    },
    {
      "id": "slug_other_game",
      "title": "PC/콘솔",
      "url": "/other_game",
      "description": "PC/콘솔 게시판"
    },
    {
      "id": "slug_lol",
      "title": "LoL",
      "url": "/lol",
      "description": "리그 오브 레전드 게시판"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".bd_tl h1 a",
      ".board_title",
      ".cate_title",
      "title"
    ],
    "listRows": [
      ".bd_tb_lst tbody tr",
      ".bd_lst tbody tr",
      "li.li",
      ".bd_lst li"
    ],
    "listLink": [
      "td.title > a[href]",
      "td.title a[href]",
      "h3.title a",
      "h3 a",
      "a[href]"
    ],
    "listTitle": [
      "td.title",
      "h3.title",
      "h3",
      ".title"
    ],
    "listAuthor": [
      ".author"
    ],
    "listDate": [
      ".time",
      ".regdate",
      ".date"
    ],
    "listCommentCount": [
      ".comment_count",
      ".replyNum"
    ],
    "listViewCount": [
      "td.m_no:not(.m_no_voted)",
      ".readed_count",
      ".readedCount"
    ],
    "listLikeCount": [
      ".m_no_voted",
      ".voted_count",
      ".voteNum"
    ],
    "listCategory": [
      ".cate",
      ".category"
    ],
    "listImage": [
      "img.thumb",
      ".thumb img",
      ".title img"
    ],
    "postTitle": [
      ".np_18px_span",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".member_plate",
      ".author",
      ".nick_name"
    ],
    "postDate": [
      ".btm_area .regdate",
      ".regdate",
      ".date"
    ],
    "postViewCount": [
      ".btm_area .readed_count",
      ".readed_count"
    ],
    "postLikeCount": [
      ".btm_area .voted_count",
      ".voted_count"
    ],
    "postCategory": [
      ".board_name",
      ".cate"
    ],
    "postContent": [
      ".rd_body .xe_content",
      ".rd_body",
      ".xe_content"
    ],
    "commentRows": [
      ".fdb_lst_ul li",
      ".comment_list li",
      ".comment-item"
    ],
    "commentAuthor": [
      ".member_plate",
      ".author",
      ".nick_name",
      ".name"
    ],
    "commentContent": [
      ".comment-content",
      ".xe_content",
      ".comment_text",
      ".text"
    ],
    "commentDate": [
      ".date",
      ".regdate",
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
    "slug_best": "인기",
    "slug_best2": "인기",
    "mid_politics": "이슈",
    "slug_humor": "커뮤니티",
    "slug_mystery": "커뮤니티",
    "slug_football_korean": "축구",
    "slug_football_news": "축구",
    "slug_baseball": "야구/농구",
    "slug_basketball": "야구/농구",
    "slug_other_game": "게임",
    "slug_lol": "게임"
  }
};
function fmkoreaBoardFromSlug(slug) {
    var normalized = normalizeWhitespace(slug);
    if (!normalized) return null;
    return boardById("slug_" + normalized) ||
        boardById("mid_" + normalized) ||
        ensureBoard("slug_" + normalized, "https://" + SYNURA.domain + "/" + encodeURIComponent(normalized), normalized);
}
function fmkoreaBoardFromMid(mid) {
    var normalized = normalizeWhitespace(mid);
    if (!normalized) return null;
    return boardById("mid_" + normalized) ||
        boardById("slug_" + normalized) ||
        ensureBoard("mid_" + normalized, "https://" + SYNURA.domain + "/index.php?mid=" + encodeURIComponent(normalized), normalized);
}
function fmkoreaBuildBoardUrl(boardId) {
    var normalized = normalizeWhitespace(boardId);
    if (!normalized) return "";
    if (normalized.indexOf("slug_") === 0) {
        return "https://" + SYNURA.domain + "/" + encodeURIComponent(normalized.substring(5));
    }
    if (normalized.indexOf("mid_") === 0) {
        return "https://" + SYNURA.domain + "/index.php?mid=" + encodeURIComponent(normalized.substring(4));
    }
    return "";
}
function fmkoreaBuildBoardPageUrl(board, page) {
    var boardId = normalizeWhitespace(board && board.id ? board.id : board);
    var pageNumber = parseInt(String(page || 1), 10);
    if (!(pageNumber > 1)) return fmkoreaBuildBoardUrl(boardId);
    if (boardId.indexOf("slug_") === 0) {
        return "https://" + SYNURA.domain + "/index.php?mid=" + encodeURIComponent(boardId.substring(5)) + "&page=" + pageNumber;
    }
    if (boardId.indexOf("mid_") === 0) {
        return "https://" + SYNURA.domain + "/index.php?mid=" + encodeURIComponent(boardId.substring(4)) + "&page=" + pageNumber;
    }
    var baseUrl = fmkoreaBuildBoardUrl(boardId);
    return baseUrl ? setPageParam(baseUrl, "page", pageNumber) : "";
}
SITE.matchBoard = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (urlInfo.path === "/index.php") {
        var mid = queryValue(urlInfo.query, "mid");
        if (mid) {
            return {
                board: fmkoreaBoardFromMid(mid),
                page: queryInt(urlInfo.query, "page", 1)
            };
        }
    }
    if (parts.length === 1 && parts[0] && !/^\d+$/.test(parts[0])) {
        return {
            board: fmkoreaBoardFromSlug(parts[0]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (urlInfo.path === "/index.php") {
        var mid = queryValue(urlInfo.query, "mid");
        var documentSrl = queryValue(urlInfo.query, "document_srl");
        if (/^\d+$/.test(documentSrl)) {
            return {
                board: mid ? fmkoreaBoardFromMid(mid) : fmkoreaBoardFromSlug("best"),
                postId: documentSrl
            };
        }
    }
    if (parts.length === 1 && /^\d+$/.test(parts[0])) {
        return {
            board: fmkoreaBoardFromSlug("best"),
            postId: parts[0]
        };
    }
    if (parts.length === 2 && !/^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
        return {
            board: fmkoreaBoardFromSlug(parts[0]),
            postId: parts[1]
        };
    }
    return null;
};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    return fmkoreaBuildBoardPageUrl(match ? match.board : null, nextPage) || setPageParam(currentUrl, "page", nextPage);
};
SITE.buildPostFetchUrls = function (match, currentUrl) {
    return [currentUrl];
};
SITE.buildBoardUrlFromId = function (boardId) {
    return fmkoreaBuildBoardPageUrl(boardId, 1);
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
SITE.parseComments = function (doc, postUrl) {
    return fmkoreaParseComments(doc, postUrl);
};
SITE.fetchPostComments = function (match, url, doc, page, comments) {
    return comments;
};
SITE.preparePostContext = function (context, match, url, doc, page) {
    if (!doc) return context;

    var comments = fmkoreaParseComments(doc, url);
    var html = page && page.response ? page.response.text() : "";
    var currentCommentPage = fmkoreaParseCommentPageFromUrl(url);
    var latestCommentPage = fmkoreaDetectLatestCommentPage(doc, html);
    var renderedCommentPage = fmkoreaDetectRenderedCommentPage(doc, html);
    if (!(renderedCommentPage > 0)) {
        renderedCommentPage = currentCommentPage > 0
            ? currentCommentPage
            : (latestCommentPage > 0 && comments.length > 0 ? latestCommentPage : 0);
    }
    if (latestCommentPage > 0 && renderedCommentPage > latestCommentPage) {
        renderedCommentPage = latestCommentPage;
    }
    var loadedCommentLinks = {};

    for (var i = 0; i < comments.length; i++) {
        var link = normalizeWhitespace(comments[i] && comments[i].link || "");
        if (!link) continue;
        loadedCommentLinks[link] = true;
    }

    context.fmkoreaCanonicalPostUrl = fmkoreaCanonicalPostUrl(url);
    context.fmkoreaCommentMid = fmkoreaCommentMid(match, url);
    context.fmkoreaRenderedCommentPage = renderedCommentPage;
    context.fmkoreaCommentLatestPage = latestCommentPage;
    context.fmkoreaCommentCursorPage = renderedCommentPage > 0
        ? Math.max(0, renderedCommentPage - 1)
        : 0;
    context.fmkoreaLoadedComments = comments;
    context.fmkoreaLoadedCommentLinks = loadedCommentLinks;
    return context;
};
SITE.handleViewEvent = function (viewId, event, state, context) {
    if (!state || state.kind !== "post") return false;
    if (!event || event.eventId !== "SCROLL_TO_END") return false;
    return fmkoreaAppendOlderComments(viewId, state);
};
SITE.handleBoardSettingsRootEvent = function (viewId, event, state) {
    return false;
};

var SYNURA = {
    domain: "www.fmkorea.com",
    name: "fmkorea",
    description: "Unofficial FMKorea extension",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/windows",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://www.fmkorea.com/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = [
    "^https://(?:www\\.)?fmkorea\\.com/(?:[A-Za-z0-9_]+/)?\\d+(?:\\?|$)",
    "^https://(?:www\\.)?fmkorea\\.com/index\\.php\\?[^#]*document_srl=\\d+(?:[&#]|$)"
];
var LIST_ROW_SELECTORS = SITE.selectors && SITE.selectors.listRows ? SITE.selectors.listRows : ["li.li",".bd_lst li"];
var LIST_LINK_SELECTORS = SITE.selectors && SITE.selectors.listLink ? SITE.selectors.listLink : ["h3.title a","h3 a","a[href]"];
var LIST_TITLE_SELECTORS = SITE.selectors && SITE.selectors.listTitle ? SITE.selectors.listTitle : ["h3.title","h3",".title"];
var LIST_AUTHOR_SELECTORS = SITE.selectors && SITE.selectors.listAuthor ? SITE.selectors.listAuthor : [".author"];
var LIST_AVATAR_SELECTORS = [];
var LIST_DATE_SELECTORS = SITE.selectors && SITE.selectors.listDate ? SITE.selectors.listDate : [".regdate",".date"];
var LIST_COMMENT_COUNT_SELECTORS = SITE.selectors && SITE.selectors.listCommentCount ? SITE.selectors.listCommentCount : [".comment_count",".replyNum"];
var LIST_VIEW_COUNT_SELECTORS = SITE.selectors && SITE.selectors.listViewCount ? SITE.selectors.listViewCount : [".readed_count",".readedCount"];
var LIST_LIKE_COUNT_SELECTORS = SITE.selectors && SITE.selectors.listLikeCount ? SITE.selectors.listLikeCount : [".voted_count",".voteNum"];
var LIST_CATEGORY_SELECTORS = SITE.selectors && SITE.selectors.listCategory ? SITE.selectors.listCategory : [".category"];
var LIST_IMAGE_SELECTORS = SITE.selectors && SITE.selectors.listImage ? SITE.selectors.listImage : ["img.thumb",".thumb img",".title img"];

var FMKOREA_BEST_BOARD_IDS = {
    "slug_best": true,
    "slug_best2": true
};

var FMKOREA_BEST_LIST_ROW_SELECTORS = [
    "li.li",
    ".bd_lst li"
];

var FMKOREA_TABLE_LIST_ROW_SELECTORS = [
    ".bd_tb_lst tbody tr",
    ".bd_lst tbody tr"
];

function fmkoreaResolveBoardId(match, baseUrl) {
    var boardId = normalizeWhitespace(match && match.board && match.board.id || "");
    if (boardId) return boardId;

    var info = parseAbsoluteUrl(baseUrl);
    var boardMatch = info && SITE.matchBoard ? SITE.matchBoard(info) : null;
    return normalizeWhitespace(boardMatch && boardMatch.board && boardMatch.board.id || "");
}

function fmkoreaBoardListProfile(match, baseUrl) {
    var boardId = fmkoreaResolveBoardId(match, baseUrl);
    if (FMKOREA_BEST_BOARD_IDS[boardId]) {
        return {
            key: "best",
            rowSelectors: FMKOREA_BEST_LIST_ROW_SELECTORS,
            skipRow: function (row) {
                return !row;
            }
        };
    }

    return {
        key: "table",
        rowSelectors: FMKOREA_TABLE_LIST_ROW_SELECTORS,
        skipRow: fmkoreaShouldSkipListRow
    };
}

function fmkoreaShouldSkipListRow(row) {
    if (!row) return true;

    var className = normalizeWhitespace(attrOf(row, "class"));
    if (/\bnotice\b/i.test(className)) return true;
    if (/\bshow_folded_notice\b/i.test(className)) return true;

    var tagName = String(row.tagName || "").toUpperCase();
    if (tagName === "TR") {
        var linkNode = row.querySelector ? row.querySelector("a[href]") : null;
        var colspanNode = row.querySelector ? row.querySelector("td[colspan]") : null;
        if (colspanNode && !linkNode) return true;
    }

    return false;
}

function fmkoreaFindInfoSpan(row, iconClass) {
    if (!row || !row.querySelectorAll || !iconClass) return null;
    var infos = row.querySelectorAll(".info");
    for (var i = 0; i < infos.length; i++) {
        var childNodes = infos[i] && infos[i].childNodes ? infos[i].childNodes : [];
        for (var j = 0; j < childNodes.length; j++) {
            var child = childNodes[j];
            if (!child || String(child.tagName || "").toUpperCase() !== "SPAN") continue;
            var icon = child.querySelector("i");
            var className = normalizeWhitespace(icon && icon.className || "");
            if (className && className.indexOf(iconClass) >= 0) return child;
        }
    }
    return null;
}

function fmkoreaInfoText(row, iconClass) {
    var span = fmkoreaFindInfoSpan(row, iconClass);
    return firstNonEmpty([
        textOfNodeWithoutSelectors(span, ["i","span"]),
        textOfNodeWithoutSelectors(span, ["i"]),
        textOf(span)
    ]);
}

function fmkoreaMetricRankValue(value) {
    var normalized = normalizeWhitespace(value).replace(/,/g, "");
    if (!normalized) return 0;

    var plainMatch = normalized.match(/^(-?\d+(?:\.\d+)?)$/);
    if (plainMatch) {
        var plainValue = parseFloat(plainMatch[1]);
        return isNaN(plainValue) ? 0 : Math.round(plainValue);
    }

    var unitMatch = normalized.match(/^(-?\d+(?:\.\d+)?)([천만억])$/);
    if (unitMatch) {
        var amount = parseFloat(unitMatch[1]);
        if (!isNaN(amount)) {
            var unit = unitMatch[2];
            var multiplier = unit === "억" ? 100000000 : unit === "만" ? 10000 : 1000;
            return Math.round(amount * multiplier);
        }
    }

    return toInt(normalized, 0);
}

function fmkoreaCanonicalPostUrl(postUrl) {
    var normalized = normalizeUrl(postUrl) || ensureAbsoluteUrl(postUrl, SITE.browserHomeUrl) || "";
    var info = parseAbsoluteUrl(normalized);
    var match = info && SITE.matchPost ? SITE.matchPost(info) : null;
    if (!match || !match.postId) return normalized ? normalized.replace(/#.*$/, "") : "";

    var boardId = normalizeWhitespace(match.board && match.board.id || "");
    if (boardId.indexOf("slug_") === 0) {
        return "https://" + SYNURA.domain + "/" + encodeURIComponent(boardId.substring(5)) + "/" + encodeURIComponent(match.postId);
    }
    if (boardId.indexOf("mid_") === 0) {
        return "https://" + SYNURA.domain + "/index.php?mid=" + encodeURIComponent(boardId.substring(4)) + "&document_srl=" + encodeURIComponent(match.postId);
    }
    return "https://" + SYNURA.domain + "/index.php?document_srl=" + encodeURIComponent(match.postId);
}

function fmkoreaCommentMid(match, postUrl) {
    var boardId = normalizeWhitespace(match && match.board && match.board.id || "");
    if (boardId.indexOf("slug_") === 0) return boardId.substring(5);
    if (boardId.indexOf("mid_") === 0) return boardId.substring(4);

    var info = parseAbsoluteUrl(postUrl);
    if (!info) return "";

    var mid = normalizeWhitespace(queryValue(info.query, "mid"));
    if (mid) return mid;

    var parts = pathSegments(info.path);
    if (parts.length >= 1 && parts[0] && !/^\d+$/.test(parts[0])) return parts[0];
    return "";
}

function fmkoreaPostIdFromUrl(postUrl) {
    var info = parseAbsoluteUrl(postUrl);
    var match = info && SITE.matchPost ? SITE.matchPost(info) : null;
    return normalizeWhitespace(match && match.postId || "");
}

function fmkoreaParseCommentPageFromUrl(postUrl) {
    var info = parseAbsoluteUrl(postUrl);
    if (!info) return 0;
    return queryInt(info.query, "cpage", 0);
}

function fmkoreaQuerySelectorUnion(root, selectors) {
    if (!root || !root.querySelectorAll || !selectors) return [];
    var out = [];
    for (var i = 0; i < selectors.length; i++) {
        var selector = selectors[i];
        if (!selector) continue;
        var matches = root.querySelectorAll(selector);
        if (!matches || matches.length === 0) continue;
        for (var j = 0; j < matches.length; j++) {
            if (out.indexOf(matches[j]) < 0) out.push(matches[j]);
        }
    }
    return out;
}

function fmkoreaDetectLatestCommentPage(doc, html) {
    var source = String(html || "");
    var matched = source.match(/window\.document_cpage\s*=\s*(\d+)/);
    if (matched && matched[1]) {
        var fromScript = parseInt(matched[1], 10);
        if (!isNaN(fromScript) && fromScript > 0) return fromScript;
    }

    var pager = firstNode(doc, [
        "#cmtPosition .bd_pg",
        ".fdb_lst .bd_pg",
        "#comment .bd_pg"
    ]);
    if (!pager) return 0;

    var maxPage = 0;
    var anchors = fmkoreaQuerySelectorUnion(pager, ["a", "strong", ".this"]);
    for (var i = 0; i < anchors.length; i++) {
        var text = normalizeWhitespace(textOf(anchors[i]));
        if (!/^\d+$/.test(text)) continue;
        var pageNo = parseInt(text, 10);
        if (!isNaN(pageNo) && pageNo > maxPage) maxPage = pageNo;
    }
    return maxPage;
}

function fmkoreaDetectRenderedCommentPage(doc, html) {
    var source = String(html || "");
    var matched = source.match(/window\.current_cpage\s*=\s*parseInt\('(\d+)'\)/);
    if (matched && matched[1]) {
        var parsedCurrentPage = parseInt(matched[1], 10);
        if (!isNaN(parsedCurrentPage) && parsedCurrentPage > 0) return parsedCurrentPage;
    }

    matched = source.match(/window\.current_cpage\s*=\s*(\d+)/);
    if (matched && matched[1]) {
        var currentPage = parseInt(matched[1], 10);
        if (!isNaN(currentPage) && currentPage > 0) return currentPage;
    }

    var pager = firstNode(doc, [
        "#cmtPosition .bd_pg",
        ".fdb_lst .bd_pg",
        "#comment .bd_pg"
    ]);
    if (!pager) return 0;

    var current = firstNode(pager, ["strong.this", ".this"]);
    var currentText = normalizeWhitespace(textOf(current));
    if (!/^\d+$/.test(currentText)) return 0;

    var currentFromPager = parseInt(currentText, 10);
    return !isNaN(currentFromPager) && currentFromPager > 0 ? currentFromPager : 0;
}

function fmkoreaExtractCommentId(row) {
    var raw = firstNonEmpty([
        attrOf(row, "id"),
        attrOf(firstNode(row, [".member_plate"]), "data-comment_srl"),
        attrOf(firstNode(row, [".copy-button"]), "data-clipboard-text"),
        attrOf(firstNode(row, [".copy-button"]), "href"),
        attrOf(firstNode(row, [".findComment"]), "href"),
        attrOf(firstNode(row, [".findParent"]), "href")
    ]);
    if (!raw) return "";

    var matched = raw.match(/comment[_-](\d+)/);
    if (matched && matched[1]) return matched[1];

    matched = raw.match(/\/(\d+)#comment/i);
    if (matched && matched[1]) return matched[1];

    return /^\d+$/.test(raw) ? raw : "";
}

function fmkoreaDetectCommentLevel(row) {
    var cls = attrOf(row, "class");
    if (/\bre\b/i.test(cls)) return 1;

    var style = attrOf(row, "style");
    var matched = style.match(/margin-left\s*:\s*(\d+)/i);
    if (matched && matched[1]) {
        var amount = parseInt(matched[1], 10);
        if (!isNaN(amount) && amount > 0) return 1;
    }
    return 0;
}

function fmkoreaParseComments(doc, postUrl) {
    var rows = allNodes(doc, SITE.selectors.commentRows);
    var comments = [];
    var canonicalPostUrl = fmkoreaCanonicalPostUrl(postUrl) || (normalizeUrl(postUrl) || ensureAbsoluteUrl(postUrl, SITE.browserHomeUrl) || "");

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var contentRoot = firstNode(row, SITE.selectors.commentContent);
        var content = parseDetails(contentRoot, canonicalPostUrl);
        if (!content || content.length === 0) {
            var rawText = firstText(row, SITE.selectors.commentContent);
            if (rawText) content = [{ type: "text", value: rawText }];
        }
        if (!content || content.length === 0) continue;

        var likeCount = hideZeroCount(parseCount(firstText(row, SITE.selectors.commentLikeCount)));
        var dislikeCount = hideZeroCount(parseCount(firstText(row, [".blamed_count"])));
        var commentId = fmkoreaExtractCommentId(row);

        comments.push({
            link: commentId
                ? (canonicalPostUrl + "#comment_" + commentId)
                : (canonicalPostUrl + "#comment-" + (i + 1)),
            author: firstAuthorText(row, SITE.selectors.commentAuthor),
            avatar: imageUrlFromNode(firstNode(row, SITE.selectors.commentAvatar || SITE.selectors.commentAuthor), canonicalPostUrl),
            content: content,
            date: firstText(row, SITE.selectors.commentDate),
            likeCount: likeCount,
            dislikeCount: dislikeCount,
            level: fmkoreaDetectCommentLevel(row),
            menus: [],
            hotCount: fmkoreaMetricRankValue(likeCount),
            coldCount: fmkoreaMetricRankValue(dislikeCount)
        });
    }

    return comments;
}

function fmkoreaBuildCommentPageUrlFromState(state, pageNo) {
    var currentPage = parseInt(String(pageNo || 0), 10);
    if (!(currentPage > 0)) return "";

    var canonicalPostUrl = normalizeUrl(state && state.fmkoreaCanonicalPostUrl || state && state.link || "") || "";
    if (!canonicalPostUrl) return "";

    return setPageParam(canonicalPostUrl, "cpage", currentPage);
}

function fmkoreaAppendOlderComments(viewId, state) {
    var nextPage = parseInt(String(state && state.fmkoreaCommentCursorPage || 0), 10);
    if (!(nextPage > 0)) return true;

    var targetUrl = fmkoreaBuildCommentPageUrlFromState(state, nextPage);
    if (!targetUrl) return true;

    try {
        var page = fetchPostPage(null, targetUrl);
        var fetchedComments = fmkoreaParseComments(page.doc, targetUrl);
        var seen = state.fmkoreaLoadedCommentLinks || {};
        var loaded = Array.isArray(state.fmkoreaLoadedComments) ? state.fmkoreaLoadedComments.slice() : [];

        for (var i = 0; i < fetchedComments.length; i++) {
            var item = fetchedComments[i];
            var link = normalizeWhitespace(item && item.link || "");
            if (!link || seen[link]) continue;
            seen[link] = true;
            loaded.push(item);
        }

        state.fmkoreaLoadedComments = loaded;
        state.fmkoreaLoadedCommentLinks = seen;
        state.fmkoreaCommentCursorPage = Math.max(0, nextPage - 1);
        setViewState(viewId, state);

        synura.update(viewId, {
            models: {
                comments: loaded
            }
        });
    } catch (e) {}
    return true;
}

function parseFmkoreaBoardItems(doc, baseUrl, match) {
    var root = fmkoreaParseBoardRoot(doc);
    var profile = fmkoreaBoardListProfile(match, baseUrl);
    var rows = allNodes(root, profile && profile.rowSelectors ? profile.rowSelectors : selectorList("listRows", LIST_ROW_SELECTORS));
    if (!rows || rows.length === 0) return [];

    var items = [];
    var seen = {};
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (profile && typeof profile.skipRow === "function" && profile.skipRow(row)) continue;
        var item = extractListItem(row, baseUrl);
        if (!item || !item.link || seen[item.link]) continue;

        seen[item.link] = true;
        item.category = formatBoardListCategory(item.category || "");
        items.push(item);
    }

    return items;
}

function fmkoreaParseBoardRoot(input) {
    // FMKorea uses different board-list routes: some paths are parsed from a DOM
    // document directly, while regular board pages also flow through the raw-HTML hook.
    if (input && typeof input.querySelectorAll === "function") {
        return input;
    }
    try {
        return new DOMParser().parseFromString(String(input || ""), "text/html");
    } catch (e) {
        return null;
    }
}

function extractListItem(row, baseUrl) {
    if (fmkoreaShouldSkipListRow(row)) return null;

    var linkSelectors = selectorList("listLink", LIST_LINK_SELECTORS);
    var titleSelectors = selectorList("listTitle", LIST_TITLE_SELECTORS);
    var authorSelectors = selectorList("listAuthor", LIST_AUTHOR_SELECTORS);
    var avatarSelectors = selectorList("listAvatar", LIST_AVATAR_SELECTORS);
    var dateSelectors = selectorList("listDate", LIST_DATE_SELECTORS);
    var commentCountSelectors = selectorList("listCommentCount", LIST_COMMENT_COUNT_SELECTORS);
    var viewCountSelectors = selectorList("listViewCount", LIST_VIEW_COUNT_SELECTORS);
    var likeCountSelectors = selectorList("listLikeCount", LIST_LIKE_COUNT_SELECTORS);
    var categorySelectors = selectorList("listCategory", LIST_CATEGORY_SELECTORS);
    var imageSelectors = selectorList("listImage", LIST_IMAGE_SELECTORS);
    var linkNode = firstNode(row, linkSelectors);
    var titleNode = firstNode(row, titleSelectors);
    var link = extractListLink(row, baseUrl, linkSelectors, LIST_LINK_ALLOW_PATTERNS);
    if (!link) return null;

    var title = firstNonEmpty([
        textOfNodeWithoutSelectors(titleNode, commentCountSelectors),
        textOfNodeWithoutSelectors(linkNode, commentCountSelectors),
        textOf(linkNode),
        textOf(row)
    ]);
    if (!title) return null;

    var commentCount = hideZeroCount(parseCount(firstText(row, commentCountSelectors)));
    var viewCount = firstNonEmpty([
        hideZeroCount(parseCount(firstText(row, viewCountSelectors))),
        hideZeroCount(fmkoreaInfoText(row, "fa-eye"))
    ]);
    var likeCount = firstNonEmpty([
        hideZeroCount(parseCount(firstText(row, likeCountSelectors))),
        hideZeroCount(fmkoreaInfoText(row, "fa-star"))
    ]);
    var author = firstNonEmpty([
        firstAuthorText(row, authorSelectors),
        fmkoreaInfoText(row, "fa-user")
    ]);
    var category = firstNonEmpty([
        firstText(row, categorySelectors),
        fmkoreaInfoText(row, "fa-bars")
    ]);
    var date = firstNonEmpty([
        firstText(row, dateSelectors),
        fmkoreaInfoText(row, "fa-clock-o")
    ]);
    var avatarSourceSelectors = avatarSelectors.length > 0 ? avatarSelectors : authorSelectors;
    var avatar = imageUrlFromNode(firstNode(row, avatarSourceSelectors), baseUrl);
    var mediaUrl = imageUrlFromNode(firstNode(row, imageSelectors), baseUrl);
    var types = [];
    if (mediaUrl) types.push("image");

    if (!author && !date && !category && row && row.outerHTML && typeof console !== "undefined" && console && typeof console.log === "function") {
        console.log("FMK_DEBUG_ROW:" + row.outerHTML);
    }

    return {
        link: normalizeUrl(link) || link,
        title: title,
        author: author,
        avatar: avatar,
        date: date,
        category: category,
        commentCount: commentCount,
        viewCount: viewCount,
        likeCount: likeCount,
        mediaUrl: mediaUrl,
        mediaType: mediaUrl ? "image" : "",
        types: types,
        menus: [],
        hotCount: fmkoreaMetricRankValue(viewCount || likeCount || commentCount),
        coldCount: fmkoreaMetricRankValue(likeCount || commentCount)
    };
}

SITE.parseBoardItemsCustom = parseFmkoreaBoardItems;
SITE.parseBoardItemsFromHtml = function (html, baseUrl, match) {
    return parseFmkoreaBoardItems(fmkoreaParseBoardRoot(html), baseUrl, match);
};
