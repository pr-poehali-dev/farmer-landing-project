import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Спасибо! Мы свяжемся с вами');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Icon name="Sprout" className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold text-gradient">Фармер</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('founder')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Автор
              </button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                О проекте
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Контакт
              </button>
              <Button asChild className="rounded-full shadow-glow">
                <a href="https://planeta.ru/campaigns/235852" target="_blank" rel="noopener noreferrer">
                  Поддержать
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200">
                  🌱 Агроинвестиции 2025
                </Badge>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  Инвестируй в <span className="text-gradient">фермы</span> будущего
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Соединяем фермеров, инвесторов и поставщиков через умную платформу с аналитикой и страховкой
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => scrollToSection('about')} className="rounded-full shadow-soft px-8">
                  Узнать больше
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full">
                  <a href="https://t.me/ilyukhina_ferma" target="_blank" rel="noopener noreferrer">
                    <Icon name="Send" size={18} className="mr-2" />
                    Telegram
                  </a>
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Активных ферм</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">₽15 млрд</div>
                  <div className="text-sm text-gray-600">Целевой рынок</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">19%+</div>
                  <div className="text-sm text-gray-600">Доходность</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-[3rem] blur-3xl"></div>
              <img
                src="https://cdn.poehali.dev/files/e2d42910-470f-4203-ab0b-cfc4d4df832a.png"
                alt="Фермер"
                className="relative w-full h-auto animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="founder" className="py-24 px-6 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
              👨‍🌾 Основатель
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Илья Краснопеев</h2>
            <p className="text-xl text-gray-600">Создатель «Илюхиной фермы» и КФХ «Там, где рассвет»</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 shadow-soft rounded-3xl border-0 bg-white">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Video" className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Сериал «Илюхина ферма»</h3>
                    <p className="text-gray-600">Документальный проект о настоящей жизни фермера — от рассвета до заката, от радостей до трудностей</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Tractor" className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">КФХ «Там, где рассвет»</h3>
                    <p className="text-gray-600">Хозяйство, где рождаются истории о труде, природе и искренней любви к земле</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Target" className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Миссия проекта</h3>
                    <p className="text-gray-600">Сделать сельское хозяйство доступным для инвестиций и показать красоту фермерского труда</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-8 shadow-soft rounded-3xl border-0 glass-dark text-white">
                <blockquote className="text-lg leading-relaxed mb-6">
                  "Я не просто предприниматель — я живу фермерством. Каждый день на моей ферме — это история труда, заботы о животных и природе. Моя цель — показать людям, что агробизнес может быть современным, прозрачным и доходным."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={32} />
                  </div>
                  <div>
                    <div className="font-semibold">Илья Краснопеев</div>
                    <div className="text-sm text-white/80">Основатель Фармер</div>
                  </div>
                </div>
              </Card>

              <Button asChild size="lg" className="w-full rounded-2xl shadow-glow" variant="default">
                <a href="https://t.me/ilyukhina_ferma" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <Icon name="Send" size={20} />
                  Telegram-канал «Илюхина ферма»
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="w-full rounded-2xl">
                <a href="https://planeta.ru/campaigns/235852" target="_blank" rel="noopener noreferrer">
                  Поддержать на Planeta.ru
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
              💡 Возможности
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Три стороны — одна экосистема</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Платформа объединяет фермеров, инвесторов и поставщиков в единую прозрачную систему
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 shadow-soft rounded-3xl border-0 hover:shadow-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon name="Tractor" className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Фермерам</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span>Диагностика фермы для входа</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span>Аналитика для управления</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span>Комиссия 5-10% для высокого рейтинга</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 shadow-soft rounded-3xl border-0 hover:shadow-glow transition-all duration-300 group bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-soft">
                <Icon name="TrendingUp" className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Инвесторам</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span>Доходность более 19% годовых</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span>Натуральные продукты (мёд, мясо)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span>Патронаж животных с видео</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 shadow-soft rounded-3xl border-0 hover:shadow-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon name="Store" className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Продавцам</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span>Аналитика рынка и потребностей</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span>Прямые продажи через платформу</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span>Баннеры и таргетированная реклама</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="p-8 shadow-soft rounded-3xl border-0 text-center">
              <Icon name="Shield" className="text-green-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold mb-2">Страховка сделок</h4>
              <p className="text-gray-600">Все инвестиции защищены. Ваши средства в безопасности</p>
            </Card>

            <Card className="p-8 shadow-soft rounded-3xl border-0 text-center">
              <Icon name="BarChart3" className="text-green-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold mb-2">Прозрачная аналитика</h4>
              <p className="text-gray-600">Данные и прогнозы для эффективного управления</p>
            </Card>

            <Card className="p-8 shadow-soft rounded-3xl border-0 text-center">
              <Icon name="Users" className="text-green-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold mb-2">Взаимная выгода</h4>
              <p className="text-gray-600">Три стороны находят пользу в экосистеме</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
              ✉️ Обратная связь
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Расскажите о своих планах</h2>
            <p className="text-xl text-gray-600">Мы свяжемся с вами и обсудим возможности сотрудничества</p>
          </div>

          <Card className="p-10 shadow-soft rounded-3xl border-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя</label>
                  <Input required className="rounded-xl border-gray-200" placeholder="Иван Иванов" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" required className="rounded-xl border-gray-200" placeholder="ivan@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Я...</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200" required>
                  <option value="">Выберите...</option>
                  <option>Фермер</option>
                  <option>Инвестор</option>
                  <option>Продавец агротоваров</option>
                  <option>Просто интересуюсь</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Сообщение</label>
                <Textarea className="rounded-xl border-gray-200 min-h-32" placeholder="Расскажите о ваших целях и интересах..." />
              </div>

              <Button type="submit" size="lg" className="w-full rounded-xl shadow-glow">
                Отправить заявку
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Icon name="Sprout" className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold">Фармер</span>
              </div>
              <p className="text-gray-400 text-sm">Платформа для инвестиций в реальные фермы</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Проект</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => scrollToSection('founder')} className="hover:text-white transition-colors">Об авторе</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">О платформе</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Контакты</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ссылки</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://t.me/ilyukhina_ferma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                    <Icon name="Send" size={14} />
                    Telegram-канал
                  </a>
                </li>
                <li>
                  <a href="https://planeta.ru/campaigns/235852" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Planeta.ru
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={14} />
                  <span>info@farmer.ru</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 Фармер. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
