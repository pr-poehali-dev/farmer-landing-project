import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import RegionSelector from './RegionSelector';

interface SurveySectionProps {
  showCustomRegion: boolean;
  onRegionChange: (show: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SurveySection({ showCustomRegion, onRegionChange, onSubmit }: SurveySectionProps) {
  return (
    <section id="survey" className="py-20 px-4 bg-[#FAF0C0]">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-[#0099CC]">
            Пройди опрос: Нужна ли такая платформа?
          </h2>
          <p className="text-lg text-[#5A9FB8]">
            Твой отзыв поможет улучшить "Фармер"!
          </p>
        </div>

        <Card className="p-8 shadow-xl bg-white/80 border-[#E5D68B]">
          <div className="text-center mb-6">
            <Icon name="ClipboardList" className="inline text-[#0099CC] mb-4" size={48} />
            <h3 className="text-2xl font-bold text-[#0099CC] mb-2">Опрос для всех пользователей</h3>
            <p className="text-[#5A9FB8]">Ответьте на несколько вопросов, чтобы помочь нам улучшить платформу</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-[#0099CC]">Кто вы?</label>
              <select name="interest_type" className="w-full px-3 py-2 border border-[#E5D68B] rounded-md bg-white" required>
                <option value="">Выберите...</option>
                <option>Фермер</option>
                <option>Инвестор</option>
                <option>Продавец</option>
                <option>Просто интересуюсь</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#0099CC]">
                Насколько актуальна для вас такая платформа? (от 1 до 10)
              </label>
              <input
                name="rating"
                type="range"
                min="1"
                max="10"
                defaultValue="5"
                className="w-full"
                required
              />
              <div className="flex justify-between text-sm text-[#5A9FB8] mt-1">
                <span>1 - Не актуально</span>
                <span>10 - Очень актуально</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#0099CC]">Ваши предложения и идеи</label>
              <Textarea
                name="suggestions"
                placeholder="Поделитесь своими мыслями о платформе..."
                rows={4}
                className="bg-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#0099CC]">Контакт для связи</label>
              <Input name="email" type="email" placeholder="Ваш email" required className="bg-white" />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#0099CC]">Регион</label>
              <RegionSelector 
                name="region" 
                borderColor="border-[#E5D68B]"
                showCustom={showCustomRegion}
                onRegionChange={onRegionChange}
              />
            </div>

            <Button type="submit" className="w-full bg-[#0099CC] hover:bg-[#007799] text-white py-6 text-lg">
              <Icon name="Send" className="mr-2" size={18} />
              Отправить отзыв
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
