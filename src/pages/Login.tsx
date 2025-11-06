import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = t('auth.email') + ' ' + t('messages.error');
    if (!formData.password) newErrors.password = t('auth.password') + ' ' + t('messages.error');
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      toast.success(t('messages.login_success'));
      
      if (result.user.role === 'farmer') navigate('/dashboard/farmer');
      else if (result.user.role === 'investor') navigate('/dashboard/investor');
      else navigate('/dashboard/seller');
    } catch (error: any) {
      toast.error(error.message || t('messages.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmer-green/5 to-farmer-orange/5 flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-farmer-green hover:bg-farmer-green/10"
          size="sm"
        >
          <Icon name="Home" size={18} className="sm:mr-2" />
          <span className="hidden sm:inline">{t('nav.home')}</span>
        </Button>
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <Icon name="Sprout" size={40} className="text-farmer-green mr-3" />
          <h1 className="text-3xl font-bold text-farmer-green">ФАРМЕР</h1>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          {t('auth.login_title')}
        </h2>
        <p className="text-center text-gray-600 mb-6">{t('common.welcome')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t('common.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="password">{t('common.password')}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={t('common.password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>
          
          <Button
            type="submit"
            className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                {t('common.loading')}
              </>
            ) : (
              t('common.login')
            )}
          </Button>
        </form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">или войдите через</span>
          </div>
        </div>
        
        {!showRoleSelect ? (
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-blue-700 text-blue-700 hover:bg-blue-50"
              onClick={() => {
                console.log('🔵 Выбран провайдер: ВКонтакте');
                setSelectedProvider('vk');
                setShowRoleSelect(true);
              }}
            >
              <span className="mr-2 text-lg font-bold">VK</span>
              ВКонтакте
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRoleSelect(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Icon name="ArrowLeft" size={16} className="mr-1" />
                Назад
              </Button>
            </div>
            
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">
              Выберите вашу роль
            </h3>
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-green-600 text-green-700 hover:bg-green-50 h-20 flex flex-col items-center justify-center"
              onClick={() => {
                const role = 'farmer';
                console.log(`🌱 Выбрана роль: Фермер (${selectedProvider})`);
                if (selectedProvider === 'vk') {
                  const url = `https://functions.poehali.dev/2d732380-6bbc-402f-890f-a09be08f821b?role=${role}`;
                  console.log('🔗 Редирект на VK:', url);
                  window.location.href = url;
                } else if (selectedProvider === 'yandex') {
                  const url = `https://functions.poehali.dev/c843c083-1be2-4ae4-956f-8aefe9bbd4c0?role=${role}`;
                  console.log('🔗 Редирект на Яндекс:', url);
                  window.location.href = url;
                } else {
                  console.log('🔗 Редирект на Telegram');
                  navigate(`/oauth/telegram?role=${role}`);
                }
              }}
            >
              <Icon name="Sprout" size={24} className="mb-1" />
              <span className="font-semibold">Фермер</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-blue-600 text-blue-700 hover:bg-blue-50 h-20 flex flex-col items-center justify-center"
              onClick={() => {
                const role = 'investor';
                console.log(`📈 Выбрана роль: Инвестор (${selectedProvider})`);
                if (selectedProvider === 'vk') {
                  const url = `https://functions.poehali.dev/2d732380-6bbc-402f-890f-a09be08f821b?role=${role}`;
                  console.log('🔗 Редирект на VK:', url);
                  window.location.href = url;
                } else if (selectedProvider === 'yandex') {
                  const url = `https://functions.poehali.dev/c843c083-1be2-4ae4-956f-8aefe9bbd4c0?role=${role}`;
                  console.log('🔗 Редирект на Яндекс:', url);
                  window.location.href = url;
                } else {
                  console.log('🔗 Редирект на Telegram');
                  navigate(`/oauth/telegram?role=${role}`);
                }
              }}
            >
              <Icon name="TrendingUp" size={24} className="mb-1" />
              <span className="font-semibold">Инвестор</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-orange-600 text-orange-700 hover:bg-orange-50 h-20 flex flex-col items-center justify-center"
              onClick={() => {
                const role = 'seller';
                console.log(`🛒 Выбрана роль: Продавец (${selectedProvider})`);
                if (selectedProvider === 'vk') {
                  const url = `https://functions.poehali.dev/2d732380-6bbc-402f-890f-a09be08f821b?role=${role}`;
                  console.log('🔗 Редирект на VK:', url);
                  window.location.href = url;
                } else if (selectedProvider === 'yandex') {
                  const url = `https://functions.poehali.dev/c843c083-1be2-4ae4-956f-8aefe9bbd4c0?role=${role}`;
                  console.log('🔗 Редирект на Яндекс:', url);
                  window.location.href = url;
                } else {
                  console.log('🔗 Редирект на Telegram');
                  navigate(`/oauth/telegram?role=${role}`);
                }
              }}
            >
              <Icon name="ShoppingCart" size={24} className="mb-1" />
              <span className="font-semibold">Продавец</span>
            </Button>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="text-sm text-farmer-green"
            onClick={() => navigate('/reset-password')}
          >
            {t('auth.forgot_password')}
          </Button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('auth.no_account')}{' '}
            <Button variant="link" onClick={() => navigate('/register')} className="text-farmer-green p-0">
              {t('common.register')}
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;