// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "overclockzone",
  "displayName": "Overclockzone",
  "country": "Thailand",
  "category": "technology forum",
  "browserHomeUrl": "https://forum.overclockzone.com/forums/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "บอร์ด",
  "boardSettingsTitle": "ตั้งค่าบอร์ด",
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
    "www.forum.overclockzone.com",
    "m.forum.overclockzone.com"
  ],
  "acceptLanguage": "th-TH,th;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Overclockzone",
    " | Overclockzone",
    " : Overclockzone"
  ],
  "boards": [
    {
      "id": "home",
      "title": "Home",
      "url": "https://forum.overclockzone.com/forums/",
      "description": "technology forum",
      "group": "Thailand"
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
      "a[href*='/threads/']",
      "a[href*='showthread.php']"
    ],
    "listLink": [
      "a[href*='/threads/']",
      "a[href*='showthread.php']"
    ],
    "listTitle": [
      "a[href*='/threads/']",
      "a[href*='showthread.php']"
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
  domain: "forum.overclockzone.com",
  name: "overclockzone",
  author: "Synura Team",
  description: "Unofficial Overclockzone.",
  version: 0.2,
  api: 0,
  license: "Apache-2.0",
  locale: "th_TH",
  icon: "https://forum.overclockzone.com/favicon.ico",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "hardware",
    "overclocking",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/threads\/[^\/?#]+/i,
  /showthread\.php\?[^#]*(?:threadid|t)=\d+/i
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
  var raw = String(url || "").split("#")[0];
  var info = parseAbsoluteUrl(raw);
  if (!info) return normalizeUrl(raw) || raw;
  var path = info.path || "/";
  if (/\/forums\/forum\/[^?#]+\/\d+-[^\/?#]+\/?$/i.test(path)) {
    return info.scheme + "://" + info.host + path.replace(/\/$/, "");
  }
  return normalizeUrl(raw) || raw;
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
    if (/\bb-post--first\b/.test(attrOf(rows[i], "class"))) continue;
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
  var url = localCanonicalizeUrl(localUrlFromInfo(info));
  if (!localLooksLikePostUrl(url)) return null;
  return {
    board: localBoardForUrl(url),
    postId: localPostIdFromUrl(url),
    page: queryInt(info.query, "page", 1)
  };
};

SITE.buildPostFetchUrls = function (match, currentUrl) {
  return [localCanonicalizeUrl(currentUrl)];
};

SITE.matchBoard = function (info) {
  if (!info || !isKnownHost(info.host)) return null;
  var url = localCanonicalizeUrl(localUrlFromInfo(info));
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
  "/forums/forum/.+/\\d+"
];
  try {
    if (typeof LIST_LINK_ALLOW_PATTERNS !== "undefined") LIST_LINK_ALLOW_PATTERNS = SITE.linkAllowPatterns;
  } catch (e) {}
  try {
    if (typeof LOCAL_POST_PATTERNS !== "undefined") LOCAL_POST_PATTERNS = [new RegExp("/forums/forum/.+/\\d+", "i")];
  } catch (e) {}
  SITE.selectors["listRows"] = [
  "a.lastpost-title[href]",
  "a[href*='/forums/forum/'][href*='/1']",
  ".forum-item"
];
  SITE.selectors["listLink"] = [
  "a.lastpost-title[href]",
  "a[href*='/forums/forum/'][href*='/1']"
];
  SITE.selectors["listTitle"] = [
  "a.lastpost-title[href]",
  "a[href*='/forums/forum/'][href*='/1']"
];
  SITE.selectors["listAuthor"] = [
  ".author",
  ".username",
  ".member"
];
  SITE.selectors["listDate"] = [
  "time[datetime]",
  ".date",
  ".time"
];
  SITE.selectors["listCommentCount"] = [
  ".replies",
  ".replycount",
  ".stats"
];
  SITE.selectors["listViewCount"] = [
  ".views",
  ".viewcount",
  ".stats"
];
  SITE.selectors["postTitle"] = [
  "h1",
  ".threadtitle",
  ".post-title"
];
  SITE.selectors["postAuthor"] = [
  ".username",
  ".bigusername",
  ".author"
];
  SITE.selectors["postDate"] = [
  "time[datetime]",
  ".postdate",
  ".date"
];
  SITE.selectors["postContent"] = [
  ".js-post__content-text",
  ".b-post__content",
  ".post-content",
  ".topic-content",
  ".post",
  "article",
  "body"
];
  SITE.selectors["commentRows"] = [
  "table[id^='post']",
  "li[id^='post']",
  "div[id^='post_']",
  "td[id^='td_post_']",
  ".postbit"
];
  SITE.selectors["commentContent"] = [
  "div[id^='post_message_']",
  "td[id^='postmessage_']",
  ".post_message",
  ".postbody",
  "td[id^='td_post_']"
];
  SITE.selectors["commentAuthor"] = [
  ".bigusername",
  ".username",
  ".author"
];
  SITE.selectors["commentDate"] = [
  "time[datetime]",
  ".postdate",
  ".date"
];
  var overclockzonePostContentSelectors = [
  ".js-post__content-text",
  ".b-post__content",
  ".post-content",
  ".topic-content",
  ".post",
  "article",
  "body"
];
  var overclockzonePreviousFilterPostContent = SITE.filterPostContent;
  function overclockzoneText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function overclockzoneNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && selectors && i < selectors.length; i++) {
      try {
        var nodes = root.querySelectorAll(selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }
  function overclockzoneDetailsFromRoot(root, url) {
    if (!root) return [];
    var text = overclockzoneText(root);
    if (text.length < 2) return [];
    var details = [];
    try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
    if (!details.length) details = [{ type: "text", value: text.substring(0, 4000) }];
    return details;
  }
  SITE.filterPostContent = function (content, url, doc, page, match) {
    var previous = [];
    try {
      if (overclockzonePreviousFilterPostContent) previous = overclockzonePreviousFilterPostContent(content, url, doc, page, match) || [];
    } catch (e) {}
    var nodes = overclockzoneNodes(doc, overclockzonePostContentSelectors);
    var seen = {};
    var out = [];
    for (var i = 0; i < nodes.length && out.length < 80; i++) {
      var text = overclockzoneText(nodes[i]);
      var key = text.substring(0, 220).toLowerCase();
      if (!key || seen[key]) continue;
      seen[key] = true;
      var details = overclockzoneDetailsFromRoot(nodes[i], url);
      for (var j = 0; j < details.length && out.length < 80; j++) out.push(details[j]);
      if (out.length && overclockzonePostContentSelectors[i] !== "body") break;
    }
    if (!out.length) out = previous;
    if (!out.length) {
      var title = "";
      try { title = firstNonEmpty([firstText(doc, SITE.selectors.postTitle || []), firstText(doc, ["meta[property='og:description']", "meta[name='description']", "title"])]); } catch (e) {}
      if (title) out = [{ type: "text", value: title }];
    }
    return out;
  };
  var overclockzoneCommentRowSelectors = [
  "table[id^='post']",
  "li[id^='post']",
  "div[id^='post_']",
  "td[id^='td_post_']",
  ".postbit"
];
  var overclockzoneCommentContentSelectors = [
  "div[id^='post_message_']",
  "td[id^='postmessage_']",
  ".post_message",
  ".postbody",
  "td[id^='td_post_']"
];
  var overclockzoneCommentSummarySelectors = [
  ".replies",
  ".replycount",
  ".stats",
  "table[id^='post']",
  "li[id^='post']",
  "div[id^='post_']",
  "td[id^='td_post_']",
  ".postbit",
  "h1",
  ".threadtitle",
  ".post-title"
];
  var overclockzonePreviousFetchPostComments = SITE.fetchPostComments;
  function overclockzoneMergeComment(target, seen, item) {
    if (!item || !item.content) return;
    var text = "";
    for (var i = 0; i < item.content.length; i++) text += " " + (item.content[i] && item.content[i].value || "");
    text = text.replace(/\s+/g, " ").trim();
    var key = text.substring(0, 220).toLowerCase();
    if (!key || seen[key]) return;
    seen[key] = true;
    target.push(item);
  }
  function overclockzoneParseVisibleComments(doc, url, target, seen) {
    var rows = overclockzoneNodes(doc, overclockzoneCommentRowSelectors);
    for (var i = 0; i < rows.length && target.length < 80; i++) {
      var root = null;
      try { root = firstNode(rows[i], overclockzoneCommentContentSelectors); } catch (e) {}
      root = root || rows[i];
      var text = overclockzoneText(root);
      if (text.length < 2 || text.length > 5000) continue;
      var details = [];
      try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
      if (!details.length) details = [{ type: "text", value: text.substring(0, 4000) }];
      var domId = "";
      try { domId = attrOf(rows[i], "id"); } catch (e) {}
      overclockzoneMergeComment(target, seen, {
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
    for (var i = 0; i < existing.length; i++) overclockzoneMergeComment(out, seen, existing[i]);
    try {
      if (overclockzonePreviousFetchPostComments) {
        var fetched = overclockzonePreviousFetchPostComments(match, url, doc, page, existing) || [];
        for (var j = 0; j < fetched.length; j++) overclockzoneMergeComment(out, seen, fetched[j]);
      }
    } catch (e) {}
    if (!out.length) overclockzoneParseVisibleComments(doc, url, out, seen);
    if (!out.length) {
      var summary = "";
      try { summary = firstNonEmpty([firstText(doc, overclockzoneCommentSummarySelectors), firstText(doc, SITE.selectors.postTitle || []), firstText(doc, ["title"])]); } catch (e) {}
      summary = String(summary || SITE.displayName || "Comments").replace(/\s+/g, " ").trim();
      if (summary) overclockzoneMergeComment(out, seen, {
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
function overclockzoneOwnText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function overclockzoneOwnNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        var nodes = root.querySelectorAll(selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }
  function overclockzoneOwnFirst(root, selectors) {
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        if (root.matches && root.matches(selectors[i])) return root;
        var node = root.querySelector(selectors[i]);
        if (node) return node;
      } catch (e) {}
    }
    return null;
  }
  function overclockzoneOwnAttr(node, name) {
    try { return node && node.getAttribute ? String(node.getAttribute(name) || "") : ""; } catch (e) { return ""; }
  }
  function overclockzoneOwnAbsolute(href, baseUrl) {
    href = String(href || "").replace(/&amp;/g, "&").trim();
    if (!href) return "";
    try { return ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl) || href; } catch (e) {}
    try { return new URL(href, baseUrl || SITE.browserHomeUrl).href; } catch (e) {}
    return href;
  }
  function overclockzoneOwnAllowed(link) {
    var pattern = "/forums/forum/.+/\\d+";
    if (!pattern) return true;
    return new RegExp(pattern, "i").test(String(link || ""));
  }
  function overclockzoneOwnItem(row, baseUrl, index) {
    var linkNode = overclockzoneOwnFirst(row, [
  "a.lastpost-title[href]",
  "a[href*='/forums/forum/'][href*='/1']"
]);
    var titleNode = overclockzoneOwnFirst(row, [
  "a.lastpost-title[href]",
  "a[href*='/forums/forum/'][href*='/1']"
]) || linkNode || row;
    var link = overclockzoneOwnAbsolute(overclockzoneOwnAttr(linkNode || row, "href"), baseUrl);
    if (!link || !overclockzoneOwnAllowed(link)) return null;
    var title = overclockzoneOwnText(titleNode || linkNode || row);
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
  function overclockzoneOwnParseBoardHtml(html, baseUrl) {
    var doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    var rows = overclockzoneOwnNodes(doc, [
  "a.lastpost-title[href]",
  "a[href*='/forums/forum/'][href*='/1']"
]);
    var out = [];
    var seen = {};
    for (var i = 0; i < rows.length && out.length < 80; i++) {
      var item = overclockzoneOwnItem(rows[i], baseUrl, i);
      if (!item || seen[item.link]) continue;
      seen[item.link] = true;
      out.push(item);
    }
    return out;
  }
  SITE.parseBoardItemsFromHtml = function (html, baseUrl, match, boardPage) {
    return overclockzoneOwnParseBoardHtml(html, baseUrl);
  };
  SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
    return overclockzoneOwnParseBoardHtml(boardPage && boardPage.html ? boardPage.html : "", baseUrl);
  };

  var overclockzoneRegexBoardSpecs = [
  {
    "pattern": "href=[\\\"']([^\\\"']*/forums/forum/[^\\\"']*/\\d+[^\\\"']*)[\\\"'][^>]*class=[\\\"'][^\\\"']*lastpost-title[^\\\"']*[\\\"'][^>]*>([\\s\\S]*?)</a>",
    "linkGroup": 1,
    "titleGroup": 2
  }
];
  function overclockzoneRegexText(value) {
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
  function overclockzoneRegexAbsolute(href, baseUrl) {
    href = String(href || "").replace(/&amp;/g, "&").trim();
    if (!href) return "";
    try { return ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl) || href; } catch (e) {}
    try { return new URL(href, baseUrl || SITE.browserHomeUrl).href; } catch (e) {}
    return href;
  }
  function overclockzoneRegexBoardId(link) {
    return SITE.siteKey + ":own:" + String(link || "").replace(/[^A-Za-z0-9]+/g, "_").substring(0, 72);
  }
  function overclockzoneRegexItems(html, baseUrl) {
    html = String(html || "");
    var out = [];
    var seen = {};
    for (var s = 0; s < overclockzoneRegexBoardSpecs.length && out.length < 80; s++) {
      var spec = overclockzoneRegexBoardSpecs[s] || {};
      var re = new RegExp(spec.pattern, "gi");
      var match = null;
      while ((match = re.exec(html)) && out.length < 80) {
        var link = overclockzoneRegexAbsolute(match[spec.linkGroup || 1] || "", baseUrl);
        var title = overclockzoneRegexText(match[spec.titleGroup || 2] || "");
        if (!link || !title || title.length < 2 || seen[link]) continue;
        seen[link] = true;
        out.push({
          id: overclockzoneRegexBoardId(link),
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
  function overclockzoneRegexFetchBoard(url) {
    var response = fetchWithLogging(url, buildFetchOptions());
    if (!response) throw new Error("Failed to fetch " + url + " (0)");
    var html = responseText(response);
    return overclockzoneRegexItems(html, url);
  }
  var overclockzoneRegexPreviousRouteBoardCustom = SITE.routeBoardCustom;
  SITE.routeBoardCustom = function (url, info, match, force) {
    var items = [];
    try { items = overclockzoneRegexFetchBoard(url); } catch (e) {
      if (overclockzoneRegexPreviousRouteBoardCustom) return overclockzoneRegexPreviousRouteBoardCustom(url, info, match, force);
      throw e;
    }
    if (!items.length && overclockzoneRegexPreviousRouteBoardCustom) return overclockzoneRegexPreviousRouteBoardCustom(url, info, match, force);
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
// BEGIN synurart-home-board-seed
(function () {
  var seededHomeBoards = [
  {
    "id": "game_forums_dtivf0",
    "title": "Game Forums",
    "url": "https://forum.overclockzone.com/forums/forum/game-forums",
    "description": "https://forum.overclockzone.com/forums/forum/game-forums",
    "group": "Thailand"
  },
  {
    "id": "hardware_zone_i737nc",
    "title": "Hardware Zone",
    "url": "https://forum.overclockzone.com/forums/forum/hardware-zone",
    "description": "https://forum.overclockzone.com/forums/forum/hardware-zone",
    "group": "Thailand"
  },
  {
    "id": "software_10j0sg",
    "title": "Software",
    "url": "https://forum.overclockzone.com/forums/forum/software",
    "description": "https://forum.overclockzone.com/forums/forum/software",
    "group": "Thailand"
  },
  {
    "id": "mobile_device_e6ixw8",
    "title": "Mobile Device",
    "url": "https://forum.overclockzone.com/forums/forum/mobile-device",
    "description": "https://forum.overclockzone.com/forums/forum/mobile-device",
    "group": "Thailand"
  },
  {
    "id": "data_center_xcimcf",
    "title": "Data center",
    "url": "https://forum.overclockzone.com/forums/forum/data-center",
    "description": "https://forum.overclockzone.com/forums/forum/data-center",
    "group": "Thailand"
  },
  {
    "id": "show_it_off_3q9eho",
    "title": "Show It Off !!",
    "url": "https://forum.overclockzone.com/forums/forum/show-it-off",
    "description": "https://forum.overclockzone.com/forums/forum/show-it-off",
    "group": "Thailand"
  },
  {
    "id": "marketplace_kns3ki",
    "title": "Marketplace",
    "url": "https://forum.overclockzone.com/forums/forum/marketplace",
    "description": "https://forum.overclockzone.com/forums/forum/marketplace",
    "group": "Thailand"
  }
 ];
  SITE.minimumHomeBoards = seededHomeBoards.length;
  SITE.boards = seededHomeBoards;
  SITE.defaultVisibleBoardIds = seededHomeBoards.map(function (board) { return board.id; });
})();
// END synurart-home-board-seed
