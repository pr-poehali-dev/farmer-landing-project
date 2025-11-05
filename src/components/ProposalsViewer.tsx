import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { ProposalCard } from '@/components/proposals/ProposalCard';
import { MyRequestsDialog } from '@/components/proposals/MyRequestsDialog';
import { InvestDialog } from '@/components/proposals/InvestDialog';
import { ProposalsFilters } from '@/components/proposals/ProposalsFilters';

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
    livestock_type?: string;
    livestock_breed?: string;
    livestock_direction?: string;
    crop_type?: string;
    crop_variety?: string;
    crop_purpose?: string;
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
  externalAssetFilter?: 'all' | 'animal' | 'crop' | 'beehive';
}

const INVESTOR_API = 'https://functions.poehali.dev/d4ed65bb-a05a-48e5-b2f9-78e2c3750ef5';

const ProposalsViewer = ({ userId, onInvest, externalAssetFilter }: ProposalsViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<'all' | 'income' | 'products' | 'patronage'>('all');
  const [assetTypeFilter, setAssetTypeFilter] = useState<'all' | 'animal' | 'crop' | 'beehive'>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    loadProposals();
    loadMyRequests();
  }, []);

  useEffect(() => {
    if (externalAssetFilter && externalAssetFilter !== 'all') {
      setAssetTypeFilter(externalAssetFilter);
    }
  }, [externalAssetFilter]);

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
      const requests = JSON.parse(localStorage.getItem('investor_requests') || '[]');
      const updatedRequests = requests.filter((r: any) => r.id !== requestId);
      localStorage.setItem('investor_requests', JSON.stringify(updatedRequests));
      
      toast.success('Заявка отменена');
      loadMyRequests();
    } catch (error) {
      toast.error('Ошибка при отмене заявки');
    }
  };

  const handlePayRequest = (requestId: string, amount: number) => {
    const allRequests = JSON.parse(localStorage.getItem('investor_requests') || '[]');
    const updatedRequests = allRequests.map((r: any) => 
      r.id === requestId ? { ...r, status: 'paid' } : r
    );
    localStorage.setItem('investor_requests', JSON.stringify(updatedRequests));
    
    toast.success('✅ Оплата принята! Инвестиция теперь в вашем портфеле');
    loadMyRequests();
  };

  const handleInvestSubmit = async (proposalId: number, type: string, shares: number, totalAmount: number): Promise<boolean> => {
    console.log('Отправка заявки:', { proposalId, type, shares, totalAmount });
    const success = await onInvest(proposalId, type, shares, totalAmount);
    console.log('Результат отправки:', success);
    if (success) {
      toast.success(`✅ Заявка на ${shares} ${shares === 1 ? 'долю' : 'долей'} отправлена! Проверьте "Мои заявки"`);
      await loadMyRequests();
      setTimeout(() => setShowMyRequests(true), 300);
      return true;
    } else {
      toast.error('Ошибка отправки заявки');
      return false;
    }
  };

  const filteredProposals = proposals.filter(p => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (assetTypeFilter !== 'all' && p.asset.type !== assetTypeFilter) return false;
    if (directionFilter !== 'all') {
      if (p.asset.type === 'animal' && p.asset.livestock_direction !== directionFilter) return false;
      if (p.asset.type === 'crop' && p.asset.crop_purpose !== directionFilter) return false;
    }
    return true;
  });

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

      <ProposalsFilters
        assetTypeFilter={assetTypeFilter}
        directionFilter={directionFilter}
        onAssetTypeChange={setAssetTypeFilter}
        onDirectionChange={setDirectionFilter}
        onReset={() => {
          setAssetTypeFilter('all');
          setDirectionFilter('all');
        }}
      />

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
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onSelect={() => setSelectedProposal(proposal)}
            />
          ))}
        </div>
      )}

      <MyRequestsDialog
        open={showMyRequests}
        onClose={() => setShowMyRequests(false)}
        requests={myRequests}
        onCancelRequest={cancelRequest}
        onPayRequest={handlePayRequest}
      />

      <InvestDialog
        proposal={selectedProposal}
        onClose={() => setSelectedProposal(null)}
        onSubmit={handleInvestSubmit}
      />
    </div>
  );
};

export default ProposalsViewer;
