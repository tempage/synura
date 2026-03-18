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
  "hasFullBoardCatalog": true,
  "supportsBoardCatalogSync": true,
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
  "defaultShowMediaBoardIds": [
    "ppomppu",
    "ppomppu4",
    "ppomppu8",
    "freeboard"
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
  "hotThreshold": 1000,
  "coldThreshold": 8,
  "commentHotThreshold": 5,
  "commentColdThreshold": 3,
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
    context.lastPostId = ppomppuComputeLastPostId(items);
    return context;
};
SITE.filterAppendItems = function (items, state, routeContext) {
    return ppomppuFilterAppendByLastPostId(items, state ? state.lastPostId : 0);
};
SITE.updateAppendState = function (state, items, routeContext) {
    state.lastPostId = ppomppuNextLastPostId(state ? state.lastPostId : 0, items);
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
function ppomppuEscapeRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ppomppuExtractTagBlock(html, startIndex, tagName) {
    var source = String(html || "");
    var lower = source.toLowerCase();
    var tag = String(tagName || "").toLowerCase();
    var openToken = "<" + tag;
    var closeToken = "</" + tag + ">";
    var start = lower.indexOf(openToken, Math.max(0, startIndex || 0));
    if (start < 0) return "";

    var openEnd = lower.indexOf(">", start);
    if (openEnd < 0) return source.slice(start);

    var depth = 1;
    var cursor = openEnd + 1;
    while (depth > 0) {
        var nextOpen = lower.indexOf(openToken, cursor);
        var nextClose = lower.indexOf(closeToken, cursor);
        if (nextClose < 0) return source.slice(start);

        if (nextOpen >= 0 && nextOpen < nextClose) {
            var nextTagChar = lower.charAt(nextOpen + openToken.length);
            if (/[>\s/]/.test(nextTagChar || "")) {
                var nextOpenEnd = lower.indexOf(">", nextOpen);
                if (nextOpenEnd < 0) return source.slice(start);
                depth += 1;
                cursor = nextOpenEnd + 1;
                continue;
            }
            cursor = nextOpen + openToken.length;
            continue;
        }

        depth -= 1;
        cursor = nextClose + closeToken.length;
    }

    return source.slice(start, cursor);
}

function ppomppuExtractFirstTag(html, tagName) {
    var match = new RegExp("<" + String(tagName || "") + "\\b[^>]*>", "i").exec(String(html || ""));
    return match ? ppomppuExtractTagBlock(html, match.index, tagName) : "";
}

function ppomppuExtractTagById(html, tagName, id) {
    var pattern = new RegExp("<" + String(tagName || "") + "\\b(?=[^>]*\\bid=[\"']" + ppomppuEscapeRegExp(id) + "[\"'])[^>]*>", "i");
    var match = pattern.exec(String(html || ""));
    return match ? ppomppuExtractTagBlock(html, match.index, tagName) : "";
}

function ppomppuExtractTagByClasses(html, tagName, classNames) {
    var pattern = "<" + String(tagName || "");
    var classes = Array.isArray(classNames) ? classNames : [];
    for (var i = 0; i < classes.length; i++) {
        var className = normalizeWhitespace(classes[i]);
        if (!className) continue;
        pattern += "(?=[^>]*\\bclass=[\"'][^\"']*\\b" + ppomppuEscapeRegExp(className) + "\\b[^\"']*[\"'])";
    }
    pattern += "[^>]*>";
    var match = new RegExp(pattern, "i").exec(String(html || ""));
    return match ? ppomppuExtractTagBlock(html, match.index, tagName) : "";
}

function ppomppuParseFragmentRoot(fragment) {
    try {
        var doc = (new DOMParser()).parseFromString("<div id='ppomppu-fragment-root'>" + String(fragment || "") + "</div>", "text/html");
        return doc.querySelector("#ppomppu-fragment-root") || doc.body;
    } catch (e) {
        return null;
    }
}

var PPOMPPU_LIST_ROOT_PREFIXES = [
    "<ul class=\"bbsList_new\"",
    "<ul class='bbsList_new'"
];
var PPOMPPU_BOARD_LINK_FALLBACK_SELECTORS = [
    "a.noeffect",
    "a[href*='bbs_view.php']",
    "a[href*='zboard/view.php']"
];
var PPOMPPU_BOARD_TITLE_FALLBACK_SELECTORS = [".thumb_sec strong", "span.cont"];
var PPOMPPU_BOARD_COMMENT_FALLBACK_SELECTORS = [".rp", ".reply"];
var PPOMPPU_BOARD_VIEW_FALLBACK_SELECTORS = [".view", ".hit"];
var PPOMPPU_BOARD_LIKE_FALLBACK_SELECTORS = [".recs", ".rec", ".recom", ".recommend"];
var PPOMPPU_BOARD_DATE_FALLBACK_SELECTORS = ["time", ".hi", ".date", ".time"];
var PPOMPPU_BOARD_NAME_FALLBACK_SELECTORS = [".names", ".name", ".writer"];
var PPOMPPU_BOARD_IMAGE_FALLBACK_SELECTORS = [".thmb_N > img", ".thumb_img", "img"];
var PPOMPPU_BOARD_REFRESH_HTMLS = {};

function ppomppuQueryFirst(root, selectors) {
    if (!root || !root.querySelector) return null;
    var list = Array.isArray(selectors) ? selectors : [selectors];
    for (var i = 0; i < list.length; i++) {
        var selector = list[i];
        if (!selector) continue;
        var node = root.querySelector(selector);
        if (node) return node;
    }
    return null;
}

function ppomppuQueryAllFirst(root, selectors) {
    if (!root || !root.querySelectorAll) return [];
    var list = Array.isArray(selectors) ? selectors : [selectors];
    for (var i = 0; i < list.length; i++) {
        var selector = list[i];
        if (!selector) continue;
        var nodes = root.querySelectorAll(selector);
        if (nodes && nodes.length > 0) return nodes;
    }
    return [];
}

function ppomppuHasClass(node, className) {
    var token = normalizeWhitespace(className);
    if (!node || !token) return false;
    return (" " + String(node.className || "") + " ").indexOf(" " + token + " ") >= 0;
}

function ppomppuDirectChild(root, tagName, className) {
    var children = root && root.children ? root.children : [];
    var tag = normalizeWhitespace(tagName).toUpperCase();
    var cls = normalizeWhitespace(className);
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child) continue;
        if (tag && String(child.tagName || "").toUpperCase() !== tag) continue;
        if (cls && !ppomppuHasClass(child, cls)) continue;
        return child;
    }
    return null;
}

