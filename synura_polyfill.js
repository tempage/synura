/**
 * Synura Visual Polyfill - Browser Console Testing
 * See polyfill_guide.md for full documentation.
 * 
 * Index
 * -----
 * 0. SessionStorage .... _sessionStorageShim
 * 1. CSS ............... <style> for emulator UI
 * 2. Log Overlay ....... captureLog, toggleLogOverlay, appendLogEntry
 * 3. UI Manager ........ getHandler, wrapHandlerForDebug, control handlers
 * 4. View System ....... createView, updateAppBar, renderView, triggerEvent
 *    Renderers: renderList, renderPost, renderChat, renderBrowser,
 *               renderForm, renderConfirmation, renderEditor,
 *               renderMarkdown, renderSource
 * 5. Synura API ........ synura.open/update/connect/close/parse
 * 6. Helpers ........... escapeHtml, StrictDOMElement, domToDetails,
 *                        highlightCode, parseMarkdown, fetch polyfill
 */

(function () {
    if (typeof synura !== 'undefined' && window._synuraEmulatorActive) {
        console.log("%c[Synura Polyfill] Already active.", "color: orange");
        return;
    }
    window._synuraEmulatorActive = true;

    console.log("%c[Synura Polyfill] Initializing Visual Emulator...", "color: #00bcd4; font-weight: bold; font-size: 12px;");

    // --- 0. SessionStorage Shim (object storage) ---
    const _sessionMemoryStore = {};
    const _sessionStorageShim = {
        setItem: (k, v) => _sessionMemoryStore[k] = v,
        getItem: (k) => _sessionMemoryStore[k],
        removeItem: (k) => delete _sessionMemoryStore[k],
        clear: () => { for (const k in _sessionMemoryStore) delete _sessionMemoryStore[k]; },
        get length() { return Object.keys(_sessionMemoryStore).length; },
        key: (i) => Object.keys(_sessionMemoryStore)[i]
    };

    // Override sessionStorage
    try {
        Object.defineProperty(window, 'sessionStorage', {
            value: _sessionStorageShim,
            writable: true,
            configurable: true
        });
        console.log("%c[Synura Polyfill] SessionStorage shim active (object storage enabled)", "color: #0f0");
    } catch (e) {
        // Fallback: use global shim
        console.warn("%c[Synura Polyfill] Could not override window.sessionStorage, using global shim", "color: orange");
        window._synuraSessionStorage = _sessionStorageShim;
    }

    // --- 1. CSS Styles ---
    const css = `
        #synura-root {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 375px;
            height: 750px; /* iPhone SE-ish size */
            min-width: 280px;
            min-height: 400px;
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
            resize: both;
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
            cursor: move;
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
            flex-direction: row;
            position: relative;
            border-left: 0 solid transparent;
            border-right: 0 solid transparent;
        }
        .synura-card.gallery-mode {
            flex-direction: column;
        }
        .synura-card img { 
            object-fit: cover; 
            background: #333;
        }
        .synura-card.gallery-mode img {
            width: 100%;
            aspect-ratio: 1;
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
        .synura-chat-list { padding: 16px; display: flex; flex-direction: column; min-height: 100%; }
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
        /* Markdown in chat bubbles */
        .synura-chat-bubble h1, .synura-chat-bubble h2, .synura-chat-bubble h3 { margin: 8px 0 4px 0; font-size: 1.1em; }
        .synura-chat-bubble p { margin: 4px 0; }
        .synura-chat-bubble ul, .synura-chat-bubble ol { margin: 4px 0; padding-left: 1.5em; }
        .synura-chat-bubble li { margin: 2px 0; }
        .synura-chat-bubble code { background: rgba(0,0,0,0.3); padding: 1px 4px; border-radius: 3px; font-size: 0.9em; }
        .synura-chat-bubble pre { background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; margin: 8px 0; overflow-x: auto; }
        .synura-chat-bubble table { border-collapse: collapse; margin: 8px 0; font-size: 0.9em; }
        .synura-chat-bubble th, .synura-chat-bubble td { border: 1px solid rgba(255,255,255,0.2); padding: 4px 8px; }
        .synura-chat-bubble th { background: rgba(0,0,0,0.3); }
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
            <div style="display:flex; flex-direction:column;">
                <span id="synura-title">Synura Emulator</span>
                <label title="Enable debugger breakpoints" style="cursor:pointer; display:flex; align-items:center; font-size:12px; color:#aaa; margin-top:4px;"><input type="checkbox" id="synura-debug-toggle" style="margin-right:6px; width:14px; height:14px;">Debug Mode</label>
            </div>
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

    // Drag functionality for main window
    const mainHeader = document.getElementById('synura-header');
    let isRootDragging = false;
    let rootStartX, rootStartY, rootInitialLeft, rootInitialTop;

    mainHeader.onmousedown = (e) => {
        // Don't drag if clicking on buttons or input
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return;
        isRootDragging = true;
        rootStartX = e.clientX;
        rootStartY = e.clientY;
        // Get current position (handle 'right' positioning)
        const rect = root.getBoundingClientRect();
        rootInitialLeft = rect.left;
        rootInitialTop = rect.top;
        // Switch from right to left positioning
        root.style.right = 'auto';
        root.style.left = rootInitialLeft + 'px';
        root.style.top = rootInitialTop + 'px';

        document.onmousemove = (e) => {
            if (!isRootDragging) return;
            const dx = e.clientX - rootStartX;
            const dy = e.clientY - rootStartY;
            root.style.left = (rootInitialLeft + dx) + 'px';
            root.style.top = (rootInitialTop + dy) + 'px';
        };
        document.onmouseup = () => {
            isRootDragging = false;
            document.onmousemove = null;
        };
    };

    document.getElementById('synura-reload').onclick = () => {
        // Clear global SYNURA
        let cleared = false;
        try {
            delete window.SYNURA;
            if (typeof window.SYNURA !== 'undefined') window.SYNURA = undefined;
            if (typeof SYNURA === 'undefined') cleared = true;
        } catch (e) { }

        // Clear views
        const viewStack = document.getElementById('synura-view-stack');
        if (viewStack) viewStack.innerHTML = '';
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
    let _handlerWrapped = false;
    function getHandler() {
        if (typeof SYNURA !== 'undefined' && SYNURA.main) {
            // Wrap handler methods for debug mode (once)
            if (!_handlerWrapped) {
                wrapHandlerForDebug(SYNURA.main);
                _handlerWrapped = true;
            }
            return SYNURA.main;
        }
        return null;
    }

    // --- Debug Mode Helper ---
    function isDebugEnabled() {
        return document.getElementById('synura-debug-toggle')?.checked || false;
    }

    // --- Wrap handler methods with debugger ---
    function wrapHandlerForDebug(handler) {
        const methodsToWrap = ['router', 'home', 'resume', 'deeplink', 'onViewEvent'];
        methodsToWrap.forEach(methodName => {
            if (typeof handler[methodName] === 'function') {
                const original = handler[methodName];
                handler[methodName] = function (...args) {
                    if (isDebugEnabled()) {
                        console.log(`%c[Synura Debug] Breaking on ${methodName}()`, "color: #f0f; font-weight: bold");
                        debugger;
                    }
                    // SWAP FETCH: Temporarily enforce Synura sync fetch for the global scope
                    // This allows code pasted in console (global scope) to use the correct fetch
                    const nativeFetch = window.fetch;
                    window.fetch = window.synura.fetch;

                    try {
                        return original.apply(this, args);
                    } finally {
                        // RESTORE FETCH
                        window.fetch = nativeFetch;
                    }
                };
                console.log(`%c[Synura] Wrapped handler.${methodName}() for debugging & fetch-swapping`, "color: #888");
            }
        });
    }

    // --- Auto-detect and wrap SYNURA.main when extension loads ---
    let _wrapAttempts = 0;
    const _wrapInterval = setInterval(() => {
        _wrapAttempts++;
        const hasSYNURA = typeof SYNURA !== 'undefined';
        const hasMain = hasSYNURA && SYNURA.main;

        if (_wrapAttempts <= 3) {
            console.log(`%c[Synura] Detection attempt ${_wrapAttempts}: SYNURA=${hasSYNURA}, main=${!!hasMain}, wrapped=${_handlerWrapped}`, "color: #888");
        }

        if (hasMain && !_handlerWrapped) {
            wrapHandlerForDebug(SYNURA.main);
            _handlerWrapped = true;
            console.log("%c[Synura] Handler detected and wrapped for debugging", "color: #0f0; font-weight: bold");
            clearInterval(_wrapInterval);
        }

        // Stop after 30 seconds
        if (_wrapAttempts > 300) {
            console.warn("[Synura] Gave up waiting for SYNURA.main");
            clearInterval(_wrapInterval);
        }
    }, 100);

    // --- New Control Handlers ---
    document.getElementById('synura-home').onclick = () => {
        const h = getHandler();
        if (h && h.home) {
            console.log("%c[Synura] Calling handler.home()", "color: cyan");
            if (isDebugEnabled()) debugger;
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
                if (isDebugEnabled()) debugger;
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
            // Open view with captured data
            const result = synura.open({
                view: _capturedBookmark.path,
                models: _capturedBookmark.models,
                styles: _capturedBookmark.styles
            }, _capturedBookmark.context);

            if (result.success) {
                const h = getHandler();
                if (h && h.resume) {
                    console.log(`%c[Synura] Calling handler.resume(${result.viewId}, context)`, "color: cyan");
                    if (isDebugEnabled()) debugger;
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

        // Query appbar support
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

        // Back button logic
        const existingBack = appbar.querySelector('.back-btn');
        let hasBack = existingBack !== null;
        if (appbar.innerHTML === '' && Object.keys(views).length > 1) hasBack = true;
        let inner = '';
        if (hasBack) inner += `<span class="back-btn">←</span>`;
        if (isQuery) {
            inner += `<input type="text" class="synura-appbar-query" placeholder="${escapeHtml(queryHint || queryLabel)}" value="${view._queryValue || ''}" style="flex:1; min-width:0; background:#333; border:none; padding:8px 12px; color:#fff; border-radius:4px; margin:0 12px; font-size:14px; outline:none;">`;
        } else {
            inner += `<span class="title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(titleText)}</span>`;
        }
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

            // Build full event data including appbar style configuration
            const buildQueryEventData = (queryValue) => {
                const eventData = { query: queryValue };
                // Include all appbar style data if it's an object
                if (typeof appbarStyle === 'object' && appbarStyle !== null) {
                    for (const [key, value] of Object.entries(appbarStyle)) {
                        if (value !== null && value !== undefined) {
                            eventData[key] = value;
                        }
                    }
                }
                return eventData;
            };

            input.onkeypress = (e) => { if (e.key === 'Enter') triggerEvent(view, 'QUERY', buildQueryEventData(input.value)); };
            const sBtn = appbar.querySelector('.search-btn');
            if (sBtn) sBtn.onclick = () => triggerEvent(view, 'QUERY', buildQueryEventData(input.value));
        }

        const mBtn = appbar.querySelector('.menu-btn');
        if (mBtn) {
            mBtn.onclick = () => {
                const menus = (data.models?.menus?.details || []).map(m => {
                    if (typeof m === 'string') {
                        try {
                            const parsed = JSON.parse(m);
                            // Return as object with label and checked
                            if (typeof parsed === 'object' && parsed !== null) {
                                return { label: parsed.label || String(parsed), checked: parsed.checked || false };
                            }
                            return { label: String(parsed), checked: false };
                        } catch (e) { return { label: m, checked: false }; }
                    }
                    if (typeof m === 'object' && m !== null) {
                        return { label: m.label || m.value || String(m), checked: m.checked || false };
                    }
                    return { label: String(m), checked: false };
                });

                if (menus.length > 0) {
                    console.log("%c[Synura] Available Menus:", "color: cyan", menus);
                    showSelectionDialog("Select Menu Action", menus, (choice) => {
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
        } else if (path === '/dialogs/confirmation') {
            renderConfirmation(contentEl, data.styles, view);
        } else if (path === '/views/editor') {
            renderEditor(contentEl, models, data.styles, view);
        } else if (path === '/views/markdown') {
            renderMarkdown(contentEl, models, data.styles, view);
        } else if (path === '/views/source') {
            renderSource(contentEl, models, data.styles, view);
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
        const categoryClickable = styles?.categoryClickable === true || String(styles?.categoryClickable) === 'true';
        const hasMedia = styles?.media === true || String(styles?.media) === 'true';
        const isReorderable = styles?.reorderable === true || String(styles?.reorderable) === 'true';

        const hotThreshold = styles?.hotThreshold;
        const coldThreshold = styles?.coldThreshold;

        const listContainer = document.createElement('div');
        if (layout === 'card' || layout === 'gallery') {
            listContainer.className = 'synura-card-grid';
            if (layout === 'gallery') {
                let colCount = 1; // default
                if (styles?.columnCount) {
                    colCount = parseInt(styles.columnCount, 10) || 1;
                }

                // Adaptive columns based on container aspect ratio (mimic Flutter logic)
                // We use the root container or window to determine "orientation"
                const root = document.getElementById('synura-root');
                if (root) {
                    const width = root.clientWidth;
                    const height = root.clientHeight;
                    // If width > height, we are in "landscape"
                    if (width > height) {
                        colCount = Math.min(Math.round(colCount * (width / height)), colCount * 3);
                        colCount = Math.max(colCount, parseInt(styles?.columnCount || 1, 10)); // Clamp low
                    }
                }

                listContainer.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
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
            let badgesHtml = '';
            if (item.category) {
                badgesHtml += `<span class="synura-badge synura-badge-category">${escapeHtml(item.category)}</span> `;
            }
            if (item.types && Array.isArray(item.types)) {
                badgesHtml += item.types.map(b => `<span class="synura-badge">${escapeHtml(b)}</span>`).join(' ');
            }

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
                if (layout === 'gallery') el.classList.add('gallery-mode');

                el.style.borderLeft = borderLeft;
                el.style.borderRight = borderRight;

                // Item Menu
                let menuHtml = '';
                if (item.menus && item.menus.length > 0) {
                    menuHtml = `<div class="synura-card-menu-btn">⋮</div>`;
                }

                // Media Logic
                let mediaSource = item.thumbnail || item.mediaUrl;
                let mediaOverlay = '';

                if (item.mediaType === 'video') {
                    mediaOverlay = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px;color:rgba(255,255,255,0.8);">▶</div>`;
                }

                let mediaHtml = '';
                if (hasMedia && mediaSource) {
                    if (layout === 'gallery') {
                        mediaHtml = `<div style="position:relative;width:100%;aspect-ratio:1;">${renderImageOrEmoji(mediaSource, '', 'width:100%; height:100%; object-fit:cover;')}${mediaOverlay}</div>`;
                    } else {
                        // Card Layout: Fixed width 120px, 16/9
                        mediaHtml = `<div style="position:relative;width:120px;aspect-ratio:16/9;flex-shrink:0;">${renderImageOrEmoji(mediaSource, '', 'width:100%; height:100%; object-fit:cover;')}${mediaOverlay}</div>`;
                    }
                }

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
                                triggerEvent(view, 'ITEM_MENU_CLICK', { menu: choice, ...item });
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

            // Category Click
            if (categoryClickable && item.category) {
                const catBadge = el.querySelector('.synura-badge-category');
                if (catBadge) {
                    catBadge.style.cursor = 'pointer';
                    catBadge.style.textDecoration = 'underline';
                    catBadge.onclick = (e) => {
                        e.stopPropagation();
                        triggerEvent(view, 'CATEGORY_CLICK', { link: item.link, category: item.category });
                    };
                }
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
        const category = models.category?.message || '';
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

        let categoryHtml = '';
        if (category) {
            categoryHtml = `<span class="synura-badge synura-badge-category" style="margin-right:8px; vertical-align:middle; align-self:center;">${escapeHtml(category)}</span>`;
        }

        header.innerHTML = `
            <div style="display:flex; margin-bottom:12px">
                ${categoryHtml}
                <div class="synura-post-title" style="margin-bottom:0; flex:1">${escapeHtml(title)}</div>
            </div>
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

        if (styles?.categoryClickable === true || String(styles?.categoryClickable) === 'true') {
            const catBadge = header.querySelector('.synura-badge-category');
            if (catBadge) {
                catBadge.style.cursor = 'pointer';
                catBadge.style.textDecoration = 'underline';
                catBadge.onclick = () => triggerEvent(view, 'CATEGORY_CLICK', { category, link: models.link?.message });
            }
        }

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

        // Content blocks
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
                // Hot/Cold borders
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
                        ${c.menus && c.menus.length > 0 ? `<span class="synura-comment-menu-btn" style="margin-left:auto; cursor:pointer; padding:0 4px;">⋮</span>` : ''}
                    </div>
                    <div class="synura-comment-content">${contentHtml}</div>
                `;

                // Comment menu click handler
                if (c.menus && c.menus.length > 0) {
                    const menuBtn = el.querySelector('.synura-comment-menu-btn');
                    if (menuBtn) {
                        menuBtn.onclick = (e) => {
                            e.stopPropagation();
                            showSelectionDialog("Select Action", c.menus, (choice) => {
                                // Pass entire comment data with menu selection
                                triggerEvent(view, 'ITEM_MENU_CLICK', { menu: choice, ...c });
                            });
                        };
                    }
                }

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

        // Messages in order: oldest first, newest last at bottom
        msgs.forEach(msg => {
            const isMe = msg.user === 'Me';
            const isMarkdown = msg.format === 'markdown' || msg.format === 'md';
            const el = document.createElement('div');
            el.className = `synura-chat-msg ${isMe ? 'me' : 'other'}`;

            const messageContent = isMarkdown
                ? parseMarkdown(msg.message)
                : escapeHtml(msg.message);

            el.innerHTML = `
                ${!isMe ? `<div class="synura-chat-user">${escapeHtml(msg.user || 'Other')}</div>` : ''}
                <div class="synura-chat-bubble">${messageContent}</div>
            `;

            // Handle links in chat bubbles (for markdown messages)
            if (isMarkdown) {
                const links = el.querySelectorAll('a');
                links.forEach(a => {
                    const href = a.getAttribute('href');
                    if (href) {
                        a.onclick = (e) => {
                            e.preventDefault();
                            triggerEvent(view, 'CLICK', { link: href });
                        };
                    }
                });
            }

            list.appendChild(el);
        });

        container.appendChild(list);

        // Scroll to bottom
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);

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
                // Add user message first
                const echoMsg = { user: 'Me', message: input.value };
                if (!view.data.models.append) view.data.models.append = { details: [] };
                view.data.models.append.details.push(echoMsg);
                const msg = input.value;
                input.value = '';
                // Then trigger event for extension to respond
                triggerEvent(view, 'SUBMIT', { message: msg });
                renderView(view);
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
        const styles = view.data.styles;
        const message = styles?.message || '';

        const formContainer = document.createElement('div');
        formContainer.style.padding = '16px';

        // Show message if provided
        if (message) {
            const msgEl = document.createElement('p');
            msgEl.style.marginBottom = '16px';
            msgEl.style.color = '#ccc';
            msgEl.innerText = message;
            formContainer.appendChild(msgEl);
        }

        inputs.forEach(input => {
            // Input might be JSON string
            if (typeof input === 'string') try { input = JSON.parse(input); } catch (e) { }

            const group = document.createElement('div');
            group.className = 'synura-input-group';

            const label = document.createElement('label');
            label.className = 'synura-input-label';
            label.innerText = input.label || input.name;
            group.appendChild(label);

            let field;
            const lines = input.lines;

            if (lines && lines > 1 && (input.type === 'string' || input.type === 'text')) {
                // Multi-line textarea
                field = document.createElement('textarea');
                field.className = 'synura-input-field';
                field.rows = lines;
                field.style.resize = 'vertical';
                if (input.value) field.value = input.value;
            } else if (input.type === 'boolean') {
                // Boolean switch (simplified as checkbox for polyfill)
                field = document.createElement('input');
                field.type = 'checkbox';
                field.checked = input.value || false;
                formValues[input.name] = input.value || false;
                field.onchange = (e) => formValues[input.name] = e.target.checked;
                group.appendChild(field);
                formContainer.appendChild(group);
                return;
            } else if (input.type === 'select') {
                // Dropdown select
                const options = input.options || [];
                field = document.createElement('select');
                field.className = 'synura-input-field';
                options.forEach(opt => {
                    const optEl = document.createElement('option');
                    optEl.value = opt;
                    optEl.innerText = opt;
                    if (input.value === opt) optEl.selected = true;
                    field.appendChild(optEl);
                });
                formValues[input.name] = input.value || (options.length > 0 ? options[0] : '');
                field.onchange = (e) => formValues[input.name] = e.target.value;
            } else {
                // Standard input
                field = document.createElement('input');
                field.className = 'synura-input-field';
                field.type = input.type === 'number' ? 'number' : (input.format === 'password' ? 'password' : 'text');
                if (input.value) field.value = input.value;
            }

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

    function renderConfirmation(container, styles, view) {
        const title = styles?.title || 'Confirmation';
        const message = styles?.message || '';
        const showClose = styles?.close === true || String(styles?.close) === 'true';
        const models = view.data.models;
        const buttons = (models?.buttons?.details || []).map(b => typeof b === 'string' ? b : (b.value || b));

        const wrapper = document.createElement('div');
        wrapper.style.padding = '24px';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.height = '100%';
        wrapper.style.textAlign = 'center';

        const titleEl = document.createElement('h3');
        titleEl.style.marginBottom = '16px';
        titleEl.style.color = '#fff';
        titleEl.innerText = title;
        wrapper.appendChild(titleEl);

        // Show message
        if (message) {
            const msgEl = document.createElement('p');
            msgEl.style.marginBottom = '24px';
            msgEl.style.color = '#ccc';
            msgEl.style.whiteSpace = 'pre-wrap';
            msgEl.innerText = message;
            wrapper.appendChild(msgEl);
        }

        // Buttons container
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '12px';

        if (buttons.length > 0) {
            buttons.forEach(btnText => {
                const btn = document.createElement('button');
                btn.className = 'synura-btn';
                btn.innerText = btnText;
                btn.style.minWidth = '80px';
                btn.onclick = () => triggerEvent(view, 'SUBMIT', { button: btnText });
                btnContainer.appendChild(btn);
            });
        } else {
            const okBtn = document.createElement('button');
            okBtn.className = 'synura-btn';
            okBtn.innerText = 'OK';
            okBtn.style.minWidth = '100px';
            okBtn.onclick = () => triggerEvent(view, 'SUBMIT', {});
            btnContainer.appendChild(okBtn);
        }

        if (showClose) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'synura-btn';
            closeBtn.innerText = 'Close';
            closeBtn.style.minWidth = '80px';
            closeBtn.style.background = '#333';
            closeBtn.onclick = () => {
                triggerEvent(view, 'CLOSE', {});
                window.synura.close(view.id);
            };
            btnContainer.appendChild(closeBtn);
        }

        wrapper.appendChild(btnContainer);
        container.appendChild(wrapper);
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

        // Handle anchor scrolling
        const anchor = models.anchor?.message || models.anchor;
        if (anchor) {
            setTimeout(() => {
                const target = wrapper.querySelector(`#${anchor}`);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.warn(`[Synura] Anchor '#${anchor}' not found in document.`);
                }
            }, 100);
        }
    }

    function renderSource(container, models, styles, view) {
        const title = styles?.title || 'Source';
        const language = styles?.language || '';
        const lineNumbers = styles?.lineNumbers !== false && String(styles?.lineNumbers) !== 'false';
        const wordWrap = styles?.wordWrap === true || String(styles?.wordWrap) === 'true';
        const content = models.content?.message || '';

        // Detect language if not specified
        let effectiveLanguage = language.toLowerCase() || 'plaintext';

        // Create wrapper with styling
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.height = '100%';
        wrapper.style.overflow = 'hidden';

        // Add copy button to appbar actions
        const appbar = view.el.querySelector('.synura-appbar');
        if (appbar) {
            let actionsDiv = appbar.querySelector('.actions');
            if (!actionsDiv) {
                actionsDiv = document.createElement('div');
                actionsDiv.className = 'actions';
                actionsDiv.style.marginLeft = 'auto';
                appbar.appendChild(actionsDiv);
            }

            const copyAction = document.createElement('span');
            copyAction.className = 'action-icon';
            copyAction.innerText = '📋';
            copyAction.title = 'Copy to clipboard';
            copyAction.onclick = () => {
                navigator.clipboard.writeText(content).then(() => {
                    console.log('%c[Synura] Copied to clipboard', 'color: green');
                    copyAction.innerText = '✓';
                    setTimeout(() => { copyAction.innerText = '📋'; }, 1500);
                }).catch(err => {
                    console.error('%c[Synura] Failed to copy:', 'color: red', err);
                });
            };
            actionsDiv.appendChild(copyAction);
        }

        if (!content) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.display = 'flex';
            emptyMsg.style.alignItems = 'center';
            emptyMsg.style.justifyContent = 'center';
            emptyMsg.style.height = '100%';
            emptyMsg.style.color = '#888';
            emptyMsg.innerText = 'No content';
            wrapper.appendChild(emptyMsg);
            container.appendChild(wrapper);
            return;
        }

        const lines = content.split('\n');
        const lineCount = lines.length;
        const lineNumberWidth = Math.max(String(lineCount).length * 10 + 16, 36);

        const scrollContainer = document.createElement('div');
        scrollContainer.style.flex = '1';
        scrollContainer.style.overflowY = 'auto';
        scrollContainer.style.overflowX = wordWrap ? 'hidden' : 'auto';

        const innerContainer = document.createElement('div');
        innerContainer.style.display = 'flex';
        innerContainer.style.minWidth = 'fit-content';

        if (lineNumbers) {
            const lineNumbersCol = document.createElement('div');
            lineNumbersCol.style.width = lineNumberWidth + 'px';
            lineNumbersCol.style.flexShrink = '0';
            lineNumbersCol.style.padding = '8px 8px 8px 8px';
            lineNumbersCol.style.borderRight = '1px solid rgba(255,255,255,0.2)';
            lineNumbersCol.style.fontFamily = 'monospace';
            lineNumbersCol.style.fontSize = '14px';
            lineNumbersCol.style.lineHeight = '1.5';
            lineNumbersCol.style.color = 'rgba(255,255,255,0.5)';
            lineNumbersCol.style.textAlign = 'right';
            lineNumbersCol.style.userSelect = 'none';

            for (let i = 1; i <= lineCount; i++) {
                const lineNumEl = document.createElement('div');
                lineNumEl.innerText = String(i);
                lineNumbersCol.appendChild(lineNumEl);
            }
            innerContainer.appendChild(lineNumbersCol);
        }

        // Code content column
        const codeCol = document.createElement('div');
        codeCol.style.flex = '1';
        codeCol.style.padding = lineNumbers ? '8px 16px 8px 8px' : '8px 16px';
        codeCol.style.fontFamily = 'monospace';
        codeCol.style.fontSize = '14px';
        codeCol.style.lineHeight = '1.5';
        codeCol.style.whiteSpace = wordWrap ? 'pre-wrap' : 'pre';
        codeCol.style.wordBreak = wordWrap ? 'break-word' : 'normal';
        codeCol.style.color = '#e0e0e0';

        // Apply syntax highlighting
        const highlightedCode = highlightCode(content, effectiveLanguage);
        codeCol.innerHTML = highlightedCode;

        innerContainer.appendChild(codeCol);
        scrollContainer.appendChild(innerContainer);
        wrapper.appendChild(scrollContainer);
        container.appendChild(wrapper);

        // Add CSS for source view
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
            .synura-source-view pre {
                margin: 0;
                background: transparent;
            }
            .synura-source-view code {
                background: transparent;
                padding: 0;
            }
        `;
        container.appendChild(styleEl);
    }

    function highlightCode(code, lang) {
        if (!lang) return escapeHtml(code);
        const l = lang.toLowerCase();

        // Escape HTML entities first for non-HTML languages
        const isHtmlLang = l === 'html' || l === 'xml' || l === 'xhtml' || l === 'svg';
        const escaped = isHtmlLang ? code : escapeHtml(code);

        if (l === 'js' || l === 'javascript') {
            return escaped.replace(
                /(\/\/.*$|\/\*[\s\S]*?\*\/)|(&quot;(?:\\.|[^\\])*?&quot;|&#039;(?:\\.|[^\\])*?&#039;|`(?:\\.|[^\\])*?`)|(&amp;[a-zA-Z]+;|\b(?:const|let|var|function|return|if|else|for|while|class|new|this|import|export|async|await|try|catch|console|window|document)\b)|(=&gt;)|(\b\d+\b)/gm,
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
            return escaped.replace(
                /(#.*$)|(&quot;(?:\\.|[^\\])*?&quot;|&#039;(?:\\.|[^\\])*?&#039;)|(\b(?:def|class|if|else|elif|return|import|from|print|None|True|False|for|while|in|and|or|not|try|except|finally|with|as|pass|lambda|yield|global|nonlocal|assert|del|break|continue|raise)\b)|(\b\d+\b)/gm,
                (match, comment, string, keyword, number) => {
                    if (comment) return `<span style="color:#6a9955">${comment}</span>`;
                    if (string) return `<span style="color:#ce9178">${string}</span>`;
                    if (keyword) return `<span style="color:#c586c0">${keyword}</span>`; // Purple for Python keywords
                    if (number) return `<span style="color:#b5cea8">${number}</span>`;
                    return match;
                }
            );
        } else if (isHtmlLang) {
            // HTML/XML highlighting - escape first then highlight
            return escapeHtml(code).replace(
                /(&lt;!--[\s\S]*?--&gt;)|(&lt;!DOCTYPE[^&]*&gt;)|(&lt;\/?)([\w:-]+)((?:\s+[\w:-]+(?:=(?:&quot;[^&]*&quot;|&#039;[^&]*&#039;|[^\s&gt;]+))?)*\s*)(\/?&gt;)|(&quot;[^&]*&quot;|&#039;[^&]*&#039;)/gm,
                (match, comment, doctype, openBracket, tagName, attrs, closeBracket, attrValue) => {
                    if (comment) return `<span style="color:#6a9955">${comment}</span>`;
                    if (doctype) return `<span style="color:#808080">${doctype}</span>`;
                    if (tagName) {
                        // Highlight tag and attributes
                        let highlightedAttrs = attrs || '';
                        if (highlightedAttrs) {
                            // Highlight attribute names and values
                            highlightedAttrs = highlightedAttrs.replace(
                                /([\w:-]+)(=)(&quot;[^&]*&quot;|&#039;[^&]*&#039;|[^\s&gt;]+)?/g,
                                (m, name, eq, val) => {
                                    const valHighlight = val ? `<span style="color:#ce9178">${val}</span>` : '';
                                    return `<span style="color:#9cdcfe">${name}</span>${eq}${valHighlight}`;
                                }
                            );
                        }
                        return `<span style="color:#808080">${openBracket}</span><span style="color:#569cd6">${tagName}</span>${highlightedAttrs}<span style="color:#808080">${closeBracket}</span>`;
                    }
                    if (attrValue) return `<span style="color:#ce9178">${attrValue}</span>`;
                    return match;
                }
            );
        }
        return escaped;
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

        // Headers - add IDs for anchor navigation
        const generateId = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        html = html.replace(/^# (.*$)/gm, (match, p1) => `<h1 id="${generateId(p1)}">${p1}</h1>`);
        html = html.replace(/^## (.*$)/gm, (match, p1) => `<h2 id="${generateId(p1)}">${p1}</h2>`);
        html = html.replace(/^### (.*$)/gm, (match, p1) => `<h3 id="${generateId(p1)}">${p1}</h3>`);
        html = html.replace(/^#### (.*$)/gm, (match, p1) => `<h4 id="${generateId(p1)}">${p1}</h4>`);

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
        // Unordered lists
        html = html.replace(/^\s*[\-\*] (.*)/gm, '<li class="md-li">$1</li>');

        // Wrap lis in ul
        html = html.replace(/(<li class="md-li">.*<\/li>)/g, '<ul>$1</ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        // Newlines
        html = html.replace(/\n\n/g, '<p></p>');
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
        open: (options, context, callback) => {
            if (!options || typeof options !== 'object') {
                console.error("%c[Synura] Error: first argument must be an object { view: '...' }", "color: red");
                return { success: false, error: "Invalid argument" };
            }

            const viewPath = options.view || options.viewName;
            if (!viewPath) {
                console.error("%c[Synura] Error: options.view is required", "color: red");
                return { success: false, error: "view is required" };
            }

            let data = options;
            if (data.models) {
                data.models = processModels(data.models);
            }

            // Handle optional callback
            if (typeof context === 'function') {
                callback = context;
                context = undefined;
            }

            const viewId = _viewIdCounter++;
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
                if (data.models) {
                    data.models = processModels(data.models);
                }

                console.groupCollapsed(`%c[Synura] UPDATE View ${viewId}`, "color: blue");
                console.log("Diff:", data);
                console.groupEnd();

                // Merge styles
                if (data.styles) {
                    if (!view.data.styles) view.data.styles = {};
                    Object.assign(view.data.styles, data.styles);
                }

                if (data.models) {
                    if (!view.data.models) view.data.models = {};

                    // Handle 'append' for lists/chats
                    if (data.models.append) {
                        if (view.path === '/views/chat') {
                            if (!view.data.models.append) view.data.models.append = { details: [] };
                            const newDetails = data.models.append.details || [];
                            view.data.models.append.details.push(...newDetails);
                        } else if (view.path === '/views/list') {
                            if (!view.data.models.contents) view.data.models.contents = { details: [] };
                            const newDetails = data.models.append.details || [];
                            view.data.models.contents.details.push(...newDetails);
                        }
                    }
                    for (const key in data.models) {
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
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.gap = '8px';

            // Support both string and object options
            const isObject = typeof opt === 'object' && opt !== null;
            const label = isObject ? (opt.label || String(opt)) : String(opt);
            const checked = isObject ? opt.checked : false;

            if (checked) {
                const checkIcon = document.createElement('span');
                checkIcon.innerText = '✓';
                checkIcon.style.color = '#0e639c';
                checkIcon.style.fontWeight = 'bold';
                btn.appendChild(checkIcon);
            }

            const labelSpan = document.createElement('span');
            labelSpan.innerText = label;
            btn.appendChild(labelSpan);

            btn.onclick = () => {
                overlay.remove();
                callback(label);
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

    // Fetch polyfill
    window.synura.fetch = (url, options) => {
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

    // CSP listener
    document.addEventListener('securitypolicyviolation', (e) => {
        console.error(`%c[Synura] CSP Violation blocked '${e.blockedURI}'`, "color: red; font-weight: bold");
        console.error(`  Violated Directive: ${e.violatedDirective}`);
    });

    // Error handlers
    window.onerror = function (msg, url, line, col, error) {
        console.error(`%c[Synura] Global Error: ${msg}`, "color: red");
        return false;
    };
    window.onunhandledrejection = function (e) {
        console.error(`%c[Synura] Unhandled Rejection: ${e.reason}`, "color: red");
    };
})();