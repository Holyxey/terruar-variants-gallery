import { defineCustomElement } from 'vue';

import Gallery from './terruar-variants-gallery.ce.vue';
import Map from './terruar-interactive-map.ce.vue';
import Review from './terruar-review.ce.vue';

const galleryComponent = defineCustomElement(Gallery, { shadowRoot: true });
const mapComponent = defineCustomElement(Map, { shadowRoot: true });
const reviewComponent = defineCustomElement(Review);

customElements.define('terruar-variants-gallery', galleryComponent);
customElements.define('terruar-interactive-map', mapComponent);
customElements.define('terruar-review', reviewComponent);
