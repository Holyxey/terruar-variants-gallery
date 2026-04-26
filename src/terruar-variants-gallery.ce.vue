<template>
  <ul class="space-y-8">
    <li v-for="variant in variants">
      <VariantMain :variant :key="variant.title" />
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { variants } from './assets/variants';
  import VariantMain from './components/variant/VariantMain.vue';
</script>

<style>
  @import './assets/tw.t.css';
</style>
