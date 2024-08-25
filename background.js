chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "define",
    title: "Define",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "define" && info.selectionText) {
    // Send a message to the content script with the selected text
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tab.id, { action: "define", text: info.selectionText });
    });
  }
});
