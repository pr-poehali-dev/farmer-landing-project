import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface RatingBreakdown {
  region: number;
  land: number;
  animal: number;
  equipment: number;
  crop: number;
  staff: number;
  finance: number;
}

interface RatingBreakdownDetailsProps {
  weighted: RatingBreakdown;
  coefficients: Record<string, number>;
}

const criteria = [
  { key: 'region', label: 'Регион', icon: 'MapPin', description: 'Климат и инфраструктура' },
  { key: 'land', label: 'Земля', icon: 'Landmark', description: 'Площадь и владение' },
  { key: 'animal', label: 'Животные', icon: 'Beef', description: 'Поголовье и продуктивность' },
  { key: 'equipment', label: 'Техника', icon: 'Truck', description: 'Количество и состояние' },
  { key: 'crop', label: 'Культуры', icon: 'Wheat', description: 'Урожайность и площадь' },
  { key: 'staff', label: 'Сотрудники', icon: 'Users', description: 'Численность персонала' },
  { key: 'finance', label: 'Финансы', icon: 'DollarSign', description: 'Потенциал прибыли' }
];

export default function RatingBreakdownDetails({ weighted, coefficients }: RatingBreakdownDetailsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Icon name="BarChart3" size={20} />
        Детализация рейтинга
      </h3>
      <div className="space-y-4">
        {criteria.map(({ key, label, icon, description }) => {
          const value = weighted[key as keyof RatingBreakdown];
          const coef = coefficients[key] || 1;
          const maxValue = 100 * coef;
          const percentage = (value / maxValue) * 100;

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon name={icon} size={16} className="text-gray-600" />
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-gray-500">{description}</span>
                </div>
                <span className="text-sm font-bold text-gray-700">{Math.round(value)}</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
