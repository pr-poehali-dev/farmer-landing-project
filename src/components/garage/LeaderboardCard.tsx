import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface LeaderboardEntry {
  rank: number;
  farm_name: string;
  region: string;
  tech_score: number;
  badges: string[];
  is_current_user?: boolean;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  currentUserScore?: number;
  currentUserRank?: number;
}

const BADGES = {
  'tech_novice': { icon: 'Zap', label: 'Новичок', color: 'bg-gray-100 text-gray-800' },
  'tech_master': { icon: 'Award', label: 'Техно-мастер', color: 'bg-blue-100 text-blue-800' },
  'tech_guru': { icon: 'Crown', label: 'Техно-гуру', color: 'bg-purple-100 text-purple-800' },
  'innovator': { icon: 'Sparkles', label: 'Новатор', color: 'bg-green-100 text-green-800' }
};

export default function LeaderboardCard({ entries, currentUserScore, currentUserRank }: LeaderboardCardProps) {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Trophy" className="text-farmer-orange" />
          Топ-10 технологичных хозяйств
        </CardTitle>
        {currentUserScore !== undefined && currentUserRank !== undefined && (
          <div className="mt-2 p-3 bg-farmer-green/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ваша позиция</p>
                <p className="text-2xl font-bold text-farmer-green">#{currentUserRank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Ваши баллы</p>
                <p className="text-2xl font-bold text-farmer-green">{currentUserScore}</p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Users" size={48} className="mx-auto mb-2 opacity-50" />
            <p>Рейтинг пока пуст</p>
            <p className="text-sm">Стань первым!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.rank}
                className={`p-3 rounded-lg border ${
                  entry.is_current_user 
                    ? 'bg-farmer-green/5 border-farmer-green' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl w-12 text-center font-bold">
                      {getMedalIcon(entry.rank)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {entry.farm_name || `Хозяйство #${entry.rank}`}
                      </p>
                      <p className="text-sm text-muted-foreground">{entry.region}</p>
                      {entry.badges && entry.badges.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {entry.badges.slice(0, 3).map((badge, idx) => {
                            const badgeInfo = BADGES[badge as keyof typeof BADGES];
                            if (!badgeInfo) return null;
                            return (
                              <Badge key={idx} variant="outline" className={`text-xs ${badgeInfo.color}`}>
                                {badgeInfo.label}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-farmer-green">{entry.tech_score}</p>
                    <p className="text-xs text-muted-foreground">баллов</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
