// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "ads_id",
  "displayName": "Ads.id Forum",
  "country": "Indonesia",
  "category": "internet marketing forum",
  "browserHomeUrl": "https://www.ads.id/forums/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 5,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "Forum",
  "boardSettingsTitle": "Pengaturan Forum",
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
    "ads.id"
  ],
  "acceptLanguage": "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " | Ads.id",
    " - Ads.id",
    " : Ads.id"
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
      "id": "adsense",
      "title": "AdSense",
      "url": "https://www.ads.id/forums/index.php?forums/adsense.178/",
      "description": "Google AdSense Publisher",
      "group": "Publisher"
    },
    {
      "id": "wordpress",
      "title": "WordPress",
      "url": "https://www.ads.id/forums/index.php?forums/wordpress.101/",
      "description": "WordPress Plugins & Themes",
      "group": "Website"
    },
    {
      "id": "marketplace",
      "title": "Trade / Marketplace",
      "url": "https://www.ads.id/forums/index.php?forums/marketplace.166/",
      "description": "Jual Beli Website, Domain & Layanan",
      "group": "Trade"
    },
    {
      "id": "program_kita",
      "title": "Program Kita",
      "url": "https://www.ads.id/forums/index.php?forums/program-kita.114/",
      "description": "Affiliate & Advertising Programs",
      "group": "Marketing"
    },
    {
      "id": "kenalan_dong",
      "title": "Kenalan Dong",
      "url": "https://www.ads.id/forums/index.php?forums/kenalan-dong.77/",
      "description": "Perkenalan Member Baru",
      "group": "Komunitas"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".titleBar h1",
      "h1",
      "title"
    ],
    "listRows": [
      "li.discussionListItem",
      ".discussionListItems li"
    ],
    "listLink": [
      "h3.title a",
      "a.PreviewTooltip",
      "a[href*='threads/']"
    ],
    "listTitle": [
      "h3.title a",
      "a.PreviewTooltip"
    ],
    "listTitleExclude": [
      ".prefix",
      ".badge"
    ],
    "listAuthor": [
      ".posterDate .username",
      ".username",
      ".author"
    ],
    "listAvatar": [
      ".posterAvatar img",
      ".avatar img"
    ],
    "listDate": [
      ".DateTime",
      "abbr.DateTime"
    ],
    "listCommentCount": [
      ".stats .major dd",
      ".major dd"
    ],
    "listViewCount": [
      ".stats .minor dd",
      ".minor dd"
    ],
    "listLikeCount": [],
    "listCategory": [
      ".crumbs a"
    ],
    "listImage": [],
    "postTitle": [
      ".titleBar h1",
      "h1"
    ],
    "postAuthor": [
      ".messageUserBlock .username",
      ".username"
    ],
    "postAvatar": [
      ".avatarHolder img",
      ".avatar img"
    ],
    "postDate": [
      ".messageMeta .DateTime",
      "abbr.DateTime"
    ],
    "postViewCount": [],
    "postLikeCount": [],
    "postCategory": [
      ".breadBoxTop a"
    ],
    "postContent": ["blockquote.messageText", ".messageContent article"],
    "commentRows": [
      "li.message",
      ".messageList li"
    ],
    "commentAuthor": [
      ".messageUserBlock .username",
      ".username"
    ],
    "commentAvatar": [
      ".avatarHolder img",
      ".avatar img"
    ],
    "commentContent": [
      "blockquote.messageText"
    ],
    "commentDate": [
      ".messageMeta .DateTime",
      "abbr.DateTime"
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
  domain: "www.ads.id",
  name: "ads_id",
  author: "Synura Team",
  description: "ads.id",
  version: 0.3,
  api: 0,
  license: "Apache-2.0",
  locale: "id_ID",
  icon: "https://www.ads.id/favicon.ico",
  bypass: "chrome/windows",
  deeplink: true,
  tags: [
    "business",
    "seo",
    "marketing",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /threads\/[^\/?#]+/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='forums/']"
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
  return String(url || "").replace(/page-\d+/i, "");
}

function localLooksLikeAssetUrl(url) {
  return /\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js|json|xml|pdf|zip|rar|7z)(?:[?#]|$)/i.test(String(url || ""));
}

function localLooksLikeBadNav(url, title) {
  var sample = (String(url || "") + " " + String(title || "")).toLowerCase();
  return /(?:login|signin|signup|register|join|logout|privacy|terms|policy|affiliate|contact|about|help|search|rss|feed|download|app\b|oauth|account|member|members\/|profile|user\/|users\/|newsletter|markread|settings)/i.test(sample);
}

function localLooksLikeCollectionUrl(url) {
  var path = localPathAndQuery(url).toLowerCase();
  if (/(?:forums\/)/i.test(path)) return true;
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
    var value = normalizeWhitespace(parts[i]).replace(/\.\d+$/, "").replace(/[-_]+/g, " ");
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
  var match = String(url || "").match(/threads\/[^\/?#]*\.(\d+)/i);
  if (match) return match[1];
  match = String(url || "").match(/threads\/(\d+)/i);
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
  var time = firstNode(node, selectorList("commentDate", [".DateTime", "abbr.DateTime"]));
  return attrOf(time, "data-time") || textOf(time);
}

function localParseComments(doc, postUrl) {
  var seen = {};
  var out = [];
  var rows = allNodes(doc, selectorList("commentRows", []));
  var pageTitle = cleanPageTitle(firstText(doc, ["title"])).toLowerCase();
  // The first message is already rendered as the original post.
  for (var i = 1; i < rows.length; i++) {
    var contentRoot = firstNode(rows[i], selectorList("commentContent", [])) || rows[i];
    var text = textOf(contentRoot);
    var content = parseDetails(contentRoot, postUrl) || [];
    if (!content.length && text) content = [{ type: "text", value: text }];
    if (!content.length) continue;
    var key = attrOf(rows[i], "id") || attrOf(contentRoot, "id") || String(i);
    if (seen[key]) continue;
    seen[key] = true;
    var domId = attrOf(rows[i], "id");
    out.push({
      id: SITE.siteKey + ":comment:" + out.length,
      link: postUrl + (domId ? ("#" + domId) : ("#comment-" + out.length)),
      author: localCommentAuthor(rows[i]),
      avatar: imageUrlFromNode(firstNode(rows[i], selectorList("commentAvatar", [])), postUrl),
      date: localCommentDate(rows[i]),
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
  var info = parseAbsoluteUrl(url);
  if (!info) return "";
  var queryRoute = /^(?:forums|threads)\//i.test(info.query);
  var queryParts = queryRoute ? info.query.split("&") : [];
  var routePath = queryRoute ? queryParts[0] : info.path;
  routePath = routePath.replace(/\/page-\d+\/?$/i, "").replace(/\/+$/, "") + "/page-" + nextPage;
  if (queryRoute) {
    queryParts[0] = routePath;
    info.query = queryParts.join("&");
  } else {
    info.path = routePath;
  }
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
  var pageMatch = localPathAndQuery(url).match(/\/page-(\d+)(?:\/|[?&#]|$)/i);
  return {
    board: board,
    page: pageMatch ? Math.max(1, parseInt(pageMatch[1], 10)) : queryInt(info.query, "page", 1)
  };
};
