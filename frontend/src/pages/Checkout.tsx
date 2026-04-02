import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';

const Checkout = () => {
  const { cart, formatPrice } = useShop();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: false,
  });

  const [transactionId, setTransactionId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [upiConfig, setUpiConfig] = useState<{upiId: string, upiQrCode: string} | null>(null);
  
  const totalAmount = cart.reduce((total: number, item: any) => total + (item.product.price * item.quantity), 0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiService.getContent();
        if (res.ok) {
          const data = await res.json();
          setUpiConfig({
            upiId: data.upiId || '8824656153@axl',
            upiQrCode: data.upiQrCode || ''
          });
        }
      } catch (err) {
        console.error("Failed to load UPI config", err);
        setUpiConfig({ upiId: '8824656153@axl', upiQrCode: '' });
      }
    };
    fetchContent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Basic Validation
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill out all delivery fields.');
      return;
    }
    
    if (!transactionId || transactionId.trim().length < 10) {
      alert('Missing or invalid Transaction ID (UTR). Please enter a valid 12-digit UTR from your UPI app.');
      return;
    }

    setIsPlacingOrder(true);
    try {
      let uploadedScreenshotUrl = '';
      
      if (screenshotFile) {
        const uploadData = new FormData();
        uploadData.append('image', screenshotFile);
        const uploadRes = await apiService.upload(uploadData);
        if (uploadRes.ok) {
          const ud = await uploadRes.json();
          uploadedScreenshotUrl = ud.url;
        }
      }

      const res = await apiService.createOrder({
        items: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          color: item.color
        })),
        totalAmount,
        shippingDetails: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        transactionId: transactionId.trim(),
        paymentScreenshot: uploadedScreenshotUrl
      });
      
      if (res.ok) {
        const orderData = await res.json();
        localStorage.removeItem('wovenwonder_cart');
        // Redirect to live order status pinging page
        navigate(`/admin/order/${orderData._id}`); // wait, we must create a consumer view. For now, /admin/order/ checks auth. Wait! Normal users can't view /admin/order/. We need a general order status route. We'll use /order/:id or similar.
        navigate(`/order/${orderData._id}`); 
        window.location.reload(); 
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to place order. Please try again.');
        setIsPlacingOrder(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert('Network error during checkout.');
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-24 px-6 text-center fade-in">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">You cannot checkout with an empty cart.</p>
        <Link to="/collection" className="btn-primary inline-block">Browse Collection</Link>
      </div>
    );
  }

  const isButtonDisabled = isPlacingOrder || !transactionId || transactionId.trim().length < 10;

  return (
    <div className="p-8 max-w-6xl mx-auto fade-in">
      <h1 className="text-4xl font-bold mb-10 pb-4 border-b border-gray-200">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-bold mb-6">1. Delivery Details</h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-lg shadow-sm space-y-6 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="e.g. Aditi Sharma"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="e.g. +91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="Flat No, Building Name, Street"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="400001"
                />
              </div>
            </div>
          </form>

          {/* Manual UPI Payment Section */}
          <h2 className="text-2xl font-bold mb-6">2. Payment (UPI)</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm space-y-6 border border-gray-200 relative overflow-hidden">
            {!upiConfig && (
               <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
               </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* QR Code Display */}
              <div className="w-full sm:w-1/3 flex flex-col items-center justify-center bg-gray-50 p-4 border rounded-xl">
                 {upiConfig?.upiQrCode ? (
                   <img src={upiConfig.upiQrCode} alt="UPI QR Code" className="w-full max-w-[200px] h-auto object-contain mb-3 drop-shadow-sm mix-blend-multiply" />
                 ) : (
                   <div className="w-[180px] h-[180px] bg-white border-2 border-dashed border-gray-300 flex items-center justify-center mb-3">
                     <span className="text-gray-400 text-sm">Scan to Pay</span>
                   </div>
                 )}
                 <p className="text-xs font-bold text-gray-500 tracking-wider">UPI ID</p>
                 <p className="font-mono font-bold text-gray-900 bg-gray-200 px-3 py-1 rounded text-sm mt-1 select-all">{upiConfig?.upiId || 'Pending...'}</p>
                 <span className="text-xs font-semibold text-purple-700 mt-2 tracking-wide uppercase">Accepted Here</span>
              </div>
              
              {/* Payment Verification Form */}
              <div className="w-full sm:w-2/3 space-y-5">
                 <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-4 border border-blue-100">
                   <strong>Secure Payment Step:</strong> Open your UPI app (GPay, PhonePe, Paytm), scan the QR code to the left or copy the UPI ID, and pay exactly <strong>{formatPrice(totalAmount)}</strong>. Enter the 12-digit UTR Transaction ID below after paying.
                 </div>

                 <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Transaction ID (UTR) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    form="checkout-form"
                    disabled={isPlacingOrder}
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 font-mono tracking-wider rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent uppercase"
                    placeholder="e.g. 312345678901"
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">Found in your UPI app's payment history (usually 12 digits).</p>
                 </div>

                 <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Payment Screenshot (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isPlacingOrder}
                    onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-colors"
                  />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-lg shadow-md sticky top-32 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={`${item.product._id}-${item.color || 'none'}`} className="flex justify-between items-start text-sm py-1">
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-gray-500 mt-0.5">{item.quantity}x</span>
                    <div className="flex flex-col">
                      <span className="truncate max-w-[150px] font-medium leading-tight" title={item.product.name}>
                        {item.product.name}
                      </span>
                      {item.color && (
                        <span className="text-xs text-gray-500 capitalize mt-1">{item.color}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium mt-0.5">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-4 text-gray-600 pl-1 border-t border-gray-100 pt-6">
              <span>Subtotal</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between mb-6 text-gray-600 pl-1">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            
            <div className="flex justify-between mt-6 pt-6 border-t border-gray-200 text-2xl font-black text-gray-900 mb-8 bg-gray-50 -mx-8 px-8 pb-4">
              <span>Total Pay</span>
              <span className="text-green-700">{formatPrice(totalAmount)}</span>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={isButtonDisabled}
              className={`btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300
                ${isButtonDisabled ? 'opacity-50 bg-gray-400 cursor-not-allowed hover:bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-xl shadow-green-600/20'}`}
            >
              {isPlacingOrder ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-b-transparent rounded-full animate-spin"></div>
                  Verifying your payment...
                </>
              ) : 'I have paid'}
            </button>
            <p className="text-xs text-center text-gray-400 font-medium mt-4">
              Your order will be confirmed after your payment is verified by our team (usually within 10-30 minutes).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
