import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { PROPOSAL_TYPES } from './proposal-types';

interface Props {
  value: 'income' | 'products' | 'patronage';
  onChange: (value: 'income' | 'products' | 'patronage') => void;
}

export const ProposalTypeSelector = ({ value, onChange }: Props) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Тип предложения</Label>
      <div className="space-y-3">
        {PROPOSAL_TYPES.map(type => (
          <Card 
            key={type.value}
            className={`p-4 cursor-pointer transition-all ${
              value === type.value 
                ? 'border-2 border-green-600 bg-green-50' 
                : 'border hover:border-green-300'
            }`}
            onClick={() => onChange(type.value as 'income' | 'products' | 'patronage')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                value === type.value ? 'border-green-600' : 'border-gray-300'
              }`}>
                {value === type.value && (
                  <div className="w-3 h-3 rounded-full bg-green-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name={type.icon as any} size={20} className="text-green-600" />
                  <Label className="font-bold cursor-pointer">
                    {type.label}
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                <p className="text-xs text-green-700 italic">{type.hint}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};