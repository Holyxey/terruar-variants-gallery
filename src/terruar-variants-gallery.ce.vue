<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex gap-2 flex-wrap pb-6 px-4">
      <UiButton
        v-for="[name, variants] in Object.entries(categories)"
        is="button"
        variant="tab"
        @click="changeCategory(name)"
        :option="chosenCat === name ? 'filled' : 'border'"
        class="text-xl font-light"
      >
        {{ name }}
      </UiButton>
    </div>

    <ul class="space-y-6">
      <li
        v-show="chosenCat === 'Повышенная'"
        v-for="variant in categories.Повышенная"
        :key="variant.slug"
      >
        <VariantMain :variant />
      </li>
    </ul>

    <ul class="space-y-6">
      <li
        v-show="chosenCat === 'Стандарт'"
        v-for="variant in categories.Стандарт"
        :key="variant.slug"
      >
        <VariantMain :variant />
      </li>
    </ul>

    <ul class="space-y-6">
      <li
        v-show="chosenCat === 'Палатки'"
        v-for="variant in categories.Палатки"
        :key="variant.slug"
      >
        <VariantMain :variant />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { variants, Category } from './assets/variants';
  import type { Variant } from './assets/variants';
  import VariantMain from './components/variant/VariantMain.vue';
  import UiButton from './components/ui/UiButton.vue';

  const chosenCat = ref<string>();
  const categories: Partial<Record<Category, Variant[]>> = variants.reduce(
    (acc: Partial<Record<Category, Variant[]>>, v: Variant) => {
      if (acc[v.category]) acc[v.category]!.push(v);
      else acc[v.category] = [v];
      return acc;
    },
    {} satisfies Partial<Record<Category, Variant[]>>,
  );

  function changeCategory(cat: string) {
    chosenCat.value = cat;

    const params = new URLSearchParams(location.search);
    params.set('varcat', cat);
    history.pushState({}, '', `?${params.toString()}`);
  }
  function popCat() {
    const cat = new URLSearchParams(location.search).get('varcat');
    if (cat) {
      chosenCat.value = cat;
    }
    return !!cat;
  }

  window.addEventListener('popstate', popCat);

  onMounted(() => {
    const cat = popCat();
    if (!cat) changeCategory(Category['Elevated']);
  });
</script>

<style>
  @import './assets/tw.t.css';
</style>
