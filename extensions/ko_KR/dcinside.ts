// @ts-nocheck

var DC_HOST = "m.dcinside.com";
var DC_BASE_URL = "https://" + DC_HOST;
var DC_BOARD_BASE_URL = DC_BASE_URL + "/board/";
var DC_MINI_BASE_URL = DC_BASE_URL + "/mini/";
var DC_PERSON_BASE_URL = DC_BASE_URL + "/person/";

var DC_DEFAULT_BOARD_DESCRIPTION = "홈 기본 갤러리";

function dcBoardEntry(slug, title, group, description) {
  return {
    id: "board:" + slug,
    title: title,
    url: DC_BOARD_BASE_URL + slug,
    description: description || DC_DEFAULT_BOARD_DESCRIPTION,
    group: group
  };
}

var DC_DEFAULT_VISIBLE_BOARD_IDS = [
  "board:dcbest",
  "board:hiphop_new1",
  "board:comic_new6",
  "board:m_entertainer_new1",
  "board:hanwhaeagles_new",
  "board:projectnike",
  "board:drama_new3",
  "board:samsunglions_new",
  "board:giants_new3",
  "board:loan_new1",
  "board:iamsolo",
  "board:maplestory_new",
  "board:baseball_new13",
  "board:idolmaster_new1",
  "board:w_entertainer",
  "board:baseball_ab2",
  "board:lgtwins_new",
  "board:fantasy_new2",
  "board:leagueoflegends6",
  "board:wkbl",
  "board:cs_new1"
];

var DC_SYSTEM_BOARDS = [
  dcBoardEntry("dcbest", "실시간 베스트", "인기", "실시간 베스트"),
  dcBoardEntry("hiphop_new1", "힙합", "음악"),
  dcBoardEntry("comic_new6", "만화", "만화"),
  dcBoardEntry("m_entertainer_new1", "남자 연예인", "연예"),
  dcBoardEntry("hanwhaeagles_new", "한화 이글스", "스포츠"),
  dcBoardEntry("projectnike", "승리의 여신 니케", "게임"),
  dcBoardEntry("drama_new3", "기타 국내 드라마", "드라마"),
  dcBoardEntry("samsunglions_new", "삼성 라이온즈", "스포츠"),
  dcBoardEntry("giants_new3", "롯데 자이언츠", "스포츠"),
  dcBoardEntry("loan_new1", "대출", "재테크"),
  dcBoardEntry("iamsolo", "나는 솔로", "방송"),
  dcBoardEntry("maplestory_new", "메이플스토리", "게임"),
  dcBoardEntry("baseball_new13", "국내야구", "스포츠"),
  dcBoardEntry("idolmaster_new1", "아이돌마스터", "게임"),
  dcBoardEntry("w_entertainer", "여자 연예인", "연예"),
  dcBoardEntry("baseball_ab2", "해외야구", "스포츠"),
  dcBoardEntry("lgtwins_new", "LG 트윈스", "스포츠"),
  dcBoardEntry("fantasy_new2", "판타지", "문학"),
  dcBoardEntry("leagueoflegends6", "리그 오브 레전드", "게임"),
  dcBoardEntry("wkbl", "여자농구", "스포츠"),
  dcBoardEntry("cs_new1", "편의점", "생활")
];

var DC_HOST_PATTERN = DC_HOST.replace(/\./g, "\\.");

var SITE = {
  siteKey: "dcinside",
  cp:"2:",
  displayName: "디시인사이드",
  "browserHomeUrl": DC_BOARD_BASE_URL + "dcbest",
  "browserCookieAuth": false,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": false,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": false,
  "boardSettingsMenuLabel": "갤러리 설정",
  "boardSettingsTitle": "갤러리 설정",
  "boardSettingsLargeThreshold": 1,
  "boardSettingsPageSize": 120,
  "boardAddMode": "url_title",
  "hasFullBoardCatalog": false,
  "supportsBoardCatalogSync": true,
  "defaultVisibleBoardIds": DC_DEFAULT_VISIBLE_BOARD_IDS,
  "hostAliases": [
    "gall.dcinside.com",
    "dcinside.com",
    "www.dcinside.com"
  ],
  "titleSuffixes": [
    " - 디시인사이드",
    " : 디시인사이드",
    " - 실시간 베스트 갤러리",
    " 갤러리 - 커뮤니티 포털 디시인사이드",
    " 미니 갤러리 - 커뮤니티 포털 디시인사이드",
    " 인물 갤러리 - 커뮤니티 포털 디시인사이드"
  ],
  "linkAllowPatterns": [
    "^https://" + DC_HOST_PATTERN + "/board/[^/]+/\\d+(?:\\?.*)?$",
    "^https://" + DC_HOST_PATTERN + "/mini/[^/]+/\\d+(?:\\?.*)?$",
    "^https://" + DC_HOST_PATTERN + "/person/[^/]+/\\d+(?:\\?.*)?$",
    "^https://" + DC_HOST_PATTERN + "/board/view(?:/)?\\?.*\\bid=[^&]+.*\\bno=\\d+",
    "^https://" + DC_HOST_PATTERN + "/mini/board/view(?:/)?\\?.*\\bid=[^&]+.*\\bno=\\d+",
    "^https://" + DC_HOST_PATTERN + "/person/board/view(?:/)?\\?.*\\bid=[^&]+.*\\bno=\\d+"
  ],
  "listBoardQueryParam": "",
  "boards": DC_SYSTEM_BOARDS,
  "selectors": {
    "boardTitle": [
      ".gall-tit"
    ],
    "listRows": [
      ".gall-detail-lst > li"
    ],
    "listLink": [
      "a.lt"
    ],
    "listTitle": [
      ".subjectin"
    ],
    "listAuthor": [],
    "listAvatar": [],
    "listDate": [],
    "listCommentCount": [
      "a.rt .ct"
    ],
    "listViewCount": [],
    "listLikeCount": [],
    "listCategory": [],
    "listImage": [
      ".thum-img img"
    ],
    "postTitle": [
      ".gallview-tit-box .tit"
    ],
    "postAuthor": [
      ".gallview-tit-box .ginfo2 li:first-child"
    ],
    "postAvatar": [],
    "postDate": [
      ".gallview-tit-box .ginfo2 li:nth-child(2)"
    ],
    "postViewCount": [
      ".gall-thum-btm .ginfo2 li:first-child"
    ],
    "postLikeCount": [
      ".gall-thum-btm .ginfo2 li:nth-child(2)"
    ],
    "postCategory": [],
    "postContent": [
      ".thum-txtin"
    ],
    "commentRows": [
      ".all-comment-lst li"
    ],
    "commentAuthor": [
      ".nick"
    ],
    "commentAvatar": [],
    "commentContent": [
      ".txt"
    ],
    "commentDate": [
      ".date"
    ],
    "commentLikeCount": [],
    "commentLevel": []
  },
  "commentLevelAttrs": []
};

var SYNURA = {
  domain: DC_HOST,
  name: "dcinside",
  description: "Unofficial dcinside extension",
  version: 0.1,
  api: 0,
  license: "Apache-2.0",
  bypass: "chrome/android",
  locale: "ko_KR",
  deeplink: true,
  icon: "https://nstatic.dcinside.com/dc/m/img/dcinside_icon.png",
  main: null
};

var DC_DISCOVERED_BOARDS_KEY = "dcinside_discovered_boards";
var DC_DISCOVERED_BOARDS_META_KEY = "dcinside_discovered_boards_meta";
var DC_CATEGORY_ROOTS_KEY = "dcinside_category_roots_v1";
var DC_DISCOVERED_BOARDS_MAX_AGE = 86400000;
var DC_CATEGORY_BROWSER_PAGE_SIZE = 200;
var DC_CATEGORY_HOME_URL = DC_BASE_URL + "/galltotal";
var dcCategoryRootCache = null;
var dcCategoryBoardCache = {};
var DC_CATEGORY_SCOPE_SELECTORS = [".left_content", ".cate-box", ".cate_wrap", ".gall-total-lst", ".gall-total"];
var DC_CATEGORY_FALLBACK_SCOPE_SELECTORS = [".content_box", ".content", ".cont", "main", "#container"];
var DC_CATEGORY_ROOT_SPECS = [
  { key: "category", title: "갤러리", url: DC_BASE_URL + "/category" },
  { key: "mcategory", title: "마이너갤", url: DC_BASE_URL + "/mcategory" },
  { key: "micategory", title: "미니갤", url: DC_BASE_URL + "/micategory" },
  { key: "prcategory", title: "인물갤", url: DC_BASE_URL + "/prcategory" }
];
var DC_LINK_SELECTOR = "a[href]";

