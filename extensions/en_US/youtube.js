// =============================================================================
// test_youtube.js - Synura Extension for YouTube
// =============================================================================

var SYNURA = {
    domain: "m.youtube.com",
    name: "test_youtube",
    author: "Synura Team",
    description: "Unofficial YouTube extension with search, comments, and related videos.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    locale: "en_US",
    bypass: "chrome/android",
    deeplink: true,
    tags: ["video", "streaming", "search", "media"],
    get main() { return handler; }
};

var DEFAULT_QUERY = "technology";
var DEFAULT_HL = "en";
var DEFAULT_GL = "US";
var DEFAULT_CLIENT_NAME = "MWEB";
var DEFAULT_CLIENT_VERSION = "2.20260304.01.00";
var DEFAULT_API_KEY = "";
var YT_ORIGIN = "https://" + SYNURA.domain;

var QUICK_QUERIES = [
    { label: "Trending", query: "trending videos" },
    { label: "Music", query: "latest music videos" },
    { label: "Gaming", query: "gaming highlights" },
    { label: "News", query: "world news live" },
    { label: "Coding", query: "software engineering" }
];

var SEARCH_MENU_OPEN = "Open YouTube";
var POST_MENU_OPEN = "Open in Browser";
var POST_MENU_RELATED = "Open Related";
var POST_MENU_CHANNEL = "Open Channel";
var MENU_SETTINGS = "Settings";
var HOME_MENU_CHANNEL_LIST = "Channel List";
var CHANNEL_MENU_BOOKMARK = "Bookmark Channel";
var CHANNEL_MENU_UNBOOKMARK = "Remove Bookmark";
var CHANNEL_MENU_OPEN_BROWSER = "Open Channel in Browser";
var CHANNEL_MENU_ENABLE_VIDEOS = "Enable Videos";
var CHANNEL_MENU_ENABLE_STREAMS = "Enable Streams";

var ITEM_MENU_OPEN_BROWSER = "Open in Browser";
var ITEM_MENU_OPEN_VIDEO = "Open Video";
var ITEM_MENU_OPEN_CHANNEL = "Open Channel";
var ITEM_MENU_REMOVE_BOOKMARK = "Remove Bookmark";

