import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.15 });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
    >
      {children}
    </div>
  );
};
