import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const SellersSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100/30">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Icon name="Truck" size={32} className="sm:w-9 sm:h-9 md:w-10 md:h-10 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 text-center sm:text-left">
            Стань частью живого цикла: помоги фермам цвести
          </h2>
        </div>

        <Card className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white shadow-2xl border-2 border-blue-500/20">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8 md:mb-10 text-center">
            Ты знаешь, как твои товары (удобрения, техника) могут исцелить землю, но трудно найти 'своих' фермеров. 
            В 'Фармер' войди в круг — узнай нужды хозяйств, предлагай прямо, размещай рекламу. Вместе мы сохраним 
            настоящее: еду, полную энергии и здоровья, вместо искусственного. Это то, что ты давно искал — 
            партнерство, где твои инструменты питают жизнь, усиливая связь между городом и полем.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
            <Card className="p-4 sm:p-5 md:p-6 bg-blue-50/50 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Icon name="BarChart3" size={20} className="sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Доступ к аналитике</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                Узнай секреты ферм для точных предложений (подписка 10000 руб./мес)
              </p>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 bg-blue-50/50 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Icon name="ShoppingCart" size={20} className="sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Прямые продажи</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                Предлагай товары с комиссией платформы
              </p>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 bg-blue-50/50 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Icon name="Monitor" size={20} className="sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Баннерная реклама</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                Вдохновляй хранителей на рост
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate('/register?role=seller')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base lg:text-lg px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-5 lg:py-6 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              <Icon name="Rocket" size={18} className="sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 mr-2" />
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