// =============================================================================
// test_clien.js - Synura Extension for clien.net
// =============================================================================

var SYNURA = {
    domain: "m.clien.net",
    name: "test_clien",
    description: "Unofficial example extension for educational purposes.",
    version: 0.3,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://m.clien.net/service/image/favicon.ico",
    get main() { return handler; }
};

var HOME_URL = `https://${SYNURA.domain}/service/`;
var CACHE_TTL = 600000; // 10 minutes
var CACHE_TTL_KEY = "clien_cache_ttl_ms";
var CACHE_SNACKBAR_KEY = "clien_show_cache_snackbar";
var CACHE_SNACKBAR_MIN_AGE_MS = 10000;
var CUSTOM_BOARDS_KEY = "clien_custom_boards";
var VISIBLE_BOARDS_KEY = "clien_visible_boards";
var BOARD_ORDER_KEY = "clien_board_order";
var SOMOIM_CACHE_KEY = "clien_somoim_boards";
var SOMOIM_CACHE_TS_KEY = "clien_somoim_boards_ts";
var SOMOIM_CACHE_TTL = 21600000; // 6 hours

var defaultBoards = [
    { id: "park", title: "모두의공원" },
    { id: "news", title: "새로운소식" },
    { id: "use", title: "사용기" },
    { id: "lecture", title: "강좌/팁" },
    { id: "useful", title: "유용한사이트" },
    { id: "jirum", title: "알뜰구매" },
    { id: "sold", title: "중고장터" }
];

var homeBoards = defaultBoards.slice();
var boardMap = new Map();
defaultBoards.forEach((b) => boardMap.set(b.id, b));

var viewState = new Map();
var getParams = (viewId) => {
    const key = String(viewId);
    if (!viewState.has(key)) viewState.set(key, {});
    return viewState.get(key);
};
var setParams = (viewId, params) => {
    const key = String(viewId);
    const current = getParams(key);
    viewState.set(key, { ...current, ...params });
};

var getCacheTTL = () => {
    const raw = localStorage.getItem(CACHE_TTL_KEY);
    if (!raw) return CACHE_TTL;
    const parsed = parseIntSafe(raw, CACHE_TTL);
    if (!parsed || parsed <= 0) return CACHE_TTL;
    return parsed;
};

var setCacheTTL = (ms) => {
    const value = parseIntSafe(ms, CACHE_TTL);
    localStorage.setItem(CACHE_TTL_KEY, String(value > 0 ? value : CACHE_TTL));
};

var getShowCacheSnackbar = () => {
    const raw = localStorage.getItem(CACHE_SNACKBAR_KEY);
    if (raw === null || raw === undefined || raw === "") return true;
    const s = String(raw).trim().toLowerCase();
    return !(s === "false" || s === "0" || s === "off" || s === "no");
};

var setShowCacheSnackbar = (enabled) => {
    localStorage.setItem(CACHE_SNACKBAR_KEY, enabled ? "true" : "false");
};

var getCustomBoards = () => {
    const raw = localStorage.getItem(CUSTOM_BOARDS_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .map((b) => ({
                id: String((b && b.id) || "").trim().toLowerCase(),
                title: String((b && b.title) || "").trim(),
                custom: true
            }))
            .filter((b) => b.id.length > 0 && b.title.length > 0);
    } catch (e) {
        console.log(`[customBoards] parse error: ${e.toString()}`);
        return [];
    }
};

var saveCustomBoards = (boards) => {
    localStorage.setItem(CUSTOM_BOARDS_KEY, JSON.stringify(boards || []));
};

var isMainBoardId = (id) => {
    const v = String(id || "").trim().toLowerCase();
    return defaultBoards.some((b) => b.id === v);
};

var getCachedSomoimBoards = () => {
    const raw = localStorage.getItem(SOMOIM_CACHE_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .map((b) => ({
                id: String((b && b.id) || "").trim().toLowerCase(),
                title: String((b && b.title) || "").trim()
            }))
            .filter((b) => b.id && b.title);
    } catch (e) {
        return [];
    }
};

var saveCachedSomoimBoards = (boards) => {
    localStorage.setItem(SOMOIM_CACHE_KEY, JSON.stringify(boards || []));
    localStorage.setItem(SOMOIM_CACHE_TS_KEY, String(Date.now()));
};

var parseSomoimBoardsFromDoc = (doc) => {
    const links = selectAllByFallback(doc, [
        ".snb_groupmenu a.menu-list.somoim",
        "a.menu-list.somoim",
        "a[href^='/service/board/cm_']"
    ]);
    const seen = new Set();
    const items = [];
    for (let i = 0; i < links.length; i++) {
        const a = links[i];
        const href = toAbsoluteUrl(getAttr(a, "href"));
        const parsed = parseBoardUrl(href);
        if (!parsed || !parsed.boardId) continue;
        const id = String(parsed.boardId || "").trim().toLowerCase();
        if (!id || seen.has(id)) continue;
        const title = firstNonEmpty([
            getAttr(a, "title"),
            getText(selectFirst(a, [".menu_over"])),
            getText(a),
            id
        ]);
        if (!title) continue;
        seen.add(id);
        items.push({ id: id, title: title });
    }
    return items;
};

var fetchSomoimBoardsFromHome = () => {
    try {
        const response = fetchWithRedirect(HOME_URL, 3);
        if (!response || !response.ok) return [];
        const doc = response.dom("text/html");
        const boards = parseSomoimBoardsFromDoc(doc);
        if (boards.length > 0) {
            saveCachedSomoimBoards(boards);
        }
        return boards;
    } catch (e) {
        console.log(`[somoim] fetch failed: ${e.toString()}`);
        return [];
    }
};

var getSomoimBoards = () => {
    const ts = parseIntSafe(localStorage.getItem(SOMOIM_CACHE_TS_KEY), 0);
    const cached = getCachedSomoimBoards();
    if (cached.length > 0 && Date.now() - ts < SOMOIM_CACHE_TTL) {
        return cached;
    }
    const fetched = fetchSomoimBoardsFromHome();
    if (fetched.length > 0) return fetched;
    return cached;
};

var dedupeBoards = (boards) => {
    const out = [];
    const seen = new Set();
    for (let i = 0; i < (boards || []).length; i++) {
        const b = boards[i];
        const id = String((b && b.id) || "").trim().toLowerCase();
        const title = String((b && b.title) || "").trim();
        if (!id || !title || seen.has(id)) continue;
        seen.add(id);
        out.push({ id: id, title: title, custom: !!(b && b.custom) });
    }
    return out;
};

var getSystemBoards = () => {
    return dedupeBoards(defaultBoards.concat(getSomoimBoards()));
};

var getAllBoards = () => {
    return dedupeBoards(getSystemBoards().concat(getCustomBoards()));
};

var getBoardOrder = () => {
    const raw = localStorage.getItem(BOARD_ORDER_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.map((id) => String(id || "").trim().toLowerCase()).filter((id) => id.length > 0);
    } catch (e) {
        return [];
    }
};

var saveBoardOrder = (order) => {
    localStorage.setItem(BOARD_ORDER_KEY, JSON.stringify(order || []));
};

var getVisibleMapRaw = () => {
    const raw = localStorage.getItem(VISIBLE_BOARDS_KEY);
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
        return {};
    }
};

var saveVisibleMap = (visible) => {
    localStorage.setItem(VISIBLE_BOARDS_KEY, JSON.stringify(visible || {}));
};

var isDefaultVisible = (id) => isMainBoardId(id);

var isBoardVisible = (id, visibleMap) => {
    const key = String(id || "").trim().toLowerCase();
    if (!key) return false;
    if (!visibleMap || visibleMap[key] === undefined) return isDefaultVisible(key);
    return !!visibleMap[key];
};

