/**
 * Synura Visual Polyfill for Browser Console Testing
 * 
 * WARNING: SELF-XSS RISK
 * This tool mocks the Synura environment by rendering content directly into the DOM.
 * DO NOT paste code here unless you wrote it or trust the source.
 * Malicious code pasted here could compromise your security.
 * 
 * Copy and paste this entire script into the Chrome/Firefox DevTools console.
 * It mocks the Synura API and renders a visual emulator overlay on the page.
 */

(function () {
    if (typeof synura !== 'undefined' && window._synuraEmulatorActive) {
        console.log("%c[Synura Polyfill] Already active.", "color: orange");
        return;
    }
    window._synuraEmulatorActive = true;

    console.log("%c[Synura Polyfill] Initializing Visual Emulator...", "color: #00bcd4; font-weight: bold; font-size: 12px;");

    // --- 1. CSS Styles ---
    const css = `
        #synura-root {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 375px;
            height: 750px; /* iPhone SE-ish size */
            background: #121212; /* Dark theme background */
            color: #e0e0e0;
            font-family: Roboto, sans-serif;
            z-index: 99999;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #333;
        }
        #synura-header {
            padding: 12px 16px;
            background: #1f1f1f;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            -webkit-user-select: none;
            user-select: none;
        }
        #synura-title {
            font-weight: bold;
            font-size: 14px;
            color: #fff;
        }
        #synura-controls button {
            background: none;
            border: none;
            color: #aaa;
            cursor: pointer;
            font-size: 18px;
            margin-left: 8px;
            padding: 0 4px;
        }
        #synura-controls button:hover { color: #fff; }
        #synura-view-stack {
            flex: 1;
            position: relative;
            overflow: hidden;
        }
        .synura-view {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #121212;
            display: flex;
            flex-direction: column;
            animation: slideIn 0.25s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            z-index: 0; /* Create stacking context */
            pointer-events: auto;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        .synura-appbar {
            padding: 12px 16px;
            background: #1f1f1f;
            font-weight: 500;
            font-size: 18px;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 10;
            min-height: 56px;
        }
        .synura-appbar .back-btn {
            margin-right: 16px;
            cursor: pointer;
            font-size: 20px;
        }
        .synura-appbar .actions {
            margin-left: auto;
        }
        .synura-appbar .action-icon {
            cursor: pointer;
            margin-left: 16px;
            font-size: 20px;
        }
        .synura-content {
            flex: 1;
            padding: 0;
            overflow-y: auto;
            position: relative;
            z-index: 1;
        }
        
        /* List View */
        .synura-list-item {
            padding: 16px;
            border-bottom: 1px solid #2c2c2c;
            cursor: pointer;
            display: flex;
            gap: 16px;
            background: #121212;
            border-left: 0 solid transparent;
            border-right: 0 solid transparent;
        }
        .synura-list-item:hover { background: #1e1e1e; }
        .synura-list-item img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            background: #333;
        }
        .synura-list-item-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .synura-item-title { font-weight: 500; margin-bottom: 6px; font-size: 16px; line-height: 1.3; color: #fff; }
        .synura-item-meta { font-size: 13px; color: #9e9e9e; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .synura-item-stats { display: flex; gap: 8px; margin-top: 4px; font-size: 12px; color: #777; }
        .synura-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #333; color: #ccc; }
        
        /* Card Layout */
        .synura-card-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 8px; 
            padding: 8px;
        }
        .synura-card { 
            background: #1e1e1e; 
            border-radius: 12px; 
            overflow: hidden; 
            cursor: pointer; 
            display: flex;
            flex-direction: column;
            position: relative;
            border-left: 0 solid transparent;
            border-right: 0 solid transparent;
        }
        .synura-card img { 
            width: 100%; 
            aspect-ratio: 16/9; 
            object-fit: cover; 
            background: #333;
        }
        .synura-card-content { padding: 12px; flex: 1; display: flex; flex-direction: column; }
        .synura-card-menu-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0,0,0,0.5);
            color: #fff;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }
        
        /* Post View */
        .synura-post-container { padding: 16px; }
        .synura-post-header { margin-bottom: 20px; }
        .synura-post-title { font-size: 22px; font-weight: bold; margin-bottom: 12px; line-height: 1.3; color: #fff; }
        .synura-post-meta { display: flex; align-items: center; gap: 12px; color: #9e9e9e; font-size: 13px; }
        .synura-avatar { width: 32px; height: 32px; border-radius: 50%; background: #444; object-fit: cover; }
        
        .synura-block { margin-bottom: 16px; font-size: 15px; line-height: 1.6; color: #e0e0e0; }
        .synura-block-image img { width: 100%; border-radius: 8px; margin-top: 4px; }
        .synura-block-video video { width: 100%; border-radius: 8px; margin-top: 4px; }
        .synura-block-link a { color: #64b5f6; text-decoration: none; }
        
        /* Comments */
        .synura-comments-section { margin-top: 24px; border-top: 1px solid #333; padding-top: 16px; }
        .synura-comment { margin-bottom: 16px; }
        .synura-comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 12px; color: #9e9e9e; }
        .synura-comment-content { font-size: 14px; color: #e0e0e0; }
        
        /* Chat View */
        .synura-chat-list { padding: 16px; display: flex; flex-direction: column-reverse; min-height: 100%; }
        .synura-chat-msg { margin-bottom: 12px; display: flex; flex-direction: column; max-width: 80%; }
        .synura-chat-msg.me { align-self: flex-end; align-items: flex-end; }
        .synura-chat-msg.other { align-self: flex-start; align-items: flex-start; }
        .synura-chat-bubble {
            padding: 10px 14px;
            border-radius: 16px;
            font-size: 15px;
            line-height: 1.4;
        }
        .synura-chat-msg.me .synura-chat-bubble {
            background: #0e639c;
            color: #fff;
            border-bottom-right-radius: 4px;
        }
        .synura-chat-msg.other .synura-chat-bubble {
            background: #2c2c2c;
            color: #e0e0e0;
            border-bottom-left-radius: 4px;
        }
        .synura-chat-user { font-size: 11px; color: #888; margin-bottom: 4px; margin-left: 4px; }
        .synura-chat-input-area {
            padding: 12px;
            background: #1f1f1f;
            border-top: 1px solid #333;
            display: flex;
            gap: 8px;
        }
        .synura-chat-input {
            flex: 1;
            background: #2c2c2c;
            border: none;
            border-radius: 20px;
            padding: 10px 16px;
            color: #fff;
            outline: none;
        }

        /* Forms */
        .synura-input-group { margin-bottom: 20px; }
        .synura-input-label { display: block; font-size: 13px; color: #aaa; margin-bottom: 6px; }
        .synura-input-field {
            width: 100%;
            padding: 12px;
            background: #2c2c2c;
            border: 1px solid #444;
            color: #fff;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 15px;
        }
        .synura-btn {
            width: 100%;
            padding: 14px;
            background: #0e639c;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
        }
        .synura-btn:hover { background: #1177bb; }

        /* Browser View */
        /* Browser View */
        .synura-browser-frame { width: 100%; border: none; background: #1e1e1e; }
        .synura-browser-controls { padding: 8px; background: #1f1f1f; display: flex; gap: 8px; border-top: 1px solid #333; }
        .synura-browser-btn { flex: 1; padding: 8px; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .synura-browser-btn:hover { background: #444; }

        /* Log Overlay */
        #synura-log-overlay {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 600px;
            height: 300px;
            background: #0d0d0d;
            color: #ccc;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 12px;
            z-index: 99998;
            border: 1px solid #333;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            resize: both;
            overflow: hidden;
        }
        #synura-log-header {
            padding: 8px 12px;
            background: #1f1f1f;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        }
        #synura-log-content {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .synura-log-entry { padding: 4px 0; border-bottom: 1px solid #222; }
        .synura-log-entry.log { color: #ccc; }
        .synura-log-entry.warn { color: #fc0; }
        .synura-log-entry.error { color: #f55; }
        .synura-log-time { color: #666; margin-right: 8px; }
        .synura-log-btn { background: #333; border: 1px solid #555; color: #fff; cursor: pointer; padding: 2px 6px; font-size: 11px; border-radius: 4px; margin-left: 4px; }
        .synura-log-btn:hover { background: #444; }

        /* Modal Dialog */
        #synura-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; display: flex; align-items: center; justify-content: center; }
        #synura-modal { background: #1f1f1f; padding: 20px; border-radius: 12px; width: 300px; max-width: 90%; max-height: 80vh; display: flex; flex-direction: column; border: 1px solid #333; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .synura-modal-title { font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #fff; text-align: center; }
        .synura-modal-list { overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
        .synura-modal-option { padding: 12px; background: #2c2c2c; border-radius: 8px; cursor: pointer; text-align: center; color: #e0e0e0; border: 1px solid #333; }
        .synura-modal-option:hover { background: #333; border-color: #555; }
        .synura-modal-cancel { margin-top: 12px; padding: 8px; color: #aaa; cursor: pointer; text-align: center; font-size: 14px; }
        .synura-modal-cancel:hover { color: #fff; }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);

    // --- 2. Log Capture & Overlay Management ---
    const _logBuffer = [];
    const _originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    };

    function captureLog(type, args) {
        // Call original
        _originalConsole[type].apply(console, args);

        // Format
        const time = new Date().toLocaleTimeString();
        const message = args.map(a => {
            if (typeof a === 'object') {
                try { return JSON.stringify(a, null, 2); } catch (e) { return String(a); }
            }
            return String(a);
        }).join(' ');

        const entry = { type, time, message };
        _logBuffer.push(entry);

        // Update overlay if active
        const container = document.getElementById('synura-log-content');
        if (container) {
            appendLogEntry(container, entry);
            container.scrollTop = container.scrollHeight;
        }
    }

    console.log = (...args) => captureLog('log', args);
    console.warn = (...args) => captureLog('warn', args);
    console.error = (...args) => captureLog('error', args);

    function toggleLogOverlay() {
        let overlay = document.getElementById('synura-log-overlay');
        if (overlay) {
            overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
            if (overlay.style.display === 'flex') {
                const container = document.getElementById('synura-log-content');
                container.scrollTop = container.scrollHeight;
            }
            return;
        }

        // Create Overlay
        overlay = document.createElement('div');
        overlay.id = 'synura-log-overlay';
        overlay.innerHTML = `
            <div id="synura-log-header">
                <span>Synura Logs</span>
                <div>
                    <button class="synura-log-btn" id="synura-log-clear">Clear</button>
                    <button class="synura-log-btn" id="synura-log-close">×</button>
                </div>
            </div>
            <div id="synura-log-content"></div>
        `;
        overlay.style.display = 'flex'; // Ensure visible on creation
        document.body.appendChild(overlay);

        // Drag Logic
        const header = document.getElementById('synura-log-header');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = overlay.offsetLeft;
            initialTop = overlay.offsetTop;
            document.onmousemove = onMouseMove;
            document.onmouseup = () => { isDragging = false; document.onmousemove = null; };
        };

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            overlay.style.left = `${initialLeft + dx}px`;
            overlay.style.top = `${initialTop + dy}px`;
        }

        // Controls
        document.getElementById('synura-log-close').onclick = () => overlay.style.display = 'none';
        document.getElementById('synura-log-clear').onclick = () => {
            _logBuffer.length = 0;
            document.getElementById('synura-log-content').innerHTML = '';
        };

        // Populate
        const container = document.getElementById('synura-log-content');
        _logBuffer.forEach(entry => appendLogEntry(container, entry));
        container.scrollTop = container.scrollHeight;
    }

    function appendLogEntry(container, entry) {
        const el = document.createElement('div');
        el.className = `synura-log-entry ${entry.type}`;
        el.innerHTML = `<span class="synura-log-time">[${entry.time}]</span>${entry.message}`;
        container.appendChild(el);
    }


    // --- 3. UI Manager ---
    const root = document.createElement('div');
    root.id = 'synura-root';
    root.innerHTML = `
        <div id="synura-header">
            <span id="synura-title">Synura Emulator</span>
            <div id="synura-controls">
            <button id="synura-home" title="Home">🏠</button>
            <button id="synura-deeplink" title="Deep Link">🔗</button>
            <button id="synura-bookmark" title="Bookmark Current View">🔖</button>
            <button id="synura-restore" title="Restore Bookmark">♻️</button>
            <div class="synura-sep"></div>
            <button id="synura-reload" title="Reset Extension">🔄</button>
                <button id="synura-logs-toggle" title="Show Logs">📝</button>
                <button id="synura-minimize" title="Minimize">➖</button>
                <button id="synura-close" title="Close">❌</button>
            </div>
        </div>
        <div id="synura-view-stack"></div>
    `;
    document.body.appendChild(root);

    document.getElementById('synura-close').onclick = () => root.remove();

    // Reset Extension (instead of page reload)
    document.getElementById('synura-reload').onclick = () => {
        // Attempt to clear global SYNURA
        let cleared = false;
        try {
            // 1. Try delete (works for implicit globals)
            delete window.SYNURA;

            // 2. If still there (e.g. 'var'), force undefined
            if (typeof window.SYNURA !== 'undefined') {
                window.SYNURA = undefined;
            }

            // 3. Check if effective
            // We check 'SYNURA' (global scope lookup) to see if it's truly gone/undefined.
            // If it's 'const', window.SYNURA assignment won't affect the 'const' binding.
            if (typeof SYNURA === 'undefined') {
                cleared = true;
            }
        } catch (e) { }

        // Clear Views
        const viewStack = document.getElementById('synura-view-stack');
        if (viewStack) viewStack.innerHTML = '';

        // Clear internal state
        if (typeof views !== 'undefined') {
            Object.keys(views).forEach(key => delete views[key]);
        }
        _viewIdCounter = 1;

        if (cleared) {
            console.log("%c[Synura] SYNURA object cleared.", "color: orange");
        } else {
            console.warn("%c[Synura] 'SYNURA' variable persists (likely 'const'). Extension state is reset, but the variable is locked until you refresh or paste new code.", "color: orange");
        }

        console.log("%c[Synura] Extension Reset. Emulator is ready for new code.", "color: green; font-weight: bold;");
    };

    document.getElementById('synura-logs-toggle').onclick = toggleLogOverlay;

    // Minimize
    let _isMinimized = false;
    const toggleMinimize = () => {
        _isMinimized = !_isMinimized;
        const root = document.getElementById('synura-root');
        const btn = document.getElementById('synura-minimize');
        if (_isMinimized) {
            root.style.height = '46px'; // Collapse to header
            btn.innerText = '◻';
            btn.title = "Maximize";
        } else {
            root.style.height = '750px';
            btn.innerText = '➖';
            btn.title = "Minimize";
        }
    };
    document.getElementById('synura-minimize').onclick = toggleMinimize;
    // Double click title to toggle minimize
    document.getElementById('synura-title').ondblclick = toggleMinimize;

    // --- Helper to find handler ---
    function getHandler() {
        if (typeof SYNURA !== 'undefined' && SYNURA.main) return SYNURA.main;
        return null;
    }

    // --- New Control Handlers ---
    document.getElementById('synura-home').onclick = () => {
        const h = getHandler();
        if (h && h.home) {
            console.log("%c[Synura] Calling handler.home()", "color: cyan");
            h.home();
        } else {
            console.warn("[Synura] handler.home() not found. Set 'SYNURA.main'.");
        }
    };

    document.getElementById('synura-deeplink').onclick = () => {
        const url = prompt("Enter Deep Link URL:");
        if (url) {
            const h = getHandler();
            if (h && h.deeplink) {
                console.log(`%c[Synura] Calling handler.deeplink('${url}')`, "color: cyan");
                h.deeplink(url);
            } else {
                console.warn("[Synura] handler.deeplink() not found");
            }
        }
    };

    let _capturedBookmark = null;
    document.getElementById('synura-bookmark').onclick = () => {
        // Find active view (last one in views object)
        const ids = Object.keys(views).map(Number).sort((a, b) => b - a);
        if (ids.length > 0) {
            const view = views[ids[0]];
            _capturedBookmark = {
                path: view.path,
                models: JSON.parse(JSON.stringify(view.data.models || {})),
                styles: JSON.parse(JSON.stringify(view.data.styles || {})),
                context: JSON.parse(JSON.stringify(view.data.context || {}))
            };
            console.log("%c[Synura] Bookmarked View:", "color: magenta", _capturedBookmark);
            alert("View Bookmarked! Check console for details.");
        } else {
            console.warn("[Synura] No active view to bookmark.");
            alert("No active view to bookmark.");
        }
    };

    document.getElementById('synura-restore').onclick = () => {
        if (_capturedBookmark) {
            console.log("%c[Synura] Restoring Bookmark...", "color: magenta");
            // Open view with captured data
            const result = synura.open(_capturedBookmark.path, {
                models: _capturedBookmark.models,
                styles: _capturedBookmark.styles
            }, _capturedBookmark.context);

            if (result.success) {
                const h = getHandler();
                if (h && h.resume) {
                    console.log(`%c[Synura] Calling handler.resume(${result.viewId}, context)`, "color: cyan");
                    h.resume(result.viewId, _capturedBookmark.context);
                } else {
                    console.warn("[Synura] handler.resume() not found. View opened but resume not called.");
                }
            }
        } else {
            alert("No bookmark saved.");
        }
    };
    // Open logs by default
    toggleLogOverlay();

    const viewStack = document.getElementById('synura-view-stack');
    const views = {}; // Map<viewId, { el, data, callback }>

    function updateAppBar(view) {
        const { id, path, data, el } = view;
        let appbar = el.querySelector('.synura-appbar');
        if (!appbar) {
            appbar = document.createElement('div');
            appbar.className = 'synura-appbar';
            el.insertBefore(appbar, el.firstChild);
        }

        const styles = data.styles || {};
        const titleText = styles.title || path.split('/').pop();

        // Appbar Style (Query Support)
        let isQuery = false;
        let queryLabel = 'Search';
        let queryHint = '';

        const appbarStyle = styles.appbar;
        if (appbarStyle) {
            if (appbarStyle === 'query') {
                isQuery = true;
                if (data.models?.query?.details?.[0]) {
                    let det = data.models.query.details[0];
                    if (typeof det === 'string') try { det = JSON.parse(det); } catch (e) { }
                    if (det) {
                        queryLabel = det.label || 'Search';
                        queryHint = det.hint || '';
                    }
                }
            } else if (typeof appbarStyle === 'object' && appbarStyle.type === 'query') {
                isQuery = true;
                queryLabel = appbarStyle.label || 'Search';
                queryHint = appbarStyle.hint || '';
            }
        }

        // Check if we should have a back button
        // Logic: If it already has one, keep it. If it's a new view (appbar empty) and id > 1, add it.
        // (Simplification: standard synura behavior usually has back button for pushed views)
        const existingBack = appbar.querySelector('.back-btn');
        let hasBack = existingBack !== null;
        if (appbar.innerHTML === '' && Object.keys(views).length > 1) {
            // Note: views object includes THIS view if called after insertion. 
            // If called from createView, 'views' might not contain it yet or might contain others.
            // Let's rely on the caller passing 'hasBack' intent or just check view count.
            hasBack = true;
        }

        let inner = '';
        if (hasBack) inner += `<span class="back-btn">←</span>`;

        // Center Content
        if (isQuery) {
            inner += `<input type="text" class="synura-appbar-query" placeholder="${escapeHtml(queryHint || queryLabel)}" value="${view._queryValue || ''}" style="flex:1; min-width:0; background:#333; border:none; padding:8px 12px; color:#fff; border-radius:4px; margin:0 12px; font-size:14px; outline:none;">`;
        } else {
            inner += `<span class="title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(titleText)}</span>`;
        }

        // Right Actions
        let actions = '';
        if (isQuery) actions += `<span class="action-icon search-btn">🔍</span>`;

        // Check for menus existence
        const hasMenus = data.models?.menus?.details && data.models.menus.details.length > 0;
        if (isQuery || hasMenus) actions += `<span class="action-icon menu-btn">⋮</span>`;

        inner += `<div class="actions" style="margin-left:auto; display:flex; flex-shrink:0;">${actions}</div>`;

        appbar.innerHTML = inner;

        // Re-bind Events
        if (hasBack) {
            const bb = appbar.querySelector('.back-btn');
            if (bb) bb.onclick = () => window.synura.close(id);
        }

        if (isQuery) {
            const input = appbar.querySelector('input');
            input.oninput = (e) => view._queryValue = e.target.value;
            input.onkeypress = (e) => { if (e.key === 'Enter') triggerEvent(view, 'QUERY', { query: input.value }); };
            const sBtn = appbar.querySelector('.search-btn');
            if (sBtn) sBtn.onclick = () => triggerEvent(view, 'QUERY', { query: input.value });
        }

        const mBtn = appbar.querySelector('.menu-btn');
        if (mBtn) {
            mBtn.onclick = () => {
                const menus = (data.models?.menus?.details || []).map(m => {
                    if (typeof m === 'string') {
                        try {
                            const parsed = JSON.parse(m);
                            return parsed.value || parsed;
                        } catch (e) { return m; }
                    }
                    return m.value || m;
                });
                // Flatten potential objects to strings for prompt
                const menuStrings = menus.map(m => (typeof m === 'object' ? JSON.stringify(m) : String(m)));

                if (menuStrings.length > 0) {
                    console.log("%c[Synura] Available Menus:", "color: cyan", menuStrings);
                    showSelectionDialog("Select Menu Action", menuStrings, (choice) => {
                        triggerEvent(view, 'MENU_CLICK', { menu: choice });
                    });
                } else {
                    alert("No menu items available.");
                }
            };
        }
    }

    function createView(id, path, data, callback) {
        const viewEl = document.createElement('div');
        viewEl.className = 'synura-view';
        viewEl.dataset.id = id;
        viewEl.dataset.path = path;

        // App Bar placeholder
        const appbar = document.createElement('div');
        appbar.className = 'synura-appbar';
        viewEl.appendChild(appbar);

        // Content Area
        const contentEl = document.createElement('div');
        contentEl.className = 'synura-content';
        viewEl.appendChild(contentEl);

        viewStack.appendChild(viewEl);

        const viewObj = { id, path, el: viewEl, contentEl, data, callback, _queryValue: '' };
        views[id] = viewObj;

        updateAppBar(viewObj);
        renderView(viewObj);
        return viewObj;
    }

    function renderView(view) {
        const { path, data, contentEl } = view;

        updateAppBar(view); // Ensure appbar is up to date with styles

        const models = data.models || {};
        contentEl.innerHTML = ''; // Clear previous

        if (path === '/views/list') {
            renderList(contentEl, models, data.styles, view);
        } else if (path === '/views/post') {
            renderPost(contentEl, models, data.styles, view);
        } else if (path === '/views/chat') {
            renderChat(contentEl, models, data.styles, view);
        } else if (path === '/views/browser') {
            renderBrowser(contentEl, models, data.styles, view);
        } else if (path === '/views/settings' || path === '/dialogs/input') {
            renderForm(contentEl, models, view);
        } else if (path === '/views/editor') {
            renderEditor(contentEl, models, data.styles, view);
        } else if (path === '/views/markdown') {
            renderMarkdown(contentEl, models, data.styles, view);
        } else if (path === '/views/simple') {
            contentEl.innerHTML = `<div style="padding:16px"><h3>${models.title?.message || ''}</h3><p>${models.content?.message || ''}</p></div>`;
        } else {
            contentEl.innerHTML = `<div style="padding:16px; color: #888;">Unknown view type: ${path}</div>`;
        }
    }

    // --- Renderers ---

    function renderList(container, models, styles, view) {
        const items = models.contents?.details || [];
        const layout = styles?.layout || 'list'; // 'list', 'card', 'gallery'
        const hasPagination = styles?.pagination === true || String(styles?.pagination) === 'true';
        const authorClickable = styles?.authorClickable === true || String(styles?.authorClickable) === 'true';
        const hasMedia = styles?.media === true || String(styles?.media) === 'true';
        const isReorderable = styles?.reorderable === true || String(styles?.reorderable) === 'true';

        const hotThreshold = styles?.hotThreshold;
        const coldThreshold = styles?.coldThreshold;

        const listContainer = document.createElement('div');
        if (layout === 'card' || layout === 'gallery') {
            listContainer.className = 'synura-card-grid';
            if (layout === 'gallery') {
                listContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
            } else if (layout === 'card') {
                listContainer.style.gridTemplateColumns = '1fr';
            }
        }

        items.forEach((itemAny, index) => {
            // Polyfill: itemAny is likely a plain JS object if coming from local script, 
            // but in real app it's a Protobuf Any. We assume the script passes plain objects.
            // If the script uses the helper `synura.parse`, it returns objects.

            // Handle JSON strings if they are passed as strings (common in some extensions)
            let item = itemAny;
            if (typeof itemAny === 'string') {
                try {
                    const parsed = JSON.parse(itemAny);
                    if (typeof parsed === 'object' && parsed !== null) {
                        item = parsed;
                    } else {
                        // It's a plain string, treat as title
                        item = { title: itemAny };
                    }
                } catch (e) {
                    // Not JSON, treat as plain string title
                    item = { title: itemAny };
                }
            }

            const el = document.createElement('div');

            // Stats string
            const stats = [];
            if (item.viewCount && item.viewCount !== '') stats.push(`👁 ${escapeHtml(item.viewCount)}`);
            if (item.likeCount && item.likeCount !== '') stats.push(`👍 ${escapeHtml(item.likeCount)}`);
            if (item.commentCount && item.commentCount !== '') stats.push(`💬 ${escapeHtml(item.commentCount)}`);

            const statsHtml = stats.length > 0 ? `
                <div class="card-stats">
                    ${stats.join('<span style="margin: 0 4px; color: #ccc;">|</span>')}
                </div>
            ` : '';

            // Badges
            const badges = [];
            if (item.category) badges.push(item.category);
            if (item.types && Array.isArray(item.types)) badges.push(...item.types);
            const badgesHtml = badges.map(b => `<span class="synura-badge">${escapeHtml(b)}</span>`).join(' ');

            // Helper for Image/Emoji
            const renderImageOrEmoji = (url, className, style) => {
                if (!url) return '';
                if (url.startsWith('emoji:')) {
                    const emoji = url.substring(6);
                    return `<div class="${className}" style="${style}; display:flex; align-items:center; justify-content:center; background:#333; font-size:24px;">${escapeHtml(emoji)}</div>`;
                }
                return `<img class="${className}" src="${url}" style="${style}">`;
            };

            // Hot/Cold Logic
            let borderLeft = '0 solid transparent';
            let borderRight = '0 solid transparent';

            if (hotThreshold && item.hotCount) {
                const opacity = item.hotCount > hotThreshold ? 1 : (item.hotCount / hotThreshold);
                if (opacity > 0) borderLeft = `5px solid rgba(249, 38, 114, ${opacity})`;
            }
            if (coldThreshold && item.coldCount) {
                const opacity = item.coldCount > coldThreshold ? 1 : (item.coldCount / coldThreshold);
                if (opacity > 0) borderRight = `5px solid rgba(102, 217, 239, ${opacity})`;
            }

            if (layout === 'card' || layout === 'gallery') {
                el.className = 'synura-card';
                el.style.borderLeft = borderLeft;
                el.style.borderRight = borderRight;

                // Item Menu
                let menuHtml = '';
                if (item.menus && item.menus.length > 0) {
                    menuHtml = `<div class="synura-card-menu-btn">⋮</div>`;
                }

                const mediaHtml = hasMedia && item.mediaUrl
                    ? renderImageOrEmoji(item.mediaUrl, '', 'width:100%; aspect-ratio:16/9; object-fit:cover;')
                    : (hasMedia ? '<div style="height:100px;background:#333"></div>' : '');

                const avatarHtml = item.avatar
                    ? renderImageOrEmoji(item.avatar, 'synura-avatar', 'width:16px;height:16px;border-radius:50%;margin-right:4px;font-size:12px;')
                    : '';

                el.innerHTML = `
                    ${mediaHtml}
                    ${menuHtml}
                    ${layout !== 'gallery' ? `
                    <div class="synura-card-content">
                        <div class="synura-item-title" style="font-size:14px">${escapeHtml(item.title)}</div>
                        <div class="synura-item-meta" style="margin-bottom:4px">
                            ${badgesHtml}
                        </div>
                        <div class="synura-item-meta">
                            ${avatarHtml}
                            <span class="author-name">${escapeHtml(item.author)}</span>
                            <span style="margin-left:auto">${escapeHtml(item.date)}</span>
                        </div>
                        ${item.memo ? `<div style="font-size:12px;color:#888;margin-top:4px">${escapeHtml(item.memo)}</div>` : ''}
                        ${statsHtml}
                    </div>` : ''}
                `;

                // Handle item menu click
                if (item.menus && item.menus.length > 0) {
                    const menuBtn = el.querySelector('.synura-card-menu-btn');
                    if (menuBtn) {
                        menuBtn.onclick = (e) => {
                            e.stopPropagation();
                            showSelectionDialog("Select Item Action", item.menus, (choice) => {
                                triggerEvent(view, 'MENU_CLICK', { menu: choice });
                            });
                        };
                    }
                }

            } else {
                // Default list
                el.className = 'synura-list-item';
                el.style.borderLeft = borderLeft;
                el.style.borderRight = borderRight;

                const mediaHtml = hasMedia && item.mediaUrl
                    ? renderImageOrEmoji(item.mediaUrl, '', 'width:80px;height:80px;object-fit:cover;border-radius:8px;')
                    : '';

                const avatarHtml = item.avatar
                    ? renderImageOrEmoji(item.avatar, 'synura-avatar', 'width:16px;height:16px;border-radius:50%;margin-right:4px;font-size:12px;')
                    : '';

                el.innerHTML = `
                    ${mediaHtml}
                    <div class="synura-list-item-content">
                        <div class="synura-item-title">${escapeHtml(item.title)}</div>
                        <div class="synura-item-meta">
                            ${badgesHtml}
                            ${avatarHtml}
                            ${item.author ? `<span class="author-name">${escapeHtml(item.author)}</span> • ` : ''}
                            <span>${escapeHtml(item.date)}</span>
                        </div>
                        ${statsHtml}
                    </div>
                `;
            }

            // Author Click
            if (authorClickable && item.author) {
                const handler = (e) => {
                    e.stopPropagation();
                    triggerEvent(view, 'AUTHOR_CLICK', { author: item.author, link: item.link });
                };

                const authorEl = el.querySelector('.author-name');
                if (authorEl) {
                    authorEl.style.cursor = 'pointer';
                    authorEl.style.textDecoration = 'underline';
                    authorEl.onclick = handler;
                }

                const avatarEl = el.querySelector('.synura-avatar');
                if (avatarEl) {
                    avatarEl.style.cursor = 'pointer';
                    avatarEl.onclick = handler;
                }
            }

            el.onclick = () => {
                // Always pass all item data
                // We clone item to avoid mutating original model if we modify eventData
                const eventData = { ...item };

                // Always add _index
                eventData._index = index;

                // Ensure title is present (though it should be in item)
                if (!eventData.title && typeof item === 'string') eventData.title = item;

                triggerEvent(view, 'CLICK', eventData);
            };

            // Reorder Simulation
            if (isReorderable) {
                const reorderBtn = document.createElement('button');
                reorderBtn.innerText = "⇅";
                reorderBtn.title = "Simulate Reorder";
                reorderBtn.style.cssText = "position:absolute; top:4px; left:4px; z-index:10; background:rgba(0,0,0,0.7); color:#fff; border:none; border-radius:4px; cursor:pointer;";
                reorderBtn.onclick = (e) => {
                    e.stopPropagation();
                    const newIndexStr = prompt("Enter new index for item:", "0");
                    if (newIndexStr !== null) {
                        const newIndex = parseInt(newIndexStr, 10);
                        if (!isNaN(newIndex)) {
                            // Always pass all item data
                            const eventData = { ...item };
                            eventData._newIndex = newIndex;

                            // Ensure title is present if it was a simple string item
                            if (!eventData.title && typeof item === 'string') eventData.title = item;

                            triggerEvent(view, 'REORDER', eventData);
                        }
                    }
                };
                el.style.position = 'relative'; // Ensure button positioning works
                el.appendChild(reorderBtn);
            }

            listContainer.appendChild(el);
        });

        container.appendChild(listContainer);

        // Simulate Infinite Scroll Trigger
        if (hasPagination) {
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.innerText = "Load More (Simulate Scroll)";
            loadMoreBtn.style.cssText = "width:100%; padding:12px; background:#333; color:#fff; border:none; margin-top:8px; cursor:pointer;";
            loadMoreBtn.onclick = () => triggerEvent(view, 'SCROLL_TO_END', {});
            container.appendChild(loadMoreBtn);
        }
    }

    function renderPost(container, models, styles, view) {
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'synura-post-container';

        const hotThreshold = styles?.hotThreshold;
        const coldThreshold = styles?.coldThreshold;

        // Header
        const header = document.createElement('div');
        header.className = 'synura-post-header';

        const title = styles?.title || 'No Title';
        const author = models.author?.message || '';
        const date = models.date?.message || '';
        const avatar = models.avatar?.message || '';
        const memo = models.memo?.message || '';
        const viewCount = models.viewCount?.message || '';
        const likeCount = models.likeCount?.message || '';
        const dislikeCount = models.dislikeCount?.message || '';

        const stats = [];
        if (viewCount) stats.push(`👁 ${escapeHtml(viewCount)}`);
        if (likeCount) stats.push(`👍 ${escapeHtml(likeCount)}`);
        if (dislikeCount) stats.push(`👎 ${escapeHtml(dislikeCount)}`);

        // Helper for Avatar
        const renderAvatar = (url) => {
            if (!url) return '<div class="synura-avatar"></div>';
            if (url.startsWith('emoji:')) {
                const emoji = url.substring(6);
                return `<div class="synura-avatar" style="display:flex;align-items:center;justify-content:center;font-size:20px;background:#444;">${escapeHtml(emoji)}</div>`;
            }
            return `<img class="synura-avatar" src="${url}">`;
        };

        header.innerHTML = `
            <div class="synura-post-title">${escapeHtml(title)}</div>
            <div class="synura-post-meta">
                ${renderAvatar(avatar)}
                <div>
                    <div class="synura-author-name" style="color:#fff; font-weight:500">${escapeHtml(author)}</div>
                    <div style="font-size:11px">
                        ${escapeHtml(date)} ${memo ? '• ' + escapeHtml(memo) : ''}
                        ${stats.length > 0 ? '• ' + stats.join(' ') : ''}
                    </div>
                </div>
            </div>
        `;

        if (styles?.authorClickable) {
            const handler = () => triggerEvent(view, 'AUTHOR_CLICK', { author, link: models.link?.message });

            const avatarEl = header.querySelector('.synura-avatar');
            if (avatarEl) {
                avatarEl.style.cursor = 'pointer';
                avatarEl.onclick = handler;
            }

            const nameEl = header.querySelector('.synura-author-name');
            if (nameEl) {
                nameEl.style.cursor = 'pointer';
                nameEl.onclick = handler;
            }
        }

        scrollContainer.appendChild(header);

        // Content Blocks
        // In Post View, 'content' model details are JSON strings, or raw strings
        const blocks = (models.content?.details || []).map(d => {
            if (typeof d === 'string') {
                try {
                    const parsed = JSON.parse(d);
                    return parsed;
                } catch (e) {
                    return d;
                }
            }
            return d;
        });

        blocks.forEach(block => {
            const el = document.createElement('div');

            if (typeof block === 'string') {
                el.className = 'synura-block synura-block-text';
                el.innerText = block;
                scrollContainer.appendChild(el);
                return;
            }

            el.className = `synura-block synura-block-${block.type}`;

            if (block.type === 'text') {
                el.innerText = block.value;
            } else if (block.type === 'image') {
                el.innerHTML = `<img src="${block.value}">`;
            } else if (block.type === 'video') {
                el.innerHTML = `<video controls src="${block.value}"></video>`;
            } else if (block.type === 'link') {
                el.innerHTML = `<a href="${block.link || block.value}" target="_blank">${escapeHtml(block.value)}</a>`;
            }
            scrollContainer.appendChild(el);
        });

        // Comments
        // In Post View, 'comments' model details are JSON strings
        const comments = (models.comments?.details || []).map(d => typeof d === 'string' ? JSON.parse(d) : d);

        if (comments.length > 0) {
            const section = document.createElement('div');
            section.className = 'synura-comments-section';
            section.innerHTML = `<h4 style="margin-bottom:16px">Comments (${comments.length})</h4>`;

            comments.forEach(c => {
                const el = document.createElement('div');
                el.className = 'synura-comment';
                el.style.marginLeft = (c.level || 0) * 16 + 'px';
                el.style.paddingLeft = (c.level > 0 ? 12 : 0) + 'px';
                if (c.level > 0) el.style.borderLeft = '2px solid #333';

                // Hot/Cold Logic for Comments
                const hotCount = c.hotCount;
                const coldCount = c.coldCount;

                if (hotThreshold && hotCount) {
                    const opacity = hotCount > hotThreshold ? 1 : (hotCount / hotThreshold);
                    if (opacity > 0) {
                        const color = `rgba(249, 38, 114, ${opacity})`;
                        el.style.borderLeft = `5px solid ${color}`;
                    }
                }
                if (coldThreshold && coldCount) {
                    const opacity = coldCount > coldThreshold ? 1 : (coldCount / coldThreshold);
                    if (opacity > 0) {
                        const color = `rgba(102, 217, 239, ${opacity})`;
                        el.style.borderRight = `5px solid ${color}`;
                    }
                }

                let contentHtml = '';
                if (Array.isArray(c.content)) {
                    // Comment content is a list of blocks
                    contentHtml = c.content.map(b => {
                        if (b.type === 'image') return `<img src="${b.value}" style="max-width:100px; border-radius:4px">`;
                        return `<span>${b.value}</span>`;
                    }).join('<br>');
                } else {
                    contentHtml = c.content || '';
                }

                const likeCount = (c.likeCount !== undefined && c.likeCount !== null) ? String(c.likeCount) : '';
                const dislikeCount = (c.dislikeCount !== undefined && c.dislikeCount !== null) ? String(c.dislikeCount) : '';

                const commentStats = [];
                if (likeCount !== '') commentStats.push(`👍 ${escapeHtml(likeCount)}`);
                if (dislikeCount !== '') commentStats.push(`👎 ${escapeHtml(dislikeCount)}`);

                const commentAvatarHtml = c.avatar
                    ? (c.avatar.startsWith('emoji:')
                        ? `<div class="synura-avatar" style="width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:14px;background:#444;">${c.avatar.substring(6)}</div>`
                        : `<img class="synura-avatar" src="${c.avatar}" style="width:20px;height:20px;border-radius:50%">`)
                    : '';

                el.innerHTML = `
                    <div class="synura-comment-header">
                        ${commentAvatarHtml}
                        <span class="synura-author-name" style="color:#fff;font-weight:500">${escapeHtml(c.author || 'Unknown')}</span>
                        <span>${escapeHtml(c.date)}</span>
                        ${commentStats.length > 0 ? `<span style="margin-left:8px; color:#777">${commentStats.join(' ')}</span>` : ''}
                    </div>
                    <div class="synura-comment-content">${contentHtml}</div>
                `;

                if (styles?.authorClickable) {
                    const handler = (e) => {
                        e.stopPropagation(); // Prevent bubbling if needed
                        triggerEvent(view, 'AUTHOR_CLICK', { author: c.author, link: c.link });
                    };

                    const avatarEl = el.querySelector('.synura-avatar');
                    if (avatarEl) {
                        avatarEl.style.cursor = 'pointer';
                        avatarEl.onclick = handler;
                    }

                    const nameEl = el.querySelector('.synura-author-name');
                    if (nameEl) {
                        nameEl.style.cursor = 'pointer';
                        nameEl.style.textDecoration = 'underline';
                        nameEl.onclick = handler;
                    }
                }

                section.appendChild(el);
            });
            scrollContainer.appendChild(section);
        }

        // Simulate Infinite Scroll Trigger (Post always emits in Dart)
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.innerText = "Load More (Simulate Scroll)";
        loadMoreBtn.style.cssText = "width:100%; padding:12px; background:#333; color:#fff; border:none; margin-top:24px; cursor:pointer;";
        loadMoreBtn.onclick = () => triggerEvent(view, 'SCROLL_TO_END', {});
        scrollContainer.appendChild(loadMoreBtn);

        // Buttons
        const buttons = (models.buttons?.details || []).map(d => {
            if (typeof d === 'string') {
                try {
                    return JSON.parse(d);
                } catch (e) {
                    return d;
                }
            }
            return d;
        });
        if (buttons.length > 0) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-evenly';
            buttonContainer.style.marginTop = '24px';
            buttonContainer.style.marginBottom = '24px';

            buttons.forEach(btnText => {
                // If btnText is string, use it. If object (from protobuf wrapper), verify.
                const label = typeof btnText === 'string' ? btnText : (btnText.value || String(btnText));

                const btn = document.createElement('button');
                btn.className = 'synura-btn';
                btn.innerText = label;
                btn.style.width = 'auto';
                btn.style.minWidth = '100px';
                btn.onclick = () => triggerEvent(view, 'SUBMIT', { button: label });
                buttonContainer.appendChild(btn);
            });
            scrollContainer.appendChild(buttonContainer);
        }

        container.appendChild(scrollContainer);
    }

    function renderChat(container, models, styles, view) {
        // Chat uses 'append' model for messages
        // We need to maintain state of messages because 'append' only sends new ones
        // But for this simple polyfill, we might just re-render everything if we stored it.
        // The 'update' function in synura object handles appending to view.data.models.append.details

        const msgs = (models.append?.details || []).map(d => typeof d === 'string' ? JSON.parse(d) : d);

        const list = document.createElement('div');
        list.className = 'synura-chat-list';

        // Reverse order for display (bottom up)
        [...msgs].reverse().forEach(msg => {
            const isMe = msg.user === 'Me';
            const el = document.createElement('div');
            el.className = `synura-chat-msg ${isMe ? 'me' : 'other'}`;
            el.innerHTML = `
                ${!isMe ? `<div class="synura-chat-user">${escapeHtml(msg.user || 'Other')}</div>` : ''}
                <div class="synura-chat-bubble">${escapeHtml(msg.message)}</div>
            `;
            list.appendChild(el);
        });

        container.appendChild(list);

        // Input Area
        const inputArea = document.createElement('div');
        inputArea.className = 'synura-chat-input-area';
        inputArea.innerHTML = `
            <input type="text" class="synura-chat-input" placeholder="Send a message...">
            <button style="background:none;border:none;color:#0e639c;cursor:pointer;font-weight:bold">SEND</button>
        `;

        const input = inputArea.querySelector('input');
        const btn = inputArea.querySelector('button');

        const send = () => {
            if (input.value.trim()) {
                triggerEvent(view, 'SUBMIT', { message: input.value });
                // Locally echo for UI feel
                const echoMsg = { user: 'Me', message: input.value };
                if (!view.data.models.append) view.data.models.append = { details: [] };
                view.data.models.append.details.push(echoMsg);
                renderView(view); // Re-render
            }
        };

        btn.onclick = send;
        input.onkeypress = (e) => { if (e.key === 'Enter') send(); };

        // Remove existing input area if re-rendering to prevent duplicates
        const existingInput = view.el.querySelector('.synura-chat-input-area');
        if (existingInput) existingInput.remove();

        view.el.appendChild(inputArea); // Append to view, not content (fixed at bottom)
    }

    function renderBrowser(container, models, styles, view) {
        const url = models.url?.message || 'about:blank';

        // Ensure container takes full height and uses flex
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';

        // Iframe to simulate browser
        const iframe = document.createElement('iframe');
        iframe.className = 'synura-browser-frame';
        iframe.src = url;
        // Use flex to fill space, min-height 0 for nested flex scroll issues
        iframe.style.flex = '1';
        iframe.style.minHeight = '0';
        iframe.style.background = '#1e1e1e'; // Dark background
        // Note: 'allow-scripts' and 'allow-same-origin' together triggers a console warning about breaking the sandbox.
        // We need 'allow-scripts' for site functionality and 'allow-same-origin' for cookies/storage.
        // We keep 'sandbox' mainly to prevent the iframe from navigating the top-level window (allow-top-navigation is omitted).
        iframe.sandbox = "allow-forms allow-scripts allow-same-origin allow-popups";
        iframe.onload = () => {
            console.log(`%c[Synura] Iframe loaded (or failed silently).`, "color: green");
        };

        // Hint for X-Frame-Options
        const hint = document.createElement('div');
        hint.style.padding = '4px 8px';
        hint.style.fontSize = '11px';
        hint.style.color = '#666';
        hint.style.background = '#1f1f1f';
        hint.innerText = "Note: If blank, target site likely blocks embedding (X-Frame-Options).";

        // Controls area
        const controls = document.createElement('div');
        controls.className = 'synura-browser-controls';

        const btnOpen = document.createElement('button');
        btnOpen.className = 'synura-browser-btn';
        btnOpen.innerText = "Open External";
        btnOpen.onclick = () => window.open(url, '_blank');

        const btnSubmit = document.createElement('button');
        btnSubmit.className = 'synura-browser-btn';
        btnSubmit.innerText = "Submit Cookies";
        btnSubmit.onclick = () => {
            const cookies = prompt("Enter mock cookies to submit:", document.cookie || "session=123;");
            if (cookies !== null) {
                triggerEvent(view, 'SUBMIT', {
                    cookies: cookies,
                    url: url
                });
            }
        };

        controls.appendChild(btnOpen);
        controls.appendChild(btnSubmit);

        container.appendChild(iframe);
        container.appendChild(hint);

        // Remove existing controls if re-rendering
        const existingControls = view.el.querySelector('.synura-browser-controls');
        if (existingControls) existingControls.remove();

        view.el.appendChild(controls); // Append to view to sit at bottom
    }

    function renderForm(container, models, view) {
        const inputs = models.body?.details || [];
        const formValues = {};

        const formContainer = document.createElement('div');
        formContainer.style.padding = '16px';

        inputs.forEach(input => {
            // Input might be JSON string
            if (typeof input === 'string') try { input = JSON.parse(input); } catch (e) { }

            const group = document.createElement('div');
            group.className = 'synura-input-group';

            const label = document.createElement('label');
            label.className = 'synura-input-label';
            label.innerText = input.label || input.name;
            group.appendChild(label);

            const field = document.createElement('input');
            field.className = 'synura-input-field';
            field.type = input.type === 'number' ? 'number' : (input.format === 'password' ? 'password' : 'text');
            if (input.value) field.value = input.value;

            formValues[input.name] = input.value; // Initial 
            field.onchange = (e) => formValues[input.name] = e.target.value;

            group.appendChild(field);
            formContainer.appendChild(group);
        });

        const buttons = models.buttons?.details || ['Submit'];
        buttons.forEach(btnText => {
            const btn = document.createElement('button');
            btn.className = 'synura-btn';
            btn.innerText = btnText;
            btn.onclick = () => triggerEvent(view, 'SUBMIT', { button: btnText, ...formValues });
            formContainer.appendChild(btn);
        });

        container.appendChild(formContainer);
    }

    function renderEditor(container, models, styles, view) {
        const acceptable = styles?.acceptableFileType || 'any'; // 'image', 'video', 'any'
        const maxFiles = parseInt(styles?.max || 1, 10);

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.height = '100%';
        wrapper.style.padding = '16px';

        // Title Input
        const titleInput = document.createElement('input');
        titleInput.className = 'synura-input-field';
        titleInput.style.marginBottom = '16px';
        titleInput.style.fontFamily = 'inherit';
        titleInput.placeholder = "Title (Optional)";
        wrapper.appendChild(titleInput);

        // Text Area
        const textarea = document.createElement('textarea');
        textarea.className = 'synura-input-field';
        textarea.style.flex = '1';
        textarea.style.resize = 'none';
        textarea.style.marginBottom = '16px';
        textarea.style.fontFamily = 'inherit';
        textarea.placeholder = "Type something...";

        wrapper.appendChild(textarea);

        // Attachments Area
        const attachmentsContainer = document.createElement('div');
        attachmentsContainer.style.marginBottom = '16px';

        const attachments = [];

        function updateAttachments() {
            attachmentsContainer.innerHTML = '';
            attachments.forEach((path, idx) => {
                const chip = document.createElement('div');
                chip.style.display = 'inline-flex';
                chip.style.alignItems = 'center';
                chip.style.background = '#333';
                chip.style.borderRadius = '16px';
                chip.style.padding = '4px 12px';
                chip.style.marginRight = '8px';
                chip.style.marginTop = '4px';
                chip.style.fontSize = '12px';
                chip.style.color = '#e0e0e0';

                const text = document.createElement('span');
                text.innerText = path.split('/').pop();
                chip.appendChild(text);

                const remove = document.createElement('span');
                remove.innerText = ' ×';
                remove.style.cursor = 'pointer';
                remove.style.marginLeft = '6px';
                remove.style.fontWeight = 'bold';
                remove.onclick = () => {
                    attachments.splice(idx, 1);
                    updateAttachments();
                };
                chip.appendChild(remove);

                attachmentsContainer.appendChild(chip);
            });
        }

        wrapper.appendChild(attachmentsContainer);

        // Controls
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '12px';

        const attachBtn = document.createElement('button');
        attachBtn.className = 'synura-btn';
        attachBtn.style.flex = '1';
        attachBtn.style.background = '#333';
        attachBtn.innerText = `Attach (${acceptable})`;
        attachBtn.onclick = () => {
            if (attachments.length >= maxFiles) {
                alert(`Max ${maxFiles} files allowed.`);
                return;
            }
            const path = prompt("Enter mock file path (e.g. /tmp/image.png):", "/tmp/file.png");
            if (path) {
                attachments.push(path);
                updateAttachments();
            }
        };

        controls.appendChild(attachBtn);

        wrapper.appendChild(controls);
        container.appendChild(wrapper);

        // Update AppBar with Editor Actions (Check/Submit and Close)
        const appbar = view.el.querySelector('.synura-appbar');
        if (appbar) {
            const actionsDiv = appbar.querySelector('.actions') || document.createElement('div');
            if (!appbar.querySelector('.actions')) {
                actionsDiv.className = 'actions';
                actionsDiv.style.marginLeft = 'auto';
                appbar.appendChild(actionsDiv);
            }

            // Submit (Check)
            const submitAction = document.createElement('span');
            submitAction.className = 'action-icon';
            submitAction.innerText = '✓';
            submitAction.title = 'Submit';
            submitAction.onclick = () => {
                triggerEvent(view, 'SUBMIT', {
                    title: titleInput.value,
                    content: textarea.value,
                    attachment_paths: attachments.join(',')
                });
            };
            actionsDiv.appendChild(submitAction);

            // Close (X) - Overrides default back if present or adds new
            // Note: Native Editor has Close icon. 
            const closeAction = document.createElement('span');
            closeAction.className = 'action-icon';
            closeAction.innerText = '✕';
            closeAction.title = 'Close';
            closeAction.onclick = () => {
                triggerEvent(view, 'CLOSE', {});
                window.synura.close(view.id);
            };
            actionsDiv.appendChild(closeAction);

            // Hide default back button if it exists, as Editor usually is modal-like
            const backBtn = appbar.querySelector('.back-btn');
            if (backBtn) backBtn.style.display = 'none';
        }
    }

    function renderMarkdown(container, models, styles, view) {
        const content = models.content?.message || models.body?.message || '';

        const wrapper = document.createElement('div');
        wrapper.style.padding = '16px';
        wrapper.className = 'synura-markdown-body';

        // Basic styling for markdown content
        const style = document.createElement('style');
        style.innerHTML = `
            .synura-markdown-body h1, .synura-markdown-body h2, .synura-markdown-body h3 { color: #fff; border-bottom: 1px solid #333; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; }
            .synura-markdown-body p { margin-bottom: 16px; line-height: 1.6; }
            .synura-markdown-body a { color: #58a6ff; text-decoration: none; }
            .synura-markdown-body code { background: rgba(110,118,129,0.4); padding: 0.2em 0.4em; border-radius: 6px; font-family: monospace; font-size: 85%; }
            .synura-markdown-body pre { background: #161b22; padding: 16px; overflow: auto; border-radius: 6px; margin-bottom: 16px; }
            .synura-markdown-body pre code { background: transparent; padding: 0; }
            .synura-markdown-body blockquote { border-left: 0.25em solid #30363d; color: #8b949e; padding: 0 1em; margin: 0 0 16px 0; }
            .synura-markdown-body ul, .synura-markdown-body ol { padding-left: 2em; margin-bottom: 16px; }
            .synura-markdown-body li { margin-bottom: 4px; }
            .synura-markdown-body img { max-width: 100%; border-radius: 6px; box-sizing: border-box; }
            .synura-markdown-body table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
            .synura-markdown-body th, .synura-markdown-body td { border: 1px solid #30363d; padding: 6px 13px; }
            .synura-markdown-body th { background: #161b22; font-weight: 600; }
            .synura-markdown-body hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #30363d; border: 0; }
        `;
        container.appendChild(style);

        wrapper.innerHTML = parseMarkdown(content);

        // Handle links
        const links = wrapper.querySelectorAll('a');
        links.forEach(a => {
            const href = a.getAttribute('href');
            if (href) {
                a.onclick = (e) => {
                    e.preventDefault();
                    triggerEvent(view, 'CLICK', { link: href });
                };
            }
        });

        container.appendChild(wrapper);
    }

    function highlightCode(code, lang) {
        if (!lang) return code;
        const l = lang.toLowerCase();

        if (l === 'js' || l === 'javascript') {
            return code.replace(
                /(\/\/.*$|\/\*[\s\S]*?\*\/)|(['"`](?:\\.|[^\\\n\r])*?['"`])|\b(const|let|var|function|return|if|else|for|while|class|new|this|import|export|async|await|try|catch|console|window|document)\b|(=>)|\b(\d+)\b/gm,
                (match, comment, string, keyword, arrow, number) => {
                    if (comment) return `<span style="color:#6a9955">${comment}</span>`;
                    if (string) return `<span style="color:#ce9178">${string}</span>`;
                    if (keyword) return `<span style="color:#569cd6">${keyword}</span>`;
                    if (arrow) return `<span style="color:#569cd6">${arrow}</span>`;
                    if (number) return `<span style="color:#b5cea8">${number}</span>`;
                    return match;
                }
            );
        } else if (l === 'py' || l === 'python') {
            return code.replace(
                /(#.*$)|(['"](?:\\.|[^\\\n\r])*?['"])|(\b(?:def|class|if|else|elif|return|import|from|print|None|True|False|for|while|in|and|or|not|try|except|finally|with|as|pass|lambda|yield|global|nonlocal|assert|del|break|continue|raise)\b)|(\b\d+\b)/gm,
                (match, comment, string, keyword, number) => {
                    if (comment) return `<span style="color:#6a9955">${comment}</span>`;
                    if (string) return `<span style="color:#ce9178">${string}</span>`;
                    if (keyword) return `<span style="color:#c586c0">${keyword}</span>`; // Purple for Python keywords
                    if (number) return `<span style="color:#b5cea8">${number}</span>`;
                    return match;
                }
            );
        }
        return code;
    }

    function parseMarkdown(text) {
        if (!text) return '';

        // Simple Regex Markdown Parser
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Code blocks (```lang)
        html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang}">${highlightCode(code, lang)}</code></pre>`;
        });

        // Inline code (`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Headers
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');

        // Blockquotes
        html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Bold
        html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

        // Italic
        // Use \* based italic only (asterisk)
        html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
        // For underscore-based italic, require word boundaries to avoid matching inside URLs/hrefs
        // This requires underscore to be preceded and followed by whitespace or start/end of string
        html = html.replace(/(^|[\s>])_([^_]+)_(?=[\s<.,;:!?)]|$)/gm, '$1<em>$2</em>');

        // Unordered Lists (handling simple single-level lists)
        // We use a temporary placeholder for list items to avoid mixing with * italic
        html = html.replace(/^\s*[\-\*] (.*)/gm, '<li class="md-li">$1</li>');

        // Wrap consecutive lis in ul (Basic approach)
        // Note: proper regex list wrapping is hard, this is a rough approximation
        // We'll just let them be lis and wrap the whole block if we could, 
        // but for simple visual emulation, just converting them to div with bullet works or:
        html = html.replace(/(<li class="md-li">.*<\/li>)/g, '<ul>$1</ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, ''); // Merge adjacent uls

        // Horizontal Rule
        html = html.replace(/^---$/gm, '<hr>');

        // Newlines to BR (but not inside pre/code if we could help it, but simple regex hits all)
        // A better way: Split by blocks? 
        // For this simple version: Double newline -> P, Single -> BR

        // Paragraphs (double newline)
        html = html.replace(/\n\n/g, '<p></p>');
        // Note: The above simple replacements might break HTML structure if not careful.
        // A truly robust one requires tokenization.
        // Let's stick to a very simple line-based approach for the "rest":

        html = html.replace(/\n/g, '<br>');

        return html;
    }

    function triggerEvent(view, eventId, data) {
        if (view.callback) {
            console.log(`%c[Event] ${eventId}`, "color: orange", data);
            view.callback({
                viewId: view.id,
                eventId: eventId,
                context: view.data.context || {},
                data: data
            });
        }
    }

    // --- 3. Synura Implementation ---
    let _viewIdCounter = 1;

    function inferModel(value) {
        if (value === null || value === undefined) return {};
        if (typeof value === 'string') return { message: value };
        if (typeof value === 'number') return { value: value, code: Math.floor(value) };
        if (Array.isArray(value)) return { details: value };

        // If it's an object, check if it's strictly the {message/code/details/value} wrapper
        if (typeof value === 'object') {
            const keys = Object.keys(value);
            let isWrapper = false;
            let hasAlien = false;

            for (const key of keys) {
                if (key === 'code' || key === 'message' || key === 'details' || key === 'value') {
                    isWrapper = true;
                } else {
                    hasAlien = true;
                }
            }

            if (isWrapper && !hasAlien) {
                return value;
            }

            // Fallback: stringify generic objects
            try {
                return { message: JSON.stringify(value) };
            } catch (e) {
                return { message: String(value) };
            }
        }
        return { message: String(value) };
    }

    function processModels(models) {
        if (!models) return {};
        const processed = {};
        for (const key in models) {
            processed[key] = inferModel(models[key]);
        }
        return processed;
    }

    window.synura = {
        isPolyfill: true,
        open: (viewPath, data, context, callback) => {
            if (!viewPath) {
                console.error("%c[Synura] Error: viewPath is required", "color: red");
                return { success: false, error: "viewPath is required" };
            }
            if (!data) {
                console.warn("%c[Synura] Warning: data object is missing, using empty object", "color: yellow");
                data = {};
            }

            // Apply type inference to models
            if (data.models) {
                data.models = processModels(data.models);
            }

            const viewId = _viewIdCounter++;
            // Attach context to data for easy access in render
            data.context = context;

            console.groupCollapsed(`%c[Synura] OPEN ${viewPath} (ID: ${viewId})`, "color: green");
            console.log("Data:", data);
            console.groupEnd();

            createView(viewId, viewPath, data, callback);

            if (callback) {
                setTimeout(() => {
                    callback({ viewId, eventId: 'LOAD', context: context || {}, data: {} });
                }, 100);
            }
            return { success: true, viewId: viewId, viewName: viewPath.split('/').pop() };
        },

        update: (viewId, data) => {
            const view = views[viewId];
            if (view) {
                // Apply type inference to models in update data
                if (data.models) {
                    data.models = processModels(data.models);
                }

                console.groupCollapsed(`%c[Synura] UPDATE View ${viewId}`, "color: blue");
                console.log("Diff:", data);
                console.groupEnd();

                // Deep merge (simplified)
                if (data.styles) {
                    if (!view.data.styles) view.data.styles = {};
                    Object.assign(view.data.styles, data.styles);
                }

                if (data.models) {
                    if (!view.data.models) view.data.models = {};

                    // Handle 'append' specially for lists/chats
                    if (data.models.append) {
                        if (view.path === '/views/chat') {
                            if (!view.data.models.append) view.data.models.append = { details: [] };
                            // inferModel ensures 'details' exists if passed as array, but let's be safe
                            const newDetails = data.models.append.details || [];
                            view.data.models.append.details.push(...newDetails);
                        } else if (view.path === '/views/list') {
                            if (!view.data.models.contents) view.data.models.contents = { details: [] };
                            const newDetails = data.models.append.details || [];
                            view.data.models.contents.details.push(...newDetails);
                        }
                    }

                    // Overwrite other models
                    for (const key in data.models) {
                        // Skip append as it's handled above, or merge it?
                        // The original code merged everything. But 'append' is special action.
                        // Let's keep overwriting other keys.
                        if (key !== 'append') {
                            view.data.models[key] = data.models[key];
                        }
                    }
                }

                renderView(view);
                return { success: true, viewId: viewId };
            }
            return { success: false, error: "View not found" };
        },

        connect: (viewId, context, callback) => {
            const view = views[viewId];
            if (view) {
                view.callback = callback; // Update callback
                if (context) view.data.context = context;

                setTimeout(() => {
                    callback({ viewId, eventId: 'LOAD', context: context || {}, data: {} });
                }, 100);
                return { success: true, viewId: viewId };
            }
            return { success: false, error: "View not found" };
        },

        close: (viewId) => {
            const view = views[viewId];
            if (view) {
                view.el.remove();
                delete views[viewId];
                return { success: true, viewId: viewId };
            }
            return { success: false, error: "View not found" };
        },

        parse: (type, element) => {
            if (type !== 'post') {
                console.warn("[Synura] parse() type '" + type + "' is not fully supported in polyfill.");
                return [];
            }
            // Unwrap if it's a StrictDOMElement
            const node = element._rawNode || element;
            return domToDetails(node);
        }
    };

    // --- 4. Helpers (DOM Parsing, Fetch) ---

    function showSelectionDialog(title, options, callback) {
        const overlay = document.createElement('div');
        overlay.id = 'synura-modal-overlay';

        const modal = document.createElement('div');
        modal.id = 'synura-modal';

        const titleEl = document.createElement('div');
        titleEl.className = 'synura-modal-title';
        titleEl.innerText = title;
        modal.appendChild(titleEl);

        const list = document.createElement('div');
        list.className = 'synura-modal-list';

        options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'synura-modal-option';
            btn.innerText = opt;
            btn.onclick = () => {
                overlay.remove();
                callback(opt);
            };
            list.appendChild(btn);
        });
        modal.appendChild(list);

        const cancel = document.createElement('div');
        cancel.className = 'synura-modal-cancel';
        cancel.innerText = 'Cancel';
        cancel.onclick = () => overlay.remove();
        modal.appendChild(cancel);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close on outside click
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
    }

    function escapeHtml(unsafe) {
        if (unsafe === undefined || unsafe === null) return '';
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Strict DOM Wrapper
    class StrictDOMElement {
        constructor(node) {
            this._node = node;
            this._rawNode = node; // Internal access
        }

        get textContent() { return this._node.textContent; }
        get innerText() { return this._node.innerText; }
        get tagName() { return this._node.tagName; }
        get className() { return this._node.className; }
        get classList() { return this._node.classList; }
        get id() { return this._node.id; }
        get nodeType() { return this._node.nodeType; }
        get dataset() { return this._node.dataset; }

        get childNodes() {
            const nodes = Array.from(this._node.childNodes).map(n => new StrictDOMElement(n));
            nodes.forEach = Array.prototype.forEach;
            return nodes;
        }

        get firstChild() {
            let child = this._node.firstElementChild;
            return child ? new StrictDOMElement(child) : null;
        }

        get lastChild() {
            let child = this._node.lastElementChild;
            return child ? new StrictDOMElement(child) : null;
        }

        get nextSibling() {
            let sibling = this._node.nextElementSibling;
            return sibling ? new StrictDOMElement(sibling) : null;
        }

        getAttribute(name) {
            return this._node.getAttribute(name);
        }

        hasAttribute(name) {
            return this._node.hasAttribute(name);
        }

        remove() {
            this._node.remove();
        }

        querySelector(selector) {
            const el = this._node.querySelector(selector);
            return el ? new StrictDOMElement(el) : null;
        }

        querySelectorAll(selector) {
            const nodes = Array.from(this._node.querySelectorAll(selector)).map(n => new StrictDOMElement(n));
            nodes.forEach = Array.prototype.forEach;
            return nodes;
        }

        cloneNode(deep) {
            return new StrictDOMElement(this._node.cloneNode(deep));
        }
    }

    // SessionStorage Shim
    const memoryStore = {};
    window.sessionStorageShim = {
        setItem: (k, v) => memoryStore[k] = v,
        getItem: (k) => memoryStore[k],
        removeItem: (k) => delete memoryStore[k],
        clear: () => { for (const k in memoryStore) delete memoryStore[k]; }
    };

    // DOM Parsing Logic
    function domToDetails(node) {
        let details = [];
        if (!node) return details;
        const getAttr = (n, a) => n.getAttribute && n.getAttribute(a) || "";

        node.childNodes.forEach(child => {
            const nodeType = child.nodeType;
            const nodeName = child.nodeName.toLowerCase();

            if (nodeType === Node.TEXT_NODE) {
                const text = (child.nodeValue || "").trim();
                if (text) details.push({ type: 'text', value: text });
            } else if (nodeType === Node.ELEMENT_NODE) {
                switch (nodeName) {
                    case 'script': case 'style': break;
                    case 'img':
                        const imgSrc = getAttr(child, 'src');
                        if (imgSrc) details.push({ type: 'image', value: imgSrc });
                        break;
                    case 'iframe':
                        const iframeSrc = getAttr(child, 'src');
                        if (iframeSrc) details.push({ type: 'link', value: iframeSrc, link: iframeSrc });
                        break;
                    case 'video':
                        let videoSrc = getAttr(child, 'src');
                        if (!videoSrc) {
                            const source = child.querySelector('source');
                            if (source) videoSrc = getAttr(source, 'src');
                        }
                        if (videoSrc) details.push({ type: 'video', value: videoSrc });
                        break;
                    case 'a':
                        const href = getAttr(child, 'href');
                        if (!href || href.startsWith('javascript:')) {
                            details = details.concat(domToDetails(child));
                            break;
                        }
                        const imgChild = child.querySelector('img');
                        if (imgChild) {
                            const iSrc = getAttr(imgChild, 'src');
                            if (iSrc) { details.push({ type: 'image', value: iSrc, link: href }); break; }
                        }
                        const linkText = child.textContent.trim();
                        if (linkText) {
                            details.push({ type: 'link', value: linkText, link: href });
                        } else {
                            details = details.concat(domToDetails(child));
                        }
                        break;
                    case 'br':
                        break;
                    default:
                        details = details.concat(domToDetails(child));
                }
            }
        });

        // Merge text nodes
        if (details.length > 1) {
            const merged = [];
            let textBuffer = [];
            details.forEach(item => {
                if (item.type === 'text') textBuffer.push(item.value);
                else {
                    if (textBuffer.length) { merged.push({ type: 'text', value: textBuffer.join('\n') }); textBuffer = []; }
                    merged.push(item);
                }
            });
            if (textBuffer.length) merged.push({ type: 'text', value: textBuffer.join('\n') });
            return merged;
        }
        return details;
    }

    // Sync Fetch Polyfill
    window.fetch = (url, options) => {
        console.log(`%c[Synura] FETCH ${url}`, "color: grey", options);

        if (options && options.bypass) {
            console.warn(`%c[Synura] Bypass '${options.bypass}' requested but not supported in polyfill.`, "color: orange");
        }

        const request = new XMLHttpRequest();
        const method = (options && options.method) || 'GET';
        try {
            request.open(method, url, false);
            if (options && options.headers) {
                for (const h in options.headers) request.setRequestHeader(h, options.headers[h]);
            }
            request.send(options ? options.body : null);
        } catch (e) {
            console.error("%c[Synura] Fetch Failed! Likely CORS.", "color: red");
            return { ok: false, status: 0, text: () => "", json: () => ({}), dom: () => new StrictDOMElement(document.createElement('div')) };
        }

        // Mock Response Object
        return {
            status: request.status,
            statusText: request.statusText,
            ok: request.status >= 200 && request.status < 300,
            text: () => request.responseText,
            json: () => JSON.parse(request.responseText),
            dom: (mime) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(request.responseText, mime || 'text/html');
                return new StrictDOMElement(doc);
            }
        };
    };

    console.log("%c[Synura Polyfill] Visual Emulator Ready! Run your extension code.", "color: green; font-weight: bold;");
    // Open logs by default
    toggleLogOverlay();

    // CSP Violation Listener
    document.addEventListener('securitypolicyviolation', (e) => {
        console.error(`%c[Synura] CSP Violation blocked '${e.blockedURI}'`, "color: red; font-weight: bold");
        console.error(`  Violated Directive: ${e.violatedDirective}`);
        console.error(`  Original Policy: ${e.originalPolicy}`);
        // Optional: alert user if it's critical
        // alert(`Synura Polyfill blocked by CSP!\nCannot load: ${e.blockedURI}\nDirective: ${e.violatedDirective}`);
    });

    // Global Error Capture
    window.onerror = function (msg, url, line, col, error) {
        console.error(`%c[Synura] Global Error: ${msg}`, "color: red");
        return false; // Let default handler run too
    };
    window.onunhandledrejection = function (e) {
        console.error(`%c[Synura] Unhandled Rejection: ${e.reason}`, "color: red");
    };
})();