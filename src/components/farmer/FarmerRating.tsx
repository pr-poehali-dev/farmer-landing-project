import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { FARMER_API } from '@/types/farm.types';

const RATING_API = 'https://functions.poehali.dev/ae7c97c0-1d46-4334-9a0c-5a8e54209875';

interface FarmerRatingProps {
  onGoToDiagnostics?: () => void;
}

interface RatingBreakdown {
  region: number;
  land: number;
  animal: number;
  equipment: number;
  crop: number;
  staff: number;
  finance: number;
}

interface RatingData {
  totalRating: number;
  breakdown: RatingBreakdown;
  coefficients: Record<string, number>;
  weighted: RatingBreakdown;
}

export default function FarmerRating({ onGoToDiagnostics }: FarmerRatingProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadRating();
    }
  }, [user]);

  const loadRating = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const [diagResponse, profileResponse] = await Promise.all([
        fetch(`${FARMER_API}?action=get_diagnosis`, {
          headers: { 'X-User-Id': user.id.toString() }
        }),
        fetch(`${FARMER_API}?action=get_profile`, {
          headers: { 'X-User-Id': user.id.toString() }
        })
      ]);

      const diagData = await diagResponse.json();
      const profileData = await profileResponse.json();

      const diagnostics = diagData.diagnosis?.assets?.[0] || {};
      const profile = profileData.profile || {};

      const ratingResponse = await fetch(RATING_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          diagnostics,
          profile
        })
      });

      if (!ratingResponse.ok) {
        throw new Error('Ошибка при расчёте рейтинга');
      }

      const ratingData = await ratingResponse.json();
      setRating(ratingData);
    } catch (err) {
      setError('Не удалось загрузить рейтинг');
      console.error('Rating error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRatingLevel = (score: number) => {
    if (score >= 600) return { label: 'Отличный', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 450) return { label: 'Хороший', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 300) return { label: 'Средний', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 150) return { label: 'Базовый', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Начальный', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const criteria = [
    { key: 'region', label: 'Регион', icon: 'MapPin', description: 'Климат и инфраструктура' },
    { key: 'land', label: 'Земля', icon: 'Landmark', description: 'Площадь и владение' },
    { key: 'animal', label: 'Животные', icon: 'Beef', description: 'Поголовье и продуктивность' },
    { key: 'equipment', label: 'Техника', icon: 'Truck', description: 'Количество и состояние' },
    { key: 'crop', label: 'Культуры', icon: 'Wheat', description: 'Урожайность и площадь' },
    { key: 'staff', label: 'Сотрудники', icon: 'Users', description: 'Численность персонала' },
    { key: 'finance', label: 'Финансы', icon: 'DollarSign', description: 'Потенциал прибыли' }
  ];

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Icon name="Loader2" className="animate-spin mr-2" size={24} />
          <p className="text-gray-600">Рассчитываем рейтинг...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <Icon name="AlertCircle" className="mx-auto mb-4 text-red-500" size={48} />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadRating}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Попробовать снова
        </button>
      </Card>
    );
  }

  if (!rating) {
    return (
      <Card className="p-8 text-center">
        <Icon name="Info" className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-600">Заполните диагностику для расчёта рейтинга</p>
      </Card>
    );
  }

  const level = getRatingLevel(rating.totalRating);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Icon name="Info" className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2">📊 Откуда берутся баллы?</h3>
            <p className="text-sm text-gray-700 mb-3">
              Рейтинг считается автоматически из данных вашей диагностики: животные, земля, техника, культуры, сотрудники, финансы и регион.
            </p>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Бонусы за сложность:</strong> Работаете в тяжёлых условиях? Получаете коэффициенты ×1.1-1.2 к баллам!
            </p>
            {onGoToDiagnostics && (
              <Button 
                onClick={onGoToDiagnostics}
                variant="outline" 
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Перейти к диагностике
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-4 shadow-xl">
            <div>
              <div className="text-4xl font-bold">{Math.round(rating.totalRating)}</div>
              <div className="text-sm opacity-90">баллов</div>
            </div>
          </div>
          <div className={`inline-block px-4 py-2 rounded-full ${level.bg} ${level.color} font-semibold mb-2`}>
            {level.label}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ваш рейтинг фермера</h2>
          <p className="text-gray-600 text-sm">Сумма всех критериев с учётом коэффициентов</p>
        </div>

        <div className="space-y-4">
          {criteria.map((criterion) => {
            const score = rating.breakdown[criterion.key as keyof RatingBreakdown];
            const coefficient = rating.coefficients[criterion.key];
            const weighted = rating.weighted[criterion.key as keyof RatingBreakdown];
            
            return (
              <div key={criterion.key} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon name={criterion.icon as any} className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{criterion.label}</div>
                      <div className="text-xs text-gray-500">{criterion.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-gray-800">{score}</div>
                    <div className="text-xs text-gray-500">× {coefficient} = {Math.round(weighted)}</div>
                  </div>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Icon name="Lightbulb" className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Как улучшить рейтинг?</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {rating.breakdown.animal < 50 && <li>• Увеличьте поголовье скота или улучшите его продуктивность</li>}
              {rating.breakdown.crop < 50 && <li>• Расширьте площадь посевов или повысьте урожайность</li>}
              {rating.breakdown.equipment < 50 && <li>• Обновите парк техники или добавьте навесное оборудование</li>}
              {rating.breakdown.land < 50 && <li>• Увеличьте земельные площади</li>}
              {rating.breakdown.staff < 50 && <li>• Наймите дополнительных сотрудников</li>}
              {rating.totalRating >= 600 && <li>✅ Отличная работа! Вы эффективный фермер!</li>}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}