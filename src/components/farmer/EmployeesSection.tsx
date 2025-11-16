import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface EmployeesSectionProps {
  employeesPermanent: number;
  setEmployeesPermanent: (value: number) => void;
  employeesSeasonal: number;
  setEmployeesSeasonal: (value: number) => void;
}

export default function EmployeesSection({
  employeesPermanent,
  setEmployeesPermanent,
  employeesSeasonal,
  setEmployeesSeasonal
}: EmployeesSectionProps) {
  return (
    <AccordionItem value="employees" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Icon name="Users" size={20} className="text-green-600" />
          <span className="font-semibold">Сотрудники</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Постоянные сотрудники</Label>
            <Input
              type="number"
              value={employeesPermanent}
              onChange={(e) => setEmployeesPermanent(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div>
            <Label>Сезонные работники</Label>
            <Input
              type="number"
              value={employeesSeasonal}
              onChange={(e) => setEmployeesSeasonal(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
