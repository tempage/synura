// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "disp",
  "displayName": "Disp BBS",
  "country": "Taiwan",
  "category": "bbs and news forum",
  "browserHomeUrl": "https://disp.cc/b/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 6,
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
    "www.disp.cc"
  ],
  "acceptLanguage": "zh-TW,zh;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Disp BBS",
    " | Disp BBS",
    " : Disp BBS"
  ],
  "isAuthRequiredResponse": function(url, status, html) {
    if (status === 401 || status === 403 || status === 429) return true;
    var body = String(html || "").toLowerCase();
    return (body.indexOf("just a moment") >= 0 && body.indexOf("cf_chl_opt") >= 0) ||
           body.indexOf("checking your browser") >= 0 ||
           body.indexOf("verify you are human") >= 0;
  },
  "boards": [
    {
      "id": "gossiping",
      "title": "Gossiping (八卦板)",
      "url": "https://disp.cc/b/Gossiping",
      "description": "熱門新聞與時事八卦",
      "group": "熱門看板"
    },
    {
      "id": "c_chat",
      "title": "C_Chat (希洽板)",
      "url": "https://disp.cc/b/C_Chat",
      "description": "動漫畫與二次元討論",
      "group": "動漫遊戲"
    },
    {
      "id": "stock",
      "title": "Stock (股票板)",
      "url": "https://disp.cc/b/Stock",
      "description": "台灣與美股投資理財",
      "group": "生活財經"
    },
    {
      "id": "baseball",
      "title": "Baseball (棒球板)",
      "url": "https://disp.cc/b/Baseball",
      "description": "中職、美職、日職賽事",
      "group": "運動體育"
    },
    {
      "id": "lol",
      "title": "LoL (英雄聯盟板)",
      "url": "https://disp.cc/b/LoL",
      "description": "League of Legends 遊戲討論",
      "group": "動漫遊戲"
    },
    {
      "id": "beauty",
      "title": "Beauty (表特板)",
      "url": "https://disp.cc/b/Beauty",
      "description": "帥哥美女圖片分享",
      "group": "生活娛樂"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".text-board",
      "title"
    ],
    "listRows": [
      ".listTitle",
      "span.listTitle"
    ],
    "listLink": [
      "a[href*='/b/']"
    ],
    "listTitle": [
      ".titleColor",
      "a"
    ],
    "listTitleExclude": [],
    "listAuthor": [],
    "listAvatar": [],
    "listDate": [],
    "listCommentCount": [],
    "listViewCount": [],
    "listLikeCount": [],
    "listCategory": [],
    "listImage": [],
    "postTitle": [
      ".text-title",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".text-author a",
      ".text-author"
    ],
    "postAvatar": [],
    "postDate": [
      ".text-time"
    ],
    "postViewCount": [],
    "postLikeCount": [],
    "postCategory": [
      ".text-board"
    ],
    "postContent": [
      "#text .text_css",
      "#text"
    ],
    "commentRows": [
      ".ptt-push-group",
      ".push_row"
    ],
    "commentAuthor": [
      ".pushAuthor",
      ".ptt-push-author"
    ],
    "commentAvatar": [],
    "commentContent": [
      ".pushContent",
      ".ptt-push-content"
    ],
    "commentDate": [],
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
  domain: "disp.cc",
  name: "disp",
  author: "Synura Team",
  description: "disp.cc",
  version: 0.1,
  api: 0,
  license: "Apache-2.0",
  locale: "zh_TW",
  icon: "https://disp.cc/favicon3.ico",
  bypass: "chrome/windows",
  deeplink: true,
  tags: [
    "taiwan",
    "ptt",
    "bbs",
    "news",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/b\/[A-Za-z0-9_-]+\/[A-Za-z0-9]+/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='/b/']"
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
  if (localLooksLikePostUrl(url)) return false;
  if (path.indexOf("/b/") >= 0) return true;
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
  return normalizeWhitespace(title).replace(/^[■\s]+/, "");
}

function localTitleFromBoardUrl(url) {
  var path = localPathAndQuery(url).split("?")[0].replace(/\/+$/, "");
  var parts = path.split("/");
  for (var i = parts.length - 1; i >= 0; i--) {
    var value = normalizeWhitespace(parts[i]).replace(/[-_]+/g, " ");
    if (value && value !== "b") return value;
  }
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
  var path = localPathAndQuery(url).split("?")[0].replace(/\/+$/, "");
  var parts = path.split("/");
  var slug = "";
  for (var i = 0; i < parts.length; i++) {
    var part = normalizeWhitespace(parts[i]).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    if (part && part !== "b") slug = part;
  }
  if (!slug) slug = "home";
  return slug.substring(0, 24) + "_" + localBoardIdHash(url);
}

function localPostIdFromUrl(url) {
  var match = String(url || "").match(/\/b\/[A-Za-z0-9_-]+\/([A-Za-z0-9]+)/i);
  if (match) return match[1];
  return localBoardIdHash(url);
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
  var info = parseAbsoluteUrl(url);
  var path = info ? info.path : "/";
  var parentPath = path.replace(/\/[^\/]*$/, "");
  if (!parentPath || parentPath === path) parentPath = "/b/";
  var boardUrl = info ? (info.scheme + "://" + info.host + parentPath) : SITE.browserHomeUrl;
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
  title = cleanPageTitle(title).replace(/^[■\s]+/, "");
  if (!title || title.length < 3) return null;
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: SITE.displayName,
    avatar: "",
    date: "",
    category: "",
    commentCount: "",
    viewCount: 0,
    likeCount: "",
    mediaUrl: "",
    mediaType: "",
    types: ["link"],
    menus: [],
    hotCount: 0,
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
      avatar: "",
      date: "",
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
