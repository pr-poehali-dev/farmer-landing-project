import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Proposal {
  id: number;
  description: string;
  price: number;
  shares: number;
  type: string;
  asset: {
    id?: string;
    name: string;
    type: string;
    count?: number;
    details?: string;
  };
  expected_product?: string;
  update_frequency?: string;
  farmer_name: string;
  farm_name: string;
  region: string;
  investors_count: number;
}

interface ProposalsViewerProps {
  userId: number;
  onInvest: (proposalId: number, productType: string) => void;
}

const INVESTOR_API = 'https://functions.poehali.dev/d4ed65bb-a05a-48e5-b2f9-78e2c3750ef5';

const ProposalsViewer = ({ userId, onInvest }: ProposalsViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<'all' | 'income' | 'products' | 'patronage'>('all');
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  useEffect(() => {
    loadProposals();
    loadMyRequests();
  }, []);

  const loadProposals = async () => {
    try {
      const response = await fetch(`${INVESTOR_API}?action=get_all_proposals`, {
        headers: { 'X-User-Id': userId.toString() }
      });
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (error) {
      toast.error('Ошибка загрузки предложений');
    } finally {
      setLoading(false);
    }
  };

  const loadMyRequests = async () => {
    try {
      const response = await fetch(`${INVESTOR_API}?action=get_portfolio`, {
        headers: { 'X-User-Id': userId.toString() }
      });
      const data = await response.json();
      setMyRequests(data.investments || []);
    } catch (error) {
      console.error('Ошибка загрузки заявок');
    }
  };

  const cancelRequest = async (investmentId: number) => {
    if (!confirm('Вы уверены, что хотите отменить заявку?')) return;
    
    try {
      const response = await fetch(INVESTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'cancel_investment',
          investment_id: investmentId
        })
      });

      if (response.ok) {
        toast.success('Заявка отменена');
        loadMyRequests();
      } else {
        toast.error('Ошибка при отмене заявки');
      }
    } catch (error) {
      toast.error('Ошибка при отмене заявки');
    }
  };

  const filteredProposals = filter === 'all' 
    ? proposals 
    : proposals.filter(p => p.type === filter);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'income': return 'TrendingUp';
      case 'products': return 'ShoppingBag';
      case 'patronage': return 'Eye';
      default: return 'Circle';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'income': return 'Доход';
      case 'products': return 'Продукт';
      case 'patronage': return 'Патронаж';
      default: return type;
    }
  };

  const getEmotionalText = (type: string) => {
    switch(type) {
      case 'income':
        return 'Стань совладельцем земли — твои вложения растут как урожай, возвращая здоровье через настоящую еду.';
      case 'products':
        return 'Вложи в живое — и получи назад вкус земли. Без искусственного, только дар природы.';
      case 'patronage':
        return 'Стань покровителем — следи за фермой в видео, почувствуй связь с настоящим.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-farmer-green" size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Маркет предложений</h2>
        <Button
          variant="outline"
          onClick={() => setShowMyRequests(true)}
          className="flex items-center gap-2"
        >
          <Icon name="FileText" size={18} />
          Мои заявки ({myRequests.length})
        </Button>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="income">
            <Icon name="TrendingUp" size={16} className="mr-2" />
            Доход
          </TabsTrigger>
          <TabsTrigger value="products">
            <Icon name="ShoppingBag" size={16} className="mr-2" />
            Продукт
          </TabsTrigger>
          <TabsTrigger value="patronage">
            <Icon name="Eye" size={16} className="mr-2" />
            Патронаж
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filter !== 'all' && (
        <Card className="p-4 mb-6 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5">
          <p className="text-gray-700 italic">
            {getEmotionalText(filter)}
          </p>
        </Card>
      )}

      {filteredProposals.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Пока нет предложений этого типа</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon 
                    name={getTypeIcon(proposal.type)} 
                    size={16} 
                    className="text-farmer-orange" 
                  />
                  <span className="text-xs font-medium text-farmer-orange uppercase">
                    {getTypeLabel(proposal.type)}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-1">
                  {proposal.asset.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-1">
                  {proposal.farmer_name} • {proposal.region}
                </p>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {proposal.description}
                </p>

                {proposal.expected_product && (
                  <div className="mb-3 p-2 bg-green-50 rounded">
                    <p className="text-sm text-green-800">
                      <Icon name="Gift" size={14} className="inline mr-1" />
                      {proposal.expected_product}
                    </p>
                  </div>
                )}

                {proposal.update_frequency && (
                  <div className="mb-3 p-2 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <Icon name="Video" size={14} className="inline mr-1" />
                      Обновления: {proposal.update_frequency === 'weekly' ? 'Еженедельно' : 'Ежемесячно'}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4 pt-3 border-t">
                  <div>
                    <div className="text-2xl font-bold text-farmer-green">
                      {proposal.price.toLocaleString()} ₽
                    </div>
                    <div className="text-xs text-gray-500">
                      {proposal.type === 'patronage' ? 'в месяц' : 'за долю'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Долей: {proposal.shares}
                    </div>
                    <div className="text-xs text-gray-500">
                      Заявок: {proposal.investors_count}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onInvest(proposal.id, proposal.type)}
                  className="w-full bg-farmer-green hover:bg-farmer-green-dark"
                >
                  <Icon name="Heart" size={16} className="mr-2" />
                  {proposal.type === 'patronage' 
                    ? 'Оставить заявку' 
                    : 'Оставить заявку'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showMyRequests} onOpenChange={setShowMyRequests}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Icon name="FileText" className="text-farmer-green" />
              Мои заявки
            </DialogTitle>
          </DialogHeader>
          
          {myRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Icon name="Inbox" size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">У вас пока нет заявок</p>
              <p className="text-sm mt-2">Оставьте заявку на понравившееся предложение</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((request) => {
                const status = request.status || 'pending';
                const statusText = status === 'pending' ? 'Ждем подтверждение' : 
                                 status === 'active' ? 'Одобрено' :
                                 status === 'rejected' ? 'Отклонено' : 'Отменено';
                const statusColor = status === 'active' ? 'bg-green-100 text-green-700' :
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
                          <span>Сумма: {request.amount} ₽</span>
                          <span>Тип: {getTypeLabel(request.proposal_type)}</span>
                        </div>
                      </div>
                      {status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            cancelRequest(request.id);
                            setShowMyRequests(false);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="X" size={16} className="mr-1" />
                          Отменить
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalsViewer;