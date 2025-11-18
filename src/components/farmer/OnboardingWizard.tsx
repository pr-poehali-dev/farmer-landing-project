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

  const [tempAnimal, setTempAnimal] = useState({ 
    type: 'cow', 
    count: 0, 
    breed: '', 
    direction: 'meat' as 'meat' | 'milk' | 'mixed' | 'other',
    meatYield: 0,
    meatPrice: 0
  });
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
        animals: [...data.animals, { ...tempAnimal } as Animal]
      });
      setTempAnimal({ 
        type: 'cow', 
        count: 0, 
        breed: '', 
        direction: 'meat' as 'meat' | 'milk' | 'mixed' | 'other',
        meatYield: 0,
        meatPrice: 0
      });
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
              <div>
                <Label>Порода</Label>
                <Select value={tempAnimal.breed} onValueChange={(v) => setTempAnimal({ ...tempAnimal, breed: v })}>
                  <SelectTrigger><SelectValue placeholder="Выберите породу" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Голштинская">Голштинская</SelectItem>
                    <SelectItem value="Калмыцкая">Калмыцкая</SelectItem>
                    <SelectItem value="Казахская белоголовая">Казахская белоголовая</SelectItem>
                    <SelectItem value="Симментальская">Симментальская</SelectItem>
                    <SelectItem value="Герефордская">Герефордская</SelectItem>
                    <SelectItem value="Красная степная">Красная степная</SelectItem>
                    <SelectItem value="Другая">Другая</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Направление</Label>
                <Select value={tempAnimal.direction} onValueChange={(v: any) => setTempAnimal({ ...tempAnimal, direction: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meat">Мясное</SelectItem>
                    <SelectItem value="milk">Молочное</SelectItem>
                    <SelectItem value="mixed">Смешанное</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Выход мяса (кг)</Label>
                <Input
                  type="number"
                  placeholder="250"
                  value={tempAnimal.meatYield || ''}
                  onChange={(e) => setTempAnimal({ ...tempAnimal, meatYield: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Стоимость мяса (₽/кг)</Label>
                <Input
                  type="number"
                  placeholder="450"
                  value={tempAnimal.meatPrice || ''}
                  onChange={(e) => setTempAnimal({ ...tempAnimal, meatPrice: parseFloat(e.target.value) || 0 })}
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
                    <div className="flex-1">
                      <div className="font-medium">{a.type}: {a.count} голов</div>
                      {a.breed && <div className="text-xs text-gray-600">Порода: {a.breed}</div>}
                      {a.direction && <div className="text-xs text-gray-600">Направление: {a.direction === 'meat' ? 'Мясное' : a.direction === 'milk' ? 'Молочное' : a.direction === 'mixed' ? 'Смешанное' : 'Другое'}</div>}
                      {a.meatYield && a.meatPrice ? <div className="text-xs text-gray-600">Выход мяса: {a.meatYield} кг × {a.meatPrice} ₽/кг</div> : null}
                    </div>
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
                <Select 
                  value={tempEquipment.brand || 'none'} 
                  onValueChange={(v) => setTempEquipment({ ...tempEquipment, brand: v === 'none' ? '' : v })}
                >
                  <SelectTrigger><SelectValue placeholder="Выберите марку" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Выберите марку</SelectItem>
                    <SelectItem value="John Deere">John Deere</SelectItem>
                    <SelectItem value="Claas">Claas</SelectItem>
                    <SelectItem value="New Holland">New Holland</SelectItem>
                    <SelectItem value="Case IH">Case IH</SelectItem>
                    <SelectItem value="Fendt">Fendt</SelectItem>
                    <SelectItem value="Massey Ferguson">Massey Ferguson</SelectItem>
                    <SelectItem value="Kubota">Kubota</SelectItem>
                    <SelectItem value="Беларус (МТЗ)">Беларус (МТЗ)</SelectItem>
                    <SelectItem value="Кировец (Кировский завод)">Кировец (Кировский завод)</SelectItem>
                    <SelectItem value="Тракторные заводы (Россельмаш)">Россельмаш</SelectItem>
                    <SelectItem value="Агромашхолдинг (Агромаш)">Агромаш</SelectItem>
                    <SelectItem value="Challenger">Challenger</SelectItem>
                    <SelectItem value="JCB">JCB</SelectItem>
                    <SelectItem value="Xinong">Xinong</SelectItem>
                    <SelectItem value="Луцкий трактор (ЛУАЗ)">ЛУАЗ</SelectItem>
                    <SelectItem value="XCMG">XCMG</SelectItem>
                    <SelectItem value="Shantui">Shantui</SelectItem>
                    <SelectItem value="Lonking">Lonking</SelectItem>
                    <SelectItem value="LiuGong">LiuGong</SelectItem>
                    <SelectItem value="YTO Group">YTO Group</SelectItem>
                    <SelectItem value="LOVOL">LOVOL</SelectItem>
                    <SelectItem value="Другая">Другая</SelectItem>
                  </SelectContent>
                </Select>
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