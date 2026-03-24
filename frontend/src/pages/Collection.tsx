import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Collection = () => {
  const { products, isLoading, formatPrice } = useShop();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4 fade-in">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium tracking-widest uppercase text-sm">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="fade-in pb-20">
      <div className="max-w-7xl mx-auto mb-16 pt-8">
        <div className="flex flex-col items-center mb-12">
          <span className="text-accent font-medium tracking-widest uppercase text-xs mb-3 block">Full Catalog</span>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 drop-shadow-sm">The Collection</h1>
          <div className="w-16 h-0.5 bg-accent mt-6"></div>
        </div>
        
        {/* Sort and Filter could go here later */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-4 mb-10 mt-10">
          <span className="text-gray-900 font-semibold tracking-widest text-sm uppercase mb-2 md:mb-0">Latest Arrivals</span>
          <span className="text-gray-500 font-medium tracking-widest text-xs uppercase">Showing {products.length} Items</span>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 border border-gray-100 rounded-sm">
            <h3 className="text-2xl font-serif text-gray-400 mb-2">Collection Empty</h3>
            <p className="text-gray-500 tracking-wide">Check back later for stunning new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product) => (
              <Link to={`/item/${product._id}`} key={product._id} className="group block">
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-5 rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-6 group-hover:translate-y-0">
                    <span className="bg-white/95 text-gray-900 px-8 py-3 rounded-sm font-semibold shadow-2xl text-xs tracking-widest uppercase">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="px-1 text-center">
                  <p className="text-gray-400 text-xs mb-2 uppercase tracking-widest font-medium">{product.category}</p>
                  <h3 className="text-lg font-serif text-gray-900 mb-2 group-hover:text-accent transition-colors truncate">{product.name}</h3>
                  <p className="font-medium text-gray-900 tracking-wide">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