var STARRED_CHANNELS_KEY = "youtube_starred_channels_v1";
var API_KEY_OVERRIDE_STORAGE_KEY = "youtube_api_key_override_v1";
var LANGUAGE_OVERRIDE_STORAGE_KEY = "youtube_language_override_v1";
var YOUTUBE_LANGUAGES = [
    { code: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", hl: "ar", gl: "SA", acceptLanguage: "ar-SA,ar;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "bn", label: "\u09ac\u09be\u0982\u09b2\u09be", hl: "bn", gl: "BD", acceptLanguage: "bn-BD,bn;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "zh-CN", label: "\u4e2d\u6587\uff08\u7b80\u4f53\uff09", hl: "zh-CN", gl: "CN", acceptLanguage: "zh-CN,zh;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "zh-TW", label: "\u4e2d\u6587\uff08\u7e41\u9ad4\uff09", hl: "zh-TW", gl: "TW", acceptLanguage: "zh-TW,zh;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "en", label: "English", hl: "en", gl: "US", acceptLanguage: "en-US,en;q=0.9" },
    { code: "fr", label: "Fran\u00e7ais", hl: "fr", gl: "FR", acceptLanguage: "fr-FR,fr;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "de", label: "Deutsch", hl: "de", gl: "DE", acceptLanguage: "de-DE,de;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "hi", label: "\u0939\u093f\u0928\u094d\u0926\u0940", hl: "hi", gl: "IN", acceptLanguage: "hi-IN,hi;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "it", label: "Italiano", hl: "it", gl: "IT", acceptLanguage: "it-IT,it;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "id", label: "Bahasa Indonesia", hl: "id", gl: "ID", acceptLanguage: "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "ja", label: "\u65e5\u672c\u8a9e", hl: "ja", gl: "JP", acceptLanguage: "ja-JP,ja;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "ko", label: "\ud55c\uad6d\uc5b4", hl: "ko", gl: "KR", acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "pl", label: "Polski", hl: "pl", gl: "PL", acceptLanguage: "pl-PL,pl;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "pt", label: "Portugu\u00eas", hl: "pt", gl: "BR", acceptLanguage: "pt-BR,pt;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "ru", label: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", hl: "ru", gl: "RU", acceptLanguage: "ru-RU,ru;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "es", label: "Espa\u00f1ol", hl: "es", gl: "ES", acceptLanguage: "es-ES,es;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "th", label: "\u0e44\u0e17\u0e22", hl: "th", gl: "TH", acceptLanguage: "th-TH,th;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "tr", label: "T\u00fcrk\u00e7e", hl: "tr", gl: "TR", acceptLanguage: "tr-TR,tr;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "vi", label: "Ti\u1ebfng Vi\u1ec7t", hl: "vi", gl: "VN", acceptLanguage: "vi-VN,vi;q=0.9,en-US;q=0.6,en;q=0.5" },
    { code: "ur", label: "\u0627\u0631\u062f\u0648", hl: "ur", gl: "PK", acceptLanguage: "ur-PK,ur;q=0.9,en-US;q=0.6,en;q=0.5" }
];
var HOME_SEARCH_APPBAR = {
    type: "query",
    label: "Search YouTube",
    hint: "Search videos"
};

var listViewState = {};
var postViewState = {};

var handler = {
    home: function () {
        openHomeView();
    },

    deeplink: function (url) {
        var videoId = parseVideoId(url);
        if (!videoId) {
            return false;
        }
        openVideoView(videoId, "YouTube");
        return true;
    },

    resume: function (viewId, context) {
        var kind = getString(context && context.kind);
        if (kind === "watch") {
            ensurePostState(viewId, context || {});
            synura.connect(viewId, context || {}, handler.onPostEvent);
            return;
        }
        ensureListState(viewId, context || {});
        synura.connect(viewId, context || {}, handler.onListEvent);
    },

    onListEvent: function (event) {
        var viewId = event.viewId;
        var state = ensureListState(viewId, event.context || {});

        if (event.eventId === "LOAD") {
            if (state.mode === "related") {
                renderRelatedList(viewId, state);
                return;
            }
            if (state.mode === "home") {
                renderHomeList(viewId, state);
                return;
            }
            if (state.mode === "channel") {
                if (!state.loaded) {
                    loadChannelFirstPage(viewId);
                } else {
                    renderChannelList(viewId, state);
                }
                return;
            }
            if (!state.loaded) {
                loadSearchFirstPage(viewId, state.query || DEFAULT_QUERY);
            }
            return;
        }

        if (event.eventId === "REFRESH") {
            if (state.mode === "related") {
                refreshRelatedList(viewId);
            } else if (state.mode === "home") {
                refreshHomeList(viewId);
            } else if (state.mode === "channel") {
                loadChannelFirstPage(viewId);
            } else {
                loadSearchFirstPage(viewId, state.query || DEFAULT_QUERY);
            }
            return;
        }

        if (event.eventId === "QUERY") {
            if (state.mode === "home") {
                var homeQuery = cleanQuery(event.data && event.data.query);
                if (!homeQuery) {
                    showSnackbar(viewId, "Type a search query.");
                    return;
                }
                openSearchView(homeQuery);
                return;
            }
            if (state.mode === "channel") {
                state.channelQuery = cleanQuery(event.data && event.data.query);
                loadChannelFirstPage(viewId);
                return;
            }
            if (state.mode !== "search") {
                return;
            }
            var query = cleanQuery(event.data && event.data.query) || DEFAULT_QUERY;
            state.query = query;
            loadSearchFirstPage(viewId, query);
            return;
        }

        if (event.eventId === "SCROLL_TO_END") {
            if (state.mode === "related") {
                loadMoreRelated(viewId);
            } else if (state.mode === "channel") {
                loadMoreChannel(viewId);
            } else {
                loadMoreSearch(viewId);
            }
            return;
        }

        if (event.eventId === "CLICK") {
            if (state.mode === "home") {
                if (!openChannelFromEventData(state, event.data)) {
                    showSnackbar(viewId, "Could not find channel.");
                }
                return;
            }
            var videoId = getString(event.data && event.data.videoId);
            if (!videoId) {
                videoId = parseVideoId(getString(event.data && event.data.link));
            }
            if (!videoId) {
                showSnackbar(viewId, "Could not find video id.");
                return;
            }
            openVideoView(videoId, getString(event.data && event.data.title) || "YouTube");
            return;
        }

        if (event.eventId === "ITEM_MENU_CLICK") {
            var itemMenu = getString(event.data && event.data.menu);
            var itemLink = getString(event.data && event.data.link);
            if (itemMenu === ITEM_MENU_OPEN_CHANNEL) {
                if (!openChannelFromEventData(state, event.data)) {
                    showSnackbar(viewId, "Could not find channel.");
                }
                return;
            }
            if (itemMenu === ITEM_MENU_REMOVE_BOOKMARK && state.mode === "home") {
                var homeChannel = resolveChannelFromListEvent(state, event.data);
                var removed = removeStarredChannel(homeChannel.channelUrl, homeChannel.channelId);
                refreshHomeList(viewId);
                showSnackbar(viewId, removed ? "Removed bookmark." : "Bookmark not found.");
                return;
            }
            if (itemMenu === ITEM_MENU_OPEN_BROWSER && itemLink) {
                var browserTitle = (state.mode === "home" || state.mode === "channel")
                    ? (getString(event.data && event.data.title) || "Channel")
                    : "YouTube";
                openBrowser(localizedURL(itemLink), browserTitle);
            } else if (itemMenu === ITEM_MENU_OPEN_VIDEO) {
                var targetVideoId = parseVideoId(itemLink);
                if (targetVideoId) {
                    openVideoView(targetVideoId, getString(event.data && event.data.title) || "YouTube");
                }
            }
            return;
        }

        if (event.eventId === "MENU_CLICK") {
            handleListMenu(viewId, state, getString(event.data && event.data.menu));
            return;
        }

        if (event.eventId === "AUTHOR_CLICK") {
            if (!openChannelFromEventData(state, event.data)) {
                showSnackbar(viewId, "Could not find channel.");
            }
        }
    },

    onPostEvent: function (event) {
        var viewId = event.viewId;
        var state = ensurePostState(viewId, event.context || {});

        if (event.eventId === "LOAD" || event.eventId === "REFRESH") {
            loadWatchPost(viewId);
            return;
        }

        if (event.eventId === "SCROLL_TO_END") {
            loadMoreComments(viewId);
            return;
        }

        if (event.eventId === "SUBMIT") {
            var button = getString(event.data && event.data.button);
            if (button === POST_MENU_OPEN) {
                openBrowser(localizedURL(watchURL(state.videoId)), "YouTube");
            } else if (button === POST_MENU_RELATED) {
                openRelatedFromPost(viewId);
            }
            return;
        }

        if (event.eventId === "ITEM_MENU_CLICK") {
            var menu = getString(event.data && event.data.menu);
            var link = getString(event.data && event.data.link);
            if (menu === ITEM_MENU_OPEN_VIDEO) {
                var targetVideoId = parseVideoId(link);
                if (targetVideoId) {
                    openVideoView(targetVideoId, getString(event.data && event.data.title) || "YouTube");
                }
            } else if (menu === ITEM_MENU_OPEN_BROWSER && link) {
                openBrowser(localizedURL(link), "YouTube");
            }
            return;
        }

        if (event.eventId === "MENU_CLICK") {
            var menuName = getString(event.data && event.data.menu);
            if (menuName === MENU_SETTINGS) {
                openSettingsDialog(viewId, state);
                return;
            }
            if (menuName === POST_MENU_OPEN) {
                openBrowser(localizedURL(watchURL(state.videoId)), "YouTube");
                return;
            }
            if (menuName === POST_MENU_RELATED) {
                openRelatedFromPost(viewId);
                return;
            }
            if (menuName === POST_MENU_CHANNEL) {
                openChannelFromPostState(viewId);
                return;
            }
            if (menuName === "Load More Comments") {
                loadMoreComments(viewId);
            }
            return;
        }

        if (event.eventId === "AUTHOR_CLICK") {
            openChannelFromPostState(viewId);
        }
    }
};

var openHomeView = function () {
    var result = synura.open({
        view: "/views/list",
        styles: {
            title: "Starred Channels",
            appbar: HOME_SEARCH_APPBAR,
            layout: "card",
            pagination: false,
            menu: true,
            media: true,
            history: true,
            authorClickable: false
        },
        models: {
            contents: [],
            menus: [HOME_MENU_CHANNEL_LIST, MENU_SETTINGS],
            snackbar: "Loading starred channels..."
        }
    }, {
        kind: "home"
    }, handler.onListEvent);

    if (!result.success) {
        return;
    }

    listViewState[String(result.viewId)] = {
        mode: "home",
        title: "Starred Channels",
        loaded: false,
        loading: false,
        continuation: "",
        items: [],
        apiCfg: defaultConfig(),
        channelUrl: "",
        channelId: "",
        channelTitle: "",
        channelAvatar: "",
        channelMemo: "",
        starred: false,
        enableVideos: true,
        enableStreams: true,
        continuationSource: ""
    };
};

var openSearchView = function (query) {
    var menuLabels = QUICK_QUERIES.map(function (item) { return item.label; });
    menuLabels.push(SEARCH_MENU_OPEN);
    menuLabels.push(MENU_SETTINGS);

    var result = synura.open({
        view: "/views/list",
        styles: {
            title: "YouTube",
            appbar: {
                type: "query",
                label: "Search YouTube",
                hint: "Search videos"
            },
            layout: "card",
            pagination: true,
            menu: true,
            media: true,
            history: true,
            authorClickable: true
        },
        models: {
            contents: [],
            menus: menuLabels,
            snackbar: "Loading videos..."
        }
    }, {
        kind: "search",
        query: cleanQuery(query) || DEFAULT_QUERY
    }, handler.onListEvent);

    if (!result.success) {
        return;
    }

    var key = String(result.viewId);
    var existing = listViewState[key] || {};
    listViewState[key] = {
        mode: "search",
        query: cleanQuery(query) || DEFAULT_QUERY,
        loaded: !!existing.loaded,
        loading: !!existing.loading,
        continuation: existing.continuation || "",
        items: existing.items || [],
        apiCfg: existing.apiCfg || defaultConfig(),
        channelUrl: "",
        channelId: "",
        channelTitle: "",
        channelAvatar: "",
        channelMemo: "",
        starred: false,
        enableVideos: true,
        enableStreams: true,
        continuationSource: ""
    };
};

var openVideoView = function (videoId, titleHint) {
    var result = synura.open({
        view: "/views/post",
        styles: {
            title: titleHint || "YouTube",
            menu: true,
            authorClickable: true
        },
        models: {
            link: localizedURL(watchURL(videoId)),
            author: "Loading...",
            date: "",
            viewCount: "",
            content: [{ type: "text", value: "Loading video data..." }],
            comments: [],
            menus: [POST_MENU_OPEN, MENU_SETTINGS],
            buttons: [POST_MENU_OPEN]
        }
    }, {
        kind: "watch",
        videoId: videoId
    }, handler.onPostEvent);

    if (!result.success) {
        return;
    }

    var key = String(result.viewId);
    var existing = postViewState[key] || {};
    postViewState[key] = {
        videoId: existing.videoId || videoId,
        loaded: !!existing.loaded,
        loading: !!existing.loading,
        comments: existing.comments || [],
        commentsContinuation: existing.commentsContinuation || "",
        relatedItems: existing.relatedItems || [],
        relatedContinuation: existing.relatedContinuation || "",
        channelUrl: existing.channelUrl || "",
        channelId: existing.channelId || "",
        channelTitle: existing.channelTitle || "",
        channelAvatar: existing.channelAvatar || "",
        channelMemo: existing.channelMemo || "",
        apiCfg: existing.apiCfg || defaultConfig()
    };
};

var openRelatedList = function (parentVideoId, title, items, continuation, apiCfg) {
    var result = synura.open({
        view: "/views/list",
        styles: {
            title: title || "Related Videos",
            layout: "card",
            pagination: true,
            menu: true,
            media: true,
            history: true,
            authorClickable: true
        },
        models: {
            contents: items || [],
            menus: [POST_MENU_OPEN, MENU_SETTINGS],
            snackbar: items && items.length ? "" : "No related videos available."
        }
    }, {
        kind: "related",
        videoId: parentVideoId
    }, handler.onListEvent);

    if (!result.success) {
        return;
    }

    var key = String(result.viewId);
    var existing = listViewState[key] || {};
    listViewState[key] = {
        mode: "related",
        parentVideoId: parentVideoId,
        title: title || "Related Videos",
        loaded: !!existing.loaded,
        loading: !!existing.loading,
        continuation: existing.continuation || continuation || "",
        items: existing.items || items || [],
        apiCfg: existing.apiCfg || cloneObject(apiCfg || defaultConfig()),
        channelUrl: "",
        channelId: "",
        channelTitle: "",
        channelAvatar: "",
        channelMemo: "",
        starred: false,
        enableVideos: true,
        enableStreams: true,
        continuationSource: ""
    };
};

var openRelatedFromPost = function (viewId) {
    var state = postViewState[String(viewId)];
    if (!state) {
        return;
    }
    openRelatedList(
        state.videoId,
        "Related Videos",
        state.relatedItems || [],
        state.relatedContinuation || "",
        state.apiCfg || defaultConfig()
    );
};

var openChannelList = function (channelUrl, channelTitle, channelId, channelAvatar, channelMemo) {
    var normalizedUrl = normalizeChannelUrl(channelUrl);
    if (!normalizedUrl && channelId) {
        normalizedUrl = normalizeChannelUrl("/channel/" + channelId);
    }
    if (!normalizedUrl) {
        return false;
    }

    var starred = isStarredChannel(normalizedUrl, channelId);
    var context = {
        kind: "channel",
        channelUrl: normalizedUrl,
        channelId: getString(channelId),
        channelTitle: getString(channelTitle),
        channelAvatar: getString(channelAvatar),
        channelMemo: getString(channelMemo),
        channelQuery: "",
        enableVideos: true,
        enableStreams: true
    };

    var result = synura.open({
        view: "/views/list",
        styles: {
            title: context.channelTitle || "Channel",
            appbar: buildChannelAppbar({
                channelTitle: context.channelTitle || "Channel",
                channelQuery: ""
            }),
            layout: "card",
            pagination: true,
            menu: true,
            media: true,
            history: true,
            authorClickable: true
        },
        models: {
            contents: [],
            menus: buildChannelMenus({ channelUrl: normalizedUrl, starred: starred }),
            snackbar: "Loading channel videos and live streams..."
        }
    }, context, handler.onListEvent);

    if (!result.success) {
        return false;
    }

    listViewState[String(result.viewId)] = {
        mode: "channel",
        title: context.channelTitle || "Channel",
        loaded: false,
        loading: false,
        continuation: "",
        items: [],
        apiCfg: defaultConfig(),
        channelUrl: normalizedUrl,
        channelId: context.channelId,
        channelTitle: context.channelTitle,
        channelAvatar: context.channelAvatar,
        channelMemo: context.channelMemo,
        channelQuery: "",
        starred: starred,
        enableVideos: true,
        enableStreams: true,
        continuationSource: ""
    };
    return true;
};

var openChannelFromPostState = function (viewId) {
    var state = postViewState[String(viewId)];
    if (!state || (!state.channelUrl && !state.channelId)) {
        showSnackbar(viewId, "Could not find channel.");
        return;
    }
    var opened = openChannelList(
        state.channelUrl,
        state.channelTitle || "Channel",
        state.channelId,
        state.channelAvatar,
        state.channelMemo
    );
    if (!opened) {
        showSnackbar(viewId, "Could not open channel.");
    }
};

var openChannelFromEventData = function (state, data) {
    var channel = resolveChannelFromListEvent(state, data);
    if (!channel.channelUrl && !channel.channelId) {
        return false;
    }
    return openChannelList(
        channel.channelUrl,
        channel.channelTitle || channel.author || channel.title || "Channel",
        channel.channelId,
        channel.channelAvatar || channel.avatar,
        channel.channelMemo || channel.memo
    );
};

var resolveChannelFromListEvent = function (state, data) {
    var out = {
        channelUrl: normalizeChannelUrl(getString(data && data.channelUrl)),
        channelId: getString(data && data.channelId),
        channelTitle: getString(data && data.channelTitle),
        channelAvatar: getString(data && data.channelAvatar),
        channelMemo: getString(data && data.channelMemo),
        author: getString(data && data.author),
        title: getString(data && data.title),
        avatar: getString(data && data.avatar),
        memo: getString(data && data.memo)
    };

    if (!out.channelUrl && out.channelId) {
        out.channelUrl = normalizeChannelUrl("/channel/" + out.channelId);
    }

    var link = getString(data && data.link);
    if (!out.channelUrl && state && state.mode === "home") {
        out.channelUrl = normalizeChannelUrl(link);
    }

    if ((!out.channelUrl || !out.channelId || !out.channelTitle) && state && Array.isArray(state.items)) {
        for (var i = 0; i < state.items.length; i++) {
            var item = state.items[i] || {};
            if (getString(item.link) !== link) {
                continue;
            }
            if (out.author && getString(item.author) && getString(item.author) !== out.author) {
                continue;
            }
            out.channelUrl = out.channelUrl || normalizeChannelUrl(item.channelUrl);
            out.channelId = out.channelId || getString(item.channelId);
            out.channelTitle = out.channelTitle || getString(item.channelTitle) || getString(item.author) || getString(item.title);
            out.channelAvatar = out.channelAvatar || getString(item.channelAvatar) || getString(item.avatar);
            out.channelMemo = out.channelMemo || getString(item.channelMemo);
            break;
        }
    }

    return out;
};

var buildChannelMenus = function (state) {
    var menus = [];
    if (state.channelUrl) {
        menus.push(CHANNEL_MENU_OPEN_BROWSER);
    }
    menus.push({
        label: CHANNEL_MENU_ENABLE_VIDEOS,
        checked: normalizeEnabledFlag(state && state.enableVideos)
    });
    menus.push({
        label: CHANNEL_MENU_ENABLE_STREAMS,
        checked: normalizeEnabledFlag(state && state.enableStreams)
    });
    menus.push(state.starred ? CHANNEL_MENU_UNBOOKMARK : CHANNEL_MENU_BOOKMARK);
    menus.push(MENU_SETTINGS);
    return menus;
};

var setChannelBookmark = function (viewId, state, shouldStar) {
    if (!state || (!state.channelUrl && !state.channelId)) {
        showSnackbar(viewId, "Could not find channel.");
        return;
    }

    var changed = false;
    if (shouldStar) {
        changed = upsertStarredChannel({
            channelUrl: state.channelUrl,
            channelId: state.channelId,
            channelTitle: state.channelTitle,
            channelAvatar: state.channelAvatar,
            channelMemo: state.channelMemo,
            enabled: true
        });
    } else {
        changed = removeStarredChannel(state.channelUrl, state.channelId);
    }

    state.starred = isStarredChannel(state.channelUrl, state.channelId);
    synura.update(viewId, {
        models: {
            menus: buildChannelMenus(state),
            snackbar: shouldStar
                ? (changed ? "Channel bookmarked." : "Channel already bookmarked.")
                : (changed ? "Bookmark removed." : "Bookmark not found.")
        }
    });
};

var openSettingsDialog = function (parentViewId, targetState) {
    var currentApiKey = loadApiKeyOverride();
    var currentLanguage = getCurrentLanguageSetting();
    var languageOptions = getLanguageOptions();
    var dialogViewId = 0;
    var result = synura.open({
        view: "/dialogs/input",
        styles: {
            title: "Settings",
            message: "Update YouTube API key and language.",
            close: true
        },
        models: {
            body: [{
                type: "string",
                name: "apiKey",
                label: "API Key",
                value: currentApiKey
            }, {
                type: "select",
                name: "language",
                label: "Language",
                value: currentLanguage.label,
                options: languageOptions
            }],
            buttons: ["Save", "Clear", "Cancel"]
        }
    }, function (event) {
        if (event.eventId === "SUBMIT") {
            var button = getString(event.data && event.data.button);
            if (button === "Save") {
                var key = sanitizeApiKey(event.data && event.data.apiKey);
                var languageCode = languageCodeFromOption(event.data && event.data.language);
                if (!languageCode) {
                    showSnackbar(parentViewId, "Invalid language selection.");
                    return;
                }
                if (key) {
                    if (!saveApiKeyOverride(key)) {
                        showSnackbar(parentViewId, "Could not save API key.");
                        return;
                    }
                } else if (!clearApiKeyOverride()) {
                    showSnackbar(parentViewId, "Could not clear API key.");
                    return;
                }
                if (!saveLanguageOverride(languageCode)) {
                    showSnackbar(parentViewId, "Could not save language.");
                    return;
                }
                applySettingsToState(targetState);
                showSnackbar(parentViewId, "Settings saved. Pull to refresh.");
                synura.close(dialogViewId);
                return;
            }
            if (button === "Clear") {
                if (!clearApiKeyOverride() || !clearLanguageOverride()) {
                    showSnackbar(parentViewId, "Could not clear settings.");
                    return;
                }
                applySettingsToState(targetState);
                showSnackbar(parentViewId, "Settings cleared. Pull to refresh.");
                synura.close(dialogViewId);
                return;
            }
            synura.close(dialogViewId);
            return;
        }

        if (event.eventId === "CLOSE") {
            synura.close(dialogViewId);
        }
    });

    if (!result.success) {
        showSnackbar(parentViewId, "Could not open settings.");
        return;
    }
    dialogViewId = result.viewId;
};

var applySettingsToState = function (state) {
    if (!state || !state.apiCfg) {
        return;
    }
    state.apiCfg.apiKey = resolveApiKey(state.apiCfg.apiKey);
    applyLocaleToConfig(state.apiCfg);
};

var buildChannelManagerFields = function (channels) {
    var fields = [];
    for (var i = 0; i < channels.length; i++) {
        var channel = channels[i] || {};
        var title = getString(channel.channelTitle) || getString(channel.channelUrl) || ("Channel " + (i + 1));
        var memo = getString(channel.channelMemo);
        if (memo) {
            title = trimTo(title + " - " + memo, 120);
        }
        fields.push({
            type: "boolean",
            name: "enabled_" + i,
            label: title,
            value: channel.enabled !== false
        });
    }
    return fields;
};

var applyChannelManagerValues = function (channels, data) {
    for (var i = 0; i < channels.length; i++) {
        var name = "enabled_" + i;
        channels[i].enabled = data && data[name] === true;
    }
};

var openChannelListManager = function (parentViewId) {
    var channels = loadStarredChannels();
    if (!channels.length) {
        showSnackbar(parentViewId, "No starred channels.");
        return;
    }

    var managerViewId = 0;
    var managerButtons = ["Save", "Enable All", "Disable All", "Delete Disabled", "Cancel"];

    var result = synura.open({
        view: "/views/settings",
        styles: {
            title: "Channel List",
            message: "Enable, disable, or delete starred channels."
        },
        models: {
            body: buildChannelManagerFields(channels),
            buttons: managerButtons
        }
    }, function (event) {
        if (event.eventId !== "SUBMIT") {
            return;
        }

        var button = getString(event.data && event.data.button);
        if (button === "Save") {
            applyChannelManagerValues(channels, event.data);
            if (!saveStarredChannels(channels)) {
                showSnackbar(managerViewId, "Could not save channel list.");
                return;
            }
            refreshHomeList(parentViewId);
            showSnackbar(parentViewId, "Channel list saved.");
            synura.close(managerViewId);
            return;
        }

        if (button === "Enable All" || button === "Disable All") {
            var enabled = button === "Enable All";
            for (var i = 0; i < channels.length; i++) {
                channels[i].enabled = enabled;
            }
            synura.update(managerViewId, {
                models: {
                    body: buildChannelManagerFields(channels),
                    buttons: managerButtons,
                    snackbar: enabled ? "All channels enabled." : "All channels disabled."
                }
            });
            return;
        }

        if (button === "Delete Disabled") {
            applyChannelManagerValues(channels, event.data);
            var kept = [];
            var removed = 0;
            for (var j = 0; j < channels.length; j++) {
                if (channels[j].enabled === false) {
                    removed++;
                    continue;
                }
                kept.push(channels[j]);
            }

            if (!removed) {
                showSnackbar(managerViewId, "No disabled channels to delete.");
                return;
            }

            channels = kept;
            if (!saveStarredChannels(channels)) {
                showSnackbar(managerViewId, "Could not delete channels.");
                return;
            }

            refreshHomeList(parentViewId);

            if (!channels.length) {
                showSnackbar(parentViewId, "Deleted " + removed + " channel(s).");
                synura.close(managerViewId);
                return;
            }

            synura.update(managerViewId, {
                models: {
                    body: buildChannelManagerFields(channels),
                    buttons: managerButtons,
                    snackbar: "Deleted " + removed + " channel(s)."
                }
            });
            return;
        }

        synura.close(managerViewId);
    });

    if (!result.success) {
        showSnackbar(parentViewId, "Could not open channel list.");
        return;
    }

    managerViewId = result.viewId;
};

var isMenuMatch = function (menu, label) {
    var value = getString(menu);
    var target = getString(label);
    if (!value || !target) {
        return false;
    }
    return value === target || value.indexOf(target) >= 0;
};

var handleListMenu = function (viewId, state, menu) {
    if (!menu) {
        return;
    }

    if (menu === MENU_SETTINGS) {
        openSettingsDialog(viewId, state);
        return;
    }

    if (state.mode === "home" && menu === HOME_MENU_CHANNEL_LIST) {
        openChannelListManager(viewId);
        return;
    }

    if (state.mode === "channel") {
        if (menu === CHANNEL_MENU_OPEN_BROWSER && state.channelUrl) {
            openBrowser(localizedURL(state.channelUrl), state.channelTitle || "Channel");
            return;
        }
        if (isMenuMatch(menu, CHANNEL_MENU_ENABLE_VIDEOS)) {
            state.enableVideos = !normalizeEnabledFlag(state.enableVideos);
            loadChannelFirstPage(viewId);
            return;
        }
        if (isMenuMatch(menu, CHANNEL_MENU_ENABLE_STREAMS)) {
            state.enableStreams = !normalizeEnabledFlag(state.enableStreams);
            loadChannelFirstPage(viewId);
            return;
        }
        if (menu === CHANNEL_MENU_BOOKMARK) {
            setChannelBookmark(viewId, state, true);
            return;
        }
        if (menu === CHANNEL_MENU_UNBOOKMARK) {
            setChannelBookmark(viewId, state, false);
            return;
        }
        return;
    }

    if (menu === SEARCH_MENU_OPEN) {
        openBrowser(localizedURL(YT_ORIGIN + "/"), "YouTube");
        return;
    }

    if (menu === POST_MENU_OPEN && state.mode === "related") {
        openBrowser(localizedURL(watchURL(state.parentVideoId)), "YouTube");
        return;
    }

    if (state.mode !== "search") {
        return;
    }

    for (var i = 0; i < QUICK_QUERIES.length; i++) {
        if (QUICK_QUERIES[i].label === menu) {
            state.query = QUICK_QUERIES[i].query;
            loadSearchFirstPage(viewId, state.query);
            return;
        }
    }
};

var ensureListState = function (viewId, context) {
    var key = String(viewId);
    if (!listViewState[key]) {
        var kind = getString(context && context.kind);
        var mode = kind;
        if (mode !== "related" && mode !== "search" && mode !== "home" && mode !== "channel") {
            mode = "search";
        }
        var channelUrl = normalizeChannelUrl(getString(context && context.channelUrl));
        var channelId = getString(context && context.channelId);
        if (!channelUrl && channelId) {
            channelUrl = normalizeChannelUrl("/channel/" + channelId);
        }
        listViewState[key] = {
            mode: mode,
            parentVideoId: getString(context && context.videoId),
            title: getString(context && context.title) || (mode === "related" ? "Related Videos" : (mode === "home" ? "Starred Channels" : (mode === "channel" ? "Channel" : "YouTube"))),
            query: getString(context && context.query) || DEFAULT_QUERY,
            loaded: false,
            loading: false,
            continuation: "",
            items: [],
            apiCfg: defaultConfig(),
            channelUrl: channelUrl,
            channelId: channelId,
            channelTitle: getString(context && context.channelTitle),
            channelAvatar: getString(context && context.channelAvatar),
            channelMemo: getString(context && context.channelMemo),
            channelQuery: cleanQuery(context && context.channelQuery),
            starred: isStarredChannel(channelUrl, channelId),
            enableVideos: normalizeEnabledFlag(context && context.enableVideos),
            enableStreams: normalizeEnabledFlag(context && context.enableStreams),
            continuationSource: getString(context && context.continuationSource)
        };
        if (mode === "home") {
            listViewState[key].items = starredChannelsToListItems(loadStarredChannels());
            listViewState[key].loaded = true;
        }
    }
    return listViewState[key];
};

var ensurePostState = function (viewId, context) {
    var key = String(viewId);
    if (!postViewState[key]) {
        postViewState[key] = {
            videoId: getString(context && context.videoId),
            loaded: false,
            loading: false,
            comments: [],
            commentsContinuation: "",
            relatedItems: [],
            relatedContinuation: "",
            channelUrl: "",
            channelId: "",
            channelTitle: "",
            channelAvatar: "",
            channelMemo: "",
            apiCfg: defaultConfig()
        };
    }
    return postViewState[key];
};

var renderRelatedList = function (viewId, state) {
    state.loaded = true;
    synura.update(viewId, {
        styles: {
            title: state.title || "Related Videos"
        },
        models: {
            contents: state.items || [],
            menus: [POST_MENU_OPEN, MENU_SETTINGS],
            snackbar: (state.items || []).length ? "" : "No related videos available."
        }
    });
};

var buildHomeSnackbar = function (allChannels, visibleItems) {
    if (visibleItems && visibleItems.length) {
        return "";
    }
    if (allChannels && allChannels.length) {
        return "All channels are disabled. Open Channel List.";
    }
    return "No starred channels yet.";
};

var renderHomeList = function (viewId, state) {
    var allChannels = loadStarredChannels();
    state.items = starredChannelsToListItems(allChannels);
    state.loaded = true;
    state.mode = "home";
    synura.update(viewId, {
        styles: {
            title: "Starred Channels",
            appbar: HOME_SEARCH_APPBAR
        },
        models: {
            contents: state.items,
            menus: [HOME_MENU_CHANNEL_LIST, MENU_SETTINGS],
            snackbar: buildHomeSnackbar(allChannels, state.items)
        }
    });
};

var refreshHomeList = function (viewId) {
    var state = listViewState[String(viewId)];
    if (!state) {
        return;
    }
    renderHomeList(viewId, state);
};

var buildChannelAppbar = function (state) {
    var channelTitle = getString(state && state.channelTitle) || "Channel";
    var query = cleanQuery(state && state.channelQuery);
    return {
        type: "query",
        label: "Search " + channelTitle,
        hint: query || "Search in this channel"
    };
};

var buildChannelSnackbar = function (state) {
    if (state.items && state.items.length) {
        return "";
    }
    var channelQuery = cleanQuery(state && state.channelQuery);
    if (channelQuery) {
        return "No results in this channel for \"" + channelQuery + "\".";
    }
    var videosEnabled = normalizeEnabledFlag(state && state.enableVideos);
    var streamsEnabled = normalizeEnabledFlag(state && state.enableStreams);
    if (!videosEnabled && !streamsEnabled) {
        return "Videos and live streams are disabled.";
    }
    if (videosEnabled && streamsEnabled) {
        return "No videos or live streams found.";
    }
    return videosEnabled ? "No videos found." : "No live streams found.";
};

var renderChannelList = function (viewId, state) {
    synura.update(viewId, {
        styles: {
            title: state.channelTitle || "Channel",
            appbar: buildChannelAppbar(state)
        },
        models: {
            contents: state.items || [],
            menus: buildChannelMenus(state),
            snackbar: buildChannelSnackbar(state)
        }
    });
};

var loadChannelFirstPage = function (viewId) {
    var state = listViewState[String(viewId)];
    if (!state || state.loading) {
        return;
    }
    if (!state.channelUrl && !state.channelId) {
        showSnackbar(viewId, "Could not find channel.");
        return;
    }

    if (!normalizeEnabledFlag(state.enableVideos) && !normalizeEnabledFlag(state.enableStreams)) {
        state.items = [];
        state.continuation = "";
        state.continuationSource = "";
        state.loaded = true;
        renderChannelList(viewId, state);
        return;
    }

    state.loading = true;
    try {
        var page = fetchChannelPage(state.channelUrl, state.channelId, {
            query: cleanQuery(state.channelQuery),
            videos: normalizeEnabledFlag(state.enableVideos),
            streams: normalizeEnabledFlag(state.enableStreams)
        });
        state.mode = "channel";
        state.items = page.items;
        state.continuation = page.continuation;
        state.continuationSource = page.continuationSource || "";
        state.apiCfg = page.apiCfg;
        state.loaded = true;

        if (page.channel) {
            state.channelUrl = normalizeChannelUrl(page.channel.channelUrl || state.channelUrl);
            state.channelId = page.channel.channelId || state.channelId;
            state.channelTitle = page.channel.channelTitle || state.channelTitle;
            state.channelAvatar = page.channel.channelAvatar || state.channelAvatar;
            state.channelMemo = page.channel.channelMemo || state.channelMemo;
        }
        if (!state.channelUrl && state.channelId) {
            state.channelUrl = normalizeChannelUrl("/channel/" + state.channelId);
        }
        state.starred = isStarredChannel(state.channelUrl, state.channelId);
        renderChannelList(viewId, state);
    } catch (e) {
        showSnackbar(viewId, "Channel load failed: " + e.toString());
    }
    state.loading = false;
};

var loadMoreChannel = function (viewId) {
    var state = listViewState[String(viewId)];
    if (!state || state.loading || !state.continuation) {
        return;
    }

    state.loading = true;
    try {
        var page = fetchChannelContinuation(state.continuation, state.apiCfg, state.continuationSource);
        state.continuation = page.continuation;

        var known = {};
        for (var i = 0; i < state.items.length; i++) {
            known[getString(state.items[i] && state.items[i].videoId)] = true;
        }

        var appended = [];
        for (var j = 0; j < page.items.length; j++) {
            var id = getString(page.items[j] && page.items[j].videoId);
            if (!id || known[id]) {
                continue;
            }
            known[id] = true;
            appended.push(page.items[j]);
        }

        if (appended.length) {
            state.items = state.items.concat(appended);
        }

        synura.update(viewId, {
            models: {
                append: appended,
                snackbar: appended.length ? "" : "No more channel items."
            }
        });

        if (!appended.length || !state.continuation) {
            showSnackbar(viewId, "No more channel items.");
        }
    } catch (e) {
        showSnackbar(viewId, "Could not load more channel items: " + e.toString());
    }
    state.loading = false;
};

var loadSearchFirstPage = function (viewId, query) {
    var state = ensureListState(viewId, { kind: "search" });
    if (state.loading) {
        return;
    }

    state.loading = true;
    try {
        var page = fetchSearchPage(query);
        state.mode = "search";
        state.query = query;
        state.items = page.items;
        state.continuation = page.continuation;
        state.apiCfg = page.apiCfg;
        state.loaded = true;

        var title = "YouTube - " + query;
        synura.update(viewId, {
            styles: {
                title: title
            },
            models: {
                contents: page.items,
                snackbar: page.items.length ? "" : "No videos found."
            }
        });
    } catch (e) {
        showSnackbar(viewId, "Search failed: " + e.toString());
    }
    state.loading = false;
};

var loadMoreSearch = function (viewId) {
    var state = listViewState[String(viewId)];
    if (!state || state.loading || !state.continuation) {
        return;
    }

    state.loading = true;
    try {
        var page = fetchSearchContinuation(state.continuation, state.apiCfg);
        state.continuation = page.continuation;
        state.items = state.items.concat(page.items);

        synura.update(viewId, {
            models: {
                append: page.items,
                snackbar: page.items.length ? "" : "No more results."
            }
        });

        if (!page.items.length || !state.continuation) {
            showSnackbar(viewId, "No more results.");
        }
    } catch (e) {
        showSnackbar(viewId, "Could not load more videos: " + e.toString());
    }
    state.loading = false;
};

var refreshRelatedList = function (viewId) {
    var state = listViewState[String(viewId)];
    if (!state) {
        return;
    }
    synura.update(viewId, {
        models: {
            contents: state.items || [],
            snackbar: ""
        }
    });
};

var loadMoreRelated = function (viewId) {
    var state = listViewState[String(viewId)];
    if (!state || state.loading || !state.continuation) {
        return;
    }

    state.loading = true;
    try {
        var page = fetchRelatedContinuation(state.continuation, state.apiCfg);
        state.continuation = page.continuation;
        state.items = state.items.concat(page.items);

        synura.update(viewId, {
            models: {
                append: page.items,
                snackbar: page.items.length ? "" : "No more related videos."
            }
        });

        if (!page.items.length || !state.continuation) {
            showSnackbar(viewId, "No more related videos.");
        }
    } catch (e) {
        showSnackbar(viewId, "Could not load related videos: " + e.toString());
    }
    state.loading = false;
};

var loadWatchPost = function (viewId) {
    var state = postViewState[String(viewId)];
    if (!state || state.loading || !state.videoId) {
        return;
    }

    state.loading = true;

    try {
        var payload = fetchWatchPayload(state.videoId);
        state.apiCfg = payload.apiCfg;
        state.channelUrl = payload.channelUrl;
        state.channelId = payload.channelId;
        state.channelTitle = payload.channelTitle || payload.author;
        state.channelAvatar = payload.channelAvatar;
        state.channelMemo = payload.channelMemo;
        state.relatedItems = payload.relatedItems;
        state.relatedContinuation = payload.relatedContinuation;

        var commentsPage = { comments: [], continuation: "" };
        if (payload.commentsContinuation) {
            commentsPage = fetchCommentsContinuation(payload.commentsContinuation, payload.apiCfg);
        }

        state.comments = commentsPage.comments;
        state.commentsContinuation = commentsPage.continuation;
        state.loaded = true;

        synura.update(viewId, {
            styles: {
                title: payload.title || "YouTube"
            },
            models: buildPostModels(payload, state)
        });
    } catch (e) {
        showSnackbar(viewId, "Failed to load video: " + e.toString());
    }

    state.loading = false;
};

var loadMoreComments = function (viewId) {
    var state = postViewState[String(viewId)];
    if (!state || state.loading || !state.commentsContinuation) {
        if (state && state.loaded) {
            showSnackbar(viewId, "No more comments.");
        }
        return;
    }

    state.loading = true;
    try {
        var page = fetchCommentsContinuation(state.commentsContinuation, state.apiCfg);
        state.commentsContinuation = page.continuation;
        state.comments = state.comments.concat(page.comments);

        synura.update(viewId, {
            models: {
                comments: state.comments,
                menus: buildPostMenus(state),
                snackbar: page.comments.length ? "" : "No more comments."
            }
        });

        if (!page.comments.length || !state.commentsContinuation) {
            showSnackbar(viewId, "No more comments.");
        }
    } catch (e) {
        showSnackbar(viewId, "Could not load more comments: " + e.toString());
    }
    state.loading = false;
};

var buildPostModels = function (payload, state) {
    var content = [];
    content.push({ type: "link", value: payload.link, href: payload.link, link: payload.link });

    if (payload.metadataLine) {
        content.push({ type: "text", value: payload.metadataLine });
    }

    if (payload.description) {
        content.push({ type: "text", value: payload.description });
    }

    return {
        link: payload.link,
        author: payload.author,
        date: payload.date,
        viewCount: payload.viewCount,
        memo: payload.channelMemo,
        content: content,
        comments: state.comments,
        menus: buildPostMenus(state),
        buttons: [POST_MENU_OPEN, POST_MENU_RELATED]
    };
};

var buildPostMenus = function (state) {
    var menus = [POST_MENU_OPEN];
    if ((state.relatedItems && state.relatedItems.length) || state.relatedContinuation) {
        menus.push(POST_MENU_RELATED);
    }
    if (state.channelUrl) {
        menus.push(POST_MENU_CHANNEL);
    }
    if (state.commentsContinuation) {
        menus.push("Load More Comments");
    }
    menus.push(MENU_SETTINGS);
    return menus;
};

var fetchSearchPage = function (query) {
    var url = localizedURL(YT_ORIGIN + "/results?search_query=" + encodeURIComponent(query));
    var html = fetchText(url);
    var initialData = extractJSONVar(html, "ytInitialData");
    if (!initialData) {
        throw new Error("Could not parse ytInitialData from search page.");
    }

    var apiCfg = extractInnertubeConfig(html);

    var sectionContents = getIn(initialData, ["contents", "sectionListRenderer", "contents"], []);
    var videos = normalizeVideoItems(collectVideos(sectionContents), query);
    var continuation = extractContinuationToken(sectionContents);

    return {
        items: videos,
        continuation: continuation,
        apiCfg: apiCfg
    };
};

var fetchSearchContinuation = function (token, apiCfg) {
    var payload = {
        context: buildInnertubeContext(apiCfg),
        continuation: token
    };
    var response = callInnertube("/youtubei/v1/search", payload, apiCfg);
    var items = extractContinuationItems(response);
    var videos = normalizeVideoItems(collectVideos(items), "");
    var continuation = extractContinuationToken(items);

    return {
        items: videos,
        continuation: continuation
    };
};

var fetchChannelTabPage = function (normalizedChannelUrl, channelId, tabName, optional) {
    var url = toChannelTabURL(normalizedChannelUrl, tabName);
    if (!url) {
        if (optional) {
            return null;
        }
        throw new Error("Missing channel URL.");
    }

    var html = "";
    try {
        html = fetchText(localizedURL(url));
    } catch (e) {
        if (optional) {
            return null;
        }
        throw e;
    }

    var initialData = extractJSONVar(html, "ytInitialData");
    if (!initialData) {
        if (optional) {
            return null;
        }
        throw new Error("Could not parse ytInitialData from channel page.");
    }

    var apiCfg = extractInnertubeConfig(html);
    var videos = normalizeVideoItems(collectVideos(initialData), "");
    if (tabName === "streams") {
        for (var i = 0; i < videos.length; i++) {
            var item = videos[i] || {};
            var types = Array.isArray(item.types) ? item.types.slice() : [];
            if (types.indexOf("stream") < 0) {
                types.push("stream");
            }
            item.types = types;
            if (!item.memo) {
                item.memo = "Live stream";
            }
            videos[i] = item;
        }
    }
    var channel = parseChannelMetadata(initialData, normalizedChannelUrl, channelId);

    return {
        items: dedupeByVideoId(videos),
        continuation: extractContinuationToken(initialData),
        apiCfg: apiCfg,
        channel: channel
    };
};

var fetchChannelSearchPage = function (normalizedChannelUrl, channelId, query) {
    var url = toChannelSearchURL(normalizedChannelUrl, query);
    if (!url) {
        throw new Error("Missing channel URL.");
    }

    var html = fetchText(localizedURL(url));
    var initialData = extractJSONVar(html, "ytInitialData");
    if (!initialData) {
        throw new Error("Could not parse ytInitialData from channel search page.");
    }

    var apiCfg = extractInnertubeConfig(html);
    var videos = normalizeVideoItems(collectVideos(initialData), query);
    var channel = parseChannelMetadata(initialData, normalizedChannelUrl, channelId);

    return {
        items: dedupeByVideoId(videos),
        continuation: extractContinuationToken(initialData),
        apiCfg: apiCfg,
        channel: channel
    };
};

var fetchChannelPage = function (channelUrl, channelId, options) {
    var normalized = normalizeChannelUrl(channelUrl);
    if (!normalized && channelId) {
        normalized = normalizeChannelUrl("/channel/" + channelId);
    }
    if (!normalized) {
        throw new Error("Missing channel URL.");
    }

    var channelQuery = cleanQuery(options && options.query);
    var wantVideos = normalizeEnabledFlag(options && options.videos);
    var wantStreams = normalizeEnabledFlag(options && options.streams);

    if (channelQuery) {
        var searchPage = fetchChannelSearchPage(normalized, channelId, channelQuery);
        return {
            items: searchPage.items,
            continuation: searchPage.continuation,
            continuationSource: "search",
            apiCfg: searchPage.apiCfg,
            channel: searchPage.channel || {
                channelUrl: normalized,
                channelId: getString(channelId),
                channelTitle: "",
                channelAvatar: "",
                channelMemo: ""
            }
        };
    }

    if (!wantVideos && !wantStreams) {
        return {
            items: [],
            continuation: "",
            continuationSource: "",
            apiCfg: defaultConfig(),
            channel: {
                channelUrl: normalized,
                channelId: getString(channelId),
                channelTitle: "",
                channelAvatar: "",
                channelMemo: ""
            }
        };
    }

    var videosPage = wantVideos ? fetchChannelTabPage(normalized, channelId, "videos", wantStreams) : null;
    var streamsPage = wantStreams ? fetchChannelTabPage(normalized, channelId, "streams", true) : null;

    var mergedItems = [];
    if (streamsPage && streamsPage.items.length) {
        mergedItems = mergedItems.concat(streamsPage.items);
    }
    if (videosPage && videosPage.items.length) {
        mergedItems = mergedItems.concat(videosPage.items);
    }

    var continuation = "";
    var continuationSource = "";
    if (videosPage && videosPage.continuation) {
        continuation = videosPage.continuation;
        continuationSource = "videos";
    } else if (streamsPage && streamsPage.continuation) {
        continuation = streamsPage.continuation;
        continuationSource = "streams";
    }

    var fallbackChannel = {
        channelUrl: normalized,
        channelId: getString(channelId),
        channelTitle: "",
        channelAvatar: "",
        channelMemo: ""
    };

    return {
        items: dedupeByVideoId(mergedItems),
        continuation: continuation,
        continuationSource: continuationSource,
        apiCfg: (videosPage && videosPage.apiCfg) || (streamsPage && streamsPage.apiCfg) || defaultConfig(),
        channel: (videosPage && videosPage.channel) || (streamsPage && streamsPage.channel) || fallbackChannel
    };
};

var fetchChannelContinuation = function (token, apiCfg, source) {
    var payload = {
        context: buildInnertubeContext(apiCfg),
        continuation: token
    };
    var endpoint = source === "search" ? "/youtubei/v1/search" : "/youtubei/v1/browse";
    var response = null;
    try {
        response = callInnertube(endpoint, payload, apiCfg);
    } catch (e) {
        if (endpoint === "/youtubei/v1/search") {
            response = callInnertube("/youtubei/v1/browse", payload, apiCfg);
        } else {
            throw e;
        }
    }
    var items = extractContinuationItems(response || {});
    var videos = normalizeVideoItems(collectVideos(items), "");

    return {
        items: dedupeByVideoId(videos),
        continuation: extractContinuationToken(items)
    };
};

var fetchWatchPayload = function (videoId) {
    var url = localizedURL(watchURL(videoId));
    var html = fetchText(url);
    var initialData = extractJSONVar(html, "ytInitialData");
    if (!initialData) {
        throw new Error("Could not parse ytInitialData from watch page.");
    }

    var apiCfg = extractInnertubeConfig(html);
    var resultsContents = getIn(initialData, ["contents", "singleColumnWatchNextResults", "results", "results", "contents"], []);

    var metadata = parseWatchMetadata(initialData, videoId);

    var relatedRaw = collectVideos(resultsContents);
    var related = normalizeVideoItems(relatedRaw, "").filter(function (item) {
        return item.videoId && item.videoId !== videoId;
    });

    var relatedContinuation = extractContinuationToken(resultsContents);
    var commentsContinuation = extractCommentsContinuation(initialData);

    return {
        link: localizedURL(watchURL(videoId), apiCfg),
        videoId: videoId,
        title: metadata.title,
        author: metadata.author,
        date: metadata.date,
        viewCount: metadata.viewCount,
        thumbnail: metadata.thumbnail,
        description: metadata.description,
        metadataLine: metadata.metadataLine,
        channelMemo: metadata.channelMemo,
        channelUrl: metadata.channelUrl,
        channelId: metadata.channelId,
        channelAvatar: metadata.channelAvatar,
        channelTitle: metadata.channelTitle || metadata.author,
        commentsContinuation: commentsContinuation,
        relatedItems: dedupeByVideoId(related),
        relatedContinuation: relatedContinuation,
        apiCfg: apiCfg
    };
};

var fetchRelatedContinuation = function (token, apiCfg) {
    var payload = {
        context: buildInnertubeContext(apiCfg),
        continuation: token
    };
    var response = callInnertube("/youtubei/v1/next", payload, apiCfg);
    var items = extractContinuationItems(response);
    var videos = normalizeVideoItems(collectVideos(items), "");

    return {
        items: dedupeByVideoId(videos),
        continuation: extractContinuationToken(items)
    };
};

var fetchCommentsContinuation = function (token, apiCfg) {
    var payload = {
        context: buildInnertubeContext(apiCfg),
        continuation: token
    };
    var response = callInnertube("/youtubei/v1/next", payload, apiCfg);
    var items = extractContinuationItems(response);

    return {
        comments: parseComments(items),
        continuation: extractContinuationToken(items)
    };
};

var callInnertube = function (path, body, apiCfg) {
    var cfg = apiCfg || defaultConfig();
    var url = YT_ORIGIN + path + "?key=" + encodeURIComponent(cfg.apiKey || DEFAULT_API_KEY);
    var response = fetch(url, {
        method: "POST",
        bypass: SYNURA.bypass,
        followRedirects: true,
        headers: {
            "Content-Type": "application/json",
            "Accept-Language": resolveAcceptLanguage(cfg)
        },
        body: JSON.stringify(body || {})
    });

    if (!response || !response.ok) {
        throw new Error("HTTP " + getNumber(response && response.status) + " from " + path);
    }
    return response.json() || {};
};

var fetchText = function (url) {
    var current = getString(url);
    var localeCfg = defaultConfig();
    var response = null;
    var maxRedirects = 4;

    for (var i = 0; i <= maxRedirects; i++) {
        response = fetch(current, {
            method: "GET",
            bypass: SYNURA.bypass,
            followRedirects: true,
            redirect: "follow",
            headers: {
                "Accept-Language": resolveAcceptLanguage(localeCfg)
            }
        });

        if (!response) {
            break;
        }

        var status = getNumber(response.status);
        if (status < 300 || status >= 400) {
            break;
        }

        var location = getHeaderValue(response.headers, "location");
        if (!location) {
            break;
        }

        current = resolveURL(current, location);
    }

    if (!response || !response.ok) {
        throw new Error("HTTP " + getNumber(response && response.status) + " from " + url);
    }
    return response.text();
};

var parseWatchMetadata = function (initialData, fallbackVideoId) {
    var out = {
        title: "YouTube",
        author: "",
        date: "",
        viewCount: "",
        description: "",
        metadataLine: "",
        channelMemo: "",
        channelUrl: "",
        channelId: "",
        channelTitle: "",
        channelAvatar: "",
        thumbnail: thumbnailFromVideoId(fallbackVideoId)
    };

    var results = getIn(initialData, ["contents", "singleColumnWatchNextResults", "results", "results", "contents"], []);
    var slimMeta = findRenderer(results, "slimVideoMetadataSectionRenderer");

    if (slimMeta) {
        var info = getIn(slimMeta, ["contents", 0, "slimVideoInformationRenderer"], {});
        var owner = getIn(slimMeta, ["contents", 1, "slimOwnerRenderer"], {});

        var title = textOf(info.title);
        var subtitle = textOf(info.expandedSubtitle) || textOf(info.collapsedSubtitle);

        out.title = title || out.title;
        out.metadataLine = subtitle;

        var channel = textOf(owner.title) || textOf(owner.channelName);
        var channelMemo = textOf(owner.expandedSubtitle) || textOf(owner.collapsedSubtitle);
        out.author = channel;
        out.channelTitle = channel;
        out.channelMemo = channelMemo;
        out.channelAvatar = thumbnailFrom(owner.thumbnail);

        var channelId = getIn(owner, ["navigationEndpoint", "browseEndpoint", "browseId"], "");
        if (channelId) {
            out.channelId = getString(channelId);
        }

        var channelURLPath = getIn(owner, ["navigationEndpoint", "commandMetadata", "webCommandMetadata", "url"], "");
        if (channelURLPath) {
            out.channelUrl = toAbsoluteURL(channelURLPath);
        } else {
            out.channelUrl = getString(owner.channelUrl);
        }
        if (!out.channelUrl && out.channelId) {
            out.channelUrl = toAbsoluteURL("/channel/" + out.channelId);
        }

        var videoId = getString(slimMeta.videoId) || fallbackVideoId;
        out.thumbnail = thumbnailFromVideoId(videoId);

        var parsed = splitMetadataLine(subtitle);
        out.viewCount = parsed.viewCount;
        out.date = parsed.date;
    }

    var descriptionPanel = findDescriptionPanel(initialData);
    if (descriptionPanel) {
        out.description = descriptionPanel;
    }

    return out;
};

var parseChannelMetadata = function (initialData, fallbackUrl, fallbackChannelId) {
    var out = {
        channelUrl: normalizeChannelUrl(fallbackUrl),
        channelId: getString(fallbackChannelId),
        channelTitle: "",
        channelAvatar: "",
        channelMemo: ""
    };

    var meta = findRenderer(initialData, "channelMetadataRenderer");
    if (meta) {
        out.channelTitle = textOf(meta.title) || out.channelTitle;
        out.channelId = getString(meta.externalId) || out.channelId;
        out.channelAvatar = thumbnailFrom(meta.avatar) || out.channelAvatar;
        if (meta.vanityChannelUrl) {
            out.channelUrl = normalizeChannelUrl(meta.vanityChannelUrl);
        }
    }

    var header = findRenderer(initialData, "c4TabbedHeaderRenderer");
    if (header) {
        out.channelTitle = textOf(header.title) || out.channelTitle;
        out.channelId = getString(header.channelId) || out.channelId;
        out.channelAvatar = thumbnailFrom(header.avatar) || out.channelAvatar;
        out.channelMemo = textOf(header.subscriberCountText) || out.channelMemo;

        var channelPath = getString(getIn(header, ["navigationEndpoint", "commandMetadata", "webCommandMetadata", "url"], ""));
        if (!channelPath) {
            channelPath = getString(getIn(header, ["navigationEndpoint", "browseEndpoint", "canonicalBaseUrl"], ""));
        }
        if (!channelPath) {
            var handle = textOf(header.channelHandleText);
            if (handle && handle[0] === "@") {
                channelPath = "/" + handle;
            }
        }
        if (channelPath) {
            out.channelUrl = normalizeChannelUrl(channelPath);
        }
    }

    if (!out.channelUrl && out.channelId) {
        out.channelUrl = normalizeChannelUrl("/channel/" + out.channelId);
    }
    out.channelTitle = out.channelTitle || "Channel";
    return out;
};

var findDescriptionPanel = function (initialData) {
    var panels = getIn(initialData, ["engagementPanels"], []);
    for (var i = 0; i < panels.length; i++) {
        var panel = getIn(panels, [i, "engagementPanelSectionListRenderer"], {});
        if (panel.panelIdentifier !== "video-description-ep-identifier") {
            continue;
        }
        var items = getIn(panel, ["content", "structuredDescriptionContentRenderer", "items"], []);
        for (var j = 0; j < items.length; j++) {
            var body = getIn(items, [j, "expandableVideoDescriptionBodyRenderer"], {});
            var text = textOf(body.attributedDescriptionBodyText) || textOf(body.descriptionBodyText);
            text = trimTo(text, 2000);
            if (text) {
                return text;
            }
        }
    }
    return "";
};

var splitMetadataLine = function (line) {
    var text = getString(line);
    if (!text) {
        return { viewCount: "", date: "" };
    }

    var parts = text.split("\u00b7").map(function (item) {
        return item.trim();
    }).filter(function (item) {
        return item.length > 0;
    });

    if (parts.length === 0) {
        return { viewCount: "", date: "" };
    }

    if (parts.length === 1) {
        return { viewCount: parts[0], date: "" };
    }

    return {
        viewCount: parts[0],
        date: parts[1]
    };
};

var extractCommentsContinuation = function (initialData) {
    var panels = getIn(initialData, ["engagementPanels"], []);
    for (var i = 0; i < panels.length; i++) {
        var panel = getIn(panels, [i, "engagementPanelSectionListRenderer"], {});
        if (panel.panelIdentifier !== "engagement-panel-comments-section") {
            continue;
        }
        var contents = getIn(panel, ["content", "sectionListRenderer", "contents"], []);
        var token = extractContinuationToken(contents);
        if (token) {
            return token;
        }
    }
    return "";
};

var parseComments = function (items) {
    var threads = [];
    collectRendererInstances(items, "commentThreadRenderer", threads);

    var out = [];
    for (var i = 0; i < threads.length; i++) {
        var root = getIn(threads, [i, "comment", "commentRenderer"], null);
        if (root) {
            out.push(toCommentItem(root, 0));
        }

        var replies = getIn(threads, [i, "replies", "commentRepliesRenderer", "contents"], []);
        var replyRenderers = [];
        collectRendererInstances(replies, "commentRenderer", replyRenderers);
        for (var j = 0; j < replyRenderers.length; j++) {
            out.push(toCommentItem(replyRenderers[j], 1));
        }
    }
    return out;
};

var toCommentItem = function (renderer, level) {
    return {
        link: "https://www.youtube.com/comment/" + getString(renderer.commentId),
        author: textOf(renderer.authorText) || "YouTube User",
        avatar: thumbnailFrom(renderer.authorThumbnail),
        date: textOf(renderer.publishedTimeText),
        likeCount: textOf(renderer.voteCount),
        content: trimTo(textOf(renderer.contentText), 1200),
        level: level || 0
    };
};

var normalizeVideoItems = function (renderers, query) {
    var items = [];

    for (var i = 0; i < renderers.length; i++) {
        var item = toVideoItem(renderers[i], query);
        if (!item || !item.videoId) {
            continue;
        }
        items.push(item);
    }

    return dedupeByVideoId(items);
};

var toVideoItem = function (renderer) {
    var videoId = getString(renderer.videoId) || getIn(renderer, ["navigationEndpoint", "watchEndpoint", "videoId"], "");
    if (!videoId) {
        return null;
    }

    var channel = extractChannelInfoFromVideoRenderer(renderer);
    var title = textOf(renderer.title) || textOf(renderer.headline) || "Untitled";
    var author = textOf(renderer.shortBylineText) || textOf(renderer.longBylineText) || textOf(renderer.ownerText) || channel.channelTitle;
    var viewCount = textOf(renderer.viewCountText) || textOf(renderer.shortViewCountText);
    var date = textOf(renderer.publishedTimeText);
    var duration = textOf(renderer.lengthText);

    var metaParts = [];
    if (duration) metaParts.push(duration);
    if (viewCount) metaParts.push(viewCount);
    if (date) metaParts.push(date);

    return {
        link: watchURL(videoId),
        videoId: videoId,
        title: title,
        author: author,
        memo: metaParts.join(" - "),
        date: date,
        viewCount: viewCount,
        mediaUrl: thumbnailFrom(renderer.thumbnail) || thumbnailFromVideoId(videoId),
        mediaType: "image",
        types: ["video"],
        menus: [ITEM_MENU_OPEN_BROWSER, ITEM_MENU_OPEN_VIDEO, ITEM_MENU_OPEN_CHANNEL],
        channelUrl: channel.channelUrl,
        channelId: channel.channelId,
        channelTitle: channel.channelTitle || author,
        channelAvatar: channel.channelAvatar,
        channelMemo: channel.channelMemo
    };
};

var extractChannelInfoFromVideoRenderer = function (renderer) {
    var nav = getIn(renderer, ["shortBylineText", "runs", 0, "navigationEndpoint"], null);
    if (!nav) {
        nav = getIn(renderer, ["longBylineText", "runs", 0, "navigationEndpoint"], null);
    }
    if (!nav) {
        nav = getIn(renderer, ["ownerText", "runs", 0, "navigationEndpoint"], null);
    }

    var channelId = getString(getIn(nav, ["browseEndpoint", "browseId"], ""));
    var channelPath = getString(getIn(nav, ["commandMetadata", "webCommandMetadata", "url"], ""));
    if (!channelPath) {
        channelPath = getString(getIn(nav, ["browseEndpoint", "canonicalBaseUrl"], ""));
    }
    if (!channelPath && channelId) {
        channelPath = "/channel/" + channelId;
    }

    var channelTitle = textOf(renderer.shortBylineText) || textOf(renderer.longBylineText) || textOf(renderer.ownerText);
    var channelAvatar =
        thumbnailFrom(getIn(renderer, ["channelThumbnailSupportedRenderers", "channelThumbnailWithLinkRenderer", "thumbnail"], {})) ||
        thumbnailFrom(getIn(renderer, ["channelThumbnail"], {}));

    return {
        channelUrl: normalizeChannelUrl(channelPath),
        channelId: channelId,
        channelTitle: channelTitle,
        channelAvatar: channelAvatar,
        channelMemo: ""
    };
};

var collectVideos = function (node) {
    var renderers = [];
    collectRendererInstances(node, "videoWithContextRenderer", renderers);
    collectRendererInstances(node, "compactVideoRenderer", renderers);
    collectRendererInstances(node, "gridVideoRenderer", renderers);
    collectRendererInstances(node, "endScreenVideoRenderer", renderers);
    return renderers;
};

var collectRendererInstances = function (node, rendererName, out) {
    if (!node) {
        return;
    }

    if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
            collectRendererInstances(node[i], rendererName, out);
        }
        return;
    }

    if (typeof node !== "object") {
        return;
    }

    if (node[rendererName]) {
        out.push(node[rendererName]);
    }

    for (var key in node) {
        if (Object.prototype.hasOwnProperty.call(node, key)) {
            collectRendererInstances(node[key], rendererName, out);
        }
    }
};

