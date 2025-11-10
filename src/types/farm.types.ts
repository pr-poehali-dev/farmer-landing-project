export const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

export const ANIMAL_TYPES = [
  { value: 'cows', label: 'Коровы' },
  { value: 'bulls', label: 'Быки' },
  { value: 'sheep', label: 'Овцы' },
  { value: 'goats', label: 'Козы' },
  { value: 'pigs', label: 'Свиньи' },
  { value: 'horses', label: 'Лошади' },
  { value: 'chickens', label: 'Куры' },
  { value: 'ducks', label: 'Утки' },
  { value: 'geese', label: 'Гуси' },
  { value: 'turkeys', label: 'Индейки' },
  { value: 'rabbits', label: 'Кролики' },
  { value: 'llamas', label: 'Ламы' },
  { value: 'alpacas', label: 'Альпаки' },
  { value: 'donkeys', label: 'Ослы' },
  { value: 'camels', label: 'Верблюды' },
  { value: 'yaks', label: 'Яки' },
  { value: 'deer', label: 'Олени' },
  { value: 'ostriches', label: 'Страусы' },
  { value: 'hives', label: 'Ульи' },
];

export const CROP_TYPES = [
  { value: 'beet', label: 'Свёкла' },
  { value: 'cabbage', label: 'Капуста' },
  { value: 'rapeseed', label: 'Рапс' },
  { value: 'soy', label: 'Соя' },
  { value: 'corn', label: 'Кукуруза' },
  { value: 'garlic', label: 'Чеснок' },
  { value: 'other', label: 'Другое' },
];

export interface Crop {
  type: string;
  area: number;
  yield: number;
  customName?: string;
}

export interface Animal {
  type: string;
  count: number;
  breed?: string;
  direction?: 'meat' | 'milk' | 'mixed' | 'other';
  meatYield?: number;
  milkYield?: number;
}

export interface Equipment {
  id: string;
  brand: string;
  model: string;
  year: string;
  attachments: string;
}