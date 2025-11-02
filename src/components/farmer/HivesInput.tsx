import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Animal } from '@/types/farm.types';

interface Props {
  animals: Animal[];
  onUpdate: (index: number, field: keyof Animal, value: any) => void;
}

interface HivesInputProps {
  animals: Animal[];
  onUpdate: (index: number, field: keyof Animal, value: any) => void;
  onAnimalsChange: (animals: Animal[]) => void;
}

export default function HivesInput({ animals, onUpdate, onAnimalsChange }: HivesInputProps) {
  const hivesIndex = animals.findIndex(a => a.type === 'hives');
  const hivesCount = hivesIndex >= 0 ? animals[hivesIndex].count : '';

  const handleHivesChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    const currentIndex = animals.findIndex(a => a.type === 'hives');
    
    if (currentIndex >= 0) {
      onUpdate(currentIndex, 'count', numValue);
    } else if (numValue > 0) {
      onAnimalsChange([...animals, { type: 'hives', count: numValue, breed: '' }]);
    }
  };

  return (
    <div>
      <Label className="flex items-center gap-2 mb-2">
        <Icon name="Flower2" size={16} />
        Ульи (количество)
      </Label>
      <Input
        type="number"
        placeholder="Например: 20"
        value={hivesCount}
        onChange={(e) => handleHivesChange(e.target.value)}
      />
    </div>
  );
}