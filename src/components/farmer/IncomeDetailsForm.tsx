import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  revenuePeriod: 'daily' | 'monthly' | 'yearly';
  revenueAmount: string;
  revenueDescription: string;
  maintenanceCost: string;
  payoutAmount: string;
  payoutPeriod: 'monthly' | 'yearly';
  payoutDuration: string;
  lastYearYield: string;
  onRevenuePeriodChange: (value: 'daily' | 'monthly' | 'yearly') => void;
  onRevenueAmountChange: (value: string) => void;
  onRevenueDescriptionChange: (value: string) => void;
  onMaintenanceCostChange: (value: string) => void;
  onPayoutAmountChange: (value: string) => void;
  onPayoutPeriodChange: (value: 'monthly' | 'yearly') => void;
  onPayoutDurationChange: (value: string) => void;
  onLastYearYieldChange: (value: string) => void;
}

export const IncomeDetailsForm = ({
  revenuePeriod,
  revenueAmount,
  revenueDescription,
  maintenanceCost,
  payoutAmount,
  payoutPeriod,
  payoutDuration,
  lastYearYield,
  onRevenuePeriodChange,
  onRevenueAmountChange,
  onRevenueDescriptionChange,
  onMaintenanceCostChange,
  onPayoutAmountChange,
  onPayoutPeriodChange,
  onPayoutDurationChange,
  onLastYearYieldChange
}: Props) => {
  return (
    <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-blue-900">Детали дохода</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="revenuePeriod">Период дохода *</Label>
          <Select value={revenuePeriod} onValueChange={(v) => onRevenuePeriodChange(v as 'daily' | 'monthly' | 'yearly')}>
            <SelectTrigger id="revenuePeriod">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">День</SelectItem>
              <SelectItem value="monthly">Месяц</SelectItem>
              <SelectItem value="yearly">Год</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="revenueAmount">Сумма дохода (руб.) *</Label>
          <Input
            id="revenueAmount"
            type="number"
            min="1"
            placeholder="10000"
            value={revenueAmount}
            onChange={(e) => onRevenueAmountChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="revenueDescription">Описание источника дохода</Label>
        <Textarea
          id="revenueDescription"
          placeholder="Например: продажа молока, яиц, мёда..."
          value={revenueDescription}
          onChange={(e) => onRevenueDescriptionChange(e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="maintenanceCost">Затраты на содержание ({revenuePeriod === 'daily' ? 'день' : revenuePeriod === 'monthly' ? 'месяц' : 'год'}, руб.)</Label>
        <Input
          id="maintenanceCost"
          type="number"
          min="0"
          placeholder="3000"
          value={maintenanceCost}
          onChange={(e) => onMaintenanceCostChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="payoutAmount">Выплата инвестору (руб.) *</Label>
          <Input
            id="payoutAmount"
            type="number"
            min="1"
            placeholder="5000"
            value={payoutAmount}
            onChange={(e) => onPayoutAmountChange(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="payoutPeriod">Период выплаты *</Label>
          <Select value={payoutPeriod} onValueChange={(v) => onPayoutPeriodChange(v as 'monthly' | 'yearly')}>
            <SelectTrigger id="payoutPeriod">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Месяц</SelectItem>
              <SelectItem value="yearly">Год</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="payoutDuration">Срок выплат (мес.) *</Label>
          <Input
            id="payoutDuration"
            type="number"
            min="1"
            placeholder="12"
            value={payoutDuration}
            onChange={(e) => onPayoutDurationChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="lastYearYield">Урожай прошлого года</Label>
        <Input
          id="lastYearYield"
          type="text"
          placeholder="Например: 500 кг"
          value={lastYearYield}
          onChange={(e) => onLastYearYieldChange(e.target.value)}
        />
      </div>
    </div>
  );
};
