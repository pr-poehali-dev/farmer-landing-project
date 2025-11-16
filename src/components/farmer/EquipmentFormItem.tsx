import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Equipment } from '@/types/farm.types';

interface Props {
  equipment: Equipment;
  index: number;
  onUpdate: (index: number, field: keyof Equipment, value: any) => void;
  onRemove: (index: number) => void;
}

const EQUIPMENT_BRANDS = [
  'John Deere',
  'Claas',
  'New Holland',
  'Case IH',
  'Fendt',
  'Massey Ferguson',
  'Kubota',
  'Беларус (МТЗ)',
  'Кировец (Кировский завод)',
  'Тракторные заводы (Россельмаш)',
  'Агромашхолдинг (Агромаш)',
  'Challenger',
  'JCB',
  'Xinong',
  'Луцкий трактор (ЛУАЗ)',
  'XCMG',
  'Shantui',
  'Lonking',
  'LiuGong',
  'YTO Group',
  'LOVOL',
  'Другая'
];

export default function EquipmentFormItem({ equipment, index, onUpdate, onRemove }: Props) {
  return (
    <Card className="p-4 bg-gray-50 mb-3">
      <div className="flex items-start justify-between mb-3">
        <Label className="text-sm font-semibold">Техника #{index + 1}</Label>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onRemove(index)}
          className="h-6 w-6 p-0"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Марка</Label>
          <Select 
            value={equipment.brand || 'other'} 
            onValueChange={(v) => onUpdate(index, 'brand', v === 'other' ? '' : v)}
          >
            <SelectTrigger><SelectValue placeholder="Выберите марку" /></SelectTrigger>
            <SelectContent>
              {EQUIPMENT_BRANDS.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Модель</Label>
          <Input
            type="text"
            placeholder="Например: 6250R"
            value={equipment.model}
            onChange={(e) => onUpdate(index, 'model', e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">Год выпуска</Label>
          <Input
            type="text"
            placeholder="Например: 2020"
            value={equipment.year}
            onChange={(e) => onUpdate(index, 'year', e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">Навесное оборудование</Label>
          <Input
            type="text"
            placeholder="Плуг, культиватор..."
            value={equipment.attachments}
            onChange={(e) => onUpdate(index, 'attachments', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}