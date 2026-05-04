// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "five_ch",
  "displayName": "5ch",
  "country": "Japan",
  "category": "forum",
  "browserHomeUrl": "https://www2.5ch.io/5ch.html",
  "browserCookieAuth": false,
  "minimumHomeBoards": 3,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "掲示板",
  "boardSettingsTitle": "掲示板設定",
  "boardSettingsLargeThreshold": 128,
  "boardSettingsPageSize": 96,
  "boardAddMode": "url_title",
  "hasFullBoardCatalog": false,
  "supportsBoardCatalogSync": false,
  "maxDiscoveredBoards": 256,
  "defaultVisibleBoardIds": [
    "newsplus",
    "nagaraplus",
    "fakenewsplus",
    "idolplus"
  ],
  "hostAliases": [
    "menu.5ch.io",
    "agree.5ch.io",
    "asahi.5ch.io",
    "egg.5ch.io",
    "fate.5ch.io",
    "hayabusa9.5ch.io",
    "kizuna.5ch.io",
    "lavender.5ch.io",
    "mao.5ch.io",
    "medaka.5ch.io",
    "mevius.5ch.io",
    "mi.5ch.io",
    "nova.5ch.io",
    "pug.5ch.io",
    "rio2016.5ch.io",
    "sora.5ch.io",
    "tanuki.5ch.io",
    "greta.5ch.io",
    "menu.5ch.net",
    "agree.5ch.net",
    "asahi.5ch.net",
    "egg.5ch.net",
    "fate.5ch.net",
    "hayabusa9.5ch.net",
    "kizuna.5ch.net",
    "lavender.5ch.net",
    "mao.5ch.net",
    "medaka.5ch.net",
    "mevius.5ch.net",
    "mi.5ch.net",
    "nova.5ch.net",
    "pug.5ch.net",
    "rio2016.5ch.net",
    "sora.5ch.net",
    "tanuki.5ch.net",
    "greta.5ch.net"
  ],
  "acceptLanguage": "ja-JP,ja;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Monazilla/1.00 Synura/1.0",
    "Accept": "text/plain,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ja-JP,ja;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "textEncoding": "Shift_JIS",
  "challengeMarkers": [],
  "titleSuffixes": [
    " - 5ch",
    " | 5ch",
    " : 5ch"
  ],
  "boards": [
    {
      "id": "newsplus",
      "title": "News Plus",
      "url": "https://asahi.5ch.io/newsplus/",
      "description": "ニュース速報+",
      "group": "5ch"
    },
    {
      "id": "nagaraplus",
      "title": "News Plus Long Read",
      "url": "https://asahi.5ch.io/nagaraplus/",
      "description": "ニュース速報+(長文)",
      "group": "5ch"
    },
    {
      "id": "fakenewsplus",
      "title": "Fake News Plus",
      "url": "https://asahi.5ch.io/fakenewsplus/",
      "description": "ニュース速報(嘘)+",
      "group": "5ch"
    },
    {
      "id": "idolplus",
      "title": "Idol News Plus",
      "url": "https://asahi.5ch.io/idolplus/",
      "description": "アイドルニュース+",
      "group": "5ch"
    }
  ],
  "selectors": {
    "boardTitle": [
      "h1",
      ".contentTitle",
      ".p-title-value",
      ".ipsType_pageTitle",
      ".forum-title",
      "title"
    ],
    "listRows": [
      "a[href*='/test/read.cgi/']",
      "a[href*='read.cgi']"
    ],
    "listLink": [
      "a[href*='/test/read.cgi/']",
      "a[href*='read.cgi']"
    ],
    "listTitle": [
      "a[href*='/test/read.cgi/']",
      "a[href*='read.cgi']"
    ],
    "listTitleExclude": [
      ".badge",
      ".counter",
      ".stats",
      ".meta",
      ".share-button",
      ".ad"
    ],
    "listAuthor": [
      ".username",
      ".userLink",
      ".author",
      "[itemprop='author']",
      ".user-name",
      ".name"
    ],
    "listAvatar": [
      ".avatar img",
      ".userAvatarImage",
      "img[alt*='avatar']",
      "img"
    ],
    "listDate": [
      "time[datetime]",
      "time",
      ".date",
      ".time",
      "[class*='created']",
      "[class*='date']"
    ],
    "listCommentCount": [
      ".replies",
      ".comments",
      ".reply-count",
      ".comment-count",
      "[class*='answerCounter']",
      "[class*='InformationText']",
      ".trackback",
      ".note"
    ],
    "listViewCount": [
      ".views",
      ".view-count",
      "[class*='eye'] + *",
      "[class*='pv']"
    ],
    "listLikeCount": [
      ".likes",
      ".vote-count",
      ".recommend",
      "[class*='thumb'] + *"
    ],
    "listCategory": [
      ".category",
      ".forum-title",
      ".board-title",
      "[class*='Category']",
      ".tag",
      "a[href*='/tags/']"
    ],
    "listImage": [
      "img"
    ],
    "postTitle": [
      "#threadtitle",
      ".threadtitle",
      "h1",
      "title"
    ],
    "postAuthor": [
      "[itemprop='author']",
      ".username",
      ".user-name",
      ".name",
      ".author",
      "[class*='display_name']"
    ],
    "postAvatar": [
      ".avatar img",
      ".messageSidebar img",
      ".userAvatarImage",
      "img[alt*='avatar']"
    ],
    "postDate": [
      "time[datetime]",
      "meta[itemprop='dateCreated']",
      ".date",
      ".time",
      "[class*='created']",
      "[class*='date']"
    ],
    "postViewCount": [
      ".view-count",
      ".views",
      "[class*='pv']"
    ],
    "postLikeCount": [
      ".reactionSummary",
      ".likes",
      ".vote-count",
      "[class*='thumb']"
    ],
    "postCategory": [
      ".breadcrumbs a",
      ".p-breadcrumbs a",
      ".category",
      "[class*='Category']",
      ".tag",
      "a[href*='/tags/']"
    ],
    "postContent": [
      "#threadtitle",
      ".thread",
      ".post",
      ".res",
      "article",
      "main"
    ],
    "commentRows": [
      ".post",
      ".res",
      "article",
      "dd"
    ],
    "commentAuthor": [
      "[itemprop='author']",
      ".username",
      ".user-name",
      ".name",
      ".author",
      "[class*='display_name']"
    ],
    "commentAvatar": [
      ".avatar img",
      ".postprofile img",
      ".ipsUserPhoto img",
      "img[alt*='avatar']"
    ],
    "commentContent": [
      ".message",
      ".post-content",
      "blockquote",
      "dd",
      ".resbody"
    ],
    "commentDate": [
      "time[datetime]",
      "meta[itemprop='dateCreated']",
      ".date",
      ".time",
      "[class*='created']",
      "[class*='date']"
    ],
    "commentLikeCount": [
      ".reactionSummary",
      ".likes",
      ".vote-count",
      "[class*='thumb']"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": [
    "data-depth",
    "depth",
    "data-level"
  ],
  "useRawPostParse": true,
  "useRawPostParseInEmulator": true,
  "preserveAliasHostUrls": true
};

