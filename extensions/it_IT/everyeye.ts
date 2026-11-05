// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "everyeye",
  "displayName": "Everyeye.it Forum",
  "country": "Italy",
  "category": "gaming forum",
  "browserHomeUrl": "https://forum.everyeye.it/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 6,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "Forum",
  "boardSettingsTitle": "Impostazioni forum",
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
    "www.forum.everyeye.it"
  ],
  "acceptLanguage": "it-IT,it;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Everyeye Forum",
    " | Everyeye Forum",
    " : Everyeye Forum"
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
      "id": "videogiochi_console_pc",
      "title": "Videogiochi Console e PC",
      "url": "https://forum.everyeye.it/invision/forum/279-videogiochi-console-e-pc/",
      "description": "Videogiochi Console e PC",
      "group": "Everyeye"
    },
    {
      "id": "playstation_sony",
      "title": "Playstation / Sony",
      "url": "https://forum.everyeye.it/invision/forum/240-playstation-sony/",
      "description": "Playstation / Sony",
      "group": "Console"
    },
    {
      "id": "switch_nintendo",
      "title": "Switch / Nintendo",
      "url": "https://forum.everyeye.it/invision/forum/241-switch-nintendo/",
      "description": "Switch / Nintendo",
      "group": "Console"
    },
    {
      "id": "xbox_microsoft",
      "title": "Xbox / Microsoft",
      "url": "https://forum.everyeye.it/invision/forum/239-xbox-microsoft/",
      "description": "Xbox / Microsoft",
      "group": "Console"
    },
    {
      "id": "hardware",
      "title": "Hardware",
      "url": "https://forum.everyeye.it/invision/forum/244-hardware/",
      "description": "PC Hardware",
      "group": "PC"
    },
    {
      "id": "gaming_news",
      "title": "Gaming News",
      "url": "https://forum.everyeye.it/invision/forum/613-gaming-news-everyeyeit/",
      "description": "Gaming News / Everyeye.it",
      "group": "News"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".ipsType_pageTitle",
      "h1.ipsType_pageTitle",
      ".contentTitle",
      ".forum-title"
    ],
    "listRows": [".ipsDataItem", ".ipsData__item"],
    "listLink": [".ipsDataItem_title a[data-ipshover]", ".ipsDataItem_title a[href]", "a.ipsDataItem_title", ".ipsData__title a[href]", ".ipsData__last-primary a[href]"],
    "listTitle": [
      ".ipsDataItem_title a",
      "a[href*='/invision/topic/']"
    ],
    "listTitleExclude": [
      ".badge",
      ".counter",
      ".stats",
      ".meta"
    ],
    "listAuthor": [".ipsDataItem_meta a[data-ipshover]", ".ipsTopicSnippet__title a[data-ipshover]", ".ipsData__meta a[data-ipshover]", ".ipsData__last-secondary a[data-ipshover]", ".ipsDataItem_lastPoster a[data-ipshover]", ".cWidgetComments a[data-ipshover]"],
    "listAvatar": [".ipsUserPhoto img"],
    "listDate": [".ipsDataItem_meta time", ".ipsTopicSnippet__title time", ".ipsData__meta time", ".ipsData__last-text time", "time[datetime]"],
    "listCommentCount": [".ipsDataItem_stats li:first-child .ipsDataItem_stats_number", ".ipsTopicSnippet__replies", ".ipsData__stats dd"],
    "listViewCount": [".ipsDataItem_stats li:last-child .ipsDataItem_stats_number", ".ipsTopicSnippet__views"],
    "listLikeCount": [
      ".likes",
      ".reactionSummary"
    ],
    "listCategory": [
      ".category",
      ".forum-title"
    ],
    "listImage": [],
    "postTitle": [
      ".ipsType_pageTitle",
      "h1.ipsType_pageTitle",
      ".contentTitle",
      "h1"
    ],
    "postAuthor": [
      "[data-role='commentAuthor']",
      ".ipsComment_author strong",
      ".author .username",
      ".username"
    ],
    "postAvatar": [
      ".ipsUserPhoto img",
      ".avatar img"
    ],
    "postDate": [
      "time[datetime]",
      "time"
    ],
    "postViewCount": [
      ".view-count"
    ],
    "postLikeCount": [
      ".reactionSummary",
      ".likes"
    ],
    "postCategory": [
      ".ipsBreadcrumb a",
      ".breadcrumbs a"
    ],
    "postContent": [
      "[data-role='commentContent']",
      ".ipsType_richText",
      ".ipsComment_content"
    ],
    "commentRows": [
      "article.ipsComment",
      "[data-role='commentNode']",
      "article[id^='elComment_']"
    ],
    "commentAuthor": [
      "[data-role='commentAuthor']",
      ".ipsComment_author strong",
      "h3.ipsComment_author",
      ".author"
    ],
    "commentAvatar": [
      ".ipsUserPhoto img",
      ".avatar img"
    ],
    "commentContent": [
      "[data-role='commentContent']",
      ".ipsType_richText",
      ".ipsComment_content"
    ],
    "commentDate": [
      "time[datetime]",
      "time"
    ],
    "commentLikeCount": [
      ".reactionSummary",
      ".likes"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": [
    "data-depth",
    "depth",
    "data-level"
  ]
};

