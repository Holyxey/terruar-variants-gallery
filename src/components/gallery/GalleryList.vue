<template>
  <div
    ref="galleryRoot"
    :class="[
      'min-h-full',
      'no-scrollbar flex overflow-x-auto rounded-2xl',
      'snap-x snap-mandatory',
    ]"
  >
    <img
      v-for="(src, key) in photos"
      ref="images"
      :class="[
        'aspect-video min-h-full',
        'block snap-center rounded-2xl object-cover',
        'ease-cubic transition-all delay-75 duration-500',
        'pointer-events-none select-none',
      ]"
      :key="src"
      :src
      :loading="key > 2 ? 'lazy' : undefined"
      :alt="`Терруар глэмпинг ${variant.title} категория ${variant.category}`"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    onMounted,
    onUnmounted,
    useTemplateRef,
    ref,
    computed,
    nextTick,
  } from 'vue';
  import type { Variant } from '../../assets/variants';

  const props = defineProps<{ photos: string[]; variant: Variant }>();

  const root = useTemplateRef('galleryRoot');
  const images = useTemplateRef('images');
  const activeImage = ref<HTMLImageElement>();
  const hasNext = computed<boolean>(() => {
    if (!activeImage.value || !images.value) {
      return false;
    }
    return activeImage.value !== images.value[images.value.length - 1];
  });
  const hasPrev = computed<boolean>(() => {
    if (!activeImage.value || !images.value) {
      return false;
    }
    return activeImage.value !== images.value[0];
  });

  defineExpose({ scrollListTo, hasNext, hasPrev });

  let observer: IntersectionObserver;

  function scrollListTo(dir: 'next' | 'prev') {
    if (!root.value) return;

    root.value.scrollBy({
      left: (images.value?.[0]?.clientWidth || 100) * (dir === 'next' ? 1 : -1),
      behavior: 'smooth',
    });
  }

  onMounted(() => {
    if (!images.value?.length) throw '';

    observer = new IntersectionObserver(
      (entrs) => {
        entrs.forEach((el) => {
          if (el.isIntersecting && el.target instanceof HTMLImageElement) {
            activeImage.value = el.target;

            el.target.classList.remove('opacity-0');
          } else {
            el.target.classList.add('opacity-0');
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

    images.value?.[0]?.addEventListener('load', () => {
      activeImage.value = images.value?.[0];
    });
  });

  onUnmounted(() => {
    observer?.disconnect();
  });
</script>
