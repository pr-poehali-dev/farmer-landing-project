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
      <div className="aspect-video bg-gray-100 relative">
        {product.photo_url ? (
          <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Icon name="Package" size={48} className="text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
            {PRODUCT_TYPES.find(t => t.value === product.type)?.label}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Icon name="Store" size={14} />
          <span className="line-clamp-1">{product.seller_name}</span>
        </div>
        <p className="text-2xl font-bold text-green-600 mb-3">{product.price.toLocaleString('ru-RU')} ₽</p>
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        )}
        <Button className="w-full" size="sm">
          <Icon name="Eye" size={16} className="mr-2" />
          Подробнее
        </Button>
      </div>
    </Card>
  );
}
