import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

export default function Legal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="ArrowLeft" size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Юридическая информация</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Реквизиты</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="Building2" size={24} className="text-green-600" />
                Индивидуальный предприниматель
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex gap-4">
                  <span className="text-gray-600 font-medium min-w-[120px]">Название:</span>
                  <span className="text-gray-900 font-semibold">ИП Краснопеев Илья Сергеевич</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 font-medium min-w-[120px]">ИНН:</span>
                  <span className="text-gray-900 font-mono text-lg">003262448726</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 font-medium min-w-[120px]">ОГРНИП:</span>
                  <span className="text-gray-900 font-mono text-lg">325030000006227</span>
                </div>

              </div>
            </div>


          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          © 2024 ИП Краснопеев Илья Сергеевич. Все права защищены.
        </div>
      </div>
    </div>
  );
}