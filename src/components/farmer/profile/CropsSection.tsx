import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Crop } from './types';

interface CropsSectionProps {
  crops: Crop[];
  newCrop: Crop;
  loading: boolean;
  onNewCropChange: (crop: Crop) => void;
  onAdd: () => void;
}

export default function CropsSection({
  crops,
  newCrop,
  loading,
  onNewCropChange,
  onAdd
}: CropsSectionProps) {
  return (
    <Collapsible>
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
                Площадь: {crop.sowing_area} га, Валовый сбор: {crop.gross_harvest} т
                {crop.yield_per_hectare && `, Урожайность: ${crop.yield_per_hectare} т/га`}
              </p>
            </div>
          ))}
          
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold">Добавить культуру</h4>
            <div>
              <Label>Культура</Label>
              <Select value={newCrop.crop_name} onValueChange={(v) => onNewCropChange({...newCrop, crop_name: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Пшеница">Пшеница</SelectItem>
                  <SelectItem value="Ячмень">Ячмень</SelectItem>
                  <SelectItem value="Кукуруза">Кукуруза</SelectItem>
                  <SelectItem value="Подсолнечник">Подсолнечник</SelectItem>
                  <SelectItem value="Соя">Соя</SelectItem>
                  <SelectItem value="Картофель">Картофель</SelectItem>
                  <SelectItem value="Овес">Овес</SelectItem>
                  <SelectItem value="Рожь">Рожь</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Площадь посева (га)</Label>
                <Input type="number" value={newCrop.sowing_area} 
                  onChange={(e) => onNewCropChange({...newCrop, sowing_area: Number(e.target.value)})} />
              </div>
              <div>
                <Label>Валовый сбор (тонн)</Label>
                <Input type="number" value={newCrop.gross_harvest} 
                  onChange={(e) => onNewCropChange({...newCrop, gross_harvest: Number(e.target.value)})} />
              </div>
            </div>
            <Button onClick={onAdd} disabled={loading}>Добавить культуру</Button>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
