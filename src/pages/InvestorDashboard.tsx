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

  const [activeTab, setActiveTab] = useState('portfolio');
  const [marketAssetFilter, setMarketAssetFilter] = useState<'all' | 'animal' | 'crop' | 'beehive'>('all');
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    country: '',
    region: '',
    city: '',
    phone: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

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
      
      const profileRes = await fetch(`${INVESTOR_API}?action=get_profile`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const profileInfo = await profileRes.json();
      if (profileInfo.profile) {
        setProfileData(profileInfo.profile);
      }
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

  const handleInvestInProposal = async (proposalId: number, productType: string, shares?: number, totalAmount?: number): Promise<boolean> => {
    console.log('🔍 handleInvestInProposal получила параметры:', { proposalId, productType, shares, totalAmount });
    const actualShares = shares ?? 1;
    console.log('🔍 actualShares после обработки:', actualShares);
    try {
      const proposal = proposals.find(p => p.id === proposalId);
      
      if (!proposal) {
        toast.error('Предложение не найдено');
        return false;
      }

      const finalAmount = totalAmount || (proposal.price * actualShares);
      
      console.log('📤 Отправка заявки на сервер:', { 
        proposalId, 
        productType, 
        shares: actualShares, 
        finalAmount,
        proposalPrice: proposal.price 
      });

      const response = await fetch(INVESTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'invest',
          proposal_id: proposalId,
          amount: finalAmount,
          shares: actualShares
        })
      });

      const data = await response.json();
      console.log('📥 Ответ сервера:', data);

      if (!response.ok) {
        toast.error(data.error || 'Ошибка отправки заявки');
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Ошибка создания заявки:', error);
      toast.error('Ошибка создания заявки');
      return false;
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await fetch(INVESTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'update_profile',
          ...profileData
        })
      });

      if (response.ok) {
        toast.success('Профиль сохранён!');
      } else {
        toast.error('Ошибка сохранения профиля');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setSavingProfile(false);
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
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setActiveTab('profile')} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Icon name="User" size={18} className="mr-2" />
              Мой профиль
            </Button>
            <Button onClick={() => { logout(); navigate('/'); }} variant="outline">
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <BalanceWidget 
            balance={balance} 
            onTopUp={() => setShowTopUpModal(true)} 
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="portfolio">
              <Icon name="Sprout" size={18} className="mr-2" />
              Моя виртуальная ферма
            </TabsTrigger>
            <TabsTrigger value="proposals">
              <Icon name="Package" size={18} className="mr-2" />
              Маркет предложений
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals">
            <ProposalsViewer 
              userId={user!.id} 
              onInvest={handleInvestInProposal}
              externalAssetFilter={marketAssetFilter}
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
            
            <VirtualFarm 
              investments={portfolio} 
              onNavigateToMarket={(assetType) => {
                setMarketAssetFilter(assetType);
                setActiveTab('proposals');
              }}
            />
          </TabsContent>

          <TabsContent value="profile">
            <Card className="p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="User" className="text-green-600" size={28} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Мой профиль</h2>
                  <p className="text-sm text-gray-600">Заполните информацию о себе</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Имя</Label>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="Иван"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Фамилия</Label>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Иванов"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email нельзя изменить</p>
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Страна</Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="Россия"
                    value={profileData.country}
                    onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Регион</Label>
                    <Input
                      id="region"
                      type="text"
                      placeholder="Московская область"
                      value={profileData.region}
                      onChange={(e) => setProfileData({...profileData, region: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Город</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Москва"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {savingProfile ? 'Сохранение...' : 'Сохранить профиль'}
                </Button>
              </div>
            </Card>
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