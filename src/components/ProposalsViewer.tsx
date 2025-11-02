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
  farmer_id?: number;
}

interface ProposalsViewerProps {
  userId: number;
  onInvest: (proposalId: number, productType: string, shares?: number, totalAmount?: number) => Promise<boolean>;
}

const INVESTOR_API = 'https://functions.poehali.dev/d4ed65bb-a05a-48e5-b2f9-78e2c3750ef5';

const ProposalsViewer = ({ userId, onInvest }: ProposalsViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<'all' | 'income' | 'products' | 'patronage'>('all');
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedShares, setSelectedShares] = useState(1);

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
      const response = await fetch(`${INVESTOR_API}?action=get_my_requests`, {
        headers: { 'X-User-Id': userId.toString() }
      });
      const data = await response.json();
      setMyRequests(data.requests || []);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
      toast.error('Ошибка загрузки заявок');
      setMyRequests([]);
    }
  };

  const cancelRequest = async (requestId: string) => {
    if (!confirm('Вы уверены, что хотите отменить заявку?')) return;
    
    try {
      // Временно удаляем из localStorage
      const requests = JSON.parse(localStorage.getItem('investor_requests') || '[]');
      const updatedRequests = requests.filter((r: any) => r.id !== requestId);
      localStorage.setItem('investor_requests', JSON.stringify(updatedRequests));
      
      toast.success('Заявка отменена');
      loadMyRequests();
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
          onClick={() => {
            loadMyRequests();
            setShowMyRequests(true);
          }}
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
                
                <button
                  onClick={() => proposal.farmer_id && window.open(`/profile/${proposal.farmer_id}`, '_blank')}
                  className="text-sm text-gray-600 mb-1 hover:text-farmer-orange transition-colors flex items-center gap-1"
                >
                  <Icon name="User" size={14} />
                  {proposal.farmer_name} • {proposal.region}
                </button>

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
                  onClick={() => {
                    setSelectedProposal(proposal);
                    setSelectedShares(1);
                  }}
                  className="w-full bg-farmer-green hover:bg-farmer-green-dark"
                >
                  <Icon name="Heart" size={16} className="mr-2" />
                  Оставить заявку
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
                              cancelRequest(request.id);
                              setShowMyRequests(false);
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
                              // Обновляем статус на paid в localStorage
                              const allRequests = JSON.parse(localStorage.getItem('investor_requests') || '[]');
                              const updatedRequests = allRequests.map((r: any) => 
                                r.id === request.id ? { ...r, status: 'paid' } : r
                              );
                              localStorage.setItem('investor_requests', JSON.stringify(updatedRequests));
                              
                              toast.success('✅ Оплата принята! Инвестиция теперь в вашем портфеле');
                              loadMyRequests();
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

      <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedProposal?.asset.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProposal && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Цена за долю:</span>
                  <span className="font-bold text-lg">{selectedProposal.price.toLocaleString()} ₽</span>
                </div>

                <div className="border-t pt-3">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Количество долей:
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedShares(Math.max(1, selectedShares - 1))}
                      disabled={selectedShares <= 1}
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <input
                      type="number"
                      min="1"
                      max={selectedProposal.shares}
                      value={selectedShares}
                      onChange={(e) => setSelectedShares(Math.max(1, Math.min(selectedProposal.shares, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center border rounded px-3 py-2 text-lg font-semibold"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedShares(Math.min(selectedProposal.shares, selectedShares + 1))}
                      disabled={selectedShares >= selectedProposal.shares}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Доступно: {selectedProposal.shares} долей
                  </p>
                </div>
              </div>

              <div className="bg-farmer-green/10 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Сумма инвестиции:</span>
                  <span className="text-2xl font-bold text-farmer-green">
                    {(selectedProposal.price * selectedShares).toLocaleString()} ₽
                  </span>
                </div>

                {selectedProposal.expected_product && (
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm text-gray-700">
                      <Icon name="Gift" size={14} className="inline mr-1 text-farmer-orange" />
                      <strong>Вы получите:</strong> {selectedProposal.expected_product}
                      {selectedShares > 1 && ` × ${selectedShares}`}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProposal(null)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  onClick={async () => {
                    const totalAmount = selectedProposal.price * selectedShares;
                    console.log('Отправка заявки:', { proposalId: selectedProposal.id, type: selectedProposal.type, shares: selectedShares, totalAmount });
                    const success = await onInvest(selectedProposal.id, selectedProposal.type, selectedShares, totalAmount);
                    console.log('Результат отправки:', success);
                    if (success) {
                      toast.success(`✅ Заявка на ${selectedShares} ${selectedShares === 1 ? 'долю' : 'долей'} отправлена! Проверьте "Мои заявки"`);
                      setSelectedProposal(null);
                      await loadMyRequests();
                      setTimeout(() => setShowMyRequests(true), 300);
                    } else {
                      toast.error('Ошибка отправки заявки');
                    }
                  }}
                  className="flex-1 bg-farmer-green hover:bg-farmer-green-dark text-white"
                >
                  <Icon name="Heart" size={16} className="mr-2" />
                  Оставить заявку
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalsViewer;