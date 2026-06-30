export function widgetsVisibility(to: 'hide' | 'show') {
  try {
    const jdiv: HTMLElement | null = document.querySelector('jdiv');
    const ctouch: HTMLElement | null =
      document.querySelector('[id*="alltouch"]');

    function hide(el?: HTMLElement | null) {
      if (!el) return;
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    }
    function show(el?: HTMLElement | null) {
      if (!el) return;
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    }

    switch (to) {
      case 'hide': {
        [jdiv, ctouch].forEach((el) => hide(el));
        break;
      }
      case 'show': {
        [jdiv, ctouch].forEach((el) => show(el));
        break;
      }
    }
  } catch (error) {
    console.warn('', error);
  }
}
