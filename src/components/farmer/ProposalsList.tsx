import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Proposal, FARMER_API } from './proposal-types';
import { LIVESTOCK_TYPES, LIVESTOCK_DIRECTIONS, LIVESTOCK_BREEDS } from '@/data/livestock';
import { CROP_TYPES, CROP_VARIETIES, CROP_PURPOSES } from '@/data/crops';

interface Props {
  proposals: Proposal[];
  loading: boolean;
  userId: string;
  onDelete: () => void;
}

const ProposalsList = ({ proposals, loading, userId, onDelete }: Props) => {
  const getLivestockLabel = (value: string, type: 'type' | 'breed' | 'direction') => {
    if (type === 'type') {
      return LIVESTOCK_TYPES.find(t => t.value === value)?.label || value;
    }
    if (type === 'direction') {
      return LIVESTOCK_DIRECTIONS.find(d => d.value === value)?.label || value;
    }
    const allBreeds = Object.values(LIVESTOCK_BREEDS).flat();
    return allBreeds.find(b => b.value === value)?.label || value;
  };
  
  const getCropLabel = (value: string, type: 'type' | 'variety' | 'purpose') => {
    if (type === 'type') {
      return CROP_TYPES.find(t => t.value === value)?.label || value;
    }
    if (type === 'purpose') {
      return CROP_PURPOSES.find(p => p.value === value)?.label || value;
    }
    const allVarieties = Object.values(CROP_VARIETIES).flat();
    return allVarieties.find(v => v.value === value)?.label || value;
  };

  const handleDelete = async (proposalId: number, hasInvestments: boolean) => {
    let forceDelete = false;

    if (hasInvestments) {
      const confirmed = confirm(
        '⚠️ ВНИМАНИЕ!\n\n' +
        'У этого предложения есть активные заявки от инвесторов.\n\n' +
        'При удалении предложения:\n' +
        '• Все активные заявки будут автоматически отменены\n' +
        '• Инвесторы получат уведомление об отмене\n' +
        '• Данные заявок сохранятся в истории\n\n' +
        'Вы уверены, что хотите удалить это предложение?'
      );
      
      if (!confirmed) return;
      forceDelete = true;
    } else {
      if (!confirm('Удалить это предложение?')) return;
    }

    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'delete_proposal',
          proposal_id: proposalId,
          force_delete: forceDelete
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.cancelled_investments > 0) {
          toast.success(`Предложение удалено. Отменено заявок: ${result.cancelled_investments}`);
        } else {
          toast.success('Предложение удалено');
        }
        onDelete();
      } else {
        const error = await response.json();
        if (error.error === 'has_active_investments') {
          toast.error(`У предложения ${error.count} активных заявок. Требуется подтверждение.`);
        } else {
          toast.error(error.message || 'Ошибка удаления');
        }
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
                {proposal.has_investments && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                    <Icon name="Users" size={14} />
                    Есть заявки
                  </span>
                )}
              </div>
              <h4 className="font-bold mb-1">{proposal.asset?.name || 'Актив'}</h4>
              
              {proposal.asset?.type === 'animal' && (proposal.asset.livestock_type || proposal.asset.livestock_breed || proposal.asset.livestock_direction) && (
                <div className="flex flex-wrap gap-2 mb-2 text-xs">
                  {proposal.asset.livestock_type && (
                    <span className="px-2 py-1 rounded bg-amber-100 text-amber-800">
                      🐄 {getLivestockLabel(proposal.asset.livestock_type, 'type')}
                    </span>
                  )}
                  {proposal.asset.livestock_breed && (
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                      📋 {getLivestockLabel(proposal.asset.livestock_breed, 'breed')}
                    </span>
                  )}
                  {proposal.asset.livestock_direction && (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                      🎯 {getLivestockLabel(proposal.asset.livestock_direction, 'direction')}
                    </span>
                  )}
                </div>
              )}
              
              {proposal.asset?.type === 'crop' && (proposal.asset.crop_type || proposal.asset.crop_variety || proposal.asset.crop_purpose) && (
                <div className="flex flex-wrap gap-2 mb-2 text-xs">
                  {proposal.asset.crop_type && (
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800">
                      🌾 {getCropLabel(proposal.asset.crop_type, 'type')}
                    </span>
                  )}
                  {proposal.asset.crop_variety && (
                    <span className="px-2 py-1 rounded bg-lime-100 text-lime-800">
                      🌱 {getCropLabel(proposal.asset.crop_variety, 'variety')}
                    </span>
                  )}
                  {proposal.asset.crop_purpose && (
                    <span className="px-2 py-1 rounded bg-teal-100 text-teal-800">
                      🎯 {getCropLabel(proposal.asset.crop_purpose, 'purpose')}
                    </span>
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-2">{proposal.description}</p>
              
              {proposal.income_details && (
                <Card className="p-3 bg-blue-50 border-blue-200 mb-2 text-xs space-y-1">
                  <div className="font-semibold text-blue-900">💵 Доходность:</div>
                  <div>
                    • Доход: {proposal.income_details.revenue_amount.toLocaleString()} руб/{
                      proposal.income_details.revenue_period === 'daily' ? 'день' :
                      proposal.income_details.revenue_period === 'monthly' ? 'месяц' : 'год'
                    }
                    {proposal.income_details.revenue_description && ` (${proposal.income_details.revenue_description})`}
                  </div>
                  {proposal.income_details.maintenance_cost > 0 && (
                    <div>• Содержание: {proposal.income_details.maintenance_cost.toLocaleString()} руб/мес</div>
                  )}
                  <div className="font-semibold text-green-700 pt-1">
                    → Выплата инвестору: {proposal.income_details.payout_amount.toLocaleString()} руб {
                      proposal.income_details.payout_period === 'monthly' ? 'ежемесячно' : 'ежегодно'
                    } в течение {proposal.income_details.payout_duration} мес
                  </div>
                  {proposal.income_details.last_year_yield && (
                    <div className="text-gray-600">📈 Прошлый год: {proposal.income_details.last_year_yield}</div>
                  )}
                </Card>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>💰 {proposal.price.toLocaleString()} руб.</span>
                <span>📊 {proposal.shares} долей</span>
                {proposal.expected_product && <span>📦 {proposal.expected_product}</span>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(proposal.id, proposal.has_investments || false)}
              className={proposal.has_investments 
                ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" 
                : "text-red-600 hover:text-red-700 hover:bg-red-50"}
              title={proposal.has_investments ? "Удалить с отменой заявок инвесторов" : "Удалить предложение"}
            >
              <Icon name={proposal.has_investments ? "AlertTriangle" : "Trash2"} size={18} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProposalsList;