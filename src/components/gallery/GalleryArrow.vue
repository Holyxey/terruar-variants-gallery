<template>
  <button
    tabindex="0"
    :class="[
      'w-10 bg-black-dark flex fill-white rounded-3xl rounded-s-none p-2',
      'absolute z-10 top-1/2 -translate-y-1/2 cursor-pointer',
      dir === 'left' ? '-left-1' : '-right-1 -scale-100 ',
    ]"
  >
    <svg
      class="pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="m8.165 11.63l6.63-6.43C15.21 4.799 16 5.042 16 5.57v12.86c0 .528-.79.771-1.205.37l-6.63-6.43a.5.5 0 0 1 0-.74"
      />
    </svg>
  </button>
</template>
<script setup lang="ts">
  defineProps<{ dir: 'left' | 'right' }>();
</script>
