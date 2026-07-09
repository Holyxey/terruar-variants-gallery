export function clickBook() {
  try {
    if (process.env.DEV) return;

    window?.ym(87554982, 'reachGoal', 'bookVueGallery');
  } catch (e) {
    console.error(e);
  }
}
