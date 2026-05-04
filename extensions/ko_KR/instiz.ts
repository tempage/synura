// @ts-nocheck

var SITE = {
  siteKey: "instiz",
  displayName: "인스티즈",
  browserHomeUrl: "https://www.instiz.net/",
  browserCookieAuth: false,
  minimumHomeBoards: 10,
  defaultCacheTtlMs: 600000,
  showCacheSnackbarByDefault: true,
  enableCacheSettings: true,
  enableBoardReorder: true,
  enableBoardDelete: true,
  boardSettingsMenuLabel: "게시판",
  boardSettingsTitle: "게시판 설정",
  boardSettingsLargeThreshold: 128,
  boardSettingsPageSize: 64,
  boardAddMode: "url_title",
  hasFullBoardCatalog: false,
  supportsBoardCatalogSync: false,
  defaultVisibleBoardIds: [
    "home", "hot.htm", "pt", "name", "name_enter",
    "market", "writing", "ogong", "name_beauty", "name_study"
  ],
  hostAliases: ["instiz.net", "m.instiz.net"],
  challengeMarkers: [],
  titleSuffixes: [" - 인스티즈(instiz)", " - 인스티즈", " : 인스티즈"],
  linkAllowPatterns: [
    "^https://www\\.instiz\\.net/[A-Za-z0-9_]+/\\d+"
  ],
  listBoardQueryParam: "page",
  hotThreshold: 1000,
  coldThreshold: 10,
  commentHotThreshold: 5,
  commentColdThreshold: 3,
  boards: [
    { id: "home", title: "홈", url: "/", description: "인스티즈 홈" },
    { id: "hot.htm", title: "HOT", url: "/hot.htm", description: "인기글" },
    { id: "pt", title: "이슈", url: "/pt", description: "이슈" },
    { id: "name", title: "일상", url: "/name", description: "일상" },
    { id: "name_enter", title: "연예", url: "/name_enter", description: "연예" },
    { id: "market", title: "장터", url: "/market", description: "장터" },
    { id: "writing", title: "픽션", url: "/writing", description: "픽션" },
    { id: "ogong", title: "공포", url: "/ogong", description: "공포" },
    { id: "name_beauty", title: "뷰티", url: "/name_beauty", description: "뷰티" },
    { id: "name_study", title: "스터디", url: "/name_study", description: "스터디" }
  ],
  selectors: {
    boardTitle: ["#nowsubject", ".board_name"],
    listRows: [
      "#mainboard tr.cmt_view", "#mainboard tr[data-no]", ".board_list li[data-no]", ".article-list li[data-no]",
      "a[href*='/pt/']", "a[href*='/name/']", "a[href*='/name_enter/']",
      "a[href*='/market/']", "a[href*='/writing/']", "a[href*='/ogong/']"
    ],
    listLink: [
      "a[href*='/pt/']", "a[href*='/name/']", "a[href*='/name_enter/']",
      "a[href*='/market/']", "a[href*='/writing/']", "a[href*='/ogong/']"
    ],
    listTitle: [
      "a[href*='/pt/']", "a[href*='/name/']", "a[href*='/name_enter/']",
      "a[href*='/market/']", "a[href*='/writing/']", "a[href*='/ogong/']"
    ],
    listTitleExclude: [".cmt", ".comment_count", ".reply_count", ".hit", ".date"],
    listAuthor: [".cmt_name", ".name", ".nick", ".nickname"],
    listAvatar: [".cmt_td img", ".profile img"],
    listDate: [".cmt_date", ".date", "time[datetime]"],
    listCommentCount: [".comment_count", ".reply_count"],
    listViewCount: [".hit"],
    listLikeCount: [".recommend"],
    listCategory: [".board_name", ".cate"],
    listImage: [],
    postTitle: ["#nowsubject"],
    postAuthor: [".cmt_name", ".name", ".nick", ".nickname"],
    postAvatar: [".cmt_td img", ".profile img"],
    postDate: [".cmt_date", ".date", "time[datetime]"],
    postViewCount: [".hit"],
    postLikeCount: [".recommend"],
    postCategory: [".board_name", ".cate"],
    postContent: ["#memo_content", "#content .memo_content", ".view-content"],
    commentRows: ["#ajax_comment tr.cmt_view", "#ajax_comment .memo", "#ajax_comment .comment_row"],
    commentAuthor: ["#ajax_comment .cmt_name", "#ajax_comment .name", "#ajax_comment .nick"],
    commentAvatar: ["#ajax_comment .cmt_td img", "#ajax_comment .profile img"],
    commentContent: ["#ajax_comment .memo_content", "#ajax_comment .comment_text"],
    commentDate: ["#ajax_comment .cmt_date", "#ajax_comment .date", "#ajax_comment time[datetime]"],
    commentLikeCount: ["#ajax_comment .recommend"],
    commentLevel: []
  },
  commentLevelAttrs: ["data-depth", "depth"],
  useRawPostParse: true,
  useRawPostParseInEmulator: true
};

