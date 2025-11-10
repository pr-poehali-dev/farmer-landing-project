import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const RECALCULATE_URL = 'https://functions.poehali.dev/87e2199e-fccb-4019-b2f7-f2a662a27651';

export default function AdminRecalculateRatings() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRecalculate = async () => {
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch(RECALCULATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(data);
        toast.success(`Пересчет завершен! Успешно: ${data.success_count}, Ошибок: ${data.error_count}`);
      } else {
        toast.error(`Ошибка: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка при пересчете рейтинга');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <Icon name="Calculator" size={32} className="text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Пересчет рейтинга фермеров</h1>
              <p className="text-gray-600">Запустить пересчет для всех фермеров в системе</p>
            </div>
          </div>

          <Button
            onClick={handleRecalculate}
            disabled={loading}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-6"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Пересчитываю...
              </>
            ) : (
              <>
                <Icon name="RefreshCw" size={20} className="mr-2" />
                Запустить пересчет
              </>
            )}
          </Button>

          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">{results.total_farmers}</div>
                  <div className="text-sm text-gray-600">Всего фермеров</div>
                </Card>
                <Card className="p-4 bg-green-50">
                  <div className="text-2xl font-bold text-green-600">{results.success_count}</div>
                  <div className="text-sm text-gray-600">Успешно</div>
                </Card>
                <Card className="p-4 bg-red-50">
                  <div className="text-2xl font-bold text-red-600">{results.error_count}</div>
                  <div className="text-sm text-gray-600">Ошибок</div>
                </Card>
              </div>

              <Card className="p-4">
                <h3 className="font-bold mb-4">Результаты по фермерам:</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.results.map((result: any) => (
                    <div
                      key={result.farmer_id}
                      className={`p-3 rounded ${
                        result.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">Фермер ID: {result.farmer_id}</span>
                          {result.status === 'success' && result.rating && (
                            <div className="text-sm text-gray-600 mt-1">
                              Баллы: {result.rating.total_score} (продуктивность: {result.rating.productivity_score}, 
                              техника: {result.rating.tech_score}, инвестиции: {result.rating.investment_score}, 
                              экспертность: {result.rating.expertise_score}, сообщество: {result.rating.community_score})
                            </div>
                          )}
                          {result.status === 'error' && (
                            <div className="text-sm text-red-600 mt-1">{result.error}</div>
                          )}
                        </div>
                        {result.status === 'success' ? (
                          <Icon name="CheckCircle" size={20} className="text-green-600" />
                        ) : (
                          <Icon name="XCircle" size={20} className="text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
