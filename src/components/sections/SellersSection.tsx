import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SellersSectionProps {
  sellerData: { name: string; email: string; company: string; budget: string };
  setSellerData: (data: { name: string; email: string; company: string; budget: string }) => void;
  handleSellerSubmit: (e: React.FormEvent) => void;
}

const SellersSection = ({ sellerData, setSellerData, handleSellerSubmit }: SellersSectionProps) => {
  return (
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
  );
};

export default SellersSection;
