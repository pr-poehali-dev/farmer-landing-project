import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const PRODUCT_TYPES = [
  { value: 'equipment', label: 'Сельхозтехника' },
  { value: 'fertilizer', label: 'Удобрения' },
  { value: 'seeds', label: 'Семена для посева' },
  { value: 'technology', label: 'Технологии' }
];

interface ProductDetailsModalProps {
  product: any;
  products: any[];
  requestForm: {
    farmer_name: string;
    farmer_phone: string;
    farmer_region: string;
    message: string;
  };
  sending: boolean;
  onClose: () => void;
  onFormChange: (updates: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onViewSeller: (seller: any) => void;
}

export default function ProductDetailsModal({
  product,
  products,
  requestForm,
  sending,
  onClose,
  onFormChange,
  onSubmit,
  onViewSeller
}: ProductDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 pr-8">{product.name}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              {product.photo_url && (
                <img src={product.photo_url} alt={product.name} className="w-full rounded-lg" />
              )}
              {product.photo_url_2 && (
                <img src={product.photo_url_2} alt="Фото 2" className="w-full rounded-lg" />
              )}
              {product.photo_url_3 && (
                <img src={product.photo_url_3} alt="Фото 3" className="w-full rounded-lg" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-3">
                  {PRODUCT_TYPES.find(t => t.value === product.type)?.label}
                </span>
                <div className="text-3xl font-bold text-green-600 mb-4">
                  {product.price.toLocaleString('ru-RU')} ₽
                </div>
                
                {product.description && (
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <h5 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <Icon name="FileText" size={16} />
                      Описание товара
                    </h5>
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h5 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Icon name="Store" size={20} className="text-blue-600" />
                  Информация о продавце
                </h5>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="Building2" size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{product.seller_name}</p>
                    </div>
                  </div>
                  
                  {product.seller_region && (
                    <div className="flex items-center gap-3 ml-13">
                      <Icon name="MapPin" size={18} className="text-blue-600" />
                      <span>
                        {product.seller_region}
                        {product.seller_city ? `, ${product.seller_city}` : ''}
                      </span>
                    </div>
                  )}
                  
                  <div className="ml-13">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewSeller({
                        id: product.seller_id,
                        name: product.seller_name,
                        region: product.seller_region,
                        city: product.seller_city
                      })}
                      className="w-full"
                    >
                      <Icon name="Package" size={16} className="mr-2" />
                      Все товары продавца
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h5 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Icon name="MessageSquare" size={20} className="text-green-600" />
                  Оставить заявку
                </h5>
                <p className="text-sm text-gray-600 mb-4">
                  Заполните форму, и продавец свяжется с вами для уточнения деталей
                </p>
                
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Ваше имя *</Label>
                      <Input
                        value={requestForm.farmer_name}
                        onChange={(e) => onFormChange({ farmer_name: e.target.value })}
                        placeholder="Иван Иванов"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Телефон *</Label>
                      <Input
                        value={requestForm.farmer_phone}
                        onChange={(e) => onFormChange({ farmer_phone: e.target.value })}
                        placeholder="+7 (999) 123-45-67"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Регион</Label>
                    <Input
                      value={requestForm.farmer_region}
                      onChange={(e) => onFormChange({ farmer_region: e.target.value })}
                      placeholder="Москва"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Сообщение</Label>
                    <Textarea
                      value={requestForm.message}
                      onChange={(e) => onFormChange({ message: e.target.value })}
                      placeholder="Дополнительная информация..."
                      rows={3}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={sending}>
                    {sending ? (
                      <>
                        <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={16} className="mr-2" />
                        Отправить заявку
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
