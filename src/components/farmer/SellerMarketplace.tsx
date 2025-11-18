import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import ProductDetailsModal from './marketplace/ProductDetailsModal';
import SellerPage from './marketplace/SellerPage';
import MarketplaceFilters from './marketplace/MarketplaceFilters';
import MarketplaceRequestsTab from './marketplace/MarketplaceRequestsTab';
import MarketplaceProductsGrid from './marketplace/MarketplaceProductsGrid';
import { EQUIPMENT_CATEGORIES, FERTILIZER_CATEGORIES } from '@/components/seller/products/ProductCategoriesConstants';

const SELLER_API = 'https://functions.poehali.dev/cc24321a-77b4-44ce-9ae2-7fb7efee6660';

export default function SellerMarketplace() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'requests' | 'favorites'>('products');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');
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
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    loadProducts();
    loadMyRequests();
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('marketplace_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (productId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('marketplace_favorites', JSON.stringify(newFavorites));
      toast.success(prev.includes(productId) ? 'Удалено из избранного' : 'Добавлено в избранное');
      return newFavorites;
    });
  };

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
    
    let matchesCategory = true;
    let matchesSubcategory = true;
    
    if (typeFilter === 'equipment' && p.type === 'equipment') {
      if (categoryFilter !== 'all') {
        const category = EQUIPMENT_CATEGORIES.find(c => c.value === categoryFilter);
        if (category) {
          matchesCategory = category.subcategories.some(sub => 
            p.name?.toLowerCase().includes(sub.toLowerCase()) ||
            p.description?.toLowerCase().includes(sub.toLowerCase())
          );
        }
      }
      
      if (subcategoryFilter !== 'all') {
        matchesSubcategory = 
          p.name?.toLowerCase().includes(subcategoryFilter.toLowerCase()) ||
          p.description?.toLowerCase().includes(subcategoryFilter.toLowerCase());
      }
    }
    
    if (typeFilter === 'fertilizer' && p.type === 'fertilizer') {
      if (categoryFilter !== 'all') {
        const category = FERTILIZER_CATEGORIES.find(c => c.value === categoryFilter);
        if (category) {
          matchesCategory = category.subcategories.some(sub => 
            p.name?.toLowerCase().includes(sub.toLowerCase()) ||
            p.description?.toLowerCase().includes(sub.toLowerCase())
          );
        }
      }
      
      if (subcategoryFilter !== 'all') {
        matchesSubcategory = 
          p.name?.toLowerCase().includes(subcategoryFilter.toLowerCase()) ||
          p.description?.toLowerCase().includes(subcategoryFilter.toLowerCase());
      }
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesSubcategory;
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
          variant={activeTab === 'favorites' ? 'default' : 'outline'}
          onClick={() => setActiveTab('favorites')}
          className="flex items-center gap-2"
        >
          <Icon name="Heart" size={16} />
          Избранное {favorites.length > 0 && `(${favorites.length})`}
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

      {activeTab === 'products' || activeTab === 'favorites' ? (
        <>
          <MarketplaceFilters
            search={search}
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            subcategoryFilter={subcategoryFilter}
            onSearchChange={setSearch}
            onTypeFilterChange={setTypeFilter}
            onCategoryFilterChange={setCategoryFilter}
            onSubcategoryFilterChange={setSubcategoryFilter}
          />

          <MarketplaceProductsGrid
            products={activeTab === 'favorites' ? filteredProducts.filter(p => favorites.includes(p.id)) : filteredProducts}
            favorites={favorites}
            onProductClick={setSelectedProduct}
            onToggleFavorite={toggleFavorite}
            emptyIcon={activeTab === 'favorites' ? 'Heart' : 'Package'}
            emptyTitle={activeTab === 'favorites' ? 'В избранном пока ничего нет' : 'Товары не найдены'}
            emptyDescription={activeTab === 'favorites' 
              ? 'Нажмите на сердечко на карточке товара, чтобы добавить его в избранное' 
              : 'Попробуйте изменить фильтры или поисковый запрос'}
          />
        </>
      ) : (
        <MarketplaceRequestsTab requests={myRequests} />
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
