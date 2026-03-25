import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Navbar = () => {
  const { cart, isAdmin, isAuthenticated, setIsAdmin, setIsAuthenticated, currency, setCurrency } = useShop();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      setIsMenuOpen(false);
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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`fixed w-full top-0 transition-all duration-500 z-50 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold tracking-tight ${textClass}`} onClick={closeMenu}>
          Royal<span className={`font-light ${logoAccentClass}`}>Weaves</span>
        </Link>
        
        {/* Desktop Menu */}
        <ul className={`hidden md:flex gap-6 md:gap-8 items-center ${textClass}`}>
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
              <li>
                <Link to="/register" className={`font-semibold tracking-wide text-xs uppercase px-4 py-2 border transition-colors rounded-sm shadow-sm
                ${isHome && !scrolled ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'}`}>
                  Register
                </Link>
              </li>
            </div>
          )}
        </ul>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-4">
          {isAuthenticated && (
             <Link to="/cart" className={`relative flex items-center gap-2 font-medium tracking-wide text-sm uppercase ${textClass}`}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
             {cartCount > 0 && (
               <span className={`text-[10px] flex items-center justify-center w-4 h-4 font-bold rounded-full ${cartBadgeClass} absolute -top-1 -right-2`}>
                 {cartCount}
               </span>
             )}
           </Link>
          )}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`focus:outline-none ${textClass} ml-2`}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-4 px-6 flex flex-col gap-4 text-gray-900 z-40">
          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-500">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-50 px-3 py-1 rounded-sm text-sm font-semibold tracking-wider outline-none cursor-pointer uppercase text-gray-900 border border-gray-200"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link to="/collection" onClick={closeMenu} className="font-medium hover:bg-gray-50 transition-colors tracking-wide text-sm uppercase py-3 border-b border-gray-50">Collection</Link>
              {isAdmin && (
                <Link to="/admin" onClick={closeMenu} className="font-medium hover:bg-gray-50 transition-colors tracking-wide text-sm uppercase py-3 border-b border-gray-50">Admin Panel</Link>
              )}
              <Link to="/cart" onClick={closeMenu} className="flex items-center justify-between font-medium hover:text-accent transition-colors tracking-wide text-sm uppercase pt-3 border-b border-gray-50 pb-3">
                Cart
                {cartCount > 0 && (
                  <span className="bg-accent text-white text-xs flex items-center justify-center px-2 py-1 font-bold rounded-sm">
                    {cartCount} Items
                  </span>
                )}
              </Link>
              <button 
                onClick={handleLogout}
                className="mt-4 font-bold tracking-widest text-xs uppercase px-4 py-4 flex items-center justify-center rounded-sm transition-colors border bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login" onClick={closeMenu} className="text-center font-bold hover:bg-gray-100 transition-colors tracking-widest text-sm uppercase py-4 bg-gray-50 rounded-sm border border-gray-200">Login</Link>
              <Link to="/register" onClick={closeMenu} className="text-center font-bold tracking-widest text-sm uppercase px-4 py-4 bg-gray-900 text-white rounded-sm hover:bg-black transition-colors shadow-md">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
