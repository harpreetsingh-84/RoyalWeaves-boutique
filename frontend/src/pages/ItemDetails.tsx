import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useState, useEffect } from 'react';

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, formatPrice, isAuthenticated, requestLoginPrompt } = useShop();
  
  const product = products.find(p => p._id === id);
  const [fullscreenIndex, setFullscreenIndex] = useState<number>(-1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomStyles, setZoomStyles] = useState<React.CSSProperties>({});
  
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      const availableColor = product.colors.find(c => c.stock > 0);
      if (availableColor) {
        setSelectedColor(availableColor.color);
      } else {
        setSelectedColor(product.colors[0].color);
      }
    }
  }, [product]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedColor]);

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
      <div className="min-h-[80vh] flex items-center justify-center bg-darkBg">
        <div className="text-center animate-pulse text-sm font-medium text-secondaryAction tracking-[0.2em] uppercase">
          Curating details...
        </div>
      </div>
    );
  }

  let mainImage = product.image;
  let variantImages: string[] = [];

  if (selectedColor && product.colors) {
    const colorVariant = product.colors.find((c: any) => c.color === selectedColor);
    if (colorVariant && colorVariant.images && colorVariant.images.length > 0) {
      mainImage = colorVariant.images[0];
      variantImages = colorVariant.images;
    } else if (colorVariant && (colorVariant as any).image) {
      mainImage = (colorVariant as any).image;
      variantImages = [(colorVariant as any).image];
    }
  }

  const allImages = Array.from(new Set([mainImage, ...variantImages, ...(product.gallery || [])].filter(Boolean))) as string[];
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
  const handleAddToCart = () => { 
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }
    addToCart(product, selectedColor); 
    if (!isAuthenticated) {
      requestLoginPrompt('cart');
    }
  };

  let maxStockForDisplay = product?.quantity ?? 0;
  if (product && product.colors && product.colors.length > 0 && selectedColor) {
     const colorVar = product.colors.find((c: any) => c.color === selectedColor);
     if (colorVar) maxStockForDisplay = colorVar.stock;
  }

  return (
    <div className="min-h-screen bg-darkBg selection:bg-primaryAction selection:text-lightText pb-32 font-sans text-lightText">
      
      {/* Navigation Bar */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-xs font-semibold tracking-[0.15em] text-lightText/60 hover:text-secondaryAction transition-colors duration-500 uppercase"
        >
          <span className="w-8 h-[1px] bg-lightText/60 group-hover:bg-secondaryAction group-hover:w-12 transition-all duration-500"></span> 
          Back to Collection
        </button>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Premium Image Slider */}
          <div className={`w-full lg:w-[55%] flex flex-col gap-6 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            
            <div className="relative w-full premium-card !rounded-sm overflow-hidden group cursor-crosshair">
              {/* Primary Image Container */}
              <div 
                className="w-full aspect-[4/5] overflow-hidden bg-darkBg"
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
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-darkBg/90 backdrop-blur-sm border border-secondaryAction/20 text-lightText p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:text-primaryAction z-10"
                    onClick={prevImage}
                    aria-label="Previous Image"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-darkBg/90 backdrop-blur-sm border border-secondaryAction/20 text-lightText p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:text-primaryAction z-10"
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
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-secondaryAction shadow-[0_0_10px_rgba(46,196,182,0.8)]' : 'w-2 bg-secondaryAction/30'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Floating Expand Hint */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                <div className="bg-darkBg/80 backdrop-blur-sm p-3 rounded-full text-secondaryAction shadow-md border border-secondaryAction/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation (Mobile friendly horizontal swipe) */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2 mt-2 px-1">
                {allImages.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`snap-center relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden transition-all duration-500 ${
                      currentIndex === idx 
                        ? 'ring-2 ring-secondaryAction ring-offset-2 ring-offset-darkBg opacity-100' 
                        : 'opacity-40 hover:opacity-100 grayscale hover:grayscale-0'
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
                <span className="text-[10px] font-bold tracking-[0.2em] text-secondaryAction uppercase">
                  Boutique Exclusive
                </span>
                <div className="w-12 h-[1px] bg-secondaryAction/30"></div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-lightText uppercase">
                  {product.category}
                </span>
              </div>

              {/* Title with Playfair Display for luxury feel */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-lightText leading-[1.1] mb-6 drop-shadow-sm">
                {product.name}
              </h1>
              
              <p className="text-2xl font-light text-highlight/90 mb-6 font-serif italic flex items-center flex-wrap gap-4">
                {formatPrice(product.price)}
                <span className={`text-xs font-sans not-italic tracking-widest uppercase px-3 py-1.5 rounded-full ${
                  maxStockForDisplay <= 0 
                    ? 'text-primaryAction bg-primaryAction/10 font-bold border border-primaryAction/30' 
                    : maxStockForDisplay <= 5 
                      ? 'text-highlight bg-highlight/10 font-bold animate-pulse border border-highlight/30' 
                      : 'text-lightText bg-secondaryAction/20 font-medium'
                }`}>
                  {maxStockForDisplay <= 0 
                    ? 'Out of Stock' 
                    : maxStockForDisplay <= 5 
                      ? `Only ${maxStockForDisplay} left` 
                      : `${maxStockForDisplay} In Stock`}
                </span>
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold tracking-[0.15em] text-lightText uppercase">Select Color</span>
                    <span className="text-xs text-lightText/60">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c: any, idx: number) => {
                      const isSelected = selectedColor === c.color;
                      const isOutOfStock = c.stock <= 0;
                      return (
                        <button
                          key={idx}
                          onClick={() => !isOutOfStock && setSelectedColor(c.color)}
                          disabled={isOutOfStock}
                          className={`
                            px-6 py-3 text-xs font-bold uppercase tracking-widest border transition-all duration-300
                            ${isSelected ? 'border-primaryAction bg-primaryAction text-lightText shadow-[0_0_15px_rgba(231,29,54,0.4)]' : 'border-secondaryAction/30 text-lightText/60 hover:border-secondaryAction hover:text-secondaryAction'}
                            ${isOutOfStock ? 'opacity-40 cursor-not-allowed bg-darkBg/50 text-lightText/30 border-lightText/10 hover:border-lightText/10' : ''}
                          `}
                        >
                          {c.color} {isOutOfStock && '(Sold Out)'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Cart - Premium Button */}
              <button 
                onClick={handleAddToCart}
                disabled={maxStockForDisplay <= 0}
                className={`relative group overflow-hidden ${maxStockForDisplay > 0 ? 'bg-primaryAction shadow-[0_8px_30px_rgba(231,29,54,0.4)] hover:shadow-[0_8px_30px_rgba(231,29,54,0.6)]' : 'bg-lightText/20 cursor-not-allowed'} text-lightText w-full py-5 mb-12 shadow-2xl active:scale-[0.98] transition-all duration-500 block rounded-sm border border-transparent hover:border-white/20`}
              >
                <div className="absolute inset-0 bg-lightText/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                <span className="relative z-10 flex items-center justify-center gap-4 text-xs font-bold tracking-[0.2em] uppercase">
                  {maxStockForDisplay > 0 ? 'Add to Bag' : 'Sold Out'}
                  {maxStockForDisplay > 0 && (
                    <span className="group-hover:translate-x-2 transition-transform duration-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="w-full h-[1px] bg-secondaryAction/20 mb-8"></div>

              {/* Accordion / Tabs styled like a high-end spec sheet */}
              <div className="mb-12">
                <div className="flex gap-8 border-b border-secondaryAction/20 mb-8">
                  <button 
                    onClick={() => setActiveTab('description')} 
                    className={`pb-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 relative ${
                      activeTab === 'description' ? 'text-lightText' : 'text-lightText/50 hover:text-secondaryAction'
                    }`}
                  >
                    The Details
                    {activeTab === 'description' && (
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-secondaryAction scale-x-100 origin-left transition-transform duration-300 shadow-[0_0_10px_rgba(46,196,182,0.8)]"></span>
                    )}
                  </button>
                </div>
                
                <div className="min-h-[120px]">
                  {activeTab === 'description' && (
                    <div className="animate-in fade-in duration-700">
                      <p className="text-lightText/80 leading-relaxed font-light text-[15px]">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Minimal Trust Indicators */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-secondaryAction/20">
                 <div className="group">
                   <div className="w-10 h-10 border border-secondaryAction/30 rounded-full flex items-center justify-center mb-4 group-hover:border-secondaryAction transition-colors duration-500 bg-secondaryAction">
                     <svg className="w-4 h-4 text-secondaryAction" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                   </div>
                   <h4 className="text-[11px] font-bold text-lightText uppercase tracking-widest mb-1">Globally Shipped</h4>
                   <p className="text-xs text-lightText/60 font-light">Complimentary on all orders</p>
                 </div>
                 <div className="group">
                   <div className="w-10 h-10 border border-secondaryAction/30 rounded-full flex items-center justify-center mb-4 group-hover:border-secondaryAction transition-colors duration-500 bg-secondaryAction">
                     <svg className="w-4 h-4 text-secondaryAction" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                   </div>
                   <h4 className="text-[11px] font-bold text-lightText uppercase tracking-widest mb-1">Easy Returns</h4>
                   <p className="text-xs text-lightText/60 font-light">30-day hassle-free policy</p>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Fullscreen Overlay */}
      {isFullscreen && allImages.length > 0 && (
        <div 
          className="fixed inset-0 z-[100] bg-darkBg/95 backdrop-blur-xl flex items-center justify-center cursor-zoom-out animate-in fade-in duration-500"
          onClick={closeFullscreen}
        >
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 text-lightText p-4 hover:scale-110 hover:text-primaryAction transition-all duration-300 z-[110]"
            onClick={closeFullscreen}
          >
            <span className="sr-only">Close</span>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {allImages.length > 1 && (
            <button 
              className="absolute left-4 md:left-12 text-lightText hover:text-primaryAction p-4 hover:-translate-x-2 transition-all duration-300 z-[110]"
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
              className="absolute right-4 md:right-12 text-lightText hover:text-primaryAction p-4 hover:translate-x-2 transition-all duration-300 z-[110]"
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === fullscreenIndex ? 'w-8 bg-secondaryAction shadow-[0_0_10px_rgba(46,196,182,0.8)]' : 'w-2 bg-secondaryAction/40'
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
