import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ItemDetails from './pages/ItemDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderDetails from './pages/OrderDetails';
import AdminOrderDetails from './pages/AdminOrderDetails';
import MyOrders from './pages/MyOrders';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalLoader from './components/GlobalLoader';
import LoginPromptModal from './components/LoginPromptModal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Admin Layout & Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Admins from './pages/admin/Admins';
import Settings from './pages/admin/Settings';
import Pages from './pages/admin/Pages';
import Messages from './pages/admin/Messages';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <GlobalLoader>
      {!isAdminRoute ? (
        <div className="flex flex-col min-h-screen relative">
          <Navbar />
          <main className={`flex-grow w-full ${isHome ? '' : 'pt-28 max-w-7xl mx-auto px-6'}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/myorders" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/contact-us" element={<ContactUs />} />
            </Routes>
          </main>
          <Footer />
        </div>
      ) : (
        <Routes>
           <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
              <Route path="admins" element={<Admins />} />
              <Route path="settings" element={<Settings />} />
              <Route path="pages" element={<Pages />} />
              <Route path="messages" element={<Messages />} />
              <Route path="order/:id" element={<AdminOrderDetails />} />
           </Route>
        </Routes>
      )}
      <LoginPromptModal />
      <SpeedInsights />
    </GlobalLoader>
  );
}

export default App;
