export function clickBook(categoryName: string) {
  try {
    if (process.env.DEV) return;

    window.rybbit?.event('Book custom gallery', {
      categoryName,
    });
    window?.ym(87554982, 'reachGoal', 'bookVueGallery');
  } catch (e) {
    console.error(e);
  }
}
