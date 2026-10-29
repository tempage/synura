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
| `authorClickable` | `boolean` | If `true`, enables the author click event. |
| `categoryClickable` | `boolean` | If `true`, enables the category click event. |
| `fullWidth` | `boolean` | If `true`, removes horizontal padding from the post body, fits body images to the available width, and hides the hot/cold side borders on the post and comments. Defaults to `false`. See [Full-width image posts](#full-width-image-posts). |
| `hotThreshold` | `number` | The threshold for displaying the "hot" (left) border for the post body and comments (if comment specific threshold is not set). |
| `coldThreshold` | `number` | The threshold for displaying the "cold" (right) border for the post body and comments (if comment specific threshold is not set). |
| `commentHotThreshold` | `number` | The threshold for displaying the "hot" (left) border for comments. Overrides `hotThreshold` for comments. |
| `commentColdThreshold` | `number` | The threshold for displaying the "cold" (right) border for comments. Overrides `coldThreshold` for comments. |

### Full-width image posts

Set `styles.fullWidth` to `true` for image galleries, webtoons, or other posts whose images should fill the available content width:

- Removes the post body's left and right padding.
- Fits body images to the available width while preserving their aspect ratio, including enlarging smaller images.
- Hides the left/right hot and cold borders on both the post body and comments, even when `hotThreshold`, `coldThreshold`, `commentHotThreshold`, or `commentColdThreshold` is set.

The default is `false`, which uses the normal body padding and threshold-based borders. With `fullWidth: true`, vertical image spacing still applies; headers and comments use their usual padding, and comments retain their nesting indentation and image sizing.

```javascript
synura.open({
  view: '/views/post',
  styles: {
    title: "Image Gallery",
    fullWidth: true
  },
  models: {
    content: [
      { type: "image", value: "https://example.com/page-1.jpg" },
      { type: "image", value: "https://example.com/page-2.jpg" }
    ]
  }
});
```

## Models
The `models` object contains the data to be displayed.

### Top-Level Fields

| Key | Type | Description |
| :--- | :--- | :--- |
| `link` | `string` | The unique identifier or URL for the post. |
| `category` | `string` | Category name displayed as a badge. |
| `author` | `string` | The name of the post author. |
| `memo` | `string` | Additional info displayed next to the author. |
| `avatar` | `string` | URL of the author's avatar image. |
| `date` | `string` | The date or time string of the post. |
| `viewCount` | `string` | View count (displayed as text). Empty to hide. |
| `likeCount` | `string` | Like count (displayed as text). Empty to hide. |
| `dislikeCount` | `string` | Dislike count (displayed as text). Empty to hide. |
| `hotCount` | `number` | Count used for calculating the "hot" border intensity for the post body. |
| `coldCount` | `number` | Count used for calculating the "cold" border intensity for the post body. |
| `menus` | `list<string\|object>` | List of menu items to show in the app bar. Can be strings or objects with `label` (string) and optional `checked` (boolean) for checkbox items. |
| `buttons` | `list<string>` | List of buttons to show at the bottom of the post. |
| `content` | `value` | Contains the main content of the post (string or list of content items). See below. |
| `comments` | `object` | Contains the list of comments. See below. |

### Content Object
The `content` object has a `details` field which is a list of content items. Each item is an object with a `type` and other properties, or a simple string.

| Type | Field | Description |
| :--- | :--- | :--- |
| `text` | `value` | The text content to display. |
| `image`| `value` | The URL of the image to display. |
| `video`| `value` | The URL of the video to play. Supports 'rtsp' protocol. |
| `thumbnail`| `value` | The URL of the high-res thumbnail/poster for video content. |
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
| `likeCount` | `string` | Like count (displayed as text). Empty to hide. |
| `dislikeCount` | `string` | Dislike count (displayed as text). Empty to hide. |
| `hotCount` | `number` | Count used for calculating the "hot" border intensity for this comment. |
| `coldCount` | `number` | Count used for calculating the "cold" border intensity for this comment. |
| `level` | `number` | Nesting level (0 for root, 1 for reply, etc.). |
| `menus` | `list<string>` | Menu items to show in the comment's overflow menu (3-dot icon). |

```json
"comments": [
  {
    "link": "https://example.com/comment/1",
    "author": "Commenter Name",
    "avatar": "https://example.com/avatar.jpg",
    "memo": "Additional info about the commenter",
    "date": "2023-10-27",
    "content": "This is a comment.", // Can be string or list of content items
    "likeCount": "10",
    "dislikeCount": "0",
    "level": 0, // Nesting level (0 for root, 1 for reply, etc.)
    "menus": ["Reply", "Report"] // Optional: Menu items for this comment
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
| `CATEGORY_CLICK` | Triggered when the category is clicked. | `link`: The post link. `category`: The category name. |
| `SUBMIT` | Triggered when a button is clicked. | `button`: The text of the clicked button. |
| `ITEM_MENU_CLICK` | Triggered when a comment menu item is selected. | `menu`: The selected menu string. All comment fields (author, date, content, etc.). |

## Example Usage

```javascript
synura.open('/views/post', {
  styles: {
    title: "Post Title"
  },
  models: {
    link: "https://example.com/post/1",
    author: "Author Name",
    content: ["Simple text content", {
      type: "image",
      value: "https://example.com/image.jpg"
    }],
    buttons: ["Like", "Share"]
  }
});
```
