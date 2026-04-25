// @ts-nocheck
// =============================================================================
// hackernews.js - Synura Extension for Hacker News
// =============================================================================

var SYNURA = {
    domain: "news.ycombinator.com",
    name: "hackernews",
    author: "Synura Team",
    description: "Unofficial Hacker News extension with feeds, stories, and comments.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    icon: "https://news.ycombinator.com/y18.svg",
    locale: "en_US",
    bypass: "chrome/android",
    deeplink: true,
    get main() { return handler; }
};

var HN_ORIGIN = "https://" + SYNURA.domain;
var HN_HEADERS = {
    "User-Agent": "Synura/1.0"
};
var MENU_OPEN_HN = "Open HN";
var MENU_OPEN_ARTICLE = "Open Article";
var MENU_USER_SUBMISSIONS = "Submissions";
var MENU_USER_COMMENTS = "Comments";
var MENU_USER_FAVORITES = "Favorites";
var BUTTON_REFRESH = "Refresh";
var MENU_BACK_DAY = "Back Day";
var MENU_BACK_MONTH = "Back Month";
var MENU_BACK_YEAR = "Back Year";
var MENU_FORWARD_DAY = "Forward Day";
var MENU_FORWARD_MONTH = "Forward Month";
var MENU_FORWARD_YEAR = "Forward Year";
var PAST_NAV_MENU_ORDER = [
    MENU_BACK_DAY,
    MENU_BACK_MONTH,
    MENU_BACK_YEAR,
    MENU_FORWARD_DAY,
    MENU_FORWARD_MONTH,
    MENU_FORWARD_YEAR
];

var feeds = [
    { id: "news", title: "Top", path: "news", description: "Front page stories" },
    { id: "newest", title: "New", path: "newest", description: "Newest submissions" },
    { id: "front", title: "Past", path: "front", description: "Past front pages" },
    { id: "best", title: "Best", path: "best", description: "Best recent stories" },
    { id: "ask", title: "Ask HN", path: "ask", description: "Questions and discussion" },
    { id: "show", title: "Show HN", path: "show", description: "Projects from the community" },
    { id: "jobs", title: "Jobs", path: "jobs", description: "Hiring posts" }
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

var ensureAbsoluteUrl = function(value, baseUrl) {
    var raw = normalizeWhitespace(value);
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.indexOf("//") === 0) return "https:" + raw;
    if (raw.charAt(0) === "/") return HN_ORIGIN + raw;
    if (raw.charAt(0) === "?" && baseUrl) return stripHash(baseUrl).split("?")[0] + raw;
    return HN_ORIGIN + "/" + raw.replace(/^\/+/, "");
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

var isHNUrl = function(url) {
    return hostOf(url) === SYNURA.domain;
};

var itemIdFromUrl = function(url) {
    var match = String(url || "").match(/[?&]id=([0-9]+)/);
    return match ? match[1] : "";
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
        } catch (e) {
            return String(pair.slice(1).join("=") || "");
        }
    }
    return "";
};

var hnPathFromUrl = function(url) {
    return pathAndQueryOf(url).split("?")[0].replace(/^\/+|\/+$/g, "") || "news";
};

var userIdFromUrl = function(url) {
    return normalizeWhitespace(queryValueFromUrl(url, "id"));
};

var discussionUrlForId = function(id) {
    return HN_ORIGIN + "/item?id=" + encodeURIComponent(String(id || ""));
};

var commentUrlForId = function(postUrl, commentId) {
    var normalized = normalizeHNUrl(postUrl) || HN_ORIGIN + "/news";
    return stripHash(normalized) + "#" + encodeURIComponent(String(commentId || ""));
};

var userUrlForId = function(userId) {
    return HN_ORIGIN + "/user?id=" + encodeURIComponent(String(userId || ""));
};

var userActivityUrl = function(kind, userId) {
    return HN_ORIGIN + "/" + kind + "?id=" + encodeURIComponent(String(userId || ""));
};

var userActivityTitle = function(kind, userId) {
    if (kind === "submitted") return userId + " Submissions";
    if (kind === "threads") return userId + " Comments";
    if (kind === "favorites") return userId + " Favorites";
    return userId;
};

var userActivityKindForMenu = function(menu) {
    if (menu === MENU_USER_SUBMISSIONS) return "submitted";
    if (menu === MENU_USER_COMMENTS) return "threads";
    if (menu === MENU_USER_FAVORITES) return "favorites";
    return "";
};

