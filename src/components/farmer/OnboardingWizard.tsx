import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Animal, Equipment, Crop } from '@/types/farm.types';

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
  initialData?: OnboardingData;
}

export interface OnboardingData {
  landOwned: string;
  landRented: string;
  animals: Animal[];
  equipment: Equipment[];
  crops: Crop[];
  employeesPermanent: number;
  employeesSeasonal: number;
}

export default function OnboardingWizard({ open, onClose, onComplete, initialData }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    landOwned: '',
    landRented: '',
    animals: [],
    equipment: [],
    crops: [],
    employeesPermanent: 0,
    employeesSeasonal: 0,
  });

  useEffect(() => {
    if (open && initialData) {
      setData(initialData);
    }
  }, [open, initialData]);

  const [tempAnimal, setTempAnimal] = useState({ type: 'cow', count: 0 });
  const [tempEquipment, setTempEquipment] = useState({ brand: '', model: '', year: '' });
  const [tempCrop, setTempCrop] = useState({ type: 'wheat', area: 0 });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleSkip = () => {
    if (step < 5) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    onComplete(data);
    onClose();
    setStep(1);
  };

  const addAnimal = () => {
    if (tempAnimal.count > 0) {
      setData({
        ...data,
        animals: [...data.animals, { ...tempAnimal, breed: '', direction: 'meat' } as Animal]
      });
      setTempAnimal({ type: 'cow', count: 0 });
    }
  };

  const addEquipment = () => {
    if (tempEquipment.brand && tempEquipment.model) {
      setData({
        ...data,
        equipment: [...data.equipment, { 
          id: Date.now().toString(), 
          ...tempEquipment, 
          attachments: '' 
        }]
      });
      setTempEquipment({ brand: '', model: '', year: '' });
    }
  };

  const addCrop = () => {
    if (tempCrop.area > 0) {
      setData({
        ...data,
        crops: [...data.crops, { 
          ...tempCrop, 
          yield: 0, 
          purpose: 'food', 
          variety: '', 
          pricePerKg: 0 
        } as Crop]
      });
      setTempCrop({ type: 'wheat', area: 0 });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Sparkles" className="text-green-600" />
            Быстрое заполнение диагностики
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">Шаг {step} из 5</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Home" className="text-green-600" />
              Земля в хозяйстве
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>В собственности (га)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={data.landOwned}
                  onChange={(e) => setData({ ...data, landOwned: e.target.value })}
                />
              </div>
              <div>
                <Label>В аренде (га)</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={data.landRented}
                  onChange={(e) => setData({ ...data, landRented: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Beef" className="text-green-600" />
              Животные
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Тип животного</Label>
                <Select value={tempAnimal.type} onValueChange={(v) => setTempAnimal({ ...tempAnimal, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cow">Коровы</SelectItem>
                    <SelectItem value="pig">Свиньи</SelectItem>
                    <SelectItem value="chicken">Куры</SelectItem>
                    <SelectItem value="sheep">Овцы</SelectItem>
                    <SelectItem value="goat">Козы</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Количество голов</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={tempAnimal.count || ''}
                  onChange={(e) => setTempAnimal({ ...tempAnimal, count: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <Button onClick={addAnimal} variant="outline" className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить животное
            </Button>
            {data.animals.length > 0 && (
              <div className="bg-gray-50 p-3 rounded space-y-2">
                <p className="text-sm font-medium">Добавлено:</p>
                {data.animals.map((a, i) => (
                  <div key={i} className="text-sm flex items-center justify-between">
                    <span>{a.type}: {a.count} голов</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setData({ ...data, animals: data.animals.filter((_, idx) => idx !== i) })}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Wheat" className="text-green-600" />
              Что высаживаете
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Культура</Label>
                <Select value={tempCrop.type} onValueChange={(v) => setTempCrop({ ...tempCrop, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheat">Пшеница</SelectItem>
                    <SelectItem value="corn">Кукуруза</SelectItem>
                    <SelectItem value="barley">Ячмень</SelectItem>
                    <SelectItem value="soybean">Соя</SelectItem>
                    <SelectItem value="sunflower">Подсолнечник</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Площадь (га)</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={tempCrop.area || ''}
                  onChange={(e) => setTempCrop({ ...tempCrop, area: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <Button onClick={addCrop} variant="outline" className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить культуру
            </Button>
            {data.crops.length > 0 && (
              <div className="bg-gray-50 p-3 rounded space-y-2">
                <p className="text-sm font-medium">Добавлено:</p>
                {data.crops.map((c, i) => (
                  <div key={i} className="text-sm flex items-center justify-between">
                    <span>{c.type}: {c.area} га</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setData({ ...data, crops: data.crops.filter((_, idx) => idx !== i) })}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Truck" className="text-green-600" />
              Мой гараж
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Марка</Label>
                <Input
                  placeholder="John Deere"
                  value={tempEquipment.brand}
                  onChange={(e) => setTempEquipment({ ...tempEquipment, brand: e.target.value })}
                />
              </div>
              <div>
                <Label>Модель</Label>
                <Input
                  placeholder="6M"
                  value={tempEquipment.model}
                  onChange={(e) => setTempEquipment({ ...tempEquipment, model: e.target.value })}
                />
              </div>
              <div>
                <Label>Год</Label>
                <Input
                  placeholder="2020"
                  value={tempEquipment.year}
                  onChange={(e) => setTempEquipment({ ...tempEquipment, year: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={addEquipment} variant="outline" className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить технику
            </Button>
            {data.equipment.length > 0 && (
              <div className="bg-gray-50 p-3 rounded space-y-2">
                <p className="text-sm font-medium">Добавлено:</p>
                {data.equipment.map((e, i) => (
                  <div key={i} className="text-sm flex items-center justify-between">
                    <span>{e.brand} {e.model} ({e.year})</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setData({ ...data, equipment: data.equipment.filter((_, idx) => idx !== i) })}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Users" className="text-green-600" />
              Сотрудники
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Постоянные сотрудники</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={data.employeesPermanent || ''}
                  onChange={(e) => setData({ ...data, employeesPermanent: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Сезонные сотрудники</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={data.employeesSeasonal || ''}
                  onChange={(e) => setData({ ...data, employeesSeasonal: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            Пропустить
          </Button>
          {step < 5 ? (
            <Button onClick={handleNext} className="flex-1">
              Далее
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="flex-1">
              <Icon name="Check" size={16} className="mr-2" />
              Сохранить всё
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}