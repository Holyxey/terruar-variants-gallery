<template>
  <component
    :is
    :class="[
      'text-white block border border-warning-dark',
      'sticky bottom-2 text-center py-3 px-5 leading-5 font-serif',
      'cursor-pointer transition-all duration-300',

      variant === 'action' ? 'rounded-lg' : 'rounded-full',
      option === 'filled' ? 'bg-warning-dark' : 'hover:bg-warning-dark/50',
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
  const { option = 'filled', variant = 'action' } = defineProps<{
    is: 'a' | 'button';
    option?: 'filled' | 'border';
    variant?: 'action' | 'tab';
  }>();
</script>
