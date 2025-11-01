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
          <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-gray-100 hover:border-farmer-orange">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-farmer-orange/10 rounded-full flex items-center justify-center">
                <Icon name="Wheat" size={32} className="text-farmer-orange" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">
              Твоя ферма — сердце земли: дай ей силу расти
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Ты борешься с бурями и одиночеством, но знаешь: без твоих рук мир потеряет настоящую еду. 
              В 'Фармер' найди союзников — люди из городов помогут деньгами и заботой, без цепей кредитов. 
              Поделись своей историей: поля, что кормят поколения. Стань частью сообщества, где твоя энергия умножается, 
              а здоровье земли — твое наследие. Это то, что ты давно искал — поддержка, которая оживляет мечты.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="BarChart3" size={18} className="text-farmer-orange mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Диагностика и аналитика: Почувствуй, как твоя земля оживает через данные (подписка 1500 руб./мес)</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="TrendingUp" size={18} className="text-farmer-orange mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Привлечение инвестиций: Привлеки хранителей для твоих полей с комиссией</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Users" size={18} className="text-farmer-orange mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Сообщество: Дели таинство роста с союзниками</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register?role=farmer')}
              className="w-full bg-farmer-orange hover:bg-farmer-orange-dark text-white"
            >
              Оживи свою ферму — зарегистрируйся!
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-gray-100 hover:border-farmer-green">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-farmer-green/10 rounded-full flex items-center justify-center">
                <Icon name="Building2" size={32} className="text-farmer-green" />
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
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="DollarSign" size={18} className="text-farmer-green mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Доход от полей</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="ShoppingBag" size={18} className="text-farmer-green mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Получение урожая</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Eye" size={18} className="text-farmer-green mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Патронаж роста</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register?role=investor')}
              className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white"
            >
              Стань хранителем природы
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-gray-100 hover:border-blue-500">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Icon name="Truck" size={32} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">
              Стань частью живого цикла: помоги фермам цвести
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Ты знаешь, как твои товары (удобрения, техника) могут исцелить землю, но трудно найти 'своих' фермеров. 
              В 'Фармер' войди в круг — узнай нужды хозяйств, предлагай прямо, размещай рекламу. Вместе мы сохраним 
              настоящее: еду, полную энергии и здоровья, вместо искусственного. Это то, что ты давно искал — 
              партнерство, где твои инструменты питают жизнь, усиливая связь между городом и полем.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="BarChart3" size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Доступ к аналитике: Узнай секреты ферм для точных предложений (подписка 10000 руб./мес)</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="ShoppingCart" size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Прямые продажи: Предлагай товары с комиссией платформы</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Monitor" size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Баннерная реклама: Вдохновляй хранителей на рост</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register?role=seller')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Поддержи рост — зарегистрируйся!
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RolesSection;