import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BalanceWidget from '@/components/BalanceWidget';
import TopUpModal from '@/components/TopUpModal';
import DashboardHeader from '@/components/seller/DashboardHeader';
import SellerProfileForm from '@/components/seller/SellerProfileForm';
import ProductsManager from '@/components/seller/ProductsManager';
import AdsManager from '@/components/seller/AdsManager';
import FarmersList from '@/components/seller/FarmersList';
import AnalyticsPanel from '@/components/seller/AnalyticsPanel';
import ProductRequests from '@/components/seller/ProductRequests';
import { SELLER_API, Profile, ProfileForm, ProductForm, AdForm, Analytics } from '@/types/seller.types';

const SellerDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [tier, setTier] = useState('none');
  
  const [profileForm, setProfileForm] = useState<ProfileForm>({
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
  
  const [productForm, setProductForm] = useState<ProductForm>({
    type: 'fertilizer',
    name: '',
    price: 0,
    description: '',
    photo_url: '',
    photo_url_2: '',
    photo_url_3: '',
    target_audience: []
  });
  
  const [adForm, setAdForm] = useState<AdForm>({
    name: '',
    image_url: '',
    text: '',
    link: '',
    target_audience: ''
  });
  
  const [farmers, setFarmers] = useState<any[]>([]);
  const [regionFilter, setRegionFilter] = useState('');
  const [occupationFilter, setOccupationFilter] = useState('');
  const [analytics, setAnalytics] = useState<Analytics>({ product_views: 0, farm_requests: 0, commission_revenue: 0 });

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
          photo_url_2: '',
          photo_url_3: '',
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
      toast.error('Ошибка загрузки фермеров');
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`${SELLER_API}?action=get_analytics`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const data = await response.json();
      setAnalytics(data.analytics || { product_views: 0, farm_requests: 0, commission_revenue: 0 });
    } catch (error) {
      toast.error('Ошибка загрузки аналитики');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icon name="Loader2" className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          companyName={profile?.company_name || undefined}
          onLogout={logout}
        />
        
        <div className="mb-6">
          <BalanceWidget balance={balance} onTopUp={() => setShowTopUpModal(true)} />
        </div>

        <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h2 className="text-lg sm:text-xl font-bold mb-1">Добро пожаловать в кабинет продавца!</h2>
          <p className="text-sm sm:text-base text-gray-600">Управляйте товарами, рекламой и находите новых клиентов</p>
        </Card>

        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
            <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
              <Icon name="User" size={14} className="sm:w-4 sm:h-4" />
              <span>Профиль</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
              <Icon name="Package" size={14} className="sm:w-4 sm:h-4" />
              <span>Товары</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
              <Icon name="MessageSquare" size={14} className="sm:w-4 sm:h-4" />
              <span>Заявки</span>
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
              <Icon name="MonitorPlay" size={14} className="sm:w-4 sm:h-4" />
              <span>Реклама</span>
            </TabsTrigger>
            <TabsTrigger value="farms" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
              <Icon name="Users" size={14} className="sm:w-4 sm:h-4" />
              <span>Фермеры</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
              <Icon name="BarChart3" size={14} className="sm:w-4 sm:h-4" />
              <span>Аналитика</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <SellerProfileForm
              profileForm={profileForm}
              saving={saving}
              onFormChange={(updates) => setProfileForm({ ...profileForm, ...updates })}
              onSubmit={saveProfile}
            />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManager
              tier={tier}
              products={profile?.products || []}
              productForm={productForm}
              onFormChange={(updates) => setProductForm({ ...productForm, ...updates })}
              onAddProduct={addProduct}
              onDeleteProduct={deleteProduct}
            />
          </TabsContent>

          <TabsContent value="requests">
            <ProductRequests />
          </TabsContent>

          <TabsContent value="ads">
            <AdsManager
              tier={tier}
              ads={profile?.ads || []}
              adForm={adForm}
              onFormChange={(updates) => setAdForm({ ...adForm, ...updates })}
              onAddAd={addAd}
              onDeleteAd={deleteAd}
            />
          </TabsContent>

          <TabsContent value="farms">
            <FarmersList
              tier={tier}
              farmers={farmers}
              regionFilter={regionFilter}
              occupationFilter={occupationFilter}
              onRegionChange={setRegionFilter}
              onOccupationChange={setOccupationFilter}
              onLoadFarmers={loadFarmers}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsPanel
              tier={tier}
              analytics={analytics}
              onRefresh={loadAnalytics}
            />
          </TabsContent>
        </Tabs>

        <TopUpModal 
          isOpen={showTopUpModal}
          onClose={() => setShowTopUpModal(false)}
          onSuccess={(amount) => {
            setBalance(balance + amount);
            setShowTopUpModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default SellerDashboard;