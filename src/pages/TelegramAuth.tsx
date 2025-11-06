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
      const urlParams = new URLSearchParams(window.location.search);
      const role = urlParams.get('role') || 'farmer';
      
      setError('Telegram авторизация временно недоступна. Используйте вход через ВКонтакте или Яндекс.');
      setLoading(false);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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