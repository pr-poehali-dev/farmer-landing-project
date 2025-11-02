import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

interface OfferFormProps {
  userId: string;
  onSuccess: () => void;
}

const OfferForm = ({ userId, onSuccess }: OfferFormProps) => {
  const [farmName, setFarmName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState<'animal' | 'crop' | 'equipment'>('animal');
  const [assetName, setAssetName] = useState('');
  const [assetCount, setAssetCount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [sharePrice, setSharePrice] = useState('');
  const [minShares, setMinShares] = useState('1');
  const [expectedMonthlyIncome, setExpectedMonthlyIncome] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [vkLink, setVkLink] = useState('');
  const [tgLink, setTgLink] = useState('');
  const [publish, setPublish] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [totalShares, setTotalShares] = useState<number | null>(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const amount = parseFloat(totalAmount);
    const price = parseFloat(sharePrice);
    
    if (amount > 0 && price > 0) {
      const shares = Math.round(amount / price);
      const remainder = Math.abs(amount - (shares * price));
      
      setTotalShares(shares);
      
      if (remainder > 0.01) {
        setValidationError('Сумма не делится на целое число долей. Остаток: ' + remainder.toFixed(2) + ' ₽');
      } else {
        setValidationError('');
      }
    } else {
      setTotalShares(null);
      setValidationError('');
    }
  }, [totalAmount, sharePrice]);

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^\d]/g, '');
    return num ? parseInt(num).toLocaleString('ru-RU') : '';
  };

  const parseCurrency = (value: string) => {
    return value.replace(/[^\d]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!farmName.trim()) {
      toast.error('Укажите название фермы');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Укажите название предложения');
      return;
    }
    
    if (!description.trim()) {
      toast.error('Добавьте описание');
      return;
    }
    
    const amountNum = parseFloat(parseCurrency(totalAmount));
    const priceNum = parseFloat(parseCurrency(sharePrice));
    
    if (amountNum <= 0 || priceNum <= 0) {
      toast.error('Укажите корректные суммы');
      return;
    }
    
    if (validationError) {
      toast.error('Исправьте ошибки валидации');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const asset = {
        type: assetType,
        name: assetName || 'Актив',
        count: parseInt(assetCount) || 1
      };
      
      const socials: any = {};
      if (vkLink) socials.vk = vkLink;
      if (tgLink) socials.tg = tgLink;
      
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'create_offer',
          farm_name: farmName,
          title,
          description,
          asset,
          total_amount: amountNum,
          share_price: priceNum,
          min_shares: parseInt(minShares) || 1,
          expected_monthly_income: expectedMonthlyIncome ? parseFloat(parseCurrency(expectedMonthlyIncome)) : null,
          region,
          city,
          socials,
          publish
        })
      });
      
      if (response.ok) {
        toast.success('Предложение создано!');
        
        setFarmName('');
        setTitle('');
        setDescription('');
        setAssetName('');
        setAssetCount('');
        setTotalAmount('');
        setSharePrice('');
        setMinShares('1');
        setExpectedMonthlyIncome('');
        setRegion('');
        setCity('');
        setVkLink('');
        setTgLink('');
        
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
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Plus" className="text-farmer-green" size={24} />
        <h3 className="text-xl font-bold text-gray-900">Создать предложение</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="farmName">Название фермы *</Label>
            <Input
              id="farmName"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Моя ферма"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Название предложения *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Корова на мясо"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Подробное описание вашего предложения..."
            rows={4}
            required
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Package" size={18} />
            Информация об активе
          </h4>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetType">Тип актива</Label>
              <select
                id="assetType"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="animal">Животное</option>
                <option value="crop">Растение/Культура</option>
                <option value="equipment">Оборудование</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assetName">Название актива</Label>
              <Input
                id="assetName"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="Корова, Пшеница..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assetCount">Количество</Label>
              <Input
                id="assetCount"
                type="number"
                min="1"
                value={assetCount}
                onChange={(e) => setAssetCount(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="DollarSign" size={18} />
            Финансовые условия
          </h4>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">
                Общая сумма * 
                <span className="text-xs text-gray-500 ml-1">(₽)</span>
              </Label>
              <div className="relative">
                <Input
                  id="totalAmount"
                  value={formatCurrency(totalAmount)}
                  onChange={(e) => setTotalAmount(parseCurrency(e.target.value))}
                  placeholder="150 000"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₽</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sharePrice">
                Цена доли *
                <span className="text-xs text-gray-500 ml-1">(₽)</span>
              </Label>
              <div className="relative">
                <Input
                  id="sharePrice"
                  value={formatCurrency(sharePrice)}
                  onChange={(e) => setSharePrice(parseCurrency(e.target.value))}
                  placeholder="5 000"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₽</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minShares">Минимум долей</Label>
              <Input
                id="minShares"
                type="number"
                min="1"
                value={minShares}
                onChange={(e) => setMinShares(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>

          {totalShares !== null && (
            <Card className="p-4 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5 border-farmer-green/20">
              <div className="flex items-center gap-2">
                <Icon name="Info" size={18} className="text-farmer-green" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Количество долей: {totalShares}
                  </p>
                  {validationError && (
                    <p className="text-sm text-red-600 mt-1">{validationError}</p>
                  )}
                  {!validationError && (
                    <p className="text-sm text-gray-600">
                      {formatCurrency(totalAmount)} ₽ ÷ {formatCurrency(sharePrice)} ₽ = {totalShares} долей
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-2 mt-4">
            <Label htmlFor="expectedIncome">
              Ожидаемый доход в месяц
              <span className="text-xs text-gray-500 ml-1">(₽, опционально)</span>
            </Label>
            <div className="relative">
              <Input
                id="expectedIncome"
                value={formatCurrency(expectedMonthlyIncome)}
                onChange={(e) => setExpectedMonthlyIncome(parseCurrency(e.target.value))}
                placeholder="12 000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₽</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="MapPin" size={18} />
            Местоположение и контакты
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="region">Регион</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Московская область"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Город</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Подольск"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vk">ВКонтакте</Label>
              <Input
                id="vk"
                type="url"
                value={vkLink}
                onChange={(e) => setVkLink(e.target.value)}
                placeholder="https://vk.com/yourpage"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tg">Telegram</Label>
              <Input
                id="tg"
                type="url"
                value={tgLink}
                onChange={(e) => setTgLink(e.target.value)}
                placeholder="https://t.me/yourpage"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-3">
            <Switch
              id="publish"
              checked={publish}
              onCheckedChange={setPublish}
            />
            <Label htmlFor="publish" className="cursor-pointer">
              {publish ? 'Опубликовать сразу' : 'Сохранить как черновик'}
            </Label>
          </div>

          <Button
            type="submit"
            disabled={submitting || !!validationError}
            className="bg-farmer-green hover:bg-farmer-green-dark"
          >
            {submitting ? (
              <>
                <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                Создание...
              </>
            ) : (
              <>
                <Icon name="Check" className="mr-2" size={18} />
                Создать предложение
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OfferForm;
