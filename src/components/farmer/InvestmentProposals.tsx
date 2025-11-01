import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

interface Proposal {
  id: number;
  description: string;
  price: number;
  shares: number;
  type: string;
  status: string;
  created_at: string;
}

export default function InvestmentProposals() {
  const { user, loading: authLoading } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    price: '',
    shares: '',
    type: 'livestock'
  });

  useEffect(() => {
    if (!authLoading && user) {
      checkProfile();
      loadProposals();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const checkProfile = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${FARMER_API}?action=get_profile`, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const data = await response.json();
      
      if (data.profile) {
        const complete = !!(
          data.profile.first_name &&
          data.profile.last_name &&
          data.profile.phone &&
          data.profile.bio &&
          data.profile.farm_name
        );
        setProfileComplete(complete);
      }
    } catch (error) {
      console.error('Ошибка проверки профиля:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProposals = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${FARMER_API}?action=get_proposals`, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Ошибка загрузки предложений:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.description || !formData.price || !formData.shares) {
      toast.error('Заполните все поля');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          action: 'create_proposal',
          description: formData.description,
          price: parseFloat(formData.price),
          shares: parseInt(formData.shares),
          type: formData.type
        })
      });

      if (response.ok) {
        toast.success('Предложение создано! +30 баллов');
        setFormData({ description: '', price: '', shares: '', type: 'livestock' });
        setShowForm(false);
        loadProposals();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка создания предложения');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (proposalId: number) => {
    if (!user) return;
    if (!confirm('Удалить это предложение?')) return;

    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          action: 'delete_proposal',
          proposal_id: proposalId
        })
      });

      if (response.ok) {
        toast.success('Предложение удалено');
        loadProposals();
      } else {
        toast.error('Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!profileComplete) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Предложения для инвестиций</h2>
          <p className="text-gray-600 mt-1">Создание предложений доступно после заполнения профиля</p>
        </div>

        <Card className="p-8 bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Заполни профиль на 100%</h3>
            <p className="text-gray-600 mb-4">
              Для создания предложений необходимо полностью заполнить профиль владельца:
              имя, фамилия, телефон, название хозяйства и описание о себе.
            </p>
            <Button onClick={() => window.location.reload()}>
              <Icon name="User" size={16} className="mr-2" />
              Перейти к профилю
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Предложения для инвестиций</h2>
          <p className="text-gray-600 mt-1">Создавай предложения для привлечения инвестиций</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Icon name={showForm ? "X" : "Plus"} size={18} className="mr-2" />
          {showForm ? 'Отменить' : 'Создать предложение'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Новое предложение</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Описание предложения</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Например: Инвестиции в развитие молочной фермы на 50 голов..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Тип предложения</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="livestock">Животноводство</SelectItem>
                    <SelectItem value="crop">Растениеводство</SelectItem>
                    <SelectItem value="equipment">Техника</SelectItem>
                    <SelectItem value="expansion">Расширение</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Сумма (₽)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="500000"
                  required
                />
              </div>

              <div>
                <Label>Количество долей</Label>
                <Input
                  type="number"
                  value={formData.shares}
                  onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                  placeholder="10"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                  Создание...
                </>
              ) : (
                <>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Создать предложение
                </>
              )}
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {proposals.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Package" size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">У вас пока нет предложений</p>
            <p className="text-sm text-gray-500">Создайте первое предложение для привлечения инвесторов</p>
          </Card>
        ) : (
          proposals.map((proposal) => (
            <Card key={proposal.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      proposal.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {proposal.status === 'active' ? 'Активно' : proposal.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {proposal.type === 'livestock' ? 'Животноводство' : 
                       proposal.type === 'crop' ? 'Растениеводство' :
                       proposal.type === 'equipment' ? 'Техника' : 'Расширение'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{proposal.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Icon name="DollarSign" size={16} />
                      <span className="font-semibold">{proposal.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="PieChart" size={16} />
                      <span>{proposal.shares} долей</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" size={16} />
                      <span>{new Date(proposal.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(proposal.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
