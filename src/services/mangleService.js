// src/services/mangleService.js

// Import the initializer and the core function from the Wasm package.
import init, {
    run_mangle_query as runMangleWasm,
} from "../pkg/mangle_wasm_wrapper.js";

// Wasm modules need to be initialized asynchronously. We create a promise
// that resolves once the module is loaded. This prevents us from trying
// to use the Wasm module before it's ready.
const initPromise = init();

/**
 * Executes a Mangle query using the compiled Rust/Wasm module.
 *
 * @param {string} input - A string containing Mangle facts, rules, and a final query atom.
 * @returns {Promise<object>} A promise that resolves with the result object from the Wasm module.
 */
export async function run_mangle_query(input) {
    // Wait for the Wasm module to be fully initialized.
    await initPromise;

    try {
        // Call the real Wasm function.
        const resultString = runMangleWasm(input);

        // The Wasm function returns a JSON string, so we parse it.
        const result = JSON.parse(resultString);

        // Return the parsed result object (e.g., { status: 'success', data: [...] }).
        return result;
    } catch (error) {
        console.error("Error executing Mangle Wasm query:", error);
        // Return a structured error that matches our expected format.
        return {
            status: "error",
            message:
                error.message ||
                "An unknown error occurred in the Wasm module.",
        };
    }
}

/**
 * Simulates the Rust/Wasm engine.
 * @param {string} input - The input string for the mangle query.
 * @returns {Promise<object>} - A promise that resolves with the result of the query.
 */
export async function run_mock_mangle_query(input) {
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
