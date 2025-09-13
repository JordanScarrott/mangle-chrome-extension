import geminiNanoService from './src/services/geminiNanoService.js';

const summarizeButton = document.getElementById("summarize-button");
const resultsContainer = document.getElementById("results");

summarizeButton.addEventListener("click", async () => {
  resultsContainer.innerHTML = 'Summarizing...';

  const canUseAI = await geminiNanoService.canUseAI();
  if (!canUseAI) {
    resultsContainer.innerHTML = 'AI not available. Please check your browser settings.';
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "extract_content" },
      async (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          resultsContainer.innerHTML = `Error: ${chrome.runtime.lastError.message}`;
          return;
        }

        if (response && response.content) {
          try {
            const summary = await geminiNanoService.summarizeText(response.content);
            const facts = await geminiNanoService.extractFacts(summary);
            resultsContainer.innerHTML = facts;
          } catch (error) {
            console.error("Error during summarization:", error);
            resultsContainer.innerHTML = 'An error occurred during summarization.';
          }
        } else {
          resultsContainer.innerHTML = 'Could not get content from the page.';
        }
      }
    );
  });
});
