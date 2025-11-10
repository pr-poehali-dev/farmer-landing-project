import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface InvestorRequest {
  id: string;
  investor_id: string;
  investor_name: string;
  proposal_id: string;
  proposal_description: string;
  proposal_type: string;
  amount: number;
  status: string;
  date: string;
}

interface InvestorRequestsProps {
  userId: string;
}

const InvestorRequests = ({ userId }: InvestorRequestsProps) => {
  const [requests, setRequests] = useState<InvestorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'paid' | 'active' | 'all'>('pending');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminDialog, setShowAdminDialog] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const fetchRequests = async () => {
    try {
      const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';
      
      const response = await fetch(
        `${FARMER_API}?action=get_proposal_requests`,
        { 
          headers: { 
            'X-User-Id': userId,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки заявок');
      }
      
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
      toast.error('Не удалось загрузить заявки');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';
      
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'moderate_proposal_request',
          request_id: requestId,
          action_type: action
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка обработки заявки');
      }

      toast.success(action === 'approve' ? 'Заявка одобрена! Ожидаем оплату от инвестора' : 'Заявка отклонена');
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
            : req
        )
      );
    } catch (error) {
      console.error('Ошибка обработки заявки:', error);
      toast.error('Не удалось обработать заявку');
    }
  };

  const handleForceCancel = async (investmentId: string) => {
    if (!adminCode || adminCode.trim() === '') {
      toast.error('Введите код администратора');
      return;
    }

    try {
      const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';
      
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'force_cancel_investment',
          investment_id: investmentId,
          admin_code: adminCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отмены инвестиции');
      }

      toast.success('✅ Инвестиция принудительно отменена администратором');
      setShowAdminDialog(null);
      setAdminCode('');
      fetchRequests();
    } catch (error: any) {
      console.error('Ошибка принудительной отмены:', error);
      toast.error(error.message || 'Не удалось отменить инвестицию');
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'patronage':
        return 'Патронаж';
      case 'income':
        return 'Доход';
      case 'ownership':
        return 'Владение';
      default:
        return type;
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin">
          <Icon name="Loader2" size={48} className="text-farmer-green" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Мои инвесторы</h2>
          <p className="text-gray-600 mt-1">Управляйте заявками на ваши предложения</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <Icon name="Bell" size={20} />
            {pendingCount} новых заявок
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Icon name="Info" className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-2">Процесс работы с инвесторами:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Инвестор оставляет заявку на ваше предложение</li>
              <li>Вы одобряете или отклоняете заявку</li>
              <li>После одобрения инвестор получает кнопку "Оплатить"</li>
              <li>После оплаты инвестиция становится активной</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          className={filter === 'pending' ? 'bg-farmer-green' : ''}
        >
          Ожидают ответа ({requests.filter(r => r.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
          className={filter === 'approved' ? 'bg-farmer-green' : ''}
        >
          Ждем оплаты ({requests.filter(r => r.status === 'approved').length})
        </Button>
        <Button
          variant={filter === 'paid' ? 'default' : 'outline'}
          onClick={() => setFilter('paid')}
          className={filter === 'paid' ? 'bg-farmer-green' : ''}
        >
          Оплачено ({requests.filter(r => r.status === 'paid').length})
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'bg-farmer-green' : ''}
        >
          Активные ({requests.filter(r => r.status === 'active').length})
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-farmer-green' : ''}
        >
          Все заявки
        </Button>
      </div>

      {filteredRequests.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="Users" size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filter === 'pending' ? 'Нет новых заявок' : 'Заявок не найдено'}
          </h3>
          <p className="text-gray-500">
            {filter === 'pending' 
              ? 'Когда инвесторы оставят заявки на ваши предложения, они появятся здесь'
              : 'Попробуйте выбрать другой фильтр'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-farmer-green-light rounded-full flex items-center justify-center">
                      <Icon name="User" size={24} className="text-farmer-green" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{request.investor_name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(request.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-3">
                    <p className="text-sm text-gray-600 mb-1">Предложение:</p>
                    <p className="font-medium text-gray-900">{request.proposal_description}</p>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-gray-600">Сумма:</span>
                      <span className="font-bold text-farmer-green ml-2">
                        {request.amount.toLocaleString()} ₽
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Тип:</span>
                      <span className="font-medium ml-2">{getTypeLabel(request.proposal_type)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[160px]">
                  {request.status === 'pending' ? (
                    <>
                      <Button
                        onClick={() => handleRequestAction(request.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Icon name="Check" size={18} className="mr-2" />
                        Одобрить
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRequestAction(request.id, 'reject')}
                        className="text-red-600 hover:bg-red-50 border-red-300"
                      >
                        <Icon name="X" size={18} className="mr-2" />
                        Отклонить
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className={`px-4 py-2 rounded-lg text-center font-semibold ${
                        request.status === 'active' ? 'bg-green-100 text-green-700' :
                        request.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                        request.status === 'approved' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {request.status === 'active' ? '✓ Активно' :
                         request.status === 'paid' ? '💳 Оплачено' :
                         request.status === 'approved' ? '⏳ Ждем оплаты' :
                         '✗ Отклонено'}
                      </div>
                      {(request.status === 'active' || request.status === 'paid' || request.status === 'approved') && (
                        showAdminDialog === request.id ? (
                          <div className="border-2 border-red-300 rounded-lg p-3 space-y-2">
                            <p className="text-xs text-red-700 font-semibold">⚠️ Принудительная отмена (только для админа)</p>
                            <input
                              type="password"
                              placeholder="Код администратора"
                              value={adminCode}
                              onChange={(e) => setAdminCode(e.target.value)}
                              className="w-full px-3 py-2 border rounded text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleForceCancel(request.id)}
                                size="sm"
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                              >
                                Отменить
                              </Button>
                              <Button
                                onClick={() => {
                                  setShowAdminDialog(null);
                                  setAdminCode('');
                                }}
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                Отмена
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => setShowAdminDialog(request.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
                          >
                            <Icon name="ShieldAlert" size={14} className="mr-1" />
                            Отменить (админ)
                          </Button>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestorRequests;