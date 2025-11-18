import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const PRODUCT_TYPES = [
  { value: 'equipment', label: 'Сельхозтехника' },
  { value: 'fertilizer', label: 'Удобрения' },
  { value: 'seeds', label: 'Семена для посева' },
  { value: 'technology', label: 'Технологии' }
];

interface ProductCardProps {
  product: any;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: number, e?: React.MouseEvent) => void;
  onClick: () => void;
}

export default function ProductCard({ product, isFavorite = false, onToggleFavorite, onClick }: ProductCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col">
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
          {product.photo_url ? (
            <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Icon name="Package" size={48} className="text-gray-300" />
            </div>
          )}
          <button 
            onClick={(e) => onToggleFavorite?.(product.id, e)}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Icon name="Heart" size={16} className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"} />
          </button>
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="text-lg font-bold text-gray-900 mb-1">{product.price.toLocaleString('ru-RU')} ₽</p>
          <h3 className="text-sm text-gray-700 line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-auto">
            <Icon name="Store" size={12} />
            <span className="line-clamp-1">{product.seller_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}