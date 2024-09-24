// content.js
let currentHighlight = null;
let isHighlighting = true;
let highlightSize = 'line';
let highlightColor = '#FFFF00';
let highlightOpacity = 0.3;

function updateHighlight() {
  if (!isHighlighting) return;

  const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
  const viewportHeight = window.innerHeight;
  let found = false;

  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= viewportHeight && !found) {
      if (currentHighlight) currentHighlight.style.backgroundColor = '';
      element.style.backgroundColor = highlightColor;
      element.style.opacity = highlightOpacity;
      currentHighlight = element;
      found = true;

      // Calculate and send progress
      const progress = Math.round((Array.from(elements).indexOf(element) + 1) / elements.length * 100);
      chrome.runtime.sendMessage({action: "updateProgress", progress: progress});
    }
  });
}

function summarizeContent() {
  const text = document.body.innerText;
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
  const summary = sentences.slice(0, 3).join(' '); // Simple summary: first 3 sentences
  alert(`Summary:\n${summary}`);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateSettings") {
    chrome.storage.sync.get(['highlightSize', 'highlightColor', 'highlightOpacity'], function(data) {
      highlightSize = data.highlightSize;
      highlightColor = data.highlightColor;
      highlightOpacity = data.highlightOpacity;
      updateHighlight();
    });
  } else if (request.action === "toggleHighlight") {
    isHighlighting = request.state;
    if (!isHighlighting && currentHighlight) {
      currentHighlight.style.backgroundColor = '';
    }
    if (isHighlighting) updateHighlight();
  } else if (request.action === "summarize") {
    summarizeContent();
  }
});

window.addEventListener('scroll', updateHighlight);
window.addEventListener('resize', updateHighlight);
document.addEventListener('DOMContentLoaded', updateHighlight);
