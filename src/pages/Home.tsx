import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const STATS_API = 'https://functions.poehali.dev/dde2cfb3-048c-41f8-b40d-cc6a53590929';

interface Proposal {
  id: number;
  description: string;
  price: number;
  shares: number;
  type: string;
  photo_url: string;
  farmer_name: string;
  farm_name: string;
  region: string;
  vk_link: string;
  investors_count: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ farmers: 0, investors: 0, sellers: 0, total: 0 });
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    fetch(`${STATS_API}?action=public`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err));
    
    fetch(`${STATS_API}?action=proposals`)
      .then(res => res.json())
      .then(data => setProposals(data.proposals || []))
      .catch(err => console.error('Failed to load proposals:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Sprout" size={32} className="text-farmer-green" />
              <h1 className="text-2xl font-bold text-farmer-green">ФАРМЕР</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button onClick={() => navigate('/about')} variant="ghost" className="text-gray-700 hover:text-farmer-green">
                О нас
              </Button>
              <Button onClick={() => navigate('/faq')} variant="ghost" className="text-gray-700 hover:text-farmer-green">
                FAQ
              </Button>
              <Button onClick={() => navigate('/contacts')} variant="ghost" className="text-gray-700 hover:text-farmer-green">
                Контакты
              </Button>
              <Button onClick={() => navigate('/login')} variant="ghost" className="text-farmer-green">
                Войти
              </Button>
              <Button onClick={() => navigate('/register')} className="bg-farmer-green hover:bg-farmer-green-dark text-white">
                Регистрация
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-farmer-green/10 via-white to-farmer-orange/10 min-h-screen flex items-center">
        <div className="container mx-auto text-center">
          <p className="text-lg text-gray-600 mb-4">Вернись к корням — почувствуй пульс настоящей жизни</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            В суете города мы забыли вкус земли...
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
            Но без ферм — только тени еды, лишенные души и силы. Представь: свежий мед, что несет энергию солнца; 
            молоко от коровы, которую ты "усыновил" и видишь в видео; мясо, выросшее на вольных полях.
          </p>
          <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto mb-10 font-medium">
            Это не инвестиции — это связь с настоящим. Без фермеров мы питаемся искусственным, теряя здоровье и радость.
          </p>
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-farmer-green mb-1">{stats.farmers}</div>
              <div className="text-sm text-gray-600">Фермеров</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-farmer-orange mb-1">{stats.investors}</div>
              <div className="text-sm text-gray-600">Инвесторов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-farmer-green mb-1">{stats.sellers}</div>
              <div className="text-sm text-gray-600">Продавцов</div>
            </div>
          </div>
          <Button
            onClick={() => navigate('/register')}
            size="lg"
            className="bg-farmer-orange hover:bg-farmer-orange-dark text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Вернись к истокам — зарегистрируйся сейчас!
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Выбери свой путь к настоящему
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-gray-100 hover:border-farmer-green">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-farmer-green/10 rounded-full flex items-center justify-center">
                  <Icon name="TrendingUp" size={32} className="text-farmer-green" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">
                Из шума улиц — к шепоту полей
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Ты устал от синтетической еды, что крадет энергию? В "Фармер" инвестируй в живые фермы — 
                получи свежий мед, мясо или даже "свою" корову с видео-новостями. Почувствуй, как твои вложения 
                питают здоровье, возвращая вкус жизни.
              </p>
              <Button
                onClick={() => navigate('/register?role=investor')}
                className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white"
              >
                Стань хранителем природы
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-gray-100 hover:border-farmer-orange">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-farmer-orange/10 rounded-full flex items-center justify-center">
                  <Icon name="Wheat" size={32} className="text-farmer-orange" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">
                Твоя ферма — сердце земли
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Твой труд — дар жизни, но без поддержки фермы увядают. "Фармер" — твой мост к тем, 
                кто ценит настоящее. Привлеки инвестиции в обмен на свежие продукты или доли в урожае. 
                Расти вместе с теми, кто верит в живое.
              </p>
              <Button
                onClick={() => navigate('/register?role=farmer')}
                className="w-full bg-farmer-orange hover:bg-farmer-orange-dark text-white"
              >
                Оживи свою ферму
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-gray-100 hover:border-farmer-green">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-farmer-green/10 rounded-full flex items-center justify-center">
                  <Icon name="Package" size={32} className="text-farmer-green" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">
                Стань частью живого цикла
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Продаешь удобрения или технику? В "Фармер" твой товар не просто сделка — это вклад в рост настоящих ферм. 
                Предложи свое фермерам, которые ценят качество, и будь частью движения за живую землю.
              </p>
              <Button
                onClick={() => navigate('/register?role=seller')}
                className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white"
              >
                Поддержи рост
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {proposals.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Активные предложения фермеров
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Стань инвестором реальных ферм и получай свежие продукты
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {proposals.slice(0, 6).map(proposal => (
                <Card key={proposal.id} className="p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {proposal.farm_name || proposal.farmer_name}
                      </h3>
                      {proposal.region && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Icon name="MapPin" size={14} />
                          {proposal.region}
                        </p>
                      )}
                    </div>
                    <div className="px-3 py-1 bg-farmer-green/10 rounded-full">
                      <span className="text-xs font-medium text-farmer-green">
                        {proposal.type === 'products' ? 'Продукты' : 
                         proposal.type === 'animals' ? 'Животные' : 'Техника'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {proposal.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Icon name="Users" size={16} />
                      <span>{proposal.investors_count} инвесторов</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Coins" size={16} />
                      <span>{proposal.shares} долей</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-600">Цена доли</p>
                      <p className="text-2xl font-bold text-farmer-orange">
                        {proposal.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate('/register?role=investor')}
                      className="bg-farmer-green hover:bg-farmer-green-dark text-white"
                    >
                      Инвестировать
                    </Button>
                  </div>
                  
                  {proposal.vk_link && (
                    <a
                      href={proposal.vk_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-2 text-sm text-farmer-green hover:underline"
                    >
                      <Icon name="ExternalLink" size={14} />
                      Страница фермы в ВК
                    </a>
                  )}
                </Card>
              ))}
            </div>
            
            {proposals.length > 6 && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => navigate('/register?role=investor')}
                  variant="outline"
                  className="border-farmer-green text-farmer-green hover:bg-farmer-green hover:text-white"
                >
                  Посмотреть все предложения
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
            Один шаг — и ты в мире, где земля благодарит
          </h2>
          <Card className="p-8 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5">
            <p className="text-lg text-gray-700 leading-relaxed">
              Представь: фермер делит корову на доли — ты берешь свою, следишь за ней в видео, 
              получаешь свежие продукты. Это не сделка — это история жизни, где твоя поддержка 
              спасает от искусственного, возвращая здоровье и энергию всем нам.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-farmer-green hover:bg-farmer-green-dark text-white"
              >
                Присоединиться к движению
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Icon name="Sprout" size={28} className="text-farmer-green" />
            <h3 className="text-2xl font-bold">ФАРМЕР</h3>
          </div>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Где настоящее побеждает суету. Присоединяйся к тем, кто выбирает жизнь.
          </p>
          <div className="flex justify-center gap-6 mb-6">
            <button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition-colors">
              О нас
            </button>
            <button onClick={() => navigate('/faq')} className="text-gray-400 hover:text-white transition-colors">
              FAQ
            </button>
            <button onClick={() => navigate('/contacts')} className="text-gray-400 hover:text-white transition-colors">
              Контакты
            </button>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 Фармер. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;