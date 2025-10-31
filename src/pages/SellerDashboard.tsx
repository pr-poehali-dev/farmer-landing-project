import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SELLER_API = 'https://functions.poehali.dev/cc24321a-77b4-44ce-9ae2-7fb7efee6660';

const SellerDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newProduct, setNewProduct] = useState({
    type: 'удобрения',
    description: '',
    price: 0
  });
  
  const [newAd, setNewAd] = useState({
    text: '',
    image_url: ''
  });
  
  const [addingProduct, setAddingProduct] = useState(false);
  const [creatingAd, setCreatingAd] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'seller')) {
      navigate('/login');
    } else if (user) {
      loadData();
    }
  }, [authLoading, user, navigate]);

  const loadData = async () => {
    try {
      const productsRes = await fetch(`${SELLER_API}?action=get_products`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
      
      const adsRes = await fetch(`${SELLER_API}?action=get_ads`, {
        headers: { 'X-User-Id': user!.id.toString() }
      });
      const adsData = await adsRes.json();
      setAds(adsData.ads || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProduct(true);
    
    try {
      const response = await fetch(SELLER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'add_product',
          ...newProduct
        })
      });
      
      if (response.ok) {
        toast.success('Товар добавлен!');
        setNewProduct({ type: 'удобрения', description: '', price: 0 });
        loadData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка добавления');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setAddingProduct(false);
    }
  };

  const createAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAd(true);
    
    try {
      const response = await fetch(SELLER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user!.id.toString()
        },
        body: JSON.stringify({
          action: 'create_ad',
          ...newAd
        })
      });
      
      if (response.ok) {
        toast.success('Реклама создана!');
        setNewAd({ text: '', image_url: '' });
        loadData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка создания');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setCreatingAd(false);
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
            <Icon name="Sprout" size={32} className="text-farmer-green" />
            <div>
              <h1 className="text-xl font-bold text-farmer-green">Кабинет Продавца</h1>
              <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
            </div>
          </div>
          <Button onClick={() => { logout(); navigate('/'); }} variant="outline">
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Icon name="Package" className="text-farmer-green" />
            Добавить товар
          </h2>
          
          <form onSubmit={addProduct} className="space-y-4">
            <div>
              <Label htmlFor="type">Тип товара</Label>
              <Select value={newProduct.type} onValueChange={(value) => setNewProduct({ ...newProduct, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="удобрения">Удобрения</SelectItem>
                  <SelectItem value="техника">Техника</SelectItem>
                  <SelectItem value="семена">Семена</SelectItem>
                  <SelectItem value="корма">Корма</SelectItem>
                  <SelectItem value="другое">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Описание товара *</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Подробно опишите ваш товар..."
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Цена (руб.) *</Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                placeholder="5000"
                required
              />
            </div>
            
            <Button type="submit" disabled={addingProduct} className="bg-farmer-green hover:bg-farmer-green-dark">
              {addingProduct ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                  Добавление...
                </>
              ) : (
                <>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить товар
                </>
              )}
            </Button>
          </form>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Icon name="Megaphone" className="text-farmer-orange" />
            Создать рекламу
          </h2>
          
          <form onSubmit={createAd} className="space-y-4">
            <div>
              <Label htmlFor="ad_text">Текст рекламы *</Label>
              <Textarea
                id="ad_text"
                value={newAd.text}
                onChange={(e) => setNewAd({ ...newAd, text: e.target.value })}
                placeholder="Напишите текст вашей рекламы..."
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="image_url">URL изображения (необязательно)</Label>
              <Input
                id="image_url"
                type="url"
                value={newAd.image_url}
                onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <Button type="submit" disabled={creatingAd} className="bg-farmer-orange hover:bg-farmer-orange-dark">
              {creatingAd ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                  Создание...
                </>
              ) : (
                'Разместить рекламу'
              )}
            </Button>
          </form>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Icon name="List" className="text-farmer-green" />
            Мои товары
          </h2>
          
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Пока нет товаров</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-4 border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 bg-farmer-green/10 text-farmer-green text-xs font-medium rounded mb-2">
                        {product.type}
                      </span>
                      <p className="font-medium text-gray-900">{product.description}</p>
                      <p className="text-lg font-semibold text-farmer-green mt-2">{product.price} ₽</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Icon name="Megaphone" className="text-farmer-orange" />
            Мои объявления
          </h2>
          
          {ads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Пока нет объявлений</p>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <Card key={ad.id} className="p-4 border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-gray-900">{ad.text}</p>
                      {ad.image_url && (
                        <p className="text-sm text-gray-600 mt-2">Изображение: {ad.image_url}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ml-4 ${
                      ad.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      ad.status === 'active' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ad.status === 'pending' ? 'На модерации' : ad.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
