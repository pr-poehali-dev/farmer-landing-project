import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const PROFILE_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

const ProfileEditor = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: user?.email || '',
    farm_name: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${PROFILE_API}?action=get_profile`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const data = await response.json();
      if (data.profile) {
        setProfile({
          first_name: data.profile.first_name || '',
          last_name: data.profile.last_name || '',
          phone: data.profile.phone || '',
          email: data.profile.email || user?.email || '',
          farm_name: data.profile.farm_name || ''
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    }
  };

  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    
    let formatted = '+7';
    if (numbers.length > 1) {
      formatted += ' (' + numbers.substring(1, 4);
    }
    if (numbers.length >= 5) {
      formatted += ') ' + numbers.substring(4, 7);
    }
    if (numbers.length >= 8) {
      formatted += '-' + numbers.substring(7, 9);
    }
    if (numbers.length >= 10) {
      formatted += '-' + numbers.substring(9, 11);
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setProfile({ ...profile, phone: formatted });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.first_name.trim()) {
      toast.error('Имя обязательно для заполнения');
      return;
    }
    
    if (!profile.last_name.trim()) {
      toast.error('Фамилия обязательна для заполнения');
      return;
    }
    
    if (!profile.phone.trim()) {
      toast.error('Номер телефона обязателен для заполнения');
      return;
    }
    
    const phoneNumbers = profile.phone.replace(/\D/g, '');
    if (phoneNumbers.length !== 11) {
      toast.error('Введите корректный номер телефона');
      return;
    }
    
    if (!validateEmail(profile.email)) {
      toast.error('Введите корректный email');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(PROFILE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'update_profile',
          ...profile
        })
      });
      
      if (response.ok) {
        toast.success('Данные обновлены!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка обновления');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <Icon name="User" className="text-farmer-green" />
          Профиль
        </h2>
        <p className="text-sm text-gray-600 italic">
          Сделай профиль своим — чтобы связь с хранителями была крепче, как корни земли
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="farm_name">
            Название фермы
          </Label>
          <Input
            id="farm_name"
            value={profile.farm_name}
            onChange={(e) => setProfile({ ...profile, farm_name: e.target.value })}
            placeholder="Например: Ферма 'Зелёный луг'"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">
              Имя <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              value={profile.first_name}
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              placeholder="Иван"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="last_name">
              Фамилия <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              value={profile.last_name}
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              placeholder="Иванов"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="phone">
            Номер телефона <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={profile.phone}
            onChange={handlePhoneChange}
            placeholder="+7 (___) ___-__-__"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Формат: +7 (XXX) XXX-XX-XX</p>
        </div>
        
        <div>
          <Label htmlFor="email">
            Почта <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="example@mail.ru"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-farmer-green hover:bg-farmer-green-dark"
        >
          {loading ? (
            <>
              <Icon name="Loader2" className="animate-spin mr-2" size={18} />
              Сохранение...
            </>
          ) : (
            <>
              <Icon name="Save" className="mr-2" size={18} />
              Сохранить изменения
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default ProfileEditor;