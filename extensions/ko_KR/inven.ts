// @ts-nocheck

var SITE = {
  "siteKey": "inven",
  "displayName": "인벤",
  "browserHomeUrl": "https://www.inven.co.kr/board/webzine/2097?iskin=webzine",
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
  "defaultGalleryModeBoardIds": [
    "come_2898",
    "come_2887"
  ],
  "hostAliases": [],
  "challengeMarkers": [],
  "titleSuffixes": [
    " - 인벤",
    " : 인벤"
  ],
  "linkAllowPatterns": [
    "^https://www\\.inven\\.co\\.kr/board/[^/]+/\\d+/\\d+"
  ],
  "listBoardQueryParam": "",
  "boards": [
    {
      "id": "come_2097",
      "title": "오픈이슈갤러리",
      "url": "/board/webzine/2097",
      "description": "대표 이슈 게시판"
    },
    {
      "id": "come_2631",
      "title": "PC 견적 게시판",
      "url": "/board/webzine/2631"
    },
    {
      "id": "come_2898",
      "title": "코스프레 갤러리",
      "url": "/board/webzine/2898"
    },
    {
      "id": "come_3499",
      "title": "(19)무인도는 첨이지?",
      "url": "/board/webzine/3499"
    },
    {
      "id": "come_3715",
      "title": "지름/개봉 갤러리",
      "url": "/board/webzine/3715"
    },
    {
      "id": "come_1565",
      "title": "게이머 토론장",
      "url": "/board/webzine/1565"
    },
    {
      "id": "come_1288",
      "title": "게임 추천/소감",
      "url": "/board/webzine/1288"
    },
    {
      "id": "come_3558",
      "title": "무엇이든 물어보세요",
      "url": "/board/webzine/3558"
    },
    {
      "id": "come_762",
      "title": "최근 논란중인 이야기",
      "url": "/board/webzine/762"
    },
    {
      "id": "come_2887",
      "title": "카툰 갤러리",
      "url": "/board/webzine/2887"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".boardTitle",
      ".title",
      "title"
    ],
    "listRows": [
      ".board-list table tbody tr",
      "section.mo-board-list li.list"
    ],
    "listLink": [
      "a.subject-link",
      "a.contentLink"
    ],
    "listTitle": [
      ".subject-link",
      ".subject",
      ".tit"
    ],
    "listAuthor": [
      ".layerNickName",
      ".nick"
    ],
    "listAvatar": [
      ".user-icon img",
      ".nick .icon img",
      ".nick img"
    ],
    "listDate": [
      ".time",
      ".date"
    ],
    "listCommentCount": [
      ".con-comment",
      ".com-btn .num",
      ".num",
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
      ".category",
      ".in-cate",
      ".cate"
    ],
    "listImage": [
      "img"
    ],
    "postTitle": [
      ".articleTitle h1",
      "#articleSubject",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".articleWriter",
      ".articleWriter span",
      "#article-writer",
      ".article-writer",
      ".writer",
      ".nick"
    ],
    "postDate": [
      ".articleDate",
      ".date",
      "time"
    ],
    "postViewCount": [
      ".articleHit",
      ".hit"
    ],
    "postLikeCount": [
      "#bbsRecommendNum1",
      ".reco"
    ],
    "postCategory": [
      ".articleCategory",
      ".boardName",
      ".cate"
    ],
    "postContent": [
      "#powerbbsContent",
      ".contentBody #powerbbsContent",
      ".articleContent",
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
function invenBoardUrlFromComeIdx(comeIdx) {
    var normalized = normalizeWhitespace(String(comeIdx || "")).replace(/^come_/, "");
    if (!normalized) return "";
    return "https://" + SYNURA.domain + "/board/webzine/" + encodeURIComponent(normalized) + "?iskin=webzine";
}
function invenComeIdxFromUrlInfo(urlInfo) {
    if (!urlInfo) return "";
    if (urlInfo.path === "/board/powerbbs.php") {
        return normalizeWhitespace(queryValue(urlInfo.query, "come_idx"));
    }
    var parts = pathSegments(urlInfo.path);
    if (parts.length >= 3 && parts[0] === "board" && parts[1] === "webzine" && /^\d+$/.test(parts[2])) {
        return parts[2];
    }
    return "";
}
function invenBoardPageParamName(url) {
    return "p";
}
SITE.selectorProfiles = SITE.selectorProfiles || {};
SITE.selectorProfiles.inven_gallery_board = {
    listRows: [
        ".board-gallery ul.nested2 > li",
        ".board-gallery > ul > li",
        ".board-gallery li"
    ],
    listLink: [
        "a.subject-link",
        "a.thumb"
    ],
    listTitle: [
        "a.subject-link",
        ".subject-link",
        ".tit"
    ],
    listAuthor: [
        ".user .layerNickName",
        ".layerNickName",
        ".user"
    ],
    listAvatar: [],
    listDate: [
        ".date",
        ".time"
    ],
    listCommentCount: [
        ".con-comment"
    ],
    listViewCount: [
        ".cnt .view",
        ".view"
    ],
    listLikeCount: [
        ".cnt .like",
        ".like"
    ],
    listCategory: [
        ".cate"
    ],
    listImage: [
        ".thumb img",
        ".thumb"
    ]
};
SITE.selectorProfilesByBoard = SITE.selectorProfilesByBoard || {};
SITE.selectorProfilesByBoard.come_2898 = {
    board: ["inven_gallery_board"]
};
SITE.selectorProfilesByBoard.come_2887 = {
    board: ["inven_gallery_board"]
};
SITE.matchBoard = function (urlInfo) {
    var comeIdx = invenComeIdxFromUrlInfo(urlInfo);
    if (comeIdx) {
        return {
            board: ensureBoard("come_" + comeIdx, invenBoardUrlFromComeIdx(comeIdx), "게시판 " + comeIdx),
            page: queryInt(urlInfo.query, "page", queryInt(urlInfo.query, "p", 1))
        };
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length >= 4 && parts[0] === "board" && /^\d+$/.test(parts[2]) && /^\d+$/.test(parts[3])) {
        return {
            board: ensureBoard("come_" + parts[2], invenBoardUrlFromComeIdx(parts[2]), "게시판 " + parts[2]),
            postId: parts[3]
        };
    }
    return null;
};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    var baseUrl = currentUrl || (match && match.board ? match.board.url : "");
    return setPageParam(baseUrl, invenBoardPageParamName(baseUrl), nextPage);
};
SITE.buildPostFetchUrls = function (match, currentUrl) {
    return [currentUrl];
};
SITE.buildBoardUrlFromId = function (boardId) {
    var match = normalizeWhitespace(String(boardId || "")).match(/^come_(\d+)$/);
    if (match) return invenBoardUrlFromComeIdx(match[1]);
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
        var links = allNodes(doc, [
            "a[href*='powerbbs.php?come_idx=']",
            "a[href*='/board/webzine/']"
        ]);
        var items = [];
        var seen = {};
        for (var i = 0; i < links.length; i++) {
            var href = ensureAbsoluteUrl(attrOf(links[i], "href"), SITE.browserHomeUrl);
            var info = parseAbsoluteUrl(href);
            if (!info) continue;
            var comeIdx = invenComeIdxFromUrlInfo(info);
            if (!comeIdx || seen[comeIdx]) continue;
            var title = normalizeWhitespace(textOf(links[i]));
            if (!title || skip[title]) continue;
            seen[comeIdx] = true;
            items.push({
                id: "come_" + comeIdx,
                title: title,
                url: invenBoardUrlFromComeIdx(comeIdx),
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
SITE.filterPostContent = function (content, url, doc) {
    var contentNode = doc ? doc.querySelector("#powerbbsContent") : null;
    if (!contentNode) return content;
    var reparsed = parseMarkupDetails(String(contentNode.innerHTML || ""), url);
    return reparsed && reparsed.length > 0 ? reparsed : content;
};
function invenParseComments(doc, postUrl) {
    var rows = allNodes(doc, SITE.selectors.commentRows);
    var comments = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var rowId = normalizeWhitespace(firstNonEmpty([
            attrOf(row, "data-comment-sn"),
            attrOf(row, "data-cmtidx"),
            attrOf(row, "id")
        ]));
        var commentIdMatch = rowId.match(/(\d+)/);
        var commentId = commentIdMatch && commentIdMatch[1] ? commentIdMatch[1] : "";
        var rowClass = attrOf(row, "class");
        var isBlind = /\bblindCmt\b/i.test(rowClass);
        var isDeleted = /\bdeleteCmt\b/i.test(rowClass);
        var contentRoot = firstNode(row, SITE.selectors.commentContent);
        var content = isBlind ? [{ type: "text", value: "블라인드된 댓글입니다." }] : parseDetails(contentRoot, postUrl);
        if (!content || content.length === 0) {
            var rawText = firstText(row, SITE.selectors.commentContent);
            if (rawText) content = [{ type: "text", value: rawText }];
        }
        if (isDeleted && content && content.length > 0) {
            if (content[0] && content[0].type === "text") {
                content = content.slice();
                content[0] = {
                    type: "text",
                    value: "[삭제됨] " + normalizeWhitespace(content[0].value || "")
                };
            } else {
                content = [{ type: "text", value: "[삭제됨]" }].concat(content);
            }
        }
        if (!content || content.length === 0) continue;

        var likeCount = hideZeroCount(parseCount(firstText(row, SITE.selectors.commentLikeCount)));
        comments.push({
            link: postUrl + "#comment-" + (commentId || String(i + 1)),
            author: firstAuthorText(row, SITE.selectors.commentAuthor),
            avatar: imageUrlFromNode(firstNode(row, SITE.selectors.commentAvatar || SITE.selectors.commentAuthor), postUrl),
            content: content,
            date: firstText(row, SITE.selectors.commentDate),
            likeCount: likeCount,
            dislikeCount: "",
            level: detectCommentLevel(row),
            menus: [],
            hotCount: toInt(likeCount, 0),
            coldCount: toInt(likeCount, 0),
            _invenDedupKey: commentId ? "comment:" + commentId : ""
        });
    }
    return comments;
}
SITE.parseComments = function (doc, postUrl) {
    return invenParseComments(doc, postUrl);
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

    function invenExtractCommentId(rawValue) {
        var raw = normalizeWhitespace(rawValue);
        if (!raw) return "";
        var matched = raw.match(/(\d+)/);
        return matched && matched[1] ? matched[1] : raw;
    }

    function invenBuildCommentLink(commentId) {
        var normalized = invenExtractCommentId(commentId);
        return url + "#comment-" + (normalized || "0");
    }

    function invenBuildCommentPlaceholder(text) {
        return [{ type: "text", value: normalizeWhitespace(text) }];
    }

    function invenPrefixCommentContent(content, prefix) {
        var normalizedPrefix = normalizeWhitespace(prefix);
        var out = Array.isArray(content) ? content.slice() : [];
        if (!normalizedPrefix) return out;
        if (out.length > 0 && out[0] && out[0].type === "text") {
            out[0] = {
                type: "text",
                value: normalizedPrefix + " " + normalizeWhitespace(out[0].value || "")
            };
            return out;
        }
        out.unshift({ type: "text", value: normalizedPrefix });
        return out;
    }

    function invenResolveCommentAvatar(rawValue) {
        var raw = normalizeWhitespace(rawValue);
        if (!raw || raw === "0") return "";
        return normalizeUrl(raw) || ensureAbsoluteUrl(raw, url) || raw;
    }

    function invenPadSortNumber(value) {
        var text = String(parseInt(String(value || "0"), 10) || 0);
        while (text.length < 12) text = "0" + text;
        return text;
    }

    function invenGroupSortValue(titleNum) {
        return titleNum === 0 ? 1000000000 : Math.max(1, titleNum);
    }

    function invenBuildCommentRequestOptions(titles) {
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
            "titles=" + encodeURIComponent(normalizeWhitespace(titles || "")),
            "listoption=" + encodeURIComponent("date"),
            "commentPos=" + encodeURIComponent(commentPos),
            "iskin=" + encodeURIComponent(iskin),
            "date=" + encodeURIComponent(String(Date.now()))
        ].join("&");
        return options;
    }

    function invenFetchCommentPayload(titles) {
        var response = fetchWithLogging("https://www.inven.co.kr/common/board/comment.json.php", invenBuildCommentRequestOptions(titles));
        if (!response || !response.ok) return null;
        var rawText = response.text();
        if (!rawText) return null;
        var parsedData = null;
        try {
            parsedData = JSON.parse(rawText);
        } catch (e) {
        }
        return {
            rawText: rawText,
            data: parsedData
        };
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
                var decodeDoc = decodeParser.parseFromString("<textarea id='synura-inven-comment-decode'>" + source + "</textarea>", "text/html");
                var decodeRoot = decodeDoc.querySelector("#synura-inven-comment-decode");
                var decoded = decodeRoot ? String(decodeRoot.value || decodeRoot.textContent || "") : "";
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

    function invenGroupTitleNum(group) {
        var raw = firstNonEmpty([
            group && group.__attr__ ? group.__attr__.titlenum : "",
            group ? group.titlenum : ""
        ]);
        var parsed = parseInt(String(raw || ""), 10);
        return isNaN(parsed) ? 0 : parsed;
    }

    function invenCollectPendingTitles(data, seen) {
        var groups = data && Array.isArray(data.commentlist) ? data.commentlist : [];
        var out = [];
        for (var i = 0; i < groups.length; i++) {
            var titleNum = invenGroupTitleNum(groups[i]);
            if (!(titleNum > 0) || seen[String(titleNum)]) continue;
            var rows = groups[i] && Array.isArray(groups[i].list) ? groups[i].list : [];
            if (rows.length > 0) continue;
            out.push(String(titleNum));
        }
        out.sort(function (left, right) {
            return parseInt(left, 10) - parseInt(right, 10);
        });
        return out;
    }

    function invenOrderedCommentGroups(data) {
        var groups = data && Array.isArray(data.commentlist) ? data.commentlist.slice() : [];
        groups.sort(function (left, right) {
            var leftNum = invenGroupTitleNum(left);
            var rightNum = invenGroupTitleNum(right);
            if (leftNum === 0 && rightNum === 0) return 0;
            if (leftNum === 0) return 1;
            if (rightNum === 0) return -1;
            return leftNum - rightNum;
        });
        return groups;
    }

    function invenParseJsonCommentRow(row, sortKey) {
        var item = row || {};
        var attr = item.__attr__ || {};
        var commentId = invenExtractCommentId(firstNonEmpty([attr.cmtidx, item.cmtidx]));
        if (!commentId) return null;

        var parentId = invenExtractCommentId(firstNonEmpty([attr.cmtpidx, item.cmtpidx]));
        var state = normalizeWhitespace(firstNonEmpty([attr.state, item.state])).toUpperCase();
        var content = state === "B"
            ? invenBuildCommentPlaceholder("블라인드된 댓글입니다.")
            : invenParseCommentContent(firstNonEmpty([item.o_comment, item.comment]));
        if ((!content || content.length === 0) && state === "N") {
            content = invenBuildCommentPlaceholder("삭제된 댓글입니다.");
        }
        if (!content || content.length === 0) return null;
        if (state === "N") {
            content = invenPrefixCommentContent(content, "[삭제됨]");
        }

        var likeCount = hideZeroCount(parseCount(firstNonEmpty([item.o_recommend, item.recommend, item.like])));
        var dislikeCount = hideZeroCount(parseCount(firstNonEmpty([item.o_notrecommend, item.notrecommend, item.dislike])));

        return {
            link: invenBuildCommentLink(commentId),
            author: normalizeWhitespace(firstNonEmpty([item.o_name, item.name, item.nick])),
            avatar: invenResolveCommentAvatar(firstNonEmpty([item.o_icon, item.icon])),
            content: content,
            date: normalizeWhitespace(firstNonEmpty([item.o_date, item.date])),
            likeCount: likeCount,
            dislikeCount: dislikeCount,
            level: parentId && parentId !== commentId ? 1 : 0,
            menus: [],
            hotCount: toInt(likeCount, 0),
            coldCount: toInt(dislikeCount, 0),
            _invenDedupKey: "comment:" + commentId,
            _invenSortKey: normalizeWhitespace(sortKey)
        };
    }

    function invenParseJsonComments(data) {
        var out = [];
        var bestRows = data && data.bestcomment && Array.isArray(data.bestcomment.list) ? data.bestcomment.list : [];
        for (var i = 0; i < bestRows.length; i++) {
            var bestItem = invenParseJsonCommentRow(bestRows[i], "0:" + invenPadSortNumber(i));
            if (bestItem) out.push(bestItem);
        }

        var groups = invenOrderedCommentGroups(data);
        for (var j = 0; j < groups.length; j++) {
            var rows = groups[j] && Array.isArray(groups[j].list) ? groups[j].list : [];
            var groupTitleNum = invenGroupTitleNum(groups[j]);
            var groupSortKey = "1:" + invenPadSortNumber(invenGroupSortValue(groupTitleNum)) + ":";
            for (var k = 0; k < rows.length; k++) {
                var commentItem = invenParseJsonCommentRow(rows[k], groupSortKey + invenPadSortNumber(k));
                if (commentItem) out.push(commentItem);
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
            var rowId = invenExtractCommentId(firstNonEmpty([
                attrOf(row, "data-comment-sn"),
                attrOf(row, "data-cmtidx"),
                attrOf(row, "id")
            ]));
            var rowClass = attrOf(row, "class");
            var state = /\bblindCmt\b/i.test(rowClass) ? "B" : (/\bdeleteCmt\b/i.test(rowClass) ? "N" : "");
            var contentRoot = row.querySelector("div.comment > span.content") ||
                row.querySelector("div.comment .content") ||
                row.querySelector("div.comment") ||
                row.querySelector(".content");
            var content = state === "B" ? invenBuildCommentPlaceholder("블라인드된 댓글입니다.") : parseDetails(contentRoot, url);
            if ((!content || content.length === 0) && contentRoot) {
                var text = normalizeWhitespace(contentRoot.textContent || "");
                if (text) content = [{ type: "text", value: text }];
            }
            if (state === "N" && content && content.length > 0) {
                content = invenPrefixCommentContent(content, "[삭제됨]");
            }
            if (!content || content.length === 0) continue;
            var authorNode = firstNode(row, SITE.selectors.commentAuthor);
            var dateNode = firstNode(row, SITE.selectors.commentDate);
            var likeNode = firstNode(row, SITE.selectors.commentLikeCount);
            out.push({
                link: invenBuildCommentLink(rowId || String(i + 1)),
                author: normalizeWhitespace(authorNode ? authorNode.textContent : ""),
                avatar: imageUrlFromNode(firstNode(row, SITE.selectors.commentAvatar || SITE.selectors.commentAuthor), url),
                content: content,
                date: normalizeWhitespace(dateNode ? dateNode.textContent : ""),
                likeCount: hideZeroCount(parseCount(normalizeWhitespace(likeNode ? likeNode.textContent : ""))),
                dislikeCount: "",
                level: row.classList && row.classList.contains("reply") ? 1 : 0,
                menus: [],
                hotCount: 0,
                coldCount: 0,
                _invenDedupKey: rowId ? "comment:" + rowId : ""
            });
        }
        return out;
    }

    function invenCommentDedupKey(item) {
        if (item && item._invenDedupKey) return normalizeWhitespace(item._invenDedupKey);
        var link = normalizeWhitespace(item && item.link ? item.link : "");
        if (/#comment-\d+$/i.test(link)) return link;
        return [
            normalizeWhitespace(item && item.author ? item.author : ""),
            normalizeWhitespace(item && item.date ? item.date : ""),
            normalizeWhitespace(item && item.content && item.content[0] ? item.content[0].value : "")
        ].join("|");
    }

    function invenSortComments(items) {
        return (items || []).slice().sort(function (left, right) {
            var leftKey = normalizeWhitespace(left && left._invenSortKey ? left._invenSortKey : "");
            var rightKey = normalizeWhitespace(right && right._invenSortKey ? right._invenSortKey : "");
            if (leftKey && rightKey && leftKey !== rightKey) return leftKey < rightKey ? -1 : 1;
            if (leftKey && !rightKey) return -1;
            if (!leftKey && rightKey) return 1;
            return 0;
        });
    }

    function invenDedupComments(items) {
        var out = [];
        var seen = {};
        for (var i = 0; i < (items || []).length; i++) {
            var item = items[i];
            if (!item) continue;
            var key = invenCommentDedupKey(item);
            if (!key || seen[key]) continue;
            seen[key] = true;
            if (!item.link) item.link = url + "#comment-" + (out.length + 1);
            if (item._invenDedupKey) delete item._invenDedupKey;
            if (item._invenSortKey) delete item._invenSortKey;
            out.push(item);
        }
        return out;
    }

    function invenFetchAllCommentPayloads() {
        var payloads = [];
        var fetchedTitles = {};
        var initialPayload = invenFetchCommentPayload("");
        if (!initialPayload) return payloads;

        payloads.push(initialPayload);
        if (!initialPayload.data) return payloads;

        for (var round = 0; round < 8; round++) {
            var pendingTitles = invenCollectPendingTitles(payloads[payloads.length - 1].data, fetchedTitles);
            if (pendingTitles.length === 0) break;
            for (var i = 0; i < pendingTitles.length; i++) {
                fetchedTitles[pendingTitles[i]] = true;
            }
            var nextPayload = invenFetchCommentPayload(pendingTitles.join("|"));
            if (!nextPayload) break;
            payloads.push(nextPayload);
            if (!nextPayload.data) break;
        }
        return payloads;
    }

    var comeIdx = invenExtractSettingValue("comeidx") || (match && match.board ? String(match.board.id || "").replace(/^come_/, "") : "");
    var articleCode = invenExtractSettingValue("articlecode") || (match ? String(match.postId || "") : "");
    var customNum = invenExtractSettingValue("customNum");
    var commentPos = invenExtractSettingValue("commentPos") || "m";
    var iskin = invenExtractSettingValue("iskin") || "webzine";
    if (!comeIdx || !articleCode || !customNum) return comments;

    var payloads = invenFetchAllCommentPayloads();
    if (!payloads || payloads.length === 0) return comments;

    var parsedComments = [];
    var htmlCandidates = [];
    for (var payloadIndex = 0; payloadIndex < payloads.length; payloadIndex++) {
        var payload = payloads[payloadIndex];
        if (!payload) continue;
        if (payload.data) {
            parsedComments = parsedComments.concat(invenParseJsonComments(payload.data));
            invenCollectHtmlCandidates(payload.data, htmlCandidates, 0);
        } else if (payload.rawText) {
            htmlCandidates.push(payload.rawText);
        }
    }

    parsedComments = invenDedupComments(invenSortComments(parsedComments));
    if (parsedComments.length > 0) return parsedComments;

    if (htmlCandidates.length === 0 && payloads[0] && payloads[0].rawText) htmlCandidates.push(payloads[0].rawText);

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
    domain: "www.inven.co.kr",
    name: "inven",
    description: "Unofficial Inven extension",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/windows",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://www.inven.co.kr/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = ["^https://www\\.inven\\.co\\.kr/board/[^/]+/\\d+/\\d+"];
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

function invenExpandedGalleryTitle(row, title, imageSelectors) {
    var visibleTitle = normalizeWhitespace(title || "");
    var imageTitle = normalizeWhitespace(imageLabelOf(firstNode(row, imageSelectors)) || "");
    if (!imageTitle) return visibleTitle;
    if (!visibleTitle) return imageTitle;
    if (visibleTitle === imageTitle) return visibleTitle;

    var titlePrefix = normalizeWhitespace(visibleTitle.replace(/(?:\.\.+|…)+$/, ""));
    if (/(?:\.\.+|…)+$/.test(visibleTitle)) return imageTitle;
    if (titlePrefix && imageTitle.indexOf(titlePrefix) === 0 && imageTitle.length > visibleTitle.length) return imageTitle;
    return visibleTitle;
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
    title = invenExpandedGalleryTitle(row, title, imageSelectors);

    var commentCount = hideZeroCount(parseCount(firstText(row, commentCountSelectors)));
    var viewCount = parseCount(firstText(row, viewCountSelectors));
    var likeCount = hideZeroCount(parseCount(firstText(row, likeCountSelectors)));
    var author = firstAuthorText(row, authorSelectors);
    var category = firstText(row, categorySelectors);
    if (category && title.indexOf(category) === 0) {
        title = normalizeWhitespace(title.slice(category.length));
    }
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
        hotCount: toInt(likeCount || viewCount || commentCount, 0),
        coldCount: toInt(viewCount || likeCount || commentCount, 0)
    };
}
