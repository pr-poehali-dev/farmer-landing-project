import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const RolesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Выбери свой путь к настоящему
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-gray-100 hover:border-farmer-green">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-farmer-green/10 rounded-full flex items-center justify-center">
                <Icon name="TrendingUp" size={32} className="text-farmer-green" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">
              Из шума улиц — к шепоту полей
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Ты устал от синтетической еды, что крадет энергию? В "Фармер" инвестируй в живые фермы — 
              получи свежий мед, мясо или даже "свою" корову с видео-новостями. Почувствуй, как твои вложения 
              питают здоровье, возвращая вкус жизни.
            </p>
            <Button
              onClick={() => navigate('/register?role=investor')}
              className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white"
            >
              Стань хранителем природы
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-gray-100 hover:border-farmer-orange">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-farmer-orange/10 rounded-full flex items-center justify-center">
                <Icon name="Wheat" size={32} className="text-farmer-orange" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">
              Твоя ферма — сердце земли
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Твой труд — дар жизни, но без поддержки фермы увядают. "Фармер" — твой мост к тем, 
              кто ценит настоящее. Привлеки инвестиции в обмен на свежие продукты или доли в урожае. 
              Расти вместе с теми, кто верит в живое.
            </p>
            <Button
              onClick={() => navigate('/register?role=farmer')}
              className="w-full bg-farmer-orange hover:bg-farmer-orange-dark text-white"
            >
              Оживи свою ферму
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-gray-100 hover:border-farmer-green">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-farmer-green/10 rounded-full flex items-center justify-center">
                <Icon name="Package" size={32} className="text-farmer-green" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">
              Стань частью живого цикла
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Продаешь удобрения или технику? В "Фармер" твой товар не просто сделка — это вклад в рост настоящих ферм. 
              Предложи свое фермерам, которые ценят качество, и будь частью движения за живую землю.
            </p>
            <Button
              onClick={() => navigate('/register?role=seller')}
              className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white"
            >
              Поддержи рост
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
