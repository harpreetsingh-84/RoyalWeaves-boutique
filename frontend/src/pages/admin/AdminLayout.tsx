import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { apiService } from '../../services/api';
import { 
  LayoutDashboard, ShoppingBag, FolderTree, Package, 
  Users, ShieldCheck, Settings as SettingsIcon, LogOut,
  Menu, X, Home, Compass, ShoppingCart, ListOrdered,
  FileText, MessageSquare
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
    { name: 'Pages', path: '/admin/pages', icon: <FileText size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
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
    <div className="flex bg-darkBg min-h-screen font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-[100dvh] w-72 lg:w-64 bg-darkBg border-r border-secondaryAction/20 shadow-xl lg:shadow-sm py-4 pb-0 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-4 border-b border-secondaryAction/20 shrink-0">
          <span className="text-xl font-bold bg-gradient-to-r from-primaryAction to-secondaryAction bg-clip-text text-transparent">WW Admin</span>
          <button onClick={closeSidebar} className="lg:hidden text-lightText/60 hover:text-lightText p-2 -mr-2 bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto w-full">
          {/* Storefront Nav */}
          <div className="py-4 px-3 space-y-1 border-b border-secondaryAction/20">
             <div className="px-4 py-2 mb-1 text-xs font-bold text-lightText/60 uppercase tracking-widest">Storefront</div>
             {storefrontNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                      isActive && location.pathname === item.path
                        ? 'bg-primaryAction/20 text-primaryAction shadow-sm'
                        : 'text-lightText/60 hover:bg-secondaryAction/10 hover:text-secondaryAction'
                    }`
                  }
                >
                  <span className="text-inherit">{item.icon}</span>
                  {item.name}
                </NavLink>
             ))}
          </div>

          {/* Admin Nav */}
          <div className="py-4 px-3 space-y-1 hover-scrollbar">
             <div className="px-4 py-2 mb-1 text-xs font-bold text-lightText/60 uppercase tracking-widest">Admin Control</div>
             {adminNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? 'bg-secondaryAction/20 text-secondaryAction ring-1 ring-secondaryAction/30 shadow-sm'
                        : 'text-lightText/60 hover:bg-secondaryAction/10 hover:text-secondaryAction'
                    }`
                  }
                >
                  <span className={location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin') ? 'text-secondaryAction' : 'text-inherit'}>
                     {item.icon}
                  </span>
                  {item.name}
                </NavLink>
             ))}
          </div>
        </nav>

        <div className="p-4 border-t border-secondaryAction/20 bg-darkBg/50 shrink-0">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-primaryAction font-bold hover:bg-primaryAction/10 rounded-lg transition-colors border border-transparent hover:border-primaryAction/30"
           >
             <LogOut size={18} />
             Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 max-h-[100dvh] overflow-y-auto bg-darkBg/50 text-lightText">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-darkBg/95 backdrop-blur-md border-b border-secondaryAction/20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-sm lg:shadow-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-lightText hover:bg-secondaryAction/20 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-lightText">
               {adminNavItems.find(i => i.path === location.pathname)?.name || (location.pathname.startsWith('/admin/order/') ? 'Order Details' : 'Admin Panel')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 border-l border-secondaryAction/20 pl-4 lg:border-none lg:pl-0">
             <Link to="/cart" className="relative p-2 text-lightText/60 hover:bg-secondaryAction/20 rounded-lg transition-colors lg:hidden block">
               <ShoppingCart size={22} />
               {cartCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-primaryAction text-lightText text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-darkBg shadow-[0_0_10px_rgba(231,29,54,0.4)]">
                    {cartCount}
                 </span>
               )}
             </Link>
             <div className="w-9 h-9 rounded-full bg-secondaryAction/20 text-secondaryAction flex items-center justify-center font-bold text-sm ring-2 ring-secondaryAction/10 shadow-sm shrink-0">
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
