import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BalanceWidget from '@/components/BalanceWidget';
import TopUpModal from '@/components/TopUpModal';

const SELLER_API = 'https://functions.poehali.dev/cc24321a-77b4-44ce-9ae2-7fb7efee6660';

interface Profile {
  id: number;
  email: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  photo_url: string | null;
  subscription_tier: string;
  subscription_expires_at: string | null;
  company_name: string | null;
  description: string | null;
  website: string | null;
  vk_link: string | null;
  telegram_link: string | null;
  products: any[];
  ads: any[];
}

const SellerDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [tier, setTier] = useState('none');
  
  const [profileForm, setProfileForm] = useState({
    company_name: '',
    description: '',
    website: '',
    vk_link: '',
    telegram_link: '',
    first_name: '',
    last_name: '',
    phone: '',
    region: '',
    city: ''
  });
  
  const [productForm, setProductForm] = useState({
    type: 'fertilizer',
    name: '',
    price: 0,
    description: '',
    photo_url: '',
    target_audience: [] as string[]
  });
  
  const [adForm, setAdForm] = useState({
    name: '',
    image_url: '',
    text: '',
    link: '',
    target_audience: ''
  });
  
  const [farmers, setFarmers] = useState<any[]>([]);
  const [regionFilter, setRegionFilter] = useState('');
  const [occupationFilter, setOccupationFilter] = useState('');
  const [analytics, setAnalytics] = useState({ product_views: 0, farm_requests: 0, commission_revenue: 0 });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'seller')) {
      navigate('/login');
    } else if (user) {
      loadProfile();
      loadFarmers();
      loadAnalytics();
    }
  }, [authLoading, user, navigate]);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${SELLER_API}?action=get_profile`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const data = await response.json();
      setProfile(data.profile);
      setTier(data.profile.subscription_tier || 'none');
      
      setProfileForm({
        company_name: data.profile.company_name || '',
        description: data.profile.description || '',
        website: data.profile.website || '',
        vk_link: data.profile.vk_link || '',
        telegram_link: data.profile.telegram_link || '',
        first_name: data.profile.first_name || '',
        last_name: data.profile.last_name || '',
        phone: data.profile.phone || '',
        region: data.profile.region || '',
        city: data.profile.city || ''
      });
      
      const balanceRes = await fetch(`${SELLER_API}?action=get_balance`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const balanceData = await balanceRes.json();
      setBalance(balanceData.balance || 0);
    } catch (error) {
      toast.error('Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(SELLER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'update_profile',
          ...profileForm
        })
      });
      
      if (response.ok) {
        toast.success('Профиль обновлен!');
        loadProfile();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка сохранения');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setSaving(false);
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(SELLER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'add_product',
          ...productForm
        })
      });
      
      if (response.ok) {
        toast.success('Товар добавлен!');
        setProductForm({
          type: 'fertilizer',
          name: '',
          price: 0,
          description: '',
          photo_url: '',
          target_audience: []
        });
        loadProfile();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка добавления товара');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(SELLER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'delete_product',
          product_id: productId
        })
      });
      
      if (response.ok) {
        toast.success('Товар удален');
        loadProfile();
      } else {
        toast.error('Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  const addAd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(SELLER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'add_ad',
          ...adForm
        })
      });
      
      if (response.ok) {
        toast.success('Реклама добавлена!');
        setAdForm({
          name: '',
          image_url: '',
          text: '',
          link: '',
          target_audience: ''
        });
        loadProfile();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка добавления рекламы');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  const deleteAd = async (adId: string) => {
    try {
      const response = await fetch(SELLER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'delete_ad',
          ad_id: adId
        })
      });
      
      if (response.ok) {
        toast.success('Реклама удалена');
        loadProfile();
      } else {
        toast.error('Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  const loadFarmers = async () => {
    try {
      const params = new URLSearchParams();
      params.append('action', 'get_farmers');
      if (regionFilter) params.append('region', regionFilter);
      if (occupationFilter) params.append('occupation', occupationFilter);
      
      const response = await fetch(`${SELLER_API}?${params.toString()}`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const data = await response.json();
      setFarmers(data.farmers || []);
    } catch (error) {
      console.error('Ошибка загрузки фермеров');
      toast.error('Ошибка загрузки фермеров');
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`${SELLER_API}?action=get_analytics`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Ошибка загрузки аналитики');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-farmer-green" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon name="Store" size={32} className="text-farmer-green" />
            <div>
              <h1 className="text-xl font-bold text-farmer-green">Кабинет Продавца</h1>
              <p className="text-sm text-gray-600">{profile?.company_name || profile?.name || user?.email}</p>
            </div>
          </div>
          <Button onClick={() => { logout(); navigate('/'); }} variant="outline">
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <BalanceWidget 
            balance={balance} 
            onTopUp={() => setShowTopUpModal(true)} 
          />
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-r from-farmer-green/5 to-farmer-orange/5">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Твой кабинет — стань партнером в таинстве роста ферм
          </h2>
          <p className="text-gray-700">
            Управляй товарами, рекламой и получай insights о фермах
          </p>
        </Card>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="profile">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="products">
              <Icon name="Package" size={18} className="mr-2" />
              Мои Товары
            </TabsTrigger>
            <TabsTrigger value="ads">
              <Icon name="Megaphone" size={18} className="mr-2" />
              Реклама
            </TabsTrigger>
            <TabsTrigger value="farms">
              <Icon name="Users" size={18} className="mr-2" />
              Фермеры
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="BarChart3" size={18} className="mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Профиль — представь свой бренд</h3>
              <p className="text-gray-600 mb-6">
                Лаконично обнови данные — чтобы фермеры выбрали тебя как хранителя роста
              </p>
              
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Название компании *</Label>
                    <Input
                      id="company_name"
                      value={profileForm.company_name}
                      onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Сайт</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="first_name">Имя</Label>
                    <Input
                      id="first_name"
                      value={profileForm.first_name}
                      onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="last_name">Фамилия</Label>
                    <Input
                      id="last_name"
                      value={profileForm.last_name}
                      onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="region">Регион *</Label>
                    <Input
                      id="region"
                      value={profileForm.region}
                      onChange={(e) => setProfileForm({ ...profileForm, region: e.target.value })}
                      placeholder="Москва"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Город *</Label>
                    <Input
                      id="city"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      placeholder="Москва"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="vk_link">VK</Label>
                    <Input
                      id="vk_link"
                      value={profileForm.vk_link}
                      onChange={(e) => setProfileForm({ ...profileForm, vk_link: e.target.value })}
                      placeholder="https://vk.com/..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={profileForm.description}
                      onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                      placeholder="Поставщик удобрений для полей кукурузы"
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={saving} className="bg-farmer-green hover:bg-farmer-green-dark">
                  {saving ? 'Сохранение...' : 'Сохранить профиль'}
                </Button>
              </form>
              
              <div className="mt-8 p-4 border-t">
                <h4 className="font-semibold mb-3">Предпросмотр карточки</h4>
                <Card className="p-4 bg-gray-50">
                  <h5 className="font-bold">{profileForm.company_name || 'Название компании'}</h5>
                  <p className="text-sm text-gray-600 mt-1">{profileForm.description || 'Описание'}</p>
                  <div className="flex gap-3 mt-3 text-sm">
                    {profileForm.website && (
                      <a href={profileForm.website} className="text-farmer-green hover:underline" target="_blank" rel="noopener noreferrer">
                        Сайт
                      </a>
                    )}
                    {profileForm.vk_link && (
                      <a href={profileForm.vk_link} className="text-farmer-green hover:underline" target="_blank" rel="noopener noreferrer">
                        VK
                      </a>
                    )}
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Мои товары — предлагай помощь фермам</h3>
              <p className="text-gray-600 mb-6">
                Добавь товары лаконично — фермеры увидят и выберут
              </p>
              
              {tier === 'none' ? (
                <div className="text-center py-12">
                  <Icon name="Lock" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Требуется подписка для добавления товаров</p>
                  <Button className="bg-farmer-green hover:bg-farmer-green-dark">
                    Подписаться (от 500 руб/мес)
                  </Button>
                </div>
              ) : (
                <>
                  <form onSubmit={addProduct} className="space-y-4 mb-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Добавить товар</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product_type">Тип товара *</Label>
                        <Select value={productForm.type} onValueChange={(v) => setProductForm({ ...productForm, type: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fertilizer">Удобрения</SelectItem>
                            <SelectItem value="equipment">Техника</SelectItem>
                            <SelectItem value="attachment">Навесное оборудование</SelectItem>
                            <SelectItem value="other">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="product_name">Название/Модель *</Label>
                        <Input
                          id="product_name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="Аммофос для сои"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="product_price">Цена (руб.) *</Label>
                        <Input
                          id="product_price"
                          type="number"
                          min="0"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="product_desc">Описание</Label>
                        <Textarea
                          id="product_desc"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Краткое описание товара"
                          rows={2}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="bg-farmer-green hover:bg-farmer-green-dark">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить товар
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      * Платформа возьмет комиссию 5-10%
                    </p>
                  </form>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Список товаров</h4>
                    {profile?.products.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Пока нет товаров</p>
                    ) : (
                      <div className="space-y-3">
                        {profile?.products.map((product) => (
                          <Card key={product.id} className="p-4 flex justify-between items-center">
                            <div>
                              <h5 className="font-semibold">{product.name}</h5>
                              <p className="text-sm text-gray-600">{product.type} • {product.price} ₽</p>
                              {product.description && (
                                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                              )}
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Реклама — вдохни фермам</h3>
              <p className="text-gray-600 mb-6">
                Размести баннер лаконично — привлеки фермы к твоим товарам
              </p>
              
              {tier === 'none' ? (
                <div className="text-center py-12">
                  <Icon name="Lock" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Требуется подписка для размещения рекламы</p>
                  <Button className="bg-farmer-green hover:bg-farmer-green-dark">
                    Подписаться (от 500 руб/мес)
                  </Button>
                </div>
              ) : (
                <>
                  <form onSubmit={addAd} className="space-y-4 mb-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Добавить баннер</h4>
                    {tier === 'basic' && profile?.ads.length >= 1 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <Icon name="AlertCircle" size={16} className="inline mr-2" />
                        Базовая подписка позволяет 1 баннер. Обновите до Premium для неограниченного количества.
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ad_name">Название *</Label>
                        <Input
                          id="ad_name"
                          value={adForm.name}
                          onChange={(e) => setAdForm({ ...adForm, name: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="ad_image">URL изображения *</Label>
                        <Input
                          id="ad_image"
                          type="url"
                          value={adForm.image_url}
                          onChange={(e) => setAdForm({ ...adForm, image_url: e.target.value })}
                          placeholder="https://..."
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="ad_text">Текст рекламы</Label>
                        <Textarea
                          id="ad_text"
                          value={adForm.text}
                          onChange={(e) => setAdForm({ ...adForm, text: e.target.value })}
                          placeholder="Удобрения для твоего поля!"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="ad_link">Ссылка</Label>
                        <Input
                          id="ad_link"
                          type="url"
                          value={adForm.link}
                          onChange={(e) => setAdForm({ ...adForm, link: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="ad_audience">Целевая аудитория</Label>
                        <Input
                          id="ad_audience"
                          value={adForm.target_audience}
                          onChange={(e) => setAdForm({ ...adForm, target_audience: e.target.value })}
                          placeholder="Бурятия, кукуруза"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-farmer-green hover:bg-farmer-green-dark"
                      disabled={tier === 'basic' && profile?.ads.length >= 1}
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить баннер
                    </Button>
                  </form>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Список баннеров</h4>
                    {profile?.ads.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Пока нет баннеров</p>
                    ) : (
                      <div className="space-y-3">
                        {profile?.ads.map((ad) => (
                          <Card key={ad.id} className="p-4 flex justify-between items-start">
                            <div className="flex gap-4">
                              {ad.image_url && (
                                <img src={ad.image_url} alt={ad.name} className="w-24 h-16 object-cover rounded" />
                              )}
                              <div>
                                <h5 className="font-semibold">{ad.name}</h5>
                                <p className="text-sm text-gray-600">{ad.text}</p>
                                <p className="text-xs text-gray-500 mt-1">Просмотры: {ad.views}</p>
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteAd(ad.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="farms">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Фермеры — найди своих клиентов</h3>
              <p className="text-gray-600 mb-6">
                Сортируй по региону и занятию. С платной подпиской — полная информация
              </p>
              
              <div className="mb-6 grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Регион</Label>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Все регионы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все регионы</SelectItem>
                      <SelectItem value="Республика Бурятия">Республика Бурятия</SelectItem>
                      <SelectItem value="Московская область">Московская область</SelectItem>
                      <SelectItem value="Ленинградская область">Ленинградская область</SelectItem>
                      <SelectItem value="Краснодарский край">Краснодарский край</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Занятие</Label>
                  <Select value={occupationFilter} onValueChange={setOccupationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Все занятия" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все занятия</SelectItem>
                      <SelectItem value="animal">Животноводство</SelectItem>
                      <SelectItem value="crop">Растениеводство</SelectItem>
                      <SelectItem value="beehive">Пчеловодство</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button onClick={loadFarmers} className="w-full bg-farmer-green hover:bg-farmer-green-dark">
                    <Icon name="Search" size={16} className="mr-2" />
                    Найти
                  </Button>
                </div>
              </div>
              
              {farmers.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Нажмите "Найти" для поиска фермеров</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {farmers.map((farmer: any) => (
                    <Card key={farmer.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-semibold text-lg">{farmer.farm_name}</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {farmer.farmer_name} • {farmer.region}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {farmer.occupation}
                            </span>
                          </div>
                          
                          {tier === 'premium' && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <div className="grid md:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="font-medium">Email:</span> {farmer.email}
                                </div>
                                <div>
                                  <span className="font-medium">Телефон:</span> {farmer.phone || 'Не указан'}
                                </div>
                              </div>
                              
                              {farmer.assets && farmer.assets.length > 0 && (
                                <div className="mt-3">
                                  <p className="font-medium text-sm mb-2">Активы фермы:</p>
                                  <div className="space-y-2">
                                    {farmer.assets.map((asset: any, idx: number) => (
                                      <div key={idx} className="text-xs p-2 bg-white rounded border">
                                        <span className="font-medium">{asset.name || 'Актив'}</span>
                                        {asset.count && <span className="ml-2 text-gray-600">({asset.count} ед.)</span>}
                                        {asset.details && <p className="text-gray-600 mt-1">{asset.details}</p>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-3">
                                <Button size="sm" variant="outline">
                                  <Icon name="Mail" size={14} className="mr-2" />
                                  Связаться
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {tier !== 'premium' && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                              <Icon name="Lock" size={14} className="inline mr-1" />
                              Подпишись на Premium для доступа к контактам и полной информации
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Аналитика — измерь свой вклад</h3>
              <p className="text-gray-600 mb-6">
                Лаконичные метрики — увидишь, как помогаешь фермам
              </p>
              
              {tier === 'none' ? (
                <div className="text-center py-12">
                  <Icon name="Lock" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Требуется подписка для доступа к аналитике</p>
                  <Button className="bg-farmer-green hover:bg-farmer-green-dark">
                    Подписаться
                  </Button>
                </div>
              ) : (
                <div>
                  <Button onClick={loadAnalytics} className="mb-6 bg-farmer-green hover:bg-farmer-green-dark">
                    <Icon name="RefreshCw" size={16} className="mr-2" />
                    Загрузить аналитику
                  </Button>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6 text-center">
                      <Icon name="Eye" size={32} className="mx-auto mb-3 text-farmer-green" />
                      <h4 className="text-2xl font-bold">{analytics.product_views}</h4>
                      <p className="text-sm text-gray-600">Просмотры товаров</p>
                    </Card>
                    
                    <Card className="p-6 text-center">
                      <Icon name="Users" size={32} className="mx-auto mb-3 text-farmer-green" />
                      <h4 className="text-2xl font-bold">{analytics.farm_requests}</h4>
                      <p className="text-sm text-gray-600">Запросы от ферм</p>
                    </Card>
                    
                    <Card className="p-6 text-center">
                      <Icon name="DollarSign" size={32} className="mx-auto mb-3 text-farmer-green" />
                      <h4 className="text-2xl font-bold">{analytics.commission_revenue} ₽</h4>
                      <p className="text-sm text-gray-600">Доход от комиссий</p>
                    </Card>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TopUpModal 
        open={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSubmit={(amount) => {
          toast.success(`Переход к оплате ${amount} ₽`);
        }}
      />
    </div>
  );
};

export default SellerDashboard;