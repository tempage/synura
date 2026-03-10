var SYNURA = {
  domain: "m.youtube.com",
  name: "test_youtube",
  author: "Synura Team",
  description: "Unofficial YouTube extension with search, comments, and related videos.",
  version: .1,
  api: 0,
  license: "Apache-2.0",
  locale: "en_US",
  bypass: "chrome/android",
  deeplink: !0,
  tags: [ "video", "streaming", "search", "media" ],
  get main() {
    return handler;
  }
}, DEFAULT_QUERY = "technology", DEFAULT_HL = "en", DEFAULT_GL = "US", DEFAULT_CLIENT_NAME = "MWEB", DEFAULT_CLIENT_VERSION = "2.20260304.01.00", DEFAULT_API_KEY = "", YT_ORIGIN = "https://" + SYNURA.domain, QUICK_QUERIES = [ {
  label: "Trending",
  query: "trending videos"
}, {
  label: "Music",
  query: "latest music videos"
}, {
  label: "Gaming",
  query: "gaming highlights"
}, {
  label: "News",
  query: "world news live"
}, {
  label: "Coding",
  query: "software engineering"
} ], SEARCH_MENU_OPEN = "Open YouTube", POST_MENU_OPEN = "Open in Browser", POST_MENU_RELATED = "Open Related", POST_MENU_CHANNEL = "Open Channel", MENU_SETTINGS = "Settings", HOME_MENU_CHANNEL_LIST = "Channel List", CHANNEL_MENU_BOOKMARK = "Bookmark Channel", CHANNEL_MENU_UNBOOKMARK = "Remove Bookmark", CHANNEL_MENU_OPEN_BROWSER = "Open Channel in Browser", CHANNEL_MENU_ENABLE_VIDEOS = "Enable Videos", CHANNEL_MENU_ENABLE_STREAMS = "Enable Streams", ITEM_MENU_OPEN_BROWSER = "Open in Browser", ITEM_MENU_OPEN_VIDEO = "Open Video", ITEM_MENU_OPEN_CHANNEL = "Open Channel", ITEM_MENU_REMOVE_BOOKMARK = "Remove Bookmark", STARRED_CHANNELS_KEY = "youtube_starred_channels_v1", API_KEY_OVERRIDE_STORAGE_KEY = "youtube_api_key_override_v1", LANGUAGE_OVERRIDE_STORAGE_KEY = "youtube_language_override_v1", CHANNEL_LIST_CHUNK_SIZE_STORAGE_KEY = "youtube_channel_list_chunk_size_v1", INNERTUBE_CONFIG_CACHE_KEY = "youtube_innertube_config_v1", CHANNEL_PAGE_CACHE_TTL_MS = 3e5, CHANNEL_PAGE_CACHE_LIMIT = 24, DEFAULT_CHANNEL_LIST_CHUNK_SIZE = 16, CHANNEL_HOME_PREVIEW_MIN_ITEMS = 16, CHANNEL_HOME_PREVIEW_MAX_ITEMS = 32, CHANNEL_HOME_PREVIEW_MULTIPLIER = 1, innertubeConfigCache = null, channelPageCache = {}, channelPageCacheOrder = [], YOUTUBE_LANGUAGES = [ {
  code: "ar",
  label: "العربية",
  hl: "ar",
  gl: "SA",
  acceptLanguage: "ar-SA,ar;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "bn",
  label: "বাংলা",
  hl: "bn",
  gl: "BD",
  acceptLanguage: "bn-BD,bn;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "zh-CN",
  label: "中文（简体）",
  hl: "zh-CN",
  gl: "CN",
  acceptLanguage: "zh-CN,zh;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "zh-TW",
  label: "中文（繁體）",
  hl: "zh-TW",
  gl: "TW",
  acceptLanguage: "zh-TW,zh;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "en",
  label: "English",
  hl: "en",
  gl: "US",
  acceptLanguage: "en-US,en;q=0.9"
}, {
  code: "fr",
  label: "Français",
  hl: "fr",
  gl: "FR",
  acceptLanguage: "fr-FR,fr;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "de",
  label: "Deutsch",
  hl: "de",
  gl: "DE",
  acceptLanguage: "de-DE,de;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "hi",
  label: "हिन्दी",
  hl: "hi",
  gl: "IN",
  acceptLanguage: "hi-IN,hi;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "it",
  label: "Italiano",
  hl: "it",
  gl: "IT",
  acceptLanguage: "it-IT,it;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "id",
  label: "Bahasa Indonesia",
  hl: "id",
  gl: "ID",
  acceptLanguage: "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "ja",
  label: "日本語",
  hl: "ja",
  gl: "JP",
  acceptLanguage: "ja-JP,ja;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "ko",
  label: "한국어",
  hl: "ko",
  gl: "KR",
  acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "pl",
  label: "Polski",
  hl: "pl",
  gl: "PL",
  acceptLanguage: "pl-PL,pl;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "pt",
  label: "Português",
  hl: "pt",
  gl: "BR",
  acceptLanguage: "pt-BR,pt;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "ru",
  label: "Русский",
  hl: "ru",
  gl: "RU",
  acceptLanguage: "ru-RU,ru;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "es",
  label: "Español",
  hl: "es",
  gl: "ES",
  acceptLanguage: "es-ES,es;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "th",
  label: "ไทย",
  hl: "th",
  gl: "TH",
  acceptLanguage: "th-TH,th;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "tr",
  label: "Türkçe",
  hl: "tr",
  gl: "TR",
  acceptLanguage: "tr-TR,tr;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "vi",
  label: "Tiếng Việt",
  hl: "vi",
  gl: "VN",
  acceptLanguage: "vi-VN,vi;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "ur",
  label: "اردو",
  hl: "ur",
  gl: "PK",
  acceptLanguage: "ur-PK,ur;q=0.9,en-US;q=0.6,en;q=0.5"
} ], HOME_SEARCH_APPBAR = {
  type: "query",
  label: "Search YouTube",
  hint: "Search videos"
}, listViewState = {}, postViewState = {}, handler = {
  home: function() {
    openHomeView();
  },
  deeplink: function(url) {
    var videoId = parseVideoId(url);
    return !!videoId && (openVideoView(videoId, "YouTube"), !0);
  },
  resume: function(viewId, context) {
    if ("watch" === getString(context && context.kind)) return ensurePostState(viewId, context || {}), 
    void synura.connect(viewId, context || {}, handler.onPostEvent);
    ensureListState(viewId, context || {}), synura.connect(viewId, context || {}, handler.onListEvent);
  },
  onListEvent: function(event) {
    var viewId = event.viewId, state = ensureListState(viewId, event.context || {});
    if ("LOAD" === event.eventId) return "related" === state.mode ? void renderRelatedList(viewId, state) : "home" === state.mode ? void renderHomeList(viewId, state) : "channel" === state.mode ? void (state.loaded ? renderChannelList(viewId, state) : loadChannelFirstPage(viewId, !1)) : void (state.loaded || loadSearchFirstPage(viewId, state.query || DEFAULT_QUERY));
    if ("REFRESH" !== event.eventId) {
      if ("QUERY" === event.eventId) {
        if ("home" === state.mode) {
          var homeQuery = cleanQuery(event.data && event.data.query);
          return homeQuery ? void openSearchView(homeQuery) : void showSnackbar(viewId, "Type a search query.");
        }
        if ("channel" === state.mode) return state.channelQuery = cleanQuery(event.data && event.data.query), 
        void loadChannelFirstPage(viewId, !1);
        if ("search" !== state.mode) return;
        var query = cleanQuery(event.data && event.data.query) || DEFAULT_QUERY;
        return state.query = query, void loadSearchFirstPage(viewId, query);
      }
      if ("SCROLL_TO_END" !== event.eventId) {
        if ("CLICK" === event.eventId) {
          if ("home" === state.mode) return void (openChannelFromEventData(state, event.data) || showSnackbar(viewId, "Could not find channel."));
          var videoId = getString(event.data && event.data.videoId);
          return videoId || (videoId = parseVideoId(getString(event.data && event.data.link))), 
          videoId ? void openVideoView(videoId, getString(event.data && event.data.title) || "YouTube", buildVideoOpenData(state, event.data)) : void showSnackbar(viewId, "Could not find video id.");
        }
        if ("ITEM_MENU_CLICK" !== event.eventId) "MENU_CLICK" !== event.eventId ? "AUTHOR_CLICK" === event.eventId && (openChannelFromEventData(state, event.data) || showSnackbar(viewId, "Could not find channel.")) : handleListMenu(viewId, state, getString(event.data && event.data.menu)); else {
          var itemMenu = getString(event.data && event.data.menu), itemLink = getString(event.data && event.data.link);
          if (itemMenu === ITEM_MENU_OPEN_CHANNEL) return void (openChannelFromEventData(state, event.data) || showSnackbar(viewId, "Could not find channel."));
          if (itemMenu === ITEM_MENU_REMOVE_BOOKMARK && "home" === state.mode) {
            var homeChannel = resolveChannelFromListEvent(state, event.data), removed = removeStarredChannel(homeChannel.channelUrl, homeChannel.channelId);
            return refreshHomeList(viewId), void showSnackbar(viewId, removed ? "Removed bookmark." : "Bookmark not found.");
          }
          if (itemMenu === ITEM_MENU_OPEN_BROWSER && itemLink) {
            var browserTitle = "home" === state.mode || "channel" === state.mode ? getString(event.data && event.data.title) || "Channel" : "YouTube";
            openBrowser(localizedURL(itemLink), browserTitle);
          } else if (itemMenu === ITEM_MENU_OPEN_VIDEO) {
            var targetVideoId = parseVideoId(itemLink);
            targetVideoId && openVideoView(targetVideoId, getString(event.data && event.data.title) || "YouTube", buildVideoOpenData(state, event.data));
          }
        }
      } else "related" === state.mode ? loadMoreRelated(viewId) : "channel" === state.mode ? loadMoreChannel(viewId) : loadMoreSearch(viewId);
    } else "related" === state.mode ? refreshRelatedList(viewId) : "home" === state.mode ? refreshHomeList(viewId) : "channel" === state.mode ? loadChannelFirstPage(viewId, !0) : loadSearchFirstPage(viewId, state.query || DEFAULT_QUERY);
  },
  onPostEvent: function(event) {
    var viewId = event.viewId, state = ensurePostState(viewId, event.context || {});
    if ("LOAD" !== event.eventId && "REFRESH" !== event.eventId) if ("SCROLL_TO_END" !== event.eventId) if ("SUBMIT" !== event.eventId) if ("ITEM_MENU_CLICK" !== event.eventId) {
      if ("MENU_CLICK" === event.eventId) {
        var menuName = getString(event.data && event.data.menu);
        return menuName === MENU_SETTINGS ? void openSettingsDialog(viewId, state) : menuName === POST_MENU_OPEN ? void openBrowser(localizedURL(watchURL(state.videoId)), "YouTube") : menuName === POST_MENU_RELATED ? void openRelatedFromPost(viewId) : menuName === POST_MENU_CHANNEL ? void openChannelFromPostState(viewId) : void 0;
      }
      "AUTHOR_CLICK" === event.eventId && openChannelFromPostState(viewId);
    } else {
      var menu = getString(event.data && event.data.menu), link = getString(event.data && event.data.link);
      if (menu === ITEM_MENU_OPEN_VIDEO) {
        var targetVideoId = parseVideoId(link);
        targetVideoId && openVideoView(targetVideoId, getString(event.data && event.data.title) || "YouTube", event.data);
      } else menu === ITEM_MENU_OPEN_BROWSER && link && openBrowser(localizedURL(link), "YouTube");
    } else {
      var button = getString(event.data && event.data.button);
      button === POST_MENU_OPEN ? openBrowser(localizedURL(watchURL(state.videoId)), "YouTube") : button === POST_MENU_RELATED && openRelatedFromPost(viewId);
    } else loadMoreComments(viewId); else loadWatchPost(viewId);
  }
}, openHomeView = function() {
  var result = synura.open({
    view: "/views/list",
    styles: {
      title: "Starred Channels",
      appbar: HOME_SEARCH_APPBAR,
      layout: "card",
      pagination: !1,
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !1
    },
    models: {
      contents: [],
      menus: [ HOME_MENU_CHANNEL_LIST, MENU_SETTINGS ],
      snackbar: "Loading starred channels..."
    }
  }, {
    kind: "home"
  }, handler.onListEvent);
  result.success && (listViewState[String(result.viewId)] = {
    mode: "home",
    title: "Starred Channels",
    loaded: !1,
    loading: !1,
    continuation: "",
    items: [],
    apiCfg: defaultConfig(),
    channelUrl: "",
    channelId: "",
    channelTitle: "",
    channelAvatar: "",
    channelMemo: "",
    starred: !1,
    enableVideos: !0,
    enableStreams: !0,
    continuationSource: "",
    pendingItems: [],
    channelTabFallbackPending: !1
  });
}, openSearchView = function(query) {
  var menuLabels = QUICK_QUERIES.map(function(item) {
    return item.label;
  });
  menuLabels.push(SEARCH_MENU_OPEN), menuLabels.push(MENU_SETTINGS);
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
      pagination: !0,
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !0
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
  if (result.success) {
    var key = String(result.viewId), existing = listViewState[key] || {};
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
      starred: !1,
      enableVideos: !0,
      enableStreams: !0,
      continuationSource: "",
      pendingItems: [],
      channelTabFallbackPending: !1
    };
  }
}, buildPostSeed = function(videoId, titleHint, data) {
  var seed = {
    videoId: getString(videoId),
    title: getString(titleHint) || getString(data && data.title) || "YouTube",
    author: getString(data && data.author),
    memo: getString(data && data.channelMemo) || getString(data && data.memo),
    avatar: getString(data && data.avatar) || getString(data && data.channelAvatar),
    date: getString(data && data.date),
    viewCount: getString(data && data.viewCount),
    likeCount: getString(data && data.likeCount),
    dislikeCount: getString(data && data.dislikeCount),
    channelUrl: normalizeChannelUrl(getString(data && data.channelUrl)),
    channelId: getString(data && data.channelId),
    channelTitle: getString(data && data.channelTitle) || getString(data && data.author),
    channelAvatar: getString(data && data.channelAvatar) || getString(data && data.avatar),
    channelMemo: getString(data && data.channelMemo)
  };
  return !seed.channelUrl && seed.channelId && (seed.channelUrl = normalizeChannelUrl("/channel/" + seed.channelId)), 
  seed.channelTitle || (seed.channelTitle = seed.author), seed;
}, buildInitialPostModels = function(videoURL, seed) {
  var models = {
    link: videoURL,
    author: seed.author || "Loading...",
    content: [ {
      type: "link",
      value: videoURL,
      href: videoURL,
      link: videoURL
    } ],
    comments: [],
    menus: [ POST_MENU_OPEN, MENU_SETTINGS ],
    buttons: [ POST_MENU_OPEN ]
  };
  return seed.memo && (models.memo = seed.memo), seed.avatar && (models.avatar = seed.avatar), 
  seed.date && (models.date = seed.date), seed.viewCount && (models.viewCount = seed.viewCount), 
  seed.likeCount && (models.likeCount = seed.likeCount), seed.dislikeCount && (models.dislikeCount = seed.dislikeCount), 
  (seed.channelUrl || seed.channelId) && (models.menus = [ POST_MENU_OPEN, POST_MENU_CHANNEL, MENU_SETTINGS ]), 
  models;
}, openVideoView = function(videoId, titleHint, data) {
  var seed = buildPostSeed(videoId, titleHint, data), videoURL = localizedURL(watchURL(videoId)), result = synura.open({
    view: "/views/post",
    styles: {
      title: seed.title || "YouTube",
      menu: !0,
      authorClickable: !0
    },
    models: buildInitialPostModels(videoURL, seed)
  }, {
    kind: "watch",
    videoId: videoId,
    channelUrl: seed.channelUrl,
    channelId: seed.channelId,
    channelTitle: seed.channelTitle,
    channelAvatar: seed.channelAvatar,
    channelMemo: seed.channelMemo,
    author: seed.author,
    memo: seed.memo,
    avatar: seed.avatar,
    date: seed.date,
    viewCount: seed.viewCount,
    likeCount: seed.likeCount,
    dislikeCount: seed.dislikeCount
  }, handler.onPostEvent);
  if (result.success) {
    var key = String(result.viewId), existing = postViewState[key] || {};
    postViewState[key] = {
      videoId: existing.videoId || videoId,
      loaded: !!existing.loaded,
      loading: !!existing.loading,
      comments: existing.comments || [],
      commentsContinuation: existing.commentsContinuation || "",
      relatedItems: existing.relatedItems || [],
      relatedContinuation: existing.relatedContinuation || "",
      channelUrl: existing.channelUrl || seed.channelUrl || "",
      channelId: existing.channelId || seed.channelId || "",
      channelTitle: existing.channelTitle || seed.channelTitle || "",
      channelAvatar: existing.channelAvatar || seed.channelAvatar || "",
      channelMemo: existing.channelMemo || seed.channelMemo || "",
      apiCfg: existing.apiCfg || defaultConfig()
    };
  }
}, openRelatedList = function(parentVideoId, title, items, continuation, apiCfg) {
  var result = synura.open({
    view: "/views/list",
    styles: {
      title: title || "Related Videos",
      layout: "card",
      pagination: !0,
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !0
    },
    models: {
      contents: items || [],
      menus: [ POST_MENU_OPEN, MENU_SETTINGS ],
      snackbar: items && items.length ? "" : "No related videos available."
    }
  }, {
    kind: "related",
    videoId: parentVideoId
  }, handler.onListEvent);
  if (result.success) {
    var key = String(result.viewId), existing = listViewState[key] || {};
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
      starred: !1,
      enableVideos: !0,
      enableStreams: !0,
      continuationSource: "",
      pendingItems: []
    };
  }
}, openRelatedFromPost = function(viewId) {
  var state = postViewState[String(viewId)];
  state && openRelatedList(state.videoId, "Related Videos", state.relatedItems || [], state.relatedContinuation || "", state.apiCfg || defaultConfig());
}, openChannelList = function(channelUrl, channelTitle, channelId, channelAvatar, channelMemo) {
  var normalizedUrl = normalizeChannelUrl(channelUrl);
  if (!normalizedUrl && channelId && (normalizedUrl = normalizeChannelUrl("/channel/" + channelId)), 
  !normalizedUrl) return !1;
  var starred = isStarredChannel(normalizedUrl, channelId), context = {
    kind: "channel",
    channelUrl: normalizedUrl,
    channelId: getString(channelId),
    channelTitle: getString(channelTitle),
    channelAvatar: getString(channelAvatar),
    channelMemo: getString(channelMemo),
    channelQuery: "",
    enableVideos: !0,
    enableStreams: !0
  }, result = synura.open({
    view: "/views/list",
    styles: {
      title: context.channelTitle || "Channel",
      appbar: buildChannelAppbar({
        channelTitle: context.channelTitle || "Channel",
        channelQuery: ""
      }),
      layout: "card",
      pagination: !0,
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !0
    },
    models: {
      contents: [],
      menus: buildChannelMenus({
        channelUrl: normalizedUrl,
        starred: starred
      }),
      snackbar: "Loading channel videos and live streams..."
    }
  }, context, handler.onListEvent);
  if (!result.success) return !1;
  var key = String(result.viewId), existing = listViewState[key] || {};
  return listViewState[key] = {
    mode: "channel",
    title: context.channelTitle || "Channel",
    loaded: !!existing.loaded,
    loading: !!existing.loading,
    continuation: existing.continuation || "",
    items: existing.items || [],
    apiCfg: existing.apiCfg || defaultConfig(),
    channelUrl: normalizedUrl,
    channelId: context.channelId,
    channelTitle: existing.channelTitle || context.channelTitle,
    channelAvatar: existing.channelAvatar || context.channelAvatar,
    channelMemo: existing.channelMemo || context.channelMemo,
    channelQuery: existing.channelQuery || "",
    starred: void 0 === existing.starred ? starred : !!existing.starred,
    enableVideos: void 0 === existing.enableVideos || normalizeEnabledFlag(existing.enableVideos),
    enableStreams: void 0 === existing.enableStreams || normalizeEnabledFlag(existing.enableStreams),
    continuationSource: existing.continuationSource || "",
    pendingItems: existing.pendingItems || [],
    channelTabFallbackPending: void 0 !== existing.channelTabFallbackPending && !!existing.channelTabFallbackPending
  }, !0;
}, openChannelFromPostState = function(viewId) {
  var state = postViewState[String(viewId)];
  state && (state.channelUrl || state.channelId) ? openChannelList(state.channelUrl, state.channelTitle || "Channel", state.channelId, state.channelAvatar, state.channelMemo) || showSnackbar(viewId, "Could not open channel.") : showSnackbar(viewId, "Could not find channel.");
}, openChannelFromEventData = function(state, data) {
  var channel = resolveChannelFromListEvent(state, data);
  return !(!channel.channelUrl && !channel.channelId) && openChannelList(channel.channelUrl, channel.channelTitle || channel.author || channel.title || "Channel", channel.channelId, channel.channelAvatar || channel.avatar, channel.channelMemo || channel.memo);
}, buildVideoOpenData = function(state, data) {
  var out = {};
  if (data && "object" == typeof data) for (var key in data) Object.prototype.hasOwnProperty.call(data, key) && (out[key] = data[key]);
  var channel = resolveChannelFromListEvent(state, out);
  return getString(out.author) || (out.author = channel.author || channel.channelTitle || getString(state && state.channelTitle)), 
  !getString(out.channelUrl) && channel.channelUrl && (out.channelUrl = channel.channelUrl), 
  !getString(out.channelId) && channel.channelId && (out.channelId = channel.channelId), 
  getString(out.channelTitle) || (out.channelTitle = channel.channelTitle || out.author || getString(state && state.channelTitle)), 
  getString(out.channelAvatar) || (out.channelAvatar = channel.channelAvatar || channel.avatar || getString(state && state.channelAvatar)), 
  getString(out.channelMemo) || (out.channelMemo = channel.channelMemo || channel.memo || getString(state && state.channelMemo)), 
  !getString(out.avatar) && getString(out.channelAvatar) && (out.avatar = out.channelAvatar), 
  !getString(out.memo) && getString(out.channelMemo) && (out.memo = out.channelMemo), 
  out;
}, resolveChannelFromListEvent = function(state, data) {
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
  !out.channelUrl && out.channelId && (out.channelUrl = normalizeChannelUrl("/channel/" + out.channelId));
  var link = getString(data && data.link);
  if (!out.channelUrl && state && "home" === state.mode && (out.channelUrl = normalizeChannelUrl(link)), 
  (!out.channelUrl || !out.channelId || !out.channelTitle) && state && Array.isArray(state.items)) for (var i = 0; i < state.items.length; i++) {
    var item = state.items[i] || {};
    if (getString(item.link) === link && (!out.author || !getString(item.author) || getString(item.author) === out.author)) {
      out.channelUrl = out.channelUrl || normalizeChannelUrl(item.channelUrl), out.channelId = out.channelId || getString(item.channelId), 
      out.channelTitle = out.channelTitle || getString(item.channelTitle) || getString(item.author), 
      out.channelAvatar = out.channelAvatar || getString(item.channelAvatar) || getString(item.avatar), 
      out.channelMemo = out.channelMemo || getString(item.channelMemo);
      break;
    }
  }
  return state && "channel" === state.mode && (out.channelUrl = out.channelUrl || normalizeChannelUrl(state.channelUrl), 
  out.channelId = out.channelId || getString(state.channelId), out.channelTitle = out.channelTitle || getString(state.channelTitle), 
  out.channelAvatar = out.channelAvatar || getString(state.channelAvatar), out.channelMemo = out.channelMemo || getString(state.channelMemo)), 
  !out.channelTitle && state && "home" === state.mode && (out.channelTitle = getString(data && data.title)), 
  out;
}, buildChannelMenus = function(state) {
  var menus = [];
  return state.channelUrl && menus.push(CHANNEL_MENU_OPEN_BROWSER), menus.push({
    label: CHANNEL_MENU_ENABLE_VIDEOS,
    checked: normalizeEnabledFlag(state && state.enableVideos)
  }), menus.push({
    label: CHANNEL_MENU_ENABLE_STREAMS,
    checked: normalizeEnabledFlag(state && state.enableStreams)
  }), menus.push(state.starred ? CHANNEL_MENU_UNBOOKMARK : CHANNEL_MENU_BOOKMARK), 
  menus.push(MENU_SETTINGS), menus;
}, setChannelBookmark = function(viewId, state, shouldStar) {
  if (state && (state.channelUrl || state.channelId)) {
    var changed = !1;
    changed = shouldStar ? upsertStarredChannel({
      channelUrl: state.channelUrl,
      channelId: state.channelId,
      channelTitle: state.channelTitle,
      channelAvatar: state.channelAvatar,
      channelMemo: state.channelMemo,
      enabled: !0
    }) : removeStarredChannel(state.channelUrl, state.channelId), state.starred = isStarredChannel(state.channelUrl, state.channelId), 
    synura.update(viewId, {
      models: {
        menus: buildChannelMenus(state),
        snackbar: shouldStar ? changed ? "Channel bookmarked." : "Channel already bookmarked." : changed ? "Bookmark removed." : "Bookmark not found."
      }
    }), refreshAllHomeLists();
  } else showSnackbar(viewId, "Could not find channel.");
}, openSettingsDialog = function(parentViewId, targetState) {
  var currentApiKey = loadApiKeyOverride(), currentLanguage = getCurrentLanguageSetting(), currentChannelChunkSize = loadChannelListChunkSize(), languageOptions = getLanguageOptions(), dialogViewId = 0, result = synura.open({
    view: "/dialogs/input",
    styles: {
      title: "Settings",
      message: "Update YouTube API key, language, and initial channel list limit.",
      close: !0
    },
    models: {
      body: [ {
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
      }, {
        type: "number",
        name: "channelChunkSize",
        label: "Initial Channel Items",
        value: currentChannelChunkSize
      } ],
      buttons: [ "Save", "Clear", "Cancel" ]
    }
  }, function(event) {
    if ("SUBMIT" === event.eventId) {
      var button = getString(event.data && event.data.button);
      if ("Save" === button) {
        var key = sanitizeApiKey(event.data && event.data.apiKey), languageCode = languageCodeFromOption(event.data && event.data.language), channelChunkSize = normalizeChannelListChunkSize(event.data && event.data.channelChunkSize, 0);
        if (!languageCode) return void showSnackbar(parentViewId, "Invalid language selection.");
        if (!channelChunkSize) return void showSnackbar(parentViewId, "Initial channel items must be 1 or higher.");
        if (key) {
          if (!saveApiKeyOverride(key)) return void showSnackbar(parentViewId, "Could not save API key.");
        } else if (!clearApiKeyOverride()) return void showSnackbar(parentViewId, "Could not clear API key.");
        return saveLanguageOverride(languageCode) ? saveChannelListChunkSize(channelChunkSize) ? (applySettingsToState(targetState), 
        showSnackbar(parentViewId, "Settings saved. Pull to refresh."), void synura.close(dialogViewId)) : void showSnackbar(parentViewId, "Could not save channel list limit.") : void showSnackbar(parentViewId, "Could not save language.");
      }
      return "Clear" === button ? clearApiKeyOverride() && clearLanguageOverride() && clearChannelListChunkSize() ? (applySettingsToState(targetState), 
      showSnackbar(parentViewId, "Settings cleared. Pull to refresh."), void synura.close(dialogViewId)) : void showSnackbar(parentViewId, "Could not clear settings.") : void synura.close(dialogViewId);
    }
    "CLOSE" === event.eventId && synura.close(dialogViewId);
  });
  result.success ? dialogViewId = result.viewId : showSnackbar(parentViewId, "Could not open settings.");
}, applySettingsToState = function(state) {
  state && state.apiCfg && (state.apiCfg.apiKey = resolveApiKey(state.apiCfg.apiKey), 
  applyLocaleToConfig(state.apiCfg));
}, buildChannelManagerFields = function(channels) {
  for (var fields = [], i = 0; i < channels.length; i++) {
    var channel = channels[i] || {}, title = getString(channel.channelTitle) || getString(channel.channelUrl) || "Channel " + (i + 1), memo = getString(channel.channelMemo);
    memo && (title = trimTo(title + " - " + memo, 120)), fields.push({
      type: "boolean",
      name: "enabled_" + i,
      label: title,
      value: !1 !== channel.enabled
    });
  }
  return fields;
}, applyChannelManagerValues = function(channels, data) {
  for (var i = 0; i < channels.length; i++) {
    var name = "enabled_" + i;
    channels[i].enabled = data && !0 === data[name];
  }
}, openChannelListManager = function(parentViewId) {
  var channels = loadStarredChannels();
  if (channels.length) {
    var managerViewId = 0, managerButtons = [ "Save", "Enable All", "Disable All", "Delete Disabled", "Cancel" ], result = synura.open({
      view: "/views/settings",
      styles: {
        title: "Channel List",
        message: "Enable, disable, or delete starred channels."
      },
      models: {
        body: buildChannelManagerFields(channels),
        buttons: managerButtons
      }
    }, function(event) {
      if ("SUBMIT" === event.eventId) {
        var button = getString(event.data && event.data.button);
        if ("Save" === button) return applyChannelManagerValues(channels, event.data), saveStarredChannels(channels) ? (refreshHomeList(parentViewId), 
        showSnackbar(parentViewId, "Channel list saved."), void synura.close(managerViewId)) : void showSnackbar(managerViewId, "Could not save channel list.");
        if ("Enable All" !== button && "Disable All" !== button) {
          if ("Delete Disabled" === button) {
            applyChannelManagerValues(channels, event.data);
            for (var kept = [], removed = 0, j = 0; j < channels.length; j++) !1 !== channels[j].enabled ? kept.push(channels[j]) : removed++;
            return removed ? saveStarredChannels(channels = kept) ? (refreshHomeList(parentViewId), 
            channels.length ? void synura.update(managerViewId, {
              models: {
                body: buildChannelManagerFields(channels),
                buttons: managerButtons,
                snackbar: "Deleted " + removed + " channel(s)."
              }
            }) : (showSnackbar(parentViewId, "Deleted " + removed + " channel(s)."), void synura.close(managerViewId))) : void showSnackbar(managerViewId, "Could not delete channels.") : void showSnackbar(managerViewId, "No disabled channels to delete.");
          }
          synura.close(managerViewId);
        } else {
          for (var enabled = "Enable All" === button, i = 0; i < channels.length; i++) channels[i].enabled = enabled;
          synura.update(managerViewId, {
            models: {
              body: buildChannelManagerFields(channels),
              buttons: managerButtons,
              snackbar: enabled ? "All channels enabled." : "All channels disabled."
            }
          });
        }
      }
    });
    result.success ? managerViewId = result.viewId : showSnackbar(parentViewId, "Could not open channel list.");
  } else showSnackbar(parentViewId, "No starred channels.");
}, isMenuMatch = function(menu, label) {
  var value = getString(menu), target = getString(label);
  return !(!value || !target) && (value === target || value.indexOf(target) >= 0);
}, handleListMenu = function(viewId, state, menu) {
  if (menu) if (menu !== MENU_SETTINGS) if ("home" !== state.mode || menu !== HOME_MENU_CHANNEL_LIST) {
    if ("channel" === state.mode) return menu === CHANNEL_MENU_OPEN_BROWSER && state.channelUrl ? void openBrowser(localizedURL(state.channelUrl), state.channelTitle || "Channel") : isMenuMatch(menu, CHANNEL_MENU_ENABLE_VIDEOS) ? (state.enableVideos = !normalizeEnabledFlag(state.enableVideos), 
    void loadChannelFirstPage(viewId, !1)) : isMenuMatch(menu, CHANNEL_MENU_ENABLE_STREAMS) ? (state.enableStreams = !normalizeEnabledFlag(state.enableStreams), 
    void loadChannelFirstPage(viewId, !1)) : menu === CHANNEL_MENU_BOOKMARK ? void setChannelBookmark(viewId, state, !0) : menu === CHANNEL_MENU_UNBOOKMARK ? void setChannelBookmark(viewId, state, !1) : void 0;
    if (menu !== SEARCH_MENU_OPEN) if (menu !== POST_MENU_OPEN || "related" !== state.mode) {
      if ("search" === state.mode) for (var i = 0; i < QUICK_QUERIES.length; i++) if (QUICK_QUERIES[i].label === menu) return state.query = QUICK_QUERIES[i].query, 
      void loadSearchFirstPage(viewId, state.query);
    } else openBrowser(localizedURL(watchURL(state.parentVideoId)), "YouTube"); else openBrowser(localizedURL(YT_ORIGIN + "/"), "YouTube");
  } else openChannelListManager(viewId); else openSettingsDialog(viewId, state);
}, ensureListState = function(viewId, context) {
  var key = String(viewId);
  if (!listViewState[key]) {
    var mode = getString(context && context.kind);
    "related" !== mode && "search" !== mode && "home" !== mode && "channel" !== mode && (mode = "search");
    var channelUrl = normalizeChannelUrl(getString(context && context.channelUrl)), channelId = getString(context && context.channelId);
    !channelUrl && channelId && (channelUrl = normalizeChannelUrl("/channel/" + channelId)), 
    listViewState[key] = {
      mode: mode,
      parentVideoId: getString(context && context.videoId),
      title: getString(context && context.title) || ("related" === mode ? "Related Videos" : "home" === mode ? "Starred Channels" : "channel" === mode ? "Channel" : "YouTube"),
      query: getString(context && context.query) || DEFAULT_QUERY,
      loaded: !1,
      loading: !1,
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
      continuationSource: getString(context && context.continuationSource),
      pendingItems: [],
      channelTabFallbackPending: !1
    }, "home" === mode && (listViewState[key].items = starredChannelsToListItems(loadStarredChannels()), 
    listViewState[key].loaded = !0);
  }
  return listViewState[key];
}, ensurePostState = function(viewId, context) {
  var key = String(viewId);
  if (!postViewState[key]) {
    var channelUrl = normalizeChannelUrl(getString(context && context.channelUrl)), channelId = getString(context && context.channelId);
    !channelUrl && channelId && (channelUrl = normalizeChannelUrl("/channel/" + channelId)), 
    postViewState[key] = {
      videoId: getString(context && context.videoId),
      loaded: !1,
      loading: !1,
      comments: [],
      commentsContinuation: "",
      relatedItems: [],
      relatedContinuation: "",
      channelUrl: channelUrl,
      channelId: channelId,
      channelTitle: getString(context && context.channelTitle) || getString(context && context.author),
      channelAvatar: getString(context && context.channelAvatar) || getString(context && context.avatar),
      channelMemo: getString(context && context.channelMemo) || getString(context && context.memo),
      apiCfg: defaultConfig()
    };
  }
  return postViewState[key];
}, renderRelatedList = function(viewId, state) {
  state.loaded = !0, synura.update(viewId, {
    styles: {
      title: state.title || "Related Videos"
    },
    models: {
      contents: state.items || [],
      menus: [ POST_MENU_OPEN, MENU_SETTINGS ],
      snackbar: (state.items || []).length ? "" : "No related videos available."
    }
  });
}, buildHomeSnackbar = function(allChannels, visibleItems) {
  return visibleItems && visibleItems.length ? "" : allChannels && allChannels.length ? "All channels are disabled. Open Channel List." : "No starred channels yet.";
}, renderHomeList = function(viewId, state) {
  var allChannels = loadStarredChannels();
  state.items = starredChannelsToListItems(allChannels), state.loaded = !0, state.mode = "home", 
  synura.update(viewId, {
    styles: {
      title: "Starred Channels",
      appbar: HOME_SEARCH_APPBAR
    },
    models: {
      contents: state.items,
      menus: [ HOME_MENU_CHANNEL_LIST, MENU_SETTINGS ],
      snackbar: buildHomeSnackbar(allChannels, state.items)
    }
  });
}, refreshHomeList = function(viewId) {
  var state = listViewState[String(viewId)];
  state && renderHomeList(viewId, state);
}, refreshAllHomeLists = function() {
  for (var key in listViewState) if (Object.prototype.hasOwnProperty.call(listViewState, key)) {
    var state = listViewState[key];
    if (state && "home" === state.mode) {
      var viewId = parseInt(key, 10);
      viewId && renderHomeList(viewId, state);
    }
  }
}, buildChannelAppbar = function(state) {
  return {
    type: "query",
    label: "Search " + (getString(state && state.channelTitle) || "Channel"),
    hint: cleanQuery(state && state.channelQuery) || "Search in this channel"
  };
}, buildChannelSnackbar = function(state) {
  if (state.items && state.items.length) return "";
  var channelQuery = cleanQuery(state && state.channelQuery);
  if (channelQuery) return 'No results in this channel for "' + channelQuery + '".';
  var videosEnabled = normalizeEnabledFlag(state && state.enableVideos), streamsEnabled = normalizeEnabledFlag(state && state.enableStreams);
  return videosEnabled || streamsEnabled ? videosEnabled && streamsEnabled ? "No videos or live streams found." : videosEnabled ? "No videos found." : "No live streams found." : "Videos and live streams are disabled.";
}, splitBufferedItems = function(items, chunkSize) {
  var list = Array.isArray(items) ? items.slice() : [], size = Math.floor(getNumber(chunkSize));
  return size < 1 && (size = loadChannelListChunkSize()), {
    visible: list.slice(0, size),
    pending: list.slice(size)
  };
}, drainPendingItems = function(state, chunkSize) {
  if (!state) return [];
  var pending = Array.isArray(state.pendingItems) ? state.pendingItems.slice() : [];
  if (!pending.length) return state.pendingItems = [], [];
  var split = splitBufferedItems(pending, chunkSize);
  return state.pendingItems = split.pending, split.visible;
}, renderChannelList = function(viewId, state) {
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
}, loadChannelFirstPage = function(viewId, forceRefresh) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading) if (state.channelUrl || state.channelId) {
    if (!normalizeEnabledFlag(state.enableVideos) && !normalizeEnabledFlag(state.enableStreams)) return state.items = [], 
    state.pendingItems = [], state.continuation = "", state.continuationSource = "", 
    state.channelTabFallbackPending = !1, state.loaded = !0, void renderChannelList(viewId, state);
    state.loading = !0;
    try {
      var options = {
        query: cleanQuery(state.channelQuery),
        videos: normalizeEnabledFlag(state.enableVideos),
        streams: normalizeEnabledFlag(state.enableStreams)
      }, page = forceRefresh ? null : getCachedChannelPage(state.channelUrl, state.channelId, options);
      page || (page = fetchChannelPage(state.channelUrl, state.channelId, options), saveCachedChannelPage(state.channelUrl, state.channelId, options, page));
      var split = splitBufferedItems(page.items, loadChannelListChunkSize());
      state.mode = "channel", state.items = split.visible, state.pendingItems = split.pending, 
      state.continuation = page.continuation, state.continuationSource = page.continuationSource || "", 
      state.apiCfg = page.apiCfg, state.channelTabFallbackPending = !!page.channelTabFallbackPending, 
      state.loaded = !0, page.channel && (state.channelUrl = normalizeChannelUrl(page.channel.channelUrl || state.channelUrl), 
      state.channelId = page.channel.channelId || state.channelId, state.channelTitle = page.channel.channelTitle || state.channelTitle, 
      state.channelAvatar = page.channel.channelAvatar || state.channelAvatar, state.channelMemo = page.channel.channelMemo || state.channelMemo), 
      !state.channelUrl && state.channelId && (state.channelUrl = normalizeChannelUrl("/channel/" + state.channelId)), 
      state.starred = isStarredChannel(state.channelUrl, state.channelId), renderChannelList(viewId, state);
    } catch (e) {
      showSnackbar(viewId, "Channel load failed: " + e.toString());
    }
    state.loading = !1;
  } else showSnackbar(viewId, "Could not find channel.");
}, loadMoreChannel = function(viewId) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading) {
    var pendingAppend = drainPendingItems(state, loadChannelListChunkSize());
    if (pendingAppend.length) return state.items = state.items.concat(pendingAppend), 
    synura.update(viewId, {
      models: {
        append: pendingAppend,
        snackbar: ""
      }
    }), void (state.pendingItems.length || state.continuation || state.channelTabFallbackPending || showSnackbar(viewId, "No more channel items."));
    if (state.continuation || state.channelTabFallbackPending) {
      state.loading = !0;
      try {
        var page = null, loadingDeferredTabs = !1;
        !state.continuation && state.channelTabFallbackPending ? (page = fetchChannelPageFromTabs(state.channelUrl, state.channelId, {
          query: "",
          videos: normalizeEnabledFlag(state.enableVideos),
          streams: normalizeEnabledFlag(state.enableStreams)
        }), state.channelTabFallbackPending = !1, state.continuation = page.continuation, 
        state.continuationSource = page.continuationSource || "", state.apiCfg = page.apiCfg || state.apiCfg, 
        loadingDeferredTabs = !0, page.channel && (state.channelUrl = normalizeChannelUrl(page.channel.channelUrl || state.channelUrl), 
        state.channelId = page.channel.channelId || state.channelId, state.channelTitle = page.channel.channelTitle || state.channelTitle, 
        state.channelAvatar = page.channel.channelAvatar || state.channelAvatar, state.channelMemo = page.channel.channelMemo || state.channelMemo), 
        !state.channelUrl && state.channelId && (state.channelUrl = normalizeChannelUrl("/channel/" + state.channelId))) : (page = fetchChannelContinuation(state.continuation, state.apiCfg, state.continuationSource), 
        state.continuation = page.continuation);
        for (var known = {}, i = 0; i < state.items.length; i++) known[getString(state.items[i] && state.items[i].videoId)] = !0;
        for (var i2 = 0; i2 < state.pendingItems.length; i2++) known[getString(state.pendingItems[i2] && state.pendingItems[i2].videoId)] = !0;
        for (var pageItems = hydrateChannelItems(page.items, {
          channelUrl: state.channelUrl,
          channelId: state.channelId,
          channelTitle: state.channelTitle,
          channelAvatar: state.channelAvatar,
          channelMemo: state.channelMemo
        }), freshItems = [], j = 0; j < pageItems.length; j++) {
          var id = getString(pageItems[j] && pageItems[j].videoId);
          id && !known[id] && (known[id] = !0, freshItems.push(pageItems[j]));
        }
        var split = splitBufferedItems(freshItems, loadChannelListChunkSize()), appended = split.visible;
        state.pendingItems = split.pending, appended.length && (state.items = state.items.concat(appended)), 
        synura.update(viewId, {
          models: {
            append: appended,
            snackbar: appended.length ? "" : "No more channel items."
          }
        }), (appended.length || state.pendingItems.length || state.continuation || state.channelTabFallbackPending) && (state.continuation || state.pendingItems.length || state.channelTabFallbackPending) || showSnackbar(viewId, "No more channel items.");
      } catch (e) {
        showSnackbar(viewId, loadingDeferredTabs ? "Could not load full channel list: " + e.toString() : "Could not load more channel items: " + e.toString());
      }
      state.loading = !1;
    }
  }
}, loadSearchFirstPage = function(viewId, query) {
  var state = ensureListState(viewId, {
    kind: "search"
  });
  if (!state.loading) {
    state.loading = !0;
    try {
      var page = fetchSearchPage(query);
      state.mode = "search", state.query = query, state.items = page.items, state.continuation = page.continuation, 
      state.apiCfg = page.apiCfg, state.loaded = !0;
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
    state.loading = !1;
  }
}, loadMoreSearch = function(viewId) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading && state.continuation) {
    state.loading = !0;
    try {
      var page = fetchSearchContinuation(state.continuation, state.apiCfg);
      state.continuation = page.continuation, state.items = state.items.concat(page.items), 
      synura.update(viewId, {
        models: {
          append: page.items,
          snackbar: page.items.length ? "" : "No more results."
        }
      }), page.items.length && state.continuation || showSnackbar(viewId, "No more results.");
    } catch (e) {
      showSnackbar(viewId, "Could not load more videos: " + e.toString());
    }
    state.loading = !1;
  }
}, refreshRelatedList = function(viewId) {
  var state = listViewState[String(viewId)];
  state && synura.update(viewId, {
    models: {
      contents: state.items || [],
      snackbar: ""
    }
  });
}, loadMoreRelated = function(viewId) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading && state.continuation) {
    state.loading = !0;
    try {
      var page = fetchRelatedContinuation(state.continuation, state.apiCfg);
      state.continuation = page.continuation, state.items = state.items.concat(page.items), 
      synura.update(viewId, {
        models: {
          append: page.items,
          snackbar: page.items.length ? "" : "No more related videos."
        }
      }), page.items.length && state.continuation || showSnackbar(viewId, "No more related videos.");
    } catch (e) {
      showSnackbar(viewId, "Could not load related videos: " + e.toString());
    }
    state.loading = !1;
  }
}, loadWatchPost = function(viewId) {
  var state = postViewState[String(viewId)];
  if (state && !state.loading && state.videoId) {
    state.loading = !0;
    try {
      var payload = fetchWatchPayload(state.videoId);
      state.apiCfg = payload.apiCfg, state.channelUrl = payload.channelUrl || state.channelUrl, 
      state.channelId = payload.channelId || state.channelId, state.channelTitle = payload.channelTitle || payload.author || state.channelTitle, 
      state.channelAvatar = payload.channelAvatar || state.channelAvatar, state.channelMemo = payload.channelMemo || state.channelMemo, 
      state.relatedItems = payload.relatedItems, state.relatedContinuation = payload.relatedContinuation, 
      state.comments = [], state.commentsContinuation = payload.commentsContinuation || "", 
      state.loaded = !0, synura.update(viewId, {
        styles: {
          title: payload.title || "YouTube"
        },
        models: buildPostModels(payload, state)
      });
    } catch (e) {
      showSnackbar(viewId, "Failed to load video: " + e.toString());
    }
    state.loading = !1;
  }
}, loadMoreComments = function(viewId) {
  var state = postViewState[String(viewId)];
  if (state && !state.loading && state.commentsContinuation) {
    state.loading = !0;
    try {
      var page = fetchCommentsContinuation(state.commentsContinuation, state.apiCfg);
      state.commentsContinuation = page.continuation, state.comments = state.comments.concat(page.comments), 
      synura.update(viewId, {
        models: {
          comments: state.comments,
          menus: buildPostMenus(state),
          snackbar: page.comments.length ? "" : "No more comments."
        }
      }), page.comments.length && state.commentsContinuation || showSnackbar(viewId, "No more comments.");
    } catch (e) {
      showSnackbar(viewId, "Could not load more comments: " + e.toString());
    }
    state.loading = !1;
  } else state && state.loaded && showSnackbar(viewId, "No more comments.");
}, buildPostModels = function(payload, state) {
  var content = [];
  content.push({
    type: "link",
    value: payload.link,
    href: payload.link,
    link: payload.link
  }), payload.metadataLine && content.push({
    type: "text",
    value: payload.metadataLine
  }), payload.description && content.push({
    type: "text",
    value: payload.description
  });
  var models = {
    link: payload.link,
    author: payload.author,
    content: content,
    comments: state.comments,
    menus: buildPostMenus(state),
    buttons: [ POST_MENU_OPEN, POST_MENU_RELATED ]
  };
  return payload.channelMemo && (models.memo = payload.channelMemo), payload.channelAvatar && (models.avatar = payload.channelAvatar), 
  payload.date && (models.date = payload.date), payload.viewCount && (models.viewCount = payload.viewCount), 
  payload.likeCount && (models.likeCount = payload.likeCount), payload.dislikeCount && (models.dislikeCount = payload.dislikeCount), 
  models;
}, buildPostMenus = function(state) {
  var menus = [ POST_MENU_OPEN ];
  return (state.relatedItems && state.relatedItems.length || state.relatedContinuation) && menus.push(POST_MENU_RELATED), 
  (state.channelUrl || state.channelId) && menus.push(POST_MENU_CHANNEL), menus.push(MENU_SETTINGS), 
  menus;
}, fetchSearchPage = function(query) {
  var normalizedQuery = cleanQuery(query) || DEFAULT_QUERY, cachedCfg = loadInnertubeConfigCache();
  if (cachedCfg && cachedCfg.apiKey) try {
    return fetchSearchPageInnertube(normalizedQuery, cachedCfg);
  } catch (e) {}
  var url = localizedURL(YT_ORIGIN + "/results?search_query=" + encodeURIComponent(normalizedQuery)), html = fetchText(url), initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from search page.");
  var apiCfg = extractInnertubeConfig(html), sectionContents = getIn(initialData, [ "contents", "sectionListRenderer", "contents" ], []);
  return {
    items: normalizeVideoItems(collectVideos(sectionContents), normalizedQuery),
    continuation: extractContinuationToken(sectionContents),
    apiCfg: apiCfg
  };
}, fetchSearchPageInnertube = function(query, apiCfg) {
  var cfg = resolveInnertubeConfig(apiCfg);
  if (!cfg || !cfg.apiKey) throw new Error("Missing Innertube API key.");
  var payload = {
    context: buildInnertubeContext(cfg),
    query: cleanQuery(query) || DEFAULT_QUERY
  }, response = callInnertube("/youtubei/v1/search", payload, cfg), videos = normalizeVideoItems(collectVideos(response), query), continuation = extractContinuationToken(response);
  if (!videos.length && !continuation) throw new Error("Could not parse search response.");
  return {
    items: videos,
    continuation: continuation,
    apiCfg: cfg
  };
}, fetchSearchContinuation = function(token, apiCfg) {
  var payload = {
    context: buildInnertubeContext(apiCfg),
    continuation: token
  }, response = callInnertube("/youtubei/v1/search", payload, apiCfg), items = extractContinuationItems(response);
  return {
    items: normalizeVideoItems(collectVideos(items), ""),
    continuation: extractContinuationToken(items)
  };
}, fetchChannelTabPage = function(normalizedChannelUrl, channelId, tabName, optional) {
  var url = toChannelTabURL(normalizedChannelUrl, tabName);
  if (!url) {
    if (optional) return null;
    throw new Error("Missing channel URL.");
  }
  var html = "";
  try {
    html = fetchText(localizedURL(url));
  } catch (e) {
    if (optional) return null;
    throw e;
  }
  var initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) {
    if (optional) return null;
    throw new Error("Could not parse ytInitialData from channel page.");
  }
  var apiCfg = extractInnertubeConfig(html), videos = normalizeVideoItems(collectVideos(initialData), "");
  if ("streams" === tabName) for (var i = 0; i < videos.length; i++) {
    var item = videos[i] || {}, types = Array.isArray(item.types) ? item.types.slice() : [];
    types.indexOf("stream") < 0 && types.push("stream"), item.types = types, item.memo || (item.memo = "Live stream"), 
    videos[i] = item;
  }
  var channel = parseChannelMetadata(initialData, normalizedChannelUrl, channelId);
  return videos = hydrateChannelItems(videos, channel), {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(initialData),
    apiCfg: apiCfg,
    channel: channel
  };
}, fetchChannelSearchPage = function(normalizedChannelUrl, channelId, query) {
  var url = toChannelSearchURL(normalizedChannelUrl, query);
  if (!url) throw new Error("Missing channel URL.");
  var html = fetchText(localizedURL(url)), initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from channel search page.");
  var channel = parseChannelMetadata(initialData, normalizedChannelUrl, channelId), apiCfg = extractInnertubeConfig(html), videos = hydrateChannelItems(normalizeVideoItems(collectVideos(initialData), query), channel);
  return {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(initialData),
    apiCfg: apiCfg,
    channel: channel
  };
}, fetchChannelHomePage = function(normalizedChannelUrl, channelId, options) {
  var url = stripChannelTabSuffix(normalizedChannelUrl) || normalizedChannelUrl;
  if (!url) throw new Error("Missing channel URL.");
  var html = fetchText(localizedURL(url)), apiCfg = extractInnertubeConfig(html), fastPage = extractChannelHomePageFromHTML(html, normalizedChannelUrl, channelId, options, apiCfg);
  if (fastPage) return fastPage;
  var initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from channel home page.");
  var preview = extractChannelHomePreview(initialData, options), channel = parseChannelMetadata(initialData, normalizedChannelUrl, channelId);
  return {
    items: dedupeByVideoId(hydrateChannelItems(preview.items, channel)),
    continuation: "",
    continuationSource: "",
    apiCfg: apiCfg,
    channel: channel,
    channelTabFallbackPending: preview.channelTabFallbackPending
  };
}, extractChannelHomePreview = function(initialData, options) {
  var wantVideos = normalizeEnabledFlag(options && options.videos), wantStreams = normalizeEnabledFlag(options && options.streams), root = findSelectedChannelTabContent(initialData) || initialData;
  return extractChannelHomePreviewFromContent(root, {
    videos: wantVideos,
    streams: wantStreams
  }, loadChannelHomePreviewLimit());
}, findSelectedChannelTabContent = function(initialData) {
  var tabs = getIn(initialData, [ "contents", "singleColumnBrowseResultsRenderer", "tabs" ], null);
  if (Array.isArray(tabs) && tabs.length || (tabs = getIn(initialData, [ "contents", "twoColumnBrowseResultsRenderer", "tabs" ], [])), 
  Array.isArray(tabs) && tabs.length) return findSelectedChannelTabContentFromTabs(tabs);
  var foundTabs = [];
  collectRendererInstances(initialData, "tabRenderer", foundTabs);
  for (var i = 0; i < foundTabs.length; i++) if (foundTabs[i] && foundTabs[i].selected) return foundTabs[i].content || foundTabs[i];
  var expandableTabs = [];
  collectRendererInstances(initialData, "expandableTabRenderer", expandableTabs);
  for (var j = 0; j < expandableTabs.length; j++) if (expandableTabs[j] && expandableTabs[j].selected) return expandableTabs[j].content || expandableTabs[j];
  return null;
}, collectChannelHomePreviewSections = function(node) {
  var sections = collectChannelHomePreviewSectionsDirect(node);
  if (sections.length) return sections;
  var fallbackSections = [];
  return collectRendererInstances(node, "shelfRenderer", fallbackSections), collectRendererInstances(node, "richShelfRenderer", fallbackSections), 
  fallbackSections;
}, detectChannelHomeSectionKind = function(section) {
  var url = findChannelHomeSectionTabURL(section);
  return /\/streams(?:[/?]|$)/i.test(url) ? "streams" : /\/videos(?:[/?]|$)/i.test(url) ? "videos" : "";
}, findChannelHomeSectionTabURL = function(node) {
  if (!node) return "";
  var directURL = getString(getIn(node, [ "endpoint", "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(node, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(node, [ "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(node, [ "browseEndpoint", "canonicalBaseUrl" ], ""));
  if (/\/(videos|streams)(?:[/?]|$)/i.test(directURL)) return directURL;
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var listURL = findChannelHomeSectionTabURL(node[i]);
      if (listURL) return listURL;
    }
    return "";
  }
  if ("object" != typeof node) return "";
  for (var urls = [ getString(getIn(node, [ "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(node, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(node, [ "endpoint", "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(node, [ "browseEndpoint", "canonicalBaseUrl" ], "")) ], j = 0; j < urls.length; j++) if (/\/(videos|streams)(?:[/?]|$)/i.test(urls[j])) return urls[j];
  for (var key in node) if (Object.prototype.hasOwnProperty.call(node, key)) {
    var nestedURL = findChannelHomeSectionTabURL(node[key]);
    if (nestedURL) return nestedURL;
  }
  return "";
}, fetchChannelPage = function(channelUrl, channelId, options) {
  var normalized = normalizeChannelUrl(channelUrl);
  if (!normalized && channelId && (normalized = normalizeChannelUrl("/channel/" + channelId)), 
  !normalized) throw new Error("Missing channel URL.");
  var channelQuery = cleanQuery(options && options.query), wantVideos = normalizeEnabledFlag(options && options.videos), wantStreams = normalizeEnabledFlag(options && options.streams);
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
  if (!wantVideos && !wantStreams) return {
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
    },
    channelTabFallbackPending: !1
  };
  try {
    var homePage = fetchChannelHomePage(normalized, channelId, options);
    if (homePage && homePage.items.length) return homePage;
  } catch (e) {}
  return fetchChannelPageFromTabs(normalized, channelId, options);
}, fetchChannelPageFromTabs = function(normalized, channelId, options) {
  var wantVideos = normalizeEnabledFlag(options && options.videos), wantStreams = normalizeEnabledFlag(options && options.streams), videosPage = wantVideos ? fetchChannelTabPage(normalized, channelId, "videos", wantStreams) : null, streamsPage = wantStreams ? fetchChannelTabPage(normalized, channelId, "streams", !0) : null, mergedItems = [];
  streamsPage && streamsPage.items.length && (mergedItems = mergedItems.concat(streamsPage.items)), 
  videosPage && videosPage.items.length && (mergedItems = mergedItems.concat(videosPage.items));
  var continuation = "", continuationSource = "";
  videosPage && videosPage.continuation ? (continuation = videosPage.continuation, 
  continuationSource = "videos") : streamsPage && streamsPage.continuation && (continuation = streamsPage.continuation, 
  continuationSource = "streams");
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
    apiCfg: videosPage && videosPage.apiCfg || streamsPage && streamsPage.apiCfg || defaultConfig(),
    channel: videosPage && videosPage.channel || streamsPage && streamsPage.channel || fallbackChannel,
    channelTabFallbackPending: !1
  };
}, fetchChannelContinuation = function(token, apiCfg, source) {
  var payload = {
    context: buildInnertubeContext(apiCfg),
    continuation: token
  }, endpoint = "search" === source ? "/youtubei/v1/search" : "/youtubei/v1/browse", response = null;
  try {
    response = callInnertube(endpoint, payload, apiCfg);
  } catch (e) {
    if ("/youtubei/v1/search" !== endpoint) throw e;
    response = callInnertube("/youtubei/v1/browse", payload, apiCfg);
  }
  var items = extractContinuationItems(response || {}), videos = normalizeVideoItems(collectVideos(items), "");
  return {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(items)
  };
}, fetchWatchPayload = function(videoId) {
  var url = localizedURL(watchURL(videoId)), html = fetchText(url), initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from watch page.");
  var apiCfg = extractInnertubeConfig(html), resultsContents = getIn(initialData, [ "contents", "singleColumnWatchNextResults", "results", "results", "contents" ], []), metadata = parseWatchMetadata(initialData, videoId), relatedRaw = collectVideos(resultsContents), related = normalizeVideoItems(relatedRaw, "").filter(function(item) {
    return item.videoId && item.videoId !== videoId;
  }), relatedContinuation = extractContinuationToken(resultsContents), commentsContinuation = extractCommentsContinuation(initialData);
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
}, fetchRelatedContinuation = function(token, apiCfg) {
  var payload = {
    context: buildInnertubeContext(apiCfg),
    continuation: token
  }, response = callInnertube("/youtubei/v1/next", payload, apiCfg), items = extractContinuationItems(response), videos = normalizeVideoItems(collectVideos(items), "");
  return {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(items)
  };
}, fetchCommentsContinuation = function(token, apiCfg) {
  var payload = {
    context: buildInnertubeContext(apiCfg),
    continuation: token
  }, response = callInnertube("/youtubei/v1/next", payload, apiCfg), items = extractContinuationItems(response);
  return {
    comments: parseComments(items),
    continuation: extractContinuationToken(items)
  };
}, callInnertube = function(path, body, apiCfg) {
  var cfg = resolveInnertubeConfig(apiCfg), url = YT_ORIGIN + path + "?key=" + encodeURIComponent(cfg.apiKey || DEFAULT_API_KEY), response = fetch(url, {
    method: "POST",
    bypass: SYNURA.bypass,
    followRedirects: !0,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": resolveAcceptLanguage(cfg)
    },
    body: JSON.stringify(body || {})
  });
  if (!response || !response.ok) throw new Error("HTTP " + getNumber(response && response.status) + " from " + path);
  return response.json() || {};
}, fetchText = function(url) {
  for (var current = getString(url), localeCfg = defaultConfig(), response = null, i = 0; i <= 4 && (response = fetch(current, {
    method: "GET",
    bypass: SYNURA.bypass,
    followRedirects: !0,
    redirect: "follow",
    headers: {
      "Accept-Language": resolveAcceptLanguage(localeCfg)
    }
  })); i++) {
    var status = getNumber(response.status);
    if (status < 300 || status >= 400) break;
    var location = getHeaderValue(response.headers, "location");
    if (!location) break;
    current = resolveURL(current, location);
  }
  if (!response || !response.ok) throw new Error("HTTP " + getNumber(response && response.status) + " from " + url);
  return response.text();
}, parseWatchMetadata = function(initialData, fallbackVideoId) {
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
  }, results = getIn(initialData, [ "contents", "singleColumnWatchNextResults", "results", "results", "contents" ], []), slimMeta = findRenderer(results, "slimVideoMetadataSectionRenderer");
  if (slimMeta) {
    var info = getIn(slimMeta, [ "contents", 0, "slimVideoInformationRenderer" ], {}), owner = getIn(slimMeta, [ "contents", 1, "slimOwnerRenderer" ], {}), title = textOf(info.title), subtitle = textOf(info.expandedSubtitle) || textOf(info.collapsedSubtitle);
    out.title = title || out.title, out.metadataLine = subtitle;
    var channel = textOf(owner.title) || textOf(owner.channelName), channelMemo = textOf(owner.expandedSubtitle) || textOf(owner.collapsedSubtitle);
    out.author = channel, out.channelTitle = channel, out.channelMemo = channelMemo, 
    out.channelAvatar = thumbnailFrom(owner.thumbnail);
    var channelId = getIn(owner, [ "navigationEndpoint", "browseEndpoint", "browseId" ], "");
    channelId && (out.channelId = getString(channelId));
    var channelURLPath = getIn(owner, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], "");
    out.channelUrl = channelURLPath ? toAbsoluteURL(channelURLPath) : getString(owner.channelUrl), 
    !out.channelUrl && out.channelId && (out.channelUrl = toAbsoluteURL("/channel/" + out.channelId));
    var videoId = getString(slimMeta.videoId) || fallbackVideoId;
    out.thumbnail = thumbnailFromVideoId(videoId);
    var parsed = splitMetadataLine(subtitle);
    out.viewCount = parsed.viewCount, out.date = parsed.date;
  }
  var descriptionPanel = findDescriptionPanel(initialData);
  return descriptionPanel && (out.description = descriptionPanel), out;
}, parseChannelMetadata = function(initialData, fallbackUrl, fallbackChannelId) {
  var meta = getIn(initialData, [ "metadata", "channelMetadataRenderer" ], null) || findRenderer(initialData, "channelMetadataRenderer"), header = getIn(initialData, [ "header", "c4TabbedHeaderRenderer" ], null) || findRenderer(initialData, "c4TabbedHeaderRenderer");
  return buildChannelMetadata(meta, header, fallbackUrl, fallbackChannelId);
}, buildChannelMetadata = function(meta, header, fallbackUrl, fallbackChannelId) {
  var out = {
    channelUrl: normalizeChannelUrl(fallbackUrl),
    channelId: getString(fallbackChannelId),
    channelTitle: "",
    channelAvatar: "",
    channelMemo: ""
  };
  if (meta && (out.channelTitle = textOf(meta.title) || out.channelTitle, out.channelId = getString(meta.externalId) || out.channelId, 
  out.channelAvatar = thumbnailFrom(meta.avatar) || out.channelAvatar, meta.vanityChannelUrl && (out.channelUrl = normalizeChannelUrl(meta.vanityChannelUrl))), 
  header) {
    out.channelTitle = textOf(header.title) || out.channelTitle, out.channelId = getString(header.channelId) || out.channelId, 
    out.channelAvatar = thumbnailFrom(header.avatar) || out.channelAvatar, out.channelMemo = textOf(header.subscriberCountText) || out.channelMemo;
    var channelPath = getString(getIn(header, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], ""));
    if (channelPath || (channelPath = getString(getIn(header, [ "navigationEndpoint", "browseEndpoint", "canonicalBaseUrl" ], ""))), 
    !channelPath) {
      var handle = textOf(header.channelHandleText);
      handle && "@" === handle[0] && (channelPath = "/" + handle);
    }
    channelPath && (out.channelUrl = normalizeChannelUrl(channelPath));
  }
  return !out.channelUrl && out.channelId && (out.channelUrl = normalizeChannelUrl("/channel/" + out.channelId)), 
  out.channelTitle = out.channelTitle || "Channel", out;
}, extractChannelHomePageFromHTML = function(html, normalizedChannelUrl, channelId, options, apiCfg) {
  var root = extractSelectedChannelTabContentFromHTML(html);
  if (!root) {
    var tabs = extractJSONFragmentArray(html, '"singleColumnBrowseResultsRenderer":{"tabs":');
    if (tabs && tabs.length || (tabs = extractJSONFragmentArray(html, '"twoColumnBrowseResultsRenderer":{"tabs":')), 
    !tabs || !tabs.length) return null;
    root = findSelectedChannelTabContentFromTabs(tabs);
  }
  if (!root) return null;
  var preview = extractChannelHomePreviewFromContent(root, options, loadChannelHomePreviewLimit());
  if (!preview.items.length) return null;
  var meta = extractJSONFragmentObject(html, '"channelMetadataRenderer":'), header = extractJSONFragmentObject(html, '"c4TabbedHeaderRenderer":'), channel = buildChannelMetadata(meta, header, normalizedChannelUrl, channelId);
  return {
    items: dedupeByVideoId(hydrateChannelItems(preview.items, channel)),
    continuation: "",
    continuationSource: "",
    apiCfg: apiCfg,
    channel: channel,
    channelTabFallbackPending: preview.channelTabFallbackPending
  };
}, extractSelectedChannelTabContentFromHTML = function(html) {
  return extractJSONFragmentObject(html, '"selected":true,"content":');
}, extractChannelHomePreviewFromContent = function(root, options, limit) {
  var wantVideos = normalizeEnabledFlag(options && options.videos), wantStreams = normalizeEnabledFlag(options && options.streams), targetLimit = Math.floor(getNumber(limit));
  targetLimit < 1 && (targetLimit = loadChannelHomePreviewLimit());
  for (var sections = collectChannelHomePreviewSections(root), seen = {}, items = [], i = 0; i < sections.length && items.length < targetLimit; i++) {
    var section = sections[i], renderers = collectChannelHomeSectionVideoRenderers(section, targetLimit - items.length);
    if (renderers.length) {
      var sectionItems = normalizeVideoItems(renderers, "");
      if (sectionItems.length) "streams" === detectChannelHomeSectionKind(section) && (sectionItems = markItemsAsStream(sectionItems)), 
      appendUniqueChannelItems(items, filterChannelItemsForOptions(sectionItems, wantVideos, wantStreams), seen, targetLimit);
    }
  }
  return items.length || appendUniqueChannelItems(items, filterChannelItemsForOptions(normalizeVideoItems(collectVideos(root), ""), wantVideos, wantStreams), seen, targetLimit), 
  {
    items: items,
    channelTabFallbackPending: items.length > 0
  };
}, findSelectedChannelTabContentFromTabs = function(tabs) {
  for (var list = Array.isArray(tabs) ? tabs : [], i = 0; i < list.length; i++) {
    var tab = getIn(list, [ i, "tabRenderer" ], null);
    if (tab && tab.selected) return tab.content || tab;
  }
  for (var j = 0; j < list.length; j++) {
    var expandable = getIn(list, [ j, "expandableTabRenderer" ], null);
    if (expandable && expandable.selected) return expandable.content || expandable;
  }
  return null;
}, collectChannelHomePreviewSectionsDirect = function(node) {
  for (var sectionList = getIn(node, [ "sectionListRenderer", "contents" ], []), sections = [], i = 0; i < sectionList.length; i++) {
    var entry = sectionList[i] || {};
    entry.shelfRenderer && sections.push(entry.shelfRenderer), entry.richShelfRenderer && sections.push(entry.richShelfRenderer);
    for (var contents = getIn(entry, [ "itemSectionRenderer", "contents" ], []), j = 0; j < contents.length; j++) contents[j] && contents[j].shelfRenderer && sections.push(contents[j].shelfRenderer), 
    contents[j] && contents[j].richShelfRenderer && sections.push(contents[j].richShelfRenderer);
  }
  return sections;
}, collectChannelHomeSectionVideoRenderers = function(section, limit) {
  for (var directLists = [ getIn(section, [ "content", "horizontalListRenderer", "items" ], []), getIn(section, [ "content", "gridRenderer", "items" ], []), getIn(section, [ "content", "expandedShelfContentsRenderer", "items" ], []), getIn(section, [ "contents" ], []) ], maxItems = Math.floor(getNumber(limit)), out = [], i = 0; i < directLists.length && (!maxItems || out.length < maxItems); i++) for (var list = Array.isArray(directLists[i]) ? directLists[i] : [], j = 0; j < list.length && (!maxItems || out.length < maxItems); j++) pushImmediateVideoRenderers(list[j], out, maxItems);
  if (out.length) return out;
  var fallback = collectVideos(section);
  return !maxItems || fallback.length <= maxItems ? fallback : fallback.slice(0, maxItems);
}, pushImmediateVideoRenderers = function(node, out, limit) {
  if (node && "object" == typeof node && !(limit && out.length >= limit || (node.videoWithContextRenderer ? out.push(node.videoWithContextRenderer) : node.compactVideoRenderer ? out.push(node.compactVideoRenderer) : node.gridVideoRenderer ? out.push(node.gridVideoRenderer) : node.endScreenVideoRenderer && out.push(node.endScreenVideoRenderer), 
  limit && out.length >= limit))) {
    var richContent = getIn(node, [ "richItemRenderer", "content" ], null);
    richContent && pushImmediateVideoRenderers(richContent, out, limit);
  }
}, appendUniqueChannelItems = function(items, additions, seen, limit) {
  for (var list = Array.isArray(additions) ? additions : [], i = 0; i < list.length; i++) {
    if (limit && items.length >= limit) return;
    var item = list[i] || {}, id = getString(item.videoId);
    id && !seen[id] && (seen[id] = !0, items.push(item));
  }
}, loadChannelHomePreviewLimit = function() {
  var limit = loadChannelListChunkSize() * CHANNEL_HOME_PREVIEW_MULTIPLIER;
  return limit < CHANNEL_HOME_PREVIEW_MIN_ITEMS && (limit = CHANNEL_HOME_PREVIEW_MIN_ITEMS), 
  limit > CHANNEL_HOME_PREVIEW_MAX_ITEMS && (limit = CHANNEL_HOME_PREVIEW_MAX_ITEMS), 
  limit;
}, findDescriptionPanel = function(initialData) {
  for (var panels = getIn(initialData, [ "engagementPanels" ], []), i = 0; i < panels.length; i++) {
    var panel = getIn(panels, [ i, "engagementPanelSectionListRenderer" ], {});
    if ("video-description-ep-identifier" === panel.panelIdentifier) for (var items = getIn(panel, [ "content", "structuredDescriptionContentRenderer", "items" ], []), j = 0; j < items.length; j++) {
      var body = getIn(items, [ j, "expandableVideoDescriptionBodyRenderer" ], {}), text = textOf(body.attributedDescriptionBodyText) || textOf(body.descriptionBodyText);
      if (text = trimTo(text, 2e3)) return text;
    }
  }
  return "";
}, splitMetadataLine = function(line) {
  var text = getString(line);
  if (!text) return {
    viewCount: "",
    date: ""
  };
  var parts = text.split("·").map(function(item) {
    return item.trim();
  }).filter(function(item) {
    return item.length > 0;
  });
  return 0 === parts.length ? {
    viewCount: "",
    date: ""
  } : 1 === parts.length ? {
    viewCount: parts[0],
    date: ""
  } : {
    viewCount: parts[0],
    date: parts[1]
  };
}, extractCommentsContinuation = function(initialData) {
  for (var panels = getIn(initialData, [ "engagementPanels" ], []), i = 0; i < panels.length; i++) {
    var panel = getIn(panels, [ i, "engagementPanelSectionListRenderer" ], {});
    if ("engagement-panel-comments-section" === panel.panelIdentifier) {
      var contents = getIn(panel, [ "content", "sectionListRenderer", "contents" ], []), token = extractContinuationToken(contents);
      if (token) return token;
    }
  }
  return "";
}, parseComments = function(items) {
  var threads = [];
  collectRendererInstances(items, "commentThreadRenderer", threads);
  for (var out = [], i = 0; i < threads.length; i++) {
    var root = getIn(threads, [ i, "comment", "commentRenderer" ], null);
    root && out.push(toCommentItem(root, 0));
    var replies = getIn(threads, [ i, "replies", "commentRepliesRenderer", "contents" ], []), replyRenderers = [];
    collectRendererInstances(replies, "commentRenderer", replyRenderers);
    for (var j = 0; j < replyRenderers.length; j++) out.push(toCommentItem(replyRenderers[j], 1));
  }
  return out;
}, toCommentItem = function(renderer, level) {
  return {
    link: "https://www.youtube.com/comment/" + getString(renderer.commentId),
    author: textOf(renderer.authorText) || "YouTube User",
    avatar: thumbnailFrom(renderer.authorThumbnail),
    date: textOf(renderer.publishedTimeText),
    likeCount: textOf(renderer.voteCount),
    content: trimTo(textOf(renderer.contentText), 1200),
    level: level || 0
  };
}, normalizeVideoItems = function(renderers, query) {
  for (var items = [], i = 0; i < renderers.length; i++) {
    var item = toVideoItem(renderers[i], query);
    item && item.videoId && items.push(item);
  }
  return dedupeByVideoId(items);
}, toVideoItem = function(renderer) {
  var videoId = getString(renderer.videoId) || getIn(renderer, [ "navigationEndpoint", "watchEndpoint", "videoId" ], "");
  if (!videoId) return null;
  var channel = extractChannelInfoFromVideoRenderer(renderer), title = textOf(renderer.title) || textOf(renderer.headline) || "Untitled", author = textOf(renderer.shortBylineText) || textOf(renderer.longBylineText) || textOf(renderer.ownerText) || channel.channelTitle, viewCount = textOf(renderer.viewCountText) || textOf(renderer.shortViewCountText), likeCount = textOf(renderer.voteCount), date = textOf(renderer.publishedTimeText), duration = textOf(renderer.lengthText), metaParts = [];
  duration && metaParts.push(duration), viewCount && metaParts.push(viewCount), date && metaParts.push(date);
  var item = {
    link: watchURL(videoId),
    videoId: videoId,
    title: title,
    author: author,
    memo: metaParts.join(" - "),
    date: date,
    viewCount: viewCount,
    mediaUrl: thumbnailFrom(renderer.thumbnail) || thumbnailFromVideoId(videoId),
    mediaType: "image",
    types: detectVideoItemTypes(renderer),
    menus: [ ITEM_MENU_OPEN_BROWSER, ITEM_MENU_OPEN_VIDEO, ITEM_MENU_OPEN_CHANNEL ],
    channelUrl: channel.channelUrl,
    channelId: channel.channelId,
    channelTitle: channel.channelTitle || author,
    channelAvatar: channel.channelAvatar,
    channelMemo: channel.channelMemo
  };
  return likeCount && (item.likeCount = likeCount), item;
}, detectVideoItemTypes = function(renderer) {
  var types = [ "video" ];
  return isLikelyStreamRenderer(renderer) && types.push("stream"), types;
}, isLikelyStreamRenderer = function(renderer) {
  if (!renderer || "object" != typeof renderer) return !1;
  if (getString(getIn(renderer, [ "upcomingEventData", "startTime" ], ""))) return !0;
  for (var overlays = getIn(renderer, [ "thumbnailOverlays" ], []), i = 0; i < overlays.length; i++) {
    var status = getIn(overlays, [ i, "thumbnailOverlayTimeStatusRenderer" ], null);
    if (status) {
      var style = getString(status.style).toUpperCase();
      if (style.indexOf("LIVE") >= 0 || style.indexOf("UPCOMING") >= 0) return !0;
      if (isLiveLikeText(textOf(status.text)) || isLiveLikeText(textOf(getIn(status, [ "accessibility", "accessibilityData", "label" ], "")))) return !0;
    }
  }
  for (var badges = getIn(renderer, [ "badges" ], []), j = 0; j < badges.length; j++) {
    var badge = getIn(badges, [ j, "metadataBadgeRenderer" ], null);
    if (badge && (isLiveLikeText(getString(badge.style)) || isLiveLikeText(textOf(badge.label)) || isLiveLikeText(textOf(badge.tooltip)))) return !0;
  }
  return isLiveLikeText(textOf(renderer.publishedTimeText));
}, isLiveLikeText = function(text) {
  var value = getString(text).toLowerCase();
  return !!value && (value.indexOf("live") >= 0 || value.indexOf("stream") >= 0 || value.indexOf("upcoming") >= 0);
}, markItemsAsStream = function(items) {
  for (var out = [], i = 0; i < items.length; i++) {
    var item = cloneObject(items[i] || {}), types = Array.isArray(item.types) ? item.types.slice() : [ "video" ];
    types.indexOf("stream") < 0 && types.push("stream"), item.types = types, item.memo || (item.memo = "Live stream"), 
    out.push(item);
  }
  return out;
}, filterChannelItemsForOptions = function(items, wantVideos, wantStreams) {
  for (var out = [], i = 0; i < items.length; i++) {
    var item = items[i] || {}, isStream = Array.isArray(item.types) && item.types.indexOf("stream") >= 0;
    (wantVideos && wantStreams || wantStreams && isStream || wantVideos && !isStream) && out.push(item);
  }
  return out;
}, hydrateChannelItems = function(items, channel) {
  for (var list = Array.isArray(items) ? items : [], info = channel || {}, i = 0; i < list.length; i++) {
    var item = list[i];
    item && "object" == typeof item && (item.channelUrl = getString(item.channelUrl) || getString(info.channelUrl), 
    item.channelId = getString(item.channelId) || getString(info.channelId), item.channelTitle = getString(item.channelTitle) || getString(info.channelTitle), 
    item.channelAvatar = getString(item.channelAvatar) || getString(info.channelAvatar), 
    item.channelMemo = getString(item.channelMemo) || getString(info.channelMemo), getString(item.author) || (item.author = item.channelTitle || getString(info.channelTitle)));
  }
  return list;
}, extractChannelInfoFromVideoRenderer = function(renderer) {
  var nav = getIn(renderer, [ "shortBylineText", "runs", 0, "navigationEndpoint" ], null);
  nav || (nav = getIn(renderer, [ "longBylineText", "runs", 0, "navigationEndpoint" ], null)), 
  nav || (nav = getIn(renderer, [ "ownerText", "runs", 0, "navigationEndpoint" ], null));
  var channelId = getString(getIn(nav, [ "browseEndpoint", "browseId" ], "")), channelPath = getString(getIn(nav, [ "commandMetadata", "webCommandMetadata", "url" ], ""));
  channelPath || (channelPath = getString(getIn(nav, [ "browseEndpoint", "canonicalBaseUrl" ], ""))), 
  !channelPath && channelId && (channelPath = "/channel/" + channelId);
  var channelTitle = textOf(renderer.shortBylineText) || textOf(renderer.longBylineText) || textOf(renderer.ownerText), channelAvatar = thumbnailFrom(getIn(renderer, [ "channelThumbnailSupportedRenderers", "channelThumbnailWithLinkRenderer", "thumbnail" ], {})) || thumbnailFrom(getIn(renderer, [ "channelThumbnail" ], {}));
  return {
    channelUrl: normalizeChannelUrl(channelPath),
    channelId: channelId,
    channelTitle: channelTitle,
    channelAvatar: channelAvatar,
    channelMemo: ""
  };
}, collectVideos = function(node) {
  var renderers = [];
  return collectRendererInstances(node, "videoWithContextRenderer", renderers), collectRendererInstances(node, "compactVideoRenderer", renderers), 
  collectRendererInstances(node, "gridVideoRenderer", renderers), collectRendererInstances(node, "endScreenVideoRenderer", renderers), 
  renderers;
}, collectRendererInstances = function(node, rendererName, out) {
  if (node) if (Array.isArray(node)) for (var i = 0; i < node.length; i++) collectRendererInstances(node[i], rendererName, out); else if ("object" == typeof node) for (var key in node[rendererName] && out.push(node[rendererName]), 
  node) Object.prototype.hasOwnProperty.call(node, key) && collectRendererInstances(node[key], rendererName, out);
}, extractContinuationItems = function(response) {
  var out = [], buckets = [];
  Array.isArray(response.onResponseReceivedCommands) && (buckets = buckets.concat(response.onResponseReceivedCommands)), 
  Array.isArray(response.onResponseReceivedActions) && (buckets = buckets.concat(response.onResponseReceivedActions)), 
  Array.isArray(response.onResponseReceivedEndpoints) && (buckets = buckets.concat(response.onResponseReceivedEndpoints));
  for (var i = 0; i < buckets.length; i++) {
    var item = buckets[i] || {}, append = getIn(item, [ "appendContinuationItemsAction", "continuationItems" ], null), reload = getIn(item, [ "reloadContinuationItemsCommand", "continuationItems" ], null);
    Array.isArray(append) && (out = out.concat(append)), Array.isArray(reload) && (out = out.concat(reload));
  }
  return out;
}, extractContinuationToken = function(node) {
  var continuations = [];
  collectRendererInstances(node, "continuationItemRenderer", continuations);
  for (var i = 0; i < continuations.length; i++) {
    var token = getIn(continuations, [ i, "continuationEndpoint", "continuationCommand", "token" ], "");
    if (token) return token;
  }
  return "";
}, findRenderer = function(node, rendererName) {
  var list = [];
  return collectRendererInstances(node, rendererName, list), list.length ? list[0] : null;
}, extractInnertubeConfig = function(html) {
  var extractedApiKey = extractQuotedConfig(html, "INNERTUBE_API_KEY"), cfg = {
    apiKey: resolveApiKey(extractedApiKey),
    clientName: extractQuotedConfig(html, "INNERTUBE_CLIENT_NAME") || DEFAULT_CLIENT_NAME,
    clientVersion: extractQuotedConfig(html, "INNERTUBE_CLIENT_VERSION") || DEFAULT_CLIENT_VERSION,
    hl: extractQuotedConfig(html, "HL") || DEFAULT_HL,
    gl: extractQuotedConfig(html, "GL") || DEFAULT_GL
  };
  return applyLocaleToConfig(cfg), saveInnertubeConfigCache(cfg) || cfg;
}, extractQuotedConfig = function(html, key) {
  if (!html || !key) return "";
  var pattern = new RegExp('"' + key + '":"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"'), match = html.match(pattern);
  return match && match[1] ? decodeCommonEscapes(match[1]) : "";
}, defaultConfig = function() {
  var cfg = {
    apiKey: resolveApiKey(""),
    clientName: DEFAULT_CLIENT_NAME,
    clientVersion: DEFAULT_CLIENT_VERSION,
    hl: DEFAULT_HL,
    gl: DEFAULT_GL
  };
  return applyLocaleToConfig(cfg), cfg;
}, normalizeInnertubeConfig = function(cfg) {
  if (!cfg || "object" != typeof cfg) return null;
  var out = {
    apiKey: resolveApiKey(cfg.apiKey),
    clientName: getString(cfg.clientName) || DEFAULT_CLIENT_NAME,
    clientVersion: getString(cfg.clientVersion) || DEFAULT_CLIENT_VERSION,
    hl: getString(cfg.hl) || DEFAULT_HL,
    gl: getString(cfg.gl) || DEFAULT_GL,
    acceptLanguage: getString(cfg.acceptLanguage)
  };
  return applyLocaleToConfig(out), out;
}, loadInnertubeConfigCache = function() {
  if (innertubeConfigCache && innertubeConfigCache.apiKey) return (innertubeConfigCache = normalizeInnertubeConfig(innertubeConfigCache) || null) ? cloneObject(innertubeConfigCache) : null;
  if ("undefined" == typeof sessionStorage || !sessionStorage || "function" != typeof sessionStorage.getItem) return null;
  var raw = null;
  try {
    raw = sessionStorage.getItem(INNERTUBE_CONFIG_CACHE_KEY);
  } catch (e) {
    raw = null;
  }
  if (!raw) return null;
  var parsed = raw;
  if ("string" == typeof raw) try {
    parsed = JSON.parse(raw);
  } catch (e2) {
    return null;
  }
  var normalized = normalizeInnertubeConfig(parsed);
  return normalized && normalized.apiKey ? (innertubeConfigCache = cloneObject(normalized), 
  cloneObject(normalized)) : null;
}, saveInnertubeConfigCache = function(cfg) {
  var normalized = normalizeInnertubeConfig(cfg);
  if (!normalized || !normalized.apiKey) return normalized;
  if (innertubeConfigCache = cloneObject(normalized), "undefined" != typeof sessionStorage && sessionStorage && "function" == typeof sessionStorage.setItem) try {
    sessionStorage.setItem(INNERTUBE_CONFIG_CACHE_KEY, JSON.stringify(innertubeConfigCache));
  } catch (e) {}
  return cloneObject(normalized);
}, resolveInnertubeConfig = function(apiCfg) {
  var provided = normalizeInnertubeConfig(apiCfg);
  if (provided && provided.apiKey) return saveInnertubeConfigCache(provided) || provided;
  var cached = loadInnertubeConfigCache();
  return cached && cached.apiKey ? cached : provided || defaultConfig();
}, buildInnertubeContext = function(apiCfg) {
  var cfg = resolveInnertubeConfig(apiCfg);
  return {
    client: {
      hl: cfg.hl || DEFAULT_HL,
      gl: cfg.gl || DEFAULT_GL,
      clientName: cfg.clientName || DEFAULT_CLIENT_NAME,
      clientVersion: cfg.clientVersion || DEFAULT_CLIENT_VERSION,
      platform: "MOBILE"
    }
  };
}, extractJSONVar = function(html, varName) {
  var marker = "var " + varName + " = ", start = html.indexOf(marker);
  if (start < 0) return null;
  for (start += marker.length; start < html.length && isSpaceChar(html.charCodeAt(start)); ) start++;
  if ("'" === html[start]) {
    var str = decodeQuotedStringLiteral(html, start);
    if (!str) return null;
    try {
      return JSON.parse(str.value);
    } catch (e) {
      try {
        return JSON.parse(latin1ToUtf8(str.value));
      } catch (e2) {
        return null;
      }
    }
  }
  if ("{" === html[start]) {
    var end = findMatchingJSONEnd(html, start);
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
}, extractJSONFragmentObject = function(html, marker) {
  return extractJSONFragmentWithMarker(html, marker, "{");
}, extractJSONFragmentArray = function(html, marker) {
  return extractJSONFragmentWithMarker(html, marker, "[");
}, extractJSONFragmentWithMarker = function(html, marker, startChar) {
  if (!html || !marker || !startChar) return null;
  var start = html.indexOf(marker);
  if (start < 0) return null;
  for (start += marker.length; start < html.length && isSpaceChar(html.charCodeAt(start)); ) start++;
  if (html[start] !== startChar) return null;
  var end = findMatchingJSONEnd(html, start);
  if (end <= start) return null;
  try {
    return JSON.parse(html.slice(start, end + 1));
  } catch (e) {
    return null;
  }
}, decodeQuotedStringLiteral = function(input, quoteIndex) {
  var quote = input[quoteIndex];
  if ("'" !== quote && '"' !== quote) return null;
  for (var i = quoteIndex + 1, len = input.length, nextQuote = input.indexOf(quote, i); i < len; ) {
    var nextEscape = input.indexOf("\\", i);
    if (nextQuote < i && (nextQuote = input.indexOf(quote, i)), nextQuote >= 0 && nextQuote < (nextEscape >= 0 ? nextEscape : len)) {
      var literal = input.slice(quoteIndex, nextQuote + 1);
      try {
        return {
          value: new Function("return " + literal)(),
          endIndex: nextQuote
        };
      } catch (e) {
        return null;
      }
    }
    if (nextEscape < 0) break;
    i = nextEscape + 2;
  }
  return null;
}, decodeCommonEscapes = function(input) {
  for (var out = [], i = 0; i < input.length; i++) {
    var ch = input[i];
    if ("\\" === ch) {
      if (i + 1 >= input.length) break;
      var next = input[++i];
      if ("x" !== next) if ("u" !== next) "n" !== next ? "r" !== next ? "t" !== next ? "b" !== next ? "f" !== next ? "v" !== next ? "\\" !== next ? '"' !== next ? "'" !== next ? "/" !== next ? out.push(next) : out.push("/") : out.push("'") : out.push('"') : out.push("\\") : out.push("\v") : out.push("\f") : out.push("\b") : out.push("\t") : out.push("\r") : out.push("\n"); else {
        var hex4 = input.slice(i + 1, i + 5);
        /^[0-9a-fA-F]{4}$/.test(hex4) ? (out.push(String.fromCharCode(parseInt(hex4, 16))), 
        i += 4) : out.push("u");
      } else {
        var hex2 = input.slice(i + 1, i + 3);
        /^[0-9a-fA-F]{2}$/.test(hex2) ? (out.push(String.fromCharCode(parseInt(hex2, 16))), 
        i += 2) : out.push("x");
      }
    } else out.push(ch);
  }
  return out.join("");
}, latin1ToUtf8 = function(input) {
  for (var bytes = [], i = 0; i < input.length; i++) {
    var code = input.charCodeAt(i);
    code <= 255 ? bytes.push(code) : code <= 2047 ? (bytes.push(192 | code >> 6), bytes.push(128 | 63 & code)) : (bytes.push(224 | code >> 12), 
    bytes.push(128 | code >> 6 & 63), bytes.push(128 | 63 & code));
  }
  return utf8BytesToString(bytes);
}, utf8BytesToString = function(bytes) {
  for (var out = [], i = 0; i < bytes.length; ) {
    var b0 = bytes[i];
    if (b0 < 128) out.push(String.fromCharCode(b0)), i++; else if (192 == (224 & b0) && i + 1 < bytes.length) {
      var cp2 = (31 & b0) << 6 | 63 & bytes[i + 1];
      out.push(String.fromCharCode(cp2)), i += 2;
    } else if (224 == (240 & b0) && i + 2 < bytes.length) {
      var cp3 = (15 & b0) << 12 | (63 & bytes[i + 1]) << 6 | 63 & bytes[i + 2];
      out.push(String.fromCharCode(cp3)), i += 3;
    } else if (240 == (248 & b0) && i + 3 < bytes.length) {
      var cp4 = (7 & b0) << 18 | (63 & bytes[i + 1]) << 12 | (63 & bytes[i + 2]) << 6 | 63 & bytes[i + 3];
      cp4 -= 65536, out.push(String.fromCharCode(55296 + (cp4 >> 10 & 1023))), out.push(String.fromCharCode(56320 + (1023 & cp4))), 
      i += 4;
    } else out.push(String.fromCharCode(b0)), i++;
  }
  return out.join("");
}, findMatchingJSONEnd = function(text, start) {
  var openChar = text[start], closeChar = "{" === openChar ? "}" : "[" === openChar ? "]" : "";
  if (!closeChar) return -1;
  for (var depth = 0, inString = !1, quote = "", escaped = !1, i = start; i < text.length; i++) {
    var ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = !1;
        continue;
      }
      if ("\\" === ch) {
        escaped = !0;
        continue;
      }
      ch === quote && (inString = !1);
    } else if ('"' !== ch && "'" !== ch) if (ch !== openChar) {
      if (ch === closeChar && 0 === --depth) return i;
    } else depth++; else inString = !0, quote = ch;
  }
  return -1;
}, findMatchingBrace = function(text, start) {
  return findMatchingJSONEnd(text, start);
}, isSpaceChar = function(code) {
  return 9 === code || 10 === code || 13 === code || 32 === code;
}, dedupeByVideoId = function(items) {
  for (var seen = {}, out = [], i = 0; i < items.length; i++) {
    var id = getString(items[i] && items[i].videoId);
    id && !seen[id] && (seen[id] = !0, out.push(items[i]));
  }
  return out;
}, textOf = function(node) {
  if (null == node) return "";
  if ("string" == typeof node) return node;
  if ("number" == typeof node) return String(node);
  if (Array.isArray(node)) {
    for (var arr = [], i = 0; i < node.length; i++) {
      var part = textOf(node[i]);
      part && arr.push(part);
    }
    return arr.join("");
  }
  if ("object" == typeof node) {
    if ("string" == typeof node.simpleText) return node.simpleText;
    if ("string" == typeof node.content) return node.content;
    if (Array.isArray(node.runs)) {
      for (var runParts = [], j = 0; j < node.runs.length; j++) {
        var text = textOf(node.runs[j]);
        text && runParts.push(text);
      }
      return runParts.join("");
    }
    if ("string" == typeof node.text) return node.text;
    var acc = getIn(node, [ "accessibility", "accessibilityData", "label" ], "");
    if (acc) return acc;
  }
  return "";
}, thumbnailFrom = function(node) {
  var thumbs = getIn(node, [ "thumbnails" ], []);
  if (!Array.isArray(thumbs) || !thumbs.length) return "";
  var best = thumbs[thumbs.length - 1] || thumbs[0] || {}, url = getString(best.url);
  return 0 === url.indexOf("//") ? "https:" + url : url;
}, thumbnailFromVideoId = function(videoId) {
  return videoId ? "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg" : "";
}, parseVideoId = function(url) {
  var input = getString(url);
  if (!input) return "";
  var direct = input.match(/^[a-zA-Z0-9_-]{11}$/);
  if (direct) return direct[0];
  var watchMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];
  var shortMatch = input.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];
  var youtuMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return youtuMatch && youtuMatch[1] ? youtuMatch[1] : "";
}, watchURL = function(videoId) {
  return YT_ORIGIN + "/watch?v=" + encodeURIComponent(videoId);
}, appendQueryParam = function(url, key, value) {
  var out = getString(url);
  if (!out || !key) return out;
  var encodedValue = getString(value);
  if (!encodedValue) return out;
  var separator = out.indexOf("?") >= 0 ? "&" : "?";
  return out + separator + encodeURIComponent(key) + "=" + encodeURIComponent(encodedValue);
}, localizedURL = function(url, cfg) {
  var target = getString(url);
  if (!target) return target;
  var locale = cfg || defaultConfig();
  return target = appendQueryParam(target, "hl", locale.hl || DEFAULT_HL), target = appendQueryParam(target, "gl", locale.gl || DEFAULT_GL), 
  target = appendQueryParam(target, "persist_hl", "1"), target = appendQueryParam(target, "persist_gl", "1");
}, normalizeChannelUrl = function(channelUrl) {
  var absolute = toAbsoluteURL(channelUrl);
  if (!absolute) return "";
  var clean = absolute.split("#")[0].split("?")[0];
  for (clean = clean.replace(/^https?:\/\/(?:www\.)?youtube\.com/i, YT_ORIGIN).replace(/^https?:\/\/m\.youtube\.com/i, YT_ORIGIN); clean.length > YT_ORIGIN.length + 1 && "/" === clean[clean.length - 1]; ) clean = clean.slice(0, -1);
  return clean;
}, stripChannelTabSuffix = function(channelUrl) {
  var normalized = normalizeChannelUrl(channelUrl);
  return normalized ? normalized.replace(/\/(videos|streams|shorts|live)$/i, "") : "";
}, toChannelTabURL = function(channelUrl, tabName) {
  var base = stripChannelTabSuffix(channelUrl), tab = getString(tabName).toLowerCase();
  return base ? tab ? base + "/" + tab : base : "";
}, toChannelSearchURL = function(channelUrl, query) {
  var base = stripChannelTabSuffix(channelUrl), q = cleanQuery(query);
  return base ? q ? base + "/search?query=" + encodeURIComponent(q) : base : "";
}, makeChannelPageCacheKey = function(channelUrl, channelId, options) {
  var normalizedUrl = normalizeChannelUrl(channelUrl);
  return [ normalizedUrl || "", getString(channelId) || extractChannelIdFromUrl(normalizedUrl) || "", cleanQuery(options && options.query) || "", normalizeEnabledFlag(options && options.videos) ? "1" : "0", normalizeEnabledFlag(options && options.streams) ? "1" : "0" ].join("|");
}, touchChannelPageCacheKey = function(cacheKey) {
  if (cacheKey) {
    for (var nextOrder = [], i = 0; i < channelPageCacheOrder.length; i++) channelPageCacheOrder[i] !== cacheKey && nextOrder.push(channelPageCacheOrder[i]);
    nextOrder.push(cacheKey), channelPageCacheOrder = nextOrder;
  }
}, getCachedChannelPage = function(channelUrl, channelId, options) {
  var cacheKey = makeChannelPageCacheKey(channelUrl, channelId, options);
  if (!cacheKey) return null;
  var entry = channelPageCache[cacheKey];
  return entry ? Date.now() - getNumber(entry.savedAt) > CHANNEL_PAGE_CACHE_TTL_MS ? (delete channelPageCache[cacheKey], 
  null) : (touchChannelPageCacheKey(cacheKey), cloneObject(entry.page)) : null;
}, saveCachedChannelPage = function(channelUrl, channelId, options, page) {
  var cacheKey = makeChannelPageCacheKey(channelUrl, channelId, options);
  if (cacheKey && page && "object" == typeof page) for (channelPageCache[cacheKey] = {
    savedAt: Date.now(),
    page: cloneObject(page)
  }, touchChannelPageCacheKey(cacheKey); channelPageCacheOrder.length > CHANNEL_PAGE_CACHE_LIMIT; ) {
    var oldest = channelPageCacheOrder.shift();
    if (!oldest) break;
    delete channelPageCache[oldest];
  }
}, toAbsoluteURL = function(pathOrURL) {
  var value = getString(pathOrURL);
  return value ? 0 === value.indexOf("http://") || 0 === value.indexOf("https://") ? value : 0 === value.indexOf("//") ? "https:" + value : ("/" !== value[0] && (value = "/" + value), 
  YT_ORIGIN + value) : "";
}, getHeaderValue = function(headers, name) {
  if (!headers || !name) return "";
  var key = getString(name).toLowerCase();
  try {
    if ("function" == typeof headers.get) return getString(headers.get(name) || headers.get(key));
  } catch (e) {}
  return getString(headers[name] || headers[key]);
}, resolveURL = function(baseURL, location) {
  var base = getString(baseURL), target = getString(location);
  if (!target) return base;
  if (0 === target.indexOf("http://") || 0 === target.indexOf("https://")) return target;
  if (0 === target.indexOf("//")) return "https:" + target;
  if ("/" === target[0]) {
    var origin = YT_ORIGIN, hostMatch = base.match(/^https?:\/\/[^/]+/);
    return hostMatch && hostMatch[0] && (origin = hostMatch[0].replace(/^http:/, "https:")), 
    origin + target;
  }
  var idx = base.lastIndexOf("/");
  return idx < 0 ? YT_ORIGIN + "/" + target : base.slice(0, idx + 1) + target;
}, getIn = function(obj, path, fallback) {
  for (var cur = obj, i = 0; i < path.length; i++) {
    if (null == cur) return fallback;
    cur = cur[path[i]];
  }
  return void 0 === cur ? fallback : cur;
}, trimTo = function(value, maxLen) {
  var text = getString(value);
  return text.length <= maxLen ? text : text.slice(0, maxLen - 3) + "...";
}, cleanQuery = function(value) {
  return getString(value).replace(/\s+/g, " ").trim();
}, showSnackbar = function(viewId, message) {
  synura.update(viewId, {
    models: {
      snackbar: message
    }
  });
}, openBrowser = function(url, title) {
  synura.open({
    view: "/views/browser",
    styles: {
      title: title || "Browser"
    },
    models: {
      url: url
    }
  });
}, makeStarredChannelKey = function(channelUrl, channelId) {
  var id = getString(channelId) || extractChannelIdFromUrl(channelUrl);
  if (id) return "id:" + id;
  var url = normalizeChannelUrl(channelUrl);
  return url ? "url:" + url.toLowerCase() : "";
}, extractChannelIdFromUrl = function(channelUrl) {
  var normalized = normalizeChannelUrl(channelUrl);
  if (!normalized) return "";
  var match = normalized.match(/\/channel\/([A-Za-z0-9_-]+)/i);
  return match && match[1] ? getString(match[1]) : "";
}, normalizeStarredIdentity = function(channelUrl, channelId) {
  var normalizedUrl = normalizeChannelUrl(channelUrl), normalizedId = getString(channelId) || extractChannelIdFromUrl(normalizedUrl);
  return !normalizedUrl && normalizedId && (normalizedUrl = normalizeChannelUrl("/channel/" + normalizedId)), 
  {
    channelUrl: normalizedUrl,
    channelId: normalizedId
  };
}, channelsEquivalent = function(leftUrl, leftId, rightUrl, rightId) {
  var left = normalizeStarredIdentity(leftUrl, leftId), right = normalizeStarredIdentity(rightUrl, rightId);
  return !(!left.channelId || !right.channelId || left.channelId !== right.channelId) || !(!left.channelUrl || !right.channelUrl || left.channelUrl.toLowerCase() !== right.channelUrl.toLowerCase());
}, normalizeChannelTitleKey = function(value) {
  return getString(value).replace(/\s+/g, " ").trim().toLowerCase();
}, normalizeChannelAvatarKey = function(value) {
  var avatar = getString(value).trim();
  return avatar ? avatar.split("?")[0].toLowerCase() : "";
}, channelsLikelySame = function(left, right) {
  var l = left || {}, r = right || {};
  if (channelsEquivalent(l.channelUrl, l.channelId, r.channelUrl, r.channelId)) return !0;
  var leftTitle = normalizeChannelTitleKey(l.channelTitle), rightTitle = normalizeChannelTitleKey(r.channelTitle);
  if (!leftTitle || !rightTitle || leftTitle !== rightTitle) return !1;
  var leftAvatar = normalizeChannelAvatarKey(l.channelAvatar), rightAvatar = normalizeChannelAvatarKey(r.channelAvatar);
  return !(!leftAvatar || !rightAvatar || leftAvatar !== rightAvatar);
}, normalizeLanguageCode = function(value) {
  var raw = getString(value).replace(/_/g, "-").trim();
  if (!raw) return "";
  var lower = raw.toLowerCase();
  if ("zh-hans" === lower || "zh-cn" === lower) return "zh-CN";
  if ("zh-hant" === lower || "zh-tw" === lower) return "zh-TW";
  for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) {
    var item = YOUTUBE_LANGUAGES[i] || {}, code = getString(item.code), hl = getString(item.hl);
    if (code.toLowerCase() === lower || hl.toLowerCase() === lower) return code;
  }
  var dash = lower.indexOf("-");
  if (dash > 0) for (var primary = lower.slice(0, dash), j = 0; j < YOUTUBE_LANGUAGES.length; j++) {
    var fallbackCode = getString(YOUTUBE_LANGUAGES[j] && YOUTUBE_LANGUAGES[j].code);
    if (fallbackCode.toLowerCase() === primary) return fallbackCode;
  }
  return "";
}, findLanguageByCode = function(value) {
  var normalized = normalizeLanguageCode(value);
  if (!normalized) return null;
  for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) if (getString(YOUTUBE_LANGUAGES[i] && YOUTUBE_LANGUAGES[i].code) === normalized) return YOUTUBE_LANGUAGES[i];
  return null;
}, findLanguageByLabel = function(value) {
  var label = getString(value);
  if (!label) return null;
  for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) if (getString(YOUTUBE_LANGUAGES[i] && YOUTUBE_LANGUAGES[i].label) === label) return YOUTUBE_LANGUAGES[i];
  return null;
}, loadRuntimeLanguageCode = function() {
  if ("undefined" == typeof navigator || !navigator) return "";
  return normalizeLanguageCode(navigator.language);
}, getCurrentLanguageSetting = function() {
  var selected = findLanguageByCode(loadLanguageOverride()) || findLanguageByCode(loadRuntimeLanguageCode());
  return selected || (findLanguageByCode(DEFAULT_HL) || YOUTUBE_LANGUAGES[0]);
}, getLanguageOptions = function() {
  for (var options = [], i = 0; i < YOUTUBE_LANGUAGES.length; i++) options.push(getString(YOUTUBE_LANGUAGES[i] && YOUTUBE_LANGUAGES[i].label));
  return options;
}, languageCodeFromOption = function(value) {
  var byLabel = findLanguageByLabel(value);
  if (byLabel) return getString(byLabel.code);
  var byCode = findLanguageByCode(value);
  return byCode ? getString(byCode.code) : "";
}, sanitizeApiKey = function(value) {
  return getString(value).replace(/\s+/g, "").trim();
}, loadApiKeyOverride = function() {
  return "undefined" != typeof localStorage && localStorage && "function" == typeof localStorage.getItem ? sanitizeApiKey(localStorage.getItem(API_KEY_OVERRIDE_STORAGE_KEY)) : "";
}, saveApiKeyOverride = function(apiKey) {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.setItem) return !1;
  var key = sanitizeApiKey(apiKey);
  if (!key) return !1;
  try {
    return localStorage.setItem(API_KEY_OVERRIDE_STORAGE_KEY, key), !0;
  } catch (e) {
    return !1;
  }
}, clearApiKeyOverride = function() {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.removeItem) return !1;
  try {
    return localStorage.removeItem(API_KEY_OVERRIDE_STORAGE_KEY), !0;
  } catch (e) {
    return !1;
  }
}, loadLanguageOverride = function() {
  return "undefined" != typeof localStorage && localStorage && "function" == typeof localStorage.getItem ? normalizeLanguageCode(localStorage.getItem(LANGUAGE_OVERRIDE_STORAGE_KEY)) : "";
}, saveLanguageOverride = function(languageCode) {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.setItem) return !1;
  var normalized = normalizeLanguageCode(languageCode);
  if (!normalized) return !1;
  try {
    return localStorage.setItem(LANGUAGE_OVERRIDE_STORAGE_KEY, normalized), !0;
  } catch (e) {
    return !1;
  }
}, clearLanguageOverride = function() {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.removeItem) return !1;
  try {
    return localStorage.removeItem(LANGUAGE_OVERRIDE_STORAGE_KEY), !0;
  } catch (e) {
    return !1;
  }
}, normalizeChannelListChunkSize = function(value, fallback) {
  var parsed = Math.floor(getNumber(value));
  if (parsed > 0) return parsed;
  var fallbackValue = Math.floor(getNumber(fallback));
  return fallbackValue > 0 ? fallbackValue : 0;
}, loadChannelListChunkSize = function() {
  return "undefined" != typeof localStorage && localStorage && "function" == typeof localStorage.getItem ? normalizeChannelListChunkSize(localStorage.getItem(CHANNEL_LIST_CHUNK_SIZE_STORAGE_KEY), DEFAULT_CHANNEL_LIST_CHUNK_SIZE) : DEFAULT_CHANNEL_LIST_CHUNK_SIZE;
}, saveChannelListChunkSize = function(value) {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.setItem) return !1;
  var normalized = normalizeChannelListChunkSize(value, 0);
  if (!normalized) return !1;
  try {
    return localStorage.setItem(CHANNEL_LIST_CHUNK_SIZE_STORAGE_KEY, String(normalized)), 
    !0;
  } catch (e) {
    return !1;
  }
}, clearChannelListChunkSize = function() {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.removeItem) return !1;
  try {
    return localStorage.removeItem(CHANNEL_LIST_CHUNK_SIZE_STORAGE_KEY), !0;
  } catch (e) {
    return !1;
  }
}, applyLocaleToConfig = function(cfg) {
  var out = cfg || {}, language = getCurrentLanguageSetting();
  return out.hl = getString(language && language.hl) || DEFAULT_HL, out.gl = getString(language && language.gl) || DEFAULT_GL, 
  out.acceptLanguage = getString(language && language.acceptLanguage) || "en-US,en;q=0.9", 
  out;
}, resolveAcceptLanguage = function(cfg) {
  var value = getString(cfg && cfg.acceptLanguage);
  if (value) return value;
  var language = getCurrentLanguageSetting();
  return (value = getString(language && language.acceptLanguage)) || "en-US,en;q=0.9";
}, resolveApiKey = function(candidate) {
  var override = loadApiKeyOverride();
  if (override) return override;
  var parsed = sanitizeApiKey(candidate);
  return parsed || DEFAULT_API_KEY;
}, normalizeEnabledFlag = function(value) {
  return !1 !== value && 0 !== value && "0" !== value && "false" !== value;
}, loadStarredChannels = function() {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.getItem) return [];
  var raw = localStorage.getItem(STARRED_CHANNELS_KEY);
  if (!raw) return [];
  var parsed = [];
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  for (var out = [], deduped = !1, i = 0; i < parsed.length; i++) {
    var item = parsed[i] || {}, identity = normalizeStarredIdentity(item.channelUrl || item.link || item.url, item.channelId);
    if (identity.channelUrl || identity.channelId) {
      for (var duplicateIndex = -1, j = 0; j < out.length; j++) if (channelsLikelySame({
        channelUrl: identity.channelUrl,
        channelId: identity.channelId,
        channelTitle: getString(item.channelTitle || item.title),
        channelAvatar: getString(item.channelAvatar || item.avatar)
      }, out[j])) {
        duplicateIndex = j;
        break;
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
      if (duplicateIndex < 0) out.push(next); else {
        deduped = !0;
        var prev = out[duplicateIndex] || {}, useNext = getNumber(next.savedAt) >= getNumber(prev.savedAt), newer = useNext ? next : prev, older = useNext ? prev : next;
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
    }
  }
  return deduped && saveStarredChannels(out), out;
}, saveStarredChannels = function(channels) {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.setItem) return !1;
  try {
    return localStorage.setItem(STARRED_CHANNELS_KEY, JSON.stringify(channels || [])), 
    !0;
  } catch (e) {
    return !1;
  }
}, isStarredChannel = function(channelUrl, channelId, channelTitle, channelAvatar) {
  var identity = normalizeStarredIdentity(channelUrl, channelId);
  if (!identity.channelUrl && !identity.channelId) return !1;
  for (var probe = {
    channelUrl: identity.channelUrl,
    channelId: identity.channelId,
    channelTitle: getString(channelTitle),
    channelAvatar: getString(channelAvatar)
  }, channels = loadStarredChannels(), i = 0; i < channels.length; i++) if (channelsLikelySame(probe, channels[i])) return !0;
  return !1;
}, upsertStarredChannel = function(channel) {
  var identity = normalizeStarredIdentity(channel && channel.channelUrl, channel && channel.channelId), normalizedUrl = identity.channelUrl, channelId = identity.channelId, hasEnabledInput = !(!channel || void 0 === channel.enabled), requestedEnabled = normalizeEnabledFlag(channel && channel.enabled);
  if (!normalizedUrl && !channelId) return !1;
  for (var channels = loadStarredChannels(), index = -1, i = 0; i < channels.length; i++) if (channelsLikelySame({
    channelUrl: normalizedUrl,
    channelId: channelId,
    channelTitle: getString(channel && channel.channelTitle),
    channelAvatar: getString(channel && channel.channelAvatar)
  }, channels[i])) {
    index = i;
    break;
  }
  var now = Date.now(), next = {
    channelUrl: normalizedUrl,
    channelId: channelId,
    channelTitle: getString(channel && channel.channelTitle),
    channelAvatar: getString(channel && channel.channelAvatar),
    channelMemo: getString(channel && channel.channelMemo),
    savedAt: now,
    enabled: !hasEnabledInput || requestedEnabled
  };
  if (index < 0) return channels.unshift(next), saveStarredChannels(channels), !0;
  var prev = channels[index] || {}, changed = getString(prev.channelTitle) !== next.channelTitle || getString(prev.channelAvatar) !== next.channelAvatar || getString(prev.channelMemo) !== next.channelMemo || getString(prev.channelUrl) !== next.channelUrl || getString(prev.channelId) !== next.channelId || normalizeEnabledFlag(prev.enabled) !== (hasEnabledInput ? requestedEnabled : normalizeEnabledFlag(prev.enabled));
  return channels[index] = {
    channelUrl: next.channelUrl,
    channelId: next.channelId,
    channelTitle: next.channelTitle || prev.channelTitle,
    channelAvatar: next.channelAvatar || prev.channelAvatar,
    channelMemo: next.channelMemo || prev.channelMemo,
    savedAt: getNumber(prev.savedAt) || now,
    enabled: hasEnabledInput ? requestedEnabled : normalizeEnabledFlag(prev.enabled)
  }, changed && saveStarredChannels(channels), changed;
}, removeStarredChannel = function(channelUrl, channelId, channelTitle, channelAvatar) {
  var identity = normalizeStarredIdentity(channelUrl, channelId);
  if (!identity.channelUrl && !identity.channelId) return !1;
  for (var probe = {
    channelUrl: identity.channelUrl,
    channelId: identity.channelId,
    channelTitle: getString(channelTitle),
    channelAvatar: getString(channelAvatar)
  }, channels = loadStarredChannels(), filtered = [], removed = !1, i = 0; i < channels.length; i++) channelsLikelySame(probe, channels[i]) ? removed = !0 : filtered.push(channels[i]);
  return removed && saveStarredChannels(filtered), removed;
}, extractChannelHandleFromUrl = function(channelUrl) {
  var normalized = stripChannelTabSuffix(channelUrl);
  if (!normalized) return "";
  var match = normalized.match(/\/(@[A-Za-z0-9._-]+)/);
  return match && match[1] ? getString(match[1]) : "";
}, formatSavedChannelDate = function(savedAt) {
  var timestamp = getNumber(savedAt);
  if (!timestamp) return "";
  var date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";
  var year = String(date.getFullYear()), month = String(date.getMonth() + 1), day = String(date.getDate());
  return month.length < 2 && (month = "0" + month), day.length < 2 && (day = "0" + day), 
  "Saved " + year + "-" + month + "-" + day;
}, buildSavedChannelAuthor = function(channel) {
  var handle = extractChannelHandleFromUrl(channel && channel.channelUrl);
  if (handle) return handle;
  var channelId = getString(channel && channel.channelId);
  return channelId || "Bookmarked";
}, buildSavedChannelMemo = function(channel) {
  var parts = [], memo = getString(channel && channel.channelMemo), savedText = formatSavedChannelDate(channel && channel.savedAt);
  return memo && parts.push(memo), savedText && parts.push(savedText), parts.join(" - ");
}, starredChannelsToListItems = function(channels) {
  var list = Array.isArray(channels) ? channels.slice() : [];
  list.sort(function(a, b) {
    return getNumber(b && b.savedAt) - getNumber(a && a.savedAt);
  });
  for (var items = [], i = 0; i < list.length; i++) {
    var channel = list[i] || {}, channelUrl = normalizeChannelUrl(channel.channelUrl);
    !channelUrl && channel.channelId && (channelUrl = normalizeChannelUrl("/channel/" + channel.channelId)), 
    channelUrl && (!1 !== normalizeEnabledFlag(channel.enabled) && items.push({
      link: channelUrl,
      channelUrl: channelUrl,
      channelId: getString(channel.channelId),
      channelTitle: getString(channel.channelTitle),
      channelAvatar: getString(channel.channelAvatar),
      channelMemo: getString(channel.channelMemo),
      title: getString(channel.channelTitle) || channelUrl,
      author: buildSavedChannelAuthor(channel),
      memo: buildSavedChannelMemo(channel),
      mediaUrl: getString(channel.channelAvatar),
      mediaType: "image",
      menus: [ ITEM_MENU_OPEN_BROWSER, ITEM_MENU_REMOVE_BOOKMARK ]
    }));
  }
  return items;
}, cloneObject = function(obj) {
  if (!obj || "object" != typeof obj) return {};
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
}, getString = function(value) {
  return null == value ? "" : String(value);
}, getNumber = function(value) {
  var n = Number(value);
  return isNaN(n) ? 0 : n;
};
