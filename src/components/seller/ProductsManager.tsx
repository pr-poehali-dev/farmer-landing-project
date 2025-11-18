import { useState } from 'react';
import { ProductForm } from '@/types/seller.types';
import AddProductForm from './products/AddProductForm';
import ProductsList from './products/ProductsList';

interface Props {
  tier: string;
  products: any[];
  productForm: ProductForm;
  onFormChange: (updates: Partial<ProductForm>) => void;
  onAddProduct: (e: React.FormEvent, equipmentCategory?: string, equipmentSubcategory?: string, fertilizerCategory?: string, fertilizerSubcategory?: string) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProduct: (productId: string, updates: any) => void;
}

export default function ProductsManager({ tier, products, productForm, onFormChange, onAddProduct, onDeleteProduct, onUpdateProduct }: Props) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<ProductForm>({
    type: 'fertilizer',
    name: '',
    price: 0,
    description: '',
    photo_url: '',
    photo_url_2: '',
    photo_url_3: '',
    target_audience: []
  });
  const [editEquipmentCategory, setEditEquipmentCategory] = useState<string>('');
  const [editEquipmentSubcategory, setEditEquipmentSubcategory] = useState<string>('');
  const [editFertilizerCategory, setEditFertilizerCategory] = useState<string>('');
  const [editFertilizerSubcategory, setEditFertilizerSubcategory] = useState<string>('');

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      type: product.type,
      name: product.name,
      price: product.price,
      description: product.description || '',
      photo_url: product.photo_url || '',
      photo_url_2: product.photo_url_2 || '',
      photo_url_3: product.photo_url_3 || '',
      target_audience: product.target_audience || []
    });
    setEditEquipmentCategory(product.equipment_category || '');
    setEditEquipmentSubcategory(product.equipment_subcategory || '');
    setEditFertilizerCategory(product.fertilizer_category || '');
    setEditFertilizerSubcategory(product.fertilizer_subcategory || '');
  };

  const saveEdit = () => {
    if (editingProduct) {
      const updates = {
        ...editForm,
        equipment_category: editForm.type === 'equipment' ? editEquipmentCategory : null,
        equipment_subcategory: editForm.type === 'equipment' ? editEquipmentSubcategory : null,
        fertilizer_category: editForm.type === 'fertilizer' ? editFertilizerCategory : null,
        fertilizer_subcategory: editForm.type === 'fertilizer' ? editFertilizerSubcategory : null
      };
      onUpdateProduct(editingProduct.id, updates);
      setEditingProduct(null);
    }
  };

  const toggleStatus = (product: any) => {
    onUpdateProduct(product.id, { is_active: !product.is_active });
  };

  return (
    <div className="space-y-6">
      <AddProductForm
        productForm={productForm}
        onFormChange={onFormChange}
        onAddProduct={onAddProduct}
      />
      
      <ProductsList
        products={products}
        statusFilter={statusFilter}
        editingProduct={editingProduct}
        editForm={editForm}
        editEquipmentCategory={editEquipmentCategory}
        editEquipmentSubcategory={editEquipmentSubcategory}
        editFertilizerCategory={editFertilizerCategory}
        editFertilizerSubcategory={editFertilizerSubcategory}
        onStatusFilterChange={setStatusFilter}
        onStartEdit={startEdit}
        onEditFormChange={(updates) => setEditForm({ ...editForm, ...updates })}
        onEquipmentCategoryChange={setEditEquipmentCategory}
        onEquipmentSubcategoryChange={setEditEquipmentSubcategory}
        onFertilizerCategoryChange={setEditFertilizerCategory}
        onFertilizerSubcategoryChange={setEditFertilizerSubcategory}
        onSaveEdit={saveEdit}
        onCancelEdit={() => setEditingProduct(null)}
        onToggleStatus={toggleStatus}
        onDeleteProduct={onDeleteProduct}
      />
    </div>
  );
}
