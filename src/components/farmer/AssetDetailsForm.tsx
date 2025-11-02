import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  assetType: 'animal' | 'crop' | 'beehive';
  assetName: string;
  assetCount: string;
  assetDetails: string;
  onAssetTypeChange: (value: 'animal' | 'crop' | 'beehive') => void;
  onAssetNameChange: (value: string) => void;
  onAssetCountChange: (value: string) => void;
  onAssetDetailsChange: (value: string) => void;
}

export const AssetDetailsForm = ({
  assetType,
  assetName,
  assetCount,
  assetDetails,
  onAssetTypeChange,
  onAssetNameChange,
  onAssetCountChange,
  onAssetDetailsChange
}: Props) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-green-900">Детали актива</h3>
      
      <div>
        <Label htmlFor="assetType">Тип актива</Label>
        <Select value={assetType} onValueChange={(v) => onAssetTypeChange(v as 'animal' | 'crop' | 'beehive')}>
          <SelectTrigger id="assetType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="animal">Животное</SelectItem>
            <SelectItem value="crop">Культура</SelectItem>
            <SelectItem value="beehive">Улей</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="assetName">Название актива *</Label>
        <Input
          id="assetName"
          type="text"
          placeholder="Например: Корова Машка"
          value={assetName}
          onChange={(e) => onAssetNameChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="assetCount">Количество</Label>
        <Input
          id="assetCount"
          type="number"
          min="1"
          placeholder="1"
          value={assetCount}
          onChange={(e) => onAssetCountChange(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="assetDetails">Дополнительная информация</Label>
        <Textarea
          id="assetDetails"
          placeholder="Порода, возраст, особенности..."
          value={assetDetails}
          onChange={(e) => onAssetDetailsChange(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};
