import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import OfferRequestsTable from './OfferRequestsTable';

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

interface Offer {
  id: number;
  farm_name: string;
  title: string;
  total_amount: number;
  share_price: number;
  total_shares: number;
  available_shares: number;
  expected_monthly_income: number | null;
  region: string;
  city: string;
  socials: any;
  status: string;
}

interface OffersListProps {
  userId: string;
  refreshTrigger?: number;
}

const OffersList = ({ userId, refreshTrigger }: OffersListProps) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  useEffect(() => {
    const savedOffers = localStorage.getItem(`offers_${userId}`);
    if (savedOffers) {
      try {
        setOffers(JSON.parse(savedOffers));
      } catch (e) {
        console.error('Ошибка восстановления офферов:', e);
      }
    }
    loadOffers();
  }, [refreshTrigger]);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FARMER_API}?action=get_offers`, {
        headers: { 'X-User-Id': userId }
      });
      const data = await response.json();
      const loadedOffers = data.offers || [];
      setOffers(loadedOffers);
      localStorage.setItem(`offers_${userId}`, JSON.stringify(loadedOffers));
    } catch (error) {
      toast.error('Ошибка загрузки предложений');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Опубликовано</Badge>;
      case 'draft':
        return <Badge className="bg-gray-400">Черновик</Badge>;
      case 'closed':
        return <Badge className="bg-red-500">Закрыто</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percent = (available / total) * 100;
    if (percent > 50) return 'text-green-600';
    if (percent > 20) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-farmer-green" size={48} />
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Icon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">У вас пока нет предложений</p>
        <p className="text-sm text-gray-400">Создайте первое предложение выше</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => {
        const isExpanded = expandedId === offer.id;
        const soldShares = offer.total_shares - offer.available_shares;
        const soldPercent = (soldShares / offer.total_shares) * 100;

        return (
          <Card key={offer.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
                    {getStatusBadge(offer.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    <Icon name="Home" size={14} className="inline mr-1" />
                    {offer.farm_name}
                    {offer.region && (
                      <>
                        {' • '}
                        <Icon name="MapPin" size={14} className="inline mr-1" />
                        {offer.region}
                        {offer.city && `, ${offer.city}`}
                      </>
                    )}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(isExpanded ? null : offer.id)}
                >
                  <Icon
                    name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                    size={20}
                  />
                </Button>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Общая сумма</p>
                  <p className="text-lg font-bold text-gray-900">
                    {offer.total_amount.toLocaleString('ru-RU')} ₽
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Цена доли</p>
                  <p className="text-lg font-bold text-gray-900">
                    {offer.share_price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Всего долей</p>
                  <p className="text-lg font-bold text-gray-900">
                    {offer.total_shares}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Доступно</p>
                  <p className={`text-lg font-bold ${getAvailabilityColor(offer.available_shares, offer.total_shares)}`}>
                    {offer.available_shares} / {offer.total_shares}
                  </p>
                </div>
              </div>

              {soldShares > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Продано долей</span>
                    <span className="font-semibold">{soldPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-farmer-green to-farmer-orange h-2 rounded-full transition-all"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {offer.expected_monthly_income && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Icon name="TrendingUp" size={16} className="text-farmer-green" />
                  <span>
                    Ожидаемый доход: {offer.expected_monthly_income.toLocaleString('ru-RU')} ₽/мес
                  </span>
                </div>
              )}

              {isExpanded && (
                <div className="border-t pt-4 mt-4 space-y-3">
                  {offer.socials && (Object.keys(offer.socials).length > 0) && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Контакты:</p>
                      <div className="flex gap-2">
                        {offer.socials.vk && (
                          <a
                            href={offer.socials.vk}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            <Icon name="ExternalLink" size={14} className="inline mr-1" />
                            ВКонтакте
                          </a>
                        )}
                        {offer.socials.tg && (
                          <a
                            href={offer.socials.tg}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            <Icon name="ExternalLink" size={14} className="inline mr-1" />
                            Telegram
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOfferId(offer.id);
                        setShowRequestsModal(true);
                      }}
                    >
                      <Icon name="Users" size={16} className="mr-2" />
                      Заявки на это предложение
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.info('Редактирование в разработке');
                      }}
                    >
                      <Icon name="Edit" size={16} className="mr-2" />
                      Редактировать
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      <Dialog open={showRequestsModal} onOpenChange={setShowRequestsModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Заявки на предложение</DialogTitle>
          </DialogHeader>
          <OfferRequestsTable userId={userId} offerId={selectedOfferId || undefined} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OffersList;