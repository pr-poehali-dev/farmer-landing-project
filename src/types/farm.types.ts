export const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

export const ANIMAL_TYPES = [
  { value: 'horses', label: 'Лошади' },
  { value: 'cows', label: 'Коровы' },
  { value: 'deer', label: 'Олени' },
  { value: 'sheep', label: 'Овцы' },
  { value: 'pigs', label: 'Свиньи' },
  { value: 'chickens', label: 'Куры' },
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
}

export interface Equipment {
  id: string;
  brand: string;
  model: string;
  year: string;
  attachments: string;
}
