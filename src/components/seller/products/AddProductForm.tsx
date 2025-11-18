import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ProductForm } from '@/types/seller.types';
import { PRODUCT_TYPES, EQUIPMENT_CATEGORIES, FERTILIZER_CATEGORIES } from './ProductCategoriesConstants';

interface Props {
  productForm: ProductForm;
  onFormChange: (updates: Partial<ProductForm>) => void;
  onAddProduct: (e: React.FormEvent, equipmentCategory?: string, equipmentSubcategory?: string, fertilizerCategory?: string, fertilizerSubcategory?: string) => void;
}

export default function AddProductForm({ productForm, onFormChange, onAddProduct }: Props) {
  const [equipmentCategory, setEquipmentCategory] = useState<string>('');
  const [equipmentSubcategory, setEquipmentSubcategory] = useState<string>('');
  const [fertilizerCategory, setFertilizerCategory] = useState<string>('');
  const [fertilizerSubcategory, setFertilizerSubcategory] = useState<string>('');

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Package" className="text-blue-600" size={24} />
        <div>
          <h2 className="text-xl font-bold">Добавить товар</h2>
          <p className="text-sm text-gray-600">Заполните информацию о товаре</p>
        </div>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        onAddProduct(e, equipmentCategory, equipmentSubcategory, fertilizerCategory, fertilizerSubcategory);
        setEquipmentCategory('');
        setEquipmentSubcategory('');
        setFertilizerCategory('');
        setFertilizerSubcategory('');
      }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Тип товара *</Label>
            <Select value={productForm.type} onValueChange={(val) => {
              onFormChange({ type: val });
              setEquipmentCategory('');
              setEquipmentSubcategory('');
              setFertilizerCategory('');
              setFertilizerSubcategory('');
            }}>
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
        </div>

        {productForm.type === 'fertilizer' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Категория удобрений *</Label>
              <Select value={fertilizerCategory} onValueChange={(val) => {
                setFertilizerCategory(val);
                setFertilizerSubcategory('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {FERTILIZER_CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {fertilizerCategory && (
              <div className="space-y-2">
                <Label>Тип удобрения *</Label>
                <Select value={fertilizerSubcategory} onValueChange={setFertilizerSubcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип удобрения" />
                  </SelectTrigger>
                  <SelectContent>
                    {FERTILIZER_CATEGORIES
                      .find(c => c.value === fertilizerCategory)
                      ?.subcategories.map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {productForm.type === 'equipment' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Категория техники *</Label>
              <Select value={equipmentCategory} onValueChange={(val) => {
                setEquipmentCategory(val);
                setEquipmentSubcategory('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPMENT_CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {equipmentCategory && (
              <div className="space-y-2">
                <Label>Тип техники *</Label>
                <Select value={equipmentSubcategory} onValueChange={setEquipmentSubcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип техники" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_CATEGORIES
                      .find(c => c.value === equipmentCategory)
                      ?.subcategories.map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          
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
        
        <Button 
          type="submit"
          disabled={
            (productForm.type === 'equipment' && (!equipmentCategory || !equipmentSubcategory)) ||
            (productForm.type === 'fertilizer' && (!fertilizerCategory || !fertilizerSubcategory))
          }
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить товар
        </Button>
      </form>
    </Card>
  );
}
