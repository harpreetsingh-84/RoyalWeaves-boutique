import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ItemDetails from './pages/ItemDetails';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalLoader from './components/GlobalLoader';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <GlobalLoader>
      <div className="flex flex-col min-h-screen relative">
        <Navbar />
        <main className={`flex-grow w-full ${isHome ? '' : 'pt-28 max-w-7xl mx-auto px-6'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/collection" element={<ProtectedRoute><Collection /></ProtectedRoute>} />
            <Route path="/item/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </GlobalLoader>
  );
}

export default App;
