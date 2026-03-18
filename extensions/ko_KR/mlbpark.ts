// @ts-nocheck

var MLBPARK_PRELOADED_BOARDS = [
  {
    "id": "bullpen",
    "title": "불펜",
    "url": "/mp/b.php?m=list&b=bullpen",
    "description": "대표 자유 게시판",
    "hotThreshold": 3000,
    "coldThreshold": 25
  },
  {
    "id": "mlbtown",
    "title": "MLB타운",
    "url": "/mp/b.php?m=list&b=mlbtown",
    "description": "메이저리그 게시판"
  },
  {
    "id": "kbotown",
    "title": "KBO타운",
    "url": "/mp/b.php?m=list&b=kbotown",
    "description": "국내야구 게시판"
  },
  {
    "id": "news",
    "title": "뉴스",
    "url": "/mp/b.php?m=list&b=news",
    "description": "뉴스 게시판"
  },
  {
    "id": "suggestion",
    "title": "건의사항",
    "url": "/mp/b.php?m=list&b=suggestion",
    "description": "건의사항 게시판"
  },
  {
    "id": "phone",
    "title": "폰판기",
    "url": "/mp/b.php?m=list&b=phone",
    "description": "폰판기 게시판"
  },
  {
    "id": "notice",
    "title": "공지사항",
    "url": "/mp/b.php?m=list&b=notice",
    "description": "운영 공지 게시판"
  },
  {
    "id": "point",
    "title": "포인트",
    "url": "/mp/b.php?m=list&b=point",
    "description": "포인트 및 이벤트 게시판"
  },
  {
    "id": "best_mlbtown_like",
    "title": "MLB타운 최다추천",
    "url": "/mp/best.php?b=mlbtown&m=like",
    "description": "MLB타운 추천 베스트"
  },
  {
    "id": "best_mlbtown_view",
    "title": "MLB타운 최고조회",
    "url": "/mp/best.php?b=mlbtown&m=view",
    "description": "MLB타운 조회 베스트"
  },
  {
    "id": "best_mlbtown_reply",
    "title": "MLB타운 최다댓글",
    "url": "/mp/best.php?b=mlbtown&m=reply",
    "description": "MLB타운 댓글 베스트"
  },
  {
    "id": "best_kbotown_like",
    "title": "KBO타운 최다추천",
    "url": "/mp/best.php?b=kbotown&m=like",
    "description": "KBO타운 추천 베스트"
  },
  {
    "id": "best_kbotown_view",
    "title": "KBO타운 최고조회",
    "url": "/mp/best.php?b=kbotown&m=view",
    "description": "KBO타운 조회 베스트"
  },
  {
    "id": "best_kbotown_reply",
    "title": "KBO타운 최다댓글",
    "url": "/mp/best.php?b=kbotown&m=reply",
    "description": "KBO타운 댓글 베스트"
  },
  {
    "id": "best_bullpen_like",
    "title": "불펜 최다추천",
    "url": "/mp/best.php?b=bullpen&m=like",
    "description": "불펜 추천 베스트"
  },
  {
    "id": "best_bullpen_view",
    "title": "불펜 최고조회",
    "url": "/mp/best.php?b=bullpen&m=view",
    "description": "불펜 조회 베스트"
  },
  {
    "id": "best_bullpen_reply",
    "title": "불펜 최다댓글",
    "url": "/mp/best.php?b=bullpen&m=reply",
    "description": "불펜 댓글 베스트"
  }
];

for (var mlbparkBoardIdx = 0; mlbparkBoardIdx < MLBPARK_PRELOADED_BOARDS.length; mlbparkBoardIdx++) {
  var mlbparkBoard = MLBPARK_PRELOADED_BOARDS[mlbparkBoardIdx];
  if (/^best_/.test(mlbparkBoard.id)) {
    mlbparkBoard.hotThreshold = 5000;
    mlbparkBoard.coldThreshold = 40;
  }
}

var MLBPARK_DEFAULT_VISIBLE_BOARD_IDS = [
  "bullpen",
  "mlbtown",
  "kbotown",
  "news",
  "suggestion",
  "phone",
  "best_mlbtown_like",
  "best_kbotown_like",
  "best_bullpen_like",
  "best_bullpen_reply"
];

