import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-900">
          Один шаг — и ты в мире, где земля благодарит
        </h2>
        <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5">
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            Представь: фермер делит корову на доли — ты берешь свою, следишь за ней в видео, 
            получаешь свежие продукты. Это не сделка — это история жизни, где твоя поддержка 
            спасает от искусственного, возвращая здоровье и энергию всем нам.
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Button
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-farmer-green hover:bg-farmer-green-dark text-white text-xs sm:text-sm md:text-base lg:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 lg:py-6 w-full sm:w-auto"
            >
              Присоединиться к движению
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CallToActionSection;