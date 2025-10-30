import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Lead {
  id: number;
  name?: string;
  email: string;
  phone?: string;
  company_name?: string;
  interest_type?: string;
  message?: string;
  rating?: number;
  suggestions?: string;
  region?: string;
  user_type?: string;
  created_at: string;
}

interface LeadsData {
  farmers?: Lead[];
  investors?: Lead[];
  sellers?: Lead[];
  surveys?: Lead[];
}

const Admin = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<LeadsData>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'farmers' | 'investors' | 'sellers' | 'surveys'>('farmers');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/9c5c37d0-1241-4e83-8326-058b1dccc945');
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      toast.error('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { key: 'farmers' as const, label: 'Фермеры', icon: 'Sprout', count: leads.farmers?.length || 0 },
    { key: 'investors' as const, label: 'Инвесторы', icon: 'TrendingUp', count: leads.investors?.length || 0 },
    { key: 'sellers' as const, label: 'Продавцы', icon: 'Store', count: leads.sellers?.length || 0 },
    { key: 'surveys' as const, label: 'Опросы', icon: 'ClipboardList', count: leads.surveys?.length || 0 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5E6A8] flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin text-[#0099CC] mx-auto mb-4" size={48} />
          <p className="text-[#0099CC] text-lg">Загрузка заявок...</p>
        </div>
      </div>
    );
  }

  const currentLeads = leads[activeTab] || [];

  return (
    <div className="min-h-screen bg-[#F5E6A8] py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#0099CC] mb-2">Админ-панель</h1>
            <p className="text-[#5A9FB8]">Управление заявками с сайта</p>
          </div>
          <Button onClick={() => navigate('/survey')} className="bg-[#FFAA00] hover:bg-[#FF9900] text-white">
            <Icon name="BarChart3" className="mr-2" size={20} />
            Результаты опроса
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              className={activeTab === tab.key 
                ? 'bg-[#0099CC] text-white hover:bg-[#007799]' 
                : 'bg-white text-[#0099CC] border-[#0099CC] hover:bg-[#E5F5FA]'}
            >
              <Icon name={tab.icon as any} className="mr-2" size={18} />
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>

        {currentLeads.length === 0 ? (
          <Card className="p-12 text-center bg-white/80">
            <Icon name="Inbox" className="text-[#5A9FB8] mx-auto mb-4" size={64} />
            <h3 className="text-xl font-semibold text-[#0099CC] mb-2">Пока нет заявок</h3>
            <p className="text-[#5A9FB8]">Заявки появятся здесь после отправки форм на сайте</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {currentLeads.map(lead => (
              <Card key={lead.id} className="p-6 bg-white/90 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0099CC]">
                      {lead.name || lead.company_name || 'Без имени'}
                    </h3>
                    <p className="text-sm text-[#5A9FB8]">{formatDate(lead.created_at)}</p>
                  </div>
                  <span className="px-3 py-1 bg-[#E5F5FA] text-[#0099CC] rounded-full text-sm font-medium">
                    ID: {lead.id}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Icon name="Mail" className="text-[#0099CC] mt-1 flex-shrink-0" size={18} />
                    <div>
                      <p className="text-xs text-[#5A9FB8]">Email</p>
                      <p className="font-medium text-[#0099CC]">{lead.email}</p>
                    </div>
                  </div>

                  {lead.phone && (
                    <div className="flex items-start gap-2">
                      <Icon name="Phone" className="text-[#0099CC] mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-xs text-[#5A9FB8]">Телефон</p>
                        <p className="font-medium text-[#0099CC]">{lead.phone}</p>
                      </div>
                    </div>
                  )}

                  {lead.region && (
                    <div className="flex items-start gap-2">
                      <Icon name="MapPin" className="text-[#0099CC] mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-xs text-[#5A9FB8]">Регион</p>
                        <p className="font-medium text-[#0099CC]">{lead.region}</p>
                      </div>
                    </div>
                  )}

                  {lead.company_name && activeTab === 'farmers' && (
                    <div className="flex items-start gap-2">
                      <Icon name="Building" className="text-[#0099CC] mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-xs text-[#5A9FB8]">Ферма</p>
                        <p className="font-medium text-[#0099CC]">{lead.company_name}</p>
                      </div>
                    </div>
                  )}

                  {lead.interest_type && (
                    <div className="flex items-start gap-2">
                      <Icon name="Target" className="text-[#0099CC] mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-xs text-[#5A9FB8]">Интерес</p>
                        <p className="font-medium text-[#0099CC]">{lead.interest_type}</p>
                      </div>
                    </div>
                  )}

                  {lead.rating && (
                    <div className="flex items-start gap-2">
                      <Icon name="Star" className="text-[#FFAA00] mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-xs text-[#5A9FB8]">Оценка</p>
                        <p className="font-medium text-[#0099CC]">{lead.rating}/10</p>
                      </div>
                    </div>
                  )}
                </div>

                {lead.message && (
                  <div className="mt-4 pt-4 border-t border-[#E5F5FA]">
                    <p className="text-xs text-[#5A9FB8] mb-1">Сообщение</p>
                    <p className="text-[#0099CC]">{lead.message}</p>
                  </div>
                )}

                {lead.suggestions && (
                  <div className="mt-4 pt-4 border-t border-[#E5F5FA]">
                    <p className="text-xs text-[#5A9FB8] mb-1">Предложения</p>
                    <p className="text-[#0099CC]">{lead.suggestions}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;