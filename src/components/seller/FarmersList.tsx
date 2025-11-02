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
  if (tier === 'none') {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Icon name="Lock" className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-bold mb-2">Поиск фермеров</h3>
          <p className="text-gray-600 mb-4">Находите потенциальных клиентов</p>
          <p className="text-sm text-red-600">Доступно с подпиской Basic или Premium</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Users" className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-bold">Поиск фермеров</h2>
            <p className="text-sm text-gray-600">Найдите потенциальных клиентов для ваших товаров</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
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
            <Label>Занятие</Label>
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
          
          <div className="flex items-end">
            <Button onClick={onLoadFarmers} className="w-full">
              <Icon name="Search" size={16} className="mr-2" />
              Найти
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Найдено фермеров: {farmers.length}</h3>
        {farmers.length === 0 ? (
          <p className="text-gray-500 text-sm">Нет фермеров по заданным критериям</p>
        ) : (
          <div className="space-y-3">
            {farmers.map((farmer) => (
              <Card key={farmer.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="User" className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{farmer.name}</h4>
                    
                    {tier === 'premium' && (
                      <div className="mt-2 space-y-1">
                        {farmer.email && (
                          <p className="text-sm flex items-center gap-2">
                            <Icon name="Mail" size={14} className="text-green-600" />
                            {farmer.email}
                          </p>
                        )}
                        {farmer.phone && (
                          <p className="text-sm flex items-center gap-2">
                            <Icon name="Phone" size={14} className="text-green-600" />
                            {farmer.phone}
                          </p>
                        )}
                      </div>
                    )}
                    
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
                    </div>
                    
                    {tier === 'premium' && farmer.assets && farmer.assets.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs font-semibold text-green-900 mb-1">Активы:</p>
                        <div className="flex flex-wrap gap-2">
                          {farmer.assets.map((asset: any, idx: number) => (
                            <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {asset.name} ({asset.count})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {tier === 'basic' && (
                      <div className="mt-3 p-2 bg-amber-100 border border-amber-300 rounded text-xs text-amber-800">
                        <Icon name="Lock" size={12} className="inline mr-1" />
                        Контакты и активы доступны в Premium подписке
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
