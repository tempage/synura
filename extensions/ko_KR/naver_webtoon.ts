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
    version: 0.7,
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
var PAID_EPISODE_NOTICE = "유료 회차는 로그인한 계정의 유효한 구매 또는 대여 권한이 필요합니다.";

// Shared viewer client settings; account cookies and device IDs are separate.
var WEBTOON_VIEWER_HMAC_KEY = "PTgNYfPDlFeiWm7wGxY5VCFkbcHWZbwleeEfDFpsRxzyHHmZIY5taMNBLQDgxi2T";
var WEBTOON_VIEWER_DRM_HMAC_KEY = "5OYnVJbYCTY1A6rVjBP9AqD6F9r8PRyeOR-43IbTIOs";
var WEBTOON_VIEWER_IMAGE_BASE_KEY = "wqQz3o9gS4N5KT80BjV9PwOrjtcumweSf1OlT0Wz2JM=";
var WEBTOON_VIEWER_KEYS_STORAGE = "naver_webtoon:viewer_keys";

function webtoonViewerKeyDefaults() {
    return {
        hmacKey: WEBTOON_VIEWER_HMAC_KEY,
        drmHmacKey: WEBTOON_VIEWER_DRM_HMAC_KEY,
        imageBaseKey: WEBTOON_VIEWER_IMAGE_BASE_KEY
    };
}

function webtoonViewerConfigError() {
    var error = new Error("웹툰 뷰어 키 설정을 확인해 주세요.");
    error.viewerConfigRequired = true;
    return error;
}

function validateWebtoonViewerKeys(keys) {
    if (!keys || typeof keys !== "object" || Array.isArray(keys)) throw webtoonViewerConfigError();
    var fields = ["hmacKey", "drmHmacKey", "imageBaseKey"];
    for (var i = 0; i < fields.length; i++) {
        var value = keys[fields[i]];
        if (typeof value !== "string" || !value || value.length > 16384 || /[\x00-\x1f\x7f]/.test(value)) {
            throw webtoonViewerConfigError();
        }
    }
    // 32 bytes encoded as canonical, padded Base64. Avoid relying on atob.
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    if (!/^[A-Za-z0-9+/]{43}=$/.test(keys.imageBaseKey) ||
        alphabet.indexOf(keys.imageBaseKey.charAt(42)) % 4 !== 0) {
        throw webtoonViewerConfigError();
    }
    return keys;
}

function webtoonViewerKeys() {
    var keys = webtoonViewerKeyDefaults();
    var saved;
    try {
        var raw = localStorage.getItem(WEBTOON_VIEWER_KEYS_STORAGE);
        saved = raw ? JSON.parse(raw) : {};
    } catch (_) {
        throw webtoonViewerConfigError();
    }
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) throw webtoonViewerConfigError();
    var fields = Object.keys(saved);
    for (var i = 0; i < fields.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(keys, fields[i])) throw webtoonViewerConfigError();
        keys[fields[i]] = saved[fields[i]];
    }
    return validateWebtoonViewerKeys(keys);
}

function getWebtoonViewerConfig() {
    var keys = webtoonViewerKeys();
    return {
        hmac: { key: keys.hmacKey, consumerId: "comic-viewer.series-comic-viewer", version: "0" },
        rtdrmHmac: { key: keys.drmHmacKey, keyId: "PCVIEWER" },
        imageBaseKey: keys.imageBaseKey,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) comic-viewer-electron/1.0.13 Chrome/108.0.5359.215 Electron/22.3.27 Safari/537.36 NaverSeriesPC/1.0.13 (x64;10.0.19045))",
        packageId: "series_pc"
    };
}

function webtoonOpenViewerSettings(parentViewId) {
    var keys;
    var invalid = false;
    try { keys = webtoonViewerKeys(); }
    catch (_) { keys = webtoonViewerKeyDefaults(); invalid = true; }
    var context = { kind: "viewer_settings", parentViewId: parentViewId || 0 };
    var result = synura.open({
        view: "/views/settings",
        styles: {
            title: "웹툰 뷰어 설정",
            message: "필요할 때 뷰어 키를 변경할 수 있습니다. 빈 칸은 기본값을 사용합니다."
        },
        models: {
            body: [
                { type: "string", name: "hmacKey", label: "Series 서명 키", format: "password", value: keys.hmacKey },
                { type: "string", name: "drmHmacKey", label: "이미지 서버 서명 키", format: "password", value: keys.drmHmacKey },
                { type: "string", name: "imageBaseKey", label: "이미지 경로 키 (Base64)", format: "password", value: keys.imageBaseKey }
            ],
            buttons: ["저장", "기본값 복원", "취소"],
            snackbar: invalid ? "저장된 설정을 읽지 못해 기본값을 표시합니다. 저장하거나 기본값을 복원해 주세요." : ""
        }
    }, context, async function (event) {
        return (await SYNURA.main.onViewEvent(event.viewId, event));
    });
    if (result && result.viewId) viewStates[result.viewId] = context;
    return result;
}

function handleWebtoonViewerSettings(viewId, event, context) {
    if (event.eventId === "CLOSE") {
        delete viewStates[viewId];
        return;
    }
    if (event.eventId !== "SUBMIT") return;
    var data = event.data || {};
    if (data.button === "취소") {
        synura.close(viewId);
        delete viewStates[viewId];
        return;
    }
    if (data.button !== "저장" && data.button !== "기본값 복원") return;
    try {
        if (data.button === "기본값 복원") {
            localStorage.removeItem(WEBTOON_VIEWER_KEYS_STORAGE);
        } else {
            var defaults = webtoonViewerKeyDefaults();
            var keys = {};
            var fields = Object.keys(defaults);
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                if (data[field] !== undefined && typeof data[field] !== "string") throw webtoonViewerConfigError();
                keys[field] = data[field] === undefined || data[field] === "" ? defaults[field] : data[field];
            }
            validateWebtoonViewerKeys(keys);
            var overrides = {};
            for (var j = 0; j < fields.length; j++) {
                if (keys[fields[j]] !== defaults[fields[j]]) overrides[fields[j]] = keys[fields[j]];
            }
            if (Object.keys(overrides).length) localStorage.setItem(WEBTOON_VIEWER_KEYS_STORAGE, JSON.stringify(overrides));
            else localStorage.removeItem(WEBTOON_VIEWER_KEYS_STORAGE);
        }
    } catch (_) {
        synura.update(viewId, { models: { snackbar: "설정을 저장하지 못했습니다. 서명 키와 32바이트 Base64 이미지 경로 키를 확인해 주세요." } });
        return;
    }
    invalidateWebtoonPaidViews("설정이 변경되었습니다. 다시 불러와 주세요.");
    synura.close(viewId);
    delete viewStates[viewId];
    if (context.parentViewId) {
        synura.update(context.parentViewId, { models: { snackbar: data.button === "기본값 복원" ? "뷰어 키를 기본값으로 복원했습니다." : "뷰어 설정을 저장했습니다." } });
    }
}

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
var webtoonSeriesTitles = {};
var webtoonEpisodeTitles = {};
var firstEpisodeUrls = {};
var previewItemsMap = {};
var webtoonAuthRetrying = false;
var webtoonPaidLoads = {};
var BUTTON_PAID_RETRY = "다시 불러오기";
var BUTTON_VIEWER_SETTINGS = "뷰어 설정";

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

function cleanWebtoonTitle(value) {
    var title = String(value || "").replace(/\s+/g, " ").trim()
        .replace(/\s*(?:::|[|:])\s*네이버\s*웹툰\s*$/i, "").trim();
    return /^(?:네이버\s*웹툰|웹툰|웹툰 보기|회차 목록|다음 화|이전 화|첫화)$/.test(title) ? "" : title;
}

