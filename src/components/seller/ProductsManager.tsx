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
  { value: 'fertilizer', label: 'Удобрения' },
  { value: 'equipment', label: 'Техника' },
  { value: 'attachment', label: 'Навесное оборудование' },
  { value: 'other', label: 'Другое' }
];

export default function ProductsManager({ tier, products, productForm, onFormChange, onAddProduct, onDeleteProduct }: Props) {
  if (tier === 'none') {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Icon name="Lock" className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-bold mb-2">Управление товарами</h3>
          <p className="text-gray-600 mb-4">Добавляйте товары для показа фермерам</p>
          <p className="text-sm text-red-600">Доступно с подпиской Basic или Premium</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Package" className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-bold">Добавить товар</h2>
            <p className="text-sm text-gray-600">Заполните информацию о товаре</p>
          </div>
        </div>
        
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
              <Label>URL фото</Label>
              <Input
                value={productForm.photo_url}
                onChange={(e) => onFormChange({ photo_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
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
          
          <Button type="submit">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить товар
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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {PRODUCT_TYPES.find(t => t.value === product.type)?.label}
                      </span>
                      <h4 className="font-semibold">{product.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <p className="text-lg font-bold text-blue-600">{product.price.toLocaleString()} ₽</p>
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