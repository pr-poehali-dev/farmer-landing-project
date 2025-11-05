import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface MyRequestsDialogProps {
  open: boolean;
  onClose: () => void;
  requests: any[];
  onCancelRequest: (requestId: string) => void;
  onPayRequest: (requestId: string, amount: number) => void;
}

const getTypeLabel = (type: string) => {
  switch(type) {
    case 'income': return 'Доход';
    case 'products': return 'Продукт';
    case 'patronage': return 'Патронаж';
    default: return type;
  }
};

export function MyRequestsDialog({ open, onClose, requests, onCancelRequest, onPayRequest }: MyRequestsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="FileText" className="text-farmer-green" />
            Мои заявки
          </DialogTitle>
        </DialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <Icon name="Info" className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-2">Как работает процесс:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>Вы оставляете заявку на предложение фермера</li>
                <li>Фермер получает уведомление и рассматривает заявку</li>
                <li>После одобрения вам нужно оплатить заявку</li>
                <li>После оплаты инвестиция появится в вашем портфеле</li>
              </ol>
            </div>
          </div>
        </div>
        
        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Icon name="Inbox" size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">У вас пока нет заявок</p>
            <p className="text-sm mt-2">Оставьте заявку на понравившееся предложение</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => {
              const status = request.status || 'pending';
              const statusText = status === 'pending' ? 'Ждем подтверждение' : 
                               status === 'approved' ? 'Одобрено - требуется оплата' :
                               status === 'paid' ? 'Оплачено' :
                               status === 'active' ? 'Активно' :
                               status === 'rejected' ? 'Отклонено' : 'Отменено';
              const statusColor = status === 'active' || status === 'paid' ? 'bg-green-100 text-green-700' :
                                status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700';
              
              return (
                <Card key={request.id} className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                          {statusText}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(request.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">
                        {request.proposal_description}
                      </p>
                      <p className="text-sm text-gray-600">
                        Фермер: {request.farmer_name}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Сумма: {parseFloat(request.amount).toLocaleString()} ₽</span>
                        {request.shares && request.shares > 0 && <span>Долей: {request.shares}</span>}
                        <span>Тип: {getTypeLabel(request.proposal_type)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onCancelRequest(request.id);
                            onClose();
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="X" size={16} className="mr-1" />
                          Отменить
                        </Button>
                      )}
                      {status === 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            onPayRequest(request.id, request.amount);
                          }}
                          className="bg-farmer-green hover:bg-farmer-green-dark text-white"
                        >
                          <Icon name="CreditCard" size={16} className="mr-1" />
                          Оплатить {request.amount} ₽
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
