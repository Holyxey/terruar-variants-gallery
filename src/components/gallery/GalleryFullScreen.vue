<template>
  <div
    :class="[
      'absolute bg-black rounded-xl stroke-white z-10 p-2 cursor-pointer',
      'transition-all ease-cubic duration-500 delay-200',
      hidden ? 'opacity-0 scale-50 bottom-0 right-0' : 'bottom-2 right-2',
    ]"
  >
    <svg class="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g fill="none" stroke-linecap="round" stroke-width="1.5">
        <path
          d="M22 14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22"
          opacity=".5"
        />
        <path d="M10 22c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14" />
        <path d="M10 2C6.229 2 4.343 2 3.172 3.172S2 6.229 2 10" opacity=".5" />
        <path d="M14 2c3.771 0 5.657 0 6.828 1.172S22 6.229 22 10" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const hidden = ref(true);

  defineExpose({ hidden });
</script>
