<template>
  <div
    tabindex="0"
    :class="[
      'absolute top-0 bottom-0 z-10 cursor-pointer',
      'flex w-[20%] items-center',

      hide && 'pointer-events-none opacity-0',
      dir === 'left' ? 'left-0' : 'right-0',
    ]"
  >
    <button
      ref="btn"
      :class="[
        'shadow-black-dark pointer-events-none flex rounded-3xl bg-black fill-white stroke-white p-2',

        dir === 'left'
          ? 'mr-auto rounded-l-none pl-0'
          : 'ml-auto rounded-r-none pr-0',
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
  </div>
</template>
<script setup lang="ts">
  defineProps<{ dir: 'left' | 'right'; hide?: boolean }>();
</script>
