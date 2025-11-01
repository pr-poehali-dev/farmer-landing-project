import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface FarmerFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  region: string;
  assetTypes: string[];
  productTypes: string[];
}

const REGIONS = [
  'Все регионы',
  'Республика Бурятия',
  'Москва',
  'Санкт-Петербург',
  'Московская область',
  'Краснодарский край',
  'Республика Татарстан',
  'Свердловская область',
  'Новосибирская область',
  'Ростовская область',
  'Челябинская область'
];

const ASSET_TYPES = [
  { value: 'Коровы', label: 'Коровы' },
  { value: 'Козы', label: 'Козы' },
  { value: 'Овцы', label: 'Овцы' },
  { value: 'Свиньи', label: 'Свиньи' },
  { value: 'Куры', label: 'Куры' },
  { value: 'Утки', label: 'Утки' },
  { value: 'Пшеница', label: 'Пшеница' },
  { value: 'Рожь', label: 'Рожь' },
  { value: 'Ячмень', label: 'Ячмень' },
  { value: 'Овёс', label: 'Овёс' },
  { value: 'Кукуруза', label: 'Кукуруза' },
  { value: 'Подсолнечник', label: 'Подсолнечник' },
  { value: 'Картофель', label: 'Картофель' },
  { value: 'Морковь', label: 'Морковь' },
  { value: 'Капуста', label: 'Капуста' },
  { value: 'Пчёлы', label: 'Пчёлы (ульи)' }
];

const PRODUCT_TYPES = [
  { value: 'income', label: 'Доход' },
  { value: 'products', label: 'Продукция' },
  { value: 'patronage', label: 'Патронаж' }
];

export default function FarmerFilters({ onFilterChange }: FarmerFiltersProps) {
  const [region, setRegion] = useState<string>('Все регионы');
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);

  const toggleAssetType = (type: string) => {
    const newTypes = selectedAssetTypes.includes(type)
      ? selectedAssetTypes.filter(t => t !== type)
      : [...selectedAssetTypes, type];
    setSelectedAssetTypes(newTypes);
    applyFilters(region, newTypes, selectedProductTypes);
  };

  const toggleProductType = (type: string) => {
    const newTypes = selectedProductTypes.includes(type)
      ? selectedProductTypes.filter(t => t !== type)
      : [...selectedProductTypes, type];
    setSelectedProductTypes(newTypes);
    applyFilters(region, selectedAssetTypes, newTypes);
  };

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    applyFilters(newRegion, selectedAssetTypes, selectedProductTypes);
  };

  const applyFilters = (reg: string, assets: string[], products: string[]) => {
    onFilterChange({
      region: reg === 'Все регионы' ? '' : reg,
      assetTypes: assets,
      productTypes: products
    });
  };

  const resetFilters = () => {
    setRegion('Все регионы');
    setSelectedAssetTypes([]);
    setSelectedProductTypes([]);
    onFilterChange({ region: '', assetTypes: [], productTypes: [] });
  };

  const hasActiveFilters = region !== 'Все регионы' || 
                          selectedAssetTypes.length > 0 || 
                          selectedProductTypes.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="Filter" size={20} />
            Фильтры
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Сбросить
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Регион</label>
          <Select value={region} onValueChange={handleRegionChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Тип продукции</label>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_TYPES.map(type => (
              <Badge
                key={type.value}
                variant={selectedProductTypes.includes(type.value) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => toggleProductType(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Тип актива</label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {ASSET_TYPES.map(type => (
              <Badge
                key={type.value}
                variant={selectedAssetTypes.includes(type.value) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => toggleAssetType(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Активных фильтров: {
                (region !== 'Все регионы' ? 1 : 0) + 
                selectedAssetTypes.length + 
                selectedProductTypes.length
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
