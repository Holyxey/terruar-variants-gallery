<template>
  <article
    :class="[
      'max-w-7xl mx-auto bg-black p-4 rounded-3xl',
      'flex flex-col gap-4 md:flex-row ',
    ]"
  >
    <VariantInfo :variant :class="['flex-1']" />
    <GalleryMain :variant :class="['flex-1']" />
  </article>
</template>

<script setup lang="ts">
  import type { Variant } from '../../assets/variants';
  import VariantInfo from './VariantInfo.vue';
  import GalleryMain from '../gallery/GalleryMain.vue';

  defineProps<{ variant: Variant }>();
</script>
