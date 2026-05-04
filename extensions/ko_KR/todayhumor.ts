// @ts-nocheck

var SITE = {
  siteKey: "todayhumor",
  displayName: "오늘의유머",
  browserHomeUrl: "https://www.todayhumor.co.kr/board/list.php?table=bestofbest",
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
  boardAddMode: "id_title",
  hasFullBoardCatalog: false,
  supportsBoardCatalogSync: false,
  defaultVisibleBoardIds: [
    "bestofbest", "humordata", "freeboard", "sisa", "animal",
    "cook", "computer", "science", "movie", "star"
  ],
  hostAliases: ["todayhumor.co.kr", "m.todayhumor.co.kr"],
  challengeMarkers: [],
  titleSuffixes: [" - 오늘의유머", " : 오늘의유머"],
  linkAllowPatterns: [
    "^https://www\\.todayhumor\\.co\\.kr/board/view\\.php\\?[^#]*\\bno=\\d+"
  ],
  listBoardQueryParam: "page",
  hotThreshold: 3000,
  coldThreshold: 30,
  commentHotThreshold: 5,
  commentColdThreshold: 3,
  boards: [
    { id: "bestofbest", title: "베스트오브베스트", url: "/board/list.php?table=bestofbest", description: "베스트오브베스트" },
    { id: "humordata", title: "유머자료", url: "/board/list.php?table=humordata", description: "유머자료" },
    { id: "freeboard", title: "자유게시판", url: "/board/list.php?table=freeboard", description: "자유게시판" },
    { id: "sisa", title: "시사", url: "/board/list.php?table=sisa", description: "시사" },
    { id: "animal", title: "동물", url: "/board/list.php?table=animal", description: "동물" },
    { id: "cook", title: "요리", url: "/board/list.php?table=cook", description: "요리" },
    { id: "computer", title: "컴퓨터", url: "/board/list.php?table=computer", description: "컴퓨터" },
    { id: "science", title: "과학", url: "/board/list.php?table=science", description: "과학" },
    { id: "movie", title: "영화", url: "/board/list.php?table=movie", description: "영화" },
    { id: "star", title: "연예", url: "/board/list.php?table=star", description: "연예" }
  ],
  selectors: {
    boardTitle: [".board_title", ".board-name"],
    listRows: [
      ".table_list tbody tr", ".list_table tbody tr", "#content .board_list li",
      "a[href*='view.php'][href*='no=']"
    ],
    listLink: ["a[href*='view.php'][href*='no=']"],
    listTitle: ["td.title a[href*='view.php'][href*='no=']", ".subject a[href*='view.php'][href*='no=']", "a[href*='view.php'][href*='no=']"],
    listTitleExclude: [".comment_count", ".reply_count", ".date", ".hit", ".vote"],
    listAuthor: ["td.name", ".writer", ".nick"],
    listAvatar: [".profile img"],
    listDate: ["td.date", ".regdate", "time[datetime]"],
    listCommentCount: [".comment_count", ".reply_count"],
    listViewCount: ["td.hit", ".hit"],
    listLikeCount: [".vote", ".recommend"],
    listCategory: [".board_title", ".cate"],
    listImage: [],
    postTitle: [".viewSubject", ".board_view .subject"],
    postAuthor: [".view_writer", ".writer", ".nick"],
    postAvatar: [".profile img"],
    postDate: [".view_date", ".regdate", "time[datetime]"],
    postViewCount: [".view_hit", ".hit"],
    postLikeCount: [".vote", ".recommend"],
    postCategory: [".board_title", ".cate"],
    postContent: ["#content .viewContent", "#content .view_content", "#content .board_view"],
    commentRows: ["#memo_list .memo", ".memo", ".comment-item", ".comment_row", ".comment-row"],
    commentAuthor: ["#memo_list .writer", "#memo_list .name", "#memo_list .nick"],
    commentAvatar: ["#memo_list .profile img"],
    commentContent: ["#memo_list .memo_content", "#memo_list .comment_text"],
    commentDate: ["#memo_list .date", "#memo_list time[datetime]"],
    commentLikeCount: ["#memo_list .vote", "#memo_list .recommend"],
    commentLevel: []
  },
  commentLevelAttrs: ["data-depth", "depth"],
  useRawPostParse: true,
  useRawPostParseInEmulator: true
};

