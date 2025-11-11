import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FarmMetrics {
  cattle_count: number;
  milk_productivity: number;
  crop_yield: number;
  total_area: number;
  health_score: number;
}

interface FarmDashboardProps {
  metrics: FarmMetrics;
  userName: string | undefined;
  getHealthColor: (score: number) => string;
  getHealthText: (score: number) => string;
}

export default function FarmDashboard({ metrics, userName, getHealthColor, getHealthText }: FarmDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Добро пожаловать, {userName || 'Фермер'}!
              </h2>
              <p className="text-green-100 text-lg flex items-center gap-2">
                <Icon name="TrendingUp" size={20} />
                Сегодня +10% к молочной продуктивности!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${getHealthColor(metrics.health_score)} animate-pulse`} />
              <span className="font-medium">{getHealthText(metrics.health_score)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Beef" size={20} />
                <span className="text-sm text-green-100">Голов скота</span>
              </div>
              <p className="text-3xl font-bold">{metrics.cattle_count}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Milk" size={20} />
                <span className="text-sm text-green-100">Удойность (кг/день)</span>
              </div>
              <p className="text-3xl font-bold">{metrics.milk_productivity}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Wheat" size={20} />
                <span className="text-sm text-green-100">Урожайность (ц/га)</span>
              </div>
              <p className="text-3xl font-bold">{metrics.crop_yield}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Map" size={20} />
                <span className="text-sm text-green-100">Площадь (га)</span>
              </div>
              <p className="text-3xl font-bold">{metrics.total_area}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-100">Здоровье хозяйства</span>
              <span className="text-xl font-bold">{metrics.health_score}%</span>
            </div>
            <Progress value={metrics.health_score} className="h-3" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
