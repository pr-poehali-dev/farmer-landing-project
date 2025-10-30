import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SurveyLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  interest_type: string;
  rating: number;
  suggestions: string;
  region: string;
  created_at: string;
}

interface Stats {
  total: number;
  avgRating: number;
  byUserType: Record<string, number>;
  byRating: Record<string, number>;
}

const Survey = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<SurveyLead[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, avgRating: 0, byUserType: {}, byRating: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/9c5c37d0-1241-4e83-8326-058b1dccc945?type=survey');
      const data = await response.json();
      
      if (data.surveys) {
        setLeads(data.surveys);
        calculateStats(data.surveys);
      }
    } catch (error) {
      toast.error('Ошибка загрузки данных');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: SurveyLead[]) => {
    const total = data.length;
    const avgRating = total > 0 ? data.reduce((sum, l) => sum + (l.rating || 0), 0) / total : 0;
    
    const byUserType: Record<string, number> = {};
    const byRating: Record<string, number> = {};
    
    data.forEach(lead => {
      const type = lead.interest_type || 'Не указано';
      byUserType[type] = (byUserType[type] || 0) + 1;
      
      const rating = lead.rating || 0;
      byRating[rating] = (byRating[rating] || 0) + 1;
    });
    
    setStats({ total, avgRating, byUserType, byRating });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#FAF0C0] flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" className="animate-spin text-[#4CAF50] mx-auto mb-4" size={48} />
          <p className="text-[#5A9FB8]">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#FAF0C0] py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#0099CC] mb-2">
              <Icon name="BarChart3" className="inline mr-3" size={40} />
              Результаты опроса
            </h1>
            <p className="text-[#5A9FB8]">Статистика и отзывы пользователей</p>
          </div>
          <Button onClick={() => navigate('/admin')} className="bg-[#4CAF50] hover:bg-[#66BB6A]">
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            К заявкам
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/90 shadow-lg border-[#A8D5A5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A9FB8] mb-1">Всего ответов</p>
                <p className="text-3xl font-bold text-[#4CAF50]">{stats.total}</p>
              </div>
              <Icon name="Users" className="text-[#A8D5A5]" size={40} />
            </div>
          </Card>

          <Card className="p-6 bg-white/90 shadow-lg border-[#FFAA00]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A9FB8] mb-1">Средний рейтинг</p>
                <p className="text-3xl font-bold text-[#FFAA00]">{stats.avgRating.toFixed(1)}/10</p>
              </div>
              <Icon name="Star" className="text-[#FFAA00]" size={40} />
            </div>
          </Card>

          <Card className="p-6 bg-white/90 shadow-lg border-[#0099CC]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A9FB8] mb-1">Фермеров</p>
                <p className="text-3xl font-bold text-[#0099CC]">{stats.byUserType['Фермер'] || 0}</p>
              </div>
              <Icon name="Tractor" className="text-[#0099CC]" size={40} />
            </div>
          </Card>

          <Card className="p-6 bg-white/90 shadow-lg border-[#5A9FB8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A9FB8] mb-1">Инвесторов</p>
                <p className="text-3xl font-bold text-[#5A9FB8]">{stats.byUserType['Инвестор'] || 0}</p>
              </div>
              <Icon name="TrendingUp" className="text-[#5A9FB8]" size={40} />
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white/90 shadow-lg">
            <h3 className="text-xl font-bold text-[#0099CC] mb-4 flex items-center">
              <Icon name="PieChart" className="mr-2" size={24} />
              Распределение по типам пользователей
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byUserType).map(([type, count]) => (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#5A9FB8]">{type}</span>
                    <span className="font-semibold text-[#4CAF50]">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#4CAF50] h-2 rounded-full transition-all"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white/90 shadow-lg">
            <h3 className="text-xl font-bold text-[#0099CC] mb-4 flex items-center">
              <Icon name="BarChart" className="mr-2" size={24} />
              Распределение оценок
            </h3>
            <div className="space-y-2">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => {
                const count = stats.byRating[rating] || 0;
                if (count === 0) return null;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-[#5A9FB8] w-8">{rating}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                      <div
                        className="bg-gradient-to-r from-[#FFAA00] to-[#4CAF50] h-6 rounded-full flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      >
                        <span className="text-xs font-semibold text-white">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white/90 shadow-lg">
          <h3 className="text-xl font-bold text-[#0099CC] mb-4 flex items-center">
            <Icon name="MessageSquare" className="mr-2" size={24} />
            Предложения и отзывы
          </h3>
          <div className="space-y-4">
            {leads.filter(l => l.suggestions).map(lead => (
              <div key={lead.id} className="border-l-4 border-[#4CAF50] pl-4 py-2 bg-[#E8F5E9]/30 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-[#0099CC]">{lead.name || 'Аноним'}</span>
                    <span className="text-sm text-[#5A9FB8] ml-2">({lead.interest_type})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Star" className="text-[#FFAA00]" size={16} />
                    <span className="font-semibold text-[#FFAA00]">{lead.rating}/10</span>
                  </div>
                </div>
                <p className="text-[#5A9FB8] italic">"{lead.suggestions}"</p>
                {lead.region && (
                  <p className="text-xs text-[#5A9FB8] mt-2">Регион: {lead.region}</p>
                )}
              </div>
            ))}
            {leads.filter(l => l.suggestions).length === 0 && (
              <p className="text-center text-[#5A9FB8] py-8">Пока нет предложений</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Survey;