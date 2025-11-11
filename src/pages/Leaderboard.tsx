import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const LEADERBOARD_URL = 'https://functions.poehali.dev/6e3852b3-e6e1-478e-b710-869bd1a377d8';

interface LeaderboardEntry {
  user_id: string;
  farm_name: string;
  region: string;
  score: number;
  rank: number;
  details?: any;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'farmer' | 'investor'>('farmer');
  const [nomination, setNomination] = useState('total');
  const [region, setRegion] = useState('');
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [nomination, region, role]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('action', 'leaderboard');
      
      if (role === 'farmer') {
        params.append('category', nomination);
      }
      params.append('period', 'all-time');
      
      const response = await fetch(`${LEADERBOARD_URL}?${params}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const nominations = [
    { value: 'total', label: 'Общий рейтинг', icon: 'Trophy', color: 'bg-yellow-500' },
    { value: 'земля', label: 'Мастер Земли', icon: 'Wheat', color: 'bg-amber-500' },
    { value: 'молоко', label: 'Молочный Чемпион', icon: 'Milk', color: 'bg-blue-500' },
    { value: 'мясо', label: 'Мясной Лидер', icon: 'Beef', color: 'bg-red-500' },
    { value: 'техника', label: 'Техно-Фермер', icon: 'Settings', color: 'bg-purple-500' }
  ];

  const regions = [
    'Московская область',
    'Краснодарский край',
    'Ростовская область',
    'Республика Татарстан',
    'Воронежская область'
  ];

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-300';
  };

  const currentNomination = nominations.find(n => n.value === nomination);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🏆 Лидеры</h1>
              <p className="text-sm text-gray-600">Рейтинг лучших фермерских хозяйств</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={role === 'farmer' ? 'default' : 'outline'}
              onClick={() => setRole('farmer')}
              className="flex-1"
            >
              <Icon name="Tractor" size={18} className="mr-2" />
              Топ-5 хозяйств
            </Button>
            <Button
              variant={role === 'investor' ? 'default' : 'outline'}
              onClick={() => setRole('investor')}
              className="flex-1"
            >
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Топ-5 инвесторов
            </Button>
          </div>

          {role === 'farmer' && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Номинация</label>
                <Select value={nomination} onValueChange={setNomination}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nominations.map(nom => (
                      <SelectItem key={nom.value} value={nom.value}>
                        {nom.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Регион</label>
                <Select value={region || 'all'} onValueChange={(val) => setRegion(val === 'all' ? '' : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все регионы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все регионы</SelectItem>
                    {regions.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {role === 'farmer' && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {nominations.map(nom => (
                <Button
                  key={nom.value}
                  variant={nomination === nom.value ? 'default' : 'outline'}
                  onClick={() => setNomination(nom.value)}
                  className="whitespace-nowrap"
                >
                  <Icon name={nom.icon as any} size={16} className="mr-2" />
                  {nom.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {role === 'farmer' && currentNomination && (
          <Card className={`p-6 mb-6 ${currentNomination.color} text-white`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Icon name={currentNomination.icon as any} size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentNomination.label}</h2>
                <p className="opacity-90">
                  {nomination === 'total' && 'Топ хозяйств по общему рейтингу'}
                  {nomination === 'земля' && 'Лучшие показатели урожайности'}
                  {nomination === 'молоко' && 'Самые высокие надои молока'}
                  {nomination === 'мясо' && 'Максимальный выход мяса'}
                  {nomination === 'техника' && 'Самые технологичные хозяйства'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {role === 'investor' && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Icon name="TrendingUp" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Топ инвесторов</h2>
                <p className="opacity-90">Инвесторы с наибольшими вложениями в фермерство</p>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">Загрузка рейтинга...</p>
          </div>
        ) : data.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Trophy" size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Пока нет данных для этой номинации</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {data.map((entry) => (
              <Card key={entry.user_id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                    {entry.rank <= 3 ? (
                      <Icon name="Medal" size={32} className={getMedalColor(entry.rank)} />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">#{entry.rank}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {entry.farm_name}
                    </h3>
                    <p className="text-sm text-gray-600">{entry.region || 'Регион не указан'}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {role === 'investor' ? `${entry.score.toLocaleString()} ₽` : entry.score}
                    </div>
                    <div className="text-xs text-gray-500">
                      {role === 'investor' ? 'вложено' : 'баллов'}
                    </div>
                  </div>
                </div>
                
                {role === 'farmer' && entry.details && (
                  <div className="mt-3 pt-3 border-t flex gap-4 text-sm text-gray-600">
                    {nomination === 'земля' && (
                      <>
                        <span>Площадь: {entry.details.total_area} га</span>
                        <span>Средняя урожайность: {entry.details.avg_yield.toFixed(2)} т/га</span>
                      </>
                    )}
                    {nomination === 'молоко' && (
                      <>
                        <span>Поголовье: {entry.details.total_heads}</span>
                        <span>Годовой надой: {entry.details.total_production} л</span>
                      </>
                    )}
                    {nomination === 'мясо' && (
                      <>
                        <span>Поголовье: {entry.details.total_heads}</span>
                        <span>Годовой выход: {entry.details.total_production} кг</span>
                      </>
                    )}
                    {nomination === 'техника' && (
                      <>
                        <span>Единиц техники: {entry.details.equipment_count}</span>
                        <span>Средний год: {entry.details.avg_year}</span>
                      </>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}