var isUserActivityKind = function(kind) {
    return kind === "submitted" || kind === "threads" || kind === "favorites";
};

var normalizeHNUrl = function(url) {
    var normalized = ensureAbsoluteUrl(url || HN_ORIGIN + "/news", HN_ORIGIN + "/");
    if (!isHNUrl(normalized)) return "";
    return normalized;
};

var getNextElement = function(node) {
    if (!node) return null;
    if (node.nextElementSibling) return node.nextElementSibling;
    var next = node.nextSibling;
    while (next) {
        if (next.nodeType === 1) return next;
        next = next.nextSibling;
    }
    return null;
};

var firstStoryRow = function(doc) {
    var rows = doc.querySelectorAll("tr.athing");
    for (var i = 0; i < rows.length; i++) {
        var className = String(rows[i].className || "");
        if (className.indexOf("comtr") < 0) return rows[i];
    }
    return null;
};

var findFeed = function(id) {
    for (var i = 0; i < feeds.length; i++) {
        if (feeds[i].id === id || feeds[i].path === id) return feeds[i];
    }
    return feeds[0];
};

var feedUrl = function(feed) {
    return HN_ORIGIN + "/" + (feed && feed.path ? feed.path : "news");
};

var feedForUrl = function(url) {
    var normalized = normalizeHNUrl(url);
    if (!normalized) return null;
    var path = hnPathFromUrl(normalized);
    if (path === "new") path = "newest";
    for (var i = 0; i < feeds.length; i++) {
        if (feeds[i].path === path || feeds[i].id === path) return feeds[i];
    }
    return null;
};

