import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import FarmDashboard from '@/components/smart-farm/FarmDashboard';
import MarketComparisonPanel from '@/components/smart-farm/MarketComparisonPanel';
import GigaChatPanel from '@/components/smart-farm/GigaChatPanel';
import { FARMER_API, Animal, Crop } from '@/types/farm.types';

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

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function SmartFarm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<FarmMetrics>({
    cattle_count: 0,
    milk_productivity: 0,
    crop_yield: 0,
    total_area: 0,
    health_score: 0
  });
  const [comparison, setComparison] = useState<MarketComparison>({
    your_value: 0,
    regional_avg: 0,
    national_avg: 0,
    ranking: 0
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Здравствуйте! Я ваш ИИ-помощник по сельскому хозяйству. Задавайте вопросы о вашем хозяйстве, рынке или получайте персональные рекомендации!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadDiagnostics();
    }
  }, [user, navigate]);

  const loadDiagnostics = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${FARMER_API}?action=get_diagnosis`, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const data = await response.json();
      
      if (data.diagnosis && data.diagnosis.assets && data.diagnosis.assets.length > 0) {
        const info = data.diagnosis.assets[0];
        const animals: Animal[] = info.animals || [];
        const crops: Crop[] = info.crops || [];
        
        const totalCattle = animals
          .filter((a: Animal) => a.type === 'cows')
          .reduce((sum: number, a: Animal) => sum + (a.count || 0), 0);
        
        const avgMilkYield = animals
          .filter((a: Animal) => a.type === 'cows' && a.milkYield)
          .reduce((sum: number, a: Animal) => sum + (a.milkYield || 0), 0) / 
          (animals.filter((a: Animal) => a.type === 'cows' && a.milkYield).length || 1);
        
        const avgCropYield = crops.length > 0
          ? crops.reduce((sum: number, c: Crop) => sum + (c.yield || 0), 0) / crops.length
          : 0;
        
        const totalArea = parseFloat(info.land_area || '0');
        
        const healthScore = Math.min(100, Math.round(
          (totalCattle > 0 ? 30 : 0) +
          (avgMilkYield > 0 ? 30 : 0) +
          (avgCropYield > 0 ? 20 : 0) +
          (totalArea > 0 ? 20 : 0)
        ));
        
        setMetrics({
          cattle_count: totalCattle,
          milk_productivity: avgMilkYield || 0,
          crop_yield: avgCropYield || 0,
          total_area: totalArea,
          health_score: healthScore
        });
        
        if (avgMilkYield > 0) {
          setComparison(prev => ({
            ...prev,
            your_value: avgMilkYield
          }));
        }
      }
      
      const statsResponse = await fetch(`${FARMER_API}?action=get_market_stats`, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const statsData = await statsResponse.json();
      
      if (statsData) {
        const metricToShow = statsData.user.meat_yield > 0 ? 'meat' : 'milk';
        
        if (metricToShow === 'meat') {
          setComparison({
            your_value: statsData.user.meat_yield,
            regional_avg: statsData.regional.meat_yield,
            national_avg: statsData.national.meat_yield,
            ranking: statsData.ranking
          });
        } else if (statsData.user.milk_yield > 0) {
          setComparison({
            your_value: statsData.user.milk_yield,
            regional_avg: statsData.regional.milk_yield,
            national_avg: statsData.national.milk_yield,
            ranking: statsData.ranking
          });
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки диагностики:', error);
      toast.error('Не удалось загрузить данные хозяйства');
    } finally {
      setLoadingDiagnostics(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const messagesToSend = [...chatMessages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('https://functions.poehali.dev/058d6fd2-bddb-408f-8975-4e567b3109fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: messagesToSend })
      });

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: chatMessages.length + 2,
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Не удалось получить ответ от GigaChat. Попробуйте позже.');
      
      const errorResponse: ChatMessage = {
        id: chatMessages.length + 2,
        role: 'assistant',
        content: 'Извините, произошла ошибка при обращении к ИИ. Пожалуйста, попробуйте позже.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

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
        <FarmDashboard 
          metrics={metrics}
          userName={user?.name}
          getHealthColor={getHealthColor}
          getHealthText={getHealthText}
        />

        <MarketComparisonPanel comparison={comparison} />

        <GigaChatPanel
          chatMessages={chatMessages}
          isTyping={isTyping}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          recommendations={recommendations}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        />
      </div>
    </div>
  );
}