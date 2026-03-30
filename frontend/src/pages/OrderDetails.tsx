import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useShop } from '../context/ShopContext';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { formatPrice } = useShop();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        if (!order) setLoading(true); // only show global loading on first fetch
        const res = await apiService.getOrderById(id);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
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

    // Polling Logic - every 5 seconds if pending
    let pollInterval: any;
    if (order?.paymentStatus === 'pending' || (!order && !error)) {
        pollInterval = setInterval(() => {
            fetchOrder();
        }, 5000);
    }

    return () => {
        if (pollInterval) clearInterval(pollInterval);
    };
  }, [id, order?.paymentStatus, error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 flex-col gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p className="font-semibold text-gray-700">Loading Order Details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">{error || 'Order not found'}</h2>
        <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  // Map Mongoose status ('Paid', etc.) to Timeline steps.
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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 fade-in">
    
      {/* Real-time Payment Status Banners */}
      {order.paymentStatus === 'pending' && (
        <div className="mb-8 border-2 border-blue-300 bg-blue-50 text-blue-900 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-200">
             <div className="h-full bg-blue-500 animate-[pulse_2s_ease-in-out_infinite] w-1/3"></div>
          </div>
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100 relative">
             <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold mb-1">Payment is being verified...</h2>
            <p className="text-blue-700/80 text-sm">Please do not refresh or close this page. We are manually confirming your UTR Transaction ID <strong>{order.transactionId}</strong>.</p>
          </div>
        </div>
      )}

      {order.paymentStatus === 'paid' && (
        <div className="mb-8 border border-green-200 bg-green-50 text-green-900 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm fade-in">
          <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm border-4 border-green-200 shadow-green-500/30">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black mb-1 text-green-800">Payment Successful!</h2>
            <p className="text-green-700 text-sm font-medium">Your UPI payment has been verified and your order is confirmed.</p>
          </div>
        </div>
      )}

      {order.paymentStatus === 'failed' && (
        <div className="mb-8 border border-red-200 bg-red-50 text-red-900 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm fade-in">
          <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm border-4 border-red-200 shadow-red-500/30">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-black mb-1 text-red-800">Payment Verification Failed</h2>
            <p className="text-red-700 text-sm">We could not verify your UTR ID. Please contact support or try ordering again.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-1">Order Details</h1>
          <p className="text-gray-600">Order ID: <span className="font-mono text-gray-800">{order._id}</span> • {orderDate}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition font-medium text-sm">
            Download Invoice
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Order Status : <span className="font-bold uppercase tracking-widest text-[#B58550]">{order.orderStatus || 'pending'}</span></h2>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#B58550] -translate-y-1/2 z-0 hidden sm:block transition-all duration-1000"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              return (
                <div key={step} className="flex sm:flex-col items-center gap-4 sm:gap-2 relative bg-white sm:bg-transparent">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'bg-[#B58550] border-[#B58550] text-white shadow-md' : 'bg-white border-gray-300 text-gray-400'}`}>
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
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Shipping Address</h3>
            <div className="text-gray-700 text-sm space-y-1">
              <p className="font-bold text-black text-base">{order.shippingDetails?.name}</p>
              <p className="pt-1">{order.shippingDetails?.address}</p>
              <p>{order.shippingDetails?.city}, {order.shippingDetails?.state}</p>
              <p>PIN: {order.shippingDetails?.pincode}</p>
              <p className="pt-3 text-gray-500">Phone: <span className="text-gray-800 font-medium">{order.shippingDetails?.phone}</span></p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Payment Info</h3>
            <div className="text-gray-700 text-sm space-y-3">
              <p className="flex flex-col gap-1">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Method</span>
                <span className="font-bold text-gray-900 border border-gray-200 rounded px-2 py-1 bg-white inline-block w-fit">{order.paymentMethod || 'UPI (Manual)'}</span>
              </p>
              <p className="flex flex-col gap-1">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Status</span>
                <span className={`font-bold px-2 py-1 rounded border inline-block w-fit uppercase tracking-widest text-xs
                   ${order.paymentStatus === 'paid' ? 'text-green-700 bg-green-50 border-green-200' : 
                     order.paymentStatus === 'failed' ? 'text-red-700 bg-red-50 border-red-200' : 
                     'text-blue-700 bg-blue-50 border-blue-200'}
                `}>
                   {order.paymentStatus || 'pending'}
                </span>
              </p>
              <p className="flex flex-col gap-1 border-t border-gray-200 pt-2">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Transaction ID</span>
                <span className="font-mono bg-white px-2 py-1 border border-gray-200 rounded w-fit select-all break-all">{order.transactionId || 'N/A'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full py-2.5 bg-black text-white rounded hover:bg-gray-800 transition font-medium">
              Track Order
            </button>
            {currentStep < 2 && (
              <button className="w-full py-2.5 bg-white text-red-600 border border-red-200 rounded hover:bg-red-50 hover:border-red-300 transition font-medium">
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Items */}
        <div className="md:col-span-2">
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="py-4 px-6 border-b bg-gray-50">
              <h3 className="text-lg font-semibold">Ordered Products</h3>
            </div>
            <div className="divide-y">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                    {item.product?.image || item.image ? (
                        <img 
                          src={(item.product?.image || item.image).startsWith('http') ? (item.product?.image || item.image) : `http://localhost:5000${item.product?.image || item.image}`} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/item/${item.product?._id}`} className="text-lg font-medium text-gray-900 hover:text-blue-600 hover:underline truncate block">
                      {item.name}
                    </Link>
                    {item.product?.category && (
                       <p className="text-sm text-gray-500 mt-1 capitalize">{item.product.category}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-700 flex items-center gap-4">
                      <span>Qty: <span className="font-semibold">{item.quantity}</span></span>
                      <span className="text-gray-400">|</span>
                      <span>Price: {formatPrice(item.price)}</span>
                    </div>
                  </div>
                  <div className="text-right sm:w-32 mt-4 sm:mt-0 font-medium whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-gray-50 border-t">
              <div className="space-y-3 ms-auto max-w-sm w-full">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
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
