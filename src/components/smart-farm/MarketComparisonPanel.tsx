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
  
  const hasData = comparison.your_value > 0;
  
  const getMetricLabel = () => {
    if (comparison.your_value > 100) {
      return 'кг мяса с туши';
    }
    return 'кг молока/день';
  };
  
  const metricLabel = getMetricLabel();

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
        
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="BarChart3" size={40} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Заполните диагностику хозяйства
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Чтобы увидеть сравнение с другими фермерами региона и России, добавьте информацию о вашем хозяйстве
            </p>
            <button
              onClick={() => navigate('/dashboard/farmer')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Icon name="Edit" size={20} />
              Перейти к диагностике
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <Icon name="User" size={20} />
              <span>Ваше хозяйство</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-600">{comparison.your_value.toFixed(1)}</p>
              <p className="text-sm text-gray-600">{metricLabel}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <Icon name="MapPin" size={20} />
              <span>Средний по региону</span>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-purple-600">{comparison.regional_avg.toFixed(1)}</p>
              <p className="text-sm text-gray-600">{metricLabel}</p>
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
              <p className="text-3xl font-bold text-orange-600">{comparison.national_avg.toFixed(1)}</p>
              <p className="text-sm text-gray-600">{metricLabel}</p>
            </div>
            <div className="text-sm">
              <span className="text-green-600 font-semibold">
                +{((comparison.your_value / comparison.national_avg - 1) * 100).toFixed(1)}%
              </span>
              <span className="text-gray-600"> выше среднего</span>
            </div>
          </div>
        </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}