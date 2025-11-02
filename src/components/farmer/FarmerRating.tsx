import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const RATING_API = 'https://functions.poehali.dev/6e3852b3-e6e1-478e-b710-869bd1a377d8';

interface Props {
  userId: string;
}

interface ScoreData {
  user_id: string;
  productivity_score: number;
  tech_score: number;
  investment_score: number;
  expertise_score: number;
  community_score: number;
  total_score: number;
  level: number;
  achievements: number[];
  last_updated: string;
}

interface Achievement {
  id: number;
  name: string;
  category: string;
  icon: string;
  description: string;
  points: number;
  earned: boolean;
}

interface DailyQuest {
  id: number;
  quest_type: string;
  quest_name: string;
  points: number;
  completed: boolean;
}

interface LeaderboardEntry {
  user_id: string;
  full_name: string | null;
  farm_name: string | null;
  region: string | null;
  score: number;
  level: number;
  rank: number;
}

const LEVELS = [
  { level: 1, name: 'Новичок', minPoints: 0, maxPoints: 99, color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' },
  { level: 2, name: 'Опытный', minPoints: 100, maxPoints: 249, color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-300' },
  { level: 3, name: 'Профи', minPoints: 250, maxPoints: 499, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
  { level: 4, name: 'Эксперт', minPoints: 500, maxPoints: 999, color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-300' },
  { level: 5, name: 'Мастер', minPoints: 1000, maxPoints: Infinity, color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' }
];

const CATEGORIES = [
  { key: 'productivity', name: 'Урожайность', icon: 'Wheat', color: 'text-green-600', bgColor: 'bg-green-50' },
  { key: 'tech', name: 'Технологичность', icon: 'Wrench', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { key: 'investment', name: 'Инвестиции', icon: 'DollarSign', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { key: 'expertise', name: 'Профессионализм', icon: 'GraduationCap', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { key: 'community', name: 'Социальный капитал', icon: 'Users', color: 'text-pink-600', bgColor: 'bg-pink-50' }
];

export default function FarmerRating({ userId }: Props) {
  const [scores, setScores] = useState<ScoreData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [leaderboardCategory, setLeaderboardCategory] = useState('total');

  useEffect(() => {
    loadData();
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      loadLeaderboard(leaderboardCategory);
    }
  }, [activeTab, leaderboardCategory]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadScores(),
      loadAchievements(),
      loadDailyQuests()
    ]);
    setLoading(false);
  };

  const loadScores = async () => {
    const response = await fetch(`${RATING_API}?action=get_scores`, {
      headers: { 'X-User-Id': userId }
    });
    if (response.ok) {
      const data = await response.json();
      setScores(data);
    }
  };

  const loadAchievements = async () => {
    const response = await fetch(`${RATING_API}?action=achievements`, {
      headers: { 'X-User-Id': userId }
    });
    if (response.ok) {
      const data = await response.json();
      setAchievements(data);
    }
  };

  const loadDailyQuests = async () => {
    const response = await fetch(`${RATING_API}?action=daily_quests`, {
      headers: { 'X-User-Id': userId }
    });
    if (response.ok) {
      const data = await response.json();
      setDailyQuests(data);
    }
  };

  const loadLeaderboard = async (category: string) => {
    const response = await fetch(
      `${RATING_API}?action=leaderboard&category=${category}&period=all-time`,
      { headers: { 'X-User-Id': userId } }
    );
    if (response.ok) {
      const data = await response.json();
      setLeaderboard(data);
    }
  };

  const calculateScores = async () => {
    const response = await fetch(RATING_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      },
      body: JSON.stringify({ action: 'calculate_scores' })
    });

    if (response.ok) {
      toast.success('Рейтинг пересчитан!');
      loadScores();
    }
  };

  const completeQuest = async (questId: number) => {
    const response = await fetch(RATING_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      },
      body: JSON.stringify({ action: 'complete_quest', quest_id: questId })
    });

    if (response.ok) {
      const data = await response.json();
      toast.success(`+${data.points_earned} баллов! 🎉`);
      loadData();
    }
  };

  if (loading || !scores) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
        </div>
      </Card>
    );
  }

  const currentLevel = LEVELS.find(l => scores.total_score >= l.minPoints && scores.total_score <= l.maxPoints) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const progressToNextLevel = nextLevel 
    ? ((scores.total_score - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  const earnedAchievements = achievements.filter(a => a.earned);
  const availableAchievements = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-6">
      <Card className={`p-6 ${currentLevel.bgColor} border-2 ${currentLevel.borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Твой рейтинг</h2>
            <p className="text-sm text-gray-600">Получай баллы за активность</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${currentLevel.color}`}>{scores.total_score}</div>
            <div className="text-sm text-gray-600">баллов</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className={currentLevel.color} />
              <span className={`font-bold ${currentLevel.color}`}>
                Уровень {currentLevel.level}: {currentLevel.name}
              </span>
            </div>
            {nextLevel && (
              <span className="text-sm text-gray-600">
                До уровня {nextLevel.level}: {nextLevel.minPoints - scores.total_score} баллов
              </span>
            )}
          </div>
          {nextLevel && (
            <Progress value={progressToNextLevel} className="h-3" />
          )}
        </div>

        <Button onClick={calculateScores} variant="outline" size="sm">
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Пересчитать рейтинг
        </Button>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Обзор
          </TabsTrigger>
          <TabsTrigger value="quests">
            <Icon name="Target" size={16} className="mr-2" />
            Задания
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Icon name="Award" size={16} className="mr-2" />
            Достижения
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Icon name="Trophy" size={16} className="mr-2" />
            Лидеры
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Баллы по категориям</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map(cat => {
                const scoreKey = `${cat.key}_score` as keyof ScoreData;
                const score = scores[scoreKey] as number;
                return (
                  <Card key={cat.key} className={`p-4 ${cat.bgColor} border`}>
                    <div className="flex items-center gap-3">
                      <Icon name={cat.icon as any} size={24} className={cat.color} />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{cat.name}</div>
                        <div className={`text-2xl font-bold ${cat.color}`}>{score}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Info" size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Как зарабатывать баллы?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Icon name="Plus" size={18} className="text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">+30 баллов</div>
                  <div className="text-xs text-gray-600">Создание предложения</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Icon name="Plus" size={18} className="text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">+50 баллов</div>
                  <div className="text-xs text-gray-600">Получение инвестиции</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Icon name="Plus" size={18} className="text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">+20 баллов</div>
                  <div className="text-xs text-gray-600">Заполнение профиля</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Icon name="Plus" size={18} className="text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">+10 баллов</div>
                  <div className="text-xs text-gray-600">Обновление хозяйства</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="quests" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Calendar" size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Ежедневные задания</h3>
            </div>
            <div className="space-y-3">
              {dailyQuests.map(quest => (
                <Card 
                  key={quest.id}
                  className={`p-4 ${quest.completed ? 'bg-gray-50 opacity-60' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {quest.completed ? (
                        <Icon name="CheckCircle2" size={24} className="text-green-600" />
                      ) : (
                        <Icon name="Circle" size={24} className="text-gray-400" />
                      )}
                      <div>
                        <div className="font-semibold">{quest.quest_name}</div>
                        <div className="text-sm text-gray-600">+{quest.points} баллов</div>
                      </div>
                    </div>
                    {!quest.completed && (
                      <Button onClick={() => completeQuest(quest.id)} size="sm">
                        Выполнено
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {earnedAchievements.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Award" size={20} className="text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Достижения ({earnedAchievements.length}/{achievements.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {earnedAchievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg"
                  >
                    <Icon name={achievement.icon as any} size={24} className="text-yellow-600" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{achievement.name}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                      <div className="text-xs text-yellow-700 font-semibold mt-1">
                        +{achievement.points} баллов
                      </div>
                    </div>
                    <Icon name="CheckCircle2" size={20} className="text-green-600" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {availableAchievements.length > 0 && (
            <Card className="p-6 bg-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Target" size={20} className="text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">Доступные достижения</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableAchievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <Icon name={achievement.icon as any} size={24} className="text-gray-400" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{achievement.name}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                      <div className="text-xs text-gray-500 font-semibold mt-1">
                        Награда: {achievement.points} баллов
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon name="Trophy" size={20} className="text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">Таблица лидеров</h3>
              </div>
              <select
                value={leaderboardCategory}
                onChange={(e) => setLeaderboardCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="total">Общий рейтинг</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              {leaderboard.map((entry) => {
                const isCurrentUser = entry.user_id === userId;
                return (
                  <Card 
                    key={entry.user_id}
                    className={`p-3 ${isCurrentUser ? 'bg-blue-50 border-2 border-blue-300' : 'bg-white'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`text-lg font-bold ${
                          entry.rank === 1 ? 'text-yellow-500' :
                          entry.rank === 2 ? 'text-gray-400' :
                          entry.rank === 3 ? 'text-orange-600' :
                          'text-gray-600'
                        }`}>
                          {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {entry.farm_name || `Ферма №${entry.user_id}`}
                            {isCurrentUser && <span className="ml-2 text-xs text-blue-600">(Вы)</span>}
                          </div>
                          <div className="text-xs text-gray-500">{entry.region || 'Регион не указан'}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{entry.score}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}