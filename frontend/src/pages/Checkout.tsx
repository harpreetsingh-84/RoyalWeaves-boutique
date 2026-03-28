import { useState } from 'react';
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

  const totalAmount = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

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
      alert('Please fill out all required fields.');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const res = await apiService.createOrder({
        items: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        totalAmount,
        shippingDetails: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      });
      
      if (res.ok) {
        alert('Order placed successfully! Thank you for your purchase.');
        navigate('/');
        window.location.reload(); // Quick hack to clear the state/cart
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert('Network error during checkout.');
    } finally {
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

  return (
    <div className="p-8 max-w-6xl mx-auto fade-in">
      <h1 className="text-4xl font-bold mb-10 pb-4 border-b border-gray-200">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Shipping Form */}
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
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

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="saveAddress"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleInputChange}
                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
              />
              <label htmlFor="saveAddress" className="text-sm text-gray-600">
                Save this address for future purchases (Optional)
              </label>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-lg shadow-md sticky top-32">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.product._id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-500">{item.quantity}x</span>
                    <span className="truncate max-w-[150px] font-medium" title={item.product.name}>
                      {item.product.name}
                    </span>
                  </div>
                  <span className="text-gray-700">{formatPrice(item.product.price * item.quantity)}</span>
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
            
            <div className="flex justify-between mt-6 pt-6 border-t border-gray-200 text-xl font-bold mb-8">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={isPlacingOrder}
              className={`btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 ${isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isPlacingOrder ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : 'Place Order'}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 px-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy. Checkouts are simulated without payment currently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
