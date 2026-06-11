<template>
  <div
    class="relative"
    @mousemove="fullScreen!.hidden = false"
    @mouseleave="fullScreen!.hidden = true"
  >
    <GalleryArrow
      aria-label="prev photo"
      dir="left"
      :hide="!galleryList?.hasPrev"
      @click="galleryList?.scrollListTo('prev')"
    />
    <GalleryArrow
      aria-label="next photo"
      dir="right"
      :hide="!galleryList?.hasNext"
      @click="galleryList?.scrollListTo('next')"
    />

    <GalleryList
      ref="galleryList"
      v-if="sizedList.length"
      :photos="sizedList"
      :variant
    />

    <GalleryFullScreen
      hidden
      ref="fullScreen"
      @click="isFullScreen = !isFullScreen"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, useTemplateRef } from 'vue';
  import type { Variant } from '../../assets/variants';
  import GalleryList from './GalleryList.vue';
  import GalleryArrow from './GalleryArrow.vue';
  import type { ImageObject, ImageGallery, WithContext } from 'schema-dts';
  import GalleryFullScreen from './GalleryFullScreen.vue';

  type Prefix = 'hq' | 'sm';

  const { variant } = defineProps<{
    variant: Variant;
  }>();

  const list = ref<Record<Prefix, string[]>>({ hq: [], sm: [] });
  const prefix = ref<Prefix>(window.innerWidth > 460 ? 'hq' : 'sm');
  const sizedList = computed<string[]>(() => list.value[prefix.value]);
  const isFullScreen = ref(false);

  const galleryList = useTemplateRef('galleryList');
  const fullScreen = useTemplateRef('fullScreen');

  async function getImages() {
    prefix.value = window?.innerWidth > 460 ? 'hq' : 'sm';

    if (sizedList.value.length === 0) {
      try {
        const path =
          process.env.API_PATH +
          '/list/' +
          variant.slug +
          `?size=${prefix.value}`;

        console.log(path);
        const req = await fetch(path);
        const arr = await req.json();

        if (req.ok && Array.isArray(arr)) {
          list.value[prefix.value] = arr;
        }
      } catch (error) {
        console.error(error);
      }
    }

    buildSchema(list.value[prefix.value]);
  }

  function buildSchema(list: string[]) {
    const tag = 'data-schgal';
    if (document.querySelector(`[${tag}=${variant.slug}]`)) return;

    const SCHEMA: WithContext<ImageGallery> = {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      image: list.map(
        (img) =>
          ({
            '@type': 'ImageObject',
            url: img,
            description: `Терруар глэмпинг ${variant.title} категория ${variant.category}`,
          }) satisfies ImageObject,
      ),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(tag, variant.slug);
    script.innerHTML = JSON.stringify(SCHEMA);
    document.head.appendChild(script);
  }

  onMounted(() => {
    getImages();
    window?.addEventListener('resize', getImages);
  });
</script>
