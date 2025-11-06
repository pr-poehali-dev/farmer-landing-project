import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const INVESTOR_API = 'https://functions.poehali.dev/d4ed65bb-a05a-48e5-b2f9-78e2c3750ef5';

interface DeletionConfirmation {
  id: number;
  deletion_request_id: number;
  confirmed: boolean;
  proposal_id: number;
  proposal_description: string;
  farmer_name: string;
  created_at: string;
}

interface Props {
  userId: string;
}

const DeletionConfirmations = ({ userId }: Props) => {
  const [confirmations, setConfirmations] = useState<DeletionConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<number | null>(null);

  useEffect(() => {
    if (userId) {
      fetchConfirmations();
      
      const interval = setInterval(fetchConfirmations, 10000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchConfirmations = async () => {
    try {
      const response = await fetch(`${INVESTOR_API}?action=get_deletion_requests`, {
        headers: { 'X-User-Id': userId }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConfirmations(data.requests || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки запросов на подтверждение:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (confirmationId: number) => {
    setConfirming(confirmationId);
    
    try {
      const response = await fetch(INVESTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'confirm_deletion',
          confirmation_id: confirmationId
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.all_confirmed) {
          toast.success('Все инвесторы подтвердили. Предложение удаляется...', { duration: 5000 });
        } else {
          toast.success(`Подтверждено! Ожидаем остальных (${result.confirmed}/${result.total})`);
        }
        fetchConfirmations();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка подтверждения');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setConfirming(null);
    }
  };

  if (loading) {
    return null;
  }

  if (confirmations.length === 0) {
    return null;
  }

  const pendingConfirmations = confirmations.filter(c => !c.confirmed);
  
  if (pendingConfirmations.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="AlertTriangle" className="text-orange-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-orange-900 mb-2">
            ⚠️ Требуется ваше подтверждение
          </h3>
          <p className="text-sm text-orange-700 mb-4">
            Фермер запрашивает удаление предложения, в котором вы участвуете
          </p>
          
          <div className="space-y-3">
            {pendingConfirmations.map((conf) => (
              <Card key={conf.id} className="p-4 bg-white border-orange-200">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      {conf.farmer_name}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      {conf.proposal_description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Запрошено: {new Date(conf.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleConfirm(conf.id)}
                    disabled={confirming === conf.id}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {confirming === conf.id ? (
                      <><Icon name="Loader2" className="animate-spin mr-2" size={16} /> Подтверждаю...</>
                    ) : (
                      <><Icon name="Check" className="mr-2" size={16} /> Подтвердить удаление</>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-orange-100 rounded-lg">
            <p className="text-xs text-orange-800">
              <Icon name="Info" className="inline mr-1" size={14} />
              После подтверждения всеми инвесторами предложение будет автоматически удалено, 
              а ваша заявка получит статус "отменена".
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DeletionConfirmations;
