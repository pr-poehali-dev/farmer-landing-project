import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Props {
  farmer: any;
  isOpen: boolean;
  onClose: () => void;
  tier: string;
}

export default function FarmerDetailModal({ farmer, isOpen, onClose, tier }: Props) {
  if (!farmer) return null;

  const totalArea = farmer.assets?.reduce((sum: number, asset: any) => sum + (asset.area || 0), 0) || 0;
  const crops = farmer.assets?.filter((a: any) => a.type === 'crop') || [];
  const animals = farmer.assets?.filter((a: any) => a.type === 'animal') || [];
  const beehives = farmer.assets?.filter((a: any) => a.type === 'beehive') || [];

  const hasBasicAccess = tier === 'basic' || tier === 'premium';
  const hasPremiumAccess = tier === 'premium';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Icon name="User" className="text-white" size={24} />
            </div>
            <div>
              <div className="text-xl font-bold">{farmer.name}</div>
              {farmer.farm_name && (
                <div className="text-sm text-gray-600 font-normal">{farmer.farm_name}</div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Основная информация */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Icon name="MapPin" className="text-blue-600" size={18} />
              Основная информация
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {farmer.region && (
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Map" size={16} className="text-gray-500" />
                  <span className="text-gray-600">Регион:</span>
                  <span className="font-semibold">{farmer.region}</span>
                </div>
              )}
              {farmer.city && (
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="MapPin" size={16} className="text-gray-500" />
                  <span className="text-gray-600">Населенный пункт:</span>
                  <span className="font-semibold">{farmer.city}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Sprout" size={16} className="text-gray-500" />
                <span className="text-gray-600">Общая площадь:</span>
                <span className="font-semibold">{totalArea} га</span>
              </div>
            </div>
          </Card>

          {/* Растениеводство */}
          {crops.length > 0 && (
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Sprout" className="text-green-600" size={18} />
                Растениеводство
              </h3>
              <div className="space-y-2">
                {crops.map((asset: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Leaf" size={16} className="text-green-600" />
                      <span className="font-semibold">{asset.crop_type || asset.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {asset.area} га
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Животноводство */}
          {animals.length > 0 && (
            <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Beef" className="text-amber-600" size={18} />
                Животноводство
              </h3>
              <div className="space-y-2">
                {animals.map((asset: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Beef" size={16} className="text-amber-600" />
                      <span className="font-semibold">{asset.livestock_type || asset.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {asset.quantity} голов
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Пчеловодство */}
          {beehives.length > 0 && (
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Bug" className="text-yellow-600" size={18} />
                Пчеловодство
              </h3>
              <div className="space-y-2">
                {beehives.map((asset: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Bug" size={16} className="text-yellow-600" />
                      <span className="font-semibold">{asset.name || 'Пасека'}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {asset.quantity} ульев
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Контакты */}
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Icon name="Phone" className="text-purple-600" size={18} />
              Контактная информация
            </h3>
            
            {!hasBasicAccess ? (
              <div className="text-center py-8">
                <Icon name="Lock" size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 text-sm mb-4">
                  Контакты доступны с подпиской<br />Basic или Premium
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {farmer.phone && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Icon name="Phone" size={18} className="text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-500">Телефон</div>
                      <a href={`tel:${farmer.phone}`} className="font-semibold text-purple-600 hover:underline">
                        {farmer.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {farmer.email && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Icon name="Mail" size={18} className="text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <a href={`mailto:${farmer.email}`} className="font-semibold text-purple-600 hover:underline">
                        {farmer.email}
                      </a>
                    </div>
                  </div>
                )}

                {farmer.telegram_username && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Icon name="Send" size={18} className="text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-500">Telegram</div>
                      <a 
                        href={`https://t.me/${farmer.telegram_username.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-purple-600 hover:underline"
                      >
                        @{farmer.telegram_username.replace('@', '')}
                      </a>
                    </div>
                  </div>
                )}

                {!farmer.phone && !farmer.email && !farmer.telegram_username && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Контакты не указаны фермером
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Заметки (только Premium) */}
          {hasPremiumAccess && (
            <Card className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="FileText" className="text-slate-600" size={18} />
                Мои заметки о фермере
              </h3>
              <textarea
                placeholder="Добавьте заметки о сотрудничестве с этим фермером..."
                className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <div className="mt-2 flex justify-end">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                  Сохранить заметку
                </button>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
