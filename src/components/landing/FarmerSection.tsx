import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import RegionSelector from './RegionSelector';

interface FarmerSectionProps {
  showCustomRegion: boolean;
  onRegionChange: (show: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FarmerSection({ showCustomRegion, onRegionChange, onSubmit }: FarmerSectionProps) {
  return (
    <section id="farmers" className="py-20 px-4 bg-gradient-to-br from-[#F5E6A8] to-[#E8F5E9]">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="order-2 md:order-1">
            <img
              src="https://cdn.poehali.dev/projects/80552da2-4ca1-4213-94e1-8d74d09e40e7/files/186e1396-25bc-4af3-8a63-21ee8044513c.jpg"
              alt="Фермер с планшетом"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold mb-6 text-[#4CAF50]">
              <Icon name="Sprout" className="inline mr-3 text-[#66BB6A]" size={36} />
              Фермерам
            </h2>
            <h3 className="text-2xl font-semibold mb-4 text-[#5A9FB8]">
              Получи деньги и данные для роста
            </h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-[#0099CC] mr-2">✓</span>
                <span className="text-[#5A9FB8]">Диагностика фермы для входа в систему</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0099CC] mr-2">✓</span>
                <span className="text-[#5A9FB8]">Подписка на аналитику для управления</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0099CC] mr-2">✓</span>
                <span className="text-[#5A9FB8]">Комиссия 5-10% для фермеров с высоким рейтингом</span>
              </li>
            </ul>

            <Card className="p-6 bg-white/80 shadow-lg border-[#A8D5A5]">
              <h4 className="text-xl font-semibold mb-4 text-[#4CAF50]">Расскажи, актуально ли для тебя?</h4>
              <form onSubmit={onSubmit} className="space-y-4">
                <Input name="name" placeholder="Ваше имя" required className="bg-white" />
                <Input name="email" type="email" placeholder="Email" required className="bg-white" />
                <Input name="phone" type="tel" placeholder="Телефон" className="bg-white" />
                <Input name="company_name" placeholder="Название фермы" className="bg-white" />
                <select 
                  name="farm_type" 
                  className="w-full px-3 py-2 border border-[#A8D5A5] rounded-md bg-white"
                  required
                >
                  <option value="">Направление фермы</option>
                  <option value="Животноводство">Животноводство</option>
                  <option value="Растениеводство">Растениеводство</option>
                  <option value="Смешанное">Смешанное (и то, и другое)</option>
                </select>
                <RegionSelector 
                  name="region" 
                  borderColor="border-[#A8D5A5]"
                  showCustom={showCustomRegion}
                  onRegionChange={onRegionChange}
                />
                <Button type="submit" className="w-full bg-[#66BB6A] hover:bg-[#4CAF50]">
                  Отправить заявку
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