var extractContinuationItems = function (response) {
    var out = [];
    var buckets = [];

    if (Array.isArray(response.onResponseReceivedCommands)) {
        buckets = buckets.concat(response.onResponseReceivedCommands);
    }
    if (Array.isArray(response.onResponseReceivedActions)) {
        buckets = buckets.concat(response.onResponseReceivedActions);
    }
    if (Array.isArray(response.onResponseReceivedEndpoints)) {
        buckets = buckets.concat(response.onResponseReceivedEndpoints);
    }

    for (var i = 0; i < buckets.length; i++) {
        var item = buckets[i] || {};
        var append = getIn(item, ["appendContinuationItemsAction", "continuationItems"], null);
        var reload = getIn(item, ["reloadContinuationItemsCommand", "continuationItems"], null);
        if (Array.isArray(append)) {
            out = out.concat(append);
        }
        if (Array.isArray(reload)) {
            out = out.concat(reload);
        }
    }

    return out;
};

var extractContinuationToken = function (node) {
    var continuations = [];
    collectRendererInstances(node, "continuationItemRenderer", continuations);
    for (var i = 0; i < continuations.length; i++) {
        var token = getIn(continuations, [i, "continuationEndpoint", "continuationCommand", "token"], "");
        if (token) {
            return token;
        }
    }
    return "";
};

var findRenderer = function (node, rendererName) {
    var list = [];
    collectRendererInstances(node, rendererName, list);
    return list.length ? list[0] : null;
};

var extractInnertubeConfig = function (html) {
    var extractedApiKey = extractQuotedConfig(html, "INNERTUBE_API_KEY");
    var cfg = {
        apiKey: resolveApiKey(extractedApiKey),
        clientName: extractQuotedConfig(html, "INNERTUBE_CLIENT_NAME") || DEFAULT_CLIENT_NAME,
        clientVersion: extractQuotedConfig(html, "INNERTUBE_CLIENT_VERSION") || DEFAULT_CLIENT_VERSION,
        hl: extractQuotedConfig(html, "HL") || DEFAULT_HL,
        gl: extractQuotedConfig(html, "GL") || DEFAULT_GL
    };
    applyLocaleToConfig(cfg);
    return cfg;
};

var extractQuotedConfig = function (html, key) {
    if (!html || !key) {
        return "";
    }
    var pattern = new RegExp('"' + key + '":"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"');
    var match = html.match(pattern);
    if (!match || !match[1]) {
        return "";
    }

    return decodeCommonEscapes(match[1]);
};

var defaultConfig = function () {
    var cfg = {
        apiKey: resolveApiKey(""),
        clientName: DEFAULT_CLIENT_NAME,
        clientVersion: DEFAULT_CLIENT_VERSION,
        hl: DEFAULT_HL,
        gl: DEFAULT_GL
    };
    applyLocaleToConfig(cfg);
    return cfg;
};

