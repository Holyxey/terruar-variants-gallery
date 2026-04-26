<template>
  <button
    ref="btn"
    tabindex="0"
    :class="[
      'group transition-all ease-cubic duration-500',
      ' bg-black flex fill-white stroke-white rounded-3xl p-2 shadow-black-dark',
      'absolute z-10 top-1/2 -translate-y-1/2 cursor-pointer',

      dir === 'left'
        ? 'left-0 pl-0 rounded-l-none'
        : 'right-0 pr-0 rounded-r-none',

      hide && 'opacity-0 pointer-events-none',
      hide ? (dir === 'left' ? '-left-2' : '-right-2') : undefined,
    ]"
  >
    <svg
      class="w-5"
      xmlns="http://www.w3.org/2000/svg"
      :class="['pointer-events-none ', dir === 'left' ? '' : 'rotate-180']"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="m15 5l-6 7l6 7"
      />
    </svg>
  </button>
</template>
<script setup lang="ts">
  defineProps<{ dir: 'left' | 'right'; hide?: boolean }>();
</script>
