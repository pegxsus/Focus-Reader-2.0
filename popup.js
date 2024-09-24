// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const highlightSize = document.getElementById('highlightSize');
  const highlightColor = document.getElementById('highlightColor');
  const highlightOpacity = document.getElementById('highlightOpacity');
  const toggleHighlight = document.getElementById('toggleHighlight');
  const summarizeBtn = document.getElementById('summarize');
  const progressDiv = document.getElementById('progress');

  // Load saved settings
  chrome.storage.sync.get(['highlightSize', 'highlightColor', 'highlightOpacity', 'isHighlighting'], function(data) {
    highlightSize.value = data.highlightSize || 'line';
    highlightColor.value = data.highlightColor || '#FFFF00';
    highlightOpacity.value = data.highlightOpacity || 0.3;
    toggleHighlight.textContent = data.isHighlighting ? 'Pause Highlighting' : 'Resume Highlighting';
  });

  // Save settings when changed
  highlightSize.addEventListener('change', saveSettings);
  highlightColor.addEventListener('change', saveSettings);
  highlightOpacity.addEventListener('input', saveSettings);

  function saveSettings() {
    chrome.storage.sync.set({
      highlightSize: highlightSize.value,
      highlightColor: highlightColor.value,
      highlightOpacity: highlightOpacity.value
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "updateSettings"});
    });
  }

  toggleHighlight.addEventListener('click', function() {
    chrome.storage.sync.get('isHighlighting', function(data) {
      const newState = !data.isHighlighting;
      chrome.storage.sync.set({isHighlighting: newState});
      toggleHighlight.textContent = newState ? 'Pause Highlighting' : 'Resume Highlighting';
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleHighlight", state: newState});
      });
    });
  });

  summarizeBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "summarize"});
    });
  });

  // Listen for progress updates
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateProgress") {
      progressDiv.textContent = `Reading Progress: ${request.progress}%`;
    }
  });
});