var buildInnertubeContext = function (apiCfg) {
    var cfg = apiCfg || defaultConfig();
    return {
        client: {
            hl: cfg.hl || DEFAULT_HL,
            gl: cfg.gl || DEFAULT_GL,
            clientName: cfg.clientName || DEFAULT_CLIENT_NAME,
            clientVersion: cfg.clientVersion || DEFAULT_CLIENT_VERSION,
            platform: "MOBILE"
        }
    };
};

var extractJSONVar = function (html, varName) {
    var marker = "var " + varName + " = ";
    var start = html.indexOf(marker);
    if (start < 0) {
        return null;
    }
    start += marker.length;

    while (start < html.length && isSpaceChar(html.charCodeAt(start))) {
        start++;
    }

    if (html[start] === "'") {
        var str = readSingleQuotedString(html, start);
        if (!str) {
            return null;
        }

        var decodedJS = decodeCommonEscapes(str.value);
        var utf8Ready = latin1ToUtf8(decodedJS);
        try {
            return JSON.parse(utf8Ready);
        } catch (e) {
            try {
                return JSON.parse(decodedJS);
            } catch (e2) {
                return null;
            }
        }
    }

    if (html[start] === "{") {
        var end = findMatchingBrace(html, start);
        if (end > start) {
            var jsonText = html.slice(start, end + 1);
            try {
                return JSON.parse(jsonText);
            } catch (e3) {
                return null;
            }
        }
    }

    return null;
};

