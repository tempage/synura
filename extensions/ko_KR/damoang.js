// =============================================================================
// test_damoang.js - Synura Extension for damoang.net
// =============================================================================
//
// Sections:
//   1. Package Definition & Constants
//   2. Board Data
//   3. Cache Helpers
//   4. Board Helpers
//   5. Utility Functions
//   6. Core Fetch Functions
//   7. View Openers
//   8. Event Handlers
//   9. CLI Implementation
//  10. Router & Handler Export
//
// =============================================================================

// =============================================================================
// 1. PACKAGE DEFINITION & CONSTANTS
// =============================================================================

var SYNURA = {
    domain: "damoang.net",
    name: "test_damoang",
    description: "Unofficial example extension for educational purposes.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    get main() { return handler; }
}


// =============================================================================
// 2. BOARD DATA
// =============================================================================

var boards = [
    { id: "fire", title: "불타는앙" },
    { id: "free", title: "자유게시판" },
    { id: "new", title: "새로운 소식" },
    { id: "economy", title: "알뜰구매" },
    { id: "lecture", title: "강좌/팁" },
    { id: "tutorial", title: "사용기" },
    { id: "pds", title: "자료실" },
    { id: "laboratory", title: "낙서/연습장" },
    { id: "promotion", title: "직접홍보" },
    { id: "qa", title: "질문과 답변" },
    { id: "gallery", title: "갤러리" },
    { id: "giving", title: "나눔" },
    { id: "trade", title: "중고장터" },
    { id: "ai", title: "AI당" },
    { id: "git", title: "GIT당" },
    { id: "lol", title: "LOL당" },
    { id: "nba", title: "NBA" },
    { id: "ott", title: "OTT당" },
    { id: "vr", title: "VR당" },
    { id: "youtube", title: "Youtube당" },
    { id: "cryptocurrency", title: "가상화폐당" },
    { id: "development", title: "개발한당" },
    { id: "game", title: "게임한당" },
    { id: "seniorcenter", title: "경로당" },
    { id: "golf", title: "골프당" },
    { id: "study", title: "공부한당" },
    { id: "car", title: "굴러간당" },
    { id: "drawing", title: "그림그린당" },
    { id: "writing", title: "글쓴당" },
    { id: "nas", title: "나스당" },
    { id: "fishing", title: "낚시당" },
    { id: "fly", title: "날아간당" },
    { id: "cat", title: "냐옹이당" },
    { id: "paddle", title: "노젓는당" },
    { id: "recording", title: "녹음한당" },
    { id: "coffee", title: "다바앙" },
    { id: "running", title: "달린당" },
    { id: "daegu", title: "대구당" },
    { id: "dongsup", title: "동숲한당" },
    { id: "drone", title: "드론당" },
    { id: "listening", title: "듣는당" },
    { id: "hike", title: "등산한당" },
    { id: "diablo", title: "디아블로당" },
    { id: "gym", title: "땀흘린당" },
    { id: "lego", title: "레고당" },
    { id: "linux", title: "리눅서당" },
    { id: "comic", title: "만화본당" },
    { id: "macmoang", title: "맥모앙" },
    { id: "military", title: "밀리터리당" },
    { id: "overseas", title: "바다건너당" },
    { id: "bts", title: "방탄소년당" },
    { id: "boardgame", title: "보드게임당" },
    { id: "see", title: "보러간당" },
    { id: "volunteer", title: "봉사앙" },
    { id: "beer", title: "비어있당" },
    { id: "bread", title: "빵친당" },
    { id: "business", title: "사장한당" },
    { id: "server", title: "서버당" },
    { id: "MSSurface", title: "서피스당" },
    { id: "socialgame", title: "소셜게임한당" },
    { id: "watches", title: "시계당" },
    { id: "instrument", title: "악기당" },
    { id: "android", title: "안드로메당" },
    { id: "applemoang", title: "애플모앙" },
    { id: "baseball", title: "야구당" },
    { id: "travel", title: "여행한당" },
    { id: "movie", title: "영화본당" },
    { id: "obsidang", title: "옵시디안당" },
    { id: "wow", title: "와우한당" },
    { id: "wine", title: "와인마신당" },
    { id: "cooking", title: "요리당" },
    { id: "space", title: "우주본당" },
    { id: "whiskey", title: "위스키당" },
    { id: "parenting", title: "육아당" },
    { id: "mbike", title: "이륜차당" },
    { id: "japanlive", title: "일본산당" },
    { id: "bicycle", title: "자전거당" },
    { id: "scuba", title: "잠수한당" },
    { id: "sewing", title: "재봉한당" },
    { id: "ebook", title: "전자책이당" },
    { id: "stock", title: "주식한당" },
    { id: "watchingyou", title: "지켜본당" },
    { id: "interior", title: "집꾸민당" },
    { id: "homebuilding", title: "집짓는당" },
    { id: "photo", title: "찰칵찍당" },
    { id: "readingbooks", title: "책읽는당" },
    { id: "train", title: "철도당" },
    { id: "soccer", title: "축구한당" },
    { id: "compliment", title: "칭차앙" },
    { id: "camping", title: "캠핑간당" },
    { id: "console", title: "콘솔한당" },
    { id: "keyboard", title: "키보드당" },
    { id: "tabletennis", title: "탁구당" },
    { id: "pathofexile", title: "패스오브엑자일당" },
    { id: "formula", title: "포뮬러당" },
    { id: "photoshop", title: "포토샵당" },
    { id: "swim", title: "퐁당퐁당" },
    { id: "plant", title: "푸르르당" },
    { id: "plasticmodel", title: "플라스틱모델앙" },
    { id: "playmobil", title: "플레이모빌당" },
    { id: "stationery", title: "필기도구당" },
    { id: "hardware", title: "하드웨어앙" }
];

var STORAGE_KEY = "visible_boards";
var ORDER_KEY = "board_order";
var CUSTOM_BOARDS_KEY = "custom_boards";
var COOKIE_KEY = "user_cookie";
var CACHE_TTL_KEY = "cache_ttl";
var CACHE_SNACKBAR_KEY = "cache_snackbar";

// =============================================================================
// 3. CACHE HELPERS
// =============================================================================

var DEFAULT_CACHE_TTL = 600000; // 10 minutes

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
    if (m > 0) return `${m}분 ${sec}초`;
    return `${sec}초`;
};

var showCacheSnackbar = (viewId, routeData) => {
    if (!getShowCacheSnackbar()) return;

    const age = Date.now() - routeData.timestamp;
    const ttl = getCacheTTL();
    const remaining = ttl - age;
    const msg = `${formatDuration(age)} 전 캐시됨, ${formatDuration(remaining)} 남음.`;
    synura.update(viewId, { models: { snackbar: msg } });
};

