import { slugify } from 'transliteration';

// Strongly typed category enum for better IntelliSense
export enum Category {
  Elevated = 'Повышенная',
  Standard = 'Стандарт',
  Tent = 'Палатки',
}

// Tag can be a simple string or an object with an optional icon
export type Tag = { title: string; iconLink?: string } | string;
export type Variant = {
  title: string;
  slug: string;
  category: Category;
  capacity: number;
  tags: Tag[];
  sqMeters: number;
  bedSize: { w: number; l: number };
  footer?: string[];
};

// Helper to create a Variant with type safety and default values
const createVariant = (
  params: Omit<Variant, 'slug'> & { title: string },
): Variant => {
  const { title, ...rest } = params;
  return {
    title,
    slug: slugify(title),
    ...rest,
  } satisfies Variant;
};

// Common icon URLs
const icons = {
  room: 'https://static.tildacdn.com/tild3634-3137-4461-a338-383331653661/room.svg',
  swim: 'https://static.tildacdn.com/tild3935-6536-4238-b931-303837393639/swim.svg',
  alice:
    'https://static.tildacdn.com/tild3430-6438-4464-b065-333630306333/_.svg',
  heat: 'https://static.tildacdn.com/tild3466-3966-4331-b539-623633386438/fire.svg',
  terrace:
    'https://static.tildacdn.com/tild3163-6338-4233-b934-623866346331/tera.svg',
  shower:
    'https://static.tildacdn.com/tild3632-6335-4236-b734-306464323932/shower.svg',
  kitchen:
    'https://static.tildacdn.com/tild3737-6339-4365-a338-663565316630/kitchen.svg',
  living:
    'https://static.tildacdn.com/tild6437-3866-4163-b830-373531363664/living.svg',
} as const;

// Helper to create a tag object
const createTag = (title: string, iconName?: keyof typeof icons): Tag => ({
  title,
  iconLink: iconName ? icons[iconName] : undefined,
});

// Shared tag arrays
const sharedTags = [
  createTag('спальня', 'room'),
  createTag('доступ к бассейну', 'swim'),
  createTag('Яндекс Алиса', 'alice'),
  createTag('тёплый пол', 'heat'),
  createTag('терраса', 'terrace'),
  createTag('душ', 'shower'),
  createTag('оборудованная кухня', 'kitchen'),
  'мангальная зона',
  'холодильник',
  'посуда',
  'постельное',
  'wifi',
  'тапочки',
  'предметы гигиены',
];

