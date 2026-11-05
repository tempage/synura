// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "kaskus",
  "displayName": "Kaskus",
  "country": "Indonesia",
  "category": "community forum",
  "browserHomeUrl": "https://www.kaskus.co.id/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 4,
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
    "www.kaskus.co.id",
    "m.kaskus.co.id"
  ],
  "acceptLanguage": "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " | KASKUS",
    " - KASKUS",
    " : KASKUS"
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
      "id": "the_lounge",
      "title": "The Lounge",
      "url": "https://www.kaskus.co.id/forum/21/the-lounge",
      "description": "Tempat Nongkrong dan Berbagi Cerita",
      "group": "Kaskus"
    },
    {
      "id": "berita_politik",
      "title": "Berita dan Politik",
      "url": "https://www.kaskus.co.id/forum/10/berita-dan-politik",
      "description": "Diskusi Berita dan Isu Terkini",
      "group": "Berita"
    },
    {
      "id": "heart_to_heart",
      "title": "Heart to Heart",
      "url": "https://www.kaskus.co.id/forum/16/heart-to-heart",
      "description": "Curahan Hati dan Kasih Sayang",
      "group": "Kehidupan"
    },
    {
      "id": "sports",
      "title": "Sports",
      "url": "https://www.kaskus.co.id/forum/35/sports",
      "description": "Dunia Olahraga",
      "group": "Hobi"
    }
  ],
  "selectors": {
    "boardTitle": [
      "h1",
      ".title",
      "title"
    ],
    "listRows": [
      "a[href*='/thread/']"
    ],
    "listLink": [
      "a[href*='/thread/']"
    ],
    "listTitle": [
      "a[href*='/thread/']"
    ],
    "listTitleExclude": [
      ".badge"
    ],
    "listAuthor": [
      ".username",
      ".author"
    ],
    "listAvatar": [
      ".avatar img"
    ],
    "listDate": [
      "time"
    ],
    "listCommentCount": [],
    "listViewCount": [],
    "listLikeCount": [],
    "listCategory": [],
    "listImage": [],
    "postTitle": [
      "h1",
      "title"
    ],
    "postAuthor": [
      ".author",
      ".username"
    ],
    "postAvatar": [
      ".avatar img"
    ],
    "postDate": [
      "time"
    ],
    "postViewCount": [],
    "postLikeCount": [],
    "postCategory": [],
    "postContent": [".entry", ".post-content", "[data-cy='thread-content']", "article"],
    "commentRows": [
      ".post",
      ".comment",
      "article"
    ],
    "commentAuthor": [
      ".author",
      ".username"
    ],
    "commentAvatar": [
      ".avatar img"
    ],
    "commentContent": [
      ".entry",
      ".post-content",
      "article"
    ],
    "commentDate": [
      "time"
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
  domain: "kaskus.co.id",
  host_permissions: ["https://kaskus.co.id/*", "https://www.kaskus.co.id/*", "https://m.kaskus.co.id/*"],
  name: "kaskus",
  author: "Synura Team",
  description: "kaskus.co.id",
  version: 0.3,
  api: 0,
  license: "Apache-2.0",
  locale: "id_ID",
  icon: "https://www.kaskus.co.id/favicon.ico",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "indonesia",
    "community",
    "lifestyle",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/thread\/[^\/?#]+/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='/forum/']"
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
  return String(url || "").replace(/[?&]ref=.*$/i, "");
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
  if (/(?:\/(?:forum|komunitas)\/\d+)/i.test(path)) return true;
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
    var value = normalizeWhitespace(parts[i]).replace(/^\d+-?/, "").replace(/[-_]+/g, " ");
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
  var match = String(url || "").match(/\/thread\/([0-9a-zA-Z_-]+)/i);
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
  var image = imageUrlFromNode(firstNode(row, selectorList("listImage", ["img"])), baseUrl);
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: firstAuthorText(row, selectorList("listAuthor", [])),
    avatar: imageUrlFromNode(firstNode(row, selectorList("listAvatar", [])), baseUrl),
    date: firstDateText(row, selectorList("listDate", [])),
    category: "",
    commentCount: "",
    viewCount: 0,
    likeCount: "",
    mediaUrl: image,
    mediaType: image ? "image" : "",
    types: image ? ["image", "link"] : ["link"],
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
  for (var i = 0; i < rows.length; i++) {
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
      author: firstAuthorText(rows[i], selectorList("commentAuthor", [])),
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

// Current community pages render their threads client-side. These read-only,
// same-origin JSON endpoints are also used by the public Kaskus web client.
function localKaskusJson(path) {
  var options = buildFetchOptions();
  options.headers["Accept"] = "application/json";
  var response = fetchWithLogging("https://www.kaskus.co.id/api" + path, options);
  if (!response || !response.ok) return null;
  try { return JSON.parse(responseText(response)); } catch (e) { return null; }
}

function localKaskusDate(value) {
  var timestamp = Number(value);
  return timestamp > 0 ? new Date(timestamp * 1000).toISOString() : "";
}

function localKaskusItem(thread) {
  if (!thread || !thread.id || !thread.title) return null;
  var author = thread.thread_starter || {};
  var meta = thread.meta || {};
  var image = thread.thumbnail && thread.thumbnail.url || "";
  return {
    id: "kaskus:" + thread.id,
    link: "https://www.kaskus.co.id/thread/" + thread.id + (thread.slug ? "/" + thread.slug : ""),
    title: thread.title, author: author.display_name || author.username || "",
    avatar: author.avatar || "", date: localKaskusDate(thread.dateline),
    category: "", memo: thread.community && thread.community.name || "",
    commentCount: hideZeroCount(meta.total_replies), viewCount: meta.total_views || 0,
    likeCount: "", mediaUrl: image, mediaType: image ? "image" : "",
    types: image ? ["image", "link"] : ["link"], menus: [], hotCount: 0, coldCount: 0
  };
}

SITE.routeBoardCustom = function (url, info, match) {
  var community = String(info && info.path || "").match(/\/(?:forum|komunitas)\/(\d+)/);
  if (!community) return null;
  var page = Math.max(1, queryInt(info.query, "page", 1));
  var payload = localKaskusJson("/communities/" + community[1] + "/threads?page=" + page + "&limit=20");
  if (!payload || !Array.isArray(payload.data)) return null;
  var items = payload.data.map(localKaskusItem).filter(function (item) { return !!item; });
  var meta = payload.meta || {};
  var hasNext = meta.total != null ? page * (Number(meta.limit) || 20) < Number(meta.total) : items.length >= 20;
  var nextUrl = hasNext ? setQueryParam(url, "page", page + 1) : "";
  var board = match && match.board;
  var title = board && board.title || SITE.displayName;
  return {
    kind: "board", url: url,
    viewData: { view: "/views/list", styles: { title: title, menu: true, pagination: !!nextUrl, history: true }, models: { contents: items, menus: [MENU_BROWSER] } },
    context: { kind: "board", link: url, boardId: board && board.id || "", boardTitle: title, boardUrl: board && board.url || url, title: title, page: page, nextUrl: nextUrl, seenLinks: items.map(function (item) { return item.link; }) }
  };
};

function localKaskusContent(post, url) {
  var content = post && post.content || {};
  if (content.html) {
    var doc = new DOMParser().parseFromString(content.html, "text/html");
    return parseDetails(doc.querySelector("body") || doc, url);
  }
  return content.text ? [{ type: "text", value: content.text }] : [];
}

SITE.routePostCustom = function (url, info, match) {
  var id = localPostIdFromUrl(url);
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  var payload = localKaskusJson("/threads/" + id + "/cache");
  var thread = payload && payload.data;
  if (!thread || !thread.first_post) return null;
  var first = thread.first_post;
  var content = localKaskusContent(first, url);
  if (!content.length) return null;
  var comments = [];
  var replies = localKaskusJson("/threads/" + id + "/posts?page=1&limit=50");
  var rows = replies && Array.isArray(replies.data) ? replies.data : [];
  var seen = {};
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (!row.id || row.id === first.id || seen[row.id]) continue;
    seen[row.id] = true;
    var body = localKaskusContent(row, url);
    if (!body.length) continue;
    var user = row.user || {};
    var vote = row.meta && row.meta.vote_info || {};
    comments.push({ id: "kaskus:comment:" + row.id, link: url + "#post" + row.id, author: user.display_name || user.username || "", avatar: user.avatar || "", date: localKaskusDate(row.dateline), content: body, likeCount: hideZeroCount(vote.total_reputations), level: 0, menus: [MENU_BROWSER] });
  }
  var author = first.user || thread.thread_starter || {};
  var board = match && match.board;
  return {
    viewData: { styles: { title: thread.title || "", menu: true }, models: { author: author.display_name || author.username || "", avatar: author.avatar || "", date: localKaskusDate(first.dateline || thread.dateline), category: "", memo: thread.community && thread.community.name || "", viewCount: thread.meta && thread.meta.total_views || 0, content: content, comments: comments, link: url, menus: [MENU_BROWSER], buttons: ["Refresh"] } },
    context: { kind: "post", link: url, boardId: board && board.id || "", boardTitle: board && board.title || "", boardUrl: board && board.url || "" }
  };
};
