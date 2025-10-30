import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FarmersTable from '@/components/FarmersTable';
import InvestorsTable from '@/components/InvestorsTable';
import SellersTable from '@/components/SellersTable';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('farmers');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Icon name="Sprout" size={40} className="text-green-600" />
            Агропромышленная платформа
          </h1>
          <p className="text-gray-600">Связываем фермеров, инвесторов и поставщиков</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="farmers" className="flex items-center gap-2">
              <Icon name="Tractor" size={20} />
              Фермеры
            </TabsTrigger>
            <TabsTrigger value="investors" className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Инвесторы
            </TabsTrigger>
            <TabsTrigger value="sellers" className="flex items-center gap-2">
              <Icon name="Store" size={20} />
              Продавцы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farmers">
            <FarmersTable />
          </TabsContent>

          <TabsContent value="investors">
            <InvestorsTable />
          </TabsContent>

          <TabsContent value="sellers">
            <SellersTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
