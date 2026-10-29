// @ts-nocheck

var SITE = {
  siteKey: "naver_news",
  cp: "list-metadata-v5",
  displayName: "네이버 뉴스",
  browserHomeUrl: "https://news.naver.com/",
  browserCookieAuth: false,
  minimumHomeBoards: 7,
  defaultCacheTtlMs: 300000,
  showCacheSnackbarByDefault: true,
  enableCacheSettings: true,
  enableBoardReorder: true,
  enableBoardDelete: true,
  boardSettingsMenuLabel: "뉴스 섹션",
  boardSettingsTitle: "뉴스 섹션 설정",
  boardSettingsLargeThreshold: 128,
  boardSettingsPageSize: 64,
  boardAddMode: "url_title",
  hasFullBoardCatalog: false,
  supportsBoardCatalogSync: false,
  defaultVisibleBoardIds: [
    "headline", "politics", "economy", "society", "culture", "world", "it"
  ],
  defaultShowMediaBoardIds: [
    "headline", "politics", "economy", "society", "culture", "world", "it"
  ],
  hostAliases: [
    "news.naver.com",
    "m.news.naver.com",
    "n.news.naver.com"
  ],
  fetchHeaders: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
  },
  challengeMarkers: [],
  titleSuffixes: [
    " : 네이버 뉴스",
    " - 네이버 뉴스",
    " | 네이버 뉴스"
  ],
  linkAllowPatterns: [
    "^https://n\\.news\\.naver\\.com/mnews/article/\\d+/\\d+",
    "^https://n\\.news\\.naver\\.com/article/\\d+/\\d+",
    "^https://news\\.naver\\.com/.*article.*"
  ],
  boards: [
    { id: "headline", title: "주요뉴스", url: "https://news.naver.com/", description: "헤드라인 및 주요 뉴스" },
    { id: "politics", title: "정치", url: "https://news.naver.com/section/100", description: "정치 뉴스" },
    { id: "economy", title: "경제", url: "https://news.naver.com/section/101", description: "경제 뉴스" },
    { id: "society", title: "사회", url: "https://news.naver.com/section/102", description: "사회 뉴스" },
    { id: "culture", title: "생활/문화", url: "https://news.naver.com/section/103", description: "생활 및 문화 뉴스" },
    { id: "world", title: "세계", url: "https://news.naver.com/section/104", description: "세계 뉴스" },
    { id: "it", title: "IT/과학", url: "https://news.naver.com/section/105", description: "IT 및 과학 뉴스" }
  ],
  selectors: {
    boardTitle: [".contentTitle", ".p-title-value", "h2", "title"],
    listRows: [
      ".sa_item_flex",
      ".sa_item",
      ".sh_item",
      ".cjs_dept_desc",
      "li.sa_item",
      "div.sa_item"
    ],
    listLink: [
      "a.sa_text_title",
      "a.sa_thumb_link",
      "a[href]"
    ],
    listTitle: [
      ".sa_text_strong",
      ".sa_text_title",
      ".sh_text_headline",
      "a[href]"
    ],
    listAuthor: [
      ".sa_text_press",
      ".sh_text_press"
    ],
    listDate: [
      ".cni_time", ".sa_text_datetime", "time[datetime]", "time"
    ],
    listImage: [
      ".sa_thumb img[data-src]",
      ".sa_thumb img[src]",
      "img[data-src]",
      "img[src]"
    ],
    postTitle: [
      "#title_area",
      ".media_end_head_headline",
      "h2"
    ],
    postAuthor: [
      ".media_end_head_journalist_name",
      ".media_end_head_top_press",
      ".media_end_head_top_logo img"
    ],
    postAvatar: [".media_end_head_journalist_thumb img"],
    postDate: [
      "._ARTICLE_DATE_TIME",
      ".media_end_head_info_datestamp_time",
      "time"
    ],
    postContent: [
      "#dic_area",
      "#newsct_article",
      "._article_body"
    ],
    commentRows: [],
    commentAuthor: [],
    commentContent: [],
    commentDate: []
  }
};

function naverNewsFieldText(root, selectors) {
  for (var i = 0; root && i < selectors.length; i++) {
    var nodes = root.querySelectorAll(selectors[i]);
    for (var j = 0; j < nodes.length; j++) {
      var text = textOf(nodes[j]);
      if (text) return text;
    }
  }
  return "";
}

