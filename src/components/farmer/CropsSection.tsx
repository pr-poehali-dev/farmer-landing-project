import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Crop } from '@/types/farm.types';
import CropFormItem from './CropFormItem';

interface CropsSectionProps {
  crops: Crop[];
  addCrop: () => void;
  updateCrop: (index: number, field: keyof Crop, value: any) => void;
  removeCrop: (index: number) => void;
}

export default function CropsSection({
  crops,
  addCrop,
  updateCrop,
  removeCrop
}: CropsSectionProps) {
  return (
    <AccordionItem value="crops" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Icon name="Wheat" size={20} className="text-green-600" />
          <span className="font-semibold">Что высаживаете</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <Label>Культуры</Label>
          <Button onClick={addCrop} variant="outline" size="sm">
            <Icon name="Plus" size={16} className="mr-1" />
            Добавить
          </Button>
        </div>
        {crops.map((crop, index) => (
          <CropFormItem
            key={index}
            crop={crop}
            index={index}
            onUpdate={updateCrop}
            onRemove={removeCrop}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
