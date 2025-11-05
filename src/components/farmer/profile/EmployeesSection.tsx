import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EmployeesSectionProps {
  employeesPermanent: number;
  employeesSeasonal: number;
  loading: boolean;
  onPermanentChange: (value: number) => void;
  onSeasonalChange: (value: number) => void;
  onSave: () => void;
}

export default function EmployeesSection({
  employeesPermanent,
  employeesSeasonal,
  loading,
  onPermanentChange,
  onSeasonalChange,
  onSave
}: EmployeesSectionProps) {
  return (
    <Collapsible>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Icon name="Users" className="text-blue-600" />
              <h3 className="text-lg font-semibold">Сотрудники</h3>
            </div>
            <Icon name="ChevronDown" size={20} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Постоянные сотрудники</Label>
              <Input
                type="number"
                value={employeesPermanent}
                onChange={(e) => onPermanentChange(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Сезонные работники</Label>
              <Input
                type="number"
                value={employeesSeasonal}
                onChange={(e) => onSeasonalChange(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={onSave} disabled={loading} className="mt-4 w-full">
            Сохранить данные о сотрудниках
          </Button>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
