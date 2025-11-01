import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const AUTH_API = 'https://functions.poehali.dev/0a0119c5-f173-40c2-bc49-c845a420422f';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'reset'>(resetToken ? 'reset' : 'request');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Введите email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password_request',
          email: email.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка запроса');
      }

      toast.success('Проверьте результат ниже');
      toast.info(`Токен сброса: ${data.reset_token}`);
      
      const resetUrl = `${window.location.origin}/reset-password?token=${data.reset_token}`;
      toast.info('Скопируйте эту ссылку для сброса пароля');
      
      navigator.clipboard.writeText(resetUrl);
      toast.success('Ссылка скопирована в буфер обмена');
      
    } catch (error: any) {
      toast.error(error.message || 'Ошибка запроса сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Заполните все поля');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Пароль должен быть минимум 6 символов');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          reset_token: resetToken,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сброса пароля');
      }

      toast.success('Пароль успешно изменен!');
      setTimeout(() => navigate('/login'), 1500);
      
    } catch (error: any) {
      toast.error(error.message || 'Ошибка сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <Icon name="KeyRound" size={48} className="text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">
          {step === 'request' ? 'Восстановление пароля' : 'Новый пароль'}
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          {step === 'request' 
            ? 'Введите ваш email для получения токена сброса'
            : 'Введите новый пароль для вашего аккаунта'}
        </p>

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" size={18} className="mr-2" />
                  Получить токен сброса
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Вернуться к входу
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Check" size={18} className="mr-2" />
                  Сохранить новый пароль
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Вернуться к входу
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
