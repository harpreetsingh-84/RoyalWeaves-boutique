import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { CTASection } from '../components/CTASection';
import { ScrollReveal } from '../components/ScrollReveal';

const Home = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await apiService.getContent();
        if (res.ok) {
          setContent(await res.json());
        } else {
          setContent(fallbackContent);
        }
      } catch (e) {
        console.error("Failed to fetch content", e);
        setContent(fallbackContent);
      }
    };
    loadContent();
  }, []);

  const fallbackContent = {
    heroSlides: [
      {
        image: "https://images.unsplash.com/photo-1515347619252-a3915155cc9c?q=80&w=2070&auto=format&fit=crop",
        subtitle: "The Signature Collection",
        title: "Elegance Redefined",
        description: "Discover our exclusive range of luxury women's dresses."
      }
    ],
    featuredCategories: [
      { name: 'Evening Gowns', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600' }
    ],
    features: [],
    howItWorks: [],
    testimonials: []
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col pt-24 px-6 md:px-12 w-full max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-6 w-32 bg-lightText/10 rounded-full animate-shimmer overflow-hidden relative">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-lightText/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
            <div className="h-20 md:h-32 w-full bg-lightText/5 rounded-xl animate-shimmer overflow-hidden relative">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-lightText/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
            <div className="h-12 w-48 bg-lightText/5 rounded-md animate-shimmer overflow-hidden relative mt-8">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-lightText/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-end">
             <div className="h-[400px] w-[300px] bg-lightText/5 rounded-2xl animate-shimmer overflow-hidden relative">
               <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-lightText/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-darkBg overflow-x-hidden">
      <HeroSection />
      
      {/* Dynamic Featured Categories from API */}
      <section className="py-24 bg-darkBg relative z-10 border-t border-lightText/5">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-lightText mb-4">Shop by Category</h2>
            <div className="w-16 h-0.5 bg-secondaryAction mx-auto mt-4"></div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.featuredCategories?.map((cat: any, idx: number) => (
              <ScrollReveal key={cat.name} delay={idx * 150}>
                <Link to="/collection" className="relative group h-96 overflow-hidden premium-card cursor-pointer block">
                  <img src={cat.image} alt={cat.name} loading="lazy" onError={(e) => { e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%2303233c%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.5%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E"; }} className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-darkBg/30 group-hover:bg-darkBg/50 transition-colors duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-primaryAction text-lightText px-8 py-3 rounded-full font-semibold tracking-widest uppercase text-sm shadow-[0_4px_14px_0_rgba(231,29,54,0.39)] transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 text-center">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection features={content.features} />
      <HowItWorksSection steps={content.howItWorks} />
      <TestimonialsSection testimonials={content.testimonials} />
      <CTASection />

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 animate-fade-in-up" style={{ animationDelay: '2s' }}>
        <Link to="/collection" className="block w-full btn-primary text-center shadow-2xl py-4 shadow-primaryAction/40">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
