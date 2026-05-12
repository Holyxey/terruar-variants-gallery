import { defineCustomElement } from 'vue';
import App from './terruar-variants-gallery.ce.vue';

const app = defineCustomElement(App, {
  shadowRoot: true,
});

customElements.define('terruar-variants-gallery', app);

function load() {
  try {
    let gallery = document.querySelector('terruar-variants-gallery');

    if (!gallery) {
      const root = document.getElementById('terruar-variants-gallery');
      gallery = document.createElement('terruar-variants-gallery');

      root?.appendChild(gallery);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '!terruar-variants-gallery';
    console.error(message + error);
  }
}

if (document.readyState === 'complete') {
  load();
} else {
  window.addEventListener('load', load);
}
