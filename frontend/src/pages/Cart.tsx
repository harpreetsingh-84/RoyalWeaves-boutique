import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, formatPrice, isAuthenticated, requestLoginPrompt } = useShop();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((total: number, item: any) => total + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!isAuthenticated) {
      requestLoginPrompt('checkout');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="py-24 px-6 text-center fade-in">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn-primary inline-block">Browse Collection</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto fade-in">
      <h1 className="text-4xl font-bold mb-10 pb-4 border-b border-gray-200">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 flex flex-col gap-6">
          {cart.map(item => (
            <div key={item.product._id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-lg shadow-sm">
              <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-medium mb-1">{item.product.name}</h3>
                {item.color && (
                  <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-semibold">Color: {item.color}</p>
                )}
                <p className="text-gray-500 mb-4">{formatPrice(item.product.price)}</p>
                <div className="flex items-center justify-center sm:justify-start gap-4 bg-gray-50 w-max mx-auto sm:mx-0 p-1 rounded-full">
                  <button 
                    className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-primary hover:text-white transition-colors flex items-center justify-center font-bold"
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.color)}
                  >
                    &minus;
                  </button>
                  <span className="w-4 text-center font-medium">{item.quantity}</span>
                  <button 
                    className={`w-8 h-8 rounded-full shadow-sm transition-colors flex items-center justify-center font-bold bg-white hover:bg-primary hover:text-white`}
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.color)}
                    title={'Increase quantity'}
                  >
                    &#43;
                  </button>
                </div>
              </div>
              <div className="text-center sm:text-right min-w-[120px]">
                <p className="text-xl font-semibold mb-4">{formatPrice(item.product.price * item.quantity)}</p>
                <button 
                  className="text-red-500 text-sm hover:text-red-700 underline transition-colors"
                  onClick={() => removeFromCart(item.product._id, item.color)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:w-1/3 bg-white p-8 rounded-lg shadow-md h-max">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="flex justify-between mb-4 text-gray-600 pl-1">
            <span>Subtotal</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between mb-6 text-gray-600 pl-1">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200 text-xl font-bold mb-8">
            <span>Total</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <button 
            onClick={handleCheckout} 
            className="btn-primary w-full py-4 text-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
