chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'parsed-article') {
    console.log('Received article:', message.payload);
  }
});
