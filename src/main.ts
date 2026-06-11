import { defineCustomElement } from 'vue';
import Gallery from './terruar-variants-gallery.ce.vue';
import Map from './terruar-interactive-map.ce.vue';

const galleryComponent = defineCustomElement(Gallery, { shadowRoot: true });
const mapComponent = defineCustomElement(Map, { shadowRoot: true });

customElements.define('terruar-variants-gallery', galleryComponent);
customElements.define('terruar-interactive-map', mapComponent);
