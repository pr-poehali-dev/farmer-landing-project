import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import OfferForm from './OfferForm';
import OffersList from './OffersList';

interface OffersManagementProps {
  userId: string;
}

const OffersManagement = ({ userId }: OffersManagementProps) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOfferCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5 border-farmer-green/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={24} className="text-farmer-green mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Система долей</h3>
            <p className="text-sm text-gray-700 mb-2">
              Создавайте предложения с долевой системой инвестирования. Укажите общую сумму и цену одной доли — 
              система автоматически рассчитает количество долей.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Общая сумма должна делиться на цену доли без остатка</li>
              <li>• Инвесторы смогут оставлять заявки на покупку долей</li>
              <li>• Вы сможете одобрять или отклонять заявки</li>
            </ul>
          </div>
        </div>
      </Card>

      <OfferForm userId={userId} onSuccess={handleOfferCreated} />

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="List" className="text-gray-700" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Мои предложения</h3>
        </div>
        <OffersList userId={userId} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default OffersManagement;
