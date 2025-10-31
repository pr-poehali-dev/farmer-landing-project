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
          
          <div className="flex gap-2 mb-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все предложения</SelectItem>
                <SelectItem value="products">Продукты</SelectItem>
                <SelectItem value="income">Доход</SelectItem>
                <SelectItem value="patronage">Патронаж</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProposals.length === 0 ? (
            <Card className="p-8">
              <p className="text-gray-500 text-center">Пока нет доступных предложений</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProposals.map((proposal) => (
                <Card key={proposal.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-farmer-green/10 text-farmer-green text-xs font-medium rounded">
                      {proposal.type === 'products' ? 'Продукты' : proposal.type === 'income' ? 'Доход' : 'Патронаж'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">{proposal.description}</p>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p className="font-semibold text-lg text-gray-900">{proposal.price} ₽</p>
                    <p>Долей: {proposal.shares}</p>
                    <p className="text-xs">От: {proposal.farmer_name}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-farmer-orange hover:bg-farmer-orange-dark"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setInvestAmount(proposal.price);
                        }}
                      >
                        Инвестировать
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Инвестировать в предложение</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">{selectedProposal?.description}</p>
                          <p className="text-sm text-gray-600">Фермер: {selectedProposal?.farmer_name}</p>
                        </div>
                        <div>
                          <Label htmlFor="amount">Сумма инвестиции (₽)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={investAmount || ''}
                            onChange={(e) => setInvestAmount(parseFloat(e.target.value) || 0)}
                            placeholder="Введите сумму"
                          />
                        </div>
                        <Button 
                          onClick={handleInvest} 
                          disabled={investing}
                          className="w-full bg-farmer-green hover:bg-farmer-green-dark"
                        >
                          {investing ? (
                            <>
                              <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                              Обработка...
                            </>
                          ) : (
                            'Подтвердить инвестицию'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </Card>
              ))}
            </div>
          )}
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
