import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ProductForm } from '@/types/seller.types';

interface Props {
  tier: string;
  products: any[];
  productForm: ProductForm;
  onFormChange: (updates: Partial<ProductForm>) => void;
  onAddProduct: (e: React.FormEvent) => void;
  onDeleteProduct: (productId: string) => void;
}

const PRODUCT_TYPES = [
  { value: 'equipment', label: 'Сельхозтехника' },
  { value: 'fertilizer', label: 'Удобрения' },
  { value: 'seeds', label: 'Семена для посева' }
];

const FREE_PRODUCTS_LIMIT = 10;

export default function ProductsManager({ tier, products, productForm, onFormChange, onAddProduct, onDeleteProduct }: Props) {
  const isFreeUser = tier === 'none';
  const canAddProduct = isFreeUser ? products.length < FREE_PRODUCTS_LIMIT : true;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="Package" className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-bold">Добавить товар</h2>
              <p className="text-sm text-gray-600">Заполните информацию о товаре</p>
            </div>
          </div>
          {isFreeUser && (
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {products.length} / {FREE_PRODUCTS_LIMIT}
              </p>
              <p className="text-xs text-gray-500">бесплатных карточек</p>
            </div>
          )}
        </div>
        
        {isFreeUser && products.length >= FREE_PRODUCTS_LIMIT && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-3">
              <Icon name="AlertCircle" className="text-amber-600 flex-shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 mb-1">Лимит бесплатных карточек исчерпан</p>
                <p className="text-amber-800">Вы можете удалить существующие карточки, чтобы добавить новые, или оформить подписку для безлимитного добавления товаров.</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={onAddProduct} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Тип товара *</Label>
              <Select value={productForm.type} onValueChange={(val) => onFormChange({ type: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Название товара *</Label>
              <Input
                value={productForm.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                placeholder="Минеральное удобрение NPK"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Цена (руб.) *</Label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) => onFormChange({ price: parseFloat(e.target.value) || 0 })}
                placeholder="5000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>URL фото 1</Label>
              <Input
                value={productForm.photo_url}
                onChange={(e) => onFormChange({ photo_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label>URL фото 2 (опционально)</Label>
              <Input
                value={productForm.photo_url_2}
                onChange={(e) => onFormChange({ photo_url_2: e.target.value })}
                placeholder="https://example.com/image2.jpg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>URL фото 3 (опционально)</Label>
              <Input
                value={productForm.photo_url_3}
                onChange={(e) => onFormChange({ photo_url_3: e.target.value })}
                placeholder="https://example.com/image3.jpg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Описание товара</Label>
            <Textarea
              value={productForm.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              placeholder="Подробное описание товара..."
              rows={3}
            />
          </div>
          
          <Button type="submit" disabled={!canAddProduct}>
            <Icon name="Plus" size={16} className="mr-2" />
            {canAddProduct ? 'Добавить товар' : 'Лимит исчерпан'}
          </Button>
        </form>
      </Card>
      
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Мои товары ({products.length})</h3>
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm">У вас пока нет товаров</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <Card key={product.id} className="p-4 bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {PRODUCT_TYPES.find(t => t.value === product.type)?.label}
                      </span>
                      <h4 className="font-semibold">{product.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <p className="text-lg font-bold text-blue-600 mb-3">{product.price.toLocaleString()} ₽</p>
                    {(product.photo_url || product.photo_url_2 || product.photo_url_3) && (
                      <div className="flex gap-2 flex-wrap">
                        {product.photo_url && (
                          <img src={product.photo_url} alt="Фото 1" className="w-20 h-20 object-cover rounded border" />
                        )}
                        {product.photo_url_2 && (
                          <img src={product.photo_url_2} alt="Фото 2" className="w-20 h-20 object-cover rounded border" />
                        )}
                        {product.photo_url_3 && (
                          <img src={product.photo_url_3} alt="Фото 3" className="w-20 h-20 object-cover rounded border" />
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteProduct(product.id)}
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