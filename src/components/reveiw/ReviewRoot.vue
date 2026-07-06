<template>
  <div
    :class="[
      'fixed top-0 right-0 bottom-0 left-0 z-50',
      'transition-all duration-500',
      'flex items-center justify-center p-2',
      'rounded-2xl bg-black/20 text-white backdrop-blur-sm',
      isOpen ? '' : 'pointer-events-none opacity-0',
    ]"
    @click="close"
  >
    <div
      @click.stop
      :class="[
        'relative rounded-md bg-black p-8 select-none',
        'w-full max-w-md space-y-4 transition-all duration-500',
        isOpen ? '' : 'translate-y-4 opacity-0',
      ]"
    >
      <div class="stroke-warning absolute top-2 right-2" @click="close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            stroke-width="1.5"
            d="M19 5L5 19M5 5l14 14"
            color="currentColor"
          />
        </svg>
      </div>

      <p class="text-center font-serif text-xl font-light! lg:text-3xl">
        Оставить отзыв
      </p>

      <div class="flex justify-between px-4">
        <svg
          v-for="ind in 5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          @click="rating = ind"
          :class="[
            'stroke-warning w-10',
            'ease-cubic cursor-pointer transition-all duration-300',
            ind <= rating ? 'fill-warning' : 'hover:fill-warning/50 fill-black',
          ]"
        >
          <path
            d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"
          />
        </svg>
      </div>

      <div
        @click="submit"
        :class="[
          'transition-all *:w-full',
          rating ? 'h-10' : '-m-2 h-0 opacity-0',
        ]"
      >
        <UiButton
          v-if="isGood"
          is="a"
          href="https://yandex.ru/maps/org/terruar/195423529395/reviews/?ll=37.877661%252C54.740529"
          target="_blank"
        >
          Отправить
        </UiButton>

        <UiButton v-else is="button"> Отправить </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
  import { widgetsVisibility } from '../../utils/widgetsVisibility.ts';
  import UiButton from '../ui/UiButton.vue';

  const isOpen = ref(false);
  const rating = ref<number>(0);
  const isGood = computed(() => rating.value >= 4);

  function open() {
    isOpen.value = true;
    widgetsVisibility('hide');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    isOpen.value = false;
    widgetsVisibility('show');
    document.body.style.overflow = 'auto';
  }

  function submit() {
    const anchor = '#popup:review';

    if (!isGood.value) {
      const a = document.createElement('a');
      a.href = anchor;
      document.body.append(a);
      a.click();
      a.remove();
    }

    close();
  }

  function init() {
    const params = new URL(location.href).searchParams;

    const isQuery = params.get('review');
    if (isQuery) open();
  }

  onMounted(() => {
    nextTick(() => {
      if (document.readyState === 'complete') init();
      else window.addEventListener('load', init);
    });
  });

  onUnmounted(close);
</script>
