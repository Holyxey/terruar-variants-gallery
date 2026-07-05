export function hideElement(el: HTMLElement) {
  el.style.opacity = '0';
  el.style.pointerEvents = 'none';
  el.inert = true;
}
export function showElement(el: HTMLElement) {
  el.style.opacity = '1';
  el.style.pointerEvents = 'auto';
  el.inert = false;
}

let timeout: ReturnType<typeof setInterval>;

export function widgetsVisibility(to: 'hide' | 'show') {
  try {
    const els = [
      ...Array.from(document.querySelectorAll('[id^="jivo"]')),
      ...Array.from(document.querySelectorAll('[id^="znms"]')),
      document.querySelector('jdiv'),
      document.querySelector('[id*="alltouch"]'),
    ].filter((el): el is HTMLElement => el !== null);

    if (timeout) clearInterval(timeout);

    switch (to) {
      case 'hide': {
        timeout = setInterval(() => {
          els.forEach((el) => el && hideElement(el));
        }, 1000);
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
