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
    const urlParams = new URLSearchParams(window.location.search);
    const telegramData = urlParams.get('id');
    
    if (telegramData) {
      console.log('✅ Получены данные от Telegram, отправка в backend...');
      const role = urlParams.get('role') || 'farmer';
      const params = new URLSearchParams({
        id: urlParams.get('id') || '',
        first_name: urlParams.get('first_name') || '',
        last_name: urlParams.get('last_name') || '',
        username: urlParams.get('username') || '',
        photo_url: urlParams.get('photo_url') || '',
        auth_date: urlParams.get('auth_date') || '',
        hash: urlParams.get('hash') || '',
        role: role
      });
      
      const backendUrl = `https://functions.poehali.dev/33163ee7-3ed1-48f9-bba0-99a0cd3088af?${params.toString()}`;
      console.log('🔗 Редирект на backend:', backendUrl);
      window.location.href = backendUrl;
      return;
    }
    
    const loadTelegramWidget = async () => {
      try {
        console.log('🔵 Загрузка Telegram виджета...');
        const botUsername = 'ImFarmer_bot';
        const role = urlParams.get('role') || 'farmer';
        
        console.log('📱 Бот:', botUsername);
        console.log('👤 Роль:', role);

        const callbackUrl = `https://farmer-landing-project.poehali.dev/oauth/telegram?role=${role}`;
        console.log('🔗 Callback URL:', callbackUrl);

        const iframe = document.createElement('iframe');
        iframe.src = `https://oauth.telegram.org/auth?bot_id=YOUR_BOT_ID&origin=${encodeURIComponent('https://farmer-landing-project.poehali.dev')}&request_access=write&return_to=${encodeURIComponent(callbackUrl)}`;
        iframe.width = '100%';
        iframe.height = '186';
        iframe.style.border = 'none';
        iframe.scrolling = 'no';
        
        const container = document.getElementById('telegram-login-container');
        if (container) {
          container.appendChild(iframe);
          console.log('📦 Telegram iframe добавлен');
          setLoading(false);
        } else {
          console.error('❌ Контейнер для iframe не найден');
          setError('Ошибка загрузки');
          setLoading(false);
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