// @ts-nocheck

var SITE = {
  "siteKey": "pann",
  "displayName": "네이트 판",
  "browserHomeUrl": "https://m.pann.nate.com/talk/today",
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
  "defaultVisibleBoardIds": [],
  "hostAliases": [
    "pann.nate.com"
  ],
  "challengeMarkers": [],
  "titleSuffixes": [
    " - 네이트판",
    " : 네이트판",
    " - 판"
  ],
  "linkAllowPatterns": [
    "^https://m\\.pann\\.nate\\.com/talk/\\d+"
  ],
  "listBoardQueryParam": "",
  "hotThreshold": 3000,
  "coldThreshold": 10,
  "commentHotThreshold": 5,
  "commentColdThreshold": 3,
  "boards": [
    {
      "id": "talk_today",
      "title": "오늘의 톡",
      "url": "/talk/today",
      "hotThreshold": 5000,
      "coldThreshold": 20
    },
    {
      "id": "talk",
      "title": "판톡",
      "url": "/talk",
      "description": "판톡 메인"
    },
    {
      "id": "talk_talker",
      "title": "톡커들의 선택",
      "url": "/talk/talker"
    },
    {
      "id": "talk_ranking",
      "title": "명예의 전당",
      "url": "/talk/ranking"
    },
    {
      "id": "talk_enter",
      "title": "엔터톡",
      "url": "/talk/enter"
    },
    {
      "id": "talk_c20001",
      "title": "사는 얘기",
      "url": "/talk/c20001?order=N"
    },
    {
      "id": "talk_c20038",
      "title": "10대 이야기",
      "url": "/talk/c20038?order=N"
    },
    {
      "id": "talk_c20002",
      "title": "20대 이야기",
      "url": "/talk/c20002?order=N"
    },
    {
      "id": "talk_c20003",
      "title": "30대 이야기",
      "url": "/talk/c20003?order=N"
    },
    {
      "id": "talk_c20006",
      "title": "사랑과 이별",
      "url": "/talk/c20006?order=N"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".page-title",
      ".title",
      "title"
    ],
    "listRows": [
      "ul.list.list_type2 li",
      ".list-wrap li"
    ],
    "listLink": [
      "a.cnbox",
      "a[href*='/talk/']"
    ],
    "listTitle": [
      ".tit h2",
      ".tit",
      "h2"
    ],
    "listAuthor": [
      ".writer",
      ".nick"
    ],
    "listDate": [
      ".info .date",
      ".date"
    ],
    "listCommentCount": [
      ".count",
      ".reply"
    ],
    "listViewCount": [
      ".sub .num:first-of-type",
      ".info .view",
      ".view"
    ],
    "listLikeCount": [
      ".sub .num:last-of-type",
      ".info .like",
      ".like"
    ],
    "listCategory": [
      ".tit .cate",
      ".cate",
      ".category"
    ],
    "listImage": [
      "img"
    ],
    "postTitle": [
      ".pann-title h1",
      ".pann-title",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".writer .nick",
      ".writer",
      ".nick"
    ],
    "postDate": [
      ".pann-title .writer .sub:first-of-type .num",
      ".writer .sub:first-of-type .num",
      ".writer .date",
      ".info .date",
      ".date"
    ],
    "postViewCount": [
      ".pann-title .writer > .sub:nth-of-type(2) .num",
      ".writer > .sub:nth-of-type(2) .num",
      ".pann-title .writer .sub + .sub .num",
      ".writer .sub + .sub .num",
      ".pann-title .writer .sub:last-of-type .num",
      ".writer .sub:last-of-type .num",
      ".pann-title .writer .sub:last-of-type .num:first-of-type",
      ".writer .sub:last-of-type .num:first-of-type",
      ".under-info .view",
      ".view"
    ],
    "postLikeCount": [
      "#R_cnt > span:last-child",
      ".updown .btnbox.up .count > span:last-child",
      ".pann-title .writer .sub:last-of-type .num:last-of-type",
      ".writer .sub:last-of-type .num:last-of-type",
      ".under-info .like",
      ".like"
    ],
    "postCategory": [
      ".cate",
      ".category"
    ],
    "postContent": [
      "#pann-content",
      ".content"
    ],
    "commentRows": [
      "#listDiv dl",
      ".reply-list dl"
    ],
    "commentAuthor": [
      "dt span:not(.bar)",
      ".nick",
      ".writer",
      ".name"
    ],
    "commentContent": [
      "dd:not(.btn)",
      "dd",
      ".comment",
      ".reply",
      ".content",
      ".txt"
    ],
    "commentDate": [
      "dt em:last-of-type",
      "dt em",
      "dt .num",
      ".date",
      "time"
    ],
    "commentLikeCount": [
      "span[id^='R_cnt_']",
      "span[id^='G_cnt_']",
      ".like",
      ".recommend"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": [],
  "boardGroupMap": {
    "talk_today": "메인",
    "talk": "메인",
    "talk_talker": "메인",
    "talk_ranking": "메인",
    "talk_enter": "엔터",
    "talk_c20001": "일상",
    "talk_c20038": "세대",
    "talk_c20002": "세대",
    "talk_c20003": "세대",
    "talk_c20006": "연애"
  }
};
SITE.matchBoard = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length === 1 && parts[0] === "talk") {
        return {
            board: ensureBoard("talk", "https://" + SYNURA.domain + "/talk", "talk"),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    if (parts.length === 2 && parts[0] === "talk" && parts[1] === "today") {
        return {
            board: ensureBoard("talk_today", "https://" + SYNURA.domain + "/talk/today", "today"),
            page: 1
        };
    }
    if (parts.length === 3 && parts[0] === "talk" && parts[1] === "today" && /^\d{8}$/.test(parts[2])) {
        return {
            board: ensureBoard("talk_today", "https://" + SYNURA.domain + "/talk/today", "today"),
            page: 1
        };
    }
    if (parts.length === 2 && parts[0] === "talk" && !/^\d+$/.test(parts[1])) {
        var boardUrl = "https://" + SYNURA.domain + "/talk/" + parts[1];
        var order = normalizeWhitespace(queryValue(urlInfo.query, "order"));
        if (/^c\d+$/.test(parts[1]) && !order) order = "N";
        if (order) boardUrl = setPageParam(boardUrl, "order", order);
        return {
            board: ensureBoard("talk_" + parts[1], boardUrl, parts[1]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length >= 2 && parts[0] === "talk" && /^\d+$/.test(parts[1])) {
        return {
            board: ensureBoard("talk", "https://" + SYNURA.domain + "/talk", "talk"),
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
SITE.loadDynamicBoards = function (options) {
    var allowNetwork = !(options && options.allowNetwork === false);
    var force = !!(options && options.force);
    var cacheKey = CACHE_PREFIX + "dynamic:pann:v2";
    var cacheTsKey = cacheKey + ":ts";
    var cached = readStoredJson(cacheKey, []);
    var cachedTs = parseInt(String(localStorage.getItem(cacheTsKey) || "0"), 10) || 0;
    if (!force && Array.isArray(cached) && cached.length > 0 && (Date.now() - cachedTs) < 21600000) {
        return cached;
    }
    if (!allowNetwork) return Array.isArray(cached) ? cached : [];
    try {
        var doc = fetchDocument("https://" + SYNURA.domain + "/talk/category");
        var links = allNodes(doc, ["a[href^='/talk/']"]);
        var items = [];
        var seen = {};
        for (var i = 0; i < links.length; i++) {
            var href = ensureAbsoluteUrl(attrOf(links[i], "href"), "https://" + SYNURA.domain + "/talk/category");
            var info = parseAbsoluteUrl(href);
            if (!info) continue;
            var parts = pathSegments(info.path);
            if (parts.length !== 2 || parts[0] !== "talk" || /^\d+$/.test(parts[1])) continue;
            var boardKey = "talk_" + normalizeWhitespace(parts[1]);
            if (!boardKey || seen[boardKey]) continue;
            var title = normalizeWhitespace(textOf(links[i]));
            if (!title || title === "톡 채널") continue;
            if (/^c\d+$/.test(parts[1]) && !info.query) {
                href = "https://" + SYNURA.domain + info.path + "?order=N";
            }
            seen[boardKey] = true;
            items.push({
                id: boardKey,
                title: title,
                url: href,
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
    function pannExtractBoardDate(sourceUrl, items) {
        var info = parseAbsoluteUrl(sourceUrl);
        if (info) {
            var queryDate = normalizeWhitespace(queryValue(info.query, "stndDt"));
            if (/^\d{8}$/.test(queryDate)) return queryDate;
            var parts = pathSegments(info.path);
            if (parts.length === 3 && parts[0] === "talk" && parts[1] === "today" && /^\d{8}$/.test(parts[2])) {
                return parts[2];
            }
        }
        for (var i = 0; i < (items || []).length; i++) {
            var itemInfo = parseAbsoluteUrl(items[i] ? items[i].link : "");
            if (!itemInfo) continue;
            var itemDate = normalizeWhitespace(queryValue(itemInfo.query, "stndDt"));
            if (/^\d{8}$/.test(itemDate)) return itemDate;
        }
        return "";
    }

    function pannPrevDate(yyyymmdd) {
        if (!/^\d{8}$/.test(yyyymmdd)) return "";
        var year = parseInt(yyyymmdd.substring(0, 4), 10);
        var month = parseInt(yyyymmdd.substring(4, 6), 10) - 1;
        var day = parseInt(yyyymmdd.substring(6, 8), 10);
        var dt = new Date(Date.UTC(year, month, day));
        if (isNaN(dt.getTime())) return "";
        dt.setUTCDate(dt.getUTCDate() - 1);
        var mm = String(dt.getUTCMonth() + 1);
        var dd = String(dt.getUTCDate());
        if (mm.length < 2) mm = "0" + mm;
        if (dd.length < 2) dd = "0" + dd;
        return String(dt.getUTCFullYear()) + mm + dd;
    }

    if (context && (context.boardId === "talk" || context.boardId === "talk_today")) {
        var currentDate = pannExtractBoardDate(url, items);
        var prevDate = pannPrevDate(currentDate);
        if (prevDate) {
            context.nextUrl = "https://" + SYNURA.domain + "/talk/today/" + prevDate;
        }
    }
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
function pannParseHtml(html) {
    try {
        return new DOMParser().parseFromString(String(html || ""), "text/html");
    } catch (e) {
        return null;
    }
}
function pannExtractSectionHtml(html, marker) {
    var source = String(html || "");
    if (!source) return "";

    var start = source.indexOf(String(marker || ""));
    if (start < 0) return "";

    var divStart = source.lastIndexOf("<div", start);
    if (divStart < 0) divStart = start;

    var end = source.length;
    var endTokens = [
        '<div class="paging"',
        '<div class="navi-btn-bot"',
        '<script ',
        "</body>"
    ];
    for (var j = 0; j < endTokens.length; j++) {
        var index = source.indexOf(endTokens[j], divStart);
        if (index >= 0 && index < end) end = index;
    }

    return source.substring(divStart, end);
}
function pannCommentRows(doc) {
    return allNodes(doc, [
        "#listDiv dl",
        ".reply-list.reply-best dl",
        ".reply-list.view-best dl",
        ".reply-list dl"
    ]);
}
function pannCommentContentNode(row) {
    return firstNode(row, [
        "dd.userText",
        "dd:not(.updown):not(.btn)",
        "dd:not(.btn)",
        "dd"
    ]);
}
function pannBuildComment(row, postUrl, index) {
    var contentNode = pannCommentContentNode(row);
    var content = parseDetails(contentNode, postUrl);
    if (!content || content.length === 0) {
        var text = firstText(row, [
            "dd.userText",
            "dd:not(.updown):not(.btn)",
            "dd:not(.btn)",
            "dd"
        ]);
        if (text) {
            content = [{
                type: "text",
                value: text
            }];
        }
    }
    if (!content || content.length === 0) return null;

    var likeCount = hideZeroCount(parseCount(firstText(row, [
        "dd.updown span[id^='R_cnt_']",
        "span[id^='R_cnt_']",
        ".btnbox.up span:last-child",
        ".up .count + span",
        ".like",
        ".recommend"
    ])));
    var dislikeCount = hideZeroCount(parseCount(firstText(row, [
        "dd.updown span[id^='O_cnt_']",
        "span[id^='O_cnt_']"
    ])));

    return {
        link: postUrl + "#comment-" + (index + 1),
        author: firstAuthorText(row, SITE.selectors.commentAuthor),
        avatar: imageUrlFromNode(firstNode(row, SITE.selectors.commentAvatar || SITE.selectors.commentAuthor), postUrl),
        content: content,
        date: firstText(row, SITE.selectors.commentDate),
        likeCount: likeCount,
        dislikeCount: dislikeCount,
        level: detectCommentLevel(row),
        menus: [],
        hotCount: toInt(likeCount, 0),
        coldCount: toInt(dislikeCount, 0)
    };
}
function pannParseCommentsFromDoc(doc, postUrl) {
    var rows = pannCommentRows(doc);
    var out = [];
    for (var i = 0; i < rows.length; i++) {
        var item = pannBuildComment(rows[i], postUrl, i);
        if (item) out.push(item);
    }
    return out;
}
function pannParseCommentsFromHtmlSection(sectionHtml, postUrl) {
    var source = String(sectionHtml || "");
    if (!source) return [];

    var blocks = source.match(/<dl\b[\s\S]*?<\/dl>/g) || [];
    var out = [];
    for (var i = 0; i < blocks.length; i++) {
        var rowDoc = pannParseHtml("<div>" + blocks[i] + "</div>");
        var row = firstNode(rowDoc, ["dl"]);
        var item = pannBuildComment(row, postUrl, out.length);
        if (item) out.push(item);
    }
    return out;
}
function pannParseReplyPage(html, postUrl) {
    var source = String(html || "");
    var comments = pannParseCommentsFromHtmlSection(pannExtractSectionHtml(source, 'id="listDiv"'), postUrl);

    if (comments.length === 0) {
        comments = pannParseCommentsFromHtmlSection(pannExtractSectionHtml(source, 'class="reply-list reply-best"'), postUrl);
    }
    if (comments.length === 0) {
        comments = pannParseCommentsFromHtmlSection(pannExtractSectionHtml(source, 'class="reply-list view-best"'), postUrl);
    }
    if (comments.length === 0) {
        var doc = pannParseHtml(source);
        comments = pannParseCommentsFromDoc(doc, postUrl);
    }

    var maxPage = 1;
    var pageRegex = /[?&]vPage=(\d+)/g;
    var match = null;
    while ((match = pageRegex.exec(source))) {
        var pageNo = parseInt(String(match[1] || "0"), 10);
        if (pageNo > maxPage) maxPage = pageNo;
    }

    return {
        comments: comments,
        maxPage: maxPage
    };
}
SITE.parseComments = function (doc, postUrl) {
    return pannParseCommentsFromDoc(doc, postUrl);
};
SITE.fetchPostComments = function (match, url, doc, page, comments) {
    function pannReplyViewUrl(pageNo) {
        var info = parseAbsoluteUrl(url);
        var query = [];
        query.push("pann_id=" + encodeURIComponent(match ? match.postId : ""));

        var currMenu = normalizeWhitespace(queryValue(info ? info.query : "", "currMenu"));
        var stndDt = normalizeWhitespace(queryValue(info ? info.query : "", "stndDt"));
        var gb = normalizeWhitespace(queryValue(info ? info.query : "", "gb")) || "d";
        var order = normalizeWhitespace(queryValue(info ? info.query : "", "order")) || "N";
        var rankingType = normalizeWhitespace(queryValue(info ? info.query : "", "rankingType")) || "total";

        if (currMenu) query.push("currMenu=" + encodeURIComponent(currMenu));
        if (stndDt) query.push("stndDt=" + encodeURIComponent(stndDt));
        query.push("vPage=" + encodeURIComponent(String(pageNo)));
        query.push("gb=" + encodeURIComponent(gb));
        query.push("order=" + encodeURIComponent(order));
        query.push("rankingType=" + encodeURIComponent(rankingType));

        return "https://" + SYNURA.domain + "/talk/reply/view?" + query.join("&");
    }

    function pannFetchReplyPage(pageNo) {
        var response = fetchWithLogging(pannReplyViewUrl(pageNo), buildFetchOptions());
        if (!response || !response.ok) return null;
        return pannParseReplyPage(response.text(), url);
    }

    function pannDecorateComments(list, pageNo) {
        var out = [];
        for (var i = 0; i < (list || []).length; i++) {
            var item = list[i];
            if (!item) continue;
            item.link = url + "#reply-" + pageNo + "-" + (i + 1);
            out.push(item);
        }
        return out;
    }

    var firstPage = pannFetchReplyPage(1);
    if (!firstPage) return comments;

    var out = [];
    var seenPages = { "1": true };
    out = out.concat(pannDecorateComments(firstPage.comments, 1));

    var maxPage = firstPage.maxPage || 1;

    for (var pageNo = 2; pageNo <= maxPage; pageNo++) {
        if (seenPages[String(pageNo)]) continue;
        seenPages[String(pageNo)] = true;
        var replyPage = pannFetchReplyPage(pageNo);
        if (!replyPage) continue;
        out = out.concat(pannDecorateComments(replyPage.comments, pageNo));
    }

    return out.length > 0 ? out : comments;
};
SITE.handleViewEvent = function (viewId, event, state, context) {
    return false;
};
SITE.handleBoardSettingsRootEvent = function (viewId, event, state) {
    return false;
};

var SYNURA = {
    domain: "m.pann.nate.com",
    name: "pann",
    description: "Unofficial Nate Pann extension",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://m.pann.nate.com/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = ["^https://m\\.pann\\.nate\\.com/talk/\\d+"];
var LIST_LINK_SELECTORS = ["a.cnbox","a[href*='/talk/']"];
var LIST_TITLE_SELECTORS = [".tit h2",".tit","h2"];
var LIST_AUTHOR_SELECTORS = [".writer",".nick"];
var LIST_AVATAR_SELECTORS = [];
var LIST_DATE_SELECTORS = [".info .date",".date"];
var LIST_COMMENT_COUNT_SELECTORS = [".count",".reply"];
var LIST_VIEW_COUNT_SELECTORS = [".sub .num:first-of-type",".info .view",".view"];
var LIST_LIKE_COUNT_SELECTORS = [".sub .num:last-of-type",".info .like",".like"];
var LIST_CATEGORY_SELECTORS = [".tit .cate",".cate",".category"];
var LIST_IMAGE_SELECTORS = ["img"];

function extractListItem(row, baseUrl) {
    var linkSelectors = selectorList("listLink", LIST_LINK_SELECTORS);
    var titleSelectors = selectorList("listTitle", LIST_TITLE_SELECTORS);
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
        textOfNodeWithoutSelectors(titleNode, commentCountSelectors),
        textOf(linkNode),
        textOf(row)
    ]);
    if (!title) return null;

    var commentCount = hideZeroCount(parseCount(firstText(row, commentCountSelectors)));
    var viewCount = hideZeroCount(parseCount(firstText(row, viewCountSelectors)));
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
