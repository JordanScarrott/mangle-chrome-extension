import { manglePrompt, MangleSchemaProperties } from "@/geminiNano/prompts";
import { geminiNanoService } from "@/services/geminiNanoService";

export function usePrompt() {
    async function prompt(
        inputText: string
    ): Promise<string | MangleSchemaProperties> {
        const { systemPrompt, schema } = manglePrompt;

        // Assuming 'articleText' contains the text from Readability.js
        const result =
            await geminiNanoService.askPrompt<MangleSchemaProperties>(
                inputText,
                systemPrompt,
                schema
            );

        return result;
    }

    return { prompt };
}
