import { useState, useEffect } from 'react';
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
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">{t('auth.or_continue_with')}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = 'https://functions.poehali.dev/oauth?provider=telegram';
            }}
          >
            <Icon name="Send" size={18} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = 'https://functions.poehali.dev/oauth?provider=vk';
            }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.567-1.497c.579-.19 1.321 1.26 2.108 1.818.595.422 1.048.33 1.048.33l2.106-.03s1.102-.07.579-.967c-.043-.074-.306-.665-1.575-1.882-1.329-1.275-1.15-1.069.449-3.273.974-1.341 1.363-2.16 1.241-2.51-.116-.334-.832-.246-.832-.246l-2.371.015s-.176-.025-.306.056c-.127.078-.209.262-.209.262s-.373 1.027-.871 1.9c-1.05 1.84-1.471 1.938-1.643 1.823-.4-.267-.3-1.073-.3-1.645 0-1.788.262-2.532-.511-2.725-.257-.064-.446-.106-1.103-.113-.843-.009-1.556.003-1.96.207-.268.136-.475.439-.349.456.156.022.509.098.696.361.242.34.233 1.104.233 1.104s.139 2.104-.324 2.366c-.318.18-.754-.187-1.69-1.865-.479-.853-.841-1.797-.841-1.797s-.07-.176-.194-.271c-.151-.114-.362-.15-.362-.15l-2.253.015s-.338.01-.462.161c-.11.134-.009.412-.009.412s1.754 4.237 3.738 6.373c1.821 1.958 3.888 1.828 3.888 1.828h.938z"/>
            </svg>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = 'https://functions.poehali.dev/oauth?provider=yandex';
            }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm3.863 17.202h-2.511l-3.306-5.369v5.369H7.535V6.798h2.511v4.985l3.205-4.985h2.612l-3.306 5.063 3.306 5.341z"/>
            </svg>
          </Button>
        </div>
        
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