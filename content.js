// --- GUARD CLAUSE TO PREVENT RE-INJECTION ERRORS ---
(function() {
  if (window.hasRunDictionaryExtension) {
    return; // Stop the script from running again
  }
  window.hasRunDictionaryExtension = true;


  let definitionPopup = null;
  let manualSearchBox = null;
  let popupTimeout;

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "show_definition" && request.text) {
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      showDefinition(request.text, range);
    } else if (request.action === "toggle_search_box") {
      toggleManualSearchBox();
    }
  });

  // --- Definition Popup Logic ---

  async function showDefinition(selectedText, range) {
    // Remove existing popup if any
    if (definitionPopup) {
      definitionPopup.remove();
    }

    // Create the popup element
    definitionPopup = document.createElement("div");
    definitionPopup.id = "dictionary-popup-container";
    definitionPopup.innerHTML = `<div class="dictionary-popup-content"><div class="loader"></div></div>`;
    document.body.appendChild(definitionPopup);

    // Position the popup near the selection or center if no range
    positionPopup(range);

    // Fetch and display definition
    const definitionHTML = await fetchDefinition(selectedText);
    const contentDiv = definitionPopup.querySelector('.dictionary-popup-content');
    contentDiv.innerHTML = definitionHTML;

    // Add event listeners for persistence
    definitionPopup.addEventListener('mouseenter', () => clearTimeout(popupTimeout));
    definitionPopup.addEventListener('mouseleave', () => {
      popupTimeout = setTimeout(() => definitionPopup.remove(), 500);
    });
    
    // Initial timer to close the popup if mouse doesn't enter it
    popupTimeout = setTimeout(() => {
      if (definitionPopup) {
        definitionPopup.remove();
      }
    }, 4000);
  }

  function positionPopup(range) {
      if (range) {
          const rect = range.getBoundingClientRect();
          definitionPopup.style.top = `${rect.bottom + window.scrollY + 5}px`;
          definitionPopup.style.left = `${rect.left + window.scrollX}px`;
      } else {
          // Position near the search box if it exists, otherwise center
          if (manualSearchBox) {
              const boxRect = manualSearchBox.getBoundingClientRect();
              definitionPopup.style.top = `${boxRect.bottom + window.scrollY + 5}px`;
              definitionPopup.style.left = `${boxRect.left + window.scrollX}px`;
          } else {
              definitionPopup.style.top = '20%';
              definitionPopup.style.left = '50%';
              definitionPopup.style.transform = 'translateX(-50%)';
          }
      }
  }

  // --- API Fetching and Formatting ---

  async function fetchDefinition(word) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
          return `<div class="error-title">Definition not found</div><p>Please check the word and try again. Note that the dictionary is case-sensitive.</p>`;
      }
      const data = await response.json();
      return formatDefinition(data);
    } catch (error) {
      return `<div class="error-title">Error</div><p>Could not fetch definition. Please check your internet connection.</p>`;
    }
  }

  function formatDefinition(data) {
    const entry = data[0];
    if (!entry) return `<div class="error-title">Definition not found</div>`;

    let html = `<h3>${entry.word}</h3>`;
    if(entry.phonetic) {
      html += `<span class="phonetic">${entry.phonetic}</span>`;
    }
    
    html += '<div class="meanings-wrapper">';
    entry.meanings.forEach(meaning => {
      html += `<div class="part-of-speech">${meaning.partOfSpeech}</div><ul>`;
      meaning.definitions.slice(0, 3).forEach(def => { // Show max 3 definitions per part of speech
        html += `<li>${def.definition}`;
        if (def.example) {
          html += `<br><em class="example">"${def.example}"</em>`;
        }
        html += `</li>`;
      });
      html += `</ul>`;
    });
    html += '</div>';

    return html;
  }

  // --- Manual Search Box Logic ---

  function toggleManualSearchBox() {
    if (manualSearchBox) {
      manualSearchBox.remove();
      manualSearchBox = null;
    } else {
      createManualSearchBox();
    }
  }

  function createManualSearchBox() {
    manualSearchBox = document.createElement("div");
    manualSearchBox.id = "manual-search-box";
    manualSearchBox.innerHTML = `
      <div id="manual-search-header">
          <span>Dictionary Search</span>
          <button id="close-search-box">&times;</button>
      </div>
      <div id="manual-search-content">
          <input type="text" id="manual-search-input" placeholder="Enter a word...">
          <button id="manual-search-button">Define</button>
      </div>
    `;
    document.body.appendChild(manualSearchBox);

    // Add event listeners
    document.getElementById('close-search-box').onclick = toggleManualSearchBox;
    
    const searchInput = document.getElementById('manual-search-input');
    const searchButton = document.getElementById('manual-search-button');

    searchButton.onclick = () => {
      if(searchInput.value) showDefinition(searchInput.value, null);
    };
    
    searchInput.onkeydown = (e) => {
      if (e.key === 'Enter' && searchInput.value) showDefinition(searchInput.value, null);
    };

    makeDraggable(manualSearchBox);
  }

  function makeDraggable(element) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      const header = element.querySelector("#manual-search-header");

      if (header) {
          header.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          element.style.top = (element.offsetTop - pos2) + "px";
          element.style.left = (element.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
      }
  }

// --- END OF THE WRAPPER FUNCTION ---
})();