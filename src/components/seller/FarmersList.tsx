import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Props {
  tier: string;
  farmers: any[];
  regionFilter: string;
  occupationFilter: string;
  onRegionChange: (value: string) => void;
  onOccupationChange: (value: string) => void;
  onLoadFarmers: () => void;
}

const REGIONS = ['Республика Бурятия', 'Московская область', 'Ленинградская область', 'Краснодарский край'];

const OCCUPATION_TYPES = [
  { value: 'animal', label: 'Животноводство' },
  { value: 'crop', label: 'Растениеводство' },
  { value: 'beehive', label: 'Пчеловодство' }
];

export default function FarmersList({ tier, farmers, regionFilter, occupationFilter, onRegionChange, onOccupationChange, onLoadFarmers }: Props) {
  const [sortBy, setSortBy] = useState<'name' | 'region' | 'area'>('name');

  const sortedFarmers = [...farmers].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'region') {
      return (a.region || '').localeCompare(b.region || '');
    }
    if (sortBy === 'area') {
      const aArea = a.assets?.reduce((sum: number, asset: any) => sum + (asset.area || 0), 0) || 0;
      const bArea = b.assets?.reduce((sum: number, asset: any) => sum + (asset.area || 0), 0) || 0;
      return bArea - aArea;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Users" className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-bold">База фермеров</h2>
            <p className="text-sm text-gray-600">Найдите потенциальных клиентов для ваших товаров</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <Icon name="Info" className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Доступ к базе фермеров бесплатный</p>
              <p className="text-blue-800">Вы можете фильтровать по региону и типу хозяйства, видеть культуры и животных.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Регион</Label>
            <Select value={regionFilter} onValueChange={onRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Все регионы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все регионы</SelectItem>
                {REGIONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Тип хозяйства</Label>
            <Select value={occupationFilter} onValueChange={onOccupationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все типы</SelectItem>
                {OCCUPATION_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Сортировка</Label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">По имени</SelectItem>
                <SelectItem value="region">По региону</SelectItem>
                <SelectItem value="area">По площади</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button onClick={onLoadFarmers} className="w-full">
              <Icon name="Search" size={16} className="mr-2" />
              Найти
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Найдено фермеров: {sortedFarmers.length}</h3>
          <div className="text-sm text-gray-600">
            Сортировка: {sortBy === 'name' ? 'По имени' : sortBy === 'region' ? 'По региону' : 'По площади'}
          </div>
        </div>
        {sortedFarmers.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-sm">Нет фермеров по заданным критериям</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedFarmers.map((farmer) => {
              const totalArea = farmer.assets?.reduce((sum: number, asset: any) => sum + (asset.area || 0), 0) || 0;
              const crops = farmer.assets?.filter((a: any) => a.type === 'crop').map((a: any) => a.crop_type || a.name) || [];
              const animals = farmer.assets?.filter((a: any) => a.type === 'animal').map((a: any) => a.livestock_type || a.name) || [];
              
              return (
                <Card key={farmer.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="User" className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{farmer.name}</h4>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {farmer.region && (
                          <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-green-200">
                            <Icon name="MapPin" size={12} />
                            {farmer.region}
                          </span>
                        )}
                        {farmer.occupation && (
                          <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-green-200">
                            <Icon name="Briefcase" size={12} />
                            {OCCUPATION_TYPES.find(t => t.value === farmer.occupation)?.label}
                          </span>
                        )}
                        {totalArea > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-green-200">
                            <Icon name="Maximize2" size={12} />
                            {totalArea} га
                          </span>
                        )}
                      </div>
                      
                      {crops.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-xs font-semibold text-green-900 mb-1 flex items-center gap-1">
                            <Icon name="Wheat" size={12} />
                            Выращивает:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {crops.map((crop: string, idx: number) => (
                              <span key={idx} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {animals.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-xs font-semibold text-green-900 mb-1 flex items-center gap-1">
                            <Icon name="Bird" size={12} />
                            Разводит:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {animals.map((animal: string, idx: number) => (
                              <span key={idx} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                {animal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {tier === 'premium' && (
                        <div className="mt-3 pt-3 border-t border-green-200 space-y-1">
                          {farmer.email && (
                            <p className="text-sm flex items-center gap-2">
                              <Icon name="Mail" size={14} className="text-green-600" />
                              <a href={`mailto:${farmer.email}`} className="hover:underline">{farmer.email}</a>
                            </p>
                          )}
                          {farmer.phone && (
                            <p className="text-sm flex items-center gap-2">
                              <Icon name="Phone" size={14} className="text-green-600" />
                              <a href={`tel:${farmer.phone}`} className="hover:underline">{farmer.phone}</a>
                            </p>
                          )}
                        </div>
                      )}
                      
                      {tier === 'basic' && (
                        <div className="mt-3 p-2 bg-amber-100 border border-amber-300 rounded text-xs text-amber-800 flex items-center gap-2">
                          <Icon name="Lock" size={12} className="flex-shrink-0" />
                          <span>Контакты доступны в Premium подписке</span>
                        </div>
                      )}

                      {tier === 'none' && (
                        <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded text-xs text-blue-800 flex items-center gap-2">
                          <Icon name="Info" size={12} className="flex-shrink-0" />
                          <span>Оформите подписку Basic или Premium для доступа к контактам</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