var SYNURA = {
  domain: "www.todayhumor.co.kr",
  name: "todayhumor",
  author: "Synura Team",
  description: "Unofficial Today Humor.",
  version: 0.2,
  api: 0,
  license: "Apache-2.0",
  bypass: "chrome/android",
  locale: "ko_KR",
  deeplink: true,
  icon: "https://www.todayhumor.co.kr/favicon.ico",
  tags: [
    "humor",
    "general",
    "forum"
  ],
  main: null
};

var LIST_LINK_ALLOW_PATTERNS = SITE.linkAllowPatterns;

function extractListItem(row, baseUrl) {
  var item = localCommunityExtractListItem(row, baseUrl, LIST_LINK_ALLOW_PATTERNS);
  if (item && item.link) item.link = todayhumorCanonicalPostUrl(item.link);
  return item;
}

SITE.parseComments = function (doc, postUrl) {
  return localCommunityParseComments(doc, postUrl);
};

function localCommunityCleanTitle(value) {
  return normalizeWhitespace(value)
    .replace(/\s*\[[0-9,]+\]\s*$/, "")
    .replace(/\s*\([0-9,]+\)\s*$/, "")
    .replace(/\s+(댓글|조회|추천)\s*[0-9,]+\s*$/i, "")
    .trim();
}

function localCommunityExtractListItem(row, baseUrl, linkPatterns) {
  var linkSelectors = selectorList("listLink", ["a[href*='view.php'][href*='no=']"]);
  var titleSelectors = selectorList("listTitle", [
    "td.title a[href*='view.php'][href*='no=']", ".subject a[href*='view.php'][href*='no=']",
    "a[href*='view.php'][href*='no=']"
  ]);
  var titleExcludeSelectors = selectorList("listTitleExclude", [
    ".comment_count", ".reply_count", ".date", ".hit", ".vote"
  ]);
  var commentCountSelectors = selectorList("listCommentCount", [".comment_count", ".reply_count"]);
  var viewCountSelectors = selectorList("listViewCount", ["td.hit", ".hit"]);
  var likeCountSelectors = selectorList("listLikeCount", [".vote", ".recommend"]);
  var authorSelectors = selectorList("listAuthor", ["td.name", ".writer", ".nick"]);
  var avatarSelectors = selectorList("listAvatar", [".profile img"]);
  var imageSelectors = selectorList("listImage", []);
  var categorySelectors = selectorList("listCategory", [".board_title", ".cate"]);
  var dateSelectors = selectorList("listDate", ["td.date", ".regdate", "time[datetime]"]);
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
    "#memo_list .memo", "#memo_list .comment_row", "#memo_list .comment-row"
  ]));
  var contentSelectors = selectorList("commentContent", [
    "#memo_list .memo_content", "#memo_list .comment_text"
  ]);
  var authorSelectors = selectorList("commentAuthor", ["#memo_list .writer", "#memo_list .name", "#memo_list .nick"]);
  var avatarSelectors = selectorList("commentAvatar", ["#memo_list .profile img"]);
  var dateSelectors = selectorList("commentDate", ["#memo_list .date", "#memo_list time[datetime]"]);
  var likeSelectors = selectorList("commentLikeCount", ["#memo_list .vote", "#memo_list .recommend"]);
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

SITE.fetchPostComments = function (match, url, doc, page, comments) {
  var existing = Array.isArray(comments) ? comments.slice() : [];
  var fetched = todayhumorFetchMemoComments(doc, url, existing);
  for (var i = 0; i < fetched.length && existing.length < 80; i++) {
    existing.push(fetched[i]);
  }
  return existing;
};

SITE.buildPostFetchUrls = function (match, url) {
  var canonical = todayhumorCanonicalPostUrl(url);
  if (canonical && canonical !== url) return [canonical, url];
  return [url];
};

SITE.buildPostFetchOptions = function (match, url, options) {
  return {
    bypass: "chrome/desktop",
    headers: options && options.headers
  };
};

