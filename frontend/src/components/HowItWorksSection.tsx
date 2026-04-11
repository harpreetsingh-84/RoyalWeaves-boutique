import { ScrollReveal } from './ScrollReveal';

export const HowItWorksSection = ({ steps = [] }: { steps?: any[] }) => {
  const defaultSteps = [
    {
      num: "01",
      title: "Discover Your Style",
      desc: "Browse our exclusive collections. From modern casuals to elegant evening wear, find the perfect piece that speaks to your aesthetic.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
    },
    {
      num: "02",
      title: "Tailor to Perfection",
      desc: "Ensure the perfect fit. Make use of our detailed sizing guides and customization options for a bespoke experience.",
      image: "https://images.unsplash.com/photo-1558769132-cb1fac0840c2?q=80&w=800&auto=format&fit=crop"
    },
    {
      num: "03",
      title: "Unbox Elegance",
      desc: "Receive your garment in luxury sustainable packaging, delivered directly to your doorstep with express worldwide shipping.",
      image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const dataToRender = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-darkBg relative overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-16 md:mb-24">
          <span className="text-secondaryAction text-sm font-semibold tracking-widest uppercase mb-4 block">The Process</span>
          <h2 className="text-3xl md:text-5xl font-serif text-lightText">How It Works</h2>
        </ScrollReveal>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-primaryAction/50 via-secondaryAction/50 to-transparent -translate-x-1/2 z-0"></div>

          <div className="space-y-24 md:space-y-32">
            {dataToRender.map((step, idx) => (
              <div key={idx} className={`relative z-10 flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}>
                
                {/* Image Side */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <ScrollReveal delay={100} className="relative w-full max-w-sm">
                    {/* Number Badge */}
                    <div className={`absolute -top-6 ${idx % 2 === 0 ? '-left-6' : '-right-6'} w-16 h-16 rounded-full bg-darkBg border border-secondaryAction/30 flex items-center justify-center z-20 shadow-lg text-2xl font-serif text-lightText`}>
                      {step.num}
                    </div>
                    
                    <div className="relative aspect-square overflow-hidden rounded-2xl group premium-card">
                      <img 
                        src={step.image} 
                        alt={step.title} 
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%2303233c%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.5%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EImage%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E"; }}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-darkBg/20 group-hover:bg-darkBg/10 transition-colors"></div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Text Side */}
                <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'text-left md:text-left' : 'text-left md:text-right'}`}>
                  <ScrollReveal delay={200}>
                    <h3 className="text-2xl md:text-3xl font-serif text-lightText mb-4">{step.title}</h3>
                    <p className="text-lightText/70 font-light leading-relaxed mb-6">
                      {step.desc}
                    </p>
                    {idx < steps.length - 1 && (
                      <div className="inline-flex items-center gap-2 text-sm text-secondaryAction font-medium tracking-wide uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                        <span>Next Step</span>
                        <svg className="w-4 h-4 animate-bounce-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    )}
                  </ScrollReveal>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
