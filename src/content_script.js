chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract_content') {
    const content = document.body.innerText;
    sendResponse({ content });
  }
});
