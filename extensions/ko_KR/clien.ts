// @ts-nocheck

// To refresh the preloaded Clien board catalog:
// 1. Run `go run ./cmd/synurart -json -ext extensions/ko_KR/clien.js -e "eval JSON.stringify(SITE.loadDynamicBoards({allowNetwork:true,force:true}))"`.
// 2. Convert the returned objects to `[id, title]` rows and replace `CLIEN_PRELOADED_DYNAMIC_BOARD_ROWS`.

var CLIEN_PRELOADED_DYNAMIC_BOARD_ROWS = [
  ["cm_car", "굴러간당"],
  ["cm_iphonien", "아이포니앙"],
  ["cm_stock", "주식한당"],
  ["cm_mac", "MaClien"],
  ["cm_japanlive", "일본산당"],
  ["cm_bts", "방탄소년당"],
  ["cm_app", "개발한당"],
  ["cm_bike", "자전거당"],
  ["cm_andro", "안드로메당"],
  ["cm_ai", "AI당"],
  ["cm_rowing", "노젓는당"],
  ["cm_nas", "나스당"],
  ["cm_girl", "소시당"],
  ["cm_fish", "물고기당"],
  ["cm_golf", "골프당"],
  ["cm_mbike", "이륜차당"],
  ["cm_dia", "디아블로당"],
  ["cm_ebook", "e북본당"],
  ["cm_keyboard", "키보드당"],
  ["cm_baby", "육아당"],
  ["cm_movie", "영화본당"],
  ["cm_coffee", "클다방"],
  ["cm_girlgroup", "걸그룹당"],
  ["cm_venture", "창업한당"],
  ["cm_oversea", "바다건너당"],
  ["cm_test", "테스트당"],
  ["cm_console", "콘솔한당"],
  ["cm_pctuning", "PC튜닝한당"],
  ["cm_photo", "찰칵찍당"],
  ["cm_thinkpad", "빨콩이당"],
  ["cm_applewatch", "사과시계당"],
  ["cm_camp", "캠핑간당"],
  ["cm_fisher", "도시어부당"],
  ["cm_gym", "땀흘린당"],
  ["cm_pic", "그림그린당"],
  ["cm_rasp", "라즈베리파이당"],
  ["cm_cat", "냐옹이당"],
  ["cm_lego", "레고당"],
  ["cm_3dmaking", "3D메이킹"],
  ["cm_70", "X세대당"],
  ["cm_adhd", "ADHD당"],
  ["cm_aigurim", "AI그림당"],
  ["cm_airplane", "날아간당"],
  ["cm_badmin", "배드민턴당"],
  ["cm_baseball", "야구당"],
  ["cm_basket", "농구당"],
  ["cm_bb", "블랙베리당"],
  ["cm_bear", "곰돌이당"],
  ["cm_beer", "비어있당"],
  ["cm_billiards", "FM당구당"],
  ["cm_blockchain", "블록체인당"],
  ["cm_board", "보드게임당"],
  ["cm_book", "활자중독당"],
  ["cm_bowling", "볼링친당"],
  ["cm_civilize", "문명하셨당"],
  ["cm_classic", "클래시앙"],
  ["cm_cook", "요리한당"],
  ["cm_cookierun", "쿠키런당"],
  ["cm_daegu", "대구당"],
  ["cm_danger", "DANGER당"],
  ["cm_dduk", "뚝딱뚝당"],
  ["cm_dog", "개판이당"],
  ["cm_dongsup", "동숲한당"],
  ["cm_drone", "날아올랑"],
  ["cm_ebicycle", "전기자전거당"],
  ["cm_edc", "갖고다닌당"],
  ["cm_eve", "이브한당"],
  ["cm_fashion", "패셔니앙"],
  ["cm_fm", "FM한당"],
  ["cm_food", "맛있겠당"],
  ["cm_formula1", "포뮬러당"],
  ["cm_gemwar", "젬워한당"],
  ["cm_glasses", "안경쓴당"],
  ["cm_gta", "차턴당"],
  ["cm_gun", "총쏜당"],
  ["cm_hearth", "하스스톤한당"],
  ["cm_heroes", "히어로즈한당"],
  ["cm_instar", "인스타한당"],
  ["cm_iot", "IoT당"],
  ["cm_kara", "KARA당"],
  ["cm_kordle", "꼬들한당"],
  ["cm_ku", "덕질한당"],
  ["cm_lang", "어학당"],
  ["cm_leather", "가죽당"],
  ["cm_linux", "리눅서당"],
  ["cm_lol", "LOLien"],
  ["cm_mabi", "Mabinogien"],
  ["cm_main", "임시소모임"],
  ["cm_midra", "미드당"],
  ["cm_military", "밀리터리당"],
  ["cm_mine", "땅판당"],
  ["cm_monhunt", "헌팅한당"],
  ["cm_mount", "오른당"],
  ["cm_mtg", "MTG한당"],
  ["cm_music", "소리당"],
  ["cm_nokien", "노키앙"],
  ["cm_note", "적는당"],
  ["cm_onair", "방송한당"],
  ["cm_picnic", "소풍간당"],
  ["cm_plant", "심는당"],
  ["cm_poe", "패스오브엑자일당"],
  ["cm_redeem", "품앱이당"],
  ["cm_rhythm", "리듬탄당"],
  ["cm_running", "달린당"],
  ["cm_sea", "Sea마당"],
  ["cm_sim", "SimSim하당"],
  ["cm_simsik", "심야식당"],
  ["cm_slate", "윈태블릿당"],
  ["cm_snow", "미끄러진당"],
  ["cm_soccer", "축구당"],
  ["cm_solo", "나혼자산당"],
  ["cm_star", "스타한당"],
  ["cm_steam", "스팀한당"],
  ["cm_surfing", "파도탄당"],
  ["cm_swim", "퐁당퐁당"],
  ["cm_tennis", "테니스친당"],
  ["cm_tiwatch", "공대시계당"],
  ["cm_tour", "여행을떠난당"],
  ["cm_tpad", "터치패드당"],
  ["cm_twit", "트윗당"],
  ["cm_vcoin", "가상화폐당"],
  ["cm_vr", "VR당"],
  ["cm_watch", "시계찬당"],
  ["cm_webos", "WebOs당"],
  ["cm_werule", "소셜게임한당"],
  ["cm_whiskey", "위스키당"],
  ["cm_wine", "와인마신당"],
  ["cm_wow", "WOW당"],
  ["cm_wp", "윈폰이당"]
];

