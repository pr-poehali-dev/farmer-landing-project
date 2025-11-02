import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Stats {
  farmers: number;
  investors: number;
  sellers: number;
  total: number;
}

interface HeroSectionProps {
  stats: Stats;
}

const HeroSection = ({ stats }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-farmer-green/10 via-white to-farmer-orange/10 min-h-screen flex items-center">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Вернись к корням — почувствуй <span className="text-farmer-green animate-pulse">пульс</span> настоящей жизни
        </h1>
        <div className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed space-y-4">
          <p className="animate-[fadeIn_0.8s_ease-in]">
            Городская суета стерла вкус настоящей земли... Без ферм — лишь бледные тени еды, лишенные силы, 
            и это сокровище может кануть в небытие.
          </p>



        </div>
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-farmer-green mb-1">{stats.farmers}</div>
            <div className="text-sm text-gray-600">Фермеров</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-farmer-orange mb-1">{stats.investors}</div>
            <div className="text-sm text-gray-600">Инвесторов</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-farmer-green mb-1">{stats.sellers}</div>
            <div className="text-sm text-gray-600">Продавцов</div>
          </div>
        </div>
        <Button
          onClick={() => navigate('/register')}
          size="lg"
          className="bg-farmer-orange hover:bg-farmer-orange-dark text-white text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto max-w-full"
        >
          <span className="hidden sm:inline">Вернись к истокам — зарегистрируйся сейчас!</span>
          <span className="sm:hidden">Зарегистрируйся сейчас!</span>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;