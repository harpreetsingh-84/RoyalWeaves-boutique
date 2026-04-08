import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const Collection = () => {
  const { products, isLoading } = useShop();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4 fade-in">
        <div className="w-16 h-16 border-4 border-lightText/20 border-t-secondaryAction rounded-full animate-spin shadow-[0_0_15px_rgba(46,196,182,0.3)]"></div>
        <p className="text-secondaryAction font-medium tracking-widest uppercase text-sm">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="fade-in pb-20">
      <div className="max-w-7xl mx-auto mb-16 pt-8">
        <div className="flex flex-col items-center mb-12">
          <span className="text-secondaryAction font-medium tracking-widest uppercase text-xs mb-3 block">Full Catalog</span>
          <h1 className="text-4xl md:text-5xl font-serif text-lightText drop-shadow-[0_0_10px_rgba(253,255,252,0.1)]">The Collection</h1>
          <div className="w-16 h-0.5 bg-primaryAction mt-6 shadow-[0_0_10px_rgba(231,29,54,0.5)]"></div>
        </div>
        
        {/* Sort and Filter could go here later */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-secondaryAction/20 pb-4 mb-10 mt-10">
          <span className="text-lightText font-semibold tracking-widest text-sm uppercase mb-2 md:mb-0">Latest Arrivals</span>
          <span className="text-lightText/60 font-medium tracking-widest text-xs uppercase">Showing {products.length} Items</span>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-32 glass-panel border border-secondaryAction/20 rounded-sm">
            <h3 className="text-2xl font-serif text-secondaryAction mb-2">Collection Empty</h3>
            <p className="text-lightText/70 tracking-wide">Check back later for stunning new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
