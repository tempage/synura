// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "v2ex",
  "displayName": "V2EX",
  "country": "Mainland China",
  "category": "technology community",
  "browserHomeUrl": "https://www.v2ex.com/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "板块",
  "boardSettingsTitle": "板块设置",
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
    "v2ex.com",
    "m.v2ex.com"
  ],
  "acceptLanguage": "zh-CN,zh;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - V2EX",
    " | V2EX",
    " : V2EX"
  ],
  "boards": [
    {
      "id": "home",
      "title": "Home",
      "url": "https://www.v2ex.com/",
      "description": "technology community",
      "group": "Mainland China"
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
      "a.topic-link[href*='/t/']"
    ],
    "listLink": [
      "a.topic-link[href*='/t/']"
    ],
    "listTitle": [
      "a.topic-link[href*='/t/']"
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
    "postDate": [],
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
    "postContent": [".messageText[itemprop='text']", ".message-body .bbWrapper", ".postbody .content", ".ipsType_richText", ".cooked"],
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
    "commentDate": [".fade.small"],
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
  domain: "www.v2ex.com",
  name: "v2ex",
  author: "Synura Team",
  description: "www.v2ex.com",
  version: 0.5,
  api: 0,
  license: "Apache-2.0",
  locale: "zh_CN",
  icon: "https://www.v2ex.com/favicon.ico",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "developers",
    "startups",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/t\/\d+/i
];


var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='/go/']"
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
    memo: firstText(row, selectorList("listCategory", [])),
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
  "/t/"
];
  try {
    if (typeof LIST_LINK_ALLOW_PATTERNS !== "undefined") LIST_LINK_ALLOW_PATTERNS = SITE.linkAllowPatterns;
  } catch (e) {}
  try {
    if (typeof LOCAL_POST_PATTERNS !== "undefined") LOCAL_POST_PATTERNS = [new RegExp("/t/\\d+", "i")];
  } catch (e) {}
  SITE.selectors["listRows"] = [
  ".cell.item",
  ".cell"
];
  SITE.selectors["listLink"] = [
  "a.topic-link[href*='/t/']",
  ".item_title a[href*='/t/']",
  "a[href*='/t/']"
];
  SITE.selectors["listTitle"] = [
  "a.topic-link[href*='/t/']",
  ".item_title a[href*='/t/']",
  "a[href*='/t/']"
];
  SITE.selectors["listAuthor"] = [
  ".topic_info strong a",
  ".dark",
  ".username"
];
  SITE.selectors["listDate"] = [
  ".topic_info",
  ".ago",
  "time[datetime]"
];
  SITE.selectors["listCommentCount"] = [
  ".count_livid",
  ".count_orange",
  ".count_blue"
];
  SITE.selectors["postTitle"] = [
  "h1",
  ".header h1"
];
  SITE.selectors["postAuthor"] = [
  ".header .dark",
  ".dark"
];
  SITE.selectors["postDate"] = [];
  SITE.selectors["postContent"] = [".topic_content.markdown_body", ".topic_content", ".box .topic_content", ".cell .topic_content"];
  SITE.selectors["commentRows"] = [
  ".cell[id^='r_']",
  ".cell[id]",
  ".reply_content"
];
  SITE.selectors["commentContent"] = [
  ".reply_content",
  ".markdown_body"
];
  SITE.selectors["commentAuthor"] = [
  ".dark",
  "strong a"
];
  SITE.selectors["commentDate"] = [".fade.small"];
