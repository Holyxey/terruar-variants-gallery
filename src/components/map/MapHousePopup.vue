<template>
  <div
    id="map-house-popup"
    :class="[
      'top-0 right-0 bottom-0 left-0 flex',
      'pt-safe-top pr-safe-right pl-safe-left pb-safe-bottom',
      'no-scrollbar fixed z-100500 overflow-x-auto',
      'backdrop-blur-lg',
      'ease-cubic transition-all duration-500',

      isVisible ? '' : 'pointer-events-none opacity-0',
    ]"
    @click="close"
  >
    <VariantMain
      @close-pop-up="close"
      v-if="chosenVariant"
      isPopup
      :class="[
        'm-auto h-fit max-w-6xl',
        'ease-cubic transition-all duration-700',
        isVisible ? '' : 'scale-95',
      ]"
      @click.stop
      :variant="chosenVariant"
    />
  </div>
</template>

<script setup lang="ts">
  import VariantMain from '../variant/VariantMain.vue';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { variants, type Variant } from '../../assets/variants';

  const props = defineProps<{ title?: string }>();
  const emit = defineEmits<{ clear: [] }>();

  const isVisible = ref(false);

  const chosenVariant = computed<Variant | undefined>(() => {
    const foundOne = variants.find((v) => v.title === props.title);
    if (foundOne) {
      isVisible.value = true;

      const params = new URLSearchParams(location.search);
      params.set('varcat', foundOne.category);
      history.pushState({}, '', `?${params.toString()}`);

      return foundOne;
    }
    return undefined;
  });

  function keyListner(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close();
    }
  }

  function close() {
    isVisible.value = false;

    setTimeout(() => {
      emit('clear');
    }, 500);
  }

  onMounted(() => {
    window.addEventListener('keydown', keyListner);
  });
  onUnmounted(() => {
    window.removeEventListener('keydown', keyListner);
  });
</script>
