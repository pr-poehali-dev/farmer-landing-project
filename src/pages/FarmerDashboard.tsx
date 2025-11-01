import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import InvestmentProposals from '@/components/farmer/InvestmentProposals';
import RegionSelector from '@/components/farmer/RegionSelector';
import AssetsSelector from '@/components/farmer/AssetsSelector';
import ProfileEditor from '@/components/farmer/ProfileEditor';
import GarageItemForm, { GarageItem } from '@/components/garage/GarageItemForm';
import GarageList from '@/components/garage/GarageList';
import TechScoreCard from '@/components/garage/TechScoreCard';
import LeaderboardCard from '@/components/garage/LeaderboardCard';

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

interface Asset {
  id: string;
  type: 'animal' | 'crop' | 'beehive';
  name: string;
  count: number;
  direction?: string;
  hectares?: number;
  details: string;
  investment_types: string[];
}

const FarmerDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [diagnosisCompleted, setDiagnosisCompleted] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const [diagnosis, setDiagnosis] = useState({
    country: 'Россия',
    region: '',
    assets: [] as Asset[]
  });
  
  const [proposals, setProposals] = useState<any[]>([]);
  const [savingDiagnosis, setSavingDiagnosis] = useState(false);
  
  const [garageItems, setGarageItems] = useState<GarageItem[]>([]);
  const [techScore, setTechScore] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number>();
  const [allowAccess, setAllowAccess] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'farmer')) {
      navigate('/login');
    } else if (user) {
      loadData();
    }
  }, [authLoading, user, navigate]);

  const loadData = async () => {
    try {
      console.log('Loading data for user:', user!.id);
      const diagnosisRes = await fetch(`${FARMER_API}?action=get_diagnosis`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const diagnosisData = await diagnosisRes.json();
      console.log('Diagnosis data:', diagnosisData);
      
      if (diagnosisData.diagnosis) {
        setDiagnosis({
          country: diagnosisData.diagnosis.country || 'Россия',
          region: diagnosisData.diagnosis.region || '',
          assets: diagnosisData.diagnosis.assets || []
        });
        setDiagnosisCompleted(diagnosisData.diagnosis.assets.length > 0);
        console.log('Set diagnosis:', diagnosisData.diagnosis);
      }
      
      const proposalsRes = await fetch(`${FARMER_API}?action=get_proposals`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const proposalsData = await proposalsRes.json();
      console.log('Proposals data:', proposalsData);
      setProposals(proposalsData.proposals || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const calculateTechScore = (items: GarageItem[]) => {
    let score = 0;
    const newBadges: string[] = [];
    
    items.forEach(item => {
      if (item.category === 'machinery') score += 10;
      if (item.category === 'equipment') score += 5;
      if (item.category === 'fertilizer') score += 5;
    });
    
    if (score >= 10) newBadges.push('tech_novice');
    if (score >= 100) newBadges.push('tech_master');
    if (score >= 150) newBadges.push('innovator');
    if (score >= 200) newBadges.push('tech_guru');
    
    return { score, badges: newBadges };
  };

  const handleAddGarageItem = async (item: Omit<GarageItem, 'id'>) => {
    const newItem: GarageItem = {
      ...item,
      id: Date.now().toString()
    };
    
    const updatedItems = [...garageItems, newItem];
    setGarageItems(updatedItems);
    
    await handleSaveGarage(updatedItems, allowAccess);
    toast.success('Добавлено в гараж!');
  };

  const handleRemoveGarageItem = async (id: string) => {
    const updatedItems = garageItems.filter(item => item.id !== id);
    setGarageItems(updatedItems);
    await handleSaveGarage(updatedItems, allowAccess);
    toast.success('Удалено из гаража');
  };

  const handleSaveGarage = async (items: GarageItem[], access: boolean) => {
    const { score, badges: newBadges } = calculateTechScore(items);
    setTechScore(score);
    setBadges(newBadges);
    
    try {
      await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'save_garage',
          items,
          tech_score: score,
          badges: newBadges,
          allow_access: access
        })
      });
    } catch (error) {
      console.error('Ошибка сохранения гаража:', error);
    }
  };

  const saveDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!diagnosis.country) {
      toast.error('Выберите страну');
      return;
    }
    
    if (!diagnosis.region) {
      toast.error('Выберите регион');
      return;
    }
    
    if (diagnosis.assets.length === 0) {
      toast.error('Добавьте хотя бы один актив');
      return;
    }
    
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {!diagnosisCompleted && (
          <Card className="p-6 mb-8 border-2 border-farmer-orange bg-orange-50">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" className="text-farmer-orange" size={24} />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Обязательная диагностика</h2>
                <p className="text-gray-600">Заполните данные о вашем хозяйстве для продолжения работы</p>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="diagnosis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnosis" className="flex items-center gap-2">
              <Icon name="FileText" size={18} />
              Диагностика
            </TabsTrigger>
            <TabsTrigger value="proposals" className="flex items-center gap-2" disabled={!diagnosisCompleted}>
              <Icon name="Package" size={18} />
              Предложения
            </TabsTrigger>
            <TabsTrigger value="garage" className="flex items-center gap-2">
              <Icon name="Truck" size={18} />
              Мой гараж
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Icon name="User" size={18} />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnosis">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Icon name="FileText" className="text-farmer-green" />
                Диагностика хозяйства
              </h2>
              
              <form onSubmit={saveDiagnosis} className="space-y-8">
                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Местоположение</h3>
                    <RegionSelector
                      country={diagnosis.country}
                      region={diagnosis.region}
                      onCountryChange={(value) => setDiagnosis({ ...diagnosis, country: value, region: '' })}
                      onRegionChange={(value) => setDiagnosis({ ...diagnosis, region: value })}
                    />
                  </div>

                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Ваши владения</h3>
                    <AssetsSelector
                      assets={diagnosis.assets}
                      onChange={(assets) => setDiagnosis({ ...diagnosis, assets })}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={savingDiagnosis}
                  className="w-full bg-farmer-green hover:bg-farmer-green-dark"
                  size="lg"
                >
                  {savingDiagnosis ? (
                    <>
                      <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" className="mr-2" size={20} />
                      Сохранить диагностику
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="proposals">
            <InvestmentProposals 
              userId={user!.id.toString()}
              onProposalCreated={loadData}
            />
          </TabsContent>

          <TabsContent value="garage">
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                  <Icon name="Truck" className="text-farmer-green" />
                  Мой гараж — твое технологичное царство
                </h2>
                <p className="text-gray-600 mb-4">
                  Добавь свою технику и удобрения — поднимись в рейтинге и стань легендой! 
                  Чем больше деталей, тем выше баллы.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowAccess"
                    checked={allowAccess}
                    onChange={(e) => {
                      setAllowAccess(e.target.checked);
                      handleSaveGarage(garageItems, e.target.checked);
                    }}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="allowAccess" className="text-sm text-gray-700 cursor-pointer">
                    Разрешить доступ продавцам (для премиум-подписчиков)
                  </label>
                </div>
              </Card>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <GarageItemForm onAdd={handleAddGarageItem} />
                  <GarageList items={garageItems} onRemove={handleRemoveGarageItem} />
                </div>
                <div className="space-y-6">
                  <TechScoreCard score={techScore} badges={badges} />
                  <LeaderboardCard 
                    entries={leaderboard} 
                    currentUserScore={techScore}
                    currentUserRank={currentUserRank}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmerDashboard;