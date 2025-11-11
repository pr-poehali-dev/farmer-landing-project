import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface FarmMetrics {
  cattle_count: number;
  milk_productivity: number;
  crop_yield: number;
  total_area: number;
  health_score: number;
}

interface MarketComparison {
  your_value: number;
  regional_avg: number;
  national_avg: number;
  ranking: number;
}

interface AIRecommendation {
  id: number;
  title: string;
  description: string;
  potential_profit: number;
  implementation_cost: number;
  roi: number;
}

export default function SmartFarm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<FarmMetrics>({
    cattle_count: 250,
    milk_productivity: 28.5,
    crop_yield: 45.2,
    total_area: 180,
    health_score: 85
  });
  const [comparison, setComparison] = useState<MarketComparison>({
    your_value: 28.5,
    regional_avg: 25.8,
    national_avg: 24.2,
    ranking: 12
  });
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: 1,
      title: 'Повысьте урожайность пшеницы на 15%',
      description: 'Оптимизация графика внесения удобрений и использование новых сортов семян может увеличить урожайность с 45 до 52 ц/га',
      potential_profit: 450000,
      implementation_cost: 180000,
      roi: 150
    },
    {
      id: 2,
      title: 'Экономьте 20% на кормах',
      description: 'Переход на локальных поставщиков и оптовые закупки позволят снизить затраты на корма на 180 000₽ в год',
      potential_profit: 180000,
      implementation_cost: 25000,
      roi: 620
    },
    {
      id: 3,
      title: 'Увеличьте надои на 12%',
      description: 'Внедрение автоматизированной системы кормления и мониторинга здоровья коров повысит среднюю продуктивность',
      potential_profit: 680000,
      implementation_cost: 320000,
      roi: 113
    }
  ]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthText = (score: number) => {
    if (score >= 80) return 'Отлично';
    if (score >= 60) return 'Хорошо';
    return 'Требует внимания';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/farmer')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="ArrowLeft" size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Умная ферма</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="Sparkles" size={16} className="text-yellow-500" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Панель мониторинга */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <div className="space-y-6">
              {/* Приветствие */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Добро пожаловать, {user?.name || 'Фермер'}!
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

              {/* Основные показатели */}
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

              {/* Индикатор здоровья */}
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

        {/* Сравнение с рынком */}
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
              {/* Ваши показатели */}
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

              {/* Региональные показатели */}
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

              {/* Национальные показатели */}
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

            {/* Рейтинг */}
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

        {/* Рекомендации GigaChat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icon name="Brain" size={28} className="text-purple-500" />
              Рекомендации ИИ
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className={`p-5 cursor-pointer transition-all hover:shadow-lg border-2 ${
                      expandedCard === rec.id ? 'border-purple-500' : 'border-transparent'
                    }`}
                    onClick={() => setExpandedCard(expandedCard === rec.id ? null : rec.id)}
                  >
                    <div className="space-y-4">
                      {/* Заголовок */}
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-gray-900 flex-1">
                          {rec.title}
                        </h3>
                        <Icon
                          name={expandedCard === rec.id ? 'ChevronUp' : 'ChevronDown'}
                          size={20}
                          className="text-gray-400"
                        />
                      </div>

                      {/* ROI Badge */}
                      <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        <Icon name="TrendingUp" size={14} />
                        ROI: {rec.roi}%
                      </div>

                      {/* Описание */}
                      {expandedCard === rec.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3"
                        >
                          <p className="text-sm text-gray-600">{rec.description}</p>

                          {/* Расчеты */}
                          <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Потенциальная прибыль:</span>
                              <span className="font-bold text-green-600">
                                +{rec.potential_profit.toLocaleString('ru-RU')}₽
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Затраты на внедрение:</span>
                              <span className="font-bold text-red-600">
                                -{rec.implementation_cost.toLocaleString('ru-RU')}₽
                              </span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex justify-between text-sm">
                                <span className="font-semibold text-gray-900">Чистая выгода:</span>
                                <span className="font-bold text-blue-600">
                                  {(rec.potential_profit - rec.implementation_cost).toLocaleString('ru-RU')}₽
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Калькулятор */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success('Функция калькулятора в разработке');
                            }}
                            className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Icon name="Calculator" size={16} />
                            Открыть калькулятор
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