function dcQuerySelectorGroup(root, selectors) {
  if (!root || !root.querySelectorAll || !selectors) return [];
  if (!Array.isArray(selectors)) selectors = [selectors];
  var out = [];
  for (var i = 0; i < selectors.length; i++) {
    var selector = String(selectors[i] || "").replace(/^\s+|\s+$/g, "");
    if (!selector) continue;
    var matches = root.querySelectorAll(selector);
    if (!matches || matches.length === 0) continue;
    for (var j = 0; j < matches.length; j++) {
      if (out.indexOf(matches[j]) < 0) out.push(matches[j]);
    }
  }
  return out;
}

function dcCollectScopedAnchors(doc, linkSelector) {
  if (!doc || !doc.querySelectorAll || !linkSelector) return [];
  var groups = [DC_CATEGORY_SCOPE_SELECTORS, DC_CATEGORY_FALLBACK_SCOPE_SELECTORS];
  for (var g = 0; g < groups.length; g++) {
    var scopes = dcQuerySelectorGroup(doc, groups[g]);
    for (var i = 0; i < scopes.length; i++) {
      var anchors = dcQuerySelectorGroup(scopes[i], linkSelector);
      if (anchors && anchors.length > 0) return anchors;
    }
  }
  return dcQuerySelectorGroup(doc, linkSelector);
}

function dcNormalizeBoardKind(kind) {
  return kind === "mini" || kind === "person" ? kind : "board";
}

function dcMakeBoardKey(kind, slug) {
  return dcNormalizeBoardKind(kind) + ":" + normalizeWhitespace(slug);
}

function dcSplitBoardKey(id) {
  var text = normalizeWhitespace(id);
  var index = text.indexOf(":");
  if (index < 0) {
    return {
      kind: "board",
      slug: text
    };
  }
  return {
    kind: dcNormalizeBoardKind(text.substring(0, index)),
    slug: normalizeWhitespace(text.substring(index + 1))
  };
}

function dcBoardKindLabel(kind) {
  var normalized = dcNormalizeBoardKind(kind);
  if (normalized === "mini") return "미니 갤러리";
  if (normalized === "person") return "인물 갤러리";
  return "갤러리";
}

function dcBuildBoardListUrl(kind, slug) {
  var normalizedKind = dcNormalizeBoardKind(kind);
  var normalizedSlug = encodeURIComponent(normalizeWhitespace(slug));
  if (!normalizedSlug) return "";
  if (normalizedKind === "mini") return DC_MINI_BASE_URL + normalizedSlug;
  if (normalizedKind === "person") return DC_PERSON_BASE_URL + normalizedSlug;
  return DC_BOARD_BASE_URL + normalizedSlug;
}

function dcBuildBoardPageUrl(kind, slug, page) {
  var listUrl = dcBuildBoardListUrl(kind, slug);
  return page > 1 ? setPageParam(listUrl, "page", page) : listUrl;
}

function dcAttachImageHeaders(details, refererUrl) {
  var referer=normalizeUrl(refererUrl)||normalizeUrl(SITE.browserHomeUrl)||"";
  if(!referer||!details||!details.length)return details||[];
  for(var i=0;i<details.length;i++){
    var item = details[i];
    var value = normalizeUrl(item && item.value) || normalizeUrl(item && item.link) || "";
    var info = parseAbsoluteUrl(value);
    var host = info && info.host ? String(info.host).toLowerCase() : "";
    if(!item||item.type!=="image"||!host||!/(^|\.)(dcinside\.co\.kr|dcinside\.com)$/.test(host)) continue;
    var headers = item.headers || {};
    if(!headers.Referer&&!headers.referer) headers.Referer = referer;
    item.headers = headers;
  }

  return details;
}

function dcAttachCommentImageHeaders(comments, refererUrl) {
  var out = comments || [];
  for (var i = 0; i < out.length; i++) {
    var comment = out[i];
    if (!comment || !Array.isArray(comment.content)) continue;
    comment.content = dcAttachImageHeaders(comment.content, refererUrl);
  }
  return out;
}

function dcListField(row, index, selectors) {
  var mobileValue = firstText(row, [".ginfo li:nth-child(" + String(index) + ")"]);
  if (mobileValue) return mobileValue;
  return firstText(row, selectors || []);
}

function dcMobileListAuthor(row, authorSelectors) {
  return normalizeWhitespace(dcListField(row, 1, authorSelectors || []));
}

function extractListItem(row, baseUrl) {
  var selectors = SITE.selectors || {};
  var linkSelectors = selectors.listLink || [];
  var titleSelectors = selectors.listTitle || [];
  var commentCountSelectors = selectors.listCommentCount || [];
  var authorSelectors = selectors.listAuthor || [];
  var imageSelectors = selectors.listImage || [];
  var avatarSelectors = selectors.listAvatar || authorSelectors;

  var linkNode = firstNode(row, linkSelectors);
  var titleNode = firstNode(row, titleSelectors);
  var link = extractListLink(row, baseUrl, linkSelectors, SITE.linkAllowPatterns || []);
  if (!link) return null;

  var title = firstNonEmpty([
    textOfNodeWithoutSelectors(titleNode, commentCountSelectors),
    textOf(linkNode),
    textOf(row)
  ]);
  title = normalizeWhitespace(String(title || "")
    .replace(/\s*\[\d+\]\s*$/, "")
    .replace(/\s*\(\d+\)\s*$/, ""));
  if (!title) return null;

  var commentCount = hideZeroCount(parseCount(firstText(row, commentCountSelectors)));
  var viewCount = parseCount(dcListField(row, 3, selectors.listViewCount || []));
  var likeCount = hideZeroCount(parseCount(dcListField(row, 4, selectors.listLikeCount || [])));
  var mediaUrl = imageUrlFromNode(firstNode(row, imageSelectors), baseUrl);
  var types = [];
  if (mediaUrl) types.push("image");

  return {
    link: normalizeUrl(link) || link,
    title: title,
    author: dcMobileListAuthor(row, authorSelectors),
    avatar: imageUrlFromNode(firstNode(row, avatarSelectors), baseUrl),
    date: normalizeWhitespace(dcListField(row, 2, selectors.listDate || [])),
    category: firstText(row, selectors.listCategory || []),
    commentCount: commentCount,
    viewCount: viewCount,
    likeCount: likeCount,
    mediaUrl: mediaUrl,
    mediaType: mediaUrl ? "image" : "",
    types: types,
    menus: [],
    hotCount: toInt(likeCount || viewCount || commentCount, 0),
    coldCount: toInt(viewCount || likeCount || commentCount, 0)
  };
}

function dcKnownBoardById(boardId) {
  var normalizedId = normalizeWhitespace(boardId);
  if (!normalizedId) return null;
  var known = boardById(normalizedId);
  if (known) return known;
  var boards = getAllBoards();
  for (var i = 0; i < boards.length; i++) {
    if (boards[i].id === normalizedId) return boards[i];
  }
  return null;
}

function dcCreateBoard(kind, slug, fallbackTitle, description, group, known, skipLookup) {
  var normalizedKind = dcNormalizeBoardKind(kind);
  var normalizedSlug = normalizeWhitespace(slug);
  if (!normalizedSlug) return null;
  var id = dcMakeBoardKey(normalizedKind, normalizedSlug);
  var board = known || (!skipLookup ? dcKnownBoardById(id) : null);
  return {
    id: id,
    kind: normalizedKind,
    slug: normalizedSlug,
    title: normalizeWhitespace(fallbackTitle || (board ? board.title : "") || normalizedSlug),
    url: normalizeUrl(dcBuildBoardListUrl(normalizedKind, normalizedSlug)) || dcBuildBoardListUrl(normalizedKind, normalizedSlug),
    description: normalizeWhitespace(description || (board ? board.description : "") || dcBoardKindLabel(normalizedKind)),
    group: normalizeWhitespace(group || (board ? board.group : "")),
    showMedia: !!(board && board.showMedia),
    custom: !!(board && board.custom),
    dynamic: !!(board && board.dynamic)
  };
}

