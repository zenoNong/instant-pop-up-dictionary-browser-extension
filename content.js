// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "define" && request.text) {
    showDefinition(request.text);
  }
});

async function showDefinition(selectedText) {
  // Create the popup element
  const popup = document.createElement("div");
  popup.id = "dictionary-popup";
  popup.style.position = "absolute";
  popup.style.backgroundColor = "white";
  popup.style.border = "1px solid #ddd";
  popup.style.padding = "10px";
  popup.style.zIndex = 1000;
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";

  // Fetch the definition from a dictionary API
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`);
    const data = await response.json();
    if (data && data[0] && data[0].meanings && data[0].meanings[0].definitions[0].definition) {
      popup.innerText = data[0].meanings[0].definitions[0].definition;
    } else {
      popup.innerText = "Definition not found.";
    }
  } catch (error) {
    popup.innerText = "Error fetching definition.";
  }

  // Append the popup to the body
  document.body.appendChild(popup);

  // Position the popup near the selection
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
  }

  // Remove the popup after a few seconds
  setTimeout(() => {
    if (popup) {
      popup.remove();
    }
  }, 5000);
}
