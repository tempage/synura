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
    "listRows": ["table.search-result-table tr.rowclick", "table.forum-overview tbody tr"],
    "listLink": ["a.search-result-title", "a[href*='/forum/2,']"],
    "listTitle": [
      "a[href*='/forum/2,']"
    ],
    "listTitleExclude": [],
    "listAuthor": [".thread-author a"],
    "listAvatar": [],
    "listDate": [".thread-result-col-2 .search-result-meta"],
    "listCommentCount": [".thread-result-col-3"],
    "listViewCount": [".thread-result-col-4"],
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
  ]
};

var SYNURA = {
  domain: "www.chefkoch.de",
  name: "chefkoch",
  author: "Synura Team",
  description: "chefkoch.de",
  version: 0.3,
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

function localListTitleLink(row, baseUrl) {
  var selectors = selectorList("listLink", []);
  for (var i = 0; i < selectors.length; i++) {
    var links = localQuerySelectorAll(row, [selectors[i]]);
    for (var j = 0; j < links.length; j++) {
      var url = ensureAbsoluteUrl(attrOf(links[j], "href"), baseUrl);
      if (localLooksLikePostUrl(url) && localTitleFromNode(links[j])) return links[j];
    }
  }
  return attrOf(row, "href") && localLooksLikePostUrl(ensureAbsoluteUrl(attrOf(row, "href"), baseUrl)) ? row : null;
}

function extractListItem(row, baseUrl) {
  if (!row) return null;
  var linkNode = localListTitleLink(row, baseUrl);
  var link = linkNode ? (normalizeUrl(attrOf(linkNode, "href")) || ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl)) : "";
  link = localCanonicalizeUrl(link);
  if (!link || localLooksLikeAssetUrl(link) || !localLooksLikePostUrl(link)) return null;
  var title = localTitleFromNode(linkNode);
  title = cleanPageTitle(title);
  if (!title) return null;
  var author = firstAuthorText(row, selectorList("listAuthor", []));
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: author,
    avatar: "",
    date: (textOf(firstNode(row, [".thread-result-col-2"])).match(/\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}/) || [""])[0],
    category: "",
    commentCount: parseCount(firstText(row, selectorList("listCommentCount", []))),
    viewCount: parseCount(firstText(row, selectorList("listViewCount", []))),
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
  for (var i = 0; i < rows.length; i++) {
    var contentRoot = firstNode(rows[i], selectorList("commentContent", [])) || rows[i];
    var text = textOf(contentRoot);
    var content = parseDetails(contentRoot, postUrl);
    if (!content || content.length === 0) content = text ? [{ type: "text", value: text }] : [];
    if (!content.length) continue;
    var key = attrOf(rows[i], "id") || attrOf(contentRoot, "id") || String(i);
    if (seen[key]) continue;
    seen[key] = true;
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

// BEGIN verified-reader-boundaries
(function () {
  // Match the original by its source marker. Later pages and identical replies
  // remain replies; neither row position nor message text is a reply identity.
  var rowSelectors = [".forum-message-wrapper"];
  var bodySelectors = [".forum-message-text"];
  var authorSelectors = [".forum-message-author .author"];
  var dateSelectors = [".forum-message-datetime"];

  function original(row, doc, url) { var first = firstNode(doc, ["#ck-pagination__page-1 .forum-message-wrapper"]);
    var id = attrOf(firstNode(row, [".forum-message-header"]), "id");
    return !!id && id === attrOf(firstNode(first, [".forum-message-header"]), "id"); }
  function originalRow(doc, url) {
    var rows = allNodes(doc, rowSelectors);
    for (var i = 0; i < rows.length; i++) if (original(rows[i], doc, url)) return rows[i];
    return null;
  }
  function author(row) { return firstAuthorText(row, authorSelectors); }
  function date(row) { return firstDateText(row, dateSelectors); }
  // Missing originals must not borrow metadata from a later-page reply.
  SITE.selectors.postAuthor = [];
  SITE.selectors.postDate = [];
  SITE.selectPostContentRoot = function (doc, url) {
    return firstNode(originalRow(doc, url), bodySelectors);
  };
  SITE.parsePostAuthor = function (doc, url) { return author(originalRow(doc, url)); };
  SITE.parsePostDate = function (doc, url) { return date(originalRow(doc, url)); };
  SITE.parseComments = function (doc, url) {
    var rows = allNodes(doc, rowSelectors), out = [], seen = {};
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (original(row, doc, url)) continue;
      var body = firstNode(row, bodySelectors);
      // Ad rows, buttons and composer forms have no message body.
      if (!body) continue;
      var content = parseDetails(body, url);
      if (!content || !content.length) continue;
      var id = attrOf(row, "id") || attrOf(body, "id");
      if (id && seen[id]) continue;
      if (id) seen[id] = true;
      var likeText = firstText(row, selectorList("commentLikeCount", []));
      out.push({id: SITE.siteKey + ":comment:" + (id || i),
        link: url.split("#")[0] + (id ? "#" + id : "#comment-" + i),
        author: author(row), date: date(row), content: content,
        avatar: imageUrlFromNode(firstNode(row, selectorList("commentAvatar", [])), url),
        likeCount: hideZeroCount(parseCount(likeText)), dislikeCount: "",
        level: detectCommentLevel(row), menus: [MENU_BROWSER], hotCount: toInt(likeText, 0), coldCount: 0});
    }
    return out;
  };
  // The DOM parser is authoritative: do not revive rejected rows in a fallback.
  SITE.fetchPostComments = function (match, url, doc, page, comments) {
    return Array.isArray(comments) ? comments : SITE.parseComments(doc, url);
  };
})();
// END verified-reader-boundaries
