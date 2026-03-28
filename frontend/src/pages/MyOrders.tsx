import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom';

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { product: { name: string; image?: string[] }; quantity: number }[];
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiService.getMyOrders();
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;
  if (error) return <div className="text-center py-20 text-red-500 bg-red-50 rounded mt-10 p-6">{error}</div>;

  return (
    <div className="py-10 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 mb-6 text-lg">You have not placed any orders yet.</p>
          <Link to="/collection" className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-black transition-colors shadow-md font-medium tracking-wide text-sm uppercase">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border rounded-xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4">
                  <p className="text-sm text-gray-500">
                    Order ID: <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs ml-1">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on: <span className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded border border-gray-100">
                      {item.product?.image?.[0] && (
                        <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                          <img src={item.product.image[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-800">{item.product?.name || 'Item'} <span className="text-gray-500 font-normal">x {item.quantity}</span></span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center justify-center px-4 bg-gray-100 rounded text-xs font-medium text-gray-600 border border-gray-200">
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 w-full lg:w-48 mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between">
                   <div>
                     <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                     <p className={`font-semibold capitalize text-sm px-2 py-1 rounded-sm inline-block ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status || 'Pending'}
                      </p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                     <p className="text-lg font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                   </div>
                </div>
                <Link to={`/order/${order._id}`} className="mt-2 w-full text-center bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 px-6 py-2 rounded text-sm transition-all font-medium whitespace-nowrap">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
