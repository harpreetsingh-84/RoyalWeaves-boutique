import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  gallery?: string[];
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  isAdmin: boolean;
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  isLoading: boolean;
  formatPrice: (price: number) => string;
  setIsAdmin: (val: boolean) => void;
  setIsAuthenticated: (val: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  refreshProducts: () => void;
  verifyAuth: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('wovenwonder_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const formatPrice = (price: number) => {
    if (!price) return '₹0.00';
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getProducts();
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAuth = async () => {
    try {
      const res = await apiService.verifyAuth();
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setIsAdmin(data.isAdmin);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
    } finally {
      setIsAuthChecking(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    verifyAuth();
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wovenwonder_cart', JSON.stringify(cart));
  }, [cart]);

  const refreshProducts = () => {
    fetchProducts();
  };

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) {
      alert('This product is out of stock');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find(item => item.product._id === product._id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          alert(`Only ${product.quantity} items available in stock`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const product = products.find(p => p._id === productId);
    if (product && quantity > product.quantity) {
      alert(`Only ${product.quantity} items available in stock`);
      return;
    }

    setCart((prevCart) => prevCart.map(item =>
      item.product._id === productId ? { ...item, quantity } : item
    ));
  };

  return (
    <ShopContext.Provider value={{ products, cart, isAdmin, isAuthenticated, isAuthChecking, isLoading, formatPrice, setIsAdmin, setIsAuthenticated, addToCart, removeFromCart, updateQuantity, refreshProducts, verifyAuth }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
