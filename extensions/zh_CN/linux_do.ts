// @ts-nocheck
// Generated local community config. Runtime: ../community_common.ts

var SITE = {
  "siteKey": "linux_do",
  "displayName": "LINUX DO",
  "country": "Mainland China",
  "category": "technology community",
  "browserHomeUrl": "https://linux.do/",
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
  "hostAliases": [],
  "acceptLanguage": "zh-CN,zh;q=0.9,en-US;q=0.6,en;q=0.5",
  "fetchHeaders": {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.6,en;q=0.5"
  },
  "challengeMarkers": [],
  "titleSuffixes": [
    " - LINUX DO",
    " | LINUX DO",
    " : LINUX DO"
  ],
  "boards": [
    {
      "id": "home",
      "title": "Home",
      "url": "https://linux.do/",
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
      "tr.topic-list-item a.title.raw-link.raw-topic-link[href*='/t/']",
      "a.title.raw-link.raw-topic-link[href*='/t/']"
    ],
    "listLink": [
      "tr.topic-list-item a.title.raw-link.raw-topic-link[href*='/t/']",
      "a.title.raw-link.raw-topic-link[href*='/t/']"
    ],
    "listTitle": [
      "tr.topic-list-item a.title.raw-link.raw-topic-link[href*='/t/']",
      "a.title.raw-link.raw-topic-link[href*='/t/']"
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
  domain: "linux.do",
  name: "linux_do",
  author: "Synura Team",
  description: "Unofficial LINUX DO.",
  version: 0.2,
  api: 0,
  license: "Apache-2.0",
  locale: "zh_CN",
  icon: "https://linux.do/favicon.ico",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "linux",
    "developers",
    "forum"
  ],
  main: null
};

var LOCAL_POST_PATTERNS = [
  /\/t\/[^\/?#]+\/\d+/i
];


var LOCAL_BOARD_LINK_SELECTORS = [
  "a.raw-link.raw-topic-link[href*='/c/']",
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

function localDiscourseJson(url) {
  var response = fetch(url, {
    headers: {
      "User-Agent": SITE.fetchHeaders["User-Agent"],
      "Accept": "application/json,text/plain,*/*",
      "Accept-Language": SITE.acceptLanguage
    }
  });
  if (!response || !response.ok) throw new Error("Failed to fetch " + url + " (" + (response ? response.status : 0) + ")");
  return JSON.parse(String(response.text ? response.text() : "").replace(/^\uFEFF/, ""));
}

function localDiscourseUserMap(data) {
  var out = {};
  var users = data && Array.isArray(data.users) ? data.users : [];
  for (var i = 0; i < users.length; i++) out[String(users[i].id)] = users[i];
  return out;
}

function localDiscourseUserForTopic(topic, users) {
  var posters = topic && Array.isArray(topic.posters) ? topic.posters : [];
  var userId = posters.length > 0 ? posters[0].user_id : "";
  return users[String(userId)] || {};
}

function localDiscourseAvatar(user) {
  var template = user && user.avatar_template ? String(user.avatar_template) : "";
  if (!template) return "";
  return ensureAbsoluteUrl(template.replace("{size}", "80"), SITE.browserHomeUrl);
}

function localDiscourseTopicUrl(topic) {
  return "https://linux.do/t/" + encodeURIComponent(topic.slug || "topic") + "/" + topic.id;
}

function localDiscourseTopicItems(data) {
  var users = localDiscourseUserMap(data);
  var topics = data && data.topic_list && Array.isArray(data.topic_list.topics) ? data.topic_list.topics : [];
  var out = [];
  for (var i = 0; i < topics.length && out.length < 30; i++) {
    var topic = topics[i];
    if (!topic || !topic.id || !topic.title) continue;
    var user = localDiscourseUserForTopic(topic, users);
    var replies = Math.max(0, toInt(topic.posts_count, 0) - 1);
    out.push({
      id: SITE.siteKey + ":" + topic.id,
      title: normalizeWhitespace(topic.title),
      description: SITE.category || SITE.displayName,
      category: SITE.country || SITE.displayName,
      author: normalizeWhitespace(user.name || user.username || ""),
      avatar: localDiscourseAvatar(user),
      date: topic.last_posted_at || topic.created_at || "",
      commentCount: replies ? String(replies) : "",
      viewCount: topic.views ? String(topic.views) : "",
      likeCount: topic.like_count ? String(topic.like_count) : "",
      hotCount: replies,
      coldCount: 0,
      types: ["link"],
      menus: [],
      link: localDiscourseTopicUrl(topic)
    });
  }
  return out;
}

function localDiscourseContent(cooked, baseUrl) {
  var html = String(cooked || "");
  if (!html) return [];
  try {
    var doc = new DOMParser().parseFromString("<div>" + html + "</div>", "text/html");
    var root = doc && doc.querySelector ? doc.querySelector("div") : null;
    var parsed = root ? parseDetails(root, baseUrl) : [];
    if (parsed && parsed.length > 0) return parsed;
  } catch (e) {
  }
  var text = normalizeWhitespace(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "));
  return text ? [{ type: "text", value: text }] : [];
}

function localDiscourseTopicJsonUrl(postUrl) {
  var info = parseAbsoluteUrl(postUrl);
  var path = info ? info.path : "";
  var parts = path.split("/");
  var topicId = localPostIdFromUrl(postUrl);
  var slug = "topic";
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === "t" && parts[i + 1] && !/^\d+$/.test(parts[i + 1])) {
      slug = parts[i + 1];
      break;
    }
  }
  return "https://linux.do/t/" + encodeURIComponent(slug) + "/" + encodeURIComponent(topicId) + ".json";
}

function localDiscoursePostModel(post, postUrl, index, level) {
  var content = localDiscourseContent(post && post.cooked, postUrl);
  if (!content || content.length === 0) return null;
  return {
    id: SITE.siteKey + ":comment:" + (post && post.id ? post.id : index),
    link: postUrl + "/" + (post && post.post_number ? post.post_number : index + 1),
    author: normalizeWhitespace(post && (post.name || post.username) ? (post.name || post.username) : ""),
    avatar: localDiscourseAvatar(post || {}),
    date: post && post.created_at ? post.created_at : "",
    content: content,
    likeCount: post && post.like_count ? String(post.like_count) : "",
    dislikeCount: "",
    level: level || 0,
    menus: [MENU_BROWSER],
    hotCount: toInt(post && post.like_count, 0),
    coldCount: 0
  };
}

SITE.routeBoardCustom = function (url, urlInfo, match, force) {
  var path = urlInfo ? (urlInfo.path || "/") : "/";
  if (path !== "/" && path !== "/latest" && path !== "/latest.json") return null;
  var data = localDiscourseJson("https://linux.do/latest.json");
  var items = localDiscourseTopicItems(data);
  var title = match && match.board ? match.board.title : SITE.displayName;
  return {
    kind: "board",
    url: url,
    viewData: {
      view: "/views/list",
      styles: { title: title },
      models: { contents: items, menus: [] }
    },
    context: {
      kind: "board",
      link: url,
      boardId: match && match.board ? match.board.id : "home",
      boardTitle: title,
      boardUrl: match && match.board ? match.board.url : SITE.browserHomeUrl,
      title: title,
      page: 1,
      nextUrl: "https://linux.do/latest.json?page=1",
      seenLinks: items.map(function (item) { return item.link; })
    }
  };
};

SITE.routePostCustom = function (url, urlInfo, match, force) {
  var data = localDiscourseJson(localDiscourseTopicJsonUrl(url));
  var posts = data && data.post_stream && Array.isArray(data.post_stream.posts) ? data.post_stream.posts : [];
  if (!posts || posts.length === 0) return null;
  var first = posts[0];
  var content = localDiscourseContent(first.cooked, url);
  var comments = [];
  for (var i = 1; i < posts.length && comments.length < 50; i++) {
    var comment = localDiscoursePostModel(posts[i], url, comments.length, 0);
    if (comment) comments.push(comment);
  }
  return {
    kind: "post",
    url: url,
    viewData: {
      view: "/views/post",
      styles: { title: normalizeWhitespace(data.title || "") || SITE.displayName },
      models: {
        author: normalizeWhitespace(first.name || first.username || ""),
        avatar: localDiscourseAvatar(first),
        date: first.created_at || "",
        category: SITE.country || "",
        viewCount: data.views ? String(data.views) : "",
        likeCount: first.like_count ? String(first.like_count) : "",
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
      boardId: match && match.board ? match.board.id : "home",
      boardTitle: match && match.board ? match.board.title : SITE.displayName,
      boardUrl: match && match.board ? match.board.url : SITE.browserHomeUrl
    }
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
var linux_doPreviousRouteBoardCustom = SITE.routeBoardCustom;
  var linux_doPreviousMatchBoard = SITE.matchBoard;
  function linux_doInfoPath(info) {
    return info && info.path ? String(info.path || "/") : "/";
  }
  function linux_doPageNumber(query, fallback) {
    var match = String(query || "").match(/(?:^|[&?])page=([0-9]+)/i);
    if (match) return parseInt(match[1], 10) || fallback || 0;
    return fallback || 0;
  }
  function linux_doLatestJsonUrl(page) {
    page = parseInt(String(page || 0), 10) || 0;
    return "https://linux.do/latest.json" + (page > 0 ? "?page=" + page : "");
  }
  function linux_doHomeBoard() {
    try {
      return localFindConfiguredBoard(SITE.browserHomeUrl) || ensureBoard("home", SITE.browserHomeUrl, SITE.displayName);
    } catch (e) {}
    return { id: "home", title: SITE.displayName, url: SITE.browserHomeUrl };
  }
  SITE.matchBoard = function (info) {
    var path = linux_doInfoPath(info);
    if (info && isKnownHost(info.host) && (path === "/latest.json" || path === "/latest")) {
      return { board: linux_doHomeBoard(), page: linux_doPageNumber(info.query, 0) };
    }
    var matched = linux_doPreviousMatchBoard ? linux_doPreviousMatchBoard(info) : null;
    if (matched && (path === "/" || path === "/latest")) matched.page = linux_doPageNumber(info && info.query, matched.page || 0);
    return matched;
  };
  SITE.routeBoardCustom = function (url, urlInfo, match, force) {
    var path = linux_doInfoPath(urlInfo);
    if (path !== "/" && path !== "/latest" && path !== "/latest.json") {
      return linux_doPreviousRouteBoardCustom ? linux_doPreviousRouteBoardCustom(url, urlInfo, match, force) : null;
    }
    var page = linux_doPageNumber(urlInfo && urlInfo.query, match && match.page ? match.page : 0);
    var data = localDiscourseJson(linux_doLatestJsonUrl(page));
    var items = localDiscourseTopicItems(data);
    var title = match && match.board ? match.board.title : SITE.displayName;
    var nextPage = page + 1;
    var nextUrl = items && items.length ? linux_doLatestJsonUrl(nextPage) : "";
    return {
      kind: "board",
      url: url,
      viewData: {
        view: "/views/list",
        styles: { title: title, menu: true, pagination: !!nextUrl, history: true, layout: "card" },
        models: { contents: items, menus: [] }
      },
      context: {
        kind: "board",
        link: url,
        boardId: match && match.board ? match.board.id : "home",
        boardTitle: title,
        boardUrl: match && match.board ? match.board.url : SITE.browserHomeUrl,
        title: title,
        page: page,
        nextUrl: nextUrl,
        seenLinks: items.map(function (item) { return item.link; })
      }
    };
  };
})();
// END synurart-own-extension-validation-fix