var getCachedRoute = (url) => {
    const cached = sessionStorage.getItem(url);
    if (!cached) return null;

    const ttl = getCacheTTL();
    const age = Date.now() - cached.timestamp;
    if (age < ttl) {
        const remaining = (ttl - age) / 1000;
        console.log(`Cache HIT (Valid, ${(age / 1000).toFixed(1)}s old, ${remaining.toFixed(1)}s left)`);
        return cached;
    }
    console.log(`Cache HIT (Expired, ${(age / 1000).toFixed(1)}s old)`);
    sessionStorage.removeItem(url);
    return null;
};

var setCachedRoute = (url, routeData) => {
    routeData.timestamp = Date.now();
    sessionStorage.setItem(url, routeData);
};

// -----------------------------------------------------------------------------
// Helper: Create Post Route Data
// -----------------------------------------------------------------------------
var createPostRouteData = (link, postData, anchor) => {
    const styles = { ...postData.styles };
    if (anchor) {
        styles.anchor = anchor;
    }
    return {
        view: '/views/post',
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

// -----------------------------------------------------------------------------
// Helper: Board Settings Body
// -----------------------------------------------------------------------------
var getBoardSettingsBody = () => {
    const visible = getAllBoardsVisibility();
    return getSortedBoards().map(b => ({
        type: 'boolean',
        name: b.id,
        label: b.title,
        value: visible[b.id]
    }));
};

// -----------------------------------------------------------------------------
// Helper: Update Home View Contents
// -----------------------------------------------------------------------------
var updateHomeViewContents = (viewId) => {
    const visibleBoards = getVisibleBoards();
    synura.update(viewId, {
        models: {
            contents: visibleBoards.map(b => ({
                title: b.title,
                id: b.id
            }))
        }
    });
};

// -----------------------------------------------------------------------------
// Helper: Open Browser View
// -----------------------------------------------------------------------------
var openBrowserView = (url, title, onEvent) => {
    const result = synura.open({
        view: '/views/browser',
        styles: { title: title },
        models: { url: url }
    });
    if (result.success && onEvent) {
        synura.connect(result.viewId, { from: "browser" }, onEvent);
    }
    return result;
};

// -----------------------------------------------------------------------------
// Helper: Show Snackbar
// -----------------------------------------------------------------------------
var showSnackbar = (viewId, message) => {
    synura.update(viewId, { models: { snackbar: message } });
};

// =============================================================================
// 4. BOARD HELPERS
// =============================================================================

var getCustomBoards = () => {
    let boardsStr = localStorage.getItem(CUSTOM_BOARDS_KEY);
    if (!boardsStr) return [];
    try {
        return JSON.parse(boardsStr);
    } catch (e) {
        console.log("Error parsing custom boards", e);
        return [];
    }
}

var getCookie = () => {
    return localStorage.getItem(COOKIE_KEY);
}

var addCustomBoard = (id, name) => {
    let custom = getCustomBoards();
    if (boards.find(b => b.id === id) || custom.find(b => b.id === id)) {
        return false;
    }
    custom.push({ id: id, title: name, custom: true });
    localStorage.setItem(CUSTOM_BOARDS_KEY, JSON.stringify(custom));
    return true;
}

var removeCustomBoard = (id) => {
    let custom = getCustomBoards();
    let filtered = custom.filter(b => b.id !== id);
    if (filtered.length !== custom.length) {
        localStorage.setItem(CUSTOM_BOARDS_KEY, JSON.stringify(filtered));
        return true;
    }
    return false;
}

var defaultVisibleIds = [
    "fire", "free", "new", "economy", "lecture", "tutorial",
    "pds", "qa", "gallery", "trade", "ai", "git", "development"
];

var isDefaultVisible = (id) => {
    return defaultVisibleIds.includes(id);
}

var getSortedBoards = () => {
    const allBoards = [...boards, ...getCustomBoards()];

    let orderStr = localStorage.getItem(ORDER_KEY);
    if (!orderStr) return allBoards;

    try {
        let order = JSON.parse(orderStr);
        let orderMap = {};
        order.forEach((id, index) => orderMap[id] = index);

        return [...allBoards].sort((a, b) => {
            let indexA = orderMap[a.id] !== undefined ? orderMap[a.id] : 9999;
            let indexB = orderMap[b.id] !== undefined ? orderMap[b.id] : 9999;
            return indexA - indexB;
        });
    } catch (e) {
        console.log("Error parsing board order", e);
        return allBoards;
    }
};

var getVisibleBoards = () => {
    let visibleStr = localStorage.getItem(STORAGE_KEY);
    let visible = {};
    if (visibleStr) {
        try {
            visible = JSON.parse(visibleStr);
        } catch (e) {
            console.log("Error parsing visible boards", e);
        }
    } else {
        boards.forEach(b => visible[b.id] = isDefaultVisible(b.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));
    }

    return getSortedBoards().filter(b => visible[b.id] === true || (visible[b.id] === undefined && isDefaultVisible(b.id)));
};

var getAllBoardsVisibility = () => {
    let visibleStr = localStorage.getItem(STORAGE_KEY);
    let visible = {};
    if (visibleStr) {
        try {
            visible = JSON.parse(visibleStr);
        } catch (e) {
        }
    }
    // merge with defaults
    boards.forEach(b => {
        if (visible[b.id] === undefined) visible[b.id] = isDefaultVisible(b.id);
    });
    return visible;
};

var showBoardSettings = (parentViewId) => {
    synura.open({
        view: '/views/settings',
        styles: { title: '게시판 설정' },
        models: {
            body: getBoardSettingsBody(),
            buttons: ['추가', '삭제', '저장', '초기화', '취소']
        }
    }, { from: 'board_settings', parentViewId: parentViewId }, (event) => {
        SYNURA.main.onViewEvent(event.viewId, event);
    });
};
// =============================================================================
// 5. UTILITY FUNCTIONS
// =============================================================================

var parseNumber = (str) => {
    if (!str) return '';
    str = str.trim().toLowerCase();
    let num = 0;
    if (str.endsWith('b')) num = parseFloat(str) * 1000000000;
    else if (str.endsWith('m')) num = parseFloat(str) * 1000000;
    else if (str.endsWith('k')) num = parseFloat(str) * 1000;
    else num = parseFloat(str);

    return num > 0 ? num.toString() : '';
};

var viewState = new Map();

var getParams = (viewId) => {
    if (!viewState.has(viewId)) {
        viewState.set(viewId, {});
    }
    return viewState.get(viewId);
}

var setParams = (viewId, params) => {
    const current = getParams(viewId);
    viewState.set(viewId, { ...current, ...params });
}
// =============================================================================
// 6. CORE FETCH FUNCTIONS
// =============================================================================

var fetchPage = (boardId, page, searchParams) => {
    const options = {};
    const cookie = getCookie();
    if (cookie) {
        options.headers = { "Cookie": cookie };
    }
    let url = `https://damoang.net/${boardId}?page=${page}`;
    if (searchParams && searchParams.query) {
        url = `https://damoang.net/${boardId}?sfl=${encodeURIComponent(searchParams.field)}&stx=${encodeURIComponent(searchParams.query)}&sop=and&page=${page}`;
    }
    console.log(url.replace(/%/g, '%%'));

    const response = fetch(url, options);
    const doc = response.dom("text/html");
    const posts = doc.querySelectorAll('li.list-group-item');
    const cardItems = [];
    posts.forEach(post => {
        const titleElement = post.querySelector('a.da-article-link');
        if (titleElement) {
            const link = titleElement.getAttribute('href');
            const title = titleElement.textContent.trim();
            const category = '';
            const authorElement = post.querySelector('span.sv_name');
            const avatarElement = post.querySelector("img.mb-photo");
            const dateElement = post.querySelector("span.da-list-date")
                || post.querySelector("div.wr-date");
            const likesElement = post.querySelector("div.rcmd-box");
            const commentsElement = post.querySelector("span.count-plus");
            const viewsElement = post.querySelector(".order-4");

            const dateString = dateElement ? dateElement.textContent.replace('등록', '').trim() : '';
            const likeCount = parseNumber(likesElement ? likesElement.textContent.trim() : 0);
            const commentCount = parseNumber(commentsElement ? commentsElement.textContent.trim() : 0);
            const viewCount = parseNumber(viewsElement ? viewsElement.textContent.replace('조회', '').trim() : 0);

            const typeElements = post.querySelectorAll('span.na-icon');
            let types = [];
            typeElements.forEach(typeElement => {
                const c = typeElement.getAttribute("class");
                if (c.includes("na-hot")) {
                    types.push("hot")
                }
                if (c.includes("na-image")) {
                    types.push("image")
                }
                if (c.includes("na-video")) {
                    types.push("video")
                }
                if (c.includes("na-link")) {
                    types.push("link")
                }
            });
            let menus = [];

            cardItems.push({
                link: link,
                title: title,
                types: types,
                author: authorElement ? authorElement.textContent.trim() : '',
                avatar: avatarElement ? avatarElement.getAttribute('src') : '',
                mediaUrl: avatarElement ? avatarElement.getAttribute('src') : '',
                mediaType: 'image',
                date: dateString,
                category: category,
                likeCount: likeCount,
                dislikeCount: '',
                commentCount: commentCount,
                viewCount: viewCount,
                menus: menus,
                hotCount: parseInt(viewCount || '0'),
                coldCount: parseInt(viewCount || '0')
            });
        }
    });
    return cardItems;
};

var fetchPost = (link) => {
    const options = {};
    const cookie = getCookie();
    if (cookie) {
        options.headers = { "Cookie": cookie };
    }
    const response = fetch(link, options);
    const doc = response.dom("text/html");
    return parsePost(doc);
};

var parsePost = (doc) => {
    let articleElement = doc.querySelector("#bo_v");
    if (!articleElement)
        articleElement = doc;

    const titleElement = articleElement.querySelector('#bo_v_title');
    const infoElement = articleElement.querySelector("#bo_v_info");
    const contentContainer = articleElement.querySelector('#bo_v_con'); // there are two #bo_v_con

    let title = '';
    let author = '';
    let date = '';
    let avatar = '';
    let viewCount = '';
    let likeCount = '';
    let dislikeCount = '';

    if (titleElement) {
        title = titleElement.textContent.trim() || '';
    }

    if (infoElement) {
        if (infoElement.querySelector("span.sv_name")) {
            author = infoElement.querySelector("span.sv_name").textContent.trim() || '';
        }
        if (infoElement.querySelector("div.line-top")) {
            const divs = infoElement.querySelector("div.line-top").querySelectorAll('div');
            date = divs[divs.length - 1].textContent.replace('작성일', '').trim();
        }
        if (infoElement.querySelector("div.align-items-start")) {
            const divs = infoElement.querySelectorAll("div.pe-2");
            if (divs[0])
                viewCount = parseNumber(divs[0].textContent.replace('조회', '').trim());
            if (divs[2])
                likeCount = parseNumber(divs[2].textContent.replace('추천', '').trim());
        }


        if (infoElement.querySelector('img.mb-photo')) {
            avatar = infoElement.querySelector('img.mb-photo').getAttribute('src');
        }
    }


    let details;
    if (contentContainer) {
        details = synura.parse('post', contentContainer);
    }

    if (!details || details.length === 0) {
        if (contentContainer) {
            details = [{ type: 'text', value: contentContainer.textContent.trim() }];
        } else {
            details = [{ type: 'text', value: 'Could not load post content.' }];
        }
    }

    const comments = [];
    const commentItems = articleElement.querySelector('#viewcomment').querySelectorAll("article");

    commentItems.forEach(comment => {
        const id = comment.getAttribute('id');
        if (id && id.startsWith('c_')) {
            const authorElement = comment.querySelector('span.sv_name');
            const avatarElement = comment.querySelector('img.mb-photo');
            const dateElement = comment.querySelector('div.ms-auto');
            const contentElement = comment.querySelector('div.na-convert');
            const likesElement = comment.querySelector("span.cnt")

            const style = comment.getAttribute('style'); // margin-left:1rem;
            let level = 0;
            if (style) {
                const match = style.match(/margin-left:\s*(\d+(?:\.\d+)?)/);
                level = match ? parseFloat(match[1]) : 0;
            }

            if (authorElement && contentElement) {
                const commentAuthor = authorElement.textContent.trim();

                const menus = ['답글'];
                if (commentAuthor === author) {
                    menus.push('삭제');
                }

                let content = synura.parse('post', contentElement);
                content.unshift({ type: 'anchor', value: id });

                const likesVal = likesElement ? parseNumber(likesElement.textContent.trim()) : '';
                const likesInt = parseInt(likesVal) || 0;
                comments.push({
                    author: commentAuthor,
                    avatar: avatarElement ? avatarElement.getAttribute('src') : '',
                    content: content,
                    date: dateElement ? dateElement.getAttribute('title') : '',
                    likeCount: likesVal,
                    dislikeCount: '',
                    level: level,
                    menus: menus,
                    hotCount: likesInt,
                    coldCount: likesInt,
                });
            }
        }
    });

    return {
        styles: {
            title: title || '',
        },
        models: {
            author: author || '',
            viewCount: viewCount || '',
            likeCount: likeCount || '',
            dislikeCount: dislikeCount || '',
            date: date || '',
            avatar: avatar || '',
            // hotCount: parseInt(likeCount) || 0,
            // coldCount: parseInt(likeCount) || 0,
            content: details,
            comments: comments,
        }
    };
}
// =============================================================================
// 7. VIEW OPENERS
// =============================================================================

var openPost = (parentViewId, link) => {
    try {
        console.log("Opening post view for link:", link);
        // 1. Open with Placeholder Data
        const postViewResult = synura.open({
            view: '/views/post',
            styles: {
                title: "Loading...",
                authorClickable: true,
                hotThreshold: 10,
                coldThreshold: 10,
                commentHotThreshold: 10,
                commentColdThreshold: 10
            },
            models: {
                link: link,
                author: "",
                date: "",
                avatar: "",
                content: [{ type: 'text', value: 'Loading content...' }],
                comments: [],
                menus: ["브라우저로 보기"],
                buttons: ["새로고침"]
            }
        }, { from: "post", link: link }, (event) => {
            SYNURA.main.onViewEvent(event.viewId, event)
        });

        if (postViewResult.success) {
            console.log("✅ Successfully opened post synura. View ID:", postViewResult.viewId);
            const viewId = postViewResult.viewId;

            // 2. Fetch Data (Synchronous in JS, but UI is already open)
            try {
                const postData = fetchPost(link);

                // 3. Update View
                if (postData) {
                    synura.update(viewId, postData);

                    // 4. Cache using router format
                    const routeData = SYNURA.main.router(link);
                    if (routeData) setCachedRoute(link, routeData);
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
        console.log("✅ Successfully connected to the restored synura.");
    } else {
        console.log("❌ Failed to connect to the restored view:", connectResult.error);
    }
}

var home = () => {
    console.log("Starting initial view creation...");

    try {
        const visibleBoards = getVisibleBoards();
        const initialItems = visibleBoards.map(board => ({
            title: board.title || board.name,
            id: board.id
        }));

        const result = synura.open({
            view: '/views/list',
            styles: {
                title: "Damoang",
            },
            models: {
                contents: initialItems,
                menus: ["캐시설정", "소모임", { label: "정렬", checked: false }, "로그인", "로그아웃", "CLI"],
            }
        }, { from: "home" }, (event) => {
            SYNURA.main.onViewEvent(event.viewId, event)
        });

        if (result.success) {
            console.log("✅ Successfully opened initial view with ID:", result.viewId);
        } else {
            console.log("❌ Failed to open initial view:", result.error);
        }
    } catch (e) {
        console.log("Error during home flow test:", e);
        return "Home flow test failed: " + e.toString();
    }
};
// =============================================================================
// 8. EVENT HANDLERS
// =============================================================================

var handleHomeEvent = (viewId, event) => {
    if (event.eventId === "CLICK") {
        const visibleBoards = getVisibleBoards();
        let board;

        // Find board by ID first (preferred)
        if (event.data.id) {
            board = visibleBoards.find(b => b.id === event.data.id);
        }

        // Fallback to index if ID not found (for backward compatibility or tests)
        if (!board && event.data._index >= 0 && event.data._index < visibleBoards.length) {
            board = visibleBoards[event.data._index];
        }

        if (board) {
            console.log(`Board clicked: ${board.title}, opening list synura...`);

            const result = synura.open({
                view: '/views/list',
                styles: {
                    title: board.title,
                    layout: 'card',
                    hotThreshold: 10000,
                    coldThreshold: 10000,
                    history: true,
                    media: false,
                    pagination: true,
                },
                models: {
                    menus: ["제목검색", "제목+내용검색", "새글쓰기"]
                }
            }, { from: "board", boardId: board.id }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event)
            });

            if (result.success) {
                console.log("✅ Successfully opened new list synura. View ID:", result.viewId);
                setParams(result.viewId, { currentPage: 1 });
            } else {
                console.log("❌ Failed to open new list view:", result.error);
                showSnackbar(viewId, result.error);
            }
        }
    } else if (event.eventId === "MENU_CLICK") {
        if (event.data.menu == "캐시설정") {
            const currentTTL = getCacheTTL() / 60000; // to minutes
            const showSnackbar = getShowCacheSnackbar();
            synura.open({
                view: '/dialogs/input',
                styles: { title: '캐시 설정', message: '캐시 설정을 변경하세요.', close: true },
                models: {
                    body: [
                        { type: 'number', name: 'ttl', label: '캐시 TTL (분)', value: currentTTL },
                        { type: 'boolean', name: 'show_snackbar', label: '캐시 알림 표시', value: showSnackbar }
                    ],
                    buttons: ['저장', '초기화']
                }
            }, { from: 'cache_settings', parentViewId: viewId }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
            return;
        }
        if (event.data.menu == "소모임") {
            SYNURA.main.showBoardSettings(viewId);
            return;
        }

        if (event.data.menu == "로그인") {
            openBrowserView('https://damoang.net/bbs/login.php', '로그인', (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
            return;
        }

        if (event.data.menu == "로그아웃") {
            localStorage.removeItem(COOKIE_KEY);
            showSnackbar(viewId, "쿠키가 삭제되었습니다.");
            openBrowserView('https://damoang.net/bbs/logout.php', '로그아웃', (event) => {
                // Log out page might not need event handling, but good practice
            });
            return;
        }
        if (event.data.menu == "CLI") {
            openCLI(viewId);
            return;
        }
        if (event.data.menu == "정렬") {
            const params = getParams(viewId);
            const isReorderable = !params.isReorderable;
            setParams(viewId, { isReorderable });

            synura.update(viewId, {
                styles: {
                    reorderable: isReorderable
                },
                models: {
                    menus: ["캐시설정", "소모임", { label: "정렬", checked: isReorderable }, "로그인", "로그아웃", "CLI"],
                    snackbar: isReorderable ? "순서 변경이 활성화되었습니다." : "순서 변경이 비활성화되었습니다."
                }
            });
            return;
        }

    } else if (event.eventId === "REORDER") {
        console.log("Reordering...", JSON.stringify(event.data));

        let visibleBoards = getVisibleBoards();
        let oldIndex = -1;

        // Try finding by ID first
        if (event.data.id) {
            oldIndex = visibleBoards.findIndex(b => b.id === event.data.id);
        }

        // Fallback to title/name matching if ID not provided
        if (oldIndex === -1 && event.data.title) {
            oldIndex = visibleBoards.findIndex(b => b.title === event.data.title);
        }

        let newIndex = event.data._newIndex;

        if (oldIndex >= 0 && newIndex !== undefined) {
            // Adjust index if moving down, standard Flutter ReorderableList behavior
            if (oldIndex < newIndex) {
                newIndex -= 1;
            }

            const item = visibleBoards[oldIndex];
            visibleBoards.splice(oldIndex, 1);
            visibleBoards.splice(newIndex, 0, item);

            // Construct new global order
            const allBoards = getSortedBoards();
            const visibleIds = new Set(visibleBoards.map(b => b.id));
            const hiddenBoards = allBoards.filter(b => !visibleIds.has(b.id));

            // Visible boards first, then hidden boards (preserving their relative order)
            const newOrder = [...visibleBoards, ...hiddenBoards].map(b => b.id);
            localStorage.setItem(ORDER_KEY, JSON.stringify(newOrder));

            synura.update(viewId, {
                models: {
                    snackbar: "순서가 저장되었습니다."
                }
            });
        }
    }
};

var handleBoardEvent = (viewId, event) => {
    if (event.eventId === "LOAD" || event.eventId === "REFRESH") {
        console.log(`Received ${event.eventId} event from list synura. Fetching data...`);
        setParams(viewId, { currentPage: 1 });
        try {
            const params = getParams(viewId);
            const searchParams = {
                field: params.searchTarget,
                query: params.searchQuery
            };
            const cardItems = fetchPage(event.context.boardId, 1, searchParams);
            const updateResult = synura.update(viewId, {
                models: {
                    contents: cardItems
                }
            });
            if (updateResult.success) {
                console.log("✅ Successfully updated view with initial data.");
            } else {
                console.log("❌ Failed to update view with data:", updateResult.error);
            }
        } catch (e) {
            console.log("❌ Failed to fetch data for view:", e);
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
    } else if (event.eventId === "SCROLL_TO_END") {
        console.log("Appending data to the view after scroll to end...");
        const params = getParams(viewId);
        let currentPage = params.currentPage || 1;
        currentPage++;
        setParams(viewId, { currentPage });

        console.log(`Fetching page ${currentPage}...`);

        try {
            const searchParams = {
                field: params.searchTarget,
                query: params.searchQuery
            };
            const cardItems = fetchPage(event.context.boardId, currentPage, searchParams);
            const updateData = {
                models: {
                    append: cardItems,
                },
            };

            const updateResult = synura.update(viewId, updateData);
            if (updateResult.success) {
                console.log("✅ Successfully appended data to synura.");
            } else {
                console.log("❌ Failed to append data to view:", updateResult.error);
            }
        } catch (e) {
            console.log("❌ Failed to fetch HTTP request for next page:", e);
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
    } else if (event.eventId === "CLICK") {
        console.log("Card item clicked, opening post synura...")
        const clickedCard = event.data;
        let link = clickedCard.link;
        if (link && !link.startsWith('http')) {
            link = `https://${SYNURA.domain}${link.startsWith('/') ? '' : '/'}${link}`;
        }

        // 1. Check Cache
        const routeData = getCachedRoute(link);

        if (routeData) {
            // 2. Cache Hit - Open Immediately
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
            // 3. Cache Miss - Optimistic Open
            console.log("Cache MISS - Opening view optimistically...");
            openPost(viewId, link);
        }
    } else if (event.eventId === "MENU_CLICK") {
        if (event.data.menu == "새글쓰기") {
            synura.open({
                view: '/views/editor',
                styles: {
                    title: "새 글 쓰기",
                },
                models: {
                }
            }, { from: "editor" }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event)
            });
            return;
        }

        let appbar = null;
        if (event.data.menu == "제목검색") {
            setParams(viewId, { searchTarget: 'wr_subject' });
            appbar = {
                type: "query",
                label: "제목",
                hint: "검색어를 입력하세요"
            }
        } else if (event.data.menu == "제목+내용검색") {
            setParams(viewId, { searchTarget: 'wr_subject||wr_content' });
            appbar = {
                type: "query",
                label: "제목+내용",
                hint: "검색어를 입력하세요"
            }
        }
        synura.update(viewId, {
            styles: {
                appbar: appbar
            }
        });
    } else if (event.eventId === "QUERY") {
        const query = event.data.query;
        console.log("Query event:", query);
        setParams(viewId, { currentPage: 1, searchQuery: query });

        try {
            const params = getParams(viewId);
            const searchParams = {
                field: params.searchTarget,
                query: query
            };
            const cardItems = fetchPage(event.context.boardId, 1, searchParams);
            synura.update(viewId, {
                models: {
                    contents: cardItems
                }
            });
        } catch (e) {
            synura.update(viewId, { models: { snackbar: e.toString() } });
        }
    }
};

var handlePostEvent = (viewId, event) => {
    if (event.eventId === "LOAD") {
        // Handle anchor scroll for restored/cached posts
        if (event.context && event.context.anchor) {
            synura.update(viewId, {
                styles: { anchor: event.context.anchor }
            });
        }
    } else if (event.eventId === "REFRESH") {
        const link = event.context.link;
        console.log(`Received ${event.eventId} event from post synura. Fetching content from:`, link);
        try {
            const postData = fetchPost(link);
            const updateResult = synura.update(viewId, postData);
            if (updateResult.success) {
                console.log("✅ Successfully updated post view with content.");
                // Update Cache
                setCachedRoute(link, createPostRouteData(link, postData));
            } else {
                console.log("❌ Failed to update post view:", updateResult.error);
            }
        } catch (e) {
            console.log("❌ Failed to fetch post content:", e);
            const errorData = {
                styles: {
                    title: "Error"
                },
                models: {
                    content: [{ type: 'text', value: 'Error loading content: ' + e.toString() }]
                }
            };
            synura.update(viewId, errorData);
        }
    } else if (event.eventId === "MENU_CLICK") {
        if (event.data.menu == "브라우저로 보기") {
            const result = synura.open({
                view: '/views/browser',
                styles: {
                    title: event.data.link,
                },
                models: {
                    url: event.data.link,
                }
            });

            if (result.success) {
                console.log("✅ Successfully opened browser synura. View ID:", result.viewId);
                const connectResult = synura.connect(result.viewId, { from: "browser" }, (event) => {
                    SYNURA.main.onViewEvent(event.viewId, event);
                });
            } else {
                console.log("❌ Failed to open browser view:", result.error);
                synura.update(viewId, { models: { snackbar: result.error } });
            }
        }
    } else if (event.eventId === "SUBMIT") {
        if (event.data.button === "새로고침") {
            const link = event.context.link;
            console.log(`Refreshing post content from:`, link);
            try {
                const postData = fetchPost(link);
                const updateResult = synura.update(viewId, {
                    ...postData,
                    models: {
                        ...postData.models,
                        snackbar: "새로고침 완료"
                    }
                });
                if (updateResult.success) {
                    console.log("✅ Successfully updated post view with content.");
                    // Update Cache
                    setCachedRoute(link, createPostRouteData(link, postData));
                } else {
                    console.log("❌ Failed to update post view:", updateResult.error);
                }
            } catch (e) {
                console.log("❌ Failed to fetch post content:", e);
                showSnackbar(viewId, e.toString());
            }
        } else {
            synura.update(viewId, { models: { snackbar: `Button ${event.data.button} clicked!` } });
        }
    } else if (event.eventId === "ITEM_MENU_CLICK") {
        // Comment menu actions
        if (event.data.menu === "삭제") {
            const result = synura.open({
                view: '/dialogs/confirmation',
                styles: { title: '미구현', message: '눈팅용', close: true },
                models: {
                    buttons: ['삭제']
                }
            }, { from: 'comment_delete', parentViewId: viewId }, (dialogEvent) => {
                if (dialogEvent.eventId === "SUBMIT") {
                    if (dialogEvent.data.button === "삭제") {
                        synura.close(result.viewId);
                        synura.open({
                            view: '/dialogs/confirmation',
                            styles: { title: '미구현', message: '미구현', close: true }
                        });
                    }
                }
            });
        } else if (event.data.menu === "답글") {
            const result = synura.open({
                view: '/dialogs/input',
                styles: { title: '미구현', message: '눈팅용', close: true },
                models: {
                    body: [
                        { type: 'string', name: 'reply', label: '답글', lines: 5 }
                    ],
                    buttons: ['저장']
                }
            }, { from: 'comment_reply', parentViewId: viewId }, (dialogEvent) => {
                if (dialogEvent.eventId === "SUBMIT") {
                    if (dialogEvent.data.button === "저장") {
                        synura.close(result.viewId);
                        synura.open({
                            view: '/dialogs/confirmation',
                            styles: { title: '미구현', message: dialogEvent.data.reply, close: true }
                        });
                    }
                }
            });
        }
    }
};

var handleSettingsEvent = (viewId, event) => {
    if (event.eventId === "SUBMIT") {
        console.log("Received SUBMIT event from settings view:", event.data.my_input1, JSON.stringify(event.data));
        if (event.data.button === 'submit') {
            showSnackbar(viewId, "Settings saved!");
        } else if (event.data.button === 'reset') {
            synura.update(viewId, {
                models: {
                    body: [
                        { type: 'string', name: 'my_input1', label: 'Username', value: 'tst' },
                        { type: 'string', name: 'Password', label: 'Your Text1', value: 'tst', format: "password" },
                        { type: 'number', name: 'my_input2', label: 'Your Text2', },
                        { type: 'boolean', name: 'my_input3', label: 'Your Text3', value: true },
                    ],
                    snackbar: "Settings reset!"
                }
            });
        } else {
            synura.update(viewId, { models: { snackbar: `Button ${event.data.button} clicked!` } });
        }
    }
};

var handleBoardSettingsEvent = (viewId, event) => {
    if (event.eventId === 'SUBMIT') {
        if (event.data.button === '저장') {
            const newVisible = {};
            getSortedBoards().forEach(b => {
                newVisible[b.id] = event.data[b.id];
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisible));
            synura.update(viewId, { models: { snackbar: "설정이 저장되었습니다." } });
            synura.close(viewId);

            if (event.context.parentViewId) {
                updateHomeViewContents(event.context.parentViewId);
            }
        } else if (event.data.button === '초기화') {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(ORDER_KEY);
            localStorage.removeItem(CUSTOM_BOARDS_KEY);

            synura.update(viewId, {
                models: {
                    body: getBoardSettingsBody(),
                    snackbar: "설정이 초기화되었습니다."
                }
            });

            if (event.context.parentViewId) {
                updateHomeViewContents(event.context.parentViewId);
            }
        } else if (event.data.button === '추가') {
            synura.open({
                view: '/dialogs/input',
                styles: { title: '게시판 추가', message: '게시판 ID와 이름을 입력하세요.', close: true },
                models: {
                    body: [
                        { type: 'string', name: 'id', label: 'ID (예: free)', value: '' },
                        { type: 'string', name: 'name', label: '이름 (예: 자유게시판)', value: '' }
                    ],
                    buttons: ['추가', '취소']
                }
            }, { from: 'board_add_dialog', parentViewId: viewId }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
        } else if (event.data.button === '삭제') {
            const customBoards = getCustomBoards();
            if (customBoards.length === 0) {
                synura.update(viewId, { models: { snackbar: "삭제할 수 있는 게시판이 없습니다." } });
                return;
            }

            const body = customBoards.map(b => ({
                type: 'boolean',
                name: b.id,
                label: b.title,
                value: true // Default to keep (true)
            }));

            synura.open({
                view: '/views/settings',
                styles: { title: '게시판 삭제', message: '유지하려면 체크하세요. 체크 해제시 삭제됩니다.' },
                models: {
                    body: body,
                    buttons: ['확인', '취소']
                }
            }, { from: 'board_delete_settings', parentViewId: viewId }, (event) => {
                SYNURA.main.onViewEvent(event.viewId, event);
            });
        } else {
            synura.close(viewId);
        }
    }
};

var handleBoardAddEvent = (viewId, event) => {
    if (event.eventId === 'SUBMIT') {
        if (event.data.button === '추가') {
            const id = event.data.id;
            const name = event.data.name;
            if (id && name) {
                if (addCustomBoard(id, name)) {
                    showSnackbar(viewId, "게시판이 추가되었습니다.");
                    synura.close(viewId);
                    if (event.context.parentViewId) {
                        const visible = getAllBoardsVisibility();
                        const body = getSortedBoards().map(b => ({
                            type: 'boolean',
                            name: b.id,
                            label: b.title,
                            value: visible[b.id]
                        }));
                        synura.update(event.context.parentViewId, {
                            models: { body: body }
                        });
                    }
                } else {
                    showSnackbar(viewId, "이미 존재하는 ID입니다.");
                }
            } else {
                showSnackbar(viewId, "ID와 이름을 모두 입력해주세요.");
            }
        } else {
            synura.close(viewId);
        }
    }
}

var handleBoardDeleteEvent = (viewId, event) => {
    if (event.eventId === 'SUBMIT') {
        if (event.data.button === '확인') {
            const customBoards = getCustomBoards();
            let count = 0;
            customBoards.forEach(b => {
                if (event.data[b.id] === false) {
                    if (removeCustomBoard(b.id)) {
                        count++;
                    }
                }
            });
            showSnackbar(viewId, `${count}개의 게시판이 삭제되었습니다.`);
            synura.close(viewId);

            if (event.context.parentViewId) {
                const visible = getAllBoardsVisibility();
                const body = getSortedBoards().map(b => ({
                    type: 'boolean',
                    name: b.id,
                    label: b.title,
                    value: visible[b.id]
                }));
                synura.update(event.context.parentViewId, {
                    models: { body: body }
                });
            }
        } else {
            synura.close(viewId);
        }
    }
}

var handleBrowserEvent = (viewId, event) => {
    if (event.eventId === "SUBMIT") {
        console.log("Browser submitted:", JSON.stringify(event.data).replace(/%/g, '%%'));
        const cookie = event.data.cookies;
        if (cookie) {
            localStorage.setItem(COOKIE_KEY, cookie);
            showSnackbar(viewId, "쿠키가 저장되었습니다.");
        }
    }
};

var handleCacheSettingsEvent = (viewId, event) => {
    if (event.eventId === 'SUBMIT') {
        if (event.data.button === '저장') {
            const ttlMinutes = parseInt(event.data.ttl);
            if (!isNaN(ttlMinutes) && ttlMinutes > 0) {
                const ttlMs = ttlMinutes * 60000;
                localStorage.setItem(CACHE_TTL_KEY, ttlMs.toString());
                localStorage.setItem(CACHE_SNACKBAR_KEY, event.data.show_snackbar.toString());
                showSnackbar(viewId, "캐시 설정이 저장되었습니다.");
                synura.close(viewId);
            } else {
                showSnackbar(viewId, "유효한 숫자를 입력해주세요.");
            }
        } else if (event.data.button === '초기화') {
            localStorage.removeItem(CACHE_TTL_KEY);
            localStorage.removeItem(CACHE_SNACKBAR_KEY);
            sessionStorage.clear();
            showSnackbar(viewId, "캐시 설정이 초기화되었습니다.");
            synura.close(viewId);
        }
    }
};

var onViewEvent = (viewId, event) => {
    console.log("Received event from Flutter UI:", JSON.stringify(event).replace(/%/g, '%%'));

    if (event.context.from === "home") {
        handleHomeEvent(viewId, event);
    } else if (event.context.from === "board") {
        handleBoardEvent(viewId, event);
    } else if (event.context.from === "post") {
        handlePostEvent(viewId, event);
    } else if (event.context.from === "settings") {
        handleSettingsEvent(viewId, event);
    } else if (event.context.from === "board_settings") {
        handleBoardSettingsEvent(viewId, event);
    } else if (event.context.from === "board_add_dialog") {
        handleBoardAddEvent(viewId, event);
    } else if (event.context.from === "board_delete_settings") {
        handleBoardDeleteEvent(viewId, event);
    } else if (event.context.from === "cache_settings") {
        handleCacheSettingsEvent(viewId, event);
    } else if (event.context.from === "browser") {
        handleBrowserEvent(viewId, event);
    } else if (event.context.from === "editor") {
        if (event.eventId === "SUBMIT") {
            synura.update(viewId, { models: { snackbar: "미구현. 눈팅용" } });
        }
    } else if (event.context.from === "cli") {
        handleCLIEvent(viewId, event);
    }
};

// =============================================================================
// 9. CLI IMPLEMENTATION
// =============================================================================

var openCLI = (parentViewId) => {
    const result = synura.open({
        view: '/views/chat',
        styles: {
            title: 'Test-Damoang CLI',
            menu: true
        },
        models: {
            menus: ["Help", "Exit"],
            append: [{ user: "System", message: getCLIWelcome(), format: "markdown" }]
        }
    }, { from: "cli", parentViewId: parentViewId }, (event) => {
        SYNURA.main.onViewEvent(event.viewId, event);
    });
};

var getCLIWelcome = () => {
    const cookie = getCookie();
    const cacheTTL = getCacheTTL() / 60000;
    const visibleBoards = getVisibleBoards();
    const customBoards = getCustomBoards();

    const cookieStatus = cookie ? "✅ Set" : "❌ Not set";

    return `🔧 Test-Damoang CLI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Current Configuration:
• Cookie: ${cookieStatus}
• Cache TTL: ${cacheTTL} min
• Visible Boards: ${visibleBoards.length}
• Custom Boards: ${customBoards.length}

Type /help to see all commands`;
};

var cliMessage = (viewId, message) => {
    synura.update(viewId, {
        models: {
            append: [{ user: "System", message: message, format: "markdown" }]
        }
    });
};

var getCLIHelp = () => {
    return `📖 Available Commands:

🍪 Cookie Management
  /cookie              Show current cookie
  /cookie set "..."    Set cookie value
  /cookie clear        Clear stored cookie

📋 Board Management
  /board list          List all boards
  /board add "id" "name"  Add new board
  /board del "id"      Remove a board
  /board show "id"     Show a board
  /board hide "id"     Hide a board

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
    const cookie = getCookie();
    const cacheTTL = getCacheTTL() / 60000;
    const showSnackbar = getShowCacheSnackbar();
    const visibleBoards = getVisibleBoards();
    const customBoards = getCustomBoards();
    const allBoards = getSortedBoards();

    const cookieStatus = cookie ? "✅ Set" : "❌ Not set";
    const snackbarStatus = showSnackbar ? "✅ On" : "❌ Off";

    return `ℹ️ Current Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🍪 Cookie: ${cookieStatus}
⏱️ Cache TTL: ${cacheTTL} minutes
📢 Cache Snackbar: ${snackbarStatus}

📋 Boards:
• Total: ${allBoards.length}
• Visible: ${visibleBoards.length}
• Custom: ${customBoards.length}
• Hidden: ${allBoards.length - visibleBoards.length}`;
};

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

        // Handle synura://action links
        if (link.startsWith("synura://action?")) {
            const params = new URLSearchParams(link.substring("synura://action?".length));
            const cmd = params.get("cmd");
            if (cmd === "showHtml") {
                const key = params.get("key");
                const cached = sessionStorage.getItem(key);

                if (cached && cached.html) {
                    const result = synura.open({
                        view: '/views/source',
                        styles: {
                            title: cached.url || 'HTML Source',
                            language: 'html',
                            lineNumbers: true,
                            wordWrap: false
                        },
                        models: {
                            content: cached.html
                        }
                    });

                    if (!result.success) {
                        cliMessage(viewId, `❌ Failed to open source view: ${result.error}`);
                    }
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

    // Exit command
    if (input === "/q") {
        synura.close(viewId);
        return;
    }

    // Help command
    if (input === "/help") {
        cliMessage(viewId, getCLIHelp());
        return;
    }

    // Info command
    if (input === "/info") {
        cliMessage(viewId, getCLIInfo());
        return;
    }

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
        // Remove surrounding quotes if present
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

    // Board commands
    if (input === "/board list") {
        const allBoards = getSortedBoards();
        const visible = getAllBoardsVisibility();
        const customBoards = getCustomBoards();
        const customIds = new Set(customBoards.map(b => b.id));

        let msg = "📋 Boards:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        allBoards.forEach((b, i) => {
            const status = visible[b.id] ? "👁️" : "🚫";
            const customTag = customIds.has(b.id) ? " [custom]" : "";
            msg += `${status} ${b.id}: ${b.title}${customTag}\n`;
        });
        cliMessage(viewId, msg);
        return;
    }

    if (input.startsWith("/board add ")) {
        const args = input.substring(11).trim();
        // Parse "id" "name" format
        const match = args.match(/["']([^"']+)["']\s+["']([^"']+)["']/);
        if (match) {
            const id = match[1];
            const name = match[2];
            if (addCustomBoard(id, name)) {
                cliMessage(viewId, `✅ Board added: ${id} (${name})`);
            } else {
                cliMessage(viewId, `❌ Error: Board "${id}" already exists`);
            }
        } else {
            cliMessage(viewId, "❌ Error: Invalid format\nUsage: /board add \"id\" \"name\"");
        }
        return;
    }

    if (input.startsWith("/board del ")) {
        const args = input.substring(11).trim();
        const id = args.replace(/^["']|["']$/g, '');
        if (removeCustomBoard(id)) {
            cliMessage(viewId, `✅ Board removed: ${id}`);
        } else {
            cliMessage(viewId, `❌ Error: Cannot remove "${id}" (not a custom board or doesn't exist)`);
        }
        return;
    }

    if (input.startsWith("/board show ")) {
        const id = input.substring(12).trim().replace(/^["']|["']$/g, '');
        const visible = getAllBoardsVisibility();
        visible[id] = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));
        cliMessage(viewId, `✅ Board "${id}" is now visible`);
        return;
    }

    if (input.startsWith("/board hide ")) {
        const id = input.substring(12).trim().replace(/^["']|["']$/g, '');
        const visible = getAllBoardsVisibility();
        visible[id] = false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));
        cliMessage(viewId, `✅ Board "${id}" is now hidden`);
        return;
    }

    // Cache commands
    if (input === "/cache") {
        const ttl = getCacheTTL() / 60000;
        const showSnackbar = getShowCacheSnackbar();
        cliMessage(viewId, `⚙️ Cache Settings:\n• TTL: ${ttl} minutes\n• Snackbar: ${showSnackbar ? "On" : "Off"}`);
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
        if (!url) {
            cliMessage(viewId, "❌ Error: Please provide a URL\nUsage: /fetch <url>");
            return;
        }

        // Resolve relative URLs
        if (url.startsWith('/')) {
            url = `https://${SYNURA.domain}${url}`;
        } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`;
        }

        try {
            const cookie = getCookie();
            const fetchOptions = {};
            if (cookie) {
                fetchOptions.headers = { 'Cookie': cookie };
            }

            const response = fetch(url, fetchOptions);
            const htmlContent = response.text();

            // Generate summary info
            const status = response.status;
            const statusText = response.statusText || (response.ok ? 'OK' : 'Error');
            const contentLength = htmlContent.length;
            const truncatedUrl = url.length > 50 ? url.substring(0, 50) + '...' : url;

            // Store the HTML content for later retrieval
            const viewKey = `__cli_fetch_${Date.now()}`;
            sessionStorage.setItem(viewKey, { html: htmlContent, url: url });

            const msg = `🌐 Fetch Result
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 **URL:** ${truncatedUrl}
📊 **Status:** ${status} ${statusText}
📦 **Size:** ${contentLength.toLocaleString()} bytes
🍪 **Cookie:** ${cookie ? 'Used' : 'Not set'}

[📄 Show HTML](synura://action?cmd=showHtml&key=${viewKey})`;

            cliMessage(viewId, msg);
        } catch (e) {
            cliMessage(viewId, `❌ Fetch failed: ${e.toString()}`);
        }
        return;
    }

    // Unknown command
    if (input.startsWith("/")) {
        cliMessage(viewId, `❌ Unknown command: ${input}\nType /help for available commands`);
    } else {
        cliMessage(viewId, `💬 Echo: ${input}\n\n(Commands start with /)`);
    }
};

var extractData = () => {
    console.log("Testing pure DOM extraction...");
};
// =============================================================================
// 10. ROUTER & HANDLER EXPORT
// =============================================================================

var handler = {
    home,
    resume,
    onViewEvent,
    extractData,

    showBoardSettings,
    deeplink: (url) => {
        console.log("Deep link called with url:", url);
        const prefix = `https://${SYNURA.domain}/`;
        if (!url.startsWith(prefix)) return false;

        const part = url.substring(prefix.length);
        const parts = part.split('/').filter(p => p.length > 0);

        if (parts.length < 2) return false; // meaningful deep link should be at least board/id

        const boardId = parts[0];
        if (boardMap.has(boardId)) {
            console.log(`Handling deep link for post (${boardMap.get(boardId).title})...`);

            // 1. Check Cache
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
    },

    router: function (url) {
        console.log("Router called for: " + url);
        try {
            // Parse anchor from URL if present
            let anchor = null;
            if (url.includes('#')) {
                const hashIndex = url.indexOf('#');
                anchor = url.substring(hashIndex + 1);
                url = url.substring(0, hashIndex);
            }

            const prefix = `https://${SYNURA.domain}/`;
            // Handle relative URLs
            if (url.startsWith('/')) {
                url = `https://${SYNURA.domain}${url}`;
                console.log("Resolved relative URL to:", url);
            }
            if (!url.startsWith(prefix)) return null;

            // Check cache first (but add anchor to result if present)
            const cached = getCachedRoute(url);
            if (cached) {
                console.log("Router returning cached result");
                if (anchor) {
                    // Clone and add anchor to styles
                    const result = JSON.parse(JSON.stringify(cached));
                    result.styles = result.styles || {};
                    result.styles.anchor = anchor;
                    return result;
                }
                return cached;
            }

            const part = url.substring(prefix.length);
            // remove query params for path splitting
            const pathPart = part.split('?')[0];
            const parts = pathPart.split('/').filter(p => p.length > 0);

            if (parts.length === 0) return null; // Home page? currently not handled by router(url) usually

            const boardId = parts[0];
            let result = null;

            // Case 1: Board List (e.g. /free)
            // It could be just /free or /free?page=2
            // Currently our deeplink logic said parts.length < 2 return false.
            // But here we want to support it.
            if (parts.length === 1 && boardMap.has(boardId)) {
                console.log("Routing to board:", boardId);
                // Parse page from query params if exists
                let page = 1;
                const match = url.match(/page=(\d+)/);
                if (match) {
                    page = parseInt(match[1]);
                }

                const board = boardMap.get(boardId);
                const items = fetchPage(boardId, page);

                result = {
                    view: '/views/list',
                    timestamp: Date.now(),
                    styles: {
                        title: board.title,
                        layout: 'card',
                        hotThreshold: 10000,
                        coldThreshold: 10000,
                        history: true,
                        media: false,
                        pagination: true,
                    },
                    models: {
                        contents: items,
                        menus: ["제목검색", "제목+내용검색", "새글쓰기"]
                    }
                };
            }

            // Case 2: Post (e.g. /free/123)
            // Or /free/123/456...
            if (!result && parts.length >= 2 && boardMap.has(boardId)) {
                console.log("Routing to post:", url);
                const postData = fetchPost(url);
                if (postData) {
                    result = createPostRouteData(url, postData, anchor);
                }
            }

            // Store in sessionStorage if we got a result
            if (result) {
                setCachedRoute(url, result);
            }

            return result;

        } catch (e) {
            console.log("Router error:", e);
            return null;
        }
    }
};

var boardMap = new Map();
boards.forEach(b => boardMap.set(b.id, b));
