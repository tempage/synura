// @ts-nocheck
// =============================================================================
// geeknews.js - Synura Extension for GeekNews
// =============================================================================

var SYNURA = {
    domain: "news.hada.io",
    name: "geeknews",
    author: "Synura Team",
    description: "Unofficial GeekNews extension with feeds, topics, and comments.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    icon: "https://news.hada.io/favicon.ico",
    locale: "ko_KR",
    bypass: "chrome/android",
    deeplink: true,
    get main() { return handler; }
};

var GN_ORIGIN = "https://" + SYNURA.domain;
var GN_HEADERS = {
    "User-Agent": "Synura/1.0"
};
var MENU_OPEN_GN = "브라우저로 보기";
var MENU_OPEN_ARTICLE = "원문 열기";
var MENU_GO = "Go";
var MENU_USER_TOPICS = "작성글";
var MENU_USER_COMMENTS = "댓글";
var BUTTON_REFRESH = "새로고침";
var BUTTON_GO = "Go";
var MENU_BACK_YEAR = "일년전";
var MENU_BACK_MONTH = "한달전";
var MENU_BACK_WEEK = "일주일전";
var MENU_BACK_DAY = "하루전";
var MENU_FORWARD_DAY = "다음날";
var MENU_FORWARD_WEEK = "다음주";
var MENU_FORWARD_MONTH = "다음달";
var MENU_FORWARD_YEAR = "일년후";
var PAST_NAV_MENU_ORDER = [
    MENU_BACK_YEAR,
    MENU_BACK_MONTH,
    MENU_BACK_WEEK,
    MENU_BACK_DAY,
    MENU_FORWARD_DAY,
    MENU_FORWARD_WEEK,
    MENU_FORWARD_MONTH,
    MENU_FORWARD_YEAR
];

var feeds = [
    { id: "top", title: "인기글", path: "", kind: "topics", description: "GeekNews 첫 화면" },
    { id: "new", title: "최신글", path: "new", kind: "topics", description: "시간순 최신 글" },
    { id: "past", title: "예전글", path: "past", kind: "topics", description: "지난 날짜 글" },
    { id: "comments", title: "댓글", path: "comments", kind: "comments", description: "최신 댓글" },
    { id: "ask", title: "Ask", path: "ask", kind: "topics", description: "질문과 토론" },
    { id: "show", title: "Show", path: "show", kind: "topics", description: "프로젝트 소개" },
    { id: "plus", title: "GN+", path: "plus", kind: "topics", description: "GN+ 기술 뉴스" }
];

var viewState = new Map();

var getParams = function(viewId) {
    var key = String(viewId);
    if (!viewState.has(key)) viewState.set(key, {});
    return viewState.get(key);
};

var setParams = function(viewId, params) {
    var key = String(viewId);
    var current = getParams(key);
    var next = {};
    var k;
    for (k in current) next[k] = current[k];
    for (k in params) next[k] = params[k];
    viewState.set(key, next);
};

