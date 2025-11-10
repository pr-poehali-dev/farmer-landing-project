import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Analytics } from '@/types/seller.types';

interface Props {
  tier: string;
  analytics: Analytics;
  onRefresh: () => void;
}

export default function AnalyticsPanel({ tier, analytics, onRefresh }: Props) {
  if (tier === 'none') {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Icon name="Sparkles" className="mx-auto mb-4 text-blue-500" size={48} />
          <h3 className="text-xl font-bold mb-2">Аналитика</h3>
          <p className="text-gray-600 mb-4">Отслеживайте эффективность ваших товаров и рекламы</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <Icon name="Clock" size={16} />
            <span className="font-semibold">Скоро будет доступно</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="BarChart3" className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-bold">Аналитика</h2>
              <p className="text-sm text-gray-600">Статистика по вашим товарам и рекламе</p>
            </div>
          </div>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="Eye" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-blue-700">Просмотры товаров</p>
                <p className="text-2xl font-bold text-blue-900">{analytics.product_views}</p>
              </div>
            </div>
            <p className="text-xs text-blue-600">Сколько раз фермеры просмотрели ваши товары</p>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Icon name="MessageSquare" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-green-700">Запросы от ферм</p>
                <p className="text-2xl font-bold text-green-900">{analytics.farm_requests}</p>
              </div>
            </div>
            <p className="text-xs text-green-600">Количество запросов от фермеров</p>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-purple-700">Доход от комиссий</p>
                <p className="text-2xl font-bold text-purple-900">{analytics.commission_revenue.toLocaleString()} ₽</p>
              </div>
            </div>
            <p className="text-xs text-purple-600">Ваш доход с продаж через платформу</p>
          </Card>
        </div>
      </Card>
      
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Icon name="Info" className="text-blue-600 flex-shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-semibold text-blue-900">Как работает аналитика</p>
            <p className="text-blue-700">
              Данные обновляются в реальном времени. Просмотры учитываются при показе ваших товаров фермерам. 
              Запросы — это обращения фермеров напрямую к вам. Комиссия начисляется с продаж через платформу.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}