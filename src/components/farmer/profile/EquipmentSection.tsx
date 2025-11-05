import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Equipment } from './types';

interface EquipmentSectionProps {
  equipment: Equipment[];
  newEquipment: Equipment;
  loading: boolean;
  onNewEquipmentChange: (equipment: Equipment) => void;
  onAdd: () => void;
}

export default function EquipmentSection({
  equipment,
  newEquipment,
  loading,
  onNewEquipmentChange,
  onAdd
}: EquipmentSectionProps) {
  return (
    <Collapsible>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Icon name="Truck" className="text-red-600" />
              <h3 className="text-lg font-semibold">Мой гараж</h3>
            </div>
            <Icon name="ChevronDown" size={20} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          {equipment.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <p><strong>{item.brand} {item.model}</strong></p>
              <p className="text-sm text-gray-600">Год выпуска: {item.year}</p>
            </div>
          ))}
          
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold">Добавить технику</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Марка</Label>
                <Input value={newEquipment.brand} 
                  onChange={(e) => onNewEquipmentChange({...newEquipment, brand: e.target.value})} />
              </div>
              <div>
                <Label>Модель</Label>
                <Input value={newEquipment.model} 
                  onChange={(e) => onNewEquipmentChange({...newEquipment, model: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>Год выпуска</Label>
              <Input type="number" value={newEquipment.year} 
                onChange={(e) => onNewEquipmentChange({...newEquipment, year: Number(e.target.value)})} />
            </div>
            <Button onClick={onAdd} disabled={loading}>Добавить технику</Button>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
