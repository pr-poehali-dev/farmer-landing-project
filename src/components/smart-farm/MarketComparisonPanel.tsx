import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface MarketComparison {
  your_value: number;
  regional_avg: number;
  national_avg: number;
  ranking: number;
}

interface MarketComparisonPanelProps {
  comparison: MarketComparison;
}

export default function MarketComparisonPanel({ comparison }: MarketComparisonPanelProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="TrendingUp" size={28} className="text-blue-500" />
          Сравнение с рынком
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <Icon name="User" size={20} />
              <span>Ваше хозяйство</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-600">{comparison.your_value}</p>
              <p className="text-sm text-gray-600">кг молока/день</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <Icon name="MapPin" size={20} />
              <span>Средний по региону</span>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-purple-600">{comparison.regional_avg}</p>
              <p className="text-sm text-gray-600">кг молока/день</p>
            </div>
            <div className="text-sm">
              <span className="text-green-600 font-semibold">
                +{((comparison.your_value / comparison.regional_avg - 1) * 100).toFixed(1)}%
              </span>
              <span className="text-gray-600"> выше среднего</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <Icon name="Globe" size={20} />
              <span>Средний по России</span>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-orange-600">{comparison.national_avg}</p>
              <p className="text-sm text-gray-600">кг молока/день</p>
            </div>
            <div className="text-sm">
              <span className="text-green-600 font-semibold">
                +{((comparison.your_value / comparison.national_avg - 1) * 100).toFixed(1)}%
              </span>
              <span className="text-gray-600"> выше среднего</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Trophy" size={32} className="text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Ваше место в регионе</p>
              <p className="text-2xl font-bold text-gray-900">#{comparison.ranking}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/leaderboard')}
            className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Таблица лидеров
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
