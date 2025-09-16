// Get references to all the UI elements
const goalSettingView = document.getElementById('goal-setting-view');
const activeResearchView = document.getElementById('active-research-view');
const goalInput = document.getElementById('goal-input');
const startSessionBtn = document.getElementById('start-session-btn');
const currentGoal = document.getElementById('current-goal');
const endSessionBtn = document.getElementById('end-session-btn');
const addPageBtn = document.getElementById('add-page-btn');
const queryInput = document.getElementById('query-input');
const askBtn = document.getElementById('ask-btn');
const resultsContainer = document.getElementById('results-container');

// Function to switch between views
const renderView = () => {
    chrome.storage.local.get('userGoal', (data) => {
        if (data.userGoal) {
            // Active research session
            goalSettingView.classList.add('hidden');
            activeResearchView.classList.remove('hidden');
            currentGoal.textContent = `Goal: ${data.userGoal}`;
        } else {
            // Goal setting view
            goalSettingView.classList.remove('hidden');
            activeResearchView.classList.add('hidden');
            goalInput.value = ''; // Clear input
        }
    });
};

// Event listener for starting a session
startSessionBtn.addEventListener('click', () => {
    const goal = goalInput.value.trim();
    if (goal) {
        chrome.storage.local.set({ userGoal: goal }, () => {
            renderView();
        });
    }
});

// Event listener for ending a session
endSessionBtn.addEventListener('click', () => {
    chrome.storage.local.remove('userGoal', () => {
        renderView();
    });
});

// Listener for adding a page to knowledge
addPageBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        // Programmatically inject the scripts into the active tab
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['src/lib/Readability.js', 'src/content_script.js']
        }, () => {
            // After the scripts have been injected, send the message
            chrome.tabs.sendMessage(tab.id, { action: "extract_content" }, (response) => {
                if (chrome.runtime.lastError) {
                    resultsContainer.textContent = 'Error: Could not extract content. Please try again.';
                    console.error(chrome.runtime.lastError.message);
                    return;
                }

                if (response && response.content) {
                    resultsContainer.textContent = response.content;
                } else {
                    resultsContainer.textContent = 'No content extracted.';
                }
            });
        });
    });
});

// Placeholder listener for asking a question
askBtn.addEventListener('click', () => {
    const query = queryInput.value.trim();
    if (query) {
        console.log(`User asked: ${query}`);
        queryInput.value = ''; // Clear the input after asking
    }
});

// Initial render when the popup loads
renderView();
