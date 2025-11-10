import { useEffect, useState } from 'react';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import FarmersSection from '@/components/home/FarmersSection';
import SellersSection from '@/components/home/SellersSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import Footer from '@/components/home/Footer';

const ADMIN_METRICS_API = 'https://functions.poehali.dev/e07a87af-9e24-471c-b21c-3cc12b198981';

const Home = () => {
  const [stats, setStats] = useState({ farmers: 0, investors: 0, sellers: 0, total: 0 });

  useEffect(() => {
    fetch(`${ADMIN_METRICS_API}?type=users`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then(data => {
        if (data.users && data.users.by_role) {
          setStats({
            farmers: data.users.by_role.farmer || 0,
            investors: data.users.by_role.investor || 0,
            sellers: data.users.by_role.seller || 0,
            total: data.users.total || 0
          });
        }
      })
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