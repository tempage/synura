// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "lobsters",
  "displayName": "Lobsters",
  "country": "United States / United Kingdom",
  "category": "technology community",
  "browserHomeUrl": "https://lobste.rs/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "Boards",
  "boardSettingsTitle": "Board Settings",
  "boardSettingsLargeThreshold": 128,
  "boardSettingsPageSize": 96,
  "boardAddMode": "url_title",
  "hasFullBoardCatalog": false,
  "supportsBoardCatalogSync": true,
  "maxDiscoveredBoards": 256,
  "defaultVisibleBoardIds": [
    "front",
    "active",
    "recent",
    "linux",
    "security",
    "programming",
    "hardware",
    "release",
    "databases",
    "devops"
  ],
  "hostAliases": [
    "www.lobste.rs",
    "m.lobste.rs"
  ],
  "acceptLanguage": "en-US,en;q=0.9",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Lobsters",
    " | Lobsters",
    " : Lobsters"
  ],
  "boards": [
    {
      "id": "front",
      "title": "Front Page",
      "url": "https://lobste.rs/",
      "description": "technology community",
      "group": "United States / United Kingdom"
    },
    {
      "id": "active",
      "title": "Active",
      "url": "https://lobste.rs/active",
      "description": "Active stories",
      "group": "Lobsters"
    },
    {
      "id": "recent",
      "title": "Recent",
      "url": "https://lobste.rs/recent",
      "description": "Recent stories",
      "group": "Lobsters"
    },
    {
      "id": "linux",
      "title": "Linux",
      "url": "https://lobste.rs/t/linux",
      "description": "Linux",
      "group": "Tags"
    },
    {
      "id": "security",
      "title": "Security",
      "url": "https://lobste.rs/t/security",
      "description": "Security",
      "group": "Tags"
    },
    {
      "id": "programming",
      "title": "Programming",
      "url": "https://lobste.rs/t/programming",
      "description": "Programming",
      "group": "Tags"
    },
    {
      "id": "hardware",
      "title": "Hardware",
      "url": "https://lobste.rs/t/hardware",
      "description": "Hardware",
      "group": "Tags"
    },
    {
      "id": "release",
      "title": "Release",
      "url": "https://lobste.rs/t/release",
      "description": "Release",
      "group": "Tags"
    },
    {
      "id": "databases",
      "title": "Databases",
      "url": "https://lobste.rs/t/databases",
      "description": "Databases",
      "group": "Tags"
    },
    {
      "id": "devops",
      "title": "Devops",
      "url": "https://lobste.rs/t/devops",
      "description": "Devops",
      "group": "Tags"
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
      "li.story"
    ],
    "listLink": [
      ".comments_label a",
      "a.mobile_comments"
    ],
    "listTitle": [
      ".link a.u-url",
      ".link a"
    ],
    "listTitleExclude": [
      ".badge",
      ".counter",
      ".stats",
      ".meta"
    ],
    "listAuthor": [
      ".u-author"
    ],
    "listAvatar": [
      "img.avatar"
    ],
    "listDate": [
      "time"
    ],
    "listCommentCount": [
      ".comments_label a"
    ],
    "listViewCount": [
      ".views",
      ".view-count"
    ],
    "listLikeCount": [
      ".upvoter"
    ],
    "listCategory": [
      ".domain",
      ".tags"
    ],
    "listImage": [],
    "postTitle": [
      ".story .link a.u-url",
      ".story .link a"
    ],
    "postAuthor": [
      ".story .u-author"
    ],
    "postAvatar": [
      ".story img.avatar"
    ],
    "postDate": [
      ".story time"
    ],
    "postViewCount": [
      ".view-count"
    ],
    "postLikeCount": [
      ".story .upvoter"
    ],
    "postCategory": [
      ".story .domain",
      ".story .tags"
    ],
    "postContent": [
      ".story_content"
    ],
    "commentRows": [
      ".comment"
    ],
    "commentAuthor": [
      ".byline a[href]"
    ],
    "commentAvatar": [
      "img.avatar"
    ],
    "commentContent": [
      ".comment_text"
    ],
    "commentDate": [
      "time"
    ],
    "commentLikeCount": [
      ".upvoter"
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
  domain: "lobste.rs",
  name: "lobsters",
  author: "Synura Team",
  description: "lobste.rs",
  version: 0.5,
  api: 0,
  license: "Apache-2.0",
  locale: "en_US",
  icon: "https://lobste.rs/favicon.ico",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "technology",
    "programming",
    "news"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/s\/[a-z0-9]+\/[^\/?#]+/i
];


var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href^='/t/']"
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
  var links = node.querySelectorAll(".byline a[href]");
  for (var i = 0; i < links.length; i++) {
    if (/^\/~/.test(attrOf(links[i], "href")) && textOf(links[i])) return textOf(links[i]);
  }
  return "";
}

function localCommentDate(node) {
  return firstDateText(node, selectorList("commentDate", ["time", ".date", ".time"]));
}



