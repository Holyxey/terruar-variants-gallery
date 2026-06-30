<template>
  <div
    :class="[
      'fixed top-0 left-0 z-50 h-full w-full',
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
      sandbox=""
      :class="['bg-black-dark h-9/12 min-h-1/2 w-full rounded-t-xl']"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import UiButton from '../ui/UiButton.vue';

  const menuList: Record<string, string> = {
    base: 'https://docviewer.yandex.ru/?url=ya-disk-public%3A%2F%2F2XdijC4xEMFXBrCaY5O4giY%2FvIoKUyLQACYiV5%2FISmexdSdQfjTPCtuY10Pl0cIKq%2FJ6bpmRyOJonT3VoXnDag%3D%3D%3A%2F%D0%A2%D0%B5%D1%80%D1%80%D1%83%D0%B0%D1%80%20%D0%BF%D0%B5%D1%87%D0%B0%D1%82%D1%8C%20(2).pdf',
  } as const;

  const currentMenuLink = ref<string | undefined>();

  function open(key: keyof typeof menuList) {
    if (!menuList[key]) return console.warn(key, 'menu is non defined');

    currentMenuLink.value = menuList[key];
  }
  const close = () => (currentMenuLink.value = undefined);

  watch(currentMenuLink, (newVal) => {
    if (newVal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  });

  function init() {
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
  }

  onMounted(() => {
    if (document.readyState === 'complete') init();
    else window.addEventListener('load', () => init());
  });
</script>
