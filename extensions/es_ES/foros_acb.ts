// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "foros_acb",
  "displayName": "Foros ACB",
  "country": "Spain",
  "category": "sports forum",
  "browserHomeUrl": "https://foros.acb.com/forum/",
  "browserCookieAuth": false,
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
  "hostAliases": [],
  "acceptLanguage": "es-ES,es;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Foros ACB",
    " | Foros ACB",
    " : Foros ACB"
  ],
  "boards": [
    {
      "id": "home",
      "title": "Home",
      "url": "https://foros.acb.com/forum/",
      "description": "sports forum",
      "group": "Spain"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".contentHeader .contentTitle",
      ".wbbBoardNodeContainer__title .wbbBoardNodeContainer__link"
    ],
    "listRows": [
      ".wbbThreadList .wbbThread[data-thread-id]"
    ],
    "listLink": [
      ".wbbThreadList .wbbThread .messageGroupLink.wbbTopicLink[href*='index.php?thread/']"
    ],
    "listTitle": [
      ".wbbThreadList .messageGroupLink.wbbTopicLink"
    ],
    "listTitleExclude": [
      ".messageGroupCounterMobile",
      ".messageGroupListStatsSimple",
      ".messageGroupInfo"
    ],
    "listAuthor": [
      ".messageGroupAuthor .userLink",
      ".messageGroupAuthorMobile"
    ],
    "listAvatar": [
      ".columnAvatar .userAvatarImage",
      ".columnLastPost .userAvatarImage"
    ],
    "listDate": [
      ".messageGroupTime woltlab-core-date-time",
      ".messageGroupLastPostTimeMobile woltlab-core-date-time"
    ],
    "listCommentCount": [
      ".messageGroupCounterMobile",
      ".messageGroupListStatsSimple span[aria-label='Respuestas']"
    ],
    "listViewCount": [
      ".columnStats .messageGroupListStatsSimple span[aria-label='Visitas']"
    ],
    "listLikeCount": [

    ],
    "listCategory": [
      ".contentHeader .contentTitle"
    ],
    "listImage": [

    ],
    "postTitle": [
      ".messageGroupContentHeader .contentTitle[itemprop='name']",
      ".messageGroupContentHeader .contentTitle"
    ],
    "postAuthor": [
      ".contentHeaderMetaData .userLink",
      ".messageSidebar .username.userLink"
    ],
    "postAvatar": [
      ".contentHeaderIcon .userAvatarImage",
      ".messageSidebar .userAvatarImage"
    ],
    "postDate": [
      ".messagePublicationTime woltlab-core-date-time",
      ".contentHeaderMetaData woltlab-core-date-time"
    ],
    "postViewCount": [

    ],
    "postLikeCount": [
      "woltlab-core-reaction-summary"
    ],
    "postCategory": [
      ".breadcrumbs .boxMenuLinkTitle"
    ],
    "postContent": [
      ".wbbThreadPostList article.wbbPost .messageText[itemprop='text']"
    ],
    "commentRows": [
      ".wbbThreadPostList article.wbbPost[data-post-id]"
    ],
    "commentAuthor": [
      ".messageSidebar .username.userLink [itemprop='name']",
      ".messageSidebar .username.userLink"
    ],
    "commentAvatar": [
      ".messageSidebar .userAvatarImage"
    ],
    "commentContent": [
      ".messageBody .messageText[itemprop='text']"
    ],
    "commentDate": [
      ".messagePublicationTime woltlab-core-date-time",
      ".messagePublicationTime"
    ],
    "commentLikeCount": [
      "woltlab-core-reaction-summary"
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
  domain: "foros.acb.com",
  name: "foros_acb",
  author: "Synura Team",
  description: "foros.acb.com",
  version: 0.6,
  api: 0,
  license: "Apache-2.0",
  locale: "es_ES",
  icon: "https://foros.acb.com/images/style-2/favicon-48x48.png",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "basketball",
    "sports",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /index\.php\?thread\/[^\/?#]+/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  ".wbbBoardNode__link[href*='index.php?board/']",
  ".wbbBoardNode__subBoardLink[href*='index.php?board/']",
  ".wbbBoardNodeContainer__link[href*='index.php?board/']"
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
  var out = String(url || "").split("#")[0];
  out = out.replace(/([?&])action=firstNew\b[^&#]*/i, "");
  out = out.replace(/\?&/, "?").replace(/[?&]$/, "");
  return normalizeUrl(out) || out;
}

function localLooksLikeAssetUrl(url) {
  return /\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js|json|xml|pdf|zip|rar|7z|mp3|mp4|webm|avi|mov)(?:[?#]|$)/i.test(String(url || ""));
}

function localLooksLikeBoardUrl(url) {
  var path = localPathAndQuery(url).toLowerCase();
  var homePath = localPathAndQuery(SITE.browserHomeUrl).toLowerCase().replace(/\/+$/, "");
  return path.replace(/\/+$/, "") === homePath || /index\.php\?board\/[^\/?#]+/i.test(path);
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
  var woltlabMatch = String(url || "").match(/index\.php\?thread\/[^\/?#]*?([0-9]+)(?:[\/?#]|$)/i);
  if (woltlabMatch) return woltlabMatch[1];
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
  if (!url || !isKnownHost((parseAbsoluteUrl(url) || {}).host)) return -999;
  if (localLooksLikeAssetUrl(url) || !localLooksLikeBoardUrl(url)) return -999;
  var score = 90;
  if (title.length >= 2 && title.length <= 90) score += 16;
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
  var link = linkNode ? (normalizeUrl(attrOf(linkNode, "href")) || ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl)) : "";
  link = localCanonicalizeUrl(link);
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

SITE.buildPostFetchUrls = function (match, currentUrl) {
  var canonical = localCanonicalizeUrl(currentUrl);
  return canonical && canonical !== currentUrl ? [canonical, currentUrl] : [currentUrl];
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
  if (localLooksLikeAssetUrl(url) || localLooksLikePostUrl(url) || !localLooksLikeBoardUrl(url)) return null;
  var board = localFindConfiguredBoard(url) || ensureBoard(localBoardIdFromUrl(url), url, localTitleFromBoardUrl(url));
  return {
    board: board,
    page: queryInt(info.query, "page", 1)
  };
};

// BEGIN synurart-own-extension-validation-fix
(function () {
  SITE.selectors = SITE.selectors || {};
  SITE.boards = [
  {
    "id": "real_madrid",
    "title": "Real Madrid",
    "url": "https://foros.acb.com/forum/index.php?board/62-real-madrid/",
    "description": "Real Madrid",
    "group": "Spain"
  },
  {
    "id": "foro_general",
    "title": "Foro General ACB.COM",
    "url": "https://foros.acb.com/forum/index.php?board/1-foro-general-acb-com/",
    "description": "Foro General",
    "group": "Spain"
  },
  {
    "id": "valencia",
    "title": "Valencia Basket",
    "url": "https://foros.acb.com/forum/index.php?board/60-valencia-basket/",
    "description": "Valencia Basket",
    "group": "Spain"
  },
  {
    "id": "barca",
    "title": "Barca",
    "url": "https://foros.acb.com/forum/index.php?board/8-bar%C3%A7a/",
    "description": "Barca",
    "group": "Spain"
  },
  {
    "id": "joventut",
    "title": "Joventut",
    "url": "https://foros.acb.com/forum/index.php?board/13-joventut/",
    "description": "Joventut",
    "group": "Spain"
  },
  {
    "id": "unicaja",
    "title": "Unicaja",
    "url": "https://foros.acb.com/forum/index.php?board/17-unicaja/",
    "description": "Unicaja",
    "group": "Spain"
  },
  {
    "id": "baskonia",
    "title": "Baskonia",
    "url": "https://foros.acb.com/forum/index.php?board/11-baskonia/",
    "description": "Baskonia",
    "group": "Spain"
  },
  {
    "id": "bilbao",
    "title": "Bilbao Basket",
    "url": "https://foros.acb.com/forum/index.php?board/26-bilbao-basket/",
    "description": "Bilbao Basket",
    "group": "Spain"
  },
  {
    "id": "gran_canaria",
    "title": "Gran Canaria",
    "url": "https://foros.acb.com/forum/index.php?board/27-gran-canaria/",
    "description": "Gran Canaria",
    "group": "Spain"
  },
  {
    "id": "obradoiro",
    "title": "Obradoiro",
    "url": "https://foros.acb.com/forum/index.php?board/40-obradoiro/",
    "description": "Obradoiro",
    "group": "Spain"
  }
];
  SITE.defaultVisibleBoardIds = [
  "real_madrid",
  "foro_general",
  "valencia",
  "barca",
  "joventut",
  "unicaja",
  "baskonia",
  "bilbao",
  "gran_canaria",
  "obradoiro"
];
  SITE.linkAllowPatterns = [
  "index\\.php\\?thread/"
];
  try {
    if (typeof LIST_LINK_ALLOW_PATTERNS !== "undefined") LIST_LINK_ALLOW_PATTERNS = SITE.linkAllowPatterns;
  } catch (e) {}
  try {
    if (typeof LOCAL_POST_PATTERNS !== "undefined") LOCAL_POST_PATTERNS = [new RegExp("index\\.php\\?thread/", "i"), new RegExp("/thread/", "i")];
  } catch (e) {}
  SITE.selectors["listRows"] = [
  ".wbbThread[data-thread-id]",
  ".tabularListColumns.messageGroup[data-thread-id]",
  "ol.messageGroup[data-thread-id]"
];
  SITE.selectors["listLink"] = [
  ".messageGroupLink.wbbTopicLink[href*='index.php?thread/']",
  "a.wbbTopicLink[href*='index.php?thread/']",
  "a[href*='index.php?thread/']"
];
  SITE.selectors["listTitle"] = [
  ".messageGroupLink.wbbTopicLink[href*='index.php?thread/']",
  "a.wbbTopicLink[href*='index.php?thread/']",
  "a[href*='index.php?thread/']"
];
  SITE.selectors["listAuthor"] = [
  ".username",
  ".messageGroupAuthor a",
  ".columnSubject .username"
];
  SITE.selectors["listDate"] = [
  "time[datetime]",
  ".datetime"
];
  SITE.selectors["listCommentCount"] = [
  ".columnStats",
  ".statsData",
  ".replies"
];
  SITE.selectors["listViewCount"] = [
  ".columnStats",
  ".views"
];
  SITE.selectors["postTitle"] = [
  "h1",
  ".contentTitle",
  ".messageGroupLink"
];
  SITE.selectors["postAuthor"] = [
  ".messageAuthor .username",
  ".username"
];
  SITE.selectors["postDate"] = [
  "time[datetime]",
  ".datetime"
];
  SITE.selectors["postContent"] = [
  ".messageText[itemprop='text']",
  ".messageBody .messageText",
  "article.wbbPost .messageText",
  ".messageText",
];
  SITE.selectors["commentRows"] = [
  "article.wbbPost[data-post-id]",
  ".wbbPost[data-post-id]",
  ".message"
];
  SITE.selectors["commentContent"] = [
  ".messageText[itemprop='text']",
  ".messageBody .messageText",
  ".messageText"
];
  SITE.selectors["commentAuthor"] = [
  ".messageAuthor .username",
  ".username"
];
  SITE.selectors["commentDate"] = [
  "time[datetime]",
  ".datetime"
];
  var foros_acbPreviousFilterPostContent = SITE.filterPostContent;
  function foros_acbText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function foros_acbNodes(root, selectors) {
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
  var foros_acbCommentRowSelectors = [
  "article.wbbPost[data-post-id]",
  ".wbbPost[data-post-id]",
  ".message"
];
  var foros_acbCommentContentSelectors = [
  ".messageText[itemprop='text']",
  ".messageBody .messageText",
  ".messageText"
];
  var foros_acbPreviousFetchPostComments = SITE.fetchPostComments;
  function foros_acbMergeComment(target, seen, item) {
    if (!item || !item.content) return;
    var text = "";
    for (var i = 0; i < item.content.length; i++) text += " " + (item.content[i] && item.content[i].value || "");
    text = text.replace(/\s+/g, " ").trim();
    var key = item.id && item.id.indexOf(":comment:") < 0 ? item.id : JSON.stringify([item.link, item.author, item.date, item.content]);
    if (!item.content.length || seen[key]) return;
    seen[key] = true;
    target.push(item);
  }
  function foros_acbParseVisibleComments(doc, url, target, seen) {
    var rows = localQuerySelectorAll(doc, foros_acbCommentRowSelectors);
    for (var i = 0; i < rows.length; i++) {
      var root = null;
      try { root = firstNode(rows[i], foros_acbCommentContentSelectors); } catch (e) {}
      root = root || rows[i];
      var text = textOf(root);
      var details = [];
      try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
      if (!details.length) details = text ? [{ type: "text", value: text }] : [];
      var domId = "";
      try { domId = attrOf(rows[i], "id"); } catch (e) {}
      foros_acbMergeComment(target, seen, {
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
    for (var i = 0; i < existing.length; i++) foros_acbMergeComment(out, seen, existing[i]);
    try {
      if (foros_acbPreviousFetchPostComments) {
        var fetched = foros_acbPreviousFetchPostComments(match, url, doc, page, existing) || [];
        for (var j = 0; j < fetched.length; j++) foros_acbMergeComment(out, seen, fetched[j]);
      }
    } catch (e) {}
    if (!out.length) foros_acbParseVisibleComments(doc, url, out, seen);

    return out;
  };
function foros_acbOwnText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function foros_acbOwnNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        var nodes = root.querySelectorAll(selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }
  function foros_acbOwnFirst(root, selectors) {
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        if (root.matches && root.matches(selectors[i])) return root;
        var node = root.querySelector(selectors[i]);
        if (node) return node;
      } catch (e) {}
    }
    return null;
  }
  function foros_acbOwnAttr(node, name) {
    try { return node && node.getAttribute ? String(node.getAttribute(name) || "") : ""; } catch (e) { return ""; }
  }
  function foros_acbOwnAbsolute(href, baseUrl) {
    href = String(href || "").replace(/&amp;/g, "&").trim();
    if (!href) return "";
    try { return ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl) || href; } catch (e) {}
    try { return new URL(href, baseUrl || SITE.browserHomeUrl).href; } catch (e) {}
    return href;
  }
  function foros_acbOwnAllowed(link) {
    var pattern = "index\\.php\\?thread/";
    if (!pattern) return true;
    return new RegExp(pattern, "i").test(String(link || ""));
  }
  function foros_acbOwnItem(row, baseUrl, index) {
    var item = extractListItem(row, baseUrl);
    if (!item) return null;
    item.author = firstAuthorText(row, [".messageGroupAuthor .userLink"]);
    item.date = attrOf(firstNode(row, [".messageGroupTime woltlab-core-date-time"]), "date") || firstDateText(row, [".messageGroupTime time", ".messageGroupTime"]);
    item.category = "";
    item.memo = firstText(row, [".label"]);
    item.commentCount = parseCount(firstText(row, [".messageGroupCounterMobile"]));
    return item;
  }
  function foros_acbOwnParseBoardHtml(html, baseUrl) {
    var doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    var rows = foros_acbOwnNodes(doc, [
  ".messageGroup.wbbThread",
  ".wbbThread",
  ".messageGroup",
  "a.wbbTopicLink[href*='thread/']"
]);
    var out = [];
    var seen = {};
    for (var i = 0; i < rows.length; i++) {
      var item = foros_acbOwnItem(rows[i], baseUrl, i);
      if (!item || seen[item.link]) continue;
      seen[item.link] = true;
      out.push(item);
    }
    return out;
  }
  SITE.parseBoardItemsFromHtml = function (html, baseUrl, match, boardPage) {
    return foros_acbOwnParseBoardHtml(html, baseUrl);
  };
  SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
    return foros_acbOwnParseBoardHtml(boardPage && boardPage.html ? boardPage.html : "", baseUrl);
  };

  function foros_acbPageNumber(query, fallback) {
    var match = String(query || "").match(/(?:^|[&?])(?:pageNo|page)=([0-9]+)/i);
    if (match) return parseInt(match[1], 10) || fallback || 1;
    return fallback || 1;
  }
  function foros_acbNextBoardPageUrl(url, nextPage) {
    var clean = String(url || "").replace(/([?&])(?:pageNo|page)=[0-9]+/gi, "$1").replace(/[?&]+$/g, "");
    if (clean.indexOf("?board/") >= 0 || clean.indexOf("?board%2F") >= 0) {
      return clean + "&pageNo=" + String(nextPage);
    }
    try { return setQueryParam(clean, "pageNo", nextPage); } catch (e) {}
    return clean + (clean.indexOf("?") >= 0 ? "&" : "?") + "pageNo=" + String(nextPage);
  }
  var foros_acbPreviousMatchBoard = SITE.matchBoard;
  SITE.matchBoard = function (info) {
    var matched = foros_acbPreviousMatchBoard ? foros_acbPreviousMatchBoard(info) : null;
    if (matched) matched.page = foros_acbPageNumber(info && info.query, matched.page || 1);
    return matched;
  };
  SITE.buildNextPageUrl = function (match, url, nextPage) {
    return foros_acbNextBoardPageUrl(url, nextPage);
  };
})();
// END synurart-own-extension-validation-fix

// BEGIN verified-reader-boundaries
(function () {
  // Match the original by its source marker. Later pages and identical replies
  // remain replies; neither row position nor message text is a reply identity.
  var rowSelectors = ["article.wbbPost"];
  var bodySelectors = [".messageBody .htmlContent", ".messageText", ".htmlContent"];
  var authorSelectors = [".username"];
  var dateSelectors = ["woltlab-core-date-time", "time[datetime]"];

  function original(row, doc, url) { var links = allNodes(row, [".wsShareButton"]); for (var i = 0; i < links.length; i++) if (/^#\s*1$/.test(textOf(links[i]))) return true; return false; }
  function originalRow(doc, url) {
    var rows = allNodes(doc, rowSelectors);
    for (var i = 0; i < rows.length; i++) if (original(rows[i], doc, url)) return rows[i];
    return null;
  }
  function author(row) { return firstAuthorText(row, authorSelectors); }
  function date(row) { var node = firstNode(row, dateSelectors); return attrOf(node, "date") || firstDateText(row, dateSelectors); }
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
