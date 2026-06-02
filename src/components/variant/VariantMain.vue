<template>
  <article
    :data-variant-slug="variant.slug"
    :class="['rounded-3xl bg-black p-4', 'flex flex-col gap-4 md:flex-row']"
  >
    <VariantInfo :variant :class="['flex-2']" />
    <GalleryMain :variant :class="['flex-3']" />
  </article>
</template>

<script setup lang="ts">
  import type { Variant } from '../../assets/variants';
  import VariantInfo from './VariantInfo.vue';
  import GalleryMain from '../gallery/GalleryMain.vue';

  defineProps<{ variant: Variant }>();
</script>
