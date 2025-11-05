import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';

interface RatingScores {
  overall: number;
  nominations: {
    crop_master: number;
    livestock_champion: number;
    agro_innovator: number;
  };
  categories_normalized: {
    land_power: number;
    livestock_efficiency: number;
    crop_mastery: number;
    tech_advancement: number;
    business_scale: number;
  };
}

interface RatingData {
  profileId: string;
  scores: RatingScores;
  rank?: number;
  region?: string;
}

export default function RatingDashboard() {
  const { user } = useAuth();
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRating();
    }
  }, [user]);

  const loadRating = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const ratingUrl = 'https://functions.poehali.dev/6e3852b3-e6e1-478e-b710-869bd1a377d8';
      
      const response = await fetch(ratingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({ action: 'calculate_scores' })
      });
      
      const data = await response.json();
      setRatingData(data);
    } catch (error) {
      console.error('Ошибка загрузки рейтинга:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!ratingData) {
    return (
      <Card className="p-8 text-center">
        <Icon name="TrendingUp" size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold mb-2">Рейтинг не рассчитан</h3>
        <p className="text-gray-600">Заполните данные о хозяйстве во вкладке "Моё хозяйство"</p>
      </Card>
    );
  }

  const { scores, rank, region } = ratingData;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Trophy" size={24} className="text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Общий рейтинг</h2>
            </div>
            <p className="text-gray-600">Ваш интегральный показатель</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-yellow-600">{Math.round(scores.overall)}</div>
            <div className="text-sm text-gray-600 mt-1">из 1000 баллов</div>
            {rank && (
              <div className="text-sm font-semibold text-gray-700 mt-2">
                Место в регионе: #{rank}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Wheat" size={20} className="text-green-600" />
            <h3 className="font-semibold text-gray-900">Мастер Земли</h3>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {Math.round(scores.nominations.crop_master)}
          </div>
          <p className="text-xs text-gray-600 mt-1">Эффективность растениеводства</p>
        </Card>

        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Beef" size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Животноводческий Чемпион</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round(scores.nominations.livestock_champion)}
          </div>
          <p className="text-xs text-gray-600 mt-1">Продуктивность животноводства</p>
        </Card>

        <Card className="p-4 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Cpu" size={20} className="text-purple-600" />
            <h3 className="font-semibold text-gray-900">Агро-Инноватор</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {Math.round(scores.nominations.agro_innovator)}
          </div>
          <p className="text-xs text-gray-600 mt-1">Технологичность хозяйства</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} className="text-gray-600" />
          Детализация по категориям
        </h3>
        <div className="space-y-4">
          {[
            { key: 'land_power', label: 'Земельные ресурсы', color: 'bg-green-500', icon: 'Home' },
            { key: 'livestock_efficiency', label: 'Эффективность животноводства', color: 'bg-blue-500', icon: 'Beef' },
            { key: 'crop_mastery', label: 'Мастерство растениеводства', color: 'bg-yellow-500', icon: 'Wheat' },
            { key: 'tech_advancement', label: 'Технологический уровень', color: 'bg-purple-500', icon: 'Cpu' },
            { key: 'business_scale', label: 'Масштаб бизнеса', color: 'bg-orange-500', icon: 'Users' },
          ].map(({ key, label, color, icon }) => {
            const value = scores.categories_normalized[key as keyof typeof scores.categories_normalized];
            const percentage = (value / 1000) * 100;
            
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name={icon} size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{Math.round(value)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-gray-50">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Как улучшить рейтинг?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Добавьте больше данных о животных с показателями продуктивности</li>
              <li>• Укажите урожайность и технологии для культур</li>
              <li>• Внесите информацию о технике вашего хозяйства</li>
              <li>• Заполните данные о сотрудниках</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}