function dcBoardFromUrl(rawUrl, fallbackTitle, description, group, knownBoards) {
  var normalized = normalizeUrl(rawUrl);
  if (!normalized) return null;
  var info = parseAbsoluteUrl(normalized);
  if (!info || !isKnownHost(info.host)) return null;

  var kind = "board";
  var slug = "";
  var parts = pathSegments(info.path);
  if (info.path === "/board/lists" || info.path === "/board/lists/") {
    slug = normalizeWhitespace(queryValue(info.query, "id"));
  } else if (info.path === "/mini/board/lists" || info.path === "/mini/board/lists/") {
    kind = "mini";
    slug = normalizeWhitespace(queryValue(info.query, "id"));
  } else if (info.path === "/person/board/lists" || info.path === "/person/board/lists/") {
    kind = "person";
    slug = normalizeWhitespace(queryValue(info.query, "id"));
  } else if (parts.length === 2 && parts[0] === "board" && parts[1] !== "view" && parts[1] !== "lists") {
    slug = normalizeWhitespace(parts[1]);
  } else if (parts.length === 2 && parts[0] === "mini" && parts[1] !== "board") {
    kind = "mini";
    slug = normalizeWhitespace(parts[1]);
  } else if (parts.length === 2 && parts[0] === "person" && parts[1] !== "board") {
    kind = "person";
    slug = normalizeWhitespace(parts[1]);
  } else {
    return null;
  }

  if (!slug) return null;
  var id = dcMakeBoardKey(kind, slug);
  return dcCreateBoard(kind, slug, fallbackTitle, description, group, knownBoards ? knownBoards[id] : null, !!knownBoards);
}

function dcGetDiscoveredBoardsMeta() {
  return readStoredJson(DC_DISCOVERED_BOARDS_META_KEY, {});
}

function dcGetDiscoveredBoards() {
  var stored = readStoredJson(DC_DISCOVERED_BOARDS_KEY, []);
  return Array.isArray(stored) ? dedupeBoards(stored) : [];
}

function dcHasFreshDiscoveredBoards() {
  var meta = dcGetDiscoveredBoardsMeta();
  return !!(meta && meta.timestamp && (Date.now() - meta.timestamp < DC_DISCOVERED_BOARDS_MAX_AGE));
}

function dcHasFreshFullDiscoveredBoards() {
  var meta = dcGetDiscoveredBoardsMeta();
  return !!(meta && meta.mode === "full" && meta.timestamp && (Date.now() - meta.timestamp < DC_DISCOVERED_BOARDS_MAX_AGE));
}

function dcWriteDiscoveredBoards(boards, mode) {
  var merged = dedupeBoards(boards || []);
  var meta = dcGetDiscoveredBoardsMeta();
  var nextMode = mode || meta.mode || "partial";
  if (meta.mode === "full" && nextMode !== "full") nextMode = "full";
  writeStoredJson(DC_DISCOVERED_BOARDS_KEY, merged);
  writeStoredJson(DC_DISCOVERED_BOARDS_META_KEY, {
    timestamp: Date.now(),
    count: merged.length,
    mode: nextMode
  });
  setDynamicBoardsCache(merged);
  return merged;
}

function dcMergeDiscoveredBoards(boards, mode) {
  var current = dcGetDiscoveredBoards();
  var merged = dedupeBoards(current.concat(boards || []));
  return dcWriteDiscoveredBoards(merged, mode);
}

function dcCleanBoardAnchorText(value) {
  return normalizeWhitespace(value)
    .replace(/^\d+\.\s*/, "")
    .replace(/\(\d+\)\s*$/, "")
    .replace(/\s*[\[\(]?\d+[\]\)]\s*$/, "");
}

function dcExtractBoardAnchorTitle(anchor) {
  return dcCleanBoardAnchorText(firstNonEmpty([
    firstText(anchor, [".rank_txt", ".gall", ".fx-elpin", ".txt", "strong"]),
    textOf(anchor)
  ]));
}

function dcCleanBoardGroupLabel(value) {
  return normalizeWhitespace(value)
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/\s*갤러리\s*$/g, "")
    .trim();
}

function dcSectionTitleText(section) {
  return dcCleanBoardGroupLabel(firstNonEmpty([
    firstText(section, [".md-tit-box .md-tit", ".md-tit", "h3"]),
    firstText(section, [".tit-box .tit", ".tit"])
  ]));
}

function dcFindCategoryRootListAnchors(doc) {
  if (!doc || !doc.querySelectorAll) return [];
  var sections = doc.querySelectorAll("section.grid");
  for (var i = 0; i < sections.length; i++) {
    var title = dcSectionTitleText(sections[i]);
    if (title.indexOf("카테고리") < 0) continue;
    var anchors = sections[i].querySelectorAll(".gall-lst a");
    if (anchors && anchors.length > 0) return anchors;
  }
  return doc.querySelectorAll(".gall-lst a");
}

function dcFindCategoryBoardListAnchors(doc) {
  if (!doc || !doc.querySelectorAll) return [];
  var sections = doc.querySelectorAll("section.grid");
  var fallback = [];
  for (var i = 0; i < sections.length; i++) {
    var anchors = sections[i].querySelectorAll(".gall-lst a");
    if (!anchors || anchors.length === 0) continue;
    var title = dcSectionTitleText(sections[i]);
    if (title.indexOf("전체") === 0) return anchors;
    if (anchors.length > fallback.length) fallback = anchors;
  }
  return fallback.length > 0 ? fallback : doc.querySelectorAll(".gall-lst a");
}

function dcSimpleBoardAnchorTitle(anchor) {
  return dcCleanBoardAnchorText(textOf(anchor));
}

function dcDecodeUrlSegment(value) {
  var raw = normalizeWhitespace(value);
  if (!raw) return "";
  try {
    return normalizeWhitespace(decodeURIComponent(raw));
  } catch (e) {
    return raw;
  }
}

