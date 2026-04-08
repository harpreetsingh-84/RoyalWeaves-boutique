import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
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
      { name: 'Evening Gowns', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600' },
      { name: 'Summer Dresses', image: 'https://images.unsplash.com/photo-1572804013309-82a89b4b09fd?q=80&w=600' }
    ]
  };

  useEffect(() => {
    if (!content) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.heroSlides.length);
    }, 5500); // Cross-fade every 5.5 seconds
    
    return () => clearInterval(timer);
  }, [content]);

  if (!content) {
    return (
      <div className="h-screen bg-darkBg flex flex-col justify-center items-center pb-32">
        <div className="w-16 h-16 border-4 border-lightText/20 border-t-primaryAction rounded-full animate-spin shadow-[0_0_15px_rgba(231,29,54,0.5)]"></div>
        <p className="mt-6 text-xs text-secondaryAction tracking-[0.2em] font-medium uppercase animate-pulse">Curating The Collection</p>
      </div>
    );
  }

  return (
    <div className="fade-in pb-0">
      {/* Hero Section (Auto-Playing Slider) */}
      <div className="relative h-screen bg-darkBg flex items-center justify-center overflow-hidden mb-24">
        
        {content.heroSlides.map((slide: any, idx: number) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallbackSrc = 'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=2070&auto=format&fit=crop';
                if (target.src !== fallbackSrc) {
                  target.src = fallbackSrc;
                  target.className += ' opacity-30 grayscale';
                } else {
                  target.onerror = null; // Prevent further loops if fallback also fails
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover object-top opacity-50 ${idx === currentSlide ? 'animate-slow-zoom' : ''}`}
            />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 text-center text-lightText px-6 mt-16 max-w-4xl">
          <span className="block text-secondaryAction font-medium tracking-widest uppercase text-[10px] md:text-sm mb-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100 fill-mode-both" key={`sub-${currentSlide}`}>
            {content.heroSlides[currentSlide].subtitle}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif mb-4 md:mb-6 tracking-wide drop-shadow-[0_0_15px_rgba(253,255,252,0.3)] font-normal animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-300 fill-mode-both leading-[1.1] md:leading-tight" key={`title-${currentSlide}`}>
            {content.heroSlides[currentSlide].title}
          </h1>
          <p className="text-sm md:text-xl font-light max-w-2xl mx-auto mb-8 md:mb-10 drop-shadow-md text-lightText/90 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500 fill-mode-both px-4" key={`desc-${currentSlide}`}>
            {content.heroSlides[currentSlide].description}
          </p>
          <Link to="/collection" className="inline-block btn-primary px-8 py-3.5 md:px-10 md:py-4 shadow-2xl animate-in zoom-in-95 fade-in duration-700 delay-700 fill-mode-both">
            Explore Dresses
          </Link>
        </div>

        {/* Slider Pagination Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {content.heroSlides.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-10 bg-secondaryAction shadow-[0_0_10px_rgba(46,196,182,0.8)]' : 'w-3 bg-secondaryAction/40 hover:bg-secondaryAction/80'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-6 mb-24 md:mb-32 fade-in">
        <div className="flex flex-col items-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-lightText drop-shadow-sm text-center">Shop by Category</h2>
          <div className="w-16 h-0.5 bg-secondaryAction mt-4 md:mt-6"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.featuredCategories.map((cat: any) => (
            <Link to="/collection" key={cat.name} className="relative group h-96 overflow-hidden premium-card !rounded-sm cursor-pointer block">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-darkBg/30 group-hover:bg-darkBg/50 transition-colors duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-primaryAction text-lightText px-8 py-3 rounded-full font-semibold tracking-widest uppercase text-sm shadow-[0_4px_14px_0_rgba(231,29,54,0.39)] transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 text-center">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-darkBg relative border-t border-secondaryAction/20 py-24 px-6 before:absolute before:inset-0 before:bg-secondaryAction/5 before:pointer-events-none">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-lightText">Join The List</h2>
          <p className="text-lightText/70 mb-10 tracking-wide font-light">Subscribe to receive updates, access to exclusive deals, and more luxury fashion insights directly to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-0 justify-center max-w-xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <input type="email" placeholder="Enter your email address" className="px-6 py-4 w-full bg-[#03233c] border border-secondaryAction/20 sm:border-r-0 rounded-t-sm sm:rounded-l-sm sm:rounded-tr-none focus:outline-none focus:border-secondaryAction/50 text-lightText font-medium placeholder-lightText/40 transition-colors" />
            <button className="btn-primary !rounded-t-none sm:!rounded-l-none sm:!rounded-r-sm h-full flex items-center justify-center">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