function ppomppuReadBoardRefreshHtml(url) {
    var key = normalizeUrl(url) || String(url || "");
    return key && PPOMPPU_BOARD_REFRESH_HTMLS[key]
        ? String(PPOMPPU_BOARD_REFRESH_HTMLS[key])
        : "";
}

function ppomppuWriteBoardRefreshHtml(url, html) {
    var key = normalizeUrl(url) || String(url || "");
    if (!key || !html) return;
    PPOMPPU_BOARD_REFRESH_HTMLS[key] = String(html);
}

function ppomppuFetchHtmlPage(url, allowRestricted) {
    var response = fetchWithLogging(url, buildFetchOptions());
    if (!response) {
        throw new Error("Failed to fetch " + url + " (0)");
    }

    var status = response.status || 0;
    var html = response.text();
    var authRequired = shouldUseBrowserCookieAuth() && isAuthRequiredResponse(url, status, html);
    var restricted = !response.ok && (status === 401 || status === 403) && !isChallengeHtml(html);
    if (authRequired) {
        throw makeAuthRequiredError(url, status);
    }
    if (!response.ok && !(allowRestricted && restricted)) {
        throw new Error("Failed to fetch " + url + " (" + status + ")");
    }

    return {
        response: response,
        html: html,
        restricted: restricted
    };
}

function ppomppuMetaContent(html, property) {
    var pattern = new RegExp("<meta[^>]+(?:property|name)=[\"']" + ppomppuEscapeRegExp(property) + "[\"'][^>]+content=[\"']([^\"']*)[\"'][^>]*>", "i");
    var matched = String(html || "").match(pattern);
    return normalizeWhitespace(matched && matched[1] ? matched[1] : "");
}

function ppomppuListHtmlFromHtml(html) {
    var source = String(html || "");
    for (var i = 0; i < PPOMPPU_LIST_ROOT_PREFIXES.length; i++) {
        var start = source.indexOf(PPOMPPU_LIST_ROOT_PREFIXES[i]);
        if (start >= 0) {
            return ppomppuExtractTagBlock(source, start, "ul");
        }
    }
    return ppomppuExtractTagByClasses(source, "ul", ["bbsList_new"]);
}

function ppomppuListRootFromHtml(html) {
    var listHtml = ppomppuListHtmlFromHtml(html);
    return listHtml ? ppomppuParseFragmentRoot(listHtml) : null;
}

function ppomppuBoardListNode(root) {
    if (!root) return null;
    if (String(root.tagName || "").toUpperCase() === "UL" && ppomppuHasClass(root, "bbsList_new")) {
        return root;
    }
    return ppomppuDirectChild(root, "ul", "bbsList_new")
        || root.querySelector("ul.bbsList_new")
        || null;
}

function ppomppuListRowElements(listRoot) {
    listRoot = ppomppuBoardListNode(listRoot) || listRoot;
    var queryRows = listRoot && listRoot.querySelectorAll ? listRoot.querySelectorAll("li.bbs_list_thumbnail") : [];
    if (queryRows && queryRows.length > 0) {
        return queryRows;
    }
    var rows = [];
    var children = listRoot && listRoot.children ? listRoot.children : [];
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child || !child.querySelector) continue;
        if (!/\bbbs_list_thumbnail\b/.test(" " + String(child.className || "") + " ")) continue;
        rows.push(child);
    }
    return rows;
}

function ppomppuIsBoardAdRow(row) {
    return !!(row && ppomppuHasClass(row, "hotpop_bg_color"));
}

function ppomppuExtractBoardItems(listRoot, baseUrl) {
    var rows = ppomppuListRowElements(listRoot);
    var items = [];
    var seen = {};
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (ppomppuIsBoardAdRow(row)) continue;
        var linkNode = ppomppuDirectChild(row, "a", "list_b_01n")
            || row.querySelector("a.list_b_01n")
            || ppomppuQueryFirst(row, PPOMPPU_BOARD_LINK_FALLBACK_SELECTORS);
        var link = ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl);
        if (!isAllowedListLink(link, LIST_LINK_ALLOW_PATTERNS) || seen[link]) continue;

        var thumbNode = ppomppuDirectChild(linkNode, "div", "thmb_N");
        var bodyNode = ppomppuDirectChild(linkNode, "div", "thmb_N2")
            || linkNode.querySelector(".thmb_N2")
            || linkNode;
        var bodyListNode = ppomppuDirectChild(bodyNode, "ul", "");
        var titleRoot = ppomppuDirectChild(bodyListNode, "li", "title") || bodyNode.querySelector(".title");
        var metaNode = ppomppuDirectChild(bodyListNode, "li", "exp") || bodyNode.querySelector(".exp") || bodyNode;
        var namesNode = ppomppuDirectChild(bodyListNode, "li", "names")
            || (bodyListNode && ppomppuDirectChild(bodyListNode, "li", "name"))
            || bodyNode.querySelector(".names")
            || ppomppuQueryFirst(bodyNode, PPOMPPU_BOARD_NAME_FALLBACK_SELECTORS);
        var recViewNode = metaNode !== bodyNode
            ? (ppomppuDirectChild(metaNode, "span", "rec_view") || metaNode.querySelector(".rec_view"))
            : null;
        var titleNode = (titleRoot && (ppomppuDirectChild(titleRoot, "span", "cont") || titleRoot.querySelector(".cont")))
            || ppomppuQueryFirst(bodyNode, PPOMPPU_BOARD_TITLE_FALLBACK_SELECTORS);
        var commentNode = (titleRoot && (ppomppuDirectChild(titleRoot, "span", "rp") || titleRoot.querySelector(".rp")))
            || ppomppuQueryFirst(bodyNode, PPOMPPU_BOARD_COMMENT_FALLBACK_SELECTORS);
        var viewNode = (recViewNode && (ppomppuDirectChild(recViewNode, "span", "view") || recViewNode.querySelector(".view")))
            || ppomppuQueryFirst(recViewNode, [".hit"])
            || ppomppuQueryFirst(bodyNode, PPOMPPU_BOARD_VIEW_FALLBACK_SELECTORS);
        var likeNode = (recViewNode && (ppomppuDirectChild(recViewNode, "span", "recs") || recViewNode.querySelector(".recs")))
            || ppomppuQueryFirst(recViewNode, [".rec", ".recom", ".recommend"])
            || ppomppuQueryFirst(bodyNode, PPOMPPU_BOARD_LIKE_FALLBACK_SELECTORS);
        var dateNode = ppomppuDirectChild(metaNode, "time", "")
            || metaNode.querySelector("time")
            || ppomppuQueryFirst(metaNode, PPOMPPU_BOARD_DATE_FALLBACK_SELECTORS);
        var imageNode = (thumbNode && ppomppuDirectChild(thumbNode, "img", ""))
            || linkNode.querySelector(".thmb_N > img")
            || ppomppuQueryFirst(linkNode, PPOMPPU_BOARD_IMAGE_FALLBACK_SELECTORS);

        var namesMeta = textOf(namesNode);
        var splitMeta = ppomppuSplitListMeta(namesMeta);
        var commentCount = hideZeroCount(parseCount(textOf(commentNode)));
        var likeCount = hideZeroCount(parseCount(textOf(likeNode)));
        var viewCount = parseCount(textOf(viewNode));
        var title = textOf(titleNode);
        if (!title) title = textOf(linkNode);
        if (!title) title = textOf(row);
        title = ppomppuTrimTrailingCount(title, commentCount);
        if (!title) continue;

        var mediaUrl = imageUrlFromNode(imageNode, baseUrl);
        var types = [];
        if (mediaUrl) types.push("image");
        var postId = ppomppuExtractPostIdFromUrl(link);

        seen[link] = true;
        items.push({
            link: normalizeUrl(link) || link,
            postId: postId,
            title: title,
            author: splitMeta.author,
            avatar: "",
            date: textOf(dateNode),
            category: formatBoardListCategory(splitMeta.category),
            commentCount: commentCount,
            viewCount: viewCount,
            likeCount: likeCount,
            mediaUrl: mediaUrl,
            mediaType: mediaUrl ? "image" : "",
            types: types,
            menus: [],
            hotCount: toInt(viewCount || likeCount || commentCount, 0),
            coldCount: toInt(likeCount || commentCount, 0)
        });
    }
    return items;
}

function ppomppuExtractPostIdFromUrl(url) {
    var normalized = normalizeUrl(url) || ensureAbsoluteUrl(url, SITE.browserHomeUrl) || "";
    var urlInfo = parseAbsoluteUrl(normalized);
    if (!urlInfo) return "";
    return normalizeWhitespace(queryValue(urlInfo.query, "no"));
}

function ppomppuItemPostId(item) {
    var direct = normalizeWhitespace(item && item.postId || "");
    if (direct) return direct;
    return ppomppuExtractPostIdFromUrl(item && item.link || "");
}

function ppomppuComputeLastPostId(items) {
    // Pinned notices can carry much older ids than the actual page rows.
    // Use the trailing row as the append cursor so page-to-page overlap works.
    for (var i = (items || []).length - 1; i >= 0; i--) {
        var id = parseInt(ppomppuItemPostId(items[i]), 10);
        if (id > 0) {
            return id;
        }
    }
    return 0;
}

function ppomppuFilterAppendByLastPostId(items, lastPostId) {
    if (!(lastPostId > 0)) return items || [];

    var out = [];
    for (var i = 0; i < (items || []).length; i++) {
        var item = items[i];
        var id = parseInt(ppomppuItemPostId(item), 10);
        if (!(id > 0) || id < lastPostId) {
            out.push(item);
        }
    }
    return out;
}

function ppomppuNextLastPostId(currentLastPostId, items) {
    var appendedLastPostId = ppomppuComputeLastPostId(items);
    if (!(appendedLastPostId > 0)) return currentLastPostId || 0;
    if (currentLastPostId > 0) return Math.min(currentLastPostId, appendedLastPostId);
    return appendedLastPostId;
}

function ppomppuBuildPostFragment(html) {
    var viewHtml = ppomppuExtractTagByClasses(html, "div", ["bbs", "view"]);
    if (!viewHtml) return "";

    var fragments = [];
    var headerHtml = ppomppuExtractFirstTag(viewHtml, "h4");
    var contentHtml = ppomppuExtractTagById(viewHtml, "div", "KH_Content");
    var commentsHtml = ppomppuExtractTagById(viewHtml, "div", "cmAr");

    if (headerHtml) fragments.push(headerHtml);
    if (contentHtml) fragments.push(contentHtml);
    if (commentsHtml) fragments.push(commentsHtml);

    return fragments.join("");
}

function ppomppuBuildBoardRouteFromItems(url, match, items) {
    if (!items || items.length === 0) return null;

    var nextUrl = SITE.buildNextPageUrl(match, url, (match.page || 1) + 1);
    var seenLinks = [];
    for (var i = 0; i < items.length; i++) {
        seenLinks.push(items[i].link);
    }

    var context = {
        kind: "board",
        link: url,
        boardId: match.board ? match.board.id : "",
        boardTitle: match.board ? match.board.title : "",
        boardUrl: match.board ? match.board.url : "",
        title: match.board ? match.board.title : SITE.displayName,
        page: match.page || 1,
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
            styles: buildBoardListStyles(context.title, match ? match.board : null, nextUrl),
            models: {
                contents: items,
                menus: getBoardMenus(context)
            }
        },
        context: context
    };
}

function ppomppuBuildBoardRouteFromHtml(url, match, html) {
    var listHtml = ppomppuListHtmlFromHtml(html);
    if (!listHtml) return null;
    var listRoot = ppomppuParseFragmentRoot(listHtml);
    if (!listRoot) return null;
    var items = ppomppuExtractBoardItems(listRoot, url);
    var route = ppomppuBuildBoardRouteFromItems(url, match, items);
    if (route) {
        ppomppuWriteBoardRefreshHtml(url, listHtml);
    }
    return route;
}

function ppomppuBuildBoardRoute(url, match) {
    var fetched = ppomppuFetchHtmlPage(url, false);
    return ppomppuBuildBoardRouteFromHtml(url, match, fetched.html);
}

function ppomppuAppendFastText(details, value) {
    var text = normalizeWhitespace(value);
    if (!text) return;
    var last = details.length > 0 ? details[details.length - 1] : null;
    if (last && last.type === "text") {
        last.value = normalizeWhitespace(last.value + "\n" + text);
        return;
    }
    details.push({ type: "text", value: text });
}

