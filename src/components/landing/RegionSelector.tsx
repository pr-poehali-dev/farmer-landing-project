import { Input } from '@/components/ui/input';

interface RegionSelectorProps {
  name: string;
  borderColor: string;
  showCustom: boolean;
  onRegionChange: (showCustom: boolean) => void;
}

const REGIONS = [
  'Республика Бурятия',
  'Москва',
  'Санкт-Петербург',
  'Московская область',
  'Ленинградская область',
  'Краснодарский край',
  'Ростовская область',
  'Свердловская область',
  'Новосибирская область',
  'Татарстан',
  'Челябинская область',
  'Башкортостан',
  'Нижегородская область',
  'Самарская область',
  'Омская область',
  'Красноярский край',
  'Воронежская область',
  'Пермский край',
  'Волгоградская область',
];

export default function RegionSelector({ name, borderColor, showCustom, onRegionChange }: RegionSelectorProps) {
  return (
    <>
      <select 
        name={name}
        className={`w-full px-3 py-2 border ${borderColor} rounded-md bg-white`}
        onChange={(e) => onRegionChange(e.target.value === 'Другой регион')}
      >
        <option value="">Выберите регион</option>
        {REGIONS.map(region => (
          <option key={region}>{region}</option>
        ))}
        <option>Другой регион</option>
      </select>
      {showCustom && (
        <Input name="custom_region" placeholder="Введите ваш регион" required className="bg-white" />
      )}
    </>
  );
}
