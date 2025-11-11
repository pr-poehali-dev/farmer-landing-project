import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Animal } from '@/types/farm.types';
import { LIVESTOCK_TYPES, LIVESTOCK_DIRECTIONS, LIVESTOCK_BREEDS } from '@/data/livestock';

interface Props {
  animal: Animal;
  index: number;
  onUpdate: (index: number, field: keyof Animal, value: any) => void;
  onRemove: (index: number) => void;
}

export default function AnimalFormItem({ animal, index, onUpdate, onRemove }: Props) {
  return (
    <Card className="p-4 bg-gray-50 mb-3">
      <div className="flex items-start justify-between mb-3">
        <Label className="text-sm font-semibold">Животное #{index + 1}</Label>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onRemove(index)}
          className="h-6 w-6 p-0"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Вид</Label>
            <Select value={animal.type} onValueChange={(val) => onUpdate(index, 'type', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIVESTOCK_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Количество</Label>
            <Input
              type="number"
              value={animal.count}
              onChange={(e) => onUpdate(index, 'count', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label className="text-xs">Порода (опционально)</Label>
            <Select 
              value={animal.breed || ''} 
              onValueChange={(val) => onUpdate(index, 'breed', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите породу" />
              </SelectTrigger>
              <SelectContent>
                {animal.type && LIVESTOCK_BREEDS[animal.type]?.map(breed => (
                  <SelectItem key={breed.value} value={breed.value}>
                    {breed.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Направление</Label>
            <Select value={animal.direction || ''} onValueChange={(val) => onUpdate(index, 'direction', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                {LIVESTOCK_DIRECTIONS.map(dir => (
                  <SelectItem key={dir.value} value={dir.value}>
                    {dir.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(animal.direction === 'dairy' || animal.direction === 'meat_dairy') && (
            <div>
              <Label className="text-xs">Надой (л/гол/год)</Label>
              <Input
                type="number"
                placeholder="5000"
                value={animal.milkYield || ''}
                onChange={(e) => onUpdate(index, 'milkYield', parseInt(e.target.value) || 0)}
              />
            </div>
          )}
          {(animal.direction === 'meat' || animal.direction === 'meat_dairy' || animal.direction === 'meat_wool') && (
            <div>
              <Label className="text-xs">Выход мяса (кг/гол/год)</Label>
              <Input
                type="number"
                placeholder="300"
                value={animal.meatYield || ''}
                onChange={(e) => onUpdate(index, 'meatYield', parseInt(e.target.value) || 0)}
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          {(animal.direction === 'dairy' || animal.direction === 'meat_dairy') && (
            <div>
              <Label className="text-xs">Цена молока (₽/л)</Label>
              <Input
                type="number"
                placeholder="35"
                value={animal.milkPrice || ''}
                onChange={(e) => onUpdate(index, 'milkPrice', parseInt(e.target.value) || 0)}
              />
            </div>
          )}
          {(animal.direction === 'meat' || animal.direction === 'meat_dairy' || animal.direction === 'meat_wool') && (
            <div>
              <Label className="text-xs">Цена мяса (₽/кг)</Label>
              <Input
                type="number"
                placeholder="450"
                value={animal.meatPrice || ''}
                onChange={(e) => onUpdate(index, 'meatPrice', parseInt(e.target.value) || 0)}
              />
            </div>
          )}
          {animal.type === 'chickens' && (
            <div>
              <Label className="text-xs">Цена яиц (₽/10 шт)</Label>
              <Input
                type="number"
                placeholder="80"
                value={animal.eggPrice || ''}
                onChange={(e) => onUpdate(index, 'eggPrice', parseInt(e.target.value) || 0)}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}