import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const RolesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Выбери свой путь к настоящему
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Три роли в экосистеме — стань частью живого цикла земли
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-farmer-orange">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-farmer-orange/10 rounded-full flex items-center justify-center">
                <Icon name="Wheat" size={24} className="text-farmer-orange" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Для Фермеров</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Ты борешься с бурями и одиночеством, но знаешь: без твоих рук мир потеряет настоящую еду. 
              В 'Фармер' найди союзников — люди из городов помогут деньгами и заботой, без цепей кредитов.
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-orange mt-1 flex-shrink-0" />
                <span>Диагностика и аналитика земли (1500 руб./мес)</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-orange mt-1 flex-shrink-0" />
                <span>Привлечение инвестиций с комиссией</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-orange mt-1 flex-shrink-0" />
                <span>Сообщество союзников</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register?role=farmer')}
              className="w-full bg-farmer-orange hover:bg-farmer-orange-dark"
            >
              Оживи свою ферму
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-farmer-green">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-farmer-green/10 rounded-full flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-farmer-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Для Инвесторов</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Ты устал от синтетической еды, что крадет энергию? В "Фармер" инвестируй в живые фермы — 
              получи свежий мед, мясо или даже "свою" корову с видео-новостями.
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-green mt-1 flex-shrink-0" />
                <span>Доход от полей и долей</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-green mt-1 flex-shrink-0" />
                <span>Получение натуральных продуктов</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-green mt-1 flex-shrink-0" />
                <span>Патронаж и видео-отчеты</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register?role=investor')}
              className="w-full bg-farmer-green hover:bg-farmer-green-dark"
            >
              Стань хранителем природы
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Icon name="Truck" size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Для Продавцов</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Ты знаешь, как твои товары (удобрения, техника) могут исцелить землю, но трудно найти 'своих' фермеров. 
              В 'Фармер' войди в круг — узнай нужды хозяйств, предлагай прямо.
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                <span>Доступ к аналитике ферм (10000 руб./мес)</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                <span>Прямые продажи с комиссией</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                <span>Баннерная реклама</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register?role=seller')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Поддержи рост
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
