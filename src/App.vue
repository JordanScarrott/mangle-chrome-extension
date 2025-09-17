<template>
    <div class="container">
        <h1>Mangle Extension</h1>
        <p>Hello, Mangle!</p>
        <button @click="count++">Click</button>
        count: {{ count }}
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// No script logic needed for this simple component yet.

const count = ref(0);
</script>

<style scoped>
.container {
    width: 300px;
    padding: 1rem;
    text-align: center;
    font-family: sans-serif;
}
</style>
