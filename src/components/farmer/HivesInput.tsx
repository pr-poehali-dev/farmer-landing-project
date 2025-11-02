import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Animal } from '@/types/farm.types';

interface Props {
  animals: Animal[];
  onUpdate: (index: number, field: keyof Animal, value: any) => void;
}

export default function HivesInput({ animals, onUpdate }: Props) {
  const hivesIndex = animals.findIndex(a => a.type === 'hives');
  const hivesCount = hivesIndex >= 0 ? animals[hivesIndex].count : 0;

  const handleHivesChange = (value: number) => {
    if (hivesIndex >= 0) {
      onUpdate(hivesIndex, 'count', value);
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
        onChange={(e) => handleHivesChange(parseInt(e.target.value) || 0)}
      />
    </div>
  );
}
