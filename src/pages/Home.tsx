import { useEffect, useState } from 'react';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import InvestmentTypesSection from '@/components/home/InvestmentTypesSection';
import FarmersSection from '@/components/home/FarmersSection';
import SellersSection from '@/components/home/SellersSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import Footer from '@/components/home/Footer';

const STATS_API = 'https://functions.poehali.dev/dde2cfb3-048c-41f8-b40d-cc6a53590929';

const Home = () => {
  const [stats, setStats] = useState({ farmers: 0, investors: 0, sellers: 0, total: 0 });

  useEffect(() => {
    fetch(`${STATS_API}?action=public`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection stats={stats} />
      <InvestmentTypesSection />
      <FarmersSection />
      <SellersSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Home;