function lobstersCommentLevels(doc) {
  var levels = {};
  function visit(node, depth) {
    if (!node || !node.tagName) return;
    var classes = " " + attrOf(node, "class") + " ";
    if (String(node.tagName).toLowerCase() === "ol" && /\scomments\s/.test(classes)) depth += 1;
    if (/\scomment\s/.test(classes)) levels[attrOf(node, "id")] = Math.max(0, depth);
    var children = node.childNodes || [];
    for (var i = 0; i < children.length; i++) visit(children[i], depth);
  }
  visit(doc.querySelector("#story_comments") || doc.querySelector("body"), -1);
  return levels;
}

function localParseComments(doc, postUrl) {
  var seen = {};
  var out = [];
  var rows = allNodes(doc, selectorList("commentRows", []));
  var levels = lobstersCommentLevels(doc);
  for (var i = 0; i < rows.length; i++) {
    var contentRoot = firstNode(rows[i], selectorList("commentContent", []));
    var content = parseDetails(contentRoot, postUrl);
    if (!content || !content.length) continue;
    var key = attrOf(rows[i], "id") || String(i);
    if (seen[key]) continue;
    seen[key] = true;
    var domId = attrOf(rows[i], "id");
    var likeText = firstText(rows[i], selectorList("commentLikeCount", []));
    out.push({
      id: SITE.siteKey + ":comment:" + key,
      link: postUrl + (domId ? ("#" + domId) : ("#comment-" + out.length)),
      author: localCommentAuthor(rows[i]),
      avatar: imageUrlFromNode(firstNode(rows[i], selectorList("commentAvatar", [])), postUrl),
      date: localCommentDate(rows[i]),
      content: content,
      likeCount: hideZeroCount(parseCount(likeText)),
      dislikeCount: "",
      level: levels[domId] || 0,
      menus: [],
      hotCount: toInt(likeText, 0),
      coldCount: 0
    });
  }
  return out;
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

function lobstersParseBoardItems(doc, baseUrl) {
  var rows = allNodes(doc, ["li.story"]);
  var items = [];
  for (var i = 0; i < rows.length && items.length < 40; i++) {
    var row = rows[i];
    var shortId = attrOf(row, "data-shortid") || attrOf(row, "id").replace(/^story_/, "");
    var titleNode = firstNode(row, [".link a.u-url[href]", ".link a[href]"]);
    var discussionNode = firstNode(row, [".comments_label a[href]", "a.mobile_comments[href]"]);
    var title = textOf(titleNode);
    var link = ensureAbsoluteUrl(attrOf(discussionNode, "href"), baseUrl);
    if (!title || !link) continue;
    var score = parseCount(firstText(row, [".upvoter"]));
    var commentCount = parseCount(textOf(discussionNode));
    var domain = firstText(row, [".domain"]);
    items.push({
      id: SITE.siteKey + ":" + (shortId || items.length),
      title: title,
      description: domain || SITE.category || SITE.displayName,
      category: "",
      memo: domain || firstText(row, [".tags"]),
      author: firstText(row, [".u-author", ".hnuser"]),
      avatar: imageUrlFromNode(firstNode(row, ["img.avatar", ".avatar"]), baseUrl),
      date: firstDateText(row, ["time", ".date", ".time"]),
      commentCount: commentCount,
      viewCount: "",
      likeCount: score,
      hotCount: toInt(score, 0),
      coldCount: 0,
      types: ["link"],
      menus: [],
      link: normalizeUrl(link) || link
    });
  }
  return items;
}

SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
  return lobstersParseBoardItems(doc, baseUrl);
};

SITE.parseComments = function (doc, postUrl) {
  return localParseComments(doc, postUrl);
};

SITE.loadDynamicBoards = function (options) {
  if (!options || !options.allowNetwork) return [];
  return (async function () {
      var doc = (await fetchDocument(SITE.browserHomeUrl));
      return localDiscoverBoardRecords(doc, SITE.browserHomeUrl);
  })();
};

SITE.buildNextPageUrl = function (match, url, nextPage) {
  var info = parseAbsoluteUrl(url);
  var path = info.path.replace(/\/page\/\d+\/?$/, "").replace(/\/+$/, "");
  return info.scheme + "://" + info.host + path + "/page/" + nextPage + (info.query ? "?" + info.query : "");
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
  var pageMatch = info.path.match(/\/page\/(\d+)\/?$/);
  var boardUrl = url.replace(/\/page\/\d+\/?(?=\?|$)/, "/");
  var board = localFindConfiguredBoard(boardUrl) || localFindConfiguredBoard(boardUrl.replace(/\/$/, "")) ||
    ensureBoard(localBoardIdFromUrl(boardUrl), boardUrl, localTitleFromBoardUrl(boardUrl));
  return {
    board: board,
    page: pageMatch ? parseInt(pageMatch[1], 10) : 1
  };
};

SITE.postCategoryInMemo = true;
SITE.parsePostMemo = function (doc) {
  return firstText(doc, [".story .domain", ".story .tags"]);
};
SITE.filterPostContent = function (content, url, doc) {
  var titleLink = firstNode(doc, [".story .link a.u-url", ".story .link a"]);
  var target = resolveContentUrl(attrOf(titleLink, "href"), url);
  var details = (content || []).slice();
  if (target && normalizeUrl(target) !== normalizeUrl(url)) {
    details.unshift({ type: "link", value: textOf(titleLink) || target, link: target });
  }
  return details;
};
