<template>
  <div
    :class="['cursor-pointer', 'transition-all ease-linear', 'group']"
    @click="$emit('chosenTitle', variantTitle)"
  >
    <div
      :class="[
        'not-md:hidden',
        'bg-warning-dark rounded-lg border border-white p-2',
        'absolute top-0 left-1/2 -translate-x-1/2',
        'ease-cubic pointer-events-none transition-all duration-300',
        'scale-90 opacity-0 group-hover:top-full group-hover:scale-100 group-hover:opacity-100',
        'text-center text-balance text-white shadow-md',
      ]"
    >
      <p class="font-serif leading-5">
        {{ variantTitle }}
      </p>
      <p class="text-xs leading-3 whitespace-nowrap">{{ type }}</p>
    </div>

    <svg
      v-if="type === 'Домик студия'"
      viewBox="0 0 84 73"
      fill="transparent"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M84 0L0 10V72.5H84V0Z" />
    </svg>

    <svg
      v-else-if="type === 'Повышенная' || type === 'Стандарт'"
      viewBox="0 0 84 89"
      fill="transparent"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M84 0L0 10V88.5H84V0Z" />
    </svg>

    <svg
      v-else-if="type === 'На компанию'"
      viewBox="0 0 105 80"
      fill="transparent"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M104.5 0L0 14V79.5H104.5V0Z" />
    </svg>

    <svg
      v-else-if="type === 'Палатки'"
      viewBox="0 0 78 79"
      fill="transparent"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 78.5H77.5L37.5 0L0 78.5Z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
  import type { Category } from '../../assets/variants';
  import { variants } from '../../assets/variants';

  const props = defineProps<{
    type: Category;
    variantTitle: (typeof variants)[number]['title'];
  }>();

  defineEmits<{ chosenTitle: [string] }>();
</script>
