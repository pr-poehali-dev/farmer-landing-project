import { useState } from 'react';
import { toast } from 'sonner';
import Navigation from '@/components/sections/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import FarmersSection from '@/components/sections/FarmersSection';
import InvestorsSection from '@/components/sections/InvestorsSection';
import SellersSection from '@/components/sections/SellersSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import FounderSection from '@/components/sections/FounderSection';
import Footer from '@/components/sections/Footer';

const Index = () => {
  const [farmerData, setFarmerData] = useState({ name: '', email: '', region: '', interest: '' });
  const [investorData, setInvestorData] = useState({ name: '', email: '', amount: '', returnType: '' });
  const [sellerData, setSellerData] = useState({ name: '', email: '', company: '', budget: '' });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Фермер:', farmerData);
    toast.success('Спасибо! Ваши данные сохранены');
    setFarmerData({ name: '', email: '', region: '', interest: '' });
  };

  const handleInvestorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Инвестор:', investorData);
    toast.success('Спасибо! Ваши данные сохранены');
    setInvestorData({ name: '', email: '', amount: '', returnType: '' });
  };

  const handleSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Продавец:', sellerData);
    toast.success('Спасибо! Ваши данные сохранены');
    setSellerData({ name: '', email: '', company: '', budget: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation scrollToSection={scrollToSection} />
      <HeroSection scrollToSection={scrollToSection} />
      <FarmersSection 
        farmerData={farmerData} 
        setFarmerData={setFarmerData} 
        handleFarmerSubmit={handleFarmerSubmit} 
      />
      <InvestorsSection 
        investorData={investorData} 
        setInvestorData={setInvestorData} 
        handleInvestorSubmit={handleInvestorSubmit} 
      />
      <SellersSection 
        sellerData={sellerData} 
        setSellerData={setSellerData} 
        handleSellerSubmit={handleSellerSubmit} 
      />
      <FeaturesSection />
      <FounderSection />
      <Footer />
    </div>
  );
};

export default Index;
