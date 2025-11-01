import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TechScoreCardProps {
  score: number;
  maxScore?: number;
  badges: string[];
}

const SCORE_THRESHOLDS = {
  tech_novice: 10,
  tech_master: 100,
  tech_guru: 200,
  innovator: 150
};

const BADGES_INFO = {
  tech_novice: { icon: 'Zap', label: 'Новичок', color: 'bg-gray-100 text-gray-800', desc: 'Первые шаги' },
  tech_master: { icon: 'Award', label: 'Техно-мастер', color: 'bg-blue-100 text-blue-800', desc: 'Более 100 баллов' },
  tech_guru: { icon: 'Crown', label: 'Техно-гуру', color: 'bg-purple-100 text-purple-800', desc: 'Мастер технологий' },
  innovator: { icon: 'Sparkles', label: 'Новатор', color: 'bg-green-100 text-green-800', desc: 'Инновационное хозяйство' }
};

export default function TechScoreCard({ score, maxScore = 200, badges }: TechScoreCardProps) {
  const progress = Math.min((score / maxScore) * 100, 100);
  
  const getNextBadge = () => {
    const unlockedBadges = new Set(badges);
    const availableBadges = Object.entries(SCORE_THRESHOLDS)
      .filter(([key]) => !unlockedBadges.has(key))
      .sort((a, b) => a[1] - b[1]);
    
    if (availableBadges.length > 0) {
      const [badgeKey, threshold] = availableBadges[0];
      const badgeInfo = BADGES_INFO[badgeKey as keyof typeof BADGES_INFO];
      return { key: badgeKey, threshold, info: badgeInfo };
    }
    return null;
  };

  const nextBadge = getNextBadge();

  return (
    <Card className="bg-gradient-to-br from-farmer-green/5 to-farmer-orange/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Zap" className="text-farmer-green" />
          Твоя технологичность
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-bold text-farmer-green">{score}</span>
            <span className="text-sm text-muted-foreground">/ {maxScore} баллов</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            Заполнено {Math.round(progress)}%
          </p>
        </div>

        {badges.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Твои достижения:</p>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => {
                const badgeInfo = BADGES_INFO[badge as keyof typeof BADGES_INFO];
                if (!badgeInfo) return null;
                return (
                  <Badge key={badge} className={badgeInfo.color}>
                    <Icon name={badgeInfo.icon as any} size={14} className="mr-1" />
                    {badgeInfo.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {nextBadge && (
          <div className="p-3 bg-white/50 rounded-lg border border-dashed border-farmer-green">
            <p className="text-xs text-muted-foreground mb-1">Следующее достижение:</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={nextBadge.info.icon as any} size={18} className="text-farmer-green" />
                <span className="font-medium text-sm">{nextBadge.info.label}</span>
              </div>
              <span className="text-sm text-farmer-green font-bold">
                {nextBadge.threshold - score} баллов
              </span>
            </div>
          </div>
        )}

        <div className="p-3 bg-farmer-orange/10 rounded-lg">
          <p className="text-sm font-medium mb-1 flex items-center gap-2">
            <Icon name="TrendingUp" size={16} className="text-farmer-orange" />
            Как заработать баллы:
          </p>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Техника: <span className="font-semibold">+10 баллов</span></li>
            <li>• Оборудование: <span className="font-semibold">+5 баллов</span></li>
            <li>• Удобрения: <span className="font-semibold">+5 баллов</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
