import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const FarmersSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-farmer-orange/10 via-white to-farmer-green/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Экосистема настоящей еды
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Фермеры предлагают, инвесторы вкладывают — вместе возрождаем связь с землёй
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
          <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-farmer-orange/5 to-farmer-orange/10 border-2 border-farmer-orange/30 shadow-xl">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-farmer-orange/20 rounded-full flex items-center justify-center">
                <Icon name="Wheat" size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-farmer-orange" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Для фермеров
              </h3>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
              Ты борешься с бурями и одиночеством, но знаешь: без твоих рук мир потеряет настоящую еду. 
              Найди союзников — люди из городов помогут деньгами и заботой, без цепей кредитов.
            </p>

            <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="TrendingUp" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Привлекай инвестиции</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Предлагай доли в урожае и животных, получай финансирование напрямую</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="BarChart3" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Диагностика земли</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Получай аналитику состояния почвы и рекомендации по урожаю</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Award" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Рейтинг и сравнение</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Сравнивай показатели с другими фермами и расти эффективнее</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="ShoppingCart" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Маркетплейс удобрений</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Покупай удобрения напрямую, смотри что используют лучшие фермы</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Users" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Сообщество</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Делись опытом и получай поддержку коллег по всей стране</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/register?role=farmer')}
              size="lg"
              className="w-full bg-farmer-orange hover:bg-farmer-orange-dark text-white text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Icon name="Sprout" size={18} className="sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 mr-2" />
              Стать фермером
            </Button>
          </Card>

          <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-farmer-green/5 to-farmer-green/10 border-2 border-farmer-green/30 shadow-xl">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-farmer-green/20 rounded-full flex items-center justify-center">
                <Icon name="HandCoins" size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-farmer-green" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Для инвесторов
              </h3>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
              Стань частью настоящего: инвестируй в фермы и получай доход, продукты или эмоциональную связь с землёй. 
              Три способа поддержать фермеров и получить результат.
            </p>

            <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="TrendingUp" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Доход</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Стань совладельцем земли и получай прибыль от урожая</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="ShoppingBag" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Продукт</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Получай натуральные продукты с фермы без химии и посредников</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Eye" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Патронаж</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Следи за фермой в видео, получай обновления и почувствуй связь</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Shield" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Прозрачность</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Видь рейтинг фермера и отзывы инвесторов перед вложением</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Trophy" size={16} className="sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Сообщество</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Соревнуйся в рейтинге ферм, сравнивай портфели и делись успехами</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/register?role=investor')}
              size="lg"
              className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Icon name="Heart" size={18} className="sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 mr-2" />
              Стать инвестором
            </Button>
          </Card>
        </div>

        <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-farmer-orange/5 via-white to-farmer-green/5 border-2 border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Icon name="Sprout" size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-farmer-orange" />
                <Icon name="ArrowRight" size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
                <Icon name="HandCoins" size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-farmer-green" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                Как это работает?
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Фермер создаёт предложение → Инвестор выбирает тип инвестиции → Получает доход, продукты или эмоции
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/register?role=farmer')}
                variant="outline"
                className="border-farmer-orange text-farmer-orange hover:bg-farmer-orange hover:text-white"
              >
                Я фермер
              </Button>
              <Button
                onClick={() => navigate('/register?role=investor')}
                className="bg-farmer-green hover:bg-farmer-green-dark"
              >
                Я инвестор
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FarmersSection;