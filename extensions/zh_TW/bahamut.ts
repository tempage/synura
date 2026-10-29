// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "bahamut",
  "displayName": "巴哈姆特",
  "country": "Taiwan",
  "category": "gaming and acg forum",
  "browserHomeUrl": "https://forum.gamer.com.tw/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 5,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "看板",
  "boardSettingsTitle": "看板設定",
  "boardSettingsLargeThreshold": 128,
  "boardSettingsPageSize": 96,
  "boardAddMode": "url_title",
  "hasFullBoardCatalog": false,
  "supportsBoardCatalogSync": true,
  "maxDiscoveredBoards": 256,
  "defaultVisibleBoardIds": [
    "home"
  ],
  "hostAliases": [
    "gamer.com.tw"
  ],
  "acceptLanguage": "zh-TW,zh;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - 巴哈姆特",
    " | 巴哈姆特",
    " : 巴哈姆特"
  ],
  "isAuthRequiredResponse": function(url, status, html) {
    if (status === 401 || status === 403 || status === 429) return true;
    var body = String(html || "").toLowerCase();
    return (body.indexOf("just a moment") >= 0 && body.indexOf("cf_chl_opt") >= 0) ||
           body.indexOf("兒少保護警示") >= 0 ||
           body.indexOf("verify you are human") >= 0;
  },
  "boards": [
    {
      "id": "ns_switch",
      "title": "NS / Nintendo Switch",
      "url": "https://forum.gamer.com.tw/B.php?bsn=31587",
      "description": "Nintendo Switch 討論板",
      "group": "主機遊戲"
    },
    {
      "id": "playstation",
      "title": "PlayStation 綜合",
      "url": "https://forum.gamer.com.tw/B.php?bsn=60596",
      "description": "PS5 / PS4 / PS VR 討論板",
      "group": "主機遊戲"
    },
    {
      "id": "anime",
      "title": "動漫相關綜合",
      "url": "https://forum.gamer.com.tw/B.php?bsn=60037",
      "description": "動畫、漫畫與二次元資訊",
      "group": "動漫文化"
    },
    {
      "id": "pc_hardware",
      "title": "電腦應用綜合",
      "url": "https://forum.gamer.com.tw/B.php?bsn=60030",
      "description": "硬體配備、組裝與軟體",
      "group": "電腦硬體"
    },
    {
      "id": "monster_hunter",
      "title": "魔物獵人系列",
      "url": "https://forum.gamer.com.tw/B.php?bsn=5786",
      "description": "Monster Hunter 專板",
      "group": "熱門遊戲"
    }
  ],
  "selectors": {
    "boardTitle": [
      "title",
      ".b-head__title",
      "h1"
    ],
    "listRows": [
      "tr.b-list__row",
      ".b-list__row"
    ],
    "listLink": [
      "a.b-list__main__title",
      "a[href*='C.php?']"
    ],
    "listTitle": [
      "a.b-list__main__title"
    ],
    "listTitleExclude": [
      ".b-list__summary__mark",
      ".b-list__main__pages"
    ],
    "listAuthor": [
      ".b-list__count__user a",
      ".b-list__count__user"
    ],
    "listAvatar": [],
    "listDate": [
      ".b-list__time__edittime a",
      ".b-list__time__edittime"
    ],
    "listCommentCount": [
      ".b-list__count__number span"
    ],
    "listViewCount": [],
    "listLikeCount": [],
    "listCategory": [],
    "listImage": [],
    "postTitle": [
      ".c-post__header__title",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".c-post__header__author a",
      ".c-post__header__author"
    ],
    "postAvatar": [
      ".c-post__header__avatar img"
    ],
    "postDate": [
      ".edittime"
    ],
    "postViewCount": [],
    "postLikeCount": [],
    "postCategory": [],
    "postContent": [
      ".c-article__content",
      "article.c-article"
    ],
    "commentRows": [
      "article.c-article",
      ".c-section"
    ],
    "commentAuthor": [
      ".c-post__header__author a",
      ".c-post__header__author"
    ],
    "commentAvatar": [
      ".c-post__header__avatar img"
    ],
    "commentContent": [
      ".c-article__content"
    ],
    "commentDate": [
      ".edittime"
    ],
    "commentLikeCount": [],
    "commentLevel": []
  },
  "commentLevelAttrs": [
    "data-depth",
    "depth",
    "data-level"
  ],
  "useRawPostParse": true,
  "useRawPostParseInEmulator": true
};

var SYNURA = {
  domain: "forum.gamer.com.tw",
  name: "bahamut",
  author: "Synura Team",
  description: "forum.gamer.com.tw",
  version: 0.2,
  api: 0,
  license: "Apache-2.0",
  locale: "zh_TW",
  icon: "https://forum.gamer.com.tw/favicon.ico",
  bypass: "chrome/windows",
  deeplink: true,
  tags: [
    "taiwan",
    "acg",
    "gaming",
    "anime",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /C\.php\?.*bsn=/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='B.php?']"
];

