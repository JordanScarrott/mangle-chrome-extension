import { Readability } from '@mozilla/readability';

const article = new Readability(document.cloneNode(true)).parse();

if (article) {
  chrome.runtime.sendMessage({
    type: 'parsed-article',
    payload: article,
  });
}
