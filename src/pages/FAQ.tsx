import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
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
              <Button onClick={() => navigate('/about')} variant="ghost" className="text-gray-700">
                О нас
              </Button>
              <Button onClick={() => navigate('/faq')} variant="ghost" className="text-farmer-green">
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
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h1>
            <p className="text-xl text-gray-600">Ответы на популярные вопросы о платформе "Фармер"</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-farmer-green">
                Что такое "Фармер" и как это работает?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                "Фармер" — это платформа, которая соединяет фермеров с инвесторами и продавцами агротехники. 
                Фермеры создают предложения (например, доли в корове, урожае или патронаж), инвесторы вкладывают 
                средства и получают взамен продукты или долю в доходе, а продавцы предлагают товары для фермерских хозяйств. 
                Всё это строится на эмоциональной связи с землёй и настоящими продуктами, а не на холодных финансовых сделках.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-farmer-green">
                Как фермеру создать предложение?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                После регистрации на платформе как фермер, вам нужно заполнить обязательную диагностику хозяйства 
                (количество коров, площадь полей и т.д.). Затем в личном кабинете вы можете создать предложение, 
                указав описание, цену, количество долей и тип (продукты, доход или патронаж). Инвесторы увидят 
                ваше предложение и смогут в него вложиться.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-farmer-green">
                Что получает инвестор взамен своих вложений?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                Это зависит от типа предложения:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Продукты:</strong> Вы получаете свежие фермерские продукты (мед, молоко, мясо и т.д.) 
                  в обмен на инвестицию.</li>
                  <li><strong>Доход:</strong> Вы получаете долю в прибыли от продажи урожая или животноводческой продукции.</li>
                  <li><strong>Патронаж:</strong> Вы "усыновляете" корову или участок земли, получаете видео-отчёты 
                  и участвуете в жизни фермы.</li>
                </ul>
                <p className="mt-2">
                  Главное — это не просто финансовая выгода, а эмоциональная связь с настоящим и живой природой.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-farmer-green">
                Есть ли страховка на случай неурожая или болезни животных?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                Система страхования находится в разработке. Мы планируем интегрировать опции страхования для защиты 
                инвестиций в случае форс-мажора (неурожай, болезни скота и т.д.). Пока же инвесторы делят риски с фермерами, 
                как в настоящем партнёрстве. Рекомендуем вкладываться в проверенные хозяйства и диверсифицировать портфель.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-farmer-green">
                Как платформа зарабатывает? Есть ли комиссии?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                На этапе MVP (минимально жизнеспособного продукта) платформа работает без комиссий — наша цель 
                протестировать гипотезу и собрать сообщество. В будущем мы планируем ввести небольшую комиссию 
                с успешных сделок (3-5%), а также монетизировать через подписки для продавцов и аналитику для фермеров.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-farmer-green">
                Как мне связаться с фермером напрямую?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                Сейчас прямая связь с фермерами доступна через информацию в предложениях (имя фермера отображается 
                для инвесторов). В будущих версиях мы добавим встроенный чат и систему уведомлений для удобной коммуникации 
                между участниками платформы.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-farmer-green">
                Могу ли я инвестировать в несколько ферм одновременно?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                Да! В личном кабинете инвестора вы можете инвестировать в любое количество предложений. 
                Все ваши инвестиции отображаются в разделе "Мой портфель", где вы видите детали каждой сделки 
                (сумма, дата, тип предложения, фермер).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-farmer-green">
                Что делать, если я забыл пароль?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                На странице входа есть кнопка "Забыли пароль?". Функция восстановления пароля через email будет 
                доступна в ближайшее время. Пока вы можете связаться с нами через страницу "Контакты", и мы поможем вам восстановить доступ.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 text-center bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Не нашли ответ на свой вопрос?</h2>
            <p className="text-gray-700 mb-6">
              Свяжитесь с нами, и мы с радостью поможем!
            </p>
            <Button 
              onClick={() => navigate('/contacts')} 
              className="bg-farmer-green hover:bg-farmer-green-dark text-white"
            >
              Связаться с нами
              <Icon name="Mail" size={18} className="ml-2" />
            </Button>
          </div>
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
            <button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition-colors">
              О нас
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

export default FAQ;
