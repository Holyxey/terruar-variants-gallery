import { defineCustomElement } from 'vue';

import Gallery from './terruar-variants-gallery.ce.vue';
import Map from './terruar-interactive-map.ce.vue';
// import Menu from './terruar-popup-menu.ce.vue';

const galleryComponent = defineCustomElement(Gallery, { shadowRoot: true });
const mapComponent = defineCustomElement(Map, { shadowRoot: true });
// const menuComponent = defineCustomElement(Menu, { shadowRoot: true });

customElements.define('terruar-variants-gallery', galleryComponent);
customElements.define('terruar-interactive-map', mapComponent);
// customElements.define('terruar-popup-menu', menuComponent);
