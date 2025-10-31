import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Contacts = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Заполните все поля');
      return;
    }
    
    setSending(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Ошибка отправки. Попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

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
              <Button onClick={() => navigate('/faq')} variant="ghost" className="text-gray-700">
                FAQ
              </Button>
              <Button onClick={() => navigate('/contacts')} variant="ghost" className="text-farmer-green">
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h1>
            <p className="text-xl text-gray-600">Мы всегда рады ответить на ваши вопросы</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Напишите нам</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Ваше имя *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Сообщение *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Расскажите, чем мы можем помочь..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={sending}
                  className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white"
                >
                  {sending ? (
                    <>
                      <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={18} className="mr-2" />
                      Отправить сообщение
                    </>
                  )}
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-farmer-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Mail" size={24} className="text-farmer-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@farmer-platform.ru</p>
                    <p className="text-sm text-gray-500 mt-1">Ответим в течение 24 часов</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-farmer-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="MessageCircle" size={24} className="text-farmer-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Telegram</h3>
                    <p className="text-gray-600">@farmer_support</p>
                    <p className="text-sm text-gray-500 mt-1">Быстрая поддержка в мессенджере</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-farmer-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Phone" size={24} className="text-farmer-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Телефон</h3>
                    <p className="text-gray-600">+7 (999) 123-45-67</p>
                    <p className="text-sm text-gray-500 mt-1">Пн-Пт: 9:00 - 18:00 (МСК)</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5">
                <h3 className="font-semibold text-gray-900 mb-3">Сообщество</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Присоединяйтесь к нашему сообществу в Telegram, где фермеры, инвесторы и продавцы 
                  обмениваются опытом и поддерживают друг друга.
                </p>
                <Button 
                  onClick={() => window.open('https://t.me/+QgiLIa1gFRY4Y2Iy', '_blank')}
                  variant="outline" 
                  className="w-full border-farmer-green text-farmer-green hover:bg-farmer-green hover:text-white"
                >
                  <Icon name="Users" size={18} className="mr-2" />
                  Вступить в сообщество
                </Button>
              </Card>
            </div>
          </div>

          <Card className="p-8 text-center bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Хотите стать партнёром?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Мы открыты для сотрудничества с фермерскими объединениями, производителями агротехники 
              и всеми, кто разделяет нашу миссию возвращения к настоящему.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-farmer-orange hover:bg-farmer-orange-dark text-white"
            >
              Зарегистрироваться на платформе
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
            <button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition-colors">
              О нас
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

export default Contacts;
