import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Equipment } from '@/types/farm.types';
import EquipmentFormItem from './EquipmentFormItem';

interface EquipmentSectionProps {
  equipment: Equipment[];
  addEquipment: () => void;
  updateEquipment: (index: number, field: keyof Equipment, value: any) => void;
  removeEquipment: (index: number) => void;
}

export default function EquipmentSection({
  equipment,
  addEquipment,
  updateEquipment,
  removeEquipment
}: EquipmentSectionProps) {
  return (
    <AccordionItem value="equipment" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Icon name="Truck" size={20} className="text-green-600" />
          <span className="font-semibold">Мой гараж</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <Label>Техника</Label>
          <Button onClick={addEquipment} variant="outline" size="sm">
            <Icon name="Plus" size={16} className="mr-1" />
            Добавить
          </Button>
        </div>
        {equipment.map((item, index) => (
          <EquipmentFormItem
            key={item.id}
            equipment={item}
            index={index}
            onUpdate={updateEquipment}
            onRemove={removeEquipment}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
