// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "chefkoch",
  "displayName": "Chefkoch Forum",
  "country": "Germany",
  "category": "cooking and food forum",
  "browserHomeUrl": "https://www.chefkoch.de/forum/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 5,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "Foren",
  "boardSettingsTitle": "Foreneinstellungen",
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
    "chefkoch.de"
  ],
  "acceptLanguage": "de-DE,de;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " | Chefkoch.de",
    " - Chefkoch.de",
    " : Chefkoch.de"
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
      "id": "fleisch",
      "title": "Fleisch",
      "url": "https://www.chefkoch.de/forum/1,57/Fleisch.html",
      "description": "Rind, Schwein, Geflügel und Zubereitung",
      "group": "Kochen"
    },
    {
      "id": "desserts",
      "title": "Desserts & Süßspeisen",
      "url": "https://www.chefkoch.de/forum/1,25/Desserts-Suessspeisen.html",
      "description": "Nachtisch, Cremes, Eis & Obst",
      "group": "Süßes"
    },
    {
      "id": "auflaeufe",
      "title": "Aufläufe & Gratins",
      "url": "https://www.chefkoch.de/forum/1,32/Auflaeufe.html",
      "description": "Überbackenes aus dem Ofen",
      "group": "Kochen"
    },
    {
      "id": "laenderkueche",
      "title": "Länderküche",
      "url": "https://www.chefkoch.de/forum/1,5/Laenderkueche-Gerichte-aus-aller-Welt.html",
      "description": "Gerichte aus aller Welt",
      "group": "International"
    },
    {
      "id": "gesund_essen",
      "title": "Gesund Essen",
      "url": "https://www.chefkoch.de/forum/1,16/Gesund-Essen.html",
      "description": "Ausgewogene und gesunde Ernährung",
      "group": "Ernährung"
    }
  ],
  "selectors": {
    "boardTitle": [
      "#LocateThreadName",
      "h1",
      "title"
    ],
    "listRows": [
      "table.forum-overview tbody tr",
      "a[href*='/forum/2,']"
    ],
    "listLink": [
      "a[href*='/forum/2,']"
    ],
    "listTitle": [
      "a[href*='/forum/2,']"
    ],
    "listTitleExclude": [],
    "listAuthor": [
      ".author",
      "span.author"
    ],
    "listAvatar": [],
    "listDate": [
      "time"
    ],
    "listCommentCount": [],
    "listViewCount": [],
    "listLikeCount": [],
    "listCategory": [],
    "listImage": [],
    "postTitle": [
      "#LocateThreadName",
      "h1",
      "title"
    ],
    "postAuthor": [
      "span.author",
      ".author"
    ],
    "postAvatar": [
      ".user-avatar img",
      ".avatar img"
    ],
    "postDate": [
      ".forum-message-quote__headline",
      "time"
    ],
    "postViewCount": [],
    "postLikeCount": [],
    "postCategory": [],
    "postContent": [
      "td.forum-message-text",
      ".forum-message-text"
    ],
    "commentRows": [
      "div[id^='message_']",
      "table.forum-message-wrappertable"
    ],
    "commentAuthor": [
      "span.author",
      ".author"
    ],
    "commentAvatar": [
      ".user-avatar img"
    ],
    "commentContent": [
      "td.forum-message-text",
      ".forum-message-text"
    ],
    "commentDate": [
      ".forum-message-quote__headline"
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
  domain: "www.chefkoch.de",
  name: "chefkoch",
  author: "Synura Team",
  description: "chefkoch.de",
  version: 0.1,
  api: 0,
  license: "Apache-2.0",
  locale: "de_DE",
  icon: "https://www.chefkoch.de/favicon.ico",
  bypass: "chrome/windows",
  deeplink: true,
  tags: [
    "germany",
    "cooking",
    "recipes",
    "lifestyle",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/forum\/2,\d+,\d+\/[^"]+\.html/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='/forum/1,']"
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
  if (path.indexOf("/forum/1,") >= 0 || path.indexOf("/forum/3,") >= 0) return true;
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
  var path = localPathAndQuery(url).split("?")[0].replace(/\/+$/, "");
  var match = path.match(/\/forum\/1,\d+\/([^\.]+)\.html/i);
  if (match) return match[1].replace(/[-_]+/g, " ");
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
  var match = String(url || "").match(/\/forum\/1,(\d+)\//i);
  if (match) return "b_" + match[1];
  return "home";
}

function localPostIdFromUrl(url) {
  var match = String(url || "").match(/\/forum\/2,\d+,(\d+)\//i);
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
  return ensureBoard(localBoardIdFromUrl(url), url, localTitleFromBoardUrl(url));
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
  if (!title || title.length < 3) return null;
  var author = firstAuthorText(row, selectorList("listAuthor", [])) || SITE.displayName;
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: author,
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
    if (text.length < 2 || text.length > 4000) continue;
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
