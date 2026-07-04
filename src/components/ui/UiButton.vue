<template>
  <component
    :is
    :href
    :target
    :class="[
      'block text-white',
      'sticky bottom-2 px-5 py-3 text-center font-serif leading-5',
      'cursor-pointer transition-all duration-300',

      variant === 'action' ? 'rounded-lg' : 'rounded-full',
      option === 'filled' ? 'bg-warning-dark' : 'bg-black',
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
  type Props = (
    | {
        is: 'a';
        href: string;
        target?: HTMLAnchorElement['target'];
      }
    | {
        is: 'button';
        href?: never;
        target?: never;
      }
  ) & {
    option?: 'filled' | 'border';
    variant?: 'action' | 'tab';
  };

  const { option = 'filled', variant = 'action' } = defineProps<Props>();
</script>
