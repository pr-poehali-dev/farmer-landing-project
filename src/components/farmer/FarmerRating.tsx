import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { FARMER_API } from '@/types/farm.types';
import RatingCard from './rating/RatingCard';
import RatingBreakdownDetails from './rating/RatingBreakdownDetails';
import LeaderboardList from './rating/LeaderboardList';

const RATING_API = 'https://functions.poehali.dev/ae7c97c0-1d46-4334-9a0c-5a8e54209875';
const LEADERBOARD_API = 'https://functions.poehali.dev/11800a2e-728b-4d50-b1d0-a322d419d556';

const ALL_REGIONS = [
  'Республика Бурятия',
  'Белгородская область',
  'Брянская область',
  'Владимирская область',
  'Воронежская область',
  'Ивановская область',
  'Калужская область',
  'Костромская область',
  'Курская область',
  'Липецкая область',
  'Московская область',
  'Орловская область',
  'Рязанская область',
  'Смоленская область',
  'Тамбовская область',
  'Тверская область',
  'Тульская область',
  'Ярославская область',
  'г. Москва',
  'Республика Карелия',
  'Республика Коми',
  'Архангельская область',
  'Ненецкий автономный округ',
  'Вологодская область',
  'Калининградская область',
  'Ленинградская область',
  'Мурманская область',
  'Новгородская область',
  'Псковская область',
  'г. Санкт-Петербург',
  'Республика Адыгея',
  'Республика Дагестан',
  'Республика Ингушетия',
  'Кабардино-Балкарская Республика',
  'Республика Калмыкия',
  'Карачаево-Черкесская Республика',
  'Республика Северная Осетия-Алания',
  'Чеченская Республика',
  'Краснодарский край',
  'Ставропольский край',
  'Астраханская область',
  'Волгоградская область',
  'Ростовская область',
  'Республика Башкортостан',
  'Республика Марий Эл',
  'Республика Мордовия',
  'Республика Татарстан',
  'Удмуртская Республика',
  'Чувашская Республика',
  'Пермский край',
  'Кировская область',
  'Нижегородская область',
  'Оренбургская область',
  'Пензенская область',
  'Самарская область',
  'Саратовская область',
  'Ульяновская область',
  'Курганская область',
  'Свердловская область',
  'Тюменская область',
  'Ханты-Мансийский автономный округ',
  'Ямало-Ненецкий автономный округ',
  'Челябинская область',
  'Республика Алтай',
  'Республика Тыва',
  'Республика Хакасия',
  'Алтайский край',
  'Красноярский край',
  'Иркутская область',
  'Кемеровская область',
  'Новосибирская область',
  'Омская область',
  'Томская область',
  'Забайкальский край',
  'Республика Саха (Якутия)',
  'Камчатский край',
  'Приморский край',
  'Хабаровский край',
  'Амурская область',
  'Магаданская область',
  'Сахалинская область',
  'Еврейская автономная область',
  'Чукотский автономный округ'
];

interface FarmerRatingProps {
  onGoToDiagnostics?: () => void;
}

interface RatingBreakdown {
  region: number;
  land: number;
  animal: number;
  equipment: number;
  crop: number;
  staff: number;
  finance: number;
}

interface RatingData {
  totalRating: number;
  breakdown: RatingBreakdown;
  coefficients: Record<string, number>;
  weighted: RatingBreakdown;
  region?: string;
  farmName?: string;
}

interface LeaderboardEntry {
  position: number;
  userId: number;
  name: string;
  email: string;
  region: string;
  totalScore: number;
  farmName: string;
  address?: string;
  description?: string;
  animals?: Array<{type: string; count: number}>;
  crops?: Array<{type: string; area: number}>;
  investmentCount?: number;
}

