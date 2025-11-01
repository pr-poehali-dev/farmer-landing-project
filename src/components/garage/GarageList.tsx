import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { GarageItem } from './GarageItemForm';

interface GarageListProps {
  items: GarageItem[];
  onRemove: (id: string) => void;
}

export default function GarageList({ items, onRemove }: GarageListProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'machinery': return 'Truck';
      case 'equipment': return 'Wrench';
      case 'fertilizer': return 'Sprout';
      default: return 'Package';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'machinery': return 'Техника';
      case 'equipment': return 'Оборудование';
      case 'fertilizer': return 'Удобрение';
      default: return '';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'machinery': return 'bg-blue-100 text-blue-800';
      case 'equipment': return 'bg-green-100 text-green-800';
      case 'fertilizer': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="Package" size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Ваш гараж пуст</p>
          <p className="text-sm text-muted-foreground mt-1">Добавьте технику, чтобы заработать баллы!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={getCategoryIcon(item.category)} size={20} className="text-farmer-green" />
                  <Badge className={getCategoryColor(item.category)}>
                    {getCategoryLabel(item.category)}
                  </Badge>
                  <span className="font-semibold text-gray-900">{item.type}</span>
                </div>
                <p className="text-lg font-medium text-gray-800 mb-1">{item.model}</p>
                {item.details && (
                  <p className="text-sm text-gray-600">{item.details}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Icon name="Trash2" size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
