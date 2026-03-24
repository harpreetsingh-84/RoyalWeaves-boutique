import React, { useState, useEffect } from 'react';

const GlobalLoader = ({ children }: { children: React.ReactNode }) => {
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    // Intercept native window.fetch to trigger global loader everywhere
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      // Small delay prevents flickering for extremely fast API calls (<100ms)
      let isFast = true;
      const t = setTimeout(() => {
        if (!isFast) setActiveRequests((prev) => prev + 1);
      }, 100);
      
      isFast = false;

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        clearTimeout(t);
        setActiveRequests((prev) => Math.max(0, prev - 1));
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const isApiLoading = activeRequests > 0;

  return (
    <>
      {children}
      {isApiLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/50 backdrop-blur-md animate-in fade-in duration-500 pointer-events-auto">
          <div className="w-16 h-16 border-[3px] border-gray-100 border-t-gray-900 rounded-full animate-spin shadow-2xl"></div>
          <p className="mt-6 text-xs font-semibold tracking-[0.3em] text-gray-900 uppercase">Please wait</p>
        </div>
      )}
    </>
  );
};

export default GlobalLoader;
