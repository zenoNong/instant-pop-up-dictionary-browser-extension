// This script runs when the popup is opened.

// Send a message to the background script to do the heavy lifting.
chrome.runtime.sendMessage({ action: "toggle_search_box_from_popup" });

// Close the popup window automatically.
window.close();