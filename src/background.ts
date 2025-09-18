// This script runs as a background service worker for the extension

chrome.runtime.onMessage.addListener(
    (
        message: { type: string; payload?: any },
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => {
        // Handle the existing message type for parsed articles
        if (message.type === "parsed-article") {
            console.log("Received article:", message.payload);
        }

        // --- New Feature: Handle text sent from the content script ---
        else if (message.type === "ADD_TO_KNOWLEDGE") {
            // This is where the text will be processed.
            // For now, we'll just log it to confirm it was received.
            console.log("Text received for processing:", message.payload);

            // Later, this could be sent to a service like Gemini Nano
            // for summarization or storage.
        }
    }
);
