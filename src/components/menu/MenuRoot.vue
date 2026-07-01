<template>
  <div
    :class="[
      'fixed top-0 left-0 z-9999999999! h-full w-full',
      'bg-black-dark/20 flex flex-col items-center justify-end gap-4 px-4 pt-4',
      'transition-all duration-500 ease-in-out',
      currentMenuLink
        ? 'backdrop-blur-xs'
        : 'pointer-events-none translate-y-4 opacity-0',
    ]"
    @click="close"
  >
    <div v-if="currentMenuLink" class="flex gap-4">
      <UiButton option="border" :href="currentMenuLink" is="a" target="_blank">
        Открыть документ
      </UiButton>

      <UiButton is="button" @click="close">Закрыть</UiButton>
    </div>

    <div
      @click.stop
      ref="viewerRef"
      :class="[
        'bg-black-dark no-scrollbar h-9/12 min-h-1/2 w-full max-w-xl overflow-y-auto rounded-t-xl',
        'flex flex-col items-center gap-2 py-2',
      ]"
    >
      <div v-if="isLoading" class="py-8 text-white/60">Загрузка документа…</div>
      <div v-else-if="loadError" class="py-8 text-red-400">
        Не удалось загрузить документ
      </div>
      <canvas
        v-for="page in pageCount"
        :key="page"
        :ref="(el) => setCanvasRef(el as HTMLCanvasElement, page)"
        class="w-full max-w-full rounded-md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch,
    shallowRef,
  } from 'vue';
  import UiButton from '../ui/UiButton.vue';
  import { widgetsVisibility } from '../../utils/widgetsVisibility.ts';

  // Ленивая инициализация pdfjs — воркер и либа грузятся с нашего сервера,
  // сторонние ресурсы (CDN) не используются.
  let pdfjsLibPromise: Promise<
    typeof import('pdfjs-dist/legacy/build/pdf.mjs')
  > | null = null;

  function getPdfjsLib() {
    if (!pdfjsLibPromise) {
      pdfjsLibPromise = import(
        /* @vite-ignore */ process.env.API_PATH + '/pdfjs/pdf.mjs'
      ).then((lib) => {
        lib.GlobalWorkerOptions.workerSrc =
          process.env.API_PATH + '/pdfjs/pdf.worker.mjs';
        return lib;
      });
    }
    return pdfjsLibPromise;
  }

  // Выводим типы напрямую из библиотеки, чтобы не расходиться с версией пакета
  type PdfjsLib = Awaited<ReturnType<typeof getPdfjsLib>>;
  type PDFDocumentProxy = Awaited<
    ReturnType<PdfjsLib['getDocument']>['promise']
  >;
  type PDFPageProxy = Awaited<ReturnType<PDFDocumentProxy['getPage']>>;

  const menuList: Record<string, string> = {
    base: process.env.API_PATH + '/menus/base.pdf',
  } as const;

  const currentMenuLink = ref<string | undefined>();
  const isLoading = ref(false);
  const loadError = ref(false);
  const pageCount = ref(0);
  const viewerRef = ref<HTMLElement | null>(null);

  let interval: ReturnType<typeof setInterval>;
  const pdfDoc = shallowRef<PDFDocumentProxy | null>(null);
  let renderTasks: Array<{ cancel: () => void }> = [];
  const canvasRefs = new Map<number, HTMLCanvasElement>();

  function setCanvasRef(el: HTMLCanvasElement | null, page: number) {
    if (el) canvasRefs.set(page, el);
    else canvasRefs.delete(page);
  }

  function isRenderCancelledError(err: unknown): err is { name: string } {
    if (typeof err !== 'object' || err === null) return false;
    if (!('name' in err)) return false;

    const name = err satisfies Record<'name', unknown>;
    return (
      typeof name.name === 'string' &&
      name.name === 'RenderingCancelledException'
    );
  }

  async function renderPage(pdf: PDFDocumentProxy, pageNum: number) {
    const canvas = canvasRefs.get(pageNum);
    if (!canvas) return;

    const page: PDFPageProxy = await pdf.getPage(pageNum);

    const containerWidth =
      viewerRef.value?.clientWidth ?? canvas.clientWidth ?? 320;
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / baseViewport.width;
    const dpr = window.devicePixelRatio || 1;
    const viewport = page.getViewport({ scale: scale * dpr });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    const context = canvas.getContext('2d');
    if (!context) return;

    const task = page.render({ canvas, canvasContext: context, viewport });
    renderTasks.push(task);
    try {
      await task.promise;
    } catch (err: unknown) {
      // Игнорируем ошибку отмены рендера при быстром закрытии окна
      if (!isRenderCancelledError(err)) {
        console.error('PDF render error:', err);
      }
    }
  }

  async function renderAllPages(pdf: PDFDocumentProxy) {
    for (let i = 1; i <= pdf.numPages; i++) {
      await renderPage(pdf, i);
    }
  }

  function cancelRenderTasks() {
    renderTasks.forEach((t) => t.cancel());
    renderTasks = [];
  }

  async function destroyPdfDoc() {
    if (pdfDoc.value && 'destroy' in pdfDoc.value) {
      const doc: { destroy: () => Promise<void> } = pdfDoc.value;
      await doc.destroy();
    }
    pdfDoc.value = null;
  }

  async function loadPdf(url: string) {
    isLoading.value = true;
    loadError.value = false;
    pageCount.value = 0;
    canvasRefs.clear();

    try {
      const pdfjsLib = await getPdfjsLib();
      const pdf = await pdfjsLib.getDocument({ url }).promise;
      pdfDoc.value = pdf;
      pageCount.value = pdf.numPages;

      await nextTick();
      await renderAllPages(pdf);
    } catch (err) {
      console.error('Failed to load PDF:', err);
      loadError.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  function open(key: keyof typeof menuList) {
    if (!menuList[key]) return console.warn(key, 'menu is non defined');

    interval = setInterval(() => {
      widgetsVisibility('hide');
    }, 1500);
    currentMenuLink.value = menuList[key];

    loadPdf(currentMenuLink.value);
  }

  const close = () => {
    if (interval) clearInterval(interval);

    cancelRenderTasks();
    destroyPdfDoc();

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
    nextTick(() => {
      if (document.readyState === 'complete') init();
      else window.addEventListener('load', () => init());
    });
  });

  onUnmounted(() => {
    if (interval) clearInterval(interval);
    cancelRenderTasks();
    destroyPdfDoc();
  });
</script>
