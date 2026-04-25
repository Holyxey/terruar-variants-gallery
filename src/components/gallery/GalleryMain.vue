<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import type { Variant } from '../../assets/variants';

  const { variant } = defineProps<{ variant: Variant }>();

  const list = ref<string[]>([]);

  async function getImages() {
    const req = await fetch(process.env.API_PATH + '/list/' + variant.slug);
    const arr = await req.json();
    if (req.ok && Array.isArray(arr)) {
      list.value = arr;
    }
  }

  onMounted(getImages);
</script>
