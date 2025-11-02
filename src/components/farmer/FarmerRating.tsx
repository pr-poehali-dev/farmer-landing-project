import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface Props {
  points: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  earned: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_proposal',
    title: 'Первый шаг',
    description: 'Создано первое предложение для инвесторов',
    icon: 'Sprout',
    pointsRequired: 30,
    earned: true
  },
  {
    id: 'five_proposals',
    title: 'Активный фермер',
    description: 'Создано 5 предложений',
    icon: 'TrendingUp',
    pointsRequired: 150,
    earned: true
  },
  {
    id: 'first_investment',
    title: 'Привлечение капитала',
    description: 'Получено первое инвестирование',
    icon: 'DollarSign',
    pointsRequired: 50,
    earned: false
  },
  {
    id: 'profile_complete',
    title: 'Полный профиль',
    description: 'Заполнены все данные профиля',
    icon: 'UserCheck',
    pointsRequired: 20,
    earned: false
  },
  {
    id: 'ten_proposals',
    title: 'Профессионал',
    description: 'Создано 10 предложений',
    icon: 'Award',
    pointsRequired: 300,
    earned: false
  },
  {
    id: 'marketplace_purchase',
    title: 'Первая покупка',
    description: 'Совершена покупка в магазине',
    icon: 'ShoppingBag',
    pointsRequired: 15,
    earned: false
  }
];

const LEVELS = [
  { level: 1, name: 'Новичок', minPoints: 0, maxPoints: 99, color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' },
  { level: 2, name: 'Опытный', minPoints: 100, maxPoints: 249, color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-300' },
  { level: 3, name: 'Профи', minPoints: 250, maxPoints: 499, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
  { level: 4, name: 'Эксперт', minPoints: 500, maxPoints: 999, color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-300' },
  { level: 5, name: 'Мастер', minPoints: 1000, maxPoints: Infinity, color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' }
];

export default function FarmerRating({ points }: Props) {
  const currentLevel = LEVELS.find(l => points >= l.minPoints && points <= l.maxPoints) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const progressToNextLevel = nextLevel 
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned);
  const availableAchievements = ACHIEVEMENTS.filter(a => !a.earned);

  return (
    <div className="space-y-6">
      <Card className={`p-6 ${currentLevel.bgColor} border-2 ${currentLevel.borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Твой рейтинг</h2>
            <p className="text-sm text-gray-600">Получай баллы за активность</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${currentLevel.color}`}>{points}</div>
            <div className="text-sm text-gray-600">баллов</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className={currentLevel.color} />
              <span className={`font-bold ${currentLevel.color}`}>
                Уровень {currentLevel.level}: {currentLevel.name}
              </span>
            </div>
            {nextLevel && (
              <span className="text-sm text-gray-600">
                До уровня {nextLevel.level}: {nextLevel.minPoints - points} баллов
              </span>
            )}
          </div>
          {nextLevel && (
            <Progress value={progressToNextLevel} className="h-3" />
          )}
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

      {earnedAchievements.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Award" size={20} className="text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Достижения ({earnedAchievements.length}/{ACHIEVEMENTS.length})
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
                  <div className="font-bold text-gray-900">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                  <div className="text-xs text-yellow-700 font-semibold mt-1">
                    +{achievement.pointsRequired} баллов
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
                  <div className="font-bold text-gray-900">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                  <div className="text-xs text-gray-500 font-semibold mt-1">
                    Награда: {achievement.pointsRequired} баллов
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
