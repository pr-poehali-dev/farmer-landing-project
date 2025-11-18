import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import ProductCard from './marketplace/ProductCard';
import ProductDetailsModal from './marketplace/ProductDetailsModal';
import SellerPage from './marketplace/SellerPage';

const SELLER_API = 'https://functions.poehali.dev/cc24321a-77b4-44ce-9ae2-7fb7efee6660';

const PRODUCT_TYPES = [
  { value: 'equipment', label: 'Сельхозтехника' },
  { value: 'fertilizer', label: 'Удобрения' },
  { value: 'seeds', label: 'Семена для посева' },
  { value: 'technology', label: 'Технологии' }
];

export default function SellerMarketplace() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'requests'>('products');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);
  const [requestForm, setRequestForm] = useState({
    farmer_name: '',
    farmer_phone: '',
    farmer_region: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadProducts();
    loadMyRequests();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${SELLER_API}?action=get_all_products`, {
        headers: { 'X-User-Id': user?.id.toString() || '0' }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      toast.error('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const loadMyRequests = async () => {
    try {
      const response = await fetch(`${SELLER_API}?action=get_farmer_requests`, {
        headers: { 'X-User-Id': user?.id.toString() || '0' }
      });
      const data = await response.json();
      setMyRequests(data.requests || []);
    } catch (error) {
      console.error('Ошибка загрузки заявок');
    }
  };

  const sendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      const response = await fetch(SELLER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.id.toString() || '0'
        },
        body: JSON.stringify({
          action: 'request_product',
          product_id: selectedProduct.id,
          seller_id: selectedProduct.seller_id,
          product_name: selectedProduct.name,
          ...requestForm
        })
      });
      
      if (response.ok) {
        toast.success('Заявка отправлена продавцу!');
        setSelectedProduct(null);
        setRequestForm({ farmer_name: '', farmer_phone: '', farmer_region: '', message: '' });
        loadMyRequests();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка отправки заявки');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setSending(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const searchLower = search.toLowerCase().trim();
    const matchesSearch = !searchLower || 
                         (p.name && p.name.toLowerCase().includes(searchLower)) || 
                         (p.seller_name && p.seller_name.toLowerCase().includes(searchLower)) ||
                         (p.description && p.description.toLowerCase().includes(searchLower));
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleViewSeller = (seller: any) => {
    setSelectedSeller(seller);
    setSellerProducts(products.filter(p => p.seller_id === seller.id));
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  if (selectedSeller) {
    return (
      <SellerPage
        seller={selectedSeller}
        products={sellerProducts}
        onBack={() => setSelectedSeller(null)}
        onProductClick={setSelectedProduct}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Товары для фермы</h2>
        <p className="text-gray-600 mt-1">Найди нужное оборудование, удобрения и семена от проверенных продавцов</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeTab === 'products' ? 'default' : 'outline'}
          onClick={() => setActiveTab('products')}
          className="flex items-center gap-2"
        >
          <Icon name="Package" size={16} />
          Все товары
        </Button>
        <Button
          variant={activeTab === 'requests' ? 'default' : 'outline'}
          onClick={() => setActiveTab('requests')}
          className="flex items-center gap-2"
        >
          <Icon name="MessageSquare" size={16} />
          Мои заявки {myRequests.length > 0 && `(${myRequests.length})`}
        </Button>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по товарам и продавцам..."
                className="w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {PRODUCT_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Icon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">Товары не найдены</p>
              <p className="text-sm text-gray-400">Попробуйте изменить фильтры или поисковый запрос</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Icon name="MessageSquare" size={20} className="text-blue-600" />
              Мои заявки на товары
            </h3>
            {myRequests.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">У вас пока нет заявок</p>
                <p className="text-sm text-gray-400 mt-1">Выберите товар и отправьте заявку продавцу</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((request, idx) => (
                  <Card key={idx} className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="Package" size={16} className="text-blue-600" />
                          <h4 className="font-semibold">{request.product_name}</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Icon name="Store" size={14} />
                            <span>Продавец: {request.seller_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="User" size={14} />
                            <span>{request.farmer_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Phone" size={14} />
                            <span>{request.farmer_phone}</span>
                          </div>
                          {request.message && (
                            <div className="flex items-start gap-2 mt-2">
                              <Icon name="MessageSquare" size={14} className="mt-0.5" />
                              <span className="text-xs">{request.message}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          products={products}
          requestForm={requestForm}
          sending={sending}
          onClose={() => setSelectedProduct(null)}
          onFormChange={(updates) => setRequestForm({ ...requestForm, ...updates })}
          onSubmit={sendRequest}
          onViewSeller={handleViewSeller}
        />
      )}
    </div>
  );
}