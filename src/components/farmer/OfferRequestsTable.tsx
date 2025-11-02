import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { OfferRequest } from '@/types/offer';
import { toast } from 'sonner';

interface OfferRequestsTableProps {
  userId: string;
  offerId?: number;
}

const FARMER_API = 'https://functions.poehali.dev/d4ed65bb-a05a-48e5-b2f9-78e2c3750ef5';

const OfferRequestsTable = ({ userId, offerId }: OfferRequestsTableProps) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<(OfferRequest & { 
    offer_title?: string; 
    offer_share_price?: number;
    total_amount?: number;
  })[]>([]);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, [offerId]);

  const loadRequests = async () => {
    try {
      const url = offerId 
        ? `${FARMER_API}?action=get_offer_requests&offer_id=${offerId}`
        : `${FARMER_API}?action=get_all_offer_requests`;
      
      const response = await fetch(url, {
        headers: { 'X-User-Id': userId }
      });
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      toast.error('Ошибка загрузки заявок');
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: number, action: 'approve' | 'reject') => {
    setProcessing(requestId);
    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'update_offer_request',
          request_id: requestId,
          new_status: action === 'approve' ? 'approved' : 'rejected'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(action === 'approve' ? 'Заявка одобрена!' : 'Заявка отклонена');
        loadRequests();
      } else {
        toast.error(data.error || 'Ошибка обновления заявки');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
      console.error('Error updating request:', error);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string; icon: string }> = {
      pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Ожидает', icon: 'Clock' },
      approved: { className: 'bg-green-100 text-green-800', label: 'Одобрена', icon: 'CheckCircle' },
      rejected: { className: 'bg-red-100 text-red-800', label: 'Отклонена', icon: 'XCircle' }
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge className={variant.className}>
        <Icon name={variant.icon as any} size={12} className="mr-1" />
        {variant.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Icon name="Loader2" className="animate-spin text-farmer-green" size={32} />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">
          {offerId ? 'Нет заявок на это предложение' : 'Пока нет заявок от инвесторов'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="User" size={16} className="text-gray-400" />
                <span className="font-medium text-gray-900">
                  {request.investor_name || `Инвестор #${request.investor_id}`}
                </span>
                {getStatusBadge(request.status)}
              </div>

              {request.offer_title && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Icon name="Package" size={14} className="text-farmer-orange" />
                  <span>{request.offer_title}</span>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Долей:</span>
                  <div className="font-bold text-farmer-green">
                    {request.shares_requested}
                  </div>
                </div>
                
                {request.offer_share_price && (
                  <>
                    <div>
                      <span className="text-gray-500">Цена доли:</span>
                      <div className="font-medium">
                        {request.offer_share_price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Сумма:</span>
                      <div className="font-bold text-gray-900">
                        {(request.shares_requested * request.offer_share_price).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <span className="text-gray-500">Дата:</span>
                  <div className="text-xs">
                    {request.created_at ? new Date(request.created_at).toLocaleDateString('ru-RU') : '-'}
                  </div>
                </div>
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAction(request.id!, 'approve')}
                  disabled={processing === request.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing === request.id ? (
                    <Icon name="Loader2" size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Icon name="Check" size={14} className="mr-1" />
                      Принять
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(request.id!, 'reject')}
                  disabled={processing === request.id}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Icon name="X" size={14} className="mr-1" />
                  Отклонить
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OfferRequestsTable;
