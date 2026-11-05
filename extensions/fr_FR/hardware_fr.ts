// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "hardware_fr",
  "displayName": "Hardware.fr Forum",
  "country": "France",
  "category": "technology forum",
  "browserHomeUrl": "https://forum.hardware.fr/hfr/Hardware/liste_sujet-1.htm",
  "browserCookieAuth": false,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "Forums",
  "boardSettingsTitle": "Paramètres des forums",
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
    "www.forum.hardware.fr",
    "m.forum.hardware.fr"
  ],
  "acceptLanguage": "fr-FR,fr;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Hardware.fr Forum",
    " | Hardware.fr Forum",
    " : Hardware.fr Forum"
  ],
  "boards": [
    {
      "id": "home",
      "title": "Home",
      "url": "https://forum.hardware.fr/hfr/Hardware/liste_sujet-1.htm",
      "description": "technology forum",
      "group": "France"
    }
  ],
  "selectors": {
    "boardTitle": [
      ".contentTitle",
      ".p-title-value",
      ".ipsType_pageTitle",
      ".forum-title"
    ],
    "listRows": ["tr.sujet"],
    "listLink": ["a.cCatTopic"],
    "listTitle": [
      "a[href*='sujet_']"
    ],
    "listTitleExclude": [
      ".badge",
      ".counter",
      ".stats",
      ".meta"
    ],
    "listAuthor": [".sujetCase6"],
    "listAvatar": [
      ".avatar img",
      ".userAvatarImage"
    ],
    "listDate": [".sujetCase9"],
    "listCommentCount": [".sujetCase7"],
    "listViewCount": [".sujetCase8"],
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
  ]
};

