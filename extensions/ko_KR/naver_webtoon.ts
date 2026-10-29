// @ts-nocheck
// =============================================================================
// naver_webtoon.ts - Synura Extension for Naver Webtoon (comic.naver.com)
// =============================================================================

var SYNURA = {
    domain: "comic.naver.com",
    host_permissions: [
        "*://*.naver.com/*",
        "*://comic.naver.com/*",
        "*://m.comic.naver.com/*"
    ],
    name: "naver_webtoon",
    author: "Synura Team",
    description: "comic.naver.com",
    version: 0.1, // Intentionally pinned at 0.1.
    api: 0,
    license: "Apache-2.0",
    icon: "https://www.naver.com/favicon.ico",
    locale: "ko_KR",
    bypass: "chrome/android",
    deeplink: true,
    tags: [
        "webtoon",
        "comics",
        "korea",
        "naver"
    ],
    get main() { return handler; }
};
globalThis.SYNURA = SYNURA;

var BASE_URL = "https://m.comic.naver.com";
// Let the bypass profile supply the same User-Agent as the login browser.
var FETCH_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
};

var SUBSCRIPTIONS_KEY = "naver_webtoon:subscriptions";
var WEBTOON_COOKIE_KEY = "naver_webtoon:cookie";
var BUTTON_BROWSER = "웹브라우저에서 보기";
var BUTTON_MORE_COMMENTS = "댓글 더 보기";
var BUTTON_RETRY_COMMENTS = "댓글 다시 불러오기";

var WEEKDAY_MENUS = [
    { id: "mon", title: "월요웹툰", link: BASE_URL + "/webtoon/weekday?week=mon" },
    { id: "tue", title: "화요웹툰", link: BASE_URL + "/webtoon/weekday?week=tue" },
    { id: "wed", title: "수요웹툰", link: BASE_URL + "/webtoon/weekday?week=wed" },
    { id: "thu", title: "목요웹툰", link: BASE_URL + "/webtoon/weekday?week=thu" },
    { id: "fri", title: "금요웹툰", link: BASE_URL + "/webtoon/weekday?week=fri" },
    { id: "sat", title: "토요웹툰", link: BASE_URL + "/webtoon/weekday?week=sat" },
    { id: "sun", title: "일요웹툰", link: BASE_URL + "/webtoon/weekday?week=sun" },
    { id: "daily", title: "매일+", link: BASE_URL + "/webtoon/weekday?week=dailyPlus" },
    { id: "finish", title: "완결웹툰", link: BASE_URL + "/webtoon/finish" }
];

// In-memory view state registry for pagination and context persistence
var viewStates = {};
var episodeDates = {};
var firstEpisodeUrls = {};
var webtoonAuthRetrying = false;

function normalizeWebtoonDate(value) {
    var text = String(value || "").trim();
    var match = text.match(/^(\d{4}|\d{2})[.\/-]\s*(\d{1,2})[.\/-]\s*(\d{1,2})\.?$/);
    if (match) {
        var year = Number(match[1]);
        if (year < 100) year += 2000;
        var month = Number(match[2]);
        var day = Number(match[3]);
        var date = new Date(Date.UTC(year, month - 1, day));
        if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return "";
        function pad(part) { return part < 10 ? "0" + part : String(part); }
        return year + "-" + pad(month) + "-" + pad(day);
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text)) {
        var timestamp = Date.parse(text);
        return isNaN(timestamp) ? "" : new Date(timestamp + 9 * 3600000).toISOString().slice(0, 10);
    }
    return "";
}

function webtoonDateFromDoc(doc) {
    var selectors = ["time[datetime]", ".date", "meta[property='article:published_time']"];
    for (var i = 0; i < selectors.length; i++) {
        var nodes = doc.querySelectorAll(selectors[i]);
        for (var j = 0; j < nodes.length; j++) {
            var date = normalizeWebtoonDate(nodes[j].getAttribute("datetime") ||
                nodes[j].getAttribute("content") || nodes[j].textContent);
            if (date) return date;
        }
    }
    return "";
}

function getSubscriptions() {
    try {
        var raw = localStorage.getItem(SUBSCRIPTIONS_KEY);
        if (raw) {
            var parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {}
    return [];
}

function saveSubscriptions(subs) {
    try {
        localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subs));
        refreshWebtoonHomeViews();
    } catch (e) {}
}

function isSubscribed(titleId) {
    if (!titleId) return false;
    var subs = getSubscriptions();
    for (var i = 0; i < subs.length; i++) {
        if (subs[i] && subs[i].titleId === String(titleId)) return true;
    }
    return false;
}

function toggleSubscription(item) {
    if (!item || !item.titleId) return false;
    var subs = getSubscriptions();
    var foundIndex = -1;
    for (var i = 0; i < subs.length; i++) {
        if (subs[i] && subs[i].titleId === String(item.titleId)) {
            foundIndex = i;
            break;
        }
    }
    if (foundIndex >= 0) {
        subs.splice(foundIndex, 1);
        saveSubscriptions(subs);
        return false;
    } else {
        subs.push({
            id: "sub_" + item.titleId,
            titleId: String(item.titleId),
            title: item.title || "웹툰",
            author: item.author || "네이버 웹툰",
            avatar: item.avatar || "",
            link: item.link || (BASE_URL + "/webtoon/list?titleId=" + item.titleId)
        });
        saveSubscriptions(subs);
        return true;
    }
}

function extractTitleId(url) {
    if (!url) return "";
    var m = url.match(/titleId=(\d+)/);
    return m ? m[1] : "";
}

function extractEpisodeNo(url) {
    if (!url) return "";
    var m = url.match(/no=(\d+)/);
    return m ? m[1] : "";
}

