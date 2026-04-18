import { Navigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isAuthChecking } = useShop();

  if (isAuthChecking) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-adminBorderLight border-t-secondaryAction rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Verifying Access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
