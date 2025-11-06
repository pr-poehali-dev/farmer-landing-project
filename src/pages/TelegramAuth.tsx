import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

const TelegramAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTelegramWidget = async () => {
      try {
        console.log('🔵 Загрузка Telegram виджета...');
        const botUsername = 'ImFarmer_bot';
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role') || 'farmer';
        
        console.log('📱 Бот:', botUsername);
        console.log('👤 Роль:', role);

        const callbackUrl = `https://functions.poehali.dev/33163ee7-3ed1-48f9-bba0-99a0cd3088af?role=${role}`;
        console.log('🔗 Callback URL:', callbackUrl);

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', botUsername);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-auth-url', callbackUrl);
        script.setAttribute('data-request-access', 'write');
        script.async = true;
        
        script.onerror = () => {
          console.error('❌ Ошибка загрузки Telegram виджета');
          setError('Не удалось загрузить виджет Telegram');
          setLoading(false);
        };
        
        script.onload = () => {
          console.log('✅ Telegram виджет загружен');
          setLoading(false);
        };

        const container = document.getElementById('telegram-login-container');
        if (container) {
          container.appendChild(script);
          console.log('📦 Виджет добавлен в DOM');
        } else {
          console.error('❌ Контейнер для виджета не найден');
        }
      } catch (err: any) {
        console.error('❌ Ошибка:', err);
        setError('Не удалось загрузить виджет Telegram');
        toast.error(err.message);
        setLoading(false);
      }
    };

    loadTelegramWidget();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmer-green/5 to-farmer-orange/5 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <Icon name="Send" size={40} className="text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-blue-600">Telegram</h1>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Вход через Telegram
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {loading ? 'Загрузка...' : error || 'Нажмите кнопку ниже для входа'}
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}
        
        <div id="telegram-login-container" className="flex justify-center mb-6"></div>
        
        <button
          onClick={() => navigate('/login')}
          className="w-full text-center text-sm text-gray-600 hover:text-farmer-green"
        >
          ← Вернуться к входу
        </button>
      </Card>
    </div>
  );
};

export default TelegramAuth;