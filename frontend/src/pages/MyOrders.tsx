import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useShop } from '../context/ShopContext';
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
  const { isAuthenticated } = useShop();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

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
  if (!isAuthenticated) return (
     <div className="py-10 animate-fade-in max-w-7xl mx-auto px-6 text-lightText">
       <h1 className="text-3xl font-bold mb-8 text-lightText tracking-tight drop-shadow-[0_0_10px_rgba(253,255,252,0.1)]">My Orders</h1>
       <div className="text-center py-20 premium-card !rounded-xl shadow-sm border-opacity-50">
          <h2 className="text-2xl font-serif text-lightText mb-4 drop-shadow-sm">Track Your Orders</h2>
          <p className="text-lightText/60 mb-8 max-w-md mx-auto">Please log in or create an account to securely view your order history, track shipments, and manage returns.</p>
          <div className="flex gap-4 justify-center">
             <Link to="/login" className="btn-primary inline-block py-3">
               Log In
             </Link>
             <Link to="/collection" className="bg-white text-primaryAction border-2 border-primaryAction px-8 py-3 rounded hover:bg-primaryAction/10 transition-colors font-medium tracking-wide text-sm uppercase inline-block">
               Continue Shopping
             </Link>
          </div>
       </div>
     </div>
  );
  if (error) return <div className="text-center py-20 text-red-500 bg-red-50 rounded mt-10 p-6">{error}</div>;

  return (
    <div className="py-10 animate-fade-in text-lightText">
      <h1 className="text-3xl font-bold mb-8 text-lightText tracking-tight drop-shadow-[0_0_10px_rgba(253,255,252,0.1)]">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 premium-card !rounded-xl shadow-sm border-opacity-50">
          <p className="text-lightText/60 mb-6 text-lg">You have not placed any orders yet.</p>
          <Link to="/collection" className="btn-primary inline-block py-3">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="premium-card border-secondaryAction/20 !rounded-xl !p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm hover:shadow-md hover:border-secondaryAction/40 transition-all">
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4">
                  <p className="text-sm text-lightText/60">
                    Order ID: <span className="font-mono text-lightText bg-darkBg/50 border border-secondaryAction/20 px-2 py-1 rounded text-xs ml-1">{order._id}</span>
                  </p>
                  <p className="text-sm text-lightText/60">
                    Placed on: <span className="text-highlight font-medium drop-shadow-[0_0_10px_rgba(255,159,28,0.3)]">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#03233c] p-2 rounded border border-secondaryAction/20 shadow-sm">
                      {item.product?.image?.[0] && (
                        <div className="w-10 h-10 rounded bg-darkBg overflow-hidden flex-shrink-0">
                          <img src={item.product.image[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-lightText">{item.product?.name || 'Item'} <span className="text-lightText/50 font-normal">x {item.quantity}</span></span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center justify-center px-4 bg-darkBg rounded text-xs font-medium text-secondaryAction border border-secondaryAction/30 shadow-sm">
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 w-full lg:w-48 mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-secondaryAction/20">
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between">
                   <div>
                     <p className="text-xs text-lightText/50 uppercase tracking-wider mb-1">Status</p>
                     <p className={`font-semibold capitalize text-sm px-2 py-1 rounded-sm inline-block shadow-sm ${
                        order.status === 'delivered' ? 'bg-secondaryAction/20 text-secondaryAction border border-secondaryAction/30' :
                        order.status === 'cancelled' ? 'bg-primaryAction/20 text-primaryAction border border-primaryAction/30' :
                        'bg-highlight/20 text-highlight border border-highlight/30'
                      }`}>
                        {order.status || 'Pending'}
                      </p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-lightText/50 uppercase tracking-wider mb-1">Total</p>
                     <p className="text-lg font-bold text-highlight drop-shadow-sm">₹{order.totalAmount?.toLocaleString()}</p>
                   </div>
                </div>
                <Link to={`/order/${order._id}`} className="mt-2 w-full text-center bg-transparent border border-secondaryAction/30 text-lightText hover:bg-secondaryAction hover:border-secondaryAction hover:text-darkBg hover:shadow-[0_0_15px_rgba(46,196,182,0.5)] px-6 py-2 rounded text-sm transition-all font-medium whitespace-nowrap">
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
