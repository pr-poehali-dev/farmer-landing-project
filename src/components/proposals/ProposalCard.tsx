import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { LIVESTOCK_TYPES, LIVESTOCK_DIRECTIONS, LIVESTOCK_BREEDS } from '@/data/livestock';
import { CROP_TYPES, CROP_VARIETIES, CROP_PURPOSES } from '@/data/crops';

interface Proposal {
  id: number;
  description: string;
  price: number;
  shares: number;
  type: string;
  asset: {
    id?: string;
    name: string;
    type: string;
    count?: number;
    details?: string;
    livestock_type?: string;
    livestock_breed?: string;
    livestock_direction?: string;
    crop_type?: string;
    crop_variety?: string;
    crop_purpose?: string;
  };
  expected_product?: string;
  update_frequency?: string;
  farmer_name: string;
  farm_name: string;
  region: string;
  investors_count: number;
  farmer_id?: number;
}

interface ProposalCardProps {
  proposal: Proposal;
  onSelect: () => void;
}

const getLivestockLabel = (value: string, type: 'type' | 'breed' | 'direction') => {
  if (type === 'type') {
    return LIVESTOCK_TYPES.find(t => t.value === value)?.label || value;
  }
  if (type === 'direction') {
    return LIVESTOCK_DIRECTIONS.find(d => d.value === value)?.label || value;
  }
  const allBreeds = Object.values(LIVESTOCK_BREEDS).flat();
  return allBreeds.find(b => b.value === value)?.label || value;
};

const getCropLabel = (value: string, type: 'type' | 'variety' | 'purpose') => {
  if (type === 'type') {
    return CROP_TYPES.find(t => t.value === value)?.label || value;
  }
  if (type === 'purpose') {
    return CROP_PURPOSES.find(p => p.value === value)?.label || value;
  }
  const allVarieties = Object.values(CROP_VARIETIES).flat();
  return allVarieties.find(v => v.value === value)?.label || value;
};

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'income': return 'TrendingUp';
    case 'products': return 'ShoppingBag';
    case 'patronage': return 'Eye';
    default: return 'Circle';
  }
};

const getTypeLabel = (type: string) => {
  switch(type) {
    case 'income': return 'Доход';
    case 'products': return 'Продукт';
    case 'patronage': return 'Патронаж';
    default: return type;
  }
};

export function ProposalCard({ proposal, onSelect }: ProposalCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon 
            name={getTypeIcon(proposal.type)} 
            size={16} 
            className="text-farmer-orange" 
          />
          <span className="text-xs font-medium text-farmer-orange uppercase">
            {getTypeLabel(proposal.type)}
          </span>
        </div>

        <h3 className="font-bold text-lg mb-1">
          {proposal.asset.name}
        </h3>
        
        {proposal.asset.type === 'animal' && (proposal.asset.livestock_type || proposal.asset.livestock_breed || proposal.asset.livestock_direction) && (
          <div className="flex flex-wrap gap-1 mb-2 text-xs">
            {proposal.asset.livestock_type && (
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                🐄 {getLivestockLabel(proposal.asset.livestock_type, 'type')}
              </span>
            )}
            {proposal.asset.livestock_breed && (
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                📋 {getLivestockLabel(proposal.asset.livestock_breed, 'breed')}
              </span>
            )}
            {proposal.asset.livestock_direction && (
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">
                🎯 {getLivestockLabel(proposal.asset.livestock_direction, 'direction')}
              </span>
            )}
          </div>
        )}
        
        {proposal.asset.type === 'crop' && (proposal.asset.crop_type || proposal.asset.crop_variety || proposal.asset.crop_purpose) && (
          <div className="flex flex-wrap gap-1 mb-2 text-xs">
            {proposal.asset.crop_type && (
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                🌾 {getCropLabel(proposal.asset.crop_type, 'type')}
              </span>
            )}
            {proposal.asset.crop_variety && (
              <span className="px-2 py-0.5 rounded bg-lime-100 text-lime-800">
                🌱 {getCropLabel(proposal.asset.crop_variety, 'variety')}
              </span>
            )}
            {proposal.asset.crop_purpose && (
              <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                🎯 {getCropLabel(proposal.asset.crop_purpose, 'purpose')}
              </span>
            )}
          </div>
        )}
        
        <button
          onClick={() => proposal.farmer_id && window.open(`/profile/${proposal.farmer_id}`, '_blank')}
          className="text-sm text-gray-600 mb-1 hover:text-farmer-orange transition-colors flex items-center gap-1"
        >
          <Icon name="User" size={14} />
          {proposal.farmer_name} • {proposal.region}
        </button>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {proposal.description}
        </p>

        {proposal.expected_product && (
          <div className="mb-3 p-2 bg-green-50 rounded">
            <p className="text-sm text-green-800">
              <Icon name="Gift" size={14} className="inline mr-1" />
              {proposal.expected_product}
            </p>
          </div>
        )}

        {proposal.update_frequency && (
          <div className="mb-3 p-2 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <Icon name="Video" size={14} className="inline mr-1" />
              Обновления: {proposal.update_frequency === 'weekly' ? 'Еженедельно' : 'Ежемесячно'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 pt-3 border-t">
          <div>
            <div className="text-2xl font-bold text-farmer-green">
              {proposal.price.toLocaleString()} ₽
            </div>
            <div className="text-xs text-gray-500">
              {proposal.type === 'patronage' ? 'в месяц' : 'за долю'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Долей: {proposal.shares}
            </div>
            <div className="text-xs text-gray-500">
              Заявок: {proposal.investors_count}
            </div>
          </div>
        </div>

        <Button
          onClick={onSelect}
          className="w-full bg-farmer-green hover:bg-farmer-green-dark"
        >
          <Icon name="Heart" size={16} className="mr-2" />
          Оставить заявку
        </Button>
      </div>
    </Card>
  );
}
