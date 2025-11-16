import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Animal } from '@/types/farm.types';
import AnimalFormItem from './AnimalFormItem';
import HivesInput from './HivesInput';

interface LandSectionProps {
  landOwned: string;
  setLandOwned: (value: string) => void;
  landRented: string;
  setLandRented: (value: string) => void;
  landArea: string;
  animals: Animal[];
  addAnimal: () => void;
  updateAnimal: (index: number, field: keyof Animal, value: any) => void;
  removeAnimal: (index: number) => void;
  setAnimals: (animals: Animal[]) => void;
}

export default function LandSection({
  landOwned,
  setLandOwned,
  landRented,
  setLandRented,
  landArea,
  animals,
  addAnimal,
  updateAnimal,
  removeAnimal,
  setAnimals
}: LandSectionProps) {
  return (
    <AccordionItem value="land" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Icon name="Home" size={20} className="text-green-600" />
          <span className="font-semibold">Что в хозяйстве</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>В собственности (га)</Label>
            <Input
              type="text"
              placeholder="30"
              value={landOwned}
              onChange={(e) => setLandOwned(e.target.value)}
            />
          </div>
          <div>
            <Label>В аренде (га)</Label>
            <Input
              type="text"
              placeholder="20"
              value={landRented}
              onChange={(e) => setLandRented(e.target.value)}
            />
          </div>
          <div>
            <Label>Общая площадь земли (га)</Label>
            <Input
              type="text"
              placeholder="50"
              value={landArea}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="border-t pt-4">
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
  );
}