function clienBuildPreloadedDynamicBoards() {
    var items = [];
    for (var i = 0; i < CLIEN_PRELOADED_DYNAMIC_BOARD_ROWS.length; i++) {
        var row = CLIEN_PRELOADED_DYNAMIC_BOARD_ROWS[i] || [];
        var id = row[0] ? String(row[0]).trim() : "";
        var title = row[1] ? String(row[1]).trim() : "";
        if (!id || !title) continue;
        items.push({
            id: id,
            title: title,
            description: title,
            dynamic: true
        });
    }
    return items;
}

var SITE = {
  "siteKey": "clien",
  "displayName": "클리앙",
  "browserHomeUrl": "https://m.clien.net/service/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 600000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "소모임",
  "boardSettingsTitle": "소모임/게시판 설정",
  "dynamicBoardGroupLabel": "소모임",
  "preferConfiguredDynamicBoardTitle": true,
  "flattenCategoryGroupPaths": ["소모임"],
  "flattenCategoryGroupPathsWithoutPrefix": ["소모임"],
  "boardSettingsLargeThreshold": 256,
  "boardSettingsPageSize": 96,
  "boardAddMode": "id_title",
  "hasFullBoardCatalog": false,
  "supportsBoardCatalogSync": true,
  "defaultVisibleBoardIds": [],
  "defaultShowMediaBoardIds": [
    "image"
  ],
  "defaultGalleryModeBoardIds": [
    "image"
  ],
  "hostAliases": [
    "clien.net",
    "www.clien.net"
  ],
  "challengeMarkers": [],
  "titleSuffixes": [
    " : 클리앙",
    " - 클리앙"
  ],
  "linkAllowPatterns": [
    "^https://m\\.clien\\.net/service/board/[^/]+/\\d+"
  ],
  "listBoardQueryParam": "",
  "boards": [
    {
      "id": "park",
      "title": "모두의공원"
    },
    {
      "id": "news",
      "title": "새로운소식"
    },
    {
      "id": "use",
      "title": "사용기"
    },
    {
      "id": "lecture",
      "title": "강좌/팁"
    },
    {
      "id": "useful",
      "title": "유용한사이트"
    },
    {
      "id": "jirum",
      "title": "알뜰구매"
    },
    {
      "id": "sold",
      "title": "중고장터"
    },
    {
      "id": "image",
      "title": "사진게시판",
      "showMedia": true
    },
    {
      "id": "kin",
      "title": "아무거나질문"
    },
    {
      "id": "pds",
      "title": "자료실"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".board_name .board_subject span",
      ".board_name .board_subject",
      "h3.board_name",
      ".board_name",
      ".board_title",
      "h2.board_title",
      "h2 .board_name",
      "title"
    ],
    "listRows": [
      "[data-role='list-row']",
      "a.list_item",
      "div.list_item.symph_row",
      "div.list_item",
      "tr.list_item",
      "tr"
    ],
    "listLink": [
      ".list_title a.list_subject",
      "a.list_subject",
      "a.card_subject",
      "a[href*='/service/board/']"
    ],
    "listTitle": [
      "[data-role='list-title-text']",
      ".card_subject span[title]",
      ".card_subject span",
      ".card_subject",
      ".list_title a.list_subject",
      ".list_title",
      "a.list_subject",
      ".subject_fixed"
    ],
    "listAuthor": [
      ".list_author .nickname",
      ".list_author .nickimg",
      ".list_author .nickimg img",
      ".list_author",
      ".author",
      "[data-role='list-author']"
    ],
    "listAvatar": [
      ".list_author .nickimg img",
      ".list_author img",
      ".author img",
      "[data-role='list-author'] img"
    ],
    "listDate": [
      ".list_time",
      ".list_date",
      "time",
      "[data-role='list-date']"
    ],
    "listCommentCount": [
      ".list_comment",
      ".comment_count",
      ".reply_count",
      ".list_reply",
      ".rSymph05",
      "[data-role='list-comment-count']"
    ],
    "listViewCount": [
      ".list_hit",
      ".list_view",
      ".hit",
      "[data-role='list-hit']"
    ],
    "listLikeCount": [
      ".list_symph",
      ".symph_count",
      ".list_recommend",
      "[data-role='list-like-count']"
    ],
    "listCategory": [
      ".list_category",
      ".category",
      "[data-role='list-category']"
    ],
    "listImage": [
      ".card_image img",
      ".img_box img",
      "[data-role='card-content'] img",
      "img[src]"
    ],
    "postTitle": [
      "h3.post_subject span",
      "h3.post_subject",
      ".post_subject span",
      ".post_subject",
      "h1.subject",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".post_contact .contact_name",
      ".post_contact .nickimg",
      ".post_contact .nickimg img",
      ".post_author .nickname",
      ".post_author .name",
      ".post_info .nickname",
      ".post_info .name",
      ".author .nickname",
      ".author",
      "[data-role='post-author']"
    ],
    "postAvatar": [
      ".post_contact .nickimg img",
      ".post_contact img",
      ".post_author img",
      ".post_info img",
      ".author img",
      "[data-role='post-author'] img"
    ],
    "postDate": [
      ".post_information .post_date .time",
      ".post_information .post_date",
      ".post_information .post_time",
      ".post_author .view_count.date",
      ".post_time",
      ".post_info .post_time",
      ".post_info time",
      "[data-role='post-date']",
      "time"
    ],
    "postViewCount": [
      ".view_count",
      ".post_hit",
      ".post_view_count",
      ".hit",
      "[data-role='post-hit']"
    ],
    "postLikeCount": [
      ".symph_count",
      ".post_symph",
      ".recommend_count",
      ".post_recommend .num",
      "[data-role='post-like']"
    ],
    "postCategory": [
      ".post_category",
      ".category"
    ],
    "postContent": [
      ".post_content",
      "article .post_article body",
      "article .post_article",
      ".post_article body",
      ".post_article",
      "article .post_content body",
      "article .post_content",
      "#div_content",
      "[data-role='post-content']"
    ],
    "commentRows": [
      "#comment_view .comment_row",
      ".comment_row",
      ".comment_list .comment_item",
      ".comment_list li",
      ".post_comment .comment_item",
      ".post_comment .comment_row",
      "[data-role='comment-item']"
    ],
    "commentAuthor": [
      ".nickname",
      ".name",
      ".comment_author",
      ".user_name",
      "[data-role='comment-author']"
    ],
    "commentAvatar": [
      ".comment_profile img",
      ".profile img",
      ".nickname img",
      ".comment_author img",
      ".user_name img",
      "[data-role='comment-author'] img"
    ],
    "commentContent": [
      ".comment_view",
      "[data-comment-view]",
      ".comment_content .comment_view",
      ".comment_text",
      ".comment_contents",
      ".cmt_content",
      "[data-role^='comment-content-']",
      "[data-role='comment-content']"
    ],
    "commentDate": [
      ".comment_time",
      ".post_time",
      ".timestamp",
      "time",
      "[data-role='comment-date']"
    ],
    "commentLikeCount": [
      ".symph_count",
      ".comment_symph .num",
      ".comment_symph strong",
      "[id^='setLikeCount_']",
      ".recommend_count",
      ".comment_recommend .num",
      "[data-role='comment-like']"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": [
    "data-depth",
    "depth"
  ],
  "useRawPostParse": true,
  "useRawPostParseInEmulator": true,
  "boardGroupMap": {
    "park": "커뮤니티",
    "news": "정보",
    "use": "정보",
    "lecture": "정보",
    "useful": "정보",
    "jirum": "거래",
    "sold": "거래",
    "image": "사진",
    "kin": "질문",
    "pds": "자료"
  }
};
SITE.matchBoard = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length >= 3 && parts[0] === "service" && parts[1] === "board" && parts[2] && !/^\d+$/.test(parts[2])) {
        return {
            board: ensureBoard(parts[2], SITE.buildBoardUrlFromId(parts[2]), parts[2]),
            page: queryInt(urlInfo.query, "po", 0)
        };
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length >= 4 && parts[0] === "service" && parts[1] === "board" && parts[2] && /^\d+$/.test(parts[3])) {
        return {
            board: ensureBoard(parts[2], SITE.buildBoardUrlFromId(parts[2]), parts[2]),
            postId: parts[3]
        };
    }
    return null;
};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    return setPageParam(currentUrl, "po", nextPage);
};
SITE.buildPostFetchUrls = function (match, currentUrl) {
    var boardId = match && match.board ? match.board.id : "";
    var postId = match ? match.postId : "";
    var canonical = "https://" + SYNURA.domain + "/service/board/" + encodeURIComponent(boardId) + "/" + encodeURIComponent(postId);
    return [canonical, canonical + "/", currentUrl];
};
SITE.buildBoardUrlFromId = function (boardId) {
    return "https://" + SYNURA.domain + "/service/board/" + encodeURIComponent(boardId) + "?od=T31&category=0&po=0";
};
SITE.loadDynamicBoards = function (options) {
    var allowNetwork = !(options && options.allowNetwork === false);
    var force = !!(options && options.force);
    var cacheKey = CACHE_PREFIX + "dynamic:clien:v2";
    var cacheTsKey = cacheKey + ":ts";
    var cached = readStoredJson(cacheKey, []);
    var cachedTs = parseInt(String(localStorage.getItem(cacheTsKey) || "0"), 10) || 0;
    var fallback = clienBuildPreloadedDynamicBoards();
    if (!force && Array.isArray(cached) && cached.length > 0 && (Date.now() - cachedTs) < 21600000) {
        return cached;
    }
    if (!allowNetwork) return Array.isArray(cached) && cached.length > 0 ? cached : fallback;
    try {
        var doc = fetchDocument(SITE.browserHomeUrl);
        var links = allNodes(doc, [".snb_groupmenu a.menu-list.somoim", "a.menu-list.somoim", "a[href^='/service/board/cm_']"]);
        var items = [];
        var seen = {};
        for (var i = 0; i < links.length; i++) {
            var href = ensureAbsoluteUrl(attrOf(links[i], "href"), SITE.browserHomeUrl);
            var matched = String(href || "").match(/\/service\/board\/([^/?#]+)/);
            if (!matched || !matched[1]) continue;
            var boardId = normalizeWhitespace(matched[1]);
            if (!boardId || seen[boardId]) continue;
            seen[boardId] = true;
            var title = firstNonEmpty([
                attrOf(links[i], "title"),
                firstText(links[i], [".menu_over"]),
                textOf(links[i]),
                boardId
            ]);
            items.push({
                id: boardId,
                title: title,
                url: SITE.buildBoardUrlFromId(boardId),
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
    return Array.isArray(cached) && cached.length > 0 ? cached : fallback;
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
    var out = [];
    for (var i = 0; i < menus.length; i++) {
        out.push(menus[i]);
        if (menus[i] === MENU_BROWSER) {
            out.push(BUTTON_REFRESH);
        }
    }
    return out;
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
    if (match && match.board && match.board.id === "image") {
        return clienBuildImageBoardRoute(url, match);
    }
    return null;
};
SITE.routePostCustom = function (url, urlInfo, match, force) {
    return null;
};

var CLIEN_DATE_FORMAT_CONTEXT = (function () {
    var now = new Date();
    var today = now.getFullYear() + "-" + padNumber(now.getMonth() + 1) + "-" + padNumber(now.getDate());
    var nextRefreshAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    return {
        today: today,
        nextRefreshAt: nextRefreshAt
    };
})();

function padNumber(value) {
    return String(value).replace(/^(\d)$/, "0$1");
}

function getClienDateFormatContext() {
    var nowMs = Date.now();
    if (nowMs < CLIEN_DATE_FORMAT_CONTEXT.nextRefreshAt) return CLIEN_DATE_FORMAT_CONTEXT;

    var now = new Date(nowMs);
    CLIEN_DATE_FORMAT_CONTEXT.today = now.getFullYear() + "-" + padNumber(now.getMonth() + 1) + "-" + padNumber(now.getDate());
    CLIEN_DATE_FORMAT_CONTEXT.nextRefreshAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    return CLIEN_DATE_FORMAT_CONTEXT;
}

function selectBestClienDateValue(values) {
    if (!values || !Array.isArray(values)) return "";

    var fallback = "";
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        if (value == null) continue;

        var text = String(value).replace(/\s+/g, " ").trim();
        if (!text) continue;
        if (!fallback) fallback = text;
        if (/\d{4}-\d{2}-\d{2}/.test(text)) return text;
    }

    return fallback;
}

function formatClienCommentDate(value) {
    if (!value) return "";

    var raw = String(value)
        .replace(/\s*\/\s*수정\b.*$/u, "")
        .replace(/\s*\(수정\)\s*$/u, "")
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
    if (matched) {
        var today = getClienDateFormatContext().today;
        var datePart = matched[1] + "-" + matched[2] + "-" + matched[3];
        var timePart = matched[4] || "";
        if (datePart === today) return timePart || (matched[2] + "-" + matched[3]);
        return timePart ? (matched[2] + "-" + matched[3] + " " + timePart) : (matched[2] + "-" + matched[3]);
    }

    var timeMatch = candidate.match(/\b(\d{1,2}:\d{2})(?::\d{2})?\b/);
    if (timeMatch) return timeMatch[1];
    return raw;
}

SITE.parseComments = function (doc, postUrl) {
    function clienDetectCommentLevel(row) {
        var depthAttr = firstNonEmpty([
            attrOf(row, "data-depth"),
            attrOf(row, "depth")
        ]);
        var depthNum = parseInt(depthAttr, 10);
        if (!isNaN(depthNum) && depthNum >= 0) return depthNum;

        var cls = attrOf(row, "class");
        if (/depth[_-]?2|reply|recomment|comment_reply|indent2|\bre\b/i.test(cls)) return 1;
        if (/depth[_-]?3|indent3/i.test(cls)) return 2;

        var style = attrOf(row, "style");
        var matched = style.match(/margin-left\s*:\s*(\d+)px/i);
        if (matched && matched[1]) {
            var px = parseInt(matched[1], 10);
            if (!isNaN(px) && px > 0) return Math.max(0, Math.round(px / 20));
        }

        return detectCommentLevel(row);
    }

    var rows = allNodes(doc, SITE.selectors.commentRows);
    var comments = [];
    var postAuthor = firstAuthorText(doc, SITE.selectors.postAuthor);

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var contentWrap = firstNode(row, [
            ".comment_content",
            ".comment_text",
            ".comment_contents",
            ".cmt_content",
            "[data-role^='comment-content-']",
            "[data-role='comment-content']"
        ]);
        var contentRoot = firstNode(row, SITE.selectors.commentContent);
        var content = parseDetails(contentRoot, postUrl);
        if ((!content || content.length === 0) && (contentWrap || contentRoot)) {
            var wrapText = textOf(contentWrap || contentRoot);
            if (wrapText) content = [{ type: "text", value: wrapText }];
        }
        if (!content || content.length === 0) {
            var hiddenRaw = firstNonEmpty([
                attrOf(firstNode(contentWrap || row, ["input[data-comment-modify]"]), "value"),
                attrOf(firstNode(row, ["input[data-comment-modify]"]), "value")
            ]);
            var hidden = String(hiddenRaw || "").trim();
            if (hidden) content = [{ type: "text", value: hidden }];
        }
        if (!content || content.length === 0) continue;

        var author = firstAuthorText(row, SITE.selectors.commentAuthor);
        var likeCount = hideZeroCount(parseCount(firstText(row, SITE.selectors.commentLikeCount)));
        var dislikeCount = hideZeroCount(parseCount(firstText(row, [
            ".not_symph_count",
            ".comment_not_recommend .num",
            "[data-role='comment-dislike']"
        ])));
        var avatar = imageUrlFromNode(firstNode(row, [
            ".post_contact img",
            ".contact_name img",
            ".nickname img",
            ".comment_profile img",
            ".profile img"
        ].concat(SITE.selectors.commentAvatar || SITE.selectors.commentAuthor || [])), postUrl);
        var rowId = firstNonEmpty([
            attrOf(row, "data-comment-sn"),
            attrOf(firstNode(row, [".comment_point"]), "id"),
            attrOf(row, "id"),
            "comment_" + i
        ]);
        var dateEl = firstNode(row, [
            ".comment_time",
            ".post_time",
            ".timestamp",
            "time",
            "[data-role='comment-date']"
        ]);
        var nestedTimeEl = firstNode(dateEl, ["time"]);
        var menus = ["답글"];
        if (author && postAuthor && author === postAuthor) menus.push("작성자");

        comments.push({
            link: postUrl + "#" + rowId,
            author: author,
            avatar: avatar,
            content: content,
            date: formatClienCommentDate(selectBestClienDateValue([
                attrOf(dateEl, "datetime"),
                attrOf(nestedTimeEl, "datetime"),
                attrOf(dateEl, "title"),
                attrOf(nestedTimeEl, "title"),
                textOf(nestedTimeEl),
                textOf(dateEl),
                firstText(row, SITE.selectors.commentDate)
            ])),
            likeCount: likeCount,
            dislikeCount: dislikeCount,
            level: clienDetectCommentLevel(row),
            menus: menus,
            hotCount: toInt(likeCount, 0),
            coldCount: toInt(likeCount, 0)
        });
    }

    return comments;
};
SITE.fetchPostComments = function (match, url, doc, page, comments) {
    return comments;
};
SITE.handleViewEvent = function (viewId, event, state, context) {
    if (state && state.kind === "home" && event.eventId === "MENU_CLICK" && event.data && event.data.menu === BUTTON_REFRESH) {
        updateViewFromRoute(viewId, createHomeRoute(!!state.isReorderable, "새로고침 완료"));
        return true;
    }
    return false;
};
SITE.handleBoardSettingsRootEvent = function (viewId, event, state) {
    return false;
};

var SYNURA = {
    domain: "m.clien.net",
    name: "clien",
    description: "Unofficial Clien extension",
    version: 0.5,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://m.clien.net/service/image/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = ["^https://m\\.clien\\.net/service/board/[^/]+/\\d+"];
var LIST_LINK_SELECTORS = [".list_title a.list_subject","a.list_subject","a[href*='/service/board/']"];
var LIST_TITLE_SELECTORS = ["[data-role='list-title-text']",".list_title a.list_subject",".list_title","a.list_subject",".subject_fixed"];
var LIST_AUTHOR_SELECTORS = [".list_author .nickname",".list_author .nickimg",".list_author .nickimg img",".list_author",".author","[data-role='list-author']"];
var LIST_AVATAR_SELECTORS = [".list_author .nickimg img",".list_author img",".author img","[data-role='list-author'] img"];
var LIST_DATE_SELECTORS = [".list_time",".list_date","time","[data-role='list-date']"];
var LIST_COMMENT_COUNT_SELECTORS = [".list_comment",".comment_count",".reply_count",".list_reply",".rSymph05","[data-role='list-comment-count']"];
var LIST_VIEW_COUNT_SELECTORS = [".list_hit",".list_view",".hit","[data-role='list-hit']"];
var LIST_LIKE_COUNT_SELECTORS = [".list_symph",".symph_count",".list_recommend","[data-role='list-like-count']"];
var LIST_CATEGORY_SELECTORS = [".list_category",".category","[data-role='list-category']"];
var LIST_IMAGE_SELECTORS = ["img[src]"];

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
        hotCount: toInt(likeCount || viewCount || commentCount, 0),
        coldCount: toInt(viewCount || likeCount || commentCount, 0)
    };
}

function clienImageBoardPage(match) {
    if (!match) return 0;
    var page = match.page;
    return typeof page === "number" && !isNaN(page) ? page : 0;
}

function clienImageBoardLink(row, baseUrl) {
    return extractListLink(row, baseUrl, selectorList("listLink", [
        "a.card_subject",
        "a.card_image",
        "a[href*='/service/board/image/']"
    ]), LIST_LINK_ALLOW_PATTERNS);
}

function clienExtractImageBoardItem(row, baseUrl) {
    if (!row) return null;

    var link = clienImageBoardLink(row, baseUrl);
    if (!link) return null;

    var titleSelectors = selectorList("listTitle", [
        "a.card_subject span[title]",
        "a.card_subject",
        ".card_subject",
        ".card_preview span"
    ]);
    var commentCountSelectors = selectorList("listCommentCount", [
        ".list_reply",
        "[data-role='ele-after']"
    ]);
    var viewCountSelectors = selectorList("listViewCount", [
        ".list_time .hit",
        ".hit"
    ]);
    var likeCountSelectors = selectorList("listLikeCount", [
        ".list_symph",
        "[data-role='list-like-count']"
    ]);
    var dateSelectors = selectorList("listDate", [
        ".list_time span:last-child",
        ".list_time > span:not(.hit)",
        ".list_time",
        ".list_date",
        "time",
        "[data-role='list-date']"
    ]);
    var authorSelectors = selectorList("listAuthor", [
        ".list_author .nickname",
        ".list_author",
        "[data-author-id]"
    ]);
    var imageSelectors = selectorList("listImage", [
        ".card_image img",
        ".img_box img",
        "[data-role='card-content'] img"
    ]);
    var title = firstNonEmpty([
        attrOf(firstNode(row, [titleSelectors[0]]), "title"),
        textOfNodeWithoutSelectors(firstNode(row, [firstNonEmpty([titleSelectors[1], titleSelectors[0]])]), [".card_preview"]),
        firstText(row, titleSelectors)
    ]);
    if (!title) return null;

    var commentCount = hideZeroCount(parseCount(firstNonEmpty([
        attrOf(row, "data-comment-count"),
        firstText(row, commentCountSelectors)
    ])));
    var viewCount = parseCount(firstText(row, viewCountSelectors));
    var likeCount = hideZeroCount(parseCount(firstText(row, likeCountSelectors)));
    var date = firstText(row, dateSelectors);
    var author = firstNonEmpty([
        firstText(row, authorSelectors),
        attrOf(row, "data-author-id")
    ]);
    var mediaUrl = imageUrlFromNode(firstNode(row, imageSelectors), baseUrl);
    var types = [];
    if (mediaUrl) types.push("image");

    return {
        link: normalizeUrl(link) || link,
        title: title,
        author: author,
        avatar: "",
        date: date,
        category: "",
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

function clienParseImageBoardItems(doc, baseUrl) {
    var rows = allNodes(doc, selectorList("listRows", [
        ".card_item[data-role='list-row']",
        "[data-role='list-row'].card_item",
        "[data-role='list-row']"
    ]));
    var items = [];
    var seen = {};
    for (var i = 0; i < rows.length; i++) {
        var item = clienExtractImageBoardItem(rows[i], baseUrl);
        if (!item || !item.link || seen[item.link]) continue;
        seen[item.link] = true;
        items.push(item);
    }
    return items;
}

SITE.selectorProfiles = SITE.selectorProfiles || {};
SITE.selectorProfiles.clien_image_board = {
    listRows: [
        ".card_item[data-role='list-row']",
        "[data-role='list-row'].card_item",
        "[data-role='list-row']"
    ],
    listLink: [
        "a.card_subject",
        "a.card_image",
        "a[href*='/service/board/image/']"
    ],
    listTitle: [
        "a.card_subject span[title]",
        "a.card_subject",
        ".card_subject",
        ".card_preview span"
    ],
    listAuthor: [
        ".list_author .nickname",
        ".list_author",
        "[data-author-id]"
    ],
    listDate: [
        ".list_time span:last-child",
        ".list_time > span:not(.hit)",
        ".list_time",
        ".list_date",
        "time",
        "[data-role='list-date']"
    ],
    listCommentCount: [
        ".list_reply",
        "[data-role='ele-after']"
    ],
    listViewCount: [
        ".list_time .hit",
        ".hit"
    ],
    listLikeCount: [
        ".list_symph",
        "[data-role='list-like-count']"
    ],
    listImage: [
        ".card_image img",
        ".img_box img",
        "[data-role='card-content'] img"
    ]
};
SITE.selectorProfilesByBoard = SITE.selectorProfilesByBoard || {};
SITE.selectorProfilesByBoard.image = {
    board: ["clien_image_board"]
};

function clienBuildImageBoardRoute(url, match) {
    var doc = fetchDocument(url);
    var items = clienParseImageBoardItems(doc, url);
    var title = detectBoardTitle(doc, match ? match.board : null);
    var page = clienImageBoardPage(match);
    var nextUrl = SITE.buildNextPageUrl(match, url, page + 1);
    var seenLinks = [];
    for (var i = 0; i < items.length; i++) {
        seenLinks.push(items[i].link);
    }

    var context = {
        kind: "board",
        link: url,
        boardId: match && match.board ? match.board.id : "",
        title: title,
        page: page,
        nextUrl: nextUrl,
        seenLinks: seenLinks
    };
    try {
        context = SITE.prepareBoardContext ? (SITE.prepareBoardContext(context, items, match, url) || context) : context;
    } catch (e) {
    }

    return {
        kind: "board",
        url: url,
        viewData: {
            view: "/views/list",
            styles: buildBoardListStyles(title, match ? match.board : null, nextUrl),
            models: {
                contents: items,
                menus: getBoardMenus(context)
            }
        },
        context: context
    };
}
