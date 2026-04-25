import { slugify } from 'transliteration';

type Category = 'Повышенная' | 'Стандарт' | 'Палатки';

export type Variant = {
  title: string;
  slug: string;
  category: Category;
  capacity: number;
  tags: ({ title: string; iconLink?: string } | string)[];
  sqMeters: number;
  bedSize: { w: number; l: number };
  footer?: string[];
};

// export const variants: Variant[] = [
//   {
//     title: 'Лаура',
//     category: 'Повышенная',
//     capacity: 2,
//     tags: [
//       { title: 'спальня' },
//       { title: 'доступ к бассейну' },
//       { title: 'Яндекс Алиса' },
//       { title: 'тёплый пол' },
//       { title: 'терраса' },
//       { title: 'душ' },
//       { title: 'оборудованная кухня' },
//       'мангальная зона',
//       'холодильник',
//       'посуда',
//       'постельное',
//       'wifi',
//       'тапочки',
//       'предметы гигиены',
//     ],
//     sqMeters: 22,
//     bedSize: { w: 140, l: 200 },
//   },
// ];
export const variants: Variant[] = [
  {
    title: 'Лаура',
    slug: slugify('Лаура'),
    category: 'Повышенная',
    capacity: 2,
    tags: [
      {
        title: 'спальня',
        iconLink:
          'https://static.tildacdn.com/tild3634-3137-4461-a338-383331653661/room.svg',
      },
      { title: 'доступ к бассейну' },
      { title: 'Яндекс Алиса' },
      { title: 'тёплый пол' },
      { title: 'терраса' },
      { title: 'душ' },
      { title: 'оборудованная кухня' },
      'мангальная зона',
      'холодильник',
      'посуда',
      'постельное',
      'wifi',
      'тапочки',
      'предметы гигиены',
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
];
