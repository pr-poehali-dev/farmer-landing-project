import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProposalsViewer from '@/components/ProposalsViewer';

const INVESTOR_API = 'https://functions.poehali.dev/d4ed65bb-a05a-48e5-b2f9-78e2c3750ef5';

const InvestorDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [proposals, setProposals] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState(0);
  const [investing, setInvesting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'investor')) {
      navigate('/login');
    } else if (user) {
      loadData();
    }
  }, [authLoading, user, navigate]);

  const loadData = async () => {
    try {
      const proposalsRes = await fetch(`${INVESTOR_API}?action=get_proposals`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const proposalsData = await proposalsRes.json();
      setProposals(proposalsData.proposals || []);
      
      const portfolioRes = await fetch(`${INVESTOR_API}?action=get_portfolio`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const portfolioData = await portfolioRes.json();
      setPortfolio(portfolioData.investments || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
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
      const response = await fetch(INVESTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'invest_virtual',
          proposal_id: proposalId,
          product_type: productType
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const messages = {
          income: `Виртуальная инвестиция принята! Теперь ты совладелец — отслеживай свой доход от земли.`,
          product: `Отлично! Твоя инвестиция даст урожай: ${data.simulation || 'свежие продукты для здоровья'}.`,
          patronage: `Ты стал покровителем! Следи за фермой — скоро получишь первые видеообновления.`
        };
        toast.success(messages[productType as keyof typeof messages] || 'Инвестиция создана!');
        loadData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка инвестирования');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Icon name="Search" className="text-farmer-green" />
            Доступные предложения
          </h2>
          
          <ProposalsViewer 
            userId={user!.id} 
            onInvest={(proposalId, productType) => {
              handleInvestInProposal(proposalId, productType);
            }}
          />
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Icon name="Briefcase" className="text-farmer-orange" />
            Мой портфель
          </h2>
          
          {portfolio.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Пока нет инвестиций</p>
          ) : (
            <div className="space-y-3">
              {portfolio.map((investment) => (
                <Card key={investment.id} className="p-4 border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{investment.proposal_description}</p>
                      <p className="text-sm text-gray-600 mt-1">Фермер: {investment.farmer_name}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Сумма: {investment.amount} ₽</span>
                        <span>Тип: {investment.proposal_type}</span>
                        <span>Дата: {new Date(investment.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InvestorDashboard;