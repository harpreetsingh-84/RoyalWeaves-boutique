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
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const availableStatuses = ["pending", "confirmed", "processing", "shipped", "cancelled", "delivered"];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const res = await apiService.getOrderById(id);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          
          // Map legacy to new if needed
          const orderSt = data.orderStatus || 'pending';
          setSelectedStatus(orderSt);
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
      const res = await apiService.updateOrderStatus(id, { orderStatus: selectedStatus });
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

  const handlePaymentVerification = async (newStatus: 'paid' | 'failed') => {
    if (!id || verifyingPayment) return;
    setVerifyingPayment(true);
    try {
       const payload = newStatus === 'paid' 
           ? { paymentStatus: 'paid', orderStatus: 'confirmed' }
           : { paymentStatus: 'failed', orderStatus: 'cancelled' };
       const res = await apiService.updateOrderStatus(id, payload);
       if (res.ok) {
           const updatedOrder = await res.json();
           setOrder(updatedOrder);
           setSelectedStatus(updatedOrder.orderStatus);
           alert(`Payment marked as ${newStatus.toUpperCase()}`);
       } else {
           const err = await res.json();
           alert(err.message || 'Failed to verify payment');
       }
    } catch (err) {
       alert('Error verifying payment');
    } finally {
       setVerifyingPayment(false);
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
  // orderStatus overrides legacy status
  let mappedStatus = order.orderStatus === 'pending' ? 'Order Placed' : 
                     (order.orderStatus === 'confirmed' || order.orderStatus === 'processing') ? 'Confirmed' : 
                     (order.orderStatus === 'shipped') ? 'Shipped' : 
                     (order.orderStatus === 'delivered') ? 'Delivered' : 'Order Placed';
                     
  const currentStep = mappedStatus === 'Delivered' ? 3 : mappedStatus === 'Shipped' ? 2 : mappedStatus === 'Confirmed' ? 1 : 0; 
  
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

      {order.paymentStatus === 'pending' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
           <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
             Manual UPI Verification Required
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <p className="text-sm text-blue-800 mb-2">The customer has placed an order and claims to have paid via UPI. Please check your bank app to confirm you received the exact amount.</p>
                 <div className="bg-white p-4 rounded border border-blue-100 mb-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500 font-bold tracking-widest uppercase">Amount Due</span>
                       <span className="font-bold text-lg text-emerald-600">{formatPrice(order.totalAmount)}</span>
                    </div>
                    <div className="flex flex-col text-sm border-t border-blue-50 pt-2">
                       <span className="text-gray-500 font-bold tracking-widest uppercase mb-1">Transaction ID (UTR)</span>
                       <span className="font-mono text-lg font-bold select-all bg-gray-100 p-2 rounded tracking-wider">{order.transactionId || 'NOT PROVIDED'}</span>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button disabled={verifyingPayment} onClick={() => handlePaymentVerification('paid')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm flex-1 transition-colors">
                       Confirm Received
                    </button>
                    <button disabled={verifyingPayment} onClick={() => handlePaymentVerification('failed')} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-3 px-6 rounded-lg flex-1 transition-colors">
                       Reject / Not Found
                    </button>
                 </div>
              </div>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl bg-white p-2">
                 {order.paymentScreenshot ? (
                    <img src={order.paymentScreenshot} alt="Payment Proof" className="max-h-64 object-contain rounded" />
                 ) : (
                    <div className="text-center p-8 text-blue-300">
                       <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                       <span className="text-sm font-medium">No screenshot uploaded<br/>by customer.</span>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Admin Controls Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          📦 Logistics Status
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label className="block text-sm font-medium text-gray-800 mb-1 leading-none">Order Status</label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5 capitalize"
            >
              {[...new Set([...availableStatuses, order.orderStatus || 'pending'])].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleStatusUpdate}
            disabled={updatingStatus || selectedStatus === order.orderStatus}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold shadow-sm flex-shrink-0 transition-colors
              ${updatingStatus || selectedStatus === order.orderStatus 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            {updatingStatus ? 'Updating...' : 'Update Logistics'}
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
              <p className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2">
                <span>Payment Verification</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase
                   ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                     order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700 animate-pulse'}`}>
                   {order.paymentStatus || 'pending'}
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-gray-500">Method</span>
                <span className="font-bold text-gray-900">{order.paymentMethod || 'UPI (Manual)'}</span>
              </p>
              <p className="flex flex-col gap-1 border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Transaction / UTR ID</span>
                <span className="font-mono bg-white px-2 py-1 border border-gray-200 rounded select-all break-all">{order.transactionId || 'NOT PROVIDED'}</span>
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
                    {item.product?.image || item.image ? (
                        <img 
                          src={(item.product?.image || item.image).startsWith('http') ? (item.product?.image || item.image) : `http://localhost:5000${item.product?.image || item.image}`} 
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
