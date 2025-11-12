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
                  <span className="text-gray-900 font-semibold">ИП Краснопеев Илья Андреевич</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 font-medium min-w-[120px]">ИНН:</span>
                  <span className="text-gray-900 font-mono text-lg">502517081940</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 font-medium min-w-[120px]">ОГРНИП:</span>
                  <span className="text-gray-900 font-mono text-lg">324508100153713</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 font-medium min-w-[120px]">Дата регистрации:</span>
                  <span className="text-gray-900">09.07.2024</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="MapPin" size={24} className="text-blue-600" />
                Адрес регистрации
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-900">
                  Московская область, городской округ Подольск, город Подольск, 
                  улица Комсомольская, дом 1, квартира 16
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="Mail" size={24} className="text-purple-600" />
                Контактная информация
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex gap-4 items-center">
                  <Icon name="Mail" size={20} className="text-gray-500" />
                  <a href="mailto:hello@farmerlandingproject.ru" className="text-blue-600 hover:underline">
                    hello@farmerlandingproject.ru
                  </a>
                </div>
                <div className="flex gap-4 items-center">
                  <Icon name="Phone" size={20} className="text-gray-500" />
                  <a href="tel:+79999999999" className="text-blue-600 hover:underline">
                    +7 (999) 999-99-99
                  </a>
                </div>
                <div className="flex gap-4 items-center">
                  <Icon name="Globe" size={20} className="text-gray-500" />
                  <a href="https://farmerlandingproject.ru" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    farmerlandingproject.ru
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="FileText" size={24} className="text-orange-600" />
                Виды деятельности
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Разработка и поддержка интернет-платформы для агробизнеса</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Консультационные услуги в области сельского хозяйства</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Информационные технологии и программное обеспечение</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="ShieldCheck" size={24} className="text-green-600" />
                Политика конфиденциальности
              </h3>
              <div className="bg-green-50 rounded-lg p-6 text-sm text-gray-700 space-y-2">
                <p>
                  Мы обеспечиваем защиту персональных данных в соответствии с Федеральным законом 
                  от 27.07.2006 № 152-ФЗ «О персональных данных».
                </p>
                <p>
                  Платежи обрабатываются через сертифицированный сервис ЮКасса (ООО «ЮМани»), 
                  что гарантирует безопасность ваших финансовых данных.
                </p>
                <p>
                  Все транзакции защищены по стандарту PCI DSS Level 1.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-sm text-blue-900">
                Если у вас есть вопросы по работе сервиса или оплате, свяжитесь с нами по указанным контактам. 
                Мы работаем для развития российского агробизнеса! 🌾
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          © 2024 ИП Краснопеев Илья Андреевич. Все права защищены.
        </div>
      </div>
    </div>
  );
}