function ppomppuParsePostContentFast(contentRoot, baseUrl) {
    if (!contentRoot) return [];

    var details = [];
    var seenImages = {};
    var children = contentRoot.childNodes || [];
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child) continue;

        if (child.nodeType === 3) {
            ppomppuAppendFastText(details, child.textContent || "");
            continue;
        }
        if (child.nodeType !== 1) continue;

        var className = " " + normalizeWhitespace(child.className || "") + " ";
        if (className.indexOf(" scrap_bx ") >= 0 || className.indexOf(" scrap_bx_txt ") >= 0) continue;
        if (String(child.tagName || "").toUpperCase() === "A" && className.indexOf(" scrap_bx_href ") >= 0) continue;

        var images = [];
        if (String(child.tagName || "").toUpperCase() === "IMG") {
            images = [child];
        } else if (child.querySelectorAll) {
            images = ppomppuQueryAllFirst(child, [
                "img[src]",
                "img[data-src]",
                "img[data-original]",
                "img[data-lazy-src]"
            ]);
        }
        for (var j = 0; j < images.length; j++) {
            var imageUrl = ensureAbsoluteUrl(firstNonEmpty([
                attrOf(images[j], "data-original"),
                attrOf(images[j], "data-src"),
                attrOf(images[j], "data-lazy-src"),
                attrOf(images[j], "src")
            ]), baseUrl);
            if (!imageUrl || seenImages[imageUrl]) continue;
            seenImages[imageUrl] = true;
            details.push({
                type: "image",
                value: imageUrl,
                title: attrOf(images[j], "title"),
                alt: attrOf(images[j], "alt"),
                ariaLabel: attrOf(images[j], "aria-label")
            });
        }

        var text = "";
        if (String(child.tagName || "").toUpperCase() === "P") {
            var paragraphImages = child.querySelectorAll ? child.querySelectorAll("img") : [];
            if (!paragraphImages || paragraphImages.length === 0) {
                text = child.textContent || "";
            } else {
                text = normalizeWhitespace((child.textContent || "").replace(/\u00a0/g, " "));
            }
        } else if (String(child.tagName || "").toUpperCase() !== "IMG") {
            text = child.textContent || "";
        }
        ppomppuAppendFastText(details, text);
    }

    return details;
}

