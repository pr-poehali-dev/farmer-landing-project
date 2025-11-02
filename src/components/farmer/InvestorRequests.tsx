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
  const [filter, setFilter] = useState<'pending' | 'active' | 'all'>('pending');

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`https://your-api.com/api/farmer/${userId}/investor-requests`);
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
      setRequests([
        {
          id: '1',
          investor_id: 'inv1',
          investor_name: 'Иван Петров',
          proposal_id: 'p1',
          proposal_description: 'Развитие молочной фермы',
          proposal_type: 'patronage',
          amount: 50000,
          status: 'pending',
          date: new Date().toISOString()
        },
        {
          id: '2',
          investor_id: 'inv2',
          investor_name: 'Мария Сидорова',
          proposal_id: 'p2',
          proposal_description: 'Покупка оборудования',
          proposal_type: 'income',
          amount: 100000,
          status: 'pending',
          date: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`https://your-api.com/api/farmer/investor-request/${requestId}/${action}`, {
        method: 'POST'
      });

      if (response.ok) {
        toast.success(action === 'approve' ? 'Заявка одобрена!' : 'Заявка отклонена');
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status: action === 'approve' ? 'active' : 'rejected' }
              : req
          )
        );
      }
    } catch (error) {
      console.error('Ошибка обработки заявки:', error);
      toast.error('Не удалось обработать заявку');
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

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          className={filter === 'pending' ? 'bg-farmer-green' : ''}
        >
          Ожидают ответа ({requests.filter(r => r.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'bg-farmer-green' : ''}
        >
          Одобренные ({requests.filter(r => r.status === 'active').length})
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

                <div className="flex flex-col gap-2 min-w-[140px]">
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
                    <div className={`px-4 py-2 rounded-lg text-center font-semibold ${
                      request.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {request.status === 'active' ? '✓ Одобрено' : '✗ Отклонено'}
                    </div>
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
