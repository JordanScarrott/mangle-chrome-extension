chrome.runtime.onMessage.addListener(
    (
        message: { type: string; payload?: any },
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => {
        if (message.type === "parsed-article") {
            console.log("Received article:", message.payload);
        }
    }
);