var buildHomeItems = function() {
    return feeds.map(function(feed) {
        return {
            id: feed.id,
            title: feed.title,
            memo: "HN",
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
    for (var i = 0; i < PAST_NAV_MENU_ORDER.length; i++) {
        if (nav[PAST_NAV_MENU_ORDER[i]]) menus.push(PAST_NAV_MENU_ORDER[i]);
    }
    menus.push(MENU_OPEN_HN);
    return menus;
};

var isPastFeed = function(feed) {
    return !!feed && (feed.id === "front" || feed.path === "front");
};

var frontDayFromUrl = function(url) {
    var match = String(url || "").match(/[?&]day=([0-9]{4}-[0-9]{2}-[0-9]{2})/);
    return match ? match[1] : "";
};

var frontDayFromDocument = function(doc, url) {
    var fromUrl = frontDayFromUrl(url);
    if (fromUrl) return fromUrl;

    var title = textOf(doc ? doc.querySelector("title") : null);
    var fromTitle = title.match(/([0-9]{4}-[0-9]{2}-[0-9]{2})\s+front/i);
    return fromTitle ? fromTitle[1] : "";
};

var pastNavMenuLabel = function(currentDay, targetDay, unit) {
    if (!currentDay || !targetDay || targetDay === currentDay) return "";
    var direction = targetDay < currentDay ? "Back" : "Forward";
    if (unit === "day") return direction === "Back" ? MENU_BACK_DAY : MENU_FORWARD_DAY;
    if (unit === "month") return direction === "Back" ? MENU_BACK_MONTH : MENU_FORWARD_MONTH;
    if (unit === "year") return direction === "Back" ? MENU_BACK_YEAR : MENU_FORWARD_YEAR;
    return "";
};

var parsePastNavLinks = function(doc, baseUrl) {
    var currentDay = frontDayFromDocument(doc, baseUrl);
    var links = doc ? doc.querySelectorAll("a") : [];
    var nav = {};

    for (var i = 0; i < links.length; i++) {
        var unit = textOf(links[i]).toLowerCase();
        if (unit !== "day" && unit !== "month" && unit !== "year") continue;

        var href = ensureAbsoluteUrl(attrOf(links[i], "href"), baseUrl);
        if (!href || !isHNUrl(href)) continue;
        var path = pathAndQueryOf(href).split("?")[0].replace(/^\/+/, "") || "news";
        if (path !== "front") continue;

        var targetDay = frontDayFromUrl(href);
        var label = pastNavMenuLabel(currentDay, targetDay, unit);
        if (label && !nav[label]) nav[label] = href;
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

var normalizeFrontDayQuery = function(value) {
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

var frontUrlForDay = function(day) {
    return HN_ORIGIN + "/front?day=" + encodeURIComponent(day);
};

var parseCommentCount = function(text) {
    var normalized = normalizeWhitespace(text).toLowerCase();
    if (!normalized || normalized === "discuss") return 0;
    return parseIntText(normalized);
};

var normalizeStoryTitle = function(title) {
    var normalized = normalizeWhitespace(title);
    var prefixes = [
        { pattern: /^Show HN:\s*/i, category: "SH" },
        { pattern: /^Ask HN:\s*/i, category: "AH" },
        { pattern: /^Tell HN:\s*/i, category: "TH" }
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

var parseStoryRow = function(row, baseUrl) {
    if (!row) return null;
    var id = attrOf(row, "id");
    if (!id) return null;

    var titleAnchor = row.querySelector(".titleline > a") ||
        row.querySelector(".storylink") ||
        row.querySelector("td.title a");
    var parsedTitle = normalizeStoryTitle(textOf(titleAnchor));
    if (!parsedTitle.title) return null;

    var rawTarget = attrOf(titleAnchor, "href");
    var targetUrl = ensureAbsoluteUrl(rawTarget, baseUrl);
    var discussionUrl = discussionUrlForId(id);
    var externalUrl = targetUrl && !isHNUrl(targetUrl) ? targetUrl : "";

    var subRow = getNextElement(row);
    var subtext = subRow ? subRow.querySelector(".subtext") : null;
    var score = parseIntText(textOf(subtext ? subtext.querySelector(".score") : null));
    var author = textOf(subtext ? subtext.querySelector(".hnuser") : null);
    var date = textOf(subtext ? subtext.querySelector(".age") : null);
    var commentCount = null;

    if (subtext) {
        var links = subtext.querySelectorAll("a");
        for (var i = 0; i < links.length; i++) {
            var href = ensureAbsoluteUrl(attrOf(links[i], "href"), baseUrl);
            var linkText = textOf(links[i]);
            if (itemIdFromUrl(href) === id && linkText !== date) {
                var parsedComments = parseCommentCount(linkText);
                if (parsedComments !== null) commentCount = parsedComments;
            }
        }
    }

    var site = textOf(row.querySelector(".sitestr"));
    if (!site && externalUrl) site = hostFromUrl(externalUrl);
    if (!site) site = "HN";

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
    var normalized = normalizeHNUrl(url);
    if (!normalized) throw new Error("Unsupported Hacker News URL");

    console.log("Fetching:", normalized);
    var response = fetch(normalized, { headers: HN_HEADERS });
    if (!response || !response.ok) {
        throw new Error("Failed to fetch " + normalized + " (" + (response ? response.status : 0) + ")");
    }
    return response.dom("text/html");
};

var userProfileCell = function(doc, label) {
    var wanted = String(label || "").toLowerCase();
    var rows = doc ? doc.querySelectorAll("tr") : [];
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].querySelectorAll("td");
        if (!cells || cells.length < 2) continue;
        var key = textOf(cells[0]).toLowerCase().replace(/:$/, "");
        if (key === wanted) return cells[1];
    }
    return null;
};

var fetchUserProfile = function(userIdOrUrl) {
    var normalized = normalizeHNUrl(userIdOrUrl);
    var userId = "";
    if (normalized && hnPathFromUrl(normalized) === "user") {
        userId = userIdFromUrl(normalized);
    } else {
        userId = normalizeWhitespace(userIdOrUrl);
        normalized = userUrlForId(userId);
    }
    if (!userId) throw new Error("Missing Hacker News user id");

    var doc = fetchDocument(normalized);
    var userCell = userProfileCell(doc, "user");
    var createdCell = userProfileCell(doc, "created");
    var karmaCell = userProfileCell(doc, "karma");
    var aboutCell = userProfileCell(doc, "about");

    var profileUserId = textOf(userCell) || userId;
    var created = textOf(createdCell);
    var karma = parseIntText(textOf(karmaCell));
    var content = parseContentNode(aboutCell);
    if (content.length === 0) content.push({ type: "text", value: "(No profile text)" });

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
            date: created,
            memo: "HN user",
            viewCount: "",
            likeCount: karma === null ? "" : formatCount(karma),
            dislikeCount: "",
            commentCount: "",
            content: content,
            comments: [],
            menus: [
                MENU_USER_SUBMISSIONS,
                MENU_USER_COMMENTS,
                MENU_USER_FAVORITES,
                MENU_OPEN_HN
            ],
            buttons: [BUTTON_REFRESH]
        }
    };
};

var fetchFeed = function(url) {
    var normalized = normalizeHNUrl(url);
    var doc = fetchDocument(normalized);
    var feed = feedForUrl(normalized);
    var rows = doc.querySelectorAll("tr.athing");
    var items = [];
    var seen = {};

    for (var i = 0; i < rows.length; i++) {
        var className = String(rows[i].className || "");
        if (className.indexOf("comtr") >= 0) continue;

        var item = parseStoryRow(rows[i], normalized);
        if (!item || !item.link || seen[item.link]) continue;
        seen[item.link] = true;
        items.push(item);
    }

    var moreLink = doc.querySelector("a.morelink");
    var nextUrl = moreLink ? ensureAbsoluteUrl(attrOf(moreLink, "href"), normalized) : "";
    if (nextUrl && !isHNUrl(nextUrl)) nextUrl = "";

    return {
        items: items,
        nextUrl: nextUrl,
        frontDay: isPastFeed(feed) ? frontDayFromDocument(doc, normalized) : "",
        pastNavLinks: isPastFeed(feed) ? parsePastNavLinks(doc, normalized) : {}
    };
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

var parsePostComments = function(doc, baseUrl) {
    var rows = doc.querySelectorAll("tr.athing.comtr");
    var comments = [];

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var id = attrOf(row, "id");
        var author = textOf(row.querySelector(".hnuser")) || "[deleted]";
        var date = textOf(row.querySelector(".age"));
        var body = row.querySelector(".commtext");
        var content = parseContentNode(body);
        if (content.length === 0) content.push({ type: "text", value: "[empty]" });

        var indentCell = row.querySelector(".ind");
        var indent = parseIntText(attrOf(indentCell, "indent"));
        if (indent === null) {
            var indentImage = indentCell ? indentCell.querySelector("img") : null;
            var width = parseIntText(attrOf(indentImage, "width"));
            indent = width === null ? 0 : Math.floor(width / 40);
        }

        comments.push({
            id: id,
            link: id ? commentUrlForId(baseUrl, id) : baseUrl,
            author: author,
            avatar: "",
            content: content,
            date: date,
            likeCount: "",
            dislikeCount: "",
            level: indent || 0,
            menus: [MENU_OPEN_HN],
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

var contextUrlFromCommentRow = function(row, baseUrl) {
    var links = row ? row.querySelectorAll(".navs a") : [];
    for (var i = 0; i < links.length; i++) {
        if (textOf(links[i]).toLowerCase() !== "context") continue;
        var href = ensureAbsoluteUrl(attrOf(links[i], "href"), baseUrl);
        if (href && isHNUrl(href) && itemIdFromUrl(href)) return href;
    }
    return "";
};

var parseUserCommentRow = function(row, baseUrl, userId) {
    if (!row) return null;
    var id = attrOf(row, "id");
    if (!id) return null;

    var author = textOf(row.querySelector(".hnuser"));
    if (userId && author !== userId) return null;

    var date = textOf(row.querySelector(".age"));
    var body = row.querySelector(".commtext");
    var bodyText = textOf(body);
    var onStory = row.querySelector(".onstory a");
    var storyTitle = attrOf(onStory, "title") || textOf(onStory);
    storyTitle = normalizeStoryTitle(storyTitle).title;
    var storyUrl = onStory ? ensureAbsoluteUrl(attrOf(onStory, "href"), baseUrl) : "";
    var contextUrl = contextUrlFromCommentRow(row, baseUrl);
    if (!contextUrl && storyUrl) contextUrl = commentUrlForId(storyUrl, id);
    if (!contextUrl) contextUrl = discussionUrlForId(id);

    var item = {
        id: id,
        link: contextUrl,
        title: truncateText(bodyText || "(empty comment)", 180),
        author: author,
        avatar: "",
        date: date,
        memo: storyTitle ? ("on " + storyTitle) : "Comment",
        likeCount: "",
        dislikeCount: "",
        commentCount: "",
        viewCount: "",
        menus: [],
        hotCount: 0,
        coldCount: 0
    };

    if (storyUrl) item.externalUrl = storyUrl;
    return item;
};

var fetchUserActivity = function(url) {
    var normalized = normalizeHNUrl(url);
    if (!normalized) throw new Error("Unsupported Hacker News URL");

    var kind = hnPathFromUrl(normalized);
    if (!isUserActivityKind(kind)) throw new Error("Unsupported Hacker News user activity URL");

    var userId = userIdFromUrl(normalized);
    if (!userId) throw new Error("Missing Hacker News user id");

    var doc = fetchDocument(normalized);
    var items = [];
    var seen = {};

    if (kind === "threads") {
        var commentRows = doc.querySelectorAll("tr.athing.comtr");
        for (var i = 0; i < commentRows.length; i++) {
            var comment = parseUserCommentRow(commentRows[i], normalized, userId);
            if (!comment || !comment.link || seen[comment.link]) continue;
            seen[comment.link] = true;
            items.push(comment);
        }
    } else {
        var rows = doc.querySelectorAll("tr.athing");
        for (var j = 0; j < rows.length; j++) {
            var className = String(rows[j].className || "");
            if (className.indexOf("comtr") >= 0) continue;
            var story = parseStoryRow(rows[j], normalized);
            if (!story || !story.link || seen[story.link]) continue;
            seen[story.link] = true;
            items.push(story);
        }
    }

    var moreLink = doc.querySelector("a.morelink");
    var nextUrl = moreLink ? ensureAbsoluteUrl(attrOf(moreLink, "href"), normalized) : "";
    if (nextUrl && !isHNUrl(nextUrl)) nextUrl = "";

    return {
        kind: kind,
        userId: userId,
        title: userActivityTitle(kind, userId),
        items: items,
        nextUrl: nextUrl
    };
};

var fetchPost = function(link) {
    var id = itemIdFromUrl(link);
    if (!id) throw new Error("Missing Hacker News item id");

    var url = discussionUrlForId(id);
    var postLink = normalizeHNUrl(link) || url;
    var doc = fetchDocument(url);
    var story = parseStoryRow(firstStoryRow(doc), url);
    if (!story) {
        story = {
            id: id,
            link: url,
            externalUrl: "",
            title: "Hacker News Item",
            author: "",
            date: "",
            memo: "HN",
            likeCount: "",
            commentCount: ""
        };
    }

    var content = [];
    var topText = doc.querySelector(".toptext");
    var parsedTopText = parseContentNode(topText);
    for (var i = 0; i < parsedTopText.length; i++) content.push(parsedTopText[i]);

    if (story.externalUrl) {
        content.unshift({
            type: "link",
            value: story.externalUrl,
            label: story.externalUrl
        });
    }

    if (content.length === 0) {
        content.push({ type: "text", value: "(No text content)" });
    }

    var comments = parsePostComments(doc, postLink);
    var menus = [MENU_OPEN_HN];
    if (story.externalUrl) menus.unshift(MENU_OPEN_ARTICLE);

    return {
        externalUrl: story.externalUrl || "",
        styles: {
            title: story.title,
            authorClickable: true,
            commentHotThreshold: 10,
            commentColdThreshold: 10
        },
        models: {
            link: postLink,
            externalUrl: story.externalUrl || "",
            author: story.author || "",
            avatar: "",
            date: story.date || "",
            memo: story.memo || "HN",
            viewCount: "",
            likeCount: story.likeCount || "",
            dislikeCount: "",
            commentCount: story.commentCount || "",
            content: content,
            comments: comments,
            menus: menus,
            buttons: [BUTTON_REFRESH]
        }
    };
};

var openBrowser = function(url, title) {
    if (!url) return;
    synura.open({
        view: "/views/browser",
        styles: { title: title || "Hacker News" },
        models: { url: url }
    });
};

var feedDisplayTitle = function(feed, frontDay) {
    if (isPastFeed(feed) && frontDay) return feed.title + " " + frontDay;
    return feed ? feed.title : "Hacker News";
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

var buildPastDateAppbar = function(frontDay) {
    var value = frontDay || todayAsYYYYMMDD();
    return {
        type: "query",
        label: value,
        hint: value,
        value: value
    };
};

var buildPastDateQueryModel = function(frontDay) {
    var value = frontDay || todayAsYYYYMMDD();
    return [{
        label: value,
        hint: value,
        value: value,
        query: value,
        text: value
    }];
};

var addPastDateQueryModel = function(models, feed, frontDay) {
    if (isPastFeed(feed)) models.query = buildPastDateQueryModel(frontDay);
    return models;
};

var buildFeedListStyles = function(feed, frontDay, pagination) {
    var styles = {
        title: feedDisplayTitle(feed, frontDay),
        layout: "card",
        hotThreshold: 500,
        coldThreshold: 0,
        history: true,
        pagination: !!pagination
    };
    if (isPastFeed(feed)) styles.appbar = buildPastDateAppbar(frontDay);
    return styles;
};

var buildFeedUpdateStyles = function(feed, frontDay, pagination) {
    var styles = {
        title: feedDisplayTitle(feed, frontDay),
        pagination: !!pagination
    };
    if (isPastFeed(feed)) styles.appbar = buildPastDateAppbar(frontDay);
    return styles;
};

var updateFeedView = function(viewId, url, append) {
    var normalizedUrl = normalizeHNUrl(url);
    var feed = feedForUrl(normalizedUrl) || feeds[0];
    var params = getParams(viewId);
    var requestedFrontDay = isPastFeed(feed) ? (frontDayFromUrl(normalizedUrl) || params.frontDay || "") : "";

    try {
        var result = fetchFeed(normalizedUrl);
        var frontDay = result.frontDay || requestedFrontDay;
        var currentItems = append && params.allItems ? params.allItems : [];
        var allItems = append ? currentItems.concat(result.items) : result.items;
        setParams(viewId, {
            feedId: feed.id,
            url: append ? params.url : normalizedUrl,
            nextUrl: result.nextUrl,
            allItems: allItems,
            frontDay: frontDay,
            pastNavLinks: result.pastNavLinks || {},
            loaded: true
        });

        var models = {
            menus: buildFeedMenus(result.pastNavLinks)
        };
        addPastDateQueryModel(models, feed, frontDay);
        if (append) {
            models.append = result.items;
        } else {
            models.contents = result.items;
        }

        synura.update(viewId, {
            styles: buildFeedUpdateStyles(feed, frontDay, !!result.nextUrl),
            models: models
        });
    } catch (e) {
        console.log("Failed to update feed:", e);
        var errorUpdate = { models: { snackbar: e.toString() } };
        if (isPastFeed(feed)) {
            errorUpdate.styles = buildFeedUpdateStyles(feed, requestedFrontDay, !!params.nextUrl);
            addPastDateQueryModel(errorUpdate.models, feed, requestedFrontDay);
        }
        synura.update(viewId, errorUpdate);
    }
};

var openFeed = function(parentViewId, feed) {
    var url = feedUrl(feed);
    var models = {
        contents: [{ title: "Loading...", memo: "HN" }],
        menus: buildFeedMenus()
    };
    addPastDateQueryModel(models, feed, "");

    var result = synura.open({
        view: "/views/list",
        styles: buildFeedListStyles(feed, "", true),
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
        setParams(viewId, {
            link: postData.models.link,
            externalUrl: postData.externalUrl || "",
            loaded: true
        });
        synura.update(viewId, postData);
    } catch (e) {
        console.log("Failed to update post:", e);
        synura.update(viewId, { models: { snackbar: e.toString() } });
    }
};

var openPost = function(parentViewId, link) {
    var result = synura.open({
        view: "/views/post",
        styles: {
            title: "Loading...",
            authorClickable: true
        },
        models: {
            link: link,
            author: "",
            avatar: "",
            date: "",
            content: [{ type: "text", value: "Loading content..." }],
            comments: [],
            menus: [MENU_OPEN_HN],
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
            memo: "HN user",
            content: [{ type: "text", value: "Loading profile..." }],
            comments: [],
            menus: [
                MENU_USER_SUBMISSIONS,
                MENU_USER_COMMENTS,
                MENU_USER_FAVORITES,
                MENU_OPEN_HN
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
            url: append ? params.url : normalizeHNUrl(url),
            nextUrl: result.nextUrl,
            allItems: allItems,
            loaded: true
        });

        var models = {
            menus: [MENU_OPEN_HN]
        };
        if (append) models.append = result.items;
        else models.contents = result.items;
        if (result.items.length === 0 && !append) {
            models.snackbar = "No public items";
        }

        synura.update(viewId, {
            styles: buildUserActivityStyles(result.title, !!result.nextUrl),
            models: models
        });
    } catch (e) {
        console.log("Failed to update user activity:", e);
        synura.update(viewId, { models: { snackbar: e.toString() } });
    }
};

var openUserActivity = function(parentViewId, userId, kind) {
    if (!userId || !isUserActivityKind(kind)) return;
    var url = userActivityUrl(kind, userId);
    var title = userActivityTitle(kind, userId);
    var result = synura.open({
        view: "/views/list",
        styles: buildUserActivityStyles(title, true),
        models: {
            contents: [{ title: "Loading...", memo: "HN" }],
            menus: [MENU_OPEN_HN]
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
            title: "Hacker News",
            layout: "list"
        },
        models: {
            contents: buildHomeItems(),
            menus: [MENU_OPEN_HN]
        }
    }, { from: "home" }, function(event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });

    if (!result || !result.success) {
        console.log("Failed to open Hacker News home:", result ? result.error : "unknown error");
    }
};

var resume = function(viewId, context) {
    synura.connect(viewId, context || {}, function(event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });
};

var handleHomeEvent = function(viewId, event) {
    if (event.eventId === "CLICK") {
        if (event.data && event.data.link && itemIdFromUrl(event.data.link)) {
            openPost(viewId, event.data.link);
            return;
        }
        var feed = findFeed(event.data && event.data.id ? event.data.id : "news");
        openFeed(viewId, feed);
    } else if (event.eventId === "MENU_CLICK") {
        if (event.data && event.data.menu === MENU_OPEN_HN) {
            openBrowser(HN_ORIGIN + "/news", "Hacker News");
        }
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
                models: { snackbar: "No more stories" }
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
        if (menu === MENU_OPEN_HN) {
            openBrowser(params.url || HN_ORIGIN + "/news", "Hacker News");
            return;
        }
    } else if (event.eventId === "QUERY") {
        var feed = findFeed(params.feedId || (event.context && event.context.feedId) || "news");
        if (!isPastFeed(feed)) return;

        var rawDay = queryFromEvent(event);
        if (!rawDay) return;

        var day = normalizeFrontDayQuery(rawDay);
        if (!day) {
            synura.update(viewId, { models: { snackbar: "Enter date as YYYY-MM-DD" } });
            return;
        }

        updateFeedView(viewId, frontUrlForDay(day), false);
    }
};

var handlePostEvent = function(viewId, event) {
    var params = getParams(viewId);
    var link = params.link || (event.context && event.context.link) || (event.data && event.data.link) || "";

    if (event.eventId === "LOAD") {
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
            if (externalUrl) openBrowser(externalUrl, "Article");
            else synura.update(viewId, { models: { snackbar: "No article link" } });
        } else if (menu === MENU_OPEN_HN) {
            openBrowser(link || HN_ORIGIN + "/news", "Hacker News");
        }
    } else if (event.eventId === "ITEM_MENU_CLICK") {
        if (event.data && event.data.menu === MENU_OPEN_HN && event.data.link) {
            openBrowser(event.data.link, "Hacker News");
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
        if (menu === MENU_OPEN_HN) {
            openBrowser(url || userUrlForId(userId), userId || "Hacker News User");
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
                models: { snackbar: "No more items" }
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
        if (menu === MENU_OPEN_HN) {
            openBrowser(params.url || (event.context && event.context.url) || HN_ORIGIN + "/news", "Hacker News");
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
    }
};

var routeForUrl = function(url) {
    var normalized = normalizeHNUrl(url);
    if (!normalized) return null;

    var path = hnPathFromUrl(normalized);
    if (path === "user") {
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

    if (isUserActivityKind(path)) {
        var activity = fetchUserActivity(normalized);
        var activityModels = {
            contents: activity.items,
            menus: [MENU_OPEN_HN]
        };
        if (activity.items.length === 0) activityModels.snackbar = "No public items";

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

    var id = itemIdFromUrl(normalized);
    if (id) {
        var postLink = normalized;
        var postData = fetchPost(postLink);
        return {
            viewData: createPostRouteData(postLink, postData),
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
        addPastDateQueryModel(models, feed, feedData.frontDay);

        return {
            viewData: {
                view: "/views/list",
                timestamp: Date.now(),
                styles: buildFeedListStyles(feed, feedData.frontDay, !!feedData.nextUrl),
                models: models
            },
            context: {
                from: "feed",
                feedId: feed.id,
                url: normalized,
                nextUrl: feedData.nextUrl,
                allItems: feedData.items,
                frontDay: feedData.frontDay || "",
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

        openBrowser(normalizeHNUrl(url) || HN_ORIGIN + "/news", "Hacker News");
    }
};
