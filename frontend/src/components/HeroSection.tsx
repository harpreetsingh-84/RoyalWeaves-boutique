import { Link } from 'react-router-dom';
import { ScrollReveal } from './ScrollReveal';

export const HeroSection = ({ slides = [] }: { slides?: any[] }) => {
  const activeSlide = slides && slides.length > 0 ? slides[0] : null;

  if (!activeSlide) return <div className="min-h-[90vh] bg-darkBg" />;

  return (
    <section className="relative min-h-[90vh] bg-darkBg flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-darkBg via-[#021b30] to-darkBg opacity-90"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primaryAction/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondaryAction/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left pt-12 lg:pt-0">
          <ScrollReveal delay={100}>
            <span className="inline-block px-3 py-1 mb-6 text-xs md:text-sm font-semibold tracking-widest text-secondaryAction bg-secondaryAction/10 rounded-full border border-secondaryAction/20 uppercase shadow-sm">
              {activeSlide.subtitle}
            </span>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-lightText leading-[1.1] mb-6 drop-shadow-md whitespace-pre-wrap">
              {activeSlide.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <p className="text-base sm:text-lg md:text-xl font-light text-lightText/80 max-w-lg mb-8 leading-relaxed">
              {activeSlide.description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/collection" className="btn-primary text-center group flex items-center justify-center gap-2">
              Explore Collection
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a href="#how-it-works" className="btn-secondary text-center group">
              How it works
            </a>
          </ScrollReveal>
        </div>

        {/* Visual / Mockup */}
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end pb-12 lg:pb-0">
          <ScrollReveal delay={500} className="relative w-full max-w-sm sm:max-w-md">
            <div className="relative z-10 w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(3,35,60,0.5)] border border-lightText/10 animate-bounce-soft">
              <img 
                src={activeSlide.image} 
                alt={activeSlide.title} 
                loading="eager"
                onError={(e) => { e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22600%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%2303233c%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.5%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E"; }}
                className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-darkBg/60 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Floating Element */}
              <div className="absolute bottom-6 left-6 right-6 glass-panel p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-lightText/60 font-medium uppercase tracking-wider mb-1">New Arrival</p>
                  <p className="text-sm text-lightText font-serif font-semibold">Midnight Velvet Gown</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primaryAction flex items-center justify-center shadow-[0_0_15px_rgba(231,29,54,0.5)] animate-soft-pulse">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border border-secondaryAction/30 rounded-full animate-slow-zoom pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border border-primaryAction/20 rounded-full animate-slow-zoom pointer-events-none delay-700"></div>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-soft opacity-60">
        <span className="text-[10px] text-lightText tracking-widest uppercase mb-2">Scroll</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-lightText to-transparent"></div>
      </div>
    </section>
  );
};
