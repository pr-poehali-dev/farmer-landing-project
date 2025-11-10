import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          <span className="text-2xl sm:text-3xl">🐄</span>
          <h3 className="text-xl sm:text-2xl font-bold">ФАРМЕР</h3>
          <span className="text-2xl sm:text-3xl">🌾</span>
        </div>
        <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
          Где настоящее побеждает суету. Присоединяйся к тем, кто выбирает жизнь.
        </p>
        <div className="flex justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-farmer-green transition-colors">
            <Icon name="Share2" size={20} className="sm:w-6 sm:h-6" />
          </a>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-farmer-green transition-colors">
            <Icon name="Send" size={20} className="sm:w-6 sm:h-6" />
          </a>
        </div>
        <p className="text-xs sm:text-sm text-gray-400">© 2025 ФАРМЕР Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;