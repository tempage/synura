// @ts-nocheck
// Handwritten contract fixture for community_common.ts. All data is synthetic.
var SITE = {
    siteKey: "common_test",
    displayName: "Synthetic Community",
    browserHomeUrl: "https://example.test/board/",
    browserCookieAuth: false,
    boards: [{id: "board", title: "Synthetic Board", url: "https://example.test/board/"}],
    selectors: {
        boardTitle: ["h1"],
        listRows: ["[data-card]"],
        postTitle: ["h1"],
        postContent: ["#post-body"],
        postAuthor: ["#post-author"],
        postAvatar: ["#post-avatar"],
        postDate: ["#post-date"],
        postCategory: ["#post-category"],
        postViewCount: ["#post-views"],
        postLikeCount: ["#post-likes"]
    },
    matchPost: function (info) {
        return info.path.indexOf("/post/") === 0 ? {board: SITE.boards[0]} : null;
    },
    matchBoard: function (info) {
        return info.path === "/board/" ? {board: SITE.boards[0], page: 1} : null;
    },
    buildNextPageUrl: function () { return ""; },
    parseComments: function (doc, url) {
        return Array.prototype.map.call(doc.querySelectorAll("[data-comment]"), function (node) {
            var id = attrOf(node, "id");
            return {id: id, link: url + "#" + id, content: parseDetails(node, url)};
        });
    },
    parseBoardItemsCustom: function (doc, url) {
        return Array.prototype.map.call(doc.querySelectorAll("[data-card]"), function (node) {
            return {
                id: attrOf(node, "id"),
                title: textOf(node),
                link: "https://example.test/post/item",
                mediaUrl: imageUrlFromNode(firstNode(node, ["img"]), url)
            };
        });
    }
};

var SYNURA = {
    domain: "example.test",
    name: "community_common_test",
    version: 1,
    api: 0,
    locale: "en_US",
    main: null
};

// No test may accidentally use an external response.
fetch = function () { throw new Error("Unexpected network request"); };

function useSyntheticResponse(doc, html, url) {
    fetch = function () {
        return {
            ok: true,
            status: 200,
            url: url,
            text: function () { return html; },
            dom: function () { return doc; }
        };
    };
}
