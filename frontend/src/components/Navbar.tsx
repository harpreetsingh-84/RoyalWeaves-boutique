import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Navbar = () => {
  const { cart, isAdmin, isAuthenticated, setIsAdmin, setIsAuthenticated } = useShop();
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
        <Link to="/" className={`text-[1.15rem] sm:text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap ${textClass}`} onClick={closeMenu}>
          Woven Wonder <span className={`font-light ${logoAccentClass}`}>Creation</span>
        </Link>
        
        {/* Desktop Menu */}
        <ul className={`hidden md:flex gap-6 md:gap-8 items-center ${textClass}`}>
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
                <Link to="/myorders" className="font-medium hover:text-accent transition-colors tracking-wide text-sm uppercase">My Orders</Link>
              </li>

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

      {/* Mobile Menu Side Drawer Overlay */}
      <div className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeMenu}></div>
      
      {/* Mobile Menu Sliding Drawer */}
      <div className={`md:hidden fixed top-0 right-0 h-[100dvh] w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col overflow-hidden`}>
         <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
            <span className="font-bold text-lg text-gray-900">Menu</span>
            <button onClick={closeMenu} className="text-gray-500 hover:text-black">
               ✕
            </button>
         </div>
         
         <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col text-gray-900 justify-center">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
              <Link to="/collection" onClick={closeMenu} className="font-medium hover:bg-gray-50 transition-colors tracking-wide text-sm uppercase py-5 border-b border-gray-100 flex items-center justify-between">Collection <span>→</span></Link>
              {isAdmin && (
                <Link to="/admin" onClick={closeMenu} className="font-medium hover:bg-gray-50 transition-colors tracking-wide text-sm uppercase py-5 border-b border-gray-100 flex items-center justify-between">Admin Panel <span>→</span></Link>
              )}
              <Link to="/myorders" onClick={closeMenu} className="font-medium hover:text-accent transition-colors tracking-wide text-sm uppercase py-5 border-b border-gray-100 flex items-center justify-between">My Orders <span>→</span></Link>
              <Link to="/cart" onClick={closeMenu} className="flex items-center justify-between font-medium hover:text-accent transition-colors tracking-wide text-sm uppercase py-5 border-b border-gray-100">
                Cart
                {cartCount > 0 && (
                  <span className="bg-accent text-white text-[10px] flex items-center justify-center h-6 w-6 font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
              <Link to="/login" onClick={closeMenu} className="text-center font-bold hover:bg-gray-100 transition-colors tracking-widest text-sm uppercase py-5 bg-gray-50 rounded-lg border border-gray-200 block w-full">Login</Link>
              <Link to="/register" onClick={closeMenu} className="text-center font-bold tracking-widest text-sm uppercase px-4 py-5 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors shadow-md block w-full">
                Register
              </Link>
            </div>
          )}
         </div>
         
         {isAuthenticated && (
            <div className="px-8 pb-8 pt-4 shrink-0">
              <button 
                onClick={handleLogout}
                className="w-full max-w-sm mx-auto font-bold tracking-widest text-sm uppercase py-4 flex items-center justify-center rounded-lg transition-colors border bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
         )}
      </div>
    </nav>
  );
};

export default Navbar;
