import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const TestAccounts = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const testAccounts = [
    {
      role: 'farmer',
      email: 'farmer@test.ru',
      password: 'test123',
      name: 'Иван Фермеров',
      dashboard: '/dashboard/farmer',
      icon: 'Tractor',
      color: 'farmer-green',
      description: 'Диагностика хозяйства, создание предложений'
    },
    {
      role: 'investor',
      email: 'investor@test.ru',
      password: 'test123',
      name: 'Петр Инвестов',
      dashboard: '/dashboard/investor',
      icon: 'TrendingUp',
      color: 'farmer-orange',
      description: 'Просмотр предложений, инвестиции, портфель'
    },
    {
      role: 'seller',
      email: 'seller@test.ru',
      password: 'test123',
      name: 'Сергей Продавцов',
      dashboard: '/dashboard/seller',
      icon: 'ShoppingBag',
      color: 'farmer-green',
      description: 'Товары, реклама, продажи'
    }
  ];

  const handleLogin = async (email: string, password: string, dashboard: string) => {
    try {
      await login(email, password);
      toast.success('Вход выполнен!');
      navigate(dashboard);
    } catch (error: any) {
      toast.error(error.message || 'Ошибка входа');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmer-green/5 to-farmer-orange/5">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-farmer-green hover:bg-farmer-green/10"
      >
        <Icon name="Home" size={20} className="mr-2" />
        На главную
      </Button>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Тестовые аккаунты</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Войдите в любой аккаунт, чтобы увидеть кабинет фермера, инвестора или продавца.
            Все данные уже заполнены для демонстрации.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testAccounts.map((account) => (
            <Card key={account.role} className="p-6 hover:shadow-xl transition-shadow">
              <div className={`w-16 h-16 bg-${account.color}/10 rounded-full flex items-center justify-center mb-4`}>
                <Icon name={account.icon as any} size={32} className={`text-${account.color}`} />
              </div>
              
              <h2 className="text-2xl font-bold mb-2 text-gray-900">{account.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{account.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-mono text-gray-900">{account.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Пароль:</span>
                  <span className="font-mono text-gray-900">{account.password}</span>
                </div>
              </div>

              <Button
                onClick={() => handleLogin(account.email, account.password, account.dashboard)}
                className={`w-full bg-${account.color} hover:bg-${account.color}-dark text-white`}
              >
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти как {account.role === 'farmer' ? 'Фермер' : account.role === 'investor' ? 'Инвестор' : 'Продавец'}
              </Button>
            </Card>
          ))}
        </div>

        <Card className="mt-12 p-8 max-w-4xl mx-auto bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5">
          <h3 className="text-xl font-bold mb-4 text-gray-900">📊 Что можно посмотреть</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-farmer-green mb-2">Кабинет Фермера</h4>
              <ul className="text-gray-700 space-y-1">
                <li>✓ Диагностика хозяйства</li>
                <li>✓ 3 активных предложения</li>
                <li>✓ Статистика фермы</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-farmer-orange mb-2">Кабинет Инвестора</h4>
              <ul className="text-gray-700 space-y-1">
                <li>✓ 3 доступных предложения</li>
                <li>✓ 2 активные инвестиции</li>
                <li>✓ Портфель инвестиций</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-farmer-green mb-2">Кабинет Продавца</h4>
              <ul className="text-gray-700 space-y-1">
                <li>✓ 4 товара в каталоге</li>
                <li>✓ 2 активных рекламы</li>
                <li>✓ Статистика продаж</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Хотите зарегистрировать собственный аккаунт?
          </p>
          <Button
            onClick={() => navigate('/register')}
            variant="outline"
            className="border-farmer-green text-farmer-green hover:bg-farmer-green hover:text-white"
          >
            Создать новый аккаунт
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestAccounts;
