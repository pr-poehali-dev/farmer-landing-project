import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Proposal {
  id: number;
  photo_url: string;
  description: string;
  price: number;
  shares: number;
  product_type: string;
  asset_type: string;
  asset_details: string;
  expected_product: string;
  update_frequency: string;
}

interface FarmerCardProps {
  farmer: {
    user_id: string;
    first_name: string;
    last_name: string;
    farm_name: string;
    region: string;
    country: string;
    proposals: Proposal[];
  };
  onSelectProposal?: (proposal: Proposal) => void;
}

export default function FarmerCard({ farmer, onSelectProposal }: FarmerCardProps) {
  const getProductTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      income: 'Доход',
      products: 'Продукция',
      patronage: 'Патронаж'
    };
    return types[type] || type;
  };

  const getUpdateFrequencyLabel = (freq: string) => {
    const frequencies: Record<string, string> = {
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
      quarterly: 'Ежеквартально',
      yearly: 'Ежегодно'
    };
    return frequencies[freq] || freq;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">
              {farmer.farm_name || 'Фермерское хозяйство'}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Icon name="User" size={16} />
              <span>{farmer.first_name} {farmer.last_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="MapPin" size={16} />
              <span>{farmer.region}, {farmer.country}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="Package" size={18} />
          Предложения
        </h3>
        {farmer.proposals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Info" size={48} className="mx-auto mb-2 opacity-50" />
            <p>Пока у этого фермера нет предложений</p>
          </div>
        ) : (
          <div className="space-y-3">
            {farmer.proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onSelectProposal?.(proposal)}
              >
                <div className="flex gap-3">
                  {proposal.photo_url && (
                    <img
                      src={proposal.photo_url}
                      alt={proposal.asset_details}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">
                          {proposal.asset_type} - {proposal.asset_details}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {getProductTypeLabel(proposal.product_type)}
                        </Badge>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-green-600">
                          {proposal.price.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {proposal.shares} {proposal.shares === 1 ? 'доля' : 'долей'}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {proposal.description}
                    </p>
                    {proposal.expected_product && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon name="Package2" size={14} />
                        <span>{proposal.expected_product}</span>
                        <span>•</span>
                        <span>{getUpdateFrequencyLabel(proposal.update_frequency)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