var SITE = {
  "siteKey": "mlbpark",
  "displayName": "엠팍",
  "browserHomeUrl": "https://mlbpark.donga.com/mp/b.php?b=bullpen",
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
  "defaultVisibleBoardIds": MLBPARK_DEFAULT_VISIBLE_BOARD_IDS,
  "hostAliases": [],
  "challengeMarkers": [],
  "titleSuffixes": [
    " - MLBPARK",
    " : MLBPARK"
  ],
  "linkAllowPatterns": [
    "b\\.php\\?[^#]*\\bm=view\\b"
  ],
  "listBoardQueryParam": "",
  "hotThreshold": 2000,
  "coldThreshold": 15,
  "commentHotThreshold": 5,
  "commentColdThreshold": 3,
  "boards": MLBPARK_PRELOADED_BOARDS,
  "selectors": {
    "boardTitle": [
      ".board_title",
      ".title",
      "title"
    ],
    "listRows": [
      ".tbl_type01 tbody tr"
    ],
    "listLink": [
      "td.t_left a.txt",
      ".title a.txt",
      ".title .txt_in .link_txt",
      "a[href*='m=view']"
    ],
    "listTitle": [
      "td.t_left a.txt",
      ".title",
      ".txt",
      ".txt_in"
    ],
    "listAuthor": [
      "td .nick",
      ".info .nick"
    ],
    "listAvatar": [
      "td .photo img",
      ".info .photo img",
      ".photo img"
    ],
    "listDate": [
      "td .date",
      ".info .date"
    ],
    "listCommentCount": [
      ".replycnt",
      ".reply",
      ".comment"
    ],
    "listViewCount": [
      ".viewV",
      ".view"
    ],
    "listLikeCount": [
      ".recommend",
      ".recom"
    ],
    "listCategory": [
      ".list_word",
      ".cate",
      ".category"
    ],
    "listImage": [
      ".icon_img img",
      ".thumb img",
      "img[src*='simg.donga.com']"
    ],
    "postTitle": [
      "title",
      ".titles",
      "h1"
    ],
    "postAuthor": [
      ".view_head .nick",
      ".nick"
    ],
    "postAvatar": [
      ".view_head .photo img",
      ".view_head .items .photo img",
      ".photo img"
    ],
    "postDate": [
      ".titles .date",
      ".date"
    ],
    "postViewCount": [
      ".view_head .text2",
      ".view"
    ],
    "postLikeCount": [
      ".recommend",
      ".recom"
    ],
    "postCategory": [
      ".cate",
      ".category"
    ],
    "postContent": [
      "#contentDetail",
      ".contentDetail"
    ],
    "commentRows": [
      ".reply_list .other_con",
      ".reply_list > div",
      ".reply_list .other_con.replied"
    ],
    "commentAuthor": [
      ".name",
      ".nick"
    ],
    "commentAvatar": [
      ".other_con .photo img",
      ".reply_list .photo img",
      ".photo img"
    ],
    "commentContent": [
      ".re_txt",
      ".content",
      ".txt",
      ".other_reply .txt_box"
    ],
    "commentDate": [
      ".date",
      "time"
    ],
    "commentLikeCount": [
      ".recommend",
      ".recom"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": [],
  "boardGroupMap": {
    "bullpen": "커뮤니티",
    "mlbtown": "야구",
    "kbotown": "야구",
    "news": "뉴스",
    "suggestion": "운영",
    "phone": "장터",
    "notice": "운영",
    "point": "운영",
    "best_mlbtown_like": "베스트",
    "best_mlbtown_view": "베스트",
    "best_mlbtown_reply": "베스트",
    "best_kbotown_like": "베스트",
    "best_kbotown_view": "베스트",
    "best_kbotown_reply": "베스트",
    "best_bullpen_like": "베스트",
    "best_bullpen_view": "베스트",
    "best_bullpen_reply": "베스트"
  }
};
SITE.matchBoard = function (urlInfo) {
    if (urlInfo.path === "/mp/b.php") {
        var boardId = queryValue(urlInfo.query, "b");
        var postId = queryValue(urlInfo.query, "id");
        var mode = queryValue(urlInfo.query, "m");
        if (boardId && !postId && (!mode || mode === "l" || mode === "list")) {
            return {
                board: ensureBoard(boardId, "https://" + SYNURA.domain + "/mp/b.php?m=list&b=" + boardId, boardId),
                page: queryInt(urlInfo.query, "p", 1)
            };
        }
    }
    if (urlInfo.path === "/mp/best.php") {
        var bestBoardId = queryValue(urlInfo.query, "b");
        var metric = queryValue(urlInfo.query, "m");
        if (bestBoardId && metric) {
            return {
                board: ensureBoard("best_" + bestBoardId + "_" + metric, "https://" + SYNURA.domain + "/mp/best.php?b=" + bestBoardId + "&m=" + metric, bestBoardId + " " + metric),
                page: 1
            };
        }
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    if (urlInfo.path === "/mp/b.php") {
        var boardId = queryValue(urlInfo.query, "b");
        var postId = queryValue(urlInfo.query, "id");
        var mode = queryValue(urlInfo.query, "m");
        if (boardId && postId && (!mode || mode === "view")) {
            return {
                board: ensureBoard(boardId, "https://" + SYNURA.domain + "/mp/b.php?m=list&b=" + boardId, boardId),
                postId: postId
            };
        }
    }
    return null;
};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    var info = parseAbsoluteUrl(currentUrl);
    if (info && info.path === "/mp/best.php") return "";
    var currentOffset = info && info.query ? queryInt(info.query, "p", 1) : 1;
    if (!(currentOffset > 0)) currentOffset = 1;
    var nextOffset = currentOffset + MLBPARK_BOARD_PAGE_SIZE;
    var withMode = setQueryParam(currentUrl, "m", "list");
    return setPageParam(withMode || currentUrl, "p", nextOffset);
};
SITE.buildPostFetchUrls = function (match, currentUrl) {
    return [currentUrl];
};
SITE.buildBoardUrlFromId = function (boardId) {
    var normalizedBoardId = normalizeWhitespace(boardId);
    return normalizedBoardId
        ? "https://" + SYNURA.domain + "/mp/b.php?m=list&b=" + encodeURIComponent(normalizedBoardId)
        : "";
};
SITE.loadDynamicBoards = function (options) {
    var allowNetwork = !(options && options.allowNetwork === false);
    var force = !!(options && options.force);
    var cacheKey = CACHE_PREFIX + "dynamic:mlbpark:v3";
    var cacheTsKey = cacheKey + ":ts";
    var cached = readStoredJson(cacheKey, []);
    var cachedTs = parseInt(String(localStorage.getItem(cacheTsKey) || "0"), 10) || 0;
    if (!force && Array.isArray(cached) && cached.length > 0 && (Date.now() - cachedTs) < 21600000) {
        return cached;
    }
    if (!allowNetwork) return Array.isArray(cached) ? cached : [];
    try {
        var doc = fetchDocument(SITE.browserHomeUrl);
        var items = [];
        var seen = {};

        function pushBoard(id, title, url, description, group) {
            var boardId = normalizeWhitespace(id);
            var boardTitle = normalizeWhitespace(title);
            if (!boardId || !boardTitle || seen[boardId]) return;
            seen[boardId] = true;
            items.push({
                id: boardId,
                title: boardTitle,
                url: normalizeUrl(url) || url,
                description: normalizeWhitespace(description || boardTitle),
                group: cleanBoardGroupText(group || ""),
                dynamic: true
            });
        }

        var realLinks = allNodes(doc, ["a[href*='/mp/b.php?b=']"]);
        for (var i = 0; i < realLinks.length; i++) {
            var href = ensureAbsoluteUrl(attrOf(realLinks[i], "href"), "https://" + SYNURA.domain + "/");
            var info = parseAbsoluteUrl(href);
            if (!info || info.path !== "/mp/b.php") continue;
            var boardId = normalizeWhitespace(queryValue(info.query, "b"));
            if (!boardId || queryValue(info.query, "m") === "view" || queryValue(info.query, "id")) continue;
            var title = firstNonEmpty([firstText(realLinks[i], ["span"]), textOf(realLinks[i]), boardId]);
            pushBoard(
                boardId,
                title,
                "https://" + SYNURA.domain + "/mp/b.php?m=list&b=" + encodeURIComponent(boardId),
                title,
                inferBoardGroupFromContext(realLinks[i])
            );
        }

        var bestLinks = allNodes(doc, ["a[href*='/mp/best.php?b=']"]);
        for (var j = 0; j < bestLinks.length; j++) {
            var bestHref = ensureAbsoluteUrl(attrOf(bestLinks[j], "href"), "https://" + SYNURA.domain + "/");
            var bestInfo = parseAbsoluteUrl(bestHref);
            if (!bestInfo || bestInfo.path !== "/mp/best.php") continue;
            var baseBoardId = normalizeWhitespace(queryValue(bestInfo.query, "b"));
            var metric = normalizeWhitespace(queryValue(bestInfo.query, "m"));
            if (!baseBoardId || !metric) continue;
            var metricTitle = metric === "like" ? "최다추천" : (metric === "view" ? "최고조회" : (metric === "reply" ? "최다댓글" : metric));
            pushBoard(
                "best_" + baseBoardId + "_" + metric,
                baseBoardId.toUpperCase() + " " + metricTitle,
                "https://" + SYNURA.domain + "/mp/best.php?b=" + encodeURIComponent(baseBoardId) + "&m=" + encodeURIComponent(metric),
                metricTitle,
                inferBoardGroupFromContext(bestLinks[j]) || "베스트"
            );
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
    var page = mlbparkFetchPostPage(url);
    var doc = page.doc;
    var finalUrl = page.finalUrl || url;
    var titleNode = firstNode(doc, ["title"]);
    var contentRoot = mlbparkSanitizePostContent(firstNode(doc, SITE.selectors.postContent));
    var content = parseDetails(contentRoot, finalUrl);
    content = mlbparkCleanPostDetails(content);
    content = mlbparkAttachImageHeaders(content, finalUrl);
    var rememberedItem = getRememberedItemPreview(url) || getRememberedItemPreview(finalUrl);
    var schemaPost = detectSchemaPost(doc);
    var comments = parseComments(doc, finalUrl);
    try {
        var fetchedComments = SITE.fetchPostComments ? SITE.fetchPostComments(match, finalUrl, doc, page, comments) : null;
        if (Array.isArray(fetchedComments) && fetchedComments.length > 0) {
            comments = fetchedComments;
        }
    } catch (e) {
    }
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

    return {
        kind: "post",
        url: finalUrl,
        viewData: {
            view: "/views/post",
            styles: {
                title: firstNonEmpty([
                    preferLongerText(
                        cleanPageTitle(firstText(doc, SITE.selectors.postTitle)),
                        rememberedItem ? cleanPageTitle(rememberedItem.title) : ""
                    ),
                    cleanPageTitle(schemaPost ? schemaPost.headline : ""),
                    cleanPageTitle(textOf(titleNode)),
                    rememberedItem ? cleanPageTitle(rememberedItem.title) : "",
                    match.board ? match.board.title : "",
                    SITE.displayName
                ]),
                menu: true
            },
            models: {
                author: firstNonEmpty([
                    cleanSingleLineField(firstAuthorText(doc, SITE.selectors.postAuthor), 80),
                    schemaPost ? schemaPost.author : "",
                    rememberedItem ? rememberedItem.author : ""
                ]),
                avatar: firstNonEmpty([
                    imageUrlFromNode(firstNode(doc, SITE.selectors.postAvatar || SITE.selectors.postAuthor), finalUrl),
                    rememberedItem ? rememberedItem.avatar : ""
                ]),
                date: firstNonEmpty([
                    mlbparkExtractPostDate(doc),
                    schemaPost ? schemaPost.datePublished : "",
                    rememberedItem ? rememberedItem.date : ""
                ]),
                category: firstNonEmpty([
                    cleanSingleLineField(firstText(doc, SITE.selectors.postCategory), 60),
                    rememberedItem ? rememberedItem.category : ""
                ]),
                viewCount: firstNonEmpty([
                    mlbparkExtractPostMetric(doc, "조회"),
                    rememberedItem ? rememberedItem.viewCount : ""
                ]),
                likeCount: hideZeroCount(firstNonEmpty([
                    parseCount(firstText(doc, SITE.selectors.postLikeCount)),
                    rememberedItem ? rememberedItem.likeCount : ""
                ])),
                content: content,
                comments: comments,
                link: finalUrl,
                menus: getPostMenus(match),
                buttons: [BUTTON_REFRESH]
            }
        },
        context: {
            kind: "post",
            link: finalUrl,
            boardId: match.board ? match.board.id : ""
        }
    };
};

function mlbparkFetchPostPage(url) {
    var currentUrl = normalizeUrl(url) || url;
    var baseSiteUrl = "https://" + SYNURA.domain + "/";
    var lastStatus = 0;

    for (var i = 0; i < 4; i++) {
        var response = fetchWithLogging(currentUrl, buildFetchOptions());
        if (!response) {
            throw new Error("Failed to fetch " + currentUrl + " (0)");
        }

        var status = response.status || 0;
        lastStatus = status;
        var redirectUrl = mlbparkRedirectTarget(response, currentUrl, baseSiteUrl);
        if (redirectUrl) {
            currentUrl = redirectUrl;
            continue;
        }

        var html = response.text();
        var authRequired = shouldUseBrowserCookieAuth() &&
            (isChallengeHtml(html) || isBrowserAuthRequiredStatus(status));
        var restricted = !response.ok && (status === 401 || status === 403) && !isChallengeHtml(html);
        if (authRequired) {
            throw makeAuthRequiredError(currentUrl, status);
        }
        if (!response.ok && !restricted) {
            throw new Error("Failed to fetch " + currentUrl + " (" + status + ")");
        }

        return {
            response: response,
            doc: response.dom("text/html"),
            restricted: restricted,
            finalUrl: normalizeUrl(currentUrl) || currentUrl
        };
    }

    throw new Error("Failed to fetch " + currentUrl + " (" + lastStatus + ")");
}

function mlbparkNodeMatches(node, selector) {
    if (!node || !selector || typeof node.matches !== "function") return false;
    try {
        return !!node.matches(selector);
    } catch (e) {
    }
    return false;
}

function mlbparkNodeMatchesAny(node, selectors) {
    if (!node || !selectors) return false;
    for (var i = 0; i < selectors.length; i++) {
        if (mlbparkNodeMatches(node, selectors[i])) return true;
    }
    return false;
}

function mlbparkDescendantsBySelectors(root, selectors) {
    if (!root || !root.querySelectorAll || !selectors || selectors.length === 0) return [];
    var descendants = root.querySelectorAll("*");
    var out = [];
    for (var i = 0; i < descendants.length; i++) {
        if (mlbparkNodeMatchesAny(descendants[i], selectors)) out.push(descendants[i]);
    }
    return out;
}

function mlbparkHasAncestor(node, selectors) {
    var current = node ? node.parentElement : null;
    while (current) {
        for (var i = 0; i < (selectors || []).length; i++) {
            if (mlbparkNodeMatches(current, selectors[i])) return true;
        }
        current = current.parentElement;
    }
    return false;
}

function mlbparkExpectedBoardId(baseUrl) {
    var info = parseAbsoluteUrl(baseUrl);
    return info ? normalizeWhitespace(queryValue(info.query, "b")) : "";
}

function mlbparkParseBoardItemsFromSelector(doc, baseUrl, selector, options) {
    if (!doc || !selector) return [];

    var rows = doc.querySelectorAll(selector);
    var items = [];
    var seen = {};
    var expectedBoardId = normalizeWhitespace(options && options.expectedBoardId);
    var excludeAncestorSelectors = options && options.excludeAncestorSelectors ? options.excludeAncestorSelectors : [];

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!row || mlbparkHasAncestor(row, excludeAncestorSelectors)) continue;

        var item = extractListItem(row, baseUrl);
        if (!item || !item.link || seen[item.link]) continue;

        if (expectedBoardId) {
            var linkInfo = parseAbsoluteUrl(item.link);
            var linkedBoardId = linkInfo ? normalizeWhitespace(queryValue(linkInfo.query, "b")) : "";
            if (!linkedBoardId || linkedBoardId !== expectedBoardId) continue;
        }

        seen[item.link] = true;
        item.category = formatBoardListCategory(item.category || "");
        items.push(item);
    }

    return items;
}

SITE.parseBoardItemsCustom = function (doc, baseUrl) {
    var expectedBoardId = mlbparkExpectedBoardId(baseUrl);
    var tableItems = mlbparkParseBoardItemsFromSelector(doc, baseUrl, ".tbl_type01 tbody tr", {
        expectedBoardId: expectedBoardId
    });
    if (tableItems.length > 0) return tableItems;

    var fallbackSelectors = [
        ".left_cont li.items",
        ".contents li.items",
        "li.items"
    ];
    var excludeAncestorSelectors = [
        "#PC_mlbtown_today",
        "#PC_kbotown_today",
        "#PC_bullpen_today",
        ".lists_today_contxt",
        ".elaborate_list",
        ".burning",
        ".naver_power",
        "#right_cont"
    ];
    for (var i = 0; i < fallbackSelectors.length; i++) {
        var fallbackItems = mlbparkParseBoardItemsFromSelector(doc, baseUrl, fallbackSelectors[i], {
            expectedBoardId: expectedBoardId,
            excludeAncestorSelectors: excludeAncestorSelectors
        });
        if (fallbackItems.length > 0) return fallbackItems;
    }

    return [];
};

function mlbparkRedirectTarget(response, currentUrl, baseSiteUrl) {
    var status = response && response.status ? response.status : 0;
    if (status < 300 || status >= 400) return "";

    var normalizedCurrentUrl = normalizeUrl(currentUrl) || currentUrl;
    var responseUrl = normalizeUrl(response && response.url);
    if (responseUrl && responseUrl !== normalizedCurrentUrl) {
        return responseUrl;
    }

    var headers = response && response.headers ? response.headers : null;
    var location = mlbparkHeaderValue(headers, "Location");
    if (!location) return "";

    var resolved = normalizeUrl(location) ||
        ensureAbsoluteUrl(location, currentUrl) ||
        ensureAbsoluteUrl(location, baseSiteUrl) ||
        "";
    return resolved && resolved !== normalizedCurrentUrl ? resolved : "";
}

function mlbparkHeaderValue(headers, name) {
    if (!headers) return "";

    if (typeof headers.get === "function") {
        var got = normalizeWhitespace(headers.get(name) || headers.get(String(name || "").toLowerCase()));
        if (got) return got;
    }

    if (typeof headers.forEach === "function") {
        var target = String(name || "").toLowerCase();
        var found = "";
        headers.forEach(function (value, key) {
            if (found || String(key || "").toLowerCase() !== target) return;
            found = normalizeWhitespace(value);
        });
        if (found) return found;
    }

    var direct = normalizeWhitespace(headers[name]);
    if (direct) return direct;

    var target = String(name || "").toLowerCase();
    for (var key in headers) {
        if (!Object.prototype.hasOwnProperty.call(headers, key)) continue;
        if (String(key).toLowerCase() !== target) continue;
        return normalizeWhitespace(headers[key]);
    }

    return "";
}

function mlbparkNeedsImageReferer(url) {
    var normalized = normalizeUrl(url) || "";
    return /^https:\/\/simg\.donga\.com\//i.test(normalized);
}

function mlbparkNormalizeCount(value) {
    var digits = parseCount(value);
    if (!digits) return "";
    return digits.replace(/^0+(?=\d)/, "");
}

function mlbparkEscapeRegex(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mlbparkExtractPostMetric(doc, label) {
    if (!doc || !label) return "";

    var metricRoot = firstNode(doc, [".view_head .text2", ".text2"]);
    if (!metricRoot) return "";

    var metricText = normalizeWhitespace(textOf(metricRoot));
    if (metricText) {
        var matchedText = metricText.match(new RegExp(mlbparkEscapeRegex(label) + "\\s*(\\d+)"));
        if (matchedText && matchedText[1]) {
            return mlbparkNormalizeCount(matchedText[1]);
        }
    }

    var labels = mlbparkDescendantsBySelectors(metricRoot, [".tit", ".mark"]);
    for (var i = 0; i < labels.length; i++) {
        var titleNode = labels[i];
        if (normalizeWhitespace(textOf(titleNode)) !== label) continue;

        for (var current = titleNode.nextElementSibling; current; current = current.nextElementSibling) {
            if (mlbparkNodeMatchesAny(current, [".tit", ".mark"])) break;

            var valueNode = mlbparkNodeMatches(current, ".val") ? current : firstNode(current, [".val"]);
            var parsed = mlbparkNormalizeCount(textOf(valueNode || current));
            if (parsed) return parsed;
        }
    }

    return "";
}

function mlbparkExtractPostDate(doc) {
    if (!doc) return "";

    var raw = firstNonEmpty([
        firstText(doc, [".view_head .text3 .val", ".text_right .text3 .val", ".text3 .val"]),
        firstText(doc, SITE.selectors.postDate)
    ]);
    return formatMlbparkCommentDate(raw);
}

function mlbparkSanitizePostContent(contentRoot) {
    if (!contentRoot || typeof contentRoot.cloneNode !== "function") return contentRoot;

    var cloned = contentRoot.cloneNode(true);
    var removable = cloned.querySelectorAll(".tool_cont");
    for (var i = 0; i < removable.length; i++) {
        var node = removable[i];
        if (node && node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    return cloned;
}

function mlbparkStripTrailingPostTools(value) {
    var text = String(value || "");
    if (!text) return "";

    return text
        .replace(/\s*추천\s*\d+\s*공유\s*$/, "")
        .replace(/[ \t\r\n]+$/, "");
}

function mlbparkCleanPostDetails(details) {
    var out = [];
    for (var i = 0; i < (details || []).length; i++) {
        var item = details[i];
        if (!item) continue;

        if (item.type === "text") {
            var next = {};
            for (var key in item) {
                if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
                next[key] = item[key];
            }
            next.value = mlbparkStripTrailingPostTools(item.value);
            if (!normalizeWhitespace(next.value)) continue;
            out.push(next);
            continue;
        }

        out.push(item);
    }
    return out;
}

function mlbparkAttachImageHeaders(details, refererUrl) {
    var referer = normalizeUrl(refererUrl) || normalizeUrl(SITE.browserHomeUrl) || "";
    if (!referer || !details || !details.length) return details || [];

    var out = [];
    for (var i = 0; i < details.length; i++) {
        var item = details[i];
        if (!item || item.type !== "image" || !mlbparkNeedsImageReferer(item.value)) {
            out.push(item);
            continue;
        }
        var next = {};
        for (var key in item) {
            if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
            next[key] = item[key];
        }
        var headers = {};
        var sourceHeaders = item.headers;
        if (sourceHeaders && typeof sourceHeaders === "object") {
            for (var headerName in sourceHeaders) {
                if (!Object.prototype.hasOwnProperty.call(sourceHeaders, headerName)) continue;
                headers[headerName] = sourceHeaders[headerName];
            }
        }
        if (!headers["Referer"] && !headers["referer"]) {
            headers["Referer"] = referer;
        }
        next.headers = headers;
        out.push(next);
    }
    return out;
}

function formatMlbparkCommentDate(value) {
    if (!value) return "";

    var raw = String(value)
        .replace(/\s+/g, " ")
        .trim();
    if (!raw) return "";

    var normalized = raw
        .replace("T", " ")
        .replace(/\.\d+/, "")
        .replace(/([+-]\d{2}:?\d{2}|Z)$/, "")
        .trim();
    var fullMatches = normalized.match(/\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}(?::\d{2})?)?/g);
    var candidate = fullMatches && fullMatches.length > 0 ? fullMatches[fullMatches.length - 1] : normalized;
    var matched = candidate.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}:\d{2})(?::\d{2})?)?$/);
    if (!matched) return raw;

    var currentYear = String((new Date()).getFullYear());
    if (matched[1] !== currentYear) return candidate;

    var shortDate = matched[2] + "-" + matched[3];
    return matched[4] ? (shortDate + " " + matched[4]) : shortDate;
}

function formatMlbparkListDate(value) {
    if (!value) return "";

    var raw = String(value)
        .replace(/\s+/g, " ")
        .trim();
    if (!raw) return "";

    if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(raw)) return raw;

    var normalized = raw
        .replace("T", " ")
        .replace(/\.\d+/, "")
        .replace(/([+-]\d{2}:?\d{2}|Z)$/, "")
        .trim();
    var fullMatches = normalized.match(/\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}(?::\d{2})?)?/g);
    var candidate = fullMatches && fullMatches.length > 0 ? fullMatches[fullMatches.length - 1] : normalized;
    var matched = candidate.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}:\d{2}(?::\d{2})?))?$/);
    if (!matched) return raw;

    var currentYear = String((new Date()).getFullYear());
    if (matched[1] !== currentYear) return candidate;

    var shortDate = matched[2] + "-" + matched[3];
    return matched[4] ? (shortDate + " " + matched[4]) : shortDate;
}

function mlbparkParseComments(doc, postUrl) {
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

        var likeCount = hideZeroCount(parseCount(firstText(row, SITE.selectors.commentLikeCount)));
        comments.push({
            link: postUrl + "#comment-" + (i + 1),
            author: firstAuthorText(row, SITE.selectors.commentAuthor),
            avatar: imageUrlFromNode(firstNode(row, SITE.selectors.commentAvatar || SITE.selectors.commentAuthor), postUrl),
            content: content,
            date: formatMlbparkCommentDate(firstText(row, SITE.selectors.commentDate)),
            likeCount: likeCount,
            dislikeCount: "",
            level: detectCommentLevel(row),
            menus: [],
            hotCount: toInt(likeCount, 0),
            coldCount: 0
        });
    }
    return comments;
}

