import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Props {
  requests: any[];
}

export default function MarketplaceRequestsTab({ requests }: Props) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Icon name="MessageSquare" size={20} className="text-blue-600" />
          Мои заявки на товары
        </h3>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">У вас пока нет заявок</p>
            <p className="text-sm text-gray-400 mt-1">Выберите товар и отправьте заявку продавцу</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request, idx) => (
              <Card key={idx} className="p-4 bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Package" size={16} className="text-blue-600" />
                      <h4 className="font-semibold">{request.product_name}</h4>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon name="Store" size={14} />
                        <span>Продавец: {request.seller_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={14} />
                        <span>{request.farmer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" size={14} />
                        <span>{request.farmer_phone}</span>
                      </div>
                      {request.message && (
                        <div className="flex items-start gap-2 mt-2">
                          <Icon name="MessageSquare" size={14} className="mt-0.5" />
                          <span className="text-xs">{request.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(request.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
