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
    <div className="min-h-screen bg-gradient-to-br from-farmer-green/5 to-farmer-orange/5 flex items-center justify-center px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-farmer-green hover:bg-farmer-green/10"
      >
        <Icon name="Home" size={20} className="mr-2" />
        {t('nav.home')}
      </Button>
      <div className="absolute top-4 right-4">
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