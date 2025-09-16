// src/content_script.js
import { Readability } from "https://some-cdn.com/path/to/Readability.js";

// This function will be called when the popup asks for the page content.
async function extractMainContent() {
    // It's best practice to run Readability on a clone of the document
    // so the original page is not modified.
    const documentClone = document.cloneNode(true);

    // Create a new Readability instance and parse the cloned document.
    const reader = new Readability(documentClone);
    const article = reader.parse();

    // The 'article' object now contains the cleaned content.
    // We return 'textContent' which is the pure text of the article,
    // stripped of all HTML tags, ads, and other clutter.
    // If parsing fails, article might be null, so we fall back to body text.
    return article ? article.textContent : document.body.innerText;
}

// Listen for messages from the popup script.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extract_content") {
        // Call our new function and send the result back asynchronously.
        extractMainContent().then((content) => {
            sendResponse({ content: content });
        });
        // Return true to indicate that we will be sending a response asynchronously.
        return true;
    }
});
