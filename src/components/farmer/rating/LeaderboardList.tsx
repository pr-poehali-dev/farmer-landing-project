import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

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

interface LeaderboardListProps {
  leaderboard: LeaderboardEntry[];
  filteredLeaderboard: LeaderboardEntry[];
  selectedRegion: string;
  regionsWithCount: Array<{region: string; count: number}>;
  currentUserId?: number;
  onRegionFilter: (region: string) => void;
}

export default function LeaderboardList({
  leaderboard,
  filteredLeaderboard,
  selectedRegion,
  regionsWithCount,
  currentUserId,
  onRegionFilter
}: LeaderboardListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Trophy" size={20} className="text-yellow-600" />
          Топ-50 фермеров России
        </h3>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Регион:</span>
          <select 
            value={selectedRegion}
            onChange={(e) => onRegionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Все регионы ({leaderboard.length})</option>
            {regionsWithCount.map(({ region, count }) => (
              <option key={region} value={region}>
                {region} ({count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredLeaderboard.map((entry, idx) => {
          const isCurrentUser = currentUserId && entry.userId === currentUserId;
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
          const bgClass = isCurrentUser 
            ? 'bg-blue-50 border-blue-300 border-2' 
            : idx === 0 
              ? 'bg-yellow-50 border-yellow-200 border-2' 
              : idx === 1 || idx === 2 
                ? 'bg-orange-50 border-orange-200 border-2'
                : 'bg-gray-50 border-gray-200 border';

          return (
            <div key={entry.userId} className={`p-4 rounded-lg ${bgClass} transition-all`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-lg font-bold text-gray-600 w-8">
                    {medal || `#${entry.position}`}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">
                        {entry.farmName || entry.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">Вы</span>
                        )}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                      {entry.region && (
                        <span className="flex items-center gap-1">
                          <Icon name="MapPin" size={12} />
                          {entry.region}
                        </span>
                      )}
                      {entry.animals && entry.animals.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Icon name="Beef" size={12} />
                          {entry.animals.length} типа животных
                        </span>
                      )}
                      {entry.crops && entry.crops.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Icon name="Wheat" size={12} />
                          {entry.crops.length} типа культур
                        </span>
                      )}
                      {entry.investmentCount !== undefined && entry.investmentCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Icon name="TrendingUp" size={12} />
                          {entry.investmentCount} инвестиций
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{Math.round(entry.totalScore)}</div>
                  <div className="text-xs text-gray-500">баллов</div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredLeaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Icon name="Search" size={32} className="mx-auto mb-2 text-gray-400" />
            <p>В этом регионе пока нет фермеров</p>
          </div>
        )}
      </div>
    </Card>
  );
}
