export function hideElement(el: HTMLElement) {
  el.style.opacity = '0';
  el.style.pointerEvents = 'none';
}
export function showElement(el: HTMLElement) {
  el.style.opacity = '1';
  el.style.pointerEvents = 'auto';
}

export function widgetsVisibility(to: 'hide' | 'show') {
  try {
    const jdiv: HTMLElement | null = document.querySelector('jdiv');
    const ctouch: HTMLElement | null =
      document.querySelector('[id*="alltouch"]');

    const els = [jdiv, ctouch];

    switch (to) {
      case 'hide': {
        els.forEach((el) => el && hideElement(el));
        break;
      }
      case 'show': {
        els.forEach((el) => el && showElement(el));
        break;
      }
    }
  } catch (error) {
    console.warn('', error);
  }
}
