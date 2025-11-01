import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { countries, russianRegions } from '@/data/regions';

interface RegionSelectorProps {
  country: string;
  region: string;
  onCountryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
}

const RegionSelector = ({ country, region, onCountryChange, onRegionChange }: RegionSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 italic leading-relaxed">
          Выбери свой край земли — стань хранителем таинства, где природа шепчет секреты
        </p>
      </div>

      <div>
        <Label htmlFor="country" className="text-base font-semibold">
          Страна <span className="text-red-500">*</span>
        </Label>
        <Select value={country} onValueChange={onCountryChange}>
          <SelectTrigger id="country" className="mt-1">
            <SelectValue placeholder="Выберите страну" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {country === 'Россия' ? (
        <div>
          <Label htmlFor="region" className="text-base font-semibold">
            Регион <span className="text-red-500">*</span>
          </Label>
          <Select value={region} onValueChange={onRegionChange}>
            <SelectTrigger id="region" className="mt-1">
              <SelectValue placeholder="Выберите регион" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {russianRegions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : country && country !== 'Другое' ? (
        <div>
          <Label htmlFor="region" className="text-base font-semibold">
            Регион <span className="text-red-500">*</span>
          </Label>
          <Input
            id="region"
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            placeholder="Введите регион"
            className="mt-1"
          />
        </div>
      ) : country === 'Другое' ? (
        <>
          <div>
            <Label htmlFor="custom-country" className="text-base font-semibold">
              Название страны <span className="text-red-500">*</span>
            </Label>
            <Input
              id="custom-country"
              value={country === 'Другое' ? '' : country}
              onChange={(e) => onCountryChange(e.target.value)}
              placeholder="Введите название страны"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="custom-region" className="text-base font-semibold">
              Регион <span className="text-red-500">*</span>
            </Label>
            <Input
              id="custom-region"
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
              placeholder="Введите регион"
              className="mt-1"
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default RegionSelector;
