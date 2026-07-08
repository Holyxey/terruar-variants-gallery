import { slugify } from '../utils/slugify';
import { icons } from './icons';

export enum Category {
  Elevated = 'Повышенная',
  Standart = 'Стандарт',
  Tent = 'Палатки',
  Company = 'На компанию',
  Studio = 'Домик студия',
}
export type VariantTitle =
  | 'Лаура'
  | 'Напа'
  | 'Мендоза'
  | 'Этна'
  | 'Апулия'
  | 'Риоха'
  | 'Риоха с чаном'
  | 'Глэмпинг с перс.душем'
  | 'Шампань'
  | 'Медок'
  | 'Валенсия'
  | 'Бордо'
  | 'Рейнау'
  | 'Бургундия'
  | 'Тоскана'
  | 'Прованс';
export type Tag = { title: string; iconLink?: string } | string;
export type Variant = {
  title: VariantTitle;
  slug: string;
  category: Category;
  capacity: number;
  tags: Tag[];
  sqMeters: number;
  bedSize: { w: number; l: number };
  footer?: string[];
};

export function isCategory(value: string): value is Category {
  return Object.values<string>(Category).includes(value);
}

const createVariant = (
  title: VariantTitle,
  params: Omit<Variant, 'slug' | 'title'>,
) => {
  return {
    title,
    slug: slugify(title),
    ...params,
  };
};
const createTag = (title: string, iconName?: keyof typeof icons): Tag => ({
  title,
  iconLink: iconName ? icons[iconName] : undefined,
});

// Shared tags
const sharedTags = [
  createTag('доступ к бассейну', 'swim'),
  createTag('Яндекс Алиса', 'alice'),
  createTag('тёплый пол', 'heat'),
  createTag('терраса', 'terrace'),
  createTag('душ', 'shower'),
  createTag('холодильник', 'snow'),
  createTag('посуда'),
  createTag('постельное'),
  createTag('Wi-Fi', 'wifi'),
  createTag('тапочки'),
  createTag('предметы гигиены'),
];

const sharedStandart = {
  category: Category.Standart,
  sqMeters: 18,
  capacity: 2 + 1,
  bedSize: { w: 160, l: 200 },
  tags: [
    createTag('спальня', 'bed'),
    createTag('мини-кухня', 'kitchen'),
    createTag('мангал', 'barbecue'),
    createTag('кондиционер', 'snow'),
    createTag('доступ к бассейну', 'swim'),
    createTag('тёплый пол', 'heat'),
    createTag('терраса', 'terrace'),
    createTag('душ', 'shower'),
    createTag('холодильник', 'snow'),
    createTag('посуда'),
    createTag('постельное'),
    createTag('Wi-Fi', 'wifi'),
    createTag('тапочки'),
    createTag('предметы гигиены'),
  ],
  footer: ['Также можем поставить раскладушку'],
} satisfies Partial<Variant>;
const sharedStudio = {
  category: Category.Studio,
  sqMeters: 15,
  capacity: 2,
  bedSize: { w: 140, l: 200 },
  tags: [...sharedTags],
  footer: ['Также можем поставить раскладушку'],
} satisfies Partial<Variant>;
const sharedElevated = {
  category: Category.Elevated,
  tags: [...sharedTags],
  sqMeters: 15,
  capacity: 2,
  bedSize: { w: 160, l: 200 },
  footer: ['Также можем поставить раскладушку'],
} satisfies Partial<Variant>;
const sharedTent = {
  category: Category.Tent,
  bedSize: { w: 140, l: 200 },
  sqMeters: 15,
  capacity: 4,
  tags: [
    createTag('1 кровать'),
    createTag('Доступ к бассейну'),
    createTag('Дровяной камин'),
    createTag('Душ'),
    createTag('Холодильник', 'snow'),
    createTag('Летняя кухня'),
    createTag('Индивидуальный санузел'),
    createTag('Мангальная зона', 'barbecue'),
    createTag('Посуда'),
    createTag('Постельное'),
    createTag('Wi-Fi', 'wifi'),
    createTag('Тапочки'),
    createTag('Предметы гигиены'),
  ],
  footer: ['Также можем поставить раскладушку'],
} satisfies Partial<Variant>;
const sharedCompany = {
  category: Category.Company,
  tags: [...sharedTags],
  // footer: ['Также можем поставить раскладушку'],
} satisfies Partial<Variant>;

// Variants
const variantsStandard: Variant[] = [
  createVariant('Риоха', {
    ...sharedStandart,
    tags: [...sharedStandart.tags],
  }),
  createVariant('Риоха с чаном', {
    ...sharedStandart,
    tags: [createTag('Персональный чан'), ...sharedStandart.tags],
  }),
];
const variantsStudio: Variant[] = [
  createVariant('Бордо', {
    ...sharedStudio,
  }),
  createVariant('Рейнау', {
    ...sharedStudio,
  }),
  createVariant('Бургундия', {
    ...sharedStudio,
  }),
  createVariant('Тоскана', {
    ...sharedStudio,
  }),
  createVariant('Прованс', {
    ...sharedStudio,
  }),
];
const variantsElevated: Variant[] = [
  createVariant('Лаура', {
    ...sharedElevated,
    tags: [...sharedElevated.tags],
  }),
  createVariant('Напа', {
    ...sharedElevated,
    tags: [
      createTag('доступ к бассейну', 'swim'),
      createTag('тёплый пол', 'heat'),
      createTag('терраса', 'terrace'),
      createTag('душ', 'shower'),
      createTag('холодильник', 'snow'),
      createTag('посуда'),
      createTag('постельное'),
      createTag('Wi-Fi', 'wifi'),
      createTag('тапочки'),
      createTag('предметы гигиены'),
      createTag('кондиционер', 'snow'),
    ],
    footer: undefined,
  }),
  createVariant('Мендоза', {
    ...sharedElevated,
    tags: [...sharedElevated.tags],
  }),
  createVariant('Этна', {
    ...sharedElevated,
    tags: [...sharedElevated.tags],
  }),
  createVariant('Апулия', {
    ...sharedElevated,
    tags: [...sharedElevated.tags],
  }),
];
const variantsCompany: Variant[] = [
  createVariant('Шампань', {
    ...sharedCompany,
    capacity: 4,
    sqMeters: 22,
    bedSize: { w: 140, l: 200 },
  }),
  createVariant('Медок', {
    ...sharedCompany,
    capacity: 4,
    sqMeters: 36,
    bedSize: { w: 140, l: 200 },
  }),
  createVariant('Валенсия', {
    ...sharedCompany,
    capacity: 6,
    sqMeters: 63,
    bedSize: { w: 160, l: 200 },
  }),
];
const variantsTent: Variant[] = [
  createVariant('Глэмпинг с перс.душем', {
    ...sharedTent,
  }),
  // createVariant('Мальбек', {
  //   ...sharedTent,
  // }),
  // createVariant('Рислинг', {
  //   ...sharedTent,
  // }),
  // createVariant('Мерло', {
  //   ...sharedTent,
  // }),
];

//
export const variants: Variant[] = [
  ...variantsElevated,
  ...variantsStandard,
  ...variantsTent,
  ...variantsCompany,
  ...variantsStudio,
] as const;
