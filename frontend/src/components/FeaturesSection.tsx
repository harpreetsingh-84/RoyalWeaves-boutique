import { ShieldCheck, Sparkles, Truck, Clock } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-primaryAction" />,
      title: "Premium Quality",
      description: "Crafted from the finest materials with meticulous attention to every stitch."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-secondaryAction" />,
      title: "Secure Checkout",
      description: "State-of-the-art encryption ensures your payment details are always safe."
    },
    {
      icon: <Truck className="w-6 h-6 text-highlight" />,
      title: "Fast Delivery",
      description: "Express shipping available globally so you never miss an event."
    },
    {
      icon: <Clock className="w-6 h-6 text-lightText" />,
      title: "24/7 Support",
      description: "Our fashion consultants are available around the clock to assist you."
    }
  ];

  return (
    <section className="py-24 bg-darkBg border-y border-lightText/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <ScrollReveal key={idx} delay={idx * 150} className="group">
              <div className="h-full premium-card p-8 flex flex-col items-start bg-[#021526] hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-lightText/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-serif text-lightText mb-3">{feat.title}</h3>
                <p className="text-sm font-light text-lightText/60 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
