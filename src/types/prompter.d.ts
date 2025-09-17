// src/types/languageModel.d.ts

interface RoleContent {
    role: "system" | "user" | "assistant";
    content: string;
}

interface PromptOptions {
    responseConstraint?: any; // can be JSON Schema
    omitResponseConstraintInput?: boolean;
    signal?: AbortSignal;
}

interface LanguageModelSession {
    prompt(
        input: string | RoleContent[],
        options?: PromptOptions
    ): Promise<string>;
    promptStreaming(
        input: string | RoleContent[],
        options?: PromptOptions
    ): Promise<ReadableStream<string>>;
    destroy(): Promise<void>;
    // You might also want inputUsage / inputQuota, depending on what you use
}

interface LanguageModelConstructor {
    availability(): Promise<
        "available" | "unavailable" | "downloadable" | "downloading"
    >;
    params(): Promise<{
        defaultTopK: number;
        maxTopK: number;
        defaultTemperature: number;
        maxTemperature: number;
    }>;
    create(options?: {
        topK?: number;
        temperature?: number;
        initialPrompts?: RoleContent[];
        signal?: AbortSignal;
        monitor?: (m: any) => void;
    }): Promise<LanguageModelSession>;
}

declare const LanguageModel: LanguageModelConstructor;
