import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { FARMER_API } from './proposal-types';

interface DeletionRequest {
  id: number;
  proposal_id: number;
  status: string;
  total_investors: number;
  confirmed_investors: number;
  created_at: string;
  proposal_description: string;
}

interface Props {
  userId: string;
}

const DeletionRequests = ({ userId }: Props) => {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${FARMER_API}?action=get_deletion_requests`, {
        headers: { 'X-User-Id': userId }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки запросов на удаление:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex justify-center">
          <Icon name="Loader2" className="animate-spin text-gray-400" size={24} />
        </div>
      </Card>
    );
  }

  if (requests.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-yellow-50 border-yellow-200 mb-6">
      <div className="flex items-start gap-3">
        <Icon name="Clock" className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
        <div className="flex-1">
          <h3 className="font-bold text-yellow-900 mb-2">Ожидают подтверждения удаления</h3>
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg p-3 border border-yellow-200">
                <p className="text-sm text-gray-700 mb-2">{request.proposal_description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Icon name="Users" size={14} className="text-gray-500" />
                    <span className="text-gray-600">
                      Подтвердили: <span className="font-bold text-green-600">{request.confirmed_investors}</span> из {request.total_investors}
                    </span>
                  </div>
                  {request.confirmed_investors === request.total_investors && (
                    <span className="ml-auto px-2 py-1 rounded bg-green-100 text-green-700 font-semibold">
                      ✓ Удаляется...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DeletionRequests;
