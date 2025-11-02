import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { AdForm } from '@/types/seller.types';

interface Props {
  tier: string;
  ads: any[];
  adForm: AdForm;
  onFormChange: (updates: Partial<AdForm>) => void;
  onAddAd: (e: React.FormEvent) => void;
  onDeleteAd: (adId: string) => void;
}

export default function AdsManager({ tier, ads, adForm, onFormChange, onAddAd, onDeleteAd }: Props) {
  if (tier === 'none') {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Icon name="Lock" className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-bold mb-2">Реклама</h3>
          <p className="text-gray-600 mb-4">Размещайте рекламные баннеры для фермеров</p>
          <p className="text-sm text-red-600">Доступно с подпиской Basic или Premium</p>
        </div>
      </Card>
    );
  }

  const adLimit = tier === 'basic' ? 2 : Infinity;
  const canAddAd = ads.length < adLimit;

  return (
    <div className="space-y-6">
      {tier === 'basic' && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="text-amber-600 flex-shrink-0" size={20} />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">Лимит Basic подписки</p>
              <p className="text-amber-700">Вы можете создать до 2 рекламных баннеров. Для неограниченного количества нужна Premium подписка.</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="MonitorPlay" className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-bold">Создать рекламу</h2>
            <p className="text-sm text-gray-600">Рекламный баннер для показа фермерам</p>
          </div>
        </div>
        
        {!canAddAd && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            Достигнут лимит баннеров для вашей подписки
          </div>
        )}
        
        <form onSubmit={onAddAd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Название кампании *</Label>
              <Input
                value={adForm.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                placeholder="Акция на удобрения"
                required
                disabled={!canAddAd}
              />
            </div>
            
            <div className="space-y-2">
              <Label>URL изображения *</Label>
              <Input
                value={adForm.image_url}
                onChange={(e) => onFormChange({ image_url: e.target.value })}
                placeholder="https://example.com/banner.jpg"
                required
                disabled={!canAddAd}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Текст рекламы</Label>
            <Textarea
              value={adForm.text}
              onChange={(e) => onFormChange({ text: e.target.value })}
              placeholder="Скидка 20% на все удобрения в марте!"
              rows={2}
              disabled={!canAddAd}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ссылка при клике</Label>
              <Input
                value={adForm.link}
                onChange={(e) => onFormChange({ link: e.target.value })}
                placeholder="https://example.com/promo"
                disabled={!canAddAd}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Целевая аудитория</Label>
              <Input
                value={adForm.target_audience}
                onChange={(e) => onFormChange({ target_audience: e.target.value })}
                placeholder="animal, crop"
                disabled={!canAddAd}
              />
            </div>
          </div>
          
          <Button type="submit" disabled={!canAddAd}>
            <Icon name="Plus" size={16} className="mr-2" />
            Создать рекламу
          </Button>
        </form>
      </Card>
      
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Мои рекламные кампании ({ads.length}/{tier === 'basic' ? adLimit : '∞'})</h3>
        {ads.length === 0 ? (
          <p className="text-gray-500 text-sm">У вас пока нет рекламных кампаний</p>
        ) : (
          <div className="space-y-3">
            {ads.map((ad) => (
              <Card key={ad.id} className="p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{ad.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{ad.text}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size={12} />
                        {ad.views || 0} просмотров
                      </span>
                      {ad.link && (
                        <span className="flex items-center gap-1">
                          <Icon name="ExternalLink" size={12} />
                          {ad.link}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteAd(ad.id)}
                    className="text-red-600"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
