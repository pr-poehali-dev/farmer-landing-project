import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export default function OwnerProfile() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    bio: '',
  });

  const handleSave = () => {
    toast.success('Профиль обновлен!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Профиль владельца — представь себя</h2>
        <p className="text-gray-600 mt-1">Лаконично обнови данные — для связи с партнерами</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Редактирование профиля</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Имя *</Label>
              <Input value={profile.first_name} onChange={(e) => setProfile({...profile, first_name: e.target.value})} />
            </div>
            <div>
              <Label>Фамилия *</Label>
              <Input value={profile.last_name} onChange={(e) => setProfile({...profile, last_name: e.target.value})} />
            </div>
          </div>
          <div>
            <Label>Телефон *</Label>
            <Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} placeholder="+7 900 123-45-67" />
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
          </div>
          <div>
            <Label>О себе</Label>
            <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} rows={4} placeholder="Фермер из Бурятии, специализируюсь на сое" />
          </div>
          <Button onClick={handleSave} className="w-full">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить профиль
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Как видят твой профиль</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                <Icon name="User" size={32} className="text-green-700" />
              </div>
              <div>
                <div className="font-semibold text-lg">{profile.first_name || 'Имя'} {profile.last_name || 'Фамилия'}</div>
                <div className="text-sm text-gray-600">Фермер</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="Phone" size={16} className="text-gray-400" />
                <span>{profile.phone || 'Не указан'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Mail" size={16} className="text-gray-400" />
                <span>{profile.email || 'Не указан'}</span>
              </div>
              {profile.bio && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-gray-600">{profile.bio}</div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
