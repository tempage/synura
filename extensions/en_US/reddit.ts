// @ts-nocheck
// =============================================================================
// reddit.js - Synura Extension for Reddit
// =============================================================================
//
// Sections:
//   1. Package Definition & Constants
//   2. Subreddit Data
//   3. Sort Options
//   4. Utility Functions
//   5. Core Fetch Functions
//   6. View Openers
//   7. Event Handlers
//   8. Router & Handler Export
//
// =============================================================================

// =============================================================================
// 1. PACKAGE DEFINITION & CONSTANTS
// =============================================================================

var SYNURA = {
    domain: "www.reddit.com",
    name: "reddit",
    author: "Synura Team",
    description: "www.reddit.com",
    version: 0.2,
    api: 0,
    license: "Apache-2.0",
    locale: "en_US",
    bypass: "chrome/android",
    deeplink: true,
    tags:["social","news","images","video"],
    get main() { return handler; }
}
// Keep the extension entry point visible to the host after minification.
globalThis.SYNURA = SYNURA;

// =============================================================================
// 2. SUBREDDIT DATA
// =============================================================================

var subreddits = [
    // General Developer Communities
    { id: "programming", title: "Programming" },
    { id: "coding", title: "Coding" },
    { id: "learnprogramming", title: "Learn Programming" },
    { id: "cscareerquestions", title: "CS Career Questions" },
    { id: "experienceddevs", title: "Experienced Devs" },

    // Web Development
    { id: "webdev", title: "Web Development" },
    { id: "frontend", title: "Frontend" },
    { id: "javascript", title: "JavaScript" },
    { id: "reactjs", title: "React.js" },
    { id: "vuejs", title: "Vue.js" },
    { id: "angular", title: "Angular" },
    { id: "nextjs", title: "Next.js" },
    { id: "node", title: "Node.js" },
    { id: "typescript", title: "TypeScript" },

    // Mobile Development
    { id: "androiddev", title: "Android Dev" },
    { id: "iOSProgramming", title: "iOS Programming" },
    { id: "FlutterDev", title: "Flutter Dev" },
    { id: "reactnative", title: "React Native" },
    { id: "SwiftUI", title: "SwiftUI" },
    { id: "Kotlin", title: "Kotlin" },

    // Backend & Systems
    { id: "golang", title: "Go" },
    { id: "rust", title: "Rust" },
    { id: "python", title: "Python" },
    { id: "java", title: "Java" },
    { id: "csharp", title: "C#" },
    { id: "cpp", title: "C++" },

    // DevOps & Infrastructure
    { id: "devops", title: "DevOps" },
    { id: "docker", title: "Docker" },
    { id: "kubernetes", title: "Kubernetes" },
    { id: "aws", title: "AWS" },
    { id: "googlecloud", title: "Google Cloud" },
    { id: "selfhosted", title: "Self Hosted" },
    { id: "homelab", title: "Homelab" },

    // IT & SysAdmin
    { id: "sysadmin", title: "SysAdmin" },
    { id: "networking", title: "Networking" },
    { id: "netsec", title: "NetSec" },
    { id: "linuxadmin", title: "Linux Admin" },
    { id: "vmware", title: "VMware" },
    { id: "msp", title: "MSP" },
    { id: "WindowsServer", title: "Windows Server" },
    { id: "commandline", title: "Command Line" },
    { id: "technology", title: "Technology" },
    { id: "hardware", title: "Hardware" },
    { id: "techsupport", title: "Tech Support" },

    // AI & Machine Learning
    { id: "MachineLearning", title: "Machine Learning" },
    { id: "artificial", title: "AI" },
    { id: "LocalLLaMA", title: "Local LLaMA" },
    { id: "ChatGPT", title: "ChatGPT" },
    { id: "OpenAI", title: "OpenAI" },

    // Side Projects & Startups
    { id: "SideProject", title: "Side Projects" },
    { id: "startups", title: "Startups" },
    { id: "Entrepreneur", title: "Entrepreneur" },
    { id: "indiehackers", title: "Indie Hackers" },
    { id: "cofounder", title: "Cofounder" },

    // Tools & Productivity
    { id: "vim", title: "Vim" },
    { id: "neovim", title: "Neovim" },
    { id: "vscode", title: "VS Code" },
    { id: "git", title: "Git" },
    { id: "linux", title: "Linux" },

    // Databases
    { id: "PostgreSQL", title: "PostgreSQL" },
    { id: "mongodb", title: "MongoDB" },
    { id: "redis", title: "Redis" },
    { id: "SQL", title: "SQL" },

    // App Discovery
    { id: "androidapps", title: "Android Apps" },
    { id: "iosapps", title: "iOS Apps" },
    { id: "AppHookup", title: "App Hookup" },

    // Hobbies
    { id: "plant", title: "Plant" },
];

var STORAGE_KEY = "visible_subreddits";
var COOKIE_KEY = "reddit_session";
var ORDER_KEY = "subreddit_order";
var CUSTOM_SUBS_KEY = "custom_subreddits";
var SETTINGS_KEY = "global_settings";
var SUBREDDIT_SETTINGS_KEY = "subreddit_settings";
var SORT_KEY = "default_sort";
var TIME_FILTER_KEY = "default_time_filter";

// =============================================================================
// 3. SORT OPTIONS
// =============================================================================

var sortOptions = [
    { id: "hot", label: "Hot", checked: false },
    { id: "new", label: "New", checked: true },
    { id: "top", label: "Top", checked: false },
    { id: "rising", label: "Rising", checked: false },
];

var timeOptions = [
    { id: "hour", label: "Past Hour" },
    { id: "day", label: "Past 24 Hours" },
    { id: "week", label: "Past Week" },
    { id: "month", label: "Past Month" },
    { id: "year", label: "Past Year" },
    { id: "all", label: "All Time" },
];

var defaultVisibleIds = [
    "technology", "programming", "hardware", "sysadmin", "linux",
    "webdev", "networking", "devops", "homelab", "netsec", "plant"
];

// =============================================================================
// 4. CACHE HELPERS
// =============================================================================

var DEFAULT_CACHE_TTL = 600000; // 10 minutes
var CACHE_TTL_KEY = "cache_ttl";
var CACHE_SNACKBAR_KEY = "cache_snackbar";

var setCacheTTL = (ms) => {
    localStorage.setItem(CACHE_TTL_KEY, ms.toString());
};

var getCacheTTL = () => {
    const saved = localStorage.getItem(CACHE_TTL_KEY);
    if (saved) {
        const val = parseInt(saved);
        if (!isNaN(val) && val > 0) return val;
    }
    return DEFAULT_CACHE_TTL;
};

var getShowCacheSnackbar = () => {
    const saved = localStorage.getItem(CACHE_SNACKBAR_KEY);
    if (saved === "false") return false;
    return true;
};

var formatDuration = (ms) => {
    if (ms < 0) ms = 0;
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
};

var showCacheSnackbar = (viewId, routeData) => {
    if (!getShowCacheSnackbar()) return;
    const age = Date.now() - routeData.timestamp;
    const ttl = getCacheTTL();
    const remaining = ttl - age;
    const msg = `Cached ${formatDuration(age)} ago, ${formatDuration(remaining)} remaining.`;
    synura.update(viewId, { models: { snackbar: msg } });
};

var getCachedRoute = (url) => {
    const cached = sessionStorage.getItem(url);
    if (!cached) return null;
    const ttl = getCacheTTL();
    const age = Date.now() - cached.timestamp;
    if (age < ttl) {
        console.log(`Cache HIT (Valid, ${(age / 1000).toFixed(1)}s old)`);
        return cached;
    }
    console.log(`Cache EXPIRED`);
    sessionStorage.removeItem(url);
    return null;
};

var setCachedRoute = (url, routeData) => {
    routeData.timestamp = Date.now();
    sessionStorage.setItem(url, routeData);
};

var createPostRouteData = (link, postData, anchor) => {
    const styles = { ...postData.styles, pagination: true, hotThreshold: 100, coldThreshold: 100, commentHotThreshold: 50, commentColdThreshold: 50, authorClickable: true };
    if (anchor) styles.anchor = anchor;
    return {
        view: '/views/post',
        timestamp: Date.now(),
        styles: styles,
        models: { ...postData.models, link: link, menus: ["Open in Browser"], buttons: ["Refresh"] },
        meta: postData.meta
    };
};

// =============================================================================
// 5. UTILITY FUNCTIONS
// =============================================================================

var getCookie = () => localStorage.getItem(COOKIE_KEY);

var viewState = new Map();

var getParams = (viewId) => {
    const key = String(viewId);
    if (!viewState.has(key)) {
        viewState.set(key, {});
    }
    return viewState.get(key);
}

var setParams = (viewId, params) => {
    const key = String(viewId);
    const current = getParams(key);
    viewState.set(key, { ...current, ...params });
}

