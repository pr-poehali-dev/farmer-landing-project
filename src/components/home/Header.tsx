import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const LEADERBOARD_API = 'https://functions.poehali.dev/11800a2e-728b-4d50-b1d0-a322d419d556';

interface LeaderboardEntry {
  position: number;
  userId: number;
  name: string;
  email: string;
  region: string;
  totalScore: number;
  farmName: string;
}

const Header = () => {
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showLeaderboard && leaderboard.length === 0) {
      loadLeaderboard();
    }
  }, [showLeaderboard]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${LEADERBOARD_API}?limit=10`);
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке рейтинга');
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl">🐄</span>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-farmer-green">ФАРМЕР</h1>
            <span className="text-2xl sm:text-3xl">🌾</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Button onClick={() => setShowLeaderboard(true)} variant="ghost" className="text-sm lg:text-base text-gray-700 hover:text-farmer-green">
              <Icon name="Trophy" size={14} className="lg:w-4 lg:h-4 mr-1" />
              Лидеры
            </Button>
            <Button onClick={() => navigate('/about')} variant="ghost" className="text-sm lg:text-base text-gray-700 hover:text-farmer-green">
              О нас
            </Button>
            <Button onClick={() => navigate('/faq')} variant="ghost" className="text-sm lg:text-base text-gray-700 hover:text-farmer-green">
              FAQ
            </Button>
            <Button onClick={() => navigate('/contacts')} variant="ghost" className="text-sm lg:text-base text-gray-700 hover:text-farmer-green">
              Контакты
            </Button>
            <Button onClick={() => navigate('/login')} variant="ghost" className="text-sm lg:text-base text-farmer-green">
              Войти
            </Button>
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <Button onClick={() => setShowLeaderboard(true)} variant="ghost" className="text-xs text-gray-700 px-2">
              <Icon name="Trophy" size={14} className="mr-0.5" />
              Лидеры
            </Button>
            <Button onClick={() => navigate('/about')} variant="ghost" className="text-xs text-gray-700 px-2">
              О нас
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span>🏆</span> Топ-10 лучших фермеров
            </DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Icon name="Loader2" className="animate-spin mr-2" size={24} />
              <p className="text-gray-600">Загрузка...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, idx) => {
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
                const bgClass = idx === 0 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : idx === 1 || idx === 2 
                    ? 'bg-orange-50 border-orange-200' 
                    : 'bg-gray-50 border-gray-200';
                
                return (
                  <div key={entry.userId} className={`p-4 rounded-lg border-2 ${bgClass}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2 min-w-[60px]">
                          {medal && <span className="text-2xl">{medal}</span>}
                          <span className="font-bold text-gray-600 text-lg">#{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-800">{entry.farmName}</div>
                          <div className="text-sm text-gray-600">{entry.region}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${idx < 3 ? 'text-2xl' : 'text-xl'} text-farmer-green`}>
                          {entry.totalScore}
                        </div>
                        <div className="text-xs text-gray-500">баллов</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {leaderboard.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  Нет данных о фермерах
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Button 
              onClick={() => {
                setShowLeaderboard(false);
                navigate('/leaderboard');
              }}
              className="bg-farmer-green hover:bg-farmer-green-dark text-white"
            >
              Посмотреть полный рейтинг
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;