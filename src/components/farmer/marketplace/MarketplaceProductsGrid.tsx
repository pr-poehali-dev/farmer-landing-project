import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ProductCard from './ProductCard';

interface Props {
  products: any[];
  favorites: number[];
  onProductClick: (product: any) => void;
  onToggleFavorite: (productId: number, e?: React.MouseEvent) => void;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function MarketplaceProductsGrid({
  products,
  favorites,
  onProductClick,
  onToggleFavorite,
  emptyIcon = 'Package',
  emptyTitle = 'Товары не найдены',
  emptyDescription = 'Попробуйте изменить фильтры или поисковый запрос'
}: Props) {
  if (products.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Icon name={emptyIcon as any} size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">{emptyTitle}</p>
        <p className="text-sm text-gray-400">{emptyDescription}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          isFavorite={favorites.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
          onClick={() => onProductClick(product)} 
        />
      ))}
    </div>
  );
}
