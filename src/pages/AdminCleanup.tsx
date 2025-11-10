import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const CLEAN_DUPLICATES_URL = 'https://functions.poehali.dev/5c0b0f78-e842-4c50-a00b-9865448bd447';
const RECALCULATE_URL = 'https://functions.poehali.dev/a4a1cdbe-3cf7-4e2b-ab44-e5e8bd3ac60d';

const AdminCleanup = () => {
  const [farmerId, setFarmerId] = useState('11');
  const [keepCount, setKeepCount] = useState('3');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const cleanDuplicates = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(CLEAN_DUPLICATES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmer_id: parseInt(farmerId),
          keep_count: parseInt(keepCount)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast.success(`Удалено ${data.deleted} дубликатов`);
      } else {
        toast.error(data.error || 'Ошибка очистки');
        setResult({ error: data.error });
      }
    } catch (error) {
      toast.error('Ошибка соединения');
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const recalculateRatings = async () => {
    setLoading(true);

    try {
      const response = await fetch(RECALCULATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Пересчитано рейтингов: ${data.success_count}`);
      } else {
        toast.error('Ошибка пересчёта');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Settings" size={28} />
            Админ-панель: Очистка дубликатов
          </h1>
          <p className="text-gray-600 mb-6">
            Инструмент для удаления дубликатов инвестиционных предложений и пересчёта рейтинга
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="farmerId">ID фермера</Label>
              <Input
                id="farmerId"
                type="number"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                placeholder="11"
              />
            </div>

            <div>
              <Label htmlFor="keepCount">Сколько предложений оставить</Label>
              <Input
                id="keepCount"
                type="number"
                value={keepCount}
                onChange={(e) => setKeepCount(e.target.value)}
                placeholder="3"
              />
              <p className="text-sm text-gray-500 mt-1">
                Будут сохранены самые свежие предложения, остальные удалятся
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={cleanDuplicates} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Icon name="Loader2" className="animate-spin" size={16} />
                ) : (
                  <Icon name="Trash2" size={16} />
                )}
                Очистить дубликаты
              </Button>

              <Button 
                onClick={recalculateRatings} 
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Icon name="Loader2" className="animate-spin" size={16} />
                ) : (
                  <Icon name="RefreshCw" size={16} />
                )}
                Пересчитать рейтинг
              </Button>
            </div>
          </div>
        </Card>

        {result && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="FileText" size={20} />
              Результат
            </h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}

        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Icon name="Info" size={18} />
            Инструкция
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Укажите ID фермера (по умолчанию 11 — КФХ "Там, где рассвет")</li>
            <li>Укажите сколько предложений оставить (по умолчанию 3)</li>
            <li>Нажмите "Очистить дубликаты" — система удалит лишние записи</li>
            <li>После успешной очистки нажмите "Пересчитать рейтинг"</li>
            <li>Проверьте результат — рейтинг должен стать корректным</li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default AdminCleanup;