var readSingleQuotedString = function (input, quoteIndex) {
    var i = quoteIndex + 1;
    var out = [];
    var escaped = false;

    while (i < input.length) {
        var ch = input[i];
        if (escaped) {
            out.push("\\" + ch);
            escaped = false;
            i++;
            continue;
        }
        if (ch === "\\") {
            escaped = true;
            i++;
            continue;
        }
        if (ch === "'") {
            return {
                value: out.join(""),
                endIndex: i
            };
        }
        out.push(ch);
        i++;
    }

    return null;
};

var decodeCommonEscapes = function (input) {
    var out = [];

    for (var i = 0; i < input.length; i++) {
        var ch = input[i];
        if (ch !== "\\") {
            out.push(ch);
            continue;
        }

        if (i + 1 >= input.length) {
            break;
        }

        var next = input[++i];
        if (next === "x") {
            var hex2 = input.slice(i + 1, i + 3);
            if (/^[0-9a-fA-F]{2}$/.test(hex2)) {
                out.push(String.fromCharCode(parseInt(hex2, 16)));
                i += 2;
            } else {
                out.push("x");
            }
            continue;
        }

        if (next === "u") {
            var hex4 = input.slice(i + 1, i + 5);
            if (/^[0-9a-fA-F]{4}$/.test(hex4)) {
                out.push(String.fromCharCode(parseInt(hex4, 16)));
                i += 4;
            } else {
                out.push("u");
            }
            continue;
        }

        if (next === "n") { out.push("\n"); continue; }
        if (next === "r") { out.push("\r"); continue; }
        if (next === "t") { out.push("\t"); continue; }
        if (next === "b") { out.push("\b"); continue; }
        if (next === "f") { out.push("\f"); continue; }
        if (next === "v") { out.push("\v"); continue; }
        if (next === "\\") { out.push("\\"); continue; }
        if (next === "\"") { out.push("\""); continue; }
        if (next === "'") { out.push("'"); continue; }
        if (next === "/") { out.push("/"); continue; }

        out.push(next);
    }

    return out.join("");
};

var latin1ToUtf8 = function (input) {
    var bytes = [];

    for (var i = 0; i < input.length; i++) {
        var code = input.charCodeAt(i);
        if (code <= 0xFF) {
            bytes.push(code);
        } else if (code <= 0x7FF) {
            bytes.push(0xC0 | (code >> 6));
            bytes.push(0x80 | (code & 0x3F));
        } else {
            bytes.push(0xE0 | (code >> 12));
            bytes.push(0x80 | ((code >> 6) & 0x3F));
            bytes.push(0x80 | (code & 0x3F));
        }
    }

    return utf8BytesToString(bytes);
};

