/**
 * Simulates the Rust/Wasm engine.
 * @param {string} input - The input string for the mangle query.
 * @returns {Promise<object>} - A promise that resolves with the result of the query.
 */
export async function run_mangle_query(input) {
  return new Promise((resolve) => {
    if (input.includes("error")) {
      resolve({
        status: "error",
        message: "This is a mocked error message.",
      });
    } else {
      resolve({
        status: "success",
        data: [
          { id: 1, content: "Mocked data item 1" },
          { id: 2, content: "Mocked data item 2" },
        ],
      });
    }
  });
}
