import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Proposal, FARMER_API } from './proposal-types';
import ProposalForm from './ProposalForm';
import ProposalsList from './ProposalsList';

interface Props {
  userId: string;
  onProposalCreated: () => void;
}

const InvestmentProposals = ({ userId, onProposalCreated }: Props) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);

  console.log('🔍 InvestmentProposals: userId =', userId);

  useEffect(() => {
    if (userId) {
      loadProposals();
    }
  }, [userId]);

  const loadProposals = async () => {
    if (!userId) {
      console.error('❌ userId пустой, не могу загрузить предложения');
      return;
    }
    
    console.log('📡 Загружаю предложения для userId:', userId);
    setLoading(true);
    try {
      const response = await fetch(`${FARMER_API}?action=get_proposals`, {
        headers: { 'X-User-Id': userId }
      });
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Ошибка загрузки предложений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProposalCreated = () => {
    onProposalCreated();
    loadProposals();
  };

  return (
    <div className="space-y-6">
      <ProposalForm userId={userId} onSuccess={handleProposalCreated} />

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="List" className="text-gray-700" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Мои предложения</h3>
        </div>

        <ProposalsList 
          proposals={proposals}
          loading={loading}
          userId={userId}
          onDelete={loadProposals}
        />
      </div>
    </div>
  );
};

export default InvestmentProposals;