var getCustomSubreddits = () => {
    try {
        const stored = localStorage.getItem(CUSTOM_SUBS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

var addCustomSubreddit = (id, title) => {
    const custom = getCustomSubreddits();
    // Check global duplicates
    const all = getAllSubreddits();
    if (all.find(s => s.id === id)) {
        return false;
    }
    custom.push({ id, title });
    localStorage.setItem(CUSTOM_SUBS_KEY, JSON.stringify(custom));
    return true;
};

var removeCustomSubreddit = (id) => {
    let custom = getCustomSubreddits();
    const initialLen = custom.length;
    custom = custom.filter(s => s.id !== id);
    if (custom.length !== initialLen) {
        localStorage.setItem(CUSTOM_SUBS_KEY, JSON.stringify(custom));
        return true;
    }
    return false;
};

var getAllSubreddits = () => {
    return [...subreddits, ...getCustomSubreddits()];
};

var getSortedSubreddits = () => {
    // Merge default and custom logic
    const allSubs = getAllSubreddits();

    let orderStr = localStorage.getItem(ORDER_KEY);
    if (!orderStr) return allSubs;

    try {
        let order = JSON.parse(orderStr);
        let orderMap = {};
        order.forEach((id, index) => orderMap[id] = index);

        return [...allSubs].sort((a, b) => {
            let indexA = orderMap[a.id] !== undefined ? orderMap[a.id] : 9999;
            let indexB = orderMap[b.id] !== undefined ? orderMap[b.id] : 9999;
            return indexA - indexB;
        });
    } catch (e) {
        console.log("Error parsing subreddit order", e);
        return allSubs;
    }
};

var getVisibleSubreddits = () => {
    let visibleStr = localStorage.getItem(STORAGE_KEY);
    let visible = {};
    if (visibleStr) {
        try {
            visible = JSON.parse(visibleStr);
        } catch (e) {
            console.log("Error parsing visible subreddits", e);
        }
    } else {
        subreddits.forEach(s => visible[s.id] = defaultVisibleIds.includes(s.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));
    }

    return getSortedSubreddits().filter(s => visible[s.id] === true || (visible[s.id] === undefined && defaultVisibleIds.includes(s.id)));
};

var getGlobalSettings = () => {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        // Default video_in_list: false, show_media: false
        const defaults = { video_in_list: false, show_media: false };
        return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
    } catch (e) {
        return { video_in_list: false, show_media: false };
    }
};

var getSubredditSettings = (id) => {
    try {
        const stored = localStorage.getItem(SUBREDDIT_SETTINGS_KEY);
        const allSettings = stored ? JSON.parse(stored) : {};

        if (allSettings[id]) {
            return allSettings[id];
        }

        // Default overrides. it's PLANT!
        if (id === 'plant') {
            return { show_media: true };
        }

        return {};
    } catch (e) {
        return {};
    }
};

var setSubredditMedia = (id, enabled) => {
    try {
        const stored = localStorage.getItem(SUBREDDIT_SETTINGS_KEY);
        const allSettings = stored ? JSON.parse(stored) : {};
        if (!allSettings[id]) allSettings[id] = {};
        allSettings[id].show_media = enabled;
        localStorage.setItem(SUBREDDIT_SETTINGS_KEY, JSON.stringify(allSettings));
    } catch (e) { }
};

var setSubredditVideo = (id, enabled) => {
    try {
        const stored = localStorage.getItem(SUBREDDIT_SETTINGS_KEY);
        const allSettings = stored ? JSON.parse(stored) : {};
        if (!allSettings[id]) allSettings[id] = {};
        allSettings[id].video_in_list = enabled;
        localStorage.setItem(SUBREDDIT_SETTINGS_KEY, JSON.stringify(allSettings));
    } catch (e) { }
};

var getGalleryMode = (id) => {
    try {
        const stored = localStorage.getItem(SUBREDDIT_SETTINGS_KEY);
        const allSettings = stored ? JSON.parse(stored) : {};
        return allSettings[id]?.gallery_mode || false;
    } catch (e) {
        return false;
    }
};

var setGalleryMode = (id, enabled) => {
    try {
        const stored = localStorage.getItem(SUBREDDIT_SETTINGS_KEY);
        const allSettings = stored ? JSON.parse(stored) : {};
        if (!allSettings[id]) allSettings[id] = {};
        allSettings[id].gallery_mode = enabled;
        localStorage.setItem(SUBREDDIT_SETTINGS_KEY, JSON.stringify(allSettings));
    } catch (e) { }
};

var getDefaultSort = () => {
    const saved = localStorage.getItem(SORT_KEY);
    return saved || "hot";
};

var getTimeFilter = () => {
    const saved = localStorage.getItem(TIME_FILTER_KEY);
    return saved || "all";
};

var formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
};

var formatNumber = (num) => {
    if (!num) return '';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

var showSnackbar = (viewId, message) => {
    synura.update(viewId, { models: { snackbar: message } });
};

var getSortMenuItems = (currentSort, currentTimeFilter) => {
    const menus = sortOptions.map(opt => ({
        label: opt.label,
        checked: opt.id === currentSort
    }));

    if (currentSort === 'top') {
        const tf = currentTimeFilter || 'all'; // Default to All Time for Top
        timeOptions.forEach(opt => {
            menus.push({
                label: opt.label,
                checked: opt.id === tf
            });
        });
    }
    return menus;
};

var normalizeRedditUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) return 'https://www.reddit.com' + url;
    return /^https?:\/\//i.test(url) ? url : '';
};

var redditRequestUrl = (url) => {
    const normalized = normalizeRedditUrl(String(url || '')).replace(
        /^https?:\/\/(?:www\.|old\.|new\.)?reddit\.com(?=\/|$)/i, 'https://www.reddit.com'
    ).split('#')[0];
    if (!/^https:\/\/www\.reddit\.com\//.test(normalized)) {
        throw new Error('Invalid Reddit request URL');
    }
    return normalized;
};

var formatIsoTimeAgo = (value) => {
    const ms = Date.parse((value || '').replace(/([+-]\d{2})(\d{2})$/, '$1:$2'));
    return isNaN(ms) ? '' : formatTimeAgo(Math.floor(ms / 1000));
};

var nodeText = (node, selector) => {
    const found = node ? node.querySelector(selector) : null;
    return found ? found.textContent.trim() : '';
};

var nodeAttr = (node, selector, attr) => {
    const found = node ? node.querySelector(selector) : null;
    return found ? (found.getAttribute(attr) || '').trim() : '';
};

// Anonymous cookies stay in memory and do not change the Login/Logout setting.
var redditSession = { login: null, cookies: [] };

var redditCookies = (url) => {
    const login = getCookie() || '';
    if (login !== redditSession.login) {
        redditSession = { login, cookies: [] };
        login.split(';').forEach(pair => {
            const separator = pair.indexOf('=');
            if (separator > 0) redditSession.cookies.push({
                name: pair.slice(0, separator).trim(), value: pair.slice(separator + 1).trim(), path: '/', expires: 0
            });
        });
    }
    const path = url.replace('https://www.reddit.com', '').split('?')[0];
    redditSession.cookies = redditSession.cookies.filter(cookie => !cookie.expires || cookie.expires > Date.now());
    return redditSession.cookies.filter(cookie => path === cookie.path ||
        (path.startsWith(cookie.path) && (cookie.path.endsWith('/') || path[cookie.path.length] === '/')))
        .map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
};

var saveRedditCookies = (response, url) => {
    const headers = response.headers || {};
    const values = typeof headers.getAll === 'function' ? headers.getAll('set-cookie') :
        String(headers['set-cookie'] || headers['Set-Cookie'] || '').split('\n');
    const path = url.replace('https://www.reddit.com', '').split('?')[0];
    for (const value of values) {
        const parts = value.split(';');
        const pair = parts.shift();
        const separator = pair.indexOf('=');
        if (separator <= 0) continue;
        const cookie = {
            name: pair.slice(0, separator).trim(), value: pair.slice(separator + 1).trim(),
            path: path.slice(0, path.lastIndexOf('/')) || '/', expires: 0
        };
        let validDomain = true, maxAge = null;
        for (const part of parts) {
            const index = part.indexOf('=');
            const key = (index < 0 ? part : part.slice(0, index)).trim().toLowerCase();
            const value = index < 0 ? '' : part.slice(index + 1).trim();
            if (key === 'domain') validDomain = /^(?:www\.)?reddit\.com$/i.test(value.replace(/^\./, ''));
            if (key === 'path' && value.startsWith('/')) cookie.path = value;
            if (key === 'expires') cookie.expires = Date.parse(value) || 0;
            if (key === 'max-age' && /^-?\d+$/.test(value)) maxAge = Number(value);
        }
        if (!validDomain) continue;
        if (maxAge !== null) cookie.expires = Date.now() + maxAge * 1000;
        redditSession.cookies = redditSession.cookies.filter(old => old.name !== cookie.name || old.path !== cookie.path);
        if (!cookie.expires || cookie.expires > Date.now()) redditSession.cookies.push(cookie);
    }
};

var redditFetchOptions = (url) => {
    const headers = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
    };
    const cookie = redditCookies(url);
    if (cookie) headers['Cookie'] = cookie;
    return { headers };
};

