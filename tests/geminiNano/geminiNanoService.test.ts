import { usePrompt } from "@/composables/geminiNanoComposable";
import { exampleText } from "tests/geminiNano/exampleData";
import { describe, test } from "vitest";

describe("geminiNanoService", () => {
    test("v2 prompt", async () => {
        const response = await usePrompt().prompt(exampleText(2));
    });
});
