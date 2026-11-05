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
    "postAuthor": [".c-post__header__author .username"],
    "postAvatar": [
      ".c-post__header__avatar img"
    ],
    "postDate": [
      ".edittime"
    ],
    "postViewCount": [],
    "postLikeCount": [],
    "postCategory": [],
    "postContent": [".c-article__content", "article.c-article"],
    "commentRows": ["section.c-section"],
    "commentAuthor": [".c-post__header__author .username"],
    "commentAvatar": [
      ".c-post__header__avatar img"
    ],
    "commentContent": [".c-article__content"],
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
  ]
};

var SYNURA = {
  domain: "forum.gamer.com.tw",
  name: "bahamut",
  author: "Synura Team",
  description: "forum.gamer.com.tw",
  version: 0.4,
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
      nodes = communityQueryAll(root, selector);
    } catch (e) {
      nodes = [];
    }
    for (var j = 0; j < nodes.length; j++) {
      if (out.indexOf(nodes[j]) < 0) out.push(nodes[j]);
    }
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
  if (!title) return null;
  var commentCount = parseCount(firstText(row, selectorList("listCommentCount", [])));
  var author = firstAuthorText(row, selectorList("listAuthor", []));
  var date = firstDateText(row, selectorList("listDate", []));
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
  var out = [];
  function append(row, body, author, date, id, level) {
    if (!body) return;
    var content = parseDetails(body, postUrl) || [];
    if (!content.length) return;
    out.push({ id: SITE.siteKey + ":" + id, link: postUrl + "#" + id,
      author: author, avatar: "", date: date, content: content, likeCount: "", dislikeCount: "",
      level: level, menus: [MENU_BROWSER], hotCount: 0, coldCount: 0 });
  }
  var rows = allNodes(doc, ["section.c-section"]).filter(function (row) {
    return !!firstNode(row, [".c-article__content"]);
  });
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (i > 0) append(row, firstNode(row, [".c-article__content"]),
      firstText(row, [".c-post__header__author .username"]),
      firstText(row, [".c-post__header__info .edittime"]), attrOf(row, "id") || "post-" + i, 0);
    var replies = allNodes(row, [".reply-content"]);
    for (var j = 0; j < replies.length; j++) {
      var reply = replies[j];
      var stamp = firstNode(reply, [".edittime[data-tippy-content]"]);
      append(reply, firstNode(reply, [".comment_content"]), firstText(reply, [".reply-content__user"]),
        textOf(stamp), "reply-" + i + "-" + j, 1);
    }
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
