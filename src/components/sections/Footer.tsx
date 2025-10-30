import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-gray-900 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Icon name="Sprout" className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold">Фармер</span>
            </div>
            <p className="text-gray-400 text-sm">Платформа для инвестиций в реальные фермы</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Ссылки</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://t.me/ilyukhina_ferma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <Icon name="Send" size={14} />
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://planeta.ru/campaigns/235852" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Planeta.ru
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Icon name="Mail" size={14} />
                <span>info@farmer.ru</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 Фармер. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
