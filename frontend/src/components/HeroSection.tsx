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
    }, 4500); // 4.5 seconds per slide for relaxed viewing

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
      className="relative min-h-[90vh] md:h-screen bg-darkBg flex items-center justify-center overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides rendered as complete full-width backgrounds */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex 
              ? 'opacity-100 z-10 pointer-events-auto' 
              : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Full Width Background Image */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt={slide.title} 
              loading={index === 0 ? "eager" : "lazy"}
              onError={(e) => { e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221200%22%20height%3D%22800%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%232a2a2a%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.5%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E"; }}
              className="w-full h-full object-cover object-center"
            />
            {/* Elegant dark overlay to ensure text is perfectly readable */}
            <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
          </div>

          {/* Centered Text Overlay */}
          <div className="relative z-20 container mx-auto px-6 h-full flex flex-col items-center justify-center text-center pb-12 sm:pb-0 pt-20">
            <ScrollReveal delay={100} key={`subtitle-${index}`}>
              <span className="inline-block px-4 py-1.5 mb-6 text-xs md:text-sm font-semibold tracking-[0.2em] text-white backdrop-blur-sm bg-black/20 rounded-full border border-white/20 uppercase shadow-lg">
                {slide.subtitle}
              </span>
            </ScrollReveal>

            <ScrollReveal delay={200} key={`title-${index}`}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight md:leading-[1.1] mb-6 drop-shadow-2xl whitespace-pre-wrap max-w-4xl mx-auto">
                {slide.title}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={300} key={`desc-${index}`}>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
                {slide.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400} className="flex flex-col sm:flex-row gap-5 items-center justify-center" key={`btns-${index}`}>
              <Link to="/collection" className="btn-primary text-center group/btn flex items-center justify-center gap-2 relative overflow-hidden backdrop-blur-md px-10 py-4 shadow-2xl hover:shadow-[0_0_20px_rgba(4,22,32,0.8)]">
                <span className="relative z-10 text-[15px]">Explore Collection</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={goToPrevSlide}
            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full backdrop-blur-md bg-black/20 border border-white/30 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-darkBg z-30 text-white shadow-2xl hover:scale-110"
            aria-label="Previous Slide"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNextSlide}
            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full backdrop-blur-md bg-black/20 border border-white/30 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-darkBg z-30 text-white shadow-2xl hover:scale-110"
            aria-label="Next Slide"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-40 backdrop-blur-md bg-black/20 px-5 py-3 rounded-full border border-white/20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                index === currentIndex 
                  ? 'bg-white w-10 shadow-[0_0_12px_rgba(255,255,255,1)]' 
                  : 'bg-white/40 hover:bg-white/80 w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
