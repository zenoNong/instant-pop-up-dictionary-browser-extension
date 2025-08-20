// Create the context menu item on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "define",
    title: "Define '%s'", // '%s' shows the selected text in the menu
    contexts: ["selection"]
  });
});

// Function to handle injection and message sending (This is robust and correct)
function injectAndSendMessage(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content.js']
  }).then(() => {
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['styles.css']
    }).then(() => {
      chrome.tabs.sendMessage(tabId, message);
    }).catch(err => console.error("Error inserting CSS:", err));
  }).catch(err => console.error("Error executing script:", err));
}

// Listener for the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab.id === -1) {
    return;
  }
  if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://')) {
    return;
  }
  if (info.menuItemId === "define" && info.selectionText) {
    const message = { action: "show_definition", text: info.selectionText };
    injectAndSendMessage(tab.id, message);
  }
});

// Listener for messages from the POPUP
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggle_search_box_from_popup") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                const tab = tabs[0];
                if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://')) {
                  return;
                }
                const message = { action: "toggle_search_box" };
                injectAndSendMessage(tab.id, message);
            }
        });
    }
});

// --- NEW CODE STARTS HERE ---
// Listener for the keyboard shortcut command
chrome.commands.onCommand.addListener((command) => {
  if (command === "focus-search-box") {
    // Find the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const tab = tabs[0];
        if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://')) {
          return; // Do nothing on protected pages
        }
        // Send a new, specific message to focus the search box
        const message = { action: "show_and_focus_search_box" };
        injectAndSendMessage(tab.id, message);
      }
    });
  }
});
// --- NEW CODE ENDS HERE ---