function v2exOwnText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function v2exOwnNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        var nodes = communityQueryAll(root, selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }
  function v2exOwnFirst(root, selectors) {
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        if (root.matches && root.matches(selectors[i])) return root;
        var node = root.querySelector(selectors[i]);
        if (node) return node;
      } catch (e) {}
    }
    return null;
  }
  function v2exOwnAttr(node, name) {
    try { return node && node.getAttribute ? String(node.getAttribute(name) || "") : ""; } catch (e) { return ""; }
  }
  function v2exOwnAbsolute(href, baseUrl) {
    href = String(href || "").replace(/&amp;/g, "&").trim();
    if (!href) return "";
    try { return ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl) || href; } catch (e) {}
    try { return new URL(href, baseUrl || SITE.browserHomeUrl).href; } catch (e) {}
    return href;
  }
  function v2exOwnAllowed(link) {
    var pattern = "/t/\\d+";
    if (!pattern) return true;
    return new RegExp(pattern, "i").test(String(link || ""));
  }
  function v2exOwnItem(row, baseUrl, index) {
    var linkNode = v2exOwnFirst(row, [
  "a.topic-link[href*='/t/']",
  ".item_title a[href*='/t/']"
]);
    var titleNode = v2exOwnFirst(row, [
  "a.topic-link[href*='/t/']",
  ".item_title a[href*='/t/']"
]) || linkNode || row;
    var link = v2exOwnAbsolute(v2exOwnAttr(linkNode || row, "href"), baseUrl);
    if (!link || !v2exOwnAllowed(link)) return null;
    var title = v2exOwnText(titleNode || linkNode || row);
    title = title.replace(/\s*\[[0-9,.]+\]\s*$/, "").replace(/\s+/g, " ").trim();
    if (!title) return null;
    return {
      id: SITE.siteKey + ":own:" + String(link).replace(/[^A-Za-z0-9]+/g, "_").substring(0, 72),
      link: link,
      title: title,
      author: "",
      avatar: "",
      date: "",
      category: "",
      memo: "",
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
  function v2exOwnParseBoardHtml(html, baseUrl) {
    var doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    var rows = v2exOwnNodes(doc, [
  ".cell.item",
  "a.topic-link[href*='/t/']"
]);
    var out = [];
    var seen = {};
    for (var i = 0; i < rows.length && out.length < 80; i++) {
      var item = v2exOwnItem(rows[i], baseUrl, i);
      if (!item || seen[item.link]) continue;
      seen[item.link] = true;
      out.push(item);
    }
    return out;
  }
  SITE.parseBoardItemsFromHtml = function (html, baseUrl, match, boardPage) {
    return v2exOwnParseBoardHtml(html, baseUrl);
  };
  SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
    return v2exOwnParseBoardHtml(boardPage && boardPage.html ? boardPage.html : "", baseUrl);
  };

  var v2exRegexBoardSpecs = [
  {
    "pattern": "href=[\\\"']([^\\\"']*/t/\\d+[^\\\"']*)[\\\"'][^>]*>([^<]+)</a>",
    "linkGroup": 1,
    "titleGroup": 2
  }
];
  function v2exRegexText(value) {
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
  function v2exRegexAbsolute(href, baseUrl) {
    href = String(href || "").replace(/&amp;/g, "&").trim();
    if (!href) return "";
    try { return ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl) || href; } catch (e) {}
    try { return new URL(href, baseUrl || SITE.browserHomeUrl).href; } catch (e) {}
    return href;
  }
  function v2exRegexBoardId(link) {
    return SITE.siteKey + ":own:" + String(link || "").replace(/[^A-Za-z0-9]+/g, "_").substring(0, 72);
  }
  function v2exRegexItems(html, baseUrl) {
    html = String(html || "");
    var out = [];
    var seen = {};
    for (var s = 0; s < v2exRegexBoardSpecs.length && out.length < 80; s++) {
      var spec = v2exRegexBoardSpecs[s] || {};
      var re = new RegExp(spec.pattern, "gi");
      var match = null;
      while ((match = re.exec(html)) && out.length < 80) {
        var link = v2exRegexAbsolute(match[spec.linkGroup || 1] || "", baseUrl);
        var title = v2exRegexText(match[spec.titleGroup || 2] || "");
        if (!link || !title || seen[link]) continue;
        seen[link] = true;
        out.push({
          id: v2exRegexBoardId(link),
          link: link,
          title: title,
          author: "",
          avatar: "",
          date: "",
          category: "",
          memo: "",
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
  function v2exRegexFetchBoard(url) {
    var response = fetchWithLogging(url, buildFetchOptions());
    if (!response) throw new Error("Failed to fetch " + url + " (0)");
    var html = responseText(response);
    return v2exRegexItems(html, url);
  }
  var v2exRegexPreviousRouteBoardCustom = SITE.routeBoardCustom;
  SITE.routeBoardCustom = function (url, info, match, force) {
    var items = [];
    try { items = v2exRegexFetchBoard(url); } catch (e) {
      if (v2exRegexPreviousRouteBoardCustom) return v2exRegexPreviousRouteBoardCustom(url, info, match, force);
      throw e;
    }
    if (!items.length && v2exRegexPreviousRouteBoardCustom) return v2exRegexPreviousRouteBoardCustom(url, info, match, force);
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
    "id": "all",
    "title": "All",
    "url": "https://www.v2ex.com/?tab=all",
    "description": "technology community",
    "group": "Mainland China"
  },
  {
    "id": "tech",
    "title": "Tech",
    "url": "https://www.v2ex.com/?tab=tech",
    "description": "technology community",
    "group": "Mainland China"
  },
  {
    "id": "creative",
    "title": "Creative",
    "url": "https://www.v2ex.com/?tab=creative",
    "description": "technology community",
    "group": "Mainland China"
  },
  {
    "id": "play",
    "title": "Play",
    "url": "https://www.v2ex.com/?tab=play",
    "description": "technology community",
    "group": "Mainland China"
  },
  {
    "id": "apple",
    "title": "Apple",
    "url": "https://www.v2ex.com/?tab=apple",
    "description": "technology community",
    "group": "Mainland China"
  },
  {
    "id": "jobs",
    "title": "Jobs",
    "url": "https://www.v2ex.com/?tab=jobs",
    "description": "technology community",
    "group": "Mainland China"
  },
  {
    "id": "deals",
    "title": "Deals",
    "url": "https://www.v2ex.com/?tab=deals",
    "description": "technology community",
    "group": "Mainland China"
  },
  {
    "id": "city",
    "title": "City",
    "url": "https://www.v2ex.com/?tab=city",
    "description": "technology community",
    "group": "Mainland China"
  },
  {
    "id": "qna",
    "title": "Q&A",
    "url": "https://www.v2ex.com/?tab=qna",
    "description": "technology community",
    "group": "Mainland China"
  },
  {
    "id": "hot",
    "title": "Hot",
    "url": "https://www.v2ex.com/?tab=hot",
    "description": "technology community",
    "group": "Mainland China"
  }
];
  SITE.minimumHomeBoards = Math.max(parseInt(String(SITE.minimumHomeBoards || 10), 10) || 10, 10);
  SITE.boards = seededHomeBoards;
  SITE.defaultVisibleBoardIds = seededHomeBoards.slice(0, 10).map(function (board) { return board.id; });
})();
// END synurart-home-board-seed

SITE.parsePostDate = function (doc) {
  var metadata = firstNode(doc, [".header .gray"]);
  var value = textOf(metadata);
  var match = value.match(/\bat\s+(.+?)(?:\s*[·•]|$)/);
  return match ? normalizeWhitespace(match[1]) : "";
};
