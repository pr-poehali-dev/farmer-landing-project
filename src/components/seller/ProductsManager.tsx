import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ProductForm } from '@/types/seller.types';

interface Props {
  tier: string;
  products: any[];
  productForm: ProductForm;
  onFormChange: (updates: Partial<ProductForm>) => void;
  onAddProduct: (e: React.FormEvent, equipmentCategory?: string, equipmentSubcategory?: string, fertilizerCategory?: string, fertilizerSubcategory?: string) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProduct: (productId: string, updates: any) => void;
}

const PRODUCT_TYPES = [
  { value: 'equipment', label: 'Сельхозтехника' },
  { value: 'fertilizer', label: 'Удобрения' },
  { value: 'seeds', label: 'Семена для посева' },
  { value: 'technology', label: 'Технологии' }
];

const FERTILIZER_CATEGORIES = [
  {
    value: 'mineral',
    label: 'Минеральные удобрения',
    subcategories: [
      'Калий хлорид 40% мелкогранулированный',
      'Калий хлорид 40% гранулированный',
      'Калий хлорид 40% (дробленый)',
      'Калий хлористый гранулированный (красный)',
      'Калий хлористый марка А',
      'Калий хлористый мелкий 60% (красный)',
      'Калий хлористый марка А мелкий 60% (белый)',
      'Калийная соль',
      'Калийная соль (гранула)',
      'Калийная соль (порошок)',
      'Калий хлорид (тип Калийная гранула)',
      'Аммиачная селитра ГОСТ',
      'Изестково-аммиачная селитра',
      'Карбамид марка Б',
      'Сульфат аммония (Кристалл) Акриатный гранулированный (форма гранулы)',
      'Сульфат аммония (Кристалл) Акриатный гранулированный (форма граби)',
      'Сульфат аммония Коксохимический (форма кристалл)',
      'Аммофос',
      'Фосфогипс',
      'Нитроаммофоска (Азофоска)',
      'Магний сернокислый'
    ]
  },
  {
    value: 'organic',
    label: 'Органические удобрения',
    subcategories: [
      'Доломитовая мука',
      'Стромолотый гипс',
      'Фосфоритная мука'
    ]
  },
  {
    value: 'root_additives',
    label: 'Корневые добавки',
    subcategories: [
      'Соль',
      'Сера молотая'
    ]
  },
  {
    value: 'soil_structure',
    label: 'Удобрения для улучшения структуры почвы',
    subcategories: [
      'Доломитовая мука',
      'Стромолотый гипс',
      'Фосфоритная мука'
    ]
  },
  {
    value: 'yield_boost',
    label: 'Удобрения для повышения урожайности',
    subcategories: [
      'Калийные удобрения',
      'Азотные удобрения',
      'Фосфорные удобрения',
      'Сложные удобрения'
    ]
  },
  {
    value: 'plant_protection',
    label: 'Удобрения для защиты растений',
    subcategories: [
      'Соль',
      'Сера молотая'
    ]
  }
];

