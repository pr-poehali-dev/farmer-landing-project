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
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="aspect-video bg-gray-100 relative" style={{ aspectRatio: '16/9', maxHeight: '120px' }}>
        {product.photo_url ? (
          <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Icon name="Package" size={24} className="text-gray-400" />
          </div>
        )}
        <div className="absolute top-1 right-1">
          <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded text-[10px]">
            {PRODUCT_TYPES.find(t => t.value === product.type)?.label}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1.5 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1.5">
          <Icon name="Store" size={12} />
          <span className="line-clamp-1">{product.seller_name}</span>
        </div>
        <p className="text-lg font-bold text-green-600 mb-2">{product.price.toLocaleString('ru-RU')} ₽</p>
        <Button className="w-full" size="sm">
          <Icon name="Eye" size={14} className="mr-1.5" />
          <span className="text-xs">Подробнее</span>
        </Button>
      </div>
    </Card>
  );
}