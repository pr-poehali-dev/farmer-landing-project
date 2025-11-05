import { useEffect, useState } from 'react';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import FarmersSection from '@/components/home/FarmersSection';
import SellersSection from '@/components/home/SellersSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import Footer from '@/components/home/Footer';

const STATS_API = 'https://functions.poehali.dev/0a0119c5-f173-40c2-bc49-c845a420422f';

const Home = () => {
  const [stats, setStats] = useState({ farmers: 0, investors: 0, sellers: 0, total: 0 });

  useEffect(() => {
    fetch(`${STATS_API}?action=stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection stats={stats} />
      <FarmersSection />
      <SellersSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Home;