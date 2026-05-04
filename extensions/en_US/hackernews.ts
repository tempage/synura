// @ts-nocheck

var SITE = {
  siteKey: "hackernews",
  displayName: "Hacker News",
  country: "United States",
  category: "technology community",
  browserHomeUrl: "https://news.ycombinator.com/news",
  browserCookieAuth: false,
  minimumHomeBoards: 8,
  defaultCacheTtlMs: 300000,
  showCacheSnackbarByDefault: true,
  enableCacheSettings: true,
  enableBoardReorder: true,
  enableBoardDelete: true,
  boardSettingsMenuLabel: "Boards",
  boardSettingsTitle: "Board Settings",
  boardSettingsLargeThreshold: 128,
  boardSettingsPageSize: 96,
  boardAddMode: "url_title",
  hasFullBoardCatalog: true,
  supportsBoardCatalogSync: false,
  defaultVisibleBoardIds: ["news", "newest", "front", "comments", "best", "ask", "show", "jobs"],
  hostAliases: ["www.news.ycombinator.com"],
  fetchHeaders: {
    "User-Agent": "Synura/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9"
  },
  titleSuffixes: [" | Hacker News", " - Hacker News"],
  boards: [
    { id: "news", title: "Top", url: "/news", description: "Front page stories" },
    { id: "newest", title: "New", url: "/newest", description: "Newest submissions" },
    { id: "front", title: "Past", url: "/front", description: "Past front pages" },
    { id: "comments", title: "Comments", url: "/newcomments", description: "Latest comments" },
    { id: "best", title: "Best", url: "/best", description: "Best recent stories" },
    { id: "ask", title: "Ask HN", url: "/ask", description: "Questions and discussion" },
    { id: "show", title: "Show HN", url: "/show", description: "Projects from the community" },
    { id: "jobs", title: "Jobs", url: "/jobs", description: "Hiring posts" }
  ],
  selectors: {
    boardTitle: ["title"],
    listRows: ["tr.athing", "tr.athing.comtr"],
    listLink: [".titleline a[href]", "a[href*='item?id=']"],
    listTitle: [".titleline a", ".commtext", "a[href*='item?id=']"],
    postTitle: [".fatitem .titleline a", ".titleline a", "title"],
    postAuthor: [".fatitem .hnuser", ".hnuser"],
    postDate: [".fatitem .age", ".age"],
    postContent: [".fatitem", "table.fatitem", "body"],
    commentRows: ["tr.athing.comtr"],
    commentAuthor: [".hnuser"],
    commentAvatar: [],
    commentContent: [".commtext"],
    commentDate: [".age"],
    commentLikeCount: [],
    commentLevel: [".ind img"]
  },
  commentLevelAttrs: []
};

var SYNURA = {
  domain: "news.ycombinator.com",
  name: "hackernews",
  author: "Synura Team",
  description: "Unofficial Hacker News extension with feeds, stories, and comments.",
  version: 0.2,
  api: 0,
  license: "Apache-2.0",
  locale: "en_US",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "technology",
    "startups",
    "news"
  ],
  main: null
};

function hnDiscussionUrl(id) {
  return "https://" + SYNURA.domain + "/item?id=" + encodeURIComponent(String(id || ""));
}

function hnPath(info) {
  return String((info && info.path) || "/").replace(/^\/+|\/+$/g, "") || "news";
}

function hnBoardByPath(path) {
  var normalized = normalizeWhitespace(path || "news");
  if (normalized === "newcomments") normalized = "comments";
  if (!normalized) normalized = "news";
  for (var i = 0; i < SITE.boards.length; i++) {
    if (SITE.boards[i].id === normalized || String(SITE.boards[i].url || "").replace(/^\/+/, "") === normalized) {
      return boardById(SITE.boards[i].id) || SITE.boards[i];
    }
  }
  return boardById("news") || SITE.boards[0];
}

function hnItemIdFromUrl(url) {
  var info = parseAbsoluteUrl(url);
  return info ? queryValue(info.query, "id") : "";
}

function hnCommentCount(text) {
  var value = normalizeWhitespace(text);
  if (!value || value === "discuss") return "";
  var match = value.match(/([0-9,]+)\s+comments?/i);
  return match ? parseCount(match[1]) : "";
}

function hnSiteHost(url) {
  var info = parseAbsoluteUrl(url);
  if (!info || !info.host || info.host === SYNURA.domain) return "";
  return info.host.replace(/^www\./, "");
}

function hnSubtextForRow(row) {
  var next = row ? row.nextSibling : null;
  while (next && next.nodeType !== 1) next = next.nextSibling;
  return next;
}

