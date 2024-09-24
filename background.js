// background.js
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    highlightSize: 'line',
    highlightColor: '#FFFF00',
    highlightOpacity: 0.3,
    isHighlighting: true
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateProgress") {
    chrome.runtime.sendMessage({action: "updateProgress", progress: request.progress});
  }
});
