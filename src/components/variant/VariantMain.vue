<template>
  <article :class="['max-w-7xl mx-auto', 'flex flex-col md:flex-row']">
    <VariantInfo :variant :class="[]" />
    <GalleryMain :photos="[]" :class="['flex-1']" />
  </article>
</template>

<script setup lang="ts">
  import type { Variant } from '../../assets/variants';
  import VariantInfo from './VariantInfo.vue';
  import GalleryMain from '../gallery/GalleryMain.vue';

  defineProps<{ variant: Variant }>();
</script>
