export const LIVESTOCK_TYPES = [
  { value: 'cow', label: 'Корова' },
  { value: 'bull', label: 'Бык' },
  { value: 'sheep', label: 'Овца' },
  { value: 'goat', label: 'Коза' },
  { value: 'pig', label: 'Свинья' },
  { value: 'horse', label: 'Лошадь' },
  { value: 'chicken', label: 'Курица' },
  { value: 'duck', label: 'Утка' },
  { value: 'goose', label: 'Гусь' },
  { value: 'turkey', label: 'Индейка' },
  { value: 'rabbit', label: 'Кролик' },
  { value: 'llama', label: 'Лама' },
  { value: 'alpaca', label: 'Альпака' },
  { value: 'donkey', label: 'Осёл' },
  { value: 'camel', label: 'Верблюд' },
  { value: 'yak', label: 'Як' },
  { value: 'deer', label: 'Олень' },
  { value: 'ostrich', label: 'Страус' }
] as const;

export const LIVESTOCK_DIRECTIONS = [
  { value: 'dairy', label: 'Молочный' },
  { value: 'meat', label: 'Мясной' },
  { value: 'meat_dairy', label: 'Мясо-молочный' },
  { value: 'wool', label: 'Шерстной' },
  { value: 'meat_wool', label: 'Мясо-шерстной' },
  { value: 'egg', label: 'Яичный' },
  { value: 'draft', label: 'Рабочий' }
] as const;

export const LIVESTOCK_BREEDS: Record<string, { value: string; label: string }[]> = {
  cow: [
    { value: 'holstein', label: 'Голштинская' },
    { value: 'jersey', label: 'Джерсейская' },
    { value: 'simmental', label: 'Симментальская' },
    { value: 'hereford', label: 'Герефордская' },
    { value: 'angus', label: 'Ангусская' },
    { value: 'yaroslavl', label: 'Ярославская' },
    { value: 'kholmogorsk', label: 'Холмогорская' },
    { value: 'black_pied', label: 'Черно-пёстрая' },
    { value: 'red_steppe', label: 'Красная степная' }
  ],
  bull: [
    { value: 'hereford', label: 'Герефордская' },
    { value: 'angus', label: 'Ангусская' },
    { value: 'limousin', label: 'Лимузин' },
    { value: 'charolais', label: 'Шароле' },
    { value: 'simmental', label: 'Симментальская' }
  ],
  sheep: [
    { value: 'merino', label: 'Меринос' },
    { value: 'romanov', label: 'Романовская' },
    { value: 'karakul', label: 'Каракульская' },
    { value: 'texel', label: 'Тексель' },
    { value: 'dorper', label: 'Дорпер' },
    { value: 'suffolk', label: 'Суффолк' },
    { value: 'edilbay', label: 'Эдильбаевская' }
  ],
  goat: [
    { value: 'saanen', label: 'Зааненская' },
    { value: 'alpine', label: 'Альпийская' },
    { value: 'nubian', label: 'Нубийская' },
    { value: 'toggenburg', label: 'Тоггенбургская' },
    { value: 'russian_white', label: 'Русская белая' },
    { value: 'angora', label: 'Ангорская' }
  ],
  pig: [
    { value: 'large_white', label: 'Крупная белая' },
    { value: 'landrace', label: 'Ландрас' },
    { value: 'duroc', label: 'Дюрок' },
    { value: 'yorkshire', label: 'Йоркшир' },
    { value: 'vietnamese', label: 'Вьетнамская вислобрюхая' },
    { value: 'mangalitsa', label: 'Мангалица' }
  ],
  horse: [
    { value: 'arabian', label: 'Арабская' },
    { value: 'thoroughbred', label: 'Чистокровная верховая' },
    { value: 'orlov_trotter', label: 'Орловский рысак' },
    { value: 'russian_heavy', label: 'Русский тяжеловоз' },
    { value: 'akhal_teke', label: 'Ахалтекинская' }
  ],
  chicken: [
    { value: 'leghorn', label: 'Леггорн' },
    { value: 'rhode_island', label: 'Род-Айленд' },
    { value: 'plymouth_rock', label: 'Плимутрок' },
    { value: 'brahma', label: 'Брама' },
    { value: 'russian_white', label: 'Русская белая' }
  ],
  duck: [
    { value: 'pekin', label: 'Пекинская' },
    { value: 'muscovy', label: 'Мускусная' },
    { value: 'indian_runner', label: 'Индийский бегун' },
    { value: 'khaki_campbell', label: 'Хаки-кемпбелл' }
  ],
  goose: [
    { value: 'toulouse', label: 'Тулузская' },
    { value: 'emden', label: 'Эмденская' },
    { value: 'chinese', label: 'Китайская' },
    { value: 'gray', label: 'Серая' }
  ],
  turkey: [
    { value: 'broad_breasted_white', label: 'Широкогрудая белая' },
    { value: 'bronze', label: 'Бронзовая' },
    { value: 'black', label: 'Чёрная' }
  ],
  rabbit: [
    { value: 'new_zealand_white', label: 'Новозеландская белая' },
    { value: 'california', label: 'Калифорнийская' },
    { value: 'rex', label: 'Рекс' },
    { value: 'soviet_chinchilla', label: 'Советская шиншилла' },
    { value: 'gray_giant', label: 'Серый великан' }
  ],
  llama: [
    { value: 'classic', label: 'Классическая' },
    { value: 'woolly', label: 'Шерстяная' }
  ],
  alpaca: [
    { value: 'huacaya', label: 'Уакайя' },
    { value: 'suri', label: 'Сури' }
  ],
  donkey: [
    { value: 'standard', label: 'Стандартный' },
    { value: 'miniature', label: 'Миниатюрный' },
    { value: 'mammoth', label: 'Мамонтовый' }
  ],
  camel: [
    { value: 'dromedary', label: 'Одногорбый (дромедар)' },
    { value: 'bactrian', label: 'Двугорбый (бактриан)' }
  ],
  yak: [
    { value: 'tibetan', label: 'Тибетский' },
    { value: 'mongolian', label: 'Монгольский' },
    { value: 'domestic', label: 'Домашний' }
  ],
  deer: [
    { value: 'red', label: 'Благородный' },
    { value: 'sika', label: 'Пятнистый' },
    { value: 'fallow', label: 'Лань' },
    { value: 'reindeer', label: 'Северный олень' }
  ],
  ostrich: [
    { value: 'black', label: 'Чёрный африканский' },
    { value: 'blue', label: 'Голубошейный' },
    { value: 'red', label: 'Красношейный' }
  ]
};

export type LivestockType = typeof LIVESTOCK_TYPES[number]['value'];
export type LivestockDirection = typeof LIVESTOCK_DIRECTIONS[number]['value'];