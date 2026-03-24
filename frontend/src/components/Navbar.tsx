import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Navbar = () => {
  const { cart, isAdmin, isAuthenticated, setIsAdmin, setIsAuthenticated, currency, setCurrency } = useShop();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setIsAdmin(false);
      setIsAuthenticated(false);
    } catch (err) {
      console.error(err);
    }
  };

  const navClass = isHome 
    ? (scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6')
    : 'bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-gray-100';

  const textClass = isHome && !scrolled ? 'text-white drop-shadow-sm' : 'text-gray-900';
  const logoAccentClass = isHome && !scrolled ? 'text-yellow-400' : 'text-accent';
  const cartBadgeClass = isHome && !scrolled ? 'bg-white text-gray-900' : 'bg-accent text-white';

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold tracking-tight ${textClass}`}>
          Royal<span className={`font-light ${logoAccentClass}`}>Weaves</span>
        </Link>
        <ul className={`flex gap-6 md:gap-8 items-center ${textClass}`}>
          
          <li>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-xs font-semibold tracking-wider outline-none cursor-pointer uppercase transition-colors hover:text-accent opacity-90"
            >
              <option value="USD" className="text-gray-900">USD</option>
              <option value="EUR" className="text-gray-900">EUR</option>
              <option value="GBP" className="text-gray-900">GBP</option>
              <option value="INR" className="text-gray-900">INR</option>
            </select>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <Link to="/collection" className="font-medium hover:text-accent transition-colors tracking-wide text-sm uppercase">Collection</Link>
              </li>
              
              {isAdmin && (
                <li>
                  <Link to="/admin" className="font-medium hover:text-accent transition-colors tracking-wide text-sm uppercase">Admin Panel</Link>
                </li>
              )}
              
              <li>
                <Link to="/cart" className="flex items-center gap-2 font-medium hover:text-accent transition-colors tracking-wide text-sm uppercase">
                  Cart
                  {cartCount > 0 && (
                    <span className={`text-[10px] flex items-center justify-center w-5 h-5 font-bold rounded-full ${cartBadgeClass}`}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            </>
          )}

          {isAuthenticated ? (
            <li>
              <button 
                onClick={handleLogout}
                className={`font-medium tracking-wide text-xs uppercase px-4 py-2 flex items-center justify-center rounded-sm transition-colors border shadow-sm
                  bg-red-50 text-red-600 border-red-100 hover:bg-red-100`}
              >
                Logout
              </button>
            </li>
          ) : (
            <div className="flex items-center gap-3">
              <li>
                <Link to="/login" className="font-medium hover:text-accent transition-colors tracking-wide text-xs uppercase">Login</Link>
              </li>
              <li className="hidden sm:block">
                <Link to="/register" className={`font-semibold tracking-wide text-xs uppercase px-4 py-2 border transition-colors rounded-sm shadow-sm
                ${isHome && !scrolled ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'}`}>
                  Register
                </Link>
              </li>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
