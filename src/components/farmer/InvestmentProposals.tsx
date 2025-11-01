import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

export default function InvestmentProposals() {
  const { user, loading: authLoading } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      checkProfile();
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Предложения для инвестиций</h2>
        <p className="text-gray-600 mt-1">Создавай предложения для привлечения инвестиций</p>
      </div>

      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Icon name="Package" size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Функционал создания предложений в разработке</p>
        </div>
      </Card>
    </div>
  );
}