var SYNURA = {
  domain: "www.instiz.net",
  name: "instiz",
  author: "Synura Team",
  description: "Unofficial Instiz.",
  version: 0.2,
  api: 0,
  license: "Apache-2.0",
  bypass: "chrome/android",
  locale: "ko_KR",
  deeplink: true,
  icon: "https://www.instiz.net/favicon.ico",
  tags: [
    "entertainment",
    "fandom",
    "forum"
  ],
  main: null
};

var LIST_LINK_ALLOW_PATTERNS = SITE.linkAllowPatterns;

function extractListItem(row, baseUrl) {
  return localCommunityExtractListItem(row, baseUrl, LIST_LINK_ALLOW_PATTERNS);
}

SITE.parseComments = function (doc, postUrl) {
  var comments = instizParseComments(doc, postUrl);
  if (comments.length > 0) return comments;
  return localCommunityParseComments(doc, postUrl);
};

SITE.cleanPostTitle = function (title, doc, match) {
  var node = firstNode(doc, ["#nowsubject"]);
  if (node) {
    var clean = localCommunityCleanTitle(textOfNodeWithoutSelectors(node, [".cmt", ".cmt2", ".cmt3", ".minitext"]));
    var commentCount = firstText(node, [".cmt", ".cmt2", ".cmt3"]);
    if (commentCount && clean.slice(-commentCount.length) === commentCount) {
      clean = normalizeWhitespace(clean.substring(0, clean.length - commentCount.length));
    }
    if (clean) return clean;
  }
  return localCommunityCleanTitle(title);
};

SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
  var boardId = match && match.board ? normalizeWhitespace(match.board.id) : "";
  if (boardId !== "home" && boardId !== "hot.htm") return [];

  var links = allNodes(doc, ["#boardhot .realchart_item_a a[href]", ".realchart_item_a a[href]"]);
  var items = [];
  var seen = {};

  for (var i = 0; i < links.length && items.length < 80; i++) {
    var linkNode = links[i];
    var link = normalizeUrl(ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl));
    if (!link || seen[link] || !/^https:\/\/www\.instiz\.net\/[A-Za-z0-9_]+\/\d+/.test(link)) continue;
    seen[link] = true;

    var title = localCommunityCleanTitle(firstText(linkNode, [".post_title"]) || textOf(linkNode));
    if (!title) continue;

    var category = firstText(linkNode, [".minitext"]);
    var commentCount = hideZeroCount(parseCount(firstText(linkNode, [".cmt"])));
    items.push({
      link: link,
      title: title,
      author: "",
      avatar: "",
      date: "",
      category: category,
      commentCount: commentCount,
      viewCount: "",
      likeCount: "",
      mediaUrl: "",
      mediaType: "",
      types: [],
      menus: [],
      hotCount: toInt(commentCount, 0),
      coldCount: 0
    });
  }

  return items;
};

function localCommunityCleanTitle(value) {
  return normalizeWhitespace(value)
    .replace(/\s*\[[0-9,]+\]\s*$/, "")
    .replace(/\s*\([0-9,]+\)\s*$/, "")
    .replace(/\s+(댓글|조회|추천)\s*[0-9,]+\s*$/i, "")
    .trim();
}

function instizCommentLevel(row) {
  var node = firstNode(row, [".lv div"]);
  var className = attrOf(node, "class");
  var match = className.match(/\blv(\d+)\b/);
  if (!match) return 0;
  var level = parseInt(match[1], 10);
  return isNaN(level) ? 0 : level;
}