var utf8BytesToString = function (bytes) {
    var out = [];

    for (var i = 0; i < bytes.length;) {
        var b0 = bytes[i];

        if (b0 < 0x80) {
            out.push(String.fromCharCode(b0));
            i++;
            continue;
        }

        if ((b0 & 0xE0) === 0xC0 && i + 1 < bytes.length) {
            var c2 = bytes[i + 1];
            var cp2 = ((b0 & 0x1F) << 6) | (c2 & 0x3F);
            out.push(String.fromCharCode(cp2));
            i += 2;
            continue;
        }

        if ((b0 & 0xF0) === 0xE0 && i + 2 < bytes.length) {
            var c3_1 = bytes[i + 1];
            var c3_2 = bytes[i + 2];
            var cp3 = ((b0 & 0x0F) << 12) | ((c3_1 & 0x3F) << 6) | (c3_2 & 0x3F);
            out.push(String.fromCharCode(cp3));
            i += 3;
            continue;
        }

        if ((b0 & 0xF8) === 0xF0 && i + 3 < bytes.length) {
            var c4_1 = bytes[i + 1];
            var c4_2 = bytes[i + 2];
            var c4_3 = bytes[i + 3];
            var cp4 = ((b0 & 0x07) << 18) | ((c4_1 & 0x3F) << 12) | ((c4_2 & 0x3F) << 6) | (c4_3 & 0x3F);
            cp4 -= 0x10000;
            out.push(String.fromCharCode(0xD800 + ((cp4 >> 10) & 0x3FF)));
            out.push(String.fromCharCode(0xDC00 + (cp4 & 0x3FF)));
            i += 4;
            continue;
        }

        out.push(String.fromCharCode(b0));
        i++;
    }

    return out.join("");
};

var findMatchingBrace = function (text, start) {
    var depth = 0;
    var inString = false;
    var quote = "";
    var escaped = false;

    for (var i = start; i < text.length; i++) {
        var ch = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch === "\\") {
                escaped = true;
                continue;
            }
            if (ch === quote) {
                inString = false;
            }
            continue;
        }

        if (ch === "\"" || ch === "'") {
            inString = true;
            quote = ch;
            continue;
        }

        if (ch === "{") {
            depth++;
            continue;
        }

        if (ch === "}") {
            depth--;
            if (depth === 0) {
                return i;
            }
        }
    }

    return -1;
};

var isSpaceChar = function (code) {
    return code === 9 || code === 10 || code === 13 || code === 32;
};

var dedupeByVideoId = function (items) {
    var seen = {};
    var out = [];
    for (var i = 0; i < items.length; i++) {
        var id = getString(items[i] && items[i].videoId);
        if (!id || seen[id]) {
            continue;
        }
        seen[id] = true;
        out.push(items[i]);
    }
    return out;
};

var textOf = function (node) {
    if (node === null || node === undefined) {
        return "";
    }

    if (typeof node === "string") {
        return node;
    }

    if (typeof node === "number") {
        return String(node);
    }

    if (Array.isArray(node)) {
        var arr = [];
        for (var i = 0; i < node.length; i++) {
            var part = textOf(node[i]);
            if (part) {
                arr.push(part);
            }
        }
        return arr.join("");
    }

    if (typeof node === "object") {
        if (typeof node.simpleText === "string") {
            return node.simpleText;
        }
        if (typeof node.content === "string") {
            return node.content;
        }
        if (Array.isArray(node.runs)) {
            var runParts = [];
            for (var j = 0; j < node.runs.length; j++) {
                var text = textOf(node.runs[j]);
                if (text) {
                    runParts.push(text);
                }
            }
            return runParts.join("");
        }
        if (typeof node.text === "string") {
            return node.text;
        }
        var acc = getIn(node, ["accessibility", "accessibilityData", "label"], "");
        if (acc) {
            return acc;
        }
    }

    return "";
};

var thumbnailFrom = function (node) {
    var thumbs = getIn(node, ["thumbnails"], []);
    if (!Array.isArray(thumbs) || !thumbs.length) {
        return "";
    }
    var best = thumbs[thumbs.length - 1] || thumbs[0] || {};
    var url = getString(best.url);
    if (url.indexOf("//") === 0) {
        return "https:" + url;
    }
    return url;
};

var thumbnailFromVideoId = function (videoId) {
    if (!videoId) {
        return "";
    }
    return "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
};

var parseVideoId = function (url) {
    var input = getString(url);
    if (!input) {
        return "";
    }

    var direct = input.match(/^[a-zA-Z0-9_-]{11}$/);
    if (direct) {
        return direct[0];
    }

    var watchMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
        return watchMatch[1];
    }

    var shortMatch = input.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && shortMatch[1]) {
        return shortMatch[1];
    }

    var youtuMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (youtuMatch && youtuMatch[1]) {
        return youtuMatch[1];
    }

    return "";
};

var watchURL = function (videoId) {
    return YT_ORIGIN + "/watch?v=" + encodeURIComponent(videoId);
};

var appendQueryParam = function (url, key, value) {
    var out = getString(url);
    if (!out || !key) {
        return out;
    }
    var encodedValue = getString(value);
    if (!encodedValue) {
        return out;
    }
    var separator = out.indexOf("?") >= 0 ? "&" : "?";
    return out + separator + encodeURIComponent(key) + "=" + encodeURIComponent(encodedValue);
};

var localizedURL = function (url, cfg) {
    var target = getString(url);
    if (!target) {
        return target;
    }
    var locale = cfg || defaultConfig();
    target = appendQueryParam(target, "hl", locale.hl || DEFAULT_HL);
    target = appendQueryParam(target, "gl", locale.gl || DEFAULT_GL);
    target = appendQueryParam(target, "persist_hl", "1");
    target = appendQueryParam(target, "persist_gl", "1");
    return target;
};

var normalizeChannelUrl = function (channelUrl) {
    var absolute = toAbsoluteURL(channelUrl);
    if (!absolute) {
        return "";
    }

    var clean = absolute.split("#")[0].split("?")[0];
    clean = clean
        .replace(/^https?:\/\/(?:www\.)?youtube\.com/i, YT_ORIGIN)
        .replace(/^https?:\/\/m\.youtube\.com/i, YT_ORIGIN);
    while (clean.length > YT_ORIGIN.length + 1 && clean[clean.length - 1] === "/") {
        clean = clean.slice(0, -1);
    }
    return clean;
};

var stripChannelTabSuffix = function (channelUrl) {
    var normalized = normalizeChannelUrl(channelUrl);
    if (!normalized) {
        return "";
    }
    return normalized.replace(/\/(videos|streams|shorts|live)$/i, "");
};

var toChannelTabURL = function (channelUrl, tabName) {
    var base = stripChannelTabSuffix(channelUrl);
    var tab = getString(tabName).toLowerCase();
    if (!base) {
        return "";
    }
    if (!tab) {
        return base;
    }
    return base + "/" + tab;
};

var toChannelSearchURL = function (channelUrl, query) {
    var base = stripChannelTabSuffix(channelUrl);
    var q = cleanQuery(query);
    if (!base) {
        return "";
    }
    if (!q) {
        return base;
    }
    return base + "/search?query=" + encodeURIComponent(q);
};

var toAbsoluteURL = function (pathOrURL) {
    var value = getString(pathOrURL);
    if (!value) {
        return "";
    }
    if (value.indexOf("http://") === 0 || value.indexOf("https://") === 0) {
        return value;
    }
    if (value.indexOf("//") === 0) {
        return "https:" + value;
    }
    if (value[0] !== "/") {
        value = "/" + value;
    }
    return YT_ORIGIN + value;
};

var getHeaderValue = function (headers, name) {
    if (!headers || !name) {
        return "";
    }

    var key = getString(name).toLowerCase();

    try {
        if (typeof headers.get === "function") {
            return getString(headers.get(name) || headers.get(key));
        }
    } catch (e) {
    }

    return getString(headers[name] || headers[key]);
};

var resolveURL = function (baseURL, location) {
    var base = getString(baseURL);
    var target = getString(location);

    if (!target) {
        return base;
    }

    if (target.indexOf("http://") === 0 || target.indexOf("https://") === 0) {
        return target;
    }

    if (target.indexOf("//") === 0) {
        return "https:" + target;
    }

    if (target[0] === "/") {
        var origin = YT_ORIGIN;
        var hostMatch = base.match(/^https?:\/\/[^/]+/);
        if (hostMatch && hostMatch[0]) {
            origin = hostMatch[0].replace(/^http:/, "https:");
        }
        return origin + target;
    }

    var idx = base.lastIndexOf("/");
    if (idx < 0) {
        return YT_ORIGIN + "/" + target;
    }

    return base.slice(0, idx + 1) + target;
};

var getIn = function (obj, path, fallback) {
    var cur = obj;
    for (var i = 0; i < path.length; i++) {
        if (cur === null || cur === undefined) {
            return fallback;
        }
        cur = cur[path[i]];
    }
    return cur === undefined ? fallback : cur;
};

var trimTo = function (value, maxLen) {
    var text = getString(value);
    if (text.length <= maxLen) {
        return text;
    }
    return text.slice(0, maxLen - 3) + "...";
};

var cleanQuery = function (value) {
    return getString(value).replace(/\s+/g, " ").trim();
};

var showSnackbar = function (viewId, message) {
    synura.update(viewId, {
        models: {
            snackbar: message
        }
    });
};

var openBrowser = function (url, title) {
    synura.open({
        view: "/views/browser",
        styles: {
            title: title || "Browser"
        },
        models: {
            url: url
        }
    });
};

var makeStarredChannelKey = function (channelUrl, channelId) {
    var id = getString(channelId) || extractChannelIdFromUrl(channelUrl);
    if (id) {
        return "id:" + id;
    }
    var url = normalizeChannelUrl(channelUrl);
    if (!url) {
        return "";
    }
    return "url:" + url.toLowerCase();
};

var extractChannelIdFromUrl = function (channelUrl) {
    var normalized = normalizeChannelUrl(channelUrl);
    if (!normalized) {
        return "";
    }
    var match = normalized.match(/\/channel\/([A-Za-z0-9_-]+)/i);
    if (!match || !match[1]) {
        return "";
    }
    return getString(match[1]);
};

var normalizeStarredIdentity = function (channelUrl, channelId) {
    var normalizedUrl = normalizeChannelUrl(channelUrl);
    var normalizedId = getString(channelId) || extractChannelIdFromUrl(normalizedUrl);
    if (!normalizedUrl && normalizedId) {
        normalizedUrl = normalizeChannelUrl("/channel/" + normalizedId);
    }
    return {
        channelUrl: normalizedUrl,
        channelId: normalizedId
    };
};

var channelsEquivalent = function (leftUrl, leftId, rightUrl, rightId) {
    var left = normalizeStarredIdentity(leftUrl, leftId);
    var right = normalizeStarredIdentity(rightUrl, rightId);
    if (left.channelId && right.channelId && left.channelId === right.channelId) {
        return true;
    }
    if (left.channelUrl && right.channelUrl && left.channelUrl.toLowerCase() === right.channelUrl.toLowerCase()) {
        return true;
    }
    return false;
};

var normalizeChannelTitleKey = function (value) {
    return getString(value).replace(/\s+/g, " ").trim().toLowerCase();
};

var normalizeChannelAvatarKey = function (value) {
    var avatar = getString(value).trim();
    if (!avatar) {
        return "";
    }
    return avatar.split("?")[0].toLowerCase();
};

var channelsLikelySame = function (left, right) {
    var l = left || {};
    var r = right || {};
    if (channelsEquivalent(l.channelUrl, l.channelId, r.channelUrl, r.channelId)) {
        return true;
    }
    var leftTitle = normalizeChannelTitleKey(l.channelTitle);
    var rightTitle = normalizeChannelTitleKey(r.channelTitle);
    if (!leftTitle || !rightTitle || leftTitle !== rightTitle) {
        return false;
    }
    var leftAvatar = normalizeChannelAvatarKey(l.channelAvatar);
    var rightAvatar = normalizeChannelAvatarKey(r.channelAvatar);
    if (leftAvatar && rightAvatar && leftAvatar === rightAvatar) {
        return true;
    }
    return false;
};

var normalizeLanguageCode = function (value) {
    var raw = getString(value).replace(/_/g, "-").trim();
    if (!raw) {
        return "";
    }
    var lower = raw.toLowerCase();
    if (lower === "zh-hans" || lower === "zh-cn") {
        return "zh-CN";
    }
    if (lower === "zh-hant" || lower === "zh-tw") {
        return "zh-TW";
    }

    for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) {
        var item = YOUTUBE_LANGUAGES[i] || {};
        var code = getString(item.code);
        var hl = getString(item.hl);
        if (code.toLowerCase() === lower || hl.toLowerCase() === lower) {
            return code;
        }
    }

    var dash = lower.indexOf("-");
    if (dash > 0) {
        var primary = lower.slice(0, dash);
        for (var j = 0; j < YOUTUBE_LANGUAGES.length; j++) {
            var fallbackCode = getString(YOUTUBE_LANGUAGES[j] && YOUTUBE_LANGUAGES[j].code);
            if (fallbackCode.toLowerCase() === primary) {
                return fallbackCode;
            }
        }
    }

    return "";
};

