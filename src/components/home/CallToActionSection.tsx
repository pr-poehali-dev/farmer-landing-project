import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
          Один шаг — и ты в мире, где земля благодарит
        </h2>
        <Card className="p-8 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5">
          <p className="text-lg text-gray-700 leading-relaxed">
            Представь: фермер делит корову на доли — ты берешь свою, следишь за ней в видео, 
            получаешь свежие продукты. Это не сделка — это история жизни, где твоя поддержка 
            спасает от искусственного, возвращая здоровье и энергию всем нам.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-farmer-green hover:bg-farmer-green-dark text-white"
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
