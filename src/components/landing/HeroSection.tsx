import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
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
                className="bg-[#0099CC] hover:bg-[#007799] text-white px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-base sm:text-lg w-full sm:w-auto"
              >
                Узнать больше
              </Button>
              <Button
                size="lg"
                asChild
                className="bg-[#4DB8E8] hover:bg-[#3AA8D8] text-white px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-base sm:text-lg w-full sm:w-auto"
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
  );
}