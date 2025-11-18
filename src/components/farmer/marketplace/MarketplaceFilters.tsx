import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRODUCT_TYPES, EQUIPMENT_CATEGORIES, FERTILIZER_CATEGORIES } from '@/components/seller/products/ProductCategoriesConstants';

interface Props {
  search: string;
  typeFilter: string;
  categoryFilter: string;
  subcategoryFilter: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onSubcategoryFilterChange: (value: string) => void;
}

export default function MarketplaceFilters({
  search,
  typeFilter,
  categoryFilter,
  subcategoryFilter,
  onSearchChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onSubcategoryFilterChange
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по товарам и продавцам..."
            className="w-full"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value) => {
          onTypeFilterChange(value);
          onCategoryFilterChange('all');
          onSubcategoryFilterChange('all');
        }}>
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

      {typeFilter === 'equipment' && (
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={(value) => {
            onCategoryFilterChange(value);
            onSubcategoryFilterChange('all');
          }}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Выберите тип техники" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы техники</SelectItem>
              {EQUIPMENT_CATEGORIES.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {categoryFilter !== 'all' && (
            <Select value={subcategoryFilter} onValueChange={onSubcategoryFilterChange}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Выберите конкретную технику" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Вся техника категории</SelectItem>
                {EQUIPMENT_CATEGORIES
                  .find(c => c.value === categoryFilter)
                  ?.subcategories.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {typeFilter === 'fertilizer' && (
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={(value) => {
            onCategoryFilterChange(value);
            onSubcategoryFilterChange('all');
          }}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Выберите категорию удобрений" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории удобрений</SelectItem>
              {FERTILIZER_CATEGORIES.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {categoryFilter !== 'all' && (
            <Select value={subcategoryFilter} onValueChange={onSubcategoryFilterChange}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Выберите конкретное удобрение" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все удобрения категории</SelectItem>
                {FERTILIZER_CATEGORIES
                  .find(c => c.value === categoryFilter)
                  ?.subcategories.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
}
