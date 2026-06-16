export function jdivToggleVisibility(to: 'hide' | 'show') {
  const block: HTMLElement | null = document.querySelector('jdiv');
  if (!block) {
    console.log("%cCan't find <jdiv> to " + to, 'color:orange');
    return;
  }

  if (to === 'hide') {
    block.style.opacity = '0';
    block.style.pointerEvents = 'none';
  } else if (to === 'show') {
    block.style.opacity = '1';
    block.style.pointerEvents = 'auto';
  }
}
