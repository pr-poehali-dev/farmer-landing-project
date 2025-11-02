import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const SellersSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100/30">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Icon name="Truck" size={40} className="text-blue-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Стань частью живого цикла: помоги фермам цвести
          </h2>
        </div>

        <Card className="p-10 bg-white shadow-2xl border-2 border-blue-500/20">
          <p className="text-xl text-gray-700 leading-relaxed mb-10 text-center">
            Ты знаешь, как твои товары (удобрения, техника) могут исцелить землю, но трудно найти 'своих' фермеров. 
            В 'Фармер' войди в круг — узнай нужды хозяйств, предлагай прямо, размещай рекламу. Вместе мы сохраним 
            настоящее: еду, полную энергии и здоровья, вместо искусственного. Это то, что ты давно искал — 
            партнерство, где твои инструменты питают жизнь, усиливая связь между городом и полем.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="p-6 bg-blue-50/50 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Icon name="BarChart3" size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Доступ к аналитике</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Узнай секреты ферм для точных предложений (подписка 10000 руб./мес)
              </p>
            </Card>

            <Card className="p-6 bg-blue-50/50 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Icon name="ShoppingCart" size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Прямые продажи</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Предлагай товары с комиссией платформы
              </p>
            </Card>

            <Card className="p-6 bg-blue-50/50 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Icon name="Monitor" size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Баннерная реклама</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Вдохновляй хранителей на рост
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate('/register?role=seller')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg px-4 sm:px-6 md:px-10 py-4 sm:py-5 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              <Icon name="Rocket" size={22} className="mr-2" />
              <span className="hidden sm:inline">Поддержи рост — зарегистрируйся!</span>
              <span className="sm:hidden">Зарегистрируйся!</span>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SellersSection;