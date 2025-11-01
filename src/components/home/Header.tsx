import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Sprout" size={32} className="text-farmer-green" />
            <h1 className="text-2xl font-bold text-farmer-green">ФЕРМА.LIFE</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Button onClick={() => navigate('/about')} variant="ghost" className="text-gray-700 hover:text-farmer-green">
              О нас
            </Button>
            <Button onClick={() => navigate('/faq')} variant="ghost" className="text-gray-700 hover:text-farmer-green">
              FAQ
            </Button>
            <Button onClick={() => navigate('/contacts')} variant="ghost" className="text-gray-700 hover:text-farmer-green">
              Контакты
            </Button>
            <Button onClick={() => navigate('/login')} variant="ghost" className="text-farmer-green">
              Войти
            </Button>
            <Button onClick={() => navigate('/register')} className="bg-farmer-green hover:bg-farmer-green-dark text-white">
              Регистрация
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
