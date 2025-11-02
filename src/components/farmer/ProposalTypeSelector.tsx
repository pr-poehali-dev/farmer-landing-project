import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
      <RadioGroup value={value} onValueChange={(v) => onChange(v as 'income' | 'products' | 'patronage')}>
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
              <RadioGroupItem value={type.value} id={type.value} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name={type.icon as any} size={20} className="text-green-600" />
                  <Label htmlFor={type.value} className="font-bold cursor-pointer">
                    {type.label}
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                <p className="text-xs text-green-700 italic">{type.hint}</p>
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
};