import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function ProFeatureCard() {
  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <div className="flex items-start gap-3">
        <Icon name="Sparkles" className="text-purple-600" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-purple-900 mb-1">PRO функция 🔥</h3>
          <p className="text-sm text-purple-700">
            ИИ-анализ поможет найти проблемы в хозяйстве и предложит решения для роста. 
            Функция находится в разработке — скоро запуск!
          </p>
        </div>
      </div>
    </Card>
  );
}
