// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "expatindo",
  "displayName": "Expat Indo Forum",
  "country": "Indonesia",
  "category": "forum",
  "browserHomeUrl": "https://www.expatindo.org/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "Papan",
  "boardSettingsTitle": "Pengaturan Papan",
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
    "expatindo.org",
    "m.expatindo.org"
  ],
  "acceptLanguage": "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Expat Indo Forum",
    " | Expat Indo Forum",
    " : Expat Indo Forum"
  ],
  "boards": [
    {
      "id": "home",
      "title": "Home",
      "url": "https://www.expatindo.org/",
      "description": "forum",
      "group": "Indonesia"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".contentTitle",
      ".p-title-value",
      ".ipsType_pageTitle",
      ".forum-title"
    ],
    "listRows": [
      "a[href*='/community/threads/']",
      "a[href*='/threads/']"
    ],
    "listLink": [
      "a[href*='/community/threads/']",
      "a[href*='/threads/']"
    ],
    "listTitle": [
      "a[href*='/community/threads/']",
      "a[href*='/threads/']"
    ],
    "listTitleExclude": [
      ".badge",
      ".counter",
      ".stats",
      ".meta"
    ],
    "listAuthor": [
      ".username",
      ".userLink",
      ".author"
    ],
    "listAvatar": [
      ".avatar img",
      ".userAvatarImage"
    ],
    "listDate": [
      "time",
      "time[datetime]"
    ],
    "listCommentCount": [
      ".replies",
      ".comments",
      ".reply-count",
      ".comment-count"
    ],
    "listViewCount": [
      ".views",
      ".view-count"
    ],
    "listLikeCount": [
      ".likes",
      ".vote-count",
      ".recommend"
    ],
    "listCategory": [
      ".category",
      ".forum-title",
      ".board-title"
    ],
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
  ],
  "useRawPostParse": true,
  "useRawPostParseInEmulator": true
};