var SYNURA = {
  domain: "forum.hardware.fr",
  name: "hardware_fr",
  author: "Synura Team",
  description: "forum.hardware.fr",
  version: 0.5,
  api: 0,
  license: "Apache-2.0",
  locale: "fr_FR",
  icon: "https://forum.hardware.fr/favicon.ico",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "hardware",
    "technology",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /sujet_\d+_\d+\.htm/i
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
    date: (firstDateText(row, selectorList("listDate", [])).match(/\d{2}-\d{2}-\d{4}\s+à\s+\d{2}:\d{2}/) || [""])[0],
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
  SITE.selectors["postTitle"] = [
  "h1",
  ".sujet_titre",
  "title"
];
  SITE.selectors["postAuthor"] = [
  ".pseudo",
  ".author",
  ".username"
];
  SITE.selectors["postDate"] = [
  ".date",
  "time[datetime]"
];
  SITE.selectors["postContent"] = [
  ".messagetable",
  ".message",
  ".post",
  "td.messCase2",
  "td[id^='para']",
];
  SITE.selectors["commentRows"] = [
  ".messagetable",
  "tr.message",
  "table.message",
  "td.messCase2"
];
  SITE.selectors["commentContent"] = [
  ".message",
  "td.messCase2",
  "td[id^='para']",
  ".post"
];
  SITE.selectors["commentAuthor"] = [
  ".pseudo",
  ".author",
  ".username"
];
  SITE.selectors["commentDate"] = [
  ".date",
  "time[datetime]"
];
  var hardware_frPreviousFilterPostContent = SITE.filterPostContent;
  function hardware_frText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function hardware_frNodes(root, selectors) {
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
  var hardware_frCommentRowSelectors = [
  ".messagetable",
  "tr.message",
  "table.message",
  "td.messCase2"
];
  var hardware_frCommentContentSelectors = [
  ".message",
  "td.messCase2",
  "td[id^='para']",
  ".post"
];
  var hardware_frPreviousFetchPostComments = SITE.fetchPostComments;
  function hardware_frMergeComment(target, seen, item) {
    if (!item || !item.content) return;
    var text = "";
    for (var i = 0; i < item.content.length; i++) text += " " + (item.content[i] && item.content[i].value || "");
    text = text.replace(/\s+/g, " ").trim();
    var key = item.id && item.id.indexOf(":comment:") < 0 ? item.id : JSON.stringify([item.link, item.author, item.date, item.content]);
    if (!item.content.length || seen[key]) return;
    seen[key] = true;
    target.push(item);
  }
  function hardware_frParseVisibleComments(doc, url, target, seen) {
    var rows = localQuerySelectorAll(doc, hardware_frCommentRowSelectors);
    for (var i = 0; i < rows.length; i++) {
      var root = null;
      try { root = firstNode(rows[i], hardware_frCommentContentSelectors); } catch (e) {}
      root = root || rows[i];
      var text = textOf(root);
      var details = [];
      try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
      if (!details.length) details = text ? [{ type: "text", value: text }] : [];
      var domId = "";
      try { domId = attrOf(rows[i], "id"); } catch (e) {}
      hardware_frMergeComment(target, seen, {
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
    for (var i = 0; i < existing.length; i++) hardware_frMergeComment(out, seen, existing[i]);
    try {
      if (hardware_frPreviousFetchPostComments) {
        var fetched = hardware_frPreviousFetchPostComments(match, url, doc, page, existing) || [];
        for (var j = 0; j < fetched.length; j++) hardware_frMergeComment(out, seen, fetched[j]);
      }
    } catch (e) {}
    if (!out.length) hardware_frParseVisibleComments(doc, url, out, seen);

    return out;
  };
})();
// END synurart-own-extension-validation-fix
// BEGIN synurart-home-board-seed
(function () {
  var seededHomeBoards = [
  {
    "id": "liste_sujet_1_htm_ngafmb",
    "title": "Carte mère",
    "url": "https://forum.hardware.fr/hfr/Hardware/carte-mere/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/carte-mere/liste_sujet-1.htm",
    "group": "France"
  },
  {
    "id": "liste_sujet_1_htm_sl5mi2",
    "title": "Mémoire",
    "url": "https://forum.hardware.fr/hfr/Hardware/Memoire/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/Memoire/liste_sujet-1.htm",
    "group": "France"
  },
  {
    "id": "liste_sujet_1_htm_sj76zx",
    "title": "Processeur",
    "url": "https://forum.hardware.fr/hfr/Hardware/Processeur/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/Processeur/liste_sujet-1.htm",
    "group": "France"
  },
  {
    "id": "liste_sujet_1_htm_bjvc68",
    "title": "Carte graphique",
    "url": "https://forum.hardware.fr/hfr/Hardware/2D-3D/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/2D-3D/liste_sujet-1.htm",
    "group": "France"
  },
  {
    "id": "liste_sujet_1_htm_6bhylq",
    "title": "Boitier",
    "url": "https://forum.hardware.fr/hfr/Hardware/Boitier/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/Boitier/liste_sujet-1.htm",
    "group": "France"
  },
  {
    "id": "liste_sujet_1_htm_1lm1zh",
    "title": "Alimentation",
    "url": "https://forum.hardware.fr/hfr/Hardware/Alimentation/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/Alimentation/liste_sujet-1.htm",
    "group": "France"
  },
  {
    "id": "liste_sujet_1_htm_3g9rfo",
    "title": "Disque dur",
    "url": "https://forum.hardware.fr/hfr/Hardware/HDD/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/HDD/liste_sujet-1.htm",
    "group": "France"
  },
  {
    "id": "liste_sujet_1_htm_4lya60",
    "title": "Disque SSD",
    "url": "https://forum.hardware.fr/hfr/Hardware/SSD/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/SSD/liste_sujet-1.htm",
    "group": "France"
  },
  {
    "id": "liste_sujet_1_htm_9n98vz",
    "title": "CD/DVD/BD",
    "url": "https://forum.hardware.fr/hfr/Hardware/lecteur-graveur/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/lecteur-graveur/liste_sujet-1.htm",
    "group": "France"
  },
  {
    "id": "liste_sujet_1_htm_8bgpd0",
    "title": "Mini PC",
    "url": "https://forum.hardware.fr/hfr/Hardware/minipc/liste_sujet-1.htm",
    "description": "https://forum.hardware.fr/hfr/Hardware/minipc/liste_sujet-1.htm",
    "group": "France"
  }
];
  SITE.minimumHomeBoards = Math.max(parseInt(String(SITE.minimumHomeBoards || 10), 10) || 10, 10);
  SITE.boards = seededHomeBoards;
  SITE.defaultVisibleBoardIds = seededHomeBoards.slice(0, 10).map(function (board) { return board.id; });
})();
// END synurart-home-board-seed

// BEGIN verified-reader-boundaries
(function () {
  // Match the original by its source marker. Later pages and identical replies
  // remain replies; neither row position nor message text is a reply identity.
  var rowSelectors = ["table.messagetable"];
  var bodySelectors = ["div[id^=\"para\"]"];
  var authorSelectors = [".messCase1 b"];
  var dateSelectors = [".toolbar .left"];

  function original(row, doc, url) { // HFR's topic URL carries the page index; only its first page contains the opener.
    if (!/_sujet_\d+_1\.htm(?:[?#]|$)|-sujet_\d+_1\.htm(?:[?#]|$)/.test(url) && !/[?&]post=\d+(?:&|$)/.test(url)) return false;
    if (/[?&](?:page|p)=(?:[2-9]|[1-9]\d+)/.test(url)) return false;
    var first = firstNode(doc, ["table.messagetable div[id^='para']"]);
    var body = firstNode(row, bodySelectors);
    return !!body && !!attrOf(first, "id") && attrOf(first, "id") === attrOf(body, "id"); }
  function originalRow(doc, url) {
    var rows = allNodes(doc, rowSelectors);
    for (var i = 0; i < rows.length; i++) if (original(rows[i], doc, url)) return rows[i];
    return null;
  }
  function author(row) { return firstAuthorText(row, authorSelectors); }
  function date(row) { return firstText(row, dateSelectors).replace(/^Posté le\s*/, "").replace(/\s+à\s+/, " "); }
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
