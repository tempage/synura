// @ts-nocheck

var SITE = {
  siteKey: "todayhumor",
  cp: "list-metadata-v1",
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
    postTitle: [".viewSubjectDiv", ".viewSubject", ".board_view .subject"],
    postAuthor: ["#viewPageWriterNameSpan a", "#viewPageWriterNameSpan"],
    postAvatar: [".writerInfoContents .profile img"],
    postDate: [".writerInfoContents .view_date", ".writerInfoContents .regdate"],
    postViewCount: [".writerInfoContents .view_hit"],
    postLikeCount: [".writerInfoContents .view_ok_nok"],
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
  host_permissions: [
    "https://www.todayhumor.co.kr/*",
    "https://m.todayhumor.co.kr/*"
  ],
  name: "todayhumor",
  author: "Synura Team",
  description: "www.todayhumor.co.kr",
  version: 0.1, // Intentionally pinned at 0.1.
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

function todayhumorPostMetadata(doc) {
  var root = firstNode(doc, [".writerInfoContents"]);
  if (!root) return null;
  var writer = firstNode(root, ["#viewPageWriterNameSpan"]);
  var author = writer ? normalizeWhitespace(attrOf(writer, "name")) : "";
  if (!author) author = firstAuthorText(root, ["#viewPageWriterNameSpan a", "#viewPageWriterNameSpan"]);
  var originalDate = "";
  var registeredDate = "";
  var viewCount = "";
  var rows = root.querySelectorAll("div");
  for (var i = 0; i < rows.length; i++) {
    var text = normalizeWhitespace(textOf(rows[i]));
    var date = text.match(/^(원글작성시간|원본글 작성시간|(?:베오베\s*|베스트\s*)?등록시간)\s*:\s*(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}(?::\d{2})?)/);
    if (date) {
      if (/^원/.test(date[1])) originalDate = date[2];
      else registeredDate = date[2];
    }
    var views = text.match(/^조회수\s*:\s*([\d,]+)/);
    if (views) viewCount = parseCount(views[1]);
  }
  return { author: author, date: originalDate || registeredDate, viewCount: viewCount };
}

SITE.preparePostContext = function (context, match, url, doc) {
  context.todayhumorMetadata = todayhumorPostMetadata(doc);
  return context;
};

// The date and view count are label-only rows, with no selectable value element.
var todayhumorOriginalPostRoute = routePostWithMatch;
routePostWithMatch = function (url, urlInfo, match, force) {
  var route = todayhumorOriginalPostRoute(url, urlInfo, match, force);
  var metadata = route && route.context && route.context.todayhumorMetadata;
  if (metadata && route.viewData && route.viewData.models) {
    var fields = ["author", "date", "viewCount"];
    for (var i = 0; i < fields.length; i++) {
      if (metadata[fields[i]]) route.viewData.models[fields[i]] = metadata[fields[i]];
    }
  }
  return route;
};

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
  var likeCount = hideZeroCount(parseCount(firstText(row, likeCountSelectors).split("/")[0]));
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
  SITE.selectors["listLink"] = [".subject a", "a"];
  SITE.selectors["listTitle"] = [".subject a"];
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
  ".viewContent",
  ".view_content"
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
  var todayhumorPostContentSelectors = SITE.selectors["postContent"];
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
    var details = [];
    try { details = parseDetails(root, url) || []; } catch (e) { details = []; }
    for (var i = 0; i < details.length; i++) {
      // A post can consist entirely of images or a single character.
      if (String(details[i] && (details[i].value || details[i].link) || "").trim()) {
        return absolutizeDetails(details, url);
      }
    }
    return [];
  }
  SITE.filterPostContent = function (content, url, doc, page, match) {
    for (var i = 0; doc && i < todayhumorPostContentSelectors.length; i++) {
      var selector = todayhumorPostContentSelectors[i];
      var nodes = [];
      try { nodes = doc.querySelectorAll(selector); } catch (e) {}
      var covered = [];
      var out = [];
      for (var j = 0; j < nodes.length; j++) {
        if (covered.indexOf(nodes[j]) !== -1) continue;
        var details = todayhumorDetailsFromRoot(nodes[j], url);
        if (!details.length) continue;
        out = out.concat(details);
        // Overlapping content containers must not duplicate nested text/media.
        covered.push(nodes[j]);
        try {
          var descendants = nodes[j].querySelectorAll(selector);
          for (var k = 0; k < descendants.length; k++) covered.push(descendants[k]);
        } catch (e) {}
      }
      if (out.length) return out;
    }
    // Missing content is an extraction failure, not the title or the whole page.
    return [];
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
    return out;
  };
  // Parse each complete row so the title and its metadata stay together.
  // The former title-only regex discarded author/date/count cells.
  function todayhumorParseBoardDocument(doc, baseUrl) {
    var rows = allNodes(doc, selectorList("listRows", ["tr.view", "tr[class*='list_tr_']"]));
    var out = [];
    var seen = {};
    for (var i = 0; i < rows.length && out.length < 80; i++) {
      var item = extractListItem(rows[i], baseUrl);
      if (!item || !item.link || seen[item.link]) continue;
      seen[item.link] = true;
      item.id = SITE.siteKey + ":own:" + String(item.link).replace(/[^A-Za-z0-9]+/g, "_").substring(0, 72);
      out.push(item);
    }
    return out;
  }
  SITE.parseBoardItemsFromHtml = function (html, baseUrl, match, boardPage) {
    var doc = boardPage && boardPage.doc;
    if (!doc) doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    return todayhumorParseBoardDocument(doc, baseUrl);
  };
  SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
    return todayhumorParseBoardDocument(doc, baseUrl);
  };

  function todayhumorFetchBoardItems(url) {
    var response = fetchWithLogging(url, buildFetchOptions());
    if (!response) throw new Error("Failed to fetch " + url + " (0)");
    var doc = new DOMParser().parseFromString(responseText(response), "text/html");
    return todayhumorParseBoardDocument(doc, url);
  }
  var todayhumorPreviousRouteBoardCustom = SITE.routeBoardCustom;
  SITE.routeBoardCustom = function (url, info, match, force) {
    var items = [];
    try { items = todayhumorFetchBoardItems(url); } catch (e) {
      if (todayhumorPreviousRouteBoardCustom) return todayhumorPreviousRouteBoardCustom(url, info, match, force);
      throw e;
    }
    if (!items.length && todayhumorPreviousRouteBoardCustom) return todayhumorPreviousRouteBoardCustom(url, info, match, force);
    var board = match && match.board ? match.board : null;
    var page = match && match.page ? match.page : 1;
    var nextUrl = items.length ? SITE.buildNextPageUrl(match, url, page + 1) : "";
    return {
      kind: "board",
      url: url,
      viewData: {
        view: "/views/list",
        styles: { title: board && board.title ? board.title : SITE.displayName, menu: true, pagination: !!nextUrl, history: true, layout: "card" },
        models: { contents: items, menus: [] }
      },
      context: {
        kind: "board",
        link: url,
        boardId: board && board.id ? board.id : "",
        boardTitle: board && board.title ? board.title : SITE.displayName,
        boardUrl: board && board.url ? board.url : url,
        title: board && board.title ? board.title : SITE.displayName,
        page: page,
        nextUrl: nextUrl,
        seenLinks: items.map(function (item) { return item.link; })
      }
    };
  };
})();
// END synurart-own-extension-validation-fix