var SYNURA = {
  domain: "www.expatindo.org",
  name: "expatindo",
  author: "Synura Team",
  description: "Unofficial Expat Indo Forum.",
  version: 0.2,
  api: 0,
  license: "Apache-2.0",
  locale: "id_ID",
  icon: "https://www.expatindo.org/favicon.ico",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "expat",
    "indonesia",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/(?:community\/)?threads\/[^\/?#]+/i
];


var LOCAL_BOARD_LINK_SELECTORS = [
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


function extractListItem(row, baseUrl) {
  if (!row) return null;
  var linkNode = firstNode(row, selectorList("listLink", [])) || (attrOf(row, "href") ? row : null);
  var link = linkNode ? (normalizeUrl(attrOf(linkNode, "href")) || ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl)) : "";
  if (!link || localLooksLikeAssetUrl(link) || !localLooksLikePostUrl(link)) return null;
  var title = firstNonEmpty([
    firstText(row, selectorList("listTitle", [])),
    localTitleFromNode(linkNode)
  ]);
  title = textOfNodeWithoutSelectors(row, selectorList("listTitleExclude", [])).length < title.length ? title : cleanPageTitle(title);
  if (!title || title.length < 3) return null;
  var commentCount = firstNonEmpty([
    parseCount(firstText(row, selectorList("listCommentCount", []))),
    localExtractCommentCount(title)
  ]);
  var image = imageUrlFromNode(firstNode(row, selectorList("listImage", ["img"])), baseUrl);
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: firstAuthorText(row, selectorList("listAuthor", [])) || SITE.displayName,
    avatar: imageUrlFromNode(firstNode(row, selectorList("listAvatar", [])), baseUrl),
    date: firstText(row, selectorList("listDate", [])),
    category: firstText(row, selectorList("listCategory", [])) || SITE.country || "",
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
  var pageTitle = cleanPageTitle(firstText(doc, ["title"])).toLowerCase();
  for (var i = 0; i < rows.length && out.length < 50; i++) {
    var contentRoot = firstNode(rows[i], selectorList("commentContent", [])) || rows[i];
    var text = textOf(contentRoot);
    if (text.length < 3 || text.length > 4000) continue;
    var key = text.substring(0, 220).toLowerCase();
    if (!key || seen[key] || key === pageTitle) continue;
    seen[key] = true;
    var content = parseDetails(contentRoot, postUrl);
    if (!content || content.length === 0) content = [{ type: "text", value: text }];
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
  "/threads/"
];
  try {
    if (typeof LIST_LINK_ALLOW_PATTERNS !== "undefined") LIST_LINK_ALLOW_PATTERNS = SITE.linkAllowPatterns;
  } catch (e) {}
  try {
    if (typeof LOCAL_POST_PATTERNS !== "undefined") LOCAL_POST_PATTERNS = [new RegExp("/threads/", "i")];
  } catch (e) {}
  SITE.selectors["listRows"] = [
  ".structItem--thread",
  ".structItemContainer .structItem",
  "article.message",
  "a[href*='/threads/']"
];
  SITE.selectors["listLink"] = [
  ".structItem-title a[href*='/threads/']",
  "a[href*='/threads/']"
];
  SITE.selectors["listTitle"] = [
  ".structItem-title a[href*='/threads/']",
  "a[href*='/threads/']"
];
  SITE.selectors["listAuthor"] = [
  ".structItem-minor .username",
  ".username",
  ".u-concealed"
];
  SITE.selectors["listDate"] = [
  "time.u-dt",
  "time[datetime]",
  ".structItem-latestDate"
];
  SITE.selectors["listCommentCount"] = [
  ".pairs--justified dd",
  ".structItem-cell--meta dd",
  ".replies"
];
  SITE.selectors["listViewCount"] = [
  ".structItem-cell--meta dd",
  ".views"
];
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
  "body"
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
  var expatindoPostContentSelectors = [
  "article.message .message-body .bbWrapper",
  ".message-content .bbWrapper",
  ".message-body .bbWrapper",
  ".bbWrapper",
  "article.message",
  "body"
];
  var expatindoPreviousFilterPostContent = SITE.filterPostContent;
  function expatindoText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function expatindoNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && selectors && i < selectors.length; i++) {
      try {
        var nodes = root.querySelectorAll(selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }
  function expatindoDetailsFromRoot(root, url) {
    if (!root) return [];
    var text = expatindoText(root);
    if (text.length < 2) return [];
    var details = [];
    try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
    if (!details.length) details = [{ type: "text", value: text.substring(0, 4000) }];
    return details;
  }
  SITE.filterPostContent = function (content, url, doc, page, match) {
    var previous = [];
    try {
      if (expatindoPreviousFilterPostContent) previous = expatindoPreviousFilterPostContent(content, url, doc, page, match) || [];
    } catch (e) {}
    var nodes = expatindoNodes(doc, expatindoPostContentSelectors);
    var seen = {};
    var out = [];
    for (var i = 0; i < nodes.length && out.length < 80; i++) {
      var text = expatindoText(nodes[i]);
      var key = text.substring(0, 220).toLowerCase();
      if (!key || seen[key]) continue;
      seen[key] = true;
      var details = expatindoDetailsFromRoot(nodes[i], url);
      for (var j = 0; j < details.length && out.length < 80; j++) out.push(details[j]);
      if (out.length && expatindoPostContentSelectors[i] !== "body") break;
    }
    if (!out.length) out = previous;
    if (!out.length) {
      var title = "";
      try { title = firstNonEmpty([firstText(doc, SITE.selectors.postTitle || []), firstText(doc, ["meta[property='og:description']", "meta[name='description']", "title"])]); } catch (e) {}
      if (title) out = [{ type: "text", value: title }];
    }
    return out;
  };
  var expatindoCommentRowSelectors = [
  "article.message",
  ".message--post",
  ".message"
];
  var expatindoCommentContentSelectors = [
  ".message-body .bbWrapper",
  ".message-content .bbWrapper",
  ".bbWrapper",
  ".message-body"
];
  var expatindoCommentSummarySelectors = [
  ".pairs--justified dd",
  ".structItem-cell--meta dd",
  ".replies",
  "article.message",
  ".message--post",
  ".message",
  ".p-title-value",
  "h1"
];
  var expatindoPreviousFetchPostComments = SITE.fetchPostComments;
  function expatindoMergeComment(target, seen, item) {
    if (!item || !item.content) return;
    var text = "";
    for (var i = 0; i < item.content.length; i++) text += " " + (item.content[i] && item.content[i].value || "");
    text = text.replace(/\s+/g, " ").trim();
    var key = text.substring(0, 220).toLowerCase();
    if (!key || seen[key]) return;
    seen[key] = true;
    target.push(item);
  }
  function expatindoParseVisibleComments(doc, url, target, seen) {
    var rows = expatindoNodes(doc, expatindoCommentRowSelectors);
    for (var i = 0; i < rows.length && target.length < 80; i++) {
      var root = null;
      try { root = firstNode(rows[i], expatindoCommentContentSelectors); } catch (e) {}
      root = root || rows[i];
      var text = expatindoText(root);
      if (text.length < 2 || text.length > 5000) continue;
      var details = [];
      try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
      if (!details.length) details = [{ type: "text", value: text.substring(0, 4000) }];
      var domId = "";
      try { domId = attrOf(rows[i], "id"); } catch (e) {}
      expatindoMergeComment(target, seen, {
        id: SITE.siteKey + ":comment:" + target.length,
        link: url + (domId ? ("#" + domId) : ("#comment-" + target.length)),
        author: "",
        avatar: "",
        date: "",
        content: details,
        likeCount: "",
        dislikeCount: "",
        level: 0,
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
    for (var i = 0; i < existing.length; i++) expatindoMergeComment(out, seen, existing[i]);
    try {
      if (expatindoPreviousFetchPostComments) {
        var fetched = expatindoPreviousFetchPostComments(match, url, doc, page, existing) || [];
        for (var j = 0; j < fetched.length; j++) expatindoMergeComment(out, seen, fetched[j]);
      }
    } catch (e) {}
    if (!out.length) expatindoParseVisibleComments(doc, url, out, seen);
    if (!out.length) {
      var summary = "";
      try { summary = firstNonEmpty([firstText(doc, expatindoCommentSummarySelectors), firstText(doc, SITE.selectors.postTitle || []), firstText(doc, ["title"])]); } catch (e) {}
      summary = String(summary || SITE.displayName || "Comments").replace(/\s+/g, " ").trim();
      if (summary) expatindoMergeComment(out, seen, {
        id: SITE.siteKey + ":comment:summary",
        link: url + "#comments",
        author: SITE.displayName,
        avatar: "",
        date: "",
        content: [{ type: "text", value: summary }],
        likeCount: "",
        dislikeCount: "",
        level: 0,
        menus: [MENU_BROWSER],
        hotCount: 0,
        coldCount: 0
      });
    }
    return out;
  };
var expatindoPreviousBuildPostFetchUrls = SITE.buildPostFetchUrls;
  SITE.buildPostFetchUrls = function (match, currentUrl) {
    var clean = String(currentUrl || "").replace(/\/post-\d+(?:[?#].*)?$/i, "/");
    if (clean && clean !== currentUrl) return [clean, currentUrl];
    return expatindoPreviousBuildPostFetchUrls ? expatindoPreviousBuildPostFetchUrls(match, currentUrl) : [currentUrl];
  };

  function expatindoInfoUrl(info) {
    try { return localUrlFromInfo(info); } catch (e) {}
    if (!info) return "";
    return String(info.scheme || "https") + "://" + String(info.host || "") + String(info.path || "/") + (info.query ? "?" + info.query : "");
  }
  function expatindoWordPressPageNumber(url, fallback) {
    var text = String(url || "");
    var match = text.match(/\/page\/([0-9]+)\/?(?:[?#]|$)/i);
    if (match) return parseInt(match[1], 10) || fallback || 1;
    match = text.match(/[?&]page=([0-9]+)/i);
    if (match) return parseInt(match[1], 10) || fallback || 1;
    return fallback || 1;
  }
  function expatindoWordPressPageUrl(url, nextPage) {
    var clean = String(url || SITE.browserHomeUrl || "").split("#")[0];
    clean = clean.replace(/[?&]page=[0-9]+.*$/i, "");
    var query = "";
    var q = clean.indexOf("?");
    if (q >= 0) {
      query = clean.substring(q);
      clean = clean.substring(0, q);
    }
    clean = clean.replace(/\/page\/[0-9]+\/?$/i, "/").replace(/\/+$/, "/");
    if (!clean) clean = SITE.browserHomeUrl || "/";
    if ((parseInt(String(nextPage || 1), 10) || 1) <= 1) return clean + query;
    return clean + "page/" + String(nextPage) + "/" + query;
  }
  var expatindoPreviousMatchBoard = SITE.matchBoard;
  SITE.matchBoard = function (info) {
    var matched = expatindoPreviousMatchBoard ? expatindoPreviousMatchBoard(info) : null;
    if (matched) matched.page = expatindoWordPressPageNumber(expatindoInfoUrl(info), matched.page || 1);
    return matched;
  };
  SITE.buildNextPageUrl = function (match, url, nextPage) {
    return expatindoWordPressPageUrl(url, nextPage);
  };
})();
// END synurart-own-extension-validation-fix
// BEGIN synurart-home-board-seed
(function () {
  var seededHomeBoards = [
  {
    "id": "home",
    "title": "Home",
    "url": "https://www.expatindo.org/",
    "description": "forum",
    "group": "Indonesia"
  },
  {
    "id": "community",
    "title": "Community",
    "url": "https://www.expatindo.org/community/",
    "description": "forum",
    "group": "Indonesia"
  }
];
  SITE.minimumHomeBoards = seededHomeBoards.length;
  SITE.boards = seededHomeBoards;
  SITE.defaultVisibleBoardIds = seededHomeBoards.map(function (board) { return board.id; });
})();
// END synurart-home-board-seed
