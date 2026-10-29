// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "headlightmag",
  "displayName": "Headlightmag",
  "country": "Thailand",
  "category": "automotive and car community forum",
  "browserHomeUrl": "https://community.headlightmag.com/",
  "browserCookieAuth": false,
  "textEncoding": "tis-620",
  "minimumHomeBoards": 4,
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
    "board_1",
    "board_8",
    "board_7",
    "board_3"
  ],
  "hostAliases": [
    "headlightmag.com",
    "www.headlightmag.com"
  ],
  "acceptLanguage": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
  "fetchHeaders": {
    "Accept": "*/*",
    "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Headlightmag.com",
    " - Headlightmag",
    " | Headlightmag"
  ],
  "boards": [
    {
      "id": "board_1",
      "title": "The Coup Channel",
      "url": "https://community.headlightmag.com/index.php?board=1.0",
      "description": "ข่าวสารยานยนต์ พูดคุยเรื่องรถยนต์ใหม่",
      "group": "รถยนต์"
    },
    {
      "id": "board_8",
      "title": "User's Voice",
      "url": "https://community.headlightmag.com/index.php?board=8.0",
      "description": "รีวิวจากผู้ใช้จริง ข้อเสนอแนะ",
      "group": "รถยนต์"
    },
    {
      "id": "board_7",
      "title": "General Discussion",
      "url": "https://community.headlightmag.com/index.php?board=7.0",
      "description": "พูดคุยเรื่องทั่วไป สัพเพเหระ",
      "group": "ทั่วไป"
    },
    {
      "id": "board_3",
      "title": "Technical & Tuning",
      "url": "https://community.headlightmag.com/index.php?board=3.0",
      "description": "ปัญหาเทคนิค บำรุงรักษา ปรับแต่ง",
      "group": "เทคนิค"
    }
  ],
  "selectors": {
    "boardTitle": [
      "h3.catbg",
      "title"
    ],
    "listRows": [
      "table.table_grid tbody tr",
      "tr.windowbg",
      "tr.windowbg2",
      "tr.stickybg"
    ],
    "listLink": [
      "td.subject span[id^='msg_'] a",
      "td.subject a"
    ],
    "listTitle": [
      "td.subject span[id^='msg_'] a",
      "td.subject a"
    ],
    "listTitleExclude": [
      ".new_posts",
      ".navPages",
      "small"
    ],
    "listAuthor": [
      "td.subject p a",
      "td.subject a[title*='ดูรายละเอียด']",
      ".lastpost a:last-child"
    ],
    "listAvatar": [],
    "listDate": [
      "td.lastpost"
    ],
    "listCommentCount": [
      "td.stats strong:first-child",
      "td.stats"
    ],
    "listViewCount": [
      "td.stats strong:nth-of-type(2)"
    ],
    "listLikeCount": [],
    "listCategory": [],
    "listImage": [],
    "postTitle": [
      "h5[id^='subject_'] a",
      "h5[id^='subject_']",
      "title"
    ],
    "postAuthor": [
      ".poster h4 a",
      ".poster h4",
      ".poster a"
    ],
    "postAvatar": [
      ".poster .avatar img",
      ".poster img.avatar"
    ],
    "postDate": [
      ".keyinfo .smalltext"
    ],
    "postViewCount": [],
    "postLikeCount": [],
    "postCategory": [],
    "postContent": [
      ".post .inner",
      "div[id^='msg_']"
    ],
    "commentRows": [
      ".post_wrapper"
    ],
    "commentAuthor": [
      ".poster h4 a",
      ".poster h4",
      ".poster a"
    ],
    "commentAvatar": [
      ".poster .avatar img",
      ".poster img.avatar"
    ],
    "commentContent": [
      ".post .inner",
      "div[id^='msg_']"
    ],
    "commentDate": [
      ".keyinfo .smalltext"
    ],
    "commentLikeCount": [],
    "commentLevel": []
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
  domain: "community.headlightmag.com",
  name: "headlightmag",
  author: "Synura Team",
  description: "community.headlightmag.com",
  version: 0.1,
  api: 0,
  license: "Apache-2.0",
  locale: "th_TH",
  icon: "https://community.headlightmag.com/favicon.ico",
  bypass: "chrome/windows",
  deeplink: true,
  tags: [
    "thailand",
    "cars",
    "automotive",
    "community",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/index\.php\?topic=\d+/i,
  /\btopic=\d+/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='board=']"
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
  return String(url || "").split("#")[0];
}

