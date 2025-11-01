import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function InvestmentProposals() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Предложения для инвестиций — привлеки хранителей</h2>
        <p className="text-gray-600 mt-1">Создай предложения на основе диагностики</p>
      </div>

      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Icon name="Package" size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Сначала заполните диагностику хозяйства</p>
        </div>
      </Card>
    </div>
  );
}