function instizParseComments(doc, postUrl) {
  var rows = allNodes(doc, ["#ajax_comment tr.cmt_view", "tr.cmt_view"]);
  var comments = [];

  for (var i = 0; i < rows.length && comments.length < 80; i++) {
    var row = rows[i];
    var contentRoot = firstNode(row, [".comment_line span[id^='n']", ".comment_line"]);
    var plain = textOf(contentRoot);
    if (!plain || plain.length < 2) continue;

    var content = parseDetails(contentRoot, postUrl);
    if (!content || content.length === 0) content = [{ type: "text", value: plain }];

    var domId = attrOf(row, "id");
    comments.push({
      id: SITE.siteKey + ":comment:" + (domId || comments.length),
      link: postUrl + (domId ? ("#" + domId) : ("#comment-" + comments.length)),
      author: "",
      avatar: imageUrlFromNode(firstNode(row, [".cmt_td img", "img"]), postUrl),
      date: firstText(row, [".minitext"]),
      content: content,
      likeCount: "",
      dislikeCount: "",
      level: instizCommentLevel(row),
      menus: [MENU_BROWSER],
      hotCount: 0,
      coldCount: 0
    });
  }

  return comments;
}

function localCommunityExtractListItem(row, baseUrl, linkPatterns) {
  var linkSelectors = selectorList("listLink", [
    "a[href*='/pt/']", "a[href*='/name/']", "a[href*='/name_enter/']",
    "a[href*='/market/']", "a[href*='/writing/']", "a[href*='/ogong/']"
  ]);
  var titleSelectors = selectorList("listTitle", [
    "a[href*='/pt/']", "a[href*='/name/']", "a[href*='/name_enter/']",
    "a[href*='/market/']", "a[href*='/writing/']", "a[href*='/ogong/']"
  ]);
  var titleExcludeSelectors = selectorList("listTitleExclude", [
    ".cmt", ".comment_count", ".reply_count", ".hit", ".date"
  ]);
  var commentCountSelectors = selectorList("listCommentCount", [".comment_count", ".reply_count"]);
  var viewCountSelectors = selectorList("listViewCount", [".hit"]);
  var likeCountSelectors = selectorList("listLikeCount", [".recommend"]);
  var authorSelectors = selectorList("listAuthor", [".cmt_name", ".name", ".nick", ".nickname"]);
  var avatarSelectors = selectorList("listAvatar", [".cmt_td img", ".profile img"]);
  var imageSelectors = selectorList("listImage", []);
  var categorySelectors = selectorList("listCategory", [".board_name", ".cate"]);
  var dateSelectors = selectorList("listDate", [".cmt_date", ".date", "time[datetime]"]);
  var linkNode = firstNode(row, linkSelectors);
  var titleNode = firstNode(row, titleSelectors);
  var link = extractListLink(row, baseUrl, linkSelectors, linkPatterns || SITE.linkAllowPatterns || []);
  if (!link) return null;

  var title = localCommunityCleanTitle(firstNonEmpty([
    textOfNodeWithoutSelectors(titleNode, titleExcludeSelectors),
    textOfNodeWithoutSelectors(linkNode, titleExcludeSelectors),
    textOf(row)
  ]));
  if (!title || title.length < 2 || title === SITE.displayName) return null;

  var commentCount = hideZeroCount(parseCount(firstText(row, commentCountSelectors)));
  var viewCount = hideZeroCount(parseCount(firstText(row, viewCountSelectors)));
  var likeCount = hideZeroCount(parseCount(firstText(row, likeCountSelectors)));
  var author = firstAuthorText(row, authorSelectors);
  var avatarSourceSelectors = avatarSelectors.length > 0 ? avatarSelectors : authorSelectors;
  var avatar = imageUrlFromNode(firstNode(row, avatarSourceSelectors), baseUrl);
  var mediaUrl = imageUrlFromNode(firstNode(row, imageSelectors), baseUrl);
  var types = [];
  if (mediaUrl) types.push("image");

  return {
    link: normalizeUrl(link) || link,
    title: title,
    author: author,
    avatar: avatar,
    date: firstText(row, dateSelectors),
    category: firstText(row, categorySelectors),
    commentCount: commentCount,
    viewCount: viewCount,
    likeCount: likeCount,
    mediaUrl: mediaUrl,
    mediaType: mediaUrl ? "image" : "",
    types: types,
    menus: [],
    hotCount: toInt(viewCount || likeCount || commentCount, 0),
    coldCount: toInt(likeCount || commentCount, 0)
  };
}

