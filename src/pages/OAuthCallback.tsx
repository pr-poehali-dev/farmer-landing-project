import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/ui/icon';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const provider = searchParams.get('provider');
    
    console.log('🔐 OAuth Callback получен');
    console.log('📦 Параметры:', { token: token ? '✅ есть' : '❌ нет', role, provider });
    
    if (token) {
      console.log('💾 Сохранение токена в localStorage');
      localStorage.setItem('token', token);
      
      if (setAuthToken) {
        console.log('✅ Установка токена через useAuth');
        setAuthToken(token);
      }
      
      console.log(`🎯 Роль пользователя: ${role || 'не указана'}`);
      
      setTimeout(() => {
        if (role === 'farmer') {
          console.log('🚀 Редирект на: /dashboard/farmer');
          navigate('/dashboard/farmer');
        } else if (role === 'investor') {
          console.log('🚀 Редирект на: /dashboard/investor');
          navigate('/dashboard/investor');
        } else if (role === 'seller') {
          console.log('🚀 Редирект на: /dashboard/seller');
          navigate('/dashboard/seller');
        } else {
          console.log('🚀 Редирект на: /dashboard/investor (по умолчанию)');
          navigate('/dashboard/investor');
        }
      }, 1000);
    } else {
      console.error('❌ Токен не найден в URL');
      setTimeout(() => {
        console.log('🔙 Возврат на страницу входа');
        navigate('/login');
      }, 2000);
    }
  }, [searchParams, navigate, setAuthToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmer-green/5 to-farmer-orange/5 flex items-center justify-center">
      <div className="text-center">
        <Icon name="Loader2" size={48} className="animate-spin text-farmer-green mx-auto mb-4" />
        <p className="text-gray-600">Вход через социальную сеть...</p>
      </div>
    </div>
  );
}