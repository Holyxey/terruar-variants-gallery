<template>
  <button
    ref="btn"
    tabindex="0"
    :class="[
      'group ease-cubic transition-all duration-500',
      'shadow-black-dark flex rounded-3xl bg-black fill-white stroke-white p-2',
      'absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer',

      dir === 'left'
        ? 'left-0 rounded-l-none pl-0'
        : 'right-0 rounded-r-none pr-0',

      hide && 'pointer-events-none opacity-0',
      hide ? (dir === 'left' ? '-left-2' : '-right-2') : undefined,
    ]"
  >
    <svg
      class="w-5"
      xmlns="http://www.w3.org/2000/svg"
      :class="['pointer-events-none', dir === 'left' ? '' : 'rotate-180']"
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
