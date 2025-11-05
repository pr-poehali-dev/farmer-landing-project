import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Asset, FARMER_API } from './proposal-types';
import { ProposalTypeSelector } from './ProposalTypeSelector';
import { AssetDetailsForm } from './AssetDetailsForm';
import { SharePricingForm } from './SharePricingForm';
import { IncomeDetailsForm } from './IncomeDetailsForm';
import { ProductDetailsForm } from './ProductDetailsForm';
import { PatronageDetailsForm } from './PatronageDetailsForm';

interface Props {
  userId: string;
  onSuccess: () => void;
}

const MIN_SHARE_PRICE = 5000;

const ProposalForm = ({ userId, onSuccess }: Props) => {
  const [proposalType, setProposalType] = useState<'income' | 'products' | 'patronage'>('income');
  const [assetType, setAssetType] = useState<'animal' | 'crop' | 'beehive'>('animal');
  const [assetName, setAssetName] = useState<string>('');
  const [assetCount, setAssetCount] = useState<string>('');
  const [assetDetails, setAssetDetails] = useState<string>('');
  const [shares, setShares] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [expectedProduct, setExpectedProduct] = useState<string>('');
  const [updateFrequency, setUpdateFrequency] = useState<string>('weekly');
  const [submitting, setSubmitting] = useState(false);

  const [revenuePeriod, setRevenuePeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [revenueAmount, setRevenueAmount] = useState<string>('');
  const [revenueDescription, setRevenueDescription] = useState<string>('');
  const [maintenanceCost, setMaintenanceCost] = useState<string>('');
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [payoutPeriod, setPayoutPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [payoutDuration, setPayoutDuration] = useState<string>('');
  const [lastYearYield, setLastYearYield] = useState<string>('');
  const [totalAssetValue, setTotalAssetValue] = useState<string>('');
  const [livestockData, setLivestockData] = useState<{ type: string; breed: string; direction: string }>({ type: '', breed: '', direction: '' });
  const [cropData, setCropData] = useState<{ type: string; variety: string; purpose: string }>({ type: '', variety: '', purpose: '' });

  const calculateSharePrice = () => {
    const totalValue = parseFloat(totalAssetValue);
    const sharesNum = parseInt(shares);
    if (!totalValue || !sharesNum || sharesNum < 1) return 0;
    return Math.floor(totalValue / sharesNum);
  };

  const calculatedSharePrice = calculateSharePrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assetName.trim()) {
      toast.error('Укажите название актива');
      return;
    }

    const sharesNum = parseInt(shares);
    const countNum = parseInt(assetCount) || 0;

    if (calculatedSharePrice < MIN_SHARE_PRICE) {
      toast.error(`Минимальная цена доли: ${MIN_SHARE_PRICE} руб.`);
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

    if (proposalType === 'income') {
      if (!revenueAmount || parseFloat(revenueAmount) <= 0) {
        toast.error('Укажите сумму дохода');
        return;
      }
      if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
        toast.error('Укажите сумму выплаты инвестору');
        return;
      }
      if (!payoutDuration || parseInt(payoutDuration) <= 0) {
        toast.error('Укажите срок выплат');
        return;
      }
    }

    setSubmitting(true);

    const asset: Asset = {
      id: Date.now().toString(),
      type: assetType,
      name: assetName,
      count: countNum,
      details: assetDetails,
      investment_types: [proposalType],
      livestock_type: assetType === 'animal' ? livestockData.type : undefined,
      livestock_breed: assetType === 'animal' ? livestockData.breed : undefined,
      livestock_direction: assetType === 'animal' ? livestockData.direction : undefined,
      crop_type: assetType === 'crop' ? cropData.type : undefined,
      crop_variety: assetType === 'crop' ? cropData.variety : undefined,
      crop_purpose: assetType === 'crop' ? cropData.purpose : undefined
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
          price: calculatedSharePrice,
          shares: sharesNum,
          description: description.trim(),
          expected_product: proposalType === 'products' ? expectedProduct.trim() : undefined,
          update_frequency: proposalType === 'patronage' ? updateFrequency : undefined,
          income_details: proposalType === 'income' ? {
            revenue_period: revenuePeriod,
            revenue_amount: parseFloat(revenueAmount),
            revenue_description: revenueDescription.trim(),
            maintenance_cost: parseFloat(maintenanceCost) || 0,
            payout_amount: parseFloat(payoutAmount),
            payout_period: payoutPeriod,
            payout_duration: parseInt(payoutDuration),
            last_year_yield: lastYearYield.trim() || undefined
          } : undefined
        })
      });

      if (response.ok) {
        toast.success('Предложение создано! +30 баллов 🎉');
        setAssetName('');
        setAssetCount('');
        setAssetDetails('');
        setShares('');
        setDescription('');
        setExpectedProduct('');
        setUpdateFrequency('weekly');
        setRevenueAmount('');
        setRevenueDescription('');
        setMaintenanceCost('');
        setPayoutAmount('');
        setPayoutDuration('');
        setLastYearYield('');
        setTotalAssetValue('');
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
        <ProposalTypeSelector value={proposalType} onChange={setProposalType} />

        <AssetDetailsForm
          assetType={assetType}
          assetName={assetName}
          assetCount={assetCount}
          assetDetails={assetDetails}
          onAssetTypeChange={setAssetType}
          onAssetNameChange={setAssetName}
          onAssetCountChange={setAssetCount}
          onAssetDetailsChange={setAssetDetails}
          onLivestockDataChange={setLivestockData}
          onCropDataChange={setCropData}
        />

        <SharePricingForm
          totalAssetValue={totalAssetValue}
          shares={shares}
          onTotalAssetValueChange={setTotalAssetValue}
          onSharesChange={setShares}
        />

        {proposalType === 'income' && (
          <IncomeDetailsForm
            revenuePeriod={revenuePeriod}
            revenueAmount={revenueAmount}
            revenueDescription={revenueDescription}
            maintenanceCost={maintenanceCost}
            payoutAmount={payoutAmount}
            payoutPeriod={payoutPeriod}
            payoutDuration={payoutDuration}
            lastYearYield={lastYearYield}
            onRevenuePeriodChange={setRevenuePeriod}
            onRevenueAmountChange={setRevenueAmount}
            onRevenueDescriptionChange={setRevenueDescription}
            onMaintenanceCostChange={setMaintenanceCost}
            onPayoutAmountChange={setPayoutAmount}
            onPayoutPeriodChange={setPayoutPeriod}
            onPayoutDurationChange={setPayoutDuration}
            onLastYearYieldChange={setLastYearYield}
          />
        )}

        {proposalType === 'products' && (
          <ProductDetailsForm
            expectedProduct={expectedProduct}
            onExpectedProductChange={setExpectedProduct}
          />
        )}

        {proposalType === 'patronage' && (
          <PatronageDetailsForm
            updateFrequency={updateFrequency}
            onUpdateFrequencyChange={setUpdateFrequency}
          />
        )}

        <div>
          <Label htmlFor="description">Описание предложения *</Label>
          <Textarea
            id="description"
            placeholder="Расскажите подробнее о вашем предложении..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={submitting}
        >
          {submitting ? 'Создаём...' : 'Создать предложение'}
        </Button>
      </form>
    </Card>
  );
};

export default ProposalForm;