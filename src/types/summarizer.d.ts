// src/types/summarizer.d.ts

interface SummarizeOptions {
    sharedContext?: string;
    type?: "key-points" | "tl;dr" | "headline";
    format?: "plain-text" | "markdown";
    length?: "short" | "medium" | "long";
    monitor?: (m: any) => void;
}

interface SummarizeInputOptions {
    context?: string;
}

interface Summarizer {
    summarize(input: string, options?: SummarizeInputOptions): Promise<string>;
}

interface SummarizerConstructor {
    availability(): Promise<"available" | "unavailable">;
    create(options: SummarizeOptions): Promise<Summarizer>;
}

// Declare it on the global Window
declare var Summarizer: SummarizerConstructor;
