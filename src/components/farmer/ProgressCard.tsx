import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Props {
  progress: number;
  onStartOnboarding?: () => void;
}

export default function ProgressCard({ progress, onStartOnboarding }: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Диагностика хозяйства</h2>
          <p className="text-sm text-gray-600">Расскажи о своей ферме — мы подберём решения</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{progress}%</div>
            <div className="text-xs text-gray-500">заполнено</div>
          </div>
          {progress < 100 && onStartOnboarding && (
            <Button onClick={onStartOnboarding} size="sm" className="whitespace-nowrap">
              <Icon name="Sparkles" size={16} className="mr-2" />
              Узнать рейтинг
            </Button>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Card>
  );
}