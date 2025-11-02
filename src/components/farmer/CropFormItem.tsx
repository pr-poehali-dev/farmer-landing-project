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
import { CROP_TYPES, Crop } from '@/types/farm.types';

interface Props {
  crop: Crop;
  index: number;
  onUpdate: (index: number, field: keyof Crop, value: any) => void;
  onRemove: (index: number) => void;
}

export default function CropFormItem({ crop, index, onUpdate, onRemove }: Props) {
  return (
    <Card className="p-4 bg-gray-50 mb-3">
      <div className="flex items-start justify-between mb-3">
        <Label className="text-sm font-semibold">Культура #{index + 1}</Label>
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
          <Label className="text-xs">Культура</Label>
          <Select value={crop.type} onValueChange={(val) => onUpdate(index, 'type', val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CROP_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {crop.type === 'other' && (
          <div>
            <Label className="text-xs">Название</Label>
            <Input
              type="text"
              placeholder="Укажите название"
              value={crop.customName || ''}
              onChange={(e) => onUpdate(index, 'customName', e.target.value)}
            />
          </div>
        )}
        <div>
          <Label className="text-xs">Объём (га)</Label>
          <Input
            type="number"
            value={crop.area}
            onChange={(e) => onUpdate(index, 'area', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label className="text-xs">Урожайность (т)</Label>
          <Input
            type="number"
            value={crop.yield}
            onChange={(e) => onUpdate(index, 'yield', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </Card>
  );
}
