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
  "boards": [
    {
      "id": "live",
      "title": "실시간",
      "url": "/b/live",
      "description": "실시간 인기"
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
SITE.parseComments = function (doc, postUrl) {
    return parseGenericComments(doc, postUrl);
};
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
    var linkNode = firstNode(row, LIST_LINK_SELECTORS);
    var titleNode = firstNode(row, LIST_TITLE_SELECTORS);
    var link = extractListLink(row, baseUrl, LIST_LINK_SELECTORS, LIST_LINK_ALLOW_PATTERNS);
    if (!link) return null;

    var title = firstNonEmpty([
        textOfNodeWithoutSelectors(titleNode, LIST_TITLE_EXCLUDE_SELECTORS),
        textOf(linkNode),
        textOf(row)
    ]);
    title = normalizeWhitespace(String(title || "").replace(/\s*\[\d+\]\s*$/, ""));
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
        hotCount: toInt(likeCount, 0),
        coldCount: 0
    };
}
