<template>
  <div class="mx-auto max-w-7xl">
    <div class="flex flex-wrap gap-2 px-4 pt-2 pb-6">
      <UiButton
        v-for="[name, variants] in Object.entries(categories)"
        is="button"
        variant="tab"
        @click="changeCategory(name)"
        :option="chosenCat === name ? 'filled' : 'border'"
        class="flex-1 text-xl font-light whitespace-nowrap"
      >
        {{ name }}
      </UiButton>
    </div>

    <template v-if="chosenCat && isCategory(chosenCat)">
      <ul class="space-y-6">
        <li v-for="variant in categories[chosenCat]" :key="variant.slug">
          <VariantMain :variant />
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import { variants, Category, isCategory } from './assets/variants';
  import type { Variant } from './assets/variants';
  import VariantMain from './components/variant/VariantMain.vue';
  import UiButton from './components/ui/UiButton.vue';
  import type {
    Accommodation,
    WithContext,
    LocationFeatureSpecificationLeaf,
  } from 'schema-dts';

  const props = defineProps<{ varcat?: string }>();

  const chosenCat = ref<Category>();
  const categories: Partial<Record<Category, Variant[]>> = variants.reduce(
    (acc: Partial<Record<Category, Variant[]>>, v: Variant) => {
      if (acc[v.category]) acc[v.category]!.push(v);
      else acc[v.category] = [v];
      return acc;
    },
    {} satisfies Partial<Record<Category, Variant[]>>,
  );

  function changeCategory(cat: string) {
    if (!isCategory(cat)) {
      console.log('! isCategory ', cat);
      return;
    }

    chosenCat.value = cat;

    const params = new URLSearchParams(location.search);
    params.set('varcat', cat);
    history.pushState({}, '', `?${params.toString()}`);
  }
  function popCat() {
    const cat =
      props.varcat || new URLSearchParams(location.search).get('varcat');

    if (cat) changeCategory(cat);
    return !!cat;
  }

  function buildSchema(variant: Variant) {
    const tag = 'data-schvar';

    if (document.querySelector(`[${tag}=${variant.slug}]`)) return;

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
      script.type = 'application/ld+json';
      script.setAttribute(tag, variant.slug);
      console.log(`Schema insserted to head for ${variant.title}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Can't build schema for ${variant.title}`;
      console.error(message + error);
    }
  }

  onMounted(() => {
    window.addEventListener('popstate', popCat);

    const cat = popCat();
    if (!cat) changeCategory(Category.Elevated);

    Array.from(Object.values(categories)).map((category) =>
      category.map((variant) => buildSchema(variant)),
    );
  });

  onUnmounted(() => {});
</script>

<style>
  @import './assets/tw.t.css';
</style>
