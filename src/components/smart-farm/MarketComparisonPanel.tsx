import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const MARKET_API = 'https://functions.poehali.dev/ad7d140a-d5bd-46c9-bebe-6cbb986c59e3';

interface AnimalComparison {
  type: string;
  breed: string;
  direction: string;
  count: number;
  myMeatYield: number;
  avgMeatYield: number;
  myMilkYield: number;
  avgMilkYield: number;
  myPrice: number;
  avgPrice: number;
  farmersCount: number;
}

interface CropComparison {
  type: string;
  area: number;
  myYield: number;
  avgYield: number;
  myPrice: number;
  avgPrice: number;
  farmersCount: number;
}

interface MarketComparisonData {
  animals: AnimalComparison[];
  crops: CropComparison[];
}

export default function MarketComparisonPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<MarketComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadComparison();
    }
  }, [user]);

  const loadComparison = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(MARKET_API, {
        headers: { 'X-User-Id': user.id.toString() }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (err) {
      console.error('Market comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAnimalEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      'cows': '🐄',
      'pigs': '🐷',
      'chickens': '🐔',
      'sheep': '🐑',
      'horses': '🐴',
      'deer': '🦌',
      'hives': '🐝'
    };
    return emojis[type] || '🐾';
  };

  const getCropEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      'wheat': '🌾',
      'barley': '🌾',
      'corn': '🌽',
      'sunflower': '🌻',
      'potato': '🥔',
      'vegetables': '🥕',
      'fruits': '🍎',
      'other': '🌱'
    };
    return emojis[type] || '🌱';
  };

  const getAnimalLabel = (type: string) => {
    const labels: Record<string, string> = {
      'cows': 'Коровы',
      'pigs': 'Свиньи',
      'chickens': 'Куры',
      'sheep': 'Овцы',
      'horses': 'Лошади',
      'deer': 'Олени',
      'hives': 'Пчелосемьи'
    };
    return labels[type] || type;
  };

  const getCropLabel = (type: string) => {
    const labels: Record<string, string> = {
      'wheat': 'Пшеница',
      'barley': 'Ячмень',
      'corn': 'Кукуруза',
      'sunflower': 'Подсолнечник',
      'potato': 'Картофель',
      'vegetables': 'Овощи',
      'fruits': 'Фрукты',
      'other': 'Другие культуры'
    };
    return labels[type] || type;
  };

  const hasData = data && (data.animals.length > 0 || data.crops.length > 0);

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
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" className="animate-spin mr-2" size={24} />
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="BarChart3" size={40} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Заполните диагностику хозяйства
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Чтобы увидеть сравнение с другими фермерами, добавьте информацию о животных и культурах
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
          <div className="space-y-6">
            {data.animals.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🐄</span> Животные
                </h3>
                <div className="space-y-4">
                  {data.animals.map((animal, idx) => (
                    <Card key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{getAnimalEmoji(animal.type)}</span>
                            <h4 className="font-bold text-gray-800">{getAnimalLabel(animal.type)}</h4>
                          </div>
                          {animal.breed && (
                            <p className="text-sm text-gray-600">Порода: {animal.breed}</p>
                          )}
                          <p className="text-sm text-gray-600">Голов: {animal.count}</p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          Сравнение с {animal.farmersCount} {animal.farmersCount === 1 ? 'фермером' : 'фермерами'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {animal.direction === 'meat' && animal.myMeatYield > 0 && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Выход мяса с туши</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-blue-600">{animal.myMeatYield}</span>
                              <span className="text-sm text-gray-600">кг</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Средний: {animal.avgMeatYield} кг
                              {animal.avgMeatYield > 0 && (
                                <span className={`ml-1 font-semibold ${animal.myMeatYield > animal.avgMeatYield ? 'text-green-600' : 'text-red-600'}`}>
                                  ({animal.myMeatYield > animal.avgMeatYield ? '+' : ''}{((animal.myMeatYield / animal.avgMeatYield - 1) * 100).toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {animal.direction === 'milk' && animal.myMilkYield > 0 && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Надой молока</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-blue-600">{animal.myMilkYield}</span>
                              <span className="text-sm text-gray-600">л/день</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Средний: {animal.avgMilkYield} л/день
                              {animal.avgMilkYield > 0 && (
                                <span className={`ml-1 font-semibold ${animal.myMilkYield > animal.avgMilkYield ? 'text-green-600' : 'text-red-600'}`}>
                                  ({animal.myMilkYield > animal.avgMilkYield ? '+' : ''}{((animal.myMilkYield / animal.avgMilkYield - 1) * 100).toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {animal.myPrice > 0 && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Цена за кг</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-blue-600">{animal.myPrice}</span>
                              <span className="text-sm text-gray-600">₽</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Средняя: {animal.avgPrice} ₽
                              {animal.avgPrice > 0 && (
                                <span className={`ml-1 font-semibold ${animal.myPrice > animal.avgPrice ? 'text-green-600' : 'text-red-600'}`}>
                                  ({animal.myPrice > animal.avgPrice ? '+' : ''}{((animal.myPrice / animal.avgPrice - 1) * 100).toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {data.crops.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🌾</span> Культуры
                </h3>
                <div className="space-y-4">
                  {data.crops.map((crop, idx) => (
                    <Card key={idx} className="p-4 bg-gradient-to-r from-green-50 to-lime-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{getCropEmoji(crop.type)}</span>
                            <h4 className="font-bold text-gray-800">{getCropLabel(crop.type)}</h4>
                          </div>
                          <p className="text-sm text-gray-600">Площадь: {crop.area} га</p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          Сравнение с {crop.farmersCount} {crop.farmersCount === 1 ? 'фермером' : 'фермерами'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {crop.myYield > 0 && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Урожайность</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-green-600">{crop.myYield}</span>
                              <span className="text-sm text-gray-600">ц/га</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Средняя: {crop.avgYield} ц/га
                              {crop.avgYield > 0 && (
                                <span className={`ml-1 font-semibold ${crop.myYield > crop.avgYield ? 'text-green-600' : 'text-red-600'}`}>
                                  ({crop.myYield > crop.avgYield ? '+' : ''}{((crop.myYield / crop.avgYield - 1) * 100).toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {crop.myPrice > 0 && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Цена за единицу</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-green-600">{crop.myPrice}</span>
                              <span className="text-sm text-gray-600">₽</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Средняя: {crop.avgPrice} ₽
                              {crop.avgPrice > 0 && (
                                <span className={`ml-1 font-semibold ${crop.myPrice > crop.avgPrice ? 'text-green-600' : 'text-red-600'}`}>
                                  ({crop.myPrice > crop.avgPrice ? '+' : ''}{((crop.myPrice / crop.avgPrice - 1) * 100).toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
