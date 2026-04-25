<template>
  <article :class="['max-w-7xl mx-auto', 'flex flex-col lg:gap-4 lg:flex-row']">
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
