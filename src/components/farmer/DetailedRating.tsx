import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const RATING_URL = 'https://functions.poehali.dev/6e3852b3-e6e1-478e-b710-869bd1a377d8';

interface Rating {
  productivity_score: number;
  tech_score: number;
  investment_score: number;
  expertise_score: number;
  community_score: number;
  total_score: number;
}

export default function DetailedRating({ userId }: { userId: string }) {
  const [rating, setRating] = useState<Rating>({
    productivity_score: 0,
    tech_score: 0,
    investment_score: 0,
    expertise_score: 0,
    community_score: 0,
    total_score: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRating();
  }, [userId]);

  const loadRating = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${RATING_URL}?action=get_scores`, {
        headers: { 'X-User-Id': userId }
      });
      const data = await response.json();
      
      setRating({
        productivity_score: data.productivity_score || 0,
        tech_score: data.tech_score || 0,
        investment_score: data.investment_score || 0,
        expertise_score: data.expertise_score || 0,
        community_score: data.community_score || 0,
        total_score: data.total_score || 0
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
          action: 'calculate_scores'
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
      name: 'Продуктивность',
      value: rating.productivity_score,
      icon: 'Wheat',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Мастерство растениеводства и урожайность культур'
    },
    {
      name: 'Технологичность',
      value: rating.tech_score,
      icon: 'Settings',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Технологический уровень и современная техника'
    },
    {
      name: 'Инвестиции',
      value: rating.investment_score,
      icon: 'TrendingUp',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Эффективность животноводства и инвестиционная привлекательность'
    },
    {
      name: 'Экспертность',
      value: rating.expertise_score,
      icon: 'Award',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Земельные ресурсы и профессиональная экспертиза'
    },
    {
      name: 'Социальный капитал',
      value: rating.community_score,
      icon: 'Users',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Масштаб бизнеса и количество сотрудников'
    }
  ];

  const maxValue = Math.max(...categories.map(c => c.value), 100);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{rating.total_score}</h2>
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