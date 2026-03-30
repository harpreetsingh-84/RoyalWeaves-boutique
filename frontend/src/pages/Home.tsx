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
        }
      } catch (e) {
        console.error("Failed to fetch content", e);
      }
    };
    loadContent();
  }, []);

  useEffect(() => {
    if (!content) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.heroSlides.length);
    }, 5500); // Cross-fade every 5.5 seconds
    
    return () => clearInterval(timer);
  }, [content]);

  if (!content) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col justify-center items-center pb-32">
        <div className="w-16 h-16 border-4 border-gray-800 border-t-accent rounded-full animate-spin"></div>
        <p className="mt-6 text-xs text-gray-500 tracking-[0.2em] font-medium uppercase animate-pulse">Curating The Collection</p>
      </div>
    );
  }

  return (
    <div className="fade-in pb-0">
      {/* Hero Section (Auto-Playing Slider) */}
      <div className="relative h-screen bg-gray-900 flex items-center justify-center overflow-hidden mb-24">
        
        {content.heroSlides.map((slide: any, idx: number) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=2070&auto=format&fit=crop'; // Elegant dark fabric placeholder
                (e.target as HTMLImageElement).className += ' opacity-30 grayscale';
              }}
              className={`absolute inset-0 w-full h-full object-cover object-top opacity-50 ${idx === currentSlide ? 'animate-slow-zoom' : ''}`}
            />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 text-center text-white px-6 mt-16 max-w-4xl">
          <span className="block text-accent font-medium tracking-widest uppercase text-[10px] md:text-sm mb-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100 fill-mode-both" key={`sub-${currentSlide}`}>
            {content.heroSlides[currentSlide].subtitle}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif mb-4 md:mb-6 tracking-wide drop-shadow-2xl font-normal animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-300 fill-mode-both leading-[1.1] md:leading-tight" key={`title-${currentSlide}`}>
            {content.heroSlides[currentSlide].title}
          </h1>
          <p className="text-sm md:text-xl font-light max-w-2xl mx-auto mb-8 md:mb-10 drop-shadow-md text-gray-200 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500 fill-mode-both px-4" key={`desc-${currentSlide}`}>
            {content.heroSlides[currentSlide].description}
          </p>
          <Link to="/collection" className="inline-block bg-white text-gray-900 font-bold px-8 py-3.5 md:px-10 md:py-4 hover:bg-accent hover:text-white transition-all duration-300 shadow-2xl tracking-widest uppercase text-xs md:text-sm rounded-sm animate-in zoom-in-95 fade-in duration-700 delay-700 fill-mode-both">
            Explore Dresses
          </Link>
        </div>

        {/* Slider Pagination Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {content.heroSlides.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-10 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-6 mb-24 md:mb-32 fade-in">
        <div className="flex flex-col items-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 drop-shadow-sm text-center">Shop by Category</h2>
          <div className="w-16 h-0.5 bg-accent mt-4 md:mt-6"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.featuredCategories.map((cat: any) => (
            <Link to="/collection" key={cat.name} className="relative group h-96 overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 rounded-sm block">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white/95 text-gray-900 px-8 py-3 rounded-sm font-semibold tracking-widest uppercase text-sm shadow-xl transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 text-center">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-900 py-24 px-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">Join The List</h2>
          <p className="text-gray-400 mb-10 tracking-wide font-light">Subscribe to receive updates, access to exclusive deals, and more luxury fashion insights directly to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-0 justify-center max-w-xl mx-auto shadow-2xl">
            <input type="email" placeholder="Enter your email address" className="px-6 py-4 w-full border-none rounded-t-sm sm:rounded-l-sm sm:rounded-tr-none focus:outline-none text-gray-900 font-medium" />
            <button className="bg-accent text-white px-10 py-4 rounded-b-sm sm:rounded-r-sm sm:rounded-bl-none hover:bg-yellow-600 transition-colors uppercase tracking-widest text-sm font-bold">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
