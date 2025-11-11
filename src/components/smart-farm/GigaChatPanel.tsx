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

interface GigaChatPanelProps {
  chatMessages: ChatMessage[];
  isTyping: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: () => void;
  recommendations: AIRecommendation[];
  expandedCard: number | null;
  setExpandedCard: (value: number | null) => void;
}

export default function GigaChatPanel({
  chatMessages,
  isTyping,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  recommendations,
  expandedCard,
  setExpandedCard
}: GigaChatPanelProps) {
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Icon name="Bot" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">GigaChat AI</h3>
                    <p className="text-xs text-gray-500">Ваш личный агроном</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-gray-600">Онлайн</span>
                  </div>
                </div>
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
                <p className="text-xs text-gray-500 mt-2 text-center">
                  💡 Спросите про удобрения, корма, рыночные цены или попросите совет
                </p>
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
