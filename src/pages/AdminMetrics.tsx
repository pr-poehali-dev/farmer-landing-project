import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const METRICS_API = 'https://functions.poehali.dev/e07a87af-9e24-471c-b21c-3cc12b198981';

interface MetricsData {
  users?: {
    dau: number;
    mau: number;
    total: number;
    by_role: Record<string, number>;
    daily_signups: Array<{ date: string; count: number }>;
  };
  financial?: {
    total_investments: number;
    total_revenue: number;
    avg_investment: number;
    daily_revenue: Array<{ date: string; revenue: number }>;
  };
  proposals?: {
    total: number;
    active: number;
    recent_week: number;
    by_type: Record<string, number>;
    daily_proposals: Array<{ date: string; count: number }>;
  };
  regions?: {
    top_regions: Array<{ name: string; users: number; proposals: number }>;
  };
  engagement?: {
    avg_gamification_points: number;
    max_gamification_points: number;
    active_farmers_week: number;
    active_investors_week: number;
  };
}

const COLORS = ['#16a34a', '#ea580c', '#2563eb', '#ca8a04', '#dc2626', '#7c3aed'];

const AdminMetrics = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${METRICS_API}?type=all`);
      if (!res.ok) throw new Error(t('messages.error'));
      const data = await res.json();
      setMetrics(data);
    } catch (err: any) {
      toast.error(err.message || t('messages.error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-farmer-green mx-auto mb-4" />
          <p className="text-gray-600">{t('messages.loading_data')}</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{t('messages.error')}</h2>
          <Button onClick={() => navigate('/admin')}>{t('common.back')}</Button>
        </Card>
      </div>
    );
  }

  const roleData = metrics.users?.by_role
    ? Object.entries(metrics.users.by_role).map(([name, value]) => ({
        name: name === 'farmer' ? t('auth.farmer') : name === 'investor' ? t('auth.investor') : t('auth.seller'),
        value,
      }))
    : [];

  const typeData = metrics.proposals?.by_type
    ? Object.entries(metrics.proposals.by_type).map(([name, value]) => ({
        name: name === 'income' ? t('farmer.income') : name === 'patronage' ? t('farmer.patronage') : t('farmer.products'),
        value,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <Icon name="BarChart3" size={24} className="text-farmer-green sm:w-8 sm:h-8" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{t('admin.metrics')}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button onClick={loadMetrics} variant="outline" size="sm" className="hidden sm:flex">
                <Icon name="RefreshCw" size={18} className="mr-2" />
                {t('common.refresh')}
              </Button>
              <Button onClick={loadMetrics} variant="outline" size="sm" className="sm:hidden">
                <Icon name="RefreshCw" size={18} />
              </Button>
              <Button onClick={() => navigate('/admin')} variant="outline" size="sm" className="hidden sm:flex">
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                {t('common.back')}
              </Button>
              <Button onClick={() => navigate('/admin')} variant="outline" size="sm" className="sm:hidden">
                <Icon name="ArrowLeft" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.users && (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Users" size={28} className="text-farmer-green" />
                  <span className="text-3xl font-bold text-gray-900">{metrics.users.dau}</span>
                </div>
                <p className="text-gray-600 font-medium">{t('admin.dau')}</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="UserCheck" size={28} className="text-farmer-orange" />
                  <span className="text-3xl font-bold text-gray-900">{metrics.users.mau}</span>
                </div>
                <p className="text-gray-600 font-medium">{t('admin.mau')}</p>
              </Card>
            </>
          )}

          {metrics.financial && (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="DollarSign" size={28} className="text-farmer-green" />
                  <span className="text-2xl font-bold text-gray-900">
                    {(metrics.financial.total_revenue || 0).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Total Revenue</p>
                <p className="text-xs text-gray-500 mt-1">Общая выручка</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="TrendingUp" size={28} className="text-farmer-orange" />
                  <span className="text-2xl font-bold text-gray-900">
                    {(metrics.financial.avg_investment || 0).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Avg Investment</p>
                <p className="text-xs text-gray-500 mt-1">Средняя инвестиция</p>
              </Card>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {metrics.users && metrics.users.daily_signups.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon name="UserPlus" size={20} className="text-farmer-green" />
                Регистрации пользователей (30 дней)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[...metrics.users.daily_signups].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString('ru-RU')}
                    formatter={(value) => [`${value} регистраций`, 'Пользователи']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} name="Регистрации" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {metrics.financial && metrics.financial.daily_revenue.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon name="DollarSign" size={20} className="text-farmer-orange" />
                Выручка по дням (30 дней)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[...metrics.financial.daily_revenue].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString('ru-RU')}
                    formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, 'Выручка']}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#ea580c" name="Выручка" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roleData.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon name="PieChart" size={20} className="text-farmer-green" />
                Пользователи по ролям
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                    {roleData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {typeData.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon name="FileText" size={20} className="text-farmer-orange" />
                Предложения по типам
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                    {typeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {metrics.engagement && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon name="Activity" size={20} className="text-farmer-green" />
                Активность (неделя)
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Активные фермеры:</span>
                  <span className="text-2xl font-bold text-farmer-green">{metrics.engagement.active_farmers_week}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Активные инвесторы:</span>
                  <span className="text-2xl font-bold text-farmer-orange">{metrics.engagement.active_investors_week}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ср. баллы геймиф.:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {(metrics.engagement.avg_gamification_points || 0).toFixed(0)}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {metrics.proposals && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className="text-farmer-green" />
              Динамика создания предложений
            </h3>
            {metrics.proposals.daily_proposals.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[...metrics.proposals.daily_proposals].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString('ru-RU')}
                    formatter={(value) => [`${value} предложений`, 'Создано']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} name="Предложения" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">Нет данных за последние 30 дней</p>
            )}
          </Card>
        )}

        {metrics.regions && metrics.regions.top_regions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="MapPin" size={20} className="text-farmer-orange" />
              Топ-10 регионов
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Регион</th>
                    <th className="text-right py-2 px-3">Пользователи</th>
                    <th className="text-right py-2 px-3">Предложения</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.regions.top_regions.map((region, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{region.name}</td>
                      <td className="text-right py-2 px-3 font-semibold text-farmer-green">{region.users}</td>
                      <td className="text-right py-2 px-3 font-semibold text-farmer-orange">{region.proposals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminMetrics;