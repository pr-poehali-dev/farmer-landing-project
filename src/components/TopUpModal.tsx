import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

const QUICK_AMOUNTS = [500, 1000, 3000, 5000];

export default function TopUpModal({ open, onClose, onSubmit }: TopUpModalProps) {
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit(numAmount);
      setAmount('');
      onClose();
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Пополнение баланса</DialogTitle>
          <DialogDescription>
            Выберите сумму или введите свою
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {QUICK_AMOUNTS.map((quickAmount) => (
              <Button
                key={quickAmount}
                type="button"
                variant={amount === quickAmount.toString() ? 'default' : 'outline'}
                onClick={() => handleQuickAmount(quickAmount)}
                className="h-16"
              >
                <div className="text-center">
                  <div className="text-lg font-bold">{quickAmount} ₽</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Другая сумма</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Введите сумму"
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₽</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Способы оплаты:</p>
                <p className="text-blue-700">Банковская карта, СБП, ЮMoney</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={!amount || parseFloat(amount) <= 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Icon name="CreditCard" size={18} className="mr-2" />
              Перейти к оплате
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
