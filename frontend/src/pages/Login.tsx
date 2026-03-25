import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { GoogleLogin } from '@react-oauth/google';
import { apiService } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await apiService.login({ email, password });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setIsAdmin(data.isAdmin);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center fade-in bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 md:p-12 rounded-sm shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm tracking-wide">Sign in to access your curated collection.</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-sm mb-6 text-sm font-medium border border-red-100">{error}</div>}
        
        <div className="flex justify-center mb-4 w-full overflow-hidden">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed natively')}
            theme="filled_black"
            shape="rectangular"
            text="signin_with"
            size="large"
          />
        </div>
        
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold tracking-widest uppercase">Or email</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-700 text-xs font-bold tracking-widest uppercase mb-2">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-accent transition-colors bg-gray-50 focus:bg-white" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-gray-700 text-xs font-bold tracking-widest uppercase mb-2">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-accent transition-colors bg-gray-50 focus:bg-white" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={isLoading} className={`w-full bg-gray-900 text-white font-bold py-4 rounded-sm hover:bg-accent transition-colors tracking-widest uppercase text-sm mt-4 shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/register" className="text-accent font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
