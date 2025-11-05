import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const LEADERBOARD_URL = 'https://functions.poehali.dev/93540074-a141-40ce-b20a-4ca6cdb4e592';

interface FarmerData {
  user_id: string;
  farm_name: string;
  region: string;
  score: number;
  details?: any;
}

export default function B2BPanel() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    region: '',
    nomination: 'total',
    minScore: '',
    cropType: '',
    animalType: '',
    equipmentYearFrom: '',
    landAreaMin: ''
  });
  
  const [results, setResults] = useState<FarmerData[]>([]);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md text-center">
          <Icon name="Lock" size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Доступ запрещен</h2>
          <p className="text-gray-600 mb-4">Этот раздел доступен только для B2B партнёров</p>
          <Button onClick={() => navigate('/')}>На главную</Button>
        </Card>
      </div>
    );
  }

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.region) params.append('region', filters.region);
      params.append('nomination', filters.nomination);
      
      const response = await fetch(`${LEADERBOARD_URL}?${params}`);
      let data = await response.json();
      
      if (filters.minScore) {
        data = data.filter((f: FarmerData) => f.score >= Number(filters.minScore));
      }
      
      setResults(data);
      toast({ title: `Найдено хозяйств: ${data.length}` });
    } catch (error) {
      toast({ title: 'Ошибка поиска', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Название хозяйства', 'Регион', 'Рейтинг'];
    const rows = results.map(r => [r.user_id, r.farm_name, r.region, r.score]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `farmers_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({ title: 'Экспорт завершен' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">B2B Панель</h1>
              <p className="text-sm text-gray-600">Поиск и анализ фермерских хозяйств</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/admin')}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Админ-панель
              </Button>
              <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="Filter" size={20} />
            Фильтры поиска
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Регион</Label>
              <Select value={filters.region} onValueChange={(v) => setFilters({...filters, region: v})}>
                <SelectTrigger><SelectValue placeholder="Все регионы" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все регионы</SelectItem>
                  <SelectItem value="Московская область">Московская область</SelectItem>
                  <SelectItem value="Краснодарский край">Краснодарский край</SelectItem>
                  <SelectItem value="Ростовская область">Ростовская область</SelectItem>
                  <SelectItem value="Республика Татарстан">Республика Татарстан</SelectItem>
                  <SelectItem value="Воронежская область">Воронежская область</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Специализация</Label>
              <Select value={filters.nomination} onValueChange={(v) => setFilters({...filters, nomination: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Все хозяйства</SelectItem>
                  <SelectItem value="земля">Растениеводство</SelectItem>
                  <SelectItem value="молоко">Молочное направление</SelectItem>
                  <SelectItem value="мясо">Мясное направление</SelectItem>
                  <SelectItem value="техника">Высокотехнологичные</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Минимальный рейтинг</Label>
              <Input
                type="number"
                placeholder="Например, 500"
                value={filters.minScore}
                onChange={(e) => setFilters({...filters, minScore: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSearch} disabled={loading} className="flex-1">
              <Icon name="Search" size={16} className="mr-2" />
              Найти хозяйства
            </Button>
            <Button onClick={exportToCSV} disabled={results.length === 0} variant="outline">
              <Icon name="Download" size={16} className="mr-2" />
              Экспорт в CSV
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">Поиск хозяйств...</p>
          </div>
        ) : results.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Search" size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Задайте параметры поиска и нажмите "Найти хозяйства"</p>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-700">
                Найдено хозяйств: <strong>{results.length}</strong>
              </p>
            </div>

            <div className="space-y-3">
              {results.map((farmer) => (
                <Card key={farmer.user_id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{farmer.farm_name}</h3>
                      <p className="text-sm text-gray-600">{farmer.region || 'Регион не указан'}</p>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span className="text-gray-700">ID: {farmer.user_id}</span>
                        <span className="text-gray-700">Рейтинг: <strong>{farmer.score}</strong></span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Icon name="Eye" size={16} className="mr-1" />
                        Подробнее
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icon name="Mail" size={16} className="mr-1" />
                        Контакт
                      </Button>
                    </div>
                  </div>
                  
                  {farmer.details && (
                    <div className="mt-3 pt-3 border-t flex gap-4 text-sm text-gray-600">
                      {filters.nomination === 'земля' && (
                        <>
                          <span>📊 Площадь: {farmer.details.total_area} га</span>
                          <span>🌾 Урожайность: {farmer.details.avg_yield?.toFixed(2)} т/га</span>
                        </>
                      )}
                      {filters.nomination === 'молоко' && (
                        <>
                          <span>🐄 Поголовье: {farmer.details.total_heads}</span>
                          <span>🥛 Надой: {farmer.details.total_production} л/год</span>
                        </>
                      )}
                      {filters.nomination === 'мясо' && (
                        <>
                          <span>🐮 Поголовье: {farmer.details.total_heads}</span>
                          <span>🥩 Выход: {farmer.details.total_production} кг/год</span>
                        </>
                      )}
                      {filters.nomination === 'техника' && (
                        <>
                          <span>🚜 Техники: {farmer.details.equipment_count}</span>
                          <span>📅 Средний год: {farmer.details.avg_year}</span>
                        </>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
