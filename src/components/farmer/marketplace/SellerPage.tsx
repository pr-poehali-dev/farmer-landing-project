import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ProductCard from './ProductCard';

interface SellerPageProps {
  seller: any;
  products: any[];
  onBack: () => void;
  onProductClick: (product: any) => void;
}

export default function SellerPage({ seller, products, onBack, onProductClick }: SellerPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад к каталогу
        </Button>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="Building2" size={32} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{seller.name}</h2>
            {seller.region && (
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Icon name="MapPin" size={16} />
                {seller.region}{seller.city ? `, ${seller.city}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 font-semibold">
          Всего товаров: {products.length}
        </p>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">У продавца нет доступных товаров</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
          ))}
        </div>
      )}
    </div>
  );
}