var SYNURA = {
  "domain": "asahi.5ch.io",
  "name": "five_ch",
  "author": "Synura Team",
  "description": "Unofficial 5ch.",
  "version": 0.2,
  "api": 0,
  "license": "Apache-2.0",
  "locale": "ja_JP",
  "icon": "https://5ch.io/favicon.ico",
  "bypass": "chrome/android",
  "deeplink": true,
  "tags": [
    "general",
    "discussion",
    "forum"
  ],
  "main": null
};

var LOCAL_POST_PATTERNS = [
  /\/test\/read\.cgi\/[^\/?#]+\/\d+/i
];


var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='.5ch.io/']",
  "a[href*='5ch.io/']",
  "a[href*='.5ch.net/']",
  "a[href*='5ch.net/']"
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

function localFiveChPreferMirrorHttps(url) {
  var value = String(url || "");
  value = value.replace(/^https?:\/\/([^\/?#]*\.?)5ch\.net([\/?#]|$)/i, "https://$15ch.io$2");
  return value.replace(/^http:\/\/([^\/?#]*\.?5ch\.io)([\/?#]|$)/i, "https://$1$2");
}

function localFiveChNormalizeEndpoint(raw, baseUrl) {
  var href = String(raw || "").trim();
  if (!href) return "";
  var url = "";
  if (href.indexOf("//") === 0) {
    url = "https:" + href;
  } else {
    url = normalizeUrl(href) || ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl);
  }
  return localFiveChPreferMirrorHttps(url);
}

function localFiveChBoardInfoFromUrl(url) {
  var normalized = localFiveChPreferMirrorHttps(normalizeUrl(url) || url);
  var info = parseAbsoluteUrl(normalized);
  if (!info || !isKnownHost(info.host)) return null;
  var path = String(info.path || "/");
  var match = path.match(/^\/([A-Za-z0-9_]+)\/(?:index\.html)?$/);
  if (!match) return null;
  return {
    scheme: info.scheme || "http",
    host: info.host,
    boardId: match[1],
    boardUrl: (info.scheme || "http") + "://" + info.host + "/" + match[1] + "/"
  };
}

function localFiveChThreadInfoFromUrl(url) {
  var normalized = localFiveChPreferMirrorHttps(normalizeUrl(url) || url);
  var info = parseAbsoluteUrl(normalized);
  if (!info || !isKnownHost(info.host)) return null;
  var match = String(info.path || "").match(/^\/test\/read\.cgi\/([A-Za-z0-9_]+)\/(\d+)/);
  if (!match) return null;
  return {
    scheme: info.scheme || "http",
    host: info.host,
    boardId: match[1],
    threadId: match[2],
    postUrl: (info.scheme || "http") + "://" + info.host + "/test/read.cgi/" + match[1] + "/" + match[2] + "/"
  };
}

function localFiveChConfiguredBoardForKey(boardKey) {
  var boards = SITE.boards || [];
  for (var i = 0; i < boards.length; i++) {
    var info = localFiveChBoardInfoFromUrl(boards[i].url);
    if (info && info.boardId === boardKey) return boardById(boards[i].id) || boards[i];
  }
  return null;
}

function localFiveChMirrorBoardUrl(url, boardKey) {
  var info = localFiveChBoardInfoFromUrl(url);
  var key = boardKey || (info ? info.boardId : "");
  var configured = key ? localFiveChConfiguredBoardForKey(key) : null;
  if (configured) return localFiveChPreferMirrorHttps(normalizeUrl(configured.url) || configured.url);
  if (info && String(info.host || "").toLowerCase() === String(SYNURA.domain || "").toLowerCase()) return info.boardUrl;
  return info ? info.boardUrl : localFiveChPreferMirrorHttps(normalizeUrl(url) || url);
}

function localFiveChMirrorPostUrl(url) {
  var thread = localFiveChThreadInfoFromUrl(url);
  if (!thread) return localFiveChPreferMirrorHttps(normalizeUrl(url) || url);
  if (String(thread.host || "").toLowerCase() === String(SYNURA.domain || "").toLowerCase()) return thread.postUrl;
  var boardUrl = localFiveChMirrorBoardUrl("", thread.boardId);
  var board = localFiveChBoardInfoFromUrl(boardUrl);
  if (!board) return thread.postUrl;
  return board.scheme + "://" + board.host + "/test/read.cgi/" + thread.boardId + "/" + thread.threadId + "/";
}

function localFiveChSubjectUrl(boardUrl) {
  var board = localFiveChBoardInfoFromUrl(localFiveChMirrorBoardUrl(boardUrl, ""));
  if (!board) return "";
  return board.scheme + "://" + board.host + "/" + board.boardId + "/subject.txt";
}

function localFiveChDatUrl(postUrl) {
  var thread = localFiveChThreadInfoFromUrl(localFiveChMirrorPostUrl(postUrl));
  if (!thread) return "";
  return thread.scheme + "://" + thread.host + "/" + thread.boardId + "/dat/" + thread.threadId + ".dat";
}

function localFiveChReadUrl(boardUrl, threadId) {
  var board = localFiveChBoardInfoFromUrl(localFiveChMirrorBoardUrl(boardUrl, ""));
  if (!board || !threadId) return "";
  return board.scheme + "://" + board.host + "/test/read.cgi/" + board.boardId + "/" + threadId + "/";
}

function localFiveChFetchText(url) {
  if (!url) throw new Error("Missing 5ch endpoint URL");
  if (typeof console !== "undefined" && console && typeof console.log === "function") console.log(url);
  var response = fetch(url, {
    headers: SITE.fetchHeaders || {
      "User-Agent": "Monazilla/1.00 Synura/1.0",
      "Accept": "text/plain,text/html,*/*"
    }
  });
  if (!response) throw new Error("Failed to fetch " + url + " (0)");
  var status = response.status || 0;
  var text = responseText(response);
  if (!response.ok) throw new Error("Failed to fetch " + url + " (" + status + ")");
  return text;
}

function localFiveChDecodeHtmlText(value) {
  var html = String(value || "").replace(/<br\s*\/?>/gi, "\n");
  var doc = new DOMParser().parseFromString("<div>" + html + "</div>", "text/html");
  var root = doc && doc.body ? doc.body : doc;
  return normalizeWhitespace(root ? root.textContent || "" : html);
}

function localFiveChDetailsFromHtml(value, baseUrl) {
  var doc = new DOMParser().parseFromString("<div>" + String(value || "") + "</div>", "text/html");
  var root = doc && doc.body && doc.body.firstElementChild ? doc.body.firstElementChild : (doc && doc.body ? doc.body : doc);
  var details = parseDetails(root, baseUrl);
  if (!details || details.length === 0) {
    var text = localFiveChDecodeHtmlText(value);
    if (text) details = [{ type: "text", value: text }];
  }
  return details || [];
}

function localFiveChPad2(value) {
  var n = parseInt(String(value || 0), 10);
  if (isNaN(n)) n = 0;
  return n < 10 ? "0" + n : String(n);
}

function localFiveChDateFromThreadId(threadId) {
  var n = parseInt(String(threadId || ""), 10);
  if (isNaN(n) || n <= 0) return "";
  var date = new Date(n * 1000);
  return date.getFullYear() + "-" + localFiveChPad2(date.getMonth() + 1) + "-" + localFiveChPad2(date.getDate()) + " " + localFiveChPad2(date.getHours()) + ":" + localFiveChPad2(date.getMinutes());
}

function localFiveChParseSubjectItems(text, boardUrl, match) {
  var board = localFiveChBoardInfoFromUrl(localFiveChMirrorBoardUrl(boardUrl, ""));
  if (!board) return [];
  var rows = String(text || "").replace(/\r/g, "").split("\n");
  var items = [];
  var seen = {};
  for (var i = 0; i < rows.length && items.length < 100; i++) {
    var line = String(rows[i] || "");
    var parsed = line.match(/^(\d+)\.dat<>(.*)$/);
    if (!parsed) continue;
    var threadId = parsed[1];
    if (threadId === "9990000001" || threadId.length > 10 || seen[threadId]) continue;
    var titlePart = parsed[2] || "";
    var count = "";
    var countMatch = titlePart.match(/\s*\((\d{1,5})\)\s*$/);
    if (countMatch) {
      count = countMatch[1];
      titlePart = titlePart.substring(0, countMatch.index);
    }
    var title = localFiveChDecodeHtmlText(titlePart);
    if (!title || title.length < 2) continue;
    var link = localFiveChReadUrl(board.boardUrl, threadId);
    if (!link) continue;
    seen[threadId] = true;
    items.push({
      id: SITE.siteKey + ":" + board.boardId + ":" + threadId,
      link: link,
      title: title,
      author: SITE.displayName,
      avatar: "",
      date: localFiveChDateFromThreadId(threadId),
      category: match && match.board ? match.board.title : localTitleFromBoardUrl(board.boardUrl),
      commentCount: count,
      viewCount: "",
      likeCount: "",
      mediaUrl: "",
      mediaType: "",
      types: ["link"],
      menus: [],
      hotCount: toInt(count, 0),
      coldCount: 0
    });
  }
  return items;
}

function localFiveChParseDatThread(text, postUrl) {
  var lines = String(text || "").replace(/\r/g, "").split("\n");
  var posts = [];
  var title = "";
  for (var i = 0; i < lines.length && posts.length < 150; i++) {
    var line = String(lines[i] || "");
    if (!line) continue;
    var parts = line.split("<>");
    if (parts.length < 4) continue;
    var rawTitle = parts.length > 4 ? parts.slice(4).join("<>") : "";
    if (!title && rawTitle) title = localFiveChDecodeHtmlText(rawTitle);
    var body = parts[3] || "";
    var content = localFiveChDetailsFromHtml(body, postUrl);
    var bodyText = localFiveChDecodeHtmlText(body);
    if ((!content || content.length === 0) && bodyText) content = [{ type: "text", value: bodyText }];
    if (!bodyText && (!content || content.length === 0)) continue;
    posts.push({
      number: posts.length + 1,
      author: localFiveChDecodeHtmlText(parts[0]) || "名無しさん",
      date: localFiveChDecodeHtmlText(parts[2]),
      content: content,
      text: bodyText
    });
  }
  return {
    title: title,
    posts: posts
  };
}

function localFiveChLooksLikeBoardUrl(url) {
  return !!localFiveChBoardInfoFromUrl(url);
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
  if (localFiveChLooksLikeBoardUrl(url)) return true;
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
  var thread = localFiveChThreadInfoFromUrl(url);
  if (thread) {
    var threadBoard = localFiveChConfiguredBoardForKey(thread.boardId);
    if (threadBoard) return threadBoard;
    var threadBoardUrl = thread.scheme + "://" + thread.host + "/" + thread.boardId + "/";
    return ensureBoard(thread.boardId, threadBoardUrl, localTitleFromBoardUrl(threadBoardUrl));
  }
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
  if (localFiveChLooksLikeBoardUrl(url)) score += 65;
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
    var url = localFiveChNormalizeEndpoint(attrOf(anchors[i], "href"), baseUrl || SITE.browserHomeUrl);
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

SITE.routeBoardCustom = function (url, urlInfo, match, force) {
  var boardUrl = localFiveChMirrorBoardUrl(url, "");
  var subjectUrl = localFiveChSubjectUrl(boardUrl);
  if (!subjectUrl) return null;
  var text = localFiveChFetchText(subjectUrl);
  var items = localFiveChParseSubjectItems(text, boardUrl, match);
  var board = match && match.board ? match.board : localFiveChConfiguredBoardForKey((localFiveChBoardInfoFromUrl(boardUrl) || {}).boardId);
  var title = board && board.title ? board.title : localTitleFromBoardUrl(boardUrl);
  var seenLinks = [];
  for (var i = 0; i < items.length; i++) seenLinks.push(items[i].link);
  var context = {
    kind: "board",
    link: boardUrl,
    boardId: board && board.id ? board.id : ((localFiveChBoardInfoFromUrl(boardUrl) || {}).boardId || ""),
    boardTitle: title,
    boardUrl: board && board.url ? board.url : boardUrl,
    title: title,
    page: 1,
    nextUrl: "",
    seenLinks: seenLinks
  };
  return {
    kind: "board",
    url: boardUrl,
    viewData: {
      view: "/views/list",
      styles: buildBoardListStyles(title, board || null, ""),
      models: {
        contents: items,
        menus: getBoardMenus(context)
      }
    },
    context: context
  };
};

SITE.routePostCustom = function (url, urlInfo, match, force) {
  var postUrl = localFiveChMirrorPostUrl(url);
  var datUrl = localFiveChDatUrl(postUrl);
  if (!datUrl) return null;
  var text = localFiveChFetchText(datUrl);
  var thread = localFiveChParseDatThread(text, postUrl);
  if (!thread || !thread.posts || thread.posts.length === 0) return null;
  var info = localFiveChThreadInfoFromUrl(postUrl);
  var board = match && match.board ? match.board : (info ? localFiveChConfiguredBoardForKey(info.boardId) : null);
  var first = thread.posts[0];
  var title = thread.title || (first.text ? first.text.substring(0, 80) : "") || localPostIdFromUrl(postUrl);
  var comments = [];
  for (var i = 1; i < thread.posts.length && comments.length < 100; i++) {
    var post = thread.posts[i];
    comments.push({
      id: SITE.siteKey + ":res:" + (post.number || (i + 1)),
      link: postUrl + (post.number || (i + 1)),
      author: post.author,
      avatar: "",
      date: post.date,
      content: post.content,
      likeCount: "",
      dislikeCount: "",
      level: 0,
      menus: [MENU_BROWSER],
      hotCount: 0,
      coldCount: 0
    });
  }
  var context = {
    kind: "post",
    link: postUrl,
    boardId: board && board.id ? board.id : (info ? info.boardId : ""),
    boardTitle: board && board.title ? board.title : (info ? info.boardId : ""),
    boardUrl: board && board.url ? board.url : (info ? info.scheme + "://" + info.host + "/" + info.boardId + "/" : ""),
    title: title
  };
  return {
    kind: "post",
    url: postUrl,
    viewData: {
      view: "/views/post",
      styles: buildPostStyles(title, board || null),
      models: {
        author: first.author,
        avatar: "",
        date: first.date,
        category: context.boardTitle,
        viewCount: "",
        likeCount: "",
        content: first.content,
        comments: comments,
        link: postUrl,
        menus: getPostMenus(context),
        buttons: [BUTTON_REFRESH]
      }
    },
    context: context
  };
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
  return "";
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
  var homeUrl = normalizeUrl(SITE.browserHomeUrl) || SITE.browserHomeUrl;
  if ((normalizeUrl(url) || url) === homeUrl) return null;
  if (localLooksLikeAssetUrl(url) || localLooksLikePostUrl(url)) return null;
  var board = localFindConfiguredBoard(url) || ensureBoard(localBoardIdFromUrl(url), url, localTitleFromBoardUrl(url));
  return {
    board: board,
    page: queryInt(info.query, "page", 1)
  };
};
