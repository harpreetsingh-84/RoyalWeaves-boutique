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
  colors?: { color: string; stock: number; images?: string[] }[];
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
}

export interface User {
  name: string;
  email: string;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  isLoading: boolean;
  formatPrice: (price: number) => string;
  setIsAdmin: (val: boolean) => void;
  setIsAuthenticated: (val: boolean) => void;
  setUser: (val: User | null) => void;
  addToCart: (product: Product, color?: string) => void;
  removeFromCart: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  refreshProducts: () => void;
  verifyAuth: () => Promise<void>;
  loginPromptConfig: { isOpen: boolean; type: 'cart' | 'checkout' | null };
  requestLoginPrompt: (type: 'cart' | 'checkout') => void;
  closeLoginPrompt: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [loginPromptConfig, setLoginPromptConfig] = useState<{isOpen: boolean, type: 'cart' | 'checkout' | null}>({isOpen: false, type: null});

  const requestLoginPrompt = (type: 'cart' | 'checkout') => {
    // Basic logic to reduce annoyance: if 'cart', maybe check localStorage?
    // User requested "If user ignores popup multiple times: Reduce frequency of popup."
    if (type === 'cart') {
      const ignores = parseInt(localStorage.getItem('popupIgnores_cart') || '0', 10);
      // E.g., if ignored 3 times, show it only 1/3 of the time further on
      if (ignores > 3 && Math.random() > 0.3) {
        return; 
      }
    }
    setLoginPromptConfig({ isOpen: true, type });
  };

  const closeLoginPrompt = () => {
    if (loginPromptConfig.type === 'cart') {
      const ignores = parseInt(localStorage.getItem('popupIgnores_cart') || '0', 10);
      localStorage.setItem('popupIgnores_cart', (ignores + 1).toString());
    }
    setLoginPromptConfig({ isOpen: false, type: null });
  };

  const formatPrice = (price: number) => {
    if (!price) return '₹0.00';
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getProducts();
      if (!res.ok) throw new Error("Server returned non-ok status");
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
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
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        setIsAuthenticated(true);
        setIsAdmin(!!data.isAdmin);
        setUser(data.user || null);
        
        if (data.user && data.user.email) {
          const userCart = localStorage.getItem(`wovenwonder_cart_${data.user.email}`);
          if (userCart) {
            setCart(JSON.parse(userCart));
          }
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        clearCart();
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      clearCart();
    } finally {
      setIsAuthChecking(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    verifyAuth();
  }, []);

  // Persist cart to localStorage for specific user whenever it changes
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      localStorage.setItem(`wovenwonder_cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, isAuthenticated, user]);

  const refreshProducts = () => {
    fetchProducts();
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToCart = (product: Product, color?: string) => {
    if (!isAuthenticated) {
      alert("Please login to add items to your cart.");
      requestLoginPrompt('checkout');
      return;
    }

    let availableStock = product.quantity;
    if (color && product.colors) {
      const colorVariant = product.colors.find(c => c.color === color);
      if (colorVariant) {
        availableStock = colorVariant.stock;
      }
    }

    if (availableStock <= 0) {
      alert(color ? `This color variant is out of stock` : 'This product is out of stock');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find(item => item.product._id === product._id && item.color === color);
      if (existing) {
        if (existing.quantity >= availableStock) {
          alert(`Only ${availableStock} items available in stock`);
          return prevCart;
        }
        return prevCart.map(item =>
          (item.product._id === product._id && item.color === color) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1, color }];
    });
  };

  const removeFromCart = (productId: string, color?: string) => {
    setCart((prevCart) => prevCart.filter(item => !(item.product._id === productId && item.color === color)));
  };

  const updateQuantity = (productId: string, quantity: number, color?: string) => {
    if (quantity < 1) return;
    
    const product = products.find(p => p._id === productId);
    if (product) {
      let availableStock = product.quantity;
      if (color && product.colors) {
        const colorVariant = product.colors.find(c => c.color === color);
        if (colorVariant) {
          availableStock = colorVariant.stock;
        }
      }

      if (quantity > availableStock) {
        alert(`Only ${availableStock} items available in stock`);
        return;
      }
    }

    setCart((prevCart) => prevCart.map(item =>
      (item.product._id === productId && item.color === color) ? { ...item, quantity } : item
    ));
  };

  return (
    <ShopContext.Provider value={{ products, cart, user, isAdmin, isAuthenticated, isAuthChecking, isLoading, formatPrice, setIsAdmin, setIsAuthenticated, setUser, addToCart, removeFromCart, updateQuantity, clearCart, refreshProducts, verifyAuth, loginPromptConfig, requestLoginPrompt, closeLoginPrompt }}>
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
