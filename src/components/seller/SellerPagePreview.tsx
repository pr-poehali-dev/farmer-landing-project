import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/farmer/marketplace/ProductCard';

interface SellerPagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  seller: {
    id: number;
    name: string;
    description?: string;
    region?: string;
    city?: string;
    website?: string;
    vk_link?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  };
  products: any[];
}

export default function SellerPagePreview({ isOpen, onClose, seller, products }: SellerPagePreviewProps) {
  const activeProducts = products.filter(p => p.is_active !== false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Мой профиль (как видят фермеры)</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="Building2" size={32} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {seller.name || 'Название компании'}
                </h2>
                {seller.region && (
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <Icon name="MapPin" size={16} />
                    {seller.region}{seller.city ? `, ${seller.city}` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          {seller.description && (
            <Card className="p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Icon name="Info" size={16} />
                О компании
              </h3>
              <p className="text-gray-700 text-sm">{seller.description}</p>
            </Card>
          )}

          {(seller.phone || seller.website || seller.vk_link) && (
            <Card className="p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Icon name="Contact" size={16} />
                Контакты
              </h3>
              <div className="flex flex-wrap gap-3">
                {seller.phone && (
                  <a 
                    href={`tel:${seller.phone}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Icon name="Phone" size={14} />
                    {seller.phone}
                  </a>
                )}
                {seller.website && (
                  <a 
                    href={seller.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Icon name="Globe" size={14} />
                    Сайт
                  </a>
                )}
                {seller.vk_link && (
                  <a 
                    href={seller.vk_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Icon name="Share2" size={14} />
                    ВКонтакте
                  </a>
                )}
              </div>
            </Card>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 font-semibold">
              Всего активных товаров: {activeProducts.length}
            </p>
          </div>

          {activeProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Icon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">У вас пока нет опубликованных товаров</p>
              <p className="text-sm text-gray-400 mt-2">
                Добавьте товары во вкладке "Товары" и опубликуйте их
              </p>
            </Card>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Все товары</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
