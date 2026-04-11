import { ScrollReveal } from './ScrollReveal';
import { Star } from 'lucide-react';

export const TestimonialsSection = ({ testimonials = [] }: { testimonials?: any[] }) => {
  if (!testimonials || testimonials.length === 0) return null;

  const dataToRender = testimonials;

  return (
    <section className="py-24 bg-[#011b2e] border-y border-lightText/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-lightText mb-4">Loved by Women Worldwide</h2>
          <p className="text-lightText/60 max-w-2xl mx-auto font-light">
            Don't just take our word for it. Here's what our community has to say about their experience.
          </p>
        </ScrollReveal>

        {/* Swipe-friendly horizontal scroll container */}
        <ScrollReveal delay={200}>
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbars -mx-6 px-6 md:mx-0 md:px-0">
            {dataToRender.map((review, idx) => (
              <div 
                key={idx} 
                className="min-w-[280px] md:min-w-[350px] bg-darkBg/50 premium-card p-8 rounded-2xl snap-center flex-shrink-0"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-highlight text-highlight" />
                  ))}
                </div>
                <p className="text-lightText/90 font-light italic mb-6 leading-relaxed">
                  "{review.content}"
                </p>
                <div className="mt-auto">
                  <p className="text-lightText font-semibold font-serif">{review.name}</p>
                  <p className="text-xs text-secondaryAction uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            ))}
            
            {/* Peeking card hint for scroll */}
            <div className="min-w-[40px] md:hidden flex-shrink-0"></div>
          </div>
          
          {/* Swipe Hint */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-6 text-lightText/40 text-xs tracking-widest uppercase animate-soft-pulse">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>Swipe</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        .hide-scrollbars::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbars {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