function localQuerySelectorAll(root, selectors) {
  if (!root || !root.querySelectorAll) return [];
  var out = [];
  for (var i = 0; i < selectors.length; i++) {
    var selector = selectors[i];
    if (!selector) continue;
    var nodes = [];
    try {
      nodes = root.querySelectorAll(selector);
    } catch (e) {
      nodes = [];
    }
    if ((!nodes || nodes.length === 0) && /\[href\*=/.test(selector)) {
      nodes = localQueryHrefContains(root, selector);
    }
    for (var j = 0; j < nodes.length; j++) {
      if (out.indexOf(nodes[j]) < 0) out.push(nodes[j]);
    }
  }
  return out;
}

function localQueryHrefContains(root, selector) {
  var tagMatch = String(selector || "").match(/^([a-zA-Z0-9_-]*)/);
  var tagName = tagMatch && tagMatch[1] ? tagMatch[1] : "a";
  var needles = [];
  var regex = /\[href\*=(['"])(.*?)\1\]/g;
  var match;
  while ((match = regex.exec(String(selector || "")))) {
    if (match[2]) needles.push(match[2]);
  }
  if (!needles.length) return [];
  var nodes = [];
  try {
    nodes = root.querySelectorAll(tagName || "a");
  } catch (e) {
    nodes = [];
  }
  var out = [];
  for (var i = 0; i < nodes.length; i++) {
    var href = attrOf(nodes[i], "href");
    var ok = !!href;
    for (var j = 0; j < needles.length && ok; j++) {
      ok = href.indexOf(needles[j]) >= 0;
    }
    if (ok) out.push(nodes[i]);
  }
  return out;
}

function localPathAndQuery(url) {
  var match = String(url || "").split("#")[0].match(/^https?:\/\/[^\/?#]+([^#]*)$/i);
  return match ? (match[1] || "/") : String(url || "");
}

function localUrlFromInfo(info) {
  return (info.scheme || "https") + "://" + info.host + (info.path || "/") + (info.query ? "?" + info.query : "");
}

function localCanonicalizeUrl(url) {
  return String(url || "").split("#")[0];
}

function localLooksLikeAssetUrl(url) {
  return /\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js|json|xml|pdf|zip|rar|7z)(?:[?#]|$)/i.test(String(url || ""));
}

function localLooksLikeBadNav(url, title) {
  var sample = (String(url || "") + " " + String(title || "")).toLowerCase();
  return /(?:login|signin|signup|register|join|logout|privacy|terms|policy|affiliate|contact|about|help|search|rss|feed|download|app\b|oauth|account|member|members\/|profile|user\/|users\/|newsletter|settings)/i.test(sample);
}

function localLooksLikeCollectionUrl(url) {
  var path = localPathAndQuery(url).toLowerCase();
  if (path.indexOf("b.php?") >= 0) return true;
  return false;
}

function localLooksLikePostUrl(url) {
  var path = localPathAndQuery(url);
  for (var i = 0; i < LOCAL_POST_PATTERNS.length; i++) {
    if (LOCAL_POST_PATTERNS[i].test(path)) return true;
  }
  return false;
}

function localTitleFromNode(node) {
  var title = textOf(node);
  if (!title) title = attrOf(node, "title");
  if (!title) title = attrOf(node, "aria-label");
  return normalizeWhitespace(title);
}

function localTitleFromBoardUrl(url) {
  var bsn = (String(url || "").match(/[?&]bsn=(\d+)/i) || [])[1];
  if (bsn) return "Board " + bsn;
  return "Home";
}

function localBoardIdHash(value) {
  var text = String(value || "");
  var hash = 0;
  for (var i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

function localBoardIdFromUrl(url) {
  var bsn = (String(url || "").match(/[?&]bsn=(\d+)/i) || [])[1];
  if (bsn) return "bsn_" + bsn;
  return "home";
}

function localPostIdFromUrl(url) {
  var snA = (String(url || "").match(/[?&]snA=(\d+)/i) || [])[1];
  if (snA) return snA;
  var bsn = (String(url || "").match(/[?&]bsn=(\d+)/i) || [])[1];
  return (bsn ? (bsn + "_") : "") + localBoardIdHash(url);
}

function localFindConfiguredBoard(url) {
  var normalized = normalizeUrl(url) || url;
  var boards = SITE.boards || [];
  for (var i = 0; i < boards.length; i++) {
    var boardUrl = normalizeUrl(boards[i].url) || ensureAbsoluteUrl(boards[i].url, SITE.browserHomeUrl);
    if (boardUrl && boardUrl === normalized) return boardById(boards[i].id) || boards[i];
  }
  return null;
}

function localBoardForUrl(url) {
  var configured = localFindConfiguredBoard(url);
  if (configured) return configured;
  var bsn = (String(url || "").match(/[?&]bsn=(\d+)/i) || [])[1];
  var boardUrl = bsn ? ("https://forum.gamer.com.tw/B.php?bsn=" + bsn) : SITE.browserHomeUrl;
  return ensureBoard(localBoardIdFromUrl(boardUrl), boardUrl, localTitleFromBoardUrl(boardUrl));
}

function extractListItem(row, baseUrl) {
  if (!row) return null;
  var linkNode = firstNode(row, selectorList("listLink", [])) || (attrOf(row, "href") ? row : null);
  var link = linkNode ? (normalizeUrl(attrOf(linkNode, "href")) || ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl)) : "";
  link = localCanonicalizeUrl(link);
  if (!link || localLooksLikeAssetUrl(link) || !localLooksLikePostUrl(link)) return null;
  var title = firstNonEmpty([
    firstText(row, selectorList("listTitle", [])),
    localTitleFromNode(linkNode)
  ]);
  title = cleanPageTitle(title);
  if (!title || title.length < 2) return null;
  var commentCount = parseCount(firstText(row, selectorList("listCommentCount", [])));
  var author = firstAuthorText(row, selectorList("listAuthor", [])) || SITE.displayName;
  var date = firstText(row, selectorList("listDate", []));
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: author,
    avatar: "",
    date: date,
    category: "",
    commentCount: commentCount,
    viewCount: 0,
    likeCount: "",
    mediaUrl: "",
    mediaType: "",
    types: ["link"],
    menus: [],
    hotCount: toInt(commentCount, 0),
    coldCount: 0
  };
}

function localParseComments(doc, postUrl) {
  var seen = {};
  var out = [];
  var rows = allNodes(doc, selectorList("commentRows", []));
  var pageTitle = cleanPageTitle(firstText(doc, ["title"])).toLowerCase();
  for (var i = 0; i < rows.length && out.length < 50; i++) {
    var contentRoot = firstNode(rows[i], selectorList("commentContent", [])) || rows[i];
    var text = textOf(contentRoot);
    if (text.length < 1 || text.length > 4000) continue;
    var key = text.substring(0, 220).toLowerCase();
    if (!key || seen[key] || key === pageTitle) continue;
    seen[key] = true;
    var content = parseDetails(contentRoot, postUrl);
    if (!content || content.length === 0) content = [{ type: "text", value: text }];
    var author = firstAuthorText(rows[i], selectorList("commentAuthor", []));
    out.push({
      id: SITE.siteKey + ":comment:" + out.length,
      link: postUrl + "#comment-" + out.length,
      author: author,
      avatar: imageUrlFromNode(firstNode(rows[i], selectorList("commentAvatar", [])), postUrl),
      date: firstText(rows[i], selectorList("commentDate", [])),
      content: content,
      likeCount: "",
      dislikeCount: "",
      level: 0,
      menus: [MENU_BROWSER],
      hotCount: 0,
      coldCount: 0
    });
  }
  return out;
}

function localParseBoardItemsFromHtml(html, baseUrl) {
  var doc = new DOMParser().parseFromString(String(html || ""), "text/html");
  var rows = localQuerySelectorAll(doc, SITE.selectors.listRows || []);
  var items = [];
  var seen = {};
  for (var i = 0; i < rows.length; i++) {
    var item = extractListItem(rows[i], baseUrl);
    if (!item || !item.link || seen[item.link]) continue;
    seen[item.link] = true;
    items.push(item);
  }
  return items;
}

SITE.parseComments = function (doc, postUrl) {
  return localParseComments(doc, postUrl);
};

SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
  return localParseBoardItemsFromHtml(boardPage && boardPage.html ? boardPage.html : "", baseUrl);
};

SITE.parseBoardItemsFromHtml = function (html, baseUrl, match, boardPage) {
  return localParseBoardItemsFromHtml(html, baseUrl);
};

SITE.buildNextPageUrl = function (match, url, nextPage) {
  return setQueryParam(url, "page", nextPage);
};

SITE.buildPostFetchUrls = function (match, url) {
  var canonical = localCanonicalizeUrl(url);
  return canonical === url ? [url] : [canonical, url];
};

SITE.matchPost = function (info) {
  if (!info || !isKnownHost(info.host)) return null;
  var url = localCanonicalizeUrl(localUrlFromInfo(info));
  if (!localLooksLikePostUrl(url)) return null;
  return {
    board: localBoardForUrl(url),
    postId: localPostIdFromUrl(url),
    page: queryInt(info.query, "page", 1)
  };
};

SITE.matchBoard = function (info) {
  if (!info || !isKnownHost(info.host)) return null;
  var url = localUrlFromInfo(info);
  if (localLooksLikeAssetUrl(url) || localLooksLikePostUrl(url)) return null;
  var board = localFindConfiguredBoard(url) || ensureBoard(localBoardIdFromUrl(url), url, localTitleFromBoardUrl(url));
  return {
    board: board,
    page: queryInt(info.query, "page", 1)
  };
};
