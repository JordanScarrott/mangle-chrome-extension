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

// Placeholder listener for adding a page
addPageBtn.addEventListener('click', () => {
    console.log('Adding page to knowledge...');
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
