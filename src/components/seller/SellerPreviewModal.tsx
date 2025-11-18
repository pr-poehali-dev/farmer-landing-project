import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SellerPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: {
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
}

export default function SellerPreviewModal({ isOpen, onClose, seller }: SellerPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Как вас видят фермеры</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-6">
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

          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Icon name="Info" size={20} className="text-blue-600" />
                О компании
              </h3>
              <p className="text-gray-700">
                {seller.description || 'Описание компании не заполнено'}
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Icon name="Contact" size={20} className="text-blue-600" />
                Контактная информация
              </h3>
              
              <div className="space-y-2">
                {seller.first_name && seller.last_name && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Icon name="User" size={16} className="text-gray-500" />
                    <span>{seller.first_name} {seller.last_name}</span>
                  </div>
                )}
                
                {seller.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Icon name="Phone" size={16} className="text-gray-500" />
                    <a href={`tel:${seller.phone}`} className="hover:text-blue-600 transition-colors">
                      {seller.phone}
                    </a>
                  </div>
                )}
                
                {seller.website && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Icon name="Globe" size={16} className="text-gray-500" />
                    <a 
                      href={seller.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {seller.website}
                    </a>
                  </div>
                )}
                
                {seller.vk_link && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Icon name="Share2" size={16} className="text-gray-500" />
                    <a 
                      href={seller.vk_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      ВКонтакте
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Важно:</strong> Фермеры видят эту информацию когда просматривают ваш профиль через маркетплейс.
              Убедитесь, что все контактные данные актуальны.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
