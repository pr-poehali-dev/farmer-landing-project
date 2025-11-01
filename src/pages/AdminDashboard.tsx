import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const STATS_API = 'https://functions.poehali.dev/dde2cfb3-048c-41f8-b40d-cc6a53590929';

interface AdminStats {
  overview: {
    users_by_role: Record<string, number>;
    total_proposals: number;
    active_proposals: number;
    total_investments: number;
    total_invested: number;
  };
  users: Array<{
    id: number;
    email: string;
    name: string;
    role: string;
    created_at: string;
    proposals_count: number;
    investments_count: number;
  }>;
  proposals: Array<{
    id: number;
    description: string;
    price: number;
    shares: number;
    type: string;
    status: string;
    farmer_name: string;
    farmer_email: string;
    investors_count: number;
  }>;
  regions: Array<{
    name: string;
    count: number;
  }>;
}

const ADMIN_PASSWORD = 'Krasnopeev95!';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      loadStats();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      loadStats();
    } else {
      toast.error('Неверный пароль');
      setPassword('');
    }
  };

  const loadStats = () => {
    setLoading(true);
    fetch(`${STATS_API}?action=admin`, {
      headers: { 'X-User-Id': '1' }
    })
      .then(res => {
        if (!res.ok) throw new Error('Доступ запрещён');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        toast.error(err.message || 'Ошибка загрузки статистики');
        setLoading(false);
      });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setStats(null);
    toast.success('Вы вышли из админ-панели');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <Card className="p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Icon name="Lock" size={48} className="text-farmer-green mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Панель Администратора</h1>
            <p className="text-gray-600 mt-2">Введите пароль для доступа</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="text-center text-lg"
              autoFocus
            />
            <Button type="submit" className="w-full bg-farmer-green hover:bg-farmer-green-dark">
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full"
            >
              На главную
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-farmer-green mx-auto mb-4" />
          <p className="text-gray-600">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">Не удалось загрузить статистику</p>
          <Button onClick={() => navigate('/')}>На главную</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="BarChart3" size={32} className="text-farmer-green" />
              <h1 className="text-2xl font-bold text-gray-900">Панель Администратора</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/admin/delete-users')} variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                <Icon name="UserX" size={18} className="mr-2" />
                Удалить пользователей
              </Button>
              <span className="text-gray-700">Администратор</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Users" size={32} className="text-farmer-green" />
              <span className="text-3xl font-bold text-gray-900">
                {Object.values(stats.overview.users_by_role).reduce((a, b) => a + b, 0)}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Всего пользователей</p>
            <div className="mt-3 text-sm text-gray-500">
              Фермеров: {stats.overview.users_by_role.farmer || 0} | 
              Инвесторов: {stats.overview.users_by_role.investor || 0} | 
              Продавцов: {stats.overview.users_by_role.seller || 0}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="FileText" size={32} className="text-farmer-orange" />
              <span className="text-3xl font-bold text-gray-900">{stats.overview.total_proposals}</span>
            </div>
            <p className="text-gray-600 font-medium">Всего предложений</p>
            <div className="mt-3 text-sm text-gray-500">
              Активных: {stats.overview.active_proposals}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="TrendingUp" size={32} className="text-farmer-green" />
              <span className="text-3xl font-bold text-gray-900">{stats.overview.total_investments}</span>
            </div>
            <p className="text-gray-600 font-medium">Всего инвестиций</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="DollarSign" size={32} className="text-farmer-orange" />
              <span className="text-3xl font-bold text-gray-900">
                {stats.overview.total_invested.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <p className="text-gray-600 font-medium">Сумма инвестиций</p>
          </Card>
        </div>

        {stats.regions.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="MapPin" size={24} className="text-farmer-green" />
              Фермеры по регионам
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {stats.regions.map((region, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{region.name}</span>
                  <span className="font-bold text-farmer-green">{region.count}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Users" size={24} className="text-farmer-green" />
              Последние пользователи
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.users.map(user => (
                <div key={user.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'farmer' ? 'bg-farmer-green/10 text-farmer-green' :
                      user.role === 'investor' ? 'bg-farmer-orange/10 text-farmer-orange' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {user.role === 'farmer' ? 'Фермер' : user.role === 'investor' ? 'Инвестор' : 'Продавец'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Предложений: {user.proposals_count}</span>
                    <span>Инвестиций: {user.investments_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="FileText" size={24} className="text-farmer-orange" />
              Последние предложения
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.proposals.map(proposal => (
                <div key={proposal.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-900 flex-1">{proposal.description}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ml-2 ${
                      proposal.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {proposal.status === 'active' ? 'Активно' : 'Закрыто'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Фермер: {proposal.farmer_name}</p>
                    <p>Email: {proposal.farmer_email}</p>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-700">
                    <span className="font-medium">{proposal.price.toLocaleString('ru-RU')} ₽</span>
                    <span>Долей: {proposal.shares}</span>
                    <span>Инвесторов: {proposal.investors_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;