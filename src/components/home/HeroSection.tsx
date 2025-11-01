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
        <p className="text-lg text-gray-600 mb-4">Вернись к корням — почувствуй пульс настоящей жизни</p>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          В суете города мы забыли вкус земли...
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
          Но без ферм — только тени еды, лишенные души и силы. Представь: свежий мед, что несет энергию солнца; 
          молоко от коровы, которую ты "усыновил" и видишь в видео; мясо, выросшее на вольных полях.
        </p>
        <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto mb-10 font-medium">
          Это не инвестиции — это связь с настоящим. Без фермеров мы питаемся искусственным, теряя здоровье и радость.
        </p>
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
          className="bg-farmer-orange hover:bg-farmer-orange-dark text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Вернись к истокам — зарегистрируйся сейчас!
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
