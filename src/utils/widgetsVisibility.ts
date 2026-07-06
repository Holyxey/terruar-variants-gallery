const attrsToHide = [
  '[id^="jivo"]',
  '[id^="znms"]',
  'jdiv',
  '[id*="alltouch"]',
];
const classAttr = 'hidden-widget';
const styleId = 'widgetsVisibility';

export function widgetsVisibility(to: 'hide' | 'show') {
  try {
    switch (to) {
      case 'hide': {
        document.body.classList.add(classAttr);
        break;
      }
      case 'show': {
        document.body.classList.remove(classAttr);
      }
    }
  } catch (error) {
    console.warn('widgetsVisibility', error);
  }
}

if (
  typeof document !== 'undefined' &&
  !document.querySelector(`style[id="${styleId}"]`)
) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent =
    attrsToHide.map((attr) => `.${classAttr} ${attr}`).join(',') +
    `{opacity: 0 !important; pointer-events: none !important;}`;
  document.head.appendChild(style);
}
