<template>
    <div class="container">
        <h1>Mangle Extension</h1>
        <p>Hello, Mangle!</p>
        <button @click="count++">Click</button>
        count: {{ count }}

        <input v-model="inputText" />
        <button @click="summarize">Summarize</button>
        <button @click="prompt">Prompt</button>
        output: {{ output }}
    </div>
</template>

<script setup lang="ts">
import { usePrompt } from "@/composables/geminiNanoComposable";
import { geminiNanoService } from "@/services/geminiNanoService";
import { ref } from "vue";

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
</script>

<style scoped>
.container {
    width: 300px;
    padding: 1rem;
    text-align: center;
    font-family: sans-serif;
}
</style>
