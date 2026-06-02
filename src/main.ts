import { defineCustomElement } from 'vue';
import App from './terruar-variants-gallery.ce.vue';

const app = defineCustomElement(App, {
  shadowRoot: true,
});

customElements.define('terruar-variants-gallery', app);
