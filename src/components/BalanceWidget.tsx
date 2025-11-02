import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface BalanceWidgetProps {
  balance: number;
  onTopUp: () => void;
}

export default function BalanceWidget({ balance, onTopUp }: BalanceWidgetProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Icon name="Wallet" size={16} />
            <span>Баланс</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
          </div>
        </div>
        <Button onClick={onTopUp} className="bg-green-600 hover:bg-green-700">
          <Icon name="Plus" size={18} className="mr-2" />
          Пополнить
        </Button>
      </div>
    </Card>
  );
}
