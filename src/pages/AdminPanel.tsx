import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const AUTH_API = 'https://functions.poehali.dev/0a0119c5-f173-40c2-bc49-c845a420422f';
const ADMIN_SECRET = 'farmer_admin_2025_secret_key';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteUsers = async () => {
    const emailList = emails
      .split('\n')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (emailList.length === 0) {
      toast.error('Введите хотя бы один email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(AUTH_API, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': ADMIN_SECRET
        },
        body: JSON.stringify({ emails: emailList })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка удаления');
      }

      toast.success(data.message);
      setEmails('');
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

      <Card className="max-w-2xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Shield" size={32} className="text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Внимание:</strong> Эта страница позволяет удалять пользователей из базы данных. 
            Действие необратимо!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="emails">Email пользователей для удаления (по одному на строку)</Label>
            <textarea
              id="emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
              className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <Button
            onClick={handleDeleteUsers}
            disabled={loading || !emails.trim()}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                Удаление...
              </>
            ) : (
              <>
                <Icon name="Trash2" size={18} className="mr-2" />
                Удалить пользователей
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Как использовать:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Введите email адреса пользователей, которых нужно удалить</li>
            <li>Каждый email на отдельной строке</li>
            <li>Нажмите кнопку "Удалить пользователей"</li>
            <li>Подтвердите удаление</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;
