import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const LoginPromptModal: React.FC = () => {
  const { loginPromptConfig, closeLoginPrompt, isAuthenticated } = useShop();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation
    if (loginPromptConfig.isOpen && !isAuthenticated) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [loginPromptConfig.isOpen, isAuthenticated]);

  // If missing or user is authenticated, render nothing
  if (!loginPromptConfig.isOpen || isAuthenticated) return null;

  const isCheckout = loginPromptConfig.type === 'checkout';

  const handleIgnore = () => {
    closeLoginPrompt();
  };

  const handleLogin = () => {
    closeLoginPrompt();
    navigate('/login');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLoginPrompt();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <div 
        className={`bg-[#1a1a1a] rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        <div className="relative p-6 sm:p-8">
          <button 
            onClick={handleIgnore}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-100 transition-colors bg-[#222] hover:bg-[#2a2a2a] rounded-full"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center text-center mt-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner ${isCheckout ? 'bg-red-50 text-red-500' : 'bg-[#222] text-gray-100'}`}>
              {isCheckout ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
            </div>
            
            <h3 className="text-xl font-serif font-bold text-gray-100 mb-2">
              {isCheckout ? 'Authentication Required' : 'Save Your Cart'}
            </h3>
            
            <p className="text-sm text-gray-400 font-light leading-relaxed mb-8 px-2">
              {isCheckout 
                ? 'Please log in or create an account to securely complete your purchase and book your order.' 
                : 'Do you want to save your cart items securely to your account and avoid losing them across devices?'}
            </p>
            
            <div className="flex justify-center w-full">
               <button 
                 onClick={handleLogin}
                 className="flex-1 bg-primary text-white font-bold text-xs uppercase tracking-widest py-4 px-6 hover:bg-accent transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
               >
                 Log in / Sign up
               </button>
            </div>
            
            <button 
               onClick={handleIgnore}
               className="mt-4 text-xs font-semibold text-gray-400 hover:text-gray-100 uppercase tracking-widest transition-colors py-2 px-4 focus:outline-none"
            >
               {isCheckout ? 'Cancel Checkout' : 'Ignore for now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
