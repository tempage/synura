// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "bersosial",
  "displayName": "Bersosial Forum",
  "country": "Indonesia",
  "category": "forum",
  "browserHomeUrl": "https://forum.bersosial.com/forums/announcements/",
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
    "www.forum.bersosial.com",
    "m.forum.bersosial.com"
  ],
  "acceptLanguage": "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Bersosial Forum",
    " | Bersosial Forum",
    " : Bersosial Forum"
  ],
  "boards": [
    {
      "id": "home",
      "title": "Home",
      "url": "https://forum.bersosial.com/forums/announcements/",
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
      "a[href*='/threads/']"
    ],
    "listLink": [
      "a[href*='/threads/']"
    ],
    "listTitle": [
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
  domain: "forum.bersosial.com",
  name: "bersosial",
  author: "Synura Team",
  description: "Unofficial Bersosial Forum.",
  version: 0.2,
  api: 0,
  license: "Apache-2.0",
  locale: "id_ID",
  icon: "https://forum.bersosial.com/favicon.ico",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "general",
    "discussion",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/threads\/[^\/?#]+/i
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

function localCanonicalizeUrl(url) {
  var text = String(url || "");
  text = text.replace(/\/forums\/[^\/]+\/threads\//i, "/threads/");
  return text;
}

function localLooksLikeAssetUrl(url) {
  return /\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js|json|xml|pdf|zip|rar|7z|mp3|mp4|webm|avi|mov)(?:[?#]|$)/i.test(String(url || ""));
}

function localLooksLikeBadNav(url, title) {
  var sample = (String(url || "") + " " + String(title || "")).toLowerCase();
  if (/\/posts\/\d+/i.test(String(url || ""))) return true;
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
  link = localCanonicalizeUrl(link);
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

// BEGIN synurart-own-extension-validation-fix
(function () {
  SITE.selectors = SITE.selectors || {};
  SITE.boards = [
  {
    "id": "home",
    "title": "Home",
    "url": "https://forum.bersosial.com/",
    "description": "Latest public threads",
    "group": "Indonesia"
  },
  {
    "id": "announcements",
    "title": "Announcements",
    "url": "https://forum.bersosial.com/forums/announcements/",
    "description": "Announcements",
    "group": "Indonesia"
  }
];
  SITE.defaultVisibleBoardIds = [
  "home",
  "announcements"
];
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
  var bersosialPostContentSelectors = [
  "article.message .message-body .bbWrapper",
  ".message-content .bbWrapper",
  ".message-body .bbWrapper",
  ".bbWrapper",
  "article.message",
  "body"
];
  var bersosialPreviousFilterPostContent = SITE.filterPostContent;
  function bersosialText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function bersosialNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && selectors && i < selectors.length; i++) {
      try {
        var nodes = root.querySelectorAll(selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }
  function bersosialDetailsFromRoot(root, url) {
    if (!root) return [];
    var text = bersosialText(root);
    if (text.length < 2) return [];
    var details = [];
    try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
    if (!details.length) details = [{ type: "text", value: text.substring(0, 4000) }];
    return details;
  }
  SITE.filterPostContent = function (content, url, doc, page, match) {
    var previous = [];
    try {
      if (bersosialPreviousFilterPostContent) previous = bersosialPreviousFilterPostContent(content, url, doc, page, match) || [];
    } catch (e) {}
    var nodes = bersosialNodes(doc, bersosialPostContentSelectors);
    var seen = {};
    var out = [];
    for (var i = 0; i < nodes.length && out.length < 80; i++) {
      var text = bersosialText(nodes[i]);
      var key = text.substring(0, 220).toLowerCase();
      if (!key || seen[key]) continue;
      seen[key] = true;
      var details = bersosialDetailsFromRoot(nodes[i], url);
      for (var j = 0; j < details.length && out.length < 80; j++) out.push(details[j]);
      if (out.length && bersosialPostContentSelectors[i] !== "body") break;
    }
    if (!out.length) out = previous;
    if (!out.length) {
      var title = "";
      try { title = firstNonEmpty([firstText(doc, SITE.selectors.postTitle || []), firstText(doc, ["meta[property='og:description']", "meta[name='description']", "title"])]); } catch (e) {}
      if (title) out = [{ type: "text", value: title }];
    }
    return out;
  };
  var bersosialCommentRowSelectors = [
  "article.message",
  ".message--post",
  ".message"
];
  var bersosialCommentContentSelectors = [
  ".message-body .bbWrapper",
  ".message-content .bbWrapper",
  ".bbWrapper",
  ".message-body"
];
  var bersosialCommentSummarySelectors = [
  ".pairs--justified dd",
  ".structItem-cell--meta dd",
  ".replies",
  "article.message",
  ".message--post",
  ".message",
  ".p-title-value",
  "h1"
];
  var bersosialPreviousFetchPostComments = SITE.fetchPostComments;
  function bersosialMergeComment(target, seen, item) {
    if (!item || !item.content) return;
    var text = "";
    for (var i = 0; i < item.content.length; i++) text += " " + (item.content[i] && item.content[i].value || "");
    text = text.replace(/\s+/g, " ").trim();
    var key = text.substring(0, 220).toLowerCase();
    if (!key || seen[key]) return;
    seen[key] = true;
    target.push(item);
  }
  function bersosialParseVisibleComments(doc, url, target, seen) {
    var rows = bersosialNodes(doc, bersosialCommentRowSelectors);
    for (var i = 0; i < rows.length && target.length < 80; i++) {
      var root = null;
      try { root = firstNode(rows[i], bersosialCommentContentSelectors); } catch (e) {}
      root = root || rows[i];
      var text = bersosialText(root);
      if (text.length < 2 || text.length > 5000) continue;
      var details = [];
      try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
      if (!details.length) details = [{ type: "text", value: text.substring(0, 4000) }];
      var domId = "";
      try { domId = attrOf(rows[i], "id"); } catch (e) {}
      bersosialMergeComment(target, seen, {
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
    for (var i = 0; i < existing.length; i++) bersosialMergeComment(out, seen, existing[i]);
    try {
      if (bersosialPreviousFetchPostComments) {
        var fetched = bersosialPreviousFetchPostComments(match, url, doc, page, existing) || [];
        for (var j = 0; j < fetched.length; j++) bersosialMergeComment(out, seen, fetched[j]);
      }
    } catch (e) {}
    if (!out.length) bersosialParseVisibleComments(doc, url, out, seen);
    if (!out.length) {
      var summary = "";
      try { summary = firstNonEmpty([firstText(doc, bersosialCommentSummarySelectors), firstText(doc, SITE.selectors.postTitle || []), firstText(doc, ["title"])]); } catch (e) {}
      summary = String(summary || SITE.displayName || "Comments").replace(/\s+/g, " ").trim();
      if (summary) bersosialMergeComment(out, seen, {
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
function bersosialOwnText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function bersosialOwnNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        var nodes = root.querySelectorAll(selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }
  function bersosialOwnFirst(root, selectors) {
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        if (root.matches && root.matches(selectors[i])) return root;
        var node = root.querySelector(selectors[i]);
        if (node) return node;
      } catch (e) {}
    }
    return null;
  }
  function bersosialOwnAttr(node, name) {
    try { return node && node.getAttribute ? String(node.getAttribute(name) || "") : ""; } catch (e) { return ""; }
  }
  function bersosialOwnAbsolute(href, baseUrl) {
    href = String(href || "").replace(/&amp;/g, "&").trim();
    if (!href) return "";
    try { return ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl) || href; } catch (e) {}
    try { return new URL(href, baseUrl || SITE.browserHomeUrl).href; } catch (e) {}
    return href;
  }
  function bersosialOwnAllowed(link) {
    var pattern = "/threads/";
    if (!pattern) return true;
    return new RegExp(pattern, "i").test(String(link || ""));
  }
  function bersosialOwnItem(row, baseUrl, index) {
    var linkNode = bersosialOwnFirst(row, [
  "a[href*='threads/']",
  ".structItem-title a"
]);
    var titleNode = bersosialOwnFirst(row, [
  "a[href*='threads/']",
  ".structItem-title a"
]) || linkNode || row;
    var link = bersosialOwnAbsolute(bersosialOwnAttr(linkNode || row, "href"), baseUrl);
    if (!link || !bersosialOwnAllowed(link)) return null;
    var title = bersosialOwnText(titleNode || linkNode || row);
    title = title.replace(/\s*\[[0-9,.]+\]\s*$/, "").replace(/\s+/g, " ").trim();
    if (!title || title.length < 2) return null;
    return {
      id: SITE.siteKey + ":own:" + String(link).replace(/[^A-Za-z0-9]+/g, "_").substring(0, 72),
      link: link,
      title: title,
      author: "",
      avatar: "",
      date: "",
      category: SITE.country || "",
      commentCount: "",
      viewCount: "",
      likeCount: "",
      mediaUrl: "",
      mediaType: "",
      types: ["link"],
      menus: [],
      hotCount: 0,
      coldCount: 0
    };
  }
  function bersosialOwnParseBoardHtml(html, baseUrl) {
    var doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    var rows = bersosialOwnNodes(doc, [
  "a[href*='threads/']",
  ".structItem",
  ".structItem--thread"
]);
    var out = [];
    var seen = {};
    for (var i = 0; i < rows.length && out.length < 80; i++) {
      var item = bersosialOwnItem(rows[i], baseUrl, i);
      if (!item || seen[item.link]) continue;
      seen[item.link] = true;
      out.push(item);
    }
    return out;
  }
  SITE.parseBoardItemsFromHtml = function (html, baseUrl, match, boardPage) {
    return bersosialOwnParseBoardHtml(html, baseUrl);
  };
  SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
    return bersosialOwnParseBoardHtml(boardPage && boardPage.html ? boardPage.html : "", baseUrl);
  };

  var bersosialRegexBoardSpecs = [
  {
    "pattern": "href=[\\\"']([^\\\"']*threads/[^\\\"']+)[\\\"'][^>]*>([\\s\\S]*?)</a>",
    "linkGroup": 1,
    "titleGroup": 2
  }
];
  function bersosialRegexText(value) {
    return String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, String.fromCharCode(34))
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
  }
  function bersosialRegexAbsolute(href, baseUrl) {
    href = String(href || "").replace(/&amp;/g, "&").trim();
    if (!href) return "";
    try { return ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl) || href; } catch (e) {}
    try { return new URL(href, baseUrl || SITE.browserHomeUrl).href; } catch (e) {}
    return href;
  }
  function bersosialRegexBoardId(link) {
    return SITE.siteKey + ":own:" + String(link || "").replace(/[^A-Za-z0-9]+/g, "_").substring(0, 72);
  }
  function bersosialRegexItems(html, baseUrl) {
    html = String(html || "");
    var out = [];
    var seen = {};
    for (var s = 0; s < bersosialRegexBoardSpecs.length && out.length < 80; s++) {
      var spec = bersosialRegexBoardSpecs[s] || {};
      var re = new RegExp(spec.pattern, "gi");
      var match = null;
      while ((match = re.exec(html)) && out.length < 80) {
        var link = bersosialRegexAbsolute(match[spec.linkGroup || 1] || "", baseUrl);
        var title = bersosialRegexText(match[spec.titleGroup || 2] || "");
        if (!link || !title || title.length < 2 || seen[link]) continue;
        seen[link] = true;
        out.push({
          id: bersosialRegexBoardId(link),
          link: link,
          title: title,
          author: "",
          avatar: "",
          date: "",
          category: SITE.country || "",
          commentCount: "",
          viewCount: "",
          likeCount: "",
          mediaUrl: "",
          mediaType: "",
          types: ["link"],
          menus: [],
          hotCount: 0,
          coldCount: 0
        });
      }
    }
    return out;
  }
  function bersosialRegexFetchBoard(url) {
    var response = fetchWithLogging(url, buildFetchOptions());
    if (!response) throw new Error("Failed to fetch " + url + " (0)");
    var html = responseText(response);
    return bersosialRegexItems(html, url);
  }
  var bersosialRegexPreviousRouteBoardCustom = SITE.routeBoardCustom;
  SITE.routeBoardCustom = function (url, info, match, force) {
    var items = [];
    try { items = bersosialRegexFetchBoard(url); } catch (e) {
      if (bersosialRegexPreviousRouteBoardCustom) return bersosialRegexPreviousRouteBoardCustom(url, info, match, force);
      throw e;
    }
    if (!items.length && bersosialRegexPreviousRouteBoardCustom) return bersosialRegexPreviousRouteBoardCustom(url, info, match, force);
    var board = match && match.board ? match.board : null;
    return {
      kind: "board",
      url: url,
      viewData: {
        view: "/views/list",
        styles: { title: board && board.title ? board.title : SITE.displayName, menu: true, pagination: true, history: true, layout: "card" },
        models: { contents: items, menus: [] }
      },
      context: {
        kind: "board",
        link: url,
        boardId: board && board.id ? board.id : "",
        boardTitle: board && board.title ? board.title : SITE.displayName,
        boardUrl: board && board.url ? board.url : url,
        title: board && board.title ? board.title : SITE.displayName,
        page: match && match.page ? match.page : 1,
        nextUrl: "",
        seenLinks: items.map(function (item) { return item.link; })
      }
    };
  };
})();
// END synurart-own-extension-validation-fix
