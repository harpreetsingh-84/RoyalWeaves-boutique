import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { Package, DollarSign, Users, Tag } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { formatPrice } = useShop();
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyTraffic: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiService.getAnalytics();
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
           <div key={i} className="h-32 bg-secondaryAction/20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 fade-in text-lightText">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lightText to-secondaryAction drop-shadow-sm mb-2">Welcome back, Admin 👋</h2>
        <p className="text-lightText/60 text-sm">Here is what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="premium-card p-6 !rounded-2xl shadow-sm hover:shadow-md transition-all border-opacity-50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primaryAction rounded-l" />
          <div className="w-10 h-10 rounded-full bg-primaryAction/20 text-primaryAction flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Package size={20} />
          </div>
          <h3 className="text-lightText/60 font-medium text-xs tracking-wider uppercase mb-1 drop-shadow-sm">Total Orders</h3>
          <p className="text-3xl font-bold text-lightText">{analytics.totalOrders}</p>
        </div>

        <div className="premium-card p-6 !rounded-2xl shadow-sm hover:shadow-md transition-all border-opacity-50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondaryAction rounded-l" />
          <div className="w-10 h-10 rounded-full bg-secondaryAction/20 text-secondaryAction flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <DollarSign size={20} />
          </div>
          <h3 className="text-lightText/60 font-medium text-xs tracking-wider uppercase mb-1 drop-shadow-sm">Total Revenue</h3>
          <p className="text-3xl font-bold text-lightText">{formatPrice(analytics.totalRevenue)}</p>
        </div>

        <div className="premium-card p-6 !rounded-2xl shadow-sm hover:shadow-md transition-all border-opacity-50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-highlight rounded-l" />
          <div className="w-10 h-10 rounded-full bg-highlight/20 text-highlight flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Users size={20} />
          </div>
          <h3 className="text-lightText/60 font-medium text-xs tracking-wider uppercase mb-1 drop-shadow-sm">Customers</h3>
          <p className="text-3xl font-bold text-lightText">{analytics.totalCustomers}</p>
        </div>

        <div className="premium-card p-6 !rounded-2xl shadow-sm hover:shadow-md transition-all border-opacity-50 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-lightText/80 rounded-l" />
           <div className="w-10 h-10 rounded-full bg-lightText/20 text-lightText flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Tag size={20} />
           </div>
           <h3 className="text-lightText/60 font-medium text-xs tracking-wider uppercase mb-1 drop-shadow-sm">Products</h3>
           <p className="text-3xl font-bold text-lightText">{analytics.totalProducts || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
