// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "zhihu",
  "displayName": "Zhihu",
  "country": "Mainland China",
  "category": "Q&A community",
  "browserHomeUrl": "https://www.zhihu.com/hot",
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
    "hot",
    "explore",
    "waiting",
    "follow",
    "zvideo",
    "roundtable",
    "topics",
    "columns",
    "daily",
    "education"
  ],
  "preserveAliasHostUrls": true,
  "hostAliases": [
    "zhihu.com",
    "zhuanlan.zhihu.com",
    "daily.zhihu.com"
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
    " - Zhihu",
    " | Zhihu",
    " : Zhihu"
  ],
  "boards": [
    {
      "id": "hot",
      "title": "热榜",
      "url": "https://www.zhihu.com/hot",
      "description": "Zhihu hot questions",
      "group": "Mainland China"
    },
    {
      "id": "explore",
      "title": "发现",
      "url": "https://www.zhihu.com/explore",
      "description": "Zhihu explore",
      "group": "Mainland China"
    },
    {
      "id": "waiting",
      "title": "等你来答",
      "url": "https://www.zhihu.com/question/waiting",
      "description": "Open Zhihu questions",
      "group": "Mainland China"
    },
    {
      "id": "follow",
      "title": "关注",
      "url": "https://www.zhihu.com/follow",
      "description": "Zhihu follow feed",
      "group": "Mainland China"
    },
    {
      "id": "zvideo",
      "title": "视频",
      "url": "https://www.zhihu.com/zvideo",
      "description": "Zhihu videos",
      "group": "Mainland China"
    },
    {
      "id": "roundtable",
      "title": "圆桌",
      "url": "https://www.zhihu.com/roundtable",
      "description": "Zhihu roundtables",
      "group": "Mainland China"
    },
    {
      "id": "topics",
      "title": "话题",
      "url": "https://www.zhihu.com/topic",
      "description": "Zhihu topics",
      "group": "Mainland China"
    },
    {
      "id": "columns",
      "title": "专栏",
      "url": "https://zhuanlan.zhihu.com/",
      "description": "Zhihu columns",
      "group": "Mainland China"
    },
    {
      "id": "daily",
      "title": "知乎日报",
      "url": "https://daily.zhihu.com/",
      "description": "Zhihu Daily",
      "group": "Mainland China"
    },
    {
      "id": "education",
      "title": "知学堂",
      "url": "https://www.zhihu.com/education",
      "description": "Zhihu education",
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
      ".HotItem",
      ".ContentItem",
      ".List-item",
      "a[href*='/question/']",
      "a[href*='/p/']"
    ],
    "listLink": [
      "a[href*='/question/']",
      "a[href*='/answer/']",
      "a[href*='/p/']"
    ],
    "listTitle": [
      ".HotItem-title",
      ".ContentItem-title a",
      "h2 a",
      "a[href*='/question/']",
      "a[href*='/p/']"
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
      ".AuthorInfo-name",
      ".UserLink",
      ".author"
    ],
    "listAvatar": [
      ".avatar img",
      ".user-avatar img",
      "img.avatar"
    ],
    "listDate": [
      ".ContentItem-time",
      "time"
    ],
    "listCommentCount": [
      "button",
      ".ContentItem-actions"
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
      ".RichContent-cover img",
      "img"
    ],
    "postTitle": [
      ".QuestionHeader-title",
      ".Post-Title",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".AuthorInfo-name",
      ".UserLink",
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
      ".QuestionRichText",
      ".RichContent-inner",
      ".Post-RichTextContainer",
      ".RichText",
      "main",
      "body"
    ],
    "commentRows": [
      ".CommentItem",
      ".NestComment",
      ".CommentItemV2"
    ],
    "commentAuthor": [
      ".UserLink",
      ".AuthorInfo-name",
      ".author"
    ],
    "commentAvatar": [
      ".avatar img",
      ".user-avatar img",
      "img.avatar"
    ],
    "commentContent": [
      ".CommentContent",
      ".RichText"
    ],
    "commentDate": [
      ".CommentItemV2-time",
      "time"
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
  "domain": "www.zhihu.com",
  "host_permissions": [
    "https://www.zhihu.com/*",
    "https://zhihu.com/*",
    "https://zhuanlan.zhihu.com/*",
    "https://daily.zhihu.com/*",
    "https://api.zhihu.com/*"
  ],
  "name": "zhihu",
  "author": "Synura Team",
  "description": "Unofficial Zhihu.",
  "version": 0.1,
  "api": 0,
  "license": "Apache-2.0",
  "locale": "zh_CN",
  "icon": "https://static.zhihu.com/heifetz/favicon.ico",
  "bypass": "chrome/android",
  "deeplink": true,
  "tags": [
    "q&a",
    "knowledge",
    "community"
  ],
  "main": null
};

var LOCAL_POST_PATTERNS = [
  /\/question\/\d+/i,
  /\/answer\/\d+/i,
  /\/p\/\d+/i,
  /\/story\/\d+/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href='/hot']",
  "a[href='/explore']",
  "a[href*='/question/waiting']"
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


function localZhihuHotItems(data) {
  var rows = data && data.data && data.data.length ? data.data : [];
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var question = rows[i].question || {};
    var reaction = rows[i].reaction || {};
    var link = question.url || (question.id ? ("https://www.zhihu.com/question/" + question.id) : "");
    if (!link || !question.title) continue;
    out.push({
      id: SITE.siteKey + ":" + (question.id || localBoardIdHash(link)),
      link: link,
      title: question.title,
      author: question.creator && question.creator.name ? question.creator.name : SITE.displayName,
      avatar: "",
      date: question.updated_time ? String(question.updated_time) : "",
      category: question.topics && question.topics.length ? question.topics[0].name : SITE.displayName,
      commentCount: reaction.answer_num ? String(reaction.answer_num) : "",
      viewCount: reaction.pv ? String(reaction.pv) : "",
      likeCount: reaction.upvote_num ? String(reaction.upvote_num) : "",
      mediaUrl: "",
      mediaType: "",
      types: ["link"],
      menus: [],
      hotCount: reaction.upvote_num || reaction.answer_num || 0,
      coldCount: 0
    });
  }
  return out;
}

