import  { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useShop } from '../context/ShopContext';

export default function AdminOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { formatPrice, isAdmin } = useShop();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const availableStatuses = ["Pending", "Confirmed", "Shipped", "Delivered"];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const res = await apiService.getOrderById(id);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          
          // Try to match the backend status to our available ones, default to Pending
          const currentStatus = data.status || 'Paid';
          // Convert 'Paid' back to Pending/Confirmed for UI consistency if needed
          const uiStatus = currentStatus === 'Paid' ? 'Confirmed' : currentStatus;
          // If the DB has something unusual, just set it to whichever it is, or add to list.
          if (!availableStatuses.includes(uiStatus) && uiStatus) {
            setSelectedStatus(uiStatus);
          } else {
            setSelectedStatus(uiStatus);
          }
        } else {
          const errData = await res.json();
          setError(errData.message || 'Failed to fetch order');
        }
      } catch (err) {
        setError('An error occurred while fetching your order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!id || !selectedStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await apiService.updateOrderStatus(id, selectedStatus);
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrder(updatedOrder);
        alert('Order status updated successfully!');
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to update status');
      }
    } catch (err) {
      alert('An error occurred while updating the status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">{error || 'Order not found'}</h2>
        <Link to="/admin" className="text-blue-600 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
        <p>You do not have administrative privileges.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Return Home</Link>
      </div>
    );
  }

  const steps = ["Order Placed", "Confirmed", "Shipped", "Delivered"];
  const orderStatusMap: Record<string, number> = {
    'Pending': 0,
    'Paid': 1,
    'Confirmed': 1,
    'Shipped': 2,
    'Delivered': 3
  };
  
  const currentStep = orderStatusMap[order.status] !== undefined ? orderStatusMap[order.status] : 1;

  const d = new Date(order.createdAt);
  const orderDate = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-1 flex items-center gap-3">
            Manage Order
            <span className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full uppercase tracking-widest font-sans align-middle">Admin View</span>
          </h1>
          <p className="text-gray-600">Order ID: <span className="font-mono text-gray-800">{order._id}</span> • {orderDate}</p>
        </div>
        <Link to="/admin" className="text-accent hover:underline text-sm font-medium">← Back to Dashboard</Link>
      </div>

      {/* Admin Controls Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
        <h2 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
          ⚙️ Update Order Status
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label className="block text-sm font-medium text-yellow-800 mb-1">Current Status</label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-yellow-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block p-2.5"
            >
              {[...new Set([...availableStatuses, order.status || 'Paid'])].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleStatusUpdate}
            disabled={updatingStatus || selectedStatus === order.status}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold shadow-sm flex-shrink-0 transition-colors
              ${updatingStatus || selectedStatus === order.status 
                ? 'bg-yellow-200 text-yellow-700 cursor-not-allowed' 
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
          >
            {updatingStatus ? 'Saving...' : 'Update Status'}
          </button>
        </div>
      </div>

      {/* Timeline view so admin sees what the user sees */}
      <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Customer Timeline View</h2>
        <div className="relative opacity-70">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 hidden sm:block transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              return (
                <div key={step} className="flex sm:flex-col items-center gap-4 sm:gap-2 relative bg-white sm:bg-transparent">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className={`text-sm sm:text-center ${isCurrent ? 'font-bold text-gray-900' : isCompleted ? 'font-medium text-gray-700' : 'text-gray-400'}`}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - User Details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Customer Account</h3>
            {order.user ? (
               <div className="text-gray-700 text-sm space-y-1">
                 <p className="font-bold text-black">{order.user.name}</p>
                 <p className="text-gray-500">{order.user.email}</p>
                 <p className="text-xs text-gray-400 font-mono mt-2 pt-2 border-t">ID: {order.user._id}</p>
               </div>
            ) : (
               <p className="text-gray-500 italic">Guest Checkout (No Account)</p>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Shipping Information</h3>
            <div className="text-gray-700 text-sm space-y-1">
              <p className="font-medium text-black">{order.shippingDetails?.name}</p>
              <p>{order.shippingDetails?.address}</p>
              <p>{order.shippingDetails?.city}, {order.shippingDetails?.state}</p>
              <p>PIN: {order.shippingDetails?.pincode}</p>
              <p className="pt-2 text-gray-500 flex justify-between">
                <span>Phone:</span>
                <span className="text-gray-800 font-medium">{order.shippingDetails?.phone}</span>
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Financials</h3>
            <div className="text-gray-700 text-sm space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">Cash on Delivery</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-gray-500">DB Status string</span>
                <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{order.status || 'Paid'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Items */}
        <div className="md:col-span-2">
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="py-4 px-6 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Ordered Products</h3>
              <span className="text-sm font-medium bg-gray-200 px-2 py-0.5 rounded-full">{order.items?.length || 0} Items</span>
            </div>
            <div className="divide-y">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                    {item.product?.image ? (
                        <img 
                          src={`http://localhost:5000${item.product.image}`} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-300">No Img</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/item/${item.product?._id}`} className="text-base font-bold text-gray-900 hover:text-blue-600 hover:underline truncate block">
                      {item.name}
                    </Link>
                    <div className="mt-1 text-xs font-mono text-gray-400">
                      ProductID: {item.product?._id || 'Unknown'}
                    </div>
                    <div className="mt-2 text-sm text-gray-700 flex items-center gap-4 bg-gray-50 inline-flex px-3 py-1 rounded-full border">
                      <span>Qty <span className="font-bold">{item.quantity}</span></span>
                      <span className="text-gray-300">×</span>
                      <span>{formatPrice(item.price)}</span>
                    </div>
                  </div>
                  <div className="text-right sm:w-32 mt-4 sm:mt-0 font-bold text-lg whitespace-nowrap text-green-700">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-gray-50 border-t">
              <div className="space-y-3 ms-auto max-w-sm w-full">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Gross Subtotal</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Calculated Shipping</span>
                  <span className="text-green-600 font-medium">₹0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-black text-xl text-gray-900">
                  <span>Final Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
