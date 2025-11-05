import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const SELLER_API = 'https://functions.poehali.dev/cc24321a-77b4-44ce-9ae2-7fb7efee6660';

export default function ProductRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await fetch(`${SELLER_API}?action=get_product_requests`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      toast.error('Ошибка загрузки заявок');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="MessageSquare" className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-bold">Заявки на товары</h2>
            <p className="text-sm text-gray-600">Фермеры, заинтересованные в ваших товарах</p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Пока нет заявок на ваши товары</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        <Icon name="Package" size={12} />
                        {request.product_name}
                      </span>
                      {request.status === 'new' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-semibold">
                          <Icon name="Bell" size={12} />
                          Новая
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{request.created_at}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={16} className="text-blue-600" />
                    <span className="font-semibold">{request.farmer_name}</span>
                  </div>

                  {request.farmer_phone && (
                    <div className="flex items-center gap-2">
                      <Icon name="Phone" size={16} className="text-blue-600" />
                      <a href={`tel:${request.farmer_phone}`} className="hover:underline">
                        {request.farmer_phone}
                      </a>
                    </div>
                  )}

                  {request.farmer_region && (
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-blue-600" />
                      <span className="text-sm text-gray-600">{request.farmer_region}</span>
                    </div>
                  )}

                  {request.message && (
                    <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <Icon name="MessageCircle" size={14} className="inline mr-1" />
                        <strong>Сообщение:</strong> {request.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(`tel:${request.farmer_phone}`, '_self')}
                  >
                    <Icon name="Phone" size={14} className="mr-1" />
                    Позвонить
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(request.farmer_phone);
                      toast.success('Телефон скопирован');
                    }}
                  >
                    <Icon name="Copy" size={14} className="mr-1" />
                    Скопировать телефон
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
