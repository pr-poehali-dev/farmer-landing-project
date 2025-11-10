import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl">🐄</span>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-farmer-green">ФАРМЕР</h1>
            <span className="text-2xl sm:text-3xl">🌾</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Button onClick={() => navigate('/leaderboard')} variant="ghost" className="text-sm lg:text-base text-gray-700 hover:text-farmer-green">
              <Icon name="Trophy" size={14} className="lg:w-4 lg:h-4 mr-1" />
              Лидеры
            </Button>
            <Button onClick={() => navigate('/about')} variant="ghost" className="text-sm lg:text-base text-gray-700 hover:text-farmer-green">
              О нас
            </Button>
            <Button onClick={() => navigate('/faq')} variant="ghost" className="text-sm lg:text-base text-gray-700 hover:text-farmer-green">
              FAQ
            </Button>
            <Button onClick={() => navigate('/contacts')} variant="ghost" className="text-sm lg:text-base text-gray-700 hover:text-farmer-green">
              Контакты
            </Button>
            <Button onClick={() => navigate('/login')} variant="ghost" className="text-sm lg:text-base text-farmer-green">
              Войти
            </Button>
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <Button onClick={() => navigate('/leaderboard')} variant="ghost" className="text-xs text-gray-700 px-2">
              <Icon name="Trophy" size={14} className="mr-0.5" />
              Лидеры
            </Button>
            <Button onClick={() => navigate('/about')} variant="ghost" className="text-xs text-gray-700 px-2">
              О нас
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;