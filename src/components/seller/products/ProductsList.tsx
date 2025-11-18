import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { PRODUCT_TYPES } from './ProductCategoriesConstants';
import ProductEditForm from './ProductEditForm';
import { ProductForm } from '@/types/seller.types';

interface Props {
  products: any[];
  statusFilter: 'all' | 'active' | 'inactive';
  editingProduct: any | null;
  editForm: ProductForm;
  editEquipmentCategory: string;
  editEquipmentSubcategory: string;
  editFertilizerCategory: string;
  editFertilizerSubcategory: string;
  onStatusFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  onStartEdit: (product: any) => void;
  onEditFormChange: (updates: Partial<ProductForm>) => void;
  onEquipmentCategoryChange: (category: string) => void;
  onEquipmentSubcategoryChange: (subcategory: string) => void;
  onFertilizerCategoryChange: (category: string) => void;
  onFertilizerSubcategoryChange: (subcategory: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onToggleStatus: (product: any) => void;
  onDeleteProduct: (productId: string) => void;
}

export default function ProductsList({
  products,
  statusFilter,
  editingProduct,
  editForm,
  editEquipmentCategory,
  editEquipmentSubcategory,
  editFertilizerCategory,
  editFertilizerSubcategory,
  onStatusFilterChange,
  onStartEdit,
  onEditFormChange,
  onEquipmentCategoryChange,
  onEquipmentSubcategoryChange,
  onFertilizerCategoryChange,
  onFertilizerSubcategoryChange,
  onSaveEdit,
  onCancelEdit,
  onToggleStatus,
  onDeleteProduct
}: Props) {
  const activeProducts = products.filter(p => p.is_active !== false);
  const inactiveProducts = products.filter(p => p.is_active === false);
  
  const filteredProducts = statusFilter === 'all' ? products : 
    statusFilter === 'active' ? activeProducts : inactiveProducts;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Мои товары ({products.length})</h3>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusFilterChange('all')}
          >
            Все ({products.length})
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusFilterChange('active')}
          >
            Активные ({activeProducts.length})
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusFilterChange('inactive')}
          >
            Не опубликованные ({inactiveProducts.length})
          </Button>
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-sm">Нет товаров в этой категории</p>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`p-4 ${product.is_active === false ? 'bg-gray-100' : 'bg-gray-50'}`}>
              {editingProduct?.id === product.id ? (
                <ProductEditForm
                  editForm={editForm}
                  editEquipmentCategory={editEquipmentCategory}
                  editEquipmentSubcategory={editEquipmentSubcategory}
                  editFertilizerCategory={editFertilizerCategory}
                  editFertilizerSubcategory={editFertilizerSubcategory}
                  onEditFormChange={onEditFormChange}
                  onEquipmentCategoryChange={onEquipmentCategoryChange}
                  onEquipmentSubcategoryChange={onEquipmentSubcategoryChange}
                  onFertilizerCategoryChange={onFertilizerCategoryChange}
                  onFertilizerSubcategoryChange={onFertilizerSubcategoryChange}
                  onSave={onSaveEdit}
                  onCancel={onCancelEdit}
                />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {PRODUCT_TYPES.find(t => t.value === product.type)?.label}
                      </span>
                      {product.is_active === false && (
                        <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">Не опубликовано</span>
                      )}
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus(product)}
                      title={product.is_active === false ? 'Опубликовать' : 'Снять с публикации'}
                    >
                      <Icon name={product.is_active === false ? 'Eye' : 'EyeOff'} size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStartEdit(product)}
                    >
                      <Icon name="Pencil" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                      className="text-red-600"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
