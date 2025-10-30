import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [farmerData, setFarmerData] = useState({ name: '', email: '', region: '', interest: '' });
  const [investorData, setInvestorData] = useState({ name: '', email: '', amount: '', returnType: '' });
  const [sellerData, setSellerData] = useState({ name: '', email: '', company: '', budget: '' });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Фермер:', farmerData);
    toast.success('Спасибо! Ваши данные сохранены');
    setFarmerData({ name: '', email: '', region: '', interest: '' });
  };

  const handleInvestorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Инвестор:', investorData);
    toast.success('Спасибо! Ваши данные сохранены');
    setInvestorData({ name: '', email: '', amount: '', returnType: '' });
  };

  const handleSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Продавец:', sellerData);
    toast.success('Спасибо! Ваши данные сохранены');
    setSellerData({ name: '', email: '', company: '', budget: '' });
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
              <button onClick={() => scrollToSection('farmers')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Фермерам
              </button>
              <button onClick={() => scrollToSection('investors')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Инвесторам
              </button>
              <button onClick={() => scrollToSection('sellers')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Продавцам
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
                  🌱 Тестируем идею
                </Badge>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  Нужна ли вам платформа для <span className="text-gradient">агроинвестиций</span>?
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Мы создаём платформу, которая соединит фермеров, инвесторов и поставщиков. Расскажите, актуально ли это для вас?
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => scrollToSection('farmers')} className="rounded-full shadow-soft px-8">
                  Я фермер
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('investors')} className="rounded-full px-8">
                  Я инвестор
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('sellers')} className="rounded-full px-8">
                  Я продавец
                </Button>
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

      <section id="farmers" className="py-24 px-6 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
              🚜 Для фермеров
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Фермерам: получайте инвестиции без кредитов</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Расскажите о своей ферме и узнайте, как платформа может помочь вам привлечь финансирование
            </p>
          </div>

          <Card className="p-10 shadow-soft rounded-3xl border-0 bg-white">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Что мы предлагаем:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Диагностика вашей фермы для оценки инвестиционного потенциала</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Аналитика и рекомендации для повышения эффективности</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Прямой доступ к инвесторам без банков (комиссия 5-10%)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Страховка сделок для вашей безопасности</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleFarmerSubmit} className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-2">Ваше имя *</Label>
                <Input
                  required
                  value={farmerData.name}
                  onChange={(e) => setFarmerData({ ...farmerData, name: e.target.value })}
                  className="rounded-xl border-gray-200"
                  placeholder="Иван Петров"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-2">Email *</Label>
                <Input
                  type="email"
                  required
                  value={farmerData.email}
                  onChange={(e) => setFarmerData({ ...farmerData, email: e.target.value })}
                  className="rounded-xl border-gray-200"
                  placeholder="ivan@example.com"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-2">Регион вашей фермы *</Label>
                <Input
                  required
                  value={farmerData.region}
                  onChange={(e) => setFarmerData({ ...farmerData, region: e.target.value })}
                  className="rounded-xl border-gray-200"
                  placeholder="Краснодарский край"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-3">Нужна ли вам такая платформа? *</Label>
                <RadioGroup required value={farmerData.interest} onValueChange={(val) => setFarmerData({ ...farmerData, interest: val })}>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="very-interested" id="f1" />
                    <Label htmlFor="f1" className="flex-1 cursor-pointer">Да, очень нужна! Готов попробовать</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="interested" id="f2" />
                    <Label htmlFor="f2" className="flex-1 cursor-pointer">Интересно, хочу узнать больше</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="maybe" id="f3" />
                    <Label htmlFor="f3" className="flex-1 cursor-pointer">Возможно, нужно подумать</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="not-interested" id="f4" />
                    <Label htmlFor="f4" className="flex-1 cursor-pointer">Скорее нет, не актуально</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" size="lg" className="w-full rounded-xl shadow-glow">
                Отправить ответы
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <section id="investors" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
              📈 Для инвесторов
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Инвесторам: вкладывайте в реальное производство</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Узнайте, как инвестировать в сельское хозяйство с прозрачностью и контролем
            </p>
          </div>

          <Card className="p-10 shadow-soft rounded-3xl border-0 bg-white">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Что вы получите:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Выбор формата отдачи: финансовая доходность, натуральные продукты или патронаж животных</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Прозрачная аналитика по каждой ферме</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Видео с фермы и отчёты о развитии</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Страховка ваших инвестиций</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleInvestorSubmit} className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-2">Ваше имя *</Label>
                <Input
                  required
                  value={investorData.name}
                  onChange={(e) => setInvestorData({ ...investorData, name: e.target.value })}
                  className="rounded-xl border-gray-200"
                  placeholder="Сергей Иванов"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-2">Email *</Label>
                <Input
                  type="email"
                  required
                  value={investorData.email}
                  onChange={(e) => setInvestorData({ ...investorData, email: e.target.value })}
                  className="rounded-xl border-gray-200"
                  placeholder="sergey@example.com"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-2">Примерная сумма инвестиций *</Label>
                <select
                  required
                  value={investorData.amount}
                  onChange={(e) => setInvestorData({ ...investorData, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                >
                  <option value="">Выберите...</option>
                  <option value="100k-500k">100 000 - 500 000 ₽</option>
                  <option value="500k-1m">500 000 - 1 000 000 ₽</option>
                  <option value="1m-5m">1 000 000 - 5 000 000 ₽</option>
                  <option value="5m+">Более 5 000 000 ₽</option>
                </select>
              </div>

              <div>
                <Label className="text-base font-medium mb-3">Нужна ли вам такая платформа? *</Label>
                <RadioGroup required value={investorData.returnType} onValueChange={(val) => setInvestorData({ ...investorData, returnType: val })}>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="very-interested" id="i1" />
                    <Label htmlFor="i1" className="flex-1 cursor-pointer">Да, очень нужна! Готов инвестировать</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="interested" id="i2" />
                    <Label htmlFor="i2" className="flex-1 cursor-pointer">Интересно, хочу узнать условия</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="maybe" id="i3" />
                    <Label htmlFor="i3" className="flex-1 cursor-pointer">Возможно, но есть сомнения</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="not-interested" id="i4" />
                    <Label htmlFor="i4" className="flex-1 cursor-pointer">Скорее нет, не интересно</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" size="lg" className="w-full rounded-xl shadow-glow">
                Отправить ответы
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <section id="sellers" className="py-24 px-6 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
              🏪 Для продавцов
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Продавцам: находите клиентов среди ферм</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Узнайте, как платформа поможет вам продавать агротовары напрямую фермерам
            </p>
          </div>

          <Card className="p-10 shadow-soft rounded-3xl border-0 bg-white">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Что мы предлагаем:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Доступ к аналитике: кто, что и когда покупает</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Прямые продажи через платформу с комиссией</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>Таргетированная реклама для нужных сегментов</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>База контактов активных фермеров</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSellerSubmit} className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-2">Ваше имя *</Label>
                <Input
                  required
                  value={sellerData.name}
                  onChange={(e) => setSellerData({ ...sellerData, name: e.target.value })}
                  className="rounded-xl border-gray-200"
                  placeholder="Алексей Смирнов"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-2">Email *</Label>
                <Input
                  type="email"
                  required
                  value={sellerData.email}
                  onChange={(e) => setSellerData({ ...sellerData, email: e.target.value })}
                  className="rounded-xl border-gray-200"
                  placeholder="alexey@example.com"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-2">Название компании *</Label>
                <Input
                  required
                  value={sellerData.company}
                  onChange={(e) => setSellerData({ ...sellerData, company: e.target.value })}
                  className="rounded-xl border-gray-200"
                  placeholder="ООО АгроТех"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-3">Нужна ли вам такая платформа? *</Label>
                <RadioGroup required value={sellerData.budget} onValueChange={(val) => setSellerData({ ...sellerData, budget: val })}>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="very-interested" id="s1" />
                    <Label htmlFor="s1" className="flex-1 cursor-pointer">Да, очень нужна! Готов платить за доступ</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="interested" id="s2" />
                    <Label htmlFor="s2" className="flex-1 cursor-pointer">Интересно, хочу узнать цены</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="maybe" id="s3" />
                    <Label htmlFor="s3" className="flex-1 cursor-pointer">Возможно, зависит от условий</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                    <RadioGroupItem value="not-interested" id="s4" />
                    <Label htmlFor="s4" className="flex-1 cursor-pointer">Скорее нет, не вижу пользы</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" size="lg" className="w-full rounded-xl shadow-glow">
                Отправить ответы
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
              💡 О платформе
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Как это работает</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 shadow-soft rounded-3xl border-0 text-center">
              <Icon name="Shield" className="text-green-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold mb-2">Страховка сделок</h4>
              <p className="text-gray-600">Все инвестиции защищены</p>
            </Card>

            <Card className="p-8 shadow-soft rounded-3xl border-0 text-center">
              <Icon name="BarChart3" className="text-green-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold mb-2">Прозрачная аналитика</h4>
              <p className="text-gray-600">Данные в реальном времени</p>
            </Card>

            <Card className="p-8 shadow-soft rounded-3xl border-0 text-center">
              <Icon name="Users" className="text-green-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold mb-2">Взаимная выгода</h4>
              <p className="text-gray-600">Все стороны в плюсе</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="founder" className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
              👨‍🌾 Автор проекта
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Илья Краснопеев</h2>
            <p className="text-xl text-gray-600">Создатель «Илюхиной фермы» и КФХ «Там, где рассвет»</p>
          </div>

          <Card className="p-10 shadow-soft rounded-3xl border-0">
            <div className="space-y-6 mb-8">
              <p className="text-lg text-gray-600 leading-relaxed">
                Автор и главный герой документального сериала «Илюхина ферма», где делюсь реальным опытом фермерства — от рассвета до заката, от радостей до трудностей.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Владелец КФХ «Там, где рассвет» — хозяйства, где рождаются истории о труде, природе и искренней любви к земле.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-2xl shadow-glow flex-1">
                <a href="https://t.me/ilyukhina_ferma" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <Icon name="Send" size={20} />
                  Telegram «Илюхина ферма»
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="rounded-2xl flex-1">
                <a href="https://planeta.ru/campaigns/235852" target="_blank" rel="noopener noreferrer">
                  Поддержать на Planeta.ru
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
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
              <h4 className="font-semibold mb-4">Ссылки</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://t.me/ilyukhina_ferma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                    <Icon name="Send" size={14} />
                    Telegram
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