function hnIndentLevel(row) {
  var img = firstNode(row, [".ind img"]);
  var width = parseInt(attrOf(img, "width") || "0", 10);
  if (isNaN(width) || width <= 0) return 0;
  return Math.max(0, Math.floor(width / 40));
}

function hnExtractListItems(doc, baseUrl) {
  var rows = allNodes(doc, ["tr.athing"]);
  var items = [];
  for (var i = 0; i < rows.length && items.length < 40; i++) {
    var id = attrOf(rows[i], "id");
    var titleNode = firstNode(rows[i], [".titleline a[href]", "a.storylink"]);
    var title = textOf(titleNode);
    if (!id || !title) continue;

    var subtext = hnSubtextForRow(rows[i]);
    var externalUrl = ensureAbsoluteUrl(attrOf(titleNode, "href"), baseUrl);
    var discussionUrl = hnDiscussionUrl(id);
    var commentsLink = firstNode(subtext, ["a[href*='item?id=']"]);
    var scoreText = firstText(subtext, [".score"]);
    var commentCount = hnCommentCount(textOf(commentsLink));
    var host = hnSiteHost(externalUrl);

    items.push({
      id: SITE.siteKey + ":" + id,
      title: title,
      description: host || "news.ycombinator.com",
      category: host || SITE.displayName,
      author: firstText(subtext, [".hnuser"]),
      avatar: "",
      date: firstText(subtext, [".age"]),
      commentCount: commentCount,
      viewCount: "",
      likeCount: parseCount(scoreText),
      hotCount: toInt(scoreText, 0),
      coldCount: 0,
      types: ["link"],
      menus: [],
      link: discussionUrl
    });
  }
  return items;
}

function extractListItem(row, baseUrl) {
  var items = hnExtractListItems({ querySelectorAll: function () { return [row]; } }, baseUrl);
  return items.length > 0 ? items[0] : null;
}

function hnParseComments(doc, postUrl) {
  var rows = allNodes(doc, ["tr.athing.comtr"]);
  var comments = [];
  var seen = {};
  for (var i = 0; i < rows.length && comments.length < 120; i++) {
    var id = attrOf(rows[i], "id") || ("comment-" + comments.length);
    var contentRoot = firstNode(rows[i], [".commtext"]);
    var text = textOf(contentRoot);
    if (!text || text.length < 2 || seen[id] || seen[text.substring(0, 220)]) continue;
    seen[id] = true;
    seen[text.substring(0, 220)] = true;
    var content = parseDetails(contentRoot, postUrl);
    if (!content || content.length === 0) content = [{ type: "text", value: text }];
    comments.push({
      id: SITE.siteKey + ":comment:" + id,
      link: postUrl + "#" + id,
      author: firstText(rows[i], [".hnuser"]),
      avatar: "",
      date: firstText(rows[i], [".age"]),
      content: content,
      likeCount: "",
      dislikeCount: "",
      level: hnIndentLevel(rows[i]),
      menus: [MENU_BROWSER],
      hotCount: 0,
      coldCount: 0
    });
  }
  return comments;
}

SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
  return hnExtractListItems(doc, baseUrl);
};

SITE.parseComments = function (doc, postUrl) {
  return hnParseComments(doc, postUrl);
};

SITE.filterPostContent = function (content, url, doc) {
  var id = hnItemIdFromUrl(url);
  var titleNode = firstNode(doc, [".fatitem .titleline a[href]", ".titleline a[href]"]);
  var title = textOf(titleNode);
  var href = ensureAbsoluteUrl(attrOf(titleNode, "href"), url);
  var details = [];
  if (title) details.push({ type: "text", value: title });
  if (href && href !== url) details.push({ type: "link", value: href, link: href });
  if (details.length === 0 && content && content.length > 0) details = content;
  if (id && details.length === 0) details.push({ type: "link", value: hnDiscussionUrl(id), link: hnDiscussionUrl(id) });
  return details;
};

SITE.cleanPostTitle = function (title, doc, match) {
  var node = firstNode(doc, [".fatitem .titleline a", ".titleline a"]);
  return cleanPageTitle(textOf(node) || title);
};

SITE.buildNextPageUrl = function (match, url, nextPage) {
  return setQueryParam(url, "p", nextPage);
};

SITE.matchPost = function (info) {
  if (!info || !isKnownHost(info.host)) return null;
  if (hnPath(info) !== "item") return null;
  var id = queryValue(info.query, "id");
  if (!id) return null;
  return {
    board: boardById("news") || SITE.boards[0],
    postId: id,
    page: 1
  };
};

SITE.matchBoard = function (info) {
  if (!info || !isKnownHost(info.host)) return null;
  var path = hnPath(info);
  if (path === "item") return null;
  return {
    board: hnBoardByPath(path),
    page: queryInt(info.query, "p", 1)
  };
};
