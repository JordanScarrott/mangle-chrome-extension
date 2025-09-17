import { ref } from 'vue';
import type { Ref } from 'vue';

export function useMangle() {
  const mangledText: Ref<string> = ref('');

  function mangle(text: string): string {
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
