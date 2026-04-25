<template>
  <div class="relative">
    <GalleryArrow
      aria-label="prev photo"
      dir="left"
      @click="galleryList?.scrollListTo('prev')"
    />
    <GalleryArrow
      aria-label="next photo"
      dir="right"
      @click="galleryList?.scrollListTo('next')"
    />

    <GalleryList
      ref="galleryList"
      v-if="sizedList.length"
      :photos="sizedList"
      :variant
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, useTemplateRef } from 'vue';
  import type { Variant } from '../../assets/variants';
  import GalleryList from './GalleryList.vue';
  import GalleryArrow from './GalleryArrow.vue';

  type Prefix = 'hq' | 'sm';

  const { variant } = defineProps<{ variant: Variant }>();

  const list = ref<Record<Prefix, string[]>>({ hq: [], sm: [] });
  const prefix = ref<Prefix>(window.innerWidth > 460 ? 'hq' : 'sm');
  const sizedList = computed<string[]>(() => list.value[prefix.value]);

  const galleryList = useTemplateRef('galleryList');

  async function getImages() {
    prefix.value = window?.innerWidth > 460 ? 'hq' : 'sm';

    if (sizedList.value.length === 0) {
      const path =
        process.env.API_PATH +
        '/list/' +
        variant.slug +
        `?size=${prefix.value}`;
      const req = await fetch(path);
      const arr = await req.json();

      if (req.ok && Array.isArray(arr)) {
        list.value[prefix.value] = arr;
      }
    }
  }

  onMounted(() => {
    getImages();
    window?.addEventListener('resize', getImages);
  });
</script>
