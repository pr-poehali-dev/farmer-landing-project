import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProposalsViewer from '@/components/ProposalsViewer';
import FarmerCard from '@/components/FarmerCard';
import FarmerFilters, { FilterState } from '@/components/FarmerFilters';
import BalanceWidget from '@/components/BalanceWidget';
import TopUpModal from '@/components/TopUpModal';
import OffersList from '@/components/investor/OffersList';
import { VirtualFarm } from '@/components/investor/VirtualFarm';

const INVESTOR_API = 'https://functions.poehali.dev/d4ed65bb-a05a-48e5-b2f9-78e2c3750ef5';

const InvestorDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [proposals, setProposals] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState(0);
  const [investing, setInvesting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'farm'>('farm');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'investor')) {
      navigate('/login');
    } else if (user) {
      loadData();
    }
  }, [authLoading, user, navigate]);

  const cancelInvestment = async (investmentId: number) => {
    if (!confirm('Вы уверены, что хотите отменить эту сделку?')) return;
    
    try {
      const response = await fetch(INVESTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'cancel_investment',
          investment_id: investmentId
        })
      });

      if (response.ok) {
        toast.success('Сделка отменена');
        loadData();
      } else {
        toast.error('Ошибка при отмене сделки');
      }
    } catch (error) {
      toast.error('Ошибка при отмене сделки');
    }
  };

  const loadData = async () => {
    try {
      const proposalsRes = await fetch(`${INVESTOR_API}?action=get_proposals`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const proposalsData = await proposalsRes.json();
      setProposals(proposalsData.proposals || []);
      
      // Загружаем портфель из localStorage - только оплаченные заявки
      const allRequests = JSON.parse(localStorage.getItem('investor_requests') || '[]');
      const paidRequests = allRequests.filter((r: any) => 
        r.investor_id === user!.id.toString() && r.status === 'paid'
      );
      setPortfolio(paidRequests);
      
      const farmersRes = await fetch(`${INVESTOR_API}?action=get_farmers`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const farmersData = await farmersRes.json();
      setFarmers(farmersData.farmers || []);
      setFilteredFarmers(farmersData.farmers || []);
      
      const balanceRes = await fetch(`${INVESTOR_API}?action=get_balance`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const balanceData = await balanceRes.json();
      setBalance(balanceData.balance || 0);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (filters: FilterState) => {
    try {
      const params = new URLSearchParams();
      params.append('action', 'get_farmers');
      if (filters.region) params.append('region', filters.region);
      if (filters.assetTypes.length > 0) params.append('asset_types', filters.assetTypes.join(','));
      if (filters.productTypes.length > 0) params.append('product_types', filters.productTypes.join(','));
      
      const farmersRes = await fetch(`${INVESTOR_API}?${params.toString()}`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const farmersData = await farmersRes.json();
      setFilteredFarmers(farmersData.farmers || []);
    } catch (error) {
      console.error('Ошибка фильтрации:', error);
    }
  };

  const handleInvest = async () => {
    if (!selectedProposal || investAmount <= 0) {
      toast.error('Укажите сумму инвестиции');
      return;
    }
    
    setInvesting(true);
    try {
      const response = await fetch(INVESTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'invest',
          proposal_id: selectedProposal.id,
          amount: investAmount
        })
      });
      
      if (response.ok) {
        toast.success('Инвестиция создана!');
        setSelectedProposal(null);
        setInvestAmount(0);
        loadData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка инвестирования');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setInvesting(false);
    }
  };

  const handleInvestInProposal = async (proposalId: number, productType: string) => {
    try {
      console.log('handleInvestInProposal вызван:', { proposalId, productType, proposals });
      
      // Временное решение: сохраняем локально до реализации бэкенда
      const proposal = proposals.find(p => p.id === proposalId);
      console.log('Найденное предложение:', proposal);
      
      if (!proposal) {
        toast.error('Предложение не найдено');
        return false;
      }

      const newRequest = {
        id: Date.now().toString(),
        investor_id: user!.id.toString(),
        investor_name: user!.name || user!.email,
        proposal_id: proposalId.toString(),
        proposal_description: proposal.description,
        proposal_type: productType,
        farmer_name: proposal.farmer_name,
        amount: proposal.price,
        status: 'pending',
        date: new Date().toISOString()
      };

      console.log('Создана заявка:', newRequest);

      // Сохраняем в localStorage
      const existingRequests = JSON.parse(localStorage.getItem('investor_requests') || '[]');
      existingRequests.push(newRequest);
      localStorage.setItem('investor_requests', JSON.stringify(existingRequests));
      
      console.log('Заявка сохранена в localStorage, всего заявок:', existingRequests.length);

      return true;
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
      toast.error('Ошибка создания заявки');
      return false;
    }
  };

  const filteredProposals = filterType === 'all' 
    ? proposals 
    : proposals.filter(p => p.type === filterType);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-farmer-green" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon name="Sprout" size={32} className="text-farmer-green" />
            <div>
              <h1 className="text-xl font-bold text-farmer-green">Кабинет Инвестора</h1>
              <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
            </div>
          </div>
          <Button onClick={() => { logout(); navigate('/'); }} variant="outline">
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <BalanceWidget 
            balance={balance} 
            onTopUp={() => setShowTopUpModal(true)} 
          />
        </div>

        <Tabs defaultValue="farmers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="farmers">
              <Icon name="Users" size={18} className="mr-2" />
              Фермеры
            </TabsTrigger>
            <TabsTrigger value="proposals">
              <Icon name="Package" size={18} className="mr-2" />
              Маркет предложений
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Icon name="Briefcase" size={18} className="mr-2" />
              Портфель
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farmers">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <FarmerFilters onFilterChange={handleFilterChange} />
              </div>
              <div className="lg:col-span-3">
                {filteredFarmers.length === 0 ? (
                  <Card className="p-8">
                    <div className="text-center text-muted-foreground">
                      <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Фермеры не найдены</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredFarmers.map((farmer) => (
                      <FarmerCard key={farmer.user_id} farmer={farmer} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="proposals">
            <ProposalsViewer 
              userId={user!.id} 
              onInvest={async (proposalId, productType) => {
                await handleInvestInProposal(proposalId, productType);
              }}
            />
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Icon name="Info" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div className="text-sm text-green-900">
                  <p className="font-semibold mb-1">В портфеле отображаются только оплаченные инвестиции</p>
                  <p className="text-green-800">Одобренные заявки, ожидающие оплаты, находятся в разделе "Мои заявки"</p>
                </div>
              </div>
            </div>
            {portfolio.length === 0 ? (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Icon name="Briefcase" className="text-farmer-orange" />
                  Мой портфель
                </h2>
                <p className="text-gray-500 text-center py-8">Пока нет оплаченных инвестиций</p>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={viewMode === 'farm' ? 'default' : 'outline'}
                    onClick={() => setViewMode('farm')}
                    className="flex items-center gap-2"
                  >
                    <span>🌾</span>
                    Вид фермы
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    onClick={() => setViewMode('table')}
                    className="flex items-center gap-2"
                  >
                    <Icon name="List" size={18} />
                    Таблица
                  </Button>
                </div>

                {viewMode === 'farm' ? (
                  <VirtualFarm investments={portfolio} />
                ) : (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Список инвестиций</h2>
                    <div className="space-y-3">
                      {portfolio.map((investment) => {
                        const status = investment.status || 'pending';
                        const statusText = status === 'pending' ? 'Ждем подтверждение фермера' : 
                                         status === 'active' ? 'Вы в деле' :
                                         status === 'rejected' ? 'Отклонено фермером' :
                                         'Отменено';
                        const statusColor = status === 'active' ? 'text-green-600' :
                                          status === 'pending' ? 'text-yellow-600' :
                                          'text-red-600';
                        
                        return (
                          <Card key={investment.id} className="p-4 border">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <p className="font-medium text-gray-900">{investment.proposal_description}</p>
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor} bg-opacity-10`}>
                                    {statusText}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Фермер: {investment.farmer_name}</p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                  <span>Сумма: {investment.amount} ₽</span>
                                  <span>Тип: {investment.proposal_type}</span>
                                  <span>Дата: {new Date(investment.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              {status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cancelInvestment(investment.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Icon name="X" size={16} className="mr-1" />
                                  Отказаться
                                </Button>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TopUpModal 
        open={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSubmit={(amount) => {
          toast.success(`Переход к оплате ${amount} ₽`);
        }}
      />
    </div>
  );
};

export default InvestorDashboard;