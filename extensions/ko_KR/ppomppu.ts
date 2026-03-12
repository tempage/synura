// @ts-nocheck

var PPOMPPU_BOARD_TITLE_OVERRIDES = {
  "ppomppu": "뽐뿌",
  "pmarket": "업체뽐뿌",
  "pmarket3": "인터넷가입"
};

// Seed full board settings so cold starts do not require HTTP.
var PPOMPPU_DEFAULT_BOARD_GROUPS = [
  {
    "group": "뽐뿌",
    "boards": [
      ["ppomppu", "뽐뿌"],
      ["ppomppu2", "휴대폰뽐뿌"],
      ["ppomppu4", "해외뽐뿌"],
      ["ppomppu8", "알리뽐뿌"],
      ["pmarket", "업체뽐뿌"],
      ["pmarket2", "휴대폰업체"],
      ["pmarket3", "인터넷가입"],
      ["card_market", "카드업체"],
      ["pmarket7", "렌탈업체"],
      ["pmarket8", "보험업체"]
    ]
  },
  {
    "group": "이벤트",
    "boards": [
      ["event2", "이벤트게시판"],
      ["coupon", "쿠폰게시판"],
      ["experience", "체험단모집"],
      ["wcoupon", "다운로드쿠폰"],
      ["event_ppomppu", "뽐뿌이벤트"]
    ]
  },
  {
    "group": "정보",
    "boards": [
      ["etc_info", "이것저것공유"],
      ["youtube_info", "유튜브/숏폼"],
      ["restaurant", "맛집정보"],
      ["review2", "사용기"],
      ["receive", "구매후기"],
      ["ppomapp", "앱정보"],
      ["guin", "구인정보"],
      ["ppom_game", "뽐뿌게임"]
    ]
  },
  {
    "group": "커뮤니티",
    "boards": [
      ["freeboard", "자유게시판"],
      ["daily_life", "일상토크"],
      ["humor", "유머/감동"],
      ["grade", "신입게시판"]
    ]
  },
  {
    "group": "갤러리",
    "boards": [
      ["free_gallery", "자유갤러리"],
      ["star", "연예인갤러리"],
      ["announcer", "아나운서갤러리"],
      ["sketch_gallery", "그림갤러리"],
      ["bg_gallery", "바탕화면갤러리"],
      ["jjalbang", "짤방갤러리"]
    ]
  },
  {
    "group": "장터",
    "boards": [
      ["market", "뽐뿌장터"],
      ["market_data", "데이터장터"],
      ["onmarket", "온라인장터"],
      ["gonggu", "OTT/멤버십"],
      ["market_agent", "해외구매대행"],
      ["market_story", "장터이야기"],
      ["relay", "추천릴레이"]
    ]
  },
  {
    "group": "뉴스",
    "boards": [
      ["news_broadcast", "방송/연예뉴스"],
      ["news_sports", "스포츠뉴스"],
      ["news_pol_eco", "정치뉴스"],
      ["news_economy", "경제뉴스"],
      ["news_society", "사회뉴스"],
      ["news_culture", "문화뉴스"],
      ["news_life", "라이프뉴스"],
      ["news_travel", "여행뉴스"],
      ["news2", "IT/테크"],
      ["news", "지역"]
    ]
  },
  {
    "group": "상담실",
    "boards": [
      ["consulting", "보험상담"],
      ["loan_consult", "대출상담"],
      ["phone_consult", "휴대폰상담"],
      ["tele_consult", "인터넷가입상담"],
      ["card_consult", "카드상담"],
      ["rental_consult", "렌탈상담"],
      ["car_service", "신차견적상담"],
      ["pc_consult", "PC견적상담"],
      ["wedding_consult", "웨딩상담"],
      ["move_consult", "이사상담"],
      ["aircon_consult", "에어컨전문상담"],
      ["security_guard_consult", "보안경비상담"],
      ["etc_consult", "가전견적상담"],
      ["law_consult", "법률상담"],
      ["tax_consult", "경영지원상담"]
    ]
  },
  {
    "group": "포럼/휴대폰/가전",
    "boards": [
      ["phone", "휴대폰포럼"],
      ["phone3", "구입개통수령"],
      ["iphone", "아이폰포럼"],
      ["tablet", "아이패드포럼"],
      ["android", "안드로이드"],
      ["androidtab", "안드로이드탭"],
      ["av", "가전포럼"],
      ["mini", "오디오포럼"],
      ["computer", "PC/인터넷"],
      ["nas", "NAS포럼"]
    ]
  },
  {
    "group": "포럼/스포츠",
    "boards": [
      ["golf", "골프포럼"],
      ["fishing", "낚시포럼"],
      ["climb", "등산포럼"],
      ["sports", "스포츠포럼"],
      ["baseball", "야구포럼"],
      ["soccer", "축구포럼"],
      ["health", "건강/헬스"],
      ["running", "러닝포럼"]
    ]
  },
  {
    "group": "포럼/경제/지역",
    "boards": [
      ["money", "재테크포럼"],
      ["insurance", "보험포럼"],
      ["social", "쇼핑포럼"],
      ["stock", "증권포럼"],
      ["soho", "창업/자영업"],
      ["bitcoin", "가상화폐"],
      ["lotto", "로또포럼"],
      ["toto", "토토/프로토"],
      ["house", "부동산포럼"],
      ["oversea", "해외포럼"],
      ["china", "중국포럼"]
    ]
  },
  {
    "group": "포럼/생활",
    "boards": [
      ["wedding", "결혼/연애"],
      ["problem", "고민포럼"],
      ["diabetes", "당뇨포럼"],
      ["tour", "여행포럼"],
      ["nutrients", "영양제포럼"],
      ["baby", "육아포럼"],
      ["alopecia", "탈모포럼"],
      ["e_cig", "전자담배포럼"]
    ]
  },
  {
    "group": "포럼/게임/문화",
    "boards": [
      ["gameforum", "게임포럼"],
      ["gamer", "게임기포럼"],
      ["mobile_game", "모바일게임"],
      ["lck", "LCK포럼"],
      ["book", "독서/e-book"],
      ["movie", "영화/OTT"]
    ]
  },
  {
    "group": "포럼/취미/레저",
    "boards": [
      ["diy", "DIY포럼"],
      ["camera", "사진/카메라"],
      ["watch", "시계포럼"],
      ["interior", "인테리어"],
      ["coffee", "커피포럼"],
      ["car", "자동차포럼"],
      ["bike", "자전거포럼"],
      ["motorbike", "오토바이포럼"],
      ["camping", "캠핑포럼"]
    ]
  },
  {
    "group": "포럼/기타",
    "boards": [
      ["f7080", "30+포럼"],
      ["morethan40", "40+포럼"],
      ["ai", "AI포럼"],
      ["developer", "개발자포럼"],
      ["miz", "여성포럼"],
      ["adult", "성인포럼"],
      ["style", "패션포럼"],
      ["whatever", "전/현/무포럼"],
      ["employment", "취업/학습"]
    ]
  },
  {
    "group": "오픈포럼/ㄱ",
    "boards": [
      ["fear", "_공포포럼"],
      ["science", "_과학포럼"],
      ["country", "_국가별포럼"],
      ["army", "_군대포럼"],
      ["nonsmoking", "_금연포럼"],
      ["smartphone", "_기타스마트폰"]
    ]
  },
  {
    "group": "오픈포럼/ㄴ~ㄹ",
    "boards": [
      ["basketball", "_농구포럼"],
      ["publictransport", "_대중교통"],
      ["pet", "_동식물포럼"],
      ["streamer", "_동영상포럼"],
      ["rc", "_드론포럼"],
      ["defi", "_디파이/채굴"]
    ]
  },
  {
    "group": "오픈포럼/ㅁ",
    "boards": [
      ["mart", "_마트/편의점"],
      ["animation", "_만화/애니"],
      ["macintosh", "_맥포럼"],
      ["medical", "_메디컬포럼"],
      ["mungu", "_문구포럼"],
      ["stylesheet", "_문서/서식"],
      ["munwha", "_문화포럼"]
    ]
  },
  {
    "group": "오픈포럼/ㅂ~ㅅ",
    "boards": [
      ["delivery_food", "_배달음식"],
      ["boardgame", "_보드게임"],
      ["volunteer", "_봉사포럼"],
      ["beauty", "_뷰티/케어"],
      ["ppom_baseball_team", "_사회인야구"],
      ["lifesports", "_생활스포츠"],
      ["swim", "_수영포럼"],
      ["ski", "_스키/보드"],
      ["scuba", "_스킨/스쿠버"]
    ]
  },
  {
    "group": "오픈포럼/ㅇ",
    "boards": [
      ["idol", "_아이돌포럼"],
      ["alba", "_알바포럼"],
      ["history", "_역사포럼"],
      ["couple", "_연애포럼"],
      ["food", "_요리/레시피"],
      ["fortune", "_운세포럼"],
      ["wintab", "_윈도우태블릿"],
      ["music", "_음악/악기"]
    ]
  },
  {
    "group": "오픈포럼/ㅈ",
    "boards": [
      ["alone", "_자취포럼"],
      ["e_unicycle", "_전동휠포럼"],
      ["religion", "_종교포럼"],
      ["alcohol", "_주류포럼"],
      ["offline", "_지역별포럼"],
      ["worker", "_직장인포럼"]
    ]
  },
  {
    "group": "오픈포럼/ㅊ~ㅎ/기타",
    "boards": [
      ["hobby", "_취미포럼"],
      ["carpool", "_카풀포럼"],
      ["tennis", "_테니스포럼"],
      ["study", "_학습포럼"],
      ["honjok", "_혼족포럼"],
      ["drama", "_TV/드라마"]
    ]
  }
];

function ppomppuNormalizeBoardTitle(boardId, title) {
  var id = boardId ? String(boardId).trim() : "";
  if (id && PPOMPPU_BOARD_TITLE_OVERRIDES[id]) return PPOMPPU_BOARD_TITLE_OVERRIDES[id];
  return title ? String(title).trim() : "";
}

function ppomppuBuildBoardUrl(boardId) {
  return "/new/bbs_list.php?id=" + encodeURIComponent(String(boardId || ""));
}

function ppomppuBuildBoardsFromGroups(groups, options) {
  var items = [];
  var seen = {};
  var flags = options || {};
  for (var i = 0; i < (groups || []).length; i++) {
    var groupSpec = groups[i] || {};
    var group = groupSpec.group ? String(groupSpec.group).trim() : "";
    var boards = Array.isArray(groupSpec.boards) ? groupSpec.boards : [];
    for (var j = 0; j < boards.length; j++) {
      var entry = boards[j] || [];
      var id = entry[0] ? String(entry[0]).trim() : "";
      var title = ppomppuNormalizeBoardTitle(id, entry[1]);
      if (!id || !title || seen[id]) continue;
      seen[id] = true;
      var item = {
        "id": id,
        "title": title,
        "url": ppomppuBuildBoardUrl(id),
        "group": group
      };
      if (id === "ppomppu") {
        item.description = "대표 핫딜 게시판";
      }
      if (flags.dynamic) {
        item.dynamic = true;
      }
      items.push(item);
    }
  }
  return items;
}

function ppomppuAppendBoardGroups(groups, sections, prefix) {
  var out = Array.isArray(groups) ? groups : [];
  var list = Array.isArray(sections) ? sections : [];
  var groupPrefix = prefix ? String(prefix) : "";
  for (var i = 0; i < list.length; i++) {
    var section = list[i] || {};
    var sectionTitle = section.title ? String(section.title).trim() : "";
    var rawBoards = Array.isArray(section.list) ? section.list : [];
    var boards = [];
    for (var j = 0; j < rawBoards.length; j++) {
      var board = rawBoards[j] || {};
      var id = board.id ? String(board.id).trim() : "";
      var title = board.name ? String(board.name).trim() : "";
      if (!id || !title) continue;
      boards.push([id, title]);
    }
    if (boards.length === 0) continue;
    out.push({
      "group": groupPrefix + sectionTitle,
      "boards": boards
    });
  }
  return out;
}

function ppomppuBuildBoardsFromMenuData(data, options) {
  if (!data) return [];
  var groups = [];
  ppomppuAppendBoardGroups(groups, data.etc, "");
  ppomppuAppendBoardGroups(groups, data.forum, "포럼/");
  ppomppuAppendBoardGroups(groups, data.forum_unoff, "오픈포럼/");
  return ppomppuBuildBoardsFromGroups(groups, options);
}

var SITE = {
  "siteKey": "ppomppu",
  "displayName": "뽐뿌",
  "browserHomeUrl": "https://m.ppomppu.co.kr/new/bbs_list.php?id=ppomppu",
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
  "defaultVisibleBoardIds": [
    "ppomppu",
    "freeboard",
    "ppomppu2",
    "ppomppu4",
    "ppomppu8",
    "pmarket",
    "pmarket2",
    "pmarket3",
    "coupon",
    "stock"
  ],
  "hostAliases": [
    "ppomppu.co.kr",
    "www.ppomppu.co.kr"
  ],
  "challengeMarkers": [],
  "titleSuffixes": [
    " - 뽐뿌",
    " : 뽐뿌"
  ],
  "linkAllowPatterns": [
    "(?:bbs_view|zboard/view)\\.php\\?[^#]*\\bno="
  ],
  "listBoardQueryParam": "id",
  "boards": ppomppuBuildBoardsFromGroups(PPOMPPU_DEFAULT_BOARD_GROUPS),
  "selectors": {
    "boardTitle": [
      ".bbs .title",
      ".title",
      "title"
    ],
    "listRows": [
      ".bbsList_new li",
      ".bbsList li",
      ".bbs_list li",
      "ul li"
    ],
    "listLink": [
      "a.noeffect",
      "a.list_b_01n",
      "a[href*='bbs_view.php']"
    ],
    "listTitle": [
      ".thumb_sec strong",
      ".title .cont",
      ".cont",
      ".list_b_01n"
    ],
    "listAuthor": [
      ".names",
      ".name",
      ".writer"
    ],
    "listDate": [
      "time",
      ".date",
      ".time",
      ".hi"
    ],
    "listCommentCount": [
      ".rp",
      ".reply"
    ],
    "listViewCount": [
      ".hit",
      ".view"
    ],
    "listLikeCount": [
      ".recs",
      ".rec",
      ".recom",
      ".recommend"
    ],
    "listCategory": [
      ".names",
      ".title .cate",
      ".cate"
    ],
    "listImage": [
      ".thumb_img",
      ".thmb_N img",
      "img"
    ],
    "postTitle": [
      "title",
      ".subject",
      "h1"
    ],
    "postAuthor": [
      ".writer",
      ".name"
    ],
    "postDate": [
      ".hi",
      ".date"
    ],
    "postViewCount": [
      ".hit",
      ".view"
    ],
    "postLikeCount": [
      ".top_recommend_area",
      ".recommend"
    ],
    "postCategory": [
      ".subject_preface",
      ".cate"
    ],
    "postContent": [
      "#KH_Content",
      ".bbs.view #KH_Content",
      ".viAr",
      ".board-contents",
      ".board_contents",
      ".view_content",
      ".bbs.view .cont"
    ],
    "commentRows": [
      "#cmAr .sect-cmt",
      ".cmAr .sect-cmt",
      ".sect-cmt",
      "li[id^='comment_']",
      "li[id^='recomment_']",
      "[id^='comment_']",
      "[id^='recomment_']",
      ".comment_list li",
      ".comment-list li",
      ".board_comment li",
      ".comment_area li",
      ".cmAr .sect-cmt li"
    ],
    "commentAuthor": [
      ".com_name_writer",
      ".writer",
      ".name"
    ],
    "commentContent": [
      ".comment_memo",
      ".mid-text-area",
      ".content",
      ".comment_content",
      ".txt"
    ],
    "commentDate": [
      "time",
      ".date",
      ".time"
    ],
    "commentLikeCount": [
      "[id^='vote_cnt_']",
      ".recom",
      ".recommend"
    ],
    "commentLevel": [
      ".recomment",
      "[id^='recomment_']",
      "[data-depth]"
    ]
  },
  "commentLevelAttrs": [
    "data-depth"
  ]
};
SITE.matchBoard = function (urlInfo) {
    if (urlInfo.path === "/new/bbs_list.php") {
        var boardId = queryValue(urlInfo.query, "id");
        if (boardId) {
            return {
                board: ensureBoard(boardId, "https://" + SYNURA.domain + "/new/bbs_list.php?id=" + boardId, boardId),
                page: queryInt(urlInfo.query, "page", 1)
            };
        }
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    if (urlInfo.path === "/new/bbs_view.php") {
        var boardId = queryValue(urlInfo.query, "id");
        var postId = queryValue(urlInfo.query, "no");
        if (boardId && postId) {
            return {
                board: ensureBoard(boardId, "https://" + SYNURA.domain + "/new/bbs_list.php?id=" + boardId, boardId),
                postId: postId
            };
        }
    }
    if (urlInfo.path === "/zboard/view.php") {
        var zboardId = queryValue(urlInfo.query, "id");
        var zboardNo = queryValue(urlInfo.query, "no");
        if (zboardId && zboardNo) {
            return {
                board: ensureBoard(zboardId, "https://" + SYNURA.domain + "/new/bbs_list.php?id=" + zboardId, zboardId),
                postId: zboardNo
            };
        }
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
    return ppomppuBuildBoardUrl(boardId);
};

function ppomppuFetchMenuData(url) {
    var response = fetchWithLogging(url, buildFetchOptions());
    if (!response) {
        throw new Error("Failed to fetch " + url + " (0)");
    }
    if (!response.ok) {
        throw new Error("Failed to fetch " + url + " (" + (response.status || 0) + ")");
    }
    var body = response.text();
    try {
        return JSON.parse(body);
    } catch (e) {
        throw new Error("Failed to parse " + url);
    }
}

SITE.loadDynamicBoards = function (options) {
    var allowNetwork = !(options && options.allowNetwork === false);
    var force = !!(options && options.force);
    var cacheKey = CACHE_PREFIX + "dynamic:ppomppu:v6";
    var cacheTsKey = cacheKey + ":ts";
    var cached = readStoredJson(cacheKey, []);
    var cachedTs = parseInt(String(localStorage.getItem(cacheTsKey) || "0"), 10) || 0;
    if (!force && Array.isArray(cached) && cached.length > 0 && (Date.now() - cachedTs) < 21600000) {
        return cached;
    }
    if (!allowNetwork) return Array.isArray(cached) ? cached : [];
    try {
        var sourceUrl = "https://" + SYNURA.domain + "/new/_ajax_menu_list.php";
        var data = ppomppuFetchMenuData(sourceUrl);
        var items = ppomppuBuildBoardsFromMenuData(data, { dynamic: true });
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
function ppomppuDecodeFetchText(response) {
    if (!response) return "";
    try {
        return new TextDecoder("euc-kr").decode(response.arrayBuffer());
    } catch (e) {
    }
    return response.text();
}

function ppomppuShouldDecodeUrl(url) {
    var normalized = normalizeUrl(url) || ensureAbsoluteUrl(url, SITE.browserHomeUrl) || "";
    var urlInfo = parseAbsoluteUrl(normalized);
    return !!(urlInfo && isKnownHost(urlInfo.host));
}

var ppomppuOriginalFetchWithLogging = fetchWithLogging;
fetchWithLogging = function (url, options) {
    var response = ppomppuOriginalFetchWithLogging(url, options);
    if (!response || !ppomppuShouldDecodeUrl(url) || response.__ppomppuDecoded) {
        return response;
    }

    var originalText = typeof response.text === "function" ? response.text : null;
    var decodedText = null;
    var decodedDoc = null;
    response.text = function () {
        if (decodedText === null) {
            decodedText = ppomppuDecodeFetchText({
                arrayBuffer: function () {
                    return response.arrayBuffer();
                },
                text: function () {
                    return originalText ? originalText.call(response) : "";
                }
            });
        }
        return decodedText;
    };
    response.dom = function (contentType) {
        if (!decodedDoc || (contentType && contentType !== "text/html")) {
            decodedDoc = (new DOMParser()).parseFromString(response.text(), contentType || "text/html");
        }
        return decodedDoc;
    };
    response.__ppomppuDecoded = true;
    return response;
};

function ppomppuPreviewLinkMap(root, baseUrl) {
    var out = {};
    if (!root || !root.querySelectorAll) return out;

    var previewAnchors = root.querySelectorAll("a.scrap_bx_href");
    for (var i = 0; i < previewAnchors.length; i++) {
        var href = ensureAbsoluteUrl(attrOf(previewAnchors[i], "href"), baseUrl);
        if (href) out[href] = true;
    }
    return out;
}

var ppomppuOriginalParseDetails = parseDetails;
parseDetails = function (element, baseUrl) {
    var previewLinks = ppomppuPreviewLinkMap(element, baseUrl);
    var details = ppomppuOriginalParseDetails(element, baseUrl);
    if (!details || details.length === 0) return details;

    var filtered = [];
    for (var i = 0; i < details.length; i++) {
        var item = details[i];
        var itemLink = ensureAbsoluteUrl(item && (item.link || item.value), baseUrl);
        if (item && item.type === "link" && itemLink && previewLinks[itemLink]) continue;
        filtered.push(item);
    }
    return filtered;
};

function formatPpomppuCommentDate(value) {
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

SITE.parseComments = function (doc, postUrl) {
    var comments = parseGenericComments(doc, postUrl);
    for (var i = 0; i < comments.length; i++) {
        comments[i].date = formatPpomppuCommentDate(comments[i].date);
    }
    return comments;
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
    domain: "m.ppomppu.co.kr",
    name: "ppomppu",
    description: "Unofficial Synura extension for Ppomppu mobile boards.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://m.ppomppu.co.kr/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = ["(?:bbs_view|zboard/view)\\.php\\?[^#]*\\bno="];
var LIST_LINK_SELECTORS = ["a.noeffect","a.list_b_01n","a[href*='bbs_view.php']"];
var LIST_TITLE_SELECTORS = [".thumb_sec strong",".title .cont",".cont",".list_b_01n"];
var LIST_AUTHOR_SELECTORS = [".names",".name",".writer"];
var LIST_AVATAR_SELECTORS = [];
var LIST_DATE_SELECTORS = ["time",".date",".time",".hi"];
var LIST_COMMENT_COUNT_SELECTORS = [".rp",".reply"];
var LIST_VIEW_COUNT_SELECTORS = [".hit",".view"];
var LIST_LIKE_COUNT_SELECTORS = [".recs",".rec",".recom",".recommend"];
var LIST_CATEGORY_SELECTORS = [".names",".title .cate",".cate"];
var LIST_IMAGE_SELECTORS = [".thumb_img",".thmb_N img","img"];
function ppomppuSplitListMeta(value) {
    var text = normalizeWhitespace(value);
    var matched = text.match(/^\[([^\]]+)\]\s*(.*)$/);
    if (!matched) {
        return {
            category: "",
            author: text
        };
    }
    return {
        category: normalizeWhitespace(matched[1]),
        author: normalizeWhitespace(matched[2])
    };
}

function ppomppuTrimTrailingCount(title, count) {
    var text = normalizeWhitespace(title);
    var commentCount = normalizeWhitespace(count);
    if (!text || !commentCount) return text;
    var suffix = " " + commentCount;
    if (text.length > suffix.length && text.slice(-suffix.length) === suffix) {
        return normalizeWhitespace(text.slice(0, -suffix.length));
    }
    return text;
}

function extractListItem(row, baseUrl) {
    var linkNode = firstNode(row, LIST_LINK_SELECTORS);
    var titleNode = firstNode(row, LIST_TITLE_SELECTORS);
    var link = extractListLink(row, baseUrl, LIST_LINK_SELECTORS, LIST_LINK_ALLOW_PATTERNS);
    if (!link) return null;

    var commentCount = hideZeroCount(parseCount(firstText(row, LIST_COMMENT_COUNT_SELECTORS)));
    var viewCount = parseCount(firstText(row, LIST_VIEW_COUNT_SELECTORS));
    var likeCount = hideZeroCount(parseCount(firstText(row, LIST_LIKE_COUNT_SELECTORS)));
    var date = firstText(row, LIST_DATE_SELECTORS);
    var author = firstAuthorText(row, LIST_AUTHOR_SELECTORS);
    var category = firstText(row, LIST_CATEGORY_SELECTORS);
    var namesMeta = firstText(row, [".names"]);
    if (namesMeta) {
        var splitMeta = ppomppuSplitListMeta(namesMeta);
        if (splitMeta.category) category = splitMeta.category;
        if (splitMeta.author) author = splitMeta.author;
    }

    var title = firstNonEmpty([
        textOfNodeWithoutSelectors(titleNode, LIST_COMMENT_COUNT_SELECTORS),
        textOf(linkNode),
        textOf(row)
    ]);
    title = ppomppuTrimTrailingCount(title, commentCount);
    if (!title) return null;

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
        date: date,
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