var normalizeWhitespace = function(value) {
    return String(value == null ? "" : value)
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

var textOf = function(node) {
    if (!node) return "";
    return normalizeWhitespace(node.textContent || node.innerText || node.text || "");
};

var attrOf = function(node, name) {
    if (!node || !node.getAttribute) return "";
    return normalizeWhitespace(node.getAttribute(name) || "");
};

var parseIntText = function(value) {
    var cleaned = String(value == null ? "" : value).replace(/[^0-9-]/g, "");
    if (!cleaned) return null;
    var parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? null : parsed;
};

var formatCount = function(value) {
    if (value === null || value === undefined || value === "") return "";
    var num = typeof value === "number" ? value : parseIntText(value);
    if (num === null || isNaN(num)) return "";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return String(num);
};

var stripHash = function(url) {
    return String(url || "").split("#")[0];
};

var hostOf = function(url) {
    var match = String(url || "").match(/^https?:\/\/([^\/?#]+)/i);
    return match ? match[1].toLowerCase() : "";
};

var pathAndQueryOf = function(url) {
    var text = stripHash(url);
    var match = text.match(/^https?:\/\/[^\/?#]+(\/[^#]*)?$/i);
    return match ? (match[1] || "/") : text;
};

var hostFromUrl = function(url) {
    return hostOf(url).replace(/^www\./, "");
};

var ensureAbsoluteUrl = function(value, baseUrl) {
    var raw = normalizeWhitespace(value);
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.indexOf("//") === 0) return "https:" + raw;
    if (raw.charAt(0) === "/") return GN_ORIGIN + raw;
    if (raw.charAt(0) === "?" && baseUrl) return stripHash(baseUrl).split("?")[0] + raw;
    return GN_ORIGIN + "/" + raw.replace(/^\/+/, "");
};

var isGNUrl = function(url) {
    return hostOf(url) === SYNURA.domain;
};

var queryValueFromUrl = function(url, name) {
    var query = String(pathAndQueryOf(url) || "").split("?")[1] || "";
    var parts = query.split("&");
    for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].split("=");
        if (pair.length === 0) continue;
        var key = "";
        try {
            key = decodeURIComponent(String(pair[0] || "").replace(/\+/g, " "));
        } catch (e) {
            key = String(pair[0] || "");
        }
        if (key !== name) continue;
        try {
            return decodeURIComponent(String(pair.slice(1).join("=") || "").replace(/\+/g, " "));
        } catch (e2) {
            return String(pair.slice(1).join("=") || "");
        }
    }
    return "";
};

var gnPathFromUrl = function(url) {
    var path = pathAndQueryOf(url).split("?")[0].replace(/^\/+|\/+$/g, "");
    return path || "";
};

var topicIdFromUrl = function(url) {
    var path = gnPathFromUrl(url);
    if (path === "topic") {
        var queryId = queryValueFromUrl(url, "id");
        return /^[0-9]+$/.test(queryId) ? queryId : "";
    }
    var pathMatch = String(pathAndQueryOf(url) || "").match(/^\/?topic\/([0-9]+)(?:\D|$)/);
    return pathMatch ? pathMatch[1] : "";
};

var commentIdFromUrl = function(url) {
    var hashMatch = String(url || "").match(/#(?:c_|cid)([0-9]+)/);
    if (hashMatch) return hashMatch[1];
    var queryMatch = String(url || "").match(/[?&]id=([0-9]+)/);
    if (queryMatch) return queryMatch[1];
    return "";
};

var commentTargetIdFromUrl = function(url) {
    var match = String(url || "").match(/#(?:c_|cid)([0-9]+)/);
    return match ? match[1] : "";
};

var commentAnchorForId = function(commentId) {
    return commentId ? "c_" + String(commentId) : "";
};

var userIdFromUrl = function(url) {
    var normalized = normalizeWhitespace(url);
    var queryUser = queryValueFromUrl(normalized, "userid") || queryValueFromUrl(normalized, "id");
    if (queryUser) return queryUser;

    var path = gnPathFromUrl(normalized);
    if (path.charAt(0) === "@") return decodeURIComponent(path.substring(1));
    var userMatch = path.match(/^user\/([^\/?#]+)/);
    if (userMatch) return decodeURIComponent(userMatch[1]);
    return "";
};

var topicIdFromNode = function(node) {
    var id = attrOf(node, "data-topic-state-id");
    if (id) return id;

    var links = node ? node.querySelectorAll("a") : [];
    for (var i = 0; i < links.length; i++) {
        var linkId = topicIdFromUrl(attrOf(links[i], "href"));
        if (linkId) return linkId;
    }

    var idNodes = node ? node.querySelectorAll("[id]") : [];
    for (var j = 0; j < idNodes.length; j++) {
        var attrId = attrOf(idNodes[j], "id");
        var match = attrId.match(/(?:vote|tp|dead|unvote)([0-9]+)/);
        if (match) return match[1];
    }
    return "";
};

var commentIdFromNode = function(node) {
    var id = attrOf(node, "data-comment-state-id");
    if (id) return id;
    var domId = attrOf(node, "id");
    var match = domId.match(/^cid([0-9]+)/);
    if (match) return match[1];
    var links = node ? node.querySelectorAll("a") : [];
    for (var i = 0; i < links.length; i++) {
        var href = attrOf(links[i], "href");
        if (gnPathFromUrl(ensureAbsoluteUrl(href, GN_ORIGIN + "/")) === "comment") {
            var linkId = commentIdFromUrl(href);
            if (linkId) return linkId;
        }
    }
    return "";
};

var discussionUrlForId = function(id) {
    return GN_ORIGIN + "/topic?id=" + encodeURIComponent(String(id || ""));
};

var commentUrlForId = function(postUrl, commentId) {
    var normalized = normalizeGNUrl(postUrl) || GN_ORIGIN + "/";
    return stripHash(normalized) + "#" + commentAnchorForId(commentId);
};

var userUrlForId = function(userId) {
    return GN_ORIGIN + "/@" + encodeURIComponent(String(userId || ""));
};

var userActivityUrl = function(kind, userId) {
    var path = kind === "comments" ? "comments" : "topics";
    return GN_ORIGIN + "/" + path + "?userid=" + encodeURIComponent(String(userId || ""));
};

var userActivityTitle = function(kind, userId) {
    if (kind === "comments") return userId + " 댓글";
    return userId + " 작성글";
};

var userActivityKindForMenu = function(menu) {
    if (menu === MENU_USER_TOPICS) return "topics";
    if (menu === MENU_USER_COMMENTS) return "comments";
    return "";
};

var isUserActivityKind = function(kind) {
    return kind === "topics" || kind === "comments";
};

var normalizeGNUrl = function(url) {
    var normalized = ensureAbsoluteUrl(url || GN_ORIGIN + "/", GN_ORIGIN + "/");
    if (!isGNUrl(normalized)) return "";
    return normalized;
};

var goUrlFromInput = function(value) {
    var raw = normalizeWhitespace(value);
    if (!raw) return "";
    if (/^news\.hada\.io(?:[\/?#]|$)/i.test(raw)) raw = "https://" + raw;

    var topicMatch = raw.match(/^([0-9]+)(#(?:c_|cid)?[0-9]+)?$/);
    if (topicMatch) {
        var suffix = "";
        if (topicMatch[2]) {
            var commentMatch = topicMatch[2].match(/^#(?:c_|cid)?([0-9]+)$/);
            suffix = commentMatch ? "#" + commentAnchorForId(commentMatch[1]) : topicMatch[2];
        }
        return discussionUrlForId(topicMatch[1]) + suffix;
    }

    return normalizeGNUrl(raw);
};

var findFeed = function(id) {
    for (var i = 0; i < feeds.length; i++) {
        if (feeds[i].id === id || feeds[i].path === id) return feeds[i];
    }
    return feeds[0];
};

var feedUrl = function(feed) {
    var path = feed && feed.path ? feed.path : "";
    return path ? GN_ORIGIN + "/" + path : GN_ORIGIN + "/";
};

var feedForUrl = function(url) {
    var normalized = normalizeGNUrl(url);
    if (!normalized) return null;
    var path = gnPathFromUrl(normalized);
    for (var i = 0; i < feeds.length; i++) {
        if (feeds[i].path === path || feeds[i].id === path) return feeds[i];
    }
    return null;
};

var isPastFeed = function(feed) {
    return !!feed && (feed.id === "past" || feed.path === "past");
};

var buildHomeItems = function() {
    return feeds.map(function(feed) {
        return {
            id: feed.id,
            title: feed.title,
            memo: "GN",
            author: feed.description,
            date: "",
            commentCount: "",
            likeCount: "",
            hotCount: 0,
            coldCount: 0
        };
    });
};

var buildFeedMenus = function(pastNavLinks) {
    var menus = [];
    var nav = pastNavLinks || {};
    var used = {};
    for (var i = 0; i < PAST_NAV_MENU_ORDER.length; i++) {
        var label = PAST_NAV_MENU_ORDER[i];
        if (nav[label]) {
            menus.push(label);
            used[label] = true;
        }
    }
    for (var key in nav) {
        if (!used[key]) menus.push(key);
    }
    menus.push(MENU_OPEN_GN);
    return menus;
};

var pastDayFromUrl = function(url) {
    var match = String(url || "").match(/[?&]day=([0-9]{4}-[0-9]{2}-[0-9]{2})/);
    return match ? match[1] : "";
};

var pastDayFromDocument = function(doc, url) {
    var fromUrl = pastDayFromUrl(url);
    if (fromUrl) return fromUrl;

    var day = textOf(doc ? doc.querySelector(".pastnav .bold") : null);
    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(day)) return day;

    var title = textOf(doc ? doc.querySelector("title") : null);
    var fromTitle = title.match(/([0-9]{4}-[0-9]{2}-[0-9]{2})/);
    return fromTitle ? fromTitle[1] : "";
};

var parsePastNavLinks = function(doc, baseUrl) {
    var links = doc ? doc.querySelectorAll(".pastnav a") : [];
    var nav = {};
    for (var i = 0; i < links.length; i++) {
        var label = textOf(links[i]);
        var href = ensureAbsoluteUrl(attrOf(links[i], "href"), baseUrl);
        if (!label || !href || !isGNUrl(href)) continue;
        if (gnPathFromUrl(href) !== "past") continue;
        nav[label] = href;
    }
    return nav;
};

var queryFromEvent = function(event) {
    var data = event ? event.data : null;
    if (typeof data === "string") return normalizeWhitespace(data);
    if (!data || typeof data !== "object") return "";
    return normalizeWhitespace(
        data.query !== undefined ? data.query :
        data.value !== undefined ? data.value :
        data.text !== undefined ? data.text :
        data.keyword !== undefined ? data.keyword :
        data.q !== undefined ? data.q : ""
    );
};

var normalizePastDayQuery = function(value) {
    var day = normalizeWhitespace(value);
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(day)) return "";

    var parsed = new Date(day + "T00:00:00Z");
    if (isNaN(parsed.getTime())) return "";

    var yyyy = String(parsed.getUTCFullYear());
    var mm = String(parsed.getUTCMonth() + 1);
    var dd = String(parsed.getUTCDate());
    if (mm.length < 2) mm = "0" + mm;
    if (dd.length < 2) dd = "0" + dd;

    var normalized = yyyy + "-" + mm + "-" + dd;
    return normalized === day ? day : "";
};

var pastUrlForDay = function(day) {
    return GN_ORIGIN + "/past?day=" + encodeURIComponent(day);
};

var parseCommentCount = function(text) {
    var normalized = normalizeWhitespace(text);
    if (!normalized || normalized.indexOf("댓글과 토론") >= 0) return 0;
    var parsed = parseIntText(normalized);
    return parsed === null ? 0 : parsed;
};

var normalizeStoryTitle = function(title) {
    var normalized = normalizeWhitespace(title);
    var prefixes = [
        { pattern: /^Show GN:\s*/i, category: "SH" },
        { pattern: /^Ask GN:\s*/i, category: "AH" },
        { pattern: /^GN\+:\s*/i, category: "GN+" },
        { pattern: /^GN⁺:\s*/i, category: "GN+" }
    ];
    for (var i = 0; i < prefixes.length; i++) {
        var withoutPrefix = normalized.replace(prefixes[i].pattern, "");
        if (withoutPrefix !== normalized) {
            return {
                title: withoutPrefix || normalized,
                category: prefixes[i].category
            };
        }
    }
    return { title: normalized, category: "" };
};

var titleAnchorFromTopic = function(node) {
    if (!node) return null;
    var links = node.querySelectorAll(".topictitle a");
    for (var i = 0; i < links.length; i++) {
        if (links[i].querySelector && links[i].querySelector("h1")) return links[i];
    }
    return links.length > 0 ? links[0] : null;
};

var authorFromInfo = function(info) {
    var links = info ? info.querySelectorAll("a") : [];
    for (var i = 0; i < links.length; i++) {
        var href = attrOf(links[i], "href");
        if (href.indexOf("/@") === 0 || href.indexOf("/user/") === 0) return textOf(links[i]);
    }
    return "";
};

var dateFromTopicInfo = function(info, author) {
    var text = textOf(info);
    if (!text) return "";
    var beforePipe = text.split("|")[0];
    if (author) {
        var idx = beforePipe.indexOf(author);
        if (idx >= 0) return normalizeWhitespace(beforePipe.substring(idx + author.length));
    }
    return normalizeWhitespace(beforePipe.replace(/^[0-9,]+\s*P?oints?\s+by\s+/i, ""));
};

var commentCountFromTopicInfo = function(info) {
    var links = info ? info.querySelectorAll("a") : [];
    for (var i = links.length - 1; i >= 0; i--) {
        var label = textOf(links[i]);
        if (label.indexOf("댓글") >= 0) return parseCommentCount(label);
    }
    var countNode = info ? info.querySelector("[data-topic-comment-count]") : null;
    var raw = attrOf(countNode, "data-topic-comment-count");
    return raw ? parseIntText(raw) : null;
};

var parseTopicNode = function(node, baseUrl) {
    if (!node) return null;
    var id = topicIdFromNode(node);
    if (!id) return null;

    var titleAnchor = titleAnchorFromTopic(node);
    var titleText = textOf(titleAnchor ? titleAnchor.querySelector("h1") : null) || textOf(titleAnchor);
    var parsedTitle = normalizeStoryTitle(titleText);
    if (!parsedTitle.title) return null;

    var rawTarget = attrOf(titleAnchor, "href");
    var targetUrl = ensureAbsoluteUrl(rawTarget, baseUrl);
    var discussionUrl = discussionUrlForId(id);
    var targetTopicId = topicIdFromUrl(targetUrl);
    var externalUrl = "";
    if (targetUrl && (!isGNUrl(targetUrl) || (!targetTopicId && gnPathFromUrl(targetUrl) !== "topic"))) {
        externalUrl = targetUrl;
    }

    var info = node.querySelector(".topicinfo");
    var score = parseIntText(textOf(info ? info.querySelector("[id^='tp']") : null));
    var author = authorFromInfo(info);
    var date = dateFromTopicInfo(info, author);
    var commentCount = commentCountFromTopicInfo(info);

    var site = textOf(node.querySelector(".topicurl")).replace(/^\(|\)$/g, "");
    if (!site && externalUrl) site = hostFromUrl(externalUrl);
    if (!site) site = "GN";

    var story = {
        id: id,
        link: discussionUrl,
        externalUrl: externalUrl,
        title: parsedTitle.title,
        author: author,
        avatar: "",
        date: date,
        memo: site,
        likeCount: score === null ? "" : formatCount(score),
        dislikeCount: "",
        commentCount: commentCount === null ? "" : formatCount(commentCount),
        viewCount: "",
        menus: [],
        hotCount: score || 0,
        coldCount: 0
    };
    if (parsedTitle.category) story.category = parsedTitle.category;
    return story;
};

var fetchDocument = function(url) {
    var normalized = normalizeGNUrl(url);
    if (!normalized) throw new Error("지원하지 않는 GeekNews URL입니다");

    console.log("Fetching:", normalized);
    var options = { headers: GN_HEADERS };
    if (SYNURA.bypass) options.bypass = SYNURA.bypass;
    var response = fetch(normalized, options);
    if (!response || !response.ok) {
        throw new Error("GeekNews를 불러오지 못했습니다: " + normalized + " (" + (response ? response.status : 0) + ")");
    }
    return response.dom("text/html");
};

var parseContentNode = function(node) {
    if (!node) return [];
    try {
        var parsed = synura.parse("post", node);
        if (parsed && parsed.length > 0) return parsed;
    } catch (e) {
        console.log("parseContentNode failed:", e);
    }

    var text = textOf(node);
    return text ? [{ type: "text", value: text }] : [];
};

var topicLinkFromCommentInfo = function(info, baseUrl) {
    var links = info ? info.querySelectorAll("a") : [];
    var fallback = null;
    for (var i = 0; i < links.length; i++) {
        var href = ensureAbsoluteUrl(attrOf(links[i], "href"), baseUrl);
        if (!topicIdFromUrl(href)) continue;
        var label = textOf(links[i]);
        var item = { url: href, title: label };
        if (label !== "parent") return item;
        fallback = item;
    }
    return fallback;
};

var dateFromCommentInfo = function(info) {
    var links = info ? info.querySelectorAll("a") : [];
    for (var i = 0; i < links.length; i++) {
        var href = attrOf(links[i], "href");
        if (gnPathFromUrl(ensureAbsoluteUrl(href, GN_ORIGIN + "/")) === "comment") return textOf(links[i]);
    }
    return "";
};

var parsePostComments = function(doc, baseUrl) {
    var rows = doc ? doc.querySelectorAll("#comment_thread .comment_row") : [];
    var comments = [];

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var id = commentIdFromNode(row);
        var info = row.querySelector(".commentinfo");
        var author = authorFromInfo(info) || "[deleted]";
        var date = dateFromCommentInfo(info);
        var body = row.querySelector(".comment_contents");
        var content = parseContentNode(body);
        if (content.length === 0) content.push({ type: "text", value: "[empty]" });
        if (id) content.unshift({ type: "anchor", value: commentAnchorForId(id) });

        var style = attrOf(row, "style");
        var depthMatch = style.match(/--depth\s*:\s*([0-9]+)/);
        var level = depthMatch ? parseInt(depthMatch[1], 10) : 0;

        comments.push({
            id: id,
            link: id ? commentUrlForId(baseUrl, id) : baseUrl,
            author: author,
            avatar: "",
            content: content,
            date: date,
            likeCount: "",
            dislikeCount: "",
            level: level || 0,
            menus: [MENU_OPEN_GN],
            hotCount: 0,
            coldCount: 0
        });
    }

    return comments;
};

var truncateText = function(value, maxLength) {
    var text = normalizeWhitespace(value);
    var limit = maxLength || 180;
    if (text.length <= limit) return text;
    return text.substring(0, limit - 3) + "...";
};

var parseCommentListItem = function(row, baseUrl, userId) {
    if (!row) return null;
    var id = commentIdFromNode(row);
    if (!id) return null;

    var info = row.querySelector(".commentinfo");
    var author = authorFromInfo(info);
    if (userId && author !== userId) return null;

    var date = dateFromCommentInfo(info);
    var body = row.querySelector(".comment_contents");
    var bodyText = textOf(body);
    var topic = topicLinkFromCommentInfo(info, baseUrl);
    var link = topic && topic.url ? commentUrlForId(topic.url, id) : GN_ORIGIN + "/comment?id=" + encodeURIComponent(id);

    return {
        id: id,
        link: link,
        externalUrl: topic && topic.url ? topic.url : "",
        title: truncateText(bodyText || "(빈 댓글)", 180),
        author: author,
        avatar: "",
        date: date,
        memo: topic && topic.title ? ("on " + topic.title) : "댓글",
        likeCount: "",
        dislikeCount: "",
        commentCount: "",
        viewCount: "",
        menus: [],
        hotCount: 0,
        coldCount: 0
    };
};

var fetchFeed = function(url) {
    var normalized = normalizeGNUrl(url);
    var doc = fetchDocument(normalized);
    var feed = feedForUrl(normalized) || feeds[0];
    var items = [];
    var seen = {};

    if (feed.kind === "comments") {
        var commentRows = doc.querySelectorAll(".comments .comment_row");
        for (var i = 0; i < commentRows.length; i++) {
            var comment = parseCommentListItem(commentRows[i], normalized, "");
            if (!comment || !comment.link || seen[comment.link]) continue;
            seen[comment.link] = true;
            items.push(comment);
        }
    } else {
        var topicRows = doc.querySelectorAll(".topics .topic_row");
        for (var j = 0; j < topicRows.length; j++) {
            var topic = parseTopicNode(topicRows[j], normalized);
            if (!topic || !topic.link || seen[topic.link]) continue;
            seen[topic.link] = true;
            items.push(topic);
        }
    }

    var moreLink = doc.querySelector(".next a");
    var nextUrl = moreLink ? ensureAbsoluteUrl(attrOf(moreLink, "href"), normalized) : "";
    if (nextUrl && !isGNUrl(nextUrl)) nextUrl = "";

    return {
        items: items,
        nextUrl: nextUrl,
        pastDay: isPastFeed(feed) ? pastDayFromDocument(doc, normalized) : "",
        pastNavLinks: isPastFeed(feed) ? parsePastNavLinks(doc, normalized) : {}
    };
};

var fetchUserProfile = function(userIdOrUrl) {
    var normalized = normalizeGNUrl(userIdOrUrl);
    var userId = "";
    if (normalized && (gnPathFromUrl(normalized).charAt(0) === "@" || gnPathFromUrl(normalized).indexOf("user/") === 0)) {
        userId = userIdFromUrl(normalized);
    } else {
        userId = normalizeWhitespace(userIdOrUrl);
        normalized = userUrlForId(userId);
    }
    if (!userId) throw new Error("GeekNews 사용자 ID가 없습니다");

    var doc = fetchDocument(normalized);
    var root = doc.querySelector("[data-user-profile-root]");
    var profileUserId = attrOf(root, "data-profile-userid") || textOf(doc.querySelector(".profile-userid")) || userId;
    var karma = parseIntText(textOf(doc.querySelector(".profile-meta-value")));
    var joined = "";
    var metaBlocks = doc.querySelectorAll(".profile-meta-block");
    for (var i = 0; i < metaBlocks.length; i++) {
        var metaText = textOf(metaBlocks[i]);
        if (metaText.indexOf("가입일") >= 0) joined = normalizeWhitespace(metaText.replace("가입일", ""));
    }

    var content = parseContentNode(doc.querySelector(".profile-about"));
    if (content.length === 0) content.push({ type: "text", value: "(프로필 내용 없음)" });

    return {
        url: userUrlForId(profileUserId),
        userId: profileUserId,
        styles: {
            title: profileUserId,
            authorClickable: false
        },
        models: {
            link: userUrlForId(profileUserId),
            author: profileUserId,
            avatar: "",
            date: joined,
            memo: "GeekNews user",
            viewCount: "",
            likeCount: karma === null ? "" : formatCount(karma),
            dislikeCount: "",
            commentCount: "",
            content: content,
            comments: [],
            menus: [
                MENU_USER_TOPICS,
                MENU_USER_COMMENTS,
                MENU_OPEN_GN
            ],
            buttons: [BUTTON_REFRESH]
        }
    };
};

var fetchUserActivity = function(url) {
    var normalized = normalizeGNUrl(url);
    if (!normalized) throw new Error("지원하지 않는 GeekNews URL입니다");

    var kind = gnPathFromUrl(normalized);
    if (!isUserActivityKind(kind)) throw new Error("지원하지 않는 사용자 활동 URL입니다");

    var userId = userIdFromUrl(normalized);
    if (!userId) throw new Error("GeekNews 사용자 ID가 없습니다");

    var doc = fetchDocument(normalized);
    var items = [];
    var seen = {};

    if (kind === "comments") {
        var commentRows = doc.querySelectorAll(".comments .comment_row");
        for (var i = 0; i < commentRows.length; i++) {
            var comment = parseCommentListItem(commentRows[i], normalized, userId);
            if (!comment || !comment.link || seen[comment.link]) continue;
            seen[comment.link] = true;
            items.push(comment);
        }
    } else {
        var topicRows = doc.querySelectorAll(".topics .topic_row");
        for (var j = 0; j < topicRows.length; j++) {
            var topic = parseTopicNode(topicRows[j], normalized);
            if (!topic || !topic.link || seen[topic.link]) continue;
            if (userId && topic.author && topic.author !== userId) continue;
            seen[topic.link] = true;
            items.push(topic);
        }
    }

    var moreLink = doc.querySelector(".next a");
    var nextUrl = moreLink ? ensureAbsoluteUrl(attrOf(moreLink, "href"), normalized) : "";
    if (nextUrl && !isGNUrl(nextUrl)) nextUrl = "";

    return {
        kind: kind,
        userId: userId,
        title: userActivityTitle(kind, userId),
        items: items,
        nextUrl: nextUrl
    };
};

var fetchPost = function(link) {
    var id = topicIdFromUrl(link);
    if (!id) throw new Error("GeekNews 글 ID가 없습니다");

    var url = discussionUrlForId(id);
    var postLink = normalizeGNUrl(link) || url;
    var doc = fetchDocument(url);
    var story = parseTopicNode(doc.querySelector(".topic"), url);
    if (!story) {
        story = {
            id: id,
            link: url,
            externalUrl: "",
            title: "GeekNews 글",
            author: "",
            date: "",
            memo: "GN",
            likeCount: "",
            commentCount: ""
        };
    }

    var content = [];
    var body = doc.querySelector("#topic_contents") || doc.querySelector(".topic_contents");
    var parsedBody = parseContentNode(body);
    for (var i = 0; i < parsedBody.length; i++) content.push(parsedBody[i]);

    if (story.externalUrl) {
        content.unshift({
            type: "link",
            value: story.externalUrl,
            label: story.externalUrl
        });
    }

    if (content.length === 0) {
        content.push({ type: "text", value: "(본문 없음)" });
    }

    var comments = parsePostComments(doc, postLink);
    var menus = [MENU_OPEN_GN];
    if (story.externalUrl) menus.unshift(MENU_OPEN_ARTICLE);

    var targetCommentId = commentTargetIdFromUrl(link);
    var targetAnchor = commentAnchorForId(targetCommentId);
    var styles = {
        title: story.title,
        authorClickable: true,
        commentHotThreshold: 10,
        commentColdThreshold: 10
    };
    if (targetAnchor) styles.anchor = targetAnchor;

    var models = {
        link: targetCommentId ? commentUrlForId(postLink, targetCommentId) : postLink,
        externalUrl: story.externalUrl || "",
        author: story.author || "",
        avatar: "",
        date: story.date || "",
        memo: story.memo || "GN",
        viewCount: "",
        likeCount: story.likeCount || "",
        dislikeCount: "",
        commentCount: story.commentCount || "",
        content: content,
        comments: comments,
        menus: menus,
        buttons: [BUTTON_REFRESH],
        anchor: targetAnchor || ""
    };

    return {
        externalUrl: story.externalUrl || "",
        styles: styles,
        models: models
    };
};

var openBrowser = function(url, title) {
    if (!url) return;
    var browserUrl = String(url || "").replace(/#c_([0-9]+)/, "#cid$1");
    synura.open({
        view: "/views/browser",
        styles: { title: title || "GeekNews" },
        models: { url: browserUrl }
    });
};

var openGoDialog = function(parentViewId) {
    synura.open({
        view: "/dialogs/input",
        styles: {
            title: "GeekNews Go",
            message: "GeekNews URL, path, or 글 ID를 입력하세요.",
            close: true
        },
        models: {
            body: [
                { type: "string", name: "url", label: "URL 또는 글 ID", value: "" }
            ],
            buttons: [BUTTON_GO]
        }
    }, { from: "go", parentViewId: parentViewId }, function(event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });
};

var openRoute = function(parentViewId, url) {
    var route = routeForUrl(url);
    if (route) {
        var result = synura.open(route.viewData, route.context, function(event) {
            SYNURA.main.onViewEvent(event.viewId, event);
        });
        if (result && result.success) setParams(result.viewId, route.context);
        else if (parentViewId && result) synura.update(parentViewId, { models: { snackbar: result.error } });
        return true;
    }
    return false;
};

var feedDisplayTitle = function(feed, pastDay) {
    if (isPastFeed(feed) && pastDay) return feed.title + " " + pastDay;
    return feed ? feed.title : "GeekNews";
};

var todayAsYYYYMMDD = function() {
    var today = new Date();
    var yyyy = String(today.getFullYear());
    var mm = String(today.getMonth() + 1);
    var dd = String(today.getDate());
    if (mm.length < 2) mm = "0" + mm;
    if (dd.length < 2) dd = "0" + dd;
    return yyyy + "-" + mm + "-" + dd;
};

var buildPastDateAppbar = function(pastDay) {
    var value = pastDay || todayAsYYYYMMDD();
    return {
        type: "query",
        label: value,
        hint: value,
        value: value
    };
};

var buildPastDateQueryModel = function(pastDay) {
    var value = pastDay || todayAsYYYYMMDD();
    return [{
        label: value,
        hint: value,
        value: value,
        query: value,
        text: value
    }];
};

var addPastDateQueryModel = function(models, feed, pastDay) {
    if (isPastFeed(feed)) models.query = buildPastDateQueryModel(pastDay);
    return models;
};

var buildFeedListStyles = function(feed, pastDay, pagination) {
    var styles = {
        title: feedDisplayTitle(feed, pastDay),
        layout: "card",
        hotThreshold: 100,
        coldThreshold: 0,
        history: true,
        pagination: !!pagination,
        authorClickable: true
    };
    if (isPastFeed(feed)) styles.appbar = buildPastDateAppbar(pastDay);
    return styles;
};

var buildFeedUpdateStyles = function(feed, pastDay, pagination) {
    var styles = {
        title: feedDisplayTitle(feed, pastDay),
        pagination: !!pagination
    };
    if (isPastFeed(feed)) styles.appbar = buildPastDateAppbar(pastDay);
    return styles;
};

var updateFeedView = function(viewId, url, append) {
    var normalizedUrl = normalizeGNUrl(url);
    var feed = feedForUrl(normalizedUrl) || feeds[0];
    var params = getParams(viewId);
    var requestedPastDay = isPastFeed(feed) ? (pastDayFromUrl(normalizedUrl) || params.pastDay || "") : "";

    try {
        var result = fetchFeed(normalizedUrl);
        var pastDay = result.pastDay || requestedPastDay;
        var currentItems = append && params.allItems ? params.allItems : [];
        var allItems = append ? currentItems.concat(result.items) : result.items;
        setParams(viewId, {
            feedId: feed.id,
            url: append ? params.url : normalizedUrl,
            nextUrl: result.nextUrl,
            allItems: allItems,
            pastDay: pastDay,
            pastNavLinks: result.pastNavLinks || {},
            loaded: true
        });

        var models = {
            menus: buildFeedMenus(result.pastNavLinks)
        };
        addPastDateQueryModel(models, feed, pastDay);
        if (append) {
            models.append = result.items;
        } else {
            models.contents = result.items;
        }

        synura.update(viewId, {
            styles: buildFeedUpdateStyles(feed, pastDay, !!result.nextUrl),
            models: models
        });
    } catch (e) {
        console.log("Failed to update feed:", e);
        var errorModels = { snackbar: e.toString() };
        if (!append && (!params.allItems || params.allItems.length === 0)) {
            errorModels.contents = [];
        }
        var errorUpdate = { models: errorModels };
        if (isPastFeed(feed)) {
            errorUpdate.styles = buildFeedUpdateStyles(feed, requestedPastDay, !!params.nextUrl);
            addPastDateQueryModel(errorUpdate.models, feed, requestedPastDay);
        }
        synura.update(viewId, errorUpdate);
    }
};

var openFeed = function(parentViewId, feed) {
    var url = feedUrl(feed);
    var models = {
        contents: [],
        menus: buildFeedMenus()
    };
    addPastDateQueryModel(models, feed, "");

    var result = synura.open({
        view: "/views/list",
        styles: buildFeedListStyles(feed, "", false),
        models: models
    }, { from: "feed", feedId: feed.id, url: url, nextUrl: "", loaded: true }, function(event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });

    if (result && result.success) {
        setParams(result.viewId, { feedId: feed.id, url: url, nextUrl: "", allItems: [], pastNavLinks: {} });
        updateFeedView(result.viewId, url, false);
    } else if (parentViewId && result) {
        synura.update(parentViewId, { models: { snackbar: result.error } });
    }
};

var createPostRouteData = function(link, postData) {
    return {
        view: "/views/post",
        timestamp: Date.now(),
        styles: postData.styles,
        models: postData.models
    };
};

var updatePostView = function(viewId, link) {
    try {
        var postData = fetchPost(link);
        var anchor = commentAnchorForId(commentTargetIdFromUrl(link));
        setParams(viewId, {
            link: postData.models.link,
            externalUrl: postData.externalUrl || "",
            loaded: true,
            anchor: anchor
        });
        synura.update(viewId, postData);
    } catch (e) {
        console.log("Failed to update post:", e);
        synura.update(viewId, { models: { snackbar: e.toString() } });
    }
};

var openPost = function(parentViewId, link) {
    var targetCommentId = commentTargetIdFromUrl(link);
    var targetAnchor = commentAnchorForId(targetCommentId);
    if (targetCommentId) {
        try {
            var postData = fetchPost(link);
            var fullResult = synura.open(createPostRouteData(link, postData), {
                from: "post",
                link: postData.models.link,
                externalUrl: postData.externalUrl || "",
                loaded: true,
                anchor: targetAnchor
            }, function(event) {
                SYNURA.main.onViewEvent(event.viewId, event);
            });

            if (fullResult && fullResult.success) {
                setParams(fullResult.viewId, {
                    link: postData.models.link,
                    externalUrl: postData.externalUrl || "",
                    loaded: true,
                    anchor: targetAnchor
                });
            } else if (parentViewId && fullResult) {
                synura.update(parentViewId, { models: { snackbar: fullResult.error } });
            }
            return;
        } catch (e) {
            console.log("Failed to open comment target:", e);
            if (parentViewId) {
                synura.update(parentViewId, { models: { snackbar: e.toString() } });
            }
            return;
        }
    }

    var result = synura.open({
        view: "/views/post",
        styles: {
            title: "불러오는 중...",
            authorClickable: true
        },
        models: {
            link: link,
            author: "",
            avatar: "",
            date: "",
            content: [{ type: "text", value: "본문을 불러오는 중..." }],
            comments: [],
            menus: [MENU_OPEN_GN],
            buttons: [BUTTON_REFRESH]
        }
    }, { from: "post", link: link, loaded: true }, function(event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });

    if (result && result.success) {
        setParams(result.viewId, { link: link, externalUrl: "" });
        updatePostView(result.viewId, link);
    } else if (parentViewId && result) {
        synura.update(parentViewId, { models: { snackbar: result.error } });
    }
};

var updateUserProfileView = function(viewId, userIdOrUrl) {
    try {
        var profile = fetchUserProfile(userIdOrUrl);
        setParams(viewId, {
            userId: profile.userId,
            url: profile.url,
            loaded: true
        });
        synura.update(viewId, {
            styles: profile.styles,
            models: profile.models
        });
    } catch (e) {
        console.log("Failed to update user profile:", e);
        synura.update(viewId, { models: { snackbar: e.toString() } });
    }
};

var openUserProfile = function(parentViewId, userId) {
    if (!userId) return;
    var url = userUrlForId(userId);
    var result = synura.open({
        view: "/views/post",
        styles: {
            title: userId,
            authorClickable: false
        },
        models: {
            link: url,
            author: userId,
            avatar: "",
            date: "",
            memo: "GeekNews user",
            content: [{ type: "text", value: "프로필을 불러오는 중..." }],
            comments: [],
            menus: [
                MENU_USER_TOPICS,
                MENU_USER_COMMENTS,
                MENU_OPEN_GN
            ],
            buttons: [BUTTON_REFRESH]
        }
    }, { from: "user", userId: userId, url: url, loaded: true }, function(event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });

    if (result && result.success) {
        setParams(result.viewId, { userId: userId, url: url });
        updateUserProfileView(result.viewId, userId);
    } else if (parentViewId && result) {
        synura.update(parentViewId, { models: { snackbar: result.error } });
    }
};

var buildUserActivityStyles = function(title, pagination) {
    return {
        title: title,
        layout: "card",
        history: true,
        pagination: !!pagination,
        authorClickable: true
    };
};

var updateUserActivityView = function(viewId, url, append) {
    try {
        var result = fetchUserActivity(url);
        var params = getParams(viewId);
        var currentItems = append && params.allItems ? params.allItems : [];
        var allItems = append ? currentItems.concat(result.items) : result.items;
        setParams(viewId, {
            kind: result.kind,
            userId: result.userId,
            url: append ? params.url : normalizeGNUrl(url),
            nextUrl: result.nextUrl,
            allItems: allItems,
            loaded: true
        });

        var models = {
            menus: [MENU_OPEN_GN]
        };
        if (append) models.append = result.items;
        else models.contents = result.items;
        if (result.items.length === 0 && !append) {
            models.snackbar = "공개 항목이 없습니다";
        }

        synura.update(viewId, {
            styles: buildUserActivityStyles(result.title, !!result.nextUrl),
            models: models
        });
    } catch (e) {
        console.log("Failed to update user activity:", e);
        var errorModels = { snackbar: e.toString() };
        if (!append) errorModels.contents = [];
        synura.update(viewId, { models: errorModels });
    }
};

var openUserActivity = function(parentViewId, userId, kind) {
    if (!userId || !isUserActivityKind(kind)) return;
    var url = userActivityUrl(kind, userId);
    var title = userActivityTitle(kind, userId);
    var result = synura.open({
        view: "/views/list",
        styles: buildUserActivityStyles(title, false),
        models: {
            contents: [],
            menus: [MENU_OPEN_GN]
        }
    }, { from: "user_activity", kind: kind, userId: userId, url: url, nextUrl: "", loaded: true }, function(event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });

    if (result && result.success) {
        setParams(result.viewId, { kind: kind, userId: userId, url: url, nextUrl: "", allItems: [] });
        updateUserActivityView(result.viewId, url, false);
    } else if (parentViewId && result) {
        synura.update(parentViewId, { models: { snackbar: result.error } });
    }
};

var home = function() {
    var result = synura.open({
        view: "/views/list",
        styles: {
            title: "GeekNews",
            layout: "list"
        },
        models: {
            contents: buildHomeItems(),
            menus: [MENU_GO, MENU_OPEN_GN]
        }
    }, { from: "home" }, function(event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });

    if (!result || !result.success) {
        console.log("Failed to open GeekNews home:", result ? result.error : "unknown error");
    }
};

var resume = function(viewId, context) {
    synura.connect(viewId, context || {}, function(event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });
};

var handleHomeEvent = function(viewId, event) {
    if (event.eventId === "CLICK") {
        if (event.data && event.data.link && topicIdFromUrl(event.data.link)) {
            openPost(viewId, event.data.link);
            return;
        }
        var feed = findFeed(event.data && event.data.id ? event.data.id : "top");
        openFeed(viewId, feed);
    } else if (event.eventId === "MENU_CLICK") {
        if (event.data && event.data.menu === MENU_GO) {
            openGoDialog(viewId);
        } else if (event.data && event.data.menu === MENU_OPEN_GN) {
            openBrowser(GN_ORIGIN + "/", "GeekNews");
        }
    }
};

var handleGoEvent = function(viewId, event) {
    if (event.eventId !== "SUBMIT") return;
    if (!event.data || event.data.button !== BUTTON_GO) {
        synura.close(viewId);
        return;
    }

    var url = goUrlFromInput(event.data.url);
    if (!url) {
        synura.update(viewId, { models: { snackbar: "GeekNews URL, path, or 글 ID를 입력하세요." } });
        return;
    }

    var parentViewId = event.context && event.context.parentViewId;
    synura.close(viewId);

    try {
        if (!openRoute(parentViewId, url)) {
            openBrowser(url, "GeekNews");
        }
    } catch (e) {
        if (parentViewId) synura.update(parentViewId, { models: { snackbar: e.toString() } });
        else console.log("Go failed:", e);
    }
};

var handleFeedEvent = function(viewId, event) {
    var params = getParams(viewId);

    if (event.eventId === "LOAD") {
        if (!params.loaded && !(event.context && event.context.loaded) && (params.url || (event.context && event.context.url))) {
            setParams(viewId, { loaded: true });
            updateFeedView(viewId, params.url || event.context.url, false);
        }
    } else if (event.eventId === "REFRESH") {
        updateFeedView(viewId, params.url || (event.context && event.context.url) || feedUrl(feeds[0]), false);
    } else if (event.eventId === "SCROLL_TO_END") {
        var nextUrl = params.nextUrl || (event.context && event.context.nextUrl) || "";
        if (!nextUrl) {
            synura.update(viewId, {
                styles: { pagination: false },
                models: { snackbar: "더 이상 항목이 없습니다" }
            });
            return;
        }
        updateFeedView(viewId, nextUrl, true);
    } else if (event.eventId === "CLICK") {
        var link = event.data && event.data.link ? event.data.link : "";
        if (link) openPost(viewId, link);
    } else if (event.eventId === "MENU_CLICK") {
        var menu = event.data ? event.data.menu : "";
        var pastNavLinks = params.pastNavLinks || {};
        if (pastNavLinks[menu]) {
            updateFeedView(viewId, pastNavLinks[menu], false);
            return;
        }
        if (menu === MENU_OPEN_GN) {
            openBrowser(params.url || GN_ORIGIN + "/", "GeekNews");
            return;
        }
    } else if (event.eventId === "QUERY") {
        var feed = findFeed(params.feedId || (event.context && event.context.feedId) || "top");
        if (!isPastFeed(feed)) return;

        var rawDay = queryFromEvent(event);
        if (!rawDay) return;

        var day = normalizePastDayQuery(rawDay);
        if (!day) {
            synura.update(viewId, { models: { snackbar: "YYYY-MM-DD 형식으로 입력하세요" } });
            return;
        }

        updateFeedView(viewId, pastUrlForDay(day), false);
    }
};

var handlePostEvent = function(viewId, event) {
    var params = getParams(viewId);
    var link = params.link || (event.context && event.context.link) || (event.data && event.data.link) || "";
    var anchor = params.anchor || (event.context && event.context.anchor) || commentAnchorForId(commentTargetIdFromUrl(link));

    if (event.eventId === "LOAD") {
        if (anchor) {
            setParams(viewId, { anchor: anchor });
            synura.update(viewId, {
                styles: { anchor: anchor },
                models: { anchor: anchor }
            });
        }
        if (!params.loaded && !(event.context && event.context.loaded) && link) {
            setParams(viewId, { loaded: true });
            updatePostView(viewId, link);
        }
    } else if (event.eventId === "REFRESH" || (event.eventId === "SUBMIT" && event.data && event.data.button === BUTTON_REFRESH)) {
        if (link) updatePostView(viewId, link);
    } else if (event.eventId === "MENU_CLICK") {
        var menu = event.data ? event.data.menu : "";
        if (menu === MENU_OPEN_ARTICLE) {
            var externalUrl = params.externalUrl ||
                (event.context && event.context.externalUrl) ||
                (event.data && event.data.externalUrl) ||
                "";
            if (externalUrl) openBrowser(externalUrl, "원문");
            else synura.update(viewId, { models: { snackbar: "원문 링크가 없습니다" } });
        } else if (menu === MENU_OPEN_GN) {
            openBrowser(link || GN_ORIGIN + "/", "GeekNews");
        }
    } else if (event.eventId === "ITEM_MENU_CLICK") {
        if (event.data && event.data.menu === MENU_OPEN_GN && event.data.link) {
            openBrowser(event.data.link, "GeekNews");
        }
    } else if (event.eventId === "AUTHOR_CLICK") {
        if (event.data && event.data.author) {
            openUserProfile(viewId, event.data.author);
        }
    }
};

var handleUserProfileEvent = function(viewId, event) {
    var params = getParams(viewId);
    var userId = params.userId || (event.context && event.context.userId) || "";
    var url = params.url || (event.context && event.context.url) || (userId ? userUrlForId(userId) : "");

    if (event.eventId === "LOAD") {
        if (!params.loaded && !(event.context && event.context.loaded) && (userId || url)) {
            setParams(viewId, { loaded: true });
            updateUserProfileView(viewId, userId || url);
        }
    } else if (event.eventId === "REFRESH" || (event.eventId === "SUBMIT" && event.data && event.data.button === BUTTON_REFRESH)) {
        if (userId || url) updateUserProfileView(viewId, userId || url);
    } else if (event.eventId === "MENU_CLICK") {
        var menu = event.data ? event.data.menu : "";
        var kind = userActivityKindForMenu(menu);
        if (kind) {
            openUserActivity(viewId, userId, kind);
            return;
        }
        if (menu === MENU_OPEN_GN) {
            openBrowser(url || userUrlForId(userId), userId || "GeekNews User");
        }
    }
};

var handleUserActivityEvent = function(viewId, event) {
    var params = getParams(viewId);

    if (event.eventId === "LOAD") {
        if (!params.loaded && !(event.context && event.context.loaded) && (params.url || (event.context && event.context.url))) {
            setParams(viewId, { loaded: true });
            updateUserActivityView(viewId, params.url || event.context.url, false);
        }
    } else if (event.eventId === "REFRESH") {
        updateUserActivityView(viewId, params.url || (event.context && event.context.url), false);
    } else if (event.eventId === "SCROLL_TO_END") {
        var nextUrl = params.nextUrl || (event.context && event.context.nextUrl) || "";
        if (!nextUrl) {
            synura.update(viewId, {
                styles: { pagination: false },
                models: { snackbar: "더 이상 항목이 없습니다" }
            });
            return;
        }
        updateUserActivityView(viewId, nextUrl, true);
    } else if (event.eventId === "CLICK") {
        var link = event.data && event.data.link ? event.data.link : "";
        if (link) openPost(viewId, link);
    } else if (event.eventId === "AUTHOR_CLICK") {
        if (event.data && event.data.author) openUserProfile(viewId, event.data.author);
    } else if (event.eventId === "MENU_CLICK") {
        var menu = event.data ? event.data.menu : "";
        if (menu === MENU_OPEN_GN) {
            openBrowser(params.url || (event.context && event.context.url) || GN_ORIGIN + "/", "GeekNews");
        }
    }
};

var onViewEvent = function(viewId, event) {
    var context = event && event.context ? event.context : {};
    if (context.from === "home") {
        handleHomeEvent(viewId, event);
    } else if (context.from === "feed") {
        handleFeedEvent(viewId, event);
    } else if (context.from === "post") {
        handlePostEvent(viewId, event);
    } else if (context.from === "user") {
        handleUserProfileEvent(viewId, event);
    } else if (context.from === "user_activity") {
        handleUserActivityEvent(viewId, event);
    } else if (context.from === "go") {
        handleGoEvent(viewId, event);
    }
};

var routeForUrl = function(url) {
    var normalized = normalizeGNUrl(url);
    if (!normalized) return null;

    var path = gnPathFromUrl(normalized);
    if (path.charAt(0) === "@" || path.indexOf("user/") === 0) {
        var profile = fetchUserProfile(normalized);
        return {
            viewData: {
                view: "/views/post",
                timestamp: Date.now(),
                styles: profile.styles,
                models: profile.models
            },
            context: {
                from: "user",
                userId: profile.userId,
                url: profile.url,
                loaded: true
            }
        };
    }

    if (isUserActivityKind(path) && userIdFromUrl(normalized)) {
        var activity = fetchUserActivity(normalized);
        var activityModels = {
            contents: activity.items,
            menus: [MENU_OPEN_GN]
        };
        if (activity.items.length === 0) activityModels.snackbar = "공개 항목이 없습니다";

        return {
            viewData: {
                view: "/views/list",
                timestamp: Date.now(),
                styles: buildUserActivityStyles(activity.title, !!activity.nextUrl),
                models: activityModels
            },
            context: {
                from: "user_activity",
                kind: activity.kind,
                userId: activity.userId,
                url: normalized,
                nextUrl: activity.nextUrl,
                allItems: activity.items,
                loaded: true
            }
        };
    }

    var id = topicIdFromUrl(normalized);
    if (id && path === "topic") {
        var postData = fetchPost(normalized);
        return {
            viewData: createPostRouteData(normalized, postData),
            context: {
                from: "post",
                link: postData.models.link,
                externalUrl: postData.externalUrl || "",
                loaded: true
            }
        };
    }

    var feed = feedForUrl(normalized);
    if (feed) {
        var feedData = fetchFeed(normalized);
        var models = {
            contents: feedData.items,
            menus: buildFeedMenus(feedData.pastNavLinks)
        };
        addPastDateQueryModel(models, feed, feedData.pastDay);

        return {
            viewData: {
                view: "/views/list",
                timestamp: Date.now(),
                styles: buildFeedListStyles(feed, feedData.pastDay, !!feedData.nextUrl),
                models: models
            },
            context: {
                from: "feed",
                feedId: feed.id,
                url: normalized,
                nextUrl: feedData.nextUrl,
                allItems: feedData.items,
                pastDay: feedData.pastDay || "",
                pastNavLinks: feedData.pastNavLinks || {},
                loaded: true
            }
        };
    }

    return null;
};

var router = function(url) {
    try {
        var route = routeForUrl(url);
        return route ? route.viewData : null;
    } catch (e) {
        console.log("Router error:", e);
        return null;
    }
};

var handler = {
    home: home,
    resume: resume,
    router: router,
    onViewEvent: onViewEvent,
    showBoardSettings: function() { },
    deeplink: function(url) {
        try {
            var route = routeForUrl(url);
            if (route) {
                var result = synura.open(route.viewData, route.context, function(event) {
                    SYNURA.main.onViewEvent(event.viewId, event);
                });
                if (result && result.success) setParams(result.viewId, route.context);
                return;
            }
        } catch (e) {
            console.log("Deep link route error:", e);
        }

        openBrowser(normalizeGNUrl(url) || GN_ORIGIN + "/", "GeekNews");
    }
};
