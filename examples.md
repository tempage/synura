# Synura Extension Examples

This document explains the example extensions found in the `examples/` directory.

## 1. Hello World (`examples/hello_world.js`)

A minimal extension that demonstrates the basic structure of a Synura extension.
- **Concepts**: `package` metadata, `handler.home` entry point, opening a static `list` view.

## 2. Wikipedia Featured Article (`examples/wikipedia_featured.js`)

An extension that displays the Wikipedia featured article of the day.
- **Concepts**:
    -   **Fetching Data**: Uses `fetch()` to get JSON data from the Wikimedia Feed API.
    -   **Dynamic Content**: Shows how to construct an API call with the current date.
    -   **Browser View**: Opens the full article in a browser view when an item is clicked.
