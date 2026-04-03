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
  addToCart: (product: Product, color?: string) => void;
  removeFromCart: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
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
  const [user, setUser] = useState<User | null>(null);
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
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
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

  const addToCart = (product: Product, color?: string) => {
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
    <ShopContext.Provider value={{ products, cart, user, isAdmin, isAuthenticated, isAuthChecking, isLoading, formatPrice, setIsAdmin, setIsAuthenticated, addToCart, removeFromCart, updateQuantity, refreshProducts, verifyAuth }}>
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
