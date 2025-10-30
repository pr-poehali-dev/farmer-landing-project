import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
            💡 О платформе
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Как это работает</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 shadow-soft rounded-3xl border-0 text-center">
            <Icon name="Shield" className="text-green-600 mx-auto mb-4" size={40} />
            <h4 className="text-xl font-bold mb-2">Страховка сделок</h4>
            <p className="text-gray-600">Все инвестиции защищены</p>
          </Card>

          <Card className="p-8 shadow-soft rounded-3xl border-0 text-center">
            <Icon name="BarChart3" className="text-green-600 mx-auto mb-4" size={40} />
            <h4 className="text-xl font-bold mb-2">Прозрачная аналитика</h4>
            <p className="text-gray-600">Данные в реальном времени</p>
          </Card>

          <Card className="p-8 shadow-soft rounded-3xl border-0 text-center">
            <Icon name="Users" className="text-green-600 mx-auto mb-4" size={40} />
            <h4 className="text-xl font-bold mb-2">Взаимная выгода</h4>
            <p className="text-gray-600">Все стороны в плюсе</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
