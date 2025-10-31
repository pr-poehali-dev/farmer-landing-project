import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <Icon name="Sprout" size={32} className="text-farmer-green" />
              <h1 className="text-2xl font-bold text-farmer-green">ФАРМЕР</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button onClick={() => navigate('/')} variant="ghost" className="text-gray-700">
                Главная
              </Button>
              <Button onClick={() => navigate('/about')} variant="ghost" className="text-farmer-green">
                О нас
              </Button>
              <Button onClick={() => navigate('/faq')} variant="ghost" className="text-gray-700">
                FAQ
              </Button>
              <Button onClick={() => navigate('/contacts')} variant="ghost" className="text-gray-700">
                Контакты
              </Button>
              <Button onClick={() => navigate('/login')} className="bg-farmer-green hover:bg-farmer-green-dark text-white">
                Войти
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">О проекте "Фармер"</h1>
            <p className="text-xl text-gray-600">Возвращаем связь с землёй и настоящим</p>
          </div>

          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-farmer-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Heart" size={24} className="text-farmer-green" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">Наша миссия</h2>
                <p className="text-gray-700 leading-relaxed">
                  В современном мире мы оторваны от природы, от земли, от настоящей еды. Города забирают нашу энергию, 
                  а искусственные продукты крадут здоровье. Фермеры — хранители живой земли — остаются без поддержки, 
                  пока инвесторы ищут смысл в своих вложениях.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>"Фармер"</strong> — это мост между теми, кто хочет вернуться к истокам, и теми, кто эти истоки сохраняет. 
                  Мы создаём платформу, где инвесторы не просто вкладывают деньги, а получают связь с живой природой, 
                  свежие продукты и участие в настоящем деле.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-farmer-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Target" size={24} className="text-farmer-orange" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">Что мы делаем</h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-farmer-green mb-2">Для инвесторов:</h3>
                    <p>Возможность вложиться в реальные фермы и получить взамен свежие продукты, долю в урожае 
                    или даже "усыновить" корову с видео-отчётами. Это не сделка — это эмоциональная связь с землёй.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-farmer-orange mb-2">Для фермеров:</h3>
                    <p>Платформа для привлечения инвестиций без банковских кредитов. Вы создаёте предложения, 
                    делитесь своими активами (например, доли в корове, урожае) и получаете поддержку тех, 
                    кто ценит настоящее.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-farmer-green mb-2">Для продавцов:</h3>
                    <p>Возможность предложить фермерам качественные товары (удобрения, технику) и стать частью 
                    движения за живую землю.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Автор проекта</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0">
                <img 
                  src="https://cdn.poehali.dev/files/b238e6c3-93b0-4dcb-8146-d2a0b1d6cfed.JPG" 
                  alt="Илья Краснопеев с медом КФХ Там где рассвет"
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-farmer-green mb-4">Илья Краснопеев</h3>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    <strong className="text-farmer-orange">Автор и главный герой</strong> агросериала <strong>"Илюхина ферма"</strong> — реалити-шоу о жизни фермера, которое показывает настоящую работу на земле без прикрас.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-farmer-green">Владелец туристической фермы</strong> КФХ "Там где рассвет" — места, где каждый может прикоснуться к настоящей фермерской жизни, увидеть производство изнутри и почувствовать связь с землёй.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-farmer-orange">Сельхозпроизводитель натурального меда</strong> под брендом <strong>"Илюхина ферма"</strong> — продукция, которая создаётся с любовью к природе и заботой о качестве.
                  </p>
                  <p className="leading-relaxed mt-4 text-gray-900 font-medium">
                    Проект "Фармер" создан с верой в то, что настоящее не должно умирать в суете городов. 
                    Каждая ферма — это источник жизни, и мы помогаем этим источникам расцвести, 
                    соединяя людей через общую ценность — живую землю.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Присоединяйся к движению</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              "Фармер" — это не просто платформа. Это движение за возвращение к настоящему, 
              где каждый вклад питает не только бизнес, но и души тех, кто устал от искусственного.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              size="lg"
              className="bg-farmer-orange hover:bg-farmer-orange-dark text-white"
            >
              Зарегистрироваться
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>

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
            <button onClick={() => navigate('/contacts')} className="text-gray-400 hover:text-white transition-colors">
              Контакты
            </button>
            <button onClick={() => navigate('/faq')} className="text-gray-400 hover:text-white transition-colors">
              FAQ
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

export default About;