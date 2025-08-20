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
  // --- ADDED CHECK FOR INVALID TAB ID ---
  if (tab.id === -1) {
    return; // Stop execution for invalid tab contexts like some PDF viewers
  }

  // --- ADDED CHECK FOR PROTECTED URLS ---
  if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://')) {
    return; // Do nothing on protected pages
  }

  if (info.menuItemId === "define" && info.selectionText) {
    const message = { action: "show_definition", text: info.selectionText };
    injectAndSendMessage(tab.id, message);
  }
});

// Listener for messages from the POPUP
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check if the message is from our popup to toggle the search box
    if (message.action === "toggle_search_box_from_popup") {
        // Find the current active tab
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                const tab = tabs[0];
                // --- ADDED CHECK FOR PROTECTED URLS ---
                if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://')) {
                  return; // Do nothing on protected pages
                }
                
                // Use our reliable function to inject scripts and send the message
                const message = { action: "toggle_search_box" };
                // --- THIS LINE IS NOW CORRECTED ---
                injectAndSendMessage(tab.id, message);
            }
        });
    }
});