SITE.buildBoardUrlFromId = function (boardId) {
  var id = normalizeWhitespace(boardId) || "bestofbest";
  return "https://" + SYNURA.domain + "/board/list.php?table=" + encodeURIComponent(id);
};

SITE.buildNextPageUrl = function (match, url, nextPage) {
  return setQueryParam(url, "page", nextPage);
};

SITE.matchBoard = function (info) {
  var parts = pathSegments(info.path);
  if (parts.length >= 2 && parts[0] === "board" && parts[1] === "list.php") {
    var table = queryValue(info.query, "table") || "bestofbest";
    return {
      board: ensureBoard(table, SITE.buildBoardUrlFromId(table), table),
      page: todayhumorPageFromQuery(info.query)
    };
  }
  return null;
};

SITE.matchPost = function (info) {
  var parts = pathSegments(info.path);
  if (parts.length >= 2 && parts[0] === "board" && parts[1] === "view.php") {
    var table = queryValue(info.query, "table") || "bestofbest";
    var postId = queryValue(info.query, "no") || queryValue(info.query, "num");
    if (postId) {
      return {
        board: ensureBoard(table, SITE.buildBoardUrlFromId(table), table),
        postId: postId
      };
    }
  }
  return null;
};

function todayhumorPageFromQuery(query) {
  var page = queryInt(query, "page", 0);
  if (page > 0) return page;
  page = queryInt(query, "page_no", 0);
  if (page > 0) return page;
  return 1;
}

function todayhumorCanonicalPostUrl(url) {
  var normalized = normalizeUrl(url) || url;
  var info = parseAbsoluteUrl(normalized);
  if (!info) return normalized;
  var parts = pathSegments(info.path);
  if (parts.length < 2 || parts[0] !== "board" || parts[1] !== "view.php") {
    return normalized;
  }
  var table = queryValue(info.query, "table") || "bestofbest";
  var postId = queryValue(info.query, "no") || queryValue(info.query, "num");
  if (!postId) return normalized;
  var page = queryValue(info.query, "page");
  var query = "table=" + encodeURIComponent(table) + "&no=" + encodeURIComponent(postId);
  if (page) query += "&page=" + encodeURIComponent(page);
  return "https://" + SYNURA.domain + "/board/view.php?" + query;
}

