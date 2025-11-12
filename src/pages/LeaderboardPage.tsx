import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { FARMER_API } from '@/types/farm.types';

const LEADERBOARD_API = 'https://functions.poehali.dev/11800a2e-728b-4d50-b1d0-a322d419d556';

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

interface FarmerProfile {
  farm_name: string;
  region: string;
  address: string;
  phone: string;
  description: string;
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const leaderboardResponse = await fetch(`${LEADERBOARD_API}?limit=10${user ? `&current_user_id=${user.id}` : ''}`);
      
      if (leaderboardResponse.ok) {
        const data = await leaderboardResponse.json();
        setLeaderboard(data.leaderboard || []);
        
        if (user && data.leaderboard) {
          const userEntry = data.leaderboard.find((entry: LeaderboardEntry) => entry.userId === user.id);
          setCurrentUserEntry(userEntry || null);
        }
      }

      if (user) {
        const profileResponse = await fetch(`${FARMER_API}?action=get_profile`, {
          headers: { 'X-User-Id': user.id.toString() }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData.profile || null);
        }
      }
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-6 text-gray-700 hover:text-farmer-green"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-xl">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span>🏆</span> Топ-10 лучших фермеров
              </h1>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon name="Loader2" className="animate-spin mr-2" size={24} />
                  <p className="text-gray-600">Загрузка рейтинга...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, idx) => {
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
                      <div key={entry.userId} className={`p-5 rounded-lg ${bgClass} transition-all hover:shadow-md`}>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center gap-2 min-w-[70px]">
                              {medal && <span className="text-3xl">{medal}</span>}
                              {isCurrentUser && <Icon name="User" size={20} className="text-blue-600" />}
                              <span className={`font-bold text-lg ${isCurrentUser ? 'text-blue-600' : 'text-gray-600'}`}>
                                #{idx + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className={`font-bold ${isCurrentUser ? 'text-blue-600' : 'text-gray-800'} text-lg mb-1`}>
                                {entry.farmName}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                                <Icon name="MapPin" size={14} />
                                {entry.region}
                              </div>
                              {entry.address && (
                                <div className="text-xs text-gray-500 flex items-start gap-1 mb-2">
                                  <Icon name="Home" size={12} className="mt-0.5" />
                                  <span>{entry.address}</span>
                                </div>
                              )}
                              {entry.description && (
                                <div className="text-sm text-gray-700 mt-2 italic">
                                  {entry.description.length > 100 ? entry.description.substring(0, 100) + '...' : entry.description}
                                </div>
                              )}
                              <div className="flex flex-wrap gap-3 mt-3">
                                {displayAnimals.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">Животные:</span>
                                    <span className="text-lg">{displayAnimals.join(' ')}</span>
                                  </div>
                                )}
                                {displayCrops.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">Культуры:</span>
                                    <span className="text-lg">{displayCrops.join(' ')}</span>
                                  </div>
                                )}
                                {(entry.investmentCount || 0) > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Icon name="TrendingUp" size={14} className="text-green-600" />
                                    <span className="text-xs text-gray-700 font-semibold">
                                      {entry.investmentCount} {entry.investmentCount === 1 ? 'предложение' : 'предложения'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${idx < 3 ? 'text-3xl' : 'text-2xl'} ${isCurrentUser ? 'text-blue-600' : 'text-farmer-green'}`}>
                              {entry.totalScore}
                            </div>
                            <div className="text-xs text-gray-500">баллов</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {leaderboard.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      Нет данных о фермерах
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
                Рейтинг обновляется ежедневно на основе данных диагностики
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {user ? (
              <>
                <Card className="p-6 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Icon name="User" size={20} />
                    Моя информация
                  </h2>

                  {loading ? (
                    <div className="flex items-center justify-center py-6">
                      <Icon name="Loader2" className="animate-spin" size={20} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile?.farm_name && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Название фермы</div>
                          <div className="font-semibold text-gray-800">{profile.farm_name}</div>
                        </div>
                      )}

                      {profile?.region && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Регион</div>
                          <div className="flex items-center gap-2 text-gray-800">
                            <Icon name="MapPin" size={16} />
                            {profile.region}
                          </div>
                        </div>
                      )}

                      {profile?.address && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Адрес хозяйства</div>
                          <div className="flex items-start gap-2 text-gray-800">
                            <Icon name="Home" size={16} className="mt-0.5" />
                            <span className="flex-1">{profile.address}</span>
                          </div>
                        </div>
                      )}

                      {profile?.phone && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Телефон</div>
                          <div className="flex items-center gap-2 text-gray-800">
                            <Icon name="Phone" size={16} />
                            {profile.phone}
                          </div>
                        </div>
                      )}

                      {profile?.description && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Описание</div>
                          <div className="text-sm text-gray-700">{profile.description}</div>
                        </div>
                      )}

                      {currentUserEntry && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <div className="text-xs text-gray-500 mb-2">Моя позиция в рейтинге</div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-blue-600">
                              #{currentUserEntry.position}
                            </span>
                            <span className="text-2xl font-bold text-farmer-green">
                              {currentUserEntry.totalScore} баллов
                            </span>
                          </div>
                        </div>
                      )}

                      {!currentUserEntry && (
                        <div className="mt-4 pt-4 border-t border-blue-200 text-center">
                          <p className="text-sm text-gray-600 mb-3">
                            Вы не попали в топ-10
                          </p>
                          <Button 
                            onClick={() => navigate('/dashboard/farmer')}
                            size="sm"
                            className="bg-farmer-green hover:bg-farmer-green-dark text-white"
                          >
                            Заполнить диагностику
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>

                <Card className="p-6 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Icon name="Lightbulb" size={20} />
                    Как улучшить рейтинг?
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span>🌾</span>
                      <span>Расширьте площадь посевов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>🐄</span>
                      <span>Увеличьте поголовье скота</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>🚜</span>
                      <span>Обновите парк техники</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>👥</span>
                      <span>Наймите больше сотрудников</span>
                    </li>
                  </ul>
                </Card>
              </>
            ) : (
              <Card className="p-6 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Войдите, чтобы увидеть свою позицию
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Зарегистрируйтесь и заполните диагностику, чтобы попасть в рейтинг лучших фермеров!
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white"
                >
                  Войти
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}