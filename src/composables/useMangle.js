import { ref } from 'vue';

export function useMangle() {
  const mangledText = ref('');

  function mangle(text) {
    // In the future, this will call the WASM module.
    // For now, it just returns a simple transformation.
    mangledText.value = text.split('').reverse().join('');
    return mangledText.value;
  }

  return {
    mangledText,
    mangle,
  };
}
