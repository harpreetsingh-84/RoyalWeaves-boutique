import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useState, useEffect } from 'react';

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  
  const product = products.find(p => p._id === id);
  const [fullscreenIndex, setFullscreenIndex] = useState<number>(-1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fafafa]">
        <div className="text-center animate-pulse text-xl font-light text-gray-400 tracking-widest uppercase">Loading Product...</div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.gallery || [])];
  const isFullscreen = fullscreenIndex >= 0;

  const handleOpenFullscreen = () => {
    const idx = allImages.indexOf(mainImage);
    setFullscreenIndex(idx >= 0 ? idx : 0);
  };
  const closeFullscreen = () => setFullscreenIndex(-1);
  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); setFullscreenIndex((prev) => (prev - 1 + allImages.length) % allImages.length); };
  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); setFullscreenIndex((prev) => (prev + 1) % allImages.length); };
  const handleAddToCart = () => { addToCart(product); };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-accent selection:text-white pb-32">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 hover:text-gray-900 transition-all duration-300"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> 
          Back to Collection
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Image Viewer */}
          <div className={`w-full lg:w-[50%] flex flex-col gap-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Primary Viewing Area */}
            <div 
              className="w-full aspect-[4/5] sm:aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200 cursor-zoom-in group relative"
              onClick={handleOpenFullscreen}
            >
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s] ease-out"
              />
              
              {/* Expand Indicator */}
              <div className="absolute inset-x-0 bottom-0 pb-6 pt-12 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center pointer-events-none">
                <span className="bg-white/90 text-gray-900 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                   Expand
                </span>
              </div>

              {/* Native Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hover:!scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = allImages.indexOf(mainImage);
                      setMainImage(allImages[(currentIndex - 1 + allImages.length) % allImages.length]);
                    }}
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hover:!scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = allImages.indexOf(mainImage);
                      setMainImage(allImages[(currentIndex + 1) % allImages.length]);
                    }}
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Carousel */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                {allImages.map((img: string, index: number) => (
                  <button 
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${mainImage === img ? 'border-gray-900 shadow-md transform -translate-y-1' : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Product Information */}
          <div className="w-full lg:w-[50%]">
            <div className={`sticky top-24 flex flex-col transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-sm">New</span>
                <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest rounded-sm">{product.category}</span>
              </div>

              {/* Title & Price - Reduced Font Sizes */}
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                {product.name}
              </h1>
              
              <p className="text-2xl sm:text-3xl text-gray-500 font-medium tracking-tight mb-8">
                ${product.price.toFixed(2)}
              </p>

              {/* Action Button */}
              <button 
                onClick={handleAddToCart}
                className="w-full relative group overflow-hidden bg-gray-900 text-white py-5 rounded-xl mb-10 shadow-lg shadow-gray-900/10 active:scale-[0.98] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-accent translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 text-sm font-bold tracking-widest uppercase">
                  Add to Cart
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </button>

              {/* Accordion / Tabs */}
              <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mb-8">
                <div className="flex border-b border-gray-200">
                  <button onClick={() => setActiveTab('description')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'description' ? 'text-gray-900 bg-gray-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>Description</button>
                  <div className="w-px bg-gray-200"></div>
                  <button onClick={() => setActiveTab('details')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'details' ? 'text-gray-900 bg-gray-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>Specifications</button>
                </div>
                
                <div className="p-6 min-h-[150px]">
                  {activeTab === 'description' && (
                    <p className="text-gray-600 leading-relaxed text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {product.description}
                    </p>
                  )}
                  {activeTab === 'details' && (
                    <ul className="space-y-4 text-sm text-gray-600 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <li className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500 font-medium">Origin</span> <span className="font-semibold text-gray-900">Imported</span></li>
                      <li className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500 font-medium">Care</span> <span className="font-semibold text-gray-900">Dry Clean Only</span></li>
                      <li className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500 font-medium">Authenticity</span> <span className="font-semibold text-gray-900">100% Guaranteed</span></li>
                      <li className="flex justify-between pb-2"><span className="text-gray-500 font-medium">SKU</span> <span className="font-bold text-gray-900 font-mono text-xs">{product._id.substring(0,8).toUpperCase()}</span></li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                   <div className="bg-emerald-50 p-2.5 rounded-full">
                     <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-gray-900">Free Shipping</p>
                     <p className="text-[10px] text-gray-500 mt-0.5">Global Included</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                   <div className="bg-blue-50 p-2.5 rounded-full">
                     <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-gray-900">Easy Returns</p>
                     <p className="text-[10px] text-gray-500 mt-0.5">30-Day Policy</p>
                   </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && allImages.length > 0 && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-8 cursor-zoom-out animate-in fade-in zoom-in-95 duration-300"
          onClick={closeFullscreen}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all z-[110]"
            onClick={closeFullscreen}
          >
            <svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {allImages.length > 1 && (
            <button 
              className="absolute left-2 md:left-8 text-white/70 hover:text-white p-3 md:p-5 rounded-full bg-white/10 hover:bg-white/20 transition-all z-[110]"
              onClick={prevImage}
            >
              <svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}

          <img 
            src={allImages[fullscreenIndex]} 
            alt={`${product.name} Fullscreen`} 
            className="w-full h-full object-contain cursor-auto"
            onClick={(e) => e.stopPropagation()} 
          />

          {allImages.length > 1 && (
            <button 
              className="absolute right-2 md:right-8 text-white/70 hover:text-white p-3 md:p-5 rounded-full bg-white/10 hover:bg-white/20 transition-all z-[110]"
              onClick={nextImage}
            >
              <svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
