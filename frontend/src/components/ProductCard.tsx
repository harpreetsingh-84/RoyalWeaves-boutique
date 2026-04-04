import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop, Product } from '../context/ShopContext';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { formatPrice } = useShop();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Collect all unique images available for the product
  let allImages = [product.image];
  if (product.gallery && product.gallery.length > 0) {
    allImages = [...allImages, ...product.gallery];
  }
  if (product.colors) {
    product.colors.forEach(c => {
      if (c.images && c.images.length > 0) {
        allImages = [...allImages, ...c.images];
      } else if ((c as any).image) {
        allImages.push((c as any).image);
      }
    });
  }
  allImages = Array.from(new Set(allImages)).filter(Boolean);

  // Auto-slide effect
  useEffect(() => {
    let timer: any;
    // Animate every 5 seconds if there are multiple images and the user is NOT hovering
    if (allImages.length > 1 && !isHovered) {
      timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [allImages.length, isHovered]);

  return (
    <Link 
      to={`/item/${product._id}`} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-5 rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-500">
        
        {allImages.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`${product.name} - view ${idx + 1}`} 
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000 ease-in-out group-hover:scale-105 ${
              idx === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-6 group-hover:translate-y-0 z-20">
          <span className="bg-white/95 text-gray-900 px-8 py-3 rounded-sm font-semibold shadow-2xl text-xs tracking-widest uppercase">
            View Details
          </span>
        </div>
        
        {/* Render indicators if multiple images */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {allImages.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-500 ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} 
              />
            ))}
          </div>
        )}
      </div>
      <div className="px-1 text-center">
        <p className="text-gray-400 text-xs mb-2 uppercase tracking-widest font-medium">{product.category}</p>
        <h3 className="text-lg font-serif text-gray-900 mb-2 group-hover:text-accent transition-colors truncate">{product.name}</h3>
        <p className="font-medium text-gray-900 tracking-wide">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
