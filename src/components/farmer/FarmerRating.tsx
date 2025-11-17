import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { FARMER_API } from '@/types/farm.types';

const RATING_API = 'https://functions.poehali.dev/ae7c97c0-1d46-4334-9a0c-5a8e54209875';
const LEADERBOARD_API = 'https://functions.poehali.dev/11800a2e-728b-4d50-b1d0-a322d419d556';

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
  region?: string;
  farmName?: string;
}

interface LeaderboardEntry {
  position: number;
  userId: number;
  name: string;
  email: string;
  region: string;
  totalScore: number;
  farmName: string;
  address?: string;
  description?: string;
  animals?: Array<{type: string; count: number}>;
  crops?: Array<{type: string; area: number}>;
  investmentCount?: number;
}

export default function FarmerRating({ onGoToDiagnostics }: FarmerRatingProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<RatingData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadRating();
      loadLeaderboard();
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
      setRating({ ...ratingData, region: profile.region, farmName: profile.farm_name });
    } catch (err) {
      setError('Не удалось загрузить рейтинг');
      console.error('Rating error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${LEADERBOARD_API}?limit=50&current_user_id=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке рейтинга');
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setFilteredLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Leaderboard error:', err);
    }
  };

  const normalizeRegion = (region: string): string => {
    if (!region || region === 'Не указан') return 'Не указан';
    
    const normalized = region.trim().toLowerCase();
    
    if (normalized.includes('бурят')) return 'Республика Бурятия';
    if (normalized.includes('москов') && !normalized.includes('область')) return 'г. Москва';
    if (normalized.includes('санкт-петербург') || normalized.includes('спб')) return 'г. Санкт-Петербург';
    if (normalized.includes('ленинград')) return 'Ленинградская область';
    if (normalized.includes('московск')) return 'Московская область';
    if (normalized.includes('краснодар')) return 'Краснодарский край';
    if (normalized.includes('тамбов')) return 'Тамбовская область';
    if (normalized.includes('белгород')) return 'Белгородская область';
    
    return region.replace(/,.*$/, '').trim();
  };

  const handleRegionFilter = (region: string) => {
    setSelectedRegion(region);
    if (region === 'all') {
      setFilteredLeaderboard(leaderboard);
    } else {
      const filtered = leaderboard.filter(entry => normalizeRegion(entry.region) === region);
      setFilteredLeaderboard(filtered);
    }
  };

  const uniqueRegions = Array.from(
    new Set(
      leaderboard
        .map(e => normalizeRegion(e.region))
        .filter(r => r !== 'Не указан')
    )
  ).sort();

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
      <Card className="p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 border-blue-200">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-3 shadow-xl">
              <div>
                <div className="text-4xl font-bold">{Math.round(rating.totalRating)}</div>
                <div className="text-sm opacity-90">баллов</div>
              </div>
            </div>
            <div className={`inline-block px-4 py-2 rounded-full ${level.bg} ${level.color} font-semibold text-sm`}>
              {level.label}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>💎</span> Ваш рейтинг фермера
            </h2>
            <p className="text-gray-600 text-sm mb-4">Баллы начисляются за:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>🌾</span> <strong>Культуры</strong> — посевы и урожайность
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>🐄</span> <strong>Животные</strong> — поголовье и породы
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>🚜</span> <strong>Техника</strong> — количество и состояние
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>👥</span> <strong>Сотрудники</strong> — постоянные и сезонные
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>🗺️</span> <strong>Земля</strong> — площадь и регион
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>💰</span> <strong>Финансы</strong> — потенциал прибыли
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-yellow-800">
                <strong>🎯 Бонусы:</strong> Суровый климат, бедные почвы или редкие породы? Коэффициенты ×1.1-1.2!
              </p>
            </div>

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🏆</span> Рейтинг фермеров
          </h3>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Регион:</span>
            <select 
              value={selectedRegion}
              onChange={(e) => handleRegionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все регионы ({leaderboard.length})</option>
              {uniqueRegions.map(region => {
                const count = leaderboard.filter(e => e.region === region).length;
                return (
                  <option key={region} value={region}>
                    {region} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredLeaderboard.map((entry, idx) => {
            const isCurrentUser = user && entry.userId === user.id;
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
            const bgClass = isCurrentUser 
              ? 'bg-blue-50 border-blue-300 border-2' 
              : idx === 0 
                ? 'bg-yellow-50 border-yellow-200 border-2' 
                : idx === 1 || idx === 2 
                  ? 'bg-orange-50 border-orange-200 border-2' 
                  : 'bg-gray-50 border-gray-200 border';
            
            const animalEmojis: Record<string, string> = {
              'cows': '🐄',
              'pigs': '🐷',
              'chickens': '🐔',
              'sheep': '🐑',
              'horses': '🐴',
              'deer': '🦌',
              'hives': '🐝'
            };
            
            const cropEmojis: Record<string, string> = {
              'wheat': '🌾',
              'barley': '🌾',
              'corn': '🌽',
              'sunflower': '🌻',
              'potato': '🥔',
              'vegetables': '🥕',
              'fruits': '🍎',
              'other': '🌱'
            };
            
            const displayAnimals = (entry.animals || []).slice(0, 5).map(a => animalEmojis[a.type] || '🐾');
            const displayCrops = (entry.crops || []).slice(0, 5).map(c => cropEmojis[c.type] || '🌱');
            
            return (
              <div key={entry.userId} className={`p-4 rounded-lg ${bgClass} transition-all hover:shadow-md`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 min-w-[60px]">
                      {medal && <span className="text-2xl">{medal}</span>}
                      {isCurrentUser && <Icon name="User" size={18} className="text-blue-600" />}
                      <span className={`font-bold ${isCurrentUser ? 'text-blue-600' : 'text-gray-600'}`}>
                        #{idx + 1}
                      </span>
                    </div>
                    <div>
                      <div className={`font-bold ${isCurrentUser ? 'text-blue-600' : 'text-gray-800'} mb-1`}>
                        {entry.farmName}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Icon name="MapPin" size={14} />
                            <span>{entry.region}</span>
                          </div>
                          {displayAnimals.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-lg">{displayAnimals.join(' ')}</span>
                            </div>
                          )}
                          {displayCrops.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-lg">{displayCrops.join(' ')}</span>
                            </div>
                          )}
                          {(entry.investmentCount || 0) > 0 && (
                            <div className="flex items-center gap-1">
                              <Icon name="TrendingUp" size={14} className="text-green-600" />
                              <span className="text-xs text-gray-700 font-semibold">{entry.investmentCount}</span>
                            </div>
                          )}
                        </div>
                        {entry.address && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Icon name="Home" size={12} />
                            <span>{entry.address.length > 50 ? entry.address.substring(0, 50) + '...' : entry.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    {entry.description && (
                      <div className="text-xs text-gray-600 italic max-w-[200px] text-left">
                        {entry.description.length > 60 ? entry.description.substring(0, 60) + '...' : entry.description}
                      </div>
                    )}
                    <div className="min-w-[80px]">
                      <div className={`font-bold ${idx < 3 ? 'text-2xl' : 'text-xl'} ${isCurrentUser ? 'text-blue-600' : 'text-farmer-green'}`}>
                        {entry.totalScore}
                      </div>
                      <div className="text-xs text-gray-500">баллов</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Нет данных о фермерах
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
          Рейтинг обновляется ежедневно на основе данных диагностики
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