import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function SellerMarketplace() {
  const [search, setSearch] = useState('');

  const mockProducts = [
    { id: 1, name: 'Трактор John Deere 8R', price: 5000000, seller: 'АгроТех', type: 'Техника', image: '🚜' },
    { id: 2, name: 'Удобрение Азофоска NPK', price: 25000, seller: 'АгроХим', type: 'Удобрения', image: '🧪' },
    { id: 3, name: 'Семена кукурузы Пионер', price: 15000, seller: 'Семена Плюс', type: 'Семена', image: '🌽' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Продавцы — найди партнеров для роста</h2>
        <p className="text-gray-600 mt-1">Просмотри, кто и что продает — лаконичный каталог для твоей фермы</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по товарам и продавцам..."
            className="w-full"
          />
        </div>
        <select className="px-4 py-2 border rounded-lg">
          <option>Все категории</option>
          <option>Техника</option>
          <option>Удобрения</option>
          <option>Семена</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map(product => (
          <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-4 text-center">{product.image}</div>
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <div className="text-2xl font-bold text-green-600 mb-2">{product.price.toLocaleString('ru-RU')} ₽</div>
            <div className="text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="Store" size={14} />
                <span>{product.seller}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Icon name="Tag" size={14} />
                <span>{product.type}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Icon name="Mail" size={16} className="mr-2" />
              Связаться
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