var SYNURA = {
  domain: "forum.everyeye.it",
  name: "everyeye",
  author: "Synura Team",
  description: "forum.everyeye.it",
  version: 0.3,
  api: 0,
  license: "Apache-2.0",
  locale: "it_IT",
  icon: "https://forum.everyeye.it/favicon.ico",
  bypass: "chrome/windows",
  deeplink: true,
  tags: [
    "gaming",
    "videogames",
    "technology",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/invision\/topic\/\d+/i,
  /\/topic\/\d+/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='/invision/forum/']",
  "a[href*='/forum/']",
  "a[href*='/forums/']"
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
  return String(url || "").replace(/[?&]do=findComment.*$/i, "").replace(/\/page\/\d+/i, "");
}

function localLooksLikeAssetUrl(url) {
  return /\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js|json|xml|pdf|zip|rar|7z)(?:[?#]|$)/i.test(String(url || ""));
}

function localLooksLikeBadNav(url, title) {
  var sample = (String(url || "") + " " + String(title || "")).toLowerCase();
  return /(?:login|signin|signup|register|join|logout|privacy|terms|policy|affiliate|contact|about|help|search|tag\/|tags\/|tagged\/|rss|feed|download|app\b|oauth|account|member|members\/|profile|user\/|users\/|newsletter|markread|settings)/i.test(sample);
}

function localLooksLikeCollectionUrl(url) {
  var path = localPathAndQuery(url).toLowerCase();
  if (/(?:\/forum\/\d+|\/forums\/|\/forum\/)/i.test(path)) return true;
  return false;
}

function localLooksLikePostUrl(url) {
  var path = localPathAndQuery(url).toLowerCase();
  for (var i = 0; i < LOCAL_POST_PATTERNS.length; i++) {
    if (LOCAL_POST_PATTERNS[i].test(path)) return true;
  }
  return false;
}

function localTitleFromNode(node) {
  var title = textOf(node);
  if (!title) title = attrOf(node, "title");
  if (!title) title = attrOf(node, "aria-label");
  if (!title) {
    var img = node && node.querySelector ? node.querySelector("img") : null;
    title = attrOf(img, "alt");
  }
  return normalizeWhitespace(title).replace(/\s*\[[0-9,]+\]\s*$/, "");
}

function localTitleFromBoardUrl(url) {
  var path = localPathAndQuery(url).split("?")[0].replace(/\/+$/, "");
  var parts = path.split("/");
  for (var i = parts.length - 1; i >= 0; i--) {
    var value = normalizeWhitespace(parts[i]).replace(/^\d+-/, "").replace(/[-_]+/g, " ");
    if (value) return value;
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
    if (part) slug = part;
  }
  if (!slug) slug = "home";
  return slug.substring(0, 24) + "_" + localBoardIdHash(url);
}

function localPostIdFromUrl(url) {
  var match = String(url || "").match(/\/topic\/(\d+)/i);
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
  var parentPath = path.replace(/\/[^\/]*$/, "/");
  if (!parentPath || parentPath === path) parentPath = "/";
  var boardUrl = info ? (info.scheme + "://" + info.host + parentPath) : SITE.browserHomeUrl;
  return ensureBoard(localBoardIdFromUrl(boardUrl), boardUrl, localTitleFromBoardUrl(boardUrl));
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
  title = textOfNodeWithoutSelectors(row, selectorList("listTitleExclude", [])).length < title.length ? title : cleanPageTitle(title);
  if (!title) return null;
  var commentCount = parseCount(firstText(row, selectorList("listCommentCount", [])));
  var image = imageUrlFromNode(firstNode(row, selectorList("listImage", ["img"])), baseUrl);
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: firstAuthorText(row, selectorList("listAuthor", [])),
    avatar: imageUrlFromNode(firstNode(row, selectorList("listAvatar", [])), baseUrl),
    date: firstDateText(row, selectorList("listDate", [])),
    category: "",
    commentCount: commentCount,
    viewCount: parseCount(firstText(row, selectorList("listViewCount", []))),
    likeCount: hideZeroCount(parseCount(firstText(row, selectorList("listLikeCount", [])))),
    mediaUrl: image,
    mediaType: image ? "image" : "",
    types: image ? ["image", "link"] : ["link"],
    menus: [],
    hotCount: toInt(commentCount, 0),
    coldCount: 0
  };
}