var findLanguageByCode = function (value) {
    var normalized = normalizeLanguageCode(value);
    if (!normalized) {
        return null;
    }
    for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) {
        if (getString(YOUTUBE_LANGUAGES[i] && YOUTUBE_LANGUAGES[i].code) === normalized) {
            return YOUTUBE_LANGUAGES[i];
        }
    }
    return null;
};

var findLanguageByLabel = function (value) {
    var label = getString(value);
    if (!label) {
        return null;
    }
    for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) {
        if (getString(YOUTUBE_LANGUAGES[i] && YOUTUBE_LANGUAGES[i].label) === label) {
            return YOUTUBE_LANGUAGES[i];
        }
    }
    return null;
};

var getCurrentLanguageSetting = function () {
    var selected = findLanguageByCode(loadLanguageOverride());
    if (selected) {
        return selected;
    }
    return findLanguageByCode(DEFAULT_HL) || YOUTUBE_LANGUAGES[0];
};

var getLanguageOptions = function () {
    var options = [];
    for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) {
        options.push(getString(YOUTUBE_LANGUAGES[i] && YOUTUBE_LANGUAGES[i].label));
    }
    return options;
};

var languageCodeFromOption = function (value) {
    var byLabel = findLanguageByLabel(value);
    if (byLabel) {
        return getString(byLabel.code);
    }
    var byCode = findLanguageByCode(value);
    return byCode ? getString(byCode.code) : "";
};

var sanitizeApiKey = function (value) {
    return getString(value).replace(/\s+/g, "").trim();
};

var loadApiKeyOverride = function () {
    if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.getItem !== "function") {
        return "";
    }
    return sanitizeApiKey(localStorage.getItem(API_KEY_OVERRIDE_STORAGE_KEY));
};

var saveApiKeyOverride = function (apiKey) {
    if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.setItem !== "function") {
        return false;
    }
    var key = sanitizeApiKey(apiKey);
    if (!key) {
        return false;
    }
    try {
        localStorage.setItem(API_KEY_OVERRIDE_STORAGE_KEY, key);
        return true;
    } catch (e) {
        return false;
    }
};

var clearApiKeyOverride = function () {
    if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.removeItem !== "function") {
        return false;
    }
    try {
        localStorage.removeItem(API_KEY_OVERRIDE_STORAGE_KEY);
        return true;
    } catch (e) {
        return false;
    }
};

var loadLanguageOverride = function () {
    if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.getItem !== "function") {
        return "";
    }
    return normalizeLanguageCode(localStorage.getItem(LANGUAGE_OVERRIDE_STORAGE_KEY));
};

var saveLanguageOverride = function (languageCode) {
    if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.setItem !== "function") {
        return false;
    }
    var normalized = normalizeLanguageCode(languageCode);
    if (!normalized) {
        return false;
    }
    try {
        localStorage.setItem(LANGUAGE_OVERRIDE_STORAGE_KEY, normalized);
        return true;
    } catch (e) {
        return false;
    }
};

var clearLanguageOverride = function () {
    if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.removeItem !== "function") {
        return false;
    }
    try {
        localStorage.removeItem(LANGUAGE_OVERRIDE_STORAGE_KEY);
        return true;
    } catch (e) {
        return false;
    }
};

var applyLocaleToConfig = function (cfg) {
    var out = cfg || {};
    var language = getCurrentLanguageSetting();
    out.hl = getString(language && language.hl) || DEFAULT_HL;
    out.gl = getString(language && language.gl) || DEFAULT_GL;
    out.acceptLanguage = getString(language && language.acceptLanguage) || "en-US,en;q=0.9";
    return out;
};

var resolveAcceptLanguage = function (cfg) {
    var value = getString(cfg && cfg.acceptLanguage);
    if (value) {
        return value;
    }
    var language = getCurrentLanguageSetting();
    value = getString(language && language.acceptLanguage);
    return value || "en-US,en;q=0.9";
};

var resolveApiKey = function (candidate) {
    var override = loadApiKeyOverride();
    if (override) {
        return override;
    }
    var parsed = sanitizeApiKey(candidate);
    if (parsed) {
        return parsed;
    }
    return DEFAULT_API_KEY;
};

var normalizeEnabledFlag = function (value) {
    if (value === false || value === 0 || value === "0" || value === "false") {
        return false;
    }
    return true;
};

var loadStarredChannels = function () {
    if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.getItem !== "function") {
        return [];
    }

    var raw = localStorage.getItem(STARRED_CHANNELS_KEY);
    if (!raw) {
        return [];
    }

    var parsed = [];
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        return [];
    }
    if (!Array.isArray(parsed)) {
        return [];
    }

    var out = [];
    var deduped = false;
    for (var i = 0; i < parsed.length; i++) {
        var item = parsed[i] || {};
        var identity = normalizeStarredIdentity(item.channelUrl || item.link || item.url, item.channelId);
        if (!identity.channelUrl && !identity.channelId) {
            continue;
        }
        var duplicateIndex = -1;
        for (var j = 0; j < out.length; j++) {
            if (channelsLikelySame({
                channelUrl: identity.channelUrl,
                channelId: identity.channelId,
                channelTitle: getString(item.channelTitle || item.title),
                channelAvatar: getString(item.channelAvatar || item.avatar)
            }, out[j])) {
                duplicateIndex = j;
                break;
            }
        }

        var next = {
            channelUrl: identity.channelUrl,
            channelId: identity.channelId,
            channelTitle: getString(item.channelTitle || item.title),
            channelAvatar: getString(item.channelAvatar || item.avatar),
            channelMemo: getString(item.channelMemo || item.memo),
            savedAt: getNumber(item.savedAt) || 0,
            enabled: normalizeEnabledFlag(item.enabled)
        };

        if (duplicateIndex < 0) {
            out.push(next);
            continue;
        }

        deduped = true;
        var prev = out[duplicateIndex] || {};
        var useNext = getNumber(next.savedAt) >= getNumber(prev.savedAt);
        var newer = useNext ? next : prev;
        var older = useNext ? prev : next;
        out[duplicateIndex] = {
            channelUrl: newer.channelUrl || older.channelUrl,
            channelId: newer.channelId || older.channelId,
            channelTitle: newer.channelTitle || older.channelTitle,
            channelAvatar: newer.channelAvatar || older.channelAvatar,
            channelMemo: newer.channelMemo || older.channelMemo,
            savedAt: Math.max(getNumber(prev.savedAt), getNumber(next.savedAt)),
            enabled: normalizeEnabledFlag(newer.enabled)
        };
    }

    if (deduped) {
        saveStarredChannels(out);
    }
    return out;
};

var saveStarredChannels = function (channels) {
    if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.setItem !== "function") {
        return false;
    }
    try {
        localStorage.setItem(STARRED_CHANNELS_KEY, JSON.stringify(channels || []));
        return true;
    } catch (e) {
        return false;
    }
};

var isStarredChannel = function (channelUrl, channelId, channelTitle, channelAvatar) {
    var identity = normalizeStarredIdentity(channelUrl, channelId);
    if (!identity.channelUrl && !identity.channelId) {
        return false;
    }
    var probe = {
        channelUrl: identity.channelUrl,
        channelId: identity.channelId,
        channelTitle: getString(channelTitle),
        channelAvatar: getString(channelAvatar)
    };
    var channels = loadStarredChannels();
    for (var i = 0; i < channels.length; i++) {
        if (channelsLikelySame(probe, channels[i])) {
            return true;
        }
    }
    return false;
};

var upsertStarredChannel = function (channel) {
    var identity = normalizeStarredIdentity(channel && channel.channelUrl, channel && channel.channelId);
    var normalizedUrl = identity.channelUrl;
    var channelId = identity.channelId;
    var hasEnabledInput = !!(channel && channel.enabled !== undefined);
    var requestedEnabled = normalizeEnabledFlag(channel && channel.enabled);
    if (!normalizedUrl && !channelId) {
        return false;
    }

    var channels = loadStarredChannels();
    var index = -1;
    for (var i = 0; i < channels.length; i++) {
        if (channelsLikelySame({
            channelUrl: normalizedUrl,
            channelId: channelId,
            channelTitle: getString(channel && channel.channelTitle),
            channelAvatar: getString(channel && channel.channelAvatar)
        }, channels[i])) {
            index = i;
            break;
        }
    }

    var now = Date.now();
    var next = {
        channelUrl: normalizedUrl,
        channelId: channelId,
        channelTitle: getString(channel && channel.channelTitle),
        channelAvatar: getString(channel && channel.channelAvatar),
        channelMemo: getString(channel && channel.channelMemo),
        savedAt: now,
        enabled: hasEnabledInput ? requestedEnabled : true
    };

    if (index < 0) {
        channels.unshift(next);
        saveStarredChannels(channels);
        return true;
    }

    var prev = channels[index] || {};
    var changed =
        getString(prev.channelTitle) !== next.channelTitle ||
        getString(prev.channelAvatar) !== next.channelAvatar ||
        getString(prev.channelMemo) !== next.channelMemo ||
        getString(prev.channelUrl) !== next.channelUrl ||
        getString(prev.channelId) !== next.channelId ||
        normalizeEnabledFlag(prev.enabled) !== (hasEnabledInput ? requestedEnabled : normalizeEnabledFlag(prev.enabled));

    channels[index] = {
        channelUrl: next.channelUrl,
        channelId: next.channelId,
        channelTitle: next.channelTitle || prev.channelTitle,
        channelAvatar: next.channelAvatar || prev.channelAvatar,
        channelMemo: next.channelMemo || prev.channelMemo,
        savedAt: getNumber(prev.savedAt) || now,
        enabled: hasEnabledInput ? requestedEnabled : normalizeEnabledFlag(prev.enabled)
    };
    if (changed) {
        saveStarredChannels(channels);
    }
    return changed;
};

var removeStarredChannel = function (channelUrl, channelId, channelTitle, channelAvatar) {
    var identity = normalizeStarredIdentity(channelUrl, channelId);
    if (!identity.channelUrl && !identity.channelId) {
        return false;
    }
    var probe = {
        channelUrl: identity.channelUrl,
        channelId: identity.channelId,
        channelTitle: getString(channelTitle),
        channelAvatar: getString(channelAvatar)
    };
    var channels = loadStarredChannels();
    var filtered = [];
    var removed = false;
    for (var i = 0; i < channels.length; i++) {
        if (channelsLikelySame(probe, channels[i])) {
            removed = true;
            continue;
        }
        filtered.push(channels[i]);
    }
    if (removed) {
        saveStarredChannels(filtered);
    }
    return removed;
};

var starredChannelsToListItems = function (channels) {
    var list = Array.isArray(channels) ? channels.slice() : [];
    list.sort(function (a, b) {
        return getNumber(b && b.savedAt) - getNumber(a && a.savedAt);
    });

    var items = [];
    for (var i = 0; i < list.length; i++) {
        var channel = list[i] || {};
        var channelUrl = normalizeChannelUrl(channel.channelUrl);
        if (!channelUrl && channel.channelId) {
            channelUrl = normalizeChannelUrl("/channel/" + channel.channelId);
        }
        if (!channelUrl) {
            continue;
        }
        if (normalizeEnabledFlag(channel.enabled) === false) {
            continue;
        }

        items.push({
            link: channelUrl,
            channelUrl: channelUrl,
            channelId: getString(channel.channelId),
            channelTitle: getString(channel.channelTitle),
            channelAvatar: getString(channel.channelAvatar),
            channelMemo: getString(channel.channelMemo),
            title: getString(channel.channelTitle) || channelUrl,
            memo: getString(channel.channelMemo) || "Saved channel",
            mediaUrl: getString(channel.channelAvatar),
            mediaType: "image",
            types: ["channel", "starred"],
            menus: [ITEM_MENU_OPEN_BROWSER, ITEM_MENU_REMOVE_BOOKMARK]
        });
    }

    return items;
};

var cloneObject = function (obj) {
    if (!obj || typeof obj !== "object") {
        return {};
    }
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        return {
            apiKey: obj.apiKey,
            clientName: obj.clientName,
            clientVersion: obj.clientVersion,
            hl: obj.hl,
            gl: obj.gl
        };
    }
};

var getString = function (value) {
    if (value === null || value === undefined) {
        return "";
    }
    return String(value);
};

var getNumber = function (value) {
    var n = Number(value);
    return isNaN(n) ? 0 : n;
};
