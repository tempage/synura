// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "ba_k",
  "displayName": "Ba-k",
  "country": "Latin America",
  "category": "forum",
  "browserHomeUrl": "https://ba-k.com/foro/",
  "browserCookieAuth": true,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "Foros",
  "boardSettingsTitle": "Ajustes de foros",
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
    "www.ba-k.com",
    "m.ba-k.com"
  ],
  "acceptLanguage": "es-419,es;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-419,es;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [
    "mantenimiento",
    "aguanta",
    "maintenance",
    "temporarily unavailable"
  ],
  "titleSuffixes": [
    " - Ba-k",
    " | Ba-k",
    " : Ba-k"
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
      "id": "foro_libre",
      "title": "Foro libre",
      "url": "https://ba-k.com/foro/foro-libre/",
      "description": "Temas libres y variados",
      "group": "General"
    },
    {
      "id": "tecnologia",
      "title": "Tecnología y Gadgets",
      "url": "https://ba-k.com/foro/tecnologia-y-gadgets/",
      "description": "Tecnología, informática y gadgets",
      "group": "Tecnología"
    },
    {
      "id": "deportes",
      "title": "Deportes y estilo de vida",
      "url": "https://ba-k.com/foro/deportes-y-estilo-de-vida/",
      "description": "Deportes, salud y estilo de vida",
      "group": "Estilo de vida"
    },
    {
      "id": "politica",
      "title": "Política y finanzas",
      "url": "https://ba-k.com/foro/politica-y-finanzas/",
      "description": "Política, economía y finanzas",
      "group": "General"
    },
    {
      "id": "comida",
      "title": "Comida",
      "url": "https://ba-k.com/foro/comida/",
      "description": "Recetas, cocina y gastronomía",
      "group": "Estilo de vida"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".p-title-value",
      ".contentTitle",
      ".ipsType_pageTitle",
      ".forum-title"
    ],
    "listRows": [".structItem--thread", ".discussionListItem", ".node-extra", ".nodeLastPost"],
    "listLink": [".structItem-title a[data-tp-primary]", ".structItem-title a[href]", ".title a.PreviewTooltip", ".title a[href]", "a.node-extra-title", ".lastThreadTitle a[href]"],
    "listTitle": [
      ".structItem-title a",
      "a[href*='/foro/tema/']",
      "a[href*='/tema/']"
    ],
    "listTitleExclude": [
      ".badge",
      ".counter",
      ".stats",
      ".meta"
    ],
    "listAuthor": [".structItem-cell--main .username", ".posterDate .username", ".node-extra-user .username", ".lastThreadUser .username"],
    "listAvatar": [".structItem-cell--icon .avatar img", ".avatar img"],
    "listDate": [".structItem-startDate time", ".structItem-startDate .u-dt", ".startDate", "time[datetime]"],
    "listCommentCount": [".structItem-cell--meta .pairs:first-child dd", ".stats .major dd"],
    "listViewCount": [".structItem-cell--meta .pairs:last-child dd", ".stats .minor dd"],
    "listLikeCount": [
      ".likes",
      ".vote-count",
      ".recommend"
    ],
    "listCategory": [".label"],
    "listImage": [

    ],
    "postTitle": [
      ".contentTitle",
      ".p-title-value",
      ".ipsType_pageTitle",
      "h1[itemprop='headline']"
    ],
    "postAuthor": [
      ".message-name .username",
      ".messageSidebar .username",
      ".postprofile .username",
      ".author .username"
    ],
    "postAvatar": [
      ".message-avatar img",
      ".messageSidebar img",
      ".avatar img"
    ],
    "postDate": [
      "time[datetime]",
      ".message-attribution time",
      ".postdate time"
    ],
    "postViewCount": [
      ".view-count"
    ],
    "postLikeCount": [
      ".reactionSummary",
      ".likes",
      ".vote-count"
    ],
    "postCategory": [
      ".breadcrumbs a",
      ".p-breadcrumbs a"
    ],
    "postContent": [
      ".messageText[itemprop='text']",
      ".message-body .bbWrapper",
      ".postbody .content",
      ".ipsType_richText",
      ".cooked"
    ],
    "commentRows": [
      "article.message",
      ".postbody",
      ".ipsComment",
      ".topic-post",
      ".comment-item"
    ],
    "commentAuthor": [
      ".message-name .username",
      ".postprofile .username",
      ".ipsComment_author .username",
      ".author .username"
    ],
    "commentAvatar": [
      ".message-avatar img",
      ".postprofile img",
      ".ipsUserPhoto img"
    ],
    "commentContent": [
      ".message-body .bbWrapper",
      ".postbody .content",
      ".ipsType_richText",
      ".cooked",
      ".comment-content"
    ],
    "commentDate": [
      "time[datetime]",
      ".message-attribution time",
      ".postdate time"
    ],
    "commentLikeCount": [
      ".reactionSummary",
      ".likes",
      ".vote-count"
    ],
    "commentLevel": [

    ]
  },
  "commentLevelAttrs": [
    "data-depth",
    "depth",
    "data-level"
  ]
};

var SYNURA = {
  domain: "ba-k.com",
  name: "ba_k",
  author: "Synura Team",
  description: "ba-k.com",
  version: 0.6,
  api: 0,
  license: "Apache-2.0",
  locale: "es_419",
  icon: "https://ba-k.com/foro/data/assets/logo_default/bakonly_logo110.webp",
  bypass: "chrome/windows",
  deeplink: true,
  tags: [
    "general",
    "discussion",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/foro\/tema\/[^\/?#]+/i,
  /\/tema\/[^\/?#]+/i,
  /\/threads\/[^\/?#]+/i
];


var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='/foro/']",
  "a[href*='/forum']",
  "a[href*='/forums']",
  "a[href*='/board']",
  "a[href*='/boards']",
  "a[href*='viewforum.php']"
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

function localLooksLikeAssetUrl(url) {
  return /\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js|json|xml|pdf|zip|rar|7z|mp3|mp4|webm|avi|mov)(?:[?#]|$)/i.test(String(url || ""));
}

function localLooksLikeBadNav(url, title) {
  var sample = (String(url || "") + " " + String(title || "")).toLowerCase();
  return /(?:login|signin|signup|register|join|logout|privacy|terms|policy|advertis|adclick|affiliate|contact|about|help|search|tag\/|tags\/|tagged\/|\?tagged|objecttype=|category\/|categories\/|rss|feed|download|app\b|oauth|account|member|members\/|profile|user\/|users\/|\/~|avatar|newsletter|fullversion|markread|settings|manage\/|banlist|user-fotos|reviews\/|\/experts|toutes-les-news|message\.php)/i.test(sample);
}

function localLooksLikeCollectionUrl(url) {
  var path = localPathAndQuery(url).toLowerCase();
  if (/(?:forumdisplay\.php|viewforum\.php|list\.php\?table=|liste_sujet|liste_categorie|\/forums\/0-|\/bbs\/[^\/]+\/index\.html|\/home(?:[?#]|$)|\/wiki=|[?&]do=markread)/i.test(path)) return true;
  if (/\/(?:forum|forums|community|boards?|categories?|category|tags?|search|members?|users?)\/?(?:[?#]|$)/i.test(path)) return true;
  if (/\/(?:forums?|category|categories)\/[^\/?#]+\/?(?:[?#]|$)/i.test(path)) return true;
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
    var value = normalizeWhitespace(parts[i]).replace(/[-_]+/g, " ");
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
  var match = String(url || "").match(/[?&](?:id|no|t|tid|thread|topic)=([0-9A-Za-z_-]+)/);
  if (match) return match[1];
  match = String(url || "").match(/\/([0-9]{3,})(?:[\/?#]|$)/);
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


function localBoardDiscoveryScore(url, title) {
  var path = localPathAndQuery(url).toLowerCase();
  var lowerTitle = String(title || "").toLowerCase();
  if (!url || !isKnownHost((parseAbsoluteUrl(url) || {}).host)) return -999;
  if (localLooksLikeAssetUrl(url) || localLooksLikeBadNav(url, title)) return -999;
  if (localLooksLikePostUrl(url) && !localLooksLikeCollectionUrl(url)) return -999;
  var score = 0;
  if (localLooksLikeCollectionUrl(url)) score += 60;
  if (/(?:\/forums?\/|\/forum\/|\/boards?\/|\/bbs\/|\/community\/|\/categories?\/|\/tags?\/|\/groups?\/|\/gall(?:ery)?\/|forumdisplay\.php|viewforum\.php|list\.php\?)/i.test(path)) score += 45;
  if (communityBoardKeywordRegex().test(lowerTitle)) score += 20;
  if (title.length >= 2 && title.length <= 90) score += 16;
  if (/[?&](?:page|p)=/.test(path)) score -= 15;
  if ((normalizeUrl(url) || url) === (normalizeUrl(SITE.browserHomeUrl) || SITE.browserHomeUrl)) score -= 35;
  return score;
}

function localExtractCommentCount(title) {
  var match = String(title || "").match(/[\[(]([0-9]{1,4})[\])](?!.*[\[(][0-9]{1,4}[\])])/);
  return match ? match[1] : "";
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
  if (!globalThis._log_item) {
    globalThis._log_item = true;
    console.log("DEBUG linkNode:", linkNode ? linkNode.getAttribute("href") : "null", "selectors:", JSON.stringify(selectorList("listLink", [])));
  }
  var link = linkNode ? (normalizeUrl(attrOf(linkNode, "href")) || ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl)) : "";
  if (!link || localLooksLikeAssetUrl(link) || !localLooksLikePostUrl(link)) return null;
  var title = localTitleFromNode(linkNode);
  title = textOfNodeWithoutSelectors(row, selectorList("listTitleExclude", [])).length < title.length ? title : cleanPageTitle(title);
  if (!title) return null;
  var commentCount = firstNonEmpty([
    parseCount(firstText(row, selectorList("listCommentCount", []))),
    localExtractCommentCount(title)
  ]);
  var image = imageUrlFromNode(firstNode(row, selectorList("listImage", ["img"])), baseUrl);
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: firstAuthorText(row, selectorList("listAuthor", [])),
    avatar: imageUrlFromNode(firstNode(row, selectorList("listAvatar", [])), baseUrl),
    date: firstDateText(row, selectorList("listDate", [])),
    category: "",
    memo: firstText(row, selectorList("listCategory", [])) || "",
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

function localDiscoverBoardRecords(doc, baseUrl) {
  var anchors = localQuerySelectorAll(doc, LOCAL_BOARD_LINK_SELECTORS);
  if (anchors.length < SITE.minimumHomeBoards) {
    anchors = localQuerySelectorAll(doc, (LOCAL_BOARD_LINK_SELECTORS || []).concat(["a[href]"]));
  }
  var candidates = [];
  var seen = {};
  var homeUrl = normalizeUrl(SITE.browserHomeUrl) || SITE.browserHomeUrl;
  if (homeUrl) seen[homeUrl] = true;
  for (var i = 0; i < anchors.length && candidates.length < 1000; i++) {
    var url = normalizeUrl(attrOf(anchors[i], "href")) || ensureAbsoluteUrl(attrOf(anchors[i], "href"), baseUrl || SITE.browserHomeUrl);
    if (!url || seen[url]) continue;
    var title = localTitleFromNode(anchors[i]);
    var score = localBoardDiscoveryScore(url, title);
    if (score < 45) continue;
    seen[url] = true;
    candidates.push({
      score: score,
      order: i,
      board: {
        id: localBoardIdFromUrl(url),
        title: title || localTitleFromBoardUrl(url),
        url: url,
        description: url,
        group: SITE.country || "",
        dynamic: true
      }
    });
  }
  candidates.sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return a.order - b.order;
  });
  var out = [];
  var limit = SITE.maxDiscoveredBoards || 256;
  for (var j = 0; j < candidates.length && out.length < limit; j++) out.push(candidates[j].board);
  return out;
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

SITE.loadDynamicBoards = function (options) {
  if (!options || !options.allowNetwork) return [];
  var doc = fetchDocument(SITE.browserHomeUrl);
  return localDiscoverBoardRecords(doc, SITE.browserHomeUrl);
};

SITE.buildNextPageUrl = function (match, url, nextPage) {
  return setQueryParam(url, "page", nextPage);
};

SITE.matchPost = function (info) {
  if (!info || !isKnownHost(info.host)) return null;
  var url = localUrlFromInfo(info);
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

// BEGIN synurart-own-extension-validation-fix
(function () {
  SITE.selectors = SITE.selectors || {};
  SITE.linkAllowPatterns = [
  "/foro/tema/",
  "/tema/",
  "/threads/"
];
  try {
    if (typeof LIST_LINK_ALLOW_PATTERNS !== "undefined") LIST_LINK_ALLOW_PATTERNS = SITE.linkAllowPatterns;
  } catch (e) {}
  try {
    if (typeof LOCAL_POST_PATTERNS !== "undefined") LOCAL_POST_PATTERNS = [new RegExp("/foro/tema/", "i"), new RegExp("/tema/", "i"), new RegExp("/threads/", "i")];
  } catch (e) {}
  SITE.selectors["listRows"] = [".structItem--thread", ".discussionListItem", ".node-extra", ".nodeLastPost"];
  SITE.selectors["listLink"] = [".structItem-title a[data-tp-primary]", ".structItem-title a[href]", ".title a.PreviewTooltip", ".title a[href]", "a.node-extra-title", ".lastThreadTitle a[href]"];
  SITE.selectors["listTitle"] = [
  ".structItem-title a",
  "a[href*='/foro/tema/']",
  "a[href*='/tema/']"
];
  SITE.selectors["listAuthor"] = [".structItem-cell--main .username", ".posterDate .username", ".node-extra-user .username", ".lastThreadUser .username"];
  SITE.selectors["listDate"] = [".structItem-startDate time", ".structItem-startDate .u-dt", ".startDate", "time[datetime]"];
  SITE.selectors["listCommentCount"] = [".structItem-cell--meta .pairs:first-child dd", ".stats .major dd"];
  SITE.selectors["listViewCount"] = [".structItem-cell--meta .pairs:last-child dd", ".stats .minor dd"];
  SITE.selectors["postTitle"] = [
  ".p-title-value",
  "h1"
];
  SITE.selectors["postAuthor"] = [
  "article.message .message-name .username",
  ".message-name .username",
  ".username"
];
  SITE.selectors["postDate"] = [
  "article.message time.u-dt",
  "time[datetime]"
];
  SITE.selectors["postContent"] = [
  "article.message .message-body .bbWrapper",
  ".message-content .bbWrapper",
  ".message-body .bbWrapper",
  ".bbWrapper",
  "article.message",
];
  SITE.selectors["commentRows"] = [
  "article.message",
  ".message--post",
  ".message"
];
  SITE.selectors["commentContent"] = [
  ".message-body .bbWrapper",
  ".message-content .bbWrapper",
  ".bbWrapper",
  ".message-body"
];
  SITE.selectors["commentAuthor"] = [
  ".message-name .username",
  ".username"
];
  SITE.selectors["commentDate"] = [
  "time.u-dt",
  "time[datetime]"
];
  var ba_kPreviousFilterPostContent = SITE.filterPostContent;
  function ba_kText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function ba_kNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && selectors && i < selectors.length; i++) {
      try {
        var nodes = root.querySelectorAll(selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }

  SITE.filterPostContent = function (content, url, doc, page, match) {
    return Array.isArray(content) ? content : [];
  };
  var ba_kCommentRowSelectors = [
  "article.message",
  ".message--post",
  ".message"
];
  var ba_kCommentContentSelectors = [
  ".message-body .bbWrapper",
  ".message-content .bbWrapper",
  ".bbWrapper",
  ".message-body"
];
  var ba_kPreviousFetchPostComments = SITE.fetchPostComments;
  function ba_kMergeComment(target, seen, item) {
    if (!item || !item.content) return;
    var text = "";
    for (var i = 0; i < item.content.length; i++) text += " " + (item.content[i] && item.content[i].value || "");
    text = text.replace(/\s+/g, " ").trim();
    var key = item.id && item.id.indexOf(":comment:") < 0 ? item.id : JSON.stringify([item.link, item.author, item.date, item.content]);
    if (!item.content.length || seen[key]) return;
    seen[key] = true;
    target.push(item);
  }
  function ba_kParseVisibleComments(doc, url, target, seen) {
    var rows = localQuerySelectorAll(doc, ba_kCommentRowSelectors);
    for (var i = 0; i < rows.length; i++) {
      var root = null;
      try { root = firstNode(rows[i], ba_kCommentContentSelectors); } catch (e) {}
      root = root || rows[i];
      var text = textOf(root);
      var details = [];
      try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
      if (!details.length) details = text ? [{ type: "text", value: text }] : [];
      var domId = "";
      try { domId = attrOf(rows[i], "id"); } catch (e) {}
      ba_kMergeComment(target, seen, {
        id: SITE.siteKey + ":comment:" + target.length,
        link: url + (domId ? ("#" + domId) : ("#comment-" + target.length)),
        author: firstAuthorText(rows[i], selectorList("commentAuthor", [])),
        avatar: imageUrlFromNode(firstNode(rows[i], selectorList("commentAvatar", [])), url),
        date: firstDateText(rows[i], selectorList("commentDate", [])),
        content: details,
        likeCount: "",
        dislikeCount: "",
        level: detectCommentLevel(rows[i]),
        menus: [MENU_BROWSER],
        hotCount: 0,
        coldCount: 0
      });
    }
  }
  SITE.fetchPostComments = function (match, url, doc, page, comments) {
    var out = [];
    var seen = {};
    var existing = Array.isArray(comments) ? comments : [];
    for (var i = 0; i < existing.length; i++) ba_kMergeComment(out, seen, existing[i]);
    try {
      if (ba_kPreviousFetchPostComments) {
        var fetched = ba_kPreviousFetchPostComments(match, url, doc, page, existing) || [];
        for (var j = 0; j < fetched.length; j++) ba_kMergeComment(out, seen, fetched[j]);
      }
    } catch (e) {}
    if (!out.length) ba_kParseVisibleComments(doc, url, out, seen);

    return out;
  };
  var ba_kPreviousIsAuthRequiredResponse = SITE.isAuthRequiredResponse;
  function ba_kIsMaintenancePage(status, html) {
    var text = String(html || "");
    return status === 503 || (new RegExp("mantenimiento|aguanta|maintenance|temporarily|unavailable", "i")).test(text);
  }
  SITE.isAuthRequiredResponse = function (url, status, html) {
    if (ba_kIsMaintenancePage(status, html)) return true;
    return ba_kPreviousIsAuthRequiredResponse ? ba_kPreviousIsAuthRequiredResponse(url, status, html) : undefined;
  };
})();
// END synurart-own-extension-validation-fix

// BEGIN verified-reader-boundaries
(function () {
  // Match the original by its source marker. Later pages and identical replies
  // remain replies; neither row position nor message text is a reply identity.
  var rowSelectors = ["article.message", "li.message"];
  var bodySelectors = [".message-body .bbWrapper", ".messageText"];
  var authorSelectors = [".message-name .username", ".message-userDetails .username", ".username"];
  var dateSelectors = [".message-attribution-main time", "time[datetime]", ".DateTime"];

  function original(row, doc, url) { var links = allNodes(row, [".message-attribution-opposite a", ".postNumber"]);
    for (var i = 0; i < links.length; i++) if (/^#\s*1$/.test(textOf(links[i]))) return true;
    return attrOf(row, "data-position") === "0"; }
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
