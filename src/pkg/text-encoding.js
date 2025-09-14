// A basic polyfill for TextEncoder and TextDecoder for older environments.
// Modern browsers have this built-in, but it's good practice to include.

// In a real project, you might use a more robust library.
// For our purposes, we just need to ensure these are defined.

export let TextDecoder = (typeof globalThis.TextDecoder !== 'undefined')
  ? globalThis.TextDecoder
  : class {
      decode(buf) {
        let s = '';
        for (let i = 0; i < buf.length; i++) {
          s += String.fromCharCode(buf[i]);
        }
        return s;
      }
    };

export let TextEncoder = (typeof globalThis.TextEncoder !== 'undefined')
  ? globalThis.TextEncoder
  : class {
      encode(s) {
        const buf = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) {
          buf[i] = s.charCodeAt(i);
        }
        return buf;
      }
    };
