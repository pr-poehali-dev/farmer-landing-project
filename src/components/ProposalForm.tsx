import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ProposalFormProps {
  productType: 'income' | 'product' | 'patronage';
  userId: number;
  onSuccess: () => void;
}

const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

const ProposalForm = ({ productType, userId, onSuccess }: ProposalFormProps) => {
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    product_type: productType,
    asset_type: '',
    asset_details: '',
    description: '',
    price: 0,
    shares: 1,
    photo_url: '',
    expected_product: '',
    update_frequency: 'weekly'
  });

  const assetTypes = {
    income: ['Гектар земли', 'Доля коровы'],
    product: ['Корова', 'Поле с культурой'],
    patronage: ['Корова', 'Гектар земли', 'Вся ферма']
  };

  const cropOptions = ['Рапс', 'Кукуруза', 'Соя', 'Чеснок', 'Салат', 'Свекла'];
  const cowOptions = ['Молочное', 'Мясное'];

  const titles = {
    income: 'Инвестиция для получения дохода',
    product: 'Инвестиция в продукт',
    patronage: 'Патронаж (покровительство)'
  };

  const descriptions = {
    income: 'Создайте предложение, где инвесторы получат пассивный доход от производства — урожая или молока. Это стабильность и вклад в настоящее.',
    product: 'Создайте предложение, где инвесторы получат физический продукт — мясо, овощи или другие дары земли. Это инвестиция, которая возвращается как дар природы.',
    patronage: 'Создайте патронаж, где инвесторы станут покровителями вашей фермы, получая видеообновления и новости. Это эмоциональная связь с землёй.'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch(FARMER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'create_proposal_v2',
          ...formData
        })
      });

      if (response.ok) {
        toast.success('Предложение создано!');
        setFormData({
          product_type: productType,
          asset_type: '',
          asset_details: '',
          description: '',
          price: 0,
          shares: 1,
          photo_url: '',
          expected_product: '',
          update_frequency: 'weekly'
        });
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка создания');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setCreating(false);
    }
  };

  const minPrice = productType === 'patronage' ? 1000 : 5000;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{titles[productType]}</h3>
        <p className="text-gray-600">{descriptions[productType]}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor={`asset_type_${productType}`}>Тип актива</Label>
          <Select
            value={formData.asset_type}
            onValueChange={(value) => setFormData({ ...formData, asset_type: value, asset_details: '' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип актива" />
            </SelectTrigger>
            <SelectContent>
              {assetTypes[productType].map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.asset_type && (
          <div>
            <Label htmlFor={`asset_details_${productType}`}>
              {formData.asset_type.includes('земли') || formData.asset_type.includes('Поле') 
                ? 'Культура' 
                : formData.asset_type.includes('ферма') 
                ? 'Направление фермы' 
                : 'Направление'}
            </Label>
            <Select
              value={formData.asset_details}
              onValueChange={(value) => setFormData({ ...formData, asset_details: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите детали" />
              </SelectTrigger>
              <SelectContent>
                {(formData.asset_type.includes('земли') || formData.asset_type.includes('Поле')
                  ? cropOptions
                  : cowOptions
                ).map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor={`photo_url_${productType}`}>
            Ссылка на фото
            <span className="text-xs text-gray-500 ml-2">(URL изображения)</span>
          </Label>
          <Input
            id={`photo_url_${productType}`}
            value={formData.photo_url}
            onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div>
          <Label htmlFor={`description_${productType}`}>Описание (эмоциональное)</Label>
          <Textarea
            id={`description_${productType}`}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={
              productType === 'income'
                ? 'Это поле рапса даст урожай, полный энергии солнца...'
                : productType === 'product'
                ? 'Инвестируй в эту свеклу — получи свежий урожай для твоего стола...'
                : 'Будь покровителем этого гектара сои — получай видео роста каждую неделю...'
            }
            rows={4}
            required
          />
        </div>

        {productType === 'product' && (
          <div>
            <Label htmlFor="expected_product">Ожидаемый продукт</Label>
            <Input
              id="expected_product"
              value={formData.expected_product}
              onChange={(e) => setFormData({ ...formData, expected_product: e.target.value })}
              placeholder="Например: Свекла, 10 кг на долю"
            />
          </div>
        )}

        {productType === 'patronage' && (
          <div>
            <Label htmlFor="update_frequency">Частота обновлений</Label>
            <Select
              value={formData.update_frequency}
              onValueChange={(value) => setFormData({ ...formData, update_frequency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Еженедельно</SelectItem>
                <SelectItem value="monthly">Ежемесячно</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`price_${productType}`}>
              {productType === 'patronage' ? 'Цена патронажа (₽/мес)' : 'Цена доли (₽)'}
            </Label>
            <Input
              id={`price_${productType}`}
              type="number"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              min={minPrice}
              placeholder={`От ${minPrice}`}
              required
            />
          </div>

          <div>
            <Label htmlFor={`shares_${productType}`}>Количество долей</Label>
            <Input
              id={`shares_${productType}`}
              type="number"
              value={formData.shares || ''}
              onChange={(e) => setFormData({ ...formData, shares: parseInt(e.target.value) || 1 })}
              min={1}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-farmer-green hover:bg-farmer-green-dark"
          disabled={creating}
        >
          {creating ? (
            <>
              <Icon name="Loader2" className="animate-spin mr-2" size={18} />
              Создание...
            </>
          ) : (
            <>
              <Icon name="Plus" className="mr-2" size={18} />
              Опубликовать предложение
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default ProposalForm;
