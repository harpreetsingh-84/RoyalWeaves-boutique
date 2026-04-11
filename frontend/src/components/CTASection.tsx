import { Link } from 'react-router-dom';
import { ScrollReveal } from './ScrollReveal';

export const CTASection = () => {
  return (
    <section className="relative py-32 bg-darkBg flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2000&auto=format&fit=crop" 
          alt="Fashion Background" 
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/90 to-darkBg/60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl font-serif text-lightText mb-6 tracking-wide drop-shadow-lg">
            Ready to Elevate Your Wardrobe?
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={150}>
          <p className="text-lg md:text-xl text-lightText/80 mb-10 font-light leading-relaxed">
            Join thousands of women who have discovered their perfect fit. Get 10% off your first luxury piece when you join today.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/collection" className="btn-primary px-10 py-4 text-base shadow-[0_0_20px_rgba(231,29,54,0.4)] hover:shadow-[0_0_30px_rgba(231,29,54,0.6)] group flex items-center justify-center gap-2">
            Shop The Collection
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link to="/register" className="btn-secondary px-10 py-4 text-base bg-darkBg/50 backdrop-blur-sm group flex items-center justify-center">
            Create an Account
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};
