import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface FarmersSectionProps {
  farmerData: { name: string; email: string; region: string; interest: string };
  setFarmerData: (data: { name: string; email: string; region: string; interest: string }) => void;
  handleFarmerSubmit: (e: React.FormEvent) => void;
}

const FarmersSection = ({ farmerData, setFarmerData, handleFarmerSubmit }: FarmersSectionProps) => {
  return (
    <section id="farmers" className="py-24 px-6 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
            🚜 Для фермеров
          </Badge>
          <h2 className="text-5xl font-bold mb-4">Фермерам: получайте инвестиции без кредитов</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Расскажите о своей ферме и узнайте, как платформа может помочь вам привлечь финансирование
          </p>
        </div>

        <Card className="p-10 shadow-soft rounded-3xl border-0 bg-white">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Что мы предлагаем:</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <span>Диагностика вашей фермы для оценки инвестиционного потенциала</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <span>Аналитика и рекомендации для повышения эффективности</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <span>Прямой доступ к инвесторам без банков (комиссия 5-10%)</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <span>Страховка сделок для вашей безопасности</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleFarmerSubmit} className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-2">Ваше имя *</Label>
              <Input
                required
                value={farmerData.name}
                onChange={(e) => setFarmerData({ ...farmerData, name: e.target.value })}
                className="rounded-xl border-gray-200"
                placeholder="Иван Петров"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-2">Email *</Label>
              <Input
                type="email"
                required
                value={farmerData.email}
                onChange={(e) => setFarmerData({ ...farmerData, email: e.target.value })}
                className="rounded-xl border-gray-200"
                placeholder="ivan@example.com"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-2">Регион вашей фермы *</Label>
              <Input
                required
                value={farmerData.region}
                onChange={(e) => setFarmerData({ ...farmerData, region: e.target.value })}
                className="rounded-xl border-gray-200"
                placeholder="Краснодарский край"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3">Нужна ли вам такая платформа? *</Label>
              <RadioGroup required value={farmerData.interest} onValueChange={(val) => setFarmerData({ ...farmerData, interest: val })}>
                <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <RadioGroupItem value="very-interested" id="f1" />
                  <Label htmlFor="f1" className="flex-1 cursor-pointer">Да, очень нужна! Готов попробовать</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <RadioGroupItem value="interested" id="f2" />
                  <Label htmlFor="f2" className="flex-1 cursor-pointer">Интересно, хочу узнать больше</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <RadioGroupItem value="maybe" id="f3" />
                  <Label htmlFor="f3" className="flex-1 cursor-pointer">Возможно, нужно подумать</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <RadioGroupItem value="not-interested" id="f4" />
                  <Label htmlFor="f4" className="flex-1 cursor-pointer">Скорее нет, не актуально</Label>
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

export default FarmersSection;
