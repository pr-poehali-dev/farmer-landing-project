import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Grant {
  title: string;
  description: string;
  amount: string;
  requirements?: string;
  icon: string;
}

interface Subsidy {
  title: string;
  icon: string;
}

const GRANTS: Grant[] = [
  {
    title: 'Агростартап',
    description: 'Программа поддержки фермеров, которая помогает начать свой бизнес в сфере АПК.',
    amount: '1,5–7 млн ₽',
    requirements: 'До 7 млн ₽ при разведении крупного рогатого скота, до 5 млн ₽ в остальных случаях',
    icon: 'Rocket'
  },
  {
    title: 'Агропрогресс',
    description: 'Ориентирована на расширение уже существующих хозяйств.',
    amount: 'До 5 млн ₽',
    requirements: 'Для субъектов малого и среднего бизнеса, микропредприятий. Требуется опыт работы минимум 2 года',
    icon: 'TrendingUp'
  },
  {
    title: 'Агротуризм',
    description: 'Поддерживает хозяйства, которые хотят развивать туристический бизнес на базе фермы.',
    amount: 'До 5 млн ₽',
    icon: 'MapPin'
  },
  {
    title: 'Агромотиватор',
    description: 'Помогает участникам СВО стать фермерами или сельхозпроизводителями.',
    amount: '3–7 млн ₽',
    requirements: 'От 3 до 7 млн ₽ на разведение коров, от 3 до 5 млн ₽ на иные сельхозпроекты',
    icon: 'Award'
  },
  {
    title: 'Грант на семейные фермы',
    description: 'Направлен на поддержку хозяйств, где трудятся члены одной семьи.',
    amount: '5–30 млн ₽',
    requirements: 'От 5 до 30 млн ₽ на развитие, до 20 млн ₽ на компенсацию трат',
    icon: 'Users'
  },
  {
    title: 'Грант для развития материально-технической базы',
    description: 'Помогает потребительским кооперативам обзавестись новыми постройками.',
    amount: 'До 10 млн ₽',
    icon: 'Building2'
  }
];

const SUBSIDIES: Subsidy[] = [
  { title: 'Развитие малых форм хозяйствования', icon: 'Sprout' },
  { title: 'Племенное животноводство', icon: 'Heart' },
  { title: 'Мясное скотоводство', icon: 'Beef' },
  { title: 'Поддержка козоводства', icon: 'Rabbit' },
  { title: 'Поддержка оленеводства', icon: 'Mountain' },
  { title: 'Производство молока и его глубокая переработка', icon: 'Milk' },
  { title: 'Глубокая переработка зерна', icon: 'Wheat' },
  { title: 'Сельскохозяйственное страхование', icon: 'Shield' },
  { title: 'Погектарка (несвязанная поддержка)', icon: 'Map' },
  { title: 'Элитное семеноводство', icon: 'Leaf' },
  { title: 'Производство льна', icon: 'Wind' },
  { title: 'Плодово-ягодные насаждения', icon: 'Apple' }
];

export default function SubsidiesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Гранты для фермеров</h3>
        <p className="text-sm text-gray-600 mb-4">
          Государственные программы поддержки для начинающих и действующих фермеров
        </p>
        <div className="grid gap-4">
          {GRANTS.map((grant, index) => (
            <Card key={index} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={grant.icon as any} size={24} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg text-gray-900">{grant.title}</h4>
                    <Badge className="bg-green-600 text-white ml-2">{grant.amount}</Badge>
                  </div>
                  <p className="text-gray-700 mb-2">{grant.description}</p>
                  {grant.requirements && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <div className="flex gap-2">
                        <Icon name="Info" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-900">{grant.requirements}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Субсидии</h3>
        <p className="text-sm text-gray-600 mb-4">
          Направления государственной поддержки для сельхозпроизводителей
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SUBSIDIES.map((subsidy, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-farmer-green-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={subsidy.icon as any} size={20} className="text-farmer-green" />
                </div>
                <p className="text-sm font-medium text-gray-900">{subsidy.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-5 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex gap-4">
          <Icon name="Lightbulb" size={32} className="text-green-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Как получить поддержку?</h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Выберите подходящую программу для вашего хозяйства</li>
              <li>Подготовьте бизнес-план и необходимые документы</li>
              <li>Обратитесь в Министерство сельского хозяйства вашего региона</li>
              <li>Подайте заявку в установленные сроки</li>
            </ol>
            <p className="text-xs text-gray-600 mt-3">
              💡 Для консультации обращайтесь в Центр поддержки предпринимательства вашего региона
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