SITE.parseComments = function (doc, postUrl) {
    return mlbparkParseComments(doc, postUrl);
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
    domain: "mlbpark.donga.com",
    name: "mlbpark",
    description: "Unofficial MLBPark extension",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/windows",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://mlbpark.donga.com/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = ["b\\.php\\?[^#]*\\bm=view\\b"];
var LIST_LINK_SELECTORS = ["td.t_left a.txt",".title a.txt",".title .txt_in .link_txt","a[href*='m=view']"];
var LIST_TITLE_SELECTORS = ["td.t_left a.txt",".title",".txt",".txt_in"];
var LIST_AUTHOR_SELECTORS = ["td .nick",".info .nick"];
var LIST_AVATAR_SELECTORS = ["td .photo img",".info .photo img",".photo img"];
var LIST_DATE_SELECTORS = ["td .date",".info .date"];
var LIST_COMMENT_COUNT_SELECTORS = [".replycnt",".reply",".comment"];
var LIST_VIEW_COUNT_SELECTORS = [".viewV",".view"];
var LIST_LIKE_COUNT_SELECTORS = [".recommend",".recom"];
var LIST_CATEGORY_SELECTORS = [".list_word",".cate",".category"];
var LIST_IMAGE_SELECTORS = [".icon_img img",".thumb img","img[src*='simg.donga.com']"];
var MLBPARK_BOARD_PAGE_SIZE = 30;

var MLBPARK_LIST_CATEGORIES = [
    "정치", "야구", "축구", "해축", "배구", "농구", "NBA", "헬스", "러닝", "격투기",
    "테니스", "골프", "당구", "NFL", "e스포츠", "F1", "기타스포츠", "올림픽", "아시안게임", "개선요청",
    "게임", "결혼/연애", "경제", "고민상담", "과학", "군사", "낚시", "도서", "동물", "라면대학",
    "만화", "문화", "방송", "부동산", "뻘글", "사회", "썰", "아이돌", "여행", "역사",
    "연예", "영화", "유머", "음식", "음악", "이벤트", "일상", "자동차", "주번나", "주식",
    "질문", "짤방", "코인", "패션", "펌글", "포인트", "프로토", "핫딜", "후기", "IT",
    "LOL", "VS", "17금", "19금"
];

function mlbparkExtractListCategory(row, title) {
    var category = normalizeWhitespace(firstText(row, LIST_CATEGORY_SELECTORS));
    if (category) return category;

    var normalizedTitle = normalizeWhitespace(title);
    if (!normalizedTitle) return "";
    for (var i = 0; i < MLBPARK_LIST_CATEGORIES.length; i++) {
        var known = MLBPARK_LIST_CATEGORIES[i];
        if (normalizedTitle.indexOf("[" + known + "] ") === 0) return known;
        if (normalizedTitle.indexOf(known + " ") === 0) return known;
    }
    return "";
}

function mlbparkStripCategoryFromTitle(title, category) {
    var normalizedTitle = normalizeWhitespace(title);
    var normalizedCategory = normalizeWhitespace(category);
    if (!normalizedTitle || !normalizedCategory) return normalizedTitle;
    if (normalizedTitle.indexOf("[" + normalizedCategory + "] ") === 0) {
        return normalizeWhitespace(normalizedTitle.substring(normalizedCategory.length + 3));
    }
    if (normalizedTitle.indexOf(normalizedCategory + " ") === 0) {
        return normalizeWhitespace(normalizedTitle.substring(normalizedCategory.length + 1));
    }
    return normalizedTitle;
}

function mlbparkCanonicalizePostLink(link) {
    var normalized = normalizeUrl(link) || link;
    var info = parseAbsoluteUrl(normalized);
    if (!info || info.path !== "/mp/b.php") return normalized;

    var boardId = normalizeWhitespace(queryValue(info.query, "b"));
    var postId = normalizeWhitespace(queryValue(info.query, "id"));
    var mode = normalizeWhitespace(queryValue(info.query, "m"));
    if (!boardId || !postId || (mode && mode !== "view")) return normalized;

    return "https://" + SYNURA.domain
        + "/mp/b.php?b=" + encodeURIComponent(boardId)
        + "&id=" + encodeURIComponent(postId)
        + "&m=view";
}

function extractListItem(row, baseUrl) {
    var linkSelectors = selectorList("listLink", LIST_LINK_SELECTORS);
    var titleSelectors = selectorList("listTitle", LIST_TITLE_SELECTORS);
    var commentCountSelectors = selectorList("listCommentCount", LIST_COMMENT_COUNT_SELECTORS);
    var viewCountSelectors = selectorList("listViewCount", LIST_VIEW_COUNT_SELECTORS);
    var likeCountSelectors = selectorList("listLikeCount", LIST_LIKE_COUNT_SELECTORS);
    var authorSelectors = selectorList("listAuthor", LIST_AUTHOR_SELECTORS);
    var avatarSelectors = selectorList("listAvatar", LIST_AVATAR_SELECTORS);
    var imageSelectors = selectorList("listImage", LIST_IMAGE_SELECTORS);
    var dateSelectors = selectorList("listDate", LIST_DATE_SELECTORS);
    var linkNode = firstNode(row, linkSelectors);
    var titleNode = firstNode(row, titleSelectors);
    var link = extractListLink(row, baseUrl, linkSelectors, LIST_LINK_ALLOW_PATTERNS);
    if (!link) return null;

    var rawTitle = firstNonEmpty([
        textOfNodeWithoutSelectors(titleNode, commentCountSelectors),
        textOf(linkNode),
        textOf(row)
    ]);
    if (!rawTitle) return null;

    var commentCount = hideZeroCount(parseCount(firstText(row, commentCountSelectors)));
    var viewCount = parseCount(firstText(row, viewCountSelectors));
    var likeCount = hideZeroCount(parseCount(firstText(row, likeCountSelectors)));
    var author = firstAuthorText(row, authorSelectors);
    var category = mlbparkExtractListCategory(row, rawTitle);
    var title = mlbparkStripCategoryFromTitle(rawTitle, category);
    var avatarSourceSelectors = avatarSelectors.length > 0 ? avatarSelectors : authorSelectors;
    var avatar = imageUrlFromNode(firstNode(row, avatarSourceSelectors), baseUrl);
    var mediaUrl = imageUrlFromNode(firstNode(row, imageSelectors), baseUrl);
    var types = [];
    if (mediaUrl) types.push("image");

    return {
        link: mlbparkCanonicalizePostLink(link),
        title: title,
        author: author,
        avatar: avatar,
        date: formatMlbparkListDate(firstText(row, dateSelectors)),
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
