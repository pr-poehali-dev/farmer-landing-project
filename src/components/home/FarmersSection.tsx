import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const FarmersSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-farmer-orange/10 via-white to-farmer-orange/5">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-20 h-20 bg-farmer-orange/20 rounded-full flex items-center justify-center">
            <Icon name="Wheat" size={40} className="text-farmer-orange" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Твоя ферма — сердце земли: дай ей силу расти
          </h2>
        </div>

        <Card className="p-10 bg-white shadow-2xl border-2 border-farmer-orange/20">
          <p className="text-xl text-gray-700 leading-relaxed mb-10 text-center">
            Ты борешься с бурями и одиночеством, но знаешь: без твоих рук мир потеряет настоящую еду. 
            В 'Фармер' найди союзников — люди из городов помогут деньгами и заботой, без цепей кредитов. 
            Поделись своей историей: поля, что кормят поколения. Стань частью сообщества, где твоя энергия умножается, 
            а здоровье земли — твое наследие. Это то, что ты давно искал — поддержка, которая оживляет мечты.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="p-6 bg-farmer-orange/5 border-2 border-farmer-orange/20 hover:border-farmer-orange/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-farmer-orange/20 rounded-full flex items-center justify-center">
                  <Icon name="BarChart3" size={24} className="text-farmer-orange" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Диагностика и аналитика</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Почувствуй, как твоя земля оживает через данные (подписка 1500 руб./мес)
              </p>
            </Card>

            <Card className="p-6 bg-farmer-orange/5 border-2 border-farmer-orange/20 hover:border-farmer-orange/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-farmer-orange/20 rounded-full flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-farmer-orange" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Привлечение инвестиций</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Привлеки хранителей для твоих полей с комиссией
              </p>
            </Card>

            <Card className="p-6 bg-farmer-orange/5 border-2 border-farmer-orange/20 hover:border-farmer-orange/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-farmer-orange/20 rounded-full flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-farmer-orange" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Сообщество</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Дели таинство роста с союзниками
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate('/register?role=farmer')}
              size="lg"
              className="bg-farmer-orange hover:bg-farmer-orange-dark text-white text-base sm:text-lg px-4 sm:px-6 md:px-10 py-4 sm:py-5 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              <Icon name="Sprout" size={22} className="mr-2" />
              <span className="hidden sm:inline">Оживи свою ферму — зарегистрируйся!</span>
              <span className="sm:hidden">Зарегистрируйся!</span>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FarmersSection;