import React from 'react';
import { useShop } from '../context/ShopContext';

interface GlobalLoaderProps {
  children: React.ReactNode;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ children }) => {
  const { isAuthChecking } = useShop();

  if (isAuthChecking) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 z-50 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium tracking-wide animate-pulse">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default GlobalLoader;
