import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Asset {
  id: string;
  type: 'animal' | 'crop' | 'beehive';
  name: string;
  count: number;
  direction?: string;
  hectares?: number;
  details: string;
  investment_types?: string[];
}

interface Proposal {
  id: number;
  type: 'income' | 'product' | 'patronage';
  asset: Asset;
  price: number;
  shares: number;
  description: string;
  expected_product?: string;
  update_frequency?: string;
  status: string;
  created_at: string;
}

interface Props {
  assets: Asset[];
  userId: string;
  onProposalCreated: () => void;
}

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

const PROPOSAL_TYPES = [
  { 
    value: 'income', 
    label: 'Доход', 
    icon: 'DollarSign',
    description: 'Инвестор получает пассивный доход от производства',
    hint: 'Дай инвесторам долю в росте — пусть они почувствуют энергию твоих полей'
  },
  { 
    value: 'product', 
    label: 'Продукт', 
    icon: 'Package',
    description: 'Инвестор получает долю физического продукта',
    hint: 'Поделись урожаем — пусть инвесторы получат настоящее, что питает здоровье'
  },
  { 
    value: 'patronage', 
    label: 'Патронаж', 
    icon: 'Eye',
    description: 'Инвестор становится хранителем и наблюдает за ростом',
    hint: 'Сделай инвестора хранителем — пусть он следит за таинством роста через экран'
  }
];

const UPDATE_FREQUENCIES = [
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'biweekly', label: 'Раз в 2 недели' },
  { value: 'monthly', label: 'Ежемесячно' }
];

const InvestmentProposals = ({ assets, userId, onProposalCreated }: Props) => {
  const [proposalType, setProposalType] = useState<'income' | 'product' | 'patronage'>('income');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [shares, setShares] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [expectedProduct, setExpectedProduct] = useState<string>('');
  const [updateFrequency, setUpdateFrequency] = useState<string>('weekly');
  const [submitting, setSubmitting] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedAsset = assets.find(a => a.id === selectedAssetId);

  const getMinPrice = () => {
    switch (proposalType) {
      case 'income': return 5000;
      case 'product': return 3000;
      case 'patronage': return 1000;
      default: return 1000;
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FARMER_API}?action=get_proposals`, {
        headers: { 'X-User-Id': userId }
      });
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Ошибка загрузки предложений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAsset) {
      toast.error('Выберите актив из диагностики');
      return;
    }

    const priceNum = parseFloat(price);
    const sharesNum = parseInt(shares);
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

    if (proposalType === 'product' && !expectedProduct.trim()) {
      toast.error('Укажите ожидаемый продукт');
      return;
    }

    setSubmitting(true);

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
          asset: selectedAsset,
          price: priceNum,
          shares: sharesNum,
          description: description.trim(),
          expected_product: proposalType === 'product' ? expectedProduct.trim() : undefined,
          update_frequency: proposalType === 'patronage' ? updateFrequency : undefined
        })
      });

      if (response.ok) {
        toast.success('Предложение создано! +30 баллов 🎉');
        setSelectedAssetId('');
        setPrice('');
        setShares('');
        setDescription('');
        setExpectedProduct('');
        setUpdateFrequency('weekly');
        onProposalCreated();
        loadProposals();
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

  const handleDelete = async (proposalId: number) => {
    if (!confirm('Удалить это предложение?')) return;

    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'delete_proposal',
          proposal_id: proposalId
        })
      });

      if (response.ok) {
        toast.success('Предложение удалено');
        loadProposals();
      } else {
        toast.error('Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  if (assets.length === 0) {
    return (
      <Card className="p-8 bg-orange-50 border-orange-200">
        <div className="flex items-start gap-3">
          <Icon name="AlertCircle" className="text-orange-600" size={24} />
          <div>
            <h3 className="font-bold text-orange-900 mb-1">Сначала заполни диагностику!</h3>
            <p className="text-sm text-orange-700">
              Чтобы создавать предложения, нужно добавить активы в разделе "Диагностика"
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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

          <div className="space-y-2">
            <Label htmlFor="asset">Выбери актив из диагностики</Label>
            <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
              <SelectTrigger>
                <SelectValue placeholder="Выбери актив..." />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    <div className="flex items-center gap-2">
                      <Icon 
                        name={asset.type === 'crop' ? 'Wheat' : asset.type === 'animal' ? 'Beef' : 'Flower2'} 
                        size={16} 
                      />
                      <span>
                        {asset.name} 
                        {asset.count > 0 && ` (${asset.count} ${asset.type === 'crop' ? 'га' : asset.type === 'beehive' ? 'ульев' : 'гол.'})`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAsset && (
              <p className="text-xs text-gray-500">{selectedAsset.details}</p>
            )}
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

          {proposalType === 'product' && (
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
            <Label htmlFor="description">Описание предложения</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                proposalType === 'income' 
                  ? 'Инвестируй в этот гектар сои — получи доход от урожая, полного энергии'
                  : proposalType === 'product'
                  ? 'Вложи в эту кукурузу — получи урожай, полный солнечной энергии'
                  : 'Стань хранителем этого рапса — ощущай рост через экран'
              }
              rows={4}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={submitting || !selectedAsset}
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Мои предложения</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={loadProposals}
            disabled={loading}
          >
            <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {loading ? (
          <Card className="p-8">
            <div className="flex justify-center">
              <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
            </div>
          </Card>
        ) : proposals.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <Icon name="Package" size={48} className="mx-auto mb-3 opacity-50" />
              <p>Пока нет созданных предложений</p>
              <p className="text-sm mt-1">Создайте первое предложение выше</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {proposals.map(proposal => (
              <Card key={proposal.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon 
                        name={
                          proposal.type === 'income' ? 'DollarSign' :
                          proposal.type === 'product' ? 'Package' : 'Eye'
                        } 
                        size={20} 
                        className="text-green-600"
                      />
                      <span className="font-semibold">
                        {proposal.type === 'income' ? 'Доход' : 
                         proposal.type === 'product' ? 'Продукт' : 'Патронаж'}
                      </span>
                      <span className="text-sm px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {proposal.status === 'active' ? 'Активно' : 'Черновик'}
                      </span>
                    </div>
                    <h4 className="font-bold mb-1">{proposal.asset?.name || 'Актив'}</h4>
                    <p className="text-sm text-gray-600 mb-2">{proposal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>💰 {proposal.price.toLocaleString()} руб.</span>
                      <span>📊 {proposal.shares} долей</span>
                      {proposal.expected_product && <span>📦 {proposal.expected_product}</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(proposal.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Icon name="Trash2" size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentProposals;
