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
| `columnCount` | `int` | Number of columns for gallery layout. In landscape mode, this scales based on the screen's aspect ratio (width/height), up to a maximum of 3 times the base value. Default is 1. |
| `pagination` | `boolean` | If `true`, enables infinite scrolling (triggers `SCROLL_TO_END`). |
| `reorderable` | `boolean` | If `true`, allows users to reorder items (triggers `REORDER`). |
| `history` | `boolean` | If `true`, enables history tracking for visited items. |
| `media` | `boolean` | If `true`, displays media indicators/thumbnails in card layout. |
| `menu` | `boolean` | If `true`, enables the options menu in the app bar. |
| `hotThreshold` | `number` | Minimum view count to mark an item as "hot". |
| `coldThreshold` | `number` | Maximum view count to mark an item as "cold". |
| `authorClickable` | `boolean` | If `true`, enables the author click event. |
| `categoryClickable` | `boolean` | If `true`, enables the category click event. |

## Models
The `models` object contains the data to be displayed.

### Top-Level Fields

| Key | Type | Description |
| :--- | :--- | :--- |
| `contents` | `list` | A list of items to display. See [Item Models](#item-models) below. |
| `menus` | `list<string\|object>` | List of menu items to show in the app bar. Can be strings or objects with `label` (string) and optional `checked` (boolean) for checkbox items. |
| `append` | `list` | A list of items to append to the existing list (useful for pagination). |

### Item Models
Items in `contents.details` or `append.details` can be either `CardItemModel` or `SimpleListItemModel`.

#### CardItemModel (Default)
Used when `layout` is `'card'` or `'gallery'`.

| Key | Type | Description |
| :--- | :--- | :--- |
| `link` | `string` | Unique identifier/URL for the item. |
| `title` | `string` | Main title of the item. |
| `author` | `string` | Author name. |
| `avatar` | `string` | URL of the author's avatar. |
| `category` | `string` | Category name. |
| `memo` | `string` | Additional note/memo. |
| `date` | `string` | Date string. |
| `viewCount` | `string` | View count (displayed as text). Empty to hide. |
| `likeCount` | `string` | Like count (displayed as text). Empty to hide. |
| `commentCount` | `string` | Comment count (displayed as text). Empty to hide. |
| `dislikeCount` | `string` | Dislike count (displayed as text). Empty to hide. |
| `mediaUrl` | `string` | URL of the thumbnail or media. |
| `thumbnail` | `string` | URL of the high-res thumbnail/poster. Used instead of `mediaUrl` for display in list if provided. |
| `mediaType` | `string` | `'image'` or `'video'`. |
| `types` | `list<string>` | Tags like `'hot'`, `'image'`, `'video'`, `'link'`. |
| `hotCount` | `int` | Hot threshold count (for highlighting). |
| `coldCount` | `int` | Cold threshold count (for highlighting). |
| `menus` | `list<string>` | List of context menu items for this card. |

#### SimpleListItemModel
Used when `layout` is NOT `'card'` or `'gallery'`.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The text to display. |
| `...` | `any` | Any other keys provided in the object will be passed back in the `CLICK` event. |

## Events
The view sends the following events to the extension:

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `REFRESH` | Triggered when the user pulls to refresh. | None |
| `SCROLL_TO_END` | Triggered when the user scrolls to the bottom (if `pagination` is true). | None |
| `CLICK` | Triggered when an item is tapped. | `link`: Item link (Card). `title`: Item title. `_index`: Item index. All properties of the item object are included in the event data. |
| `ITEM_MENU_CLICK` | Triggered when an item's menu option is selected. | `menu`: The selected menu string. All properties of the item object are included in the event data. |
| `MENU_CLICK` | Triggered when a top-level app bar menu item is selected. | `menu`: The selected menu string. |
| `REORDER` | Triggered when an item is reordered. | `_newIndex`: New index. All properties of the item object are included in the event data. |
| `AUTHOR_CLICK` | Triggered when the author is clicked. | `link`: Item link. `author`: Author name. |
| `CATEGORY_CLICK` | Triggered when the category is clicked. | `link`: Item link. `category`: Category name. |

## Example Usage

```javascript
synura.open('/views/list', {
  styles: {
    title: "My List",
    layout: "card",
    pagination: true
  },
  models: {
    contents: [{
      link: "https://example.com/1",
      title: "First Item",
      author: "User A",
      viewCount: "100"
    }]
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
  models: {}
});
synura.connect(view.viewId, {}, (event) => {
  if (event.eventId === 'QUERY') {
    console.log('Search query:', event.data.query);
  }
});
```
