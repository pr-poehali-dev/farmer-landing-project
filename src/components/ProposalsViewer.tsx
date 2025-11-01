import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  useEffect(() => {
    loadProposals();
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
                      Инвесторов: {proposal.investors_count}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onInvest(proposal.id, proposal.type)}
                  className="w-full bg-farmer-green hover:bg-farmer-green-dark"
                >
                  <Icon name="Heart" size={16} className="mr-2" />
                  {proposal.type === 'patronage' 
                    ? 'Стать покровителем' 
                    : 'Инвестировать виртуально'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalsViewer;