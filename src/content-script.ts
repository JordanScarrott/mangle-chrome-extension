// This script runs in the context of the webpage
import { Readability } from "@mozilla/readability";

// Keep the existing functionality for article parsing
const article = new Readability(document.cloneNode(true)).parse();
if (article) {
    chrome.runtime.sendMessage({
        type: "parsed-article",
        payload: article,
    });
}

// --- New Feature: Text Selection "Add to Knowledge" Button ---

let azeriteButton: HTMLButtonElement | null = null;

// Function to remove the button from the DOM
const removeButton = () => {
    if (azeriteButton) {
        azeriteButton.remove();
        azeriteButton = null;
    }
};

// Listen for mouseup event to detect text selection
document.addEventListener('mouseup', (event) => {
    // We don't want to show the button if we're clicking on our own button
    if (event.target === azeriteButton) {
        return;
    }

    const selectedText = window.getSelection()?.toString().trim();

    // Remove any existing button first
    removeButton();

    if (selectedText) {
        // --- LOG 1: Text has been selected ---
        console.log('Mangle Extension: Text selected:', selectedText);

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Create the "Add to Knowledge" button
        azeriteButton = document.createElement('button');
        azeriteButton.textContent = 'Add to Knowledge';

        // Style the button
        Object.assign(azeriteButton.style, {
            position: 'absolute',
            top: `${window.scrollY + rect.top - 40}px`, // Position above the selection
            left: `${window.scrollX + rect.left}px`,
            zIndex: '9999',
            backgroundColor: '#2a2a2e',
            color: '#e0e0e0',
            border: '1px solid #4a4a4e',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            fontFamily: 'sans-serif',
            fontSize: '14px'
        });

        // Add click handler to send data to background script
        azeriteButton.addEventListener('click', () => {
            // --- LOG 3: Button clicked ---
            console.log('Mangle Extension: "Add to Knowledge" button clicked. Sending text:', selectedText);
            chrome.runtime.sendMessage({
                type: 'ADD_TO_KNOWLEDGE',
                payload: selectedText
            });
            removeButton(); // Remove button after clicking
        });

        document.body.appendChild(azeriteButton);
        // --- LOG 2: Button has been created and appeared ---
        console.log('Mangle Extension: "Add to Knowledge" button appeared.');
    }
});

// Add a listener to remove the button if the user clicks away
document.addEventListener('mousedown', (event) => {
    if (azeriteButton && event.target !== azeriteButton) {
        removeButton();
    }
});