var getSortedBoards = () => {
    const all = getAllBoards();
    const order = getBoardOrder();
    const orderMap = {};
    for (let i = 0; i < order.length; i++) {
        orderMap[order[i]] = i;
    }
    const defaultIndex = {};
    for (let i = 0; i < all.length; i++) {
        defaultIndex[all[i].id] = i;
    }
    return all.slice().sort((a, b) => {
        const ai = orderMap[a.id] !== undefined ? orderMap[a.id] : (100000 + defaultIndex[a.id]);
        const bi = orderMap[b.id] !== undefined ? orderMap[b.id] : (100000 + defaultIndex[b.id]);
        if (ai !== bi) return ai - bi;
        return String(a.id || "").localeCompare(String(b.id || ""));
    });
};

var getVisibleBoards = () => {
    const visibleMap = getVisibleMapRaw();
    return getSortedBoards().filter((b) => isBoardVisible(b.id, visibleMap));
};

var getAllBoardsVisibility = () => {
    const visible = getVisibleMapRaw();
    const all = getAllBoards();
    for (let i = 0; i < all.length; i++) {
        const id = all[i].id;
        if (visible[id] === undefined) {
            visible[id] = isDefaultVisible(id);
        }
    }
    return visible;
};

var setBoards = (boards) => {
    homeBoards = boards ? boards.slice() : getVisibleBoards();
    boardMap = new Map();
    const all = getAllBoards();
    for (let i = 0; i < all.length; i++) {
        boardMap.set(all[i].id, all[i]);
    }
};

