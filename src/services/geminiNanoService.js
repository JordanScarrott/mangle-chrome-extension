/**
 * @fileoverview Service for interacting with the Gemini Nano API.
 */

/**
 * Checks if the AI API is available.
 * @returns {Promise<boolean>} True if the API is available, false otherwise.
 */
export async function canUseAI() {
  return window.ai && await window.ai.canCreateSummarizer() && await window.ai.canCreateTextSession();
}

/**
 * Summarizes the given text.
 * @param {string} text The text to summarize.
 * @returns {Promise<string>} The summarized text.
 */
export async function summarizeText(text) {
  if (!await canUseAI()) {
    return 'AI not available.';
  }

  const summarizer = await window.ai.createSummarizer();
  return await summarizer.prompt(text);
}

/**
 * Extracts facts from the given summary.
 * @param {string} summary The summary to extract facts from.
 * @returns {Promise<string>} The extracted facts.
 */
export async function extractFacts(summary) {
  if (!await canUseAI()) {
    return 'AI not available.';
  }

  const session = await window.ai.createPromptSession();
  const prompt = `
    Extract the key facts from the following text and present them as a list of Mangle facts.
    Each fact should be a short, declarative statement.
    For example:
    - "The sky is blue."
    - "The grass is green."
    - "The sun is bright."

    Text: "${summary}"
  `;
  return await session.prompt(prompt);
}

export default { canUseAI, summarizeText, extractFacts };
