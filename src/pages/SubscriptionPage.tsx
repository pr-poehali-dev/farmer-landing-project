import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PAYMENT_API = 'https://functions.poehali.dev/0d55a2c7-a1cb-40b4-8d09-da867da0053b';

interface SubscriptionPlan {
  id: number;
  tier: string;
  daily_limit: number;
  price_rub: number;
  description: string;
  features: string[];
  max_proposals: number | null;
  duration_days: number;
  is_active: boolean;
}

interface CurrentSubscription {
  id: number;
  user_id: string;
  tier: string;
  status: string;
  started_at: string;
  expires_at: string;
  auto_renew: boolean;
  daily_limit: number;
  price_rub: number;
  features: string[];
}

interface Payment {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  metadata: any;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<CurrentSubscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [plansRes, subRes] = await Promise.all([
        fetch('https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e?action=get_subscription_plans'),
        fetch(PAYMENT_API, {
          headers: { 'X-User-Id': user.id.toString() }
        })
      ]);

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData.plans || []);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setCurrentSub(subData.subscription);
        setPayments(subData.payments || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tier: string, price: number) => {
    if (!user) return;

    setProcessingTier(tier);

    try {
      const response = await fetch(PAYMENT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          action: 'create_payment',
          tier
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка создания платежа');
      }

      const data = await response.json();

      if (price === 0) {
        toast.success('Бесплатная подписка активирована!');
        loadData();
      } else {
        if (data.confirmation_url) {
          window.location.href = data.confirmation_url;
        } else {
          toast.error('Не удалось получить ссылку на оплату');
        }
      }
    } catch (error: any) {
      console.error('Subscribe error:', error);
      toast.error(error.message || 'Ошибка подписки');
    } finally {
      setProcessingTier(null);
    }
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'free': return '🌱';
      case 'basic': return '🌾';
      case 'premium': return '🏆';
      case 'premium_yearly': return '💎';
      default: return '📦';
    }
  };

  const getPlanName = (tier: string) => {
    const names: Record<string, string> = {
      'free': 'Бесплатный',
      'basic': 'Базовый',
      'premium': 'Премиум',
      'premium_yearly': 'Годовой Премиум'
    };
    return names[tier] || tier;
  };

  const isCurrentPlan = (tier: string) => currentSub?.tier === tier && currentSub?.status === 'active';

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      'pending': { label: 'Ожидает оплаты', className: 'bg-yellow-100 text-yellow-700' },
      'succeeded': { label: 'Оплачен', className: 'bg-green-100 text-green-700' },
      'canceled': { label: 'Отменён', className: 'bg-red-100 text-red-700' }
    };
    return badges[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/farmer')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="ArrowLeft" size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Тарифы и подписки</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentSub && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span>{getPlanIcon(currentSub.tier)}</span>
                  Текущая подписка: {getPlanName(currentSub.tier)}
                </h2>
                <p className="text-gray-600 mb-3">
                  Активна до: {new Date(currentSub.expires_at).toLocaleDateString('ru-RU')}
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={16} className="text-orange-500" />
                    <span>{currentSub.daily_limit} запросов/день</span>
                  </div>
                  {currentSub.features && currentSub.features.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Icon name="CheckCircle" size={16} className="text-green-500" />
                      <span>{currentSub.features.length} возможностей</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {currentSub.price_rub > 0 ? `${currentSub.price_rub}₽` : 'Бесплатно'}
                </div>
                {currentSub.price_rub > 0 && (
                  <p className="text-sm text-gray-500">в месяц</p>
                )}
              </div>
            </div>
          </Card>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Доступные тарифы</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrent = isCurrentPlan(plan.tier);
            const isPopular = plan.tier === 'premium';

            return (
              <Card 
                key={plan.id} 
                className={`p-6 relative ${isPopular ? 'ring-2 ring-green-500 shadow-xl' : ''} ${isCurrent ? 'bg-green-50 border-green-300' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Популярный
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getPlanIcon(plan.tier)}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{getPlanName(plan.tier)}</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {plan.price_rub > 0 ? `${plan.price_rub.toLocaleString()}₽` : 'Бесплатно'}
                  </div>
                  {plan.price_rub > 0 && (
                    <p className="text-sm text-gray-500">
                      {plan.duration_days >= 365 ? 'в год' : 'в месяц'}
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Zap" size={16} className="text-orange-500" />
                    <span>{plan.daily_limit} запросов/день к ИИ</span>
                  </div>
                  {plan.max_proposals !== null && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="FileText" size={16} className="text-blue-500" />
                      <span>{plan.max_proposals} объявлени{plan.max_proposals === 1 ? 'е' : 'й'}</span>
                    </div>
                  )}
                  {plan.max_proposals === null && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Infinity" size={16} className="text-purple-500" />
                      <span>Безлимитные объявления</span>
                    </div>
                  )}
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Icon name="Check" size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => handleSubscribe(plan.tier, plan.price_rub)}
                  disabled={isCurrent || processingTier === plan.tier}
                  className={`w-full ${
                    isCurrent 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : isPopular 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-farmer-green hover:bg-green-700'
                  }`}
                >
                  {processingTier === plan.tier ? (
                    <Icon name="Loader2" className="animate-spin" size={20} />
                  ) : isCurrent ? (
                    'Текущий тариф'
                  ) : plan.price_rub === 0 ? (
                    'Активировать'
                  ) : (
                    'Оформить подписку'
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {payments.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">История платежей</h2>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сумма</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Оплачен</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => {
                      const badge = getStatusBadge(payment.status);
                      return (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.created_at).toLocaleDateString('ru-RU')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                            {payment.amount.toLocaleString()} ₽
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString('ru-RU') : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
