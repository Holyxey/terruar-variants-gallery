<template>
  <div
    :class="[
      'relative flex flex-col gap-4 rounded-2xl bg-black text-white lg:p-2',
    ]"
  >
    <!-- Main -->
    <div class="sticky top-0 -m-2 flex justify-between gap-2 bg-black p-2">
      <div>
        <p class="text-xs font-light lg:text-base">
          Категория: {{ variant.category }}
        </p>

        <h4 class="font-serif text-xl font-light! lg:text-3xl">
          {{ variant.title }}
        </h4>
      </div>

      <div
        class="bg-black-light flex h-fit items-center gap-2 rounded-lg px-4 py-2"
      >
        <p class="font-serif text-xl/4 font-light">
          {{ variant.capacity }}
        </p>
        <IconPerson class="-me-2 h-6" />
      </div>
    </div>

    <ul
      class="space-y-2 py-2 font-serif text-sm leading-0 font-light lg:space-y-4 lg:text-base"
    >
      <li
        class="border-black-light flex items-center gap-2 border-b pb-2 lg:pb-4"
      >
        <IconSquare class="w-4 lg:w-6" />

        <p>Площадь</p>

        <p class="ms-auto">{{ variant.sqMeters }}M</p>
      </li>
      <li class="flex items-center gap-2">
        <IconBed class="w-4 lg:w-6" />

        <p>Кровати</p>

        <p class="ms-auto">{{ variant.bedSize.w }}x{{ variant.bedSize.l }}</p>
      </li>
    </ul>

    <!-- Tags -->
    <ul
      class="flex flex-wrap gap-1 text-xs font-light lowercase select-none lg:text-sm"
    >
      <li
        v-for="tag in variant.tags"
        :title="typeof tag === 'string' ? tag : tag.title"
        class="border-black-light flex items-center gap-2 rounded-full border px-3 py-2 whitespace-nowrap transition-colors ease-out hover:border-transparent hover:bg-white/5"
      >
        <template v-if="typeof tag === 'string'">
          <p>{{ tag }}</p>
        </template>

        <template v-else>
          <div v-if="tag.iconLink">
            <img
              class="h-3 w-3"
              :src="tag.iconLink + '?color=%23b05531&width=32'"
              :alt="`Terruar Icon ${variant.title} ${tag.title}`"
            />
          </div>
          <p>{{ tag.title }}</p>
        </template>
      </li>
    </ul>

    <!-- footer -->
    <div class="mt-auto flex flex-col gap-4">
      <ul v-if="variant.footer?.length" class="mt-auto text-xs lg:text-sm">
        <li v-for="(value, key) in variant.footer" :key>
          <p>{{ value }}</p>
        </li>
      </ul>
    </div>

    <div class="flex flex-wrap gap-2" @click="$emit('closePopUp')">
      <UiButton class="flex-1" is="button" v-if="isPopup"> Закрыть </UiButton>
      <UiButton class="flex-1" is="button" @click="bubbleBook(variant.title)">
        Забронировать
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Variant } from '../../assets/variants';
  import IconPerson from '../icons/IconPerson.vue';
  import IconSquare from '../icons/IconSquare.vue';
  import IconBed from '../icons/IconBed.vue';
  import UiButton from '../ui/UiButton.vue';
  import { bubbleBook } from '../../utils/bubbleBook.ts';

  const { variant } = defineProps<{
    variant: Variant;
    isPopup?: true;
  }>();

  defineEmits<{ closePopUp: [] }>();
</script>
