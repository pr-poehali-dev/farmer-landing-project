import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const RATING_URL = 'https://functions.poehali.dev/6651f712-61f5-44b8-827f-dd095dffa4f6';

interface Rating {
  total: number;
  yield: number;
  technology: number;
  social: number;
  investment: number;
  professionalism: number;
}

export default function DetailedRating({ userId }: { userId: string }) {
  const [rating, setRating] = useState<Rating>({
    total: 0,
    yield: 0,
    technology: 0,
    social: 0,
    investment: 0,
    professionalism: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRating();
  }, [userId]);

  const loadRating = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${RATING_URL}?action=get_rating`, {
        headers: { 'X-User-Id': userId }
      });
      const data = await response.json();
      
      setRating({
        total: data.rating_total || 0,
        yield: data.rating_yield || 0,
        technology: data.rating_technology || 0,
        social: data.rating_social || 0,
        investment: data.rating_investment || 0,
        professionalism: data.rating_professionalism || 0
      });
    } catch (error) {
      console.error('Ошибка загрузки рейтинга:', error);
    } finally {
      setLoading(false);
    }
  };

  const recalculate = async () => {
    setLoading(true);
    try {
      await fetch(RATING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'calculate',
          farmer_id: userId
        })
      });
      await loadRating();
    } catch (error) {
      console.error('Ошибка пересчета:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: 'Урожайность',
      value: rating.yield,
      icon: 'Wheat',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Показатели урожайности культур и продуктивности животноводства'
    },
    {
      name: 'Технологичность',
      value: rating.technology,
      icon: 'Settings',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Использование современной техники и агротехнологий'
    },
    {
      name: 'Социальный капитал',
      value: rating.social,
      icon: 'Users',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Количество сотрудников и площадь земли в собственности'
    },
    {
      name: 'Инвестиции',
      value: rating.investment,
      icon: 'TrendingUp',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Привлечение инвестиций и закупка новой техники'
    },
    {
      name: 'Профессионализм',
      value: rating.professionalism,
      icon: 'Award',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Заполненность профиля и разнообразие деятельности'
    }
  ];

  const maxValue = Math.max(...categories.map(c => c.value), 100);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{rating.total}</h2>
            <p className="text-gray-600">Общий рейтинг</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <Icon name="Trophy" size={40} className="text-yellow-600" />
          </div>
        </div>
        <Button onClick={recalculate} disabled={loading} className="w-full">
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Пересчитать рейтинг
        </Button>
      </Card>

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.name} className={`p-4 ${category.bgColor}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0`}>
                <Icon name={category.icon as any} className={category.color} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <span className={`text-lg font-bold ${category.color}`}>{category.value}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <Progress value={(category.value / maxValue) * 100} className="h-2" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-blue-50">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Icon name="Info" size={18} className="text-blue-600" />
          Как повысить рейтинг?
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Добавьте детальную информацию о культурах и урожайности</li>
          <li>• Укажите данные о животных (надои, выход мяса)</li>
          <li>• Заполните информацию о технике и агротехнологиях</li>
          <li>• Добавьте сотрудников и площадь земли в собственности</li>
          <li>• Привлекайте инвестиции через платформу</li>
        </ul>
      </Card>
    </div>
  );
}
