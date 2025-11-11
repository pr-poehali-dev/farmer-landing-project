import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIRecommendation {
  id: number;
  title: string;
  description: string;
  potential_profit: number;
  implementation_cost: number;
  roi: number;
}

interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  tier: string;
}

interface GigaChatPanelProps {
  chatMessages: ChatMessage[];
  isTyping: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: () => void;
  recommendations: AIRecommendation[];
  expandedCard: number | null;
  setExpandedCard: (value: number | null) => void;
  usageInfo?: UsageInfo;
}

export default function GigaChatPanel({
  chatMessages,
  isTyping,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  recommendations,
  expandedCard,
  setExpandedCard,
  usageInfo
}: GigaChatPanelProps) {
  const getTierBadge = () => {
    if (!usageInfo) return null;
    
    const tierColors = {
      free: 'bg-gray-100 text-gray-700',
      basic: 'bg-blue-100 text-blue-700',
      premium: 'bg-purple-100 text-purple-700'
    };
    
    const tierNames = {
      free: 'Бесплатно',
      basic: 'Базовая',
      premium: 'Премиум'
    };
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${tierColors[usageInfo.tier as keyof typeof tierColors] || tierColors.free}`}>
        <Icon name="Zap" size={12} />
        {tierNames[usageInfo.tier as keyof typeof tierNames] || usageInfo.tier}
      </div>
    );
  };
  
  const getUsageColor = () => {
    if (!usageInfo) return 'text-gray-600';
    const percentage = (usageInfo.used / usageInfo.limit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="Brain" size={28} className="text-purple-500" />
          ИИ-Помощник GigaChat
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="p-4 border-b bg-white/80 backdrop-blur-sm rounded-t-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Icon name="Bot" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">GigaChat AI</h3>
                    <p className="text-xs text-gray-500">Ваш личный агроном</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {getTierBadge()}
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-gray-600">Онлайн</span>
                    </div>
                  </div>
                </div>
                {usageInfo && (
                  <div className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-gray-600">Запросов сегодня:</span>
                    <span className={`font-bold ${getUsageColor()}`}>
                      {usageInfo.used} / {usageInfo.limit}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl p-4 ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
                {usageInfo && usageInfo.remaining === 0 ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <Icon name="AlertCircle" size={24} className="text-red-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-red-700 mb-1">
                      Лимит запросов исчерпан
                    </p>
                    <p className="text-xs text-red-600 mb-3">
                      Обновите подписку для продолжения работы с ИИ-помощником
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white rounded p-2 border border-blue-200">
                        <div className="font-bold text-blue-700">Базовая</div>
                        <div className="text-gray-600">30 запросов/день</div>
                        <div className="text-blue-700 font-bold">1000₽/мес</div>
                      </div>
                      <div className="bg-white rounded p-2 border border-purple-200">
                        <div className="font-bold text-purple-700">Премиум</div>
                        <div className="text-gray-600">100 запросов/день</div>
                        <div className="text-purple-700 font-bold">1500₽/мес</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Задайте вопрос о вашем хозяйстве..."
                        className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon name="Send" size={20} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        💡 Спросите про удобрения, корма, рыночные цены
                      </p>
                      {usageInfo && usageInfo.remaining <= 3 && usageInfo.remaining > 0 && (
                        <span className="text-xs font-semibold text-orange-600">
                          Осталось {usageInfo.remaining} запросов
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Icon name="Lightbulb" size={20} className="text-yellow-500" />
              Быстрые советы
            </h3>
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                    expandedCard === rec.id ? 'border-purple-500' : 'border-transparent'
                  }`}
                  onClick={() => setExpandedCard(expandedCard === rec.id ? null : rec.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-900 flex-1">
                        {rec.title}
                      </h4>
                      <Icon
                        name={expandedCard === rec.id ? 'ChevronUp' : 'ChevronDown'}
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                    </div>

                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      <Icon name="TrendingUp" size={12} />
                      ROI: {rec.roi}%
                    </div>

                    {expandedCard === rec.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <p className="text-xs text-gray-600">{rec.description}</p>

                        <div className="space-y-2 bg-gray-50 rounded-lg p-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Прибыль:</span>
                            <span className="font-bold text-green-600">
                              +{(rec.potential_profit / 1000).toFixed(0)}К₽
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Затраты:</span>
                            <span className="font-bold text-red-600">
                              -{(rec.implementation_cost / 1000).toFixed(0)}К₽
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInputMessage(`Расскажи подробнее про: ${rec.title}`);
                          }}
                          className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Icon name="MessageCircle" size={14} />
                          Спросить в чате
                        </button>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}