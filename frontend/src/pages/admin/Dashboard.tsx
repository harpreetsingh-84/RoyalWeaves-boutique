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
           <div key={i} className="h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 fade-in">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-2">Welcome back, Admin 👋</h2>
        <p className="text-gray-500 text-sm">Here is what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l" />
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Package size={20} />
          </div>
          <h3 className="text-gray-500 font-medium text-xs tracking-wider uppercase mb-1">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l" />
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <DollarSign size={20} />
          </div>
          <h3 className="text-gray-500 font-medium text-xs tracking-wider uppercase mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">{formatPrice(analytics.totalRevenue)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l" />
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Users size={20} />
          </div>
          <h3 className="text-gray-500 font-medium text-xs tracking-wider uppercase mb-1">Customers</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalCustomers}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l" />
           <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Tag size={20} />
           </div>
           <h3 className="text-gray-500 font-medium text-xs tracking-wider uppercase mb-1">Products</h3>
           <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
