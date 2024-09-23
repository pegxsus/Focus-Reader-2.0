// 
let speed = 300;  // Speed of the highlighting (in milliseconds)
let isHighlighting = true;
let currentWordIndex = 0;
let words = [];

// Function to split text content into words
function extractTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  const textNodes = [];
  
  while (node = walker.nextNode()) {
    if (node.nodeValue.trim().length > 0) {
      textNodes.push(node);
    }
  }
  
  return textNodes;
}

// Function to highlight word by word
function highlightWordByWord() {
  const textNodes = extractTextNodes();
  
  textNodes.forEach(node => {
    let text = node.nodeValue.trim();
    if (text.length > 0) {
      const wordsArray = text.split(/\s+/);
      words = words.concat(wordsArray);
    }
  });
  
  let highlightInterval = setInterval(() => {
    if (!isHighlighting || currentWordIndex >= words.length) {
      clearInterval(highlightInterval);
      return;
    }

    const word = words[currentWordIndex];
    highlightWord(word);
    currentWordIndex++;
  }, speed);
}

// Function to highlight the current word
function highlightWord(word) {
  const range = document.createRange();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

  let node;
  while (node = walker.nextNode()) {
    const index = node.nodeValue.indexOf(word);
    
    if (index !== -1) {
      range.setStart(node, index);
      range.setEnd(node, index + word.length);
      
      const highlightSpan = document.createElement('span');
      highlightSpan.style.backgroundColor = '#FFFF00';  // Yellow highlight
      highlightSpan.style.transition = 'background-color 0.5s ease';
      range.surroundContents(highlightSpan);
      break;
    }
  }
}

// Listen for settings update from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateSpeed') {
    speed = request.speed;
  } else if (request.action === 'toggleHighlight') {
    isHighlighting = !isHighlighting;
    if (isHighlighting) {
      highlightWordByWord();
    }
  }
});

// Initialize the word-by-word highlighter when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  highlightWordByWord();
});