function naverNewsNormalizeDate(value) {
  var text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  var now = Date.now();
  var relative = text.match(/^(\d+)\s*(초|분|시간|일)\s*전$/);
  if (relative) {
    var unit = { "초": 1000, "분": 60000, "시간": 3600000, "일": 86400000 }[relative[2]];
    return new Date(now - Number(relative[1]) * unit).toISOString();
  }
  if (/^방금\s*전$/.test(text)) return new Date(now).toISOString();
  var full = text.match(/^(\d{4})[.\/-]\s*(\d{1,2})[.\/-]\s*(\d{1,2})\.?\s*[T ]\s*(오전|오후)?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/);
  var short = text.match(/^(\d{1,2})월\s*(\d{1,2})일\s*(오전|오후)?\s*(\d{1,2}):(\d{2})$/);
  if (!full && !short) return "";
  var year = full ? Number(full[1]) : new Date(now + 9 * 3600000).getUTCFullYear();
  var month = Number(full ? full[2] : short[1]);
  var day = Number(full ? full[3] : short[2]);
  var meridiem = full ? full[4] : short[3];
  var hour = Number(full ? full[5] : short[4]);
  var minute = Number(full ? full[6] : short[5]);
  var second = Number(full && full[7] || 0);
  if (meridiem) hour = hour % 12 + (meridiem === "오후" ? 12 : 0);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) return "";
  function pad(part) { return part < 10 ? "0" + part : String(part); }
  function stamp(y) {
    return y + "-" + pad(month) + "-" + pad(day) + "T" + pad(hour) + ":" + pad(minute) + ":" + pad(second) + (full && full[8] || "+09:00");
  }
  var result = stamp(year);
  // Homepage issue cards omit the year, including for articles from December.
  if (short && Date.parse(result) > now + 86400000) result = stamp(year - 1);
  return isNaN(Date.parse(result)) ? "" : result;
}

function naverNewsDisplayDate(value) {
  var normalized = naverNewsNormalizeDate(value);
  if (!normalized) return "";
  var koreanTime = new Date(Date.parse(normalized) + 9 * 3600000);
  return koreanTime.toISOString().slice(0, 16).replace("T", " ");
}

function naverNewsDate(root, selectors) {
  for (var i = 0; root && i < selectors.length; i++) {
    var nodes = root.querySelectorAll(selectors[i]);
    for (var j = 0; j < nodes.length; j++) {
      var node = nodes[j];
      var date = naverNewsNormalizeDate(attrOf(node, "data-date-time")) ||
        naverNewsNormalizeDate(attrOf(node, "datetime")) ||
        naverNewsNormalizeDate(attrOf(node, "content")) ||
        naverNewsNormalizeDate(textOf(node));
      if (date) return date;
    }
  }
  return "";
}

