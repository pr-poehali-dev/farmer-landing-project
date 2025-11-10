import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const RATING_API = 'https://functions.poehali.dev/6e3852b3-e6e1-478e-b710-869bd1a377d8';

export default function AdminRecalculate() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRecalculate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(RATING_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'recalculate_all' })
      });

      const data = await response.json();
      console.log('📊 Результат пересчёта:', data);

      if (response.ok) {
        setResult(data);
        toast.success(`✅ Пересчитан рейтинг для ${data.updated_farmers} из ${data.total_farmers} фермеров!`);
      } else {
        toast.error('Ошибка пересчёта: ' + (data.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
      toast.error('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <Icon name="RefreshCw" size={32} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Пересчёт рейтинга фермеров</h1>
              <p className="text-gray-600 mt-1">Административная панель для массового обновления баллов</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Icon name="AlertTriangle" className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm text-yellow-900">
                <p className="font-semibold mb-2">Что делает эта функция:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Находит всех фермеров с заполненной диагностикой</li>
                  <li>Рассчитывает баллы по 5 категориям (земля, животные, техника, урожай, сотрудники)</li>
                  <li>Сохраняет результаты в таблицу farmer_scores</li>
                  <li>Обновляет общий рейтинг и номинации</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={handleRecalculate}
            disabled={loading}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                Пересчитываем...
              </>
            ) : (
              <>
                <Icon name="PlayCircle" className="mr-2" size={20} />
                Запустить массовый пересчёт
              </>
            )}
          </Button>

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">Результаты пересчёта:</h3>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>✅ Обновлено фермеров: <strong>{result.updated_farmers}</strong></p>
                    <p>📊 Всего фермеров с диагностикой: <strong>{result.total_farmers}</strong></p>
                    {result.errors && result.errors.length > 0 && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded p-3">
                        <p className="font-semibold text-red-900 mb-1">Ошибки:</p>
                        <ul className="list-disc list-inside space-y-1 text-red-800">
                          {result.errors.map((err: string, idx: number) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
