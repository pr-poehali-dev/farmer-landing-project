import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface LandSectionProps {
  landOwned: number;
  landRented: number;
  loading: boolean;
  onLandOwnedChange: (value: number) => void;
  onLandRentedChange: (value: number) => void;
  onSave: () => void;
}

export default function LandSection({
  landOwned,
  landRented,
  loading,
  onLandOwnedChange,
  onLandRentedChange,
  onSave
}: LandSectionProps) {
  return (
    <Collapsible>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Icon name="MapPin" className="text-green-600" />
              <h3 className="text-lg font-semibold">Что в хозяйстве</h3>
            </div>
            <Icon name="ChevronDown" size={20} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Площадь в собственности (га)</Label>
              <Input
                type="number"
                value={landOwned}
                onChange={(e) => onLandOwnedChange(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Площадь в аренде (га)</Label>
              <Input
                type="number"
                value={landRented}
                onChange={(e) => onLandRentedChange(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={onSave} disabled={loading} className="mt-4 w-full">
            Сохранить земельные данные
          </Button>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
