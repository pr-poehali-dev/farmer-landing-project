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
import InvestorRequests from '@/components/farmer/InvestorRequests';

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
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-3">
          <Button 
            onClick={() => setActiveTab('profile')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
          >
            <Icon name="User" size={20} className="mr-2" />
            Мой профиль
          </Button>
          <Button 
            onClick={() => setActiveTab('rating')}
            size="lg"
            className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 text-white shadow-lg"
          >
            <Icon name="Trophy" size={20} className="mr-2" />
            Мой рейтинг
          </Button>
          <Button 
            onClick={() => navigate('/smart-farm')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg"
          >
            <Icon name="Sparkles" size={20} className="mr-2" />
            Моя умная ферма
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="diagnostics" className="flex items-center gap-2">
              <Icon name="Home" size={18} />
              <span className="hidden md:inline">Моё хозяйство</span>
            </TabsTrigger>
            <TabsTrigger value="proposals" className="flex items-center gap-2">
              <Icon name="DollarSign" size={18} />
              <span className="hidden md:inline">Мои предложения</span>
            </TabsTrigger>
            <TabsTrigger value="investors" className="flex items-center gap-2">
              <Icon name="Users" size={18} />
              <span className="hidden md:inline">Мои инвесторы</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Icon name="ShoppingCart" size={18} />
              <span className="hidden md:inline">Товары для фермы</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostics" className="mt-6">
            <FarmDiagnostics />
          </TabsContent>

          <TabsContent value="proposals" className="mt-6">
            <InvestmentProposals userId={user?.id?.toString() || ''} onProposalCreated={() => setPoints(p => p + 10)} />
          </TabsContent>

          <TabsContent value="investors" className="mt-6">
            <InvestorRequests userId={user?.id?.toString() || ''} />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <OwnerProfile userId={user?.id?.toString() || ''} />
          </TabsContent>

          <TabsContent value="marketplace" className="mt-6">
            <SellerMarketplace />
          </TabsContent>

          <TabsContent value="rating" className="mt-6">
            <Card className="p-8 text-center">
              <Icon name="Trophy" size={64} className="mx-auto mb-4 text-yellow-600" />
              <h2 className="text-2xl font-bold mb-2">Система рейтинга</h2>
              <p className="text-gray-600">Скоро здесь появится новая система оценки вашей фермы!</p>
            </Card>
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