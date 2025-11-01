import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Asset {
  type: string;
  name: string;
  count: number;
  details: string;
}

interface Equipment {
  type: string;
  brand: string;
  model: string;
  year: number;
}

interface Fertilizer {
  type: string;
  brand: string;
  usage: string;
}

interface FarmInfo {
  assets: Asset[];
  garage: {
    equipment: Equipment[];
    fertilizers: Fertilizer[];
  };
  social_links: {
    vk: string;
    telegram: string;
    instagram: string;
  };
  main_activity: string;
  activity_description: string;
}

const ASSET_TYPES = [
  { value: 'cow', label: '🐄 Коровы' },
  { value: 'pig', label: '🐷 Свиньи' },
  { value: 'chicken', label: '🐔 Куры' },
  { value: 'bee', label: '🐝 Пчелы' },
  { value: 'wheat', label: '🌾 Пшеница' },
  { value: 'corn', label: '🌽 Кукуруза' },
  { value: 'soy', label: '🌱 Соя' },
  { value: 'potato', label: '🥔 Картофель' },
  { value: 'sunflower', label: '🌻 Подсолнечник' },
];

const EQUIPMENT_TYPES = [
  { value: 'tractor', label: 'Трактор' },
  { value: 'combine', label: 'Комбайн' },
  { value: 'plow', label: 'Плуг' },
  { value: 'seeder', label: 'Сеялка' },
];

export default function FarmDiagnostics() {
  const [farmInfo, setFarmInfo] = useState<FarmInfo>({
    assets: [],
    garage: { equipment: [], fertilizers: [] },
    social_links: { vk: '', telegram: '', instagram: '' },
    main_activity: 'mixed',
    activity_description: '',
  });

  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(false);

  const addAsset = () => {
    setFarmInfo({
      ...farmInfo,
      assets: [...farmInfo.assets, { type: 'wheat', name: '', count: 0, details: '' }]
    });
  };

  const removeAsset = (index: number) => {
    setFarmInfo({
      ...farmInfo,
      assets: farmInfo.assets.filter((_, i) => i !== index)
    });
  };

  const updateAsset = (index: number, field: keyof Asset, value: any) => {
    const updated = [...farmInfo.assets];
    updated[index] = { ...updated[index], [field]: value };
    setFarmInfo({ ...farmInfo, assets: updated });
  };

  const addEquipment = () => {
    setFarmInfo({
      ...farmInfo,
      garage: {
        ...farmInfo.garage,
        equipment: [...farmInfo.garage.equipment, { type: 'tractor', brand: '', model: '', year: new Date().getFullYear() }]
      }
    });
  };

  const removeEquipment = (index: number) => {
    setFarmInfo({
      ...farmInfo,
      garage: {
        ...farmInfo.garage,
        equipment: farmInfo.garage.equipment.filter((_, i) => i !== index)
      }
    });
  };

  const updateEquipment = (index: number, field: keyof Equipment, value: any) => {
    const updated = [...farmInfo.garage.equipment];
    updated[index] = { ...updated[index], [field]: value };
    setFarmInfo({ ...farmInfo, garage: { ...farmInfo.garage, equipment: updated } });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Отправка на backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Диагностика сохранена! +20 баллов');
    } catch (error) {
      toast.error('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const handleAiAnalysis = () => {
    setAiAnalysis(true);
    toast.info('ИИ рекомендует: Для вашей кукурузы — удобрения "Азофоска" от Продавца Z');
  };

  const progress = Math.min(100, (
    (farmInfo.assets.length > 0 ? 25 : 0) +
    (farmInfo.activity_description ? 25 : 0) +
    (farmInfo.garage.equipment.length > 0 ? 25 : 0) +
    (farmInfo.social_links.vk || farmInfo.social_links.telegram ? 25 : 0)
  ));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Диагностика хозяйства — опиши свое царство</h2>
          <p className="text-gray-600 mt-1">Заполни лаконично — ИИ проанализирует и предложит товары</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Заполнено</div>
          <div className="text-2xl font-bold text-green-600">{progress}%</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Icon name="Info" className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-800">
          Обязательно для создания предложений инвесторам. Данные помогут ИИ рекомендовать товары продавцов.
        </div>
      </div>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="assets" className="bg-white rounded-lg border">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Icon name="Sprout" className="text-green-600" size={24} />
              <span className="font-semibold">Что в хозяйстве</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              {farmInfo.assets.map((asset, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Тип</Label>
                      <select 
                        className="w-full p-2 border rounded"
                        value={asset.type}
                        onChange={(e) => updateAsset(index, 'type', e.target.value)}
                      >
                        {ASSET_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Название</Label>
                      <Input 
                        value={asset.name}
                        onChange={(e) => updateAsset(index, 'name', e.target.value)}
                        placeholder="Например: Ярославская"
                      />
                    </div>
                    <div>
                      <Label>Количество</Label>
                      <Input 
                        type="number"
                        value={asset.count}
                        onChange={(e) => updateAsset(index, 'count', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeAsset(index)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label>Детали</Label>
                    <Input 
                      value={asset.details}
                      onChange={(e) => updateAsset(index, 'details', e.target.value)}
                      placeholder="Дополнительная информация"
                    />
                  </div>
                </Card>
              ))}
              <Button onClick={addAsset} variant="outline" className="w-full">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить актив
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="activity" className="bg-white rounded-lg border">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Icon name="Briefcase" className="text-blue-600" size={24} />
              <span className="font-semibold">Чем занимается</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 space-y-4">
            <div>
              <Label>Основное направление</Label>
              <select 
                className="w-full p-2 border rounded"
                value={farmInfo.main_activity}
                onChange={(e) => setFarmInfo({ ...farmInfo, main_activity: e.target.value })}
              >
                <option value="plant_growing">🌾 Растениеводство</option>
                <option value="animal_farming">🐄 Животноводство</option>
                <option value="mixed">🌾🐄 Смешанное</option>
              </select>
            </div>
            <div>
              <Label>Описание деятельности</Label>
              <Textarea 
                value={farmInfo.activity_description}
                onChange={(e) => setFarmInfo({ ...farmInfo, activity_description: e.target.value })}
                placeholder="Выращивание кукурузы и сои в Бурятии"
                rows={3}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="garage" className="bg-white rounded-lg border">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Icon name="Truck" className="text-orange-600" size={24} />
              <span className="font-semibold">Гараж и оборудование</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              {farmInfo.garage.equipment.map((eq, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Тип</Label>
                      <select 
                        className="w-full p-2 border rounded"
                        value={eq.type}
                        onChange={(e) => updateEquipment(index, 'type', e.target.value)}
                      >
                        {EQUIPMENT_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Бренд</Label>
                      <Input 
                        value={eq.brand}
                        onChange={(e) => updateEquipment(index, 'brand', e.target.value)}
                        placeholder="John Deere"
                      />
                    </div>
                    <div>
                      <Label>Модель</Label>
                      <Input 
                        value={eq.model}
                        onChange={(e) => updateEquipment(index, 'model', e.target.value)}
                        placeholder="8R 370"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeEquipment(index)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Button onClick={addEquipment} variant="outline" className="w-full">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить технику
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social" className="bg-white rounded-lg border">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Icon name="Share2" className="text-purple-600" size={24} />
              <span className="font-semibold">Соцсети фермы</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 space-y-4">
            <div>
              <Label>VKontakte</Label>
              <Input 
                value={farmInfo.social_links.vk}
                onChange={(e) => setFarmInfo({ 
                  ...farmInfo, 
                  social_links: { ...farmInfo.social_links, vk: e.target.value }
                })}
                placeholder="https://vk.com/my_farm"
              />
            </div>
            <div>
              <Label>Telegram</Label>
              <Input 
                value={farmInfo.social_links.telegram}
                onChange={(e) => setFarmInfo({ 
                  ...farmInfo, 
                  social_links: { ...farmInfo.social_links, telegram: e.target.value }
                })}
                placeholder="@my_farm"
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input 
                value={farmInfo.social_links.instagram}
                onChange={(e) => setFarmInfo({ 
                  ...farmInfo, 
                  social_links: { ...farmInfo.social_links, instagram: e.target.value }
                })}
                placeholder="@my_farm"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-4">
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <>
              <Icon name="Loader2" className="animate-spin mr-2" size={18} />
              Сохранение...
            </>
          ) : (
            <>
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить диагностику
            </>
          )}
        </Button>
        <Button 
          onClick={handleAiAnalysis}
          variant="outline"
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Icon name="Sparkles" size={18} className="mr-2" />
          Анализировать (ИИ)
        </Button>
      </div>

      {aiAnalysis && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <Icon name="Bot" className="text-purple-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <div className="font-semibold text-purple-900 mb-1">ИИ-Рекомендации</div>
              <p className="text-purple-800 text-sm">
                На основе вашей кукурузы рекомендую: Удобрения "Азофоска NPK 16:16:16" от Продавца "АгроХим". 
                Также обратите внимание на семена гибрида "Пионер 3912" для повышения урожайности.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
