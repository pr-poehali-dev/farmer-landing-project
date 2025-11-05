export const CROP_TYPES = [
  { value: 'wheat', label: 'Пшеница' },
  { value: 'barley', label: 'Ячмень' },
  { value: 'corn', label: 'Кукуруза' },
  { value: 'rice', label: 'Рис' },
  { value: 'oats', label: 'Овёс' },
  { value: 'rye', label: 'Рожь' },
  { value: 'buckwheat', label: 'Гречиха' },
  { value: 'sunflower', label: 'Подсолнечник' },
  { value: 'rapeseed', label: 'Рапс' },
  { value: 'soybean', label: 'Соя' },
  { value: 'potato', label: 'Картофель' },
  { value: 'sugar_beet', label: 'Сахарная свёкла' },
  { value: 'carrot', label: 'Морковь' },
  { value: 'cabbage', label: 'Капуста' },
  { value: 'tomato', label: 'Томат' }
] as const;

export const CROP_VARIETIES: Record<string, { value: string; label: string }[]> = {
  wheat: [
    { value: 'spring_soft', label: 'Яровая мягкая' },
    { value: 'winter_soft', label: 'Озимая мягкая' },
    { value: 'spring_durum', label: 'Яровая твёрдая' },
    { value: 'winter_durum', label: 'Озимая твёрдая' }
  ],
  barley: [
    { value: 'spring_feed', label: 'Яровой кормовой' },
    { value: 'spring_brewing', label: 'Яровой пивоваренный' },
    { value: 'winter', label: 'Озимый' }
  ],
  corn: [
    { value: 'grain', label: 'Зерновая' },
    { value: 'silage', label: 'Силосная' },
    { value: 'sweet', label: 'Сахарная' }
  ],
  rice: [
    { value: 'japonica', label: 'Японский (круглозёрный)' },
    { value: 'indica', label: 'Индийский (длиннозёрный)' },
    { value: 'aromatic', label: 'Ароматный' }
  ],
  oats: [
    { value: 'feed', label: 'Кормовой' },
    { value: 'food', label: 'Пищевой' }
  ],
  rye: [
    { value: 'winter', label: 'Озимая' },
    { value: 'spring', label: 'Яровая' }
  ],
  buckwheat: [
    { value: 'common', label: 'Обыкновенная' },
    { value: 'tartary', label: 'Татарская' }
  ],
  sunflower: [
    { value: 'oil', label: 'Масличный' },
    { value: 'confectionery', label: 'Кондитерский' },
    { value: 'high_oleic', label: 'Высокоолеиновый' }
  ],
  rapeseed: [
    { value: 'winter', label: 'Озимый' },
    { value: 'spring', label: 'Яровой' }
  ],
  soybean: [
    { value: 'early', label: 'Раннеспелая' },
    { value: 'medium', label: 'Среднеспелая' },
    { value: 'late', label: 'Позднеспелая' }
  ],
  potato: [
    { value: 'early', label: 'Ранний' },
    { value: 'medium', label: 'Среднеспелый' },
    { value: 'late', label: 'Поздний' },
    { value: 'table', label: 'Столовый' },
    { value: 'technical', label: 'Технический' }
  ],
  sugar_beet: [
    { value: 'standard', label: 'Стандартная' },
    { value: 'high_sugar', label: 'Высокосахаристая' }
  ],
  carrot: [
    { value: 'early', label: 'Ранняя' },
    { value: 'medium', label: 'Среднеспелая' },
    { value: 'late', label: 'Поздняя' }
  ],
  cabbage: [
    { value: 'white', label: 'Белокочанная' },
    { value: 'red', label: 'Краснокочанная' },
    { value: 'savoy', label: 'Савойская' },
    { value: 'beijing', label: 'Пекинская' }
  ],
  tomato: [
    { value: 'determinate', label: 'Детерминантный' },
    { value: 'indeterminate', label: 'Индетерминантный' },
    { value: 'cherry', label: 'Черри' }
  ]
};

export const CROP_PURPOSES = [
  { value: 'food', label: 'Пищевая' },
  { value: 'feed', label: 'Кормовая' },
  { value: 'technical', label: 'Техническая' },
  { value: 'oil', label: 'Масличная' },
  { value: 'sugar', label: 'Сахарная' }
] as const;

export type CropType = typeof CROP_TYPES[number]['value'];
export type CropPurpose = typeof CROP_PURPOSES[number]['value'];
