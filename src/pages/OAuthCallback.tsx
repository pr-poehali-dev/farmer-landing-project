import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (error) {
      toast.error(`Ошибка авторизации: ${error}`);
      navigate('/login');
      return;
    }
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        setAuthData({
          token,
          user: {
            id: payload.user_id,
            email: payload.email,
            role: payload.role,
            name: payload.name || ''
          }
        });

        toast.success('Вход выполнен успешно!');

        if (payload.role === 'farmer') {
          navigate('/dashboard/farmer');
        } else if (payload.role === 'investor') {
          navigate('/dashboard/investor');
        } else {
          navigate('/dashboard/seller');
        }
      } catch (e) {
        console.error('Invalid token:', e);
        toast.error('Неверный токен авторизации');
        navigate('/login');
      }
    } else {
      toast.error('Токен не найден');
      navigate('/login');
    }
  }, [searchParams, navigate, setAuthData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmer-green/5 to-farmer-orange/5 flex items-center justify-center">
      <div className="text-center">
        <Icon name="Loader2" size={48} className="animate-spin text-farmer-green mx-auto mb-4" />
        <p className="text-gray-600">Вход через социальную сеть...</p>
      </div>
    </div>
  );
}