import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const INVESTOR_API = 'https://functions.poehali.dev/d4ed65bb-a05a-48e5-b2f9-78e2c3750ef5';

interface Props {
  userId: string;
}

export default function DeletionRequests({ userId }: Props) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await fetch(`${INVESTOR_API}?action=get_deletion_requests`, {
        headers: { 'X-User-Id': userId }
      });
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Ошибка загрузки запросов');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (confirmed: boolean) => {
    if (!selectedRequest) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(INVESTOR_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          action: 'confirm_deletion',
          deletion_request_id: selectedRequest.id,
          confirmed,
          response_text: responseText
        })
      });

      if (response.ok) {
        toast.success(confirmed ? 'Удаление подтверждено' : 'Удаление отклонено');
        setSelectedRequest(null);
        setResponseText('');
        loadRequests();
      } else {
        toast.error('Ошибка отправки ответа');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Icon name="Loader2" className="animate-spin text-gray-400 mx-auto" size={48} />
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-500" />
        <p className="text-gray-600">Нет запросов на удаление</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map(req => (
          <Card key={req.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="AlertTriangle" size={20} className="text-orange-600" />
                  <h4 className="font-bold text-lg">Запрос на удаление предложения</h4>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="User" size={14} />
                    <span className="font-semibold">{req.farm_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon name={req.proposal_type === 'income' ? 'DollarSign' : req.proposal_type === 'product' ? 'Package' : 'Eye'} size={14} />
                    <span>{req.proposal_description || 'Предложение'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="Calendar" size={14} />
                    <span>Запрос от {new Date(req.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                
                {req.reason && (
                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Причина удаления:</p>
                    <p className="text-sm text-gray-600">{req.reason}</p>
                  </div>
                )}
                
                {req.confirmed ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-semibold">Вы подтвердили удаление</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => setSelectedRequest(req)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Icon name="MessageSquare" size={16} className="mr-2" />
                    Ответить
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Ответ на запрос</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 mb-2">
                  <Icon name="Info" size={16} className="inline mr-2" />
                  Фермер <strong>{selectedRequest.farm_name}</strong> просит разрешения удалить предложение.
                </p>
                {selectedRequest.reason && (
                  <p className="text-sm text-blue-800">
                    <strong>Причина:</strong> {selectedRequest.reason}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Ваш комментарий (необязательно)</Label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Например: Согласен, можете удалять..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleResponse(false)}
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                  disabled={submitting}
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Отклонить
                </Button>
                <Button 
                  onClick={() => handleResponse(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <><Icon name="Loader2" size={16} className="mr-2 animate-spin" /> Отправка...</>
                  ) : (
                    <><Icon name="Check" size={16} className="mr-2" /> Подтвердить</>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
