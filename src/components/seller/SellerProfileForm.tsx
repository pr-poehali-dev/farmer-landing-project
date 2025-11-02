import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ProfileForm } from '@/types/seller.types';

interface Props {
  profileForm: ProfileForm;
  saving: boolean;
  onFormChange: (updates: Partial<ProfileForm>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const REGIONS = ['Республика Бурятия', 'Московская область', 'Ленинградская область', 'Краснодарский край'];

export default function SellerProfileForm({ profileForm, saving, onFormChange, onSubmit }: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="User" className="text-blue-600" size={24} />
        <div>
          <h2 className="text-xl font-bold">Профиль компании</h2>
          <p className="text-sm text-gray-600">Информация о вашей компании для фермеров</p>
        </div>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Название компании *</Label>
            <Input
              value={profileForm.company_name}
              onChange={(e) => onFormChange({ company_name: e.target.value })}
              placeholder="ООО Агротех"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Сайт</Label>
            <Input
              value={profileForm.website}
              onChange={(e) => onFormChange({ website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Имя</Label>
            <Input
              value={profileForm.first_name}
              onChange={(e) => onFormChange({ first_name: e.target.value })}
              placeholder="Иван"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Фамилия</Label>
            <Input
              value={profileForm.last_name}
              onChange={(e) => onFormChange({ last_name: e.target.value })}
              placeholder="Петров"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Телефон</Label>
            <Input
              value={profileForm.phone}
              onChange={(e) => onFormChange({ phone: e.target.value })}
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Регион</Label>
            <Select value={profileForm.region} onValueChange={(val) => onFormChange({ region: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите регион" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Город</Label>
            <Input
              value={profileForm.city}
              onChange={(e) => onFormChange({ city: e.target.value })}
              placeholder="Москва"
            />
          </div>
          
          <div className="space-y-2">
            <Label>VK (ссылка)</Label>
            <Input
              value={profileForm.vk_link}
              onChange={(e) => onFormChange({ vk_link: e.target.value })}
              placeholder="https://vk.com/..."
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Описание компании</Label>
          <Textarea
            value={profileForm.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
            placeholder="Расскажите о вашей компании, товарах и услугах..."
            rows={4}
          />
        </div>
        
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Icon name="Loader2" className="animate-spin mr-2" size={16} />
              Сохранение...
            </>
          ) : (
            'Сохранить профиль'
          )}
        </Button>
      </form>
      
      <div className="mt-8 pt-6 border-t">
        <h3 className="font-semibold mb-3">Предпросмотр карточки</h3>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Store" className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">{profileForm.company_name || 'Название компании'}</h4>
              {profileForm.description && (
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">{profileForm.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {profileForm.region && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded">
                    <Icon name="MapPin" size={12} />
                    {profileForm.region}
                  </span>
                )}
                {profileForm.website && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded">
                    <Icon name="Globe" size={12} />
                    Сайт
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
}
