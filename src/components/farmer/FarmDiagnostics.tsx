import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FARMER_API, Animal, Equipment, Crop } from '@/types/farm.types';
import ProgressCard from './ProgressCard';
import AnimalFormItem from './AnimalFormItem';
import HivesInput from './HivesInput';
import CropFormItem from './CropFormItem';
import EquipmentFormItem from './EquipmentFormItem';
import ProFeatureCard from './ProFeatureCard';

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
      
      if (data.diagnosis && data.diagnosis.assets && data.diagnosis.assets.length > 0) {
        const info = data.diagnosis.assets[0];
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
      const assets = {
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
          assets: [assets]
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
      <ProgressCard progress={progress} />

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
              {animals.filter(a => a.type !== 'hives').map((animal, index) => {
                const actualIndex = animals.findIndex(a => a === animal);
                return (
                  <AnimalFormItem
                    key={actualIndex}
                    animal={animal}
                    index={actualIndex}
                    onUpdate={updateAnimal}
                    onRemove={removeAnimal}
                  />
                );
              })}
            </div>

            <HivesInput animals={animals} onUpdate={updateAnimal} onAnimalsChange={setAnimals} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="crops" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Icon name="Wheat" size={20} className="text-green-600" />
              <span className="font-semibold">Что высаживаете</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Культуры</Label>
              <Button onClick={addCrop} variant="outline" size="sm">
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить
              </Button>
            </div>
            {crops.map((crop, index) => (
              <CropFormItem
                key={index}
                crop={crop}
                index={index}
                onUpdate={updateCrop}
                onRemove={removeCrop}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="equipment" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Icon name="Truck" size={20} className="text-green-600" />
              <span className="font-semibold">Мой гараж</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Техника</Label>
              <Button onClick={addEquipment} variant="outline" size="sm">
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить
              </Button>
            </div>
            {equipment.map((item, index) => (
              <EquipmentFormItem
                key={item.id}
                equipment={item}
                index={index}
                onUpdate={updateEquipment}
                onRemove={removeEquipment}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          className="flex-1"
          disabled={loading}
        >
          {loading ? (
            <>
              <Icon name="Loader2" className="animate-spin mr-2" size={16} />
              Сохраняем...
            </>
          ) : (
            'Сохранить'
          )}
        </Button>
        <Button 
          onClick={handleAiAnalysis}
          variant="outline"
          className="flex-1"
        >
          <Icon name="Lock" size={16} className="mr-2" />
          ИИ-анализ (PRO)
        </Button>
      </div>

      <ProFeatureCard />
    </div>
  );
}