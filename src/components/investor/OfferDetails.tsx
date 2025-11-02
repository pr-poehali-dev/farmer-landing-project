import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Offer } from '@/types/offer';

interface OfferDetailsProps {
  offer: Offer;
  onInvest: () => void;
  onBack: () => void;
}

const OfferDetails = ({ offer, onInvest, onBack }: OfferDetailsProps) => {
  const soldShares = offer.total_shares - offer.available_shares;
  const soldPercentage = (soldShares / offer.total_shares) * 100;
  const availabilityColor = 
    offer.available_shares > offer.total_shares * 0.5 ? 'bg-green-100 text-green-800' :
    offer.available_shares > offer.total_shares * 0.2 ? 'bg-orange-100 text-orange-800' :
    'bg-red-100 text-red-800';

  const parseSocials = (socials?: string) => {
    if (!socials) return [];
    try {
      return socials.split(',').map(s => s.trim()).filter(Boolean);
    } catch {
      return [];
    }
  };

  const socialLinks = parseSocials(offer.socials);

  const getSocialIcon = (link: string) => {
    if (link.includes('vk.com')) return 'MessageCircle';
    if (link.includes('t.me') || link.includes('telegram')) return 'Send';
    if (link.includes('instagram')) return 'Camera';
    if (link.includes('youtube')) return 'Video';
    return 'ExternalLink';
  };

  const calculateIncomeForShares = (shares: number) => {
    if (!offer.expected_monthly_income) return 0;
    return (offer.expected_monthly_income / offer.total_shares) * shares;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button onClick={onBack} variant="ghost" size="sm">
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад к списку
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {offer.title}
            </h1>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="flex items-center gap-1">
                <Icon name="Store" size={16} className="text-farmer-green" />
                <span className="font-medium">{offer.farm_name}</span>
              </div>
              {offer.farmer_name && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Icon name="User" size={16} className="text-gray-400" />
                    <span>{offer.farmer_name}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <Badge className={availabilityColor}>
            {offer.available_shares} долей доступно
          </Badge>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <Icon name="MapPin" size={18} className="text-farmer-orange" />
            <span className="text-lg">{offer.region}, {offer.city}</span>
          </div>
          
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <Icon name="Link" size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600 mr-2">Соцсети:</span>
              <div className="flex gap-2">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.startsWith('http') ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-farmer-green hover:text-farmer-green-dark transition-colors"
                  >
                    <Icon name={getSocialIcon(link)} size={18} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
          <p className="text-gray-700 whitespace-pre-line">{offer.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="CircleDollarSign" size={18} className="text-farmer-green" />
              Экономика проекта
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Общая сумма проекта:</span>
                <span className="font-bold text-gray-900">
                  {offer.total_amount.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Цена одной доли:</span>
                <span className="font-bold text-farmer-green">
                  {offer.share_price.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Всего долей:</span>
                <span className="font-medium">{offer.total_shares}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Доступно долей:</span>
                <span className="font-medium text-farmer-orange">
                  {offer.available_shares}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Минимум долей:</span>
                <span className="font-medium">{offer.min_shares}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="TrendingUp" size={18} className="text-green-600" />
              Ожидаемый доход
            </h3>
            {offer.expected_monthly_income && offer.expected_monthly_income > 0 ? (
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {offer.expected_monthly_income.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-xs text-gray-600">в месяц на весь проект</div>
                </div>
                
                <div className="pt-3 border-t border-green-200">
                  <p className="text-xs text-gray-700 mb-2">Примерный доход на:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{offer.min_shares} долю:</span>
                      <span className="font-medium text-green-700">
                        {calculateIncomeForShares(offer.min_shares).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽/мес
                      </span>
                    </div>
                    {offer.min_shares * 2 <= offer.available_shares && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{offer.min_shares * 2} доли:</span>
                        <span className="font-medium text-green-700">
                          {calculateIncomeForShares(offer.min_shares * 2).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽/мес
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">
                Доход будет зависеть от продаж и будет распределяться пропорционально долям
              </p>
            )}
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Прогресс продаж</h3>
          <Progress value={soldPercentage} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Продано {soldShares} из {offer.total_shares} долей</span>
            <span className="font-medium">{soldPercentage.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onInvest}
            disabled={offer.available_shares === 0}
            className="bg-farmer-green hover:bg-farmer-green-dark flex-1"
            size="lg"
          >
            <Icon name="TrendingUp" size={18} className="mr-2" />
            {offer.available_shares === 0 ? 'Все доли проданы' : 'Инвестировать'}
          </Button>
          {offer.available_shares > 0 && (
            <div className="text-sm text-gray-600">
              <div>Мин. сумма:</div>
              <div className="font-bold text-farmer-green">
                {(offer.share_price * offer.min_shares).toLocaleString('ru-RU')} ₽
              </div>
            </div>
          )}
        </div>

        {offer.available_shares > 0 && offer.available_shares < offer.total_shares * 0.2 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              Осталось мало долей! Успей стать совладельцем проекта.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OfferDetails;
