import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

type SocialNetwork = 'vk' | 'telegram' | 'instagram' | 'youtube';

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

export default function OwnerProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    bio: '',
    farm_name: '',
    region: '',
    address: '',
    vk_link: '',
    telegram_link: '',
    instagram_link: '',
    youtube_link: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedSocials, setSelectedSocials] = useState<SocialNetwork[]>([]);

  const socialNetworks: { id: SocialNetwork; icon: string; label: string; placeholder: string }[] = [
    { id: 'vk', icon: 'MessageCircle', label: 'ВКонтакте', placeholder: 'https://vk.com/your_page' },
    { id: 'telegram', icon: 'Send', label: 'Telegram', placeholder: 'https://t.me/your_channel' },
    { id: 'instagram', icon: 'Camera', label: 'Instagram', placeholder: 'https://instagram.com/your_profile' },
    { id: 'youtube', icon: 'Video', label: 'YouTube', placeholder: 'https://youtube.com/@your_channel' },
  ];

  useEffect(() => {
    const savedProfile = localStorage.getItem('ownerProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Ошибка восстановления профиля:', e);
      }
    }
    
    if (!authLoading && user) {
      loadProfile();
    } else if (!authLoading && !user) {
      setLoadingData(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    const activeSocials: SocialNetwork[] = [];
    if (profile.vk_link) activeSocials.push('vk');
    if (profile.telegram_link) activeSocials.push('telegram');
    if (profile.instagram_link) activeSocials.push('instagram');
    if (profile.youtube_link) activeSocials.push('youtube');
    setSelectedSocials(activeSocials);
  }, [profile.vk_link, profile.telegram_link, profile.instagram_link, profile.youtube_link]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${FARMER_API}?action=get_profile`, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const data = await response.json();
      
      if (data.profile) {
        setProfile({
          first_name: data.profile.first_name || '',
          last_name: data.profile.last_name || '',
          phone: data.profile.phone || '',
          email: data.profile.email || user.email,
          bio: data.profile.bio || '',
          farm_name: data.profile.farm_name || '',
          region: data.profile.region || '',
          address: data.profile.address || '',
          vk_link: data.profile.vk_link || '',
          telegram_link: data.profile.telegram_link || '',
          instagram_link: data.profile.instagram_link || '',
          youtube_link: data.profile.youtube_link || '',
        });
      } else {
        setProfile({ ...profile, email: user.email });
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSave = async () => {
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : user;
    
    if (!currentUser) {
      toast.error('Пожалуйста, войди в аккаунт заново');
      return;
    }

    if (!profile.first_name || !profile.last_name || !profile.phone || !profile.bio || !profile.farm_name || !profile.region) {
      toast.error('Заполни все обязательные поля для 100% профиля');
      return;
    }
    
    localStorage.setItem('ownerProfile', JSON.stringify(profile));
    
    setLoading(true);
    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser.id.toString()
        },
        body: JSON.stringify({
          action: 'update_profile',
          ...profile
        })
      });

      if (response.ok) {
        toast.success('Профиль обновлен!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка сохранения');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const isComplete = profile.first_name && profile.last_name && profile.phone && profile.bio && profile.farm_name && profile.region;
  const completionPercent = Math.round([
    profile.first_name,
    profile.last_name,
    profile.phone,
    profile.bio,
    profile.farm_name,
    profile.region
  ].filter(Boolean).length * 100 / 6);

  if (authLoading || loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Профиль владельца — представь себя</h2>
        <p className="text-gray-600 mt-1">Заполни на 100% для создания предложений</p>
      </div>

      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Заполнение профиля</span>
          <span className="text-lg font-bold text-green-600">{completionPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        {!isComplete && (
          <p className="text-xs text-gray-600 mt-2">
            Заполни все поля для возможности создания предложений
          </p>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Редактирование профиля</h3>
          <div>
            <Label>Название хозяйства *</Label>
            <Input 
              value={profile.farm_name} 
              onChange={(e) => setProfile({...profile, farm_name: e.target.value})}
              placeholder="Например: Ферма Золотая Нива"
            />
          </div>
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
            <Label>Регион *</Label>
            <Input value={profile.region} onChange={(e) => setProfile({...profile, region: e.target.value})} placeholder="Например: Бурятия, Алтайский край" />
          </div>
          <div>
            <Label>О себе *</Label>
            <Textarea 
              value={profile.bio} 
              onChange={(e) => setProfile({...profile, bio: e.target.value})} 
              rows={4} 
              placeholder="Фермер из Бурятии, специализируюсь на сое и кукурузе. 20 лет опыта."
            />
          </div>
          <div>
            <Label>Адрес хозяйства</Label>
            <Input 
              value={profile.address} 
              onChange={(e) => setProfile({...profile, address: e.target.value})} 
              placeholder="Например: Бурятия, Баргузинский район, с. Курумкан"
            />
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Icon name="Link" size={16} />
              Социальные сети
            </h4>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {socialNetworks.map((social) => {
                const isSelected = selectedSocials.includes(social.id);
                return (
                  <Button
                    key={social.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSocials(selectedSocials.filter(s => s !== social.id));
                        setProfile({...profile, [`${social.id}_link`]: ''});
                      } else {
                        setSelectedSocials([...selectedSocials, social.id]);
                      }
                    }}
                    className="gap-2"
                  >
                    <Icon name={social.icon} size={14} />
                    {social.label}
                    {isSelected && <Icon name="X" size={12} />}
                  </Button>
                );
              })}
            </div>

            <div className="space-y-3">
              {selectedSocials.map((socialId) => {
                const social = socialNetworks.find(s => s.id === socialId);
                if (!social) return null;
                
                const fieldKey = `${social.id}_link` as keyof typeof profile;
                
                return (
                  <div key={social.id}>
                    <Label className="text-sm flex items-center gap-1">
                      <Icon name={social.icon} size={14} />
                      {social.label}
                    </Label>
                    <Input 
                      value={profile[fieldKey]} 
                      onChange={(e) => setProfile({...profile, [fieldKey]: e.target.value})} 
                      placeholder={social.placeholder}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? <Icon name="Loader2" className="animate-spin mr-2" size={16} /> : <Icon name="Save" size={16} className="mr-2" />}
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
                <div className="text-sm text-gray-600">{profile.farm_name || 'Название хозяйства'}</div>
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
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={16} className="text-gray-400" />
                <span>{profile.region || 'Не указан'}</span>
              </div>
              {profile.address && (
                <div className="flex items-start gap-2">
                  <Icon name="Home" size={16} className="text-gray-400 mt-0.5" />
                  <span className="text-xs">{profile.address}</span>
                </div>
              )}
              {(profile.vk_link || profile.telegram_link || profile.instagram_link || profile.youtube_link) && (
                <div className="flex items-center gap-3 pt-2">
                  <Icon name="Link" size={16} className="text-gray-400" />
                  <div className="flex gap-2">
                    {profile.vk_link && (
                      <a href={profile.vk_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        <Icon name="MessageCircle" size={18} />
                      </a>
                    )}
                    {profile.telegram_link && (
                      <a href={profile.telegram_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                        <Icon name="Send" size={18} />
                      </a>
                    )}
                    {profile.instagram_link && (
                      <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                        <Icon name="Camera" size={18} />
                      </a>
                    )}
                    {profile.youtube_link && (
                      <a href={profile.youtube_link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                        <Icon name="Video" size={18} />
                      </a>
                    )}
                  </div>
                </div>
              )}
              {profile.bio && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-gray-600">{profile.bio}</div>
                </div>
              )}
            </div>
          </div>
          
          {isComplete && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-semibold">Профиль готов к созданию предложений!</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}