function localLooksLikeAssetUrl(url) {
  return /\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js|json|xml|pdf|zip|rar|7z)(?:[?#]|$)/i.test(String(url || ""));
}

function localLooksLikePostUrl(url) {
  var full = String(url || "");
  for (var i = 0; i < LOCAL_POST_PATTERNS.length; i++) {
    if (LOCAL_POST_PATTERNS[i].test(full)) return true;
  }
  return false;
}

function localTitleFromNode(node) {
  var title = textOf(node);
  if (!title) title = attrOf(node, "title");
  if (!title) title = attrOf(node, "aria-label");
  return normalizeWhitespace(title).replace(/\s*\[[0-9,]+\]\s*$/, "");
}

function localTitleFromBoardUrl(url) {
  var match = String(url || "").match(/board=(\d+)/i);
  if (match) return "Board " + match[1];
  return "บอร์ด";
}

function localBoardIdFromUrl(url) {
  var match = String(url || "").match(/board=(\d+)/i);
  if (match) return "board_" + match[1];
  return "home";
}

function localPostIdFromUrl(url) {
  var match = String(url || "").match(/topic=(\d+)/i);
  if (match) return match[1];
  return "0";
}

function localFindConfiguredBoard(url) {
  var normalized = normalizeUrl(url) || url;
  var boards = SITE.boards || [];
  for (var i = 0; i < boards.length; i++) {
    var boardUrl = normalizeUrl(boards[i].url) || ensureAbsoluteUrl(boards[i].url, SITE.browserHomeUrl);
    if (boardUrl && (boardUrl === normalized || normalized.indexOf(boardUrl) === 0)) return boardById(boards[i].id) || boards[i];
  }
  return null;
}

function localBoardForUrl(url) {
  var configured = localFindConfiguredBoard(url);
  if (configured) return configured;
  return ensureBoard(localBoardIdFromUrl(url), url, localTitleFromBoardUrl(url));
}

function extractListItem(row, baseUrl) {
  if (!row) return null;
  var linkNode = firstNode(row, selectorList("listLink", []));
  if (!linkNode) return null;
  var link = normalizeUrl(attrOf(linkNode, "href")) || ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl);
  link = localCanonicalizeUrl(link);
  if (!link || !localLooksLikePostUrl(link)) return null;
  var title = localTitleFromNode(linkNode);
  if (!title || title.length < 2) return null;

  var author = firstAuthorText(row, selectorList("listAuthor", [])) || SITE.displayName;
  var statsNode = firstNode(row, ["td.stats"]);
  var statsText = statsNode ? textOf(statsNode) : "";
  var replyMatch = statsText.match(/(\d[\d,]*)\s*ตอบ/);
  var viewMatch = statsText.match(/(\d[\d,]*)\s*อ่าน/);
  var commentCount = replyMatch ? replyMatch[1].replace(/,/g, "") : parseCount(firstText(row, selectorList("listCommentCount", [])));
  var viewCount = viewMatch ? viewMatch[1].replace(/,/g, "") : parseCount(firstText(row, selectorList("listViewCount", [])));

  var lastPostNode = firstNode(row, ["td.lastpost"]);
  var date = lastPostNode ? textOf(lastPostNode).split("โดย")[0].trim() : "";

  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: link,
    title: title,
    author: author,
    avatar: "",
    date: date,
    category: "",
    commentCount: commentCount,
    viewCount: viewCount,
    likeCount: "",
    mediaUrl: "",
    mediaType: "",
    types: ["link"],
    menus: [],
    hotCount: toInt(commentCount, 0),
    coldCount: 0
  };
}

function localParseComments(doc, postUrl) {
  var wrappers = localQuerySelectorAll(doc, [".post_wrapper"]);
  if (!wrappers || wrappers.length <= 1) return [];

  var comments = [];
  // Skip index 0 (main post)
  for (var i = 1; i < wrappers.length && comments.length < 50; i++) {
    var wrapper = wrappers[i];
    var author = firstAuthorText(wrapper, selectorList("commentAuthor", [])) || "Anonymous";
    var avatar = imageUrlFromNode(firstNode(wrapper, selectorList("commentAvatar", [])), postUrl);
    var dateNode = firstNode(wrapper, selectorList("commentDate", []));
    var date = dateNode ? textOf(dateNode).replace(/«|»/g, "").trim() : "";
    var contentRoot = firstNode(wrapper, selectorList("commentContent", [])) || wrapper;
    var content = parseDetails(contentRoot, postUrl);
    if (!content || content.length === 0) continue;

    comments.push({
      id: SITE.siteKey + ":comment:" + comments.length,
      link: postUrl + "#comment-" + comments.length,
      author: author,
      avatar: avatar,
      date: date,
      content: content,
      likeCount: "",
      dislikeCount: "",
      level: 0,
      menus: [MENU_BROWSER],
      hotCount: 0,
      coldCount: 0
    });
  }
  return comments;
}

SITE.parseComments = function (doc, postUrl) {
  return localParseComments(doc, postUrl);
};

SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
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
};

SITE.buildNextPageUrl = function (match, url, nextPage) {
  var info = parseAbsoluteUrl(url);
  if (!info || !/(?:^|[;&])board=\d+(?:\.\d+)?(?:[;&]|$)/i.test(info.query)) return "";
  info.query = info.query.replace(/(^|[;&])(board=\d+)(?:\.\d+)?(?=[;&]|$)/i, function (_, separator, board) {
    return separator + board + "." + ((nextPage - 1) * 30);
  });
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
    page: 1
  };
};

SITE.matchBoard = function (info) {
  if (!info || !isKnownHost(info.host)) return null;
  var url = localUrlFromInfo(info);
  if (localLooksLikeAssetUrl(url) || localLooksLikePostUrl(url)) return null;
  var board = localFindConfiguredBoard(url) || ensureBoard(localBoardIdFromUrl(url), url, localTitleFromBoardUrl(url));
  var boardPage = String(info.query || "").match(/(?:^|[;&])board=\d+\.(\d+)(?:[;&]|$)/i);
  return {
    board: board,
    page: boardPage ? Math.floor(parseInt(boardPage[1], 10) / 30) + 1 : 1
  };
};
