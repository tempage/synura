    // @ts-nocheck

    var DEFAULT_CACHE_TTL = SITE.defaultCacheTtlMs || 300000;
    var CACHE_PREFIX="cr:"+SITE.siteKey+":"+(SITE.cp||"");
    var CACHE_TTL_KEY = "community_cache_ttl_ms:" + SITE.siteKey;
    var CACHE_SNACKBAR_KEY = "community_cache_snackbar:" + SITE.siteKey;
    var CATEGORY_TWO_CHAR_KEY = "community_category_two_char:" + SITE.siteKey;
    var GALLERY_COLUMN_COUNT_KEY = "community_gallery_column_count:" + SITE.siteKey;
    var BOARD_VIEW_SETTINGS_KEY = "community_board_view_settings:" + SITE.siteKey;
    var CACHE_SNACKBAR_MIN_AGE_MS = 10000;
    var DEFAULT_GALLERY_COLUMN_COUNT = 3;
    var COOKIE_KEY = "community_cookie:" + SITE.siteKey;
    var CUSTOM_BOARDS_KEY = "community_custom_boards:" + SITE.siteKey;
    var VISIBLE_BOARDS_KEY = "community_visible_boards:" + SITE.siteKey;
    var BOARD_ORDER_KEY = "community_board_order:" + SITE.siteKey;
    var HOME_GROUP_PATHS_KEY = "community_home_group_paths:" + SITE.siteKey;
    var AUTH_ERROR_PREFIX = "AUTH_REQUIRED:";
    var MENU_CACHE_SETTINGS = "설정";
    var MENU_BROWSER = "브라우저로 보기";
    var MENU_GO = "바로가기";
    var MENU_ALL_BOARDS = "전체 게시판";
    var MENU_HOME = "홈";
    var MENU_HOME_TOGGLE = "홈 추가";
    var MENU_HOME_REMOVE = "홈 해제";
    var MENU_MEDIA_TOGGLE = "미디어 표시";
    var MENU_GALLERY_MODE = "갤러리 모드";
    var MENU_SETTINGS = SITE.boardSettingsMenuLabel || "게시판 설정";
    var MENU_BOARD_SYNC = "게시판가져오기";
    var BUTTON_OPEN_CATEGORY_HOME_WITHOUT_SYNC = "그대로 보기";
    var MENU_REORDER = "정렬";
    var MENU_CLI = "CLI";
    var BUTTON_REFRESH = "새로고침";
    var CATEGORY_ROUTE_QUERY_KEY = "_synura_category";
    var viewState = {};
    var boardIndex = {};
    var defaultBoards = (SITE.boards || []).slice();
    var homeBoards = defaultBoards.slice();
    var dynamicBoards = null;

    function cloneSelectorValue(value) {
        if (Array.isArray(value)) return value.slice();
        if (value && typeof value === "object") return cloneSelectorMap(value);
        return value;
    }

    function cloneSelectorMap(map) {
        var out = {};
        var source = map && typeof map === "object" ? map : {};
        var keys = Object.keys(source);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = source[key];
            if (value === undefined) continue;
            out[key] = cloneSelectorValue(value);
        }
        return out;
    }

    function mergeSelectorMaps(base, override) {
        var out = cloneSelectorMap(base || {});
        if (!override || typeof override !== "object") return out;
        var keys = Object.keys(override);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = override[key];
            if (value === undefined) continue;
            out[key] = cloneSelectorValue(value);
        }
        return out;
    }

    var baseSelectors = cloneSelectorMap(SITE.selectors || {});
    var selectorContextStack = [];
    var activeSelectorProfiles = [cloneSelectorMap(baseSelectors)];
    var activeSelectorProfileIndex = 0;

    function normalizeWhitespace(value) {
        return String(value == null ? "" : value)
            .replace(/\u00a0/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function stringifyForConsole(value) {
        if (value === undefined) return "undefined";
        try {
            return JSON.stringify(value).replace(/%/g, "%%");
        } catch (e) {
            return String(value).replace(/%/g, "%%");
        }
    }

    function cloneWithoutFunctions(value) {
        if (value === null || value === undefined) return value;
        if (typeof value === "function") return undefined;
        if (Array.isArray(value)) {
            var items = [];
            for (var i = 0; i < value.length; i++) {
                var nextItem = cloneWithoutFunctions(value[i]);
                if (nextItem !== undefined) items.push(nextItem);
            }
            return items;
        }
        if (typeof value !== "object") return value;
        var out = {};
        var keys = Object.keys(value);
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            var descriptor = Object.getOwnPropertyDescriptor(value, key);
            if (descriptor && (typeof descriptor.get === "function" || typeof descriptor.set === "function")) continue;
            var nextValue = cloneWithoutFunctions(value[key]);
            if (nextValue !== undefined) out[key] = nextValue;
        }
        return Object.keys(out).length ? out : undefined;
    }

    function selectorScopedValue(value, kind) {
        if (!value || typeof value !== "object" || Array.isArray(value)) return null;
        if (
            Object.prototype.hasOwnProperty.call(value, "default") ||
            Object.prototype.hasOwnProperty.call(value, "board") ||
            Object.prototype.hasOwnProperty.call(value, "post") ||
            Object.prototype.hasOwnProperty.call(value, "comment")
        ) {
            var merged = {};
            if (value.default && typeof value.default === "object") {
                merged = mergeSelectorMaps(merged, value.default);
            }
            if (kind && value[kind] && typeof value[kind] === "object") {
                merged = mergeSelectorMaps(merged, value[kind]);
            }
            return Object.keys(merged).length > 0 ? merged : null;
        }
        return cloneSelectorMap(value);
    }

    function pushSelectorProfileRefs(out, value, kind) {
        if (value == null) return out;
        if (typeof value === "string") {
            out.push(value);
            return out;
        }
        if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                pushSelectorProfileRefs(out, value[i], kind);
            }
            return out;
        }
        if (typeof value === "object") {
            if (kind && Object.prototype.hasOwnProperty.call(value, kind)) {
                return pushSelectorProfileRefs(out, value[kind], kind);
            }
            if (Object.prototype.hasOwnProperty.call(value, "default")) {
                return pushSelectorProfileRefs(out, value.default, kind);
            }
        }
        return out;
    }

    function dedupeSelectorProfileRefs(values) {
        var out = [];
        var seen = {};
        for (var i = 0; i < (values || []).length; i++) {
            var key = normalizeWhitespace(values[i]);
            if (!key || seen[key]) continue;
            seen[key] = true;
            out.push(key);
        }
        return out;
    }

    function selectorProfileRefsForContext(match, url, kind, doc) {
        var out = [];
        var board = match && match.board ? match.board : null;
        try {
            if (SITE.resolveSelectorProfiles) {
                pushSelectorProfileRefs(out, SITE.resolveSelectorProfiles(match, url, kind, doc), kind);
            }
        } catch (e) {
        }
        if (board) {
            pushSelectorProfileRefs(out, board.selectorProfiles || board.selectorProfile, kind);
        }
        if (SITE.selectorProfilesByBoard && board && SITE.selectorProfilesByBoard[board.id]) {
            pushSelectorProfileRefs(out, SITE.selectorProfilesByBoard[board.id], kind);
        }
        return dedupeSelectorProfileRefs(out);
    }

    function selectorOverridesForContext(match, url, kind, doc) {
        var board = match && match.board ? match.board : null;
        var merged = {};
        var applied = false;

        function applyOverride(value) {
            var override = selectorScopedValue(value, kind);
            if (!override || Object.keys(override).length === 0) return;
            merged = mergeSelectorMaps(merged, override);
            applied = true;
        }

        if (board && board.selectors) applyOverride(board.selectors);
        if (SITE.selectorsByBoard && board && SITE.selectorsByBoard[board.id]) {
            applyOverride(SITE.selectorsByBoard[board.id]);
        }
        if (SITE.selectorsByKind && kind && SITE.selectorsByKind[kind]) {
            applyOverride(SITE.selectorsByKind[kind]);
        }
        try {
            if (SITE.resolveSelectorOverrides) {
                applyOverride(SITE.resolveSelectorOverrides(match, url, kind, doc));
            }
        } catch (e) {
        }

        return applied ? merged : null;
    }

    function selectorProfilesForContext(match, url, kind, doc) {
        var refs = selectorProfileRefsForContext(match, url, kind, doc);
        var overrides = selectorOverridesForContext(match, url, kind, doc);
        var profiles = [];

        function buildProfile(profileMap) {
            var merged = mergeSelectorMaps(baseSelectors, profileMap);
            if (overrides) merged = mergeSelectorMaps(merged, overrides);
            return merged;
        }

        for (var i = 0; i < refs.length; i++) {
            var profileMap = SITE.selectorProfiles && SITE.selectorProfiles[refs[i]]
                ? SITE.selectorProfiles[refs[i]]
                : null;
            if (!profileMap || typeof profileMap !== "object") continue;
            profiles.push(buildProfile(profileMap));
        }

        profiles.push(buildProfile({}));
        return profiles.length > 0 ? profiles : [cloneSelectorMap(baseSelectors)];
    }

    function setActiveSelectorProfiles(profiles, index) {
        activeSelectorProfiles = profiles && profiles.length > 0 ? profiles : [cloneSelectorMap(baseSelectors)];
        var parsedIndex = parseInt(String(index || 0), 10);
        activeSelectorProfileIndex = !isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < activeSelectorProfiles.length ? parsedIndex : 0;
    }

    function currentSelectorProfile() {
        return activeSelectorProfiles[activeSelectorProfileIndex] || activeSelectorProfiles[0] || cloneSelectorMap(baseSelectors);
    }

    function refreshSelectorContext() {
        var current = selectorContextStack.length > 0 ? selectorContextStack[selectorContextStack.length - 1] : null;
        if (!current) {
            setActiveSelectorProfiles([cloneSelectorMap(baseSelectors)], 0);
            return;
        }
        var profiles = selectorProfilesForContext(current.match, current.url, current.kind, current.doc);
        setActiveSelectorProfiles(profiles, current.profileIndex || 0);
    }

    function withSelectorContext(match, url, kind, doc, fn) {
        selectorContextStack.push({
            match: match || null,
            url: url || "",
            kind: kind || "",
            doc: doc || null,
            profileIndex: 0
        });
        refreshSelectorContext();
        try {
            return fn();
        } finally {
            selectorContextStack.pop();
            refreshSelectorContext();
        }
    }

    function withSelectorProfileIndex(index, fn) {
        var current = selectorContextStack.length > 0 ? selectorContextStack[selectorContextStack.length - 1] : null;
        var previousIndex = activeSelectorProfileIndex;
        var nextIndex = parseInt(String(index || 0), 10);
        if (isNaN(nextIndex) || nextIndex < 0 || nextIndex >= activeSelectorProfiles.length) {
            nextIndex = 0;
        }
        activeSelectorProfileIndex = nextIndex;
        if (current) current.profileIndex = nextIndex;
        try {
            return fn();
        } finally {
            activeSelectorProfileIndex = previousIndex;
            if (current) current.profileIndex = previousIndex;
        }
    }

    function selectorProfiles(kind) {
        if (activeSelectorProfiles && activeSelectorProfiles.length > 0) return activeSelectorProfiles;
        return [cloneSelectorMap(baseSelectors)];
    }

    function selectorList(key, fallback) {
        var selectors = SITE.selectors || {};
        var value = selectors[key];
        if (Array.isArray(value)) return value;
        if (Array.isArray(fallback)) return fallback.slice();
        return [];
    }

    try {
        Object.defineProperty(SITE, "selectors", {
            configurable: true,
            enumerable: true,
            get: function () {
                return currentSelectorProfile();
            },
            set: function (value) {
                baseSelectors = cloneSelectorMap(value || {});
                refreshSelectorContext();
            }
        });
    } catch (e) {
    }

    function markdownQuoteText(value) {
        var lines = String(value == null ? "" : value).split("\n");
        for (var i = 0; i < lines.length; i++) {
            lines[i] = "> " + lines[i];
        }
        return lines.join("\n");
    }

    function synuraObjectText() {
        try {
            return markdownQuoteText(JSON.stringify(cloneWithoutFunctions(SYNURA) || {}, null, 2));
        } catch (e) {
            return markdownQuoteText(String(SYNURA));
        }
    }

    function resolveEventViewId(event, fallbackViewId) {
        if (event && event.viewId !== undefined && event.viewId !== null) {
            var parsedEventViewId = parseInt(String(event.viewId), 10);
            if (parsedEventViewId > 0) return parsedEventViewId;
        }
        var parsedFallbackViewId = parseInt(String(fallbackViewId || 0), 10);
        return parsedFallbackViewId > 0 ? parsedFallbackViewId : 0;
    }

    function logViewEvent(event, fallbackViewId) {
        if (typeof console === "undefined" || !console || typeof console.log !== "function") return;
        var viewId = resolveEventViewId(event, fallbackViewId);
        var eventId = event && event.eventId ? String(event.eventId) : "";
        console.log(
            "[viewEvent] site=" + SITE.siteKey +
            " viewId=" + String(viewId || 0) +
            " eventId=" + eventId +
            " event=" + stringifyForConsole(event)
        );
    }

    function menuItemLabel(menu) {
        if (typeof menu === "string") return menu;
        if (menu && typeof menu.label === "string") return menu.label;
        return "";
    }

    function hasMenuItem(menus, label) {
        for (var i = 0; i < (menus || []).length; i++) {
            if (menuItemLabel(menus[i]) === label) return true;
        }
        return false;
    }

    function moveMenuItemToFront(menus, label) {
        var target = [];
        var rest = [];
        for (var i = 0; i < (menus || []).length; i++) {
            if (menuItemLabel(menus[i]) === label) target.push(menus[i]);
            else rest.push(menus[i]);
        }
        return target.concat(rest);
    }

    function moveMenuItemToEnd(menus, label) {
        var target = [];
        var rest = [];
        for (var i = 0; i < (menus || []).length; i++) {
            if (menuItemLabel(menus[i]) === label) target.push(menus[i]);
            else rest.push(menus[i]);
        }
        return rest.concat(target);
    }

    function normalizeBoardRecord(raw, flags) {
        if (!raw) return null;
        var id = normalizeWhitespace(raw.id);
        var title = normalizeWhitespace(raw.title);
        var url = normalizeUrl(raw.url) || ensureAbsoluteUrl(raw.url, SITE.browserHomeUrl);
        var selectors = cloneSelectorMap(raw.selectors || {});
        if (!url && id && SITE.buildBoardUrlFromId) {
            try {
                var builtUrl = SITE.buildBoardUrlFromId(id);
                url = normalizeUrl(builtUrl) || ensureAbsoluteUrl(builtUrl, SITE.browserHomeUrl);
            } catch (e) {
            }
        }
        if (!id || !title || !url) return null;
        return {
            id: id,
            title: title,
            url: url,
            description: normalizeWhitespace(raw.description || title),
            group: normalizeWhitespace(raw.group || ""),
            showMedia: !!((flags && flags.showMedia) || raw.showMedia),
            custom: !!((flags && flags.custom) || raw.custom),
            dynamic: !!((flags && flags.dynamic) || raw.dynamic),
            selectorProfile: normalizeWhitespace(raw.selectorProfile || ""),
            selectorProfiles: raw.selectorProfiles,
            hotThreshold: normalizeThresholdValue(raw.hotThreshold) || undefined,
            coldThreshold: normalizeThresholdValue(raw.coldThreshold) || undefined,
            commentHotThreshold: normalizeThresholdValue(raw.commentHotThreshold) || undefined,
            commentColdThreshold: normalizeThresholdValue(raw.commentColdThreshold) || undefined,
            selectors: Object.keys(selectors).length > 0 ? selectors : undefined
        };
    }

    function dedupeBoards(boards) {
        var out = [];
        var seen = {};
        for (var i = 0; i < (boards || []).length; i++) {
            var board = normalizeBoardRecord(boards[i], boards[i]);
            if (!board || seen[board.id]) continue;
            seen[board.id] = true;
            out.push(board);
        }
        return out;
    }

    function readStoredJson(key, fallback) {
        var raw = localStorage.getItem(key);
        if (!raw) return fallback;
        try {
            var parsed = JSON.parse(raw);
            return parsed == null ? fallback : parsed;
        } catch (e) {
            return fallback;
        }
    }

    function writeStoredJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getCustomBoards() {
        return dedupeBoards(readStoredJson(CUSTOM_BOARDS_KEY, []));
    }

    function saveCustomBoards(boards) {
        writeStoredJson(CUSTOM_BOARDS_KEY, dedupeBoards(boards || []));
    }

    function getHomeGroupPaths() {
        var stored = readStoredJson(HOME_GROUP_PATHS_KEY, []);
        if (!Array.isArray(stored)) return [];
        var out = [];
        var seen = {};
        for (var i = 0; i < stored.length; i++) {
            var path = normalizeWhitespace(stored[i]);
            if (!path || seen[path]) continue;
            seen[path] = true;
            out.push(path);
        }
        return out;
    }

    function saveHomeGroupPaths(paths) {
        var out = [];
        var seen = {};
        for (var i = 0; i < (paths || []).length; i++) {
            var path = normalizeWhitespace(paths[i]);
            if (!path || seen[path]) continue;
            seen[path] = true;
            out.push(path);
        }
        writeStoredJson(HOME_GROUP_PATHS_KEY, out);
        return out;
    }

    function homeGroupOrderId(path) {
        var normalized = normalizeWhitespace(path);
        return normalized ? ("home_group:" + normalized) : "";
    }

    function isHomeGroupOrderId(value) {
        return normalizeWhitespace(value).indexOf("home_group:") === 0;
    }

    function homeGroupPathFromOrderId(value) {
        var normalized = normalizeWhitespace(value);
        return isHomeGroupOrderId(normalized) ? normalized.substring("home_group:".length) : "";
    }

    function getDefaultCacheTTL() {
        var parsed = parseInt(String(DEFAULT_CACHE_TTL || 0), 10);
        return parsed > 0 ? parsed : 300000;
    }

    function getCacheTTL() {
        var raw = localStorage.getItem(CACHE_TTL_KEY);
        if (!raw) return getDefaultCacheTTL();
        var parsed = parseInt(String(raw), 10);
        return parsed > 0 ? parsed : getDefaultCacheTTL();
    }

    function setCacheTTL(ms) {
        var parsed = parseInt(String(ms || 0), 10);
        localStorage.setItem(CACHE_TTL_KEY, String(parsed > 0 ? parsed : getDefaultCacheTTL()));
    }

    function getShowCacheSnackbar() {
        var raw = localStorage.getItem(CACHE_SNACKBAR_KEY);
        if (raw === null || raw === undefined || raw === "") {
            return SITE.showCacheSnackbarByDefault !== false;
        }
        raw = String(raw).trim().toLowerCase();
        return !(raw === "false" || raw === "0" || raw === "off" || raw === "no");
    }

    function setShowCacheSnackbar(enabled) {
        localStorage.setItem(CACHE_SNACKBAR_KEY, enabled ? "true" : "false");
    }

    function getUseTwoCharCategory() {
        var raw = localStorage.getItem(CATEGORY_TWO_CHAR_KEY);
        if (raw === null || raw === undefined || raw === "") {
            return true;
        }
        raw = String(raw).trim().toLowerCase();
        return !(raw === "false" || raw === "0" || raw === "off" || raw === "no");
    }

    function setUseTwoCharCategory(enabled) {
        localStorage.setItem(CATEGORY_TWO_CHAR_KEY, enabled ? "true" : "false");
    }

    function getDefaultGalleryColumnCount() {
        var parsed = parseInt(String(SITE.defaultGalleryColumnCount || DEFAULT_GALLERY_COLUMN_COUNT), 10);
        return parsed > 0 ? parsed : DEFAULT_GALLERY_COLUMN_COUNT;
    }

    function getGalleryColumnCount() {
        var raw = localStorage.getItem(GALLERY_COLUMN_COUNT_KEY);
        if (raw === null || raw === undefined || raw === "") {
            return getDefaultGalleryColumnCount();
        }
        var parsed = parseInt(String(raw), 10);
        return parsed > 0 ? parsed : getDefaultGalleryColumnCount();
    }

    function setGalleryColumnCount(value) {
        var parsed = parseInt(String(value || 0), 10);
        localStorage.setItem(GALLERY_COLUMN_COUNT_KEY, String(parsed > 0 ? parsed : getDefaultGalleryColumnCount()));
    }

    function getBoardViewSettings() {
        var stored = readStoredJson(BOARD_VIEW_SETTINGS_KEY, {});
        return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
    }

    function saveBoardViewSettings(settings) {
        writeStoredJson(BOARD_VIEW_SETTINGS_KEY, settings || {});
    }

    function getBoardViewSettingRecord(boardId) {
        var resolvedId = normalizeWhitespace(boardId);
        if (!resolvedId) return {};
        var settings = getBoardViewSettings();
        var record = settings[resolvedId];
        return record && typeof record === "object" && !Array.isArray(record) ? record : {};
    }

    function setBoardViewSetting(boardId, key, enabled) {
        var resolvedId = normalizeWhitespace(boardId);
        if (!resolvedId || !key) return {};
        var settings = getBoardViewSettings();
        var record = settings[resolvedId];
        if (!record || typeof record !== "object" || Array.isArray(record)) {
            record = {};
        }
        record[key] = !!enabled;
        settings[resolvedId] = record;
        saveBoardViewSettings(settings);
        return record;
    }

    function formatBoardListCategory(value) {
        var text = normalizeWhitespace(value);
        if (!text) return "";
        if (!getUseTwoCharCategory()) return text;
        var compact = text.replace(/\s+/g, "");
        return compact.length <= 2 ? compact : compact.substring(0, 2);
    }

    function supportsCacheSettings() {
        return SITE.enableCacheSettings !== false;
    }

    function supportsBoardReorder() {
        return SITE.enableBoardReorder !== false;
    }

    function supportsBoardDelete() {
        return !!SITE.enableBoardDelete;
    }

    function supportsCli() {
        return SITE.enableCli !== false;
    }

    function getBoardSettingsLargeThreshold() {
        var parsed = parseInt(String(SITE.boardSettingsLargeThreshold || 256), 10);
        return parsed > 0 ? parsed : 256;
    }

    function formatDuration(ms) {
        if (ms < 0) ms = 0;
        var seconds = Math.floor(ms / 1000);
        var minutes = Math.floor(seconds / 60);
        var remain = seconds % 60;
        if (minutes > 0) return minutes + "분 " + remain + "초";
        return remain + "초";
    }

    function showCacheSnackbar(viewId, cachedAt) {
        if (!supportsCacheSettings()) return;
        if (!getShowCacheSnackbar()) return;
        if (!(cachedAt > 0)) return;
        var age = Date.now() - cachedAt;
        if (age < CACHE_SNACKBAR_MIN_AGE_MS) return;
        var ttl = getCacheTTL();
        var remaining = ttl - age;
        synura.update(viewId, {
            models: {
                snackbar: formatDuration(age) + " 전 캐시됨, " + formatDuration(remaining) + " 남음."
            }
        });
    }

    function isDefaultVisible(id) {
        var boardId = normalizeWhitespace(id);
        var visibleIds = [];
        var seen = {};

        function pushVisible(rawId) {
            var normalized = normalizeWhitespace(rawId);
            if (!normalized || seen[normalized]) return;
            seen[normalized] = true;
            visibleIds.push(normalized);
        }

        var configured = SITE.defaultVisibleBoardIds || [];
        if (configured && configured.length > 0) {
            for (var i = 0; i < configured.length; i++) {
                pushVisible(configured[i]);
            }
        } else {
            for (var j = 0; j < defaultBoards.length; j++) {
                pushVisible(defaultBoards[j].id);
            }
        }

        var minimumHomeBoards = parseInt(String(SITE.minimumHomeBoards || 10), 10);
        if (!(minimumHomeBoards > 0)) minimumHomeBoards = 10;
        if (visibleIds.length < minimumHomeBoards) {
            var systemBoards = getSystemBoards();
            for (var k = 0; k < systemBoards.length && visibleIds.length < minimumHomeBoards; k++) {
                pushVisible(systemBoards[k].id);
            }
        }

        for (var m = 0; m < visibleIds.length; m++) {
            if (visibleIds[m] === boardId) {
                return true;
            }
        }
        return false;
    }

    function getVisibleMapRaw() {
        var visible = readStoredJson(VISIBLE_BOARDS_KEY, {});
        return visible && typeof visible === "object" && !Array.isArray(visible) ? visible : {};
    }

    function saveVisibleMap(visibleMap) {
        writeStoredJson(VISIBLE_BOARDS_KEY, visibleMap || {});
    }

    function isBoardVisible(id, visibleMap) {
        var boardId = normalizeWhitespace(id);
        if (!boardId) return false;
        if (!visibleMap || visibleMap[boardId] === undefined) {
            return isDefaultVisible(boardId);
        }
        return !!visibleMap[boardId];
    }

    function getBoardOrder() {
        var order = readStoredJson(BOARD_ORDER_KEY, []);
        if (!Array.isArray(order)) return [];
        var out = [];
        for (var i = 0; i < order.length; i++) {
            var id = normalizeWhitespace(order[i]);
            if (id) out.push(id);
        }
        return out;
    }

    function saveBoardOrder(order) {
        writeStoredJson(BOARD_ORDER_KEY, order || []);
    }

    function removeOrderEntry(orderId) {
        var id = normalizeWhitespace(orderId);
        if (!id) return;
        var order = getBoardOrder();
        var nextOrder = [];
        for (var i = 0; i < order.length; i++) {
            if (order[i] !== id) nextOrder.push(order[i]);
        }
        if (nextOrder.length !== order.length) {
            saveBoardOrder(nextOrder);
        }
    }

    function moveOrderEntryToEnd(orderId) {
        var id = normalizeWhitespace(orderId);
        if (!id) return;
        var order = getBoardOrder();
        var nextOrder = [];
        for (var i = 0; i < order.length; i++) {
            if (order[i] !== id) nextOrder.push(order[i]);
        }
        nextOrder.push(id);
        saveBoardOrder(nextOrder);
    }

    function getDynamicBoards(options) {
        var allowNetwork = !!(options && options.allowNetwork);
        var force = !!(options && options.force);
        if (dynamicBoards !== null && !allowNetwork && !force) {
            return dynamicBoards;
        }
        try {
            var loaded = SITE.loadDynamicBoards
                ? SITE.loadDynamicBoards({
                    allowNetwork: allowNetwork,
                    force: force
                })
                : [];
            dynamicBoards = setDynamicBoardsCache(Array.isArray(loaded) ? loaded : []);
            return dynamicBoards;
        } catch (e) {
            return Array.isArray(dynamicBoards) ? dynamicBoards : [];
        }
    }

    function setDynamicBoardsCache(boards) {
        dynamicBoards = dedupeBoards(boards || []);
        return dynamicBoards;
    }

    function clearDynamicBoardsCache() {
        dynamicBoards = null;
    }

    function getSystemBoards() {
        var dynamic = getDynamicBoards({ allowNetwork: false });
        if (SITE.hasFullBoardCatalog && Array.isArray(dynamic) && dynamic.length > 0) {
            return dedupeBoards(dynamic.concat(defaultBoards));
        }
        return dedupeBoards(defaultBoards.concat(dynamic));
    }

    function getAllBoards() {
        return dedupeBoards(getSystemBoards().concat(getCustomBoards()));
    }

    function getSortedBoards() {
        var allBoards = getAllBoards();
        var order = getBoardOrder();
        if (order.length === 0) return allBoards;

        var orderMap = {};
        for (var i = 0; i < order.length; i++) {
            if (orderMap[order[i]] === undefined) {
                orderMap[order[i]] = i;
            }
        }

        return allBoards.slice().sort(function (a, b) {
            var ai = orderMap[a.id];
            var bi = orderMap[b.id];
            if (ai === undefined && bi === undefined) return 0;
            if (ai === undefined) return 1;
            if (bi === undefined) return -1;
            return ai - bi;
        });
    }

    function compareBoardSettingsBoards(a, b) {
        var leftTitle = normalizeWhitespace(a && a.title ? a.title : "");
        var rightTitle = normalizeWhitespace(b && b.title ? b.title : "");
        var compared = leftTitle.localeCompare(rightTitle);
        if (compared !== 0) return compared;
        return normalizeWhitespace(a && a.id ? a.id : "").localeCompare(normalizeWhitespace(b && b.id ? b.id : ""));
    }

    function getBoardSettingsBoards() {
        var allBoards = getAllBoards();
        var knownOrderMap = {};
        for (var i = 0; i < defaultBoards.length; i++) {
            var knownId = normalizeWhitespace(defaultBoards[i] ? defaultBoards[i].id : "");
            if (knownId && knownOrderMap[knownId] === undefined) {
                knownOrderMap[knownId] = i;
            }
        }

        var knownBoards = [];
        var otherBoards = [];
        for (var j = 0; j < allBoards.length; j++) {
            var board = allBoards[j];
            if (board && knownOrderMap[board.id] !== undefined) knownBoards.push(board);
            else otherBoards.push(board);
        }

        knownBoards.sort(function (a, b) {
            return knownOrderMap[a.id] - knownOrderMap[b.id];
        });
        otherBoards.sort(compareBoardSettingsBoards);
        return knownBoards.concat(otherBoards);
    }

    function moveBoardOrderToEnd(boardId) {
        if (!supportsBoardReorder()) return;
        var id = normalizeWhitespace(boardId);
        if (!id) return;
        var order = getBoardOrder();
        if (order.length === 0) {
            var boards = getSortedBoards();
            for (var i = 0; i < boards.length; i++) {
                if (boards[i] && boards[i].id) order.push(boards[i].id);
            }
        }
        var nextOrder = [];
        var seen = {};
        for (var j = 0; j < order.length; j++) {
            var currentId = normalizeWhitespace(order[j]);
            if (!currentId || currentId === id || seen[currentId]) continue;
            seen[currentId] = true;
            nextOrder.push(currentId);
        }
        nextOrder.push(id);
        saveBoardOrder(nextOrder);
    }

    function shouldAppendEnabledBoardToHomeOrder(boardId) {
        var id = normalizeWhitespace(boardId);
        if (!id) return false;
        return !isDefaultVisible(id);
    }

    function getVisibleBoards() {
        var visibleMap = getVisibleMapRaw();
        var allBoards = getSortedBoards();
        var visibleBoards = [];
        for (var i = 0; i < allBoards.length; i++) {
            if (isBoardVisible(allBoards[i].id, visibleMap)) {
                visibleBoards.push(allBoards[i]);
            }
        }
        return visibleBoards;
    }

    function getAllBoardsVisibility() {
        var visibleMap = getVisibleMapRaw();
        var allBoards = getSortedBoards();
        for (var i = 0; i < allBoards.length; i++) {
            if (visibleMap[allBoards[i].id] === undefined) {
                visibleMap[allBoards[i].id] = isDefaultVisible(allBoards[i].id);
            }
        }
        return visibleMap;
    }

    function rebuildBoardIndex() {
        boardIndex = {};
        var allBoards = dedupeBoards(getAllBoards().concat(homeBoards));
        for (var i = 0; i < allBoards.length; i++) {
            boardIndex[allBoards[i].id] = allBoards[i];
        }
    }

    function firstNonEmpty(values) {
        for (var i = 0; i < (values || []).length; i++) {
            var value = normalizeWhitespace(values[i]);
            if (value) return value;
        }
        return "";
    }

    function textOf(node) {
        if (!node) return "";
        return normalizeWhitespace(node.textContent || node.innerText || node.text || "");
    }

    function attrOf(node, name) {
        if (!node) return "";
        return normalizeWhitespace(node.getAttribute(name) || "");
    }

    function firstNode(root, selectors) {
        if (!root || !selectors) return null;
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            if (!selector) continue;
            var found = root.querySelector(selector);
            if (found) return found;
        }
        return null;
    }

    function allNodes(root, selectors) {
        if (!root || !selectors) return [];
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            if (!selector) continue;
            var found = root.querySelectorAll(selector);
            if (found && found.length > 0) return found;
        }
        return [];
    }

    function firstText(root, selectors) {
        return textOf(firstNode(root, selectors));
    }

    function cleanBoardGroupText(value) {
        var text = normalizeWhitespace(value);
        if (!text) return "";
        text = text
            .replace(/^[-=+>*#▷▶▸►◁◀◇◆•·\s]+/, "")
            .replace(/\s*\(\d+\)\s*$/, "")
            .replace(/\s{2,}/g, " ")
            .trim();
        if (!text) return "";
        if (/^(로그인|회원가입|설정|PC화면|바로가기|클로즈버튼|로딩중|내 즐겨찾기 관리|최근 방문한 게시판초기화|신규카테|MY|홈|더보기|전체보기|전체)$/i.test(text)) {
            return "";
        }
        if (/^https?:\/\//i.test(text) || /\.(com|net|co\.kr|kr)/i.test(text)) return "";
        if (text.length > 32) return "";
        return text;
    }

    function inferBoardGroupFromContext(node) {
        var current = node;
        for (var depth = 0; current && depth < 5; depth++) {
            var sibling = current.previousSibling;
            var scanned = 0;
            while (sibling && scanned < 8) {
                var candidate = "";
                if (sibling.nodeType === 3) {
                    candidate = cleanBoardGroupText(sibling.textContent || "");
                } else if (sibling.nodeType === 1) {
                    var anchorCount = sibling.querySelectorAll ? sibling.querySelectorAll("a[href]").length : 0;
                    if (anchorCount === 0) {
                        candidate = cleanBoardGroupText(textOf(sibling));
                    } else {
                        var tagName = String(sibling.tagName || "").toUpperCase();
                        var className = normalizeWhitespace(sibling.className || "");
                        if (
                            /^(H1|H2|H3|H4|H5|H6|DT|TH|STRONG|B|CAPTION|SUMMARY)$/.test(tagName) ||
                            (/title|head|cate|category|section|group|menu|tab/i.test(className) && anchorCount <= 1)
                        ) {
                            candidate = cleanBoardGroupText(textOf(sibling));
                        }
                    }
                }
                if (candidate) return candidate;
                sibling = sibling.previousSibling;
                scanned += 1;
            }
            current = current.parentNode;
        }
        return "";
    }

    function imageLabelOf(node) {
        if (!node) return "";

        var label = firstNonEmpty([
            attrOf(node, "alt"),
            attrOf(node, "aria-label"),
            attrOf(node, "title")
        ]);
        if (label) return label;
        if (!node.querySelectorAll) return "";

        var images = node.querySelectorAll("img");
        for (var i = 0; i < images.length; i++) {
            label = firstNonEmpty([
                attrOf(images[i], "alt"),
                attrOf(images[i], "aria-label"),
                attrOf(images[i], "title")
            ]);
            if (label) return label;
        }
        return "";
    }

    function firstAuthorText(root, selectors) {
        var node = firstNode(root, selectors);
        return firstNonEmpty([
            textOf(node),
            imageLabelOf(node)
        ]);
    }

    function parseCount(value) {
        var digits = String(value == null ? "" : value).replace(/[^0-9]/g, "");
        return digits.length > 9 ? "" : digits;
    }

    function hideZeroCount(value) {
        var text = normalizeWhitespace(value);
        return text === "0" ? "" : text;
    }

    function toInt(value, fallback) {
        var cleaned = String(value == null ? "" : value).replace(/[^0-9-]/g, "");
        var parsed = parseInt(cleaned, 10);
        return isNaN(parsed) ? fallback : parsed;
    }

    function cleanSingleLineField(value, maxLength) {
        var text = normalizeWhitespace(value);
        if (!text) return "";
        if (maxLength && text.length > maxLength) return "";
        if (/\$\(|document\.|function\(|\{\s*\"|\}\);/i.test(text)) return "";
        return text;
    }

    function parseAbsoluteUrl(raw) {
        var input = String(raw || "").trim();
        if (!input) return null;
        if (input.indexOf("//") === 0) input = "https:" + input;
        var matched = input.match(/^(https?):\/\/([^\/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i);
        if (!matched) return null;
        return {
            scheme: matched[1].toLowerCase(),
            host: matched[2].toLowerCase(),
            path: matched[3] || "/",
            query: matched[4] ? matched[4].substring(1) : "",
            hash: matched[5] || ""
        };
    }

    function joinAbsoluteUrl(parts) {
        if (!parts) return "";
        return parts.scheme + "://" + parts.host + parts.path +
            (parts.query ? "?" + parts.query : "") +
            (parts.hash || "");
    }

    function dirname(path) {
        var value = path || "/";
        if (value === "/") return "/";
        var index = value.lastIndexOf("/");
        if (index <= 0) return "/";
        return value.substring(0, index + 1);
    }

    function isKnownHost(host) {
        var value = String(host || "").toLowerCase();
        if (!value) return false;
        if (value === String(SYNURA.domain).toLowerCase()) return true;
        var aliases = SITE.hostAliases || [];
        for (var i = 0; i < aliases.length; i++) {
            if (value === String(aliases[i] || "").toLowerCase()) return true;
        }
        return false;
    }

    function shouldCanonicalizeKnownHosts() {
        return SITE.preserveAliasHostUrls !== true;
    }

    function rewriteKnownHost(url) {
        var info = parseAbsoluteUrl(url);
        if (!info) return "";
        if (isKnownHost(info.host) && shouldCanonicalizeKnownHosts()) {
            info.host = String(SYNURA.domain).toLowerCase();
        }
        return joinAbsoluteUrl(info);
    }

    function ensureAbsoluteUrl(raw, baseUrl) {
        var href = String(raw || "").trim();
        if (!href) return "";
        if (href.charAt(0) === "#") return "";
        if (href.toLowerCase().indexOf("javascript:") === 0) return "";
        if (/^https?:\/\//i.test(href)) return rewriteKnownHost(href);
        if (href.indexOf("//") === 0) return rewriteKnownHost("https:" + href);

        var base = parseAbsoluteUrl(baseUrl || SITE.browserHomeUrl);
        if (!base) return "";

        if (href.charAt(0) === "?") {
            return joinAbsoluteUrl({
                scheme: base.scheme,
                host: base.host,
                path: base.path,
                query: href.substring(1),
                hash: ""
            });
        }

        if (href.charAt(0) === "/") {
            return joinAbsoluteUrl({
                scheme: base.scheme,
                host: shouldCanonicalizeKnownHosts()
                    ? String(SYNURA.domain).toLowerCase()
                    : String(base.host || SYNURA.domain).toLowerCase(),
                path: href,
                query: "",
                hash: ""
            });
        }

        return rewriteKnownHost(base.scheme + "://" + base.host + dirname(base.path) + href);
    }

    function normalizeUrl(raw) {
        var absolute = ensureAbsoluteUrl(raw, SITE.browserHomeUrl);
        if (!absolute) return "";
        var info = parseAbsoluteUrl(absolute);
        if (!info) return "";
        info.hash = "";
        if (isKnownHost(info.host) && shouldCanonicalizeKnownHosts()) {
            info.host = String(SYNURA.domain).toLowerCase();
        }
        return joinAbsoluteUrl(info);
    }

    function pathSegments(path) {
        var input = String(path || "");
        var parts = input.split("/");
        var out = [];
        for (var i = 0; i < parts.length; i++) {
            if (parts[i]) out.push(parts[i]);
        }
        return out;
    }

    function queryValue(queryString, name) {
        var params = new URLSearchParams(queryString || "");
        var value = params.get(name);
        return value == null ? "" : String(value);
    }

    function queryInt(queryString, name, fallback) {
        var value = queryValue(queryString, name);
        if (!value) return fallback;
        var parsed = parseInt(value, 10);
        return isNaN(parsed) ? fallback : parsed;
    }

    function setQueryParam(url, name, value) {
        var info = parseAbsoluteUrl(url);
        if (!info) return "";
        var params = new URLSearchParams(info.query || "");
        if (value === null || value === undefined || value === "") params.delete(name);
        else params.set(name, String(value));
        info.query = params.toString();
        return joinAbsoluteUrl(info);
    }

    function setPageParam(url, name, page) {
        return setQueryParam(url, name, page);
    }

    homeBoards = getVisibleBoards();
    rebuildBoardIndex();

    function boardById(id) {
        if (!id) return null;
        return boardIndex[id] || null;
    }

    function ensureBoard(id, url, fallbackTitle) {
        var boardId = String(id || "").trim();
        if (!boardId) return null;
        if (!boardIndex[boardId]) {
            boardIndex[boardId] = normalizeBoardRecord({
                id: boardId,
                title: fallbackTitle || boardId,
                url: normalizeUrl(url) || url,
                description: "",
                dynamic: true
            }, { dynamic: true });
        }
        return boardIndex[boardId];
    }

    function cacheKey(kind, url) {
        return CACHE_PREFIX + kind + ":" + url;
    }

    function getCachedRoute(kind, url) {
        var cached = sessionStorage.getItem(cacheKey(kind, url));
        if (!cached) return null;
        var age = Date.now() - (cached.timestamp || 0);
        if (age > getCacheTTL()) {
            sessionStorage.removeItem(cacheKey(kind, url));
            return null;
        }
        return {
            timestamp: cached.timestamp || 0,
            route: cached.route
        };
    }

    function setCachedRoute(kind, url, route) {
        sessionStorage.setItem(cacheKey(kind, url), {
            timestamp: Date.now(),
            route: route
        });
    }

    function itemPreviewKey(link) {
        return CACHE_PREFIX + "i:" + (normalizeUrl(link) || String(link || ""));
    }

    function rememberItemPreview(item) {
        if (!item || !item.link) return;
        sessionStorage.setItem(itemPreviewKey(item.link), {
            link: normalizeUrl(item.link) || item.link,
            title: normalizeWhitespace(item.title || ""),
            author: normalizeWhitespace(item.author || ""),
            avatar: normalizeWhitespace(item.avatar || ""),
            date: normalizeWhitespace(item.date || ""),
            category: normalizeWhitespace(item.category || ""),
            viewCount: normalizeWhitespace(item.viewCount || ""),
            likeCount: normalizeWhitespace(item.likeCount || ""),
            commentCount: normalizeWhitespace(item.commentCount || "")
        });
    }

    function getRememberedItemPreview(link) {
        return sessionStorage.getItem(itemPreviewKey(link)) || null;
    }

    function setViewState(viewId, state) {
        viewState[String(viewId)] = state || {};
    }

    function getViewState(viewId) {
        return viewState[String(viewId)] || {};
    }

    function findViewIdByKind(kind) {
        var targetKind = normalizeWhitespace(kind);
        if (!targetKind) return 0;
        var keys = Object.keys(viewState);
        for (var i = 0; i < keys.length; i++) {
            var viewId = parseInt(String(keys[i]), 10);
            if (!(viewId > 0)) continue;
            var state = getViewState(viewId);
            if (state && state.kind === targetKind) {
                return viewId;
            }
        }
        return 0;
    }

    function shouldUseBrowserCookieAuth() {
        return !!SITE.browserCookieAuth;
    }

    function getSavedCookie() {
        var cookie = localStorage.getItem(COOKIE_KEY);
        return typeof cookie === "string" ? cookie : "";
    }

    function setSavedCookie(cookie) {
        var value = normalizeWhitespace(cookie);
        if (!value) {
            localStorage.removeItem(COOKIE_KEY);
            return "";
        }
        localStorage.setItem(COOKIE_KEY, value);
        return value;
    }

    function buildFetchOptions() {
        var options = {
            bypass: SYNURA.bypass
        };
        var cookie = getSavedCookie();
        if (cookie) {
            options.headers = {
                "Cookie": cookie
            };
        }
        return options;
    }

    function buildPostFetchOptions(match, url) {
        var options = buildFetchOptions();
        try {
            if (SITE.buildPostFetchOptions) {
                var custom = SITE.buildPostFetchOptions(match, url, options);
                if (custom) options = custom;
            }
        } catch (e) {
        }
        return options;
    }

    function fetchWithLogging(url, options) {
        if (typeof console !== "undefined" && console && typeof console.log === "function") {
            console.log(url);
        }
        return fetch(url, options);
    }

    function isBrowserAuthRequiredStatus(status) {
        return status === 429 || status === 430;
    }

    function makeAuthRequiredError(url, status) {
        return new Error(AUTH_ERROR_PREFIX + String(status || 0) + ":" + (normalizeUrl(url) || String(url || "")));
    }

    function parseAuthRequiredError(error) {
        var text = String(error || "");
        if (text.indexOf("Error: " + AUTH_ERROR_PREFIX) === 0) {
            text = text.substring(7);
        }
        if (text.indexOf(AUTH_ERROR_PREFIX) !== 0) return null;

        var payload = text.substring(AUTH_ERROR_PREFIX.length);
        var split = payload.indexOf(":");
        if (split < 0) {
            return {
                status: 0,
                url: normalizeUrl(payload) || payload
            };
        }

        var status = parseInt(payload.substring(0, split), 10);
        return {
            status: isNaN(status) ? 0 : status,
            url: normalizeUrl(payload.substring(split + 1)) || payload.substring(split + 1)
        };
    }

    function listFromDetails(items) {
        if (!items) return [];
        if (Array.isArray(items)) return items;
        if (Array.isArray(items.details)) return items.details;
        return [];
    }

    function absolutizeDetails(details, baseUrl) {
        var out = [];
        for (var i = 0; i < (details || []).length; i++) {
            var item = details[i];
            if (!item) continue;
            if (item.type === "image" || item.type === "video") {
                item.value = ensureAbsoluteUrl(item.value, baseUrl) || item.value;
                if (item.link) item.link = ensureAbsoluteUrl(item.link, baseUrl) || item.link;
            } else if (item.type === "link") {
                item.link = ensureAbsoluteUrl(item.link || item.value, baseUrl) || item.link || item.value;
            }
            out.push(item);
        }
        return out;
    }

    function isPlaceholderMediaUrl(value) {
        return /loading|placeholder|spacer|blank|transparent|noimg|thumb_default/i.test(String(value || ""));
    }

    function collectResolvedImageUrls(element, baseUrl) {
        if (!element) return [];
        var nodes = element.querySelectorAll("img");
        var out = [];
        var seen = {};
        for (var i = 0; i < nodes.length; i++) {
            var resolved = ensureAbsoluteUrl(firstNonEmpty([
                attrOf(nodes[i], "data-thumbnail"),
                attrOf(nodes[i], "data-thumb"),
                attrOf(nodes[i], "data-original"),
                attrOf(nodes[i], "data-src"),
                attrOf(nodes[i], "data-lazy-src"),
                attrOf(nodes[i], "data-srcset"),
                attrOf(nodes[i], "data-file"),
                attrOf(nodes[i], "data-url"),
                attrOf(nodes[i], "poster"),
                firstUrlFromSrcset(attrOf(nodes[i], "srcset")),
                attrOf(nodes[i], "src")
            ]), baseUrl);
            if (!resolved || seen[resolved]) continue;
            seen[resolved] = true;
            out.push(resolved);
        }
        return out;
    }

    function fixParsedMediaDetails(details, element, baseUrl) {
        var out = details || [];
        var images = collectResolvedImageUrls(element, baseUrl);
        var imageCursor = 0;
        var hasImage = false;
        for (var i = 0; i < out.length; i++) {
            if (!out[i] || out[i].type !== "image") continue;
            hasImage = true;
            var candidate = images[imageCursor] || "";
            if (candidate && (!out[i].value || isPlaceholderMediaUrl(out[i].value))) {
                out[i].value = candidate;
                if (!out[i].link) out[i].link = candidate;
            }
            imageCursor += 1;
        }

        if (!hasImage && images.length > 0) {
            for (var j = 0; j < images.length; j++) {
                out.push({
                    type: "image",
                    value: images[j],
                    link: images[j]
                });
            }
        }
        return out;
    }

    function pushSchemaObjects(value, bucket) {
        if (!value) return;
        if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                pushSchemaObjects(value[i], bucket);
            }
            return;
        }
        if (typeof value !== "object") return;
        bucket.push(value);
        if (value["@graph"]) pushSchemaObjects(value["@graph"], bucket);
    }

    function collectSchemaObjects(doc) {
        var out = [];
        var scripts = doc ? doc.querySelectorAll("script") : [];
        for (var i = 0; i < scripts.length; i++) {
            var type = attrOf(scripts[i], "type").toLowerCase();
            if (type && type.indexOf("ld+json") < 0) continue;
            var raw = String(scripts[i].textContent || "").trim();
            if (!raw || raw.indexOf("{") < 0) continue;
            try {
                pushSchemaObjects(JSON.parse(raw), out);
            } catch (e) {
            }
        }
        return out;
    }

    function schemaAuthorName(author) {
        if (!author) return "";
        if (typeof author === "string") return normalizeWhitespace(author);
        if (Array.isArray(author)) {
            for (var i = 0; i < author.length; i++) {
                var nested = schemaAuthorName(author[i]);
                if (nested) return nested;
            }
            return "";
        }
        if (typeof author === "object") {
            return firstNonEmpty([author.name, author.alternateName]);
        }
        return "";
    }

    function detectSchemaPost(doc) {
        var objects = collectSchemaObjects(doc);
        var types = {
            "discussionforumposting": true,
            "socialmediaposting": true,
            "article": true,
            "newsarticle": true,
            "blogposting": true,
            "posting": true
        };
        for (var i = 0; i < objects.length; i++) {
            var node = objects[i];
            var rawType = node && node["@type"];
            var nodeTypes = Array.isArray(rawType) ? rawType : [rawType];
            var matched = false;
            for (var j = 0; j < nodeTypes.length; j++) {
                var normalizedType = normalizeWhitespace(nodeTypes[j]).toLowerCase();
                if (types[normalizedType]) {
                    matched = true;
                    break;
                }
            }
            if (!matched) continue;
            return {
                headline: firstNonEmpty([node.headline, node.name]),
                articleBody: normalizeWhitespace(node.articleBody || ""),
                author: schemaAuthorName(node.author),
                datePublished: firstNonEmpty([node.datePublished, node.dateCreated, node.dateModified])
            };
        }
        return null;
    }

    function preferLongerText(primary, fallback) {
        var first = normalizeWhitespace(primary);
        var second = normalizeWhitespace(fallback);
        if (!first) return second;
        if (!second) return first;
        return second.length > first.length + 4 ? second : first;
    }

    function isEmulatorRuntime() {
        return !!(typeof synura !== "undefined" && synura && synura.isPolyfill === true);
    }

    function shouldUseRawPostParse() {
        if (!SITE.useRawPostParse) return false;
        if (!isEmulatorRuntime()) return true;
        return SITE.useRawPostParseInEmulator !== false;
    }

    function parseDetails(element, baseUrl) {
        if (!element) return [];
        try {
            var parsed = synura.parse("post", element);
            if (parsed && parsed.length > 0) {
                if (shouldUseRawPostParse()) return parsed;
                return fixParsedMediaDetails(absolutizeDetails(parsed, baseUrl), element, baseUrl);
            }
        } catch (e) {
        }
        var images = collectResolvedImageUrls(element, baseUrl);
        if (images.length > 0) {
            var media = [];
            for (var i = 0; i < images.length; i++) {
                media.push({ type: "image", value: images[i], link: images[i] });
            }
            return media;
        }
        var text = textOf(element);
        return text ? [{ type: "text", value: text }] : [];
    }

    function parseMarkupDetails(markup, baseUrl) {
        var parser = new DOMParser();
        var doc = parser.parseFromString("<div id='synura-markup-details'>" + String(markup || "") + "</div>", "text/html");
        var root = doc.querySelector("#synura-markup-details") || doc.body;
        var details = parseDetails(root, baseUrl);
        if ((!details || details.length === 0) && root) {
            var text = normalizeWhitespace(root.textContent || "");
            if (text) details = [{ type: "text", value: text }];
        }
        return details || [];
    }

    function cleanPageTitle(title) {
        var value = normalizeWhitespace(title);
        var suffixes = SITE.titleSuffixes || [];
        var changed = true;
        while (changed) {
            changed = false;
            for (var i = 0; i < suffixes.length; i++) {
                var suffix = String(suffixes[i] || "");
                if (!suffix) continue;
                if (value.toLowerCase().endsWith(suffix.toLowerCase())) {
                    value = normalizeWhitespace(value.substring(0, value.length - suffix.length));
                    changed = true;
                }
            }
        }
        var prefixes = [
            SITE.displayName + " - ",
            SITE.displayName + " : ",
            SITE.displayName + "|",
            SYNURA.name + " - ",
            SYNURA.name + " : ",
            SYNURA.name + "|"
        ];
        changed = true;
        while (changed) {
            changed = false;
            for (var j = 0; j < prefixes.length; j++) {
                var prefix = normalizeWhitespace(prefixes[j]);
                if (!prefix) continue;
                if (value.toLowerCase().indexOf(prefix.toLowerCase()) === 0) {
                    value = normalizeWhitespace(value.substring(prefix.length));
                    changed = true;
                }
            }
        }
        return value;
    }

    function detectBoardTitle(doc, board) {
        var titleNode = firstNode(doc, ["title"]);
        var prefersConfigured = !!(
            board && (
                !board.dynamic ||
                (
                    SITE.preferConfiguredDynamicBoardTitle === true &&
                    normalizeWhitespace(board.title || "") &&
                    normalizeWhitespace(board.title || "") !== normalizeWhitespace(board.id || "")
                )
            )
        );
        return firstNonEmpty([
            prefersConfigured ? board.title : "",
            cleanPageTitle(textOf(titleNode)),
            prefersConfigured ? "" : (board ? board.title : ""),
            firstText(doc, SITE.selectors.boardTitle),
            SITE.displayName
        ]);
    }

    function boardMatchesDefaultIds(boardId, ids) {
        var resolvedId = normalizeWhitespace(boardId);
        if (!resolvedId || !ids || !Array.isArray(ids)) return false;
        for (var i = 0; i < ids.length; i++) {
            if (normalizeWhitespace(ids[i]) === resolvedId) return true;
        }
        return false;
    }

    function resolveBoardPreferenceId(board) {
        if (typeof board === "string") return normalizeWhitespace(board);
        return normalizeWhitespace(board && board.id);
    }

    function resolveBoardPreferenceRecord(board) {
        var boardId = resolveBoardPreferenceId(board);
        if (!boardId) return null;
        if (board && typeof board === "object" && board.id) return board;
        return boardById(boardId) || { id: boardId };
    }

    function normalizeThresholdValue(value) {
        var parsed = toInt(value, 0);
        return parsed > 0 ? parsed : 0;
    }

    function resolveBoardThreshold(board, key) {
        var resolvedBoard = resolveBoardPreferenceRecord(board);
        var boardValue = normalizeThresholdValue(resolvedBoard && resolvedBoard[key]);
        if (boardValue > 0) return boardValue;
        return normalizeThresholdValue(SITE[key]);
    }

    function applyBoardThresholdStyles(styles, board) {
        var nextStyles = styles || {};
        var hotThreshold = resolveBoardThreshold(board, "hotThreshold");
        var coldThreshold = resolveBoardThreshold(board, "coldThreshold");
        var commentHotThreshold = resolveBoardThreshold(board, "commentHotThreshold");
        var commentColdThreshold = resolveBoardThreshold(board, "commentColdThreshold");

        if (hotThreshold > 0) nextStyles.hotThreshold = hotThreshold;
        if (coldThreshold > 0) nextStyles.coldThreshold = coldThreshold;
        if (commentHotThreshold > 0) nextStyles.commentHotThreshold = commentHotThreshold;
        if (commentColdThreshold > 0) nextStyles.commentColdThreshold = commentColdThreshold;

        return nextStyles;
    }

    function boardShowsMediaByDefault(board) {
        var resolvedBoard = resolveBoardPreferenceRecord(board);
        var boardId = resolveBoardPreferenceId(resolvedBoard);
        if (!boardId) return false;
        if (boardMatchesDefaultIds(boardId, SITE.defaultShowMediaBoardIds || [])) return true;
        return !!(resolvedBoard && resolvedBoard.showMedia === true);
    }

    function boardUsesGalleryModeByDefault(board) {
        var boardId = resolveBoardPreferenceId(board);
        if (!boardId) return false;
        return boardMatchesDefaultIds(boardId, SITE.defaultGalleryModeBoardIds || []);
    }

    function boardShowsMedia(board) {
        var resolvedBoard = resolveBoardPreferenceRecord(board);
        var boardId = resolveBoardPreferenceId(resolvedBoard);
        if (!boardId) return false;
        var settings = getBoardViewSettingRecord(boardId);
        if (Object.prototype.hasOwnProperty.call(settings, "show_media")) {
            return !!settings.show_media;
        }
        return boardShowsMediaByDefault(resolvedBoard);
    }

    function boardUsesGalleryMode(board) {
        var resolvedBoard = resolveBoardPreferenceRecord(board);
        var boardId = resolveBoardPreferenceId(resolvedBoard);
        if (!boardId) return false;
        var settings = getBoardViewSettingRecord(boardId);
        if (Object.prototype.hasOwnProperty.call(settings, "gallery_mode")) {
            return !!settings.gallery_mode;
        }
        return boardUsesGalleryModeByDefault(resolvedBoard);
    }

    function buildBoardListStyles(title, board, hasNextUrl) {
        var useGalleryMode = boardUsesGalleryMode(board);
        return applyBoardThresholdStyles({
            title: title,
            layout: useGalleryMode ? "gallery" : "card",
            columnCount: useGalleryMode ? getGalleryColumnCount() : undefined,
            media: boardShowsMedia(board),
            menu: true,
            pagination: !!hasNextUrl
        }, board);
    }

    function buildPostStyles(title, board) {
        return applyBoardThresholdStyles({
            title: title,
            menu: true
        }, board);
    }

    function isAllowedListLink(link, patterns) {
        patterns = patterns || [];
        if (!link) return false;
        if (!patterns || patterns.length === 0) return true;
        for (var i = 0; i < patterns.length; i++) {
            if (new RegExp(patterns[i]).test(link)) return true;
        }
        return false;
    }

    function extractListLink(row, baseUrl, selectors, patterns) {
        selectors = selectors || [];
        patterns = patterns || [];
        var fallbacks = [];
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            if (!selector) continue;
            var nodes = row.querySelectorAll(selector);
            for (var j = 0; j < nodes.length; j++) {
                var candidate = ensureAbsoluteUrl(attrOf(nodes[j], "href"), baseUrl);
                if (!candidate) continue;
                if (isAllowedListLink(candidate, patterns)) return candidate;
                if (fallbacks.indexOf(candidate) < 0) fallbacks.push(candidate);
            }
        }

        var rowHref = ensureAbsoluteUrl(attrOf(row, "href"), baseUrl);
        if (rowHref) {
            if (isAllowedListLink(rowHref, patterns)) return rowHref;
            if (fallbacks.indexOf(rowHref) < 0) fallbacks.push(rowHref);
        }

        if (patterns.length > 0) return "";
        return fallbacks.length > 0 ? fallbacks[0] : "";
    }

    function firstUrlFromSrcset(value) {
        var raw = normalizeWhitespace(value);
        if (!raw) return "";
        var parts = raw.split(",");
        for (var i = 0; i < parts.length; i++) {
            var item = normalizeWhitespace(parts[i]);
            if (!item) continue;
            var candidate = item.split(/\s+/)[0];
            if (candidate) return candidate;
        }
        return "";
    }

    function imageUrlFromNode(node, baseUrl) {
        if (!node) return "";
        var style = attrOf(node, "style");
        var styleMatch = style ? style.match(/url\((['"]?)([^'")]+)\)/i) : null;
        var resolved = ensureAbsoluteUrl(firstNonEmpty([
            attrOf(node, "data-bg_url"),
            attrOf(node, "data-bg-url"),
            attrOf(node, "data-thumbnail"),
            attrOf(node, "data-thumb"),
            attrOf(node, "data-original"),
            attrOf(node, "data-src"),
            attrOf(node, "data-lazy-src"),
            attrOf(node, "data-srcset"),
            attrOf(node, "data-file"),
            attrOf(node, "data-url"),
            attrOf(node, "poster"),
            firstUrlFromSrcset(attrOf(node, "srcset")),
            styleMatch ? styleMatch[2] : "",
            attrOf(node, "src")
        ]), baseUrl);
        if (resolved) return resolved;
        if (!node.querySelectorAll) return "";

        var images = node.querySelectorAll("img");
        for (var i = 0; i < images.length; i++) {
            resolved = ensureAbsoluteUrl(firstNonEmpty([
                attrOf(images[i], "data-thumbnail"),
                attrOf(images[i], "data-thumb"),
                attrOf(images[i], "data-original"),
                attrOf(images[i], "data-src"),
                attrOf(images[i], "data-lazy-src"),
                attrOf(images[i], "data-srcset"),
                attrOf(images[i], "data-file"),
                attrOf(images[i], "data-url"),
                attrOf(images[i], "poster"),
                firstUrlFromSrcset(attrOf(images[i], "srcset")),
                attrOf(images[i], "src")
            ]), baseUrl);
            if (resolved) return resolved;
        }
        return "";
    }

    function textOfNodeWithoutSelectors(node, selectors) {
        if (!node) return "";
        if (!node.cloneNode || !selectors || selectors.length === 0) return textOf(node);
        var cloned = node.cloneNode(true);
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            if (!selector) continue;
            var matches = cloned.querySelectorAll(selector);
            for (var j = 0; j < matches.length; j++) {
                if (matches[j] && matches[j].remove) matches[j].remove();
            }
        }
        return textOf(cloned);
    }

    function parseBoardItemsWithCurrentSelectors(doc, baseUrl, match, boardPage) {
        if (SITE.parseBoardItemsCustom) {
            try {
                var customItems = SITE.parseBoardItemsCustom(doc, baseUrl, match, boardPage);
                if (customItems && customItems.length > 0) return customItems;
            } catch (e) {
            }
        }
        var rows = allNodes(doc, SITE.selectors.listRows);
        var items = [];
        var seen = {};
        for (var i = 0; i < rows.length; i++) {
            var item = extractListItem(rows[i], baseUrl);
            if (!item || !item.link || seen[item.link]) continue;
            seen[item.link] = true;
            item.category = formatBoardListCategory(item.category || "");
            items.push(item);
        }
        return items;
    }

    function parseBoardItems(doc, baseUrl, match, boardPage) {
        var profiles = selectorProfiles("board");
        var fallbackItems = [];
        var fallbackProfileIndex = 0;
        for (var i = 0; i < profiles.length; i++) {
            var items = withSelectorProfileIndex(i, function () {
                return parseBoardItemsWithCurrentSelectors(doc, baseUrl, match, boardPage) || [];
            });
            items = filterItemsForBoard(items, match);
            if (i === 0) {
                fallbackItems = items || [];
                fallbackProfileIndex = i;
            }
            if (items && items.length > 0) {
                return {
                    items: items,
                    profileIndex: i
                };
            }
        }
        return {
            items: fallbackItems || [],
            profileIndex: fallbackProfileIndex
        };
    }

    function parseBoardItemsFromHtmlWithProfiles(html, baseUrl, match, boardPage) {
        var profiles = selectorProfiles("board");
        var fallbackItems = [];
        var fallbackProfileIndex = 0;
        for (var i = 0; i < profiles.length; i++) {
            var items = withSelectorProfileIndex(i, function () {
                return SITE.parseBoardItemsFromHtml ? (SITE.parseBoardItemsFromHtml(html, baseUrl, match, boardPage) || []) : [];
            });
            items = filterItemsForBoard(items, match);
            if (i === 0) {
                fallbackItems = items || [];
                fallbackProfileIndex = i;
            }
            if (items && items.length > 0) {
                return {
                    items: items,
                    profileIndex: i
                };
            }
        }
        return {
            items: fallbackItems || [],
            profileIndex: fallbackProfileIndex
        };
    }

    function choosePostSelectorProfileIndex(doc) {
        var profiles = selectorProfiles("post");
        var bestIndex = 0;
        var bestScore = -1;

        for (var i = 0; i < profiles.length; i++) {
            var score = withSelectorProfileIndex(i, function () {
                var total = 0;
                if (firstNode(doc, SITE.selectors.postContent)) total += 8;
                if (firstText(doc, SITE.selectors.postTitle)) total += 4;
                if (firstText(doc, SITE.selectors.postAuthor)) total += 2;
                if (firstText(doc, SITE.selectors.postDate)) total += 1;
                return total;
            });
            if (score > bestScore) {
                bestScore = score;
                bestIndex = i;
            }
        }

        return bestIndex;
    }

    function filterItemsForBoard(items, match) {
        var param = SITE.listBoardQueryParam || "";
        if (!param || !match || !match.board || !match.board.id) return items;

        var filtered = [];
        for (var i = 0; i < (items || []).length; i++) {
            var item = items[i];
            var info = parseAbsoluteUrl(item ? item.link : "");
            if (!info) continue;
            if (queryValue(info.query, param) === String(match.board.id)) {
                filtered.push(item);
            }
        }
        return filtered.length > 0 ? filtered : items;
    }

    function detectCommentLevel(row) {
        var attrs = SITE.commentLevelAttrs || [];
        var levelNode = firstNode(row, SITE.selectors.commentLevel);
        var candidates = [];
        if (levelNode) candidates.push(levelNode);
        candidates.push(row);
        for (var i = 0; i < candidates.length; i++) {
            var node = candidates[i];
            if (!node) continue;
            for (var j = 0; j < attrs.length; j++) {
                var raw = attrOf(node, attrs[j]);
                if (!raw) continue;
                var parsed = parseInt(raw, 10);
                if (!isNaN(parsed)) return parsed;
            }
        }
        return 0;
    }

    function parseComments(doc, postUrl) {
        try {
            var parsed = SITE.parseComments ? SITE.parseComments(doc, postUrl) : null;
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
        }
        return [];
    }

    function buildHomeItems(entries) {
        var items = [];
        for (var i = 0; i < (entries || []).length; i++) {
            var entry = entries[i];
            if (!entry) continue;
            if (entry.kind === "group") {
                var parentPath = entry.parentPath || "";
                items.push({
                    id: homeGroupOrderId(entry.path),
                    link: buildCategoryRouteUrl(entry.path),
                    title: entry.title,
                    description: entry.description || "카테고리 바로가기",
                    category: parentPath || MENU_ALL_BOARDS,
                    author: entry.totalCount + "개 게시판",
                    date: "",
                    commentCount: "",
                    viewCount: "",
                    likeCount: "",
                    types: ["link"],
                    menus: [MENU_HOME_REMOVE],
                    hotCount: entry.visibleCount || 0,
                    coldCount: Math.max(0, (entry.totalCount || 0) - (entry.visibleCount || 0))
                });
                continue;
            }
            var board = entry.board || entry;
            items.push({
                id: board.id,
                link: board.url,
                title: board.title,
                description: board.description || board.url.replace(/^https?:\/\//, ""),
                category: SITE.displayName,
                author: "",
                date: "",
                commentCount: "",
                viewCount: "",
                likeCount: "",
                types: ["link"],
                menus: [],
                hotCount: 0,
                coldCount: 0
            });
        }
        return items;
    }

    function supportsCategoryBrowser() {
        return getAllBoards().length > 0;
    }

    function resolveMenuBoardId(state) {
        var boardId = "";
        if (state && state.board && state.board.id) {
            boardId = state.board.id;
        } else if (state && state.boardId) {
            boardId = state.boardId;
        }
        return normalizeWhitespace(boardId);
    }

    function buildBoardHomeToggleMenu(boardId) {
        var resolvedId = normalizeWhitespace(boardId);
        if (!resolvedId) return null;
        return {
            label: MENU_HOME_TOGGLE,
            checked: isBoardVisible(resolvedId, getAllBoardsVisibility())
        };
    }

    function resolveMenuBoard(state) {
        var boardId = resolveMenuBoardId(state);
        if (!boardId) return null;
        return boardById(boardId) || {
            id: boardId,
            title: normalizeWhitespace(state && state.boardTitle ? state.boardTitle : boardId),
            showMedia: false
        };
    }

    function filterMenusByLabel(menus, excludedLabels) {
        var out = [];
        var excluded = excludedLabels || {};
        for (var i = 0; i < (menus || []).length; i++) {
            if (excluded[menuItemLabel(menus[i])]) continue;
            out.push(menus[i]);
        }
        return out;
    }

    function buildBoardMediaToggleMenu(state) {
        var board = resolveMenuBoard(state);
        if (!board) return null;
        return {
            label: MENU_MEDIA_TOGGLE,
            checked: boardShowsMedia(board)
        };
    }

    function buildBoardGalleryToggleMenu(state) {
        var board = resolveMenuBoard(state);
        if (!board) return null;
        return {
            label: MENU_GALLERY_MODE,
            checked: boardUsesGalleryMode(board)
        };
    }

    function getHomeMenus(isReorderable) {
        var menus = [];
        if (supportsCacheSettings()) menus.push(MENU_CACHE_SETTINGS);
        menus.push(MENU_GO);
        menus.push(MENU_BROWSER);
        if (supportsCategoryBrowser()) menus.push(MENU_ALL_BOARDS);
        menus.push(MENU_SETTINGS);
        if (supportsBoardReorder()) {
            menus.push({ label: MENU_REORDER, checked: !!isReorderable });
        }
        try {
            menus = SITE.buildHomeMenus ? (SITE.buildHomeMenus(menus, !!isReorderable) || menus) : menus;
        } catch (e) {
        }
        if (supportsCli() && !hasMenuItem(menus, MENU_CLI)) {
            menus.push(MENU_CLI);
        }
        menus = moveMenuItemToFront(menus, MENU_ALL_BOARDS);
        menus = moveMenuItemToFront(menus, MENU_GO);
        menus = moveMenuItemToEnd(menus, MENU_CACHE_SETTINGS);
        return menus;
    }

    function getBoardMenus(state) {
        var menus = [MENU_BROWSER];
        try {
            menus = SITE.buildBoardMenus ? (SITE.buildBoardMenus(menus, state || {}) || menus) : menus;
        } catch (e) {
        }
        menus = filterMenusByLabel(menus, {
            "브라우저로 보기": true,
            "전체 게시판": true,
            "미디어 표시": true,
            "갤러리 모드": true,
            "홈 추가": true
        });
        var ordered = [MENU_BROWSER];
        var mediaToggle = buildBoardMediaToggleMenu(state);
        if (mediaToggle) ordered.push(mediaToggle);
        var galleryToggle = buildBoardGalleryToggleMenu(state);
        if (galleryToggle) ordered.push(galleryToggle);
        ordered = ordered.concat(menus);
        var boardToggle = buildBoardHomeToggleMenu(resolveMenuBoardId(state));
        if (boardToggle) {
            ordered.push(boardToggle);
        }
        return ordered;
    }

    function getPostMenus(state) {
        var menus = [MENU_BROWSER];
        try {
            menus = SITE.buildPostMenus ? (SITE.buildPostMenus(menus, state || {}) || menus) : menus;
        } catch (e) {
        }
        menus = filterMenusByLabel(menus, {
            "전체 게시판": true
        });
        var boardToggle = buildBoardHomeToggleMenu(resolveMenuBoardId(state));
        if (boardToggle && !hasMenuItem(menus, MENU_HOME_TOGGLE)) {
            menus.push(boardToggle);
        }
        return menus;
    }

    function runSiteShowBoardSettings(parentViewId) {
        try {
            return SITE.showBoardSettings ? SITE.showBoardSettings(parentViewId || 0) : null;
        } catch (e) {
            if (parentViewId) {
                synura.update(parentViewId, { models: { snackbar: e.toString() } });
            }
            return {
                success: false,
                error: e.toString()
            };
        }
    }

    function getCacheSettingsBody() {
        return [
            {
                type: "number",
                name: "ttl",
                label: "캐시 TTL (분)",
                value: Math.max(1, Math.round(getCacheTTL() / 60000))
            },
            {
                type: "boolean",
                name: "show_snackbar",
                label: "캐시 알림 표시",
                value: getShowCacheSnackbar()
            },
            {
                type: "boolean",
                name: "category_two_char",
                label: "카테고리 2자",
                value: getUseTwoCharCategory()
            },
            {
                type: "number",
                name: "gallery_column_count",
                label: "갤러리 열 수",
                value: getGalleryColumnCount()
            }
        ];
    }

    function getBoardGroupPath(board) {
        if (!board) return "";
        var direct = cleanBoardGroupText(board.group || "");
        if (direct) return direct;
        if (SITE.boardGroupMap && board.id && SITE.boardGroupMap[board.id]) {
            var mapped = cleanBoardGroupText(SITE.boardGroupMap[board.id]);
            if (mapped) return mapped;
        }
        if (board.custom) return "사용자 추가";
        if (board.dynamic) {
            var detail = cleanBoardGroupText(board.description || "");
            if (detail && detail !== cleanBoardGroupText(board.title || "") && detail !== "사용자 추가") {
                return detail;
            }
            return cleanBoardGroupText(SITE.dynamicBoardGroupLabel || "") || "동기화";
        }
        return "";
    }

    function getBoardGroupLabel(board) {
        var path = getBoardGroupPath(board);
        return path || "기본";
    }

    function boardSettingsItemTitle(board) {
        return normalizeWhitespace(board ? board.title : "");
    }

    function getBoardSettingsPageSize() {
        var parsed = parseInt(String(SITE.boardSettingsPageSize || 96), 10);
        if (!(parsed > 0)) parsed = 96;
        if (parsed > 120) parsed = 120;
        return parsed;
    }

    function getBoardSettingsSectionInfo(board) {
        var label = getBoardGroupLabel(board);
        return {
            key: "group:" + (normalizeWhitespace(label) || "default"),
            label: label || "게시판"
        };
    }

    function getBoardSettingsSections() {
        var boards = getBoardSettingsBoards();
        var pageSize = getBoardSettingsPageSize();
        var groups = [];
        var groupMap = {};
        for (var i = 0; i < boards.length; i++) {
            var board = boards[i];
            var info = getBoardSettingsSectionInfo(board);
            var key = normalizeWhitespace(info && info.key ? info.key : "");
            var label = normalizeWhitespace(info && info.label ? info.label : "");
            if (!key) key = "default";
            if (!label) label = "게시판";
            if (!groupMap[key]) {
                groupMap[key] = {
                    key: key,
                    label: label,
                    boards: []
                };
                groups.push(groupMap[key]);
            }
            groupMap[key].boards.push(board);
        }

        var sections = [];
        for (var j = 0; j < groups.length; j++) {
            var group = groups[j];
            var totalPages = Math.max(1, Math.ceil(group.boards.length / pageSize));
            for (var page = 0; page < totalPages; page++) {
                var chunk = group.boards.slice(page * pageSize, (page + 1) * pageSize);
                var boardIds = [];
                for (var k = 0; k < chunk.length; k++) {
                    boardIds.push(chunk[k].id);
                }
                sections.push({
                    key: group.key + ":" + page,
                    label: totalPages > 1 ? (group.label + " (" + (page + 1) + "/" + totalPages + ")") : group.label,
                    boardIds: boardIds
                });
            }
        }

        if (sections.length === 0) {
            sections.push({
                key: "default:0",
                label: "게시판",
                boardIds: []
            });
        }
        return sections;
    }

    function clampBoardSettingsSectionIndex(sectionIndex, sections) {
        var list = sections || getBoardSettingsSections();
        if (!list || list.length === 0) return 0;
        var index = parseInt(String(sectionIndex == null ? 0 : sectionIndex), 10);
        if (isNaN(index) || index < 0) return 0;
        if (index >= list.length) return list.length - 1;
        return index;
    }

    function createBoardSettingsState(parentViewId, sectionIndex, action) {
        var sections = getBoardSettingsSections();
        return {
            kind: "board_settings",
            from: "board_settings",
            parentViewId: parentViewId || 0,
            sectionIndex: clampBoardSettingsSectionIndex(sectionIndex, sections)
        };
    }

    function createBoardSettingsSectionState(settingsViewId, parentViewId, sectionIndex) {
        var sections = getBoardSettingsSections();
        return {
            kind: "board_settings_section",
            from: "board_settings_section",
            settingsViewId: settingsViewId || 0,
            parentViewId: parentViewId || 0,
            sectionIndex: clampBoardSettingsSectionIndex(sectionIndex, sections)
        };
    }

    function getBoardSettingsSection(state) {
        var sections = getBoardSettingsSections();
        var sectionIndex = clampBoardSettingsSectionIndex(state && state.sectionIndex, sections);
        return {
            sections: sections,
            sectionIndex: sectionIndex,
            current: sections[sectionIndex] || sections[0]
        };
    }

    function getBoardSettingsBody(state) {
        var visible = getAllBoardsVisibility();
        var allBoards = getBoardSettingsBoards();
        var boardMap = {};
        for (var i = 0; i < allBoards.length; i++) {
            boardMap[allBoards[i].id] = allBoards[i];
        }
        var section = getBoardSettingsSection(state).current;
        var boardIds = section && section.boardIds ? section.boardIds : [];
        var body = [];
        for (var j = 0; j < boardIds.length; j++) {
            var board = boardMap[boardIds[j]];
            if (!board) continue;
            var isVisible = isBoardVisible(board.id, visible);
            body.push({
                type: "boolean",
                name: board.id,
                label: boardSettingsItemTitle(board),
                value: isVisible
            });
        }
        return body;
    }

    function getBoardSettingsMessage(state) {
        var info = getBoardSettingsSection(state);
        var current = info.current || { label: "게시판", boardIds: [] };
        return current.label + " · " + current.boardIds.length + "개";
    }

    function getBoardSettingsButtons() {
        return ["저장", "닫기"];
    }

    function getSimpleBoardSettingsBody() {
        var visible = getAllBoardsVisibility();
        var allBoards = getBoardSettingsBoards();
        var body = [];
        for (var i = 0; i < allBoards.length; i++) {
            var board = allBoards[i];
            var isVisible = isBoardVisible(board.id, visible);
            body.push({
                type: "boolean",
                name: board.id,
                label: boardSettingsItemTitle(board),
                value: isVisible
            });
        }
        return body;
    }

    function getSimpleBoardSettingsButtons() {
        return ["저장"];
    }

    function getSimpleBoardSettingsMenus() {
        var menus = [MENU_BOARD_SYNC, "추가"];
        if (supportsBoardDelete()) menus.push("삭제");
        menus.push("초기화", "취소");
        return menus;
    }

    function shouldUseLargeBoardSettings() {
        return getAllBoards().length > getBoardSettingsLargeThreshold();
    }

    function createBoardSettingsRootState(parentViewId) {
        return {
            kind: "board_settings_root",
            from: "board_settings_root",
            parentViewId: parentViewId || 0,
            title: SITE.boardSettingsTitle || MENU_SETTINGS,
            link: normalizeUrl(SITE.browserHomeUrl) || SITE.browserHomeUrl
        };
    }

    function boardSettingsSectionPreview(section, boardMap) {
        var ids = section && section.boardIds ? section.boardIds : [];
        var titles = [];
        for (var i = 0; i < ids.length && titles.length < 3; i++) {
            var board = boardMap[ids[i]];
            if (!board) continue;
            titles.push(normalizeWhitespace(board.title || board.id));
        }
        var text = titles.join(", ");
        if (ids.length > titles.length) {
            text += (text ? " " : "") + "외 " + (ids.length - titles.length) + "개";
        }
        return text || "게시판이 없습니다.";
    }

    function buildBoardSettingsRootItems() {
        var sections = getBoardSettingsSections();
        var visibleMap = getAllBoardsVisibility();
        var allBoards = getBoardSettingsBoards();
        var boardMap = {};
        for (var i = 0; i < allBoards.length; i++) {
            boardMap[allBoards[i].id] = allBoards[i];
        }

        var items = [];
        for (var j = 0; j < sections.length; j++) {
            var section = sections[j];
            var totalCount = section && section.boardIds ? section.boardIds.length : 0;
            var visibleCount = 0;
            for (var k = 0; k < totalCount; k++) {
                if (isBoardVisible(section.boardIds[k], visibleMap)) visibleCount += 1;
            }
            items.push({
                id: String(j),
                title: section.label,
                description: boardSettingsSectionPreview(section, boardMap),
                category: visibleCount + "/" + totalCount + " 표시",
                author: totalCount + "개 게시판",
                date: "",
                commentCount: "",
                viewCount: "",
                likeCount: "",
                types: ["link"],
                menus: [],
                hotCount: visibleCount,
                coldCount: Math.max(0, totalCount - visibleCount)
            });
        }
        return items;
    }

    function getBoardSettingsRootMenus(state) {
        var menus = ["추가"];
        if (supportsBoardDelete()) menus.push("삭제");
        menus.push("초기화");
        try {
            menus = SITE.buildBoardSettingsRootMenus ? (SITE.buildBoardSettingsRootMenus(menus, state || {}) || menus) : menus;
        } catch (e) {
        }
        if (!hasMenuItem(menus, MENU_BOARD_SYNC)) menus.unshift(MENU_BOARD_SYNC);
        return menus;
    }

    function createBoardSettingsRootRoute(parentViewId) {
        var context = createBoardSettingsRootState(parentViewId);
        return {
            kind: "board_settings_root",
            url: context.link,
            viewData: {
                view: "/views/list",
                styles: {
                    title: SITE.boardSettingsTitle || MENU_SETTINGS,
                    layout: "list",
                    menu: true,
                    pagination: false
                },
                models: {
                    contents: buildBoardSettingsRootItems(),
                    menus: getBoardSettingsRootMenus(context)
                }
            },
            context: context
        };
    }

    function refreshBoardSettingsRootView(viewId, state, snackbar) {
        var route = createBoardSettingsRootRoute(state ? state.parentViewId : 0);
        updateViewFromRoute(viewId, route, snackbar || "");
    }

    function getBoardAddMode() {
        return SITE.boardAddMode === "id_title" ? "id_title" : "url_title";
    }

    function getBoardAddDialogBody() {
        if (getBoardAddMode() === "id_title") {
            return [
                { type: "string", name: "id", label: "게시판 ID", value: "" },
                { type: "string", name: "title", label: "이름", value: "" }
            ];
        }
        return [
            { type: "string", name: "url", label: "게시판 URL", value: "" },
            { type: "string", name: "title", label: "이름 (선택)", value: "" }
        ];
    }

    function getBoardAddDialogMessage() {
        if (getBoardAddMode() === "id_title") {
            return "게시판 ID와 이름을 입력하세요.";
        }
        return "게시판 URL을 입력하세요. 이름은 비워두면 자동으로 사용합니다.";
    }

    function hasCachedDynamicBoardCatalog() {
        if (!SITE.supportsBoardCatalogSync) return false;
        var cached = getDynamicBoards({ allowNetwork: false });
        return Array.isArray(cached) && cached.length > 0;
    }

    function shouldPromptBoardCatalogSync() {
        return !!SITE.supportsBoardCatalogSync &&
            !SITE.hasFullBoardCatalog &&
            !hasCachedDynamicBoardCatalog();
    }

    function buildHomeModels(isReorderable, snackbar) {
        homeBoards = getVisibleBoards();
        rebuildBoardIndex();
        return {
            contents: buildHomeItems(getHomeEntries()),
            menus: getHomeMenus(!!isReorderable),
            snackbar: snackbar || ""
        };
    }

    function createHomeContext(isReorderable) {
        return {
            kind: "home",
            link: normalizeUrl(SITE.browserHomeUrl),
            isReorderable: !!isReorderable
        };
    }

    function updateHomeAfterBoardMutation(homeViewId, snackbar) {
        if (!homeViewId) return;
        var homeState = getViewState(homeViewId);
        if (!homeState || homeState.kind !== "home") return;
        var isReorderable = !!homeState.isReorderable;
        synura.update(homeViewId, {
            models: buildHomeModels(isReorderable, snackbar || "")
        });
        setViewState(homeViewId, createHomeContext(isReorderable));
    }

    function resetBoardSettingsStorage() {
        localStorage.removeItem(CUSTOM_BOARDS_KEY);
        localStorage.removeItem(VISIBLE_BOARDS_KEY);
        localStorage.removeItem(BOARD_ORDER_KEY);
        localStorage.removeItem(HOME_GROUP_PATHS_KEY);
        homeBoards = getVisibleBoards();
        rebuildBoardIndex();
    }

    function resetHomeAfterBoardSettingsReset(settingsViewId, homeViewId, snackbar) {
        var route = createHomeRoute(false, snackbar || "");
        if (settingsViewId) synura.close(settingsViewId);
        if (homeViewId) synura.close(homeViewId);
        openRoute(route);
    }

    function syncDynamicBoardsAndRefresh(viewId, parentViewId, rootState) {
        var items;
        try {
            items = getDynamicBoards({ allowNetwork: true, force: true });
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
            return;
        }
        homeBoards = getVisibleBoards();
        rebuildBoardIndex();

        var snackbar = items.length > 0
            ? ("게시판 " + items.length + "개를 가져왔습니다.")
            : "가져올 게시판이 없습니다.";

        if (rootState && rootState.kind === "board_settings_root") {
            refreshBoardSettingsRootView(viewId, rootState, snackbar);
        } else {
            refreshBoardSettingsView(viewId, createBoardSettingsState(parentViewId || 0, 0, "열기"), snackbar);
        }

        if (parentViewId) {
            var parentState = getViewState(parentViewId);
            updateViewFromRoute(parentViewId, createHomeRoute(!!(parentState && parentState.isReorderable), ""));
        }
    }

    function showCategoryBoardSyncPrompt(parentViewId, homeViewId) {
        var context = {
            from: "category_home_sync_prompt",
            parentViewId: parentViewId || 0,
            homeViewId: homeViewId || 0
        };
        var result = synura.open({
            view: "/dialogs/input",
            styles: {
                title: MENU_ALL_BOARDS,
                message: "캐시된 전체 게시판 목록이 없습니다. 지금 " + MENU_BOARD_SYNC + "를 실행할까요?",
                close: true
            },
            models: {
                body: [],
                buttons: [MENU_BOARD_SYNC, BUTTON_OPEN_CATEGORY_HOME_WITHOUT_SYNC]
            }
        }, context, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, context);
        }
        return result;
    }

    function cliMessage(viewId, message) {
        synura.update(viewId, {
            models: {
                append: [{
                    user: "System",
                    message: message,
                    format: "markdown"
                }]
            }
        });
    }

    function cliHelpText() {
        var addUsage = getBoardAddMode() === "id_title"
            ? '/board add "id" "title"'
            : '/board add "url" ["title"]';
        return [
            SITE.displayName + " CLI",
            "",
            "General",
            "- /help show this help",
            "- /info show site, board, cache, and cookie status",
            "- /q close CLI",
            "",
            "Fetch",
            "- /fetch <url> fetch raw HTML and show a show html link",
            "- accepts full URLs, example.com/path, or site-relative paths",
            "",
            "Boards",
            "- /board list list boards (on/off, * means custom)",
            "- " + addUsage + " add a custom board",
            '- /board del "id" remove a custom board',
            '- /board show "id" show a board on home',
            '- /board hide "id" hide a board from home',
            "",
            "Cache",
            "- /cache show current TTL and snackbar state",
            "- /cache set <minutes> change cache TTL",
            "- /cache clear clear session cache",
            "",
            "Cookie",
            "- /cookie show saved cookie preview",
            '- /cookie set "value" save cookie used by fetch/auth',
            "- /cookie clear remove saved cookie",
            "",
            "Examples",
            "- " + addUsage,
            "- /fetch " + SITE.browserHomeUrl,
            '- /cookie set "name=value; other=value"',
            "",
            "SYNURA",
            synuraObjectText()
        ].join("\n");
    }

    function tokenizeCliInput(input) {
        var matched = String(input || "").match(/"[^"]*"|'[^']*'|\S+/g) || [];
        for (var i = 0; i < matched.length; i++) {
            matched[i] = matched[i].replace(/^['"]|['"]$/g, "");
        }
        return {
            ok: true,
            tokens: matched
        };
    }

    function normalizeCliUrl(raw) {
        var input = String(raw || "").trim();
        if (!input) return "";
        if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input) || input.indexOf("//") === 0 || input.charAt(0) === "/" || input.charAt(0) === "?") {
            return normalizeUrl(input) || ensureAbsoluteUrl(input, SITE.browserHomeUrl) || input;
        }
        return normalizeUrl("https://" + input) || ("https://" + input);
    }

    function openCli(parentViewId) {
        var result = synura.open({
            view: "/views/chat",
            styles: {
                title: SITE.displayName + " CLI",
                menu: true
            },
            models: {
                menus: ["Help", "Exit"],
                append: [{
                    user: "System",
                    message: SITE.displayName + " CLI\nType /help for command reference.",
                    format: "markdown"
                }]
            }
        }, {
            kind: "cli",
            parentViewId: parentViewId || 0
        }, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, { kind: "cli", parentViewId: parentViewId || 0 });
        }
        return result;
    }

    function openCliSourceView(parentViewId, payload) {
        if (!payload || !payload.html) {
            if (parentViewId) cliMessage(parentViewId, "html not found");
            return false;
        }
        var result = synura.open({
            view: "/views/source",
            styles: {
                title: payload.url || "HTML Source",
                language: "html",
                lineNumbers: true,
                wordWrap: false
            },
            models: {
                content: payload.html
            }
        }, {
            kind: "source",
            parentViewId: parentViewId || 0
        }, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, { kind: "source", parentViewId: parentViewId || 0 });
            return true;
        }
        if (parentViewId) cliMessage(parentViewId, "failed to open source");
        return false;
    }

    function handleCliLinkClick(viewId, link) {
        if (!link || String(link).indexOf("synura://action?") !== 0) return false;
        var params = new URLSearchParams(String(link).substring("synura://action?".length));
        if (params.get("cmd") !== "showHtml") return false;
        var payload = sessionStorage.getItem(params.get("key") || "");
        openCliSourceView(viewId, payload);
        return true;
    }

    function handleCliCommand(viewId, state, context, input) {
        var parsed = tokenizeCliInput(input);
        if (!parsed.ok) {
            cliMessage(viewId, "Error: " + parsed.error);
            return true;
        }

        var tokens = parsed.tokens || [];
        if (tokens.length === 0) return true;

        var parentViewId = context && context.parentViewId ? context.parentViewId : 0;
        if (!parentViewId && state && state.parentViewId) {
            parentViewId = state.parentViewId;
        }
        var command = String(tokens[0] || "").toLowerCase();
        var addUsage = getBoardAddMode() === "id_title"
            ? '/board add "id" "title"'
            : '/board add "url" ["title"]';

        if (command === "/q" || command === "/exit" || command === "exit") {
            synura.close(viewId);
            return true;
        }

        if (command === "/help") {
            cliMessage(viewId, cliHelpText());
            return true;
        }

        if (command === "/info") {
            var allBoards = getSortedBoards();
            var visibleBoards = getVisibleBoards();
            var customBoards = getCustomBoards();
            cliMessage(viewId, [
                "site: " + SITE.displayName,
                "boards: " + visibleBoards.length + "/" + allBoards.length + ", custom=" + customBoards.length,
                "cache: " + Math.max(1, Math.round(getCacheTTL() / 60000)) + " min, sb=" + (getShowCacheSnackbar() ? "on" : "off"),
                "cookie: " + (getSavedCookie() ? "set" : "not set")
            ].join("\n"));
            return true;
        }

        if (command === "/cookie") {
            if (tokens.length === 1) {
                var currentCookie = getSavedCookie();
                if (!currentCookie) {
                    cliMessage(viewId, "cookie: not set");
                    return true;
                }
                var displayCookie = currentCookie.length > 200 ? currentCookie.substring(0, 200) + "..." : currentCookie;
                cliMessage(viewId, "cookie:\n```\n" + displayCookie + "\n```");
                return true;
            }

            if (tokens[1] === "set") {
                var cookieValue = tokens.slice(2).join(" ").trim();
                if (!cookieValue) {
                    cliMessage(viewId, 'Usage: `/cookie set "value"`');
                    return true;
                }
                setSavedCookie(cookieValue);
                cliMessage(viewId, "cookie saved");
                return true;
            }

            if (tokens[1] === "clear") {
                setSavedCookie("");
                cliMessage(viewId, "cookie cleared");
                return true;
            }
        }

        if (command === "/cache") {
            if (tokens.length === 1) {
                cliMessage(viewId, "cache: " + Math.max(1, Math.round(getCacheTTL() / 60000)) + " min, snackbar=" + (getShowCacheSnackbar() ? "on" : "off"));
                return true;
            }

            if (tokens[1] === "set") {
                var ttlMinutes = parseInt(String(tokens[2] || ""), 10);
                if (!(ttlMinutes > 0)) {
                    cliMessage(viewId, "Usage: `/cache set <minutes>`");
                    return true;
                }
                setCacheTTL(ttlMinutes * 60000);
                cliMessage(viewId, "cache ttl=" + ttlMinutes + " min");
                return true;
            }

            if (tokens[1] === "clear") {
                sessionStorage.clear();
                cliMessage(viewId, "cache cleared");
                return true;
            }
        }

        if (command === "/fetch") {
            var fetchUrl = normalizeCliUrl(tokens.slice(1).join(" "));
            if (!fetchUrl) {
                cliMessage(viewId, "Usage: `/fetch <url>`");
                return true;
            }
            try {
                var response = fetchWithLogging(fetchUrl, buildFetchOptions());
                if (!response) {
                    cliMessage(viewId, "fetch failed");
                    return true;
                }
                var status = response.status || 0;
                var html = response.text();
                if (shouldUseBrowserCookieAuth() && isAuthRequiredResponse(fetchUrl, status, html)) {
                    throw makeAuthRequiredError(fetchUrl, status);
                }
                var key = CACHE_PREFIX + "cli_fetch:" + String(Date.now());
                sessionStorage.setItem(key, {
                    html: html,
                    url: fetchUrl
                });
                cliMessage(viewId, "fetch: " + status + " " + fetchUrl + "\n[show html](synura://action?cmd=showHtml&key=" + encodeURIComponent(key) + ")");
            } catch (e) {
                var errorText = String(e || "");
                cliMessage(viewId, parseAuthRequiredError(errorText) ? "auth required" : ("fetch failed: " + errorText));
            }
            return true;
        }

        if (command === "/board") {
            if (tokens[1] === "list") {
                var boards = getSortedBoards();
                var visibleMap = getAllBoardsVisibility();
                var lines = ["Boards:"];
                for (var i = 0; i < boards.length; i++) {
                    var board = boards[i];
                    lines.push("- " + board.title + " `" + board.id + "` " + (isBoardVisible(board.id, visibleMap) ? "on" : "off") + (board.custom ? " *" : ""));
                }
                cliMessage(viewId, lines.join("\n"));
                return true;
            }

            if (tokens[1] === "add") {
                var addMode = getBoardAddMode();
                var addFields = null;
                if (addMode === "id_title") {
                    if (tokens.length < 4) {
                        cliMessage(viewId, "Usage: `" + addUsage + "`");
                        return true;
                    }
                    addFields = {
                        id: tokens[2],
                        title: tokens.slice(3).join(" ")
                    };
                } else {
                    if (tokens.length < 3) {
                        cliMessage(viewId, "Usage: `" + addUsage + "`");
                        return true;
                    }
                    addFields = {
                        url: tokens[2],
                        title: tokens.length > 3 ? tokens.slice(3).join(" ") : ""
                    };
                }
                var added = addCustomBoard(addFields);
                if (!added.ok) {
                    cliMessage(viewId, "Error: " + added.error);
                    return true;
                }
                updateHomeAfterBoardMutation(parentViewId, added.activated ? "게시판이 다시 표시되었습니다." : "게시판이 추가되었습니다.");
                cliMessage(viewId, "board saved: `" + added.board.id + "` " + added.board.title);
                return true;
            }

            if (tokens[1] === "del") {
                var removeId = normalizeWhitespace(tokens.slice(2).join(" "));
                if (!removeId) {
                    cliMessage(viewId, 'Usage: `/board del "id"`');
                    return true;
                }
                if (!removeCustomBoard(removeId)) {
                    cliMessage(viewId, 'Error: cannot remove "' + removeId + '".');
                    return true;
                }
                updateHomeAfterBoardMutation(parentViewId, "게시판이 삭제되었습니다.");
                cliMessage(viewId, 'board removed: "' + removeId + '"');
                return true;
            }

            if (tokens[1] === "show" || tokens[1] === "hide") {
                var targetId = normalizeWhitespace(tokens.slice(2).join(" "));
                if (!targetId) {
                    cliMessage(viewId, 'Usage: `/board ' + tokens[1] + ' "id"`');
                    return true;
                }
                var visibleBoard = setBoardVisible(targetId, tokens[1] === "show");
                if (!visibleBoard) {
                    cliMessage(viewId, 'Error: unknown board "' + targetId + '".');
                    return true;
                }
                updateHomeAfterBoardMutation(parentViewId, tokens[1] === "show" ? "게시판이 표시됩니다." : "게시판이 숨겨집니다.");
                cliMessage(viewId, 'board "' + targetId + '" -> ' + (tokens[1] === "show" ? "visible" : "hidden"));
                return true;
            }
        }

        cliMessage(viewId, "unknown command: `" + input + "`");
        return true;
    }

    function handleCliEvent(viewId, event, state, context) {
        if (event.eventId === "MENU_CLICK") {
            if (event.data && event.data.menu === "Exit") {
                synura.close(viewId);
            } else {
                cliMessage(viewId, cliHelpText());
            }
            return true;
        }

        if (event.eventId === "CLICK" && event.data && event.data.link) {
            return handleCliLinkClick(viewId, event.data.link);
        }

        if (event.eventId === "SUBMIT" && event.data && event.data.message !== undefined) {
            return handleCliCommand(viewId, state, context, String(event.data.message || "").trim());
        }

        return false;
    }

    function refreshBoardSettingsParent(viewId, snackbar) {
        if (!viewId) return;
        try {
            if (SITE.refreshBoardSettingsParent && SITE.refreshBoardSettingsParent(viewId, snackbar || "")) {
                return;
            }
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
            return;
        }
        var state = getViewState(viewId);
        if (state && state.kind === "board_settings_root") {
            refreshBoardSettingsRootView(viewId, state, snackbar || "");
            return;
        }
        if (state && state.from === "board_settings") {
            refreshBoardSettingsView(viewId, createBoardSettingsState(state.parentViewId || 0, 0, "열기"), snackbar || "");
            return;
        }
        refreshBoardSettingsView(viewId, createBoardSettingsState(state ? state.parentViewId : 0, 0, "열기"), snackbar || "");
    }

    function refreshBoardSettingsView(viewId, state, snackbar) {
        var nextState = createBoardSettingsState(state ? state.parentViewId : 0, 0, "열기");
        synura.update(viewId, {
            styles: {
                title: SITE.boardSettingsTitle || MENU_SETTINGS,
                message: "",
                menu: true
            },
            models: {
                body: getSimpleBoardSettingsBody(),
                buttons: getSimpleBoardSettingsButtons(),
                menus: getSimpleBoardSettingsMenus(),
                snackbar: snackbar || ""
            }
        });
        setViewState(viewId, nextState);
    }

    function normalizeGoUrlInput(rawInput) {
        var input = normalizeWhitespace(rawInput);
        if (!input) return "";
        if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input) || input.indexOf("//") === 0 || input.charAt(0) === "/" || input.charAt(0) === "?") {
            return normalizeUrl(input) || ensureAbsoluteUrl(input, SITE.browserHomeUrl) || "";
        }
        if (/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?::\d+)?(?:[/?#]|$)/.test(input)) {
            return normalizeUrl("https://" + input) || "";
        }
        var siteRelative = ensureAbsoluteUrl("/" + input.replace(/^\/+/, ""), SITE.browserHomeUrl) || "";
        if (siteRelative) return normalizeUrl(siteRelative) || siteRelative;
        var resolved = ensureAbsoluteUrl(input, SITE.browserHomeUrl) || "";
        return normalizeUrl(resolved) || resolved;
    }

    function showGoDialog(parentViewId) {
        var context = {
            from: "go_url_dialog",
            parentViewId: parentViewId || 0
        };
        var result = synura.open({
            view: "/dialogs/input",
            styles: {
                title: MENU_GO,
                message: "열 URL을 입력하세요. 전체 URL 또는 /경로를 사용할 수 있습니다.",
                close: true
            },
            models: {
                body: [
                    { type: "string", name: "url", label: "URL", value: "" }
                ],
                buttons: [MENU_GO]
            }
        }, context, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, context);
        }
        return result;
    }

    function handleGoDialogSubmit(viewId, event) {
        var button = event.data ? event.data.button : "";
        if (button !== MENU_GO) {
            synura.close(viewId);
            return;
        }
        var targetUrl = normalizeGoUrlInput(event.data ? event.data.url : "");
        if (!targetUrl) {
            synura.update(viewId, { models: { snackbar: "URL을 입력해 주세요." } });
            return;
        }
        var parentViewId = event.context ? event.context.parentViewId : 0;
        synura.close(viewId);
        var result = openByUrl(targetUrl, false);
        if (result && result.success) {
            return;
        }
        if (handleOpenFailure(result, targetUrl, parentViewId || 0, SITE.displayName)) {
            if (parentViewId) {
                synura.update(parentViewId, { models: { snackbar: "브라우저에서 인증을 완료해 주세요." } });
            }
            return;
        }
        var browserUrl = ensureAbsoluteUrl(targetUrl, SITE.browserHomeUrl) || targetUrl || SITE.browserHomeUrl;
        openBrowser(browserUrl, SITE.displayName, {
            from: "browser_deeplink",
            parentViewId: parentViewId || 0,
            targetUrl: normalizeUrl(browserUrl) || browserUrl
        });
    }

    function showCacheSettingsDialog(parentViewId) {
        var context = {
            from: "cache_settings",
            parentViewId: parentViewId || 0
        };
        var result = synura.open({
            view: "/dialogs/input",
            styles: {
                title: "설정",
                message: "설정을 변경하세요.",
                close: true
            },
            models: {
                body: getCacheSettingsBody(),
                buttons: ["저장", "초기화"]
            }
        }, context, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, context);
        }
        return result;
    }

    function showBoardSettings(parentViewId) {
        var customResult = runSiteShowBoardSettings(parentViewId || 0);
        if (customResult) return customResult;
        if (shouldUseLargeBoardSettings()) {
            return openRoute(createBoardSettingsRootRoute(parentViewId || 0));
        }
        var context = createBoardSettingsState(parentViewId || 0, 0, "열기");
        var result = synura.open({
            view: "/views/settings",
            styles: {
                title: SITE.boardSettingsTitle || MENU_SETTINGS,
                message: "",
                menu: true
            },
            models: {
                body: getSimpleBoardSettingsBody(),
                buttons: getSimpleBoardSettingsButtons(),
                menus: getSimpleBoardSettingsMenus()
            }
        }, context, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, context);
        }
        return result;
    }

    function showBoardSettingsSection(settingsViewId, parentViewId, sectionIndex) {
        var context = createBoardSettingsSectionState(settingsViewId || 0, parentViewId || 0, sectionIndex);
        var result = synura.open({
            view: "/views/settings",
            styles: {
                title: SITE.boardSettingsTitle || MENU_SETTINGS,
                message: getBoardSettingsMessage(context)
            },
            models: {
                body: getBoardSettingsBody(context),
                buttons: getBoardSettingsButtons()
            }
        }, context, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, context);
        }
        return result;
    }

    function showBoardAddDialog(parentViewId, homeViewId) {
        var context = {
            from: "board_add_dialog",
            parentViewId: parentViewId || 0,
            homeViewId: homeViewId || 0
        };
        var result = synura.open({
            view: "/dialogs/input",
            styles: {
                title: "게시판 추가",
                message: getBoardAddDialogMessage(),
                close: true
            },
            models: {
                body: getBoardAddDialogBody(),
                buttons: ["추가"]
            }
        }, context, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, context);
        }
        return result;
    }

    function showBoardDeleteDialog(parentViewId, homeViewId) {
        var customBoards = getCustomBoards();
        if (customBoards.length === 0) {
            synura.update(parentViewId, {
                models: {
                    snackbar: "삭제할 수 있는 게시판이 없습니다."
                }
            });
            return null;
        }
        var body = [];
        for (var i = 0; i < customBoards.length; i++) {
            body.push({
                type: "boolean",
                name: customBoards[i].id,
                label: customBoards[i].title,
                value: true
            });
        }
        var context = {
            from: "board_delete_settings",
            parentViewId: parentViewId || 0,
            homeViewId: homeViewId || 0
        };
        var result = synura.open({
            view: "/views/settings",
            styles: {
                title: "게시판 삭제",
                message: "유지하려면 체크하세요. 체크 해제시 삭제됩니다."
            },
            models: {
                body: body,
                buttons: ["확인", "취소"]
            }
        }, context, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, context);
        }
        return result;
    }

    function createHomeRoute(isReorderable, snackbar) {
        return {
            kind: "home",
            url: normalizeUrl(SITE.browserHomeUrl),
            viewData: {
                view: "/views/list",
                styles: {
                    title: SITE.displayName,
                    layout: "list",
                    menu: true,
                    pagination: false,
                    reorderable: !!isReorderable
                },
                models: buildHomeModels(isReorderable, snackbar)
            },
            context: createHomeContext(isReorderable)
        };
    }

    function isChallengeHtml(html) {
        var body = String(html || "").toLowerCase();
        var markers = SITE.challengeMarkers || [];
        for (var i = 0; i < markers.length; i++) {
            var marker = String(markers[i] || "").toLowerCase();
            if (marker && body.indexOf(marker) >= 0) {
                return true;
            }
        }
        return body.indexOf("ddoscheckonly") >= 0 ||
            body.indexOf("challenge-platform") >= 0 ||
            body.indexOf("hcaptcha") >= 0 ||
            body.indexOf("cf-turnstile") >= 0 ||
            body.indexOf("turnstile") >= 0 ||
            body.indexOf("verify you are human") >= 0 ||
            body.indexOf("checking your browser") >= 0 ||
            body.indexOf("enable javascript and cookies to continue") >= 0 ||
            (body.indexOf("just a moment") >= 0 && body.indexOf("cf_chl_opt") >= 0) ||
            (body.indexOf("window.location.replace") >= 0 && body.indexOf("document.cookie") >= 0);
    }

    function isAuthRequiredResponse(url, status, html) {
        try {
            if (SITE.isAuthRequiredResponse) {
                var custom = SITE.isAuthRequiredResponse(url, status, html);
                if (custom === true || custom === false) {
                    return !!custom;
                }
            }
        } catch (e) {
        }
        return isChallengeHtml(html) || isBrowserAuthRequiredStatus(status);
    }

    function fetchDocument(url) {
        var response = fetchWithLogging(url, buildFetchOptions());
        if (!response) {
            throw new Error("Failed to fetch " + url + " (0)");
        }

        var status = response.status || 0;
        var html = response.text();
        if (shouldUseBrowserCookieAuth() && isAuthRequiredResponse(url, status, html)) {
            throw makeAuthRequiredError(url, status);
        }

        if (!response.ok) {
            throw new Error("Failed to fetch " + url + " (" + status + ")");
        }

        return response.dom("text/html");
    }

    function fetchBoardPage(url) {
        var response = fetchWithLogging(url, buildFetchOptions());
        if (!response) {
            throw new Error("Failed to fetch " + url + " (0)");
        }

        var status = response.status || 0;
        var html = response.text();
        if (shouldUseBrowserCookieAuth() && isAuthRequiredResponse(url, status, html)) {
            throw makeAuthRequiredError(url, status);
        }

        if (!response.ok) {
            throw new Error("Failed to fetch " + url + " (" + status + ")");
        }

        return {
            html: html,
            doc: response.dom("text/html")
        };
    }

    function fetchPostPage(match, url) {
        var response = fetchWithLogging(url, buildPostFetchOptions(match, url));
        if (!response) {
            throw new Error("Failed to fetch " + url + " (0)");
        }

        var status = response.status || 0;
        var html = response.text();
        var authRequired = shouldUseBrowserCookieAuth() &&
            isAuthRequiredResponse(url, status, html);
        var restricted = !response.ok && (status === 401 || status === 403) && !isChallengeHtml(html);
        if (authRequired) {
            throw makeAuthRequiredError(url, status);
        }
        if (!response.ok && !restricted) {
            throw new Error("Failed to fetch " + url + " (" + status + ")");
        }

        return {
            response: response,
            doc: response.dom("text/html"),
            restricted: restricted
        };
    }

    function getPostFetchUrls(match, currentUrl) {
        var urls = [];
        var seen = {};

        function pushUrl(candidate) {
            var normalized = normalizeUrl(candidate) || ensureAbsoluteUrl(candidate, currentUrl) || "";
            if (!normalized || seen[normalized]) return;
            seen[normalized] = true;
            urls.push(normalized);
        }

        try {
            var candidates = SITE.buildPostFetchUrls ? SITE.buildPostFetchUrls(match, currentUrl) : [currentUrl];
            if (Array.isArray(candidates)) {
                for (var i = 0; i < candidates.length; i++) {
                    pushUrl(candidates[i]);
                }
            }
        } catch (e) {
        }
        pushUrl(currentUrl);
        return urls;
    }

    function fetchPostPageWithCandidates(match, currentUrl) {
        var urls = getPostFetchUrls(match, currentUrl);
        var lastError = null;
        for (var i = 0; i < urls.length; i++) {
            try {
                return {
                    url: urls[i],
                    page: fetchPostPage(match, urls[i])
                };
            } catch (e) {
                lastError = e;
            }
        }
        throw lastError || new Error("Failed to fetch " + currentUrl);
    }

    function routeBoardWithMatch(url, urlInfo, match, force) {
        return withSelectorContext(match, url, "board", null, function () {
            try {
                var customBoardRoute = SITE.routeBoardCustom ? SITE.routeBoardCustom(url, urlInfo, match, !!force) : null;
                if (customBoardRoute) {
                    return customBoardRoute;
                }
            } catch (e) {
            }

            var boardPage = fetchBoardPage(url);
            var doc = boardPage.doc;

            return withSelectorContext(match, url, "board", doc, function () {
                var parsedItems = SITE.parseBoardItemsFromHtml
                    ? parseBoardItemsFromHtmlWithProfiles(boardPage.html, url, match, boardPage)
                    : parseBoardItems(doc, url, match, boardPage);
                if ((!parsedItems || !parsedItems.items || parsedItems.items.length === 0) && SITE.parseBoardItemsFromHtml) {
                    parsedItems = parseBoardItems(doc, url, match, boardPage);
                }
                parsedItems = parsedItems || { items: [], profileIndex: 0 };

                return withSelectorProfileIndex(parsedItems.profileIndex || 0, function () {
                    var items = parsedItems.items || [];
                    var title = detectBoardTitle(doc, match.board);
                    var nextUrl = SITE.buildNextPageUrl(match, url, (match.page || 1) + 1);
                    var seenLinks = [];
                    for (var i = 0; i < items.length; i++) {
                        seenLinks.push(items[i].link);
                    }

                    var context = {
                        kind: "board",
                        link: url,
                        boardId: match.board ? match.board.id : "",
                        boardTitle: match.board ? match.board.title : "",
                        boardUrl: match.board ? match.board.url : "",
                        title: title,
                        page: match.page || 1,
                        nextUrl: nextUrl,
                        seenLinks: seenLinks
                    };
                    try {
                        context = SITE.prepareBoardContext ? (SITE.prepareBoardContext(context, items, match, url) || context) : context;
                    } catch (e) {
                    }

                    return {
                        kind: "board",
                        url: url,
                        viewData: {
                            view: "/views/list",
                            styles: buildBoardListStyles(title, match ? match.board : null, nextUrl),
                            models: {
                                contents: items,
                                menus: getBoardMenus(context)
                            }
                        },
                        context: context
                    };
                });
            });
        });
    }

    function routePostWithMatch(url, urlInfo, match, force) {
        return withSelectorContext(match, url, "post", null, function () {
            if (!force) {
                var cached = getCachedRoute("post", url);
                if (cached && cached.route) {
                    cached.route.context = cached.route.context || {};
                    cached.route.context.cachedAt = cached.timestamp || 0;
                    return cached.route;
                }
            }

            try {
                var customPostRoute = SITE.routePostCustom ? SITE.routePostCustom(url, urlInfo, match, !!force) : null;
                if (customPostRoute) {
                    setCachedRoute("post", url, customPostRoute);
                    return customPostRoute;
                }
            } catch (e) {
            }

            var fetched = fetchPostPageWithCandidates(match, url);
            var page = fetched.page;
            var doc = page.doc;

            return withSelectorContext(match, url, "post", doc, function () {
                var profileIndex = choosePostSelectorProfileIndex(doc);
                return withSelectorProfileIndex(profileIndex, function () {
                    var titleNode = firstNode(doc, ["title"]);
                    var contentRoot = firstNode(doc, SITE.selectors.postContent);
                    var content = parseDetails(contentRoot, url);
                    try {
                        if (SITE.filterPostContent) content = SITE.filterPostContent(content, url, doc, page, match) || content;
                    } catch (e) {
                    }
                    var rememberedItem = getRememberedItemPreview(url);
                    var schemaPost = detectSchemaPost(doc);
                    var comments = parseComments(doc, url);
                    try {
                        var fetchedComments = SITE.fetchPostComments ? SITE.fetchPostComments(match, url, doc, page, comments) : null;
                        if (Array.isArray(fetchedComments) && fetchedComments.length > 0) {
                            comments = fetchedComments;
                        }
                    } catch (e) {
                    }
                    if (!content || content.length === 0) {
                        if (schemaPost && schemaPost.articleBody) {
                            content = [{
                                type: "text",
                                value: schemaPost.articleBody
                            }];
                        } else {
                            content = [{
                                type: "text",
                                value: page.restricted ? "로그인이 필요합니다." : "본문을 가져오지 못했습니다."
                            }];
                        }
                    }

                    var route = {
                        kind: "post",
                        url: url,
                            viewData: {
                            view: "/views/post",
                            styles: buildPostStyles(firstNonEmpty([
                                preferLongerText(
                                    cleanPageTitle(firstText(doc, SITE.selectors.postTitle)),
                                    rememberedItem ? cleanPageTitle(rememberedItem.title) : ""
                                ),
                                cleanPageTitle(schemaPost ? schemaPost.headline : ""),
                                cleanPageTitle(textOf(titleNode)),
                                rememberedItem ? cleanPageTitle(rememberedItem.title) : "",
                                match.board ? match.board.title : "",
                                SITE.displayName
                            ]), match.board),
                            models: {
                                author: firstNonEmpty([
                                    cleanSingleLineField(firstAuthorText(doc, SITE.selectors.postAuthor), 80),
                                    schemaPost ? schemaPost.author : "",
                                    rememberedItem ? rememberedItem.author : ""
                                ]),
                                avatar: firstNonEmpty([
                                    imageUrlFromNode(firstNode(doc, SITE.selectors.postAvatar || SITE.selectors.postAuthor), url),
                                    rememberedItem ? rememberedItem.avatar : ""
                                ]),
                                date: firstNonEmpty([
                                    cleanSingleLineField(firstText(doc, SITE.selectors.postDate), 40),
                                    schemaPost ? schemaPost.datePublished : "",
                                    rememberedItem ? rememberedItem.date : ""
                                ]),
                                category: firstNonEmpty([
                                    cleanSingleLineField(firstText(doc, SITE.selectors.postCategory), 60),
                                    rememberedItem ? rememberedItem.category : ""
                                ]),
                                viewCount: firstNonEmpty([
                                    parseCount(firstText(doc, SITE.selectors.postViewCount)),
                                    rememberedItem ? rememberedItem.viewCount : ""
                                ]),
                                likeCount: hideZeroCount(firstNonEmpty([
                                    parseCount(firstText(doc, SITE.selectors.postLikeCount)),
                                    rememberedItem ? rememberedItem.likeCount : ""
                                ])),
                                content: content,
                                comments: comments,
                                link: url,
                                menus: getPostMenus(match),
                                buttons: [BUTTON_REFRESH]
                            }
                        },
                        context: (function () {
                            var context = {
                            kind: "post",
                            link: url,
                            boardId: match.board ? match.board.id : "",
                            boardTitle: match.board ? match.board.title : "",
                            boardUrl: match.board ? match.board.url : ""
                            };
                            try {
                                context = SITE.preparePostContext ? (SITE.preparePostContext(context, match, url, doc, page) || context) : context;
                            } catch (e) {
                            }
                            return context;
                        })()
                    };
                    setCachedRoute("post", url, route);
                    return route;
                });
            });
        });
    }

    function createPendingBoardRoute(url, match) {
        var board = match && match.board ? match.board : null;
        var title = firstNonEmpty([
            board ? board.title : "",
            SITE.displayName
        ]);
        var nextUrl = "";
        try {
            nextUrl = SITE.buildNextPageUrl ? (SITE.buildNextPageUrl(match, url, ((match && match.page) || 1) + 1) || "") : "";
        } catch (e) {
        }
        var context = {
            kind: "board",
            link: url,
            boardId: board ? board.id : "",
            boardTitle: board ? board.title : "",
            boardUrl: board ? board.url : "",
            title: title,
            page: match && match.page ? match.page : 1,
            nextUrl: nextUrl,
            seenLinks: []
        };
        try {
            context = SITE.prepareBoardContext ? (SITE.prepareBoardContext(context, [], match, url) || context) : context;
        } catch (e) {
        }
        return {
            kind: "board",
            url: url,
            viewData: {
            view: "/views/list",
            styles: buildBoardListStyles(title, board, nextUrl),
            models: {
                contents: [],
                menus: getBoardMenus(context)
            }
            },
            context: context
        };
    }

    function createPendingPostRoute(url, match) {
        var rememberedItem = getRememberedItemPreview(url);
        var context = {
            kind: "post",
            link: url,
            boardId: match && match.board ? match.board.id : "",
            boardTitle: match && match.board ? match.board.title : "",
            boardUrl: match && match.board ? match.board.url : ""
        };
        try {
            context = SITE.preparePostContext ? (SITE.preparePostContext(context, match, url, null, null) || context) : context;
        } catch (e) {
        }
        return {
            kind: "post",
            url: url,
            viewData: {
                view: "/views/post",
                styles: buildPostStyles(firstNonEmpty([
                    rememberedItem ? cleanPageTitle(rememberedItem.title) : "",
                    match && match.board ? match.board.title : "",
                    SITE.displayName
                ]), match && match.board ? match.board : null),
                models: {
                    author: "",
                    avatar: "",
                    date: "",
                    category: "",
                    viewCount: "",
                    likeCount: "",
                    content: [],
                    comments: [],
                    link: url,
                    menus: getPostMenus(match),
                    buttons: [BUTTON_REFRESH]
                }
            },
            context: context
        };
    }

    function openLoadingRoute(pendingRoute, loadRoute, targetUrl, title) {
        var opened = openRoute(pendingRoute);
        if (!opened || !opened.success) return opened;

        try {
            var route = loadRoute ? loadRoute() : null;
            if (route) {
                updateViewFromRoute(opened.viewId, route);
            } else {
                synura.update(opened.viewId, {
                    models: {
                        snackbar: "경로를 불러오지 못했습니다."
                    }
                });
            }
        } catch (e) {
            var result = {
                success: false,
                error: e.toString()
            };
            if (handleOpenFailure(result, targetUrl, opened.viewId, title || SITE.displayName)) {
                synura.update(opened.viewId, { models: { snackbar: "브라우저에서 인증을 완료해 주세요." } });
            } else {
                synura.update(opened.viewId, { models: { snackbar: e.toString() } });
            }
        }

        return opened;
    }

    function routeUrl(rawUrl, force) {
        var normalized = normalizeUrl(rawUrl);
        if (!normalized) return null;
        var info = parseAbsoluteUrl(normalized);
        if (!info || !isKnownHost(info.host)) return null;

        var syntheticCategory = normalizeWhitespace(queryValue(info.query, CATEGORY_ROUTE_QUERY_KEY));
        if (syntheticCategory) {
            if (syntheticCategory === "home") return createCategoryHomeRoute(0);
            return createCategoryGroupRoute(syntheticCategory, 0);
        }

        var customRoute = SITE.routeCustom ? SITE.routeCustom(normalized, info, !!force) : null;
        if (customRoute) return customRoute;

        var postMatch = SITE.matchPost(info);
        if (postMatch) return routePostWithMatch(normalized, info, postMatch, !!force);

        var boardMatch = SITE.matchBoard(info);
        if (boardMatch) return routeBoardWithMatch(normalized, info, boardMatch, !!force);

        var homeUrl = normalizeUrl(SITE.browserHomeUrl);
        if (normalized === homeUrl) return createHomeRoute(false);
        return null;
    }

    function resolveBoardFromInput(fields) {
        var mode = getBoardAddMode();
        if (mode === "id_title") {
            var boardId = normalizeWhitespace(fields && fields.id);
            var boardTitle = normalizeWhitespace(firstNonEmpty([
                fields ? fields.title : "",
                fields ? fields.name : ""
            ]));
            if (!boardId || !boardTitle) {
                return {
                    ok: false,
                    error: "게시판 ID와 이름을 모두 입력해 주세요."
                };
            }
            var boardUrl = "";
            try {
                boardUrl = normalizeUrl(SITE.buildBoardUrlFromId ? SITE.buildBoardUrlFromId(boardId) : "") || "";
            } catch (e) {
            }
            if (!boardUrl) {
                return {
                    ok: false,
                    error: "게시판 URL을 생성할 수 없습니다."
                };
            }
            var builtBoard = normalizeBoardRecord({
                id: boardId,
                title: boardTitle,
                url: boardUrl,
                description: boardUrl,
                custom: true
            }, { custom: true });
            if (!builtBoard) {
                return {
                    ok: false,
                    error: "게시판 정보를 저장할 수 없습니다."
                };
            }
            return {
                ok: true,
                board: builtBoard
            };
        }

        var rawUrl = fields ? fields.url : "";
        var titleInput = fields ? fields.title : "";
        var normalized = normalizeUrl(rawUrl);
        if (!normalized) {
            return {
                ok: false,
                error: "게시판 URL을 입력해 주세요."
            };
        }

        var info = parseAbsoluteUrl(normalized);
        if (!info || !isKnownHost(info.host)) {
            return {
                ok: false,
                error: "이 확장에서 지원하는 사이트 URL이 아닙니다."
            };
        }

        var match = SITE.matchBoard(info);
        var board = match && match.board ? match.board : null;
        if (!board) {
            var postMatch = SITE.matchPost(info);
            board = postMatch && postMatch.board ? postMatch.board : null;
        }
        if (!board || !board.id) {
            return {
                ok: false,
                error: "게시판 URL을 인식하지 못했습니다."
            };
        }

        var normalizedBoard = normalizeBoardRecord({
            id: board.id,
            title: firstNonEmpty([titleInput, board.title, board.id]),
            url: board.url || normalized,
            description: normalizeUrl(board.url || normalized) || normalized,
            custom: true
        }, { custom: true });
        if (!normalizedBoard) {
            return {
                ok: false,
                error: "게시판 정보를 저장할 수 없습니다."
            };
        }

        return {
            ok: true,
            board: normalizedBoard
        };
    }

    function addCustomBoard(fields) {
        var resolved = resolveBoardFromInput(fields);
        if (!resolved.ok) return resolved;

        var board = resolved.board;
        var allBoards = getAllBoards();
        for (var i = 0; i < allBoards.length; i++) {
            if (allBoards[i].id !== board.id) continue;

            var visibleMap = getAllBoardsVisibility();
            if (isBoardVisible(board.id, visibleMap)) {
                return {
                    ok: false,
                    error: "이미 존재하는 게시판입니다."
                };
            }

            visibleMap[board.id] = true;
            saveVisibleMap(visibleMap);
            if (shouldAppendEnabledBoardToHomeOrder(board.id)) moveBoardOrderToEnd(board.id);
            homeBoards = getVisibleBoards();
            rebuildBoardIndex();
            return {
                ok: true,
                board: allBoards[i],
                activated: true
            };
        }

        var customBoards = getCustomBoards();
        customBoards.push(board);
        saveCustomBoards(customBoards);

        var nextVisibleMap = getAllBoardsVisibility();
        nextVisibleMap[board.id] = true;
        saveVisibleMap(nextVisibleMap);
        if (shouldAppendEnabledBoardToHomeOrder(board.id)) moveBoardOrderToEnd(board.id);
        homeBoards = getVisibleBoards();
        rebuildBoardIndex();

        return {
            ok: true,
            board: board,
            activated: false
        };
    }

    function pruneBoardState(boardId) {
        var id = normalizeWhitespace(boardId);
        if (!id) return;

        var visibleMap = getVisibleMapRaw();
        if (Object.prototype.hasOwnProperty.call(visibleMap, id)) {
            delete visibleMap[id];
            saveVisibleMap(visibleMap);
        }

        removeOrderEntry(id);
    }

    function setBoardVisible(boardId, visible) {
        var id = normalizeWhitespace(boardId);
        if (!id) return null;
        var allBoards = getAllBoards();
        var board = null;
        for (var i = 0; i < allBoards.length; i++) {
            if (allBoards[i].id === id) {
                board = allBoards[i];
                break;
            }
        }
        if (!board) return null;

        var visibleMap = getAllBoardsVisibility();
        visibleMap[id] = !!visible;
        saveVisibleMap(visibleMap);
        if (visible && shouldAppendEnabledBoardToHomeOrder(id)) moveBoardOrderToEnd(id);
        homeBoards = getVisibleBoards();
        rebuildBoardIndex();
        return board;
    }

    function splitBoardGroupPath(groupPath) {
        var text = normalizeWhitespace(groupPath);
        if (!text) return [];
        var parts = text.split("/");
        var out = [];
        for (var i = 0; i < parts.length; i++) {
            var part = cleanBoardGroupText(parts[i]);
            if (part) out.push(part);
        }
        return out;
    }

    function createCategoryTreeNode(path, title) {
        return {
            key: path || "root",
            path: path || "",
            title: title || "카테고리",
            groups: [],
            groupMap: {},
            boards: []
        };
    }

    function buildCategoryTree() {
        var root = createCategoryTreeNode("", "카테고리");
        var index = { "": root };
        var boards = getBoardSettingsBoards();

        for (var i = 0; i < boards.length; i++) {
            var board = boards[i];
            var parts = splitBoardGroupPath(getBoardGroupPath(board));
            if (parts.length === 0) {
                root.boards.push(board);
                continue;
            }

            var current = root;
            var currentParts = [];
            for (var j = 0; j < parts.length; j++) {
                currentParts.push(parts[j]);
                var path = currentParts.join("/");
                var child = current.groupMap[path];
                if (!child) {
                    child = createCategoryTreeNode(path, parts[j]);
                    current.groupMap[path] = child;
                    current.groups.push(child);
                    index[path] = child;
                }
                current = child;
            }
            current.boards.push(board);
        }

        return {
            root: root,
            index: index
        };
    }

    function getCategoryNode(path, tree) {
        var currentTree = tree || buildCategoryTree();
        var normalizedPath = normalizeWhitespace(path);
        if (!normalizedPath) return currentTree.root;
        return currentTree.index[normalizedPath] || null;
    }

    function collectCategoryNodeBoards(node, out) {
        var items = out || [];
        if (!node) return items;
        for (var i = 0; i < node.boards.length; i++) {
            items.push(node.boards[i]);
        }
        for (var j = 0; j < node.groups.length; j++) {
            collectCategoryNodeBoards(node.groups[j], items);
        }
        return items;
    }

    function getCategoryNodeBoards(path, tree) {
        return collectCategoryNodeBoards(getCategoryNode(path, tree), []);
    }

    function getCategoryNodeVisibility(path, tree) {
        var boards = getCategoryNodeBoards(path, tree);
        var visibleMap = getAllBoardsVisibility();
        var visibleCount = 0;
        for (var i = 0; i < boards.length; i++) {
            if (isBoardVisible(boards[i].id, visibleMap)) {
                visibleCount += 1;
            }
        }
        return {
            boards: boards,
            totalCount: boards.length,
            visibleCount: visibleCount,
            allVisible: boards.length > 0 && visibleCount === boards.length
        };
    }

    function buildCategoryRouteUrl(path) {
        var homeUrl = normalizeUrl(SITE.browserHomeUrl);
        if (!homeUrl) return "";
        return setQueryParam(homeUrl, CATEGORY_ROUTE_QUERY_KEY, normalizeWhitespace(path) || "home");
    }

    function hasHomeGroupShortcut(path) {
        var normalized = normalizeWhitespace(path);
        if (!normalized) return false;
        var paths = getHomeGroupPaths();
        for (var i = 0; i < paths.length; i++) {
            if (paths[i] === normalized) return true;
        }
        return false;
    }

    function setHomeGroupShortcut(path, enabled) {
        var normalized = normalizeWhitespace(path);
        if (!normalized) {
            return {
                ok: false,
                path: "",
                enabled: false
            };
        }

        var node = getCategoryNode(normalized);
        if (!node || !node.path) {
            return {
                ok: false,
                path: normalized,
                enabled: false
            };
        }

        var paths = getHomeGroupPaths();
        var nextPaths = [];
        var exists = false;
        for (var i = 0; i < paths.length; i++) {
            if (paths[i] === normalized) {
                exists = true;
                if (!enabled) continue;
            }
            nextPaths.push(paths[i]);
        }
        if (enabled && !exists) {
            nextPaths.push(normalized);
        }
        saveHomeGroupPaths(nextPaths);
        if (enabled) {
            moveOrderEntryToEnd(homeGroupOrderId(normalized));
        } else {
            removeOrderEntry(homeGroupOrderId(normalized));
        }
        return {
            ok: true,
            path: normalized,
            enabled: !!enabled,
            title: node.title || normalized
        };
    }

    function buildHomeGroupShortcutEntry(path, tree) {
        var node = getCategoryNode(path, tree);
        if (!node || !node.path) return null;
        var visibility = getCategoryNodeVisibility(node.path, tree);
        var parts = splitBoardGroupPath(node.path);
        var parentPath = parts.length > 1 ? parts.slice(0, parts.length - 1).join("/") : "";
        return {
            kind: "group",
            path: node.path,
            title: node.title,
            parentPath: parentPath,
            description: buildCategoryNodePreview(visibility.boards),
            totalCount: visibility.totalCount,
            visibleCount: visibility.visibleCount,
            allVisible: visibility.allVisible
        };
    }

    function getHomeGroupShortcutEntries() {
        var tree = buildCategoryTree();
        var paths = getHomeGroupPaths();
        var entries = [];
        var validPaths = [];
        for (var i = 0; i < paths.length; i++) {
            var entry = buildHomeGroupShortcutEntry(paths[i], tree);
            if (!entry) continue;
            entries.push(entry);
            validPaths.push(entry.path);
        }
        if (validPaths.length !== paths.length) {
            saveHomeGroupPaths(validPaths);
            for (var j = 0; j < paths.length; j++) {
                if (validPaths.indexOf(paths[j]) >= 0) continue;
                removeOrderEntry(homeGroupOrderId(paths[j]));
            }
        }
        return entries;
    }

    function getHomeEntries() {
        var visibleBoards = getVisibleBoards();
        var groupEntries = getHomeGroupShortcutEntries();
        var displayed = {};
        var ordered = [];
        var visibleBoardSet = {};
        var visibleGroupSet = {};

        for (var i = 0; i < visibleBoards.length; i++) {
            var boardEntry = {
                kind: "board",
                id: visibleBoards[i].id,
                orderId: visibleBoards[i].id,
                board: visibleBoards[i]
            };
            displayed[boardEntry.orderId] = boardEntry;
            visibleBoardSet[boardEntry.orderId] = true;
        }
        for (var j = 0; j < groupEntries.length; j++) {
            groupEntries[j].orderId = homeGroupOrderId(groupEntries[j].path);
            displayed[groupEntries[j].orderId] = groupEntries[j];
            visibleGroupSet[groupEntries[j].orderId] = true;
        }

        var order = getBoardOrder();
        var used = {};
        for (var k = 0; k < order.length; k++) {
            var orderId = normalizeWhitespace(order[k]);
            if (!orderId || !displayed[orderId] || used[orderId]) continue;
            used[orderId] = true;
            ordered.push(displayed[orderId]);
        }
        for (var m = 0; m < visibleBoards.length; m++) {
            var boardId = visibleBoards[m].id;
            if (used[boardId]) continue;
            used[boardId] = true;
            ordered.push(displayed[boardId]);
        }
        for (var n = 0; n < groupEntries.length; n++) {
            var groupOrderId = groupEntries[n].orderId;
            if (used[groupOrderId]) continue;
            used[groupOrderId] = true;
            ordered.push(groupEntries[n]);
        }
        return ordered;
    }

    function buildCategoryNodePreview(boards) {
        var titles = [];
        for (var i = 0; i < (boards || []).length && titles.length < 3; i++) {
            var title = normalizeWhitespace(boards[i] ? boards[i].title : "");
            if (!title) continue;
            titles.push(title);
        }
        var text = titles.join(", ");
        if ((boards || []).length > titles.length) {
            text += (text ? " " : "") + "외 " + ((boards || []).length - titles.length) + "개";
        }
        return text || "게시판이 없습니다.";
    }

    function makeCategoryGroupItemId(path) {
        return "group:" + normalizeWhitespace(path);
    }

    function isCategoryGroupItemId(itemId) {
        return normalizeWhitespace(itemId).indexOf("group:") === 0;
    }

    function categoryGroupPathFromItemId(itemId) {
        var value = normalizeWhitespace(itemId);
        return value.indexOf("group:") === 0 ? value.substring(6) : "";
    }

    function buildCategoryGroupItem(node, tree) {
        var visibility = getCategoryNodeVisibility(node.path, tree);
        var pinned = hasHomeGroupShortcut(node.path);
        return {
            id: makeCategoryGroupItemId(node.path),
            title: node.title,
            description: buildCategoryNodePreview(visibility.boards),
            category: visibility.visibleCount + "/" + visibility.totalCount + " 표시",
            author: node.groups.length > 0
                ? ("하위 그룹 " + node.groups.length + "개")
                : (visibility.totalCount + "개 게시판"),
            date: "",
            commentCount: "",
            viewCount: "",
            likeCount: "",
            types: ["link"],
            menus: [pinned ? MENU_HOME_REMOVE : MENU_HOME_TOGGLE],
            hotCount: visibility.visibleCount,
            coldCount: Math.max(0, visibility.totalCount - visibility.visibleCount)
        };
    }

    function shouldForceFlattenCategoryGroup(node) {
        if (!node || !node.path || !Array.isArray(SITE.flattenCategoryGroupPaths)) return false;
        var normalizedPath = normalizeWhitespace(node.path);
        for (var i = 0; i < SITE.flattenCategoryGroupPaths.length; i++) {
            if (normalizeWhitespace(SITE.flattenCategoryGroupPaths[i]) === normalizedPath) {
                return true;
            }
        }
        return false;
    }

    function shouldOmitFlattenedCategoryGroupPrefix(node) {
        if (!node || !node.path || !Array.isArray(SITE.flattenCategoryGroupPathsWithoutPrefix)) return false;
        var normalizedPath = normalizeWhitespace(node.path);
        for (var i = 0; i < SITE.flattenCategoryGroupPathsWithoutPrefix.length; i++) {
            if (normalizeWhitespace(SITE.flattenCategoryGroupPathsWithoutPrefix[i]) === normalizedPath) {
                return true;
            }
        }
        return false;
    }

    function buildCategoryFlattenedBoardTitle(node, board) {
        if (shouldOmitFlattenedCategoryGroupPrefix(node)) {
            return normalizeWhitespace(board ? board.title : "");
        }
        var prefixParts = splitBoardGroupPath(node ? node.path : "");
        var boardParts = splitBoardGroupPath(getBoardGroupPath(board));
        var relativeParts = boardParts.slice(prefixParts.length);
        var prefix = prefixParts.concat(relativeParts).join("/");
        var title = normalizeWhitespace(board ? board.title : "");
        if (!prefix) return title;
        if (!title) return prefix;
        return prefix === title ? prefix : (prefix + "/" + title);
    }

    function shouldFlattenCategoryGroup(node) {
        if (!node || !node.path) return false;
        if (shouldForceFlattenCategoryGroup(node)) return true;
        return node.groups.length === 0 && node.boards.length > 0 && node.boards.length < 5;
    }

    function buildCategoryBoardItem(board, visibleMap, titleOverride) {
        var isVisible = isBoardVisible(board.id, visibleMap);
        var categoryPath = getBoardGroupPath(board);
        return {
            id: board.id,
            link: board.url,
            title: normalizeWhitespace(titleOverride || board.title),
            description: board.description || board.url.replace(/^https?:\/\//, ""),
            category: categoryPath,
            author: "",
            date: "",
            commentCount: "",
            viewCount: "",
            likeCount: "",
            types: ["link"],
            menus: [isVisible ? MENU_HOME_REMOVE : MENU_HOME_TOGGLE],
            hotCount: isVisible ? 1 : 0,
            coldCount: isVisible ? 0 : 1
        };
    }

    function buildCategoryNodeItems(node, tree) {
        var items = [];
        var visibleMap = getAllBoardsVisibility();
        for (var i = 0; i < node.groups.length; i++) {
            var child = node.groups[i];
            if (shouldFlattenCategoryGroup(child)) {
                var flattenedBoards = collectCategoryNodeBoards(child, []);
                for (var j = 0; j < flattenedBoards.length; j++) {
                    items.push(buildCategoryBoardItem(
                        flattenedBoards[j],
                        visibleMap,
                        buildCategoryFlattenedBoardTitle(child, flattenedBoards[j])
                    ));
                }
                continue;
            }
            items.push(buildCategoryGroupItem(child, tree));
        }
        for (var k = 0; k < node.boards.length; k++) {
            items.push(buildCategoryBoardItem(node.boards[k], visibleMap));
        }
        return items;
    }

    function buildCategoryRouteMenus(node, tree) {
        var menus = [MENU_BROWSER];
        if (node && node.path) {
            menus.unshift({
                label: MENU_HOME_TOGGLE,
                checked: hasHomeGroupShortcut(node.path)
            });
        }
        return menus;
    }

    function resolveCategoryHomeViewId(homeViewId) {
        var preferred = parseInt(String(homeViewId || 0), 10);
        if (preferred > 0) {
            var state = getViewState(preferred);
            if (state && state.kind === "home") {
                return preferred;
            }
        }
        return findViewIdByKind("home");
    }

    function createCategoryRoute(path, homeViewId) {
        var tree = buildCategoryTree();
        var node = getCategoryNode(path, tree);
        if (!node) node = tree.root;
        var routeLink = buildCategoryRouteUrl(node.path || "home") || normalizeUrl(SITE.browserHomeUrl);

        var visibility = getCategoryNodeVisibility(node.path, tree);
        var title = node.path ? node.title : MENU_ALL_BOARDS;
        var message = node.path
            ? (node.path + " · " + visibility.totalCount + "개 게시판")
            : ("그룹 " + node.groups.length + "개 · 게시판 " + visibility.totalCount + "개");

        return {
            kind: node.path ? "category_group" : "category_home",
            url: routeLink,
            viewData: {
                view: "/views/list",
                styles: {
                    title: title,
                    message: message,
                    layout: "list",
                    menu: true,
                    pagination: false
                },
                models: {
                    contents: buildCategoryNodeItems(node, tree),
                    menus: buildCategoryRouteMenus(node, tree)
                }
            },
            context: {
                kind: node.path ? "category_group" : "category_home",
                link: routeLink,
                browserUrl: normalizeUrl(SITE.browserHomeUrl),
                title: title,
                categoryPath: node.path || "",
                homeViewId: resolveCategoryHomeViewId(homeViewId)
            }
        };
    }

    function createCategoryHomeRoute(homeViewId) {
        return createCategoryRoute("", homeViewId);
    }

    function createCategoryGroupRoute(path, homeViewId) {
        return createCategoryRoute(path, homeViewId);
    }

    function createCategoryRouteFromState(state) {
        if (state && state.kind === "category_group") {
            return createCategoryGroupRoute(state.categoryPath || "", state.homeViewId || 0);
        }
        return createCategoryHomeRoute(state ? state.homeViewId : 0);
    }

    function refreshCategoryView(viewId, state, snackbar) {
        updateViewFromRoute(viewId, createCategoryRouteFromState(state), snackbar || "");
    }

    function openCategoryHomeFromMenu(viewId, state) {
        try {
            if (SITE.openCategoryHomeFromMenu && SITE.openCategoryHomeFromMenu(viewId || 0, state || null)) {
                return;
            }
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
            return;
        }
        var homeViewId = state && state.kind === "home" ? viewId : 0;
        if (shouldPromptBoardCatalogSync()) {
            showCategoryBoardSyncPrompt(viewId || 0, homeViewId);
            return;
        }
        openRoute(createCategoryHomeRoute(homeViewId));
    }

    function toggleCategoryHomeShortcut(path) {
        var enabled = !hasHomeGroupShortcut(path);
        var result = setHomeGroupShortcut(path, enabled);
        return {
            enabled: !!result.enabled,
            totalCount: getCategoryNodeVisibility(path).totalCount,
            label: result.title || normalizeWhitespace(path).split("/").pop() || MENU_ALL_BOARDS
        };
    }

    function removeCustomBoard(boardId) {
        var id = normalizeWhitespace(boardId);
        if (!id) return false;
        var customBoards = getCustomBoards();
        var filtered = [];
        for (var i = 0; i < customBoards.length; i++) {
            if (customBoards[i].id !== id) {
                filtered.push(customBoards[i]);
            }
        }
        if (filtered.length === customBoards.length) return false;
        saveCustomBoards(filtered);
        pruneBoardState(id);
        return true;
    }

    function openBrowser(url, title, extraState) {
        var browserUrl = normalizeUrl(url) || ensureAbsoluteUrl(url, SITE.browserHomeUrl) || SITE.browserHomeUrl;
        var context = extraState || {};
        context.kind = context.kind || "browser";
        context.link = browserUrl;
        context.title = context.title || title || SITE.displayName;

        var result = synura.open({
            view: "/views/browser",
            styles: {
                title: title || SITE.displayName
            },
            models: {
                url: browserUrl
            }
        }, context, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, context);
        }
        return result;
    }

    function openBrowserForAuth(url, parentViewId, title) {
        return openBrowser(url, title || SITE.displayName, {
            from: "browser_auth",
            targetUrl: normalizeUrl(url) || ensureAbsoluteUrl(url, SITE.browserHomeUrl) || SITE.browserHomeUrl,
            parentViewId: parentViewId || 0
        });
    }

    function isAuthRequiredResult(result) {
        return !!parseAuthRequiredError(result && result.error);
    }

    function handleOpenFailure(result, targetUrl, parentViewId, title) {
        var auth = parseAuthRequiredError(result && result.error);
        if (auth && shouldUseBrowserCookieAuth()) {
            openBrowserForAuth(auth.url || targetUrl, parentViewId, title || SITE.displayName);
            return true;
        }
        return false;
    }

    function shouldOpenRouteWithHistory(route) {
        return !!(
            route &&
            route.kind === "board" &&
            route.viewData &&
            route.viewData.view === "/views/list"
        );
    }

    function openRoute(route) {
        var viewData = route.viewData || {};
        viewData.styles = viewData.styles || {};
        if (shouldOpenRouteWithHistory(route)) {
            viewData.styles.history = true;
        }
        var result = synura.open(viewData, route.context, function (event) {
            handler.onViewEvent(event);
        });
        if (result && result.success) {
            setViewState(result.viewId, route.context);
            if (route.context && route.context.cachedAt) {
                showCacheSnackbar(result.viewId, route.context.cachedAt);
            }
        }
        return result;
    }

    function openByUrl(url, force) {
        try {
            var normalized = normalizeUrl(url);
            if (!normalized) {
                return {
                    success: false,
                    error: "Unsupported URL"
                };
            }
            var info = parseAbsoluteUrl(normalized);
            if (!info || !isKnownHost(info.host)) {
                return {
                    success: false,
                    error: "Unsupported URL"
                };
            }

            var syntheticCategory = normalizeWhitespace(queryValue(info.query, CATEGORY_ROUTE_QUERY_KEY));
            if (syntheticCategory) {
                return openRoute(syntheticCategory === "home"
                    ? createCategoryHomeRoute(0)
                    : createCategoryGroupRoute(syntheticCategory, 0));
            }

            var customRoute = SITE.routeCustom ? SITE.routeCustom(normalized, info, !!force) : null;
            if (customRoute) {
                return openRoute(customRoute);
            }

            var postMatch = SITE.matchPost(info);
            if (postMatch) {
                return openLoadingRoute(
                    createPendingPostRoute(normalized, postMatch),
                    function () {
                        return routePostWithMatch(normalized, info, postMatch, !!force);
                    },
                    normalized,
                    SITE.displayName
                );
            }

            var boardMatch = SITE.matchBoard(info);
            if (boardMatch) {
                return openLoadingRoute(
                    createPendingBoardRoute(normalized, boardMatch),
                    function () {
                        return routeBoardWithMatch(normalized, info, boardMatch, !!force);
                    },
                    normalized,
                    boardMatch && boardMatch.board ? boardMatch.board.title : SITE.displayName
                );
            }

            var homeUrl = normalizeUrl(SITE.browserHomeUrl);
            if (normalized === homeUrl) {
                return openRoute(createHomeRoute(false));
            }

            return {
                success: false,
                error: "Unsupported URL"
            };
        } catch (e) {
            return {
                success: false,
                error: e.toString()
            };
        }
    }

    function updateViewFromRoute(viewId, route, snackbar) {
        var styles = route.viewData.styles || {};
        if (shouldOpenRouteWithHistory(route)) {
            styles.history = true;
        }
        var models = route.viewData.models || {};
        if (snackbar) models.snackbar = snackbar;
        synura.update(viewId, {
            styles: styles,
            models: models
        });
        setViewState(viewId, route.context);
        if (route.context && route.context.cachedAt) {
            showCacheSnackbar(viewId, route.context.cachedAt);
        }
    }

    function refreshCurrentView(viewId) {
        var state = getViewState(viewId);
        try {
            if (SITE.refreshView && SITE.refreshView(viewId, state || null)) {
                return;
            }
            if (!state || !state.kind || state.kind === "home") {
                updateViewFromRoute(viewId, createHomeRoute(!!(state && state.isReorderable), "새로고침 완료"));
                return;
            }
            if (state.kind === "category_home" || state.kind === "category_group") {
                updateViewFromRoute(viewId, createCategoryRouteFromState(state), "새로고침 완료");
                return;
            }
            var route = routeUrl(state.link, true);
            if (!route) {
                synura.update(viewId, { models: { snackbar: "새로고침할 경로를 찾을 수 없습니다." } });
                return;
            }
            updateViewFromRoute(viewId, route, "새로고침 완료");
        } catch (e) {
            var result = {
                success: false,
                error: e.toString()
            };
            if (handleOpenFailure(result, (state && state.link) || SITE.browserHomeUrl, viewId, (state && state.title) || SITE.displayName)) {
                synura.update(viewId, { models: { snackbar: "브라우저에서 인증을 완료해 주세요." } });
                return;
            }
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
    }

    function appendNextPage(viewId) {
        var state = getViewState(viewId);
        if (!state || state.kind !== "board") return;
        if (!state.nextUrl) {
            synura.update(viewId, { models: { snackbar: "더 불러올 글이 없습니다." } });
            return;
        }

        try {
            var seen = {};
            var prior = state.seenLinks || [];
            for (var i = 0; i < prior.length; i++) {
                seen[prior[i]] = true;
            }

            var appendItems = [];
            var maxEmptyAppendFetches = parseInt(String(SITE.maxEmptyAppendFetches || 5), 10);
            if (!(maxEmptyAppendFetches > 0)) maxEmptyAppendFetches = 5;
            var fetchCount = 0;

            while (state.nextUrl && appendItems.length === 0 && fetchCount < maxEmptyAppendFetches) {
                var route = routeUrl(state.nextUrl, false);
                if (!route || !route.context) {
                    synura.update(viewId, { models: { snackbar: "다음 페이지를 불러오지 못했습니다." } });
                    return;
                }

                var rawItems = listFromDetails(((route.viewData || {}).models || {}).contents);
                var pageAppendItems = [];
                for (var j = 0; j < rawItems.length; j++) {
                    var item = rawItems[j];
                    if (!item || !item.link || seen[item.link]) continue;
                    seen[item.link] = true;
                    pageAppendItems.push(item);
                }

                try {
                    pageAppendItems = SITE.filterAppendItems ? (SITE.filterAppendItems(pageAppendItems, state, route.context) || []) : pageAppendItems;
                } catch (e) {
                }

                state.page = route.context.page || state.page;
                state.nextUrl = route.context.nextUrl || "";
                state.seenLinks = [];
                for (var key in seen) {
                    if (Object.prototype.hasOwnProperty.call(seen, key)) {
                        state.seenLinks.push(key);
                    }
                }
                try {
                    state = SITE.updateAppendState ? (SITE.updateAppendState(state, pageAppendItems, route.context) || state) : state;
                } catch (e) {
                }
                setViewState(viewId, state);

                appendItems = pageAppendItems;
                fetchCount += 1;
            }

            if (appendItems.length === 0) {
                synura.update(viewId, {
                    styles: { pagination: !!state.nextUrl },
                    models: { snackbar: state.nextUrl ? "중복 글을 건너뛰었습니다." : "더 불러올 글이 없습니다." }
                });
                return;
            }

            synura.update(viewId, {
                styles: {
                    pagination: !!state.nextUrl
                },
                models: {
                    append: appendItems
                }
            });
        } catch (e) {
            var result = {
                success: false,
                error: e.toString()
            };
            var authTarget = (state && state.nextUrl) || (state && state.link) || SITE.browserHomeUrl;
            if (handleOpenFailure(result, authTarget, viewId, (state && state.title) || SITE.displayName)) {
                synura.update(viewId, { models: { snackbar: "브라우저에서 인증을 완료해 주세요." } });
                return;
            }
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
    }

    function refreshAnyHomeView(preferredViewId, snackbar) {
        var homeViewId = resolveCategoryHomeViewId(preferredViewId || 0);
        if (!homeViewId) return;
        updateHomeAfterBoardMutation(homeViewId, snackbar || "");
    }

    function refreshBoardViewPreferenceState(viewId, state) {
        var board = resolveMenuBoard(state);
        if (!board) {
            synura.update(viewId, { models: { snackbar: "게시판을 찾지 못했습니다." } });
            return;
        }
        synura.update(viewId, {
            styles: buildBoardListStyles((state && state.title) || board.title || SITE.displayName, board, state && state.nextUrl),
            models: {
                menus: getBoardMenus(state),
                snackbar: ""
            }
        });
    }

    function handleBoardMediaToggleMenu(viewId, state) {
        var board = resolveMenuBoard(state);
        if (!board) {
            synura.update(viewId, { models: { snackbar: "게시판을 찾지 못했습니다." } });
            return true;
        }
        var nextEnabled = !boardShowsMedia(board);
        setBoardViewSetting(board.id, "show_media", nextEnabled);
        if (nextEnabled) {
            synura.update(viewId, {
                styles: {
                    media: true
                },
                models: {
                    menus: getBoardMenus(state),
                    snackbar: ""
                }
            });
        } else {
            synura.update(viewId, {
                styles: {
                    media: false
                },
                models: {
                    menus: getBoardMenus(state),
                    snackbar: ""
                }
            });
        }
        return true;
    }

    function handleBoardGalleryModeToggleMenu(viewId, state) {
        var board = resolveMenuBoard(state);
        if (!board) {
            synura.update(viewId, { models: { snackbar: "게시판을 찾지 못했습니다." } });
            return true;
        }
        var nextEnabled = !boardUsesGalleryMode(board);
        setBoardViewSetting(board.id, "gallery_mode", nextEnabled);
        refreshBoardViewPreferenceState(viewId, state);
        return true;
    }

    function handleBoardHomeToggleMenu(viewId, state) {
        try {
            if (SITE.handleBoardHomeToggleMenu && SITE.handleBoardHomeToggleMenu(viewId, state || null)) {
                return true;
            }
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
            return true;
        }
        var boardId = resolveMenuBoardId(state);
        if (!boardId) {
            synura.update(viewId, { models: { snackbar: "게시판을 찾지 못했습니다." } });
            return true;
        }

        var nextVisible = !isBoardVisible(boardId, getAllBoardsVisibility());
        var board = setBoardVisible(boardId, nextVisible);
        if (!board) {
            synura.update(viewId, { models: { snackbar: "게시판 상태를 변경하지 못했습니다." } });
            return true;
        }

        var message = board.title + (nextVisible ? " 홈에 추가했습니다." : " 홈에서 제거했습니다.");
        synura.update(viewId, {
            models: {
                menus: state && state.kind === "post" ? getPostMenus(state) : getBoardMenus(state),
                snackbar: message
            }
        });
        refreshAnyHomeView(0, "");
        return true;
    }

    function handleHomeItemMenuEvent(viewId, event, state) {
        if (!state || state.kind !== "home" || event.eventId !== "ITEM_MENU_CLICK") {
            return false;
        }

        var itemMenu = normalizeWhitespace(event.data ? event.data.menu : "");
        var itemId = normalizeWhitespace(event.data ? event.data.id : "");
        if (itemMenu !== MENU_HOME_REMOVE || !isHomeGroupOrderId(itemId)) {
            return false;
        }

        var path = homeGroupPathFromOrderId(itemId);
        var toggled = setHomeGroupShortcut(path, false);
        if (!toggled.ok) {
            synura.update(viewId, { models: { snackbar: "그룹 홈 바로가기를 제거하지 못했습니다." } });
            return true;
        }

        updateViewFromRoute(viewId, createHomeRoute(!!(state && state.isReorderable), toggled.title + " 그룹을 홈에서 제거했습니다."));
        return true;
    }

    function handleCategoryBrowserEvent(viewId, event, state) {
        if (!state || (state.kind !== "category_home" && state.kind !== "category_group")) {
            return false;
        }

        if (event.eventId === "CLICK") {
            var clickId = normalizeWhitespace(event.data ? event.data.id : "");
            if (!isCategoryGroupItemId(clickId)) return false;
            openRoute(createCategoryGroupRoute(categoryGroupPathFromItemId(clickId), state.homeViewId || 0));
            return true;
        }

        if (event.eventId === "ITEM_MENU_CLICK") {
            var itemMenu = normalizeWhitespace(event.data ? event.data.menu : "");
            var itemId = normalizeWhitespace(event.data ? event.data.id : "");

            if ((itemMenu === MENU_HOME_TOGGLE || itemMenu === MENU_HOME_REMOVE) && isCategoryGroupItemId(itemId)) {
                var toggledGroup = toggleCategoryHomeShortcut(categoryGroupPathFromItemId(itemId));
                var groupMessage = toggledGroup.label + " 그룹을 "
                    + (toggledGroup.enabled ? "홈에 추가했습니다." : "홈에서 제거했습니다.");
                refreshCategoryView(viewId, state, groupMessage);
                refreshAnyHomeView(state.homeViewId || 0, "");
                return true;
            }

            if (itemMenu === MENU_HOME_TOGGLE || itemMenu === MENU_HOME_REMOVE) {
                var board = setBoardVisible(itemId, itemMenu === MENU_HOME_TOGGLE);
                if (!board) {
                    synura.update(viewId, { models: { snackbar: "게시판 상태를 변경하지 못했습니다." } });
                    return true;
                }
                var boardMessage = board.title + (itemMenu === MENU_HOME_TOGGLE ? " 홈에 추가했습니다." : " 홈에서 제거했습니다.");
                refreshCategoryView(viewId, state, boardMessage);
                refreshAnyHomeView(state.homeViewId || 0, "");
                return true;
            }
        }

        if (event.eventId !== "MENU_CLICK") return false;

        var menu = normalizeWhitespace(event.data ? event.data.menu : "");
        if (!menu) return false;

        if (menu === MENU_HOME) {
            openRoute(createHomeRoute(false));
            return true;
        }

        if (menu === MENU_BROWSER) {
            openBrowser(state.browserUrl || state.link || SITE.browserHomeUrl, state.title || MENU_ALL_BOARDS, {
                from: "browser_menu",
                parentViewId: viewId || 0,
                targetUrl: state.browserUrl || state.link || SITE.browserHomeUrl
            });
            return true;
        }

        if (menu === MENU_HOME_TOGGLE && state.kind === "category_group" && state.categoryPath) {
            var toggledCurrentGroup = toggleCategoryHomeShortcut(state.categoryPath);
            var currentGroupMessage = toggledCurrentGroup.label + " 그룹을 "
                + (toggledCurrentGroup.enabled ? "홈에 추가했습니다." : "홈에서 제거했습니다.");
            refreshCategoryView(viewId, state, currentGroupMessage);
            refreshAnyHomeView(state.homeViewId || 0, "");
            return true;
        }

        return false;
    }

    function handleHomeReorder(viewId, event) {
        if (!supportsBoardReorder()) return;
        var homeEntries = getHomeEntries();
        var oldIndex = -1;

        if (event.data && event.data.id) {
            for (var i = 0; i < homeEntries.length; i++) {
                var entryId = homeEntries[i] && homeEntries[i].kind === "group"
                    ? homeGroupOrderId(homeEntries[i].path)
                    : normalizeWhitespace(homeEntries[i] && homeEntries[i].board ? homeEntries[i].board.id : homeEntries[i] ? homeEntries[i].id : "");
                if (entryId === normalizeWhitespace(event.data.id)) {
                    oldIndex = i;
                    break;
                }
            }
        }
        if (oldIndex < 0 && event.data && event.data.title) {
            for (var j = 0; j < homeEntries.length; j++) {
                var entryTitle = homeEntries[j] && homeEntries[j].kind === "group"
                    ? homeEntries[j].title
                    : (homeEntries[j] && homeEntries[j].board ? homeEntries[j].board.title : "");
                if (entryTitle === event.data.title) {
                    oldIndex = j;
                    break;
                }
            }
        }
        if (oldIndex < 0 && event.data && event.data._index !== undefined) {
            oldIndex = parseInt(String(event.data._index), 10);
        }

        var newIndex = event.data ? parseInt(String(event.data._newIndex), 10) : -1;
        if (!(oldIndex >= 0) || isNaN(newIndex) || newIndex < 0) return;
        if (newIndex >= homeEntries.length) newIndex = homeEntries.length - 1;
        if (newIndex === oldIndex) return;

        var moved = homeEntries[oldIndex];
        homeEntries.splice(oldIndex, 1);
        homeEntries.splice(newIndex, 0, moved);

        var allBoards = getSortedBoards();
        var displayedIds = {};
        for (var k = 0; k < homeEntries.length; k++) {
            var displayedId = homeEntries[k] && homeEntries[k].kind === "group"
                ? homeGroupOrderId(homeEntries[k].path)
                : normalizeWhitespace(homeEntries[k] && homeEntries[k].board ? homeEntries[k].board.id : homeEntries[k] ? homeEntries[k].id : "");
            if (displayedId) displayedIds[displayedId] = true;
        }
        var newOrder = [];
        for (var m = 0; m < homeEntries.length; m++) {
            var orderedId = homeEntries[m] && homeEntries[m].kind === "group"
                ? homeGroupOrderId(homeEntries[m].path)
                : normalizeWhitespace(homeEntries[m] && homeEntries[m].board ? homeEntries[m].board.id : homeEntries[m] ? homeEntries[m].id : "");
            if (orderedId) newOrder.push(orderedId);
        }
        for (var n = 0; n < allBoards.length; n++) {
            if (!displayedIds[allBoards[n].id]) {
                newOrder.push(allBoards[n].id);
            }
        }
        saveBoardOrder(newOrder);
        updateViewFromRoute(viewId, createHomeRoute(true, "순서가 저장되었습니다."));
    }

    function handleBoardSettingsRootEvent(viewId, event, state) {
        if (!state || state.kind !== "board_settings_root") return false;
        try {
            if (SITE.handleBoardSettingsRootEvent && SITE.handleBoardSettingsRootEvent(viewId, event, state)) {
                return true;
            }
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
            return true;
        }

        if (event.eventId === "MENU_CLICK") {
            var menu = normalizeWhitespace(event.data ? event.data.menu : "");
            if (menu === MENU_BOARD_SYNC) {
                syncDynamicBoardsAndRefresh(viewId, state.parentViewId || 0, state);
                return true;
            }
            if (menu === "추가") {
                showBoardAddDialog(viewId, state.parentViewId || 0);
                return true;
            }
            if (menu === "삭제" && supportsBoardDelete()) {
                showBoardDeleteDialog(viewId, state.parentViewId || 0);
                return true;
            }
            if (menu === "초기화") {
                resetBoardSettingsStorage();
                resetHomeAfterBoardSettingsReset(viewId, state.parentViewId || 0, "설정이 초기화되었습니다.");
                return true;
            }
            return true;
        }

        if (event.eventId === "CLICK") {
            var sectionIndex = event.data && event.data.id !== undefined
                ? parseInt(String(event.data.id), 10)
                : parseInt(String(event.data && event.data._index !== undefined ? event.data._index : -1), 10);
            if (isNaN(sectionIndex) || sectionIndex < 0) return true;
            showBoardSettingsSection(viewId, state.parentViewId || 0, sectionIndex);
            return true;
        }

        return false;
    }

    function handleBrowserSubmit(viewId, event) {
        var state = getViewState(viewId);
        var cookie = event.data ? event.data.cookies : "";
        if (cookie) {
            setSavedCookie(cookie);
        }

        if (!shouldUseBrowserCookieAuth()) {
            synura.close(viewId);
            return;
        }

        var parentViewId = state ? state.parentViewId : 0;
        var targetUrl = normalizeUrl((state && state.targetUrl) || (state && state.link) || (event.data && event.data.url) || SITE.browserHomeUrl) || SITE.browserHomeUrl;
        var parentState = parentViewId ? getViewState(parentViewId) : null;
        if (parentViewId && parentState && normalizeUrl(parentState.link || "") === targetUrl) {
            refreshCurrentView(parentViewId);
            synura.close(viewId);
            return;
        }

        var result = openByUrl(targetUrl, true);
        if (result && result.success) {
            synura.close(viewId);
            return;
        }

        var message = cookie
            ? "쿠키를 저장했지만 차단이 계속됩니다."
            : "인증 쿠키를 가져오지 못했습니다.";
        if (isAuthRequiredResult(result)) {
            message = "인증이 아직 완료되지 않았습니다. 브라우저에서 계속 진행해 주세요.";
        }
        synura.update(viewId, { models: { snackbar: message } });
        if (parentViewId) {
            synura.update(parentViewId, { models: { snackbar: message } });
        }
    }

    function handleCacheSettingsSubmit(viewId, event) {
        var button = event.data ? event.data.button : "";
        var parentViewId = event.context ? event.context.parentViewId : 0;

        if (button === "저장") {
            var ttlMinutes = parseInt(String(event.data ? event.data.ttl : 0), 10);
            var galleryColumnCount = parseInt(String(event.data ? event.data.gallery_column_count : 0), 10);
            if (isNaN(ttlMinutes) || ttlMinutes <= 0) {
                synura.update(viewId, {
                    models: {
                        snackbar: "캐시 TTL은 1분 이상이어야 합니다."
                    }
                });
                return;
            }
            if (isNaN(galleryColumnCount) || galleryColumnCount <= 0) {
                synura.update(viewId, {
                    models: {
                        snackbar: "갤러리 열 수는 1 이상이어야 합니다."
                    }
                });
                return;
            }
            setCacheTTL(ttlMinutes * 60000);
            setShowCacheSnackbar(!!(event.data && event.data.show_snackbar));
            setUseTwoCharCategory(!(event.data && event.data.category_two_char === false));
            setGalleryColumnCount(galleryColumnCount);
            synura.close(viewId);
            if (parentViewId) {
                synura.update(parentViewId, {
                    models: {
                        snackbar: "캐시 설정이 저장되었습니다."
                    }
                });
            }
            return;
        }

        if (button === "초기화") {
            localStorage.removeItem(CACHE_TTL_KEY);
            localStorage.removeItem(CACHE_SNACKBAR_KEY);
            localStorage.removeItem(CATEGORY_TWO_CHAR_KEY);
            localStorage.removeItem(GALLERY_COLUMN_COUNT_KEY);
            synura.update(viewId, {
                models: {
                    body: getCacheSettingsBody(),
                    snackbar: "캐시 설정이 초기화되었습니다."
                }
            });
            if (parentViewId) {
                synura.update(parentViewId, {
                    models: {
                        snackbar: "캐시 설정이 초기화되었습니다."
                    }
                });
            }
            return;
        }

        synura.close(viewId);
    }

    function saveBoardSettingsSection(state, data) {
        var section = getBoardSettingsSection(state).current;
        if (!section || !section.boardIds || section.boardIds.length === 0) return false;
        var visibleMap = getAllBoardsVisibility();
        var changed = false;
        var moveToEndIds = [];
        for (var i = 0; i < section.boardIds.length; i++) {
            var boardId = section.boardIds[i];
            var prevVisible = isBoardVisible(boardId, visibleMap);
            var nextVisible = !!(data && data[boardId]);
            if (prevVisible === nextVisible) continue;
            visibleMap[boardId] = nextVisible;
            changed = true;
            if (nextVisible && shouldAppendEnabledBoardToHomeOrder(boardId)) {
                moveToEndIds.push(boardId);
            }
        }
        if (!changed) return false;
        saveVisibleMap(visibleMap);
        for (var j = 0; j < moveToEndIds.length; j++) {
            moveBoardOrderToEnd(moveToEndIds[j]);
        }
        homeBoards = getVisibleBoards();
        rebuildBoardIndex();
        return true;
    }

    function handleBoardSettingsSubmit(viewId, event) {
        var button = event.data ? event.data.button : "";
        var parentViewId = event.context ? event.context.parentViewId : 0;
        var parentState = parentViewId ? getViewState(parentViewId) : null;

        if (button === MENU_BOARD_SYNC) {
            syncDynamicBoardsAndRefresh(viewId, parentViewId || 0, null);
            return;
        }

        if (button === "저장") {
            var allBoards = getSortedBoards();
            var visibleMap = getAllBoardsVisibility();
            var changed = false;
            var moveToEndIds = [];
            for (var i = 0; i < allBoards.length; i++) {
                var boardId = allBoards[i].id;
                var prevVisible = isBoardVisible(boardId, visibleMap);
                var nextVisible = !!(event.data && event.data[boardId]);
                if (prevVisible === nextVisible) continue;
                visibleMap[boardId] = nextVisible;
                changed = true;
                if (nextVisible && shouldAppendEnabledBoardToHomeOrder(boardId)) {
                    moveToEndIds.push(boardId);
                }
            }
            if (changed) {
                saveVisibleMap(visibleMap);
                for (var j = 0; j < moveToEndIds.length; j++) {
                    moveBoardOrderToEnd(moveToEndIds[j]);
                }
                homeBoards = getVisibleBoards();
                rebuildBoardIndex();
            }
            synura.close(viewId);
            if (parentViewId) {
                updateViewFromRoute(parentViewId, createHomeRoute(!!(parentState && parentState.isReorderable), "설정이 저장되었습니다."));
            }
            return;
        }

        if (button === "초기화") {
            resetBoardSettingsStorage();
            resetHomeAfterBoardSettingsReset(viewId, parentViewId, "설정이 초기화되었습니다.");
            return;
        }

        if (button === "추가") {
            showBoardAddDialog(viewId, parentViewId);
            return;
        }

        if (button === "삭제" && supportsBoardDelete()) {
            showBoardDeleteDialog(viewId, parentViewId);
            return;
        }

        synura.close(viewId);
    }

    function handleBoardSettingsSectionSubmit(viewId, event) {
        var button = event.data ? event.data.button : "";
        var sectionState = getViewState(viewId) || event.context || {};
        var settingsViewId = sectionState.settingsViewId || 0;
        var parentViewId = sectionState.parentViewId || 0;
        var changed = false;

        if (button === "저장") {
            changed = saveBoardSettingsSection(sectionState, event.data || {});
        }

        synura.close(viewId);

        if (settingsViewId) {
            var rootState = getViewState(settingsViewId) || createBoardSettingsRootState(parentViewId);
            refreshBoardSettingsRootView(settingsViewId, rootState, changed ? "설정이 저장되었습니다." : "");
        }
        if (parentViewId && changed) {
            var parentState = getViewState(parentViewId);
            updateViewFromRoute(parentViewId, createHomeRoute(!!(parentState && parentState.isReorderable), ""));
        }
    }

    function handleBoardAddSubmit(viewId, event) {
        var button = event.data ? event.data.button : "";
        if (button !== "추가") {
            synura.close(viewId);
            return;
        }

        var result = addCustomBoard(event.data || {});
        if (!result.ok) {
            synura.update(viewId, {
                models: {
                    snackbar: result.error
                }
            });
            return;
        }

        var message = result.activated
            ? "게시판을 다시 표시합니다: " + result.board.title
            : "게시판이 추가되었습니다: " + result.board.title;
        var settingsViewId = event.context ? event.context.parentViewId : 0;
        var homeViewId = event.context ? event.context.homeViewId : 0;

        synura.close(viewId);
        if (settingsViewId) {
            refreshBoardSettingsParent(settingsViewId, message);
        }
        updateHomeAfterBoardMutation(homeViewId, message);
    }

    function handleBoardDeleteSubmit(viewId, event) {
        var button = event.data ? event.data.button : "";
        if (button !== "확인") {
            synura.close(viewId);
            return;
        }

        var customBoards = getCustomBoards();
        var removedCount = 0;
        for (var i = 0; i < customBoards.length; i++) {
            if (event.data && event.data[customBoards[i].id] === false) {
                if (removeCustomBoard(customBoards[i].id)) {
                    removedCount += 1;
                }
            }
        }

        homeBoards = getVisibleBoards();
        rebuildBoardIndex();
        synura.close(viewId);

        var settingsViewId = event.context ? event.context.parentViewId : 0;
        var homeViewId = event.context ? event.context.homeViewId : 0;
        var message = removedCount + "개의 게시판이 삭제되었습니다.";
        if (settingsViewId) {
            refreshBoardSettingsParent(settingsViewId, message);
        }
        updateHomeAfterBoardMutation(homeViewId, message);
    }

    function handleCategoryBoardSyncPromptSubmit(viewId, event) {
        var button = event.data ? event.data.button : "";
        var homeViewId = event.context ? event.context.homeViewId : 0;

        if (button === MENU_BOARD_SYNC) {
            var items;
            try {
                items = getDynamicBoards({ allowNetwork: true, force: true });
            } catch (e) {
                synura.update(viewId, { models: { snackbar: e.toString() } });
                return;
            }

            homeBoards = getVisibleBoards();
            rebuildBoardIndex();
            synura.close(viewId);
            refreshAnyHomeView(homeViewId, "");

            var openResult = openRoute(createCategoryHomeRoute(homeViewId));
            var message = items.length > 0
                ? ("게시판 " + items.length + "개를 가져왔습니다.")
                : "가져올 게시판이 없습니다.";
            if (openResult && openResult.success) {
                synura.update(openResult.viewId, { models: { snackbar: message } });
            }
            return;
        }

        if (button === BUTTON_OPEN_CATEGORY_HOME_WITHOUT_SYNC) {
            synura.close(viewId);
            openRoute(createCategoryHomeRoute(homeViewId));
            return;
        }

        synura.close(viewId);
    }


    var handler = {
        home: function () {
            openRoute(createHomeRoute(false));
        },

        resume: function (viewId, context) {
            setViewState(viewId, context || getViewState(viewId));
            synura.connect(viewId, context || getViewState(viewId), function (event) {
                handler.onViewEvent(event);
            });
        },

        router: function (url) {
            var route = routeUrl(url, false);
            return route ? route.viewData : null;
        },

        deeplink: function (url) {
            var result = openByUrl(url, false);
            if (!result || !result.success) {
                if (handleOpenFailure(result, url, 0, SITE.displayName)) return;
                var browserUrl = ensureAbsoluteUrl(url, SITE.browserHomeUrl) || SITE.browserHomeUrl;
                openBrowser(browserUrl, SITE.displayName, {
                    from: "browser_deeplink",
                    targetUrl: normalizeUrl(browserUrl) || browserUrl
                });
            }
        },

        onViewEvent: function (event) {
            var viewId = resolveEventViewId(event, 0);
            var state = getViewState(viewId);
            var context = event && event.context ? event.context : state;

            logViewEvent(event, viewId);

            if (context && context.from === "go_url_dialog" && event.eventId === "SUBMIT") {
                handleGoDialogSubmit(viewId, event);
                return;
            }

            if (context && context.from === "board_settings" && event.eventId === "MENU_CLICK") {
                var settingsMenu = normalizeWhitespace(event.data ? event.data.menu : "");
                if (settingsMenu === MENU_BOARD_SYNC) {
                    syncDynamicBoardsAndRefresh(viewId, context.parentViewId || 0, null);
                    return;
                }
                if (settingsMenu === "추가") {
                    showBoardAddDialog(viewId, context.parentViewId || 0);
                    return;
                }
                if (settingsMenu === "삭제" && supportsBoardDelete()) {
                    showBoardDeleteDialog(viewId, context.parentViewId || 0);
                    return;
                }
                if (settingsMenu === "초기화") {
                    resetBoardSettingsStorage();
                    resetHomeAfterBoardSettingsReset(viewId, context.parentViewId || 0, "설정이 초기화되었습니다.");
                    return;
                }
                if (settingsMenu === "취소") {
                    synura.close(viewId);
                    return;
                }
            }

            if (context && context.from === "board_settings" && event.eventId === "SUBMIT") {
                handleBoardSettingsSubmit(viewId, event);
                return;
            }

            if (context && context.from === "board_settings_section" && event.eventId === "SUBMIT") {
                handleBoardSettingsSectionSubmit(viewId, event);
                return;
            }

            if (context && context.from === "board_add_dialog" && event.eventId === "SUBMIT") {
                handleBoardAddSubmit(viewId, event);
                return;
            }

            if (context && context.from === "board_delete_settings" && event.eventId === "SUBMIT") {
                handleBoardDeleteSubmit(viewId, event);
                return;
            }

            if (context && context.from === "category_home_sync_prompt" && event.eventId === "SUBMIT") {
                handleCategoryBoardSyncPromptSubmit(viewId, event);
                return;
            }

            if (context && context.from === "cache_settings" && event.eventId === "SUBMIT") {
                handleCacheSettingsSubmit(viewId, event);
                return;
            }

            if (handleBoardSettingsRootEvent(viewId, event, state)) {
                return;
            }

            if (context && context.kind === "cli") {
                if (handleCliEvent(viewId, event, state, context)) {
                    return;
                }
            }

            if (handleHomeItemMenuEvent(viewId, event, state)) {
                return;
            }

            if (handleCategoryBrowserEvent(viewId, event, state)) {
                return;
            }

            if (state && state.kind === "home" && event.eventId === "MENU_CLICK" && event.data && event.data.menu === MENU_CLI) {
                openCli(viewId);
                return;
            }

            try {
                if (SITE.handleViewEvent && SITE.handleViewEvent(viewId, event, state, context)) {
                    return;
                }
            } catch (e) {
                synura.update(viewId, { models: { snackbar: e.toString() } });
                return;
            }

            if (event.eventId === "CLICK") {
                var link = event.data ? event.data.link : "";
                if (!link) return;
                rememberItemPreview(event.data);
                var result = openByUrl(link, false);
                if (!result || !result.success) {
                    if (handleOpenFailure(result, link, viewId, SITE.displayName)) return;
                    openBrowser(link, SITE.displayName, {
                        from: "browser_click",
                        parentViewId: viewId || 0,
                        targetUrl: normalizeUrl(link) || ensureAbsoluteUrl(link, SITE.browserHomeUrl) || link
                    });
                }
                return;
            }

            if (event.eventId === "REFRESH") {
                refreshCurrentView(viewId);
                return;
            }

            if (event.eventId === "SCROLL_TO_END") {
                appendNextPage(viewId);
                return;
            }

            if (event.eventId === "REORDER") {
                if (state && state.kind === "home") {
                    handleHomeReorder(viewId, event);
                }
                return;
            }

            if (event.eventId === "MENU_CLICK") {
                var menu = event.data ? event.data.menu : "";
                if (menu === MENU_SETTINGS && state && state.kind === "home") {
                    showBoardSettings(viewId);
                } else if (menu === MENU_GO && state && state.kind === "home") {
                    showGoDialog(viewId);
                } else if (menu === MENU_CACHE_SETTINGS && state && state.kind === "home") {
                    showCacheSettingsDialog(viewId);
                } else if (menu === MENU_REORDER && state && state.kind === "home") {
                    var isReorderable = !state.isReorderable;
                    updateViewFromRoute(viewId, createHomeRoute(isReorderable, isReorderable ? "순서 변경이 활성화되었습니다." : "순서 변경이 비활성화되었습니다."));
                } else if (menu === MENU_ALL_BOARDS && state && state.kind === "home") {
                    openCategoryHomeFromMenu(viewId, state);
                } else if (menu === MENU_MEDIA_TOGGLE && state && state.kind === "board") {
                    handleBoardMediaToggleMenu(viewId, state);
                } else if (menu === MENU_GALLERY_MODE && state && state.kind === "board") {
                    handleBoardGalleryModeToggleMenu(viewId, state);
                } else if (menu === MENU_HOME_TOGGLE && state && (state.kind === "board" || state.kind === "post")) {
                    handleBoardHomeToggleMenu(viewId, state);
                } else if (menu === MENU_BROWSER) {
                    openBrowser((state && state.link) || SITE.browserHomeUrl, (state && state.title) || SITE.displayName, {
                        from: "browser_menu",
                        parentViewId: viewId || 0,
                        targetUrl: (state && state.link) || SITE.browserHomeUrl
                    });
                } else if (menu === MENU_HOME) {
                    openRoute(createHomeRoute(false));
                }
                return;
            }

            if (event.eventId === "SUBMIT") {
                if (event.data && Object.prototype.hasOwnProperty.call(event.data, "cookies")) {
                    handleBrowserSubmit(viewId, event);
                    return;
                }
                var button = event.data ? event.data.button : "";
                if (!button || button === BUTTON_REFRESH) {
                    refreshCurrentView(viewId);
                }
            }
        }
    };

    SYNURA.main = handler;
