import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Offer } from '@/types/offer';
import OfferCard from './OfferCard';
import OfferDetails from './OfferDetails';
import OfferRequestModal from './OfferRequestModal';
import { toast } from 'sonner';

interface OffersListProps {
  userId: number;
}

const OFFERS_API = 'https://functions.poehali.dev/d4ed65bb-a05a-48e5-b2f9-78e2c3750ef5';

const OffersList = ({ userId }: OffersListProps) => {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await fetch(`${OFFERS_API}?action=get_offers`, {
        headers: { 'X-User-Id': userId.toString() }
      });
      const data = await response.json();
      const publishedOffers = (data.offers || []).filter((o: Offer) => o.status === 'published');
      setOffers(publishedOffers);
    } catch (error) {
      toast.error('Ошибка загрузки офферов');
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowDetails(true);
  };

  const handleInvest = () => {
    setShowDetails(false);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (offerId: number, sharesRequested: number) => {
    try {
      const response = await fetch(OFFERS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'create_offer_request',
          offer_id: offerId,
          shares_requested: sharesRequested
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Заявка успешно отправлена! Фермер скоро с вами свяжется.');
        setShowRequestModal(false);
        setSelectedOffer(null);
        loadOffers();
      } else {
        toast.error(data.error || 'Ошибка отправки заявки');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
      console.error('Error submitting offer request:', error);
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedOffer(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-farmer-green" size={48} />
      </div>
    );
  }

  if (showDetails && selectedOffer) {
    return (
      <>
        <OfferDetails 
          offer={selectedOffer} 
          onInvest={handleInvest}
          onBack={handleBackToList}
        />
        <OfferRequestModal
          offer={selectedOffer}
          open={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleSubmitRequest}
        />
      </>
    );
  }

  return (
    <div>
      <Card className="p-4 mb-6 bg-gradient-to-r from-farmer-green/10 to-farmer-orange/10">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-farmer-green mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Инвестиции в фермерство</h3>
            <p className="text-sm text-gray-700">
              Здесь фермеры размещают офферы на долевое участие в своих проектах. 
              Выберите проект, изучите детали и станьте совладельцем фермерского бизнеса.
            </p>
          </div>
        </div>
      </Card>

      {offers.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Пока нет доступных офферов</p>
          <p className="text-sm text-gray-400 mt-2">
            Фермеры скоро разместят свои проекты для инвестирования
          </p>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Доступные проекты ({offers.length})
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
                onDetails={handleOfferClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OffersList;
