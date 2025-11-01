import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export interface GarageItem {
  id: string;
  category: 'machinery' | 'equipment' | 'fertilizer';
  type: string;
  model: string;
  details: string;
  photo_url?: string;
}

interface GarageItemFormProps {
  onAdd: (item: Omit<GarageItem, 'id'>) => void;
}

const MACHINERY_TYPES = ['Трактор', 'Комбайн', 'Другая техника'];
const EQUIPMENT_TYPES = ['Плуг', 'Борона', 'Культиватор', 'Опрыскиватель', 'Другое'];
const FERTILIZER_TYPES = ['Органические', 'Минеральные', 'Комплексные', 'Другое'];

export default function GarageItemForm({ onAdd }: GarageItemFormProps) {
  const [category, setCategory] = useState<'machinery' | 'equipment' | 'fertilizer'>('machinery');
  const [type, setType] = useState('');
  const [customType, setCustomType] = useState('');
  const [model, setModel] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalType = type === 'Другая техника' || type === 'Другое' ? customType : type;
    
    if (!finalType || !model) return;

    onAdd({
      category,
      type: finalType,
      model,
      details
    });

    setType('');
    setCustomType('');
    setModel('');
    setDetails('');
  };

  const getTypeOptions = () => {
    switch (category) {
      case 'machinery': return MACHINERY_TYPES;
      case 'equipment': return EQUIPMENT_TYPES;
      case 'fertilizer': return FERTILIZER_TYPES;
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'machinery': return 'Техника';
      case 'equipment': return 'Навесное оборудование';
      case 'fertilizer': return 'Удобрения';
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'machinery': return 'Truck';
      case 'equipment': return 'Wrench';
      case 'fertilizer': return 'Sprout';
    }
  };

  const showCustomInput = type === 'Другая техника' || type === 'Другое';

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Категория</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                type="button"
                variant={category === 'machinery' ? 'default' : 'outline'}
                onClick={() => { setCategory('machinery'); setType(''); }}
                className="w-full"
              >
                <Icon name="Truck" size={18} className="mr-2" />
                Техника
              </Button>
              <Button
                type="button"
                variant={category === 'equipment' ? 'default' : 'outline'}
                onClick={() => { setCategory('equipment'); setType(''); }}
                className="w-full"
              >
                <Icon name="Wrench" size={18} className="mr-2" />
                Оборудование
              </Button>
              <Button
                type="button"
                variant={category === 'fertilizer' ? 'default' : 'outline'}
                onClick={() => { setCategory('fertilizer'); setType(''); }}
                className="w-full"
              >
                <Icon name="Sprout" size={18} className="mr-2" />
                Удобрения
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="type">
              Тип {getCategoryLabel()} <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder={`Выберите тип`} />
              </SelectTrigger>
              <SelectContent>
                {getTypeOptions().map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showCustomInput && (
            <div>
              <Label htmlFor="customType">
                Укажите тип <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customType"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Например: Сеялка"
                required={showCustomInput}
              />
            </div>
          )}

          <div>
            <Label htmlFor="model">
              {category === 'fertilizer' ? 'Название/Бренд' : 'Модель/Вид'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={category === 'fertilizer' ? 'Например: Аммофос' : 'Например: John Deere 8R'}
              required
            />
          </div>

          <div>
            <Label htmlFor="details">Детали</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={
                category === 'fertilizer' 
                  ? 'Для каких культур, частота использования...'
                  : 'Год выпуска, состояние, особенности...'
              }
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-farmer-green hover:bg-farmer-green-dark">
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить в гараж
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
