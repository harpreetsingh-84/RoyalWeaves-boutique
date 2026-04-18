import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { GoogleLogin } from '@react-oauth/google';
import { apiService } from '../services/api';

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAdmin, setIsAuthenticated, verifyAuth } = useShop();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const res = await apiService.googleAuth({ credential: credentialResponse.credential });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setIsAdmin(data.isAdmin);
        await verifyAuth();
        navigate('/');
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-[80vh] flex items-center justify-center fade-in bg-darkBg px-6 pt-24 pb-12 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="max-w-md w-full bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-lightText mb-2">Welcome Back</h2>
          <p className="text-lightText/70 text-sm tracking-wide">Sign in to access your curated collection.</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-sm mb-6 text-sm font-medium border border-red-100">{error}</div>}
        
        <div className="flex flex-col items-center justify-center mb-4 w-full overflow-hidden">
          {isLoading ? (
            <div className="flex items-center gap-3 text-primaryAction font-medium p-3">
              <div className="w-5 h-5 border-2 border-primaryAction border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed natively')}
              theme="filled_black"
              shape="rectangular"
              text="signin_with"
              size="large"
            />
          )}
        </div>
        <p className="mt-8 text-center text-lightText/70 text-sm">
          Don't have an account? <Link to="/register" className="text-primaryAction font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