function localZhihuDailyItems(data) {
  var out = [];
  var seen = {};
  function pushStory(story, featured) {
    if (!story || !story.title) return;
    var link = story.url || (story.id ? ("https://daily.zhihu.com/story/" + story.id) : "");
    if (!link || seen[link]) return;
    seen[link] = true;
    var image = "";
    if (story.images && story.images.length) image = story.images[0];
    if (!image && story.image) image = story.image;
    var hint = story.hint || "";
    out.push({
      id: SITE.siteKey + ":daily:" + (story.id || localBoardIdHash(link)),
      link: link,
      title: story.title,
      author: hint || SITE.displayName,
      avatar: "",
      date: data && data.date ? String(data.date) : (story.date ? String(story.date) : ""),
      category: "知乎日报",
      commentCount: "",
      viewCount: "",
      likeCount: "",
      mediaUrl: image,
      mediaType: image ? "image" : "",
      types: image ? ["image", "link"] : ["link"],
      menus: [],
      hotCount: featured ? 1 : 0,
      coldCount: 0
    });
  }
  var topStories = data && data.top_stories && data.top_stories.length ? data.top_stories : [];
  for (var i = 0; i < topStories.length; i++) pushStory(topStories[i], true);
  var stories = data && data.stories && data.stories.length ? data.stories : [];
  for (var j = 0; j < stories.length; j++) pushStory(stories[j], false);
  return out;
}

function localZhihuBrowserRoute(url, title) {
  return {
    kind: "browser",
    url: url,
    viewData: {
      view: "/views/browser",
      styles: { title: title || SITE.displayName },
      models: { url: url }
    },
    context: { kind: "browser", link: url, title: title || SITE.displayName }
  };
}

function localZhihuNativeBoardRoute(url, board, items) {
  return {
    kind: "board",
    url: url,
    viewData: {
      view: "/views/list",
      styles: { title: board.title, layout: "card", menu: true, pagination: false },
      models: { contents: { details: items }, context: { kind: "board", link: url, title: board.title, page: 1 } }
    },
    context: { kind: "board", link: url, boardId: board.id, boardTitle: board.title, boardUrl: board.url, title: board.title, page: 1 }
  };
}

function localZhihuJson(url) {
  var response = fetch(url, { headers: SITE.fetchHeaders || {} });
  if (!response || response.status >= 400) return null;
  try {
    return response.json();
  } catch (e) {
    return null;
  }
}

