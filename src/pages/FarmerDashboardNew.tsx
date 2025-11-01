import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import FarmDiagnostics from '@/components/farmer/FarmDiagnostics';
import InvestmentProposals from '@/components/farmer/InvestmentProposals';
import OwnerProfile from '@/components/farmer/OwnerProfile';
import SellerMarketplace from '@/components/farmer/SellerMarketplace';

export default function FarmerDashboardNew() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('diagnostics');
  const [points, setPoints] = useState(120);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Твой кабинет — лаконичный путь к росту фермы</h1>
              <p className="text-sm text-gray-600">Управляй хозяйством эффективно</p>
            </div>
            <div className="flex items-center gap-4">
              <Card className="px-4 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300">
                <div className="flex items-center gap-2">
                  <Icon name="Trophy" size={20} className="text-yellow-600" />
                  <div>
                    <div className="text-xs text-gray-600">Твои баллы</div>
                    <div className="text-xl font-bold text-yellow-700">{points}</div>
                  </div>
                </div>
              </Card>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="diagnostics" className="flex items-center gap-2">
              <Icon name="Home" size={18} />
              <span className="hidden md:inline">Диагностика</span>
            </TabsTrigger>
            <TabsTrigger value="proposals" className="flex items-center gap-2">
              <Icon name="DollarSign" size={18} />
              <span className="hidden md:inline">Предложения</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Icon name="User" size={18} />
              <span className="hidden md:inline">Профиль</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Icon name="Store" size={18} />
              <span className="hidden md:inline">Продавцы</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostics" className="mt-6">
            <FarmDiagnostics />
          </TabsContent>

          <TabsContent value="proposals" className="mt-6">
            <InvestmentProposals />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <OwnerProfile />
          </TabsContent>

          <TabsContent value="marketplace" className="mt-6">
            <SellerMarketplace />
          </TabsContent>
        </Tabs>
      </main>

      <div className="fixed bottom-4 right-4">
        <Button 
          className="rounded-full w-14 h-14 shadow-lg bg-purple-600 hover:bg-purple-700"
          title="Подсказки"
        >
          <Icon name="HelpCircle" size={24} />
        </Button>
      </div>
    </div>
  );
}
