import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  totalAssetValue: string;
  shares: string;
  onTotalAssetValueChange: (value: string) => void;
  onSharesChange: (value: string) => void;
}

const MIN_SHARE_PRICE = 5000;

const calculateMaxShares = (totalValue: string) => {
  const total = parseFloat(totalValue);
  if (!total || total < MIN_SHARE_PRICE) return 0;
  return Math.floor(total / MIN_SHARE_PRICE);
};

const calculateSharePrice = (totalValue: string, shares: string) => {
  const total = parseFloat(totalValue);
  const sharesNum = parseInt(shares);
  if (!total || !sharesNum || sharesNum < 1) return 0;
  return Math.floor(total / sharesNum);
};

export const SharePricingForm = ({
  totalAssetValue,
  shares,
  onTotalAssetValueChange,
  onSharesChange
}: Props) => {
  const maxShares = calculateMaxShares(totalAssetValue);
  const calculatedSharePrice = calculateSharePrice(totalAssetValue, shares);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-green-900">Ценообразование</h3>
      
      <div>
        <Label htmlFor="totalAssetValue">Общая стоимость актива (руб.) *</Label>
        <Input
          id="totalAssetValue"
          type="number"
          min={MIN_SHARE_PRICE}
          placeholder={`Минимум ${MIN_SHARE_PRICE}`}
          value={totalAssetValue}
          onChange={(e) => onTotalAssetValueChange(e.target.value)}
          required
        />
        <p className="text-xs text-gray-600 mt-1">
          Укажите полную стоимость актива, который вы предлагаете для инвестиций
        </p>
      </div>

      <div>
        <Label htmlFor="shares">Количество долей *</Label>
        <Input
          id="shares"
          type="number"
          min="1"
          max={maxShares || undefined}
          placeholder="Количество долей для продажи"
          value={shares}
          onChange={(e) => onSharesChange(e.target.value)}
          required
        />
        {maxShares > 0 && (
          <p className="text-xs text-gray-600 mt-1">
            Максимум долей при минимальной цене {MIN_SHARE_PRICE} руб.: {maxShares}
          </p>
        )}
      </div>

      {calculatedSharePrice >= MIN_SHARE_PRICE && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-900">
            Цена одной доли: {calculatedSharePrice.toLocaleString()} руб.
          </p>
          <p className="text-xs text-green-700 mt-1">
            {totalAssetValue && shares 
              ? `${totalAssetValue} руб. ÷ ${shares} долей = ${calculatedSharePrice} руб./доля`
              : 'Введите стоимость актива и количество долей'}
          </p>
        </div>
      )}

      {calculatedSharePrice > 0 && calculatedSharePrice < MIN_SHARE_PRICE && (
        <p className="text-sm text-red-600">
          Цена доли ({calculatedSharePrice} руб.) меньше минимальной ({MIN_SHARE_PRICE} руб.). 
          Уменьшите количество долей или увеличьте стоимость актива.
        </p>
      )}
    </div>
  );
};