function dcFastCategoryBoardFromAnchor(anchor, description, group, knownBoards) {
  var href = normalizeUrl(attrOf(anchor, "href")) || ensureAbsoluteUrl(attrOf(anchor, "href"), DC_BASE_URL);
  if (!href) return null;

  var kind = "";
  var slug = "";
  if (href.indexOf(DC_BOARD_BASE_URL) === 0) {
    kind = "board";
    slug = href.substring(DC_BOARD_BASE_URL.length);
  } else if (href.indexOf(DC_MINI_BASE_URL) === 0) {
    kind = "mini";
    slug = href.substring(DC_MINI_BASE_URL.length);
  } else if (href.indexOf(DC_PERSON_BASE_URL) === 0) {
    kind = "person";
    slug = href.substring(DC_PERSON_BASE_URL.length);
  } else {
    return dcBoardFromUrl(href, dcSimpleBoardAnchorTitle(anchor), description, group, knownBoards);
  }

  slug = dcDecodeUrlSegment(String(slug || "").split(/[\/?#]/)[0]);
  if (!slug) return null;

  var id = dcMakeBoardKey(kind, slug);
  var known = knownBoards ? knownBoards[id] : null;
  return {
    id: id,
    kind: kind,
    slug: slug,
    title: normalizeWhitespace(dcSimpleBoardAnchorTitle(anchor) || (known ? known.title : "") || slug),
    url: href,
    description: normalizeWhitespace(description || (known ? known.description : "") || dcBoardKindLabel(kind)),
    group: normalizeWhitespace(group || (known ? known.group : "")),
    showMedia: !!(known && known.showMedia),
    custom: !!(known && known.custom),
    dynamic: !!(known && known.dynamic)
  };
}

function dcAppendCategoryBoardsFromAnchors(anchors, description, group, bucket, knownBoards) {
  var added = 0;
  for (var i = 0; i < anchors.length; i++) {
    var board = dcFastCategoryBoardFromAnchor(anchors[i], description, group, knownBoards);
    if (!board) continue;
    if (!bucket[board.id]) {
      bucket[board.id] = board;
      added += 1;
      continue;
    }
    bucket[board.id] = mergeBoardRecords(board, bucket[board.id]);
  }
  return added;
}

function dcAppendBoardsFromAnchors(anchors, description, group, bucket, knownBoards, titleExtractor) {
  var added = 0;
  var extractTitle = typeof titleExtractor === "function" ? titleExtractor : dcExtractBoardAnchorTitle;
  for (var i = 0; i < anchors.length; i++) {
    var board = dcBoardFromUrl(attrOf(anchors[i], "href"), extractTitle(anchors[i]), description, group, knownBoards);
    if (!board) continue;
    bucket[board.id] = mergeBoardRecords(board, bucket[board.id]);
    added += 1;
  }
  return added;
}

function dcExtractBoardsFromDocument(doc, baseUrl, description, group, bucket) {
  var info = parseAbsoluteUrl(baseUrl);
  var path = info ? info.path : "";
  var knownBoards = boardIndex || {};
  if (/^\/(category|mcategory|micategory|prcategory)\/\d+\/?$/.test(path)) {
    var categoryAnchors = dcFindCategoryBoardListAnchors(doc);
    if (categoryAnchors && categoryAnchors.length > 0) {
      dcAppendCategoryBoardsFromAnchors(categoryAnchors, description, group, bucket, knownBoards);
      return;
    }
  }
  var anchors = dcCollectScopedAnchors(doc, DC_LINK_SELECTOR);
  if (dcAppendBoardsFromAnchors(anchors, description, group, bucket, knownBoards) > 0) return;
  dcAppendBoardsFromAnchors(dcQuerySelectorGroup(doc, DC_LINK_SELECTOR), description, group, bucket, knownBoards);
}

function mergeBoardRecords(preferred, fallback) {
  var primary = preferred || {};
  var secondary = fallback || {};
  return {
    id: normalizeWhitespace(primary.id || secondary.id),
    kind: dcNormalizeBoardKind(primary.kind || secondary.kind),
    slug: normalizeWhitespace(primary.slug || secondary.slug),
    title: normalizeWhitespace(primary.title || secondary.title),
    url: normalizeUrl(primary.url || secondary.url) || ensureAbsoluteUrl(primary.url || secondary.url, SITE.browserHomeUrl) || "",
    description: normalizeWhitespace(primary.description || secondary.description),
    group: normalizeWhitespace(primary.group || secondary.group),
    showMedia: !!(primary.showMedia || secondary.showMedia),
    custom: !!(primary.custom || secondary.custom),
    dynamic: !!(primary.dynamic || secondary.dynamic)
  };
}

function dcExtractCategoryDiscoveryEntries(doc) {
  var anchors = dcCollectScopedAnchors(doc, DC_LINK_SELECTOR);
  var seen = {};
  var out = [];
  for (var i = 0; i < anchors.length; i++) {
    var candidate = normalizeUrl(attrOf(anchors[i], "href"));
    var info = parseAbsoluteUrl(candidate);
    if (!info || !/^\/(category|mcategory|micategory|prcategory)\/\d+$/.test(info.path)) continue;
    if (seen[candidate]) continue;
    seen[candidate] = true;
    out.push({
      url: candidate,
      label: dcCleanBoardGroupLabel(firstNonEmpty([
        attrOf(anchors[i], "title"),
        textOf(anchors[i])
      ]))
    });
  }
  return out;
}

function dcCategoryKindLabelForUrl(url) {
  var info = parseAbsoluteUrl(url);
  var path = info ? info.path : "";
  if (path.indexOf("/micategory") === 0) return "미니 갤러리";
  if (path.indexOf("/prcategory") === 0) return "인물 갤러리";
  if (path.indexOf("/mcategory") === 0) return "마이너 갤러리";
  return "갤러리";
}

function dcDetectCategoryGroupLabel(doc, fallbackLabel) {
  var label = dcCleanBoardGroupLabel(firstNonEmpty([
    firstText(doc, [".page_head h2", ".left_content h3", ".cate-box .txt", "h2", "h3"]),
    fallbackLabel
  ]));
  if (label && label !== "갤러리" && label !== "마이너" && label !== "미니" && label !== "인물") {
    return label;
  }
  return dcCleanBoardGroupLabel(fallbackLabel);
}

function dcSyncDiscoveredBoards(full) {
  var bucket = {};
  var errors = [];
  var categoryQueue = [];
  var categorySeen = {};
  var roots = [
    { url: DC_CATEGORY_HOME_URL, description: "갤러리" },
    { url: DC_BASE_URL + "/category", description: "갤러리" },
    { url: DC_BASE_URL + "/mcategory", description: "마이너 갤러리" },
    { url: DC_BASE_URL + "/micategory", description: "미니 갤러리" },
    { url: DC_BASE_URL + "/prcategory", description: "인물 갤러리" }
  ];

  for (var i = 0; i < roots.length; i++) {
    try {
      var rootDoc = fetchDocument(roots[i].url);
      dcExtractBoardsFromDocument(rootDoc, roots[i].url, roots[i].description, "", bucket);
      if (!full) continue;
      var discovered = dcExtractCategoryDiscoveryEntries(rootDoc);
      for (var j = 0; j < discovered.length; j++) {
        if (!discovered[j] || !discovered[j].url || categorySeen[discovered[j].url]) continue;
        categorySeen[discovered[j].url] = true;
        categoryQueue.push(discovered[j]);
      }
    } catch (e) {
      errors.push(roots[i].url + ": " + e.toString());
    }
  }

  if (full) {
    for (var k = 0; k < categoryQueue.length; k++) {
      try {
        var categoryEntry = categoryQueue[k];
        var categoryUrl = categoryEntry.url;
        var categoryDoc = fetchDocument(categoryUrl);
        dcExtractBoardsFromDocument(
          categoryDoc,
          categoryUrl,
          dcCategoryKindLabelForUrl(categoryUrl),
          dcDetectCategoryGroupLabel(categoryDoc, categoryEntry.label),
          bucket
        );
      } catch (e2) {
        errors.push(categoryQueue[k].url + ": " + e2.toString());
      }
    }
  }

  var boards = [];
  for (var key in bucket) {
    if (Object.prototype.hasOwnProperty.call(bucket, key)) {
      boards.push(bucket[key]);
    }
  }
  if (boards.length === 0) {
    throw new Error(errors.length > 0 ? errors[0] : "게시판 목록을 가져오지 못했습니다.");
  }

  boards = dcWriteDiscoveredBoards(boards, full ? "full" : "shallow");
  return {
    boards: boards,
    count: boards.length,
    errors: errors,
    full: !!full
  };
}

function dcLoadDynamicBoards(options) {
  var allowNetwork = !!(options && options.allowNetwork);
  var force = !!(options && options.force);
  var cached = dcGetDiscoveredBoards();
  if (!force && cached.length > 0 && (!allowNetwork || dcHasFreshDiscoveredBoards())) {
    return cached;
  }
  if (!allowNetwork) return cached;
  try {
    return dcSyncDiscoveredBoards(false).boards;
  } catch (e) {
    return cached;
  }
}

function dcCloneJson(value, fallbackValue) {
  var fallback = fallbackValue === undefined ? null : fallbackValue;
  if (value === undefined || value === null) return fallback;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (e) {
    return fallback;
  }
}

function dcNormalizeCategoryRootCache(cache) {
  var next = dcCloneJson(cache, {});
  if (!next || typeof next !== "object") next = {};
  if (!next.roots || typeof next.roots !== "object") next.roots = {};
  return next;
}

function dcGetCategoryRootCache() {
  if (!dcCategoryRootCache) {
    dcCategoryRootCache = dcNormalizeCategoryRootCache(readStoredJson(DC_CATEGORY_ROOTS_KEY, { roots: {} }));
  }
  return dcCategoryRootCache;
}

function dcSaveCategoryRootCache(cache) {
  dcCategoryRootCache = dcNormalizeCategoryRootCache(cache);
  writeStoredJson(DC_CATEGORY_ROOTS_KEY, dcCategoryRootCache);
  return dcCategoryRootCache;
}

function dcGetCategoryRootSpecs() {
  return DC_CATEGORY_ROOT_SPECS.slice();
}

function dcGetCategoryRootSpec(rootKey) {
  var normalized = normalizeWhitespace(rootKey);
  for (var i = 0; i < DC_CATEGORY_ROOT_SPECS.length; i++) {
    if (DC_CATEGORY_ROOT_SPECS[i].key === normalized) return DC_CATEGORY_ROOT_SPECS[i];
  }
  return null;
}

function dcGetCachedCategoryRootEntries(rootKey, allowStale) {
  var entry = dcGetCategoryRootCache().roots[normalizeWhitespace(rootKey)] || {};
  if (!allowStale && (!entry.fetchedAt || Date.now() - entry.fetchedAt >= DC_DISCOVERED_BOARDS_MAX_AGE)) return [];
  return Array.isArray(entry.categories) ? dcCloneJson(entry.categories, []) : [];
}

function dcSaveCachedCategoryRootEntries(rootKey, categories) {
  var spec = dcGetCategoryRootSpec(rootKey);
  var cache = dcGetCategoryRootCache();
  var normalized = normalizeWhitespace(rootKey);
  cache.roots[normalized] = {
    key: normalized,
    title: spec ? spec.title : normalized,
    url: spec ? spec.url : "",
    categories: dcCloneJson(categories, []),
    fetchedAt: Date.now()
  };
  dcSaveCategoryRootCache(cache);
}

function dcExtractCategoryRootEntries(doc, rootKey) {
  var normalizedRootKey = normalizeWhitespace(rootKey);
  var expectedPrefix = "/" + normalizedRootKey + "/";
  var anchors = dcFindCategoryRootListAnchors(doc);
  var seen = {};
  var entries = [];

  for (var i = 0; i < anchors.length; i++) {
    var href = normalizeUrl(attrOf(anchors[i], "href"));
    var info = parseAbsoluteUrl(href);
    if (!info || !isKnownHost(info.host) || info.path.indexOf(expectedPrefix) !== 0) continue;
    var parts = pathSegments(info.path);
    if (parts.length !== 2 || parts[0] !== normalizedRootKey || !/^\d+$/.test(parts[1])) continue;

    var categoryId = parts[1];
    if (seen[categoryId]) continue;
    var title = dcCleanBoardGroupLabel(firstNonEmpty([
      textOfNodeWithoutSelectors(anchors[i], [".gall-ct", ".sp-arrow"]),
      attrOf(anchors[i], "title"),
      textOf(anchors[i])
    ]));
    if (!title) continue;

    seen[categoryId] = true;
    entries.push({
      key: normalizedRootKey + ":" + categoryId,
      rootKey: normalizedRootKey,
      categoryId: categoryId,
      title: title,
      url: href,
      count: toInt(firstText(anchors[i], [".gall-ct"]), 0)
    });
  }

  return entries;
}

function dcFetchCategoryRootEntries(rootKey) {
  var spec = dcGetCategoryRootSpec(rootKey);
  if (!spec) throw new Error("알 수 없는 카테고리입니다.");
  var doc = fetchDocument(spec.url);
  var categories = dcExtractCategoryRootEntries(doc, rootKey);
  if (categories.length === 0) {
    throw new Error(spec.title + " 카테고리를 가져오지 못했습니다.");
  }
  dcSaveCachedCategoryRootEntries(rootKey, categories);
  return categories;
}

function dcEnsureCategoryRootEntries(rootKey) {
  var categories = dcGetCachedCategoryRootEntries(rootKey);
  if (categories.length > 0) return categories;
  return dcFetchCategoryRootEntries(rootKey);
}

function dcGetCachedCategoryBoardRecord(rootKey, categoryId) {
  return dcCategoryBoardCache[normalizeWhitespace(rootKey) + ":" + normalizeWhitespace(categoryId)] || null;
}

function dcSetCachedCategoryBoardRecord(record) {
  if (!record || !record.key) return null;
  dcCategoryBoardCache[record.key] = record;
  return dcCategoryBoardCache[record.key];
}

function dcGetCategoryRecordMeta(rootKey, categoryId) {
  var categories = dcGetCachedCategoryRootEntries(rootKey);
  for (var i = 0; i < categories.length; i++) {
    if (normalizeWhitespace(categories[i].categoryId) === normalizeWhitespace(categoryId)) {
      return categories[i];
    }
  }
  categories = dcEnsureCategoryRootEntries(rootKey);
  for (var j = 0; j < categories.length; j++) {
    if (normalizeWhitespace(categories[j].categoryId) === normalizeWhitespace(categoryId)) {
      return categories[j];
    }
  }
  return null;
}

function dcFetchCategoryBoardRecord(rootKey, categoryId) {
  var spec = dcGetCategoryRootSpec(rootKey);
  if (!spec) throw new Error("알 수 없는 카테고리입니다.");

  var meta = dcGetCategoryRecordMeta(rootKey, categoryId) || {};
  var categoryUrl = normalizeUrl(meta.url || (spec.url + "/" + encodeURIComponent(String(categoryId))));
  var categoryDoc = fetchDocument(categoryUrl);
  var bucket = {};
  var groupLabel = dcCleanBoardGroupLabel(firstNonEmpty([
    meta.title,
    dcDetectCategoryGroupLabel(categoryDoc, spec.title || ""),
    spec.title
  ]));

  dcExtractBoardsFromDocument(categoryDoc, categoryUrl, spec.title, groupLabel, bucket);

  var boards = [];
  for (var key in bucket) {
    if (!Object.prototype.hasOwnProperty.call(bucket, key)) continue;
    var board = bucket[key];
    board.group = groupLabel || board.group || "";
    if (!board.description) board.description = spec.title;
    board.dynamic = true;
    boards.push(board);
  }

  if (boards.length === 0) {
    throw new Error((meta.title || spec.title) + " 게시판을 가져오지 못했습니다.");
  }

  return dcSetCachedCategoryBoardRecord({
    key: normalizeWhitespace(rootKey) + ":" + normalizeWhitespace(categoryId),
    rootKey: normalizeWhitespace(rootKey),
    categoryId: String(categoryId),
    title: groupLabel || meta.title || spec.title,
    url: categoryUrl,
    count: meta.count || 0,
    boards: boards,
    fetchedAt: Date.now()
  });
}

function dcEnsureCategoryBoardRecord(rootKey, categoryId) {
  var cached = dcGetCachedCategoryBoardRecord(rootKey, categoryId);
  if (cached && Array.isArray(cached.boards) && cached.boards.length > 0) return cached;
  return dcFetchCategoryBoardRecord(rootKey, categoryId);
}

function dcBoardKindLabelFromId(boardId) {
  return dcBoardKindLabel(dcSplitBoardKey(boardId).kind);
}

function dcBuildCategoryHomeItems() {
  var specs = dcGetCategoryRootSpecs();
  var items = [];
  for (var i = 0; i < specs.length; i++) {
    var cachedCount = dcGetCachedCategoryRootEntries(specs[i].key, true).length;
    items.push({
      id: specs[i].key,
      title: specs[i].title,
      description: cachedCount > 0 ? ("카테고리 " + cachedCount + "개") : "탭해서 카테고리 보기",
      category: specs[i].url.replace(/^https?:\/\//, ""),
      author: "",
      date: "",
      commentCount: "",
      viewCount: "",
      likeCount: "",
      types: ["link"],
      menus: [],
      hotCount: cachedCount,
      coldCount: 0
    });
  }
  return items;
}

function dcBuildCategorySectionItems(rootKey) {
  var spec = dcGetCategoryRootSpec(rootKey);
  var categories = dcEnsureCategoryRootEntries(rootKey);
  var items = [];
  for (var i = 0; i < categories.length; i++) {
    items.push({
      id: categories[i].categoryId,
      title: categories[i].title,
      description: categories[i].url.replace(/^https?:\/\//, ""),
      category: categories[i].count > 0 ? (categories[i].count + "개 게시판") : (spec ? spec.title : ""),
      author: "",
      date: "",
      commentCount: "",
      viewCount: "",
      likeCount: "",
      types: ["link"],
      menus: [],
      hotCount: categories[i].count || 0,
      coldCount: 0
    });
  }
  return items;
}

function dcBuildCategoryBoardItems(record, startIndex, pageSize) {
  var boards = record && Array.isArray(record.boards) ? record.boards : [];
  var visibleMap = getAllBoardsVisibility();
  var start = Math.max(0, toInt(startIndex, 0));
  var size = Math.max(1, toInt(pageSize, DC_CATEGORY_BROWSER_PAGE_SIZE));
  var end = Math.min(boards.length, start + size);
  var items = [];

  for (var i = start; i < end; i++) {
    var board = boards[i];
    var isVisible = isBoardVisible(board.id, visibleMap);
    items.push({
      id: board.id,
      link: board.url,
      title: board.title,
      description: board.description || board.url.replace(/^https?:\/\//, ""),
      category: board.group || dcBoardKindLabelFromId(board.id),
      author: "",
      date: "",
      commentCount: "",
      viewCount: "",
      likeCount: "",
      types: ["link"],
      menus: [isVisible ? MENU_HOME_REMOVE : MENU_HOME_TOGGLE],
      hotCount: isVisible ? 1 : 0,
      coldCount: isVisible ? 0 : 1
    });
  }

  return items;
}

function dcBuildSettingsRootItems() {
  var specs = dcGetCategoryRootSpecs();
  var items = [];
  for (var i = 0; i < specs.length; i++) {
    var categoryCount = dcGetCachedCategoryRootEntries(specs[i].key, true).length;
    items.push({
      id: specs[i].key,
      title: specs[i].title,
      description: categoryCount > 0 ? ("카테고리 " + categoryCount + "개") : "카테고리 목록",
      category: "HOME 표시 선택",
      author: "",
      date: "",
      commentCount: "",
      viewCount: "",
      likeCount: "",
      types: ["link"],
      menus: [],
      hotCount: categoryCount,
      coldCount: 0
    });
  }
  return items;
}

function dcBuildSettingsBoardItems(record, startIndex, pageSize) {
  var boards = record && Array.isArray(record.boards) ? record.boards : [];
  var visibleMap = getAllBoardsVisibility();
  var start = Math.max(0, toInt(startIndex, 0));
  var size = Math.max(1, toInt(pageSize, DC_CATEGORY_BROWSER_PAGE_SIZE));
  var end = Math.min(boards.length, start + size);
  var items = [];

  for (var i = start; i < end; i++) {
    var board = boards[i];
    var isVisible = isBoardVisible(board.id, visibleMap);
    items.push({
      id: board.id,
      title: board.title,
      description: firstNonEmpty([
        board.group ? (board.group + " / " + dcBoardKindLabelFromId(board.id)) : "",
        board.description,
        board.url.replace(/^https?:\/\//, "")
      ]),
      category: isVisible ? "홈 표시" : "홈 숨김",
      author: "",
      date: "",
      commentCount: "",
      viewCount: "",
      likeCount: "",
      types: ["link"],
      menus: [],
      hotCount: isVisible ? 1 : 0,
      coldCount: isVisible ? 0 : 1
    });
  }

  return items;
}

function dcCreateCategoryHomeRoute(homeViewId) {
  return {
    kind: "dc_category_home",
    url: normalizeUrl(DC_CATEGORY_HOME_URL),
    viewData: {
      view: "/views/list",
      styles: {
        title: MENU_ALL_BOARDS,
        layout: "list",
        menu: true,
        pagination: false
      },
      models: {
        contents: dcBuildCategoryHomeItems(),
        menus: [MENU_HOME, MENU_BROWSER]
      }
    },
    context: {
      kind: "dc_category_home",
      link: normalizeUrl(DC_CATEGORY_HOME_URL),
      browserUrl: normalizeUrl(DC_CATEGORY_HOME_URL),
      title: MENU_ALL_BOARDS,
      homeViewId: resolveCategoryHomeViewId(homeViewId || 0)
    }
  };
}

function dcCreateCategorySectionRoute(rootKey, homeViewId) {
  var spec = dcGetCategoryRootSpec(rootKey);
  if (!spec) throw new Error("알 수 없는 카테고리입니다.");
  return {
    kind: "dc_category_root_list",
    url: normalizeUrl(spec.url),
    viewData: {
      view: "/views/list",
      styles: {
        title: spec.title,
        layout: "list",
        menu: true,
        pagination: false
      },
      models: {
        contents: dcBuildCategorySectionItems(rootKey),
        menus: [MENU_BOARD_SYNC, MENU_HOME, MENU_BROWSER]
      }
    },
    context: {
      kind: "dc_category_root_list",
      link: normalizeUrl(spec.url),
      browserUrl: normalizeUrl(spec.url),
      title: spec.title,
      rootKey: normalizeWhitespace(rootKey),
      homeViewId: resolveCategoryHomeViewId(homeViewId || 0)
    }
  };
}

function dcCreateCategoryBoardRoute(rootKey, categoryId, homeViewId) {
  var record = dcEnsureCategoryBoardRecord(rootKey, categoryId);
  var items = dcBuildCategoryBoardItems(record, 0, DC_CATEGORY_BROWSER_PAGE_SIZE);
  return {
    kind: "dc_category_board_list",
    url: normalizeUrl(record.url),
    viewData: {
      view: "/views/list",
      styles: {
        title: record.title,
        layout: "list",
        menu: true,
        pagination: record.boards.length > items.length
      },
      models: {
        contents: items,
        menus: [MENU_BOARD_SYNC, MENU_HOME, MENU_BROWSER]
      }
    },
    context: {
      kind: "dc_category_board_list",
      link: normalizeUrl(record.url),
      browserUrl: normalizeUrl(record.url),
      title: record.title,
      rootKey: normalizeWhitespace(rootKey),
      categoryId: String(categoryId),
      nextIndex: items.length,
      totalCount: record.boards.length,
      homeViewId: resolveCategoryHomeViewId(homeViewId || 0)
    }
  };
}

function dcCreateSettingsRootRoute(parentViewId) {
  return {
    kind: "board_settings_root",
    url: normalizeUrl(DC_CATEGORY_HOME_URL),
    viewData: {
      view: "/views/list",
      styles: {
        title: SITE.boardSettingsTitle || MENU_SETTINGS,
        layout: "list",
        menu: true,
        pagination: false
      },
      models: {
        contents: dcBuildSettingsRootItems(),
        menus: [MENU_BOARD_SYNC, "추가", "초기화"]
      }
    },
    context: {
      kind: "board_settings_root",
      link: normalizeUrl(DC_CATEGORY_HOME_URL),
      title: SITE.boardSettingsTitle || MENU_SETTINGS,
      parentViewId: parentViewId || 0
    }
  };
}

function dcCreateSettingsCategoryRoute(parentViewId, rootKey) {
  var spec = dcGetCategoryRootSpec(rootKey);
  if (!spec) throw new Error("알 수 없는 카테고리입니다.");
  return {
    kind: "dc_board_settings_category_root_list",
    url: normalizeUrl(spec.url),
    viewData: {
      view: "/views/list",
      styles: {
        title: spec.title,
        layout: "list",
        menu: true,
        pagination: false
      },
      models: {
        contents: dcBuildCategorySectionItems(rootKey),
        menus: [MENU_BOARD_SYNC]
      }
    },
    context: {
      kind: "dc_board_settings_category_root_list",
      link: normalizeUrl(spec.url),
      title: spec.title,
      rootKey: normalizeWhitespace(rootKey),
      parentViewId: parentViewId || 0
    }
  };
}

function dcCreateSettingsBoardRoute(parentViewId, rootKey, categoryId) {
  var record = dcEnsureCategoryBoardRecord(rootKey, categoryId);
  var items = dcBuildSettingsBoardItems(record, 0, DC_CATEGORY_BROWSER_PAGE_SIZE);
  return {
    kind: "dc_board_settings_category_board_list",
    url: normalizeUrl(record.url),
    viewData: {
      view: "/views/list",
      styles: {
        title: record.title,
        layout: "list",
        menu: true,
        pagination: record.boards.length > items.length
      },
      models: {
        contents: items,
        menus: [MENU_BOARD_SYNC]
      }
    },
    context: {
      kind: "dc_board_settings_category_board_list",
      link: normalizeUrl(record.url),
      title: record.title,
      rootKey: normalizeWhitespace(rootKey),
      categoryId: String(categoryId),
      nextIndex: items.length,
      totalCount: record.boards.length,
      parentViewId: parentViewId || 0
    }
  };
}

function dcRouteCustom(url, urlInfo) {
  if (!urlInfo) return null;
  if (urlInfo.path === "/galltotal" || urlInfo.path === "/galltotal/") {
    return dcCreateCategoryHomeRoute(0);
  }
  var matchedRoot = urlInfo.path.match(/^\/(category|mcategory|micategory|prcategory)\/?$/);
  if (matchedRoot) {
    return dcCreateCategorySectionRoute(matchedRoot[1], 0);
  }
  var matchedCategory = urlInfo.path.match(/^\/(category|mcategory|micategory|prcategory)\/(\d+)\/?$/);
  if (matchedCategory) {
    return dcCreateCategoryBoardRoute(matchedCategory[1], matchedCategory[2], 0);
  }
  return null;
}

function dcRefreshCustomView(viewId, state, snackbar) {
  var route = null;
  if (!state || state.kind === "dc_category_home") {
    route = dcCreateCategoryHomeRoute(state ? state.homeViewId || 0 : 0);
  } else if (state.kind === "dc_category_root_list") {
    route = dcCreateCategorySectionRoute(state.rootKey, state.homeViewId || 0);
  } else if (state.kind === "dc_category_board_list") {
    route = dcCreateCategoryBoardRoute(state.rootKey, state.categoryId, state.homeViewId || 0);
  } else if (state.kind === "board_settings_root") {
    route = dcCreateSettingsRootRoute(state.parentViewId || 0);
  } else if (state.kind === "dc_board_settings_category_root_list") {
    route = dcCreateSettingsCategoryRoute(state.parentViewId || 0, state.rootKey);
  } else if (state.kind === "dc_board_settings_category_board_list") {
    route = dcCreateSettingsBoardRoute(state.parentViewId || 0, state.rootKey, state.categoryId);
  }
  if (!route) return false;
  updateViewFromRoute(viewId, route, snackbar || "");
  return true;
}

function dcAppendCategoryPage(viewId, state) {
  if (!state || (state.kind !== "dc_category_board_list" && state.kind !== "dc_board_settings_category_board_list")) {
    return false;
  }
  var record = dcEnsureCategoryBoardRecord(state.rootKey, state.categoryId);
  var nextIndex = Math.max(0, toInt(state.nextIndex, 0));
  if (nextIndex >= record.boards.length) {
    synura.update(viewId, {
      styles: { pagination: false },
      models: { snackbar: "더 불러올 게시판이 없습니다." }
    });
    return true;
  }

  var appendItems = state.kind === "dc_board_settings_category_board_list"
    ? dcBuildSettingsBoardItems(record, nextIndex, DC_CATEGORY_BROWSER_PAGE_SIZE)
    : dcBuildCategoryBoardItems(record, nextIndex, DC_CATEGORY_BROWSER_PAGE_SIZE);
  state.nextIndex = nextIndex + appendItems.length;
  state.totalCount = record.boards.length;
  setViewState(viewId, state);

  synura.update(viewId, {
    styles: {
      pagination: state.nextIndex < record.boards.length
    },
    models: {
      append: appendItems
    }
  });
  return true;
}

function dcPersistBoardForHome(board) {
  var normalizedBoard = normalizeBoardRecord(board, board);
  if (!normalizedBoard) return null;
  dcMergeDiscoveredBoards([normalizedBoard], dcHasFreshFullDiscoveredBoards() ? "full" : "");
  if (shouldAppendEnabledBoardToHomeOrder(normalizedBoard.id)) {
    moveBoardOrderToEnd(normalizedBoard.id);
  }
  homeBoards = getVisibleBoards();
  rebuildBoardIndex();
  return normalizedBoard;
}

function dcSetBoardVisible(boardLike, visible) {
  var normalizedBoard = dcPersistBoardForHome(boardLike);
  if (!normalizedBoard) return null;
  var visibleMap = getAllBoardsVisibility();
  visibleMap[normalizedBoard.id] = !!visible;
  saveVisibleMap(visibleMap);
  if (visible && shouldAppendEnabledBoardToHomeOrder(normalizedBoard.id)) {
    moveBoardOrderToEnd(normalizedBoard.id);
  }
  homeBoards = getVisibleBoards();
  rebuildBoardIndex();
  return normalizedBoard;
}

function dcResolveBoardFromState(state) {
  if (!state) return null;
  var boardId = normalizeWhitespace(state.boardId);
  if (!boardId) return null;
  var parts = dcSplitBoardKey(boardId);
  return dcCreateBoard(parts.kind, parts.slug, state.boardTitle || parts.slug, state.boardTitle || parts.slug);
}

function dcHandleBoardHomeToggleMenu(viewId, state) {
  var board = dcResolveBoardFromState(state);
  if (!board) return false;
  var nextVisible = !isBoardVisible(board.id, getAllBoardsVisibility());
  var saved = dcSetBoardVisible(board, nextVisible);
  if (!saved) {
    synura.update(viewId, { models: { snackbar: "게시판 상태를 변경하지 못했습니다." } });
    return true;
  }
  var message = saved.title + (nextVisible ? " 홈에 추가했습니다." : " 홈에서 제거했습니다.");
  synura.update(viewId, {
    models: {
      menus: state && state.kind === "post" ? getPostMenus(state) : getBoardMenus(state),
      snackbar: message
    }
  });
  refreshAnyHomeView(0, "");
  return true;
}

function dcImportCategoryBrowser(state) {
  if (!state || state.kind === "dc_category_home") {
    var total = 0;
    var specs = dcGetCategoryRootSpecs();
    for (var i = 0; i < specs.length; i++) {
      total += dcFetchCategoryRootEntries(specs[i].key).length;
    }
    return "카테고리 " + total + "개를 가져왔습니다.";
  }

  if (state.kind === "dc_category_root_list" || state.kind === "dc_board_settings_category_root_list") {
    var spec = dcGetCategoryRootSpec(state.rootKey);
    var categories = dcFetchCategoryRootEntries(state.rootKey);
    return (spec ? spec.title : "카테고리") + " " + categories.length + "개를 가져왔습니다.";
  }

  if (state.kind === "dc_category_board_list" || state.kind === "dc_board_settings_category_board_list") {
    var record = dcFetchCategoryBoardRecord(state.rootKey, state.categoryId);
    return record.title + " 게시판 " + record.boards.length + "개를 가져왔습니다.";
  }

  return "";
}

function dcOpenCategoryHomeFromMenu(viewId, state) {
  var homeViewId = state && state.kind === "home" ? viewId : 0;
  openRoute(dcCreateCategoryHomeRoute(homeViewId));
  return true;
}

function dcShowBoardSettings(parentViewId) {
  return openRoute(dcCreateSettingsRootRoute(parentViewId || 0));
}

function dcRefreshBoardSettingsParent(viewId, snackbar) {
  var state = getViewState(viewId);
  if (!state) return false;
  if (
    state.kind === "board_settings_root" ||
    state.kind === "dc_board_settings_category_root_list" ||
    state.kind === "dc_board_settings_category_board_list"
  ) {
    return dcRefreshCustomView(viewId, state, snackbar || "");
  }
  return false;
}

function dcHandleBoardSettingsRootEvent(viewId, event, state) {
  if (!state || state.kind !== "board_settings_root") return false;

  if (event.eventId === "MENU_CLICK") {
    var menu = normalizeWhitespace(event.data ? event.data.menu : "");
    if (menu === MENU_BOARD_SYNC) {
      var result = dcSyncDiscoveredBoards(true);
      dcRefreshCustomView(viewId, state, result.count > 0
        ? ("게시판 " + result.count + "개를 가져왔습니다.")
        : "가져올 게시판이 없습니다.");
      if (state.parentViewId) {
        refreshAnyHomeView(state.parentViewId, "");
      }
      return true;
    }
    if (menu === "추가") {
      showBoardAddDialog(viewId, state.parentViewId || 0);
      return true;
    }
    if (menu === "초기화") {
      clearDynamicBoardsCache();
      localStorage.removeItem(DC_DISCOVERED_BOARDS_KEY);
      localStorage.removeItem(DC_DISCOVERED_BOARDS_META_KEY);
      localStorage.removeItem(DC_CATEGORY_ROOTS_KEY);
      dcCategoryRootCache = null;
      dcCategoryBoardCache = {};
      resetBoardSettingsStorage();
      resetHomeAfterBoardSettingsReset(viewId, state.parentViewId || 0, "설정이 초기화되었습니다.");
      return true;
    }
    return true;
  }

  if (event.eventId === "CLICK") {
    var rootKey = normalizeWhitespace(event.data ? event.data.id : "");
    if (!rootKey) return true;
    openRoute(dcCreateSettingsCategoryRoute(state.parentViewId || 0, rootKey));
    return true;
  }

  return false;
}

function dcHandleCustomListEvent(viewId, event, state) {
  if (!state) return false;

  if (event.eventId === "SCROLL_TO_END") {
    return dcAppendCategoryPage(viewId, state);
  }

  if (event.eventId === "CLICK") {
    var clickId = normalizeWhitespace(event.data ? event.data.id : "");
    if (!clickId) return false;
    if (state.kind === "dc_category_home") {
      openRoute(dcCreateCategorySectionRoute(clickId, state.homeViewId || 0));
      return true;
    }
    if (state.kind === "dc_category_root_list") {
      openRoute(dcCreateCategoryBoardRoute(state.rootKey, clickId, state.homeViewId || 0));
      return true;
    }
    if (state.kind === "dc_board_settings_category_root_list") {
      openRoute(dcCreateSettingsBoardRoute(state.parentViewId || 0, state.rootKey, clickId));
      return true;
    }
    if (state.kind === "dc_board_settings_category_board_list") {
      var record = dcEnsureCategoryBoardRecord(state.rootKey, state.categoryId);
      var board = null;
      for (var i = 0; i < record.boards.length; i++) {
        if (record.boards[i].id === clickId) {
          board = record.boards[i];
          break;
        }
      }
      if (!board) {
        synura.update(viewId, { models: { snackbar: "게시판 상태를 변경하지 못했습니다." } });
        return true;
      }
      var nextVisible = !isBoardVisible(board.id, getAllBoardsVisibility());
      var saved = dcSetBoardVisible(board, nextVisible);
      if (!saved) {
        synura.update(viewId, { models: { snackbar: "게시판 상태를 변경하지 못했습니다." } });
        return true;
      }
      dcRefreshCustomView(viewId, state, saved.title + (nextVisible ? " 홈에 추가했습니다." : " 홈에서 제거했습니다."));
      if (state.parentViewId) refreshAnyHomeView(state.parentViewId, "");
      return true;
    }
    return false;
  }

  if (event.eventId === "ITEM_MENU_CLICK" && state.kind === "dc_category_board_list") {
    var itemMenu = normalizeWhitespace(event.data ? event.data.menu : "");
    var itemId = normalizeWhitespace(event.data ? event.data.id : "");
    if (itemMenu !== MENU_HOME_TOGGLE && itemMenu !== MENU_HOME_REMOVE) return false;
    var record = dcEnsureCategoryBoardRecord(state.rootKey, state.categoryId);
    var board = null;
    for (var j = 0; j < record.boards.length; j++) {
      if (record.boards[j].id === itemId) {
        board = record.boards[j];
        break;
      }
    }
    if (!board) {
      synura.update(viewId, { models: { snackbar: "게시판 상태를 변경하지 못했습니다." } });
      return true;
    }
    var savedBoard = dcSetBoardVisible(board, itemMenu === MENU_HOME_TOGGLE);
    if (!savedBoard) {
      synura.update(viewId, { models: { snackbar: "게시판 상태를 변경하지 못했습니다." } });
      return true;
    }
    dcRefreshCustomView(viewId, state, savedBoard.title + (itemMenu === MENU_HOME_TOGGLE ? " 홈에 추가했습니다." : " 홈에서 제거했습니다."));
    refreshAnyHomeView(state.homeViewId || 0, "");
    return true;
  }

  if (event.eventId !== "MENU_CLICK") return false;

  var menu = normalizeWhitespace(event.data ? event.data.menu : "");
  if (!menu) return false;

  if (menu === MENU_BOARD_SYNC) {
    var message = dcImportCategoryBrowser(state);
    dcRefreshCustomView(viewId, state, message);
    return true;
  }
  if (menu === MENU_HOME) {
    openRoute(createHomeRoute(false));
    return true;
  }
  if (menu === MENU_BROWSER) {
    openBrowser((state && state.browserUrl) || (state && state.link) || DC_CATEGORY_HOME_URL, state.title || MENU_ALL_BOARDS, {
      from: "browser_menu",
      parentViewId: viewId || 0,
      targetUrl: (state && state.browserUrl) || (state && state.link) || DC_CATEGORY_HOME_URL
    });
    return true;
  }

  return false;
}

function dcHandleViewEvent(viewId, event, state) {
  if (!state) return false;
  if (
    state.kind === "dc_category_home" ||
    state.kind === "dc_category_root_list" ||
    state.kind === "dc_category_board_list" ||
    state.kind === "dc_board_settings_category_root_list" ||
    state.kind === "dc_board_settings_category_board_list"
  ) {
    return dcHandleCustomListEvent(viewId, event, state);
  }
  return false;
}

function dcParseComments(doc, postUrl) {
  var rows = allNodes(doc, SITE.selectors.commentRows);
  var comments = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var contentRoot = firstNode(row, SITE.selectors.commentContent);
    var content = dcAttachImageHeaders(parseDetails(contentRoot, postUrl), postUrl);
    if (!content || content.length === 0) {
      var rawText = firstText(row, SITE.selectors.commentContent);
      if (rawText) content = [{ type: "text", value: rawText }];
    }
    if (!content || content.length === 0) continue;

    var likeCount = hideZeroCount(parseCount(firstText(row, SITE.selectors.commentLikeCount)));
    comments.push({
      link: postUrl + "#comment-" + (i + 1),
      author: firstAuthorText(row, SITE.selectors.commentAuthor),
      avatar: imageUrlFromNode(firstNode(row, SITE.selectors.commentAvatar || SITE.selectors.commentAuthor), postUrl),
      content: content,
      date: firstText(row, SITE.selectors.commentDate),
      likeCount: likeCount,
      dislikeCount: "",
      level: detectCommentLevel(row),
      menus: [],
      hotCount: toInt(likeCount, 0),
      coldCount: toInt(likeCount, 0)
    });
  }
  return comments;
}

SITE.parseComments = dcParseComments;

SITE.buildPostFetchOptions = function (match, url, options) {
  var out = options || buildFetchOptions();
  if (!out.headers) out.headers = {};
  if (!out.headers.Accept && !out.headers.accept) {
    out.headers.Accept = "image/webp,image/*;q=0.8,*/*;q=0.5";
  }
  return out;
};

SITE.fetchPostComments = function (match, url, doc, page, comments) {
  return dcAttachCommentImageHeaders(comments, url);
};

SITE.filterPostContent = dcAttachImageHeaders;

SITE.matchBoard = function (urlInfo) {
  var parts = pathSegments(urlInfo.path);
  if (urlInfo.path === "/board/lists" || urlInfo.path === "/board/lists/") {
    var listId = queryValue(urlInfo.query, "id");
    if (listId) {
      return {
        board: dcCreateBoard("board", listId, "", dcBoardKindLabel("board")),
        page: queryInt(urlInfo.query, "page", 1)
      };
    }
  }
  if (urlInfo.path === "/mini/board/lists" || urlInfo.path === "/mini/board/lists/") {
    var miniId = queryValue(urlInfo.query, "id");
    if (miniId) {
      return {
        board: dcCreateBoard("mini", miniId, "", dcBoardKindLabel("mini")),
        page: queryInt(urlInfo.query, "page", 1)
      };
    }
  }
  if (urlInfo.path === "/person/board/lists" || urlInfo.path === "/person/board/lists/") {
    var personId = queryValue(urlInfo.query, "id");
    if (personId) {
      return {
        board: dcCreateBoard("person", personId, "", dcBoardKindLabel("person")),
        page: queryInt(urlInfo.query, "page", 1)
      };
    }
  }
  if (parts.length === 2 && parts[0] === "board" && parts[1] !== "view" && parts[1] !== "lists") {
    return {
      board: dcCreateBoard("board", parts[1], "", dcBoardKindLabel("board")),
      page: queryInt(urlInfo.query, "page", 1)
    };
  }
  if (parts.length === 2 && parts[0] === "mini" && parts[1] !== "board") {
    return {
      board: dcCreateBoard("mini", parts[1], "", dcBoardKindLabel("mini")),
      page: queryInt(urlInfo.query, "page", 1)
    };
  }
  if (parts.length === 2 && parts[0] === "person" && parts[1] !== "board") {
    return {
      board: dcCreateBoard("person", parts[1], "", dcBoardKindLabel("person")),
      page: queryInt(urlInfo.query, "page", 1)
    };
  }
  return null;
};

SITE.matchPost = function (urlInfo) {
  var parts = pathSegments(urlInfo.path);
  if (parts.length >= 3 && parts[0] === "board" && parts[1] !== "view" && parts[1] !== "lists" && /^\d+$/.test(parts[2])) {
    return {
      board: dcCreateBoard("board", parts[1], "", dcBoardKindLabel("board")),
      postId: parts[2]
    };
  }
  if (parts.length >= 3 && parts[0] === "mini" && parts[1] !== "board" && /^\d+$/.test(parts[2])) {
    return {
      board: dcCreateBoard("mini", parts[1], "", dcBoardKindLabel("mini")),
      postId: parts[2]
    };
  }
  if (parts.length >= 3 && parts[0] === "person" && parts[1] !== "board" && /^\d+$/.test(parts[2])) {
    return {
      board: dcCreateBoard("person", parts[1], "", dcBoardKindLabel("person")),
      postId: parts[2]
    };
  }
  if (urlInfo.path === "/board/view" || urlInfo.path === "/board/view/") {
    var boardId = queryValue(urlInfo.query, "id");
    var boardNo = queryValue(urlInfo.query, "no");
    if (boardId && boardNo) {
      return {
        board: dcCreateBoard("board", boardId, "", dcBoardKindLabel("board")),
        postId: boardNo
      };
    }
  }
  if (urlInfo.path === "/mini/board/view" || urlInfo.path === "/mini/board/view/") {
    var miniBoardId = queryValue(urlInfo.query, "id");
    var miniBoardNo = queryValue(urlInfo.query, "no");
    if (miniBoardId && miniBoardNo) {
      return {
        board: dcCreateBoard("mini", miniBoardId, "", dcBoardKindLabel("mini")),
        postId: miniBoardNo
      };
    }
  }
  if (urlInfo.path === "/person/board/view" || urlInfo.path === "/person/board/view/") {
    var personBoardId = queryValue(urlInfo.query, "id");
    var personBoardNo = queryValue(urlInfo.query, "no");
    if (personBoardId && personBoardNo) {
      return {
        board: dcCreateBoard("person", personBoardId, "", dcBoardKindLabel("person")),
        postId: personBoardNo
      };
    }
  }
  return null;
};

SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
  if (!match || !match.board) return setPageParam(currentUrl, "page", nextPage);
  return dcBuildBoardPageUrl(match.board.kind, match.board.slug, nextPage);
};

SITE.loadDynamicBoards = dcLoadDynamicBoards;

SITE.routeCustom = dcRouteCustom;

SITE.openCategoryHomeFromMenu = dcOpenCategoryHomeFromMenu;

SITE.showBoardSettings = dcShowBoardSettings;

SITE.refreshView = function (viewId, state) {
  if (!state) return false;
  if (
    state.kind === "dc_category_home" ||
    state.kind === "dc_category_root_list" ||
    state.kind === "dc_category_board_list" ||
    state.kind === "board_settings_root" ||
    state.kind === "dc_board_settings_category_root_list" ||
    state.kind === "dc_board_settings_category_board_list"
  ) {
    return dcRefreshCustomView(viewId, state, "새로고침 완료");
  }
  return false;
};

SITE.refreshBoardSettingsParent = dcRefreshBoardSettingsParent;

SITE.handleBoardHomeToggleMenu = dcHandleBoardHomeToggleMenu;

SITE.handleBoardSettingsRootEvent = dcHandleBoardSettingsRootEvent;

SITE.handleViewEvent = dcHandleViewEvent;
