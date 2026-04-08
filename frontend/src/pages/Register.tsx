import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { GoogleLogin } from '@react-oauth/google';
import { apiService } from '../services/api';

const Register = () => {
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
        setError(data.message || 'Google registration failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-[80vh] flex items-center justify-center fade-in bg-[#222] px-6 mt-10 mb-10 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="max-w-md w-full bg-[#1a1a1a] p-6 sm:p-8 md:p-12 rounded-sm shadow-xl border border-[#333]">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-gray-100 mb-2">Join Woven Wonder Creation</h2>
          <p className="text-gray-400 text-sm tracking-wide">Create an account for exclusive access.</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-sm mb-6 text-sm font-medium border border-red-100">{error}</div>}
        
        <div className="flex flex-col items-center justify-center mb-4 w-full overflow-hidden">
          {isLoading ? (
            <div className="flex items-center gap-3 text-accent font-medium p-3">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              <span>Authenticating...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Registration Failed natively')}
              theme="filled_black"
              shape="rectangular"
              text="signup_with"
              size="large"
            />
          )}
        </div>
        <p className="mt-8 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-accent font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
