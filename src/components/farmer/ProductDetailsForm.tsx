import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  expectedProduct: string;
  onExpectedProductChange: (value: string) => void;
}

export const ProductDetailsForm = ({ expectedProduct, onExpectedProductChange }: Props) => {
  return (
    <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <h3 className="font-semibold text-amber-900">Детали продукта</h3>
      
      <div>
        <Label htmlFor="expectedProduct">Ожидаемый продукт *</Label>
        <Input
          id="expectedProduct"
          type="text"
          placeholder="Например: 100 кг мёда, 200 литров молока"
          value={expectedProduct}
          onChange={(e) => onExpectedProductChange(e.target.value)}
          required
        />
        <p className="text-xs text-amber-700 mt-1">
          Укажите, какой продукт и в каком количестве получит инвестор
        </p>
      </div>
    </div>
  );
};
