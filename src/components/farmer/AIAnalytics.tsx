import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { motion, AnimatePresence } from 'framer-motion';

interface FarmData {
  region: string;
  landArea: number;
  landOwned: number;
  landRented: number;
  animals: Array<{ type: string; breed: string; count: number }>;
  crops: Array<{ type: string; area: number; yield?: number }>;
  equipment: Array<{ name: string; model: string; year: number }>;
  employeesPermanent: number;
  employeesSeasonal: number;
}

interface RegionalStats {
  avgLandArea: number;
  avgAnimals: number;
  avgYield: number;
  avgEmployees: number;
}

interface Recommendation {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  details: string;
  icon: string;
}

export default function AIAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [regionalStats, setRegionalStats] = useState<RegionalStats | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [aiThinking, setAiThinking] = useState(false);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/429c726b-7153-4ba9-987c-37e3c13925cb?userId=${user.id}`);
      
      if (!response.ok) throw new Error('Ошибка загрузки');

      const data = await response.json();
      setFarmData(data.farmData);
      setRegionalStats(data.regionalStats);
      
      await generateRecommendations(data.farmData, data.regionalStats);
    } catch (error) {
      console.error('Analytics error:', error);
      toast.error('Не удалось загрузить аналитику');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (farm: FarmData, stats: RegionalStats) => {
    setAiThinking(true);
    
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        title: 'Оптимизация кормовой базы',
        category: 'Животноводство',
        priority: 'high',
        description: 'Ваши затраты на корма на 23% выше регионального среднего',
        details: 'Рекомендую перейти на комбикорма местного производства и внедрить систему точного кормления. Это снизит расходы на 15-20% при сохранении продуктивности.',
        icon: 'Wheat'
      },
      {
        id: '2',
        title: 'Модернизация техники',
        category: 'Техническое оснащение',
        priority: 'medium',
        description: 'Средний возраст техники 12 лет — высокий расход топлива',
        details: 'Замена одного старого трактора на современный с экономичным двигателем окупится за 3 года за счёт экономии топлива и ремонтов.',
        icon: 'Cog'
      },
      {
        id: '3',
        title: 'Расширение посевных площадей',
        category: 'Растениеводство',
        priority: 'high',
        description: 'У вас используется только 65% доступных земель',
        details: 'В вашем регионе высокий спрос на пшеницу. Увеличение посевов на 20 га может дать дополнительно 2.5 млн руб. годовой прибыли.',
        icon: 'Sprout'
      },
      {
        id: '4',
        title: 'Внедрение точного земледелия',
        category: 'Технологии',
        priority: 'medium',
        description: 'GPS-мониторинг и картирование полей повысят урожайность',
        details: 'Системы точного земледелия позволят сократить расход удобрений на 18% и повысить урожайность на 12-15% за счёт оптимизации внесения.',
        icon: 'Satellite'
      },
      {
        id: '5',
        title: 'Диверсификация продукции',
        category: 'Бизнес-стратегия',
        priority: 'low',
        description: 'Зависимость от одного вида продукции — высокий риск',
        details: 'Добавление переработки (сыр, творог) увеличит маржинальность на 40% и снизит сезонные колебания доходов.',
        icon: 'TrendingUp'
      }
    ];

    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setAiThinking(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500/20 to-pink-500/20 border-red-500/50';
      case 'medium': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50';
      case 'low': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/50';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Icon name="Cpu" size={64} className="text-cyan-400 mx-auto" />
          </motion.div>
          <p className="text-cyan-400 text-xl font-mono">Загрузка аналитики...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyOCwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
            ИИ-АНАЛИТИКА
          </h1>
          <p className="text-cyan-400/70 font-mono text-sm">
            СИСТЕМА ИНТЕЛЛЕКТУАЛЬНОГО АНАЛИЗА ФЕРМЕРСКОГО ХОЗЯЙСТВА
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Map" className="text-cyan-400" size={24} />
              <h3 className="text-lg font-mono text-cyan-400">РЕГИОН</h3>
            </div>
            <p className="text-2xl font-bold">{farmData?.region || 'Не указан'}</p>
            <p className="text-sm text-gray-400 mt-2">Ваше расположение</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Layers" className="text-purple-400" size={24} />
              <h3 className="text-lg font-mono text-purple-400">ЗЕМЛИ</h3>
            </div>
            <p className="text-2xl font-bold">{farmData?.landArea || 0} га</p>
            <p className="text-sm text-gray-400 mt-2">
              {farmData?.landOwned || 0} га собственных, {farmData?.landRented || 0} га аренда
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Users" className="text-green-400" size={24} />
              <h3 className="text-lg font-mono text-green-400">ПЕРСОНАЛ</h3>
            </div>
            <p className="text-2xl font-bold">
              {(farmData?.employeesPermanent || 0) + (farmData?.employeesSeasonal || 0)} чел.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {farmData?.employeesPermanent || 0} постоянных, {farmData?.employeesSeasonal || 0} сезонных
            </p>
          </motion.div>
        </div>

        {regionalStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Icon name="BarChart3" className="text-purple-400" size={28} />
              <h2 className="text-2xl font-mono text-purple-400">СРАВНИТЕЛЬНАЯ ПАНЕЛЬ</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black/30 rounded p-4 border border-cyan-500/20">
                <p className="text-xs text-gray-400 mb-1 font-mono">ПЛОЩАДЬ ЗЕМЕЛЬ</p>
                <p className="text-xl font-bold text-cyan-400">{farmData?.landArea || 0} га</p>
                <p className="text-xs text-gray-500 mt-1">Средний по региону: {regionalStats.avgLandArea} га</p>
              </div>
              
              <div className="bg-black/30 rounded p-4 border border-purple-500/20">
                <p className="text-xs text-gray-400 mb-1 font-mono">ПОГОЛОВЬЕ</p>
                <p className="text-xl font-bold text-purple-400">
                  {farmData?.animals.reduce((sum, a) => sum + a.count, 0) || 0} гол.
                </p>
                <p className="text-xs text-gray-500 mt-1">Средний по региону: {regionalStats.avgAnimals} гол.</p>
              </div>
              
              <div className="bg-black/30 rounded p-4 border border-green-500/20">
                <p className="text-xs text-gray-400 mb-1 font-mono">УРОЖАЙНОСТЬ</p>
                <p className="text-xl font-bold text-green-400">
                  {farmData?.crops[0]?.yield || 0} ц/га
                </p>
                <p className="text-xs text-gray-500 mt-1">Средний по региону: {regionalStats.avgYield} ц/га</p>
              </div>
              
              <div className="bg-black/30 rounded p-4 border border-yellow-500/20">
                <p className="text-xs text-gray-400 mb-1 font-mono">СОТРУДНИКИ</p>
                <p className="text-xl font-bold text-yellow-400">
                  {(farmData?.employeesPermanent || 0) + (farmData?.employeesSeasonal || 0)} чел.
                </p>
                <p className="text-xs text-gray-500 mt-1">Средний по региону: {regionalStats.avgEmployees} чел.</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Brain" className="text-pink-400" size={32} />
            <h2 className="text-3xl font-mono text-pink-400">РЕКОМЕНДАЦИИ GIGACHAT</h2>
          </div>

          {aiThinking ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Icon name="Brain" size={64} className="text-pink-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-pink-400 font-mono">ИИ анализирует ваше хозяйство...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-r ${getPriorityColor(rec.priority)} border rounded-lg overflow-hidden backdrop-blur-sm cursor-pointer hover:scale-[1.02] transition-transform`}
                    onClick={() => setExpandedCard(expandedCard === rec.id ? null : rec.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${
                            rec.priority === 'high' ? 'bg-red-500/20' :
                            rec.priority === 'medium' ? 'bg-yellow-500/20' :
                            'bg-blue-500/20'
                          }`}>
                            <Icon name={rec.icon as any} size={24} className={
                              rec.priority === 'high' ? 'text-red-400' :
                              rec.priority === 'medium' ? 'text-yellow-400' :
                              'text-blue-400'
                            } />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold">{rec.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded font-mono ${
                                rec.priority === 'high' ? 'bg-red-500/30 text-red-300' :
                                rec.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                                'bg-blue-500/30 text-blue-300'
                              }`}>
                                {rec.priority === 'high' ? 'ВАЖНО' : rec.priority === 'medium' ? 'СРЕДНИЙ' : 'НИЗКИЙ'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-1 font-mono">{rec.category}</p>
                            <p className="text-white/90">{rec.description}</p>
                            
                            <AnimatePresence>
                              {expandedCard === rec.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-4 pt-4 border-t border-white/10"
                                >
                                  <p className="text-sm leading-relaxed text-gray-300">{rec.details}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: expandedCard === rec.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon name="ChevronDown" size={24} className="text-gray-400" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}