interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  return (
    <footer className="bg-[#007799] text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'serif' }}>ФАРМЕР</h3>
            </div>
            <p className="text-[#B3E5F5]">
              Платформа для инвестиций в реальные фермы
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Для пользователей</h4>
            <ul className="space-y-2 text-[#B3E5F5]">
              <li><button onClick={() => scrollToSection('farmers')} className="hover:text-white">Фермерам</button></li>
              <li><button onClick={() => scrollToSection('investors')} className="hover:text-white">Инвесторам</button></li>
              <li><button onClick={() => scrollToSection('sellers')} className="hover:text-white">Продавцам</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">О проекте</h4>
            <ul className="space-y-2 text-[#B3E5F5]">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-white">О нас</button></li>
              <li><button onClick={() => scrollToSection('survey')} className="hover:text-white">Опрос</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <ul className="space-y-2 text-[#B3E5F5]">
              <li>Email: <a href="mailto:support@farmer.example" className="hover:text-white">support@farmer.example</a></li>
              <li>Телефон: +7 (999) 123-45-67</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#009AC9] pt-8 text-center text-[#B3E5F5]">
          <p>&copy; 2024 Фармер. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
