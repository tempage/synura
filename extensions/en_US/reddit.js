// =============================================================================
// test_reddit.js - Synura Extension for Reddit
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
    name: "test_reddit",
    author: "Synura Team",
    description: "Unofficial example extension for educational purposes.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    deeplink: true,
    tags: ["social", "news", "images", "video", "community"],
    get main() { return handler; }
}

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
    const styles = { ...postData.styles, hotThreshold: 100, coldThreshold: 100, commentHotThreshold: 50, commentColdThreshold: 50, authorClickable: true };
    if (anchor) styles.anchor = anchor;
    return {
        view: '/views/post',
        timestamp: Date.now(),
        styles: styles,
        models: { ...postData.models, link: link, menus: ["Open in Browser"], buttons: ["Refresh"] }
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

var unescapeHtml = (html) => {
    if (!html) return '';
    return html.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
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

var fetchSubredditPosts = (subredditId, sort, after, timeFilter, query, videoInList) => {
    let url;
    if (query) {
        url = `https://www.reddit.com/r/${subredditId}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&limit=25&raw_json=1`;
        if (sort) url += `&sort=${sort}`;
        if (timeFilter) url += `&t=${timeFilter}`;
    } else {
        url = `https://www.reddit.com/r/${subredditId}/${sort}.json?limit=25&raw_json=1`;
        if (sort === "top" && timeFilter) {
            url += `&t=${timeFilter}`;
        }
    }

    if (after) {
        url += `&after=${after}`;
    }

    console.log("Fetching:", url);

    const headers = {
        "User-Agent": "Synura/1.0"
    };
    const cookie = getCookie();
    if (cookie) {
        headers["Cookie"] = cookie;
    }

    const response = fetch(url, {
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = response.json();
    if (!json.data) {
        console.log("[DEBUG] Unexpected JSON structure:", JSON.stringify(json).substring(0, 200));
        throw new Error("Invalid response from Reddit");
    }
    const posts = json.data.children;
    const nextAfter = json.data.after;

    const cardItems = posts.map(post => {
        const data = post.data;

        // Determine media type and URL
        let mediaUrl = '';
        let mediaType = 'none';
        let types = [];

        // Check for images
        if (data.post_hint === 'image' || (data.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(data.url))) {
            mediaUrl = data.url;
            mediaType = 'image';
            types.push('image');
        } else if (data.preview && data.preview.images && data.preview.images[0]) {
            // Use preview images for better quality (Reddit provides multiple resolutions)
            // Pick a medium resolution (~320-640px) for list thumbnails
            const resolutions = data.preview.images[0].resolutions || [];
            const source = data.preview.images[0].source;
            // Find the smallest resolution >= 320px wide, or use source if none
            let bestPreview = resolutions.find(r => r.width >= 320) || source;
            if (bestPreview && bestPreview.url) {
                mediaUrl = bestPreview.url.replace(/&amp;/g, '&');
                mediaType = 'image';
            }
        } else if (data.thumbnail && data.thumbnail !== 'self' && data.thumbnail !== 'default' && data.thumbnail !== 'nsfw' && data.thumbnail.startsWith('http')) {
            // Fallback to thumbnail only if no preview available
            mediaUrl = data.thumbnail;
            mediaType = 'image';
        }

        // Check for video
        // We only support reddit-hosted videos here. External videos (rich:video) like YouTube
        // are treated as links/images to avoid creating heavyweight video players for thumbnails,
        // saving resources and preventing playback errors.
        if ((data.is_video || data.post_hint === 'hosted:video' || data.post_hint === 'rich:video') && data.media && data.media.reddit_video) {
            types.push('video');
            if (videoInList) {
                mediaType = 'video';
                mediaUrl = data.media.reddit_video.fallback_url;
            } else {
                // Treat as image if video_in_list is false
                mediaType = 'image';
                // Try to find a good preview image
                if (data.preview && data.preview.images && data.preview.images[0] && data.preview.images[0].source) {
                    mediaUrl = data.preview.images[0].source.url.replace(/&amp;/g, '&');
                } else if (data.thumbnail && data.thumbnail.startsWith('http')) {
                    mediaUrl = data.thumbnail;
                }
            }
        }

        // Check for link
        if (data.post_hint === 'link' || (data.url && !data.is_self && !types.includes('image') && !types.includes('video'))) {
            types.push('link');
        }

        // Check for hot posts
        if (data.score > 1000) {
            types.push('hot');
        }

        return {
            link: `https://www.reddit.com${data.permalink}`,
            title: data.title,
            types: types,
            author: data.author,
            avatar: '',
            mediaUrl: mediaUrl,
            mediaType: mediaType,
            thumbnail: (data.thumbnail && data.thumbnail.startsWith('http')) ? data.thumbnail : '',
            date: formatTimeAgo(data.created_utc),
            category: data.link_flair_text || '',
            likeCount: formatNumber(data.score),
            dislikeCount: '',
            commentCount: formatNumber(data.num_comments),
            viewCount: '',
            menus: [],
            hotCount: data.score,
            coldCount: data.score,
            _name: data.name // for pagination "after" parameter
        };
    });


    return {
        items: cardItems,
        after: nextAfter
    };
};

var fetchPost = (permalink) => {
    // Reddit API: add .json to the post URL
    const url = `${permalink}.json?raw_json=1`;
    console.log("Fetching post:", url);

    const headers = {
        "User-Agent": "Synura/1.0"
    };
    const cookie = getCookie();
    if (cookie) {
        headers["Cookie"] = cookie;
    }

    const response = fetch(url, {
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = response.json();

    // First element is the post, second is comments
    const postData = json[0].data.children[0].data;
    const commentsData = json[1].data.children;

    // Parse post content
    let content = [];

    // Add self text if exists
    if (postData.selftext_html) {
        try {
            const html = unescapeHtml(postData.selftext_html);
            const doc = new DOMParser().parseFromString(html, "text/html");
            const parsed = synura.parse('post', doc.body);
            if (parsed && parsed.length > 0) {
                content.push(...parsed);
            } else if (postData.selftext) {
                content.push({ type: 'text', value: postData.selftext });
            }
        } catch (e) {
            console.log("Error parsing selftext_html:", e);
            content.push({ type: 'text', value: postData.selftext || '(Error parsing content)' });
        }
    } else if (postData.selftext) {
        content.push({ type: 'text', value: postData.selftext });
    }

    // Handle Reddit Gallery
    if (postData.is_gallery && postData.media_metadata) {
        if (postData.gallery_data && postData.gallery_data.items) {
            postData.gallery_data.items.forEach(item => {
                const mediaId = item.media_id;
                const metadata = postData.media_metadata[mediaId];
                if (metadata && metadata.status === 'valid') {
                    // Try to get the source image
                    let imageUrl = '';
                    if (metadata.s && metadata.s.u) {
                        imageUrl = metadata.s.u;
                    } else if (metadata.s && metadata.s.gif) {
                        imageUrl = metadata.s.gif;
                    }

                    if (imageUrl) {
                        // Reddit URLs in metadata are often HTML-escaped (e.g., &amp;)
                        imageUrl = imageUrl.replace(/&amp;/g, '&');
                        content.push({ type: 'image', value: imageUrl });

                        // Add caption if exists
                        if (item.caption) {
                            content.push({ type: 'text', value: item.caption });
                        }
                    }
                }
            });
        }
    }

    // Add media if exists
    if (postData.url && !postData.is_self && !postData.is_gallery) {
        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(postData.url)) {
            content.push({ type: 'image', value: postData.url });
        } else if (postData.is_video && postData.media && postData.media.reddit_video) {
            let thumb = '';
            if (postData.preview && postData.preview.images && postData.preview.images[0] && postData.preview.images[0].source) {
                thumb = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
            }
            content.push({ type: 'video', value: postData.media.reddit_video.fallback_url, thumbnail: thumb });
        } else {
            // External link
            content.push({ type: 'link', value: postData.url, label: postData.url });
        }
    }

    if (content.length === 0) {
        content.push({ type: 'text', value: '(No text content)' });
    }

    // Parse comments
    const comments = parseComments(commentsData, 0);

    return {
        styles: {
            title: postData.title || '',
        },
        models: {
            author: postData.author || '',
            viewCount: '',
            likeCount: formatNumber(postData.score) || '',
            dislikeCount: '',
            date: formatTimeAgo(postData.created_utc) || '',
            avatar: '',
            content: content,
            comments: comments,
        }
    };
};

var parseComments = (commentsData, level) => {
    const comments = [];

    for (const comment of commentsData) {
        if (comment.kind !== 't1') continue; // Skip non-comment items

        const data = comment.data;

        let content = [];
        if (data.body_html) {
            try {
                const html = unescapeHtml(data.body_html);
                const doc = new DOMParser().parseFromString(html, "text/html");
                const parsed = synura.parse('post', doc.body);
                if (parsed && parsed.length > 0) {
                    content.push(...parsed);
                } else {
                    content.push({ type: 'text', value: data.body });
                }
            } catch (e) {
                content.push({ type: 'text', value: data.body });
            }
        } else if (data.body) {
            content.push({ type: 'text', value: data.body });
        }

        const likesInt = data.score || 0;

        comments.push({
            author: data.author || '[deleted]',
            avatar: '',
            content: content,
            date: formatTimeAgo(data.created_utc),
            likeCount: formatNumber(data.score),
            dislikeCount: '',
            level: level,
            menus: ["Reply", "Report"],
            hotCount: likesInt,
            coldCount: likesInt,
        });

        // Parse nested replies
        if (data.replies && data.replies.data && data.replies.data.children) {
            // Check recursion depth if needed, but for now typical Reddit threads are okay.
            // A simple safety check could be added if crashes occur.
            if (level < 20) {
                const nestedComments = parseComments(data.replies.data.children, level + 1);
                comments.push(...nestedComments);
            }
        }
    }

    return comments;
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
            const videoInList = globalSettings.video_in_list;

            synura.open({
                view: '/dialogs/input',
                styles: { title: 'Global Settings', message: 'Configure application settings.', close: true },
                models: {
                    body: [
                        { type: 'number', name: 'ttl', label: 'Cache TTL (min)', value: currentTTL },
                        { type: 'boolean', name: 'show_snackbar', label: 'Show Cache Notification', value: showSnackbar },
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
        const timeFilter = params.timeFilter || event.context.timeFilter || (sort === 'top' ? getTimeFilter() : null);
        const query = params.searchQuery || null;

        // Save back to params so it persists
        setParams(viewId, { sort, timeFilter, after: null });

        try {
            console.log(`[DEBUG] Calling fetchSubredditPosts for ${event.context.subredditId}, sort: ${sort}, time: ${timeFilter}, query: ${query}`);
            const result = fetchSubredditPosts(event.context.subredditId, sort, null, timeFilter, query, videoInList);
            console.log(`[DEBUG] fetchSubredditPosts returned items: ${result.items.length}, after: ${result.after}`);

            setParams(viewId, { after: result.after });

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
        const timeFilter = params.timeFilter || event.context.timeFilter;
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
            setParams(viewId, { after: result.after });

            synura.update(viewId, {
                models: {
                    append: result.items
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
            const timeFilter = params.timeFilter || event.context.timeFilter;
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
            const timeFilter = params.timeFilter || event.context.timeFilter;
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
            const result = fetchSubredditPosts(event.context.subredditId, null, null, null, query, videoInList);
            setParams(viewId, { after: result.after });
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
        const result = fetchSubredditPosts(subredditId, sort, null, timeFilter, null, videoInList);
        setParams(viewId, { after: result.after });

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
    } else if (event.eventId === "REFRESH") {
        const link = event.context.link;
        console.log("Refreshing post:", link);
        try {
            const postData = fetchPost(link);
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
            const settings = { video_in_list: event.data.video_in_list };
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
