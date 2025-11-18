import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ProductForm } from '@/types/seller.types';
import { PRODUCT_TYPES, EQUIPMENT_CATEGORIES, FERTILIZER_CATEGORIES } from './ProductCategoriesConstants';

interface Props {
  editForm: ProductForm;
  editEquipmentCategory: string;
  editEquipmentSubcategory: string;
  editFertilizerCategory: string;
  editFertilizerSubcategory: string;
  onEditFormChange: (updates: Partial<ProductForm>) => void;
  onEquipmentCategoryChange: (category: string) => void;
  onEquipmentSubcategoryChange: (subcategory: string) => void;
  onFertilizerCategoryChange: (category: string) => void;
  onFertilizerSubcategoryChange: (subcategory: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProductEditForm({
  editForm,
  editEquipmentCategory,
  editEquipmentSubcategory,
  editFertilizerCategory,
  editFertilizerSubcategory,
  onEditFormChange,
  onEquipmentCategoryChange,
  onEquipmentSubcategoryChange,
  onFertilizerCategoryChange,
  onFertilizerSubcategoryChange,
  onSave,
  onCancel
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Тип товара</Label>
          <Select value={editForm.type} onValueChange={(val) => {
            onEditFormChange({ type: val });
            onEquipmentCategoryChange('');
            onEquipmentSubcategoryChange('');
            onFertilizerCategoryChange('');
            onFertilizerSubcategoryChange('');
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
          <Label>Название</Label>
          <Input value={editForm.name} onChange={(e) => onEditFormChange({ name: e.target.value })} />
        </div>
      </div>

      {editForm.type === 'fertilizer' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Категория удобрений</Label>
            <Select value={editFertilizerCategory} onValueChange={(val) => {
              onFertilizerCategoryChange(val);
              onFertilizerSubcategoryChange('');
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
          
          {editFertilizerCategory && (
            <div className="space-y-2">
              <Label>Тип удобрения</Label>
              <Select value={editFertilizerSubcategory} onValueChange={onFertilizerSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип удобрения" />
                </SelectTrigger>
                <SelectContent>
                  {FERTILIZER_CATEGORIES
                    .find(c => c.value === editFertilizerCategory)
                    ?.subcategories.map(sub => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {editForm.type === 'equipment' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Категория техники</Label>
            <Select value={editEquipmentCategory} onValueChange={(val) => {
              onEquipmentCategoryChange(val);
              onEquipmentSubcategoryChange('');
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
          
          {editEquipmentCategory && (
            <div className="space-y-2">
              <Label>Тип техники</Label>
              <Select value={editEquipmentSubcategory} onValueChange={onEquipmentSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип техники" />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPMENT_CATEGORIES
                    .find(c => c.value === editEquipmentCategory)
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
          <Label>Цена</Label>
          <Input type="number" value={editForm.price} onChange={(e) => onEditFormChange({ price: parseFloat(e.target.value) || 0 })} />
        </div>
        <div className="space-y-2">
          <Label>URL фото 1</Label>
          <Input value={editForm.photo_url} onChange={(e) => onEditFormChange({ photo_url: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>URL фото 2</Label>
          <Input value={editForm.photo_url_2} onChange={(e) => onEditFormChange({ photo_url_2: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>URL фото 3</Label>
          <Input value={editForm.photo_url_3} onChange={(e) => onEditFormChange({ photo_url_3: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Описание</Label>
        <Textarea value={editForm.description} onChange={(e) => onEditFormChange({ description: e.target.value })} rows={3} />
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} size="sm">
          <Icon name="Check" size={16} className="mr-1" />
          Сохранить
        </Button>
        <Button onClick={onCancel} size="sm" variant="outline">
          Отмена
        </Button>
      </div>
    </div>
  );
}
