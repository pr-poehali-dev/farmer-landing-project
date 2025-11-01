import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const InvestmentTypesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Виды инвестиций: выбери свой путь к настоящему
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Три способа стать частью движения — от пассивного дохода до эмоциональной связи с землёй
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-farmer-green">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-farmer-green/10 rounded-full flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-farmer-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Для дохода</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Стань совладельцем земли или коровы — твои вложения растут как урожай, возвращая здоровье через настоящую еду. Это стабильность и вклад в природу без суеты.
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-green mt-1 flex-shrink-0" />
                <span>Гектар земли с рапсом, кукурузой, соей или чесноком</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-green mt-1 flex-shrink-0" />
                <span>Доля в молочной корове — прибыль от натурального молока</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register?role=investor')}
              className="w-full bg-farmer-green hover:bg-farmer-green-dark"
            >
              Начать инвестировать
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-farmer-orange">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-farmer-orange/10 rounded-full flex items-center justify-center">
                <Icon name="ShoppingBag" size={24} className="text-farmer-orange" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Продукт</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Вложи в живое — и получи назад вкус земли: мясо от «твоей» коровы или овощи, полные энергии. Без искусственного — только дар природы, который питает здоровье.
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-orange mt-1 flex-shrink-0" />
                <span>Мясо от коровы — натуральное, полное сил</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-farmer-orange mt-1 flex-shrink-0" />
                <span>Свежие овощи: салат, свекла, кукуруза для здоровья</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register?role=investor')}
              className="w-full bg-farmer-orange hover:bg-farmer-orange-dark"
            >
              Получить продукты
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Icon name="Eye" size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Патронаж</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Стань покровителем — следи за «своей» коровой или полем в видео, почувствуй связь с настоящим. Это не деньги — это роль в истории земли, где ты зритель чуда природы.
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                <span>Видеообновления: еженедельно или ежемесячно</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                <span>Эмоциональная связь с фермой без финансовых рисков</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register?role=investor')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Стать покровителем
            </Button>
          </Card>
        </div>

        <Card className="p-8 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5 text-center">
          <p className="text-lg text-gray-700 leading-relaxed italic mb-6">
            «Представь: фермер делит корову на доли — ты берешь свою, следишь за ней в видео, 
            получаешь свежие продукты. Это не сделка — это история жизни, где твоя поддержка 
            спасает от искусственного, возвращая здоровье и энергию всем нам.»
          </p>
          <Button
            onClick={() => navigate('/register')}
            size="lg"
            className="bg-farmer-green hover:bg-farmer-green-dark text-white"
          >
            <Icon name="Rocket" size={20} className="mr-2" />
            Присоединиться к движению
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default InvestmentTypesSection;
