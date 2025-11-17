import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Accordion } from "@/components/ui/accordion";
import { FARMER_API, Animal, Equipment, Crop } from '@/types/farm.types';
import ProgressCard from './ProgressCard';
import ProFeatureCard from './ProFeatureCard';
import SubsidiesTab from './SubsidiesTab';
import OnboardingWizard, { OnboardingData } from './OnboardingWizard';
import LandSection from './LandSection';
import EmployeesSection from './EmployeesSection';
import CropsSection from './CropsSection';
import EquipmentSection from './EquipmentSection';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface FarmDiagnosticsProps {
  onGoToRating?: () => void;
}

export default function FarmDiagnostics({ onGoToRating }: FarmDiagnosticsProps) {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [landArea, setLandArea] = useState('');
  const [landOwned, setLandOwned] = useState('');
  const [landRented, setLandRented] = useState('');

  useEffect(() => {
    const owned = parseFloat(landOwned) || 0;
    const rented = parseFloat(landRented) || 0;
    const total = owned + rented;
    if (total > 0) {
      setLandArea(total.toString());
    }
  }, [landOwned, landRented]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [employeesPermanent, setEmployeesPermanent] = useState(0);
  const [employeesSeasonal, setEmployeesSeasonal] = useState(0);

  useEffect(() => {
    console.log('📊 FarmDiagnostics useEffect:', { authLoading, user, userId: user?.id });
    if (!authLoading && user) {
      console.log('✅ Условие выполнено, вызываем loadDiagnostics');
      loadDiagnostics();
    } else if (!authLoading && !user) {
      console.log('❌ User отсутствует после загрузки auth');
      setLoadingData(false);
    } else {
      console.log('⏳ Ещё загружается auth...');
    }
  }, [authLoading, user]);

  const loadDiagnostics = async () => {
    console.log('🔍 loadDiagnostics: user =', user);
    if (!user) {
      console.warn('❌ User отсутствует, проверяем localStorage...');
      const storedUser = localStorage.getItem('user');
      console.log('📦 localStorage user:', storedUser);
      return;
    }
    
    try {
      console.log('📡 Загружаю диагностику для user.id =', user.id);
      const response = await fetch(`${FARMER_API}?action=get_diagnosis`, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const data = await response.json();
      console.log('📥 Получены данные:', data);
      
      if (data.diagnosis && data.diagnosis.assets && data.diagnosis.assets.length > 0) {
        const info = data.diagnosis.assets[0];
        console.log('✅ Устанавливаю данные:', info);
        setLandArea(info.land_area || '');
        setLandOwned(info.land_owned || '');
        setLandRented(info.land_rented || '');
        setAnimals(info.animals || []);
        setEquipment(info.equipment || []);
        setCrops(info.crops || []);
        setEmployeesPermanent(info.employees_permanent || 0);
        setEmployeesSeasonal(info.employees_seasonal || 0);
      } else {
        console.log('ℹ️ Нет сохранённых данных диагностики');
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки диагностики:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const addAnimal = () => {
    setAnimals([...animals, { type: 'cows', count: 0, breed: '', direction: 'other' }]);
  };

  const removeAnimal = (index: number) => {
    setAnimals(animals.filter((_, i) => i !== index));
  };

  const updateAnimal = (index: number, field: keyof Animal, value: any) => {
    const updated = [...animals];
    updated[index] = { ...updated[index], [field]: value };
    setAnimals(updated);
  };

  const addEquipment = () => {
    setEquipment([...equipment, { id: Date.now().toString(), brand: '', model: '', year: '', attachments: '' }]);
  };

  const removeEquipment = (index: number) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const updateEquipment = (index: number, field: keyof Equipment, value: any) => {
    const updated = [...equipment];
    updated[index] = { ...updated[index], [field]: value };
    setEquipment(updated);
  };

  const addCrop = () => {
    setCrops([...crops, { type: 'corn', area: 0, yield: 0 }]);
  };

  const removeCrop = (index: number) => {
    setCrops(crops.filter((_, i) => i !== index));
  };

  const updateCrop = (index: number, field: keyof Crop, value: any) => {
    const updated = [...crops];
    updated[index] = { ...updated[index], [field]: value };
    setCrops(updated);
  };

  const handleSave = async () => {
    console.log('🎯 handleSave вызван, user:', user);
    console.log('💾 localStorage.user:', localStorage.getItem('user'));
    
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : user;
    
    if (!currentUser) {
      console.error('❌ User не найден!');
      toast.error('Ошибка: пользователь не авторизован');
      return;
    }
    
    setLoading(true);
    try {
      const assets = {
        land_area: landArea,
        land_owned: landOwned,
        land_rented: landRented,
        animals,
        equipment,
        crops,
        employees_permanent: employeesPermanent,
        employees_seasonal: employeesSeasonal,
      };

      console.log('🚀 Сохранение данных:', { userId: currentUser.id, assets });

      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser.id.toString()
        },
        body: JSON.stringify({
          action: 'save_diagnosis',
          assets: [assets]
        })
      });

      console.log('📡 Ответ сервера:', response.status, response.statusText);
      const data = await response.json();
      console.log('📦 Данные ответа:', data);

      if (response.ok) {
        toast.success('✅ Данные сохранены! Обновляю рейтинг...');
        await loadDiagnostics();
        
        try {
          const ratingResponse = await fetch('https://functions.poehali.dev/8b32a74d-fb4e-4f8b-894e-5a27e80f319a', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (ratingResponse.ok) {
            console.log('✅ Рейтинг пересчитан');
          }
        } catch (err) {
          console.error('⚠️ Не удалось пересчитать рейтинг:', err);
        }
      } else {
        toast.error(data.error || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
      toast.error('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handleAiAnalysis = () => {
    toast.info('ИИ-анализ доступен по платной подписке. Функция в разработке — скоро запуск!');
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : user;
    
    if (!currentUser) {
      toast.error('Ошибка: пользователь не авторизован');
      return;
    }
    
    setLoading(true);
    try {
      const landAreaValue = (parseFloat(data.landOwned) || 0) + (parseFloat(data.landRented) || 0);
      const assets = {
        land_area: landAreaValue.toString(),
        land_owned: data.landOwned,
        land_rented: data.landRented,
        animals: data.animals,
        equipment: data.equipment,
        crops: data.crops,
        employees_permanent: data.employeesPermanent,
        employees_seasonal: data.employeesSeasonal,
      };

      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser.id.toString()
        },
        body: JSON.stringify({
          action: 'save_diagnosis',
          assets: [assets]
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success('✅ Диагностика сохранена! Рассчитываю рейтинг...');
        
        setLandOwned(data.landOwned);
        setLandRented(data.landRented);
        setAnimals(data.animals);
        setEquipment(data.equipment);
        setCrops(data.crops);
        setEmployeesPermanent(data.employeesPermanent);
        setEmployeesSeasonal(data.employeesSeasonal);
        
        await loadDiagnostics();
        
        try {
          const ratingResponse = await fetch('https://functions.poehali.dev/8b32a74d-fb4e-4f8b-894e-5a27e80f319a', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (ratingResponse.ok) {
            toast.success('🎉 Рейтинг обновлен!');
            if (onGoToRating) {
              setTimeout(() => onGoToRating(), 1500);
            }
          }
        } catch (err) {
          console.error('⚠️ Не удалось пересчитать рейтинг:', err);
        }
      } else {
        toast.error(responseData.error || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
      toast.error('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const animalCount = animals.reduce((sum, a) => sum + a.count, 0);
  const progress = Math.min(100, (
    (landArea ? 20 : 0) +
    (animalCount > 0 ? 20 : 0) +
    (equipment.length > 0 ? 20 : 0) +
    (crops.length > 0 ? 20 : 0) +
    20
  ));

  if (authLoading || loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressCard progress={progress} onStartOnboarding={() => setShowOnboarding(true)} />
      
      <OnboardingWizard 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
        initialData={{
          landOwned,
          landRented,
          animals,
          equipment,
          crops,
          employeesPermanent,
          employeesSeasonal
        }}
      />

      <Accordion type="multiple" className="space-y-4">
        <LandSection
          landOwned={landOwned}
          setLandOwned={setLandOwned}
          landRented={landRented}
          setLandRented={setLandRented}
          landArea={landArea}
          animals={animals}
          addAnimal={addAnimal}
          updateAnimal={updateAnimal}
          removeAnimal={removeAnimal}
          setAnimals={setAnimals}
        />

        <EmployeesSection
          employeesPermanent={employeesPermanent}
          setEmployeesPermanent={setEmployeesPermanent}
          employeesSeasonal={employeesSeasonal}
          setEmployeesSeasonal={setEmployeesSeasonal}
        />

        <CropsSection
          crops={crops}
          addCrop={addCrop}
          updateCrop={updateCrop}
          removeCrop={removeCrop}
        />

        <EquipmentSection
          equipment={equipment}
          addEquipment={addEquipment}
          updateEquipment={updateEquipment}
          removeEquipment={removeEquipment}
        />

        <AccordionItem value="subsidies" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Icon name="BadgeDollarSign" size={20} className="text-green-600" />
              <span className="font-semibold">Субсидии и гранты</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <SubsidiesTab />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button 
        onClick={handleSave} 
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Icon name="Loader2" className="animate-spin mr-2" size={16} />
            Сохраняем...
          </>
        ) : (
          'Сохранить'
        )}
      </Button>

      <ProFeatureCard />
    </div>
  );
}