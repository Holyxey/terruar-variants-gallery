<template>
  <div
    :class="[
      'bg-black relative flex gap-4 flex-col lg:p-2 rounded-2xl text-white',
    ]"
  >
    <!-- Main -->
    <div class="flex sticky top-0 bg-black p-2 -m-2 gap-2 justify-between">
      <div>
        <p class="text-xs lg:text-base font-light">
          Категория: {{ variant.category }}
        </p>

        <h4 class="text-xl lg:text-3xl font-light! font-serif">
          {{ variant.title }}
        </h4>
      </div>

      <div
        class="bg-black-light h-fit rounded-lg py-2 px-4 flex gap-2 items-center"
      >
        <p class="font-serif font-light text-xl/4">
          {{ variant.capacity }}
        </p>
        <IconPerson class="h-6 -me-2" />
      </div>
    </div>

    <ul
      class="font-serif leading-0 py-2 font-light text-sm lg:text-base space-y-2 lg:space-y-4"
    >
      <li
        class="border-b border-black-light flex items-center gap-2 pb-2 lg:pb-4"
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
    <ul class="flex text-xs lg:text-sm font-light flex-wrap gap-1 select-none">
      <li
        v-for="tag in variant.tags"
        class="border hover:bg-white/5 transition-colors ease-out flex items-center gap-2 py-2 whitespace-nowrap px-3 border-black-light rounded-full"
      >
        <template v-if="typeof tag === 'string'">
          <p>{{ tag }}</p>
        </template>

        <template v-else>
          <div v-if="tag.iconLink">
            <img
              class="w-3 h-3"
              :src="tag.iconLink"
              :alt="`Terruar Icon ${variant.title} ${tag.title}`"
            />
          </div>
          <p>{{ tag.title }}</p>
        </template>
      </li>
    </ul>

    <!-- footer -->
    <div class="mt-auto flex flex-col gap-4">
      <ul v-if="variant.footer?.length" class="text-xs mt-auto lg:text-sm">
        <li v-for="(value, key) in variant.footer" :key>
          <p>{{ value }}</p>
        </li>
      </ul>
    </div>

    <UiButton is="a" href="#booking"> Забронировать </UiButton>
    <!-- <a
      class="bg-warning-dark sticky bottom-2 text-center w-full p-3 leading-5 cursor-pointer rounded-lg font-serif"
    >
    </a> -->
  </div>
</template>

<script setup lang="ts">
  import type { Variant } from '../../assets/variants';
  import IconPerson from '../icons/IconPerson.vue';
  import IconSquare from '../icons/IconSquare.vue';
  import IconBed from '../icons/IconBed.vue';
  import type {
    Accommodation,
    WithContext,
    LocationFeatureSpecificationLeaf,
  } from 'schema-dts';
  import { onMounted } from 'vue';
  import UiButton from '../ui/UiButton.vue';

  const { variant } = defineProps<{ variant: Variant }>();

  function buildSchema() {
    const SCHEMA: WithContext<Accommodation> = {
      '@context': 'https://schema.org',
      '@type': 'Accommodation',
      name: variant.title,
      description:
        (variant.category === 'Палатки' ? 'Палатка' : 'Домик') +
        ` в глэмпинге Терруар ${variant.title}` +
        ` категории ${variant.category} на ${variant.capacity} гостей,` +
        ` включающий: ${variant.tags.map((tag) => (typeof tag === 'string' ? tag : tag.title)).join(', ')}`,
      occupancy: {
        '@type': 'QuantitativeValue',
        maxValue: variant.capacity,
        unitCode: 'C62',
      },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: variant.sqMeters,
        unitCode: 'MTK',
      },
      amenityFeature: variant.tags.map(
        (tag) =>
          ({
            '@type': 'LocationFeatureSpecification',
            name: typeof tag === 'string' ? tag : tag.title,
            value: true,
          }) satisfies LocationFeatureSpecificationLeaf,
      ),
    };

    try {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(SCHEMA);

      document.head.appendChild(script);
      console.log(`Schema insserted to head for ${variant.title}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Can't build schema for ${variant.title}`;
      console.error(message + error);
    }
  }

  buildSchema();
</script>
