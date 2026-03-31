import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { apiService } from '../../services/api';
import { 
  LayoutDashboard, ShoppingBag, FolderTree, Package, 
  Users, ShieldCheck, Settings as SettingsIcon, LogOut,
  Menu, X, Home, Compass, ShoppingCart, ListOrdered
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { isAdmin, cart } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const storefrontNavItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Collection', path: '/collection', icon: <Compass size={20} /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingCart size={20} /> },
    { name: 'My Orders', path: '/myorders', icon: <ListOrdered size={20} /> },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <FolderTree size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <Package size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Admins', path: '/admin/admins', icon: <ShieldCheck size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <SettingsIcon size={20} /> },
  ];

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (!isAdmin) return null;

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-[100dvh] w-72 lg:w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-sm py-4 pb-0 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100 shrink-0">
          <span className="text-xl font-bold bg-gradient-to-r from-accent to-black bg-clip-text text-transparent">WW Admin</span>
          <button onClick={closeSidebar} className="lg:hidden text-gray-500 hover:text-black p-2 -mr-2 bg-gray-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto w-full">
          {/* Storefront Nav */}
          <div className="py-4 px-3 space-y-1 border-b border-gray-100">
             <div className="px-4 py-2 mb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Storefront</div>
             {storefrontNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                      isActive && location.pathname === item.path
                        ? 'bg-gray-100 text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="text-gray-500">{item.icon}</span>
                  {item.name}
                </NavLink>
             ))}
          </div>

          {/* Admin Nav */}
          <div className="py-4 px-3 space-y-1 hover-scrollbar">
             <div className="px-4 py-2 mb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Control</div>
             {adminNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100/50'
                        : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className={location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin') ? 'text-blue-600' : 'text-gray-500'}>
                     {item.icon}
                  </span>
                  {item.name}
                </NavLink>
             ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
           >
             <LogOut size={18} />
             Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 max-h-[100dvh] overflow-y-auto bg-gray-50/50">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-sm lg:shadow-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-gray-800">
               {adminNavItems.find(i => i.path === location.pathname)?.name || (location.pathname.startsWith('/admin/order/') ? 'Order Details' : 'Admin Panel')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 border-l border-gray-100 pl-4 lg:border-none lg:pl-0">
             <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden block">
               <ShoppingCart size={22} />
               {cartCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount}
                 </span>
               )}
             </Link>
             <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-sm shrink-0">
               A
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-3 sm:p-6 lg:p-8 flex-1 animate-fade-in pb-20 lg:pb-8 w-full max-w-[100vw] overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
