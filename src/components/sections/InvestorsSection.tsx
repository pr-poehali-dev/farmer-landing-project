import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface InvestorsSectionProps {
  investorData: { name: string; email: string; amount: string; returnType: string };
  setInvestorData: (data: { name: string; email: string; amount: string; returnType: string }) => void;
  handleInvestorSubmit: (e: React.FormEvent) => void;
}

const InvestorsSection = ({ investorData, setInvestorData, handleInvestorSubmit }: InvestorsSectionProps) => {
  return (
    <section id="investors" className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
            📈 Для инвесторов
          </Badge>
          <h2 className="text-5xl font-bold mb-4">Инвесторам: вкладывайте в реальное производство</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Узнайте, как инвестировать в сельское хозяйство с прозрачностью и контролем
          </p>
        </div>

        <Card className="p-10 shadow-soft rounded-3xl border-0 bg-white">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Что вы получите:</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <span>Выбор формата отдачи: финансовая доходность, натуральные продукты или патронаж животных</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <span>Прозрачная аналитика по каждой ферме</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <span>Видео с фермы и отчёты о развитии</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Check" className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <span>Страховка ваших инвестиций</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleInvestorSubmit} className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-2">Ваше имя *</Label>
              <Input
                required
                value={investorData.name}
                onChange={(e) => setInvestorData({ ...investorData, name: e.target.value })}
                className="rounded-xl border-gray-200"
                placeholder="Сергей Иванов"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-2">Email *</Label>
              <Input
                type="email"
                required
                value={investorData.email}
                onChange={(e) => setInvestorData({ ...investorData, email: e.target.value })}
                className="rounded-xl border-gray-200"
                placeholder="sergey@example.com"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-2">Примерная сумма инвестиций *</Label>
              <select
                required
                value={investorData.amount}
                onChange={(e) => setInvestorData({ ...investorData, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200"
              >
                <option value="">Выберите...</option>
                <option value="100k-500k">100 000 - 500 000 ₽</option>
                <option value="500k-1m">500 000 - 1 000 000 ₽</option>
                <option value="1m-5m">1 000 000 - 5 000 000 ₽</option>
                <option value="5m+">Более 5 000 000 ₽</option>
              </select>
            </div>

            <div>
              <Label className="text-base font-medium mb-3">Нужна ли вам такая платформа? *</Label>
              <RadioGroup required value={investorData.returnType} onValueChange={(val) => setInvestorData({ ...investorData, returnType: val })}>
                <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <RadioGroupItem value="very-interested" id="i1" />
                  <Label htmlFor="i1" className="flex-1 cursor-pointer">Да, очень нужна! Готов инвестировать</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <RadioGroupItem value="interested" id="i2" />
                  <Label htmlFor="i2" className="flex-1 cursor-pointer">Интересно, хочу узнать условия</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <RadioGroupItem value="maybe" id="i3" />
                  <Label htmlFor="i3" className="flex-1 cursor-pointer">Возможно, но есть сомнения</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                  <RadioGroupItem value="not-interested" id="i4" />
                  <Label htmlFor="i4" className="flex-1 cursor-pointer">Скорее нет, не интересно</Label>
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

export default InvestorsSection;
