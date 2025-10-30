import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const FounderSection = () => {
  return (
    <section id="founder" className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="rounded-full px-4 py-1.5 bg-green-50 text-green-700 border-green-200 mb-4">
            👨‍🌾 Автор проекта
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Илья Краснопеев</h2>
          <p className="text-xl text-gray-600">Создатель «Илюхиной фермы» и КФХ «Там, где рассвет»</p>
        </div>

        <Card className="p-10 shadow-soft rounded-3xl border-0">
          <div className="space-y-6 mb-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              Автор и главный герой документального сериала «Илюхина ферма», где делюсь реальным опытом фермерства — от рассвета до заката, от радостей до трудностей.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Владелец КФХ «Там, где рассвет» — хозяйства, где рождаются истории о труде, природе и искренней любви к земле.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-2xl shadow-glow flex-1">
              <a href="https://t.me/ilyukhina_ferma" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <Icon name="Send" size={20} />
                Telegram «Илюхина ферма»
              </a>
            </Button>

            <Button asChild size="lg" variant="outline" className="rounded-2xl flex-1">
              <a href="https://planeta.ru/campaigns/235852" target="_blank" rel="noopener noreferrer">
                Поддержать на Planeta.ru
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FounderSection;
