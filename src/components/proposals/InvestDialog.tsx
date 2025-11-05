import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Proposal {
  id: number;
  description: string;
  price: number;
  shares: number;
  type: string;
  asset: {
    id?: string;
    name: string;
    type: string;
    count?: number;
    details?: string;
    livestock_type?: string;
    livestock_breed?: string;
    livestock_direction?: string;
    crop_type?: string;
    crop_variety?: string;
    crop_purpose?: string;
  };
  expected_product?: string;
  update_frequency?: string;
  farmer_name: string;
  farm_name: string;
  region: string;
  investors_count: number;
  farmer_id?: number;
}

interface InvestDialogProps {
  proposal: Proposal | null;
  onClose: () => void;
  onSubmit: (proposalId: number, type: string, shares: number, totalAmount: number) => Promise<boolean>;
}

export function InvestDialog({ proposal, onClose, onSubmit }: InvestDialogProps) {
  const [selectedShares, setSelectedShares] = useState(1);

  if (!proposal) return null;

  const handleSubmit = async () => {
    const totalAmount = proposal.price * selectedShares;
    console.log('Отправка заявки:', { proposalId: proposal.id, type: proposal.type, shares: selectedShares, totalAmount });
    const success = await onSubmit(proposal.id, proposal.type, selectedShares, totalAmount);
    console.log('Результат отправки:', success);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={!!proposal} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {proposal.asset.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Цена за долю:</span>
              <span className="font-bold text-lg">{proposal.price.toLocaleString()} ₽</span>
            </div>

            <div className="border-t pt-3">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Количество долей:
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedShares(Math.max(1, selectedShares - 1))}
                  disabled={selectedShares <= 1}
                >
                  <Icon name="Minus" size={16} />
                </Button>
                <input
                  type="number"
                  min="1"
                  max={proposal.shares}
                  value={selectedShares}
                  onChange={(e) => setSelectedShares(Math.max(1, Math.min(proposal.shares, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center border rounded px-3 py-2 text-lg font-semibold"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedShares(Math.min(proposal.shares, selectedShares + 1))}
                  disabled={selectedShares >= proposal.shares}
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Доступно: {proposal.shares} долей
              </p>
            </div>
          </div>

          <div className="bg-farmer-green/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Сумма инвестиции:</span>
              <span className="text-2xl font-bold text-farmer-green">
                {(proposal.price * selectedShares).toLocaleString()} ₽
              </span>
            </div>

            {proposal.expected_product && (
              <div className="border-t pt-2 mt-2">
                <p className="text-sm text-gray-700">
                  <Icon name="Gift" size={14} className="inline mr-1 text-farmer-orange" />
                  <strong>Вы получите:</strong> {proposal.expected_product}
                  {selectedShares > 1 && ` × ${selectedShares}`}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-farmer-green hover:bg-farmer-green-dark text-white"
            >
              <Icon name="Heart" size={16} className="mr-2" />
              Оставить заявку
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
