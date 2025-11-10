import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { LIVESTOCK_TYPES, LIVESTOCK_DIRECTIONS, LIVESTOCK_BREEDS } from '@/data/livestock';
import { CROP_TYPES, CROP_VARIETIES, CROP_PURPOSES } from '@/data/crops';

interface FarmerProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  farm_name?: string;
  bio?: string;
  region?: string;
  land_area?: string;
  land_owned?: string;
  land_rented?: string;
  animals?: any[];
  crops?: any[];
  equipment?: any[];
  employees_permanent?: number;
  employees_seasonal?: number;
}

export default function FarmerProfile() {
  const { farmerId } = useParams();
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFarmerProfile();
  }, [farmerId]);

  const loadFarmerProfile = async () => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/46530a28-4adb-4608-bce7-1ddd2f4b3d11?farmer_id=${farmerId}`
      );
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки профиля');
      }
      
      const data = await response.json();
      setFarmer(data.farmer);
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      toast.error('Не удалось загрузить профиль фермера');
    } finally {
      setLoading(false);
    }
  };

  const getLivestockLabel = (value: string, type: 'type' | 'breed' | 'direction') => {
    if (type === 'type') {
      return LIVESTOCK_TYPES.find(t => t.value === value)?.label || value;
    }
    if (type === 'direction') {
      return LIVESTOCK_DIRECTIONS.find(d => d.value === value)?.label || value;
    }
    const allBreeds = Object.values(LIVESTOCK_BREEDS).flat();
    return allBreeds.find(b => b.value === value)?.label || value;
  };

  const getCropLabel = (value: string, type: 'type' | 'variety' | 'purpose') => {
    if (type === 'type') {
      return CROP_TYPES.find(t => t.value === value)?.label || value;
    }
    if (type === 'purpose') {
      return CROP_PURPOSES.find(p => p.value === value)?.label || value;
    }
    const allVarieties = Object.values(CROP_VARIETIES).flat();
    return allVarieties.find(v => v.value === value)?.label || value;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Icon name="Loader2" className="animate-spin text-gray-400" size={48} />
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <Icon name="AlertCircle" size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">Фермер не найден</h2>
          <Link to="/dashboard/seller">
            <Button>Вернуться к списку</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard/seller">
          <Button variant="ghost" size="sm">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад к списку фермеров
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Заголовок профиля */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={48} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{farmer.name}</h1>
              {farmer.farm_name && (
                <p className="text-xl text-green-600 font-semibold mb-2">{farmer.farm_name}</p>
              )}
              {farmer.region && (
                <p className="text-gray-600 flex items-center gap-2 mb-3">
                  <Icon name="MapPin" size={16} />
                  {farmer.region}
                </p>
              )}
              {farmer.bio && (
                <p className="text-gray-700 mt-3">{farmer.bio}</p>
              )}
            </div>
          </div>

          {/* Контакты */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="Phone" size={18} />
              Контакты
            </h3>
            <div className="space-y-2">
              {farmer.email && (
                <p className="flex items-center gap-2">
                  <Icon name="Mail" size={16} className="text-green-600" />
                  <a href={`mailto:${farmer.email}`} className="text-blue-600 hover:underline">
                    {farmer.email}
                  </a>
                </p>
              )}
              {farmer.phone && (
                <p className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-green-600" />
                  <a href={`tel:${farmer.phone}`} className="text-blue-600 hover:underline">
                    {farmer.phone}
                  </a>
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Диагностика хозяйства */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Home" size={24} className="text-green-600" />
            Диагностика хозяйства
          </h2>

          {/* Земля */}
          {(farmer.land_area || farmer.land_owned || farmer.land_rented) && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Земельные ресурсы</h3>
              <div className="grid grid-cols-3 gap-4">
                {farmer.land_area && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Общая площадь</p>
                    <p className="text-2xl font-bold text-green-600">{farmer.land_area} га</p>
                  </div>
                )}
                {farmer.land_owned && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">В собственности</p>
                    <p className="text-2xl font-bold text-blue-600">{farmer.land_owned} га</p>
                  </div>
                )}
                {farmer.land_rented && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">В аренде</p>
                    <p className="text-2xl font-bold text-amber-600">{farmer.land_rented} га</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Животные */}
          {farmer.animals && farmer.animals.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="Bird" size={20} />
                Животноводство
              </h3>
              <div className="grid gap-3">
                {farmer.animals.map((animal: any, index: number) => (
                  <Card key={index} className="p-4 bg-amber-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {getLivestockLabel(animal.type, 'type')}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {animal.breed && (
                            <Badge className="bg-blue-100 text-blue-800">
                              {getLivestockLabel(animal.breed, 'breed')}
                            </Badge>
                          )}
                          {animal.direction && (
                            <Badge className="bg-green-100 text-green-800">
                              {getLivestockLabel(animal.direction, 'direction')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-amber-600">{animal.count}</p>
                        <p className="text-sm text-gray-600">голов</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Культуры */}
          {farmer.crops && farmer.crops.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="Wheat" size={20} />
                Растениеводство
              </h3>
              <div className="grid gap-3">
                {farmer.crops.map((crop: any, index: number) => (
                  <Card key={index} className="p-4 bg-emerald-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {getCropLabel(crop.type, 'type')}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {crop.variety && (
                            <Badge className="bg-lime-100 text-lime-800">
                              {getCropLabel(crop.variety, 'variety')}
                            </Badge>
                          )}
                          {crop.purpose && (
                            <Badge className="bg-teal-100 text-teal-800">
                              {getCropLabel(crop.purpose, 'purpose')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-600">{crop.area}</p>
                        <p className="text-sm text-gray-600">га</p>
                        {crop.yield && (
                          <p className="text-sm text-gray-500 mt-1">{crop.yield} т/га</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Техника */}
          {farmer.equipment && farmer.equipment.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="Truck" size={20} />
                Техника и оборудование
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {farmer.equipment.map((item: any, index: number) => (
                  <Card key={index} className="p-4 bg-gray-50">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    {item.year && (
                      <p className="text-sm text-gray-600 mt-1">Год: {item.year}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Сотрудники */}
          {(farmer.employees_permanent || farmer.employees_seasonal) && (
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="Users" size={20} />
                Сотрудники
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {farmer.employees_permanent > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Постоянные</p>
                    <p className="text-2xl font-bold text-blue-600">{farmer.employees_permanent}</p>
                  </div>
                )}
                {farmer.employees_seasonal > 0 && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Сезонные</p>
                    <p className="text-2xl font-bold text-amber-600">{farmer.employees_seasonal}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}