function localZhihuItemsForBoard(board) {
  if (!board) return [];
  if (board.id === "hot") {
    return localZhihuHotItems(localZhihuJson("https://www.zhihu.com/api/v4/creators/rank/hot?domain=0&period=hour"));
  }
  if (board.id === "daily") {
    return localZhihuDailyItems(localZhihuJson("https://daily.zhihu.com/api/4/news/latest"));
  }
  return [];
}

function localZhihuRouteBoard(url, board) {
  if (!board) return null;
  var items = localZhihuItemsForBoard(board);
  if (!items.length) return localZhihuBrowserRoute(url, board.title);
  return localZhihuNativeBoardRoute(url, board, items);
}

function localZhihuDailyStoryId(url) {
  var match = String(url || "").match(/\/story\/(\d+)/i);
  return match ? match[1] : "";
}

function localZhihuDailyComments(storyId, storyUrl) {
  var out = [];
  var seen = {};
  function pushComments(data) {
    var rows = data && data.comments && data.comments.length ? data.comments : [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i] || {};
      var commentId = row.id ? String(row.id) : localBoardIdHash(String(row.author || "") + ":" + String(row.content || ""));
      if (seen[commentId] || !row.content) continue;
      seen[commentId] = true;
      out.push({
        id: SITE.siteKey + ":daily-comment:" + commentId,
        link: storyUrl + "#comment-" + commentId,
        author: row.author || "",
        avatar: row.avatar || "",
        date: row.time ? String(row.time) : "",
        content: [{ type: "text", value: row.content }],
        likeCount: row.likes ? String(row.likes) : "",
        dislikeCount: "",
        level: 0,
        menus: [MENU_BROWSER],
        hotCount: row.likes || 0,
        coldCount: 0
      });
    }
  }
  pushComments(localZhihuJson("https://daily.zhihu.com/api/4/story/" + storyId + "/long-comments"));
  pushComments(localZhihuJson("https://daily.zhihu.com/api/4/story/" + storyId + "/short-comments"));
  return out;
}

function localZhihuDailyPostRoute(url, storyId) {
  var data = localZhihuJson("https://daily.zhihu.com/api/4/news/" + storyId);
  if (!data || !data.title) return localZhihuBrowserRoute(url, "知乎日报");
  var bodyHtml = String(data.body || "");
  var doc = new DOMParser().parseFromString(bodyHtml, "text/html");
  var content = parseMarkupDetails(bodyHtml, url);
  if (data.image) {
    content.unshift({ type: "image", value: data.image, link: data.image });
  }
  if (!content.length) {
    var text = normalizeWhitespace(doc && doc.body ? doc.body.textContent : "");
    content = text ? [{ type: "text", value: text }] : [{ type: "text", value: data.title }];
  }
  var author = normalizeWhitespace(firstText(doc, [".author"]));
  var avatar = imageUrlFromNode(firstNode(doc, [".avatar"]), url);
  var comments = localZhihuDailyComments(storyId, url);
  var board = localFindConfiguredBoard("https://daily.zhihu.com/") || { id: "daily", title: "知乎日报", url: "https://daily.zhihu.com/" };
  return {
    kind: "post",
    url: url,
    viewData: {
      view: "/views/post",
      styles: { title: data.title, menu: true },
      models: {
        author: author || data.image_source || SITE.displayName,
        avatar: avatar,
        date: data.date ? String(data.date) : "",
        category: "知乎日报",
        viewCount: "",
        likeCount: "",
        content: content,
        comments: comments,
        link: url,
        menus: [MENU_BROWSER],
        buttons: [BUTTON_REFRESH]
      }
    },
    context: {
      kind: "post",
      link: url,
      boardId: board.id,
      boardTitle: board.title,
      boardUrl: board.url,
      title: data.title
    }
  };
}

SITE.routeBoardCustom = function (url, urlInfo, match, force) {
  if (!match || !match.board) return null;
  return localZhihuRouteBoard(url, match.board);
};

SITE.routeCustom = function (url, info, force) {
  var storyId = localZhihuDailyStoryId(url);
  if (storyId) return localZhihuDailyPostRoute(url, storyId);
  var board = localFindConfiguredBoard(url);
  if (!board) return null;
  return localZhihuRouteBoard(url, board);
};

SITE.isAuthRequiredResponse = function (url, status, html) {
  if (status === 401 || status === 403 || status === 429 || status === 430) return true;
  var body = String(html || "");
  return body.indexOf("知乎，让每一次点击都充满意义") >= 0 || body.indexOf("安全验证") >= 0;
};
