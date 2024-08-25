# instant-pop-up-dictionary-browser-extension
A simple Chrome extension that provides word definitions for selected text on any webpage.
Table of Contents
Overview
Features
Installation
Usage
Files and Structure
How It Works
Contributing
License
Overview
This Chrome extension allows users to quickly get definitions for words they select on any webpage. The definition appears in a floating popup near the selected text.

Features
Instant Definitions: Highlight any word and right-click to get its definition.
Simple UI: Lightweight and unobtrusive design.
API Powered: Fetches definitions using the Free Dictionary API.
Installation
Clone or Download this Repository:
bash
Copy code
git clone https://github.com/your-username/dictionary-chrome-extension.git
Load the Extension in Chrome:
Open Chrome and go to chrome://extensions/.
Enable Developer mode (toggle switch in the top right).
Click Load unpacked and select the directory of the extension.
Usage
After installing, navigate to any webpage.
Select any word or phrase by highlighting it with your mouse.
Right-click and choose Define from the context menu.
A floating popup will display the definition near your selected text.
Files and Structure
manifest.json: Configuration file for the extension.
background.js: Handles context menu creation and messaging.
content.js: Fetches and displays definitions when text is selected.
popup.html: Basic UI component, though not used for definition display.
popup.css: Styles for the floating popup.
File Descriptions
manifest.json
The main configuration file for Chrome extensions, specifying permissions, scripts, and actions.

background.js
Handles background processes such as creating context menus and communicating with content scripts.

content.js
Injected into web pages, listens for messages from the background script, and performs the core function of fetching and displaying definitions.

popup.html & popup.css
Provide the basic interface and styling for any popups or UIs used by the extension.

How It Works
Context Menu Creation: The extension creates a right-click context menu option, "Define", when it is installed or updated.
Script Injection and Messaging: When "Define" is selected, the background script injects the content script into the current tab.
Definition Retrieval: The content script fetches the definition of the selected word using a dictionary API.
Popup Display: The fetched definition is displayed in a styled popup near the text selection.
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes.
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch).
Open a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
