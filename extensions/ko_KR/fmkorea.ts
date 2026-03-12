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
  "defaultVisibleBoardIds": [],
  "hostAliases": [
    "fmkorea.com",
    "m.fmkorea.com"
  ],
  "challengeMarkers": [
    "에펨코리아 보안 시스템",
    "help@fmkorea.com",
    "/mc/mc.php"
  ],
  "titleSuffixes": [
    " - 에펨코리아",
    " - FMKorea.com",
    " : 에펨코리아"
  ],
  "linkAllowPatterns": [
    "^https://www\\.fmkorea\\.com/(?:[A-Za-z0-9_]+/)?\\d+(?:\\?|$)"
  ],
  "listBoardQueryParam": "",
  "boards": [
    {
      "id": "slug_best",
      "title": "포텐",
      "url": "/best",
      "description": "모바일 베스트"
    },
    {
      "id": "slug_best2",
      "title": "실시간 인기",
      "url": "/best2",
      "description": "모바일 실시간 인기"
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
      ".board_title",
      ".cate_title",
      "title"
    ],
    "listRows": [
      "li.li",
      ".bd_lst li"
    ],
    "listLink": [
      "h3.title a",
      "a[href]"
    ],
    "listTitle": [
      "h3.title",
      ".title"
    ],
    "listAuthor": [
      ".author"
    ],
    "listDate": [
      ".regdate",
      ".date"
    ],
    "listCommentCount": [
      ".comment_count",
      ".replyNum"
    ],
    "listViewCount": [
      ".readed_count",
      ".readedCount"
    ],
    "listLikeCount": [
      ".voted_count",
      ".voteNum"
    ],
    "listCategory": [
      ".category"
    ],
    "listImage": [
      "img.thumb",
      "img"
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
SITE.matchBoard = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (urlInfo.path === "/index.php") {
        var mid = queryValue(urlInfo.query, "mid");
        if (mid) {
            return {
                board: ensureBoard("mid_" + mid, "https://" + SYNURA.domain + "/index.php?mid=" + mid, mid),
                page: queryInt(urlInfo.query, "page", 1)
            };
        }
    }
    if (parts.length === 1 && parts[0] && !/^\d+$/.test(parts[0])) {
        return {
            board: ensureBoard("slug_" + parts[0], "https://" + SYNURA.domain + "/" + parts[0], parts[0]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length === 1 && /^\d+$/.test(parts[0])) {
        return {
            board: ensureBoard("slug_best", "https://" + SYNURA.domain + "/best", "best"),
            postId: parts[0]
        };
    }
    if (parts.length === 2 && !/^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
        return {
            board: ensureBoard("slug_" + parts[0], "https://" + SYNURA.domain + "/" + parts[0], parts[0]),
            postId: parts[1]
        };
    }
    return null;
};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    return setPageParam(currentUrl, "page", nextPage);
};
SITE.buildPostFetchUrls = function (match, currentUrl) {
    return [currentUrl];
};
SITE.buildBoardUrlFromId = function (boardId) {
    return "";
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
    domain: "www.fmkorea.com",
    name: "fmkorea",
    description: "Unofficial Synura extension for FMKorea mobile boards.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://www.fmkorea.com/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = ["^https://www\\.fmkorea\\.com/(?:[A-Za-z0-9_]+/)?\\d+(?:\\?|$)"];
var LIST_LINK_SELECTORS = ["h3.title a","a[href]"];
var LIST_TITLE_SELECTORS = ["h3.title",".title"];
var LIST_AUTHOR_SELECTORS = [".author"];
var LIST_AVATAR_SELECTORS = [];
var LIST_DATE_SELECTORS = [".regdate",".date"];
var LIST_COMMENT_COUNT_SELECTORS = [".comment_count",".replyNum"];
var LIST_VIEW_COUNT_SELECTORS = [".readed_count",".readedCount"];
var LIST_LIKE_COUNT_SELECTORS = [".voted_count",".voteNum"];
var LIST_CATEGORY_SELECTORS = [".category"];
var LIST_IMAGE_SELECTORS = ["img.thumb","img"];

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
