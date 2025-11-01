import React from 'react';
import { toast } from 'sonner';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import FarmerSection from '@/components/landing/FarmerSection';
import InvestorSection from '@/components/landing/InvestorSection';
import SellerSection from '@/components/landing/SellerSection';
import SurveySection from '@/components/landing/SurveySection';
import WhyFarmerSection from '@/components/landing/WhyFarmerSection';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const [showCustomRegion, setShowCustomRegion] = React.useState<{farmer?: boolean, investor?: boolean, seller?: boolean, survey?: boolean}>({});

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {
      type,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company_name: formData.get('company_name'),
      interest_type: formData.get('interest_type'),
      message: formData.get('message'),
      rating: formData.get('rating'),
      suggestions: formData.get('suggestions'),
      region: formData.get('region'),
      custom_region: formData.get('custom_region')
    };

    try {
      const response = await fetch('https://functions.poehali.dev/095ae814-3cbd-4db4-98e5-255517829146', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      toast.success('Спасибо! Мы свяжемся с вами в ближайшее время');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Не удалось отправить заявку. Попробуйте позже');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6A8]">
      <Header scrollToSection={scrollToSection} />
      <HeroSection scrollToSection={scrollToSection} />
      <AboutSection />
      <FarmerSection 
        showCustomRegion={showCustomRegion.farmer || false}
        onRegionChange={(show) => setShowCustomRegion(prev => ({...prev, farmer: show}))}
        onSubmit={(e) => handleSubmit(e, 'farmer')}
      />
      <InvestorSection 
        showCustomRegion={showCustomRegion.investor || false}
        onRegionChange={(show) => setShowCustomRegion(prev => ({...prev, investor: show}))}
        onSubmit={(e) => handleSubmit(e, 'investor')}
      />
      <SellerSection 
        showCustomRegion={showCustomRegion.seller || false}
        onRegionChange={(show) => setShowCustomRegion(prev => ({...prev, seller: show}))}
        onSubmit={(e) => handleSubmit(e, 'seller')}
      />
      <SurveySection 
        showCustomRegion={showCustomRegion.survey || false}
        onRegionChange={(show) => setShowCustomRegion(prev => ({...prev, survey: show}))}
        onSubmit={(e) => handleSubmit(e, 'survey')}
      />
      <WhyFarmerSection scrollToSection={scrollToSection} />
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default Index;