function webtoonSeriesTitleFromScript(doc, titleId) {
    var scripts = doc.querySelectorAll("script");
    for (var i = 0; i < scripts.length; i++) {
        var source = scripts[i].textContent || "";
        var blocks = /\b(?:title|article)\s*:\s*\{([^}]*)\}/g;
        var block;
        while ((block = blocks.exec(source))) {
            var id = /\btitleId\s*:\s*["']?(\d+)/.exec(block[1]);
            if (!id || id[1] !== titleId) continue;
            var name = /\btitleName\s*:\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/.exec(block[1]);
            if (!name) continue;
            var value = (name[1] !== undefined ? name[1] : name[2])
                .replace(/\\u([0-9a-f]{4})/gi, function (_, hex) { return String.fromCharCode(parseInt(hex, 16)); })
                .replace(/\\([\\'"])/g, "$1").replace(/\\[nrt]/g, " ");
            var title = cleanWebtoonTitle(value);
            if (title) return title;
        }
    }
    return "";
}

function webtoonEpisodeMetadata(doc, url, titleHint, context) {
    var titleId = extractTitleId(url);
    var no = extractEpisodeNo(url);
    var seriesKey = webtoonSection(url) + ":" + titleId;
    var episodeKey = seriesKey + ":" + no;
    var inheritedTitle = "";
    if (context && context.titleId === titleId && webtoonSection(context.link) === webtoonSection(url)) {
        inheritedTitle = context.seriesTitle || (context.kind === "episodes" ? context.title : "");
    }
    var titleNode = doc.querySelector(".viewer_fixed .tit") || doc.querySelector(".title_area h2");
    var pageNode = doc.querySelector("title");
    var ogNode = doc.querySelector("meta[property='og:title']");
    var descriptionNode = doc.querySelector("meta[property='og:description']");
    var ogTitle = cleanWebtoonTitle(ogNode && ogNode.getAttribute("content"));
    var description = cleanWebtoonTitle(descriptionNode && descriptionNode.getAttribute("content"));
    var pageTitle = cleanWebtoonTitle(pageNode && pageNode.textContent);
    var seriesTitle = webtoonSeriesTitleFromScript(doc, titleId) ||
        cleanWebtoonTitle(inheritedTitle) || webtoonSeriesTitles[seriesKey] || "";
    var episodeTitle = cleanWebtoonTitle(titleNode && titleNode.textContent);
    if (!episodeTitle && description && ogTitle.endsWith(" - " + description)) episodeTitle = description;
    if (!episodeTitle && pageTitle !== ogTitle) episodeTitle = pageTitle;
    if (episodeTitle && ogTitle.endsWith(" - " + episodeTitle)) {
        seriesTitle = ogTitle.substring(0, ogTitle.length - episodeTitle.length - 3).trim();
    }
    if (seriesTitle && ogTitle.indexOf(seriesTitle + " - ") === 0) {
        episodeTitle = ogTitle.substring(seriesTitle.length + 3).trim();
    }
    episodeTitle = episodeTitle || webtoonEpisodeTitles[episodeKey] || cleanWebtoonTitle(titleHint);
    var title = seriesTitle && episodeTitle
        ? (episodeTitle.indexOf(seriesTitle + " - ") === 0 ? episodeTitle : seriesTitle + " - " + episodeTitle)
        : ogTitle || pageTitle || episodeTitle || seriesTitle;
    if (seriesTitle) webtoonSeriesTitles[seriesKey] = seriesTitle;
    if (episodeTitle) webtoonEpisodeTitles[episodeKey] = episodeTitle;
    return { title: title, seriesTitle: seriesTitle, episodeTitle: episodeTitle };
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

async function webtoonFetch(url, headers, method, body) {
    var requestHeaders = {};
    var source = headers || FETCH_HEADERS;
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; i++) requestHeaders[keys[i]] = source[keys[i]];
    var cookie = localStorage.getItem(WEBTOON_COOKIE_KEY);
    if (webtoonCookieHost(url) && typeof cookie === "string" && cookie && !/[\r\n\0]/.test(cookie)) {
        var csrf = requestHeaders["X-XSRF-TOKEN"] || "";
        if (csrf && cookie.indexOf("XSRF-TOKEN=") < 0) {
            cookie = cookie + "; XSRF-TOKEN=" + csrf;
        } else if (csrf && cookie.indexOf("XSRF-TOKEN=") >= 0) {
            cookie = cookie.replace(/XSRF-TOKEN=[^;]*/, "XSRF-TOKEN=" + csrf);
        }
        requestHeaders.Cookie = cookie;
    }
    var options = { headers: requestHeaders };
    if (method) options.method = method;
    if (body != null) options.body = body;
    if ((method && !/^(GET|HEAD)$/i.test(method)) || keys.some(function (key) {
        return key.toLowerCase() === "x-xsrf-token";
    })) options.redirect = "error";
    return (await fetch(url, options));
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

async function fetchHtml(url) {
    try {
        var resp = (await webtoonFetch(url));
        var html = resp ? (await resp.text()) : "";
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

async function openFirstEpisode(viewId, item, context) {
    var titleId = item.titleId || extractTitleId(item.link);
    var section = webtoonSection(item.link);
    var key = section + ":" + titleId;
    var seriesTitle = item.seriesTitle || (webtoonContentUrl(item.link, "list") ? item.title : "");
    if (cleanWebtoonTitle(seriesTitle)) webtoonSeriesTitles[key] = cleanWebtoonTitle(seriesTitle);
    var url = item.firstEpisodeUrl || firstEpisodeUrls[key] || "";
    if (!titleId) {
        synura.update(viewId, { models: { snackbar: "작품 정보를 확인하지 못했습니다." } });
        return;
    }
    if (!url) {
        var listUrl = BASE_URL + "/" + section + "/list?titleId=" + titleId + "&page=1";
        var html = (await fetchHtml(listUrl));
        if (html) {
            var listDoc = parseDoc(html);
            url = webtoonFirstEpisodeUrlFromDoc(listDoc, listUrl);
            var listTitle = listDoc.querySelector(".area_info .title");
            if (listTitle && cleanWebtoonTitle(listTitle.textContent)) webtoonSeriesTitles[key] = cleanWebtoonTitle(listTitle.textContent);
        }
    }
    if (!url) {
        try {
            var response = (await webtoonFetch("https://comic.naver.com/api/article/list?titleId=" + titleId + "&page=1&sort=ASC"));
            var body = response ? (await response.text()) : "";
            if (webtoonNeedsLogin(response, body) || response && response.status === 401) throw webtoonLoginError(listUrl);
            if ((!response || response.status !== 200) && webtoonAuthRetrying) throw new Error("WEBTOON_RETRY_FAILED");
            var data = response && response.status === 200 ? JSON.parse(body) : null;
            var first = data && Array.isArray(data.articleList) && data.articleList[0];
            if (first && /^\d+$/.test(String(first.no))) {
                url = BASE_URL + "/" + section + "/detail?titleId=" + titleId + "&no=" + first.no;
                if (cleanWebtoonTitle(first.subtitle)) webtoonEpisodeTitles[key + ":" + first.no] = cleanWebtoonTitle(first.subtitle);
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
    (await openEpisodePostView(url, "", context.kind === "viewer" ? viewId : undefined, viewId));
}

async function fetchEpisodeComments(titleId, no, episodeUrl, cursor) {
    if (!titleId || !no) return { comments: [], nextCursor: "", failed: false };
    var commentSection = webtoonSection(episodeUrl) === "webtoon" ? "webtoon" : "challenge";
    var apiUrl = BASE_URL + "/comment/api/community/v2/posts?pageId=" +
        encodeURIComponent(commentSection + "_" + titleId + "_" + no) +
        "&prevSize=0&nextSize=20&pinRepresentation=none&displayBlindCommentAsService=false";
    if (cursor) apiUrl += "&cursor=" + encodeURIComponent(cursor);
    try {
        var response = (await webtoonFetch(apiUrl, {
            "Accept": "application/json",
            "Service-Ticket-Id": "comic_" + commentSection,
            "Referer": BASE_URL + "/scrolltoon/comment?titleId=" + titleId + "&no=" + no
        }));
        if (!response || response.status !== 200) throw new Error("댓글 요청 실패");
        var data = JSON.parse((await response.text()));
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

async function loadMoreEpisodeComments(viewId, context) {
    if (!context.commentCursor && !context.commentFailed) return;
    var page = (await fetchEpisodeComments(context.titleId, context.no, context.link, context.commentCursor));
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

function formatFreeConvertDate(dateStr) {
    if (!dateStr) return "";
    var match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return "";
    var targetYear = parseInt(match[1], 10);
    var targetMonth = parseInt(match[2], 10);
    var targetDay = parseInt(match[3], 10);

    // KST current date (UTC + 9 hours)
    var now = new Date();
    var nowUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
    var nowKst = new Date(nowUtc + (9 * 3600000));
    var curYear = nowKst.getFullYear();
    var curMonth = nowKst.getMonth() + 1;
    var curDay = nowKst.getDate();

    var targetEpochDays = Math.floor(Date.UTC(targetYear, targetMonth - 1, targetDay) / 86400000);
    var curEpochDays = Math.floor(Date.UTC(curYear, curMonth - 1, curDay) / 86400000);
    var diffDays = targetEpochDays - curEpochDays;

    if (diffDays <= 0) return "오늘밤";
    return diffDays + "일 후";
}

async function fetchPreviewVolumesInfo(doc, titleId, contentsNo, volumeNos) {
    var info = {};
    if (!contentsNo || !volumeNos || volumeNos.length === 0) return info;

    var csrfMeta = doc.querySelector("meta[name='csrf-token']");
    var csrfToken = csrfMeta ? (csrfMeta.getAttribute("content") || "") : "";

    try {
        var bodyParts = [
            "containUserRight=true",
            "contentsNo=" + encodeURIComponent(contentsNo)
        ];
        for (var i = 0; i < volumeNos.length; i++) {
            bodyParts.push("volumeNos=" + encodeURIComponent(volumeNos[i]));
        }

        var headers = {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Referer": BASE_URL + "/webtoon/list?titleId=" + titleId
        };
        if (csrfToken) headers["X-XSRF-TOKEN"] = csrfToken;

        var resp = (await webtoonFetch(BASE_URL + "/api/store/linkedCostVolumesInfo", headers, "POST", bodyParts.join("&")));
        if (resp && resp.status === 200) {
            var data = JSON.parse((await resp.text()));
            if (data && data.result && Array.isArray(data.result.volumeList)) {
                var list = data.result.volumeList;
                for (var j = 0; j < list.length; j++) {
                    var item = list[j];
                    if (item && item.volumeNo != null) {
                        var vKey = String(item.volumeNo);
                        var isOwned = !!(item.userVolume && (item.userVolume.buyType === "LEND" || item.userVolume.buyType === "BUY"));
                        info[vKey] = {
                            cookieCount: typeof item.lendPassCount === "number" ? item.lendPassCount : 3,
                            isOwned: isOwned,
                            buyType: item.userVolume ? item.userVolume.buyType : "",
                            rightEndString: item.userVolume ? (item.userVolume.rightEndString || "") : ""
                        };
                    }
                }
            }
        }
    } catch (e) {
        // Fallback to default
    }
    return info;
}

async function parsePreviewEpisodesFromDoc(doc, baseUrl, seenMap) {
    var previewItems = doc.querySelectorAll(".toon_preview li.item");
    if (!previewItems || previewItems.length === 0) return [];

    var titleId = extractTitleId(baseUrl);
    var contentsNo = "";
    var volumeNos = [];
    var itemsData = [];

    for (var i = 0; i < previewItems.length; i++) {
        var li = previewItems[i];
        var itemTitleId = li.getAttribute("data-title-id") || titleId;
        var no = li.getAttribute("data-no") || li.getAttribute("data-article-no") || "";
        var itemContentsNo = li.getAttribute("data-contents-no") || "";
        var volumeNo = li.getAttribute("data-volume-no") || "";
        if (!/^\d+$/.test(itemTitleId) || !/^\d+$/.test(no)) continue;
        var freeConvertDate = li.getAttribute("data-free-convert-date") || "";

        if (itemContentsNo && !contentsNo) contentsNo = itemContentsNo;
        if (volumeNo && volumeNos.indexOf(volumeNo) < 0) volumeNos.push(volumeNo);

        var titleEl = li.querySelector(".title .name strong") || li.querySelector(".title .name") || li.querySelector(".title") || li.querySelector("strong");
        var epTitle = titleEl && titleEl.textContent ? titleEl.textContent.trim() : ("미리보기 " + no + "화");
        if (titleEl && cleanWebtoonTitle(titleEl.textContent)) webtoonEpisodeTitles["webtoon:" + itemTitleId + ":" + no] = cleanWebtoonTitle(titleEl.textContent);

        var imgEl = li.querySelector(".thumbnail img") || li.querySelector("img");
        var imgSrc = webtoonThumbnailUrl(imgEl ? (imgEl.getAttribute("data-src") || imgEl.getAttribute("src") || "") : "");
        var scoreEl = li.querySelector(".score");
        var scoreText = scoreEl && scoreEl.textContent ? ("★ " + scoreEl.textContent.trim()) : "";

        var fullLink = BASE_URL + "/webtoon/detail?titleId=" + itemTitleId + "&no=" + no;
        if (seenMap && seenMap[fullLink]) continue;
        if (seenMap) seenMap[fullLink] = true;

        itemsData.push({
            titleId: itemTitleId,
            no: no,
            contentsNo: itemContentsNo,
            volumeNo: volumeNo,
            freeConvertDate: freeConvertDate,
            epTitle: epTitle,
            imgSrc: imgSrc,
            scoreText: scoreText,
            fullLink: fullLink
        });
    }

    var volumesInfo = (await fetchPreviewVolumesInfo(doc, titleId, contentsNo, volumeNos));

    var episodes = [];
    for (var k = 0; k < itemsData.length; k++) {
        var d = itemsData[k];
        var vInfo = volumesInfo[d.volumeNo] || {};
        var count = vInfo.cookieCount || 3;
        var isOwned = !!vInfo.isOwned;

        var dateStr = normalizeWebtoonDate(d.freeConvertDate) || "";
        var freeDays = formatFreeConvertDate(d.freeConvertDate);
        var dateDisplay = dateStr ? (dateStr + (freeDays ? " " + freeDays : "")) : freeDays;

        var memoText = isOwned
            ? (vInfo.buyType === "BUY" ? "소장" : (vInfo.rightEndString ? ("대여중 (" + vInfo.rightEndString + ")") : "대여중"))
            : ("쿠키 " + count + "개");

        var previewItem = {
            id: "ep_preview_" + d.fullLink,
            title: d.epTitle,
            author: d.scoreText,
            avatar: d.imgSrc,
            mediaUrl: d.imgSrc,
            thumbnail: d.imgSrc,
            mediaType: d.imgSrc ? "image" : "",
            types: [],
            category: "",
            memo: memoText,
            date: dateDisplay,
            link: d.fullLink,
            preview: true,
            isOwned: isOwned,
            titleId: d.titleId,
            no: d.no,
            contentsNo: d.contentsNo,
            volumeNo: d.volumeNo,
            cookieCount: count,
            freeConvertDate: d.freeConvertDate,
            menus: ["첫화보기", "브라우저로 열기"]
        };
        previewItemsMap[d.fullLink] = previewItem;
        episodes.push(previewItem);
    }

    return episodes;
}

async function parseEpisodesFromDoc(doc, baseUrl, seenMap, isFirstPage) {
    var episodes = [];

    if (isFirstPage) {
        var previewEps = (await parsePreviewEpisodesFromDoc(doc, baseUrl, seenMap));
        for (var p = 0; p < previewEps.length; p++) {
            episodes.push(previewEps[p]);
        }
    }

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
        if (epTitleEl && cleanWebtoonTitle(epTitleEl.textContent)) {
            webtoonEpisodeTitles[webtoonSection(fullLink) + ":" + extractTitleId(fullLink) + ":" + extractEpisodeNo(fullLink)] = cleanWebtoonTitle(epTitleEl.textContent);
        }
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

async function openWeekdayView(url, title) {
    var html = (await fetchHtml(url));
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
    }, { kind: "weekday", link: url, title: title }, async function (e) {
        return (await SYNURA.main.onViewEvent(e.viewId, e));
    });
}

async function openEpisodeListView(url, titleHint) {
    var fetchUrl = url.split("&week=")[0];
    var titleId = extractTitleId(fetchUrl);
    var section = webtoonSection(fetchUrl);
    var targetUrl = BASE_URL + "/" + section + "/list?titleId=" + titleId + "&page=1";
    var html = (await fetchHtml(targetUrl));
    var doc = parseDoc(html);

    var titleEl = doc.querySelector(".area_info .title") || doc.querySelector(".title");
    var toonTitle = (titleEl && titleEl.textContent) ? titleEl.textContent.trim() : (titleHint || "회차 목록");
    if (cleanWebtoonTitle(toonTitle)) webtoonSeriesTitles[section + ":" + titleId] = cleanWebtoonTitle(toonTitle);

    var authorEl = doc.querySelector(".area_info .author") || doc.querySelector(".author");
    var toonAuthor = (authorEl && authorEl.textContent) ? authorEl.textContent.trim() : "네이버 웹툰";

    var thumbEl = doc.querySelector(".area_info .thumbnail img") || doc.querySelector(".thumbnail img");
    var toonAvatar = webtoonThumbnailUrl(thumbEl ? (thumbEl.getAttribute("data-src") || thumbEl.getAttribute("src") || "") : "");

    var seenMap = {};
    var episodes = (await parseEpisodesFromDoc(doc, targetUrl, seenMap, true));
    var firstEpisodeUrl = webtoonFirstEpisodeUrlFromDoc(doc, fetchUrl);
    var sub = isSubscribed(titleId);

    var contextData = {
        kind: "episodes",
        link: fetchUrl,
        title: toonTitle,
        seriesTitle: toonTitle,
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
            menus: ["첫화보기", sub ? "구독 취소" : "구독", "브라우저로 열기", "쿠키"]
        }
    }, contextData, async function (e) {
        return (await SYNURA.main.onViewEvent(e.viewId, e));
    });

    if (res && res.viewId) {
        viewStates[res.viewId] = contextData;
    }
}

function webtoonCancelPaidLoad(viewId) {
    var state = webtoonPaidLoads[viewId];
    if (!state) return;
    state.cancelled = true;
    if (state.reader && state.reader.cancel) state.reader.cancel();
    delete webtoonPaidLoads[viewId];
}

function invalidateWebtoonPaidViews(message) {
    Object.keys(webtoonPaidLoads).forEach(webtoonCancelPaidLoad);
    Object.keys(viewStates).forEach(function (id) {
        var context = viewStates[id];
        if (!context.paid) return;
        context.paidLoaded = false;
        synura.update(Number(id), { models: {
            content: [{ type: "text", value: message }],
            buttons: [BUTTON_PAID_RETRY, BUTTON_VIEWER_SETTINGS],
            snackbar: ""
        } });
    });
}

function webtoonPaidMenus(context) {
    var menus = [];
    if (context.nextUrl) menus.push("다음 화");
    if (context.prevUrl) menus.push("이전 화");
    return menus.concat(["첫화보기", "회차 목록", BUTTON_VIEWER_SETTINGS, "브라우저로 열기"]);
}

function webtoonPaidIdentifier(value) {
    if (!/^\d{1,16}$/.test(String(value || ""))) return 0;
    var number = Number(value);
    return Number.isSafeInteger(number) && number > 0 ? number : 0;
}

async function webtoonResolvePaidEpisode(context) {
    var listPrefix = BASE_URL + "/" + context.section + "/list?titleId=" + context.titleId + "&page=";
    var listUrl = listPrefix + "1";
    var doc = parseDoc((await fetchHtml(listUrl)));
    var seriesNode = doc.querySelector(".area_info .title");
    var seriesTitle = cleanWebtoonTitle(seriesNode && seriesNode.textContent);
    if (seriesTitle) {
        context.seriesTitle = seriesTitle;
        webtoonSeriesTitles[context.section + ":" + context.titleId] = seriesTitle;
    }
    context.firstEpisodeUrl = webtoonFirstEpisodeUrlFromDoc(doc, listUrl) || context.firstEpisodeUrl;
    var item = previewItemsMap[webtoonEpisodeUrl(context.link)];
    var neighbours = {};
    var pages = [], seenPages = { "1": true };
    function mapped(candidate) {
        return candidate && webtoonPaidIdentifier(candidate.contentsNo) && webtoonPaidIdentifier(candidate.volumeNo);
    }
    function pageNumber(href) {
        // Follow only pagination actually advertised by the same comic list.
        // Rebuild its URL below so unrelated parameters or origins cannot leak
        // into authenticated requests. Never guess an unadvertised page.
        var path = href.replace(/^(?:https?:)?\/\/(?:m\.)?comic\.naver\.com(?=\/)/i, "");
        if (path.charAt(0) === "?") path = "/" + context.section + "/list" + path;
        else if (path.indexOf("list?") === 0) path = "/" + context.section + "/" + path;
        var query = path.indexOf("?");
        if (query < 0 || path.substring(0, query) !== "/" + context.section + "/list") return 0;
        var params = new URLSearchParams(path.substring(query + 1).split("#")[0]);
        if (params.get("titleId") !== context.titleId) return 0;
        return webtoonPaidIdentifier(params.get("page"));
    }
    while (doc) {
        var nodes = doc.querySelectorAll("[data-volume-no]");
        var hasEpisodes = false;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var titleId = node.getAttribute("data-title-id") || context.titleId;
            var articleNo = node.getAttribute("data-no") || node.getAttribute("data-article-no") || "";
            if (titleId !== context.titleId || !webtoonPaidIdentifier(articleNo)) continue;
            hasEpisodes = true;
            var titleNode = node.querySelector(".title .name") || node.querySelector(".title");
            var episodeTitle = cleanWebtoonTitle(titleNode && titleNode.textContent);
            neighbours[articleNo] = episodeTitle;
            if (articleNo !== context.no) continue;
            var candidate = {
                contentsNo: node.getAttribute("data-contents-no"),
                volumeNo: node.getAttribute("data-volume-no"),
                title: episodeTitle
            };
            if (mapped(candidate)) item = candidate;
        }
        var links = doc.querySelectorAll("a[href]");
        for (var j = 0; j < links.length; j++) {
            var href = String(links[j].getAttribute("href") || "").trim();
            if (webtoonContentUrl(href, "detail") && extractTitleId(href) === context.titleId &&
                webtoonSection(href) === context.section) {
                var number = extractEpisodeNo(href);
                if (webtoonPaidIdentifier(number)) {
                    hasEpisodes = true;
                    neighbours[number] = neighbours[number] || "";
                }
            }
            var page = pageNumber(href);
            if (page && !seenPages[page]) {
                seenPages[page] = true;
                pages.push(page);
            }
        }
        if (mapped(item) || !hasEpisodes || !pages.length) break;
        var html = (await fetchHtml(listPrefix + pages.shift()));
        // A failed/empty page should not trigger a sweep through every queued
        // link. Leave the caller with the existing controlled mapping error.
        if (!html) break;
        doc = parseDoc(html);
    }
    // Only use an explicit series mapping. A webtoon article number is not a
    // Series volume number, even when the values happen to match.
    var contentsNo = item && webtoonPaidIdentifier(item.contentsNo);
    var volumeNo = item && webtoonPaidIdentifier(item.volumeNo);
    if (!contentsNo || !volumeNo) throw new Error("WEBTOON_EPISODE_MAPPING_MISSING");
    if (item.title) context.episodeTitle = cleanWebtoonTitle(item.title);
    context.title = context.seriesTitle && context.episodeTitle
        ? context.seriesTitle + " - " + context.episodeTitle
        : context.episodeTitle || context.seriesTitle || context.title;
    var current = Number(context.no), before = 0, after = 0;
    Object.keys(neighbours).forEach(function (number) {
        var value = Number(number);
        if (value < current && value > before) before = value;
        if (value > current && (!after || value < after)) after = value;
    });
    var prefix = BASE_URL + "/" + context.section + "/detail?titleId=" + context.titleId + "&no=";
    context.prevUrl = before ? prefix + before : "";
    context.nextUrl = after ? prefix + after : "";
    context.prevTitle = neighbours[before] || "이전 화";
    context.nextTitle = neighbours[after] || "다음 화";
    return { contentsNo: contentsNo, volumeNo: volumeNo };
}

function webtoonEncodeBase64(value) {
    var bytes;
    if (value instanceof ArrayBuffer) bytes = new Uint8Array(value);
    else if (ArrayBuffer.isView(value)) bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    else throw new TypeError("Expected binary data");
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var parts = [];
    // Each chunk ends on a complete Base64 group. Bound string concatenation
    // and avoid spreading image-sized byte arrays into function arguments.
    for (var start = 0; start < bytes.length; start += 3072) {
        var end = Math.min(start + 3072, bytes.length);
        var part = "";
        for (var i = start; i < end; i += 3) {
            var a = bytes[i], b = i + 1 < end ? bytes[i + 1] : 0, c = i + 2 < end ? bytes[i + 2] : 0;
            var bits = (a << 16) | (b << 8) | c;
            part += alphabet[(bits >>> 18) & 63] + alphabet[(bits >>> 12) & 63]
                + (i + 1 < end ? alphabet[(bits >>> 6) & 63] : "=")
                + (i + 2 < end ? alphabet[bits & 63] : "=");
        }
        parts.push(part);
    }
    return parts.join("");
}

function webtoonImageMime(bytes) {
    if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
    if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 &&
        bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) return "image/png";
    if (bytes.length >= 6 && bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 56 &&
        (bytes[4] === 55 || bytes[4] === 57) && bytes[5] === 97) return "image/gif";
    if (bytes.length >= 12 && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 &&
        bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) return "image/webp";
    throw new Error("WEBTOON_INVALID_IMAGE");
}

async function webtoonLoadPaidEpisode(viewId, context, loginRetry) {
    if (webtoonPaidLoads[viewId]) return;
    var state = { cancelled: false, reader: null };
    webtoonPaidLoads[viewId] = state;
    viewStates[viewId] = context;
    context.paidLoaded = false;
    function active() { return !state.cancelled && webtoonPaidLoads[viewId] === state; }
    function update(diff) {
        if (!active()) return false;
        var result = synura.update(viewId, diff);
        if (result && result.success === false) webtoonCancelPaidLoad(viewId);
        return active();
    }
    try {
        if (!localStorage.getItem(WEBTOON_COOKIE_KEY)) throw { loginRequired: true };
        if (typeof crypto === "undefined" || !crypto.subtle || typeof crypto.randomUUID !== "function") {
            throw new Error("WEBTOON_CRYPTO_UNAVAILABLE");
        }
        if (!update({ models: { content: [{ type: "text", value: "회차 이미지를 불러오는 중입니다." }],
            buttons: [BUTTON_VIEWER_SETTINGS], snackbar: "열람 권한을 확인하고 있습니다." } })) return;
        var ids = (await webtoonResolvePaidEpisode(context));
        if (!active()) return;
        state.reader = handler.createPaidReader();
        var episode = await state.reader.loadEpisode(ids.contentsNo, ids.volumeNo);
        if (!active()) return;
        var CHUNK_SIZE = 5;
        var firstChunkSent = false;
        var currentChunk = [{ type: "anchor", value: "webtoon_" + context.titleId + "_" + context.no }];
        for (var i = 0; i < episode.images.length; i++) {
            if (!active()) return;
            var bytes = await state.reader.readImage(i);
            if (!active()) return;
            var image = episode.images[i];
            var mimeType = webtoonImageMime(bytes);
            var block = {
                type: "image", value: "data:" + mimeType + ";base64," + webtoonEncodeBase64(bytes),
                mimeType: mimeType
            };
            bytes.fill(0);
            if (Number(image.width) > 0) block.width = Number(image.width);
            if (Number(image.height) > 0) block.height = Number(image.height);
            currentChunk.push(block);
            if (currentChunk.length >= CHUNK_SIZE || i + 1 === episode.images.length) {
                var progressText = "이미지 불러오는 중 " + (i + 1) + "/" + episode.images.length;
                if (!firstChunkSent) {
                    if (!update({ models: { content: currentChunk, snackbar: progressText } })) return;
                    firstChunkSent = true;
                } else {
                    if (!update({ models: { append: currentChunk, snackbar: progressText } })) return;
                }
                currentChunk = [];
            }
        }
        var footerBlocks = [];
        if (context.nextUrl) footerBlocks.push({ type: "link", value: "👉 다음 화 보기", link: context.nextUrl });
        if (context.prevUrl) footerBlocks.push({ type: "link", value: "👈 이전 화 보기", link: context.prevUrl });
        if (footerBlocks.length > 0) {
            if (!firstChunkSent) {
                if (!update({ models: { content: footerBlocks } })) return;
                firstChunkSent = true;
            } else {
                if (!update({ models: { append: footerBlocks } })) return;
            }
        }
        var comments = (await fetchEpisodeComments(context.titleId, context.no, context.link, ""));
        if (!active()) return;
        context.comments = comments.comments;
        context.commentCursor = comments.nextCursor;
        context.commentFailed = comments.failed;
        context.paidLoaded = true;
        // Post views append blocks in chunks during download. Send metadata and comments.
        update({ styles: { title: context.title }, models: {
            title: context.title, author: context.title,
            menus: webtoonPaidMenus(context), buttons: viewerButtons(context), comments: comments.comments,
            snackbar: comments.failed ? "댓글을 불러오지 못했습니다." : ""
        } });
        return { loaded: true, imageCount: episode.images.length };
    } catch (error) {
        if (!active() || error && error.cancelled) return;
        var loginRequired = !!(error && (error.loginRequired || error.webtoonLoginRequired));
        var message = loginRequired ? "구매한 네이버 계정으로 로그인해 주세요."
            : error && error.rightsRequired ? "이 회차의 열람 권한이 없습니다. 구매 또는 대여 상태를 확인해 주세요."
            : error && error.viewerConfigRequired ? "뷰어 설정을 확인해 주세요."
            : error && error.message === "WEBTOON_CRYPTO_UNAVAILABLE" ? "이 런타임은 웹툰 열람에 필요한 crypto API를 지원하지 않습니다."
            : error && error.message === "WEBTOON_EPISODE_MAPPING_MISSING" ? "회차 정보를 찾지 못했습니다. 회차 목록을 새로고침한 뒤 다시 선택해 주세요."
            : error && error.message === "WEBTOON_INVALID_IMAGE" ? "올바른 이미지 데이터를 받지 못했습니다. 다시 불러와 주세요."
            : "회차 이미지를 불러오지 못했습니다. 로그인 상태와 뷰어 설정을 확인한 뒤 다시 시도해 주세요.";
        update({ models: { content: [{ type: "text", value: message }], snackbar: "",
            buttons: (loginRequired ? ["로그인"] : []).concat([BUTTON_PAID_RETRY, BUTTON_VIEWER_SETTINGS, BUTTON_BROWSER]) } });
        if (loginRequired && !loginRetry) {
            webtoonOpenLoginBrowser("https://nid.naver.com/nidlogin.login?url=" + encodeURIComponent(BASE_URL + "/webtoon/list?titleId=" + context.titleId),
                { kind: "paid_view", viewId: viewId });
        }
        return { loginRequired: loginRequired };
    } finally {
        if (state.reader) { try { state.reader.reset(); } catch (_) {} }
        if (webtoonPaidLoads[viewId] === state) delete webtoonPaidLoads[viewId];
    }
}

function openPaidEpisodeView(url, metadata, replaceViewId, episodeDate) {
    var context = {
        kind: "viewer", paid: true, link: webtoonEpisodeUrl(url),
        titleId: extractTitleId(url), no: extractEpisodeNo(url), section: webtoonSection(url),
        title: metadata.title || "웹툰 보기", seriesTitle: metadata.seriesTitle, episodeTitle: metadata.episodeTitle,
        comments: [], commentCursor: "", commentFailed: false
    };
    if (replaceViewId) {
        webtoonCancelPaidLoad(replaceViewId);
        synura.close(replaceViewId);
        delete viewStates[replaceViewId];
    }
    var res = synura.open({
        view: "/views/post",
        styles: { title: context.title, fullWidth: true, menu: true, anchor: "webtoon_" + context.titleId + "_" + context.no },
        models: { title: context.title, author: context.title, date: episodeDate || "", category: "",
            content: [{ type: "text", value: "회차 이미지를 불러오는 중입니다." }],
            link: context.link, menus: webtoonPaidMenus(context), buttons: [BUTTON_VIEWER_SETTINGS] }
    }, context, async function (e) { return (await SYNURA.main.onViewEvent(e.viewId, e)); });
    if (res && res.viewId && !viewStates[res.viewId]) viewStates[res.viewId] = context;
    return res;
}

async function openEpisodePostView(url, titleHint, replaceViewId, parentViewId) {
    var html = (await fetchHtml(url));
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

    var inheritedContext = viewStates[parentViewId] || viewStates[replaceViewId];
    var metadata = webtoonEpisodeMetadata(doc, url, titleHint, inheritedContext);
    var epTitle = metadata.title || "웹툰 보기";

    // Paid episodes return a script-only notice, even for an owned episode.
    // The official list opens the app bridge instead of this HTML viewer.
    if (/alert\s*\(\s*(['"])유료로\s*전환된\s*회차입니다\.?\1\s*\)/.test(html)) {
        openPaidEpisodeView(url, metadata, replaceViewId, episodeDate);
        return;
    }

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
        if (/(?:^|\/)(?:bg_transparency|age_|ico_|banner)[^/]*(?:\?|$)/i.test(src) || src.indexOf("/thumbnail/") >= 0) continue;
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

    // Navigation alone is not an episode body. Make a missing body explicit.
    if (blocks.length === 0) {
        blocks.push({ type: "text", value: "회차 본문 이미지를 불러오지 못했습니다. 아래 ‘웹브라우저에서 보기’ 버튼으로 확인해 주세요." });
    }

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

    var viewerMenus = [];
    if (nextUrl) viewerMenus.push("다음 화");
    if (prevUrl) viewerMenus.push("이전 화");
    viewerMenus.push("첫화보기");
    viewerMenus.push("회차 목록");
    viewerMenus.push("브라우저로 열기");

    var commentPage = (await fetchEpisodeComments(titleId, no, url, ""));
    var contextData = {
        kind: "viewer",
        link: url,
        title: epTitle,
        seriesTitle: metadata.seriesTitle,
        episodeTitle: metadata.episodeTitle,
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
            author: metadata.title,
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
    var callback = async function (e) {
        return (await SYNURA.main.onViewEvent(e.viewId, e));
    };

    if (replaceViewId) {
        webtoonCancelPaidLoad(replaceViewId);
        synura.close(replaceViewId);
        delete viewStates[replaceViewId];
    }

    viewData.view = "/views/post";
    var res = synura.open(viewData, contextData, callback);
    if (res && res.viewId) {
        viewStates[res.viewId] = contextData;
    }
}

async function openSearchView(keyword) {
    var url = BASE_URL + "/search/result?keyword=" + encodeURIComponent(keyword);
    var html = (await fetchHtml(url));
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
    }, { kind: "search", keyword: keyword, link: url, title: "검색: " + keyword }, async function (e) {
        return (await SYNURA.main.onViewEvent(e.viewId, e));
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
    }, { from: "search_dialog", parentViewId: viewId || 0 }, async function (e) {
        return (await SYNURA.main.onViewEvent(e.viewId, e));
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
    if (changed) {
        update.models = {
            contents: items,
            menus: ["검색", "새로고침", "브라우저로 열기", "쿠키", BUTTON_VIEWER_SETTINGS, "로그인", "로그아웃"]
        };
    }
    var result = synura.update(viewId, update);
    if (result && result.success === false) {
        delete viewStates[viewId];
        return;
    }
    if (changed) {
        context.homeSignature = signature;
        viewStates[viewId] = context;
        synura.connect(viewId, context, async function (e) {
            return (await SYNURA.main.onViewEvent(e.viewId, e));
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
                menus: ["검색", "새로고침", "브라우저로 열기", "쿠키", BUTTON_VIEWER_SETTINGS, "로그인", "로그아웃"]
            }
        }, contextData, async function (e) {
            return (await SYNURA.main.onViewEvent(e.viewId, e));
        });

        if (res && res.viewId) {
            viewStates[res.viewId] = contextData;
        }
    },

    resume: async function (viewId, context) {
        var current = viewStates[viewId];
        if (context && !(current && (current.kind === "home" && context.kind === "home" || current.paid && context.paid))) {
            current = viewStates[viewId] = context;
        }
        current = current || {};
        synura.connect(viewId, current, async function (e) {
            return (await SYNURA.main.onViewEvent(e.viewId, e));
        });
        return (await handler.onViewEvent(viewId, { eventId: "RESUME", context: current }));
    },

    onViewEvent: async function (viewId, event) {
        if (!event) return;
        var ctx = (viewStates[viewId] || event.context || {});

        if (ctx.kind === "viewer_settings") return handleWebtoonViewerSettings(viewId, event, ctx);
        if (ctx.paid && (event.eventId === "LOAD" || event.eventId === "RESUME" || event.eventId === "REFRESH")) {
            if (event.eventId === "REFRESH") webtoonCancelPaidLoad(viewId);
            else if (ctx.paidLoaded) return;
            return (await webtoonLoadPaidEpisode(viewId, ctx));
        }

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

async function isWebtoonLoggedIn() {
    var cookie = localStorage.getItem(WEBTOON_COOKIE_KEY);
    if (!cookie) return false;
    try {
        var resp = (await webtoonFetch(BASE_URL + "/api/loginStatus", {
            "Accept": "application/json",
            "Referer": BASE_URL
        }, "POST"));
        if (!resp || resp.status !== 200) return false;
        var data = JSON.parse((await resp.text()));
        return !!(data && data.result && data.result.login);
    } catch (e) {
        return false;
    }
}

async function handlePreviewEpisodeClick(viewId, item, ctx) {
    if (!item) return;

    if (item.isOwned) {
        (await openEpisodePostView(item.link, item.title, undefined, viewId));
        return;
    }

    var loggedIn = (await isWebtoonLoggedIn());
    if (!loggedIn) {
        var targetUrl = item.link || (BASE_URL + "/webtoon/detail?titleId=" + item.titleId + "&no=" + item.no);
        var loginUrl = "https://nid.naver.com/nidlogin.login?url=" + encodeURIComponent(targetUrl);
        webtoonOpenLoginBrowser(loginUrl, {
            kind: "event",
            viewId: viewId,
            eventId: "CLICK",
            data: item,
            context: ctx
        });
        return;
    }

    var titleId = item.titleId || extractTitleId(item.link);
    var no = item.no || extractEpisodeNo(item.link);
    var contentsNo = item.contentsNo || "";
    var volumeNo = item.volumeNo || "";
    if (!webtoonPaidIdentifier(contentsNo) || !webtoonPaidIdentifier(volumeNo)) {
        synura.update(viewId, { models: { snackbar: "회차 정보를 찾지 못했습니다. 목록을 새로고침해 주세요." } });
        return;
    }
    var cookieCount = item.cookieCount || 3;

    var userAlreadyOwns = false;
    var csrfToken = "";
    try {
        var listUrl = BASE_URL + "/webtoon/list?titleId=" + titleId;
        var html = (await fetchHtml(listUrl));
        if (html) {
            var doc = parseDoc(html);
            var csrfMeta = doc.querySelector("meta[name='csrf-token']");
            if (csrfMeta) csrfToken = csrfMeta.getAttribute("content") || "";
        }
        if (contentsNo && volumeNo) {
            var bodyParts = [
                "containUserRight=true",
                "contentsNo=" + encodeURIComponent(contentsNo),
                "volumeNos=" + encodeURIComponent(volumeNo)
            ];
            var headers = {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Referer": listUrl
            };
            if (csrfToken) headers["X-XSRF-TOKEN"] = csrfToken;
            var resp = (await webtoonFetch(BASE_URL + "/api/store/linkedCostVolumesInfo", headers, "POST", bodyParts.join("&")));
            if (resp && resp.status === 200) {
                var data = JSON.parse((await resp.text()));
                if (data && data.result && Array.isArray(data.result.volumeList) && data.result.volumeList[0]) {
                    var vInfo = data.result.volumeList[0];
                    if (vInfo.userVolume) userAlreadyOwns = true;
                    if (typeof vInfo.lendPassCount === "number") cookieCount = vInfo.lendPassCount;
                }
            }
        }
    } catch (e) {}

    if (userAlreadyOwns) {
        (await openEpisodePostView(item.link, item.title, undefined, viewId));
        return;
    }

    var usableCookieCount = 0;
    var licenseDay = 3;
    try {
        var valHeaders = {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Referer": BASE_URL + "/webtoon/list?titleId=" + titleId
        };
        if (csrfToken) valHeaders["X-XSRF-TOKEN"] = csrfToken;
        var valBody = "contentsNo=" + encodeURIComponent(contentsNo) +
            "&volumeNo=" + encodeURIComponent(volumeNo) +
            "&reqUsePassCount=" + encodeURIComponent(String(cookieCount));
        var valResp = (await webtoonFetch(BASE_URL + "/api/store/contentsPassUseValidation", valHeaders, "POST", valBody));
        if (valResp && valResp.status === 200) {
            var valData = JSON.parse((await valResp.text()));
            if (valData && valData.result) {
                usableCookieCount = valData.result.usablePassCount || 0;
                if (valData.result.licenseDay) licenseDay = valData.result.licenseDay;
            }
        }
    } catch (e) {}

    var confirmMessage = "사용 가능 쿠키 : " + usableCookieCount + "개\n" +
        "쿠키 " + cookieCount + "개로 " + licenseDay + "일간 대여하시겠습니까?\n\n" +
        PAID_EPISODE_NOTICE + "\n\n" +
        (item.title ? ("작품: " + item.title) : "");

    var dialogContext = {
        kind: "cookie_confirm",
        parentViewId: viewId,
        item: item,
        titleId: titleId,
        no: no,
        contentsNo: contentsNo,
        volumeNo: volumeNo,
        cookieCount: cookieCount,
        usableCookieCount: usableCookieCount,
        csrfToken: csrfToken,
        licenseDay: licenseDay
    };

    synura.open({
        view: "/dialogs/confirmation",
        styles: {
            title: "쿠키 대여 확인",
            message: confirmMessage,
            close: true
        },
        models: {
            buttons: ["대여하기", "취소"]
        }
    }, dialogContext, async function (e) {
        return (await SYNURA.main.onViewEvent(e.viewId, e));
    });
}

async function handleCookieConfirmSubmit(viewId, event, context) {
    var button = event.data ? event.data.button : "";
    synura.close(viewId);
    if (button !== "대여하기") return;

    if (context.usableCookieCount < context.cookieCount) {
        var chargeContext = {
            kind: "cookie_charge",
            parentViewId: context.parentViewId,
            item: context.item,
            titleId: context.titleId,
            no: context.no,
            contentsNo: context.contentsNo,
            volumeNo: context.volumeNo,
            cookieCount: context.cookieCount
        };
        synura.open({
            view: "/views/browser",
            styles: { title: "쿠키 충전" },
            models: { url: "https://m.series.naver.com/my/cookie/sellingList.series" }
        }, chargeContext, async function (e) {
            return (await SYNURA.main.onViewEvent(e.viewId, e));
        });
        if (context.parentViewId) {
            synura.update(context.parentViewId, {
                models: { snackbar: "쿠키가 부족합니다 (" + context.usableCookieCount + "/" + context.cookieCount + "개). 쿠키 충전 페이지로 이동합니다." }
            });
        }
        return;
    }

    try {
        var headers = {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Referer": BASE_URL + "/webtoon/list?titleId=" + context.titleId
        };
        if (context.csrfToken) headers["X-XSRF-TOKEN"] = context.csrfToken;
        var body = "contentsNo=" + encodeURIComponent(context.contentsNo) +
            "&volumeNo=" + encodeURIComponent(context.volumeNo) +
            "&reqUsePassCount=" + encodeURIComponent(String(context.cookieCount)) +
            "&paymentType=COST_PASS";
        var resp = (await webtoonFetch(BASE_URL + "/api/store/contentsPassUse", headers, "POST", body));
        var resData = resp && resp.status === 200 ? JSON.parse((await resp.text())) : null;

        if (resData && resData.code === 0) {
            if (context.parentViewId) {
                synura.update(context.parentViewId, {
                    models: { snackbar: "쿠키 " + context.cookieCount + "개가 차감되었습니다." }
                });
            }
            (await openEpisodePostView(context.item.link, context.item.title, undefined, context.parentViewId));
        } else {
            var msg = (resData && resData.message) ? resData.message : "쿠키 대여 처리에 실패했습니다.";
            if (context.parentViewId) {
                synura.update(context.parentViewId, { models: { snackbar: msg } });
            }
        }
    } catch (e) {
        if (context.parentViewId) {
            synura.update(context.parentViewId, { models: { snackbar: "쿠키 대여 중 오류가 발생했습니다: " + e } });
        }
    }
}

async function fetchUserCookieCount() {
    if (!localStorage.getItem(WEBTOON_COOKIE_KEY)) return { success: false, loginRequired: true };
    var accountUrl = BASE_URL + "/mypage/favorite";
    try {
        // The MY page supplies the CSRF token for the account-wide balance API.
        var page = (await webtoonFetch(accountUrl));
        var html = page ? (await page.text()) : "";
        if (webtoonNeedsLogin(page, html) || page && page.status === 401) {
            return { success: false, loginRequired: true };
        }
        if (!page || page.status !== 200) return { success: false };
        var csrfMeta = parseDoc(html).querySelector("meta[name='csrf-token']");
        var csrfToken = csrfMeta ? csrfMeta.getAttribute("content") || "" : "";
        if (!csrfToken) return { success: false };
        var headers = {
            "Accept": "application/json, text/plain, */*",
            "Referer": accountUrl,
            "X-XSRF-TOKEN": csrfToken
        };
        var resp = (await webtoonFetch(BASE_URL + "/api/store/usablePassCount", headers));
        if (resp && resp.status === 401) return { success: false, loginRequired: true };
        if (resp && resp.status === 200) {
            var body = (await resp.text());
            if (webtoonNeedsLogin(resp, body)) return { success: false, loginRequired: true };
            var data = JSON.parse(body);
            var count = data && data.result && data.result.totalPassCount;
            if (data && data.code === 0 && Number.isInteger(count) && count >= 0) {
                return { success: true, count: count };
            }
            if (data && (data.code === 1004 || (data.message && data.message.indexOf("로그인") >= 0))) {
                return { success: false, loginRequired: true };
            }
        }
    } catch (e) {}
    return { success: false };
}

async function showCookieInfoDialog(viewId, ctx) {
    if (!(await isWebtoonLoggedIn())) {
        synura.open({
            view: "/dialogs/confirmation",
            styles: {
                title: "쿠키 확인",
                message: "로그인이 필요합니다.\n네이버 로그인 후 확인해 주세요.",
                close: true
            },
            models: {
                buttons: ["로그인", "닫기"]
            }
        }, { kind: "cookie_info_login", parentViewId: viewId }, async function (e) {
            return (await SYNURA.main.onViewEvent(e.viewId, e));
        });
        return;
    }

    var cookieRes = (await fetchUserCookieCount());
    if (!cookieRes.success) {
        if (cookieRes.loginRequired) {
            synura.open({
                view: "/dialogs/confirmation",
                styles: {
                    title: "쿠키 확인",
                    message: "로그인 세션이 만료되었습니다.\n다시 로그인해 주세요.",
                    close: true
                },
                models: {
                    buttons: ["로그인", "닫기"]
                }
            }, { kind: "cookie_info_login", parentViewId: viewId }, async function (e) {
                return (await SYNURA.main.onViewEvent(e.viewId, e));
            });
            return;
        }
        synura.open({
            view: "/dialogs/confirmation",
            styles: {
                title: "쿠키 확인",
                message: "쿠키 정보를 가져올 수 없습니다.\n네트워크 상태를 확인해 주세요.",
                close: true
            },
            models: {
                buttons: ["확인"]
            }
        }, { kind: "cookie_info", parentViewId: viewId }, async function (e) {
            return (await SYNURA.main.onViewEvent(e.viewId, e));
        });
        return;
    }

    synura.open({
        view: "/dialogs/confirmation",
        styles: {
            title: "보유 쿠키",
            message: "현재 보유 쿠키 : " + cookieRes.count + "개",
            close: true
        },
        models: {
            buttons: ["충전하기", "확인"]
        }
    }, { kind: "cookie_info", parentViewId: viewId }, async function (e) {
        return (await SYNURA.main.onViewEvent(e.viewId, e));
    });
}

        // 1. CLICK EVENT
        if (event.eventId === "CLICK") {
            var itemData = event.data || {};
            var link = itemData.link || "";
            var title = itemData.title || "";
            if (!link) return;

            if (itemData.preview || (previewItemsMap && previewItemsMap[link])) {
                var previewItem = itemData.preview ? itemData : previewItemsMap[link];
                (await handlePreviewEpisodeClick(viewId, previewItem, ctx));
                return;
            }

            if (webtoonContentUrl(link, "detail")) {
                (await openEpisodePostView(link, title, ctx.kind === "viewer" ? viewId : undefined, viewId));
            } else if (webtoonContentUrl(link, "list")) {
                (await openEpisodeListView(link, title));
            } else if (link.indexOf("/webtoon/weekday") >= 0 || link.indexOf("/webtoon/finish") >= 0) {
                (await openWeekdayView(link, title));
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
            if (menu === BUTTON_VIEWER_SETTINGS) return webtoonOpenViewerSettings(viewId);
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
                (await openFirstEpisode(viewId, ctx, ctx));
                return;
            }
            if (menu === "다음 화") {
                if (ctx.nextUrl) {
                    (await openEpisodePostView(ctx.nextUrl, ctx.nextTitle || "다음 화", viewId));
                }
                return;
            }
            if (menu === "이전 화") {
                if (ctx.prevUrl) {
                    (await openEpisodePostView(ctx.prevUrl, ctx.prevTitle || "이전 화", viewId));
                }
                return;
            }
            if (menu === "회차 목록") {
                var tid = ctx.titleId || extractTitleId(ctx.link);
                if (tid) {
                    (await openEpisodeListView(BASE_URL + "/" + webtoonSection(ctx.link) + "/list?titleId=" + tid, ctx.seriesTitle || ctx.title || "회차 목록"));
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
                            menus: ["첫화보기", nowSub ? "구독 취소" : "구독", "브라우저로 열기", "쿠키"],
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
            if (menu === "쿠키") {
                (await showCookieInfoDialog(viewId, ctx));
                return;
            }
            if (menu === "로그인") {
                webtoonOpenLoginBrowser("https://nid.naver.com/nidlogin.login?url=" + encodeURIComponent(BASE_URL + "/webtoon/weekday"), {
                    kind: "home_login",
                    parentViewId: viewId
                });
                return;
            }
            if (menu === "로그아웃") {
                invalidateWebtoonPaidViews("로그아웃되었습니다. 다시 로그인한 뒤 회차를 불러와 주세요.");
                localStorage.removeItem(WEBTOON_COOKIE_KEY);
                synura.update(viewId, { models: { snackbar: "로그아웃되었습니다." } });
                synura.open({
                    view: "/views/browser",
                    styles: { title: "네이버 로그아웃" },
                    models: { url: "https://nid.naver.com/nidlogin.logout" }
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
                (await openFirstEpisode(viewId, itemData, ctx));
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
                if (ctx.paid && !ctx.paidLoaded) return;
                if (!ctx.commentFailed) (await loadMoreEpisodeComments(viewId, ctx));
                return;
            }
            if (ctx.kind === "episodes" && ctx.titleId) {
                var nextPage = (ctx.page || 1) + 1;
                var pageUrl = BASE_URL + "/" + webtoonSection(ctx.link) + "/list?titleId=" + ctx.titleId + "&page=" + nextPage;
                var html = (await fetchHtml(pageUrl));
                var doc = parseDoc(html);
                ctx.seenMap = ctx.seenMap || {};
                var newEpisodes = (await parseEpisodesFromDoc(doc, pageUrl, ctx.seenMap, false));

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
            if (ctx.paid && event.data) {
                if (event.data.button === BUTTON_VIEWER_SETTINGS) return webtoonOpenViewerSettings(viewId);
                if (event.data.button === BUTTON_PAID_RETRY) {
                    webtoonCancelPaidLoad(viewId);
                    return (await webtoonLoadPaidEpisode(viewId, ctx));
                }
                if (event.data.button === "로그인") {
                    return webtoonOpenLoginBrowser("https://nid.naver.com/nidlogin.login?url=" + encodeURIComponent(BASE_URL + "/webtoon/list?titleId=" + ctx.titleId),
                        { kind: "paid_view", viewId: viewId });
                }
            }
            if (ctx.kind === "cookie_charge") {
                var cData = event.data || {};
                var cCookie = typeof cData.cookies === "string" ? cData.cookies.trim() : "";
                if (cCookie && !/[\r\n\0]/.test(cCookie)) {
                    localStorage.setItem(WEBTOON_COOKIE_KEY, cCookie);
                }
                synura.close(viewId);
                if (ctx.item && ctx.parentViewId) {
                    (await handlePreviewEpisodeClick(ctx.parentViewId, ctx.item, { kind: "episodes", titleId: ctx.titleId }));
                } else if (ctx.parentViewId) {
                    synura.update(ctx.parentViewId, { models: { snackbar: "쿠키 정보가 반영되었습니다." } });
                }
                return;
            }
            if (ctx.kind === "cookie_confirm") {
                (await handleCookieConfirmSubmit(viewId, event, ctx));
                return;
            }
            if (ctx.kind === "cookie_info") {
                var infoBtn = event.data ? event.data.button : "";
                synura.close(viewId);
                if (infoBtn === "충전하기") {
                    synura.open({
                        view: "/views/browser",
                        styles: { title: "쿠키 충전" },
                        models: { url: "https://m.series.naver.com/my/cookie/sellingList.series" }
                    }, {
                        kind: "cookie_charge",
                        parentViewId: ctx.parentViewId
                    }, async function (e) {
                        return (await SYNURA.main.onViewEvent(e.viewId, e));
                    });
                }
                return;
            }
            if (ctx.kind === "cookie_info_login") {
                var loginBtn = event.data ? event.data.button : "";
                synura.close(viewId);
                if (loginBtn === "로그인") {
                    webtoonOpenLoginBrowser("https://nid.naver.com/nidlogin.login?url=" + encodeURIComponent(BASE_URL + "/webtoon/weekday"), {
                        kind: "home_login",
                        parentViewId: ctx.parentViewId
                    });
                }
                return;
            }
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
                (await loadMoreEpisodeComments(viewId, ctx));
                return;
            }
            if (ctx.from === "search_dialog") {
                var btn = event.data ? event.data.button : "";
                var keyword = event.data ? (event.data.keyword || "") : "";
                synura.close(viewId);
                if (btn !== "취소" && keyword.trim()) {
                    (await openSearchView(keyword.trim()));
                }
                return;
            }
        }

        // 6. CLOSE EVENT
        if (event.eventId === "CLOSE") {
            webtoonCancelPaidLoad(viewId);
            delete viewStates[viewId];
            return;
        }
    },

    deeplink: async function (url) {
        if (!url || url.indexOf("comic.naver.com") < 0) return false;
        if (webtoonContentUrl(url, "detail")) {
            (await openEpisodePostView(url, "웹툰"));
            return true;
        }
        if (webtoonContentUrl(url, "list")) {
            (await openEpisodeListView(url, "웹툰"));
            return true;
        }
        if (url.indexOf("/webtoon/weekday") >= 0 || url.indexOf("/webtoon/finish") >= 0) {
            (await openWeekdayView(url, "네이버 웹툰"));
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
    }, context, async function (event) {
        return (await SYNURA.main.onViewEvent(event.viewId, event));
    });
    if (result && result.success) viewStates[result.viewId] = context;
    return result;
}

async function webtoonRetryLoginAction(action) {
    if (!action) return;
    if (action.kind === "paid_view") {
        var context = viewStates[action.viewId];
        if (context && context.paid) return (await webtoonLoadPaidEpisode(action.viewId, context, true));
        return;
    }
    var previous = webtoonAuthRetrying;
    webtoonAuthRetrying = true;
    try {
        if (action.kind === "home_login") {
            if (action.parentViewId) {
                synura.update(action.parentViewId, { models: { snackbar: "로그인되었습니다." } });
            }
            return;
        }
        if (action.kind === "deeplink") return (await webtoonOriginalDeeplink(action.url));
        if (action.kind === "search") return (await openSearchView(action.keyword));
        return (await webtoonOriginalViewEvent(action.viewId, {
            viewId: action.viewId,
            eventId: action.eventId,
            data: action.data,
            context: action.context
        }));
    } finally {
        webtoonAuthRetrying = previous;
    }
}

async function webtoonHandleLoginEvent(viewId, event, context) {
    if (event.eventId === "CLOSE") {
        delete viewStates[viewId];
        return;
    }
    if (event.eventId !== "SUBMIT") return;
    var data = event.data || {};
    var cookie = typeof data.cookies === "string" ? data.cookies.trim() : "";
    var cookieUrlAllowed = !data.url || webtoonCookieHost(data.url) ||
        /^https?:\/\/(?:nid|(?:m\.)?series)\.naver\.com(?:[/:?#]|$)/i.test(String(data.url));
    if (!cookie || /[\r\n\0]/.test(cookie) || !cookieUrlAllowed) {
        synura.update(viewId, { models: { snackbar: "쿠키를 가져오지 못했습니다. 로그인과 연령 확인을 마친 뒤 상단 확인을 다시 눌러 주세요." } });
        return;
    }
    if (localStorage.getItem(WEBTOON_COOKIE_KEY) !== cookie) {
        invalidateWebtoonPaidViews("로그인 정보가 변경되었습니다. 회차를 다시 불러와 주세요.");
    }
    localStorage.setItem(WEBTOON_COOKIE_KEY, cookie);
    try {
        var outcome = await webtoonRetryLoginAction(context.action);
        if (outcome && outcome.loginRequired) throw { webtoonLoginRequired: true };
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
handler.onViewEvent = async function (viewId, event) {
    if (!event) return;
    var context = viewStates[viewId] || event.context || {};
    if (context.kind === "webtoon_login") {
        return (await webtoonHandleLoginEvent(viewId, event, context));
    }
    try {
        return (await webtoonOriginalViewEvent(viewId, event));
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
handler.deeplink = async function (url) {
    try {
        return (await webtoonOriginalDeeplink(url));
    } catch (error) {
        if (!error || !error.webtoonLoginRequired) throw error;
        webtoonOpenLoginBrowser(error.targetUrl, { kind: "deeplink", url: url });
        return true;
    }
};

function createWebtoonPaidReader(config, options) {
  options = options || {};
  const fetcher = options.fetch || fetch;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8');
  const apiOrigin = 'https://api.series.naver.com';
  const drmOrigin = 'https://rtdrm.webtoon.naver.com';
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const deviceId = checkedHeader(options.deviceId, 'Device ID');
  const packageId = checkedHeader(options.packageId || config.packageId || 'series_pc', 'Package ID');
  const userAgent = checkedHeader(options.userAgent || config.userAgent, 'User agent');
  if (typeof fetcher !== 'function') throw new TypeError('A fetch implementation is required');
  if (!config.hmac || !config.rtdrmHmac) throw new TypeError('Signing configuration is required');
  const consumerId = checkedHeader(config.hmac.consumerId, 'Consumer ID');
  const keyId = checkedHeader(config.rtdrmHmac.keyId || config.keyId, 'DRM key ID');
  const version = String(config.hmac.version);
  if (!/^\d{1,4}$/.test(version)) throw new TypeError('Invalid signature version');
  const now = typeof options.clock === 'function' ? options.clock : Date.now;
  let n3rKey, nfrontKey, session = null, loading = false, activeReads = 0;
  let clockOffset = 0, clockSynchronized = false, cancelled = false;

  class ReaderError extends Error {
    constructor(message, status, code) {
      super(message);
      this.name = 'WebtoonReaderError';
      this.status = Number.isInteger(status) ? status : 0;
      this.code = Number.isInteger(code) ? code : null;
      this.loginRequired = this.status === 401 || this.code === 1004;
      this.rightsRequired = this.code === 4005;
      this.cancelled = false;
    }
  }
  function fail(message, status, code) { return new ReaderError(message, status, code); }
  function checkCancelled() {
    if (!cancelled) return;
    const error = fail('Viewer request was cancelled');
    error.name = 'AbortError';
    error.cancelled = true;
    throw error;
  }
  function clearSession() {
    if (session) session.iv.fill(0);
    session = null;
  }
  function apiCode(data) {
    const code = data && typeof data === 'object' ? data.code : undefined;
    if (Number.isInteger(code)) return code;
    if (typeof code === 'string' && /^-?\d{1,9}$/.test(code)) return Number(code);
    return null;
  }
  function apiFailure(status, code) {
    if (status === 401 || code === 1004) return loginFailure(status, code);
    if (code === 4005) return fail('This episode requires a purchase or rental', status, code);
    return fail('Viewer API request failed', status, code);
  }
  function loginFailure(status, code) {
    const error = fail('Naver login is required', status, code);
    error.loginRequired = true;
    return error;
  }
  function checkedHeader(value, label) {
    if (typeof value !== 'string' || !value || value.length > 16384 || /[\r\n\0]/.test(value)) {
      throw new TypeError(label + ' is missing or invalid');
    }
    return value;
  }
  function timestamp() {
    const value = Number(now()) + clockOffset;
    if (!Number.isSafeInteger(value) || value < 0) throw fail('Invalid clock value');
    return String(value);
  }
  function originOf(url) {
    if (typeof url !== 'string' || /[\r\n\0\\#]/.test(url)) throw fail('Invalid request URL');
    if (url.indexOf(apiOrigin + '/') === 0) return apiOrigin;
    if (url.indexOf(drmOrigin + '/') === 0) return drmOrigin;
    throw fail('Unsupported request origin');
  }
  function bytesOf(value) {
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    throw fail('Expected binary response');
  }
  function decodeBase64(value) {
    if (typeof value !== 'string' || value.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
      throw fail('Invalid encoded key response');
    }
    const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;
    const output = new Uint8Array(value.length / 4 * 3 - padding);
    let cursor = 0;
    for (let i = 0; i < value.length; i += 4) {
      const bits = (alphabet.indexOf(value[i]) << 18) | (alphabet.indexOf(value[i + 1]) << 12)
        | ((value[i + 2] === '=' ? 0 : alphabet.indexOf(value[i + 2])) << 6)
        | (value[i + 3] === '=' ? 0 : alphabet.indexOf(value[i + 3]));
      if (cursor < output.length) output[cursor++] = bits >>> 16;
      if (cursor < output.length) output[cursor++] = bits >>> 8;
      if (cursor < output.length) output[cursor++] = bits;
    }
    return output;
  }
  function hex(value) {
    const bytes = bytesOf(value);
    let output = '';
    for (let i = 0; i < bytes.length; i++) output += bytes[i].toString(16).padStart(2, '0');
    return output;
  }
  function randomText(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const random = new Uint8Array(64);
    let output = '', rounds = 0;
    while (output.length < length) {
      if (++rounds > 32) throw fail('Random source failed');
      crypto.getRandomValues(random);
      for (let i = 0; i < random.length && output.length < length; i++) {
        if (random[i] < 248) output += characters[random[i] % 62];
      }
    }
    random.fill(0);
    return output;
  }
  async function synchronizeClock() {
    checkCancelled();
    if (clockSynchronized || typeof options.clock === 'function') return;
    try {
      const response = await fetcher(apiOrigin + '/current-time', {method:'GET',headers:{'User-Agent':userAgent}});
      checkCancelled();
      if (!response || response.status !== 200) return;
      const data = await response.json();
      checkCancelled();
      if (data && Number.isSafeInteger(data.result) && data.result > 100) {
        clockOffset = data.result - Number(now());
        clockSynchronized = true;
      }
    } catch (_) {
      checkCancelled();
      // The protocol can use local time when the optional clock lookup fails.
    }
  }
  async function signingKey(family) {
    const group = family === 'series' ? config.hmac : config.rtdrmHmac;
    const secret = checkedHeader(group.key, 'Signing key');
    return crypto.subtle.importKey('raw', encoder.encode(secret),
      {name:'HMAC',hash:family === 'series' ? 'SHA-1' : 'SHA-256'},false,['sign']);
  }
  async function headersFor(url, family, withCookie, token) {
    checkCancelled();
    const origin = originOf(url);
    if ((family === 'series' && origin !== apiOrigin) || (family === 'drm' && origin !== drmOrigin)) {
      throw fail('Incorrect signing origin');
    }
    const headers = {'User-Agent':userAgent};
    const time = timestamp();
    if (family === 'series') {
      if (!n3rKey) n3rKey = (await signingKey('series'));
      const input = url.replace(/^https:/, 'http:').slice(0,255) + time;
      const signature = await crypto.subtle.sign('HMAC',await n3rKey,encoder.encode(input));
      headers['x-consumer-id'] = consumerId;
      headers['x-hmac-msgpad'] = time;
      headers['x-hmac-md'] = 'v' + version + ':' + webtoonEncodeBase64(signature);
      headers['Device-Id'] = deviceId;
    } else {
      if (!nfrontKey) nfrontKey = (await signingKey('drm'));
      const signature = await crypto.subtle.sign('HMAC',await nfrontKey,encoder.encode(url + time));
      headers['n-hmac-key-id'] = keyId;
      headers['n-hmac-timestamp'] = time;
      headers['n-hmac-signature'] = webtoonEncodeBase64(signature);
    }
    if (withCookie) {
      const cookie = typeof options.cookie === 'function' ? await options.cookie() : options.cookie;
      checkCancelled();
      if (typeof cookie !== 'string' || !cookie.trim() || cookie.length > 16384 || /[\r\n\0]/.test(cookie)) {
        throw loginFailure();
      }
      headers.Cookie = cookie;
    }
    if (token) headers['X-Webtoon-Verify-Token'] = checkedHeader(token,'Webtoon token');
    return headers;
  }
  async function request(url, family, withCookie, token) {
    checkCancelled();
    originOf(url);
    const headers = await headersFor(url,family,withCookie,token);
    checkCancelled();
    let response;
    try { response = await fetcher(url,{method:'GET',headers,redirect:'error'}); }
    catch (_) { checkCancelled(); throw fail('Viewer network request failed'); }
    checkCancelled();
    if (!response || !Number.isInteger(response.status)) throw fail('Invalid HTTP response');
    if (response.url && originOf(response.url) !== originOf(url)) throw fail('Unexpected request redirect');
    if (response.status < 200 || response.status >= 300) {
      let data;
      try { data = await response.json(); } catch (_) {}
      checkCancelled();
      throw apiFailure(response.status, apiCode(data));
    }
    return response;
  }
  async function resultOf(response) {
    checkCancelled();
    let data;
    try { data = await response.json(); }
    catch (_) { checkCancelled(); throw fail('Invalid API response', response.status); }
    checkCancelled();
    if (data && typeof data === 'object' && data.code !== undefined && apiCode(data) !== 0) {
      throw apiFailure(response.status, apiCode(data));
    }
    if (!data || typeof data !== 'object' || !data.result || typeof data.result !== 'object') {
      throw fail('Missing API result', response.status);
    }
    return data.result;
  }
  function responseHeader(response, name) {
    const headers = response.headers;
    if (headers && typeof headers.get === 'function') return headers.get(name);
    if (headers && typeof headers === 'object') {
      for (const key of Object.keys(headers)) if (key.toLowerCase() === name.toLowerCase()) return headers[key];
    }
    return undefined;
  }
  async function encryptedPath(contentsNo, volumeNo, userId) {
    const prefix = encoder.encode(userId.slice(0,3));
    const base = decodeBase64(config.imageBaseKey);
    const combined = new Uint8Array(prefix.length + base.length + 32);
    combined.set(prefix);
    combined.set(base,prefix.length);
    const keyBytes = combined.slice(0,32);
    const iv = new Uint8Array(16);
    try {
      const key = await crypto.subtle.importKey('raw',keyBytes,'AES-CBC',false,['encrypt']);
      checkCancelled();
      const plain = encoder.encode(JSON.stringify({contentsNo,volumeNo,preview:false,deviceId}));
      const encrypted = new Uint8Array(await crypto.subtle.encrypt({name:'AES-CBC',iv},key,plain));
      checkCancelled();
      const wire = new Uint8Array(iv.length + encrypted.length);
      wire.set(iv); wire.set(encrypted,iv.length);
      return webtoonEncodeBase64(wire).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    } finally {
      base.fill(0); combined.fill(0); keyBytes.fill(0);
    }
  }
  async function exchangeKeys(token) {
    checkCancelled();
    const rsaResult = await resultOf(await request(drmOrigin + '/pcviewer/api/issue_rsa_key','drm',false));
    checkCancelled();
    const modulus = rsaResult.rsa_public_key_modulus;
    const exponent = rsaResult.rsa_public_key_exponent;
    const clientKeyBytes = encoder.encode(randomText(16));
    const clientIv = encoder.encode(randomText(16));
    let serverKeyBytes, serverIv, completed = false;
    try {
      const encryptedKey = rsaPkcs1Encrypt(clientKeyBytes,modulus,exponent);
      const encryptedIv = rsaPkcs1Encrypt(clientIv,modulus,exponent);
      const params = new URLSearchParams({device_id:deviceId,package_id:packageId,
        client_aes_key:hex(encryptedKey),client_aes_iv_vector:hex(encryptedIv),type:'AES_GCM'});
      const result = await resultOf(await request(drmOrigin + '/pcviewer/api/submit_aes_key?' + params.toString(),'drm',true,token));
      checkCancelled();
      const clientKey = await crypto.subtle.importKey('raw',clientKeyBytes,'AES-GCM',false,['decrypt']);
      checkCancelled();
      async function unwrap(value) {
        const wire = decodeBase64(value);
        if (wire.length < 16) throw fail('Invalid encrypted key response');
        const clear = new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:clientIv,tagLength:128},clientKey,wire));
        try { checkCancelled(); return encoder.encode(decoder.decode(clear)); } finally { clear.fill(0); }
      }
      serverKeyBytes = await unwrap(result.server_aes_key);
      checkCancelled();
      serverIv = await unwrap(result.server_aes_iv_vector);
      checkCancelled();
      if (serverKeyBytes.length !== 16 || serverIv.length === 0) throw fail('Invalid server encryption parameters');
      const key = await crypto.subtle.importKey('raw',serverKeyBytes,'AES-GCM',false,['decrypt']);
      checkCancelled();
      completed = true;
      return {key,iv:serverIv};
    } finally {
      clientKeyBytes.fill(0);
      clientIv.fill(0);
      if (serverKeyBytes) serverKeyBytes.fill(0);
      if (serverIv && !completed) serverIv.fill(0);
    }
  }
  async function loadEpisode(contentsNo, volumeNo) {
    checkCancelled();
    if (loading || activeReads) throw fail('Reader is busy');
    if (!/^\d{1,20}$/.test(String(contentsNo)) || !/^\d{1,20}$/.test(String(volumeNo))
        || (typeof contentsNo === 'number' && !Number.isSafeInteger(contentsNo))
        || (typeof volumeNo === 'number' && !Number.isSafeInteger(volumeNo))
        || !['string','number'].includes(typeof contentsNo) || !['string','number'].includes(typeof volumeNo)) {
      throw fail('Invalid episode identifiers');
    }
    loading = true;
    clearSession();
    try {
      await synchronizeClock();
      checkCancelled();
      const statusResponse = await request(apiOrigin + '/user-status?platformType=VIEWER_PC','series',true);
      const status = await resultOf(statusResponse);
      if (typeof status.naverId !== 'string' || !status.naverId) throw loginFailure(statusResponse.status);
      const path = await encryptedPath(contentsNo,volumeNo,status.naverId);
      const response = await request(apiOrigin + '/v2/comic-viewer/image/' + path,'series',true);
      const metadata = await resultOf(response);
      if (metadata.provider !== 'WEBTOON') throw fail('Unsupported image provider');
      const imageList = metadata.imageContext && metadata.imageContext.imageList;
      if (!Array.isArray(imageList) || !imageList.length) throw fail('Episode contains no images');
      const token = responseHeader(response,'X-Webtoon-Verify-Token');
      if (typeof token !== 'string' || !token) throw fail('Missing Webtoon verification token');
      const images = imageList.map((image,index) => {
        if (!image || originOf(image.url) !== drmOrigin) throw fail('Unsupported image origin');
        return {index,url:image.url,width:image.width,height:image.height};
      });
      const keys = await exchangeKeys(token);
      if (cancelled) {
        keys.iv.fill(0);
        checkCancelled();
      }
      session = {images,token,key:keys.key,iv:keys.iv};
      return {metadata,images:images.map(image => Object.assign({},image))};
    } catch (error) {
      clearSession();
      checkCancelled();
      if (error instanceof ReaderError) throw error;
      throw fail('Purchased episode initialization failed');
    } finally { loading = false; }
  }
  async function readImage(index) {
    checkCancelled();
    const current = session;
    if (!current) throw fail('No purchased episode is loaded');
    if (!Number.isInteger(index) || index < 0 || index >= current.images.length) throw fail('Invalid image index');
    activeReads++;
    try {
      const params = new URLSearchParams({device_id:deviceId,package_id:packageId,type:'AES_GCM'});
      const url = current.images[index].url + '?' + params.toString();
      const response = await request(url,'drm',true,current.token);
      const encrypted = bytesOf(await response.arrayBuffer());
      checkCancelled();
      if (encrypted.length < 16) throw fail('Invalid encrypted image');
      const clear = new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:current.iv,tagLength:128},current.key,encrypted));
      if (cancelled) {
        clear.fill(0);
        checkCancelled();
      }
      return clear;
    } catch (error) {
      checkCancelled();
      if (error instanceof ReaderError) throw error;
      throw fail('Purchased image decryption failed');
    } finally { activeReads--; }
  }
  function reset() {
    if (loading || activeReads) throw fail('Reader is busy');
    clearSession();
  }
  function cancel() {
    cancelled = true;
    clearSession();
    n3rKey = nfrontKey = undefined;
  }
  return {loadEpisode,readImage,reset,cancel};
}


// Account cookies and the locally generated device ID remain separate from
// the shared client defaults and optional user configuration.
handler.createPaidReader = function (config, options) {
    var settings = Object.assign({}, options || {});
    if (settings.cookie === undefined) {
        settings.cookie = function () { return localStorage.getItem(WEBTOON_COOKIE_KEY) || ""; };
    }
    if (!settings.deviceId) {
        var deviceKey = "naver_webtoon:viewer_device_id";
        settings.deviceId = localStorage.getItem(deviceKey);
        if (!settings.deviceId) {
            settings.deviceId = crypto.randomUUID();
            localStorage.setItem(deviceKey, settings.deviceId);
        }
    }
    return createWebtoonPaidReader(config || getWebtoonViewerConfig(), settings);
};
