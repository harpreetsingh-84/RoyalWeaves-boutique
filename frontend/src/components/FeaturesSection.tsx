import { ShieldCheck, Sparkles, Truck, Clock } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

// Reusable icon mapper
const iconMap: any = {
  Sparkles: <Sparkles className="w-6 h-6 text-primaryAction group-hover:animate-soft-pulse" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-secondaryAction group-hover:animate-soft-pulse" />,
  Truck: <Truck className="w-6 h-6 text-highlight group-hover:animate-soft-pulse" />,
  Clock: <Clock className="w-6 h-6 text-lightText group-hover:animate-soft-pulse" />
};

export const FeaturesSection = ({ features = [] }: { features?: any[] }) => {
  const defaultFeatures = [
    {
      icon: 'Sparkles',
      title: "Premium Quality",
      description: "Crafted from the finest materials with meticulous attention to every stitch."
    },
    {
      icon: 'ShieldCheck',
      title: "Secure Checkout",
      description: "State-of-the-art encryption ensures your payment details are always safe."
    },
    {
      icon: 'Truck',
      title: "Fast Delivery",
      description: "Express shipping available globally so you never miss an event."
    },
    {
      icon: 'Clock',
      title: "24/7 Support",
      description: "Our fashion consultants are available around the clock to assist you."
    }
  ];

  const dataToRender = features && features.length > 0 ? features : defaultFeatures;

  return (
    <section className="py-24 bg-darkBg border-y border-lightText/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dataToRender.map((feat, idx) => (
            <ScrollReveal key={idx} delay={idx * 150} className="group">
              <div className="h-full premium-card p-8 flex flex-col items-start bg-[#021526] hover:-translate-y-2 transition-all duration-300 active:scale-95 touch-manipulation">
                <div className="w-12 h-12 rounded-xl bg-lightText/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(231,29,54,0.3)]">
                  {iconMap[feat.icon] || <Sparkles className="w-6 h-6 text-primaryAction group-hover:animate-soft-pulse" />}
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
