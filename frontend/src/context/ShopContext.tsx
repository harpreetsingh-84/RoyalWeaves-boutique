import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  gallery?: string[];
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products');
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
      const res = await fetch('http://localhost:5000/api/auth/verify', {
        credentials: 'include'
      });
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

  const refreshProducts = () => {
    fetchProducts();
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.product._id === product._id);
      if (existing) {
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
    setCart((prevCart) => prevCart.map(item =>
      item.product._id === productId ? { ...item, quantity } : item
    ));
  };

  return (
    <ShopContext.Provider value={{ products, cart, isAdmin, isAuthenticated, isAuthChecking, isLoading, setIsAdmin, setIsAuthenticated, addToCart, removeFromCart, updateQuantity, refreshProducts, verifyAuth }}>
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
