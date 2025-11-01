import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

const FarmerDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [diagnosisCompleted, setDiagnosisCompleted] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const [diagnosis, setDiagnosis] = useState({
    cows_count: 0,
    cows_type: '',
    fields_hectares: 0,
    crops: [] as string[],
    other_assets: '',
    farm_name: '',
    region: '',
    vk_link: ''
  });
  
  const [newProposal, setNewProposal] = useState({
    description: '',
    price: 0,
    shares: 1,
    type: 'products',
    photo_url: ''
  });
  
  const [proposals, setProposals] = useState<any[]>([]);
  const [savingDiagnosis, setSavingDiagnosis] = useState(false);
  const [creatingProposal, setCreatingProposal] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'farmer')) {
      navigate('/login');
    } else if (user) {
      loadData();
    }
  }, [authLoading, user, navigate]);

  const loadData = async () => {
    try {
      const diagnosisRes = await fetch(`${FARMER_API}?action=get_diagnosis`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const diagnosisData = await diagnosisRes.json();
      
      if (diagnosisData.diagnosis) {
        setDiagnosis(diagnosisData.diagnosis);
        setDiagnosisCompleted(true);
      }
      
      const proposalsRes = await fetch(`${FARMER_API}?action=get_proposals`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const proposalsData = await proposalsRes.json();
      setProposals(proposalsData.proposals || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const saveDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDiagnosis(true);
    
    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'save_diagnosis',
          ...diagnosis
        })
      });
      
      if (response.ok) {
        toast.success('Диагностика сохранена!');
        setDiagnosisCompleted(true);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка сохранения');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setSavingDiagnosis(false);
    }
  };

  const createProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingProposal(true);
    
    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'create_proposal',
          ...newProposal
        })
      });
      
      if (response.ok) {
        toast.success('Предложение создано!');
        setNewProposal({
          description: '',
          price: 0,
          shares: 1,
          type: 'products',
          photo_url: ''
        });
        loadData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка создания');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setCreatingProposal(false);
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-farmer-green" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon name="Sprout" size={32} className="text-farmer-green" />
            <div>
              <h1 className="text-xl font-bold text-farmer-green">Кабинет Фермера</h1>
              <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
            </div>
          </div>
          <Button onClick={() => { logout(); navigate('/'); }} variant="outline">
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!diagnosisCompleted && (
          <Card className="p-6 mb-8 border-2 border-farmer-orange">
            <div className="flex items-start gap-3 mb-4">
              <Icon name="AlertCircle" className="text-farmer-orange" size={24} />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Обязательная диагностика</h2>
                <p className="text-gray-600">Заполните данные о вашем хозяйстве для продолжения</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Icon name="FileText" className="text-farmer-green" />
            Диагностика хозяйства
          </h2>
          
          <form onSubmit={saveDiagnosis} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cows_count">Количество коров</Label>
                <Input
                  id="cows_count"
                  type="number"
                  value={diagnosis.cows_count || ''}
                  onChange={(e) => setDiagnosis({ ...diagnosis, cows_count: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label htmlFor="cows_type">Направление</Label>
                <Select value={diagnosis.cows_type} onValueChange={(value) => setDiagnosis({ ...diagnosis, cows_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите направление" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="мясное">Мясное</SelectItem>
                    <SelectItem value="молочное">Молочное</SelectItem>
                    <SelectItem value="смешанное">Смешанное</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="fields_hectares">Площадь полей (гектары)</Label>
              <Input
                id="fields_hectares"
                type="number"
                value={diagnosis.fields_hectares || ''}
                onChange={(e) => setDiagnosis({ ...diagnosis, fields_hectares: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farm_name">Название фермы</Label>
                <Input
                  id="farm_name"
                  value={diagnosis.farm_name}
                  onChange={(e) => setDiagnosis({ ...diagnosis, farm_name: e.target.value })}
                  placeholder="Например: Ферма 'Зеленые поля'"
                />
              </div>
              
              <div>
                <Label htmlFor="region">Регион</Label>
                <Select value={diagnosis.region} onValueChange={(value) => setDiagnosis({ ...diagnosis, region: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите регион" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Московская область">Московская область</SelectItem>
                    <SelectItem value="Ленинградская область">Ленинградская область</SelectItem>
                    <SelectItem value="Краснодарский край">Краснодарский край</SelectItem>
                    <SelectItem value="Ростовская область">Ростовская область</SelectItem>
                    <SelectItem value="Свердловская область">Свердловская область</SelectItem>
                    <SelectItem value="Татарстан">Республика Татарстан</SelectItem>
                    <SelectItem value="Башкортостан">Республика Башкортостан</SelectItem>
                    <SelectItem value="Новосибирская область">Новосибирская область</SelectItem>
                    <SelectItem value="Воронежская область">Воронежская область</SelectItem>
                    <SelectItem value="Другой">Другой регион</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="vk_link">Ссылка на ВКонтакте</Label>
              <Input
                id="vk_link"
                value={diagnosis.vk_link}
                onChange={(e) => setDiagnosis({ ...diagnosis, vk_link: e.target.value })}
                placeholder="https://vk.com/your_farm"
              />
            </div>
            
            <div>
              <Label htmlFor="other_assets">Другие активы</Label>
              <Textarea
                id="other_assets"
                value={diagnosis.other_assets}
                onChange={(e) => setDiagnosis({ ...diagnosis, other_assets: e.target.value })}
                placeholder="Опишите технику, постройки и другие активы..."
                rows={3}
              />
            </div>
            
            <Button type="submit" disabled={savingDiagnosis} className="bg-farmer-green hover:bg-farmer-green-dark">
              {savingDiagnosis ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить диагностику
                </>
              )}
            </Button>
          </form>
        </Card>

        {diagnosisCompleted && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <Icon name="Plus" className="text-farmer-orange" />
              Создать предложение
            </h2>
            
            <form onSubmit={createProposal} className="space-y-4">
              <div>
                <Label htmlFor="description">Описание предложения *</Label>
                <Textarea
                  id="description"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  placeholder="Подробно опишите ваше предложение..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Цена (руб.) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProposal.price || ''}
                    onChange={(e) => setNewProposal({ ...newProposal, price: parseFloat(e.target.value) || 0 })}
                    placeholder="10000"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="shares">Количество долей</Label>
                  <Input
                    id="shares"
                    type="number"
                    value={newProposal.shares}
                    onChange={(e) => setNewProposal({ ...newProposal, shares: parseInt(e.target.value) || 1 })}
                    placeholder="1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Тип предложения</Label>
                  <Select value={newProposal.type} onValueChange={(value) => setNewProposal({ ...newProposal, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="products">Продукты</SelectItem>
                      <SelectItem value="income">Доход</SelectItem>
                      <SelectItem value="patronage">Патронаж</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button type="submit" disabled={creatingProposal} className="bg-farmer-orange hover:bg-farmer-orange-dark">
                {creatingProposal ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                    Создание...
                  </>
                ) : (
                  'Опубликовать предложение'
                )}
              </Button>
            </form>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Icon name="List" className="text-farmer-green" />
            Мои предложения
          </h2>
          
          {proposals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Пока нет предложений</p>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Card key={proposal.id} className="p-4 border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{proposal.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Цена: {proposal.price} ₽</span>
                        <span>Долей: {proposal.shares}</span>
                        <span>Тип: {proposal.type}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      proposal.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;