function webtoonSection(url) {
    var match = String(url || "").match(/\/(webtoon|bestChallenge|challenge)\//);
    return match ? match[1] : "webtoon";
}

function webtoonContentUrl(url, page) {
    var match = String(url || "").match(/\/(webtoon|bestChallenge|challenge)\/(list|detail)(?:[/?#]|$)/);
    return !!match && match[2] === page;
}

function webtoonEpisodeUrl(url) {
    var titleId = extractTitleId(url);
    var no = extractEpisodeNo(url);
    if (!webtoonContentUrl(url, "detail") || !titleId || !no) return "";
    return BASE_URL + "/" + webtoonSection(url) + "/detail?titleId=" + titleId + "&no=" + no;
}

function firstWebtoonListLink(root) {
    var links = root.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href") || "";
        if (webtoonContentUrl(href, "list") && extractTitleId(href)) return links[i];
    }
    return null;
}

function webtoonCookieHost(url) {
    return /^https:\/\/(?:m\.)?comic\.naver\.com(?::\d+)?(?:[/?#]|$)/i.test(String(url || ""));
}

function webtoonFetch(url, headers) {
    var requestHeaders = {};
    var source = headers || FETCH_HEADERS;
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; i++) requestHeaders[keys[i]] = source[keys[i]];
    var cookie = localStorage.getItem(WEBTOON_COOKIE_KEY);
    if (webtoonCookieHost(url) && typeof cookie === "string" && cookie && !/[\r\n\0]/.test(cookie)) {
        requestHeaders.Cookie = cookie;
    }
    return fetch(url, { headers: requestHeaders });
}

function webtoonNeedsLogin(response, html) {
    var finalUrl = String(response && response.url || "");
    if (/^https?:\/\/nid\.naver\.com(?:[/:?#]|$)/i.test(finalUrl)) return true;
    var body = String(html || "");
    return (/\bid\s*=\s*["']frmNIDLogin["']/i.test(body) &&
        /nid\.naver\.com\/nidlogin\.login/i.test(body)) ||
        (/\bclass\s*=\s*["'][^"']*\btop_adult\b/i.test(body) &&
        /연령\s*확인|나이\s*확인|성인\s*인증|본인\s*확인|청소년\s*보호/.test(body));
}

function webtoonLoginError(url) {
    var error = new Error("WEBTOON_LOGIN_REQUIRED");
    error.webtoonLoginRequired = true;
    error.targetUrl = url;
    return error;
}

function fetchHtml(url) {
    try {
        var resp = webtoonFetch(url);
        var html = resp ? resp.text() : "";
        if (webtoonNeedsLogin(resp, html) || resp && resp.status === 401) throw webtoonLoginError(url);
        if (resp && resp.status === 200) {
            if (!html && webtoonAuthRetrying) throw new Error("WEBTOON_RETRY_FAILED");
            return html;
        }
        if (webtoonAuthRetrying) throw new Error("WEBTOON_RETRY_FAILED");
    } catch (e) {
        if ((e && e.webtoonLoginRequired) || webtoonAuthRetrying) throw e;
        console.log("Fetch error for " + url + ": " + e);
    }
    return "";
}

function parseDoc(html) {
    var parser = new DOMParser();
    return parser.parseFromString(html || "", "text/html");
}

function webtoonThumbnailUrl(value) {
    // Naver's shared image CDN serves the same thumbnails without a Referer.
    return String(value || "").trim().replace(
        /^(?:https?:)?\/\/image-comic\.pstatic\.net\//i,
        "https://shared-comic.pstatic.net/"
    );
}

function webtoonListStyles(title, pagination, options) {
    options = options || {};
    return {
        title: title,
        layout: options.layout || "card",
        media: true,
        history: options.history === true,
        menu: options.menu !== false,
        pagination: !!pagination
    };
}

function firstLinkWithHrefPart(root, fragment) {
    var links = root.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
        if ((links[i].getAttribute("href") || "").indexOf(fragment) >= 0) return links[i];
    }
    return null;
}

function webtoonFirstEpisodeUrlFromDoc(doc, seriesUrl) {
    var titleId = extractTitleId(seriesUrl);
    var section = webtoonSection(seriesUrl);
    var first = doc.querySelector("a._first_article_link");
    if (!titleId || !first) return "";
    var href = first.getAttribute("href") || "";
    var no = first.getAttribute("data-article-no") || "";
    if (webtoonContentUrl(href, "detail") && extractTitleId(href) === titleId) {
        section = webtoonSection(href);
        no = extractEpisodeNo(href);
    }
    if (!/^\d+$/.test(no)) return "";
    var url = BASE_URL + "/" + section + "/detail?titleId=" + titleId + "&no=" + no;
    firstEpisodeUrls[webtoonSection(seriesUrl) + ":" + titleId] = url;
    return url;
}

function openFirstEpisode(viewId, item, context) {
    var titleId = item.titleId || extractTitleId(item.link);
    var section = webtoonSection(item.link);
    var key = section + ":" + titleId;
    var url = item.firstEpisodeUrl || firstEpisodeUrls[key] || "";
    if (!titleId) {
        synura.update(viewId, { models: { snackbar: "작품 정보를 확인하지 못했습니다." } });
        return;
    }
    if (!url) {
        var listUrl = BASE_URL + "/" + section + "/list?titleId=" + titleId + "&page=1";
        var html = fetchHtml(listUrl);
        if (html) url = webtoonFirstEpisodeUrlFromDoc(parseDoc(html), listUrl);
    }
    if (!url) {
        try {
            var response = webtoonFetch("https://comic.naver.com/api/article/list?titleId=" + titleId + "&page=1&sort=ASC");
            var body = response ? response.text() : "";
            if (webtoonNeedsLogin(response, body) || response && response.status === 401) throw webtoonLoginError(listUrl);
            if ((!response || response.status !== 200) && webtoonAuthRetrying) throw new Error("WEBTOON_RETRY_FAILED");
            var data = response && response.status === 200 ? JSON.parse(body) : null;
            var first = data && Array.isArray(data.articleList) && data.articleList[0];
            if (first && /^\d+$/.test(String(first.no))) {
                url = BASE_URL + "/" + section + "/detail?titleId=" + titleId + "&no=" + first.no;
            }
        } catch (e) {
            if ((e && e.webtoonLoginRequired) || webtoonAuthRetrying) throw e;
        }
    }
    if (!url) {
        if (webtoonAuthRetrying) throw new Error("WEBTOON_RETRY_FAILED");
        synura.update(viewId, { models: { snackbar: "첫 회차 정보를 불러오지 못했습니다. 다시 시도해 주세요." } });
        return;
    }
    firstEpisodeUrls[key] = url;
    openEpisodePostView(url, (item.title || "웹툰") + " 첫화", context.kind === "viewer" ? viewId : undefined, viewId);
}

function fetchEpisodeComments(titleId, no, episodeUrl, cursor) {
    if (!titleId || !no) return { comments: [], nextCursor: "", failed: false };
    var commentSection = webtoonSection(episodeUrl) === "webtoon" ? "webtoon" : "challenge";
    var apiUrl = BASE_URL + "/comment/api/community/v2/posts?pageId=" +
        encodeURIComponent(commentSection + "_" + titleId + "_" + no) +
        "&prevSize=0&nextSize=20&pinRepresentation=none&displayBlindCommentAsService=false";
    if (cursor) apiUrl += "&cursor=" + encodeURIComponent(cursor);
    try {
        var response = webtoonFetch(apiUrl, {
            "Accept": "application/json",
            "Service-Ticket-Id": "comic_" + commentSection,
            "Referer": BASE_URL + "/scrolltoon/comment?titleId=" + titleId + "&no=" + no
        });
        if (!response || response.status !== 200) throw new Error("댓글 요청 실패");
        var data = JSON.parse(response.text());
        if (!data || data.status !== "success" || !data.result || !Array.isArray(data.result.posts)) {
            throw new Error("댓글 응답 오류");
        }
        var posts = data.result.posts;
        var comments = [];
        var seen = {};
        for (var i = 0; i < posts.length; i++) {
            var post = posts[i];
            if (!post || post.status !== "SERVICE" || !post.id || seen[post.id] ||
                typeof post.body !== "string" || !post.body.trim()) continue;
            var blind = false;
            var extras = Array.isArray(post.extraList) ? post.extraList : [];
            for (var e = 0; e < extras.length; e++) {
                if (extras[e] && extras[e].key === "CLEANBOT_STATUS" && extras[e].value === "BLIND") blind = true;
            }
            if (blind) continue;
            seen[post.id] = true;
            var author = post.createdBy || {};
            var profileImage = author.profileImage;
            var avatar = typeof profileImage === "string" ? profileImage : "";
            if (profileImage && typeof profileImage.domain === "string" && profileImage.domain &&
                typeof profileImage.path === "string" && profileImage.path) {
                avatar = profileImage.domain.replace(/\/+$/, "") + "/" + profileImage.path.replace(/^\/+/, "");
            }
            var likes = 0;
            var dislikes = 0;
            var reactions = Array.isArray(post.reactions) ? post.reactions : [];
            for (var r = 0; r < reactions.length; r++) {
                if (!reactions[r] || reactions[r].reactionId !== "post_like") continue;
                var emotions = reactions[r].emotions || [];
                for (var j = 0; j < emotions.length; j++) {
                    if (!emotions[j]) continue;
                    var count = Math.max(0, parseInt(String(emotions[j].count || 0), 10) || 0);
                    if (emotions[j].emotionId === "like") likes = count;
                    if (emotions[j].emotionId === "dislike") dislikes = count;
                }
            }
            var createdAt = new Date(post.createdAt);
            comments.push({
                id: String(post.id),
                link: episodeUrl + "#comment_" + encodeURIComponent(String(post.id)),
                author: author.name || "익명",
                avatar: avatar,
                date: post.createdAt && !isNaN(createdAt.getTime()) ? createdAt.toISOString() : "",
                content: [{ type: "text", value: post.body }],
                likeCount: likes ? String(likes) : "",
                dislikeCount: dislikes ? String(dislikes) : "",
                hotCount: likes,
                coldCount: dislikes,
                level: Math.max(0, (parseInt(String(post.commentDepth || post.depth || 1), 10) || 1) - 1)
            });
        }
        var pagination = data.result.pagination || {};
        return {
            comments: comments,
            nextCursor: typeof pagination.next === "string" ? pagination.next : "",
            failed: false
        };
    } catch (e) {
        console.log("Webtoon comments fetch failed: " + e);
        return { comments: [], nextCursor: cursor || "", failed: true };
    }
}

function viewerButtons(context) {
    var buttons = [BUTTON_BROWSER];
    if (context.commentFailed) buttons.push(BUTTON_RETRY_COMMENTS);
    else if (context.commentCursor) buttons.push(BUTTON_MORE_COMMENTS);
    return buttons;
}

function loadMoreEpisodeComments(viewId, context) {
    if (!context.commentCursor && !context.commentFailed) return;
    var page = fetchEpisodeComments(context.titleId, context.no, context.link, context.commentCursor);
    context.commentFailed = page.failed;
    if (!page.failed) {
        var comments = context.comments || [];
        var seen = {};
        for (var i = 0; i < comments.length; i++) seen[comments[i].id] = true;
        for (var j = 0; j < page.comments.length; j++) {
            if (!seen[page.comments[j].id]) {
                comments.push(page.comments[j]);
                seen[page.comments[j].id] = true;
            }
        }
        context.comments = comments;
        context.commentCursor = page.nextCursor === context.commentCursor ? "" : page.nextCursor;
    }
    viewStates[viewId] = context;
    synura.update(viewId, {
        models: {
            comments: context.comments || [],
            buttons: viewerButtons(context),
            snackbar: page.failed ? "댓글을 불러오지 못했습니다. 다시 시도하거나 웹브라우저에서 확인해 주세요." : ""
        }
    });
}

function parseEpisodesFromDoc(doc, baseUrl, seenMap) {
    var episodes = [];
    var links = doc.querySelectorAll("a[href]");

    for (var i = 0; i < links.length; i++) {
        var a = links[i];
        var href = a.getAttribute("href");
        if (!webtoonContentUrl(href, "detail")) continue;

        var fullLink = webtoonEpisodeUrl(href);
        if (!fullLink) continue;
        if (seenMap && seenMap[fullLink]) continue;
        if (seenMap) seenMap[fullLink] = true;

        var epTitleEl = a.querySelector(".title .name") || a.querySelector(".title") || a.querySelector("strong");
        var epTitle = epTitleEl && epTitleEl.textContent ? epTitleEl.textContent.trim() : ("회차 " + (i + 1));
        var imgEl = a.querySelector("img");
        var dateEl = a.querySelector(".date");
        var scoreEl = a.querySelector(".score");

        var imgSrc = webtoonThumbnailUrl(imgEl ? (imgEl.getAttribute("data-src") || imgEl.getAttribute("src") || "") : "");
        var dateText = dateEl && dateEl.textContent ? normalizeWebtoonDate(dateEl.textContent) : "";
        if (dateText) episodeDates[extractTitleId(fullLink) + ":" + extractEpisodeNo(fullLink)] = dateText;
        var scoreText = scoreEl && scoreEl.textContent ? ("★ " + scoreEl.textContent.trim()) : "";

        episodes.push({
            id: "ep_" + fullLink,
            title: epTitle,
            author: scoreText,
            avatar: imgSrc,
            mediaUrl: imgSrc,
            thumbnail: imgSrc,
            mediaType: imgSrc ? "image" : "",
            types: [],
            category: "",
            date: dateText,
            link: fullLink,
            menus: ["첫화보기", "브라우저로 열기"]
        });
    }
    return episodes;
}

function openWeekdayView(url, title) {
    var html = fetchHtml(url);
    var doc = parseDoc(html);
    var toons = [];
    var seen = {};

    var lis = doc.querySelectorAll("li.item");
    for (var i = 0; i < lis.length; i++) {
        var li = lis[i];
        var a = li.querySelector("a.link") || firstLinkWithHrefPart(li, "/webtoon/list");
        var titleEl = li.querySelector(".title") || li.querySelector("strong");
        var authorEl = li.querySelector(".author");
        var imgEl = li.querySelector(".thumbnail img") || li.querySelector("img");
        var href = a ? a.getAttribute("href") : "";

        if (href && titleEl) {
            var fullLink = href.indexOf("http") === 0 ? href : BASE_URL + href;
            var cleanLink = fullLink.split("&week=")[0];
            var titleId = extractTitleId(cleanLink);
            if (seen[cleanLink]) continue;
            seen[cleanLink] = true;

            var tText = titleEl.textContent ? titleEl.textContent.trim() : "";
            var aText = authorEl && authorEl.textContent ? authorEl.textContent.trim() : "";
            var imgSrc = webtoonThumbnailUrl(imgEl ? (imgEl.getAttribute("data-src") || imgEl.getAttribute("src") || "") : "");
            toons.push({
                id: "toon_" + toons.length,
                titleId: titleId,
                title: tText,
                author: aText,
                avatar: imgSrc,
                mediaUrl: imgSrc,
                thumbnail: imgSrc,
                mediaType: imgSrc ? "image" : "",
                types: [],
                category: "",
                link: cleanLink,
                menus: []
            });
        }
    }

    synura.open({
        view: "/views/list",
        styles: webtoonListStyles(title || "네이버 웹툰", false, { menu: false }),
        models: {
            contents: toons,
            menus: []
        }
    }, { kind: "weekday", link: url, title: title }, function (e) {
        SYNURA.main.onViewEvent(e.viewId, e);
    });
}

function openEpisodeListView(url, titleHint) {
    var fetchUrl = url.split("&week=")[0];
    var titleId = extractTitleId(fetchUrl);
    var section = webtoonSection(fetchUrl);
    var targetUrl = BASE_URL + "/" + section + "/list?titleId=" + titleId + "&page=1";
    var html = fetchHtml(targetUrl);
    var doc = parseDoc(html);

    var titleEl = doc.querySelector(".area_info .title") || doc.querySelector(".title");
    var toonTitle = (titleEl && titleEl.textContent) ? titleEl.textContent.trim() : (titleHint || "회차 목록");

    var authorEl = doc.querySelector(".area_info .author") || doc.querySelector(".author");
    var toonAuthor = (authorEl && authorEl.textContent) ? authorEl.textContent.trim() : "네이버 웹툰";

    var thumbEl = doc.querySelector(".area_info .thumbnail img") || doc.querySelector(".thumbnail img");
    var toonAvatar = webtoonThumbnailUrl(thumbEl ? (thumbEl.getAttribute("data-src") || thumbEl.getAttribute("src") || "") : "");

    var seenMap = {};
    var episodes = parseEpisodesFromDoc(doc, BASE_URL, seenMap);
    var firstEpisodeUrl = webtoonFirstEpisodeUrlFromDoc(doc, fetchUrl);
    var sub = isSubscribed(titleId);

    var contextData = {
        kind: "episodes",
        link: fetchUrl,
        title: toonTitle,
        titleId: titleId,
        section: section,
        firstEpisodeUrl: firstEpisodeUrl,
        author: toonAuthor,
        avatar: toonAvatar,
        page: 1,
        seenMap: seenMap
    };

    var res = synura.open({
        view: "/views/list",
        styles: webtoonListStyles(toonTitle, episodes.length >= 20, { history: true }),
        models: {
            contents: episodes,
            menus: ["첫화보기", sub ? "구독 취소" : "구독", "브라우저로 열기"]
        }
    }, contextData, function (e) {
        SYNURA.main.onViewEvent(e.viewId, e);
    });

    if (res && res.viewId) {
        viewStates[res.viewId] = contextData;
    }
}

function openEpisodePostView(url, titleHint, replaceViewId, parentViewId) {
    var html = fetchHtml(url);
    var errorViewId = replaceViewId || parentViewId;
    if (!html) {
        if (errorViewId) synura.update(errorViewId, { models: { snackbar: "회차를 불러오지 못했습니다. 다시 시도해 주세요." } });
        return;
    }
    var doc = parseDoc(html);
    var titleId = extractTitleId(url);
    var no = extractEpisodeNo(url);
    var section = webtoonSection(url);
    var pageTitle = doc.querySelector("title");
    if (pageTitle && /페이지\s*없음/.test(pageTitle.textContent || "")) {
        if (webtoonAuthRetrying) throw new Error("WEBTOON_RETRY_FAILED");
        if (errorViewId) synura.update(errorViewId, { models: { snackbar: "회차를 찾을 수 없습니다. 회차 목록을 확인해 주세요." } });
        return;
    }
    var episodeDate = webtoonDateFromDoc(doc) || episodeDates[titleId + ":" + no] || "";

    var titleEl = doc.querySelector(".viewer_fixed .tit") || doc.querySelector(".title_area h2") || doc.querySelector(".title") || doc.querySelector("title");
    var epTitle = (titleEl && titleEl.textContent) ? titleEl.textContent.trim() : (titleHint || "웹툰 보기");

    // Extract comic cuts without using comma-separated selectors in querySelectorAll
    var imgEls = doc.querySelectorAll("img.toon_image");
    if (!imgEls || imgEls.length === 0) {
        var idNodes = doc.querySelectorAll("[id]");
        imgEls = [];
        for (var idIndex = 0; idIndex < idNodes.length; idIndex++) {
            if ((idNodes[idIndex].getAttribute("id") || "").indexOf("toon_") === 0) {
                imgEls.push(idNodes[idIndex]);
            }
        }
    }
    if (!imgEls || imgEls.length === 0) {
        imgEls = doc.querySelectorAll(".wt_viewer img");
    }
    if (!imgEls || imgEls.length === 0) {
        imgEls = doc.querySelectorAll(".toon_view_lst img");
    }

    var blocks = [];
    var seen = {};

    for (var i = 0; i < imgEls.length; i++) {
        var img = imgEls[i];
        var src = img.getAttribute("data-src") || img.getAttribute("src") || "";
        if (!src || src.indexOf("http") !== 0) continue;
        if (src.indexOf("bg_transparency") >= 0 || src.indexOf("age_") >= 0 || src.indexOf("ico_") >= 0 || src.indexOf("banner") >= 0 || src.indexOf("/thumbnail/") >= 0) continue;
        if (seen[src]) continue;
        seen[src] = true;

        blocks.push({
            type: "image",
            value: src,
            headers: { Referer: url }
        });
    }

    // Fallback: search all image-comic.pstatic.net images
    if (blocks.length === 0) {
        var allImgs = doc.querySelectorAll("img");
        for (var j = 0; j < allImgs.length; j++) {
            var fallbackImg = allImgs[j];
            var fallbackSrc = fallbackImg.getAttribute("data-src") || fallbackImg.getAttribute("src") || "";
            if (!fallbackSrc || fallbackSrc.indexOf("http") !== 0) continue;
            if (fallbackSrc.indexOf("image-comic.pstatic.net") >= 0 && fallbackSrc.indexOf("/thumbnail/") < 0) {
                if (seen[fallbackSrc]) continue;
                seen[fallbackSrc] = true;
                blocks.push({
                    type: "image",
                    value: fallbackSrc,
                    headers: { Referer: url }
                });
            }
        }
    }

    // Parse prevArticle and nextArticle from HTML script
    var nextNo = (html.match(/\bnextArticle\s*:\s*\{[^}]*?\bno\s*:\s*['"](\d+)['"]/i) || [])[1];
    var nextSub = (html.match(/\bnextArticle\s*:\s*\{[^}]*?\bsubtitle\s*:\s*['"]([^'"]+)['"]/i) || [])[1];
    var prevNo = (html.match(/\bprevArticle\s*:\s*\{[^}]*?\bno\s*:\s*['"](\d+)['"]/i) || [])[1];
    var prevSub = (html.match(/\bprevArticle\s*:\s*\{[^}]*?\bsubtitle\s*:\s*['"]([^'"]+)['"]/i) || [])[1];

    if (!nextNo && no) {
        var parsedNo = parseInt(no, 10);
        if (!isNaN(parsedNo)) {
            nextNo = String(parsedNo + 1);
        }
    }
    if (!prevNo && no) {
        var parsedPrevNo = parseInt(no, 10);
        if (!isNaN(parsedPrevNo) && parsedPrevNo > 1) {
            prevNo = String(parsedPrevNo - 1);
        }
    }

    var nextUrl = (nextNo && titleId) ? (BASE_URL + "/" + section + "/detail?titleId=" + titleId + "&no=" + nextNo) : "";
    var prevUrl = (prevNo && titleId) ? (BASE_URL + "/" + section + "/detail?titleId=" + titleId + "&no=" + prevNo) : "";

    // Append navigation blocks at the bottom of content
    if (nextUrl) {
        blocks.push({
            type: "link",
            link: nextUrl,
            value: "👉 다음 화 보기" + (nextSub ? (" (" + nextSub + ")") : "")
        });
    }
    if (prevUrl) {
        blocks.push({
            type: "link",
            link: prevUrl,
            value: "👈 이전 화 보기" + (prevSub ? (" (" + prevSub + ")") : "")
        });
    }

    if (blocks.length === 0) {
        blocks.push({
            type: "link",
            link: url,
            value: "웹툰 보러가기: " + epTitle
        });
    }

    var viewerMenus = [];
    if (nextUrl) viewerMenus.push("다음 화");
    if (prevUrl) viewerMenus.push("이전 화");
    viewerMenus.push("첫화보기");
    viewerMenus.push("회차 목록");
    viewerMenus.push("브라우저로 열기");

    var commentPage = fetchEpisodeComments(titleId, no, url, "");
    var contextData = {
        kind: "viewer",
        link: url,
        title: epTitle,
        titleId: titleId,
        section: section,
        firstEpisodeUrl: firstEpisodeUrls[section + ":" + titleId] || "",
        no: no,
        nextUrl: nextUrl,
        nextTitle: nextSub || "다음 화",
        prevUrl: prevUrl,
        prevTitle: prevSub || "이전 화",
        comments: commentPage.comments,
        commentCursor: commentPage.nextCursor,
        commentFailed: commentPage.failed
    };

    var topAnchor = "webtoon_" + titleId + "_" + no;
    blocks.unshift({ type: "anchor", value: topAnchor });
    var viewData = {
        styles: {
            title: epTitle,
            anchor: topAnchor,
            fullWidth: true,
            menu: true
        },
        models: {
            title: epTitle,
            author: "네이버 웹툰",
            date: episodeDate,
            category: "",
            content: blocks,
            comments: commentPage.comments,
            link: url,
            menus: viewerMenus,
            buttons: viewerButtons(contextData),
            snackbar: commentPage.failed ? "댓글을 불러오지 못했습니다. 다시 시도하거나 웹브라우저에서 확인해 주세요." : ""
        }
    };
    var callback = function (e) {
        SYNURA.main.onViewEvent(e.viewId, e);
    };

    if (replaceViewId) {
        synura.close(replaceViewId);
        delete viewStates[replaceViewId];
    }

    viewData.view = "/views/post";
    var res = synura.open(viewData, contextData, callback);
    if (res && res.viewId) {
        viewStates[res.viewId] = contextData;
    }
}

function openSearchView(keyword) {
    var url = BASE_URL + "/search/result?keyword=" + encodeURIComponent(keyword);
    var html = fetchHtml(url);
    var doc = parseDoc(html);
    var toons = [];
    var seen = {};

    var lis = doc.querySelectorAll("ul.toon_lst > li");
    if (!lis || lis.length === 0) {
        lis = doc.querySelectorAll(".section_search_result li");
    }

    for (var i = 0; i < lis.length; i++) {
        var li = lis[i];
        var a = firstWebtoonListLink(li);
        if (!a) continue;
        var href = a.getAttribute("href") || "";
        var titleId = extractTitleId(href);
        if (!titleId || seen[titleId]) continue;
        seen[titleId] = true;

        var fullLink = href.indexOf("http") === 0 ? href : BASE_URL + href;
        var cleanLink = fullLink.split("&week=")[0];

        var titleEl = li.querySelector(".toon_name strong") || li.querySelector(".toon_name") || li.querySelector("h4") || li.querySelector(".title") || li.querySelector("strong");
        var tText = titleEl ? titleEl.textContent.trim() : "웹툰";

        var authorEl = li.querySelector("p.sub_info") || li.querySelector(".author");
        var aText = authorEl ? authorEl.textContent.trim() : "";

        var scoreEl = li.querySelector(".txt_score");
        if (scoreEl && scoreEl.textContent) {
            aText = (aText ? aText + " · " : "") + "★ " + scoreEl.textContent.trim();
        }

        var imgEl = li.querySelector("img");
        var imgSrc = webtoonThumbnailUrl(imgEl ? (imgEl.getAttribute("data-src") || imgEl.getAttribute("src") || "") : "");

        var sub = isSubscribed(titleId);
        toons.push({
            id: "search_" + toons.length,
            titleId: titleId,
            title: tText,
            author: aText,
            avatar: imgSrc,
            mediaUrl: imgSrc,
            thumbnail: imgSrc,
            mediaType: imgSrc ? "image" : "",
            types: [],
            category: "",
            link: cleanLink,
            menus: ["첫화보기", sub ? "구독 취소" : "구독", "브라우저로 열기"]
        });
    }

    synura.open({
        view: "/views/list",
        styles: webtoonListStyles("검색: " + keyword, false),
        models: {
            contents: toons,
            menus: ["검색", "브라우저로 열기"]
        }
    }, { kind: "search", keyword: keyword, link: url, title: "검색: " + keyword }, function (e) {
        SYNURA.main.onViewEvent(e.viewId, e);
    });
}

function showSearchDialog(viewId) {
    synura.open({
        view: "/dialogs/input",
        styles: {
            title: "웹툰 검색",
            message: "검색할 웹툰 제목이나 작가명을 입력하세요.",
            close: true
        },
        models: {
            body: [
                { type: "string", name: "keyword", label: "검색어", value: "" }
            ],
            buttons: ["검색", "취소"]
        }
    }, { from: "search_dialog", parentViewId: viewId || 0 }, function (e) {
        SYNURA.main.onViewEvent(e.viewId, e);
    });
}

function buildHomeItems() {
    var items = [];
    for (var i = 0; i < WEEKDAY_MENUS.length; i++) {
        var m = WEEKDAY_MENUS[i];
        items.push({
            id: m.id,
            title: m.title,
            category: "",
            link: m.link,
            menus: ["브라우저로 열기"]
        });
    }

    var subs = getSubscriptions();
    for (var s = 0; s < subs.length; s++) {
        var sub = subs[s];
        var subAvatar = webtoonThumbnailUrl(sub.avatar);
        items.push({
            id: "sub_" + sub.titleId,
            titleId: sub.titleId,
            title: sub.title,
            author: sub.author,
            avatar: subAvatar,
            mediaUrl: subAvatar,
            thumbnail: subAvatar,
            mediaType: subAvatar ? "image" : "",
            types: [],
            link: sub.link,
            category: "",
            menus: ["첫화보기", "구독 취소", "브라우저로 열기"]
        });
    }
    return items;
}

function refreshWebtoonHomeView(viewId, context) {
    var items = buildHomeItems();
    var signature = JSON.stringify(items);
    var changed = context.homeSignature !== signature;
    var update = { styles: { layout: "list", media: true } };
    if (changed) update.models = { contents: items };
    var result = synura.update(viewId, update);
    if (result && result.success === false) {
        delete viewStates[viewId];
        return;
    }
    if (changed) {
        context.homeSignature = signature;
        viewStates[viewId] = context;
        synura.connect(viewId, context, function (e) {
            SYNURA.main.onViewEvent(e.viewId, e);
        });
    }
}

function refreshWebtoonHomeViews() {
    var ids = Object.keys(viewStates);
    for (var i = 0; i < ids.length; i++) {
        if (viewStates[ids[i]].kind !== "home") continue;
        refreshWebtoonHomeView(Number(ids[i]), viewStates[ids[i]]);
    }
}

var handler = {
    home: function () {
        var items = buildHomeItems();
        var contextData = {
            kind: "home",
            link: BASE_URL + "/webtoon/weekday",
            homeSignature: JSON.stringify(items)
        };
        var res = synura.open({
            view: "/views/list",
            styles: webtoonListStyles("네이버 웹툰", false, { layout: "list" }),
            models: {
                contents: items,
                menus: ["검색", "새로고침", "브라우저로 열기"]
            }
        }, contextData, function (e) {
            SYNURA.main.onViewEvent(e.viewId, e);
        });

        if (res && res.viewId) {
            viewStates[res.viewId] = contextData;
        }
    },

    resume: function (viewId, context) {
        var current = viewStates[viewId];
        if (context && !(current && current.kind === "home" && context.kind === "home")) {
            current = viewStates[viewId] = context;
        }
        current = current || {};
        synura.connect(viewId, current, function (e) {
            SYNURA.main.onViewEvent(e.viewId, e);
        });
        handler.onViewEvent(viewId, { eventId: "RESUME", context: current });
    },

    onViewEvent: function (viewId, event) {
        if (!event) return;
        var ctx = (viewStates[viewId] || event.context || {});

        if ((event.eventId === "LOAD" || event.eventId === "RESUME") &&
            (ctx.kind === "home" || ctx.kind === "weekday" || ctx.kind === "search" || ctx.kind === "episodes")) {
            viewStates[viewId] = ctx;
            if (ctx.kind === "home") {
                if (event.eventId === "RESUME") refreshWebtoonHomeView(viewId, ctx);
                return;
            }
            var listStyles = { media: true };
            if (ctx.kind === "weekday") listStyles.menu = false;
            if (ctx.kind === "episodes") listStyles.history = true;
            synura.update(viewId, { styles: listStyles });
            return;
        }

        // 1. CLICK EVENT
        if (event.eventId === "CLICK") {
            var link = event.data ? event.data.link : "";
            var title = event.data ? event.data.title : "";
            if (!link) return;

            if (webtoonContentUrl(link, "detail")) {
                openEpisodePostView(link, title, ctx.kind === "viewer" ? viewId : undefined);
            } else if (webtoonContentUrl(link, "list")) {
                openEpisodeListView(link, title);
            } else if (link.indexOf("/webtoon/weekday") >= 0 || link.indexOf("/webtoon/finish") >= 0) {
                openWeekdayView(link, title);
            } else {
                synura.open({
                    view: "/views/browser",
                    styles: { title: title || "브라우저" },
                    models: { url: link }
                });
            }
            return;
        }

        // 2. VIEW MENU CLICK
        if (event.eventId === "MENU_CLICK" || event.eventId === "MENU") {
            var menu = event.data ? event.data.menu : "";
            if (menu === "검색") {
                showSearchDialog(viewId);
                return;
            }
            if (menu === "새로고침") {
                if (ctx.kind === "home") {
                    refreshWebtoonHomeView(viewId, ctx);
                }
                return;
            }
            if (menu === "첫화보기") {
                openFirstEpisode(viewId, ctx, ctx);
                return;
            }
            if (menu === "다음 화") {
                if (ctx.nextUrl) {
                    openEpisodePostView(ctx.nextUrl, ctx.nextTitle || "다음 화", viewId);
                }
                return;
            }
            if (menu === "이전 화") {
                if (ctx.prevUrl) {
                    openEpisodePostView(ctx.prevUrl, ctx.prevTitle || "이전 화", viewId);
                }
                return;
            }
            if (menu === "회차 목록") {
                var tid = ctx.titleId || extractTitleId(ctx.link);
                if (tid) {
                    openEpisodeListView(BASE_URL + "/" + webtoonSection(ctx.link) + "/list?titleId=" + tid, ctx.title || "회차 목록");
                }
                return;
            }
            if (menu === "구독" || menu === "구독 취소") {
                var tid = ctx.titleId || extractTitleId(ctx.link);
                if (tid) {
                    var nowSub = toggleSubscription({
                        titleId: tid,
                        title: ctx.title,
                        author: ctx.author,
                        avatar: ctx.avatar,
                        link: ctx.link
                    });
                    synura.update(viewId, {
                        models: {
                            menus: ["첫화보기", nowSub ? "구독 취소" : "구독", "브라우저로 열기"],
                            snackbar: nowSub ? "구독 목록에 추가되었습니다." : "구독이 취소되었습니다."
                        }
                    });
                }
                return;
            }
            if (menu === "브라우저로 열기" && ctx.link) {
                synura.open({
                    view: "/views/browser",
                    styles: { title: ctx.title || "브라우저" },
                    models: { url: ctx.link }
                });
                return;
            }
        }

        // 3. ITEM MENU CLICK (3-dots on item)
        if (event.eventId === "ITEM_MENU_CLICK") {
            var itemMenu = event.data ? event.data.menu : "";
            var itemData = event.data || {};
            var itemTid = itemData.titleId || extractTitleId(itemData.link);

            if (itemMenu === "첫화보기") {
                openFirstEpisode(viewId, itemData, ctx);
                return;
            }
            if (itemMenu === "구독" || itemMenu === "구독 취소") {
                if (itemTid) {
                    var nowSub = toggleSubscription({
                        titleId: itemTid,
                        title: itemData.title,
                        author: itemData.author,
                        avatar: itemData.avatar,
                        link: itemData.link
                    });
                    synura.update(viewId, {
                        models: {
                            snackbar: nowSub ? ((itemData.title || "웹툰") + "을(를) 구독했습니다.") : ((itemData.title || "웹툰") + " 구독을 취소했습니다.")
                        }
                    });
                }
                return;
            }
            if (itemMenu === "브라우저로 열기" && itemData.link) {
                synura.open({
                    view: "/views/browser",
                    styles: { title: itemData.title || "브라우저" },
                    models: { url: itemData.link }
                });
                return;
            }
        }

        // 4. PAGINATION (SCROLL_TO_END / APPEND)
        if (event.eventId === "SCROLL_TO_END" || event.eventId === "APPEND") {
            if (ctx.kind === "viewer") {
                if (!ctx.commentFailed) loadMoreEpisodeComments(viewId, ctx);
                return;
            }
            if (ctx.kind === "episodes" && ctx.titleId) {
                var nextPage = (ctx.page || 1) + 1;
                var pageUrl = BASE_URL + "/" + webtoonSection(ctx.link) + "/list?titleId=" + ctx.titleId + "&page=" + nextPage;
                var html = fetchHtml(pageUrl);
                var doc = parseDoc(html);
                ctx.seenMap = ctx.seenMap || {};
                var newEpisodes = parseEpisodesFromDoc(doc, BASE_URL, ctx.seenMap);

                if (newEpisodes.length > 0) {
                    ctx.page = nextPage;
                    viewStates[viewId] = ctx;
                    synura.update(viewId, {
                        styles: { media: true },
                        models: { append: newEpisodes }
                    });
                } else {
                    synura.update(viewId, {
                        styles: { media: true, pagination: false },
                        models: { snackbar: "마지막 회차입니다." }
                    });
                }
                return;
            }
        }

        // 5. POST BUTTON / DIALOG SUBMIT
        if (event.eventId === "SUBMIT") {
            if (ctx.kind === "viewer" && event.data && event.data.button === BUTTON_BROWSER && ctx.link) {
                synura.open({
                    view: "/views/browser",
                    styles: { title: ctx.title || "네이버 웹툰" },
                    models: { url: ctx.link }
                });
                return;
            }
            if (ctx.kind === "viewer" && event.data &&
                (event.data.button === BUTTON_MORE_COMMENTS || event.data.button === BUTTON_RETRY_COMMENTS)) {
                loadMoreEpisodeComments(viewId, ctx);
                return;
            }
            if (ctx.from === "search_dialog") {
                var btn = event.data ? event.data.button : "";
                var keyword = event.data ? (event.data.keyword || "") : "";
                synura.close(viewId);
                if (btn !== "취소" && keyword.trim()) {
                    openSearchView(keyword.trim());
                }
                return;
            }
        }
    },

    deeplink: function (url) {
        if (!url || url.indexOf("comic.naver.com") < 0) return false;
        if (webtoonContentUrl(url, "detail")) {
            openEpisodePostView(url, "웹툰");
            return true;
        }
        if (webtoonContentUrl(url, "list")) {
            openEpisodeListView(url, "웹툰");
            return true;
        }
        if (url.indexOf("/webtoon/weekday") >= 0 || url.indexOf("/webtoon/finish") >= 0) {
            openWeekdayView(url, "네이버 웹툰");
            return true;
        }
        return false;
    }
};

function webtoonOpenLoginBrowser(targetUrl, action) {
    var ids = Object.keys(viewStates);
    for (var i = 0; i < ids.length; i++) {
        var pending = viewStates[ids[i]];
        if (pending.kind !== "webtoon_login" || pending.targetUrl !== targetUrl) continue;
        var existing = synura.update(Number(ids[i]), { models: {
            snackbar: "로그인과 연령 확인을 마친 뒤 상단 확인을 눌러 주세요."
        } });
        if (existing && existing.success) return existing;
        delete viewStates[ids[i]];
    }
    var context = { kind: "webtoon_login", targetUrl: targetUrl, action: action };
    var result = synura.open({
        view: "/views/browser",
        styles: { title: "네이버 로그인 · 연령 확인" },
        models: { url: targetUrl }
    }, context, function (event) {
        SYNURA.main.onViewEvent(event.viewId, event);
    });
    if (result && result.success) viewStates[result.viewId] = context;
    return result;
}

function webtoonRetryLoginAction(action) {
    var previous = webtoonAuthRetrying;
    webtoonAuthRetrying = true;
    try {
        if (action.kind === "deeplink") return webtoonOriginalDeeplink(action.url);
        if (action.kind === "search") return openSearchView(action.keyword);
        return webtoonOriginalViewEvent(action.viewId, {
            viewId: action.viewId,
            eventId: action.eventId,
            data: action.data,
            context: action.context
        });
    } finally {
        webtoonAuthRetrying = previous;
    }
}

function webtoonHandleLoginEvent(viewId, event, context) {
    if (event.eventId === "CLOSE") {
        delete viewStates[viewId];
        return;
    }
    if (event.eventId !== "SUBMIT") return;
    var data = event.data || {};
    var cookie = typeof data.cookies === "string" ? data.cookies.trim() : "";
    var cookieUrlAllowed = !data.url || webtoonCookieHost(data.url) ||
        /^https?:\/\/nid\.naver\.com(?:[/:?#]|$)/i.test(String(data.url));
    if (!cookie || /[\r\n\0]/.test(cookie) || !cookieUrlAllowed) {
        synura.update(viewId, { models: { snackbar: "쿠키를 가져오지 못했습니다. 로그인과 연령 확인을 마친 뒤 상단 확인을 다시 눌러 주세요." } });
        return;
    }
    localStorage.setItem(WEBTOON_COOKIE_KEY, cookie);
    try {
        webtoonRetryLoginAction(context.action);
        synura.close(viewId);
        delete viewStates[viewId];
    } catch (error) {
        synura.update(viewId, { models: {
            snackbar: error && error.webtoonLoginRequired
                ? "아직 로그인 또는 연령 확인이 필요합니다. 브라우저에서 완료한 뒤 상단 확인을 다시 눌러 주세요."
                : "원래 페이지를 불러오지 못했습니다. 상단 확인을 눌러 다시 시도해 주세요."
        } });
    }
}

var webtoonOriginalViewEvent = handler.onViewEvent;
handler.onViewEvent = function (viewId, event) {
    if (!event) return;
    var context = viewStates[viewId] || event.context || {};
    if (context.kind === "webtoon_login") {
        webtoonHandleLoginEvent(viewId, event, context);
        return;
    }
    try {
        return webtoonOriginalViewEvent(viewId, event);
    } catch (error) {
        if (!error || !error.webtoonLoginRequired) throw error;
        if (context.from === "search_dialog" && event.eventId === "SUBMIT") {
            return webtoonOpenLoginBrowser(error.targetUrl, {
                kind: "search",
                keyword: String((event.data || {}).keyword || "").trim()
            });
        }
        return webtoonOpenLoginBrowser(error.targetUrl, {
            kind: "event",
            viewId: viewId,
            eventId: event.eventId,
            data: event.data || {},
            context: context
        });
    }
};

var webtoonOriginalDeeplink = handler.deeplink;
handler.deeplink = function (url) {
    try {
        return webtoonOriginalDeeplink(url);
    } catch (error) {
        if (!error || !error.webtoonLoginRequired) throw error;
        webtoonOpenLoginBrowser(error.targetUrl, { kind: "deeplink", url: url });
        return true;
    }
};
