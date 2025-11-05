import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LIVESTOCK_TYPES, LIVESTOCK_DIRECTIONS, LIVESTOCK_BREEDS, LivestockType } from '@/data/livestock';
import { CROP_TYPES, CROP_VARIETIES, CROP_PURPOSES, CropType } from '@/data/crops';

interface Props {
  assetType: 'animal' | 'crop' | 'beehive';
  assetName: string;
  assetCount: string;
  assetDetails: string;
  onAssetTypeChange: (value: 'animal' | 'crop' | 'beehive') => void;
  onAssetNameChange: (value: string) => void;
  onAssetCountChange: (value: string) => void;
  onAssetDetailsChange: (value: string) => void;
  onLivestockDataChange?: (data: { type: string; breed: string; direction: string }) => void;
  onCropDataChange?: (data: { type: string; variety: string; purpose: string }) => void;
}

export const AssetDetailsForm = ({
  assetType,
  assetName,
  assetCount,
  assetDetails,
  onAssetTypeChange,
  onAssetNameChange,
  onAssetCountChange,
  onAssetDetailsChange,
  onLivestockDataChange,
  onCropDataChange
}: Props) => {
  const [livestockType, setLivestockType] = useState<string>('');
  const [livestockBreed, setLivestockBreed] = useState<string>('');
  const [livestockDirection, setLivestockDirection] = useState<string>('');
  
  const [cropType, setCropType] = useState<string>('');
  const [cropVariety, setCropVariety] = useState<string>('');
  const [cropPurpose, setCropPurpose] = useState<string>('');

  useEffect(() => {
    if (assetType !== 'animal') {
      setLivestockType('');
      setLivestockBreed('');
      setLivestockDirection('');
    }
    if (assetType !== 'crop') {
      setCropType('');
      setCropVariety('');
      setCropPurpose('');
    }
  }, [assetType]);

  useEffect(() => {
    setLivestockBreed('');
  }, [livestockType]);
  
  useEffect(() => {
    setCropVariety('');
  }, [cropType]);

  useEffect(() => {
    if (onLivestockDataChange) {
      onLivestockDataChange({
        type: livestockType,
        breed: livestockBreed,
        direction: livestockDirection
      });
    }
  }, [livestockType, livestockBreed, livestockDirection, onLivestockDataChange]);
  
  useEffect(() => {
    if (onCropDataChange) {
      onCropDataChange({
        type: cropType,
        variety: cropVariety,
        purpose: cropPurpose
      });
    }
  }, [cropType, cropVariety, cropPurpose, onCropDataChange]);

  const availableBreeds = livestockType ? LIVESTOCK_BREEDS[livestockType as LivestockType] || [] : [];
  const availableVarieties = cropType ? CROP_VARIETIES[cropType as CropType] || [] : [];

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

      {assetType === 'animal' && (
        <>
          <div>
            <Label htmlFor="livestockType">Вид животного *</Label>
            <Select value={livestockType} onValueChange={setLivestockType}>
              <SelectTrigger id="livestockType">
                <SelectValue placeholder="Выберите вид" />
              </SelectTrigger>
              <SelectContent>
                {LIVESTOCK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {livestockType && availableBreeds.length > 0 && (
            <div>
              <Label htmlFor="livestockBreed">Порода</Label>
              <Select value={livestockBreed} onValueChange={setLivestockBreed}>
                <SelectTrigger id="livestockBreed">
                  <SelectValue placeholder="Выберите породу" />
                </SelectTrigger>
                <SelectContent>
                  {availableBreeds.map((breed) => (
                    <SelectItem key={breed.value} value={breed.value}>
                      {breed.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="livestockDirection">Направление</Label>
            <Select value={livestockDirection} onValueChange={setLivestockDirection}>
              <SelectTrigger id="livestockDirection">
                <SelectValue placeholder="Выберите направление" />
              </SelectTrigger>
              <SelectContent>
                {LIVESTOCK_DIRECTIONS.map((direction) => (
                  <SelectItem key={direction.value} value={direction.value}>
                    {direction.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {assetType === 'crop' && (
        <>
          <div>
            <Label htmlFor="cropType">Вид культуры *</Label>
            <Select value={cropType} onValueChange={setCropType}>
              <SelectTrigger id="cropType">
                <SelectValue placeholder="Выберите культуру" />
              </SelectTrigger>
              <SelectContent>
                {CROP_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {cropType && availableVarieties.length > 0 && (
            <div>
              <Label htmlFor="cropVariety">Сорт/тип</Label>
              <Select value={cropVariety} onValueChange={setCropVariety}>
                <SelectTrigger id="cropVariety">
                  <SelectValue placeholder="Выберите сорт" />
                </SelectTrigger>
                <SelectContent>
                  {availableVarieties.map((variety) => (
                    <SelectItem key={variety.value} value={variety.value}>
                      {variety.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="cropPurpose">Назначение</Label>
            <Select value={cropPurpose} onValueChange={setCropPurpose}>
              <SelectTrigger id="cropPurpose">
                <SelectValue placeholder="Выберите назначение" />
              </SelectTrigger>
              <SelectContent>
                {CROP_PURPOSES.map((purpose) => (
                  <SelectItem key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div>
        <Label htmlFor="assetName">Название актива *</Label>
        <Input
          id="assetName"
          type="text"
          placeholder={assetType === 'animal' ? 'Например: Корова Машка' : 'Например: Пшеница'}
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
          placeholder={assetType === 'animal' ? 'Возраст, вес, особенности...' : 'Сорт, площадь посева...'}
          value={assetDetails}
          onChange={(e) => onAssetDetailsChange(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};