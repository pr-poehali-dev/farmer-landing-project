import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Offer } from '@/types/offer';

interface OfferCardProps {
  offer: Offer;
  onDetails: (offer: Offer) => void;
}

const OfferCard = ({ offer, onDetails }: OfferCardProps) => {
  const soldPercentage = ((offer.total_shares - offer.available_shares) / offer.total_shares) * 100;
  const availabilityColor = 
    offer.available_shares > offer.total_shares * 0.5 ? 'text-green-600' :
    offer.available_shares > offer.total_shares * 0.2 ? 'text-orange-600' :
    'text-red-600';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onDetails(offer)}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 text-gray-900">
              {offer.title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Icon name="Store" size={14} className="text-farmer-green" />
              {offer.farm_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Icon name="MapPin" size={14} className="text-gray-400" />
          <span>{offer.region}, {offer.city}</span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {offer.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Продано долей</span>
            <span className={availabilityColor}>
              Доступно: {offer.available_shares}
            </span>
          </div>
          <Progress value={soldPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{offer.total_shares - offer.available_shares} из {offer.total_shares}</span>
            <span>{soldPercentage.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex items-end justify-between pt-3 border-t">
          <div>
            <div className="text-2xl font-bold text-farmer-green">
              {offer.share_price.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-xs text-gray-500">
              цена за долю (мин. {offer.min_shares})
            </div>
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDetails(offer);
            }}
            className="bg-farmer-green hover:bg-farmer-green-dark"
            size="sm"
          >
            <Icon name="ArrowRight" size={16} className="mr-1" />
            Подробнее
          </Button>
        </div>

        {offer.expected_monthly_income && offer.expected_monthly_income > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded-md">
            <p className="text-xs text-green-800">
              <Icon name="TrendingUp" size={12} className="inline mr-1" />
              Ожидаемый доход: {offer.expected_monthly_income.toLocaleString('ru-RU')} ₽/мес
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OfferCard;
