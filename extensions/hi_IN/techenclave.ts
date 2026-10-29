// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "techenclave",
  "displayName": "TechEnclave",
  "country": "India",
  "category": "technology and hardware forum",
  "browserHomeUrl": "https://techenclave.com/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 5,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "मंच",
  "boardSettingsTitle": "मंच सेटिंग्स",
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
    "www.techenclave.com"
  ],
  "acceptLanguage": "en-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7",
  "fetchHeaders": {
    "Accept": "*/*",
    "Accept-Language": "en-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - TechEnclave",
    " | TechEnclave",
    " : TechEnclave"
  ],
  "isAuthRequiredResponse": function(url, status, html) {
    if (status === 401 || status === 403 || status === 429) return true;
    var body = String(html || "").toLowerCase();
    return (body.indexOf("just a moment") >= 0 && body.indexOf("cf_chl_opt") >= 0) ||
           body.indexOf("checking your browser") >= 0 ||
           body.indexOf("verify you are human") >= 0;
  },
  "boards": [
    {
      "id": "gadgets_devices",
      "title": "Gadgets & Devices",
      "url": "https://techenclave.com/c/gadgets-and-devices/8",
      "description": "Smartphones, Audio, Wearables",
      "group": "Hardware"
    },
    {
      "id": "computer_peripherals",
      "title": "Computer Peripherals",
      "url": "https://techenclave.com/c/computer-peripherals/11",
      "description": "Monitors, Keyboards, Mice, Printers",
      "group": "Hardware"
    },
    {
      "id": "graphics_cards",
      "title": "Graphic Cards",
      "url": "https://techenclave.com/c/graphic-cards/12",
      "description": "NVIDIA, AMD GPU Discussions",
      "group": "Hardware"
    },
    {
      "id": "pc_buying_advice",
      "title": "PC Buying Advice",
      "url": "https://techenclave.com/c/pc-buying-advice/10",
      "description": "Build Help & Configurations",
      "group": "Guides"
    },
    {
      "id": "the_lounge",
      "title": "The Lounge",
      "url": "https://techenclave.com/c/the-lounge/14",
      "description": "General Chit-Chat",
      "group": "Community"
    }
  ],
  "selectors": {
    "boardTitle": [
      "h1",
      ".badge-category",
      "title"
    ],
    "listRows": [
      "tr.topic-list-item",
      ".topic-list-item",
      "a.raw-topic-link"
    ],
    "listLink": [
      "a.title",
      "a.raw-topic-link",
      "a[href*='/t/']"
    ],
    "listTitle": [
      "a.title",
      "a.raw-topic-link"
    ],
    "listTitleExclude": [
      ".badge",
      ".badge-category"
    ],
    "listAuthor": [
      ".creator",
      ".username",
      ".author",
      ".posters a"
    ],
    "listAvatar": [
      ".avatar",
      "img.avatar"
    ],
    "listDate": [
      "td.age",
      "time",
      ".activity"
    ],
    "listCommentCount": [
      "span.posts",
      "td.posts",
      "td.replies"
    ],
    "listViewCount": [
      "td.views",
      "span.views"
    ],
    "listLikeCount": [],
    "listCategory": [
      ".badge-category"
    ],
    "listImage": [],
    "postTitle": [
      "h1",
      ".crawler-post-infos",
      "title"
    ],
    "postAuthor": [
      "span[itemprop='author'] [itemprop='name']",
      "[itemprop='name']",
      ".creator",
      ".username"
    ],
    "postAvatar": [],
    "postDate": [
      "time[itemprop='datePublished']",
      "time"
    ],
    "postViewCount": [],
    "postLikeCount": [],
    "postCategory": [
      ".badge-category"
    ],
    "postContent": [
      "div.post[itemprop='articleBody']",
      "[itemprop='articleBody']",
      ".cooked"
    ],
    "commentRows": [
      ".crawler-post",
      "div[itemscope]"
    ],
    "commentAuthor": [
      "span[itemprop='author'] [itemprop='name']",
      "[itemprop='name']",
      ".creator",
      ".username"
    ],
    "commentAvatar": [],
    "commentContent": [
      "div.post[itemprop='articleBody']",
      "[itemprop='articleBody']",
      ".cooked"
    ],
    "commentDate": [
      "time[itemprop='datePublished']",
      "time"
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
  domain: "techenclave.com",
  name: "techenclave",
  author: "Synura Team",
  description: "techenclave.com",
  version: 0.1,
  api: 0,
  license: "Apache-2.0",
  locale: "hi_IN",
  icon: "https://techenclave.com/uploads/default/optimized/3X/6/7/6772377a1bd34f65012f268a3816b27bb26d52ab_2_32x32.png",
  bypass: "chrome/windows",
  deeplink: true,
  tags: [
    "india",
    "tech",
    "hardware",
    "pc-builds",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/t\/[^\/?#]+\/\d+/i,
  /\/t\/\d+/i
];

var LOCAL_BOARD_LINK_SELECTORS = [
  "a[href*='/c/']"
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
  return String(url || "").split(/[?#]/)[0];
}

function localLooksLikeAssetUrl(url) {
  return /\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js|json|xml|pdf|zip|rar|7z)(?:[?#]|$)/i.test(String(url || ""));
}

function localLooksLikeBadNav(url, title) {
  var sample = (String(url || "") + " " + String(title || "")).toLowerCase();
  return /(?:login|signin|signup|register|join|logout|privacy|terms|policy|affiliate|contact|about|help|search|tag\/|tags\/|tagged\/|rss|feed|download|app\b|oauth|account|member|members\/|profile|user\/|users\/|newsletter|markread|settings)/i.test(sample);
}

function localLooksLikeCollectionUrl(url) {
  var path = localPathAndQuery(url).toLowerCase();
  if (/(?:\/c\/)/i.test(path)) return true;
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
    var value = normalizeWhitespace(parts[i]).replace(/^\d+$/, "").replace(/[-_]+/g, " ");
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
  var match = String(url || "").match(/\/t\/[^\/?#]+\/(\d+)/i);
  if (match) return match[1];
  match = String(url || "").match(/\/t\/(\d+)/i);
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
  var commentCount = parseCount(firstText(row, selectorList("listCommentCount", [])));
  var image = imageUrlFromNode(firstNode(row, selectorList("listImage", ["img"])), baseUrl);
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: firstAuthorText(row, selectorList("listAuthor", [])) || SITE.displayName,
    avatar: imageUrlFromNode(firstNode(row, selectorList("listAvatar", [])), baseUrl),
    date: firstText(row, selectorList("listDate", [])),
    category: "",
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
  var time = firstNode(node, selectorList("commentDate", ["time"]));
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
    out.push({
      id: SITE.siteKey + ":comment:" + out.length,
      link: postUrl + (domId ? ("#" + domId) : ("#comment-" + out.length)),
      author: localCommentAuthor(rows[i]),
      avatar: imageUrlFromNode(firstNode(rows[i], selectorList("commentAvatar", [])), postUrl),
      date: localCommentDate(rows[i]),
      content: content,
      likeCount: "",
      dislikeCount: "",
      level: 0,
      menus: [MENU_BROWSER],
      hotCount: 0,
      coldCount: 0
    });
  }
  return out;
}

function localParseBoardItemsFromHtml(html, baseUrl) {
  var cleanHtml = String(html || "").replace(/<noscript\b[^>]*>/gi, "").replace(/<\/noscript>/gi, "");
  var doc = new DOMParser().parseFromString(cleanHtml, "text/html");
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

SITE.parseComments = function (doc, postUrl) {
  return localParseComments(doc, postUrl);
};

SITE.routePostCustom = function (url, urlInfo, match, force) {
  var postId = localPostIdFromUrl(url);
  if (!postId || !/^\d+$/.test(postId)) return null;
  var jsonUrl = "https://techenclave.com/t/" + postId + ".json";
  var res = fetch(jsonUrl, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
  });
  if (!res || !res.ok) return null;
  var data = null;
  try {
    data = JSON.parse(res.text());
  } catch (e) {
    return null;
  }
  if (!data || !data.post_stream || !Array.isArray(data.post_stream.posts) || data.post_stream.posts.length === 0) return null;

  var posts = data.post_stream.posts;
  var p0 = posts[0];
  var title = data.title || "";
  var author = p0.name || p0.username || SITE.displayName;
  var avatar = p0.avatar_template ? p0.avatar_template.replace("{size}", "96") : "";
  if (avatar && avatar.indexOf("://") < 0) {
    avatar = "https://techenclave.com" + avatar;
  }
  var date = p0.created_at || "";

  function cookedToDetails(cooked, postUrl) {
    if (!cooked) return [];
    var doc = new DOMParser().parseFromString(cooked, "text/html");
    var root = doc.querySelector("body") || doc;
    return parseDetails(root, postUrl);
  }

  var content = cookedToDetails(p0.cooked, url);
  if (!content || content.length === 0) {
    content = [{ type: "text", value: cleanPageTitle(title) }];
  }

  var comments = [];
  for (var i = 1; i < posts.length; i++) {
    var pi = posts[i];
    var cAuthor = pi.name || pi.username || "Anonymous";
    var cAvatar = pi.avatar_template ? pi.avatar_template.replace("{size}", "96") : "";
    if (cAvatar && cAvatar.indexOf("://") < 0) {
      cAvatar = "https://techenclave.com" + cAvatar;
    }
    var cContent = cookedToDetails(pi.cooked, url);
    if (!cContent || cContent.length === 0) continue;
    var likeCount = "";
    if (pi.actions_summary) {
      for (var a = 0; a < pi.actions_summary.length; a++) {
        if (pi.actions_summary[a].id === 2 && pi.actions_summary[a].count) {
          likeCount = String(pi.actions_summary[a].count);
        }
      }
    }
    comments.push({
      link: url + "#post_" + pi.post_number,
      author: cAuthor,
      avatar: cAvatar,
      content: cContent,
      date: pi.created_at || "",
      likeCount: likeCount,
      menus: ["Reply"],
      level: pi.reply_to_post_number ? 1 : 0
    });
  }

  return {
    viewData: {
      styles: {
        title: title,
        menu: true,
        hotThreshold: 50,
        coldThreshold: 50,
        commentHotThreshold: 10,
        commentColdThreshold: 10
      },
      models: {
        author: author,
        avatar: avatar,
        date: date,
        category: "",
        viewCount: data.views ? String(data.views) : "",
        likeCount: data.like_count ? String(data.like_count) : "",
        content: content,
        comments: comments,
        link: url,
        menus: ["Open in browser", { checked: false, label: "Add to home" }],
        buttons: ["Refresh"]
      }
    },
    context: {
      kind: "post",
      link: url,
      boardId: match && match.board ? match.board.id : "",
      boardTitle: match && match.board ? match.board.title : "",
      boardUrl: match && match.board ? match.board.url : ""
    }
  };
};

SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
  return localParseBoardItemsFromHtml(boardPage && boardPage.html ? boardPage.html : "", baseUrl);
};

SITE.parseBoardItemsFromHtml = function (html, baseUrl, match, boardPage) {
  return localParseBoardItemsFromHtml(html, baseUrl);
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
