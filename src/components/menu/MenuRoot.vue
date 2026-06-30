<template>
  <div
    :class="[
      'fixed top-0 left-0 z-950 h-full w-full',
      'bg-black-dark/20 flex flex-col items-center justify-end gap-4',
      'px-4 pt-4',
      'transition-all duration-500 ease-in-out',
      currentMenuLink
        ? 'backdrop-blur-xs'
        : 'pointer-events-none translate-y-4 opacity-0',
    ]"
    @click="close"
  >
    <UiButton is="button">Закрыть</UiButton>
    <iframe
      @click.stop
      :src="currentMenuLink"
      frameborder="0"
      sandbox="allow-scripts"
      :class="['bg-black-dark h-10/12 min-h-1/2 w-full rounded-t-xl']"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from 'vue';
  import UiButton from '../ui/UiButton.vue';
  import { widgetsVisibility } from '../../utils/widgetsVisibility.ts';

  const menuList: Record<string, string> = {
    base: 'https://cdn.yurin.dev/terruar/menu/Terruar%20menu%202026%20Jul.pdf',
  } as const;

  const currentMenuLink = ref<string | undefined>();

  function open(key: keyof typeof menuList) {
    if (!menuList[key]) return console.warn(key, 'menu is non defined');

    widgetsVisibility('hide');
    currentMenuLink.value = menuList[key];
  }
  const close = () => {
    widgetsVisibility('show');
    currentMenuLink.value = undefined;
  };

  watch(currentMenuLink, (newVal) => {
    if (newVal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  });

  function init() {
    nextTick(() => {
      console.log('QR Menu init');
      const query = new URL(location.href).searchParams.get('menu');
      if (query && !!menuList[query]) open(query);

      const buttons: HTMLElement[] = Array.from(
        document.querySelectorAll('[data-qr-menu]'),
      );

      for (const button of buttons) {
        const name = button.dataset.qrMenu;
        if (name) button.addEventListener('click', () => open(name));
      }
    });
  }

  onMounted(() => {
    if (document.readyState === 'complete') init();
    else window.addEventListener('load', () => init());
  });
</script>
