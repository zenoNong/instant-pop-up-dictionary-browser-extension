# Instant Pop-up Dictionary Browser Extension

A stylish, modern browser extension for Chrome and Edge that provides word definitions on any webpage through a right-click context menu or a draggable manual search box.

## Table of Contents

1.  [Overview](#Overview)
2.  [Key Features](#key-features)
3.  [Installation](#installation)
4.  [Usage](#usage)
5.  [A Note on PDF Compatibility](#a-note-on-pdf-compatibility)
6.  [File Structure](#file-structure)
7.  [How It Works](#how-it-works)
8.  [Offline Capability](#offline-capability)

-----

## Overview

This extension enhances your browsing experience by providing instant word definitions without interrupting your workflow. Forget opening new tabs to look up a word. Simply select text and right-click, or use the sleek, draggable search box to manually find a definition. The UI is designed to be modern, stylish, and unobtrusive, featuring a dark theme with a glowing neon border and semi-transparent popups.

-----

## Key Features

  * ✨ **Dual-Mode Operation**: Look up words either by selecting text and right-clicking or by typing them into a manual search box.
  * 🎨 **Stylish & Modern UI**: A sleek, dark-themed search box with a colorful neon glow effect. It becomes semi-transparent when inactive to stay out of your way.
  * 🖱️ **Draggable Search Box**: Toggle the manual search box by clicking the extension's icon in your toolbar. You can drag it anywhere on the page.
  * 🧠 **Persistent Popups**: The definition popup stays visible as long as your mouse is hovering over it, giving you ample time to read.
  * 🌐 **API Powered**: Fetches rich and accurate definitions from the [Free Dictionary API](https://dictionaryapi.dev/).
  * 🚀 **Lightweight & Fast**: Built with modern, efficient code that only runs when you need it.

-----

## Installation

First, clone or download this repository to your local machine.

```bash
git clone https://github.com/zenoNong/instant-pop-up-dictionary-browser-extension.git
```

#### For Google Chrome

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** using the toggle switch in the top-right corner.
3.  Click the **Load unpacked** button.
4.  Select the directory where you cloned or downloaded the extension.

#### For Microsoft Edge

1.  Open Edge and navigate to `edge://extensions/`.
2.  Enable **Developer mode** using the toggle switch in the bottom-left corner.
3.  Click the **Load unpacked** button.
4.  Select the directory where you cloned or downloaded the extension.

-----

## Usage

#### 1\. Using the Context Menu (Right-Click)

1.  Navigate to any webpage.
2.  Select a word or phrase by highlighting it with your mouse.
3.  Right-click and choose **Define** from the context menu.
4.  A semi-transparent popup will display the definition near your selected text.

#### 2\. Using the Manual Search Box

1.  Click the extension's icon in your browser's toolbar. This will toggle the search box on the page.
2.  Drag the search box by its header to a convenient spot.
3.  Type a word into the input field and press `Enter` or click the **Define** button.
4.  The definition will appear in a popup just below the search box.

-----

## A Note on PDF Compatibility

Due to browser security policies, the extension's functionality is **limited** when viewing files in the browser's **built-in PDF reader**.

  * **Context Menu (Right-Click)**: This method will **not work** inside the native PDF viewer. The browser blocks the extension from displaying the definition popup for security reasons.

  * **Manual Search Box**: The search box **cannot be opened** while you are on a PDF page.

      * **Workaround**: There is a simple workaround for the manual search box.
        1.  First, open the search box on a regular webpage (like https://www.google.com/search?q=google.com).
        2.  Then, navigate to the PDF file in the **same tab**.
        3.  The search box will remain on-screen and will be fully functional.

For a seamless experience on PDFs, we recommend installing a third-party PDF viewer extension from the Chrome/Edge store that renders PDFs as standard HTML pages.

-----

## File Structure

| File | Description |
| :--- | :--- |
| `manifest.json` | The core configuration file for the extension (Manifest V3). Defines permissions, scripts, and actions. |
| `background.js` | The service worker. Handles creating the context menu and listening for all user actions (right-clicks, toolbar icon clicks) to inject scripts into the page. |
| `content.js` | The main script injected into webpages. It creates the UI (popups, search box), handles user interaction within the page, and fetches data from the API. |
| `popup.html` | The HTML for the tiny window that appears when the toolbar icon is clicked. Its sole purpose is to run `popup.js`. |
| `popup.js` | Sends a message to the background script when the toolbar icon is clicked, then immediately closes its window. |
| `styles.css` | Contains all the styling for the on-page elements, including the definition popup and the stylish manual search box. |
| `popup.css` | Basic styling for the temporary `popup.html` window. |
| `icon.png` | The extension's icon. |

-----

## How It Works

The extension uses a robust, event-driven architecture to remain efficient.

1.  **Action Trigger**: An action is initiated either by a **right-click** on selected text or a **left-click** on the extension's toolbar icon.
2.  **Message to Background**:
      * The right-click is captured directly by the `background.js` service worker.
      * The toolbar click opens `popup.html`, which runs `popup.js` to send a message to `background.js`.
3.  **Programmatic Injection**: The `background.js` script receives the signal and programmatically injects `content.js` and `styles.css` into the active tab. This ensures the extension only uses resources on a page when it's actively called.
4.  **UI & Data Fetching**: The injected `content.js` listens for the specific instruction (e.g., "show definition" or "toggle search box"). It then either creates the necessary UI or makes a `fetch` call to the Dictionary API to get the word's definition.
5.  **Display**: The fetched definition or UI element is then displayed on the page. A guard clause within `content.js` prevents it from running multiple times on the same page, avoiding errors.

-----

## Offline Capability

This extension **requires an active internet connection** to work. It is designed to be lightweight and fetches definitions in real-time from an online API. It does not store an offline dictionary, so it cannot function if you are disconnected from the internet.