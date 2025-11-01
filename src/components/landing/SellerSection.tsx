import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import RegionSelector from './RegionSelector';

interface SellerSectionProps {
  showCustomRegion: boolean;
  onRegionChange: (show: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SellerSection({ showCustomRegion, onRegionChange, onSubmit }: SellerSectionProps) {
  return (
    <section id="sellers" className="py-20 px-4 bg-gradient-to-tr from-[#F5E6A8] to-[#E8F5E9]">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/80 p-4 rounded-lg shadow">
                <Icon name="Package" className="text-[#FFAA00] mb-2" size={32} />
                <h4 className="font-semibold text-[#0099CC] mb-1">Аренда техники</h4>
                <ul className="text-sm text-[#5A9FB8] space-y-1">
                  <li className="flex items-start">
                    <span className="text-[#0099CC] mr-1">✓</span>
                    <span>Трактора, комбайны</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0099CC] mr-1">✓</span>
                    <span>Короткий и долгий срок</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow">
                <Icon name="Leaf" className="text-[#4CAF50] mb-2" size={32} />
                <h4 className="font-semibold text-[#0099CC] mb-1">Удобрения</h4>
                <ul className="text-sm text-[#5A9FB8] space-y-1">
                  <li className="flex items-start">
                    <span className="text-[#0099CC] mr-1">✓</span>
                    <span>Минеральные и органические</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0099CC] mr-1">✓</span>
                    <span>Оптом и в розницу</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow">
                <Icon name="Apple" className="text-[#0099CC] mb-2" size={32} />
                <h4 className="font-semibold text-[#0099CC] mb-1">Семена и саженцы</h4>
                <ul className="text-sm text-[#5A9FB8] space-y-1">
                  <li className="flex items-start">
                    <span className="text-[#0099CC] mr-1">✓</span>
                    <span>Сертифицированные</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0099CC] mr-1">✓</span>
                    <span>Разные сорта</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow">
                <Icon name="Radio" className="text-[#FFAA00] mb-2" size={32} />
                <h4 className="font-semibold text-[#0099CC] mb-1">Реклама</h4>
                <ul className="text-sm text-[#5A9FB8] space-y-1">
                  <li className="flex items-start">
                    <span className="text-[#0099CC] mr-1">✓</span>
                    <span>Размещение баннеров и рекламы</span>
                  </li>
                </ul>
              </div>
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
              <form onSubmit={onSubmit} className="space-y-4">
                <Input name="company_name" placeholder="Название компании" required className="bg-white" />
                <Input name="email" type="email" placeholder="Email" required className="bg-white" />
                <Input name="phone" type="tel" placeholder="Телефон" className="bg-white" />
                <RegionSelector 
                  name="region" 
                  borderColor="border-[#E5D68B]"
                  showCustom={showCustomRegion}
                  onRegionChange={onRegionChange}
                />
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
  );
}
