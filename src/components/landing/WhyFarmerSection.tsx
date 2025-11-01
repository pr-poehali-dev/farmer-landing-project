import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WhyFarmerSectionProps {
  scrollToSection: (id: string) => void;
}

export default function WhyFarmerSection({ scrollToSection }: WhyFarmerSectionProps) {
  return (
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
  );
}
