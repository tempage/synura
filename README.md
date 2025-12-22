# Welcome to Synura!

## What is Synura?
Synura is a versatile application that lets you browse content from various sources using powerful mini-apps called "extensions". Think of it as a browser, but instead of websites, you use extensions to get content in a clean, native-app format.

## Core Concepts for Users

*   **Extension Discovery**: Enter a domain (e.g., `example.com` or `https://example.com`) to automatically fetch the `synura.js` file from that domain. If no protocol is provided, `https://` is used by default. This is the primary way to install extensions from their official websites.
*   **Direct Installation**: Enter a full URL (e.g., `https://raw.githubusercontent.com/user/repo/main/synura.js`) to install a specific extension script. **Security Note**: This method is restricted to trusted domains (like GitHub, GitLab, etc.) to prevent malicious code execution. Do not use this for general domains.
*   **Whitelist Validation**: Direct URL installations are validated against a whitelist of allowed domains for security. Domain discovery bypasses this check to allow exploration.
*   **Extensions**: These are small plugins that fetch and display content. For example, you could have an extension for a news site, a video platform, or a social media feed. You can install new extensions to expand what you can do with Synura.
*   **Runtimes**: When you open an extension, it runs in a "runtime". You can have multiple runtimes open at once, just like having multiple tabs in a web browser. Each runtime is a separate instance of an extension. You can switch between them, and even have multiple runtimes for the same extension.
*   **Bookmarks**: Found something interesting? You can bookmark the current view to save it for later. A bookmark saves the exact state of the view, so you can come back to it anytime.

## Getting Around the App

### The Main Screen
The main screen of the app is where you manage your runtimes. The top bar (app bar) is your main navigation tool.

### The App Bar

The app bar has several icons:

*   **`+` (Add)**: Tap this to open a new runtime. You can pick an installed extension or enter a website domain to install a new one.
*   **Dropdown Menu (center)**: This shows the currently active runtime. Tap it to see a list of all your open runtimes and switch between them. You can also swipe left or right on the dropdown to quickly switch.
*   **`X` (Close)**: This closes the current runtime.
*   **`☆` (Add Bookmark)**: Tap this to save the current view to your bookmarks.
*   **`🔖` (Bookmarks)**: This takes you to your list of saved bookmarks.
*   **`⚙️` (Settings)**: This opens the settings screen, where you can customize Synura.

If the screen is too narrow, these options will be collapsed into a three-dot menu on the right.

### AI Button (`✨`)
Tap the **AI button** in the app bar to open the **AI Menu Dialog**. This gives you on-demand AI-powered features for the current view:

*   **Summary**: Get a quick AI-generated summary of the content on screen.
*   **Translate**: Translate the content to your target language (configured in AI Settings).
*   **Custom Prompt**: Enter your own instructions for the AI to analyze the content.
*   **Share to External AI**: Export the current view's content to external AI apps like ChatGPT or Gemini on your device.
*   **Cache Toggle**: Control whether to use cached AI results or force a fresh analysis.

For detailed AI configuration, go to **Settings > AI Settings** where you can:
*   Configure your preferred AI provider (Gemini, OpenAI, DeepSeek, Claude).
*   Set source and target languages for translation.
*   Choose analysis depth and profile (Summary, Explain, Simplify, Fact Check, Critique, Insight).
*   Adjust summary length preferences.
*   View token usage statistics.
*   Manage API keys for each provider.

### Bookmarks
The bookmarks screen shows all your saved views.

*   **View Snapshot**: Tapping a bookmark opens a **cached snapshot** of the page as it was when you saved it. This is great for quickly referencing information without needing an internet connection.
*   **Restore View**: To interact with the page again (e.g., click links, refresh data), look for the **restore icon**. Tapping this will reconnect to the extension and bring the view back to life in a new runtime.

## Settings (`⚙️`)

The settings screen allows you to fine-tune almost every aspect of your Synura experience.

### Extensions
*   **Install New Extensions**: Tap the **`+`** button in the app bar and enter the website domain (e.g., `https://example.com`). If the site supports Synura, the extension will be automatically discovered and installed.
*   **Manage Extensions**: Tap **Manage** to see a list of your installed extensions, where you can update or remove them.

### Appearance
*   **Adjust Content Density**: Use the slider to make content appear more spread out or more compact. You'll see a live preview of how it affects lists and cards.
*   **Color Theme**: Personalize the app's look by choosing between **Light**, **Dark**, and **Monokai** color schemes.
*   **Font Weight**: Adjust the text boldness to your preference (e.g., light, regular, bold).
*   **Language**: Set the application language. You can choose a specific language or have it follow your system's default.

### Behavior
*   **Network Timeout**: Set how long the app should wait for a response from a network request, from 1 to 60 seconds.
*   **Proxy Settings**: Configure a proxy server for network requests.
*   **Cache Settings**: Manage the application's cache, including clearing cached data to free up space.
*   **GIF Animation**: Control how animated GIFs play: **Off** (static image), **Once** (play one time), or **Loop** (play continuously).

### Video & Audio
*   **Video Autoplay**: A switch to control if videos start playing automatically when they appear on screen.
*   **Video Background Play**: Enable this to keep hearing the audio from a video even after you navigate away or switch to another app.
*   **Mix with Others**: Allow audio from Synura to play at the same time as audio from other apps.
*   **Live Playback DVR Hours**: For live streams, choose how many hours of the broadcast to keep available for seeking backward (from 0 to 6 hours).

### Privacy & Security
*   **Manage Settings**: Configure various privacy and security options to control what data is stored and shared.

### About
*   **Open Source Licenses**: View the licenses of the open-source software that helps power Synura.

---
*This document is for end-users. For developer documentation, please see [Getting Started](getting_started.md), the [API Reference](api_reference.md), and [Examples](examples.md).*
