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
import { Crop } from '@/types/farm.types';
import { CROP_TYPES, CROP_VARIETIES, CROP_PURPOSES } from '@/data/crops';

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
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
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
          <div>
            <Label className="text-xs">Объём (га)</Label>
            <Input
              type="number"
              value={crop.area}
              onChange={(e) => onUpdate(index, 'area', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label className="text-xs">Урожайность (т/га)</Label>
            <Input
              type="number"
              value={crop.yield}
              onChange={(e) => onUpdate(index, 'yield', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Сорт (опционально)</Label>
            <Select 
              value={crop.variety || ''} 
              onValueChange={(val) => onUpdate(index, 'variety', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите сорт" />
              </SelectTrigger>
              <SelectContent>
                {crop.type && CROP_VARIETIES[crop.type]?.map(variety => (
                  <SelectItem key={variety.value} value={variety.value}>
                    {variety.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Назначение (опционально)</Label>
            <Select 
              value={crop.purpose || ''} 
              onValueChange={(val) => onUpdate(index, 'purpose', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите назначение" />
              </SelectTrigger>
              <SelectContent>
                {CROP_PURPOSES.map(purpose => (
                  <SelectItem key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <Label className="text-xs">Цена реализации (₽/кг)</Label>
          <Input
            type="number"
            placeholder="25"
            value={crop.pricePerKg || ''}
            onChange={(e) => onUpdate(index, 'pricePerKg', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </Card>
  );
}