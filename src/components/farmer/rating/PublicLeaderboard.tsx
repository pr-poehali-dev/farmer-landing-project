import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
  rank: number;
  farmName: string;
  region: string;
  score: number;
  userId: string;
}

export default function PublicLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<'overall' | 'crop_master' | 'livestock_champion' | 'agro_innovator'>('overall');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const ratingOptions = [
    { value: 'overall', label: 'Общий рейтинг', icon: 'Trophy', color: 'text-yellow-600' },
    { value: 'crop_master', label: 'Мастер Земли', icon: 'Wheat', color: 'text-green-600' },
    { value: 'livestock_champion', label: 'Животноводческий Чемпион', icon: 'Beef', color: 'text-blue-600' },
    { value: 'agro_innovator', label: 'Агро-Инноватор', icon: 'Cpu', color: 'text-purple-600' },
  ];

  const regions = [
    { value: 'all', label: 'Все регионы' },
    { value: 'moscow', label: 'Москва и МО' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'novosibirsk', label: 'Новосибирская область' },
    { value: 'krasnodar', label: 'Краснодарский край' },
    { value: 'altai', label: 'Алтайский край' },
    { value: 'buryatia', label: 'Бурятия' },
  ];

  useEffect(() => {
    loadLeaderboard();
  }, [selectedRating, selectedRegion]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const ratingUrl = 'https://functions.poehali.dev/6e3852b3-e6e1-478e-b710-869bd1a377d8';
      const response = await fetch(`${ratingUrl}?action=leaderboard&category=${selectedRating}&region=${selectedRegion}`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Ошибка загрузки лидерборда:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const currentRating = ratingOptions.find(r => r.value === selectedRating);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50">
        <div className="flex items-center gap-3 mb-2">
          {currentRating && <Icon name={currentRating.icon} size={28} className={currentRating.color} />}
          <h1 className="text-3xl font-bold text-gray-900">Рейтинг фермерских хозяйств России</h1>
        </div>
        <p className="text-gray-600">Сравните свои показатели с лучшими хозяйствами страны</p>
      </Card>

      <Card className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Категория рейтинга</label>
            <Select value={selectedRating} onValueChange={(value: any) => setSelectedRating(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon name={option.icon} size={16} className={option.color} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Регион</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Место</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Хозяйство</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Регион</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Баллы</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Icon name="Loader2" className="animate-spin mx-auto text-gray-400" size={32} />
                  </td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Данных пока нет. Станьте первым в рейтинге!
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr key={entry.userId} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Icon name="Trophy" size={20} className="text-yellow-500" />}
                        {index === 1 && <Icon name="Medal" size={20} className="text-gray-400" />}
                        {index === 2 && <Icon name="Medal" size={20} className="text-orange-600" />}
                        <span className="font-semibold text-gray-900">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{entry.farmName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{entry.region}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-lg text-gray-900">{Math.round(entry.score)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Как попасть в рейтинг?</h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Зарегистрируйтесь в личном кабинете фермера</li>
              <li>Заполните данные о вашем хозяйстве во вкладке "Моё хозяйство"</li>
              <li>Укажите информацию о земле, животных, культурах и технике</li>
              <li>Рейтинг рассчитается автоматически на основе ваших данных</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}
