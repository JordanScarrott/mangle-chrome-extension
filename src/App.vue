<template>
    <div class="container">
        <h1>Mangle Extension</h1>
        <p>Hello, Mangle!</p>
        <button @click="count++">Click</button>
        count: {{ count }}

        <input v-model="inputText" />
        <button @click="summarize">Summarize</button>
        <button @click="prompt">Prompt</button>
        <button @click="summarizeStreaming">Summarize (Streaming)</button>
        <button @click="promptStreaming">Prompt (Streaming)</button>
        <div>output: {{ output }}</div>
        <div id="streaming-output"></div>
    </div>
</template>

<script setup lang="ts">
import { usePrompt } from "@/composables/geminiNanoComposable";
import { geminiNanoService } from "@/services/geminiNanoService";
import { ref } from "vue";
import * as smd from "streaming-markdown";
import DOMPurify from "dompurify";
import { manglePrompt } from "@/geminiNano/prompts";

// No script logic needed for this simple component yet.

const count = ref(0);

const inputText = ref("");
const output = ref("");

async function summarize() {
    output.value = await geminiNanoService.summarize(inputText.value);
}

async function prompt() {
    const response = await usePrompt().prompt(inputText.value);

    console.log("SLKDJASLKDJSA: ", response);

    output.value = JSON.stringify(response);
}

async function summarizeStreaming() {
    const streamingOutput = document.getElementById("streaming-output");
    if (streamingOutput) {
        streamingOutput.innerHTML = "";
        const renderer = smd.default_renderer(streamingOutput);
        const parser = smd.parser(renderer);
        await geminiNanoService.summarizeStreaming(inputText.value, (chunk) => {
            const sanitizedChunk = DOMPurify.sanitize(chunk);
            smd.parser_write(parser, sanitizedChunk);
        });
        smd.parser_end(parser);
    }
}

async function promptStreaming() {
    const streamingOutput = document.getElementById("streaming-output");
    if (streamingOutput) {
        streamingOutput.innerHTML = "";
        const renderer = smd.default_renderer(streamingOutput);
        const parser = smd.parser(renderer);
        await geminiNanoService.askPromptStreaming(
            inputText.value,
            manglePrompt().systemPrompt,
            (chunk) => {
                const sanitizedChunk = DOMPurify.sanitize(chunk);
                smd.parser_write(parser, sanitizedChunk);
            }
        );
        smd.parser_end(parser);
    }
}
</script>

<style scoped>
.container {
    width: 300px;
    padding: 1rem;
    text-align: center;
    font-family: sans-serif;
}
</style>