const EQUIPMENT_CATEGORIES = [
  {
    value: 'planting',
    label: 'Посадка растений',
    subcategories: [
      'Сеялка',
      'Рассадопосадочная машина',
      'Картофелесажалка',
      'Пересадчик деревьев',
      'Комплекс посевной'
    ]
  },
  {
    value: 'care',
    label: 'Уход за растениями',
    subcategories: [
      'Культиватор',
      'Опрыскиватель',
      'Почвофреза',
      'Обрезчик деревьев',
      'Планировщик почвы',
      'Пленкоукладчик / Грядообразователь',
      'Рапсовый стол',
      'Бороздодел',
      'Глубокорыхлитель',
      'Камнеуборочная машина',
      'Измельчитель веток',
      'Машины для сбора листьев',
      'Машина для уборки пленки',
      'Резчик рулонов',
      'Размотчик капельной ленты'
    ]
  },
  {
    value: 'harvest',
    label: 'Сбор урожая',
    subcategories: [
      'Жатка',
      'Комбайн',
      'Косилка',
      'Копатель корнеплодов',
      'Подборщик',
      'Пресc-подборщик',
      'Транспортировщик рулонов',
      'Транспортер',
      'Загрузчик сеялок',
      'Кормораздатчик / миксер-кормораздатчик',
      'Ботвоудалитель',
      'Погрузчики (зернопогрузчик)',
      'Скреперы (скрепер-планировщик)',
      'Упаковщик'
    ]
  },
  {
    value: 'processing',
    label: 'Первичная обработка продукции',
    subcategories: [
      'Зернодробилка',
      'Зерноочиститель',
      'Зерноперерабатывающий комплекс',
      'Зерносушилка',
      'Протравливатель',
      'Смесительный комплекс',
      'Минеральные удобрения (Разбрасыватель удобрений)',
      'Солома (Разбрасыватель соломы)',
      'Распределение почвенного покрытия (Разбрасыватель пола)'
    ]
  },
  {
    value: 'storage',
    label: 'Хранение и транспортировка',
    subcategories: [
      'Тележка для адаптера',
      'Тележка для жаток',
      'Тележка переходная',
      'Мини-трактор',
      'Трактор',
      'Платформа садовая',
      'Носитель для сеялок',
      'Сцепка',
      'Плуг',
      'Вилы',
      'Грабли, ворошилки, валкователи',
      'Бункер',
      'Каток',
      'Минитехника (мини-трактора)',
      'Телега',
      'Грузоподъемники (зернометатель)'
    ]
  },
  {
    value: 'irrigation',
    label: 'Агрооборудование для полива и орошения',
    subcategories: [
      'Дождевальная машина'
    ]
  }
];

