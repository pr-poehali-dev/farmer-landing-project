import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const DELETE_API = 'https://functions.poehali.dev/68b32d82-8055-4ae6-b41c-28ff4dad404b';
const ADMIN_SECRET = 'farmer_admin_2025_secret_key';

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

const AdminUserDelete = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const mockUsers: User[] = [
        { id: 5, email: 'iliakrasnopeev@yandex.ru', role: 'investor', created_at: '2025-10-31' },
        { id: 6, email: 'Iliakrasnopeev@yandex.ru', role: 'farmer', created_at: '2025-10-31' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('Выберите хотя бы одного пользователя');
      return;
    }

    if (!confirm(`Удалить ${selectedIds.length} пользователей? Это действие необратимо!`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(DELETE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': ADMIN_SECRET
        },
        body: JSON.stringify({ user_ids: selectedIds })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка удаления');
      }

      toast.success(data.message);
      setSelectedIds([]);
      setUsers(users.filter(u => !selectedIds.includes(u.id)));
      
    } catch (error: any) {
      toast.error(error.message || 'Ошибка удаления пользователей');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-4"
      >
        <Icon name="Home" size={20} className="mr-2" />
        На главную
      </Button>

      <Card className="max-w-4xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="UserX" size={32} className="text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Удаление пользователей</h1>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Внимание:</strong> Удаление пользователя также удалит все его данные: 
            инвестиции, предложения, продукты, объявления и прочее. Действие необратимо!
          </p>
        </div>

        {loading && users.length === 0 ? (
          <div className="flex justify-center py-8">
            <Icon name="Loader2" className="animate-spin" size={32} />
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              {users.map(user => (
                <div
                  key={user.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedIds.includes(user.id)
                      ? 'bg-red-50 border-red-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleUser(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => toggleUser(user.id)}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-600">
                          ID: {user.id} | Роль: {user.role} | Создан: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleDelete}
                disabled={loading || selectedIds.length === 0}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                    Удаление...
                  </>
                ) : (
                  <>
                    <Icon name="Trash2" size={18} className="mr-2" />
                    Удалить выбранных ({selectedIds.length})
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setSelectedIds(users.map(u => u.id))}
                disabled={loading}
              >
                Выбрать всех
              </Button>

              <Button
                variant="outline"
                onClick={() => setSelectedIds([])}
                disabled={loading}
              >
                Снять выбор
              </Button>
            </div>
          </>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Инструкция:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Отметьте пользователей для удаления (клик по карточке)</li>
            <li>Нажмите "Удалить выбранных"</li>
            <li>Подтвердите удаление</li>
            <li>Все данные пользователя будут удалены из базы</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default AdminUserDelete;
