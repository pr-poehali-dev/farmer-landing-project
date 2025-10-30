import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

const HeroSection = ({ scrollToSection }: HeroSectionProps) => {
  return (
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
  );
};

export default HeroSection;
