import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useState, useEffect } from 'react';

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, formatPrice } = useShop();
  
  const product = products.find(p => p._id === id);
  const [fullscreenIndex, setFullscreenIndex] = useState<number>(-1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomStyles, setZoomStyles] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyles({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyles({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f8]">
        <div className="text-center animate-pulse text-sm font-medium text-gray-500 tracking-[0.2em] uppercase">
          Curating details...
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.gallery || [])];
  const isFullscreen = fullscreenIndex >= 0;

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFullscreen]);

  useEffect(() => {
    // Small delay for smooth entry animation
    setTimeout(() => setIsLoaded(true), 50);
    window.scrollTo(0, 0);
  }, [id, product]);

  const closeFullscreen = () => setFullscreenIndex(-1);
  const prevImage = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    if (isFullscreen) {
      setFullscreenIndex((prev: number) => (prev - 1 + allImages.length) % allImages.length);
    } else {
      setCurrentIndex((prev: number) => (prev - 1 + allImages.length) % allImages.length);
    }
  };
  const nextImage = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    if (isFullscreen) {
      setFullscreenIndex((prev: number) => (prev + 1) % allImages.length);
    } else {
      setCurrentIndex((prev: number) => (prev + 1) % allImages.length);
    }
  };
  const handleAddToCart = () => { addToCart(product); };

  return (
    <div className="min-h-screen bg-[#faf9f8] selection:bg-gray-900 selection:text-white pb-32 font-sans text-gray-900">
      
      {/* Navigation Bar */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-xs font-semibold tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors duration-500 uppercase"
        >
          <span className="w-8 h-[1px] bg-gray-400 group-hover:bg-gray-900 group-hover:w-12 transition-all duration-500"></span> 
          Back to Collection
        </button>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Premium Image Slider */}
          <div className={`w-full lg:w-[55%] flex flex-col gap-6 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            
            <div className="relative w-full bg-gray-100 overflow-hidden group cursor-crosshair shadow-2xl shadow-gray-200/50">
              {/* Primary Image Container */}
              <div 
                className="w-full aspect-[4/5] overflow-hidden"
                onClick={() => setFullscreenIndex(currentIndex)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img 
                  src={allImages[currentIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-100 ease-linear will-change-transform"
                  style={zoomStyles}
                />
              </div>

              {/* Navigation Arrows (Only if multiple images) */}
              {allImages.length > 1 && (
                <>
                  <button 
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                    onClick={prevImage}
                    aria-label="Previous Image"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                    onClick={nextImage}
                    aria-label="Next Image"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}

              {/* View All Indicator / Pagination */}
              {allImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                      className={`h-1 transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-gray-900' : 'w-2 bg-gray-400 opacity-50'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Floating Expand Hint */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full text-gray-900 shadow-md border border-white/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation (Optional - keeping it clean as requested) */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
                {allImages.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-20 h-24 flex-shrink-0 overflow-hidden transition-all duration-500 ${
                      currentIndex === idx 
                        ? 'ring-1 ring-gray-900 ring-offset-2 ring-offset-[#faf9f8] opacity-100' 
                        : 'opacity-40 hover:opacity-100 grayscale-[0.5] hover:grayscale-0'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-center" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Editorial Details */}
          <div className="w-full lg:w-[45%]">
            <div className={`lg:sticky lg:top-24 flex flex-col transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                  Boutique Exclusive
                </span>
                <div className="w-12 h-[1px] bg-gray-300"></div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                  {product.category}
                </span>
              </div>

              {/* Title with Playfair Display for luxury feel */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-gray-900 leading-[1.1] mb-6">
                {product.name}
              </h1>
              
              <p className="text-2xl font-light text-gray-600 mb-10 font-serif italic flex items-center gap-4">
                {formatPrice(product.price)}
                <span className={`text-xs font-sans not-italic font-medium tracking-widest uppercase px-3 py-1 rounded-full ${product.quantity > 0 ? 'text-gray-400 bg-gray-100' : 'text-red-600 bg-red-50'}`}>
                  {product.quantity > 0 ? `${product.quantity} In Stock` : 'Out of Stock'}
                </span>
              </p>

              {/* Add to Cart - Premium Button */}
              <button 
                onClick={handleAddToCart}
                disabled={product.quantity <= 0}
                className={`relative group overflow-hidden ${product.quantity > 0 ? 'bg-gray-900' : 'bg-gray-400 cursor-not-allowed'} text-white w-full py-5 mb-12 shadow-2xl shadow-gray-900/20 active:scale-[0.98] transition-all duration-500 block`}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                <span className="relative z-10 flex items-center justify-center gap-4 text-xs font-bold tracking-[0.2em] uppercase">
                  {product.quantity > 0 ? 'Add to Bag' : 'Sold Out'}
                  {product.quantity > 0 && (
                    <span className="group-hover:translate-x-2 transition-transform duration-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="w-full h-[1px] bg-gray-200 mb-8"></div>

              {/* Accordion / Tabs styled like a high-end spec sheet */}
              <div className="mb-12">
                <div className="flex gap-8 border-b border-gray-200 mb-8">
                  <button 
                    onClick={() => setActiveTab('description')} 
                    className={`pb-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 relative ${
                      activeTab === 'description' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    The Details
                    {activeTab === 'description' && (
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-900 scale-x-100 origin-left transition-transform duration-300"></span>
                    )}
                  </button>
                </div>
                
                <div className="min-h-[120px]">
                  {activeTab === 'description' && (
                    <div className="animate-in fade-in duration-700">
                      <p className="text-gray-600 leading-relaxed font-light text-[15px]">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Minimal Trust Indicators */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200">
                 <div className="group">
                   <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center mb-4 group-hover:border-gray-900 transition-colors duration-500">
                     <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                   </div>
                   <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-1">Globally Shipped</h4>
                   <p className="text-xs text-gray-500 font-light">Complimentary on all orders</p>
                 </div>
                 <div className="group">
                   <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center mb-4 group-hover:border-gray-900 transition-colors duration-500">
                     <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                   </div>
                   <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-1">Easy Returns</h4>
                   <p className="text-xs text-gray-500 font-light">30-day hassle-free policy</p>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Fullscreen Overlay */}
      {isFullscreen && allImages.length > 0 && (
        <div 
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center cursor-zoom-out animate-in fade-in duration-500"
          onClick={closeFullscreen}
        >
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-900 p-4 hover:scale-110 transition-transform duration-300 z-[110]"
            onClick={closeFullscreen}
          >
            <span className="sr-only">Close</span>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {allImages.length > 1 && (
            <button 
              className="absolute left-4 md:left-12 text-gray-900 p-4 hover:-translate-x-2 transition-transform duration-300 z-[110]"
              onClick={prevImage}
            >
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}

          <div className="w-full max-w-5xl h-full max-h-[90vh] p-8 md:p-16 flex items-center justify-center">
            <img 
              src={allImages[fullscreenIndex]} 
              alt={`${product.name} Fullscreen`} 
              className="w-full h-full object-contain cursor-auto drop-shadow-2xl animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>

          {allImages.length > 1 && (
            <button 
              className="absolute right-4 md:right-12 text-gray-900 p-4 hover:translate-x-2 transition-transform duration-300 z-[110]"
              onClick={nextImage}
            >
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
          
          {/* Minimal pagination dots indicator */}
          {allImages.length > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-[110]">
              {allImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 transition-all duration-300 ${
                    idx === fullscreenIndex ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
