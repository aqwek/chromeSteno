document.addEventListener('DOMContentLoaded', function () {
  const enableTranslationCheckbox = document.getElementById('enableTranslation');
  const translationOutput = document.getElementById('translationOutput');

  enableTranslationCheckbox.addEventListener('change', function () {
    if (enableTranslationCheckbox.checked) {
      // Enable translation
      translationOutput.textContent = "Translation is enabled.";
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: () => enableTranslation(),
        });
      });
    } else {
      // Disable translation
      translationOutput.textContent = "Translation is disabled.";
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: () => disableTranslation(),
        });
      });
    }
  });

  // Load the initial state from chrome.storage
  chrome.storage.sync.get('translationEnabled', function (data) {
    if (data.hasOwnProperty('translationEnabled')) {
      enableTranslationCheckbox.checked = data.translationEnabled;
    }
  });

  // Listen for changes to the checkbox
  enableTranslationCheckbox.addEventListener('change', function () {
    // Update the state in chrome.storage when the checkbox is toggled
    chrome.storage.sync.set({ 'translationEnabled': enableTranslationCheckbox.checked });
  });
});
