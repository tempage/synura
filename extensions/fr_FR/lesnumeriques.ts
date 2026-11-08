// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "lesnumeriques",
  "displayName": "Les Numériques Forum",
  "country": "France",
  "category": "technology and electronics forum",
  "browserHomeUrl": "https://forum.lesnumeriques.com/",
  "browserCookieAuth": false,
  "minimumHomeBoards": 5,
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
    "www.forum.lesnumeriques.com"
  ],
  "acceptLanguage": "fr-FR,fr;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - Le Grand Forum - Les Numériques",
    " | Les Numériques",
    " : Les Numériques"
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
      "id": "mobilite",
      "title": "Téléphonie & Mobilité",
      "url": "https://forum.lesnumeriques.com/c/mobilite/14",
      "description": "Smartphones, tablettes, montres connectées",
      "group": "High-Tech"
    },
    {
      "id": "audio",
      "title": "Audio",
      "url": "https://forum.lesnumeriques.com/c/audio/9",
      "description": "Casques, enceintes, home cinéma",
      "group": "High-Tech"
    },
    {
      "id": "informatique",
      "title": "Informatique",
      "url": "https://forum.lesnumeriques.com/c/informatique/10",
      "description": "PC portables, composants, écrans",
      "group": "High-Tech"
    },
    {
      "id": "photo",
      "title": "Photo",
      "url": "https://forum.lesnumeriques.com/c/photo/8",
      "description": "Appareils photo, objectifs, drones",
      "group": "High-Tech"
    },
    {
      "id": "maison",
      "title": "Maison & Électroménager",
      "url": "https://forum.lesnumeriques.com/c/maison-electromenager/13",
      "description": "Aspirateurs, robots, café, électroménager",
      "group": "Maison"
    }
  ],
  "selectors": {
    "boardTitle": [
      "h1",
      ".badge-category",
      "title"
    ],
    "listRows": ["tr.topic-list-item"],
    "listLink": ["a.raw-topic-link", "a.title"],
    "listTitle": [
      "a[href*='/t/']"
    ],
    "listTitleExclude": [
      ".badge",
      ".badge-category"
    ],
    "listAuthor": [".posters a[data-user-card]"],
    "listAvatar": [".posters img"],
    "listDate": ["td:last-child"],
    "listCommentCount": ["td.replies"],
    "listViewCount": ["td.views .number", "td.views"],
    "listLikeCount": [],
    "listCategory": [".category-name"],
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
  ]
};

var SYNURA = {
  domain: "forum.lesnumeriques.com",
  name: "lesnumeriques",
  author: "Synura Team",
  description: "forum.lesnumeriques.com",
  version: 0.4,
  api: 0,
  license: "Apache-2.0",
  locale: "fr_FR",
  icon: "https://www.lesnumeriques.com/favicon.ico",
  bypass: "chrome/windows",
  deeplink: true,
  tags: [
    "france",
    "tech",
    "hardware",
    "gadgets",
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
  link = localCanonicalizeUrl(link);
  if (!link || localLooksLikeAssetUrl(link) || !localLooksLikePostUrl(link)) return null;
  var title = localTitleFromNode(linkNode);
  title = textOfNodeWithoutSelectors(row, selectorList("listTitleExclude", [])).length < title.length ? title : cleanPageTitle(title);
  if (!title) return null;
  var commentCount = parseCount(firstText(row, selectorList("listCommentCount", [])));
  var image = imageUrlFromNode(firstNode(row, selectorList("listImage", ["img"])), baseUrl);
  return {
    id: SITE.siteKey + ":" + localPostIdFromUrl(link),
    link: normalizeUrl(link) || link,
    title: title,
    author: (attrOf(firstNode(row, [".posters a"]), "href").match(/\/u\/([^/?#]+)/) || [""])[1] || "",
    avatar: imageUrlFromNode(firstNode(row, selectorList("listAvatar", [])), baseUrl),
    date: firstDateText(row, selectorList("listDate", [])),
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

SITE.routePostCustom = async function (url, urlInfo, match, force) {
  var postId = localPostIdFromUrl(url);
  if (!postId || !/^\d+$/.test(postId)) return null;
  var jsonUrl = "https://forum.lesnumeriques.com/t/" + postId + ".json";
  var res = (await fetch(jsonUrl, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
  }));
  if (!res || !res.ok) return null;
  var data = null;
  try {
    data = JSON.parse((await res.text()));
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
    avatar = "https://forum.lesnumeriques.com" + avatar;
  }
  var date = p0.created_at || "";

  function cookedToDetails(cooked, postUrl) {
    if (!cooked) return [];
    var doc = new DOMParser().parseFromString(cooked, "text/html");
    var root = doc.querySelector("body") || doc;
    return parseDetails(root, postUrl);
  }

  var content = cookedToDetails(p0.cooked, url);
  if (!content || content.length === 0) return null;

  var comments = [];
  for (var i = 1; i < posts.length; i++) {
    var pi = posts[i];
    var cAuthor = pi.name || pi.username || "Anonymous";
    var cAvatar = pi.avatar_template ? pi.avatar_template.replace("{size}", "96") : "";
    if (cAvatar && cAvatar.indexOf("://") < 0) {
      cAvatar = "https://forum.lesnumeriques.com" + cAvatar;
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
      menus: ["Répondre"],
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
        menus: ["Ouvrir dans le navigateur", { checked: false, label: "Ajouter à l'accueil" }],
        buttons: ["Actualiser"]
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