function localCommunityParseComments(doc, postUrl) {
  var rows = allNodes(doc, selectorList("commentRows", [
    "#ajax_comment tr.cmt_view", "#ajax_comment .memo", "#ajax_comment .comment_row"
  ]));
  var contentSelectors = selectorList("commentContent", [
    "#ajax_comment .memo_content", "#ajax_comment .comment_text"
  ]);
  var authorSelectors = selectorList("commentAuthor", ["#ajax_comment .cmt_name", "#ajax_comment .name", "#ajax_comment .nick"]);
  var avatarSelectors = selectorList("commentAvatar", ["#ajax_comment .cmt_td img", "#ajax_comment .profile img"]);
  var dateSelectors = selectorList("commentDate", ["#ajax_comment .cmt_date", "#ajax_comment .date", "#ajax_comment time[datetime]"]);
  var likeSelectors = selectorList("commentLikeCount", ["#ajax_comment .recommend"]);
  var comments = [];
  var seen = {};

  for (var i = 0; i < rows.length && comments.length < 80; i++) {
    var row = rows[i];
    var contentRoot = firstNode(row, contentSelectors) || row;
    var content = parseDetails(contentRoot, postUrl);
    var plain = textOf(contentRoot);
    if ((!content || content.length === 0) && plain) content = [{ type: "text", value: plain }];
    if (!content || content.length === 0 || plain.length < 2) continue;

    var key = normalizeWhitespace(plain).substring(0, 220).toLowerCase();
    if (!key || seen[key]) continue;
    seen[key] = true;

    var domId = attrOf(row, "id");
    comments.push({
      id: SITE.siteKey + ":comment:" + comments.length,
      link: postUrl + (domId ? ("#" + domId) : ("#comment-" + comments.length)),
      author: firstAuthorText(row, authorSelectors),
      avatar: imageUrlFromNode(firstNode(row, avatarSelectors), postUrl),
      date: firstText(row, dateSelectors),
      content: content,
      likeCount: hideZeroCount(parseCount(firstText(row, likeSelectors))),
      dislikeCount: "",
      level: detectCommentLevel(row),
      menus: [MENU_BROWSER],
      hotCount: toInt(firstText(row, likeSelectors), 0),
      coldCount: 0
    });
  }

  return comments;
}

SITE.buildBoardUrlFromId = function (boardId) {
  var id = normalizeWhitespace(boardId);
  if (!id || id === "home") return "https://" + SYNURA.domain + "/";
  return "https://" + SYNURA.domain + "/" + encodeURIComponent(id);
};

SITE.buildNextPageUrl = function (match, url, nextPage) {
  return setQueryParam(url, "page", nextPage);
};

SITE.matchBoard = function (info) {
  var parts = pathSegments(info.path);
  if (parts.length === 0) {
    return {
      board: ensureBoard("home", SITE.buildBoardUrlFromId("home"), "홈"),
      page: queryInt(info.query, "page", 1)
    };
  }
  if (parts.length === 1 && !/^\d+$/.test(parts[0])) {
    return {
      board: ensureBoard(parts[0], SITE.buildBoardUrlFromId(parts[0]), parts[0]),
      page: queryInt(info.query, "page", 1)
    };
  }
  if (parts.length >= 2 && parts[0] === "bbs" && parts[1] === "list.php") {
    var id = queryValue(info.query, "id") || queryValue(info.query, "bo_table");
    if (id) {
      return {
        board: ensureBoard(id, SITE.buildBoardUrlFromId(id), id),
        page: queryInt(info.query, "page", 1)
      };
    }
  }
  return null;
};

SITE.matchPost = function (info) {
  var parts = pathSegments(info.path);
  if (parts.length >= 2 && !/^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
    return {
      board: ensureBoard(parts[0], SITE.buildBoardUrlFromId(parts[0]), parts[0]),
      postId: parts[1]
    };
  }
  if (parts.length >= 2 && parts[0] === "bbs" && parts[1] === "board.php") {
    var id = queryValue(info.query, "id") || queryValue(info.query, "bo_table");
    var postId = queryValue(info.query, "no") || queryValue(info.query, "wr_id");
    if (id && postId) {
      return {
        board: ensureBoard(id, SITE.buildBoardUrlFromId(id), id),
        postId: postId
      };
    }
  }
  return null;
};
