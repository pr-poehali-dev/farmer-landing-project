import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    toast.success('Спасибо! Мы свяжемся с вами в ближайшее время');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl">🐝</div>
              <h1 className="text-2xl font-bold text-green-700">Фармер</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('farmers')}
                className="text-sm font-medium hover:text-green-600 transition-colors"
              >
                Для фермеров
              </button>
              <button
                onClick={() => scrollToSection('investors')}
                className="text-sm font-medium hover:text-green-600 transition-colors"
              >
                Для инвесторов
              </button>
              <button
                onClick={() => scrollToSection('sellers')}
                className="text-sm font-medium hover:text-green-600 transition-colors"
              >
                Для продавцов
              </button>
              <button
                onClick={() => scrollToSection('survey')}
                className="text-sm font-medium hover:text-green-600 transition-colors"
              >
                Опрос
              </button>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('https://cdn.poehali.dev/projects/80552da2-4ca1-4213-94e1-8d74d09e40e7/files/be4a3b79-aa89-43a9-afe9-876b4ad0af91.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto relative z-10 text-center text-white">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Инвестируй в фермы<br />просто и выгодно!
          </h2>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Расскажи, нужна ли тебе такая платформа?<br />Оставь контакты и пройди опрос
          </p>
          <p className="text-lg mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Соединяем фермеров, инвесторов и продавцов для роста агробизнеса.<br />
            С аналитикой, патронажем и страховкой!
          </p>
          <Button
            size="lg"
            onClick={() => scrollToSection('about')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            Узнать больше
          </Button>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-green-800">О проекте "Фармер"</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              "Фармер" — приложение для инвестиций в реальные фермы. Фермеры получают деньги без кредитов,
              инвесторы — доход или продукты, продавцы — клиентов. Все сделки застрахованы!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-green-100">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="Shield" className="text-green-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-800">Надёжный щит</h3>
              <p className="text-gray-600">Все сделки застрахованы. Ваши инвестиции под защитой</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-green-100">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Icon name="TrendingUp" className="text-yellow-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-800">Аналитика для роста</h3>
              <p className="text-gray-600">Данные и прогнозы для эффективного управления фермой</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-green-100">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="Users" className="text-green-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-800">Три стороны в выигрыше</h3>
              <p className="text-gray-600">Фермеры, инвесторы и продавцы находят взаимную выгоду</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="farmers" className="py-20 px-4 bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <img
                src="https://cdn.poehali.dev/projects/80552da2-4ca1-4213-94e1-8d74d09e40e7/files/186e1396-25bc-4af3-8a63-21ee8044513c.jpg"
                alt="Фермер с планшетом"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6 text-green-800">
                <Icon name="Sprout" className="inline mr-3 text-green-600" size={36} />
                Фермерам
              </h2>
              <h3 className="text-2xl font-semibold mb-4 text-green-700">
                Получи деньги и данные для роста
              </h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Диагностика фермы для входа в систему</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Подписка на аналитику для управления</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Комиссия 5-10% для фермеров с высоким рейтингом</span>
                </li>
              </ul>

              <Card className="p-6 bg-white shadow-lg">
                <h4 className="text-xl font-semibold mb-4 text-green-800">Расскажи, актуально ли для тебя?</h4>
                <form onSubmit={(e) => handleSubmit(e, 'farmer')} className="space-y-4">
                  <Input placeholder="Ваше имя" required />
                  <Input type="email" placeholder="Email" required />
                  <Input type="tel" placeholder="Телефон" required />
                  <Input placeholder="Название фермы" />
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Отправить заявку
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="investors" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-green-800">
                <Icon name="TrendingUp" className="inline mr-3 text-yellow-600" size={36} />
                Инвесторам
              </h2>
              <h3 className="text-2xl font-semibold mb-4 text-green-700">
                Вложи в природу и получи пользу
              </h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl font-bold text-green-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Финансовый доход</h4>
                    <p className="text-gray-600">Доходность более 19% годовых</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl font-bold text-yellow-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Натуральные ресурсы</h4>
                    <p className="text-gray-600">Получайте мёд, мясо и другие продукты</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Патронаж животных</h4>
                    <p className="text-gray-600">Видео с фермы и эмоциональная связь</p>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-yellow-50 shadow-lg">
                <h4 className="text-xl font-semibold mb-4 text-green-800">Интересно? Оставь контакты!</h4>
                <form onSubmit={(e) => handleSubmit(e, 'investor')} className="space-y-4">
                  <Input placeholder="Ваше имя" required />
                  <Input type="email" placeholder="Email" required />
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Интересует финансовый доход</option>
                    <option>Интересуют натуральные продукты</option>
                    <option>Интересует патронаж животных</option>
                  </select>
                  <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-green-900">
                    Стать инвестором
                  </Button>
                </form>
              </Card>
            </div>
            <div>
              <img
                src="https://cdn.poehali.dev/projects/80552da2-4ca1-4213-94e1-8d74d09e40e7/files/e62bca31-f679-406d-93db-f050477bd3fa.jpg"
                alt="Инвесторы"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="sellers" className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-green-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <Icon name="Package" className="text-yellow-600 mb-4" size={48} />
                <h4 className="text-2xl font-bold mb-4 text-green-800">Продукты для продавцов:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Icon name="BarChart" className="text-green-600 mr-2 flex-shrink-0" size={20} />
                    <span>Доступ к аналитике рынка и потребностям ферм</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="ShoppingCart" className="text-green-600 mr-2 flex-shrink-0" size={20} />
                    <span>Прямые продажи через платформу с комиссией</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Megaphone" className="text-green-600 mr-2 flex-shrink-0" size={20} />
                    <span>Размещение баннеров и рекламы</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6 text-green-800">
                <Icon name="Store" className="inline mr-3 text-yellow-600" size={36} />
                Продавцам
              </h2>
              <h3 className="text-2xl font-semibold mb-6 text-green-700">
                Найди клиентов среди ферм
              </h3>

              <Card className="p-6 bg-white shadow-lg">
                <h4 className="text-xl font-semibold mb-4 text-green-800">
                  Полезно для бизнеса? Поделись мнением!
                </h4>
                <form onSubmit={(e) => handleSubmit(e, 'seller')} className="space-y-4">
                  <Input placeholder="Название компании" required />
                  <Input type="email" placeholder="Email" required />
                  <Input type="tel" placeholder="Телефон" />
                  <Textarea placeholder="Что вы продаёте?" rows={3} />
                  <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-green-900">
                    Стать партнёром
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="survey" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-green-800">
              Пройди опрос: Нужна ли такая платформа?
            </h2>
            <p className="text-lg text-gray-700">
              Твой отзыв поможет улучшить "Фармер"! После — получи PDF с советами по инвестициям.
            </p>
          </div>

          <Card className="p-8 shadow-xl bg-gradient-to-br from-green-50 to-yellow-50">
            <div className="text-center mb-6">
              <Icon name="ClipboardList" className="inline text-green-600 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Опрос для всех пользователей</h3>
              <p className="text-gray-600">Ответьте на несколько вопросов, чтобы помочь нам улучшить платформу</p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, 'survey')} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-green-800">Кто вы?</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="">Выберите...</option>
                  <option>Фермер</option>
                  <option>Инвестор</option>
                  <option>Продавец</option>
                  <option>Просто интересуюсь</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-green-800">
                  Насколько актуальна для вас такая платформа? (от 1 до 10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full"
                  required
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>1 - Не актуально</span>
                  <span>10 - Очень актуально</span>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-green-800">Ваши предложения и идеи</label>
                <Textarea
                  placeholder="Поделитесь своими мыслями о платформе..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-green-800">Контакт для связи</label>
                <Input type="email" placeholder="Ваш email" required />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
                Отправить опрос
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Почему мы?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon name="Shield" className="text-green-800" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Страховка как волшебный сад</h3>
                    <p className="text-green-50">Все инвестиции защищены. Ваши средства в безопасности</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon name="Award" className="text-green-800" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Опыт основателя</h3>
                    <p className="text-green-50">Илья Краснопеев, владелец фермы "Там где рассвет"</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon name="Target" className="text-green-800" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Большой рынок</h3>
                    <p className="text-green-50">Рынок 1 трлн руб., планируем захватить 10-15 млрд</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
                <h3 className="text-2xl font-bold mb-4">Присоединяйся к будущему сельского хозяйства</h3>
                <p className="text-green-50 mb-6">
                  Мы создаём экосистему, где каждый находит свою выгоду. Фермеры растут,
                  инвесторы получают доход, продавцы находят клиентов.
                </p>
                <Button
                  onClick={() => scrollToSection('survey')}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-green-900 py-6 text-lg"
                >
                  Пройти опрос сейчас
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-green-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🐝</div>
                <h3 className="text-xl font-bold">Фармер</h3>
              </div>
              <p className="text-green-200">
                Платформа для инвестиций в реальные фермы
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Для пользователей</h4>
              <ul className="space-y-2 text-green-200">
                <li><button onClick={() => scrollToSection('farmers')} className="hover:text-white">Фермерам</button></li>
                <li><button onClick={() => scrollToSection('investors')} className="hover:text-white">Инвесторам</button></li>
                <li><button onClick={() => scrollToSection('sellers')} className="hover:text-white">Продавцам</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Информация</h4>
              <ul className="space-y-2 text-green-200">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white">О проекте</button></li>
                <li><button onClick={() => scrollToSection('survey')} className="hover:text-white">Опрос</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-green-200">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>info@farmer.ru</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} />
                  <span>@farmer_platform</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-800 pt-8">
            <div className="text-center">
              <p className="text-green-200 mb-4">
                Оставь email для получения обновлений о запуске платформы
              </p>
              <form onSubmit={(e) => handleSubmit(e, 'newsletter')} className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Ваш email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-green-300"
                  required
                />
                <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-green-900">
                  Подписаться
                </Button>
              </form>
            </div>
          </div>

          <div className="text-center mt-8 text-green-300 text-sm">
            <p>© 2024 Фармер. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
