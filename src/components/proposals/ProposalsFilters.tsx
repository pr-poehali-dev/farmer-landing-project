import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { LIVESTOCK_DIRECTIONS } from '@/data/livestock';
import { CROP_PURPOSES } from '@/data/crops';

interface ProposalsFiltersProps {
  assetTypeFilter: 'all' | 'animal' | 'crop' | 'beehive';
  directionFilter: string;
  onAssetTypeChange: (value: 'all' | 'animal' | 'crop' | 'beehive') => void;
  onDirectionChange: (value: string) => void;
  onReset: () => void;
}

export function ProposalsFilters({
  assetTypeFilter,
  directionFilter,
  onAssetTypeChange,
  onDirectionChange,
  onReset
}: ProposalsFiltersProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Тип актива</label>
        <Select value={assetTypeFilter} onValueChange={onAssetTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="animal">🐄 Животные</SelectItem>
            <SelectItem value="crop">🌾 Культуры</SelectItem>
            <SelectItem value="beehive">🐝 Ульи</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(assetTypeFilter === 'animal' || assetTypeFilter === 'crop') && (
        <div>
          <label className="text-sm font-medium mb-2 block">
            {assetTypeFilter === 'animal' ? 'Направление' : 'Назначение'}
          </label>
          <Select value={directionFilter} onValueChange={onDirectionChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              {assetTypeFilter === 'animal' && LIVESTOCK_DIRECTIONS.map(d => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
              {assetTypeFilter === 'crop' && CROP_PURPOSES.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {(assetTypeFilter !== 'all' || directionFilter !== 'all') && (
        <div className="flex items-end">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="w-full"
          >
            <Icon name="X" size={16} className="mr-2" />
            Сбросить
          </Button>
        </div>
      )}
    </div>
  );
}
