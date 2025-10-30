import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  scrollToSection: (id: string) => void;
}

const Navigation = ({ scrollToSection }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Icon name="Sprout" className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold text-gradient">Фармер</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('farmers')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Фермерам
            </button>
            <button onClick={() => scrollToSection('investors')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Инвесторам
            </button>
            <button onClick={() => scrollToSection('sellers')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Продавцам
            </button>
            <Button asChild className="rounded-full shadow-glow">
              <a href="https://planeta.ru/campaigns/235852" target="_blank" rel="noopener noreferrer">
                Поддержать
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