function naverNewsArticleParts(url) {
  return String(url || "").match(/\/article\/(\d+)\/(\d+)(?:[/?#]|$)/);
}

function naverNewsItemKey(url) {
  var parts = naverNewsArticleParts(url);
  return parts ? parts[1] + ":" + parts[2] : "";
}

var NAVER_NEWS_PAGE_SIZE = 20;
var NAVER_NEWS_COMMENT_TTL_MS = 60000;

function naverNewsMetadataKey(url) {
  return "naver_news:article_metadata:v1:" + naverNewsItemKey(url);
}

function naverNewsMetadata(url) {
  return sessionStorage.getItem(naverNewsMetadataKey(url)) || {};
}

function naverNewsPublishedDate(doc) {
  return naverNewsDate(doc, [
    "._ARTICLE_DATE_TIME", ".media_end_head_info_datestamp_time",
    "time", "meta[property='article:published_time']"
  ]) || naverNewsNormalizeDate((detectSchemaPost(doc) || {}).datePublished);
}

function naverNewsFillListMetadata(items) {
  var pendingCounts = {};
  var objectIds = [];
  var now = Date.now();
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var parts = naverNewsArticleParts(item.link);
    if (!parts) continue;
    var metadata = naverNewsMetadata(item.link);
    item.date = naverNewsDisplayDate(item.date);
    if (metadata.commentCheckedAt && now - metadata.commentCheckedAt < NAVER_NEWS_COMMENT_TTL_MS) {
      item.commentCount = metadata.commentCount;
    } else {
      var objectId = "news" + parts[1] + "," + parts[2];
      if (!pendingCounts[objectId]) objectIds.push(objectId);
      pendingCounts[objectId] = item;
    }
  }
  if (!objectIds.length) return;
  try {
    var response = fetchWithLogging(
      "https://news.naver.com/section/template/NEWS_COMMENT_COUNT_LIST?ticket=news&objectIds=" +
        encodeURIComponent(objectIds.join(";")),
      buildFetchOptions()
    );
    if (!response || !response.ok) return;
    var data = JSON.parse(responseText(response));
    var component = data && data.component && data.component.NEWS_COMMENT_COUNT_LIST;
    var counts = component && component.value;
    if (!Array.isArray(counts)) return;
    for (var j = 0; j < counts.length; j++) {
      var entry = counts[j];
      var target = entry && pendingCounts[entry.objectId];
      if (!target || typeof entry.count !== "number" || !isFinite(entry.count) || entry.count < 0) continue;
      var record = naverNewsMetadata(target.link);
      record.commentCount = entry.exposureConfig && entry.exposureConfig.status === "COMMENT_OFF" ? "" : String(entry.count);
      record.commentCheckedAt = Date.now();
      target.commentCount = record.commentCount;
      sessionStorage.setItem(naverNewsMetadataKey(target.link), record);
    }
  } catch (e) {
    // Keep unknown counts empty when the count service is unavailable.
  }
}

function extractListItem(row, baseUrl) {
  if (!row) return null;
  var linkNode = null;
  var link = "";
  var key = "";
  var linkSelectors = ["a.sa_text_title", "a[href]"];
  for (var s = 0; s < linkSelectors.length && !linkNode; s++) {
    var candidates = attrOf(row, "href") ? [row] : row.querySelectorAll(linkSelectors[s]);
    for (var c = 0; c < candidates.length; c++) {
      var href = attrOf(candidates[c], "href");
      var candidate = normalizeUrl(href) || ensureAbsoluteUrl(href, baseUrl);
      var candidateKey = naverNewsItemKey(candidate);
      if (!candidateKey || !isKnownHost((parseAbsoluteUrl(candidate) || {}).host)) continue;
      linkNode = candidates[c];
      link = candidate;
      key = candidateKey;
      break;
    }
  }
  if (!linkNode) return null;

  var title = naverNewsFieldText(row, [
    ".sa_text_strong", ".sh_text_headline", ".cni_title", ".cnf_news_title",
    ".cn_title", ".cc_clip_t", ".sa_text_title"
  ]);
  if (!title) {
    title = textOfNodeWithoutSelectors(linkNode, [
      ".cni_time", ".sa_text_datetime", "time", ".date", ".sa_text_press",
      ".sh_text_press", ".cn_name", ".cc_channel_t", ".blind", ".sa_text_lede"
    ]);
  }
  title = cleanPageTitle(title);
  if (!title || title.length < 4 || /^(?:닫기|더보기|기사 더보기)$/.test(title) ||
      /^\d{1,2}월\s*\d{1,2}일(?:\s+(?:오전|오후)?\s*\d{1,2}:\d{2})?$/.test(title) ||
      /^\d{1,2}:\d{2}$/.test(title) || /^\d+\s*(?:초|분|시간|일)\s*전$/.test(title)) return null;

  var author = naverNewsFieldText(row, [".sa_text_press", ".sh_text_press", ".cn_name"]);
  var date = naverNewsDate(row, [".cni_time", ".sa_text_datetime", "time", ".date"]);
  var mediaUrl = imageUrlFromNode(firstNode(row, ["img[data-src]", "img[src]"]), baseUrl);
  return {
    id: "naver_news:" + key,
    link: link,
    title: title,
    author: author || "네이버 뉴스",
    avatar: "",
    date: date,
    category: "",
    commentCount: "",
    viewCount: 0,
    likeCount: "",
    mediaUrl: mediaUrl,
    mediaType: mediaUrl ? "image" : "",
    types: [],
    menus: [],
    hotCount: 0,
    coldCount: 0
  };
}

SITE.matchBoard = function (urlInfo) {
  var parts = pathSegments(urlInfo.path);
  if (urlInfo.path === "/" || urlInfo.path === "" || urlInfo.path === "/index.html") {
    return { board: boardById("headline"), page: 1 };
  }
  if (parts.length >= 2 && parts[0] === "section") {
    var sid = parts[1];
    var sidMap = {
      "100": "politics",
      "101": "economy",
      "102": "society",
      "103": "culture",
      "104": "world",
      "105": "it"
    };
    var bId = sidMap[sid] || sid;
    var b = boardById(bId);
    if (b) return { board: b, page: 1 };
  }
  for (var i = 0; i < SITE.boards.length; i++) {
    if (urlInfo.path === "/" + SITE.boards[i].id) {
      return { board: SITE.boards[i], page: 1 };
    }
  }
  return null;
};

SITE.matchPost = function (urlInfo) {
  var parts = String(urlInfo.path || "").match(/^\/(?:mnews\/(?:hotissue\/)?)?article\/(\d+)\/(\d+)(?:\/|$)/);
  return parts ? {
    board: boardById("headline"),
    postId: parts[1] + "_" + parts[2],
    oid: parts[1],
    aid: parts[2]
  } : null;
};

SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
  return "";
};

SITE.parseBoardItemsCustom = function (doc, baseUrl, match, boardPage) {
  var hints = {};
  var pressByArticle = {};
  var pressByOffice = {};
  var avatarByOffice = {};
  var images = doc.querySelectorAll("img");
  for (var p = 0; p < images.length; p++) {
    var imageUrl = imageUrlFromNode(images[p], baseUrl);
    var office = imageUrl.match(/\/office_logo\/(\d+)\//);
    if (office && !avatarByOffice[office[1]]) avatarByOffice[office[1]] = imageUrl;
  }
  var rowSelectors = [
    ".sa_item", ".sa_item_flex", ".sh_item", ".cni_news_item",
    ".cc_clip_item", "a.cnf_news_area", "a.cjs_nf_a"
  ];
  // Collect metadata from every card family, without depending on parent traversal.
  for (var k = 0; k < rowSelectors.length; k++) {
    var rows = doc.querySelectorAll(rowSelectors[k]);
    for (var i = 0; i < rows.length; i++) {
      var item = extractListItem(rows[i], baseUrl);
      if (!item) continue;
      var key = naverNewsItemKey(item.link);
      if (!hints[key]) hints[key] = item;
      else {
        // A headline can reappear in the dated article list further down the page.
        if (!hints[key].date && item.date) hints[key].date = item.date;
        if (!hints[key].mediaUrl && item.mediaUrl) {
          hints[key].mediaUrl = item.mediaUrl;
          hints[key].mediaType = item.mediaType;
        }
        if (hints[key].author === "네이버 뉴스" && item.author !== "네이버 뉴스") hints[key].author = item.author;
      }
      if (item.author !== "네이버 뉴스") {
        pressByArticle[key] = item.author;
        pressByOffice[naverNewsArticleParts(item.link)[1]] = item.author;
      }
    }
  }
  var groups = [
    { selector: ".cni_issue_item", press: [".cni_channel"] },
    { selector: ".comp_news_feed", press: [".cnf_journal_name"] }
  ];
  for (var g = 0; g < groups.length; g++) {
    var containers = doc.querySelectorAll(groups[g].selector);
    for (var c = 0; c < containers.length; c++) {
      var press = naverNewsFieldText(containers[c], groups[g].press);
      if (!press) continue;
      var articles = containers[c].querySelectorAll("a[href]");
      for (var a = 0; a < articles.length; a++) {
        var parts = naverNewsArticleParts(attrOf(articles[a], "href"));
        if (!parts) continue;
        pressByArticle[parts[1] + ":" + parts[2]] = press;
        pressByOffice[parts[1]] = press;
      }
    }
  }

  // Walk links in document order; image/date-only duplicates cannot mask headlines.
  var links = doc.querySelectorAll("a[href]");
  var items = [];
  var seen = {};
  for (var j = 0; j < links.length; j++) {
    var key = naverNewsItemKey(attrOf(links[j], "href"));
    if (!key || seen[key]) continue;
    var item = hints[key] || extractListItem(links[j], baseUrl);
    if (!item) continue;
    if (item.author === "네이버 뉴스") {
      item.author = pressByArticle[key] || pressByOffice[naverNewsArticleParts(item.link)[1]] || item.author;
    }
    item.avatar = avatarByOffice[naverNewsArticleParts(item.link)[1]] || "";
    seen[key] = true;
    items.push(item);
  }
  return items;
};

var NAVER_NEWS_BROWSER_BUTTON = "웹브라우저에서 보기";

function naverNewsArticleUrl(url, doc) {
  var canonical = doc && doc.querySelector ? doc.querySelector("link[rel='canonical']") : null;
  var candidates = [canonical ? canonical.getAttribute("href") : "", url || ""];
  for (var i = 0; i < candidates.length; i++) {
    var match = String(candidates[i] || "").match(/article\/(\d+)\/(\d+)/);
    if (match) return "https://n.news.naver.com/mnews/article/" + match[1] + "/" + match[2];
  }
  return String(url || "");
}

function naverNewsOriginalArticleUrl(doc) {
  if (!doc) return "";
  var node = firstNode(doc, [
    "a.media_end_head_origin_link[href]",
    "a[data-nlog-area='content.press_original.article'][href]",
    "a[data-clk='are.ori'][href]"
  ]);
  var url = String(node ? node.getAttribute("href") || "" : "").trim();
  if (url.indexOf("//") === 0) url = "https:" + url;
  return /^https?:\/\/[^/?#\s]+(?:[/?#]|$)/i.test(url) ? url : "";
}

SITE.filterPostContent = function (details, postUrl, doc) {
  var referer = naverNewsArticleUrl(postUrl, doc);
  for (var i = 0; i < (details || []).length; i++) {
    var item = details[i];
    if (!item || (item.type !== "image" && item.type !== "video")) continue;
    var headers = {};
    var previous = item.headers || {};
    for (var key in previous) {
      if (Object.prototype.hasOwnProperty.call(previous, key) && key.toLowerCase() !== "referer") {
        headers[key] = previous[key];
      }
    }
    headers.Referer = referer;
    item.headers = headers;
  }
  return details;
};

SITE.preparePostContext = function (context, match, url, doc) {
  context.sourceUrl = naverNewsArticleUrl(url, doc);
  context.originalUrl = naverNewsOriginalArticleUrl(doc);
  if (doc) {
    var journalist = naverNewsFieldText(doc, [".media_end_head_journalist_name"]);
    var pressLogo = firstNode(doc, [".media_end_head_top_logo img"]);
    context.articleAuthor = journalist || naverNewsFieldText(doc, [".media_end_head_top_press"]) || attrOf(pressLogo, "alt");
    context.articleAvatar = imageUrlFromNode(journalist ? firstNode(doc, [".media_end_head_journalist_thumb img"]) : pressLogo, url);
    context.articleDate = naverNewsPublishedDate(doc);
  }
  return context;
};

function naverNewsDecoratePostRoute(route) {
  if (!route || !route.viewData || route.viewData.view !== "/views/post") return route;
  var models = route.viewData.models || (route.viewData.models = {});
  var context = route.context || {};
  models.category = "";
  if (context.articleAuthor) models.author = context.articleAuthor;
  if (Object.prototype.hasOwnProperty.call(context, "articleAvatar")) models.avatar = context.articleAvatar;
  models.date = naverNewsDisplayDate(context.articleDate || models.date);
  var comments = listFromDetails(models.comments);
  for (var i = 0; i < comments.length; i++) comments[i].date = naverNewsDisplayDate(comments[i].date);
  models.comments = comments;
  var buttons = listFromDetails(models.buttons).slice();
  if (buttons.indexOf(NAVER_NEWS_BROWSER_BUTTON) < 0) buttons.push(NAVER_NEWS_BROWSER_BUTTON);
  models.buttons = buttons;
  var originalUrl = route.context && route.context.originalUrl;
  if (originalUrl) {
    var content = listFromDetails(models.content).slice();
    var first = content[0];
    if (!first || first.type !== "link" || first.link !== originalUrl) {
      content.unshift({ type: "link", value: "기사원문 보기", link: originalUrl });
    }
    models.content = content;
  }
  return route;
}

// Decorate both the loading view and completed routes, including cached/refresh routes.
var naverNewsOriginalPendingPostRoute = createPendingPostRoute;
createPendingPostRoute = function (url, match) {
  return naverNewsDecoratePostRoute(naverNewsOriginalPendingPostRoute(url, match));
};
var naverNewsOriginalPostRoute = routePostWithMatch;
routePostWithMatch = function (url, urlInfo, match, force) {
  return naverNewsDecoratePostRoute(naverNewsOriginalPostRoute(url, urlInfo, match, force));
};

var naverNewsOriginalBoardRoute = routeBoardWithMatch;
routeBoardWithMatch = function (url, urlInfo, match, force) {
  var route = naverNewsOriginalBoardRoute(url, urlInfo, match, force);
  if (route && route.viewData && route.context) {
    route.viewData.styles.pagination = !!(route.context.pendingItems || []).length;
  }
  return route;
};

function naverNewsConnectBoardState(viewId, context) {
  setViewState(viewId, context);
  synura.connect(viewId, context, function (event) {
    handler.onViewEvent(event);
  });
}

var naverNewsOriginalUpdateViewFromRoute = updateViewFromRoute;
updateViewFromRoute = function (viewId, route, snackbar) {
  naverNewsOriginalUpdateViewFromRoute(viewId, route, snackbar);
  if (route && route.kind === "board" && route.context) {
    naverNewsConnectBoardState(viewId, route.context);
  }
};

SITE.parseComments = function (doc, postUrl) {
  try {
    var match = postUrl ? postUrl.match(/article\/(\d+)\/(\d+)/) : null;
    if (!match && doc) {
      var canonical = doc.querySelector("link[rel='canonical']");
      var cUrl = canonical ? canonical.getAttribute("href") : "";
      match = cUrl ? cUrl.match(/article\/(\d+)\/(\d+)/) : null;
    }
    if (!match) return [];

    var oid = match[1];
    var aid = match[2];
    var commentApiUrl = "https://apis.naver.com/commentBox/cbox/web_neo_list_jsonp.json" +
      "?ticket=news&templateId=default_society&pool=cbox5&lang=ko&country=KR" +
      "&objectId=news" + oid + "%2C" + aid +
      "&pageSize=30&page=1&sort=favorite";

    var res = fetch(commentApiUrl, {
      headers: {
        "Referer": naverNewsArticleUrl(postUrl, doc) || "https://n.news.naver.com/",
        "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36"
      }
    });

    if (!res || res.status !== 200) return [];
    var body = res.text().trim();
    if (!body) return [];

    // cbox normally returns _callback(...); also accept plain JSON without eval.
    var wrapped = body.match(/^[\w$.]+\s*\(\s*([\s\S]*)\s*\)\s*;?\s*$/);
    var jsonText = wrapped ? wrapped[1] : body;
    var data = JSON.parse(jsonText);
    if (!data || data.success === false || !data.result || !Array.isArray(data.result.commentList)) return [];

    var commentList = data.result.commentList;
    var out = [];
    var seen = {};
    for (var i = 0; i < commentList.length; i++) {
      var c = commentList[i];
      if (!c || typeof c.contents !== "string" || !c.contents.trim() || c.visible === false ||
          c.deleted === true || c.blind === true || c.hiddenByCleanbot === true ||
          c.hiddenByKeyword === true || c.userBlocked === true) continue;
      if (c.commentNo && seen[c.commentNo]) continue;
      if (c.commentNo) seen[c.commentNo] = true;

      var author = c.userName || c.maskedUserId || "익명";
      var dateStr = naverNewsDisplayDate(c.modTime || c.regTime);
      var isReply = !!(c.parentCommentNo && String(c.parentCommentNo) !== "0" &&
        String(c.parentCommentNo) !== String(c.commentNo));
      var sympathy = parseInt(String(c.sympathyCount || 0), 10) || 0;
      var antipathy = parseInt(String(c.antipathyCount || 0), 10) || 0;

      out.push({
        id: "naver_news:cmt:" + (c.commentNo || i),
        link: postUrl + "#c_" + (c.commentNo || i),
        author: author,
        avatar: c.userProfileImage || "",
        date: dateStr,
        content: [{ type: "text", value: c.contents }],
        likeCount: sympathy > 0 ? String(sympathy) : "",
        dislikeCount: antipathy > 0 ? String(antipathy) : "",
        level: isReply ? 1 : 0,
        hotCount: sympathy,
        coldCount: antipathy
      });
    }
    return out;
  } catch (e) {
    console.log("Naver News comments fetch failed: " + e);
    return [];
  }
};

SITE.buildPostFetchUrls = function (match, currentUrl) {
  var urls = [currentUrl];
  if (match && match.oid && match.aid) {
    urls.push("https://n.news.naver.com/mnews/article/" + match.oid + "/" + match.aid);
    urls.push("https://news.naver.com/article/" + match.oid + "/" + match.aid);
  }
  return urls;
};

SITE.buildBoardUrlFromId = function (boardId) {
  var b = boardById(boardId);
  return b ? b.url : "";
};

SITE.prepareBoardContext = function (context, items, match, url) {
  context.pendingItems = items.splice(NAVER_NEWS_PAGE_SIZE);
  context.nextUrl = context.pendingItems.length ? url : "";
  context.seenLinks = items.map(function (item) { return item.link; });
  naverNewsFillListMetadata(items);
  return context;
};

SITE.filterAppendItems = function (items, state, routeContext) {
  return items;
};

SITE.updateAppendState = function (state, items, routeContext) {
  return state;
};

SITE.buildHomeMenus = function (menus, isReorderable) {
  return menus;
};

var naverNewsOriginalHomeItems = buildHomeItems;
buildHomeItems = function (entries) {
  var items = naverNewsOriginalHomeItems(entries);
  for (var i = 0; i < items.length; i++) {
    items[i].category = "";
    items[i].types = [];
  }
  return items;
};

var naverNewsOriginalCategoryBoardItem = buildCategoryBoardItem;
buildCategoryBoardItem = function (board, visibleMap, titleOverride) {
  var item = naverNewsOriginalCategoryBoardItem(board, visibleMap, titleOverride);
  item.category = "";
  item.types = [];
  return item;
};

var naverNewsOriginalCategoryGroupItem = buildCategoryGroupItem;
buildCategoryGroupItem = function (node, tree) {
  var item = naverNewsOriginalCategoryGroupItem(node, tree);
  item.types = [];
  return item;
};

var naverNewsOriginalBoardSettingsRootItems = buildBoardSettingsRootItems;
buildBoardSettingsRootItems = function () {
  var items = naverNewsOriginalBoardSettingsRootItems();
  for (var i = 0; i < items.length; i++) items[i].types = [];
  return items;
};

SITE.buildBoardSettingsRootMenus = function (menus, state) {
  return menus;
};

SITE.buildBoardMenus = function (menus, state) {
  return menus;
};

SITE.buildPostMenus = function (menus, state) {
  return menus;
};

SITE.routeBoardCustom = function (url, urlInfo, match, force) {
  return null;
};

SITE.routePostCustom = function (url, urlInfo, match, force) {
  return null;
};

SITE.fetchPostComments = function (match, url, doc, page, comments) {
  return comments || [];
};

SITE.handleViewEvent = function (viewId, event, state, context) {
  var current = state && state.kind ? state : context || {};
  if (current.kind === "board" && event &&
      (event.eventId === "SCROLL_TO_END" || event.eventId === "APPEND")) {
    var pending = current.pendingItems || [];
    var nextItems = pending.slice(0, NAVER_NEWS_PAGE_SIZE);
    naverNewsFillListMetadata(nextItems);
    current.pendingItems = pending.slice(nextItems.length);
    current.nextUrl = current.pendingItems.length ? current.link : "";
    current.page = (current.page || 1) + (nextItems.length ? 1 : 0);
    current.seenLinks = (current.seenLinks || []).concat(nextItems.map(function (item) { return item.link; }));
    naverNewsConnectBoardState(viewId, current);
    synura.update(viewId, {
      styles: { pagination: !!current.pendingItems.length },
      models: nextItems.length ? { append: nextItems } : { snackbar: communityMessage("noMorePosts") }
    });
    return true;
  }
  if (current.kind === "post" && event && event.data &&
      ((event.eventId === "SUBMIT" && event.data.button === NAVER_NEWS_BROWSER_BUTTON) ||
       (event.eventId === "MENU_CLICK" && event.data.menu === MENU_BROWSER))) {
    synura.open({
      view: "/views/browser",
      styles: { title: current.title || SITE.displayName },
      models: { url: current.sourceUrl || naverNewsArticleUrl(current.link) }
    });
    return true;
  }
  return false;
};

SITE.handleBoardSettingsRootEvent = function (viewId, event, state) {
  return false;
};

var SYNURA = {
  domain: "news.naver.com",
  host_permissions: [
    "*://*.naver.com/*",
    "*://news.naver.com/*",
    "*://n.news.naver.com/*",
    "*://m.news.naver.com/*"
  ],
  name: "naver_news",
  author: "Synura Team",
  description: "news.naver.com",
  version: 0.1, // Intentionally pinned at 0.1.
  api: 0,
  license: "Apache-2.0",
  locale: "ko_KR",
  icon: "https://www.naver.com/favicon.ico",
  bypass: "chrome/android",
  deeplink: true,
  tags: [
    "news",
    "korea",
    "naver",
    "media"
  ],
  main: null
};
