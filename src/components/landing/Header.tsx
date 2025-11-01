interface HeaderProps {
  scrollToSection: (id: string) => void;
}

export default function Header({ scrollToSection }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5E6A8]/95 backdrop-blur-sm border-b border-[#E5D68B] shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-[#0099CC] tracking-wide" style={{ fontFamily: 'serif' }}>ФАРМЕР</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('farmers')}
              className="text-sm font-medium text-[#0099CC] hover:text-[#007799] transition-colors"
            >
              Для фермеров
            </button>
            <button
              onClick={() => scrollToSection('investors')}
              className="text-sm font-medium text-[#0099CC] hover:text-[#007799] transition-colors"
            >
              Для инвесторов
            </button>
            <button
              onClick={() => scrollToSection('sellers')}
              className="text-sm font-medium text-[#0099CC] hover:text-[#007799] transition-colors"
            >
              Для продавцов
            </button>
            <a
              href="https://planeta.ru/campaigns/235852"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#0099CC] text-white rounded-lg hover:bg-[#007799] transition-colors font-medium"
            >
              Поддержать на Planeta.ru
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
