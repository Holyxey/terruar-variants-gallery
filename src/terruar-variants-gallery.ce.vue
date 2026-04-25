<template>
  <VariantMain v-for="variant in variants" :variant :key="variant.title" />
</template>

<script setup lang="ts">
  import { variants } from './assets/variants';
  import VariantMain from './components/variant/VariantMain.vue';
</script>

<style>
  @import './assets/tw.t.css';
</style>
