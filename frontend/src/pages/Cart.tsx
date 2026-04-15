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
      <div className="py-24 px-6 text-center fade-in text-lightText">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-lightText/60 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn-primary inline-block">Browse Collection</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto fade-in text-lightText">
      <h1 className="text-4xl font-bold mb-10 pb-4 border-b border-secondaryAction/20 drop-shadow-[0_0_10px_rgba(253,255,252,0.1)]">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 flex flex-col gap-6">
          {cart.map(item => (
            <div key={item.product._id} className="flex flex-col sm:flex-row items-center gap-6 p-6 premium-card !rounded-lg border-opacity-50">
              <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-md shadow-sm" />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-medium mb-1 drop-shadow-sm">{item.product.name}</h3>
                {item.color && (
                  <p className="text-sm text-secondaryAction mb-2 uppercase tracking-wider font-semibold">Color: {item.color}</p>
                )}
                <p className="text-highlight mb-4 font-semibold">{formatPrice(item.product.price)}</p>
                <div className="flex items-center justify-center sm:justify-start gap-4 bg-darkBg border border-secondaryAction/20 w-max mx-auto sm:mx-0 p-1 rounded-full">
                  <button 
                    className="w-8 h-8 rounded-full bg-transparent hover:bg-primaryAction transition-colors flex items-center justify-center font-bold"
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.color)}
                  >
                    &minus;
                  </button>
                  <span className="w-4 text-center font-medium">{item.quantity}</span>
                  <button 
                    className={`w-8 h-8 rounded-full shadow-sm transition-colors flex items-center justify-center font-bold bg-transparent hover:bg-primaryAction hover:text-white`}
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.color)}
                    title={'Increase quantity'}
                  >
                    &#43;
                  </button>
                </div>
              </div>
              <div className="text-center sm:text-right min-w-[120px]">
                <p className="text-xl font-semibold mb-4 text-highlight">{formatPrice(item.product.price * item.quantity)}</p>
                <button 
                  className="text-primaryAction text-sm hover:text-lightText underline transition-colors"
                  onClick={() => removeFromCart(item.product._id, item.color)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:w-1/3 bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 h-max relative">
          <h2 className="text-2xl font-serif font-bold mb-6 text-lightText relative z-10 drop-shadow-sm">Order Summary</h2>
          <div className="flex justify-between mb-4 text-lightText/70 pl-1 relative z-10 font-medium">
            <span>Subtotal</span>
            <span className="text-lightText font-semibold">{formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between mb-6 text-lightText/70 pl-1 relative z-10 font-medium">
            <span>Shipping</span>
            <span className="text-highlight font-semibold">Free</span>
          </div>
          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200 text-xl font-bold mb-8 relative z-10 text-lightText">
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
