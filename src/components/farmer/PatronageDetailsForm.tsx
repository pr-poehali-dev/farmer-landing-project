import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UPDATE_FREQUENCIES } from './proposal-types';

interface Props {
  updateFrequency: string;
  onUpdateFrequencyChange: (value: string) => void;
}

export const PatronageDetailsForm = ({ updateFrequency, onUpdateFrequencyChange }: Props) => {
  return (
    <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <h3 className="font-semibold text-purple-900">Детали опеки</h3>
      
      <div>
        <Label htmlFor="updateFrequency">Частота отчётов</Label>
        <Select value={updateFrequency} onValueChange={onUpdateFrequencyChange}>
          <SelectTrigger id="updateFrequency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UPDATE_FREQUENCIES.map(freq => (
              <SelectItem key={freq.value} value={freq.value}>
                {freq.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-purple-700 mt-1">
          Как часто вы будете отправлять фото и видео
        </p>
      </div>
    </div>
  );
};
