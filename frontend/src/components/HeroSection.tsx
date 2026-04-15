import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from './ScrollReveal';

export const HeroSection = ({ slides = [] }: { slides?: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !slides || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000); // changes slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused, slides]);

  const goToNextSlide = () => {
    if (!slides || slides.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    if (!slides || slides.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0) return <div className="min-h-[90vh] bg-darkBg" />;

  return (
    <section 
      className="relative min-h-[90vh] bg-darkBg flex items-center justify-center overflow-hidden pt-16 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-darkBg via-[#021b30] to-darkBg opacity-90 transition-all duration-1000"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primaryAction/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondaryAction/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-6 relative z-10 w-full min-h-[70vh] flex flex-col justify-center">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 md:inset-auto md:relative w-full h-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 transition-all duration-1000 ease-in-out pb-20 md:pb-0 ${
              index === currentIndex 
                ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' 
                : 'opacity-0 translate-x-8 -z-10 pointer-events-none md:absolute md:top-0 md:left-0'
            }`}
          >
            {/* Text Content */}
            <div className={`w-full lg:w-1/2 flex flex-col items-start text-left pt-12 md:pt-0 ${index !== currentIndex && 'hidden md:flex'}`}>
              <ScrollReveal delay={100} key={`subtitle-${index}`}>
                <span className="inline-block px-3 py-1 mb-4 md:mb-6 text-xs md:text-sm font-semibold tracking-widest text-secondaryAction bg-secondaryAction/10 rounded-full border border-secondaryAction/20 uppercase shadow-sm">
                  {slide.subtitle}
                </span>
              </ScrollReveal>

              <ScrollReveal delay={200} key={`title-${index}`}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-lightText leading-[1.1] mb-4 md:mb-6 drop-shadow-md whitespace-pre-wrap">
                  {slide.title}
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={300} key={`desc-${index}`}>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-lightText/80 max-w-lg mb-6 md:mb-8 leading-relaxed line-clamp-3 md:line-clamp-none">
                  {slide.description}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={400} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto" key={`btns-${index}`}>
                <Link to="/collection" className="btn-primary text-center group/btn flex items-center justify-center gap-2 relative overflow-hidden backdrop-blur-md">
                  <span className="relative z-10">Explore Collection</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <a href="#how-it-works" className="btn-secondary text-center group/btn relative overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <span className="relative z-10">How it works</span>
                </a>
              </ScrollReveal>
            </div>

            {/* Visual / Mockup */}
            <div className={`w-full lg:w-1/2 relative flex justify-center lg:justify-end pb-8 lg:pb-0 ${index !== currentIndex && 'hidden md:flex'}`}>
              <ScrollReveal delay={500} className="relative w-full max-w-[260px] sm:max-w-xs md:max-w-sm" key={`img-${index}`}>
                {/* Image Container with Glassmorphism border effect */}
                <div className="relative z-10 w-full aspect-[3/4] rounded-2xl overflow-hidden glass-panel border border-lightText/20 shadow-[0_20px_50px_rgba(255,255,252,0.05)] animate-bounce-soft bg-darkBg/50 backdrop-blur-sm">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    loading={index === 0 ? "eager" : "lazy"}
                    onError={(e) => { e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22600%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23020126%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.5%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E"; }}
                    className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkBg/90 via-darkBg/20 to-transparent pointer-events-none"></div>
                  
                  {/* Floating Glass Element inside slide */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 backdrop-blur-md bg-darkBg/30 border border-lightText/10 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-xl">
                    <div className="overflow-hidden">
                      <p className="text-[10px] sm:text-xs text-lightText/70 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">Featured</p>
                      <p className="text-xs sm:text-sm text-lightText font-serif font-semibold truncate max-w-[120px] sm:max-w-[160px]">{slide.title}</p>
                    </div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full bg-lightText/20 flex items-center justify-center hover:bg-lightText hover:text-darkBg transition-colors duration-300">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Background Accents */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 border border-lightText/20 rounded-full animate-slow-zoom pointer-events-none"></div>
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-32 h-32 sm:w-48 sm:h-48 border border-lightText/10 rounded-full animate-slow-zoom pointer-events-none delay-700"></div>
              </ScrollReveal>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={goToPrevSlide}
            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-md bg-white/5 border border-white/10 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-lightText hover:text-darkBg z-20 text-lightText shadow-lg hover:scale-110"
            aria-label="Previous Slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNextSlide}
            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-md bg-white/5 border border-white/10 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-lightText hover:text-darkBg z-20 text-lightText shadow-lg hover:scale-110"
            aria-label="Next Slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-30 backdrop-blur-sm bg-darkBg/20 px-4 py-2 rounded-full border border-lightText/10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                index === currentIndex 
                  ? 'bg-lightText w-8 shadow-[0_0_10px_rgba(255,255,252,0.8)]' 
                  : 'bg-lightText/30 hover:bg-lightText/60 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Scroll Indicator */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center animate-bounce-soft opacity-60 z-20">
        <span className="text-[10px] text-lightText tracking-widest uppercase mb-2 font-medium">Scroll</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-lightText to-transparent rounded-full shadow-[0_0_8px_rgba(255,255,252,0.5)]"></div>
      </div>
    </section>
  );
};
