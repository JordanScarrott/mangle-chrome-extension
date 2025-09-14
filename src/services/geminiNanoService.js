/**
 * @fileoverview Service for interacting with the Gemini Nano API.
 * This file uses the official `Summarizer` and `LanguageModel` APIs.
 */

/**
 * Checks if the AI APIs are available.
 * @returns {Promise<boolean>} True if the APIs are available, false otherwise.
 */
export async function canUseAI() {
    if (!self.Summarizer || !self.LanguageModel) {
        return false;
    }
    const summarizerAvailability = await self.Summarizer.availability();
    const languageModelAvailability = await self.LanguageModel.availability();
    return (
        summarizerAvailability !== "unavailable" &&
        languageModelAvailability !== "unavailable"
    );
}

/**
 * Summarizes the given text.
 * @param {string} text The text to summarize.
 * @returns {Promise<string>} The summarized text.
 */
export async function summarizeText(text) {
    if (!(await canUseAI())) {
        return "AI not available.";
    }

    const summarizer = await self.Summarizer.create();
    return await summarizer.summarize(text);
}

/**
 * Extracts facts from the given summary using the Language Model.
 * @param {string} summary The summary to extract facts from.
 * @returns {Promise<string>} The extracted facts.
 */
export async function extractFacts(summary) {
    if (!(await canUseAI())) {
        return "AI not available.";
    }

    const session = await self.LanguageModel.create();
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
