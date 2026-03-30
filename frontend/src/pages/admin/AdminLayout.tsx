import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { apiService } from '../../services/api';

const AdminLayout: React.FC = () => {
  const { isAdmin } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If not admin, maybe redirect
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

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Products', path: '/admin/products', icon: '🛍️' },
    { name: 'Categories', path: '/admin/categories', icon: '📁' },
    { name: 'Orders', path: '/admin/orders', icon: '📦' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Admins', path: '/admin/admins', icon: '🛡️' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  if (!isAdmin) return null; // Avoid flashing content

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-bold bg-gradient-to-r from-accent to-black bg-clip-text text-transparent">WW Admin</span>
          <button onClick={closeSidebar} className="lg:hidden text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-md transition-colors"
           >
             🚪 Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 hidden sm:block">
               {navItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-sm">
               A
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 animate-fade-in pb-20 lg:pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
