import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function AboutSection() {
  return (
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
  );
}
