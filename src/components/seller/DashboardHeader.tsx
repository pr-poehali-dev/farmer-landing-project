import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Props {
  companyName?: string;
  onLogout: () => void;
}

export default function DashboardHeader({ companyName, onLogout }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <Icon name="Store" className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{companyName || 'Кабинет продавца'}</h1>
          <p className="text-sm text-gray-500">Управляйте товарами и рекламой</p>
        </div>
      </div>
      <Button variant="outline" onClick={onLogout}>
        <Icon name="LogOut" size={16} className="mr-2" />
        Выйти
      </Button>
    </div>
  );
}
