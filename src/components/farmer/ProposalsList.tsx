import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Proposal, FARMER_API } from './proposal-types';

interface Props {
  proposals: Proposal[];
  loading: boolean;
  userId: string;
  onDelete: () => void;
}

const ProposalsList = ({ proposals, loading, userId, onDelete }: Props) => {
  const handleDelete = async (proposalId: number) => {
    if (!confirm('Удалить это предложение?')) return;

    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'delete_proposal',
          proposal_id: proposalId
        })
      });

      if (response.ok) {
        toast.success('Предложение удалено');
        onDelete();
      } else {
        toast.error('Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex justify-center">
          <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
        </div>
      </Card>
    );
  }

  if (proposals.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500">
          <Icon name="Package" size={48} className="mx-auto mb-3 opacity-50" />
          <p>Пока нет созданных предложений</p>
          <p className="text-sm mt-1">Создайте первое предложение выше</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {proposals.map(proposal => (
        <Card key={proposal.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon 
                  name={
                    proposal.type === 'income' ? 'DollarSign' :
                    proposal.type === 'product' ? 'Package' : 'Eye'
                  } 
                  size={20} 
                  className="text-green-600"
                />
                <span className="font-semibold">
                  {proposal.type === 'income' ? 'Доход' : 
                   proposal.type === 'product' ? 'Продукт' : 'Патронаж'}
                </span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  {proposal.status === 'active' ? 'Активно' : 'Черновик'}
                </span>
              </div>
              <h4 className="font-bold mb-1">{proposal.asset?.name || 'Актив'}</h4>
              <p className="text-sm text-gray-600 mb-2">{proposal.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>💰 {proposal.price.toLocaleString()} руб.</span>
                <span>📊 {proposal.shares} долей</span>
                {proposal.expected_product && <span>📦 {proposal.expected_product}</span>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(proposal.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Icon name="Trash2" size={18} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProposalsList;