function ppomppuBuildPostRoute(url, match) {
    var fetched = ppomppuFetchHtmlPage(url, true);
    var fragment = ppomppuBuildPostFragment(fetched.html);
    if (!fragment) return null;

    var root = ppomppuParseFragmentRoot(fragment);
    if (!root) return null;

    var contentRoot = ppomppuQueryFirst(root, [
        "#KH_Content",
        ".viAr",
        ".board-contents",
        ".board_contents",
        ".view_content"
    ]);
    var content = contentRoot ? parseDetails(contentRoot, url) : [];
    if ((!content || content.length === 0) && contentRoot) {
        content = parseMarkupDetails(String(contentRoot.innerHTML || ""), url);
    }
    try {
        if (SITE.filterPostContent) content = SITE.filterPostContent(content, url, root, fetched, match) || content;
    } catch (e) {
    }

    var rememberedItem = getRememberedItemPreview(url);
    var comments = ppomppuParseComments(root, url);
    if (!content || content.length === 0) {
        content = [{
            type: "text",
            value: fetched.restricted ? "로그인이 필요합니다." : "본문을 가져오지 못했습니다."
        }];
    }

    var title = firstNonEmpty([
        cleanPageTitle(ppomppuMetaContent(fetched.html, "og:title")),
        rememberedItem ? cleanPageTitle(rememberedItem.title) : "",
        match.board ? match.board.title : "",
        SITE.displayName
    ]);
    var infoRoot = ppomppuQueryFirst(root, [".info"]);
    var author = firstNonEmpty([
        cleanSingleLineField(textOf((infoRoot && ppomppuQueryFirst(infoRoot, [".ct > a", ".ct"])) || ppomppuQueryFirst(root, [".info .ct a", ".info .ct"])), 80),
        rememberedItem ? rememberedItem.author : ""
    ]);
    var date = firstNonEmpty([
        cleanSingleLineField(textOf((infoRoot && ppomppuQueryFirst(infoRoot, [".hi"])) || ppomppuQueryFirst(root, [".hi"])), 40),
        rememberedItem ? rememberedItem.date : ""
    ]);
    var category = firstNonEmpty([
        cleanSingleLineField(textOf(ppomppuQueryFirst(root, [".subject_preface", ".cate"])), 60),
        rememberedItem ? rememberedItem.category : ""
    ]);
    var viewCount = firstNonEmpty([
        parseCount(firstNonEmpty([
            textOf((infoRoot && ppomppuQueryFirst(infoRoot, [".view"])) || ppomppuQueryFirst(root, [".view"])),
            (fragment.match(/조회\s*:\s*([0-9,]+)/) || [])[1]
        ])),
        rememberedItem ? rememberedItem.viewCount : ""
    ]);
    var likeCount = hideZeroCount(firstNonEmpty([
        parseCount(textOf(ppomppuQueryFirst(root, ["#vote_list_btn_txt", ".top_recommend_area", ".recommend"]))),
        rememberedItem ? rememberedItem.likeCount : ""
    ]));

    return {
        kind: "post",
        url: url,
        viewData: {
            view: "/views/post",
            styles: {
                title: title,
                menu: true
            },
            models: {
                author: author,
                avatar: rememberedItem ? rememberedItem.avatar : "",
                date: date,
                category: category,
                viewCount: viewCount,
                likeCount: likeCount,
                content: content,
                comments: comments,
                link: url,
                menus: getPostMenus(match),
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

SITE.routeBoardCustom = function (url, urlInfo, match, force) {
    return ppomppuBuildBoardRoute(url, match);
};

SITE.refreshView = function (viewId, state) {
    if (!state || state.kind !== "board" || !state.link) return false;

    var url = normalizeUrl(state.link);
    var urlInfo = parseAbsoluteUrl(url);
    var match = urlInfo ? SITE.matchBoard(urlInfo) : null;
    if (!url || !urlInfo || !match) return false;

    var fetched = ppomppuFetchHtmlPage(url, false);
    var nextListHtml = ppomppuListHtmlFromHtml(fetched.html);
    if (!nextListHtml) return false;

    var previousListHtml = ppomppuReadBoardRefreshHtml(url);
    if (previousListHtml && nextListHtml === previousListHtml) {
        ppomppuWriteBoardRefreshHtml(url, nextListHtml);
        setViewState(viewId, state);
        synura.update(viewId, { models: { snackbar: "새로고침 완료" } });
        return true;
    }

    var listRoot = ppomppuParseFragmentRoot(nextListHtml);
    if (!listRoot) return false;

    var route = ppomppuBuildBoardRouteFromItems(
        url,
        match,
        ppomppuExtractBoardItems(listRoot, url)
    );
    if (!route) {
        return false;
    }

    ppomppuWriteBoardRefreshHtml(url, nextListHtml);
    updateViewFromRoute(viewId, route, "새로고침 완료");
    return true;
};

SITE.routePostCustom = function (url, urlInfo, match, force) {
    return ppomppuBuildPostRoute(url, match);
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

function ppomppuParseComments(doc, postUrl) {
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
            date: formatPpomppuCommentDate(firstText(row, SITE.selectors.commentDate)),
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
    return ppomppuParseComments(doc, postUrl);
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
    description: "Unofficial Ppomppu extension",
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

    var commentCount = hideZeroCount(parseCount(firstText(row, commentCountSelectors)));
    var viewCount = parseCount(firstText(row, viewCountSelectors));
    var likeCount = hideZeroCount(parseCount(firstText(row, likeCountSelectors)));
    var date = firstText(row, dateSelectors);
    var author = firstAuthorText(row, authorSelectors);
    var category = firstText(row, categorySelectors);
    var namesMeta = firstText(row, [".names"]);
    if (namesMeta) {
        var splitMeta = ppomppuSplitListMeta(namesMeta);
        if (splitMeta.category) category = splitMeta.category;
        if (splitMeta.author) author = splitMeta.author;
    }

    var title = firstNonEmpty([
        textOfNodeWithoutSelectors(titleNode, commentCountSelectors),
        textOf(linkNode),
        textOf(row)
    ]);
    title = ppomppuTrimTrailingCount(title, commentCount);
    if (!title) return null;

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
        date: date,
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