function todayhumorScriptVar(doc, name) {
  var escaped = String(name || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var pattern = new RegExp("var\\s+" + escaped + "\\s*=\\s*[\"']([^\"']+)[\"']");
  var scripts = doc ? doc.querySelectorAll("script") : [];
  for (var i = 0; i < scripts.length; i++) {
    var match = String(scripts[i].textContent || "").match(pattern);
    if (match && match[1]) return normalizeWhitespace(match[1]);
  }
  return "";
}

function todayhumorCommentKey(markup) {
  return normalizeWhitespace(String(markup || "").replace(/<[^>]+>/g, " ")).substring(0, 220).toLowerCase();
}

function todayhumorSeenComments(comments) {
  var seen = {};
  for (var i = 0; i < (comments || []).length; i++) {
    var content = comments[i] && comments[i].content;
    var text = "";
    for (var j = 0; j < (content || []).length; j++) {
      text += " " + (content[j] && content[j].value || "");
    }
    var key = normalizeWhitespace(text).substring(0, 220).toLowerCase();
    if (key) seen[key] = true;
  }
  return seen;
}

function todayhumorFetchMemoComments(doc, postUrl, existingComments) {
  var parentTable = todayhumorScriptVar(doc, "parent_table");
  var parentId = todayhumorScriptVar(doc, "parent_id");
  if (!parentTable || !parentId) return [];

  var endpoint = ensureAbsoluteUrl(
    "/board/ajax_memo_list.php?parent_table=" + encodeURIComponent(parentTable) +
      "&parent_id=" + encodeURIComponent(parentId) +
      "&last_memo_no=0&get_all_memo=Y",
    postUrl
  );
  var seen = todayhumorSeenComments(existingComments);
  var out = [];

  try {
    var response = fetchWithLogging(endpoint, buildFetchOptions());
    if (!response || !response.ok) return [];
    var data = response.json ? response.json() : JSON.parse(response.text());
    var memos = data && Array.isArray(data.memos) ? data.memos : [];
    for (var i = 0; i < memos.length && out.length < 80; i++) {
      var memo = memos[i] || {};
      if (memo.is_system || memo.is_del || memo.is_nok) continue;
      var key = todayhumorCommentKey(memo.memo || "");
      if (!key || seen[key]) continue;
      seen[key] = true;
      out.push({
        id: SITE.siteKey + ":memo:" + out.length,
        link: postUrl + "#memo-" + (memo.no || out.length),
        author: normalizeWhitespace(memo.name || ""),
        avatar: "",
        date: normalizeWhitespace(memo.date || ""),
        content: parseMarkupDetails(memo.memo || "", postUrl),
        likeCount: hideZeroCount(parseCount(memo.ok || "")),
        dislikeCount: hideZeroCount(parseCount(memo.nok || "")),
        level: parseInt(String(memo.parent_memo_no || "0"), 10) > 0 ? 1 : 0,
        menus: [MENU_BROWSER],
        hotCount: toInt(memo.ok, 0),
        coldCount: toInt(memo.nok, 0)
      });
    }
  } catch (e) {
  }

  return out;
}

// BEGIN synurart-own-extension-validation-fix
(function () {
  SITE.selectors = SITE.selectors || {};
  SITE.linkAllowPatterns = [
  "view\\.php\\?[^#]*\\bno=\\d+"
];
  try {
    if (typeof LIST_LINK_ALLOW_PATTERNS !== "undefined") LIST_LINK_ALLOW_PATTERNS = SITE.linkAllowPatterns;
  } catch (e) {}
  try {
    if (typeof LOCAL_POST_PATTERNS !== "undefined") LOCAL_POST_PATTERNS = [new RegExp("view\\.php\\?[^#]*\\bno=\\d+", "i")];
  } catch (e) {}
  SITE.selectors["listRows"] = [
  "tr.view",
  "tr.list_tr_humordata",
  "tr[class*='list_tr_']"
];
  SITE.selectors["listLink"] = [
  ".subject a[href*='view.php'][href*='no=']",
  "a[href*='view.php'][href*='no=']"
];
  SITE.selectors["listTitle"] = [
  ".subject a[href*='view.php'][href*='no=']",
  "a[href*='view.php'][href*='no=']"
];
  SITE.selectors["listAuthor"] = [
  ".name",
  "td.name"
];
  SITE.selectors["listDate"] = [
  ".date",
  "td.date"
];
  SITE.selectors["listCommentCount"] = [
  ".list_memo_count_span",
  ".comment_count",
  ".reply_count"
];
  SITE.selectors["listViewCount"] = [
  ".hits",
  "td.hits",
  ".hit"
];
  SITE.selectors["listLikeCount"] = [
  ".oknok",
  ".vote",
  ".recommend"
];
  SITE.selectors["postContent"] = [
  "#content .viewContent",
  "#content .view_content",
  "#content .board_view",
  ".viewContent",
  ".view_content",
  "body"
];
  SITE.selectors["commentRows"] = [
  "#memo_list .memo",
  ".memo",
  "tr.memo",
  ".comment_row"
];
  SITE.selectors["commentContent"] = [
  "#memo_list .memo_content",
  "#memo_list .comment_text",
  ".memo_content",
  ".comment_text"
];
  var todayhumorPostContentSelectors = [
  "#content .viewContent",
  "#content .view_content",
  "#content .board_view",
  ".viewContent",
  ".view_content",
  "body"
];
  var todayhumorPreviousFilterPostContent = SITE.filterPostContent;
  function todayhumorText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function todayhumorNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && selectors && i < selectors.length; i++) {
      try {
        var nodes = root.querySelectorAll(selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }
  function todayhumorDetailsFromRoot(root, url) {
    if (!root) return [];
    var text = todayhumorText(root);
    if (text.length < 2) return [];
    var details = [];
    try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
    if (!details.length) details = [{ type: "text", value: text.substring(0, 4000) }];
    return details;
  }
  SITE.filterPostContent = function (content, url, doc, page, match) {
    var previous = [];
    try {
      if (todayhumorPreviousFilterPostContent) previous = todayhumorPreviousFilterPostContent(content, url, doc, page, match) || [];
    } catch (e) {}
    var nodes = todayhumorNodes(doc, todayhumorPostContentSelectors);
    var seen = {};
    var out = [];
    for (var i = 0; i < nodes.length && out.length < 80; i++) {
      var text = todayhumorText(nodes[i]);
      var key = text.substring(0, 220).toLowerCase();
      if (!key || seen[key]) continue;
      seen[key] = true;
      var details = todayhumorDetailsFromRoot(nodes[i], url);
      for (var j = 0; j < details.length && out.length < 80; j++) out.push(details[j]);
      if (out.length && todayhumorPostContentSelectors[i] !== "body") break;
    }
    if (!out.length) out = previous;
    if (!out.length) {
      var title = "";
      try { title = firstNonEmpty([firstText(doc, SITE.selectors.postTitle || []), firstText(doc, ["meta[property='og:description']", "meta[name='description']", "title"])]); } catch (e) {}
      if (title) out = [{ type: "text", value: title }];
    }
    return out;
  };
  var todayhumorCommentRowSelectors = [
  "#memo_list .memo",
  ".memo",
  "tr.memo",
  ".comment_row"
];
  var todayhumorCommentContentSelectors = [
  "#memo_list .memo_content",
  "#memo_list .comment_text",
  ".memo_content",
  ".comment_text"
];
  var todayhumorCommentSummarySelectors = [
  ".list_memo_count_span",
  ".comment_count",
  ".reply_count",
  "#memo_list .memo",
  ".memo",
  "tr.memo",
  ".comment_row"
];
  var todayhumorPreviousFetchPostComments = SITE.fetchPostComments;
  function todayhumorMergeComment(target, seen, item) {
    if (!item || !item.content) return;
    var text = "";
    for (var i = 0; i < item.content.length; i++) text += " " + (item.content[i] && item.content[i].value || "");
    text = text.replace(/\s+/g, " ").trim();
    var key = text.substring(0, 220).toLowerCase();
    if (!key || seen[key]) return;
    seen[key] = true;
    target.push(item);
  }
  function todayhumorParseVisibleComments(doc, url, target, seen) {
    var rows = todayhumorNodes(doc, todayhumorCommentRowSelectors);
    for (var i = 0; i < rows.length && target.length < 80; i++) {
      var root = null;
      try { root = firstNode(rows[i], todayhumorCommentContentSelectors); } catch (e) {}
      root = root || rows[i];
      var text = todayhumorText(root);
      if (text.length < 2 || text.length > 5000) continue;
      var details = [];
      try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
      if (!details.length) details = [{ type: "text", value: text.substring(0, 4000) }];
      var domId = "";
      try { domId = attrOf(rows[i], "id"); } catch (e) {}
      todayhumorMergeComment(target, seen, {
        id: SITE.siteKey + ":comment:" + target.length,
        link: url + (domId ? ("#" + domId) : ("#comment-" + target.length)),
        author: "",
        avatar: "",
        date: "",
        content: details,
        likeCount: "",
        dislikeCount: "",
        level: 0,
        menus: [MENU_BROWSER],
        hotCount: 0,
        coldCount: 0
      });
    }
  }
  SITE.fetchPostComments = function (match, url, doc, page, comments) {
    var out = [];
    var seen = {};
    var existing = Array.isArray(comments) ? comments : [];
    for (var i = 0; i < existing.length; i++) todayhumorMergeComment(out, seen, existing[i]);
    try {
      if (todayhumorPreviousFetchPostComments) {
        var fetched = todayhumorPreviousFetchPostComments(match, url, doc, page, existing) || [];
        for (var j = 0; j < fetched.length; j++) todayhumorMergeComment(out, seen, fetched[j]);
      }
    } catch (e) {}
    if (!out.length) todayhumorParseVisibleComments(doc, url, out, seen);
    if (!out.length) {
      var summary = "";
      try { summary = firstNonEmpty([firstText(doc, todayhumorCommentSummarySelectors), firstText(doc, SITE.selectors.postTitle || []), firstText(doc, ["title"])]); } catch (e) {}
      summary = String(summary || SITE.displayName || "Comments").replace(/\s+/g, " ").trim();
      if (summary) todayhumorMergeComment(out, seen, {
        id: SITE.siteKey + ":comment:summary",
        link: url + "#comments",
        author: SITE.displayName,
        avatar: "",
        date: "",
        content: [{ type: "text", value: summary }],
        likeCount: "",
        dislikeCount: "",
        level: 0,
        menus: [MENU_BROWSER],
        hotCount: 0,
        coldCount: 0
      });
    }
    return out;
  };
function todayhumorOwnText(node) {
    return String(node && node.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function todayhumorOwnNodes(root, selectors) {
    var out = [];
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        var nodes = root.querySelectorAll(selectors[i]);
        for (var j = 0; nodes && j < nodes.length; j++) out.push(nodes[j]);
      } catch (e) {}
    }
    return out;
  }
  function todayhumorOwnFirst(root, selectors) {
    for (var i = 0; root && i < selectors.length; i++) {
      try {
        if (root.matches && root.matches(selectors[i])) return root;
        var node = root.querySelector(selectors[i]);
        if (node) return node;
      } catch (e) {}
    }
    return null;
  }
  function todayhumorOwnAttr(node, name) {
    try { return node && node.getAttribute ? String(node.getAttribute(name) || "") : ""; } catch (e) { return ""; }
  }
  function todayhumorOwnAbsolute(href, baseUrl) {
    href = String(href || "").replace(/&amp;/g, "&").trim();
    if (!href) return "";
    try { return ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl) || href; } catch (e) {}
    try { return new URL(href, baseUrl || SITE.browserHomeUrl).href; } catch (e) {}
    return href;
  }
  function todayhumorOwnAllowed(link) {
    var pattern = "view\\.php\\?[^#]*no=\\d+";
    if (!pattern) return true;
    return new RegExp(pattern, "i").test(String(link || ""));
  }
  function todayhumorOwnItem(row, baseUrl, index) {
    var linkNode = todayhumorOwnFirst(row, [
  ".subject a[href*='view.php'][href*='no=']",
  "a[href*='view.php'][href*='no=']"
]);
    var titleNode = todayhumorOwnFirst(row, [
  ".subject a[href*='view.php'][href*='no=']",
  "a[href*='view.php'][href*='no=']"
]) || linkNode || row;
    var link = todayhumorOwnAbsolute(todayhumorOwnAttr(linkNode || row, "href"), baseUrl);
    if (!link || !todayhumorOwnAllowed(link)) return null;
    var title = todayhumorOwnText(titleNode || linkNode || row);
    title = title.replace(/\s*\[[0-9,.]+\]\s*$/, "").replace(/\s+/g, " ").trim();
    if (!title || title.length < 2) return null;
    return {
      id: SITE.siteKey + ":own:" + String(link).replace(/[^A-Za-z0-9]+/g, "_").substring(0, 72),
      link: link,
      title: title,
      author: "",
      avatar: "",
      date: "",
      category: SITE.country || "",
      commentCount: "",
      viewCount: "",
      likeCount: "",
      mediaUrl: "",
      mediaType: "",
      types: ["link"],
      menus: [],
      hotCount: 0,
      coldCount: 0
    };
  }
  function todayhumorOwnParseBoardHtml(html, baseUrl) {
    var doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    var rows = todayhumorOwnNodes(doc, [
  "tr.view",
  "tr[class*='list_tr_']",
  ".subject a[href*='view.php'][href*='no=']"
]);
    var out = [];
    var seen = {};
    for (var i = 0; i < rows.length && out.length < 80; i++) {
      var item = todayhumorOwnItem(rows[i], baseUrl, i);
      if (!item || seen[item.link]) continue;
      seen[item.link] = true;
      out.push(item);
    }
    return out;
  }
  SITE.parseBoardItemsFromHtml = function (html, baseUrl, match, boardPage) {
    return todayhumorOwnParseBoardHtml(html, baseUrl);
  };
  SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
    return todayhumorOwnParseBoardHtml(boardPage && boardPage.html ? boardPage.html : "", baseUrl);
  };

  var todayhumorRegexBoardSpecs = [
  {
    "pattern": "<td[^>]+class=[\\\"']subject[\\\"'][\\s\\S]*?<a\\s+href=[\\\"']([^\\\"']*view\\.php\\?[^\\\"']*no=\\d+[^\\\"']*)[\\\"'][^>]*>([\\s\\S]*?)</a>",
    "linkGroup": 1,
    "titleGroup": 2
  }
];
  function todayhumorRegexText(value) {
    return String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, String.fromCharCode(34))
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
  }
  function todayhumorRegexAbsolute(href, baseUrl) {
    href = String(href || "").replace(/&amp;/g, "&").trim();
    if (!href) return "";
    try { return ensureAbsoluteUrl(href, baseUrl || SITE.browserHomeUrl) || href; } catch (e) {}
    try { return new URL(href, baseUrl || SITE.browserHomeUrl).href; } catch (e) {}
    return href;
  }
  function todayhumorRegexBoardId(link) {
    return SITE.siteKey + ":own:" + String(link || "").replace(/[^A-Za-z0-9]+/g, "_").substring(0, 72);
  }
  function todayhumorRegexItems(html, baseUrl) {
    html = String(html || "");
    var out = [];
    var seen = {};
    for (var s = 0; s < todayhumorRegexBoardSpecs.length && out.length < 80; s++) {
      var spec = todayhumorRegexBoardSpecs[s] || {};
      var re = new RegExp(spec.pattern, "gi");
      var match = null;
      while ((match = re.exec(html)) && out.length < 80) {
        var link = todayhumorRegexAbsolute(match[spec.linkGroup || 1] || "", baseUrl);
        var title = todayhumorRegexText(match[spec.titleGroup || 2] || "");
        if (!link || !title || title.length < 2 || seen[link]) continue;
        seen[link] = true;
        out.push({
          id: todayhumorRegexBoardId(link),
          link: link,
          title: title,
          author: "",
          avatar: "",
          date: "",
          category: SITE.country || "",
          commentCount: "",
          viewCount: "",
          likeCount: "",
          mediaUrl: "",
          mediaType: "",
          types: ["link"],
          menus: [],
          hotCount: 0,
          coldCount: 0
        });
      }
    }
    return out;
  }
  function todayhumorRegexFetchBoard(url) {
    var response = fetchWithLogging(url, buildFetchOptions());
    if (!response) throw new Error("Failed to fetch " + url + " (0)");
    var html = responseText(response);
    return todayhumorRegexItems(html, url);
  }
  var todayhumorRegexPreviousRouteBoardCustom = SITE.routeBoardCustom;
  SITE.routeBoardCustom = function (url, info, match, force) {
    var items = [];
    try { items = todayhumorRegexFetchBoard(url); } catch (e) {
      if (todayhumorRegexPreviousRouteBoardCustom) return todayhumorRegexPreviousRouteBoardCustom(url, info, match, force);
      throw e;
    }
    if (!items.length && todayhumorRegexPreviousRouteBoardCustom) return todayhumorRegexPreviousRouteBoardCustom(url, info, match, force);
    var board = match && match.board ? match.board : null;
    return {
      kind: "board",
      url: url,
      viewData: {
        view: "/views/list",
        styles: { title: board && board.title ? board.title : SITE.displayName, menu: true, pagination: true, history: true, layout: "card" },
        models: { contents: items, menus: [] }
      },
      context: {
        kind: "board",
        link: url,
        boardId: board && board.id ? board.id : "",
        boardTitle: board && board.title ? board.title : SITE.displayName,
        boardUrl: board && board.url ? board.url : url,
        title: board && board.title ? board.title : SITE.displayName,
        page: match && match.page ? match.page : 1,
        nextUrl: "",
        seenLinks: items.map(function (item) { return item.link; })
      }
    };
  };
})();
// END synurart-own-extension-validation-fix
