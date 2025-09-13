import { run_mangle_query } from "./src/services/mangleService.js";
import geminiNanoService from "./src/services/geminiNanoService.js";

const testButton = document.getElementById("test-button");

testButton.addEventListener("click", async () => {
  console.log("Running tests...");

  // Test mangleService
  const mangleResult1 = await run_mangle_query("some input");
  console.log("Mangle Service (Success):", mangleResult1);

  const mangleResult2 = await run_mangle_query("an error input");
  console.log("Mangle Service (Error):", mangleResult2);

  // Test geminiNanoService
  const summary = await geminiNanoService.summarizeText("some text");
  console.log("Gemini Nano - Summary:", summary);

  const facts = await geminiNanoService.extractFacts("some text");
  console.log("Gemini Nano - Facts:", facts);

  const rewrite = await geminiNanoService.rewriteText("some text");
  console.log("Gemini Nano - Rewrite:", rewrite);
});
