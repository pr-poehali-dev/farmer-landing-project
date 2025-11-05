import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const FarmersSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-farmer-orange/10 via-white to-farmer-green/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Экосистема настоящей еды
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Фермеры предлагают, инвесторы вкладывают — вместе возрождаем связь с землёй
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-gradient-to-br from-farmer-orange/5 to-farmer-orange/10 border-2 border-farmer-orange/30 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-farmer-orange/20 rounded-full flex items-center justify-center">
                <Icon name="Wheat" size={32} className="text-farmer-orange" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Для фермеров
              </h3>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Ты борешься с бурями и одиночеством, но знаешь: без твоих рук мир потеряет настоящую еду. 
              Найди союзников — люди из городов помогут деньгами и заботой, без цепей кредитов.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="TrendingUp" size={20} className="text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Привлекай инвестиции</h4>
                  <p className="text-sm text-gray-600">Предлагай доли в урожае, животных или продуктах</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="BarChart3" size={20} className="text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Диагностика земли</h4>
                  <p className="text-sm text-gray-600">Получай аналитику и данные о состоянии фермы</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Award" size={20} className="text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Рейтинг и сравнение</h4>
                  <p className="text-sm text-gray-600">Сравнивай свою ферму с другими, получай рекомендации по улучшениям</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="ShoppingCart" size={20} className="text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Маркетплейс удобрений</h4>
                  <p className="text-sm text-gray-600">Смотри, какие удобрения используют успешные фермы, и покупай напрямую у продавцов</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Users" size={20} className="text-farmer-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Сообщество</h4>
                  <p className="text-sm text-gray-600">Дели опыт и находи поддержку среди других фермеров</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/register?role=farmer')}
              size="lg"
              className="w-full bg-farmer-orange hover:bg-farmer-orange-dark text-white text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Icon name="Sprout" size={22} className="mr-2" />
              Стать фермером
            </Button>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-farmer-green/5 to-farmer-green/10 border-2 border-farmer-green/30 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-farmer-green/20 rounded-full flex items-center justify-center">
                <Icon name="HandCoins" size={32} className="text-farmer-green" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Для инвесторов
              </h3>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Стань частью настоящего: инвестируй в фермы и получай доход, продукты или эмоциональную связь с землёй. 
              Три способа поддержать фермеров и получить результат.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="TrendingUp" size={20} className="text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Доход</h4>
                  <p className="text-sm text-gray-600">Стань совладельцем земли или коровы — получай прибыль от урожая и роста стоимости активов</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="ShoppingBag" size={20} className="text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Продукт</h4>
                  <p className="text-sm text-gray-600">Вложи в живое — получи натуральные продукты прямо с фермы: мясо, молоко, овощи без химии и посредников</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Eye" size={20} className="text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Патронаж</h4>
                  <p className="text-sm text-gray-600">Следи за своей фермой в видео и фото, получай обновления о жизни животных и росте урожая — почувствуй связь с настоящим</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Shield" size={20} className="text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Прозрачность</h4>
                  <p className="text-sm text-gray-600">Видь полную информацию о фермере, рейтинге и отзывах других инвесторов перед принятием решения</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-farmer-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Trophy" size={20} className="text-farmer-green" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Сообщество</h4>
                  <p className="text-sm text-gray-600">Соревнуйся, чья цифровая ферма круче — сравнивай портфели, делись успехами и находи лучшие инвестиции</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/register?role=investor')}
              size="lg"
              className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Icon name="Heart" size={22} className="mr-2" />
              Стать инвестором
            </Button>
          </Card>
        </div>

        <Card className="p-8 bg-gradient-to-r from-farmer-orange/5 via-white to-farmer-green/5 border-2 border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <Icon name="Sprout" size={32} className="text-farmer-orange" />
                <Icon name="ArrowRight" size={24} className="text-gray-400" />
                <Icon name="HandCoins" size={32} className="text-farmer-green" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Как это работает?
              </h4>
              <p className="text-gray-600">
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