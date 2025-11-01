import { useEffect, useState } from 'react';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import RolesSection from '@/components/home/RolesSection';
import ProposalsSection from '@/components/home/ProposalsSection';
import InvestmentTypesSection from '@/components/home/InvestmentTypesSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import Footer from '@/components/home/Footer';

const STATS_API = 'https://functions.poehali.dev/dde2cfb3-048c-41f8-b40d-cc6a53590929';

interface Proposal {
  id: number;
  description: string;
  price: number;
  shares: number;
  type: string;
  photo_url: string;
  farmer_name: string;
  farm_name: string;
  region: string;
  vk_link: string;
  investors_count: number;
}

const Home = () => {
  const [stats, setStats] = useState({ farmers: 0, investors: 0, sellers: 0, total: 0 });
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    fetch(`${STATS_API}?action=public`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err));
    
    fetch(`${STATS_API}?action=proposals`)
      .then(res => res.json())
      .then(data => setProposals(data.proposals || []))
      .catch(err => console.error('Failed to load proposals:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection stats={stats} />
      <RolesSection />
      <ProposalsSection proposals={proposals} />
      <InvestmentTypesSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Home;
