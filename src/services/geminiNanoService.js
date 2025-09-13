/**
 * Simulates the on-device Gemini Nano APIs.
 */
const geminiNanoService = {
  /**
   * Simulates summarizing text.
   * @param {string} text - The text to summarize.
   * @returns {Promise<string>} - A promise that resolves with a mocked summary.
   */
  async summarizeText(text) {
    return Promise.resolve("This is a mocked summary of the text.");
  },

  /**
   * Simulates extracting facts from text.
   * @param {string} text - The text to extract facts from.
   * @returns {Promise<string>} - A promise that resolves with mocked facts.
   */
  async extractFacts(text) {
    return Promise.resolve("These are mocked facts from the text.");
  },

  /**
   * Simulates rewriting text.
   * @param {string} text - The text to rewrite.
   * @returns {Promise<string>} - A promise that resolves with a mocked rewrite.
   */
  async rewriteText(text) {
    return Promise.resolve("This is a mocked rewrite of the text.");
  },
};

export default geminiNanoService;
