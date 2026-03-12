// @ts-nocheck
// @synura-build standalone

// Preserved manual source for the TypeScript single-file build.
// Update this file directly when changing the DCInside extension.

var SITE = {
  "siteKey": "dcinside",
  "displayName": "디시인사이드",
  "browserHomeUrl": "https://m.dcinside.com/board/dcbest",
  "browserCookieAuth": false,
  "hostAliases": [
    "gall.dcinside.com",
    "dcinside.com",
    "www.dcinside.com"
  ],
  "titleSuffixes": [
    " - 디시인사이드",
    " : 디시인사이드",
    " - 실시간 베스트 갤러리",
    " 갤러리 - 커뮤니티 포털 디시인사이드",
    " 미니 갤러리 - 커뮤니티 포털 디시인사이드",
    " 인물 갤러리 - 커뮤니티 포털 디시인사이드"
  ],
  "linkAllowPatterns": [
    "^https://m\\.dcinside\\.com/board/[^/]+/\\d+(?:\\?.*)?$",
    "^https://m\\.dcinside\\.com/mini/[^/]+/\\d+(?:\\?.*)?$",
    "^https://m\\.dcinside\\.com/person/[^/]+/\\d+(?:\\?.*)?$",
    "^https://m\\.dcinside\\.com/board/view(?:/)?\\?.*\\bid=[^&]+.*\\bno=\\d+",
    "^https://m\\.dcinside\\.com/mini/board/view(?:/)?\\?.*\\bid=[^&]+.*\\bno=\\d+",
    "^https://m\\.dcinside\\.com/person/board/view(?:/)?\\?.*\\bid=[^&]+.*\\bno=\\d+"
  ],
  "listBoardQueryParam": "",
  "boards": [
    {
      "id": "board:dcbest",
      "title": "실시간 베스트",
      "url": "https://m.dcinside.com/board/dcbest",
      "description": "실시간 베스트",
      "group": "인기"
    },
    {
      "id": "board:baseball_new11",
      "title": "국내야구",
      "url": "https://m.dcinside.com/board/baseball_new11",
      "description": "인기 갤러리",
      "group": "스포츠"
    },
    {
      "id": "board:bitcoins",
      "title": "비트코인",
      "url": "https://m.dcinside.com/board/bitcoins",
      "description": "인기 갤러리",
      "group": "재테크"
    },
    {
      "id": "board:football_new6",
      "title": "해외축구",
      "url": "https://m.dcinside.com/board/football_new6",
      "description": "인기 갤러리",
      "group": "스포츠"
    },
    {
      "id": "board:leagueoflegends2",
      "title": "리그 오브 레전드",
      "url": "https://m.dcinside.com/board/leagueoflegends2",
      "description": "인기 갤러리",
      "group": "게임"
    },
    {
      "id": "board:ib_new",
      "title": "인터넷방송",
      "url": "https://m.dcinside.com/board/ib_new",
      "description": "인기 갤러리",
      "group": "방송"
    },
    {
      "id": "board:stock_new2",
      "title": "정치, 사회(구 주식)",
      "url": "https://m.dcinside.com/board/stock_new2",
      "description": "인기 갤러리",
      "group": "정치/사회"
    },
    {
      "id": "board:fantasy_new",
      "title": "판타지",
      "url": "https://m.dcinside.com/board/fantasy_new",
      "description": "인기 갤러리",
      "group": "문학"
    },
    {
      "id": "mini:vtubersnipe",
      "title": "버츄얼 스나",
      "url": "https://m.dcinside.com/mini/vtubersnipe",
      "description": "미니 갤러리",
      "group": "버츄얼"
    },
    {
      "id": "person:starhanae",
      "title": "하나에 나츠키",
      "url": "https://m.dcinside.com/person/starhanae",
      "description": "인물 갤러리",
      "group": "인물"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".board-tit",
      ".page_head h2",
      ".gallname",
      ".title_head",
      "title"
    ],
    "listRows": [
      "tr.ub-content.us-post",
      ".gall-detail-lnktb"
    ],
    "listLink": [
      "td.gall_tit a",
      "a.lt"
    ],
    "listTitle": [
      "td.gall_tit a",
      ".subjectin",
      ".subject"
    ],
    "listAuthor": [
      "td.gall_writer .nickname",
      "td.gall_writer b",
      "td.gall_writer"
    ],
    "listDate": [
      "td.gall_date"
    ],
    "listCommentCount": [
      "a.reply_numbox .reply_num",
      "a.rt .ct",
      ".ct"
    ],
    "listViewCount": [
      "td.gall_count"
    ],
    "listLikeCount": [
      "td.gall_recommend"
    ],
    "listCategory": [
      "td.gall_subject",
      ".issue",
      ".icon_notice"
    ],
    "listImage": [
      ".thum-img img",
      "img"
    ],
    "postTitle": [
      ".gallview_head .tit",
      ".tit",
      ".title_subject",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".gallview_head .gall_writer .nickname",
      ".gallview_head .gall_writer",
      ".gallview_head .nickname",
      ".nickname",
      ".writer"
    ],
    "postDate": [
      ".gallview_head .gall_date",
      ".gallview_head .ginfo .date_time",
      ".date_time",
      ".gall_date",
      ".date"
    ],
    "postViewCount": [
      ".gallview_head .gall_count",
      ".gallview_head .ginfo .hit",
      ".gall_count",
      ".hit"
    ],
    "postLikeCount": [
      ".gallview_head .gall_recommend",
      ".gall_recommend",
      ".recommend .num",
      ".up_num",
      ".recommend_num"
    ],
    "postCategory": [
      ".gallview_head .gall_subject",
      ".icon_notice",
      ".minor_head"
    ],
    "postContent": [
      ".write_div",
      ".view_content_wrap",
      ".thum-txtin",
      ".view_content"
    ],
    "commentRows": [
      ".all-comment-lst li.comment",
      ".all-comment-lst li.comment-add",
      ".all-comment-lst li",
      ".comment_wrap .comment_box .comment",
      ".comment_wrap .comment_box li",
      ".comment_box li",
      ".comment_list li"
    ],
    "commentAuthor": [
      ".nickname",
      ".nick",
      ".name"
    ],
    "commentContent": [
      ".comment_txt",
      ".usertxt",
      ".txt",
      ".comment"
    ],
    "commentDate": [
      ".date_time",
      ".date"
    ],
    "commentLikeCount": [
      ".up_num",
      ".recommend_num"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": []
};
SITE.matchBoard = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (urlInfo.path === "/board/lists" || urlInfo.path === "/board/lists/") {
        var listId = queryValue(urlInfo.query, "id");
        if (listId) {
            return {
                board: ensureBoard(makeBoardKey("board", listId), buildBoardListUrl("board", listId), listId, "board"),
                page: queryInt(urlInfo.query, "page", 1)
            };
        }
    }
    if (urlInfo.path === "/mini/board/lists" || urlInfo.path === "/mini/board/lists/") {
        var miniId = queryValue(urlInfo.query, "id");
        if (miniId) {
            return {
                board: ensureBoard(makeBoardKey("mini", miniId), buildBoardListUrl("mini", miniId), miniId, "mini"),
                page: queryInt(urlInfo.query, "page", 1)
            };
        }
    }
    if (urlInfo.path === "/person/board/lists" || urlInfo.path === "/person/board/lists/") {
        var personId = queryValue(urlInfo.query, "id");
        if (personId) {
            return {
                board: ensureBoard(makeBoardKey("person", personId), buildBoardListUrl("person", personId), personId, "person"),
                page: queryInt(urlInfo.query, "page", 1)
            };
        }
    }
    if (parts.length === 2 && parts[0] === "board" && !/^\d+$/.test(parts[1])) {
        return {
            board: ensureBoard(makeBoardKey("board", parts[1]), buildBoardListUrl("board", parts[1]), parts[1], "board"),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    if (parts.length === 2 && parts[0] === "mini" && parts[1] !== "board") {
        return {
            board: ensureBoard(makeBoardKey("mini", parts[1]), buildBoardListUrl("mini", parts[1]), parts[1], "mini"),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    if (parts.length === 2 && parts[0] === "person" && parts[1] !== "board") {
        return {
            board: ensureBoard(makeBoardKey("person", parts[1]), buildBoardListUrl("person", parts[1]), parts[1], "person"),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    return null;

};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length >= 3 && parts[0] === "board" && !/^\d+$/.test(parts[1]) && /^\d+$/.test(parts[2])) {
        return {
            board: ensureBoard(makeBoardKey("board", parts[1]), buildBoardListUrl("board", parts[1]), parts[1], "board"),
            postId: parts[2]
        };
    }
    if (parts.length >= 3 && parts[0] === "mini" && parts[1] !== "board" && /^\d+$/.test(parts[2])) {
        return {
            board: ensureBoard(makeBoardKey("mini", parts[1]), buildBoardListUrl("mini", parts[1]), parts[1], "mini"),
            postId: parts[2]
        };
    }
    if (parts.length >= 3 && parts[0] === "person" && parts[1] !== "board" && /^\d+$/.test(parts[2])) {
        return {
            board: ensureBoard(makeBoardKey("person", parts[1]), buildBoardListUrl("person", parts[1]), parts[1], "person"),
            postId: parts[2]
        };
    }
    if (urlInfo.path === "/board/view" || urlInfo.path === "/board/view/") {
        var boardId = queryValue(urlInfo.query, "id");
        var boardNo = queryValue(urlInfo.query, "no");
        if (boardId && boardNo) {
            return {
                board: ensureBoard(makeBoardKey("board", boardId), buildBoardListUrl("board", boardId), boardId, "board"),
                postId: boardNo
            };
        }
    }
    if (urlInfo.path === "/mini/board/view" || urlInfo.path === "/mini/board/view/") {
        var miniBoardId = queryValue(urlInfo.query, "id");
        var miniBoardNo = queryValue(urlInfo.query, "no");
        if (miniBoardId && miniBoardNo) {
            return {
                board: ensureBoard(makeBoardKey("mini", miniBoardId), buildBoardListUrl("mini", miniBoardId), miniBoardId, "mini"),
                postId: miniBoardNo
            };
        }
    }
    if (urlInfo.path === "/person/board/view" || urlInfo.path === "/person/board/view/") {
        var personBoardId = queryValue(urlInfo.query, "id");
        var personBoardNo = queryValue(urlInfo.query, "no");
        if (personBoardId && personBoardNo) {
            return {
                board: ensureBoard(makeBoardKey("person", personBoardId), buildBoardListUrl("person", personBoardId), personBoardId, "person"),
                postId: personBoardNo
            };
        }
    }
    return null;

};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    if (!match || !match.board) return setPageParam(currentUrl, "page", nextPage);
    return buildBoardPageUrl(match.board.kind, match.board.slug, nextPage);

};

var SYNURA = {
    domain: "m.dcinside.com",
    name: "dcinside",
    description: "Unofficial Synura extension for dcinside mobile boards.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://nstatic.dcinside.com/dc/m/img/dcinside_icon.png",
    get main() { return handler; }
};

var CACHE_TTL = 300000;
var CACHE_PREFIX = "community_route:" + SITE.siteKey + ":";
var COOKIE_KEY = "community_cookie:" + SITE.siteKey;
var CATEGORY_TWO_CHAR_KEY = "community_category_two_char:" + SITE.siteKey;
var AUTH_ERROR_PREFIX = "AUTH_REQUIRED:";
var MENU_CACHE_SETTINGS = "설정";
var MENU_BROWSER = "브라우저로 보기";
var MENU_ALL_BOARDS = "전체 게시판";
var MENU_HOME = "홈";
var MENU_HOME_TOGGLE = "홈 추가";
var MENU_HOME_HIDE = "HOME 숨김";
var MENU_HOME_SHOW = "HOME 표시";
var MENU_IMPORT = "게시판가져오기";
var MENU_BOARD_SETTINGS = "갤러리 설정";
var MENU_REORDER = "정렬";
var MENU_REFRESH = "새로고침";
var BUTTON_REFRESH = "새로고침";
var CUSTOM_BOARDS_KEY = "dcinside_custom_boards";
var VISIBLE_BOARDS_KEY = "dcinside_visible_boards";
var BOARD_ORDER_KEY = "dcinside_board_order";
var DISCOVERED_BOARDS_KEY = "dcinside_discovered_boards";
var DISCOVERED_BOARDS_META_KEY = "dcinside_discovered_boards_meta";
var CATEGORY_ROOTS_KEY = "dcinside_category_roots_v1";
var DISCOVERED_BOARDS_MAX_AGE = 86400000;
var DEFAULT_VISIBLE_COUNT = 10;
var CATEGORY_BROWSER_PAGE_SIZE = 200;
var viewState = {};
var boardIndex = {};
var homeBoards = (SITE.boards || []).slice();
var categoryRootCache = null;
var categoryBoardCache = {};
var CATEGORY_ROOT_SPECS = [
    {
        key: "category",
        title: "갤러리",
        url: "https://" + SYNURA.domain + "/category"
    },
    {
        key: "mcategory",
        title: "마이너갤",
        url: "https://" + SYNURA.domain + "/mcategory"
    },
    {
        key: "micategory",
        title: "미니갤",
        url: "https://" + SYNURA.domain + "/micategory"
    },
    {
        key: "prcategory",
        title: "인물갤",
        url: "https://" + SYNURA.domain + "/prcategory"
    }
];
var CATEGORY_HOME_URL = "https://" + SYNURA.domain + "/galltotal";

for (var i = 0; i < homeBoards.length; i++) {
    boardIndex[homeBoards[i].id] = homeBoards[i];
}

function normalizeBoardKind(kind) {
    return kind === "mini" || kind === "person" ? kind : "board";
}

function makeBoardKey(kind, slug) {
    var safeKind = normalizeBoardKind(kind);
    var safeSlug = normalizeWhitespace(slug);
    return safeKind + ":" + safeSlug;
}

function splitBoardKey(id) {
    var raw = normalizeWhitespace(id);
    var split = raw.indexOf(":");
    if (split < 0) {
        return {
            kind: "board",
            slug: raw
        };
    }
    return {
        kind: normalizeBoardKind(raw.substring(0, split)),
        slug: normalizeWhitespace(raw.substring(split + 1))
    };
}

function boardKindLabel(kind) {
    var safeKind = normalizeBoardKind(kind);
    if (safeKind === "mini") return "미니 갤러리";
    if (safeKind === "person") return "인물 갤러리";
    return "갤러리";
}

function buildBoardListUrl(kind, slug) {
    var safeKind = normalizeBoardKind(kind);
    var safeSlug = normalizeWhitespace(slug);
    if (!safeSlug) return "";
    if (safeKind === "mini") {
        return "https://" + SYNURA.domain + "/mini/" + encodeURIComponent(safeSlug);
    }
    if (safeKind === "person") {
        return "https://" + SYNURA.domain + "/person/" + encodeURIComponent(safeSlug);
    }
    return "https://" + SYNURA.domain + "/board/" + safeSlug;
}

function buildBoardPageUrl(kind, slug, page) {
    var safeKind = normalizeBoardKind(kind);
    var safeSlug = normalizeWhitespace(slug);
    var pageNumber = toInt(page, 1);
    if (!safeSlug) return "";
    if (pageNumber <= 1) return buildBoardListUrl(safeKind, safeSlug);
    return setPageParam(buildBoardListUrl(safeKind, safeSlug), "page", pageNumber);
}

function buildPostUrl(kind, slug, postId, page) {
    var safeKind = normalizeBoardKind(kind);
    var safeSlug = normalizeWhitespace(slug);
    var safePostId = normalizeWhitespace(postId);
    var safePage = normalizeWhitespace(page);
    if (!safeSlug || !safePostId) return "";
    if (safeKind === "mini" || safeKind === "person") {
        var url = "https://" + SYNURA.domain + "/" + safeKind + "/" + encodeURIComponent(safeSlug) + "/" + encodeURIComponent(safePostId);
        if (safePage && safePage !== "1") {
            url = setQueryParam(url, "page", safePage);
        }
        return url;
    }
    var boardUrl = "https://" + SYNURA.domain + "/board/" + safeSlug + "/" + safePostId;
    if (safePage && safePage !== "1") {
        boardUrl = setQueryParam(boardUrl, "page", safePage);
    }
    return boardUrl;
}

function canonicalizeDcinsideUrl(rawUrl) {
    var info = parseAbsoluteUrl(rawUrl);
    if (!info) return "";

    var parts = pathSegments(info.path);
    var id = normalizeWhitespace(queryValue(info.query, "id"));
    var no = normalizeWhitespace(queryValue(info.query, "no"));
    var page = normalizeWhitespace(queryValue(info.query, "page"));
    var pageNumber = toInt(page, 1);

    if (!isKnownHost(info.host)) {
        return joinAbsoluteUrl(info);
    }
    if ((info.path === "/board/lists" || info.path === "/board/lists/") && id) {
        return buildBoardPageUrl("board", id, pageNumber);
    }
    if ((info.path === "/mini/board/lists" || info.path === "/mini/board/lists/") && id) {
        return buildBoardPageUrl("mini", id, pageNumber);
    }
    if ((info.path === "/person/board/lists" || info.path === "/person/board/lists/") && id) {
        return buildBoardPageUrl("person", id, pageNumber);
    }
    if ((info.path === "/board/view" || info.path === "/board/view/") && id && no) {
        return buildPostUrl("board", id, no, page);
    }
    if ((info.path === "/mini/board/view" || info.path === "/mini/board/view/") && id && no) {
        return buildPostUrl("mini", id, no, page);
    }
    if ((info.path === "/person/board/view" || info.path === "/person/board/view/") && id && no) {
        return buildPostUrl("person", id, no, page);
    }
    if (parts.length === 2 && parts[0] === "board" && !/^\d+$/.test(parts[1])) {
        return buildBoardPageUrl("board", parts[1], pageNumber);
    }
    if (parts.length >= 3 && parts[0] === "board" && !/^\d+$/.test(parts[1]) && /^\d+$/.test(parts[2])) {
        return buildPostUrl("board", parts[1], parts[2], page);
    }
    if (parts.length >= 3 && parts[0] === "mini" && parts[1] !== "board" && /^\d+$/.test(parts[2])) {
        return buildPostUrl("mini", parts[1], parts[2], page);
    }
    if (parts.length >= 3 && parts[0] === "person" && parts[1] !== "board" && /^\d+$/.test(parts[2])) {
        return buildPostUrl("person", parts[1], parts[2], page);
    }
    if (parts.length === 2 && parts[0] === "mini" && parts[1] !== "board") {
        return buildBoardPageUrl("mini", parts[1], pageNumber);
    }
    if (parts.length === 2 && parts[0] === "person" && parts[1] !== "board") {
        return buildBoardPageUrl("person", parts[1], pageNumber);
    }
    info.host = String(SYNURA.domain).toLowerCase();
    info.hash = "";
    return joinAbsoluteUrl(info);
}

function deepClone(value) {
    if (value === null || value === undefined) return value;
    return JSON.parse(JSON.stringify(value));
}

function normalizeWhitespace(value) {
    return String(value == null ? "" : value)
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getUseTwoCharCategory() {
    var raw = localStorage.getItem(CATEGORY_TWO_CHAR_KEY);
    if (raw === null || raw === undefined || raw === "") return true;
    var text = String(raw).trim().toLowerCase();
    return !(text === "false" || text === "0" || text === "off" || text === "no");
}

function setUseTwoCharCategory(enabled) {
    localStorage.setItem(CATEGORY_TWO_CHAR_KEY, enabled ? "true" : "false");
}

function formatBoardListCategory(value) {
    var text = normalizeWhitespace(value);
    if (!text) return "";
    if (!getUseTwoCharCategory()) return text;
    var compact = text.replace(/\s+/g, "");
    return compact.length <= 2 ? compact : compact.substring(0, 2);
}

function stringifyForConsole(value) {
    if (value === undefined) return "undefined";
    try {
        return JSON.stringify(value).replace(/%/g, "%%");
    } catch (e) {
        return String(value).replace(/%/g, "%%");
    }
}

function resolveEventViewId(event, fallbackViewId) {
    if (event && event.viewId !== undefined && event.viewId !== null) {
        var parsedEventViewId = parseInt(String(event.viewId), 10);
        if (parsedEventViewId > 0) return parsedEventViewId;
    }
    var parsedFallbackViewId = parseInt(String(fallbackViewId || 0), 10);
    return parsedFallbackViewId > 0 ? parsedFallbackViewId : 0;
}

function logViewEvent(event, fallbackViewId) {
    if (typeof console === "undefined" || !console || typeof console.log !== "function") return;
    var viewId = resolveEventViewId(event, fallbackViewId);
    var eventId = event && event.eventId ? String(event.eventId) : "";
    console.log(
        "[viewEvent] site=" + SITE.siteKey +
        " viewId=" + String(viewId || 0) +
        " eventId=" + eventId +
        " event=" + stringifyForConsole(event)
    );
}

function firstNonEmpty(values) {
    for (var i = 0; i < (values || []).length; i++) {
        var value = normalizeWhitespace(values[i]);
        if (value) return value;
    }
    return "";
}

function textOf(node) {
    if (!node) return "";
    return normalizeWhitespace(node.textContent || node.innerText || node.text || "");
}

function attrOf(node, name) {
    if (!node) return "";
    return normalizeWhitespace(node.getAttribute(name) || "");
}

function firstNode(root, selectors) {
    if (!root || !selectors) return null;
    for (var i = 0; i < selectors.length; i++) {
        var selector = selectors[i];
        if (!selector) continue;
        var found = root.querySelector(selector);
        if (found) return found;
    }
    return null;
}

function allNodes(root, selectors) {
    if (!root || !selectors) return [];
    for (var i = 0; i < selectors.length; i++) {
        var selector = selectors[i];
        if (!selector) continue;
        var found = root.querySelectorAll(selector);
        if (found && found.length > 0) return found;
    }
    return [];
}

function firstText(root, selectors) {
    return textOf(firstNode(root, selectors));
}

function textOfNodeWithoutSelectors(node, selectors) {
    if (!node) return "";
    if (!node.cloneNode || !selectors || selectors.length === 0) return textOf(node);
    var cloned = node.cloneNode(true);
    for (var i = 0; i < selectors.length; i++) {
        var selector = selectors[i];
        if (!selector) continue;
        var matches = cloned.querySelectorAll(selector);
        for (var j = 0; j < matches.length; j++) {
            if (matches[j] && matches[j].remove) matches[j].remove();
        }
    }
    return textOf(cloned);
}

function nearestAuthorContainer(node) {
    var current = node;
    while (current && current.getAttribute) {
        var className = " " + normalizeWhitespace(current.className || "") + " ";
        if (
            attrOf(current, "data-nick") ||
            attrOf(current, "user_name") ||
            className.indexOf(" gall_writer ") >= 0 ||
            className.indexOf(" ub-writer ") >= 0
        ) {
            return current;
        }
        current = current.parentElement || current.parentNode;
    }
    return node;
}

function inlineAuthorText(node) {
    if (!node) return "";
    var className = " " + normalizeWhitespace(node.className || "") + " ";
    var tagName = String(node.tagName || "").toLowerCase();
    if (
        className.indexOf(" nickname ") >= 0 ||
        className.indexOf(" nick ") >= 0 ||
        className.indexOf(" name ") >= 0 ||
        tagName === "b"
    ) {
        return textOf(node);
    }
    return textOf(firstNode(node, [".nickname", ".nick", ".name", "b"]));
}

function normalizeDcinsideIp(value) {
    return normalizeWhitespace(value).replace(/^\(/, "").replace(/\)$/, "");
}

function isDcinsideIp(value) {
    return /^\d{1,3}(?:\.\d{1,3}){1,3}$/.test(normalizeDcinsideIp(value));
}

function parseDcinsideAuthorLine(value) {
    var text = normalizeWhitespace(value);
    var matched = text.match(/^(.*)\((\d{1,3}(?:\.\d{1,3}){1,3})\)$/);
    if (!matched) {
        return {
            author: text,
            ip: ""
        };
    }
    return {
        author: normalizeWhitespace(matched[1]),
        ip: normalizeDcinsideIp(matched[2])
    };
}

function firstAuthorText(root, selectors) {
    if (!root || !selectors) return "";
    for (var i = 0; i < selectors.length; i++) {
        var selector = selectors[i];
        if (!selector) continue;
        var found = root.querySelector(selector);
        if (!found) continue;

        var container = nearestAuthorContainer(found);
        var author = firstNonEmpty([
            attrOf(container, "data-nick"),
            attrOf(container, "user_name"),
            attrOf(found, "data-nick"),
            attrOf(found, "user_name"),
            inlineAuthorText(found),
            inlineAuthorText(container),
            textOfNodeWithoutSelectors(container, [
                ".writer_nikcon",
                ".gall_date",
                ".gall_count",
                ".gall_reply_num",
                ".gall_comment",
                ".gall_scrap",
                ".date_time",
                ".ip"
            ])
        ]);
        if (!author) continue;

        var ip = normalizeDcinsideIp(firstNonEmpty([
            attrOf(container, "data-ip"),
            attrOf(found, "data-ip"),
            textOf(firstNode(container, [".ip"]))
        ]));
        if (ip) return author + "(" + ip + ")";
        return author;
    }
    return "";
}

function listInfoText(row, index) {
    var items = allNodes(row, [".ginfo li"]);
    if (!items || items.length <= index) return "";
    return textOf(items[index]);
}

function listBlockInfoNode(row) {
    var next = row ? row.nextSibling : null;
    var className = " " + normalizeWhitespace((next && next.className) || "") + " ";
    if (className.indexOf(" blockInfo ") >= 0) return next;
    return firstNode(row, [".blockInfo"]);
}

function listAuthorText(row) {
    var blockInfo = listBlockInfoNode(row);
    var visibleAuthorLine = textOfNodeWithoutSelectors(firstNode(row, [".ginfo li"]), [
        "img",
        ".sp-nick",
        ".icon_event"
    ]);
    var parsedVisibleAuthor = parseDcinsideAuthorLine(visibleAuthorLine);
    var author = firstNonEmpty([
        attrOf(blockInfo, "data-name"),
        parsedVisibleAuthor.author,
        firstAuthorText(row, SITE.selectors.listAuthor)
    ]);
    if (!author) return "";

    var ip = firstNonEmpty([
        isDcinsideIp(attrOf(blockInfo, "data-info")) ? attrOf(blockInfo, "data-info") : "",
        parsedVisibleAuthor.ip
    ]);
    ip = normalizeDcinsideIp(ip);
    return ip ? author + "(" + ip + ")" : author;
}

function parseCount(value) {
    return String(value == null ? "" : value).replace(/[^0-9]/g, "");
}

function toInt(value, fallback) {
    var cleaned = String(value == null ? "" : value).replace(/[^0-9-]/g, "");
    var parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? fallback : parsed;
}

function parseAbsoluteUrl(raw) {
    var input = String(raw || "").trim();
    if (!input) return null;
    if (input.indexOf("//") === 0) input = "https:" + input;
    var matched = input.match(/^(https?):\/\/([^\/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i);
    if (!matched) return null;
    return {
        scheme: matched[1].toLowerCase(),
        host: matched[2].toLowerCase(),
        path: matched[3] || "/",
        query: matched[4] ? matched[4].substring(1) : "",
        hash: matched[5] || ""
    };
}

function joinAbsoluteUrl(parts) {
    if (!parts) return "";
    return parts.scheme + "://" + parts.host + parts.path +
        (parts.query ? "?" + parts.query : "") +
        (parts.hash || "");
}

function dirname(path) {
    var value = path || "/";
    if (value === "/") return "/";
    var index = value.lastIndexOf("/");
    if (index <= 0) return "/";
    return value.substring(0, index + 1);
}

function isKnownHost(host) {
    var value = String(host || "").toLowerCase();
    if (!value) return false;
    if (value === String(SYNURA.domain).toLowerCase()) return true;
    var aliases = SITE.hostAliases || [];
    for (var i = 0; i < aliases.length; i++) {
        if (value === String(aliases[i] || "").toLowerCase()) return true;
    }
    return false;
}

function rewriteKnownHost(url) {
    var info = parseAbsoluteUrl(url);
    if (!info) return "";
    if (isKnownHost(info.host)) {
        info.host = String(SYNURA.domain).toLowerCase();
    }
    return joinAbsoluteUrl(info);
}

function ensureAbsoluteUrl(raw, baseUrl) {
    var href = String(raw || "").trim();
    if (!href) return "";
    if (href.charAt(0) === "#") return "";
    if (href.toLowerCase().indexOf("javascript:") === 0) return "";
    if (/^https?:\/\//i.test(href)) return rewriteKnownHost(href);
    if (href.indexOf("//") === 0) return rewriteKnownHost("https:" + href);

    var base = parseAbsoluteUrl(baseUrl || SITE.browserHomeUrl);
    if (!base) return "";

    if (href.charAt(0) === "?") {
        return joinAbsoluteUrl({
            scheme: base.scheme,
            host: base.host,
            path: base.path,
            query: href.substring(1),
            hash: ""
        });
    }

    if (href.charAt(0) === "/") {
        return joinAbsoluteUrl({
            scheme: base.scheme,
            host: String(SYNURA.domain).toLowerCase(),
            path: href,
            query: "",
            hash: ""
        });
    }

    return rewriteKnownHost(base.scheme + "://" + base.host + dirname(base.path) + href);
}

function normalizeUrl(raw) {
    var absolute = ensureAbsoluteUrl(raw, SITE.browserHomeUrl);
    if (!absolute) return "";
    return canonicalizeDcinsideUrl(absolute) || absolute;
}

function pathSegments(path) {
    var input = String(path || "");
    var parts = input.split("/");
    var out = [];
    for (var i = 0; i < parts.length; i++) {
        if (parts[i]) out.push(parts[i]);
    }
    return out;
}

function queryValue(queryString, name) {
    var params = new URLSearchParams(queryString || "");
    var value = params.get(name);
    return value == null ? "" : String(value);
}

function queryInt(queryString, name, fallback) {
    var value = queryValue(queryString, name);
    if (!value) return fallback;
    var parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
}

function setQueryParam(url, name, value) {
    var info = parseAbsoluteUrl(url);
    if (!info) return "";
    var params = new URLSearchParams(info.query || "");
    if (value === null || value === undefined || value === "") params.delete(name);
    else params.set(name, String(value));
    info.query = params.toString();
    return joinAbsoluteUrl(info);
}

function setPageParam(url, name, page) {
    return setQueryParam(url, name, page);
}

function boardById(id) {
    if (!id) return null;
    return boardIndex[id] || null;
}

function ensureBoard(id, url, fallbackTitle, kind, description) {
    var boardId = String(id || "").trim();
    if (!boardId) return null;
    var parts = splitBoardKey(boardId);
    var boardKind = normalizeBoardKind(kind || parts.kind);
    var boardSlug = normalizeWhitespace(parts.slug);
    if (!boardIndex[boardId]) {
        boardIndex[boardId] = {
            id: boardId,
            kind: boardKind,
            slug: boardSlug,
            title: fallbackTitle || boardSlug || boardId,
            url: normalizeUrl(url || buildBoardListUrl(boardKind, boardSlug)) || url,
            description: description || boardKindLabel(boardKind),
            group: "",
            dynamic: true
        };
    } else {
        if (fallbackTitle && (!boardIndex[boardId].title || boardIndex[boardId].title === boardSlug)) {
            boardIndex[boardId].title = fallbackTitle;
        }
        if (description && !boardIndex[boardId].description) {
            boardIndex[boardId].description = description;
        }
        if (url && !boardIndex[boardId].url) {
            boardIndex[boardId].url = normalizeUrl(url) || url;
        }
    }
    return boardIndex[boardId];
}

function readStoredJson(key, fallbackValue) {
    var raw = localStorage.getItem(key);
    if (raw === null || raw === undefined || raw === "") {
        return deepClone(fallbackValue);
    }
    if (typeof raw === "string") {
        try {
            return JSON.parse(raw);
        } catch (e) {
            return deepClone(fallbackValue);
        }
    }
    return deepClone(raw);
}

function writeStoredJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function sanitizeBoard(board, defaultDescription) {
    if (!board) return null;
    var input = deepClone(board);
    var parts = splitBoardKey(input.id || "");
    var kind = normalizeBoardKind(input.kind || parts.kind);
    var slug = normalizeWhitespace(input.slug || parts.slug);
    var id = makeBoardKey(kind, slug);
    if (!slug) return null;
    return {
        id: id,
        kind: kind,
        slug: slug,
        title: normalizeWhitespace(input.title) || slug,
        url: normalizeUrl(input.url || buildBoardListUrl(kind, slug)) || buildBoardListUrl(kind, slug),
        description: normalizeWhitespace(input.description) || defaultDescription || boardKindLabel(kind),
        group: normalizeWhitespace(input.group || ""),
        custom: !!input.custom,
        dynamic: !!input.dynamic
    };
}

function mergeBoards(preferred, fallback) {
    var next = sanitizeBoard(preferred || fallback);
    var base = sanitizeBoard(fallback || preferred);
    if (!next) return base;
    if (!base) return next;
    if ((!next.title || next.title === next.slug) && base.title) next.title = base.title;
    if ((!next.description || next.description === boardKindLabel(next.kind)) && base.description) {
        next.description = base.description;
    }
    if (!next.group && base.group) next.group = base.group;
    if (!next.url && base.url) next.url = base.url;
    return next;
}

function boardFromUrl(rawUrl, fallbackTitle, description) {
    var normalized = normalizeUrl(rawUrl);
    if (!normalized) return null;
    var info = parseAbsoluteUrl(normalized);
    if (!info || !isKnownHost(info.host)) return null;

    var parts = pathSegments(info.path);
    var kind = "board";
    var slug = "";
    if (info.path === "/board/lists" || info.path === "/board/lists/") {
        slug = normalizeWhitespace(queryValue(info.query, "id"));
    } else if (info.path === "/mini/board/lists" || info.path === "/mini/board/lists/") {
        kind = "mini";
        slug = normalizeWhitespace(queryValue(info.query, "id"));
    } else if (info.path === "/person/board/lists" || info.path === "/person/board/lists/") {
        kind = "person";
        slug = normalizeWhitespace(queryValue(info.query, "id"));
    } else if (parts.length === 2 && parts[0] === "board" && !/^\d+$/.test(parts[1])) {
        slug = normalizeWhitespace(parts[1]);
    } else if (parts.length === 2 && parts[0] === "mini" && parts[1] !== "board") {
        kind = "mini";
        slug = normalizeWhitespace(parts[1]);
    } else if (parts.length === 2 && parts[0] === "person" && parts[1] !== "board") {
        kind = "person";
        slug = normalizeWhitespace(parts[1]);
    } else {
        return null;
    }

    if (!slug) return null;
    return sanitizeBoard({
        id: makeBoardKey(kind, slug),
        kind: kind,
        slug: slug,
        title: fallbackTitle,
        url: buildBoardListUrl(kind, slug),
        description: description,
        dynamic: true
    }, description);
}

function cacheKey(kind, url) {
    return CACHE_PREFIX + kind + ":" + url;
}

function getCachedRoute(kind, url) {
    var cached = sessionStorage.getItem(cacheKey(kind, url));
    if (!cached) return null;
    var age = Date.now() - (cached.timestamp || 0);
    if (age > CACHE_TTL) {
        sessionStorage.removeItem(cacheKey(kind, url));
        return null;
    }
    return normalizeBoardMenusInRoute(deepClone(cached.route));
}

function setCachedRoute(kind, url, route) {
    var normalizedRoute = normalizeBoardMenusInRoute(deepClone(route));
    sessionStorage.setItem(cacheKey(kind, url), {
        timestamp: Date.now(),
        route: normalizedRoute
    });
}

function setViewState(viewId, state) {
    viewState[String(viewId)] = deepClone(state || {});
}

function getViewState(viewId) {
    return deepClone(viewState[String(viewId)] || {});
}

function getFirstHomeViewId() {
    var keys = Object.keys(viewState || {});
    var homeViewIds = [];
    for (var i = 0; i < keys.length; i++) {
        var rawId = String(keys[i] || "");
        var state = viewState[rawId];
        if (!state || state.kind !== "home") continue;
        var numericId = parseInt(rawId, 10);
        if (numericId > 0) homeViewIds.push(numericId);
    }
    if (homeViewIds.length === 0) return 0;
    homeViewIds.sort(function (a, b) { return a - b; });
    return homeViewIds[0];
}

function normalizeBoardMenusInRoute(route) {
    if (!route || !route.viewData || !route.viewData.models || !route.context) return route;
    var kind = normalizeWhitespace(route.context.kind || route.kind);
    if (kind !== "board" && kind !== "post") return route;
    route.viewData.models.menus = buildBoardContextMenus(
        route.context.boardId,
        kind === "board" ? firstNonEmpty([ route.context.link, route.url ]) : "",
        route.context.boardTitle
    );
    return route;
}

function rememberBoards(boards) {
    for (var i = 0; i < (boards || []).length; i++) {
        var board = sanitizeBoard(boards[i]);
        if (!board) continue;
        boardIndex[board.id] = mergeBoards(board, boardIndex[board.id]);
    }
}

function dedupeBoards(boards) {
    var map = {};
    var order = [];
    for (var i = 0; i < (boards || []).length; i++) {
        var board = sanitizeBoard(boards[i]);
        if (!board) continue;
        if (!map[board.id]) order.push(board.id);
        map[board.id] = mergeBoards(board, map[board.id]);
    }

    var out = [];
    for (var j = 0; j < order.length; j++) {
        out.push(map[order[j]]);
    }
    rememberBoards(out);
    return out;
}

function getSeedBoards() {
    return dedupeBoards(SITE.boards || []);
}

function getDiscoveredBoardsMeta() {
    return readStoredJson(DISCOVERED_BOARDS_META_KEY, {});
}

function getDiscoveredBoards() {
    return dedupeBoards(readStoredJson(DISCOVERED_BOARDS_KEY, []));
}

function hasFreshDiscoveredBoards() {
    var meta = getDiscoveredBoardsMeta();
    if (!meta || !meta.timestamp) return false;
    return Date.now() - meta.timestamp < DISCOVERED_BOARDS_MAX_AGE;
}

function hasFreshFullDiscoveredBoards() {
    var meta = getDiscoveredBoardsMeta();
    return !!(meta && meta.mode === "full" && meta.timestamp && (Date.now() - meta.timestamp < DISCOVERED_BOARDS_MAX_AGE));
}

function saveDiscoveredBoards(boards, mode) {
    var sanitized = dedupeBoards(boards);
    writeStoredJson(DISCOVERED_BOARDS_KEY, sanitized);
    writeStoredJson(DISCOVERED_BOARDS_META_KEY, {
        timestamp: Date.now(),
        count: sanitized.length,
        mode: mode || "shallow"
    });
    rememberBoards(sanitized);
}

function getCustomBoards() {
    return dedupeBoards(readStoredJson(CUSTOM_BOARDS_KEY, []));
}

function saveCustomBoards(boards) {
    var sanitized = dedupeBoards(boards);
    for (var i = 0; i < sanitized.length; i++) {
        sanitized[i].custom = true;
    }
    writeStoredJson(CUSTOM_BOARDS_KEY, sanitized);
    rememberBoards(sanitized);
}

function getBoardOrder() {
    return readStoredJson(BOARD_ORDER_KEY, []);
}

function saveBoardOrder(order) {
    writeStoredJson(BOARD_ORDER_KEY, order || []);
}

function getVisibleMap() {
    return readStoredJson(VISIBLE_BOARDS_KEY, {});
}

function saveVisibleMap(visibleMap) {
    writeStoredJson(VISIBLE_BOARDS_KEY, visibleMap || {});
}

function saveSelectedDiscoveredBoards(boards) {
    var sanitized = dedupeBoards(boards);
    var meta = getDiscoveredBoardsMeta();
    writeStoredJson(DISCOVERED_BOARDS_KEY, sanitized);
    writeStoredJson(DISCOVERED_BOARDS_META_KEY, {
        timestamp: meta && meta.timestamp ? meta.timestamp : Date.now(),
        count: sanitized.length,
        mode: meta && meta.mode ? meta.mode : "partial"
    });
    rememberBoards(sanitized);
    return sanitized;
}

function persistBoardSelection(board) {
    var safeBoard = sanitizeBoard(board);
    if (!safeBoard) return null;
    var discovered = getDiscoveredBoards();
    var exists = false;
    for (var i = 0; i < discovered.length; i++) {
        if (discovered[i].id === safeBoard.id) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        discovered.push(safeBoard);
        saveSelectedDiscoveredBoards(discovered);
    }
    var order = getBoardOrder();
    if (order.indexOf(safeBoard.id) < 0) {
        order.push(safeBoard.id);
        saveBoardOrder(order);
    }
    return ensureBoard(safeBoard.id, safeBoard.url, safeBoard.title, safeBoard.kind, safeBoard.description);
}

function setBoardHomeVisibility(board, nextVisible) {
    var safeBoard = sanitizeBoard(board);
    if (!safeBoard) return null;
    if (nextVisible) {
        safeBoard = persistBoardSelection(safeBoard) || safeBoard;
    }
    var visible = getVisibleMap();
    visible[safeBoard.id] = !!nextVisible;
    saveVisibleMap(visible);
    rememberBoards(getSortedBoards());
    return {
        board: safeBoard,
        visible: !!nextVisible
    };
}

function toggleBoardHomeVisibilityById(boardId) {
    var board = boardById(boardId);
    if (!board) return null;
    return setBoardHomeVisibility(board, !isBoardVisible(board, getVisibleMap()));
}

function resolveBoardForHomeToggle(boardId, boardUrl, boardTitle) {
    var safeBoardId = normalizeWhitespace(boardId);
    if (!safeBoardId) return null;
    return boardById(safeBoardId) || ensureBoard(safeBoardId, boardUrl, boardTitle);
}

function buildBoardHomeToggleMenu(boardId, boardUrl, boardTitle) {
    var board = resolveBoardForHomeToggle(boardId, boardUrl, boardTitle);
    return {
        label: MENU_HOME_TOGGLE,
        checked: !!(board && isBoardVisible(board, getVisibleMap()))
    };
}

function buildBoardContextMenus(boardId, boardUrl, boardTitle) {
    return [
        MENU_BROWSER,
        buildBoardHomeToggleMenu(boardId, boardUrl, boardTitle)
    ];
}

function getAllBoards() {
    return dedupeBoards(getSeedBoards().concat(getDiscoveredBoards(), getCustomBoards()));
}

function getDefaultVisibleIds() {
    var visible = {};
    var seeds = getSeedBoards();
    for (var i = 0; i < seeds.length && i < DEFAULT_VISIBLE_COUNT; i++) {
        visible[seeds[i].id] = true;
    }
    return visible;
}

function isBoardVisible(board, visibleMap) {
    if (!board) return false;
    var visible = visibleMap || {};
    if (Object.prototype.hasOwnProperty.call(visible, board.id)) {
        return !!visible[board.id];
    }
    if (board.custom) return true;
    return !!getDefaultVisibleIds()[board.id];
}

function getSortedBoards() {
    var boards = getAllBoards();
    var boardMap = {};
    for (var i = 0; i < boards.length; i++) {
        boardMap[boards[i].id] = boards[i];
    }

    var ordered = [];
    var seen = {};
    var order = getBoardOrder();
    for (var j = 0; j < order.length; j++) {
        if (boardMap[order[j]] && !seen[order[j]]) {
            ordered.push(boardMap[order[j]]);
            seen[order[j]] = true;
        }
    }
    for (var k = 0; k < boards.length; k++) {
        if (!seen[boards[k].id]) {
            ordered.push(boards[k]);
        }
    }
    rememberBoards(ordered);
    return ordered;
}

function getVisibleBoards() {
    var visibleMap = getVisibleMap();
    var boards = getSortedBoards();
    var out = [];
    for (var i = 0; i < boards.length; i++) {
        if (isBoardVisible(boards[i], visibleMap)) out.push(boards[i]);
    }
    return out;
}

function getHomeBoards() {
    return getVisibleBoards();
}

function cleanBoardAnchorText(value) {
    return normalizeWhitespace(value)
        .replace(/^\d+\.\s*/, "")
        .replace(/\(\d+\)\s*$/, "")
        .replace(/\s*[\[\(]?\d+[\]\)]\s*$/, "");
}

function extractBoardAnchorTitle(anchor) {
    return cleanBoardAnchorText(firstNonEmpty([
        firstText(anchor, [".rank_txt", ".gall", ".fx-elpin", ".txt", "strong"]),
        textOf(anchor)
    ]));
}

function cleanBoardGroupLabel(value) {
    return normalizeWhitespace(value)
        .replace(/\s*\(\d+\)\s*$/, "")
        .replace(/\s*갤러리\s*$/g, "")
        .trim();
}

function buildBoardFromInput(input, title) {
    var raw = normalizeWhitespace(input);
    var label = normalizeWhitespace(title);
    if (!raw) return null;

    var board = null;
    if (/^https?:\/\//i.test(raw) || raw.charAt(0) === "/" || /^m\.dcinside\.com\//i.test(raw)) {
        board = boardFromUrl(raw, label, "사용자 추가");
    }

    if (!board && /^[a-z]+:/i.test(raw) && raw.indexOf("://") < 0) {
        var parts = raw.split(":");
        if (parts.length === 2 && parts[1]) {
            board = sanitizeBoard({
                id: makeBoardKey(parts[0], parts[1]),
                kind: parts[0],
                slug: parts[1],
                title: label || parts[1],
                url: buildBoardListUrl(parts[0], parts[1]),
                description: "사용자 추가",
                custom: true
            }, "사용자 추가");
        }
    }

    if (!board) {
        board = sanitizeBoard({
            id: makeBoardKey("board", raw),
            kind: "board",
            slug: raw,
            title: label || raw,
            url: buildBoardListUrl("board", raw),
            description: "사용자 추가",
            custom: true
        }, "사용자 추가");
    }

    if (!board) return null;
    board.custom = true;
    if (label) board.title = label;
    return board;
}

function addCustomBoard(input, title) {
    var board = buildBoardFromInput(input, title);
    if (!board) {
        return {
            ok: false,
            error: "올바른 갤러리 URL 또는 ID를 입력하세요."
        };
    }

    var allBoards = getAllBoards();
    for (var i = 0; i < allBoards.length; i++) {
        if (allBoards[i].id === board.id) {
            return {
                ok: false,
                error: "이미 추가된 갤러리입니다."
            };
        }
    }

    var customBoards = getCustomBoards();
    customBoards.push(board);
    saveCustomBoards(customBoards);

    var visible = getVisibleMap();
    visible[board.id] = true;
    saveVisibleMap(visible);

    var order = getBoardOrder();
    if (order.indexOf(board.id) < 0) {
        order.push(board.id);
        saveBoardOrder(order);
    }

    rememberBoards([board]);
    return {
        ok: true,
        board: board
    };
}

function shouldUseBrowserCookieAuth() {
    return !!SITE.browserCookieAuth;
}

function getSavedCookie() {
    var cookie = localStorage.getItem(COOKIE_KEY);
    return typeof cookie === "string" ? cookie : "";
}

function setSavedCookie(cookie) {
    var value = normalizeWhitespace(cookie);
    if (!value) {
        localStorage.removeItem(COOKIE_KEY);
        return "";
    }
    localStorage.setItem(COOKIE_KEY, value);
    return value;
}

function buildFetchOptions() {
    var options = {
        bypass: SYNURA.bypass
    };
    var cookie = getSavedCookie();
    if (cookie) {
        options.headers = {
            "Cookie": cookie
        };
    }
    return options;
}

function fetchWithLogging(url, options) {
    if (typeof console !== "undefined" && console && typeof console.log === "function") {
        console.log(url);
    }
    return fetch(url, options);
}

function isBrowserAuthRequiredStatus(status) {
    return status === 429 || status === 430;
}

function makeAuthRequiredError(url, status) {
    return new Error(AUTH_ERROR_PREFIX + String(status || 0) + ":" + (normalizeUrl(url) || String(url || "")));
}

function parseAuthRequiredError(error) {
    var text = String(error || "");
    if (text.indexOf("Error: " + AUTH_ERROR_PREFIX) === 0) {
        text = text.substring(7);
    }
    if (text.indexOf(AUTH_ERROR_PREFIX) !== 0) return null;

    var payload = text.substring(AUTH_ERROR_PREFIX.length);
    var split = payload.indexOf(":");
    if (split < 0) {
        return {
            status: 0,
            url: normalizeUrl(payload) || payload
        };
    }

    var status = parseInt(payload.substring(0, split), 10);
    return {
        status: isNaN(status) ? 0 : status,
        url: normalizeUrl(payload.substring(split + 1)) || payload.substring(split + 1)
    };
}

function listFromDetails(items) {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (Array.isArray(items.details)) return items.details;
    return [];
}

function absolutizeDetails(details, baseUrl) {
    var out = [];
    for (var i = 0; i < (details || []).length; i++) {
        var item = deepClone(details[i]);
        if (!item) continue;
        if (item.type === "image" || item.type === "video") {
            item.value = ensureAbsoluteUrl(item.value, baseUrl) || item.value;
            if (item.link) item.link = ensureAbsoluteUrl(item.link, baseUrl) || item.link;
        } else if (item.type === "link") {
            item.link = ensureAbsoluteUrl(item.link || item.value, baseUrl) || item.link || item.value;
        }
        out.push(item);
    }
    return out;
}

function isPlaceholderMediaUrl(value) {
    return /loading|placeholder|spacer|blank|transparent|noimg|thumb_default/i.test(String(value || ""));
}

function collectResolvedImageUrls(element, baseUrl) {
    if (!element) return [];
    var nodes = element.querySelectorAll("img");
    var out = [];
    var seen = {};
    for (var i = 0; i < nodes.length; i++) {
        var resolved = ensureAbsoluteUrl(firstNonEmpty([
            attrOf(nodes[i], "data-original"),
            attrOf(nodes[i], "data-src"),
            attrOf(nodes[i], "data-lazy-src"),
            attrOf(nodes[i], "data-file"),
            attrOf(nodes[i], "data-url"),
            attrOf(nodes[i], "src")
        ]), baseUrl);
        if (!resolved || seen[resolved]) continue;
        seen[resolved] = true;
        out.push(resolved);
    }
    return out;
}

function fixParsedMediaDetails(details, element, baseUrl) {
    var out = deepClone(details || []);
    var images = collectResolvedImageUrls(element, baseUrl);
    var imageCursor = 0;
    var hasImage = false;
    for (var i = 0; i < out.length; i++) {
        if (!out[i] || out[i].type !== "image") continue;
        hasImage = true;
        var candidate = images[imageCursor] || "";
        if (candidate && (!out[i].value || isPlaceholderMediaUrl(out[i].value))) {
            out[i].value = candidate;
            if (!out[i].link) out[i].link = candidate;
        }
        imageCursor += 1;
    }
    if (!hasImage && images.length > 0) {
        for (var j = 0; j < images.length; j++) {
            out.push({
                type: "image",
                value: images[j],
                link: images[j]
            });
        }
    }
    return out;
}

function appendImageHeaders(details, refererUrl) {
    var out = deepClone(details || []);
    var referer = normalizeUrl(refererUrl) || ensureAbsoluteUrl(refererUrl, SITE.browserHomeUrl) || "";
    if (!referer) return out;
    for (var i = 0; i < out.length; i++) {
        if (!out[i] || out[i].type !== "image") continue;
        var headers = out[i].headers;
        if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
            headers = {};
        } else {
            headers = deepClone(headers);
        }
        headers["Referer"] = referer;
        out[i].headers = headers;
    }
    return out;
}

function pushSchemaObjects(value, bucket) {
    if (!value) return;
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            pushSchemaObjects(value[i], bucket);
        }
        return;
    }
    if (typeof value !== "object") return;
    bucket.push(value);
    if (value["@graph"]) pushSchemaObjects(value["@graph"], bucket);
}

function detectSchemaPost(doc) {
    var scripts = doc ? doc.querySelectorAll("script") : [];
    var objects = [];
    for (var i = 0; i < scripts.length; i++) {
        var type = attrOf(scripts[i], "type").toLowerCase();
        if (type && type.indexOf("ld+json") < 0) continue;
        var raw = String(scripts[i].textContent || "").trim();
        if (!raw || raw.indexOf("{") < 0) continue;
        try {
            pushSchemaObjects(JSON.parse(raw), objects);
        } catch (e) {
        }
    }

    for (var j = 0; j < objects.length; j++) {
        var rawType = objects[j] && objects[j]["@type"];
        var types = Array.isArray(rawType) ? rawType : [rawType];
        for (var k = 0; k < types.length; k++) {
            var normalizedType = normalizeWhitespace(types[k]).toLowerCase();
            if (normalizedType === "discussionforumposting" || normalizedType === "article" || normalizedType === "newsarticle") {
                return {
                    headline: firstNonEmpty([objects[j].headline, objects[j].name]),
                    articleBody: normalizeWhitespace(objects[j].articleBody || "")
                };
            }
        }
    }
    return null;
}

function parseDetails(element, baseUrl) {
    if (!element) return [];
    try {
        var parsed = synura.parse("post", element);
        if (parsed && parsed.length > 0) {
            return appendImageHeaders(fixParsedMediaDetails(absolutizeDetails(parsed, baseUrl), element, baseUrl), baseUrl);
        }
    } catch (e) {
    }
    var images = collectResolvedImageUrls(element, baseUrl);
    if (images.length > 0) {
        var media = [];
        for (var i = 0; i < images.length; i++) {
            media.push({ type: "image", value: images[i], link: images[i] });
        }
        return appendImageHeaders(media, baseUrl);
    }
    var text = textOf(element);
    return text ? [{ type: "text", value: text }] : [];
}

function cleanPageTitle(title) {
    var value = normalizeWhitespace(title);
    var suffixes = SITE.titleSuffixes || [];
    var changed = true;
    while (changed) {
        changed = false;
        for (var i = 0; i < suffixes.length; i++) {
            var suffix = String(suffixes[i] || "");
            if (!suffix) continue;
            if (value.toLowerCase().endsWith(suffix.toLowerCase())) {
                value = normalizeWhitespace(value.substring(0, value.length - suffix.length));
                changed = true;
            }
        }
    }
    var prefixes = [
        SITE.displayName + " - ",
        SITE.displayName + " : ",
        SITE.displayName + "|",
        SYNURA.name + " - ",
        SYNURA.name + " : ",
        SYNURA.name + "|"
    ];
    changed = true;
    while (changed) {
        changed = false;
        for (var j = 0; j < prefixes.length; j++) {
            var prefix = normalizeWhitespace(prefixes[j]);
            if (!prefix) continue;
            if (value.toLowerCase().indexOf(prefix.toLowerCase()) === 0) {
                value = normalizeWhitespace(value.substring(prefix.length));
                changed = true;
            }
        }
    }
    return value;
}

function detectBoardTitle(doc, board) {
    var titleNode = firstNode(doc, ["title"]);
    var prefersConfigured = board && !board.dynamic;
    return firstNonEmpty([
        prefersConfigured ? board.title : "",
        cleanPageTitle(textOf(titleNode)),
        prefersConfigured ? "" : (board ? board.title : ""),
        firstText(doc, SITE.selectors.boardTitle),
        SITE.displayName
    ]);
}

function isAllowedListLink(link) {
    var patterns = SITE.linkAllowPatterns || [];
    if (!link) return false;
    if (!patterns || patterns.length === 0) return true;
    for (var i = 0; i < patterns.length; i++) {
        if (new RegExp(patterns[i]).test(link)) return true;
    }
    return false;
}

function extractListLink(row, baseUrl) {
    var selectors = SITE.selectors.listLink || [];
    var patterns = SITE.linkAllowPatterns || [];
    var fallbacks = [];
    for (var i = 0; i < selectors.length; i++) {
        var selector = selectors[i];
        if (!selector) continue;
        var nodes = row.querySelectorAll(selector);
        for (var j = 0; j < nodes.length; j++) {
            var candidate = ensureAbsoluteUrl(attrOf(nodes[j], "href"), baseUrl);
            if (!candidate) continue;
            if (isAllowedListLink(candidate)) return candidate;
            if (fallbacks.indexOf(candidate) < 0) fallbacks.push(candidate);
        }
    }

    var rowHref = ensureAbsoluteUrl(attrOf(row, "href"), baseUrl);
    if (rowHref) {
        if (isAllowedListLink(rowHref)) return rowHref;
        if (fallbacks.indexOf(rowHref) < 0) fallbacks.push(rowHref);
    }

    if (patterns.length > 0) return "";
    return fallbacks.length > 0 ? fallbacks[0] : "";
}

function imageUrlFromNode(node, baseUrl) {
    if (!node) return "";
    return ensureAbsoluteUrl(firstNonEmpty([
        attrOf(node, "data-original"),
        attrOf(node, "data-src"),
        attrOf(node, "src")
    ]), baseUrl);
}

function extractRowPostId(row) {
    if (!row) return "";
    var fromDataset = normalizeWhitespace(row.dataset ? row.dataset.no : "");
    if (fromDataset) return fromDataset;
    return normalizeWhitespace(attrOf(row, "data-no"));
}

function fallbackListLink(row, baseUrl, match) {
    var board = match && match.board ? match.board : boardFromUrl(baseUrl, "", "");
    var postId = extractRowPostId(row);
    if (!board || !postId) return "";
    return buildPostUrl(board.kind, board.slug, postId, "1");
}

function extractListItem(row, baseUrl, match) {
    var linkNode = firstNode(row, SITE.selectors.listLink);
    var link = extractListLink(row, baseUrl);
    if (!link) {
        link = fallbackListLink(row, baseUrl, match);
    }
    if (!link) return null;

    var title = firstNonEmpty([
        firstText(row, SITE.selectors.listTitle),
        textOf(linkNode),
        textOf(row)
    ]);
    if (!title) return null;

    var commentCount = parseCount(firstText(row, SITE.selectors.listCommentCount));
    var date = firstNonEmpty([
        firstText(row, SITE.selectors.listDate),
        listInfoText(row, 1)
    ]);
    var viewCount = parseCount(firstNonEmpty([
        firstText(row, SITE.selectors.listViewCount),
        listInfoText(row, 2)
    ]));
    var likeCount = parseCount(firstNonEmpty([
        firstText(row, SITE.selectors.listLikeCount),
        listInfoText(row, 3)
    ]));
    var mediaUrl = imageUrlFromNode(firstNode(row, SITE.selectors.listImage), baseUrl);
    var types = [];
    if (mediaUrl) types.push("image");
    var author = listAuthorText(row);

    return {
        link: normalizeUrl(link) || link,
        title: title,
        author: author,
        date: date,
        category: firstText(row, SITE.selectors.listCategory),
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

function parseBoardItems(doc, baseUrl, match) {
    var rows = allNodes(doc, SITE.selectors.listRows);
    var items = [];
    var seen = {};
    for (var i = 0; i < rows.length; i++) {
        var item = extractListItem(rows[i], baseUrl, match);
        if (!item || !item.link || seen[item.link]) continue;
        seen[item.link] = true;
        item.category = formatBoardListCategory(item.category || "");
        items.push(item);
    }
    return items;
}

function filterItemsForBoard(items, match) {
    var param = SITE.listBoardQueryParam || "";
    if (!param || !match || !match.board || !match.board.id) return items;

    var filtered = [];
    for (var i = 0; i < (items || []).length; i++) {
        var item = items[i];
        var info = parseAbsoluteUrl(item ? item.link : "");
        if (!info) continue;
        if (queryValue(info.query, param) === String(match.board.id)) {
            filtered.push(item);
        }
    }
    return filtered.length > 0 ? filtered : items;
}

function detectCommentLevel(row) {
    var attrs = SITE.commentLevelAttrs || [];
    var levelNode = firstNode(row, SITE.selectors.commentLevel);
    var candidates = [];
    if (levelNode) candidates.push(levelNode);
    candidates.push(row);
    for (var i = 0; i < candidates.length; i++) {
        var node = candidates[i];
        if (!node) continue;
        for (var j = 0; j < attrs.length; j++) {
            var raw = attrOf(node, attrs[j]);
            if (!raw) continue;
            var parsed = parseInt(raw, 10);
            if (!isNaN(parsed)) return parsed;
        }
    }
    return 0;
}

function parseComments(doc, postUrl) {
    var rows = allNodes(doc, SITE.selectors.commentRows);
    var comments = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var contentRoot = firstNode(row, SITE.selectors.commentContent);
        var content = parseDetails(contentRoot, postUrl);
        if (!content || content.length === 0) {
            var rawText = firstText(row, SITE.selectors.commentContent);
            if (rawText) content = [{ type: "text", value: rawText }];
        }
        if (!content || content.length === 0) continue;

        var likeCount = parseCount(firstText(row, SITE.selectors.commentLikeCount));
        comments.push({
            link: postUrl + "#comment-" + (i + 1),
            author: firstAuthorText(row, SITE.selectors.commentAuthor),
            content: content,
            date: firstText(row, SITE.selectors.commentDate),
            likeCount: likeCount,
            dislikeCount: "",
            level: detectCommentLevel(row),
            menus: [],
            hotCount: toInt(likeCount, 0),
            coldCount: toInt(likeCount, 0)
        });
    }
    return comments;
}

function extractBoardsFromDocument(doc, baseUrl, description, group, bucket) {
    var anchors = doc.querySelectorAll("a[href]");
    for (var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        var board = boardFromUrl(attrOf(anchor, "href"), extractBoardAnchorTitle(anchor), description);
        if (!board) continue;
        if (!board.title || board.title === board.slug) {
            board.title = extractBoardAnchorTitle(anchor) || board.slug;
        }
        if (description && (!board.description || board.description === boardKindLabel(board.kind))) {
            board.description = description;
        }
        if (group && !board.group) {
            board.group = cleanBoardGroupLabel(group);
        }
        bucket[board.id] = mergeBoards(board, bucket[board.id]);
    }
}

function extractCategoryDiscoveryEntries(doc) {
    var anchors = doc.querySelectorAll("a[href]");
    var urls = [];
    var seen = {};
    for (var i = 0; i < anchors.length; i++) {
        var candidate = normalizeUrl(attrOf(anchors[i], "href"));
        var info = parseAbsoluteUrl(candidate);
        if (!info) continue;
        if (!/^\/(category|mcategory|micategory|prcategory)\/\d+$/.test(info.path)) continue;
        if (seen[candidate]) continue;
        seen[candidate] = true;
        urls.push({
            url: candidate,
            label: cleanBoardGroupLabel(firstNonEmpty([
                attrOf(anchors[i], "title"),
                textOf(anchors[i])
            ]))
        });
    }
    return urls;
}

function categoryKindLabelForUrl(url) {
    var info = parseAbsoluteUrl(url);
    var path = info ? info.path : "";
    if (path.indexOf("/micategory") === 0) return "미니 갤러리";
    if (path.indexOf("/prcategory") === 0) return "인물 갤러리";
    if (path.indexOf("/mcategory") === 0) return "마이너 갤러리";
    return "갤러리";
}

function detectCategoryGroupLabel(doc, fallbackLabel) {
    var label = cleanBoardGroupLabel(firstNonEmpty([
        firstText(doc, [".page_head h2", ".left_content h3", ".cate-box .txt", "h2", "h3"]),
        fallbackLabel
    ]));
    if (label && label !== "갤러리" && label !== "마이너" && label !== "미니" && label !== "인물") {
        return label;
    }
    return cleanBoardGroupLabel(fallbackLabel);
}

function getCategoryRootSpecs() {
    return CATEGORY_ROOT_SPECS.slice();
}

function getCategoryRootSpec(rootKey) {
    var key = normalizeWhitespace(rootKey);
    for (var i = 0; i < CATEGORY_ROOT_SPECS.length; i++) {
        if (CATEGORY_ROOT_SPECS[i].key === key) return CATEGORY_ROOT_SPECS[i];
    }
    return null;
}

function normalizeCategoryRootCache(cache) {
    var next = deepClone(cache || {});
    if (!next || typeof next !== "object") next = {};
    if (!next.roots || typeof next.roots !== "object") next.roots = {};
    return next;
}

function getCategoryRootCache() {
    if (!categoryRootCache) {
        categoryRootCache = normalizeCategoryRootCache(readStoredJson(CATEGORY_ROOTS_KEY, { roots: {} }));
    }
    return categoryRootCache;
}

function saveCategoryRootCache(cache) {
    categoryRootCache = normalizeCategoryRootCache(cache);
    writeStoredJson(CATEGORY_ROOTS_KEY, categoryRootCache);
    return categoryRootCache;
}

function getCachedCategoryRootEntries(rootKey) {
    var cache = getCategoryRootCache();
    var entry = cache.roots[normalizeWhitespace(rootKey)] || {};
    return Array.isArray(entry.categories) ? entry.categories.slice() : [];
}

function saveCachedCategoryRootEntries(rootKey, categories) {
    var spec = getCategoryRootSpec(rootKey);
    var cache = getCategoryRootCache();
    var safeRootKey = normalizeWhitespace(rootKey);
    cache.roots[safeRootKey] = {
        key: safeRootKey,
        title: spec ? spec.title : safeRootKey,
        url: spec ? spec.url : "",
        categories: deepClone(categories || []),
        fetchedAt: Date.now()
    };
    saveCategoryRootCache(cache);
}

function extractCategoryRootEntries(doc, rootKey) {
    var entries = [];
    var seen = {};
    var anchors = doc.querySelectorAll("a[href]");
    var expectedPrefix = "/" + normalizeWhitespace(rootKey) + "/";

    for (var i = 0; i < anchors.length; i++) {
        var href = normalizeUrl(attrOf(anchors[i], "href"));
        var info = parseAbsoluteUrl(href);
        if (!info || !isKnownHost(info.host)) continue;
        if (info.path.indexOf(expectedPrefix) !== 0) continue;
        var parts = pathSegments(info.path);
        if (parts.length !== 2 || parts[0] !== normalizeWhitespace(rootKey) || !/^\d+$/.test(parts[1])) continue;

        var categoryId = parts[1];
        if (seen[categoryId]) continue;

        var title = cleanBoardGroupLabel(firstNonEmpty([
            textOfNodeWithoutSelectors(anchors[i], [".gall-ct", ".sp-arrow"]),
            attrOf(anchors[i], "title"),
            textOf(anchors[i])
        ]));
        if (!title) continue;

        seen[categoryId] = true;
        entries.push({
            key: rootKey + ":" + categoryId,
            rootKey: rootKey,
            categoryId: categoryId,
            title: title,
            url: href,
            count: toInt(firstText(anchors[i], [".gall-ct"]), 0)
        });
    }

    return entries;
}

function fetchCategoryRootEntries(rootKey) {
    var spec = getCategoryRootSpec(rootKey);
    if (!spec) throw new Error("알 수 없는 카테고리입니다.");
    var doc = fetchDocument(spec.url);
    var categories = extractCategoryRootEntries(doc, rootKey);
    if (categories.length === 0) {
        throw new Error(spec.title + " 카테고리를 가져오지 못했습니다.");
    }
    saveCachedCategoryRootEntries(rootKey, categories);
    return categories;
}

function ensureCategoryRootEntries(rootKey) {
    var categories = getCachedCategoryRootEntries(rootKey);
    if (categories.length > 0) return categories;
    return fetchCategoryRootEntries(rootKey);
}

function getCachedCategoryBoardRecord(rootKey, categoryId) {
    return categoryBoardCache[normalizeWhitespace(rootKey) + ":" + normalizeWhitespace(categoryId)] || null;
}

function setCachedCategoryBoardRecord(record) {
    if (!record || !record.key) return null;
    categoryBoardCache[record.key] = deepClone(record);
    return categoryBoardCache[record.key];
}

function getCategoryRecordMeta(rootKey, categoryId) {
    var categories = getCachedCategoryRootEntries(rootKey);
    for (var i = 0; i < categories.length; i++) {
        if (normalizeWhitespace(categories[i].categoryId) === normalizeWhitespace(categoryId)) {
            return categories[i];
        }
    }
    categories = ensureCategoryRootEntries(rootKey);
    for (var j = 0; j < categories.length; j++) {
        if (normalizeWhitespace(categories[j].categoryId) === normalizeWhitespace(categoryId)) {
            return categories[j];
        }
    }
    return null;
}

function fetchCategoryBoardRecord(rootKey, categoryId) {
    var spec = getCategoryRootSpec(rootKey);
    if (!spec) throw new Error("알 수 없는 카테고리입니다.");

    var meta = getCategoryRecordMeta(rootKey, categoryId) || {};
    var categoryUrl = normalizeUrl(meta.url || (spec.url + "/" + encodeURIComponent(String(categoryId))));
    var categoryDoc = fetchDocument(categoryUrl);
    var bucket = {};
    var groupLabel = cleanBoardGroupLabel(firstNonEmpty([
        meta.title,
        detectCategoryGroupLabel(categoryDoc, spec.title || ""),
        spec.title
    ]));

    extractBoardsFromDocument(categoryDoc, categoryUrl, spec.title, groupLabel, bucket);

    var boards = [];
    for (var key in bucket) {
        if (!Object.prototype.hasOwnProperty.call(bucket, key)) continue;
        var board = sanitizeBoard(bucket[key], spec.title);
        if (!board) continue;
        board.group = groupLabel || board.group || "";
        if (!board.description || board.description === boardKindLabel(board.kind)) {
            board.description = spec.title;
        }
        board.dynamic = true;
        boards.push(board);
    }

    if (boards.length === 0) {
        throw new Error((meta.title || spec.title) + " 보드를 가져오지 못했습니다.");
    }

    rememberBoards(boards);
    return setCachedCategoryBoardRecord({
        key: rootKey + ":" + categoryId,
        rootKey: rootKey,
        categoryId: String(categoryId),
        title: groupLabel || meta.title || spec.title,
        url: categoryUrl,
        count: meta.count || 0,
        boards: boards,
        fetchedAt: Date.now()
    });
}

function ensureCategoryBoardRecord(rootKey, categoryId) {
    var cached = getCachedCategoryBoardRecord(rootKey, categoryId);
    if (cached && Array.isArray(cached.boards) && cached.boards.length > 0) return deepClone(cached);
    return fetchCategoryBoardRecord(rootKey, categoryId);
}

function buildCategoryRootHomeItems() {
    var specs = getCategoryRootSpecs();
    var items = [];
    for (var i = 0; i < specs.length; i++) {
        var categoryCount = getCachedCategoryRootEntries(specs[i].key).length;
        items.push({
            id: specs[i].key,
            title: specs[i].title,
            description: categoryCount > 0 ? ("카테고리 " + categoryCount + "개") : "카테고리 목록",
            category: specs[i].url.replace(/^https?:\/\//, ""),
            author: "",
            date: "",
            commentCount: "",
            viewCount: "",
            likeCount: "",
            types: ["link"],
            menus: [],
            hotCount: categoryCount,
            coldCount: 0
        });
    }
    return items;
}

function buildCategorySectionItems(rootKey) {
    var spec = getCategoryRootSpec(rootKey);
    var categories = ensureCategoryRootEntries(rootKey);
    var items = [];
    for (var i = 0; i < categories.length; i++) {
        items.push({
            id: categories[i].categoryId,
            title: categories[i].title,
            description: categories[i].url.replace(/^https?:\/\//, ""),
            category: (categories[i].count > 0 ? (categories[i].count + "개 갤러리") : (spec ? spec.title : "")),
            author: "",
            date: "",
            commentCount: "",
            viewCount: "",
            likeCount: "",
            types: ["link"],
            menus: [],
            hotCount: categories[i].count || 0,
            coldCount: 0
        });
    }
    return items;
}

function buildCategoryBoardItems(record, startIndex, pageSize) {
    var boards = record && Array.isArray(record.boards) ? record.boards : [];
    var visibleMap = getVisibleMap();
    var start = Math.max(0, toInt(startIndex, 0));
    var size = Math.max(1, toInt(pageSize, CATEGORY_BROWSER_PAGE_SIZE));
    var end = Math.min(boards.length, start + size);
    var items = [];

    for (var i = start; i < end; i++) {
        var board = boards[i];
        var isVisible = isBoardVisible(board, visibleMap);
        items.push({
            id: board.id,
            link: board.url,
            title: board.title,
            description: board.description || board.url.replace(/^https?:\/\//, ""),
            category: board.group || boardKindLabel(board.kind),
            author: "",
            date: "",
            commentCount: "",
            viewCount: "",
            likeCount: "",
            types: ["link"],
            menus: [isVisible ? MENU_HOME_HIDE : MENU_HOME_SHOW],
            hotCount: 0,
            coldCount: 0
        });
    }

    return items;
}

function createCategorySectionRoute(rootKey) {
    var spec = getCategoryRootSpec(rootKey);
    if (!spec) throw new Error("알 수 없는 카테고리입니다.");
    return {
        kind: "category_root_list",
        url: normalizeUrl(spec.url),
        viewData: {
            view: "/views/list",
            styles: {
                title: spec.title,
                layout: "list",
                menu: true,
                pagination: false
            },
            models: {
                contents: buildCategorySectionItems(rootKey),
                menus: [MENU_IMPORT, MENU_HOME, MENU_BROWSER]
            }
        },
        context: {
            kind: "category_root_list",
            link: normalizeUrl(spec.url),
            title: spec.title,
            rootKey: rootKey
        }
    };
}

function createCategoryBoardRoute(rootKey, categoryId) {
    var record = ensureCategoryBoardRecord(rootKey, categoryId);
    var items = buildCategoryBoardItems(record, 0, CATEGORY_BROWSER_PAGE_SIZE);
    return {
        kind: "category_board_list",
        url: normalizeUrl(record.url),
        viewData: {
            view: "/views/list",
            styles: {
                title: record.title,
                layout: "list",
                menu: true,
                pagination: record.boards.length > items.length
            },
            models: {
                contents: items,
                menus: [MENU_IMPORT, MENU_HOME, MENU_BROWSER]
            }
        },
        context: {
            kind: "category_board_list",
            link: normalizeUrl(record.url),
            title: record.title,
            rootKey: rootKey,
            categoryId: String(categoryId),
            nextIndex: items.length,
            totalCount: record.boards.length
        }
    };
}

function buildBoardSettingsRootItems() {
    var specs = getCategoryRootSpecs();
    var items = [];
    for (var i = 0; i < specs.length; i++) {
        var categoryCount = getCachedCategoryRootEntries(specs[i].key).length;
        items.push({
            id: specs[i].key,
            title: specs[i].title,
            description: categoryCount > 0 ? ("카테고리 " + categoryCount + "개") : "카테고리 목록",
            category: "HOME 표시 선택",
            author: "",
            date: "",
            commentCount: "",
            viewCount: "",
            likeCount: "",
            types: ["link"],
            menus: [],
            hotCount: categoryCount,
            coldCount: 0
        });
    }
    return items;
}

function getBoardSettingsRootMenus() {
    return [MENU_IMPORT, "추가", "초기화"];
}

function buildBoardSettingsCategoryBoardItems(record, startIndex, pageSize) {
    var boards = record && Array.isArray(record.boards) ? record.boards : [];
    var visibleMap = getVisibleMap();
    var start = Math.max(0, toInt(startIndex, 0));
    var size = Math.max(1, toInt(pageSize, CATEGORY_BROWSER_PAGE_SIZE));
    var end = Math.min(boards.length, start + size);
    var items = [];

    for (var i = start; i < end; i++) {
        var board = boards[i];
        var isVisible = isBoardVisible(board, visibleMap);
        items.push({
            id: board.id,
            title: board.title,
            description: firstNonEmpty([
                board.group ? (board.group + " / " + boardKindLabel(board.kind)) : "",
                board.description,
                board.url.replace(/^https?:\/\//, "")
            ]),
            category: isVisible ? "HOME 표시" : "HOME 숨김",
            author: "",
            date: "",
            commentCount: "",
            viewCount: "",
            likeCount: "",
            types: ["link"],
            menus: [],
            hotCount: isVisible ? 1 : 0,
            coldCount: isVisible ? 0 : 1
        });
    }

    return items;
}

function createBoardSettingsRootRoute(parentViewId) {
    var context = createBoardSettingsRootState(parentViewId);
    return {
        kind: "board_settings_root",
        url: normalizeUrl(CATEGORY_HOME_URL),
        viewData: {
            view: "/views/list",
            styles: {
                title: "갤러리 설정",
                layout: "list",
                menu: true,
                pagination: false
            },
            models: {
                contents: buildBoardSettingsRootItems(),
                menus: getBoardSettingsRootMenus()
            }
        },
        context: context
    };
}

function createBoardSettingsCategorySectionRoute(parentViewId, rootKey) {
    var spec = getCategoryRootSpec(rootKey);
    if (!spec) throw new Error("알 수 없는 카테고리입니다.");
    return {
        kind: "board_settings_category_root_list",
        url: normalizeUrl(spec.url),
        viewData: {
            view: "/views/list",
            styles: {
                title: spec.title,
                layout: "list",
                menu: true,
                pagination: false
            },
            models: {
                contents: buildCategorySectionItems(rootKey),
                menus: [MENU_IMPORT]
            }
        },
        context: {
            kind: "board_settings_category_root_list",
            link: normalizeUrl(spec.url),
            title: spec.title,
            rootKey: rootKey,
            parentViewId: parentViewId || 0
        }
    };
}

function createBoardSettingsCategoryBoardRoute(parentViewId, rootKey, categoryId) {
    var record = ensureCategoryBoardRecord(rootKey, categoryId);
    var items = buildBoardSettingsCategoryBoardItems(record, 0, CATEGORY_BROWSER_PAGE_SIZE);
    return {
        kind: "board_settings_category_board_list",
        url: normalizeUrl(record.url),
        viewData: {
            view: "/views/list",
            styles: {
                title: record.title,
                layout: "list",
                menu: true,
                pagination: record.boards.length > items.length
            },
            models: {
                contents: items,
                menus: [MENU_IMPORT]
            }
        },
        context: {
            kind: "board_settings_category_board_list",
            link: normalizeUrl(record.url),
            title: record.title,
            rootKey: rootKey,
            categoryId: String(categoryId),
            nextIndex: items.length,
            totalCount: record.boards.length,
            parentViewId: parentViewId || 0
        }
    };
}

function refreshCategoryBrowserView(viewId, state, snackbar) {
    var route = null;
    if (!state || state.kind === "category_home") {
        route = createCategoryHomeRoute();
    } else if (state.kind === "category_root_list") {
        route = createCategorySectionRoute(state.rootKey);
    } else if (state.kind === "category_board_list") {
        route = createCategoryBoardRoute(state.rootKey, state.categoryId);
    } else if (state.kind === "board_settings_root") {
        route = createBoardSettingsRootRoute(state.parentViewId || 0);
    } else if (state.kind === "board_settings_category_root_list") {
        route = createBoardSettingsCategorySectionRoute(state.parentViewId || 0, state.rootKey);
    } else if (state.kind === "board_settings_category_board_list") {
        route = createBoardSettingsCategoryBoardRoute(state.parentViewId || 0, state.rootKey, state.categoryId);
    }
    if (!route) return false;
    updateViewFromRoute(viewId, route, snackbar || "");
    return true;
}

function importCategoryBrowser(state) {
    if (!state || state.kind === "category_home" || state.kind === "board_settings_root") {
        var total = 0;
        var specs = getCategoryRootSpecs();
        for (var i = 0; i < specs.length; i++) {
            total += fetchCategoryRootEntries(specs[i].key).length;
        }
        return "카테고리 " + total + "개를 가져왔습니다.";
    }

    if (state.kind === "category_root_list" || state.kind === "board_settings_category_root_list") {
        var spec = getCategoryRootSpec(state.rootKey);
        var categories = fetchCategoryRootEntries(state.rootKey);
        return (spec ? spec.title : "카테고리") + " " + categories.length + "개를 가져왔습니다.";
    }

    if (state.kind === "category_board_list" || state.kind === "board_settings_category_board_list") {
        var record = fetchCategoryBoardRecord(state.rootKey, state.categoryId);
        return record.title + " 보드 " + record.boards.length + "개를 가져왔습니다.";
    }

    return "";
}

function appendCategoryBoardPage(viewId) {
    var state = getViewState(viewId);
    if (!state || (state.kind !== "category_board_list" && state.kind !== "board_settings_category_board_list")) return;

    var record = ensureCategoryBoardRecord(state.rootKey, state.categoryId);
    var nextIndex = Math.max(0, toInt(state.nextIndex, 0));
    if (nextIndex >= record.boards.length) {
        synura.update(viewId, {
            styles: { pagination: false },
            models: { snackbar: "더 불러올 보드가 없습니다." }
        });
        return;
    }

    var appendItems = state.kind === "board_settings_category_board_list"
        ? buildBoardSettingsCategoryBoardItems(record, nextIndex, CATEGORY_BROWSER_PAGE_SIZE)
        : buildCategoryBoardItems(record, nextIndex, CATEGORY_BROWSER_PAGE_SIZE);
    state.nextIndex = nextIndex + appendItems.length;
    state.totalCount = record.boards.length;
    setViewState(viewId, state);

    synura.update(viewId, {
        styles: {
            pagination: state.nextIndex < record.boards.length
        },
        models: {
            append: appendItems
        }
    });
}

function routeCategoryUrl(urlInfo) {
    if (!urlInfo) return null;
    if (urlInfo.path === "/galltotal" || urlInfo.path === "/galltotal/") {
        return createCategoryHomeRoute();
    }

    var matchedRoot = urlInfo.path.match(/^\/(category|mcategory|micategory|prcategory)\/?$/);
    if (matchedRoot) {
        return createCategorySectionRoute(matchedRoot[1]);
    }

    var matchedCategory = urlInfo.path.match(/^\/(category|mcategory|micategory|prcategory)\/(\d+)\/?$/);
    if (matchedCategory) {
        return createCategoryBoardRoute(matchedCategory[1], matchedCategory[2]);
    }

    return null;
}

function syncDiscoveredBoards(full) {
    var bucket = {};
    var errors = [];
    var categoryQueue = [];
    var categorySeen = {};
    var roots = [
        { url: "https://m.dcinside.com/galltotal", description: "갤러리" },
        { url: "https://m.dcinside.com/category", description: "갤러리" },
        { url: "https://m.dcinside.com/mcategory", description: "마이너 갤러리" },
        { url: "https://m.dcinside.com/micategory", description: "미니 갤러리" },
        { url: "https://m.dcinside.com/prcategory", description: "인물 갤러리" }
    ];

    for (var i = 0; i < roots.length; i++) {
        try {
            var rootDoc = fetchDocument(roots[i].url);
            extractBoardsFromDocument(rootDoc, roots[i].url, roots[i].description, "", bucket);
            if (!full) continue;
            var discovered = extractCategoryDiscoveryEntries(rootDoc);
            for (var j = 0; j < discovered.length; j++) {
                if (!discovered[j] || !discovered[j].url || categorySeen[discovered[j].url]) continue;
                categorySeen[discovered[j].url] = true;
                categoryQueue.push(discovered[j]);
            }
        } catch (e) {
            errors.push(roots[i].url + ": " + e.toString());
        }
    }

    if (full) {
        for (var k = 0; k < categoryQueue.length; k++) {
            try {
                var categoryEntry = categoryQueue[k];
                var categoryUrl = categoryEntry.url;
                var categoryDoc = fetchDocument(categoryUrl);
                extractBoardsFromDocument(
                    categoryDoc,
                    categoryUrl,
                    categoryKindLabelForUrl(categoryUrl),
                    detectCategoryGroupLabel(categoryDoc, categoryEntry.label),
                    bucket
                );
            } catch (e2) {
                errors.push(categoryQueue[k].url + ": " + e2.toString());
            }
        }
    }

    var boards = [];
    for (var key in bucket) {
        if (Object.prototype.hasOwnProperty.call(bucket, key)) boards.push(bucket[key]);
    }
    if (boards.length === 0) {
        throw new Error(errors.length > 0 ? errors[0] : "갤러리 목록을 가져오지 못했습니다.");
    }

    saveDiscoveredBoards(boards, full ? "full" : "shallow");
    return {
        count: boards.length,
        errors: errors,
        full: !!full
    };
}

function ensureBootstrapBoards() {
    if (hasFreshDiscoveredBoards() && getDiscoveredBoards().length > 0) return;
    try {
        syncDiscoveredBoards(false);
    } catch (e) {
    }
}

function ensureCategorizedBoardsForSettings() {
    if (hasFreshFullDiscoveredBoards()) return;
    try {
        syncDiscoveredBoards(true);
    } catch (e) {
    }
}

function getHomeMenus(isReorderable) {
    return [
        MENU_CACHE_SETTINGS,
        MENU_BOARD_SETTINGS,
        MENU_ALL_BOARDS,
        MENU_BROWSER,
        MENU_REFRESH,
        { label: MENU_REORDER, checked: !!isReorderable }
    ];
}

function getSettingsBody() {
    return [
        {
            type: "boolean",
            name: "category_two_char",
            label: "카테고리 2자",
            value: getUseTwoCharCategory()
        }
    ];
}

function buildHomeItems() {
    var boards = getHomeBoards();
    var items = [];
    for (var i = 0; i < boards.length; i++) {
        var board = boards[i];
        items.push({
            id: board.id,
            link: board.url,
            title: board.title,
            description: board.description || board.url.replace(/^https?:\/\//, ""),
            category: board.group || boardKindLabel(board.kind),
            author: "",
            date: "",
            commentCount: "",
            viewCount: "",
            likeCount: "",
            types: ["link"],
            menus: [],
            hotCount: 0,
            coldCount: 0
        });
    }
    return items;
}

function createHomeRoute(isReorderable, snackbar) {
    var models = {
        contents: buildHomeItems(),
        menus: getHomeMenus(isReorderable)
    };
    if (snackbar) models.snackbar = snackbar;
    return {
        kind: "home",
        url: normalizeUrl(SITE.browserHomeUrl),
        viewData: {
            view: "/views/list",
            styles: {
                title: SITE.displayName,
                layout: "list",
                menu: true,
                pagination: false,
                reorderable: !!isReorderable
            },
            models: models
        },
        context: {
            kind: "home",
            link: normalizeUrl(SITE.browserHomeUrl),
            title: SITE.displayName,
            isReorderable: !!isReorderable
        }
    };
}

function createCategoryHomeRoute() {
    return {
        kind: "category_home",
        url: normalizeUrl(CATEGORY_HOME_URL),
        viewData: {
            view: "/views/list",
            styles: {
                title: MENU_ALL_BOARDS,
                layout: "list",
                menu: true,
                pagination: false
            },
            models: {
                contents: buildCategoryRootHomeItems(),
                menus: [MENU_IMPORT, MENU_HOME, MENU_BROWSER]
            }
        },
        context: {
            kind: "category_home",
            link: normalizeUrl(CATEGORY_HOME_URL),
            title: MENU_ALL_BOARDS
        }
    };
}

function refreshHomeView(viewId, snackbar) {
    var state = getViewState(viewId) || {};
    updateViewFromRoute(viewId, createHomeRoute(!!state.isReorderable, snackbar));
}

function createBoardSettingsRootState(parentViewId) {
    return {
        kind: "board_settings_root",
        from: "board_settings_root",
        parentViewId: parentViewId || 0,
        title: "갤러리 설정",
        link: normalizeUrl(CATEGORY_HOME_URL) || CATEGORY_HOME_URL
    };
}

function refreshBoardSettingsRootView(viewId, state, snackbar) {
    updateViewFromRoute(viewId, createBoardSettingsRootRoute(state ? state.parentViewId : 0), snackbar || "");
}

function showBoardAddDialog(parentViewId, homeViewId) {
    synura.open({
        view: "/dialogs/input",
        styles: {
            title: "갤러리 추가",
            message: "갤러리 URL 또는 ID를 입력하세요.",
            close: true
        },
        models: {
            body: [
                { type: "string", name: "url", label: "URL 또는 ID", value: "" },
                { type: "string", name: "title", label: "표시 이름(선택)", value: "" }
            ],
            buttons: ["추가"]
        }
    }, {
        from: "board_add_dialog",
        parentViewId: parentViewId,
        homeViewId: homeViewId
    }, function (event) {
        handler.onViewEvent(event);
    });
}

function showSettingsDialog(parentViewId) {
    synura.open({
        view: "/dialogs/input",
        styles: {
            title: "설정",
            message: "표시 설정을 변경하세요.",
            close: true
        },
        models: {
            body: getSettingsBody(),
            buttons: ["저장", "초기화"]
        }
    }, {
        from: "settings",
        parentViewId: parentViewId || 0
    }, function (event) {
        handler.onViewEvent(event);
    });
}

function showBoardSettings(parentViewId) {
    return openRoute(createBoardSettingsRootRoute(parentViewId || 0));
}

function isChallengeHtml(html) {
    var body = String(html || "").toLowerCase();
    return body.indexOf("ddoscheckonly") >= 0 ||
        body.indexOf("challenge-platform") >= 0 ||
        body.indexOf("hcaptcha") >= 0 ||
        body.indexOf("cf-turnstile") >= 0 ||
        body.indexOf("turnstile") >= 0 ||
        body.indexOf("verify you are human") >= 0 ||
        body.indexOf("checking your browser") >= 0 ||
        body.indexOf("enable javascript and cookies to continue") >= 0 ||
        (body.indexOf("just a moment") >= 0 && body.indexOf("cf_chl_opt") >= 0) ||
        (body.indexOf("window.location.replace") >= 0 && body.indexOf("document.cookie") >= 0);
}

function fetchDocument(url) {
    var response = fetchWithLogging(url, buildFetchOptions());
    if (!response) {
        throw new Error("Failed to fetch " + url + " (0)");
    }

    var status = response.status || 0;
    var html = response.text();
    if (shouldUseBrowserCookieAuth() && (isChallengeHtml(html) || isBrowserAuthRequiredStatus(status))) {
        throw makeAuthRequiredError(url, status);
    }

    if (!response.ok) {
        throw new Error("Failed to fetch " + url + " (" + status + ")");
    }

    return response.dom("text/html");
}

function fetchPostPage(url) {
    var response = fetchWithLogging(url, buildFetchOptions());
    if (!response) {
        throw new Error("Failed to fetch " + url + " (0)");
    }

    var status = response.status || 0;
    var html = response.text();
    var authRequired = shouldUseBrowserCookieAuth() &&
        (isChallengeHtml(html) || isBrowserAuthRequiredStatus(status));
    var restricted = !response.ok && (status === 401 || status === 403) && !isChallengeHtml(html);
    if (authRequired) {
        throw makeAuthRequiredError(url, status);
    }
    if (!response.ok && !restricted) {
        throw new Error("Failed to fetch " + url + " (" + status + ")");
    }

    return {
        response: response,
        html: html,
        doc: response.dom("text/html"),
        restricted: restricted
    };
}

function routeBoardWithMatch(url, urlInfo, match, force) {
    if (!force) {
        var cached = getCachedRoute("board", url);
        if (cached) return cached;
    }

    var doc = fetchDocument(url);
    var items = filterItemsForBoard(parseBoardItems(doc, url, match), match);
    var title = detectBoardTitle(doc, match.board);
    var nextUrl = SITE.buildNextPageUrl(match, url, (match.page || 1) + 1);
    var seenLinks = [];
    for (var i = 0; i < items.length; i++) {
        seenLinks.push(items[i].link);
    }

    var route = {
        kind: "board",
        url: url,
        viewData: {
            view: "/views/list",
            styles: {
                title: title,
                layout: "card",
                menu: true,
                pagination: !!nextUrl
            },
            models: {
                contents: items,
                menus: buildBoardContextMenus(match.board ? match.board.id : "", url, match.board ? match.board.title : title)
            }
        },
        context: {
            kind: "board",
            link: url,
            boardId: match.board ? match.board.id : "",
            boardTitle: match.board ? match.board.title : title,
            title: title,
            page: match.page || 1,
            nextUrl: nextUrl,
            seenLinks: seenLinks
        }
    };
    setCachedRoute("board", url, route);
    return route;
}

function routePostWithMatch(url, urlInfo, match, force) {
    if (!force) {
        var cached = getCachedRoute("post", url);
        if (cached) return cached;
    }

var page = fetchPostPage(url);
var doc = page.doc;
var titleNode = firstNode(doc, ["title"]);
var contentRoot = firstNode(doc, SITE.selectors.postContent);
var schemaPost = detectSchemaPost(doc);
var content = parseDetails(contentRoot, url);
var comments = parseComments(doc, url);
if (!content || content.length === 0) {
    if (schemaPost && schemaPost.articleBody) {
        content = [{
            type: "text",
            value: schemaPost.articleBody
        }];
    } else {
        content = [{
            type: "text",
            value: page.restricted ? "로그인이 필요합니다." : "본문을 가져오지 못했습니다."
        }];
    }
}

    var route = {
        kind: "post",
        url: url,
        viewData: {
            view: "/views/post",
            styles: {
                title: firstNonEmpty([
                    cleanPageTitle(schemaPost ? schemaPost.headline : ""),
                    cleanPageTitle(firstText(doc, SITE.selectors.postTitle)),
                    cleanPageTitle(textOf(titleNode)),
                    match.board ? match.board.title : "",
                    SITE.displayName
                ]),
                menu: true
            },
            models: {
                author: firstAuthorText(doc, SITE.selectors.postAuthor),
                date: firstText(doc, SITE.selectors.postDate),
                category: firstText(doc, SITE.selectors.postCategory),
                viewCount: parseCount(firstText(doc, SITE.selectors.postViewCount)),
                likeCount: parseCount(firstText(doc, SITE.selectors.postLikeCount)),
                content: content,
                comments: comments,
                link: url,
                menus: buildBoardContextMenus(match.board ? match.board.id : "", "", match.board ? match.board.title : ""),
                buttons: [BUTTON_REFRESH]
            }
        },
        context: {
            kind: "post",
            link: url,
            boardId: match.board ? match.board.id : "",
            boardTitle: match.board ? match.board.title : ""
        }
    };
    setCachedRoute("post", url, route);
    return route;
}

function createPendingBoardRoute(url, match) {
    var board = match && match.board ? match.board : null;
    var title = firstNonEmpty([
        board ? board.title : "",
        SITE.displayName
    ]);
    var nextUrl = "";
    try {
        nextUrl = SITE.buildNextPageUrl ? (SITE.buildNextPageUrl(match, url, ((match && match.page) || 1) + 1) || "") : "";
    } catch (e) {
    }
    return {
        kind: "board",
        url: url,
        viewData: {
            view: "/views/list",
            styles: {
                title: title,
                layout: "card",
                menu: true,
                pagination: !!nextUrl
            },
            models: {
                contents: [],
                menus: buildBoardContextMenus(board ? board.id : "", url, board ? board.title : title)
            }
        },
        context: {
            kind: "board",
            link: url,
            boardId: board ? board.id : "",
            boardTitle: board ? board.title : title,
            title: title,
            page: match && match.page ? match.page : 1,
            nextUrl: nextUrl,
            seenLinks: []
        }
    };
}

function createPendingPostRoute(url, match) {
    return {
        kind: "post",
        url: url,
        viewData: {
            view: "/views/post",
            styles: {
                title: firstNonEmpty([
                    match && match.board ? match.board.title : "",
                    SITE.displayName
                ]),
                menu: true
            },
            models: {
                author: "",
                date: "",
                category: "",
                viewCount: "",
                likeCount: "",
                content: [],
                comments: [],
                link: url,
                menus: buildBoardContextMenus(match && match.board ? match.board.id : "", "", match && match.board ? match.board.title : ""),
                buttons: [BUTTON_REFRESH]
            }
        },
        context: {
            kind: "post",
            link: url,
            boardId: match && match.board ? match.board.id : "",
            boardTitle: match && match.board ? match.board.title : ""
        }
    };
}

function openLoadingRoute(pendingRoute, loadRoute, targetUrl, title) {
    var opened = openRoute(pendingRoute);
    if (!opened || !opened.success) return opened;

    try {
        var route = loadRoute ? loadRoute() : null;
        if (route) {
            updateViewFromRoute(opened.viewId, route);
        } else {
            synura.update(opened.viewId, {
                models: {
                    snackbar: "경로를 불러오지 못했습니다."
                }
            });
        }
    } catch (e) {
        var result = {
            success: false,
            error: e.toString()
        };
        if (handleOpenFailure(result, targetUrl, opened.viewId, title || SITE.displayName)) {
            synura.update(opened.viewId, { models: { snackbar: "브라우저에서 인증을 완료해 주세요." } });
        } else {
            synura.update(opened.viewId, { models: { snackbar: e.toString() } });
        }
    }

    return opened;
}

function routeUrl(rawUrl, force) {
    var normalized = normalizeUrl(rawUrl);
    if (!normalized) return null;
    var info = parseAbsoluteUrl(normalized);
    if (!info || !isKnownHost(info.host)) return null;

    var postMatch = SITE.matchPost(info);
    if (postMatch) return routePostWithMatch(normalized, info, postMatch, !!force);

    var boardMatch = SITE.matchBoard(info);
    if (boardMatch) return routeBoardWithMatch(normalized, info, boardMatch, !!force);

    var categoryRoute = routeCategoryUrl(info);
    if (categoryRoute) return categoryRoute;

    var homeUrl = normalizeUrl(SITE.browserHomeUrl);
    var categoryHomeUrl = normalizeUrl(CATEGORY_HOME_URL);
    if (normalized === homeUrl) return createHomeRoute();
    if (normalized === categoryHomeUrl) return createCategoryHomeRoute();
    return null;
}

function openBrowser(url, title, extraState) {
    var browserUrl = normalizeUrl(url) || ensureAbsoluteUrl(url, SITE.browserHomeUrl) || SITE.browserHomeUrl;
    var context = deepClone(extraState || {});
    context.kind = context.kind || "browser";
    context.link = browserUrl;
    context.title = context.title || title || SITE.displayName;

    var result = synura.open({
        view: "/views/browser",
        styles: {
            title: title || SITE.displayName
        },
        models: {
            url: browserUrl
        }
    }, context, function (event) {
        handler.onViewEvent(event);
    });
    if (result && result.success) {
        setViewState(result.viewId, context);
    }
    return result;
}

function openBrowserForAuth(url, parentViewId, title) {
    return openBrowser(url, title || SITE.displayName, {
        from: "browser_auth",
        targetUrl: normalizeUrl(url) || ensureAbsoluteUrl(url, SITE.browserHomeUrl) || SITE.browserHomeUrl,
        parentViewId: parentViewId || 0
    });
}

function isAuthRequiredResult(result) {
    return !!parseAuthRequiredError(result && result.error);
}

function handleOpenFailure(result, targetUrl, parentViewId, title) {
    var auth = parseAuthRequiredError(result && result.error);
    if (auth && shouldUseBrowserCookieAuth()) {
        openBrowserForAuth(auth.url || targetUrl, parentViewId, title || SITE.displayName);
        return true;
    }
    return false;
}

function openRoute(route) {
    var viewData = route.viewData || {};
    viewData.styles = viewData.styles || {};
    if (route && route.kind === "board" && viewData.view === "/views/list") {
        viewData.styles.history = true;
    }
    var result = synura.open(viewData, route.context, function (event) {
        handler.onViewEvent(event);
    });
    if (result && result.success) {
        setViewState(result.viewId, route.context);
    }
    return result;
}

function openByUrl(url, force) {
    try {
        var normalized = normalizeUrl(url);
        if (!normalized) {
            return {
                success: false,
                error: "Unsupported URL"
            };
        }
        var info = parseAbsoluteUrl(normalized);
        if (!info || !isKnownHost(info.host)) {
            return {
                success: false,
                error: "Unsupported URL"
            };
        }

        var postMatch = SITE.matchPost(info);
        if (postMatch) {
            return openLoadingRoute(
                createPendingPostRoute(normalized, postMatch),
                function () {
                    return routePostWithMatch(normalized, info, postMatch, !!force);
                },
                normalized,
                SITE.displayName
            );
        }

        var boardMatch = SITE.matchBoard(info);
        if (boardMatch) {
            return openLoadingRoute(
                createPendingBoardRoute(normalized, boardMatch),
                function () {
                    return routeBoardWithMatch(normalized, info, boardMatch, !!force);
                },
                normalized,
                boardMatch && boardMatch.board ? boardMatch.board.title : SITE.displayName
            );
        }

        var categoryRoute = routeCategoryUrl(info);
        if (categoryRoute) {
            return openRoute(categoryRoute);
        }

        var homeUrl = normalizeUrl(SITE.browserHomeUrl);
        var categoryHomeUrl = normalizeUrl(CATEGORY_HOME_URL);
        if (normalized === homeUrl) {
            return openRoute(createHomeRoute());
        }
        if (normalized === categoryHomeUrl) {
            return openRoute(createCategoryHomeRoute());
        }

        return {
            success: false,
            error: "Unsupported URL"
        };
    } catch (e) {
        return {
            success: false,
            error: e.toString()
        };
    }
}

function updateViewFromRoute(viewId, route, snackbar) {
    var styles = deepClone(route.viewData.styles || {});
    if (route && route.kind === "board" && route.viewData && route.viewData.view === "/views/list") {
        styles.history = true;
    }
    var models = deepClone(route.viewData.models || {});
    if (snackbar) models.snackbar = snackbar;
    synura.update(viewId, {
        styles: styles,
        models: models
    });
    setViewState(viewId, route.context);
}

function refreshCurrentView(viewId) {
    var state = getViewState(viewId);
    try {
        if (!state || !state.kind || state.kind === "home") {
            updateViewFromRoute(viewId, createHomeRoute(!!(state && state.isReorderable), "새로고침 완료"));
            return;
        }
        if (
            state.kind === "category_home" ||
            state.kind === "category_root_list" ||
            state.kind === "category_board_list" ||
            state.kind === "board_settings_root" ||
            state.kind === "board_settings_category_root_list" ||
            state.kind === "board_settings_category_board_list"
        ) {
            refreshCategoryBrowserView(viewId, state, "새로고침 완료");
            return;
        }
        var route = routeUrl(state.link, true);
        if (!route) {
            synura.update(viewId, { models: { snackbar: "새로고침할 경로를 찾을 수 없습니다." } });
            return;
        }
        updateViewFromRoute(viewId, route, "새로고침 완료");
    } catch (e) {
        var result = {
            success: false,
            error: e.toString()
        };
        if (handleOpenFailure(result, (state && state.link) || SITE.browserHomeUrl, viewId, (state && state.title) || SITE.displayName)) {
            synura.update(viewId, { models: { snackbar: "브라우저에서 인증을 완료해 주세요." } });
            return;
        }
        synura.update(viewId, { models: { snackbar: e.toString() } });
    }
}

function toggleCurrentBoardHome(viewId, state) {
    var board = resolveBoardForHomeToggle(
        state ? state.boardId : "",
        state && state.kind === "board" ? state.link : "",
        state ? state.boardTitle : ""
    );
    if (!board) {
        synura.update(viewId, { models: { snackbar: "홈 상태를 변경할 게시판을 찾을 수 없습니다." } });
        return true;
    }

    var toggled = setBoardHomeVisibility(board, !isBoardVisible(board, getVisibleMap()));
    if (!toggled || !toggled.board) {
        synura.update(viewId, { models: { snackbar: "홈 상태를 변경하지 못했습니다." } });
        return true;
    }

    var nextState = getViewState(viewId);
    nextState.boardId = toggled.board.id;
    nextState.boardTitle = firstNonEmpty([ toggled.board.title, nextState.boardTitle, state ? state.boardTitle : "" ]);
    setViewState(viewId, nextState);

    synura.update(viewId, {
        models: {
            menus: buildBoardContextMenus(
                nextState.boardId,
                nextState.kind === "board" ? nextState.link : "",
                nextState.boardTitle
            ),
            snackbar: toggled.board.title + (toggled.visible ? " 홈에 추가했습니다." : " 홈에서 제거했습니다.")
        }
    });

    var homeViewId = getFirstHomeViewId();
    if (homeViewId) {
        refreshHomeView(homeViewId, "");
    }
    return true;
}

function appendNextPage(viewId) {
    var state = getViewState(viewId);
    if (state && (state.kind === "category_board_list" || state.kind === "board_settings_category_board_list")) {
        appendCategoryBoardPage(viewId);
        return;
    }
    if (!state || state.kind !== "board") return;
    if (!state.nextUrl) {
        synura.update(viewId, { models: { snackbar: "더 불러올 글이 없습니다." } });
        return;
    }

    try {
        var route = routeUrl(state.nextUrl, false);
        if (!route || !route.context) {
            synura.update(viewId, { models: { snackbar: "다음 페이지를 불러오지 못했습니다." } });
            return;
        }

        var seen = {};
        var prior = state.seenLinks || [];
        for (var i = 0; i < prior.length; i++) {
            seen[prior[i]] = true;
        }

        var rawItems = listFromDetails(((route.viewData || {}).models || {}).contents);
        var appendItems = [];
        for (var j = 0; j < rawItems.length; j++) {
            var item = rawItems[j];
            if (!item || !item.link || seen[item.link]) continue;
            seen[item.link] = true;
            appendItems.push(item);
        }

        state.page = route.context.page || state.page;
        state.nextUrl = appendItems.length === 0 ? "" : (route.context.nextUrl || "");
        state.seenLinks = [];
        for (var key in seen) {
            if (Object.prototype.hasOwnProperty.call(seen, key)) {
                state.seenLinks.push(key);
            }
        }
        setViewState(viewId, state);

        if (appendItems.length === 0) {
            synura.update(viewId, {
                styles: { pagination: false },
                models: { snackbar: "더 불러올 글이 없습니다." }
            });
            return;
        }

        synura.update(viewId, {
            styles: {
                pagination: !!state.nextUrl
            },
            models: {
                append: appendItems
            }
        });
    } catch (e) {
        var result = {
            success: false,
            error: e.toString()
        };
        var authTarget = (state && state.nextUrl) || (state && state.link) || SITE.browserHomeUrl;
        if (handleOpenFailure(result, authTarget, viewId, (state && state.title) || SITE.displayName)) {
            synura.update(viewId, { models: { snackbar: "브라우저에서 인증을 완료해 주세요." } });
            return;
        }
        synura.update(viewId, { models: { snackbar: e.toString() } });
    }
}

function handleBrowserSubmit(viewId, event) {
    var state = getViewState(viewId);
    var cookie = event.data ? event.data.cookies : "";
    if (cookie) {
        setSavedCookie(cookie);
    }

    if (!shouldUseBrowserCookieAuth()) {
        synura.close(viewId);
        return;
    }

    var parentViewId = state ? state.parentViewId : 0;
    var targetUrl = normalizeUrl((state && state.targetUrl) || (state && state.link) || (event.data && event.data.url) || SITE.browserHomeUrl) || SITE.browserHomeUrl;
    var parentState = parentViewId ? getViewState(parentViewId) : null;
    if (parentViewId && parentState && normalizeUrl(parentState.link || "") === targetUrl) {
        refreshCurrentView(parentViewId);
        synura.close(viewId);
        return;
    }

    var result = openByUrl(targetUrl, true);
    if (result && result.success) {
        synura.close(viewId);
        return;
    }

    var message = cookie
        ? "쿠키를 저장했지만 차단이 계속됩니다."
        : "인증 쿠키를 가져오지 못했습니다.";
    if (isAuthRequiredResult(result)) {
        message = "인증이 아직 완료되지 않았습니다. 브라우저에서 계속 진행해 주세요.";
    }
    synura.update(viewId, { models: { snackbar: message } });
    if (parentViewId) {
        synura.update(parentViewId, { models: { snackbar: message } });
    }
}

function handleCategoryBrowserEvent(viewId, event, state) {
    if (!state || !state.kind) return false;

    if (event.eventId === "CLICK") {
        if (state.kind === "category_home") {
            var rootKey = normalizeWhitespace(event.data ? event.data.id : "");
            if (!rootKey) return false;
            try {
                openRoute(createCategorySectionRoute(rootKey));
            } catch (e) {
                synura.update(viewId, { models: { snackbar: e.toString() } });
            }
            return true;
        }

        if (state.kind === "category_root_list") {
            var categoryId = normalizeWhitespace(event.data ? event.data.id : "");
            if (!categoryId) return false;
            try {
                openRoute(createCategoryBoardRoute(state.rootKey, categoryId));
            } catch (e2) {
                synura.update(viewId, { models: { snackbar: e2.toString() } });
            }
            return true;
        }
    }

    if (event.eventId === "ITEM_MENU_CLICK" && state.kind === "category_board_list") {
        var itemMenu = normalizeWhitespace(event.data ? event.data.menu : "");
        if (itemMenu === MENU_HOME_SHOW || itemMenu === MENU_HOME_HIDE) {
            var toggled = toggleBoardHomeVisibilityById(normalizeWhitespace(event.data ? event.data.id : ""));
            if (!toggled || !toggled.board) {
                synura.update(viewId, { models: { snackbar: "갤러리 상태를 변경하지 못했습니다." } });
                return true;
            }
            refreshCategoryBrowserView(viewId, state, toggled.board.title + (toggled.visible ? " 홈 표시" : " 홈 숨김"));
            return true;
        }
    }

    if (event.eventId !== "MENU_CLICK") return false;

    var menu = normalizeWhitespace(event.data ? event.data.menu : "");
    if (!menu) return false;

    if (menu === MENU_IMPORT) {
        try {
            var message = importCategoryBrowser(state);
            refreshCategoryBrowserView(viewId, state, message);
        } catch (e3) {
            synura.update(viewId, { models: { snackbar: e3.toString() } });
        }
        return true;
    }

    if (menu === MENU_HOME) {
        openRoute(createHomeRoute());
        return true;
    }

    if (menu === MENU_BROWSER) {
        openBrowser((state && state.link) || CATEGORY_HOME_URL, (state && state.title) || SITE.displayName, {
            from: "browser_menu",
            parentViewId: viewId || 0,
            targetUrl: (state && state.link) || CATEGORY_HOME_URL
        });
        return true;
    }

    return false;
}

function handleHomeReorder(viewId, event) {
    var state = getViewState(viewId);
    var visibleBoards = getVisibleBoards();
    var oldIndex = -1;

    if (event.data && event.data.id) {
        oldIndex = visibleBoards.findIndex(function (board) { return board.id === event.data.id; });
    }
    if (oldIndex < 0 && event.data && event.data.title) {
        oldIndex = visibleBoards.findIndex(function (board) { return board.title === event.data.title; });
    }
    if (oldIndex < 0 && event.data && event.data._index !== undefined) {
        oldIndex = toInt(event.data._index, -1);
    }

    var newIndex = event.data ? toInt(event.data._newIndex, -1) : -1;
    if (oldIndex < 0 || newIndex < 0 || oldIndex >= visibleBoards.length) return;
    if (oldIndex < newIndex) newIndex -= 1;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= visibleBoards.length) newIndex = visibleBoards.length - 1;
    if (oldIndex === newIndex) return;

    var moved = visibleBoards.splice(oldIndex, 1)[0];
    visibleBoards.splice(newIndex, 0, moved);

    var allBoards = getSortedBoards();
    var visibleIds = {};
    for (var i = 0; i < visibleBoards.length; i++) {
        visibleIds[visibleBoards[i].id] = true;
    }

    var newOrder = [];
    for (var j = 0; j < visibleBoards.length; j++) {
        newOrder.push(visibleBoards[j].id);
    }
    for (var k = 0; k < allBoards.length; k++) {
        if (!visibleIds[allBoards[k].id]) newOrder.push(allBoards[k].id);
    }
    saveBoardOrder(newOrder);
    state.isReorderable = true;
    setViewState(viewId, state);
    refreshHomeView(viewId, "정렬 순서를 저장했습니다.");
}

function handleSettingsEvent(viewId, event) {
    if (event.eventId !== "SUBMIT") return false;

    var button = normalizeWhitespace(event.data ? event.data.button : "");
    var parentViewId = event.context ? toInt(event.context.parentViewId, 0) : 0;

    if (button === "저장") {
        setUseTwoCharCategory(!(event.data && event.data.category_two_char === false));
        synura.close(viewId);
        if (parentViewId) {
            synura.update(parentViewId, { models: { snackbar: "설정이 저장되었습니다." } });
        }
        return true;
    }

    if (button === "초기화") {
        localStorage.removeItem(CATEGORY_TWO_CHAR_KEY);
        synura.update(viewId, {
            models: {
                body: getSettingsBody(),
                snackbar: "설정이 초기화되었습니다."
            }
        });
        if (parentViewId) {
            synura.update(parentViewId, { models: { snackbar: "설정이 초기화되었습니다." } });
        }
        return true;
    }

    synura.close(viewId);
    return true;
}

function handleBoardSettingsRootEvent(viewId, event, state) {
    if (
        !state ||
        (
            state.kind !== "board_settings_root" &&
            state.kind !== "board_settings_category_root_list" &&
            state.kind !== "board_settings_category_board_list"
        )
    ) return false;

    if (event.eventId === "MENU_CLICK") {
        var menu = normalizeWhitespace(event.data ? event.data.menu : "");
        if (menu === MENU_IMPORT) {
            try {
                var importMessage = importCategoryBrowser(state);
                refreshCategoryBrowserView(viewId, state, importMessage);
            } catch (e0) {
                synura.update(viewId, { models: { snackbar: e0.toString() } });
            }
            return true;
        }

        if (state.kind !== "board_settings_root") return false;

        if (menu === "추가") {
            showBoardAddDialog(viewId, state.parentViewId || 0);
            return true;
        }
        if (menu === "초기화") {
            localStorage.removeItem(CUSTOM_BOARDS_KEY);
            localStorage.removeItem(VISIBLE_BOARDS_KEY);
            localStorage.removeItem(BOARD_ORDER_KEY);
            refreshBoardSettingsRootView(viewId, state, "갤러리 설정을 초기화했습니다.");
            if (state.parentViewId) refreshHomeView(state.parentViewId, "갤러리 설정을 초기화했습니다.");
            return true;
        }
        return true;
    }

    if (event.eventId === "CLICK") {
        if (state.kind === "board_settings_root") {
            var rootKey = normalizeWhitespace(event.data ? event.data.id : "");
            if (!rootKey) return false;
            try {
                openRoute(createBoardSettingsCategorySectionRoute(state.parentViewId || 0, rootKey));
            } catch (e1) {
                synura.update(viewId, { models: { snackbar: e1.toString() } });
            }
            return true;
        }

        if (state.kind === "board_settings_category_root_list") {
            var categoryId = normalizeWhitespace(event.data ? event.data.id : "");
            if (!categoryId) return false;
            try {
                openRoute(createBoardSettingsCategoryBoardRoute(state.parentViewId || 0, state.rootKey, categoryId));
            } catch (e2) {
                synura.update(viewId, { models: { snackbar: e2.toString() } });
            }
            return true;
        }

        if (state.kind === "board_settings_category_board_list") {
            var boardId = normalizeWhitespace(event.data ? event.data.id : "");
            var toggled = toggleBoardHomeVisibilityById(boardId);
            if (!toggled || !toggled.board) {
                synura.update(viewId, { models: { snackbar: "갤러리 상태를 변경하지 못했습니다." } });
                return true;
            }
            var toggleMessage = toggled.board.title + (toggled.visible ? " 홈 표시" : " 홈 숨김");
            refreshCategoryBrowserView(viewId, state, toggleMessage);
            if (state.parentViewId) {
                refreshHomeView(state.parentViewId, toggleMessage);
            }
            return true;
        }

        return true;
    }

    return false;
}

function handleBoardAddEvent(viewId, event) {
    if (event.eventId !== "SUBMIT") return;
    var button = event.data && event.data.button ? String(event.data.button) : "";
    if (button !== "추가") {
        synura.close(viewId);
        return;
    }

    var result = addCustomBoard(event.data ? event.data.url : "", event.data ? event.data.title : "");
    if (!result.ok) {
        synura.update(viewId, { models: { snackbar: result.error } });
        return;
    }

    var parentViewId = event.context ? event.context.parentViewId : 0;
    var homeViewId = event.context ? event.context.homeViewId : 0;
    synura.close(viewId);

    if (parentViewId) {
        var rootState = getViewState(parentViewId);
        if (rootState && rootState.kind === "board_settings_root") {
            refreshBoardSettingsRootView(parentViewId, rootState, "갤러리를 추가했습니다.");
        }
    }
    if (homeViewId) {
        refreshHomeView(homeViewId, "갤러리를 추가했습니다.");
    }
}

var handler = {
    home: function () {
        openRoute(createHomeRoute(false));
    },

    resume: function (viewId, context) {
        setViewState(viewId, context || getViewState(viewId));
        synura.connect(viewId, context || getViewState(viewId), function (event) {
            handler.onViewEvent(event);
        });
    },

    router: function (url) {
        var route = routeUrl(url, false);
        return route ? deepClone(route.viewData) : null;
    },

    deeplink: function (url) {
        var result = openByUrl(url, false);
        if (!result || !result.success) {
            if (handleOpenFailure(result, url, 0, SITE.displayName)) return;
            var browserUrl = ensureAbsoluteUrl(url, SITE.browserHomeUrl) || SITE.browserHomeUrl;
            openBrowser(browserUrl, SITE.displayName, {
                from: "browser_deeplink",
                targetUrl: normalizeUrl(browserUrl) || browserUrl
            });
        }
    },

    onViewEvent: function (event) {
        var viewId = resolveEventViewId(event, 0);
        var state = getViewState(viewId);
        logViewEvent(event, viewId);
        if (handleBoardSettingsRootEvent(viewId, event, state)) {
            return;
        }
        if (handleCategoryBrowserEvent(viewId, event, state)) {
            return;
        }
        if (event.eventId === "CLICK") {
            var link = event.data ? event.data.link : "";
            if (!link) return;
            var result = openByUrl(link, false);
            if (!result || !result.success) {
                if (handleOpenFailure(result, link, viewId, SITE.displayName)) return;
                openBrowser(link, SITE.displayName, {
                    from: "browser_click",
                    parentViewId: viewId || 0,
                    targetUrl: normalizeUrl(link) || ensureAbsoluteUrl(link, SITE.browserHomeUrl) || link
                });
            }
            return;
        }

        if (event.eventId === "REFRESH") {
            refreshCurrentView(viewId);
            return;
        }

        if (event.eventId === "REORDER") {
            if (state && state.kind === "home") {
                handleHomeReorder(viewId, event);
            }
            return;
        }

        if (event.eventId === "SCROLL_TO_END") {
            appendNextPage(viewId);
            return;
        }

        if (event.eventId === "MENU_CLICK") {
            var menu = event.data ? event.data.menu : "";
            if (state && state.kind === "home") {
                if (menu === MENU_CACHE_SETTINGS) {
                    showSettingsDialog(viewId);
                    return;
                }
                if (menu === MENU_BOARD_SETTINGS) {
                    showBoardSettings(viewId);
                    return;
                }
                if (menu === MENU_ALL_BOARDS) {
                    openRoute(createCategoryHomeRoute());
                    return;
                }
                if (menu === MENU_REFRESH) {
                    refreshHomeView(viewId, "홈을 새로고침했습니다.");
                    return;
                }
                if (menu === MENU_REORDER) {
                    state.isReorderable = !state.isReorderable;
                    setViewState(viewId, state);
                    synura.update(viewId, {
                        styles: { reorderable: !!state.isReorderable },
                        models: {
                            menus: getHomeMenus(!!state.isReorderable),
                            snackbar: state.isReorderable ? "정렬 모드를 켰습니다." : "정렬 모드를 껐습니다."
                        }
                    });
                    return;
                }
            }
            if (state && (state.kind === "board" || state.kind === "post") && menu === MENU_HOME_TOGGLE) {
                toggleCurrentBoardHome(viewId, state);
                return;
            }
            if (menu === MENU_BROWSER) {
                openBrowser((state && state.link) || SITE.browserHomeUrl, (state && state.title) || SITE.displayName, {
                    from: "browser_menu",
                    parentViewId: viewId || 0,
                    targetUrl: (state && state.link) || SITE.browserHomeUrl
                });
            } else if (menu === MENU_HOME) {
                openRoute(createHomeRoute());
            }
            return;
        }

        if (event.eventId === "SUBMIT") {
            if (event.data && Object.prototype.hasOwnProperty.call(event.data, "cookies")) {
                handleBrowserSubmit(viewId, event);
                return;
            }
            if (event.context && event.context.from === "settings") {
                handleSettingsEvent(viewId, event);
                return;
            }
            if (event.context && event.context.from === "board_add_dialog") {
                handleBoardAddEvent(viewId, event);
                return;
            }
            var button = event.data ? event.data.button : "";
            if (!button || button === BUTTON_REFRESH) {
                refreshCurrentView(viewId);
            }
            return;
        }

    }
};
