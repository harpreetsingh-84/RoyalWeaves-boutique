import React from 'react';
import { useShop } from '../context/ShopContext';

interface GlobalLoaderProps {
  children: React.ReactNode;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ children }) => {
  const { isAuthChecking } = useShop();

  if (isAuthChecking) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-darkBg/95 z-50 backdrop-blur-md">
        <div className="w-12 h-12 border-4 border-lightText/20 border-t-secondaryAction rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(205,160,54,0.6)]"></div>
        <p className="text-secondaryAction font-serif tracking-widest uppercase text-sm animate-pulse">Curating the Royal Collection...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default GlobalLoader;
