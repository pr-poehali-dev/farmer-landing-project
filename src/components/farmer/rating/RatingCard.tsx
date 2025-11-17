import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface RatingCardProps {
  totalRating: number;
  farmName?: string;
  region?: string;
  getRatingLevel: (score: number) => { label: string; color: string; bg: string };
}

export default function RatingCard({ totalRating, farmName, region, getRatingLevel }: RatingCardProps) {
  const level = getRatingLevel(totalRating);

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 border-blue-200">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-shrink-0 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-3 shadow-xl">
            <div>
              <div className="text-4xl font-bold">{Math.round(totalRating)}</div>
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
              <span>🗺️</span> <strong>Земля</strong> — площадь и статус владения
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>💰</span> <strong>Финансы</strong> — выручка и инвестиции
            </div>
          </div>

          {farmName && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
              <Icon name="Home" size={16} />
              <span>{farmName}</span>
              {region && (
                <>
                  <span className="text-gray-400">•</span>
                  <Icon name="MapPin" size={16} />
                  <span>{region}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