const variantsElevated: Variant[] = [
  {
    title: 'Лаура',
    slug: slugify('Лаура'),
    category: Category.Elevated,
    capacity: 2,
    tags: [
      ...sharedTags,
      'кондиционер',
      'фен',
      'микроволновка',
      'чайник',
      'варочная панель',
      'полотенца',
    ],
    sqMeters: 15,
    bedSize: { w: 160, l: 200 },
    footer: ['Также можем поставить раскладушку'],
  },
  {
    title: 'Валенсия',
    slug: slugify('Валенсия'),
    category: Category.Elevated,
    capacity: 6,
    tags: [
      createTag('2 спальни', 'room'),
      createTag('доступ к бассейну', 'swim'),
      createTag('Яндекс Алиса', 'alice'),
      createTag('тёплый пол', 'heat'),
      createTag('терраса', 'terrace'),
      createTag('гостиная', 'living'),
      createTag('душ', 'shower'),
      createTag('оборудованная кухня', 'kitchen'),
      'мангальная зона',
      'холодильник',
      'посуда',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
    ],
    sqMeters: 63,
    bedSize: { w: 160, l: 200 },
    footer: ['Также можем поставить раскладушку'],
  },
  {
    title: 'Мендоза',
    slug: slugify('Мендоза'),
    category: Category.Elevated,
    capacity: 2,
    sqMeters: 15,
    bedSize: { w: 160, l: 200 },
    footer: ['Также можем поставить раскладушку'],
    tags: sharedTags,
  },
  {
    title: 'Этна',
    slug: slugify('Этна'),
    category: Category.Elevated,
    capacity: 2,
    sqMeters: 15,
    bedSize: { w: 160, l: 200 },
    footer: ['Также можем поставить раскладушку'],
    tags: sharedTags,
  },
  {
    title: 'Апулия',
    slug: slugify('Апулия'),
    category: Category.Elevated,
    capacity: 2,
    sqMeters: 15,
    bedSize: { w: 160, l: 200 },
    footer: ['Также можем поставить раскладушку'],
    tags: sharedTags,
  },
];
const variantsStandard: Variant[] = [
  createVariant({
    title: 'Шампань',
    bedSize: { l: 200, w: 140 },
    capacity: 2 + 2,
    category: Category['Standard'],
    sqMeters: 22,
    tags: [
      createTag('спальня + гостиная', 'room'),
      createTag('доступ к бассейну', 'swim'),
      createTag('Яндекс Алиса', 'alice'),
      createTag('оборудованная кухня', 'kitchen'),
      createTag('терраса', 'terrace'),
      createTag('душ', 'shower'),
      'холодильник',
      'посуда',
      'мангальная зона',
      'терасса',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
    ],
  }),
  createVariant({
    title: 'Бордо',
    bedSize: { l: 200, w: 140 },
    capacity: 2,
    category: Category['Standard'],
    sqMeters: 15,
    tags: [
      createTag('спальня', 'room'),
      createTag('доступ к бассейну', 'swim'),
      createTag('Яндекс Алиса', 'alice'),
      createTag('оборудованная кухня', 'kitchen'),
      createTag('терраса', 'terrace'),
      createTag('душ', 'shower'),
      'холодильник',
      'посуда',
      'мангальная зона',
      'терасса',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
    ],
  }),
  createVariant({
    title: 'Рейнау',
    bedSize: { l: 200, w: 140 },
    capacity: 2,
    category: Category['Standard'],
    sqMeters: 15,
    tags: [
      createTag('спальня', 'room'),
      createTag('доступ к бассейну', 'swim'),
      createTag('Яндекс Алиса', 'alice'),
      createTag('оборудованная кухня', 'kitchen'),
      createTag('терраса', 'terrace'),
      createTag('душ', 'shower'),
      'холодильник',
      'посуда',
      'мангальная зона',
      'терасса',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
    ],
  }),
  createVariant({
    title: 'Бургундия',
    category: Category['Standard'],
    capacity: 2,
    sqMeters: 15,
    bedSize: { w: 140, l: 200 },
    tags: [
      createTag('спальня', 'room'),
      createTag('доступ к бассейну', 'swim'),
      createTag('Яндекс Алиса', 'alice'),
      createTag('оборудованная кухня', 'kitchen'),
      createTag('терраса', 'terrace'),
      createTag('душ', 'shower'),
      'холодильник',
      'посуда',
      'мангальная зона',
      'терасса',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
    ],
  }),
  createVariant({
    title: 'Тоскана',
    category: Category['Standard'],
    capacity: 2,
    sqMeters: 15,
    bedSize: { w: 140, l: 200 },
    tags: [
      createTag('спальня', 'room'),
      createTag('доступ к бассейну', 'swim'),
      createTag('Яндекс Алиса', 'alice'),
      createTag('оборудованная кухня', 'kitchen'),
      createTag('терраса', 'terrace'),
      createTag('душ', 'shower'),
      'холодильник',
      'посуда',
      'мангальная зона',
      'терасса',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
    ],
  }),
  createVariant({
    title: 'Прованс',
    category: Category['Standard'],
    capacity: 2,
    sqMeters: 15,
    bedSize: { w: 140, l: 200 },
    tags: [
      createTag('спальня', 'room'),
      createTag('доступ к бассейну', 'swim'),
      createTag('Яндекс Алиса', 'alice'),
      createTag('оборудованная кухня', 'kitchen'),
      createTag('терраса', 'terrace'),
      createTag('душ', 'shower'),
      'холодильник',
      'посуда',
      'мангальная зона',
      'терасса',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
    ],
  }),
  createVariant({
    title: 'Медок',
    category: Category['Standard'],
    capacity: 2 + 2,
    sqMeters: 36,
    bedSize: { w: 140, l: 200 },
    tags: [
      createTag('спальня + гостиная', 'room'),
      createTag('доступ к бассейну', 'swim'),
      createTag('Яндекс Алиса', 'alice'),
      createTag('оборудованная кухня', 'kitchen'),
      createTag('терраса', 'terrace'),
      createTag('душ', 'shower'),
      'холодильник',
      'посуда',
      'мангальная зона',
      'терасса',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
    ],
  }),
];
const variantsTent: Variant[] = [
  createVariant({
    title: 'Палатка',
    category: Category['Tent'],
    bedSize: { w: 140, l: 200 },
    capacity: 3 + 1,
    sqMeters: 15,
    tags: [
      createTag('1 кровать', 'living'),
      createTag('доступ к бассейну', 'swim'),
      createTag('дровянной камин', 'heat'),
      createTag('душ', 'shower'),
      'холодильник',
      'летняя кухня',
      'индивидуальный санузел',
      'мангальная зона',
      'холодильник',
      'посуда',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
    ],
  }),
];

//
export const variants: Variant[] = [
  ...variantsElevated,
  ...variantsStandard,
  ...variantsTent,
];

let cmd = `cd src/assets/photos && mkdir -p `;
variants.map((v) => {
  cmd = cmd + ` ${v.title}`;
});
console.log(cmd);
