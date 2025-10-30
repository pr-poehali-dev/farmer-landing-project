import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [showCustomRegion, setShowCustomRegion] = React.useState<{farmer?: boolean, investor?: boolean, seller?: boolean}>({});

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {
      type,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company_name: formData.get('company_name'),
      interest_type: formData.get('interest_type'),
      message: formData.get('message'),
      rating: formData.get('rating'),
      suggestions: formData.get('suggestions'),
      region: formData.get('region'),
      custom_region: formData.get('custom_region')
    };

    try {
      const response = await fetch('https://functions.poehali.dev/095ae814-3cbd-4db4-98e5-255517829146', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      toast.success('Спасибо! Мы свяжемся с вами в ближайшее время');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Не удалось отправить заявку. Попробуйте позже');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6A8]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5E6A8]/95 backdrop-blur-sm border-b border-[#E5D68B] shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[#0099CC] tracking-wide" style={{ fontFamily: 'serif' }}>ФАРМЕР</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('farmers')}
                className="text-sm font-medium text-[#0099CC] hover:text-[#007799] transition-colors"
              >
                Для фермеров
              </button>
              <button
                onClick={() => scrollToSection('investors')}
                className="text-sm font-medium text-[#0099CC] hover:text-[#007799] transition-colors"
              >
                Для инвесторов
              </button>
              <button
                onClick={() => scrollToSection('sellers')}
                className="text-sm font-medium text-[#0099CC] hover:text-[#007799] transition-colors"
              >
                Для продавцов
              </button>
              <a
                href="https://planeta.ru/campaigns/235852"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0099CC] text-white rounded-lg hover:bg-[#007799] transition-colors font-medium"
              >
                Поддержать на Planeta.ru
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-[#F5E6A8]">
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1 text-left">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-[#0099CC] animate-fade-in" style={{ fontFamily: 'serif' }}>
                Инвестируй в фермы<br />просто и выгодно!
              </h2>

              <p className="text-lg mb-8 text-[#5A9FB8] animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Соединяем фермеров, инвесторов и продавцов для роста агробизнеса. С аналитикой, патронажем и страховкой!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Button
                  size="lg"
                  onClick={() => scrollToSection('about')}
                  className="bg-[#0099CC] hover:bg-[#007799] text-white px-8 py-6 text-lg"
                >
                  Узнать больше
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="bg-[#4DB8E8] hover:bg-[#3AA8D8] text-white px-8 py-6 text-lg"
                >
                  <a href="https://planeta.ru/campaigns/235852" target="_blank" rel="noopener noreferrer">
                    Поддержать проект
                  </a>
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <img
                src="https://cdn.poehali.dev/files/e2d42910-470f-4203-ab0b-cfc4d4df832a.png"
                alt="Фермер"
                className="w-full h-auto max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-gradient-to-b from-[#E8F5E9] to-[#F5E6A8]">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-[#0099CC]">О проекте "Фармер"</h2>
            <p className="text-lg text-[#5A9FB8] leading-relaxed">
              "Фармер" — приложение для инвестиций в реальные фермы. Фермеры получают деньги без кредитов,
              инвесторы — доход или продукты, продавцы — клиентов. Все сделки застрахованы!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white/60 border-[#E5D68B]">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#C8E6C9] rounded-full flex items-center justify-center">
                  <Icon name="Shield" className="text-[#4CAF50]" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#4CAF50]">Надёжный щит</h3>
              <p className="text-[#5A9FB8]">Все сделки застрахованы. Ваши инвестиции под защитой</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white/70 border-[#A8D5A5]">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#FFF3CC] rounded-full flex items-center justify-center">
                  <Icon name="TrendingUp" className="text-[#FFAA00]" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0099CC]">Аналитика для роста</h3>
              <p className="text-[#5A9FB8]">Данные и прогнозы для эффективного управления фермой</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white/70 border-[#A8D5A5]">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#C8E6C9] rounded-full flex items-center justify-center">
                  <Icon name="Users" className="text-[#4CAF50]" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#4CAF50]">Три стороны в выигрыше</h3>
              <p className="text-[#5A9FB8]">Фермеры, инвесторы и продавцы находят взаимную выгоду</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="farmers" className="py-20 px-4 bg-gradient-to-br from-[#F5E6A8] to-[#E8F5E9]">
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
              <h2 className="text-4xl font-bold mb-6 text-[#4CAF50]">
                <Icon name="Sprout" className="inline mr-3 text-[#66BB6A]" size={36} />
                Фермерам
              </h2>
              <h3 className="text-2xl font-semibold mb-4 text-[#5A9FB8]">
                Получи деньги и данные для роста
              </h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-[#0099CC] mr-2">✓</span>
                  <span className="text-[#5A9FB8]">Диагностика фермы для входа в систему</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0099CC] mr-2">✓</span>
                  <span className="text-[#5A9FB8]">Подписка на аналитику для управления</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0099CC] mr-2">✓</span>
                  <span className="text-[#5A9FB8]">Комиссия 5-10% для фермеров с высоким рейтингом</span>
                </li>
              </ul>

              <Card className="p-6 bg-white/80 shadow-lg border-[#A8D5A5]">
                <h4 className="text-xl font-semibold mb-4 text-[#4CAF50]">Расскажи, актуально ли для тебя?</h4>
                <form onSubmit={(e) => handleSubmit(e, 'farmer')} className="space-y-4">
                  <Input name="name" placeholder="Ваше имя" required className="bg-white" />
                  <Input name="email" type="email" placeholder="Email" required className="bg-white" />
                  <Input name="phone" type="tel" placeholder="Телефон" className="bg-white" />
                  <Input name="company_name" placeholder="Название фермы" className="bg-white" />
                  <select 
                    name="region" 
                    className="w-full px-3 py-2 border border-[#A8D5A5] rounded-md bg-white"
                    onChange={(e) => setShowCustomRegion(prev => ({...prev, farmer: e.target.value === 'Другой регион'}))}
                  >
                    <option value="">Выберите регион</option>
                    <option>Республика Бурятия</option>
                    <option>Москва</option>
                    <option>Санкт-Петербург</option>
                    <option>Московская область</option>
                    <option>Ленинградская область</option>
                    <option>Краснодарский край</option>
                    <option>Ростовская область</option>
                    <option>Свердловская область</option>
                    <option>Новосибирская область</option>
                    <option>Татарстан</option>
                    <option>Челябинская область</option>
                    <option>Башкортостан</option>
                    <option>Нижегородская область</option>
                    <option>Самарская область</option>
                    <option>Омская область</option>
                    <option>Красноярский край</option>
                    <option>Воронежская область</option>
                    <option>Пермский край</option>
                    <option>Волгоградская область</option>
                    <option>Другой регион</option>
                  </select>
                  {showCustomRegion.farmer && (
                    <Input name="custom_region" placeholder="Введите ваш регион" required className="bg-white" />
                  )}
                  <Button type="submit" className="w-full bg-[#66BB6A] hover:bg-[#4CAF50]">
                    Отправить заявку
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="investors" className="py-20 px-4 bg-gradient-to-bl from-[#FAF0C0] to-[#E8F5E9]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-[#0099CC]">
                <Icon name="TrendingUp" className="inline mr-3 text-[#FFAA00]" size={36} />
                Инвесторам
              </h2>
              <h3 className="text-2xl font-semibold mb-4 text-[#5A9FB8]">
                Вложи в природу и получи пользу
              </h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#E5F5FA] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl font-bold text-[#4CAF50]">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1 text-[#4CAF50]">Финансовый доход</h4>
                    <p className="text-[#5A9FB8]">Доходность более 19% годовых</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#FFF3CC] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl font-bold text-[#FFAA00]">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1 text-[#0099CC]">Натуральные ресурсы</h4>
                    <p className="text-[#5A9FB8]">Получайте мёд, мясо и другие продукты</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#C8E6C9] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl font-bold text-[#4CAF50]">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1 text-[#4CAF50]">Патронаж животных</h4>
                    <p className="text-[#5A9FB8]">Видео с фермы и эмоциональная связь</p>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-white/80 shadow-lg border-[#E5D68B]">
                <h4 className="text-xl font-semibold mb-4 text-[#0099CC]">Интересно? Оставь контакты!</h4>
                <form onSubmit={(e) => handleSubmit(e, 'investor')} className="space-y-4">
                  <Input name="name" placeholder="Ваше имя" required className="bg-white" />
                  <Input name="email" type="email" placeholder="Email" required className="bg-white" />
                  <select 
                    name="region" 
                    className="w-full px-3 py-2 border border-[#E5D68B] rounded-md bg-white"
                    onChange={(e) => setShowCustomRegion(prev => ({...prev, investor: e.target.value === 'Другой регион'}))}
                  >
                    <option value="">Выберите регион</option>
                    <option>Республика Бурятия</option>
                    <option>Москва</option>
                    <option>Санкт-Петербург</option>
                    <option>Московская область</option>
                    <option>Ленинградская область</option>
                    <option>Краснодарский край</option>
                    <option>Ростовская область</option>
                    <option>Свердловская область</option>
                    <option>Новосибирская область</option>
                    <option>Татарстан</option>
                    <option>Челябинская область</option>
                    <option>Башкортостан</option>
                    <option>Нижегородская область</option>
                    <option>Самарская область</option>
                    <option>Омская область</option>
                    <option>Красноярский край</option>
                    <option>Воронежская область</option>
                    <option>Пермский край</option>
                    <option>Волгоградская область</option>
                    <option>Другой регион</option>
                  </select>
                  {showCustomRegion.investor && (
                    <Input name="custom_region" placeholder="Введите ваш регион" required className="bg-white" />
                  )}
                  <select name="interest_type" className="w-full px-3 py-2 border border-[#E5D68B] rounded-md bg-white">
                    <option>Интересует финансовый доход</option>
                    <option>Интересуют натуральные продукты</option>
                    <option>Интересует патронаж животных</option>
                  </select>
                  <Button type="submit" className="w-full bg-[#FFAA00] hover:bg-[#FF9900] text-white">
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

      <section id="sellers" className="py-20 px-4 bg-gradient-to-tr from-[#E8F5E9] to-[#FAF0C0]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <div className="bg-white/80 rounded-lg shadow-xl p-8 border border-[#A8D5A5]">
                <Icon name="Package" className="text-[#66BB6A] mb-4" size={48} />
                <h4 className="text-2xl font-bold mb-4 text-[#4CAF50]">Продукты для продавцов:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Icon name="BarChart" className="text-[#66BB6A] mr-2 flex-shrink-0" size={20} />
                    <span className="text-[#5A9FB8]">Доступ к аналитике рынка и потребностям ферм</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="ShoppingCart" className="text-[#66BB6A] mr-2 flex-shrink-0" size={20} />
                    <span className="text-[#5A9FB8]">Прямые продажи через платформу с комиссией</span>
                  </li>
                  <li className="flex items-start">
                    <Icon name="Megaphone" className="text-[#66BB6A] mr-2 flex-shrink-0" size={20} />
                    <span className="text-[#5A9FB8]">Размещение баннеров и рекламы</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6 text-[#0099CC]">
                <Icon name="Store" className="inline mr-3 text-[#FFAA00]" size={36} />
                Продавцам
              </h2>
              <h3 className="text-2xl font-semibold mb-6 text-[#5A9FB8]">
                Найди клиентов среди ферм
              </h3>

              <Card className="p-6 bg-white/80 shadow-lg border-[#E5D68B]">
                <h4 className="text-xl font-semibold mb-4 text-[#0099CC]">
                  Полезно для бизнеса? Поделись мнением!
                </h4>
                <form onSubmit={(e) => handleSubmit(e, 'seller')} className="space-y-4">
                  <Input name="company_name" placeholder="Название компании" required className="bg-white" />
                  <Input name="email" type="email" placeholder="Email" required className="bg-white" />
                  <Input name="phone" type="tel" placeholder="Телефон" className="bg-white" />
                  <select 
                    name="region" 
                    className="w-full px-3 py-2 border border-[#E5D68B] rounded-md bg-white"
                    onChange={(e) => setShowCustomRegion(prev => ({...prev, seller: e.target.value === 'Другой регион'}))}
                  >
                    <option value="">Выберите регион</option>
                    <option>Республика Бурятия</option>
                    <option>Москва</option>
                    <option>Санкт-Петербург</option>
                    <option>Московская область</option>
                    <option>Ленинградская область</option>
                    <option>Краснодарский край</option>
                    <option>Ростовская область</option>
                    <option>Свердловская область</option>
                    <option>Новосибирская область</option>
                    <option>Татарстан</option>
                    <option>Челябинская область</option>
                    <option>Башкортостан</option>
                    <option>Нижегородская область</option>
                    <option>Самарская область</option>
                    <option>Омская область</option>
                    <option>Красноярский край</option>
                    <option>Воронежская область</option>
                    <option>Пермский край</option>
                    <option>Волгоградская область</option>
                    <option>Другой регион</option>
                  </select>
                  {showCustomRegion.seller && (
                    <Input name="custom_region" placeholder="Введите ваш регион" required className="bg-white" />
                  )}
                  <Textarea name="message" placeholder="Что вы продаёте?" rows={3} className="bg-white" />
                  <Button type="submit" className="w-full bg-[#FFAA00] hover:bg-[#FF9900] text-white">
                    Стать партнёром
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="survey" className="py-20 px-4 bg-[#FAF0C0]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-[#0099CC]">
              Пройди опрос: Нужна ли такая платформа?
            </h2>
            <p className="text-lg text-[#5A9FB8]">
              Твой отзыв поможет улучшить "Фармер"! После — получи PDF с советами по инвестициям.
            </p>
          </div>

          <Card className="p-8 shadow-xl bg-white/80 border-[#E5D68B]">
            <div className="text-center mb-6">
              <Icon name="ClipboardList" className="inline text-[#0099CC] mb-4" size={48} />
              <h3 className="text-2xl font-bold text-[#0099CC] mb-2">Опрос для всех пользователей</h3>
              <p className="text-[#5A9FB8]">Ответьте на несколько вопросов, чтобы помочь нам улучшить платформу</p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, 'survey')} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-[#0099CC]">Кто вы?</label>
                <select name="interest_type" className="w-full px-3 py-2 border border-[#E5D68B] rounded-md bg-white" required>
                  <option value="">Выберите...</option>
                  <option>Фермер</option>
                  <option>Инвестор</option>
                  <option>Продавец</option>
                  <option>Просто интересуюсь</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0099CC]">
                  Насколько актуальна для вас такая платформа? (от 1 до 10)
                </label>
                <input
                  name="rating"
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  className="w-full"
                  required
                />
                <div className="flex justify-between text-sm text-[#5A9FB8] mt-1">
                  <span>1 - Не актуально</span>
                  <span>10 - Очень актуально</span>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0099CC]">Ваши предложения и идеи</label>
                <Textarea
                  name="suggestions"
                  placeholder="Поделитесь своими мыслями о платформе..."
                  rows={4}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0099CC]">Контакт для связи</label>
                <Input name="email" type="email" placeholder="Ваш email" required className="bg-white" />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0099CC]">Регион</label>
                <select name="region" className="w-full px-3 py-2 border border-[#E5D68B] rounded-md bg-white">
                  <option value="">Выберите регион</option>
                  <option>Москва</option>
                  <option>Санкт-Петербург</option>
                  <option>Московская область</option>
                  <option>Ленинградская область</option>
                  <option>Краснодарский край</option>
                  <option>Ростовская область</option>
                  <option>Свердловская область</option>
                  <option>Новосибирская область</option>
                  <option>Татарстан</option>
                  <option>Челябинская область</option>
                  <option>Башкортостан</option>
                  <option>Нижегородская область</option>
                  <option>Самарская область</option>
                  <option>Омская область</option>
                  <option>Красноярский край</option>
                  <option>Воронежская область</option>
                  <option>Пермский край</option>
                  <option>Волгоградская область</option>
                  <option>Другой регион</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-[#0099CC] hover:bg-[#007799] text-white py-6 text-lg">
                Отправить опрос
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#0099CC] text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Почему "Фармер"?</h2>
            <p className="text-lg text-[#E5F5FA] max-w-4xl mx-auto leading-relaxed">
              Мы — это мост между людьми и природой, где инвестиции в фермы становятся простыми, безопасными и полезными для всех. 
              Наша миссия — сделать агробизнес доступным: фермерам — деньги без бюрократии, инвесторам — доход и связь с реальными активами, 
              продавцам — точные клиенты.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#F5E6A8] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon name="Shield" className="text-[#0099CC]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Надёжная защита</h3>
                    <p className="text-[#E5F5FA]">Все сделки застрахованы как надёжный щит от рисков с AI-аналитикой для роста</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#F5E6A8] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon name="TrendingUp" className="text-[#0099CC]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Устойчивый доход</h3>
                    <p className="text-[#E5F5FA]">Доход выше банковских вкладов (~19%), снижение расходов ферм на 20–30%</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#F5E6A8] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon name="Award" className="text-[#0099CC]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Опыт основателя</h3>
                    <p className="text-[#E5F5FA]">Илья Краснопеев — опытный сельхозпроизводитель меда, владелец туристической фермы КФХ "Там где рассвет" и автор популярного сериала "Илюхина ферма". С многолетним опытом он знает, как сделать агробизнес увлекательным и доступным.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
                <h3 className="text-2xl font-bold mb-4">Присоединяйся к будущему сельского хозяйства</h3>
                <p className="text-[#E5F5FA] mb-6">
                  Мы создаём экосистему, где каждый находит свою выгоду. Фермеры растут,
                  инвесторы получают доход, продавцы находят клиентов.
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => scrollToSection('survey')}
                    className="w-full bg-[#F5E6A8] hover:bg-[#E5D68B] text-[#0099CC] py-6 text-lg"
                  >
                    Пройти опрос сейчас
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-[#FFAA00] hover:bg-[#FF9900] text-white py-6 text-lg"
                  >
                    <a href="https://planeta.ru/campaigns/235852" target="_blank" rel="noopener noreferrer">
                      Поддержать на Planeta.ru
                    </a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#007799] text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'serif' }}>ФАРМЕР</h3>
              </div>
              <p className="text-[#B3E5F5]">
                Платформа для инвестиций в реальные фермы
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Для пользователей</h4>
              <ul className="space-y-2 text-[#B3E5F5]">
                <li><button onClick={() => scrollToSection('farmers')} className="hover:text-white">Фермерам</button></li>
                <li><button onClick={() => scrollToSection('investors')} className="hover:text-white">Инвесторам</button></li>
                <li><button onClick={() => scrollToSection('sellers')} className="hover:text-white">Продавцам</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Информация</h4>
              <ul className="space-y-2 text-[#B3E5F5]">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white">О проекте</button></li>
                <li><button onClick={() => scrollToSection('survey')} className="hover:text-white">Опрос</button></li>
                <li>
                  <a 
                    href="https://planeta.ru/campaigns/235852" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Поддержать на Planeta.ru
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-[#B3E5F5]">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <a href="mailto:iliakrasnopeev@yandex.ru" className="hover:text-white">
                    iliakrasnopeev@yandex.ru
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} />
                  <a href="https://t.me/Ilia_Krasnopeev" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    @Ilia_Krasnopeev
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#0099CC] pt-8">
            <div className="text-center">
              <p className="text-[#B3E5F5] mb-4">
                Оставь email для получения обновлений о запуске платформы
              </p>
              <form onSubmit={(e) => handleSubmit(e, 'newsletter')} className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Ваш email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-[#B3E5F5]"
                  required
                />
                <Button type="submit" className="bg-[#F5E6A8] hover:bg-[#E5D68B] text-[#0099CC]">
                  Подписаться
                </Button>
              </form>
            </div>
          </div>

          <div className="text-center mt-8 text-[#B3E5F5] text-sm">
            <p>© 2024 Фармер. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;