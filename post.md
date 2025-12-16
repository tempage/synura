# Post View Documentation

The Post View is designed to display a single article or post, including its content (text, images, videos) and comments.

## View Path
`/views/post`

## Styles
The `styles` object controls the appearance and behavior of the view.

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed in the app bar. |
| `appbar` | `object` or `string` | Customizes the app bar. See [List View](list.md#styles) for details. |
| `menu` | `boolean` | If `true`, enables the options menu in the app bar. |
| `authorClickable` | `boolean` | If `true`, enables the author click event. |

## Models
The `models` object contains the data to be displayed.

### Top-Level Fields

| Key | Type | Description |
| :--- | :--- | :--- |
| `link` | `string` | The unique identifier or URL for the post. |
| `author` | `string` | The name of the post author. |
| `memo` | `string` | Additional info displayed next to the author. |
| `avatar` | `string` | URL of the author's avatar image. |
| `date` | `string` | The date or time string of the post. |
| `viewCount` | `number` | Number of views. |
| `likeCount` | `number` | Number of likes. |
| `dislikeCount` | `number` | Number of dislikes. |
| `menus` | `list<string>` | List of menu items to show if `menu` style is true. |
| `content` | `value` | Contains the main content of the post (string or list of content items). See below. |
| `comments` | `object` | Contains the list of comments. See below. |

### Content Object
The `content` object has a `details` field which is a list of content items. Each item is an object with a `type` and other properties, or a simple string.

| Type | Field | Description |
| :--- | :--- | :--- |
| `text` | `value` | The text content to display. |
| `image`| `value` | The URL of the image to display. |
| `video`| `value` | The URL of the video to play. Supports 'rtsp' protocol. |
| `link` | `value` | The text to display for the link. If the URL is a YouTube link, it will be automatically converted to a media player. |

You can automatically generate the `details` array from a DOM element using the `synura.parse('post', element)` API.

```json
"content": [
  { "type": "text", "value": "Some text content" },
  { "type": "image", "value": "https://example.com/image.jpg" },
  { "type": "video", "value": "https://example.com/video.mp4" },
  { "type": "link", "value": "Click here", "link": "https://example.com" }
]
```

### Comments Object
The `comments` object has a `details` field which is a list of comment objects.

| Key | Type | Description |
| :--- | :--- | :--- |
| `link` | `string` | Unique identifier or URL for the comment. |
| `author` | `string` | Commenter name. |
| `avatar` | `string` | URL of the commenter's avatar. |
| `memo` | `string` | Additional info about the commenter. |
| `date` | `string` | Date string. |
| `content` | `value` | Comment content (string or list of content items). |
| `likeCount` | `number` | Number of likes. |
| `dislikeCount` | `number` | Number of dislikes. |
| `level` | `number` | Nesting level (0 for root, 1 for reply, etc.). |

```json
"comments": [
  {
    "link": "https://example.com/comment/1",
    "author": "Commenter Name",
    "avatar": "https://example.com/avatar.jpg",
    "memo": "Additional info about the commenter",
    "date": "2023-10-27",
    "content": "This is a comment.", // Can be string or list of content items
    "likeCount": 10,
    "dislikeCount": 0,
    "level": 0 // Nesting level (0 for root, 1 for reply, etc.)
  }
]
```

## Events
The view sends the following events to the extension:

| Event ID | Description | Data |
| :--- | :--- | :--- |
| `REFRESH` | Triggered when the user pulls to refresh. | None |
| `SCROLL_TO_END` | Triggered when the user scrolls to the bottom. | None |
| `MENU_CLICK` | Triggered when a menu item is selected. | `menu`: The selected menu string. `link`: The post link. |
| `AUTHOR_CLICK` | Triggered when the author is clicked. | `link`: The post link. `author`: The author name. |

## Example Usage

```javascript
synura.open('/views/post', {
    styles: {
        title: "Post Title",
        menu: true
    },
    models: {
        link: "https://example.com/post/1",
        author: "Author Name",
        content: [
            "Simple text content",
            { type: "image", value: "https://example.com/image.jpg" }
        ]
    }
});
```
