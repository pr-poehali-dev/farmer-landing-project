import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Animal } from './types';

interface AnimalsSectionProps {
  animals: Animal[];
  newAnimal: Animal;
  loading: boolean;
  onNewAnimalChange: (animal: Animal) => void;
  onAdd: () => void;
}

export default function AnimalsSection({
  animals,
  newAnimal,
  loading,
  onNewAnimalChange,
  onAdd
}: AnimalsSectionProps) {
  return (
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
                <Select value={newAnimal.category} onValueChange={(v) => onNewAnimalChange({...newAnimal, category: v})}>
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
                  <Select value={newAnimal.direction} onValueChange={(v) => onNewAnimalChange({...newAnimal, direction: v})}>
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
                    onChange={(e) => onNewAnimalChange({...newAnimal, dairy_head_count: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Надой на голову (л/год)</Label>
                  <Input type="number" value={newAnimal.avg_milk_yield_per_head} 
                    onChange={(e) => onNewAnimalChange({...newAnimal, avg_milk_yield_per_head: Number(e.target.value)})} />
                </div>
              </div>
            )}
            {newAnimal.direction === 'Мясное' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Поголовье на откорме</Label>
                  <Input type="number" value={newAnimal.meat_head_count} 
                    onChange={(e) => onNewAnimalChange({...newAnimal, meat_head_count: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Выход мяса с головы (кг)</Label>
                  <Input type="number" value={newAnimal.avg_meat_yield_per_head} 
                    onChange={(e) => onNewAnimalChange({...newAnimal, avg_meat_yield_per_head: Number(e.target.value)})} />
                </div>
              </div>
            )}
            {newAnimal.category === 'Пчеловодство' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Количество ульев</Label>
                  <Input type="number" value={newAnimal.dairy_head_count} 
                    onChange={(e) => onNewAnimalChange({...newAnimal, dairy_head_count: Number(e.target.value), direction: 'Мёд'})} />
                </div>
                <div>
                  <Label>Мёд с улья (кг/год)</Label>
                  <Input type="number" value={newAnimal.avg_milk_yield_per_head} 
                    onChange={(e) => onNewAnimalChange({...newAnimal, avg_milk_yield_per_head: Number(e.target.value), direction: 'Мёд'})} />
                </div>
              </div>
            )}
            <Button onClick={onAdd} disabled={loading}>Добавить</Button>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
