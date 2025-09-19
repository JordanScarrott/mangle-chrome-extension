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

        <h2>Mangle Playground</h2>
        <div v-if="isWasmLoaded">
            <div>
                <h3>Facts and Rules</h3>
                <textarea v-model="mangleFactsAndRules" rows="5" style="width: 100%"></textarea>
                <button @click="loadFactsAndRules">Load Facts and Rules</button>
            </div>
            <div>
                <h3>Query</h3>
                <textarea v-model="mangleQuery" rows="2" style="width: 100%"></textarea>
                <button @click="executeQuery">Execute Query</button>
            </div>
            <div>
                <h3>Mangle Output</h3>
                <pre>{{ mangleOutput }}</pre>
            </div>
        </div>
        <div v-else>
            <p>WASM not loaded yet...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePrompt } from "@/composables/geminiNanoComposable";
import { useMangle } from "@/composables/useMangle";
import { geminiNanoService } from "@/services/geminiNanoService";
import { ref } from "vue";
import * as smd from "streaming-markdown";
import DOMPurify from "dompurify";
import { manglePrompt } from "@/geminiNano/prompts";

// No script logic needed for this simple component yet.
const { mangle, isWasmLoaded } = useMangle();

const count = ref(0);

const inputText = ref("");
const output = ref("");
const mangleFactsAndRules = ref("");
const mangleQuery = ref("");
const mangleOutput = ref("");

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

function loadFactsAndRules() {
    const result = mangle(mangleFactsAndRules.value);
    mangleOutput.value = result;
    console.log("Mangle facts and rules result:", result);
}

function executeQuery() {
    const result = mangle(mangleQuery.value);
    mangleOutput.value = result;
    console.log("Mangle query result:", result);
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