export default function ProductsManager({ tier, products, productForm, onFormChange, onAddProduct, onDeleteProduct, onUpdateProduct }: Props) {
  const canAddProduct = true;
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<ProductForm>({
    type: 'fertilizer',
    name: '',
    price: 0,
    description: '',
    photo_url: '',
    photo_url_2: '',
    photo_url_3: '',
    target_audience: []
  });
  const [equipmentCategory, setEquipmentCategory] = useState<string>('');
  const [equipmentSubcategory, setEquipmentSubcategory] = useState<string>('');
  const [editEquipmentCategory, setEditEquipmentCategory] = useState<string>('');
  const [editEquipmentSubcategory, setEditEquipmentSubcategory] = useState<string>('');
  const [fertilizerCategory, setFertilizerCategory] = useState<string>('');
  const [fertilizerSubcategory, setFertilizerSubcategory] = useState<string>('');
  const [editFertilizerCategory, setEditFertilizerCategory] = useState<string>('');
  const [editFertilizerSubcategory, setEditFertilizerSubcategory] = useState<string>('');

  const activeProducts = products.filter(p => p.is_active !== false);
  const inactiveProducts = products.filter(p => p.is_active === false);
  
  const filteredProducts = statusFilter === 'all' ? products : 
    statusFilter === 'active' ? activeProducts : inactiveProducts;

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      type: product.type,
      name: product.name,
      price: product.price,
      description: product.description || '',
      photo_url: product.photo_url || '',
      photo_url_2: product.photo_url_2 || '',
      photo_url_3: product.photo_url_3 || '',
      target_audience: product.target_audience || []
    });
    setEditEquipmentCategory(product.equipment_category || '');
    setEditEquipmentSubcategory(product.equipment_subcategory || '');
    setEditFertilizerCategory(product.fertilizer_category || '');
    setEditFertilizerSubcategory(product.fertilizer_subcategory || '');
  };

  const saveEdit = () => {
    if (editingProduct) {
      const updates = {
        ...editForm,
        equipment_category: editForm.type === 'equipment' ? editEquipmentCategory : null,
        equipment_subcategory: editForm.type === 'equipment' ? editEquipmentSubcategory : null,
        fertilizer_category: editForm.type === 'fertilizer' ? editFertilizerCategory : null,
        fertilizer_subcategory: editForm.type === 'fertilizer' ? editFertilizerSubcategory : null
      };
      onUpdateProduct(editingProduct.id, updates);
      setEditingProduct(null);
    }
  };

  const toggleStatus = (product: any) => {
    onUpdateProduct(product.id, { is_active: !product.is_active });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Package" className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-bold">Добавить товар</h2>
            <p className="text-sm text-gray-600">Заполните информацию о товаре</p>
          </div>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onAddProduct(e, equipmentCategory, equipmentSubcategory, fertilizerCategory, fertilizerSubcategory);
          setEquipmentCategory('');
          setEquipmentSubcategory('');
          setFertilizerCategory('');
          setFertilizerSubcategory('');
        }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Тип товара *</Label>
              <Select value={productForm.type} onValueChange={(val) => {
                onFormChange({ type: val });
                setEquipmentCategory('');
                setEquipmentSubcategory('');
                setFertilizerCategory('');
                setFertilizerSubcategory('');
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Название товара *</Label>
              <Input
                value={productForm.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                placeholder="Минеральное удобрение NPK"
                required
              />
            </div>
          </div>

          {productForm.type === 'fertilizer' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Категория удобрений *</Label>
                <Select value={fertilizerCategory} onValueChange={(val) => {
                  setFertilizerCategory(val);
                  setFertilizerSubcategory('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {FERTILIZER_CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {fertilizerCategory && (
                <div className="space-y-2">
                  <Label>Тип удобрения *</Label>
                  <Select value={fertilizerSubcategory} onValueChange={setFertilizerSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип удобрения" />
                    </SelectTrigger>
                    <SelectContent>
                      {FERTILIZER_CATEGORIES
                        .find(c => c.value === fertilizerCategory)
                        ?.subcategories.map(sub => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {productForm.type === 'equipment' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Категория техники *</Label>
                <Select value={equipmentCategory} onValueChange={(val) => {
                  setEquipmentCategory(val);
                  setEquipmentSubcategory('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {equipmentCategory && (
                <div className="space-y-2">
                  <Label>Тип техники *</Label>
                  <Select value={equipmentSubcategory} onValueChange={setEquipmentSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип техники" />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPMENT_CATEGORIES
                        .find(c => c.value === equipmentCategory)
                        ?.subcategories.map(sub => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label>Цена (руб.) *</Label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) => onFormChange({ price: parseFloat(e.target.value) || 0 })}
                placeholder="5000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>URL фото 1</Label>
              <Input
                value={productForm.photo_url}
                onChange={(e) => onFormChange({ photo_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label>URL фото 2 (опционально)</Label>
              <Input
                value={productForm.photo_url_2}
                onChange={(e) => onFormChange({ photo_url_2: e.target.value })}
                placeholder="https://example.com/image2.jpg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>URL фото 3 (опционально)</Label>
              <Input
                value={productForm.photo_url_3}
                onChange={(e) => onFormChange({ photo_url_3: e.target.value })}
                placeholder="https://example.com/image3.jpg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Описание товара</Label>
            <Textarea
              value={productForm.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              placeholder="Подробное описание товара..."
              rows={3}
            />
          </div>
          
          <Button 
            type="submit"
            disabled={
              (productForm.type === 'equipment' && (!equipmentCategory || !equipmentSubcategory)) ||
              (productForm.type === 'fertilizer' && (!fertilizerCategory || !fertilizerSubcategory))
            }
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить товар
          </Button>
        </form>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Мои товары ({products.length})</h3>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Все ({products.length})
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
            >
              Активные ({activeProducts.length})
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('inactive')}
            >
              Не опубликованные ({inactiveProducts.length})
            </Button>
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">Нет товаров в этой категории</p>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className={`p-4 ${product.is_active === false ? 'bg-gray-100' : 'bg-gray-50'}`}>
                {editingProduct?.id === product.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Тип товара</Label>
                        <Select value={editForm.type} onValueChange={(val) => {
                          setEditForm({...editForm, type: val});
                          setEditEquipmentCategory('');
                          setEditEquipmentSubcategory('');
                          setEditFertilizerCategory('');
                          setEditFertilizerSubcategory('');
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_TYPES.map(t => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Название</Label>
                        <Input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                      </div>
                    </div>

                    {editForm.type === 'fertilizer' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Категория удобрений</Label>
                          <Select value={editFertilizerCategory} onValueChange={(val) => {
                            setEditFertilizerCategory(val);
                            setEditFertilizerSubcategory('');
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                              {FERTILIZER_CATEGORIES.map(c => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {editFertilizerCategory && (
                          <div className="space-y-2">
                            <Label>Тип удобрения</Label>
                            <Select value={editFertilizerSubcategory} onValueChange={setEditFertilizerSubcategory}>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип удобрения" />
                              </SelectTrigger>
                              <SelectContent>
                                {FERTILIZER_CATEGORIES
                                  .find(c => c.value === editFertilizerCategory)
                                  ?.subcategories.map(sub => (
                                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )}

                    {editForm.type === 'equipment' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Категория техники</Label>
                          <Select value={editEquipmentCategory} onValueChange={(val) => {
                            setEditEquipmentCategory(val);
                            setEditEquipmentSubcategory('');
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                              {EQUIPMENT_CATEGORIES.map(c => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {editEquipmentCategory && (
                          <div className="space-y-2">
                            <Label>Тип техники</Label>
                            <Select value={editEquipmentSubcategory} onValueChange={setEditEquipmentSubcategory}>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип техники" />
                              </SelectTrigger>
                              <SelectContent>
                                {EQUIPMENT_CATEGORIES
                                  .find(c => c.value === editEquipmentCategory)
                                  ?.subcategories.map(sub => (
                                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Цена</Label>
                        <Input type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <Label>URL фото 1</Label>
                        <Input value={editForm.photo_url} onChange={(e) => setEditForm({...editForm, photo_url: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>URL фото 2</Label>
                        <Input value={editForm.photo_url_2} onChange={(e) => setEditForm({...editForm, photo_url_2: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>URL фото 3</Label>
                        <Input value={editForm.photo_url_3} onChange={(e) => setEditForm({...editForm, photo_url_3: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} rows={3} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm">
                        <Icon name="Check" size={16} className="mr-1" />
                        Сохранить
                      </Button>
                      <Button onClick={() => setEditingProduct(null)} size="sm" variant="outline">
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {PRODUCT_TYPES.find(t => t.value === product.type)?.label}
                        </span>
                        {product.is_active === false && (
                          <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">Не опубликовано</span>
                        )}
                        <h4 className="font-semibold">{product.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <p className="text-lg font-bold text-blue-600 mb-3">{product.price.toLocaleString()} ₽</p>
                      {(product.photo_url || product.photo_url_2 || product.photo_url_3) && (
                        <div className="flex gap-2 flex-wrap">
                          {product.photo_url && (
                            <img src={product.photo_url} alt="Фото 1" className="w-20 h-20 object-cover rounded border" />
                          )}
                          {product.photo_url_2 && (
                            <img src={product.photo_url_2} alt="Фото 2" className="w-20 h-20 object-cover rounded border" />
                          )}
                          {product.photo_url_3 && (
                            <img src={product.photo_url_3} alt="Фото 3" className="w-20 h-20 object-cover rounded border" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(product)}
                        title={product.is_active === false ? 'Опубликовать' : 'Снять с публикации'}
                      >
                        <Icon name={product.is_active === false ? 'Eye' : 'EyeOff'} size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(product)}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteProduct(product.id)}
                        className="text-red-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}