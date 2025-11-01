import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { animalTypes, cropTypes, investmentTypes } from '@/data/regions';

interface Asset {
  id: string;
  type: 'animal' | 'crop' | 'beehive';
  name: string;
  count: number;
  direction?: string;
  hectares?: number;
  details: string;
  investment_types: string[];
}

interface AssetsSelectorProps {
  assets: Asset[];
  onChange: (assets: Asset[]) => void;
}

const AssetsSelector = ({ assets, onChange }: AssetsSelectorProps) => {
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [showCropForm, setShowCropForm] = useState(false);
  const [showBeehiveForm, setShowBeehiveForm] = useState(false);

  const addAnimal = (animal: Omit<Asset, 'id' | 'type'>) => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      type: 'animal',
      ...animal
    };
    onChange([...assets, newAsset]);
    setShowAnimalForm(false);
  };

  const addCrop = (crop: Omit<Asset, 'id' | 'type'>) => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      type: 'crop',
      ...crop
    };
    onChange([...assets, newAsset]);
    setShowCropForm(false);
  };

  const addBeehive = (beehive: Omit<Asset, 'id' | 'type'>) => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      type: 'beehive',
      ...beehive
    };
    onChange([...assets, newAsset]);
    setShowBeehiveForm(false);
  };

  const removeAsset = (id: string) => {
    onChange(assets.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 italic leading-relaxed">
          Расскажи о своих владениях — пусть инвесторы станут соавторами твоего таинства, сохраняя настоящее
        </p>
      </div>

      {assets.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Ваши активы</h3>
          {assets.map((asset) => (
            <Card key={asset.id} className="p-4 bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon 
                      name={asset.type === 'animal' ? 'Dog' : asset.type === 'crop' ? 'Wheat' : 'Home'} 
                      size={18} 
                      className="text-farmer-green"
                    />
                    <span className="font-semibold">{asset.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {asset.type === 'animal' && (
                      <>
                        <div>Количество: {asset.count}</div>
                        <div>Направление: {asset.direction}</div>
                      </>
                    )}
                    {asset.type === 'crop' && (
                      <>
                        <div>Площадь: {asset.hectares} га</div>
                      </>
                    )}
                    {asset.type === 'beehive' && (
                      <>
                        <div>Количество ульев: {asset.count}</div>
                      </>
                    )}
                    {asset.details && <div>Детали: {asset.details}</div>}
                    <div className="flex gap-2 flex-wrap mt-2">
                      {asset.investment_types.map((type) => {
                        const investType = investmentTypes.find(t => t.value === type);
                        return (
                          <span key={type} className="px-2 py-1 bg-farmer-green/10 text-farmer-green text-xs rounded">
                            {investType?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAsset(asset.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAnimalForm(true)}
          className="h-auto py-4 flex flex-col items-center gap-2"
        >
          <Icon name="Dog" size={24} className="text-farmer-orange" />
          <span>Добавить животных</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowCropForm(true)}
          className="h-auto py-4 flex flex-col items-center gap-2"
        >
          <Icon name="Wheat" size={24} className="text-farmer-green" />
          <span>Добавить культуры</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowBeehiveForm(true)}
          className="h-auto py-4 flex flex-col items-center gap-2"
        >
          <Icon name="Home" size={24} className="text-yellow-600" />
          <span>Добавить ульи</span>
        </Button>
      </div>

      {showAnimalForm && <AnimalForm onAdd={addAnimal} onCancel={() => setShowAnimalForm(false)} />}
      {showCropForm && <CropForm onAdd={addCrop} onCancel={() => setShowCropForm(false)} />}
      {showBeehiveForm && <BeehiveForm onAdd={addBeehive} onCancel={() => setShowBeehiveForm(false)} />}
    </div>
  );
};

const AnimalForm = ({ onAdd, onCancel }: { onAdd: (animal: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    count: 0,
    direction: '',
    details: '',
    investment_types: [] as string[]
  });

  const selectedAnimalType = animalTypes.find(a => a.value === formData.name);

  return (
    <Card className="p-6 border-2 border-farmer-orange">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Icon name="Dog" className="text-farmer-orange" />
        Добавить животных
      </h3>
      <div className="space-y-4">
        <div>
          <Label>Тип животного *</Label>
          <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              {animalTypes.map((animal) => (
                <SelectItem key={animal.value} value={animal.label}>
                  {animal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Количество *</Label>
          <Input
            type="number"
            value={formData.count || ''}
            onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>

        {selectedAnimalType && (
          <div>
            <Label>Направление *</Label>
            <Select value={formData.direction} onValueChange={(value) => setFormData({ ...formData, direction: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите направление" />
              </SelectTrigger>
              <SelectContent>
                {selectedAnimalType.directions.map((dir) => (
                  <SelectItem key={dir} value={dir}>
                    {dir}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label>Детали (порода, условия содержания)</Label>
          <Textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Например: Голштинская порода, содержание в коровнике"
          />
        </div>

        <div>
          <Label className="mb-3 block">Доступно для *</Label>
          <div className="space-y-2">
            {investmentTypes.map((type) => (
              <div key={type.value} className="flex items-start gap-2">
                <Checkbox
                  checked={formData.investment_types.includes(type.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, investment_types: [...formData.investment_types, type.value] });
                    } else {
                      setFormData({ ...formData, investment_types: formData.investment_types.filter(t => t !== type.value) });
                    }
                  }}
                />
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => {
              if (formData.name && formData.count > 0 && formData.direction && formData.investment_types.length > 0) {
                onAdd(formData);
              }
            }}
            disabled={!formData.name || formData.count <= 0 || !formData.direction || formData.investment_types.length === 0}
            className="flex-1"
          >
            Добавить
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CropForm = ({ onAdd, onCancel }: { onAdd: (crop: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    hectares: 0,
    details: '',
    investment_types: [] as string[]
  });

  return (
    <Card className="p-6 border-2 border-farmer-green">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Icon name="Wheat" className="text-farmer-green" />
        Добавить культуру
      </h3>
      <div className="space-y-4">
        <div>
          <Label>Культура *</Label>
          <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите культуру" />
            </SelectTrigger>
            <SelectContent>
              {cropTypes.map((crop) => (
                <SelectItem key={crop} value={crop}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Площадь (га) *</Label>
          <Input
            type="number"
            value={formData.hectares || ''}
            onChange={(e) => setFormData({ ...formData, hectares: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            step="0.1"
          />
        </div>

        <div>
          <Label>Детали (сезон, тип почвы, планируемая урожайность)</Label>
          <Textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Например: Озимая пшеница, чернозем, ожидается 40 ц/га"
          />
        </div>

        <div>
          <Label className="mb-3 block">Доступно для *</Label>
          <div className="space-y-2">
            {investmentTypes.map((type) => (
              <div key={type.value} className="flex items-start gap-2">
                <Checkbox
                  checked={formData.investment_types.includes(type.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, investment_types: [...formData.investment_types, type.value] });
                    } else {
                      setFormData({ ...formData, investment_types: formData.investment_types.filter(t => t !== type.value) });
                    }
                  }}
                />
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => {
              if (formData.name && formData.hectares > 0 && formData.investment_types.length > 0) {
                onAdd(formData);
              }
            }}
            disabled={!formData.name || formData.hectares <= 0 || formData.investment_types.length === 0}
            className="flex-1"
          >
            Добавить
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </div>
    </Card>
  );
};

const BeehiveForm = ({ onAdd, onCancel }: { onAdd: (beehive: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: 'Ульи',
    count: 0,
    direction: '',
    details: '',
    investment_types: [] as string[]
  });

  return (
    <Card className="p-6 border-2 border-yellow-600">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Icon name="Home" className="text-yellow-600" />
        Добавить ульи
      </h3>
      <div className="space-y-4">
        <div>
          <Label>Количество ульев *</Label>
          <Input
            type="number"
            value={formData.count || ''}
            onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>

        <div>
          <Label>Тип *</Label>
          <Select value={formData.direction} onValueChange={(value) => setFormData({ ...formData, direction: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Медовые">Медовые</SelectItem>
              <SelectItem value="Патронажные">Патронажные</SelectItem>
              <SelectItem value="Другие">Другие</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Детали (порода пчел, расположение, сезонность)</Label>
          <Textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Например: Среднерусская порода, луговое расположение, активный сезон май-август"
          />
        </div>

        <div>
          <Label className="mb-3 block">Доступно для *</Label>
          <div className="space-y-2">
            {investmentTypes.map((type) => (
              <div key={type.value} className="flex items-start gap-2">
                <Checkbox
                  checked={formData.investment_types.includes(type.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({ ...formData, investment_types: [...formData.investment_types, type.value] });
                    } else {
                      setFormData({ ...formData, investment_types: formData.investment_types.filter(t => t !== type.value) });
                    }
                  }}
                />
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => {
              if (formData.count > 0 && formData.direction && formData.investment_types.length > 0) {
                onAdd(formData);
              }
            }}
            disabled={formData.count <= 0 || !formData.direction || formData.investment_types.length === 0}
            className="flex-1"
          >
            Добавить
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AssetsSelector;
