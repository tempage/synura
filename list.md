# List View Documentation

The List View is the primary view for displaying collections of items, such as post lists, galleries, or simple text lists. It supports pagination, pull-to-refresh, and different layouts.

## View Path
`/views/list`

## Styles
The `styles` object controls the appearance and behavior of the view.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed in the app bar. |
| `appbar` | `object` or `string` | Customizes the app bar. If set to `'query'`, it shows a search bar. Can also be an object `{'type': 'query', 'label': 'Search', 'hint': 'Enter text...'}` to customize the search bar text. |
| `layout` | `string` | `'card'` (default) or `'gallery'`. |
| `pagination` | `boolean` | If `true`, enables infinite scrolling (triggers `SCROLL_TO_END`). |
| `reorderable` | `boolean` | If `true`, allows users to reorder items (triggers `REORDER`). |
| `history` | `boolean` | If `true`, enables history tracking for visited items. |
| `media` | `boolean` | If `true`, displays media indicators/thumbnails in card layout. |
| `menu` | `boolean` | If `true`, enables the options menu in the app bar. |
| `hotThreshold` | `number` | Minimum view count to mark an item as "hot". |
| `coldThreshold` | `number` | Maximum view count to mark an item as "cold". |
| `authorClickable` | `boolean` | If `true`, enables the author click event. |

## Models
The `models` object contains the data to be displayed.

### Top-Level Fields

| Key | Type | Description |
| :--- | :--- | :--- |
| `contents` | `object` | Initial list of items. Contains a `details` list. |
| `append` | `object` | List of items to append to the existing list. Used for pagination. |
| `menus` | `list<string>` | List of menu items to show if `menu` style is true. |

### Item Models
Items in `contents.details` or `append.details` can be either `CardItemModel` or `SimpleListItemModel`.

#### CardItemModel (Default)
Used when `layout` is `'card'` or `'gallery'`.

| Key | Type | Description |
| :--- | :--- | :--- |
| `link` | `string` | Unique identifier/URL for the item. |
| `title` | `string` | Main title of the item. |
| `author` | `string` | Author name. |
| `date` | `string` | Date string. |
| `viewCount` | `number` | Number of views. |
| `likeCount` | `number` | Number of likes. |
| `commentCount` | `number` | Number of comments. |
| `mediaUrl` | `string` | URL of the thumbnail or media. |
| `mediaType` | `string` | `'image'` or `'video'`. |
| `types` | `list<string>` | Tags like `'hot'`, `'image'`, `'video'`, `'link'`. |

#### SimpleListItemModel
Used when `layout` is NOT `'card'` or `'gallery'`.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The text to display. |

## Events
The view sends the following events to the extension:

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `REFRESH` | Triggered when the user pulls to refresh. | None |
| `SCROLL_TO_END` | Triggered when the user scrolls to the bottom (if `pagination` is true). | None |
| `CLICK` | Triggered when an item is tapped. | `link`: Item link (Card). `title`: Item title. `index`: Item index (Simple). |
| `MENU_CLICK` | Triggered when a menu item is selected. | `menu`: The selected menu string. |
| `REORDER` | Triggered when an item is reordered. | `title`: Item title. `index`: New index. `link`: Item link (Card). |
| `AUTHOR_CLICK` | Triggered when the author is clicked. | `link`: Item link. `author`: Author name. |

## Example Usage

```javascript
synura.open('/views/list', {
    styles: {
        title: "My List",
        layout: "card",
        pagination: true
    },
    models: {
        contents: [
            {
                link: "https://example.com/1",
                title: "First Item",
                author: "User A",
                viewCount: 100
            }
        ]
    }
});
```

### Query Appbar Example
To use a query appbar that emits `QUERY` events:
```javascript
const view = synura.open('/views/list', {
    styles: {
        appbar: 'query'
    },
    models: {
        // ...
    }
});

synura.connect(view.viewId, {}, (event) => {
    if (event.eventId === 'QUERY') {
        console.log('Search query:', event.data.query);
        // Handle the search query
    }
});
```