function localCommentAuthor(node) {
  return firstAuthorText(node, selectorList("commentAuthor", []));
}

function localCommentDate(node) {
  var time = firstNode(node, selectorList("commentDate", ["time", ".date", ".time"]));
  return attrOf(time, "datetime") || textOf(time);
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
    var domId = attrOf(rows[i], "id");
    var likeText = firstText(rows[i], selectorList("commentLikeCount", []));
    out.push({
      id: SITE.siteKey + ":comment:" + out.length,
      link: postUrl + (domId ? ("#" + domId) : ("#comment-" + out.length)),
      author: localCommentAuthor(rows[i]),
      avatar: imageUrlFromNode(firstNode(rows[i], selectorList("commentAvatar", [])), postUrl),
      date: localCommentDate(rows[i]),
      content: content,
      likeCount: hideZeroCount(parseCount(likeText)),
      dislikeCount: "",
      level: detectCommentLevel(rows[i]),
      menus: [MENU_BROWSER],
      hotCount: toInt(likeText, 0),
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
  var info = parseAbsoluteUrl(url);
  if (!info) return "";
  info.path = info.path.replace(/\/page\/\d+\/?$/i, "").replace(/\/+$/, "") + "/page/" + nextPage + "/";
  info.hash = "";
  return joinAbsoluteUrl(info);
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
  var pageMatch = String(info.path || "").match(/\/page\/(\d+)(?:\/|$)/i);
  return {
    board: board,
    page: pageMatch ? Math.max(1, parseInt(pageMatch[1], 10)) : queryInt(info.query, "page", 1)
  };
};

// BEGIN verified-reader-boundaries
(function () {
  // Match the original by its source marker. Later pages and identical replies
  // remain replies; neither row position nor message text is a reply identity.
  var rowSelectors = ["article.cPost", "article.ipsComment", "article[data-ips-hook=\"postWrapper\"]"];
  var bodySelectors = ["[data-role=\"commentContent\"]", ".ipsType_richText"];
  var authorSelectors = [".cAuthorPane_author a", "[data-ips-hook=\"topicAuthorColumn\"] a[rel=\"external nofollow\"]", "[data-ips-hook=\"topicAuthorColumn\"] h3", ".ipsComment_author .username"];
  var dateSelectors = ["time[datetime]"];
  var schemaDoc = null, topic = null;
  function topicSchema(doc) {
    if (schemaDoc === doc) return topic;
    schemaDoc = doc; topic = null;
    var scripts = allNodes(doc, ["script[type='application/ld+json']"]);
    function visit(value) {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) { for (var j = 0; j < value.length; j++) visit(value[j]); return; }
      if (value["@type"] === "DiscussionForumPosting") topic = value;
      if (value["@graph"]) visit(value["@graph"]);
    }
    for (var i = 0; i < scripts.length; i++) try { visit(JSON.parse(scripts[i].textContent || "")); } catch (e) {}
    return topic;
  }
  function original(row, doc, url) { if (row && row.getAttribute("data-ips-first-post") !== null) return true;
    var first = firstNode(row, ["[data-first-post='true']"]);
    if (first) return true;
    var data = firstNode(row, ["[data-quotedata]"]), schema = topicSchema(doc);
    if (!data || !schema) return false;
    try {
      var quoted = JSON.parse(attrOf(data, "data-quotedata"));
      var created = Date.parse(schema.dateCreated || schema.datePublished || "");
      var name = schema.author && schema.author.name || "";
      return !!created && Number(quoted.timestamp) * 1000 === created && quoted.username === name;
    } catch (e) { return false; } }
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
