import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Asset, FARMER_API, PROPOSAL_TYPES, UPDATE_FREQUENCIES } from './proposal-types';

interface Props {
  userId: string;
  onSuccess: () => void;
}

const ProposalForm = ({ userId, onSuccess }: Props) => {
  const [proposalType, setProposalType] = useState<'income' | 'products' | 'patronage'>('income');
  const [assetType, setAssetType] = useState<'animal' | 'crop' | 'beehive'>('animal');
  const [assetName, setAssetName] = useState<string>('');
  const [assetCount, setAssetCount] = useState<string>('');
  const [assetDetails, setAssetDetails] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [shares, setShares] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [expectedProduct, setExpectedProduct] = useState<string>('');
  const [updateFrequency, setUpdateFrequency] = useState<string>('weekly');
  const [submitting, setSubmitting] = useState(false);

  const getMinPrice = () => {
    switch (proposalType) {
      case 'income': return 5000;
      case 'products': return 3000;
      case 'patronage': return 1000;
      default: return 1000;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assetName.trim()) {
      toast.error('Укажите название актива');
      return;
    }

    const priceNum = parseFloat(price);
    const sharesNum = parseInt(shares);
    const countNum = parseInt(assetCount) || 0;
    const minPrice = getMinPrice();

    if (priceNum < minPrice) {
      toast.error(`Минимальная цена для этого типа: ${minPrice} руб.`);
      return;
    }

    if (sharesNum < 1) {
      toast.error('Количество долей должно быть больше 0');
      return;
    }

    if (!description.trim()) {
      toast.error('Добавьте описание предложения');
      return;
    }

    if (proposalType === 'products' && !expectedProduct.trim()) {
      toast.error('Укажите ожидаемый продукт');
      return;
    }

    setSubmitting(true);

    const asset: Asset = {
      id: Date.now().toString(),
      type: assetType,
      name: assetName,
      count: countNum,
      details: assetDetails,
      investment_types: [proposalType]
    };

    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'create_proposal',
          type: proposalType,
          asset,
          price: priceNum,
          shares: sharesNum,
          description: description.trim(),
          expected_product: proposalType === 'products' ? expectedProduct.trim() : undefined,
          update_frequency: proposalType === 'patronage' ? updateFrequency : undefined
        })
      });

      if (response.ok) {
        toast.success('Предложение создано! +30 баллов 🎉');
        setAssetName('');
        setAssetCount('');
        setAssetDetails('');
        setPrice('');
        setShares('');
        setDescription('');
        setExpectedProduct('');
        setUpdateFrequency('weekly');
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка создания предложения');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div className="flex items-start gap-3 mb-4">
        <Icon name="Sparkles" className="text-green-600" size={24} />
        <div>
          <h2 className="text-lg font-bold text-green-900">Создай предложение для инвесторов</h2>
          <p className="text-sm text-green-700">
            Привлеки хранителей к таинству твоей фермы — выбери тип инвестиции
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Тип предложения</Label>
          <RadioGroup value={proposalType} onValueChange={(v: any) => setProposalType(v)}>
            {PROPOSAL_TYPES.map(type => (
              <Card 
                key={type.value}
                className={`p-4 cursor-pointer transition-all ${
                  proposalType === type.value 
                    ? 'border-2 border-green-600 bg-green-50' 
                    : 'border hover:border-green-300'
                }`}
                onClick={() => setProposalType(type.value as any)}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={type.icon as any} size={20} className="text-green-600" />
                      <Label htmlFor={type.value} className="font-bold cursor-pointer">
                        {type.label}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                    <p className="text-xs text-green-700 italic">{type.hint}</p>
                  </div>
                </div>
              </Card>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Тип актива</Label>
            <RadioGroup value={assetType} onValueChange={(v: any) => setAssetType(v)}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="animal" id="animal" />
                  <Label htmlFor="animal" className="cursor-pointer flex items-center gap-1">
                    <Icon name="Beef" size={16} />
                    Животноводство
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="crop" id="crop" />
                  <Label htmlFor="crop" className="cursor-pointer flex items-center gap-1">
                    <Icon name="Wheat" size={16} />
                    Растениеводство
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beehive" id="beehive" />
                  <Label htmlFor="beehive" className="cursor-pointer flex items-center gap-1">
                    <Icon name="Flower2" size={16} />
                    Пчеловодство
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetName">Название актива *</Label>
              <Input
                id="assetName"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder={assetType === 'animal' ? 'Коровы' : assetType === 'crop' ? 'Пшеница' : 'Пчелы'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetCount">
                Количество ({assetType === 'crop' ? 'га' : assetType === 'beehive' ? 'ульев' : 'голов'})
              </Label>
              <Input
                id="assetCount"
                type="number"
                min="0"
                value={assetCount}
                onChange={(e) => setAssetCount(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetDetails">Детали актива (порода, сорт, возраст...)</Label>
            <Input
              id="assetDetails"
              value={assetDetails}
              onChange={(e) => setAssetDetails(e.target.value)}
              placeholder={assetType === 'animal' ? 'Например: Голштинская порода' : 'Например: Озимая пшеница'}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">
              Цена доли (мин. {getMinPrice()} руб.
              {proposalType === 'patronage' && '/мес'})
            </Label>
            <Input
              id="price"
              type="number"
              min={getMinPrice()}
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={`${getMinPrice()}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shares">Количество долей</Label>
            <Input
              id="shares"
              type="number"
              min="1"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="10"
              required
            />
          </div>
        </div>

        {proposalType === 'products' && (
          <div className="space-y-2">
            <Label htmlFor="expected_product">Ожидаемый продукт на долю</Label>
            <Input
              id="expected_product"
              value={expectedProduct}
              onChange={(e) => setExpectedProduct(e.target.value)}
              placeholder="Например: 10 кг свежей свеклы"
              required
            />
          </div>
        )}

        {proposalType === 'patronage' && (
          <div className="space-y-2">
            <Label htmlFor="frequency">Частота обновлений</Label>
            <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UPDATE_FREQUENCIES.map(freq => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Описание предложения *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опиши, что получит инвестор, почему стоит вложиться именно в это..."
            rows={4}
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={submitting || !assetName.trim()}
          className="w-full bg-farmer-green hover:bg-green-700"
        >
          {submitting ? (
            <>
              <Icon name="Loader2" className="animate-spin mr-2" size={18} />
              Создаю...
            </>
          ) : (
            <>
              <Icon name="Plus" size={18} className="mr-2" />
              Опубликовать предложение (+30 баллов)
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default ProposalForm;