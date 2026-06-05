// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "tieba",
  "displayName": "Baidu Tieba",
  "country": "Mainland China",
  "category": "forum community",
  "browserHomeUrl": "https://tieba.baidu.com/f?kw=%E6%9D%8E%E6%AF%85",
  "browserCookieAuth": true,
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
    "liyi",
    "v2ex",
    "java",
    "python",
    "linux",
    "nba",
    "lol",
    "genshin",
    "movie",
    "digital"
  ],
  "hostAliases": [
    "tiebac.baidu.com"
  ],
  "acceptLanguage": "zh-CN,zh;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [
    "安全验证",
    "登录后查看",
    "captcha",
    "verify",
    "403 Forbidden",
    "521",
    "EdgeOne"
  ],
  "titleSuffixes": [
    " - Baidu Tieba",
    " | Baidu Tieba",
    " : Baidu Tieba"
  ],
  "boards": [
    {
      "id": "liyi",
      "title": "李毅吧",
      "url": "https://tieba.baidu.com/f?kw=%E6%9D%8E%E6%AF%85",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    },
    {
      "id": "v2ex",
      "title": "V2EX吧",
      "url": "https://tieba.baidu.com/f?kw=v2ex",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    },
    {
      "id": "java",
      "title": "Java吧",
      "url": "https://tieba.baidu.com/f?kw=java",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    },
    {
      "id": "python",
      "title": "Python吧",
      "url": "https://tieba.baidu.com/f?kw=python",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    },
    {
      "id": "linux",
      "title": "Linux吧",
      "url": "https://tieba.baidu.com/f?kw=linux",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    },
    {
      "id": "nba",
      "title": "NBA吧",
      "url": "https://tieba.baidu.com/f?kw=nba",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    },
    {
      "id": "lol",
      "title": "LOL吧",
      "url": "https://tieba.baidu.com/f?kw=lol",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    },
    {
      "id": "genshin",
      "title": "原神吧",
      "url": "https://tieba.baidu.com/f?kw=%E5%8E%9F%E7%A5%9E",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    },
    {
      "id": "movie",
      "title": "电影吧",
      "url": "https://tieba.baidu.com/f?kw=%E7%94%B5%E5%BD%B1",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    },
    {
      "id": "digital",
      "title": "数码吧",
      "url": "https://tieba.baidu.com/f?kw=%E6%95%B0%E7%A0%81",
      "description": "Baidu Tieba forum",
      "group": "Mainland China"
    }
  ],
  "selectors": {
    "boardTitle": [
      "h1",
      "h2",
      "title",
      ".contentTitle",
      ".forum-title",
      ".page-title"
    ],
    "listRows": [
      ".j_thread_list",
      "li.j_thread_list",
      "a.j_th_tit[href*='/p/']",
      "a[href*='/p/']"
    ],
    "listLink": [
      "a.j_th_tit[href*='/p/']",
      "a[href*='/p/']"
    ],
    "listTitle": [
      "a.j_th_tit[href*='/p/']",
      "a[href*='/p/']",
      ".threadlist_title"
    ],
    "listTitleExclude": [
      ".badge",
      ".counter",
      ".stats",
      ".meta",
      ".reply",
      ".reply-count",
      ".num",
      ".time",
      "time"
    ],
    "listAuthor": [
      ".frs-author-name",
      ".tb_icon_author",
      ".threadlist_author",
      ".author"
    ],
    "listAvatar": [
      ".avatar img",
      ".user-avatar img",
      "img.avatar"
    ],
    "listDate": [
      ".threadlist_reply_date",
      ".is_show_create_time",
      ".time"
    ],
    "listCommentCount": [
      ".threadlist_rep_num",
      ".reply_num",
      ".num"
    ],
    "listViewCount": [
      ".views",
      ".view-count",
      ".read",
      ".hits"
    ],
    "listLikeCount": [
      ".likes",
      ".like",
      ".vote",
      ".vote-count",
      ".recommend"
    ],
    "listCategory": [
      ".category",
      ".forum",
      ".board",
      ".node",
      ".tag"
    ],
    "listImage": [
      ".media_box img",
      "img"
    ],
    "postTitle": [
      ".core_title_txt",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".d_author .p_author_name",
      ".p_author_name",
      ".author"
    ],
    "postAvatar": [
      ".avatar img",
      ".user-avatar img",
      "img.avatar"
    ],
    "postDate": [
      "time[datetime]",
      "time",
      ".date",
      ".time",
      ".created-at"
    ],
    "postViewCount": [
      ".views",
      ".view-count",
      ".read",
      ".hits"
    ],
    "postLikeCount": [
      ".likes",
      ".like",
      ".vote",
      ".vote-count",
      ".recommend"
    ],
    "postCategory": [
      ".breadcrumbs a",
      ".breadcrumb a",
      ".category",
      ".forum",
      ".board",
      ".node",
      ".tag"
    ],
    "postContent": [
      ".d_post_content",
      ".p_content",
      ".post_bubble_middle",
      "main",
      "body"
    ],
    "commentRows": [
      ".l_post",
      ".d_post_content"
    ],
    "commentAuthor": [
      ".p_author_name",
      ".d_author .p_author_name",
      ".author"
    ],
    "commentAvatar": [
      ".avatar img",
      ".user-avatar img",
      "img.avatar"
    ],
    "commentContent": [
      ".d_post_content",
      ".p_content"
    ],
    "commentDate": [
      ".tail-info",
      ".post-tail-wrap"
    ],
    "commentLikeCount": [
      ".likes",
      ".like",
      ".vote",
      ".vote-count"
    ],
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
  "domain": "tieba.baidu.com",
  "name": "tieba",
  "author": "Synura Team",
  "description": "Unofficial Baidu Tieba.",
  "version": 0.1,
  "api": 0,
  "license": "Apache-2.0",
  "locale": "zh_CN",
  "icon": "https://tieba.baidu.com/favicon.ico",
  "bypass": "chrome/android",
  "deeplink": true,
  "tags": [
    "forums",
    "communities",
    "baidu"
  ],
  "main": null
};

var LOCAL_POST_PATTERNS = [
  /\/p\/\d+/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='/f?kw=']"
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
SITE.matchBoard = function (info) {
  if (!info || !isKnownHost(info.host)) return null;
  var url = localUrlFromInfo(info);
  if (localLooksLikeAssetUrl(url) || localLooksLikePostUrl(url)) return null;
  var board = localFindConfiguredBoard(url) || ensureBoard(localBoardIdFromUrl(url), url, localTitleFromBoardUrl(url));
  var pn = queryInt(info.query, "pn", 0);
  return { board: board, page: Math.floor(Math.max(0, pn) / 50) + 1 };
};
SITE.buildNextPageUrl = function (match, url, nextPage) {
  return setQueryParam(url, "pn", Math.max(0, ((nextPage || 1) - 1) * 50));
};


SITE.isAuthRequiredResponse = function (url, status, html) {
  return status === 401 || status === 403 || status === 429 || status === 430 || String(html || "").indexOf("安全验证") >= 0;
};
