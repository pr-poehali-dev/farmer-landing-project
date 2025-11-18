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
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="aspect-video bg-gray-100 relative" style={{ aspectRatio: '16/9', maxHeight: '100px' }}>
        {product.photo_url ? (
          <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Icon name="Package" size={20} className="text-gray-400" />
          </div>
        )}
        <div className="absolute top-1.5 right-1.5">
          <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[9px] font-medium">
            {PRODUCT_TYPES.find(t => t.value === product.type)?.label}
          </span>
        </div>
      </div>
      <div className="p-2.5">
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
          <Icon name="Store" size={11} />
          <span className="line-clamp-1">{product.seller_name}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-base font-bold text-green-600">{product.price.toLocaleString('ru-RU')} ₽</p>
          <Button size="sm" className="h-7 px-2.5">
            <Icon name="Eye" size={12} />
          </Button>
        </div>
      </div>
    </Card>
  );
}