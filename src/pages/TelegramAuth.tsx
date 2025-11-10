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
        console.log('[TelegramAuth] Загрузка конфигурации OAuth...');
        const response = await fetch('https://functions.poehali.dev/f26c71ea-c1d2-434a-8aa1-f64bbb2bc129');
        console.log('[TelegramAuth] Статус ответа:', response.status);
        
        const config = await response.json();
        console.log('[TelegramAuth] Полученная конфигурация:', JSON.stringify(config, null, 2));
        console.log('[TelegramAuth] config.telegram:', config.telegram);
        console.log('[TelegramAuth] config.telegram?.enabled:', config.telegram?.enabled);
        console.log('[TelegramAuth] config.telegram?.bot_username:', config.telegram?.bot_username);

        if (!config.telegram?.enabled || !config.telegram?.bot_username) {
          console.error('[TelegramAuth] Telegram не настроен. Причина:');
          console.error('  - enabled:', config.telegram?.enabled);
          console.error('  - bot_username:', config.telegram?.bot_username);
          setError('Telegram вход не настроен. Обратитесь к администратору.');
          setLoading(false);
          return;
        }
        
        console.log('[TelegramAuth] Конфигурация валидна, загружаем виджет...');
        console.log('[TelegramAuth] Текущий домен:', window.location.hostname);
        console.log('[TelegramAuth] Полный URL:', window.location.href);
        console.log('[TelegramAuth] Origin:', window.location.origin);

        window.onTelegramAuth = async (user: any) => {
          console.log('[TelegramAuth] Пользователь авторизован:', user);
          const params = new URLSearchParams({
            provider: 'telegram',
            id: user.id,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            username: user.username || '',
            photo_url: user.photo_url || '',
            auth_date: user.auth_date,
            hash: user.hash
          });

          console.log('[TelegramAuth] Редирект на бэкенд OAuth...');
          window.location.href = `https://functions.poehali.dev/7b39755d-a7c6-4546-9f5a-4d3ec725a791?${params.toString()}`;
        };

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', config.telegram.bot_username);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        console.log('[TelegramAuth] Создан скрипт виджета для бота:', config.telegram.bot_username);

        const container = document.getElementById('telegram-login-container');
        if (container) {
          console.log('[TelegramAuth] Добавляем виджет в контейнер...');
          container.appendChild(script);
          setLoading(false);
          console.log('[TelegramAuth] Виджет успешно загружен');
        } else {
          console.error('[TelegramAuth] Контейнер telegram-login-container не найден!');
        }
      } catch (err: any) {
        console.error('[TelegramAuth] Ошибка загрузки виджета:', err);
        console.error('[TelegramAuth] Стек ошибки:', err.stack);
        setError('Не удалось загрузить виджет Telegram');
        toast.error(err.message);
        setLoading(false);
      }
    };

    loadTelegramWidget();
  }, []);

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
        
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">Если виджет не работает, используйте прямую ссылку:</p>
          <a 
            href={`https://oauth.telegram.org/auth?bot_id=YOUR_BOT_ID&origin=${encodeURIComponent(window.location.origin)}&request_access=write&return_to=${encodeURIComponent(window.location.href)}`}
            className="text-blue-600 hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Авторизоваться через Telegram напрямую
          </a>
        </div>
        
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