var normalizeBoardId = (input) => {
    const raw = String(input || "").trim();
    if (!raw) return "";

    const direct = raw.match(/^([a-zA-Z0-9_-]+)$/);
    if (direct && direct[1]) return direct[1].toLowerCase();

    const pathMatch = raw.match(/\/service\/board\/([^\/?#&]+)/i);
    if (pathMatch && pathMatch[1]) return String(pathMatch[1]).trim().toLowerCase();

    const cleaned = raw
        .replace(/^https?:\/\/[^/]+/i, "")
        .replace(/^\/+/, "")
        .replace(/[#?].*$/, "")
        .replace(/^service\/board\//i, "")
        .replace(/\/.*$/, "")
        .trim();
    const safe = cleaned.match(/^([a-zA-Z0-9_-]+)$/);
    return safe && safe[1] ? safe[1].toLowerCase() : "";
};

var addCustomBoard = (idInput, titleInput) => {
    const id = normalizeBoardId(idInput);
    const title = String(titleInput || "").trim();

    if (!id || !title) {
        return { ok: false, error: "게시판 ID와 이름을 모두 입력해주세요." };
    }

    const existsInDefault = getSystemBoards().some((b) => b.id === id);
    const customBoards = getCustomBoards();
    const existsInCustom = customBoards.some((b) => b.id === id);
    if (existsInDefault || existsInCustom) {
        return { ok: false, error: "이미 존재하는 게시판 ID입니다." };
    }

    const next = customBoards.concat([{ id: id, title: title, custom: true }]);
    saveCustomBoards(next);
    const visible = getAllBoardsVisibility();
    visible[id] = true;
    saveVisibleMap(visible);

    const order = getBoardOrder();
    if (order.length > 0 && !order.includes(id)) {
        order.push(id);
        saveBoardOrder(order);
    }

    return { ok: true, board: { id: id, title: title, custom: true } };
};

var getHomeMenus = (isReorderable) => ["캐시설정", "브라우저로 보기", "새로고침", "소모임", { label: "정렬", checked: !!isReorderable }];

var buildHomeContents = (boards) => {
    return (boards || []).map((b) => ({
        id: b.id,
        title: b.title,
        link: buildBoardUrl(b.id, 0)
    }));
};

var refreshHomeView = (viewId, snackbar) => {
    const boards = getHomeBoards();
    setBoards(boards);
    const params = getParams(viewId);
    const isReorderable = !!params.isReorderable;

    const models = {
        contents: buildHomeContents(boards),
        menus: getHomeMenus(isReorderable)
    };
    if (snackbar) models.snackbar = snackbar;

    synura.update(viewId, {
        styles: { reorderable: isReorderable },
        models: models
    });
};

var toBooleanInput = (value, fallback) => {
    if (value === undefined || value === null || value === "") return !!fallback;
    if (value === true || value === false) return value;
    const s = String(value).trim().toLowerCase();
    return !(s === "false" || s === "0" || s === "off" || s === "no");
};

var getCacheSettingsBody = () => {
    const currentTTLMinutes = Math.max(1, Math.round(getCacheTTL() / 60000));
    return [
        { type: "number", name: "ttl", label: "캐시 TTL (분)", value: currentTTLMinutes },
        { type: "boolean", name: "show_snackbar", label: "캐시 알림 표시", value: getShowCacheSnackbar() }
    ];
};

var getBoardSettingsBody = () => {
    const visible = getAllBoardsVisibility();
    return getSortedBoards().map((b) => ({
        type: "boolean",
        name: b.id,
        label: b.title,
        value: isBoardVisible(b.id, visible)
    }));
};

var showBoardSettings = (parentViewId) => {
    synura.open({
        view: "/views/settings",
        styles: { title: "소모임/게시판 설정" },
        models: {
            body: getBoardSettingsBody(),
            buttons: ["추가", "저장", "초기화", "취소"]
        }
    }, { from: "board_settings", parentViewId: parentViewId }, (event) => {
        SYNURA.main.onViewEvent(event.viewId, event);
    });
};

var getText = (el) => {
    if (!el) return "";
    const raw = (el.textContent || el.text || "").trim();
    return raw.replace(/\s+/g, " ");
};

var getNickText = (el) => {
    if (!el) return "";
    const text = getText(el);
    if (text) return text;
    return firstNonEmpty([
        getAttr(el, "title"),
        getAttr(selectFirst(el, ["[title]"]), "title"),
        getAttr(selectFirst(el, ["img[alt]"]), "alt"),
        getAttr(selectFirst(el, ["img[title]"]), "title")
    ]);
};

var getAttr = (el, name) => {
    if (!el || !name) return "";
    if (typeof el.getAttribute !== "function") return "";
    return (el.getAttribute(name) || "").trim();
};

var firstNonEmpty = (arr) => {
    if (!arr || !Array.isArray(arr)) return "";
    for (let i = 0; i < arr.length; i++) {
        const v = arr[i];
        if (v === null || v === undefined) continue;
        const s = String(v).trim();
        if (s.length > 0) return s;
    }
    return "";
};

var parseNumber = (value) => {
    const s = String(value || "").replace(/[^0-9-]/g, "");
    if (!s || s === "-" || s === "--") return "";
    return s;
};

var hideZeroCount = (value) => {
    const s = String(value || "").trim();
    return s === "0" ? "" : s;
};

var DATE_FORMAT_CONTEXT = (() => {
    const now = new Date();
    const currentYear = String(now.getFullYear());
    const today = `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const nextRefreshAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    return { today: today, nextRefreshAt: nextRefreshAt };
})();

var getDateFormatContext = () => {
    const nowMs = Date.now();
    if (nowMs < DATE_FORMAT_CONTEXT.nextRefreshAt) {
        return DATE_FORMAT_CONTEXT;
    }

    const now = new Date(nowMs);
    DATE_FORMAT_CONTEXT.today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    DATE_FORMAT_CONTEXT.nextRefreshAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    return DATE_FORMAT_CONTEXT;
};

var selectBestDateValue = (values) => {
    if (!values || !Array.isArray(values)) return "";

    let fallback = "";
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (value === null || value === undefined) continue;

        const s = String(value).replace(/\s+/g, " ").trim();
        if (!s) continue;
        if (!fallback) fallback = s;
        if (/\d{4}-\d{2}-\d{2}/.test(s)) return s;
    }

    return fallback;
};

var formatCommentDate = (value) => {
    if (!value) return "";

    const raw = String(value)
        .replace(/\s*\/\s*수정\b.*$/u, "")
        .replace(/\s*\(수정\)\s*$/u, "")
        .replace(/\s+/g, " ")
        .trim();
    if (!raw) return "";

    const normalized = raw
        .replace("T", " ")
        .replace(/\.\d+/, "")
        .replace(/([+-]\d{2}:?\d{2}|Z)$/, "")
        .trim();
    const fullMatches = normalized.match(/\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}(?::\d{2})?)?/g);
    const candidate = fullMatches && fullMatches.length > 0 ? fullMatches[fullMatches.length - 1] : normalized;
    const matched = candidate.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}:\d{2})(?::\d{2})?)?$/);

    if (matched) {
        const today = getDateFormatContext().today;
        const datePart = `${matched[1]}-${matched[2]}-${matched[3]}`;
        const timePart = matched[4] || "";
        if (datePart === today) {
            return timePart || `${matched[2]}-${matched[3]}`;
        }
        return timePart ? `${matched[2]}-${matched[3]} ${timePart}` : `${matched[2]}-${matched[3]}`;
    }

    const timeMatch = candidate.match(/\b(\d{1,2}:\d{2})(?::\d{2})?\b/);
    if (timeMatch) return timeMatch[1];
    return raw;
};

var parseIntSafe = (value, fallback) => {
    const n = parseInt(String(value || ""), 10);
    return isNaN(n) ? fallback : n;
};

var toAbsoluteUrl = (url) => {
    if (!url) return "";
    const s = String(url).trim();
    if (!s) return "";
    if (s.startsWith("http://")) return "https://" + s.substring("http://".length);
    if (s.startsWith("https://")) return s;
    if (s.startsWith("//")) return "https:" + s;
    if (s.startsWith("/")) return `https://${SYNURA.domain}${s}`;
    return `https://${SYNURA.domain}/${s}`;
};

var normalizeUrl = (url) => toAbsoluteUrl(String(url || "").trim());

var getHeaderValue = (headers, name) => {
    if (!headers || !name) return "";
    const key = String(name).toLowerCase();
    try {
        if (typeof headers.get === "function") {
            return headers.get(name) || headers.get(key) || "";
        }
    } catch (e) {
    }
    return firstNonEmpty([
        headers[name],
        headers[key]
    ]);
};

var decodeHtmlEntities = (text) => {
    if (!text) return "";
    return String(text)
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, "\"")
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
};

var extractRedirectUrlFromBody = (html) => {
    if (!html) return "";
    const body = String(html);

    const candidates = [];

    const meta = body.match(/<meta[^>]+http-equiv=["']?refresh["']?[^>]+content=["'][^"']*url\s*=\s*([^"'>;\s]+)[^"']*["']/i);
    if (meta && meta[1]) candidates.push(meta[1]);

    const jsPatterns = [
        /window\.location\.replace\(\s*["']([^"']+)["']\s*\)/i,
        /window\.location\.href\s*=\s*["']([^"']+)["']/i,
        /window\.location\s*=\s*["']([^"']+)["']/i,
        /location\.href\s*=\s*["']([^"']+)["']/i,
        /location\.replace\(\s*["']([^"']+)["']\s*\)/i,
        /document\.location\.href\s*=\s*["']([^"']+)["']/i
    ];
    for (let i = 0; i < jsPatterns.length; i++) {
        const m = body.match(jsPatterns[i]);
        if (m && m[1]) candidates.push(m[1]);
    }

    for (let i = 0; i < candidates.length; i++) {
        const decoded = decodeHtmlEntities(candidates[i]).trim();
        if (decoded) return decoded;
    }

    return "";
};

var truncateForLog = (text, maxLen) => {
    const s = String(text || "").replace(/\s+/g, " ").trim();
    const limit = parseIntSafe(maxLen, 200);
    if (s.length <= limit) return s;
    return s.substring(0, limit) + "...";
};

var fetchWithRedirect = (url, maxRedirects) => {
    let current = normalizeUrl(url);
    const seen = new Set();
    const limit = parseIntSafe(maxRedirects, 3);
    let response = null;

    for (let i = 0; i <= limit; i++) {
        response = fetch(current);
        if (!response) {
            console.log(`[fetchWithRedirect] No response for ${current}`);
            return null;
        }

        const status = parseIntSafe(response.status, 0);
        if (status < 300 || status >= 400) {
            if (i > 0) {
                console.log(`[fetchWithRedirect] Final response ${status} ${response.statusText || ""} at ${current} (response.url=${response.url || ""})`);
            }
            return response;
        }

        let location = firstNonEmpty([
            getHeaderValue(response.headers, "location"),
            getHeaderValue(response.headers, "Location")
        ]);

        if (!location) {
            // Some runtimes hide Location on 3xx. Try an explicit follow-mode retry.
            try {
                const followed = fetch(current, { redirect: "follow" });
                if (followed && followed.ok && parseIntSafe(followed.status, 0) < 300) {
                    console.log(`[fetchWithRedirect] Recovered by redirect=follow: ${current} -> ${followed.url || "(unknown)"}`);
                    return followed;
                }
                if (followed) {
                    console.log(`[fetchWithRedirect] redirect=follow retry status=${followed.status} url=${followed.url || ""}`);
                }
            } catch (e) {
                console.log(`[fetchWithRedirect] redirect=follow retry failed at ${current}: ${e.toString()}`);
            }

            try {
                const body = response.text();
                const bodyLen = (body || "").length;
                if (bodyLen > 0) {
                    console.log(`[fetchWithRedirect] 3xx body length=${bodyLen} snippet="${truncateForLog(body, 220)}"`);
                } else {
                    console.log(`[fetchWithRedirect] 3xx body is empty at ${current}`);
                }
                const bodyRedirect = extractRedirectUrlFromBody(body);
                if (bodyRedirect) {
                    location = bodyRedirect;
                    console.log(`[fetchWithRedirect] Redirect target from body: ${location}`);
                }
            } catch (e) {
                console.log(`[fetchWithRedirect] Failed to read 3xx body at ${current}: ${e.toString()}`);
            }
        }

        if (!location) {
            console.log(`[fetchWithRedirect] Redirect status ${status} ${response.statusText || ""} but no location header at ${current} (response.url=${response.url || ""})`);
            return response;
        }

        const nextUrl = normalizeUrl(location);
        console.log(`[fetchWithRedirect] Redirect ${status}: ${current} -> ${nextUrl}`);
        if (!nextUrl || seen.has(nextUrl)) {
            console.log(`[fetchWithRedirect] Redirect loop/invalid target at ${current}`);
            return response;
        }
        seen.add(nextUrl);
        current = nextUrl;
    }

    console.log(`[fetchWithRedirect] Redirect limit exceeded (${limit}) for ${normalizeUrl(url)}`);
    return response;
};

var splitAnchor = (url) => {
    const s = String(url || "");
    const idx = s.indexOf("#");
    if (idx < 0) return { baseUrl: s, anchor: null };
    return {
        baseUrl: s.substring(0, idx),
        anchor: s.substring(idx + 1) || null
    };
};

var parsePo = (url) => {
    const m = String(url || "").match(/[?&]po=(\d+)/);
    return m ? parseIntSafe(m[1], 0) : 0;
};

var parseBoardUrl = (url) => {
    const clean = splitAnchor(normalizeUrl(url)).baseUrl;
    const m = clean.match(/^https?:\/\/(?:(?:www|m)\.)?clien\.net\/service\/board\/([^\/?#]+)(?:\/(\d+))?/i);
    if (!m) return null;
    return {
        boardId: m[1],
        postId: m[2] || null
    };
};

var buildBoardUrlCandidates = (boardId, po) => {
    const page = parseIntSafe(po, 0);
    const base = `https://${SYNURA.domain}/service/board/${boardId}`;
    const candidates = [
        `${base}?od=T31&category=0&po=${page}`,
        `${base}?&od=T31&category=0&po=${page}`,
        `${base}/?od=T31&category=0&po=${page}`
    ];
    if (page === 0) {
        candidates.push(base);
        candidates.push(`${base}/`);
    }
    return Array.from(new Set(candidates));
};

var buildPostUrlCandidates = (link) => {
    const normalized = normalizeUrl(link);
    const route = parseBoardUrl(normalized);
    if (!route || !route.postId) return [normalized];

    const canonical = `https://${SYNURA.domain}/service/board/${route.boardId}/${route.postId}`;
    return Array.from(new Set([
        canonical,
        `${canonical}/`,
        normalized
    ]));
};

var isHomeUrl = (url) => {
    const clean = splitAnchor(normalizeUrl(url)).baseUrl;
    return /^https?:\/\/(?:(?:www|m)\.)?clien\.net\/service\/?$/i.test(clean);
};

var buildBoardUrl = (boardId, po) => {
    const page = parseIntSafe(po, 0);
    return `https://${SYNURA.domain}/service/board/${boardId}?&od=T31&category=0&po=${page}`;
};

var selectFirst = (root, selectors) => {
    if (!root || !selectors) return null;
    for (let i = 0; i < selectors.length; i++) {
        const el = root.querySelector(selectors[i]);
        if (el) return el;
    }
    return null;
};

var selectAllByFallback = (root, selectors) => {
    if (!root || !selectors) return [];
    for (let i = 0; i < selectors.length; i++) {
        const nodes = root.querySelectorAll(selectors[i]);
        if (nodes && nodes.length > 0) return nodes;
    }
    return [];
};

var extractBoardTitle = (doc, boardId) => {
    const fromNode = firstNonEmpty([
        getText(selectFirst(doc, [
            ".board_name .board_subject span",
            ".board_name .board_subject",
            "h3.board_name",
            ".board_name",
            ".board_title",
            "h2.board_title",
            "h2 .board_name"
        ])),
        getAttr(selectFirst(doc, ["input#boardName"]), "value")
    ]);

    if (fromNode) return fromNode;

    const pageTitle = getText(selectFirst(doc, ["title"]))
        .replace(/\s*:\s*클리앙\s*$/i, "")
        .replace(/\s*-\s*클리앙\s*$/i, "")
        .trim();
    if (pageTitle) return pageTitle;

    if (boardMap.has(boardId)) return boardMap.get(boardId).title;
    return boardId;
};

var parseElementDetails = (el) => {
    if (!el) return [];
    try {
        const parsed = synura.parse("post", el);
        if (parsed && parsed.length > 0) return parsed;
    } catch (e) {
    }
    const txt = getText(el);
    return txt ? [{ type: "text", value: txt }] : [];
};

var extractNextPo = (doc, currentPo, itemCount) => {
    const links = doc.querySelectorAll("a[href]");
    const values = new Set();
    for (let i = 0; i < links.length; i++) {
        const href = getAttr(links[i], "href");
        const poMatch = href.match(/[?&]po=(\d+)/);
        if (poMatch) values.add(parseIntSafe(poMatch[1], -1));

        // Clien uses javascript:paging.getBoard('direct', N) style links.
        const directMatch = href.match(/paging\.getBoard\('direct',\s*(\d+)\)/);
        if (directMatch) values.add(parseIntSafe(directMatch[1], -1));
    }

    const sorted = Array.from(values).filter((n) => n >= 0).sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] > currentPo) return sorted[i];
    }

    if (!itemCount || itemCount <= 0) return null;
    return currentPo + 1;
};

var getCachedRoute = (url) => {
    const cached = sessionStorage.getItem(url);
    if (!cached) return null;
    const age = Date.now() - cached.timestamp;
    if (age < getCacheTTL()) return cached;
    sessionStorage.removeItem(url);
    return null;
};

var setCachedRoute = (url, routeData) => {
    routeData.timestamp = Date.now();
    sessionStorage.setItem(url, routeData);
};

var formatDuration = (ms) => {
    if (ms < 0) ms = 0;
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const rem = sec % 60;
    if (min > 0) return `${min}분 ${rem}초`;
    return `${rem}초`;
};

var showCacheSnackbar = (viewId, routeData) => {
    if (!getShowCacheSnackbar()) return;
    if (!routeData || !routeData.timestamp) return;
    const age = Date.now() - routeData.timestamp;
    if (age < CACHE_SNACKBAR_MIN_AGE_MS) return;
    const msg = `${formatDuration(age)} 전 캐시된 데이터입니다.`;
    synura.update(viewId, { models: { snackbar: msg } });
};

var createPostRouteData = (link, postData, anchor) => {
    const styles = { ...postData.styles };
    if (anchor) styles.anchor = anchor;
    return {
        view: "/views/post",
        timestamp: Date.now(),
        styles: styles,
        models: {
            ...postData.models,
            link: link,
            menus: ["브라우저로 보기"],
            buttons: ["새로고침"]
        }
    };
};

var getHomeBoards = () => {
    return getVisibleBoards();
};

var fetchBoardPage = (boardId, po) => {
    const page = parseIntSafe(po, 0);
    const candidates = buildBoardUrlCandidates(boardId, page);
    console.log("Fetching board page:", candidates[0]);

    let response = null;
    let usedUrl = "";
    for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        const res = fetchWithRedirect(candidate, 4);
        const status = res ? res.status : "Unknown";
        console.log(`[fetchBoardPage] try ${i + 1}/${candidates.length}: ${candidate} -> ${status}`);
        if (res && res.ok) {
            response = res;
            usedUrl = candidate;
            break;
        }
    }

    if (!response || !response.ok) {
        const location = response ? firstNonEmpty([
            getHeaderValue(response.headers, "location"),
            getHeaderValue(response.headers, "Location")
        ]) : "";
        const reason = location ? ` (redirect: ${location})` : "";
        console.log(`[fetchBoardPage] failed boardId=${boardId} po=${page} status=${response ? response.status : "Unknown"}${reason}`);
        throw new Error(`HTTP ${response ? response.status : "Unknown"}: 게시판을 불러올 수 없습니다.${reason}`);
    }
    console.log(`[fetchBoardPage] success using ${usedUrl}`);
    const doc = response.dom("text/html");

    const rows = selectAllByFallback(doc, [
        "[data-role='list-row']",
        "a.list_item",
        "div.list_item.symph_row",
        "div.list_item",
        "tr.list_item",
        "tr"
    ]);

    const seenPostIds = new Set();
    const items = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let linkEl = selectFirst(row, [
            ".list_title a.list_subject",
            "a.list_subject",
            "a[href*='/service/board/']"
        ]);

        if (!linkEl) {
            const rowHref = getAttr(row, "href");
            if (rowHref) {
                const absRowHref = toAbsoluteUrl(rowHref);
                const parsedRow = parseBoardUrl(absRowHref);
                if (parsedRow && parsedRow.postId) {
                    linkEl = row;
                }
            }
        }

        if (!linkEl) continue;

        const href = toAbsoluteUrl(getAttr(linkEl, "href"));
        const parsed = parseBoardUrl(href);
        if (!parsed || !parsed.postId) continue;
        if (parsed.boardId !== boardId) continue;
        if (seenPostIds.has(parsed.postId)) continue;
        seenPostIds.add(parsed.postId);

        const titleRaw = firstNonEmpty([
            getText(selectFirst(linkEl, [
                "[data-role='list-title-text']",
                ".subject_fixed",
                "span"
            ])),
            getText(linkEl)
        ]);
        if (!titleRaw) continue;

        let commentCount = parseNumber(firstNonEmpty([
            getAttr(row, "data-comment-count"),
            getText(selectFirst(row, [
                ".list_comment",
                ".comment_count",
                ".reply_count",
                ".list_reply",
                ".rSymph05",
                "[data-role='list-comment-count']"
            ])),
            getAttr(selectFirst(row, [".list_reply"]), "title")
        ]));

        if (!commentCount) {
            const m = titleRaw.match(/\[(\d+)\]\s*$/);
            if (m) commentCount = m[1];
        }

        const title = titleRaw.replace(/\s*\[\d+\]\s*$/, "").trim();
        const author = firstNonEmpty([
            getNickText(selectFirst(row, [
                ".list_author .nickname",
                ".list_author .nickimg",
                ".list_author .nickimg img",
                ".list_author",
                ".author",
                "[data-role='list-author']"
            ])),
            getText(selectFirst(row, [
                ".list_author .nickname",
                ".list_author",
                ".author",
                "[data-role='list-author']"
            ]))
        ]);
        const date = firstNonEmpty([
            getText(selectFirst(row, [
                ".list_time",
                ".list_date",
                "time",
                "[data-role='list-date']"
            ]))
        ]);
        const viewCount = parseNumber(firstNonEmpty([
            getText(selectFirst(row, [
                ".list_hit",
                ".list_view",
                ".hit",
                "[data-role='list-hit']"
            ]))
        ]));
        const likeCount = parseNumber(firstNonEmpty([
            getText(selectFirst(row, [
                ".list_symph",
                ".symph_count",
                ".list_recommend",
                "[data-role='list-like-count']"
            ]))
        ]));
        const category = firstNonEmpty([
            getText(selectFirst(row, [
                ".list_category",
                ".category",
                "[data-role='list-category']"
            ]))
        ]);
        let mediaUrl = getAttr(selectFirst(row, ["img[src]"]), "src");
        if (mediaUrl) mediaUrl = toAbsoluteUrl(mediaUrl);

        const hotBase = parseIntSafe(firstNonEmpty([likeCount, commentCount, viewCount]), 0);
        const types = [];
        if (mediaUrl) types.push("image");
        if (parseIntSafe(commentCount, 0) >= 10) types.push("hot");

        items.push({
            link: href,
            title: title || "(제목 없음)",
            author: author,
            date: date,
            category: category,
            viewCount: viewCount,
            likeCount: likeCount,
            commentCount: commentCount,
            dislikeCount: "",
            avatar: "",
            mediaUrl: mediaUrl || "",
            mediaType: mediaUrl ? "image" : "",
            types: types,
            hotCount: hotBase,
            coldCount: hotBase,
            menus: []
        });
    }

    if (items.length === 0) {
        const links = selectAllByFallback(doc, [
            ".list_title a.list_subject",
            "a.list_subject",
            "a[href*='/service/board/']"
        ]);
        const seen = new Set();
        for (let i = 0; i < links.length; i++) {
            const a = links[i];
            const href = toAbsoluteUrl(getAttr(a, "href"));
            const parsed = parseBoardUrl(href);
            if (!parsed || !parsed.postId) continue;
            if (parsed.boardId !== boardId) continue;
            if (seen.has(parsed.postId)) continue;
            seen.add(parsed.postId);

            const title = getText(a).replace(/\s*\[\d+\]\s*$/, "").trim();
            if (!title) continue;

            items.push({
                link: href,
                title: title,
                author: "",
                date: "",
                category: "",
                viewCount: "",
                likeCount: "",
                commentCount: "",
                dislikeCount: "",
                avatar: "",
                types: [],
                menus: [],
                hotCount: 0,
                coldCount: 0
            });
        }
    }

    return {
        url: usedUrl || buildBoardUrl(boardId, page),
        title: extractBoardTitle(doc, boardId),
        items: items,
        nextPo: extractNextPo(doc, page, items.length)
    };
};

var parseCommentLevel = (row) => {
    const depthAttr = firstNonEmpty([
        getAttr(row, "data-depth"),
        getAttr(row, "depth")
    ]);
    const depthNum = parseIntSafe(depthAttr, -1);
    if (depthNum >= 0) return depthNum;

    const cls = getAttr(row, "class");
    if (/depth[_-]?2|reply|recomment|comment_reply|indent2|\bre\b/i.test(cls)) return 1;
    if (/depth[_-]?3|indent3/i.test(cls)) return 2;

    const style = getAttr(row, "style");
    const m = style.match(/margin-left\s*:\s*(\d+)px/i);
    if (m) {
        const px = parseIntSafe(m[1], 0);
        return Math.max(0, Math.round(px / 20));
    }
    return 0;
};

var parseDomComments = (doc, postUrl, postAuthor) => {
    const rows = selectAllByFallback(doc, [
        "#comment_view .comment_row",
        ".comment_row",
        ".comment_list .comment_item",
        ".comment_list li",
        ".post_comment .comment_item",
        ".post_comment .comment_row",
        "[data-role='comment-item']"
    ]);
    const comments = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const author = firstNonEmpty([
            getNickText(selectFirst(row, [
                ".nickname",
                ".name",
                ".comment_author",
                ".user_name",
                "[data-role='comment-author']"
            ]))
        ]);

        const contentWrap = selectFirst(row, [
            ".comment_content",
            ".comment_text",
            ".comment_contents",
            ".cmt_content",
            "[data-role^='comment-content-']",
            "[data-role='comment-content']"
        ]);
        const contentEl = selectFirst(row, [
            ".comment_view",
            "[data-comment-view]",
            ".comment_content .comment_view",
            ".comment_text",
            ".comment_contents",
            ".cmt_content",
            "[data-role^='comment-content-']",
            "[data-role='comment-content']"
        ]);
        let content = parseElementDetails(contentEl);
        if (!content || content.length === 0) {
            // Fallback to comment-only container, never whole row (row text includes IP/menu metadata).
            const wrapText = getText(contentWrap || contentEl);
            if (wrapText) content = [{ type: "text", value: wrapText }];
        }
        if (!content || content.length === 0) {
            const hiddenRaw = firstNonEmpty([
                getAttr(selectFirst(contentWrap || row, ["input[data-comment-modify]"]), "value"),
                getAttr(selectFirst(row, ["input[data-comment-modify]"]), "value")
            ]);
            const hidden = String(hiddenRaw || "").trim();
            if (hidden) content = [{ type: "text", value: hidden }];
        }
        if (!content || content.length === 0) continue;

        const likeCount = parseNumber(firstNonEmpty([
            getText(selectFirst(row, [
                ".symph_count",
                ".comment_symph .num",
                ".comment_symph strong",
                "[id^='setLikeCount_']",
                ".recommend_count",
                ".comment_recommend .num",
                "[data-role='comment-like']"
            ]))
        ]));
        const dislikeCount = parseNumber(firstNonEmpty([
            getText(selectFirst(row, [
                ".not_symph_count",
                ".comment_not_recommend .num",
                "[data-role='comment-dislike']"
            ]))
        ]));
        const dateEl = selectFirst(row, [
            ".comment_time",
            ".post_time",
            ".timestamp",
            "time",
            "[data-role='comment-date']"
        ]);
        const nestedTimeEl = selectFirst(dateEl, ["time"]);
        const date = formatCommentDate(selectBestDateValue([
            getAttr(dateEl, "datetime"),
            getAttr(nestedTimeEl, "datetime"),
            getAttr(dateEl, "title"),
            getAttr(nestedTimeEl, "title"),
            getText(nestedTimeEl),
            getText(dateEl)
        ]));
        const avatar = toAbsoluteUrl(getAttr(selectFirst(row, [
            ".post_contact img",
            ".contact_name img",
            ".nickname img",
            ".comment_profile img",
            ".profile img"
        ]), "src"));
        const level = parseCommentLevel(row);
        const rowId = firstNonEmpty([
            getAttr(row, "data-comment-sn"),
            getAttr(selectFirst(row, [".comment_point"]), "id"),
            getAttr(row, "id"),
            `comment_${i}`
        ]);

        const normalizedLikeCount = hideZeroCount(likeCount);
        const hotBase = parseIntSafe(likeCount, 0);
        const menus = ["답글"];
        if (author && postAuthor && author === postAuthor) {
            menus.push("작성자");
        }

        comments.push({
            link: `${postUrl}#${rowId}`,
            author: author,
            avatar: avatar,
            content: content,
            date: date,
            likeCount: normalizedLikeCount,
            dislikeCount: dislikeCount,
            level: level,
            menus: menus,
            hotCount: hotBase,
            coldCount: hotBase
        });
    }

    return comments;
};

var fetchPost = (link) => {
    const candidates = buildPostUrlCandidates(link);
    const primaryUrl = candidates[0];
    console.log("Fetching post:", primaryUrl);

    let response = null;
    let usedUrl = "";
    for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        const res = fetchWithRedirect(candidate, 4);
        const status = res ? res.status : "Unknown";
        console.log(`[fetchPost] try ${i + 1}/${candidates.length}: ${candidate} -> ${status}`);
        if (res && res.ok) {
            response = res;
            usedUrl = candidate;
            break;
        }
    }

    if (!response || !response.ok) {
        const location = response ? firstNonEmpty([
            getHeaderValue(response.headers, "location"),
            getHeaderValue(response.headers, "Location")
        ]) : "";
        const reason = location ? ` (redirect: ${location})` : "";
        console.log(`[fetchPost] failed url=${primaryUrl} status=${response ? response.status : "Unknown"}${reason}`);
        throw new Error(`HTTP ${response ? response.status : "Unknown"}: 게시글을 불러올 수 없습니다.${reason}`);
    }
    console.log(`[fetchPost] success using ${usedUrl}`);

    const doc = response.dom("text/html");

    let title = firstNonEmpty([
        getText(selectFirst(doc, [
            "h3.post_subject span",
            "h3.post_subject",
            ".post_subject span",
            ".post_subject",
            "h1.subject",
            "h1"
        ])),
        getAttr(selectFirst(doc, ["meta[property='og:title']"]), "content")
    ]);
    title = title.replace(/\s*:\s*클리앙\s*$/i, "").trim();

    const author = firstNonEmpty([
        getNickText(selectFirst(doc, [
            ".post_contact .contact_name",
            ".post_contact .nickimg",
            ".post_contact .nickimg img",
            ".post_author .nickname",
            ".post_author .name",
            ".post_info .nickname",
            ".post_info .name",
            ".author .nickname",
            ".author",
            "[data-role='post-author']"
        ]))
    ]);
    const date = firstNonEmpty([
        getText(selectFirst(doc, [
            ".post_information .post_date .time",
            ".post_information .post_date",
            ".post_information .post_time",
            ".post_author .view_count.date",
            ".post_time",
            ".post_info .post_time",
            ".post_info time",
            "[data-role='post-date']",
            "time"
        ]))
    ]);
    const viewCount = parseNumber(firstNonEmpty([
        getText(selectFirst(doc, [
            ".view_count",
            ".post_hit",
            ".post_view_count",
            ".hit",
            "[data-role='post-hit']"
        ]))
    ]));
    const likeCount = parseNumber(firstNonEmpty([
        getText(selectFirst(doc, [
            ".symph_count",
            ".post_symph",
            ".recommend_count",
            ".post_recommend .num",
            "[data-role='post-like']"
        ]))
    ]));
    const dislikeCount = parseNumber(firstNonEmpty([
        getText(selectFirst(doc, [
            ".not_symph_count",
            ".post_not_symph",
            ".not_recommend_count",
            "[data-role='post-dislike']"
        ]))
    ]));

    const contentEl = selectFirst(doc, [
        "article .post_article body",
        "article .post_article",
        ".post_article body",
        ".post_article",
        "article .post_content body",
        "article .post_content",
        "#div_content",
        "[data-role='post-content']"
    ]);

    let content = parseElementDetails(contentEl);
    if (!content || content.length === 0) {
        content = [{ type: "text", value: "(본문을 가져오지 못했습니다.)" }];
    }

    const comments = parseDomComments(doc, usedUrl || primaryUrl, author);
    const normalizedLikeCount = hideZeroCount(likeCount);
    const hotBase = parseIntSafe(likeCount, 0);

    return {
        styles: {
            title: title || "",
            hotThreshold: 50,
            coldThreshold: 50,
            commentHotThreshold: 30,
            commentColdThreshold: 30,
            authorClickable: true
        },
        models: {
            author: author || "",
            avatar: "",
            date: date || "",
            viewCount: viewCount || "",
            likeCount: normalizedLikeCount,
            dislikeCount: dislikeCount || "",
            hotCount: hotBase,
            coldCount: hotBase,
            content: content,
            comments: comments
        }
    };
};

var openBrowserView = (url, title) => {
    synura.open({
        view: "/views/browser",
        styles: { title: title || "Clien" },
        models: { url: normalizeUrl(url) }
    });
};

var openPost = (parentViewId, link) => {
    const url = normalizeUrl(link);
    const result = synura.open({
        view: "/views/post",
        styles: {
            title: "Loading...",
            hotThreshold: 50,
            coldThreshold: 50,
            commentHotThreshold: 30,
            commentColdThreshold: 30
        },
        models: {
            link: url,
            author: "",
            date: "",
            avatar: "",
            viewCount: "",
            likeCount: "",
            dislikeCount: "",
            content: [{ type: "text", value: "Loading content..." }],
            comments: [],
            menus: ["브라우저로 보기"],
            buttons: ["새로고침"]
        }
    }, { from: "post", link: url }, (event) => {
        SYNURA.main.onViewEvent(event.viewId, event);
    });

    if (!result.success) {
        if (parentViewId) {
            synura.update(parentViewId, { models: { snackbar: result.error || "게시글을 열 수 없습니다." } });
        }
        return;
    }

    try {
        const postData = fetchPost(url);
        synura.update(result.viewId, {
            ...postData,
            models: {
                ...postData.models,
                link: url,
                menus: ["브라우저로 보기"],
                buttons: ["새로고침"]
            }
        });
        setCachedRoute(url, createPostRouteData(url, postData));
    } catch (e) {
        synura.update(result.viewId, { models: { snackbar: e.toString() } });
    }
};

var openFromRoute = (parentViewId, url) => {
    const normalized = normalizeUrl(url);
    const split = splitAnchor(normalized);
    const baseUrl = split.baseUrl;

    let routeData = getCachedRoute(baseUrl);
    if (!routeData) {
        routeData = SYNURA.main.router(normalized);
    }

    if (routeData) {
        const parsed = parseBoardUrl(baseUrl);
        const context = parsed && parsed.postId
            ? { from: "post", link: baseUrl, anchor: split.anchor }
            : (parsed
                ? {
                    from: "board",
                    boardId: parsed.boardId,
                    boardTitle: boardMap.has(parsed.boardId) ? boardMap.get(parsed.boardId).title : parsed.boardId
                }
                : { from: "home" });

        const opened = synura.open(routeData);
        if (opened.success) {
            synura.connect(opened.viewId, context, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
            showCacheSnackbar(opened.viewId, routeData);
            return;
        }
    }

    openPost(parentViewId, baseUrl);
};

var loadBoardPage = (viewId, context, po, append) => {
    const page = parseIntSafe(po, 0);
    const boardId = context.boardId;
    const data = fetchBoardPage(boardId, page);

    setParams(viewId, {
        boardId: boardId,
        boardTitle: data.title || context.boardTitle || boardId,
        currentPo: page,
        nextPo: data.nextPo
    });

    synura.update(viewId, {
        styles: {
            title: data.title || context.boardTitle || boardId
        },
        models: append
            ? { append: data.items, snackbar: data.items.length === 0 ? "더 불러올 글이 없습니다." : "" }
            : { contents: data.items }
    });
};

var refreshPost = (viewId, link) => {
    const url = normalizeUrl(link);
    const postData = fetchPost(url);
    synura.update(viewId, {
        ...postData,
        models: {
            ...postData.models,
            link: url,
            menus: ["브라우저로 보기"],
            buttons: ["새로고침"],
            snackbar: "새로고침 완료"
        }
    });
    setCachedRoute(url, createPostRouteData(url, postData));
};

var resume = (viewId, context) => {
    synura.connect(viewId, context, (event) => {
        SYNURA.main.onViewEvent(viewId, event);
    });
};

var home = () => {
    const boards = getHomeBoards();
    setBoards(boards);

    const result = synura.open({
        view: "/views/list",
        styles: {
            title: "Clien",
            reorderable: false
        },
        models: {
            contents: buildHomeContents(boards),
            menus: getHomeMenus(false)
        }
    }, { from: "home" }, (event) => {
        SYNURA.main.onViewEvent(event.viewId, event);
    });

    if (result && result.success) {
        setParams(result.viewId, { isReorderable: false });
    }
};

var handleHomeEvent = (viewId, event) => {
    if (event.eventId === "CLICK") {
        const boards = homeBoards && homeBoards.length > 0 ? homeBoards : defaultBoards;
        let board = null;

        if (event.data && event.data.id) {
            board = boards.find((b) => b.id === event.data.id);
        }
        if (!board && event.data && event.data._index >= 0 && event.data._index < boards.length) {
            board = boards[event.data._index];
        }
        if (!board && event.data && event.data.link) {
            const parsed = parseBoardUrl(event.data.link);
            if (parsed) {
                board = {
                    id: parsed.boardId,
                    title: boardMap.has(parsed.boardId) ? boardMap.get(parsed.boardId).title : parsed.boardId
                };
            }
        }
        if (!board) return;

        const opened = synura.open({
            view: "/views/list",
            styles: {
                title: board.title,
                layout: "card",
                history: true,
                media: false,
                pagination: true,
                hotThreshold: 10000,
                coldThreshold: 10000
            },
            models: {
                menus: ["브라우저로 보기", "새로고침"]
            }
        }, { from: "board", boardId: board.id, boardTitle: board.title }, (e) => {
            SYNURA.main.onViewEvent(e.viewId, e);
        });

        if (opened.success) {
            setParams(opened.viewId, {
                boardId: board.id,
                boardTitle: board.title,
                currentPo: 0,
                nextPo: 0
            });
        } else {
            synura.update(viewId, { models: { snackbar: opened.error || "게시판을 열 수 없습니다." } });
        }
        return;
    }

    if (event.eventId === "MENU_CLICK") {
        if (event.data.menu === "캐시설정") {
            synura.open({
                view: "/dialogs/input",
                styles: {
                    title: "캐시 설정",
                    message: "캐시 설정을 변경하세요.",
                    close: true
                },
                models: {
                    body: getCacheSettingsBody(),
                    buttons: ["저장", "초기화", "취소"]
                }
            }, { from: "cache_settings", parentViewId: viewId }, (e) => {
                SYNURA.main.onViewEvent(e.viewId, e);
            });
            return;
        }
        if (event.data.menu === "브라우저로 보기") {
            openBrowserView(HOME_URL, "Clien");
            return;
        }
        if (event.data.menu === "새로고침") {
            refreshHomeView(viewId, "목록을 새로고침했습니다.");
            return;
        }
        if (event.data.menu === "소모임") {
            showBoardSettings(viewId);
            return;
        }
        if (event.data.menu === "정렬") {
            const params = getParams(viewId);
            const isReorderable = !params.isReorderable;
            setParams(viewId, { isReorderable: isReorderable });
            synura.update(viewId, {
                styles: { reorderable: isReorderable },
                models: {
                    menus: getHomeMenus(isReorderable),
                    snackbar: isReorderable ? "순서 변경이 활성화되었습니다." : "순서 변경이 비활성화되었습니다."
                }
            });
            return;
        }
    } else if (event.eventId === "REORDER") {
        const visibleBoards = getVisibleBoards();
        let oldIndex = -1;

        if (event.data && event.data.id) {
            oldIndex = visibleBoards.findIndex((b) => b.id === event.data.id);
        }
        if (oldIndex === -1 && event.data && event.data.title) {
            oldIndex = visibleBoards.findIndex((b) => b.title === event.data.title);
        }
        if (oldIndex === -1 && event.data && event.data._index !== undefined) {
            const idx = parseIntSafe(event.data._index, -1);
            if (idx >= 0 && idx < visibleBoards.length) oldIndex = idx;
        }

        let newIndex = event.data ? event.data._newIndex : undefined;
        if (newIndex === undefined || newIndex === null || oldIndex < 0) return;
        newIndex = parseIntSafe(newIndex, -1);
        if (newIndex < 0) return;
        if (oldIndex < newIndex) newIndex -= 1;
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= visibleBoards.length) newIndex = visibleBoards.length - 1;
        if (newIndex === oldIndex) return;

        const item = visibleBoards[oldIndex];
        visibleBoards.splice(oldIndex, 1);
        visibleBoards.splice(newIndex, 0, item);

        const allBoards = getSortedBoards();
        const visibleIds = new Set(visibleBoards.map((b) => b.id));
        const hiddenBoards = allBoards.filter((b) => !visibleIds.has(b.id));
        const newOrder = visibleBoards.concat(hiddenBoards).map((b) => b.id);
        saveBoardOrder(newOrder);

        refreshHomeView(viewId, "순서가 저장되었습니다.");
        return;
    }
};

var handleCacheSettingsEvent = (viewId, event) => {
    if (event.eventId !== "SUBMIT") return;
    const button = event.data && event.data.button ? String(event.data.button) : "";
    const parentViewId = event.context ? event.context.parentViewId : null;

    if (button === "저장") {
        const ttlMinutes = parseIntSafe(event.data ? event.data.ttl : "", 0);
        if (!ttlMinutes || ttlMinutes <= 0) {
            synura.update(viewId, { models: { snackbar: "캐시 TTL은 1분 이상이어야 합니다." } });
            return;
        }
        setCacheTTL(ttlMinutes * 60000);
        setShowCacheSnackbar(toBooleanInput(event.data ? event.data.show_snackbar : true, true));
        synura.close(viewId);
        if (parentViewId !== null && parentViewId !== undefined) {
            synura.update(parentViewId, { models: { snackbar: "캐시 설정이 저장되었습니다." } });
        }
        return;
    }

    if (button === "초기화") {
        localStorage.removeItem(CACHE_TTL_KEY);
        localStorage.removeItem(CACHE_SNACKBAR_KEY);
        synura.update(viewId, {
            models: {
                body: getCacheSettingsBody(),
                snackbar: "캐시 설정이 초기화되었습니다."
            }
        });
        if (parentViewId !== null && parentViewId !== undefined) {
            synura.update(parentViewId, { models: { snackbar: "캐시 설정이 초기화되었습니다." } });
        }
        return;
    }

    synura.close(viewId);
};

var handleBoardSettingsEvent = (viewId, event) => {
    if (event.eventId !== "SUBMIT") return;
    const button = event.data && event.data.button ? String(event.data.button) : "";

    if (button === "저장") {
        const newVisible = {};
        const sorted = getSortedBoards();
        for (let i = 0; i < sorted.length; i++) {
            const id = sorted[i].id;
            newVisible[id] = !!(event.data && event.data[id]);
        }
        saveVisibleMap(newVisible);
        synura.close(viewId);

        const parentViewId = event.context ? event.context.parentViewId : null;
        if (parentViewId !== null && parentViewId !== undefined) {
            refreshHomeView(parentViewId, "설정이 저장되었습니다.");
        }
        return;
    }

    if (button === "초기화") {
        localStorage.removeItem(CUSTOM_BOARDS_KEY);
        localStorage.removeItem(VISIBLE_BOARDS_KEY);
        localStorage.removeItem(BOARD_ORDER_KEY);
        synura.update(viewId, {
            models: {
                body: getBoardSettingsBody(),
                snackbar: "설정이 초기화되었습니다."
            }
        });

        const parentViewId = event.context ? event.context.parentViewId : null;
        if (parentViewId !== null && parentViewId !== undefined) {
            refreshHomeView(parentViewId);
        }
        return;
    }

    if (button === "추가") {
        synura.open({
            view: "/dialogs/input",
            styles: {
                title: "게시판 추가",
                message: "게시판 ID와 이름을 입력하세요.",
                close: true
            },
            models: {
                body: [
                    { type: "string", name: "id", label: "ID (예: cm_stock)", value: "" },
                    { type: "string", name: "title", label: "이름 (예: 주식한당)", value: "" }
                ],
                buttons: ["추가", "취소"]
            }
        }, {
            from: "board_add_dialog",
            parentViewId: viewId,
            homeViewId: event.context ? event.context.parentViewId : null
        }, (e) => {
            SYNURA.main.onViewEvent(e.viewId, e);
        });
        return;
    }

    synura.close(viewId);
};

var handleBoardAddEvent = (viewId, event) => {
    if (event.eventId !== "SUBMIT") return;
    const button = event.data && event.data.button ? String(event.data.button) : "";
    if (button !== "추가") {
        synura.close(viewId);
        return;
    }

    const idInput = event.data ? event.data.id : "";
    const titleInput = firstNonEmpty([
        event.data ? event.data.title : "",
        event.data ? event.data.name : ""
    ]);
    const result = addCustomBoard(idInput, titleInput);
    if (!result.ok) {
        synura.update(viewId, { models: { snackbar: result.error } });
        return;
    }

    synura.close(viewId);

    const parentViewId = event.context ? event.context.parentViewId : null;
    if (parentViewId !== null && parentViewId !== undefined) {
        synura.update(parentViewId, {
            models: {
                body: getBoardSettingsBody(),
                snackbar: `게시판이 추가되었습니다: ${result.board.title}`
            }
        });
    }

    const homeViewId = event.context ? event.context.homeViewId : null;
    if (homeViewId !== null && homeViewId !== undefined) {
        refreshHomeView(homeViewId);
    }
};

var handleBoardEvent = (viewId, event) => {
    if (event.eventId === "LOAD" || event.eventId === "REFRESH") {
        try {
            loadBoardPage(viewId, event.context, 0, false);
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
        return;
    }

    if (event.eventId === "SCROLL_TO_END") {
        const params = getParams(viewId);
        const nextPo = params.nextPo;
        if (nextPo === null || nextPo === undefined) {
            synura.update(viewId, {
                models: {
                    append: [],
                    snackbar: "더 불러올 글이 없습니다."
                }
            });
            return;
        }

        try {
            loadBoardPage(viewId, event.context, nextPo, true);
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
        return;
    }

    if (event.eventId === "CLICK") {
        const link = event.data && event.data.link;
        if (!link) return;
        openFromRoute(viewId, link);
        return;
    }

    if (event.eventId === "MENU_CLICK") {
        if (event.data.menu === "브라우저로 보기") {
            const params = getParams(viewId);
            const boardId = event.context.boardId || params.boardId;
            const currentPo = parseIntSafe(params.currentPo, 0);
            openBrowserView(buildBoardUrl(boardId, currentPo), params.boardTitle || event.context.boardTitle || boardId);
            return;
        }
        if (event.data.menu === "새로고침") {
            try {
                loadBoardPage(viewId, event.context, 0, false);
            } catch (e) {
                synura.update(viewId, { models: { snackbar: e.toString() } });
            }
            return;
        }
    }
};

var handlePostEvent = (viewId, event) => {
    if (event.eventId === "LOAD") {
        if (event.context && event.context.anchor) {
            synura.update(viewId, { styles: { anchor: event.context.anchor } });
        }
        return;
    }

    if (event.eventId === "REFRESH") {
        const link = event.context && event.context.link;
        if (!link) return;
        try {
            refreshPost(viewId, link);
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
        return;
    }

    if (event.eventId === "SUBMIT") {
        if (event.data && event.data.button === "새로고침") {
            const link = event.context && event.context.link;
            if (!link) return;
            try {
                refreshPost(viewId, link);
            } catch (e) {
                synura.update(viewId, { models: { snackbar: e.toString() } });
            }
        }
        return;
    }

    if (event.eventId === "MENU_CLICK") {
        if (event.data && event.data.menu === "브라우저로 보기") {
            const link = (event.data && event.data.link) || (event.context && event.context.link);
            if (link) openBrowserView(link, "Clien");
        }
        return;
    }
};

var onViewEvent = (viewId, event) => {
    console.log("Received event:", JSON.stringify(event).replace(/%/g, "%%"));
    const from = event && event.context ? event.context.from : "";
    if (from === "home") {
        handleHomeEvent(viewId, event);
    } else if (from === "cache_settings") {
        handleCacheSettingsEvent(viewId, event);
    } else if (from === "board_settings") {
        handleBoardSettingsEvent(viewId, event);
    } else if (from === "board_add_dialog") {
        handleBoardAddEvent(viewId, event);
    } else if (from === "board") {
        handleBoardEvent(viewId, event);
    } else if (from === "post") {
        handlePostEvent(viewId, event);
    }
};

var handler = {
    home,
    resume,
    onViewEvent,
    deeplink: (url) => {
        const normalized = normalizeUrl(url);
        const split = splitAnchor(normalized);
        const baseUrl = split.baseUrl;

        if (!isHomeUrl(baseUrl) && !parseBoardUrl(baseUrl)) return false;

        let routeData = getCachedRoute(baseUrl);
        if (!routeData) routeData = SYNURA.main.router(normalized);
        if (!routeData) return false;

        const parsed = parseBoardUrl(baseUrl);
        const context = parsed && parsed.postId
            ? { from: "post", link: baseUrl, anchor: split.anchor }
            : (parsed
                ? {
                    from: "board",
                    boardId: parsed.boardId,
                    boardTitle: boardMap.has(parsed.boardId) ? boardMap.get(parsed.boardId).title : parsed.boardId
                }
                : { from: "home" });

        const opened = synura.open(routeData);
        if (!opened.success) return false;

        synura.connect(opened.viewId, context, (event) => {
            SYNURA.main.onViewEvent(event.viewId, event);
        });
        showCacheSnackbar(opened.viewId, routeData);
        return true;
    },

    router: function (url) {
        try {
            const normalized = normalizeUrl(url);
            const split = splitAnchor(normalized);
            const baseUrl = split.baseUrl;
            const anchor = split.anchor;

            const cached = getCachedRoute(baseUrl);
            if (cached) {
                if (!anchor) return cached;
                const cloned = JSON.parse(JSON.stringify(cached));
                cloned.styles = cloned.styles || {};
                cloned.styles.anchor = anchor;
                return cloned;
            }

            let result = null;

            if (isHomeUrl(baseUrl)) {
                const boards = getHomeBoards();
                setBoards(boards);
                result = {
                    view: "/views/list",
                    timestamp: Date.now(),
                    styles: { title: "Clien", reorderable: false },
                    models: {
                        contents: buildHomeContents(boards),
                        menus: getHomeMenus(false)
                    }
                };
            } else {
                const parsed = parseBoardUrl(baseUrl);
                if (!parsed) return null;

                if (parsed.postId) {
                    const postData = fetchPost(baseUrl);
                    result = createPostRouteData(baseUrl, postData, anchor);
                } else {
                    const po = parsePo(baseUrl);
                    const pageData = fetchBoardPage(parsed.boardId, po);
                    result = {
                        view: "/views/list",
                        timestamp: Date.now(),
                        styles: {
                            title: pageData.title,
                            layout: "card",
                            history: true,
                            media: false,
                            pagination: true,
                            hotThreshold: 10000,
                            coldThreshold: 10000
                        },
                        models: {
                            contents: pageData.items,
                            menus: ["브라우저로 보기", "새로고침"]
                        }
                    };
                }
            }

            if (result) {
                setCachedRoute(baseUrl, result);
            }
            return result;
        } catch (e) {
            console.log("router error:", e.toString());
            return null;
        }
    }
};
