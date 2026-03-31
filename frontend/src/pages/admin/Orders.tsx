import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { RefreshCw, ArrowRight } from 'lucide-react';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useShop();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiService.getOrders();
      if (res.ok) {
         setOrders(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
     switch(status?.toLowerCase()) {
       case 'paid':
       case 'delivered':
       case 'shipped':
       case 'confirmed':
         return 'bg-emerald-100 text-emerald-700';
       case 'failed':
       case 'cancelled':
         return 'bg-red-100 text-red-700';
       case 'processing':
         return 'bg-blue-100 text-blue-700';
       default:
         return 'bg-amber-100 text-amber-700';
     }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all incoming orders and statuses.</p>
         </div>
         <button onClick={fetchOrders} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-md transition flex items-center gap-2">
           <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
         </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-2">No orders have been placed yet.</p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <tr>
                    <th className="p-4">Order Info</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="p-4">
                          <div className="font-mono text-xs text-gray-500 mb-1">
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </div>
                          <div className="text-gray-900 font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {order.items?.length || 0} items
                          </div>
                       </td>
                       <td className="p-4">
                          <div className="font-medium text-gray-900">{order.user?.name || 'Guest'}</div>
                          <div className="text-gray-500 text-xs">{order.user?.email || 'N/A'}</div>
                       </td>
                       <td className="p-4 font-bold text-emerald-600">
                          {formatPrice(order.totalAmount)}
                       </td>
                       <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus || 'pending'}
                          </span>
                       </td>
                       <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.orderStatus || 'pending')}`}>
                            {order.orderStatus || 'pending'}
                          </span>
                       </td>
                       <td className="p-4 text-center">
                          <button 
                            onClick={() => navigate(`/admin/order/${order._id}`)} 
                            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-xs font-semibold shadow-sm"
                          >
                            Manage →
                          </button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden flex flex-col divide-y divide-gray-100">
              {orders.map((order: any) => (
                <div key={order._id} className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-xs text-gray-500 mb-1">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </div>
                      <div className="text-gray-900 font-bold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                       <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1 ${getStatusColor(order.orderStatus || 'pending')}`}>
                         {order.orderStatus || 'pending'}
                       </span>
                       <div className="font-bold text-emerald-600">
                          {formatPrice(order.totalAmount)}
                       </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <div className="flex justify-between mb-1">
                       <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Customer</span>
                       <span className="font-medium text-gray-900">{order.user?.name || 'Guest'}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                       <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Email</span>
                       <span className="text-gray-600 text-xs">{order.user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Items</span>
                       <span className="text-gray-900 text-xs font-medium">{order.items?.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex flex-col mt-4 gap-3">
                    <span className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-widest text-center ${getStatusColor(order.paymentStatus)}`}>
                      Pay: {order.paymentStatus || 'pending'}
                    </span>
                    <button 
                      onClick={() => navigate(`/admin/order/${order._id}`)} 
                      className="w-full flex justify-center items-center gap-2 py-3 bg-gray-900 text-white rounded-lg hover:bg-black active:scale-95 transition text-xs font-bold uppercase tracking-widest shadow-md"
                    >
                      Manage Order <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
