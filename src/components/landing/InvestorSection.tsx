import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import RegionSelector from './RegionSelector';

interface InvestorSectionProps {
  showCustomRegion: boolean;
  onRegionChange: (show: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function InvestorSection({ showCustomRegion, onRegionChange, onSubmit }: InvestorSectionProps) {
  return (
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
              <form onSubmit={onSubmit} className="space-y-4">
                <Input name="name" placeholder="Ваше имя" required className="bg-white" />
                <Input name="email" type="email" placeholder="Email" required className="bg-white" />
                <RegionSelector 
                  name="region" 
                  borderColor="border-[#E5D68B]"
                  showCustom={showCustomRegion}
                  onRegionChange={onRegionChange}
                />
                <select name="interest_type" className="w-full px-3 py-2 border border-[#E5D68B] rounded-md bg-white">
                  <option value="">Что интересует?</option>
                  <option>Финансовый доход</option>
                  <option>Натуральные продукты</option>
                  <option>Патронаж животных</option>
                  <option>Всё вместе</option>
                </select>
                <Button type="submit" className="w-full bg-[#0099CC] hover:bg-[#007799]">
                  Хочу инвестировать
                </Button>
              </form>
            </Card>
          </div>
          <div>
            <img
              src="https://cdn.poehali.dev/projects/80552da2-4ca1-4213-94e1-8d74d09e40e7/files/02e11a02-3236-4e14-bb97-4cbd77e32e5b.jpg"
              alt="Инвестор"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
