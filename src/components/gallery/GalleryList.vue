<template>
  <div
    ref="galleryRoot"
    :class="[
      'flex overflow-x-auto rounded-lg no-scrollbar space-x-2',
      isDragging ? 'cursor-grabbing' : 'cursor-grab',
    ]"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @touchend="onMouseUp"
  >
    <img
      v-for="(src, key) in photos"
      ref="images"
      :class="[
        'block rounded-xl',
        'transition-all ease-cubic duration-500 delay-75',
        'select-none pointer-events-none',
      ]"
      :key
      :loading="key > 2 ? 'lazy' : undefined"
      :src
      :alt="`Терруар глэмпинг ${variant.title} категория ${variant.category}`"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, useTemplateRef, ref, nextTick } from 'vue';
  import type { Variant } from '../../assets/variants';
  import type { ImageObject, ImageGallery, WithContext } from 'schema-dts';

  const props = defineProps<{ photos: string[]; variant: Variant }>();
  defineExpose({ scrollListTo });

  const root = useTemplateRef('galleryRoot');
  const images = useTemplateRef('images');
  const activeImage = ref<HTMLImageElement>();

  const isDragging = ref(false);
  let startX = 0;
  let scrollLeftStart = 0;

  let observer: IntersectionObserver;
  function onMouseDown(event: MouseEvent) {
    if (!root.value) return;
    isDragging.value = true;
    startX = event.pageX - root.value.offsetLeft;
    scrollLeftStart = root.value.scrollLeft;
  }

  function onMouseMove(event: MouseEvent) {
    if (!isDragging.value || !root.value) return;

    event.preventDefault();

    const x = event.pageX - root.value.offsetLeft;
    const walk = (x - startX) * 1.4;
    root.value.scrollLeft = scrollLeftStart - walk;
  }

  function onMouseUp() {
    isDragging.value = false;
    if (activeImage.value)
      activeImage.value.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      });
  }

  function scrollListTo(dir: 'next' | 'prev') {
    if (!root.value) return;
    root.value.addEventListener('scrollend', onMouseUp, { once: true });

    root.value.scrollBy({
      left: (images.value?.[0]?.clientWidth || 100) * (dir === 'next' ? 1 : -1),
      behavior: 'smooth',
    });
  }

  function buildSchema() {
    const SCHEMA: WithContext<ImageGallery> = {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      image: props.photos.map(
        (img) =>
          ({
            '@type': 'ImageObject',
            url: img,
            description: `Терруар глэмпинг ${props.variant.title} категория ${props.variant.category}`,
          }) satisfies ImageObject,
      ),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(SCHEMA);
    document.appendChild(script);
  }

  onMounted(() => {
    if (!images.value?.length) throw '';

    observer = new IntersectionObserver(
      (entrs) => {
        entrs.forEach((el) => {
          if (el.isIntersecting && el.target instanceof HTMLImageElement) {
            activeImage.value = el.target;

            el.target.classList.remove('opacity-50');
          } else {
            el.target.classList.add('opacity-50');
          }
        });
      },
      { root: root.value, threshold: 0.5 },
    );

    images.value.forEach((img) => {
      observer.observe(img);
      img.addEventListener('click', (el) => {
        if (el.target instanceof HTMLImageElement) {
          el.target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    onMouseUp();
    buildSchema();
  });

  onUnmounted(() => {
    observer?.disconnect();
  });
</script>
