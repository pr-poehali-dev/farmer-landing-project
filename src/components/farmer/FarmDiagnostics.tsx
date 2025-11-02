import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

const ANIMAL_TYPES = [
  { value: 'horses', label: 'Лошади' },
  { value: 'cows', label: 'Коровы' },
  { value: 'deer', label: 'Олени' },
  { value: 'sheep', label: 'Овцы' },
  { value: 'pigs', label: 'Свиньи' },
  { value: 'chickens', label: 'Куры' },
  { value: 'hives', label: 'Ульи' },
];

const CROP_TYPES = [
  { value: 'beet', label: 'Свёкла' },
  { value: 'cabbage', label: 'Капуста' },
  { value: 'rapeseed', label: 'Рапс' },
  { value: 'soy', label: 'Соя' },
  { value: 'corn', label: 'Кукуруза' },
  { value: 'garlic', label: 'Чеснок' },
  { value: 'other', label: 'Другое' },
];

interface Crop {
  type: string;
  area: number;
  yield: number;
  customName?: string;
}

interface Animal {
  type: string;
  count: number;
  breed?: string;
}

interface Equipment {
  id: string;
  brand: string;
  model: string;
  year: string;
  attachments: string;
}

export default function FarmDiagnostics() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const [landArea, setLandArea] = useState('');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);

  useEffect(() => {
    if (!authLoading && user) {
      loadDiagnostics();
    } else if (!authLoading && !user) {
      setLoadingData(false);
    }
  }, [authLoading, user]);

  const loadDiagnostics = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${FARMER_API}?action=get_diagnosis`, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const data = await response.json();
      
      if (data.diagnosis && data.diagnosis.farm_info) {
        const info = data.diagnosis.farm_info;
        setLandArea(info.land_area || '');
        setAnimals(info.animals || []);
        setEquipment(info.equipment || []);
        setCrops(info.crops || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки диагностики:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const addAnimal = () => {
    setAnimals([...animals, { type: 'cows', count: 0, breed: '' }]);
  };

  const removeAnimal = (index: number) => {
    setAnimals(animals.filter((_, i) => i !== index));
  };

  const updateAnimal = (index: number, field: keyof Animal, value: any) => {
    const updated = [...animals];
    updated[index] = { ...updated[index], [field]: value };
    setAnimals(updated);
  };

  const addEquipment = () => {
    setEquipment([...equipment, { id: Date.now().toString(), brand: '', model: '', year: '', attachments: '' }]);
  };

  const removeEquipment = (index: number) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const updateEquipment = (index: number, field: keyof Equipment, value: any) => {
    const updated = [...equipment];
    updated[index] = { ...updated[index], [field]: value };
    setEquipment(updated);
  };

  const addCrop = () => {
    setCrops([...crops, { type: 'corn', area: 0, yield: 0 }]);
  };

  const removeCrop = (index: number) => {
    setCrops(crops.filter((_, i) => i !== index));
  };

  const updateCrop = (index: number, field: keyof Crop, value: any) => {
    const updated = [...crops];
    updated[index] = { ...updated[index], [field]: value };
    setCrops(updated);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const farmInfo = {
        land_area: landArea,
        animals,
        equipment,
        crops,
      };

      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          action: 'save_diagnosis',
          farm_info: farmInfo
        })
      });

      if (response.ok) {
        toast.success('Диагностика сохранена! +20 баллов');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка сохранения');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handleAiAnalysis = () => {
    toast.info('ИИ-анализ доступен по платной подписке. Функция в разработке — скоро запуск!');
  };

  const animalCount = animals.reduce((sum, a) => sum + a.count, 0);
  const progress = Math.min(100, (
    (landArea ? 20 : 0) +
    (animalCount > 0 ? 20 : 0) +
    (equipment.length > 0 ? 20 : 0) +
    (crops.length > 0 ? 20 : 0) +
    20
  ));

  if (authLoading || loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Диагностика хозяйства</h2>
            <p className="text-sm text-gray-600">Расскажи о своей ферме — мы подберём решения</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{progress}%</div>
            <div className="text-xs text-gray-500">заполнено</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="land" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Icon name="Home" size={20} className="text-green-600" />
              <span className="font-semibold">Что в хозяйстве</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <Label>Площадь земли (га)</Label>
              <Input
                type="text"
                placeholder="Например: 50"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Животные</Label>
                <Button onClick={addAnimal} variant="outline" size="sm">
                  <Icon name="Plus" size={16} className="mr-1" />
                  Добавить
                </Button>
              </div>
              {animals.map((animal, index) => (
                <Card key={index} className="p-4 bg-gray-50 mb-3">
                  <div className="flex items-start justify-between mb-3">
                    <Label className="text-sm font-semibold">Животное #{index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeAnimal(index)}
                      className="h-6 w-6 p-0"
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Вид</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                        value={animal.type}
                        onChange={(e) => updateAnimal(index, 'type', e.target.value)}
                      >
                        {ANIMAL_TYPES.filter(a => a.value !== 'hives').map(a => (
                          <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Количество</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={animal.count || ''}
                        onChange={(e) => updateAnimal(index, 'count', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Порода</Label>
                      <Input
                        type="text"
                        placeholder="Порода"
                        value={animal.breed || ''}
                        onChange={(e) => updateAnimal(index, 'breed', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
              {animals.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Нажмите "Добавить" чтобы указать животных</p>
              )}
            </div>

            <div>
              <Label>Ульи (шт)</Label>
              <Input
                type="number"
                placeholder="0"
                value={animals.find(a => a.type === 'hives')?.count || ''}
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 0;
                  const hiveIndex = animals.findIndex(a => a.type === 'hives');
                  if (hiveIndex >= 0) {
                    updateAnimal(hiveIndex, 'count', count);
                  } else if (count > 0) {
                    setAnimals([...animals, { type: 'hives', count, breed: '' }]);
                  }
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="crops" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Icon name="Sprout" size={20} className="text-green-600" />
              <span className="font-semibold">Что высаживаете</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {crops.map((crop, index) => (
              <Card key={index} className="p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <Label className="text-sm font-semibold">Культура #{index + 1}</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeCrop(index)}
                    className="h-6 w-6 p-0"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Тип культуры</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      value={crop.type}
                      onChange={(e) => updateCrop(index, 'type', e.target.value)}
                    >
                      {CROP_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {crop.type === 'other' && (
                    <div>
                      <Label className="text-xs">Название культуры</Label>
                      <Input
                        type="text"
                        placeholder="Введите название"
                        value={crop.customName || ''}
                        onChange={(e) => updateCrop(index, 'customName', e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <Label className="text-xs">Объём (га)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={crop.area || ''}
                      onChange={(e) => updateCrop(index, 'area', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Урожайность за этот год (тонн)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={crop.yield || ''}
                      onChange={(e) => updateCrop(index, 'yield', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="outline" onClick={addCrop} className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить культуру
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="garage" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Icon name="Truck" size={20} className="text-green-600" />
              <span className="font-semibold">Мой гараж</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {equipment.map((item, index) => (
              <Card key={item.id} className="p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <Label className="text-sm font-semibold">Техника #{index + 1}</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeEquipment(index)}
                    className="h-6 w-6 p-0"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Марка</Label>
                    <Input
                      type="text"
                      placeholder="John Deere"
                      value={item.brand}
                      onChange={(e) => updateEquipment(index, 'brand', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Модель</Label>
                    <Input
                      type="text"
                      placeholder="8R 410"
                      value={item.model}
                      onChange={(e) => updateEquipment(index, 'model', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Год выпуска</Label>
                    <Input
                      type="text"
                      placeholder="2020"
                      value={item.year}
                      onChange={(e) => updateEquipment(index, 'year', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Вид навесного оборудования</Label>
                    <Input
                      type="text"
                      placeholder="Плуг, культиватор"
                      value={item.attachments}
                      onChange={(e) => updateEquipment(index, 'attachments', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="outline" onClick={addEquipment} className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить технику
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="flex-1"
        >
          {loading ? <Icon name="Loader2" className="animate-spin mr-2" size={18} /> : null}
          Сохранить
        </Button>
        <Button 
          variant="outline" 
          onClick={handleAiAnalysis}
          className="relative"
        >
          <Icon name="Lock" size={18} className="mr-2" />
          ИИ-анализ (PRO)
        </Button>
      </div>

      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-purple-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-900 mb-1">
              ИИ-анализ доступен по платной подписке
            </p>
            <p className="text-xs text-purple-700">
              Функция в разработке. Скоро запустим персональные рекомендации на основе данных вашей фермы с помощью искусственного интеллекта!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}