var redditFetchDocument = (rawUrl) => {
    const url = redditRequestUrl(rawUrl);
    let requestUrl = url;
    for (let attempt = 0; attempt < 2; attempt++) {
        const options = redditFetchOptions(requestUrl);
        if (attempt) options.headers['Referer'] = url;
        const response = fetch(requestUrl, options);
        saveRedditCookies(response, requestUrl);
        if (!response.ok) {
            if (response.status === 429) throw new Error('Reddit is rate limiting requests. Please try again later.');
            if (response.status === 403) throw new Error('Reddit blocked this request. Please try again later or open it in a browser.');
            // Transport errors can contain the challenge URL; do not expose its tokens.
            throw new Error(response.status ? `Reddit HTTP ${response.status}` : 'Unable to connect to Reddit');
        }
        // Streamed page fragments (including comments) arrive in inert templates.
        // Expose their markup to the static parser without running page scripts.
        const html = response.text().replace(/<(\/?)template\b/gi, '<$1div');
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const challenge = doc.querySelector('input[name="js_challenge"]');
        if (!challenge) return doc;
        if (attempt) throw new Error('Reddit browser verification did not complete. Please try again later.');

        // Handle only the observed nonce-doubling form, never execute page scripts.
        const scripts = Array.from(doc.querySelectorAll('script')).map(node => node.textContent).join('\n');
        const nonce = scripts.match(/await\s*\(\s*async\s+([A-Za-z_$][\w$]*)\s*=>\s*\1\s*\+\s*\1\s*\)\s*\(\s*["']([a-f0-9]{8,128})["']\s*\)/i);
        const form = doc.querySelector('form');
        if (!form || !nonce || (form.getAttribute('method') || 'get').toLowerCase() !== 'get') {
            throw new Error('Reddit requires unsupported browser verification. Please open it in a browser.');
        }
        const action = redditRequestUrl(form.getAttribute('action') || url.split('?')[0]);
        if (action.split('?')[0] !== url.split('?')[0]) throw new Error('Unexpected Reddit verification destination');
        const params = new URLSearchParams(action.split('?')[1] || '');
        for (const input of Array.from(form.querySelectorAll('input'))) {
            const name = input.getAttribute('name');
            if (name) params.set(name, name === 'solution' ? nonce[2] + nonce[2] : input.getAttribute('value') || '');
        }
        if (!params.has('solution')) throw new Error('Invalid Reddit verification form');
        for (const [name, value] of new URLSearchParams(url.split('?')[1] || '')) {
            if (!params.has(name)) params.append(name, value);
        }
        requestUrl = action.split('?')[0] + '?' + params.toString();
    }
};

var buildRedditListingUrl = (subredditId, sort, timeFilter, query, after) => {
    if (after) {
        const url = redditRequestUrl(after);
        if (!/^https:\/\/www\.reddit\.com\/svc\/shreddit\/(?:community-more-posts\/|(?:r\/[^/?]+\/)?search\/)/.test(url)) {
            throw new Error('Invalid Reddit next page');
        }
        return url;
    }
    const base = `https://www.reddit.com/r/${encodeURIComponent(subredditId)}/`;
    if (query) {
        const searchSort = ['new', 'top', 'comments', 'relevance'].includes(sort) ? sort : 'relevance';
        return `${base}search/?q=${encodeURIComponent(query)}&restrict_sr=on&sort=${searchSort}&t=${encodeURIComponent(timeFilter || 'all')}`;
    }
    const selected = sortOptions.some(option => option.id === sort) ? sort : 'hot';
    return base + selected + '/' + (selected === 'top' ? `?t=${encodeURIComponent(timeFilter || 'all')}` : '');
};

var redditNextPage = (doc, url, search) => {
    for (const partial of Array.from(doc.querySelectorAll('faceplate-partial[src]'))) {
        const src = partial.getAttribute('src') || '';
        const path = src.replace(/^https:\/\/www\.reddit\.com/, '');
        const expected = search ? /^\/svc\/shreddit\/(?:r\/[^/?]+\/)?search\// : /^\/svc\/shreddit\/community-more-posts\//;
        if (!expected.test(path)) continue;
        const next = redditRequestUrl(src);
        if (next !== url) return next;
    }
    return null;
};

// Helper: Build subreddit list items from visible subreddits
var buildSubredditListItems = () => {
    return getVisibleSubreddits().map(sub => ({
        title: sub.title,
        id: sub.id
    }));
};

// Helper: Build settings body for subreddit visibility checkboxes
var buildSubredditSettingsBody = () => {
    const visible = {};
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
        Object.assign(visible, parsed);
    } catch (e) { }

    return getAllSubreddits().map(s => ({
        type: 'boolean',
        name: s.id,
        label: s.title,
        value: visible[s.id] === true || (visible[s.id] === undefined && defaultVisibleIds.includes(s.id))
    }));
};

// Helper: Get show_media value from subreddit and global settings
var getShowMedia = (subredditId) => {
    const globalSettings = getGlobalSettings();
    const subSettings = getSubredditSettings(subredditId);
    return subSettings.show_media !== undefined ? subSettings.show_media : globalSettings.show_media;
};

// Helper: Build menus for subreddit list view
var buildSubredditMenus = (sort, timeFilter, showMedia, galleryMode) => {
    const menus = getSortMenuItems(sort, timeFilter);
    menus.push({
        label: "Display Media",
        checked: showMedia
    });
    menus.push({
        label: "Gallery Mode",
        checked: galleryMode
    });
    menus.push("Search");
    return menus;
};

// =============================================================================
// 5. CORE FETCH FUNCTIONS
// =============================================================================

var redditMedia = (post) => {
    const container = post.querySelector('[slot="post-media-container"]');
    const images = [];
    if (container) {
        const gallery = container.querySelector('gallery-carousel');
        const primary = Array.from(container.querySelectorAll('img[data-post-media-primary]'));
        const candidates = gallery ? Array.from(gallery.querySelectorAll('li[slot]')).map(page => page.querySelector('img:not([role="presentation"])')).filter(Boolean) :
            primary.length ? primary : Array.from(container.querySelectorAll('img'));
        for (const image of candidates) {
            if (image.getAttribute('role') === 'presentation') continue;
            const src = normalizeRedditUrl(image.getAttribute('src') || image.getAttribute('data-lazy-src') || '');
            if (src && !images.includes(src)) images.push(src);
        }
    }
    const player = post.querySelector('shreddit-player') || post.querySelector('shreddit-player-2') || post.querySelector('video');
    let video = player ? normalizeRedditUrl(player.getAttribute('src') || nodeAttr(player, 'source', 'src')) : '';
    const poster = player ? normalizeRedditUrl(player.getAttribute('poster') || '') : '';
    const external = normalizeRedditUrl(post.getAttribute('content-href') || '');
    if (!video && /(?:youtube\.com|youtu\.be|\.mp4)(\/|\?|$)/i.test(external)) video = external;
    return { images, video, poster };
};

var redditCard = (post, videoInList) => {
    const link = normalizeRedditUrl(post.getAttribute('permalink') || nodeAttr(post, '[slot="title"]', 'href'));
    const external = normalizeRedditUrl(post.getAttribute('content-href') || '');
    const media = redditMedia(post);
    if (!media.images.length && /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(external)) media.images.push(external);
    const type = post.getAttribute('post-type') || '';
    const isVideo = !!media.video || type === 'video';
    const score = parseInt(post.getAttribute('score') || '0', 10) || 0;
    const types = [];
    if (type === 'link') types.push('link');
    if (media.images.length) types.push('image');
    if (isVideo) types.push('video');
    return {
        link, title: post.getAttribute('post-title') || nodeText(post, '[slot="title"]'), types,
        author: post.getAttribute('author') || '[deleted]', avatar: normalizeRedditUrl(post.getAttribute('icon') || ''),
        mediaUrl: videoInList && media.video ? media.video : media.images[0] || media.poster,
        mediaType: videoInList && media.video ? 'video' : media.images.length || media.poster ? 'image' : 'none',
        thumbnail: media.images[0] || media.poster, date: formatIsoTimeAgo(post.getAttribute('created-timestamp')),
        likeCount: formatNumber(score), dislikeCount: '',
        commentCount: formatNumber(parseInt(post.getAttribute('comment-count') || '0', 10)),
        viewCount: '', menus: [], hotCount: score, coldCount: score, _name: post.getAttribute('id') || link
    };
};

var redditSearchCard = (node) => {
    let context = {};
    try { context = JSON.parse(node.getAttribute('data-faceplate-tracking-context') || '{}'); } catch (e) { }
    const link = normalizeRedditUrl(nodeAttr(node, '[data-testid="post-title"]', 'href'));
    const counter = node.querySelector('[data-testid="search-counter-row"]');
    const numbers = counter ? Array.from(counter.querySelectorAll('faceplate-number')).map(n => parseInt(n.getAttribute('number') || '0', 10)) : [];
    const image = normalizeRedditUrl(nodeAttr(node, '[data-testid="search_post_thumbnail"]', 'src'));
    return {
        link, title: nodeText(node, '[data-testid="post-title-text"]') || context.post?.title || nodeAttr(node, '[data-testid="post-title"]', 'aria-label'),
        author: context.profile?.name || '', avatar: '', types: image ? ['image'] : [],
        mediaUrl: image, mediaType: image ? 'image' : 'none', thumbnail: image,
        date: formatIsoTimeAgo(nodeAttr(node, 'faceplate-timeago', 'ts')),
        likeCount: formatNumber(numbers[0]), commentCount: formatNumber(numbers[1]), dislikeCount: '', viewCount: '',
        menus: [], hotCount: numbers[0] || 0, coldCount: numbers[0] || 0, _name: context.post?.id || link
    };
};

var fetchSubredditPosts = (subredditId, sort, after, timeFilter, query, videoInList) => {
    const url = buildRedditListingUrl(subredditId, sort, timeFilter, query, after);
    const doc = redditFetchDocument(url);
    const search = !!query;
    const nodes = Array.from(doc.querySelectorAll(search ? '[data-testid="search-sdui-post"]' : 'shreddit-post'));
    const seen = new Set();
    const items = nodes.filter(node => !node.hasAttribute('promoted')).map(node => search ? redditSearchCard(node) : redditCard(node, videoInList))
        .filter(item => {
            if (!item.title || !item.link || seen.has(item._name)) return false;
            seen.add(item._name);
            return true;
        });
    if (!items.length && !after && !doc.querySelector(search ? 'search-dynamic-id-cache-controller' : 'shreddit-feed')) {
        throw new Error('Reddit did not return a readable listing. The community may be unavailable.');
    }
    return { items, after: redditNextPage(doc, url, search) };
};

var redditContent = (node) => {
    if (!node) return [];
    try {
        const parsed = synura.parse('post', node);
        if (parsed && parsed.length) return parsed;
    } catch (e) { }
    const text = node.textContent.trim();
    return text ? [{ type: 'text', value: text }] : [];
};

var redditImageHeaders = (content, referer) => {
    const seen = new Set();
    return content.filter(item => {
        if (item.type !== 'image') return true;
        const image = normalizeRedditUrl(item.value || item.link || '');
        // Reddit includes both visible images and identical fallback markup.
        if (seen.has(image)) return false;
        seen.add(image);
        const match = normalizeRedditUrl(item.value || item.link || '').match(/^https?:\/\/([^/?#]+)/i);
        if (!match || !/(^|\.)(redd\.it|redditmedia\.com|redditstatic\.com|reddit\.com)$/i.test(match[1])) return true;
        const headers = { ...(item.headers || {}) };
        if (!Object.keys(headers).some(name => name.toLowerCase() === 'referer')) headers.Referer = referer;
        item.headers = headers;
        return true;
    });
};

var parseRedditComments = (doc, refererUrl) => {
    return Array.from(doc.querySelectorAll('shreddit-comment')).map(comment => {
        const id = comment.getAttribute('thingid') || '';
        const body = /^[a-z0-9_]+$/i.test(id) ? comment.querySelector(`#${id}-comment-rtjson-content`) : null;
        const content = redditContent(body);
        const score = parseInt(comment.getAttribute('score') || '0', 10) || 0;
        return {
            id, author: comment.getAttribute('author') || '[deleted]', avatar: normalizeRedditUrl(comment.getAttribute('avatar') || ''),
            content: redditImageHeaders(content.length ? content : [{ type: 'text', value: '[removed]' }], refererUrl),
            date: formatIsoTimeAgo(comment.getAttribute('created')), likeCount: formatNumber(score), dislikeCount: '',
            level: Math.max(0, parseInt(comment.getAttribute('depth') || '0', 10) || 0),
            menus: ['Reply', 'Report'], hotCount: score, coldCount: score
        };
    });
};

var extractRedditPostInfo = (url, postElement) => {
    let subreddit = '';
    let postId = '';
    if (postElement) {
        const fullId = postElement.getAttribute('id') || postElement.getAttribute('thingid') || '';
        if (fullId) postId = fullId.startsWith('t3_') ? fullId : `t3_${fullId}`;
        const sub = postElement.getAttribute('subreddit-prefixed-name') || postElement.getAttribute('subreddit-name') || '';
        if (sub) subreddit = sub.replace(/^r\//i, '');
    }
    if (!postId || !subreddit) {
        const match = String(url || '').match(/reddit\.com\/r\/([^/?#]+)\/comments\/([a-z0-9]+)/i);
        if (match) {
            if (!subreddit) subreddit = match[1];
            if (!postId) postId = `t3_${match[2]}`;
        }
    }
    return { subreddit, postId };
};

var initPostCommentsMeta = (url, subreddit, postId, initialComments) => {
    const seenCommentIds = initialComments.map(c => c.id).filter(Boolean);
    return {
        url,
        subreddit,
        postId,
        sortQueue: ['top', 'new', 'old'],
        afterQueue: [...seenCommentIds],
        afterIndex: 0,
        seenCommentIds,
        allComments: [...initialComments],
        loadingComments: false
    };
};

var fetchNextCommentsBatch = (params) => {
    const { url, subreddit, postId, sortQueue, afterQueue, afterIndex, seenCommentIds, allComments } = params;
    const seen = new Set(seenCommentIds || []);
    const newItems = [];
    const updatedSortQueue = sortQueue ? [...sortQueue] : [];
    const updatedAfterQueue = afterQueue ? [...afterQueue] : [];
    let updatedAfterIndex = typeof afterIndex === 'number' ? afterIndex : 0;

    // Phase 1: Alternate sort passes (top, new, old)
    while (updatedSortQueue.length > 0 && newItems.length === 0) {
        const nextSort = updatedSortQueue.shift();
        try {
            const separator = url.includes('?') ? '&' : '?';
            const sortUrl = `${url}${separator}sort=${encodeURIComponent(nextSort)}`;
            const doc = redditFetchDocument(sortUrl);
            const batch = parseRedditComments(doc, url);
            for (const c of batch) {
                if (c.id && !seen.has(c.id)) {
                    seen.add(c.id);
                    newItems.push(c);
                    updatedAfterQueue.push(c.id);
                }
            }
        } catch (e) {
            console.log(`Failed to fetch alternate sort comments (${nextSort}):`, e);
        }
    }

    // Phase 2: Expand nested comments using after={commentId}
    if (newItems.length === 0 && subreddit && postId) {
        let attempts = 0;
        while (updatedAfterIndex < updatedAfterQueue.length && newItems.length === 0 && attempts < 5) {
            const cId = updatedAfterQueue[updatedAfterIndex++];
            attempts++;
            try {
                const afterUrl = `https://www.reddit.com/svc/shreddit/comments/r/${encodeURIComponent(subreddit)}/${encodeURIComponent(postId)}?render-mode=partial&after=${encodeURIComponent(cId)}&sort=confidence`;
                const doc = redditFetchDocument(afterUrl);
                const batch = parseRedditComments(doc, url);
                for (const c of batch) {
                    if (c.id && !seen.has(c.id)) {
                        seen.add(c.id);
                        newItems.push(c);
                        updatedAfterQueue.push(c.id);
                    }
                }
            } catch (e) {
                console.log(`Failed to fetch nested comments after ${cId}:`, e);
            }
        }
    }

    const updatedAllComments = (allComments || []).concat(newItems);
    return {
        newItems,
        updatedParams: {
            ...params,
            sortQueue: updatedSortQueue,
            afterQueue: updatedAfterQueue,
            afterIndex: updatedAfterIndex,
            seenCommentIds: Array.from(seen),
            allComments: updatedAllComments,
            loadingComments: false
        }
    };
};

var fetchPost = (permalink) => {
    const url = redditRequestUrl(permalink);
    const doc = redditFetchDocument(url);
    const post = doc.querySelector('shreddit-post');
    if (!post) throw new Error('Reddit did not return this post. It may be private, removed, or unavailable.');
    const card = redditCard(post, false);
    const body = post.querySelector('[property="schema:articleBody"]') || post.querySelector('[slot="text-body"]');
    const content = redditContent(body);
    const media = redditMedia(post);
    const external = normalizeRedditUrl(post.getAttribute('content-href') || '');
    const originalImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(external);
    const images = originalImage ? [external] : media.video && post.getAttribute('post-type') === 'video' ? [] : media.images;
    for (const image of images) if (!content.some(item => item.value === image)) content.push({ type: 'image', value: image });
    if (media.video) content.push({ type: 'video', value: media.video, poster: media.poster });
    if (external && external !== card.link && !external.includes('/comments/') && !media.video && !images.includes(external)) {
        content.push({ type: 'link', value: external, link: external });
    }
    if (!content.length) content.push({ type: 'text', value: '(No text content)' });
    const comments = parseRedditComments(doc, url);
    const { subreddit, postId } = extractRedditPostInfo(url, post);

    return {
        styles: { title: card.title, pagination: true },
        models: { author: card.author, avatar: card.avatar, date: card.date, likeCount: card.likeCount,
            dislikeCount: '', viewCount: '', content: redditImageHeaders(content, url), comments },
        meta: initPostCommentsMeta(url, subreddit, postId, comments)
    };
};

// =============================================================================
// 6. VIEW OPENERS
// =============================================================================

var openPost = (parentViewId, link) => {
    try {
        console.log("Opening post view for link:", link);

        const postViewResult = synura.open({
            view: '/views/post',
            styles: {
                title: "Loading...",
                authorClickable: true,
                hotThreshold: 100,
                coldThreshold: 100,
                commentHotThreshold: 50,
                commentColdThreshold: 50
            },
            models: {
                link: link,
                author: "",
                date: "",
                avatar: "",
                content: [{ type: 'text', value: 'Loading content...' }],
                comments: [],
                menus: ["Open in Browser"],
                buttons: ["Refresh"]
            }
        }, { from: "post", link: link }, (event) => {
            SYNURA.main.onViewEvent(event.viewId, event)
        });

        if (postViewResult.success) {
            console.log("✅ Successfully opened post view. View ID:", postViewResult.viewId);
            const viewId = postViewResult.viewId;

            try {
                const postData = fetchPost(link);
                if (postData) {
                    if (postData.meta) {
                        setParams(viewId, { ...postData.meta });
                    }
                    synura.update(viewId, postData);
                    // Update Cache
                    setCachedRoute(link, createPostRouteData(link, postData));
                } else {
                    synura.update(viewId, { models: { snackbar: "Failed to load data" } });
                }
            } catch (fetchError) {
                console.log("❌ Failed to fetch/update post:", fetchError);
                synura.update(viewId, { models: { snackbar: "Error loading: " + fetchError.toString() } });
            }
        } else {
            console.log("❌ Failed to open post view:", postViewResult.error);
            if (parentViewId) {
                synura.update(parentViewId, { models: { snackbar: postViewResult.error } });
            }
        }
    } catch (e) {
        console.log("❌ Failed to open post view:", e);
        if (parentViewId) {
            synura.update(parentViewId, { models: { snackbar: e.toString() } });
        }
    }
}

var resume = (viewId, context) => {
    console.log("resume " + viewId + " " + JSON.stringify(context));
    const connectResult = synura.connect(viewId, context, (event) => {
        SYNURA.main.onViewEvent(viewId, event)
    });
    if (connectResult.success) {
        console.log("✅ Successfully connected to the restored view.");
    } else {
        console.log("❌ Failed to connect to the restored view:", connectResult.error);
    }
}

var home = () => {
    console.log("Starting Reddit extension...");

    try {
        const initialItems = buildSubredditListItems();

        const loginMenu = getCookie() ? "Logout" : "Login";

        const result = synura.open({
            view: '/views/list',
            styles: {
                title: "Reddit",
            },
            models: {
                contents: initialItems,
                menus: ["Go", "Subreddits", "Settings", "Reorder", "CLI", loginMenu],
            }
        }, { from: "home" }, (event) => {
            SYNURA.main.onViewEvent(event.viewId, event)
        });

        if (result.success) {
            console.log("✅ Successfully opened home view with ID:", result.viewId);
        } else {
            console.log("❌ Failed to open home view:", result.error);
        }
    } catch (e) {
        console.log("Error during home flow:", e);
        return "Home flow failed: " + e.toString();
    }
};

// =============================================================================
// 7. EVENT HANDLERS
// =============================================================================

var handleLoginEvent = (viewId, event) => {
    if (event.data && event.data.cookies) {
        localStorage.setItem(COOKIE_KEY, event.data.cookies);
        console.log("Cookies captured and saved.");

        // Notify user and close
        // Since we can't easily update the *parent* view from here without a reload,
        // we'll just close this view. The user will see the change on next reload or we can trigger a reload if we had the parent ID.
        // Assuming the parent view (home) might need to be manually refreshed or we can try to update it if we pass parentViewId.

        synura.close(viewId);
        if (event.context.parentViewId) {
            synura.update(event.context.parentViewId, { models: { snackbar: "Login Successful" } });
            // Reload home view content to update menu
            const initialItems = buildSubredditListItems();
            const loginMenu = "Logout";
            synura.update(event.context.parentViewId, {
                models: {
                    contents: initialItems,
                    menus: ["Subreddits", "Settings", "Reorder", "CLI", loginMenu],
                }
            });
        }
    }
};

var handleHomeEvent = (viewId, event) => {
    if (event.eventId === "CLICK") {
        const visibleSubs = getVisibleSubreddits();
        let sub;

        if (event.data.id) {
            sub = visibleSubs.find(s => s.id === event.data.id);
        }

        if (!sub && event.data._index >= 0 && event.data._index < visibleSubs.length) {
            sub = visibleSubs[event.data._index];
        }

        if (sub) {
            console.log(`Subreddit clicked: ${sub.title}, opening list view...`);
            const defaultSort = getDefaultSort();
            const showMedia = getShowMedia(sub.id);
            const galleryMode = getGalleryMode(sub.id);

            // Default time filter to saved value if top sort is active
            const timeFilter = defaultSort === 'top' ? getTimeFilter() : null;
            const menus = buildSubredditMenus(defaultSort, timeFilter, showMedia, galleryMode);

            const result = synura.open({
                view: '/views/list',
                styles: {
                    title: `r/${sub.id}`,
                    layout: galleryMode ? 'gallery' : 'card',
                    columnCount: galleryMode ? 3 : undefined,
                    hotThreshold: 1000,
                    coldThreshold: 1000,
                    history: true,
                    media: showMedia,
                    pagination: true,
                },
                models: {
                    menus: menus
                }
            }, { from: "subreddit", subredditId: sub.id, sort: defaultSort, timeFilter: timeFilter }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event)
            });

            if (result.success) {
                console.log("✅ Successfully opened subreddit view. View ID:", result.viewId);
                // setParams(result.viewId, { sort: defaultSort, after: null });
            } else {
                console.log("❌ Failed to open subreddit view:", result.error);
                showSnackbar(viewId, result.error);
            }
        }
    } else if (event.eventId === "MENU_CLICK") {
        if (event.data.menu === "Go") {
            synura.open({
                view: '/dialogs/input',
                styles: { title: 'Go to Subreddit', message: 'Enter subreddit name (e.g. funny)', close: true },
                models: {
                    body: [
                        { type: 'string', name: 'subreddit', label: 'Subreddit', value: '' }
                    ],
                    buttons: ['Go']
                }
            }, { from: 'go_subreddit', parentViewId: viewId }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
        } else if (event.data.menu === "Login") {
            synura.open({
                view: '/views/browser',
                styles: { title: 'Login to Reddit' },
                models: { url: 'https://www.reddit.com/login' }
            }, { from: 'login', parentViewId: viewId }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
        } else if (event.data.menu === "Logout") {
            localStorage.removeItem(COOKIE_KEY);
            synura.update(viewId, { models: { snackbar: "Logged out" } });

            // Refresh menu
            const initialItems = buildSubredditListItems();
            const loginMenu = "Login";
            synura.update(viewId, {
                models: {
                    contents: initialItems,
                    menus: ["Go", "Subreddits", "Settings", "Reorder", "CLI", loginMenu],
                }
            });
        } else if (event.data.menu === "Subreddits") {
            // Open subreddit settings
            const body = buildSubredditSettingsBody();

            synura.open({
                view: '/views/settings',
                styles: { title: 'Subreddit Settings' },
                models: {
                    body: body,
                    buttons: ['Save', 'Reset', 'Add', 'Remove', 'Cancel']
                }
            }, { from: 'subreddit_settings', parentViewId: viewId }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
        } else if (event.data.menu === "Settings") {
            const currentTTL = getCacheTTL() / 60000;
            const showSnackbar = getShowCacheSnackbar();
            const globalSettings = getGlobalSettings();
            const showMedia = globalSettings.show_media;
            const videoInList = globalSettings.video_in_list;

            synura.open({
                view: '/dialogs/input',
                styles: { title: 'Global Settings', message: 'Configure application settings.', close: true },
                models: {
                    body: [
                        { type: 'number', name: 'ttl', label: 'Cache TTL (min)', value: currentTTL },
                        { type: 'boolean', name: 'show_snackbar', label: 'Show Cache Notification', value: showSnackbar },
                        { type: 'boolean', name: 'show_media', label: 'Display Media in List', value: showMedia },
                        { type: 'boolean', name: 'video_in_list', label: 'Play Videos in List', value: videoInList }
                    ],
                    buttons: ['Save', 'Clear Cache']
                }
            }, { from: 'global_settings', parentViewId: viewId }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
        } else if (event.data.menu === "CLI") {
            openCLI(viewId);
        } else if (event.data.menu === "Reorder") {
            const params = getParams(viewId);
            const isReorderable = !params.isReorderable;
            setParams(viewId, { isReorderable });

            synura.update(viewId, {
                styles: {
                    reorderable: isReorderable
                },
                models: {
                    menus: ["Subreddits", "Settings", { label: "Reorder", checked: isReorderable }, "CLI"],
                    snackbar: isReorderable ? "Reordering enabled" : "Reordering disabled"
                }
            });
            return;
        }

    } else if (event.eventId === "REORDER") {
        console.log("Reordering...", JSON.stringify(event.data));

        let visibleSubs = getVisibleSubreddits();
        let oldIndex = -1;

        // Try finding by ID first
        if (event.data.id) {
            oldIndex = visibleSubs.findIndex(s => s.id === event.data.id);
        }

        // Fallback to title/name matching if ID not provided
        if (oldIndex === -1 && event.data.title) {
            oldIndex = visibleSubs.findIndex(s => s.title === event.data.title);
        }

        let newIndex = event.data._newIndex;

        if (oldIndex >= 0 && newIndex !== undefined) {
            // Adjust index if moving down, standard Flutter ReorderableList behavior
            if (oldIndex < newIndex) {
                newIndex -= 1;
            }

            const item = visibleSubs[oldIndex];
            visibleSubs.splice(oldIndex, 1);
            visibleSubs.splice(newIndex, 0, item);

            // Construct new global order
            const allSubs = getSortedSubreddits();
            const visibleIds = new Set(visibleSubs.map(s => s.id));
            const hiddenSubs = allSubs.filter(s => !visibleIds.has(s.id));

            // Visible subs first, then hidden subs (preserving their relative order)
            const newOrder = [...visibleSubs, ...hiddenSubs].map(s => s.id);
            localStorage.setItem(ORDER_KEY, JSON.stringify(newOrder));

            synura.update(viewId, {
                models: {
                    snackbar: "Order saved"
                }
            });
        }
    }
};

var handleSubredditEvent = (viewId, event) => {
    const videoInList = getGlobalSettings().video_in_list;

    if (event.eventId === "LOAD" || event.eventId === "REFRESH") {
        console.log(`Received ${event.eventId} event. Fetching posts...`);
        const params = getParams(viewId);

        const sort = params.sort || event.context.sort || "new";
        // Default to saved value for top sort if not specified
        const timeFilter = params.timeFilter !== undefined ? params.timeFilter : event.context.timeFilter || (sort === 'top' ? getTimeFilter() : null);
        const query = params.searchQuery || null;

        // Save back to params so it persists
        setParams(viewId, { sort, timeFilter, after: null });

        try {
            console.log(`[DEBUG] Calling fetchSubredditPosts for ${event.context.subredditId}, sort: ${sort}, time: ${timeFilter}, query: ${query}`);
            const result = fetchSubredditPosts(event.context.subredditId, sort, null, timeFilter, query, videoInList);
            console.log(`[DEBUG] fetchSubredditPosts returned items: ${result.items.length}, after: ${result.after}`);

            setParams(viewId, { after: result.after, seenPostLinks: result.items.map(item => item.link) });

            synura.update(viewId, {
                models: {
                    contents: result.items
                }
            });
            console.log("✅ Successfully loaded posts.");
        } catch (e) {
            console.log("❌ Failed to fetch posts:", e);
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
    } else if (event.eventId === "SCROLL_TO_END") {
        console.log("Loading more posts...");
        const params = getParams(viewId);
        console.log(`[DEBUG] SCROLL_TO_END viewId: ${viewId}, params:`, JSON.stringify(params));

        const sort = params.sort || event.context.sort || "new";
        const timeFilter = params.timeFilter !== undefined ? params.timeFilter : event.context.timeFilter;
        const query = params.searchQuery || null;
        const after = params.after;

        if (!after) {
            console.log("No more posts to load.");
            synura.update(viewId, {
                models: {
                    append: [], // stop loading more
                    snackbar: "No more posts to load"
                }
            });
            return;
        }

        try {
            const result = fetchSubredditPosts(event.context.subredditId, sort, after, timeFilter, query, videoInList);
            const seen = new Set(params.seenPostLinks || []);
            const items = result.items.filter(item => !seen.has(item.link));
            items.forEach(item => seen.add(item.link));
            setParams(viewId, { after: result.after, seenPostLinks: Array.from(seen) });

            synura.update(viewId, {
                models: {
                    append: items
                }
            });
            console.log("✅ Successfully appended posts.");
        } catch (e) {
            console.log("❌ Failed to fetch more posts:", e);
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
    } else if (event.eventId === "CLICK") {
        console.log("Post clicked, opening post view...");
        const clickedCard = event.data;
        const link = clickedCard.link;

        // Check Cache first
        const routeData = getCachedRoute(link);
        if (routeData) {
            // Cache Hit - Open Immediately
            const result = synura.open(routeData);
            if (result.success) {
                console.log("✅ Opened post view (via cache). View ID:", result.viewId);
                if (routeData.meta) {
                    setParams(result.viewId, { ...routeData.meta });
                }
                synura.connect(result.viewId, { from: "post", link: link }, (event) => {
                    SYNURA.main.onViewEvent(event.viewId, event);
                });
                showCacheSnackbar(result.viewId, routeData);
            } else {
                synura.update(viewId, { models: { snackbar: result.error } });
            }
        } else {
            // Cache Miss - Optimistic Open
            console.log("Cache MISS - Opening view optimistically...");
            openPost(viewId, link);
        }
    } else if (event.eventId === "MENU_CLICK") {
        const menu = event.data.menu;

        if (event.data.menu === "Open in Browser") {
            const link = event.data.link || event.context.link;
            synura.open({
                view: '/views/browser',
                styles: { title: 'Reddit' },
                models: { url: link }
            });
        } else if (event.data.menu === "Search") {
            synura.update(viewId, {
                styles: {
                    appbar: {
                        type: "query",
                        label: "Search r/" + event.context.subredditId,
                        hint: "Enter search term"
                    }
                }
            });
        } else if (event.data.menu.includes("Display Media")) {
            // Toggle Media
            const subId = event.context.subredditId;
            const current = getShowMedia(subId);
            const newState = !current;
            const galleryMode = getGalleryMode(subId);

            setSubredditMedia(subId, newState);

            // Update View
            const params = getParams(viewId);
            const sort = params.sort || event.context.sort || "new";
            const timeFilter = params.timeFilter !== undefined ? params.timeFilter : event.context.timeFilter;
            const menus = buildSubredditMenus(sort, timeFilter, newState, galleryMode);

            synura.update(viewId, {
                styles: { media: newState },
                models: { menus: menus, snackbar: newState ? "Media Enabled" : "Media Disabled" }
            });
        } else if (event.data.menu.includes("Gallery Mode")) {
            // Toggle Gallery Mode
            const subId = event.context.subredditId;
            const current = getGalleryMode(subId);
            const newState = !current;
            const showMedia = getShowMedia(subId);

            setGalleryMode(subId, newState);

            // Update View
            const params = getParams(viewId);
            const sort = params.sort || event.context.sort || "new";
            const timeFilter = params.timeFilter !== undefined ? params.timeFilter : event.context.timeFilter;
            const menus = buildSubredditMenus(sort, timeFilter, showMedia, newState);

            synura.update(viewId, {
                styles: {
                    layout: newState ? 'gallery' : 'card',
                    columnCount: newState ? 3 : undefined
                },
                models: { menus: menus, snackbar: newState ? "Gallery Mode Enabled" : "Gallery Mode Disabled" }
            });
        } else {
            // Check if it's a sort option
            const sortOpt = sortOptions.find(opt => opt.label === menu);
            if (sortOpt) {
                console.log(`Sort changed to: ${sortOpt.id}`);
                const timeFilter = sortOpt.id === 'top' ? getTimeFilter() : null;
                setParams(viewId, { sort: sortOpt.id, timeFilter: timeFilter, after: null });
                localStorage.setItem(SORT_KEY, sortOpt.id);

                updateMenuAndReload(viewId, event.context.subredditId, sortOpt.id, timeFilter);
                return;
            }

            // Check if it's a time filter option
            const timeOpt = timeOptions.find(opt => opt.label === menu);
            if (timeOpt) {
                console.log(`Time filter changed to: ${timeOpt.id}`);
                setParams(viewId, { sort: 'top', timeFilter: timeOpt.id, after: null });
                localStorage.setItem(TIME_FILTER_KEY, timeOpt.id);

                updateMenuAndReload(viewId, event.context.subredditId, 'top', timeOpt.id);
                return;
            }
        }
    } else if (event.eventId === "QUERY") {
        const query = event.data.query;
        console.log("Query event:", query);
        setParams(viewId, { after: null, searchQuery: query });

        try {
            const params = getParams(viewId);
            const result = fetchSubredditPosts(event.context.subredditId, params.sort || event.context.sort, null, params.timeFilter, query, videoInList);
            setParams(viewId, { after: result.after, seenPostLinks: result.items.map(item => item.link) });
            synura.update(viewId, {
                models: {
                    contents: result.items
                }
            });
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
    }
};

// Helper to avoid duplication in MENU_CLICK
var updateMenuAndReload = (viewId, subredditId, sort, timeFilter) => {
    // Update menu
    const showMedia = getShowMedia(subredditId);
    const galleryMode = getGalleryMode(subredditId);
    const videoInList = getGlobalSettings().video_in_list;
    const newMenus = buildSubredditMenus(sort, timeFilter, showMedia, galleryMode);

    synura.update(viewId, {
        models: {
            menus: newMenus,
            snackbar: `Sorting by ${sort} ${timeFilter ? '(' + timeFilter + ')' : ''}`
        }
    });

    // Reload
    try {
        const result = fetchSubredditPosts(subredditId, sort, null, timeFilter, getParams(viewId).searchQuery, videoInList);
        setParams(viewId, { after: result.after, seenPostLinks: result.items.map(item => item.link) });

        synura.update(viewId, {
            models: {
                contents: result.items
            }
        });
    } catch (e) {
        synura.update(viewId, { models: { snackbar: e.toString() } });
    }
};

var handlePostEvent = (viewId, event) => {
    if (event.eventId === "LOAD") {
        // Handle anchor scroll for restored/cached posts
        if (event.context && event.context.anchor) {
            synura.update(viewId, { styles: { anchor: event.context.anchor } });
        }
    } else if (event.eventId === "SCROLL_TO_END") {
        console.log("Received SCROLL_TO_END for post view. Fetching next comments... ViewId:", viewId);
        const params = getParams(viewId);
        if (params.loadingComments) {
            console.log("Already loading comments, ignoring.");
            return;
        }

        let subreddit = params.subreddit;
        let postId = params.postId;
        let url = params.url || event.context.link || (event.data && event.data.link);

        if (!subreddit || !postId) {
            if (url) {
                const info = extractRedditPostInfo(url, null);
                subreddit = subreddit || info.subreddit;
                postId = postId || info.postId;
            }
        }

        if (!params.allComments) {
            params.allComments = [];
        }
        if (!params.sortQueue) {
            params.sortQueue = ['top', 'new', 'old'];
        }
        if (!params.afterQueue) {
            params.afterQueue = params.allComments.map(c => c.id).filter(Boolean);
            params.afterIndex = 0;
        }
        if (!params.seenCommentIds) {
            params.seenCommentIds = params.allComments.map(c => c.id).filter(Boolean);
        }
        params.url = url;
        params.subreddit = subreddit;
        params.postId = postId;

        const hasMore = (params.sortQueue && params.sortQueue.length > 0) ||
                        (params.afterQueue && params.afterIndex < params.afterQueue.length);
        if (!hasMore) {
            console.log("No more comments to fetch for post.");
            synura.update(viewId, { models: { snackbar: "No more comments to load" } });
            return;
        }

        setParams(viewId, { loadingComments: true });

        try {
            const { newItems, updatedParams } = fetchNextCommentsBatch(params);
            setParams(viewId, updatedParams);

            if (newItems.length === 0) {
                console.log("No additional comments found.");
                synura.update(viewId, { models: { snackbar: "No more comments to load" } });
            } else {
                synura.update(viewId, {
                    models: {
                        comments: updatedParams.allComments
                    }
                });
                console.log(`✅ Loaded ${newItems.length} more comments (total: ${updatedParams.allComments.length}).`);
            }
        } catch (e) {
            console.log("❌ Error fetching more comments:", e);
            setParams(viewId, { loadingComments: false });
            synura.update(viewId, { models: { snackbar: "Failed to load more comments: " + e.toString() } });
        }
    } else if (event.eventId === "REFRESH") {
        const link = event.context.link;
        console.log("Refreshing post:", link);
        try {
            const postData = fetchPost(link);
            if (postData.meta) {
                setParams(viewId, { ...postData.meta });
            }
            synura.update(viewId, {
                ...postData,
                models: { ...postData.models, snackbar: "Refreshed" }
            });
            // Update Cache
            setCachedRoute(link, createPostRouteData(link, postData));
        } catch (e) {
            console.log("❌ Failed to refresh post:", e);
            showSnackbar(viewId, e.toString());
        }
    } else if (event.eventId === "MENU_CLICK") {
        if (event.data.menu === "Open in Browser") {
            const link = event.data.link || event.context.link;
            synura.open({
                view: '/views/browser',
                styles: { title: 'Reddit' },
                models: { url: link }
            });
        }
    } else if (event.eventId === "SUBMIT") {
        if (event.data.button === "Refresh") {
            const link = event.context.link;
            try {
                const postData = fetchPost(link);
                if (postData.meta) {
                    setParams(viewId, { ...postData.meta });
                }
                synura.update(viewId, {
                    ...postData,
                    models: { ...postData.models, snackbar: "Refreshed" }
                });
                setCachedRoute(link, createPostRouteData(link, postData));
            } catch (e) {
                showSnackbar(viewId, e.toString());
            }
        }
    } else if (event.eventId === "ITEM_MENU_CLICK") {
        if (event.data.menu === "Reply") {
            const result = synura.open({
                view: '/dialogs/input',
                styles: { title: 'Not Implemented', message: 'Enter your reply below.', close: true },
                models: {
                    body: [
                        { type: 'string', name: 'reply', label: 'Reply', lines: 5 }
                    ],
                    buttons: ['Submit']
                }
            }, { from: 'comment_reply', parentViewId: viewId }, (dialogEvent) => {
                if (dialogEvent.eventId === "SUBMIT") {
                    if (dialogEvent.data.button === "Submit") {
                        synura.close(result.viewId);
                        showSnackbar(viewId, "Reply submitted (Simulated): " + dialogEvent.data.reply);
                    }
                }
            });
        } else if (event.data.menu === "Report") {
            synura.open({
                view: '/dialogs/confirmation',
                styles: { title: 'Not Implemented', message: 'Are you sure you want to report this comment?', close: true },
                models: {
                    buttons: ['Yes', 'No']
                }
            });
        }
    }
};

var handleSubredditSettingsEvent = (viewId, event) => {
    if (event.eventId === 'SUBMIT') {
        if (event.data.button === 'Save') {
            const newVisible = {};
            getAllSubreddits().forEach(s => {
                newVisible[s.id] = event.data[s.id] === true;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisible));

            showSnackbar(viewId, "Settings saved!");
            synura.close(viewId);

            if (event.context.parentViewId) {
                synura.update(event.context.parentViewId, {
                    models: {
                        contents: buildSubredditListItems()
                    }
                });
            }
        } else if (event.data.button === 'Reset') {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(ORDER_KEY);
            localStorage.removeItem(CUSTOM_SUBS_KEY);
            showSnackbar(viewId, "Settings reset to defaults.");
            synura.close(viewId);

            if (event.context.parentViewId) {
                synura.update(event.context.parentViewId, {
                    models: {
                        contents: buildSubredditListItems()
                    }
                });
            }
        } else if (event.data.button === 'Add') {
            synura.open({
                view: '/dialogs/input',
                styles: { title: 'Add Subreddit', message: 'Enter Subreddit ID (e.g. funny) and Title.', close: true },
                models: {
                    body: [
                        { type: 'string', name: 'id', label: 'ID (e.g. funny)', value: '' },
                        { type: 'string', name: 'title', label: 'Title (e.g. Funny)', value: '' }
                    ],
                    buttons: ['Add', 'Cancel']
                }
            }, { from: 'subreddit_add_dialog', parentViewId: viewId }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
        } else if (event.data.button === 'Remove') {
            const customSubs = getCustomSubreddits();
            if (customSubs.length === 0) {
                showSnackbar(viewId, "No custom subreddits to remove.");
                return;
            }

            const body = customSubs.map(s => ({
                type: 'boolean',
                name: s.id,
                label: s.title,
                value: true
            }));

            synura.open({
                view: '/views/settings',
                styles: { title: 'Remove Subreddits', message: 'Uncheck to remove. Checked items will be kept.' },
                models: {
                    body: body,
                    buttons: ['Confirm', 'Cancel']
                }
            }, { from: 'subreddit_delete_settings', parentViewId: viewId }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
        } else {
            synura.close(viewId);
        }
    }
};

var handleSubredditAddEvent = (viewId, event) => {
    if (event.eventId === 'SUBMIT') {
        if (event.data.button === 'Add') {
            const id = event.data.id ? event.data.id.trim() : '';
            let title = event.data.title ? event.data.title.trim() : '';

            if (id) {
                if (!title) title = id;
                if (addCustomSubreddit(id, title)) {
                    let visible = {};
                    try {
                        visible = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
                    } catch (e) { }
                    visible[id] = true;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));

                    showSnackbar(viewId, "Subreddit added!");
                    synura.close(viewId);

                    if (event.context.parentViewId) {
                        synura.update(event.context.parentViewId, {
                            models: { body: buildSubredditSettingsBody() }
                        });
                    }
                } else {
                    showSnackbar(viewId, "Subreddit ID already exists.");
                }
            } else {
                showSnackbar(viewId, "Please enter an ID.");
            }
        } else {
            synura.close(viewId);
        }
    }
};
var handleSubredditDeleteEvent = (viewId, event) => {
    if (event.eventId === 'SUBMIT') {
        if (event.data.button === 'Confirm') {
            const customSubs = getCustomSubreddits();
            let count = 0;
            customSubs.forEach(s => {
                if (event.data[s.id] === false) {
                    if (removeCustomSubreddit(s.id)) {
                        count++;
                        // Also remove from visibility map to be clean
                        let visible = {};
                        try {
                            visible = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
                            delete visible[s.id];
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));
                        } catch (e) { }
                    }
                }
            });
            showSnackbar(viewId, `${count} subreddits removed.`);
            synura.close(viewId);

            if (event.context.parentViewId) {
                synura.update(event.context.parentViewId, {
                    models: { body: buildSubredditSettingsBody() }
                });
            }
        } else {
            synura.close(viewId);
        }
    }
};

// =============================================================================
// CLI IMPLEMENTATION
// =============================================================================

var handleCLIEvent = (viewId, event) => {
    if (event.eventId === "MENU_CLICK") {
        if (event.data.menu === "Exit") {
            synura.close(viewId);
        } else if (event.data.menu === "Help") {
            cliMessage(viewId, getCLIHelp());
        }
        return;
    }

    // Handle link clicks from markdown messages
    if (event.eventId === "CLICK" && event.data.link) {
        const link = event.data.link;
        if (link.startsWith("synura://action?")) {
            const params = new URLSearchParams(link.substring("synura://action?".length));
            const cmd = params.get("cmd");
            if (cmd === "showHtml") {
                const key = params.get("key");
                const cached = sessionStorage.getItem(key);
                if (cached && cached.html) {
                    synura.open({
                        view: '/views/source',
                        styles: { title: cached.url || 'HTML Source', language: 'html', lineNumbers: true, wordWrap: false },
                        models: { content: cached.html }
                    });
                } else {
                    cliMessage(viewId, "❌ HTML content not found. It may have expired from cache.");
                }
            }
        }
        return;
    }

    if (event.eventId !== "SUBMIT" || !event.data || !event.data.message) {
        return;
    }

    const input = event.data.message.trim();

    if (input === "/q") { synura.close(viewId); return; }
    if (input === "/help") { cliMessage(viewId, getCLIHelp()); return; }
    if (input === "/info") { cliMessage(viewId, getCLIInfo()); return; }

    // Cookie commands
    if (input === "/cookie") {
        const cookie = getCookie();
        if (cookie) {
            const display = cookie.length > 50 ? cookie.substring(0, 50) + "..." : cookie;
            cliMessage(viewId, `🍪 Current Cookie:\n${display}`);
        } else {
            cliMessage(viewId, "❌ No cookie set");
        }
        return;
    }

    if (input.startsWith("/cookie set ")) {
        const value = input.substring(12).trim();
        const cleanValue = value.replace(/^["']|["']$/g, '');
        if (cleanValue) {
            localStorage.setItem(COOKIE_KEY, cleanValue);
            cliMessage(viewId, "✅ Cookie saved successfully");
        } else {
            cliMessage(viewId, "❌ Error: Please provide a cookie value\nUsage: /cookie set \"your_cookie_value\"");
        }
        return;
    }

    if (input === "/cookie clear") {
        localStorage.removeItem(COOKIE_KEY);
        cliMessage(viewId, "✅ Cookie cleared");
        return;
    }

    // Subreddit commands
    if (input === "/sub list") {
        const allSubs = getSortedSubreddits();
        const visible = {};
        try { Object.assign(visible, JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}); } catch (e) { }
        const customSubs = getCustomSubreddits();
        const customIds = new Set(customSubs.map(s => s.id));

        let msg = "📋 Subreddits:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        allSubs.forEach(s => {
            const status = visible[s.id] === true || (visible[s.id] === undefined && defaultVisibleIds.includes(s.id)) ? "👁️" : "🚫";
            const customTag = customIds.has(s.id) ? " [custom]" : "";
            msg += `${status} ${s.id}: ${s.title}${customTag}\n`;
        });
        cliMessage(viewId, msg);
        return;
    }

    if (input.startsWith("/sub add ")) {
        const args = input.substring(9).trim();
        const match = args.match(/["']([^"']+)["']\s+["']([^"']+)["']/);
        if (match) {
            const subId = match[1].trim();
            const subTitle = match[2].trim();
            if (addCustomSubreddit(subId, subTitle)) {
                cliMessage(viewId, `✅ Subreddit added: ${subId} (${subTitle})`);
            } else {
                cliMessage(viewId, `❌ Error: Subreddit "${match[1]}" already exists`);
            }
        } else {
            cliMessage(viewId, "❌ Error: Invalid format\nUsage: /sub add \"id\" \"title\"");
        }
        return;
    }

    if (input.startsWith("/sub del ")) {
        const id = input.substring(9).trim().replace(/^["']|["']$/g, '');
        if (removeCustomSubreddit(id)) {
            cliMessage(viewId, `✅ Subreddit removed: ${id}`);
        } else {
            cliMessage(viewId, `❌ Error: Cannot remove "${id}" (not a custom subreddit)`);
        }
        return;
    }

    if (input.startsWith("/sub show ")) {
        const id = input.substring(10).trim().replace(/^["']|["']$/g, '');
        let visible = {};
        try { visible = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { }
        visible[id] = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));
        cliMessage(viewId, `✅ Subreddit "${id}" is now visible`);
        return;
    }

    if (input.startsWith("/sub hide ")) {
        const id = input.substring(10).trim().replace(/^["']|["']$/g, '');
        let visible = {};
        try { visible = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { }
        visible[id] = false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));
        cliMessage(viewId, `✅ Subreddit "${id}" is now hidden`);
        return;
    }

    // Cache commands
    if (input === "/cache") {
        const ttl = getCacheTTL() / 60000;
        const showSb = getShowCacheSnackbar();
        cliMessage(viewId, `⚙️ Cache Settings:\n• TTL: ${ttl} minutes\n• Snackbar: ${showSb ? "On" : "Off"}`);
        return;
    }

    if (input.startsWith("/cache set ")) {
        const value = parseInt(input.substring(11).trim());
        if (!isNaN(value) && value > 0) {
            setCacheTTL(value * 60000);
            cliMessage(viewId, `✅ Cache TTL set to ${value} minutes`);
        } else {
            cliMessage(viewId, "❌ Error: Invalid value\nUsage: /cache set <minutes>");
        }
        return;
    }

    if (input === "/cache clear") {
        sessionStorage.clear();
        cliMessage(viewId, "✅ Cache cleared");
        return;
    }

    // Fetch command
    if (input.startsWith("/fetch ")) {
        let url = input.substring(7).trim();
        if (!url) { cliMessage(viewId, "❌ Error: Please provide a URL"); return; }
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = `https://${url}`;

        try {
            const response = fetch(url);
            const htmlContent = response.text();
            const viewKey = `__cli_fetch_${Date.now()}`;
            sessionStorage.setItem(viewKey, { html: htmlContent, url: url });

            const msg = `🌐 Fetch Result\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📍 **URL:** ${url.length > 50 ? url.substring(0, 50) + '...' : url}\n📊 **Status:** ${response.status} ${response.statusText || 'OK'}\n📦 **Size:** ${htmlContent.length.toLocaleString()} bytes\n\n[📄 Show HTML](synura://action?cmd=showHtml&key=${viewKey})`;
            cliMessage(viewId, msg);
        } catch (e) {
            cliMessage(viewId, `❌ Fetch failed: ${e.toString()}`);
        }
        return;
    }

    if (input.startsWith("/")) {
        cliMessage(viewId, `❌ Unknown command: ${input}\nType /help for available commands`);
    } else {
        cliMessage(viewId, `💬 Echo: ${input}\n\n(Commands start with /)`);
    }
};

var openCLI = (parentViewId) => {
    synura.open({
        view: '/views/chat',
        styles: { title: 'Reddit CLI', menu: true },
        models: {
            menus: ["Help", "Exit"],
            append: [{ user: "System", message: getCLIWelcome(), format: "markdown" }]
        }
    }, { from: "cli", parentViewId: parentViewId }, (event) => {
        SYNURA.main.onViewEvent(event.viewId, event);
    });
};

var getCLIWelcome = () => {
    const visibleSubs = getVisibleSubreddits();
    const customSubs = getCustomSubreddits();
    const cacheTTL = getCacheTTL() / 60000;
    return `🔧 Reddit CLI\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📋 Current Configuration:\n• Visible Subreddits: ${visibleSubs.length}\n• Custom Subreddits: ${customSubs.length}\n• Cache TTL: ${cacheTTL} min\n• Default Sort: ${getDefaultSort()}\n\nType /help to see all commands`;
};

var cliMessage = (viewId, message) => {
    synura.update(viewId, { models: { append: [{ user: "System", message: message, format: "markdown" }] } });
};

var getCLIHelp = () => {
    return `📖 Available Commands:

🍪 Cookie Management
  /cookie              Show current cookie
  /cookie set "..."    Set cookie value
  /cookie clear        Clear stored cookie

📋 Subreddit Management
  /sub list            List all subreddits
  /sub add "id" "title"  Add new subreddit
  /sub del "id"        Remove a subreddit
  /sub show "id"       Show a subreddit
  /sub hide "id"       Hide a subreddit

⚙️ Cache Settings
  /cache               Show cache TTL
  /cache set <min>     Set TTL in minutes
  /cache clear         Clear all cache

🌐 Network
  /fetch <url>         Fetch URL and show summary

ℹ️ Information
  /info                Show all settings
  /help                Show this help
  /q                   Exit CLI`;
};

var getCLIInfo = () => {
    const visibleSubs = getVisibleSubreddits();
    return `ℹ️ Current Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Subreddits:
• Total: ${subreddits.length}
• Visible: ${visibleSubs.length}
• Hidden: ${subreddits.length - visibleSubs.length}

⚙️ Sort: ${getDefaultSort()}`;
};

var handleGoSubredditEvent = (viewId, event) => {
    if (event.eventId === 'SUBMIT') {
        if (event.data.button === 'Go') {
            const subreddit = event.data.subreddit ? event.data.subreddit.trim() : '';
            if (subreddit) {
                synura.close(viewId);

                // Open the subreddit directly
                const defaultSort = getDefaultSort();
                const showMedia = getShowMedia(subreddit);
                const galleryMode = getGalleryMode(subreddit);
                const timeFilter = defaultSort === 'top' ? getTimeFilter() : null;
                const menus = buildSubredditMenus(defaultSort, timeFilter, showMedia, galleryMode);

                const result = synura.open({
                    view: '/views/list',
                    styles: {
                        title: `r/${subreddit}`,
                        layout: galleryMode ? 'gallery' : 'card',
                        columnCount: galleryMode ? 3 : undefined,
                        hotThreshold: 1000,
                        coldThreshold: 1000,
                        history: true,
                        media: showMedia,
                        pagination: true,
                    },
                    models: {
                        menus: menus
                    }
                }, { from: "subreddit", subredditId: subreddit, sort: defaultSort, timeFilter: timeFilter }, (event) => {
                    SYNURA.main.onViewEvent(event.viewId, event);
                });

                if (!result.success) {
                    console.log("❌ Failed to open subreddit view:", result.error);
                }
            } else {
                showSnackbar(viewId, "Please enter a subreddit name.");
            }
        } else {
            synura.close(viewId);
        }
    }
};

var handleGlobalSettingsEvent = (viewId, event) => {
    if (event.eventId === 'SUBMIT') {
        if (event.data.button === 'Save') {
            // Save Cache Settings
            const ttlMinutes = parseInt(event.data.ttl);
            if (!isNaN(ttlMinutes) && ttlMinutes > 0) {
                const ttlMs = ttlMinutes * 60000;
                localStorage.setItem(CACHE_TTL_KEY, ttlMs.toString());
            }
            localStorage.setItem(CACHE_SNACKBAR_KEY, event.data.show_snackbar.toString());

            // Save Global Media Settings
            const settings = {
                ...getGlobalSettings(),
                show_media: event.data.show_media,
                video_in_list: event.data.video_in_list
            };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

            showSnackbar(viewId, "Settings saved!");
            synura.close(viewId);
        } else if (event.data.button === 'Clear Cache') {
            sessionStorage.clear();
            showSnackbar(viewId, "Cache cleared.");
            synura.close(viewId);
        } else {
            synura.close(viewId);
        }
    }
};

var onViewEvent = (viewId, event) => {
    console.log("Received event:", JSON.stringify(event));

    if (event.context.from === "home") {
        handleHomeEvent(viewId, event);
    } else if (event.context.from === "subreddit") {
        handleSubredditEvent(viewId, event);
    } else if (event.context.from === "post") {
        handlePostEvent(viewId, event);
    } else if (event.context.from === "subreddit_settings") {
        handleSubredditSettingsEvent(viewId, event);
    } else if (event.context.from === "global_settings") {
        handleGlobalSettingsEvent(viewId, event);
    } else if (event.context.from === "subreddit_add_dialog") {
        handleSubredditAddEvent(viewId, event);
    } else if (event.context.from === "subreddit_delete_settings") {
        handleSubredditDeleteEvent(viewId, event);
    } else if (event.context.from === "cli") {
        handleCLIEvent(viewId, event);
    } else if (event.context.from === "login") {
        handleLoginEvent(viewId, event);
    } else if (event.context.from === "go_subreddit") {
        handleGoSubredditEvent(viewId, event);
    }
};

// =============================================================================
// 8. ROUTER & HANDLER EXPORT
// =============================================================================

var router = (url) => {
    console.log("Router called with URL:", url);

    try {
        // Parse anchor from URL if present
        let anchor = null;
        if (url.includes('#')) {
            const hashIndex = url.indexOf('#');
            anchor = url.substring(hashIndex + 1);
            url = url.substring(0, hashIndex);
        }

        // Check cache first
        const cached = getCachedRoute(url);
        if (cached) {
            console.log("Router returning cached result");
            if (anchor) {
                const result = JSON.parse(JSON.stringify(cached));
                result.styles = result.styles || {};
                result.styles.anchor = anchor;
                return result;
            }
            return cached;
        }

        // Match Reddit post URLs
        const postMatch = url.match(/reddit\.com\/r\/([^\/]+)\/comments\/([^\/]+)/);
        if (postMatch) {
            const postData = fetchPost(url);
            const result = createPostRouteData(url, postData, anchor);
            setCachedRoute(url, result);
            return result;
        }

        // Match Reddit gallery URLs
        const galleryMatch = url.match(/reddit\.com\/gallery\/([a-zA-Z0-9]+)/);
        if (galleryMatch) {
            const galleryId = galleryMatch[1];
            const commentsUrl = `https://www.reddit.com/comments/${galleryId}`;
            const postData = fetchPost(commentsUrl);
            const result = createPostRouteData(url, postData, anchor);
            setCachedRoute(url, result);
            return result;
        }

        // Match subreddit list URLs
        // Allow optional / and query params
        const subMatch = url.match(/reddit\.com\/r\/([^\/]+)(\/|\?|$)/);
        if (subMatch) {
            const subId = subMatch[1];

            // Extract query parameters
            let query = null;
            let sort = getDefaultSort();
            let timeFilter = null;

            if (url.includes('?')) {
                const queryString = url.substring(url.indexOf('?') + 1);
                const params = new URLSearchParams(queryString);
                if (params.has('q')) query = params.get('q');
                if (params.has('sort')) sort = params.get('sort');
                if (params.has('t')) timeFilter = params.get('t');
            }

            if (!timeFilter && sort === 'top') {
                timeFilter = getTimeFilter();
            }

            const showMedia = getShowMedia(subId);
            const galleryMode = getGalleryMode(subId);
            const videoInList = getGlobalSettings().video_in_list;

            const posts = fetchSubredditPosts(subId, sort, null, timeFilter, query, videoInList);

            const title = query ? `r/${subId} - Search` : `r/${subId}`;
            const appbar = query ? { type: "query", label: title, hint: query } : null;

            const result = {
                view: '/views/list',
                timestamp: Date.now(),
                styles: {
                    title: title,
                    layout: galleryMode ? 'gallery' : 'card',
                    columnCount: galleryMode ? 3 : undefined,
                    hotThreshold: 1000,
                    coldThreshold: 1000,
                    history: true,
                    media: showMedia,
                    pagination: true,
                    appbar: appbar
                },
                models: {
                    contents: posts.items,
                    menus: buildSubredditMenus(sort, timeFilter, showMedia, galleryMode)
                }
            };

            setCachedRoute(url, result);
            return result;
        }

        return null;
    } catch (e) {
        console.log("Router error:", e);
        return null;
    }
};

var subredditMap = new Map();
subreddits.forEach(s => subredditMap.set(s.id, s));

var handler = {
    home: home,
    resume: resume,
    router: router,
    onViewEvent: onViewEvent,
    showBoardSettings: () => { },

    deeplink: (url) => {
        console.log("Deep link called with url:", url);
        const prefix = "https://www.reddit.com/";
        if (!url.startsWith(prefix)) return false;

        const part = url.substring(prefix.length);

        // Check if it's a post or subreddit URL
        if ((part.startsWith("r/") && part.includes("/comments/")) || part.startsWith("gallery/")) {
            console.log("Handling deep link for post/gallery...");

            let routeData = getCachedRoute(url);
            if (!routeData) {
                routeData = SYNURA.main.router(url);
                if (routeData) setCachedRoute(url, routeData);
            }

            if (routeData) {
                const v = synura.open(routeData);
                if (v.success) {
                    if (routeData.meta) {
                        setParams(v.viewId, { ...routeData.meta });
                    }
                    synura.connect(v.viewId, { from: "post", link: url }, (event) => {
                        SYNURA.main.onViewEvent(event.viewId, event);
                    });
                    showCacheSnackbar(v.viewId, routeData);
                }
            }
            return true;
        }

        return false;
    }
};
