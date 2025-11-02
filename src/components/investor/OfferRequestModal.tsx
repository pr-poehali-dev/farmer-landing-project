import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Offer } from '@/types/offer';
import { toast } from 'sonner';

interface OfferRequestModalProps {
  offer: Offer | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (offerId: number, sharesRequested: number) => Promise<void>;
}

const OfferRequestModal = ({ offer, open, onClose, onSubmit }: OfferRequestModalProps) => {
  const [sharesRequested, setSharesRequested] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (offer && open) {
      setSharesRequested(offer.min_shares);
    }
  }, [offer, open]);

  if (!offer) return null;

  const totalCost = sharesRequested * offer.share_price;
  const expectedIncome = offer.expected_monthly_income 
    ? (offer.expected_monthly_income / offer.total_shares) * sharesRequested 
    : 0;

  const isValid = 
    sharesRequested >= offer.min_shares && 
    sharesRequested <= offer.available_shares;

  const handleSubmit = async () => {
    if (!isValid) {
      if (sharesRequested < offer.min_shares) {
        toast.error(`Минимальное количество долей: ${offer.min_shares}`);
      } else if (sharesRequested > offer.available_shares) {
        toast.error(`Доступно только ${offer.available_shares} долей`);
      }
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(offer.id, sharesRequested);
      onClose();
    } catch (error) {
      console.error('Error submitting offer request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Заявка на инвестицию
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-1">{offer.title}</h3>
            <p className="text-sm text-gray-600">{offer.farm_name}</p>
            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Цена доли:</span>
                <span className="font-medium">{offer.share_price.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Доступно долей:</span>
                <span className="font-medium text-farmer-orange">{offer.available_shares}</span>
              </div>
            </div>
          </Card>

          <div>
            <Label htmlFor="shares" className="text-sm font-medium mb-2 block">
              Количество долей *
            </Label>
            <Input
              id="shares"
              type="number"
              min={offer.min_shares}
              max={offer.available_shares}
              value={sharesRequested}
              onChange={(e) => setSharesRequested(Number(e.target.value))}
              placeholder={`От ${offer.min_shares} до ${offer.available_shares}`}
              className="text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Минимум: {offer.min_shares} доля, максимум: {offer.available_shares} долей
            </p>
          </div>

          <Card className="p-4 bg-gradient-to-br from-farmer-green/5 to-farmer-orange/5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Стоимость долей:</span>
                <span className="text-xl font-bold text-farmer-green">
                  {totalCost.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              
              {expectedIncome > 0 && (
                <>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ожидаемый доход:</span>
                      <span className="font-medium text-green-700">
                        {expectedIncome.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽/мес
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Годовой доход:</span>
                      <span>
                        ~{(expectedIncome * 12).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                      </span>
                    </div>
                    {totalCost > 0 && (
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>ROI за год:</span>
                        <span className="font-medium">
                          ~{((expectedIncome * 12 / totalCost) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>

          {!isValid && sharesRequested > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {sharesRequested < offer.min_shares 
                  ? `Минимум ${offer.min_shares} доля` 
                  : `Доступно только ${offer.available_shares} долей`
                }
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={submitting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="flex-1 bg-farmer-green hover:bg-farmer-green-dark"
            >
              {submitting ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить заявку
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            После отправки заявки фермер рассмотрит её и свяжется с вами
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferRequestModal;
