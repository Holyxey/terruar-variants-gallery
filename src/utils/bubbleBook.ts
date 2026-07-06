import { clickBook } from './clickBook';

export function bubbleBook(title: string) {
  const el = document.getElementById('bubbleBook');

  if (!el) {
    console.error("Can't find booking button");
    return;
  }

  el.click();

  const form: HTMLFormElement | null = document.querySelector(
    '[data-book-form] form',
  );

  if (!form) return;

  const existedInput: null | HTMLInputElement = form.querySelector(
    '[name="Название домика"]',
  );

  const formVariantName = existedInput || document.createElement('input');
  formVariantName.name = 'Название домика';
  formVariantName.value = title;
  formVariantName.hidden = true;

  if (!existedInput) form.appendChild(formVariantName);

  clickBook(title);
}
