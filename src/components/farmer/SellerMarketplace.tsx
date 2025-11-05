import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const SELLER_API = 'https://functions.poehali.dev/cc24321a-77b4-44ce-9ae2-7fb7efee6660';

const PRODUCT_TYPES = [
  { value: 'equipment', label: 'Сельхозтехника' },
  { value: 'fertilizer', label: 'Удобрения' },
  { value: 'seeds', label: 'Семена для посева' }
];

export default function SellerMarketplace() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [requestForm, setRequestForm] = useState({
    farmer_name: '',
    farmer_phone: '',
    farmer_region: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadProducts();
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
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.seller_name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Товары для фермы</h2>
        <p className="text-gray-600 mt-1">Найди нужное оборудование, удобрения и семена от проверенных продавцов</p>
      </div>

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
          <Icon name="Package" size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Товары не найдены</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
              {product.photo_url ? (
                <img src={product.photo_url} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Icon name="Package" size={48} className="text-gray-400" />
                </div>
              )}
              
              <div className="mb-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {PRODUCT_TYPES.find(t => t.value === product.type)?.label}
                </span>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {product.price.toLocaleString('ru-RU')} ₽
              </div>
              
              {product.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              )}
              
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <div className="flex items-center gap-2">
                  <Icon name="Store" size={14} />
                  <span>{product.seller_name}</span>
                </div>
                {product.seller_region && (
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={14} />
                    <span>{product.seller_region}{product.seller_city ? `, ${product.seller_city}` : ''}</span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => setSelectedProduct(product)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Оставить заявку
              </Button>
            </Card>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Заявка на товар</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">{selectedProduct.name}</p>
              <p className="text-sm text-gray-600">{selectedProduct.seller_name}</p>
              <p className="text-lg font-bold text-green-600 mt-1">
                {selectedProduct.price.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            
            <form onSubmit={sendRequest} className="space-y-4">
              <div className="space-y-2">
                <Label>Ваше имя *</Label>
                <Input
                  value={requestForm.farmer_name}
                  onChange={(e) => setRequestForm({ ...requestForm, farmer_name: e.target.value })}
                  placeholder="Иван Иванов"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Телефон *</Label>
                <Input
                  value={requestForm.farmer_phone}
                  onChange={(e) => setRequestForm({ ...requestForm, farmer_phone: e.target.value })}
                  placeholder="+7 900 123-45-67"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Регион</Label>
                <Input
                  value={requestForm.farmer_region}
                  onChange={(e) => setRequestForm({ ...requestForm, farmer_region: e.target.value })}
                  placeholder="Московская область"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Сообщение</Label>
                <Textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  placeholder="Расскажите о ваших потребностях..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setSelectedProduct(null)} className="flex-1">
                  Отмена
                </Button>
                <Button type="submit" disabled={sending} className="flex-1 bg-green-600 hover:bg-green-700">
                  {sending ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
