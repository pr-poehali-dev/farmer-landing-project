import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import LandSection from './profile/LandSection';
import EmployeesSection from './profile/EmployeesSection';
import AnimalsSection from './profile/AnimalsSection';
import CropsSection from './profile/CropsSection';
import EquipmentSection from './profile/EquipmentSection';
import { Animal, Crop, Equipment, FUNC_URL, RATING_URL } from './profile/types';

export default function ExtendedProfile({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [landOwned, setLandOwned] = useState(0);
  const [landRented, setLandRented] = useState(0);
  const [employeesPermanent, setEmployeesPermanent] = useState(0);
  const [employeesSeasonal, setEmployeesSeasonal] = useState(0);
  
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  
  const [newAnimal, setNewAnimal] = useState<Animal>({
    category: 'КРС',
    direction: 'Молочное',
    breed: '',
    dairy_head_count: 0,
    avg_milk_yield_per_head: 0
  });
  
  const [newCrop, setNewCrop] = useState<Crop>({
    crop_name: 'Пшеница',
    sowing_area: 0,
    gross_harvest: 0
  });
  
  const [newEquipment, setNewEquipment] = useState<Equipment>({
    brand: '',
    model: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const response = await fetch(FUNC_URL, {
        headers: { 'X-User-Id': userId }
      });
      const data = await response.json();
      
      setLandOwned(data.land_owned || 0);
      setLandRented(data.land_rented || 0);
      setEmployeesPermanent(data.employees_permanent || 0);
      setEmployeesSeasonal(data.employees_seasonal || 0);
      setAnimals(data.animals || []);
      setCrops(data.crops || []);
      setEquipment(data.equipment || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const saveLand = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'save_land',
          land_owned: landOwned,
          land_rented: landRented
        })
      });
      
      if (response.ok) {
        toast({ title: 'Данные о земле сохранены' });
        await calculateRating();
      }
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'save_employees',
          employees_permanent: employeesPermanent,
          employees_seasonal: employeesSeasonal
        })
      });
      
      if (response.ok) {
        toast({ title: 'Данные о сотрудниках сохранены' });
        await calculateRating();
      }
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addAnimal = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'add_animal',
          ...newAnimal
        })
      });
      
      if (response.ok) {
        toast({ title: 'Животное добавлено' });
        await loadData();
        await calculateRating();
        setNewAnimal({
          category: 'КРС',
          direction: 'Молочное',
          breed: '',
          dairy_head_count: 0,
          avg_milk_yield_per_head: 0
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка добавления', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addCrop = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'add_crop',
          ...newCrop
        })
      });
      
      if (response.ok) {
        toast({ title: 'Культура добавлена' });
        await loadData();
        await calculateRating();
        setNewCrop({
          crop_name: 'Пшеница',
          sowing_area: 0,
          gross_harvest: 0
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка добавления', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addEquipment = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'add_equipment',
          ...newEquipment
        })
      });
      
      if (response.ok) {
        toast({ title: 'Техника добавлена' });
        await loadData();
        await calculateRating();
        setNewEquipment({
          brand: '',
          model: '',
          year: new Date().getFullYear()
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка добавления', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const calculateRating = async () => {
    try {
      await fetch(RATING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'calculate',
          farmer_id: userId
        })
      });
    } catch (error) {
      console.error('Ошибка пересчета рейтинга:', error);
    }
  };

  return (
    <div className="space-y-6">
      <LandSection
        landOwned={landOwned}
        landRented={landRented}
        loading={loading}
        onLandOwnedChange={setLandOwned}
        onLandRentedChange={setLandRented}
        onSave={saveLand}
      />

      <EmployeesSection
        employeesPermanent={employeesPermanent}
        employeesSeasonal={employeesSeasonal}
        loading={loading}
        onPermanentChange={setEmployeesPermanent}
        onSeasonalChange={setEmployeesSeasonal}
        onSave={saveEmployees}
      />

      <AnimalsSection
        animals={animals}
        newAnimal={newAnimal}
        loading={loading}
        onNewAnimalChange={setNewAnimal}
        onAdd={addAnimal}
      />

      <CropsSection
        crops={crops}
        newCrop={newCrop}
        loading={loading}
        onNewCropChange={setNewCrop}
        onAdd={addCrop}
      />

      <EquipmentSection
        equipment={equipment}
        newEquipment={newEquipment}
        loading={loading}
        onNewEquipmentChange={setNewEquipment}
        onAdd={addEquipment}
      />
    </div>
  );
}