export default function FarmerRating({ onGoToDiagnostics }: FarmerRatingProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<RatingData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadRating();
      loadLeaderboard();
    }
  }, [user]);

  const loadRating = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const [diagResponse, profileResponse] = await Promise.all([
        fetch(`${FARMER_API}?action=get_diagnosis`, {
          headers: { 'X-User-Id': user.id.toString() }
        }),
        fetch(`${FARMER_API}?action=get_profile`, {
          headers: { 'X-User-Id': user.id.toString() }
        })
      ]);

      const diagData = await diagResponse.json();
      const profileData = await profileResponse.json();

      const diagnostics = diagData.diagnosis?.assets?.[0] || {};
      const profile = profileData.profile || {};

      const ratingResponse = await fetch(RATING_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          diagnostics,
          profile
        })
      });

      if (!ratingResponse.ok) {
        throw new Error('Ошибка при расчёте рейтинга');
      }

      const ratingData = await ratingResponse.json();
      setRating({ ...ratingData, region: profile.region, farmName: profile.farm_name });
    } catch (err) {
      setError('Не удалось загрузить рейтинг');
      console.error('Rating error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${LEADERBOARD_API}?limit=50&current_user_id=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке рейтинга');
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setFilteredLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Leaderboard error:', err);
    }
  };

  const normalizeRegion = (region: string): string => {
    if (!region || region === 'Не указан') return 'Не указан';
    
    const normalized = region.trim().toLowerCase();
    
    if (normalized.includes('бурят')) return 'Республика Бурятия';
    if (normalized.includes('москов') && !normalized.includes('область')) return 'г. Москва';
    if (normalized.includes('санкт-петербург') || normalized.includes('спб')) return 'г. Санкт-Петербург';
    if (normalized.includes('ленинград')) return 'Ленинградская область';
    if (normalized.includes('московск')) return 'Московская область';
    if (normalized.includes('краснодар')) return 'Краснодарский край';
    if (normalized.includes('тамбов')) return 'Тамбовская область';
    if (normalized.includes('белгород')) return 'Белгородская область';
    
    return region.replace(/,.*$/, '').trim();
  };

  const handleRegionFilter = (region: string) => {
    setSelectedRegion(region);
    if (region === 'all') {
      setFilteredLeaderboard(leaderboard);
    } else {
      const filtered = leaderboard.filter(entry => normalizeRegion(entry.region) === region);
      setFilteredLeaderboard(filtered);
    }
  };

  const regionsWithCount = ALL_REGIONS.map(region => {
    const count = leaderboard.filter(entry => normalizeRegion(entry.region) === region).length;
    return { region, count };
  });

  const getRatingLevel = (score: number) => {
    if (score >= 600) return { label: 'Отличный', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 450) return { label: 'Хороший', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 300) return { label: 'Средний', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 150) return { label: 'Базовый', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Начальный', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Icon name="Loader2" className="animate-spin mr-2" size={24} />
          <p className="text-gray-600">Рассчитываем рейтинг...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <Icon name="AlertCircle" className="mx-auto mb-4 text-red-500" size={48} />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadRating}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Попробовать снова
        </button>
      </Card>
    );
  }

  if (!rating) {
    return (
      <Card className="p-8 text-center">
        <Icon name="Info" className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-600">Заполните диагностику для расчёта рейтинга</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <RatingCard 
        totalRating={rating.totalRating}
        farmName={rating.farmName}
        region={rating.region}
        getRatingLevel={getRatingLevel}
      />

      <RatingBreakdownDetails 
        weighted={rating.weighted}
        coefficients={rating.coefficients}
      />

      {onGoToDiagnostics && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Хотите повысить рейтинг?</h3>
              <p className="text-sm text-gray-600">Обновите данные диагностики или добавьте новые активы</p>
            </div>
            <Button onClick={onGoToDiagnostics} className="bg-green-600 hover:bg-green-700">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить диагностику
            </Button>
          </div>
        </Card>
      )}

      <LeaderboardList 
        leaderboard={leaderboard}
        filteredLeaderboard={filteredLeaderboard}
        selectedRegion={selectedRegion}
        regionsWithCount={regionsWithCount}
        currentUserId={user?.id}
        onRegionFilter={handleRegionFilter}
      />
    </div>
  );
}
