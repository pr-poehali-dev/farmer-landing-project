import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const FUNC_URL = 'https://functions.poehali.dev/8d27026d-2391-42d4-ac54-57f1cbe0c8d4';
const RATING_URL = 'https://functions.poehali.dev/6651f712-61f5-44b8-827f-dd095dffa4f6';

interface Animal {
  id?: number;
  category: string;
  direction: string;
  breed: string;
  dairy_head_count?: number;
  avg_milk_yield_per_head?: number;
  meat_head_count?: number;
  avg_meat_yield_per_head?: number;
}

interface Crop {
  id?: number;
  crop_name: string;
  sowing_area: number;
  gross_harvest: number;
  yield_per_hectare?: number;
  agro_tech?: AgroTech[];
}

interface AgroTech {
  id?: number;
  type: string;
  name: string;
  application_rate: number;
}

interface Equipment {
  id?: number;
  brand: string;
  model: string;
  year: number;
}

export default function ExtendedProfile({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [landOwned, setLandOwned] = useState(0);
  const [landRented, setLandRented] = useState(0);
  const [employeesPermanent, setEmployeesPermanent] = useState(0);
  const [employeesSeasonal, setEmployeesSeasonal] = useState(0);
  
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  
  const [newAnimal, setNewAnimal] = useState<Animal>({
    category: 'КРС',
    direction: 'Молочное',
    breed: '',
    dairy_head_count: 0,
    avg_milk_yield_per_head: 0
  });
  
  const [newCrop, setNewCrop] = useState<Crop>({
    crop_name: 'Пшеница',
    sowing_area: 0,
    gross_harvest: 0
  });
  
  const [newEquipment, setNewEquipment] = useState<Equipment>({
    brand: '',
    model: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const response = await fetch(FUNC_URL, {
        headers: { 'X-User-Id': userId }
      });
      const data = await response.json();
      
      setLandOwned(data.land_owned || 0);
      setLandRented(data.land_rented || 0);
      setEmployeesPermanent(data.employees_permanent || 0);
      setEmployeesSeasonal(data.employees_seasonal || 0);
      setAnimals(data.animals || []);
      setCrops(data.crops || []);
      setEquipment(data.equipment || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const saveLand = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'save_land',
          land_owned: landOwned,
          land_rented: landRented
        })
      });
      
      if (response.ok) {
        toast({ title: 'Данные о земле сохранены' });
        await calculateRating();
      }
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'save_employees',
          employees_permanent: employeesPermanent,
          employees_seasonal: employeesSeasonal
        })
      });
      
      if (response.ok) {
        toast({ title: 'Данные о сотрудниках сохранены' });
        await calculateRating();
      }
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addAnimal = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'add_animal',
          ...newAnimal
        })
      });
      
      if (response.ok) {
        toast({ title: 'Животное добавлено' });
        await loadData();
        await calculateRating();
        setNewAnimal({
          category: 'КРС',
          direction: 'Молочное',
          breed: '',
          dairy_head_count: 0,
          avg_milk_yield_per_head: 0
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка добавления', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addCrop = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'add_crop',
          ...newCrop
        })
      });
      
      if (response.ok) {
        toast({ title: 'Культура добавлена' });
        await loadData();
        await calculateRating();
        setNewCrop({
          crop_name: 'Пшеница',
          sowing_area: 0,
          gross_harvest: 0
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка добавления', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addEquipment = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'add_equipment',
          ...newEquipment
        })
      });
      
      if (response.ok) {
        toast({ title: 'Техника добавлена' });
        await loadData();
        await calculateRating();
        setNewEquipment({
          brand: '',
          model: '',
          year: new Date().getFullYear()
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка добавления', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const calculateRating = async () => {
    try {
      await fetch(RATING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'calculate',
          farmer_id: userId
        })
      });
    } catch (error) {
      console.error('Ошибка пересчета рейтинга:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Collapsible>
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="MapPin" className="text-green-600" />
                <h3 className="text-lg font-semibold">Что в хозяйстве</h3>
              </div>
              <Icon name="ChevronDown" size={20} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Площадь в собственности (га)</Label>
                <Input
                  type="number"
                  value={landOwned}
                  onChange={(e) => setLandOwned(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Площадь в аренде (га)</Label>
                <Input
                  type="number"
                  value={landRented}
                  onChange={(e) => setLandRented(Number(e.target.value))}
                />
              </div>
            </div>
            <Button onClick={saveLand} disabled={loading} className="mt-4">
              Сохранить
            </Button>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible>
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="Users" className="text-blue-600" />
                <h3 className="text-lg font-semibold">Сотрудники</h3>
              </div>
              <Icon name="ChevronDown" size={20} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Количество постоянных</Label>
                <Input
                  type="number"
                  value={employeesPermanent}
                  onChange={(e) => setEmployeesPermanent(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Количество сезонных</Label>
                <Input
                  type="number"
                  value={employeesSeasonal}
                  onChange={(e) => setEmployeesSeasonal(Number(e.target.value))}
                />
              </div>
            </div>
            <Button onClick={saveEmployees} disabled={loading} className="mt-4">
              Сохранить
            </Button>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible defaultOpen>
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="Sprout" className="text-amber-600" />
                <h3 className="text-lg font-semibold">Животные</h3>
              </div>
              <Icon name="ChevronDown" size={20} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            {animals.map((animal, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <p><strong>{animal.category}</strong> - {animal.direction}</p>
                <p className="text-sm text-gray-600">
                  {animal.direction === 'Молочное' && `Надой: ${animal.avg_milk_yield_per_head} л/год, Голов: ${animal.dairy_head_count}`}
                  {animal.direction === 'Мясное' && `Выход мяса: ${animal.avg_meat_yield_per_head} кг, Голов: ${animal.meat_head_count}`}
                  {animal.direction === 'Мёд' && `Мёд: ${animal.avg_milk_yield_per_head} кг/улей, Ульев: ${animal.dairy_head_count}`}
                </p>
              </div>
            ))}
            
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold">Добавить животное</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Категория</Label>
                  <Select value={newAnimal.category} onValueChange={(v) => setNewAnimal({...newAnimal, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="КРС">КРС</SelectItem>
                      <SelectItem value="МРС">МРС</SelectItem>
                      <SelectItem value="Птица">Птица</SelectItem>
                      <SelectItem value="Пчеловодство">Пчеловодство</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newAnimal.category !== 'Пчеловодство' && (
                  <div>
                    <Label>Направление</Label>
                    <Select value={newAnimal.direction} onValueChange={(v) => setNewAnimal({...newAnimal, direction: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Молочное">Молочное</SelectItem>
                        <SelectItem value="Мясное">Мясное</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              {newAnimal.direction === 'Молочное' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Поголовье дойного стада</Label>
                    <Input type="number" value={newAnimal.dairy_head_count} 
                      onChange={(e) => setNewAnimal({...newAnimal, dairy_head_count: Number(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Надой на голову (л/год)</Label>
                    <Input type="number" value={newAnimal.avg_milk_yield_per_head} 
                      onChange={(e) => setNewAnimal({...newAnimal, avg_milk_yield_per_head: Number(e.target.value)})} />
                  </div>
                </div>
              )}
              {newAnimal.direction === 'Мясное' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Поголовье на откорме</Label>
                    <Input type="number" value={newAnimal.meat_head_count} 
                      onChange={(e) => setNewAnimal({...newAnimal, meat_head_count: Number(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Выход мяса с головы (кг)</Label>
                    <Input type="number" value={newAnimal.avg_meat_yield_per_head} 
                      onChange={(e) => setNewAnimal({...newAnimal, avg_meat_yield_per_head: Number(e.target.value)})} />
                  </div>
                </div>
              )}
              {newAnimal.category === 'Пчеловодство' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Количество ульев</Label>
                    <Input type="number" value={newAnimal.dairy_head_count} 
                      onChange={(e) => setNewAnimal({...newAnimal, dairy_head_count: Number(e.target.value), direction: 'Мёд'})} />
                  </div>
                  <div>
                    <Label>Мёд с улья (кг/год)</Label>
                    <Input type="number" value={newAnimal.avg_milk_yield_per_head} 
                      onChange={(e) => setNewAnimal({...newAnimal, avg_milk_yield_per_head: Number(e.target.value), direction: 'Мёд'})} />
                  </div>
                </div>
              )}
              <Button onClick={addAnimal} disabled={loading}>Добавить</Button>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible defaultOpen>
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="Wheat" className="text-yellow-600" />
                <h3 className="text-lg font-semibold">Что высаживаете</h3>
              </div>
              <Icon name="ChevronDown" size={20} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            {crops.map((crop, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <p><strong>{crop.crop_name}</strong></p>
                <p className="text-sm text-gray-600">
                  Площадь: {crop.sowing_area} га | Сбор: {crop.gross_harvest} т | 
                  Урожайность: {crop.yield_per_hectare?.toFixed(2)} т/га
                </p>
              </div>
            ))}
            
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold">Добавить культуру</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Культура</Label>
                  <Select value={newCrop.crop_name} onValueChange={(v) => setNewCrop({...newCrop, crop_name: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Пшеница">Пшеница</SelectItem>
                      <SelectItem value="Ячмень">Ячмень</SelectItem>
                      <SelectItem value="Кукуруза">Кукуруза</SelectItem>
                      <SelectItem value="Подсолнечник">Подсолнечник</SelectItem>
                      <SelectItem value="Соя">Соя</SelectItem>
                      <SelectItem value="Картофель">Картофель</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Посевная площадь (га)</Label>
                  <Input type="number" value={newCrop.sowing_area} 
                    onChange={(e) => setNewCrop({...newCrop, sowing_area: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Валовый сбор (т)</Label>
                  <Input type="number" value={newCrop.gross_harvest} 
                    onChange={(e) => setNewCrop({...newCrop, gross_harvest: Number(e.target.value)})} />
                </div>
              </div>
              <Button onClick={addCrop} disabled={loading}>Добавить</Button>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible>
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="Truck" className="text-purple-600" />
                <h3 className="text-lg font-semibold">Мой гараж</h3>
              </div>
              <Icon name="ChevronDown" size={20} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            {equipment.map((eq, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <p><strong>{eq.brand} {eq.model}</strong></p>
                <p className="text-sm text-gray-600">Год: {eq.year}</p>
              </div>
            ))}
            
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold">Добавить технику</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Марка</Label>
                  <Input value={newEquipment.brand} 
                    onChange={(e) => setNewEquipment({...newEquipment, brand: e.target.value})} />
                </div>
                <div>
                  <Label>Модель</Label>
                  <Input value={newEquipment.model} 
                    onChange={(e) => setNewEquipment({...newEquipment, model: e.target.value})} />
                </div>
                <div>
                  <Label>Год выпуска</Label>
                  <Input type="number" value={newEquipment.year} 
                    onChange={(e) => setNewEquipment({...newEquipment, year: Number(e.target.value)})} />
                </div>
              </div>
              <Button onClick={addEquipment} disabled={loading}>Добавить</Button>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}